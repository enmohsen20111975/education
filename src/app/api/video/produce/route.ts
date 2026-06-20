/**
 * نقطة النهاية: بدء إنتاج فيديو
 * @route POST /api/video/produce
 *
 * تُستخدم لبدء مهمة إنتاج فيديو تعليمي لدرس معين.
 * يُنشئ مهمة جديدة ويُرجع معرّفها لمتابعة التقدم.
 *
 * @body { lessonId: string, language?: 'ar' | 'en', style?: string, voice?: string }
 * @returns { success: true, jobId: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { startVideoProduction } from "@/lib/video/video-producer";

/** الأنماط المسموح بها */
const VALID_STYLES = new Set(["explainer", "whiteboard", "cinematic"]);

/** الأصوات المسموح بها */
const VALID_VOICES = new Set(["male-ar", "female-ar", "male-en", "female-en"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const lessonId = body?.lessonId;
    const language = body?.language ?? "ar";
    const style = body?.style ?? "explainer";
    const voice = body?.voice ?? "female-ar";

    // ─── التحقق من صحة المُدخلات / Validate inputs ───
    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json(
        { success: false, error: "معرّف الدرس (lessonId) مطلوب" },
        { status: 400 }
      );
    }

    if (language !== "ar" && language !== "en") {
      return NextResponse.json(
        { success: false, error: "اللغة يجب أن تكون 'ar' أو 'en'" },
        { status: 400 }
      );
    }

    if (style && !VALID_STYLES.has(style)) {
      return NextResponse.json(
        { success: false, error: `النمط يجب أن يكون واحداً من: ${[...VALID_STYLES].join(", ")}` },
        { status: 400 }
      );
    }

    if (voice && !VALID_VOICES.has(voice)) {
      return NextResponse.json(
        { success: false, error: `الصوت يجب أن يكون واحداً من: ${[...VALID_VOICES].join(", ")}` },
        { status: 400 }
      );
    }

    // ─── بدء الإنتاج / Start production ───
    const job = await startVideoProduction(lessonId, {
      language,
      style,
      voice,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          jobId: job.id,
          lessonId: job.lessonId,
          status: job.status,
          message: "تم إنشاء مهمة إنتاج الفيديو بنجاح",
        },
      },
      { status: 202 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء بدء إنتاج الفيديو";

    // إذا كان الخطأ بسبب عدم وجود الدرس
    if (message.includes("غير موجود") || message.includes("not found")) {
      return NextResponse.json({ success: false, error: message }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
