import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/books/[id]/units — List all extracted units with lessons for a book
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const book = await db.book.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const units = await db.extractedUnit.findMany({
      where: { bookId: id },
      orderBy: { order: 'asc' },
      include: {
        ExtractedLesson: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ units });
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    );
  }
}