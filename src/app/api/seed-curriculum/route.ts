import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ==================== الهيكل التعليمي المصري ====================

// السنوات الدراسية
const academicYears = [
  { nameAr: "الصف الأول الثانوي", nameEn: "First Year Secondary", code: "first-year", order: 1 },
  { nameAr: "الصف الثاني الثانوي", nameEn: "Second Year Secondary", code: "second-year", order: 2 },
  { nameAr: "الصف الثالث الثانوي", nameEn: "Third Year Secondary", code: "third-year", order: 3 },
];

// التخصصات
const specializations = [
  { 
    nameAr: "علمي رياضة", 
    nameEn: "Math Science", 
    code: "math-science", 
    descriptionAr: "شعبة العلوم الرياضية",
    descriptionEn: "Mathematical Sciences Division",
    order: 1 
  },
  { 
    nameAr: "علمي علوم", 
    nameEn: "Science", 
    code: "science", 
    descriptionAr: "شعبة العلوم",
    descriptionEn: "Sciences Division",
    order: 2 
  },
  { 
    nameAr: "أدبي", 
    nameEn: "Literary", 
    code: "literary", 
    descriptionAr: "الشعبة الأدبية",
    descriptionEn: "Literary Division",
    order: 3 
  },
];

// الفصل الدراسي
const semesters = [
  { nameAr: "الترم الأول", nameEn: "First Semester", code: "first", order: 1 },
  { nameAr: "الترم الثاني", nameEn: "Second Semester", code: "second", order: 2 },
];

// المواد حسب السنة والتخصص
const subjectsConfig: Record<string, {
  nameAr: string;
  nameEn: string;
  slug: string;
  icon: string;
  color: string;
  isCommon: boolean;
}[]> = {
  // الصف الأول الثانوي (مشترك لجميع التخصصات)
  "first-year": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-1", icon: "BookOpen", color: "#10b981", isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-1", icon: "Languages", color: "#3b82f6", isCommon: true },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "mathematics-1", icon: "Calculator", color: "#8b5cf6", isCommon: true },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-1", icon: "Atom", color: "#f59e0b", isCommon: true },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-1", icon: "FlaskConical", color: "#ef4444", isCommon: true },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-1", icon: "Leaf", color: "#22c55e", isCommon: true },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-1", icon: "Scroll", color: "#a855f7", isCommon: true },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-1", icon: "Map", color: "#14b8a6", isCommon: true },
  ],
  
  // الصف الثاني الثانوي - علمي رياضة
  "second-year-math-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-math", icon: "BookOpen", color: "#10b981", isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-math", icon: "Languages", color: "#3b82f6", isCommon: true },
    { nameAr: "الرياضيات (1)", nameEn: "Mathematics (1)", slug: "mathematics-2-1", icon: "Calculator", color: "#8b5cf6", isCommon: false },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-math", icon: "Atom", color: "#f59e0b", isCommon: false },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-math", icon: "FlaskConical", color: "#ef4444", isCommon: false },
  ],
  // الصف الثاني الثانوي - علمي علوم
  "second-year-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-sci", icon: "BookOpen", color: "#10b981", isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-sci", icon: "Languages", color: "#3b82f6", isCommon: true },
    { nameAr: "الرياضيات (1)", nameEn: "Mathematics (1)", slug: "mathematics-2-1-sci", icon: "Calculator", color: "#8b5cf6", isCommon: false },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-sci", icon: "Atom", color: "#f59e0b", isCommon: false },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-sci", icon: "FlaskConical", color: "#ef4444", isCommon: false },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-2", icon: "Leaf", color: "#22c55e", isCommon: false },
  ],
  // الصف الثاني الثانوي - أدبي
  "second-year-literary": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-lit", icon: "BookOpen", color: "#10b981", isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-lit", icon: "Languages", color: "#3b82f6", isCommon: true },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-2", icon: "Scroll", color: "#a855f7", isCommon: false },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-2", icon: "Map", color: "#14b8a6", isCommon: false },
  ],
  
  // الصف الثالث الثانوي - علمي رياضة
  "third-year-math-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-math", icon: "BookOpen", color: "#10b981", isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-math", icon: "Languages", color: "#3b82f6", isCommon: true },
    { nameAr: "الرياضيات (2)", nameEn: "Mathematics (2)", slug: "mathematics-3-2", icon: "Calculator", color: "#8b5cf6", isCommon: false },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-math", icon: "Atom", color: "#f59e0b", isCommon: false },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-math", icon: "FlaskConical", color: "#ef4444", isCommon: false },
  ],
  // الصف الثالث الثانوي - علمي علوم
  "third-year-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-sci", icon: "BookOpen", color: "#10b981", isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-sci", icon: "Languages", color: "#3b82f6", isCommon: true },
    { nameAr: "الرياضيات (2)", nameEn: "Mathematics (2)", slug: "mathematics-3-2-sci", icon: "Calculator", color: "#8b5cf6", isCommon: false },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-sci", icon: "Atom", color: "#f59e0b", isCommon: false },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-sci", icon: "FlaskConical", color: "#ef4444", isCommon: false },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-3", icon: "Leaf", color: "#22c55e", isCommon: false },
  ],
  // الصف الثالث الثانوي - أدبي
  "third-year-literary": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-lit", icon: "BookOpen", color: "#10b981", isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-lit", icon: "Languages", color: "#3b82f6", isCommon: true },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-3", icon: "Scroll", color: "#a855f7", isCommon: false },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-3", icon: "Map", color: "#14b8a6", isCommon: false },
  ],
};

