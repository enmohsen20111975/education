/**
 * نقطة النهاية: بدء توليد المحتوى
 * @route POST /api/factory/generate
 *
 * تُستخدم لبدء مهمة توليد محتوى بالذكاء الاصطناعي لدرس معين.
 * يُمكن تحديد أنواع متعددة من المحتوى في طلب واحد.
 *
 * @body { lessonId: string, types: ContentType[] }
 * @returns { jobId: string, lessonId: string, status: 'queued' }
 */

import { NextRequest, NextResponse } from "next/server";
import { startContentGeneration } from "@/lib/factory/factory-service";
import type { ContentType } from "@/lib/factory/factory-service";

/** أنواع المحتوى المسموح بها */
const VALID_CONTENT_TYPES = new Set<string>([
  "concepts",
  "formulas",
  "examples",
  "questions",
  "objectives",
  "mindmap",
  "infographic",
  "video",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const lessonId = body?.lessonId;
    const types: unknown[] = body?.types ?? [];

    // التحقق من صحة المُدخلات
    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json(
        { success: false, error: "معرّف الدرس (lessonId) مطلوب" },
        { status: 400 },
      );
    }

    if (!Array.isArray(types) || types.length === 0) {
      return NextResponse.json(
        { success: false, error: "يجب تحديد نوع واحد على الأقل من المحتوى (types)" },
        { status: 400 },
      );
    }

    // التحقق من صحة كل نوع محتوى
    const invalidTypes = types.filter(
      (t) => typeof t !== "string" || !VALID_CONTENT_TYPES.has(t),
    );

    if (invalidTypes.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `أنواع محتوى غير صالحة: ${invalidTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const job = await startContentGeneration(
      lessonId,
      types as ContentType[],
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          jobId: job.jobId,
          lessonId: job.lessonId,
          status: job.status,
        },
      },
      { status: 202 }, // Accepted — المهمة قيد الانتظار
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء بدء التوليد";

    // إذا كان الخطأ بسبب عدم وجود الدرس
    if (message.includes("غير موجود")) {
      return NextResponse.json({ success: false, error: message }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}