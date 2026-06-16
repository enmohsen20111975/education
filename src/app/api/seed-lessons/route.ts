import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessonsData } from "@/data/lessons";

// بيانات الخرائط الذهنية لكل درس
const mindMapData: Record<string, any> = {
  // الفيزياء - الميكانيكا
  "motion-intro": {
    id: "motion-root",
    text: "Motion",
    textAr: "الحركة",
    color: "#10b981",
    children: [
      {
        id: "velocity",
        text: "Velocity",
        textAr: "السرعة",
        color: "#3b82f6",
        children: [
          { id: "speed", text: "Speed", textAr: "السرعة القياسية", color: "#60a5fa" },
          { id: "direction", text: "Direction", textAr: "الاتجاه", color: "#93c5fd" },
          { id: "units", text: "Units (m/s)", textAr: "الوحدات (م/ث)", color: "#bfdbfe" },
        ],
      },
      {
        id: "acceleration",
        text: "Acceleration",
        textAr: "التسارع",
        color: "#8b5cf6",
        children: [
          { id: "positive", text: "Positive", textAr: "موجب", color: "#a78bfa" },
          { id: "negative", text: "Negative", textAr: "سالب", color: "#c4b5fd" },
          { id: "formula", text: "a = Δv/Δt", textAr: "ت = Δسرعة/Δزمن", color: "#ddd6fe" },
        ],
      },
      {
        id: "displacement",
        text: "Displacement",
        textAr: "الإزاحة",
        color: "#f59e0b",
        children: [
          { id: "vector", text: "Vector", textAr: "كمية متجهة", color: "#fbbf24" },
          { id: "distance-diff", text: "vs Distance", textAr: "ضد المسافة", color: "#fcd34d" },
        ],
      },
      {
        id: "distance",
        text: "Distance",
        textAr: "المسافة",
        color: "#f43f5e",
        children: [
          { id: "scalar", text: "Scalar", textAr: "كمية قياسية", color: "#fb7185" },
          { id: "path", text: "Path Length", textAr: "طول المسار", color: "#fda4af" },
        ],
      },
    ],
  },
  "velocity-acceleration": {
    id: "vel-acc-root",
    text: "Velocity & Acceleration",
    textAr: "السرعة والتسارع",
    color: "#3b82f6",
    children: [
      {
        id: "avg-velocity",
        text: "Average Velocity",
        textAr: "السرعة المتوسطة",
        color: "#10b981",
        children: [
          { id: "formula-avg", text: "v̅ = Δx/Δt", textAr: "س̅ = Δف/Δز", color: "#34d399" },
        ],
      },
      {
        id: "inst-velocity",
        text: "Instantaneous Velocity",
        textAr: "السرعة اللحظية",
        color: "#8b5cf6",
        children: [
          { id: "formula-inst", text: "v = dx/dt", textAr: "س = دف/دز", color: "#a78bfa" },
        ],
      },
      {
        id: "acc-types",
        text: "Acceleration Types",
        textAr: "أنواع التسارع",
        color: "#f59e0b",
        children: [
          { id: "uniform", text: "Uniform", textAr: "منتظم", color: "#fbbf24" },
          { id: "variable", text: "Variable", textAr: "متغير", color: "#fcd34d" },
        ],
      },
    ],
  },
  "equations-motion": {
    id: "eq-motion-root",
    text: "Equations of Motion",
    textAr: "معادلات الحركة",
    color: "#8b5cf6",
    children: [
      {
        id: "eq1",
        text: "v = v₀ + at",
        textAr: "س = س₀ + تز",
        color: "#10b981",
        children: [
          { id: "eq1-use", text: "Final velocity", textAr: "السرعة النهائية", color: "#34d399" },
        ],
      },
      {
        id: "eq2",
        text: "Δx = v₀t + ½at²",
        textAr: "Δف = س₀ز + ½تز²",
        color: "#3b82f6",
        children: [
          { id: "eq2-use", text: "Displacement", textAr: "الإزاحة", color: "#60a5fa" },
        ],
      },
      {
        id: "eq3",
        text: "v² = v₀² + 2aΔx",
        textAr: "س² = س₀² + 2تΔف",
        color: "#f59e0b",
        children: [
          { id: "eq3-use", text: "No time needed", textAr: "بدون زمن", color: "#fbbf24" },
        ],
      },
    ],
  },
  "free-fall": {
    id: "free-fall-root",
    text: "Free Fall",
    textAr: "السقوط الحر",
    color: "#f43f5e",
    children: [
      {
        id: "gravity",
        text: "Gravity",
        textAr: "الجاذبية",
        color: "#10b981",
        children: [
          { id: "g-value", text: "g = 9.8 m/s²", textAr: "ج = 9.8 م/ث²", color: "#34d399" },
        ],
      },
      {
        id: "fall-equations",
        text: "Fall Equations",
        textAr: "معادلات السقوط",
        color: "#3b82f6",
        children: [
          { id: "v-gt", text: "v = gt", textAr: "س = جز", color: "#60a5fa" },
          { id: "h-gt2", text: "h = ½gt²", textAr: "ع = ½جز²", color: "#93c5fd" },
        ],
      },
    ],
  },
  // القوى
  "forces-intro": {
    id: "forces-root",
    text: "Forces",
    textAr: "القوى",
    color: "#f59e0b",
    children: [
      {
        id: "contact",
        text: "Contact Forces",
        textAr: "قوى التماس",
        color: "#10b981",
        children: [
          { id: "push", text: "Push", textAr: "الدفع", color: "#34d399" },
          { id: "pull", text: "Pull", textAr: "الشد", color: "#6ee7b7" },
          { id: "friction", text: "Friction", textAr: "الاحتكاك", color: "#a7f3d0" },
        ],
      },
      {
        id: "field",
        text: "Field Forces",
        textAr: "قوى المجال",
        color: "#3b82f6",
        children: [
          { id: "grav", text: "Gravity", textAr: "الجاذبية", color: "#60a5fa" },
          { id: "mag", text: "Magnetic", textAr: "المغناطيسية", color: "#93c5fd" },
        ],
      },
      {
        id: "unit",
        text: "Unit: Newton",
        textAr: "الوحدة: نيوتن",
        color: "#8b5cf6",
        children: [
          { id: "n-def", text: "1 N = 1 kg⋅m/s²", textAr: "1 ن = 1 كجم⋅م/ث²", color: "#a78bfa" },
        ],
      },
    ],
  },
  "newton-laws": {
    id: "newton-root",
    text: "Newton's Laws",
    textAr: "قوانين نيوتن",
    color: "#06b6d4",
    children: [
      {
        id: "first-law",
        text: "1st Law (Inertia)",
        textAr: "القانون الأول (القصور الذاتي)",
        color: "#10b981",
        children: [
          { id: "inertia", text: "Object resists change", textAr: "الجسم يقاوم التغيير", color: "#34d399" },
        ],
      },
      {
        id: "second-law",
        text: "2nd Law (F=ma)",
        textAr: "القانون الثاني (ق=ك×ت)",
        color: "#3b82f6",
        children: [
          { id: "fma", text: "Force = Mass × Acceleration", textAr: "القوة = الكتلة × التسارع", color: "#60a5fa" },
        ],
      },
      {
        id: "third-law",
        text: "3rd Law (Action-Reaction)",
        textAr: "القانون الثالث (الفعل ورد الفعل)",
        color: "#f43f5e",
        children: [
          { id: "equal-opp", text: "Equal & Opposite", textAr: "متساوية ومتضادة", color: "#fb7185" },
        ],
      },
    ],
  },
  // الطاقة
  "energy-intro": {
    id: "energy-root",
    text: "Energy",
    textAr: "الطاقة",
    color: "#8b5cf6",
    children: [
      {
        id: "kinetic",
        text: "Kinetic Energy",
        textAr: "الطاقة الحركية",
        color: "#3b82f6",
        children: [
          { id: "ke-formula", text: "KE = ½mv²", textAr: "طح = ½ك×س²", color: "#60a5fa" },
          { id: "mass-vel", text: "Mass & Velocity", textAr: "الكتلة والسرعة", color: "#93c5fd" },
        ],
      },
      {
        id: "potential",
        text: "Potential Energy",
        textAr: "الطاقة الكامنة",
        color: "#10b981",
        children: [
          { id: "grav", text: "Gravitational", textAr: "الجاذبية", color: "#34d399" },
          { id: "elastic", text: "Elastic", textAr: "المرنة", color: "#6ee7b7" },
          { id: "pe-formula", text: "PE = mgh", textAr: "طك = ك×ج×ع", color: "#a7f3d0" },
        ],
      },
      {
        id: "conservation",
        text: "Conservation",
        textAr: "حفظ الطاقة",
        color: "#f59e0b",
        children: [
          { id: "total", text: "Total Energy = Constant", textAr: "الطاقة الكلية = ثابتة", color: "#fbbf24" },
        ],
      },
    ],
  },
  // الذرة
  "atomic-structure": {
    id: "atom-root",
    text: "Atom",
    textAr: "الذرة",
    color: "#06b6d4",
    children: [
      {
        id: "proton",
        text: "Proton",
        textAr: "البروتون",
        color: "#f43f5e",
        children: [
          { id: "positive", text: "Positive (+)", textAr: "موجب (+)", color: "#fb7185" },
          { id: "in-nucleus", text: "In Nucleus", textAr: "في النواة", color: "#fda4af" },
        ],
      },
      {
        id: "neutron",
        text: "Neutron",
        textAr: "النيوترون",
        color: "#8b5cf6",
        children: [
          { id: "neutral", text: "Neutral (0)", textAr: "متعادل (0)", color: "#a78bfa" },
          { id: "in-nucleus-2", text: "In Nucleus", textAr: "في النواة", color: "#c4b5fd" },
        ],
      },
      {
        id: "electron",
        text: "Electron",
        textAr: "الإلكترون",
        color: "#3b82f6",
        children: [
          { id: "negative", text: "Negative (-)", textAr: "سالب (-)", color: "#60a5fa" },
          { id: "orbits", text: "In Orbits", textAr: "في المدارات", color: "#93c5fd" },
        ],
      },
    ],
  },
};

