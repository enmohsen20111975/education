/**
 * @module api/visual/infographic/[lessonId]
 * @description نقطة نهاية GET لاسترجاع الإنفوجرافيك لدرس معين.
 * تبحث أولًا في قاعدة البيانات، وتُعيد البيانات المخزنة إن وُجدت.
 *
 * GET endpoint to retrieve the infographic for a given lesson.
 * Checks the database first and returns stored data if available.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ============================================================
// المعالج / Handler
// ============================================================

/**
 * معالج طلبات GET لاسترجاع الإنفوجرافيك
 * GET handler to retrieve the infographic
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error:
            "معرّف الدرس مطلوب.\n" +
            "Lesson ID is required.",
        },
        { status: 400 }
      );
    }

    // البحث في قاعدة البيانات
    const infographic = await db.infographic.findUnique({
      where: { lessonId },
    });

    if (!infographic) {
      return NextResponse.json(
        {
          success: false,
          error:
            `لا يوجد إنفوجرافيك للدرس "${lessonId}".\n` +
            `No infographic found for lesson "${lessonId}".`,
        },
        { status: 404 }
      );
    }

    // تحليل JSON المخزّن
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(infographic.data);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "بيانات الإنفوجرافيك تالفة.\n" +
            "Infographic data is corrupted.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      id: infographic.id,
      lessonId: infographic.lessonId,
      type: infographic.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(
      `[GET /api/visual/infographic/:lessonId] خطأ: ${message}\n` +
      `[GET /api/visual/infographic/:lessonId] Error: ${message}`
    );

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}