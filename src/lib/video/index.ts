/**
 * @module video
 * @description نقطة التصدير المركزية لطبقة إنتاج الفيديو.
 * يُصدَّر كل شيء من ملف واحد لتسهيل الاستيراد.
 *
 * Central export point for the video production layer.
 * Everything is exported from one file for convenient importing.
 */

// ============================================================
// مُولِّد النصوص / Script Generator
// ============================================================

export {
  generateVideoScript,
} from "./script-generator";

export type {
  VideoScene,
  VideoScript,
  SceneType,
  TransitionType,
  VisualType,
  SceneVisual,
  ScriptGeneratorOptions,
} from "./script-generator";

// ============================================================
// خدمة تحويل النص لكلام / TTS Service
// ============================================================

export {
  generateVoiceover,
  generateBatchVoiceover,
  getTTSStatus,
} from "./tts-service";

export type {
  TTSResult,
  TTSOptions,
  TTSVoice,
  TTSStatus,
} from "./tts-service";

// ============================================================
// مُنتِج الفيديو / Video Producer
// ============================================================

export {
  startVideoProduction,
  getVideoJobStatus,
  getAllVideoJobs,
  cancelVideoJob,
  cleanupOldJobs,
} from "./video-producer";

export type {
  VideoJob,
  VideoJobStatus,
  VideoProductionOptions,
} from "./video-producer";

// ============================================================
// مصدّر البيانات / Data Exporter
// ============================================================

export {
  exportForRemotion,
  scriptToRemotionScenes,
} from "./video-data-exporter";

export type {
  RemotionExport,
  ExportOptions,
} from "./video-data-exporter";
