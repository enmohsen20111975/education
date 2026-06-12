import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/progress - حفظ تقدم الطالب
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lessonId, completed, score, timeSpent } = body;

    const progress = await db.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed,
        score,
        timeSpent,
        watchedAt: completed ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        completed,
        score,
        timeSpent,
        watchedAt: completed ? new Date() : undefined,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

// GET /api/progress?userId=xxx - جلب تقدم الطالب
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const progress = await db.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
            unit: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    // حساب الإحصائيات
    const completedLessons = progress.filter(p => p.completed).length;
    const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    return NextResponse.json({
      progress,
      stats: {
        completedLessons,
        totalScore,
        totalTimeSpent,
        totalLessons: await db.lesson.count(),
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
