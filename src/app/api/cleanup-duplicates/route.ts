import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/cleanup-duplicates - Remove duplicate subjects
export async function POST() {
  try {
    // Get all subjects with their units count
    const subjects = await db.subject.findMany({
      include: {
        Unit: true,
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

    const toDelete: string[] = [];
    const kept: any[] = [];

    for (const [key, items] of Object.entries(grouped)) {
      if (items.length > 1) {
        // Sort by units count (descending) then by id (to keep the oldest if same units)
        items.sort((a, b) => {
          const unitsDiff = b.Unit.length - a.Unit.length;
          if (unitsDiff !== 0) return unitsDiff;
          return a.id.localeCompare(b.id);
        });
        
        // Keep the first one (most units)
        kept.push({
          key,
          kept: items[0].id,
          deleted: items.slice(1).map(i => i.id),
          unitsCount: items[0].Unit.length,
        });
        
        // Mark others for deletion
        toDelete.push(...items.slice(1).map(i => i.id));
      }
    }

    // Delete duplicate subjects
    for (const subjectId of toDelete) {
      // Delete units first
      await db.unit.deleteMany({
        where: { subjectId },
      });
      
      // Delete the subject
      await db.subject.delete({
        where: { id: subjectId },
      });
    }

    return NextResponse.json({
      success: true,
      deletedCount: toDelete.length,
      kept,
      message: `Deleted ${toDelete.length} duplicate subjects`,
    });
  } catch (error) {
    console.error("Error cleaning up:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
