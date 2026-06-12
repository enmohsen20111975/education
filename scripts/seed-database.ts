import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// بيانات السنوات الدراسية
const academicYearsData = [
  { nameAr: "الصف الأول الثانوي", nameEn: "First Year Secondary", code: "first-year", order: 1 },
  { nameAr: "الصف الثاني الثانوي", nameEn: "Second Year Secondary", code: "second-year", order: 2 },
  { nameAr: "الصف الثالث الثانوي", nameEn: "Third Year Secondary", code: "third-year", order: 3 },
];

// بيانات التخصصات
const specializationsData = [
  { nameAr: "علمي علوم", nameEn: "Science", code: "science", descriptionAr: "شعبة العلوم", descriptionEn: "Science Track", order: 1 },
  { nameAr: "علمي رياضة", nameEn: "Mathematics", code: "math", descriptionAr: "شعبة الرياضيات", descriptionEn: "Mathematics Track", order: 2 },
  { nameAr: "أدبي", nameEn: "Arts", code: "arts", descriptionAr: "الشعبة الأدبية", descriptionEn: "Arts Track", order: 3 },
];

// بيانات الفصول الدراسية
const semestersData = [
  { nameAr: "الفصل الدراسي الأول", nameEn: "First Semester", code: "first-semester", order: 1 },
  { nameAr: "الفصل الدراسي الثاني", nameEn: "Second Semester", code: "second-semester", order: 2 },
];

// بيانات المواد الدراسية
const subjectsData: Record<string, Array<{
  nameAr: string; nameEn: string; slug: string; icon: string; color: string; order: number;
  yearCode?: string; specializationCode?: string; isCommon?: boolean;
}>> = {
  // الصف الأول الثانوي - مواد مشتركة
  "first-year-common": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-1", icon: "BookOpen", color: "#8B5CF6", order: 1, isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-1", icon: "Globe", color: "#3B82F6", order: 2, isCommon: true },
    { nameAr: "اللغة الفرنسية", nameEn: "French Language", slug: "french-1", icon: "Globe", color: "#EC4899", order: 3, isCommon: true },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-1", icon: "Calculator", color: "#F59E0B", order: 4, isCommon: true },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-1", icon: "Atom", color: "#10B981", order: 5, isCommon: true },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-1", icon: "FlaskConical", color: "#EF4444", order: 6, isCommon: true },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-1", icon: "Leaf", color: "#22C55E", order: 7, isCommon: true },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-1", icon: "Landmark", color: "#A855F7", order: 8, isCommon: true },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-1", icon: "Map", color: "#06B6D4", order: 9, isCommon: true },
    { nameAr: "الفلسفة والمنطق", nameEn: "Philosophy & Logic", slug: "philosophy-1", icon: "Brain", color: "#F97316", order: 10, isCommon: true },
  ],
  // الصف الثاني الثانوي - علمي علوم
  "second-year-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-science", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-science", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-science", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-2-science", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-science", icon: "Atom", color: "#10B981", order: 5 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-science", icon: "FlaskConical", color: "#EF4444", order: 6 },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-2-science", icon: "Leaf", color: "#22C55E", order: 7 },
  ],
  // الصف الثاني الثانوي - علمي رياضة
  "second-year-math": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-math", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-math", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-math", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-2-math", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-math", icon: "Atom", color: "#10B981", order: 5 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-math", icon: "FlaskConical", color: "#EF4444", order: 6 },
  ],
  // الصف الثاني الثانوي - أدبي
  "second-year-arts": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-arts", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-arts", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-arts", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-2-arts", icon: "Landmark", color: "#A855F7", order: 4 },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-2-arts", icon: "Map", color: "#06B6D4", order: 5 },
    { nameAr: "الفلسفة", nameEn: "Philosophy", slug: "philosophy-2-arts", icon: "Brain", color: "#F97316", order: 6 },
    { nameAr: "علم النفس والاجتماع", nameEn: "Psychology & Sociology", slug: "psychology-2-arts", icon: "Users", color: "#6366F1", order: 7 },
  ],
  // الصف الثالث الثانوي - علمي علوم
  "third-year-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-science", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-science", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-science", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-3-science", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-science", icon: "Atom", color: "#10B981", order: 5 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-science", icon: "FlaskConical", color: "#EF4444", order: 6 },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-3-science", icon: "Leaf", color: "#22C55E", order: 7 },
  ],
  // الصف الثالث الثانوي - علمي رياضة
  "third-year-math": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-math", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-math", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-math", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات 1", nameEn: "Mathematics 1", slug: "math1-3-math", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الرياضيات 2", nameEn: "Mathematics 2", slug: "math2-3-math", icon: "Sigma", color: "#D97706", order: 5 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-math", icon: "Atom", color: "#10B981", order: 6 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-math", icon: "FlaskConical", color: "#EF4444", order: 7 },
  ],
  // الصف الثالث الثانوي - أدبي
  "third-year-arts": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-arts", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-arts", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-arts", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-3-arts", icon: "Landmark", color: "#A855F7", order: 4 },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-3-arts", icon: "Map", color: "#06B6D4", order: 5 },
    { nameAr: "الفلسفة", nameEn: "Philosophy", slug: "philosophy-3-arts", icon: "Brain", color: "#F97316", order: 6 },
    { nameAr: "علم النفس والاجتماع", nameEn: "Psychology & Sociology", slug: "psychology-3-arts", icon: "Users", color: "#6366F1", order: 7 },
  ],
};

