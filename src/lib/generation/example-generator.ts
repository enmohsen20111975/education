/**
 * @module example-generator
 * @description مولّد الأمثلة التوضيحية — يستدعي الذكاء الاصطناعي لتوليد أمثلة محلولة
 * بخطوات واضحة ومناسبة لمستوى الطالب.
 *
 * Example generator — calls AI to generate worked examples
 * with clear steps appropriate for the student level.
 */

import { generateContent, TaskType } from '@/lib/ai';
import { db } from '@/lib/db';
import type { ExamplePayload } from '@/lib/sync/sync-schema';
import { examplesPrompt } from './prompts';

/** خيارات توليد الأمثلة / Example generation options */
export interface ExampleGenerateOptions {
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
  /** عدد الأمثلة المطلوب / Number of examples to generate */
  count?: number;
}

/** شكل بيانات المثال من الذكاء الاصطناعي / Raw example data from AI */
interface RawExample {
  questionAr?: string;
  questionEn?: string;
  solutionAr?: string;
  solutionEn?: string;
  stepsAr?: string;
  stepsEn?: string;
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
 * التحقق من صحة بيانات المثال
 * Validates an example object
 */
function isValidExample(e: unknown): e is RawExample {
  if (!e || typeof e !== 'object') return false;
  const obj = e as Record<string, unknown>;
  return (
    typeof obj.questionAr === 'string' && obj.questionAr.trim().length > 0 &&
    typeof obj.questionEn === 'string' && obj.questionEn.trim().length > 0 &&
    typeof obj.solutionAr === 'string' && obj.solutionAr.trim().length > 0 &&
    typeof obj.solutionEn === 'string' && obj.solutionEn.trim().length > 0 &&
    typeof obj.stepsAr === 'string' && obj.stepsAr.trim().length > 0 &&
    typeof obj.stepsEn === 'string' && obj.stepsEn.trim().length > 0
  );
}

/**
 * توليد أمثلة توضيحية لدرس معيّن
 * Generates worked examples for a given lesson
 *
 * @param lessonId معرّف الدرس / The lesson ID
 * @param options خيارات التوليد / Generation options
 * @returns مصفوفة من حمولات الأمثلة / Array of example payloads
 *
 * @example
 * ```ts
 * const examples = await generateExamples('lesson-123', { language: 'ar', count: 3 });
 * ```
 */
export async function generateExamples(
  lessonId: string,
  options?: ExampleGenerateOptions
): Promise<ExamplePayload[]> {
  const language = options?.language ?? 'ar';
  const count = options?.count ?? 3;

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
  const prompt = examplesPrompt({
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
      temperature: 0.7,
      maxTokens: 6000,
    });
    rawItems = extractJsonArray(result.text);
  } catch {
    // التراجع: أمر أبسط
    const simplePrompt = language === 'ar'
      ? `أنت معلم خبير. أنشئ ${count} أمثلة محلولة لدرس "${topic}". كل مثال يحتوي سؤال وحل وخطوات. أجب بـ JSON فقط:\n[{"questionAr":"...","questionEn":"...","solutionAr":"...","solutionEn":"...","stepsAr":"الخطوة 1:\\nالخطوة 2:","stepsEn":"Step 1:\\nStep 2:"}]`
      : `You are an expert teacher. Generate ${count} worked examples for "${topic}". Each example needs a question, solution, and steps. Respond with JSON only:\n[{"questionAr":"...","questionEn":"...","solutionAr":"...","solutionEn":"...","stepsAr":"الخطوة 1:\\nالخطوة 2:","stepsEn":"Step 1:\\nStep 2:"}]`;

    try {
      const fallbackResult = await generateContent(TaskType.TEXT_GENERATION, simplePrompt, {
        language,
        temperature: 0.7,
        maxTokens: 6000,
      });
      rawItems = extractJsonArray(fallbackResult.text);
    } catch {
      return [];
    }
  }

  // التحقق من صحة كل مثال وبناء الحمولة
  const examples: ExamplePayload[] = [];

  for (const item of rawItems) {
    if (!isValidExample(item)) continue;

    examples.push({
      id: `example-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      questionAr: item.questionAr.trim(),
      questionEn: item.questionEn.trim(),
      solutionAr: item.solutionAr.trim(),
      solutionEn: item.solutionEn.trim(),
      stepsAr: item.stepsAr.trim(),
      stepsEn: item.stepsEn.trim(),
      order: examples.length + 1,
    });

    if (examples.length >= count) break;
  }

  return examples;
}