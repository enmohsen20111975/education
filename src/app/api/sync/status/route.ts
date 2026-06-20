/**
 * نقطة نهاية حالة المزامنة — حالة المحتوى المتزامن لكل درس أو درس معين
 *
 * Sync Status Endpoint — Returns content availability status for lesson(s).
 * GET /api/sync/status?lessonId=xxx (optional)
 * Response: { lessons: SyncStatus[] } or { lesson: SyncStatus }
 */

import { NextRequest, NextResponse } from "next/server";
import { getLessonSyncStatus } from "@/lib/sync/sync-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    // حالة درس محدد
    if (lessonId) {
      const status = await getLessonSyncStatus(lessonId);
      return NextResponse.json({ lesson: status }, { status: 200 });
    }

    // حالة جميع الدروس
    const { db } = await import("@/lib/db");
    const lessons = await db.lesson.findMany({
      select: { id: true },
      orderBy: { id: "asc" },
    });

    const statuses = await Promise.all(
      lessons.map((lesson) => getLessonSyncStatus(lesson.id))
    );

    return NextResponse.json({ lessons: statuses }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطأ داخلي في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}