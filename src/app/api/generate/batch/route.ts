/**
 * @route POST /api/generate/batch
 * @description نقطة نهاية لتوليد محتوى عدة دروس دفعة واحدة.
 * يعالج الدروس بشكل متسلسل ويتخطى الدروس الفاشلة.
 *
 * Endpoint to generate content for multiple lessons in batch.
 * Processes lessons sequentially and skips failed ones.
 */

import { NextRequest, NextResponse } from 'next/server';
import { batchGenerateLessons } from '@/lib/generation';
import type { ContentType } from '@/lib/generation';

/** شكل طلب توليد الدفعات / Batch generation request body */
interface BatchGenerateRequest {
  /** قائمة معرّفات الدروس / List of lesson IDs */
  lessonIds: string[];
  /** أنواع المحتوى المطلوبة / Requested content types */
  types?: ContentType[];
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
}

/** نتيجة درس واحد في الدفعة / Single lesson result in batch */
interface BatchLessonResult {
  /** معرّف الدرس / Lesson ID */
  lessonId: string;
  /** حالة التوليد / Generation status */
  status: 'success' | 'failed';
  /** عدد العناصر المُولَّدة / Number of generated items */
  itemCount?: number;
  /** رسالة خطأ (إن وُجدت) / Error message (if any) */
  error?: string;
}

/** شكل استجابة توليد الدفعات / Batch generation response */
interface BatchGenerateResponse {
  /** هل نجحت العملية (جزئيًا أو كليًا) / Whether the operation succeeded (partially or fully) */
  success: boolean;
  /** نتائج كل درس / Results for each lesson */
  results: BatchLessonResult[];
  /** إجمالي مدة التوليد بالمللي ثانية / Total generation duration in ms */
  totalDuration: number;
  /** رسالة خطأ عامة (إن وُجدت) / General error message (if any) */
  error?: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // قراءة وتحليل الطلب
    const body = (await request.json()) as Partial<BatchGenerateRequest>;
    const { lessonIds, types, language } = body;

    // التحقق من وجود قائمة الدروس
    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json<BatchGenerateResponse>(
        {
          success: false,
          results: [],
          totalDuration: Date.now() - startTime,
          error: 'قائمة معرّفات الدروس مطلوبة ولا يجب أن تكون فارغة / lessonIds is required and must not be empty',
        },
        { status: 400 }
      );
    }

    // التحقق من ألا تتجاوز القائمة الحد الأقصى
    if (lessonIds.length > 50) {
      return NextResponse.json<BatchGenerateResponse>(
        {
          success: false,
          results: [],
          totalDuration: Date.now() - startTime,
          error: 'الحد الأقصى 50 درس في الدفعة الواحدة / Maximum 50 lessons per batch',
        },
        { status: 400 }
      );
    }

    // التحقق من صحة اللغة
    if (language && language !== 'ar' && language !== 'en') {
      return NextResponse.json<BatchGenerateResponse>(
        {
          success: false,
          results: [],
          totalDuration: Date.now() - startTime,
          error: 'اللغة يجب أن تكون "ar" أو "en" / language must be "ar" or "en"',
        },
        { status: 400 }
      );
    }

    // توليد المحتوى للدفعات
    const payloadMap = await batchGenerateLessons(lessonIds, {
      language: language ?? 'ar',
      types,
    });

    // بناء نتائج كل درس
    const results: BatchLessonResult[] = [];
    let anySuccess = false;

    for (const [id, payload] of payloadMap) {
      // حساب إجمالي العناصر
      const itemCount =
        (payload.concepts?.length ?? 0) +
        (payload.formulas?.length ?? 0) +
        (payload.examples?.length ?? 0) +
        (payload.objectives?.length ?? 0) +
        (payload.questions?.length ?? 0);

      const isSuccess = itemCount > 0;
      if (isSuccess) anySuccess = true;

      results.push({
        lessonId: id,
        status: isSuccess ? 'success' : 'failed',
        itemCount: isSuccess ? itemCount : undefined,
        error: isSuccess ? undefined : 'لم يتم توليد أي محتوى / No content was generated',
      });
    }

    return NextResponse.json<BatchGenerateResponse>(
      {
        success: anySuccess,
        results,
        totalDuration: Date.now() - startTime,
      },
      { status: anySuccess ? 200 : 207 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    return NextResponse.json<BatchGenerateResponse>(
      {
        success: false,
        results: [],
        totalDuration: Date.now() - startTime,
        error: `فشل توليد الدفعة: ${msg} / Batch generation failed: ${msg}`,
      },
      { status: 500 }
    );
  }
}