// Bilingual Question Bank Generator
// Generates questions in both Arabic and English

import fs from 'fs';

// Translation helper
const translations = {
  // Difficulty levels
  levels: {
    EASY: { ar: 'سهل', en: 'Easy' },
    MEDIUM: { ar: 'متوسط', en: 'Medium' },
    HARD: { ar: 'صعب', en: 'Hard' },
    EXPERT: { ar: 'خبير', en: 'Expert' }
  },
  // Years
  years: {
    'الصف الأول الثانوي': 'First Year Secondary',
    'الصف الثاني الثانوي': 'Second Year Secondary',
    'الصف الثالث الثانوي': 'Third Year Secondary'
  },
  // Subjects
  subjects: {
    'الفيزياء': 'Physics',
    'الأحياء': 'Biology',
    'الكيمياء': 'Chemistry',
    'الكيمياء الشاملة': 'Comprehensive Chemistry',
    'الفيزياء الكهربية والحديثة': 'Electrical and Modern Physics',
    'جغرافية التنمية المتقدمة': 'Advanced Development Geography',
    'الكيمياء العضوية': 'Organic Chemistry'
  },
  // Common question templates
  templates: {
    define: {
      ar: 'عرف {concept} فيزيائياً.',
      en: 'Define {concept} in physics terms.'
    },
    unit: {
      ar: 'ما هي وحدة قياس {concept}؟',
      en: 'What is the unit of measurement for {concept}?'
    },
    law: {
      ar: 'اكتب قانون {concept}.',
      en: 'Write the law of {concept}.'
    },
    example: {
      ar: 'أعطِ مثال على {concept} من الحياة اليومية.',
      en: 'Give an example of {concept} from daily life.'
    },
    calculate: {
      ar: 'احسب {concept} إذا كانت القيم المعطاة {values}.',
      en: 'Calculate {concept} given the values {values}.'
    },
    compare: {
      ar: 'قارن بين {concept1} و {concept2}.',
      en: 'Compare between {concept1} and {concept2}.'
    },
    explain: {
      ar: 'اشرح بالتفصيل {concept}.',
      en: 'Explain {concept} in detail.'
    },
    analyze: {
      ar: 'حلل العلاقة بين {concept1} و {concept2}.',
      en: 'Analyze the relationship between {concept1} and {concept2}.'
    },
    design: {
      ar: 'صمم تجربة لإثبات فرضية تتعلق بـ {concept}.',
      en: 'Design an experiment to prove a hypothesis related to {concept}.'
    }
  }
};

// Physics concepts with translations
const physicsConcepts = [
  { ar: 'التيار الكهربائي', en: 'Electric Current', unit: { ar: 'أمبير', en: 'Ampere' } },
  { ar: 'فرق الجهد', en: 'Voltage', unit: { ar: 'فولت', en: 'Volt' } },
  { ar: 'المقاومة', en: 'Resistance', unit: { ar: 'أوم', en: 'Ohm' } },
  { ar: 'القوة', en: 'Force', unit: { ar: 'نيوتن', en: 'Newton' } },
  { ar: 'الطاقة', en: 'Energy', unit: { ar: 'جول', en: 'Joule' } },
  { ar: 'القدرة', en: 'Power', unit: { ar: 'واط', en: 'Watt' } },
  { ar: 'الزخم', en: 'Momentum', unit: { ar: 'كجم.م/ث', en: 'kg.m/s' } },
  { ar: 'العجلة', en: 'Acceleration', unit: { ar: 'م/ث²', en: 'm/s²' } },
  { ar: 'السرعة', en: 'Velocity', unit: { ar: 'م/ث', en: 'm/s' } },
  { ar: 'الكتلة', en: 'Mass', unit: { ar: 'كيلوجرام', en: 'Kilogram' } }
];

// Biology concepts
const biologyConcepts = [
  { ar: 'الخلية', en: 'Cell' },
  { ar: 'الميتوكوندريا', en: 'Mitochondria' },
  { ar: 'النواة', en: 'Nucleus' },
  { ar: 'الجين', en: 'Gene' },
  { ar: 'DNA', en: 'DNA' },
  { ar: 'البروتين', en: 'Protein' },
  { ar: 'الكربوهيدرات', en: 'Carbohydrates' },
  { ar: 'الإنزيم', en: 'Enzyme' }
];

// Chemistry concepts
const chemistryConcepts = [
  { ar: 'الذرة', en: 'Atom' },
  { ar: 'الجزيء', en: 'Molecule' },
  { ar: 'الإلكترون', en: 'Electron' },
  { ar: 'البروتون', en: 'Proton' },
  { ar: 'النيوترون', en: 'Neutron' },
  { ar: 'الأيون', en: 'Ion' },
  { ar: 'الرابطة الكيميائية', en: 'Chemical Bond' },
  { ar: 'المول', en: 'Mole' }
];

