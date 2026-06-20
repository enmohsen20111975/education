'use server';

/**
 * @module model-router
 * @description موجّه النماذج الذكية — يوجّه المهام إلى النموذج المناسب تلقائيًا.
 * يدعم سلسلة تراجع إذا فشل النموذج الأساسي، مع مراعاة استخدام الموارد لمنع
 * تشغيل نموذجين ثقيلين في وقت واحد.
 *
 * Smart model router — automatically routes tasks to the appropriate AI model.
 * Supports fallback chains if the primary model fails, with resource awareness to
 * prevent running two heavy models simultaneously.
 */

import { lmStudioRequest, lmStudioHealth } from './lm-studio';
import { ollamaRequest, ollamaHealth } from './ollama';

// ============================================================
// الأنواع / Types
// ============================================================

/**
 * أنواع المهام المدعومة
 * Supported task types
 */
export enum TaskType {
  /** توليد النصوص العامة */
  TEXT_GENERATION = 'TEXT_GENERATION',
  /** توليد الأكواد البرمجية */
  CODE_GENERATION = 'CODE_GENERATION',
  /** مراجعة المحتوى التعليمي */
  CONTENT_REVIEW = 'CONTENT_REVIEW',
  /** تصنيف سريع */
  FAST_CLASSIFICATION = 'FAST_CLASSIFICATION',
  /** استخراج المعادلات الرياضية */
  FORMULA_EXTRACTION = 'FORMULA_EXTRACTION',
  /** توليد الأسئلة */
  QUESTION_GENERATION = 'QUESTION_GENERATION',
  /** الترجمة */
  TRANSLATION = 'TRANSLATION',
  /** وصف الصور */
  IMAGE_DESCRIPTION = 'IMAGE_DESCRIPTION',
}

/** خيارات التوليد */
export interface GenerateOptions {
  /** تجاوز التوجيه التلقائي واستخدام نموذج محدد */
  preferModel?: string;
  /** اللغة المطلوبة للإخراج */
  language?: 'ar' | 'en';
  /** مهلة مخصصة بالمللي ثانية */
  timeout?: number;
  /** درجة حرارة مخصصة */
  temperature?: number;
  /** الحد الأقصى للرموز (LM Studio فقط) */
  maxTokens?: number;
}

/** نتيجة التوليد */
export interface GenerationResult {
  /** النص المُ gererated */
  text: string;
  /** اسم النموذج المستخدم */
  model: string;
  /** نوع المهمة */
  taskType: string;
  /** مدة التوليد بالمللي ثانية */
  duration: number;
  /** عدد الرموز المستهلكة (إن توفرت) */
  tokens?: number;
}

/** وصف توجيه النموذج */
interface ModelRoute {
  /** النموذج الأساسي */
  primary: string;
  /** مزود النموذج الأساسي */
  primaryProvider: 'lm-studio' | 'ollama';
  /** النموذج البديل */
  fallback: string;
  /** مزود النموذج البديل */
  fallbackProvider: 'lm-studio' | 'ollama';
  /** هل النموذج ثقيل على الموارد */
  isHeavy: boolean;
  /** المهلة بالمللي ثانية */
  timeout: number;
}

// ============================================================
// ثوابت التوجيه / Routing Constants
// ============================================================

/**
 * خريطة توجيه المهام إلى النماذج
 * Task-to-model routing map
 */
const TASK_ROUTES: Record<TaskType, ModelRoute> = {
  [TaskType.TEXT_GENERATION]: {
    primary: 'qwen2.5-7b-instruct',
    primaryProvider: 'lm-studio',
    fallback: 'qwen2.5-coder:7b',
    fallbackProvider: 'ollama',
    isHeavy: false,
    timeout: 120_000,
  },
  [TaskType.CODE_GENERATION]: {
    primary: 'qwen2.5-coder:7b',
    primaryProvider: 'ollama',
    fallback: 'qwen2.5-7b-instruct',
    fallbackProvider: 'lm-studio',
    isHeavy: false,
    timeout: 180_000,
  },
  [TaskType.CONTENT_REVIEW]: {
    primary: 'scaled-oss-36b',
    primaryProvider: 'lm-studio',
    fallback: 'deepseek-coder-v2:16b',
    fallbackProvider: 'ollama',
    isHeavy: true,
    timeout: 180_000,
  },
  [TaskType.FAST_CLASSIFICATION]: {
    primary: 'qwen3-1.7b',
    primaryProvider: 'lm-studio',
    fallback: 'qwen2.5-coder:7b',
    fallbackProvider: 'ollama',
    isHeavy: false,
    timeout: 60_000,
  },
  [TaskType.FORMULA_EXTRACTION]: {
    primary: 'qwen2.5-7b-instruct',
    primaryProvider: 'lm-studio',
    fallback: 'qwen2.5-coder:7b',
    fallbackProvider: 'ollama',
    isHeavy: false,
    timeout: 120_000,
  },
  [TaskType.QUESTION_GENERATION]: {
    primary: 'qwen2.5-7b-instruct',
    primaryProvider: 'lm-studio',
    fallback: 'qwen2.5-coder:7b',
    fallbackProvider: 'ollama',
    isHeavy: false,
    timeout: 120_000,
  },
  [TaskType.TRANSLATION]: {
    primary: 'qwen2.5-7b-instruct',
    primaryProvider: 'lm-studio',
    fallback: 'qwen2.5-coder:7b',
    fallbackProvider: 'ollama',
    isHeavy: false,
    timeout: 120_000,
  },
  [TaskType.IMAGE_DESCRIPTION]: {
    primary: 'qwen2.5-coder:7b',
    primaryProvider: 'ollama',
    fallback: 'qwen2.5-7b-instruct',
    fallbackProvider: 'lm-studio',
    isHeavy: false,
    timeout: 180_000,
  },
};

