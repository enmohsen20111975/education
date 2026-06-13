import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/fix-specializations - Fix specializations and subject assignments
export async function POST() {
  try {
    // Step 1: Clean up duplicate specializations - keep only the ones with code 'science', 'math', 'arts'
    const keepCodes = ['science', 'math', 'arts'];
    
    const allSpecs = await db.specialization.findMany();
    
    for (const spec of allSpecs) {
      if (!keepCodes.includes(spec.code)) {
        // Move subjects to the correct specialization first
        const correctCode = spec.code === 'math-science' ? 'math' : 
                           spec.code === 'literary' ? 'arts' : null;
        
        if (correctCode) {
          const correctSpec = await db.specialization.findFirst({
            where: { code: correctCode },
          });
          
          if (correctSpec) {
            // Update subjects to point to correct specialization
            await db.subject.updateMany({
              where: { specializationId: spec.id },
              data: { specializationId: correctSpec.id },
            });
          }
        }
        
        // Delete duplicate specialization
        await db.specialization.delete({
          where: { id: spec.id },
        });
      }
    }

    // Step 2: Update specialization names to be consistent
    await db.specialization.update({
      where: { code: 'science' },
      data: { nameAr: 'علمي علوم', nameEn: 'Science Stream' },
    });
    
    await db.specialization.update({
      where: { code: 'math' },
      data: { nameAr: 'علمي رياضة', nameEn: 'Math Stream' },
    });
    
    await db.specialization.update({
      where: { code: 'arts' },
      data: { nameAr: 'أدبي', nameEn: 'Arts Stream' },
    });

    // Step 3: Get specializations
    const scienceSpec = await db.specialization.findFirst({ where: { code: 'science' } });
    const mathSpec = await db.specialization.findFirst({ where: { code: 'math' } });
    const artsSpec = await db.specialization.findFirst({ where: { code: 'arts' } });

    // Step 4: Fix subject assignments based on Egyptian curriculum
    // First year - all common (no specialization)
    const firstYearSubjects = await db.subject.findMany({
      include: { AcademicYear: true },
      where: { AcademicYear: { code: 'first-year' } },
    });
    
    for (const subject of firstYearSubjects) {
      await db.subject.update({
        where: { id: subject.id },
        data: { isCommon: true, specializationId: null },
      });
    }

    // Second and Third year - assign based on subject name
    const subjectsToFix = await db.subject.findMany({
      include: { AcademicYear: true },
      where: {
        AcademicYear: { code: { in: ['second-year', 'third-year'] } },
      },
    });

    const commonSubjects = ['اللغة العربية', 'اللغة الإنجليزية', 'اللغة الثانية', 'English Language', 'Arabic Language', 'Second Language'];
    const scienceOnlySubjects = ['الأحياء', 'Biology'];
    const mathOnlySubjects = ['الرياضيات (1)', 'الرياضيات (2)', 'الرياضيات 1', 'الرياضيات 2', 'Mathematics (1)', 'Mathematics (2)', 'Mathematics 1', 'Mathematics 2'];
    const artsOnlySubjects = ['التاريخ', 'الجغرافيا', 'الفلسفة', 'علم النفس والاجتماع', 'History', 'Geography', 'Philosophy', 'Psychology'];
    const scienceAndMathSubjects = ['الفيزياء', 'الكيمياء', 'Physics', 'Chemistry'];
    const allScienceSubjects = ['الرياضيات', 'Mathematics']; // علمي علوم + رياضة

    for (const subject of subjectsToFix) {
      let isCommon = false;
      let specId: string | null = null;

      // Check subject type
      if (commonSubjects.some(s => subject.nameAr.includes(s) || subject.nameEn?.includes(s))) {
        isCommon = true;
      } else if (scienceOnlySubjects.some(s => subject.nameAr.includes(s) || subject.nameEn?.includes(s))) {
        // Biology - science stream only
        specId = scienceSpec?.id || null;
      } else if (mathOnlySubjects.some(s => subject.nameAr.includes(s) || subject.nameEn?.includes(s))) {
        // Mathematics 1 & 2 - math stream only
        specId = mathSpec?.id || null;
      } else if (artsOnlySubjects.some(s => subject.nameAr.includes(s) || subject.nameEn?.includes(s))) {
        // History, Geography, Philosophy, Psychology - arts stream only
        specId = artsSpec?.id || null;
      } else if (scienceAndMathSubjects.some(s => subject.nameAr.includes(s) || subject.nameEn?.includes(s))) {
        // Physics, Chemistry - both science and math streams
        // We'll assign to math stream (which applies to both)
        specId = mathSpec?.id || null;
        isCommon = false;
      } else if (allScienceSubjects.some(s => subject.nameAr === s || subject.nameEn === s)) {
        // Regular Mathematics - science stream (includes math stream content)
        specId = scienceSpec?.id || null;
      }

      await db.subject.update({
        where: { id: subject.id },
        data: { isCommon, specializationId: specId },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Specializations and subject assignments fixed',
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
