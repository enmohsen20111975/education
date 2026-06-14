import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// ==================== البيانات الأساسية ====================

const academicYears = [
  { id: 'year-1', nameAr: 'الصف الأول الثانوي', nameEn: 'First Year Secondary', code: 'first-year', order: 1 },
  { id: 'year-2', nameAr: 'الصف الثاني الثانوي', nameEn: 'Second Year Secondary', code: 'second-year', order: 2 },
  { id: 'year-3', nameAr: 'الصف الثالث الثانوي', nameEn: 'Third Year Secondary', code: 'third-year', order: 3 },
];

const specializations = [
  { id: 'spec-science', nameAr: 'علمي علوم', nameEn: 'Science Stream', code: 'science', descriptionAr: 'شعبة علمي علوم - أحياء + فيزياء + كيمياء', descriptionEn: 'Science Stream - Biology + Physics + Chemistry', order: 1 },
  { id: 'spec-math', nameAr: 'علمي رياضة', nameEn: 'Math Stream', code: 'math', descriptionAr: 'شعبة علمي رياضة - رياضيات + فيزياء + كيمياء', descriptionEn: 'Math Stream - Mathematics + Physics + Chemistry', order: 2 },
  { id: 'spec-arts', nameAr: 'أدبي', nameEn: 'Arts Stream', code: 'arts', descriptionAr: 'شعبة أدبي - تاريخ + جغرافيا + فلسفة', descriptionEn: 'Arts Stream - History + Geography + Philosophy', order: 3 },
];

const semesters = [
  { id: 'sem-1', nameAr: 'الترم الأول', nameEn: 'First Term', code: 'term-1', order: 1 },
  { id: 'sem-2', nameAr: 'الترم الثاني', nameEn: 'Second Term', code: 'term-2', order: 2 },
];

// ==================== مواد الصف الأول الثانوي (مشترك) ====================

const firstYearSubjects = [
  { nameAr: 'اللغة العربية', nameEn: 'Arabic Language', icon: 'BookOpen', color: '#6366F1' },
  { nameAr: 'اللغة الإنجليزية', nameEn: 'English Language', icon: 'Globe', color: '#EC4899' },
  { nameAr: 'اللغة الفرنسية', nameEn: 'French Language', icon: 'Languages', color: '#3B82F6' },
  { nameAr: 'الرياضيات', nameEn: 'Mathematics', icon: 'Calculator', color: '#8B5CF6' },
  { nameAr: 'الفيزياء', nameEn: 'Physics', icon: 'Atom', color: '#3B82F6' },
  { nameAr: 'الكيمياء', nameEn: 'Chemistry', icon: 'FlaskConical', color: '#10B981' },
  { nameAr: 'الأحياء', nameEn: 'Biology', icon: 'Leaf', color: '#F59E0B' },
  { nameAr: 'التاريخ', nameEn: 'History', icon: 'Landmark', color: '#EF4444' },
  { nameAr: 'الجغرافيا', nameEn: 'Geography', icon: 'Map', color: '#06B6D4' },
  { nameAr: 'الفلسفة والمنطق', nameEn: 'Philosophy and Logic', icon: 'Brain', color: '#8B5CF6' },
];

// ==================== مواد الصف الثاني الثانوي ====================

const secondYearSubjects = {
  common: [
    { nameAr: 'اللغة العربية', nameEn: 'Arabic Language', icon: 'BookOpen', color: '#6366F1' },
    { nameAr: 'اللغة الإنجليزية', nameEn: 'English Language', icon: 'Globe', color: '#EC4899' },
    { nameAr: 'اللغة الثانية', nameEn: 'Second Language', icon: 'Languages', color: '#3B82F6' },
  ],
  science: [
    { nameAr: 'الرياضيات', nameEn: 'Mathematics', icon: 'Calculator', color: '#8B5CF6' },
    { nameAr: 'الأحياء', nameEn: 'Biology', icon: 'Leaf', color: '#F59E0B' },
    { nameAr: 'الفيزياء', nameEn: 'Physics', icon: 'Atom', color: '#3B82F6' },
    { nameAr: 'الكيمياء', nameEn: 'Chemistry', icon: 'FlaskConical', color: '#10B981' },
  ],
  math: [
    { nameAr: 'الرياضيات (1)', nameEn: 'Mathematics (1)', icon: 'Calculator', color: '#8B5CF6' },
    { nameAr: 'الفيزياء', nameEn: 'Physics', icon: 'Atom', color: '#3B82F6' },
    { nameAr: 'الكيمياء', nameEn: 'Chemistry', icon: 'FlaskConical', color: '#10B981' },
  ],
  arts: [
    { nameAr: 'التاريخ', nameEn: 'History', icon: 'Landmark', color: '#EF4444' },
    { nameAr: 'الجغرافيا', nameEn: 'Geography', icon: 'Map', color: '#06B6D4' },
    { nameAr: 'الفلسفة', nameEn: 'Philosophy', icon: 'Brain', color: '#8B5CF6' },
    { nameAr: 'علم النفس والاجتماع', nameEn: 'Psychology and Sociology', icon: 'Users', color: '#F59E0B' },
  ],
};

