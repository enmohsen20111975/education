import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/units/[id]/lessons - جلب دروس وحدة معينة
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const lessons = await db.lesson.findMany({
      where: { unitId: id },
      include: {
        LessonSimulator: {
          include: {
            Simulator: true,
          },
        },
        Objective: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
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
