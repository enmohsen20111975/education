import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'books');

export async function POST() {
  try {
    // Delete all extracted lessons first
    await db.extractedLesson.deleteMany({});
    // Delete all extracted units
    await db.extractedUnit.deleteMany({});
    // Delete all book pages
    await db.bookPage.deleteMany({});
    // Get all books for file deletion
    const books = await db.book.findMany({ select: { filePath: true } });
    // Delete book files
    for (const book of books) {
      try {
        await fs.unlink(book.filePath);
      } catch {
        /* ignore missing files */
      }
    }
    // Delete all books
    await db.book.deleteMany({});

    return NextResponse.json({
      message: 'All data cleared successfully',
      deletedBooks: books.length,
    });
  } catch (error) {
    console.error('Error cleaning up:', error);
    return NextResponse.json({ error: 'Failed to cleanup' }, { status: 500 });
  }
}
