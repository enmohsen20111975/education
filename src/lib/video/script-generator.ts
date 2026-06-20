/**
 * @module video/script-generator
 * @description مُولِّد نصوص الفيديو التعليمية.
 * يقرأ محتوى الدرس من قاعدة البيانات ويولّد نصوصًا مرئية مسرحية جاهزة للإنتاج.
 *
 * Educational video script generator.
 * Reads lesson content from the database and generates production-ready scene scripts.
 */

import { db } from "@/lib/db";
import { generateContent, TaskType } from "@/lib/ai";

// ============================================================
// الأنواع / Types
// ============================================================

/** أنواع مشاهد الفيديو المدعومة */
export type SceneType =
  | "intro"
  | "title"
  | "concept"
  | "formula"
  | "example"
  | "question"
  | "summary"
  | "outro";

/** أنواع الانتقالات المرئية */
export type TransitionType = "fade" | "slide-left" | "slide-up" | "zoom" | "dissolve";

/** أنواع العناصر البصرية في المشهد */
export type VisualType =
  | "text"
  | "formula"
  | "mindmap"
  | "infographic"
  | "chart"
  | "animation"
  | "image";

/** بيانات المشهد المرئي */
export interface SceneVisual {
  /** نوع العنصر البصري */
  type: VisualType;
  /** بيانات العنصر (تعتمد على النوع) */
  data: Record<string, unknown>;
}

/** مشهد في نص الفيديو */
export interface VideoScene {
  /** معرّف فريد للمشهد */
  id: string;
  /** ترتيب المشهد في السلسلة */
  order: number;
  /** نوع المشهد */
  type: SceneType;
  /** نص التعليق الصوتي بالعربية */
  narration: string;
  /** نص التعليق الصوتي بالإنجليزية (اختياري) */
  narrationEn?: string;
  /** مدة المشهد بالثواني */
  duration: number;
  /** العنصر البصري المرتبط بالمشهد */
  visual: SceneVisual;
  /** نوع الانتقال للمشهد التالي */
  transition: TransitionType;
}

/** نص الفيديو الكامل */
export interface VideoScript {
  /** معرّف الدرس المصدر */
  lessonId: string;
  /** عنوان الدرس بالإنجليزية */
  title: string;
  /** عنوان الدرس بالعربية */
  titleAr: string;
  /** المدة الإجمالية بالثواني */
  totalDuration: number;
  /** قائمة المشاهد مرتبة زمنياً */
  scenes: VideoScene[];
  /** لغة النص الأساسية */
  language: "ar" | "en";
  /** نمط الفيديو المطلوب */
  style: "explainer" | "whiteboard" | "cinematic";
}

/** خيارات توليد النص */
export interface ScriptGeneratorOptions {
  /** اللغة المطلوبة للنص */
  language?: "ar" | "en";
  /** الحد الأقصى للمدة بالثواني */
  maxDuration?: number;
  /** نمط الفيديو */
  style?: "explainer" | "whiteboard" | "cinematic";
}

// ============================================================
// الثوابت / Constants
// ============================================================

/** المعدل التقريبي للكلمات بالثانية (العربية أبطأ قليلاً) */
const WORDS_PER_SECOND_AR = 3;
const WORDS_PER_SECOND_EN = 2.5;

/** مدة المشاهد الثابتة بالثواني */
const FIXED_DURATIONS: Record<SceneType, { min: number; max: number }> = {
  intro: { min: 3, max: 5 },
  title: { min: 5, max: 8 },
  concept: { min: 8, max: 20 },
  formula: { min: 10, max: 25 },
  example: { min: 12, max: 30 },
  question: { min: 10, max: 20 },
  summary: { min: 8, max: 15 },
  outro: { min: 3, max: 5 },
};

/** أصوات العرض حسب نوع المشهد */
const SCENE_TRANSITIONS: Record<SceneType, TransitionType> = {
  intro: "fade",
  title: "zoom",
  concept: "slide-left",
  formula: "slide-up",
  example: "slide-left",
  question: "dissolve",
  summary: "slide-up",
  outro: "fade",
};

// ============================================================
// الدوال المساعدة / Helper Functions
// ============================================================

/**
 * توليد معرّف فريد للمشهد
 * Generates a unique scene identifier
 */
