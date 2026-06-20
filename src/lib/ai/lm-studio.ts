'use server';

/**
 * @module lm-studio
 * @description غلاف TypeScript للتواصل مع واجهة برمجة تطبيقات LM Studio المحلية.
 * يوفر وظائف إرسال الطلبات إلى نماذج الذكاء الاصطناعي عبر بروتوكول HTTP
 * مع دعم إعادة المحاولة والتحقق من حالة الخدمة.
 * TypeScript wrapper for communicating with the local LM Studio API.
 * Provides request dispatching to AI models via HTTP with retry support and health checks.
 */

// ============================================================
// الثوابت / Constants
// ============================================================

/** عنوان الخادم المحلي لـ LM Studio */
const LM_STUDIO_BASE_URL = 'http://localhost:1234';

/** النماذج المتاحة في LM Studio */
const LM_STUDIO_MODELS = [
  'qwen3-1.7b',
  'qwen2.5-7b-instruct',
  'scaled-oss-36b',
] as const;

/** اسم النموذج الافتراضي */
const LM_STUDIO_DEFAULT_MODEL = 'qwen2.5-7b-instruct';

/** عدد محاولات إعادة المحاولة عند الفشل */
const MAX_RETRIES = 3;

/** قائمة أوقات الانتظار بين المحاولات (بالثواني) — تراجع أسي */
const RETRY_DELAYS = [1000, 2000, 4000];

/** المهلة الافتراضية للطلب بالمللي ثانية (120 ثانية) */
const DEFAULT_TIMEOUT_MS = 120_000;

// ============================================================
// الأنواع / Types
// ============================================================

/** خيارات طلب LM Studio */
export interface LmStudioRequestOptions {
  /** اسم النموذج المراد استخدامه */
  model?: string;
  /** درجة الحرارة للتحكم بالإبداعية (0-2) */
  temperature?: number;
  /** الحد الأقصى لعدد الرموز المُ gererated */
  maxTokens?: number;
  /** مهلة مخصصة بالمللي ثانية */
  timeout?: number;
}

/** نتيجة فحص حالة LM Studio */
export interface LmStudioHealthResult {
  /** هل الخدمة متاحة */
  available: boolean;
  /** اسم النموذج النشط */
  model: string;
  /** ذاكرة الفيديو المستخدمة (MB) إن توفرت */
  vram?: number;
  /** رسالة الخطأ إن وُجدت */
  error?: string;
}

/** هيئة استجابة LM Studio لطلب الإكمال */
interface LmStudioCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

/** هيئة استجابة قائمة النماذج من LM Studio */
interface LmStudioModelsResponse {
  data: Array<{
    id: string;
  }>;
}

// ============================================================
// الدوال المساعدة / Helper Functions
// ============================================================

/**
 * الانتظار لفترة زمنية محددة
 * @param ms المدة بالمللي ثانية
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * التحقق من صحة اسم النموذج
 * @param model اسم النموذج المراد التحقق منه
 * @throws خطأ إذا كان النموذج غير معروف
 */
function validateModel(model: string): void {
  const validModels = [...LM_STUDIO_MODELS];
  if (!validModels.includes(model as (typeof LM_STUDIO_MODELS)[number])) {
    throw new Error(
      `نموذج غير معروف: "${model}". النماذج المتاحة: ${validModels.join(', ')}\n` +
      `Unknown model: "${model}". Available models: ${validModels.join(', ')}`
    );
  }
}

/**
 * إنشاء وعد ينتهي بالمهلة
 * @param ms المدة بالمللي ثانية
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `انتهت مهلة الطلب بعد ${ms / 1000} ثانية. النموذج قد يكون بطيئًا أو غير مستجيب.\n` +
          `Request timed out after ${ms / 1000}s. The model may be slow or unresponsive.`
        )
      );
    }, ms);
  });
}

// ============================================================
// الدوال الرئيسية / Main Functions
// ============================================================

/**
 * إرسال طلب إكمال نصي إلى LM Studio
 * Sends a text completion request to LM Studio
 *
 * @param prompt النص المُدخل / The input prompt
 * @param options خيارات إضافية مثل النموذج ودرجة الحرارة / Additional options like model and temperature
 * @returns النص المُ gererated من النموذج / The generated text from the model
 *
 * @example
 * ```ts
 * const result = await lmStudioRequest('اشرح قانون نيوتن الأول');
 * console.log(result);
 * ```
 */