// بيانات المخططات التوضيحية لكل درس
const infographicData: Record<string, any> = {
  "motion-intro": {
    type: "comparison",
    data: {
      items: [
        { label: "Walking", labelAr: "المشي", value1: 5, value2: 0, label1: "Speed (m/s)", label2: "" },
        { label: "Running", labelAr: "الجري", value1: 10, value2: 0, label1: "Speed (m/s)", label2: "" },
        { label: "Car", labelAr: "السيارة", value1: 30, value2: 0, label1: "Speed (m/s)", label2: "" },
        { label: "Train", labelAr: "القطار", value1: 80, value2: 0, label1: "Speed (m/s)", label2: "" },
      ],
      showValues: true,
    },
  },
  "energy-intro": {
    type: "circle",
    data: {
      segments: [
        { label: "Kinetic", labelAr: "حركية", value: 35, color: "#3b82f6", description: "Energy of motion", descriptionAr: "طاقة الحركة" },
        { label: "Potential", labelAr: "كامنة", value: 35, color: "#10b981", description: "Stored energy", descriptionAr: "طاقة مخزنة" },
        { label: "Thermal", labelAr: "حرارية", value: 15, color: "#f59e0b", description: "Heat energy", descriptionAr: "طاقة حرارية" },
        { label: "Other", labelAr: "أخرى", value: 15, color: "#8b5cf6", description: "Other forms", descriptionAr: "أشكال أخرى" },
      ],
    },
  },
  "atomic-structure": {
    type: "timeline",
    data: {
      events: [
        { year: "1803", title: "Dalton's Model", titleAr: "نموذج دالتون", description: "Solid sphere model", descriptionAr: "نموذج الكرة الصلبة", icon: "circle" },
        { year: "1897", title: "Thomson's Model", titleAr: "نموذج طومسون", description: "Plum pudding model", descriptionAr: "نموذج البودينج", icon: "cake" },
        { year: "1911", title: "Rutherford's Model", titleAr: "نموذج رذرفورد", description: "Nuclear model", descriptionAr: "النموذج النووي", icon: "target" },
        { year: "1913", title: "Bohr's Model", titleAr: "نموذج بور", description: "Orbital model", descriptionAr: "نموذج المدارات", icon: "orbit" },
      ],
    },
  },
  "free-fall": {
    type: "process",
    data: {
      steps: [
        { step: 1, title: "Release", titleAr: "الإفلات", description: "Object starts falling", descriptionAr: "يبدأ الجسم في السقوط", icon: "arrow-down" },
        { step: 2, title: "Accelerate", titleAr: "التسارع", description: "Speed increases at 9.8 m/s²", descriptionAr: "تزداد السرعة بمعدل 9.8 م/ث²", icon: "trending-up" },
        { step: 3, title: "Impact", titleAr: "الاصطدام", description: "Object reaches ground", descriptionAr: "يصل الجسم للأرض", icon: "zap" },
      ],
      showNumbers: true,
    },
  },
};

