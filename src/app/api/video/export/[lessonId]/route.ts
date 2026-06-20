/**
 * نقطة النهاية: تصدير بيانات الدرس لـ Remotion
 * @route GET /api/video/export/[lessonId]
 *
 * تُصدّر بيانات الدرس الكاملة في هيكل JSON متوافق مع مُكوِّن LessonVideo في Remotion.
 *
 * @param { lessonId } معرّف الدرس (من المسار)
 * @query { language?: 'ar' | 'en', style?: string, includeMindMap?: boolean }
 * @returns بيانات التصدير الكاملة
 */

import { NextRequest, NextResponse } from "next/server";
import { exportForRemotion } from "@/lib/video/video-data-exporter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "معرّف الدرس مطلوب" },
        { status: 400 }
      );
    }

    // ─── قراءة خيارات الاستعلام / Parse query options ───
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get("language") as "ar" | "en") ?? "ar";
    const style = (searchParams.get("style") as "explainer" | "whiteboard" | "cinematic") ?? "explainer";
    const includeMindMap = searchParams.get("includeMindMap") !== "false";
    const includeChart = searchParams.get("includeChart") !== "false";
    const maxDuration = parseInt(searchParams.get("maxDuration") ?? "600", 10);

    // ─── تصدير البيانات / Export data ───
    const exportData = await exportForRemotion(lessonId, {
      language,
      style,
      includeMindMap,
      includeChart,
      maxDuration: isNaN(maxDuration) ? 600 : maxDuration,
    });

    return NextResponse.json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء تصدير البيانات";

    // إذا كان الخطأ بسبب عدم وجود الدرس
    if (message.includes("غير موجود") || message.includes("not found")) {
      return NextResponse.json({ success: false, error: message }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
