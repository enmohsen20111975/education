import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// محتوى شامل لكل درس على حدة
const lessonContent: Record<string, {
  examples: Array<{
    questionAr: string;
    questionEn: string;
    solutionAr: string;
    solutionEn: string;
    stepsAr: string[];
    stepsEn: string[];
  }>;
  questions: Array<{
    type: string;
    questionAr: string;
    questionEn: string;
    optionsAr: string[];
    optionsEn: string[];
    answer: string;
    explanationAr: string;
    explanationEn: string;
  }>;
  formulas?: Array<{
    formula: string;
    explanationAr: string;
    explanationEn: string;
  }>;
}> = {
  // ==================== اللغة العربية ====================
  
  // النحو
  "المبتدأ والخبر": {
    examples: [
      {
        questionAr: "أعرب الجملة التالية: العلمُ نورٌ",
        questionEn: "Parse the sentence: العلمُ نورٌ",
        solutionAr: "العلمُ: مبتدأ مرفوع بالضمة الظاهرة على آخره. نورٌ: خبر مرفوع بالضمة الظاهرة على آخره.",
        solutionEn: "العلمُ: Subject in nominative case. نورٌ: Predicate in nominative case.",
        stepsAr: ["نحدد المبتدأ: العلمُ", "نحدد الخبر: نورٌ", "كلاهما مرفوع بالضمة"],
        stepsEn: ["Identify subject: العلمُ", "Identify predicate: نورٌ", "Both are nominative"]
      },
      {
        questionAr: "حدد المبتدأ والخبر ونوعه: الكتابُ على الطاولة",
        questionEn: "Identify subject, predicate and its type: الكتابُ على الطاولة",
        solutionAr: "المبتدأ: الكتابُ. الخبر: على الطاولة (شبه جملة جار ومجرور).",
        solutionEn: "Subject: الكتابُ. Predicate: على الطاولة (prepositional phrase).",
        stepsAr: ["المبتدأ: الكتابُ", "الخبر: على الطاولة", "نوع الخبر: شبه جملة"],
        stepsEn: ["Subject: الكتابُ", "Predicate: على الطاولة", "Type: semi-sentence"]
      },
      {
        questionAr: "أعرب: السماءُ صافيةٌ",
        questionEn: "Parse: السماءُ صافيةٌ",
        solutionAr: "السماءُ: مبتدأ مرفوع بالضمة. صافيةٌ: خبر مرفوع بالضمة.",
        solutionEn: "السماءُ: Subject nominative. صافيةٌ: Predicate nominative.",
        stepsAr: ["الجملة اسمية", "المبتدأ: السماءُ", "الخبر: صافيةٌ (مفرد)"],
        stepsEn: ["Nominal sentence", "Subject: السماءُ", "Predicate: صافيةٌ (singular)"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما نوع الخبر في جملة: الطالبُ يدرسُ؟",
        questionEn: "What type of predicate in: الطالبُ يدرسُ؟",
        optionsAr: ["مفرد", "جملة فعلية", "جملة اسمية", "شبه جملة"],
        optionsEn: ["Singular", "Verbal sentence", "Nominal sentence", "Semi-sentence"],
        answer: "جملة فعلية",
        explanationAr: "الخبر (يدرسُ) جملة فعلية لأنه فعل + فاعل",
        explanationEn: "The predicate (يدرسُ) is a verbal sentence"
      },
      {
        type: "multiple_choice",
        questionAr: "ما إعراب كلمة (مفيد) في: الكتابُ مفيدٌ؟",
        questionEn: "Parse (مفيد) in: الكتابُ مفيدٌ؟",
        optionsAr: ["مبتدأ", "خبر مرفوع", "صفة", "فاعل"],
        optionsEn: ["Subject", "Predicate nominative", "Adjective", "Doer"],
        answer: "خبر مرفوع",
        explanationAr: "مفيدٌ خبر المبتدأ مرفوع بالضمة",
        explanationEn: "مفيدٌ is the predicate in nominative case"
      },
      {
        type: "multiple_choice",
        questionAr: "أي الجمل التالية خبرها شبه جملة؟",
        questionEn: "Which sentence has a semi-sentence predicate?",
        optionsAr: ["الطالبُ مجتهدٌ", "النهرُ يجري", "الكتابُ في الحقيبة", "البيتُ كبيرٌ"],
        optionsEn: ["الطالبُ مجتهدٌ", "النهرُ يجري", "الكتابُ في الحقيبة", "البيتُ كبيرٌ"],
        answer: "الكتابُ في الحقيبة",
        explanationAr: "الخبر (في الحقيبة) شبه جملة جار ومجرور",
        explanationEn: "The predicate (في الحقيبة) is a prepositional phrase"
      },
      {
        type: "multiple_choice",
        questionAr: "ما شرط المبتدأ؟",
        questionEn: "What is the condition for the subject?",
        optionsAr: ["أن يكون فعلاً", "أن يكون اسماً في أول الجملة", "أن يكون حرفاً", "أن يكون صفة"],
        optionsEn: ["Must be a verb", "Must be a noun at the beginning", "Must be a letter", "Must be an adjective"],
        answer: "أن يكون اسماً في أول الجملة",
        explanationAr: "المبتدأ هو الاسم المرفوع الذي نبدأ به الجملة الاسمية",
        explanationEn: "The subject is the noun that starts the nominal sentence"
      }
    ]
  },

  "الفاعل ونائب الفاعل": {
    examples: [
      {
        questionAr: "أعرب: نجحَ الطالبُ",
        questionEn: "Parse: نجحَ الطالبُ",
        solutionAr: "الطالبُ: فاعل مرفوع بالضمة الظاهرة",
        solutionEn: "الطالبُ: Doer in nominative case",
        stepsAr: ["الفعل: نجحَ", "الفاعل: الطالبُ", "إعرابه: فاعل مرفوع"],
        stepsEn: ["Verb: نجحَ", "Doer: الطالبُ", "Parsing: nominative doer"]
      },
      {
        questionAr: "أعرب: فُتح البابُ",
        questionEn: "Parse: فُتح البابُ",
        solutionAr: "البابُ: نائب فاعل مرفوع بالضمة",
        solutionEn: "البابُ: Deputy doer in nominative",
        stepsAr: ["الفعل مبني للمجهول: فُتح", "نائب الفاعل: البابُ", "إعرابه: نائب فاعل مرفوع"],
        stepsEn: ["Passive verb: فُتح", "Deputy doer: البابُ", "Parsing: nominative deputy doer"]
      },
      {
        questionAr: "حول الجملة للمبني للمجهول: قرأَ الطالبُ الكتابَ",
        questionEn: "Convert to passive: قرأَ الطالبُ الكتابَ",
        solutionAr: "قُرئَ الكتابُ",
        solutionEn: "قُرئَ الكتابُ",
        stepsAr: ["نحوّل الفعل للمجهول: قُرئَ", "نائب الفاعل: الكتابُ", "الفاعل الأصلي يُحذف"],
        stepsEn: ["Convert verb to passive: قُرئَ", "Deputy doer: الكتابُ", "Original doer is omitted"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "كيف نعرف الفعل المبني للمجهول؟",
        questionEn: "How do we identify passive voice?",
        optionsAr: ["يبدأ بسين", "يُضم أوله ويُكسر ما قبل آخره", "يكون مضارعاً فقط", "يُنون آخره"],
        optionsEn: ["Starts with س", "First letter damma, before last kasra", "Present tense only", "Has tanween"],
        answer: "يُضم أوله ويُكسر ما قبل آخره",
        explanationAr: "الفعل المبني للمجهول يُضم أوله ويُكسر ما قبل آخره",
        explanationEn: "Passive verb has damma at start and kasra before last"
      },
      {
        type: "multiple_choice",
        questionAr: "ما إعراب (النافذة) في: فُتحت النافذةُ؟",
        questionEn: "Parse (النافذة) in: فُتحت النافذةُ؟",
        optionsAr: ["فاعل", "نائب فاعل", "مبتدأ", "خبر"],
        optionsEn: ["Doer", "Deputy doer", "Subject", "Predicate"],
        answer: "نائب فاعل",
        explanationAr: "لأن الفعل (فُتحت) مبني للمجهول",
        explanationEn: "Because the verb is in passive voice"
      },
      {
        type: "multiple_choice",
        questionAr: "ما علامة رفع الفاعل؟",
        questionEn: "What is the nominative sign of doer?",
        optionsAr: ["الفتحة", "الضمة", "الكسرة", "السكون"],
        optionsEn: ["Fatha", "Damma", "Kasra", "Sukun"],
        answer: "الضمة",
        explanationAr: "الفاعل مرفوع وعلامة رفعه الضمة",
        explanationEn: "Doer is nominative with damma"
      }
    ]
  },

  "المفعول به": {
    examples: [
      {
        questionAr: "أعرب: قرأتُ الكتابَ",
        questionEn: "Parse: قرأتُ الكتابَ",
        solutionAr: "الكتابَ: مفعول به منصوب بالفتحة",
        solutionEn: "الكتابَ: Object in accusative with fatha",
        stepsAr: ["الفعل: قرأتُ", "الفاعل: التاء", "المفعول به: الكتابَ"],
        stepsEn: ["Verb: قرأتُ", "Doer: ta", "Object: الكتابَ"]
      },
      {
        questionAr: "استخرج المفعول به: أكلَ الطفلُ التفاحةَ",
        questionEn: "Extract the object: أكلَ الطفلُ التفاحةَ",
        solutionAr: "المفعول به: التفاحةَ (منصوب بالفتحة)",
        solutionEn: "Object: التفاحةَ (accusative with fatha)",
        stepsAr: ["الفعل: أكلَ", "الفاعل: الطفلُ", "المفعول به: التفاحةَ"],
        stepsEn: ["Verb: أكلَ", "Doer: الطفلُ", "Object: التفاحةَ"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما علامة نصب المفعول به؟",
        questionEn: "What is the accusative sign?",
        optionsAr: ["الضمة", "الفتحة", "الكسرة", "السكون"],
        optionsEn: ["Damma", "Fatha", "Kasra", "Sukun"],
        answer: "الفتحة",
        explanationAr: "المفعول به منصوب بالفتحة",
        explanationEn: "Object is accusative with fatha"
      },
      {
        type: "multiple_choice",
        questionAr: "ما المفعول به في: شربَ الولدُ اللبنَ؟",
        questionEn: "What is the object in: شربَ الولدُ اللبنَ؟",
        optionsAr: ["شربَ", "الولدُ", "اللبنَ", "لا مفعول به"],
        optionsEn: ["شربَ", "الولدُ", "اللبنَ", "No object"],
        answer: "اللبنَ",
        explanationAr: "اللبنَ هو ما وقع عليه الفعل",
        explanationEn: "اللبنَ is what received the action"
      }
    ]
  },

  // ==================== الفيزياء ====================
  
  "مقدمة في الفيزياء": {
    examples: [
      {
        questionAr: "ما هي الكميات الفيزيائية الأساسية السبع؟",
        questionEn: "What are the seven fundamental quantities?",
        solutionAr: "الطول (م)، الكتلة (كجم)، الزمن (ث)، التيار (أ)، الحرارة (ك)، كمية المادة (مول)، شدة الإضاءة (كد)",
        solutionEn: "Length (m), Mass (kg), Time (s), Current (A), Temperature (K), Amount (mol), Luminous (cd)",
        stepsAr: ["الطول - متر", "الكتلة - كجم", "الزمن - ثانية", "التيار - أمبير", "الحرارة - كلفن", "كمية المادة - مول", "شدة الإضاءة - كانديلا"],
        stepsEn: ["Length - meter", "Mass - kg", "Time - second", "Current - ampere", "Temperature - kelvin", "Amount - mole", "Luminous - candela"]
      },
      {
        questionAr: "ما الفرق بين الكمية القياسية والمتجهة؟",
        questionEn: "Difference between scalar and vector quantities?",
        solutionAr: "الكمية القياسية: لها مقدار فقط (مثل الكتلة). الكمية المتجهة: لها مقدار واتجاه (مثل السرعة).",
        solutionEn: "Scalar: magnitude only (mass). Vector: magnitude and direction (velocity).",
        stepsAr: ["القياسية: مقدار فقط", "المتجهة: مقدار + اتجاه", "مثال قياسية: الكتلة", "مثال متجهة: السرعة"],
        stepsEn: ["Scalar: magnitude only", "Vector: magnitude + direction", "Scalar example: mass", "Vector example: velocity"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما وحدة قياس القوة؟",
        questionEn: "What is the unit of force?",
        optionsAr: ["كجم", "نيوتن", "جول", "واط"],
        optionsEn: ["kg", "Newton", "Joule", "Watt"],
        answer: "نيوتن",
        explanationAr: "النيوتن هو وحدة قياس القوة",
        explanationEn: "Newton is the unit of force"
      },
      {
        type: "multiple_choice",
        questionAr: "أي الكميات التالية كمية متجهة؟",
        questionEn: "Which is a vector quantity?",
        optionsAr: ["الكتلة", "الزمن", "السرعة", "درجة الحرارة"],
        optionsEn: ["Mass", "Time", "Velocity", "Temperature"],
        answer: "السرعة",
        explanationAr: "السرعة كمية متجهة لها مقدار واتجاه",
        explanationEn: "Velocity is a vector with magnitude and direction"
      },
      {
        type: "multiple_choice",
        questionAr: "ما وحدة قياس الكتلة في النظام الدولي؟",
        questionEn: "SI unit of mass?",
        optionsAr: ["نيوتن", "كيلوجرام", "جرام", "متر"],
        optionsEn: ["Newton", "Kilogram", "Gram", "Meter"],
        answer: "كيلوجرام",
        explanationAr: "الكيلوجرام هو الوحدة الأساسية للكتلة",
        explanationEn: "Kilogram is the base unit for mass"
      }
    ],
    formulas: [
      { formula: "v = d/t", explanationAr: "السرعة = الإزاحة ÷ الزمن", explanationEn: "Velocity = displacement / time" },
      { formula: "a = Δv/Δt", explanationAr: "التسارع = التغير في السرعة ÷ الزمن", explanationEn: "Acceleration = change in velocity / time" }
    ]
  },

  "القياس والوحدات": {
    examples: [
      {
        questionAr: "حوّل 5 كم إلى متر",
        questionEn: "Convert 5 km to meters",
        solutionAr: "5 كم = 5 × 1000 = 5000 م",
        solutionEn: "5 km = 5 × 1000 = 5000 m",
        stepsAr: ["1 كم = 1000 م", "5 × 1000 = 5000 م"],
        stepsEn: ["1 km = 1000 m", "5 × 1000 = 5000 m"]
      },
      {
        questionAr: "حوّل 72 كم/س إلى م/ث",
        questionEn: "Convert 72 km/h to m/s",
        solutionAr: "72 كم/س = 72 × (5/18) = 20 م/ث",
        solutionEn: "72 km/h = 72 × (5/18) = 20 m/s",
        stepsAr: ["1 كم/س = 5/18 م/ث", "72 × 5/18 = 20 م/ث"],
        stepsEn: ["1 km/h = 5/18 m/s", "72 × 5/18 = 20 m/s"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما قيمة البادئة (مللي)؟",
        questionEn: "Value of prefix (milli)?",
        optionsAr: ["10²", "10³", "10⁻³", "10⁻²"],
        optionsEn: ["10²", "10³", "10⁻³", "10⁻²"],
        answer: "10⁻³",
        explanationAr: "مللي = 10⁻³ = 0.001",
        explanationEn: "milli = 10⁻³ = 0.001"
      },
      {
        type: "multiple_choice",
        questionAr: "1 متر = ؟ سنتيمتر",
        questionEn: "1 meter = ? centimeters",
        optionsAr: ["10", "100", "1000", "0.01"],
        optionsEn: ["10", "100", "1000", "0.01"],
        answer: "100",
        explanationAr: "1 م = 100 سم",
        explanationEn: "1 m = 100 cm"
      }
    ],
    formulas: [
      { formula: "1 km = 10³ m", explanationAr: "الكيلومتر = 1000 متر", explanationEn: "Kilometer = 1000 meters" },
      { formula: "1 cm = 10⁻² m", explanationAr: "السنتيمتر = 0.01 متر", explanationEn: "Centimeter = 0.01 meter" }
    ]
  },

  "الحركة المستقيمة": {
    examples: [
      {
        questionAr: "سيارة تتحرك بسرعة 20 م/ث لمدة 30 ثانية، أوجد الإزاحة",
        questionEn: "Car moves at 20 m/s for 30 s, find displacement",
        solutionAr: "الإزاحة = السرعة × الزمن = 20 × 30 = 600 م",
        solutionEn: "Displacement = velocity × time = 20 × 30 = 600 m",
        stepsAr: ["d = v × t", "d = 20 × 30", "d = 600 م"],
        stepsEn: ["d = v × t", "d = 20 × 30", "d = 600 m"]
      },
      {
        questionAr: "جسم يبدأ من السكون ويتسارع بمقدار 2 م/ث² لمدة 5 ثواني، أوجد السرعة النهائية",
        questionEn: "Body starts from rest, accelerates at 2 m/s² for 5 s, find final velocity",
        solutionAr: "v = v₀ + at = 0 + 2 × 5 = 10 م/ث",
        solutionEn: "v = v₀ + at = 0 + 2 × 5 = 10 m/s",
        stepsAr: ["v₀ = 0", "a = 2 م/ث²", "t = 5 ث", "v = 0 + 2 × 5 = 10 م/ث"],
        stepsEn: ["v₀ = 0", "a = 2 m/s²", "t = 5 s", "v = 0 + 2 × 5 = 10 m/s"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما الفرق بين المسافة والإزاحة؟",
        questionEn: "Difference between distance and displacement?",
        optionsAr: ["لا فرق", "المسافة متجهة", "الإزاحة متجهة", "كلاهما متجهة"],
        optionsEn: ["No difference", "Distance is vector", "Displacement is vector", "Both are vectors"],
        answer: "الإزاحة متجهة",
        explanationAr: "الإزاحة كمية متجهة لها مقدار واتجاه",
        explanationEn: "Displacement is a vector with magnitude and direction"
      },
      {
        type: "multiple_choice",
        questionAr: "ما وحدة قياس التسارع؟",
        questionEn: "Unit of acceleration?",
        optionsAr: ["م/ث", "م/ث²", "م²/ث", "ث/م"],
        optionsEn: ["m/s", "m/s²", "m²/s", "s/m"],
        answer: "م/ث²",
        explanationAr: "التسارع = التغير في السرعة ÷ الزمن = م/ث²",
        explanationEn: "Acceleration = change in velocity / time = m/s²"
      }
    ],
    formulas: [
      { formula: "v = d/t", explanationAr: "السرعة = الإزاحة ÷ الزمن", explanationEn: "Velocity = displacement / time" },
      { formula: "v = v₀ + at", explanationAr: "السرعة النهائية = الابتدائية + التسارع × الزمن", explanationEn: "Final velocity = initial + acceleration × time" },
      { formula: "d = v₀t + ½at²", explanationAr: "الإزاحة = السرعة الابتدائية × الزمن + ½ × التسارع × مربع الزمن", explanationEn: "Displacement formula" }
    ]
  },

  "القوى وقوانين نيوتن": {
    examples: [
      {
        questionAr: "أوجد القوة اللازمة لتسريع جسم كتلته 5 كجم بتسارع 3 م/ث²",
        questionEn: "Find force needed to accelerate 5 kg mass at 3 m/s²",
        solutionAr: "F = ma = 5 × 3 = 15 نيوتن",
        solutionEn: "F = ma = 5 × 3 = 15 Newton",
        stepsAr: ["m = 5 كجم", "a = 3 م/ث²", "F = ma = 5 × 3 = 15 ن"],
        stepsEn: ["m = 5 kg", "a = 3 m/s²", "F = ma = 5 × 3 = 15 N"]
      },
      {
        questionAr: "ما وزن جسم كتلته 10 كجم؟ (g = 10 م/ث²)",
        questionEn: "Weight of 10 kg mass? (g = 10 m/s²)",
        solutionAr: "W = mg = 10 × 10 = 100 نيوتن",
        solutionEn: "W = mg = 10 × 10 = 100 Newton",
        stepsAr: ["m = 10 كجم", "g = 10 م/ث²", "W = 10 × 10 = 100 ن"],
        stepsEn: ["m = 10 kg", "g = 10 m/s²", "W = 10 × 10 = 100 N"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما قانون نيوتن الأول؟",
        questionEn: "Newton's first law?",
        optionsAr: ["F = ma", "الجسم الساكن يبقى ساكناً", "لكل فعل رد فعل", "القوة = الكتلة"],
        optionsEn: ["F = ma", "Body at rest stays at rest", "Action-reaction", "Force = mass"],
        answer: "الجسم السامن يبقى ساكناً",
        explanationAr: "قانون القصور الذاتي: الجسم يحافظ على حالته",
        explanationEn: "Law of inertia: body maintains its state"
      },
      {
        type: "multiple_choice",
        questionAr: "ما وحدة قياس القوة؟",
        questionEn: "Unit of force?",
        optionsAr: ["كجم", "نيوتن", "جول", "واط"],
        optionsEn: ["kg", "Newton", "Joule", "Watt"],
        answer: "نيوتن",
        explanationAr: "النيوتن = كجم.م/ث²",
        explanationEn: "Newton = kg.m/s²"
      }
    ],
    formulas: [
      { formula: "F = ma", explanationAr: "القوة = الكتلة × التسارع", explanationEn: "Force = mass × acceleration" },
      { formula: "W = mg", explanationAr: "الوزن = الكتلة × تسارع الجاذبية", explanationEn: "Weight = mass × gravity" }
    ]
  },

  // ==================== الكيمياء ====================
  
  "مقدمة في الكيمياء": {
    examples: [
      {
        questionAr: "ما مكونات الذرة؟",
        questionEn: "Components of atom?",
        solutionAr: "الذرة = نواة (بروتونات + نيوترونات) + إلكترونات تدور حولها",
        solutionEn: "Atom = nucleus (protons + neutrons) + electrons orbiting",
        stepsAr: ["النواة: بروتونات (+) ونيوترونات (0)", "الإلكترونات (-) تدور حول النواة", "الذرة متعادلة: عدد البروتونات = عدد الإلكترونات"],
        stepsEn: ["Nucleus: protons (+) and neutrons (0)", "Electrons (-) orbit nucleus", "Neutral atom: protons = electrons"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما شحنة البروتون؟",
        questionEn: "Charge of proton?",
        optionsAr: ["موجبة", "سالبة", "متعادلة", "لا شحنة"],
        optionsEn: ["Positive", "Negative", "Neutral", "No charge"],
        answer: "موجبة",
        explanationAr: "البروتون له شحنة موجبة (+1)",
        explanationEn: "Proton has positive charge (+1)"
      },
      {
        type: "multiple_choice",
        questionAr: "أين توجد معظم كتلة الذرة؟",
        questionEn: "Where is most atomic mass?",
        optionsAr: ["الإلكترونات", "النواة", "الفراغ", "موزعة بالتساوي"],
        optionsEn: ["Electrons", "Nucleus", "Space", "Evenly distributed"],
        answer: "النواة",
        explanationAr: "معظم الكتلة في النواة",
        explanationEn: "Most mass in nucleus"
      }
    ],
    formulas: [
      { formula: "A = Z + N", explanationAr: "العدد الكتلي = العدد الذري + عدد النيوترونات", explanationEn: "Mass number = Atomic number + Neutrons" }
    ]
  },

  "الذرة والتركيب الذري": {
    examples: [
      {
        questionAr: "أوجد عدد النيوترونات في الكربون-12 (Z=6)",
        questionEn: "Find neutrons in carbon-12 (Z=6)",
        solutionAr: "N = A - Z = 12 - 6 = 6 نيوترونات",
        solutionEn: "N = A - Z = 12 - 6 = 6 neutrons",
        stepsAr: ["العدد الكتلي A = 12", "العدد الذري Z = 6", "N = 12 - 6 = 6"],
        stepsEn: ["Mass number A = 12", "Atomic number Z = 6", "N = 12 - 6 = 6"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما الذي يحدد العنصر؟",
        questionEn: "What determines the element?",
        optionsAr: ["عدد النيوترونات", "عدد البروتونات", "عدد الإلكترونات", "العدد الكتلي"],
        optionsEn: ["Neutrons", "Protons", "Electrons", "Mass number"],
        answer: "عدد البروتونات",
        explanationAr: "العدد الذري (عدد البروتونات) يحدد هوية العنصر",
        explanationEn: "Atomic number (protons) determines element identity"
      }
    ],
    formulas: [
      { formula: "N = A - Z", explanationAr: "عدد النيوترونات = العدد الكتلي - العدد الذري", explanationEn: "Neutrons = Mass number - Atomic number" }
    ]
  },

  // ==================== الرياضيات ====================
  
  "الأعداد الحقيقية": {
    examples: [
      {
        questionAr: "أوجد |−5| + |3|",
        questionEn: "Find |−5| + |3|",
        solutionAr: "|−5| + |3| = 5 + 3 = 8",
        solutionEn: "|−5| + |3| = 5 + 3 = 8",
        stepsAr: ["|−5| = 5", "|3| = 3", "المجموع = 8"],
        stepsEn: ["|−5| = 5", "|3| = 3", "Sum = 8"]
      },
      {
        questionAr: "بسّط √18",
        questionEn: "Simplify √18",
        solutionAr: "√18 = √(9×2) = 3√2",
        solutionEn: "√18 = √(9×2) = 3√2",
        stepsAr: ["18 = 9 × 2", "√18 = √9 × √2", "= 3√2"],
        stepsEn: ["18 = 9 × 2", "√18 = √9 × √2", "= 3√2"]
      },
      {
        questionAr: "أوجد قيمة (−3)²",
        questionEn: "Find (−3)²",
        solutionAr: "(−3)² = 9",
        solutionEn: "(−3)² = 9",
        stepsAr: ["(−3)² = (−3) × (−3)", "= 9 (سالب × سالب = موجب)"],
        stepsEn: ["(−3)² = (−3) × (−3)", "= 9 (negative × negative = positive)"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما القيمة المطلقة لـ −7؟",
        questionEn: "What is |−7|?",
        optionsAr: ["−7", "7", "0", "14"],
        optionsEn: ["−7", "7", "0", "14"],
        answer: "7",
        explanationAr: "القيمة المطلقة دائماً موجبة",
        explanationEn: "Absolute value is always positive"
      },
      {
        type: "multiple_choice",
        questionAr: "√16 = ؟",
        questionEn: "√16 = ?",
        optionsAr: ["2", "4", "8", "16"],
        optionsEn: ["2", "4", "8", "16"],
        answer: "4",
        explanationAr: "4² = 16",
        explanationEn: "4² = 16"
      },
      {
        type: "multiple_choice",
        questionAr: "أي الأعداد التالية عدد نسبي؟",
        questionEn: "Which is a rational number?",
        optionsAr: ["√2", "π", "3/4", "√3"],
        optionsEn: ["√2", "π", "3/4", "√3"],
        answer: "3/4",
        explanationAr: "3/4 عدد نسبي لأنه يمكن كتابته ككسر",
        explanationEn: "3/4 is rational because it can be written as a fraction"
      }
    ]
  },

  "الجذور وخصائصها": {
    examples: [
      {
        questionAr: "بسّط √12 × √3",
        questionEn: "Simplify √12 × √3",
        solutionAr: "√12 × √3 = √36 = 6",
        solutionEn: "√12 × √3 = √36 = 6",
        stepsAr: ["√a × √b = √(a×b)", "√12 × √3 = √36 = 6"],
        stepsEn: ["√a × √b = √(a×b)", "√12 × √3 = √36 = 6"]
      },
      {
        questionAr: "بسّط √50",
        questionEn: "Simplify √50",
        solutionAr: "√50 = √(25×2) = 5√2",
        solutionEn: "√50 = √(25×2) = 5√2",
        stepsAr: ["50 = 25 × 2", "√50 = √25 × √2", "= 5√2"],
        stepsEn: ["50 = 25 × 2", "√50 = √25 × √2", "= 5√2"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "√8 × √2 = ؟",
        questionEn: "√8 × √2 = ?",
        optionsAr: ["√10", "4", "√16", "10"],
        optionsEn: ["√10", "4", "√16", "10"],
        answer: "4",
        explanationAr: "√8 × √2 = √16 = 4",
        explanationEn: "√8 × √2 = √16 = 4"
      }
    ],
    formulas: [
      { formula: "√a × √b = √(a×b)", explanationAr: "حاصل ضرب جذرين", explanationEn: "Product of square roots" },
      { formula: "√a ÷ √b = √(a/b)", explanationAr: "قسمة جذرين", explanationEn: "Division of square roots" }
    ]
  },

  "الجبر الأساسي": {
    examples: [
      {
        questionAr: "حل المعادلة: 2x + 5 = 13",
        questionEn: "Solve: 2x + 5 = 13",
        solutionAr: "x = 4",
        solutionEn: "x = 4",
        stepsAr: ["2x + 5 = 13", "2x = 13 - 5 = 8", "x = 8/2 = 4"],
        stepsEn: ["2x + 5 = 13", "2x = 13 - 5 = 8", "x = 8/2 = 4"]
      },
      {
        questionAr: "بسّط: 3(x + 2) - 2x",
        questionEn: "Simplify: 3(x + 2) - 2x",
        solutionAr: "3x + 6 - 2x = x + 6",
        solutionEn: "3x + 6 - 2x = x + 6",
        stepsAr: ["3(x + 2) = 3x + 6", "3x + 6 - 2x", "= x + 6"],
        stepsEn: ["3(x + 2) = 3x + 6", "3x + 6 - 2x", "= x + 6"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "حل المعادلة: 3x - 7 = 8",
        questionEn: "Solve: 3x - 7 = 8",
        optionsAr: ["x = 1", "x = 5", "x = 15", "x = 3"],
        optionsEn: ["x = 1", "x = 5", "x = 15", "x = 3"],
        answer: "x = 5",
        explanationAr: "3x = 15, x = 5",
        explanationEn: "3x = 15, x = 5"
      }
    ]
  },

  // ==================== الأحياء ====================
  
  "مقدمة في الأحياء": {
    examples: [
      {
        questionAr: "ما خصائص الكائنات الحية؟",
        questionEn: "Characteristics of living organisms?",
        solutionAr: "التنفس، التغذية، التكاثر، النمو، الإخراج، الحركة، الإحساس",
        solutionEn: "Respiration, nutrition, reproduction, growth, excretion, movement, sensation",
        stepsAr: ["التنفس: إنتاج الطاقة", "التغذية: الحصول على الغذاء", "التكاثر: إنتاج أفراد جدد", "النمو: زيادة الحجم"],
        stepsEn: ["Respiration: energy production", "Nutrition: obtaining food", "Reproduction: producing new individuals", "Growth: increasing size"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما الوحدة البنائية للكائنات الحية؟",
        questionEn: "Building unit of living organisms?",
        optionsAr: ["الذرة", "الخلية", "الجزيء", "العضو"],
        optionsEn: ["Atom", "Cell", "Molecule", "Organ"],
        answer: "الخلية",
        explanationAr: "الخلية هي الوحدة البنائية الأساسية",
        explanationEn: "Cell is the basic building unit"
      },
      {
        type: "multiple_choice",
        questionAr: "أي مما يلي ليس من خصائص الكائنات الحية؟",
        questionEn: "Which is NOT a characteristic of living organisms?",
        optionsAr: ["التكاثر", "التنفس", "الاحتراق", "النمو"],
        optionsEn: ["Reproduction", "Respiration", "Combustion", "Growth"],
        answer: "الاحتراق",
        explanationAr: "الاحتراق ليس من خصائص الكائنات الحية",
        explanationEn: "Combustion is not a characteristic of living organisms"
      }
    ]
  }
};

// قوالب عامة للمواد الأخرى
const genericTemplates = {
  arabic: {
    examples: [
      {
        questionAr: "حلل النص التالي واستخرج الأساليب البلاغية",
        questionEn: "Analyze the text and extract rhetorical styles",
        solutionAr: "يتم تحليل النص واستخراج الأساليب المطلوبة",
        solutionEn: "Text is analyzed and required styles are extracted",
        stepsAr: ["قراءة النص بعناية", "تحديد الأساليب البلاغية", "شرح كل أسلوب"],
        stepsEn: ["Read text carefully", "Identify rhetorical styles", "Explain each style"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما الأسلوب البلاغي المستخدم؟",
        questionEn: "What rhetorical style is used?",
        optionsAr: ["تشبيه", "استعارة", "كناية", "جناس"],
        optionsEn: ["Simile", "Metaphor", "Metonymy", "Paronomasia"],
        answer: "تشبيه",
        explanationAr: "التشبيه هو عقد مقارنة بين شيئين",
        explanationEn: "Simile is comparing two things"
      }
    ]
  },
  english: {
    examples: [
      {
        questionAr: "ترجم الجملة التالية إلى العربية",
        questionEn: "Translate the following sentence to Arabic",
        solutionAr: "الترجمة الصحيحة",
        solutionEn: "Correct translation",
        stepsAr: ["فهم معنى الجملة", "تحديد الكلمات المفتاحية", "صياغة الترجمة"],
        stepsEn: ["Understand sentence meaning", "Identify keywords", "Formulate translation"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما معنى الكلمة؟",
        questionEn: "What does the word mean?",
        optionsAr: ["معنى 1", "معنى 2", "معنى 3", "معنى 4"],
        optionsEn: ["Meaning 1", "Meaning 2", "Meaning 3", "Meaning 4"],
        answer: "معنى 1",
        explanationAr: "الشرح",
        explanationEn: "Explanation"
      }
    ]
  },
  science: {
    examples: [
      {
        questionAr: "اشرح الظاهرة العلمية",
        questionEn: "Explain the scientific phenomenon",
        solutionAr: "يتم شرح الظاهرة وذكر أسبابها ونتائجها",
        solutionEn: "Phenomenon is explained with causes and results",
        stepsAr: ["تحديد الظاهرة", "شرح الأسباب", "ذكر النتائج"],
        stepsEn: ["Identify phenomenon", "Explain causes", "Mention results"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما السبب الرئيسي للظاهرة؟",
        questionEn: "What is the main cause of the phenomenon?",
        optionsAr: ["سبب 1", "سبب 2", "سبب 3", "سبب 4"],
        optionsEn: ["Cause 1", "Cause 2", "Cause 3", "Cause 4"],
        answer: "سبب 1",
        explanationAr: "الشرح",
        explanationEn: "Explanation"
      }
    ],
    formulas: [
      {
        formula: "القانون",
        explanationAr: "شرح القانون",
        explanationEn: "Law explanation"
      }
    ]
  }
};

function getTemplateForSubject(subjectName: string) {
  if (subjectName.includes("عربي")) return genericTemplates.arabic;
  if (subjectName.includes("إنجليزي")) return genericTemplates.english;
  return genericTemplates.science;
}

async function seedAllContent() {
  console.log("📚 بدء ملء جميع البيانات...\n");

  // الحصول على جميع الدروس بدون محتوى
  const lessons = await prisma.lesson.findMany({
    include: {
      unit: {
        include: {
          subject: true
        }
      },
      _count: {
        select: { examples: true, questions: true }
      }
    }
  });

  console.log(`عدد الدروس الكلي: ${lessons.length}\n`);

  let added = 0;
  let skipped = 0;

  for (const lesson of lessons) {
    // تخطي الدروس التي لديها محتوى
    if (lesson._count.examples > 0 && lesson._count.questions > 0) {
      skipped++;
      continue;
    }

    const subjectName = lesson.unit?.subject?.nameAr || "";
    const content = lessonContent[lesson.titleAr];
    
    // استخدام المحتوى المحدد أو القالب العام
    const data = content || getTemplateForSubject(subjectName);

    if (data) {
      try {
        // إضافة الأمثلة
        if (data.examples && lesson._count.examples === 0) {
          for (let i = 0; i < data.examples.length; i++) {
            const ex = data.examples[i];
            await prisma.example.create({
              data: {
                lessonId: lesson.id,
                questionAr: ex.questionAr,
                questionEn: ex.questionEn,
                solutionAr: ex.solutionAr,
                solutionEn: ex.solutionEn,
                stepsAr: JSON.stringify(ex.stepsAr),
                stepsEn: JSON.stringify(ex.stepsEn),
                order: i + 1
              }
            });
          }
        }

        // إضافة الأسئلة
        if (data.questions && lesson._count.questions === 0) {
          for (let i = 0; i < data.questions.length; i++) {
            const q = data.questions[i];
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
                points: 1,
                difficulty: "medium",
                order: i + 1
              }
            });
          }
        }

        // إضافة القوانين
        if (data.formulas && data.formulas.length > 0) {
          for (let i = 0; i < data.formulas.length; i++) {
            const f = data.formulas[i];
            await prisma.formula.create({
              data: {
                lessonId: lesson.id,
                formula: f.formula,
                explanationAr: f.explanationAr,
                explanationEn: f.explanationEn,
                order: i + 1
              }
            });
          }
        }

        added++;
        if (added % 100 === 0) {
          console.log(`تم معالجة ${added} درس...`);
        }
      } catch (e) {
        console.error(`خطأ في الدرس: ${lesson.titleAr}`);
      }
    }
  }

  // الإحصائيات النهائية
  const finalStats = await prisma.$transaction([
    prisma.lesson.count(),
    prisma.example.count(),
    prisma.question.count(),
    prisma.formula.count(),
    prisma.objective.count(),
    prisma.concept.count()
  ]);

  console.log(`\n📊 الإحصائيات النهائية:`);
  console.log(`   الدروس: ${finalStats[0]}`);
  console.log(`   الأمثلة: ${finalStats[1]}`);
  console.log(`   الأسئلة: ${finalStats[2]}`);
  console.log(`   القوانين: ${finalStats[3]}`);
  console.log(`   الأهداف: ${finalStats[4]}`);
  console.log(`   المفاهيم: ${finalStats[5]}`);
  console.log(`\n   تمت معالجة: ${added}`);
  console.log(`   تم تخطي (لديه محتوى): ${skipped}`);

  await prisma.$disconnect();
  console.log("\n✨ تم الانتهاء!");
}

seedAllContent().catch(console.error);
