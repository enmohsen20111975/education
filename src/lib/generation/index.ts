/**
 * @module generation
 * @description نقطة التصدير المركزية لنظام توليد المحتوى التعليمي.
 * يُصدَّر كل شيء من ملف واحد لتسهيل الاستيراد.
 *
 * Central export point for the educational content generation system.
 * Everything is exported from one file for convenient importing.
 */

// ─── القوالب / Prompts ───
export {
  conceptsPrompt,
  formulasPrompt,
  examplesPrompt,
  questionsPrompt,
  objectivesPrompt,
  introductionPrompt,
  summaryPrompt,
} from './prompts';

export type {
  PromptParams,
  ConceptsPromptParams,
  FormulasPromptParams,
  ExamplesPromptParams,
  QuestionsPromptParams,
  ObjectivesPromptParams,
} from './prompts';

// ─── المولّدات / Generators ───
export { generateConcepts } from './concept-generator';
export type { ConceptGenerateOptions } from './concept-generator';

export { generateFormulas } from './formula-generator';
export type { FormulaGenerateOptions } from './formula-generator';

export { generateExamples } from './example-generator';
export type { ExampleGenerateOptions } from './example-generator';

export { generateQuestions } from './question-generator';
export type { QuestionGenerateOptions, QuestionType } from './question-generator';

export { generateObjectives } from './objective-generator';
export type { ObjectiveGenerateOptions } from './objective-generator';

// ─── المولّد الرئيسي / Master Generator ───
export { generateFullLessonContent, ALL_CONTENT_TYPES } from './lesson-generator';
export type { ContentType, LessonGenerateOptions } from './lesson-generator';

// ─── مولّد الدفعات / Batch Generator ───
export { batchGenerateLessons } from './batch-generator';
export type { BatchGenerateOptions } from './batch-generator';