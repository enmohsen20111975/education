import { NextResponse } from "next/server";
import { getAcademicYears } from "@/lib/data";

// GET /api/subjects - جلب كل المواد
export async function GET() {
  try {
    const academicYears = getAcademicYears();
    const allSubjects: any[] = [];

    for (const year of academicYears) {
      for (const subject of year.Subject || []) {
        allSubjects.push({
          ...subject,
          units: subject.Unit,
          year: { id: year.id, code: year.code, nameAr: year.nameAr, nameEn: year.nameEn },
          specialization: subject.Specialization,
        });
      }
    }

    return NextResponse.json({ subjects: allSubjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
