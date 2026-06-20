import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatWithLM } from '@/lib/llm-client';

export async function POST(request: Request) {
  try {
    const { lessonId, style = 'explanatory', length = 'medium' } = await request.json();

    const lesson = await db.extractedLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const durationMap: Record<string, string> = { short: '3 دقائق', medium: '5 دقائق', long: '10 دقائق' };
    const styleMap: Record<string, string> = {
      explanatory: 'شرح تفصيلي وتعليمي',
      storytelling: 'سرد قصصي ممتع',
      exam_review: 'مراجعة للاختبار مع حل أسئلة',
    };

    const prompt = `أنت خبير في إنتاج محتوى فيديو تعليمي باللغة العربية.
المطلوب: كتابة سكربت فيديو تعليمي مدته ${durationMap[length]} بأسلوب ${styleMap[style]}.

عنوان الدرس: ${lesson.titleAr}
المحتوى: ${lesson.content}
الملخص: ${lesson.summary}
النقاط الرئيسية: ${lesson.keyPoints}

اكتب السكربت بالشكل التالي:
1. مقدمة جذابة (10 ثوانٍ)
2. عرض المحتوى الأساسي مع أمثلة
3. ملخص سريع في النهاية
4. دعوة للتفاعل

استخدم لغة عربية فصحى مبسطة مناسبة للطلاب.
أضف تعليمات للمؤثرات البصرية بين الأقواس [مؤثر: ...].
اكتب السكربت فقط بدون أي مقدمة.`;

    const script = await chatWithLM(prompt, 'أنت كاتب سكربت فيديو تعليمي محترف. اكتب دائما بالعربية.', {
      service: 'lmstudio',
      model: 'qwen2.5-7b',
      temperature: 0.7,
    });

    return NextResponse.json({ script, lessonId, style, duration: durationMap[length] });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}