import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/simulators - جلب كل المحاكيات
export async function GET() {
  try {
    const simulators = await db.simulator.findMany({
      include: {
        lessons: {
          include: {
            lesson: {
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

    return NextResponse.json({ simulators });
  } catch (error) {
    console.error("Error fetching simulators:", error);
    return NextResponse.json(
      { error: "Failed to fetch simulators" },
      { status: 500 }
    );
  }
}