// ==================== مواد الصف الثالث الثانوي ====================

const thirdYearSubjects = {
  common: [
    { nameAr: 'اللغة العربية', nameEn: 'Arabic Language', icon: 'BookOpen', color: '#6366F1' },
    { nameAr: 'اللغة الإنجليزية', nameEn: 'English Language', icon: 'Globe', color: '#EC4899' },
    { nameAr: 'اللغة الثانية', nameEn: 'Second Language', icon: 'Languages', color: '#3B82F6' },
  ],
  science: [
    { nameAr: 'الرياضيات', nameEn: 'Mathematics', icon: 'Calculator', color: '#8B5CF6' },
    { nameAr: 'الأحياء', nameEn: 'Biology', icon: 'Leaf', color: '#F59E0B' },
    { nameAr: 'الفيزياء', nameEn: 'Physics', icon: 'Atom', color: '#3B82F6' },
    { nameAr: 'الكيمياء', nameEn: 'Chemistry', icon: 'FlaskConical', color: '#10B981' },
  ],
  math: [
    { nameAr: 'الرياضيات (1)', nameEn: 'Mathematics (1)', icon: 'Calculator', color: '#8B5CF6' },
    { nameAr: 'الرياضيات (2)', nameEn: 'Mathematics (2)', icon: 'Calculator', color: '#8B5CF6' },
    { nameAr: 'الفيزياء', nameEn: 'Physics', icon: 'Atom', color: '#3B82F6' },
    { nameAr: 'الكيمياء', nameEn: 'Chemistry', icon: 'FlaskConical', color: '#10B981' },
  ],
  arts: [
    { nameAr: 'التاريخ', nameEn: 'History', icon: 'Landmark', color: '#EF4444' },
    { nameAr: 'الجغرافيا', nameEn: 'Geography', icon: 'Map', color: '#06B6D4' },
    { nameAr: 'الفلسفة', nameEn: 'Philosophy', icon: 'Brain', color: '#8B5CF6' },
    { nameAr: 'علم النفس والاجتماع', nameEn: 'Psychology and Sociology', icon: 'Users', color: '#F59E0B' },
  ],
};

// ==================== الوحدات النموذجية ====================

const sampleUnits: Record<string, string[]> = {
  'اللغة العربية': ['وحدة النحو', 'وحدة البلاغة', 'وحدة الأدب', 'وحدة القراءة'],
  'اللغة الإنجليزية': ['Grammar Unit', 'Reading Unit', 'Writing Unit', 'Vocabulary Unit'],
  'اللغة الفرنسية': ['Grammaire', 'Vocabulaire', 'Lecture', 'Expression'],
  'اللغة الثانية': ['الوحدة الأولى', 'الوحدة الثانية', 'الوحدة الثالثة'],
  'الرياضيات': ['الجبر', 'الهندسة', 'التفاضل', 'التكامل', 'الاحتمالات'],
  'الرياضيات (1)': ['الجبر والمعادلات', 'الهندسة التحليلية', 'التفاضل'],
  'الرياضيات (2)': ['التكامل', 'المعادلات التفاضلية', 'التوافقيات'],
  'الفيزياء': ['الميكانيكا', 'الكهربية', 'المغناطيسية', 'الموجات', 'البصريات'],
  'الكيمياء': ['البنية الذرية', 'الروابط الكيميائية', 'التفاعلات الكيميائية', 'الكيمياء العضوية'],
  'الأحياء': ['الخلية', 'الوراثة', 'الأنظمة الحيوية', 'البيئة'],
  'التاريخ': ['الحضارة المصرية القديمة', 'الحضارة الإسلامية', 'مصر الحديثة'],
  'الجغرافيا': ['جغرافيا مصر', 'جغرافيا العالم', 'الخرائط'],
  'الفلسفة': ['مقدمة في الفلسفة', 'المنطق', 'الأخلاق'],
  'الفلسفة والمنطق': ['مقدمة في الفلسفة', 'المنطق', 'الأخلاق'],
  'علم النفس والاجتماع': ['علم النفس', 'علم الاجتماع', 'السلوك الإنساني'],
};

