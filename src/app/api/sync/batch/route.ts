/**
 * نقطة نهاية المزامنة الدفعية — مزامنة عدة دروس دفعة واحدة
 *
 * Batch Sync Endpoint — Pushes content for multiple lessons in a single request.
 * POST /api/sync/batch
 * Body: { lessons: LessonSyncPayload[] }
 * Response: { results: SyncResult[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { batchSyncLessons } from "@/lib/sync/sync-service";
import type { LessonSyncPayload } from "@/lib/sync/sync-schema";

export async function POST(request: NextRequest) {
  try {
    const body: { lessons?: LessonSyncPayload[] } = await request.json();

    // التحقق من وجود قائمة الدروس
    if (!body.lessons || !Array.isArray(body.lessons)) {
      return NextResponse.json(
        { error: "حقل الدروس (lessons) مطلوب ويجب أن يكون مصفوفة" },
        { status: 400 }
      );
    }

    // التحقق من عدم تجاوز الحد الأقصى (50 درس)
    if (body.lessons.length > 50) {
      return NextResponse.json(
        { error: "الحد الأقصى للمزامنة الدفعية هو 50 درس" },
        { status: 400 }
      );
    }

    // التحقق من أن كل حمولة تحتوي على معرّف الدرس
    for (const payload of body.lessons) {
      if (!payload.lessonId) {
        return NextResponse.json(
          { error: "كل حمولة مزامنة يجب أن تحتوي على معرّف الدرس (lessonId)" },
          { status: 400 }
        );
      }
    }

    const results = await batchSyncLessons(body.lessons);

    // تحديد كود الحالة بناءً على النتائج
    const hasFailures = results.some((r) => !r.success);
    const allFailed = results.every((r) => !r.success);

    const statusCode = allFailed ? 422 : hasFailures ? 207 : 200;

    return NextResponse.json({ results }, { status: statusCode });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطأ داخلي في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}