/**
 * @module prompts
 * @description قوالب الأوامر (Prompt Templates) الخاصة بنظام توليد المحتوى التعليمي.
 * كل قالب يدعم العربية والإنجليزية ويُرجع نصًا بصيغة JSON.
 *
 * AI Prompt Templates for the educational content generation system.
 * Each template supports Arabic and English and returns JSON-formatted text.
 */

// ============================================================
// الأنواع المشتركة / Shared Types
// ============================================================

/** معلمات القالب الأساسية */
export interface PromptParams {
  /** عنوان الدرس / Lesson title */
  topic: string;
  /** اسم المادة الدراسية / Subject name */
  subject: string;
  /** المرحلة الدراسية / Grade level */
  grade: string;
  /** اللغة المطلوبة / Requested language */
  language: 'ar' | 'en';
}

/** معلمات قالب المفاهيم */
export interface ConceptsPromptParams extends PromptParams {
  /** مفاهيم موجودة مسبقًا لتجنب التكرار / Existing concepts to avoid duplication */
  existingConcepts?: string[];
  /** عدد المفاهيم المطلوب / Requested number of concepts */
  count?: number;
}

/** معلمات قالب القوانين/الصيغ */
export interface FormulasPromptParams extends PromptParams {
  /** عدد الصيغ المطلوب / Requested number of formulas */
  count?: number;
}

/** معلمات قالب الأمثلة */
export interface ExamplesPromptParams extends PromptParams {
  /** عدد الأمثلة المطلوب / Requested number of examples */
  count?: number;
}

/** معلمات قالب الأسئلة */
export interface QuestionsPromptParams extends PromptParams {
  /** أنواع الأسئلة المطلوبة / Requested question types */
  types?: string[];
  /** عدد الأسئلة المطلوب / Requested number of questions */
  count?: number;
  /** مستوى الصعوبة / Difficulty level */
  difficulty?: 'easy' | 'medium' | 'hard';
}

/** معلمات قالب الأهداف */
export interface ObjectivesPromptParams extends PromptParams {
  /** عدد الأهداف المطلوب / Requested number of objectives */
  count?: number;
}

// ============================================================
// مساعدات / Helpers
// ============================================================

/** يُرجع "ar" أو "en" بناءً على اللغة المطلوبة / Returns 'ar' or 'en' based on requested language */
function langLabel(lang: 'ar' | 'en'): string {
  return lang === 'ar' ? 'Arabic' : 'English';
}

// ============================================================
// قالب: المفاهيم والتعريفات / Template: Concepts & Definitions
// ============================================================

/**
 * إنشاء أمر توليد المفاهيم والتعريفات
 * Creates the concepts/definitions generation prompt
 */
export function conceptsPrompt(params: ConceptsPromptParams): string {
  const { topic, subject, grade, language, existingConcepts, count = 6 } = params;
  const n = language === 'ar' ? count : count;

  const existingBlock = existingConcepts?.length
    ? `\n\nالأهداف الموجودة مسبقًا (تجنب التكرار):\n${existingConcepts.map(c => `- ${c}`).join('\n')}`
    : '';

  if (language === 'ar') {
    return `أنت خبير تعليمي في مادة "${subject}" للصف "${grade}".
مهمتك: إنشاء ${n} مفاهيم/تعريفات أساسية متعلقة بدرس: "${topic}".

قواعد مهمة:
- كل مفهوم يجب أن يكون واضحًا ومناسبًا لمستوى الصف ${grade}
- التعريفات يجب أن تكون دقيقة ومختصرة
- رتّب المفاهيم من الأسهل للأصعب
- أجب فقط بـ JSON صالح بدون أي نص إضافي

صيغة JSON المطلوبة:
[
  {
    "termAr": "المصطلح بالعربية",
    "termEn": "المصطلح بالإنجليزية",
    "definitionAr": "التعريف باللغة العربية",
    "definitionEn": "Definition in English"
  }
]${existingBlock}

أنشئ الآن ${n} مفاهيم لدرس "${topic}" بصيغة JSON فقط:`;
  }

  return `You are an educational expert in "${subject}" for grade "${grade}".
Task: Generate ${n} key concepts/definitions related to the lesson: "${topic}".

Important rules:
- Each concept must be clear and appropriate for ${grade} level
- Definitions should be accurate and concise
- Order concepts from easiest to hardest
- Respond ONLY with valid JSON, no additional text

Required JSON format:
[
  {
    "termAr": "المصطلح بالعربية",
    "termEn": "The term in English",
    "definitionAr": "التعريف باللغة العربية",
    "definitionEn": "Definition in English"
  }
]${existingBlock}

Generate ${n} concepts for the lesson "${topic}" in JSON format only:`;
}