// ==================== دوال مساعدة ====================

function generateId(): string {
  return 'id_' + Math.random().toString(36).substr(2, 16);
}

async function createUnitsAndLessons(subjectId: string, subjectName: string) {
  const units = sampleUnits[subjectName] || ['الوحدة الأولى', 'الوحدة الثانية'];
  
  for (let i = 0; i < units.length; i++) {
    const unit = await db.unit.create({
      data: {
        id: generateId(),
        subjectId,
        nameAr: units[i],
        nameEn: `Unit ${i + 1}`,
        slug: `unit-${i + 1}-${subjectId}`,
        order: i + 1,
        updatedAt: new Date(),
      },
    });

    // إنشاء 2-4 دروس لكل وحدة
    const lessonCount = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < lessonCount; j++) {
      const lesson = await db.lesson.create({
        data: {
          id: generateId(),
          unitId: unit.id,
          titleAr: `الدرس ${j + 1}: ${units[i]}`,
          titleEn: `Lesson ${j + 1}`,
          slug: `lesson-${j + 1}-${unit.id}`,
          descriptionAr: `شرح ${units[i]} - الدرس ${j + 1}`,
          descriptionEn: `Explanation of ${units[i]} - Lesson ${j + 1}`,
          duration: 30 + Math.floor(Math.random() * 30),
          order: j + 1,
          introductionAr: `مقدمة الدرس ${j + 1}`,
          introductionEn: `Introduction to Lesson ${j + 1}`,
          summaryAr: `ملخص الدرس ${j + 1}`,
          summaryEn: `Summary of Lesson ${j + 1}`,
          updatedAt: new Date(),
        },
      });

      // إضافة أهداف
      await db.objective.createMany({
        data: [
          { id: generateId(), lessonId: lesson.id, textAr: `فهم محتوى الدرس ${j + 1}`, textEn: `Understand lesson ${j + 1} content`, order: 1 },
          { id: generateId(), lessonId: lesson.id, textAr: `تطبيق ما تم تعلمه`, textEn: `Apply what was learned`, order: 2 },
        ],
      });

      // إضافة مفاهيم
      await db.concept.create({
        data: {
          id: generateId(),
          lessonId: lesson.id,
          termAr: 'المفهوم الأساسي',
          termEn: 'Basic Concept',
          definitionAr: 'شرح المفهوم الأساسي للدرس',
          definitionEn: 'Explanation of the basic concept',
          order: 1,
        },
      });

      // إضافة أسئلة
      await db.question.create({
        data: {
          id: generateId(),
          lessonId: lesson.id,
          type: 'mcq',
          questionAr: `ما هو الهدف من الدرس ${j + 1}؟`,
          questionEn: `What is the purpose of Lesson ${j + 1}?`,
          optionsAr: JSON.stringify(['الفهم', 'الحفظ', 'التكرار', 'النسخ']),
          optionsEn: JSON.stringify(['Understanding', 'Memorizing', 'Repeating', 'Copying']),
          answer: 'الفهم',
          points: 1,
          order: 1,
        },
      });
    }
  }
}

