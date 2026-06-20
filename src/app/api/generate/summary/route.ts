import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatWithLM } from '@/lib/llm-client';

export async function POST(request: Request) {
  try {
    const { lessonId, type = 'summary', length = 'medium', audience = 'student' } = await request.json();

    const lesson = await db.extractedLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const typeMap: Record<string, string> = {
      summary: 'ملخص مركز وشامل',
      notes: 'مذكرات دراسية منظمة ومفصلة',
      key_concepts: 'قائمة بالمفاهيم والتعريفات الرئيسية',
      study_guide: 'دليل مراجعة شامل مع نصائح',
    };

    const lengthMap: Record<string, string> = { short: 'صفحة واحدة مختصرة', medium: '3 صفحات متوسطة', full: 'شامل ومفصل' };

    const prompt = `أنت خبير في تجهيز مواد تعليمية باللغة العربية.
المطلوب: إعداد ${typeMap[type]} لدرس بعنوان "${lesson.titleAr}"

المحتوى الأصلي:
${lesson.content}

الملخص الحالي:
${lesson.summary}

النقاط الرئيسية:
${lesson.keyPoints}

المستهدف: ${audience === 'student' ? 'طالب مدرسي' : 'معلم'}
الطول: ${lengthMap[length]}

اكتب المحتوى بشكل منظم بتنسيق Markdown:
- استخدم عناوين فرعية واضحة
- استخدم نقاط مرقمة
- أضف أمثلة توضيحية حيث من الضروري
- اجعل اللغة سهلة ومفهومة`;

    const content = await chatWithLM(prompt, 'أنت خبير تعليمي متخصص في تلخيص وتنظيم المحتوى الدراسي.', {
      service: 'lmstudio',
      model: 'qwen2.5-7b',
      temperature: 0.4,
    });

    const titlePrefix: Record<string, string> = {
      summary: 'ملخص',
      notes: 'مذكرات',
      key_concepts: 'مفاهيم رئيسية',
      study_guide: 'دليل مراجعة',
    };

    // Save to GeneratedSummary
    await db.generatedSummary.create({
      id: crypto.randomUUID(),
      lessonId,
      type,
      title: `${titlePrefix[type] ?? type}: ${lesson.titleAr}`,
      content,
      format: 'markdown',
      wordCount: content.split(/\s+/).length,
    });

    return NextResponse.json({ content, type, lessonId, title: lesson.titleAr });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}