async function main() {
  console.log("🚀 Starting database seeding...");

  // 1. إنشاء السنوات الدراسية
  console.log("📚 Creating academic years...");
  for (const year of academicYearsData) {
    await prisma.academicYear.upsert({
      where: { code: year.code },
      update: year,
      create: year,
    });
  }
  console.log("✅ Academic years created");

  // 2. إنشاء التخصصات
  console.log("🎓 Creating specializations...");
  for (const spec of specializationsData) {
    await prisma.specialization.upsert({
      where: { code: spec.code },
      update: spec,
      create: spec,
    });
  }
  console.log("✅ Specializations created");

  // 3. إنشاء الفصول الدراسية
  console.log("📅 Creating semesters...");
  for (const semester of semestersData) {
    await prisma.semester.upsert({
      where: { code: semester.code },
      update: semester,
      create: semester,
    });
  }
  console.log("✅ Semesters created");

  // 4. إنشاء المواد الدراسية
  console.log("📖 Creating subjects...");
  let totalSubjects = 0;

  // الصف الأول - مواد مشتركة
  const firstYear = await prisma.academicYear.findUnique({ where: { code: "first-year" } });
  if (firstYear) {
    for (const subject of subjectsData["first-year-common"]) {
      await prisma.subject.upsert({
        where: { slug: subject.slug },
        update: { ...subject, yearId: firstYear.id, specializationId: null, isCommon: true },
        create: { ...subject, yearId: firstYear.id, specializationId: null, isCommon: true },
      });
      totalSubjects++;
    }
  }

  // الصف الثاني - التخصصات
  const secondYear = await prisma.academicYear.findUnique({ where: { code: "second-year" } });
  const scienceSpec = await prisma.specialization.findUnique({ where: { code: "science" } });
  const mathSpec = await prisma.specialization.findUnique({ where: { code: "math" } });
  const artsSpec = await prisma.specialization.findUnique({ where: { code: "arts" } });

  if (secondYear) {
    if (scienceSpec) {
      for (const subject of subjectsData["second-year-science"]) {
        await prisma.subject.upsert({
          where: { slug: subject.slug },
          update: { ...subject, yearId: secondYear.id, specializationId: scienceSpec.id, isCommon: false },
          create: { ...subject, yearId: secondYear.id, specializationId: scienceSpec.id, isCommon: false },
        });
        totalSubjects++;
      }
    }
    if (mathSpec) {
      for (const subject of subjectsData["second-year-math"]) {
        await prisma.subject.upsert({
          where: { slug: subject.slug },
          update: { ...subject, yearId: secondYear.id, specializationId: mathSpec.id, isCommon: false },
          create: { ...subject, yearId: secondYear.id, specializationId: mathSpec.id, isCommon: false },
        });
        totalSubjects++;
      }
    }
    if (artsSpec) {
      for (const subject of subjectsData["second-year-arts"]) {
        await prisma.subject.upsert({
          where: { slug: subject.slug },
          update: { ...subject, yearId: secondYear.id, specializationId: artsSpec.id, isCommon: false },
          create: { ...subject, yearId: secondYear.id, specializationId: artsSpec.id, isCommon: false },
        });
        totalSubjects++;
      }
    }
  }

  // الصف الثالث - التخصصات
  const thirdYear = await prisma.academicYear.findUnique({ where: { code: "third-year" } });
  if (thirdYear) {
    if (scienceSpec) {
      for (const subject of subjectsData["third-year-science"]) {
        await prisma.subject.upsert({
          where: { slug: subject.slug },
          update: { ...subject, yearId: thirdYear.id, specializationId: scienceSpec.id, isCommon: false },
          create: { ...subject, yearId: thirdYear.id, specializationId: scienceSpec.id, isCommon: false },
        });
        totalSubjects++;
      }
    }
    if (mathSpec) {
      for (const subject of subjectsData["third-year-math"]) {
        await prisma.subject.upsert({
          where: { slug: subject.slug },
          update: { ...subject, yearId: thirdYear.id, specializationId: mathSpec.id, isCommon: false },
          create: { ...subject, yearId: thirdYear.id, specializationId: mathSpec.id, isCommon: false },
        });
        totalSubjects++;
      }
    }
    if (artsSpec) {
      for (const subject of subjectsData["third-year-arts"]) {
        await prisma.subject.upsert({
          where: { slug: subject.slug },
          update: { ...subject, yearId: thirdYear.id, specializationId: artsSpec.id, isCommon: false },
          create: { ...subject, yearId: thirdYear.id, specializationId: artsSpec.id, isCommon: false },
        });
        totalSubjects++;
      }
    }
  }
  console.log(`✅ ${totalSubjects} subjects created`);

  // 5. إنشاء الوحدات والدروس للفيزياء الصف الأول
  console.log("📝 Creating units and lessons for Physics 1...");
  const physics1 = await prisma.subject.findUnique({ where: { slug: "physics-1" } });
  const firstSemester = await prisma.semester.findUnique({ where: { code: "first-semester" } });

  if (physics1) {
    // وحدة الحركة والقوى
    const motionUnit = await prisma.unit.upsert({
      where: { slug: "motion-forces-1" },
      update: { nameAr: "وحدة الحركة والقوى", nameEn: "Motion and Forces Unit", order: 1, subjectId: physics1.id, semesterId: firstSemester?.id },
      create: { nameAr: "وحدة الحركة والقوى", nameEn: "Motion and Forces Unit", slug: "motion-forces-1", order: 1, subjectId: physics1.id, semesterId: firstSemester?.id },
    });

    // درس الحركة والسكون
    const lesson1 = await prisma.lesson.upsert({
      where: { slug: "motion-rest-1" },
      update: {
        titleAr: "الحركة والسكون",
        titleEn: "Motion and Rest",
        descriptionAr: "دراسة مفهوم الحركة والسكون والفرق بينهما",
        descriptionEn: "Study of motion and rest concepts",
        introductionAr: "الحركة هي تغير موضع الجسم بالنسبة لجسم آخر بمرور الزمن. والسكون هو ثبات الجسم في مكانه.",
        introductionEn: "Motion is the change of an object's position over time. Rest is the stability of an object.",
        summaryAr: "الحركة نسبية وتعتمد على المرجع. المسافة كمية قياسية والإزاحة كمية متجهة.",
        summaryEn: "Motion is relative. Distance is scalar, displacement is vector.",
        duration: 45,
        order: 1,
        isFree: true,
        unitId: motionUnit.id,
      },
      create: {
        titleAr: "الحركة والسكون",
        titleEn: "Motion and Rest",
        slug: "motion-rest-1",
        descriptionAr: "دراسة مفهوم الحركة والسكون والفرق بينهما",
        descriptionEn: "Study of motion and rest concepts",
        introductionAr: "الحركة هي تغير موضع الجسم بالنسبة لجسم آخر بمرور الزمن. والسكون هو ثبات الجسم في مكانه.",
        introductionEn: "Motion is the change of an object's position over time. Rest is the stability of an object.",
        summaryAr: "الحركة نسبية وتعتمد على المرجع. المسافة كمية قياسية والإزاحة كمية متجهة.",
        summaryEn: "Motion is relative. Distance is scalar, displacement is vector.",
        duration: 45,
        order: 1,
        isFree: true,
        unitId: motionUnit.id,
      },
    });

    // أهداف الدرس
    for (const obj of [
        { lessonId: lesson1.id, textAr: "التعرف على مفهوم الحركة والسكون", textEn: "Understand motion and rest", order: 1 },
        { lessonId: lesson1.id, textAr: "فهم أن الحركة مفهوم نسبي", textEn: "Understand relative motion", order: 2 },
        { lessonId: lesson1.id, textAr: "التمييز بين المسافة والإزاحة", textEn: "Distinguish distance and displacement", order: 3 },
      ]) {
      await prisma.objective.create({ data: obj });
    }

    // مفاهيم الدرس
    for (const concept of [
        { lessonId: lesson1.id, termAr: "الحركة", termEn: "Motion", definitionAr: "تغير موضع الجسم بمرور الزمن", definitionEn: "Change of position over time", order: 1 },
        { lessonId: lesson1.id, termAr: "السكون", termEn: "Rest", definitionAr: "ثبات الجسم في مكانه", definitionEn: "Stability in place", order: 2 },
        { lessonId: lesson1.id, termAr: "المسافة", termEn: "Distance", definitionAr: "طول المسار الفعلي", definitionEn: "Actual path length", order: 3 },
        { lessonId: lesson1.id, termAr: "الإزاحة", termEn: "Displacement", definitionAr: "أقصر مسافة بين نقطتين", definitionEn: "Shortest distance between points", order: 4 },
      ]) {
      await prisma.concept.create({ data: concept });
    }

    // قوانين الدرس
    await prisma.formula.create({
      data: { lessonId: lesson1.id, formula: "v = d / t", explanationAr: "حساب السرعة", explanationEn: "Calculate velocity", order: 1 },
    });

    // أسئلة الدرس
    await prisma.question.create({
      data: {
        lessonId: lesson1.id,
        type: "multiple_choice",
        questionAr: "الحركة مفهوم...",
        questionEn: "Motion is a... concept",
        optionsAr: JSON.stringify(["مطلق", "نسبي", "ثابت", "متغير"]),
        optionsEn: JSON.stringify(["Absolute", "Relative", "Fixed", "Variable"]),
        answer: "نسبي",
        explanationAr: "الحركة مفهوم نسبي لأنها تعتمد على المرجع",
        explanationEn: "Motion is relative because it depends on the reference",
        order: 1,
      },
    });

    console.log("✅ Physics 1 lessons created");
  }

  // إنشاء محاكيات
  console.log("🎮 Creating simulators...");
  const simulatorsData = [
    { nameAr: "محاكي الحركة", nameEn: "Motion Simulator", slug: "motion-sim", type: "physics", descriptionAr: "محاكاة الحركة المنتظمة", descriptionEn: "Simulate uniform motion", icon: "Play" },
    { nameAr: "محاكي القوى", nameEn: "Forces Simulator", slug: "forces-sim", type: "physics", descriptionAr: "محاكاة القوى", descriptionEn: "Simulate forces", icon: "Zap" },
    { nameAr: "محاكي الذرة", nameEn: "Atom Simulator", slug: "atom-sim", type: "chemistry", descriptionAr: "محاكاة الذرة", descriptionEn: "Simulate atom", icon: "Atom" },
  ];

  for (const sim of simulatorsData) {
    await prisma.simulator.upsert({
      where: { slug: sim.slug },
      update: sim,
      create: sim,
    });
  }
  console.log("✅ Simulators created");

  console.log("\n🎉 Seeding completed successfully!");
  console.log(`📊 Stats:
  - Academic Years: ${academicYearsData.length}
  - Specializations: ${specializationsData.length}
  - Semesters: ${semestersData.length}
  - Subjects: ${totalSubjects}
  - Simulators: ${simulatorsData.length}
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