// ============================================================
// إدارة الموارد / Resource Management
// ============================================================

/** تتبع المهام الثقيلة الجارية */
let heavyModelRunning = false;

/** تتبع آخر استخدام لكل مزود */
const lastUsedTimestamps: Record<string, number> = {
  'lm-studio': 0,
  'ollama': 0,
};

/** الحد الأدنى للفاصل الزمني بين الطلبات المتتالية (مللي ثانية) */
const COOLDOWN_MS = 500;

/**
 * التحقق مما إذا كان يمكن بدء مهمة ثقيلة
 * Checks if a heavy task can be started
 */
function canStartHeavyTask(): boolean {
  return !heavyModelRunning;
}

/**
 * تعيين حالة المهمة الثقيلة
 * Sets the heavy task state
 */
function setHeavyTaskRunning(running: boolean): void {
  heavyModelRunning = running;
}

/**
 * الانتظار حتى انتهاء الفترة الباردة للمزود
 * Waits until the provider cooldown period ends
 */
async function waitForCooldown(provider: string): Promise<void> {
  const lastUsed = lastUsedTimestamps[provider] ?? 0;
  const elapsed = Date.now() - lastUsed;
  if (elapsed < COOLDOWN_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, COOLDOWN_MS - elapsed)
    );
  }
  lastUsedTimestamps[provider] = Date.now();
}

// ============================================================
// الدوال الأساسية / Core Functions
// ============================================================

/**
 * إرسال طلب إلى LM Studio مع معالجة الأخطاء
 * Sends a request to LM Studio with error handling
 */
async function callLmStudio(
  prompt: string,
  model: string,
  timeout: number,
  temperature?: number,
  maxTokens?: number
): Promise<string> {
  await waitForCooldown('lm-studio');
  return lmStudioRequest(prompt, {
    model,
    temperature,
    maxTokens,
    timeout,
  });
}

/**
 * إرسال طلب إلى Ollama مع معالجة الأخطاء
 * Sends a request to Ollama with error handling
 */
async function callOllama(
  prompt: string,
  model: string,
  timeout: number,
  temperature?: number
): Promise<string> {
  await waitForCooldown('ollama');
  return ollamaRequest(prompt, {
    model,
    temperature,
    timeout,
  });
}

/**
 * إنشاء بادئة النظام حسب نوع المهمة واللغة
 * Creates a system prefix based on task type and language
 */
function buildSystemPrefix(taskType: TaskType, language?: 'ar' | 'en'): string {
  const isArabic = language !== 'en';

  const taskPrompts: Record<TaskType, { ar: string; en: string }> = {
    [TaskType.TEXT_GENERATION]: {
      ar: 'أنت مساعد تعليمي متخصص في توليد المحتوى التعليمي. أجب باللغة العربية.',
      en: 'You are an educational assistant specialized in generating educational content. Answer in English.',
    },
    [TaskType.CODE_GENERATION]: {
      ar: 'أنت مبرمج خبير متخصص في كتابة الأكواد البرمجية. اكتب تعليقات توضيحية بالعربية.',
      en: 'You are an expert programmer specialized in writing code. Write clear comments in English.',
    },
    [TaskType.CONTENT_REVIEW]: {
      ar: 'أنت مراجع أكاديمي محترف. راجع المحتوى التعليمي وقدم ملاحظات دقيقة باللغة العربية.',
      en: 'You are a professional academic reviewer. Review educational content and provide detailed feedback in English.',
    },
    [TaskType.FAST_CLASSIFICATION]: {
      ar: 'صنّف المحتوى التالي بسرعة. أجب بتصنيف واحد فقط.',
      en: 'Classify the following content quickly. Answer with a single classification only.',
    },
    [TaskType.FORMULA_EXTRACTION]: {
      ar: 'استخرج جميع المعادلات الرياضية والصيغ العلمية من النص التالي.',
      en: 'Extract all mathematical equations and scientific formulas from the following text.',
    },
    [TaskType.QUESTION_GENERATION]: {
      ar: 'أنت معلم خبير في طرح الأسئلة التعليمية. أنشئ أسئلة متنوعة وواضحة.',
      en: 'You are an expert teacher in asking educational questions. Create diverse and clear questions.',
    },
    [TaskType.TRANSLATION]: {
      ar: 'أنت مترجم محترف. ترجم المحتوى بدقة مع الحفاظ على المعنى التعليمي.',
      en: 'You are a professional translator. Translate the content accurately while preserving the educational meaning.',
    },
    [TaskType.IMAGE_DESCRIPTION]: {
      ar: 'صِف المحتوى التعليمي المرتبط بالصورة بدقة.',
      en: 'Describe the educational content related to the image accurately.',
    },
  };

  const taskPrompt = taskPrompts[taskType];
  return isArabic ? taskPrompt.ar : taskPrompt.en;
}