function generateSceneId(type: SceneType, order: number): string {
  return `scene_${type}_${order}_${Date.now().toString(36)}`;
}

/**
 * حساب مدة المشهد بناءً على عدد الكلمات في النص
 * Calculates scene duration based on narration word count
 *
 * @param text نص التعليق / Narration text
 * @param language لغة النص / Text language
 * @param minDuration الحد الأدنى / Minimum duration
 * @param maxDuration الحد الأقصى / Maximum duration
 * @returns المدة المحسوبة بالثواني / Calculated duration in seconds
 */
function calculateDuration(
  text: string,
  language: "ar" | "en",
  minDuration: number,
  maxDuration: number
): number {
  const wordCount = text.trim().split(/\s+/).length;
  const wordsPerSec = language === "ar" ? WORDS_PER_SECOND_AR : WORDS_PER_SECOND_EN;
  const calculated = Math.ceil(wordCount / wordsPerSec);
  // إضافة ثانيتين للوقوف بين الجمل
  const withPause = calculated + 2;
  return Math.max(minDuration, Math.min(maxDuration, withPause));
}

/**
 * تعيين نوع الانتقال التالي بناءً على نوع المشهد الحالي
 * Assigns the next transition type based on current scene type
 */
function getTransition(sceneType: SceneType): TransitionType {
  return SCENE_TRANSITIONS[sceneType] ?? "fade";
}

/**
 * اختيار التسمية حسب اللغة
 * Selects the appropriate label based on language
 */
function pickArEn(ar: string, en: string, lang: "ar" | "en"): string {
  return lang === "ar" ? ar : en;
}

// ============================================================
// دوال توليد المشاهد / Scene Generation Functions
// ============================================================

/**
 * توليد مشهد المقدمة
 * Generates the intro scene
 */
function buildIntroScene(
  order: number,
  titleAr: string,
  titleEn: string,
  style: string,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `مرحباً بكم في درس ${titleAr}. سنتعلم معاً مفاهيم مهمة في هذا الدرس.`;
  const narrationEn = `Welcome to the lesson on ${titleEn}. We will learn important concepts together.`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.intro;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("intro", order),
    order,
    type: "intro",
    narration,
    narrationEn: narrationEn,
    duration,
    visual: {
      type: "text",
      data: {
        text: titleAr,
        textEn: titleEn,
        subtitle: `SmartEdu — ${style}`,
        animation: "fadeInScale",
      },
    },
    transition: getTransition("intro"),
  };
}

/**
 * توليد مشهد العنوان
 * Generates the title scene
 */
function buildTitleScene(
  order: number,
  titleAr: string,
  titleEn: string,
  descriptionAr: string,
  descriptionEn: string,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `عنوان درسنا اليوم هو: ${titleAr}. ${descriptionAr.substring(0, 100)}`;
  const narrationEn = `Today's lesson is: ${titleEn}. ${descriptionEn.substring(0, 100)}`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.title;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("title", order),
    order,
    type: "title",
    narration,
    narrationEn,
    duration,
    visual: {
      type: "text",
      data: {
        title: titleAr,
        titleEn: titleEn,
        subtitle: descriptionAr.substring(0, 80),
        subtitleEn: descriptionEn.substring(0, 80),
        animation: "slideUp",
      },
    },
    transition: getTransition("title"),
  };
}

/**
 * توليد مشهد المفهوم
 * Generates a concept scene
 */
function buildConceptScene(
  order: number,
  termAr: string,
  termEn: string,
  definitionAr: string,
  definitionEn: string,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `الآن سنتعرف على مفهوم ${termAr}. ${definitionAr.substring(0, 150)}`;
  const narrationEn = `Now let's learn about ${termEn}. ${definitionEn.substring(0, 150)}`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.concept;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("concept", order),
    order,
    type: "concept",
    narration,
    narrationEn,
    duration,
    visual: {
      type: "text",
      data: {
        term: termAr,
        termEn: termEn,
        definition: definitionAr,
        definitionEn: definitionEn,
        animation: "fadeIn",
      },
    },
    transition: getTransition("concept"),
  };
}

/**
 * توليد مشهد القانون / المعادلة
 * Generates a formula scene
 */
