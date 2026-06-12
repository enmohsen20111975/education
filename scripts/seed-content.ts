import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// بيانات الأمثلة والأسئلة للمواد الدراسية
const contentData: Record<string, {
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
  // اللغة العربية - النحو
  "المبتدأ والخبر": {
    examples: [
      {
        questionAr: "أعرب الجملة التالية: العلمُ نورٌ",
        questionEn: "Parse the following sentence: العلمُ نورٌ",
        solutionAr: "العلمُ: مبتدأ مرفوع بالضمة الظاهرة على آخره. نورٌ: خبر مرفوع بالضمة الظاهرة على آخره.",
        solutionEn: "العلمُ: Subject (mubtada) in nominative case with visible damma. نورٌ: Predicate (khabar) in nominative case with visible damma.",
        stepsAr: [
          "نحدد المبتدأ: العلمُ (الاسم الذي تبدأ به الجملة)",
          "نحدد الخبر: نورٌ (الذي يخبر عن المبتدأ)",
          "نُعرب المبتدأ: مبتدأ مرفوع بالضمة",
          "نُعرب الخبر: خبر مرفوع بالضمة"
        ],
        stepsEn: [
          "Identify the subject: العلمُ (the noun starting the sentence)",
          "Identify the predicate: نورٌ (what informs about the subject)",
          "Parse the subject: Subject in nominative case with damma",
          "Parse the predicate: Predicate in nominative case with damma"
        ]
      },
      {
        questionAr: "حدد المبتدأ والخبر في: السماءُ صافيةٌ",
        questionEn: "Identify subject and predicate in: السماءُ صافيةٌ",
        solutionAr: "المبتدأ: السماءُ - الخبر: صافيةٌ",
        solutionEn: "Subject: السماءُ - Predicate: صافيةٌ",
        stepsAr: [
          "الجملة تبدأ باسم (السماءُ) فهي جملة اسمية",
          "المبتدأ: السماءُ (الاسم المرفوع في أول الجملة)",
          "الخبر: صافيةٌ (يخبر عن حالة السماء)"
        ],
        stepsEn: [
          "The sentence starts with a noun (السماءُ) so it's a nominal sentence",
          "Subject: السماءُ (the noun in nominative case at the beginning)",
          "Predicate: صافيةٌ (describes the state of the sky)"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما نوع الخبر في جملة: الكتابُ على الطاولة؟",
        questionEn: "What type of predicate is in: الكتابُ على الطاولة؟",
        optionsAr: ["مفرد", "جملة فعلية", "شبه جملة", "جملة اسمية"],
        optionsEn: ["Singular", "Verbal sentence", "Semi-sentence", "Nominal sentence"],
        answer: "شبه جملة",
        explanationAr: "الخبر (على الطاولة) شبه جملة جار ومجرور يتعلق بالمبتدأ",
        explanationEn: "The predicate (على الطاولة) is a semi-sentence (prepositional phrase) related to the subject"
      },
      {
        type: "multiple_choice",
        questionAr: "ما إعراب كلمة (مفيد) في: الكتابُ مفيدٌ؟",
        questionEn: "What is the grammatical case of (مفيد) in: الكتابُ مفيدٌ؟",
        optionsAr: ["مبتدأ", "خبر مرفوع", "فاعل", "مفعول به"],
        optionsEn: ["Subject", "Predicate in nominative", "Doer", "Object"],
        answer: "خبر مرفوع",
        explanationAr: "مفيدٌ: خبر المبتدأ مرفوع بالضمة الظاهرة",
        explanationEn: "مفيدٌ: Predicate of the subject in nominative case with visible damma"
      },
      {
        type: "multiple_choice",
        questionAr: "أي مما يلي ليس من أنواع الخبر؟",
        questionEn: "Which of the following is NOT a type of predicate?",
        optionsAr: ["المفرد", "الجملة", "شبه الجملة", "الفعل الماضي"],
        optionsEn: ["Singular", "Sentence", "Semi-sentence", "Past tense verb"],
        answer: "الفعل الماضي",
        explanationAr: "أنواع الخبر هي: المفرد، الجملة (فعلية أو اسمية)، شبه الجملة",
        explanationEn: "Types of predicate are: Singular, Sentence (verbal or nominal), Semi-sentence"
      }
    ]
  },

  // الفاعل ونائب الفاعل
  "الفاعل ونائب الفاعل": {
    examples: [
      {
        questionAr: "أعرب كلمة (الطالب) في: نجحَ الطالبُ",
        questionEn: "Parse (الطالب) in: نجحَ الطالبُ",
        solutionAr: "الطالبُ: فاعل مرفوع بالضمة الظاهرة على آخره",
        solutionEn: "الطالبُ: Doer in nominative case with visible damma",
        stepsAr: [
          "الفعل: نجحَ (ماضٍ)",
          "الفاعل: الطالبُ (من قام بالفعل)",
          "الإعراب: فاعل مرفوع بالضمة"
        ],
        stepsEn: [
          "Verb: نجحَ (past tense)",
          "Doer: الطالبُ (who performed the action)",
          "Parsing: Doer in nominative with damma"
        ]
      },
      {
        questionAr: "أعرب كلمة (النافذة) في: فُتحت النافذةُ",
        questionEn: "Parse (النافذة) in: فُتحت النافذةُ",
        solutionAr: "النافذةُ: نائب فاعل مرفوع بالضمة الظاهرة على آخره",
        solutionEn: "النافذةُ: Deputy doer in nominative case with visible damma",
        stepsAr: [
          "الفعل: فُتحت (مبني للمجهول)",
          "نائب الفاعل: النافذةُ",
          "الإعراب: نائب فاعل مرفوع بالضمة"
        ],
        stepsEn: [
          "Verb: فُتحت (passive voice)",
          "Deputy doer: النافذةُ",
          "Parsing: Deputy doer in nominative with damma"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "متى يكون الفاعل نائب فاعل؟",
        questionEn: "When does the doer become a deputy doer?",
        optionsAr: ["عندما يكون الفعل ماضياً", "عندما يكون الفعل مبنياً للمجهول", "عندما يكون الفعل مضارعاً", "عندما يكون الفعل أمراً"],
        optionsEn: ["When the verb is past tense", "When the verb is in passive voice", "When the verb is present tense", "When the verb is imperative"],
        answer: "عندما يكون الفعل مبنياً للمجهول",
        explanationAr: "نائب الفاعل يحل محل الفاعل عندما يكون الفعل مبنياً للمجهول",
        explanationEn: "The deputy doer replaces the doer when the verb is in passive voice"
      },
      {
        type: "multiple_choice",
        questionAr: "ما علامة رفع الفاعل؟",
        questionEn: "What is the nominative sign of the doer?",
        optionsAr: ["الفتحة", "الضمة", "الكسرة", "السكون"],
        optionsEn: ["Fatha", "Damma", "Kasra", "Sukun"],
        answer: "الضمة",
        explanationAr: "الفاعل مرفوع وعلامة رفعه الضمة الظاهرة أو المقدرة",
        explanationEn: "The doer is in nominative case marked by visible or estimated damma"
      }
    ]
  },

  // المفعول به
  "المفعول به": {
    examples: [
      {
        questionAr: "أعرب كلمة (الكتاب) في: قرأتُ الكتابَ",
        questionEn: "Parse (الكتاب) in: قرأتُ الكتابَ",
        solutionAr: "الكتابَ: مفعول به منصوب بالفتحة الظاهرة على آخره",
        solutionEn: "الكتابَ: Object in accusative case with visible fatha",
        stepsAr: [
          "الفعل: قرأتُ",
          "الفاعل: التاء المتحركة (أنا)",
          "المفعول به: الكتابَ (ما وقع عليه الفعل)",
          "الإعراب: مفعول به منصوب بالفتحة"
        ],
        stepsEn: [
          "Verb: قرأتُ",
          "Doer: The moving ta (I)",
          "Object: الكتابَ (what the action was done to)",
          "Parsing: Object in accusative with fatha"
        ]
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
        explanationAr: "المفعول به منصوب وعلامة نصبه الفتحة الظاهرة أو المقدرة",
        explanationEn: "The object is in accusative case marked by visible or estimated fatha"
      }
    ]
  },

  // الفيزياء - مقدمة في الفيزياء
  "مقدمة في الفيزياء": {
    examples: [
      {
        questionAr: "ما هي الكميات الفيزيائية الأساسية السبع؟",
        questionEn: "What are the seven fundamental physical quantities?",
        solutionAr: "الطول (متر)، الكتلة (كيلوجرام)، الزمن (ثانية)، التيار الكهربي (أمبير)، درجة الحرارة (كلفن)، كمية المادة (مول)، شدة الإضاءة (كانديلا)",
        solutionEn: "Length (meter), Mass (kilogram), Time (second), Electric current (ampere), Temperature (kelvin), Amount of substance (mole), Luminous intensity (candela)",
        stepsAr: [
          "الطول: وحدته المتر (m)",
          "الكتلة: وحدتها الكيلوجرام (kg)",
          "الزمن: وحدته الثانية (s)",
          "التيار الكهربي: وحدته الأمبير (A)",
          "درجة الحرارة: وحدتها الكلفن (K)",
          "كمية المادة: وحدتها المول (mol)",
          "شدة الإضاءة: وحدتها الكانديلا (cd)"
        ],
        stepsEn: [
          "Length: unit is meter (m)",
          "Mass: unit is kilogram (kg)",
          "Time: unit is second (s)",
          "Electric current: unit is ampere (A)",
          "Temperature: unit is kelvin (K)",
          "Amount of substance: unit is mole (mol)",
          "Luminous intensity: unit is candela (cd)"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما هي وحدة قياس الكتلة في النظام الدولي للوحدات؟",
        questionEn: "What is the SI unit for measuring mass?",
        optionsAr: ["النيوتن", "الكيلوجرام", "الجرام", "المتر"],
        optionsEn: ["Newton", "Kilogram", "Gram", "Meter"],
        answer: "الكيلوجرام",
        explanationAr: "الكيلوجرام (kg) هو وحدة قياس الكتلة الأساسية في النظام الدولي للوحدات",
        explanationEn: "Kilogram (kg) is the fundamental unit for measuring mass in the SI system"
      },
      {
        type: "multiple_choice",
        questionAr: "أي مما يلي كمية فيزيائية مشتقة؟",
        questionEn: "Which of the following is a derived physical quantity?",
        optionsAr: ["الكتلة", "الزمن", "السرعة", "درجة الحرارة"],
        optionsEn: ["Mass", "Time", "Velocity", "Temperature"],
        answer: "السرعة",
        explanationAr: "السرعة كمية مشتقة لأنها تساوي الإزاحة ÷ الزمن (m/s)",
        explanationEn: "Velocity is a derived quantity because it equals displacement ÷ time (m/s)"
      }
    ],
    formulas: [
      {
        formula: "v = d / t",
        explanationAr: "السرعة = الإزاحة ÷ الزمن",
        explanationEn: "Velocity = Displacement ÷ Time"
      },
      {
        formula: "a = Δv / Δt",
        explanationAr: "التسارع = التغير في السرعة ÷ الزمن",
        explanationEn: "Acceleration = Change in velocity ÷ Time"
      }
    ]
  },

  // القياس والوحدات
  "القياس والوحدات": {
    examples: [
      {
        questionAr: "حوّل 5 كم إلى متر",
        questionEn: "Convert 5 km to meters",
        solutionAr: "5 كم = 5 × 1000 = 5000 متر",
        solutionEn: "5 km = 5 × 1000 = 5000 meters",
        stepsAr: [
          "نستخدم العلاقة: 1 كم = 1000 متر",
          "5 كم = 5 × 1000 متر",
          "النتيجة: 5000 متر"
        ],
        stepsEn: [
          "Use the relation: 1 km = 1000 meters",
          "5 km = 5 × 1000 meters",
          "Result: 5000 meters"
        ]
      },
      {
        questionAr: "حوّل 36 كم/س إلى م/ث",
        questionEn: "Convert 36 km/h to m/s",
        solutionAr: "36 كم/س = 36 × (1000/3600) = 10 م/ث",
        solutionEn: "36 km/h = 36 × (1000/3600) = 10 m/s",
        stepsAr: [
          "نستخدم العلاقة: 1 كم/س = (1000 م)/(3600 ث) = 5/18 م/ث",
          "36 كم/س = 36 × (5/18) م/ث",
          "النتيجة: 10 م/ث"
        ],
        stepsEn: [
          "Use the relation: 1 km/h = (1000 m)/(3600 s) = 5/18 m/s",
          "36 km/h = 36 × (5/18) m/s",
          "Result: 10 m/s"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما هي وحدة قياس القوة في النظام الدولي؟",
        questionEn: "What is the SI unit for measuring force?",
        optionsAr: ["الكيلوجرام", "النيوتن", "الجول", "الواط"],
        optionsEn: ["Kilogram", "Newton", "Joule", "Watt"],
        answer: "النيوتن",
        explanationAr: "النيوتن (N) هو وحدة قياس القوة، ويساوي 1 كجم.م/ث²",
        explanationEn: "Newton (N) is the unit for measuring force, equal to 1 kg.m/s²"
      },
      {
        type: "multiple_choice",
        questionAr: "ما هي البادئة التي تعني 10⁻³؟",
        questionEn: "What prefix means 10⁻³?",
        optionsAr: ["كيلو", "سنتي", "مللي", "ميكرو"],
        optionsEn: ["Kilo", "Centi", "Milli", "Micro"],
        answer: "مللي",
        explanationAr: "المللي (m) تعني 10⁻³ أو جزء من ألف",
        explanationEn: "Milli (m) means 10⁻³ or one thousandth"
      }
    ],
    formulas: [
      {
        formula: "1 km = 10³ m",
        explanationAr: "الكيلومتر يساوي 1000 متر",
        explanationEn: "One kilometer equals 1000 meters"
      },
      {
        formula: "1 cm = 10⁻² m",
        explanationAr: "السنتيمتر يساوي 0.01 متر",
        explanationEn: "One centimeter equals 0.01 meters"
      }
    ]
  },

  // الحركة المستقيمة
  "الحركة المستقيمة": {
    examples: [
      {
        questionAr: "سيارة تتحرك بسرعة 20 م/ث، ما الإزاحة خلال 30 ثانية؟",
        questionEn: "A car moves at 20 m/s, what is the displacement in 30 seconds?",
        solutionAr: "الإزاحة = السرعة × الزمن = 20 × 30 = 600 متر",
        solutionEn: "Displacement = Velocity × Time = 20 × 30 = 600 meters",
        stepsAr: [
          "السرعة = 20 م/ث",
          "الزمن = 30 ث",
          "الإزاحة = v × t = 20 × 30 = 600 م"
        ],
        stepsEn: [
          "Velocity = 20 m/s",
          "Time = 30 s",
          "Displacement = v × t = 20 × 30 = 600 m"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما الفرق بين المسافة والإزاحة؟",
        questionEn: "What is the difference between distance and displacement?",
        optionsAr: ["لا فرق بينهما", "المسافة كمية متجهة والإزاحة كمية قياسية", "الإزاحة كمية متجهة والمسافة كمية قياسية", "المسافة دائماً أكبر من الإزاحة"],
        optionsEn: ["No difference", "Distance is vector, displacement is scalar", "Displacement is vector, distance is scalar", "Distance is always greater than displacement"],
        answer: "الإزاحة كمية متجهة والمسافة كمية قياسية",
        explanationAr: "الإزاحة كمية متجهة لها مقدار واتجاه، أما المسافة فكمية قياسية لها مقدار فقط",
        explanationEn: "Displacement is a vector quantity with magnitude and direction, while distance is a scalar quantity with magnitude only"
      }
    ],
    formulas: [
      {
        formula: "v = Δx / Δt",
        explanationAr: "السرعة = التغير في الإزاحة ÷ الزمن",
        explanationEn: "Velocity = Change in displacement ÷ Time"
      },
      {
        formula: "a = (v - v₀) / t",
        explanationAr: "التسارع = (السرعة النهائية - السرعة الابتدائية) ÷ الزمن",
        explanationEn: "Acceleration = (Final velocity - Initial velocity) ÷ Time"
      }
    ]
  },

  // الكيمياء - مقدمة في الكيمياء
  "مقدمة في الكيمياء": {
    examples: [
      {
        questionAr: "ما عدد البروتونات والنيوترونات والإلكترونات في ذرة الكربون (العدد الذري = 6، العدد الكتلي = 12)؟",
        questionEn: "What are the number of protons, neutrons, and electrons in a carbon atom (atomic number = 6, mass number = 12)?",
        solutionAr: "البروتونات = 6، الإلكترونات = 6، النيوترونات = 12 - 6 = 6",
        solutionEn: "Protons = 6, Electrons = 6, Neutrons = 12 - 6 = 6",
        stepsAr: [
          "العدد الذري = عدد البروتونات = 6",
          "في الذرة المتعادلة: عدد الإلكترونات = عدد البروتونات = 6",
          "العدد الكتلي = عدد البروتونات + عدد النيوترونات",
          "عدد النيوترونات = 12 - 6 = 6"
        ],
        stepsEn: [
          "Atomic number = number of protons = 6",
          "In neutral atom: electrons = protons = 6",
          "Mass number = protons + neutrons",
          "Neutrons = 12 - 6 = 6"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما هو العدد الكتلي للذرة؟",
        questionEn: "What is the mass number of an atom?",
        optionsAr: ["عدد الإلكترونات فقط", "عدد البروتونات فقط", "عدد البروتونات + النيوترونات", "عدد النيوترونات فقط"],
        optionsEn: ["Electrons only", "Protons only", "Protons + Neutrons", "Neutrons only"],
        answer: "عدد البروتونات + النيوترونات",
        explanationAr: "العدد الكتلي = عدد البروتونات + عدد النيوترونات في النواة",
        explanationEn: "Mass number = number of protons + number of neutrons in the nucleus"
      },
      {
        type: "multiple_choice",
        questionAr: "أين توجد الإلكترونات في الذرة؟",
        questionEn: "Where are electrons located in an atom?",
        optionsAr: ["في النواة", "حول النواة في مستويات الطاقة", "في البروتونات", "في النيوترونات"],
        optionsEn: ["In the nucleus", "Around the nucleus in energy levels", "In protons", "In neutrons"],
        answer: "حول النواة في مستويات الطاقة",
        explanationAr: "الإلكترونات تدور حول النواة في مستويات طاقة محددة",
        explanationEn: "Electrons orbit around the nucleus in specific energy levels"
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

  // الرياضيات - الأعداد الحقيقية
  "الأعداد الحقيقية": {
    examples: [
      {
        questionAr: "أوجد قيمة: |−5| + |3|",
        questionEn: "Find the value of: |−5| + |3|",
        solutionAr: "|−5| + |3| = 5 + 3 = 8",
        solutionEn: "|−5| + |3| = 5 + 3 = 8",
        stepsAr: [
          "القيمة المطلقة لـ −5 هي 5",
          "القيمة المطلقة لـ 3 هي 3",
          "المجموع = 5 + 3 = 8"
        ],
        stepsEn: [
          "Absolute value of −5 is 5",
          "Absolute value of 3 is 3",
          "Sum = 5 + 3 = 8"
        ]
      },
      {
        questionAr: "بسّط: √18",
        questionEn: "Simplify: √18",
        solutionAr: "√18 = √(9 × 2) = √9 × √2 = 3√2",
        solutionEn: "√18 = √(9 × 2) = √9 × √2 = 3√2",
        stepsAr: [
          "نحلل 18 = 9 × 2",
          "√18 = √(9 × 2) = √9 × √2",
          "√9 = 3",
          "النتيجة: 3√2"
        ],
        stepsEn: [
          "Factor 18 = 9 × 2",
          "√18 = √(9 × 2) = √9 × √2",
          "√9 = 3",
          "Result: 3√2"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما القيمة المطلقة لـ −7؟",
        questionEn: "What is the absolute value of −7?",
        optionsAr: ["−7", "7", "0", "14"],
        optionsEn: ["−7", "7", "0", "14"],
        answer: "7",
        explanationAr: "القيمة المطلقة هي البعد عن الصفر، وهي دائماً موجبة",
        explanationEn: "Absolute value is the distance from zero, always positive"
      },
      {
        type: "multiple_choice",
        questionAr: "√16 = ؟",
        questionEn: "√16 = ?",
        optionsAr: ["2", "4", "8", "16"],
        optionsEn: ["2", "4", "8", "16"],
        answer: "4",
        explanationAr: "الجذر التربيعي لـ 16 هو 4 لأن 4² = 16",
        explanationEn: "The square root of 16 is 4 because 4² = 16"
      }
    ]
  },

  // الجذور وخصائصها
  "الجذور وخصائصها": {
    examples: [
      {
        questionAr: "بسّط: √12 × √3",
        questionEn: "Simplify: √12 × √3",
        solutionAr: "√12 × √3 = √(12 × 3) = √36 = 6",
        solutionEn: "√12 × √3 = √(12 × 3) = √36 = 6",
        stepsAr: [
          "نستخدم خاصية: √a × √b = √(a×b)",
          "√12 × √3 = √36",
          "√36 = 6"
        ],
        stepsEn: [
          "Use property: √a × √b = √(a×b)",
          "√12 × √3 = √36",
          "√36 = 6"
        ]
      }
    ],
    questions: [
      {
        type: "multiple_choice",
        questionAr: "ما ناتج √8 × √2؟",
        questionEn: "What is √8 × √2?",
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
        explanationAr: "حاصل ضرب جذرين = جذر حاصل الضرب",
        explanationEn: "Product of square roots = Square root of the product"
      },
      {
        formula: "√a ÷ √b = √(a/b)",
        explanationAr: "قسمة جذرين = جذر القسمة",
        explanationEn: "Division of square roots = Square root of the division"
      }
    ]
  }
};

async function seedContent() {
  console.log("📚 بدء إضافة المحتوى التعليمي...\n");

  // الحصول على جميع الدروس
  const lessons = await prisma.lesson.findMany({
    include: {
      examples: true,
      questions: true,
      formulas: true
    }
  });

  console.log(`عدد الدروس الكلي: ${lessons.length}\n`);

  let examplesAdded = 0;
  let questionsAdded = 0;
  let formulasAdded = 0;

  for (const lesson of lessons) {
    const content = contentData[lesson.titleAr];

    if (content) {
      // إضافة الأمثلة
      if (content.examples && content.examples.length > 0) {
        for (let i = 0; i < content.examples.length; i++) {
          const example = content.examples[i];
          await prisma.example.create({
            data: {
              lessonId: lesson.id,
              questionAr: example.questionAr,
              questionEn: example.questionEn,
              solutionAr: example.solutionAr,
              solutionEn: example.solutionEn,
              stepsAr: JSON.stringify(example.stepsAr),
              stepsEn: JSON.stringify(example.stepsEn),
              order: i + 1
            }
          });
          examplesAdded++;
        }
      }

      // إضافة الأسئلة
      if (content.questions && content.questions.length > 0) {
        for (let i = 0; i < content.questions.length; i++) {
          const question = content.questions[i];
          await prisma.question.create({
            data: {
              lessonId: lesson.id,
              type: question.type,
              questionAr: question.questionAr,
              questionEn: question.questionEn,
              optionsAr: JSON.stringify(question.optionsAr),
              optionsEn: JSON.stringify(question.optionsEn),
              answer: question.answer,
              explanationAr: question.explanationAr,
              explanationEn: question.explanationEn,
              points: 1,
              difficulty: "medium",
              order: i + 1
            }
          });
          questionsAdded++;
        }
      }

      // إضافة القوانين
      if (content.formulas && content.formulas.length > 0) {
        for (let i = 0; i < content.formulas.length; i++) {
          const formula = content.formulas[i];
          await prisma.formula.create({
            data: {
              lessonId: lesson.id,
              formula: formula.formula,
              explanationAr: formula.explanationAr,
              explanationEn: formula.explanationEn,
              order: i + 1
            }
          });
          formulasAdded++;
        }
      }

      console.log(`✅ تم إضافة محتوى لـ: ${lesson.titleAr}`);
    }
  }

  console.log(`\n📊 ملخص الإضافة:`);
  console.log(`   الأمثلة المضافة: ${examplesAdded}`);
  console.log(`   الأسئلة المضافة: ${questionsAdded}`);
  console.log(`   القوانين المضافة: ${formulasAdded}`);

  await prisma.$disconnect();
  console.log("\n✨ تم الانتهاء!");
}

seedContent().catch(console.error);
