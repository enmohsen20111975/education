import { NextResponse } from "next/server";
import { getData } from "@/lib/data";

export async function GET() {
  try {
    const data = getData();

    if (!data) {
      return NextResponse.json({
        status: "No data loaded!",
        error: "Could not load curriculum.json"
      }, { status: 500 });
    }

    const counts = {
      academicYears: data.academicYears?.length || 0,
      subjects: 0,
      units: 0,
      lessons: 0,
    };

    for (const year of data.academicYears || []) {
      counts.subjects += year.Subject?.length || 0;
      for (const subject of year.Subject || []) {
        counts.units += subject.Unit?.length || 0;
        for (const unit of subject.Unit || []) {
          counts.lessons += unit.Lesson?.length || 0;
        }
      }
    }

    return NextResponse.json({
      status: "Data loaded from JSON file!",
      source: "public/data/curriculum.json",
      counts,
      specializations: data.specializations?.length || 0,
      simulators: data.simulators?.length || 0,
      badges: data.badges?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "Error loading data!",
      error: error.message,
    }, { status: 500 });
  }
}
