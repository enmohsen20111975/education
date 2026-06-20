import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs/promises';

// GET /api/books/[id] — Get single book with all related data
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const book = await db.book.findUnique({
      where: { id },
      include: {
        BookPage: {
          orderBy: { pageNumber: 'asc' },
        },
        ExtractedUnit: {
          orderBy: { order: 'asc' },
          include: {
            ExtractedLesson: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}

// DELETE /api/books/[id] — Delete book and all related data
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const book = await db.book.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Delete the file from disk
    try {
      await fs.unlink(book.filePath);
    } catch {
      // File may not exist, that's ok
    }

    // Delete from DB (cascade will remove pages, units, lessons)
    await db.book.delete({ where: { id } });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}