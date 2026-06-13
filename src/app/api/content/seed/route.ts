import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// نوع بيانات الدرس
interface LessonContent {
  lesson_id: string;
  subject: string;
  grade: string;
  term: string;
  chapter_id: string;
  chapter_name: string;
  lesson_order: number;
  lesson_title: string;
  duration_minutes: number;
  difficulty: string;
  objectives: string[];
  formulas: string[];
  tags: string[];
  video_script: string;
  questions: any[];
}

// دروس الفيزياء - الفصل الأول: التيار الكهربي
const physicsLessons: LessonContent[] = [
  {
    lesson_id: "phy-3-1-1-01",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-01-current-electricity",
    chapter_name: "التيار الكهربي وقانون أوم",
    lesson_order: 1,
    lesson_title: "الكميات الفيزيائية والتعريفات",
    duration_minutes: 15,
    difficulty: "easy",
    objectives: [
      "التعرف على الكميات الفيزيائية الأساسية في الكهربية",
      "فهم الفرق بين الكميات القياسية والمتجهة",
      "حفظ وحدات القياس الكهربية الأساسية",
      "التمييز بين الشحنة والتيار والجهد"
    ],
    formulas: ["Q = It", "V = IR", "P = VI"],
    tags: ["charge", "current", "voltage", "resistance", "units"],
    video_script: "الشحنة الكهربية هي خاصية فيزيائية للجسيمات الأولية. البروتون شحنته موجبة والإلكترون سالبة. وحدة الشحنة = كولوم. التيار = معدل مرور الشحنة = I = Q/t بالأمبير. الجهد = V = W/Q بالفولت. المقاومة = R بالأوم.",
    questions: [
      { type: "mcq", q: "ما وحدة قياس شدة التيار؟", options: ["فولت", "أمبير", "أوم", "واط"], answer: "أمبير" },
      { type: "mcq", q: "ما صيغة قانون أوم؟", options: ["V = I/R", "V = I×R", "V = I+R", "V = I-R"], answer: "V = I×R" }
    ]
  },
  {
    lesson_id: "phy-3-1-1-02",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-01-current-electricity",
    chapter_name: "التيار الكهربي وقانون أوم",
    lesson_order: 2,
    lesson_title: "شدة التيار الكهربي",
    duration_minutes: 12,
    difficulty: "medium",
    objectives: [
      "تعريف شدة التيار الكهربي",
      "فهم العلاقة I = Q/t",
      "تمييز التيار المستمر عن المتردد",
      "قياس التيار باستخدام الأميتر"
    ],
    formulas: ["I = Q/t", "I = nAeVd"],
    tags: ["current", "ammeter", "charge", "time", "DC", "AC"],
    video_script: "شدة التيار = كمية الشحنة المارة في وحدة الزمن. I = Q/t. الوحدة = أمبير = كولوم/ثانية. الأميتر جهاز قياس التيار ويوصل على التوالي. التيار المستمر DC اتجاهه ثابت (البطارية). التيار المتردد AC يتغير (المنزل 50 هرتز).",
    questions: [
      { type: "mcq", q: "كيف يوصل الأميتر؟", options: ["على التوازي", "على التوالي", "لا يوصل", "أي طريقة"], answer: "على التوالي" },
      { type: "numerical", q: "شحنة 30 كولوم مرت في 5 ثواني. احسب التيار", answer: "6" }
    ]
  },
  {
    lesson_id: "phy-3-1-1-03",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-01-current-electricity",
    chapter_name: "التيار الكهربي وقانون أوم",
    lesson_order: 3,
    lesson_title: "المقاومة الكهربية والمقاومة النوعية",
    duration_minutes: 15,
    difficulty: "medium",
    objectives: [
      "تعريف المقاومة الكهربية",
      "حساب المقاومة النوعية",
      "فهم العوامل المؤثرة في المقاومة",
      "تطبيق صيغة R = ρL/A"
    ],
    formulas: ["R = V/I", "R = ρL/A"],
    tags: ["resistance", "resistivity", "ohm", "conductor"],
    video_script: "المقاومة = ممانعة المادة لمرور التيار. وحدتها الأوم (Ω). المقاومة النوعية ρ تعتمد على نوع المادة فقط. العوامل المؤثرة: نوع المادة، الطول (طردي)، مساحة المقطع (عكسي)، درجة الحرارة. R = ρL/A.",
    questions: [
      { type: "mcq", q: "ما وحدة المقاومة؟", options: ["فولت", "أمبير", "أوم", "واط"], answer: "أوم" },
      { type: "mcq", q: "المقاومة تزيد مع...", options: ["زيادة مساحة المقطع", "زيادة الطول", "نقصان الطول", "لا تتغير"], answer: "زيادة الطول" }
    ]
  },
  {
    lesson_id: "phy-3-1-1-04",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-01-current-electricity",
    chapter_name: "التيار الكهربي وقانون أوم",
    lesson_order: 4,
    lesson_title: "قانون أوم",
    duration_minutes: 12,
    difficulty: "medium",
    objectives: [
      "فهم قانون أوم V = IR",
      "حساب التيار والجهد والمقاومة",
      "رسم العلاقة البيانية بين V و I",
      "تطبيقات قانون أوم"
    ],
    formulas: ["V = IR", "I = V/R", "R = V/I"],
    tags: ["ohms-law", "voltage", "current", "resistance"],
    video_script: "قانون أوم: الجهد = التيار × المقاومة. V = I × R. العلاقة خطية بين V و I. منحنى V-I خط مستقيم ميله = R. تطبيقات: حساب أي كمية من الكميتين الأخريين.",
    questions: [
      { type: "numerical", q: "جهد 12V عبر مقاومة 4Ω. احسب التيار", answer: "3" },
      { type: "mcq", q: "منحنى V-I لل Resistance ثابتة يكون...", options: ["منحني", "خط مستقيم", "دائرة", "قطع مكافئ"], answer: "خط مستقيم" }
    ]
  },
  {
    lesson_id: "phy-3-1-1-05",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-01-current-electricity",
    chapter_name: "التيار الكهربي وقانون أوم",
    lesson_order: 5,
    lesson_title: "توصيل المقاومات على التوالي والتوازي",
    duration_minutes: 15,
    difficulty: "medium",
    objectives: [
      "فهم التوصيل على التوالي",
      "فهم التوصيل على التوازي",
      "حساب المقاومة المكافئة",
      "مقارنة التوصيلين"
    ],
    formulas: ["Rt = R1 + R2 + ... (توالي)", "1/Rt = 1/R1 + 1/R2 + ... (توازي)"],
    tags: ["series", "parallel", "equivalent-resistance", "circuits"],
    video_script: "التوالي: المقاومات خلف بعض. التيار واحد، الجهد يتقسم. R_total = R1 + R2 + R3. التوازي: المقاومات جنب بعض. الجهد واحد، التيار يتقسم. 1/R_total = 1/R1 + 1/R2 + 1/R3.",
    questions: [
      { type: "numerical", q: "مقاومتان 3Ω و 5Ω على التوالي. احسب المكافئة", answer: "8" },
      { type: "numerical", q: "مقاومتان 6Ω على التوازي. احسب المكافئة", answer: "3" }
    ]
  },
  {
    lesson_id: "phy-3-1-1-06",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-01-current-electricity",
    chapter_name: "التيار الكهربي وقانون أوم",
    lesson_order: 6,
    lesson_title: "قانون أوم للدائرة المغلقة",
    duration_minutes: 12,
    difficulty: "hard",
    objectives: [
      "فهم القوة الدافعة الكهربية",
      "حساب التيار في الدائرة المغلقة",
      "فهم الجهد الطرفي",
      "العلاقة بين emf والجهد الداخلي"
    ],
    formulas: ["I = ε / (R + r)", "V = ε - Ir"],
    tags: ["emf", "internal-resistance", "closed-circuit", "terminal-voltage"],
    video_script: "القوة الدافعة الكهربية (emf) = ε. المقاومة الداخلية = r. قانون أوم للدائرة المغلقة: I = ε / (R + r). الجهد الطرفي V = ε - Ir. عند قصر الدائرة: I = ε/r (تيار عالي جداً).",
    questions: [
      { type: "numerical", q: "بطارية emf=12V, r=1Ω مع مقاومة خارجية 3Ω. احسب التيار", answer: "3" },
      { type: "mcq", q: "الجهد الطرفي يقل عند...", options: ["زيادة التيار", "نقصان التيار", "فتح الدائرة", "لا يتغير"], answer: "زيادة التيار" }
    ]
  },
  {
    lesson_id: "phy-3-1-1-07",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-01-current-electricity",
    chapter_name: "التيار الكهربي وقانون أوم",
    lesson_order: 7,
    lesson_title: "قانونا كيرشوف",
    duration_minutes: 15,
    difficulty: "hard",
    objectives: [
      "فهم قانون كيرشوف الأول (التيار)",
      "فهم قانون كيرشوف الثاني (الجهد)",
      "تطبيق القانونين على الدوائر المعقدة",
      "حل مسائل باستخدام قانوني كيرشوف"
    ],
    formulas: ["ΣI_in = ΣI_out (الأول)", "ΣV = ΣIR (الثاني)"],
    tags: ["kirchhoff", "junction-rule", "loop-rule", "complex-circuits"],
    video_script: "قانون كيرشوف الأول: مجموع التيارات الداخلة = مجموع التيارات الخارجة في كل فرع. ΣI_in = ΣI_out. قانون كيرشوف الثاني: مجموع فروق الجهد في أي حلقة مغلقة = صفر. ΣV = 0 أو ΣIR = Σε.",
    questions: [
      { type: "mcq", q: "قانون كيرشوف الأول يتعلق بـ...", options: ["الجهد", "التيار", "المقاومة", "القدرة"], answer: "التيار" },
      { type: "mcq", q: "قانون كيرشوف الثاني يطبق على...", options: ["الفرع", "الحلقة المغلقة", "المقاومة", "البطارية"], answer: "الحلقة المغلقة" }
    ]
  }
];

