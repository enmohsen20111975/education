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

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