export async function lmStudioRequest(
  prompt: string,
  options?: LmStudioRequestOptions
): Promise<string> {
  const model = options?.model ?? LM_STUDIO_DEFAULT_MODEL;
  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 2048;
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT_MS;

  // التحقق من صحة النموذج
  validateModel(model);

  let lastError: Error | null = null;

  // حلقة إعادة المحاولة مع تراجع أسي
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${LM_STUDIO_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد تعليمي ذكي. أجب بدقة ووضوح. You are a smart educational assistant. Answer accurately and clearly.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `خطأ من الخادم (${response.status}): ${errorBody}\n` +
          `Server error (${response.status}): ${errorBody}`
        );
      }

      const data: LmStudioCompletionResponse = await response.json();

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error(
          'لم يُرجع النموذج أي محتوى. قد تكون المشكلة في الطلب.\n' +
          'The model returned no content. The issue may be with the request.'
        );
      }

      return content.trim();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // إذا كانت المحاولة الأخيرة، لا ننتظر
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAYS[attempt] ?? 1000);
      }
    }
  }

  // جميع المحاولات فشلت
  throw new Error(
    `فشل الطلب إلى LM Studio بعد ${MAX_RETRIES} محاولات. النموذج: "${model}".\n` +
    `خطأ: ${lastError?.message ?? 'غير معروف'}\n\n` +
    `LM Studio request failed after ${MAX_RETRIES} attempts. Model: "${model}".\n` +
    `Error: ${lastError?.message ?? 'Unknown'}`
  );
}

/**
 * فحص حالة خدمة LM Studio
 * Checks the health of the LM Studio service
 *
 * @returns معلومات حالة الخدمة / Service health information
 *
 * @example
 * ```ts
 * const health = await lmStudioHealth();
 * if (health.available) {
 *   console.log(`النموذج النشط: ${health.model}`);
 * }
 * ```
 */
export async function lmStudioHealth(): Promise<LmStudioHealthResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // محاولة جلب قائمة النماذج المتاحة
    const response = await fetch(`${LM_STUDIO_BASE_URL}/v1/models`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        available: false,
        model: '',
        error: `الخادم أرجع حالة ${response.status} / Server returned status ${response.status}`,
      };
    }

    const data: LmStudioModelsResponse = await response.json();
    const modelIds = data.data?.map((m) => m.id) ?? [];

    // محاولة الحصول على معلومات VRAM من نقطة النهاية الإضافية
    let vram: number | undefined;
    try {
      const vramController = new AbortController();
      const vramTimeout = setTimeout(() => vramController.abort(), 3000);

      const vramResponse = await fetch(`${LM_STUDIO_BASE_URL}/api/v0/system/gpu`, {
        signal: vramController.signal,
      });

      clearTimeout(vramTimeout);

      if (vramResponse.ok) {
        const vramData = await vramResponse.json();
        // LM Studio قد يُرجع vram_used أو total_vram
        vram = vramData?.vram_used ?? vramData?.total_vram ?? vramData?.vram;
      }
    } catch {
      // تجاهل فشل الحصول على معلومات VRAM — ليست حرجة
    }

    return {
      available: true,
      model: modelIds.length > 0 ? modelIds[0] : LM_STUDIO_DEFAULT_MODEL,
      vram,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      available: false,
      model: '',
      error:
        `تعذر الاتصال بـ LM Studio على ${LM_STUDIO_BASE_URL}. تأكد من تشغيل البرنامج.\n` +
        `Cannot connect to LM Studio at ${LM_STUDIO_BASE_URL}. Make sure the application is running.\n` +
        `Detail: ${message}`,
    };
  }
}

/**
 * الحصول على قائمة النماذج المتاحة
 * Gets the list of available models
 *
 * @returns مصفوفة أسماء النماذج / Array of model names
 */
export function getLmStudioAvailableModels(): readonly string[] {
  return LM_STUDIO_MODELS;
}

/**
 * الحصول على اسم النموذج الافتراضي
 * Gets the default model name
 *
 * @returns اسم النموذج الافتراضي / Default model name
 */
export function getLmStudioDefaultModel(): string {
  return LM_STUDIO_DEFAULT_MODEL;
}