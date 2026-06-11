// بيانات الدروس الكاملة

export interface LessonContent {
  id: string;
  titleAr: string;
  titleEn: string;
  subject: "physics" | "math" | "chemistry";
  unit: string;
  unitAr: string;
  unitEn: string;
  duration: number;
  isFree: boolean;
  order: number;
  
  // المحتوى
  objectives: {
    ar: string[];
    en: string[];
  };
  
  introduction: {
    ar: string;
    en: string;
  };
  
  keyConcepts: {
    ar: { term: string; definition: string }[];
    en: { term: string; definition: string }[];
  };
  
  formulas: {
    ar: { formula: string; explanation: string }[];
    en: { formula: string; explanation: string }[];
  };
  
  examples: {
    ar: { question: string; solution: string; steps: string[] }[];
    en: { question: string; solution: string; steps: string[] }[];
  };
  
  // المحاكيات المرتبطة
  simulators: string[];
  
  // الملخص
  summary: {
    ar: string;
    en: string;
  };
}

export const lessonsData: LessonContent[] = [
  // ==================== الفيزياء - الميكانيكا ====================
  {
    id: "motion-intro",
    titleAr: "مقدمة في الحركة",
    titleEn: "Introduction to Motion",
    subject: "physics",
    unit: "mechanics",
    unitAr: "الميكانيكا",
    unitEn: "Mechanics",
    duration: 15,
    isFree: true,
    order: 1,
    
    objectives: {
      ar: [
        "فهم مفهوم الحركة وأنواعها",
        "التمييز بين الموضع والإزاحة",
        "حساب السرعة المتوسطة واللحظية",
        "فهم مفهوم التسارع"
      ],
      en: [
        "Understand the concept of motion and its types",
        "Distinguish between position and displacement",
        "Calculate average and instantaneous velocity",
        "Understand the concept of acceleration"
      ]
    },
    
    introduction: {
      ar: `الحركة هي تغير موضع الجسم بالنسبة لنقطة مرجعية معينة بمرور الزمن. الحركة نسبية، أي أنها تعتمد على المرجع الذي نختاره لوصف الحركة.

**أنواع الحركة:**
1. **حركة انتقالية**: يتحرك الجسم من موضع لآخر
2. **حركة دورانية**: يدور الجسم حول محور  
3. **حركة اهتزازية**: يهتز الجسم حول موضع سكون

**الكميات الفيزيائية الأساسية:**
- **الموضع**: موقع الجسم بالنسبة للمرجع
- **الإزاحة**: التغير في الموضع (كمية متجهة)
- **المسافة**: طول المسار الفعلي (كمية قياسية)`,
      en: `Motion is the change in an object's position relative to a reference point over time. Motion is relative, meaning it depends on the reference we choose.

**Types of Motion:**
1. **Translational motion**: Object moves from one position to another
2. **Rotational motion**: Object rotates around an axis
3. **Vibrational motion**: Object vibrates around equilibrium

**Basic Physical Quantities:**
- **Position**: Object's location relative to reference
- **Displacement**: Change in position (vector quantity)
- **Distance**: Actual path length (scalar quantity)`
    },
    
    keyConcepts: {
      ar: [
        { term: "المرجع", definition: "نقطة ثابتة نحدد منها موضع الأجسام" },
        { term: "الموضع", definition: "موقع الجسم بالنسبة للمرجع في لحظة معينة" },
        { term: "الإزاحة", definition: "التغير في موضع الجسم، وهي كمية متجهة" },
        { term: "السرعة", definition: "معدل تغير الإزاحة بالنسبة للزمن" },
        { term: "التسارع", definition: "معدل تغير السرعة بالنسبة للزمن" }
      ],
      en: [
        { term: "Reference", definition: "A fixed point to determine object positions" },
        { term: "Position", definition: "Object's location relative to reference at a specific instant" },
        { term: "Displacement", definition: "Change in object's position, a vector quantity" },
        { term: "Velocity", definition: "Rate of change of displacement with respect to time" },
        { term: "Acceleration", definition: "Rate of change of velocity with respect to time" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "Δx = x₂ - x₁", explanation: "الإزاحة = الموضع النهائي - الموضع الابتدائي" },
        { formula: "v = Δx / Δt", explanation: "السرعة المتوسطة = الإزاحة ÷ الزمن" },
        { formula: "a = Δv / Δt", explanation: "التسارع = التغير في السرعة ÷ الزمن" }
      ],
      en: [
        { formula: "Δx = x₂ - x₁", explanation: "Displacement = Final position - Initial position" },
        { formula: "v = Δx / Δt", explanation: "Average velocity = Displacement ÷ Time" },
        { formula: "a = Δv / Δt", explanation: "Acceleration = Change in velocity ÷ Time" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "سيارة تتحرك من الموضع 10م إلى الموضع 50م في زمن قدره 5 ثوانٍ. احسب الإزاحة والسرعة المتوسطة.",
          solution: "الإزاحة = 40م، السرعة المتوسطة = 8 م/ث",
          steps: ["الإزاحة = x₂ - x₁ = 50 - 10 = 40 م", "السرعة المتوسطة = Δx / Δt = 40 / 5 = 8 م/ث"]
        }
      ],
      en: [
        {
          question: "A car moves from position 10m to position 50m in 5 seconds. Calculate displacement and average velocity.",
          solution: "Displacement = 40m, Average velocity = 8 m/s",
          steps: ["Displacement = x₂ - x₁ = 50 - 10 = 40 m", "Average velocity = Δx / Δt = 40 / 5 = 8 m/s"]
        }
      ]
    },
    
    simulators: ["motion"],
    
    summary: {
      ar: "الحركة هي تغير الموضع بمرور الزمن. الإزاحة كمية متجهة تمثل التغير في الموضع، بينما المسافة كمية قياسية.",
      en: "Motion is change in position over time. Displacement is a vector quantity representing change in position, while distance is scalar."
    }
  },
  
  {
    id: "velocity-acceleration",
    titleAr: "السرعة والتسارع",
    titleEn: "Velocity and Acceleration",
    subject: "physics",
    unit: "mechanics",
    unitAr: "الميكانيكا",
    unitEn: "Mechanics",
    duration: 20,
    isFree: true,
    order: 2,
    
    objectives: {
      ar: ["التمييز بين السرعة المتوسطة والسرعة اللحظية", "فهم مفهوم التسارع وأنواعه", "حساب التسارع من بيانات السرعة"],
      en: ["Distinguish between average and instantaneous velocity", "Understand acceleration and its types", "Calculate acceleration from velocity data"]
    },
    
    introduction: {
      ar: `**السرعة (Velocity):**
السرعة هي كمية متجهة تصف معدل تغير الموضع مع الزمن.

أنواع السرعة:
- **السرعة المتوسطة**: إجمالي الإزاحة مقسوماً على إجمالي الزمن
- **السرعة اللحظية**: السرعة في لحظة معينة

**التسارع (Acceleration):**
التسارع هو معدل تغير السرعة مع الزمن.

أنواع التسارع:
- **تسارع موجب**: زيادة السرعة (تسريع)
- **تسارع سالب**: نقص السرعة (تباطؤ)
- **تسارع منتظم**: ثابت القيمة والاتجاه`,
      en: `**Velocity:**
Velocity is a vector quantity describing rate of change of position.

Types:
- **Average velocity**: Total displacement ÷ Total time
- **Instantaneous velocity**: Velocity at a specific instant

**Acceleration:**
Acceleration is rate of change of velocity.

Types:
- **Positive acceleration**: Increase in velocity
- **Negative acceleration**: Decrease in velocity
- **Uniform acceleration**: Constant in magnitude and direction`
    },
    
    keyConcepts: {
      ar: [
        { term: "السرعة المتوسطة", definition: "إجمالي الإزاحة ÷ إجمالي الزمن" },
        { term: "السرعة اللحظية", definition: "السرعة في لحظة محددة جداً" },
        { term: "التسارع المنتظم", definition: "تسارع ثابت القيمة والاتجاه" },
        { term: "التباطؤ", definition: "تسارع سالب يؤدي لنقص السرعة" }
      ],
      en: [
        { term: "Average Velocity", definition: "Total displacement ÷ Total time" },
        { term: "Instantaneous Velocity", definition: "Velocity at a very specific instant" },
        { term: "Uniform Acceleration", definition: "Acceleration constant in magnitude and direction" },
        { term: "Deceleration", definition: "Negative acceleration causing velocity decrease" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "v̅ = Δx / Δt", explanation: "السرعة المتوسطة" },
        { formula: "v = dx/dt", explanation: "السرعة اللحظية" },
        { formula: "a = Δv / Δt", explanation: "التسارع المتوسط" }
      ],
      en: [
        { formula: "v̅ = Δx / Δt", explanation: "Average Velocity" },
        { formula: "v = dx/dt", explanation: "Instantaneous Velocity" },
        { formula: "a = Δv / Δt", explanation: "Average Acceleration" }
      ]
    },
    
    examples: {
      ar: [{
        question: "سيارة تتحرك بسرعة 20 م/ث، ثم تزيد سرعتها إلى 30 م/ث خلال 5 ثوانٍ. احسب التسارع.",
        solution: "التسارع = 2 م/ث²",
        steps: ["Δv = 30 - 20 = 10 م/ث", "a = Δv / Δt = 10 / 5 = 2 م/ث²"]
      }],
      en: [{
        question: "A car moving at 20 m/s increases to 30 m/s in 5 seconds. Calculate acceleration.",
        solution: "Acceleration = 2 m/s²",
        steps: ["Δv = 30 - 20 = 10 m/s", "a = Δv / Δt = 10 / 5 = 2 m/s²"]
      }]
    },
    
    simulators: ["motion"],
    
    summary: {
      ar: "السرعة كمية متجهة تقاس بوحدة م/ث. التسارع هو معدل تغير السرعة ويقاس بوحدة م/ث².",
      en: "Velocity is a vector quantity measured in m/s. Acceleration is rate of change of velocity measured in m/s²."
    }
  },
  
  {
    id: "equations-motion",
    titleAr: "معادلات الحركة",
    titleEn: "Equations of Motion",
    subject: "physics",
    unit: "mechanics",
    unitAr: "الميكانيكا",
    unitEn: "Mechanics",
    duration: 25,
    isFree: false,
    order: 3,
    
    objectives: {
      ar: ["استنتاج معادلات الحركة بتسارع منتظم", "تطبيق المعادلات على مسائل الحركة"],
      en: ["Derive equations of motion with uniform acceleration", "Apply equations to motion problems"]
    },
    
    introduction: {
      ar: `**معادلات الحركة بتسارع منتظم:**

تُستخدم هذه المعادلات عندما يكون التسارع ثابتاً.

**المتغيرات:**
- v₀ = السرعة الابتدائية
- v = السرعة النهائية
- a = التسارع
- t = الزمن
- Δx = الإزاحة`,
      en: `**Equations of Motion with Uniform Acceleration:**

Used when acceleration is constant.

**Variables:**
- v₀ = Initial velocity
- v = Final velocity
- a = Acceleration
- t = Time
- Δx = Displacement`
    },
    
    keyConcepts: {
      ar: [
        { term: "الحركة بتسارع منتظم", definition: "حركة يكون فيها التسارع ثابتاً" },
        { term: "معادلات الحركة", definition: "علاقات رياضية تربط السرعة والتسارع والزمن والإزاحة" }
      ],
      en: [
        { term: "Uniformly Accelerated Motion", definition: "Motion with constant acceleration" },
        { term: "Equations of Motion", definition: "Mathematical relations connecting velocity, acceleration, time, displacement" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "v = v₀ + at", explanation: "السرعة النهائية" },
        { formula: "Δx = v₀t + ½at²", explanation: "الإزاحة" },
        { formula: "v² = v₀² + 2aΔx", explanation: "مربع السرعة النهائية" }
      ],
      en: [
        { formula: "v = v₀ + at", explanation: "Final velocity" },
        { formula: "Δx = v₀t + ½at²", explanation: "Displacement" },
        { formula: "v² = v₀² + 2aΔx", explanation: "Final velocity squared" }
      ]
    },
    
    examples: {
      ar: [{
        question: "سيارة تنطلق من السكون بتسارع 4 م/ث². احسب سرعتها بعد 5 ثوانٍ والمسافة المقطوعة.",
        solution: "السرعة = 20 م/ث، المسافة = 50 م",
        steps: ["v = v₀ + at = 0 + 4×5 = 20 م/ث", "Δx = v₀t + ½at² = 0 + ½×4×25 = 50 م"]
      }],
      en: [{
        question: "A car starts from rest with acceleration 4 m/s². Calculate velocity after 5 seconds and distance.",
        solution: "Velocity = 20 m/s, Distance = 50 m",
        steps: ["v = v₀ + at = 0 + 4×5 = 20 m/s", "Δx = v₀t + ½at² = 0 + ½×4×25 = 50 m"]
      }]
    },
    
    simulators: ["motion", "freeFall"],
    
    summary: {
      ar: "معادلات الحركة الثلاث تربط بين السرعة والتسارع والزمن والإزاحة.",
      en: "The three equations of motion connect velocity, acceleration, time, and displacement."
    }
  },
  
  {
    id: "free-fall",
    titleAr: "السقوط الحر",
    titleEn: "Free Fall",
    subject: "physics",
    unit: "mechanics",
    unitAr: "الميكانيكا",
    unitEn: "Mechanics",
    duration: 15,
    isFree: false,
    order: 4,
    
    objectives: {
      ar: ["فهم مفهوم السقوط الحر", "حساب زمن السقوط وسرعة الاصطدام"],
      en: ["Understand free fall concept", "Calculate fall time and impact velocity"]
    },
    
    introduction: {
      ar: `**السقوط الحر:**
هو حركة جسم تحت تأثير الجاذبية فقط.

**خصائص السقوط الحر:**
- التسارع ثابت = g = 9.8 م/ث²
- الحركة بتسارع منتظم
- جميع الأجسام تسقط بنفس التسارع`,
      en: `**Free Fall:**
Motion of a body under gravity only.

**Characteristics:**
- Acceleration is constant = g = 9.8 m/s²
- Uniformly accelerated motion
- All objects fall with same acceleration`
    },
    
    keyConcepts: {
      ar: [
        { term: "السقوط الحر", definition: "حركة جسم بتأثير الجاذبية فقط" },
        { term: "تسارع الجاذبية (g)", definition: "تسارع ثابت = 9.8 م/ث² على سطح الأرض" }
      ],
      en: [
        { term: "Free Fall", definition: "Motion under gravity only" },
        { term: "Gravitational Acceleration (g)", definition: "Constant acceleration = 9.8 m/s²" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "v = gt", explanation: "سرعة السقوط" },
        { formula: "h = ½gt²", explanation: "الارتفاع من السكون" },
        { formula: "v² = 2gh", explanation: "سرعة الاصطدام" }
      ],
      en: [
        { formula: "v = gt", explanation: "Fall velocity" },
        { formula: "h = ½gt²", explanation: "Height from rest" },
        { formula: "v² = 2gh", explanation: "Impact velocity" }
      ]
    },
    
    examples: {
      ar: [{
        question: "كرة تسقط من ارتفاع 45م. احسب زمن السقوط وسرعة الاصطدام.",
        solution: "الزمن ≈ 3 ث، السرعة ≈ 29.7 م/ث",
        steps: ["t = √(2h/g) = √(2×45/9.8) ≈ 3 ث", "v = gt = 9.8 × 3 ≈ 29.7 م/ث"]
      }],
      en: [{
        question: "A ball falls from 45m height. Calculate fall time and impact velocity.",
        solution: "Time ≈ 3 s, Velocity ≈ 29.7 m/s",
        steps: ["t = √(2h/g) = √(2×45/9.8) ≈ 3 s", "v = gt = 9.8 × 3 ≈ 29.7 m/s"]
      }]
    },
    
    simulators: ["freeFall"],
    
    summary: {
      ar: "السقوط الحر حركة بتسارع منتظم g = 9.8 م/ث².",
      en: "Free fall is motion with uniform acceleration g = 9.8 m/s²."
    }
  },
  
  // ==================== الفيزياء - القوى ====================
  {
    id: "forces-intro",
    titleAr: "مقدمة في القوى",
    titleEn: "Introduction to Forces",
    subject: "physics",
    unit: "forces",
    unitAr: "القوى",
    unitEn: "Forces",
    duration: 18,
    isFree: false,
    order: 5,
    
    objectives: {
      ar: ["فهم مفهوم القوة ووحدتها", "التعرف على أنواع القوى"],
      en: ["Understand force concept and unit", "Identify types of forces"]
    },
    
    introduction: {
      ar: `**القوة (Force):**
القوة هي مؤثر خارجي يعمل على تغيير حالة الجسم الحركية.

**وحدة القوة:**
النيوتن (N) = كجم × م/ث²

**أنواع القوى:**
1. **قوى تماس**: تحتاج لملامسة (الدفع، الشد، الاحتكاك)
2. **قوى المجال**: لا تحتاج لملامسة (الجاذبية، المغناطيسية)`,
      en: `**Force:**
External influence that changes body's motion state.

**Unit:**
Newton (N) = kg × m/s²

**Types:**
1. **Contact forces**: Require contact (push, pull, friction)
2. **Field forces**: Don't require contact (gravity, magnetic)`
    },
    
    keyConcepts: {
      ar: [
        { term: "القوة", definition: "مؤثر خارجي يغير حالة الجسم الحركية" },
        { term: "النيوتن", definition: "وحدة قياس القوة = كجم.م/ث²" }
      ],
      en: [
        { term: "Force", definition: "External influence changing body's motion" },
        { term: "Newton", definition: "Unit of force = kg.m/s²" }
      ]
    },
    
    formulas: {
      ar: [{ formula: "F = ma", explanation: "القوة = الكتلة × التسارع" }],
      en: [{ formula: "F = ma", explanation: "Force = Mass × Acceleration" }]
    },
    
    examples: {
      ar: [{
        question: "احسب القوة اللازمة لإعطاء جسم كتلته 5 كجم تسارعاً 3 م/ث².",
        solution: "القوة = 15 نيوتن",
        steps: ["F = ma = 5 × 3 = 15 N"]
      }],
      en: [{
        question: "Calculate force needed to give 5 kg object acceleration of 3 m/s².",
        solution: "Force = 15 Newtons",
        steps: ["F = ma = 5 × 3 = 15 N"]
      }]
    },
    
    simulators: ["forces"],
    
    summary: {
      ar: "القوة كمية متجهة لها مقدار واتجاه. وحدتها النيوتن.",
      en: "Force is a vector quantity with magnitude and direction. Unit is Newton."
    }
  },
  
  {
    id: "newton-laws",
    titleAr: "قوانين نيوتن",
    titleEn: "Newton's Laws",
    subject: "physics",
    unit: "forces",
    unitAr: "القوى",
    unitEn: "Forces",
    duration: 25,
    isFree: false,
    order: 6,
    
    objectives: {
      ar: ["فهم قوانين نيوتن الثلاثة"],
      en: ["Understand Newton's three laws"]
    },
    
    introduction: {
      ar: `**قوانين نيوتن الثلاثة:**

**القانون الأول - القصور الذاتي:**
"الجسم الساكن يبقى ساكناً، والمتحرك يبقى متحركاً ما لم تؤثر عليه قوة."

**القانون الثاني:**
"القوة المحصلة = الكتلة × التسارع"  →  F = ma

**القانون الثالث:**
"لكل فعل رد فعل مساوٍ في المقدار ومعاكس في الاتجاه."`,
      en: `**Newton's Three Laws:**

**First Law - Inertia:**
"A body at rest stays at rest, a body in motion stays in motion unless acted upon by a force."

**Second Law:**
"Net force = Mass × Acceleration"  →  F = ma

**Third Law:**
"For every action, there is an equal and opposite reaction."`
    },
    
    keyConcepts: {
      ar: [
        { term: "القصور الذاتي", definition: "مقاومة الجسم لتغيير حالته الحركية" },
        { term: "الفعل ورد الفعل", definition: "قوتان متساويتان ومتعاكستان" }
      ],
      en: [
        { term: "Inertia", definition: "Body's resistance to change in motion" },
        { term: "Action-Reaction", definition: "Two equal and opposite forces" }
      ]
    },
    
    formulas: {
      ar: [{ formula: "F = ma", explanation: "القانون الثاني لنيوتن" }],
      en: [{ formula: "F = ma", explanation: "Newton's Second Law" }]
    },
    
    examples: {
      ar: [{
        question: "رجل يدفع صندوق كتلته 20 كجم بقوة 40 نيوتن. احسب التسارع.",
        solution: "التسارع = 2 م/ث²",
        steps: ["a = F/m = 40/20 = 2 م/ث²"]
      }],
      en: [{
        question: "A man pushes a 20 kg box with 40 N force. Calculate acceleration.",
        solution: "Acceleration = 2 m/s²",
        steps: ["a = F/m = 40/20 = 2 m/s²"]
      }]
    },
    
    simulators: ["forces"],
    
    summary: {
      ar: "قوانين نيوتن أساس الميكانيكا الكلاسيكية.",
      en: "Newton's laws are foundation of classical mechanics."
    }
  },
  
  // ==================== الفيزياء - الطاقة ====================
  {
    id: "energy-intro",
    titleAr: "مقدمة في الطاقة",
    titleEn: "Introduction to Energy",
    subject: "physics",
    unit: "energy",
    unitAr: "الطاقة",
    unitEn: "Energy",
    duration: 15,
    isFree: false,
    order: 8,
    
    objectives: {
      ar: ["فهم مفهوم الطاقة وأنواعها", "فهم قانون حفظ الطاقة"],
      en: ["Understand energy concept and types", "Understand conservation of energy"]
    },
    
    introduction: {
      ar: `**الطاقة (Energy):**
الطاقة هي القدرة على بذل شغل. وهي كمية قياسية.

**وحدة الطاقة:** الجول (J)

**أنواع الطاقة:**
1. **طاقة حركية (KE)**: بسبب الحركة = ½mv²
2. **طاقة كامنة (PE)**: مخزنة = mgh

**قانون حفظ الطاقة:**
"الطاقة لا تُخلق ولا تُفنى، وإنما تتحول من شكل لآخر."`,
      en: `**Energy:**
Ability to do work. Scalar quantity.

**Unit:** Joule (J)

**Types:**
1. **Kinetic Energy (KE)**: Due to motion = ½mv²
2. **Potential Energy (PE)**: Stored = mgh

**Conservation of Energy:**
"Energy cannot be created or destroyed, only transformed."`
    },
    
    keyConcepts: {
      ar: [
        { term: "الطاقة الحركية", definition: "طاقة بسبب الحركة = ½mv²" },
        { term: "الطاقة الكامنة", definition: "طاقة مخزنة = mgh" }
      ],
      en: [
        { term: "Kinetic Energy", definition: "Energy due to motion = ½mv²" },
        { term: "Potential Energy", definition: "Stored energy = mgh" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "KE = ½mv²", explanation: "الطاقة الحركية" },
        { formula: "PE = mgh", explanation: "الطاقة الكامنة" }
      ],
      en: [
        { formula: "KE = ½mv²", explanation: "Kinetic Energy" },
        { formula: "PE = mgh", explanation: "Potential Energy" }
      ]
    },
    
    examples: {
      ar: [{
        question: "سيارة كتلتها 1000 كجم تتحرك بسرعة 20 م/ث. احسب طاقتها الحركية.",
        solution: "الطاقة = 200,000 جول",
        steps: ["KE = ½mv² = ½ × 1000 × 400 = 200,000 J"]
      }],
      en: [{
        question: "A 1000 kg car moves at 20 m/s. Calculate kinetic energy.",
        solution: "Energy = 200,000 Joules",
        steps: ["KE = ½mv² = ½ × 1000 × 400 = 200,000 J"]
      }]
    },
    
    simulators: ["energy"],
    
    summary: {
      ar: "الطاقة القدرة على بذل شغل. الطاقة محفوظة.",
      en: "Energy is ability to do work. Energy is conserved."
    }
  },
  
  // ==================== الفيزياء - الموجات ====================
  {
    id: "wave-properties",
    titleAr: "خصائص الموجات",
    titleEn: "Wave Properties",
    subject: "physics",
    unit: "waves",
    unitAr: "الموجات",
    unitEn: "Waves",
    duration: 20,
    isFree: true,
    order: 9,
    
    objectives: {
      ar: [
        "فهم مفهوم الموجة وخصائصها الأساسية",
        "التعرف على الطول الموجي والتردد والسعة",
        "فهم العلاقة بين سرعة الموجة والتردد والطول الموجي",
        "حساب سرعة الموجة باستخدام المعادلة v = fλ"
      ],
      en: [
        "Understand the concept of wave and its basic properties",
        "Identify wavelength, frequency, and amplitude",
        "Understand the relationship between wave speed, frequency, and wavelength",
        "Calculate wave speed using the equation v = fλ"
      ]
    },
    
    introduction: {
      ar: `**الموجة (Wave):**
الموجة هي اضطراب ينتقل عبر وسط أو فراغ محملاً بالطاقة دون انتقال المادة.

**الخصائص الأساسية للموجات:**

1. **الطول الموجي (λ)**: المسافة بين نقطتين متتاليتين لهما نفس الطور، ويقاس بوحدة المتر.

2. **التردد (f)**: عدد الذبذبات في الثانية الواحدة، ويقاس بوحدة الهرتز (Hz).

3. **السعة (A)**: أقصى إزاحة عن موضع السكون.

4. **الزمن الدوري (T)**: الزمن اللازم لذبذبة واحدة، T = 1/f.

**العلاقة الأساسية:**
سرعة الموجة = التردد × الطول الموجي
v = fλ`,
      en: `**Wave:**
A wave is a disturbance that travels through a medium or space carrying energy without transferring matter.

**Basic Wave Properties:**

1. **Wavelength (λ)**: Distance between two consecutive points in phase, measured in meters.

2. **Frequency (f)**: Number of oscillations per second, measured in Hertz (Hz).

3. **Amplitude (A)**: Maximum displacement from equilibrium position.

4. **Period (T)**: Time for one complete oscillation, T = 1/f.

**Fundamental Relationship:**
Wave speed = Frequency × Wavelength
v = fλ`
    },
    
    keyConcepts: {
      ar: [
        { term: "الطول الموجي", definition: "المسافة بين نقطتين متتاليتين في نفس الطور" },
        { term: "التردد", definition: "عدد الذبذبات في الثانية الواحدة (هرتز)" },
        { term: "السعة", definition: "أقصى إزاحة عن موضع السكون" },
        { term: "الزمن الدوري", definition: "الزمن اللازم لإتمام ذبذبة واحدة" },
        { term: "سرعة الموجة", definition: "المسافة التي تقطعها الموجة في وحدة الزمن" }
      ],
      en: [
        { term: "Wavelength", definition: "Distance between two consecutive points in phase" },
        { term: "Frequency", definition: "Number of oscillations per second (Hertz)" },
        { term: "Amplitude", definition: "Maximum displacement from equilibrium" },
        { term: "Period", definition: "Time for one complete oscillation" },
        { term: "Wave Speed", definition: "Distance traveled by wave per unit time" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "v = fλ", explanation: "سرعة الموجة = التردد × الطول الموجي" },
        { formula: "T = 1/f", explanation: "الزمن الدوري = مقلوب التردد" },
        { formula: "f = 1/T", explanation: "التردد = مقلوب الزمن الدوري" }
      ],
      en: [
        { formula: "v = fλ", explanation: "Wave speed = Frequency × Wavelength" },
        { formula: "T = 1/f", explanation: "Period = Inverse of frequency" },
        { formula: "f = 1/T", explanation: "Frequency = Inverse of period" }
      ]
    },
    
    examples: {
      ar: [{
        question: "موجة لها تردد 50 هرتز وطول موجي 4 متر. احسب سرعة الموجة.",
        solution: "سرعة الموجة = 200 م/ث",
        steps: ["v = fλ = 50 × 4 = 200 م/ث"]
      },
      {
        question: "موجة تقطع مسافة 340 متر في ثانية واحدة، إذا كان ترددها 170 هرتز. احسب الطول الموجي.",
        solution: "الطول الموجي = 2 متر",
        steps: ["v = 340 م/ث (سرعة الموجة)", "λ = v/f = 340/170 = 2 م"]
      }],
      en: [{
        question: "A wave has frequency 50 Hz and wavelength 4 meters. Calculate wave speed.",
        solution: "Wave speed = 200 m/s",
        steps: ["v = fλ = 50 × 4 = 200 m/s"]
      },
      {
        question: "A wave travels 340 meters in one second with frequency 170 Hz. Calculate wavelength.",
        solution: "Wavelength = 2 meters",
        steps: ["v = 340 m/s (wave speed)", "λ = v/f = 340/170 = 2 m"]
      }]
    },
    
    simulators: ["wave"],
    
    summary: {
      ar: "الموجة اضطراب يحمل الطاقة. العلاقة الأساسية v = fλ تربط سرعة الموجة بترددها وطولها الموجي.",
      en: "A wave is a disturbance carrying energy. The fundamental relationship v = fλ connects wave speed with frequency and wavelength."
    }
  },
  
  {
    id: "transverse-longitudinal-waves",
    titleAr: "الموجات المستعرضة والطولية",
    titleEn: "Transverse and Longitudinal Waves",
    subject: "physics",
    unit: "waves",
    unitAr: "الموجات",
    unitEn: "Waves",
    duration: 18,
    isFree: true,
    order: 10,
    
    objectives: {
      ar: [
        "التمييز بين الموجات المستعرضة والطولية",
        "فهم طريقة انتشار كل نوع",
        "معرفة أمثلة من الحياة اليومية لكل نوع"
      ],
      en: [
        "Distinguish between transverse and longitudinal waves",
        "Understand how each type propagates",
        "Know real-life examples for each type"
      ]
    },
    
    introduction: {
      ar: `**الموجات المستعرضة (Transverse Waves):**
الموجات التي تهتز فيها جزيئات الوسط عمودياً على اتجاه انتشار الموجة.

**خصائصها:**
- تنتج القمم والقيعان
- اهتزاز الجزيئات ⊥ اتجاه الانتشار
- مثال: موجات الضوء، موجات الماء، موجات الوتر

**الموجات الطولية (Longitudinal Waves):**
الموجات التي تهتز فيها جزيئات الوسط في نفس اتجاه انتشار الموجة.

**خصائصها:**
- تنتج مناطق انضغاط وتخلخل
- اهتزاز الجزيئات || اتجاه الانتشار
- مثال: موجات الصوت، موجات الزنبرك

**المقارنة:**
| الخاصية | مستعرضة | طولية |
|---------|---------|-------|
| اتجاه الاهتزاز | ⊥ الانتشار | || الانتشار |
| مناطق | قمم وقيعان | انضغاط وتخلخل |`,
      en: `**Transverse Waves:**
Waves where medium particles vibrate perpendicular to wave direction.

**Characteristics:**
- Produce crests and troughs
- Particle vibration ⊥ propagation direction
- Examples: Light waves, water waves, string waves

**Longitudinal Waves:**
Waves where medium particles vibrate parallel to wave direction.

**Characteristics:**
- Produce compressions and rarefactions
- Particle vibration || propagation direction
- Examples: Sound waves, spring waves

**Comparison:**
| Property | Transverse | Longitudinal |
|----------|------------|--------------|
| Vibration direction | ⊥ Propagation | || Propagation |
| Regions | Crests and troughs | Compressions and rarefactions |`
    },
    
    keyConcepts: {
      ar: [
        { term: "الموجة المستعرضة", definition: "موجة تهتز فيها الجزيئات عمودياً على اتجاه الانتشار" },
        { term: "الموجة الطولية", definition: "موجة تهتز فيها الجزيئات في اتجاه الانتشار" },
        { term: "القمة", definition: "أعلى نقطة في الموجة المستعرضة" },
        { term: "القاع", definition: "أدنى نقطة في الموجة المستعرضة" },
        { term: "الانضغاط", definition: "منطقة تزداد فيها كثافة الجزيئات في الموجة الطولية" },
        { term: "التخلخل", definition: "منطقة تقل فيها كثافة الجزيئات في الموجة الطولية" }
      ],
      en: [
        { term: "Transverse Wave", definition: "Wave where particles vibrate perpendicular to propagation" },
        { term: "Longitudinal Wave", definition: "Wave where particles vibrate parallel to propagation" },
        { term: "Crest", definition: "Highest point in a transverse wave" },
        { term: "Trough", definition: "Lowest point in a transverse wave" },
        { term: "Compression", definition: "Region of increased particle density in longitudinal wave" },
        { term: "Rarefaction", definition: "Region of decreased particle density in longitudinal wave" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "v = fλ", explanation: "تنطبق على النوعين" }
      ],
      en: [
        { formula: "v = fλ", explanation: "Applies to both types" }
      ]
    },
    
    examples: {
      ar: [{
        question: "صنّف الموجات التالية إلى مستعرضة وطولية: موجات الصوت، موجات الضوء، موجات الماء، موجات الزنبرك.",
        solution: "مستعرضة: الضوء، الماء | طولية: الصوت، الزنبرك",
        steps: [
          "موجات الصوت: طولية (اهتزاز || انتشار)",
          "موجات الضوء: مستعرضة (اهتزاز ⊥ انتشار)",
          "موجات الماء: مستعرضة (اهتزاز ⊥ انتشار)",
          "موجات الزنبرك: طولية (اهتزاز || انتشار)"
        ]
      }],
      en: [{
        question: "Classify the following waves as transverse or longitudinal: Sound waves, Light waves, Water waves, Spring waves.",
        solution: "Transverse: Light, Water | Longitudinal: Sound, Spring",
        steps: [
          "Sound waves: Longitudinal (vibration || propagation)",
          "Light waves: Transverse (vibration ⊥ propagation)",
          "Water waves: Transverse (vibration ⊥ propagation)",
          "Spring waves: Longitudinal (vibration || propagation)"
        ]
      }]
    },
    
    simulators: ["wave"],
    
    summary: {
      ar: "الموجات المستعرضة تهتز عمودياً على الانتشار، والطولية تهتز مع الانتشار. كلاهما يحمل الطاقة.",
      en: "Transverse waves vibrate perpendicular to propagation, longitudinal waves vibrate parallel. Both carry energy."
    }
  },
  
  {
    id: "sound-waves",
    titleAr: "الصوت",
    titleEn: "Sound",
    subject: "physics",
    unit: "waves",
    unitAr: "الموجات",
    unitEn: "Waves",
    duration: 22,
    isFree: false,
    order: 11,
    
    objectives: {
      ar: [
        "فهم طبيعة الصوت كموجة طولية",
        "معرفة خصائص الصوت الأساسية",
        "فهم سرعة الصوت واختلافها باختلاف الوسط",
        "فهم ظاهرة الصدى وتطبيقاتها"
      ],
      en: [
        "Understand sound as a longitudinal wave",
        "Know basic sound properties",
        "Understand sound speed variation in different media",
        "Understand echo phenomenon and its applications"
      ]
    },
    
    introduction: {
      ar: `**الصوت (Sound):**
الصوت هو موجة طولية ميكانيكية تحتاج إلى وسط مادي للانتشار.

**خصائص الصوت:**

1. **الدرجة (Pitch)**: تعتمد على التردد - كلما زاد التردد زادت حدة الصوت.

2. **شدة الصوت (Loudness)**: تعتمد على سعة الموجة - كلما زادت السعة زادت الشدة.

3. **نوعية الصوت (Quality)**: تميز بين المصادر المختلفة.

**سرعة الصوت:**
- في الهواء (20°س): 343 م/ث
- في الماء: 1500 م/ث تقريباً
- في الحديد: 5100 م/ث تقريباً

**الصدى (Echo):**
انعكاس الصوت عن سطح بعيد. يُسمع الصدى إذا كانت المسافة 17 متر على الأقل.

**تطبيقات الصدى:**
- تحديد أعماق البحار (السونار)
- الكشف عن الأجنة (الألتراساوند)`,
      en: `**Sound:**
Sound is a mechanical longitudinal wave requiring a material medium to propagate.

**Sound Properties:**

1. **Pitch**: Depends on frequency - higher frequency = higher pitch.

2. **Loudness**: Depends on amplitude - higher amplitude = louder sound.

3. **Quality (Timbre)**: Distinguishes between different sources.

**Speed of Sound:**
- In air (20°C): 343 m/s
- In water: ~1500 m/s
- In iron: ~5100 m/s

**Echo:**
Reflection of sound from a distant surface. Echo is heard if distance is at least 17 meters.

**Echo Applications:**
- Determining sea depths (SONAR)
- Fetal imaging (Ultrasound)`
    },
    
    keyConcepts: {
      ar: [
        { term: "الصوت", definition: "موجة طولية ميكانيكية تحتاج وسط للانتشار" },
        { term: "درجة الصوت", definition: "تعتمد على التردد" },
        { term: "شدة الصوت", definition: "تعتمد على سعة الموجة" },
        { term: "سرعة الصوت", definition: "343 م/ث في الهواء عند 20°س" },
        { term: "الصدى", definition: "انعكاس الصوت عن سطح بعيد" }
      ],
      en: [
        { term: "Sound", definition: "Mechanical longitudinal wave needing medium to propagate" },
        { term: "Pitch", definition: "Depends on frequency" },
        { term: "Loudness", definition: "Depends on wave amplitude" },
        { term: "Speed of Sound", definition: "343 m/s in air at 20°C" },
        { term: "Echo", definition: "Reflection of sound from distant surface" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "v = d/t", explanation: "سرعة الصوت = المسافة ÷ الزمن" },
        { formula: "d = v × t / 2", explanation: "المسافة للحصول على صدى (تقسم على 2 للذهاب والإياب)" }
      ],
      en: [
        { formula: "v = d/t", explanation: "Speed of sound = Distance ÷ Time" },
        { formula: "d = v × t / 2", explanation: "Distance for echo (divide by 2 for round trip)" }
      ]
    },
    
    examples: {
      ar: [{
        question: "سُمع صدى بعد 2 ثانية من إصدار صوت. احسب المسافة بين المصدر والحائل العاكس (سرعة الصوت 340 م/ث).",
        solution: "المسافة = 340 متر",
        steps: [
          "المسافة الكلية = v × t = 340 × 2 = 680 م",
          "هذه مسافة الذهاب والإياب",
          "المسافة للحائل = 680 ÷ 2 = 340 م"
        ]
      },
      {
        question: "احسب زمن سماع الصوت من حائط على بعد 170 متر (سرعة الصوت 340 م/ث).",
        solution: "الزمن = 1 ثانية",
        steps: [
          "المسافة الكلية = 170 × 2 = 340 م",
          "الزمن = d/v = 340/340 = 1 ث"
        ]
      }],
      en: [{
        question: "An echo was heard 2 seconds after making a sound. Calculate distance to reflecting surface (speed of sound 340 m/s).",
        solution: "Distance = 340 meters",
        steps: [
          "Total distance = v × t = 340 × 2 = 680 m",
          "This is round trip distance",
          "Distance to wall = 680 ÷ 2 = 340 m"
        ]
      },
      {
        question: "Calculate time to hear echo from a wall 170 meters away (speed of sound 340 m/s).",
        solution: "Time = 1 second",
        steps: [
          "Total distance = 170 × 2 = 340 m",
          "Time = d/v = 340/340 = 1 s"
        ]
      }]
    },
    
    simulators: ["wave"],
    
    summary: {
      ar: "الصوت موجة طولية تحتاج وسطاً للانتشار. سرعته تختلف باختلاف الوسط. الصدى يُستخدم في التطبيقات العملية.",
      en: "Sound is a longitudinal wave needing a medium to propagate. Its speed varies with medium. Echo is used in practical applications."
    }
  },
  
  {
    id: "light-waves",
    titleAr: "الضوء",
    titleEn: "Light",
    subject: "physics",
    unit: "waves",
    unitAr: "الموجات",
    unitEn: "Waves",
    duration: 25,
    isFree: false,
    order: 12,
    
    objectives: {
      ar: [
        "فهم طبيعة الضوء كموجة مستعرضة",
        "فهم ظاهرة انعكاس الضوء وقوانينها",
        "فهم ظاهرة انكسار الضوء",
        "التعرف على المرايا والعدسات وتطبيقاتها"
      ],
      en: [
        "Understand light as a transverse wave",
        "Understand reflection phenomenon and its laws",
        "Understand refraction phenomenon",
        "Learn about mirrors, lenses and their applications"
      ]
    },
    
    introduction: {
      ar: `**الضوء (Light):**
الضوء موجة مستعرضة كهرومغناطيسية لا تحتاج لوسط مادي للانتشار.

**سرعة الضوء:** c = 3 × 10⁸ م/ث في الفراغ

**انعكاس الضوء (Reflection):**
ارتداد الضوء عند سقوطه على سطح عاكس.

**قوانين الانعكاس:**
1. زاوية السقوط = زاوية الانعكاس
2. الشعاع الساقط والشعاع المنعكس والعمود المقام على السطح في مستوى واحد

**انكسار الضوء (Refraction):**
انحناء الضوء عند انتقاله من وسط إلى آخر مختلف الكثافة الضوئية.

**قانون سنل:**
n₁ × sin(θ₁) = n₂ × sin(θ₂)

**المرايا والعدسات:**
- **المرايا**: عاكسة (مقعر، محدب، مستوي)
- **العدسات**: شفافة (مجمعة، مفرقة)`,
      en: `**Light:**
Light is a transverse electromagnetic wave not requiring a material medium.

**Speed of Light:** c = 3 × 10⁸ m/s in vacuum

**Reflection:**
Bouncing back of light when hitting a reflecting surface.

**Laws of Reflection:**
1. Angle of incidence = Angle of reflection
2. Incident ray, reflected ray, and normal are in same plane

**Refraction:**
Bending of light when passing from one medium to another of different optical density.

**Snell's Law:**
n₁ × sin(θ₁) = n₂ × sin(θ₂)

**Mirrors and Lenses:**
- **Mirrors**: Reflecting (concave, convex, plane)
- **Lenses**: Transparent (converging, diverging)`
    },
    
    keyConcepts: {
      ar: [
        { term: "انعكاس الضوء", definition: "ارتداد الضوء عند سقوطه على سطح" },
        { term: "زاوية السقوط", definition: "الزاوية بين الشعاع الساقط والعمود" },
        { term: "زاوية الانعكاس", definition: "الزاوية بين الشعاع المنعكس والعمود" },
        { term: "انكسار الضوء", definition: "انحناء الضوء عند انتقاله بين وسطين" },
        { term: "معامل الانكسار", definition: "نسبة سرعة الضوء في الفراغ لسرعته في الوسط" }
      ],
      en: [
        { term: "Reflection", definition: "Bouncing back of light from a surface" },
        { term: "Angle of Incidence", definition: "Angle between incident ray and normal" },
        { term: "Angle of Reflection", definition: "Angle between reflected ray and normal" },
        { term: "Refraction", definition: "Bending of light between two media" },
        { term: "Refractive Index", definition: "Ratio of light speed in vacuum to speed in medium" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "θᵢ = θᵣ", explanation: "زاوية السقوط = زاوية الانعكاس" },
        { formula: "n = c/v", explanation: "معامل الانكسار = سرعة الضوء في الفراغ ÷ سرعته في الوسط" },
        { formula: "n₁ sin(θ₁) = n₂ sin(θ₂)", explanation: "قانون سنل للانكسار" }
      ],
      en: [
        { formula: "θᵢ = θᵣ", explanation: "Angle of incidence = Angle of reflection" },
        { formula: "n = c/v", explanation: "Refractive index = Speed in vacuum ÷ Speed in medium" },
        { formula: "n₁ sin(θ₁) = n₂ sin(θ₂)", explanation: "Snell's Law of refraction" }
      ]
    },
    
    examples: {
      ar: [{
        question: "شعاع ضوئي يسقط على مرآة بزاوية سقوط 30°. ما زاوية الانعكاس؟",
        solution: "زاوية الانعكاس = 30°",
        steps: ["وفقاً لقانون الانعكاس: زاوية السقوط = زاوية الانعكاس", "إذن: زاوية الانعكاس = 30°"]
      },
      {
        question: "شعاع ضوئي يسقط من الهواء (n=1) إلى الماء (n=1.33) بزاوية 45°. احسب زاوية الانكسار.",
        solution: "زاوية الانكسار ≈ 32°",
        steps: [
          "n₁ sin(θ₁) = n₂ sin(θ₂)",
          "1 × sin(45°) = 1.33 × sin(θ₂)",
          "sin(θ₂) = sin(45°)/1.33 = 0.707/1.33 = 0.532",
          "θ₂ = sin⁻¹(0.532) ≈ 32°"
        ]
      }],
      en: [{
        question: "A light ray hits a mirror at 30° angle of incidence. What is the angle of reflection?",
        solution: "Angle of reflection = 30°",
        steps: ["According to law of reflection: angle of incidence = angle of reflection", "Therefore: angle of reflection = 30°"]
      },
      {
        question: "A light ray enters from air (n=1) to water (n=1.33) at 45° angle. Calculate refraction angle.",
        solution: "Refraction angle ≈ 32°",
        steps: [
          "n₁ sin(θ₁) = n₂ sin(θ₂)",
          "1 × sin(45°) = 1.33 × sin(θ₂)",
          "sin(θ₂) = sin(45°)/1.33 = 0.707/1.33 = 0.532",
          "θ₂ = sin⁻¹(0.532) ≈ 32°"
        ]
      }]
    },
    
    simulators: ["wave"],
    
    summary: {
      ar: "الضوء موجة كهرومغناطيسية سريعة جداً. ينعكس ويخرج عند الانتقال بين الأوساط المختلفة.",
      en: "Light is a very fast electromagnetic wave. It reflects and refracts when passing between different media."
    }
  },
  
  // ==================== الفيزياء - الكهربية ====================
  {
    id: "electric-charge",
    titleAr: "الشحنة الكهربائية",
    titleEn: "Electric Charge",
    subject: "physics",
    unit: "electricity",
    unitAr: "الكهربية",
    unitEn: "Electricity",
    duration: 20,
    isFree: true,
    order: 13,
    
    objectives: {
      ar: [
        "فهم مفهوم الشحنة الكهربائية وأنواعها",
        "معرفة وحدة قياس الشحنة",
        "فهم قانون كولوم وتطبيقاته",
        "حساب القوة الكهربائية بين شحنتين"
      ],
      en: [
        "Understand electric charge concept and types",
        "Know charge unit of measurement",
        "Understand Coulomb's law and applications",
        "Calculate electric force between two charges"
      ]
    },
    
    introduction: {
      ar: `**الشحنة الكهربائية (Electric Charge):**
خاصية فيزيائية للمادة تسبب تفاعلات كهرومغناطيسية.

**أنواع الشحنات:**
1. **شحنة موجبة (+)**: نقص في الإلكترونات
2. **شحنة سالبة (-)**: زيادة في الإلكترونات

**وحدة الشحنة:** كولوم (C)

**الشحنة الأولية:** e = 1.6 × 10⁻¹⁹ كولوم

**خصائص الشحنة:**
- الشحنات المتشابهة تتنافر
- الشحنات المختلفة تتجاذب
- الشحنة محفوظة (لا تُخلق ولا تُفنى)

**قانون كولوم:**
القوة بين شحنتين تتناسب طردياً مع حاصل ضربهما وعكسياً مع مربع المسافة بينهما.`,
      en: `**Electric Charge:**
Physical property of matter causing electromagnetic interactions.

**Types of Charges:**
1. **Positive charge (+)**: Deficiency of electrons
2. **Negative charge (-)**: Excess of electrons

**Unit of Charge:** Coulomb (C)

**Elementary Charge:** e = 1.6 × 10⁻¹⁹ Coulomb

**Charge Properties:**
- Like charges repel
- Unlike charges attract
- Charge is conserved (cannot be created or destroyed)

**Coulomb's Law:**
Force between two charges is directly proportional to their product and inversely proportional to distance squared.`
    },
    
    keyConcepts: {
      ar: [
        { term: "الشحنة الكهربائية", definition: "خاصية فيزيائية للمادة (موجبة أو سالبة)" },
        { term: "الكولوم", definition: "وحدة قياس الشحنة الكهربائية" },
        { term: "الشحنة الأولية", definition: "شحنة الإلكترون = 1.6 × 10⁻¹⁹ كولوم" },
        { term: "قانون كولوم", definition: "يحسب القوة بين شحنتين نقطيتين" }
      ],
      en: [
        { term: "Electric Charge", definition: "Physical property of matter (positive or negative)" },
        { term: "Coulomb", definition: "Unit of electric charge" },
        { term: "Elementary Charge", definition: "Electron charge = 1.6 × 10⁻¹⁹ Coulomb" },
        { term: "Coulomb's Law", definition: "Calculates force between two point charges" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "F = k × q₁ × q₂ / r²", explanation: "قانون كولوم - القوة بين شحنتين" },
        { formula: "k = 9 × 10⁹ N.m²/C²", explanation: "ثابت كولوم" },
        { formula: "Q = n × e", explanation: "الشحنة الكلية = عدد الإلكترونات × الشحنة الأولية" }
      ],
      en: [
        { formula: "F = k × q₁ × q₂ / r²", explanation: "Coulomb's Law - Force between two charges" },
        { formula: "k = 9 × 10⁹ N.m²/C²", explanation: "Coulomb's constant" },
        { formula: "Q = n × e", explanation: "Total charge = Number of electrons × Elementary charge" }
      ]
    },
    
    examples: {
      ar: [{
        question: "شحنتان نقطيتان q₁ = 2 × 10⁻⁶ C و q₂ = 3 × 10⁻⁶ C تفصل بينهما مسافة 0.1 م. احسب القوة بينهما.",
        solution: "القوة = 5.4 نيوتن (قوة تنافر)",
        steps: [
          "F = k × q₁ × q₂ / r²",
          "F = 9 × 10⁹ × 2 × 10⁻⁶ × 3 × 10⁻⁶ / (0.1)²",
          "F = 54 × 10⁻³ / 0.01 = 5.4 N"
        ]
      },
      {
        question: "احسب عدد الإلكترونات في شحنة قدرها 3.2 × 10⁻¹⁹ كولوم.",
        solution: "عدد الإلكترونات = 2",
        steps: [
          "n = Q / e",
          "n = 3.2 × 10⁻¹⁹ / 1.6 × 10⁻¹⁹ = 2"
        ]
      }],
      en: [{
        question: "Two point charges q₁ = 2 × 10⁻⁶ C and q₂ = 3 × 10⁻⁶ C are separated by 0.1 m. Calculate the force between them.",
        solution: "Force = 5.4 Newtons (repulsive force)",
        steps: [
          "F = k × q₁ × q₂ / r²",
          "F = 9 × 10⁹ × 2 × 10⁻⁶ × 3 × 10⁻⁶ / (0.1)²",
          "F = 54 × 10⁻³ / 0.01 = 5.4 N"
        ]
      },
      {
        question: "Calculate number of electrons in a charge of 3.2 × 10⁻¹⁹ coulomb.",
        solution: "Number of electrons = 2",
        steps: [
          "n = Q / e",
          "n = 3.2 × 10⁻¹⁹ / 1.6 × 10⁻¹⁹ = 2"
        ]
      }]
    },
    
    simulators: ["energy"],
    
    summary: {
      ar: "الشحنة خاصية فيزيائية (موجبة/سالبة). قانون كولوم يحدد القوة بين الشحنات.",
      en: "Charge is a physical property (positive/negative). Coulomb's law determines force between charges."
    }
  },
  
  {
    id: "electric-current",
    titleAr: "التيار الكهربائي",
    titleEn: "Electric Current",
    subject: "physics",
    unit: "electricity",
    unitAr: "الكهربية",
    unitEn: "Electricity",
    duration: 18,
    isFree: true,
    order: 14,
    
    objectives: {
      ar: [
        "فهم مفهوم التيار الكهربائي",
        "معرفة وحدة قياس التيار (الأمبير)",
        "فهم الفرق بين التيار المستمر والمتردد",
        "حساب التيار من الشحنة والزمن"
      ],
      en: [
        "Understand electric current concept",
        "Know current unit (Ampere)",
        "Understand difference between DC and AC",
        "Calculate current from charge and time"
      ]
    },
    
    introduction: {
      ar: `**التيار الكهربائي (Electric Current):**
معدل تدفق الشحنات الكهربائية عبر موصل.

**تعريف التيار:**
I = Q / t

حيث:
- I = التيار (أمبير)
- Q = الشحنة (كولوم)
- t = الزمن (ثانية)

**وحدة التيار:** الأمبير (A)
1 أمبير = 1 كولوم / ثانية

**أنواع التيار:**

1. **تيار مستمر (DC):**
   - اتجاهه ثابت
   - مصادره: البطاريات، الخلايا الشمسية

2. **تيار متردد (AC):**
   - اتجاهه يتغير دورياً
   - مصادره: المولدات، مقابس الكهرباء المنزلية

**اتجاه التيار:**
- التيار الاصطلاحي: من القطب الموجب للسالب (خارج الدائرة)
- حركة الإلكترونات: من القطب السالب للموجب`,
      en: `**Electric Current:**
Rate of flow of electric charges through a conductor.

**Current Definition:**
I = Q / t

Where:
- I = Current (Ampere)
- Q = Charge (Coulomb)
- t = Time (second)

**Unit of Current:** Ampere (A)
1 Ampere = 1 Coulomb / second

**Types of Current:**

1. **Direct Current (DC):**
   - Direction is constant
   - Sources: Batteries, Solar cells

2. **Alternating Current (AC):**
   - Direction changes periodically
   - Sources: Generators, Wall outlets

**Current Direction:**
- Conventional current: From positive to negative (outside circuit)
- Electron flow: From negative to positive`
    },
    
    keyConcepts: {
      ar: [
        { term: "التيار الكهربائي", definition: "معدل تدفق الشحنات عبر موصل" },
        { term: "الأمبير", definition: "وحدة قياس التيار = كولوم/ثانية" },
        { term: "التيار المستمر", definition: "تيار ثابت الاتجاه" },
        { term: "التيار المتردد", definition: "تيار يتغير اتجاهه دورياً" }
      ],
      en: [
        { term: "Electric Current", definition: "Rate of charge flow through conductor" },
        { term: "Ampere", definition: "Unit of current = Coulomb/second" },
        { term: "Direct Current", definition: "Current with constant direction" },
        { term: "Alternating Current", definition: "Current with periodically changing direction" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "I = Q / t", explanation: "التيار = الشحنة ÷ الزمن" },
        { formula: "Q = I × t", explanation: "الشحنة = التيار × الزمن" }
      ],
      en: [
        { formula: "I = Q / t", explanation: "Current = Charge ÷ Time" },
        { formula: "Q = I × t", explanation: "Charge = Current × Time" }
      ]
    },
    
    examples: {
      ar: [{
        question: "مر تيار كهربائي شدته 2 أمبير خلال موصل لمدة 30 ثانية. احسب الشحنة المنقولة.",
        solution: "الشحنة = 60 كولوم",
        steps: [
          "Q = I × t",
          "Q = 2 × 30 = 60 كولوم"
        ]
      },
      {
        question: "شحنة قدرها 100 كولوم مرت عبر سلك في زمن 20 ثانية. احسب شدة التيار.",
        solution: "التيار = 5 أمبير",
        steps: [
          "I = Q / t",
          "I = 100 / 20 = 5 أمبير"
        ]
      }],
      en: [{
        question: "A 2 ampere current flows through a conductor for 30 seconds. Calculate the charge transferred.",
        solution: "Charge = 60 Coulombs",
        steps: [
          "Q = I × t",
          "Q = 2 × 30 = 60 Coulombs"
        ]
      },
      {
        question: "A charge of 100 Coulombs passed through a wire in 20 seconds. Calculate current intensity.",
        solution: "Current = 5 Amperes",
        steps: [
          "I = Q / t",
          "I = 100 / 20 = 5 Amperes"
        ]
      }]
    },
    
    simulators: ["energy"],
    
    summary: {
      ar: "التيار معدل تدفق الشحنات. وحدته الأمبير. هناك تيار مستمر ومتردد.",
      en: "Current is rate of charge flow. Unit is Ampere. There are DC and AC types."
    }
  },
  
  {
    id: "simple-circuits",
    titleAr: "الدوائر الكهربائية البسيطة",
    titleEn: "Simple Electric Circuits",
    subject: "physics",
    unit: "electricity",
    unitAr: "الكهربية",
    unitEn: "Electricity",
    duration: 25,
    isFree: false,
    order: 15,
    
    objectives: {
      ar: [
        "فهم مكونات الدائرة الكهربائية البسيطة",
        "تطبيق قانون أوم",
        "فهم طرق توصيل المقاومات (التوالي والتوازي)",
        "حساب المقاومة المكافئة"
      ],
      en: [
        "Understand simple circuit components",
        "Apply Ohm's Law",
        "Understand resistor connection methods (series and parallel)",
        "Calculate equivalent resistance"
      ]
    },
    
    introduction: {
      ar: `**الدائرة الكهربائية:**
مسار مغلق يسري فيه التيار الكهربائي.

**مكونات الدائرة البسيطة:**
1. مصدر الجهد (البطارية)
2. موصلات (الأسلاك)
3. مقاومة (المصباح أو المحول)
4. مفتاح (للفتح والإغلاق)

**قانون أوم:**
العلاقة بين الجهد والتيار والمقاومة:
V = I × R

حيث:
- V = الجهد (فولت)
- I = التيار (أمبير)
- R = المقاومة (أوم)

**توصيل المقاومات:**

**1. التوصيل على التوالي:**
- المقاومات على خط واحد
- المقاومة المكافئة: R = R₁ + R₂ + R₃
- التيار واحد في جميع المقاومات

**2. التوصيل على التوازي:**
- المقاومات على فروع متوازية
- المقاومة المكافئة: 1/R = 1/R₁ + 1/R₂ + 1/R₃
- الجهد واحد على جميع المقاومات`,
      en: `**Electric Circuit:**
Closed path where electric current flows.

**Simple Circuit Components:**
1. Voltage source (Battery)
2. Conductors (Wires)
3. Resistor (Bulb or appliance)
4. Switch (To open and close)

**Ohm's Law:**
Relationship between voltage, current, and resistance:
V = I × R

Where:
- V = Voltage (Volt)
- I = Current (Ampere)
- R = Resistance (Ohm)

**Resistor Connections:**

**1. Series Connection:**
- Resistors in a single line
- Equivalent resistance: R = R₁ + R₂ + R₃
- Same current through all resistors

**2. Parallel Connection:**
- Resistors in parallel branches
- Equivalent resistance: 1/R = 1/R₁ + 1/R₂ + 1/R₃
- Same voltage across all resistors`
    },
    
    keyConcepts: {
      ar: [
        { term: "الدائرة الكهربائية", definition: "مسار مغلق لسريان التيار" },
        { term: "الجهد الكهربائي", definition: "فرق الجهد بين نقطتين (فولت)" },
        { term: "المقاومة", definition: "ممانعة المادة لمرور التيار (أوم)" },
        { term: "قانون أوم", definition: "V = I × R" },
        { term: "التوصيل على التوالي", definition: "المقاومات على خط واحد" },
        { term: "التوصيل على التوازي", definition: "المقاومات على فروع متوازية" }
      ],
      en: [
        { term: "Electric Circuit", definition: "Closed path for current flow" },
        { term: "Voltage", definition: "Potential difference between two points (Volt)" },
        { term: "Resistance", definition: "Material's opposition to current (Ohm)" },
        { term: "Ohm's Law", definition: "V = I × R" },
        { term: "Series Connection", definition: "Resistors in a single line" },
        { term: "Parallel Connection", definition: "Resistors in parallel branches" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "V = I × R", explanation: "قانون أوم" },
        { formula: "R = V / I", explanation: "المقاومة = الجهد ÷ التيار" },
        { formula: "I = V / R", explanation: "التيار = الجهد ÷ المقاومة" },
        { formula: "R( series ) = R₁ + R₂ + R₃", explanation: "المقاومة المكافئة للتوصيل على التوالي" },
        { formula: "1/R( parallel ) = 1/R₁ + 1/R₂ + 1/R₃", explanation: "المقاومة المكافئة للتوصيل على التوازي" }
      ],
      en: [
        { formula: "V = I × R", explanation: "Ohm's Law" },
        { formula: "R = V / I", explanation: "Resistance = Voltage ÷ Current" },
        { formula: "I = V / R", explanation: "Current = Voltage ÷ Resistance" },
        { formula: "R( series ) = R₁ + R₂ + R₃", explanation: "Equivalent resistance in series" },
        { formula: "1/R( parallel ) = 1/R₁ + 1/R₂ + 1/R₃", explanation: "Equivalent resistance in parallel" }
      ]
    },
    
    examples: {
      ar: [{
        question: "مقاومة مقدارها 10 أوم موصولة بمصدر جهد 20 فولت. احسب التيار المار فيها.",
        solution: "التيار = 2 أمبير",
        steps: [
          "I = V / R",
          "I = 20 / 10 = 2 أمبير"
        ]
      },
      {
        question: "مقاومتان R₁ = 6 أوم و R₂ = 3 أوم. احسب المقاومة المكافئة: (أ) على التوالي (ب) على التوازي.",
        solution: "(أ) 9 أوم (ب) 2 أوم",
        steps: [
          "(أ) توالي: R = R₁ + R₂ = 6 + 3 = 9 أوم",
          "(ب) توازي: 1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2",
          "R = 2 أوم"
        ]
      }],
      en: [{
        question: "A 10 ohm resistor is connected to a 20 volt source. Calculate current through it.",
        solution: "Current = 2 Amperes",
        steps: [
          "I = V / R",
          "I = 20 / 10 = 2 Amperes"
        ]
      },
      {
        question: "Two resistors R₁ = 6 ohm and R₂ = 3 ohm. Calculate equivalent resistance: (a) in series (b) in parallel.",
        solution: "(a) 9 ohm (b) 2 ohm",
        steps: [
          "(a) Series: R = R₁ + R₂ = 6 + 3 = 9 ohm",
          "(b) Parallel: 1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2",
          "R = 2 ohm"
        ]
      }]
    },
    
    simulators: ["energy"],
    
    summary: {
      ar: "قانون أوم V=IR أساس الدوائر. المقاومات يمكن توصيلها توالي أو توازي بنتائج مختلفة.",
      en: "Ohm's Law V=IR is the basis of circuits. Resistors can be series or parallel connected with different results."
    }
  },
  
  {
    id: "electric-power",
    titleAr: "القدرة الكهربائية",
    titleEn: "Electric Power",
    subject: "physics",
    unit: "electricity",
    unitAr: "الكهربية",
    unitEn: "Electricity",
    duration: 15,
    isFree: false,
    order: 16,
    
    objectives: {
      ar: [
        "فهم مفهوم القدرة الكهربائية",
        "معرفة وحدة قياس القدرة (الواط)",
        "حساب القدرة من الجهد والتيار",
        "حساب الطاقة الكهربائية المستهلكة"
      ],
      en: [
        "Understand electric power concept",
        "Know power unit (Watt)",
        "Calculate power from voltage and current",
        "Calculate consumed electric energy"
      ]
    },
    
    introduction: {
      ar: `**القدرة الكهربائية (Electric Power):**
معدل تحويل الطاقة الكهربائية إلى شكل آخر من الطاقة.

**تعريف القدرة:**
P = V × I

حيث:
- P = القدرة (واط)
- V = الجهد (فولت)
- I = التيار (أمبير)

**وحدة القدرة:** الواط (W)
1 واط = 1 فولت × 1 أمبير = 1 جول/ثانية

**صيغ أخرى للقدرة:**
- P = I² × R
- P = V² / R

**الطاقة الكهربائية:**
E = P × t

**وحدة الطاقة:** كيلووات.ساعة (kWh)
تُستخدم في فواتير الكهرباء.

**حساب الفاتورة:**
التكلفة = الطاقة (kWh) × سعر الوحدة`,
      en: `**Electric Power:**
Rate of converting electrical energy to another form.

**Power Definition:**
P = V × I

Where:
- P = Power (Watt)
- V = Voltage (Volt)
- I = Current (Ampere)

**Unit of Power:** Watt (W)
1 Watt = 1 Volt × 1 Ampere = 1 Joule/second

**Other Power Formulas:**
- P = I² × R
- P = V² / R

**Electric Energy:**
E = P × t

**Energy Unit:** Kilowatt.hour (kWh)
Used in electricity bills.

**Bill Calculation:**
Cost = Energy (kWh) × Unit price`
    },
    
    keyConcepts: {
      ar: [
        { term: "القدرة الكهربائية", definition: "معدل تحويل الطاقة الكهربائية" },
        { term: "الواط", definition: "وحدة القدرة = جول/ثانية" },
        { term: "الكيلووات.ساعة", definition: "وحدة الطاقة المستخدمة في الفواتير" }
      ],
      en: [
        { term: "Electric Power", definition: "Rate of converting electrical energy" },
        { term: "Watt", definition: "Unit of power = Joule/second" },
        { term: "Kilowatt.hour", definition: "Energy unit used in bills" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "P = V × I", explanation: "القدرة = الجهد × التيار" },
        { formula: "P = I² × R", explanation: "القدرة = مربع التيار × المقاومة" },
        { formula: "P = V² / R", explanation: "القدرة = مربع الجهد ÷ المقاومة" },
        { formula: "E = P × t", explanation: "الطاقة = القدرة × الزمن" }
      ],
      en: [
        { formula: "P = V × I", explanation: "Power = Voltage × Current" },
        { formula: "P = I² × R", explanation: "Power = Current squared × Resistance" },
        { formula: "P = V² / R", explanation: "Power = Voltage squared ÷ Resistance" },
        { formula: "E = P × t", explanation: "Energy = Power × Time" }
      ]
    },
    
    examples: {
      ar: [{
        question: "مصباح يعمل على جهد 220 فولت ويسري فيه تيار 0.5 أمبير. احسب قدرته.",
        solution: "القدرة = 110 واط",
        steps: [
          "P = V × I",
          "P = 220 × 0.5 = 110 واط"
        ]
      },
      {
        question: "مدفأة كهربائية قدرتها 2000 واط تعمل لمدة 3 ساعات. احسب الطاقة المستهلكة بالكيلووات.ساعة.",
        solution: "الطاقة = 6 كيلووات.ساعة",
        steps: [
          "P = 2000 واط = 2 كيلووات",
          "E = P × t = 2 × 3 = 6 kWh"
        ]
      }],
      en: [{
        question: "A lamp works on 220 volts with 0.5 ampere current. Calculate its power.",
        solution: "Power = 110 Watts",
        steps: [
          "P = V × I",
          "P = 220 × 0.5 = 110 Watts"
        ]
      },
      {
        question: "An electric heater of 2000 watts works for 3 hours. Calculate consumed energy in kWh.",
        solution: "Energy = 6 kWh",
        steps: [
          "P = 2000 W = 2 kW",
          "E = P × t = 2 × 3 = 6 kWh"
        ]
      }]
    },
    
    simulators: ["energy"],
    
    summary: {
      ar: "القدرة معدل تحويل الطاقة (واط). الطاقة الكهربائية تُقاس بالكيلووات.ساعة في الفواتير.",
      en: "Power is rate of energy conversion (Watt). Electric energy is measured in kWh in bills."
    }
  },
  
  // ==================== الفيزياء - المغناطيسية ====================
  {
    id: "magnetism-intro",
    titleAr: "المغناطيسية",
    titleEn: "Magnetism",
    subject: "physics",
    unit: "magnetism",
    unitAr: "المغناطيسية",
    unitEn: "Magnetism",
    duration: 18,
    isFree: false,
    order: 17,
    
    objectives: {
      ar: [
        "فهم مفهوم المغناطيسية",
        "التعرف على أنواع المغناطيس",
        "فهم المجال المغناطيسي وخصائصه",
        "معرفة تطبيقات المغناطيسية"
      ],
      en: [
        "Understand magnetism concept",
        "Identify types of magnets",
        "Understand magnetic field and properties",
        "Know magnetism applications"
      ]
    },
    
    introduction: {
      ar: `**المغناطيسية (Magnetism):**
ظاهرة فيزيائية تظهر فيها بعض الموادر قوى جذب أو تنافر.

**أنواع المغناطيس:**

1. **المغناطيس الطبيعي:**
   - يوجد في الطبيعة (مثل حجر المغناطيت)
   - خام الحديد المغناطيسي

2. **المغناطيس الصناعي:**
   - يُصنع من سبائك معدنية
   - أشكال: قضيب، حدوة حصان، إبرة

**أقطاب المغناطيس:**
- القطب الشمالي (N): يوجه نحو الشمال الجغرافي
- القطب الجنوبي (S): يوجه نحو الجنوب الجغرافي
- الأقطاب المتشابهة تتنافر
- الأقطاب المختلفة تتجاذب

**المجال المغناطيسي:**
المنطقة حول المغناطيس التي تظهر فيها القوى المغناطيسية.

**خصائص خطوط المجال:**
- تخرج من القطب N وتدخل في القطب S
- لا تتقاطع
- أشد كثافة عند القطبين`,
      en: `**Magnetism:**
Physical phenomenon where certain materials exhibit attractive or repulsive forces.

**Types of Magnets:**

1. **Natural Magnet:**
   - Found in nature (like lodestone)
   - Magnetic iron ore

2. **Artificial Magnet:**
   - Made from metal alloys
   - Shapes: Bar, horseshoe, needle

**Magnet Poles:**
- North pole (N): Points toward geographic north
- South pole (S): Points toward geographic south
- Like poles repel
- Unlike poles attract

**Magnetic Field:**
Region around magnet where magnetic forces appear.

**Field Line Properties:**
- Exit from N pole and enter S pole
- Never cross each other
- Densest at the poles`
    },
    
    keyConcepts: {
      ar: [
        { term: "المغناطيس", definition: "جسم يجذب المواد المغناطيسية" },
        { term: "القطب الشمالي", definition: "القطب الذي يوجه نحو الشمال" },
        { term: "القطب الجنوبي", definition: "القطب الذي يوجه نحو الجنوب" },
        { term: "المجال المغناطيسي", definition: "المنطقة التي تظهر فيها القوى المغناطيسية" },
        { term: "خطوط المجال", definition: "خطوط تمثل اتجاه وشد المجال" }
      ],
      en: [
        { term: "Magnet", definition: "Object that attracts magnetic materials" },
        { term: "North Pole", definition: "Pole pointing toward north" },
        { term: "South Pole", definition: "Pole pointing toward south" },
        { term: "Magnetic Field", definition: "Region where magnetic forces appear" },
        { term: "Field Lines", definition: "Lines representing field direction and strength" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "F ∝ 1/r²", explanation: "القوة المغناطيسية تتناسب عكسياً مع مربع المسافة" }
      ],
      en: [
        { formula: "F ∝ 1/r²", explanation: "Magnetic force inversely proportional to distance squared" }
      ]
    },
    
    examples: {
      ar: [{
        question: "ماذا يحدث عند تقريب قطب شمالي من قطب شمالي آخر؟ وماذا عن قطب شمالي وجنوبي؟",
        solution: "شمالي-شمالي: تنافر | شمالي-جنوبي: تجاذب",
        steps: [
          "الأقطاب المتشابهة تتنافر",
          "إذن شمالي-شمالي تتنافر",
          "الأقطاب المختلفة تتجاذب",
          "إذن شمالي-جنوبي تتجاذب"
        ]
      }],
      en: [{
        question: "What happens when bringing a north pole near another north pole? What about north and south?",
        solution: "North-North: Repulsion | North-South: Attraction",
        steps: [
          "Like poles repel",
          "So north-north repel",
          "Unlike poles attract",
          "So north-south attract"
        ]
      }]
    },
    
    simulators: ["energy"],
    
    summary: {
      ar: "المغناطيس له قطبان (N, S). الأقطاب المتشابهة تتنافر والمختلفة تتجاذب. المجال المغناطيسي حول المغناطيس.",
      en: "Magnet has two poles (N, S). Like poles repel, unlike poles attract. Magnetic field surrounds magnet."
    }
  },
  
  {
    id: "electromagnetism",
    titleAr: "الكهرومغناطيسية",
    titleEn: "Electromagnetism",
    subject: "physics",
    unit: "magnetism",
    unitAr: "المغناطيسية",
    unitEn: "Magnetism",
    duration: 22,
    isFree: false,
    order: 18,
    
    objectives: {
      ar: [
        "فهم العلاقة بين الكهرباء والمغناطيسية",
        "التعرف على تجربة أورستد",
        "فهم مبدأ عمل المحرك الكهربائي",
        "معرفة تطبيقات الكهرومغناطيسية"
      ],
      en: [
        "Understand relationship between electricity and magnetism",
        "Learn about Oersted's experiment",
        "Understand electric motor principle",
        "Know electromagnetism applications"
      ]
    },
    
    introduction: {
      ar: `**الكهرومغناطيسية (Electromagnetism):**
فرع الفيزياء الذي يدرس العلاقة بين الظواهر الكهربائية والمغناطيسية.

**تجربة أورستد (1820):**
اكتشف أن التيار الكهربائي يُنتج مجالاً مغناطيسياً حول السلك.

**نتائج تجربة أورستد:**
- التيار الكهربائي يولد مجالاً مغناطيسياً
- اتجاه المجال المغناطيسي عمودي على اتجاه التيار
- يمكن تحديد اتجاه المجال بقاعدة اليد اليمنى

**قاعدة اليد اليمنى:**
- الإبهام: اتجاه التيار
- الأصابع الملتفة: اتجاه المجال المغناطيسي

**المغناطيس الكهربائي:**
سلك ملتف حول قلب حديدي يمر فيه تيار فينتج مجالاً مغناطيسياً قوياً.

**المحرك الكهربائي:**
جهاز يحول الطاقة الكهربائية إلى طاقة حركية باستخدام التأثير الكهرومغناطيسي.

**تطبيقات الكهرومغناطيسية:**
- المغناطيس الكهربائي
- المحرك الكهربائي
- المولد الكهربائي
- المحولات`,
      en: `**Electromagnetism:**
Branch of physics studying relationship between electric and magnetic phenomena.

**Oersted's Experiment (1820):**
Discovered that electric current produces magnetic field around wire.

**Oersted's Results:**
- Electric current generates magnetic field
- Magnetic field direction perpendicular to current direction
- Field direction can be determined by right-hand rule

**Right-Hand Rule:**
- Thumb: Current direction
- Curled fingers: Magnetic field direction

**Electromagnet:**
Wire coiled around iron core with current passing through producing strong magnetic field.

**Electric Motor:**
Device converting electrical energy to mechanical energy using electromagnetic effect.

**Electromagnetism Applications:**
- Electromagnet
- Electric motor
- Electric generator
- Transformers`
    },
    
    keyConcepts: {
      ar: [
        { term: "الكهرومغناطيسية", definition: "العلاقة بين الكهرباء والمغناطيسية" },
        { term: "تجربة أورستد", definition: "أثبتت أن التيار يولد مجالاً مغناطيسياً" },
        { term: "المغناطيس الكهربائي", definition: "سلك ملتف حول قلب حديدي يمر فيه تيار" },
        { term: "المحرك الكهربائي", definition: "يحول الطاقة الكهربائية إلى حركية" },
        { term: "قاعدة اليد اليمنى", definition: "تحدد اتجاه المجال المغناطيسي" }
      ],
      en: [
        { term: "Electromagnetism", definition: "Relationship between electricity and magnetism" },
        { term: "Oersted's Experiment", definition: "Proved current generates magnetic field" },
        { term: "Electromagnet", definition: "Wire coiled around iron core with current" },
        { term: "Electric Motor", definition: "Converts electrical energy to mechanical" },
        { term: "Right-Hand Rule", definition: "Determines magnetic field direction" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "B ∝ I", explanation: "المجال المغناطيسي يتناسب طردياً مع التيار" },
        { formula: "F = BIL", explanation: "القوة على سلك في مجال مغناطيسي" }
      ],
      en: [
        { formula: "B ∝ I", explanation: "Magnetic field proportional to current" },
        { formula: "F = BIL", explanation: "Force on wire in magnetic field" }
      ]
    },
    
    examples: {
      ar: [{
        question: "اشرح مبدأ عمل المحرك الكهربائي البسيط.",
        solution: "يدور ملف في مجال مغناطيسي بفعل القوة الكهرومغناطيسية",
        steps: [
          "يمر تيار في ملف موضوع في مجال مغناطيسي",
          "تؤثر قوة على جانبي الملف (قاعدة اليد اليسرى)",
          "القوتان متعاكستان مما يسبب دوران الملف",
          "يستمر الدوران بتبديل اتجاه التيار"
        ]
      },
      {
        question: "كيف يمكن زيادة قوة المغناطيس الكهربائي؟",
        solution: "زيادة التيار، زيادة عدد اللفات، استخدام قلب حديدي",
        steps: [
          "زيادة شدة التيار المار",
          "زيادة عدد لفات السلك",
          "استخدام قلب حديدي داخل الملف",
          "هذه العوامل تزيد من كثافة المجال المغناطيسي"
        ]
      }],
      en: [{
        question: "Explain the principle of simple electric motor.",
        solution: "Coil rotates in magnetic field due to electromagnetic force",
        steps: [
          "Current passes through coil in magnetic field",
          "Force acts on coil sides (left-hand rule)",
          "Opposite forces cause coil rotation",
          "Rotation continues by reversing current direction"
        ]
      },
      {
        question: "How can electromagnet strength be increased?",
        solution: "Increase current, more turns, use iron core",
        steps: [
          "Increase current intensity",
          "Increase number of wire turns",
          "Use iron core inside coil",
          "These factors increase magnetic field density"
        ]
      }]
    },
    
    simulators: ["energy"],
    
    summary: {
      ar: "التيار الكهربائي يولد مجالاً مغناطيسياً. هذا المبدأ أساس المحركات والمغناطيسات الكهربائية.",
      en: "Electric current generates magnetic field. This principle is the basis of motors and electromagnets."
    }
  },
  
  // ==================== الرياضيات - الجبر ====================
  {
    id: "linear-equations",
    titleAr: "المعادلات الخطية",
    titleEn: "Linear Equations",
    subject: "math",
    unit: "algebra",
    unitAr: "الجبر",
    unitEn: "Algebra",
    duration: 20,
    isFree: true,
    order: 1,
    
    objectives: {
      ar: [
        "فهم مفهوم المعادلة الخطية وشكلها العام",
        "حل المعادلات من الدرجة الأولى باستخدام الخطوات الصحيحة",
        "تطبيق المعادلات الخطية على مسائل حياتية",
        "التمييز بين الحلول المختلفة (حل وحيد، لانهائي، لا حل)"
      ],
      en: [
        "Understand the concept of linear equations and their general form",
        "Solve first-degree equations using correct steps",
        "Apply linear equations to real-life problems",
        "Distinguish between different solutions (unique, infinite, no solution)"
      ]
    },
    
    introduction: {
      ar: `**المعادلة الخطية:**
المعادلة الخطية هي معادلة من الدرجة الأولى تأخذ الصورة العامة: ax + b = 0

حيث:
- a: معامل المتغير (لا يساوي صفر)
- x: المجهول
- b: الحد الثابت

**خطوات حل المعادلة الخطية:**
1. تجميع الحدود المتشابهة
2. نقل الحدود الحسابية إلى طرف والحدود المجهولة إلى الطرف الآخر
3. تبسيط المعادلة
4. قسمة كلا الطرفين على معامل المجهول

**أنواع الحلول:**
- حل وحيد: عندما يكون a ≠ 0
- لا حل: عندما تكون المعادلة متناقضة (مثل: 0x = 5)
- حلول لانهائية: عندما تكون المعادلة محققة دائماً (مثل: 0x = 0)`,
      en: `**Linear Equation:**
A first-degree equation takes the general form: ax + b = 0

Where:
- a: Coefficient of the variable (not zero)
- x: Unknown
- b: Constant term

**Steps to Solve:**
1. Combine like terms
2. Move constant terms to one side and unknown terms to the other
3. Simplify the equation
4. Divide both sides by the coefficient

**Types of Solutions:**
- Unique solution: when a ≠ 0
- No solution: when equation is contradictory (like: 0x = 5)
- Infinite solutions: when equation is always true (like: 0x = 0)`
    },
    
    keyConcepts: {
      ar: [
        { term: "المعادلة الخطية", definition: "معادلة من الدرجة الأولى بصيغة ax + b = 0" },
        { term: "المعامل", definition: "الرقم المضروب في المتغير" },
        { term: "الحد الثابت", definition: "العدد الخالي من المتغيرات" },
        { term: "الحل", definition: "قيمة المجهول التي تحقق المعادلة" }
      ],
      en: [
        { term: "Linear Equation", definition: "First-degree equation in form ax + b = 0" },
        { term: "Coefficient", definition: "Number multiplied by the variable" },
        { term: "Constant Term", definition: "Number without variables" },
        { term: "Solution", definition: "Value of unknown that satisfies the equation" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "ax + b = 0", explanation: "الصيغة العامة للمعادلة الخطية" },
        { formula: "x = -b/a", explanation: "حل المعادلة الخطية" }
      ],
      en: [
        { formula: "ax + b = 0", explanation: "General form of linear equation" },
        { formula: "x = -b/a", explanation: "Solution of linear equation" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "حل المعادلة: 3x + 7 = 22",
          solution: "x = 5",
          steps: ["3x + 7 = 22", "3x = 22 - 7", "3x = 15", "x = 15 ÷ 3", "x = 5"]
        },
        {
          question: "عدد إذا أضيف إليه مثله ومثلي ما بعده كان الناتج 20. ما هو العدد؟",
          solution: "العدد = 4",
          steps: ["ليكن العدد = س", "المعادلة: س + س + 2(س + 1) = 20", "س + س + 2س + 2 = 20", "4س = 18", "س = 4.5"]
        }
      ],
      en: [
        {
          question: "Solve the equation: 3x + 7 = 22",
          solution: "x = 5",
          steps: ["3x + 7 = 22", "3x = 22 - 7", "3x = 15", "x = 15 ÷ 3", "x = 5"]
        },
        {
          question: "A number added to itself and twice what follows equals 20. Find the number.",
          solution: "Number ≈ 4",
          steps: ["Let the number = x", "Equation: x + x + 2(x + 1) = 20", "x + x + 2x + 2 = 20", "4x = 18", "x = 4.5"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "المعادلة الخطية معادلة من الدرجة الأولى يمكن حلها بنقل الحدود والقسمة على المعامل. لها ثلاثة أنواع من الحلول.",
      en: "A linear equation is a first-degree equation solved by moving terms and dividing by coefficient. It has three types of solutions."
    }
  },
  
  {
    id: "quadratic-equations",
    titleAr: "المعادلات التربيعية",
    titleEn: "Quadratic Equations",
    subject: "math",
    unit: "algebra",
    unitAr: "الجبر",
    unitEn: "Algebra",
    duration: 25,
    isFree: true,
    order: 2,
    
    objectives: {
      ar: [
        "فهم الصيغة العامة للمعادلة التربيعية",
        "حل المعادلات التربيعية بالتحليل",
        "استخدام القانون العام لإيجاد الحلول",
        "تطبيق طريقة إكمال المربع"
      ],
      en: [
        "Understand the general form of quadratic equations",
        "Solve quadratic equations by factoring",
        "Use the quadratic formula to find solutions",
        "Apply the completing square method"
      ]
    },
    
    introduction: {
      ar: `**المعادلة التربيعية:**
المعادلة التربيعية هي معادلة من الدرجة الثانية تأخذ الصيغة العامة:
**ax² + bx + c = 0**

حيث a ≠ 0

**طرق الحل:**

**1. طريقة التحليل:**
تحليل المعادلة إلى عوامل: (px + q)(rx + s) = 0
ثم يساوي كل عامل بالصفر.

**2. القانون العام:**
x = (-b ± √(b² - 4ac)) / 2a

**3. إكمال المربع:**
تحويل المعادلة إلى الصيغة: (x + h)² = k

**المميز (Discriminant):**
Δ = b² - 4ac
- إذا Δ > 0: حلان حقيقيان مختلفان
- إذا Δ = 0: حل واحد حقيقي (مضاعف)
- إذا Δ < 0: لا يوجد حلول حقيقية`,
      en: `**Quadratic Equation:**
A second-degree equation takes the general form:
**ax² + bx + c = 0**

Where a ≠ 0

**Solution Methods:**

**1. Factoring:**
Factor into: (px + q)(rx + s) = 0
Then set each factor equal to zero.

**2. Quadratic Formula:**
x = (-b ± √(b² - 4ac)) / 2a

**3. Completing the Square:**
Convert to form: (x + h)² = k

**Discriminant:**
Δ = b² - 4ac
- If Δ > 0: Two different real solutions
- If Δ = 0: One real solution (repeated)
- If Δ < 0: No real solutions`
    },
    
    keyConcepts: {
      ar: [
        { term: "المعادلة التربيعية", definition: "معادلة من الدرجة الثانية بصيغة ax² + bx + c = 0" },
        { term: "المميز", definition: "Δ = b² - 4ac يحدد طبيعة الحلول" },
        { term: "القانون العام", definition: "x = (-b ± √Δ) / 2a" },
        { term: "جذور المعادلة", definition: "الحلول التي تحقق المعادلة" }
      ],
      en: [
        { term: "Quadratic Equation", definition: "Second-degree equation in form ax² + bx + c = 0" },
        { term: "Discriminant", definition: "Δ = b² - 4ac determines nature of solutions" },
        { term: "Quadratic Formula", definition: "x = (-b ± √Δ) / 2a" },
        { term: "Roots", definition: "Solutions that satisfy the equation" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "ax² + bx + c = 0", explanation: "الصيغة العامة" },
        { formula: "x = (-b ± √(b²-4ac)) / 2a", explanation: "القانون العام" },
        { formula: "Δ = b² - 4ac", explanation: "المميز" }
      ],
      en: [
        { formula: "ax² + bx + c = 0", explanation: "General form" },
        { formula: "x = (-b ± √(b²-4ac)) / 2a", explanation: "Quadratic formula" },
        { formula: "Δ = b² - 4ac", explanation: "Discriminant" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "حل المعادلة: x² - 5x + 6 = 0",
          solution: "x = 2 أو x = 3",
          steps: ["x² - 5x + 6 = 0", "(x - 2)(x - 3) = 0", "x - 2 = 0  →  x = 2", "x - 3 = 0  →  x = 3"]
        },
        {
          question: "حل باستخدام القانون العام: 2x² + 3x - 2 = 0",
          solution: "x = 1/2 أو x = -2",
          steps: ["a = 2, b = 3, c = -2", "Δ = 9 - 4(2)(-2) = 9 + 16 = 25", "x = (-3 ± 5) / 4", "x₁ = (-3 + 5) / 4 = 1/2", "x₂ = (-3 - 5) / 4 = -2"]
        }
      ],
      en: [
        {
          question: "Solve the equation: x² - 5x + 6 = 0",
          solution: "x = 2 or x = 3",
          steps: ["x² - 5x + 6 = 0", "(x - 2)(x - 3) = 0", "x - 2 = 0  →  x = 2", "x - 3 = 0  →  x = 3"]
        },
        {
          question: "Solve using the formula: 2x² + 3x - 2 = 0",
          solution: "x = 1/2 or x = -2",
          steps: ["a = 2, b = 3, c = -2", "Δ = 9 - 4(2)(-2) = 9 + 16 = 25", "x = (-3 ± 5) / 4", "x₁ = (-3 + 5) / 4 = 1/2", "x₂ = (-3 - 5) / 4 = -2"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "المعادلة التربيعية لها ثلاث طرق حل رئيسية. المميز يحدد عدد وطبيعة الحلول.",
      en: "Quadratic equations have three main solution methods. The discriminant determines the number and nature of solutions."
    }
  },
  
  {
    id: "systems-equations",
    titleAr: "أنظمة المعادلات",
    titleEn: "Systems of Equations",
    subject: "math",
    unit: "algebra",
    unitAr: "الجبر",
    unitEn: "Algebra",
    duration: 20,
    isFree: false,
    order: 3,
    
    objectives: {
      ar: [
        "فهم مفهوم نظام المعادلات الخطية",
        "حل الأنظمة بطريقة التعويض",
        "حل الأنظمة بطريقة الحذف",
        "تحديد نوع الحل (وحيد، لا نهائي، لا حل)"
      ],
      en: [
        "Understand the concept of linear systems",
        "Solve systems by substitution method",
        "Solve systems by elimination method",
        "Determine type of solution (unique, infinite, no solution)"
      ]
    },
    
    introduction: {
      ar: `**نظام المعادلات الخطية:**
مجموعة من معادلتين أو أكثر يجب تحقيقهما معاً.

**الصيغة العامة:**
ax + by = c
dx + ey = f

**طرق الحل:**

**1. طريقة التعويض:**
- حل إحدى المعادلتين لأحد المتغيرات
- تعويض القيمة في المعادلة الأخرى
- حل لإيجاد المتغير الأول
- التعويض لإيجاد المتغير الثاني

**2. طريقة الحذف:**
- جعل معامل أحد المتغيرات متساوياً في المعادلتين
- طرح أو جمع المعادلتين لحذف المتغير
- حل المعادلة الناتجة
- التعويض لإيجاد المتغير الثاني

**أنواع الحلول:**
- حل وحيد: خطان متقاطعان
- لا حل: خطان متوازيان
- حلول لا نهائية: خطان متطابقان`,
      en: `**Linear System:**
A set of two or more equations that must be satisfied together.

**General Form:**
ax + by = c
dx + ey = f

**Solution Methods:**

**1. Substitution Method:**
- Solve one equation for one variable
- Substitute into the other equation
- Solve for the first variable
- Substitute to find the second variable

**2. Elimination Method:**
- Make coefficients of one variable equal
- Add or subtract equations to eliminate variable
- Solve the resulting equation
- Substitute to find the second variable

**Types of Solutions:**
- Unique solution: intersecting lines
- No solution: parallel lines
- Infinite solutions: coincident lines`
    },
    
    keyConcepts: {
      ar: [
        { term: "نظام معادلات", definition: "مجموعة معادلات يجب تحقيقهما معاً" },
        { term: "طريقة التعويض", definition: "حل متغير وتعويضه في المعادلة الأخرى" },
        { term: "طريقة الحذف", definition: "إزالة متغير بالجمع أو الطرح" },
        { term: "الحل الوحيد", definition: "نقطة تقاطع الخطين" }
      ],
      en: [
        { term: "System of Equations", definition: "Set of equations to be satisfied together" },
        { term: "Substitution Method", definition: "Solving variable and substituting into other equation" },
        { term: "Elimination Method", definition: "Removing variable by adding or subtracting" },
        { term: "Unique Solution", definition: "Point of intersection of two lines" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "x + y = a", explanation: "معادلة خطية في متغيرين" },
        { formula: "(a₁/a₂) = (b₁/b₂) = (c₁/c₂)", explanation: "شرط الحلول اللانهائية" },
        { formula: "(a₁/a₂) = (b₁/b₂) ≠ (c₁/c₂)", explanation: "شرط عدم وجود حل" }
      ],
      en: [
        { formula: "x + y = a", explanation: "Linear equation in two variables" },
        { formula: "(a₁/a₂) = (b₁/b₂) = (c₁/c₂)", explanation: "Condition for infinite solutions" },
        { formula: "(a₁/a₂) = (b₁/b₂) ≠ (c₁/c₂)", explanation: "Condition for no solution" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "حل النظام بطريقة التعويض: x + y = 10 و x - y = 4",
          solution: "x = 7, y = 3",
          steps: ["من المعادلة الأولى: x = 10 - y", "التعويض في الثانية: (10 - y) - y = 4", "10 - 2y = 4", "2y = 6 → y = 3", "x = 10 - 3 = 7"]
        },
        {
          question: "حل النظام بطريقة الحذف: 2x + 3y = 12 و 2x - y = 4",
          solution: "x = 3, y = 2",
          steps: ["طرح المعادلتين: (2x + 3y) - (2x - y) = 12 - 4", "4y = 8 → y = 2", "التعويض: 2x + 3(2) = 12", "2x = 6 → x = 3"]
        }
      ],
      en: [
        {
          question: "Solve by substitution: x + y = 10 and x - y = 4",
          solution: "x = 7, y = 3",
          steps: ["From first equation: x = 10 - y", "Substitute in second: (10 - y) - y = 4", "10 - 2y = 4", "2y = 6 → y = 3", "x = 10 - 3 = 7"]
        },
        {
          question: "Solve by elimination: 2x + 3y = 12 and 2x - y = 4",
          solution: "x = 3, y = 2",
          steps: ["Subtract equations: (2x + 3y) - (2x - y) = 12 - 4", "4y = 8 → y = 2", "Substitute: 2x + 3(2) = 12", "2x = 6 → x = 3"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "أنظمة المعادلات تحل بطريقة التعويض أو الحذف. نوع الحل يعتمد على العلاقة بين الخطين.",
      en: "Systems of equations are solved by substitution or elimination. Solution type depends on the relationship between the two lines."
    }
  },
  
  {
    id: "logarithms",
    titleAr: "اللوغاريتمات",
    titleEn: "Logarithms",
    subject: "math",
    unit: "algebra",
    unitAr: "الجبر",
    unitEn: "Algebra",
    duration: 20,
    isFree: false,
    order: 4,
    
    objectives: {
      ar: [
        "فهم تعريف اللوغاريتم وعلاقته بالأُس",
        "حساب قيم اللوغاريتمات",
        "تطبيق قوانين اللوغاريتمات",
        "حل المعادلات اللوغاريتمية"
      ],
      en: [
        "Understand the definition of logarithm and its relation to exponents",
        "Calculate logarithmic values",
        "Apply logarithmic laws",
        "Solve logarithmic equations"
      ]
    },
    
    introduction: {
      ar: `**اللوغاريتم:**
اللوغاريتم هو العملية العكسية للرفع للأس.

**التعريف:**
إذا كان a^x = b حيث a > 0 و a ≠ 1
فإن: logₐ(b) = x

نقرأ: لوغاريتم b في الأساس a يساوي x

**اللوغاريتم الطبيعي:**
ln(x) = logₑ(x) حيث e ≈ 2.718

**اللوغاريتم العشري:**
log(x) = log₁₀(x)

**قوانين اللوغاريتمات:**
1. logₐ(a) = 1
2. logₐ(1) = 0
3. logₐ(M × N) = logₐ(M) + logₐ(N)
4. logₐ(M/N) = logₐ(M) - logₐ(N)
5. logₐ(Mⁿ) = n × logₐ(M)
6. logₐ(b) = 1/logᵦ(a)`,
      en: `**Logarithm:**
The inverse operation of exponentiation.

**Definition:**
If a^x = b where a > 0 and a ≠ 1
Then: logₐ(b) = x

**Natural Logarithm:**
ln(x) = logₑ(x) where e ≈ 2.718

**Common Logarithm:**
log(x) = log₁₀(x)

**Laws of Logarithms:**
1. logₐ(a) = 1
2. logₐ(1) = 0
3. logₐ(M × N) = logₐ(M) + logₐ(N)
4. logₐ(M/N) = logₐ(M) - logₐ(N)
5. logₐ(Mⁿ) = n × logₐ(M)
6. logₐ(b) = 1/logᵦ(a)`
    },
    
    keyConcepts: {
      ar: [
        { term: "اللوغاريتم", definition: "العملية العكسية للرفع للأس" },
        { term: "الأساس", definition: "العدد الذي نرفعه للأس" },
        { term: "اللوغاريتم الطبيعي", definition: "ln(x) لوغاريتم بالأساس e" },
        { term: "قانون تغيير الأساس", definition: "logₐ(b) = log(b)/log(a)" }
      ],
      en: [
        { term: "Logarithm", definition: "Inverse operation of exponentiation" },
        { term: "Base", definition: "Number being raised to power" },
        { term: "Natural Logarithm", definition: "ln(x) logarithm with base e" },
        { term: "Change of Base Rule", definition: "logₐ(b) = log(b)/log(a)" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "logₐ(b) = x ⟺ a^x = b", explanation: "تعريف اللوغاريتم" },
        { formula: "logₐ(MN) = logₐ(M) + logₐ(N)", explanation: "قانون الضرب" },
        { formula: "logₐ(M/N) = logₐ(M) - logₐ(N)", explanation: "قانون القسمة" },
        { formula: "logₐ(Mⁿ) = n logₐ(M)", explanation: "قانون الأس" }
      ],
      en: [
        { formula: "logₐ(b) = x ⟺ a^x = b", explanation: "Definition of logarithm" },
        { formula: "logₐ(MN) = logₐ(M) + logₐ(N)", explanation: "Product rule" },
        { formula: "logₐ(M/N) = logₐ(M) - logₐ(N)", explanation: "Quotient rule" },
        { formula: "logₐ(Mⁿ) = n logₐ(M)", explanation: "Power rule" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "أوجد قيمة log₂(8)",
          solution: "log₂(8) = 3",
          steps: ["نبحث عن الأس الذي إذا رفعنا 2 إليه أعطى 8", "2³ = 8", "إذن log₂(8) = 3"]
        },
        {
          question: "بسّط: log₂(16) + log₂(4)",
          solution: "الناتج = 6",
          steps: ["log₂(16 × 4) باستخدام قانون الضرب", "log₂(64)", "2⁶ = 64", "إذن الناتج = 6"]
        }
      ],
      en: [
        {
          question: "Find the value of log₂(8)",
          solution: "log₂(8) = 3",
          steps: ["We look for exponent that gives 8 when 2 is raised to it", "2³ = 8", "Therefore log₂(8) = 3"]
        },
        {
          question: "Simplify: log₂(16) + log₂(4)",
          solution: "Result = 6",
          steps: ["log₂(16 × 4) using product rule", "log₂(64)", "2⁶ = 64", "Therefore result = 6"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "اللوغاريتم العملية العكسية للرفع للأس. له قوانين مهمة للضرب والقسمة والأس.",
      en: "Logarithm is the inverse operation of exponentiation. It has important rules for multiplication, division, and powers."
    }
  },
  
  // ==================== الرياضيات - حساب المثلثات ====================
  {
    id: "angles-measurement",
    titleAr: "الزوايا وقياسها",
    titleEn: "Angles and Measurement",
    subject: "math",
    unit: "trigonometry",
    unitAr: "حساب المثلثات",
    unitEn: "Trigonometry",
    duration: 18,
    isFree: true,
    order: 5,
    
    objectives: {
      ar: [
        "فهم مفهوم الزاوية وأنواعها",
        "التحويل بين الدرجات والراديان",
        "فهم الزوايا المتتامة والمتكاملة",
        "تحديد مواقع الزوايا في الدائرة"
      ],
      en: [
        "Understand concept and types of angles",
        "Convert between degrees and radians",
        "Understand complementary and supplementary angles",
        "Determine angle positions in circle"
      ]
    },
    
    introduction: {
      ar: `**الزاوية:**
هي منطقة محصورة بين نصفي مستقيمين يشتركان في نقطة البداية (الرأس).

**وحدات قياس الزوايا:**

**1. الدرجة (°):**
- الدائرة الكاملة = 360°
- الزاوية القائمة = 90°
- الدرجة الواحدة = 60 دقيقة (')
- الدقيقة الواحدة = 60 ثانية (")

**2. الراديان (rad):**
- الزاوية التي طول قوسها يساوي نصف القطر
- الدائرة الكاملة = 2π راديان
- 180° = π راديان

**التحويل:**
- من درجة إلى راديان: ضرب في π/180
- من راديان إلى درجة: ضرب في 180/π

**أنواع الزوايا:**
- حادة: أقل من 90°
- قائمة: تساوي 90°
- منفرجة: بين 90° و 180°
- مستقيمة: تساوي 180°
- منعكسة: أكبر من 180°

**زوايا خاصة:**
- متتامة: مجموعهما = 90°
- متكاملة: مجموعهما = 180°`,
      en: `**Angle:**
Region enclosed between two rays sharing a starting point (vertex).

**Units of Measurement:**

**1. Degree (°):**
- Full circle = 360°
- Right angle = 90°
- One degree = 60 minutes (')
- One minute = 60 seconds (")

**2. Radian (rad):**
- Angle whose arc length equals radius
- Full circle = 2π radians
- 180° = π radians

**Conversion:**
- Degree to radian: multiply by π/180
- Radian to degree: multiply by 180/π

**Types of Angles:**
- Acute: less than 90°
- Right: equals 90°
- Obtuse: between 90° and 180°
- Straight: equals 180°
- Reflex: greater than 180°

**Special Angles:**
- Complementary: sum = 90°
- Supplementary: sum = 180°`
    },
    
    keyConcepts: {
      ar: [
        { term: "الزاوية", definition: "منطقة بين نصفي مستقيمين من نقطة واحدة" },
        { term: "الراديان", definition: "وحدة قياس الزوايا حيث 2π = 360°" },
        { term: "الزوايا المتتامة", definition: "زاويتان مجموعهما 90°" },
        { term: "الزوايا المتكاملة", definition: "زاويتان مجموعهما 180°" }
      ],
      en: [
        { term: "Angle", definition: "Region between two rays from one point" },
        { term: "Radian", definition: "Unit where 2π = 360°" },
        { term: "Complementary Angles", definition: "Two angles summing to 90°" },
        { term: "Supplementary Angles", definition: "Two angles summing to 180°" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "θ(راديان) = θ(درجة) × π/180", explanation: "التحويل من درجة إلى راديان" },
        { formula: "θ(درجة) = θ(راديان) × 180/π", explanation: "التحويل من راديان إلى درجة" },
        { formula: "180° = π راديان", explanation: "العلاقة الأساسية" }
      ],
      en: [
        { formula: "θ(radians) = θ(degrees) × π/180", explanation: "Degree to radian conversion" },
        { formula: "θ(degrees) = θ(radians) × 180/π", explanation: "Radian to degree conversion" },
        { formula: "180° = π radians", explanation: "Fundamental relation" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "حوّل 45° إلى راديان",
          solution: "45° = π/4 راديان",
          steps: ["θ = 45 × π/180", "θ = π/4 راديان"]
        },
        {
          question: "حوّل 3π/2 راديان إلى درجات",
          solution: "3π/2 = 270°",
          steps: ["θ = 3π/2 × 180/π", "θ = 3 × 90 = 270°"]
        }
      ],
      en: [
        {
          question: "Convert 45° to radians",
          solution: "45° = π/4 radians",
          steps: ["θ = 45 × π/180", "θ = π/4 radians"]
        },
        {
          question: "Convert 3π/2 radians to degrees",
          solution: "3π/2 = 270°",
          steps: ["θ = 3π/2 × 180/π", "θ = 3 × 90 = 270°"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "الزوايا تقاس بالدرجات أو الراديان. π راديان = 180°. الزوايا المتتامة مجموعها 90° والمتكاملة 180°.",
      en: "Angles are measured in degrees or radians. π radians = 180°. Complementary angles sum to 90°, supplementary to 180°."
    }
  },
  
  {
    id: "trigonometric-functions",
    titleAr: "الدوال المثلثية",
    titleEn: "Trigonometric Functions",
    subject: "math",
    unit: "trigonometry",
    unitAr: "حساب المثلثات",
    unitEn: "Trigonometry",
    duration: 22,
    isFree: true,
    order: 6,
    
    objectives: {
      ar: [
        "فهم تعريف الدوال المثلثية الأساسية",
        "حساب قيم الدوال للزوايا الخاصة",
        "فهم العلاقات بين الدوال المثلثية",
        "تطبيق الدوال في مثلث قائم الزاوية"
      ],
      en: [
        "Understand definition of basic trigonometric functions",
        "Calculate function values for special angles",
        "Understand relationships between trigonometric functions",
        "Apply functions in right triangles"
      ]
    },
    
    introduction: {
      ar: `**الدوال المثلثية الأساسية:**

في مثلث قائم الزاوية مع زاوية θ:

**1. الجيب (Sine):**
sin(θ) = الضلع المقابل / الوتر

**2. جيب التمام (Cosine):**
cos(θ) = الضلع المجاور / الوتر

**3. الظل (Tangent):**
tan(θ) = الضلع المقابل / الضلع المجاور = sin(θ)/cos(θ)

**العلاقات بين الدوال:**
- tan(θ) = sin(θ) / cos(θ)
- cot(θ) = 1 / tan(θ) = cos(θ) / sin(θ)
- sec(θ) = 1 / cos(θ)
- csc(θ) = 1 / sin(θ)

**قيم الزوايا الخاصة:**

| الزاوية | 0° | 30° | 45° | 60° | 90° |
|---------|-----|------|------|------|------|
| sin     | 0  | 1/2  | √2/2 | √3/2 | 1    |
| cos     | 1  | √3/2 | √2/2 | 1/2  | 0    |
| tan     | 0  | √3/3 | 1    | √3   | غير معرف |`,
      en: `**Basic Trigonometric Functions:**

In a right triangle with angle θ:

**1. Sine:**
sin(θ) = Opposite side / Hypotenuse

**2. Cosine:**
cos(θ) = Adjacent side / Hypotenuse

**3. Tangent:**
tan(θ) = Opposite side / Adjacent side = sin(θ)/cos(θ)

**Relationships:**
- tan(θ) = sin(θ) / cos(θ)
- cot(θ) = 1 / tan(θ) = cos(θ) / sin(θ)
- sec(θ) = 1 / cos(θ)
- csc(θ) = 1 / sin(θ)

**Special Angle Values:**

| Angle | 0° | 30° | 45° | 60° | 90° |
|-------|-----|------|------|------|------|
| sin   | 0  | 1/2  | √2/2 | √3/2 | 1    |
| cos   | 1  | √3/2 | √2/2 | 1/2  | 0    |
| tan   | 0  | √3/3 | 1    | √3   | undefined |`
    },
    
    keyConcepts: {
      ar: [
        { term: "الجيب", definition: "نسبة الضلع المقابل إلى الوتر" },
        { term: "جيب التمام", definition: "نسبة الضلع المجاور إلى الوتر" },
        { term: "الظل", definition: "نسبة الجيب إلى جيب التمام" },
        { term: "الوتر", definition: "أطول ضلع في المثلث القائم" }
      ],
      en: [
        { term: "Sine", definition: "Ratio of opposite side to hypotenuse" },
        { term: "Cosine", definition: "Ratio of adjacent side to hypotenuse" },
        { term: "Tangent", definition: "Ratio of sine to cosine" },
        { term: "Hypotenuse", definition: "Longest side in right triangle" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "sin(θ) = ض/و", explanation: "قانون الجيب" },
        { formula: "cos(θ) = ج/و", explanation: "قانون جيب التمام" },
        { formula: "tan(θ) = ض/ج = sin(θ)/cos(θ)", explanation: "قانون الظل" },
        { formula: "sin²(θ) + cos²(θ) = 1", explanation: "متطابقة فيثاغورس" }
      ],
      en: [
        { formula: "sin(θ) = opp/hyp", explanation: "Sine formula" },
        { formula: "cos(θ) = adj/hyp", explanation: "Cosine formula" },
        { formula: "tan(θ) = opp/adj = sin(θ)/cos(θ)", explanation: "Tangent formula" },
        { formula: "sin²(θ) + cos²(θ) = 1", explanation: "Pythagorean identity" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "في مثلث قائم، الضلع المقابل للزاوية 30° يساوي 5سم. أوجد طول الوتر.",
          solution: "الوتر = 10 سم",
          steps: ["sin(30°) = الضلع المقابل / الوتر", "1/2 = 5 / الوتر", "الوتر = 5 × 2 = 10 سم"]
        },
        {
          question: "أوجد قيمة tan(45°) + sin(30°)",
          solution: "الناتج = 1.5",
          steps: ["tan(45°) = 1", "sin(30°) = 1/2", "الناتج = 1 + 0.5 = 1.5"]
        }
      ],
      en: [
        {
          question: "In a right triangle, the side opposite 30° equals 5cm. Find the hypotenuse.",
          solution: "Hypotenuse = 10 cm",
          steps: ["sin(30°) = Opposite / Hypotenuse", "1/2 = 5 / Hypotenuse", "Hypotenuse = 5 × 2 = 10 cm"]
        },
        {
          question: "Find the value of tan(45°) + sin(30°)",
          solution: "Result = 1.5",
          steps: ["tan(45°) = 1", "sin(30°) = 1/2", "Result = 1 + 0.5 = 1.5"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "الدوال المثلثية الأساسية هي sin و cos و tan. يمكن حسابها من أضلاع المثلث القائم.",
      en: "Basic trigonometric functions are sin, cos, and tan. They can be calculated from right triangle sides."
    }
  },
  
  {
    id: "trigonometric-identities",
    titleAr: "المتطابقات المثلثية",
    titleEn: "Trigonometric Identities",
    subject: "math",
    unit: "trigonometry",
    unitAr: "حساب المثلثات",
    unitEn: "Trigonometry",
    duration: 20,
    isFree: false,
    order: 7,
    
    objectives: {
      ar: [
        "فهم متطابقات فيثاغورس",
        "تطبيق متطابقات الجمع والطرح",
        "إثبات المتطابقات المثلثية",
        "تبسيط التعابير المثلثية"
      ],
      en: [
        "Understand Pythagorean identities",
        "Apply sum and difference identities",
        "Prove trigonometric identities",
        "Simplify trigonometric expressions"
      ]
    },
    
    introduction: {
      ar: `**متطابقات فيثاغورس:**

من المعادلة sin²(θ) + cos²(θ) = 1 يمكن اشتقاق:

1. sin²(θ) + cos²(θ) = 1
2. 1 + tan²(θ) = sec²(θ)
3. 1 + cot²(θ) = csc²(θ)

**متطابقات الجمع والطرح:**

**الجيب:**
- sin(A + B) = sin(A)cos(B) + cos(A)sin(B)
- sin(A - B) = sin(A)cos(B) - cos(A)sin(B)

**جيب التمام:**
- cos(A + B) = cos(A)cos(B) - sin(A)sin(B)
- cos(A - B) = cos(A)cos(B) + sin(A)sin(B)

**الظل:**
- tan(A + B) = (tan(A) + tan(B)) / (1 - tan(A)tan(B))
- tan(A - B) = (tan(A) - tan(B)) / (1 + tan(A)tan(B))

**متطابقات الضعف:**
- sin(2θ) = 2sin(θ)cos(θ)
- cos(2θ) = cos²(θ) - sin²(θ) = 2cos²(θ) - 1 = 1 - 2sin²(θ)
- tan(2θ) = 2tan(θ) / (1 - tan²(θ))`,
      en: `**Pythagorean Identities:**

From sin²(θ) + cos²(θ) = 1 we derive:

1. sin²(θ) + cos²(θ) = 1
2. 1 + tan²(θ) = sec²(θ)
3. 1 + cot²(θ) = csc²(θ)

**Sum and Difference Identities:**

**Sine:**
- sin(A + B) = sin(A)cos(B) + cos(A)sin(B)
- sin(A - B) = sin(A)cos(B) - cos(A)sin(B)

**Cosine:**
- cos(A + B) = cos(A)cos(B) - sin(A)sin(B)
- cos(A - B) = cos(A)cos(B) + sin(A)sin(B)

**Tangent:**
- tan(A + B) = (tan(A) + tan(B)) / (1 - tan(A)tan(B))
- tan(A - B) = (tan(A) - tan(B)) / (1 + tan(A)tan(B))

**Double Angle Identities:**
- sin(2θ) = 2sin(θ)cos(θ)
- cos(2θ) = cos²(θ) - sin²(θ) = 2cos²(θ) - 1 = 1 - 2sin²(θ)
- tan(2θ) = 2tan(θ) / (1 - tan²(θ))`
    },
    
    keyConcepts: {
      ar: [
        { term: "المتطابقة", definition: "معادلة صحيحة لجميع قيم المتغير" },
        { term: "متطابقة فيثاغورس", definition: "sin²(θ) + cos²(θ) = 1" },
        { term: "متطابقة الضعف", definition: "متطابقات الزاوية 2θ" },
        { term: "متطابقات الجمع", definition: "صيغ sin(A+B) و cos(A+B)" }
      ],
      en: [
        { term: "Identity", definition: "Equation true for all variable values" },
        { term: "Pythagorean Identity", definition: "sin²(θ) + cos²(θ) = 1" },
        { term: "Double Angle Identity", definition: "Identities for angle 2θ" },
        { term: "Sum Identity", definition: "Formulas for sin(A+B) and cos(A+B)" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "sin²(θ) + cos²(θ) = 1", explanation: "المتطابقة الأساسية" },
        { formula: "sin(A ± B) = sin(A)cos(B) ± cos(A)sin(B)", explanation: "متطابقة جمع/طرح الجيب" },
        { formula: "cos(2θ) = cos²(θ) - sin²(θ)", explanation: "متطابقة ضعف جيب التمام" },
        { formula: "sin(2θ) = 2sin(θ)cos(θ)", explanation: "متطابقة ضعف الجيب" }
      ],
      en: [
        { formula: "sin²(θ) + cos²(θ) = 1", explanation: "Fundamental identity" },
        { formula: "sin(A ± B) = sin(A)cos(B) ± cos(A)sin(B)", explanation: "Sine sum/difference identity" },
        { formula: "cos(2θ) = cos²(θ) - sin²(θ)", explanation: "Cosine double angle identity" },
        { formula: "sin(2θ) = 2sin(θ)cos(θ)", explanation: "Sine double angle identity" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "أثبت أن: tan²(θ) + 1 = sec²(θ)",
          solution: "متطابقة صحيحة",
          steps: ["نبدأ من: sin²(θ) + cos²(θ) = 1", "نقسم على cos²(θ):", "tan²(θ) + 1 = sec²(θ) ✓"]
        },
        {
          question: "أوجد sin(75°) باستخدام متطابقات الجمع",
          solution: "sin(75°) = (√6 + √2) / 4",
          steps: ["sin(75°) = sin(45° + 30°)", "= sin(45°)cos(30°) + cos(45°)sin(30°)", "= (√2/2)(√3/2) + (√2/2)(1/2)", "= (√6 + √2) / 4"]
        }
      ],
      en: [
        {
          question: "Prove that: tan²(θ) + 1 = sec²(θ)",
          solution: "Identity is true",
          steps: ["Start from: sin²(θ) + cos²(θ) = 1", "Divide by cos²(θ):", "tan²(θ) + 1 = sec²(θ) ✓"]
        },
        {
          question: "Find sin(75°) using sum identities",
          solution: "sin(75°) = (√6 + √2) / 4",
          steps: ["sin(75°) = sin(45° + 30°)", "= sin(45°)cos(30°) + cos(45°)sin(30°)", "= (√2/2)(√3/2) + (√2/2)(1/2)", "= (√6 + √2) / 4"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "المتطابقات المثلثية معادلات صحيحة دائماً. أهمها متطابقات فيثاغورس والجمع والضعف.",
      en: "Trigonometric identities are always true equations. Most important are Pythagorean, sum, and double angle identities."
    }
  },
  
  {
    id: "sine-cosine-laws",
    titleAr: "قانوني الجيب وجيب التمام",
    titleEn: "Sine and Cosine Laws",
    subject: "math",
    unit: "trigonometry",
    unitAr: "حساب المثلثات",
    unitEn: "Trigonometry",
    duration: 20,
    isFree: false,
    order: 8,
    
    objectives: {
      ar: [
        "فهم قانون الجيب وتطبيقاته",
        "فهم قانون جيب التمام وتطبيقاته",
        "حل المثلثات باستخدام القانونين",
        "تحديد القانون المناسب لكل حالة"
      ],
      en: [
        "Understand sine law and its applications",
        "Understand cosine law and its applications",
        "Solve triangles using both laws",
        "Determine appropriate law for each case"
      ]
    },
    
    introduction: {
      ar: `**قانون الجيب:**

في أي مثلث ABC:

a/sin(A) = b/sin(B) = c/sin(C) = 2R

حيث R هو نصف قطر الدائرة المحيطة.

**استخدام قانون الجيب:**
- معطى ضلعان والزاوية المقابلة لأحدهما
- معطى زاويتان وضلع واحد

**قانون جيب التمام:**

في أي مثلث ABC:

a² = b² + c² - 2bc·cos(A)
b² = a² + c² - 2ac·cos(B)
c² = a² + b² - 2ab·cos(C)

**استخدام قانون جيب التمام:**
- معطى ضلعان والزاوية المحصورة بينهما
- معطى ثلاثة أضلاع

**حالة خاصة:**
إذا كانت الزاوية = 90° يتحول قانون جيب التمام إلى نظرية فيثاغورس:
c² = a² + b²`,
      en: `**Sine Law:**

In any triangle ABC:

a/sin(A) = b/sin(B) = c/sin(C) = 2R

Where R is the circumradius.

**Using Sine Law:**
- Given two sides and angle opposite to one
- Given two angles and one side

**Cosine Law:**

In any triangle ABC:

a² = b² + c² - 2bc·cos(A)
b² = a² + c² - 2ac·cos(B)
c² = a² + b² - 2ab·cos(C)

**Using Cosine Law:**
- Given two sides and included angle
- Given three sides

**Special Case:**
If angle = 90°, cosine law becomes Pythagorean theorem:
c² = a² + b²`
    },
    
    keyConcepts: {
      ar: [
        { term: "قانون الجيب", definition: "نسبة الضلع لجيب زاويته ثابتة" },
        { term: "قانون جيب التمام", definition: "علاقة الأضلاع بالزوايا" },
        { term: "حل المثلث", definition: "إيجاد جميع الأضلاع والزوايا" },
        { term: "الحالة المبهمة", definition: "حالتان ممكنتان للحل عند استخدام قانون الجيب" }
      ],
      en: [
        { term: "Sine Law", definition: "Ratio of side to sine of opposite angle is constant" },
        { term: "Cosine Law", definition: "Relation between sides and angles" },
        { term: "Solving Triangle", definition: "Finding all sides and angles" },
        { term: "Ambiguous Case", definition: "Two possible solutions when using sine law" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "a/sin(A) = b/sin(B) = c/sin(C)", explanation: "قانون الجيب" },
        { formula: "a² = b² + c² - 2bc·cos(A)", explanation: "قانون جيب التمام" },
        { formula: "cos(A) = (b² + c² - a²) / 2bc", explanation: "إيجاد الزاوية" }
      ],
      en: [
        { formula: "a/sin(A) = b/sin(B) = c/sin(C)", explanation: "Sine law" },
        { formula: "a² = b² + c² - 2bc·cos(A)", explanation: "Cosine law" },
        { formula: "cos(A) = (b² + c² - a²) / 2bc", explanation: "Finding angle" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "في مثلث: a = 8، b = 6، الزاوية C = 60°. أوجد الضلع c.",
          solution: "c ≈ 7.21",
          steps: ["باستخدام قانون جيب التمام:", "c² = 8² + 6² - 2(8)(6)cos(60°)", "c² = 64 + 36 - 96(0.5)", "c² = 100 - 48 = 52", "c = √52 ≈ 7.21"]
        },
        {
          question: "في مثلث: A = 45°، B = 60°، a = 10. أوجد الضلع b.",
          solution: "b ≈ 12.25",
          steps: ["باستخدام قانون الجيب:", "10/sin(45°) = b/sin(60°)", "b = 10 × sin(60°) / sin(45°)", "b = 10 × (√3/2) / (√2/2)", "b = 10 × √3/√2 ≈ 12.25"]
        }
      ],
      en: [
        {
          question: "In a triangle: a = 8, b = 6, angle C = 60°. Find side c.",
          solution: "c ≈ 7.21",
          steps: ["Using cosine law:", "c² = 8² + 6² - 2(8)(6)cos(60°)", "c² = 64 + 36 - 96(0.5)", "c² = 100 - 48 = 52", "c = √52 ≈ 7.21"]
        },
        {
          question: "In a triangle: A = 45°, B = 60°, a = 10. Find side b.",
          solution: "b ≈ 12.25",
          steps: ["Using sine law:", "10/sin(45°) = b/sin(60°)", "b = 10 × sin(60°) / sin(45°)", "b = 10 × (√3/2) / (√2/2)", "b = 10 × √3/√2 ≈ 12.25"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "قانون الجيب يستخدم مع ضلعين وزاوية مقابلة. قانون جيب التمام يستخدم مع ضلعين وزاوية محصورة أو ثلاثة أضلاع.",
      en: "Sine law is used with two sides and opposite angle. Cosine law is used with two sides and included angle or three sides."
    }
  },
  
  // ==================== الرياضيات - التفاضل والتكامل ====================
  {
    id: "limits",
    titleAr: "النهايات",
    titleEn: "Limits",
    subject: "math",
    unit: "calculus",
    unitAr: "التفاضل والتكامل",
    unitEn: "Calculus",
    duration: 22,
    isFree: true,
    order: 9,
    
    objectives: {
      ar: [
        "فهم مفهوم النهاية وتعريفها",
        "حساب نهايات الدوال المختلفة",
        "التعامل مع الصور غير المعينة",
        "تطبيق نظرية السندويتش"
      ],
      en: [
        "Understand limit concept and definition",
        "Calculate limits of various functions",
        "Handle indeterminate forms",
        "Apply squeeze theorem"
      ]
    },
    
    introduction: {
      ar: `**مفهوم النهاية:**

النهاية هي القيمة التي تقترب منها الدالة عندما يقترب المتغير من قيمة معينة.

**الرمز:**
lim(x→a) f(x) = L

تعني: عندما يقترب x من a، تقترب f(x) من L.

**خصائص النهايات:**

1. lim(x→a) [f(x) ± g(x)] = lim f(x) ± lim g(x)
2. lim(x→a) [f(x) × g(x)] = lim f(x) × lim g(x)
3. lim(x→a) [f(x)/g(x)] = lim f(x) / lim g(x)  (إذا كان lim g(x) ≠ 0)

**الصور غير المعينة:**
- 0/0
- ∞/∞
- ∞ - ∞
- 0 × ∞
- 1^∞

**طرق حل الصور غير المعينة:**
1. التحليل
2. القسمة على أعلى أس
3. النضيد (للحدود الجذرية)
4. قاعدة لوبيتال`,
      en: `**Limit Concept:**

The value a function approaches as variable approaches a specific value.

**Notation:**
lim(x→a) f(x) = L

Means: as x approaches a, f(x) approaches L.

**Limit Properties:**

1. lim(x→a) [f(x) ± g(x)] = lim f(x) ± lim g(x)
2. lim(x→a) [f(x) × g(x)] = lim f(x) × lim g(x)
3. lim(x→a) [f(x)/g(x)] = lim f(x) / lim g(x)  (if lim g(x) ≠ 0)

**Indeterminate Forms:**
- 0/0
- ∞/∞
- ∞ - ∞
- 0 × ∞
- 1^∞

**Methods for Indeterminate Forms:**
1. Factoring
2. Divide by highest power
3. Rationalization (for radical expressions)
4. L'Hôpital's rule`
    },
    
    keyConcepts: {
      ar: [
        { term: "النهاية", definition: "القيمة التي تقترب منها الدالة" },
        { term: "صورة غير معينة", definition: "صورة تحتاج تبسيط مثل 0/0" },
        { term: "النهايات الأحادية الجانب", definition: "نهاية من اليمين أو اليسار" },
        { term: "الاستمرارية", definition: "وجود النهاية وتساويها مع قيمة الدالة" }
      ],
      en: [
        { term: "Limit", definition: "Value function approaches" },
        { term: "Indeterminate Form", definition: "Form needing simplification like 0/0" },
        { term: "One-sided Limits", definition: "Limit from right or left" },
        { term: "Continuity", definition: "Existence of limit equaling function value" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "lim(x→a) c = c", explanation: "نهاية الثابت" },
        { formula: "lim(x→a) x = a", explanation: "نهاية المتغير" },
        { formula: "lim(x→0) sin(x)/x = 1", explanation: "نهاية مهمة" },
        { formula: "lim(x→∞) (1 + 1/x)^x = e", explanation: "تعريف e" }
      ],
      en: [
        { formula: "lim(x→a) c = c", explanation: "Limit of constant" },
        { formula: "lim(x→a) x = a", explanation: "Limit of variable" },
        { formula: "lim(x→0) sin(x)/x = 1", explanation: "Important limit" },
        { formula: "lim(x→∞) (1 + 1/x)^x = e", explanation: "Definition of e" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "أوجد: lim(x→2) (x² - 4) / (x - 2)",
          solution: "النهاية = 4",
          steps: ["الصورة: 0/0 (غير معينة)", "نحلل البسط: x² - 4 = (x-2)(x+2)", "نبسط: (x+2)", "lim(x→2) (x+2) = 4"]
        },
        {
          question: "أوجد: lim(x→∞) (3x² + 2x) / (x² - 5)",
          solution: "النهاية = 3",
          steps: ["نقسم على x² (أعلى أس):", "= lim (3 + 2/x) / (1 - 5/x²)", "عند x→∞: 2/x → 0 و 5/x² → 0", "= 3 / 1 = 3"]
        }
      ],
      en: [
        {
          question: "Find: lim(x→2) (x² - 4) / (x - 2)",
          solution: "Limit = 4",
          steps: ["Form: 0/0 (indeterminate)", "Factor numerator: x² - 4 = (x-2)(x+2)", "Simplify: (x+2)", "lim(x→2) (x+2) = 4"]
        },
        {
          question: "Find: lim(x→∞) (3x² + 2x) / (x² - 5)",
          solution: "Limit = 3",
          steps: ["Divide by x² (highest power):", "= lim (3 + 2/x) / (1 - 5/x²)", "As x→∞: 2/x → 0 and 5/x² → 0", "= 3 / 1 = 3"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "النهاية تقولب سلوك الدالة قرب نقطة معينة. الصور غير المعينة تحتاج تبسيط قبل الحساب.",
      en: "Limits describe function behavior near a point. Indeterminate forms need simplification before calculation."
    }
  },
  
  {
    id: "derivatives",
    titleAr: "المشتقات",
    titleEn: "Derivatives",
    subject: "math",
    unit: "calculus",
    unitAr: "التفاضل والتكامل",
    unitEn: "Calculus",
    duration: 25,
    isFree: false,
    order: 10,
    
    objectives: {
      ar: [
        "فهم تعريف المشتقة الهندسي والجبري",
        "تطبيق قواعد الاشتقاق الأساسية",
        "اشتقاق الدوال المركبة (قاعدة السلسلة)",
        "اشتقاق الدوال المثلثية والأسية"
      ],
      en: [
        "Understand geometric and algebraic derivative definition",
        "Apply basic differentiation rules",
        "Differentiate composite functions (chain rule)",
        "Differentiate trigonometric and exponential functions"
      ]
    },
    
    introduction: {
      ar: `**تعريف المشتقة:**

المشتقة هي معدل التغير اللحظي للدالة.

**التعريف الرياضي:**
f'(x) = lim(h→0) [f(x+h) - f(x)] / h

**التفسير الهندسي:**
المشتقة = ميل المماس للمنحنى عند النقطة.

**قواعد الاشتقاق الأساسية:**

1. **قاعدة القوة:** (xⁿ)' = nxⁿ⁻¹
2. **قاعدة الثابت:** (c)' = 0
3. **قاعدة المجموع:** (f + g)' = f' + g'
4. **قاعدة الضرب:** (fg)' = f'g + fg'
5. **قاعدة القسمة:** (f/g)' = (f'g - fg') / g²
6. **قاعدة السلسلة:** (f(g(x)))' = f'(g(x)) × g'(x)

**مشتقات دوال خاصة:**
- (sin x)' = cos x
- (cos x)' = -sin x
- (tan x)' = sec² x
- (eˣ)' = eˣ
- (ln x)' = 1/x`,
      en: `**Derivative Definition:**

Derivative is instantaneous rate of change of function.

**Mathematical Definition:**
f'(x) = lim(h→0) [f(x+h) - f(x)] / h

**Geometric Interpretation:**
Derivative = slope of tangent to curve at point.

**Basic Differentiation Rules:**

1. **Power Rule:** (xⁿ)' = nxⁿ⁻¹
2. **Constant Rule:** (c)' = 0
3. **Sum Rule:** (f + g)' = f' + g'
4. **Product Rule:** (fg)' = f'g + fg'
5. **Quotient Rule:** (f/g)' = (f'g - fg') / g²
6. **Chain Rule:** (f(g(x)))' = f'(g(x)) × g'(x)

**Special Function Derivatives:**
- (sin x)' = cos x
- (cos x)' = -sin x
- (tan x)' = sec² x
- (eˣ)' = eˣ
- (ln x)' = 1/x`
    },
    
    keyConcepts: {
      ar: [
        { term: "المشتقة", definition: "معدل التغير اللحظي" },
        { term: "ميل المماس", definition: "القيمة الهندسية للمشتقة" },
        { term: "قاعدة السلسلة", definition: "اشتقاق الدوال المركبة" },
        { term: "الاشتقاق الضمني", definition: "اشتقاق معادلات غير محلولة" }
      ],
      en: [
        { term: "Derivative", definition: "Instantaneous rate of change" },
        { term: "Slope of Tangent", definition: "Geometric value of derivative" },
        { term: "Chain Rule", definition: "Differentiating composite functions" },
        { term: "Implicit Differentiation", definition: "Differentiating non-solved equations" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "(xⁿ)' = nxⁿ⁻¹", explanation: "قاعدة القوة" },
        { formula: "(fg)' = f'g + fg'", explanation: "قاعدة الضرب" },
        { formula: "(f/g)' = (f'g - fg') / g²", explanation: "قاعدة القسمة" },
        { formula: "(eˣ)' = eˣ", explanation: "مشتقة الدالة الأسية" }
      ],
      en: [
        { formula: "(xⁿ)' = nxⁿ⁻¹", explanation: "Power rule" },
        { formula: "(fg)' = f'g + fg'", explanation: "Product rule" },
        { formula: "(f/g)' = (f'g - fg') / g²", explanation: "Quotient rule" },
        { formula: "(eˣ)' = eˣ", explanation: "Exponential function derivative" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "أوجد مشتقة: f(x) = 3x⁴ - 2x² + 5",
          solution: "f'(x) = 12x³ - 4x",
          steps: ["f'(x) = 3(4x³) - 2(2x) + 0", "f'(x) = 12x³ - 4x"]
        },
        {
          question: "أوجد مشتقة: g(x) = x²·sin(x)",
          solution: "g'(x) = 2x·sin(x) + x²·cos(x)",
          steps: ["باستخدام قاعدة الضرب:", "g' = (x²)'·sin(x) + x²·(sin x)'", "g' = 2x·sin(x) + x²·cos(x)"]
        }
      ],
      en: [
        {
          question: "Find derivative of: f(x) = 3x⁴ - 2x² + 5",
          solution: "f'(x) = 12x³ - 4x",
          steps: ["f'(x) = 3(4x³) - 2(2x) + 0", "f'(x) = 12x³ - 4x"]
        },
        {
          question: "Find derivative of: g(x) = x²·sin(x)",
          solution: "g'(x) = 2x·sin(x) + x²·cos(x)",
          steps: ["Using product rule:", "g' = (x²)'·sin(x) + x²·(sin x)'", "g' = 2x·sin(x) + x²·cos(x)"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "المشتقة تمثل معدل التغير. لها قواعد أساسية للقوة والضرب والقسمة والسلسلة.",
      en: "Derivative represents rate of change. It has basic rules for power, product, quotient, and chain."
    }
  },
  
  {
    id: "derivatives-applications",
    titleAr: "تطبيقات المشتقات",
    titleEn: "Applications of Derivatives",
    subject: "math",
    unit: "calculus",
    unitAr: "التفاضل والتكامل",
    unitEn: "Calculus",
    duration: 25,
    isFree: false,
    order: 11,
    
    objectives: {
      ar: [
        "إيجاد القيم العظمى والدنيا المحلية والعالمية",
        "تطبيق اختبارات الاشتقاق لتحديد القطوع",
        "رسم المنحنيات باستخدام المشتقات",
        "حل مسائل التطبيقات الحياتية"
      ],
      en: [
        "Find local and global maximum and minimum values",
        "Apply derivative tests to determine intervals",
        "Sketch curves using derivatives",
        "Solve real-life application problems"
      ]
    },
    
    introduction: {
      ar: `**القيم الحرجة:**
نقطة x₀ تسمى حرجة إذا f'(x₀) = 0 أو f'(x₀) غير موجودة.

**القيم العظمى والدنيا:**

**محلياً:**
- قيمة عظمى محلية: أكبر من جميع القيم المجاورة
- قيمة دنيا محلية: أصغر من جميع القيم المجاورة

**عالمياً:**
- قيمة عظمى مطلقة: أكبر قيمة في المجال
- قيمة دنيا مطلقة: أصغر قيمة في المجال

**اختبارات تحديد القطوع:**

**اختبار المشتقة الأولى:**
- إذا f'(x) > 0: الدالة متزايدة
- إذا f'(x) < 0: الدالة متناقصة

**اختبار المشتقة الثانية:**
- إذا f''(x₀) < 0: قيمة عظمى محلية
- إذا f''(x₀) > 0: قيمة دنيا محلية

**التقعر:**
- إذا f''(x) > 0: الدالة مقعرة للأعلى
- إذا f''(x) < 0: الدالة مقعرة للأسفل`,
      en: `**Critical Values:**
Point x₀ is critical if f'(x₀) = 0 or f'(x₀) doesn't exist.

**Maximum and Minimum:**

**Locally:**
- Local maximum: greater than all neighboring values
- Local minimum: smaller than all neighboring values

**Globally:**
- Absolute maximum: greatest value in domain
- Absolute minimum: smallest value in domain

**Tests for Intervals:**

**First Derivative Test:**
- If f'(x) > 0: function increasing
- If f'(x) < 0: function decreasing

**Second Derivative Test:**
- If f''(x₀) < 0: local maximum
- If f''(x₀) > 0: local minimum

**Concavity:**
- If f''(x) > 0: concave up
- If f''(x) < 0: concave down`
    },
    
    keyConcepts: {
      ar: [
        { term: "القيمة الحرجة", definition: "نقطة تكون فيها المشتقة صفر أو غير موجودة" },
        { term: "القيمة العظمى", definition: "أكبر قيمة في منطقة معينة" },
        { term: "نقطة الانعطاف", definition: "نقطة يتغير فيها التقعر" },
        { term: "التقعر", definition: "انحناء المنحنى للأعلى أو الأسفل" }
      ],
      en: [
        { term: "Critical Value", definition: "Point where derivative is zero or undefined" },
        { term: "Maximum", definition: "Greatest value in a region" },
        { term: "Inflection Point", definition: "Point where concavity changes" },
        { term: "Concavity", definition: "Curve bending up or down" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "f'(x) = 0", explanation: "شرط القيمة الحرجة" },
        { formula: "f''(x₀) < 0 ←→ قيمة عظمى", explanation: "اختبار المشتقة الثانية للعظمى" },
        { formula: "f''(x₀) > 0 ←→ قيمة دنيا", explanation: "اختبار المشتقة الثانية للدنيا" }
      ],
      en: [
        { formula: "f'(x) = 0", explanation: "Critical value condition" },
        { formula: "f''(x₀) < 0 ←→ maximum", explanation: "Second derivative test for max" },
        { formula: "f''(x₀) > 0 ←→ minimum", explanation: "Second derivative test for min" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "أوجد القيم العظمى والدنيا لـ: f(x) = x³ - 3x² + 4",
          solution: "قيمة عظمى عند x=0، قيمة دنيا عند x=2",
          steps: ["f'(x) = 3x² - 6x = 3x(x-2)", "القيم الحرجة: x = 0, x = 2", "f''(x) = 6x - 6", "f''(0) = -6 < 0 ←→ قيمة عظمى", "f''(2) = 6 > 0 ←→ قيمة دنيا"]
        },
        {
          question: "أوجد أبعاد مستطيل محيطه 20م لتحقيق أكبر مساحة.",
          solution: "مربع 5م × 5م، المساحة = 25م²",
          steps: ["ليكن الطول x، العرض y", "2x + 2y = 20 ←→ y = 10 - x", "المساحة A = x(10-x) = 10x - x²", "A' = 10 - 2x = 0", "x = 5، y = 5"]
        }
      ],
      en: [
        {
          question: "Find max and min values of: f(x) = x³ - 3x² + 4",
          solution: "Maximum at x=0, minimum at x=2",
          steps: ["f'(x) = 3x² - 6x = 3x(x-2)", "Critical values: x = 0, x = 2", "f''(x) = 6x - 6", "f''(0) = -6 < 0 ←→ maximum", "f''(2) = 6 > 0 ←→ minimum"]
        },
        {
          question: "Find rectangle dimensions with perimeter 20m for maximum area.",
          solution: "Square 5m × 5m, Area = 25m²",
          steps: ["Let length = x, width = y", "2x + 2y = 20 ←→ y = 10 - x", "Area A = x(10-x) = 10x - x²", "A' = 10 - 2x = 0", "x = 5, y = 5"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "المشتقات تستخدم لإيجاد القيم العظمى والدنيا وتحليل سلوك الدوال ورسومها البيانية.",
      en: "Derivatives are used to find maxima and minima and analyze function behavior and graphs."
    }
  },
  
  {
    id: "integration",
    titleAr: "التكامل",
    titleEn: "Integration",
    subject: "math",
    unit: "calculus",
    unitAr: "التفاضل والتكامل",
    unitEn: "Calculus",
    duration: 25,
    isFree: false,
    order: 12,
    
    objectives: {
      ar: [
        "فهم مفهوم التكامل كعملية عكسية للتفاضل",
        "حساب التكاملات غير المحددة",
        "تطبيق النظرية الأساسية للتفاضل والتكامل",
        "حساب التكاملات المحددة والمساحات"
      ],
      en: [
        "Understand integration as inverse of differentiation",
        "Calculate indefinite integrals",
        "Apply fundamental theorem of calculus",
        "Calculate definite integrals and areas"
      ]
    },
    
    introduction: {
      ar: `**التكامل:**

التكامل هو العملية العكسية للتفاضل.

**التكامل غير المحدد:**
∫f(x)dx = F(x) + C

حيث F(x) هي الدالة الأصلية (المشتقة العكسية).

**قواعد التكامل الأساسية:**

1. ∫xⁿdx = xⁿ⁺¹/(n+1) + C  (n ≠ -1)
2. ∫eˣdx = eˣ + C
3. ∫(1/x)dx = ln|x| + C
4. ∫sin(x)dx = -cos(x) + C
5. ∫cos(x)dx = sin(x) + C

**التكامل المحدد:**
∫ₐᵇ f(x)dx = F(b) - F(a)

**النظرية الأساسية للتفاضل والتكامل:**
تربط التكامل بالتفاضل:
∫ₐᵇ f(x)dx = F(b) - F(a)

حيث F'(x) = f(x)

**التطبيق الهندسي:**
التكامل المحدد = المساحة تحت المنحنى`,
      en: `**Integration:**

Integration is the inverse operation of differentiation.

**Indefinite Integral:**
∫f(x)dx = F(x) + C

Where F(x) is the antiderivative.

**Basic Integration Rules:**

1. ∫xⁿdx = xⁿ⁺¹/(n+1) + C  (n ≠ -1)
2. ∫eˣdx = eˣ + C
3. ∫(1/x)dx = ln|x| + C
4. ∫sin(x)dx = -cos(x) + C
5. ∫cos(x)dx = sin(x) + C

**Definite Integral:**
∫ₐᵇ f(x)dx = F(b) - F(a)

**Fundamental Theorem of Calculus:**
Connects integration with differentiation:
∫ₐᵇ f(x)dx = F(b) - F(a)

Where F'(x) = f(x)

**Geometric Application:**
Definite integral = Area under curve`
    },
    
    keyConcepts: {
      ar: [
        { term: "التكامل غير المحدد", definition: "إيجاد الدالة الأصلية مع ثابت" },
        { term: "التكامل المحدد", definition: "القيمة العددية للمساحة تحت المنحنى" },
        { term: "الدالة الأصلية", definition: "الدالة التي مشتقتها تساوي الدالة المعطاة" },
        { term: "ثابت التكامل", definition: "الثابت C الذي يضاف للتكامل غير المحدد" }
      ],
      en: [
        { term: "Indefinite Integral", definition: "Finding antiderivative with constant" },
        { term: "Definite Integral", definition: "Numerical value of area under curve" },
        { term: "Antiderivative", definition: "Function whose derivative equals given function" },
        { term: "Constant of Integration", definition: "Constant C added to indefinite integral" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C", explanation: "قاعدة القوة" },
        { formula: "∫ₐᵇ f(x)dx = F(b) - F(a)", explanation: "النظرية الأساسية" },
        { formula: "∫eˣdx = eˣ + C", explanation: "تكامل الدالة الأسية" },
        { formula: "∫sin(x)dx = -cos(x) + C", explanation: "تكامل الجيب" }
      ],
      en: [
        { formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C", explanation: "Power rule" },
        { formula: "∫ₐᵇ f(x)dx = F(b) - F(a)", explanation: "Fundamental theorem" },
        { formula: "∫eˣdx = eˣ + C", explanation: "Exponential function integral" },
        { formula: "∫sin(x)dx = -cos(x) + C", explanation: "Sine integral" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "أوجد التكامل غير المحدد: ∫(3x² - 2x + 1)dx",
          solution: "x³ - x² + x + C",
          steps: ["∫3x²dx = x³", "∫(-2x)dx = -x²", "∫1dx = x", "النتيجة: x³ - x² + x + C"]
        },
        {
          question: "احسب التكامل المحدد: ∫₀² (x² + 1)dx",
          solution: "القيمة = 14/3",
          steps: ["∫(x² + 1)dx = x³/3 + x", "F(2) = 8/3 + 2 = 14/3", "F(0) = 0", "التكامل = 14/3 - 0 = 14/3"]
        }
      ],
      en: [
        {
          question: "Find the indefinite integral: ∫(3x² - 2x + 1)dx",
          solution: "x³ - x² + x + C",
          steps: ["∫3x²dx = x³", "∫(-2x)dx = -x²", "∫1dx = x", "Result: x³ - x² + x + C"]
        },
        {
          question: "Calculate the definite integral: ∫₀² (x² + 1)dx",
          solution: "Value = 14/3",
          steps: ["∫(x² + 1)dx = x³/3 + x", "F(2) = 8/3 + 2 = 14/3", "F(0) = 0", "Integral = 14/3 - 0 = 14/3"]
        }
      ]
    },
    
    simulators: ["functions"],
    
    summary: {
      ar: "التكامل العملية العكسية للتفاضل. التكامل المحدد يحسب المساحة تحت المنحنى.",
      en: "Integration is the inverse of differentiation. Definite integral calculates area under curve."
    }
  },
  
  // ==================== الكيمياء - البنية الذرية ====================
  {
    id: "atom-components",
    titleAr: "الذرة ومكوناتها",
    titleEn: "Atom and its Components",
    subject: "chemistry",
    unit: "atomic-structure",
    unitAr: "البنية الذرية",
    unitEn: "Atomic Structure",
    duration: 20,
    isFree: true,
    order: 1,
    
    objectives: {
      ar: [
        "التعرف على مكونات الذرة الأساسية",
        "التمييز بين البروتون والنيوترون والإلكترون",
        "فهم مفهوم العدد الذري والكتلة الذرية",
        "حساب عدد البروتونات والنيوترونات والإلكترونات"
      ],
      en: [
        "Identify the basic components of the atom",
        "Distinguish between protons, neutrons, and electrons",
        "Understand atomic number and atomic mass",
        "Calculate the number of protons, neutrons, and electrons"
      ]
    },
    
    introduction: {
      ar: `**الذرة (Atom):**
الذرة هي أصغر وحدة بنائية للمادة التي تحتفظ بخواص العنصر. تتكون الذرة من نواة مركزية وإلكترونات تدور حولها.

**مكونات الذرة:**

1. **النواة (Nucleus):**
   - تقع في مركز الذرة
   - تحتوي على البروتونات والنيوترونات
   - شحنتها موجبة
   - كثافتها عالية جداً

2. **البروتون (Proton):**
   - جسيم موجب الشحنة (+1)
   - كتلته ≈ 1 وحدة كتل ذرية
   - يوجد في النواة

3. **النيوترون (Neutron):**
   - جسيم متعادل الشحنة (0)
   - كتلته ≈ 1 وحدة كتل ذرية
   - يوجد في النواة

4. **الإلكترون (Electron):**
   - جسيم سالب الشحنة (-1)
   - كتلته مهملة جداً (≈ 1/1840 من البروتون)
   - يدور حول النواة في مستويات الطاقة

**الرموز الكيميائية:**
- A = عدد الكتلة (البروتونات + النيوترونات)
- Z = العدد الذري (عدد البروتونات)`,
      en: `**Atom:**
The atom is the smallest building unit of matter that retains the properties of the element. It consists of a central nucleus and electrons orbiting around it.

**Atomic Components:**

1. **Nucleus:**
   - Located at the center of the atom
   - Contains protons and neutrons
   - Positively charged
   - Very high density

2. **Proton:**
   - Positively charged particle (+1)
   - Mass ≈ 1 atomic mass unit
   - Found in the nucleus

3. **Neutron:**
   - Neutral particle (0)
   - Mass ≈ 1 atomic mass unit
   - Found in the nucleus

4. **Electron:**
   - Negatively charged particle (-1)
   - Mass is negligible (≈ 1/1840 of proton)
   - Orbits the nucleus in energy levels

**Chemical Symbols:**
- A = Mass number (protons + neutrons)
- Z = Atomic number (number of protons)`
    },
    
    keyConcepts: {
      ar: [
        { term: "الذرة", definition: "أصغر وحدة بنائية للمادة تحتفظ بخواص العنصر" },
        { term: "البروتون", definition: "جسيم موجب الشحنة في النواة، كتلته 1 و.ك.ذ" },
        { term: "النيوترون", definition: "جسيم متعادل في النواة، كتلته 1 و.ك.ذ" },
        { term: "الإلكترون", definition: "جسيم سالب الشحنة يدور حول النواة" },
        { term: "العدد الذري (Z)", definition: "عدد البروتونات في نواة الذرة" },
        { term: "عدد الكتلة (A)", definition: "مجموع البروتونات والنيوترونات" }
      ],
      en: [
        { term: "Atom", definition: "Smallest building unit of matter retaining element properties" },
        { term: "Proton", definition: "Positive particle in nucleus, mass = 1 amu" },
        { term: "Neutron", definition: "Neutral particle in nucleus, mass = 1 amu" },
        { term: "Electron", definition: "Negative particle orbiting the nucleus" },
        { term: "Atomic Number (Z)", definition: "Number of protons in the nucleus" },
        { term: "Mass Number (A)", definition: "Sum of protons and neutrons" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "A = Z + N", explanation: "عدد الكتلة = العدد الذري + عدد النيوترونات" },
        { formula: "N = A - Z", explanation: "عدد النيوترونات = عدد الكتلة - العدد الذري" },
        { formula: "عدد الإلكترونات = Z (في الذرة المتعادلة)", explanation: "عدد الإلكترونات يساوي عدد البروتونات في الذرة المتعادلة" }
      ],
      en: [
        { formula: "A = Z + N", explanation: "Mass number = Atomic number + Neutrons" },
        { formula: "N = A - Z", explanation: "Neutrons = Mass number - Atomic number" },
        { formula: "Electrons = Z (in neutral atom)", explanation: "Electrons equal protons in neutral atom" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "احسب عدد البروتونات والنيوترونات والإلكترونات في ذرة الكربون (عدد كتلته 12، عدد ذري 6).",
          solution: "البروتونات = 6، النيوترونات = 6، الإلكترونات = 6",
          steps: [
            "عدد البروتونات = العدد الذري = 6",
            "عدد النيوترونات = A - Z = 12 - 6 = 6",
            "عدد الإلكترونات = Z = 6 (ذرة متعادلة)"
          ]
        },
        {
          question: "احسب عدد النيوترونات في ذرة الصوديوم (²³Na) علماً بأن عدده الذري 11.",
          solution: "عدد النيوترونات = 12",
          steps: [
            "عدد الكتلة A = 23",
            "العدد الذري Z = 11",
            "عدد النيوترونات N = A - Z = 23 - 11 = 12"
          ]
        }
      ],
      en: [
        {
          question: "Calculate protons, neutrons, and electrons in carbon atom (mass number 12, atomic number 6).",
          solution: "Protons = 6, Neutrons = 6, Electrons = 6",
          steps: [
            "Protons = Atomic number = 6",
            "Neutrons = A - Z = 12 - 6 = 6",
            "Electrons = Z = 6 (neutral atom)"
          ]
        },
        {
          question: "Calculate neutrons in sodium atom (²³Na) with atomic number 11.",
          solution: "Neutrons = 12",
          steps: [
            "Mass number A = 23",
            "Atomic number Z = 11",
            "Neutrons N = A - Z = 23 - 11 = 12"
          ]
        }
      ]
    },
    
    simulators: ["periodicTable"],
    
    summary: {
      ar: "تتكون الذرة من نواة تحتوي على بروتونات موجبة ونيوترونات متعادلة، وإلكترونات سالبة تدور حولها. العدد الذري = عدد البروتونات، وعدد الكتلة = البروتونات + النيوترونات.",
      en: "The atom consists of a nucleus containing positive protons and neutral neutrons, with negative electrons orbiting around. Atomic number = protons, Mass number = protons + neutrons."
    }
  },
  
  {
    id: "electronic-configuration",
    titleAr: "التوزيع الإلكتروني",
    titleEn: "Electronic Configuration",
    subject: "chemistry",
    unit: "atomic-structure",
    unitAr: "البنية الذرية",
    unitEn: "Atomic Structure",
    duration: 25,
    isFree: true,
    order: 2,
    
    objectives: {
      ar: [
        "فهم مفهوم مستويات الطاقة",
        "تطبيق قاعدة 2n² لحساب عدد الإلكترونات",
        "إجراء التوزيع الإلكتروني للعناصر",
        "فهم قواعد الملء (قاعدة هوند)"
      ],
      en: [
        "Understand energy levels concept",
        "Apply 2n² rule to calculate electrons",
        "Perform electronic configuration for elements",
        "Understand filling rules (Hund's rule)"
      ]
    },
    
    introduction: {
      ar: `**التوزيع الإلكتروني:**
هو توزيع إلكترونات الذرة على مستويات الطاقة المختلفة حول النواة.

**مستويات الطاقة (Energy Levels):**
- تسمى أيضاً الغلاف الإلكتروني
- تُرقم بالأرقام 1، 2، 3، 4... أو الحروف K، L، M، N...
- كل مستوى له سعة محددة من الإلكترونات

**قاعدة 2n²:**
تحسب السعة القصوى للإلكترونات في كل مستوى طاقة:
- المستوى الأول (K): 2 × 1² = 2 إلكترون
- المستوى الثاني (L): 2 × 2² = 8 إلكترونات
- المستوى الثالث (M): 2 × 3² = 18 إلكترون
- المستوى الرابع (N): 2 × 4² = 32 إلكترون

**قواعد الملء:**
1. **مبدأ أوفباو**: تُملأ المستويات من الأقل طاقة للأعلى
2. **قاعدة هوند**: الإلكترونات توزع منفصلة في المدارات المتساوية قبل التقارن
3. **قاعدة الاستقرار**: المستوى الأخير يجب أن يحتوي على 8 إلكترونات (قاعدة الثماني)`,
      en: `**Electronic Configuration:**
Distribution of atom's electrons among different energy levels around the nucleus.

**Energy Levels:**
- Also called electron shells
- Numbered 1, 2, 3, 4... or letters K, L, M, N...
- Each level has a maximum capacity

**2n² Rule:**
Calculates maximum electrons in each energy level:
- First level (K): 2 × 1² = 2 electrons
- Second level (L): 2 × 2² = 8 electrons
- Third level (M): 2 × 3² = 18 electrons
- Fourth level (N): 2 × 4² = 32 electrons

**Filling Rules:**
1. **Aufbau principle**: Fill levels from lowest to highest energy
2. **Hund's rule**: Electrons distribute singly before pairing
3. **Stability rule**: Last level should contain 8 electrons (octet rule)`
    },
    
    keyConcepts: {
      ar: [
        { term: "مستوى الطاقة", definition: "الغلاف الذي تدور فيه الإلكترونات حول النواة" },
        { term: "قاعدة 2n²", definition: "قاعدة لحساب السعة القصوى للإلكترونات في كل مستوى" },
        { term: "مبدأ أوفباو", definition: "ملء المستويات من الأقل طاقة للأعلى" },
        { term: "قاعدة هوند", definition: "توزيع الإلكترونات منفصلة قبل التقارن" },
        { term: "التوزيع الإلكتروني", definition: "ترتيب الإلكترونات في مستويات الطاقة" }
      ],
      en: [
        { term: "Energy Level", definition: "Shell where electrons orbit the nucleus" },
        { term: "2n² Rule", definition: "Rule to calculate maximum electrons per level" },
        { term: "Aufbau Principle", definition: "Filling levels from lowest to highest energy" },
        { term: "Hund's Rule", definition: "Distribute electrons singly before pairing" },
        { term: "Electronic Configuration", definition: "Arrangement of electrons in energy levels" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "السعة القصوى = 2n²", explanation: "حساب عدد الإلكترونات في مستوى الطاقة n" },
        { formula: "2, 8, 18, 32", explanation: "السعات القصوى للمستويات الأربعة الأولى" }
      ],
      en: [
        { formula: "Maximum capacity = 2n²", explanation: "Calculate electrons in energy level n" },
        { formula: "2, 8, 18, 32", explanation: "Maximum capacities of first four levels" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "أجرِ التوزيع الإلكتروني لذرة الأكسجين (العدد الذري 8).",
          solution: "التوزيع: 2, 6",
          steps: [
            "المستوى الأول (K): يأخذ 2 إلكترون (السعة القصوى)",
            "المستوى الثاني (L): الباقي = 8 - 2 = 6 إلكترونات",
            "التوزيع الإلكتروني: 2, 6"
          ]
        },
        {
          question: "أجرِ التوزيع الإلكتروني لذرة الكالسيوم (العدد الذري 20).",
          solution: "التوزيع: 2, 8, 8, 2",
          steps: [
            "المستوى الأول (K): 2 إلكترون",
            "المستوى الثاني (L): 8 إلكترونات",
            "المستوى الثالث (M): 8 إلكترونات (للاستقرار)",
            "المستوى الرابع (N): 20 - 18 = 2 إلكترون",
            "التوزيع الإلكتروني: 2, 8, 8, 2"
          ]
        }
      ],
      en: [
        {
          question: "Write the electronic configuration for oxygen atom (atomic number 8).",
          solution: "Configuration: 2, 6",
          steps: [
            "First level (K): takes 2 electrons (maximum capacity)",
            "Second level (L): remaining = 8 - 2 = 6 electrons",
            "Electronic configuration: 2, 6"
          ]
        },
        {
          question: "Write the electronic configuration for calcium atom (atomic number 20).",
          solution: "Configuration: 2, 8, 8, 2",
          steps: [
            "First level (K): 2 electrons",
            "Second level (L): 8 electrons",
            "Third level (M): 8 electrons (for stability)",
            "Fourth level (N): 20 - 18 = 2 electrons",
            "Electronic configuration: 2, 8, 8, 2"
          ]
        }
      ]
    },
    
    simulators: ["periodicTable"],
    
    summary: {
      ar: "التوزيع الإلكتروني هو توزيع الإلكترونات على مستويات الطاقة. قاعدة 2n² تحدد السعة القصوى. تُملأ المستويات من الأقل طاقة للأعلى وفقاً لمبدأ أوفباو.",
      en: "Electronic configuration is distribution of electrons among energy levels. 2n² rule determines maximum capacity. Levels fill from lowest to highest energy following Aufbau principle."
    }
  },
  
  {
    id: "periodic-table",
    titleAr: "الجدول الدوري",
    titleEn: "Periodic Table",
    subject: "chemistry",
    unit: "atomic-structure",
    unitAr: "البنية الذرية",
    unitEn: "Atomic Structure",
    duration: 25,
    isFree: true,
    order: 3,
    
    objectives: {
      ar: [
        "التعرف على تاريخ تطور الجدول الدوري",
        "فهم ترتيب العناصر في الجدول الدوري",
        "التمييز بين المجموعات والدورات",
        "التعرف على تصنيفات العناصر"
      ],
      en: [
        "Learn the history of periodic table development",
        "Understand arrangement of elements in periodic table",
        "Distinguish between groups and periods",
        "Identify element classifications"
      ]
    },
    
    introduction: {
      ar: `**الجدول الدوري:**
هو جدول يرتب فيه العناصر الكيميائية حسب أعدادها الذرية وخواصها.

**تاريخ الجدول الدوري:**
1. **مندليف (1869)**: رتب العناصر حسب كتلتها الذرية
2. **موزلي (1913)**: عدّل الترتيب حسب العدد الذري

**ترتيب الجدول الدوري:**
- **الدورات (Rows)**: صفوف أفقية مرقمة 1-7
- **المجموعات (Columns)**: أعمدة رأسية مرقمة 1-18

**تصنيف العناصر:**
1. **الفلزات (Metals)**: 
   - لماعة، موصلة للكهرباء والحرارة
   - قابلة للطرق والسحب
   - تقع يسار الجدول

2. **اللافلزات (Non-metals)**:
   - غير لماعة، رديئة التوصيل
   - تقع يمين الجدول

3. **أشباه الفلزات (Metalloids)**:
   - خواص متوسطة
   - تقع على الخط الفاصل

**مجموعات مهمة:**
- المجموعة 1: الفلزات القلوية (Li, Na, K...)
- المجموعة 2: الفلزات القلوية الأرضية (Mg, Ca...)
- المجموعة 17: الهالوجينات (F, Cl, Br, I)
- المجموعة 18: الغازات النبيلة (He, Ne, Ar...)`,
      en: `**Periodic Table:**
A table arranging chemical elements by atomic numbers and properties.

**History:**
1. **Mendeleev (1869)**: Arranged elements by atomic mass
2. **Moseley (1913)**: Modified arrangement by atomic number

**Arrangement:**
- **Periods (Rows)**: Horizontal rows numbered 1-7
- **Groups (Columns)**: Vertical columns numbered 1-18

**Element Classification:**
1. **Metals**:
   - Shiny, conduct electricity and heat
   - Malleable and ductile
   - Located left side

2. **Non-metals**:
   - Non-shiny, poor conductors
   - Located right side

3. **Metalloids**:
   - Intermediate properties
   - Located on the dividing line

**Important Groups:**
- Group 1: Alkali metals (Li, Na, K...)
- Group 2: Alkaline earth metals (Mg, Ca...)
- Group 17: Halogens (F, Cl, Br, I)
- Group 18: Noble gases (He, Ne, Ar...)`
    },
    
    keyConcepts: {
      ar: [
        { term: "الدورة", definition: "صف أفقي في الجدول الدوري، عدد مستويات الطاقة" },
        { term: "المجموعة", definition: "عمود رأسي، العناصر لها نفس عدد إلكترونات التكافؤ" },
        { term: "الفلزات", definition: "عناصر لماعة موصلة، تقع يسار الجدول" },
        { term: "اللافلزات", definition: "عناصر غير لماعة، تقع يمين الجدول" },
        { term: "الغازات النبيلة", definition: "عناصر مستقرة في المجموعة 18" }
      ],
      en: [
        { term: "Period", definition: "Horizontal row in periodic table, number of energy levels" },
        { term: "Group", definition: "Vertical column, elements have same valence electrons" },
        { term: "Metals", definition: "Shiny conductive elements on left side" },
        { term: "Non-metals", definition: "Non-shiny elements on right side" },
        { term: "Noble Gases", definition: "Stable elements in group 18" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "رقم المجموعة = عدد إلكترونات التكافؤ (للعناصر الرئيسية)", explanation: "تحديد موقع العنصر" },
        { formula: "رقم الدورة = عدد مستويات الطاقة", explanation: "تحديد دورة العنصر" }
      ],
      en: [
        { formula: "Group number = Valence electrons (for main elements)", explanation: "Determine element position" },
        { formula: "Period number = Number of energy levels", explanation: "Determine element period" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "حدد موقع عنصر الكلور (العدد الذري 17) في الجدول الدوري.",
          solution: "المجموعة 17، الدورة 3",
          steps: [
            "التوزيع الإلكتروني: 2, 8, 7",
            "عدد مستويات الطاقة = 3 → الدورة 3",
            "عدد إلكترونات التكافؤ = 7 → المجموعة 17"
          ]
        }
      ],
      en: [
        {
          question: "Determine the position of chlorine (atomic number 17) in the periodic table.",
          solution: "Group 17, Period 3",
          steps: [
            "Electronic configuration: 2, 8, 7",
            "Number of energy levels = 3 → Period 3",
            "Valence electrons = 7 → Group 17"
          ]
        }
      ]
    },
    
    simulators: ["periodicTable"],
    
    summary: {
      ar: "الجدول الدوري يرتب العناصر حسب العدد الذري. الدورات تمثل مستويات الطاقة، والمجموعات تمثل إلكترونات التكافؤ.",
      en: "The periodic table arranges elements by atomic number. Periods represent energy levels, groups represent valence electrons."
    }
  },
  
  {
    id: "periodic-trends",
    titleAr: "الاتجاهات الدورية",
    titleEn: "Periodic Trends",
    subject: "chemistry",
    unit: "atomic-structure",
    unitAr: "البنية الذرية",
    unitEn: "Atomic Structure",
    duration: 20,
    isFree: false,
    order: 4,
    
    objectives: {
      ar: [
        "فهم مفهوم الحجم الذري وتغيراته",
        "فهم طاقة التأين وتغيراتها",
        "فهم السالبية الكهربية وتغيراتها",
        "توقع خواص العناصر من موقعها"
      ],
      en: [
        "Understand atomic radius and its changes",
        "Understand ionization energy changes",
        "Understand electronegativity changes",
        "Predict element properties from position"
      ]
    },
    
    introduction: {
      ar: `**الاتجاهات الدورية:**
هي التغيرات المنتظمة في خواص العناصر عند الانتقال في الجدول الدوري.

**1. الحجم الذري (Atomic Radius):**
- هو نصف المسافة بين مركزي ذرتين متجاورتين
- **في الدورة**: يقل من اليسار لليمين (لزيادة الشحنة النووية)
- **في المجموعة**: يزيد من الأعلى للأسفل (لزيادة مستويات الطاقة)

**2. طاقة التأين (Ionization Energy):**
- الطاقة اللازمة لنزع إلكترون من الذرة
- **في الدورة**: تزيد من اليسار لليمين
- **في المجموعة**: تقل من الأعلى للأسفل
- الغازات النبيلة أعلى طاقة تأين

**3. السالبية الكهربية (Electronegativity):**
- قدرة الذرة على جذب إلكترونات الرابطة
- **في الدورة**: تزيد من اليسار لليمين
- **في المجموعة**: تقل من الأعلى للأسفل
- الفلور أعلى سالبية (4.0)

**4. الألفة الإلكترونية (Electron Affinity):**
- الطاقة المنطلقة عند إضافة إلكترون
- الهالوجينات أعلى ألفة إلكترونية`,
      en: `**Periodic Trends:**
Regular changes in element properties when moving through the periodic table.

**1. Atomic Radius:**
- Half the distance between centers of two adjacent atoms
- **In period**: Decreases left to right (increasing nuclear charge)
- **In group**: Increases top to bottom (increasing energy levels)

**2. Ionization Energy:**
- Energy required to remove an electron from atom
- **In period**: Increases left to right
- **In group**: Decreases top to bottom
- Noble gases have highest ionization energy

**3. Electronegativity:**
- Ability of atom to attract bonding electrons
- **In period**: Increases left to right
- **In group**: Decreases top to bottom
- Fluorine highest electronegativity (4.0)

**4. Electron Affinity:**
- Energy released when adding an electron
- Halogens have highest electron affinity`
    },
    
    keyConcepts: {
      ar: [
        { term: "الحجم الذري", definition: "نصف المسافة بين مركزي ذرتين متجاورتين" },
        { term: "طاقة التأين", definition: "الطاقة اللازمة لنزع إلكترون من الذرة المعتدلة" },
        { term: "السالبية الكهربية", definition: "قدرة الذرة على جذب إلكترونات الرابطة" },
        { term: "الألفة الإلكترونية", definition: "الطاقة المنطلقة عند إضافة إلكترون" }
      ],
      en: [
        { term: "Atomic Radius", definition: "Half distance between centers of two adjacent atoms" },
        { term: "Ionization Energy", definition: "Energy required to remove electron from neutral atom" },
        { term: "Electronegativity", definition: "Ability of atom to attract bonding electrons" },
        { term: "Electron Affinity", definition: "Energy released when adding an electron" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "الحجم الذري ∝ 1/الشحنة النووية الفعالة", explanation: "علاقة عكسية مع الشحنة النووية" },
        { formula: "طاقة التأين ∝ 1/الحجم الذري", explanation: "علاقة عكسية مع الحجم الذري" }
      ],
      en: [
        { formula: "Atomic radius ∝ 1/Effective nuclear charge", explanation: "Inverse relationship with nuclear charge" },
        { formula: "Ionization energy ∝ 1/Atomic radius", explanation: "Inverse relationship with atomic radius" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "رتّب العناصر التالية تنازعياً حسب الحجم الذري: Na, K, Li",
          solution: "K > Na > Li",
          steps: [
            "جميعها في المجموعة 1 (فلزات قلوية)",
            "الترتيب من الأعلى للأسفل: Li, Na, K",
            "الحجم يزيد في المجموعة من الأعلى للأسفل",
            "إذن: K > Na > Li"
          ]
        },
        {
          question: "أي عنصر له أعلى طاقة تأين: Mg أم Al؟",
          solution: "Mg له طاقة تأين أعلى",
          steps: [
            "Mg: التوزيع 2,8,2 (مستوى مكتمل جزئياً)",
            "Al: التوزيع 2,8,3",
            "Mg أكثر استقراراً في مستواه الأخير",
            "إذن طاقة تأين Mg أعلى من Al"
          ]
        }
      ],
      en: [
        {
          question: "Arrange the following elements by atomic radius: Na, K, Li",
          solution: "K > Na > Li",
          steps: [
            "All are in Group 1 (alkali metals)",
            "Order from top to bottom: Li, Na, K",
            "Radius increases in group from top to bottom",
            "Therefore: K > Na > Li"
          ]
        },
        {
          question: "Which element has higher ionization energy: Mg or Al?",
          solution: "Mg has higher ionization energy",
          steps: [
            "Mg: Configuration 2,8,2 (partially filled level)",
            "Al: Configuration 2,8,3",
            "Mg is more stable in its outer level",
            "Therefore Mg has higher ionization energy than Al"
          ]
        }
      ]
    },
    
    simulators: ["periodicTable"],
    
    summary: {
      ar: "الاتجاهات الدورية تشمل: الحجم الذري (يقل في الدورة، يزيد في المجموعة)، طاقة التأين والسالبية (تزيد في الدورة، تقل في المجموعة).",
      en: "Periodic trends include: atomic radius (decreases in period, increases in group), ionization energy and electronegativity (increase in period, decrease in group)."
    }
  },
  
  // ==================== الكيمياء - الروابط الكيميائية ====================
  {
    id: "ionic-bonding",
    titleAr: "الرابطة الأيونية",
    titleEn: "Ionic Bonding",
    subject: "chemistry",
    unit: "bonding",
    unitAr: "الروابط الكيميائية",
    unitEn: "Chemical Bonding",
    duration: 20,
    isFree: true,
    order: 5,
    
    objectives: {
      ar: [
        "فهم مفهوم الرابطة الأيونية",
        "التعرف على كيفية تكون الرابطة الأيونية",
        "معرفة خصائص المركبات الأيونية",
        "كتابة صيغة المركبات الأيونية"
      ],
      en: [
        "Understand ionic bonding concept",
        "Learn how ionic bonds form",
        "Know properties of ionic compounds",
        "Write formulas of ionic compounds"
      ]
    },
    
    introduction: {
      ar: `**الرابطة الأيونية (Ionic Bond):**
هي قوة جذب كهربائية بين أيونات موجبة وأيونات سالبة.

**كيفية التكوين:**
1. يفقد الفلز إلكترونات ويصبح أيوناً موجباً (كاتيون)
2. يكتسب اللافلز إلكترونات ويصبح أيوناً سالباً (أنيون)
3. تنشأ قوة جذب بين الأيونات المتعاكسة

**مثال: كلوريد الصوديوم (NaCl)**
- Na يفقد إلكتروناً: Na → Na⁺ + e⁻
- Cl يكتسب إلكتروناً: Cl + e⁻ → Cl⁻
- التكوين: Na⁺ + Cl⁻ → NaCl

**خصائص المركبات الأيونية:**
1. صلبة في درجة الحرارة العادية
2. درجات انصهار وغليان عالية
3. تذوب في الماء وتتفكك لأيونات
4. توصل الكهرباء في الحالة المصهورة أو المحلول المائي
5. تشكل بلورات منتظمة`,
      en: `**Ionic Bond:**
Electrostatic attraction between positive and negative ions.

**Formation:**
1. Metal loses electrons and becomes positive ion (cation)
2. Non-metal gains electrons and becomes negative ion (anion)
3. Attraction force develops between opposite ions

**Example: Sodium Chloride (NaCl)**
- Na loses electron: Na → Na⁺ + e⁻
- Cl gains electron: Cl + e⁻ → Cl⁻
- Formation: Na⁺ + Cl⁻ → NaCl

**Properties of Ionic Compounds:**
1. Solid at room temperature
2. High melting and boiling points
3. Dissolve in water and dissociate into ions
4. Conduct electricity when molten or in aqueous solution
5. Form regular crystals`
    },
    
    keyConcepts: {
      ar: [
        { term: "الرابطة الأيونية", definition: "قوة جذب بين أيونات متعاكسة الشحنة" },
        { term: "الكاتيون", definition: "أيون موجب الشحنة (يفقد إلكترونات)" },
        { term: "الأنيون", definition: "أيون سالب الشحنة (يكتسب إلكترونات)" },
        { term: "البلورة الأيونية", definition: "تركيب منتظم من الأيونات في المركبات الأيونية" }
      ],
      en: [
        { term: "Ionic Bond", definition: "Attraction force between oppositely charged ions" },
        { term: "Cation", definition: "Positively charged ion (loses electrons)" },
        { term: "Anion", definition: "Negatively charged ion (gains electrons)" },
        { term: "Ionic Crystal", definition: "Regular arrangement of ions in ionic compounds" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "Na + Cl → NaCl", explanation: "تكوين كلوريد الصوديوم" },
        { formula: "Mg + 2Cl → MgCl₂", explanation: "تكوين كلوريد المغنيسيوم" },
        { formula: "2Al + 3O → Al₂O₃", explanation: "تكوين أكسيد الألومنيوم" }
      ],
      en: [
        { formula: "Na + Cl → NaCl", explanation: "Formation of sodium chloride" },
        { formula: "Mg + 2Cl → MgCl₂", explanation: "Formation of magnesium chloride" },
        { formula: "2Al + 3O → Al₂O₃", explanation: "Formation of aluminum oxide" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "وضح كيف يتكون أكسيد المغنيسيوم (MgO).",
          solution: "Mg يفقد 2 إلكترون، O يكتسب 2 إلكترون",
          steps: [
            "المغنيسيوم (Mg): التوزيع 2,8,2 - يفقد 2 إلكترون",
            "Mg → Mg²⁺ + 2e⁻",
            "الأكسجين (O): التوزيع 2,6 - يكتسب 2 إلكترون",
            "O + 2e⁻ → O²⁻",
            "Mg²⁺ + O²⁻ → MgO"
          ]
        }
      ],
      en: [
        {
          question: "Explain how magnesium oxide (MgO) forms.",
          solution: "Mg loses 2 electrons, O gains 2 electrons",
          steps: [
            "Magnesium (Mg): Configuration 2,8,2 - loses 2 electrons",
            "Mg → Mg²⁺ + 2e⁻",
            "Oxygen (O): Configuration 2,6 - gains 2 electrons",
            "O + 2e⁻ → O²⁻",
            "Mg²⁺ + O²⁻ → MgO"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "الرابطة الأيونية تتكون بين الفلز واللافلز، حيث يفقد الفلز إلكترونات ويكتسبها اللافلز. المركبات الأيونية صلبة ذات درجات انصهار عالية وتوصل الكهرباء مصهورة أو مذابة.",
      en: "Ionic bond forms between metal and non-metal, where metal loses electrons and non-metal gains them. Ionic compounds are solids with high melting points and conduct electricity when molten or dissolved."
    }
  },
  
  {
    id: "covalent-bonding",
    titleAr: "الرابطة التساهمية",
    titleEn: "Covalent Bonding",
    subject: "chemistry",
    unit: "bonding",
    unitAr: "الروابط الكيميائية",
    unitEn: "Chemical Bonding",
    duration: 22,
    isFree: true,
    order: 6,
    
    objectives: {
      ar: [
        "فهم مفهوم الرابطة التساهمية",
        "التمييز بين الرابطة التساهمية الأحادية والثنائية والثلاثية",
        "معرفة خصائص المركبات التساهمية",
        "فهم القطبية في الروابط التساهمية"
      ],
      en: [
        "Understand covalent bonding concept",
        "Distinguish between single, double, triple bonds",
        "Know properties of covalent compounds",
        "Understand polarity in covalent bonds"
      ]
    },
    
    introduction: {
      ar: `**الرابطة التساهمية (Covalent Bond):**
هي رابطة تتكون من اشتراك ذرتين في زوج أو أكثر من الإلكترونات.

**أنواع الروابط التساهمية:**

1. **رابطة أحادية (Single Bond):**
   - اشتراك في زوج واحد من الإلكترونات
   - مثال: H-H في جزيء H₂

2. **رابطة ثنائية (Double Bond):**
   - اشتراك في زوجين من الإلكترونات
   - مثال: O=O في جزيء O₂

3. **رابطة ثلاثية (Triple Bond):**
   - اشتراك في ثلاثة أزواج
   - مثال: N≡N في جزيء N₂

**أنواع المركبات التساهمية:**

1. **مركبات تساهمية قطبية:**
   - اختلاف في السالبية الكهربية بين الذرتين
   - مثال: H₂O, HCl

2. **مركبات تساهمية غير قطبية:**
   - تساوي السالبية الكهربية
   - مثال: H₂, O₂, Cl₂

**خصائص المركبات التساهمية:**
1. سائلة أو غازية في درجة الحرارة العادية
2. درجات انصهار وغليان منخفضة
3. لا توصل الكهرباء
4. تذوب في المذيبات العضوية`,
      en: `**Covalent Bond:**
A bond formed by sharing one or more pairs of electrons between two atoms.

**Types of Covalent Bonds:**

1. **Single Bond:**
   - Sharing one pair of electrons
   - Example: H-H in H₂ molecule

2. **Double Bond:**
   - Sharing two pairs of electrons
   - Example: O=O in O₂ molecule

3. **Triple Bond:**
   - Sharing three pairs
   - Example: N≡N in N₂ molecule

**Types of Covalent Compounds:**

1. **Polar Covalent Compounds:**
   - Difference in electronegativity between atoms
   - Example: H₂O, HCl

2. **Non-polar Covalent Compounds:**
   - Equal electronegativity
   - Example: H₂, O₂, Cl₂

**Properties of Covalent Compounds:**
1. Liquid or gas at room temperature
2. Low melting and boiling points
3. Do not conduct electricity
4. Dissolve in organic solvents`
    },
    
    keyConcepts: {
      ar: [
        { term: "الرابطة التساهمية", definition: "اشتراك ذرتين في زوج أو أكثر من الإلكترونات" },
        { term: "الرابطة الأحادية", definition: "اشتراك في زوج واحد من الإلكترونات" },
        { term: "الرابطة القطبية", definition: "رابطة مع اختلاف في السالبية الكهربية" },
        { term: "الرابطة غير القطبية", definition: "رابطة مع تساوي السالبية الكهربية" }
      ],
      en: [
        { term: "Covalent Bond", definition: "Sharing one or more electron pairs between atoms" },
        { term: "Single Bond", definition: "Sharing one pair of electrons" },
        { term: "Polar Bond", definition: "Bond with electronegativity difference" },
        { term: "Non-polar Bond", definition: "Bond with equal electronegativity" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "H· + ·H → H:H (H₂)", explanation: "تكوين رابطة أحادية" },
        { formula: "Ö: + :Ö → O=O (O₂)", explanation: "تكوين رابطة ثنائية" },
        { formula: ":N···N: → N≡N", explanation: "تكوين رابطة ثلاثية" }
      ],
      en: [
        { formula: "H· + ·H → H:H (H₂)", explanation: "Single bond formation" },
        { formula: "Ö: + :Ö → O=O (O₂)", explanation: "Double bond formation" },
        { formula: ":N···N: → N≡N", explanation: "Triple bond formation" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "وضح تكوين جزيء الماء (H₂O) برابطة تساهمية.",
          solution: "الأكسجين يشترك مع ذرتين هيدروجين",
          steps: [
            "الأكسجين: التوزيع 2,6 - يحتاج 2 إلكترون للاستقرار",
            "الهيدروجين: التوزيع 1 - يحتاج 1 إلكترون للاستقرار",
            "كل ذرة H تشترك مع O في زوج إلكترونات",
            "تتكون رابطتان تساهميتان أحاديتان: H-O-H"
          ]
        }
      ],
      en: [
        {
          question: "Explain water molecule (H₂O) formation with covalent bond.",
          solution: "Oxygen shares with two hydrogen atoms",
          steps: [
            "Oxygen: Configuration 2,6 - needs 2 electrons for stability",
            "Hydrogen: Configuration 1 - needs 1 electron for stability",
            "Each H atom shares one electron pair with O",
            "Two single covalent bonds form: H-O-H"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "الرابطة التساهمية تتكون من اشتراك الذرات في إلكترونات. تكون بين اللافلزات. المركبات التساهمية ذات درجات انصهار منخفضة ولا توصل الكهرباء.",
      en: "Covalent bond forms by atoms sharing electrons. Occurs between non-metals. Covalent compounds have low melting points and don't conduct electricity."
    }
  },
  
  {
    id: "metallic-bonding",
    titleAr: "الرابطة الفلزية",
    titleEn: "Metallic Bonding",
    subject: "chemistry",
    unit: "bonding",
    unitAr: "الروابط الكيميائية",
    unitEn: "Chemical Bonding",
    duration: 18,
    isFree: false,
    order: 7,
    
    objectives: {
      ar: [
        "فهم مفهوم الرابطة الفلزية",
        "تفسير خصائص الفلزات من خلال الرابطة الفلزية",
        "المقارنة بين أنواع الروابط الكيميائية"
      ],
      en: [
        "Understand metallic bonding concept",
        "Explain metal properties through metallic bonding",
        "Compare types of chemical bonds"
      ]
    },
    
    introduction: {
      ar: `**الرابطة الفلزية (Metallic Bond):**
هي قوة جذب بين أيونات الفلز الموجبة والبحر من الإلكترونات الحرة.

**نموذج بحر الإلكترونات:**
- تتخلى ذرات الفلز عن إلكتروناتها الخارجية
- تتحول لأيونات موجبة مرتبة في شبكة
- الإلكترونات تتحرك حرة في كل الاتجاهات (بحر الإلكترونات)
- قوة الجذب بين الأيونات والإلكترونات هي الرابطة الفلزية

**تفسير خصائص الفلزات:**

1. **التوصيل الكهربائي:**
   - الإلكترونات الحرة تتحرك وتنقل الشحنة

2. **التوصيل الحراري:**
   - حركة الإلكترونات تنقل الطاقة الحرارية

3. **اللمعان:**
   - الإلكترونات تعكس الضوء الساقط

4. **القابلية للطرق والسحب:**
   - يمكن تحريك الأيونات دون كسر الرابطة

5. **درجات الانصهار المرتفعة:**
   - قوة الرابطة الفلزية كبيرة`,
      en: `**Metallic Bond:**
Attraction force between positive metal ions and the sea of free electrons.

**Electron Sea Model:**
- Metal atoms release their outer electrons
- Transform into positive ions arranged in a lattice
- Electrons move freely in all directions (electron sea)
- Attraction between ions and electrons is the metallic bond

**Explaining Metal Properties:**

1. **Electrical Conductivity:**
   - Free electrons move and transfer charge

2. **Thermal Conductivity:**
   - Electron movement transfers thermal energy

3. **Luster:**
   - Electrons reflect incident light

4. **Malleability and Ductility:**
   - Ions can move without breaking bonds

5. **High Melting Points:**
   - Metallic bond strength is high`
    },
    
    keyConcepts: {
      ar: [
        { term: "الرابطة الفلزية", definition: "جذب بين أيونات فلزية موجبة وإلكترونات حرة" },
        { term: "بحر الإلكترونات", definition: "الإلكترونات الحرة المتحركة في الفلز" },
        { term: "الشبكة البلورية", definition: "ترتيب منتظم لأيونات الفلز" }
      ],
      en: [
        { term: "Metallic Bond", definition: "Attraction between positive metal ions and free electrons" },
        { term: "Electron Sea", definition: "Free electrons moving in metal" },
        { term: "Crystal Lattice", definition: "Regular arrangement of metal ions" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "M → Mⁿ⁺ + ne⁻", explanation: "تحول ذرة الفلز لأيون مع إلكترونات حرة" }
      ],
      en: [
        { formula: "M → Mⁿ⁺ + ne⁻", explanation: "Metal atom transformation to ion with free electrons" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "فسّر لماذا يمكن سحب النحاس على شكل أسلاك؟",
          solution: "بسبب حركة الأيونات والإلكترونات الحرة",
          steps: [
            "النحاس فلز له رابطة فلزية",
            "الأيونات الموجبة يمكن أن تنزلق فوق بعضها",
            "بحر الإلكترونات يظل يربطها معاً",
            "لا تنكسر الرابطة عند التشكيل"
          ]
        }
      ],
      en: [
        {
          question: "Explain why copper can be drawn into wires.",
          solution: "Due to movement of ions and free electrons",
          steps: [
            "Copper is a metal with metallic bonding",
            "Positive ions can slide over each other",
            "Electron sea continues to bind them together",
            "Bonds don't break during deformation"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "الرابطة الفلزية هي جذب بين أيونات موجبة وإلكترونات حرة. تفسر خصائص الفلزات: التوصيل، اللمعان، القابلية للطرق والسحب.",
      en: "Metallic bond is attraction between positive ions and free electrons. Explains metal properties: conductivity, luster, malleability, ductility."
    }
  },
  
  {
    id: "intermolecular-forces",
    titleAr: "القوى بين الجزيئية",
    titleEn: "Intermolecular Forces",
    subject: "chemistry",
    unit: "bonding",
    unitAr: "الروابط الكيميائية",
    unitEn: "Chemical Bonding",
    duration: 20,
    isFree: false,
    order: 8,
    
    objectives: {
      ar: [
        "التمييز بين الروابط الجزيئية والقوى بين الجزيئية",
        "فهم أنواع القوى بين الجزيئية",
        "تفسير خواص المواد بالقوى بين الجزيئية"
      ],
      en: [
        "Distinguish between molecular bonds and intermolecular forces",
        "Understand types of intermolecular forces",
        "Explain material properties using intermolecular forces"
      ]
    },
    
    introduction: {
      ar: `**القوى بين الجزيئية:**
هي قوى جذب ضعيفة بين الجزيئات، وهي المسؤولة عن الحالة الفيزيائية للمادة.

**أنواع القوى بين الجزيئية:**

**1. قوى فان دير فالس (Van der Waals Forces):**
- أضعف أنواع القوى بين الجزيئية
- تنشأ من تجمعات الإلكترونات العابرة
- توجد في جميع الجزيئات
- تقسم إلى:
  - قوى لندن (في الجزيئات غير القطبية)
  - قوى ثنائية القطب-ثنائية القطب (في الجزيئات القطبية)

**2. الرابطة الهيدروجينية (Hydrogen Bonding):**
- أقوى أنواع القوى بين الجزيئية
- تتكون عندما يرتبط الهيدروجين مع F, O, N
- مثال: الماء (H₂O) يتميز بارتفاع درجة الغليان بسبب هذه الرابطة

**مقارنة القوى (من الأضعف للأقوى):**
قوى لندن < ثنائية القطب < الرابطة الهيدروجينية < الروابط الكيميائية

**تأثير القوى على الخواص:**
- كلما كانت القوى أقوى، ارتفعت درجة الغليان والانصهار
- الرابطة الهيدروجينية تجعل الماء سائلاً في درجة الحرارة العادية`,
      en: `**Intermolecular Forces:**
Weak attraction forces between molecules, responsible for physical state of matter.

**Types of Intermolecular Forces:**

**1. Van der Waals Forces:**
- Weakest intermolecular forces
- Arise from transient electron clusters
- Exist in all molecules
- Divided into:
  - London forces (in non-polar molecules)
  - Dipole-dipole forces (in polar molecules)

**2. Hydrogen Bonding:**
- Strongest intermolecular force
- Forms when hydrogen bonds with F, O, N
- Example: Water (H₂O) has high boiling point due to this bond

**Force Comparison (weakest to strongest):**
London forces < Dipole-dipole < Hydrogen bonding < Chemical bonds

**Effect on Properties:**
- Stronger forces mean higher boiling and melting points
- Hydrogen bonding makes water liquid at room temperature`
    },
    
    keyConcepts: {
      ar: [
        { term: "قوى فان دير فالس", definition: "قوى جذب ضعيفة بين جميع الجزيئات" },
        { term: "قوى لندن", definition: "قوى ضعيفة في الجزيئات غير القطبية" },
        { term: "الرابطة الهيدروجينية", definition: "رابطة بين H وـ F, O, N في جزيء مجاور" },
        { term: "القوى بين الجزيئية", definition: "قوى بين جزيئات المادة وليس داخلها" }
      ],
      en: [
        { term: "Van der Waals Forces", definition: "Weak attraction forces between all molecules" },
        { term: "London Forces", definition: "Weak forces in non-polar molecules" },
        { term: "Hydrogen Bond", definition: "Bond between H and F, O, N in adjacent molecule" },
        { term: "Intermolecular Forces", definition: "Forces between molecules not within them" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "قوة الرابطة الهيدروجينية > قوى فان دير فالس", explanation: "مقارنة القوى بين الجزيئية" }
      ],
      en: [
        { formula: "Hydrogen bond strength > Van der Waals forces", explanation: "Comparison of intermolecular forces" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "لماذا درجة غليان الماء (100°س) أعلى من كبريتيد الهيدروجين H₂S (-60°س)؟",
          solution: "بسبب وجود الرابطة الهيدروجينية في الماء",
          steps: [
            "الماء H₂O: الأكسجين مرتبط بالهيدروجين",
            "تتكون روابط هيدروجينية بين جزيئات الماء",
            "H₂S: الكبريت لا يكون روابط هيدروجينية قوية",
            "الرابطة الهيدروجينية ترفع درجة الغليان"
          ]
        }
      ],
      en: [
        {
          question: "Why is water's boiling point (100°C) higher than H₂S (-60°C)?",
          solution: "Due to hydrogen bonding in water",
          steps: [
            "Water H₂O: Oxygen bonded to hydrogen",
            "Hydrogen bonds form between water molecules",
            "H₂S: Sulfur doesn't form strong hydrogen bonds",
            "Hydrogen bonding raises boiling point"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "القوى بين الجزيئية هي قوى جذب بين الجزيئات. أضعفها قوى لندن وأقواها الرابطة الهيدروجينية. تؤثر على درجات الانصهار والغليان.",
      en: "Intermolecular forces are attraction between molecules. London forces are weakest, hydrogen bonding strongest. They affect melting and boiling points."
    }
  },
  
  // ==================== الكيمياء - التفاعلات الكيميائية ====================
  {
    id: "types-of-reactions",
    titleAr: "أنواع التفاعلات",
    titleEn: "Types of Reactions",
    subject: "chemistry",
    unit: "reactions",
    unitAr: "التفاعلات الكيميائية",
    unitEn: "Chemical Reactions",
    duration: 22,
    isFree: true,
    order: 9,
    
    objectives: {
      ar: [
        "التعرف على أنواع التفاعلات الكيميائية",
        "التمييز بين تفاعلات الاتحاد والتفكك والاحتراق",
        "كتابة معادلات التفاعلات المختلفة",
        "التنبؤ بنواتج التفاعلات"
      ],
      en: [
        "Identify types of chemical reactions",
        "Distinguish between combination, decomposition, combustion",
        "Write equations for different reactions",
        "Predict reaction products"
      ]
    },
    
    introduction: {
      ar: `**التفاعل الكيميائي:**
هو عملية تتحول فيها مواد (المتفاعلات) إلى مواد جديدة (النواتج).

**أنواع التفاعلات الكيميائية:**

**1. تفاعل الاتحاد (Combination Reaction):**
- اتحد مادتان أو أكثر لتكوين مادة واحدة
- الصيغة العامة: A + B → AB
- مثال: 2H₂ + O₂ → 2H₂O

**2. تفاعل التفكك (Decomposition Reaction):**
- مادة واحدة تتفكك إلى مادتين أو أكثر
- الصيغة العامة: AB → A + B
- مثال: 2H₂O → 2H₂ + O₂

**3. تفاعل الاحتراق (Combustion Reaction):**
- تفاعل مادة مع الأكسجين مع انطلاق طاقة
- مثال: CH₄ + 2O₂ → CO₂ + 2H₂O

**4. تفاعل الإحلال الأحادي (Single Replacement):**
- عنصر يحل محل عنصر آخر في المركب
- الصيغة: A + BC → AC + B
- مثال: Zn + 2HCl → ZnCl₂ + H₂

**5. تفاعل الإحلال المزدوج (Double Replacement):**
- تبادل الأيونات بين مركبين
- الصيغة: AB + CD → AD + CB
- مثال: NaCl + AgNO₃ → AgCl + NaNO₃`,
      en: `**Chemical Reaction:**
Process where substances (reactants) transform into new substances (products).

**Types of Chemical Reactions:**

**1. Combination Reaction:**
- Two or more substances combine to form one substance
- General formula: A + B → AB
- Example: 2H₂ + O₂ → 2H₂O

**2. Decomposition Reaction:**
- One substance breaks into two or more substances
- General formula: AB → A + B
- Example: 2H₂O → 2H₂ + O₂

**3. Combustion Reaction:**
- Substance reacts with oxygen releasing energy
- Example: CH₄ + 2O₂ → CO₂ + 2H₂O

**4. Single Replacement Reaction:**
- Element replaces another element in compound
- Formula: A + BC → AC + B
- Example: Zn + 2HCl → ZnCl₂ + H₂

**5. Double Replacement Reaction:**
- Ion exchange between two compounds
- Formula: AB + CD → AD + CB
- Example: NaCl + AgNO₃ → AgCl + NaNO₃`
    },
    
    keyConcepts: {
      ar: [
        { term: "تفاعل الاتحاد", definition: "اتحاد مادتين أو أكثر لتكوين مادة واحدة" },
        { term: "تفاعل التفكك", definition: "تفكك مادة واحدة إلى مادتين أو أكثر" },
        { term: "تفاعل الاحتراق", definition: "تفاعل مع الأكسجين مع انطلاق طاقة" },
        { term: "تفاعل الإحلال", definition: "استبدال عنصر بعنصر آخر" }
      ],
      en: [
        { term: "Combination Reaction", definition: "Two or more substances combine into one" },
        { term: "Decomposition Reaction", definition: "One substance breaks into two or more" },
        { term: "Combustion Reaction", definition: "Reaction with oxygen releasing energy" },
        { term: "Replacement Reaction", definition: "Element replaces another element" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "A + B → AB", explanation: "تفاعل اتحاد" },
        { formula: "AB → A + B", explanation: "تفاعل تفكك" },
        { formula: "مادة + O₂ → أكاسيد + طاقة", explanation: "تفاعل احتراق" }
      ],
      en: [
        { formula: "A + B → AB", explanation: "Combination reaction" },
        { formula: "AB → A + B", explanation: "Decomposition reaction" },
        { formula: "Substance + O₂ → oxides + energy", explanation: "Combustion reaction" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "حدد نوع التفاعل: CaO + CO₂ → CaCO₃",
          solution: "تفاعل اتحاد",
          steps: [
            "المتفاعلات: مادتان (CaO و CO₂)",
            "الناتج: مادة واحدة (CaCO₃)",
            "اتحاد مادتين لتكوين مادة واحدة = تفاعل اتحاد"
          ]
        },
        {
          question: "اكتب معادلة احتراق البروبان C₃H₈",
          solution: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
          steps: [
            "البروبان يحتوي على C و H",
            "الاحتراق ينتج CO₂ و H₂O",
            "C₃H₈ + O₂ → CO₂ + H₂O (غير متوازنة)",
            "بالتوازن: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O"
          ]
        }
      ],
      en: [
        {
          question: "Identify reaction type: CaO + CO₂ → CaCO₃",
          solution: "Combination reaction",
          steps: [
            "Reactants: two substances (CaO and CO₂)",
            "Product: one substance (CaCO₃)",
            "Two substances combine into one = combination reaction"
          ]
        },
        {
          question: "Write combustion equation for propane C₃H₈",
          solution: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
          steps: [
            "Propane contains C and H",
            "Combustion produces CO₂ and H₂O",
            "C₃H₈ + O₂ → CO₂ + H₂O (unbalanced)",
            "Balanced: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "التفاعلات الكيميائية أنواع: اتحاد (A+B→AB)، تفكك (AB→A+B)، احتراق (مع O₂)، إحلال أحادي ومزدوج.",
      en: "Chemical reactions types: combination (A+B→AB), decomposition (AB→A+B), combustion (with O₂), single and double replacement."
    }
  },
  
  {
    id: "balancing-equations",
    titleAr: "توازن المعادلات",
    titleEn: "Balancing Equations",
    subject: "chemistry",
    unit: "reactions",
    unitAr: "التفاعلات الكيميائية",
    unitEn: "Chemical Reactions",
    duration: 25,
    isFree: true,
    order: 10,
    
    objectives: {
      ar: [
        "فهم قانون حفظ الكتلة",
        "تطبيق خطوات توازن المعادلات الكيميائية",
        "موازنة المعادلات البسيطة والمعقدة"
      ],
      en: [
        "Understand law of conservation of mass",
        "Apply steps to balance chemical equations",
        "Balance simple and complex equations"
      ]
    },
    
    introduction: {
      ar: `**قانون حفظ الكتلة:**
"الكتلة لا تُخلق ولا تُفنى، وإنما تتحول من شكل لآخر."

في التفاعل الكيميائي:
- كتلة المتفاعلات = كتلة النواتج
- عدد ذرات كل عنصر في المتفاعلات = عدد ذراته في النواتج

**خطوات توازن المعادلات:**

1. **اكتب المعادلة غير المتوازنة**
   - مثال: Fe + O₂ → Fe₂O₃

2. **عدّ الذرات في كل جانب**
   - المتفاعلات: Fe=1, O=2
   - النواتج: Fe=2, O=3

3. **وازن العناصر واحدة تلو الأخرى**
   - ابدأ بالعنصر الأكثر تعقيداً
   - ضع معاملات (أرقام) أمام الصيغ

4. **تحقق من التوازن**
   - عدد الذرات متساوٍ في كلا الجانبين

**نصائح:**
- لا تغيّر الصيغ الكيميائية (الأرقام السفلية)
- ضع المعاملات (الأرقام العلوية) فقط
- ابدأ بالعنصر الأقل أنواعاً من المركبات`,
      en: `**Law of Conservation of Mass:**
"Mass is neither created nor destroyed, only transformed."

In chemical reactions:
- Mass of reactants = Mass of products
- Number of atoms of each element in reactants = in products

**Steps to Balance Equations:**

1. **Write unbalanced equation**
   - Example: Fe + O₂ → Fe₂O₃

2. **Count atoms on each side**
   - Reactants: Fe=1, O=2
   - Products: Fe=2, O=3

3. **Balance elements one by one**
   - Start with most complex element
   - Add coefficients (numbers) before formulas

4. **Verify balance**
   - Atom counts equal on both sides

**Tips:**
- Don't change chemical formulas (subscripts)
- Only add coefficients (superscripts)
- Start with element appearing in fewest compounds`
    },
    
    keyConcepts: {
      ar: [
        { term: "قانون حفظ الكتلة", definition: "الكتلة لا تفنى ولا تستحدث من العدم" },
        { term: "المعامل", definition: "رقم يوضع قبل الصيغة الكيميائية لتوازن المعادلة" },
        { term: "الصيغة الكيميائية", definition: "تمثيل المركب برموز العناصر" }
      ],
      en: [
        { term: "Conservation of Mass", definition: "Mass cannot be created or destroyed" },
        { term: "Coefficient", definition: "Number placed before formula to balance equation" },
        { term: "Chemical Formula", definition: "Representation of compound using element symbols" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "∑كتلة المتفاعلات = ∑كتلة النواتج", explanation: "قانون حفظ الكتلة" }
      ],
      en: [
        { formula: "∑mass of reactants = ∑mass of products", explanation: "Law of conservation of mass" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "وازن المعادلة: Fe + O₂ → Fe₂O₃",
          solution: "4Fe + 3O₂ → 2Fe₂O₃",
          steps: [
            "عد الذرات: Fe:1, O:2 ← Fe:2, O:3",
            "وازن Fe: 2Fe + O₂ → Fe₂O₃",
            "وازن O: 2Fe + ³⁄₂O₂ → Fe₂O₃",
            "اضرب في 2: 4Fe + 3O₂ → 2Fe₂O₃",
            "تحقق: Fe:4, O:6 = Fe:4, O:6 ✓"
          ]
        },
        {
          question: "وازن معادلة احتراق الميثان: CH₄ + O₂ → CO₂ + H₂O",
          solution: "CH₄ + 2O₂ → CO₂ + 2H₂O",
          steps: [
            "عد الذرات: C:1, H:4, O:2 ← C:1, H:2, O:3",
            "وازن C: متوازن (1:1)",
            "وازن H: CH₄ + O₂ → CO₂ + 2H₂O",
            "وازن O: CH₄ + 2O₂ → CO₂ + 2H₂O",
            "تحقق: C:1, H:4, O:4 = C:1, H:4, O:4 ✓"
          ]
        }
      ],
      en: [
        {
          question: "Balance: Fe + O₂ → Fe₂O₃",
          solution: "4Fe + 3O₂ → 2Fe₂O₃",
          steps: [
            "Count atoms: Fe:1, O:2 ← Fe:2, O:3",
            "Balance Fe: 2Fe + O₂ → Fe₂O₃",
            "Balance O: 2Fe + ³⁄₂O₂ → Fe₂O₃",
            "Multiply by 2: 4Fe + 3O₂ → 2Fe₂O₃",
            "Verify: Fe:4, O:6 = Fe:4, O:6 ✓"
          ]
        },
        {
          question: "Balance methane combustion: CH₄ + O₂ → CO₂ + H₂O",
          solution: "CH₄ + 2O₂ → CO₂ + 2H₂O",
          steps: [
            "Count atoms: C:1, H:4, O:2 ← C:1, H:2, O:3",
            "Balance C: balanced (1:1)",
            "Balance H: CH₄ + O₂ → CO₂ + 2H₂O",
            "Balance O: CH₄ + 2O₂ → CO₂ + 2H₂O",
            "Verify: C:1, H:4, O:4 = C:1, H:4, O:4 ✓"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "توازن المعادلات يطبق قانون حفظ الكتلة. نضع معاملات أمام الصيغ لجعل عدد الذرات متساوياً في المتفاعلات والنواتج.",
      en: "Balancing equations applies conservation of mass. We add coefficients before formulas to make atom counts equal in reactants and products."
    }
  },
  
  {
    id: "reaction-rate",
    titleAr: "سرعة التفاعل",
    titleEn: "Reaction Rate",
    subject: "chemistry",
    unit: "reactions",
    unitAr: "التفاعلات الكيميائية",
    unitEn: "Chemical Reactions",
    duration: 20,
    isFree: false,
    order: 11,
    
    objectives: {
      ar: [
        "فهم مفهوم سرعة التفاعل",
        "معرفة العوامل المؤثرة في سرعة التفاعل",
        "فهم نظرية التصادم"
      ],
      en: [
        "Understand reaction rate concept",
        "Know factors affecting reaction rate",
        "Understand collision theory"
      ]
    },
    
    introduction: {
      ar: `**سرعة التفاعل (Reaction Rate):**
هي التغير في تركيز المتفاعلات أو النواتج في وحدة الزمن.

**وحدة القياس:** مول/لتر.ثانية (mol/L.s)

**نظرية التصادم:**
لكي يحدث تفاعل كيميائي يجب:
1. تصادم بين جزيئات المتفاعلات
2. طاقة تصادم كافية (طاقة التنشيط)
3. اتجاه صحيح للتصادم

**العوامل المؤثرة في سرعة التفاعل:**

**1. طبيعة المواد المتفاعلة:**
- بعض المواد تتفاعل بسرعة (مثل الفلزات القلوية)
- مواد أخرى بطيئة (مثل تفاعلات الأكسدة البطيئة)

**2. التركيز:**
- زيادة التركيز → زيادة عدد التصادمات → زيادة السرعة

**3. درجة الحرارة:**
- زيادة الحرارة → زيادة طاقة الجزيئات → زيادة السرعة
- قاعدة: كل 10°س تضاعف السرعة تقريباً

**4. مساحة السطح:**
- زيادة مساحة السطح → زيادة التصادمات → زيادة السرعة
- المساحيق تتفاعل أسرع من الكتل الكبيرة

**5. العوامل الحفازة (Catalysts):**
- تسرع التفاعل دون أن تُستهلك
- تقلل طاقة التنشيط`,
      en: `**Reaction Rate:**
Change in concentration of reactants or products per unit time.

**Unit:** mol/L.s

**Collision Theory:**
For a chemical reaction to occur:
1. Collision between reactant molecules
2. Sufficient collision energy (activation energy)
3. Correct collision orientation

**Factors Affecting Reaction Rate:**

**1. Nature of Reactants:**
- Some substances react quickly (like alkali metals)
- Others are slow (like slow oxidation reactions)

**2. Concentration:**
- Higher concentration → more collisions → higher rate

**3. Temperature:**
- Higher temperature → more molecular energy → higher rate
- Rule: Every 10°C approximately doubles the rate

**4. Surface Area:**
- Larger surface area → more collisions → higher rate
- Powders react faster than large chunks

**5. Catalysts:**
- Speed up reaction without being consumed
- Lower activation energy`
    },
    
    keyConcepts: {
      ar: [
        { term: "سرعة التفاعل", definition: "التغير في تركيز المواد لكل وحدة زمن" },
        { term: "طاقة التنشيط", definition: "الحد الأدنى من الطاقة اللازمة للتفاعل" },
        { term: "العامل الحفاز", definition: "مادة تسرع التفاعل دون استهلاك" },
        { term: "نظرية التصادم", definition: "التفاعل يتطلب تصادم فعال" }
      ],
      en: [
        { term: "Reaction Rate", definition: "Change in substance concentration per unit time" },
        { term: "Activation Energy", definition: "Minimum energy required for reaction" },
        { term: "Catalyst", definition: "Substance that speeds up reaction without being consumed" },
        { term: "Collision Theory", definition: "Reaction requires effective collision" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "السرعة = -Δ[المتفاعلات]/Δt", explanation: "سرعة التفاعل (نقصان المتفاعلات)" },
        { formula: "السرعة = +Δ[النواتج]/Δt", explanation: "سرعة التفاعل (زيادة النواتج)" }
      ],
      en: [
        { formula: "Rate = -Δ[Reactants]/Δt", explanation: "Reaction rate (reactant decrease)" },
        { formula: "Rate = +Δ[Products]/Δt", explanation: "Reaction rate (product increase)" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "فسّر لماذا يتفاعل مسحوق الحديد بسرعة مع الحمض بينما قطعة الحديد ببطء؟",
          solution: "بسبب اختلاف مساحة السطح",
          steps: [
            "مسحوق الحديد له مساحة سطح كبيرة",
            "قطعة الحديد لها مساحة سطح صغيرة",
            "مساحة السطح الأكبر = تصادمات أكثر",
            "تصادمات أكثر = سرعة تفاعل أعلى"
          ]
        }
      ],
      en: [
        {
          question: "Explain why iron powder reacts quickly with acid while an iron piece reacts slowly.",
          solution: "Due to surface area difference",
          steps: [
            "Iron powder has large surface area",
            "Iron piece has small surface area",
            "Larger surface area = more collisions",
            "More collisions = higher reaction rate"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "سرعة التفاعل تعتمد على: طبيعة المواد، التركيز، درجة الحرارة، مساحة السطح، العوامل الحفازة. نظرية التصادم تفسر سرعة التفاعل.",
      en: "Reaction rate depends on: nature of substances, concentration, temperature, surface area, catalysts. Collision theory explains reaction rate."
    }
  },
  
  {
    id: "chemical-equilibrium",
    titleAr: "الاتزان الكيميائي",
    titleEn: "Chemical Equilibrium",
    subject: "chemistry",
    unit: "reactions",
    unitAr: "التفاعلات الكيميائية",
    unitEn: "Chemical Reactions",
    duration: 25,
    isFree: false,
    order: 12,
    
    objectives: {
      ar: [
        "فهم مفهوم الاتزان الكيميائي",
        "فهم خصائص الاتزان الكيميائي",
        "تطبيق قانون فعل الكتلة",
        "فهم مبدأ لوشاتيليه"
      ],
      en: [
        "Understand chemical equilibrium concept",
        "Understand chemical equilibrium properties",
        "Apply law of mass action",
        "Understand Le Chatelier's principle"
      ]
    },
    
    introduction: {
      ar: `**الاتزان الكيميائي:**
هو حالة يصل فيها التفاعل العكوس إلى استقرار، حيث تصبح سرعة التفاعل الأمامي مساوية لسرعة التفاعل العكسي.

**التعبير عن الاتزان:**
A + B ⇌ C + D

**خصائص الاتزان الكيميائي:**
1. التفاعل عكوس
2. سرعة التفاعل المباشر = سرعة التفاعل العكسي
3. ثبات تركيزات المتفاعلات والنواتج
4. الاتزان ديناميكي (ليس ثابتاً تماماً)

**قانون فعل الكتلة:**
Kc = [النواتج] / [المتفاعلات]
للتفاعل: aA + bB ⇌ cC + dD
Kc = [C]^c × [D]^d / [A]^a × [B]^b

**مبدأ لوشاتيليه:**
"عند تغيير ظروف نظام في حالة اتزان، يتحول النظام في الاتجاه الذي يخفف أثر هذا التغيير."

**تأثير التغييرات على الاتزان:**
1. **زيادة التركيز**: يتحول الاتزان لاستهلاك المادة المضافة
2. **زيادة الضغط**: يتحول نحو جانب عدد المولات الأقل (في الغازات)
3. **زيادة الحرارة**: يتحول نحو التفاعل الماص للحرارة`,
      en: `**Chemical Equilibrium:**
A state where a reversible reaction reaches stability, with forward reaction rate equal to reverse reaction rate.

**Equilibrium Expression:**
A + B ⇌ C + D

**Properties of Chemical Equilibrium:**
1. Reaction is reversible
2. Forward rate = Reverse rate
3. Concentrations of reactants and products remain constant
4. Equilibrium is dynamic (not completely static)

**Law of Mass Action:**
Kc = [Products] / [Reactants]
For reaction: aA + bB ⇌ cC + dD
Kc = [C]^c × [D]^d / [A]^a × [B]^b

**Le Chatelier's Principle:**
"When conditions of a system at equilibrium change, the system shifts to reduce the effect of this change."

**Effect of Changes on Equilibrium:**
1. **Increased concentration**: Shift to consume added substance
2. **Increased pressure**: Shift toward fewer moles (in gases)
3. **Increased temperature**: Shift toward endothermic reaction`
    },
    
    keyConcepts: {
      ar: [
        { term: "الاتزان الكيميائي", definition: "تساوي سرعة التفاعلين المباشر والعكسي" },
        { term: "ثابت الاتزان (Kc)", definition: "نسبة حاصل ضرب تركيزات النواتج على المتفاعلات" },
        { term: "مبدأ لوشاتيليه", definition: "النظام يقاوم التغيير في ظروف الاتزان" },
        { term: "التفاعل العكوس", definition: "تفاعل يسير في الاتجاهين" }
      ],
      en: [
        { term: "Chemical Equilibrium", definition: "Forward and reverse reaction rates are equal" },
        { term: "Equilibrium Constant (Kc)", definition: "Ratio of product concentrations to reactant concentrations" },
        { term: "Le Chatelier's Principle", definition: "System resists change in equilibrium conditions" },
        { term: "Reversible Reaction", definition: "Reaction proceeding in both directions" }
      ]
    },
    
    formulas: {
      ar: [
        { formula: "Kc = [C]^c × [D]^d / [A]^a × [B]^b", explanation: "ثابت الاتزان للتفاعل aA + bB ⇌ cC + dD" },
        { formula: "Kp = (P_C)^c × (P_D)^d / (P_A)^a × (P_B)^b", explanation: "ثابت الاتزان بالضغوط الجزئية" }
      ],
      en: [
        { formula: "Kc = [C]^c × [D]^d / [A]^a × [B]^b", explanation: "Equilibrium constant for aA + bB ⇌ cC + dD" },
        { formula: "Kp = (P_C)^c × (P_D)^d / (P_A)^a × (P_B)^b", explanation: "Equilibrium constant using partial pressures" }
      ]
    },
    
    examples: {
      ar: [
        {
          question: "اكتب تعبير ثابت الاتزان للتفاعل: N₂ + 3H₂ ⇌ 2NH₃",
          solution: "Kc = [NH₃]² / [N₂][H₂]³",
          steps: [
            "حدد المعاملات: N₂(1), H₂(3), NH₃(2)",
            "النواتج في البسط: [NH₃]²",
            "المتفاعلات في المقام: [N₂] × [H₂]³",
            "Kc = [NH₃]² / [N₂][H₂]³"
          ]
        },
        {
          question: "ما أثر زيادة الضغط على تفاعل: N₂ + 3H₂ ⇌ 2NH₃؟",
          solution: "يتحول الاتزان نحو اليمين (نحو NH₃)",
          steps: [
            "عدد مولات المتفاعلات: 1 + 3 = 4 مول",
            "عدد مولات النواتج: 2 مول",
            "زيادة الضغط تحول نحو عدد مولات أقل",
            "التحول نحو اليمين (تكوين NH₃)"
          ]
        }
      ],
      en: [
        {
          question: "Write equilibrium constant expression for: N₂ + 3H₂ ⇌ 2NH₃",
          solution: "Kc = [NH₃]² / [N₂][H₂]³",
          steps: [
            "Identify coefficients: N₂(1), H₂(3), NH₃(2)",
            "Products in numerator: [NH₃]²",
            "Reactants in denominator: [N₂] × [H₂]³",
            "Kc = [NH₃]² / [N₂][H₂]³"
          ]
        },
        {
          question: "What is the effect of increasing pressure on: N₂ + 3H₂ ⇌ 2NH₃?",
          solution: "Equilibrium shifts right (toward NH₃)",
          steps: [
            "Moles of reactants: 1 + 3 = 4 moles",
            "Moles of products: 2 moles",
            "Increased pressure shifts toward fewer moles",
            "Shift to the right (NH₃ formation)"
          ]
        }
      ]
    },
    
    simulators: [],
    
    summary: {
      ar: "الاتزان الكيميائي حالة تتساوى فيها سرعتي التفاعل المباشر والعكسي. ثابت الاتزان Kc يعبر عن نسبة التركيزات. مبدأ لوشاتيليه يتنبأ بتغيرات الاتزان.",
      en: "Chemical equilibrium is when forward and reverse reaction rates are equal. Equilibrium constant Kc expresses concentration ratio. Le Chatelier's principle predicts equilibrium changes."
    }
  }
];

// Helper functions
export function getLessonById(id: string): LessonContent | undefined {
  return lessonsData.find(lesson => lesson.id === id);
}

export function getLessonsBySubject(subject: string): LessonContent[] {
  return lessonsData.filter(lesson => lesson.subject === subject);
}

export function getLessonsByUnit(unit: string): LessonContent[] {
  return lessonsData.filter(lesson => lesson.unit === unit);
}