// المحاكيات - 36 محاكي
const simulatorsConfig = [
  // فيزياء - الميكانيكا (12 محاكي)
  { nameAr: "محاكي الحركة المستقيمة", nameEn: "Linear Motion Simulator", slug: "linear-motion", type: "physics", descriptionAr: "محاكاة الحركة المستقيمة المنتظمة والمتغيرة", descriptionEn: "Simulate uniform and accelerated linear motion", difficulty: "beginner" },
  { nameAr: "محاكي السقوط الحر", nameEn: "Free Fall Simulator", slug: "free-fall", type: "physics", descriptionAr: "محاكاة السقوط الحر وتأثير الجاذبية", descriptionEn: "Simulate free fall and gravity effects", difficulty: "beginner" },
  { nameAr: "محاكي القوى", nameEn: "Forces Simulator", slug: "forces", type: "physics", descriptionAr: "محاكاة القوى ونتيجتها", descriptionEn: "Simulate forces and their resultant", difficulty: "intermediate" },
  { nameAr: "محاكي قوانين نيوتن", nameEn: "Newton's Laws Simulator", slug: "newton-laws", type: "physics", descriptionAr: "محاكاة قوانين نيوتن الثلاثة", descriptionEn: "Simulate Newton's three laws", difficulty: "intermediate" },
  { nameAr: "محاكي الطاقة", nameEn: "Energy Simulator", slug: "energy", type: "physics", descriptionAr: "محاكاة تحولات الطاقة", descriptionEn: "Simulate energy transformations", difficulty: "intermediate" },
  { nameAr: "محاكي الذبذبات", nameEn: "Oscillations Simulator", slug: "oscillations", type: "physics", descriptionAr: "محاكاة الحركة التوافقية البسيطة", descriptionEn: "Simulate simple harmonic motion", difficulty: "advanced" },
  { nameAr: "محاكي الموجات", nameEn: "Waves Simulator", slug: "waves", type: "physics", descriptionAr: "محاكاة الموجات المستعرضة والطولية", descriptionEn: "Simulate transverse and longitudinal waves", difficulty: "intermediate" },
  { nameAr: "محاكي الكهرباء الساكنة", nameEn: "Static Electricity Simulator", slug: "static-electricity", type: "physics", descriptionAr: "محاكاة الشحنات والمجالات الكهربائية", descriptionEn: "Simulate electric charges and fields", difficulty: "intermediate" },
  { nameAr: "محاكي الدوائر الكهربائية", nameEn: "Electric Circuits Simulator", slug: "electric-circuits", type: "physics", descriptionAr: "محاكاة الدوائر الكهربائية البسيطة والمركبة", descriptionEn: "Simulate simple and complex electric circuits", difficulty: "intermediate" },
  { nameAr: "محاكي المغناطيسية", nameEn: "Magnetism Simulator", slug: "magnetism", type: "physics", descriptionAr: "محاكاة المجالات المغناطيسية", descriptionEn: "Simulate magnetic fields", difficulty: "advanced" },
  { nameAr: "محاكي الضوء والمرايا", nameEn: "Light and Mirrors Simulator", slug: "light-mirrors", type: "physics", descriptionAr: "محاكاة انعكاس الضوء والمرايا", descriptionEn: "Simulate light reflection and mirrors", difficulty: "intermediate" },
  { nameAr: "محاكي العدسات", nameEn: "Lenses Simulator", slug: "lenses", type: "physics", descriptionAr: "محاكاة العدسات وتكوين الصور", descriptionEn: "Simulate lenses and image formation", difficulty: "intermediate" },
  
  // كيمياء (6 محاكيات)
  { nameAr: "محاكي بنية الذرة", nameEn: "Atomic Structure Simulator", slug: "atomic-structure", type: "chemistry", descriptionAr: "محاكاة بنية الذرة وتوزيع الإلكترونات", descriptionEn: "Simulate atomic structure and electron distribution", difficulty: "beginner" },
  { nameAr: "محاكي الجدول الدوري", nameEn: "Periodic Table Simulator", slug: "periodic-table", type: "chemistry", descriptionAr: "استكشاف الجدول الدوري التفاعلي", descriptionEn: "Interactive periodic table exploration", difficulty: "beginner" },
  { nameAr: "محاكي الروابط الكيميائية", nameEn: "Chemical Bonding Simulator", slug: "chemical-bonding", type: "chemistry", descriptionAr: "محاكاة أنواع الروابط الكيميائية", descriptionEn: "Simulate types of chemical bonds", difficulty: "intermediate" },
  { nameAr: "محاكي التفاعلات الكيميائية", nameEn: "Chemical Reactions Simulator", slug: "chemical-reactions", type: "chemistry", descriptionAr: "محاكاة التفاعلات الكيميائية", descriptionEn: "Simulate chemical reactions", difficulty: "intermediate" },
  { nameAr: "محاكي الأحماض والقواعد", nameEn: "Acids and Bases Simulator", slug: "acids-bases", type: "chemistry", descriptionAr: "محاكاة تفاعلات الأحماض والقواعد", descriptionEn: "Simulate acid-base reactions", difficulty: "intermediate" },
  { nameAr: "محاكي الكيمياء العضوية", nameEn: "Organic Chemistry Simulator", slug: "organic-chemistry", type: "chemistry", descriptionAr: "محاكاة المركبات العضوية", descriptionEn: "Simulate organic compounds", difficulty: "advanced" },
  
  // رياضيات (8 محاكيات)
  { nameAr: "محاكي الدوال", nameEn: "Functions Simulator", slug: "functions", type: "math", descriptionAr: "رسم وتحليل الدوال الرياضية", descriptionEn: "Plot and analyze mathematical functions", difficulty: "beginner" },
  { nameAr: "محاكي المثلثات", nameEn: "Trigonometry Simulator", slug: "trigonometry", type: "math", descriptionAr: "محاكاة الدوال المثلثية", descriptionEn: "Simulate trigonometric functions", difficulty: "intermediate" },
  { nameAr: "محاكي التفاضل", nameEn: "Differentiation Simulator", slug: "differentiation", type: "math", descriptionAr: "محاكاة المشتقات والتقديرات الخطية", descriptionEn: "Simulate derivatives and linear approximations", difficulty: "intermediate" },
  { nameAr: "محاكي التكامل", nameEn: "Integration Simulator", slug: "integration", type: "math", descriptionAr: "محاكاة التكامل المحدد وغير المحدد", descriptionEn: "Simulate definite and indefinite integrals", difficulty: "advanced" },
  { nameAr: "محاكي المصفوفات", nameEn: "Matrices Simulator", slug: "matrices", type: "math", descriptionAr: "محاكاة عمليات المصفوفات", descriptionEn: "Simulate matrix operations", difficulty: "intermediate" },
  { nameAr: "محاكي الهندسة الفراغية", nameEn: "3D Geometry Simulator", slug: "geometry-3d", type: "math", descriptionAr: "محاكاة الأشكال الهندسية الفراغية", descriptionEn: "Simulate 3D geometric shapes", difficulty: "intermediate" },
  { nameAr: "محاكي الاحتمالات", nameEn: "Probability Simulator", slug: "probability", type: "math", descriptionAr: "محاكاة التجارب العشوائية", descriptionEn: "Simulate random experiments", difficulty: "beginner" },
  { nameAr: "محاكي الإحصاء", nameEn: "Statistics Simulator", slug: "statistics", type: "math", descriptionAr: "محاكاة التحليل الإحصائي", descriptionEn: "Simulate statistical analysis", difficulty: "intermediate" },
  
  // أحياء (6 محاكيات)
  { nameAr: "محاكي الخلية", nameEn: "Cell Simulator", slug: "cell", type: "biology", descriptionAr: "محاكاة بنية الخلية ووظائفها", descriptionEn: "Simulate cell structure and functions", difficulty: "beginner" },
  { nameAr: "محاكي الانقسام الخلوي", nameEn: "Cell Division Simulator", slug: "cell-division", type: "biology", descriptionAr: "محاكاة الانقسام المتساوي والمنصف", descriptionEn: "Simulate mitosis and meiosis", difficulty: "intermediate" },
  { nameAr: "محاكي الوراثة", nameEn: "Genetics Simulator", slug: "genetics", type: "biology", descriptionAr: "محاكاة الوراثة وقوانين مندل", descriptionEn: "Simulate genetics and Mendel's laws", difficulty: "intermediate" },
  { nameAr: "محاكي DNA", nameEn: "DNA Simulator", slug: "dna", type: "biology", descriptionAr: "محاكاة بنية وتضاعف DNA", descriptionEn: "Simulate DNA structure and replication", difficulty: "advanced" },
  { nameAr: "محاكي الجهاز الهضمي", nameEn: "Digestive System Simulator", slug: "digestive-system", type: "biology", descriptionAr: "محاكاة الجهاز الهضمي", descriptionEn: "Simulate the digestive system", difficulty: "beginner" },
  { nameAr: "محاكي الجهاز الدوري", nameEn: "Circulatory System Simulator", slug: "circulatory-system", type: "biology", descriptionAr: "محاكاة الجهاز الدوري", descriptionEn: "Simulate the circulatory system", difficulty: "intermediate" },
  
  // جغرافيا (3 محاكيات)
  { nameAr: "محاكي الكرة الأرضية", nameEn: "Earth Globe Simulator", slug: "earth-globe", type: "geography", descriptionAr: "محاكاة الكرة الأرضية والخرائط", descriptionEn: "Simulate Earth globe and maps", difficulty: "beginner" },
  { nameAr: "محاكي المناخ", nameEn: "Climate Simulator", slug: "climate", type: "geography", descriptionAr: "محاكاة المناخ والعوامل المؤثرة فيه", descriptionEn: "Simulate climate and factors", difficulty: "intermediate" },
  { nameAr: "محاكي السكان", nameEn: "Population Simulator", slug: "population", type: "geography", descriptionAr: "محاكاة التوزيع السكاني", descriptionEn: "Simulate population distribution", difficulty: "beginner" },
  
  // تاريخ (2 محاكيات)
  { nameAr: "محاكي الخط الزمني", nameEn: "Timeline Simulator", slug: "timeline", type: "history", descriptionAr: "محاكاة الأحداث التاريخية على الخط الزمني", descriptionEn: "Simulate historical events on timeline", difficulty: "beginner" },
  { nameAr: "محاكي الحضارات", nameEn: "Civilizations Simulator", slug: "civilizations", type: "history", descriptionAr: "محاكاة الحضارات القديمة", descriptionEn: "Simulate ancient civilizations", difficulty: "intermediate" },
];

