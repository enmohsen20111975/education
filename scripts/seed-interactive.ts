import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// المحاكيات التفاعلية
const simulatorsData = [
  { nameAr: "محاكي الحركة المستقيمة", nameEn: "Linear Motion Simulator", slug: "motion", type: "physics", descriptionAr: "محاكي تفاعلي لدراسة الحركة", descriptionEn: "Interactive motion simulator" },
  { nameAr: "محاكي القوى وقوانين نيوتن", nameEn: "Forces Simulator", slug: "forces", type: "physics", descriptionAr: "محاكي لدراسة القوى", descriptionEn: "Forces simulator" },
  { nameAr: "محاكي السقوط الحر", nameEn: "Free Fall Simulator", slug: "freefall", type: "physics", descriptionAr: "محاكي السقوط الحر", descriptionEn: "Free fall simulator" },
  { nameAr: "محاكي المقذوفات", nameEn: "Projectile Simulator", slug: "projectile", type: "physics", descriptionAr: "محاكي حركة المقذوفات", descriptionEn: "Projectile motion simulator" },
  { nameAr: "محاكي الطاقة والشغل", nameEn: "Energy Simulator", slug: "energy", type: "physics", descriptionAr: "محاكي الطاقة", descriptionEn: "Energy simulator" },
  { nameAr: "محاكي الموجات", nameEn: "Wave Simulator", slug: "waves", type: "physics", descriptionAr: "محاكي الموجات", descriptionEn: "Wave simulator" },
  { nameAr: "محاكي الدوائر الكهربائية", nameEn: "Circuits Simulator", slug: "circuits", type: "physics", descriptionAr: "محاكي الدوائر", descriptionEn: "Circuits simulator" },
  { nameAr: "محاكي الضوء والبصريات", nameEn: "Optics Simulator", slug: "optics", type: "physics", descriptionAr: "محاكي البصريات", descriptionEn: "Optics simulator" },
  { nameAr: "محاكي الجدول الدوري", nameEn: "Periodic Table Simulator", slug: "periodic", type: "chemistry", descriptionAr: "محاكي الجدول الدوري", descriptionEn: "Periodic table simulator" },
  { nameAr: "محاكي الذرة", nameEn: "Atom Simulator", slug: "atom", type: "chemistry", descriptionAr: "محاكي الذرة", descriptionEn: "Atom simulator" },
  { nameAr: "محاكي الروابط الكيميائية", nameEn: "Bonding Simulator", slug: "bonding", type: "chemistry", descriptionAr: "محاكي الروابط", descriptionEn: "Bonding simulator" },
  { nameAr: "محاكي التفاعلات الكيميائية", nameEn: "Reactions Simulator", slug: "reactions", type: "chemistry", descriptionAr: "محاكي التفاعلات", descriptionEn: "Reactions simulator" },
  { nameAr: "محاكي الدوال الرياضية", nameEn: "Functions Simulator", slug: "functions", type: "math", descriptionAr: "محاكي الدوال", descriptionEn: "Functions simulator" },
  { nameAr: "محاكي الهندسة", nameEn: "Geometry Simulator", slug: "geometry", type: "math", descriptionAr: "محاكي الهندسة", descriptionEn: "Geometry simulator" },
  { nameAr: "محاكي حساب المثلثات", nameEn: "Trigonometry Simulator", slug: "trigonometry", type: "math", descriptionAr: "محاكي المثلثات", descriptionEn: "Trigonometry simulator" },
  { nameAr: "محاكي التفاضل والتكامل", nameEn: "Calculus Simulator", slug: "calculus", type: "math", descriptionAr: "محاكي التفاضل", descriptionEn: "Calculus simulator" },
  { nameAr: "محاكي الخلية", nameEn: "Cell Simulator", slug: "cell", type: "biology", descriptionAr: "محاكي الخلية", descriptionEn: "Cell simulator" },
  { nameAr: "محاكي DNA والوراثة", nameEn: "DNA Simulator", slug: "dna", type: "biology", descriptionAr: "محاكي DNA", descriptionEn: "DNA simulator" },
  { nameAr: "محاكي النظام البيئي", nameEn: "Ecosystem Simulator", slug: "ecosystem", type: "biology", descriptionAr: "محاكي النظام البيئي", descriptionEn: "Ecosystem simulator" },
  { nameAr: "محاكي الكسور", nameEn: "Fractions Simulator", slug: "fractions", type: "math", descriptionAr: "محاكي الكسور", descriptionEn: "Fractions simulator" },
  { nameAr: "محاكي المعادلات", nameEn: "Equations Simulator", slug: "equations", type: "math", descriptionAr: "محاكي المعادلات", descriptionEn: "Equations simulator" },
  { nameAr: "محاكي الاحتمالات", nameEn: "Probability Simulator", slug: "probability", type: "math", descriptionAr: "محاكي الاحتمالات", descriptionEn: "Probability simulator" },
];

async function seedInteractiveContent() {
  console.log("🎮 إضافة المحتوى التفاعلي...\n");

  // 1. إنشاء المحاكيات
  console.log("📦 إنشاء المحاكيات...");
  for (const sim of simulatorsData) {
    const existing = await prisma.simulator.findUnique({ where: { slug: sim.slug } });
    if (!existing) {
      await prisma.simulator.create({ data: sim });
      console.log(`   ✅ ${sim.nameAr}`);
    }
  }

  // 2. إضافة الخرائط الذهنية والرسوم التوضيحية لكل الدروس
  console.log("\n📚 إضافة الخرائط والرسوم للدروس...");
  const lessons = await prisma.lesson.findMany({
    include: { objectives: true, concepts: true }
  });

  let mindMapsAdded = 0;
  let infographicsAdded = 0;

  for (const lesson of lessons) {
    // الخريطة الذهنية
    const existingMindMap = await prisma.mindMap.findUnique({ where: { lessonId: lesson.id } });
    if (!existingMindMap) {
      const mindMapData = {
        central: lesson.titleAr,
        branches: [
          { title: "الأهداف", children: lesson.objectives.slice(0, 5).map(o => o.textAr) },
          { title: "المفاهيم", children: lesson.concepts.slice(0, 5).map(c => c.termAr) },
          { title: "الملخص", children: [lesson.summaryAr?.substring(0, 100) || "الملخص"] }
        ]
      };
      await prisma.mindMap.create({
        data: { lessonId: lesson.id, data: JSON.stringify(mindMapData) }
      });
      mindMapsAdded++;
    }

    // الرسم التوضيحي
    const existingInfographic = await prisma.infographic.findUnique({ where: { lessonId: lesson.id } });
    if (!existingInfographic) {
      const infographicData = {
        title: lesson.titleAr,
        sections: [
          { title: "المقدمة", content: lesson.introductionAr?.substring(0, 200) },
          { title: "الملخص", content: lesson.summaryAr?.substring(0, 200) }
        ]
      };
      await prisma.infographic.create({
        data: { lessonId: lesson.id, type: "summary", data: JSON.stringify(infographicData) }
      });
      infographicsAdded++;
    }
  }

  console.log(`\n📊 ملخص:`);
  console.log(`   المحاكيات: ${simulatorsData.length}`);
  console.log(`   الخرائط الذهنية المضافة: ${mindMapsAdded}`);
  console.log(`   الرسوم التوضيحية المضافة: ${infographicsAdded}`);

  await prisma.$disconnect();
  console.log("\n✨ تم الانتهاء!");
}

seedInteractiveContent().catch(console.error);
