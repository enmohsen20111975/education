/**
 * أنماط البيانات الخاصة بطبقة المزامنة ثنائية الاتجاه
 * بين مصنع البيانات ومنصة الطالب
 *
 * Sync Schema — TypeScript interfaces for bidirectional sync payloads
 * that mirror the Prisma data models.
 */

// ─── حمولات البيانات الفرعية ───────────────────────────────────────────────

/** حمولة بيانات المفهوم */
export interface ConceptPayload {
  id: string;
  termAr: string;
  termEn: string;
  definitionAr: string;
  definitionEn: string;
  order: number;
}

/** حمولة بيانات القانون/الصيغة */
export interface FormulaPayload {
  id: string;
  formula: string;
  explanationAr: string;
  explanationEn: string;
  order: number;
}

/** حمولة بيانات المثال التوضيحي */
export interface ExamplePayload {
  id: string;
  questionAr: string;
  questionEn: string;
  solutionAr: string;
  solutionEn: string;
  stepsAr: string;
  stepsEn: string;
  order: number;
}

/** حمولة بيانات الهدف التعليمي */
export interface ObjectivePayload {
  id: string;
  textAr: string;
  textEn: string;
  order: number;
}

/** حمولة بيانات السؤال */
export interface QuestionPayload {
  id: string;
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
  order: number;
}

/** حمولة بيانات خريطة المفاهيم */
export interface MindMapPayload {
  id: string;
  data: string;
}

/** حمولة بيانات الإنفوجرافيك */
export interface InfographicPayload {
  id: string;
  type: string;
  data: string;
}

// ─── حمولة المزامنة الرئيسية ──────────────────────────────────────────────

/** حمولة مزامنة كاملة للدرس — تحتوي على جميع المحتوى المرتبط */
export interface LessonSyncPayload {
  /** معرّف الدرس في قاعدة البيانات */
  lessonId: string;
  /** قائمة المفاهيم المرتبطة بالدرس */
  concepts?: ConceptPayload[];
  /** قائمة القوانين والصيغ المرتبطة بالدرس */
  formulas?: FormulaPayload[];
  /** قائمة الأمثلة التوضيحية المرتبطة بالدرس */
  examples?: ExamplePayload[];
  /** قائمة الأهداف التعليمية للدرس */
  objectives?: ObjectivePayload[];
  /** قائمة الأسئلة المرتبطة بالدرس */
  questions?: QuestionPayload[];
  /** خريطة المفاهيم الذهنية للدرس (عنصر واحد فقط) */
  mindMap?: MindMapPayload;
  /** الإنفوجرافيك التعليمي للدرس (عنصر واحد فقط) */
  infographic?: InfographicPayload;
}

// ─── نتائج المزامنة ─────────────────────────────────────────────────────────

/** نتيجة مزامنة عملية دفع واحدة */
export interface SyncResult {
  /** هل نجحت المزامنة */
  success: boolean;
  /** معرّف الدرس الذي تمت مزامنته */
  lessonId: string;
  /** تاريخ ووقت المزامنة بتنسيق ISO */
  syncedAt: string;
  /** إحصائيات العناصر التي تمت مزامنتها حسب النوع */
  items: { type: string; count: number }[];
  /** قائمة الأخطاء في حال وجودها */
  errors?: string[];
}

// ─── حالة المزامنة ──────────────────────────────────────────────────────────

/** حالة المحتوى المتزامن لدرس معين */
export interface SyncStatus {
  /** معرّف الدرس */
  lessonId: string;
  /** هل يوجد مفاهيم */
  hasConcepts: boolean;
  /** هل يوجد قوانين/صيغ */
  hasFormulas: boolean;
  /** هل يوجد أمثلة توضيحية */
  hasExamples: boolean;
  /** هل يوجد أهداف تعليمية */
  hasObjectives: boolean;
  /** هل يوجد أسئلة */
  hasQuestions: boolean;
  /** هل يوجد خريطة مفاهيم */
  hasMindMap: boolean;
  /** هل يوجد إنفوجرافيك */
  hasInfographic: boolean;
  /** إجمالي عدد عناصر المحتوى */
  totalContent: number;
  /** تاريخ آخر مزامنة (اختياري) */
  lastSynced?: string;
}