// وحدات الصف الأول الثانوي
const firstYearUnits: Record<string, { nameAr: string; nameEn: string; slug: string; order: number }[]> = {
  "physics-1": [
    { nameAr: "مقدمة في الفيزياء", nameEn: "Introduction to Physics", slug: "intro-physics", order: 1 },
    { nameAr: "الحركة والقوى", nameEn: "Motion and Forces", slug: "motion-forces", order: 2 },
    { nameAr: "الطاقة والشغل", nameEn: "Energy and Work", slug: "energy-work", order: 3 },
  ],
  "mathematics-1": [
    { nameAr: "الجبر الأساسي", nameEn: "Basic Algebra", slug: "algebra-basics", order: 1 },
    { nameAr: "الهندسة", nameEn: "Geometry", slug: "geometry-basics", order: 2 },
    { nameAr: "الإحصاء", nameEn: "Statistics", slug: "statistics-basics", order: 3 },
  ],
  "chemistry-1": [
    { nameAr: "مقدمة في الكيمياء", nameEn: "Introduction to Chemistry", slug: "intro-chemistry", order: 1 },
    { nameAr: "الذرة والجزيء", nameEn: "Atom and Molecule", slug: "atom-molecule", order: 2 },
    { nameAr: "التفاعلات الكيميائية", nameEn: "Chemical Reactions", slug: "chemical-reactions", order: 3 },
  ],
  "biology-1": [
    { nameAr: "الخلية", nameEn: "The Cell", slug: "cell-basics", order: 1 },
    { nameAr: "الكائنات الحية", nameEn: "Living Organisms", slug: "living-organisms", order: 2 },
  ],
  "arabic-1": [
    { nameAr: "القراءة والنصوص", nameEn: "Reading and Texts", slug: "reading-texts-1", order: 1 },
    { nameAr: "النحو", nameEn: "Grammar", slug: "grammar-1", order: 2 },
    { nameAr: "الأدب", nameEn: "Literature", slug: "literature-1", order: 3 },
  ],
  "english-1": [
    { nameAr: "القراءة", nameEn: "Reading", slug: "reading-1", order: 1 },
    { nameAr: "القواعد", nameEn: "Grammar", slug: "grammar-1", order: 2 },
    { nameAr: "الكتابة", nameEn: "Writing", slug: "writing-1", order: 3 },
  ],
};

