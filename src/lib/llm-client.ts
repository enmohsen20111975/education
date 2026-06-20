/**
 * LLM Client — Server-side only
 *
 * Unified client for local LLM services (LM Studio & Ollama).
 * Used by the extraction pipeline to structure raw OCR text into
 * units, lessons, key-points, etc.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LLMService = 'lmstudio' | 'ollama';

export interface ServiceHealth {
  available: boolean;
  message: string;
}

export interface OllamaModel {
  name: string;
  size: string;
  modified: string;
}

export interface LMStudioModel {
  id: string;
  params: Record<string, unknown>;
}

export interface ChatOptions {
  service?: LLMService;
  model?: string;
  temperature?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LMSTUDIO_BASE = 'http://localhost:1234';
const OLLAMA_BASE = 'http://localhost:11434';

const DEFAULT_LMSTUDIO_MODEL = 'qwen2.5-7b';
const DEFAULT_OLLAMA_MODEL = 'deepseek-coder-v2:16b';

const REQUEST_TIMEOUT_MS = 120_000; // 2 min — models can be slow

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getServiceBase(service: LLMService): string {
  switch (service) {
    case 'lmstudio':
      return LMSTUDIO_BASE;
    case 'ollama':
      return OLLAMA_BASE;
  }
}

function getDefaultModel(service: LLMService): string {
  switch (service) {
    case 'lmstudio':
      return DEFAULT_LMSTUDIO_MODEL;
    case 'ollama':
      return DEFAULT_OLLAMA_MODEL;
  }
}

async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Service health
// ---------------------------------------------------------------------------

/**
 * Check whether a local LLM service is reachable and ready.
 */
export async function checkServiceHealth(
  service: LLMService,
): Promise<ServiceHealth> {
  const base = getServiceBase(service);

  try {
    if (service === 'lmstudio') {
      // LM Studio exposes an OpenAI-compatible /v1/models endpoint
      const res = await safeFetch(`${base}/v1/models`, { method: 'GET' });
      if (res.ok) {
        return { available: true, message: 'LM Studio is running and ready' };
      }
      return { available: false, message: `LM Studio returned ${res.status}` };
    }

    // Ollama — /api/tags lists models
    const res = await safeFetch(`${base}/api/tags`, { method: 'GET' });
    if (res.ok) {
      return { available: true, message: 'Ollama is running and ready' };
    }
    return { available: false, message: `Ollama returned ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { available: false, message: `${service} unreachable: ${msg}` };
  }
}

// ---------------------------------------------------------------------------
// Chat completion
// ---------------------------------------------------------------------------

/**
 * Send a chat message to a local LLM and return the assistant reply.
 *
 * LM Studio: OpenAI-compatible `/v1/chat/completions`
 * Ollama:    Native `/api/generate`
 *
 * @param message      User prompt
 * @param systemPrompt Optional system prompt
 * @param options      Service selection, model name, temperature
 */
export async function chatWithLM(
  message: string,
  systemPrompt?: string,
  options?: ChatOptions,
): Promise<string> {
  const service = options?.service ?? 'lmstudio';
  const base = getServiceBase(service);
  const model = options?.model ?? getDefaultModel(service);
  const temperature = options?.temperature ?? 0.3;

  if (service === 'lmstudio') {
    return chatWithLMStudio(base, message, systemPrompt, model, temperature);
  }
  return chatWithOllama(base, message, systemPrompt, model, temperature);
}

// -- LM Studio (OpenAI-compatible) ----------------------------------------

async function chatWithLMStudio(
  base: string,
  message: string,
  systemPrompt: string | undefined,
  model: string,
  temperature: number,
): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: message });

  const res = await safeFetch(`${base}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 8192,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `LM Studio request failed (${res.status}): ${body.slice(0, 500)}`,
    );
  }

  const json = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? '';
}

// -- Ollama ----------------------------------------------------------------

async function chatWithOllama(
  base: string,
  message: string,
  systemPrompt: string | undefined,
  model: string,
  temperature: number,
): Promise<string> {
  const body: Record<string, unknown> = {
    model,
    prompt: message,
    stream: false,
    options: { temperature },
  };
  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const res = await safeFetch(`${base}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Ollama request failed (${res.status}): ${text.slice(0, 500)}`,
    );
  }

  const json = (await res.json()) as { response: string };
  return json.response ?? '';
}

// ---------------------------------------------------------------------------
// Model management
// ---------------------------------------------------------------------------

/**
 * List models available in Ollama.
 */
export async function listOllamaModels(): Promise<OllamaModel[]> {
  const res = await safeFetch(`${OLLAMA_BASE}/api/tags`, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Failed to list Ollama models (${res.status})`);
  }
  const json = (await res.json()) as {
    models: Array<{ name: string; size: number; modified_at: string }>;
  };
  return (json.models ?? []).map((m) => ({
    name: m.name,
    size: formatBytes(m.size),
    modified: m.modified_at,
  }));
}

/**
 * Pull (download) an Ollama model. This is a long-running operation.
 */
export async function pullOllamaModel(
  modelName: string,
): Promise<{ success: boolean; message: string }> {
  // Use streaming mode with a generous timeout to let the download complete
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 600_000); // 10 min

    const res = await fetch(`${OLLAMA_BASE}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, stream: false }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (res.ok) {
      return { success: true, message: `Model "${modelName}" pulled successfully` };
    }
    const text = await res.text().catch(() => '');
    return { success: false, message: `Pull failed (${res.status}): ${text.slice(0, 300)}` };
  } catch (err) {
    return {
      success: false,
      message: `Pull error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * List models currently loaded in LM Studio.
 */
export async function listLMStudioModels(): Promise<LMStudioModel[]> {
  const res = await safeFetch(`${LMSTUDIO_BASE}/v1/models`, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Failed to list LM Studio models (${res.status})`);
  }
  const json = (await res.json()) as {
    data: Array<{ id: string }>;
  };
  return (json.data ?? []).map((m) => ({ id: m.id, params: {} }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
