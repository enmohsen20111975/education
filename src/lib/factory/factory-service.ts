/**
 * خدمة المصنع — جسر بين لوحة التحكم وقاعدة بيانات المنصة الرئيسية
 * @module factory/factory-service
 *
 * توفر هذه الخدمة واجهة موحدة لقراءة إحصائيات المحتوى التعليمي
 * وإدارة مهام توليد المحتوى بالذكاء الاصطناعي وتصدير الدروس.
 */

import { db } from "@/lib/db";

// ============================================================
// الأنواع (Types)
// ============================================================

/** أنواع المحتوى القابلة للتوليد بالذكاء الاصطناعي */
export type ContentType =
  | "concepts"
  | "formulas"
  | "examples"
  | "questions"
  | "objectives"
  | "mindmap"
  | "infographic"
  | "video";

/** إحصائيات المصنع الشاملة */
export interface FactoryStats {
  totalLessons: number;
  lessonsWithContent: number;
  lessonsWithoutContent: number;
  totalConcepts: number;
  totalFormulas: number;
  totalQuestions: number;
  totalExamples: number;
  aiModelsAvailable: {
    lmStudio: boolean;
    ollama: boolean;
  };
  syncStatus: "connected" | "disconnected";
}

/** عنصر في قائمة الانتظار */
export interface ProcessingItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  contentType: ContentType;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

/** مهمة توليد محتوى */
export interface GenerationJob {
  jobId: string;
  lessonId: string;
  lessonTitle: string;
  types: ContentType[];
  status: "queued";
  createdAt: string;
}

