import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatWithLM } from '@/lib/llm-client';

export async function POST(request: Request) {
  try {
    const { lessonId, examType = 'quiz', difficulty = 'medium', questionTypes = ['mcq', 'true_false'] } = await request.json();

    const lesson = await db.extractedLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const configMap: Record<string, { count: number; duration: number; marks: number }> = {
      quiz: { count: 10, duration: 15, marks: 20 },
      midterm: { count: 20, duration: 45, marks: 40 },
      final: { count: 30, duration: 60, marks: 60 },
      practice: { count: 15, duration: 30, marks: 30 },
    };

    const config = configMap[examType as keyof typeof configMap] || configMap.quiz;

    const prompt = `أنت معلم خبير في وضع أسئلة امتحانات باللغة العربية.
المطلوب: وضع امتحان من ${config.count} سؤال لمادة "${lesson.titleAr}"

المحتوى:
${lesson.content}
النقاط الرئيسية:
${lesson.keyPoints}

الشروط:
- مستوى الصعوبة: ${difficulty}
- أنواع الأسئلة: ${questionTypes.join(' و ')}
- المدة: ${config.duration} دقيقة
- الدرجة الكلية: ${config.marks} درجة

أعد الأسئلة كملف JSON فقط بهذا الشكل:
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "نص السؤال",
      "options": ["أ) الخيار الأول", "ب) الخيار الثاني", "ج) الخيار الثالث", "د) الخيار الرابع"],
      "correctAnswer": 0,
      "points": 2,
      "difficulty": "${difficulty}"
    }
  ]
}

أنواع الأسئلة:
- mcq: اختيار من متعدد (4 خيارات)
- true_false: صح أو خطأ
- fill_blank: إكمال الفراغ
- essay: مقالي

أجب بالـ JSON فقط بدون أي نص آخر.`;

    const response = await chatWithLM(prompt, 'أنت واضع امتحانات محترف. أجب دائما بـ JSON صالح فقط.', {
      service: 'lmstudio',
      model: 'qwen2.5-7b',
      temperature: 0.3,
    });

    // Parse the JSON response
    let questions: unknown[] = [];
    try {
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end > start) cleaned = cleaned.slice(start, end + 1);
      const parsed = JSON.parse(cleaned);
      questions = parsed.questions || [];
    } catch {
      questions = [{ type: 'error', question: 'فشل في توليد الأسئلة', points: 0 }];
    }

    // Save exam
    await db.examTemplate.create({
      id: crypto.randomUUID(),
      lessonId,
      title: `امتحان ${lesson.titleAr}`,
      examType,
      difficulty,
      duration: config.duration,
      totalMarks: config.marks,
      questions: JSON.stringify(questions),
      answerKey: JSON.stringify(questions.map((q: Record<string, unknown>) => q.correctAnswer)),
    });

    return NextResponse.json({ questions, examType, difficulty, duration: config.duration, totalMarks: config.marks, title: lesson.titleAr });
  } catch (error) {
    console.error('Error generating exam:', error);
    return NextResponse.json(
      { error: 'Failed to generate exam: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}