/**
 * توليد المحتوى باستخدام النموذج المناسب تلقائيًا
 * Generates content using the automatically selected appropriate model
 *
 * @param task نوع المهمة / Task type
 * @param prompt النص المُدخل / The input prompt
 * @param options خيارات إضافية / Additional options
 * @returns نتيجة التوليد / Generation result
 *
 * @example
 * ```ts
 * const result = await generateContent(
 *   TaskType.TEXT_GENERATION,
 *   'اشرح قانون نيوتن الثاني بالتفصيل',
 *   { language: 'ar' }
 * );
 * console.log(result.text);    // النص المُولَّد
 * console.log(result.model);   // qwen2.5-7b-instruct
 * console.log(result.duration); // المدة بالمللي ثانية
 * ```
 */
export async function generateContent(
  task: TaskType,
  prompt: string,
  options?: GenerateOptions
): Promise<GenerationResult> {
  const startTime = Date.now();
  const route = TASK_ROUTES[task];

  if (!route) {
    throw new Error(
      `نوع مهمة غير معروف: "${task}".\n` +
      `Unknown task type: "${task}".`
    );
  }

  // إذا طلب المستخدم نموذجًا محددًا، نستخدمه مباشرة
  if (options?.preferModel) {
    const preferredModel = options.preferModel;
    try {
      let text: string;
      if (preferredModel.includes('coder') || preferredModel.includes('deepseek')) {
        text = await callOllama(
          prompt,
          preferredModel,
          options?.timeout ?? route.timeout,
          options?.temperature
        );
      } else {
        text = await callLmStudio(
          prompt,
          preferredModel,
          options?.timeout ?? route.timeout,
          options?.temperature,
          options?.maxTokens
        );
      }
      return {
        text,
        model: preferredModel,
        taskType: task,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      // إذا فشل النموذج المفضل، نستمر بالتوجيه العادي
      const errMsg = error instanceof Error ? error.message : String(error);
      // لا نرمي الخطأ — ننتقل للنموذج الأساسي
    }
  }

  // التحقق من الموارد للمهام الثقيلة
  if (route.isHeavy && !canStartHeavyTask()) {
    // إذا كانت هناك مهمة ثقيلة جارية، نستخدم النموذج البديل مباشرة
    const fallbackPrompt = buildSystemPrefix(task, options?.language) + '\n\n' + prompt;
    try {
      const text = await callProvider(
        route.fallbackProvider,
        route.fallback,
        fallbackPrompt,
        options?.timeout ?? route.timeout,
        options?.temperature,
        options?.maxTokens
      );
      return {
        text,
        model: route.fallback,
        taskType: task,
        duration: Date.now() - startTime,
      };
    } catch (fallbackError) {
      throw buildFinalError(task, route, fallbackError);
    }
  }

  // محاولة استخدام النموذج الأساسي
  const systemPrefix = buildSystemPrefix(task, options?.language);
  const fullPrompt = systemPrefix + '\n\n' + prompt;

  if (route.isHeavy) {
    setHeavyTaskRunning(true);
  }

  try {
    const text = await callProvider(
      route.primaryProvider,
      route.primary,
      fullPrompt,
      options?.timeout ?? route.timeout,
      options?.temperature,
      options?.maxTokens
    );

    return {
      text,
      model: route.primary,
      taskType: task,
      duration: Date.now() - startTime,
    };
  } catch (primaryError) {
    // محاولة النموذج البديل (سلسلة التراجع)
    try {
      const text = await callProvider(
        route.fallbackProvider,
        route.fallback,
        fullPrompt,
        options?.timeout ?? route.timeout,
        options?.temperature,
        options?.maxTokens
      );

      return {
        text,
        model: route.fallback,
        taskType: task,
        duration: Date.now() - startTime,
      };
    } catch (fallbackError) {
      throw buildFinalError(task, route, fallbackError, primaryError);
    }
  } finally {
    if (route.isHeavy) {
      setHeavyTaskRunning(false);
    }
  }
}

/**
 * استدعاء مزود النموذج المناسب
 * Calls the appropriate model provider
 */
async function callProvider(
  provider: 'lm-studio' | 'ollama',
  model: string,
  prompt: string,
  timeout: number,
  temperature?: number,
  maxTokens?: number
): Promise<string> {
  if (provider === 'lm-studio') {
    return callLmStudio(prompt, model, timeout, temperature, maxTokens);
  }
  return callOllama(prompt, model, timeout, temperature);
}

/**
 * بناء رسالة خطأ نهائية
 * Builds a final error message
 */
function buildFinalError(
  task: TaskType,
  route: ModelRoute,
  fallbackError: unknown,
  primaryError?: unknown
): Error {
  const primaryMsg = primaryError instanceof Error ? primaryError.message : String(primaryError);
  const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);

  return new Error(
    `فشل توليد المحتوى لنوع المهمة "${task}".\n` +
    `النموذج الأساسي (${route.primary}): ${primaryMsg}\n` +
    `النموذج البديل (${route.fallback}): ${fallbackMsg}\n\n` +
    `Failed to generate content for task type "${task}".\n` +
    `Primary model (${route.primary}): ${primaryMsg}\n` +
    `Fallback model (${route.fallback}): ${fallbackMsg}`
  );
}

