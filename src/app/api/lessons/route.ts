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
      where.unit = {};
      if (subjectSlug) where.unit.subject = { slug: subjectSlug };
      if (unitSlug) where.unit.slug = unitSlug;
    }

    const lessons = await db.lesson.findMany({
      where,
      include: {
        unit: {
          include: {
            subject: true,
          },
        },
        simulators: {
          include: {
            simulator: true,
          },
        },
        _count: {
          select: {
            questions: true,
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
      simulators: lesson.simulators.map(s => s.simulator.slug),
      questionsCount: lesson._count.questions,
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
