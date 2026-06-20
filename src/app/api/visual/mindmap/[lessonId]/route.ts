/**
 * @module api/visual/mindmap/[lessonId]
 * @description نقطة نهاية GET لاسترجاع الخريطة الذهنية لدرس معين.
 * تبحث أولًا في قاعدة البيانات، وتُعيد البيانات المخزنة إن وُجدت.
 *
 * GET endpoint to retrieve the mind map for a given lesson.
 * Checks the database first and returns stored data if available.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ============================================================
// المعالج / Handler
// ============================================================

/**
 * معالج طلبات GET لاسترجاع الخريطة الذهنية
 * GET handler to retrieve the mind map
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
    const mindMap = await db.mindMap.findUnique({
      where: { lessonId },
    });

    if (!mindMap) {
      return NextResponse.json(
        {
          success: false,
          error:
            `لا توجد خريطة ذهنية للدرس "${lessonId}".\n` +
            `No mind map found for lesson "${lessonId}".`,
        },
        { status: 404 }
      );
    }

    // تحليل JSON المخزّن
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(mindMap.data);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "بيانات الخريطة الذهنية تالفة.\n" +
            "Mind map data is corrupted.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      id: mindMap.id,
      lessonId: mindMap.lessonId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(
      `[GET /api/visual/mindmap/:lessonId] خطأ: ${message}\n` +
      `[GET /api/visual/mindmap/:lessonId] Error: ${message}`
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