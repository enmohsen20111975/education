import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/lessons/[id] - جلب درس معين بالتفصيل
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        Unit: {
          include: {
            Subject: true,
          },
        },
        Objective: {
          orderBy: { order: "asc" },
        },
        Concept: {
          orderBy: { order: "asc" },
        },
        Formula: {
          orderBy: { order: "asc" },
        },
        Example: {
          orderBy: { order: "asc" },
        },
        LessonSimulator: {
          include: {
            Simulator: true,
          },
        },
        Question: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // جلب الخريطة الذهنية
    const mindMap = await db.mindMap.findUnique({
      where: { lessonId: lesson.id },
    });

    // جلب المخطط التوضيحي
    const infographic = await db.infographic.findUnique({
      where: { lessonId: lesson.id },
    });

    // تنسيق البيانات للإرجاع
    const formattedLesson = {
      id: lesson.id,
      slug: lesson.slug,
      titleAr: lesson.titleAr,
      titleEn: lesson.titleEn,
      descriptionAr: lesson.descriptionAr,
      descriptionEn: lesson.descriptionEn,
      duration: lesson.duration,
      isFree: lesson.isFree,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      pdfUrl: lesson.pdfUrl,
      thumbnailUrl: lesson.thumbnailUrl,
      introduction: {
        ar: lesson.introductionAr,
        en: lesson.introductionEn,
      },
      summary: {
        ar: lesson.summaryAr,
        en: lesson.summaryEn,
      },
      unit: {
        id: lesson.Unit.id,
        slug: lesson.Unit.slug,
        nameAr: lesson.Unit.nameAr,
        nameEn: lesson.Unit.nameEn,
        subject: {
          id: lesson.Unit.Subject.id,
          slug: lesson.Unit.Subject.slug,
          nameAr: lesson.Unit.Subject.nameAr,
          nameEn: lesson.Unit.Subject.nameEn,
          icon: lesson.Unit.Subject.icon,
          color: lesson.Unit.Subject.color,
        },
      },
      objectives: {
        ar: lesson.Objective.map(o => o.textAr),
        en: lesson.Objective.map(o => o.textEn),
      },
      keyConcepts: {
        ar: lesson.Concept.map(c => ({ term: c.termAr, definition: c.definitionAr })),
        en: lesson.Concept.map(c => ({ term: c.termEn, definition: c.definitionEn })),
      },
      formulas: {
        ar: lesson.Formula.map(f => ({ formula: f.formula, explanation: f.explanationAr })),
        en: lesson.Formula.map(f => ({ formula: f.formula, explanation: f.explanationEn })),
      },
      examples: {
        ar: lesson.Example.map(e => ({
          question: e.questionAr,
          solution: e.solutionAr,
          steps: JSON.parse(e.stepsAr || "[]"),
        })),
        en: lesson.Example.map(e => ({
          question: e.questionEn,
          solution: e.solutionEn,
          steps: JSON.parse(e.stepsEn || "[]"),
        })),
      },
      simulators: lesson.LessonSimulator.map(s => s.Simulator?.slug).filter(Boolean),
      questions: lesson.Question.map(q => ({
        id: q.id,
        type: q.type,
        questionAr: q.questionAr,
        questionEn: q.questionEn,
        optionsAr: q.optionsAr ? JSON.parse(q.optionsAr) : null,
        optionsEn: q.optionsEn ? JSON.parse(q.optionsEn) : null,
        answer: q.answer,
        explanationAr: q.explanationAr,
        explanationEn: q.explanationEn,
        points: q.points,
      })),
      mindMap: mindMap ? JSON.parse(mindMap.data) : null,
      infographic: infographic ? {
        type: infographic.type,
        data: JSON.parse(infographic.data),
      } : null,
    };

    return NextResponse.json({ lesson: formattedLesson });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
