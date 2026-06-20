/**
 * نقطة النهاية: قائمة مهام الفيديو
 * @route GET /api/video/jobs
 *
 * تُرجع قائمة جميع مهام إنتاج الفيديو أو مهمة محددة.
 *
 * @query { jobId?: string } معرّف المهمة (اختياري)
 * @returns قائمة المهام أو تفاصيل مهمة واحدة
 */

import { NextRequest, NextResponse } from "next/server";
import { getVideoJobStatus, getAllVideoJobs } from "@/lib/video/video-producer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    // ─── طلب مهمة محددة / Specific job request ───
    if (jobId) {
      const job = await getVideoJobStatus(jobId);

      if (!job) {
        return NextResponse.json(
          { success: false, error: "المهمة غير موجودة" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: job,
      });
    }

    // ─── طلب جميع المهام / All jobs request ───
    const jobs = await getAllVideoJobs();

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        total: jobs.length,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء جلب المهام";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
