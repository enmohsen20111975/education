/**
 * @module concept-generator
 * @description مولّد المفاهيم والتعريفات — يستدعي الذكاء الاصطناعي لتوليد مفاهيم تعليمية
 * مع التحقق من الصحة والتراجع إلى أمر أبسط عند الفشل.
 *
 * Concept generator — calls AI to generate educational concepts
 * with validation and fallback to a simpler prompt on failure.
 */

import { generateContent, TaskType } from '@/lib/ai';
import { db } from '@/lib/db';
import type { ConceptPayload } from '@/lib/sync/sync-schema';
import { conceptsPrompt } from './prompts';

/** خيارات توليد المفاهيم / Concept generation options */
export interface ConceptGenerateOptions {
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
  /** عدد المفاهيم المطلوب / Number of concepts to generate */
  count?: number;
}

/** شكل بيانات المفهوم من الذكاء الاصطناعي / Raw concept data from AI */
interface RawConcept {
  termAr?: string;
  termEn?: string;
  definitionAr?: string;
  definitionEn?: string;
}

/**
 * التحقق من صحة بيانات المفهوم
 * Validates a concept object
 */
function isValidConcept(c: unknown): c is RawConcept {
  if (!c || typeof c !== 'object') return false;
  const obj = c as Record<string, unknown>;
  return (
    typeof obj.termAr === 'string' && obj.termAr.trim().length > 0 &&
    typeof obj.termEn === 'string' && obj.termEn.trim().length > 0 &&
    typeof obj.definitionAr === 'string' && obj.definitionAr.trim().length > 0 &&
    typeof obj.definitionEn === 'string' && obj.definitionEn.trim().length > 0
  );
}

/**
 * استخراج مصفوفة JSON من نص الذكاء الاصطناعي
 * Extracts a JSON array from AI response text
 */
function extractJsonArray(text: string): unknown[] {
  // محاولة تحليل النص مباشرة
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // تجاهل — سنحاول الاستخراج
  }

  // البحث عن مصفوفة JSON في النص
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
 * توليد المفاهيم والتعريفات لدروس معيّن
 * Generates concepts and definitions for a given lesson
 *
 * @param lessonId معرّف الدرس / The lesson ID
 * @param options خيارات التوليد / Generation options
 * @returns مصفوفة من حمولات المفاهيم / Array of concept payloads
 *
 * @example
 * ```ts
 * const concepts = await generateConcepts('lesson-123', { language: 'ar', count: 8 });
 * ```
 */
export async function generateConcepts(
  lessonId: string,
  options?: ConceptGenerateOptions
): Promise<ConceptPayload[]> {
  const language = options?.language ?? 'ar';
  const count = options?.count ?? 6;

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

  // جلب المفاهيم الموجودة لتجنب التكرار
  const existingConcepts = await db.concept.findMany({
    where: { lessonId },
    select: { termAr: true, termEn: true },
  });
  const existingTerms = existingConcepts.map(c => language === 'ar' ? c.termAr : c.termEn);

  // بناء الأمر وإرساله إلى الذكاء الاصطناعي
  const prompt = conceptsPrompt({
    topic,
    subject,
    grade,
    language,
    existingConcepts: existingTerms,
    count,
  });

  let rawItems: unknown[];

  try {
    // المحاولة الأولى: الأمر الكامل
    const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
      language,
      temperature: 0.7,
      maxTokens: 4000,
    });
    rawItems = extractJsonArray(result.text);
  } catch {
    // التراجع: أمر أبسط
    const simplePrompt = language === 'ar'
      ? `أنت معلم خبير. أنشئ ${count} مفاهيم وتعريفات لدرس "${topic}" في مادة "${subject}". أجب بـ JSON فقط:\n[{"termAr":"...","termEn":"...","definitionAr":"...","definitionEn":"..."}]`
      : `You are an expert teacher. Generate ${count} concepts and definitions for the lesson "${topic}" in "${subject}". Respond with JSON only:\n[{"termAr":"...","termEn":"...","definitionAr":"...","definitionEn":"..."}]`;

    try {
      const fallbackResult = await generateContent(TaskType.FAST_CLASSIFICATION, simplePrompt, {
        language,
        temperature: 0.7,
        maxTokens: 4000,
      });
      rawItems = extractJsonArray(fallbackResult.text);
    } catch {
      // كلا المحاولتين فشلتا
      return [];
    }
  }

  // التحقق من صحة كل مفهوم وبناء الحمولة
  const concepts: ConceptPayload[] = [];

  for (const item of rawItems) {
    if (!isValidConcept(item)) continue;

    concepts.push({
      id: `concept-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      termAr: item.termAr.trim(),
      termEn: item.termEn.trim(),
      definitionAr: item.definitionAr.trim(),
      definitionEn: item.definitionEn.trim(),
      order: concepts.length + 1,
    });

    if (concepts.length >= count) break;
  }

  return concepts;
}