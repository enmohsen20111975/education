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
        unit: {
          include: {
            subject: true,
          },
        },
        objectives: {
          orderBy: { order: "asc" },
        },
        concepts: {
          orderBy: { order: "asc" },
        },
        formulas: {
          orderBy: { order: "asc" },
        },
        examples: {
          orderBy: { order: "asc" },
        },
        simulators: {
          include: {
            simulator: true,
          },
        },
        questions: {
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
        id: lesson.unit.id,
        slug: lesson.unit.slug,
        nameAr: lesson.unit.nameAr,
        nameEn: lesson.unit.nameEn,
        subject: {
          id: lesson.unit.subject.id,
          slug: lesson.unit.subject.slug,
          nameAr: lesson.unit.subject.nameAr,
          nameEn: lesson.unit.subject.nameEn,
          icon: lesson.unit.subject.icon,
          color: lesson.unit.subject.color,
        },
      },
      objectives: {
        ar: lesson.objectives.map(o => o.textAr),
        en: lesson.objectives.map(o => o.textEn),
      },
      keyConcepts: {
        ar: lesson.concepts.map(c => ({ term: c.termAr, definition: c.definitionAr })),
        en: lesson.concepts.map(c => ({ term: c.termEn, definition: c.definitionEn })),
      },
      formulas: {
        ar: lesson.formulas.map(f => ({ formula: f.formula, explanation: f.explanationAr })),
        en: lesson.formulas.map(f => ({ formula: f.formula, explanation: f.explanationEn })),
      },
      examples: {
        ar: lesson.examples.map(e => ({
          question: e.questionAr,
          solution: e.solutionAr,
          steps: JSON.parse(e.stepsAr || "[]"),
        })),
        en: lesson.examples.map(e => ({
          question: e.questionEn,
          solution: e.solutionEn,
          steps: JSON.parse(e.stepsEn || "[]"),
        })),
      },
      simulators: lesson.simulators.map(s => s.simulator.slug),
      questions: lesson.questions.map(q => ({
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
