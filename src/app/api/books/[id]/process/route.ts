import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processBookWithLLM } from '@/lib/extraction-pipeline';

// POST /api/books/[id]/process — Start LLM processing
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const book = await db.book.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (book.status === 'extracting' || book.status === 'processing') {
      return NextResponse.json(
        { error: 'Book is already being processed' },
        { status: 409 }
      );
    }

    if (book.status !== 'extracted') {
      return NextResponse.json(
        { error: 'Book must be extracted before LLM processing' },
        { status: 400 }
      );
    }

    // Update status and start processing in background
    await db.book.update({
      where: { id },
      data: { status: 'processing', error: null, updatedAt: new Date() },
    });

    // Fire and forget — don't await, pass db instance
    processBookWithLLM(id, db).catch((err) => {
      console.error('Background LLM processing error:', err);
    });

    return NextResponse.json({
      message: 'Processing started',
      bookId: id,
    });
  } catch (error) {
    console.error('Error starting processing:', error);
    return NextResponse.json(
      { error: 'Failed to start processing' },
      { status: 500 }
    );
  }
}