function buildFormulaScene(
  order: number,
  formula: string,
  explanationAr: string,
  explanationEn: string,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `لننظر الآن إلى القانون التالي: ${explanationAr.substring(0, 120)}`;
  const narrationEn = `Now let's look at the following formula: ${explanationEn.substring(0, 120)}`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.formula;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("formula", order),
    order,
    type: "formula",
    narration,
    narrationEn,
    duration,
    visual: {
      type: "formula",
      data: {
        latex: formula,
        explanation: explanationAr,
        explanationEn: explanationEn,
        animation: "writeIn",
      },
    },
    transition: getTransition("formula"),
  };
}

/**
 * توليد مشهد المثال التوضيحي
 * Generates an example scene
 */
function buildExampleScene(
  order: number,
  questionAr: string,
  questionEn: string,
  solutionAr: string,
  solutionEn: string,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `لنطبق ما تعلمناه على مثال عملي. ${questionAr.substring(0, 100)}. ${solutionAr.substring(0, 100)}`;
  const narrationEn = `Let's apply what we learned with a practical example. ${questionEn.substring(0, 100)}. ${solutionEn.substring(0, 100)}`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.example;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("example", order),
    order,
    type: "example",
    narration,
    narrationEn,
    duration,
    visual: {
      type: "text",
      data: {
        question: questionAr,
        questionEn: questionEn,
        solution: solutionAr,
        solutionEn: solutionEn,
        animation: "stepByStep",
      },
    },
    transition: getTransition("example"),
  };
}

/**
 * توليد مشهد السؤال التفاعلي
 * Generates a question scene
 */
function buildQuestionScene(
  order: number,
  questionAr: string,
  questionEn: string,
  answer: string,
  explanationAr: string | null | undefined,
  explanationEn: string | null | undefined,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `والآن سؤال لك: ${questionAr.substring(0, 80)}. ${explanationAr ? explanationAr.substring(0, 80) : "فكّر جيداً في الإجابة!"}`;
  const narrationEn = `Now a question for you: ${questionEn.substring(0, 80)}. ${explanationEn ? explanationEn.substring(0, 80) : "Think carefully about the answer!"}`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.question;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("question", order),
    order,
    type: "question",
    narration,
    narrationEn,
    duration,
    visual: {
      type: "animation",
      data: {
        question: questionAr,
        questionEn: questionEn,
        answer,
        explanation: explanationAr ?? "",
        explanationEn: explanationEn ?? "",
        timer: true,
      },
    },
    transition: getTransition("question"),
  };
}

/**
 * توليد مشهد الخلاصة
 * Generates the summary scene
 */
function buildSummaryScene(
  order: number,
  summaryAr: string,
  summaryEn: string,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `لنلخص ما تعلمناه في هذا الدرس: ${summaryAr.substring(0, 200)}`;
  const narrationEn = `Let's summarize what we learned in this lesson: ${summaryEn.substring(0, 200)}`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.summary;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("summary", order),
    order,
    type: "summary",
    narration,
    narrationEn,
    duration,
    visual: {
      type: "text",
      data: {
        summary: summaryAr,
        summaryEn: summaryEn,
        animation: "fadeIn",
      },
    },
    transition: getTransition("summary"),
  };
}

/**
 * توليد مشهد الخاتمة
 * Generates the outro scene
 */
function buildOutroScene(
  order: number,
  titleAr: string,
  titleEn: string,
  language: "ar" | "en"
): VideoScene {
  const narrationAr = `بهذا نكون قد انتهينا من درس ${titleAr}. شكراً لمتابعتكم ونراكم في الدرس القادم!`;
  const narrationEn = `And that concludes our lesson on ${titleEn}. Thank you for watching and see you in the next lesson!`;
  const narration = language === "ar" ? narrationAr : narrationEn;

  const limits = FIXED_DURATIONS.outro;
  const duration = calculateDuration(narration, language, limits.min, limits.max);

  return {
    id: generateSceneId("outro", order),
    order,
    type: "outro",
    narration,
    narrationEn,
    duration,
    visual: {
      type: "text",
      data: {
        text: "شكراً لمتابعتكم",
        textEn: "Thank you for watching",
        subtitle: "نراكم في الدرس القادم",
        subtitleEn: "See you in the next lesson",
        animation: "fadeOut",
      },
    },
    transition: getTransition("outro"),
  };
}

