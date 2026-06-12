import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ========================================
// بيانات التخصصات
// ========================================
const specializationsMap = {
  science: { code: "science", nameAr: "علمي علوم", nameEn: "Science" },
  math: { code: "math", nameAr: "علمي رياضة", nameEn: "Mathematics" },
  arts: { code: "arts", nameAr: "أدبي", nameEn: "Arts" },
};

// ========================================
// بيانات المواد
// ========================================
interface SubjectConfig {
  nameAr: string;
  nameEn: string;
  slug: string;
  icon: string;
  color: string;
  order: number;
  unitsCount: number;
  lessonsPerUnit: number;
  hasFormulas: boolean;
}

const subjectsConfig: Record<string, SubjectConfig[]> = {
  // علمي علوم
  science: [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-science", icon: "BookOpen", color: "#8B5CF6", order: 1, unitsCount: 8, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-science", icon: "Globe", color: "#3B82F6", order: 2, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-science", icon: "Globe", color: "#EC4899", order: 3, unitsCount: 4, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-3-science", icon: "Calculator", color: "#F59E0B", order: 4, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: true },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-science", icon: "Atom", color: "#10B981", order: 5, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: true },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-science", icon: "FlaskConical", color: "#EF4444", order: 6, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: true },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-3-science", icon: "Leaf", color: "#22C55E", order: 7, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: true },
  ],
  // علمي رياضة
  math: [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-math", icon: "BookOpen", color: "#8B5CF6", order: 1, unitsCount: 8, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-math", icon: "Globe", color: "#3B82F6", order: 2, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-math", icon: "Globe", color: "#EC4899", order: 3, unitsCount: 4, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "الرياضيات 1", nameEn: "Mathematics 1", slug: "math1-3-math", icon: "Calculator", color: "#F59E0B", order: 4, unitsCount: 4, lessonsPerUnit: 5, hasFormulas: true },
    { nameAr: "الرياضيات 2", nameEn: "Mathematics 2", slug: "math2-3-math", icon: "Sigma", color: "#D97706", order: 5, unitsCount: 4, lessonsPerUnit: 5, hasFormulas: true },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-math", icon: "Atom", color: "#10B981", order: 6, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: true },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-math", icon: "FlaskConical", color: "#EF4444", order: 7, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: true },
  ],
  // أدبي
  arts: [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-arts", icon: "BookOpen", color: "#8B5CF6", order: 1, unitsCount: 8, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-arts", icon: "Globe", color: "#3B82F6", order: 2, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-arts", icon: "Globe", color: "#EC4899", order: 3, unitsCount: 4, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-3-arts", icon: "Landmark", color: "#A855F7", order: 4, unitsCount: 6, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-3-arts", icon: "Map", color: "#06B6D4", order: 5, unitsCount: 5, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "الفلسفة", nameEn: "Philosophy", slug: "philosophy-3-arts", icon: "Brain", color: "#F97316", order: 6, unitsCount: 5, lessonsPerUnit: 5, hasFormulas: false },
    { nameAr: "علم النفس والاجتماع", nameEn: "Psychology & Sociology", slug: "psychology-3-arts", icon: "Users", color: "#6366F1", order: 7, unitsCount: 5, lessonsPerUnit: 5, hasFormulas: false },
  ],
};

// ========================================
// بيانات الوحدات حسب المادة
// ========================================
const unitsData: Record<string, Array<{ nameAr: string; nameEn: string }>> = {
  // اللغة العربية
  "arabic": [
    { nameAr: "وحدة القراءة والنصوص", nameEn: "Reading and Texts Unit" },
    { nameAr: "وحدة النحو والصرف", nameEn: "Grammar and Morphology Unit" },
    { nameAr: "وحدة البلاغة والعروض", nameEn: "Rhetoric and Prosody Unit" },
    { nameAr: "وحدة الأدب والنقد", nameEn: "Literature and Criticism Unit" },
    { nameAr: "وحدة التعبير والإنشاء", nameEn: "Expression and Composition Unit" },
    { nameAr: "وحدة الأدب العربي الحديث", nameEn: "Modern Arabic Literature Unit" },
    { nameAr: "وحدة الأدب الجاهلي", nameEn: "Pre-Islamic Literature Unit" },
    { nameAr: "وحدة الأدب الإسلامي والأموي", nameEn: "Islamic and Umayyad Literature Unit" },
  ],
  // اللغة الإنجليزية
  "english": [
    { nameAr: "وحدة القراءة والفهم", nameEn: "Reading and Comprehension Unit" },
    { nameAr: "وحدة القواعد النحوية", nameEn: "Grammar Rules Unit" },
    { nameAr: "وحدة الكتابة والتعبير", nameEn: "Writing and Expression Unit" },
    { nameAr: "وحدة المفردات والتراكيب", nameEn: "Vocabulary and Structures Unit" },
    { nameAr: "وحدة الاستماع والمحادثة", nameEn: "Listening and Speaking Unit" },
    { nameAr: "وحدة الترجمة", nameEn: "Translation Unit" },
  ],
  // اللغة الثانية
  "second-lang": [
    { nameAr: "وحدة القراءة والنصوص", nameEn: "Reading and Texts Unit" },
    { nameAr: "وحدة القواعد الأساسية", nameEn: "Basic Grammar Unit" },
    { nameAr: "وحدة التعبير والكتابة", nameEn: "Expression and Writing Unit" },
    { nameAr: "وحدة المفردات والتراكيب", nameEn: "Vocabulary and Structures Unit" },
  ],
  // الرياضيات
  "math": [
    { nameAr: "وحدة الجبر والدوال", nameEn: "Algebra and Functions Unit" },
    { nameAr: "وحدة الهندسة الفراغية", nameEn: "Solid Geometry Unit" },
    { nameAr: "وحدة التكامل وتطبيقاته", nameEn: "Integration and Applications Unit" },
    { nameAr: "وحدة التفاضل وتطبيقاته", nameEn: "Differentiation and Applications Unit" },
    { nameAr: "وحدة المثلثات والهندسة التحليلية", nameEn: "Trigonometry and Analytic Geometry Unit" },
    { nameAr: "وحدة الإحصاء والاحتمالات", nameEn: "Statistics and Probability Unit" },
  ],
  // الرياضيات 1
  "math1": [
    { nameAr: "وحدة الدوال والنهايات", nameEn: "Functions and Limits Unit" },
    { nameAr: "وحدة التفاضل", nameEn: "Differentiation Unit" },
    { nameAr: "وحدة تطبيقات التفاضل", nameEn: "Applications of Differentiation Unit" },
    { nameAr: "وحدة الهندسة التحليلية", nameEn: "Analytic Geometry Unit" },
  ],
  // الرياضيات 2
  "math2": [
    { nameAr: "وحدة التكامل", nameEn: "Integration Unit" },
    { nameAr: "وحدة تطبيقات التكامل", nameEn: "Applications of Integration Unit" },
    { nameAr: "وحدة الجبر الخطي", nameEn: "Linear Algebra Unit" },
    { nameAr: "وحدة المثلثات المتقدمة", nameEn: "Advanced Trigonometry Unit" },
  ],
  // الفيزياء
  "physics": [
    { nameAr: "وحدة الكهربية الساكنة", nameEn: "Electrostatics Unit" },
    { nameAr: "وحدة التيار الكهربي", nameEn: "Electric Current Unit" },
    { nameAr: "وحدة الكهرومغناطيسية", nameEn: "Electromagnetism Unit" },
    { nameAr: "وحدة الفيزياء الحديثة", nameEn: "Modern Physics Unit" },
    { nameAr: "وحدة الديناميكا الحرارية", nameEn: "Thermodynamics Unit" },
    { nameAr: "وحدة الموجات والضوء", nameEn: "Waves and Light Unit" },
  ],
  // الكيمياء
  "chemistry": [
    { nameAr: "وحدة الترموديناميكا الكيميائية", nameEn: "Chemical Thermodynamics Unit" },
    { nameAr: "وحدة الاتزان الكيميائي", nameEn: "Chemical Equilibrium Unit" },
    { nameAr: "وحدة الكيمياء الكهربية", nameEn: "Electrochemistry Unit" },
    { nameAr: "وحدة الكيمياء العضوية", nameEn: "Organic Chemistry Unit" },
    { nameAr: "وحدة الكيمياء التحليلية", nameEn: "Analytical Chemistry Unit" },
    { nameAr: "وحدة كيمياء العناصر الانتقالية", nameEn: "Transition Elements Chemistry Unit" },
  ],
  // الأحياء
  "biology": [
    { nameAr: "وحدة الوراثة والجينات", nameEn: "Genetics and Genes Unit" },
    { nameAr: "وحدة التطور والتصنيف", nameEn: "Evolution and Classification Unit" },
    { nameAr: "وحدة علم البيئة", nameEn: "Ecology Unit" },
    { nameAr: "وحدة فسيولوجيا الإنسان", nameEn: "Human Physiology Unit" },
    { nameAr: "وحدة التكاثر والنمو", nameEn: "Reproduction and Growth Unit" },
    { nameAr: "وحدة الأحياء الدقيقة", nameEn: "Microbiology Unit" },
  ],
  // التاريخ
  "history": [
    { nameAr: "وحدة تاريخ مصر الحديث", nameEn: "Modern Egypt History Unit" },
    { nameAr: "وحدة الحضارة المصرية القديمة", nameEn: "Ancient Egyptian Civilization Unit" },
    { nameAr: "وحدة تاريخ العالم المعاصر", nameEn: "Contemporary World History Unit" },
    { nameAr: "وحدة الحروب العالمية", nameEn: "World Wars Unit" },
    { nameAr: "وحدة الحركة الوطنية المصرية", nameEn: "Egyptian National Movement Unit" },
    { nameAr: "وحدة العلاقات الدولية", nameEn: "International Relations Unit" },
  ],
  // الجغرافيا
  "geography": [
    { nameAr: "وحدة الجغرافيا الطبيعية", nameEn: "Physical Geography Unit" },
    { nameAr: "وحدة جغرافيا مصر", nameEn: "Geography of Egypt Unit" },
    { nameAr: "وحدة الجغرافيا البشرية", nameEn: "Human Geography Unit" },
    { nameAr: "وحدة جغرافيا العالم", nameEn: "World Geography Unit" },
    { nameAr: "وحدة الجغرافيا الاقتصادية", nameEn: "Economic Geography Unit" },
  ],
  // الفلسفة
  "philosophy": [
    { nameAr: "وحدة المشكلات الفلسفية", nameEn: "Philosophical Problems Unit" },
    { nameAr: "وحدة المنطق", nameEn: "Logic Unit" },
    { nameAr: "وحدة الأخلاق", nameEn: "Ethics Unit" },
    { nameAr: "وحدة فلسفة العلم", nameEn: "Philosophy of Science Unit" },
    { nameAr: "وحدة الفلسفة الإسلامية", nameEn: "Islamic Philosophy Unit" },
  ],
  // علم النفس والاجتماع
  "psychology": [
    { nameAr: "وحدة أساسيات علم النفس", nameEn: "Psychology Basics Unit" },
    { nameAr: "وحدة علم النفس التربوي", nameEn: "Educational Psychology Unit" },
    { nameAr: "وحدة علم الاجتماع", nameEn: "Sociology Unit" },
    { nameAr: "وحدة المشكلات الاجتماعية", nameEn: "Social Problems Unit" },
    { nameAr: "وحدة علم النفس الاجتماعي", nameEn: "Social Psychology Unit" },
  ],
};

