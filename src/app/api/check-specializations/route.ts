import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/check-specializations - Check specializations and subject assignments
export async function GET() {
  try {
    const specializations = await db.specialization.findMany({
      include: {
        Subject: true,
      },
      orderBy: { order: "asc" },
    });

    const subjects = await db.subject.findMany({
      include: {
        Specialization: true,
        AcademicYear: true,
        Unit: true,
      },
      orderBy: [
        { yearId: "asc" },
        { nameAr: "asc" },
      ],
    });

    // Group subjects by year and specialization
    const byYear: Record<string, any> = {};
    
    for (const subject of subjects) {
      const yearCode = subject.AcademicYear?.code || "unknown";
      if (!byYear[yearCode]) {
        byYear[yearCode] = {
          yearName: subject.AcademicYear?.nameAr,
          subjects: [],
          bySpecialization: {} as Record<string, any[]>,
        };
      }
      
      byYear[yearCode].subjects.push({
        id: subject.id,
        nameAr: subject.nameAr,
        nameEn: subject.nameEn,
        isCommon: subject.isCommon,
        specialization: subject.Specialization?.nameAr || null,
        specializationCode: subject.Specialization?.code || null,
        unitsCount: subject.Unit.length,
      });
      
      const specKey = subject.Specialization?.code || "common";
      if (!byYear[yearCode].bySpecialization[specKey]) {
        byYear[yearCode].bySpecialization[specKey] = [];
      }
      byYear[yearCode].bySpecialization[specKey].push(subject.nameAr);
    }

    return NextResponse.json({
      specializations: specializations.map(s => ({
        id: s.id,
        code: s.code,
        nameAr: s.nameAr,
        nameEn: s.nameEn,
        subjectsCount: s.Subject.length,
      })),
      byYear,
      subjectsNeedingAssignment: subjects.filter(s => !s.specializationId && !s.isCommon).map(s => ({
        id: s.id,
        nameAr: s.nameAr,
        year: s.AcademicYear?.nameAr,
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
