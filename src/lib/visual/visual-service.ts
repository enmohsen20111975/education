/**
 * @module visual/visual-service
 * @description الخدمة الرئيسية لتوليد المحتوى البصري.
 * تُنظِّم عملية توليد جميع الأنواع البصرية مع دعم التقدم والإبلاغ.
 *
 * Master visual content generation service.
 * Orchestrates generation of all visual types with progress reporting.
 */

import type { MindMapData } from "./mindmap-generator";
import type { InfographicData } from "./infographic-generator";
import type { ChartData } from "./chart-generator";
import type { AnimatedCard } from "./card-generator";
import type { LogicMapData } from "./logic-map-generator";

import { generateMindMap } from "./mindmap-generator";
import { generateInfographic } from "./infographic-generator";
import { generateChart } from "./chart-generator";
import { generateCards } from "./card-generator";
import { generateLogicMap } from "./logic-map-generator";

// ============================================================
// الأنواع / Types
// ============================================================

/** أنواع المحتوى البصري المدعومة */
export type VisualType = "mindmap" | "infographic" | "chart" | "cards" | "logicmap";

/** خيارات التوليد الشاملة */
export interface GenerateAllOptions {
  /** أنواع المحتوى المطلوب توليدها (الكل إذا لم يُحدَّد) */
  types?: VisualType[];
  /** اللغة المفضلة */
  language?: "ar" | "en";
  /** دالة استدعاء التقدم */
  onProgress?: (type: string, status: string) => void;
}

/** نتيجة التوليد الشاملة */
export interface GenerateAllResult {
  /** الخريطة الذهنية (إن طُلبت) */
  mindMap?: MindMapData;
  /** الإنفوجرافيك (إن طُلِب) */
  infographic?: InfographicData;
  /** الرسم البياني (إن طُلِب) */
  chart?: ChartData;
  /** البطاقات (إن طُلِبت) */
  cards?: AnimatedCard[];
  /** الخريطة المنطقية (إن طُلِبت) */
  logicMap?: LogicMapData;
}

/** معلومات عن خطأ في نوع بصري معين */
interface VisualGenerationError {
  type: VisualType;
  error: string;
}

// ============================================================
// الأسماء العربية للأنواع / Arabic Type Names
// ============================================================

const TYPE_LABELS: Record<VisualType, string> = {
  mindmap: "الخريطة الذهنية",
  infographic: "الإنفوجرافيك",
  chart: "الرسم البياني",
  cards: "البطاقات التعليمية",
  logicmap: "الخريطة المنطقية",
};

// ============================================================
// الدوال الداخلية / Internal Functions
// ============================================================

/**
 * توليد نوع بصري واحد مع معالجة الأخطاء
 * Generates a single visual type with error handling
 */
async function generateOne(
  type: VisualType,
  lessonId: string,
  language: "ar" | "en",
  onProgress?: (type: string, status: string) => void
): Promise<{ key: keyof GenerateAllResult; data: unknown } | null> {
  try {
    onProgress?.(type, "generating");

    switch (type) {
      case "mindmap": {
        const data = await generateMindMap(lessonId, { language });
        onProgress?.(type, "completed");
        return { key: "mindMap", data };
      }
      case "infographic": {
        const data = await generateInfographic(lessonId, { language });
        onProgress?.(type, "completed");
        return { key: "infographic", data };
      }
      case "chart": {
        const data = await generateChart(lessonId, { language });
        onProgress?.(type, "completed");
        return { key: "chart", data };
      }
      case "cards": {
        const data = await generateCards(lessonId, { language, count: 6 });
        onProgress?.(type, "completed");
        return { key: "cards", data };
      }
      case "logicmap": {
        const data = await generateLogicMap(lessonId, { language });
        onProgress?.(type, "completed");
        return { key: "logicMap", data };
      }
      default:
        return null;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    onProgress?.(type, `failed: ${message}`);
    console.error(
      `[VisualService] فشل توليد ${TYPE_LABELS[type]}: ${message}\n` +
      `[VisualService] Failed to generate ${type}: ${message}`
    );
    return null;
  }
}

// ============================================================
// الدالة الرئيسية / Main Function
// ============================================================

/**
 * توليد جميع أنواع المحتوى البصري أو أنواع محددة لدرس معين
 * Generates all or specific visual content types for a given lesson
 *
 * @param lessonId - معرّف الدرس / Lesson identifier
 * @param options - خيارات التوليد / Generation options
 * @returns نتيجة التوليد — تحتوي فقط على الأنواع الناجحة / Generation result with only successful types
 *
 * @example
 * ```ts
 * const result = await generateAllVisuals("lesson_123", {
 *   types: ["mindmap", "infographic"],
 *   language: "ar",
 *   onProgress: (type, status) => console.log(`${type}: ${status}`),
 * });
 *
 * if (result.mindMap) {
 *   console.log("Mind map nodes:", result.mindMap.nodes.length);
 * }
 * ```
 */
export async function generateAllVisuals(
  lessonId: string,
  options?: GenerateAllOptions
): Promise<GenerateAllResult> {
  const language = options?.language ?? "ar";
  const types = options?.types ?? (["mindmap", "infographic", "chart", "cards", "logicmap"] as VisualType[]);

  const result: GenerateAllResult = {};
  const errors: VisualGenerationError[] = [];

  // توليد كل نوع على حدة — بالتوازي لتحسين الأداء
  const promises = types.map(async (type) => {
    const outcome = await generateOne(type, lessonId, language, options?.onProgress);
    if (outcome) {
      (result as Record<string, unknown>)[outcome.key] = outcome.data;
    } else {
      errors.push({ type, error: "Unknown error" });
    }
  });

  await Promise.all(promises);

  // تسجيل الأخطاء إذا وُجدت
  if (errors.length > 0 && errors.length < types.length) {
    const failedTypes = errors.map((e) => TYPE_LABELS[e.type]).join("، ");
    console.warn(
      `[VisualService] تم توليد بعض الأنواع بنجاح لكن فشل البعض: ${failedTypes}\n` +
      `[VisualService] Some types generated successfully but others failed: ${failedTypes}`
    );
  }

  // إذا فشل الكل، نرمي خطأ
  if (errors.length === types.length) {
    throw new Error(
      `فشل توليد جميع الأنواع البصرية المطلوبة (${types.length} أنواع).\n` +
      `All requested visual types (${types.length}) failed to generate.`
    );
  }

  return result;
}