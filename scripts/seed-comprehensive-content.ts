import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// قوالب المحتوى حسب نوع المادة
const contentTemplates = {
  // اللغة العربية - النحو
  arabic_grammar: {
    examples: [
      {
        questionAr: "أعرب الكلمة المطلوبة في الجملة",
        questionEn: "Parse the required word in the sentence",
        solutionAr: "الإعراب: كلمة معربة حسب موقعها في الجملة",
        solutionEn: "Parsing: Word parsed according to its position in the sentence"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما إعراب الكلمة المطلوبة؟",
        questionEn: "What is the grammatical case of the required word?",
        optionsAr: ["رفوع", "منصوب", "مجرور", "مجزوم"],
        optionsEn: ["Nominative", "Accusative", "Genitive", "Jussive"],
        answer: "رفوع"
      }
    ]
  },

  // اللغة العربية - البلاغة
  arabic_rhetoric: {
    examples: [
      {
        questionAr: "حدد الأسلوب البلاغي في النص",
        questionEn: "Identify the rhetorical style in the text"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما نوع الصورة البيانية؟",
        questionEn: "What type of imagery is this?"
      }
    ]
  },

  // الرياضيات
  mathematics: {
    examples: [
      {
        questionAr: "أوجد الحل المطلوب",
        questionEn: "Find the required solution",
        solutionAr: "الحل: يتم الخطوات المطلوبة للوصول للنتيجة",
        solutionEn: "Solution: Follow the required steps to reach the result"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما نتيجة العملية الحسابية؟",
        questionEn: "What is the result of the calculation?"
      }
    ],
    formulas: [
      {
        formula: "القانون الأساسي",
        explanationAr: "شرح القانون بالعربية",
        explanationEn: "Explanation in English"
      }
    ]
  },

  // الفيزياء
  physics: {
    examples: [
      {
        questionAr: "احسب الكمية المطلوبة",
        questionEn: "Calculate the required quantity"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما القانون المناسب لحل هذه المسألة؟",
        questionEn: "What is the appropriate law to solve this problem?"
      }
    ],
    formulas: [
      {
        formula: "F = ma",
        explanationAr: "القوة = الكتلة × التسارع",
        explanationEn: "Force = Mass × Acceleration"
      }
    ]
  },

  // الكيمياء
  chemistry: {
    examples: [
      {
        questionAr: "ما ناتج التفاعل الكيميائي؟",
        questionEn: "What is the product of the chemical reaction?"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما نوع التفاعل الكيميائي؟",
        questionEn: "What type of chemical reaction is this?"
      }
    ],
    formulas: [
      {
        formula: "n = m/M",
        explanationAr: "عدد المولات = الكتلة ÷ الكتلة المولية",
        explanationEn: "Number of moles = Mass ÷ Molar mass"
      }
    ]
  },

  // الأحياء
  biology: {
    examples: [
      {
        questionAr: "اشرح العملية البيولوجية",
        questionEn: "Explain the biological process"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما وظيفة العضو/الخلية؟",
        questionEn: "What is the function of the organ/cell?"
      }
    ]
  },

  // التاريخ
  history: {
    examples: [
      {
        questionAr: "اذكر أهم أحداث الفترة التاريخية",
        questionEn: "Mention the most important events of the historical period"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "متى وقع الحدث التاريخي؟",
        questionEn: "When did the historical event occur?"
      }
    ]
  },

  // الجغرافيا
  geography: {
    examples: [
      {
        questionAr: "اشرح الظاهرة الجغرافية",
        questionEn: "Explain the geographical phenomenon"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما سبب الظاهرة الجغرافية؟",
        questionEn: "What causes the geographical phenomenon?"
      }
    ]
  },

  // الفلسفة
  philosophy: {
    examples: [
      {
        questionAr: "حلل الفكرة الفلسفية",
        questionEn: "Analyze the philosophical idea"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما المفهوم الفلسفي الصحيح؟",
        questionEn: "What is the correct philosophical concept?"
      }
    ]
  },

  // اللغة الإنجليزية
  english: {
    examples: [
      {
        questionAr: "ترجم الجملة إلى العربية",
        questionEn: "Translate the sentence to Arabic"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما المعنى الصحيح للكلمة؟",
        questionEn: "What is the correct meaning of the word?"
      }
    ]
  },

  // اللغة الفرنسية
  french: {
    examples: [
      {
        questionAr: "ترجم الجملة إلى العربية",
        questionEn: "Translate the sentence to Arabic"
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما المعنى الصحيح؟",
        questionEn: "What is the correct meaning?"
      }
    ]
  }
};

