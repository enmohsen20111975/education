import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/seed - تعبئة قاعدة البيانات بالبيانات الأولية
export async function POST() {
  try {
    // 1. إنشاء المواد
    const subjects = await Promise.all([
      db.subject.upsert({
        where: { slug: "physics" },
        update: {},
        create: {
          slug: "physics",
          nameAr: "الفيزياء",
          nameEn: "Physics",
          icon: "Atom",
          color: "emerald",
          order: 1,
        },
      }),
      db.subject.upsert({
        where: { slug: "math" },
        update: {},
        create: {
          slug: "math",
          nameAr: "الرياضيات",
          nameEn: "Mathematics",
          icon: "Calculator",
          color: "blue",
          order: 2,
        },
      }),
      db.subject.upsert({
        where: { slug: "chemistry" },
        update: {},
        create: {
          slug: "chemistry",
          nameAr: "الكيمياء",
          nameEn: "Chemistry",
          icon: "FlaskConical",
          color: "purple",
          order: 3,
        },
      }),
    ]);

    // 2. إنشاء المحاكيات
    const simulators = await Promise.all([
      db.simulator.upsert({
        where: { slug: "motion" },
        update: {},
        create: {
          slug: "motion",
          nameAr: "محاكي الحركة",
          nameEn: "Motion Simulator",
          type: "physics",
          descriptionAr: "استكشف السرعة والتسارع بشكل تفاعلي",
          descriptionEn: "Explore velocity and acceleration interactively",
        },
      }),
      db.simulator.upsert({
        where: { slug: "forces" },
        update: {},
        create: {
          slug: "forces",
          nameAr: "محاكي القوى",
          nameEn: "Forces Simulator",
          type: "physics",
          descriptionAr: "تعلم توازن القوى بالتجربة",
          descriptionEn: "Learn force balance through experiments",
        },
      }),
      db.simulator.upsert({
        where: { slug: "energy" },
        update: {},
        create: {
          slug: "energy",
          nameAr: "محاكي الطاقة",
          nameEn: "Energy Simulator",
          type: "physics",
          descriptionAr: "شاهد تحولات الطاقة",
          descriptionEn: "Watch energy transformations",
        },
      }),
      db.simulator.upsert({
        where: { slug: "freeFall" },
        update: {},
        create: {
          slug: "freeFall",
          nameAr: "محاكي السقوط الحر",
          nameEn: "Free Fall Simulator",
          type: "physics",
          descriptionAr: "استكشف حركة الأجسام تحت تأثير الجاذبية",
          descriptionEn: "Explore objects motion under gravity",
        },
      }),
      db.simulator.upsert({
        where: { slug: "wave" },
        update: {},
        create: {
          slug: "wave",
          nameAr: "محاكي الموجات",
          nameEn: "Wave Simulator",
          type: "physics",
          descriptionAr: "استكشف أنواع الموجات وخصائصها",
          descriptionEn: "Explore wave types and properties",
        },
      }),
      db.simulator.upsert({
        where: { slug: "functions" },
        update: {},
        create: {
          slug: "functions",
          nameAr: "محاكي الدوال",
          nameEn: "Functions Simulator",
          type: "math",
          descriptionAr: "استكشف الدوال الرياضية ورسومها",
          descriptionEn: "Explore mathematical functions and graphs",
        },
      }),
      db.simulator.upsert({
        where: { slug: "periodicTable" },
        update: {},
        create: {
          slug: "periodicTable",
          nameAr: "الجدول الدوري",
          nameEn: "Periodic Table",
          type: "chemistry",
          descriptionAr: "استكشف العناصر الكيميائية",
          descriptionEn: "Explore chemical elements",
        },
      }),
    ]);

    // 3. إنشاء الوحدات
    const physicsSubject = subjects.find(s => s.slug === "physics")!;
    const mathSubject = subjects.find(s => s.slug === "math")!;
    const chemistrySubject = subjects.find(s => s.slug === "chemistry")!;

    const units = await Promise.all([
      // وحدات الفيزياء
      db.unit.upsert({
        where: { slug: "mechanics" },
        update: {},
        create: {
          slug: "mechanics",
          nameAr: "الميكانيكا",
          nameEn: "Mechanics",
          subjectId: physicsSubject.id,
          order: 1,
        },
      }),
      db.unit.upsert({
        where: { slug: "forces-unit" },
        update: {},
        create: {
          slug: "forces-unit",
          nameAr: "القوى",
          nameEn: "Forces",
          subjectId: physicsSubject.id,
          order: 2,
        },
      }),
      db.unit.upsert({
        where: { slug: "energy-unit" },
        update: {},
        create: {
          slug: "energy-unit",
          nameAr: "الطاقة",
          nameEn: "Energy",
          subjectId: physicsSubject.id,
          order: 3,
        },
      }),
      db.unit.upsert({
        where: { slug: "waves-unit" },
        update: {},
        create: {
          slug: "waves-unit",
          nameAr: "الموجات",
          nameEn: "Waves",
          subjectId: physicsSubject.id,
          order: 4,
        },
      }),
      // وحدات الرياضيات
      db.unit.upsert({
        where: { slug: "algebra" },
        update: {},
        create: {
          slug: "algebra",
          nameAr: "الجبر",
          nameEn: "Algebra",
          subjectId: mathSubject.id,
          order: 1,
        },
      }),
      db.unit.upsert({
        where: { slug: "trigonometry" },
        update: {},
        create: {
          slug: "trigonometry",
          nameAr: "حساب المثلثات",
          nameEn: "Trigonometry",
          subjectId: mathSubject.id,
          order: 2,
        },
      }),
      db.unit.upsert({
        where: { slug: "calculus" },
        update: {},
        create: {
          slug: "calculus",
          nameAr: "التفاضل والتكامل",
          nameEn: "Calculus",
          subjectId: mathSubject.id,
          order: 3,
        },
      }),
      // وحدات الكيمياء
      db.unit.upsert({
        where: { slug: "atomic-structure" },
        update: {},
        create: {
          slug: "atomic-structure",
          nameAr: "البنية الذرية",
          nameEn: "Atomic Structure",
          subjectId: chemistrySubject.id,
          order: 1,
        },
      }),
      db.unit.upsert({
        where: { slug: "chemical-bonding" },
        update: {},
        create: {
          slug: "chemical-bonding",
          nameAr: "الروابط الكيميائية",
          nameEn: "Chemical Bonding",
          subjectId: chemistrySubject.id,
          order: 2,
        },
      }),
      db.unit.upsert({
        where: { slug: "chemical-reactions" },
        update: {},
        create: {
          slug: "chemical-reactions",
          nameAr: "التفاعلات الكيميائية",
          nameEn: "Chemical Reactions",
          subjectId: chemistrySubject.id,
          order: 3,
        },
      }),
    ]);

    // 4. إنشاء الشارات
    const badges = await Promise.all([
      db.badge.upsert({
        where: { slug: "active-learner" },
        update: {},
        create: {
          slug: "active-learner",
          nameAr: "المتعلم النشط",
          nameEn: "Active Learner",
          descriptionAr: "أكمل 5 دروس",
          descriptionEn: "Complete 5 lessons",
          icon: "BookOpen",
          color: "#cd7f32",
          requirement: 5,
          type: "lessons",
        },
      }),
      db.badge.upsert({
        where: { slug: "physics-expert" },
        update: {},
        create: {
          slug: "physics-expert",
          nameAr: "خبير الفيزياء",
          nameEn: "Physics Expert",
          descriptionAr: "أكمل 5 دروس فيزياء",
          descriptionEn: "Complete 5 physics lessons",
          icon: "Atom",
          color: "#c0c0c0",
          requirement: 5,
          type: "subject",
        },
      }),
      db.badge.upsert({
        where: { slug: "math-expert" },
        update: {},
        create: {
          slug: "math-expert",
          nameAr: "عالم الرياضيات",
          nameEn: "Math Expert",
          descriptionAr: "أكمل 5 دروس رياضيات",
          descriptionEn: "Complete 5 math lessons",
          icon: "Calculator",
          color: "#c0c0c0",
          requirement: 5,
          type: "subject",
        },
      }),
      db.badge.upsert({
        where: { slug: "chemistry-expert" },
        update: {},
        create: {
          slug: "chemistry-expert",
          nameAr: "الكيميائي المبدع",
          nameEn: "Chemistry Expert",
          descriptionAr: "أكمل 5 دروس كيمياء",
          descriptionEn: "Complete 5 chemistry lessons",
          icon: "FlaskConical",
          color: "#c0c0c0",
          requirement: 5,
          type: "subject",
        },
      }),
      db.badge.upsert({
        where: { slug: "simulator-pro" },
        update: {},
        create: {
          slug: "simulator-pro",
          nameAr: "المحاكي المحترف",
          nameEn: "Simulator Pro",
          descriptionAr: "استخدم 5 محاكيات",
          descriptionEn: "Use 5 simulators",
          icon: "Zap",
          color: "#ffd700",
          requirement: 5,
          type: "simulator",
        },
      }),
      db.badge.upsert({
        where: { slug: "persistent" },
        update: {},
        create: {
          slug: "persistent",
          nameAr: "المثابر",
          nameEn: "Persistent",
          descriptionAr: "دراسة 7 أيام متواصلة",
          descriptionEn: "Study for 7 consecutive days",
          icon: "Flame",
          color: "#ffd700",
          requirement: 7,
          type: "streak",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        subjects: subjects.length,
        simulators: simulators.length,
        units: units.length,
        badges: badges.length,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
