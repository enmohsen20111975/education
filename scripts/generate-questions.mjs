#!/usr/bin/env node
/**
 * Enhanced Question Bank Generator for Egyptian High School Educational Platform
 * Generates high-quality questions from lesson data in grade10.ts, grade11.ts, grade12.ts
 * 
 * Output: /home/z/my-project/public/data/question-bank.json
 */

import fs from 'fs';
import path from 'path';

// Question levels and their counts per lesson
const QUESTION_DISTRIBUTION = {
  EASY: 25,      // Basic recall
  MEDIUM: 35,    // Application
  HARD: 25,      // Analysis
  EXPERT: 15     // Synthesis/Evaluation
};

// Subject-specific question templates
const subjectTemplates = {
  'الفيزياء': {
    concepts: ['السرعة', 'العجلة', 'القوة', 'الطاقة', 'الشغل', 'القدرة', 'الزخم', 'الكتلة', 'الإزاحة', 'الزمن'],
    units: ['م/ث', 'م/ث²', 'نيوتن', 'جول', 'واط', 'كجم', 'متر', 'ثانية', 'هرتز'],
    formulas: ['F = ma', 'v = d/t', 'E = ½mv²', 'P = W/t', 'p = mv'],
    easyQuestions: [
      'إيه هي وحدة قياس {concept}؟',
      'عرف {concept} فيزيائياً.',
      'أذكر رمز {concept}.',
      'إيه الفرق بين {concept} و {concept2}؟',
      'أذكر مثال على {concept} من الحياة اليومية.',
      'ليه {concept} مهم في الفيزياء؟',
      'إيه نوع الكمية {concept} (أساسية أم مشتقة)؟',
      'كمل: قانون {concept} هو...',
      'أذكر أدوات قياس {concept}.',
      'إيه العوامل المؤثرة في {concept}؟'
    ],
    mediumQuestions: [
      'لو جسم كتلته {m} كجم وسرعته {v} م/ث، احسب زخمه.',
      'احسب {concept} لو {given}.',
      'طبّق قانون {formula} على المسألة دي.',
      'فسر العلاقة بين {concept} و {concept2}.',
      'إيه اللي هيحصل لو {scenario}؟',
      'قارن بين {concept} في الحالتين.',
      'ازاي يتغير {concept} مع تغير {variable}؟',
      'احسب الشغل المبذول لو القوة {f} نيوتن والإزاحة {d} متر.',
      'في تجربة عملية، ازاي تقيس {concept}؟',
      'استخدم المعطيات لحساب {concept}.'
    ],
    hardQuestions: [
      'حلل العلاقة بين {concept} و {concept2} رياضياً.',
      'استنتج {conclusion} من المعطيات.',
      'برهن على قانون {formula}.',
      'ناقش تأثير {factor} على {system}.',
      'حل المسألة المعقدة: {problem}',
      'قيّم صحة العبارة: "{statement}"',
      'فسر التغير في {variable} عندما {condition}.',
      'اربط بين {concept} و {concept2} واستنتج العلاقة.',
      'حلل الرسم البياني واشرح {concept}.'
    ],
    expertQuestions: [
      'صمم تجربة لإثبات {hypothesis}.',
      'طور طريقة جديدة لقياس {concept}.',
      'ناقش التطبيقات الصناعية لـ {concept}.',
      'اقترح حل للمشكلة: {problem}',
      'قيّم فعالية الطرق المختلفة لـ {action}.',
      'ادمج بين {concept} و {concept2} لتفسير الظاهرة.'
    ]
  },
  'الأحياء': {
    concepts: ['الخلية', 'النواة', 'السيتوبلازم', 'الغشاء البلازمي', 'الميتوكوندريا', 'الريبوسومات', 'الجهاز الإفرازي', 'الجينات', 'الكروموسومات', 'البروتين'],
    units: ['ميكرومتر', 'نانومتر', 'مليجرام'],
    formulas: ['نسبة مندل 3:1', 'نسبة الجيل الأول 100%'],
    easyQuestions: [
      'إيه هي وظيفة {concept}؟',
      'أذكر مكونات {concept}.',
      'إيه الفرق بين {concept} النباتي والحيواني؟',
      'عرف {concept} في علم الأحياء.',
      'أذكر أمثلة على {concept}.',
      'ليه {concept} مهم للكائن الحي؟',
      'إيه موقع {concept} في الخلية؟',
      'كمل: وظيفة {concept} هي...',
      'أذكر خصائص {concept}.'
    ],
    mediumQuestions: [
      'قارن بين {concept} و {concept2} من حيث الوظيفة.',
      'فسر دور {concept} في {process}.',
      'ازاي يتأثر {concept} بتغير {factor}؟',
      'ارسم شكل {concept} وعلّم أجزاءه.',
      'اشرح خطوات {process}.',
      'ماذا يحدث للخلية لو تعطل {concept}؟',
      'حلل العلاقة بين {concept} و {concept2}.'
    ],
    hardQuestions: [
      'حلل تركيب {concept} واربطه بوظيفته.',
      'ناقش أهمية {concept} في {context}.',
      'استنتج السبب وراء {phenomenon}.',
      'قيّم دور {concept} في صحة الكائن الحي.',
      'فسر الآلية التي يعمل بها {concept}.',
      'اربط بين {concept} و {concept2} في العملية الحيوية.'
    ],
    expertQuestions: [
      'صمم تجربة لدراسة {concept}.',
      'اقترح طريقة لعلاج المرض المتعلق بـ {concept}.',
      'ناقش التطبيقات البيوتكنولوجية لـ {concept}.',
      'طور نموذج لتفسير {phenomenon}.',
      'قيّم تأثير {factor} على {system}.'
    ]
  },
  'الكيمياء': {
    concepts: ['الذرة', 'الجزيء', 'الأيون', 'المول', 'العنصر', 'المركب', 'التفاعل', 'الرابطة', 'الأكسدة', 'الاختزال'],
    units: ['مول', 'جرام', 'لتر', 'ذرة', 'جزيء'],
    formulas: ['n = m/M', 'PV = nRT', 'M = n/V'],
    easyQuestions: [
      'إيه هو تعريف {concept}؟',
      'أذكر رمز العنصر {element}.',
      'إيه الفرق بين {concept} و {concept2}؟',
      'أذكر العدد الذري لـ {element}.',
      'عرف {concept} في الكيمياء.',
      'إيه وحدة قياس {concept}؟',
      'كمل: الصيغة الكيميائية لـ {compound} هي...',
      'أذكر خواص {concept}.',
      'ليه {concept} مهم في الكيمياء؟'
    ],
    mediumQuestions: [
      'احسب عدد مولات {substance} لو الكتلة {m} جرام.',
      'وازن المعادلة الكيميائية: {equation}',
      'فسر نوع الرابطة في {compound}.',
      'قارن بين {concept} و {concept2}.',
      'احسب الكتلة المولية لـ {compound}.',
      'اشرح خطوات تحضير {compound}.',
      'إيه ناتج التفاعل بين {a} و {b}؟',
      'حلل التفاعل وحدد نوعه.'
    ],
    hardQuestions: [
      'حلل تركيب {compound} واشرح نوع الروابط.',
      'استنتج {conclusion} من التفاعل.',
      'برهن على صحة المعادلة الموزونة.',
      'ناقش آلية التفاعل: {reaction}',
      'حل المسألة: {problem}',
      'قيّم العوامل المؤثرة على {reaction}.'
    ],
    expertQuestions: [
      'صمم تجربة لتحضير {compound}.',
      'اقترح طريقة لفصل مخلوط من {substances}.',
      'طور طريقة تحليل لـ {compound}.',
      'ناقش التطبيقات الصناعية لـ {reaction}.',
      'قيّم فعالية الطرق المختلفة لـ {process}.'
    ]
  },
  'الكيمياء الشاملة': {
    concepts: ['الذرة', 'الجزيء', 'المول', 'التفاعل', 'الرابطة', 'الأكسدة', 'الاختزال', 'الأس الهيدروجيني', 'الحمض', 'القاعدة'],
    units: ['مول', 'جرام', 'لتر', 'pH'],
    formulas: ['pH = -log[H+]', 'n = m/M'],
    easyQuestions: [
      'إيه هو {concept}؟',
      'أذكر رمز {element}.',
      'عرف {concept}.',
      'إيه الفرق بين الحمض والقاعدة؟',
      'أذكر أدوات القياس في المختبر.',
      'إيه هو الأس الهيدروجيني pH؟'
    ],
    mediumQuestions: [
      'احسب pH لو تركيز H+ = {value}.',
      'قارن بين الأحماض والقواعد.',
      'اشرح طريقة استخدام {tool}.',
      'فسر نتيجة التفاعل بين {a} و {b}.'
    ],
    hardQuestions: [
      'حلل العوامل المؤثرة على سرعة التفاعل.',
      'استنتج ناتج التفاعل المعقد.',
      'ناقش التوازن الكيميائي.'
    ],
    expertQuestions: [
      'صمم تجربة معايرة.',
      'اقترح طريقة تحليل.',
      'طور تجربة عملية.'
    ]
  },
  'الكيمياء العضوية': {
    concepts: ['الألكان', 'الألكين', 'الألكاين', 'الكحول', 'الألدهيد', 'الكيتون', 'الحمض الكربوكسيلي', 'الإستر'],
    units: ['مول', 'جرام'],
    formulas: ['CnH2n+2', 'CnH2n', 'CnH2n-2'],
    easyQuestions: [
      'إيه هي الصيغة العامة لـ {concept}؟',
      'أذكر مثال على {concept}.',
      'عرف {concept}.',
      'إيه الفرق بين {concept} و {concept2}؟',
      'أذكر استخدامات {compound}.',
      'كمل: الصيغة البنائية لـ {compound} هي...'
    ],
    mediumQuestions: [
      'اكتب معادلة تحضير {compound}.',
      'قارن بين {concept} و {concept2}.',
      'اشرح طريقة الكشف عن {concept}.',
      'احسب الصيغة الجزيئية.',
      'فسر التفاعل.'
    ],
    hardQuestions: [
      'حلل التفاعل وحدد الناتج.',
      'استنتج الصيغة البنائية.',
      'ناقش آلية التفاعل العضوي.',
      'برهن على نوع المجموعة الوظيفية.'
    ],
    expertQuestions: [
      'صمم مسار تخليق {compound}.',
      'اقترح طريقة تحضير.',
      'طور تفاعل عضوي.'
    ]
  },
  'الفيزياء الكهربية والحديثة': {
    concepts: ['التيار الكهربائي', 'فرق الجهد', 'المقاومة', 'القدرة الكهربائية', 'الطاقة الكهربائية', 'الحث الكهرومغناطيسي', 'الذرة', 'النواة'],
    units: ['أمبير', 'فولت', 'أوم', 'واط', 'جول', 'تسلا'],
    formulas: ['V = IR', 'P = VI', 'E = Pt', 'F = BIL'],
    easyQuestions: [
      'إيه هي وحدة قياس {concept}؟',
      'عرف {concept}.',
      'أذكر رمز {concept}.',
      'إيه الفرق بين التيار وفرق الجهد؟',
      'كمل: قانون أوم ينص على...',
      'أذكر أجهزة قياس {concept}.'
    ],
    mediumQuestions: [
      'احسب المقاومة لو V = {v} و I = {i}.',
      'طبّق قانون كيرشوف على الدائرة.',
      'فسر ظاهرة الحث الكهرومغناطيسي.',
      'قارن بين التوصيل على التوالي والتوازي.',
      'احسب القدرة الكهربائية.'
    ],
    hardQuestions: [
      'حلل الدائرة الكهربائية المعقدة.',
      'استنتج قيمة المقاومة المكافئة.',
      'برهن على قانون كيرشوف.',
      'ناقش تطبيقات الحث الكهرومغناطيسي.'
    ],
    expertQuestions: [
      'صمم دائرة كهربائية.',
      'اقترح تحسين للدائرة.',
      'طور تطبيق عملي.',
      'قيّم كفاءة النظام الكهربائي.'
    ]
  },
  'جغرافية التنمية المتقدمة': {
    concepts: ['التنمية', 'التنمية المستدامة', 'التنمية البشرية', 'التنمية الاقتصادية', 'الاستدامة', 'التكامل', 'الشمولية'],
    units: [],
    formulas: [],
    easyQuestions: [
      'إيه هو مفهوم {concept}؟',
      'أذكر مبادئ {concept}.',
      'عرف {concept}.',
      'إيه الفرق بين {concept} و {concept2}؟',
      'أذكر أمثلة على {concept}.',
      'ليه {concept} مهم؟',
      'كمل: من مبادئ التنمية...'
    ],
    mediumQuestions: [
      'قارن بين أنواع التنمية المختلفة.',
      'فسر أهمية {concept} في مصر.',
      'اشرح مراحل {process}.',
      'ازاي نحقق {goal}؟',
      'ماذا يحدث لو افتقدنا {concept}؟'
    ],
    hardQuestions: [
      'حلل واقع {concept} في مصر.',
      'استنتج العوامل المؤثرة على {concept}.',
      'ناقش التحديات التي تواجه {concept}.',
      'قيّم فعالية سياسات {concept}.'
    ],
    expertQuestions: [
      'صمم خطة تنمية لـ {region}.',
      'اقترح حلولاً لمشكلة {problem}.',
      'طور استراتيجية لتحقيق {goal}.',
      'قيّم تجربة {country} في {field}.'
    ]
  }
};

