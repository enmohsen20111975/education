/**
 * @module visual/infographic-generator
 * @description مُولِّد الإنفوجرافيك التعليمي.
 * يستخرج الذكاء الاصطناعي الأقسام المناسبة لبناء إنفوجرافيك مُهيكل.
 *
 * Educational infographic generator.
 * AI extracts suitable sections to build a structured infographic.
 */

import { generateContent, TaskType } from "@/lib/ai";
import { db } from "@/lib/db";

// ============================================================
// الأنواع / Types
// ============================================================

/** قسم في الإنفوجرافيك */
export interface InfographicSection {
  /** نوع القسم */
  type: "header" | "stat" | "list" | "comparison" | "process" | "quote" | "chart";
  /** عنوان القسم بالإنجليزية */
  title: string;
  /** عنوان القسم بالعربية (اختياري) */
  titleAr?: string;
  /** بيانات القسم — تختلف حسب النوع */
  data: Record<string, unknown>;
  /** ترتيب القسم */
  order: number;
}

/** بيانات الإنفوجرافيك الكاملة */
export interface InfographicData {
  /** العنوان بالإنجليزية */
  title: string;
  /** العنوان بالعربية */
  titleAr: string;
  /** اسم المادة الدراسية */
  subject: string;
  /** الأقسام المُرتَّبة */
  sections: InfographicSection[];
  /** مخطط الألوان */
  colorScheme: string[];
  /** اتجاه التخطيط */
  layout: "vertical" | "horizontal";
}

/** خيارات توليد الإنفوجرافيك */
export interface InfographicOptions {
  /** اللغة المفضلة */
  language?: "ar" | "en";
  /** نمط التصميم */
  style?: "modern" | "classic" | "minimal";
}

// ============================================================
// ثوابت / Constants
// ============================================================

/** مخططات الألوان حسب النمط */
const COLOR_SCHEMES: Record<string, string[]> = {
  modern: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
  classic: ["#1e40af", "#7c3aed", "#059669", "#d97706", "#dc2626", "#475569"],
  minimal: ["#374151", "#6b7280", "#9ca3af", "#d1d5db", "#1f2937", "#f3f4f6"],
};

/** أيقونات مقترَحة حسب نوع القسم */
const SECTION_ICONS: Record<string, string> = {
  header: "📋",
  stat: "📊",
  list: "📝",
  comparison: "⚖️",
  process: "🔄",
  quote: "💬",
  chart: "📈",
};

// ============================================================
// أنواع داخلية / Internal Types
// ============================================================

/** استجابة JSON من الذكاء الاصطناعي */
interface AIInfographicResponse {
  sections: Array<{
    type: "header" | "stat" | "list" | "comparison" | "process" | "quote" | "chart";
    title: string;
    titleAr: string;
    data: Record<string, unknown>;
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
  unit: { subject: { nameAr: string; nameEn: string } | null };
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
      Unit: {
        select: {
          Subject: { select: { nameAr: true, nameEn: true } },
        },
      },
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
    unit: { subject: lesson.Unit?.Subject ?? null },
  };
}

// ============================================================
// التوليد بالذكاء الاصطناعي / AI Generation
// ============================================================

/**
 * استخراج أقسام الإنفوجرافيك بالذكاء الاصطناعي
 * Extracts infographic sections using AI
 */