// دروس الفصل الثاني: التأثير المغناطيسي
const magneticLessons: LessonContent[] = [
  {
    lesson_id: "phy-3-1-2-01",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-02-magnetic-effect",
    chapter_name: "التأثير المغناطيسي للتيار الكهربي",
    lesson_order: 1,
    lesson_title: "كثافة الفيض المغناطيسي",
    duration_minutes: 15,
    difficulty: "medium",
    objectives: [
      "تعريف كثافة الفيض المغناطيسي",
      "حساب كثافة الفيض لسلك مستقيم",
      "فهم قاعدة اليد اليمنى",
      "وحدات قياس المجال المغناطيسي"
    ],
    formulas: ["B = μ₀I / 2πr", "B = μ₀μrI / 2πr"],
    tags: ["magnetic-field", "flux-density", "right-hand-rule", "tesla"],
    video_script: "كثافة الفيض المغناطيسي B هي عدد خطوط المجال عبر وحدة المساحات. الوحدة = تسلا (T) = ويبر/م². لسلك مستقيم: B = μ₀I / 2πr. قاعدة اليد اليمنى: الإبهام في اتجاه التيار، الأصابع في اتجاه المجال.",
    questions: [
      { type: "mcq", q: "ما وحدة كثافة الفيض المغناطيسي؟", options: ["أمبير", "تسلا", "فولت", "أوم"], answer: "تسلا" },
      { type: "mcq", q: "المجال المغناطيسي حول سلك مستقيم يكون على شكل...", options: ["خطوط مستقيمة", "دوائر", "موجات", "نقاط"], answer: "دوائر" }
    ]
  },
  {
    lesson_id: "phy-3-1-2-02",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-02-magnetic-effect",
    chapter_name: "التأثير المغناطيسي للتيار الكهربي",
    lesson_order: 2,
    lesson_title: "الملف الدائري والملف اللولبي",
    duration_minutes: 12,
    difficulty: "medium",
    objectives: [
      "حساب المجال عند مركز ملف دائري",
      "حساب المجال داخل ملف لولبي",
      "مقارنة الملفين",
      "تطبيقات الملفات"
    ],
    formulas: ["B = μ₀NI / 2r (دائري)", "B = μ₀nI (لولبي)"],
    tags: ["circular-coil", "solenoid", "magnetic-field", "turns"],
    video_script: "الملف الدائري: المجال عند المركز B = μ₀NI / 2r. N = عدد اللفات، r = نصف القطر. الملف اللولبي: المجال داخل الملف B = μ₀nI. n = عدد اللفات/الوحدة طول. الملف اللولبي يولد مجالاً منتظماً داخله.",
    questions: [
      { type: "numerical", q: "ملف لولبي n=100 لفة/م، I=2A. احسب B (μ₀=4π×10⁻⁷)", answer: "0.000251" },
      { type: "mcq", q: "المجال داخل الملف اللولبي...", options: ["منتظم", "يتغير", "صفري", "عشوائي"], answer: "منتظم" }
    ]
  },
  {
    lesson_id: "phy-3-1-2-03",
    subject: "physics",
    grade: "3",
    term: "1",
    chapter_id: "ch-02-magnetic-effect",
    chapter_name: "التأثير المغناطيسي للتيار الكهربي",
    lesson_order: 3,
    lesson_title: "القوة المغناطيسية المؤثرة على سلك",
    duration_minutes: 12,
    difficulty: "medium",
    objectives: [
      "فهم القوة المغناطيسية على سلك يمر به تيار",
      "تطبيق صيغة F = BIL sin θ",
      "تحديد اتجاه القوة",
      "تطبيقات القوة المغناطيسية"
    ],
    formulas: ["F = BIL sin θ", "F = BIL (θ = 90°)"],
    tags: ["magnetic-force", "fleming-rule", "wire", "current"],
    video_script: "القوة المغناطيسية على سلك: F = BIL sin θ. θ = الزاوية بين السلك والمجال. عند θ = 90°: F = BIL. قاعدة فلمنج لليد اليسرى: السبابة = المجال، الأوسط = التيار، الإبهام = القوة.",
    questions: [
      { type: "numerical", q: "سلك L=0.5m, I=4A في مجال B=0.2T عمودي. احسب القوة", answer: "0.4" },
      { type: "mcq", q: "القوة = صفر عندما...", options: ["التيار موازي للمجال", "التيار عمودي على المجال", "التيار صفر", "كل ما سبق"], answer: "كل ما سبق" }
    ]
  }
];

