/**
 * @module ai
 * @description نقطة التصدير المركزية لطبقة الذكاء الاصطناعي.
 * يُصدَّر كل شيء من ملف واحد لتسهيل الاستيراد.
 *
 * Central export point for the AI layer.
 * Everything is exported from one file for convenient importing.
 */

// ============================================================
// LM Studio
// ============================================================
export {
  lmStudioRequest,
  lmStudioHealth,
  getLmStudioAvailableModels,
  getLmStudioDefaultModel,
} from './lm-studio';

export type {
  LmStudioRequestOptions,
  LmStudioHealthResult,
} from './lm-studio';

// ============================================================
// Ollama
// ============================================================
export {
  ollamaRequest,
  ollamaHealth,
  getOllamaAvailableModels,
  getOllamaDefaultModel,
} from './ollama';

export type {
  OllamaRequestOptions,
  OllamaHealthResult,
} from './ollama';

// ============================================================
// Model Router
// ============================================================
export {
  TaskType,
  generateContent,
  getRoutingMap,
  getPrimaryModel,
  getFullSystemHealth,
  getTaskTypeLabel,
} from './model-router';

export type {
  GenerateOptions,
  GenerationResult,
} from './model-router';