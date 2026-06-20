import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'books');

// GET /api/books — List all books
export async function GET() {
  try {
    const books = await db.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { BookPage: true, ExtractedUnit: true },
        },
      },
    });

    const formatted = books.map((b) => ({
      ...b,
      pageCount: b._count.BookPage,
      unitCount: b._count.ExtractedUnit,
      _count: undefined,
    }));

    return NextResponse.json({ books: formatted });
  } catch (error) {
    console.error('Error listing books:', error);
    return NextResponse.json({ error: 'Failed to list books' }, { status: 500 });
  }
}

// POST /api/books — Upload a new PDF book
export async function POST(request: Request) {
  try {
    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
    }

    const bookId = uuidv4();
    const fileName = `${bookId}-${file.name}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));

    const fileSize = bytes.byteLength;
    const bookTitle = title || file.name.replace(/\.pdf$/i, '');

    // Create Book record
    const book = await db.book.create({
      data: {
        id: bookId,
        title: bookTitle,
        fileName,
        filePath,
        fileSize,
        totalPages: 0,
        language: 'ar',
        status: 'uploaded',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error('Error uploading book:', error);
    return NextResponse.json({ error: 'Failed to upload book' }, { status: 500 });
  }
}