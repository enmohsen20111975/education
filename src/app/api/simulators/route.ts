import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/simulators - جلب كل المحاكيات
export async function GET() {
  try {
    const simulators = await db.simulator.findMany({
      include: {
        LessonSimulator: {
          include: {
            Lesson: {
              select: {
                id: true,
                titleAr: true,
                titleEn: true,
              },
            },
          },
        },
      },
    });

    // Transform for frontend compatibility
    const transformed = simulators.map(s => ({
      ...s,
      lessons: s.LessonSimulator.map(ls => ls.Lesson).filter(Boolean),
    }));

    return NextResponse.json({ simulators: transformed });
  } catch (error) {
    console.error("Error fetching simulators:", error);
    return NextResponse.json(
      { error: "Failed to fetch simulators" },
      { status: 500 }
    );
  }
}
