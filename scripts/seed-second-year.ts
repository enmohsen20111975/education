import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ==================== بيانات التخصصات ====================
const specializationsData = [
  { nameAr: "علمي علوم", nameEn: "Science", code: "science", descriptionAr: "شعبة العلوم - الصف الثاني الثانوي", descriptionEn: "Science Track - Second Year Secondary", order: 1 },
  { nameAr: "علمي رياضة", nameEn: "Mathematics", code: "math", descriptionAr: "شعبة الرياضيات - الصف الثاني الثانوي", descriptionEn: "Mathematics Track - Second Year Secondary", order: 2 },
  { nameAr: "أدبي", nameEn: "Arts", code: "arts", descriptionAr: "الشعبة الأدبية - الصف الثاني الثانوي", descriptionEn: "Arts Track - Second Year Secondary", order: 3 },
];

// ==================== بيانات المواد ====================

// علمي علوم (7 مواد)
const scienceSubjects = [
  { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-science", icon: "BookOpen", color: "#8B5CF6", order: 1, unitsCount: 6, lessonsPerUnit: 5 },
  { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-science", icon: "Globe", color: "#3B82F6", order: 2, unitsCount: 6, lessonsPerUnit: 5 },
  { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-science", icon: "Languages", color: "#EC4899", order: 3, unitsCount: 4, lessonsPerUnit: 5 },
  { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-2-science", icon: "Calculator", color: "#F59E0B", order: 4, unitsCount: 6, lessonsPerUnit: 5, isScientific: true },
  { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-science", icon: "Atom", color: "#10B981", order: 5, unitsCount: 5, lessonsPerUnit: 5, isScientific: true },
  { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-science", icon: "FlaskConical", color: "#EF4444", order: 6, unitsCount: 5, lessonsPerUnit: 5, isScientific: true },
  { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-2-science", icon: "Leaf", color: "#22C55E", order: 7, unitsCount: 5, lessonsPerUnit: 5, isScientific: true },
];

// علمي رياضة (6 مواد)
const mathSubjects = [
  { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-math", icon: "BookOpen", color: "#8B5CF6", order: 1, unitsCount: 6, lessonsPerUnit: 5 },
  { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-math", icon: "Globe", color: "#3B82F6", order: 2, unitsCount: 6, lessonsPerUnit: 5 },
  { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-math", icon: "Languages", color: "#EC4899", order: 3, unitsCount: 4, lessonsPerUnit: 5 },
  { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-2-math", icon: "Calculator", color: "#F59E0B", order: 4, unitsCount: 6, lessonsPerUnit: 5, isScientific: true },
  { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-math", icon: "Atom", color: "#10B981", order: 5, unitsCount: 5, lessonsPerUnit: 5, isScientific: true },
  { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-math", icon: "FlaskConical", color: "#EF4444", order: 6, unitsCount: 5, lessonsPerUnit: 5, isScientific: true },
];

// أدبي (7 مواد)
const artsSubjects = [
  { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-arts", icon: "BookOpen", color: "#8B5CF6", order: 1, unitsCount: 8, lessonsPerUnit: 5 },
  { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-arts", icon: "Globe", color: "#3B82F6", order: 2, unitsCount: 6, lessonsPerUnit: 5 },
  { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-arts", icon: "Languages", color: "#EC4899", order: 3, unitsCount: 4, lessonsPerUnit: 5 },
  { nameAr: "التاريخ", nameEn: "History", slug: "history-2-arts", icon: "Landmark", color: "#A855F7", order: 4, unitsCount: 6, lessonsPerUnit: 5 },
  { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-2-arts", icon: "Map", color: "#06B6D4", order: 5, unitsCount: 5, lessonsPerUnit: 5 },
  { nameAr: "الفلسفة", nameEn: "Philosophy", slug: "philosophy-2-arts", icon: "Brain", color: "#F97316", order: 6, unitsCount: 4, lessonsPerUnit: 5 },
  { nameAr: "علم النفس والاجتماع", nameEn: "Psychology & Sociology", slug: "psychology-2-arts", icon: "Users", color: "#6366F1", order: 7, unitsCount: 4, lessonsPerUnit: 5 },
];

// ==================== بيانات الوحدات حسب المادة ====================

const unitsData: Record<string, Array<{ nameAr: string; nameEn: string; slug: string }>> = {
  // اللغة العربية - علمي علوم
  "arabic-2-science": [
    { nameAr: "وحدة القراءة والمفردات", nameEn: "Reading and Vocabulary Unit", slug: "arabic-2-science-unit-1" },
    { nameAr: "وحدة النحو والصرف", nameEn: "Grammar and Morphology Unit", slug: "arabic-2-science-unit-2" },
    { nameAr: "وحدة البلاغة والعروض", nameEn: "Rhetoric and Prosody Unit", slug: "arabic-2-science-unit-3" },
    { nameAr: "وحدة النصوص الأدبية", nameEn: "Literary Texts Unit", slug: "arabic-2-science-unit-4" },
    { nameAr: "وحدة التعبير والإنشاء", nameEn: "Expression and Composition Unit", slug: "arabic-2-science-unit-5" },
    { nameAr: "وحدة الأدب العربي", nameEn: "Arabic Literature Unit", slug: "arabic-2-science-unit-6" },
  ],
  // اللغة الإنجليزية - علمي علوم
  "english-2-science": [
    { nameAr: "Unit 1: Life Stories", nameEn: "Unit 1: Life Stories", slug: "english-2-science-unit-1" },
    { nameAr: "Unit 2: Technology and Innovation", nameEn: "Unit 2: Technology and Innovation", slug: "english-2-science-unit-2" },
    { nameAr: "Unit 3: Environment and Nature", nameEn: "Unit 3: Environment and Nature", slug: "english-2-science-unit-3" },
    { nameAr: "Unit 4: Health and Lifestyle", nameEn: "Unit 4: Health and Lifestyle", slug: "english-2-science-unit-4" },
    { nameAr: "Unit 5: Culture and Society", nameEn: "Unit 5: Culture and Society", slug: "english-2-science-unit-5" },
    { nameAr: "Unit 6: Science and Discovery", nameEn: "Unit 6: Science and Discovery", slug: "english-2-science-unit-6" },
  ],
  // اللغة الثانية - علمي علوم
  "second-lang-2-science": [
    { nameAr: "الوحدة الأولى: الحياة اليومية", nameEn: "Unit 1: Daily Life", slug: "second-lang-2-science-unit-1" },
    { nameAr: "الوحدة الثانية: التعليم والمهنة", nameEn: "Unit 2: Education and Career", slug: "second-lang-2-science-unit-2" },
    { nameAr: "الوحدة الثالثة: الثقافة والفنون", nameEn: "Unit 3: Culture and Arts", slug: "second-lang-2-science-unit-3" },
    { nameAr: "الوحدة الرابعة: البيئة والمجتمع", nameEn: "Unit 4: Environment and Society", slug: "second-lang-2-science-unit-4" },
  ],
  // الرياضيات - علمي علوم
  "math-2-science": [
    { nameAr: "وحدة الجبر والدوال", nameEn: "Algebra and Functions Unit", slug: "math-2-science-unit-1" },
    { nameAr: "وحدة الهندسة الفراغية", nameEn: "Solid Geometry Unit", slug: "math-2-science-unit-2" },
    { nameAr: "وحدة المثلثات", nameEn: "Trigonometry Unit", slug: "math-2-science-unit-3" },
    { nameAr: "وحدة التفاضل والتكامل", nameEn: "Differentiation and Integration Unit", slug: "math-2-science-unit-4" },
    { nameAr: "وحدة الاحتمالات والإحصاء", nameEn: "Probability and Statistics Unit", slug: "math-2-science-unit-5" },
    { nameAr: "وحدة الهندسة التحليلية", nameEn: "Analytic Geometry Unit", slug: "math-2-science-unit-6" },
  ],
  // الفيزياء - علمي علوم
  "physics-2-science": [
    { nameAr: "وحدة الكهربية الساكنة", nameEn: "Electrostatics Unit", slug: "physics-2-science-unit-1" },
    { nameAr: "وحدة التيار الكهربي", nameEn: "Electric Current Unit", slug: "physics-2-science-unit-2" },
    { nameAr: "وحدة الكهرومغناطيسية", nameEn: "Electromagnetism Unit", slug: "physics-2-science-unit-3" },
    { nameAr: "وحدة الحث الكهرومغناطيسي", nameEn: "Electromagnetic Induction Unit", slug: "physics-2-science-unit-4" },
    { nameAr: "وحدة الفيزياء الحديثة", nameEn: "Modern Physics Unit", slug: "physics-2-science-unit-5" },
  ],
  // الكيمياء - علمي علوم
  "chemistry-2-science": [
    { nameAr: "وحدة التحولات الكيميائية", nameEn: "Chemical Transformations Unit", slug: "chemistry-2-science-unit-1" },
    { nameAr: "وحدة الاتزان الكيميائي", nameEn: "Chemical Equilibrium Unit", slug: "chemistry-2-science-unit-2" },
    { nameAr: "وحدة الكيمياء الكهربية", nameEn: "Electrochemistry Unit", slug: "chemistry-2-science-unit-3" },
    { nameAr: "وحدة الكيمياء العضوية", nameEn: "Organic Chemistry Unit", slug: "chemistry-2-science-unit-4" },
    { nameAr: "وحدة الكيمياء الحيوية", nameEn: "Biochemistry Unit", slug: "chemistry-2-science-unit-5" },
  ],
  // الأحياء - علمي علوم
  "biology-2-science": [
    { nameAr: "وحدة العلاقة بين الكائنات الحية", nameEn: "Relationships Between Organisms Unit", slug: "biology-2-science-unit-1" },
    { nameAr: "وحدة الوراثة", nameEn: "Genetics Unit", slug: "biology-2-science-unit-2" },
    { nameAr: "وحدة التطور", nameEn: "Evolution Unit", slug: "biology-2-science-unit-3" },
    { nameAr: "وحدة علم البيئة", nameEn: "Ecology Unit", slug: "biology-2-science-unit-4" },
    { nameAr: "وحدة التكنولوجيا الحيوية", nameEn: "Biotechnology Unit", slug: "biology-2-science-unit-5" },
  ],
  // اللغة العربية - علمي رياضة
  "arabic-2-math": [
    { nameAr: "وحدة القراءة والمفردات", nameEn: "Reading and Vocabulary Unit", slug: "arabic-2-math-unit-1" },
    { nameAr: "وحدة النحو والصرف", nameEn: "Grammar and Morphology Unit", slug: "arabic-2-math-unit-2" },
    { nameAr: "وحدة البلاغة والعروض", nameEn: "Rhetoric and Prosody Unit", slug: "arabic-2-math-unit-3" },
    { nameAr: "وحدة النصوص الأدبية", nameEn: "Literary Texts Unit", slug: "arabic-2-math-unit-4" },
    { nameAr: "وحدة التعبير والإنشاء", nameEn: "Expression and Composition Unit", slug: "arabic-2-math-unit-5" },
    { nameAr: "وحدة الأدب العربي", nameEn: "Arabic Literature Unit", slug: "arabic-2-math-unit-6" },
  ],
  // اللغة الإنجليزية - علمي رياضة
  "english-2-math": [
    { nameAr: "Unit 1: Life Stories", nameEn: "Unit 1: Life Stories", slug: "english-2-math-unit-1" },
    { nameAr: "Unit 2: Technology and Innovation", nameEn: "Unit 2: Technology and Innovation", slug: "english-2-math-unit-2" },
    { nameAr: "Unit 3: Environment and Nature", nameEn: "Unit 3: Environment and Nature", slug: "english-2-math-unit-3" },
    { nameAr: "Unit 4: Health and Lifestyle", nameEn: "Unit 4: Health and Lifestyle", slug: "english-2-math-unit-4" },
    { nameAr: "Unit 5: Culture and Society", nameEn: "Unit 5: Culture and Society", slug: "english-2-math-unit-5" },
    { nameAr: "Unit 6: Science and Discovery", nameEn: "Unit 6: Science and Discovery", slug: "english-2-math-unit-6" },
  ],
  // اللغة الثانية - علمي رياضة
  "second-lang-2-math": [
    { nameAr: "الوحدة الأولى: الحياة اليومية", nameEn: "Unit 1: Daily Life", slug: "second-lang-2-math-unit-1" },
    { nameAr: "الوحدة الثانية: التعليم والمهنة", nameEn: "Unit 2: Education and Career", slug: "second-lang-2-math-unit-2" },
    { nameAr: "الوحدة الثالثة: الثقافة والفنون", nameEn: "Unit 3: Culture and Arts", slug: "second-lang-2-math-unit-3" },
    { nameAr: "الوحدة الرابعة: البيئة والمجتمع", nameEn: "Unit 4: Environment and Society", slug: "second-lang-2-math-unit-4" },
  ],
  // الرياضيات - علمي رياضة
  "math-2-math": [
    { nameAr: "وحدة الجبر والدوال", nameEn: "Algebra and Functions Unit", slug: "math-2-math-unit-1" },
    { nameAr: "وحدة الهندسة الفراغية", nameEn: "Solid Geometry Unit", slug: "math-2-math-unit-2" },
    { nameAr: "وحدة المثلثات", nameEn: "Trigonometry Unit", slug: "math-2-math-unit-3" },
    { nameAr: "وحدة التفاضل والتكامل", nameEn: "Differentiation and Integration Unit", slug: "math-2-math-unit-4" },
    { nameAr: "وحدة الاحتمالات والإحصاء", nameEn: "Probability and Statistics Unit", slug: "math-2-math-unit-5" },
    { nameAr: "وحدة الهندسة التحليلية", nameEn: "Analytic Geometry Unit", slug: "math-2-math-unit-6" },
  ],
  // الفيزياء - علمي رياضة
  "physics-2-math": [
    { nameAr: "وحدة الكهربية الساكنة", nameEn: "Electrostatics Unit", slug: "physics-2-math-unit-1" },
    { nameAr: "وحدة التيار الكهربي", nameEn: "Electric Current Unit", slug: "physics-2-math-unit-2" },
    { nameAr: "وحدة الكهرومغناطيسية", nameEn: "Electromagnetism Unit", slug: "physics-2-math-unit-3" },
    { nameAr: "وحدة الحث الكهرومغناطيسي", nameEn: "Electromagnetic Induction Unit", slug: "physics-2-math-unit-4" },
    { nameAr: "وحدة الفيزياء الحديثة", nameEn: "Modern Physics Unit", slug: "physics-2-math-unit-5" },
  ],
  // الكيمياء - علمي رياضة
  "chemistry-2-math": [
    { nameAr: "وحدة التحولات الكيميائية", nameEn: "Chemical Transformations Unit", slug: "chemistry-2-math-unit-1" },
    { nameAr: "وحدة الاتزان الكيميائي", nameEn: "Chemical Equilibrium Unit", slug: "chemistry-2-math-unit-2" },
    { nameAr: "وحدة الكيمياء الكهربية", nameEn: "Electrochemistry Unit", slug: "chemistry-2-math-unit-3" },
    { nameAr: "وحدة الكيمياء العضوية", nameEn: "Organic Chemistry Unit", slug: "chemistry-2-math-unit-4" },
    { nameAr: "وحدة الكيمياء الحيوية", nameEn: "Biochemistry Unit", slug: "chemistry-2-math-unit-5" },
  ],
  // اللغة العربية - أدبي
  "arabic-2-arts": [
    { nameAr: "وحدة القراءة والمفردات", nameEn: "Reading and Vocabulary Unit", slug: "arabic-2-arts-unit-1" },
    { nameAr: "وحدة النحو والصرف", nameEn: "Grammar and Morphology Unit", slug: "arabic-2-arts-unit-2" },
    { nameAr: "وحدة البلاغة والعروض", nameEn: "Rhetoric and Prosody Unit", slug: "arabic-2-arts-unit-3" },
    { nameAr: "وحدة النصوص الأدبية - العصر الجاهلي", nameEn: "Literary Texts - Pre-Islamic Era", slug: "arabic-2-arts-unit-4" },
    { nameAr: "وحدة النصوص الأدبية - العصر الإسلامي", nameEn: "Literary Texts - Islamic Era", slug: "arabic-2-arts-unit-5" },
    { nameAr: "وحدة التعبير والإنشاء", nameEn: "Expression and Composition Unit", slug: "arabic-2-arts-unit-6" },
    { nameAr: "وحدة الأدب العربي - النقد الأدبي", nameEn: "Arabic Literature - Literary Criticism", slug: "arabic-2-arts-unit-7" },
    { nameAr: "وحدة الأدب المقارن", nameEn: "Comparative Literature Unit", slug: "arabic-2-arts-unit-8" },
  ],
  // اللغة الإنجليزية - أدبي
  "english-2-arts": [
    { nameAr: "Unit 1: Life Stories", nameEn: "Unit 1: Life Stories", slug: "english-2-arts-unit-1" },
    { nameAr: "Unit 2: Technology and Innovation", nameEn: "Unit 2: Technology and Innovation", slug: "english-2-arts-unit-2" },
    { nameAr: "Unit 3: Environment and Nature", nameEn: "Unit 3: Environment and Nature", slug: "english-2-arts-unit-3" },
    { nameAr: "Unit 4: Health and Lifestyle", nameEn: "Unit 4: Health and Lifestyle", slug: "english-2-arts-unit-4" },
    { nameAr: "Unit 5: Culture and Society", nameEn: "Unit 5: Culture and Society", slug: "english-2-arts-unit-5" },
    { nameAr: "Unit 6: Science and Discovery", nameEn: "Unit 6: Science and Discovery", slug: "english-2-arts-unit-6" },
  ],
  // اللغة الثانية - أدبي
  "second-lang-2-arts": [
    { nameAr: "الوحدة الأولى: الحياة اليومية", nameEn: "Unit 1: Daily Life", slug: "second-lang-2-arts-unit-1" },
    { nameAr: "الوحدة الثانية: التعليم والمهنة", nameEn: "Unit 2: Education and Career", slug: "second-lang-2-arts-unit-2" },
    { nameAr: "الوحدة الثالثة: الثقافة والفنون", nameEn: "Unit 3: Culture and Arts", slug: "second-lang-2-arts-unit-3" },
    { nameAr: "الوحدة الرابعة: البيئة والمجتمع", nameEn: "Unit 4: Environment and Society", slug: "second-lang-2-arts-unit-4" },
  ],
  // التاريخ - أدبي
  "history-2-arts": [
    { nameAr: "وحدة الحضارة المصرية القديمة", nameEn: "Ancient Egyptian Civilization Unit", slug: "history-2-arts-unit-1" },
    { nameAr: "وحدة الحضارات الشرقية القديمة", nameEn: "Ancient Eastern Civilizations Unit", slug: "history-2-arts-unit-2" },
    { nameAr: "وحدة الحضارة اليونانية", nameEn: "Greek Civilization Unit", slug: "history-2-arts-unit-3" },
    { nameAr: "وحدة الحضارة الرومانية", nameEn: "Roman Civilization Unit", slug: "history-2-arts-unit-4" },
    { nameAr: "وحدة الحضارة الإسلامية", nameEn: "Islamic Civilization Unit", slug: "history-2-arts-unit-5" },
    { nameAr: "وحدة مصر الحديثة", nameEn: "Modern Egypt Unit", slug: "history-2-arts-unit-6" },
  ],
  // الجغرافيا - أدبي
  "geography-2-arts": [
    { nameAr: "وحدة الجيومورفولوجيا", nameEn: "Geomorphology Unit", slug: "geography-2-arts-unit-1" },
    { nameAr: "وحدة المناخ والتغير المناخي", nameEn: "Climate and Climate Change Unit", slug: "geography-2-arts-unit-2" },
    { nameAr: "وحدة جغرافيا السكان", nameEn: "Population Geography Unit", slug: "geography-2-arts-unit-3" },
    { nameAr: "وحدة جغرافيا الموارد", nameEn: "Resource Geography Unit", slug: "geography-2-arts-unit-4" },
    { nameAr: "وحدة الجغرافيا الإقليمية", nameEn: "Regional Geography Unit", slug: "geography-2-arts-unit-5" },
  ],
  // الفلسفة - أدبي
  "philosophy-2-arts": [
    { nameAr: "وحدة مدخل إلى الفلسفة", nameEn: "Introduction to Philosophy Unit", slug: "philosophy-2-arts-unit-1" },
    { nameAr: "وحدة المذاهب الفلسفية", nameEn: "Philosophical Schools Unit", slug: "philosophy-2-arts-unit-2" },
    { nameAr: "وحدة المنطق", nameEn: "Logic Unit", slug: "philosophy-2-arts-unit-3" },
    { nameAr: "وحدة الأخلاق", nameEn: "Ethics Unit", slug: "philosophy-2-arts-unit-4" },
  ],
  // علم النفس والاجتماع - أدبي
  "psychology-2-arts": [
    { nameAr: "وحدة مدخل إلى علم النفس", nameEn: "Introduction to Psychology Unit", slug: "psychology-2-arts-unit-1" },
    { nameAr: "وحدة علم النفس المعرفي", nameEn: "Cognitive Psychology Unit", slug: "psychology-2-arts-unit-2" },
    { nameAr: "وحدة علم الاجتماع", nameEn: "Sociology Unit", slug: "psychology-2-arts-unit-3" },
    { nameAr: "وحدة المشكلات الاجتماعية", nameEn: "Social Problems Unit", slug: "psychology-2-arts-unit-4" },
  ],
};

// ==================== دوال مساعدة لإنشاء الدروس ====================

interface LessonContent {
  titleAr: string;
  titleEn: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  introductionAr: string;
  introductionEn: string;
  summaryAr: string;
  summaryEn: string;
  duration: number;
  order: number;
  isFree: boolean;
  objectives: Array<{ textAr: string; textEn: string; order: number }>;
  concepts: Array<{ termAr: string; termEn: string; definitionAr: string; definitionEn: string; order: number }>;
  formulas?: Array<{ formula: string; explanationAr: string; explanationEn: string; order: number }>;
  examples: Array<{ questionAr: string; questionEn: string; solutionAr: string; solutionEn: string; stepsAr: string; stepsEn: string; order: number }>;
  questions: Array<{ type: string; questionAr: string; questionEn: string; optionsAr?: string; optionsEn?: string; answer: string; explanationAr: string; explanationEn: string; points: number; difficulty: string; order: number }>;
}

// محتوى الدروس للمواد المختلفة
const lessonsContent: Record<string, LessonContent[]> = {
  // فيزياء - الكهربية الساكنة
  "physics-2-science-unit-1": [
    {
      titleAr: "الشحنة الكهربية وقانون كولوم",
      titleEn: "Electric Charge and Coulomb's Law",
      slug: "electric-charge-coulomb-law",
      descriptionAr: "دراسة الشحنة الكهربية وخواصها وقانون كولوم لحساب القوة الكهربية",
      descriptionEn: "Study of electric charge, its properties, and Coulomb's law for calculating electric force",
      introductionAr: "الشحنة الكهربية هي خاصية فيزيائية للمادة تسبب تفاعلات كهرومغناطيسية. توجد نوعان من الشحنات: موجبة وسالبة. الشحنات المتشابهة تتنافر والمختلفة تتجاذب.",
      introductionEn: "Electric charge is a physical property of matter that causes electromagnetic interactions. There are two types of charges: positive and negative. Like charges repel, unlike charges attract.",
      summaryAr: "الشحنة الكهربية كمّية ومحفوظة. قانون كولوم يحدد القوة بين شحنتين نقطيتين. الثابت الكهربي k = 9×10⁹ N·m²/C²",
      summaryEn: "Electric charge is quantized and conserved. Coulomb's law determines the force between two point charges. Electric constant k = 9×10⁹ N·m²/C²",
      duration: 45,
      order: 1,
      isFree: true,
      objectives: [
        { textAr: "فهم مفهوم الشحنة الكهربية وخواصها", textEn: "Understand electric charge and its properties", order: 1 },
        { textAr: "تطبيق قانون كولوم لحساب القوة الكهربية", textEn: "Apply Coulomb's law to calculate electric force", order: 2 },
        { textAr: "فهم مبدأ حفظ الشحنة الكهربية", textEn: "Understand the principle of charge conservation", order: 3 },
      ],
      concepts: [
        { termAr: "الشحنة الكهربية", termEn: "Electric Charge", definitionAr: "خاصية فيزيائية للمادة تسبب تفاعلات كهرومغناطيسية", definitionEn: "Physical property of matter causing electromagnetic interactions", order: 1 },
        { termAr: "قانون كولوم", termEn: "Coulomb's Law", definitionAr: "القوة بين شحنتين تتناسب طردياً مع حاصل ضربهما وعكسياً مع مربع المسافة", definitionEn: "Force between two charges is proportional to their product and inversely to distance squared", order: 2 },
        { termAr: "الكمّية", termEn: "Quantization", definitionAr: "الشحنة الكهربية تأتي في مضاعفات صحيحة من الشحنة الأولية e", definitionEn: "Electric charge comes in integer multiples of elementary charge e", order: 3 },
      ],
      formulas: [
        { formula: "F = k × |q₁ × q₂| / r²", explanationAr: "قانون كولوم لحساب القوة الكهربية", explanationEn: "Coulomb's law for electric force calculation", order: 1 },
        { formula: "k = 1 / (4πε₀) = 9×10⁹ N·m²/C²", explanationAr: "الثابت الكهربي في الفراغ", explanationEn: "Electric constant in vacuum", order: 2 },
        { formula: "q = n × e", explanationAr: "كمّية الشحنة الكهربية", explanationEn: "Quantization of electric charge", order: 3 },
      ],
      examples: [
        {
          questionAr: "احسب القوة بين شحنتين q₁ = 2μC و q₂ = 4μC والمسافة بينهما 0.5m",
          questionEn: "Calculate the force between charges q₁ = 2μC and q₂ = 4μC at distance 0.5m",
          solutionAr: "F = k × |q₁ × q₂| / r² = 9×10⁹ × 8×10⁻¹² / 0.25 = 0.288 N",
          solutionEn: "F = k × |q₁ × q₂| / r² = 9×10⁹ × 8×10⁻¹² / 0.25 = 0.288 N",
          stepsAr: "1. نحول الشحنات إلى كولوم: q₁ = 2×10⁻⁶ C, q₂ = 4×10⁻⁶ C\n2. نطبق قانون كولوم: F = 9×10⁹ × (2×10⁻⁶ × 4×10⁻⁶) / 0.5²\m 3. F = 9×10⁹ × 8×10⁻¹² / 0.25 = 0.288 N",
          stepsEn: "1. Convert charges to Coulombs: q₁ = 2×10⁻⁶ C, q₂ = 4×10⁻⁶ C\n2. Apply Coulomb's law: F = 9×10⁹ × (2×10⁻⁶ × 4×10⁻⁶) / 0.5²\n3. F = 9×10⁹ × 8×10⁻¹² / 0.25 = 0.288 N",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما نوع القوة بين شحنتين سالبتين؟",
          questionEn: "What type of force exists between two negative charges?",
          optionsAr: JSON.stringify(["تجاذب", "تنافر", "لا توجد قوة", "تتغير مع الزمن"]),
          optionsEn: JSON.stringify(["Attraction", "Repulsion", "No force", "Changes with time"]),
          answer: "تنافر",
          explanationAr: "الشحنات المتشابهة (كلاهما سالب) تتنافر",
          explanationEn: "Like charges (both negative) repel each other",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
        {
          type: "multiple_choice",
          questionAr: "ما قيمة الثابت الكهربي k؟",
          questionEn: "What is the value of electric constant k?",
          optionsAr: JSON.stringify(["9×10⁹ N·m²/C²", "8.85×10⁻¹² F/m", "6.67×10⁻¹¹ N·m²/kg²", "3×10⁸ m/s"]),
          optionsEn: JSON.stringify(["9×10⁹ N·m²/C²", "8.85×10⁻¹² F/m", "6.67×10⁻¹¹ N·m²/kg²", "3×10⁸ m/s"]),
          answer: "9×10⁹ N·m²/C²",
          explanationAr: "الثابت الكهربي في الفراغ يساوي 9×10⁹ N·m²/C²",
          explanationEn: "The electric constant in vacuum equals 9×10⁹ N·m²/C²",
          points: 1,
          difficulty: "easy",
          order: 2,
        },
      ],
    },
    {
      titleAr: "المجال الكهربي",
      titleEn: "Electric Field",
      slug: "electric-field",
      descriptionAr: "دراسة مفهوم المجال الكهربي وخطوط المجال",
      descriptionEn: "Study of electric field concept and field lines",
      introductionAr: "المجال الكهربي هو منطقة حول شحنة يتأثر فيها أي شحنة أخرى بقوة كهربية. ويُمثل بمتجه له مقدار واتجاه.",
      introductionEn: "Electric field is a region around a charge where any other charge experiences an electric force. It is represented as a vector with magnitude and direction.",
      summaryAr: "شدة المجال الكهربي E = F/q = kQ/r². خطوط المجال تخرج من الشحنات الموجبة وتدخل السالبة.",
      summaryEn: "Electric field intensity E = F/q = kQ/r². Field lines emerge from positive charges and enter negative ones.",
      duration: 45,
      order: 2,
      isFree: false,
      objectives: [
        { textAr: "فهم مفهوم المجال الكهربي", textEn: "Understand electric field concept", order: 1 },
        { textAr: "حساب شدة المجال الكهربي", textEn: "Calculate electric field intensity", order: 2 },
        { textAr: "رسم خطوط المجال الكهربي", textEn: "Draw electric field lines", order: 3 },
      ],
      concepts: [
        { termAr: "المجال الكهربي", termEn: "Electric Field", definitionAr: "منطقة حول شحنة يتأثر فيها أي شحنة أخرى بقوة كهربية", definitionEn: "Region around a charge where other charges experience electric force", order: 1 },
        { termAr: "شدة المجال", termEn: "Field Intensity", definitionAr: "القوة المؤثرة على وحدة الشحنات الموجبة", definitionEn: "Force per unit positive charge", order: 2 },
        { termAr: "خطوط المجال", termEn: "Field Lines", definitionAr: "خطوط وهمية تمثل اتجاه المجال الكهربي", definitionEn: "Imaginary lines representing electric field direction", order: 3 },
      ],
      formulas: [
        { formula: "E = F / q", explanationAr: "شدة المجال الكهربي من تعريفه", explanationEn: "Electric field intensity from definition", order: 1 },
        { formula: "E = kQ / r²", explanationAr: "شدة المجال لشحنة نقطية", explanationEn: "Field intensity for a point charge", order: 2 },
        { formula: "E = V / d", explanationAr: "شدة المجال بين لوحين متوازيين", explanationEn: "Field intensity between parallel plates", order: 3 },
      ],
      examples: [
        {
          questionAr: "احسب شدة المجال الكهربي على بعد 2m من شحنة 5μC",
          questionEn: "Calculate electric field intensity 2m from a 5μC charge",
          solutionAr: "E = kQ/r² = 9×10⁹ × 5×10⁻⁶ / 4 = 11250 N/C",
          solutionEn: "E = kQ/r² = 9×10⁹ × 5×10⁻⁶ / 4 = 11250 N/C",
          stepsAr: "1. نحول الشحنة: Q = 5×10⁻⁶ C\n2. نطبق القانون: E = 9×10⁹ × 5×10⁻⁶ / 2²\n3. E = 45×10³ / 4 = 11250 N/C",
          stepsEn: "1. Convert charge: Q = 5×10⁻⁶ C\n2. Apply formula: E = 9×10⁹ × 5×10⁻⁶ / 2²\n3. E = 45×10³ / 4 = 11250 N/C",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما وحدة قياس شدة المجال الكهربي؟",
          questionEn: "What is the unit of electric field intensity?",
          optionsAr: JSON.stringify(["N/C", "C/N", "J/C", "N·m"]),
          optionsEn: JSON.stringify(["N/C", "C/N", "J/C", "N·m"]),
          answer: "N/C",
          explanationAr: "وحدة شدة المجال الكهربي هي نيوتن/كولوم أو فولت/متر",
          explanationEn: "Electric field intensity unit is Newton/Coulomb or Volt/meter",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
      ],
    },
    {
      titleAr: "الجهد الكهربي",
      titleEn: "Electric Potential",
      slug: "electric-potential",
      descriptionAr: "دراسة مفهوم الجهد الكهربي والطاقة الكامنة الكهربية",
      descriptionEn: "Study of electric potential and electric potential energy",
      introductionAr: "الجهد الكهربي عند نقطة هو الشغل المبذول لنقل وحدة الشحنات الموجبة من اللانهاية إلى هذه النقطة.",
      introductionEn: "Electric potential at a point is the work done to move a unit positive charge from infinity to that point.",
      summaryAr: "الجهد الكهربي V = kQ/r. فرق الجهد ΔV = W/q. الطاقة الكامنة U = kq₁q₂/r",
      summaryEn: "Electric potential V = kQ/r. Potential difference ΔV = W/q. Potential energy U = kq₁q₂/r",
      duration: 45,
      order: 3,
      isFree: false,
      objectives: [
        { textAr: "فهم مفهوم الجهد الكهربي", textEn: "Understand electric potential concept", order: 1 },
        { textAr: "حساب الجهد الكهربي لشحنة نقطية", textEn: "Calculate electric potential for a point charge", order: 2 },
        { textAr: "الربط بين الجهد والطاقة الكامنة", textEn: "Relate potential to potential energy", order: 3 },
      ],
      concepts: [
        { termAr: "الجهد الكهربي", termEn: "Electric Potential", definitionAr: "الشغل المبذول لنقل وحدة الشحنات من اللانهاية للنقطة", definitionEn: "Work done to move unit charge from infinity to the point", order: 1 },
        { termAr: "فرق الجهد", termEn: "Potential Difference", definitionAr: "الشغل المبذول لنقل وحدة الشحنات بين نقطتين", definitionEn: "Work done to move unit charge between two points", order: 2 },
        { termAr: "الطاقة الكامنة", termEn: "Potential Energy", definitionAr: "الطاقة المخزنة بسبب موقع الشحنة في المجال", definitionEn: "Energy stored due to charge position in the field", order: 3 },
      ],
      formulas: [
        { formula: "V = kQ / r", explanationAr: "الجهد الكهربي لشحنة نقطية", explanationEn: "Electric potential for a point charge", order: 1 },
        { formula: "ΔV = W / q", explanationAr: "فرق الجهد الكهربي", explanationEn: "Electric potential difference", order: 2 },
        { formula: "U = kq₁q₂ / r", explanationAr: "الطاقة الكامنة الكهربية", explanationEn: "Electric potential energy", order: 3 },
      ],
      examples: [
        {
          questionAr: "احسب الجهد الكهربي على بعد 3m من شحنة 2μC",
          questionEn: "Calculate electric potential 3m from a 2μC charge",
          solutionAr: "V = kQ/r = 9×10⁹ × 2×10⁻⁶ / 3 = 6000 V",
          solutionEn: "V = kQ/r = 9×10⁹ × 2×10⁻⁶ / 3 = 6000 V",
          stepsAr: "1. Q = 2×10⁻⁶ C, r = 3m\n2. V = 9×10⁹ × 2×10⁻⁶ / 3\n3. V = 18×10³ / 3 = 6000 V",
          stepsEn: "1. Q = 2×10⁻⁶ C, r = 3m\n2. V = 9×10⁹ × 2×10⁻⁶ / 3\n3. V = 18×10³ / 3 = 6000 V",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما وحدة قياس الجهد الكهربي؟",
          questionEn: "What is the unit of electric potential?",
          optionsAr: JSON.stringify(["فولت (V)", "أمبير (A)", "أوم (Ω)", "واط (W)"]),
          optionsEn: JSON.stringify(["Volt (V)", "Ampere (A)", "Ohm (Ω)", "Watt (W)"]),
          answer: "فولت (V)",
          explanationAr: "وحدة الجهد الكهربي هي الفولت ويساوي جول/كولوم",
          explanationEn: "Electric potential unit is Volt which equals Joule/Coulomb",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
      ],
    },
    {
      titleAr: "المكثفات الكهربية",
      titleEn: "Capacitors",
      slug: "capacitors",
      descriptionAr: "دراسة المكثفات وأنواعها والسعة الكهربية",
      descriptionEn: "Study of capacitors, types, and capacitance",
      introductionAr: "المكثف هو عنصر كهربي يخزن الشحنة الكهربية. يتكون من لوحين موصلين بينهما عازل.",
      introductionEn: "A capacitor is an electrical component that stores electric charge. It consists of two conducting plates with an insulator between them.",
      summaryAr: "السعة C = Q/V. مكثف الألواح المتوازية C = ε₀A/d. الطاقة المخزنة U = ½CV²",
      summaryEn: "Capacitance C = Q/V. Parallel plate capacitor C = ε₀A/d. Stored energy U = ½CV²",
      duration: 45,
      order: 4,
      isFree: false,
      objectives: [
        { textAr: "فهم مبدأ عمل المكثف", textEn: "Understand capacitor working principle", order: 1 },
        { textAr: "حساب السعة الكهربية", textEn: "Calculate capacitance", order: 2 },
        { textAr: "حساب الطاقة المخزنة في المكثف", textEn: "Calculate energy stored in capacitor", order: 3 },
      ],
      concepts: [
        { termAr: "المكثف", termEn: "Capacitor", definitionAr: "عنصر يخزن الشحنة الكهربية", definitionEn: "Component that stores electric charge", order: 1 },
        { termAr: "السعة الكهربية", termEn: "Capacitance", definitionAr: "قدرة المكثف على تخزين الشحنة", definitionEn: "Ability of capacitor to store charge", order: 2 },
        { termAr: "العازل", termEn: "Dielectric", definitionAr: "مادة عازلة بين لوحي المكثف", definitionEn: "Insulating material between capacitor plates", order: 3 },
      ],
      formulas: [
        { formula: "C = Q / V", explanationAr: "تعريف السعة الكهربية", explanationEn: "Definition of capacitance", order: 1 },
        { formula: "C = ε₀A / d", explanationAr: "سعة مكثف الألواح المتوازية", explanationEn: "Parallel plate capacitor capacitance", order: 2 },
        { formula: "U = ½CV² = ½QV", explanationAr: "الطاقة المخزنة في المكثف", explanationEn: "Energy stored in capacitor", order: 3 },
      ],
      examples: [
        {
          questionAr: "مكثف سعته 10μF مشحون بجهد 100V. احسب الشحنة المخزنة",
          questionEn: "A 10μF capacitor is charged to 100V. Calculate stored charge",
          solutionAr: "Q = CV = 10×10⁻⁶ × 100 = 10⁻³ C = 1 mC",
          solutionEn: "Q = CV = 10×10⁻⁶ × 100 = 10⁻³ C = 1 mC",
          stepsAr: "1. C = 10×10⁻⁶ F, V = 100V\n2. Q = CV = 10×10⁻⁶ × 100\n3. Q = 10⁻³ C = 1 mC",
          stepsEn: "1. C = 10×10⁻⁶ F, V = 100V\n2. Q = CV = 10×10⁻⁶ × 100\n3. Q = 10⁻³ C = 1 mC",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما وحدة قياس السعة الكهربية؟",
          questionEn: "What is the unit of capacitance?",
          optionsAr: JSON.stringify(["فاراد (F)", "فولت (V)", "كولوم (C)", "أمبير (A)"]),
          optionsEn: JSON.stringify(["Farad (F)", "Volt (V)", "Coulomb (C)", "Ampere (A)"]),
          answer: "فاراد (F)",
          explanationAr: "وحدة السعة الكهربية هي الفاراد ويساوي كولوم/فولت",
          explanationEn: "Capacitance unit is Farad which equals Coulomb/Volt",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
      ],
    },
    {
      titleAr: "توصيل المكثفات",
      titleEn: "Capacitor Connections",
      slug: "capacitor-connections",
      descriptionAr: "دراسة التوصيل على التوالي والتوازي للمكثفات",
      descriptionEn: "Study of series and parallel connections of capacitors",
      introductionAr: "يمكن توصيل المكثفات إما على التوالي أو على التوازي، ولكل نوع خصائص مختلفة في حساب السعة الكلية.",
      introductionEn: "Capacitors can be connected either in series or parallel, each type has different characteristics in calculating total capacitance.",
      summaryAr: "التوالي: 1/C = 1/C₁ + 1/C₂ + ... التوازي: C = C₁ + C₂ + ...",
      summaryEn: "Series: 1/C = 1/C₁ + 1/C₂ + ... Parallel: C = C₁ + C₂ + ...",
      duration: 45,
      order: 5,
      isFree: false,
      objectives: [
        { textAr: "فهم التوصيل على التوالي والتوازي", textEn: "Understand series and parallel connections", order: 1 },
        { textAr: "حساب السعة المكافئة", textEn: "Calculate equivalent capacitance", order: 2 },
        { textAr: "تحليل دوائر المكثفات المركبة", textEn: "Analyze compound capacitor circuits", order: 3 },
      ],
      concepts: [
        { termAr: "التوصيل على التوالي", termEn: "Series Connection", definitionAr: "توصيل المكثفات بحيث تكون الشحنة متساوية", definitionEn: "Connection where charges are equal", order: 1 },
        { termAr: "التوصيل على التوازي", termEn: "Parallel Connection", definitionAr: "توصيل المكثفات بحيث يكون الجهد متساوي", definitionEn: "Connection where voltage is equal", order: 2 },
        { termAr: "السعة المكافئة", termEn: "Equivalent Capacitance", definitionAr: "السعة الكلية لمجموعة مكثفات", definitionEn: "Total capacitance of a capacitor group", order: 3 },
      ],
      formulas: [
        { formula: "1/C_eq = 1/C₁ + 1/C₂ + ...", explanationAr: "السعة المكافئة في التوالي", explanationEn: "Equivalent capacitance in series", order: 1 },
        { formula: "C_eq = C₁ + C₂ + ...", explanationAr: "السعة المكافئة في التوازي", explanationEn: "Equivalent capacitance in parallel", order: 2 },
      ],
      examples: [
        {
          questionAr: "مكثفان C₁=6μF و C₂=3μF. احسب السعة المكافئة في التوالي والتوازي",
          questionEn: "Two capacitors C₁=6μF and C₂=3μF. Calculate equivalent capacitance in series and parallel",
          solutionAr: "التوالي: 1/C = 1/6 + 1/3 = 1/2 → C = 2μF\nالتوازي: C = 6 + 3 = 9μF",
          solutionEn: "Series: 1/C = 1/6 + 1/3 = 1/2 → C = 2μF\nParallel: C = 6 + 3 = 9μF",
          stepsAr: "التوالي:\n1. 1/C = 1/6 + 1/3 = 3/6 = 1/2\n2. C = 2μF\n\nالتوازي:\n1. C = 6 + 3 = 9μF",
          stepsEn: "Series:\n1. 1/C = 1/6 + 1/3 = 3/6 = 1/2\n2. C = 2μF\n\nParallel:\n1. C = 6 + 3 = 9μF",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ماذا يحدث للسعة المكافئة عند توصيل مكثفين على التوالي؟",
          questionEn: "What happens to equivalent capacitance when connecting two capacitors in series?",
          optionsAr: JSON.stringify(["تقل", "تزيد", "تبقى ثابتة", "تتضاعف"]),
          optionsEn: JSON.stringify(["Decreases", "Increases", "Remains constant", "Doubles"]),
          answer: "تقل",
          explanationAr: "التوصيل على التوالي يقلل السعة المكافئة",
          explanationEn: "Series connection decreases equivalent capacitance",
          points: 1,
          difficulty: "medium",
          order: 1,
        },
      ],
    },
  ],
  // رياضيات - الجبر والدوال
  "math-2-science-unit-1": [
    {
      titleAr: "الدوال الجبرية",
      titleEn: "Algebraic Functions",
      slug: "algebraic-functions",
      descriptionAr: "دراسة أنواع الدوال الجبرية وخصائصها",
      descriptionEn: "Study of algebraic functions types and properties",
      introductionAr: "الدالة الجبرية هي دالة يمكن التعبير عنها باستخدام عمليات جبرية أساسية. تشمل الدوال كثيرة الحدود والدوال النسبية.",
      introductionEn: "An algebraic function is a function that can be expressed using basic algebraic operations. It includes polynomial and rational functions.",
      summaryAr: "الدالة الخطية: f(x) = ax + b. الدالة التربيعية: f(x) = ax² + bx + c. الدالة النسبية: f(x) = P(x)/Q(x)",
      summaryEn: "Linear function: f(x) = ax + b. Quadratic function: f(x) = ax² + bx + c. Rational function: f(x) = P(x)/Q(x)",
      duration: 45,
      order: 1,
      isFree: true,
      objectives: [
        { textAr: "التعرف على أنواع الدوال الجبرية", textEn: "Identify types of algebraic functions", order: 1 },
        { textAr: "تحليل خصائص كل نوع من الدوال", textEn: "Analyze properties of each function type", order: 2 },
        { textAr: "رسم بياني للدوال الجبرية", textEn: "Graph algebraic functions", order: 3 },
      ],
      concepts: [
        { termAr: "الدالة", termEn: "Function", definitionAr: "علاقة تربط كل عنصر في المجال بعنصر واحد في المدى", definitionEn: "Relation connecting each element in domain to one element in range", order: 1 },
        { termAr: "مجال الدالة", termEn: "Domain", definitionAr: "مجموعة القيم الممكنة للمتغير المستقل", definitionEn: "Set of possible values for independent variable", order: 2 },
        { termAr: "مدى الدالة", termEn: "Range", definitionAr: "مجموعة القيم الناتجة للدالة", definitionEn: "Set of resulting values of the function", order: 3 },
      ],
      formulas: [
        { formula: "f(x) = ax + b", explanationAr: "الصيغة العامة للدالة الخطية", explanationEn: "General form of linear function", order: 1 },
        { formula: "f(x) = ax² + bx + c", explanationAr: "الصيغة العامة للدالة التربيعية", explanationEn: "General form of quadratic function", order: 2 },
        { formula: "x = -b/(2a)", explanationAr: "إحداثي x لرأس القطع المكافئ", explanationEn: "x-coordinate of parabola vertex", order: 3 },
      ],
      examples: [
        {
          questionAr: "أوجد رأس القطع المكافئ للدالة f(x) = x² - 4x + 3",
          questionEn: "Find the vertex of parabola for f(x) = x² - 4x + 3",
          solutionAr: "x = -(-4)/(2×1) = 2\nf(2) = 4 - 8 + 3 = -1\nالرأس: (2, -1)",
          solutionEn: "x = -(-4)/(2×1) = 2\nf(2) = 4 - 8 + 3 = -1\nVertex: (2, -1)",
          stepsAr: "1. a = 1, b = -4, c = 3\n2. x = -b/(2a) = 4/2 = 2\n3. f(2) = 4 - 8 + 3 = -1\n4. الرأس = (2, -1)",
          stepsEn: "1. a = 1, b = -4, c = 3\n2. x = -b/(2a) = 4/2 = 2\n3. f(2) = 4 - 8 + 3 = -1\n4. Vertex = (2, -1)",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما نوع الدالة f(x) = 3x + 5؟",
          questionEn: "What type of function is f(x) = 3x + 5?",
          optionsAr: JSON.stringify(["دالة خطية", "دالة تربيعية", "دالة نسبية", "دالة أسية"]),
          optionsEn: JSON.stringify(["Linear function", "Quadratic function", "Rational function", "Exponential function"]),
          answer: "دالة خطية",
          explanationAr: "الدالة من الدرجة الأولى هي دالة خطية",
          explanationEn: "First degree function is a linear function",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
      ],
    },
    {
      titleAr: "حل المعادلات والمتراجحات",
      titleEn: "Solving Equations and Inequalities",
      slug: "solving-equations-inequalities",
      descriptionAr: "دراسة طرق حل المعادلات والمتراجحات الجبرية",
      descriptionEn: "Study of solving algebraic equations and inequalities",
      introductionAr: "المعادلة هي جملة رياضية تحتوي على متغير ومتساوية. المتراجحة هي جملة رياضية تحتوي على متغير وإشارة أكبر أو أصغر.",
      introductionEn: "An equation is a mathematical sentence containing a variable and equality. An inequality contains a variable and greater/less than sign.",
      summaryAr: "حل المعادلة التربيعية بالقانون العام أو التحليل. حل المتراجحة بتحديد مناطق الإشارة.",
      summaryEn: "Solve quadratic equation using quadratic formula or factoring. Solve inequality by determining sign regions.",
      duration: 45,
      order: 2,
      isFree: false,
      objectives: [
        { textAr: "حل المعادلات من الدرجة الأولى والثانية", textEn: "Solve first and second degree equations", order: 1 },
        { textAr: "حل المتراجحات الخطية والتربيعية", textEn: "Solve linear and quadratic inequalities", order: 2 },
        { textAr: "تمثيل الحلول بيانياً", textEn: "Graph solutions", order: 3 },
      ],
      concepts: [
        { termAr: "المعادلة", termEn: "Equation", definitionAr: "جملة رياضية تحتوي على متساوية", definitionEn: "Mathematical sentence containing equality", order: 1 },
        { termAr: "المتراجحة", termEn: "Inequality", definitionAr: "جملة رياضية تحتوي على أكبر أو أصغر", definitionEn: "Mathematical sentence containing greater/less than", order: 2 },
        { termAr: "المميز", termEn: "Discriminant", definitionAr: "Δ = b² - 4ac يحدد طبيعة الجذور", definitionEn: "Δ = b² - 4ac determines roots nature", order: 3 },
      ],
      formulas: [
        { formula: "x = (-b ± √(b²-4ac)) / 2a", explanationAr: "القانون العام لحل المعادلة التربيعية", explanationEn: "Quadratic formula for solving quadratic equation", order: 1 },
        { formula: "Δ = b² - 4ac", explanationAr: "المميز يحدد عدد ونوع الجذور", explanationEn: "Discriminant determines number and type of roots", order: 2 },
      ],
      examples: [
        {
          questionAr: "حل المعادلة: x² - 5x + 6 = 0",
          questionEn: "Solve the equation: x² - 5x + 6 = 0",
          solutionAr: "x = (5 ± √(25-24)) / 2 = (5 ± 1) / 2\nx₁ = 3, x₂ = 2",
          solutionEn: "x = (5 ± √(25-24)) / 2 = (5 ± 1) / 2\nx₁ = 3, x₂ = 2",
          stepsAr: "1. a = 1, b = -5, c = 6\n2. Δ = 25 - 24 = 1\n3. x = (5 ± 1) / 2\n4. x₁ = 3, x₂ = 2",
          stepsEn: "1. a = 1, b = -5, c = 6\n2. Δ = 25 - 24 = 1\n3. x = (5 ± 1) / 2\n4. x₁ = 3, x₂ = 2",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "إذا كان Δ < 0 في المعادلة التربيعية، فما عدد الجذور الحقيقية؟",
          questionEn: "If Δ < 0 in a quadratic equation, how many real roots?",
          optionsAr: JSON.stringify(["صفر", "واحد", "اثنان", "لانهائي"]),
          optionsEn: JSON.stringify(["Zero", "One", "Two", "Infinite"]),
          answer: "صفر",
          explanationAr: "إذا كان المميز سالباً فلا توجد جذور حقيقية",
          explanationEn: "If discriminant is negative, there are no real roots",
          points: 1,
          difficulty: "medium",
          order: 1,
        },
      ],
    },
    {
      titleAr: "الدوال النسبية",
      titleEn: "Rational Functions",
      slug: "rational-functions",
      descriptionAr: "دراسة الدوال النسبية وخصائصها وخطوط التقارب",
      descriptionEn: "Study of rational functions, properties, and asymptotes",
      introductionAr: "الدالة النسبية هي دالة على صورة نسبة بين كثيرتي حدود. تتميز بوجود خطوط تقارب رأسية وأفقية.",
      introductionEn: "A rational function is a function in the form of a ratio of two polynomials. It is characterized by vertical and horizontal asymptotes.",
      summaryAr: "خط التقارب الرأسي عند جذور المقام. خط التقارب الأفقي عند حدود الدالة عندما x → ∞",
      summaryEn: "Vertical asymptote at denominator roots. Horizontal asymptote at function limit as x → ∞",
      duration: 45,
      order: 3,
      isFree: false,
      objectives: [
        { textAr: "تحديد مجال الدالة النسبية", textEn: "Determine rational function domain", order: 1 },
        { textAr: "إيجاد خطوط التقارب", textEn: "Find asymptotes", order: 2 },
        { textAr: "رسم الدالة النسبية", textEn: "Graph rational function", order: 3 },
      ],
      concepts: [
        { termAr: "الدالة النسبية", termEn: "Rational Function", definitionAr: "نسبة بين كثيرتي حدود", definitionEn: "Ratio of two polynomials", order: 1 },
        { termAr: "خط التقارب", termEn: "Asymptote", definitionAr: "خط تقترب منه الدالة بلا حدود", definitionEn: "Line that function approaches indefinitely", order: 2 },
        { termAr: "نقطة الانقطاع", termEn: "Discontinuity Point", definitionAr: "نقطة غير معرفة في الدالة", definitionEn: "Point undefined in the function", order: 3 },
      ],
      formulas: [
        { formula: "f(x) = P(x) / Q(x)", explanationAr: "الصيغة العامة للدالة النسبية", explanationEn: "General form of rational function", order: 1 },
        { formula: "x = a عند Q(a) = 0", explanationAr: "خط التقارب الرأسي", explanationEn: "Vertical asymptote", order: 2 },
      ],
      examples: [
        {
          questionAr: "أوجد خطوط التقارب للدالة f(x) = (x+1)/(x-2)",
          questionEn: "Find asymptotes for f(x) = (x+1)/(x-2)",
          solutionAr: "خط التقارب الرأسي: x = 2\nخط التقارب الأفقي: y = 1",
          solutionEn: "Vertical asymptote: x = 2\nHorizontal asymptote: y = 1",
          stepsAr: "1. المقام = 0 → x = 2 (خط تقارب رأسي)\n2. الحد عند x→∞ = 1 (خط تقارب أفقي)",
          stepsEn: "1. Denominator = 0 → x = 2 (vertical asymptote)\n2. Limit at x→∞ = 1 (horizontal asymptote)",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما خط التقارب الرأسي للدالة f(x) = 1/(x-3)؟",
          questionEn: "What is the vertical asymptote of f(x) = 1/(x-3)?",
          optionsAr: JSON.stringify(["x = 3", "x = 0", "y = 3", "y = 0"]),
          optionsEn: JSON.stringify(["x = 3", "x = 0", "y = 3", "y = 0"]),
          answer: "x = 3",
          explanationAr: "خط التقارب الرأسي عند جذور المقام x - 3 = 0",
          explanationEn: "Vertical asymptote at denominator roots x - 3 = 0",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
      ],
    },
    {
      titleAr: "الدوال الأسية واللوغاريتمية",
      titleEn: "Exponential and Logarithmic Functions",
      slug: "exponential-logarithmic-functions",
      descriptionAr: "دراسة الدوال الأسية واللوغاريتمية وخصائصها",
      descriptionEn: "Study of exponential and logarithmic functions and properties",
      introductionAr: "الدالة الأسية هي دالة يكون فيها المتغير في الأس. الدالة اللوغاريتمية هي الدالة العكسية للدالة الأسية.",
      introductionEn: "An exponential function has the variable in the exponent. A logarithmic function is the inverse of an exponential function.",
      summaryAr: "aˣ × aʸ = aˣ⁺ʸ، log_a(xy) = log_a(x) + log_a(y)، log_a(aˣ) = x",
      summaryEn: "aˣ × aʸ = aˣ⁺ʸ، log_a(xy) = log_a(x) + log_a(y)، log_a(aˣ) = x",
      duration: 45,
      order: 4,
      isFree: false,
      objectives: [
        { textAr: "فهم خصائص الدوال الأسية", textEn: "Understand exponential function properties", order: 1 },
        { textAr: "فهم خصائص الدوال اللوغاريتمية", textEn: "Understand logarithmic function properties", order: 2 },
        { textAr: "حل المعادلات الأسية واللوغاريتمية", textEn: "Solve exponential and logarithmic equations", order: 3 },
      ],
      concepts: [
        { termAr: "الدالة الأسية", termEn: "Exponential Function", definitionAr: "دالة على صورة f(x) = aˣ", definitionEn: "Function in form f(x) = aˣ", order: 1 },
        { termAr: "اللوغاريتم", termEn: "Logarithm", definitionAr: "الأس الذي نرفع إليه الأساس للحصول على العدد", definitionEn: "Exponent to raise base to get the number", order: 2 },
        { termAr: "الأساس الطبيعي e", termEn: "Natural Base e", definitionAr: "عدد أويلر e ≈ 2.718", definitionEn: "Euler's number e ≈ 2.718", order: 3 },
      ],
      formulas: [
        { formula: "aˣ × aʸ = aˣ⁺ʸ", explanationAr: "حاصل ضرب الأسس", explanationEn: "Product of exponents", order: 1 },
        { formula: "log_a(xy) = log_a(x) + log_a(y)", explanationAr: "لوغاريتم حاصل الضرب", explanationEn: "Logarithm of product", order: 2 },
        { formula: "log_a(xⁿ) = n × log_a(x)", explanationAr: "لوغاريتم الأس", explanationEn: "Logarithm of power", order: 3 },
      ],
      examples: [
        {
          questionAr: "احسب: log₂(8) + log₂(4)",
          questionEn: "Calculate: log₂(8) + log₂(4)",
          solutionAr: "log₂(8) = 3، log₂(4) = 2\nlog₂(8) + log₂(4) = 3 + 2 = 5",
          solutionEn: "log₂(8) = 3, log₂(4) = 2\nlog₂(8) + log₂(4) = 3 + 2 = 5",
          stepsAr: "1. 8 = 2³ → log₂(8) = 3\n2. 4 = 2² → log₂(4) = 2\n3. المجموع = 5",
          stepsEn: "1. 8 = 2³ → log₂(8) = 3\n2. 4 = 2² → log₂(4) = 2\n3. Sum = 5",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما قيمة log₁₀(100)؟",
          questionEn: "What is the value of log₁₀(100)?",
          optionsAr: JSON.stringify(["2", "10", "100", "1"]),
          optionsEn: JSON.stringify(["2", "10", "100", "1"]),
          answer: "2",
          explanationAr: "log₁₀(100) = 2 لأن 10² = 100",
          explanationEn: "log₁₀(100) = 2 because 10² = 100",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
      ],
    },
    {
      titleAr: "تحليل الدوال وتمثيلها البياني",
      titleEn: "Function Analysis and Graphing",
      slug: "function-analysis-graphing",
      descriptionAr: "دراسة طرق تحليل الدوال وتمثيلها البياني",
      descriptionEn: "Study of function analysis methods and graphing",
      introductionAr: "تحليل الدالة يتضمن دراسة المجال والمدى والنقاط الحرجة والتقعر وخطوط التقارب.",
      introductionEn: "Function analysis includes studying domain, range, critical points, concavity, and asymptotes.",
      summaryAr: "نقاط الانقلاب عند تغير التقعر. القيم العظمى والصغرى عند النقاط الحرجة.",
      summaryEn: "Inflection points at concavity change. Maximum and minimum values at critical points.",
      duration: 45,
      order: 5,
      isFree: false,
      objectives: [
        { textAr: "تحليل سلوك الدالة", textEn: "Analyze function behavior", order: 1 },
        { textAr: "إيجاد القيم العظمى والصغرى", textEn: "Find maximum and minimum values", order: 2 },
        { textAr: "رسم الدالة بدقة", textEn: "Graph function accurately", order: 3 },
      ],
      concepts: [
        { termAr: "النقطة الحرجة", termEn: "Critical Point", definitionAr: "نقطة يكون فيها المشتقة صفر أو غير موجودة", definitionEn: "Point where derivative is zero or undefined", order: 1 },
        { termAr: "التقعر", termEn: "Concavity", definitionAr: "اتجاه انحناء المنحنى", definitionEn: "Direction of curve bending", order: 2 },
        { termAr: "نقطة الانقلاب", termEn: "Inflection Point", definitionAr: "نقطة يتغير فيها التقعر", definitionEn: "Point where concavity changes", order: 3 },
      ],
      formulas: [
        { formula: "f'(x) = 0", explanationAr: "شرط النقطة الحرجة", explanationEn: "Critical point condition", order: 1 },
        { formula: "f''(x) > 0 → تقعر لأعلى", explanationAr: "شرط التقعر", explanationEn: "Concavity condition", order: 2 },
      ],
      examples: [
        {
          questionAr: "أوجد القيمة العظمى والصغرى للدالة f(x) = x³ - 3x²",
          questionEn: "Find max and min values for f(x) = x³ - 3x²",
          solutionAr: "f'(x) = 3x² - 6x = 3x(x-2)\nالنقاط الحرجة: x = 0, x = 2",
          solutionEn: "f'(x) = 3x² - 6x = 3x(x-2)\nCritical points: x = 0, x = 2",
          stepsAr: "1. f'(x) = 3x² - 6x = 0\n2. x(3x - 6) = 0\n3. x = 0 أو x = 2",
          stepsEn: "1. f'(x) = 3x² - 6x = 0\n2. x(3x - 6) = 0\n3. x = 0 or x = 2",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ماذا يدل f''(x) > 0 على الدالة؟",
          questionEn: "What does f''(x) > 0 indicate about the function?",
          optionsAr: JSON.stringify(["تقعر لأعلى", "تقعر لأسفل", "نقطة انقلاب", "قيمة عظمى"]),
          optionsEn: JSON.stringify(["Concave up", "Concave down", "Inflection point", "Maximum value"]),
          answer: "تقعر لأعلى",
          explanationAr: "المشتقة الثانية الموجبة تدل على تقعر لأعلى",
          explanationEn: "Positive second derivative indicates concave up",
          points: 1,
          difficulty: "medium",
          order: 1,
        },
      ],
    },
  ],
  // كيمياء - التحولات الكيميائية
  "chemistry-2-science-unit-1": [
    {
      titleAr: "سرعة التفاعل الكيميائي",
      titleEn: "Chemical Reaction Rate",
      slug: "chemical-reaction-rate",
      descriptionAr: "دراسة سرعة التفاعل الكيميائي والعوامل المؤثرة عليها",
      descriptionEn: "Study of chemical reaction rate and factors affecting it",
      introductionAr: "سرعة التفاعل هي التغير في تركيز المتفاعلات أو النواتج في وحدة الزمن. تتأثر بعدة عوامل مثل التركيز ودرجة الحرارة.",
      introductionEn: "Reaction rate is the change in concentration of reactants or products per unit time. It is affected by factors like concentration and temperature.",
      summaryAr: "v = Δ[ناتج]/Δt = -Δ[متفاعل]/Δt. العوامل: التركيز، الحرارة، المساحة، العوامل الحفازة.",
      summaryEn: "v = Δ[product]/Δt = -Δ[reactant]/Δt. Factors: concentration, temperature, surface area, catalysts.",
      duration: 45,
      order: 1,
      isFree: true,
      objectives: [
        { textAr: "فهم مفهوم سرعة التفاعل", textEn: "Understand reaction rate concept", order: 1 },
        { textAr: "معرفة العوامل المؤثرة على السرعة", textEn: "Know factors affecting rate", order: 2 },
        { textAr: "حساب سرعة التفاعل", textEn: "Calculate reaction rate", order: 3 },
      ],
      concepts: [
        { termAr: "سرعة التفاعل", termEn: "Reaction Rate", definitionAr: "التغير في تركيز المواد في وحدة الزمن", definitionEn: "Change in substance concentration per unit time", order: 1 },
        { termAr: "طاقة التنشيط", termEn: "Activation Energy", definitionAr: "الحد الأدنى من الطاقة اللازمة للتفاعل", definitionEn: "Minimum energy needed for reaction", order: 2 },
        { termAr: "العامل الحفاز", termEn: "Catalyst", definitionAr: "مادة تزيد سرعة التفاعل دون أن تستهلك", definitionEn: "Substance that increases rate without being consumed", order: 3 },
      ],
      formulas: [
        { formula: "v = ΔC / Δt", explanationAr: "قانون سرعة التفاعل", explanationEn: "Reaction rate law", order: 1 },
        { formula: "v = k[A]ᵐ[B]ⁿ", explanationAr: "قانون سرعة التفاعل لرتبة معينة", explanationEn: "Rate law for specific order", order: 2 },
      ],
      examples: [
        {
          questionAr: "إذا زاد تركيز المادة A من 0.5M إلى 0.3M خلال 10 ثوان، احسب سرعة التفاعل",
          questionEn: "If A concentration decreases from 0.5M to 0.3M in 10 seconds, calculate reaction rate",
          solutionAr: "v = -Δ[A]/Δt = -(0.3-0.5)/10 = 0.02 M/s",
          solutionEn: "v = -Δ[A]/Δt = -(0.3-0.5)/10 = 0.02 M/s",
          stepsAr: "1. Δ[A] = 0.3 - 0.5 = -0.2 M\n2. Δt = 10 s\n3. v = -(-0.2)/10 = 0.02 M/s",
          stepsEn: "1. Δ[A] = 0.3 - 0.5 = -0.2 M\n2. Δt = 10 s\n3. v = -(-0.2)/10 = 0.02 M/s",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما تأثير زيادة درجة الحرارة على سرعة التفاعل؟",
          questionEn: "What is the effect of increasing temperature on reaction rate?",
          optionsAr: JSON.stringify(["تزداد السرعة", "تقل السرعة", "لا تتأثر", "تتوقف"]),
          optionsEn: JSON.stringify(["Rate increases", "Rate decreases", "No effect", "Stops"]),
          answer: "تزداد السرعة",
          explanationAr: "زيادة الحرارة تزيد طاقة الجزيئات فتزيد سرعة التفاعل",
          explanationEn: "Increasing temperature increases molecular energy thus reaction rate",
          points: 1,
          difficulty: "easy",
          order: 1,
        },
      ],
    },
    {
      titleAr: "قانون سرعة التفاعل",
      titleEn: "Rate Law",
      slug: "rate-law",
      descriptionAr: "دراسة قانون سرعة التفاعل ورتبة التفاعل",
      descriptionEn: "Study of rate law and reaction order",
      introductionAr: "قانون سرعة التفاعل يربط بين سرعة التفاعل وتركيز المتفاعلات. رتبة التفاعل تحدد كيف تتغير السرعة مع التركيز.",
      introductionEn: "Rate law relates reaction rate to reactant concentrations. Reaction order determines how rate changes with concentration.",
      summaryAr: "v = k[A]ᵐ[B]ⁿ حيث m+n هي رتبة التفاعل الكلية",
      summaryEn: "v = k[A]ᵐ[B]ⁿ where m+n is overall reaction order",
      duration: 45,
      order: 2,
      isFree: false,
      objectives: [
        { textAr: "فهم قانون سرعة التفاعل", textEn: "Understand rate law", order: 1 },
        { textAr: "تحديد رتبة التفاعل", textEn: "Determine reaction order", order: 2 },
        { textAr: "حساب ثابت السرعة", textEn: "Calculate rate constant", order: 3 },
      ],
      concepts: [
        { termAr: "رتبة التفاعل", termEn: "Reaction Order", definitionAr: "الأس الأسي لتركيز المتفاعل في قانون السرعة", definitionEn: "Exponent of reactant concentration in rate law", order: 1 },
        { termAr: "ثابت السرعة", termEn: "Rate Constant", definitionAr: "ثابت التناسب في قانون سرعة التفاعل", definitionEn: "Proportionality constant in rate law", order: 2 },
      ],
      formulas: [
        { formula: "v = k[A]ᵐ", explanationAr: "قانون السرعة للتفاعل من الرتبة m", explanationEn: "Rate law for reaction of order m", order: 1 },
        { formula: "t₁/₂ = 0.693/k (للرتبة الأولى)", explanationAr: "زمن النصف للتفاعل من الرتبة الأولى", explanationEn: "Half-life for first order reaction", order: 2 },
      ],
      examples: [
        {
          questionAr: "تفاعل من الرتبة الأولى، ثابت السرعة k = 0.1 s⁻¹. احسب زمن النصف",
          questionEn: "First order reaction, rate constant k = 0.1 s⁻¹. Calculate half-life",
          solutionAr: "t₁/₂ = 0.693/0.1 = 6.93 s",
          solutionEn: "t₁/₂ = 0.693/0.1 = 6.93 s",
          stepsAr: "1. نطبق قانون زمن النصف\n2. t₁/₂ = 0.693/0.1 = 6.93 s",
          stepsEn: "1. Apply half-life formula\n2. t₁/₂ = 0.693/0.1 = 6.93 s",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما وحدة ثابت السرعة للتفاعل من الرتبة الثانية؟",
          questionEn: "What is the unit of rate constant for second order reaction?",
          optionsAr: JSON.stringify(["M⁻¹s⁻¹", "s⁻¹", "M/s", "M²/s"]),
          optionsEn: JSON.stringify(["M⁻¹s⁻¹", "s⁻¹", "M/s", "M²/s"]),
          answer: "M⁻¹s⁻¹",
          explanationAr: "وحدة ثابت السرعة للرتبة الثانية هي M⁻¹s⁻¹",
          explanationEn: "Rate constant unit for second order is M⁻¹s⁻¹",
          points: 1,
          difficulty: "hard",
          order: 1,
        },
      ],
    },
    {
      titleAr: "نظرية التصادم",
      titleEn: "Collision Theory",
      slug: "collision-theory",
      descriptionAr: "دراسة نظرية التصادم وتفسير التفاعلات الكيميائية",
      descriptionEn: "Study of collision theory and explanation of chemical reactions",
      introductionAr: "تنص نظرية التصادم على أن التفاعل الكيميائي يحدث عندما تتصادم الجزيئات بطاقة كافية واتجاه صحيح.",
      introductionEn: "Collision theory states that chemical reaction occurs when molecules collide with sufficient energy and proper orientation.",
      summaryAr: "التصادم الناجح يتطلب: طاقة ≥ طاقة التنشيط، اتجاه صحيح",
      summaryEn: "Successful collision requires: energy ≥ activation energy, proper orientation",
      duration: 45,
      order: 3,
      isFree: false,
      objectives: [
        { textAr: "فهم نظرية التصادم", textEn: "Understand collision theory", order: 1 },
        { textAr: "ربط النظرية بالعوامل المؤثرة على السرعة", textEn: "Relate theory to rate factors", order: 2 },
        { textAr: "تفسير تأثير العوامل الحفازة", textEn: "Explain catalyst effect", order: 3 },
      ],
      concepts: [
        { termAr: "التصادم الناجح", termEn: "Successful Collision", definitionAr: "تصادم يؤدي إلى تفاعل كيميائي", definitionEn: "Collision leading to chemical reaction", order: 1 },
        { termAr: "المعقد المنشط", termEn: "Activated Complex", definitionAr: "حالة انتقالية غير مستقرة أثناء التفاعل", definitionEn: "Unstable transition state during reaction", order: 2 },
      ],
      formulas: [
        { formula: "f = e^(-Ea/RT)", explanationAr: "الكسر المولي للجزيئات ذات الطاقة الكافية", explanationEn: "Mole fraction of molecules with sufficient energy", order: 1 },
      ],
      examples: [
        {
          questionAr: "اشرح كيف يزيد العامل الحفاز من سرعة التفاعل",
          questionEn: "Explain how catalyst increases reaction rate",
          solutionAr: "العامل الحفاز يقلل طاقة التنشيط مما يزيد عدد التصادمات الناجحة",
          solutionEn: "Catalyst reduces activation energy increasing number of successful collisions",
          stepsAr: "1. العامل الحفاز يوفر مسار بديل\n2. المسار البديل بطاقة تنشيط أقل\n3. عدد أكبر من الجزيئات تملك الطاقة الكافية",
          stepsEn: "1. Catalyst provides alternative pathway\n2. Alternative pathway with lower activation energy\n3. More molecules have sufficient energy",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما الشرطان اللازمان للتصادم الناجح؟",
          questionEn: "What are the two requirements for successful collision?",
          optionsAr: JSON.stringify(["طاقة كافية واتجاه صحيح", "حرارة عالية وضغط عالي", "تركيز عالي وحجم صغير", "وقت طويل ومساحة كبيرة"]),
          optionsEn: JSON.stringify(["Sufficient energy and proper orientation", "High temperature and high pressure", "High concentration and small volume", "Long time and large area"]),
          answer: "طاقة كافية واتجاه صحيح",
          explanationAr: "التصادم الناجح يحتاج طاقة ≥ طاقة التنشيط واتجاه مناسب",
          explanationEn: "Successful collision needs energy ≥ activation energy and proper orientation",
          points: 1,
          difficulty: "medium",
          order: 1,
        },
      ],
    },
    {
      titleAr: "تفاعلات الأكسدة والاختزال",
      titleEn: "Oxidation-Reduction Reactions",
      slug: "oxidation-reduction-reactions",
      descriptionAr: "دراسة تفاعلات الأكسدة والاختزال وتوازنها",
      descriptionEn: "Study of oxidation-reduction reactions and balancing",
      introductionAr: "تفاعلات الأكسدة والاختزال هي تفاعلات يحدث فيها انتقال للإلكترونات بين المتفاعلات.",
      introductionEn: "Oxidation-reduction reactions involve electron transfer between reactants.",
      summaryAr: "الأكسدة: فقدان إلكترونات. الاختزال: اكتساب إلكترونات. عدد الأكسدة يتغير.",
      summaryEn: "Oxidation: loss of electrons. Reduction: gain of electrons. Oxidation number changes.",
      duration: 45,
      order: 4,
      isFree: false,
      objectives: [
        { textAr: "فهم مفهوم عدد الأكسدة", textEn: "Understand oxidation number concept", order: 1 },
        { textAr: "تحديد العامل المؤكسد والعامل المختزل", textEn: "Identify oxidizing and reducing agents", order: 2 },
        { textAr: "توازن تفاعلات الأكسدة والاختزال", textEn: "Balance redox reactions", order: 3 },
      ],
      concepts: [
        { termAr: "عدد الأكسدة", termEn: "Oxidation Number", definitionAr: "الشحنة التي تبدو على الذرة في المركب", definitionEn: "Charge that appears on atom in compound", order: 1 },
        { termAr: "العامل المؤكسد", termEn: "Oxidizing Agent", definitionAr: "المادة التي تكتسب إلكترونات", definitionEn: "Substance that gains electrons", order: 2 },
        { termAr: "العامل المختزل", termEn: "Reducing Agent", definitionAr: "المادة التي تفقد إلكترونات", definitionEn: "Substance that loses electrons", order: 3 },
      ],
      formulas: [
        { formula: "2Na + Cl₂ → 2NaCl", explanationAr: "مثال على تفاعل أكسدة-اختزال", explanationEn: "Example of redox reaction", order: 1 },
      ],
      examples: [
        {
          questionAr: "حدد العامل المؤكسد والمختزل في: Zn + CuSO₄ → ZnSO₄ + Cu",
          questionEn: "Identify oxidizing and reducing agents in: Zn + CuSO₄ → ZnSO₄ + Cu",
          solutionAr: "Zn يزداد عدد أكسدته: عامل مختزل\nCu يقل عدد أكسدته: عامل مؤكسد",
          solutionEn: "Zn oxidation number increases: reducing agent\nCu oxidation number decreases: oxidizing agent",
          stepsAr: "1. Zn: 0 → +2 (أكسدة - عامل مختزل)\n2. Cu: +2 → 0 (اختزال - عامل مؤكسد)",
          stepsEn: "1. Zn: 0 → +2 (oxidation - reducing agent)\n2. Cu: +2 → 0 (reduction - oxidizing agent)",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ماذا يحدث للعامل المختزل في تفاعل الأكسدة-الاختزال؟",
          questionEn: "What happens to the reducing agent in redox reaction?",
          optionsAr: JSON.stringify(["يفقد إلكترونات (تأكسد)", "يكتسب إلكترونات (يختزل)", "لا يتغير", "يتحلل"]),
          optionsEn: JSON.stringify(["Loses electrons (oxidized)", "Gains electrons (reduced)", "No change", "Decomposes"]),
          answer: "يفقد إلكترونات (تأكسد)",
          explanationAr: "العامل المختزل يفقد إلكترونات ويتأكسد",
          explanationEn: "Reducing agent loses electrons and gets oxidized",
          points: 1,
          difficulty: "medium",
          order: 1,
        },
      ],
    },
    {
      titleAr: "الخلايا الكهروكيميائية",
      titleEn: "Electrochemical Cells",
      slug: "electrochemical-cells",
      descriptionAr: "دراسة الخلايا الكهروكيميائية والخلايا الجلفانية",
      descriptionEn: "Study of electrochemical cells and galvanic cells",
      introductionAr: "الخلية الكهروكيميائية تحول الطاقة الكيميائية إلى طاقة كهربائية أو العكس.",
      introductionEn: "Electrochemical cell converts chemical energy to electrical energy or vice versa.",
      summaryAr: "الأنود: قطب الأكسدة. الكاثود: قطب الاختزال. القطب القياسي للهيدروجين = 0V",
      summaryEn: "Anode: oxidation electrode. Cathode: reduction electrode. Standard hydrogen electrode = 0V",
      duration: 45,
      order: 5,
      isFree: false,
      objectives: [
        { textAr: "فهم مبدأ عمل الخلية الجلفانية", textEn: "Understand galvanic cell principle", order: 1 },
        { textAr: "حساب القوة الدافعة الكهربائية", textEn: "Calculate electromotive force", order: 2 },
        { textAr: "كتابة رموز الخلايا", textEn: "Write cell notation", order: 3 },
      ],
      concepts: [
        { termAr: "الخلية الجلفانية", termEn: "Galvanic Cell", definitionAr: "خلية تحول الطاقة الكيميائية إلى كهربائية", definitionEn: "Cell converting chemical to electrical energy", order: 1 },
        { termAr: "جهد القطب", termEn: "Electrode Potential", definitionAr: "الجهد الناتج عن تفاعل القطب", definitionEn: "Voltage produced by electrode reaction", order: 2 },
        { termAr: "الجسر الملحي", termEn: "Salt Bridge", definitionAr: "وصلة تسمح بمرور الأيونات", definitionEn: "Connection allowing ion flow", order: 3 },
      ],
      formulas: [
        { formula: "E°cell = E°cathode - E°anode", explanationAr: "الجهد القياسي للخلية", explanationEn: "Standard cell potential", order: 1 },
        { formula: "Zn|Zn²⁺||Cu²⁺|Cu", explanationAr: "رمز خلية دانيال", explanationEn: "Daniell cell notation", order: 2 },
      ],
      examples: [
        {
          questionAr: "احسب جهد خلية دانيال إذا كان E°(Cu²⁺/Cu) = +0.34V و E°(Zn²⁺/Zn) = -0.76V",
          questionEn: "Calculate Daniell cell voltage if E°(Cu²⁺/Cu) = +0.34V and E°(Zn²⁺/Zn) = -0.76V",
          solutionAr: "E°cell = 0.34 - (-0.76) = 1.10V",
          solutionEn: "E°cell = 0.34 - (-0.76) = 1.10V",
          stepsAr: "1. Cu هو الكاثود (اختزال)\n2. Zn هو الأنود (أكسدة)\n3. E°cell = 0.34 + 0.76 = 1.10V",
          stepsEn: "1. Cu is cathode (reduction)\n2. Zn is anode (oxidation)\n3. E°cell = 0.34 + 0.76 = 1.10V",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "ما هو الأنود في الخلية الجلفانية؟",
          questionEn: "What is the anode in a galvanic cell?",
          optionsAr: JSON.stringify(["قطب الأكسدة", "قطب الاختزال", "القطب الموجب", "الجسر الملحي"]),
          optionsEn: JSON.stringify(["Oxidation electrode", "Reduction electrode", "Positive electrode", "Salt bridge"]),
          answer: "قطب الأكسادة",
          explanationAr: "الأنود هو القطب الذي يحدث عنده تفاعل الأكسدة",
          explanationEn: "Anode is the electrode where oxidation occurs",
          points: 1,
          difficulty: "medium",
          order: 1,
        },
      ],
    },
  ],
};

// ==================== دالة إنشاء الدروس الافتراضية ====================
function generateDefaultLessons(subjectSlug: string, unitSlug: string, unitOrder: number, lessonsPerUnit: number, isScientific: boolean): LessonContent[] {
  const lessons: LessonContent[] = [];
  
  for (let i = 1; i <= lessonsPerUnit; i++) {
    const lessonSlug = `${unitSlug}-lesson-${i}`;
    const lessonOrder = (unitOrder - 1) * lessonsPerUnit + i;
    
    lessons.push({
      titleAr: `الدرس ${i} من الوحدة ${unitOrder}`,
      titleEn: `Lesson ${i} of Unit ${unitOrder}`,
      slug: lessonSlug,
      descriptionAr: `محتوى الدرس ${i} من الوحدة ${unitOrder} في مادة ${subjectSlug}`,
      descriptionEn: `Content of Lesson ${i} from Unit ${unitOrder} in subject ${subjectSlug}`,
      introductionAr: `مقدمة الدرس ${i}: يغطي هذا الدرس المفاهيم الأساسية والمهارات المطلوبة في هذا الجزء من المنهج الدراسي.`,
      introductionEn: `Introduction to Lesson ${i}: This lesson covers the basic concepts and skills required in this part of the curriculum.`,
      summaryAr: `ملخص الدرس ${i}: تم في هذا الدرس دراسة المفاهيم الأساسية والتطبيقات العملية.`,
      summaryEn: `Summary of Lesson ${i}: This lesson covered basic concepts and practical applications.`,
      duration: 45,
      order: lessonOrder,
      isFree: i === 1, // الدرس الأول مجاني
      objectives: [
        { textAr: "فهم المفاهيم الأساسية للدرس", textEn: "Understand basic concepts of the lesson", order: 1 },
        { textAr: "تطبيق المهارات المكتسبة", textEn: "Apply acquired skills", order: 2 },
        { textAr: "حل المسائل والتدريبات", textEn: "Solve problems and exercises", order: 3 },
      ],
      concepts: [
        { termAr: "المفهوم الأول", termEn: "First Concept", definitionAr: "تعريف المفهوم الأول", definitionEn: "Definition of first concept", order: 1 },
        { termAr: "المفهوم الثاني", termEn: "Second Concept", definitionAr: "تعريف المفهوم الثاني", definitionEn: "Definition of second concept", order: 2 },
      ],
      formulas: isScientific ? [
        { formula: "F = ma", explanationAr: "قانون نيوتن الثاني", explanationEn: "Newton's Second Law", order: 1 },
      ] : undefined,
      examples: [
        {
          questionAr: "مثال تطبيقي على محتوى الدرس",
          questionEn: "Practical example on lesson content",
          solutionAr: "الحل التفصيلي للمثال",
          solutionEn: "Detailed solution of the example",
          stepsAr: "الخطوة 1: تحليل المسألة\nالخطوة 2: تطبيق القانون\nالخطوة 3: الوصول للحل",
          stepsEn: "Step 1: Analyze the problem\nStep 2: Apply the formula\nStep 3: Reach the solution",
          order: 1,
        },
      ],
      questions: [
        {
          type: "multiple_choice",
          questionAr: "سؤال اختيار من متعدد على محتوى الدرس",
          questionEn: "Multiple choice question on lesson content",
          optionsAr: JSON.stringify(["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"]),
          optionsEn: JSON.stringify(["First option", "Second option", "Third option", "Fourth option"]),
          answer: "الخيار الأول",
          explanationAr: "شرح الإجابة الصحيحة",
          explanationEn: "Explanation of correct answer",
          points: 1,
          difficulty: "medium",
          order: 1,
        },
      ],
    });
  }
  
  return lessons;
}

// ==================== الدالة الرئيسية ====================
async function main() {
  console.log("🚀 Starting Second Year Seeding...");
  console.log("=" .repeat(50));

  // 1. إنشاء السنة الدراسية
  console.log("\n📚 Creating Academic Year...");
  const academicYear = await prisma.academicYear.upsert({
    where: { code: "second-year" },
    update: { nameAr: "الصف الثاني الثانوي", nameEn: "Second Year Secondary", order: 2 },
    create: { nameAr: "الصف الثاني الثانوي", nameEn: "Second Year Secondary", code: "second-year", order: 2 },
  });
  console.log(`✅ Academic Year: ${academicYear.nameAr}`);

  // 2. إنشاء التخصصات
  console.log("\n🎓 Creating Specializations...");
  const specializations: Record<string, { id: string }> = {};
  for (const spec of specializationsData) {
    const created = await prisma.specialization.upsert({
      where: { code: spec.code },
      update: spec,
      create: spec,
    });
    specializations[spec.code] = created;
    console.log(`   ✅ ${spec.nameAr}`);
  }

  // 3. إنشاء المواد الدراسية
  console.log("\n📖 Creating Subjects...");
  
  const allSubjects = [
    { specCode: "science", subjects: scienceSubjects },
    { specCode: "math", subjects: mathSubjects },
    { specCode: "arts", subjects: artsSubjects },
  ];

  let totalSubjects = 0;
  let totalUnits = 0;
  let totalLessons = 0;
  let totalObjectives = 0;
  let totalConcepts = 0;
  let totalFormulas = 0;
  let totalExamples = 0;
  let totalQuestions = 0;

  for (const { specCode, subjects } of allSubjects) {
    const specId = specializations[specCode].id;
    console.log(`\n   📂 ${specCode === "science" ? "علمي علوم" : specCode === "math" ? "علمي رياضة" : "أدبي"}:`);
    
    for (const subject of subjects) {
      // إنشاء المادة
      const createdSubject = await prisma.subject.upsert({
        where: { slug: subject.slug },
        update: {
          nameAr: subject.nameAr,
          nameEn: subject.nameEn,
          icon: subject.icon,
          color: subject.color,
          order: subject.order,
          yearId: academicYear.id,
          specializationId: specId,
          isCommon: false,
        },
        create: {
          nameAr: subject.nameAr,
          nameEn: subject.nameEn,
          slug: subject.slug,
          icon: subject.icon,
          color: subject.color,
          order: subject.order,
          yearId: academicYear.id,
          specializationId: specId,
          isCommon: false,
        },
      });
      totalSubjects++;
      console.log(`      ✅ ${subject.nameAr}`);

      // إنشاء الوحدات
      const unitList = unitsData[subject.slug] || [];
      for (let u = 0; u < unitList.length; u++) {
        const unitData = unitList[u];
        const createdUnit = await prisma.unit.upsert({
          where: { slug: unitData.slug },
          update: {
            nameAr: unitData.nameAr,
            nameEn: unitData.nameEn,
            order: u + 1,
            subjectId: createdSubject.id,
          },
          create: {
            nameAr: unitData.nameAr,
            nameEn: unitData.nameEn,
            slug: unitData.slug,
            order: u + 1,
            subjectId: createdSubject.id,
          },
        });
        totalUnits++;

        // إنشاء الدروس
        const lessons = lessonsContent[unitData.slug] || 
          generateDefaultLessons(subject.slug, unitData.slug, u + 1, subject.lessonsPerUnit, subject.isScientific || false);
        
        for (const lesson of lessons) {
          // التحقق من عدم وجود الدرس
          const existingLesson = await prisma.lesson.findUnique({
            where: { slug: lesson.slug },
          });
          
          if (existingLesson) continue;

          const createdLesson = await prisma.lesson.create({
            data: {
              titleAr: lesson.titleAr,
              titleEn: lesson.titleEn,
              slug: lesson.slug,
              descriptionAr: lesson.descriptionAr,
              descriptionEn: lesson.descriptionEn,
              introductionAr: lesson.introductionAr,
              introductionEn: lesson.introductionEn,
              summaryAr: lesson.summaryAr,
              summaryEn: lesson.summaryEn,
              duration: lesson.duration,
              order: lesson.order,
              isFree: lesson.isFree,
              unitId: createdUnit.id,
            },
          });
          totalLessons++;

          // إنشاء الأهداف
          for (const obj of lesson.objectives) {
            await prisma.objective.create({
              data: {
                lessonId: createdLesson.id,
                textAr: obj.textAr,
                textEn: obj.textEn,
                order: obj.order,
              },
            });
            totalObjectives++;
          }

          // إنشاء المفاهيم
          for (const concept of lesson.concepts) {
            await prisma.concept.create({
              data: {
                lessonId: createdLesson.id,
                termAr: concept.termAr,
                termEn: concept.termEn,
                definitionAr: concept.definitionAr,
                definitionEn: concept.definitionEn,
                order: concept.order,
              },
            });
            totalConcepts++;
          }

          // إنشاء القوانين (للمواد العلمية)
          if (lesson.formulas) {
            for (const formula of lesson.formulas) {
              await prisma.formula.create({
                data: {
                  lessonId: createdLesson.id,
                  formula: formula.formula,
                  explanationAr: formula.explanationAr,
                  explanationEn: formula.explanationEn,
                  order: formula.order,
                },
              });
              totalFormulas++;
            }
          }

          // إنشاء الأمثلة
          for (const example of lesson.examples) {
            await prisma.example.create({
              data: {
                lessonId: createdLesson.id,
                questionAr: example.questionAr,
                questionEn: example.questionEn,
                solutionAr: example.solutionAr,
                solutionEn: example.solutionEn,
                stepsAr: example.stepsAr,
                stepsEn: example.stepsEn,
                order: example.order,
              },
            });
            totalExamples++;
          }

          // إنشاء الأسئلة
          for (const question of lesson.questions) {
            await prisma.question.create({
              data: {
                lessonId: createdLesson.id,
                type: question.type,
                questionAr: question.questionAr,
                questionEn: question.questionEn,
                optionsAr: question.optionsAr,
                optionsEn: question.optionsEn,
                answer: question.answer,
                explanationAr: question.explanationAr,
                explanationEn: question.explanationEn,
                points: question.points,
                difficulty: question.difficulty,
                order: question.order,
              },
            });
            totalQuestions++;
          }
        }
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Seeding completed successfully!");
  console.log("\n📊 Statistics:");
  console.log(`   📚 Academic Years: 1`);
  console.log(`   🎓 Specializations: ${Object.keys(specializations).length}`);
  console.log(`   📖 Subjects: ${totalSubjects}`);
  console.log(`   📦 Units: ${totalUnits}`);
  console.log(`   📝 Lessons: ${totalLessons}`);
  console.log(`   🎯 Objectives: ${totalObjectives}`);
  console.log(`   💡 Concepts: ${totalConcepts}`);
  console.log(`   📐 Formulas: ${totalFormulas}`);
  console.log(`   📋 Examples: ${totalExamples}`);
  console.log(`   ❓ Questions: ${totalQuestions}`);
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