// ============================================================
// قالب: القوانين والصيغ / Template: Formulas
// ============================================================

/**
 * إنشاء أمر توليد القوانين والصيغ الرياضية
 * Creates the formulas generation prompt
 */
export function formulasPrompt(params: FormulasPromptParams): string {
  const { topic, subject, grade, language, count = 5 } = params;

  if (language === 'ar') {
    return `أنت خبير في مادة "${subject}" للصف "${grade}".
مهمتك: إنشاء ${count} قوانين/صيغ رياضية أو علمية متعلقة بدرس: "${topic}".

قواعد مهمة:
- استخدم صيغة LaTeX للمعادلات (مثال: $E = mc^2$)
- الشرح باللغة العربية يجب أن يكون واضحًا ومباشرًا
- اشرح كل متغير في المعادلة
- رتّب من الأسهل للأصعب
- أجب فقط بـ JSON صالح بدون أي نص إضافي

صيغة JSON المطلوبة:
[
  {
    "formula": "E = mc^2",
    "explanationAr": "شرح القانون باللغة العربية مع توضيح كل رمز",
    "explanationEn": "Explanation of the formula in English with each symbol clarified"
  }
]

أنشئ الآن ${count} قوانين/صيغ لدرس "${topic}" بصيغة JSON فقط:`;
  }

  return `You are an expert in "${subject}" for grade "${grade}".
Task: Generate ${count} mathematical or scientific formulas related to the lesson: "${topic}".

Important rules:
- Use LaTeX notation for equations (e.g., $E = mc^2$)
- The explanation in English must be clear and direct
- Explain each variable in the formula
- Order from easiest to hardest
- Respond ONLY with valid JSON, no additional text

Required JSON format:
[
  {
    "formula": "E = mc^2",
    "explanationAr": "شرح القانون باللغة العربية مع توضيح كل رمز",
    "explanationEn": "Explanation of the formula in English with each symbol clarified"
  }
]

Generate ${count} formulas for the lesson "${topic}" in JSON format only:`;
}

// ============================================================
// قالب: الأمثلة التوضيحية / Template: Worked Examples
// ============================================================

/**
 * إنشاء أمر توليد الأمثلة التوضيحية
 * Creates the worked examples generation prompt
 */
export function examplesPrompt(params: ExamplesPromptParams): string {
  const { topic, subject, grade, language, count = 3 } = params;

  if (language === 'ar') {
    return `أنت معلم خبير في مادة "${subject}" للصف "${grade}".
مهمتك: إنشاء ${count} أمثلة توضيحية محلولة خطوة بخطوة لدرس: "${topic}".

قواعد مهمة:
- كل مثال يجب أن يحتوي على سؤال واضح وحل كامل
- الحل يجب أن يكون مقسمًا إلى خطوات مرقمة
- استخدم لغة مناسبة لمستوى الصف ${grade}
- اجعل الأمثلة متنوعة في الصعوبة
- أجب فقط بـ JSON صالح بدون أي نص إضافي

صيغة JSON المطلوبة:
[
  {
    "questionAr": "نص السؤال بالعربية",
    "questionEn": "Question text in English",
    "solutionAr": "الحل النهائي بالعربية",
    "solutionEn": "Final solution in English",
    "stepsAr": "الخطوة 1: ...\nالخطوة 2: ...\nالخطوة 3: ...",
    "stepsEn": "Step 1: ...\nStep 2: ...\nStep 3: ..."
  }
]

أنشئ الآن ${count} أمثلة محلولة لدرس "${topic}" بصيغة JSON فقط:`;
  }

  return `You are an expert teacher in "${subject}" for grade "${grade}".
Task: Generate ${count} worked examples with step-by-step solutions for the lesson: "${topic}".

Important rules:
- Each example must have a clear question and complete solution
- Solutions should be divided into numbered steps
- Use language appropriate for ${grade} level
- Make examples varied in difficulty
- Respond ONLY with valid JSON, no additional text

Required JSON format:
[
  {
    "questionAr": "نص السؤال بالعربية",
    "questionEn": "Question text in English",
    "solutionAr": "الحل النهائي بالعربية",
    "solutionEn": "Final solution in English",
    "stepsAr": "الخطوة 1: ...\nالخطوة 2: ...\nالخطوة 3: ...",
    "stepsEn": "Step 1: ...\nStep 2: ...\nStep 3: ..."
  }
]

Generate ${count} worked examples for the lesson "${topic}" in JSON format only:`;
}