async function extractSectionsWithAI(
  content: NonNullable<Awaited<ReturnType<typeof fetchLessonContent>>>,
  style: "modern" | "classic" | "minimal",
  language: "ar" | "en"
): Promise<InfographicSection[]> {
  const langInstruction =
    language === "ar"
      ? "أجب بالعربية والإنجليزية لكل قسم."
      : "Answer in both English and Arabic for each section.";

  const conceptList = content.concepts
    .map((c, i) => `${i + 1}. ${c.termEn} / ${c.termAr}: ${c.definitionEn}`)
    .join("\n");

  const formulaList = content.formulas
    .map((f, i) => `${i + 1}. ${f.formula} — ${f.explanationEn}`)
    .join("\n");

  const objectiveList = content.objectives
    .map((o, i) => `${i + 1}. ${o.textEn}`)
    .join("\n");

  const prompt = `${langInstruction}

Design an educational infographic for this lesson.

Lesson: ${content.titleEn} / ${content.titleAr}
Summary: ${content.summaryEn}
Introduction: ${content.introductionEn}

Key Concepts:
${conceptList || "No concepts available."}

Formulas:
${formulaList || "No formulas available."}

Objectives:
${objectiveList || "No objectives available."}

Style: ${style}

Create 4-7 sections for the infographic. Return ONLY valid JSON:
{
  "sections": [
    {
      "type": "header|stat|list|comparison|process|quote|chart",
      "title": "Section Title",
      "titleAr": "عنوان القسم",
      "data": { ... }
    }
  ]
}

Section data formats:
- header: { "subtitle": "Sub text", "subtitleAr": "نص فرعي", "icon": "🎯" }
- stat: { "value": "95%", "valueAr": "٩٥٪", "label": "Accuracy rate", "labelAr": "معدل الدقة", "icon": "📊" }
- list: { "items": ["Item 1", "Item 2"], "itemsAr": ["عنصر ١", "عنصر ٢"], "icon": "📝" }
- comparison: { "items": [{ "label": "A", "labelAr": "أ", "points": ["p1", "p2"], "pointsAr": ["ن١", "ن٢"] }, { "label": "B", "labelAr": "ب", "points": ["p1", "p2"], "pointsAr": ["ن١", "ن٢"] }] }
- process: { "steps": [{ "title": "Step 1", "titleAr": "الخطوة ١", "description": "desc", "descriptionAr": "وصف" }] }
- quote: { "text": "Important quote", "textAr": "اقتباس مهم", "author": "Author", "authorAr": "المؤلف" }
- chart: { "chartType": "bar|pie|line", "labels": ["A", "B"], "labelsAr": ["أ", "ب"], "values": [30, 70] }

Rules:
- First section must be type "header"
- Include at least one "stat" or "chart" section
- Keep titles concise (max 5 words)
- Return ONLY the JSON, no markdown or explanation`;

  const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
    language,
    temperature: 0.7,
    maxTokens: 5000,
  });

  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `لم يتم العثور على JSON صالح في استجابة الإنفوجرافيك.\n` +
      `No valid JSON found in infographic AI response.`
    );
  }

  const parsed: AIInfographicResponse = JSON.parse(jsonMatch[0]);

  return parsed.sections.map((section, index) => ({
    type: section.type,
    title: section.title,
    titleAr: section.titleAr,
    data: {
      ...section.data,
      icon: (section.data as Record<string, unknown>).icon || SECTION_ICONS[section.type] || "📌",
    },
    order: index,
  }));
}

// ============================================================
// التخزين في قاعدة البيانات / Database Storage
// ============================================================

/**
 * تخزين الإنفوجرافيك في قاعدة البيانات
 * Stores the infographic in the database (upsert)
 */
async function storeInfographic(
  lessonId: string,
  data: InfographicData,
  style: string
): Promise<void> {
  const jsonString = JSON.stringify(data);

  await db.infographic.upsert({
    where: { lessonId },
    create: {
      id: `inf_${lessonId}`,
      lessonId,
      type: style,
      data: jsonString,
    },
    update: {
      type: style,
      data: jsonString,
    },
  });
}

// ============================================================
// الدالة الرئيسية / Main Function
// ============================================================

/**
 * توليد إنفوجرافيك تعليمي لدرس معين
 * Generates an educational infographic for a given lesson
 *
 * @param lessonId - معرّف الدرس / Lesson identifier
 * @param options - خيارات التوليد / Generation options
 * @returns بيانات الإنفوجرافيك / Infographic data
 * @throws {Error} إذا لم يتم العثور على الدرس أو فشل الذكاء الاصطناعي
 *
 * @example
 * ```ts
 * const infographic = await generateInfographic("lesson_123", {
 *   language: "ar",
 *   style: "modern",
 * });
 * console.log(infographic.sections.length);
 * ```
 */
export async function generateInfographic(
  lessonId: string,
  options?: InfographicOptions
): Promise<InfographicData> {
  const language = options?.language ?? "ar";
  const style = options?.style ?? "modern";

  // 1. جلب محتوى الدرس
  const content = await fetchLessonContent(lessonId);
  if (!content) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\n` +
      `Lesson with ID "${lessonId}" not found.`
    );
  }

  // 2. استخراج الأقسام بالذكاء الاصطناعي
  const sections = await extractSectionsWithAI(content, style, language);

  if (sections.length === 0) {
    throw new Error(
      "لم يتم استخراج أي أقسام للإنفوجرافيك.\n" +
      "No sections extracted for the infographic."
    );
  }

  // 3. تجميع النتيجة
  const infographicData: InfographicData = {
    title: content.titleEn,
    titleAr: content.titleAr,
    subject: content.unit.subject?.nameEn ?? "",
    sections,
    colorScheme: COLOR_SCHEMES[style] ?? COLOR_SCHEMES.modern,
    layout: "vertical",
  };

  // 4. تخزين في قاعدة البيانات
  await storeInfographic(lessonId, infographicData, style);

  return infographicData;
}