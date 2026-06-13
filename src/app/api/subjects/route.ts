import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/subjects - جلب كل المواد
export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      include: {
        Unit: {
          orderBy: { order: "asc" },
          include: {
            Lesson: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                titleAr: true,
                titleEn: true,
                slug: true,
                duration: true,
                isFree: true,
                order: true,
              },
            },
          },
        },
        AcademicYear: true,
        Specialization: true,
      },
      orderBy: { order: "asc" },
    });

    // Transform to camelCase for frontend compatibility
    const transformed = subjects.map(s => ({
      ...s,
      units: s.Unit.map(u => ({
        ...u,
        lessons: u.Lesson,
      })),
      year: s.AcademicYear,
      specialization: s.Specialization,
    }));

    return NextResponse.json({ subjects: transformed });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