// وحدات الصف الثاني الثانوي
const secondYearUnits: Record<string, { nameAr: string; nameEn: string; slug: string; order: number }[]> = {
  "physics-2-math": [
    { nameAr: "الكهرباء", nameEn: "Electricity", slug: "electricity", order: 1 },
    { nameAr: "المغناطيسية", nameEn: "Magnetism", slug: "magnetism", order: 2 },
    { nameAr: "الضوء", nameEn: "Light", slug: "light", order: 3 },
  ],
  "physics-2-sci": [
    { nameAr: "الكهرباء", nameEn: "Electricity", slug: "electricity", order: 1 },
    { nameAr: "المغناطيسية", nameEn: "Magnetism", slug: "magnetism", order: 2 },
  ],
  "chemistry-2-math": [
    { nameAr: "الجدول الدوري", nameEn: "Periodic Table", slug: "periodic-table", order: 1 },
    { nameAr: "الروابط الكيميائية", nameEn: "Chemical Bonds", slug: "chemical-bonds", order: 2 },
  ],
  "chemistry-2-sci": [
    { nameAr: "الجدول الدوري", nameEn: "Periodic Table", slug: "periodic-table", order: 1 },
    { nameAr: "الروابط الكيميائية", nameEn: "Chemical Bonds", slug: "chemical-bonds", order: 2 },
  ],
  "mathematics-2-math": [
    { nameAr: "المثلثات", nameEn: "Trigonometry", slug: "trigonometry", order: 1 },
    { nameAr: "التفاضل", nameEn: "Differentiation", slug: "differentiation", order: 2 },
    { nameAr: "التكامل", nameEn: "Integration", slug: "integration", order: 3 },
  ],
  "mathematics-2-sci": [
    { nameAr: "المثلثات", nameEn: "Trigonometry", slug: "trigonometry", order: 1 },
    { nameAr: "التفاضل", nameEn: "Differentiation", slug: "differentiation", order: 2 },
  ],
};

