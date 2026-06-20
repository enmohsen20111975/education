import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatWithLM } from '@/lib/llm-client';

export async function POST(request: Request) {
  try {
    const { lessonId, type = 'mindmap' } = await request.json();

    const lesson = await db.extractedLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    let keyPoints: string[] = [];
    try {
      keyPoints = typeof lesson.keyPoints === 'string' ? JSON.parse(lesson.keyPoints) : (lesson.keyPoints || []);
    } catch {
      keyPoints = [];
    }

    if (type === 'mindmap' || type === 'concept_map') {
      // Generate mind map JSON structure
      const nodes = [
        { id: 'root', label: lesson.titleAr, x: 400, y: 300, type: 'root' },
        ...keyPoints.map((point, i) => ({
          id: `node-${i}`,
          label: point,
          x: 400 + (i % 2 === 0 ? 200 : -200),
          y: 100 + i * 80,
          type: 'branch',
        })),
      ];
      const edges = keyPoints.map((_, i) => ({
        from: 'root',
        to: `node-${i}`,
        label: '',
      }));

      const data = JSON.stringify({ nodes, edges }, null, 2);

      await db.learningMaterial.create({
        id: crypto.randomUUID(),
        lessonId,
        type,
        title: `${type === 'mindmap' ? 'خريطة ذهنية' : 'خريطة مفاهيم'}: ${lesson.titleAr}`,
        data,
        status: 'draft',
      });

      return NextResponse.json({ type, data: { nodes, edges }, title: lesson.titleAr });
    }

    if (type === 'flashcards') {
      // Generate flashcards from key points
      const cards = keyPoints.map((point, i) => ({
        id: `card-${i}`,
        front: `ما المقصود بـ: ${point}?`,
        back: point,
      }));

      const data = JSON.stringify(cards, null, 2);

      await db.learningMaterial.create({
        id: crypto.randomUUID(),
        lessonId,
        type,
        title: `بطاقات تعليمية: ${lesson.titleAr}`,
        data,
        status: 'draft',
      });

      return NextResponse.json({ type, cards, title: lesson.titleAr });
    }

    // For infographic and formula_sheet, use LLM
    const prompt =
      type === 'infographic'
        ? `أنشئ بيانات إنفوجرافيك تعليمي بالعربية لدرس "${lesson.titleAr}". المحتوى: ${lesson.content}. النقاط: ${keyPoints.join(', ')}. أجب بـ JSON: {title, stats:[{label,value}], highlights:[{text,icon}]}`
        : `استخرج كل المعادلات والقوانين من هذا المحتوى بالعربية: "${lesson.content}". أجب بـ JSON: {formulas:[{name,formula,description}]}`;

    const response = await chatWithLM(prompt, undefined, {
      service: 'lmstudio',
      model: 'qwen2.5-7b',
      temperature: 0.3,
    });

    let data = response;
    try {
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
      data = cleaned.trim();
      JSON.parse(data); // validate
    } catch {
      data = response;
    }

    await db.learningMaterial.create({
      id: crypto.randomUUID(),
      lessonId,
      type,
      title: `${type === 'infographic' ? 'إنفوجرافيك' : 'ورقة معادلات'}: ${lesson.titleAr}`,
      data,
      status: 'draft',
    });

    return NextResponse.json({ type, data, title: lesson.titleAr });
  } catch (error) {
    console.error('Error generating material:', error);
    return NextResponse.json(
      { error: 'Failed to generate material: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}