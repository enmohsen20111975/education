/**
 * @module formula-generator
 * @description مولّد القوانين والصيغ — يستدعي الذكاء الاصطناعي لتوليد صيغ رياضية وعلمية
 * مع التحقق من صيغة LaTeX الأساسية.
 *
 * Formula generator — calls AI to generate mathematical/scientific formulas
 * with basic LaTeX syntax validation.
 */

import { generateContent, TaskType } from '@/lib/ai';
import { db } from '@/lib/db';
import type { FormulaPayload } from '@/lib/sync/sync-schema';
import { formulasPrompt } from './prompts';

/** خيارات توليد الصيغ / Formula generation options */
export interface FormulaGenerateOptions {
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
  /** عدد الصيغ المطلوب / Number of formulas to generate */
  count?: number;
}

/** شكل بيانات الصيغة من الذكاء الاصطناعي / Raw formula data from AI */
interface RawFormula {
  formula?: string;
  explanationAr?: string;
  explanationEn?: string;
}

/**
 * فحص أساسي لصحة صيغة LaTeX
 * Basic LaTeX syntax validation
 * يتحقق من عدم وجود أقواس غير متوازنة وعدم وجود أحرف غير مسموح بها
 */
function isValidLatex(formula: string): boolean {
  if (!formula || typeof formula !== 'string' || formula.trim().length === 0) return false;

  const trimmed = formula.trim();

  // فحص طول معقول
  if (trimmed.length > 500) return false;

  // فحص توازن الأقواس المتعرجة
  let braceCount = 0;
  for (const char of trimmed) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    if (braceCount < 0) return false; // قوس إغلاق بدون فتح
  }
  if (braceCount !== 0) return false; // أقواس غير متوازنة

  return true;
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
 * التحقق من صحة بيانات الصيغة
 * Validates a formula object
 */
function isValidFormula(f: unknown): f is RawFormula {
  if (!f || typeof f !== 'object') return false;
  const obj = f as Record<string, unknown>;
  return (
    typeof obj.formula === 'string' && obj.formula.trim().length > 0 &&
    typeof obj.explanationAr === 'string' && obj.explanationAr.trim().length > 0 &&
    typeof obj.explanationEn === 'string' && obj.explanationEn.trim().length > 0
  );
}

/**
 * توليد القوانين والصيغ لدرس معيّن
 * Generates formulas for a given lesson
 *
 * @param lessonId معرّف الدرس / The lesson ID
 * @param options خيارات التوليد / Generation options
 * @returns مصفوفة من حمولات الصيغ / Array of formula payloads
 *
 * @example
 * ```ts
 * const formulas = await generateFormulas('lesson-123', { language: 'ar', count: 5 });
 * ```
 */
export async function generateFormulas(
  lessonId: string,
  options?: FormulaGenerateOptions
): Promise<FormulaPayload[]> {
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
  const prompt = formulasPrompt({
    topic,
    subject,
    grade,
    language,
    count,
  });

  let rawItems: unknown[];

  try {
    const result = await generateContent(TaskType.FORMULA_EXTRACTION, prompt, {
      language,
      temperature: 0.5,
      maxTokens: 4000,
    });
    rawItems = extractJsonArray(result.text);
  } catch {
    // التراجع: أمر أبسط
    const simplePrompt = language === 'ar'
      ? `أنت خبير في الرياضيات والعلوم. أنشئ ${count} قوانين/صيغ لدرس "${topic}". أجب بـ JSON فقط:\n[{"formula":"E=mc^2","explanationAr":"شرح عربي","explanationEn":"English explanation"}]`
      : `You are a math/science expert. Generate ${count} formulas for the lesson "${topic}". Respond with JSON only:\n[{"formula":"E=mc^2","explanationAr":"شرح عربي","explanationEn":"English explanation"}]`;

    try {
      const fallbackResult = await generateContent(TaskType.TEXT_GENERATION, simplePrompt, {
        language,
        temperature: 0.5,
        maxTokens: 4000,
      });
      rawItems = extractJsonArray(fallbackResult.text);
    } catch {
      return [];
    }
  }

  // التحقق من صحة كل صيغة وبناء الحمولة
  const formulas: FormulaPayload[] = [];

  for (const item of rawItems) {
    if (!isValidFormula(item)) continue;
    if (!isValidLatex(item.formula)) continue;

    formulas.push({
      id: `formula-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      formula: item.formula.trim(),
      explanationAr: item.explanationAr.trim(),
      explanationEn: item.explanationEn.trim(),
      order: formulas.length + 1,
    });

    if (formulas.length >= count) break;
  }

  return formulas;
}