// ============================================================
// قالب: الأسئلة / Template: Questions
// ============================================================

/** وصف أنواع الأسئلة بالعربية */
const QUESTION_TYPE_LABELS_AR: Record<string, string> = {
  mcq: 'اختيار من متعدد (MCQ)',
  truefalse: 'صح أم خطأ (True/False)',
  shortanswer: 'سؤال قصير الإجابة (Short Answer)',
  essay: 'مقال (Essay)',
  calculation: 'حسابي (Calculation)',
};

/** وصف أنواع الأسئلة بالإنجليزية */
const QUESTION_TYPE_LABELS_EN: Record<string, string> = {
  mcq: 'Multiple Choice (MCQ)',
  truefalse: 'True/False',
  shortanswer: 'Short Answer',
  essay: 'Essay',
  calculation: 'Calculation',
};

/**
 * إنشاء أمر توليد الأسئلة
 * Creates the questions generation prompt
 */
export function questionsPrompt(params: QuestionsPromptParams): string {
  const {
    topic,
    subject,
    grade,
    language,
    types = ['mcq', 'truefalse', 'shortanswer'],
    count = 10,
    difficulty = 'medium',
  } = params;

  const difficultyAr: Record<string, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };
  const difficultyEn: Record<string, string> = { easy: 'easy', medium: 'medium', hard: 'hard' };

  const typeList = language === 'ar'
    ? types.map(t => QUESTION_TYPE_LABELS_AR[t] ?? t).join('، ')
    : types.map(t => QUESTION_TYPE_LABELS_EN[t] ?? t).join(', ');

  if (language === 'ar') {
    return `أنت معلم خبير في مادة "${subject}" للصف "${grade}".
مهمتك: إنشاء ${count} أسئلة لدرس: "${topic}".

المواصفات:
- أنواع الأسئلة: ${typeList}
- مستوى الصعوبة: ${difficultyAr[difficulty]}
- كل سؤال يجب أن يكون واضحًا ودقيقًا
- لأسئلة الاختيار من متعدد: قدّم 4 خيارات (أ، ب، ج، د)
- أجب فقط بـ JSON صالح بدون أي نص إضافي

صيغة JSON المطلوبة:
[
  {
    "type": "mcq",
    "questionAr": "نص السؤال بالعربية",
    "questionEn": "Question text in English",
    "optionsAr": "أ) الخيار الأول\nب) الخيار الثاني\nج) الخيار الثالث\nد) الخيار الرابع",
    "optionsEn": "A) First option\nB) Second option\nC) Third option\nD) Fourth option",
    "answer": "أ",
    "explanationAr": "شرح الإجابة بالعربية",
    "explanationEn": "Answer explanation in English",
    "points": 1,
    "difficulty": "medium"
  },
  {
    "type": "truefalse",
    "questionAr": "نص العبارة بالعربية",
    "questionEn": "Statement text in English",
    "answer": "true",
    "explanationAr": "شرح الإجابة بالعربية",
    "explanationEn": "Answer explanation in English",
    "points": 1,
    "difficulty": "easy"
  },
  {
    "type": "shortanswer",
    "questionAr": "نص السؤال بالعربية",
    "questionEn": "Question text in English",
    "answer": "الإجابة النموذجية",
    "explanationAr": "شرح الإجابة بالعربية",
    "explanationEn": "Answer explanation in English",
    "points": 2,
    "difficulty": "medium"
  }
]

ملاحظات:
- الحقل "optionsAr" و "optionsEn" يُستخدم فقط مع mcq، ضعهما null لأنواع الأسئلة الأخرى
- الحقل "points" بين 1 و5 حسب الصعوبة
- "difficulty" يجب أن يكون: easy, medium, أو hard

أنشئ الآن ${count} أسئلة لدرس "${topic}" بصيغة JSON فقط:`;
  }

  return `You are an expert teacher in "${subject}" for grade "${grade}".
Task: Generate ${count} questions for the lesson: "${topic}".

Specifications:
- Question types: ${typeList}
- Difficulty level: ${difficultyEn[difficulty]}
- Each question must be clear and accurate
- For MCQ: provide 4 options (A, B, C, D)
- Respond ONLY with valid JSON, no additional text

Required JSON format:
[
  {
    "type": "mcq",
    "questionAr": "نص السؤال بالعربية",
    "questionEn": "Question text in English",
    "optionsAr": "أ) الخيار الأول\nب) الخيار الثاني\nج) الخيار الثالث\nد) الخيار الرابع",
    "optionsEn": "A) First option\nB) Second option\nC) Third option\nD) Fourth option",
    "answer": "A",
    "explanationAr": "شرح الإجابة بالعربية",
    "explanationEn": "Answer explanation in English",
    "points": 1,
    "difficulty": "medium"
  },
  {
    "type": "truefalse",
    "questionAr": "نص العبارة بالعربية",
    "questionEn": "Statement text in English",
    "answer": "true",
    "explanationAr": "شرح الإجابة بالعربية",
    "explanationEn": "Answer explanation in English",
    "points": 1,
    "difficulty": "easy"
  },
  {
    "type": "shortanswer",
    "questionAr": "نص السؤال بالعربية",
    "questionEn": "Question text in English",
    "answer": "Model answer",
    "explanationAr": "شرح الإجابة بالعربية",
    "explanationEn": "Answer explanation in English",
    "points": 2,
    "difficulty": "medium"
  }
]

Notes:
- "optionsAr" and "optionsEn" fields are only used with mcq, set them to null for other question types
- "points" should be between 1 and 5 depending on difficulty
- "difficulty" must be: easy, medium, or hard

Generate ${count} questions for the lesson "${topic}" in JSON format only:`;
}

