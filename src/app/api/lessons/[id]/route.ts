import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/lessons/[id] — Get single extracted lesson
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lesson = await db.extractedLesson.findUnique({
      where: { id },
      include: {
        ExtractedUnit: {
          include: {
            Book: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PUT /api/lessons/[id] — Update extracted lesson
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const lesson = await db.extractedLesson.findUnique({ where: { id } });
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.content !== undefined) updateData.content = body.content;
    if (body.summary !== undefined) updateData.summary = body.summary;
    if (body.keyPoints !== undefined) {
      updateData.keyPoints =
        typeof body.keyPoints === 'string'
          ? body.keyPoints
          : JSON.stringify(body.keyPoints);
    }
    if (body.status !== undefined) updateData.status = body.status;
    if (body.titleAr !== undefined) updateData.titleAr = body.titleAr;
    if (body.titleEn !== undefined) updateData.titleEn = body.titleEn;

    const updated = await db.extractedLesson.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ lesson: updated });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE /api/lessons/[id] — Delete extracted lesson
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lesson = await db.extractedLesson.findUnique({ where: { id } });
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    await db.extractedLesson.delete({ where: { id } });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}