import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ==================== دروس جميع المراحل الدراسية ====================

// دروس الفيزياء - الصف الأول الثانوي
const firstYearPhysicsLessons = [
  {
    unitSlug: "physics-1-intro-physics",
    lessons: [
      {
        titleAr: "مقدمة في الفيزياء",
        titleEn: "Introduction to Physics",
        slug: "intro-physics-first-year",
        descriptionAr: "تعريف الفيزياء وأهميتها وفروعها الرئيسية",
        descriptionEn: "Definition of physics, its importance and main branches",
        duration: 40,
        order: 1,
        isFree: true,
        introductionAr: "الفيزياء هي علم دراسة المادة والطاقة والتفاعل بينهما. تهتم الفيزياء بفهم الظواهر الطبيعية من حولنا وتفسيرها بطريقة علمية ومنهجية. تشمل الفيزياء العديد من الفروع مثل الميكانيكا والكهرباء والضوء والصوت.",
        introductionEn: "Physics is the science of studying matter, energy, and their interaction. Physics is concerned with understanding and explaining natural phenomena in a scientific and systematic way.",
        summaryAr: "الفيزياء علم أساسي يدرس المادة والطاقة. فروعها تشمل: الميكانيكا، الكهرباء والمغناطيسية، الضوء، الصوت، والفيزياء الحديثة.",
        summaryEn: "Physics is a fundamental science studying matter and energy. Its branches include: Mechanics, Electricity and Magnetism, Light, Sound, and Modern Physics.",
        objectives: {
          ar: ["فهم تعريف الفيزياء وأهميتها", "التعرف على فروع الفيزياء الرئيسية", "فهم المنهج العلمي في الفيزياء", "التعرف على وحدات القياس الأساسية"],
          en: ["Understand the definition and importance of physics", "Identify the main branches of physics", "Understand the scientific method in physics", "Learn basic measurement units"]
        },
        concepts: {
          ar: [
            { term: "الفيزياء", definition: "علم يدرس المادة والطاقة والعلاقة بينهما" },
            { term: "المادة", definition: "كل ما له كتلة وحجم يشغل حيزاً من الفراغ" },
            { term: "الطاقة", definition: "القدرة على بذل شغل أو إحداث تغيير" },
            { term: "المنهج العلمي", definition: "خطوات منظمة لحل المشكلات العلمية" }
          ],
          en: [
            { term: "Physics", definition: "Science studying matter and energy and their relationship" },
            { term: "Matter", definition: "Anything that has mass and volume occupying space" },
            { term: "Energy", definition: "The ability to do work or cause change" },
            { term: "Scientific Method", definition: "Organized steps to solve scientific problems" }
          ]
        },
        formulas: {
          ar: [{ formula: "ρ = m / V", explanation: "الكثافة = الكتلة ÷ الحجم" }],
          en: [{ formula: "ρ = m / V", explanation: "Density = Mass ÷ Volume" }]
        },
        examples: {
          ar: [{ question: "ما هي فروع الفيزياء الرئيسية؟", solution: "الميكانيكا، الكهرباء والمغناطيسية، الضوء، الصوت، الفيزياء الذرية والنووية.", steps: ["1. الميكانيكا: دراسة الحركة", "2. الكهرباء: دراسة الشحنات", "3. الضوء: دراسة الإشعاع", "4. الصوت: دراسة الموجات"] }],
          en: [{ question: "What are the main branches of physics?", solution: "Mechanics, Electricity and Magnetism, Light, Sound, Atomic and Nuclear Physics.", steps: ["1. Mechanics: Study of motion", "2. Electricity: Study of charges", "3. Light: Study of radiation", "4. Sound: Study of waves"] }]
        },
        questions: {
          ar: [
            { question: "ما هو تعريف الفيزياء؟", options: ["علم دراسة المادة والطاقة", "علم دراسة الكائنات الحية", "علم دراسة الأرض", "علم دراسة المواد الكيميائية"], answer: "0", points: 2 },
            { question: "ما هي وحدة قياس الكتلة في النظام الدولي؟", options: ["الجرام", "الكيلوجرام", "الطن", "الباوند"], answer: "1", points: 2 }
          ],
          en: [
            { question: "What is the definition of physics?", options: ["Science of matter and energy", "Science of living organisms", "Science of Earth", "Science of chemical materials"], answer: "0", points: 2 },
            { question: "What is the SI unit of mass?", options: ["Gram", "Kilogram", "Ton", "Pound"], answer: "1", points: 2 }
          ]
        }
      },
      {
        titleAr: "القياس والوحدات",
        titleEn: "Measurement and Units",
        slug: "measurement-units-first-year",
        descriptionAr: "دراسة القياس والوحدات الأساسية والمشتقة في النظام الدولي",
        descriptionEn: "Study of measurement, fundamental and derived units in the SI system",
        duration: 45,
        order: 2,
        isFree: true,
        introductionAr: "القياس هو عملية مقارنة كمية مجهولة بكمية معروفة من نفس النوع تسمى وحدة القياس. النظام الدولي للوحدات (SI) هو النظام المعتمد عالمياً للقياسات العلمية.",
        introductionEn: "Measurement is the process of comparing an unknown quantity with a known quantity of the same type called a unit. The International System of Units (SI) is the globally accepted system for scientific measurements.",
        summaryAr: "القياس أساس العمل العلمي. الوحدات الأساسية السبع: المتر، الكيلوجرام، الثانية، الأمبير، الكلفن، المول، الشمعة.",
        summaryEn: "Measurement is the foundation of scientific work. The seven fundamental units: Meter, Kilogram, Second, Ampere, Kelvin, Mole, Candela.",
        objectives: {
          ar: ["فهم مفهوم القياس وأهميته", "حفظ الوحدات الأساسية السبع", "التعرف على الوحدات المشتقة", "إتقان التحويل بين الوحدات"],
          en: ["Understand the concept and importance of measurement", "Memorize the seven fundamental units", "Learn about derived units", "Master unit conversions"]
        },
        concepts: {
          ar: [
            { term: "القياس", definition: "مقارنة كمية مجهولة بكمية معروفة من نفس النوع" },
            { term: "الوحدة", definition: "كمية معيارية تستخدم لقياس كميات من نفس النوع" },
            { term: "الدقة", definition: "قرب القيمة المقاسة من القيمة الحقيقية" },
            { term: "الضبط", definition: "اتفاق القراءات المتكررة مع بعضها البعض" }
          ],
          en: [
            { term: "Measurement", definition: "Comparing an unknown quantity with a known quantity of the same type" },
            { term: "Unit", definition: "A standard quantity used to measure quantities of the same type" },
            { term: "Accuracy", definition: "Closeness of measured value to true value" },
            { term: "Precision", definition: "Agreement of repeated readings with each other" }
          ]
        },
        formulas: {
          ar: [{ formula: "1 كم = 1000 م", explanation: "التحويل من الكيلومتر للمتر" }],
          en: [{ formula: "1 km = 1000 m", explanation: "Conversion from kilometer to meter" }]
        },
        examples: {
          ar: [{ question: "حول 5 كم إلى متر", solution: "5 كم = 5 × 1000 = 5000 م", steps: ["1. نعرف أن 1 كم = 1000 م", "2. نضرب 5 في 1000", "3. النتيجة: 5000 م"] }],
          en: [{ question: "Convert 5 km to meters", solution: "5 km = 5 × 1000 = 5000 m", steps: ["1. We know that 1 km = 1000 m", "2. Multiply 5 by 1000", "3. Result: 5000 m"] }]
        },
        questions: {
          ar: [
            { question: "ما هي وحدة قياس الطول في النظام الدولي؟", options: ["القدم", "المتر", "السنتيمتر", "الكيلومتر"], answer: "1", points: 2 },
            { question: "كم يساوي الكيلوجرام بالجرام؟", options: ["100 جرام", "500 جرام", "1000 جرام", "10000 جرام"], answer: "2", points: 2 }
          ],
          en: [
            { question: "What is the SI unit of length?", options: ["Foot", "Meter", "Centimeter", "Kilometer"], answer: "1", points: 2 },
            { question: "How many grams are in a kilogram?", options: ["100 g", "500 g", "1000 g", "10000 g"], answer: "2", points: 2 }
          ]
        }
      },
      {
        titleAr: "الحركة المستقيمة",
        titleEn: "Linear Motion",
        slug: "linear-motion-first-year",
        descriptionAr: "دراسة الحركة في خط مستقيم وأنواعها",
        descriptionEn: "Study of motion in a straight line and its types",
        duration: 50,
        order: 3,
        isFree: true,
        introductionAr: "الحركة المستقيمة هي حركة الجسم في خط مستقيم. يمكن أن تكون منتظمة (سرعة ثابتة) أو متغيرة (تسارع). دراسة الحركة تشمل الإزاحة والسرعة والتسارع.",
        introductionEn: "Linear motion is the movement of an object in a straight line. It can be uniform (constant velocity) or variable (acceleration). The study of motion includes displacement, velocity, and acceleration.",
        summaryAr: "الحركة المنتظمة: سرعة ثابتة. الحركة المتغيرة: تسارع. القوانين: v = Δx/Δt, a = Δv/Δt.",
        summaryEn: "Uniform motion: constant velocity. Variable motion: acceleration. Laws: v = Δx/Δt, a = Δv/Δt.",
        objectives: {
          ar: ["فهم مفهوم الحركة", "التمييز بين الحركة المنتظمة والمتغيرة", "حساب السرعة والتسارع", "تحليل الرسوم البيانية للحركة"],
          en: ["Understand the concept of motion", "Distinguish between uniform and variable motion", "Calculate velocity and acceleration", "Analyze motion graphs"]
        },
        concepts: {
          ar: [
            { term: "الإزاحة", definition: "أقصر مسافة بين نقطة البداية ونقطة النهاية" },
            { term: "السرعة", definition: "معدل تغير الإزاحة بالنسبة للزمن" },
            { term: "التسارع", definition: "معدل تغير السرعة بالنسبة للزمن" }
          ],
          en: [
            { term: "Displacement", definition: "Shortest distance between start and end points" },
            { term: "Velocity", definition: "Rate of change of displacement with respect to time" },
            { term: "Acceleration", definition: "Rate of change of velocity with respect to time" }
          ]
        },
        formulas: {
          ar: [{ formula: "v = Δx / Δt", explanation: "السرعة = الإزاحة ÷ الزمن" }],
          en: [{ formula: "v = Δx / Δt", explanation: "Velocity = Displacement ÷ Time" }]
        },
        examples: {
          ar: [{ question: "سيارة قطعت 100 متر في 20 ثانية. احسب سرعتها", solution: "v = 100 ÷ 20 = 5 م/ث", steps: ["1. القانون: v = Δx/Δt", "2. التعويض: v = 100/20", "3. النتيجة: 5 م/ث"] }],
          en: [{ question: "A car covered 100m in 20 seconds. Calculate its velocity", solution: "v = 100 ÷ 20 = 5 m/s", steps: ["1. Formula: v = Δx/Δt", "2. Substitute: v = 100/20", "3. Result: 5 m/s"] }]
        },
        questions: {
          ar: [
            { question: "ما الفرق بين الإزاحة والمسافة؟", options: ["الإزاحة أقصر مسافة", "المسافة أقصر مسافة", "لا فرق", "الإزاحة للكواكب"], answer: "0", points: 2 }
          ],
          en: [
            { question: "What is the difference between displacement and distance?", options: ["Displacement is shortest distance", "Distance is shortest", "No difference", "Displacement for planets"], answer: "0", points: 2 }
          ]
        }
      }
    ]
  },
  {
    unitSlug: "physics-1-motion-forces",
    lessons: [
      {
        titleAr: "القوى وقوانين نيوتن",
        titleEn: "Forces and Newton's Laws",
        slug: "newton-laws-first-year",
        descriptionAr: "دراسة القوى وقوانين نيوتن الثلاثة",
        descriptionEn: "Study of forces and Newton's three laws",
        duration: 55,
        order: 1,
        isFree: true,
        introductionAr: "القوة هي المؤثر الذي يغير من حالة الجسم السكونية أو الحركية. قوانين نيوتن الثلاثة تُعد أساس الميكانيكا الكلاسيكية وتشرح العلاقة بين القوة والحركة.",
        introductionEn: "Force is the influence that changes the state of rest or motion of an object. Newton's three laws are the foundation of classical mechanics and explain the relationship between force and motion.",
        summaryAr: "القانون الأول: القصور الذاتي. القانون الثاني: F = ma. القانون الثالث: الفعل ورد الفعل.",
        summaryEn: "First Law: Inertia. Second Law: F = ma. Third Law: Action and Reaction.",
        objectives: {
          ar: ["فهم مفهوم القوة", "فهم القانون الأول لنيوتن", "تطبيق القانون الثاني F=ma", "فهم القانون الثالث"],
          en: ["Understand the concept of force", "Understand Newton's first law", "Apply second law F=ma", "Understand third law"]
        },
        concepts: {
          ar: [
            { term: "القوة", definition: "مؤثر يغير حالة الجسم السكونية أو الحركية" },
            { term: "القصور الذاتي", definition: "مقاومة الجسم لتغير حالته الحركية" },
            { term: "الكتلة", definition: "مقدار المادة في الجسم" }
          ],
          en: [
            { term: "Force", definition: "Influence that changes state of rest or motion" },
            { term: "Inertia", definition: "Resistance of object to change in its motion state" },
            { term: "Mass", definition: "Amount of matter in an object" }
          ]
        },
        formulas: {
          ar: [{ formula: "F = m × a", explanation: "القوة = الكتلة × التسارع" }],
          en: [{ formula: "F = m × a", explanation: "Force = Mass × Acceleration" }]
        },
        examples: {
          ar: [{ question: "جسم كتلته 5kg وتسارعه 2m/s². احسب القوة", solution: "F = 5 × 2 = 10N", steps: ["1. القانون: F = ma", "2. التعويض: F = 5 × 2", "3. النتيجة: 10 نيوتن"] }],
          en: [{ question: "An object of mass 5kg accelerates at 2m/s². Calculate the force", solution: "F = 5 × 2 = 10N", steps: ["1. Formula: F = ma", "2. Substitute: F = 5 × 2", "3. Result: 10 Newtons"] }]
        },
        questions: {
          ar: [
            { question: "ما وحدة قياس القوة؟", options: ["كيلوجرام", "نيوتن", "جول", "واط"], answer: "1", points: 2 }
          ],
          en: [
            { question: "What is the unit of force?", options: ["Kilogram", "Newton", "Joule", "Watt"], answer: "1", points: 2 }
          ]
        }
      }
    ]
  }
];