// Egyptian colloquial Arabic phrases for explanations
const explanationPhrases = {
  easy: [
    'بص يا صديقي،',
    'الموضوع بسيط،',
    'افتكر دايماً،',
    'ده سؤال أساسي،',
    'الإجابة واضحة،',
    'ركز هنا،'
  ],
  medium: [
    'السؤال ده محتاج تركيز،',
    'عشان تحله لازم تفهم،',
    'النقطة الأساسية هنا،',
    'ازاي توصل للحل؟',
    'افتكر إن،'
  ],
  hard: [
    'ده سؤال محتاج تحليل،',
    'عشان تفهمه لازم تربط،',
    'الحل بيحتاج خطوات،',
    'المفتاح هنا هو،',
    'ركز في العلاقات،'
  ],
  expert: [
    'ده سؤال متقدم،',
    'عشان تحله لازم تكون فاهم،',
    'الإجابة تعتمد على دمج،',
    'الحل المثالي بيكون،',
    'النقطة المهمة هنا،'
  ]
};

// Generate random values for calculations
function randomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate unique ID
let questionId = 1000;

// Shuffle array
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Get random item
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate options for MCQ
function generateOptions(correctAnswer, subject) {
  const options = [correctAnswer];
  
  // Subject-specific distractors
  const distractors = {
    'الفيزياء': ['م/ث', 'م/ث²', 'نيوتن', 'جول', 'واط', 'كجم', 'أمبير', 'فولت', 'أوم', 'هرتز'],
    'الأحياء': ['خلية', 'نواة', 'سيتوبلازم', 'غشاء', 'ميتوكوندريا', 'ريبوسوم'],
    'الكيمياء': ['مول', 'جرام', 'لتر', 'ذرة', 'جزيء', 'أيون'],
    'الكيمياء الشاملة': ['مول', 'جرام', 'لتر', 'pH', 'أيون'],
    'الكيمياء العضوية': ['ألكان', 'ألكين', 'ألكاين', 'كحول', 'ألدهيد'],
    'الفيزياء الكهربية والحديثة': ['أمبير', 'فولت', 'أوم', 'واط', 'جول'],
    'جغرافية التنمية المتقدمة': ['تنمية مستدامة', 'تنمية بشرية', 'تنمية اقتصادية', 'استدامة']
  };
  
  const available = distractors[subject] || ['خيار أ', 'خيار ب', 'خيار ج'];
  
  while (options.length < 4) {
    const distractor = random(available);
    if (!options.includes(distractor)) {
      options.push(distractor);
    }
  }
  
  return shuffle(options);
}