// وحدات الصف الثالث الثانوي
const thirdYearUnits: Record<string, { nameAr: string; nameEn: string; slug: string; order: number }[]> = {
  // فيزياء - علمي رياضة وعلوم
  "physics-3-math": [
    { nameAr: "الميكانيكا", nameEn: "Mechanics", slug: "mechanics-3-math", order: 1 },
    { nameAr: "الطاقة", nameEn: "Energy", slug: "energy-3-math", order: 2 },
    { nameAr: "الكهرباء التيارية", nameEn: "Current Electricity", slug: "current-electricity-3-math", order: 3 },
    { nameAr: "الفيزياء الحديثة", nameEn: "Modern Physics", slug: "modern-physics-3-math", order: 4 },
  ],
  "physics-3-sci": [
    { nameAr: "الميكانيكا", nameEn: "Mechanics", slug: "mechanics-3-sci", order: 1 },
    { nameAr: "الطاقة", nameEn: "Energy", slug: "energy-3-sci", order: 2 },
    { nameAr: "الكهرباء التيارية", nameEn: "Current Electricity", slug: "current-electricity-3-sci", order: 3 },
    { nameAr: "الفيزياء الحديثة", nameEn: "Modern Physics", slug: "modern-physics-3-sci", order: 4 },
  ],
  // كيمياء
  "chemistry-3-math": [
    { nameAr: "بنية الذرة", nameEn: "Atomic Structure", slug: "atomic-structure-3-math", order: 1 },
    { nameAr: "الروابط الكيميائية", nameEn: "Chemical Bonding", slug: "chemical-bonding-3-math", order: 2 },
    { nameAr: "التفاعلات الكيميائية", nameEn: "Chemical Reactions", slug: "chemical-reactions-3-math", order: 3 },
    { nameAr: "الكيمياء العضوية", nameEn: "Organic Chemistry", slug: "organic-chemistry-3-math", order: 4 },
  ],
  "chemistry-3-sci": [
    { nameAr: "بنية الذرة", nameEn: "Atomic Structure", slug: "atomic-structure-3-sci", order: 1 },
    { nameAr: "الروابط الكيميائية", nameEn: "Chemical Bonding", slug: "chemical-bonding-3-sci", order: 2 },
    { nameAr: "التفاعلات الكيميائية", nameEn: "Chemical Reactions", slug: "chemical-reactions-3-sci", order: 3 },
    { nameAr: "الكيمياء العضوية", nameEn: "Organic Chemistry", slug: "organic-chemistry-3-sci", order: 4 },
  ],
  // رياضيات
  "mathematics-3-2": [
    { nameAr: "التفاضل", nameEn: "Differentiation", slug: "differentiation-3", order: 1 },
    { nameAr: "التكامل", nameEn: "Integration", slug: "integration-3", order: 2 },
    { nameAr: "المثلثات", nameEn: "Trigonometry", slug: "trigonometry-3", order: 3 },
    { nameAr: "الهندسة الفراغية", nameEn: "3D Geometry", slug: "geometry-3d-3", order: 4 },
  ],
  "mathematics-3-2-sci": [
    { nameAr: "التفاضل", nameEn: "Differentiation", slug: "differentiation-3-sci", order: 1 },
    { nameAr: "التكامل", nameEn: "Integration", slug: "integration-3-sci", order: 2 },
    { nameAr: "المثلثات", nameEn: "Trigonometry", slug: "trigonometry-3-sci", order: 3 },
    { nameAr: "الهندسة الفراغية", nameEn: "3D Geometry", slug: "geometry-3d-3-sci", order: 4 },
  ],
  // أحياء
  "biology-3": [
    { nameAr: "الخلية والوراثة", nameEn: "Cell and Genetics", slug: "cell-genetics-3", order: 1 },
    { nameAr: "الجهاز الهضمي", nameEn: "Digestive System", slug: "digestive-system-3", order: 2 },
    { nameAr: "الجهاز الدوري", nameEn: "Circulatory System", slug: "circulatory-system-3", order: 3 },
    { nameAr: "الجهاز التنفسي", nameEn: "Respiratory System", slug: "respiratory-system-3", order: 4 },
  ],
  // عربي
  "arabic-3-math": [
    { nameAr: "القراءة والنصوص", nameEn: "Reading and Texts", slug: "reading-texts-3-math", order: 1 },
    { nameAr: "النحو", nameEn: "Grammar", slug: "grammar-3-math", order: 2 },
    { nameAr: "الأدب", nameEn: "Literature", slug: "literature-3-math", order: 3 },
  ],
  "arabic-3-sci": [
    { nameAr: "القراءة والنصوص", nameEn: "Reading and Texts", slug: "reading-texts-3-sci", order: 1 },
    { nameAr: "النحو", nameEn: "Grammar", slug: "grammar-3-sci", order: 2 },
    { nameAr: "الأدب", nameEn: "Literature", slug: "literature-3-sci", order: 3 },
  ],
  "arabic-3-lit": [
    { nameAr: "القراءة والنصوص", nameEn: "Reading and Texts", slug: "reading-texts-3-lit", order: 1 },
    { nameAr: "النحو", nameEn: "Grammar", slug: "grammar-3-lit", order: 2 },
    { nameAr: "الأدب", nameEn: "Literature", slug: "literature-3-lit", order: 3 },
    { nameAr: "البلاغة", nameEn: "Rhetoric", slug: "rhetoric-3-lit", order: 4 },
  ],
  // إنجليزي
  "english-3-math": [
    { nameAr: "القراءة", nameEn: "Reading", slug: "reading-3-math", order: 1 },
    { nameAr: "القواعد", nameEn: "Grammar", slug: "grammar-3-math", order: 2 },
    { nameAr: "الكتابة", nameEn: "Writing", slug: "writing-3-math", order: 3 },
  ],
  "english-3-sci": [
    { nameAr: "القراءة", nameEn: "Reading", slug: "reading-3-sci", order: 1 },
    { nameAr: "القواعد", nameEn: "Grammar", slug: "grammar-3-sci", order: 2 },
    { nameAr: "الكتابة", nameEn: "Writing", slug: "writing-3-sci", order: 3 },
  ],
  "english-3-lit": [
    { nameAr: "القراءة", nameEn: "Reading", slug: "reading-3-lit", order: 1 },
    { nameAr: "القواعد", nameEn: "Grammar", slug: "grammar-3-lit", order: 2 },
    { nameAr: "الكتابة", nameEn: "Writing", slug: "writing-3-lit", order: 3 },
    { nameAr: "الروايات", nameEn: "Novels", slug: "novels-3-lit", order: 4 },
  ],
  // تاريخ
  "history-3": [
    { nameAr: "مصر القديمة", nameEn: "Ancient Egypt", slug: "ancient-egypt-3", order: 1 },
    { nameAr: "الحضارات القديمة", nameEn: "Ancient Civilizations", slug: "ancient-civilizations-3", order: 2 },
    { nameAr: "العصر الإسلامي", nameEn: "Islamic Era", slug: "islamic-era-3", order: 3 },
    { nameAr: "مصر الحديثة", nameEn: "Modern Egypt", slug: "modern-egypt-3", order: 4 },
  ],
  // جغرافيا
  "geography-3": [
    { nameAr: "الخرائط", nameEn: "Maps", slug: "maps-3", order: 1 },
    { nameAr: "السكان", nameEn: "Population", slug: "population-3", order: 2 },
    { nameAr: "الموارد", nameEn: "Resources", slug: "resources-3", order: 3 },
    { nameAr: "مصر في العالم", nameEn: "Egypt in the World", slug: "egypt-world-3", order: 4 },
  ],
};