// دروس الرياضيات - الصف الأول الثانوي
const firstYearMathLessons = [
  {
    unitSlug: "mathematics-1-algebra-basics",
    lessons: [
      {
        titleAr: "الأعداد الحقيقية",
        titleEn: "Real Numbers",
        slug: "real-numbers-first-year",
        descriptionAr: "دراسة مجموعة الأعداد الحقيقية وخصائصها",
        descriptionEn: "Study of the set of real numbers and their properties",
        duration: 45,
        order: 1,
        isFree: true,
        introductionAr: "الأعداد الحقيقية هي مجموعة تشمل جميع الأعداد التي يمكن تمثيلها على خط الأعداد. تنقسم إلى أعداد نسبية وأعداد غير نسبية.",
        introductionEn: "Real numbers are a set that includes all numbers that can be represented on a number line. They are divided into rational and irrational numbers.",
        summaryAr: "الأعداد الحقيقية = النسبية + غير النسبية. النسبية يمكن كتابتها ككسر، غير النسبية لا يمكن.",
        summaryEn: "Real numbers = Rational + Irrational. Rational can be written as fractions, irrational cannot.",
        objectives: {
          ar: ["فهم مفهوم العدد الحقيقي", "التمييز بين النسبية وغير النسبية", "تطبيق خصائص العمليات", "تمثيل الأعداد على خط الأعداد"],
          en: ["Understand real numbers concept", "Distinguish between rational and irrational", "Apply operation properties", "Represent numbers on number line"]
        },
        concepts: {
          ar: [
            { term: "العدد النسبي", definition: "عدد يمكن كتابته على صورة a/b" },
            { term: "العدد غير النسبي", definition: "عدد لا يمكن كتابته ككسر مثل √2" }
          ],
          en: [
            { term: "Rational Number", definition: "A number that can be written as a/b" },
            { term: "Irrational Number", definition: "A number that cannot be written as fraction like √2" }
          ]
        },
        formulas: {
          ar: [{ formula: "ℝ = ℚ ∪ ℚ'", explanation: "الحقيقية = النسبية ∪ غير النسبية" }],
          en: [{ formula: "ℝ = ℚ ∪ ℚ'", explanation: "Real = Rational ∪ Irrational" }]
        },
        examples: {
          ar: [{ question: "صنف: 3، √2، π، 0.25", solution: "3 نسبي، √2 غير نسبي، π غير نسبي، 0.25 نسبي", steps: ["1. 3 = 3/1 نسبي", "2. √2 غير نسبي", "3. π غير نسبي", "4. 0.25 = 1/4 نسبي"] }],
          en: [{ question: "Classify: 3, √2, π, 0.25", solution: "3 rational, √2 irrational, π irrational, 0.25 rational", steps: ["1. 3 = 3/1 rational", "2. √2 irrational", "3. π irrational", "4. 0.25 = 1/4 rational"] }]
        },
        questions: {
          ar: [
            { question: "أي الأعداد غير نسبي؟", options: ["1/2", "√4", "√3", "0.5"], answer: "2", points: 2 }
          ],
          en: [
            { question: "Which is irrational?", options: ["1/2", "√4", "√3", "0.5"], answer: "2", points: 2 }
          ]
        }
      },
      {
        titleAr: "الجذور وخصائصها",
        titleEn: "Roots and Properties",
        slug: "roots-first-year",
        descriptionAr: "دراسة الجذور وخصائصها وعملياتها",
        descriptionEn: "Study of roots, their properties and operations",
        duration: 50,
        order: 2,
        isFree: true,
        introductionAr: "الجذر التربيعي لعدد ما هو العدد الذي إذا ضرب في نفسه أعطى العدد الأصلي. الجذور لها خصائص مهمة تساعد في تبسيط التعابير.",
        introductionEn: "The square root of a number is the number that when multiplied by itself gives the original number. Roots have important properties that help simplify expressions.",
        summaryAr: "√(a×b) = √a × √b، √(a/b) = √a / √b",
        summaryEn: "√(a×b) = √a × √b, √(a/b) = √a / √b",
        objectives: {
          ar: ["فهم مفهوم الجذر التربيعي", "تطبيق خصائص الجذور", "تبسيط التعابير", "حل معادلات بالجذور"],
          en: ["Understand square root concept", "Apply root properties", "Simplify expressions", "Solve equations with roots"]
        },
        concepts: {
          ar: [
            { term: "الجذر التربيعي", definition: "العدد الذي مربعه يساوي العدد الأصلي" },
            { term: "الجذر التكعيبي", definition: "العدد الذي مكعبه يساوي العدد الأصلي" }
          ],
          en: [
            { term: "Square Root", definition: "Number whose square equals the original" },
            { term: "Cube Root", definition: "Number whose cube equals the original" }
          ]
        },
        formulas: {
          ar: [{ formula: "√(a × b) = √a × √b", explanation: "جذر حاصل الضرب = حاصل ضرب الجذور" }],
          en: [{ formula: "√(a × b) = √a × √b", explanation: "Root of product = product of roots" }]
        },
        examples: {
          ar: [{ question: "بسّط: √12", solution: "√12 = √(4×3) = 2√3", steps: ["1. 12 = 4 × 3", "2. √12 = √4 × √3", "3. = 2√3"] }],
          en: [{ question: "Simplify: √12", solution: "√12 = √(4×3) = 2√3", steps: ["1. 12 = 4 × 3", "2. √12 = √4 × √3", "3. = 2√3"] }]
        },
        questions: {
          ar: [
            { question: "ما قيمة √16؟", options: ["2", "4", "8", "32"], answer: "1", points: 1 }
          ],
          en: [
            { question: "What is √16?", options: ["2", "4", "8", "32"], answer: "1", points: 1 }
          ]
        }
      }
    ]
  }
];

