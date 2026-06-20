/**
 * خدمة المزامنة الأساسية — المنطق الأساسي للمزامنة ثنائية الاتجاه
 * بين مصنع البيانات ومنصة الطالب
 *
 * Core Sync Service — handles upsert, read, batch, and status operations
 * for lesson content synchronization via Prisma transactions.
 */

import { db } from "@/lib/db";
import type {
  LessonSyncPayload,
  SyncResult,
  SyncStatus,
  ConceptPayload,
  FormulaPayload,
  ExamplePayload,
  ObjectivePayload,
  QuestionPayload,
  MindMapPayload,
  InfographicPayload,
} from "./sync-schema";

// ─── مزامنة الدفع (Factory → Platform) ────────────────────────────────────

/**
 * مزامنة محتوى الدرس إلى منصة الطالب
 * يقوم بتحديث أو إنشاء جميع العناصر المرتبطة بالدرس داخل معاملة واحدة
 *
 * @param payload — حمولة المزامنة التي تحتوي على معرّف الدرس والمحتوى المرتبط به
 * @returns نتيجة المزامنة تشمل عدد العناصر المحفوظة وأي أخطاء
 */
export async function syncLessonToPlatform(
  payload: LessonSyncPayload
): Promise<SyncResult> {
  const errors: string[] = [];
  const items: { type: string; count: number }[] = [];

  try {
    await db.$transaction(async (tx) => {
      // التحقق من وجود الدرس
      const lesson = await tx.lesson.findUnique({
        where: { id: payload.lessonId },
        select: { id: true },
      });

      if (!lesson) {
        throw new Error(`الدرس غير موجود: ${payload.lessonId}`);
      }

      // مزامنة المفاهيم
      if (payload.concepts && payload.concepts.length > 0) {
        await tx.concept.deleteMany({ where: { lessonId: payload.lessonId } });
        await tx.concept.createMany({
          data: payload.concepts.map((c: ConceptPayload) => ({
            id: c.id,
            lessonId: payload.lessonId,
            termAr: c.termAr,
            termEn: c.termEn,
            definitionAr: c.definitionAr,
            definitionEn: c.definitionEn,
            order: c.order,
          })),
        });
        items.push({ type: "concepts", count: payload.concepts.length });
      }

      // مزامنة القوانين والصيغ
      if (payload.formulas && payload.formulas.length > 0) {
        await tx.formula.deleteMany({ where: { lessonId: payload.lessonId } });
        await tx.formula.createMany({
          data: payload.formulas.map((f: FormulaPayload) => ({
            id: f.id,
            lessonId: payload.lessonId,
            formula: f.formula,
            explanationAr: f.explanationAr,
            explanationEn: f.explanationEn,
            order: f.order,
          })),
        });
        items.push({ type: "formulas", count: payload.formulas.length });
      }

      // مزامنة الأمثلة التوضيحية
      if (payload.examples && payload.examples.length > 0) {
        await tx.example.deleteMany({ where: { lessonId: payload.lessonId } });
        await tx.example.createMany({
          data: payload.examples.map((e: ExamplePayload) => ({
            id: e.id,
            lessonId: payload.lessonId,
            questionAr: e.questionAr,
            questionEn: e.questionEn,
            solutionAr: e.solutionAr,
            solutionEn: e.solutionEn,
            stepsAr: e.stepsAr,
            stepsEn: e.stepsEn,
            order: e.order,
          })),
        });
        items.push({ type: "examples", count: payload.examples.length });
      }

      // مزامنة الأهداف التعليمية
      if (payload.objectives && payload.objectives.length > 0) {
        await tx.objective.deleteMany({
          where: { lessonId: payload.lessonId },
        });
        await tx.objective.createMany({
          data: payload.objectives.map((o: ObjectivePayload) => ({
            id: o.id,
            lessonId: payload.lessonId,
            textAr: o.textAr,
            textEn: o.textEn,
            order: o.order,
          })),
        });
        items.push({ type: "objectives", count: payload.objectives.length });
      }

      // مزامنة الأسئلة
      if (payload.questions && payload.questions.length > 0) {
        await tx.question.deleteMany({
          where: { lessonId: payload.lessonId },
        });
        await tx.question.createMany({
          data: payload.questions.map((q: QuestionPayload) => ({
            id: q.id,
            lessonId: payload.lessonId,
            type: q.type,
            questionAr: q.questionAr,
            questionEn: q.questionEn,
            optionsAr: q.optionsAr ?? null,
            optionsEn: q.optionsEn ?? null,
            answer: q.answer,
            explanationAr: q.explanationAr ?? null,
            explanationEn: q.explanationEn ?? null,
            points: q.points,
            difficulty: q.difficulty,
            order: q.order,
          })),
        });
        items.push({ type: "questions", count: payload.questions.length });
      }

      // مزامنة خريطة المفاهيم (عنصر واحد فقط)
      if (payload.mindMap) {
        const mm: MindMapPayload = payload.mindMap;
        await tx.mindMap.upsert({
          where: { lessonId: payload.lessonId },
          update: {
            data: mm.data,
          },
          create: {
            id: mm.id,
            lessonId: payload.lessonId,
            data: mm.data,
          },
        });
        items.push({ type: "mindMap", count: 1 });
      }

      // مزامنة الإنفوجرافيك (عنصر واحد فقط)
      if (payload.infographic) {
        const ig: InfographicPayload = payload.infographic;
        await tx.infographic.upsert({
          where: { lessonId: payload.lessonId },
          update: {
            type: ig.type,
            data: ig.data,
          },
          create: {
            id: ig.id,
            lessonId: payload.lessonId,
            type: ig.type,
            data: ig.data,
          },
        });
        items.push({ type: "infographic", count: 1 });
      }
    });

    return {
      success: true,
      lessonId: payload.lessonId,
      syncedAt: new Date().toISOString(),
      items,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطأ غير معروف أثناء المزامنة";
    errors.push(message);

    return {
      success: false,
      lessonId: payload.lessonId,
      syncedAt: new Date().toISOString(),
      items,
      errors,
    };
  }
}

// ─── سحب المحتوى (Platform → Factory) ─────────────────────────────────────

/**
 * سحب محتوى الدرس من منصة الطالب لاستخدامه في مصنع البيانات
 * يقرأ جميع العناصر المرتبطة بالدرس من قاعدة البيانات
 *
 * @param lessonId — معرّف الدرس المراد سحب محتواه
 * @returns حمولة المزامنة الكاملة للدرس
 */
export async function syncLessonFromPlatform(
  lessonId: string
): Promise<LessonSyncPayload> {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      Concept: { orderBy: { order: "asc" } },
      Formula: { orderBy: { order: "asc" } },
      Example: { orderBy: { order: "asc" } },
      Objective: { orderBy: { order: "asc" } },
      Question: { orderBy: { order: "asc" } },
      MindMap: { take: 1 },
      Infographic: { take: 1 },
    },
  });

  if (!lesson) {
    throw new Error(`الدرس غير موجود: ${lessonId}`);
  }

  const payload: LessonSyncPayload = {
    lessonId: lesson.id,
  };

  if (lesson.Concept.length > 0) {
    payload.concepts = lesson.Concept.map((c) => ({
      id: c.id,
      termAr: c.termAr,
      termEn: c.termEn,
      definitionAr: c.definitionAr,
      definitionEn: c.definitionEn,
      order: c.order,
    }));
  }

  if (lesson.Formula.length > 0) {
    payload.formulas = lesson.Formula.map((f) => ({
      id: f.id,
      formula: f.formula,
      explanationAr: f.explanationAr,
      explanationEn: f.explanationEn,
      order: f.order,
    }));
  }

  if (lesson.Example.length > 0) {
    payload.examples = lesson.Example.map((e) => ({
      id: e.id,
      questionAr: e.questionAr,
      questionEn: e.questionEn,
      solutionAr: e.solutionAr,
      solutionEn: e.solutionEn,
      stepsAr: e.stepsAr,
      stepsEn: e.stepsEn,
      order: e.order,
    }));
  }

  if (lesson.Objective.length > 0) {
    payload.objectives = lesson.Objective.map((o) => ({
      id: o.id,
      textAr: o.textAr,
      textEn: o.textEn,
      order: o.order,
    }));
  }

  if (lesson.Question.length > 0) {
    payload.questions = lesson.Question.map((q) => ({
      id: q.id,
      type: q.type,
      questionAr: q.questionAr,
      questionEn: q.questionEn,
      optionsAr: q.optionsAr,
      optionsEn: q.optionsEn,
      answer: q.answer,
      explanationAr: q.explanationAr,
      explanationEn: q.explanationEn,
      points: q.points,
      difficulty: q.difficulty,
      order: q.order,
    }));
  }

  if (lesson.MindMap.length > 0) {
    payload.mindMap = {
      id: lesson.MindMap[0].id,
      data: lesson.MindMap[0].data,
    };
  }

  if (lesson.Infographic.length > 0) {
    payload.infographic = {
      id: lesson.Infographic[0].id,
      type: lesson.Infographic[0].type,
      data: lesson.Infographic[0].data,
    };
  }

  return payload;
}

