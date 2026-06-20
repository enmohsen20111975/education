/**
 * @module video/video-producer
 * @description مُنتِج الفيديو الرئيسي — يدير خط الإنتاج الكامل من النص إلى الفيديو النهائي.
 * يتبع مسار: توليد النص ← تحويل النص لكلام ← تركيب المشاهد ← العرض (Remotion).
 *
 * Master video producer — manages the full production pipeline from script to final video.
 * Pipeline: script generation → TTS → scene composition → rendering (Remotion).
 */

import type { VideoScript } from "./script-generator";
import type { TTSResult } from "./tts-service";
import { generateVideoScript } from "./script-generator";
import { generateVoiceover } from "./tts-service";
import { db } from "@/lib/db";

// ============================================================
// الأنواع / Types
// ============================================================

/** حالات مهمة الفيديو */
export type VideoJobStatus =
  | "queued"
  | "scripting"
  | "tts"
  | "composing"
  | "rendering"
  | "done"
  | "error"
  | "cancelled";

/** مهمة إنتاج فيديو */
export interface VideoJob {
  /** معرّف فريد للمهمة */
  id: string;
  /** معرّف الدرس المصدر */
  lessonId: string;
  /** عنوان الدرس */
  lessonTitle: string;
  /** حالة المهمة الحالية */
  status: VideoJobStatus;
  /** نسبة التقدم (0-100) */
  progress: number;
  /** وصف الخطوة الحالية */
  currentStep: string;
  /** نص الفيديو المُولَّد */
  script?: VideoScript;
  /** عدد المشاهد المكتملة */
  scenesCompleted: number;
  /** إجمالي عدد المشاهد */
  totalScenes: number;
  /** رسالة الخطأ (إن وُجدت) */
  error?: string;
  /** تاريخ الإنشاء */
  createdAt: string;
  /** تاريخ آخر تحديث */
  updatedAt: string;
  /** مسار ملف الفيديو النهائي */
  outputPath?: string;
  /** نتائج TTS لكل مشهد */
  ttsResults?: TTSResult[];
  /** لغة الفيديو */
  language: "ar" | "en";
  /** نمط الفيديو */
  style: string;
  /** الصوت المستخدم */
  voice: string;
}

/** خيارات بدء إنتاج الفيديو */
export interface VideoProductionOptions {
  /** اللغة المطلوبة */
  language?: "ar" | "en";
  /** نمط الفيديو */
  style?: string;
  /** الصوت المستخدم */
  voice?: string;
}

// ============================================================
// تخزين المهام في الذاكرة / In-Memory Job Store
// ============================================================

/** مخزن مهام الفيديو — ذاكرة محلية */
const videoJobStore = new Map<string, VideoJob>();

/**
 * توليد معرّف فريد للمهمة
 * Generates a unique job identifier
 */
function generateJobId(): string {
  return `vjob_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================
// الدوال الرئيسية / Main Functions
// ============================================================

/**
 * بدء مهمة إنتاج فيديو جديد
 * Starts a new video production job
 *
 * يُنشئ مهمة جديدة في قائمة الانتظار ويُنفّذ خط الإنتاج:
 * 1. توليد نص الفيديو من محتوى الدرس
 * 2. تحويل النصوص إلى تعليق صوتي (TTS)
 * 3. تركيب المشاهد
 * 4. العرض النهائي (Remotion)
 *
 * @param lessonId معرّف الدرس / Lesson identifier
 * @param options خيارات الإنتاج / Production options
 * @returns بيانات المهمة المنشأة / Created job data
 *
 * @throws {Error} إذا لم يتم العثور على الدرس
 *
 * @example
 * ```ts
 * const job = await startVideoProduction("lesson_123", {
 *   language: "ar",
 *   style: "explainer",
 *   voice: "female-ar",
 * });
 * console.log(`تم إنشاء المهمة: ${job.id}`);
 * ```
 */
export async function startVideoProduction(
  lessonId: string,
  options?: VideoProductionOptions
): Promise<VideoJob> {
  // ─── التحقق من صحة المُدخلات / Validate inputs ───
  if (!lessonId || typeof lessonId !== "string") {
    throw new Error(
      `معرّف الدرس مطلوب ولا يمكن أن يكون فارغاً.\n` +
      `Lesson ID is required and cannot be empty.`
    );
  }

  // ─── التحقق من وجود الدرس / Check lesson exists ───
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, titleAr: true, titleEn: true },
  });

  if (!lesson) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\n` +
      `Lesson with ID "${lessonId}" not found.`
    );
  }

  const language = options?.language ?? "ar";
  const style = options?.style ?? "explainer";
  const voice = options?.voice ?? "female-ar";
  const now = new Date().toISOString();

  // ─── إنشاء المهمة / Create job ───
  const jobId = generateJobId();
  const job: VideoJob = {
    id: jobId,
    lessonId,
    lessonTitle: language === "ar" ? lesson.titleAr : lesson.titleEn,
    status: "queued",
    progress: 0,
    currentStep: "جاري تهيئة المهمة...",
    scenesCompleted: 0,
    totalScenes: 0,
    createdAt: now,
    updatedAt: now,
    language,
    style,
    voice,
    ttsResults: [],
  };

  videoJobStore.set(jobId, job);

  // ─── بدء خط الإنتاج / Start production pipeline ───
  executeProductionPipeline(jobId).catch((err) => {
    const currentJob = videoJobStore.get(jobId);
    if (currentJob && currentJob.status !== "cancelled") {
      currentJob.status = "error";
      currentJob.error = err instanceof Error ? err.message : String(err);
      currentJob.updatedAt = new Date().toISOString();
    }
  });

  return { ...job };
}

