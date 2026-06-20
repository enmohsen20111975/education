/**
 * @module visual/chart-generator
 * @description مُولِّد بيانات الرسوم البيانية المتحركة.
 * يستخرج الذكاء الاصطناعي البيانات الرقمية والعناوين من محتوى الدرس.
 *
 * Animated chart data generator.
 * AI extracts numerical data and labels from lesson content.
 */

import { generateContent, TaskType } from "@/lib/ai";
import { db } from "@/lib/db";

// ============================================================
// الأنواع / Types
// ============================================================

/** بيانات مجموعة بيانات واحدة في الرسم البياني */
export interface ChartDataset {
  /** اسم المجموعة */
  label: string;
  /** القيم الرقمية */
  data: number[];
  /** لون المجموعة */
  color: string;
}

/** بيانات الرسم البياني الكاملة */
export interface ChartData {
  /** نوع الرسم البياني */
  type: "bar" | "line" | "pie" | "scatter" | "radar";
  /** العنوان بالإنجليزية */
  title: string;
  /** العنوان بالعربية */
  titleAr: string;
  /** التسميات بالإنجليزية */
  labels: string[];
  /** التسميات بالعربية */
  labelsAr: string[];
  /** مجموعات البيانات */
  datasets: ChartDataset[];
  /** نوع الحركة */
  animation: "fadeIn" | "grow" | "slide" | "bounce";
}

/** خيارات توليد الرسم البياني */
export interface ChartOptions {
  /** اللغة المفضلة */
  language?: "ar" | "en";
  /** نوع الرسم البياني (اختياري — يحدده الذكاء الاصطناعي إذا لم يُحدَّد) */
  type?: ChartData["type"];
}

// ============================================================
// ثوابت / Constants
// ============================================================

/** ألوان مجموعات البيانات */
const DATASET_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

/** أنواع الحركة المتاحة */
const ANIMATION_TYPES: ChartData["animation"][] = [
  "fadeIn",
  "grow",
  "slide",
  "bounce",
];

// ============================================================
// أنواع داخلية / Internal Types
// ============================================================

/** استجابة JSON من الذكاء الاصطناعي */
interface AIChartResponse {
  chartType: "bar" | "line" | "pie" | "scatter" | "radar";
  title: string;
  titleAr: string;
  labels: string[];
  labelsAr: string[];
  datasets: Array<{
    label: string;
    data: number[];
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
  };
}

/**
 * اختيار نوع حركة مناسب حسب نوع الرسم
 * Selects an appropriate animation type based on chart type
 */
function selectAnimation(chartType: ChartData["type"]): ChartData["animation"] {
  const animationMap: Record<ChartData["type"], ChartData["animation"]> = {
    bar: "grow",
    line: "slide",
    pie: "fadeIn",
    scatter: "bounce",
    radar: "fadeIn",
  };
  return animationMap[chartType] ?? "fadeIn";
}

// ============================================================
// التوليد بالذكاء الاصطناعي / AI Generation
// ============================================================

/**
 * استخراج بيانات الرسم البياني بالذكاء الاصطناعي
 * Extracts chart data using AI
 */
async function extractChartWithAI(
  content: NonNullable<Awaited<ReturnType<typeof fetchLessonContent>>>,
  preferredType: ChartData["type"] | undefined,
  language: "ar" | "en"
): Promise<ChartData> {
  const langInstruction =
    language === "ar"
      ? "أجب بالعربية والإنجليزية لكل عنصر."
      : "Answer in both English and Arabic for each element.";

  const conceptList = content.concepts
    .map((c, i) => `${i + 1}. ${c.termEn} / ${c.termAr}: ${c.definitionEn}`)
    .join("\n");

  const formulaList = content.formulas
    .map((f, i) => `${i + 1}. ${f.formula} — ${f.explanationEn}`)
    .join("\n");

  const typeInstruction = preferredType
    ? `Use chart type: "${preferredType}".`
    : "Choose the most appropriate chart type for this data (bar, line, pie, scatter, or radar).";

  const prompt = `${langInstruction}

Create an educational chart for this lesson.

Lesson: ${content.titleEn} / ${content.titleAr}
Summary: ${content.summaryEn}
Introduction: ${content.introductionEn}

Key Concepts:
${conceptList || "No concepts available."}

Formulas:
${formulaList || "No formulas available."}

${typeInstruction}

Create meaningful data that represents the lesson content (e.g., comparison of concepts, relative importance, process steps, etc.).

Return ONLY valid JSON:
{
  "chartType": "bar|line|pie|scatter|radar",
  "title": "Chart Title",
  "titleAr": "عنوان الرسم",
  "labels": ["Label 1", "Label 2", "Label 3"],
  "labelsAr": ["تسمية ١", "تسمية ٢", "تسمية ٣"],
  "datasets": [
    {
      "label": "Dataset Name",
      "data": [10, 25, 40]
    }
  ]
}

Rules:
- 3-8 labels
- 1-3 datasets
- Use realistic, educational data values
- Values should be positive numbers (percentages, counts, or ratings)
- Labels must be concise (1-4 words)
- Return ONLY the JSON, no markdown or explanation`;

  const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
    language,
    temperature: 0.7,
    maxTokens: 3000,
  });

  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `لم يتم العثور على JSON صالح في استجابة الرسم البياني.\n` +
      `No valid JSON found in chart AI response.`
    );
  }

  const parsed: AIChartResponse = JSON.parse(jsonMatch[0]);

  // التحقق من صحة البيانات
  const chartType = preferredType ?? parsed.chartType;
  if (!parsed.labels || parsed.labels.length === 0) {
    throw new Error(
      "البيانات المستخرجة لا تحتوي على تسميات صالحة.\n" +
      "Extracted data does not contain valid labels."
    );
  }

  // تعيين الألوان للمجموعات
  const datasets: ChartDataset[] = parsed.datasets.map((ds, i) => ({
    label: ds.label,
    data: ds.data,
    color: DATASET_COLORS[i % DATASET_COLORS.length],
  }));

  return {
    type: chartType,
    title: parsed.title || content.titleEn,
    titleAr: parsed.titleAr || content.titleAr,
    labels: parsed.labels,
    labelsAr: parsed.labelsAr || parsed.labels,
    datasets,
    animation: selectAnimation(chartType),
  };
}

// ============================================================
// الدالة الرئيسية / Main Function
// ============================================================

/**
 * توليد بيانات رسم بياني متحرك لدرس معين
 * Generates animated chart data for a given lesson
 *
 * @param lessonId - معرّف الدرس / Lesson identifier
 * @param options - خيارات التوليد / Generation options
 * @returns بيانات الرسم البياني / Chart data
 * @throws {Error} إذا لم يتم العثور على الدرس أو فشل الذكاء الاصطناعي
 *
 * @example
 * ```ts
 * const chart = await generateChart("lesson_123", {
 *   language: "ar",
 *   type: "bar",
 * });
 * console.log(chart.type); // "bar"
 * ```
 */
export async function generateChart(
  lessonId: string,
  options?: ChartOptions
): Promise<ChartData> {
  const language = options?.language ?? "ar";

  // 1. جلب محتوى الدرس
  const content = await fetchLessonContent(lessonId);
  if (!content) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\n` +
      `Lesson with ID "${lessonId}" not found.`
    );
  }

  // 2. استخراج بيانات الرسم بالذكاء الاصطناعي
  return extractChartWithAI(content, options?.type, language);
}