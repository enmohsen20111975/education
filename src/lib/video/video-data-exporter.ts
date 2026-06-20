/**
 * @module video/video-data-exporter
 * @description مصدّر بيانات الدروس لصالح Remotion.
 * يُجمّع محتوى الدرس في هيكل JSON متوافق مع مُكوِّن LessonVideo في Remotion.
 *
 * Lesson data exporter for Remotion consumption.
 * Assembles lesson content into a JSON structure compatible with the LessonVideo Remotion component.
 */

import type { VideoScript } from "./script-generator";
import { generateVideoScript } from "./script-generator";
import type { MindMapData } from "@/lib/visual/mindmap-generator";
import type { ChartData } from "@/lib/visual/chart-generator";
import { db } from "@/lib/db";

// ============================================================
// الأنواع / Types
// ============================================================

/** بيانات التصدير الكاملة لـ Remotion */
export interface RemotionExport {
  /** معلومات الدرس الأساسية */
  lesson: {
    id: string;
    title: string;
    titleAr: string;
  };
  /** نص الفيديو المُولَّد */
  script: VideoScript;
  /** المحتوى التعليمي المُنظَّم */
  content: {
    concepts: Array<{ term: string; definition: string }>;
    formulas: Array<{ formula: string; explanation: string }>;
    examples: Array<{ question: string; solution: string }>;
    objectives: Array<{ text: string }>;
  };
  /** المحتوى البصري */
  visuals: {
    mindMap?: MindMapData;
    chart?: ChartData;
  };
  /** تاريخ التصدير */
  exportedAt: string;
}

/** خيارات التصدير */
export interface ExportOptions {
  /** اللغة المطلوبة */
  language?: "ar" | "en";
  /** الحد الأقصى للمدة بالثواني */
  maxDuration?: number;
  /** نمط الفيديو */
  style?: "explainer" | "whiteboard" | "cinematic";
  /** تضمين نص الفيديو المُولَّد */
  includeScript?: boolean;
  /** تضمين الخريطة الذهنية */
  includeMindMap?: boolean;
  /** تضمين الرسم البياني */
  includeChart?: boolean;
}

// ============================================================
// الدوال الرئيسية / Main Functions
// ============================================================

/**
 * تصدير بيانات الدرس لهيكل Remotion
 * Exports lesson data in the Remotion-compatible format
 *
 * يجمع:
 * - معلومات الدرس الأساسية
 * - نص الفيديو المُولَّد (مشاهد + تعليق)
 * - المفاهيم والقوانين والأمثلة
 * - الخريطة الذهنية والرسم البياني (إن وُجدت)
 *
 * @param lessonId معرّف الدرس / Lesson identifier
 * @param options خيارات التصدير / Export options
 * @returns بيانات التصدير الكاملة / Complete export data
 *
 * @throws {Error} إذا لم يتم العثور على الدرس
 *
 * @example
 * ```ts
 * const data = await exportForRemotion("lesson_123", {
 *   language: "ar",
 *   style: "explainer",
 *   includeMindMap: true,
 * });
 * // البيانات جاهزة للتمرير إلى مُكوِّن LessonVideo في Remotion
 * ```
 */
