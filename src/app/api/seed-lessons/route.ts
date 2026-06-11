import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessonsData } from "@/data/lessons";

// POST /api/seed-lessons - تعبئة الدروس من ملف البيانات
export async function POST() {
  try {
    // جلب الوحدات
    const units = await db.unit.findMany();
    const simulators = await db.simulator.findMany();

    let createdLessons = 0;
    let errors: string[] = [];

    // حذف البيانات القديمة
    await db.example.deleteMany();
    await db.formula.deleteMany();
    await db.concept.deleteMany();
    await db.objective.deleteMany();
    await db.lessonSimulator.deleteMany();
    await db.lesson.deleteMany();

    for (const lesson of lessonsData) {
      try {
        // إيجاد الوحدة المناسبة
        const unitMap: Record<string, string> = {
          // الفيزياء
          "mechanics": "mechanics",
          "forces": "forces-unit",
          "energy": "energy-unit",
          "waves": "waves-unit",
          "electricity": "waves-unit",
          "magnetism": "waves-unit",
          // الرياضيات
          "algebra": "algebra",
          "trigonometry": "trigonometry",
          "calculus": "calculus",
          // الكيمياء
          "atomic-structure": "atomic-structure",
          "bonding": "chemical-bonding",
          "reactions": "chemical-reactions",
        };

        const unitSlug = unitMap[lesson.unit] || lesson.unit;
        const unit = units.find(u => u.slug === unitSlug);

        if (!unit) {
          errors.push(`Unit not found: ${lesson.unit} for lesson ${lesson.id}`);
          continue;
        }

        // إنشاء الدرس
        const createdLesson = await db.lesson.create({
          data: {
            slug: lesson.id,
            titleAr: lesson.titleAr,
            titleEn: lesson.titleEn,
            descriptionAr: lesson.objectives.ar[0] || "",
            descriptionEn: lesson.objectives.en[0] || "",
            duration: lesson.duration,
            isFree: lesson.isFree,
            order: lesson.order,
            introductionAr: lesson.introduction.ar,
            introductionEn: lesson.introduction.en,
            summaryAr: lesson.summary.ar,
            summaryEn: lesson.summary.en,
            unitId: unit.id,
          },
        });

        // إضافة الأهداف
        for (let i = 0; i < lesson.objectives.ar.length; i++) {
          await db.objective.create({
            data: {
              lessonId: createdLesson.id,
              textAr: lesson.objectives.ar[i],
              textEn: lesson.objectives.en[i] || "",
              order: i + 1,
            },
          });
        }

        // إضافة المفاهيم
        for (let i = 0; i < lesson.keyConcepts.ar.length; i++) {
          await db.concept.create({
            data: {
              lessonId: createdLesson.id,
              termAr: lesson.keyConcepts.ar[i].term,
              termEn: lesson.keyConcepts.en[i]?.term || "",
              definitionAr: lesson.keyConcepts.ar[i].definition,
              definitionEn: lesson.keyConcepts.en[i]?.definition || "",
              order: i + 1,
            },
          });
        }

        // إضافة المعادلات
        for (let i = 0; i < lesson.formulas.ar.length; i++) {
          await db.formula.create({
            data: {
              lessonId: createdLesson.id,
              formula: lesson.formulas.ar[i].formula,
              explanationAr: lesson.formulas.ar[i].explanation,
              explanationEn: lesson.formulas.en[i]?.explanation || "",
              order: i + 1,
            },
          });
        }

        // إضافة الأمثلة
        for (let i = 0; i < lesson.examples.ar.length; i++) {
          await db.example.create({
            data: {
              lessonId: createdLesson.id,
              questionAr: lesson.examples.ar[i].question,
              questionEn: lesson.examples.en[i]?.question || "",
              solutionAr: lesson.examples.ar[i].solution,
              solutionEn: lesson.examples.en[i]?.solution || "",
              stepsAr: JSON.stringify(lesson.examples.ar[i].steps),
              stepsEn: JSON.stringify(lesson.examples.en[i]?.steps || []),
              order: i + 1,
            },
          });
        }

        // ربط المحاكيات
        for (const simSlug of lesson.simulators) {
          const simulator = simulators.find(s => s.slug === simSlug);
          if (simulator) {
            await db.lessonSimulator.create({
              data: {
                lessonId: createdLesson.id,
                simulatorId: simulator.id,
              },
            });
          }
        }

        createdLessons++;
      } catch (error) {
        errors.push(`Error creating lesson ${lesson.id}: ${String(error)}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdLessons} lessons`,
      totalLessons: lessonsData.length,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
    });
  } catch (error) {
    console.error("Error seeding lessons:", error);
    return NextResponse.json(
      { error: "Failed to seed lessons", details: String(error) },
      { status: 500 }
    );
  }
}
