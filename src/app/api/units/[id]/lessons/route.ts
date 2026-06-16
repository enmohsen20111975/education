import { NextResponse } from "next/server";
import { getLessonsByUnitId } from "@/lib/data";

// GET /api/units/[id]/lessons - جلب دروس وحدة معينة
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lessons = getLessonsByUnitId(id);

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
