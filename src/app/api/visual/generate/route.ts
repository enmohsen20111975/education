/**
 * @module api/visual/generate
 * @description نقطة نهاية POST لتوليد المحتوى البصري.
 * تُرسِل طلبًا بمعرّف الدرس وأنواع المحتوى المطلوبة وتُعيد النتائج.
 *
 * POST endpoint to generate visual content.
 * Sends a request with lesson ID and desired content types, returns results.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateAllVisuals, type VisualType } from "@/lib/visual";

// ============================================================
// الأنواع / Types
// ============================================================

interface GenerateRequestBody {
  /** معرّف الدرس */
  lessonId: string;
  /** أنواع المحتوى المطلوبة */
  types?: VisualType[];
  /** اللغة */
  language?: "ar" | "en";
}

// ============================================================
// الأنواع المدعومة للتحقق / Supported Types for Validation
// ============================================================

const VALID_TYPES: VisualType[] = [
  "mindmap",
  "infographic",
  "chart",
  "cards",
  "logicmap",
];

// ============================================================
// المعالج / Handler
// ============================================================

/**
 * معالج طلبات POST لتوليد المحتوى البصري
 * POST handler for visual content generation
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. تحليل الطلب
    const body = (await request.json()) as GenerateRequestBody;
    const { lessonId, types, language } = body;

    // 2. التحقق من المدخلات
    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error:
            "معرّف الدرس مطلوب ولا يمكن أن يكون فارغاً.\n" +
            "Lesson ID is required and cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (types && !Array.isArray(types)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "يجب أن تكون الأنواع مصفوفة.\n" +
            "Types must be an array.",
        },
        { status: 400 }
      );
    }

    if (types) {
      const invalidTypes = types.filter((t) => !VALID_TYPES.includes(t));
      if (invalidTypes.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              `أنواع غير مدعومة: ${invalidTypes.join(", ")}.\n` +
              `Unsupported types: ${invalidTypes.join(", ")}.`,
          },
          { status: 400 }
        );
      }
    }

    // 3. توليد المحتوى البصري
    const content = await generateAllVisuals(lessonId, {
      types: types ?? undefined,
      language: language ?? "ar",
    });

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      content,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);

    console.error(
      `[POST /api/visual/generate] خطأ: ${message}\n` +
      `[POST /api/visual/generate] Error: ${message}`
    );

    return NextResponse.json(
      {
        success: false,
        error: message,
        duration,
      },
      { status: 500 }
    );
  }
}