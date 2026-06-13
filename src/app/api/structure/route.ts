import { NextResponse } from "next/server";
import { getAcademicYears, getSpecializations, getSemesters } from "@/lib/data";

// GET /api/structure - جلب هيكل المنهج المصري
export async function GET() {
  try {
    const academicYears = getAcademicYears();
    const specializations = getSpecializations();
    const semesters = getSemesters();

    return NextResponse.json({
      academicYears,
      specializations,
      semesters,
    });
  } catch (error) {
    console.error("Error fetching structure:", error);
    return NextResponse.json(
      { error: "Failed to fetch structure" },
      { status: 500 }
    );
  }
}