// دروس الكيمياء - الصف الأول الثانوي
const firstYearChemistryLessons = [
  {
    unitSlug: "chemistry-1-intro-chemistry",
    lessons: [
      {
        titleAr: "مقدمة في الكيمياء",
        titleEn: "Introduction to Chemistry",
        slug: "intro-chemistry-first-year",
        descriptionAr: "تعريف الكيمياء وأهميتها وفروعها",
        descriptionEn: "Definition of chemistry, its importance and branches",
        duration: 40,
        order: 1,
        isFree: true,
        introductionAr: "الكيمياء هي علم دراسة المادة وتحولاتها والطاقة المصاحبة لهذه التحولات. تُعد من أهم العلوم الطبيعية لارتباطها بجميع جوانب الحياة.",
        introductionEn: "Chemistry is the science of studying matter, its transformations, and accompanying energy. It's one of the most important natural sciences due to its connection to all aspects of life.",
        summaryAr: "الكيمياء علم المادة وتحولاتها. فروعها: العضوية، غير العضوية، الفيزيائية، التحليلية، الحيوية.",
        summaryEn: "Chemistry is the science of matter and transformations. Branches: Organic, Inorganic, Physical, Analytical, Biochemistry.",
        objectives: {
          ar: ["فهم تعريف الكيمياء", "معرفة فروع الكيمياء", "فهم أهمية الكيمياء", "التعرف على الطريقة العلمية"],
          en: ["Understand chemistry definition", "Know chemistry branches", "Understand chemistry importance", "Learn scientific method"]
        },
        concepts: {
          ar: [
            { term: "المادة", definition: "كل ما له كتلة ويشغل حيزاً" },
            { term: "العنصر", definition: "مادة نقية لا يمكن تحليلها لأبسط" },
            { term: "المركب", definition: "اتحاد عنصرين أو أكثر بنسب ثابتة" }
          ],
          en: [
            { term: "Matter", definition: "Anything with mass occupying space" },
            { term: "Element", definition: "Pure substance that cannot be broken down" },
            { term: "Compound", definition: "Union of two or more elements in fixed ratios" }
          ]
        },
        formulas: {
          ar: [{ formula: "H₂O", explanation: "الماء - مركب من H و O" }],
          en: [{ formula: "H₂O", explanation: "Water - compound of H and O" }]
        },
        examples: {
          ar: [{ question: "ما الفرق بين العنصر والمركب؟", solution: "العنصر: مادة أساسية. المركب: اتحاد عناصر.", steps: ["1. العنصر أساسي", "2. المركب متحد", "3. الحديد عنصر", "4. الماء مركب"] }],
          en: [{ question: "Difference between element and compound?", solution: "Element: basic substance. Compound: union of elements.", steps: ["1. Element is basic", "2. Compound is combined", "3. Iron is element", "4. Water is compound"] }]
        },
        questions: {
          ar: [
            { question: "أي مما يلي عنصر؟", options: ["الماء", "ملح الطعام", "الحديد", "CO₂"], answer: "2", points: 2 }
          ],
          en: [
            { question: "Which is an element?", options: ["Water", "Table salt", "Iron", "CO₂"], answer: "2", points: 2 }
          ]
        }
      },
      {
        titleAr: "الذرة والتركيب الذري",
        titleEn: "Atom and Atomic Structure",
        slug: "atomic-structure-first-year",
        descriptionAr: "دراسة الذرة ومكوناتها الأساسية",
        descriptionEn: "Study of the atom and its basic components",
        duration: 55,
        order: 2,
        isFree: true,
        introductionAr: "الذرة هي أصغر وحدة بنائية للمادة يمكن أن تشارك في التفاعل الكيميائي. تتكون من نواة موجبة وإلكترونات سالبة تدور حولها.",
        introductionEn: "The atom is the smallest building unit of matter that can participate in a chemical reaction. It consists of a positive nucleus and negative electrons orbiting around it.",
        summaryAr: "الذرة = نواة + إلكترونات. النواة = بروتونات + نيوترونات. العدد الذري Z = البروتونات.",
        summaryEn: "Atom = Nucleus + Electrons. Nucleus = Protons + Neutrons. Atomic number Z = Protons.",
        objectives: {
          ar: ["فهم تركيب الذرة", "التعرف على الجسيمات تحت الذرية", "حساب العدد الذري والكتلي", "فهم توزيع الإلكترونات"],
          en: ["Understand atomic structure", "Identify subatomic particles", "Calculate atomic and mass numbers", "Understand electron distribution"]
        },
        concepts: {
          ar: [
            { term: "البروتون", definition: "جسيم موجب في النواة" },
            { term: "النيوترون", definition: "جسيم متعادل في النواة" },
            { term: "الإلكترون", definition: "جسيم سالب حول النواة" }
          ],
          en: [
            { term: "Proton", definition: "Positive particle in nucleus" },
            { term: "Neutron", definition: "Neutral particle in nucleus" },
            { term: "Electron", definition: "Negative particle around nucleus" }
          ]
        },
        formulas: {
          ar: [{ formula: "A = Z + N", explanation: "العدد الكتلي = الذري + النيوترونات" }],
          en: [{ formula: "A = Z + N", explanation: "Mass number = Atomic + Neutrons" }]
        },
        examples: {
          ar: [{ question: "كربون Z=6, A=12. أوجد النيوترونات", solution: "N = A - Z = 12 - 6 = 6", steps: ["1. القانون: N = A - Z", "2. التعويض: N = 12 - 6", "3. النتيجة: 6 نيوترونات"] }],
          en: [{ question: "Carbon Z=6, A=12. Find neutrons", solution: "N = A - Z = 12 - 6 = 6", steps: ["1. Formula: N = A - Z", "2. Substitute: N = 12 - 6", "3. Result: 6 neutrons"] }]
        },
        questions: {
          ar: [
            { question: "أين توجد البروتونات؟", options: ["حول النواة", "في النواة", "خارج الذرة", "في الإلكترونات"], answer: "1", points: 2 }
          ],
          en: [
            { question: "Where are protons found?", options: ["Around nucleus", "In nucleus", "Outside atom", "In electrons"], answer: "1", points: 2 }
          ]
        }
      }
    ]
  }
];