/** حالة مهمة التوليد */
export interface GenerationJobStatus {
  jobId: string;
  lessonId: string;
  lessonTitle: string;
  types: ContentType[];
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  results: ContentTypeResult[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

/** نتيجة توليد نوع محتوى معين */
export interface ContentTypeResult {
  type: ContentType;
  status: "pending" | "processing" | "completed" | "failed";
  count?: number;
  error?: string;
}

/** تصدير درس للاستخدام الخارجي */
export interface LessonExport {
  lessonId: string;
  lessonTitle: string;
  lessonDescription: string;
  unitName: string;
  subjectName: string;
  objectives: Array<{ textAr: string; textEn: string }>;
  concepts: Array<{
    termAr: string;
    termEn: string;
    definitionAr: string;
    definitionEn: string;
  }>;
  formulas: Array<{
    formula: string;
    explanationAr: string;
    explanationEn: string;
  }>;
  examples: Array<{
    questionAr: string;
    questionEn: string;
    solutionAr: string;
    solutionEn: string;
    stepsAr: string;
    stepsEn: string;
  }>;
  questions: Array<{
    type: string;
    questionAr: string;
    questionEn: string;
    optionsAr?: string | null;
    optionsEn?: string | null;
    answer: string;
    explanationAr?: string | null;
    explanationEn?: string | null;
    points: number;
    difficulty: string;
  }>;
  mindMap?: Record<string, unknown> | null;
  infographic?: Record<string, unknown> | null;
  exportedAt: string;
}

// ============================================================
// تخزين مهام التوليد في الذاكرة (In-Memory Job Store)
// ============================================================

interface StoredJob {
  jobId: string;
  lessonId: string;
  lessonTitle: string;
  types: ContentType[];
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  results: ContentTypeResult[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

/** مخزن مهام التوليد — ذاكرة محلية */
const jobStore = new Map<string, StoredJob>();

/**
 * توليد معرّف فريد للمهمة
 * @returns معرّف سلسلة نصية فريد
 */
function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================
// الدوال الرئيسية
// ============================================================

/**
 * الحصول على إحصائيات المصنع الشاملة
 * يقرأ البيانات من قاعدة البيانات الرئيسية ويُجمّعها.
 *
 * @returns وعد يحتوي على إحصائيات المصنع
 * @throws {Error} في حالة فشل الاتصال بقاعدة البيانات
 */
export async function getFactoryStats(): Promise<FactoryStats> {
  try {
    // استعلامات متوازية لتحسين الأداء
    const [
      totalLessons,
      lessonsWithContent,
      totalConcepts,
      totalFormulas,
      totalQuestions,
      totalExamples,
    ] = await Promise.all([
      db.lesson.count(),
      // دروس تحتوي على محتوى واحد على الأقل
      db.lesson.count({
        where: {
          OR: [
            { Concept: { some: {} } },
            { Formula: { some: {} } },
            { Example: { some: {} } },
            { Question: { some: {} } },
            { Objective: { some: {} } },
          ],
        },
      }),
      db.concept.count(),
      db.formula.count(),
      db.question.count(),
      db.example.count(),
    ]);

    // التحقق من توفر نماذج الذكاء الاصطناعي عبر فحص بيئة التشغيل
    const aiModelsAvailable = {
      lmStudio: !!process.env.LM_STUDIO_URL || false,
      ollama: !!process.env.OLLAMA_URL || false,
    };

    return {
      totalLessons,
      lessonsWithContent,
      lessonsWithoutContent: totalLessons - lessonsWithContent,
      totalConcepts,
      totalFormulas,
      totalQuestions,
      totalExamples,
      aiModelsAvailable,
      syncStatus: "connected",
    };
  } catch (error) {
    // إذا فشل الاتصال بقاعدة البيانات
    return {
      totalLessons: 0,
      lessonsWithContent: 0,
      lessonsWithoutContent: 0,
      totalConcepts: 0,
      totalFormulas: 0,
      totalQuestions: 0,
      totalExamples: 0,
      aiModelsAvailable: { lmStudio: false, ollama: false },
      syncStatus: "disconnected",
    };
  }
}

/**
 * الحصول على قائمة الانتظار الحالية
 * يُرجع جميع المهام النشطة والمعلقة مع حالتها الحالية.
 *
 * @returns وعد يحتوي على قائمة عناصر الانتظار
 */
export async function getProcessingQueue(): Promise<ProcessingItem[]> {
  const items: ProcessingItem[] = [];

  for (const [, job] of jobStore) {
    // تحويل كل نوع محتوى إلى عنصر منفصل في قائمة الانتظار
    for (const type of job.types) {
      const result = job.results.find((r) => r.type === type);
      items.push({
        id: `${job.jobId}_${type}`,
        lessonId: job.lessonId,
        lessonTitle: job.lessonTitle,
        contentType: type,
        status: result?.status ?? job.status,
        progress: job.progress,
        createdAt: job.createdAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        error: result?.error ?? job.error,
      });
    }
  }

  // ترتيب: قيد التشغيل أولاً، ثم المعلقة، ثم المكتملة، ثم الفاشلة
  const statusOrder: Record<string, number> = {
    processing: 0,
    queued: 1,
    completed: 2,
    failed: 3,
  };

  items.sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));

  return items;
}

/**
 * بدء توليد محتوى بالذكاء الاصطناعي لدرس معين
 * يُنشئ مهمة جديدة في قائمة الانتظار ويُعيّن حالة "في الانتظار".
 *
 * @param lessonId - معرّف الدرس المراد توليد محتواه
 * @param types - أنواع المحتوى المطلوب توليدها
 * @returns وعد يحتوي على بيانات المهمة المنشأة
 * @throws {Error} إذا لم يتم العثور على الدرس أو كانت الأنواع فارغة
 */
export async function startContentGeneration(
  lessonId: string,
  types: ContentType[],
): Promise<GenerationJob> {
  if (!lessonId || typeof lessonId !== "string") {
    throw new Error("معرّف الدرس مطلوب ولا يمكن أن يكون فارغاً");
  }

  if (!types || types.length === 0) {
    throw new Error("يجب تحديد نوع واحد على الأقل من المحتوى للتوليد");
  }

  // التحقق من وجود الدرس في قاعدة البيانات
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, titleAr: true, titleEn: true },
  });

  if (!lesson) {
    throw new Error(`الدرس ذو المعرّف "${lessonId}" غير موجود`);
  }

  const jobId = generateJobId();
  const now = new Date().toISOString();

  const job: StoredJob = {
    jobId,
    lessonId,
    lessonTitle: lesson.titleAr || lesson.titleEn,
    types: [...types],
    status: "queued",
    progress: 0,
    results: types.map((type) => ({
      type,
      status: "pending" as const,
    })),
    createdAt: now,
  };

  jobStore.set(jobId, job);

  // محاكاة بدء المعالجة بعد تأخير قصير
  _simulateProcessing(jobId);

  return {
    jobId,
    lessonId,
    lessonTitle: job.lessonTitle,
    types: [...types],
    status: "queued",
    createdAt: now,
  };
}

/**
 * محاكاة معالجة المهمة (لأغراض العرض التوضيحي)
 * في بيئة الإنتاج سيتم استبدال هذا بمهام توليد فعلية.
 *
 * @param jobId - معرّف المهمة المراد معالجتها
 */