// ============================================================
// قالب: الأهداف التعليمية / Template: Learning Objectives
// ============================================================

/**
 * إنشاء أمر توليد الأهداف التعليمية
 * Creates the learning objectives generation prompt
 */
export function objectivesPrompt(params: ObjectivesPromptParams): string {
  const { topic, subject, grade, language, count = 5 } = params;

  if (language === 'ar') {
    return `أنت خبير في التخطيط التعليمي لمادة "${subject}" للصف "${grade}".
مهمتك: إنشاء ${count} أهداف تعليمية لدرس: "${topic}".

قواعد مهمة:
- استخدم أفعال سلوكية قابلة للقياس (مثل: يعرّف، يحسب، يقارن، يحلّل، يُطبّق)
- الأهداف يجب أن تغطي مستويات المعرفة المختلفة (تذكر، فهم، تطبيق، تحليل)
- رتّب الأهداف من الأسهل للأصعب
- أجب فقط بـ JSON صالح بدون أي نص إضافي

صيغة JSON المطلوبة:
[
  {
    "textAr": "أن يعرّف الطالب ... باللغة العربية",
    "textEn": "The student will be able to define ... in English"
  }
]

أنشئ الآن ${count} أهداف تعليمية لدرس "${topic}" بصيغة JSON فقط:`;
  }

  return `You are an educational planning expert in "${subject}" for grade "${grade}".
Task: Generate ${count} learning objectives for the lesson: "${topic}".

Important rules:
- Use measurable action verbs (e.g., define, calculate, compare, analyze, apply)
- Objectives should cover different knowledge levels (remember, understand, apply, analyze)
- Order objectives from easiest to hardest
- Respond ONLY with valid JSON, no additional text

Required JSON format:
[
  {
    "textAr": "أن يعرّف الطالب ... باللغة العربية",
    "textEn": "The student will be able to define ... in English"
  }
]

Generate ${count} learning objectives for the lesson "${topic}" in JSON format only:`;
}

