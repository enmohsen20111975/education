/**
 * @module batch-generator
 * @description مولّد الدفعات — يولّد محتوى لعدة دروس بشكل متسلسل مع
 * تتبع التقدم والتعافي من الأخطاء (تخطي الدرس الفاشل والمتابعة).
 *
 * Batch generator — generates content for multiple lessons sequentially
 * with progress tracking and error recovery (skip failed, continue).
 */

import type { LessonSyncPayload } from '@/lib/sync/sync-schema';
import { generateFullLessonContent } from './lesson-generator';
import type { ContentType } from './lesson-generator';
import type { QuestionType } from './question-generator';

/** خيارات توليد الدفعات / Batch generation options */
export interface BatchGenerateOptions {
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
  /** أنواع المحتوى المطلوب توليدها / Content types to generate */
  types?: ContentType[];
  /** أنواع الأسئلة / Question types */
  questionTypes?: QuestionType[];
  /** مستوى صعوبة الأسئلة / Question difficulty */
  questionDifficulty?: 'easy' | 'medium' | 'hard';
  /** عدد المفاهيم لكل درس / Number of concepts per lesson */
  conceptCount?: number;
  /** عدد الصيغ لكل درس / Number of formulas per lesson */
  formulaCount?: number;
  /** عدد الأمثلة لكل درس / Number of examples per lesson */
  exampleCount?: number;
  /** عدد الأسئلة لكل درس / Number of questions per lesson */
  questionCount?: number;
  /** عدد الأهداف لكل درس / Number of objectives per lesson */
  objectiveCount?: number;
  /** دالة تتبع التقدم / Progress tracking callback */
  onProgress?: (current: number, total: number, lessonId: string) => void;
}

/**
 * توليد المحتوى لعدة دروس بشكل متسلسل
 * Generates content for multiple lessons sequentially
 *
 * يعالج كل درس على حدة — إذا فشل درس معيّن يُسجَّل الخطأ ويُتخطّى.
 * يُرجع خريطة بنتائج كل درس.
 *
 * @param lessonIds قائمة معرّفات الدروس / List of lesson IDs
 * @param options خيارات التوليد / Generation options
 * @returns خريطة معرّف الدرس ← حمولة المزامنة / Map of lessonId → sync payload
 *
 * @example
 * ```ts
 * const results = await batchGenerateLessons(['id1', 'id2', 'id3'], {
 *   language: 'ar',
 *   types: ['concepts', 'questions'],
 *   onProgress: (current, total, id) => console.log(`${current}/${total}: ${id}`),
 * });
 * for (const [id, payload] of results) {
 *   console.log(id, payload.concepts?.length ?? 0, 'concepts');
 * }
 * ```
 */
export async function batchGenerateLessons(
  lessonIds: string[],
  options?: BatchGenerateOptions
): Promise<Map<string, LessonSyncPayload>> {
  const results = new Map<string, LessonSyncPayload>();
  const total = lessonIds.length;

  for (let i = 0; i < total; i++) {
    const lessonId = lessonIds[i];

    // إبلاغ عن التقدم
    options?.onProgress?.(i + 1, total, lessonId);

    try {
      const payload = await generateFullLessonContent(lessonId, {
        language: options?.language,
        types: options?.types,
        questionTypes: options?.questionTypes,
        questionDifficulty: options?.questionDifficulty,
        conceptCount: options?.conceptCount,
        formulaCount: options?.formulaCount,
        exampleCount: options?.exampleCount,
        questionCount: options?.questionCount,
        objectiveCount: options?.objectiveCount,
      });
      results.set(lessonId, payload);
    } catch (error) {
      // تسجيل الدرس الفاشل مع حمولة فارغة
      const msg = error instanceof Error ? error.message : String(error);
      console.error(
        `[batch-generator] فشل توليد محتوى الدرس ${lessonId}: ${msg}\n` +
        `[batch-generator] Failed to generate content for lesson ${lessonId}: ${msg}`
      );
      results.set(lessonId, { lessonId });
    }
  }

  return results;
}