// دروس الصف الثاني الثانوي
const secondYearPhysicsLessons = [
  {
    unitSlug: "physics-2-math-electricity",
    lessons: [
      {
        titleAr: "الشحنة الكهربية وقانون كولوم",
        titleEn: "Electric Charge and Coulomb's Law",
        slug: "electric-charge-second-year",
        descriptionAr: "دراسة الشحنة الكهربية وقانون كولوم",
        descriptionEn: "Study of electric charge and Coulomb's law",
        duration: 50,
        order: 1,
        isFree: true,
        introductionAr: "الشحنة الكهربية هي خاصية فيزياسية للمادة تسبب تفاعلات كهرومغناطيسية. قانون كولوم يحدد القوة بين شحنتين.",
        introductionEn: "Electric charge is a physical property of matter causing electromagnetic interactions. Coulomb's law determines the force between two charges.",
        summaryAr: "F = kq₁q₂/r². الشحنات المتشابهة تتنافر، المختلفة تتجاذب.",
        summaryEn: "F = kq₁q₂/r². Like charges repel, unlike charges attract.",
        objectives: {
          ar: ["فهم مفهوم الشحنة", "تطبيق قانون كولوم", "فهم حفظ الشحنة", "حساب القوة الكهربية"],
          en: ["Understand charge concept", "Apply Coulomb's law", "Understand charge conservation", "Calculate electric force"]
        },
        concepts: {
          ar: [
            { term: "الشحنة الكهربية", definition: "خاصية تسبب تفاعلات كهرومغناطيسية" },
            { term: "الكولوم", definition: "وحدة قياس الشحنة" },
            { term: "قانون كولوم", definition: "القوة بين شحنتين" }
          ],
          en: [
            { term: "Electric Charge", definition: "Property causing electromagnetic interactions" },
            { term: "Coulomb", definition: "Unit of electric charge" },
            { term: "Coulomb's Law", definition: "Force between two charges" }
          ]
        },
        formulas: {
          ar: [{ formula: "F = kq₁q₂/r²", explanation: "قانون كولوم" }],
          en: [{ formula: "F = kq₁q₂/r²", explanation: "Coulomb's law" }]
        },
        examples: {
          ar: [{ question: "شحنتان 2µC و 4µC على بعد 3م. احسب القوة", solution: "F = 9×10⁹ × 2×10⁻⁶ × 4×10⁻⁶ / 9 = 8×10⁻³N", steps: ["1. تحويل: µC = 10⁻⁶C", "2. تطبيق القانون", "3. النتيجة: 8×10⁻³N"] }],
          en: [{ question: "Two charges 2µC and 4µC at 3m. Calculate force", solution: "F = 9×10⁹ × 2×10⁻⁶ × 4×10⁻⁶ / 9 = 8×10⁻³N", steps: ["1. Convert: µC = 10⁻⁶C", "2. Apply formula", "3. Result: 8×10⁻³N"] }]
        },
        questions: {
          ar: [
            { question: "ما وحدة الشحنة؟", options: ["أمبير", "فولت", "كولوم", "أوم"], answer: "2", points: 2 }
          ],
          en: [
            { question: "What is the unit of charge?", options: ["Ampere", "Volt", "Coulomb", "Ohm"], answer: "2", points: 2 }
          ]
        }
      },
      {
        titleAr: "التيار الكهربي وقانون أوم",
        titleEn: "Electric Current and Ohm's Law",
        slug: "ohm-law-second-year",
        descriptionAr: "دراسة التيار الكهربي وقانون أوم",
        descriptionEn: "Study of electric current and Ohm's law",
        duration: 55,
        order: 2,
        isFree: true,
        introductionAr: "التيار الكهربي هو معدل تدفق الشحنات. قانون أوم يربط الجهد والتيار والمقاومة: V = IR.",
        introductionEn: "Electric current is the rate of flow of charges. Ohm's law relates voltage, current, and resistance: V = IR.",
        summaryAr: "V = IR. القدرة P = VI. التيار I = Q/t.",
        summaryEn: "V = IR. Power P = VI. Current I = Q/t.",
        objectives: {
          ar: ["فهم مفهوم التيار", "تطبيق قانون أوم", "حساب المقاومة", "فهم القدرة الكهربية"],
          en: ["Understand current concept", "Apply Ohm's law", "Calculate resistance", "Understand electric power"]
        },
        concepts: {
          ar: [
            { term: "التيار الكهربي", definition: "معدل تدفق الشحنات" },
            { term: "المقاومة", definition: "ممانعة مرور التيار" },
            { term: "قانون أوم", definition: "V = IR" }
          ],
          en: [
            { term: "Electric Current", definition: "Rate of flow of charges" },
            { term: "Resistance", definition: "Opposition to current flow" },
            { term: "Ohm's Law", definition: "V = IR" }
          ]
        },
        formulas: {
          ar: [{ formula: "V = I × R", explanation: "قانون أوم" }],
          en: [{ formula: "V = I × R", explanation: "Ohm's law" }]
        },
        examples: {
          ar: [{ question: "دائرة V=12V, R=4Ω. احسب التيار", solution: "I = V/R = 12/4 = 3A", steps: ["1. القانون: I = V/R", "2. التعويض: I = 12/4", "3. النتيجة: 3A"] }],
          en: [{ question: "Circuit with V=12V, R=4Ω. Calculate current", solution: "I = V/R = 12/4 = 3A", steps: ["1. Formula: I = V/R", "2. Substitute: I = 12/4", "3. Result: 3A"] }]
        },
        questions: {
          ar: [
            { question: "ما وحدة التيار؟", options: ["فولت", "أمبير", "أوم", "واط"], answer: "1", points: 1 }
          ],
          en: [
            { question: "What is the unit of current?", options: ["Volt", "Ampere", "Ohm", "Watt"], answer: "1", points: 1 }
          ]
        }
      }
    ]
  }
];