export async function exportForRemotion(
  lessonId: string,
  options?: ExportOptions
): Promise<RemotionExport> {
  const language = options?.language ?? "ar";
  const maxDuration = options?.maxDuration ?? 600;
  const style = options?.style ?? "explainer";
  const includeScript = options?.includeScript ?? true;
  const includeMindMap = options?.includeMindMap ?? true;
  const includeChart = options?.includeChart ?? true;

  // ─── قراءة بيانات الدرس / Fetch lesson data ───
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      Concept: { orderBy: { order: "asc" } },
      Formula: { orderBy: { order: "asc" } },
      Example: { orderBy: { order: "asc" } },
      Objective: { orderBy: { order: "asc" } },
      MindMap: true,
      Infographic: true,
    },
  });

  if (!lesson) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\n` +
      `Lesson with ID "${lessonId}" not found.`
    );
  }

  // ─── توليد نص الفيديو / Generate script ───
  let script: VideoScript | undefined;
  if (includeScript) {
    script = await generateVideoScript(lessonId, {
      language,
      maxDuration,
      style,
    });
  } else {
    // إنشاء نص فارغ
    script = {
      lessonId,
      title: lesson.titleEn,
      titleAr: lesson.titleAr,
      totalDuration: 0,
      scenes: [],
      language,
      style,
    };
  }

  // ─── جمع المحتوى / Assemble content ───
  const content = {
    concepts: lesson.Concept.map((c) => ({
      term: language === "ar" ? c.termAr : c.termEn,
      definition: language === "ar" ? c.definitionAr : c.definitionEn,
    })),
    formulas: lesson.Formula.map((f) => ({
      formula: f.formula,
      explanation: language === "ar" ? f.explanationAr : f.explanationEn,
    })),
    examples: lesson.Example.map((e) => ({
      question: language === "ar" ? e.questionAr : e.questionEn,
      solution: language === "ar" ? e.solutionAr : e.solutionEn,
    })),
    objectives: lesson.Objective.map((o) => ({
      text: language === "ar" ? o.textAr : o.textEn,
    })),
  };

  // ─── جمع المحتوى البصري / Assemble visuals ───
  const visuals: { mindMap?: MindMapData; chart?: ChartData } = {};

  if (includeMindMap && lesson.MindMap.length > 0) {
    try {
      visuals.mindMap = JSON.parse(lesson.MindMap[0].data) as MindMapData;
    } catch {
      console.warn(
        `[VideoExporter] فشل تحليل بيانات الخريطة الذهنية.\n` +
        `[VideoExporter] Failed to parse mind map data.`
      );
    }
  }

  if (includeChart && lesson.Infographic.length > 0) {
    try {
      const infographicData = JSON.parse(lesson.Infographic[0].data);
      if (infographicData.type === "chart" || infographicData.datasets) {
        visuals.chart = infographicData as ChartData;
      }
    } catch {
      console.warn(
        `[VideoExporter] فشل تحليل بيانات الرسم البياني.\n` +
        `[VideoExporter] Failed to parse chart data.`
      );
    }
  }

  return {
    lesson: {
      id: lesson.id,
      title: lesson.titleEn,
      titleAr: lesson.titleAr,
    },
    script,
    content,
    visuals,
    exportedAt: new Date().toISOString(),
  };
}

/**
 * تحويل نص الفيديو إلى هيكل المشاهد الخاص بـ Remotion
 * Converts a VideoScript to Remotion's native scene structure
 *
 * يُنتِج هيكلاً متوافقاً مع مُكوِّن LessonVideo الحالي
 *
 * @param script نص الفيديو / Video script
 * @returns قائمة مشاهد Remotion / List of Remotion scenes
 */
export function scriptToRemotionScenes(script: VideoScript): Array<{
  type: string;
  duration_sec: number;
  title?: string;
  formula_id?: string;
  question_ids?: string[];
  config?: Record<string, unknown>;
}> {
  return script.scenes.map((scene) => {
    const baseScene: Record<string, unknown> = {
      type: scene.type,
      duration_sec: scene.duration,
      title: scene.type === "title" ? script.titleAr : undefined,
    };

    switch (scene.type) {
      case "formula":
        baseScene.config = scene.visual.data;
        break;
      case "question":
        baseScene.config = scene.visual.data;
        break;
      case "concept":
        baseScene.config = scene.visual.data;
        break;
      case "example":
        baseScene.config = scene.visual.data;
        break;
      case "summary":
        baseScene.config = scene.visual.data;
        break;
      default:
        break;
    }

    return baseScene as {
      type: string;
      duration_sec: number;
      title?: string;
      formula_id?: string;
      question_ids?: string[];
      config?: Record<string, unknown>;
    };
  });
}
