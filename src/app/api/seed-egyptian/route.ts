import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/seed-egyptian - تعبئة قاعدة البيانات بالمنهج المصري الكامل
export async function POST() {
  try {
    // 1. إنشاء السنوات الدراسية
    const firstYear = await db.academicYear.upsert({
      where: { code: "first" },
      update: {},
      create: {
        code: "first",
        nameAr: "أولى ثانوي",
        nameEn: "First Year Secondary",
        order: 1,
      },
    });

    const secondYear = await db.academicYear.upsert({
      where: { code: "second" },
      update: {},
      create: {
        code: "second",
        nameAr: "ثانية ثانوي",
        nameEn: "Second Year Secondary",
        order: 2,
      },
    });

    const thirdYear = await db.academicYear.upsert({
      where: { code: "third" },
      update: {},
      create: {
        code: "third",
        nameAr: "ثالثة ثانوي",
        nameEn: "Third Year Secondary",
        order: 3,
      },
    });

    // 2. إنشاء التخصصات
    const mathScienceSpec = await db.specialization.upsert({
      where: { code: "math-science" },
      update: {},
      create: {
        code: "math-science",
        nameAr: "علمي رياضة",
        nameEn: "Math Science",
        descriptionAr: "شعبة العلوم الرياضية - تشمل رياضيات متقدمة",
        descriptionEn: "Mathematical Science Track - Advanced Mathematics",
        order: 1,
      },
    });

    const scienceSpec = await db.specialization.upsert({
      where: { code: "science" },
      update: {},
      create: {
        code: "science",
        nameAr: "علمي علوم",
        nameEn: "Science",
        descriptionAr: "شعبة العلوم - تشمل أحياء متقدمة",
        descriptionEn: "Science Track - Advanced Biology",
        order: 2,
      },
    });

    const literarySpec = await db.specialization.upsert({
      where: { code: "literary" },
      update: {},
      create: {
        code: "literary",
        nameAr: "أدبي",
        nameEn: "Literary",
        descriptionAr: "شعبة الأدبي - تشمل جغرافيا وتاريخ",
        descriptionEn: "Literary Track - Geography and History",
        order: 3,
      },
    });

    // 3. إنشاء الفصول الدراسية
    const firstSemester = await db.semester.upsert({
      where: { code: "first-semester" },
      update: {},
      create: {
        code: "first-semester",
        nameAr: "الترم الأول",
        nameEn: "First Semester",
        order: 1,
      },
    });

    const secondSemester = await db.semester.upsert({
      where: { code: "second-semester" },
      update: {},
      create: {
        code: "second-semester",
        nameAr: "الترم الثاني",
        nameEn: "Second Semester",
        order: 2,
      },
    });

    // 4. إنشاء المواد الدراسية
    // أولى ثانوي (مشترك)
    await db.subject.upsert({
      where: { slug: "arabic-first" },
      update: {},
      create: {
        slug: "arabic-first",
        nameAr: "اللغة العربية",
        nameEn: "Arabic Language",
        icon: "BookOpen",
        color: "amber",
        yearId: firstYear.id,
        isCommon: true,
        order: 1,
      },
    });

    await db.subject.upsert({
      where: { slug: "english-first" },
      update: {},
      create: {
        slug: "english-first",
        nameAr: "اللغة الإنجليزية",
        nameEn: "English Language",
        icon: "Globe",
        color: "blue",
        yearId: firstYear.id,
        isCommon: true,
        order: 2,
      },
    });

    await db.subject.upsert({
      where: { slug: "integrated-science-first" },
      update: {},
      create: {
        slug: "integrated-science-first",
        nameAr: "العلوم المتكاملة",
        nameEn: "Integrated Science",
        icon: "FlaskConical",
        color: "emerald",
        yearId: firstYear.id,
        isCommon: true,
        order: 3,
      },
    });

    await db.subject.upsert({
      where: { slug: "math-first" },
      update: {},
      create: {
        slug: "math-first",
        nameAr: "الرياضيات",
        nameEn: "Mathematics",
        icon: "Calculator",
        color: "purple",
        yearId: firstYear.id,
        isCommon: true,
        order: 4,
      },
    });

    await db.subject.upsert({
      where: { slug: "history-first" },
      update: {},
      create: {
        slug: "history-first",
        nameAr: "التاريخ",
        nameEn: "History",
        icon: "Landmark",
        color: "rose",
        yearId: firstYear.id,
        isCommon: true,
        order: 5,
      },
    });

    // ثانية ثانوي - مشترك
    await db.subject.upsert({
      where: { slug: "arabic-second" },
      update: {},
      create: {
        slug: "arabic-second",
        nameAr: "اللغة العربية",
        nameEn: "Arabic Language",
        icon: "BookOpen",
        color: "amber",
        yearId: secondYear.id,
        isCommon: true,
        order: 1,
      },
    });

    // ثانية ثانوي - علمي رياضة
    await db.subject.upsert({
      where: { slug: "physics-second-math" },
      update: {},
      create: {
        slug: "physics-second-math",
        nameAr: "الفيزياء",
        nameEn: "Physics",
        icon: "Atom",
        color: "emerald",
        yearId: secondYear.id,
        specializationId: mathScienceSpec.id,
        order: 2,
      },
    });

    await db.subject.upsert({
      where: { slug: "math-second-math" },
      update: {},
      create: {
        slug: "math-second-math",
        nameAr: "الرياضيات",
        nameEn: "Mathematics",
        icon: "Calculator",
        color: "purple",
        yearId: secondYear.id,
        specializationId: mathScienceSpec.id,
        order: 3,
      },
    });

    await db.subject.upsert({
      where: { slug: "chemistry-second-math" },
      update: {},
      create: {
        slug: "chemistry-second-math",
        nameAr: "الكيمياء",
        nameEn: "Chemistry",
        icon: "FlaskConical",
        color: "cyan",
        yearId: secondYear.id,
        specializationId: mathScienceSpec.id,
        order: 4,
      },
    });

    // ثانية ثانوي - علمي علوم
    await db.subject.upsert({
      where: { slug: "biology-second-science" },
      update: {},
      create: {
        slug: "biology-second-science",
        nameAr: "الأحياء",
        nameEn: "Biology",
        icon: "Leaf",
        color: "green",
        yearId: secondYear.id,
        specializationId: scienceSpec.id,
        order: 2,
      },
    });

    // ثانية ثانوي - أدبي
    await db.subject.upsert({
      where: { slug: "geography-second-literary" },
      update: {},
      create: {
        slug: "geography-second-literary",
        nameAr: "الجغرافيا",
        nameEn: "Geography",
        icon: "Map",
        color: "teal",
        yearId: secondYear.id,
        specializationId: literarySpec.id,
        order: 2,
      },
    });

    // ثالثة ثانوي - مشترك
    await db.subject.upsert({
      where: { slug: "arabic-third" },
      update: {},
      create: {
        slug: "arabic-third",
        nameAr: "اللغة العربية",
        nameEn: "Arabic Language",
        icon: "BookOpen",
        color: "amber",
        yearId: thirdYear.id,
        isCommon: true,
        order: 1,
      },
    });

    await db.subject.upsert({
      where: { slug: "english-third" },
      update: {},
      create: {
        slug: "english-third",
        nameAr: "اللغة الإنجليزية",
        nameEn: "English Language",
        icon: "Globe",
        color: "blue",
        yearId: thirdYear.id,
        isCommon: true,
        order: 2,
      },
    });

    // ثالثة ثانوي - علمي رياضة
    await db.subject.upsert({
      where: { slug: "physics-third-math" },
      update: {},
      create: {
        slug: "physics-third-math",
        nameAr: "الفيزياء",
        nameEn: "Physics",
        icon: "Atom",
        color: "emerald",
        yearId: thirdYear.id,
        specializationId: mathScienceSpec.id,
        order: 3,
      },
    });

    await db.subject.upsert({
      where: { slug: "pure-math-third" },
      update: {},
      create: {
        slug: "pure-math-third",
        nameAr: "الرياضيات البحتة",
        nameEn: "Pure Mathematics",
        icon: "Calculator",
        color: "purple",
        yearId: thirdYear.id,
        specializationId: mathScienceSpec.id,
        order: 4,
      },
    });

    await db.subject.upsert({
      where: { slug: "applied-math-third" },
      update: {},
      create: {
        slug: "applied-math-third",
        nameAr: "الرياضيات التطبيقية",
        nameEn: "Applied Mathematics",
        icon: "Sigma",
        color: "indigo",
        yearId: thirdYear.id,
        specializationId: mathScienceSpec.id,
        order: 5,
      },
    });

    await db.subject.upsert({
      where: { slug: "chemistry-third-math" },
      update: {},
      create: {
        slug: "chemistry-third-math",
        nameAr: "الكيمياء",
        nameEn: "Chemistry",
        icon: "FlaskConical",
        color: "cyan",
        yearId: thirdYear.id,
        specializationId: mathScienceSpec.id,
        order: 6,
      },
    });

    // ثالثة ثانوي - علمي علوم
    await db.subject.upsert({
      where: { slug: "biology-third-science" },
      update: {},
      create: {
        slug: "biology-third-science",
        nameAr: "الأحياء",
        nameEn: "Biology",
        icon: "Leaf",
        color: "green",
        yearId: thirdYear.id,
        specializationId: scienceSpec.id,
        order: 3,
      },
    });

    await db.subject.upsert({
      where: { slug: "physics-third-science" },
      update: {},
      create: {
        slug: "physics-third-science",
        nameAr: "الفيزياء",
        nameEn: "Physics",
        icon: "Atom",
        color: "emerald",
        yearId: thirdYear.id,
        specializationId: scienceSpec.id,
        order: 4,
      },
    });

    // ثالثة ثانوي - أدبي
    await db.subject.upsert({
      where: { slug: "history-third-literary" },
      update: {},
      create: {
        slug: "history-third-literary",
        nameAr: "التاريخ",
        nameEn: "History",
        icon: "Landmark",
        color: "rose",
        yearId: thirdYear.id,
        specializationId: literarySpec.id,
        order: 3,
      },
    });

    await db.subject.upsert({
      where: { slug: "geography-third-literary" },
      update: {},
      create: {
        slug: "geography-third-literary",
        nameAr: "الجغرافيا",
        nameEn: "Geography",
        icon: "Map",
        color: "teal",
        yearId: thirdYear.id,
        specializationId: literarySpec.id,
        order: 4,
      },
    });

    await db.subject.upsert({
      where: { slug: "statistics-third-literary" },
      update: {},
      create: {
        slug: "statistics-third-literary",
        nameAr: "الإحصاء",
        nameEn: "Statistics",
        icon: "BarChart3",
        color: "orange",
        yearId: thirdYear.id,
        specializationId: literarySpec.id,
        order: 5,
      },
    });

    // 5. إنشاء المحاكيات
    const simulators = await Promise.all([
      // محاكيات الفيزياء
      db.simulator.upsert({
        where: { slug: "motion-simulator" },
        update: {},
        create: {
          slug: "motion-simulator",
          nameAr: "محاكي الحركة",
          nameEn: "Motion Simulator",
          type: "physics",
          descriptionAr: "استكشف الحركة والسرعة والتسارع",
          descriptionEn: "Explore motion, velocity and acceleration",
          icon: "Move",
          difficulty: "beginner",
        },
      }),
      db.simulator.upsert({
        where: { slug: "forces-simulator" },
        update: {},
        create: {
          slug: "forces-simulator",
          nameAr: "محاكي القوى",
          nameEn: "Forces Simulator",
          type: "physics",
          descriptionAr: "تعلم توازن القوى وقوانين نيوتن",
          descriptionEn: "Learn force balance and Newton's laws",
          icon: "Zap",
          difficulty: "intermediate",
        },
      }),
      db.simulator.upsert({
        where: { slug: "electric-circuits" },
        update: {},
        create: {
          slug: "electric-circuits",
          nameAr: "الدوائر الكهربية",
          nameEn: "Electric Circuits",
          type: "physics",
          descriptionAr: "بناء دوائر كهربية تفاعلية",
          descriptionEn: "Build interactive electric circuits",
          icon: "Cpu",
          difficulty: "intermediate",
        },
      }),
      db.simulator.upsert({
        where: { slug: "magnetic-field" },
        update: {},
        create: {
          slug: "magnetic-field",
          nameAr: "المجال المغناطيسي",
          nameEn: "Magnetic Field",
          type: "physics",
          descriptionAr: "استكشف خطوط المجال المغناطيسي",
          descriptionEn: "Explore magnetic field lines",
          icon: "Magnet",
          difficulty: "advanced",
        },
      }),
      db.simulator.upsert({
        where: { slug: "optics-simulator" },
        update: {},
        create: {
          slug: "optics-simulator",
          nameAr: "محاكي البصريات",
          nameEn: "Optics Simulator",
          type: "physics",
          descriptionAr: "العدسات والمرايا وتكوين الصور",
          descriptionEn: "Lenses, mirrors and image formation",
          icon: "Eye",
          difficulty: "intermediate",
        },
      }),
      // محاكيات الكيمياء
      db.simulator.upsert({
        where: { slug: "atom-structure" },
        update: {},
        create: {
          slug: "atom-structure",
          nameAr: "البنية الذرية",
          nameEn: "Atomic Structure",
          type: "chemistry",
          descriptionAr: "نموذج بور وتوزيع الإلكترونات",
          descriptionEn: "Bohr model and electron distribution",
          icon: "Atom",
          difficulty: "beginner",
        },
      }),
      db.simulator.upsert({
        where: { slug: "chemical-bonds" },
        update: {},
        create: {
          slug: "chemical-bonds",
          nameAr: "الروابط الكيميائية",
          nameEn: "Chemical Bonds",
          type: "chemistry",
          descriptionAr: "الروابط الأيونية والتساهمية",
          descriptionEn: "Ionic and covalent bonds",
          icon: "Link",
          difficulty: "intermediate",
        },
      }),
      db.simulator.upsert({
        where: { slug: "periodic-table" },
        update: {},
        create: {
          slug: "periodic-table",
          nameAr: "الجدول الدوري",
          nameEn: "Periodic Table",
          type: "chemistry",
          descriptionAr: "استكشف العناصر الكيميائية",
          descriptionEn: "Explore chemical elements",
          icon: "Table",
          difficulty: "beginner",
        },
      }),
      // محاكيات الرياضيات
      db.simulator.upsert({
        where: { slug: "functions-plotter" },
        update: {},
        create: {
          slug: "functions-plotter",
          nameAr: "راسم الدوال",
          nameEn: "Functions Plotter",
          type: "math",
          descriptionAr: "رسم الدوال الرياضية تفاعلياً",
          descriptionEn: "Interactive mathematical functions plotting",
          icon: "TrendingUp",
          difficulty: "intermediate",
        },
      }),
      db.simulator.upsert({
        where: { slug: "differentiation" },
        update: {},
        create: {
          slug: "differentiation",
          nameAr: "التفاضل",
          nameEn: "Differentiation",
          type: "math",
          descriptionAr: "المماس ومعدل التغير",
          descriptionEn: "Tangent and rate of change",
          icon: "Spline",
          difficulty: "advanced",
        },
      }),
      // محاكيات الأحياء
      db.simulator.upsert({
        where: { slug: "cell-3d" },
        update: {},
        create: {
          slug: "cell-3d",
          nameAr: "الخلية ثلاثية الأبعاد",
          nameEn: "3D Cell",
          type: "biology",
          descriptionAr: "جولة داخل الخلية",
          descriptionEn: "Tour inside the cell",
          icon: "CircleDot",
          difficulty: "beginner",
        },
      }),
      db.simulator.upsert({
        where: { slug: "photosynthesis" },
        update: {},
        create: {
          slug: "photosynthesis",
          nameAr: "البناء الضوئي",
          nameEn: "Photosynthesis",
          type: "biology",
          descriptionAr: "عملية البناء الضوئي",
          descriptionEn: "Photosynthesis process",
          icon: "Sun",
          difficulty: "intermediate",
        },
      }),
    ]);

    // 6. إنشاء الشارات
    const badges = await Promise.all([
      db.badge.upsert({
        where: { slug: "first-lesson" },
        update: {},
        create: {
          slug: "first-lesson",
          nameAr: "البداية",
          nameEn: "The Beginning",
          descriptionAr: "أكمل أول درس",
          descriptionEn: "Complete your first lesson",
          icon: "Rocket",
          color: "#10b981",
          requirement: 1,
          type: "lessons",
        },
      }),
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
          descriptionAr: "أكمل 10 دروس في الفيزياء",
          descriptionEn: "Complete 10 physics lessons",
          icon: "Atom",
          color: "#c0c0c0",
          requirement: 10,
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
          descriptionAr: "أكمل 10 دروس في الرياضيات",
          descriptionEn: "Complete 10 math lessons",
          icon: "Calculator",
          color: "#c0c0c0",
          requirement: 10,
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
        where: { slug: "champion" },
        update: {},
        create: {
          slug: "champion",
          nameAr: "البطل",
          nameEn: "Champion",
          descriptionAr: "أكمل 50 درس",
          descriptionEn: "Complete 50 lessons",
          icon: "Trophy",
          color: "#ffd700",
          requirement: 50,
          type: "lessons",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Egyptian curriculum structure seeded successfully!",
      data: {
        academicYears: 3,
        specializations: 3,
        semesters: 2,
        simulators: simulators.length,
        badges: badges.length,
      },
    });
  } catch (error) {
    console.error("Error seeding Egyptian curriculum:", error);
    return NextResponse.json(
      { error: "Failed to seed Egyptian curriculum", details: String(error) },
      { status: 500 }
    );
  }
}
