/**
 * نقطة نهاية قائمة الدروس — جميع الدروس المتاحة للمزامنة
 *
 * Platform Lessons Endpoint — Lists all lessons available for sync with
 * their title, subject, and academic year.
 * GET /api/sync/lessons
 * Response: { lessons: { id, title, subject, year }[] }
 */

import { NextResponse } from "next/server";
import { getPlatformLessons } from "@/lib/sync/sync-service";

export async function GET() {
  try {
    const lessons = await getPlatformLessons();
    return NextResponse.json({ lessons }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطأ داخلي في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}