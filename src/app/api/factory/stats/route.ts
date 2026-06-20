/**
 * نقطة النهاية: إحصائيات المصنع
 * @route GET /api/factory/stats
 *
 * تُرجع إحصائيات شاملة عن المحتوى التعليمي في قاعدة البيانات
 * بما في ذلك عدد الدروس والمفاهيم والمعادلات والأسئلة والأمثلة.
 */

import { NextResponse } from "next/server";
import { getFactoryStats } from "@/lib/factory/factory-service";

export async function GET() {
  try {
    const stats = await getFactoryStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء جلب الإحصائيات";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}