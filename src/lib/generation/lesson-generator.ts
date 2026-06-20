/**
 * @module lesson-generator
 * @description المولّد الرئيسي — يولّد جميع أنواع المحتوى لدرس واحد بشكل متسلسل
 * (ليس بالتوازي بسبب قيود GPU) مع تتبع التقدم ومعالجة الأخطاء الجزئية.
 *
 * Master generator — generates ALL content types for a single lesson sequentially
 * (not in parallel due to GPU constraints) with progress tracking and partial failure handling.
 */

import type { LessonSyncPayload } from '@/lib/sync/sync-schema';
import { generateConcepts } from './concept-generator';
import { generateFormulas } from './formula-generator';
import { generateExamples } from './example-generator';
import { generateQuestions } from './question-generator';
import type { QuestionType } from './question-generator';
import { generateObjectives } from './objective-generator';

/** أنواع المحتوى القابلة للتوليد / Content types available for generation */
export type ContentType = 'concepts' | 'formulas' | 'examples' | 'questions' | 'objectives';

/** جميع أنواع المحتوى الافتراضية / Default all content types */
export const ALL_CONTENT_TYPES: ContentType[] = [
  'concepts',
  'formulas',
  'examples',
  'questions',
  'objectives',
];

/** خيارات توليد الدرس الكامل / Full lesson generation options */
export interface LessonGenerateOptions {
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
  /** أنواع المحتوى المطلوب توليدها / Content types to generate */
  types?: ContentType[];
  /** أنواع الأسئلة (عند تضمين الأسئلة) / Question types (when questions included) */
  questionTypes?: QuestionType[];
  /** مستوى صعوبة الأسئلة / Question difficulty level */
  questionDifficulty?: 'easy' | 'medium' | 'hard';
  /** عدد المفاهيم / Number of concepts */
  conceptCount?: number;
  /** عدد الصيغ / Number of formulas */
  formulaCount?: number;
  /** عدد الأمثلة / Number of examples */
  exampleCount?: number;
  /** عدد الأسئلة / Number of questions */
  questionCount?: number;
  /** عدد الأهداف / Number of objectives */
  objectiveCount?: number;
  /** دالة تتبع التقدم / Progress tracking callback */
  onProgress?: (type: string, status: string) => void;
}

/**
 * توليد جميع محتويات درس واحد
 * Generates ALL content types for a single lesson
 *
 * يُولّد المحتوى بشكل متسلسل (ليس بالتوازي) بسبب قيود GPU.
 * يتجاوز أنواع المحتوى التي تفشل ويُكمل الباقي.
 *
 * @param lessonId معرّف الدرس / The lesson ID
 * @param options خيارات التوليد / Generation options
 * @returns حمولة مزامنة كاملة للدرس / Complete lesson sync payload
 *
 * @example
 * ```ts
 * const payload = await generateFullLessonContent('lesson-123', {
 *   language: 'ar',
 *   types: ['concepts', 'questions'],
 *   onProgress: (type, status) => console.log(`${type}: ${status}`),
 * });
 * ```
 */
export async function generateFullLessonContent(
  lessonId: string,
  options?: LessonGenerateOptions
): Promise<LessonSyncPayload> {
  const language = options?.language ?? 'ar';
  const types = options?.types ?? ALL_CONTENT_TYPES;
  const onProgress = options?.onProgress;

  const payload: LessonSyncPayload = { lessonId };

  // ─── المفاهيم والتعريفات / Concepts & Definitions ───
  if (types.includes('concepts')) {
    try {
      onProgress?.('concepts', 'generating');
      payload.concepts = await generateConcepts(lessonId, {
        language,
        count: options?.conceptCount,
      });
      onProgress?.('concepts', `done (${payload.concepts.length} items)`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onProgress?.('concepts', `failed: ${msg}`);
      payload.concepts = [];
    }
  }

  // ─── القوانين والصيغ / Formulas ───
  if (types.includes('formulas')) {
    try {
      onProgress?.('formulas', 'generating');
      payload.formulas = await generateFormulas(lessonId, {
        language,
        count: options?.formulaCount,
      });
      onProgress?.('formulas', `done (${payload.formulas.length} items)`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onProgress?.('formulas', `failed: ${msg}`);
      payload.formulas = [];
    }
  }

  // ─── الأمثلة التوضيحية / Worked Examples ───
  if (types.includes('examples')) {
    try {
      onProgress?.('examples', 'generating');
      payload.examples = await generateExamples(lessonId, {
        language,
        count: options?.exampleCount,
      });
      onProgress?.('examples', `done (${payload.examples.length} items)`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onProgress?.('examples', `failed: ${msg}`);
      payload.examples = [];
    }
  }

  // ─── الأهداف التعليمية / Learning Objectives ───
  if (types.includes('objectives')) {
    try {
      onProgress?.('objectives', 'generating');
      payload.objectives = await generateObjectives(lessonId, {
        language,
        count: options?.objectiveCount,
      });
      onProgress?.('objectives', `done (${payload.objectives.length} items)`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onProgress?.('objectives', `failed: ${msg}`);
      payload.objectives = [];
    }
  }

  // ─── الأسئلة / Questions ───
  if (types.includes('questions')) {
    try {
      onProgress?.('questions', 'generating');
      payload.questions = await generateQuestions(lessonId, {
        language,
        types: options?.questionTypes,
        count: options?.questionCount,
        difficulty: options?.questionDifficulty,
      });
      onProgress?.('questions', `done (${payload.questions.length} items)`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onProgress?.('questions', `failed: ${msg}`);
      payload.questions = [];
    }
  }

  return payload;
}