// بيانات محددة لكل درس
const lessonSpecificContent: Record<string, any> = {
  // === الصف الأول الثانوي ===
  
  // اللغة العربية - النحو
  "المبتدأ والخبر": {
    examples: [
      {
        questionAr: "أعرب الجملة: العلمُ نورٌ",
        questionEn: "Parse the sentence: العلمُ نورٌ",
        solutionAr: "العلمُ: مبتدأ مرفوع بالضمة. نورٌ: خبر مرفوع بالضمة.",
        solutionEn: "العلمُ: Subject in nominative. نورٌ: Predicate in nominative.",
        stepsAr: ["نحدد المبتدأ: العلمُ", "نحدد الخبر: نورٌ", "نعرب كل منهما مرفوعاً"],
        stepsEn: ["Identify subject: العلمُ", "Identify predicate: نورٌ", "Both are in nominative case"]
      },
      {
        questionAr: "حدد نوع الخبر: الكتابُ على الطاولة",
        questionEn: "Identify the type of predicate: الكتابُ على الطاولة",
        solutionAr: "الخبر (على الطاولة) شبه جملة (جار ومجرور)",
        solutionEn: "The predicate (على الطاولة) is a semi-sentence (prepositional phrase)",
        stepsAr: ["المبتدأ: الكتابُ", "الخبر: على الطاولة", "نوعه: شبه جملة"],
        stepsEn: ["Subject: الكتابُ", "Predicate: على الطاولة", "Type: Semi-sentence"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما نوع الخبر في: السماءُ صافيةٌ؟",
        questionEn: "What type of predicate in: السماءُ صافيةٌ؟",
        optionsAr: ["مفرد", "جملة فعلية", "جملة اسمية", "شبه جملة"],
        optionsEn: ["Singular", "Verbal sentence", "Nominal sentence", "Semi-sentence"],
        answer: "مفرد",
        explanationAr: "صافيةٌ خبر مفرد (كلمة واحدة)",
        explanationEn: "صافيةٌ is a singular predicate (single word)"
      },
      {
        type: "multiple_choice",
        questionAr: "ما إعراب كلمة (الطالب) في: الطالبُ مجتهدٌ؟",
        questionEn: "Parse (الطالب) in: الطالبُ مجتهدٌ؟",
        optionsAr: ["خبر مرفوع", "مبتدأ مرفوع", "فاعل", "مفعول به"],
        optionsEn: ["Predicate", "Subject", "Doer", "Object"],
        answer: "مبتدأ مرفوع",
        explanationAr: "الطالبُ مبتدأ لأنه الاسم الذي تبدأ به الجملة الاسمية",
        explanationEn: "الطالبُ is the subject because it's the noun starting the nominal sentence"
      },
      {
        type: "multiple_choice",
        questionAr: "أي الجمل التالية فيها خبر جملة فعلية؟",
        questionEn: "Which sentence has a verbal sentence predicate?",
        optionsAr: ["الطالبُ ذكيٌ", "الطالبُ يدرسُ", "الطالبُ في الفصل", "الطالبُ أخلاقه حسنة"],
        optionsEn: ["الطالبُ ذكيٌ", "الطالبُ يدرسُ", "الطالبُ في الفصل", "الطالبُ أخلاقه حسنة"],
        answer: "الطالبُ يدرسُ",
        explanationAr: "يدرسُ جملة فعلية في محل رفع خبر",
        explanationEn: "يدرسُ is a verbal sentence in the place of a nominative predicate"
      }
    ]
  },

  "الفاعل ونائب الفاعل": {
    examples: [
      {
        questionAr: "أعرب: نجحَ الطالبُ",
        questionEn: "Parse: نجحَ الطالبُ",
        solutionAr: "الطالبُ: فاعل مرفوع بالضمة الظاهرة",
        solutionEn: "الطالبُ: Doer in nominative case with visible damma",
        stepsAr: ["الفعل: نجحَ", "الفاعل: الطالبُ", "الإعراب: فاعل مرفوع"],
        stepsEn: ["Verb: نجحَ", "Doer: الطالبُ", "Parsing: Doer in nominative"]
      },
      {
        questionAr: "أعرب: كُرمَ المتفوقُ",
        questionEn: "Parse: كُرمَ المتفوقُ",
        solutionAr: "المتفوقُ: نائب فاعل مرفوع بالضمة",
        solutionEn: "المتفوقُ: Deputy doer in nominative case",
        stepsAr: ["الفعل مبني للمجهول: كُرمَ", "نائب الفاعل: المتفوقُ", "الإعراب: نائب فاعل مرفوع"],
        stepsEn: ["Passive verb: كُرمَ", "Deputy doer: المتفوقُ", "Parsing: Deputy doer in nominative"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "كيف نعرف أن الفعل مبني للمجهول؟",
        questionEn: "How do we know a verb is passive?",
        optionsAr: ["يبدأ بسين", "يكون مضارعاً", "يُضم أوله ويُكسر ما قبل آخره", "يكون ماضياً فقط"],
        optionsEn: ["Starts with س", "Is present tense", "First letter has damma, letter before last has kasra", "Is only past tense"],
        answer: "يُضم أوله ويُكسر ما قبل آخره",
        explanationAr: "الفعل المبني للمجهول يُضم أوله ويُكسر ما قبل آخره في الماضي",
        explanationEn: "Passive verb has damma on first letter and kasra on letter before last in past tense"
      },
      {
        type: "multiple_choice",
        questionAr: "ما إعراب (الباب) في: فُتح البابُ؟",
        questionEn: "Parse (الباب) in: فُتح البابُ؟",
        optionsAr: ["فاعل", "نائب فاعل", "مبتدأ", "مفعول به"],
        optionsEn: ["Doer", "Deputy doer", "Subject", "Object"],
        answer: "نائب فاعل",
        explanationAr: "لأن الفعل (فُتح) مبني للمجهول",
        explanationEn: "Because the verb (فُتح) is in passive voice"
      }
    ]
  },

  "المفعول به": {
    examples: [
      {
        questionAr: "أعرب: قرأتُ الكتابَ",
        questionEn: "Parse: قرأتُ الكتابَ",
        solutionAr: "الكتابَ: مفعول به منصوب بالفتحة",
        solutionEn: "الكتابَ: Object in accusative case with fatha",
        stepsAr: ["الفعل: قرأتُ", "الفاعل: التاء", "المفعول به: الكتابَ"],
        stepsEn: ["Verb: قرأتُ", "Doer: The ta", "Object: الكتابَ"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما علامة نصب المفعول به؟",
        questionEn: "What is the accusative sign of the object?",
        optionsAr: ["الضمة", "الفتحة", "الكسرة", "السكون"],
        optionsEn: ["Damma", "Fatha", "Kasra", "Sukun"],
        answer: "الفتحة",
        explanationAr: "المفعول به منصوب وعلامة نصبه الفتحة",
        explanationEn: "Object is in accusative case marked by fatha"
      }
    ]
  },

  // === الفيزياء ===
  "مقدمة في الفيزياء": {
    examples: [
      {
        questionAr: "ما هي الكميات الفيزيائية الأساسية السبع؟",
        questionEn: "What are the seven fundamental physical quantities?",
        solutionAr: "الطول (متر)، الكتلة (كجم)، الزمن (ث)، التيار (أ)، الحرارة (ك)، كمية المادة (مول)، شدة الإضاءة (كند)",
        solutionEn: "Length (m), Mass (kg), Time (s), Current (A), Temperature (K), Amount (mol), Luminous intensity (cd)",
        stepsAr: ["الطول - متر", "الكتلة - كيلوجرام", "الزمن - ثانية", "التيار - أمبير", "الحرارة - كلفن", "كمية المادة - مول", "شدة الإضاءة - كانديلا"],
        stepsEn: ["Length - meter", "Mass - kilogram", "Time - second", "Current - ampere", "Temperature - kelvin", "Amount - mole", "Luminous intensity - candela"]
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
        questionAr: "أي الكميات التالية كمية مشتقة؟",
        questionEn: "Which is a derived quantity?",
        optionsAr: ["الكتلة", "الزمن", "السرعة", "درجة الحرارة"],
        optionsEn: ["Mass", "Time", "Velocity", "Temperature"],
        answer: "السرعة",
        explanationAr: "السرعة كمية مشتقة من الطول والزمن",
        explanationEn: "Velocity is derived from length and time"
      }
    ],
    formulas: [
      {
        formula: "v = d/t",
        explanationAr: "السرعة = الإزاحة ÷ الزمن",
        explanationEn: "Velocity = Displacement ÷ Time"
      },
      {
        formula: "a = Δv/Δt",
        explanationAr: "التسارع = التغير في السرعة ÷ الزمن",
        explanationEn: "Acceleration = Change in velocity ÷ Time"
      }
    ]
  },

  "القياس والوحدات": {
    examples: [
      {
        questionAr: "حوّل 5 كم إلى متر",
        questionEn: "Convert 5 km to meters",
        solutionAr: "5 كم = 5 × 1000 = 5000 م",
        solutionEn: "5 km = 5 × 1000 = 5000 m",
        stepsAr: ["1 كم = 1000 م", "5 كم = 5 × 1000", "النتيجة: 5000 م"],
        stepsEn: ["1 km = 1000 m", "5 km = 5 × 1000", "Result: 5000 m"]
      },
      {
        questionAr: "حوّل 36 كم/س إلى م/ث",
        questionEn: "Convert 36 km/h to m/s",
        solutionAr: "36 كم/س = 36 × (1000/3600) = 10 م/ث",
        solutionEn: "36 km/h = 36 × (1000/3600) = 10 m/s",
        stepsAr: ["1 كم/س = 1000/3600 م/ث = 5/18 م/ث", "36 × 5/18 = 10 م/ث"],
        stepsEn: ["1 km/h = 1000/3600 m/s = 5/18 m/s", "36 × 5/18 = 10 m/s"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما قيمة البادئة (كيلو)؟",
        questionEn: "What is the value of prefix (kilo)?",
        optionsAr: ["10²", "10³", "10⁶", "10⁻³"],
        optionsEn: ["10²", "10³", "10⁶", "10⁻³"],
        answer: "10³",
        explanationAr: "كيلو = 1000 = 10³",
        explanationEn: "Kilo = 1000 = 10³"
      }
    ],
    formulas: [
      {
        formula: "1 km = 10³ m",
        explanationAr: "الكيلومتر = 1000 متر",
        explanationEn: "Kilometer = 1000 meters"
      },
      {
        formula: "1 mm = 10⁻³ m",
        explanationAr: "الملليمتر = 0.001 متر",
        explanationEn: "Millimeter = 0.001 meters"
      }
    ]
  },

  "الحركة المستقيمة": {
    examples: [
      {
        questionAr: "سيارة تتحرك بسرعة 20 م/ث لمدة 30 ثانية، ما الإزاحة؟",
        questionEn: "A car moves at 20 m/s for 30 seconds, what is the displacement?",
        solutionAr: "الإزاحة = السرعة × الزمن = 20 × 30 = 600 م",
        solutionEn: "Displacement = Velocity × Time = 20 × 30 = 600 m",
        stepsAr: ["d = v × t", "d = 20 × 30", "d = 600 م"],
        stepsEn: ["d = v × t", "d = 20 × 30", "d = 600 m"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما الفرق بين المسافة والإزاحة؟",
        questionEn: "What is the difference between distance and displacement?",
        optionsAr: ["لا فرق", "المسافة متجهة", "الإزاحة متجهة", "كلاهما قياسية"],
        optionsEn: ["No difference", "Distance is vector", "Displacement is vector", "Both are scalar"],
        answer: "الإزاحة متجهة",
        explanationAr: "الإزاحة كمية متجهة لها مقدار واتجاه",
        explanationEn: "Displacement is a vector with magnitude and direction"
      }
    ],
    formulas: [
      {
        formula: "v = d/t",
        explanationAr: "السرعة = الإزاحة ÷ الزمن",
        explanationEn: "Velocity = Displacement ÷ Time"
      },
      {
        formula: "v = v₀ + at",
        explanationAr: "السرعة النهائية = السرعة الابتدائية + (التسارع × الزمن)",
        explanationEn: "Final velocity = Initial velocity + (Acceleration × Time)"
      },
      {
        formula: "d = v₀t + ½at²",
        explanationAr: "الإزاحة = (السرعة الابتدائية × الزمن) + (½ × التسارع × مربع الزمن)",
        explanationEn: "Displacement = (Initial velocity × Time) + (½ × Acceleration × Time²)"
      }
    ]
  },

  // === الكيمياء ===
  "مقدمة في الكيمياء": {
    examples: [
      {
        questionAr: "ما مكونات الذرة؟",
        questionEn: "What are the components of an atom?",
        solutionAr: "الذرة تتكون من: نواة (بروتونات + نيوترونات) + إلكترونات تدور حولها",
        solutionEn: "Atom consists of: nucleus (protons + neutrons) + electrons orbiting around",
        stepsAr: ["النواة في المركز", "تحتوي على بروتونات (+) ونيوترونات (0)", "الإلكترونات (-) تدور حول النواة"],
        stepsEn: ["Nucleus in center", "Contains protons (+) and neutrons (0)", "Electrons (-) orbit around nucleus"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما شحنة البروتون؟",
        questionEn: "What is the charge of a proton?",
        optionsAr: ["موجبة", "سالبة", "متعادلة", "لا شحنة لها"],
        optionsEn: ["Positive", "Negative", "Neutral", "No charge"],
        answer: "موجبة",
        explanationAr: "البروتون له شحنة موجبة (+1)",
        explanationEn: "Proton has a positive charge (+1)"
      },
      {
        type: "multiple_choice",
        questionAr: "أين توجد معظم كتلة الذرة؟",
        questionEn: "Where is most of the atom's mass located?",
        optionsAr: ["في الإلكترونات", "في النواة", "في الفراغ", "موزعة بالتساوي"],
        optionsEn: ["In electrons", "In nucleus", "In space", "Evenly distributed"],
        answer: "في النواة",
        explanationAr: "معظم كتلة الذرة تتركز في النواة",
        explanationEn: "Most of the atom's mass is concentrated in the nucleus"
      }
    ],
    formulas: [
      {
        formula: "A = Z + N",
        explanationAr: "العدد الكتلي = العدد الذري + عدد النيوترونات",
        explanationEn: "Mass number = Atomic number + Number of neutrons"
      }
    ]
  },

  "الذرة والتركيب الذري": {
    examples: [
      {
        questionAr: "أوجد عدد النيوترونات في ذرة الكربون-12 (العدد الذري 6)",
        questionEn: "Find the number of neutrons in carbon-12 (atomic number 6)",
        solutionAr: "عدد النيوترونات = 12 - 6 = 6",
        solutionEn: "Number of neutrons = 12 - 6 = 6",
        stepsAr: ["العدد الكتلي = 12", "العدد الذري = 6", "N = A - Z = 12 - 6 = 6"],
        stepsEn: ["Mass number = 12", "Atomic number = 6", "N = A - Z = 12 - 6 = 6"]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما الذى يحدد العنصر؟",
        questionEn: "What determines the element?",
        optionsAr: ["عدد النيوترونات", "عدد الإلكترونات", "عدد البروتونات", "العدد الكتلي"],
        optionsEn: ["Neutrons", "Electrons", "Protons", "Mass number"],
        answer: "عدد البروتونات",
        explanationAr: "العدد الذري (عدد البروتونات) يحدد هوية العنصر",
        explanationEn: "Atomic number (proton count) determines element identity"
      }
    ],
    formulas: [
      {
        formula: "N = A - Z",
        explanationAr: "عدد النيوترونات = العدد الكتلي - العدد الذري",
        explanationEn: "Neutrons = Mass number - Atomic number"
      }
    ]
  },

  // === الرياضيات ===
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
        stepsAr: ["√a × √b = √(a×b)", "√12 × √3 = √36", "= 6"],
        stepsEn: ["√a × √b = √(a×b)", "√12 × √3 = √36", "= 6"]
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
      {
        formula: "√a × √b = √(a×b)",
        explanationAr: "حاصل ضرب جذرين",
        explanationEn: "Product of square roots"
      },
      {
        formula: "√a ÷ √b = √(a/b)",
        explanationAr: "قسمة جذرين",
        explanationEn: "Division of square roots"
      }
    ]
  }
};

// دالة لتحديد نوع المادة
function getSubjectType(subjectName: string): string {
  if (subjectName.includes("عربي") || subjectName.includes("نحو") || subjectName.includes("بلاغة")) {
    return "arabic_grammar";
  }
  if (subjectName.includes("رياضيات") || subjectName.includes("جبر") || subjectName.includes("هندسة")) {
    return "mathematics";
  }
  if (subjectName.includes("فيزياء")) {
    return "physics";
  }
  if (subjectName.includes("كيمياء")) {
    return "chemistry";
  }
  if (subjectName.includes("أحياء") || subjectName.includes("生物")) {
    return "biology";
  }
  if (subjectName.includes("تاريخ")) {
    return "history";
  }
  if (subjectName.includes("جغرافيا")) {
    return "geography";
  }
  if (subjectName.includes("فلسفة") || subjectName.includes("منطق")) {
    return "philosophy";
  }
  if (subjectName.includes("إنجليزي")) {
    return "english";
  }
  if (subjectName.includes("فرنس")) {
    return "french";
  }
  return "general";
}

async function seedComprehensiveContent() {
  console.log("📚 بدء إضافة المحتوى الشامل...\n");

  // الحصول على جميع الدروس
  const lessons = await prisma.lesson.findMany({
    include: {
      unit: {
        include: {
          subject: true
        }
      },
      examples: true,
      questions: true,
      formulas: true
    }
  });

  console.log(`عدد الدروس الكلي: ${lessons.length}\n`);

  let examplesAdded = 0;
  let questionsAdded = 0;
  let formulasAdded = 0;
  let lessonsUpdated = 0;

  for (const lesson of lessons) {
    // التحقق إذا كان الدرس لديه محتوى بالفعل
    if (lesson.examples.length > 0 || lesson.questions.length > 0) {
      continue;
    }

    const subjectName = lesson.unit?.subject?.nameAr || "";
    const subjectType = getSubjectType(subjectName);

    // البحث عن محتوى محدد للدرس
    let content = lessonSpecificContent[lesson.titleAr];

    // إذا لم يوجد محتوى محدد، استخدم قالب المادة
    if (!content) {
      const template = contentTemplates[subjectType as keyof typeof contentTemplates];
      if (template) {
        content = {
          examples: template.examples?.map((ex: any) => ({
            questionAr: ex.questionAr || `مثال على ${lesson.titleAr}`,
            questionEn: ex.questionEn || `Example on ${lesson.titleEn}`,
            solutionAr: ex.solutionAr || "الحل متاح في الشرح",
            solutionEn: ex.solutionEn || "Solution available in explanation",
            stepsAr: ex.stepsAr || ["الخطوة الأولى", "الخطوة الثانية"],
            stepsEn: ex.stepsEn || ["First step", "Second step"]
          })) || [],
          questions: template.questions?.map((q: any) => ({
            type: q.type || "multiple_choice",
            questionAr: q.questionAr || `سؤال على ${lesson.titleAr}`,
            questionEn: q.questionEn || `Question on ${lesson.titleEn}`,
            optionsAr: q.optionsAr || ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
            optionsEn: q.optionsEn || ["Option A", "Option B", "Option C", "Option D"],
            answer: q.answer || "الخيار أ",
            explanationAr: q.explanationAr || "الشرح",
            explanationEn: q.explanationEn || "Explanation"
          })) || [],
          formulas: template.formulas || []
        };
      }
    }

    if (content) {
      // إضافة الأمثلة
      if (content.examples && content.examples.length > 0) {
        for (let i = 0; i < content.examples.length; i++) {
          const example = content.examples[i];
          try {
            await prisma.example.create({
              data: {
                lessonId: lesson.id,
                questionAr: example.questionAr || `مثال ${i + 1}`,
                questionEn: example.questionEn || `Example ${i + 1}`,
                solutionAr: example.solutionAr || "",
                solutionEn: example.solutionEn || "",
                stepsAr: JSON.stringify(example.stepsAr || []),
                stepsEn: JSON.stringify(example.stepsEn || []),
                order: i + 1
              }
            });
            examplesAdded++;
          } catch (e) {
            // تخطي إذا فشل
          }
        }
      }

      // إضافة الأسئلة
      if (content.questions && content.questions.length > 0) {
        for (let i = 0; i < content.questions.length; i++) {
          const question = content.questions[i];
          try {
            await prisma.question.create({
              data: {
                lessonId: lesson.id,
                type: question.type || "multiple_choice",
                questionAr: question.questionAr || `سؤال ${i + 1}`,
                questionEn: question.questionEn || `Question ${i + 1}`,
                optionsAr: JSON.stringify(question.optionsAr || ["أ", "ب", "ج", "د"]),
                optionsEn: JSON.stringify(question.optionsEn || ["A", "B", "C", "D"]),
                answer: question.answer || "أ",
                explanationAr: question.explanationAr || "",
                explanationEn: question.explanationEn || "",
                points: 1,
                difficulty: "medium",
                order: i + 1
              }
            });
            questionsAdded++;
          } catch (e) {
            // تخطي إذا فشل
          }
        }
      }

      // إضافة القوانين
      if (content.formulas && content.formulas.length > 0) {
        for (let i = 0; i < content.formulas.length; i++) {
          const formula = content.formulas[i];
          try {
            await prisma.formula.create({
              data: {
                lessonId: lesson.id,
                formula: formula.formula || "",
                explanationAr: formula.explanationAr || "",
                explanationEn: formula.explanationEn || "",
                order: i + 1
              }
            });
            formulasAdded++;
          } catch (e) {
            // تخطي إذا فشل
          }
        }
      }

      lessonsUpdated++;
      if (lessonsUpdated % 50 === 0) {
        console.log(`تم تحديث ${lessonsUpdated} درس...`);
      }
    }
  }

  console.log(`\n📊 ملخص الإضافة:`);
  console.log(`   الدروس المحدثة: ${lessonsUpdated}`);
  console.log(`   الأمثلة المضافة: ${examplesAdded}`);
  console.log(`   الأسئلة المضافة: ${questionsAdded}`);
  console.log(`   القوانين المضافة: ${formulasAdded}`);

  await prisma.$disconnect();
  console.log("\n✨ تم الانتهاء!");
}

seedComprehensiveContent().catch(console.error);