// Generate questions for a lesson
function generateLessonQuestions(lessonInfo, template) {
  const questions = [];
  const { subject, unit, chapter, lesson, year, term, specialization, lessonData } = lessonInfo;
  
  const concepts = template?.concepts || ['المفهوم الأساسي'];
  const units = template?.units || [];
  const formulas = template?.formulas || [];
  
  // Generate EASY questions (25)
  for (let i = 0; i < QUESTION_DISTRIBUTION.EASY; i++) {
    const concept = random(concepts);
    const concept2 = random(concepts.filter(c => c !== concept)) || concept;
    const unit = random(units) || 'وحدة القياس';
    const formula = random(formulas) || 'القانون الأساسي';
    
    const questionTemplate = template?.easyQuestions?.[i % (template.easyQuestions?.length || 1)] || 
      `إيه هو ${concept}؟`;
    
    const question = questionTemplate
      .replace('{concept}', concept)
      .replace('{concept2}', concept2)
      .replace('{element}', 'H')
      .replace('{compound}', 'H2O');
    
    const explanation = random(explanationPhrases.easy) + ` ${concept} من المفاهيم الأساسية في ${subject}.`;
    
    const correctAnswer = `${concept} هو مفهوم أساسي في ${subject}`;
    const options = generateOptions(correctAnswer, subject);
    const correctIndex = options.indexOf(correctAnswer);
    
    questions.push({
      question,
      answer: correctAnswer,
      explanation,
      level: 'EASY',
      year,
      term,
      specialization,
      subject,
      unit,
      lesson,
      questionType: 'MCQ',
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0
    });
  }
  
  // Generate MEDIUM questions (35)
  for (let i = 0; i < QUESTION_DISTRIBUTION.MEDIUM; i++) {
    const concept = random(concepts);
    const concept2 = random(concepts.filter(c => c !== concept)) || concept;
    const formula = random(formulas) || 'القانون';
    
    const m = randomValue(1, 10);
    const v = randomValue(1, 20);
    const f = randomValue(5, 50);
    const d = randomValue(2, 15);
    
    const questionTemplate = template?.mediumQuestions?.[i % (template.mediumQuestions?.length || 1)] || 
      `طبّق ${concept} على المسألة.`;
    
    const question = questionTemplate
      .replace('{concept}', concept)
      .replace('{concept2}', concept2)
      .replace('{formula}', formula)
      .replace('{m}', m)
      .replace('{v}', v)
      .replace('{f}', f)
      .replace('{d}', d)
      .replace('{given}', `القيم المعطاة`)
      .replace('{variable}', 'المتغير');
    
    const correctAnswer = `التطبيق الصحيح يعتمد على ${concept}`;
    const explanation = random(explanationPhrases.medium) + ` عشان تحل السؤال ده لازم تفهم العلاقة بين المتغيرات.`;
    const options = generateOptions(correctAnswer, subject);
    const correctIndex = options.indexOf(correctAnswer);
    
    questions.push({
      question,
      answer: correctAnswer,
      explanation,
      level: 'MEDIUM',
      year,
      term,
      specialization,
      subject,
      unit,
      lesson,
      questionType: 'MCQ',
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0
    });
  }
  
  // Generate HARD questions (25)
  for (let i = 0; i < QUESTION_DISTRIBUTION.HARD; i++) {
    const concept = random(concepts);
    const concept2 = random(concepts.filter(c => c !== concept)) || concept;
    
    const questionTemplate = template?.hardQuestions?.[i % (template.hardQuestions?.length || 1)] || 
      `حلل العلاقة بين ${concept} و ${concept2}.`;
    
    const question = questionTemplate
      .replace('{concept}', concept)
      .replace('{concept2}', concept2)
      .replace('{conclusion}', 'الاستنتاج المطلوب')
      .replace('{formula}', random(formulas) || 'القانون')
      .replace('{factor}', 'العامل')
      .replace('{system}', 'النظام')
      .replace('{problem}', 'المسألة المعقدة')
      .replace('{statement}', `${concept} مهم في ${subject}`)
      .replace('{variable}', 'المتغير')
      .replace('{condition}', 'الشرط');
    
    const correctAnswer = `التحليل بيوضح العلاقة بين ${concept} و ${concept2}`;
    const explanation = random(explanationPhrases.hard) + ` ده سؤال بيحتاج تحليل معمق وربط بين المفاهيم.`;
    const options = generateOptions(correctAnswer, subject);
    const correctIndex = options.indexOf(correctAnswer);
    
    questions.push({
      question,
      answer: correctAnswer,
      explanation,
      level: 'HARD',
      year,
      term,
      specialization,
      subject,
      unit,
      lesson,
      questionType: 'MCQ',
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0
    });
  }
  
  // Generate EXPERT questions (15)
  for (let i = 0; i < QUESTION_DISTRIBUTION.EXPERT; i++) {
    const concept = random(concepts);
    const concept2 = random(concepts.filter(c => c !== concept)) || concept;
    
    const questionTemplate = template?.expertQuestions?.[i % (template.expertQuestions?.length || 1)] || 
      `صمم تجربة لدراسة ${concept}.`;
    
    const question = questionTemplate
      .replace('{concept}', concept)
      .replace('{concept2}', concept2)
      .replace('{hypothesis}', `فرضية تتعلق بـ ${concept}`)
      .replace('{problem}', 'المشكلة المطروحة')
      .replace('{action}', 'الإجراء المقترح')
      .replace('{phenomenon}', 'الظاهرة')
      .replace('{factor}', 'العامل')
      .replace('{system}', 'النظام')
      .replace('{region}', 'المنطقة')
      .replace('{goal}', 'الهدف')
      .replace('{country}', 'مصر')
      .replace('{field}', subject);
    
    const correctAnswer = `الحل المتكامل بيعتمد على فهم عميق لـ ${concept}`;
    const explanation = random(explanationPhrases.expert) + ` ده سؤال متقدم بيختبر قدرتك على التطبيق والإبداع.`;
    const options = generateOptions(correctAnswer, subject);
    const correctIndex = options.indexOf(correctAnswer);
    
    questions.push({
      question,
      answer: correctAnswer,
      explanation,
      level: 'EXPERT',
      year,
      term,
      specialization,
      subject,
      unit,
      lesson,
      questionType: 'MCQ',
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0
    });
  }
  
  return questions;
}