// ==================== الدالة الرئيسية ====================

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. إنشاء السنوات الدراسية
  console.log('📚 Creating academic years...');
  for (const year of academicYears) {
    await db.academicYear.upsert({
      where: { code: year.code },
      update: year,
      create: { ...year, createdAt: new Date(), updatedAt: new Date() },
    });
  }

  // 2. إنشاء التخصصات
  console.log('🎓 Creating specializations...');
  for (const spec of specializations) {
    await db.specialization.upsert({
      where: { code: spec.code },
      update: spec,
      create: { ...spec, createdAt: new Date(), updatedAt: new Date() },
    });
  }

  // 3. إنشاء الترمات
  console.log('📅 Creating semesters...');
  for (const sem of semesters) {
    await db.semester.upsert({
      where: { code: sem.code },
      update: sem,
      create: { ...sem, createdAt: new Date(), updatedAt: new Date() },
    });
  }

  // 4. إنشاء مواد الصف الأول الثانوي
  console.log('📖 Creating first year subjects...');
  const year1 = await db.academicYear.findUnique({ where: { code: 'first-year' } });
  if (year1) {
    for (let i = 0; i < firstYearSubjects.length; i++) {
      const subj = firstYearSubjects[i];
      const subject = await db.subject.create({
        data: {
          id: generateId(),
          nameAr: subj.nameAr,
          nameEn: subj.nameEn,
          slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-first-year`,
          icon: subj.icon,
          color: subj.color,
          order: i + 1,
          yearId: year1.id,
          isCommon: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await createUnitsAndLessons(subject.id, subj.nameAr);
    }
  }

  // 5. إنشاء مواد الصف الثاني الثانوي
  console.log('📖 Creating second year subjects...');
  const year2 = await db.academicYear.findUnique({ where: { code: 'second-year' } });
  const specScience = await db.specialization.findUnique({ where: { code: 'science' } });
  const specMath = await db.specialization.findUnique({ where: { code: 'math' } });
  const specArts = await db.specialization.findUnique({ where: { code: 'arts' } });

  if (year2) {
    // المواد المشتركة
    for (let i = 0; i < secondYearSubjects.common.length; i++) {
      const subj = secondYearSubjects.common[i];
      const subject = await db.subject.create({
        data: {
          id: generateId(),
          nameAr: subj.nameAr,
          nameEn: subj.nameEn,
          slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-second-year`,
          icon: subj.icon,
          color: subj.color,
          order: i + 1,
          yearId: year2.id,
          isCommon: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await createUnitsAndLessons(subject.id, subj.nameAr);
    }

    // مواد علمي علوم
    if (specScience) {
      for (let i = 0; i < secondYearSubjects.science.length; i++) {
        const subj = secondYearSubjects.science[i];
        const subject = await db.subject.create({
          data: {
            id: generateId(),
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-second-year-science`,
            icon: subj.icon,
            color: subj.color,
            order: i + 1,
            yearId: year2.id,
            specializationId: specScience.id,
            isCommon: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        await createUnitsAndLessons(subject.id, subj.nameAr);
      }
    }

    // مواد علمي رياضة
    if (specMath) {
      for (let i = 0; i < secondYearSubjects.math.length; i++) {
        const subj = secondYearSubjects.math[i];
        const subject = await db.subject.create({
          data: {
            id: generateId(),
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-second-year-math`,
            icon: subj.icon,
            color: subj.color,
            order: i + 1,
            yearId: year2.id,
            specializationId: specMath.id,
            isCommon: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        await createUnitsAndLessons(subject.id, subj.nameAr);
      }
    }

    // مواد أدبي
    if (specArts) {
      for (let i = 0; i < secondYearSubjects.arts.length; i++) {
        const subj = secondYearSubjects.arts[i];
        const subject = await db.subject.create({
          data: {
            id: generateId(),
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-second-year-arts`,
            icon: subj.icon,
            color: subj.color,
            order: i + 1,
            yearId: year2.id,
            specializationId: specArts.id,
            isCommon: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        await createUnitsAndLessons(subject.id, subj.nameAr);
      }
    }
  }

  // 6. إنشاء مواد الصف الثالث الثانوي
  console.log('📖 Creating third year subjects...');
  const year3 = await db.academicYear.findUnique({ where: { code: 'third-year' } });

  if (year3) {
    // المواد المشتركة
    for (let i = 0; i < thirdYearSubjects.common.length; i++) {
      const subj = thirdYearSubjects.common[i];
      const subject = await db.subject.create({
        data: {
          id: generateId(),
          nameAr: subj.nameAr,
          nameEn: subj.nameEn,
          slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-third-year`,
          icon: subj.icon,
          color: subj.color,
          order: i + 1,
          yearId: year3.id,
          isCommon: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await createUnitsAndLessons(subject.id, subj.nameAr);
    }

    // مواد علمي علوم
    if (specScience) {
      for (let i = 0; i < thirdYearSubjects.science.length; i++) {
        const subj = thirdYearSubjects.science[i];
        const subject = await db.subject.create({
          data: {
            id: generateId(),
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-third-year-science`,
            icon: subj.icon,
            color: subj.color,
            order: i + 1,
            yearId: year3.id,
            specializationId: specScience.id,
            isCommon: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        await createUnitsAndLessons(subject.id, subj.nameAr);
      }
    }

    // مواد علمي رياضة
    if (specMath) {
      for (let i = 0; i < thirdYearSubjects.math.length; i++) {
        const subj = thirdYearSubjects.math[i];
        const subject = await db.subject.create({
          data: {
            id: generateId(),
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-third-year-math`,
            icon: subj.icon,
            color: subj.color,
            order: i + 1,
            yearId: year3.id,
            specializationId: specMath.id,
            isCommon: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        await createUnitsAndLessons(subject.id, subj.nameAr);
      }
    }

    // مواد أدبي
    if (specArts) {
      for (let i = 0; i < thirdYearSubjects.arts.length; i++) {
        const subj = thirdYearSubjects.arts[i];
        const subject = await db.subject.create({
          data: {
            id: generateId(),
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: `${subj.nameEn.toLowerCase().replace(/\s+/g, '-')}-third-year-arts`,
            icon: subj.icon,
            color: subj.color,
            order: i + 1,
            yearId: year3.id,
            specializationId: specArts.id,
            isCommon: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        await createUnitsAndLessons(subject.id, subj.nameAr);
      }
    }
  }

  // 7. إنشاء شارات
  console.log('🏆 Creating badges...');
  const badges = [
    { slug: 'first-lesson', nameAr: 'أول درس', nameEn: 'First Lesson', descriptionAr: 'أكملت أول درس', descriptionEn: 'Completed first lesson', icon: '🎓', color: '#10B981', requirement: 1, type: 'lesson' },
    { slug: 'streak-3', nameAr: 'مثابر', nameEn: 'Persistent', descriptionAr: '3 أيام متتالية', descriptionEn: '3 days streak', icon: '🔥', color: '#F59E0B', requirement: 3, type: 'streak' },
    { slug: 'streak-7', nameAr: 'مجتهد', nameEn: 'Hardworking', descriptionAr: 'أسبوع كامل', descriptionEn: 'Full week streak', icon: '🔥🔥', color: '#EF4444', requirement: 7, type: 'streak' },
    { slug: 'physics-expert', nameAr: 'خبير الفيزياء', nameEn: 'Physics Expert', descriptionAr: '1000 XP في الفيزياء', descriptionEn: '1000 XP in Physics', icon: '⚡', color: '#3B82F6', requirement: 1000, type: 'subject' },
    { slug: 'math-expert', nameAr: 'خبير الرياضيات', nameEn: 'Math Expert', descriptionAr: '1000 XP في الرياضيات', descriptionEn: '1000 XP in Math', icon: '🧮', color: '#8B5CF6', requirement: 1000, type: 'subject' },
    { slug: 'perfect-score', nameAr: 'إجابة مثالية', nameEn: 'Perfect Score', descriptionAr: '100% في اختبار', descriptionEn: '100% in a test', icon: '💯', color: '#10B981', requirement: 100, type: 'quiz' },
  ];

  for (const badge of badges) {
    await db.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: { id: generateId(), ...badge, createdAt: new Date() },
    });
  }

  // الإحصائيات النهائية
  console.log('\n=== Seed Complete! ===');
  console.log('Academic Years:', await db.academicYear.count());
  console.log('Specializations:', await db.specialization.count());
  console.log('Subjects:', await db.subject.count());
  console.log('Units:', await db.unit.count());
  console.log('Lessons:', await db.lesson.count());
  console.log('Objectives:', await db.objective.count());
  console.log('Concepts:', await db.concept.count());
  console.log('Questions:', await db.question.count());
  console.log('Badges:', await db.badge.count());
}

main()
  .then(async () => {
    await db.$disconnect();
    console.log('\n✅ Database seeded successfully!');
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await db.$disconnect();
    process.exit(1);
  });
