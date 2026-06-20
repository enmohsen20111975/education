/**
 * نقطة نهاية السحب — قراءة محتوى الدرس من منصة الطالب
 *
 * Pull Endpoint — Reads lesson content FROM the platform DB for factory use.
 * POST /api/sync/pull
 * Body: { lessonId: string }
 * Response: LessonSyncPayload
 */

import { NextRequest, NextResponse } from "next/server";
import { syncLessonFromPlatform } from "@/lib/sync/sync-service";

export async function POST(request: NextRequest) {
  try {
    const body: { lessonId?: string } = await request.json();

    // التحقق من وجود معرّف الدرس
    if (!body.lessonId) {
      return NextResponse.json(
        { error: "معرّف الدرس (lessonId) مطلوب" },
        { status: 400 }
      );
    }

    const payload = await syncLessonFromPlatform(body.lessonId);

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("غير موجود")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    const message =
      error instanceof Error ? error.message : "خطأ داخلي في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}