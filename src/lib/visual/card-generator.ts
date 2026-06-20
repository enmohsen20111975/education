/**
 * @module visual/card-generator
 * @description مُولِّد البطاقات التعليمية المتحركة.
 * يُنشئ بطاقات ثنائية الوجه (أمام/خلف) مع محتوى ثنائي اللغة.
 *
 * Animated educational card generator.
 * Creates dual-sided (front/back) flashcards with bilingual content.
 */

import { generateContent, TaskType } from "@/lib/ai";
import { db } from "@/lib/db";

// ============================================================
// الأنواع / Types
// ============================================================

/** الوجه الأمامي للبطاقة */
export interface CardFront {
  /** العنوان بالإنجليزية */
  title: string;
  /** العنوان بالعربية */
  titleAr: string;
  /** رابط صورة اختياري */
  image?: string;
  /** أيقونة اختيارية */
  icon?: string;
}

/** الوجه الخلفي للبطاقة */
export interface CardBack {
  /** المحتوى بالإنجليزية */
  content: string;
  /** المحتوى بالعربية */
  contentAr: string;
  /** تفاصيل إضافية اختيارية */
  details?: string;
}

/** بطاقة تعليمية متحركة */
export interface AnimatedCard {
  /** معرّف فريد */
  id: string;
  /** الوجه الأمامي */
  front: CardFront;
  /** الوجه الخلفي */
  back: CardBack;
  /** نوع الحركة */
  animation: "flip" | "slide" | "fade" | "zoom";
  /** لون البطاقة */
  color: string;
  /** تصنيف البطاقة */
  category: string;
}

/** خيارات توليد البطاقات */
export interface CardOptions {
  /** اللغة المفضلة */
  language?: "ar" | "en";
  /** عدد البطاقات المطلوبة */
  count?: number;
}

// ============================================================
// ثوابت / Constants
// ============================================================

/** ألوان البطاقات */
const CARD_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#10b981",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#84cc16",
  "#14b8a6",
  "#f97316",
];

/** أنواع الحركة المتاحة */
const CARD_ANIMATIONS: AnimatedCard["animation"][] = [
  "flip",
  "slide",
  "fade",
  "zoom",
];

/** أيقونات مقترَحة */
const CARD_ICONS = [
  "💡", "🔬", "📐", "📊", "🧪", "⚙️", "📚", "🎯",
  "🔑", "🌟", "📈", "🧩", "📝", "🏆", "🌍", "⚛️",
  "🧬", "🔬", "🧲", "🚀",
];

/** تصنيفات مقترَحة */
const CARD_CATEGORIES = [
  "مفهوم أساسي / Core Concept",
  "قانون / Law",
  "صيغة / Formula",
  "تطبيق / Application",
  "مثال / Example",
  "تعريف / Definition",
  "خاصية / Property",
  "نظرية / Theory",
];

// ============================================================
// أنواع داخلية / Internal Types
// ============================================================

/** استجابة JSON من الذكاء الاصطناعي */
interface AICardResponse {
  cards: Array<{
    title: string;
    titleAr: string;
    icon?: string;
    content: string;
    contentAr: string;
    details?: string;
    category?: string;
  }>;
}

// ============================================================
// الدوال المساعدة / Helper Functions
// ============================================================

/**
 * جلب محتوى الدرس من قاعدة البيانات
 * Fetches lesson content from the database
 */
async function fetchLessonContent(lessonId: string): Promise<{
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  introductionAr: string;
  introductionEn: string;
  concepts: Array<{ termAr: string; termEn: string; definitionAr: string; definitionEn: string }>;
  formulas: Array<{ formula: string; explanationAr: string; explanationEn: string }>;
  objectives: Array<{ textAr: string; textEn: string }>;
  examples: Array<{
    questionAr: string;
    questionEn: string;
    solutionAr: string;
    solutionEn: string;
  }>;
} | null> {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: {
      titleAr: true,
      titleEn: true,
      summaryAr: true,
      summaryEn: true,
      introductionAr: true,
      introductionEn: true,
      Concept: { orderBy: { order: "asc" } },
      Formula: { orderBy: { order: "asc" } },
      Objective: { orderBy: { order: "asc" } },
      Example: { orderBy: { order: "asc" } },
    },
  });

  if (!lesson) return null;

  return {
    titleAr: lesson.titleAr,
    titleEn: lesson.titleEn,
    summaryAr: lesson.summaryAr,
    summaryEn: lesson.summaryEn,
    introductionAr: lesson.introductionAr,
    introductionEn: lesson.introductionEn,
    concepts: lesson.Concept.map((c) => ({
      termAr: c.termAr,
      termEn: c.termEn,
      definitionAr: c.definitionAr,
      definitionEn: c.definitionEn,
    })),
    formulas: lesson.Formula.map((f) => ({
      formula: f.formula,
      explanationAr: f.explanationAr,
      explanationEn: f.explanationEn,
    })),
    objectives: lesson.Objective.map((o) => ({
      textAr: o.textAr,
      textEn: o.textEn,
    })),
    examples: lesson.Example.map((e) => ({
      questionAr: e.questionAr,
      questionEn: e.questionEn,
      solutionAr: e.solutionAr,
      solutionEn: e.solutionEn,
    })),
  };
}

