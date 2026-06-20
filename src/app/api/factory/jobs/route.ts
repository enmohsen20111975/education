/**
 * نقطة النهاية: قائمة مهام التوليد
 * @route GET /api/factory/jobs?lessonId=xxx
 *
 * تُرجع قائمة بالمهام الحالية في قائمة الانتظار.
 * يُمكن فلترة النتائج حسب معرّف الدرس.
 */

import { NextRequest, NextResponse } from "next/server";
import { getProcessingQueue, getContentGenerationStatus } from "@/lib/factory/factory-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");
    const jobId = searchParams.get("jobId");

    // إذا تم تحديد معرّف مهمة معين، أعد حالتها فقط
    if (jobId) {
      const status = await getContentGenerationStatus(jobId);
      return NextResponse.json({ success: true, data: status });
    }

    // جلب قائمة الانتظار مع فلترة اختيارية
    const queue = await getProcessingQueue();

    const filtered = lessonId
      ? queue.filter((item) => item.lessonId === lessonId)
      : queue;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء جلب المهام";

    // إذا كان الخطأ بسبب عدم وجود المهمة
    if (message.includes("غير موجودة")) {
      return NextResponse.json({ success: false, error: message }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}