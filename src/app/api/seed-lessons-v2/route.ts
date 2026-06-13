import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ==================== دروس الصف الثالث الثانوي ====================

// دروس الفيزياء - الميكانيكا
const physicsMechanicsLessons = [
  {
    titleAr: "الحركة المستقيمة المنتظمة",
    titleEn: "Uniform Linear Motion",
    slug: "uniform-linear-motion",
    descriptionAr: "دراسة الحركة في خط مستقيم بسرعة ثابتة والعلاقة بين المسافة والزمن",
    descriptionEn: "Study of motion in a straight line with constant velocity",
    duration: 45,
    order: 1,
    isFree: true,
    introductionAr: "الحركة المستقيمة المنتظمة هي أبسط أنواع الحركة، حيث يتحرك الجسم في خط مستقيم بسرعة ثابتة. في هذا الدرس سنتعلم كيف نصف هذه الحركة رياضياً ونحسب المسافة والزمن.",
    introductionEn: "Uniform linear motion is the simplest type of motion, where an object moves in a straight line at constant velocity.",
    summaryAr: "الخلاصة: الحركة المستقيمة المنتظمة تتميز بسرعة ثابتة ومسار مستقيم. المعادلة الأساسية: المسافة = السرعة × الزمن",
    summaryEn: "Summary: Uniform linear motion is characterized by constant velocity and straight path. Basic equation: Distance = Velocity × Time",
    objectives: {
      ar: ["فهم مفهوم الحركة المستقيمة المنتظمة", "حساب السرعة المتوسطة", "تطبيق معادلة المسافة", "تحليل الرسوم البيانية للحركة"],
      en: ["Understand uniform linear motion", "Calculate average velocity", "Apply distance equation", "Analyze motion graphs"]
    },
    concepts: {
      ar: [
        { term: "السرعة", definition: "المسافة المقطوعة في وحدة الزمن" },
        { term: "الإزاحة", definition: "أقرب مسافة بين نقطة البداية ونقطة النهاية" },
        { term: "المسافة", definition: "طول المسار الفعلي الذي يسلكه الجسم" }
      ],
      en: [
        { term: "Velocity", definition: "Distance traveled per unit time" },
        { term: "Displacement", definition: "Shortest distance between start and end points" },
        { term: "Distance", definition: "Actual path length traveled by the object" }
      ]
    },
    formulas: {
      ar: [
        { formula: "ع = ف / ز", explanation: "السرعة = المسافة / الزمن" },
        { formula: "ف = ع × ز", explanation: "المسافة = السرعة × الزمن" },
        { formula: "ز = ف / ع", explanation: "الزمن = المسافة / السرعة" }
      ],
      en: [
        { formula: "v = d / t", explanation: "Velocity = Distance / Time" },
        { formula: "d = v × t", explanation: "Distance = Velocity × Time" },
        { formula: "t = d / v", explanation: "Time = Distance / Velocity" }
      ]
    },
    examples: {
      ar: [
        {
          question: "سيارة تسير بسرعة 72 كم/ساعة. احسب المسافة التي تقطعها في ساعتين.",
          solution: "المسافة = السرعة × الزمن = 72 × 2 = 144 كم",
          steps: ["نستخدم المعادلة: ف = ع × ز", "نعوض القيم: ف = 72 × 2", "النتيجة: ف = 144 كم"]
        }
      ],
      en: [
        {
          question: "A car travels at 72 km/h. Calculate the distance it covers in 2 hours.",
          solution: "Distance = Velocity × Time = 72 × 2 = 144 km",
          steps: ["Use equation: d = v × t", "Substitute: d = 72 × 2", "Result: d = 144 km"]
        }
      ]
    },
    simulators: ["linear-motion"],
    questions: [
      { type: "mcq", questionAr: "ما وحدة قياس السرعة في النظام الدولي؟", questionEn: "What is the SI unit of velocity?", optionsAr: ["م/ث", "كم/س", "م", "ثانية"], optionsEn: ["m/s", "km/h", "m", "s"], answer: "م/ث", points: 1 },
      { type: "mcq", questionAr: "إذا قطعت سيارة 100 متر في 20 ثانية، فما سرعتها؟", questionEn: "If a car covers 100 meters in 20 seconds, what is its velocity?", optionsAr: ["5 م/ث", "10 م/ث", "2 م/ث", "20 م/ث"], optionsEn: ["5 m/s", "10 m/s", "2 m/s", "20 m/s"], answer: "5 م/ث", points: 1 }
    ]
  },
  {
    titleAr: "الحركة المتغيرة والتسارع",
    titleEn: "Variable Motion and Acceleration",
    slug: "variable-motion-acceleration",
    descriptionAr: "دراسة الحركة المتسارعة والعلاقة بين السرعة والتسارع والزمن",
    descriptionEn: "Study of accelerated motion and the relationship between velocity, acceleration, and time",
    duration: 50,
    order: 2,
    isFree: false,
    introductionAr: "التسارع هو التغير في السرعة خلال وحدة الزمن. عندما تتغير سرعة الجسم سواء بالزيادة أو النقصان، نقول أن الحركة متغيرة أو متسارعة.",
    introductionEn: "Acceleration is the change in velocity per unit time. When an object's velocity changes, we say the motion is variable or accelerated.",
    summaryAr: "التسارع = التغير في السرعة / الزمن. يمكن أن يكون التسارع موجباً (زيادة السرعة) أو سالباً (نقصان السرعة).",
    summaryEn: "Acceleration = Change in velocity / Time. Acceleration can be positive (speeding up) or negative (slowing down).",
    objectives: {
      ar: ["فهم مفهوم التسارع", "حساب التسارع من السرعات", "التفريق بين التسارع الموجب والسالب"],
      en: ["Understand acceleration concept", "Calculate acceleration from velocities", "Distinguish between positive and negative acceleration"]
    },
    concepts: {
      ar: [
        { term: "التسارع", definition: "معدل التغير في السرعة بالنسبة للزمن" },
        { term: "التسارع الموجب", definition: "زيادة سرعة الجسم مع الزمن" },
        { term: "التسارع السالب", definition: "نقصان سرعة الجسم مع الزمن" }
      ],
      en: [
        { term: "Acceleration", definition: "Rate of change of velocity with respect to time" },
        { term: "Positive Acceleration", definition: "Increase in object's speed over time" },
        { term: "Negative Acceleration", definition: "Decrease in object's speed over time" }
      ]
    },
    formulas: {
      ar: [
        { formula: "ت = (س₂ - س₁) / ز", explanation: "التسارع = (السرعة النهائية - السرعة الابتدائية) / الزمن" }
      ],
      en: [
        { formula: "a = (v₂ - v₁) / t", explanation: "Acceleration = (Final velocity - Initial velocity) / Time" }
      ]
    },
    examples: {
      ar: [
        {
          question: "سيارة تتحرك بسرعة 10 م/ث ثم زادت سرعتها إلى 30 م/ث خلال 5 ثواني. احسب التسارع.",
          solution: "ت = (30 - 10) / 5 = 20 / 5 = 4 م/ث²",
          steps: ["نحسب التغير في السرعة: Δس = 30 - 10 = 20 م/ث", "نقسم على الزمن: ت = 20 / 5", "النتيجة: ت = 4 م/ث²"]
        }
      ],
      en: [
        {
          question: "A car moving at 10 m/s increases its speed to 30 m/s in 5 seconds. Calculate the acceleration.",
          solution: "a = (30 - 10) / 5 = 20 / 5 = 4 m/s²",
          steps: ["Calculate velocity change: Δv = 30 - 10 = 20 m/s", "Divide by time: a = 20 / 5", "Result: a = 4 m/s²"]
        }
      ]
    },
    simulators: ["linear-motion"],
    questions: [
      { type: "mcq", questionAr: "ما وحدة قياس التسارع؟", questionEn: "What is the unit of acceleration?", optionsAr: ["م/ث²", "م/ث", "م²/ث", "ث/م"], optionsEn: ["m/s²", "m/s", "m²/s", "s/m"], answer: "م/ث²", points: 1 }
    ]
  },
  {
    titleAr: "معادلات الحركة",
    titleEn: "Equations of Motion",
    slug: "equations-of-motion",
    descriptionAr: "المعادلات الأساسية لحساب السرعة والإزاحة والتسارع",
    descriptionEn: "Fundamental equations for calculating velocity, displacement, and acceleration",
    duration: 55,
    order: 3,
    isFree: false,
    introductionAr: "معادلات الحركة هي ثلاث معادلات أساسية تربط بين السرعة والتسارع والإزاحة والزمن. هذه المعادلات هي حجر الأساس في دراسة الميكانيكا.",
    introductionEn: "Equations of motion are three fundamental equations that relate velocity, acceleration, displacement, and time. These equations are the cornerstone of mechanics.",
    summaryAr: "المعادلات الثلاث: 1) س = س₀ + تز  2) ف = س₀ز + ½تز²  3) س² = س₀² + 2تف",
    summaryEn: "Three equations: 1) v = v₀ + at  2) d = v₀t + ½at²  3) v² = v₀² + 2ad",
    objectives: {
      ar: ["حفظ المعادلات الثلاث", "تطبيق كل معادلة في الموقف المناسب", "حل مسائل الحركة المتسارعة"],
      en: ["Memorize the three equations", "Apply each equation in appropriate situations", "Solve accelerated motion problems"]
    },
    concepts: {
      ar: [
        { term: "السرعة الابتدائية", definition: "سرعة الجسم عند بداية الحركة" },
        { term: "السرعة النهائية", definition: "سرعة الجسم عند نهاية الحركة" }
      ],
      en: [
        { term: "Initial Velocity", definition: "Velocity of object at the start of motion" },
        { term: "Final Velocity", definition: "Velocity of object at the end of motion" }
      ]
    },
    formulas: {
      ar: [
        { formula: "س = س₀ + تز", explanation: "السرعة النهائية = السرعة الابتدائية + التسارع × الزمن" },
        { formula: "ف = س₀ز + ½تز²", explanation: "الإزاحة = السرعة الابتدائية × الزمن + نصف التسارع × الزمن²" },
        { formula: "س² = س₀² + 2تف", explanation: "مربع السرعة النهائية = مربع السرعة الابتدائية + 2 × التسارع × الإزاحة" }
      ],
      en: [
        { formula: "v = v₀ + at", explanation: "Final velocity = Initial velocity + Acceleration × Time" },
        { formula: "d = v₀t + ½at²", explanation: "Displacement = Initial velocity × Time + Half acceleration × Time²" },
        { formula: "v² = v₀² + 2ad", explanation: "Final velocity² = Initial velocity² + 2 × Acceleration × Displacement" }
      ]
    },
    examples: {
      ar: [
        {
          question: "سيارة تبدأ من السكون وتتحرك بتسارع 2 م/ث² لمدة 10 ثواني. احسب سرعتها النهائية والإزاحة.",
          solution: "س = 0 + 2×10 = 20 م/ث، ف = 0 + ½×2×100 = 100 م",
          steps: ["السرعة النهائية: س = س₀ + تز = 0 + 2×10 = 20 م/ث", "الإزاحة: ف = ½×ت×ز² = ½×2×100 = 100 م"]
        }
      ],
      en: [
        {
          question: "A car starts from rest and accelerates at 2 m/s² for 10 seconds. Calculate its final velocity and displacement.",
          solution: "v = 0 + 2×10 = 20 m/s, d = 0 + ½×2×100 = 100 m",
          steps: ["Final velocity: v = v₀ + at = 0 + 2×10 = 20 m/s", "Displacement: d = ½×a×t² = ½×2×100 = 100 m"]
        }
      ]
    },
    simulators: ["linear-motion", "free-fall"],
    questions: [
      { type: "mcq", questionAr: "أي معادلة تستخدم عندما لا نعرف الزمن؟", questionEn: "Which equation is used when time is unknown?", optionsAr: ["س = س₀ + تز", "ف = س₀ز + ½تز²", "س² = س₀² + 2تف", "ع = ف/ز"], optionsEn: ["v = v₀ + at", "d = v₀t + ½at²", "v² = v₀² + 2ad", "v = d/t"], answer: "س² = س₀² + 2تف", points: 1 }
    ]
  },
  {
    titleAr: "السقوط الحر",
    titleEn: "Free Fall",
    slug: "free-fall-physics",
    descriptionAr: "دراسة حركة الأجسام تحت تأثير الجاذبية فقط",
    descriptionEn: "Study of motion of objects under the influence of gravity only",
    duration: 45,
    order: 4,
    isFree: true,
    introductionAr: "السقوط الحر هو حركة جسم تحت تأثير الجاذبية فقط، بدون أي قوى أخرى. جميع الأجسام تسقط بنفس التسارع في غياب مقاومة الهواء.",
    introductionEn: "Free fall is the motion of an object under the influence of gravity only, without any other forces. All objects fall with the same acceleration in the absence of air resistance.",
    summaryAr: "تسارع السقوط الحر = 9.8 م/ث². معادلات السقوط الحر مشابهة لمعادلات الحركة المتسارعة.",
    summaryEn: "Free fall acceleration = 9.8 m/s². Free fall equations are similar to accelerated motion equations.",
    objectives: {
      ar: ["فهم مفهوم السقوط الحر", "حفظ قيمة تسارع الجاذبية", "تطبيق معادلات الحركة على السقوط الحر"],
      en: ["Understand free fall concept", "Memorize gravitational acceleration value", "Apply motion equations to free fall"]
    },
    concepts: {
      ar: [
        { term: "تسارع الجاذبية", definition: "التسارع الناتج عن الجاذبية الأرضية ويساوي 9.8 م/ث²" },
        { term: "السقوط الحر", definition: "حركة جسم تحت تأثير الجاذبية فقط" }
      ],
      en: [
        { term: "Gravitational Acceleration", definition: "Acceleration due to Earth's gravity, equals 9.8 m/s²" },
        { term: "Free Fall", definition: "Motion of an object under gravity only" }
      ]
    },
    formulas: {
      ar: [
        { formula: "س = جز", explanation: "السرعة النهائية = تسارع الجاذبية × الزمن" },
        { formula: "ع = ½جز²", explanation: "الارتفاع = نصف × تسارع الجاذبية × الزمن²" }
      ],
      en: [
        { formula: "v = gt", explanation: "Final velocity = Gravitational acceleration × Time" },
        { formula: "h = ½gt²", explanation: "Height = Half × Gravitational acceleration × Time²" }
      ]
    },
    examples: {
      ar: [
        {
          question: "سقطت كرة من ارتفاع 45 متر. احسب زمن السقوط والسرعة عند الاصطدام بالأرض.",
          solution: "ز = √(2×45/9.8) ≈ 3 ثواني، س = 9.8×3 ≈ 29.4 م/ث",
          steps: ["من معادلة ع = ½جز²: 45 = ½×9.8×ز²", "ز² = 45/4.9 ≈ 9", "ز ≈ 3 ثواني", "س = جز = 9.8×3 ≈ 29.4 م/ث"]
        }
      ],
      en: [
        {
          question: "A ball falls from a height of 45 meters. Calculate the fall time and velocity upon impact.",
          solution: "t = √(2×45/9.8) ≈ 3 seconds, v = 9.8×3 ≈ 29.4 m/s",
          steps: ["From h = ½gt²: 45 = ½×9.8×t²", "t² = 45/4.9 ≈ 9", "t ≈ 3 seconds", "v = gt = 9.8×3 ≈ 29.4 m/s"]
        }
      ]
    },
    simulators: ["free-fall"],
    questions: [
      { type: "mcq", questionAr: "ما قيمة تسارع الجاذبية الأرضية؟", questionEn: "What is the value of Earth's gravitational acceleration?", optionsAr: ["9.8 م/ث²", "10 م/ث²", "8.9 م/ث²", "9 م/ث²"], optionsEn: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9 m/s²"], answer: "9.8 م/ث²", points: 1 }
    ]
  }
];

// دروس الكيمياء - بنية الذرة
const chemistryAtomicLessons = [
  {
    titleAr: "تركيب الذرة",
    titleEn: "Atomic Structure",
    slug: "atomic-structure-chemistry",
    descriptionAr: "دراسة مكونات الذرة الأساسية: البروتونات والنيوترونات والإلكترونات",
    descriptionEn: "Study of atomic components: protons, neutrons, and electrons",
    duration: 50,
    order: 1,
    isFree: true,
    introductionAr: "الذرة هي وحدة البناء الأساسية للمادة. تتكون من نواة مركزية تحتوي على بروتونات موجبة ونيوترونات متعادلة، وتدور حولها إلكترونات سالبة في مستويات الطاقة.",
    introductionEn: "The atom is the basic building block of matter. It consists of a central nucleus containing positive protons and neutral neutrons, with negative electrons orbiting in energy levels.",
    summaryAr: "الذرة = نواة (بروتونات + نيوترونات) + إلكترونات. عدد البروتونات = العدد الذري.",
    summaryEn: "Atom = Nucleus (protons + neutrons) + Electrons. Number of protons = Atomic number.",
    objectives: {
      ar: ["التعرف على مكونات الذرة", "فهم العلاقة بين العدد الذري وعدد البروتونات", "حساب عدد النيوترونات"],
      en: ["Identify atomic components", "Understand relationship between atomic number and protons", "Calculate number of neutrons"]
    },
    concepts: {
      ar: [
        { term: "البروتون", definition: "جسيم موجب الشحنة موجود في النواة" },
        { term: "النيوترون", definition: "جسيم متعادل الشحنة موجود في النواة" },
        { term: "الإلكترون", definition: "جسيم سالب الشحنة يدور حول النواة" },
        { term: "العدد الذري", definition: "عدد البروتونات في نواة الذرة" },
        { term: "العدد الكتلي", definition: "مجموع عدد البروتونات والنيوترونات" }
      ],
      en: [
        { term: "Proton", definition: "Positively charged particle in the nucleus" },
        { term: "Neutron", definition: "Neutral particle in the nucleus" },
        { term: "Electron", definition: "Negatively charged particle orbiting the nucleus" },
        { term: "Atomic Number", definition: "Number of protons in the nucleus" },
        { term: "Mass Number", definition: "Sum of protons and neutrons" }
      ]
    },
    formulas: {
      ar: [
        { formula: "عدد النيوترونات = العدد الكتلي - العدد الذري", explanation: "حساب عدد النيوترونات من العدد الكتلي والذري" }
      ],
      en: [
        { formula: "Neutrons = Mass Number - Atomic Number", explanation: "Calculate neutrons from mass and atomic numbers" }
      ]
    },
    examples: {
      ar: [
        {
          question: "ذرة كربون عددها الذري 6 وعددها الكتلي 12. احسب عدد النيوترونات.",
          solution: "عدد النيوترونات = 12 - 6 = 6 نيوترونات",
          steps: ["العدد الكتلي = 12", "العدد الذري = 6", "عدد النيوترونات = 12 - 6 = 6"]
        }
      ],
      en: [
        {
          question: "A carbon atom has atomic number 6 and mass number 12. Calculate the number of neutrons.",
          solution: "Neutrons = 12 - 6 = 6 neutrons",
          steps: ["Mass number = 12", "Atomic number = 6", "Neutrons = 12 - 6 = 6"]
        }
      ]
    },
    simulators: ["atomic-structure", "periodic-table"],
    questions: [
      { type: "mcq", questionAr: "أين توجد البروتونات في الذرة؟", questionEn: "Where are protons located in the atom?", optionsAr: ["في النواة", "حول النواة", "في المستويات", "خارج الذرة"], optionsEn: ["In the nucleus", "Around the nucleus", "In energy levels", "Outside the atom"], answer: "في النواة", points: 1 },
      { type: "mcq", questionAr: "ما شحنة الإلكترون؟", questionEn: "What is the charge of an electron?", optionsAr: ["موجبة", "سالبة", "متعادلة", "لا شحنة لها"], optionsEn: ["Positive", "Negative", "Neutral", "No charge"], answer: "سالبة", points: 1 }
    ]
  },
  {
    titleAr: "التوزيع الإلكتروني",
    titleEn: "Electron Configuration",
    slug: "electron-configuration",
    descriptionAr: "كيفية توزيع الإلكترونات في مستويات الطاقة",
    descriptionEn: "How electrons are distributed in energy levels",
    duration: 45,
    order: 2,
    isFree: false,
    introductionAr: "التوزيع الإلكتروني هو ترتيب الإلكترونات في مستويات الطاقة حول النواة. يتبع هذا التوزيع قواعد محددة تحدد سعة كل مستوى.",
    introductionEn: "Electron configuration is the arrangement of electrons in energy levels around the nucleus. This arrangement follows specific rules that determine the capacity of each level.",
    summaryAr: "قاعدة 2ن² تحدد سعة كل مستوى طاقة. المستوى الأول = 2، الثاني = 8، الثالث = 18 إلكترون.",
    summaryEn: "The 2n² rule determines each energy level capacity. First level = 2, Second = 8, Third = 18 electrons.",
    objectives: {
      ar: ["فهم مستويات الطاقة", "تطبيق قاعدة 2ن²", "كتابة التوزيع الإلكتروني للعناصر"],
      en: ["Understand energy levels", "Apply 2n² rule", "Write electron configurations for elements"]
    },
    concepts: {
      ar: [
        { term: "مستوى الطاقة", definition: "مدار حول النواة يسلكه الإلكترون" },
        { term: "قاعدة 2ن²", definition: "سعة المستوى ن = 2×ن²" }
      ],
      en: [
        { term: "Energy Level", definition: "Orbit around the nucleus where electrons move" },
        { term: "2n² Rule", definition: "Capacity of level n = 2×n²" }
      ]
    },
    formulas: {
      ar: [
        { formula: "سعة المستوى = 2ن²", explanation: "حيث ن هو رقم المستوى" }
      ],
      en: [
        { formula: "Level Capacity = 2n²", explanation: "Where n is the level number" }
      ]
    },
    examples: {
      ar: [
        {
          question: "اكتب التوزيع الإلكتروني لذرة الصوديوم (Na) عددها الذري 11.",
          solution: "2, 8, 1",
          steps: ["المستوى الأول: 2 إلكترون", "المستوى الثاني: 8 إلكترونات", "المستوى الثالث: 1 إلكترون", "المجموع: 2+8+1 = 11"]
        }
      ],
      en: [
        {
          question: "Write the electron configuration for sodium (Na) with atomic number 11.",
          solution: "2, 8, 1",
          steps: ["First level: 2 electrons", "Second level: 8 electrons", "Third level: 1 electron", "Total: 2+8+1 = 11"]
        }
      ]
    },
    simulators: ["atomic-structure", "periodic-table"],
    questions: [
      { type: "mcq", questionAr: "ما سعة المستوى الأول من الطاقة؟", questionEn: "What is the capacity of the first energy level?", optionsAr: ["2 إلكترون", "8 إلكترونات", "18 إلكترون", "32 إلكترون"], optionsEn: ["2 electrons", "8 electrons", "18 electrons", "32 electrons"], answer: "2 إلكترون", points: 1 }
    ]
  }
];

// دروس الرياضيات - التفاضل
const mathDifferentiationLessons = [
  {
    titleAr: "مفهوم المشتقة",
    titleEn: "Concept of Derivative",
    slug: "derivative-concept",
    descriptionAr: "مقدمة في حساب التفاضل ومفهوم المشتقة",
    descriptionEn: "Introduction to calculus and the concept of derivative",
    duration: 50,
    order: 1,
    isFree: true,
    introductionAr: "المشتقة هي أداة رياضية تقيس معدل التغير اللحظي للدالة. تُستخدم في العديد من التطبيقات في الفيزياء والهندسة والاقتصاد.",
    introductionEn: "The derivative is a mathematical tool that measures the instantaneous rate of change of a function. It's used in many applications in physics, engineering, and economics.",
    summaryAr: "المشتقة = معدل التغير اللحظي = ميل المماس للمنحنى عند نقطة معينة.",
    summaryEn: "Derivative = Instantaneous rate of change = Slope of the tangent to the curve at a specific point.",
    objectives: {
      ar: ["فهم مفهوم المشتقة هندسياً", "حساب مشتقة الدوال البسيطة", "تطبيق قواعد التفاضل الأساسية"],
      en: ["Understand derivative concept geometrically", "Calculate derivatives of simple functions", "Apply basic differentiation rules"]
    },
    concepts: {
      ar: [
        { term: "المشتقة", definition: "معدل التغير اللحظي للدالة" },
        { term: "ميل المماس", definition: "ميل المستقيم المماس للمنحنى عند نقطة" },
        { term: "التفاضل", definition: "عملية إيجاد المشتقة" }
      ],
      en: [
        { term: "Derivative", definition: "Instantaneous rate of change of a function" },
        { term: "Slope of Tangent", definition: "Slope of the line tangent to the curve at a point" },
        { term: "Differentiation", definition: "Process of finding the derivative" }
      ]
    },
    formulas: {
      ar: [
        { formula: "(سⁿ)′ = ن سⁿ⁻¹", explanation: "مشتقة دالة أسية" },
        { formula: "(ثابت)′ = 0", explanation: "مشتقة الثابت = صفر" }
      ],
      en: [
        { formula: "(xⁿ)′ = nxⁿ⁻¹", explanation: "Derivative of power function" },
        { formula: "(constant)′ = 0", explanation: "Derivative of constant = zero" }
      ]
    },
    examples: {
      ar: [
        {
          question: "أوجد مشتقة الدالة د(س) = س³ + 2س² - 5س + 7",
          solution: "د′(س) = 3س² + 4س - 5",
          steps: ["مشتقة س³ = 3س²", "مشتقة 2س² = 4س", "مشتقة -5س = -5", "مشتقة 7 = 0", "النتيجة: 3س² + 4س - 5"]
        }
      ],
      en: [
        {
          question: "Find the derivative of f(x) = x³ + 2x² - 5x + 7",
          solution: "f′(x) = 3x² + 4x - 5",
          steps: ["Derivative of x³ = 3x²", "Derivative of 2x² = 4x", "Derivative of -5x = -5", "Derivative of 7 = 0", "Result: 3x² + 4x - 5"]
        }
      ]
    },
    simulators: ["differentiation", "functions"],
    questions: [
      { type: "mcq", questionAr: "ما مشتقة د(س) = س²؟", questionEn: "What is the derivative of f(x) = x²?", optionsAr: ["2س", "س", "2", "س²"], optionsEn: ["2x", "x", "2", "x²"], answer: "2س", points: 1 }
    ]
  },
  {
    titleAr: "قواعد التفاضل",
    titleEn: "Differentiation Rules",
    slug: "differentiation-rules",
    descriptionAr: "قواعد جمع وضرب وقسمة الدوال",
    descriptionEn: "Rules for sum, product, and quotient of functions",
    duration: 55,
    order: 2,
    isFree: false,
    introductionAr: "توجد قواعد محددة للتفاضل تسهل حساب مشتقة الدوال المركبة. أهم هذه القواعد: قاعدة الجمع، قاعدة الضرب، وقاعدة القسمة.",
    introductionEn: "There are specific rules for differentiation that facilitate calculating derivatives of composite functions. The most important: sum rule, product rule, and quotient rule.",
    summaryAr: "قاعدة الجمع: (أ+ب)′ = أ′ + ب′. قاعدة الضرب: (أ×ب)′ = أ′ب + أب′. قاعدة القسمة: (أ/ب)′ = (أ′ب - أب′)/ب²",
    summaryEn: "Sum rule: (f+g)′ = f′ + g′. Product rule: (fg)′ = f′g + fg′. Quotient rule: (f/g)′ = (f′g - fg′)/g²",
    objectives: {
      ar: ["تطبيق قاعدة الجمع", "تطبيق قاعدة الضرب", "تطبيق قاعدة القسمة"],
      en: ["Apply sum rule", "Apply product rule", "Apply quotient rule"]
    },
    concepts: {
      ar: [
        { term: "قاعدة الضرب", definition: "(أ×ب)′ = أ′ب + أب′" },
        { term: "قاعدة القسمة", definition: "(أ/ب)′ = (أ′ب - أب′)/ب²" }
      ],
      en: [
        { term: "Product Rule", definition: "(fg)′ = f′g + fg′" },
        { term: "Quotient Rule", definition: "(f/g)′ = (f′g - fg′)/g²" }
      ]
    },
    formulas: {
      ar: [
        { formula: "(أ + ب)′ = أ′ + ب′", explanation: "مشتقة المجموع" },
        { formula: "(أ × ب)′ = أ′ب + أب′", explanation: "مشتقة الحاصل ضرب دالتين" },
        { formula: "(أ ÷ ب)′ = (أ′ب - أب′) ÷ ب²", explanation: "مشتقة خارج قسمة دالتين" }
      ],
      en: [
        { formula: "(f + g)′ = f′ + g′", explanation: "Derivative of sum" },
        { formula: "(f × g)′ = f′g + fg′", explanation: "Derivative of product of two functions" },
        { formula: "(f ÷ g)′ = (f′g - fg′) ÷ g²", explanation: "Derivative of quotient of two functions" }
      ]
    },
    examples: {
      ar: [
        {
          question: "أوجد مشتقة د(س) = س² × (س + 1)",
          solution: "د′(س) = 2س(س+1) + س²(1) = 2س² + 2س + س² = 3س² + 2س",
          steps: ["نطبق قاعدة الضرب", "أ′ = 2س، ب = س+1، ب′ = 1", "د′ = 2س(س+1) + س²(1)", "التبسيط: 3س² + 2س"]
        }
      ],
      en: [
        {
          question: "Find the derivative of f(x) = x² × (x + 1)",
          solution: "f′(x) = 2x(x+1) + x²(1) = 2x² + 2x + x² = 3x² + 2x",
          steps: ["Apply product rule", "f′ = 2x, g = x+1, g′ = 1", "f′ = 2x(x+1) + x²(1)", "Simplify: 3x² + 2x"]
        }
      ]
    },
    simulators: ["differentiation", "functions"],
    questions: [
      { type: "mcq", questionAr: "ما صيغة قاعدة الضرب؟", questionEn: "What is the product rule formula?", optionsAr: ["أ′ب + أب′", "أ′ب - أب′", "أ′ + ب′", "أ′ب′"], optionsEn: ["f′g + fg′", "f′g - fg′", "f′ + g′", "f′g′"], answer: "أ′ب + أب′", points: 1 }
    ]
  }
];

// دروس الأحياء - الخلية والوراثة
const biologyLessons = [
  {
    titleAr: "تركيب الخلية",
    titleEn: "Cell Structure",
    slug: "cell-structure-biology",
    descriptionAr: "دراسة مكونات الخلية النباتية والحيوانية",
    descriptionEn: "Study of plant and animal cell components",
    duration: 50,
    order: 1,
    isFree: true,
    introductionAr: "الخلية هي وحدة البناء الأساسية لجميع الكائنات الحية. تحتوي على عضيات متخصصة تقوم بوظائف مختلفة ضرورية لحياة الخلية.",
    introductionEn: "The cell is the basic building unit of all living organisms. It contains specialized organelles that perform different functions essential for cell life.",
    summaryAr: "الخلية = غشاء بلازمي + سيتوبلازم + نواة. تحتوي على عضيات مثل الميتوكوندريا والريبوسومات.",
    summaryEn: "Cell = Plasma membrane + Cytoplasm + Nucleus. Contains organelles like mitochondria and ribosomes.",
    objectives: {
      ar: ["التعرف على مكونات الخلية", "التمييز بين الخلية النباتية والحيوانية", "فهم وظائف العضيات"],
      en: ["Identify cell components", "Distinguish between plant and animal cells", "Understand organelle functions"]
    },
    concepts: {
      ar: [
        { term: "الغشاء البلازمي", definition: "غشاء يحيط بالخلية وينظم مرور المواد" },
        { term: "النواة", definition: "مركز التحكم في الخلية وتحتوي على المادة الوراثية" },
        { term: "الميتوكوندريا", definition: "موقع إنتاج الطاقة في الخلية" },
        { term: "الريبية", definition: "موقع تصنيع البروتين" }
      ],
      en: [
        { term: "Plasma Membrane", definition: "Membrane surrounding the cell regulating material passage" },
        { term: "Nucleus", definition: "Control center containing genetic material" },
        { term: "Mitochondria", definition: "Site of energy production in the cell" },
        { term: "Ribosome", definition: "Site of protein synthesis" }
      ]
    },
    formulas: {
      ar: [],
      en: []
    },
    examples: {
      ar: [
        {
          question: "ما الفرق بين الخلية النباتية والخلية الحيوانية؟",
          solution: "الخلية النباتية تحتوي على جدار خلوي وكلوروبلاست، بينما الخلية الحيوانية لا تحتوي عليهما.",
          steps: ["الخلية النباتية: جدار خلوي + كلوروبلاست", "الخلية الحيوانية: لا جدار خلوي + لا كلوروبلاست", "كلاهما: غشاء بلازمي + نواة + ميتوكوندريا"]
        }
      ],
      en: [
        {
          question: "What is the difference between plant and animal cells?",
          solution: "Plant cell has cell wall and chloroplast, while animal cell lacks both.",
          steps: ["Plant cell: cell wall + chloroplast", "Animal cell: no cell wall + no chloroplast", "Both: plasma membrane + nucleus + mitochondria"]
        }
      ]
    },
    simulators: ["cell"],
    questions: [
      { type: "mcq", questionAr: "أين يتم إنتاج الطاقة في الخلية؟", questionEn: "Where is energy produced in the cell?", optionsAr: ["الميتوكوندريا", "النواة", "الريبية", "الغشاء"], optionsEn: ["Mitochondria", "Nucleus", "Ribosome", "Membrane"], answer: "الميتوكوندريا", points: 1 }
    ]
  }
];

// ==================== دالة التعبئة الرئيسية ====================

export async function POST() {
  try {
    console.log("Starting lessons seeding...");
    
    // جلب المحاكيات والوحدات
    const simulators = await db.simulator.findMany();
    const units = await db.unit.findMany();
    
    let createdLessons = 0;
    let createdQuestions = 0;
    const errors: string[] = [];
    
    // حذف البيانات القديمة
    await db.mindMap.deleteMany();
    await db.infographic.deleteMany();
    await db.question.deleteMany();
    await db.example.deleteMany();
    await db.formula.deleteMany();
    await db.concept.deleteMany();
    await db.objective.deleteMany();
    await db.lessonSimulator.deleteMany();
    await db.lesson.deleteMany();
    
    console.log("Old lesson data cleaned.");
    
    // دالة مساعدة لإنشاء الدروس
    async function createLessonsForUnit(
      unitSlug: string, 
      lessons: typeof physicsMechanicsLessons
    ) {
      const unit = units.find(u => u.slug === unitSlug);
      if (!unit) {
        errors.push(`Unit not found: ${unitSlug}`);
        return;
      }
      
      for (const lessonData of lessons) {
        try {
          const lesson = await db.lesson.create({
            data: {
              unitId: unit.id,
              titleAr: lessonData.titleAr,
              titleEn: lessonData.titleEn,
              slug: `${unitSlug}-${lessonData.slug}`,
              descriptionAr: lessonData.descriptionAr,
              descriptionEn: lessonData.descriptionEn,
              duration: lessonData.duration,
              order: lessonData.order,
              isFree: lessonData.isFree,
              introductionAr: lessonData.introductionAr,
              introductionEn: lessonData.introductionEn,
              summaryAr: lessonData.summaryAr,
              summaryEn: lessonData.summaryEn,
            },
          });
          
          // إضافة الأهداف
          for (let i = 0; i < lessonData.objectives.ar.length; i++) {
            await db.objective.create({
              data: {
                lessonId: lesson.id,
                textAr: lessonData.objectives.ar[i],
                textEn: lessonData.objectives.en[i] || "",
                order: i + 1,
              },
            });
          }
          
          // إضافة المفاهيم
          for (let i = 0; i < lessonData.concepts.ar.length; i++) {
            await db.concept.create({
              data: {
                lessonId: lesson.id,
                termAr: lessonData.concepts.ar[i].term,
                termEn: lessonData.concepts.en[i]?.term || "",
                definitionAr: lessonData.concepts.ar[i].definition,
                definitionEn: lessonData.concepts.en[i]?.definition || "",
                order: i + 1,
              },
            });
          }
          
          // إضافة المعادلات
          for (let i = 0; i < lessonData.formulas.ar.length; i++) {
            await db.formula.create({
              data: {
                lessonId: lesson.id,
                formula: lessonData.formulas.ar[i].formula,
                explanationAr: lessonData.formulas.ar[i].explanation,
                explanationEn: lessonData.formulas.en[i]?.explanation || "",
                order: i + 1,
              },
            });
          }
          
          // إضافة الأمثلة
          for (let i = 0; i < lessonData.examples.ar.length; i++) {
            await db.example.create({
              data: {
                lessonId: lesson.id,
                questionAr: lessonData.examples.ar[i].question,
                questionEn: lessonData.examples.en[i]?.question || "",
                solutionAr: lessonData.examples.ar[i].solution,
                solutionEn: lessonData.examples.en[i]?.solution || "",
                stepsAr: JSON.stringify(lessonData.examples.ar[i].steps),
                stepsEn: JSON.stringify(lessonData.examples.en[i]?.steps || []),
                order: i + 1,
              },
            });
          }
          
          // ربط المحاكيات
          for (const simSlug of lessonData.simulators) {
            const simulator = simulators.find(s => s.slug === simSlug);
            if (simulator) {
              await db.lessonSimulator.create({
                data: {
                  lessonId: lesson.id,
                  simulatorId: simulator.id,
                },
              });
            }
          }
          
          // إضافة الأسئلة
          for (const q of lessonData.questions) {
            await db.question.create({
              data: {
                lessonId: lesson.id,
                type: q.type,
                questionAr: q.questionAr,
                questionEn: q.questionEn,
                optionsAr: JSON.stringify(q.optionsAr),
                optionsEn: JSON.stringify(q.optionsEn),
                answer: q.answer,
                points: q.points,
                difficulty: "medium",
                order: 1,
              },
            });
            createdQuestions++;
          }
          
          createdLessons++;
        } catch (error) {
          errors.push(`Error creating lesson ${lessonData.slug}: ${String(error)}`);
        }
      }
    }
    
    // إنشاء دروس الفيزياء
    console.log("Creating physics lessons...");
    await createLessonsForUnit("physics-3-math-mechanics-3-math", physicsMechanicsLessons);
    await createLessonsForUnit("physics-3-sci-mechanics-3-sci", physicsMechanicsLessons);
    
    // إنشاء دروس الكيمياء
    console.log("Creating chemistry lessons...");
    await createLessonsForUnit("chemistry-3-math-atomic-structure-3-math", chemistryAtomicLessons);
    await createLessonsForUnit("chemistry-3-sci-atomic-structure-3-sci", chemistryAtomicLessons);
    
    // إنشاء دروس الرياضيات
    console.log("Creating math lessons...");
    await createLessonsForUnit("mathematics-3-2-differentiation-3", mathDifferentiationLessons);
    await createLessonsForUnit("mathematics-3-2-sci-differentiation-3-sci", mathDifferentiationLessons);
    
    // إنشاء دروس الأحياء
    console.log("Creating biology lessons...");
    await createLessonsForUnit("biology-3-cell-genetics-3", biologyLessons);
    
    const stats = {
      lessons: await db.lesson.count(),
      objectives: await db.objective.count(),
      concepts: await db.concept.count(),
      formulas: await db.formula.count(),
      examples: await db.example.count(),
      questions: createdQuestions,
      errors: errors.length,
    };
    
    console.log("Lessons seeding completed!", stats);
    
    return NextResponse.json({
      success: true,
      message: "تم إنشاء الدروس بنجاح",
      stats,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
    });
  } catch (error) {
    console.error("Error seeding lessons:", error);
    return NextResponse.json(
      { error: "Failed to seed lessons", details: String(error) },
      { status: 500 }
    );
  }
}