const secondYearChemistryLessons = [
  {
    unitSlug: "chemistry-2-math-periodic-table",
    lessons: [
      {
        titleAr: "الجدول الدوري الحديث",
        titleEn: "Modern Periodic Table",
        slug: "periodic-table-second-year",
        descriptionAr: "دراسة الجدول الدوري الحديث وتصنيف العناصر",
        descriptionEn: "Study of modern periodic table and element classification",
        duration: 50,
        order: 1,
        isFree: true,
        introductionAr: "الجدول الدوري الحديث هو تنظيم العناصر حسب أعدادها الذرية المتزايدة وخصائصها الكيميائية. يتكون من 7 دورات و18 مجموعة.",
        introductionEn: "The modern periodic table organizes elements by increasing atomic numbers and chemical properties. It consists of 7 periods and 18 groups.",
        summaryAr: "7 دورات × 18 مجموعة. الدورة = مستوى طاقة. المجموعة = إلكترونات التكافؤ.",
        summaryEn: "7 periods × 18 groups. Period = energy level. Group = valence electrons.",
        objectives: {
          ar: ["فهم بنية الجدول", "التعرف على الدورات والمجموعات", "فهم الاتجاهات الدورية", "تصنيف الفلزات واللافلزات"],
          en: ["Understand table structure", "Identify periods and groups", "Understand periodic trends", "Classify metals and non-metals"]
        },
        concepts: {
          ar: [
            { term: "الدورة", definition: "صف أفقي يمثل مستوى طاقة" },
            { term: "المجموعة", definition: "عمود رأسي بنفس إلكترونات التكافؤ" },
            { term: "الفلزات", definition: "عناصر تفقد إلكترونات" }
          ],
          en: [
            { term: "Period", definition: "Horizontal row representing energy level" },
            { term: "Group", definition: "Vertical column with same valence electrons" },
            { term: "Metals", definition: "Elements that lose electrons" }
          ]
        },
        formulas: {
          ar: [{ formula: "العناصر في الدورة الأولى = 2", explanation: "مستوى الطاقة الأول يسع 2 إلكترون" }],
          en: [{ formula: "Elements in first period = 2", explanation: "First energy level holds 2 electrons" }]
        },
        examples: {
          ar: [{ question: "موقع الصوديوم (Z=11)؟", solution: "الدورة 3، المجموعة 1", steps: ["1. التوزيع: 2,8,1", "2. 3 مستويات = الدورة 3", "3. 1 إلكترون تكافؤ = المجموعة 1"] }],
          en: [{ question: "Position of Sodium (Z=11)?", solution: "Period 3, Group 1", steps: ["1. Configuration: 2,8,1", "2. 3 levels = Period 3", "3. 1 valence = Group 1"] }]
        },
        questions: {
          ar: [
            { question: "كم عدد الدورات؟", options: ["5", "6", "7", "8"], answer: "2", points: 1 }
          ],
          en: [
            { question: "How many periods?", options: ["5", "6", "7", "8"], answer: "2", points: 1 }
          ]
        }
      }
    ]
  }
];