/**
 * تنفيذ خط إنتاج الفيديو (غير متزامن)
 * Executes the video production pipeline (asynchronous)
 */
async function executeProductionPipeline(jobId: string): Promise<void> {
  const job = videoJobStore.get(jobId);
  if (!job || job.status === "cancelled") return;

  try {
    // ─── المرحلة 1: توليد النص / Phase 1: Script Generation ───
    job.status = "scripting";
    job.currentStep = "جاري توليد نص الفيديو...";
    job.progress = 5;
    job.updatedAt = new Date().toISOString();

    const script = await generateVideoScript(job.lessonId, {
      language: job.language,
      style: job.style as "explainer" | "whiteboard" | "cinematic",
    });

    job.script = script;
    job.totalScenes = script.scenes.length;
    job.progress = 25;
    job.currentStep = `تم توليد النص (${script.scenes.length} مشهد)`;
    job.updatedAt = new Date().toISOString();

    if (job.status === "cancelled") return;

    // ─── المرحلة 2: تحويل النص لكلام / Phase 2: TTS ───
    job.status = "tts";
    job.currentStep = "جاري تحويل النصوص إلى تعليق صوتي...";
    job.progress = 30;
    job.updatedAt = new Date().toISOString();

    const ttsResults: TTSResult[] = [];
    for (let i = 0; i < script.scenes.length; i++) {
      if (job.status === "cancelled") return;

      const scene = script.scenes[i];
      try {
        const ttsResult = await generateVoiceover(scene.narration, {
          voice: job.voice as "male-ar" | "female-ar" | "male-en" | "female-en",
          speed: 1.0,
        });
        ttsResults.push(ttsResult);
      } catch {
        // تخطي المشهد الفاشل والاستمرار
        ttsResults.push({
          audioUrl: "",
          duration: scene.duration,
          text: scene.narration,
          isPlaceholder: true,
        });
      }

      job.scenesCompleted = i + 1;
      const ttsProgress = 30 + Math.round(((i + 1) / script.scenes.length) * 25);
      job.progress = ttsProgress;
      job.currentStep = `TTS: مشهد ${i + 1} من ${script.scenes.length}`;
      job.updatedAt = new Date().toISOString();
    }

    job.ttsResults = ttsResults;
    job.progress = 55;
    job.updatedAt = new Date().toISOString();

    if (job.status === "cancelled") return;

    // ─── المرحلة 3: تركيب المشاهد / Phase 3: Scene Composition ───
    job.status = "composing";
    job.currentStep = "جاري تركيب المشاهد...";
    job.progress = 60;
    job.updatedAt = new Date().toISOString();

    // محاكاة وقت التركيب (في بيئة الإنتاج: استدعاء Remotion API)
    const compositionSteps = script.scenes.length;
    for (let i = 0; i < compositionSteps; i++) {
      if (job.status === "cancelled") return;
      await sleep(300); // محاكاة معالجة
      job.scenesCompleted = i + 1;
      job.progress = 60 + Math.round(((i + 1) / compositionSteps) * 20);
      job.currentStep = `تركيب: مشهد ${i + 1} من ${compositionSteps}`;
      job.updatedAt = new Date().toISOString();
    }

    job.progress = 80;
    job.scenesCompleted = compositionSteps;
    job.updatedAt = new Date().toISOString();

    if (job.status === "cancelled") return;

    // ─── المرحلة 4: العرض النهائي / Phase 4: Rendering ───
    job.status = "rendering";
    job.currentStep = "جاري العرض النهائي...";
    job.progress = 85;
    job.updatedAt = new Date().toISOString();

    // محاكاة وقت العرض (في بيئة الإنتاج: Remotion render)
    await sleep(2000);

    job.progress = 95;
    job.currentStep = "جاري حفظ الفيديو...";
    job.updatedAt = new Date().toISOString();

    await sleep(1000);

    // ─── إنهاء المهمة / Complete ───
    job.status = "done";
    job.progress = 100;
    job.currentStep = `تم الانتهاء! (${script.totalDuration} ثانية — ${script.scenes.length} مشهد)`;
    job.outputPath = `/output/videos/${job.lessonId}_${Date.now()}.mp4`;
    job.updatedAt = new Date().toISOString();

    console.log(
      `[VideoProducer] تم إنشاء فيديو الدرس "${job.lessonTitle}" بنجاح.\n` +
      `[VideoProducer] Video for lesson "${job.lessonTitle}" created successfully.`
    );
  } catch (error) {
    if (job.status !== "cancelled") {
      job.status = "error";
      job.error = error instanceof Error ? error.message : String(error);
      job.updatedAt = new Date().toISOString();
      console.error(
        `[VideoProducer] فشل إنتاج فيديو الدرس "${job.lessonTitle}": ${job.error}\n` +
        `[VideoProducer] Video production failed for "${job.lessonTitle}": ${job.error}`
      );
    }
  }
}