// ─── حالة المزامنة ──────────────────────────────────────────────────────────

/**
 * الحصول على حالة المزامنة لدرس معين
 * يُرجع عدد العناصر الموجودة لكل نوع من أنواع المحتوى
 *
 * @param lessonId — معرّف الدرس المراد التحقق من حالته
 * @returns حالة المزامنة للدرس
 */
export async function getLessonSyncStatus(
  lessonId: string
): Promise<SyncStatus> {
  const [
    conceptsCount,
    formulasCount,
    examplesCount,
    objectivesCount,
    questionsCount,
    mindMap,
    infographic,
  ] = await Promise.all([
    db.concept.count({ where: { lessonId } }),
    db.formula.count({ where: { lessonId } }),
    db.example.count({ where: { lessonId } }),
    db.objective.count({ where: { lessonId } }),
    db.question.count({ where: { lessonId } }),
    db.mindMap.findUnique({ where: { lessonId } }),
    db.infographic.findUnique({ where: { lessonId } }),
  ]);

  const totalContent =
    conceptsCount +
    formulasCount +
    examplesCount +
    objectivesCount +
    questionsCount +
    (mindMap ? 1 : 0) +
    (infographic ? 1 : 0);

  return {
    lessonId,
    hasConcepts: conceptsCount > 0,
    hasFormulas: formulasCount > 0,
    hasExamples: examplesCount > 0,
    hasObjectives: objectivesCount > 0,
    hasQuestions: questionsCount > 0,
    hasMindMap: !!mindMap,
    hasInfographic: !!infographic,
    totalContent,
  };
}