// POST /api/seed-lessons - تعبئة الدروس من ملف البيانات
export async function POST() {
  try {
    // جلب الوحدات والمحاكيات
    const units = await db.unit.findMany();
    const simulators = await db.simulator.findMany();

    let createdLessons = 0;
    let createdMindMaps = 0;
    let createdInfographics = 0;
    let errors: string[] = [];

    // حذف البيانات القديمة
    await db.mindMap.deleteMany();
    await db.infographic.deleteMany();
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

        // إضافة الخريطة الذهنية إن وجدت
        const mindMap = mindMapData[lesson.id];
        if (mindMap) {
          await db.mindMap.create({
            data: {
              lessonId: createdLesson.id,
              data: JSON.stringify(mindMap),
            },
          });
          createdMindMaps++;
        }

        // إضافة المخطط التوضيحي إن وجد
        const infographic = infographicData[lesson.id];
        if (infographic) {
          await db.infographic.create({
            data: {
              lessonId: createdLesson.id,
              type: infographic.type,
              data: JSON.stringify(infographic.data),
            },
          });
          createdInfographics++;
        }

        createdLessons++;
      } catch (error) {
        errors.push(`Error creating lesson ${lesson.id}: ${String(error)}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdLessons} lessons, ${createdMindMaps} mind maps, ${createdInfographics} infographics`,
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
