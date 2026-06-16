import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/debug-subjects - Check for duplicate subjects
export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      include: {
        AcademicYear: true,
      },
      orderBy: [
        { yearId: "asc" },
        { nameAr: "asc" },
      ],
    });

    // Group by year and name to find duplicates
    const grouped: Record<string, any[]> = {};
    
    for (const subject of subjects) {
      const key = `${subject.yearId}-${subject.nameAr}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(subject);
    }

    const duplicates: any[] = [];
    for (const [key, items] of Object.entries(grouped)) {
      if (items.length > 1) {
        duplicates.push({
          key,
          count: items.length,
          subjects: items.map(s => ({
            id: s.id,
            nameAr: s.nameAr,
            nameEn: s.nameEn,
            year: s.AcademicYear?.nameAr,
          })),
        });
      }
    }

    return NextResponse.json({
      totalSubjects: subjects.length,
      duplicatesCount: duplicates.length,
      duplicates,
      allSubjects: subjects.map(s => ({
        id: s.id,
        nameAr: s.nameAr,
        nameEn: s.nameEn,
        year: s.AcademicYear?.nameAr,
        yearCode: s.AcademicYear?.code,
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