// ─── المزامنة الدفعية ──────────────────────────────────────────────────────

/**
 * مزامنة عدة دروس دفعة واحدة
 * يقوم بمزامنة كل درس على حدة ويعيد جميع النتائج
 *
 * @param payloads — مصفوفة حمولات المزامنة للدروس المراد مزامنتها
 * @returns مصفوفة نتائج المزامنة لكل درس
 */
export async function batchSyncLessons(
  payloads: LessonSyncPayload[]
): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  for (const payload of payloads) {
    const result = await syncLessonToPlatform(payload);
    results.push(result);
  }

  return results;
}

// ─── قائمة الدروس المتاحة للمزامنة ────────────────────────────────────────

/**
 * الحصول على قائمة جميع الدروس المتاحة في المنصة للمزامنة
 * يعرض المعرّف والعنوان والمادة والسنة الأكاديمية لكل درس
 *
 * @returns قائمة الدروس مع معلوماتها الأساسية
 */
export async function getPlatformLessons(): Promise<
  { id: string; title: string; subject: string; year: string }[]
> {
  const lessons = await db.lesson.findMany({
    select: {
      id: true,
      titleAr: true,
      Unit: {
        select: {
          Subject: {
            select: {
              nameAr: true,
              AcademicYear: {
                select: { nameAr: true },
              },
            },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.titleAr,
    subject: lesson.Unit?.Subject?.nameAr ?? "",
    year: lesson.Unit?.Subject?.AcademicYear?.nameAr ?? "",
  }));
}