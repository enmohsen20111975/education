import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Count records
    const counts = {
      academicYears: await db.academicYear.count(),
      subjects: await db.subject.count(),
      units: await db.unit.count(),
      lessons: await db.lesson.count(),
    };

    // Get academic years with subject counts
    const academicYears = await db.academicYear.findMany({
      include: {
        _count: {
          select: { Subject: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      status: "Database connected successfully!",
      counts,
      academicYears: academicYears.map(y => ({
        code: y.code,
        nameAr: y.nameAr,
        nameEn: y.nameEn,
        subjectsCount: y._count.Subject
      })),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "Database connection failed!",
      error: error.message,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
      }
    }, { status: 500 });
  }
}
