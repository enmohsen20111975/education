/**
 * نقطة الدخول الموحدة لطبقة المزامنة
 * يُصدّر جميع الأنماط والخدمات من مكان واحد لسهولة الاستيراد
 *
 * Unified barrel export for the Sync layer.
 * Usage: import { syncLessonToPlatform, type LessonSyncPayload } from "@/lib/sync"
 */

// ─── الأنماط ────────────────────────────────────────────────────────────────
export type {
  ConceptPayload,
  ExamplePayload,
  FormulaPayload,
  InfographicPayload,
  LessonSyncPayload,
  MindMapPayload,
  ObjectivePayload,
  QuestionPayload,
  SyncResult,
  SyncStatus,
} from "./sync-schema";

// ─── الخدمات ────────────────────────────────────────────────────────────────
export {
  batchSyncLessons,
  getLessonSyncStatus,
  getPlatformLessons,
  syncLessonFromPlatform,
  syncLessonToPlatform,
} from "./sync-service";