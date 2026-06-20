'use server';

/**
 * @module ollama
 * @description غلاف TypeScript للتواصل مع واجهة برمجة تطبيقات Ollama المحلية.
 * يوفر وظائف إرسال الطلبات إلى نماذج الذكاء الاصطناعي عبر Ollama REST API
 * مع دعم إعادة المحاولة والتحقق من حالة الخدمة.
 * TypeScript wrapper for communicating with the local Ollama API.
 * Provides request dispatching to AI models via Ollama REST API with retry support and health checks.
 */

// ============================================================
// الثوابت / Constants
// ============================================================

/** عنوان الخادم المحلي لـ Ollama */
const OLLAMA_BASE_URL = 'http://localhost:11434';

/** النماذج المتاحة في Ollama */
const OLLAMA_MODELS = [
  'deepseek-coder-v2:16b',
  'qwen2.5-coder:7b',
] as const;

/** اسم النموذج الافتراضي */
const OLLAMA_DEFAULT_MODEL = 'qwen2.5-coder:7b';

/** عدد محاولات إعادة المحاولة عند الفشل */
const MAX_RETRIES = 3;

/** قائمة أوقات الانتظار بين المحاولات (بالثواني) — تراجع أسي */
const RETRY_DELAYS = [1000, 2000, 4000];

/** المهلة الافتراضية للطلب بالمللي ثانية (180 ثانية — deepseek بطيء) */
const DEFAULT_TIMEOUT_MS = 180_000;

// ============================================================
// الأنواع / Types
// ============================================================

/** خيارات طلب Ollama */
export interface OllamaRequestOptions {
  /** اسم النموذج المراد استخدامه */
  model?: string;
  /** درجة الحرارة للتحكم بالإبداعية (0-2) */
  temperature?: number;
  /** مهلة مخصصة بالمللي ثانية */
  timeout?: number;
}

/** نتيجة فحص حالة Ollama */
export interface OllamaHealthResult {
  /** هل الخدمة متاحة */
  available: boolean;
  /** قائمة النماذج المُحمَّلة */
  models: string[];
  /** ذاكرة الفيديو المستخدمة (MB) إن توفرت */
  vram?: number;
  /** رسالة الخطأ إن وُجدت */
  error?: string;
}

/** هيئة استجابة Ollama لطلب الإكمال */
interface OllamaCompletionResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
  load_duration?: number;
  prompt_eval_count?: number;
}

/** هيئة استجابة قائمة النماذج من Ollama */
interface OllamaModelsResponse {
  models: Array<{
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
      parent_model: string;
      format: string;
      family: string;
      families: string[] | null;
      parameter_size: string;
      quantization_level: string;
    };
  }>;
}

/** هيئة معلومات النظام من Ollama */
interface OllamaPsResponse {
  models: Array<{
    name: string;
    model: string;
    size: number;
    digest: string;
    details: {
      parent_model: string;
      format: string;
      family: string;
      families: string[] | null;
      parameter_size: string;
      quantization_level: string;
    };
    expires_at: string;
    size_vram: number;
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
  const validModels = [...OLLAMA_MODELS];
  if (!validModels.includes(model as (typeof OLLAMA_MODELS)[number])) {
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
          `انتهت مهلة طلب Ollama بعد ${ms / 1000} ثانية. النموذج قد يكون بطيئًا أو غير مُحمَّل.\n` +
          `Ollama request timed out after ${ms / 1000}s. The model may be slow or not loaded.`
        )
      );
    }, ms);
  });
}

// ============================================================
// الدوال الرئيسية / Main Functions
// ============================================================

/**
 * إرسال طلب إكمال نصي إلى Ollama
 * Sends a text completion request to Ollama
 *
 * @param prompt النص المُدخل / The input prompt
 * @param options خيارات إضافية مثل النموذج ودرجة الحرارة / Additional options like model and temperature
 * @returns النص المُ gererated من النموذج / The generated text from the model
 *
 * @example
 * ```ts
 * const code = await ollamaRequest('اكتب دالة بايثون لحساب المضروب');
 * console.log(code);
 * ```
 */
