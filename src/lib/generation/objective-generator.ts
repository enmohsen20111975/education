/**
 * @module objective-generator
 * @description مولّد الأهداف التعليمية — يستدعي الذكاء الاصطناعي لتوليد أهداف
 * تعليمية قابلة للقياس باستخدام أفعال سلوكية واضحة.
 *
 * Objective generator — calls AI to generate measurable learning objectives
 * using clear action verbs.
 */

import { generateContent, TaskType } from '@/lib/ai';
import { db } from '@/lib/db';
import type { ObjectivePayload } from '@/lib/sync/sync-schema';
import { objectivesPrompt } from './prompts';

/** خيارات توليد الأهداف / Objective generation options */
export interface ObjectiveGenerateOptions {
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
  /** عدد الأهداف المطلوب / Number of objectives to generate */
  count?: number;
}

/** شكل بيانات الهدف من الذكاء الاصطناعي / Raw objective data from AI */
interface RawObjective {
  textAr?: string;
  textEn?: string;
}

/**
 * استخراج مصفوفة JSON من نص الذكاء الاصطناعي
 * Extracts a JSON array from AI response text
 */
function extractJsonArray(text: string): unknown[] {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // محاولة الاستخراج
  }

  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // تجاهل
    }
  }

  return [];
}

/**
 * التحقق من صحة بيانات الهدف
 * Validates an objective object
 */
function isValidObjective(o: unknown): o is RawObjective {
  if (!o || typeof o !== 'object') return false;
  const obj = o as Record<string, unknown>;
  return (
    typeof obj.textAr === 'string' && obj.textAr.trim().length > 0 &&
    typeof obj.textEn === 'string' && obj.textEn.trim().length > 0
  );
}

/**
 * توليد الأهداف التعليمية لدرس معيّن
 * Generates learning objectives for a given lesson
 *
 * @param lessonId معرّف الدرس / The lesson ID
 * @param options خيارات التوليد / Generation options
 * @returns مصفوفة من حمولات الأهداف / Array of objective payloads
 *
 * @example
 * ```ts
 * const objectives = await generateObjectives('lesson-123', { language: 'ar', count: 5 });
 * ```
 */
export async function generateObjectives(
  lessonId: string,
  options?: ObjectiveGenerateOptions
): Promise<ObjectivePayload[]> {
  const language = options?.language ?? 'ar';
  const count = options?.count ?? 5;

  // جلب بيانات الدرس من قاعدة البيانات
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: {
        include: {
          subject: {
            include: { academicYear: true },
          },
        },
      },
    },
  });

  if (!lesson) {
    throw new Error(`الدرس غير موجود: ${lessonId} / Lesson not found: ${lessonId}`);
  }

  const subject = language === 'ar' ? lesson.unit.subject.nameAr : lesson.unit.subject.nameEn;
  const grade = lesson.unit.subject.academicYear?.nameAr ?? '';
  const topic = language === 'ar' ? lesson.titleAr : lesson.titleEn;

  // بناء الأمر وإرساله إلى الذكاء الاصطناعي
  const prompt = objectivesPrompt({
    topic,
    subject,
    grade,
    language,
    count,
  });

  let rawItems: unknown[];

  try {
    const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
      language,
      temperature: 0.6,
      maxTokens: 3000,
    });
    rawItems = extractJsonArray(result.text);
  } catch {
    // التراجع: أمر أبسط
    const simplePrompt = language === 'ar'
      ? `أنت خبير في التخطيط التعليمي. أنشئ ${count} أهداف تعليمية لدرس "${topic}". أجب بـ JSON فقط:\n[{"textAr":"أن يعرّف الطالب...","textEn":"The student will define..."}]`
      : `You are an educational planning expert. Generate ${count} learning objectives for "${topic}". Respond with JSON only:\n[{"textAr":"أن يعرّف الطالب...","textEn":"The student will define..."}]`;

    try {
      const fallbackResult = await generateContent(TaskType.TEXT_GENERATION, simplePrompt, {
        language,
        temperature: 0.6,
        maxTokens: 3000,
      });
      rawItems = extractJsonArray(fallbackResult.text);
    } catch {
      return [];
    }
  }

  // التحقق من صحة كل هدف وبناء الحمولة
  const objectives: ObjectivePayload[] = [];

  for (const item of rawItems) {
    if (!isValidObjective(item)) continue;

    objectives.push({
      id: `objective-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      textAr: item.textAr.trim(),
      textEn: item.textEn.trim(),
      order: objectives.length + 1,
    });

    if (objectives.length >= count) break;
  }

  return objectives;
}