const secondYearMathLessons = [
  {
    unitSlug: "mathematics-2-math-trigonometry",
    lessons: [
      {
        titleAr: "الدوال المثلثية",
        titleEn: "Trigonometric Functions",
        slug: "trigonometry-second-year",
        descriptionAr: "دراسة الدوال المثلثية الأساسية",
        descriptionEn: "Study of basic trigonometric functions",
        duration: 55,
        order: 1,
        isFree: true,
        introductionAr: "الدوال المثلثية تربط بين زوايا المثلث وأضلاعه. الدوال الأساسية: الجيب، جيب التمام، الظل.",
        introductionEn: "Trigonometric functions relate triangle angles to sides. Basic functions: Sine, Cosine, Tangent.",
        summaryAr: "جا = مقابل/وتر، جتا = مجاور/وتر، ظا = مقابل/مجاور. جا²θ + جتا²θ = 1.",
        summaryEn: "sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent. sin²θ + cos²θ = 1.",
        objectives: {
          ar: ["فهم الدوال المثلثية", "حساب قيم الزوايا الشهيرة", "تطبيق المتطابقات", "حل المسائل"],
          en: ["Understand trigonometric functions", "Calculate standard angle values", "Apply identities", "Solve problems"]
        },
        concepts: {
          ar: [
            { term: "الجيب (جا)", definition: "نسبة المقابل للوتر" },
            { term: "جيب التمام (جتا)", definition: "نسبة المجاور للوتر" },
            { term: "الظل (ظا)", definition: "نسبة المقابل للمجاور" }
          ],
          en: [
            { term: "Sine (sin)", definition: "Ratio of opposite to hypotenuse" },
            { term: "Cosine (cos)", definition: "Ratio of adjacent to hypotenuse" },
            { term: "Tangent (tan)", definition: "Ratio of opposite to adjacent" }
          ]
        },
        formulas: {
          ar: [{ formula: "جا²θ + جتا²θ = 1", explanation: "المتطابقة الأساسية" }],
          en: [{ formula: "sin²θ + cos²θ = 1", explanation: "Fundamental identity" }]
        },
        examples: {
          ar: [{ question: "مثلث قائم: المقابل=3، الوتر=5. احسب جاθ", solution: "جاθ = 3/5 = 0.6", steps: ["1. جاθ = المقابل/الوتر", "2. = 3/5", "3. = 0.6"] }],
          en: [{ question: "Right triangle: opposite=3, hypotenuse=5. Calculate sinθ", solution: "sinθ = 3/5 = 0.6", steps: ["1. sinθ = opposite/hypotenuse", "2. = 3/5", "3. = 0.6"] }]
        },
        questions: {
          ar: [
            { question: "ما قيمة جا 90°؟", options: ["0", "1", "-1", "غير محدد"], answer: "1", points: 2 }
          ],
          en: [
            { question: "What is sin 90°?", options: ["0", "1", "-1", "undefined"], answer: "1", points: 2 }
          ]
        }
      }
    ]
  }
];

// دروس الصف الثالث الثانوي
const thirdYearPhysicsLessons = [
  {
    unitSlug: "physics-3-math-mechanics-3-math",
    lessons: [
      {
        titleAr: "ظاهرة فوتو الكهربية",
        titleEn: "Photoelectric Effect",
        slug: "photoelectric-third-year",
        descriptionAr: "دراسة ظاهرة التأثير الكهروضوئي",
        descriptionEn: "Study of photoelectric effect",
        duration: 60,
        order: 1,
        isFree: true,
        introductionAr: "ظاهرة فوتو الكهربية هي انبعاث إلكترونات من سطح معدن عند سقوط ضوء عليه. أثبتت الطبيعة الجسيمية للضوء.",
        introductionEn: "Photoelectric effect is the emission of electrons from a metal surface when light falls on it. It proved the particle nature of light.",
        summaryAr: "E = hf. الطاقة الحركية = hf - دالة الشغل.",
        summaryEn: "E = hf. Kinetic energy = hf - work function.",
        objectives: {
          ar: ["فهم الظاهرة", "فهم فرضية بلانك", "تطبيق معادلة أينشتاين", "التعرف على التطبيقات"],
          en: ["Understand the phenomenon", "Understand Planck's hypothesis", "Apply Einstein's equation", "Identify applications"]
        },
        concepts: {
          ar: [
            { term: "الفوتون", definition: "كم من الطاقة الضوئية" },
            { term: "دالة الشغل", definition: "أقل طاقة لانبعاث إلكترون" },
            { term: "التردد الحرج", definition: "أقل تردد لانبعاث إلكترونات" }
          ],
          en: [
            { term: "Photon", definition: "Quantum of light energy" },
            { term: "Work Function", definition: "Minimum energy for electron emission" },
            { term: "Threshold Frequency", definition: "Minimum frequency for electron emission" }
          ]
        },
        formulas: {
          ar: [{ formula: "E = h × f", explanation: "طاقة الفوتون" }],
          en: [{ formula: "E = h × f", explanation: "Photon energy" }]
        },
        examples: {
          ar: [{ question: "فوتون تردده 5×10¹⁴Hz على معدن دالة شغله 2eV. هل تنبعث إلكترونات؟", solution: "نعم، طاقة الفوتون ≈ 2.07eV > 2eV", steps: ["1. E = hf", "2. E ≈ 2.07eV", "3. 2.07 > 2 نعم"] }],
          en: [{ question: "Photon frequency 5×10¹⁴Hz on metal with work function 2eV. Will electrons emit?", solution: "Yes, photon energy ≈ 2.07eV > 2eV", steps: ["1. E = hf", "2. E ≈ 2.07eV", "3. 2.07 > 2 yes"] }]
        },
        questions: {
          ar: [
            { question: "ما وحدة ثابت بلانك؟", options: ["J.s", "J/m", "J/Hz", "N.m"], answer: "0", points: 2 }
          ],
          en: [
            { question: "What is Planck's constant unit?", options: ["J.s", "J/m", "J/Hz", "N.m"], answer: "0", points: 2 }
          ]
        }
      }
    ]
  }
];

