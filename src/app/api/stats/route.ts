import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/stats — Aggregate statistics for the dashboard
export async function GET() {
  try {
    const [totalBooks, totalPages, totalUnits, totalLessons, activeOps] = await Promise.all([
      db.book.count(),
      db.bookPage.count(),
      db.extractedUnit.count(),
      db.extractedLesson.count(),
      db.book.count({ where: { status: { in: ['extracting', 'processing'] } } }),
    ]);

    return NextResponse.json({
      totalBooks,
      totalPages,
      totalUnits,
      totalLessons,
      activeOperations: activeOps,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}