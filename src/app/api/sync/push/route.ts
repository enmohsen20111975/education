/**
 * نقطة نهاية الدفع — مصنع البيانات يدفع المحتوى إلى منصة الطالب
 *
 * Push Endpoint — Factory pushes generated content into the platform DB.
 * POST /api/sync/push
 * Body: LessonSyncPayload
 * Response: SyncResult
 */

import { NextRequest, NextResponse } from "next/server";
import { syncLessonToPlatform } from "@/lib/sync/sync-service";
import type { LessonSyncPayload } from "@/lib/sync/sync-schema";

export async function POST(request: NextRequest) {
  try {
    const body: LessonSyncPayload = await request.json();

    // التحقق من وجود معرّف الدرس
    if (!body.lessonId) {
      return NextResponse.json(
        { success: false, error: "معرّف الدرس (lessonId) مطلوب" },
        { status: 400 }
      );
    }

    const result = await syncLessonToPlatform(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطأ داخلي في الخادم";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}