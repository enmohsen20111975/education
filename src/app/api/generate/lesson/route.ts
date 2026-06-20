/**
 * @route POST /api/generate/lesson
 * @description نقطة نهاية لتوليد محتوى درس واحد.
 * يُرسل معرّف الدرس وأنواع المحتوى المطلوبة ويُرجع حمولة المزامنة الكاملة.
 *
 * Endpoint to generate content for a single lesson.
 * Sends the lesson ID and requested content types, returns the complete sync payload.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateFullLessonContent } from '@/lib/generation';
import type { ContentType } from '@/lib/generation';

/** شكل طلب توليد درس / Lesson generation request body */
interface LessonGenerateRequest {
  /** معرّف الدرس / Lesson ID */
  lessonId: string;
  /** أنواع المحتوى المطلوبة / Requested content types */
  types?: ContentType[];
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
}

/** شكل استجابة توليد درس / Lesson generation response */
interface LessonGenerateResponse {
  /** هل نجحت العملية / Whether the operation succeeded */
  success: boolean;
  /** معرّف الدرس / Lesson ID */
  lessonId: string;
  /** حمولة المحتوى المُولَّد / Generated content payload */
  content: Record<string, unknown>;
  /** مدة التوليد بالمللي ثانية / Generation duration in ms */
  duration: number;
  /** رسالة خطأ (إن وُجدت) / Error message (if any) */
  error?: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // قراءة وتحليل الطلب
    const body = (await request.json()) as Partial<LessonGenerateRequest>;
    const { lessonId, types, language } = body;

    // التحقق من المعلمات المطلوبة
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json<LessonGenerateResponse>(
        {
          success: false,
          lessonId: lessonId ?? '',
          content: {},
          duration: Date.now() - startTime,
          error: 'معرّف الدرس مطلوب / lessonId is required',
        },
        { status: 400 }
      );
    }

    // التحقق من صحة اللغة
    if (language && language !== 'ar' && language !== 'en') {
      return NextResponse.json<LessonGenerateResponse>(
        {
          success: false,
          lessonId,
          content: {},
          duration: Date.now() - startTime,
          error: 'اللغة يجب أن تكون "ar" أو "en" / language must be "ar" or "en"',
        },
        { status: 400 }
      );
    }

    // توليد المحتوى
    const content = await generateFullLessonContent(lessonId, {
      language: language ?? 'ar',
      types,
    });

    // بناء الإحصائيات
    const stats: { type: string; count: number }[] = [];
    if (content.concepts?.length) stats.push({ type: 'concepts', count: content.concepts.length });
    if (content.formulas?.length) stats.push({ type: 'formulas', count: content.formulas.length });
    if (content.examples?.length) stats.push({ type: 'examples', count: content.examples.length });
    if (content.objectives?.length) stats.push({ type: 'objectives', count: content.objectives.length });
    if (content.questions?.length) stats.push({ type: 'questions', count: content.questions.length });

    return NextResponse.json<LessonGenerateResponse & { stats: { type: string; count: number }[] }>(
      {
        success: true,
        lessonId,
        content: content as unknown as Record<string, unknown>,
        stats,
        duration: Date.now() - startTime,
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    return NextResponse.json<LessonGenerateResponse>(
      {
        success: false,
        lessonId: '',
        content: {},
        duration: Date.now() - startTime,
        error: `فشل توليد المحتوى: ${msg} / Content generation failed: ${msg}`,
      },
      { status: 500 }
    );
  }
}