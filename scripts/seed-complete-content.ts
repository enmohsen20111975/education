import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Arabic educational content generators
const formulaTemplates = {
  physics: [
    { formula: 'F = ma', explanationAr: 'القوة = الكتلة × التسارع', explanationEn: 'Force = mass × acceleration' },
    { formula: 'E = mc²', explanationAr: 'الطاقة = الكتلة × سرعة الضوء²', explanationEn: 'Energy = mass × speed of light²' },
    { formula: 'v = u + at', explanationAr: 'السرعة النهائية = السرعة الابتدائية + التسارع × الزمن', explanationEn: 'Final velocity = initial velocity + acceleration × time' },
    { formula: 's = ut + ½at²', explanationAr: 'الإزاحة = السرعة الابتدائية × الزمن + ½ × التسارع × الزمن²', explanationEn: 'Displacement = initial velocity × time + ½ × acceleration × time²' },
    { formula: 'P = IV', explanationAr: 'القدرة = التيار × الجهد', explanationEn: 'Power = current × voltage' },
    { formula: 'V = IR', explanationAr: 'الجهد = التيار × المقاومة (قانون أوم)', explanationEn: 'Voltage = current × resistance (Ohm\'s law)' },
    { formula: 'E = ½mv²', explanationAr: 'الطاقة الحركية = ½ × الكتلة × السرعة²', explanationEn: 'Kinetic energy = ½ × mass × velocity²' },
    { formula: 'E = mgh', explanationAr: 'الطاقة الكامنة = الكتلة × الجاذبية × الارتفاع', explanationEn: 'Potential energy = mass × gravity × height' },
    { formula: 'F = kx', explanationAr: 'قوة النابض = ثابت النابض × الإزاحة (قانون هوك)', explanationEn: 'Spring force = spring constant × displacement (Hooke\'s law)' },
    { formula: 'λ = v/f', explanationAr: 'الطول الموجي = السرعة / التردد', explanationEn: 'Wavelength = velocity / frequency' },
  ],
  chemistry: [
    { formula: 'n = m/M', explanationAr: 'عدد المولات = الكتلة / الكتلة المولية', explanationEn: 'Moles = mass / molar mass' },
    { formula: 'PV = nRT', explanationAr: 'الضغط × الحجم = عدد المولات × ثابت الغاز × درجة الحرارة', explanationEn: 'Pressure × volume = moles × gas constant × temperature' },
    { formula: 'M = n/V', explanationAr: 'المولارية = عدد المولات / الحجم', explanationEn: 'Molarity = moles / volume' },
    { formula: 'pH = -log[H⁺]', explanationAr: 'الأس الهيدروجيني = -لوتركيز أيونات الهيدروجين', explanationEn: 'pH = -log of hydrogen ion concentration' },
    { formula: 'q = mcΔT', explanationAr: 'الحرارة = الكتلة × الحرارة النوعية × التغير في درجة الحرارة', explanationEn: 'Heat = mass × specific heat × temperature change' },
    { formula: 'K = [products]/[reactants]', explanationAr: 'ثابت الاتزان = تركيز النواتج / تركيز المتفاعلات', explanationEn: 'Equilibrium constant = products concentration / reactants concentration' },
  ],
  math: [
    { formula: 'x = (-b ± √(b²-4ac)) / 2a', explanationAr: 'قانون حل المعادلة التربيعية', explanationEn: 'Quadratic formula' },
    { formula: 'a² + b² = c²', explanationAr: 'نظرية فيثاغورس: مجموع مربعي الضلعين = مربع الوتر', explanationEn: 'Pythagorean theorem' },
    { formula: 'sin²θ + cos²θ = 1', explanationAr: 'المتطابقة الأساسية في المثلثات', explanationEn: 'Fundamental trigonometric identity' },
    { formula: 'd/dx(xⁿ) = nxⁿ⁻¹', explanationAr: 'قاعدة الاشتقاق للدوال الأسية', explanationEn: 'Differentiation rule for exponential functions' },
    { formula: '∫xⁿdx = xⁿ⁺¹/(n+1) + C', explanationAr: 'قاعدة التكامل للدوال الأسية', explanationEn: 'Integration rule for exponential functions' },
    { formula: 'log(ab) = log a + log b', explanationAr: 'قاعدة ضرب اللوغاريتمات', explanationEn: 'Logarithm product rule' },
    { formula: 'A = πr²', explanationAr: 'مساحة الدائرة = ط × نق²', explanationEn: 'Area of a circle = π × radius²' },
    { formula: 'V = 4/3πr³', explanationAr: 'حجم الكرة = 4/3 × ط × نق³', explanationEn: 'Volume of a sphere = 4/3 × π × radius³' },
  ],
  biology: [
    { formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', explanationAr: 'معادلة التنفس الخلوي', explanationEn: 'Cellular respiration equation' },
    { formula: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂', explanationAr: 'معادلة البناء الضوئي', explanationEn: 'Photosynthesis equation' },
    { formula: 'pH = 7 (neutral)', explanationAr: 'الأس الهيدروجيني المتعادل = 7', explanationEn: 'Neutral pH = 7' },
    { formula: '2n = chromosome number', explanationAr: 'عدد الكروموسومات الخلوي (2n)', explanationEn: 'Diploid chromosome number (2n)' },
  ],
  arabic: [
    { formula: 'الفاعل + المفعول به + الفعل', explanationAr: 'ترتيب الجملة الفعلية في اللغة العربية', explanationEn: 'Arabic verbal sentence structure' },
    { formula: 'المبتدأ + الخبر', explanationAr: 'ترتيب الجملة الاسمية', explanationEn: 'Arabic nominal sentence structure' },
  ],
  english: [
    { formula: 'Subject + Verb + Object', explanationAr: 'تركيب الجملة الأساسية في الإنجليزية', explanationEn: 'Basic English sentence structure' },
    { formula: 'If + present, will + infinitive', explanationAr: 'الشرط من النوع الأول', explanationEn: 'First conditional' },
  ],
};

const exampleTemplates = {
  physics: [
    {
      questionAr: 'سيارة كتلتها 1000 كجم تتحرك بتسارع 2 م/ث². احسب القوة المؤثرة عليها.',
      questionEn: 'A car with mass 1000 kg accelerates at 2 m/s². Calculate the force.',
      solutionAr: 'F = ma = 1000 × 2 = 2000 نيوتن',
      solutionEn: 'F = ma = 1000 × 2 = 2000 N',
      stepsAr: ['نعين الكتلة m = 1000 كجم', 'نعين التسارع a = 2 م/ث²', 'نطبق القانون F = ma', 'F = 1000 × 2 = 2000 نيوتن'],
      stepsEn: ['Identify mass m = 1000 kg', 'Identify acceleration a = 2 m/s²', 'Apply formula F = ma', 'F = 1000 × 2 = 2000 N'],
    },
    {
      questionAr: 'جسم يبدأ من السكون ويتسارع بمعدل 4 م/ث² لمدة 5 ثواني. احسب السرعة النهائية.',
      questionEn: 'An object starts from rest and accelerates at 4 m/s² for 5 seconds. Find the final velocity.',
      solutionAr: 'v = u + at = 0 + 4 × 5 = 20 م/ث',
      solutionEn: 'v = u + at = 0 + 4 × 5 = 20 m/s',
      stepsAr: ['السرعة الابتدائية u = 0', 'التسارع a = 4 م/ث²', 'الزمن t = 5 ث', 'v = 0 + 4 × 5 = 20 م/ث'],
      stepsEn: ['Initial velocity u = 0', 'Acceleration a = 4 m/s²', 'Time t = 5 s', 'v = 0 + 4 × 5 = 20 m/s'],
    },
  ],
  chemistry: [
    {
      questionAr: 'احسب عدد مولات 36 جرام من الماء (H₂O). الكتلة المولية = 18 جم/مول.',
      questionEn: 'Calculate the moles in 36 g of water (H₂O). Molar mass = 18 g/mol.',
      solutionAr: 'n = m/M = 36/18 = 2 مول',
      solutionEn: 'n = m/M = 36/18 = 2 mol',
      stepsAr: ['الكتلة m = 36 جم', 'الكتلة المولية M = 18 جم/مول', 'نطبق القانون n = m/M', 'n = 36/18 = 2 مول'],
      stepsEn: ['Mass m = 36 g', 'Molar mass M = 18 g/mol', 'Apply formula n = m/M', 'n = 36/18 = 2 mol'],
    },
  ],
  math: [
    {
      questionAr: 'أحسب قيم x في المعادلة: x² - 5x + 6 = 0',
      questionEn: 'Solve for x: x² - 5x + 6 = 0',
      solutionAr: 'x = 2 أو x = 3',
      solutionEn: 'x = 2 or x = 3',
      stepsAr: ['نحلل المعادلة: (x - 2)(x - 3) = 0', 'x - 2 = 0 → x = 2', 'x - 3 = 0 → x = 3'],
      stepsEn: ['Factor: (x - 2)(x - 3) = 0', 'x - 2 = 0 → x = 2', 'x - 3 = 0 → x = 3'],
    },
    {
      questionAr: 'أحسب مساحة دائرة نصف قطرها 7 سم.',
      questionEn: 'Calculate the area of a circle with radius 7 cm.',
      solutionAr: 'A = 49π سم² ≈ 153.94 سم²',
      solutionEn: 'A = 49π cm² ≈ 153.94 cm²',
      stepsAr: ['القانون: A = πr²', 'r = 7 سم', 'A = π × 7² = 49π سم²'],
      stepsEn: ['Formula: A = πr²', 'r = 7 cm', 'A = π × 7² = 49π cm²'],
    },
  ],
  biology: [
    {
      questionAr: 'اشرح مراحل الانقسام المتساوي.',
      questionEn: 'Explain the stages of mitosis.',
      solutionAr: 'المراحل: الطور التمهيدي، الطور الاستوائي، الطور الانفصالي، الطور النهائي',
      solutionEn: 'Stages: Prophase, Metaphase, Anaphase, Telophase',
      stepsAr: ['الطور التمهيدي: اختفاء الغشاء النووي', 'الطور الاستوائي: اصطفاف الكروموسومات', 'الطور الانفصالي: انفصال الكروماتيدات', 'الطور النهائي: تكوين خليتين'],
      stepsEn: ['Prophase: Nuclear envelope disappears', 'Metaphase: Chromosomes align', 'Anaphase: Chromatids separate', 'Telophase: Two cells form'],
    },
  ],
};

const simulatorTemplates = [
  { nameAr: 'محاكي الحركة الدائرية', nameEn: 'Circular Motion Simulator', slug: 'circular-motion', type: 'physics', descriptionAr: 'محاكاة تفاعلية للحركة الدائرية والقوة الطاردة المركزية', descriptionEn: 'Interactive simulation of circular motion and centripetal force' },
  { nameAr: 'محاكي الدوائر الكهربائية', nameEn: 'Electric Circuits Simulator', slug: 'electric-circuits', type: 'physics', descriptionAr: 'بناء دوائر كهربائية وقياس التيار والجهد', descriptionEn: 'Build electric circuits and measure current and voltage' },
  { nameAr: 'محاكي البندول البسيط', nameEn: 'Simple Pendulum Simulator', slug: 'pendulum', type: 'physics', descriptionAr: 'دراسة حركة البندول البسيط والعوامل المؤثرة فيها', descriptionEn: 'Study simple pendulum motion and affecting factors' },
  { nameAr: 'محاكي الجزيئات', nameEn: 'Molecule Builder', slug: 'molecule-builder', type: 'chemistry', descriptionAr: 'بناء جزيئات كيميائية ودراسة الروابط', descriptionEn: 'Build chemical molecules and study bonds' },
  { nameAr: 'محاكي التفاعلات الكيميائية', nameEn: 'Chemical Reactions Simulator', slug: 'chemical-reactions', type: 'chemistry', descriptionAr: 'محاكاة التفاعلات الكيميائية وقياس الطاقة', descriptionEn: 'Simulate chemical reactions and measure energy' },
  { nameAr: 'محاكي الرسم البياني', nameEn: 'Graphing Calculator', slug: 'graphing-calculator', type: 'math', descriptionAr: 'رسم الدوال الرياضية وتحليلها', descriptionEn: 'Plot and analyze mathematical functions' },
  { nameAr: 'محاكي الهندسة الفراغية', nameEn: '3D Geometry Simulator', slug: 'geometry-3d', type: 'math', descriptionAr: 'تصور الأشكال الهندسية ثلاثية الأبعاد', descriptionEn: 'Visualize 3D geometric shapes' },
  { nameAr: 'محاكي الانقسام الخلوي', nameEn: 'Cell Division Simulator', slug: 'cell-division', type: 'biology', descriptionAr: 'محاكاة مراحل الانقسام المتساوي والمنصف', descriptionEn: 'Simulate mitosis and meiosis stages' },
  { nameAr: 'محاكي DNA', nameEn: 'DNA Simulator', slug: 'dna-simulator', type: 'biology', descriptionAr: 'فهم بنية DNA وآلية التضاعف', descriptionEn: 'Understand DNA structure and replication' },
  { nameAr: 'محاكي الحمض والقاعدة', nameEn: 'Acid-Base Simulator', slug: 'acid-base', type: 'chemistry', descriptionAr: 'دراسة التفاعلات الحمضية والقاعدية ورقم pH', descriptionEn: 'Study acid-base reactions and pH' },
];

const additionalBadges = [
  { slug: 'physics-master', nameAr: 'خبير الفيزياء', nameEn: 'Physics Master', descriptionAr: 'أكمل 50 درس في الفيزياء', descriptionEn: 'Complete 50 Physics lessons', icon: 'atom', color: 'blue', requirement: 50, type: 'subject' },
  { slug: 'chemistry-expert', nameAr: 'خبير الكيمياء', nameEn: 'Chemistry Expert', descriptionAr: 'أكمل 50 درس في الكيمياء', descriptionEn: 'Complete 50 Chemistry lessons', icon: 'flask', color: 'green', requirement: 50, type: 'subject' },
  { slug: 'math-genius', nameAr: 'عبقري الرياضيات', nameEn: 'Math Genius', descriptionAr: 'أكمل 50 درس في الرياضيات', descriptionEn: 'Complete 50 Math lessons', icon: 'calculator', color: 'purple', requirement: 50, type: 'subject' },
  { slug: 'biology-expert', nameAr: 'خبير الأحياء', nameEn: 'Biology Expert', descriptionAr: 'أكمل 50 درس في الأحياء', descriptionEn: 'Complete 50 Biology lessons', icon: 'dna', color: 'teal', requirement: 50, type: 'subject' },
  { slug: 'streak-week', nameAr: 'أسبوع متواصل', nameEn: 'Week Streak', descriptionAr: 'ذاكر 7 أيام متتالية', descriptionEn: 'Study for 7 consecutive days', icon: 'flame', color: 'orange', requirement: 7, type: 'streak' },
  { slug: 'streak-month', nameAr: 'شهر متواصل', nameEn: 'Month Streak', descriptionAr: 'ذاكر 30 يوم متتالي', descriptionEn: 'Study for 30 consecutive days', icon: 'fire', color: 'red', requirement: 30, type: 'streak' },
  { slug: 'quiz-ace', nameAr: 'بطل الاختبارات', nameEn: 'Quiz Ace', descriptionAr: 'احصل على 100% في 10 اختبارات', descriptionEn: 'Get 100% in 10 quizzes', icon: 'trophy', color: 'yellow', requirement: 10, type: 'quiz' },
  { slug: 'night-owl', nameAr: 'بومة الليل', nameEn: 'Night Owl', descriptionAr: 'ذاكر بعد منتصف الليل 10 مرات', descriptionEn: 'Study after midnight 10 times', icon: 'moon', color: 'indigo', requirement: 10, type: 'special' },
];

function getSubjectType(subjectName: string): string {
  const name = subjectName.toLowerCase();
  if (name.includes('فيزياء') || name.includes('physics')) return 'physics';
  if (name.includes('كيمياء') || name.includes('chemistry')) return 'chemistry';
  if (name.includes('رياضيات') || name.includes('math')) return 'math';
  if (name.includes('أحياء') || name.includes('biology')) return 'biology';
  if (name.includes('عرب') || name.includes('arabic')) return 'arabic';
  if (name.includes('إنجليزي') || name.includes('english')) return 'english';
  return 'general';
}

async function seedContent() {
  console.log('🚀 Starting complete content seeding...');

  // 1. Add Simulators
  console.log('\n📦 Adding simulators...');
  for (const sim of simulatorTemplates) {
    const existing = await db.simulator.findUnique({ where: { slug: sim.slug } });
    if (!existing) {
      await db.simulator.create({
        data: {
          id: `sim-${sim.slug}`,
          ...sim,
          difficulty: 'intermediate',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
      console.log(`  ✓ Added simulator: ${sim.nameAr}`);
    }
  }

  // 2. Add more Badges
  console.log('\n🏆 Adding badges...');
  for (const badge of additionalBadges) {
    const existing = await db.badge.findUnique({ where: { slug: badge.slug } });
    if (!existing) {
      await db.badge.create({
        data: {
          id: `badge-${badge.slug}`,
          ...badge,
          createdAt: new Date(),
        }
      });
      console.log(`  ✓ Added badge: ${badge.nameAr}`);
    }
  }

  // 3. Get all lessons and add content
  console.log('\n📚 Processing lessons...');
  const lessons = await db.lesson.findMany({
    include: {
      Unit: {
        include: {
          Subject: true,
        }
      }
    }
  });

  let formulasAdded = 0;
  let examplesAdded = 0;
  let questionsAdded = 0;

  for (const lesson of lessons) {
    const subjectType = getSubjectType(lesson.Unit.Subject.nameAr);
    const formulas = formulaTemplates[subjectType as keyof typeof formulaTemplates] || [];
    const examples = exampleTemplates[subjectType as keyof typeof exampleTemplates] || [];

    // Add formulas
    const existingFormulas = await db.formula.count({ where: { lessonId: lesson.id } });
    if (existingFormulas === 0 && formulas.length > 0) {
      const selectedFormulas = formulas.slice(0, 2); // Add 2 formulas per lesson
      for (let i = 0; i < selectedFormulas.length; i++) {
        await db.formula.create({
          data: {
            id: `form-${lesson.id}-${i}`,
            lessonId: lesson.id,
            formula: selectedFormulas[i].formula,
            explanationAr: selectedFormulas[i].explanationAr,
            explanationEn: selectedFormulas[i].explanationEn,
            order: i + 1,
          }
        });
        formulasAdded++;
      }
    }

    // Add examples
    const existingExamples = await db.example.count({ where: { lessonId: lesson.id } });
    if (existingExamples === 0 && examples.length > 0) {
      const selectedExample = examples[0];
      await db.example.create({
        data: {
          id: `ex-${lesson.id}`,
          lessonId: lesson.id,
          questionAr: selectedExample.questionAr,
          questionEn: selectedExample.questionEn,
          solutionAr: selectedExample.solutionAr,
          solutionEn: selectedExample.solutionEn,
          stepsAr: JSON.stringify(selectedExample.stepsAr),
          stepsEn: JSON.stringify(selectedExample.stepsEn),
          order: 1,
        }
      });
      examplesAdded++;
    }

    // Add more questions
    const existingQuestions = await db.question.count({ where: { lessonId: lesson.id } });
    if (existingQuestions < 3) {
      const additionalQuestions = [
        {
          questionAr: `سؤال تطبيقي على ${lesson.titleAr}`,
          questionEn: `Application question on ${lesson.titleEn}`,
          answer: 'a',
          optionsAr: JSON.stringify(['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د']),
          optionsEn: JSON.stringify(['Option A', 'Option B', 'Option C', 'Option D']),
        },
        {
          questionAr: `سؤال مفاهيمي في ${lesson.titleAr}`,
          questionEn: `Conceptual question in ${lesson.titleEn}`,
          answer: 'b',
          optionsAr: JSON.stringify(['إجابة أ', 'إجابة ب', 'إجابة ج', 'إجابة د']),
          optionsEn: JSON.stringify(['Answer A', 'Answer B', 'Answer C', 'Answer D']),
        },
      ];

      for (let i = 0; i < additionalQuestions.length; i++) {
        await db.question.create({
          data: {
            id: `q-${lesson.id}-add-${i}`,
            lessonId: lesson.id,
            type: 'multiple-choice',
            questionAr: additionalQuestions[i].questionAr,
            questionEn: additionalQuestions[i].questionEn,
            answer: additionalQuestions[i].answer,
            optionsAr: additionalQuestions[i].optionsAr,
            optionsEn: additionalQuestions[i].optionsEn,
            points: 1,
            difficulty: 'medium',
            order: existingQuestions + i + 1,
          }
        });
        questionsAdded++;
      }
    }
  }

  console.log(`\n✅ Content seeding completed!`);
  console.log(`  - Formulas added: ${formulasAdded}`);
  console.log(`  - Examples added: ${examplesAdded}`);
  console.log(`  - Questions added: ${questionsAdded}`);

  // 4. Link simulators to lessons
  console.log('\n🔗 Linking simulators to lessons...');
  const simulators = await db.simulator.findMany();
  const physicsLessons = lessons.filter(l => getSubjectType(l.Unit.Subject.nameAr) === 'physics');
  const chemistryLessons = lessons.filter(l => getSubjectType(l.Unit.Subject.nameAr) === 'chemistry');
  const mathLessons = lessons.filter(l => getSubjectType(l.Unit.Subject.nameAr) === 'math');
  const biologyLessons = lessons.filter(l => getSubjectType(l.Unit.Subject.nameAr) === 'biology');

  for (const sim of simulators) {
    let targetLessons: typeof lessons = [];
    if (sim.type === 'physics') targetLessons = physicsLessons;
    else if (sim.type === 'chemistry') targetLessons = chemistryLessons;
    else if (sim.type === 'math') targetLessons = mathLessons;
    else if (sim.type === 'biology') targetLessons = biologyLessons;

    // Link to first 5 lessons of matching type
    for (let i = 0; i < Math.min(5, targetLessons.length); i++) {
      const existing = await db.lessonSimulator.findUnique({
        where: {
          lessonId_simulatorId: {
            lessonId: targetLessons[i].id,
            simulatorId: sim.id,
          }
        }
      });
      if (!existing) {
        await db.lessonSimulator.create({
          data: {
            id: `ls-${sim.id}-${i}`,
            lessonId: targetLessons[i].id,
            simulatorId: sim.id,
          }
        });
      }
    }
  }

  console.log('  ✓ Simulators linked to lessons');

  await db.$disconnect();
  console.log('\n🎉 All content seeded successfully!');
}

seedContent().catch(console.error);
