import { NextResponse } from "next/server";
import { getAcademicYears } from "@/lib/data";

// GET /api/lessons - جلب كل الدروس
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectSlug = searchParams.get("subject");
    const unitSlug = searchParams.get("unit");

    const academicYears = getAcademicYears();
    const allLessons: any[] = [];

    for (const year of academicYears) {
      for (const subject of year.Subject || []) {
        // Filter by subject slug if provided
        if (subjectSlug && subject.slug !== subjectSlug) continue;

        for (const unit of subject.Unit || []) {
          // Filter by unit slug if provided
          if (unitSlug && unit.slug !== unitSlug) continue;

          for (const lesson of unit.Lesson || []) {
            allLessons.push({
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
                id: unit.id,
                slug: unit.slug,
                nameAr: unit.nameAr,
                nameEn: unit.nameEn,
                subject: {
                  id: subject.id,
                  slug: subject.slug,
                  nameAr: subject.nameAr,
                  nameEn: subject.nameEn,
                  icon: subject.icon,
                  color: subject.color,
                },
              },
              simulators: lesson.LessonSimulator?.map((ls: any) => ls.Simulator?.slug).filter(Boolean) || [],
              questionsCount: lesson.Question?.length || 0,
            });
          }
        }
      }
    }

    return NextResponse.json({ lessons: allLessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