/**
 * اختيار عشوائي من مصفوفة
 * Picks a random element from an array
 */
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * توليد معرّف فريد قصير
 * Generates a short unique identifier
 */
function uid(): string {
  return Math.random().toString(36).substring(2, 9);
}

// ============================================================
// التوليد بالذكاء الاصطناعي / AI Generation
// ============================================================

/**
 * استخراج البطاقات بالذكاء الاصطناعي
 * Extracts cards using AI
 */
async function extractCardsWithAI(
  content: NonNullable<Awaited<ReturnType<typeof fetchLessonContent>>>,
  count: number,
  language: "ar" | "en"
): Promise<AnimatedCard[]> {
  const langInstruction =
    language === "ar"
      ? "أجب بالعربية والإنجليزية لكل بطاقة."
      : "Answer in both English and Arabic for each card.";

  const conceptList = content.concepts
    .map((c, i) => `${i + 1}. ${c.termEn} / ${c.termAr}: ${c.definitionEn}`)
    .join("\n");

  const formulaList = content.formulas
    .map((f, i) => `${i + 1}. ${f.formula} — ${f.explanationEn}`)
    .join("\n");

  const objectiveList = content.objectives
    .map((o, i) => `${i + 1}. ${o.textEn}`)
    .join("\n");

  const exampleList = content.examples
    .map((e, i) => `${i + 1}. Q: ${e.questionEn} — A: ${e.solutionEn}`)
    .join("\n");

  const prompt = `${langInstruction}

Create educational flashcards for this lesson.

Lesson: ${content.titleEn} / ${content.titleAr}
Summary: ${content.summaryEn}

Key Concepts:
${conceptList || "No concepts available."}

Formulas:
${formulaList || "No formulas available."}

Objectives:
${objectiveList || "No objectives available."}

Examples:
${exampleList || "No examples available."}

Create exactly ${count} flashcards. Return ONLY valid JSON:
{
  "cards": [
    {
      "title": "Card Title (front)",
      "titleAr": "عنوان البطاقة (أمام)",
      "icon": "💡",
      "content": "Back content — explanation or answer",
      "contentAr": "محتوى الخلف — الشرح أو الإجابة",
      "details": "Optional extra detail",
      "category": "Core Concept"
    }
  ]
}

Rules:
- Front (title): Keep very concise (1-5 words) — it's a prompt/question
- Back (content): Detailed explanation (1-3 sentences)
- Details: Optional additional context
- Use relevant emojis for icons
- Categories: Core Concept, Law, Formula, Application, Example, Definition, Property, Theory
- Cover all key concepts and formulas
- Return ONLY the JSON, no markdown or explanation`;

  const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
    language,
    temperature: 0.7,
    maxTokens: 5000,
  });

  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `لم يتم العثور على JSON صالح في استجابة البطاقات.\n` +
      `No valid JSON found in cards AI response.`
    );
  }

  const parsed: AICardResponse = JSON.parse(jsonMatch[0]);

  if (!parsed.cards || parsed.cards.length === 0) {
    throw new Error(
      "لم يتم استخراج أي بطاقات من الدرس.\n" +
      "No cards extracted from the lesson."
    );
  }

  // تحويل البطاقات إلى الشكل النهائي
  return parsed.cards.slice(0, count).map((card, index) => ({
    id: `card_${uid()}`,
    front: {
      title: card.title,
      titleAr: card.titleAr,
      icon: card.icon || randomPick(CARD_ICONS),
    },
    back: {
      content: card.content,
      contentAr: card.contentAr,
      details: card.details,
    },
    animation: CARD_ANIMATIONS[index % CARD_ANIMATIONS.length],
    color: CARD_COLORS[index % CARD_COLORS.length],
    category: card.category || randomPick(CARD_CATEGORIES),
  }));
}

// ============================================================
// الدالة الرئيسية / Main Function
// ============================================================

/**
 * توليد بطاقات تعليمية متحركة لدرس معين
 * Generates animated educational cards for a given lesson
 *
 * @param lessonId - معرّف الدرس / Lesson identifier
 * @param options - خيارات التوليد / Generation options
 * @returns مصفوفة البطاقات / Array of animated cards
 * @throws {Error} إذا لم يتم العثور على الدرس أو فشل الذكاء الاصطناعي
 *
 * @example
 * ```ts
 * const cards = await generateCards("lesson_123", {
 *   language: "ar",
 *   count: 6,
 * });
 * console.log(cards.length); // 6
 * ```
 */
export async function generateCards(
  lessonId: string,
  options?: CardOptions
): Promise<AnimatedCard[]> {
  const language = options?.language ?? "ar";
  const count = Math.min(Math.max(options?.count ?? 6, 2), 12);

  // 1. جلب محتوى الدرس
  const content = await fetchLessonContent(lessonId);
  if (!content) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\n` +
      `Lesson with ID "${lessonId}" not found.`
    );
  }

  // 2. استخراج البطاقات بالذكاء الاصطناعي
  return extractCardsWithAI(content, count, language);
}