// POST /api/content/seed - تعبئة المحتوى الكامل
export async function POST() {
  try {
    console.log("Starting full content seeding...");
    
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
    
    console.log("Old data cleaned.");
    
    const allLessons = [...physicsLessons, ...magneticLessons];
    let createdLessons = 0;
    let createdQuestions = 0;
    const errors: string[] = [];
    
    for (const lessonData of allLessons) {
      try {
        // إيجاد الوحدة المناسبة
        const unitSlugPattern = lessonData.chapter_id.replace("ch-01", "mechanics").replace("ch-02", "magnetic");
        const unit = await db.unit.findFirst({
          where: {
            slug: { contains: "physics-3" }
          },
        });
        
        if (!unit) {
          errors.push(`Unit not found for lesson: ${lessonData.lesson_title}`);
          continue;
        }
        
        // إنشاء الدرس
        const lesson = await db.lesson.create({
          data: {
            unitId: unit.id,
            slug: lessonData.lesson_id,
            titleAr: lessonData.lesson_title,
            titleEn: lessonData.lesson_title,
            descriptionAr: lessonData.objectives[0] || "",
            descriptionEn: lessonData.objectives[0] || "",
            duration: lessonData.duration_minutes,
            order: lessonData.lesson_order,
            isFree: lessonData.lesson_order <= 2,
            introductionAr: lessonData.video_script,
            introductionEn: lessonData.video_script,
            summaryAr: lessonData.video_script,
            summaryEn: lessonData.video_script,
          },
        });
        
        // إضافة الأهداف
        for (let i = 0; i < lessonData.objectives.length; i++) {
          await db.objective.create({
            data: {
              lessonId: lesson.id,
              textAr: lessonData.objectives[i],
              textEn: lessonData.objectives[i],
              order: i + 1,
            },
          });
        }
        
        // إضافة المعادلات
        for (let i = 0; i < lessonData.formulas.length; i++) {
          await db.formula.create({
            data: {
              lessonId: lesson.id,
              formula: lessonData.formulas[i],
              explanationAr: lessonData.formulas[i],
              explanationEn: lessonData.formulas[i],
              order: i + 1,
            },
          });
        }
        
        // إضافة المفاهيم (من الـ tags)
        for (let i = 0; i < lessonData.tags.length; i++) {
          await db.concept.create({
            data: {
              lessonId: lesson.id,
              termAr: lessonData.tags[i],
              termEn: lessonData.tags[i],
              definitionAr: `${lessonData.tags[i]}`,
              definitionEn: `${lessonData.tags[i]}`,
              order: i + 1,
            },
          });
        }
        
        // إضافة الأسئلة
        for (let i = 0; i < lessonData.questions.length; i++) {
          const q = lessonData.questions[i];
          await db.question.create({
            data: {
              lessonId: lesson.id,
              type: q.type,
              questionAr: q.q,
              questionEn: q.q,
              optionsAr: JSON.stringify(q.options || []),
              optionsEn: JSON.stringify(q.options || []),
              answer: String(q.answer),
              points: q.type === "numerical" ? 2 : 1,
              difficulty: lessonData.difficulty,
              order: i + 1,
            },
          });
          createdQuestions++;
        }
        
        createdLessons++;
      } catch (error) {
        errors.push(`Error creating lesson ${lessonData.lesson_id}: ${String(error)}`);
      }
    }
    
    const stats = {
      lessons: createdLessons,
      questions: createdQuestions,
      errors: errors.length,
    };
    
    console.log("Content seeding completed!", stats);
    
    return NextResponse.json({
      success: true,
      message: `تم إنشاء ${createdLessons} درس و ${createdQuestions} سؤال`,
      stats,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
    });
  } catch (error) {
    console.error("Error seeding content:", error);
    return NextResponse.json(
      { error: "Failed to seed content", details: String(error) },
      { status: 500 }
    );
  }
}
