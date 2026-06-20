import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/books/[id]/pages — List all pages for a book
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

    const pages = await db.bookPage.findMany({
      where: { bookId: id },
      orderBy: { pageNumber: 'asc' },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}