export async function ollamaRequest(
  prompt: string,
  options?: OllamaRequestOptions
): Promise<string> {
  const model = options?.model ?? OLLAMA_DEFAULT_MODEL;
  const temperature = options?.temperature ?? 0.7;
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT_MS;

  // التحقق من صحة النموذج
  validateModel(model);

  let lastError: Error | null = null;

  // حلقة إعادة المحاولة مع تراجع أسي
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: `أنت مساعد تعليمي ذكي متخصص في البرمجة والعلوم. أجب بدقة ووضوح.
You are a smart educational assistant specialized in programming and sciences. Answer accurately and clearly.

${prompt}`,
          stream: false,
          options: {
            temperature,
            num_predict: 2048,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `خطأ من Ollama (${response.status}): ${errorBody}\n` +
          `Ollama error (${response.status}): ${errorBody}`
        );
      }

      const data: OllamaCompletionResponse = await response.json();

      if (!data.response || !data.done) {
        throw new Error(
          'لم يُرجع Ollama استجابة كاملة. قد يكون النموذج لا يزال يُحمَّل.\n' +
          'Ollama did not return a complete response. The model may still be loading.'
        );
      }

      return data.response.trim();
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
    `فشل الطلب إلى Ollama بعد ${MAX_RETRIES} محاولات. النموذج: "${model}".\n` +
    `خطأ: ${lastError?.message ?? 'غير معروف'}\n\n` +
    `Ollama request failed after ${MAX_RETRIES} attempts. Model: "${model}".\n` +
    `Error: ${lastError?.message ?? 'Unknown'}`
  );
}

/**
 * فحص حالة خدمة Ollama
 * Checks the health of the Ollama service
 *
 * @returns معلومات حالة الخدمة / Service health information
 *
 * @example
 * ```ts
 * const health = await ollamaHealth();
 * if (health.available) {
 *   console.log(`النماذج: ${health.models.join(', ')}`);
 * }
 * ```
 */
export async function ollamaHealth(): Promise<OllamaHealthResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // محاولة جلب قائمة النماذج
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        available: false,
        models: [],
        error: `Ollama أرجع حالة ${response.status} / Ollama returned status ${response.status}`,
      };
    }

    const data: OllamaModelsResponse = await response.json();
    const modelNames = (data.models ?? []).map((m) => m.name);

    // محاولة الحصول على معلومات VRAM من نقطة نهاية ps
    let vram: number | undefined;
    try {
      const psController = new AbortController();
      const psTimeout = setTimeout(() => psController.abort(), 3000);

      const psResponse = await fetch(`${OLLAMA_BASE_URL}/api/ps`, {
        signal: psController.signal,
      });

      clearTimeout(psTimeout);

      if (psResponse.ok) {
        const psData: OllamaPsResponse = await psResponse.json();
        // جمع VRAM من جميع النماذج المُحمَّلة
        const totalVram = (psData.models ?? []).reduce(
          (sum, m) => sum + (m.size_vram ?? 0),
          0
        );
        // تحويل البايت إلى ميجابايت
        if (totalVram > 0) {
          vram = Math.round(totalVram / (1024 * 1024));
        }
      }
    } catch {
      // تجاهل فشل الحصول على معلومات VRAM — ليست حرجة
    }

    return {
      available: true,
      models: modelNames,
      vram,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      available: false,
      models: [],
      error:
        `تعذر الاتصال بـ Ollama على ${OLLAMA_BASE_URL}. تأكد من تشغيل الخدمة.\n` +
        `Cannot connect to Ollama at ${OLLAMA_BASE_URL}. Make sure the service is running.\n` +
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
export function getOllamaAvailableModels(): readonly string[] {
  return OLLAMA_MODELS;
}

/**
 * الحصول على اسم النموذج الافتراضي
 * Gets the default model name
 *
 * @returns اسم النموذج الافتراضي / Default model name
 */
export function getOllamaDefaultModel(): string {
  return OLLAMA_DEFAULT_MODEL;
}