// POST /api/seed-curriculum - تعبئة المنهج المصري الكامل
export async function POST() {
  try {
    console.log("Starting curriculum seeding...");
    
    // 1. حذف البيانات القديمة (بالتتابع بسبب العلاقات)
    console.log("Cleaning old data...");
    await db.mindMap.deleteMany();
    await db.infographic.deleteMany();
    await db.example.deleteMany();
    await db.formula.deleteMany();
    await db.concept.deleteMany();
    await db.objective.deleteMany();
    await db.lessonSimulator.deleteMany();
    await db.lesson.deleteMany();
    await db.unit.deleteMany();
    await db.subject.deleteMany();
    await db.semester.deleteMany();
    await db.user.deleteMany();
    await db.specialization.deleteMany();
    await db.academicYear.deleteMany();
    await db.simulator.deleteMany();
    await db.badge.deleteMany();
    
    console.log("Old data cleaned.");
    
    // 2. إنشاء السنوات الدراسية
    console.log("Creating academic years...");
    const yearRecords: Record<string, { id: string }> = {};
    for (const year of academicYears) {
      yearRecords[year.code] = await db.academicYear.create({
        data: year,
      });
    }
    
    // 3. إنشاء التخصصات
    console.log("Creating specializations...");
    const specRecords: Record<string, { id: string }> = {};
    for (const spec of specializations) {
      specRecords[spec.code] = await db.specialization.create({
        data: spec,
      });
    }
    
    // 4. إنشاء الفصول الدراسية
    console.log("Creating semesters...");
    const semesterRecords: Record<string, { id: string }> = {};
    for (const sem of semesters) {
      semesterRecords[sem.code] = await db.semester.create({
        data: sem,
      });
    }
    
    // 5. إنشاء المحاكيات
    console.log("Creating simulators...");
    for (const sim of simulatorsConfig) {
      await db.simulator.create({
        data: {
          nameAr: sim.nameAr,
          nameEn: sim.nameEn,
          slug: sim.slug,
          type: sim.type,
          descriptionAr: sim.descriptionAr,
          descriptionEn: sim.descriptionEn,
          difficulty: sim.difficulty,
        },
      });
    }
    
    // 6. إنشاء المواد للصف الأول الثانوي (مشترك)
    console.log("Creating first year subjects (common)...");
    for (const subj of subjectsConfig["first-year"]) {
      const subject = await db.subject.create({
        data: {
          nameAr: subj.nameAr,
          nameEn: subj.nameEn,
          slug: subj.slug,
          icon: subj.icon,
          color: subj.color,
          isCommon: true,
          yearId: yearRecords["first-year"].id,
          order: subjectsConfig["first-year"].indexOf(subj) + 1,
        },
      });
      
      // إنشاء الوحدات للصف الأول
      const units = firstYearUnits[subj.slug];
      if (units) {
        for (const unit of units) {
          const uniqueSlug = `${subj.slug}-${unit.slug}`;
          await db.unit.create({
            data: {
              subjectId: subject.id,
              semesterId: semesterRecords["first"].id,
              nameAr: unit.nameAr,
              nameEn: unit.nameEn,
              slug: uniqueSlug,
              order: unit.order,
            },
          });
        }
      }
    }
    
    // 7. إنشاء المواد للصف الثاني الثانوي
    console.log("Creating second year subjects...");
    const secondYearConfigs = [
      { key: "second-year-math-science", specCode: "math-science" },
      { key: "second-year-science", specCode: "science" },
      { key: "second-year-literary", specCode: "literary" },
    ];
    
    for (const config of secondYearConfigs) {
      for (const subj of subjectsConfig[config.key]) {
        const subject = await db.subject.create({
          data: {
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: subj.slug,
            icon: subj.icon,
            color: subj.color,
            isCommon: subj.isCommon,
            yearId: yearRecords["second-year"].id,
            specializationId: subj.isCommon ? null : specRecords[config.specCode].id,
            order: subjectsConfig[config.key].indexOf(subj) + 1,
          },
        });
        
        // إنشاء الوحدات للصف الثاني
        const units = secondYearUnits[subj.slug];
        if (units) {
          for (const unit of units) {
            const uniqueSlug = `${subj.slug}-${unit.slug}`;
            await db.unit.create({
              data: {
                subjectId: subject.id,
                semesterId: semesterRecords["first"].id,
                nameAr: unit.nameAr,
                nameEn: unit.nameEn,
                slug: uniqueSlug,
                order: unit.order,
              },
            });
          }
        }
      }
    }
    
    // 8. إنشاء المواد للصف الثالث الثانوي (MVP)
    console.log("Creating third year subjects (MVP)...");
    const thirdYearConfigs = [
      { key: "third-year-math-science", specCode: "math-science" },
      { key: "third-year-science", specCode: "science" },
      { key: "third-year-literary", specCode: "literary" },
    ];
    
    for (const config of thirdYearConfigs) {
      for (const subj of subjectsConfig[config.key]) {
        const subject = await db.subject.create({
          data: {
            nameAr: subj.nameAr,
            nameEn: subj.nameEn,
            slug: subj.slug,
            icon: subj.icon,
            color: subj.color,
            isCommon: subj.isCommon,
            yearId: yearRecords["third-year"].id,
            specializationId: subj.isCommon ? null : specRecords[config.specCode].id,
            order: subjectsConfig[config.key].indexOf(subj) + 1,
          },
        });
        
        // إنشاء الوحدات لهذه المادة (مع slug فريد)
        const units = thirdYearUnits[subj.slug];
        if (units) {
          for (const unit of units) {
            // إضافة معرف المادة للـ slug لضمان الفرادة
            const uniqueSlug = `${subj.slug}-${unit.slug}`;
            await db.unit.create({
              data: {
                subjectId: subject.id,
                semesterId: semesterRecords["first"].id,
                nameAr: unit.nameAr,
                nameEn: unit.nameEn,
                slug: uniqueSlug,
                order: unit.order,
              },
            });
          }
        }
      }
    }
    
    // 9. إنشاء الشارات
    console.log("Creating badges...");
    const badgesData = [
      { slug: "first-lesson", nameAr: "الدرس الأول", nameEn: "First Lesson", descriptionAr: "أكمل أول درس", descriptionEn: "Complete your first lesson", icon: "Trophy", color: "#f59e0b", requirement: 1, type: "lessons" },
      { slug: "five-lessons", nameAr: "مبتدئ", nameEn: "Beginner", descriptionAr: "أكمل 5 دروس", descriptionEn: "Complete 5 lessons", icon: "Star", color: "#10b981", requirement: 5, type: "lessons" },
      { slug: "ten-lessons", nameAr: "مثابر", nameEn: "Perseverant", descriptionAr: "أكمل 10 دروس", descriptionEn: "Complete 10 lessons", icon: "Medal", color: "#3b82f6", requirement: 10, type: "lessons" },
      { slug: "physics-master", nameAr: "خبير الفيزياء", nameEn: "Physics Master", descriptionAr: "أكمل كل دروس الفيزياء", descriptionEn: "Complete all physics lessons", icon: "Atom", color: "#8b5cf6", requirement: 20, type: "subject" },
      { slug: "chemistry-master", nameAr: "خبير الكيمياء", nameEn: "Chemistry Master", descriptionAr: "أكمل كل دروس الكيمياء", descriptionEn: "Complete all chemistry lessons", icon: "FlaskConical", color: "#ef4444", requirement: 20, type: "subject" },
      { slug: "math-master", nameAr: "خبير الرياضيات", nameEn: "Math Master", descriptionAr: "أكمل كل دروس الرياضيات", descriptionEn: "Complete all math lessons", icon: "Calculator", color: "#06b6d4", requirement: 20, type: "subject" },
      { slug: "simulator-explorer", nameAr: "مستكشف المحاكيات", nameEn: "Simulator Explorer", descriptionAr: "جرب 5 محاكيات", descriptionEn: "Try 5 simulators", icon: "Play", color: "#ec4899", requirement: 5, type: "simulator" },
      { slug: "week-streak", nameAr: "أسبوع متواصل", nameEn: "Week Streak", descriptionAr: "ادرس 7 أيام متتالية", descriptionEn: "Study for 7 consecutive days", icon: "Flame", color: "#f97316", requirement: 7, type: "streak" },
    ];
    
    for (const badge of badgesData) {
      await db.badge.create({
        data: badge,
      });
    }
    
    // الإحصائيات
    const stats = {
      academicYears: await db.academicYear.count(),
      specializations: await db.specialization.count(),
      semesters: await db.semester.count(),
      subjects: await db.subject.count(),
      units: await db.unit.count(),
      simulators: await db.simulator.count(),
      badges: await db.badge.count(),
    };
    
    console.log("Curriculum seeding completed!", stats);
    
    return NextResponse.json({
      success: true,
      message: "تم إنشاء المنهج المصري بنجاح",
      stats,
    });
  } catch (error) {
    console.error("Error seeding curriculum:", error);
    return NextResponse.json(
      { error: "Failed to seed curriculum", details: String(error) },
      { status: 500 }
    );
  }
}