// ============================================================
// قالب: مقدمة الدرس / Template: Lesson Introduction
// ============================================================

/**
 * إنشاء أمر توليد مقدمة الدرس
 * Creates the lesson introduction generation prompt
 */
export function introductionPrompt(params: PromptParams): string {
  const { topic, subject, grade, language } = params;

  if (language === 'ar') {
    return `أنت معلم خبير في مادة "${subject}" للصف "${grade}".
مهمتك: كتابة مقدمة تعليمية جذابة لدرس: "${topic}".

قواعد مهمة:
- ابدأ بمقدمة تشويقية ترتبط بحياة الطالب اليومية
- اذكر أهمية الموضوع وكيف يرتبط بما سبق دراسته
- اكتب 3-5 فقرات قصيرة
- استخدم لغة مناسبة لمستوى الصف ${grade}
- أجب فقط بـ JSON صالح بدون أي نص إضافي

صيغة JSON المطلوبة:
{
  "textAr": "المقدمة باللغة العربية...",
  "textEn": "The introduction in English..."
}

اكتب الآن مقدمة لدرس "${topic}" بصيغة JSON فقط:`;
  }

  return `You are an expert teacher in "${subject}" for grade "${grade}".
Task: Write an engaging educational introduction for the lesson: "${topic}".

Important rules:
- Start with a hook that connects to the student's daily life
- Mention the importance of the topic and how it relates to previously studied material
- Write 3-5 short paragraphs
- Use language appropriate for ${grade} level
- Respond ONLY with valid JSON, no additional text

Required JSON format:
{
  "textAr": "المقدمة باللغة العربية...",
  "textEn": "The introduction in English..."
}

Write an introduction for the lesson "${topic}" in JSON format only:`;
}

// ============================================================
// قالب: ملخص الدرس / Template: Lesson Summary
// ============================================================

/**
 * إنشاء أمر توليد ملخص الدرس
 * Creates the lesson summary generation prompt
 */
export function summaryPrompt(params: PromptParams): string {
  const { topic, subject, grade, language } = params;

  if (language === 'ar') {
    return `أنت معلم خبير في مادة "${subject}" للصف "${grade}".
مهمتك: كتابة ملخص شامل لدرس: "${topic}".

قواعد مهمة:
- اذكر النقاط الرئيسية التي تمت تغطيتها
- ركّز على الأفكار الأساسية والمفاهيم المهمة
- اكتب 3-5 فقرات قصيرة
- استخدم لغة مناسبة لمستوى الصف ${grade}
- أجب فقط بـ JSON صالح بدون أي نص إضافي

صيغة JSON المطلوبة:
{
  "textAr": "الملخص باللغة العربية...",
  "textEn": "The summary in English..."
}

اكتب الآن ملخصًا لدرس "${topic}" بصيغة JSON فقط:`;
  }

  return `You are an expert teacher in "${subject}" for grade "${grade}".
Task: Write a comprehensive summary for the lesson: "${topic}".

Important rules:
- Mention the key points that were covered
- Focus on the core ideas and important concepts
- Write 3-5 short paragraphs
- Use language appropriate for ${grade} level
- Respond ONLY with valid JSON, no additional text

Required JSON format:
{
  "textAr": "الملخص باللغة العربية...",
  "textEn": "The summary in English..."
}

Write a summary for the lesson "${topic}" in JSON format only:`;
}