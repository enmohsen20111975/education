import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/lessons - جلب كل الدروس
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectSlug = searchParams.get("subject");
    const unitSlug = searchParams.get("unit");

    const where: any = {};
    
    if (subjectSlug || unitSlug) {
      where.Unit = {};
      if (subjectSlug) where.Unit.Subject = { slug: subjectSlug };
      if (unitSlug) where.Unit.slug = unitSlug;
    }

    const lessons = await db.lesson.findMany({
      where,
      include: {
        Unit: {
          include: {
            Subject: true,
          },
        },
        LessonSimulator: {
          include: {
            Simulator: true,
          },
        },
        _count: {
          select: {
            Question: true,
          },
        },
      },
      orderBy: [{ unitId: "asc" }, { order: "asc" }],
    });

    // تنسيق البيانات
    const formattedLessons = lessons.map(lesson => ({
      id: lesson.id,
      slug: lesson.slug,
      titleAr: lesson.titleAr,
      titleEn: lesson.titleEn,
      descriptionAr: lesson.descriptionAr,
      descriptionEn: lesson.descriptionEn,
      duration: lesson.duration,
      isFree: lesson.isFree,
      order: lesson.order,
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
      simulators: lesson.LessonSimulator.map(s => s.Simulator.slug),
      questionsCount: lesson._count.Question,
    }));

    return NextResponse.json({ lessons: formattedLessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