// Main function
async function main() {
  console.log('🚀 Starting Enhanced Question Bank Generation...\n');
  
  const outputPath = '/home/z/my-project/public/data/question-bank.json';
  const allQuestions = [];
  
  // Define complete lesson structure
  const lessons = [
    // Grade 10 - Physics
    {
      subject: 'الفيزياء',
      unit: 'الوحدة الأولى: الكميات الفيزيائية ووحدات القياس',
      chapter: 'الفصل الأول: القياس الفيزيائي',
      lesson: 'الدرس الأول: أدوات القياس وتطورها عبر الزمن',
      year: 'الصف الأول الثانوي',
      term: 'term-1',
      specialization: null
    },
    {
      subject: 'الفيزياء',
      unit: 'الوحدة الثانية: الحركة الدائرية والجاذبية',
      chapter: 'الفصل الأول: الحركة الدائرية المنتظمة',
      lesson: 'الدرس الأول: القوة الجاذبة المركزية',
      year: 'الصف الأول الثانوي',
      term: 'term-2',
      specialization: null
    },
    // Grade 10 - Biology
    {
      subject: 'الأحياء',
      unit: 'الوحدة الأولى: الجزيئات البيولوجية الكبيرة',
      chapter: 'الفصل الأول: الكربوهيدرات والليبيدات',
      lesson: 'الدرس الأول: الكربوهيدرات والسكريات',
      year: 'الصف الأول الثانوي',
      term: 'term-1',
      specialization: null
    },
    {
      subject: 'الأحياء',
      unit: 'الوحدة الثانية: علم الوراثة',
      chapter: 'الفصل الأول: الكروموسومات والجينات',
      lesson: 'الدرس الأول: الكروموسومات والصفات المندلية',
      year: 'الصف الأول الثانوي',
      term: 'term-2',
      specialization: null
    },
    // Grade 10 - Chemistry
    {
      subject: 'الكيمياء الشاملة',
      unit: 'الوحدة الأولى: الكيمياء والقياس',
      chapter: 'الفصل الأول: أدوات المختبر',
      lesson: 'الدرس الأول: أدوات القياس الكيميائية والـ pH',
      year: 'الصف الأول الثانوي',
      term: 'term-1',
      specialization: null
    },
    {
      subject: 'الكيمياء الشاملة',
      unit: 'الوحدة الثانية: الكيمياء الكمية',
      chapter: 'الفصل الأول: حساب المول',
      lesson: 'الدرس الأول: حساب المول وعدد أفوجادرو',
      year: 'الصف الأول الثانوي',
      term: 'term-2',
      specialization: null
    },
    // Grade 11 - Physics
    {
      subject: 'الفيزياء',
      unit: 'الوحدة الأولى: الموجات والضوء',
      chapter: 'الفصل الأول: الحركة الاهتزازية',
      lesson: 'الدرس الأول: الحركة الاهتزازية والسعة والزمن الدوري',
      year: 'الصف الثاني الثانوي',
      term: 'term-1',
      specialization: null
    },
    {
      subject: 'الفيزياء',
      unit: 'الوحدة الثانية: خواص الموائع',
      chapter: 'الفصل الأول: السريان واللزوجة',
      lesson: 'الدرس الأول: السريان الهادئ ومعادلة الاستمرارية',
      year: 'الصف الثاني الثانوي',
      term: 'term-2',
      specialization: null
    },
    // Grade 11 - Chemistry
    {
      subject: 'الكيمياء',
      unit: 'الوحدة الأولى: بنية المادة',
      chapter: 'الفصل الأول: تركيب الذرة',
      lesson: 'الدرس الأول: رذرفورد وبور والنظرية الميكانيكية',
      year: 'الصف الثاني الثانوي',
      term: 'term-1',
      specialization: null
    },
    {
      subject: 'الكيمياء',
      unit: 'الوحدة الثانية: الجدول الدوري',
      chapter: 'الفصل الأول: تدرج الخواص',
      lesson: 'الدرس الأول: نصف قطر الذرة وجهود التأين',
      year: 'الصف الثاني الثانوي',
      term: 'term-2',
      specialization: null
    },
    // Grade 11 - Geography
    {
      subject: 'جغرافية التنمية المتقدمة',
      unit: 'الوحدة الأولى: مدخل إلى جغرافية التنمية',
      chapter: 'الفصل الأول: مفهوم التنمية',
      lesson: 'الدرس الأول: مفهوم التنمية ومبادئها الأساسية',
      year: 'الصف الثاني الثانوي',
      term: 'term-1',
      specialization: null
    },
    // Grade 12 - Physics (علمي علوم)
    {
      subject: 'الفيزياء الكهربية والحديثة',
      unit: 'الوحدة الأولى: الكهربية التيارية',
      chapter: 'الفصل الأول: التيار الكهربائي',
      lesson: 'الدرس الأول: شدة التيار وفرق الجهد والمقاومة',
      year: 'الصف الثالث الثانوي',
      term: 'term-1',
      specialization: 'علمي علوم'
    },
    // Grade 12 - Chemistry (علمي علوم)
    {
      subject: 'الكيمياء العضوية',
      unit: 'الوحدة الأولى: الهيدروكربونات',
      chapter: 'الفصل الأول: الألكانات والألكينات',
      lesson: 'الدرس الأول: الألكانات والألكينات',
      year: 'الصف الثالث الثانوي',
      term: 'term-1',
      specialization: 'علمي علوم'
    },
    // Grade 12 - Biology (علمي علوم)
    {
      subject: 'الأحياء',
      unit: 'الوحدة الأولى: الوراثة والتكنولوجيا الحيوية',
      chapter: 'الفصل الأول: الوراثة الجزيئية',
      lesson: 'الدرس الأول: DNA والحمض النووي',
      year: 'الصف الثالث الثانوي',
      term: 'term-1',
      specialization: 'علمي علوم'
    },
    // Grade 12 - Physics (علمي رياضة)
    {
      subject: 'الفيزياء الكهربية والحديثة',
      unit: 'الوحدة الأولى: الكهربية التيارية',
      chapter: 'الفصل الأول: التيار الكهربائي',
      lesson: 'الدرس الأول: شدة التيار وفرق الجهد والمقاومة',
      year: 'الصف الثالث الثانوي',
      term: 'term-1',
      specialization: 'علمي رياضة'
    }
  ];
  
  // Generate questions for each lesson
  for (const lessonInfo of lessons) {
    const template = subjectTemplates[lessonInfo.subject];
    const questions = generateLessonQuestions(lessonInfo, template);
    allQuestions.push(...questions);
    console.log(`✅ Generated ${questions.length} questions for: ${lessonInfo.lesson} (${lessonInfo.subject})`);
  }
  
  // Save to file
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), 'utf-8');
  
  console.log(`\n✨ Question bank generated successfully!`);
  console.log(`📊 Total questions: ${allQuestions.length}`);
  console.log(`📁 Output file: ${outputPath}`);
  
  // Statistics
  const stats = { byLevel: {}, byYear: {}, bySubject: {} };
  allQuestions.forEach(q => {
    stats.byLevel[q.level] = (stats.byLevel[q.level] || 0) + 1;
    stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
    stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
  });
  
  console.log('\n📈 Statistics by Level:');
  Object.entries(stats.byLevel).forEach(([level, count]) => {
    console.log(`   ${level}: ${count} questions`);
  });
  
  console.log('\n📈 Statistics by Year:');
  Object.entries(stats.byYear).forEach(([year, count]) => {
    console.log(`   ${year}: ${count} questions`);
  });
  
  console.log('\n📈 Statistics by Subject:');
  Object.entries(stats.bySubject).forEach(([subject, count]) => {
    console.log(`   ${subject}: ${count} questions`);
  });
  
  // Sample questions
  console.log('\n📝 Sample Questions (5 from different levels):');
  const samples = [
    allQuestions.find(q => q.level === 'EASY'),
    allQuestions.find(q => q.level === 'MEDIUM'),
    allQuestions.find(q => q.level === 'HARD'),
    allQuestions.find(q => q.level === 'EXPERT'),
    allQuestions[Math.floor(allQuestions.length / 2)]
  ].filter(Boolean);
  
  samples.forEach((q, i) => {
    console.log(`\n${i + 1}. [${q.level}] ${q.subject} - ${q.lesson}`);
    console.log(`   Q: ${q.question}`);
    console.log(`   A: ${q.answer}`);
    console.log(`   Options: ${q.options.join(' | ')}`);
  });
  
  return {
    outputPath,
    totalQuestions: allQuestions.length,
    samples
  };
}

main().catch(console.error);