async function _simulateProcessing(jobId: string): Promise<void> {
  const job = jobStore.get(jobId);
  if (!job) return;

  // انتظار قبل البدء
  await new Promise((resolve) => setTimeout(resolve, 1500));

  job.status = "processing";
  job.startedAt = new Date().toISOString();

  for (let i = 0; i < job.results.length; i++) {
    const result = job.results[i];
    result.status = "processing";
    job.progress = Math.round(((i) / job.results.length) * 100);

    // محاكاة وقت المعالجة
    await new Promise((resolve) => setTimeout(resolve, 2000));

    result.status = "completed";
    result.count = Math.floor(Math.random() * 8) + 2;
  }

  job.progress = 100;
  job.status = "completed";
  job.completedAt = new Date().toISOString();
}

/**
 * التحقق من حالة مهمة التوليد
 *
 * @param jobId - معرّف المهمة المراد التحقق من حالتها
 * @returns وعد يحتوي على حالة المهمة التفصيلية
 * @throws {Error} إذا لم يتم العثور على المهمة
 */
export async function getContentGenerationStatus(
  jobId: string,
): Promise<GenerationJobStatus> {
  const job = jobStore.get(jobId);

  if (!job) {
    throw new Error(`المهمة ذو المعرّف "${jobId}" غير موجودة`);
  }

  return {
    jobId: job.jobId,
    lessonId: job.lessonId,
    lessonTitle: job.lessonTitle,
    types: [...job.types],
    status: job.status,
    progress: job.progress,
    results: job.results.map((r) => ({ ...r })),
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    error: job.error,
  };
}

/**
 * تصدير محتوى درس للاستخدام الخارجي
 * يجمع جميع المحتوى المرتبط بالدرس في كائن واحد شامل.
 *
 * @param lessonId - معرّف الدرس المراد تصديره
 * @returns وعد يحتوي على بيانات الدرس الكاملة
 * @throws {Error} إذا لم يتم العثور على الدرس
 */
export async function exportLessonContent(lessonId: string): Promise<LessonExport> {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      Concept: { orderBy: { order: "asc" } },
      Formula: { orderBy: { order: "asc" } },
      Example: { orderBy: { order: "asc" } },
      Question: { orderBy: { order: "asc" } },
      Objective: { orderBy: { order: "asc" } },
      Unit: {
        include: {
          Subject: true,
        },
      },
      MindMap: true,
      Infographic: true,
    },
  });

  if (!lesson) {
    throw new Error(`الدرس ذو المعرّف "${lessonId}" غير موجود`);
  }

  // تحليل بيانات الخريطة الذهنية إن وُجدت
  let mindMap: Record<string, unknown> | null = null;
  if (lesson.MindMap.length > 0) {
    try {
      mindMap = JSON.parse(lesson.MindMap[0].data);
    } catch {
      mindMap = { raw: lesson.MindMap[0].data };
    }
  }

  // تحليل بيانات الإنفوجرافيك إن وُجد
  let infographic: Record<string, unknown> | null = null;
  if (lesson.Infographic.length > 0) {
    try {
      infographic = JSON.parse(lesson.Infographic[0].data);
    } catch {
      infographic = { raw: lesson.Infographic[0].data, type: lesson.Infographic[0].type };
    }
  }

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.titleAr || lesson.titleEn,
    lessonDescription: lesson.descriptionAr || lesson.descriptionEn,
    unitName: lesson.Unit.nameAr || lesson.Unit.nameEn,
    subjectName: lesson.Unit.Subject?.nameAr || lesson.Unit.Subject?.nameEn || "",
    objectives: lesson.Objective.map((o) => ({
      textAr: o.textAr,
      textEn: o.textEn,
    })),
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
    examples: lesson.Example.map((e) => ({
      questionAr: e.questionAr,
      questionEn: e.questionEn,
      solutionAr: e.solutionAr,
      solutionEn: e.solutionEn,
      stepsAr: e.stepsAr,
      stepsEn: e.stepsEn,
    })),
    questions: lesson.Question.map((q) => ({
      type: q.type,
      questionAr: q.questionAr,
      questionEn: q.questionEn,
      optionsAr: q.optionsAr,
      optionsEn: q.optionsEn,
      answer: q.answer,
      explanationAr: q.explanationAr,
      explanationEn: q.explanationEn,
      points: q.points,
      difficulty: q.difficulty,
    })),
    mindMap,
    infographic,
    exportedAt: new Date().toISOString(),
  };
}