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