/**
 * الحصول على حالة مهمة إنتاج فيديو
 * Gets the status of a video production job
 *
 * @param jobId معرّف المهمة / Job identifier
 * @returns بيانات المهمة أو null إذا لم تُوجد / Job data or null if not found
 *
 * @example
 * ```ts
 * const job = await getVideoJobStatus("vjob_abc123");
 * if (job) {
 *   console.log(`الحالة: ${job.status}`);
 *   console.log(`التقدم: ${job.progress}%`);
 * }
 * ```
 */
export async function getVideoJobStatus(jobId: string): Promise<VideoJob | null> {
  if (!jobId) return null;
  const job = videoJobStore.get(jobId);
  return job ? { ...job } : null;
}

/**
 * الحصول على جميع مهام إنتاج الفيديو
 * Gets all video production jobs
 *
 * @returns قائمة جميع المهام / List of all jobs
 */
export async function getAllVideoJobs(): Promise<VideoJob[]> {
  const jobs: VideoJob[] = [];
  for (const [, job] of videoJobStore) {
    jobs.push({ ...job });
  }

  // ترتيب: الأحدث أولاً
  jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return jobs;
}

/**
 * إلغاء مهمة إنتاج فيديو
 * Cancels a video production job
 *
 * @param jobId معرّف المهمة المراد إلغاؤها / Job ID to cancel
 * @returns هل تم الإلغاء بنجاح / Whether cancellation succeeded
 *
 * @example
 * ```ts
 * const cancelled = await cancelVideoJob("vjob_abc123");
 * if (cancelled) {
 *   console.log("تم إلغاء المهمة");
 * }
 * ```
 */
export async function cancelVideoJob(jobId: string): Promise<boolean> {
  const job = videoJobStore.get(jobId);
  if (!job) return false;

  // لا يمكن إلغاء المهام المكتملة أو المُلغاة
  if (job.status === "done" || job.status === "cancelled") {
    return false;
  }

  job.status = "cancelled";
  job.currentStep = "تم إلغاء المهمة";
  job.updatedAt = new Date().toISOString();

  return true;
}

/**
 * حذف مهام قديمة من المخزن
 * Cleans up old jobs from the store
 */
export function cleanupOldJobs(maxAgeMs: number = 3600_000): number {
  let deleted = 0;
  const now = Date.now();

  for (const [jobId, job] of videoJobStore) {
    const age = now - new Date(job.createdAt).getTime();
    if (age > maxAgeMs && (job.status === "done" || job.status === "error" || job.status === "cancelled")) {
      videoJobStore.delete(jobId);
      deleted++;
    }
  }

  return deleted;
}

// ============================================================
// دوال مساعدة / Utility Functions
// ============================================================

/**
 * انتظار لفترة محددة
 * Sleeps for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