// Generate bilingual question
function generateQuestion(concept, template, level, year, term, specialization, subject) {
  const templateObj = translations.templates[template];

  // Generate Arabic question
  let questionAr = templateObj.ar.replace('{concept}', concept.ar);
  let questionEn = templateObj.en.replace('{concept}', concept.en);

  // Generate answer
  let answerAr = concept.ar + ' هو مفهوم أساسي في ' + subject;
  let answerEn = concept.en + ' is a fundamental concept in ' + (translations.subjects[subject] || subject);

  // Generate explanation
  let explanationAr = `ركز هنا، ${concept.ar} من المفاهيم الأساسية في ${subject}.`;
  let explanationEn = `Focus here, ${concept.en} is one of the fundamental concepts in ${translations.subjects[subject] || subject}.`;

  // Generate options
  const optionsAr = generateOptions(concept.ar, subject);
  const optionsEn = generateOptions(concept.en, translations.subjects[subject] || subject);

  return {
    questionAr,
    questionEn,
    answerAr,
    answerEn,
    explanationAr,
    explanationEn,
    level,
    year,
    term,
    specialization,
    subject,
    questionType: 'MCQ',
    optionsAr: JSON.stringify(optionsAr),
    optionsEn: JSON.stringify(optionsEn),
    correctIndex: 0
  };
}

// Generate MCQ options
function generateOptions(correctAnswer, subject) {
  const distractors = [
    'نيوتن', 'أمبير', 'فولت', 'أوم', 'واط', 'جول', 'هرتز', 'م/ث',
    'Newton', 'Ampere', 'Volt', 'Ohm', 'Watt', 'Joule', 'Hertz', 'm/s'
  ];

  const options = [correctAnswer];
  while (options.length < 4) {
    const random = distractors[Math.floor(Math.random() * distractors.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

// Main generator
function generateBilingualQuestionBank() {
  const questions = [];

  // Physics questions
  physicsConcepts.forEach(concept => {
    // EASY questions
    questions.push(generateQuestion(concept, 'define', 'EASY', 'الصف الأول الثانوي', 'term-1', null, 'الفيزياء'));
    questions.push(generateQuestion(concept, 'unit', 'EASY', 'الصف الأول الثانوي', 'term-1', null, 'الفيزياء'));

    // MEDIUM questions
    questions.push(generateQuestion(concept, 'example', 'MEDIUM', 'الصف الأول الثانوي', 'term-1', null, 'الفيزياء'));
    questions.push(generateQuestion(concept, 'calculate', 'MEDIUM', 'الصف الأول الثانوي', 'term-1', null, 'الفيزياء'));

    // HARD questions
    questions.push(generateQuestion(concept, 'compare', 'HARD', 'الصف الأول الثانوي', 'term-1', null, 'الفيزياء'));
    questions.push(generateQuestion(concept, 'analyze', 'HARD', 'الصف الأول الثانوي', 'term-1', null, 'الفيزياء'));

    // EXPERT questions
    questions.push(generateQuestion(concept, 'design', 'EXPERT', 'الصف الأول الثانوي', 'term-1', null, 'الفيزياء'));
  });

  // Biology questions
  biologyConcepts.forEach(concept => {
    questions.push(generateQuestion(concept, 'define', 'EASY', 'الصف الأول الثانوي', 'term-1', null, 'الأحياء'));
    questions.push(generateQuestion(concept, 'example', 'MEDIUM', 'الصف الأول الثانوي', 'term-1', null, 'الأحياء'));
    questions.push(generateQuestion(concept, 'explain', 'HARD', 'الصف الأول الثانوي', 'term-1', null, 'الأحياء'));
  });

  // Chemistry questions
  chemistryConcepts.forEach(concept => {
    questions.push(generateQuestion(concept, 'define', 'EASY', 'الصف الأول الثانوي', 'term-1', null, 'الكيمياء'));
    questions.push(generateQuestion(concept, 'example', 'MEDIUM', 'الصف الأول الثانوي', 'term-1', null, 'الكيمياء'));
    questions.push(generateQuestion(concept, 'compare', 'HARD', 'الصف الأول الثانوي', 'term-1', null, 'الكيمياء'));
  });

  return questions;
}

// Run generator
console.log('🚀 توليد بنك الأسئلة ثنائي اللغة...\n');

const questions = generateBilingualQuestionBank();

console.log(`📊 إحصائيات:`);
console.log(`   إجمالي الأسئلة: ${questions.length}`);
console.log(`   سهل: ${questions.filter(q => q.level === 'EASY').length}`);
console.log(`   متوسط: ${questions.filter(q => q.level === 'MEDIUM').length}`);
console.log(`   صعب: ${questions.filter(q => q.level === 'HARD').length}`);
console.log(`   خبير: ${questions.filter(q => q.level === 'EXPERT').length}`);

// Save to file
fs.writeFileSync(
  '/home/z/my-project/public/data/question-bank-bilingual.json',
  JSON.stringify(questions, null, 2),
  'utf-8'
);

console.log('\n✅ تم حفظ بنك الأسئلة في: public/data/question-bank-bilingual.json');

// Show sample
console.log('\n📝 نموذج سؤال:');
console.log(JSON.stringify(questions[0], null, 2));
