/**
 * أنواع بيانات المصنع — تكامل مع قاعدة بيانات المنصة الرئيسية
 * @module types/factory
 */

/** أنواع المحتوى القابلة للتوليد بالذكاء الاصطناعي */
export type FactoryContentType =
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

/** نتيجة توليد نوع محتوى معين */
export interface ContentTypeResult {
  type: FactoryContentType;
  status: "pending" | "processing" | "completed" | "failed";
  count?: number;
  error?: string;
}

/** مهمة توليد في قائمة الانتظار */
export interface FactoryJob {
  id: string;
  lessonId: string;
  lessonTitle: string;
  contentType: FactoryContentType;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

/** حالة مهمة توليد كاملة */
export interface FactoryJobStatus {
  jobId: string;
  lessonId: string;
  lessonTitle: string;
  types: FactoryContentType[];
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  results: ContentTypeResult[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}