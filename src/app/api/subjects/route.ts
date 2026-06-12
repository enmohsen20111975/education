import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/subjects - جلب كل المواد
export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      include: {
        units: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
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
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