const thirdYearChemistryLessons = [
  {
    unitSlug: "chemistry-3-math-organic-3-math",
    lessons: [
      {
        titleAr: "الهيدروكربونات",
        titleEn: "Hydrocarbons",
        slug: "hydrocarbons-third-year",
        descriptionAr: "دراسة الهيدروكربونات وأنواعها",
        descriptionEn: "Study of hydrocarbons and their types",
        duration: 55,
        order: 1,
        isFree: true,
        introductionAr: "الهيدروكربونات مركبات من الكربون والهيدروجين فقط. تنقسم إلى أليفاتية (ألكانات، ألكينات، ألكاينات) وعطرية.",
        introductionEn: "Hydrocarbons are compounds of carbon and hydrogen only. Divided into aliphatic (alkanes, alkenes, alkynes) and aromatic.",
        summaryAr: "ألكانات: CₙH₂ₙ₊₂، ألكينات: CₙH₂ₙ، ألكاينات: CₙH₂ₙ₋₂.",
        summaryEn: "Alkanes: CₙH₂ₙ₊₂, Alkenes: CₙH₂ₙ, Alkynes: CₙH₂ₙ₋₂.",
        objectives: {
          ar: ["فهم تعريف الهيدروكربونات", "التمييز بين الأنواع", "فهم الصيغ العامة", "كتابة الأسماء"],
          en: ["Understand hydrocarbons definition", "Distinguish between types", "Understand general formulas", "Write names"]
        },
        concepts: {
          ar: [
            { term: "الألكانات", definition: "هيدروكربونات مشبعة CₙH₂ₙ₊₂" },
            { term: "الألكينات", definition: "هيدروكربونات برابطة مزدوجة CₙH₂ₙ" },
            { term: "الألكاينات", definition: "هيدروكربونات برابطة ثلاثية CₙH₂ₙ₋₂" }
          ],
          en: [
            { term: "Alkanes", definition: "Saturated hydrocarbons CₙH₂ₙ₊₂" },
            { term: "Alkenes", definition: "Hydrocarbons with double bond CₙH₂ₙ" },
            { term: "Alkynes", definition: "Hydrocarbons with triple bond CₙH₂ₙ₋₂" }
          ]
        },
        formulas: {
          ar: [{ formula: "CₙH₂ₙ₊₂", explanation: "صيغة الألكانات" }],
          en: [{ formula: "CₙH₂ₙ₊₂", explanation: "Alkanes formula" }]
        },
        examples: {
          ar: [{ question: "صيغة الهكسان (n=6)؟", solution: "C₆H₁₄", steps: ["1. ألكان: CₙH₂ₙ₊₂", "2. n=6", "3. H = 2(6)+2 = 14", "4. C₆H₁₄"] }],
          en: [{ question: "Formula of hexane (n=6)?", solution: "C₆H₁₄", steps: ["1. Alkane: CₙH₂ₙ₊₂", "2. n=6", "3. H = 2(6)+2 = 14", "4. C₆H₁₄"] }]
        },
        questions: {
          ar: [
            { question: "نوع الرابطة في الألكينات؟", options: ["مفردة", "مزدوجة", "ثلاثية", "لا روابط"], answer: "1", points: 2 }
          ],
          en: [
            { question: "Bond type in alkenes?", options: ["Single", "Double", "Triple", "No bonds"], answer: "1", points: 2 }
          ]
        }
      }
    ]
  }
];

const thirdYearMathLessons = [
  {
    unitSlug: "mathematics-3-differentiation-3",
    lessons: [
      {
        titleAr: "الاشتقاق",
        titleEn: "Differentiation",
        slug: "differentiation-third-year",
        descriptionAr: "دراسة مفهوم المشتقة وتطبيقاتها",
        descriptionEn: "Study of derivative concept and applications",
        duration: 60,
        order: 1,
        isFree: true,
        introductionAr: "الاشتقاق هو عملية إيجاد معدل التغير اللحظي لدالة. المشتقة تعبر عن سرعة تغير الدالة.",
        introductionEn: "Differentiation is finding the instantaneous rate of change. The derivative expresses the rate of change of a function.",
        summaryAr: "(xⁿ)' = nxⁿ⁻¹، (sin x)' = cos x، (eˣ)' = eˣ.",
        summaryEn: "(xⁿ)' = nxⁿ⁻¹, (sin x)' = cos x, (eˣ)' = eˣ.",
        objectives: {
          ar: ["فهم المشتقة", "تطبيق قواعد الاشتقاق", "إيجاد مشتقات الدوال", "تطبيقات في القيم العظمى"],
          en: ["Understand derivative", "Apply differentiation rules", "Find function derivatives", "Applications in max/min values"]
        },
        concepts: {
          ar: [
            { term: "المشتقة", definition: "معدل التغير اللحظي" },
            { term: "السرعة اللحظية", definition: "مشتقة الإزاحة" },
            { term: "التسارع", definition: "مشتقة السرعة" }
          ],
          en: [
            { term: "Derivative", definition: "Instantaneous rate of change" },
            { term: "Instantaneous Velocity", definition: "Derivative of displacement" },
            { term: "Acceleration", definition: "Derivative of velocity" }
          ]
        },
        formulas: {
          ar: [{ formula: "(xⁿ)' = n xⁿ⁻¹", explanation: "قاعدة الاشتقاق للدوال الأسية" }],
          en: [{ formula: "(xⁿ)' = n xⁿ⁻¹", explanation: "Differentiation rule for power functions" }]
        },
        examples: {
          ar: [{ question: "أوجد مشتقة f(x) = x³ + 2x² - 5x + 1", solution: "f'(x) = 3x² + 4x - 5", steps: ["1. (x³)' = 3x²", "2. (2x²)' = 4x", "3. (-5x)' = -5", "4. (1)' = 0"] }],
          en: [{ question: "Find derivative of f(x) = x³ + 2x² - 5x + 1", solution: "f'(x) = 3x² + 4x - 5", steps: ["1. (x³)' = 3x²", "2. (2x²)' = 4x", "3. (-5x)' = -5", "4. (1)' = 0"] }]
        },
        questions: {
          ar: [
            { question: "ما مشتقة x⁴؟", options: ["4x³", "x³", "4x", "4x⁵"], answer: "0", points: 2 }
          ],
          en: [
            { question: "What is derivative of x⁴?", options: ["4x³", "x³", "4x", "4x⁵"], answer: "0", points: 2 }
          ]
        }
      }
    ]
  }
];

// ==================== دالة الإضافة الرئيسية ====================

