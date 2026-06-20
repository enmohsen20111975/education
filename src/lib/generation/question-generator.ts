/**
 * @module question-generator
 * @description مولّد الأسئلة — يستدعي الذكاء الاصطناعي لتوليد أسئلة متنوعة
 * (اختيار من متعدد، صح/خطأ، إجابة قصيرة، مقال، حسابي) مع إجاباتها وشرحها.
 *
 * Question generator — calls AI to generate diverse question types
 * (MCQ, True/False, Short Answer, Essay, Calculation) with answers and explanations.
 */

import { generateContent, TaskType } from '@/lib/ai';
import { db } from '@/lib/db';
import type { QuestionPayload } from '@/lib/sync/sync-schema';
import { questionsPrompt } from './prompts';

/** أنواع الأسئلة المدعومة / Supported question types */
export type QuestionType = 'mcq' | 'truefalse' | 'shortanswer' | 'essay' | 'calculation';

/** خيارات توليد الأسئلة / Question generation options */
export interface QuestionGenerateOptions {
  /** اللغة المطلوبة / Requested language */
  language?: 'ar' | 'en';
  /** أنواع الأسئلة المطلوبة / Requested question types */
  types?: QuestionType[];
  /** عدد الأسئلة المطلوب / Number of questions to generate */
  count?: number;
  /** مستوى الصعوبة / Difficulty level */
  difficulty?: 'easy' | 'medium' | 'hard';
}

/** شكل بيانات السؤال من الذكاء الاصطناعي / Raw question data from AI */
interface RawQuestion {
  type?: string;
  questionAr?: string;
  questionEn?: string;
  optionsAr?: string | null;
  optionsEn?: string | null;
  answer?: string;
  explanationAr?: string | null;
  explanationEn?: string | null;
  points?: number;
  difficulty?: string;
}

/** الأنواع الصالحة للأسئلة / Valid question types */
const VALID_TYPES = new Set<string>(['mcq', 'truefalse', 'shortanswer', 'essay', 'calculation']);

/** مستويات الصعوبة الصالحة / Valid difficulty levels */
const VALID_DIFFICULTIES = new Set<string>(['easy', 'medium', 'hard']);

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
 * التحقق من صحة بيانات السؤال
 * Validates a question object
 */
function isValidQuestion(q: unknown): q is RawQuestion {
  if (!q || typeof q !== 'object') return false;
  const obj = q as Record<string, unknown>;
  return (
    typeof obj.type === 'string' && VALID_TYPES.has(obj.type) &&
    typeof obj.questionAr === 'string' && obj.questionAr.trim().length > 0 &&
    typeof obj.questionEn === 'string' && obj.questionEn.trim().length > 0 &&
    typeof obj.answer === 'string' && obj.answer.trim().length > 0
  );
}

/**
 * توليد أسئلة لدرس معيّن
 * Generates questions for a given lesson
 *
 * @param lessonId معرّف الدرس / The lesson ID
 * @param options خيارات التوليد / Generation options
 * @returns مصفوفة من حمولات الأسئلة / Array of question payloads
 *
 * @example
 * ```ts
 * const questions = await generateQuestions('lesson-123', {
 *   language: 'ar',
 *   types: ['mcq', 'truefalse'],
 *   count: 10,
 *   difficulty: 'medium',
 * });
 * ```
 */
export async function generateQuestions(
  lessonId: string,
  options?: QuestionGenerateOptions
): Promise<QuestionPayload[]> {
  const language = options?.language ?? 'ar';
  const types = options?.types ?? ['mcq', 'truefalse', 'shortanswer'];
  const count = options?.count ?? 10;
  const difficulty = options?.difficulty ?? 'medium';

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
  const prompt = questionsPrompt({
    topic,
    subject,
    grade,
    language,
    types,
    count,
    difficulty,
  });

  let rawItems: unknown[];

  try {
    const result = await generateContent(TaskType.QUESTION_GENERATION, prompt, {
      language,
      temperature: 0.7,
      maxTokens: 8000,
    });
    rawItems = extractJsonArray(result.text);
  } catch {
    // التراجع: أمر أبسط
    const typeStr = types.join(', ');
    const simplePrompt = language === 'ar'
      ? `أنت معلم خبير. أنشئ ${count} أسئلة (أنواع: ${typeStr}) بمستوى "${difficulty}" لدرس "${topic}". أجب بـ JSON فقط. كل سؤال: {"type":"mcq","questionAr":"...","questionEn":"...","optionsAr":null,"optionsEn":null,"answer":"...","explanationAr":"...","explanationEn":"...","points":1,"difficulty":"medium"}`
      : `You are an expert teacher. Generate ${count} questions (types: ${typeStr}) at "${difficulty}" level for "${topic}". Respond with JSON only. Each question: {"type":"mcq","questionAr":"...","questionEn":"...","optionsAr":null,"optionsEn":null,"answer":"...","explanationAr":"...","explanationEn":"...","points":1,"difficulty":"medium"}`;

    try {
      const fallbackResult = await generateContent(TaskType.QUESTION_GENERATION, simplePrompt, {
        language,
        temperature: 0.7,
        maxTokens: 8000,
      });
      rawItems = extractJsonArray(fallbackResult.text);
    } catch {
      return [];
    }
  }

  // التحقق من صحة كل سؤال وبناء الحمولة
  const questions: QuestionPayload[] = [];

  for (const item of rawItems) {
    if (!isValidQuestion(item)) continue;

    // التحقق من صحة النقاط
    const points = typeof item.points === 'number' && item.points >= 1 && item.points <= 5
      ? item.points
      : 1;

    // التحقق من مستوى الصعوبة
    const qDifficulty = typeof item.difficulty === 'string' && VALID_DIFFICULTIES.has(item.difficulty)
      ? item.difficulty
      : difficulty;

    questions.push({
      id: `question-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: item.type,
      questionAr: item.questionAr.trim(),
      questionEn: item.questionEn.trim(),
      optionsAr: typeof item.optionsAr === 'string' ? item.optionsAr : null,
      optionsEn: typeof item.optionsEn === 'string' ? item.optionsEn : null,
      answer: item.answer.trim(),
      explanationAr: typeof item.explanationAr === 'string' ? item.explanationAr.trim() : null,
      explanationEn: typeof item.explanationEn === 'string' ? item.explanationEn.trim() : null,
      points,
      difficulty: qDifficulty,
      order: questions.length + 1,
    });

    if (questions.length >= count) break;
  }

  return questions;
}