// ============================================================
// الدالة الرئيسية / Main Function
// ============================================================

/**
 * توليد نص فيديو تعليمي كامل من محتوى درس
 * Generates a complete educational video script from lesson content
 *
 * يقرأ المحتوى من قاعدة البيانات (المفاهيم، القوانين، الأمثلة، الأسئلة)
 * ويبني تسلسل مشاهد متكامل: مقدمة → عنوان → مفاهيم → قوانين → أمثلة → سؤال → خلاصة → خاتمة
 *
 * @param lessonId معرّف الدرس / Lesson identifier
 * @param options خيارات التوليد / Generation options
 * @returns نص الفيديو الكامل / Complete video script
 *
 * @throws {Error} إذا لم يتم العثور على الدرس
 *
 * @example
 * ```ts
 * const script = await generateVideoScript('lesson_123', {
 *   language: 'ar',
 *   maxDuration: 300,
 *   style: 'explainer',
 * });
 * console.log(`إجمالي المدة: ${script.totalDuration} ثانية`);
 * console.log(`عدد المشاهد: ${script.scenes.length}`);
 * ```
 */
export async function generateVideoScript(
  lessonId: string,
  options?: ScriptGeneratorOptions
): Promise<VideoScript> {
  const language = options?.language ?? "ar";
  const maxDuration = options?.maxDuration ?? 600; // 10 دقائق افتراضياً
  const style = options?.style ?? "explainer";

  // ─── قراءة بيانات الدرس من قاعدة البيانات / Fetch lesson data ───
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      Concept: { orderBy: { order: "asc" }, take: 8 },
      Formula: { orderBy: { order: "asc" }, take: 5 },
      Example: { orderBy: { order: "asc" }, take: 3 },
      Question: { orderBy: { order: "asc" }, take: 2 },
    },
  });

  if (!lesson) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\nLesson with ID "${lessonId}" not found.`
    );
  }

  const titleAr = lesson.titleAr;
  const titleEn = lesson.titleEn;
  const descriptionAr = lesson.descriptionAr || "";
  const descriptionEn = lesson.descriptionEn || "";
  const summaryAr = lesson.summaryAr || "";
  const summaryEn = lesson.summaryEn || "";

  const scenes: VideoScene[] = [];
  let order = 1;
  let totalDuration = 0;

  // ─── مقدمة / Intro ───
  const introScene = buildIntroScene(order++, titleAr, titleEn, style, language);
  scenes.push(introScene);
  totalDuration += introScene.duration;

  // ─── عنوان / Title ───
  const titleScene = buildTitleScene(order++, titleAr, titleEn, descriptionAr, descriptionEn, language);
  scenes.push(titleScene);
  totalDuration += titleScene.duration;

  // ─── مفاهيم / Concepts ───
  for (const concept of lesson.Concept) {
    if (totalDuration >= maxDuration) break;

    const scene = buildConceptScene(
      order++,
      concept.termAr,
      concept.termEn,
      concept.definitionAr,
      concept.definitionEn,
      language
    );
    scenes.push(scene);
    totalDuration += scene.duration;
  }

  // ─── قوانين / Formulas ───
  for (const formula of lesson.Formula) {
    if (totalDuration >= maxDuration) break;

    const scene = buildFormulaScene(
      order++,
      formula.formula,
      formula.explanationAr,
      formula.explanationEn,
      language
    );
    scenes.push(scene);
    totalDuration += scene.duration;
  }

  // ─── أمثلة / Examples ───
  for (const example of lesson.Example) {
    if (totalDuration >= maxDuration) break;

    const scene = buildExampleScene(
      order++,
      example.questionAr,
      example.questionEn,
      example.solutionAr,
      example.solutionEn,
      language
    );
    scenes.push(scene);
    totalDuration += scene.duration;
  }

  // ─── سؤال تفاعلي / Interactive Question ───
  if (lesson.Question.length > 0 && totalDuration < maxDuration) {
    const q = lesson.Question[0];
    const questionScene = buildQuestionScene(
      order++,
      q.questionAr,
      q.questionEn,
      q.answer,
      q.explanationAr,
      q.explanationEn,
      language
    );
    scenes.push(questionScene);
    totalDuration += questionScene.duration;
  }

  // ─── خلاصة / Summary ───
  if (totalDuration < maxDuration) {
    const summaryScene = buildSummaryScene(order++, summaryAr || descriptionAr, summaryEn || descriptionEn, language);
    scenes.push(summaryScene);
    totalDuration += summaryScene.duration;
  }

  // ─── خاتمة / Outro ───
  const outroScene = buildOutroScene(order++, titleAr, titleEn, language);
  scenes.push(outroScene);
  totalDuration += outroScene.duration;

  // ─── توليد تعليق محسّن بالذكاء الاصطناعي / AI-enhanced narration ───
  try {
    const enhancedScript = await enhanceNarrationsWithAI(scenes, titleAr, titleEn, language, style);
    scenes.length = 0;
    enhancedScript.forEach((s) => scenes.push(s));

    // إعادة حساب المدة الإجمالية بعد التحسين
    totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(
      `[ScriptGenerator] فشل تحسين التعليق بالذكاء الاصطناعي، استخدام النص الأساسي: ${msg}\n` +
      `[ScriptGenerator] AI narration enhancement failed, using base text: ${msg}`
    );
  }

  return {
    lessonId,
    title: titleEn,
    titleAr,
    totalDuration,
    scenes,
    language,
    style,
  };
}

// ============================================================
// تحسين التعليق بالذكاء الاصطناعي / AI Narration Enhancement
// ============================================================

/**
 * تحسين نصوص التعليق الصوتي باستخدام الذكاء الاصطناعي
 * Enhances narration texts using AI for more natural delivery
 */
async function enhanceNarrationsWithAI(
  scenes: VideoScene[],
  titleAr: string,
  titleEn: string,
  language: "ar" | "en",
  style: string
): Promise<VideoScene[]> {
  // تجميع نصوص المشاهد في طلب واحد للذكاء الاصطناعي
  const sceneDescriptions = scenes
    .map((s) => `[${s.type}] (مدة: ${s.duration} ثانية): ${s.narration}`)
    .join("\n");

  const prompt = language === "ar"
    ? `أنت كاتب نصوص فيديو تعليمي محترف. حسّن النصوص التالية لتكون أكثر سلاسة وجاذبية.
      عنوان الدرس: ${titleAr}
      نمط الفيديو: ${style}
      
      القواعد:
      1. أبقِ كل مشهد متسقاً مع نوعه
      2. اجعل النص طبيعياً وسهل النطق
      3. لا تزيد المدة الكلية بأكثر من 20%
      4. أجب بصيغة JSON فقط
      
      النصوص الحالية:
      ${sceneDescriptions}
      
      أجب بJSON بهذا الشكل فقط:
      [{"sceneIndex": 0, "narration": "النص المحسّن"}, ...]`
    : `You are a professional educational video scriptwriter. Enhance the following narrations to be smoother and more engaging.
      Lesson title: ${titleEn}
      Video style: ${style}
      
      Rules:
      1. Keep each scene consistent with its type
      2. Make the text natural and easy to narrate
      3. Don't increase total duration by more than 20%
      4. Answer in JSON format only
      
      Current narrations:
      ${sceneDescriptions}
      
      Answer with JSON only in this format:
      [{"sceneIndex": 0, "narration": "Enhanced text"}, ...]`;

  const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
    language,
    temperature: 0.7,
    timeout: 60_000,
  });

  // استخراج JSON من النتيجة
  const jsonMatch = result.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return scenes;
  }

  try {
    const enhancements: Array<{ sceneIndex: number; narration: string }> =
      JSON.parse(jsonMatch[0]);

    // تطبيق التحسينات على المشاهد
    const enhancedScenes = scenes.map((scene, index) => {
      const enhancement = enhancements.find((e) => e.sceneIndex === index);
      if (enhancement && enhancement.narration) {
        const newNarration = enhancement.narration;
        const limits = FIXED_DURATIONS[scene.type];
        return {
          ...scene,
          narration: newNarration,
          duration: calculateDuration(newNarration, language, limits.min, limits.max),
        };
      }
      return scene;
    });

    return enhancedScenes;
  } catch {
    return scenes;
  }
}
