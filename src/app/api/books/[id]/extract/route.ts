import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processBookOCR } from '@/lib/extraction-pipeline';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'books');

// POST /api/books/[id]/extract — Start OCR extraction
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

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

    // Update status and start OCR in background
    await db.book.update({
      where: { id },
      data: { status: 'extracting', error: null, updatedAt: new Date() },
    });

    // Fire and forget — don't await, pass db instance
    processBookOCR(id, db).catch((err) => {
      console.error('Background OCR error:', err);
    });

    return NextResponse.json({
      message: 'Extraction started',
      bookId: id,
    });
  } catch (error) {
    console.error('Error starting extraction:', error);
    return NextResponse.json(
      { error: 'Failed to start extraction' },
      { status: 500 }
    );
  }
}