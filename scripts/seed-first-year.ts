import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// بيانات الصف الأول الثانوي
const firstYearData = {
  nameAr: "الصف الأول الثانوي",
  nameEn: "First Year Secondary",
  code: "first-year",
  order: 1,
};

// المواد الدراسية للصف الأول (مشتركة لجميع الطلاب)
const subjectsData = [
  {
    nameAr: "اللغة العربية",
    nameEn: "Arabic Language",
    slug: "arabic-1",
    icon: "BookOpen",
    color: "#8B5CF6",
    order: 1,
    isCommon: true,
    units: [
      {
        nameAr: "وحدة النحو",
        nameEn: "Grammar Unit",
        slug: "arabic-grammar-1",
        order: 1,
        lessons: [
          {
            titleAr: "المبتدأ والخبر",
            titleEn: "Subject and Predicate",
            slug: "subject-predicate-1",
            descriptionAr: "دراسة المبتدأ والخبر وأنواعهما في اللغة العربية",
            descriptionEn: "Study of subject and predicate and their types in Arabic",
            introductionAr: "المبتدأ هو الاسم المرفوع الذي نبدأ به الجملة الاسمية، والخبر هو الجزء الذي يخبر عن المبتدأ ويتمم معناه. الجملة الاسمية هي التي تبدأ باسم.",
            introductionEn: "The subject (mubtada) is the noun in the nominative case that we start the nominal sentence with, and the predicate (khabar) is the part that informs about the subject.",
            summaryAr: "المبتدأ: اسم مرفوع في أول الجملة. الخبر: يخبر عن المبتدأ. أنواع الخبر: مفرد، جملة (فعلية/اسمية)، شبه جملة.",
            summaryEn: "Subject: noun at the beginning of sentence. Predicate: informs about subject. Types: singular, sentence, semi-sentence.",
            duration: 45,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "التعرف على المبتدأ والخبر", textEn: "Identify subject and predicate" },
              { textAr: "تحديد أنواع الخبر", textEn: "Determine types of predicate" },
              { textAr: "إعراب الجملة الاسمية", textEn: "Parse nominal sentences" },
            ],
            concepts: [
              { termAr: "المبتدأ", termEn: "Subject", definitionAr: "اسم مرفوع في أول الجملة الاسمية", definitionEn: "Noun at the beginning of nominal sentence" },
              { termAr: "الخبر", termEn: "Predicate", definitionAr: "الجزء الذي يخبر عن المبتدأ", definitionEn: "Part that informs about subject" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "في جملة 'الطالبُ مجتهدٌ'، الخبر هو:",
                questionEn: "In 'The student is diligent', the predicate is:",
                optionsAr: ["الطالب", "مجتهد", "الضمير", "لا يوجد"],
                optionsEn: ["Student", "Diligent", "Pronoun", "None"],
                answer: "مجتهد",
                explanationAr: "مجتهد خبر مفرد يخبر عن المبتدأ الطالب",
                explanationEn: "Diligent is a singular predicate informing about the subject",
              },
            ],
          },
          {
            titleAr: "الفاعل ونائب الفاعل",
            titleEn: "Subject and Deputy Subject",
            slug: "subject-deputy-1",
            descriptionAr: "دراسة الفاعل ونائب الفاعل في الجملة الفعلية",
            descriptionEn: "Study of subject and deputy subject in verbal sentences",
            introductionAr: "الفاعل هو من قام بالفعل أو اتصف به، ويأتي بعد الفعل مرفوعاً. نائب الفاعل يحل محل الفاعل في بناء الفعل للمجهول.",
            introductionEn: "The subject is who performed the action, coming after the verb in nominative case. Deputy subject replaces the subject in passive voice.",
            summaryAr: "الفاعل: من قام بالفعل (مرفوع). نائب الفاعل: يحل محل الفاعل في المبني للمجهول.",
            summaryEn: "Subject: performed the action. Deputy subject: replaces subject in passive voice.",
            duration: 50,
            order: 2,
            isFree: true,
            objectives: [
              { textAr: "التعرف على الفاعل", textEn: "Identify the subject" },
              { textAr: "التمييز بين الفاعل ونائب الفاعل", textEn: "Distinguish subject from deputy" },
            ],
            concepts: [
              { termAr: "الفاعل", termEn: "Subject", definitionAr: "من قام بالفعل أو اتصف به", definitionEn: "Who performed or was described by the action" },
              { termAr: "نائب الفاعل", termEn: "Deputy Subject", definitionAr: "محل الفاعل في المبني للمجهول", definitionEn: "Replaces subject in passive voice" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "في جملة 'كُتِب الدرسُ'، نائب الفاعل هو:",
                questionEn: "In 'The lesson was written', the deputy subject is:",
                optionsAr: ["كُتِب", "الدرس", "كاتب", "لا يوجد"],
                optionsEn: ["Written", "The lesson", "Writer", "None"],
                answer: "الدرس",
                explanationAr: "الدرس نائب فاعل لأن الجملة مبنية للمجهول",
                explanationEn: "The lesson is deputy subject because the sentence is passive",
              },
            ],
          },
          {
            titleAr: "المفعول به",
            titleEn: "Direct Object",
            slug: "direct-object-1",
            descriptionAr: "دراسة المفعول به وأنواعه",
            descriptionEn: "Study of direct object and its types",
            introductionAr: "المفعول به هو الاسم المنصوب الذي يدل على من وقع عليه الفعل. يأتي بعد فعل متعدٍ.",
            introductionEn: "The direct object is the accusative noun indicating who received the action. It comes after a transitive verb.",
            summaryAr: "المفعول به: اسم منصوب وقع عليه الفعل. أنواعه: صريح، مقدر، محذوف.",
            summaryEn: "Direct object: accusative noun receiving the action. Types: explicit, implied, deleted.",
            duration: 45,
            order: 3,
            isFree: true,
            objectives: [
              { textAr: "التعرف على المفعول به", textEn: "Identify the direct object" },
              { textAr: "تحديد أنواع المفعول به", textEn: "Determine types of direct object" },
            ],
            concepts: [
              { termAr: "المفعول به", termEn: "Direct Object", definitionAr: "اسم منصوب وقع عليه الفعل", definitionEn: "Accusative noun receiving the action" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "في جملة 'قرأ الطالب الكتابَ'، المفعول به هو:",
                questionEn: "In 'The student read the book', the direct object is:",
                optionsAr: ["قرأ", "الطالب", "الكتاب", "لا يوجد"],
                optionsEn: ["Read", "The student", "The book", "None"],
                answer: "الكتاب",
                explanationAr: "الكتاب مفعول به منصوب لأنه وقع عليه فعل القراءة",
                explanationEn: "The book is direct object because it received the reading action",
              },
            ],
          },
        ],
      },
      {
        nameAr: "وحدة البلاغة",
        nameEn: "Rhetoric Unit",
        slug: "arabic-rhetoric-1",
        order: 2,
        lessons: [
          {
            titleAr: "الاستعارة",
            titleEn: "Metaphor",
            slug: "metaphor-1",
            descriptionAr: "دراسة الاستعارة وأنواعها في البلاغة العربية",
            descriptionEn: "Study of metaphor and its types in Arabic rhetoric",
            introductionAr: "الاستعارة هي تشبيه بليغ حذف أحد طرفيه. وهي من أجمل الصور البيانية في اللغة العربية.",
            introductionEn: "Metaphor is an eloquent simile with one part removed. It is one of the most beautiful imagery in Arabic.",
            summaryAr: "الاستعارة: تشبيه حذف أحد طرفيه. أنواعها: تصريحية، مكنية.",
            summaryEn: "Metaphor: simile with one part removed. Types: explicit, implicit.",
            duration: 40,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "فهم مفهوم الاستعارة", textEn: "Understand metaphor concept" },
              { textAr: "التمييز بين أنواع الاستعارة", textEn: "Distinguish metaphor types" },
            ],
            concepts: [
              { termAr: "الاستعارة", termEn: "Metaphor", definitionAr: "تشبيه حذف أحد طرفيه", definitionEn: "Simile with one part removed" },
              { termAr: "الاستعارة التصريحية", termEn: "Explicit Metaphor", definitionAr: "ذكر المشبه به وحذف المشبه", definitionEn: "Mentioning the compared-to, removing the compared" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "في قوله 'رأيت أسداً يخطب'، الاستعارة:",
                questionEn: "In 'I saw a lion giving a speech', the metaphor is:",
                optionsAr: ["تصريحية", "مكنية", "تشبيه", "كناية"],
                optionsEn: ["Explicit", "Implicit", "Simile", "Metonymy"],
                answer: "تصريحية",
                explanationAr: "ذكر الأسد (المشبه به) وأراد الرجل الشجاع (المشبه)",
                explanationEn: "Mentioned lion (compared-to) meaning the brave man (compared)",
              },
            ],
          },
        ],
      },
      {
        nameAr: "وحدة الأدب",
        nameEn: "Literature Unit",
        slug: "arabic-literature-1",
        order: 3,
        lessons: [
          {
            titleAr: "العصر الجاهلي",
            titleEn: "Pre-Islamic Era",
            slug: "pre-islamic-era-1",
            descriptionAr: "دراسة الأدب في العصر الجاهلي",
            descriptionEn: "Study of literature in the pre-Islamic era",
            introductionAr: "يُسمى العصر الجاهلي لأنه سبق بعثة النبي محمد صلى الله عليه وسلم. تميز بشعر المعلقات والفروسية.",
            introductionEn: "Called pre-Islamic era because it preceded Prophet Muhammad's mission. Known for suspended odes and chivalry.",
            summaryAr: "العصر الجاهلي: قبل الإسلام. خصائصه: المعلقات، الفروسية، الصحراء.",
            summaryEn: "Pre-Islamic era: before Islam. Features: suspended odes, chivalry, desert.",
            duration: 50,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "فهم طبيعة العصر الجاهلي", textEn: "Understand pre-Islamic era nature" },
              { textAr: "التعرف على خصائص الأدب الجاهلي", textEn: "Know pre-Islamic literature features" },
            ],
            concepts: [
              { termAr: "المعلقات", termEn: "Suspended Odes", definitionAr: "قصائد شعرية مشهورة من العصر الجاهلي", definitionEn: "Famous poems from pre-Islamic era" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "كم عدد المعلقات؟",
                questionEn: "How many suspended odes are there?",
                optionsAr: ["سبع", "عشر", "خمس", "ثلاث"],
                optionsEn: ["Seven", "Ten", "Five", "Three"],
                answer: "سبع",
                explanationAr: "المعلقات سبع قصائد مشهورات",
                explanationEn: "There are seven famous suspended odes",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "اللغة الإنجليزية",
    nameEn: "English Language",
    slug: "english-1",
    icon: "Globe",
    color: "#3B82F6",
    order: 2,
    isCommon: true,
    units: [
      {
        nameAr: "Grammar Unit",
        nameEn: "وحدة القواعد",
        slug: "english-grammar-1",
        order: 1,
        lessons: [
          {
            titleAr: "Present Simple Tense",
            titleEn: "زمن المضارع البسيط",
            slug: "present-simple-1",
            descriptionAr: "دراسة زمن المضارع البسيط واستخداماته",
            descriptionEn: "Study of Present Simple tense and its uses",
            introductionAr: "يستخدم المضارع البسيط للتعبير عن العادات والحقائق الثابتة. يتكون من المصدر مع إضافة s/es للغائب.",
            introductionEn: "Present Simple is used to express habits and facts. Formed with base verb + s/es for third person.",
            summaryAr: "الاستخدام: عادات، حقائق. التكوين: Subject + verb (+ s/es). النفي: don't/doesn't.",
            summaryEn: "Use: habits, facts. Form: Subject + verb (+ s/es). Negative: don't/doesn't.",
            duration: 45,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "فهم استخدامات المضارع البسيط", textEn: "Understand Present Simple uses" },
              { textAr: "تكوين جمل صحيحة", textEn: "Form correct sentences" },
            ],
            concepts: [
              { termAr: "Present Simple", termEn: "المضارع البسيط", definitionAr: "زمن للعادات والحقائق", definitionEn: "Tense for habits and facts" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "Choose: She ___ to school every day.",
                questionEn: "اختر: She ___ to school every day.",
                optionsAr: ["go", "goes", "going", "went"],
                optionsEn: ["go", "goes", "going", "went"],
                answer: "goes",
                explanationAr: "She فاعل مفرد غائب، نضيف es للفعل",
                explanationEn: "She is third person singular, add es to verb",
              },
            ],
          },
          {
            titleAr: "Past Simple Tense",
            titleEn: "زمن الماضي البسيط",
            slug: "past-simple-1",
            descriptionAr: "دراسة زمن الماضي البسيط",
            descriptionEn: "Study of Past Simple tense",
            introductionAr: "يستخدم الماضي البسيط للتعبير عن أحداث تمت في الماضي وانتهت. الأفعال المنتظمة تضاف ed.",
            introductionEn: "Past Simple is used for events that happened and finished in the past. Regular verbs add ed.",
            summaryAr: "الاستخدام: أحداث منتهية في الماضي. التكوين: Subject + verb-ed/irregular.",
            summaryEn: "Use: finished past events. Form: Subject + verb-ed/irregular.",
            duration: 45,
            order: 2,
            isFree: true,
            objectives: [
              { textAr: "فهم الماضي البسيط", textEn: "Understand Past Simple" },
              { textAr: "حفظ الأفعال الشاذة", textEn: "Memorize irregular verbs" },
            ],
            concepts: [
              { termAr: "Past Simple", termEn: "الماضي البسيط", definitionAr: "زمن لأحداث منتهية في الماضي", definitionEn: "Tense for finished past events" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "Choose: I ___ to the cinema yesterday.",
                questionEn: "اختر: I ___ to the cinema yesterday.",
                optionsAr: ["go", "went", "gone", "going"],
                optionsEn: ["go", "went", "gone", "going"],
                answer: "went",
                explanationAr: "went فعل شاذ في الماضي",
                explanationEn: "went is an irregular past verb",
              },
            ],
          },
        ],
      },
      {
        nameAr: "Reading Unit",
        nameEn: "وحدة القراءة",
        slug: "english-reading-1",
        order: 2,
        lessons: [
          {
            titleAr: "Reading Comprehension",
            titleEn: "فهم المقروء",
            slug: "reading-comprehension-1",
            descriptionAr: "تقنيات فهم النصوص الإنجليزية",
            descriptionEn: "Techniques for understanding English texts",
            introductionAr: "فهم المقروء مهارة أساسية تتطلب القراءة المتأنية واستخلاص الأفكار الرئيسية.",
            introductionEn: "Reading comprehension is an essential skill requiring careful reading and extracting main ideas.",
            summaryAr: "اقرأ بعناية، استخرج الفكرة الرئيسية، حدد التفاصيل المهمة.",
            summaryEn: "Read carefully, extract main idea, identify important details.",
            duration: 40,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "تحسين مهارة القراءة", textEn: "Improve reading skill" },
              { textAr: "استخلاص الأفكار الرئيسية", textEn: "Extract main ideas" },
            ],
            concepts: [
              { termAr: "Main Idea", termEn: "الفكرة الرئيسية", definitionAr: "الفكرة المركزية في النص", definitionEn: "Central idea in the text" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "What is the first step in reading comprehension?",
                questionEn: "ما الخطوة الأولى في فهم المقروء؟",
                optionsAr: ["Read quickly", "Read carefully", "Skip difficult words", "Guess the meaning"],
                optionsEn: ["القراءة السريعة", "القراءة بعناية", "تخطي الكلمات الصعبة", "تخمين المعنى"],
                answer: "Read carefully",
                explanationEn: "Reading carefully is the foundation of comprehension",
                explanationAr: "القراءة بعناية هي أساس الفهم",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "الرياضيات",
    nameEn: "Mathematics",
    slug: "math-1",
    icon: "Calculator",
    color: "#F59E0B",
    order: 3,
    isCommon: true,
    units: [
      {
        nameAr: "وحدة الجذور والأسس",
        nameEn: "Roots and Exponents Unit",
        slug: "roots-exponents-1",
        order: 1,
        lessons: [
          {
            titleAr: "الجذور وخصائصها",
            titleEn: "Roots and Their Properties",
            slug: "roots-properties-1",
            descriptionAr: "دراسة الجذور وخصائصها الأساسية",
            descriptionEn: "Study of roots and their basic properties",
            introductionAr: "الجذر التربيعي لعدد a هو العدد الذي مربعه يساوي a. الجذر التكعيبي هو العدد الذي مكعبه يساوي a.",
            introductionEn: "The square root of a is the number whose square equals a. The cube root is the number whose cube equals a.",
            summaryAr: "√(a×b) = √a × √b. √(a/b) = √a / √b.",
            summaryEn: "√(a×b) = √a × √b. √(a/b) = √a / √b.",
            duration: 45,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "فهم الجذور", textEn: "Understand roots" },
              { textAr: "تطبيق خصائص الجذور", textEn: "Apply root properties" },
            ],
            concepts: [
              { termAr: "الجذر التربيعي", termEn: "Square Root", definitionAr: "العدد الذي مربعه يساوي العدد الأصلي", definitionEn: "Number whose square equals original" },
            ],
            formulas: [
              { formula: "√(a × b) = √a × √b", explanationAr: "جذر حاصل الضرب", explanationEn: "Root of product" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "قيمة √144 هي:",
                questionEn: "The value of √144 is:",
                optionsAr: ["10", "11", "12", "13"],
                optionsEn: ["10", "11", "12", "13"],
                answer: "12",
                explanationAr: "12 × 12 = 144",
                explanationEn: "12 × 12 = 144",
              },
            ],
          },
          {
            titleAr: "الأسس وخصائصها",
            titleEn: "Exponents and Their Properties",
            slug: "exponents-properties-1",
            descriptionAr: "دراسة الأسس وقوانينها",
            descriptionEn: "Study of exponents and their laws",
            introductionAr: "الأس يدل على عدد مرات ضرب الأساس في نفسه. للأسس قوانين مهمة لتبسيط التعابير.",
            introductionEn: "Exponent indicates how many times the base is multiplied by itself. Exponents have important laws.",
            summaryAr: "a^m × a^n = a^(m+n). a^m ÷ a^n = a^(m-n). (a^m)^n = a^(mn).",
            summaryEn: "a^m × a^n = a^(m+n). a^m ÷ a^n = a^(m-n). (a^m)^n = a^(mn).",
            duration: 45,
            order: 2,
            isFree: true,
            objectives: [
              { textAr: "فهم قوانين الأسس", textEn: "Understand exponent laws" },
              { textAr: "تبسيط التعابير الأسية", textEn: "Simplify exponential expressions" },
            ],
            concepts: [
              { termAr: "الأس", termEn: "Exponent", definitionAr: "عدد مرات ضرب الأساس", definitionEn: "Number of times base is multiplied" },
            ],
            formulas: [
              { formula: "a^m × a^n = a^(m+n)", explanationAr: "ضرب الأسس", explanationEn: "Multiplying exponents" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "2³ × 2⁴ =",
                questionEn: "2³ × 2⁴ =",
                optionsAr: ["2⁷", "2¹²", "4⁷", "8"],
                optionsEn: ["2⁷", "2¹²", "4⁷", "8"],
                answer: "2⁷",
                explanationAr: "2³ × 2⁴ = 2^(3+4) = 2⁷",
                explanationEn: "2³ × 2⁴ = 2^(3+4) = 2⁷",
              },
            ],
          },
        ],
      },
      {
        nameAr: "وحدة المعادلات",
        nameEn: "Equations Unit",
        slug: "equations-1",
        order: 2,
        lessons: [
          {
            titleAr: "المعادلات الخطية",
            titleEn: "Linear Equations",
            slug: "linear-equations-1",
            descriptionAr: "حل المعادلات الخطية",
            descriptionEn: "Solving linear equations",
            introductionAr: "المعادلة الخطية معادلة من الدرجة الأولى. حلها هو إيجاد قيمة المجهول.",
            introductionEn: "Linear equation is a first-degree equation. Solving it means finding the unknown.",
            summaryAr: "ax + b = 0 → x = -b/a",
            summaryEn: "ax + b = 0 → x = -b/a",
            duration: 40,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "حل معادلات خطية", textEn: "Solve linear equations" },
            ],
            concepts: [
              { termAr: "المعادلة الخطية", termEn: "Linear Equation", definitionAr: "معادلة من الدرجة الأولى", definitionEn: "First-degree equation" },
            ],
            formulas: [
              { formula: "ax + b = 0 → x = -b/a", explanationAr: "حل المعادلة الخطية", explanationEn: "Linear equation solution" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "حل المعادلة 2x + 6 = 10 هو:",
                questionEn: "Solution of 2x + 6 = 10 is:",
                optionsAr: ["x = 2", "x = 3", "x = 4", "x = 8"],
                optionsEn: ["x = 2", "x = 3", "x = 4", "x = 8"],
                answer: "x = 2",
                explanationAr: "2x = 4, x = 2",
                explanationEn: "2x = 4, x = 2",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "الفيزياء",
    nameEn: "Physics",
    slug: "physics-1",
    icon: "Atom",
    color: "#10B981",
    order: 4,
    isCommon: true,
    units: [
      {
        nameAr: "وحدة الحركة والقوى",
        nameEn: "Motion and Forces Unit",
        slug: "motion-forces-1",
        order: 1,
        lessons: [
          {
            titleAr: "الحركة والسكون",
            titleEn: "Motion and Rest",
            slug: "motion-rest-1",
            descriptionAr: "دراسة مفهوم الحركة والسكون",
            descriptionEn: "Study of motion and rest concepts",
            introductionAr: "الحركة هي تغير موضع الجسم بالنسبة لجسم آخر بمرور الزمن. السكون هو ثبات الجسم.",
            introductionEn: "Motion is change of position relative to another body. Rest is stability of the body.",
            summaryAr: "الحركة نسبية. المسافة كمية قياسية. الإزاحة كمية متجهة.",
            summaryEn: "Motion is relative. Distance is scalar. Displacement is vector.",
            duration: 45,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "فهم الحركة النسبية", textEn: "Understand relative motion" },
              { textAr: "التمييز بين المسافة والإزاحة", textEn: "Distinguish distance and displacement" },
            ],
            concepts: [
              { termAr: "الحركة", termEn: "Motion", definitionAr: "تغير موضع الجسم بمرور الزمن", definitionEn: "Change of position over time" },
              { termAr: "الإزاحة", termEn: "Displacement", definitionAr: "أقصر مسافة بين نقطتين", definitionEn: "Shortest distance between two points" },
            ],
            formulas: [
              { formula: "v = d / t", explanationAr: "حساب السرعة", explanationEn: "Calculate velocity" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "الحركة مفهوم:",
                questionEn: "Motion is:",
                optionsAr: ["مطلق", "نسبي", "ثابت", "متغير"],
                optionsEn: ["Absolute", "Relative", "Fixed", "Variable"],
                answer: "نسبي",
                explanationAr: "الحركة نسبية تعتمد على المرجع",
                explanationEn: "Motion is relative depending on reference",
              },
            ],
          },
          {
            titleAr: "السرعة والتسارع",
            titleEn: "Velocity and Acceleration",
            slug: "velocity-acceleration-1",
            descriptionAr: "دراسة السرعة والتسارع",
            descriptionEn: "Study of velocity and acceleration",
            introductionAr: "السرعة هي معدل تغير الإزاحة. التسارع هو معدل تغير السرعة.",
            introductionEn: "Velocity is rate of change of displacement. Acceleration is rate of change of velocity.",
            summaryAr: "v = Δx / t. a = Δv / t.",
            summaryEn: "v = Δx / t. a = Δv / t.",
            duration: 50,
            order: 2,
            isFree: true,
            objectives: [
              { textAr: "حساب السرعة", textEn: "Calculate velocity" },
              { textAr: "حساب التسارع", textEn: "Calculate acceleration" },
            ],
            concepts: [
              { termAr: "السرعة", termEn: "Velocity", definitionAr: "الإزاحة على الزمن", definitionEn: "Displacement over time" },
              { termAr: "التسارع", termEn: "Acceleration", definitionAr: "تغير السرعة على الزمن", definitionEn: "Change in velocity over time" },
            ],
            formulas: [
              { formula: "a = (v₂ - v₁) / t", explanationAr: "حساب التسارع", explanationEn: "Calculate acceleration" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "وحدة التسارع:",
                questionEn: "Unit of acceleration:",
                optionsAr: ["m/s", "m/s²", "m²/s", "s/m"],
                optionsEn: ["m/s", "m/s²", "m²/s", "s/m"],
                answer: "m/s²",
                explanationAr: "التسارع = تغير السرعة / الزمن = (m/s) / s = m/s²",
                explanationEn: "Acceleration = change in velocity / time = (m/s) / s = m/s²",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "الكيمياء",
    nameEn: "Chemistry",
    slug: "chemistry-1",
    icon: "FlaskConical",
    color: "#EF4444",
    order: 5,
    isCommon: true,
    units: [
      {
        nameAr: "وحدة الذرات",
        nameEn: "Atoms Unit",
        slug: "atoms-1",
        order: 1,
        lessons: [
          {
            titleAr: "تركيب الذرة",
            titleEn: "Atomic Structure",
            slug: "atomic-structure-1",
            descriptionAr: "دراسة تركيب الذرة",
            descriptionEn: "Study of atomic structure",
            introductionAr: "الذرة هي وحدة البناء الأساسية للمادة. تتكون من نواة وإلكترونات.",
            introductionEn: "Atom is the basic building block of matter. Consists of nucleus and electrons.",
            summaryAr: "الذرة = نواة (بروتونات + نيوترونات) + إلكترونات. العدد الذري = عدد البروتونات.",
            summaryEn: "Atom = nucleus (protons + neutrons) + electrons. Atomic number = number of protons.",
            duration: 50,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "التعرف على مكونات الذرة", textEn: "Identify atomic components" },
              { textAr: "فهم العدد الذري والكتلي", textEn: "Understand atomic and mass numbers" },
            ],
            concepts: [
              { termAr: "البروتون", termEn: "Proton", definitionAr: "جسيم موجب في النواة", definitionEn: "Positive particle in nucleus" },
              { termAr: "الإلكترون", termEn: "Electron", definitionAr: "جسيم سالب يدور حول النواة", definitionEn: "Negative particle orbiting nucleus" },
            ],
            formulas: [
              { formula: "العدد الكتلي = عدد البروتونات + عدد النيوترونات", explanationAr: "حساب العدد الكتلي", explanationEn: "Calculate mass number" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "الجسيم الذي يحدد العدد الذري:",
                questionEn: "Particle determining atomic number:",
                optionsAr: ["الإلكترون", "النيوترون", "البروتون", "النواة"],
                optionsEn: ["Electron", "Neutron", "Proton", "Nucleus"],
                answer: "البروتون",
                explanationAr: "العدد الذري = عدد البروتونات",
                explanationEn: "Atomic number = number of protons",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "الأحياء",
    nameEn: "Biology",
    slug: "biology-1",
    icon: "Leaf",
    color: "#22C55E",
    order: 6,
    isCommon: true,
    units: [
      {
        nameAr: "وحدة الخلية",
        nameEn: "Cell Unit",
        slug: "cell-1",
        order: 1,
        lessons: [
          {
            titleAr: "تركيب الخلية",
            titleEn: "Cell Structure",
            slug: "cell-structure-1",
            descriptionAr: "دراسة تركيب الخلية",
            descriptionEn: "Study of cell structure",
            introductionAr: "الخلية هي وحدة البناء الأساسية للحياة. تتكون من غشاء و سيتوبلازم ونواة.",
            introductionEn: "Cell is the basic unit of life. Consists of membrane, cytoplasm, and nucleus.",
            summaryAr: "الخلية: غشاء + سيتوبلازم + نواة. توجد عضيات مثل الميتوكوندريا.",
            summaryEn: "Cell: membrane + cytoplasm + nucleus. Contains organelles like mitochondria.",
            duration: 45,
            order: 1,
            isFree: true,
            objectives: [
              { textAr: "التعرف على مكونات الخلية", textEn: "Identify cell components" },
            ],
            concepts: [
              { termAr: "الغشاء البلازمي", termEn: "Plasma Membrane", definitionAr: "غشاء يحيط بالخلية", definitionEn: "Membrane surrounding the cell" },
            ],
            questions: [
              {
                type: "multiple_choice",
                questionAr: "موقع الطاقة في الخلية:",
                questionEn: "Energy location in cell:",
                optionsAr: ["النواة", "الميتوكوندريا", "الغشاء", "السيتوبلازم"],
                optionsEn: ["Nucleus", "Mitochondria", "Membrane", "Cytoplasm"],
                answer: "الميتوكوندريا",
                explanationAr: "الميتوكوندريا هي محطة الطاقة في الخلية",
                explanationEn: "Mitochondria is the power station of the cell",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "التاريخ",
    nameEn: "History",
    slug: "history-1",
    icon: "Landmark",
    color: "#A855F7",
    order: 7,
    isCommon: true,
    units: [],
  },
  {
    nameAr: "الجغرافيا",
    nameEn: "Geography",
    slug: "geography-1",
    icon: "Map",
    color: "#06B6D4",
    order: 8,
    isCommon: true,
    units: [],
  },
  {
    nameAr: "الفلسفة والمنطق",
    nameEn: "Philosophy & Logic",
    slug: "philosophy-1",
    icon: "Brain",
    color: "#F97316",
    order: 9,
    isCommon: true,
    units: [],
  },
  {
    nameAr: "اللغة الفرنسية",
    nameEn: "French Language",
    slug: "french-1",
    icon: "Globe",
    color: "#EC4899",
    order: 10,
    isCommon: true,
    units: [],
  },
];

async function main() {
  console.log("🚀 Starting First Year Seeding...");

  // إنشاء السنة الدراسية
  const academicYear = await prisma.academicYear.upsert({
    where: { code: firstYearData.code },
    update: firstYearData,
    create: firstYearData,
  });
  console.log(`✅ Academic Year: ${academicYear.nameAr}`);

  // إنشاء الفصل الدراسي الأول
  const semester = await prisma.semester.upsert({
    where: { code: "first-semester" },
    update: { nameAr: "الفصل الدراسي الأول", nameEn: "First Semester", code: "first-semester", order: 1 },
    create: { nameAr: "الفصل الدراسي الأول", nameEn: "First Semester", code: "first-semester", order: 1 },
  });

  let totalUnits = 0;
  let totalLessons = 0;

  // إنشاء المواد والوحدات والدروس
  for (const subjectData of subjectsData) {
    const subject = await prisma.subject.upsert({
      where: { slug: subjectData.slug },
      update: {
        nameAr: subjectData.nameAr,
        nameEn: subjectData.nameEn,
        icon: subjectData.icon,
        color: subjectData.color,
        order: subjectData.order,
        isCommon: subjectData.isCommon,
        yearId: academicYear.id,
        specializationId: null,
      },
      create: {
        nameAr: subjectData.nameAr,
        nameEn: subjectData.nameEn,
        slug: subjectData.slug,
        icon: subjectData.icon,
        color: subjectData.color,
        order: subjectData.order,
        isCommon: subjectData.isCommon,
        yearId: academicYear.id,
        specializationId: null,
      },
    });
    console.log(`📚 Subject: ${subject.nameAr}`);

    for (const unitData of subjectData.units) {
      const unit = await prisma.unit.upsert({
        where: { slug: unitData.slug },
        update: {
          nameAr: unitData.nameAr,
          nameEn: unitData.nameEn,
          order: unitData.order,
          subjectId: subject.id,
          semesterId: semester.id,
        },
        create: {
          nameAr: unitData.nameAr,
          nameEn: unitData.nameEn,
          slug: unitData.slug,
          order: unitData.order,
          subjectId: subject.id,
          semesterId: semester.id,
        },
      });
      totalUnits++;

      for (const lessonData of unitData.lessons) {
        const lesson = await prisma.lesson.upsert({
          where: { slug: lessonData.slug },
          update: {
            titleAr: lessonData.titleAr,
            titleEn: lessonData.titleEn,
            descriptionAr: lessonData.descriptionAr,
            descriptionEn: lessonData.descriptionEn,
            introductionAr: lessonData.introductionAr,
            introductionEn: lessonData.introductionEn,
            summaryAr: lessonData.summaryAr,
            summaryEn: lessonData.summaryEn,
            duration: lessonData.duration,
            order: lessonData.order,
            isFree: lessonData.isFree,
            unitId: unit.id,
          },
          create: {
            titleAr: lessonData.titleAr,
            titleEn: lessonData.titleEn,
            slug: lessonData.slug,
            descriptionAr: lessonData.descriptionAr,
            descriptionEn: lessonData.descriptionEn,
            introductionAr: lessonData.introductionAr,
            introductionEn: lessonData.introductionEn,
            summaryAr: lessonData.summaryAr,
            summaryEn: lessonData.summaryEn,
            duration: lessonData.duration,
            order: lessonData.order,
            isFree: lessonData.isFree,
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
              order: 1,
            },
          });
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
              order: 1,
            },
          });
        }

        // إنشاء القوانين
        if (lessonData.formulas) {
          for (const formula of lessonData.formulas) {
            await prisma.formula.create({
              data: {
                lessonId: lesson.id,
                formula: formula.formula,
                explanationAr: formula.explanationAr,
                explanationEn: formula.explanationEn,
                order: 1,
              },
            });
          }
        }

        // إنشاء الأسئلة
        for (const q of lessonData.questions) {
          await prisma.question.create({
            data: {
              lessonId: lesson.id,
              type: q.type,
              questionAr: q.questionAr,
              questionEn: q.questionEn,
              optionsAr: JSON.stringify(q.optionsAr),
              optionsEn: JSON.stringify(q.optionsEn),
              answer: q.answer,
              explanationAr: q.explanationAr,
              explanationEn: q.explanationEn,
              order: 1,
            },
          });
        }
      }
    }
  }

  console.log("\n🎉 First Year Seeding Completed!");
  console.log(`📊 Stats: ${subjectsData.length} subjects, ${totalUnits} units, ${totalLessons} lessons`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