// ============================================================
// دوال الاستعلام / Query Functions
// ============================================================

/**
 * الحصول على خريطة التوجيه الكاملة
 * Gets the complete routing map
 *
 * @returns خريطة التوجيه / The routing map
 */
export function getRoutingMap(): Record<string, ModelRoute> {
  const result: Record<string, ModelRoute> = {};
  for (const [key, value] of Object.entries(TASK_ROUTES)) {
    result[key] = { ...value };
  }
  return result;
}

/**
 * الحصول على النموذج الأساسي لنوع مهمة محدد
 * Gets the primary model for a specific task type
 *
 * @param task نوع المهمة / Task type
 * @returns اسم النموذج الأساسي / Primary model name
 */
export function getPrimaryModel(task: TaskType): string {
  return TASK_ROUTES[task]?.primary ?? '';
}

/**
 * الحصول على حالة جميع النماذج
 * Gets the status of all models
 */
export async function getFullSystemHealth(): Promise<{
  lmStudio: Awaited<ReturnType<typeof lmStudioHealth>>;
  ollama: Awaited<ReturnType<typeof ollamaHealth>>;
  system: {
    gpuAvailable: boolean;
    ramFree: string;
  };
}> {
  // فحص الخدمتين بالتوازي
  const [lmStudioStatus, ollamaStatus] = await Promise.all([
    lmStudioHealth().catch(() => ({
      available: false,
      model: '',
      error: 'فشل فحص LM Studio / LM Studio health check failed',
    })),
    ollamaHealth().catch(() => ({
      available: false,
      models: [] as string[],
      error: 'فشل فحص Ollama / Ollama health check failed',
    })),
  ]);

  // تقدير حالة النظام
  const anyAvailable = lmStudioStatus.available || ollamaStatus.available;

  // محاولة قراءة معلومات الذاكرة من بيئة لينكس
  let ramFree = 'غير متاح / N/A';
  try {
    const os = await import('os');
    const freeRamBytes = os.freemem();
    const freeRamGB = (freeRamBytes / (1024 * 1024 * 1024)).toFixed(1);
    ramFree = `${freeRamGB}GB`;
  } catch {
    // لا يمكن قراءة معلومات النظام
  }

  return {
    lmStudio: lmStudioStatus,
    ollama: ollamaStatus,
    system: {
      gpuAvailable: anyAvailable,
      ramFree,
    },
  };
}

/**
 * الحصول على وصف عربي لنوع المهمة
 * Gets an Arabic description for a task type
 */
export function getTaskTypeLabel(task: TaskType): string {
  const labels: Record<TaskType, string> = {
    [TaskType.TEXT_GENERATION]: 'توليد النصوص',
    [TaskType.CODE_GENERATION]: 'توليد الأكواد',
    [TaskType.CONTENT_REVIEW]: 'مراجعة المحتوى',
    [TaskType.FAST_CLASSIFICATION]: 'تصنيف سريع',
    [TaskType.FORMULA_EXTRACTION]: 'استخراج المعادلات',
    [TaskType.QUESTION_GENERATION]: 'توليد الأسئلة',
    [TaskType.TRANSLATION]: 'الترجمة',
    [TaskType.IMAGE_DESCRIPTION]: 'وصف الصور',
  };
  return labels[task] ?? task;
}