async function seedLessonsForYear(yearCode: string, lessonsData: any[]) {
  let lessonsCount = 0;
  let questionsCount = 0;
  let conceptsCount = 0;
  let formulasCount = 0;

  for (const unitData of lessonsData) {
    // البحث عن الوحدة
    const units = await db.unit.findMany({
      where: {
        slug: {
          contains: unitData.unitSlug
        }
      }
    });

    if (!units || units.length === 0) {
      console.log(`Unit not found: ${unitData.unitSlug}`);
      continue;
    }

    const unit = units[0];

    for (const lessonData of unitData.lessons) {
      // التحقق من عدم وجود الدرس مسبقاً
      const existingLesson = await db.lesson.findUnique({
        where: { slug: lessonData.slug }
      });

      if (existingLesson) {
        console.log(`Lesson already exists: ${lessonData.slug}`);
        continue;
      }

      // إنشاء الدرس
      const lesson = await db.lesson.create({
        data: {
          unitId: unit.id,
          titleAr: lessonData.titleAr,
          titleEn: lessonData.titleEn,
          slug: lessonData.slug,
          descriptionAr: lessonData.descriptionAr,
          descriptionEn: lessonData.descriptionEn,
          duration: lessonData.duration,
          order: lessonData.order,
          isFree: lessonData.isFree,
          introductionAr: lessonData.introductionAr,
          introductionEn: lessonData.introductionEn,
          summaryAr: lessonData.summaryAr,
          summaryEn: lessonData.summaryEn,
        }
      });

      lessonsCount++;

      // إضافة الأهداف
      for (let i = 0; i < lessonData.objectives.ar.length; i++) {
        await db.objective.create({
          data: {
            lessonId: lesson.id,
            textAr: lessonData.objectives.ar[i],
            textEn: lessonData.objectives.en[i],
            order: i + 1
          }
        });
      }

      // إضافة المفاهيم
      for (let i = 0; i < lessonData.concepts.ar.length; i++) {
        await db.concept.create({
          data: {
            lessonId: lesson.id,
            termAr: lessonData.concepts.ar[i].term,
            termEn: lessonData.concepts.en[i].term,
            definitionAr: lessonData.concepts.ar[i].definition,
            definitionEn: lessonData.concepts.en[i].definition,
            order: i + 1
          }
        });
        conceptsCount++;
      }

      // إضافة المعادلات
      for (let i = 0; i < lessonData.formulas.ar.length; i++) {
        await db.formula.create({
          data: {
            lessonId: lesson.id,
            formula: lessonData.formulas.ar[i].formula,
            explanationAr: lessonData.formulas.ar[i].explanation,
            explanationEn: lessonData.formulas.en[i].explanation,
            order: i + 1
          }
        });
        formulasCount++;
      }

      // إضافة الأمثلة
      if (lessonData.examples && lessonData.examples.ar) {
        for (let i = 0; i < lessonData.examples.ar.length; i++) {
          await db.example.create({
            data: {
              lessonId: lesson.id,
              questionAr: lessonData.examples.ar[i].question,
              questionEn: lessonData.examples.en[i].question,
              solutionAr: lessonData.examples.ar[i].solution,
              solutionEn: lessonData.examples.en[i].solution,
              stepsAr: JSON.stringify(lessonData.examples.ar[i].steps),
              stepsEn: JSON.stringify(lessonData.examples.en[i].steps),
              order: i + 1
            }
          });
        }
      }

      // إضافة الأسئلة
      for (let i = 0; i < lessonData.questions.ar.length; i++) {
        await db.question.create({
          data: {
            lessonId: lesson.id,
            type: "mcq",
            questionAr: lessonData.questions.ar[i].question,
            questionEn: lessonData.questions.en[i].question,
            optionsAr: JSON.stringify(lessonData.questions.ar[i].options),
            optionsEn: JSON.stringify(lessonData.questions.en[i].options),
            answer: lessonData.questions.ar[i].answer,
            points: lessonData.questions.ar[i].points,
            difficulty: lessonData.questions.ar[i].points > 2 ? "hard" : "medium",
            order: i + 1
          }
        });
        questionsCount++;
      }

      console.log(`Created lesson: ${lessonData.titleAr}`);
    }
  }

  return { lessonsCount, questionsCount, conceptsCount, formulasCount };
}

// ==================== API Endpoint ====================

export async function GET() {
  try {
    console.log("Starting comprehensive lesson seeding...");

    // حذف الدروس القديمة
    await db.question.deleteMany({});
    await db.example.deleteMany({});
    await db.formula.deleteMany({});
    await db.concept.deleteMany({});
    await db.objective.deleteMany({});
    await db.lessonSimulator.deleteMany({});
    await db.lesson.deleteMany({});
    console.log("Old lessons cleaned.");

    let totalLessons = 0;
    let totalQuestions = 0;
    let totalConcepts = 0;
    let totalFormulas = 0;

    // إضافة دروس الصف الأول الثانوي
    console.log("\n=== Seeding First Year Lessons ===");
    const firstYearResult = await seedLessonsForYear("first-year", [
      ...firstYearPhysicsLessons,
      ...firstYearMathLessons,
      ...firstYearChemistryLessons
    ]);
    totalLessons += firstYearResult.lessonsCount;
    totalQuestions += firstYearResult.questionsCount;
    totalConcepts += firstYearResult.conceptsCount;
    totalFormulas += firstYearResult.formulasCount;

    // إضافة دروس الصف الثاني الثانوي
    console.log("\n=== Seeding Second Year Lessons ===");
    const secondYearResult = await seedLessonsForYear("second-year", [
      ...secondYearPhysicsLessons,
      ...secondYearChemistryLessons,
      ...secondYearMathLessons
    ]);
    totalLessons += secondYearResult.lessonsCount;
    totalQuestions += secondYearResult.questionsCount;
    totalConcepts += secondYearResult.conceptsCount;
    totalFormulas += secondYearResult.formulasCount;

    // إضافة دروس الصف الثالث الثانوي
    console.log("\n=== Seeding Third Year Lessons ===");
    const thirdYearResult = await seedLessonsForYear("third-year", [
      ...thirdYearPhysicsLessons,
      ...thirdYearChemistryLessons,
      ...thirdYearMathLessons
    ]);
    totalLessons += thirdYearResult.lessonsCount;
    totalQuestions += thirdYearResult.questionsCount;
    totalConcepts += thirdYearResult.conceptsCount;
    totalFormulas += thirdYearResult.formulasCount;

    console.log("\n=== Seeding Complete ===");

    return NextResponse.json({
      success: true,
      message: "تم إضافة جميع الدروس بنجاح",
      stats: {
        lessons: totalLessons,
        questions: totalQuestions,
        concepts: totalConcepts,
        formulas: totalFormulas
      }
    });
  } catch (error) {
    console.error("Error seeding lessons:", error);
    return NextResponse.json(
      { error: "Failed to seed lessons", details: String(error) },
      { status: 500 }
    );
  }
}