// ========================================
// بيانات الدروس لكل مادة
// ========================================
const lessonsData: Record<string, Array<{
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  introductionAr: string;
  introductionEn: string;
  summaryAr: string;
  summaryEn: string;
  objectives: Array<{ textAr: string; textEn: string }>;
  concepts: Array<{ termAr: string; termEn: string; definitionAr: string; definitionEn: string }>;
  formulas?: Array<{ formula: string; explanationAr: string; explanationEn: string }>;
  examples?: Array<{ questionAr: string; questionEn: string; solutionAr: string; solutionEn: string; stepsAr: string; stepsEn: string }>;
  questions: Array<{ questionAr: string; questionEn: string; optionsAr: string[]; optionsEn: string[]; answer: string; explanationAr: string; explanationEn: string }>;
}>> = {
  // دروس اللغة العربية
  "arabic": [
    {
      titleAr: "النصوص الأدبية الجاهلية",
      titleEn: "Pre-Islamic Literary Texts",
      descriptionAr: "دراسة النصوص الأدبية من العصر الجاهلي وخصائصها",
      descriptionEn: "Study of literary texts from the Pre-Islamic era and their characteristics",
      introductionAr: "يُعد العصر الجاهلي من أغنى العصور الأدبية في التراث العربي، حيث تميز بشعرائه الكبار الذين تركوا لنا روائع أدبية خالدة. كان الشعر ديوان العرب يحفظ تاريخهم وأنسابهم ومآثرهم.",
      introductionEn: "The Pre-Islamic era is considered one of the richest literary eras in Arab heritage, distinguished by its great poets who left us immortal literary masterpieces. Poetry was the record of Arabs, preserving their history, lineage, and achievements.",
      summaryAr: "تميز الشعر الجاهلي بالجزالة والقوة في المعنى واللفظ. تشمل أغراض الشعر الجاهلي: الفخر، المدح، الهجاء، الرثاء، الغزل، والحكمة. من أشهر الشعراء: امرؤ القيس، عنترة بن شداد، زهير بن أبي سلمى.",
      summaryEn: "Pre-Islamic poetry was characterized by eloquence and strength in meaning and word. The purposes of Pre-Islamic poetry include: pride, praise, satire, elegy, love, and wisdom. Famous poets include: Imru al-Qais, Antara ibn Shaddad, Zuhayr ibn Abi Sulma.",
      objectives: [
        { textAr: "التعرف على خصائص الشعر الجاهلي", textEn: "Identify the characteristics of Pre-Islamic poetry" },
        { textAr: "تحليل النصوص الأدبية الجاهلية", textEn: "Analyze Pre-Islamic literary texts" },
        { textAr: "فهم البيئة الاجتماعية للعصر الجاهلي", textEn: "Understand the social environment of the Pre-Islamic era" },
      ],
      concepts: [
        { termAr: "المعلقات", termEn: "The Mu'allaqat", definitionAr: "قصائد شعرية جاهلية معلقة على الكعبة", definitionEn: "Pre-Islamic poetic odes hung on the Kaaba" },
        { termAr: "القصيدة", termEn: "The Ode", definitionAr: "قطعة شعرية مكونة من أبيات على بحر واحد وقافية موحدة", definitionEn: "A poetic piece consisting of verses in one meter and unified rhyme" },
        { termAr: "المطلع", termEn: "The Opening", definitionAr: "الأبيات الأولى من القصيدة التي تبدأ عادة بالبكاء على الأطلال", definitionEn: "The first verses of the ode usually starting with weeping over ruins" },
      ],
      questions: [
        { questionAr: "ما هي المعلقات؟", questionEn: "What are the Mu'allaqat?", optionsAr: ["كتب تاريخية", "قصائد شعرية جاهلية", "معارك مشهورة", "مدن قديمة"], optionsEn: ["Historical books", "Pre-Islamic poetic odes", "Famous battles", "Ancient cities"], answer: "قصائد شعرية جاهلية", explanationAr: "المعلقات هي قصائد شعرية جاهلية شهيرة سُميت بهذا الاسم لأنها كانت تُعلق على الكعبة", explanationEn: "The Mu'allaqat are famous Pre-Islamic poetic odes, named so because they were hung on the Kaaba" },
      ],
    },
    {
      titleAr: "النحو: المبتدأ والخبر",
      titleEn: "Grammar: Subject and Predicate",
      descriptionAr: "دراسة قواعد المبتدأ والخبر وأنواعهما",
      descriptionEn: "Study of subject and predicate rules and their types",
      introductionAr: "الجملة الاسمية هي الجملة التي تبدأ باسم، وتتكون من ركنين أساسيين: المبتدأ والخبر. المبتدأ هو الاسم المبدوء به، والخبر هو ما يُتمم معنى الجملة.",
      introductionEn: "A nominal sentence is a sentence that begins with a noun, consisting of two main elements: the subject and the predicate. The subject is the noun that starts the sentence, and the predicate completes the sentence's meaning.",
      summaryAr: "المبتدأ: اسم مرفوع يبدأ به الجملة الاسمية. أنواعه: صريح، ومؤول. الخبر: ما يتمم معنى الجملة. أنواعه: مفرد، جملة (فعلية أو اسمية)، شبه جملة (ظرف أو جار ومجرور).",
      summaryEn: "Subject: a nominative noun that begins the nominal sentence. Types: explicit and interpreted. Predicate: what completes the sentence's meaning. Types: singular, sentence (verbal or nominal), semi-sentence (adverb or prepositional phrase).",
      objectives: [
        { textAr: "التعرّف على المبتدأ والخبر", textEn: "Identify the subject and predicate" },
        { textAr: "التمييز بين أنواع المبتدأ والخبر", textEn: "Distinguish between types of subject and predicate" },
        { textAr: "إعراب الجمل الاسمية بشكل صحيح", textEn: "Parse nominal sentences correctly" },
      ],
      concepts: [
        { termAr: "المبتدأ", termEn: "Subject", definitionAr: "اسم مرفوع يبدأ به الجملة الاسمية", definitionEn: "A nominative noun that begins the nominal sentence" },
        { termAr: "الخبر", termEn: "Predicate", definitionAr: "ما يُتمم معنى الجملة الاسمية", definitionEn: "What completes the meaning of the nominal sentence" },
        { termAr: "الجملة الاسمية", termEn: "Nominal Sentence", definitionAr: "جملة تبدأ باسم وتتكون من مبتدأ وخبر", definitionEn: "A sentence beginning with a noun consisting of subject and predicate" },
      ],
      questions: [
        { questionAr: "ما إعراب كلمة 'الطالب' في جملة 'الطالب مجتهد'؟", questionEn: "What is the grammatical case of 'الطالب' in 'الطالب مجتهد'؟", optionsAr: ["خبر مرفوع", "مبتدأ مرفوع", "فاعل", "مفعول به"], optionsEn: ["Nominative predicate", "Nominative subject", "Doer", "Object"], answer: "مبتدأ مرفوع", explanationAr: "كلمة 'الطالب' مبتدأ مرفوع لأنها اسم بدئت به الجملة الاسمية", explanationEn: "'الطالب' is a nominative subject because it's the noun that begins the nominal sentence" },
      ],
    },
    {
      titleAr: "البلاغة: التشبيه وأنواعه",
      titleEn: "Rhetoric: Simile and Its Types",
      descriptionAr: "دراسة التشبيه وأركانه وأنواعه البلاغية",
      descriptionEn: "Study of simile, its elements, and its rhetorical types",
      introductionAr: "التشبيه هو عقد مشاركة بين شيئين أو أكثر في صفة مشتركة، بأداة تشبيه صريحة أو كناية. يُعد من أهم الأساليب البلاغية التي تُكسب الكلام جمالاً وقوة.",
      introductionEn: "Simile is establishing a partnership between two or more things in a common characteristic, with an explicit or implicit simile tool. It's one of the most important rhetorical styles that give beauty and strength to speech.",
      summaryAr: "أركان التشبيه: المشبه، المشبه به، أداة التشبيه، وجه الشبه. أنواع التشبيه: مفصل، مجمل، بليغ (حذف الأداة ووجه الشبه)، تمثيلي. التشبيه الضمني: تشبيه لا يُذكر فيه المشبه به.",
      summaryEn: "Elements of simile: the likened, the likened to, the simile tool, the point of resemblance. Types: detailed, summary, eloquent (omitting tool and point of resemblance), representational. Implicit simile: a simile where the likened to is not mentioned.",
      objectives: [
        { textAr: "فهم مفهوم التشبيه البلاغي", textEn: "Understand the concept of rhetorical simile" },
        { textAr: "التعرف على أركان التشبيه", textEn: "Identify the elements of simile" },
        { textAr: "التمييز بين أنواع التشبيه", textEn: "Distinguish between types of simile" },
      ],
      concepts: [
        { termAr: "المشبه", termEn: "The Likened", definitionAr: "الشيء الذي نُشبهه بغيره", definitionEn: "The thing we liken to something else" },
        { termAr: "المشبه به", termEn: "The Likened To", definitionAr: "الشيء الذي نُشبه به غيرنا", definitionEn: "The thing we liken others to" },
        { termAr: "وجه الشبه", termEn: "Point of Resemblance", definitionAr: "الصفة المشتركة بين المشبه والمشبه به", definitionEn: "The common characteristic between the likened and the likened to" },
      ],
      questions: [
        { questionAr: "ما نوع التشبيه في قولنا 'القلب كالمرآة'؟", questionEn: "What type of simile is 'القلب كالمرآة'?", optionsAr: ["تشبيه بليغ", "تشبيه مفصل", "تشبيه تمثيلي", "تشبيه ضمني"], optionsEn: ["Eloquent simile", "Detailed simile", "Representational simile", "Implicit simile"], answer: "تشبيه مفصل", explanationAr: "التشبيه مفصل لأنه ذُكرت أركانه: المشبه (القلب)، المشبه به (المرآة)، وأداة التشبيه (الكاف)", explanationEn: "It's a detailed simile because its elements are mentioned: the likened (heart), the likened to (mirror), and the simile tool (like)" },
      ],
    },
    {
      titleAr: "الأدب الأندلسي وخصائصه",
      titleEn: "Andalusian Literature and Its Characteristics",
      descriptionAr: "دراسة الأدب الأندلسي وتطوره وخصائصه المميزة",
      descriptionEn: "Study of Andalusian literature, its development, and its distinctive characteristics",
      introductionAr: "شهد الأدب الأندلسي ازدهاراً كبيراً بفضل البيئة الطبيعية الخلابة والحضارة الإسلامية المترفة. تميز الشعر الأندلسي بوصف الطبيعة والغزل العفيف والرثاء على الأطلال.",
      introductionEn: "Andalusian literature witnessed great flourishing thanks to the beautiful natural environment and luxurious Islamic civilization. Andalusian poetry was characterized by describing nature, chaste love, and elegy over ruins.",
      summaryAr: "خصائص الأدب الأندلسي: وصف الطبيعة، الغزل العفيف، ظهور الموشحات والأزجال، التأثر بالبيئة المحلية. من أشهر الشعراء: ابن زيدون، لسان الدين بن الخطيب، ابن خفاجة.",
      summaryEn: "Characteristics of Andalusian literature: describing nature, chaste love, emergence of muwashshahat and zajal, influence of local environment. Famous poets include: Ibn Zaydun, Lisan al-Din ibn al-Khatib, Ibn Khafaja.",
      objectives: [
        { textAr: "التعرف على نشأة الأدب الأندلسي", textEn: "Learn about the emergence of Andalusian literature" },
        { textAr: "فهم خصائص الشعر الأندلسي", textEn: "Understand the characteristics of Andalusian poetry" },
        { textAr: "دراسة أهم الشعراء الأندلسيين", textEn: "Study the most important Andalusian poets" },
      ],
      concepts: [
        { termAr: "الموشحات", termEn: "Muwashshahat", definitionAr: "نوع شعري أندلسي مبتكر يتميز بتركيبة موسيقية خاصة", definitionEn: "An innovative Andalusian poetic type distinguished by special musical composition" },
        { termAr: "الأزجال", termEn: "Zajal", definitionAr: "شعر عامي أندلسي يُنظم باللهجة العامية", definitionEn: "Andalusian popular poetry written in the colloquial dialect" },
        { termAr: "الطبيعة في الشعر الأندلسي", termEn: "Nature in Andalusian Poetry", definitionAr: "وصف جمال الطبيعة الأندلسية من أنهار وبساتين وجبال", definitionEn: "Describing the beauty of Andalusian nature from rivers, gardens, and mountains" },
      ],
      questions: [
        { questionAr: "ما هي الموشحات؟", questionEn: "What are Muwashshahat?", optionsAr: ["قصائد طويلة", "نوع شعري أندلسي مبتكر", "كتب نثرية", "رسائل أدبية"], optionsEn: ["Long odes", "An innovative Andalusian poetic type", "Prose books", "Literary letters"], answer: "نوع شعري أندلسي مبتكر", explanationAr: "الموشحات هي نوع شعري ابتكره الأندلسيون يتميز بتركيبة موسيقية خاصة وبنية فريدة", explanationEn: "Muwashshahat are a poetic type innovated by Andalusians distinguished by special musical composition and unique structure" },
      ],
    },
    {
      titleAr: "النقد الأدبي ومناهجه",
      titleEn: "Literary Criticism and Its Approaches",
      descriptionAr: "دراسة أسس النقد الأدبي ومناهجه المختلفة",
      descriptionEn: "Study of literary criticism foundations and its various approaches",
      introductionAr: "النقد الأدبي هو دراسة الأعمال الأدبية وتحليلها وتقييمها وفق معايير علمية وفنية محددة. تطور النقد العربي من نقد انطباعي إلى نقد منهجي حديث.",
      introductionEn: "Literary criticism is the study, analysis, and evaluation of literary works according to specific scientific and artistic criteria. Arabic criticism developed from impressionistic criticism to modern systematic criticism.",
      summaryAr: "مناهج النقد الأدبي: المنهج التاريخي، المنهج الاجتماعي، المنهج النفسي، المنهج البنيوي، المنهج الأسلوبي. من أعلام النقد: الجاحظ، عبد القاهر الجرجاني، طه حسين.",
      summaryEn: "Approaches to literary criticism: historical method, social method, psychological method, structural method, stylistic method. Famous critics include: Al-Jahiz, Abd al-Qahir al-Jurjani, Taha Hussein.",
      objectives: [
        { textAr: "فهم مفهوم النقد الأدبي", textEn: "Understand the concept of literary criticism" },
        { textAr: "التعرف على مناهج النقد الأدبي", textEn: "Identify approaches to literary criticism" },
        { textAr: "تطبيق أسس النقد على النصوص الأدبية", textEn: "Apply criticism principles to literary texts" },
      ],
      concepts: [
        { termAr: "النقد الأدبي", termEn: "Literary Criticism", definitionAr: "دراسة الأعمال الأدبية وتحليلها وتقييمها", definitionEn: "The study, analysis, and evaluation of literary works" },
        { termAr: "المنهج البنيوي", termEn: "Structural Method", definitionAr: "منهج يركز على بنية النص الأدبي وعناصره", definitionEn: "A method focusing on the structure and elements of the literary text" },
        { termAr: "الذوق الأدبي", termEn: "Literary Taste", definitionAr: "القدرة على إدراك الجمال الأدبي وتقديره", definitionEn: "The ability to perceive and appreciate literary beauty" },
      ],
      questions: [
        { questionAr: "ما هو المنهج البنيوي في النقد الأدبي؟", questionEn: "What is the structural method in literary criticism?", optionsAr: ["منهج يدرس تاريخ الأدب", "منهج يركز على بنية النص", "منهج يدرس نفسية الأديب", "منهج يدرس المجتمع"], optionsEn: ["A method studying literary history", "A method focusing on text structure", "A method studying the writer's psychology", "A method studying society"], answer: "منهج يركز على بنية النص", explanationAr: "المنهج البنيوي يركز على بنية النص الأدبي نفسه وعناصره الداخلية", explanationEn: "The structural method focuses on the literary text's own structure and its internal elements" },
      ],
    },
  ],
  // دروس اللغة الإنجليزية
  "english": [
    {
      titleAr: "Reading Comprehension Strategies",
      titleEn: "Reading Comprehension Strategies",
      descriptionAr: "استراتيجيات فهم المقروء وتحليل النصوص",
      descriptionEn: "Strategies for reading comprehension and text analysis",
      introductionAr: "تُعد مهارة فهم المقروء من أهم المهارات اللغوية. تتضمن هذه المهارة القدرة على استخراج المعلومات من النص وفهم المعنى الضمني والصريح.",
      introductionEn: "Reading comprehension is one of the most important language skills. This skill involves the ability to extract information from text and understand implicit and explicit meaning.",
      summaryAr: "استراتيجيات فهم المقروء: القراءة السريعة، القراءة التفصيلية، التلخيص، طرح الأسئلة، الاستنتاج. أنواع القراءة: قراءة مسحية، قراءة تحليلية، قراءة ناقدة.",
      summaryEn: "Reading comprehension strategies: skimming, detailed reading, summarizing, questioning, inference. Types of reading: scanning reading, analytical reading, critical reading.",
      objectives: [
        { textAr: "تطبيق استراتيجيات فهم المقروء", textEn: "Apply reading comprehension strategies" },
        { textAr: "تحليل النصوص المختلفة", textEn: "Analyze various texts" },
        { textAr: "استخراج الأفكار الرئيسية والفرعية", textEn: "Extract main and sub-ideas" },
      ],
      concepts: [
        { termAr: "المعنى الضمني", termEn: "Implicit Meaning", definitionAr: "المعنى غير المباشر الذي يُفهم من السياق", definitionEn: "Indirect meaning understood from context" },
        { termAr: "القراءة الناقدة", termEn: "Critical Reading", definitionAr: "قراءة تحليلية تقويمية للنص", definitionEn: "Analytical evaluative reading of text" },
        { termAr: "الاستنتاج", termEn: "Inference", definitionAr: "استخلاص معلومات غير مذكورة صراحة", definitionEn: "Deriving information not explicitly stated" },
      ],
      questions: [
        { questionAr: "ما هي القراءة التحليلية؟", questionEn: "What is analytical reading?", optionsAr: ["قراءة سريعة", "قراءة تفصيلية عميقة", "قراءة للترفيه", "قراءة عشوائية"], optionsEn: ["Fast reading", "Deep detailed reading", "Reading for entertainment", "Random reading"], answer: "قراءة تفصيلية عميقة", explanationAr: "القراءة التحليلية هي قراءة معمقة تهدف لفهم تفاصيل النص وتحليل عناصره", explanationEn: "Analytical reading is deep reading aimed at understanding text details and analyzing its elements" },
      ],
    },
    {
      titleAr: "Grammar: Conditional Sentences",
      titleEn: "Grammar: Conditional Sentences",
      descriptionAr: "دراسة الجمل الشرطية وأنواعها",
      descriptionEn: "Study of conditional sentences and their types",
      introductionAr: "الجمل الشرطية من أهم تراكيب اللغة الإنجليزية. تتكون من جزأين: شرط (if clause) ونتيجة (main clause). لها أنواع مختلفة حسب الزمن والموقف.",
      introductionEn: "Conditional sentences are one of the most important English structures. They consist of two parts: the if clause and the main clause. They have different types depending on tense and situation.",
      summaryAr: "أنواع الجمل الشرطية: Type 0 (حقائق علمية)، Type 1 (احتمالات مستقبلية)، Type 2 (مواقف غير حقيقية في الحاضر)، Type 3 (مواقف غير حقيقية في الماضي).",
      summaryEn: "Types of conditional sentences: Type 0 (scientific facts), Type 1 (future possibilities), Type 2 (unreal present situations), Type 3 (unreal past situations).",
      objectives: [
        { textAr: "فهم أنواع الجمل الشرطية", textEn: "Understand types of conditional sentences" },
        { textAr: "استخدام الأزمنة الصحيحة", textEn: "Use correct tenses" },
        { textAr: "تكوين جمل شرطية صحيحة", textEn: "Form correct conditional sentences" },
      ],
      concepts: [
        { termAr: "If Clause", termEn: "If Clause", definitionAr: "الجملة الشرطية التي تبدأ بكلمة if", definitionEn: "The conditional clause that begins with if" },
        { termAr: "Main Clause", termEn: "Main Clause", definitionAr: "جملة النتيجة في الجملة الشرطية", definitionEn: "The result clause in the conditional sentence" },
        { termAr: "Hypothetical", termEn: "Hypothetical", definitionAr: "موقف افتراضي غير حقيقي", definitionEn: "An unreal imaginary situation" },
      ],
      questions: [
        { questionAr: "ما نوع الجملة: 'If I had money, I would buy a car'؟", questionEn: "What type is: 'If I had money, I would buy a car'?", optionsAr: ["Type 0", "Type 1", "Type 2", "Type 3"], optionsEn: ["Type 0", "Type 1", "Type 2", "Type 3"], answer: "Type 2", explanationAr: "هذه الجملة من النوع الثاني لأنها تعبر عن موقف غير حقيقي في الحاضر باستخدام would", explanationEn: "This sentence is Type 2 because it expresses an unreal present situation using would" },
      ],
    },
    {
      titleAr: "Essay Writing Structure",
      titleEn: "Essay Writing Structure",
      descriptionAr: "هيكلة وكتابة المقالات باللغة الإنجليزية",
      descriptionEn: "Structuring and writing essays in English",
      introductionAr: "كتابة المقال من أهم المهارات الأكاديمية. يتكون المقال من مقدمة وجسم رئيسي وخاتمة، ولكل جزء وظيفة محددة.",
      introductionEn: "Essay writing is one of the most important academic skills. An essay consists of an introduction, main body, and conclusion, each with a specific function.",
      summaryAr: "هيكل المقال: المقدمة (thesis statement، خلفية)، الجسم (فقرات موضوعية، أدلة وأمثلة)، الخاتمة (إعادة صياغة، خلاصة). أنواع المقالات: وصفي، جدلي، سردي، مقارن.",
      summaryEn: "Essay structure: Introduction (thesis statement, background), Body (topic paragraphs, evidence and examples), Conclusion (rephrasing, summary). Types of essays: descriptive, argumentative, narrative, comparative.",
      objectives: [
        { textAr: "فهم هيكل المقال الأساسي", textEn: "Understand basic essay structure" },
        { textAr: "كتابة thesis statement قوي", textEn: "Write a strong thesis statement" },
        { textAr: "تنظيم الأفكار بشكل منطقي", textEn: "Organize ideas logically" },
      ],
      concepts: [
        { termAr: "Thesis Statement", termEn: "Thesis Statement", definitionAr: "جملة تحدد الفكرة الرئيسية للمقال", definitionEn: "A sentence that defines the main idea of the essay" },
        { termAr: "Topic Sentence", termEn: "Topic Sentence", definitionAr: "جملة تعبر عن الفكرة الرئيسية للفقرة", definitionEn: "A sentence expressing the main idea of a paragraph" },
        { termAr: "Supporting Details", termEn: "Supporting Details", definitionAr: "أدلة وأمثلة تدعم الفكرة الرئيسية", definitionEn: "Evidence and examples supporting the main idea" },
      ],
      questions: [
        { questionAr: "أين توضع thesis statement عادة؟", questionEn: "Where is the thesis statement usually placed?", optionsAr: ["في الخاتمة", "في نهاية المقدمة", "في بداية الجسم", "في منتصف المقال"], optionsEn: ["In the conclusion", "At the end of the introduction", "At the beginning of the body", "In the middle of the essay"], answer: "في نهاية المقدمة", explanationAr: "توضع thesis statement عادة في نهاية المقدمة لتوجيه القارئ للفكرة الرئيسية", explanationEn: "The thesis statement is usually placed at the end of the introduction to guide the reader to the main idea" },
      ],
    },
  ],
  // دروس الرياضيات
  "math": [
    {
      titleAr: "الدوال والنهايات",
      titleEn: "Functions and Limits",
      descriptionAr: "دراسة الدوال الرياضية وحساب النهايات",
      descriptionEn: "Study of mathematical functions and limit calculations",
      introductionAr: "الدالة هي علاقة تربط كل عنصر في مجموعة المنطلق بعنصر واحد في مجموعة المستقر. النهاية هي القيمة التي تقترب منها الدالة عندما يقترب المتغير من قيمة معينة.",
      introductionEn: "A function is a relation that connects each element in the domain to one element in the codomain. A limit is the value a function approaches as the variable approaches a specific value.",
      summaryAr: "أنواع الدوال: خطية، تربيعية، أسية، لوغاريتمية، مثلثية. قواعد النهايات: نهاية المجموع، نهاية الضرب، نهاية القسمة. الحالات الخاصة: 0/0، ∞/∞.",
      summaryEn: "Types of functions: linear, quadratic, exponential, logarithmic, trigonometric. Limit rules: sum limit, product limit, quotient limit. Special cases: 0/0, ∞/∞.",
      objectives: [
        { textAr: "فهم مفهوم الدالة", textEn: "Understand the concept of function" },
        { textAr: "حساب النهايات المختلفة", textEn: "Calculate various limits" },
        { textAr: "تحديد استمرارية الدوال", textEn: "Determine function continuity" },
      ],
      concepts: [
        { termAr: "الدالة", termEn: "Function", definitionAr: "علاقة تربط كل x بقيمة واحدة y", definitionEn: "A relation connecting each x to one y value" },
        { termAr: "النهاية", termEn: "Limit", definitionAr: "القيمة التي تقترب منها الدالة", definitionEn: "The value a function approaches" },
        { termAr: "الاستمرارية", termEn: "Continuity", definitionAr: "عدم وجود انقطاع في رسم الدالة", definitionEn: "Absence of breaks in the function graph" },
      ],
      formulas: [
        { formula: "lim(x→a) [f(x) + g(x)] = lim f(x) + lim g(x)", explanationAr: "نهاية المجموع تساوي مجموع النهايات", explanationEn: "Limit of sum equals sum of limits" },
        { formula: "lim(x→a) [f(x) × g(x)] = lim f(x) × lim g(x)", explanationAr: "نهاية الضرب تساوي حاصل ضرب النهايات", explanationEn: "Limit of product equals product of limits" },
        { formula: "lim(x→0) (sin x / x) = 1", explanationAr: "نهاية الجيب على الزاوية تساوي واحد", explanationEn: "Limit of sine over angle equals one" },
      ],
      examples: [
        {
          questionAr: "أوجد نهاية: lim(x→2) (x² - 4) / (x - 2)",
          questionEn: "Find: lim(x→2) (x² - 4) / (x - 2)",
          solutionAr: "باستخدام التحليل: (x² - 4) = (x - 2)(x + 2)، إذن النهاية = 4",
          solutionEn: "Using factorization: (x² - 4) = (x - 2)(x + 2), so the limit = 4",
          stepsAr: "1. حلل البسط: x² - 4 = (x-2)(x+2)  2. اختصر (x-2)  3. عوض x = 2: النتيجة = 4",
          stepsEn: "1. Factor numerator: x² - 4 = (x-2)(x+2)  2. Cancel (x-2)  3. Substitute x = 2: Result = 4",
        },
      ],
      questions: [
        { questionAr: "ما قيمة lim(x→3) (x + 2)؟", questionEn: "What is lim(x→3) (x + 2)?", optionsAr: ["3", "5", "6", "2"], optionsEn: ["3", "5", "6", "2"], answer: "5", explanationAr: "نعوض x = 3 في الدالة: 3 + 2 = 5", explanationEn: "Substitute x = 3 in the function: 3 + 2 = 5" },
      ],
    },
    {
      titleAr: "التفاضل وتطبيقاته",
      titleEn: "Differentiation and Applications",
      descriptionAr: "دراسة الاشتقاق وتطبيقاته في حل المشكلات",
      descriptionEn: "Study of differentiation and its applications in problem solving",
      introductionAr: "التفاضل هو عملية إيجاد المشتقة، والتي تمثل معدل التغير اللحظي للدالة. تُستخدم المشتقات في إيجاد القيم العظمى والصغرى وتحليل الرسوم البيانية.",
      introductionEn: "Differentiation is the process of finding the derivative, which represents the instantaneous rate of change of a function. Derivatives are used to find maximum and minimum values and analyze graphs.",
      summaryAr: "قواعد الاشتقاق: قاعدة القوة، قاعدة الضرب، قاعدة القسمة، قاعدة السلسلة. التطبيقات: إيجاد المماس، القيم العظمى والصغرى، دراسة تغير الدالة.",
      summaryEn: "Differentiation rules: power rule, product rule, quotient rule, chain rule. Applications: finding tangent, maxima and minima, studying function variation.",
      objectives: [
        { textAr: "إيجاد مشتقات الدوال المختلفة", textEn: "Find derivatives of various functions" },
        { textAr: "تطبيق قواعد الاشتقاق", textEn: "Apply differentiation rules" },
        { textAr: "استخدام المشتقات في التطبيقات", textEn: "Use derivatives in applications" },
      ],
      concepts: [
        { termAr: "المشتقة", termEn: "Derivative", definitionAr: "معدل التغير اللحظي للدالة", definitionEn: "Instantaneous rate of change of a function" },
        { termAr: "خط المماس", termEn: "Tangent Line", definitionAr: "خط يلامس المنحنى في نقطة واحدة", definitionEn: "A line touching the curve at one point" },
        { termAr: "النقطة الحرجة", termEn: "Critical Point", definitionAr: "نقطة تساوي فيها المشتقة صفر أو لا توجد", definitionEn: "A point where derivative equals zero or doesn't exist" },
      ],
      formulas: [
        { formula: "d/dx (xⁿ) = nxⁿ⁻¹", explanationAr: "قاعدة القوة في الاشتقاق", explanationEn: "Power rule in differentiation" },
        { formula: "d/dx (f × g) = f'g + fg'", explanationAr: "قاعدة الضرب", explanationEn: "Product rule" },
        { formula: "d/dx (sin x) = cos x", explanationAr: "مشتقة الجيب", explanationEn: "Derivative of sine" },
      ],
      examples: [
        {
          questionAr: "أوجد مشتقة الدالة: f(x) = x³ + 2x² - 5x + 1",
          questionEn: "Find the derivative: f(x) = x³ + 2x² - 5x + 1",
          solutionAr: "f'(x) = 3x² + 4x - 5",
          solutionEn: "f'(x) = 3x² + 4x - 5",
          stepsAr: "1. اشتق x³: 3x²  2. اشتق 2x²: 4x  3. اشتق -5x: -5  4. اشتق 1: 0  5. المجموع: 3x² + 4x - 5",
          stepsEn: "1. Differentiate x³: 3x²  2. Differentiate 2x²: 4x  3. Differentiate -5x: -5  4. Differentiate 1: 0  5. Sum: 3x² + 4x - 5",
        },
      ],
      questions: [
        { questionAr: "ما مشتقة الدالة f(x) = 5x⁴؟", questionEn: "What is the derivative of f(x) = 5x⁴?", optionsAr: ["20x³", "5x³", "20x⁴", "5x⁵"], optionsEn: ["20x³", "5x³", "20x⁴", "5x⁵"], answer: "20x³", explanationAr: "بتطبيق قاعدة القوة: 5 × 4x³ = 20x³", explanationEn: "Applying the power rule: 5 × 4x³ = 20x³" },
      ],
    },
    {
      titleAr: "التكامل وتطبيقاته",
      titleEn: "Integration and Applications",
      descriptionAr: "دراسة التكامل المحدد وغير المحدد وتطبيقاته",
      descriptionEn: "Study of definite and indefinite integration and applications",
      introductionAr: "التكامل هو العملية العكسية للتفاضل. يُستخدم في حساب المساحات تحت المنحنيات والحجوم وحل المعادلات التفاضلية.",
      introductionEn: "Integration is the inverse process of differentiation. It's used to calculate areas under curves, volumes, and solve differential equations.",
      summaryAr: "أنواع التكامل: محدد (له حدود)، غير محدد (بدون حدود). طرق التكامل: التعويض، التجزئة، الكسور الجزئية. التطبيقات: المساحة، الحجم، طول القوس.",
      summaryEn: "Types of integration: definite (with limits), indefinite (without limits). Integration methods: substitution, integration by parts, partial fractions. Applications: area, volume, arc length.",
      objectives: [
        { textAr: "فهم مفهوم التكامل", textEn: "Understand the concept of integration" },
        { textAr: "تطبيق طرق التكامل المختلفة", textEn: "Apply various integration methods" },
        { textAr: "حل مسائل التطبيقات", textEn: "Solve application problems" },
      ],
      concepts: [
        { termAr: "التكامل المحدد", termEn: "Definite Integral", definitionAr: "تكامل له حدود عليا وسفلى", definitionEn: "An integral with upper and lower limits" },
        { termAr: "التكامل غير المحدد", termEn: "Indefinite Integral", definitionAr: "تكامل بدون حدود يُعطي عائلة من الدوال", definitionEn: "An integral without limits giving a family of functions" },
        { termAr: "ثابت التكامل", termEn: "Constant of Integration", definitionAr: "ثابت يُضاف في التكامل غير المحدد", definitionEn: "A constant added in indefinite integration" },
      ],
      formulas: [
        { formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C", explanationAr: "قاعدة التكامل الأساسية", explanationEn: "Basic integration rule" },
        { formula: "∫eˣdx = eˣ + C", explanationAr: "تكامل الدالة الأسية", explanationEn: "Integration of exponential function" },
        { formula: "∫(1/x)dx = ln|x| + C", explanationAr: "تكامل 1 على x", explanationEn: "Integration of 1/x" },
      ],
      examples: [
        {
          questionAr: "أوجد التكامل: ∫(3x² + 2x - 1)dx",
          questionEn: "Find the integral: ∫(3x² + 2x - 1)dx",
          solutionAr: "x³ + x² - x + C",
          solutionEn: "x³ + x² - x + C",
          stepsAr: "1. اكمل 3x²: x³  2. اكمل 2x: x²  3. اكمل -1: -x  4. أضف ثابت التكامل C",
          stepsEn: "1. Integrate 3x²: x³  2. Integrate 2x: x²  3. Integrate -1: -x  4. Add constant of integration C",
        },
      ],
      questions: [
        { questionAr: "ما قيمة ∫2x dx؟", questionEn: "What is ∫2x dx?", optionsAr: ["x² + C", "2x² + C", "x + C", "2x + C"], optionsEn: ["x² + C", "2x² + C", "x + C", "2x + C"], answer: "x² + C", explanationAr: "بتطبيق قاعدة التكامل: 2 × x²/2 = x² + C", explanationEn: "Applying integration rule: 2 × x²/2 = x² + C" },
      ],
    },
  ],
  // دروس الفيزياء
  "physics": [
    {
      titleAr: "الكهربية الساكنة",
      titleEn: "Electrostatics",
      descriptionAr: "دراسة الشحنات الساكنة والقوى الكهربية",
      descriptionEn: "Study of static charges and electric forces",
      introductionAr: "الكهربية الساكنة تدرس الشحنات الكهربية في حالة السكون. تنشأ الشحنات من انتقال الإلكترونات بين الأجسام، وتكون إما موجبة أو سالبة.",
      introductionEn: "Electrostatics studies electric charges at rest. Charges arise from the transfer of electrons between bodies, and are either positive or negative.",
      summaryAr: "قانون كولوم: القوة بين شحنتين تتناسب طردياً مع حاصل ضربهما وعكسياً مع مربع المسافة. المجال الكهربي: منطقة تأثير الشحنة. الجهد الكهربي: الطاقة لكل وحدة شحنة.",
      summaryEn: "Coulomb's law: force between two charges is directly proportional to their product and inversely proportional to the square of distance. Electric field: region of charge influence. Electric potential: energy per unit charge.",
      objectives: [
        { textAr: "فهم طبيعة الشحنة الكهربية", textEn: "Understand nature of electric charge" },
        { textAr: "تطبيق قانون كولوم", textEn: "Apply Coulomb's law" },
        { textAr: "حساب المجال والجهد الكهربي", textEn: "Calculate electric field and potential" },
      ],
      concepts: [
        { termAr: "الشحنة الكهربية", termEn: "Electric Charge", definitionAr: "خاصية فيزيائية للجسيمات تسبب قوى كهربية", definitionEn: "Physical property of particles causing electric forces" },
        { termAr: "المجال الكهربي", termEn: "Electric Field", definitionAr: "منطقة حول الشحنة يؤثر فيها بقوة كهربية", definitionEn: "Region around a charge exerting electric force" },
        { termAr: "الجهد الكهربي", termEn: "Electric Potential", definitionAr: "الطاقة الكامنة لوحدة الشحنة", definitionEn: "Potential energy per unit charge" },
      ],
      formulas: [
        { formula: "F = k|q₁q₂|/r²", explanationAr: "قانون كولوم لحساب القوة الكهربية", explanationEn: "Coulomb's law for calculating electric force" },
        { formula: "E = F/q = kQ/r²", explanationAr: "شدة المجال الكهربي", explanationEn: "Electric field intensity" },
        { formula: "V = kQ/r", explanationAr: "الجهد الكهربي", explanationEn: "Electric potential" },
      ],
      examples: [
        {
          questionAr: "شحنتان q₁ = 2μC و q₂ = -3μC تفصل بينهما مسافة 0.5m. أوجد القوة بينهما.",
          questionEn: "Two charges q₁ = 2μC and q₂ = -3μC are separated by 0.5m. Find the force between them.",
          solutionAr: "F = 0.216 N (قوة جذب)",
          solutionEn: "F = 0.216 N (attractive force)",
          stepsAr: "1. حوّل للوحدات القياسية  2. طبق قانون كولوم: F = 9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶ / (0.5)²  3. F = 0.216 N",
          stepsEn: "1. Convert to SI units  2. Apply Coulomb's law: F = 9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶ / (0.5)²  3. F = 0.216 N",
        },
      ],
      questions: [
        { questionAr: "ما نوع القوة بين شحنتين مختلفتين؟", questionEn: "What type of force exists between two unlike charges?", optionsAr: ["تنافر", "جذب", "لا توجد قوة", "تناسب عكسي"], optionsEn: ["Repulsion", "Attraction", "No force", "Inverse proportion"], answer: "جذب", explanationAr: "الشحنات المختلفة تتجاذب، والمتشابهة تتنافر", explanationEn: "Unlike charges attract, like charges repel" },
      ],
    },
    {
      titleAr: "التيار الكهربي والمقاومات",
      titleEn: "Electric Current and Resistors",
      descriptionAr: "دراسة التيار الكهربي وقوانين المقاومات",
      descriptionEn: "Study of electric current and resistor laws",
      introductionAr: "التيار الكهربي هو تدفق الشحنات الكهربية في موصل. يُقاس بالأمبير ويرمز له بالرمز I. المقاومة هي ممانعة المادة لمرور التيار.",
      introductionEn: "Electric current is the flow of electric charges in a conductor. It's measured in Amperes and symbolized by I. Resistance is the material's opposition to current flow.",
      summaryAr: "قانون أوم: I = V/R. توصيل المقاومات: توالي (المقاومات تُجمع)، توازي (المقاومات تُقسم). القدرة الكهربية: P = VI = I²R.",
      summaryEn: "Ohm's law: I = V/R. Resistor connections: series (resistances add), parallel (resistances divide). Electric power: P = VI = I²R.",
      objectives: [
        { textAr: "فهم مفهوم التيار الكهربي", textEn: "Understand electric current concept" },
        { textAr: "تطبيق قانون أوم", textEn: "Apply Ohm's law" },
        { textAr: "حل دوائر المقاومات", textEn: "Solve resistor circuits" },
      ],
      concepts: [
        { termAr: "التيار الكهربي", termEn: "Electric Current", definitionAr: "معدل تدفق الشحنة خلال مقطع موصل", definitionEn: "Rate of charge flow through a conductor cross-section" },
        { termAr: "المقاومة", termEn: "Resistance", definitionAr: "ممانعة المادة لمرور التيار الكهربي", definitionEn: "Material's opposition to electric current flow" },
        { termAr: "فرق الجهد", termEn: "Potential Difference", definitionAr: "الفرق في الجهد الكهربي بين نقطتين", definitionEn: "Difference in electric potential between two points" },
      ],
      formulas: [
        { formula: "I = Q/t", explanationAr: "التيار = الشحنة / الزمن", explanationEn: "Current = Charge / Time" },
        { formula: "V = IR", explanationAr: "قانون أوم", explanationEn: "Ohm's law" },
        { formula: "P = VI = I²R", explanationAr: "القدرة الكهربية", explanationEn: "Electric power" },
      ],
      examples: [
        {
          questionAr: "مقاومة 10Ω موصلة بمصدر جهد 20V. أوجد التيار والقدرة.",
          questionEn: "A 10Ω resistor is connected to a 20V source. Find the current and power.",
          solutionAr: "I = 2A, P = 40W",
          solutionEn: "I = 2A, P = 40W",
          stepsAr: "1. I = V/R = 20/10 = 2A  2. P = VI = 20 × 2 = 40W",
          stepsEn: "1. I = V/R = 20/10 = 2A  2. P = VI = 20 × 2 = 40W",
        },
      ],
      questions: [
        { questionAr: "ما وحدة قياس المقاومة؟", questionEn: "What is the unit of resistance?", optionsAr: ["أمبير", "فولت", "أوم", "واط"], optionsEn: ["Ampere", "Volt", "Ohm", "Watt"], answer: "أوم", explanationAr: "وحدة قياس المقاومة هي الأوم (Ω)", explanationEn: "The unit of resistance is Ohm (Ω)" },
      ],
    },
    {
      titleAr: "الكهرومغناطيسية",
      titleEn: "Electromagnetism",
      descriptionAr: "دراسة العلاقة بين الكهرباء والمغناطيسية",
      descriptionEn: "Study of the relationship between electricity and magnetism",
      introductionAr: "الكهرومغناطيسية تدرس العلاقة بين المجالات الكهربية والمغناطيسية. اكتشف فاراداي أن تغير المجال المغناطيسي يولد تياراً كهربياً.",
      introductionEn: "Electromagnetism studies the relationship between electric and magnetic fields. Faraday discovered that changing magnetic field generates electric current.",
      summaryAr: "قانون فاراداي: القوة الدافعة الكهربية = -dΦ/dt. قانون لينز: اتجاه التيار المعارض للتغير. قانون أمبير: المجال المغناطيسي حول سلك يمر به تيار.",
      summaryEn: "Faraday's law: EMF = -dΦ/dt. Lenz's law: direction of current opposing change. Ampere's law: magnetic field around a current-carrying wire.",
      objectives: [
        { textAr: "فهم الحث الكهرومغناطيسي", textEn: "Understand electromagnetic induction" },
        { textAr: "تطبيق قانون فاراداي", textEn: "Apply Faraday's law" },
        { textAr: "فهم عمل المحولات والمولدات", textEn: "Understand transformers and generators" },
      ],
      concepts: [
        { termAr: "الحث الكهرومغناطيسي", termEn: "Electromagnetic Induction", definitionAr: "توليد تيار كهربي من مجال مغناطيسي متغير", definitionEn: "Generation of electric current from changing magnetic field" },
        { termAr: "الفيض المغناطيسي", termEn: "Magnetic Flux", definitionAr: "عدد خطوط المجال المغناطيسي穿过 مساحة معينة", definitionEn: "Number of magnetic field lines through a certain area" },
        { termAr: "المحول", termEn: "Transformer", definitionAr: "جهاز يرفع أو يخفض الجهد الكهربي", definitionEn: "A device that increases or decreases electric voltage" },
      ],
      formulas: [
        { formula: "ε = -N(dΦ/dt)", explanationAr: "قانون فاراداي للحث", explanationEn: "Faraday's law of induction" },
        { formula: "B = μ₀I/2πr", explanationAr: "المجال المغناطيسي حول سلك", explanationEn: "Magnetic field around a wire" },
        { formula: "V₁/V₂ = N₁/N₂", explanationAr: "نسبة تحويل المحول", explanationEn: "Transformer turn ratio" },
      ],
      examples: [
        {
          questionAr: "ملف من 100 لفة يتغير الفيض المغناطيسي خلاله من 0.1Wb إلى 0.05Wb خلال 0.2s. أوجد القوة الدافعة الكهربية.",
          questionEn: "A coil of 100 turns has magnetic flux changing from 0.1Wb to 0.05Wb in 0.2s. Find the EMF.",
          solutionAr: "ε = 25V",
          solutionEn: "ε = 25V",
          stepsAr: "1. ΔΦ = 0.1 - 0.05 = 0.05Wb  2. ε = -N(ΔΦ/Δt) = -100(0.05/0.2) = -25V  3. القيمة المطلقة = 25V",
          stepsEn: "1. ΔΦ = 0.1 - 0.05 = 0.05Wb  2. ε = -N(ΔΦ/Δt) = -100(0.05/0.2) = -25V  3. Absolute value = 25V",
        },
      ],
      questions: [
        { questionAr: "من اكتشف الحث الكهرومغناطيسي؟", questionEn: "Who discovered electromagnetic induction?", optionsAr: ["نيوتن", "أينشتاين", "فاراداي", "أمبير"], optionsEn: ["Newton", "Einstein", "Faraday", "Ampere"], answer: "فاراداي", explanationAr: "اكتشف مايكل فاراداي الحث الكهرومغناطيسي عام 1831", explanationEn: "Michael Faraday discovered electromagnetic induction in 1831" },
      ],
    },
  ],
  // دروس الكيمياء
  "chemistry": [
    {
      titleAr: "التوازن الكيميائي",
      titleEn: "Chemical Equilibrium",
      descriptionAr: "دراسة التوازن الكيميائي ومبدأ لوشاتيليه",
      descriptionEn: "Study of chemical equilibrium and Le Chatelier's principle",
      introductionAr: "التوازن الكيميائي هو حالة يتساوى فيها معدل التفاعل الأمامي والخلفي. يكون التفاعل قابلاً للعكس ويصل لحالة ثبات.",
      introductionEn: "Chemical equilibrium is a state where the rate of forward and reverse reactions are equal. The reaction is reversible and reaches a steady state.",
      summaryAr: "ثابت التوازن K: نسبة حاصل ضرب التراكيز. مبدأ لوشاتيليه: النظام يقاوم التغيير. العوامل المؤثرة: التركيز، الضغط، درجة الحرارة.",
      summaryEn: "Equilibrium constant K: ratio of concentration products. Le Chatelier's principle: system resists change. Affecting factors: concentration, pressure, temperature.",
      objectives: [
        { textAr: "فهم مفهوم التوازن الكيميائي", textEn: "Understand chemical equilibrium concept" },
        { textAr: "حساب ثابت التوازن", textEn: "Calculate equilibrium constant" },
        { textAr: "تطبيق مبدأ لوشاتيليه", textEn: "Apply Le Chatelier's principle" },
      ],
      concepts: [
        { termAr: "ثابت التوازن", termEn: "Equilibrium Constant", definitionAr: "نسبة حاصل ضرب تراكيز النواتج على المتفاعلات", definitionEn: "Ratio of product concentrations to reactants" },
        { termAr: "التفاعل العكسي", termEn: "Reversible Reaction", definitionAr: "تفاعل يسير في الاتجاهين", definitionEn: "A reaction proceeding in both directions" },
        { termAr: "مبدأ لوشاتيليه", termEn: "Le Chatelier's Principle", definitionAr: "النظام في توازن يقاوم التغيير المفروض", definitionEn: "System at equilibrium resists imposed change" },
      ],
      formulas: [
        { formula: "K = [C]^c[D]^d / [A]^a[B]^b", explanationAr: "ثابت التوازل للتفاعل aA + bB ⇌ cC + dD", explanationEn: "Equilibrium constant for reaction aA + bB ⇌ cC + dD" },
        { formula: "Q = [C]^c[D]^d / [A]^a[B]^b", explanationAr: "حاصل التفاعل في أي لحظة", explanationEn: "Reaction quotient at any moment" },
      ],
      examples: [
        {
          questionAr: "للتفاعل N₂ + 3H₂ ⇌ 2NH₃، إذا كان [N₂] = 0.1M, [H₂] = 0.2M, [NH₃] = 0.5M. أوجد K.",
          questionEn: "For reaction N₂ + 3H₂ ⇌ 2NH₃, if [N₂] = 0.1M, [H₂] = 0.2M, [NH₃] = 0.5M. Find K.",
          solutionAr: "K = 312.5",
          solutionEn: "K = 312.5",
          stepsAr: "K = [NH₃]² / ([N₂][H₂]³) = (0.5)² / (0.1 × (0.2)³) = 0.25 / 0.0008 = 312.5",
          stepsEn: "K = [NH₃]² / ([N₂][H₂]³) = (0.5)² / (0.1 × (0.2)³) = 0.25 / 0.0008 = 312.5",
        },
      ],
      questions: [
        { questionAr: "ماذا يحدث للتوازن عند زيادة تركيز المتفاعلات؟", questionEn: "What happens to equilibrium when reactant concentration increases?", optionsAr: ["ينزاح للخلف", "ينزاح للأمام", "لا يتغير", "يتوقف"], optionsEn: ["Shifts backward", "Shifts forward", "No change", "Stops"], answer: "ينزاح للأمام", explanationAr: "حسب مبدأ لوشاتيليه، زيادة المتفاعلات تنزاح التوازن للأمام لاستهلاك الزيادة", explanationEn: "According to Le Chatelier's principle, increasing reactants shifts equilibrium forward to consume the increase" },
      ],
    },
    {
      titleAr: "الكيمياء الكهربية",
      titleEn: "Electrochemistry",
      descriptionAr: "دراسة الخلايا الكهروكيميائية والتحليل الكهربي",
      descriptionEn: "Study of electrochemical cells and electrolysis",
      introductionAr: "الكيمياء الكهربية تدرس تحويل الطاقة الكيميائية إلى طاقة كهربية والعكس. تشمل الخلايا الجلفانية والخلايا الإلكتروليتية.",
      introductionEn: "Electrochemistry studies the conversion of chemical energy to electrical energy and vice versa. It includes galvanic cells and electrolytic cells.",
      summaryAr: "الخلايا الجلفانية: تحول طاقة كيميائية لكهربية. القطب القياسي للهيدروجين: مرجع لقياس جهود الأقطاب. قانون فاراداي: كتلة المادة المترسبة تتناسب مع كمية الكهرباء.",
      summaryEn: "Galvanic cells: convert chemical to electrical energy. Standard hydrogen electrode: reference for measuring electrode potentials. Faraday's law: deposited mass proportional to electricity quantity.",
      objectives: [
        { textAr: "فهم آلية الخلايا الكهروكيميائية", textEn: "Understand electrochemical cell mechanism" },
        { textAr: "حساب جهد الخلية", textEn: "Calculate cell potential" },
        { textAr: "تطبيق قانون فاراداي", textEn: "Apply Faraday's law" },
      ],
      concepts: [
        { termAr: "الخلية الجلفانية", termEn: "Galvanic Cell", definitionAr: "خلية تحول الطاقة الكيميائية إلى كهربية", definitionEn: "A cell converting chemical to electrical energy" },
        { termAr: "القطب الأنود", termEn: "Anode", definitionAr: "القطب الذي يحدث عنده التأكسد", definitionEn: "The electrode where oxidation occurs" },
        { termAr: "القطب الكاثود", termEn: "Cathode", definitionAr: "القطب الذي يحدث عنده الاختزال", definitionEn: "The electrode where reduction occurs" },
      ],
      formulas: [
        { formula: "E°cell = E°cathode - E°anode", explanationAr: "جهد الخلية القياسي", explanationEn: "Standard cell potential" },
        { formula: "m = (M × I × t) / (n × F)", explanationAr: "قانون فاراداي للتحليل الكهربي", explanationEn: "Faraday's law of electrolysis" },
        { formula: "F = 96485 C/mol", explanationAr: "ثابت فاراداي", explanationEn: "Faraday's constant" },
      ],
      examples: [
        {
          questionAr: "أوجد جهد خلية النحاس والزنك إذا كان E°Cu = +0.34V و E°Zn = -0.76V",
          questionEn: "Find the potential of copper-zinc cell if E°Cu = +0.34V and E°Zn = -0.76V",
          solutionAr: "E°cell = 1.10V",
          solutionEn: "E°cell = 1.10V",
          stepsAr: "الزنك أنود (يحدث عنده التأكسد)، النحاس كاثود  E°cell = 0.34 - (-0.76) = 1.10V",
          stepsEn: "Zinc is anode (oxidation occurs), Copper is cathode  E°cell = 0.34 - (-0.76) = 1.10V",
        },
      ],
      questions: [
        { questionAr: "ما هو القطب الذي يحدث عنده التأكسد؟", questionEn: "At which electrode does oxidation occur?", optionsAr: ["الكاثود", "الأنود", "القنطر الملحية", "المحلول"], optionsEn: ["Cathode", "Anode", "Salt bridge", "Solution"], answer: "الأنود", explanationAr: "التأكسد يحدث عند الأنود (فقدان إلكترونات)", explanationEn: "Oxidation occurs at the anode (loss of electrons)" },
      ],
    },
    {
      titleAr: "الكيمياء العضوية - الهيدروكربونات",
      titleEn: "Organic Chemistry - Hydrocarbons",
      descriptionAr: "دراسة الهيدروكربونات وأنواعها وتفاعلاتها",
      descriptionEn: "Study of hydrocarbons, their types, and reactions",
      introductionAr: "الهيدروكربونات هي مركبات عضوية تتكون من الكربون والهيدروجين فقط. تُقسم إلى أليفاتية (ألكانات، ألكينات، ألكاينات) وأروماتية.",
      introductionEn: "Hydrocarbons are organic compounds consisting of carbon and hydrogen only. They're divided into aliphatic (alkanes, alkenes, alkynes) and aromatic.",
      summaryAr: "الألكانات: روابط أحادية فقط، صيغة CnH2n+2. الألكينات: رابطة مزدوجة، صيغة CnH2n. الألكاينات: رابطة ثلاثية، صيغة CnH2n-2. الأروماتية: تحتوي حلقة البنزين.",
      summaryEn: "Alkanes: single bonds only, formula CnH2n+2. Alkenes: double bond, formula CnH2n. Alkynes: triple bond, formula CnH2n-2. Aromatic: contain benzene ring.",
      objectives: [
        { textAr: "التعرف على أنواع الهيدروكربونات", textEn: "Identify types of hydrocarbons" },
        { textAr: "تسمية المركبات العضوية", textEn: "Name organic compounds" },
        { textAr: "فهم تفاعلات الهيدروكربونات", textEn: "Understand hydrocarbon reactions" },
      ],
      concepts: [
        { termAr: "الألكانات", termEn: "Alkanes", definitionAr: "هيدروكربونات مشبعة بروابط أحادية", definitionEn: "Saturated hydrocarbons with single bonds" },
        { termAr: "الألكينات", termEn: "Alkenes", definitionAr: "هيدروكربونات تحتوي رابطة مزدوجة", definitionEn: "Hydrocarbons containing a double bond" },
        { termAr: "التشاكل", termEn: "Isomerism", definitionAr: "وجود مركبات مختلفة بنفس الصيغة الجزيئية", definitionEn: "Existence of different compounds with same molecular formula" },
      ],
      formulas: [
        { formula: "CnH2n+2 (الألكانات)", explanationAr: "صيغة الألكانات العامة", explanationEn: "General formula for alkanes" },
        { formula: "CnH2n (الألكينات)", explanationAr: "صيغة الألكينات العامة", explanationEn: "General formula for alkenes" },
        { formula: "CnH2n-2 (الألكاينات)", explanationAr: "صيغة الألكاينات العامة", explanationEn: "General formula for alkynes" },
      ],
      examples: [
        {
          questionAr: "ما صيغة البيوتان C4H10؟",
          questionEn: "What is the formula of butane C4H10?",
          solutionAr: "البيوتان: CH₃-CH₂-CH₂-CH₃",
          solutionEn: "Butane: CH₃-CH₂-CH₂-CH₃",
          stepsAr: "البيوتان ألكان من 4 كربون  تطبق الصيغة CnH2n+2  C₄H(2×4+2) = C₄H₁₀",
          stepsEn: "Butane is an alkane with 4 carbons  Apply formula CnH2n+2  C₄H(2×4+2) = C₄H₁₀",
        },
      ],
      questions: [
        { questionAr: "ما نوع الرابطة في الألكينات؟", questionEn: "What type of bond is in alkenes?", optionsAr: ["رابطة أحادية فقط", "رابطة مزدوجة", "رابطة ثلاثية", "رابطة أيونية"], optionsEn: ["Single bond only", "Double bond", "Triple bond", "Ionic bond"], answer: "رابطة مزدوجة", explanationAr: "الألكينات تتميز بوجود رابطة مزدوجة واحدة على الأقل بين ذرتي كربون", explanationEn: "Alkenes are characterized by at least one double bond between carbon atoms" },
      ],
    },
  ],
  // دروس الأحياء
  "biology": [
    {
      titleAr: "الوراثة المندلية",
      titleEn: "Mendelian Genetics",
      descriptionAr: "دراسة قوانين الوراثة المندلية والتوارث",
      descriptionEn: "Study of Mendelian inheritance laws and genetics",
      introductionAr: "اكتشف جريجور مندل قوانين الوراثة من خلال تجاربه على نبات البازلاء. وضع قانوني الوراثة: قانون الانعزال وقانون التوزيع المستقل.",
      introductionEn: "Gregor Mendel discovered inheritance laws through his experiments on pea plants. He established two inheritance laws: law of segregation and law of independent assortment.",
      summaryAr: "القانون الأول: ينفصل العاملان الوراثيان عند تكوين الأمشاج. القانون الثاني: يتوزع كل زوج من العوامل بشكل مستقل. النسبة النمطية: 3:1 في الجيل الثاني.",
      summaryEn: "First law: two genetic factors segregate during gamete formation. Second law: each pair of factors distributes independently. Phenotypic ratio: 3:1 in second generation.",
      objectives: [
        { textAr: "فهم قوانين مندل للوراثة", textEn: "Understand Mendel's inheritance laws" },
        { textAr: "تطبيق مربع بونت في التهجين", textEn: "Apply Punnett square in crosses" },
        { textAr: "حساب النسب الوراثية", textEn: "Calculate genetic ratios" },
      ],
      concepts: [
        { termAr: "الأليل", termEn: "Allele", definitionAr: "صيغ بديلة للجين نفسه", definitionEn: "Alternative forms of the same gene" },
        { termAr: "النمط الجيني", termEn: "Genotype", definitionAr: "التركيب الوراثي للفرد", definitionEn: "The genetic makeup of an individual" },
        { termAr: "النمط الظاهري", termEn: "Phenotype", definitionAr: "الصفات الظاهرة للفرد", definitionEn: "The visible traits of an individual" },
      ],
      examples: [
        {
          questionAr: "إذا كان T سائداً و t متنحياً، ما نتيجة تهجين Tt × Tt؟",
          questionEn: "If T is dominant and t is recessive, what is the result of Tt × Tt cross?",
          solutionAr: "النمط الجيني: 1TT : 2Tt : 1tt، النمط الظاهري: 3 سائد : 1 متنحي",
          solutionEn: "Genotype: 1TT : 2Tt : 1tt, Phenotype: 3 dominant : 1 recessive",
          stepsAr: "مربع بونت:  TT: 25%، Tt: 50%، tt: 25%  النمط الظاهري: 75% سائد، 25% متنحي",
          stepsEn: "Punnett square: TT: 25%, Tt: 50%, tt: 25%  Phenotype: 75% dominant, 25% recessive",
        },
      ],
      questions: [
        { questionAr: "ما نسبة النمط الظاهري في الجيل الثاني من تهجين أحادي الهجين؟", questionEn: "What is the phenotypic ratio in F2 of a monohybrid cross?", optionsAr: ["1:1", "3:1", "1:2:1", "9:3:3:1"], optionsEn: ["1:1", "3:1", "1:2:1", "9:3:3:1"], answer: "3:1", explanationAr: "في تهجين أحادي الهجين، نسبة النمط الظاهري في الجيل الثاني هي 3 سائد : 1 متنحي", explanationEn: "In monohybrid cross, the phenotypic ratio in F2 is 3 dominant : 1 recessive" },
      ],
    },
    {
      titleAr: "الحمض النووي DNA والتركيب الوراثي",
      titleEn: "DNA and Genetic Structure",
      descriptionAr: "دراسة تركيب DNA وآلية تضاعفه",
      descriptionEn: "Study of DNA structure and replication mechanism",
      introductionAr: "الحمض النووي DNA هو المادة الوراثية في الكائنات الحية. اكتشف واتسون وكريك تركيبه الحلزوني المزدوج عام 1953.",
      introductionEn: "DNA is the genetic material in living organisms. Watson and Crick discovered its double helix structure in 1953.",
      summaryAr: "تركيب DNA: سلسلتان من النيوكليوتيدات ملتفة حلزونياً. النيوكليوتيد: سكر خماسي، مجموعة فوسفات، قاعدة نيتروجينية. التكامل: A مع T، G مع C.",
      summaryEn: "DNA structure: two strands of nucleotides coiled helically. Nucleotide: pentose sugar, phosphate group, nitrogenous base. Complementarity: A with T, G with C.",
      objectives: [
        { textAr: "فهم تركيب DNA", textEn: "Understand DNA structure" },
        { textAr: "معرفة آلية التضاعف", textEn: "Know replication mechanism" },
        { textAr: "فهم الشفرة الوراثية", textEn: "Understand genetic code" },
      ],
      concepts: [
        { termAr: "النيوكليوتيد", termEn: "Nucleotide", definitionAr: "وحدة بناء الأحماض النووية", definitionEn: "Building block of nucleic acids" },
        { termAr: "القواعد النيتروجينية", termEn: "Nitrogenous Bases", definitionAr: "الأدينين، الجوانين، الثايمين، السيتوزين", definitionEn: "Adenine, Guanine, Thymine, Cytosine" },
        { termAr: "التضاعف الشبه محافظ", termEn: "Semi-conservative Replication", definitionAr: "كل سلسلة جديدة تحتوي سلسلة أصلية", definitionEn: "Each new strand contains one original strand" },
      ],
      formulas: [
        { formula: "A = T و G = C", explanationAr: "قاعدة شارغاف للتكامل القاعدي", explanationEn: "Chargaff's rule for base pairing" },
        { formula: "(A + G) = (T + C)", explanationAr: "البيورينات = البيريميدينات", explanationEn: "Purines = Pyrimidines" },
      ],
      examples: [
        {
          questionAr: "إذا كانت نسبة الأدينين في DNA هي 30%، ما نسبة الجوانين؟",
          questionEn: "If adenine percentage in DNA is 30%, what is guanine percentage?",
          solutionAr: "الجوانين = 20%",
          solutionEn: "Guanine = 20%",
          stepsAr: "A = T = 30%  A + T = 60%  G + C = 40%  G = C = 20%",
          stepsEn: "A = T = 30%  A + T = 60%  G + C = 40%  G = C = 20%",
        },
      ],
      questions: [
        { questionAr: "من اكتشف التركيب الحلزوني المزدوج لـ DNA؟", questionEn: "Who discovered the double helix structure of DNA?", optionsAr: ["مندل", "واتسون وكريك", "داروين", "لامارك"], optionsEn: ["Mendel", "Watson and Crick", "Darwin", "Lamarck"], answer: "واتسون وكريك", explanationAr: "اكتشف جيمس واتسون وفرانسيس كريك التركيب الحلزوني المزدوج لـ DNA عام 1953", explanationEn: "James Watson and Francis Crick discovered the double helix structure of DNA in 1953" },
      ],
    },
  ],
  // دروس التاريخ
  "history": [
    {
      titleAr: "الحملة الفرنسية على مصر",
      titleEn: "French Campaign in Egypt",
      descriptionAr: "دراسة الحملة الفرنسية على مصر 1798-1801",
      descriptionEn: "Study of the French Campaign in Egypt 1798-1801",
      introductionAr: "قاد نابليون بونابرت حملة فرنسية على مصر عام 1798. أثرت الحملة على مصر سياسياً وعلمياً وثقافياً.",
      introductionEn: "Napoleon Bonaparte led a French campaign to Egypt in 1798. The campaign affected Egypt politically, scientifically, and culturally.",
      summaryAr: "أسباب الحملة: ضرب المصالح البريطانية، تأمين طريق الهند. نتائجها: تأسيس المجمع العلمي، اكتشاف حجر رشيد، نهضة علمية وثقافية.",
      summaryEn: "Campaign reasons: strike British interests, secure route to India. Results: founding Scientific Institute, discovery of Rosetta Stone, scientific and cultural renaissance.",
      objectives: [
        { textAr: "فهم أسباب الحملة الفرنسية", textEn: "Understand reasons for French campaign" },
        { textAr: "تحليل نتائج الحملة على مصر", textEn: "Analyze campaign effects on Egypt" },
        { textAr: "تقييم الأثر الحضاري للحملة", textEn: "Evaluate campaign's civilizational impact" },
      ],
      concepts: [
        { termAr: "حجر رشيد", termEn: "Rosetta Stone", definitionAr: "حجر اكتشفه الفرنسيون ومكن من فك رموز الهيروغليفية", definitionEn: "Stone discovered by French enabling decoding hieroglyphics" },
        { termAr: "المجمع العلمي", termEn: "Scientific Institute", definitionAr: "مؤسسة علمية أسسها نابليون في مصر", definitionEn: "Scientific institution founded by Napoleon in Egypt" },
        { termAr: "وصف مصر", termEn: "Description de l'Égypte", definitionAr: "موسوعة علمية شاملة عن مصر", definitionEn: "Comprehensive scientific encyclopedia about Egypt" },
      ],
      questions: [
        { questionAr: "متى بدأت الحملة الفرنسية على مصر؟", questionEn: "When did the French campaign in Egypt begin?", optionsAr: ["1798", "1801", "1805", "1882"], optionsEn: ["1798", "1801", "1805", "1882"], answer: "1798", explanationAr: "بدأت الحملة الفرنسية على مصر عام 1798 بقيادة نابليون بونابرت", explanationEn: "The French campaign in Egypt began in 1798 led by Napoleon Bonaparte" },
      ],
    },
  ],
  // دروس الجغرافيا
  "geography": [
    {
      titleAr: "جغرافيا مصر الطبيعية",
      titleEn: "Physical Geography of Egypt",
      descriptionAr: "دراسة الخصائص الطبيعية لمصر",
      descriptionEn: "Study of Egypt's physical characteristics",
      introductionAr: "تتميز مصر بموقعها الجغرافي الفريد في شمال شرق أفريقيا. تتنوع تضاريسها بين وادي النيل والدلتا والصحراء.",
      introductionEn: "Egypt is distinguished by its unique geographical location in northeast Africa. Its terrain varies between the Nile Valley, Delta, and desert.",
      summaryAr: "مساحة مصر: حوالي مليون كم². التقسيمات: وادي النيل والدلتا، الصحراء الغربية، الصحراء الشرقية، شبه جزيرة سيناء. نهر النيل: الشريان الحيوي لمصر.",
      summaryEn: "Egypt's area: about one million km². Divisions: Nile Valley and Delta, Western Desert, Eastern Desert, Sinai Peninsula. River Nile: Egypt's vital artery.",
      objectives: [
        { textAr: "التعرف على موقع مصر الجغرافي", textEn: "Identify Egypt's geographical location" },
        { textAr: "فهم تضاريس مصر", textEn: "Understand Egypt's terrain" },
        { textAr: "دراسة أهمية نهر النيل", textEn: "Study the importance of River Nile" },
      ],
      concepts: [
        { termAr: "دلتا النيل", termEn: "Nile Delta", definitionAr: "مثلث رسوبي عند مصب نهر النيل", definitionEn: "Sedimentary triangle at Nile mouth" },
        { termAr: "الوادي", termEn: "Valley", definitionAr: "المنطقة الخصبة على جانبي نهر النيل", definitionEn: "Fertile region on both sides of the Nile" },
        { termAr: "الصحراء الكبرى", termEn: "Great Desert", definitionAr: "امتداد صحراوي واسع في شمال أفريقيا", definitionEn: "Vast desert expanse in North Africa" },
      ],
      questions: [
        { questionAr: "ما هي مساحة مصر تقريباً؟", questionEn: "What is Egypt's approximate area?", optionsAr: ["500 ألف كم²", "مليون كم²", "2 مليون كم²", "3 مليون كم²"], optionsEn: ["500 thousand km²", "One million km²", "2 million km²", "3 million km²"], answer: "مليون كم²", explanationAr: "تبلغ مساحة جمهورية مصر العربية حوالي 1,002,000 كيلومتر مربع", explanationEn: "The area of the Arab Republic of Egypt is about 1,002,000 square kilometers" },
      ],
    },
  ],
  // دروس الفلسفة
  "philosophy": [
    {
      titleAr: "المشكلات الفلسفية الكبرى",
      titleEn: "Major Philosophical Problems",
      descriptionAr: "دراسة المشكلات الفلسفية الأساسية",
      descriptionEn: "Study of fundamental philosophical problems",
      introductionAr: "تتناول الفلسفة أسئلة جوهرية حول الوجود والمعرفة والقيم. من أهم المشكلات: مشكلة الوجود، مشكلة المعرفة، مشكلة الأخلاق.",
      introductionEn: "Philosophy addresses essential questions about existence, knowledge, and values. Major problems include: existence problem, knowledge problem, ethics problem.",
      summaryAr: "مشكلة الوجود: ما طبيعة الواقع؟ مشكلة المعرفة: كيف نعرف؟ مشكلة الأخلاق: ما الصواب والخطأ؟ مشكلة الحرية: هل الإنسان حر؟",
      summaryEn: "Existence problem: what is the nature of reality? Knowledge problem: how do we know? Ethics problem: what is right and wrong? Freedom problem: is man free?",
      objectives: [
        { textAr: "فهم طبيعة المشكلات الفلسفية", textEn: "Understand nature of philosophical problems" },
        { textAr: "تحليل المواقف الفلسفية المختلفة", textEn: "Analyze different philosophical positions" },
        { textAr: "تكوين رأي فلسفي شخصي", textEn: "Form personal philosophical opinion" },
      ],
      concepts: [
        { termAr: "الميتافيزيقا", termEn: "Metaphysics", definitionAr: "دراسة ما وراء الطبيعة والوجود", definitionEn: "Study of beyond nature and existence" },
        { termAr: "المعرفة", termEn: "Epistemology", definitionAr: "دراسة طبيعة ونطاق المعرفة", definitionEn: "Study of nature and scope of knowledge" },
        { termAr: "الأخلاق", termEn: "Ethics", definitionAr: "دراسة المبادئ الأخلاقية والقيم", definitionEn: "Study of moral principles and values" },
      ],
      questions: [
        { questionAr: "ما هي الميتافيزيقا؟", questionEn: "What is metaphysics?", optionsAr: ["دراسة المعرفة", "دراسة ما وراء الطبيعة", "دراسة الأخلاق", "دراسة المنطق"], optionsEn: ["Study of knowledge", "Study of beyond nature", "Study of ethics", "Study of logic"], answer: "دراسة ما وراء الطبيعة", explanationAr: "الميتافيزيقا هي الفرع الفلسفي الذي يدرس ما وراء الطبيعة والوجود", explanationEn: "Metaphysics is the philosophical branch studying beyond nature and existence" },
      ],
    },
  ],
  // دروس علم النفس والاجتماع
  "psychology": [
    {
      titleAr: "أساسيات علم النفس",
      titleEn: "Psychology Basics",
      descriptionAr: "دراسة المفاهيم الأساسية في علم النفس",
      descriptionEn: "Study of basic concepts in psychology",
      introductionAr: "علم النفس هو دراسة السلوك والعمليات العقلية. يهتم بفهم كيف يفكر الناس ويشعرون ويتصرفون.",
      introductionEn: "Psychology is the study of behavior and mental processes. It's concerned with understanding how people think, feel, and behave.",
      summaryAr: "فروع علم النفس: العام، التربوي، clínical، الاجتماعي، الصناعي. المدارس: البنيوية، الوظيفية، السلوكية، المعرفية، التحليلية.",
      summaryEn: "Psychology branches: General, Educational, Clinical, Social, Industrial. Schools: Structuralism, Functionalism, Behaviorism, Cognitive, Psychoanalytic.",
      objectives: [
        { textAr: "فهم مفهوم علم النفس", textEn: "Understand psychology concept" },
        { textAr: "التعرف على فروع علم النفس", textEn: "Identify psychology branches" },
        { textAr: "فهم المدارس النفسية", textEn: "Understand psychological schools" },
      ],
      concepts: [
        { termAr: "السلوك", termEn: "Behavior", definitionAr: "كل ما يصدر عن الفرد من أفعال قابلة للملاحظة", definitionEn: "All observable actions emitted by an individual" },
        { termAr: "الإدراك", termEn: "Perception", definitionAr: "عملية تفسير المعلومات الحسية", definitionEn: "Process of interpreting sensory information" },
        { termAr: "الدافعية", termEn: "Motivation", definitionAr: "القوة التي تدفع الفرد للسلوك", definitionEn: "The force driving individual behavior" },
      ],
      questions: [
        { questionAr: "ما هو موضوع دراسة علم النفس؟", questionEn: "What is the subject of psychology study?", optionsAr: ["الجسم فقط", "السلوك والعمليات العقلية", "الروح فقط", "المجتمع"], optionsEn: ["Body only", "Behavior and mental processes", "Soul only", "Society"], answer: "السلوك والعمليات العقلية", explanationAr: "علم النفس يدرس السلوك الظاهر والعمليات العقلية الباطنة", explanationEn: "Psychology studies observable behavior and internal mental processes" },
      ],
    },
  ],
};

// ========================================
// دالة إنشاء بيانات درس افتراضي
// ========================================
function generateLessonData(
  subjectType: string,
  lessonIndex: number,
  unitIndex: number
): {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  introductionAr: string;
  introductionEn: string;
  summaryAr: string;
  summaryEn: string;
  objectives: Array<{ textAr: string; textEn: string }>;
  concepts: Array<{ termAr: string; termEn: string; definitionAr: string; definitionEn: string }>;
  formulas?: Array<{ formula: string; explanationAr: string; explanationEn: string }>;
  questions: Array<{ questionAr: string; questionEn: string; optionsAr: string[]; optionsEn: string[]; answer: string; explanationAr: string; explanationEn: string }>;
} {
  // التحقق من وجود بيانات الدرس
  const lessonData = lessonsData[subjectType];
  if (lessonData && lessonIndex < lessonData.length) {
    return lessonData[lessonIndex];
  }

  // بيانات افتراضية
  const defaultLessons: Record<string, Array<{ titleAr: string; titleEn: string }>> = {
    arabic: [
      { titleAr: "النصوص الأدبية", titleEn: "Literary Texts" },
      { titleAr: "قواعد النحو", titleEn: "Grammar Rules" },
      { titleAr: "البلاغة", titleEn: "Rhetoric" },
      { titleAr: "الأدب المقارن", titleEn: "Comparative Literature" },
      { titleAr: "النقد الأدبي", titleEn: "Literary Criticism" },
    ],
    english: [
      { titleAr: "Reading Comprehension", titleEn: "Reading Comprehension" },
      { titleAr: "Grammar", titleEn: "Grammar" },
      { titleAr: "Writing Skills", titleEn: "Writing Skills" },
      { titleAr: "Literature", titleEn: "Literature" },
      { titleAr: "Translation", titleEn: "Translation" },
    ],
    "second-lang": [
      { titleAr: "القراءة والنصوص", titleEn: "Reading and Texts" },
      { titleAr: "القواعد", titleEn: "Grammar" },
      { titleAr: "التعبير", titleEn: "Expression" },
      { titleAr: "المفردات", titleEn: "Vocabulary" },
      { titleAr: "الترجمة", titleEn: "Translation" },
    ],
    math: [
      { titleAr: "الدوال والنهايات", titleEn: "Functions and Limits" },
      { titleAr: "التفاضل", titleEn: "Differentiation" },
      { titleAr: "التكامل", titleEn: "Integration" },
      { titleAr: "الهندسة التحليلية", titleEn: "Analytic Geometry" },
      { titleAr: "المثلثات", titleEn: "Trigonometry" },
    ],
    physics: [
      { titleAr: "الكهربية الساكنة", titleEn: "Electrostatics" },
      { titleAr: "التيار الكهربي", titleEn: "Electric Current" },
      { titleAr: "الكهرومغناطيسية", titleEn: "Electromagnetism" },
      { titleAr: "الفيزياء الحديثة", titleEn: "Modern Physics" },
      { titleAr: "الضوء والموجات", titleEn: "Light and Waves" },
    ],
    chemistry: [
      { titleAr: "التوازن الكيميائي", titleEn: "Chemical Equilibrium" },
      { titleAr: "الكيمياء الكهربية", titleEn: "Electrochemistry" },
      { titleAr: "الكيمياء العضوية", titleEn: "Organic Chemistry" },
      { titleAr: "الكيمياء التحليلية", titleEn: "Analytical Chemistry" },
      { titleAr: "الترموديناميكا", titleEn: "Thermodynamics" },
    ],
    biology: [
      { titleAr: "الوراثة", titleEn: "Genetics" },
      { titleAr: "البيئة", titleEn: "Ecology" },
      { titleAr: "فسيولوجيا الإنسان", titleEn: "Human Physiology" },
      { titleAr: "التطور", titleEn: "Evolution" },
      { titleAr: "الأحياء الدقيقة", titleEn: "Microbiology" },
    ],
    history: [
      { titleAr: "تاريخ مصر الحديث", titleEn: "Modern Egypt History" },
      { titleAr: "الحضارة المصرية القديمة", titleEn: "Ancient Egyptian Civilization" },
      { titleAr: "تاريخ العالم", titleEn: "World History" },
      { titleAr: "الحروب العالمية", titleEn: "World Wars" },
      { titleAr: "العلاقات الدولية", titleEn: "International Relations" },
    ],
    geography: [
      { titleAr: "الجغرافيا الطبيعية", titleEn: "Physical Geography" },
      { titleAr: "جغرافيا مصر", titleEn: "Geography of Egypt" },
      { titleAr: "الجغرافيا البشرية", titleEn: "Human Geography" },
      { titleAr: "جغرافيا العالم", titleEn: "World Geography" },
      { titleAr: "الجغرافيا الاقتصادية", titleEn: "Economic Geography" },
    ],
    philosophy: [
      { titleAr: "المشكلات الفلسفية", titleEn: "Philosophical Problems" },
      { titleAr: "المنطق", titleEn: "Logic" },
      { titleAr: "الأخلاق", titleEn: "Ethics" },
      { titleAr: "فلسفة العلم", titleEn: "Philosophy of Science" },
      { titleAr: "الفلسفة الإسلامية", titleEn: "Islamic Philosophy" },
    ],
    psychology: [
      { titleAr: "أساسيات علم النفس", titleEn: "Psychology Basics" },
      { titleAr: "علم النفس التربوي", titleEn: "Educational Psychology" },
      { titleAr: "علم الاجتماع", titleEn: "Sociology" },
      { titleAr: "المشكلات الاجتماعية", titleEn: "Social Problems" },
      { titleAr: "علم النفس الاجتماعي", titleEn: "Social Psychology" },
    ],
    math1: [
      { titleAr: "الدوال والنهايات", titleEn: "Functions and Limits" },
      { titleAr: "التفاضل", titleEn: "Differentiation" },
      { titleAr: "تطبيقات التفاضل", titleEn: "Applications of Differentiation" },
      { titleAr: "الهندسة التحليلية", titleEn: "Analytic Geometry" },
      { titleAr: "المثلثات", titleEn: "Trigonometry" },
    ],
    math2: [
      { titleAr: "التكامل", titleEn: "Integration" },
      { titleAr: "تطبيقات التكامل", titleEn: "Applications of Integration" },
      { titleAr: "الجبر الخطي", titleEn: "Linear Algebra" },
      { titleAr: "المثلثات المتقدمة", titleEn: "Advanced Trigonometry" },
      { titleAr: "الاحتمالات", titleEn: "Probability" },
    ],
  };

  const lessons = defaultLessons[subjectType] || defaultLessons.arabic;
  const lesson = lessons[lessonIndex % lessons.length];

  return {
    titleAr: `${lesson.titleAr} - الدرس ${(unitIndex + 1) * 10 + lessonIndex + 1}`,
    titleEn: `${lesson.titleEn} - Lesson ${(unitIndex + 1) * 10 + lessonIndex + 1}`,
    descriptionAr: `شرح تفصيلي لدرس ${lesson.titleAr} من الوحدة ${unitIndex + 1}`,
    descriptionEn: `Detailed explanation of ${lesson.titleEn} lesson from Unit ${unitIndex + 1}`,
    introductionAr: `مقدمة شاملة لدرس ${lesson.titleAr} تتضمن المفاهيم الأساسية والأهداف التعليمية.`,
    introductionEn: `Comprehensive introduction to ${lesson.titleEn} lesson including basic concepts and learning objectives.`,
    summaryAr: `ملخص الدرس: النقاط الرئيسية والمفاهيم الأساسية في ${lesson.titleAr}.`,
    summaryEn: `Lesson summary: Key points and basic concepts in ${lesson.titleEn}.`,
    objectives: [
      { textAr: `فهم مفهوم ${lesson.titleAr}`, textEn: `Understand the concept of ${lesson.titleEn}` },
      { textAr: `تطبيق ما تعلمه في ${lesson.titleAr}`, textEn: `Apply what was learned in ${lesson.titleEn}` },
      { textAr: `تحليل المسائل المتعلقة بـ ${lesson.titleAr}`, textEn: `Analyze problems related to ${lesson.titleEn}` },
    ],
    concepts: [
      { termAr: `المفهوم الأول في ${lesson.titleAr}`, termEn: `First Concept in ${lesson.titleEn}`, definitionAr: "شرح المفهوم الأول بشكل مفصل", definitionEn: "Detailed explanation of the first concept" },
      { termAr: `المفهوم الثاني في ${lesson.titleAr}`, termEn: `Second Concept in ${lesson.titleEn}`, definitionAr: "شرح المفهوم الثاني بشكل مفصل", definitionEn: "Detailed explanation of the second concept" },
    ],
    questions: [
      {
        questionAr: `ما هو المفهوم الأساسي في ${lesson.titleAr}؟`,
        questionEn: `What is the basic concept in ${lesson.titleEn}?`,
        optionsAr: ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
        optionsEn: ["First option", "Second option", "Third option", "Fourth option"],
        answer: "الخيار الأول",
        explanationAr: "هذا هو التفسير الصحيح للإجابة",
        explanationEn: "This is the correct explanation for the answer",
      },
    ],
  };
}

// ========================================
// الدالة الرئيسية
// ========================================
async function main() {
  console.log("🚀 Starting Third Year Seeding...");
  console.log("=" .repeat(50));

  // 1. التأكد من وجود السنة الدراسية
  let thirdYear = await prisma.academicYear.findUnique({
    where: { code: "third-year" },
  });

  if (!thirdYear) {
    console.log("📚 Creating Third Year Academic Year...");
    thirdYear = await prisma.academicYear.create({
      data: {
        nameAr: "الصف الثالث الثانوي",
        nameEn: "Third Year Secondary",
        code: "third-year",
        order: 3,
      },
    });
    console.log("✅ Third Year created");
  } else {
    console.log("📚 Third Year already exists");
  }

  // 2. الحصول على التخصصات
  const scienceSpec = await prisma.specialization.findUnique({ where: { code: "science" } });
  const mathSpec = await prisma.specialization.findUnique({ where: { code: "math" } });
  const artsSpec = await prisma.specialization.findUnique({ where: { code: "arts" } });

  if (!scienceSpec || !mathSpec || !artsSpec) {
    throw new Error("❌ Specializations not found. Please run the main seed first.");
  }

  console.log("✅ Specializations found");

  // 3. إنشاء المواد والوحدات والدروس لكل تخصص
  let totalSubjects = 0;
  let totalUnits = 0;
  let totalLessons = 0;
  let totalObjectives = 0;
  let totalConcepts = 0;
  let totalFormulas = 0;
  let totalQuestions = 0;

  for (const [specCode, spec] of [
    ["science", scienceSpec],
    ["math", mathSpec],
    ["arts", artsSpec],
  ] as const) {
    console.log(`\n🎓 Processing ${spec.nameAr} specialization...`);
    console.log("-".repeat(40));

    const subjects = subjectsConfig[specCode];

    for (const subjectConfig of subjects) {
      console.log(`\n📖 Creating subject: ${subjectConfig.nameAr}`);

      // تحديد نوع المادة
      let subjectType = subjectConfig.slug.split("-")[0];
      if (subjectConfig.slug.includes("math1")) subjectType = "math1";
      if (subjectConfig.slug.includes("math2")) subjectType = "math2";
      if (subjectConfig.slug.includes("second-lang")) subjectType = "second-lang";

      // إنشاء المادة
      const subject = await prisma.subject.upsert({
        where: { slug: subjectConfig.slug },
        update: {
          nameAr: subjectConfig.nameAr,
          nameEn: subjectConfig.nameEn,
          icon: subjectConfig.icon,
          color: subjectConfig.color,
          order: subjectConfig.order,
          yearId: thirdYear.id,
          specializationId: spec.id,
        },
        create: {
          nameAr: subjectConfig.nameAr,
          nameEn: subjectConfig.nameEn,
          slug: subjectConfig.slug,
          icon: subjectConfig.icon,
          color: subjectConfig.color,
          order: subjectConfig.order,
          yearId: thirdYear.id,
          specializationId: spec.id,
        },
      });
      totalSubjects++;

      // الحصول على بيانات الوحدات
      const unitKey = subjectType === "math1" ? "math1" : subjectType === "math2" ? "math2" : subjectType;
      const unitsForSubject = unitsData[unitKey] || unitsData[subjectConfig.slug.split("-")[0]] || [];

      // إنشاء الوحدات
      for (let u = 0; u < subjectConfig.unitsCount; u++) {
        const unitData = unitsForSubject[u] || {
          nameAr: `الوحدة ${u + 1}`,
          nameEn: `Unit ${u + 1}`,
        };

        const unitSlug = `${subjectConfig.slug}-unit-${u + 1}`;

        const unit = await prisma.unit.upsert({
          where: { slug: unitSlug },
          update: {
            nameAr: unitData.nameAr,
            nameEn: unitData.nameEn,
            order: u + 1,
            subjectId: subject.id,
          },
          create: {
            nameAr: unitData.nameAr,
            nameEn: unitData.nameEn,
            slug: unitSlug,
            order: u + 1,
            subjectId: subject.id,
          },
        });
        totalUnits++;

        // إنشاء الدروس
        for (let l = 0; l < subjectConfig.lessonsPerUnit; l++) {
          const lessonData = generateLessonData(subjectType, l, u);
          const lessonSlug = `${unitSlug}-lesson-${l + 1}`;

          const lesson = await prisma.lesson.upsert({
            where: { slug: lessonSlug },
            update: {
              titleAr: lessonData.titleAr,
              titleEn: lessonData.titleEn,
              descriptionAr: lessonData.descriptionAr,
              descriptionEn: lessonData.descriptionEn,
              introductionAr: lessonData.introductionAr,
              introductionEn: lessonData.introductionEn,
              summaryAr: lessonData.summaryAr,
              summaryEn: lessonData.summaryEn,
              duration: 45,
              order: l + 1,
              isFree: l < 2, // أول درسين مجانيان
              unitId: unit.id,
            },
            create: {
              titleAr: lessonData.titleAr,
              titleEn: lessonData.titleEn,
              slug: lessonSlug,
              descriptionAr: lessonData.descriptionAr,
              descriptionEn: lessonData.descriptionEn,
              introductionAr: lessonData.introductionAr,
              introductionEn: lessonData.introductionEn,
              summaryAr: lessonData.summaryAr,
              summaryEn: lessonData.summaryEn,
              duration: 45,
              order: l + 1,
              isFree: l < 2,
              unitId: unit.id,
            },
          });
          totalLessons++;

          // إنشاء الأهداف
          for (const obj of lessonData.objectives) {
            await prisma.objective.create({
              data: {
                lessonId: lesson.id,
                textAr: obj.textAr,
                textEn: obj.textEn,
                order: lessonData.objectives.indexOf(obj) + 1,
              },
            });
            totalObjectives++;
          }

          // إنشاء المفاهيم
          for (const concept of lessonData.concepts) {
            await prisma.concept.create({
              data: {
                lessonId: lesson.id,
                termAr: concept.termAr,
                termEn: concept.termEn,
                definitionAr: concept.definitionAr,
                definitionEn: concept.definitionEn,
                order: lessonData.concepts.indexOf(concept) + 1,
              },
            });
            totalConcepts++;
          }

          // إنشاء القوانين (للمواد العلمية)
          if (lessonData.formulas && subjectConfig.hasFormulas) {
            for (const formula of lessonData.formulas) {
              await prisma.formula.create({
                data: {
                  lessonId: lesson.id,
                  formula: formula.formula,
                  explanationAr: formula.explanationAr,
                  explanationEn: formula.explanationEn,
                  order: lessonData.formulas.indexOf(formula) + 1,
                },
              });
              totalFormulas++;
            }
          }

          // إنشاء الأسئلة
          for (const q of lessonData.questions) {
            await prisma.question.create({
              data: {
                lessonId: lesson.id,
                type: "multiple_choice",
                questionAr: q.questionAr,
                questionEn: q.questionEn,
                optionsAr: JSON.stringify(q.optionsAr),
                optionsEn: JSON.stringify(q.optionsEn),
                answer: q.answer,
                explanationAr: q.explanationAr,
                explanationEn: q.explanationEn,
                points: 1,
                difficulty: "medium",
                order: lessonData.questions.indexOf(q) + 1,
              },
            });
            totalQuestions++;
          }
        }
      }

      console.log(`   ✅ ${subjectConfig.unitsCount} units, ${subjectConfig.unitsCount * subjectConfig.lessonsPerUnit} lessons`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Seeding completed successfully!");
  console.log(`\n📊 Statistics:
  - Academic Year: third-year
  - Specializations: 3 (Science, Math, Arts)
  - Subjects: ${totalSubjects}
  - Units: ${totalUnits}
  - Lessons: ${totalLessons}
  - Objectives: ${totalObjectives}
  - Concepts: ${totalConcepts}
  - Formulas: ${totalFormulas}
  - Questions: ${totalQuestions}
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
