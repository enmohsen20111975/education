/**
 * نقطة النهاية: إلغاء مهمة فيديو
 * @route POST /api/video/cancel
 *
 * تُستخدم لإلغاء مهمة إنتاج فيديو قيد التنفيذ.
 *
 * @body { jobId: string }
 * @returns { success: true, cancelled: boolean }
 */

import { NextRequest, NextResponse } from "next/server";
import { cancelVideoJob } from "@/lib/video/video-producer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jobId = body?.jobId;

    // ─── التحقق من صحة المُدخلات / Validate inputs ───
    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json(
        { success: false, error: "معرّف المهمة (jobId) مطلوب" },
        { status: 400 }
      );
    }

    // ─── إلغاء المهمة / Cancel job ───
    const cancelled = await cancelVideoJob(jobId);

    if (!cancelled) {
      return NextResponse.json(
        {
          success: false,
          error: "لم يتم العثور على المهمة أو لا يمكن إلغاؤها (مكتملة أو مُلغاة بالفعل)",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        cancelled: true,
        message: "تم إلغاء المهمة بنجاح",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء إلغاء المهمة";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
