import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/lessons - جلب كل الدروس
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subjectId");
    const unitSlug = searchParams.get("unitSlug");

    const where: any = {};
    
    if (subjectId || unitSlug) {
      where.unit = {};
      if (subjectId) where.unit.subjectId = subjectId;
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
      },
      orderBy: [{ unitId: "asc" }, { order: "asc" }],
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
