import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/structure - جلب هيكل المنهج المصري
export async function GET() {
  try {
    // جلب السنوات الدراسية
    const academicYears = await db.academicYear.findMany({
      orderBy: { order: "asc" },
      include: {
        subjects: {
          orderBy: { order: "asc" },
          include: {
            specialization: true,
            units: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    // جلب التخصصات
    const specializations = await db.specialization.findMany({
      orderBy: { order: "asc" },
    });

    // جلب الفصول الدراسية
    const semesters = await db.semester.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      academicYears,
      specializations,
      semesters,
    });
  } catch (error) {
    console.error("Error fetching structure:", error);
    return NextResponse.json(
      { error: "Failed to fetch structure" },
      { status: 500 }
    );
  }
}
