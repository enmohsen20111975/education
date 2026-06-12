import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// بيانات السنوات الدراسية
const academicYearsData = [
  { nameAr: "الصف الأول الثانوي", nameEn: "First Year Secondary", code: "first-year", order: 1 },
  { nameAr: "الصف الثاني الثانوي", nameEn: "Second Year Secondary", code: "second-year", order: 2 },
  { nameAr: "الصف الثالث الثانوي", nameEn: "Third Year Secondary", code: "third-year", order: 3 },
];

// بيانات التخصصات
const specializationsData = [
  { nameAr: "علمي علوم", nameEn: "Science", code: "science", descriptionAr: "شعبة العلوم", descriptionEn: "Science Track", order: 1 },
  { nameAr: "علمي رياضة", nameEn: "Mathematics", code: "math", descriptionAr: "شعبة الرياضيات", descriptionEn: "Mathematics Track", order: 2 },
  { nameAr: "أدبي", nameEn: "Arts", code: "arts", descriptionAr: "الشعبة الأدبية", descriptionEn: "Arts Track", order: 3 },
];

// بيانات الفصول الدراسية
const semestersData = [
  { nameAr: "الفصل الدراسي الأول", nameEn: "First Semester", code: "first-semester", order: 1 },
  { nameAr: "الفصل الدراسي الثاني", nameEn: "Second Semester", code: "second-semester", order: 2 },
];

// بيانات المواد الدراسية
const subjectsData: Record<string, Array<{
  nameAr: string; nameEn: string; slug: string; icon: string; color: string; order: number;
  yearCode?: string; specializationCode?: string; isCommon?: boolean;
}>> = {
  // الصف الأول الثانوي - مواد مشتركة
  "first-year-common": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-1", icon: "BookOpen", color: "#8B5CF6", order: 1, isCommon: true },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-1", icon: "Globe", color: "#3B82F6", order: 2, isCommon: true },
    { nameAr: "اللغة الفرنسية", nameEn: "French Language", slug: "french-1", icon: "Globe", color: "#EC4899", order: 3, isCommon: true },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-1", icon: "Calculator", color: "#F59E0B", order: 4, isCommon: true },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-1", icon: "Atom", color: "#10B981", order: 5, isCommon: true },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-1", icon: "FlaskConical", color: "#EF4444", order: 6, isCommon: true },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-1", icon: "Leaf", color: "#22C55E", order: 7, isCommon: true },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-1", icon: "Landmark", color: "#A855F7", order: 8, isCommon: true },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-1", icon: "Map", color: "#06B6D4", order: 9, isCommon: true },
    { nameAr: "الفلسفة والمنطق", nameEn: "Philosophy & Logic", slug: "philosophy-1", icon: "Brain", color: "#F97316", order: 10, isCommon: true },
  ],
  // الصف الثاني الثانوي - علمي علوم
  "second-year-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-science", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-science", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-science", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-2-science", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-science", icon: "Atom", color: "#10B981", order: 5 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-science", icon: "FlaskConical", color: "#EF4444", order: 6 },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-2-science", icon: "Leaf", color: "#22C55E", order: 7 },
  ],
  // الصف الثاني الثانوي - علمي رياضة
  "second-year-math": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-math", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-math", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-math", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-2-math", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-2-math", icon: "Atom", color: "#10B981", order: 5 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-2-math", icon: "FlaskConical", color: "#EF4444", order: 6 },
  ],
  // الصف الثاني الثانوي - أدبي
  "second-year-arts": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-2-arts", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-2-arts", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-2-arts", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-2-arts", icon: "Landmark", color: "#A855F7", order: 4 },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-2-arts", icon: "Map", color: "#06B6D4", order: 5 },
    { nameAr: "الفلسفة", nameEn: "Philosophy", slug: "philosophy-2-arts", icon: "Brain", color: "#F97316", order: 6 },
    { nameAr: "علم النفس والاجتماع", nameEn: "Psychology & Sociology", slug: "psychology-2-arts", icon: "Users", color: "#6366F1", order: 7 },
  ],
  // الصف الثالث الثانوي - علمي علوم
  "third-year-science": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-science", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-science", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-science", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات", nameEn: "Mathematics", slug: "math-3-science", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-science", icon: "Atom", color: "#10B981", order: 5 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-science", icon: "FlaskConical", color: "#EF4444", order: 6 },
    { nameAr: "الأحياء", nameEn: "Biology", slug: "biology-3-science", icon: "Leaf", color: "#22C55E", order: 7 },
  ],
  // الصف الثالث الثانوي - علمي رياضة
  "third-year-math": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-math", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-math", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-math", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "الرياضيات 1", nameEn: "Mathematics 1", slug: "math1-3-math", icon: "Calculator", color: "#F59E0B", order: 4 },
    { nameAr: "الرياضيات 2", nameEn: "Mathematics 2", slug: "math2-3-math", icon: "Sigma", color: "#D97706", order: 5 },
    { nameAr: "الفيزياء", nameEn: "Physics", slug: "physics-3-math", icon: "Atom", color: "#10B981", order: 6 },
    { nameAr: "الكيمياء", nameEn: "Chemistry", slug: "chemistry-3-math", icon: "FlaskConical", color: "#EF4444", order: 7 },
  ],
  // الصف الثالث الثانوي - أدبي
  "third-year-arts": [
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", slug: "arabic-3-arts", icon: "BookOpen", color: "#8B5CF6", order: 1 },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", slug: "english-3-arts", icon: "Globe", color: "#3B82F6", order: 2 },
    { nameAr: "اللغة الثانية", nameEn: "Second Language", slug: "second-lang-3-arts", icon: "Globe", color: "#EC4899", order: 3 },
    { nameAr: "التاريخ", nameEn: "History", slug: "history-3-arts", icon: "Landmark", color: "#A855F7", order: 4 },
    { nameAr: "الجغرافيا", nameEn: "Geography", slug: "geography-3-arts", icon: "Map", color: "#06B6D4", order: 5 },
    { nameAr: "الفلسفة", nameEn: "Philosophy", slug: "philosophy-3-arts", icon: "Brain", color: "#F97316", order: 6 },
    { nameAr: "علم النفس والاجتماع", nameEn: "Psychology & Sociology", slug: "psychology-3-arts", icon: "Users", color: "#6366F1", order: 7 },
  ],
};

// بيانات الوحدات والدروس
const unitsAndLessonsData: Record<string, Array<{
  nameAr: string; nameEn: string; slug: string; order: number;
  lessons: Array<{
    titleAr: string; titleEn: string; slug: string; descriptionAr: string; descriptionEn: string;
    introductionAr: string; introductionEn: string; summaryAr: string; summaryEn: string;
    duration: number; order: number; isFree: boolean;
    objectives: { textAr: string; textEn: string }[];
    concepts: { termAr: string; termEn: string; definitionAr: string; definitionEn: string }[];
    formulas: { formula: string; explanationAr: string; explanationEn: string }[];
    examples: { questionAr: string; questionEn: string; solutionAr: string; solutionEn: string; stepsAr: string; stepsEn: string }[];
    questions: { type: string; questionAr: string; questionEn: string; optionsAr: string[]; optionsEn: string[]; answer: string; explanationAr: string; explanationEn: string }[];
  }>;
}>> = {
  // فيزياء - الصف الأول الثانوي
  "physics-1": [
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
          descriptionAr: "دراسة مفهوم الحركة والسكون والفرق بينهما",
          descriptionEn: "Study of motion and rest concepts and the difference between them",
          introductionAr: "الحركة هي تغير موضع الجسم بالنسبة لجسم آخر ثابت أو متحرك بمرور الزمن. والسكون هو ثبات الجسم في مكانه بالنسبة لجسم آخر. نفهم من ذلك أن الحركة والسكون مفهومان نسبيان وليسا مطلقين.",
          introductionEn: "Motion is the change of an object's position relative to another fixed or moving object over time. Rest is the stability of an object in its place relative to another object. We understand that motion and rest are relative concepts, not absolute.",
          summaryAr: "الحركة نسبية وتعتمد على المرجع. الجسم قد يكون متحرك بالنسبة لمرجع وساكن بالنسبة لمرجع آخر. المسافة كمية قياسية والإزاحة كمية متجهة.",
          summaryEn: "Motion is relative and depends on the reference frame. An object may be moving relative to one reference and stationary relative to another. Distance is a scalar quantity and displacement is a vector quantity.",
          duration: 45,
          order: 1,
          isFree: true,
          objectives: [
            { textAr: "التعرف على مفهوم الحركة والسكون", textEn: "Understand the concept of motion and rest" },
            { textAr: "فهم أن الحركة مفهوم نسبي", textEn: "Understand that motion is a relative concept" },
            { textAr: "التمييز بين المسافة والإزاحة", textEn: "Distinguish between distance and displacement" },
          ],
          concepts: [
            { termAr: "الحركة", termEn: "Motion", definitionAr: "تغير موضع الجسم بالنسبة لجسم آخر بمرور الزمن", definitionEn: "Change of an object's position relative to another object over time" },
            { termAr: "السكون", termEn: "Rest", definitionAr: "ثبات الجسم في مكانه بالنسبة لجسم آخر", definitionEn: "Stability of an object in its place relative to another object" },
            { termAr: "المسافة", termEn: "Distance", definitionAr: "طول المسار الفعلي الذي يسلكه الجسم", definitionEn: "The length of the actual path taken by an object" },
            { termAr: "الإزاحة", termEn: "Displacement", definitionAr: "أقصر مسافة مستقيمة بين نقطة البداية ونقطة النهاية", definitionEn: "The shortest straight distance between start and end points" },
          ],
          formulas: [
            { formula: "السرعة = الإزاحة / الزمن", explanationAr: "حساب السرعة المتوسطة", explanationEn: "Calculate average velocity" },
            { formula: "v = d / t", explanationAr: "حساب السرعة في الحركة المنتظمة", explanationEn: "Calculate velocity in uniform motion" },
          ],
          examples: [
            {
              questionAr: "سيارة تتحرك مسافة 100 متر في 20 ثانية. احسب سرعتها.",
              questionEn: "A car moves 100 meters in 20 seconds. Calculate its velocity.",
              solutionAr: "السرعة = المسافة / الزمن = 100 / 20 = 5 م/ث",
              solutionEn: "Velocity = Distance / Time = 100 / 20 = 5 m/s",
              stepsAr: JSON.stringify(["نحدد المعطيات: المسافة = 100 م، الزمن = 20 ث", "نطبق القانون: v = d / t", "نحسب: v = 100 / 20 = 5 م/ث"]),
              stepsEn: JSON.stringify(["Identify given values: Distance = 100 m, Time = 20 s", "Apply formula: v = d / t", "Calculate: v = 100 / 20 = 5 m/s"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "الحركة مفهوم...",
              questionEn: "Motion is a... concept",
              optionsAr: ["مطلق", "نسبي", "ثابت", "متغير"],
              optionsEn: ["Absolute", "Relative", "Fixed", "Variable"],
              answer: "نسبي",
              explanationAr: "الحركة مفهوم نسبي لأنها تعتمد على المرجع الذي نحسب بالنسبة له",
              explanationEn: "Motion is a relative concept because it depends on the reference frame",
            },
          ],
        },
        {
          titleAr: "السرعة والتسارع",
          titleEn: "Velocity and Acceleration",
          slug: "velocity-acceleration-1",
          descriptionAr: "دراسة مفهومي السرعة والتسارع والعلاقة بينهما",
          descriptionEn: "Study of velocity and acceleration concepts and their relationship",
          introductionAr: "السرعة هي معدل تغير الإزاحة بالنسبة للزمن. والتسارع هو معدل تغير السرعة بالنسبة للزمن. السرعة المتجهة تختلف عن السرعة القياسية في أنها لها اتجاه محدد.",
          introductionEn: "Velocity is the rate of change of displacement with respect to time. Acceleration is the rate of change of velocity with respect to time. Vector velocity differs from scalar speed in that it has a specific direction.",
          summaryAr: "السرعة هي الإزاحة مقسومة على الزمن. التسارع هو تغير السرعة في وحدة الزمن. يمكن أن يكون التسارع موجباً أو سالباً.",
          summaryEn: "Velocity is displacement divided by time. Acceleration is change in velocity per unit time. Acceleration can be positive or negative.",
          duration: 50,
          order: 2,
          isFree: true,
          objectives: [
            { textAr: "التعرف على مفهوم السرعة المتوسطة واللحظية", textEn: "Understand average and instantaneous velocity" },
            { textAr: "حساب التسارع", textEn: "Calculate acceleration" },
            { textAr: "فهم العلاقة بين السرعة والتسارع", textEn: "Understand the relationship between velocity and acceleration" },
          ],
          concepts: [
            { termAr: "السرعة المتوسطة", termEn: "Average Velocity", definitionAr: "الإزاحة الكلية مقسومة على الزمن الكلي", definitionEn: "Total displacement divided by total time" },
            { termAr: "التسارع", termEn: "Acceleration", definitionAr: "معدل تغير السرعة بالنسبة للزمن", definitionEn: "Rate of change of velocity with respect to time" },
          ],
          formulas: [
            { formula: "a = (v2 - v1) / t", explanationAr: "حساب التسارع", explanationEn: "Calculate acceleration" },
            { formula: "v = v0 + at", explanationAr: "قانون السرعة في الحركة المتسارعة", explanationEn: "Velocity formula in accelerated motion" },
          ],
          examples: [
            {
              questionAr: "سيارة تزداد سرعتها من 10 م/ث إلى 30 م/ث في 5 ثواني. احسب التسارع.",
              questionEn: "A car increases its speed from 10 m/s to 30 m/s in 5 seconds. Calculate the acceleration.",
              solutionAr: "التسارع = (30 - 10) / 5 = 20 / 5 = 4 م/ث²",
              solutionEn: "Acceleration = (30 - 10) / 5 = 20 / 5 = 4 m/s²",
              stepsAr: JSON.stringify(["نحدد v1 = 10 م/ث، v2 = 30 م/ث، t = 5 ث", "نطبق: a = (v2 - v1) / t", "a = (30 - 10) / 5 = 4 م/ث²"]),
              stepsEn: JSON.stringify(["Identify v1 = 10 m/s, v2 = 30 m/s, t = 5 s", "Apply: a = (v2 - v1) / t", "a = (30 - 10) / 5 = 4 m/s²"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "وحدة قياس التسارع في النظام الدولي هي:",
              questionEn: "The SI unit of acceleration is:",
              optionsAr: ["م/ث", "م/ث²", "م²/ث", "ث/م"],
              optionsEn: ["m/s", "m/s²", "m²/s", "s/m"],
              answer: "م/ث²",
              explanationAr: "التسارع = تغير السرعة / الزمن، وحدة السرعة م/ث، وحدة الزمن ث، إذن وحدة التسارع م/ث²",
              explanationEn: "Acceleration = change in velocity / time, velocity unit is m/s, time unit is s, so acceleration unit is m/s²",
            },
          ],
        },
        {
          titleAr: "قوانين نيوتن للحركة",
          titleEn: "Newton's Laws of Motion",
          slug: "newton-laws-1",
          descriptionAr: "دراسة قوانين نيوتن الثلاثة للحركة وتطبيقاتها",
          descriptionEn: "Study of Newton's three laws of motion and their applications",
          introductionAr: "وضع إسحاق نيوتن ثلاثة قوانين أساسية تصف حركة الأجسام. القانون الأول يتحدث عن القصور الذاتي، والثاني يربط القوة بالتسارع، والثالث يتحدث عن الفعل ورد الفعل.",
          introductionEn: "Isaac Newton formulated three fundamental laws describing the motion of objects. The first law deals with inertia, the second relates force to acceleration, and the third deals with action and reaction.",
          summaryAr: "قانون نيوتن الأول: الجسم الساكن يبقى ساكناً والمتحرك يستمر في حركته ما لم تؤثر عليه قوة خارجية. القانون الثاني: F = ma. القانون الثالث: لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه.",
          summaryEn: "Newton's first law: A body at rest stays at rest, and a body in motion continues in motion unless acted upon by an external force. Second law: F = ma. Third law: For every action, there is an equal and opposite reaction.",
          duration: 60,
          order: 3,
          isFree: false,
          objectives: [
            { textAr: "فهم القصور الذاتي", textEn: "Understand inertia" },
            { textAr: "تطبيق قانون F = ma", textEn: "Apply F = ma formula" },
            { textAr: "فهم مبدأ الفعل ورد الفعل", textEn: "Understand action and reaction principle" },
          ],
          concepts: [
            { termAr: "القصور الذاتي", termEn: "Inertia", definitionAr: "مقاومة الجسم لأي تغير في حالة حركته", definitionEn: "Resistance of an object to any change in its state of motion" },
            { termAr: "القوة", termEn: "Force", definitionAr: "مؤثر خارجي يغير من سرعة الجسم أو اتجاهه", definitionEn: "An external influence that changes an object's speed or direction" },
            { termAr: "الكتلة", termEn: "Mass", definitionAr: "مقدار المادة في الجسم", definitionEn: "The amount of matter in an object" },
          ],
          formulas: [
            { formula: "F = ma", explanationAr: "القوة = الكتلة × التسارع", explanationEn: "Force = Mass × Acceleration" },
            { formula: "w = mg", explanationAr: "الوزن = الكتلة × عجلة الجاذبية", explanationEn: "Weight = Mass × Gravitational acceleration" },
          ],
          examples: [
            {
              questionAr: "جسم كتلته 5 كجم يؤثر عليه قوة 20 نيوتن. احسب تسارعه.",
              questionEn: "A 5 kg object is acted upon by a 20 Newton force. Calculate its acceleration.",
              solutionAr: "التسارع = القوة / الكتلة = 20 / 5 = 4 م/ث²",
              solutionEn: "Acceleration = Force / Mass = 20 / 5 = 4 m/s²",
              stepsAr: JSON.stringify(["نطبق قانون نيوتن الثاني: F = ma", "نعزل التسارع: a = F / m", "a = 20 / 5 = 4 م/ث²"]),
              stepsEn: JSON.stringify(["Apply Newton's second law: F = ma", "Isolate acceleration: a = F / m", "a = 20 / 5 = 4 m/s²"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "قانون نيوتن الثاني يُعبر عنه بالعلاقة:",
              questionEn: "Newton's second law is expressed by the relation:",
              optionsAr: ["F = ma", "F = mv", "F = m/a", "F = a/m"],
              optionsEn: ["F = ma", "F = mv", "F = m/a", "F = a/m"],
              answer: "F = ma",
              explanationAr: "قانون نيوتن الثاني يربط القوة بالكتلة والتسارع: F = ma",
              explanationEn: "Newton's second law relates force to mass and acceleration: F = ma",
            },
          ],
        },
      ],
    },
    {
      nameAr: "وحدة الطاقة والشغل",
      nameEn: "Energy and Work Unit",
      slug: "energy-work-1",
      order: 2,
      lessons: [
        {
          titleAr: "الشغل والقدرة",
          titleEn: "Work and Power",
          slug: "work-power-1",
          descriptionAr: "دراسة مفهومي الشغل والقدرة في الفيزياء",
          descriptionEn: "Study of work and power concepts in physics",
          introductionAr: "الشغل في الفيزياء له معنى محدد يختلف عن معناه في الحياة اليومية. يُعرَّف الشغل بأنه حاصل ضرب القوة في الإزاحة في اتجاه القوة.",
          introductionEn: "Work in physics has a specific meaning different from its meaning in everyday life. Work is defined as the product of force and displacement in the direction of the force.",
          summaryAr: "الشغل = القوة × الإزاحة × جتا الزاوية. القدرة = الشغل / الزمن. وحدة الشغل هي الجول ووحدة القدرة هي الواط.",
          summaryEn: "Work = Force × Displacement × cos(θ). Power = Work / Time. The unit of work is Joule and the unit of power is Watt.",
          duration: 45,
          order: 1,
          isFree: true,
          objectives: [
            { textAr: "فهم مفهوم الشغل", textEn: "Understand the concept of work" },
            { textAr: "حساب القدرة", textEn: "Calculate power" },
            { textAr: "التمييز بين الشغل الموجب والسالب", textEn: "Distinguish between positive and negative work" },
          ],
          concepts: [
            { termAr: "الشغل", termEn: "Work", definitionAr: "حاصل ضرب القوة في الإزاحة في اتجاه القوة", definitionEn: "Product of force and displacement in the direction of force" },
            { termAr: "القدرة", termEn: "Power", definitionAr: "معدل إنجاز الشغل في وحدة الزمن", definitionEn: "Rate of doing work per unit time" },
            { termAr: "الجول", termEn: "Joule", definitionAr: "وحدة قياس الشغل والطاقة", definitionEn: "Unit of measurement for work and energy" },
          ],
          formulas: [
            { formula: "W = F × d × cos(θ)", explanationAr: "حساب الشغل", explanationEn: "Calculate work" },
            { formula: "P = W / t", explanationAr: "حساب القدرة", explanationEn: "Calculate power" },
          ],
          examples: [
            {
              questionAr: "قوة أفقية مقدارها 50 نيوتن تحرك صندوقاً مسافة 3 أمتار. احسب الشغل المبذول.",
              questionEn: "A horizontal force of 50 Newtons moves a box 3 meters. Calculate the work done.",
              solutionAr: "الشغل = القوة × الإزاحة = 50 × 3 = 150 جول",
              solutionEn: "Work = Force × Displacement = 50 × 3 = 150 Joules",
              stepsAr: JSON.stringify(["القوة والازاحة في نفس الاتجاه (θ = 0°)", "W = F × d = 50 × 3 = 150 جول"]),
              stepsEn: JSON.stringify(["Force and displacement are in the same direction (θ = 0°)", "W = F × d = 50 × 3 = 150 Joules"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "وحدة قياس القدرة في النظام الدولي هي:",
              questionEn: "The SI unit of power is:",
              optionsAr: ["جول", "واط", "نيوتن", "كيلوجرام"],
              optionsEn: ["Joule", "Watt", "Newton", "Kilogram"],
              answer: "واط",
              explanationAr: "القدرة = الشغل / الزمن، وحدتها واط = جول / ثانية",
              explanationEn: "Power = Work / Time, its unit is Watt = Joule / second",
            },
          ],
        },
        {
          titleAr: "أنواع الطاقة",
          titleEn: "Types of Energy",
          slug: "energy-types-1",
          descriptionAr: "دراسة الطاقة الحركية والطاقة الكامنة وتحولاتهما",
          descriptionEn: "Study of kinetic and potential energy and their transformations",
          introductionAr: "الطاقة هي القدرة على إنجاز الشغل. توجد عدة أشكال للطاقة أهمها الطاقة الحركية المرتبطة بحركة الأجسام، والطاقة الكامنة المخزنة في الأجسام.",
          introductionEn: "Energy is the capacity to do work. There are several forms of energy, the most important being kinetic energy associated with the motion of objects, and potential energy stored in objects.",
          summaryAr: "الطاقة الحركية = ½mv². الطاقة الكامنة الثقالية = mgh. الطاقة الكلية = الطاقة الحركية + الطاقة الكامنة. قانون حفظ الطاقة: الطاقة لا تُخلق ولا تُفنى بل تتحول من شكل لآخر.",
          summaryEn: "Kinetic energy = ½mv². Gravitational potential energy = mgh. Total energy = Kinetic energy + Potential energy. Law of conservation of energy: Energy cannot be created or destroyed, only transformed.",
          duration: 50,
          order: 2,
          isFree: true,
          objectives: [
            { textAr: "حساب الطاقة الحركية", textEn: "Calculate kinetic energy" },
            { textAr: "حساب الطاقة الكامنة", textEn: "Calculate potential energy" },
            { textAr: "فهم قانون حفظ الطاقة", textEn: "Understand the law of conservation of energy" },
          ],
          concepts: [
            { termAr: "الطاقة الحركية", termEn: "Kinetic Energy", definitionAr: "طاقة الجسم نتيجة حركته", definitionEn: "Energy of an object due to its motion" },
            { termAr: "الطاقة الكامنة", termEn: "Potential Energy", definitionAr: "طاقة مخزنة في الجسم نتيجة موضعه أو حالته", definitionEn: "Energy stored in an object due to its position or state" },
            { termAr: "قانون حفظ الطاقة", termEn: "Law of Conservation of Energy", definitionAr: "الطاقة لا تُخلق ولا تُفنى بل تتحول من شكل لآخر", definitionEn: "Energy cannot be created or destroyed, only transformed from one form to another" },
          ],
          formulas: [
            { formula: "KE = ½mv²", explanationAr: "الطاقة الحركية", explanationEn: "Kinetic energy" },
            { formula: "PE = mgh", explanationAr: "الطاقة الكامنة الثقالية", explanationEn: "Gravitational potential energy" },
          ],
          examples: [
            {
              questionAr: "جسم كتلته 2 كجم يتحرك بسرعة 5 م/ث. احسب طاقته الحركية.",
              questionEn: "A 2 kg object moves at 5 m/s. Calculate its kinetic energy.",
              solutionAr: "KE = ½mv² = ½ × 2 × 25 = 25 جول",
              solutionEn: "KE = ½mv² = ½ × 2 × 25 = 25 Joules",
              stepsAr: JSON.stringify(["KE = ½mv²", "KE = ½ × 2 × (5)²", "KE = ½ × 2 × 25 = 25 جول"]),
              stepsEn: JSON.stringify(["KE = ½mv²", "KE = ½ × 2 × (5)²", "KE = ½ × 2 × 25 = 25 Joules"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "عند سقوط جسم من ارتفاع معين:",
              questionEn: "When an object falls from a certain height:",
              optionsAr: ["تزداد طاقته الحركية وتقل طاقته الكامنة", "تقل طاقته الحركية وتزداد طاقته الكامنة", "تثبت طاقتاه الحركية والكامنة", "تزداد طاقتاه الحركية والكامنة"],
              optionsEn: ["Its kinetic energy increases and potential energy decreases", "Its kinetic energy decreases and potential energy increases", "Both energies remain constant", "Both energies increase"],
              answer: "تزداد طاقته الحركية وتقل طاقته الكامنة",
              explanationAr: "عند السقوط تتحول الطاقة الكامنة إلى طاقة حركية",
              explanationEn: "During fall, potential energy transforms into kinetic energy",
            },
          ],
        },
      ],
    },
  ],
  // رياضيات - الصف الأول الثانوي
  "math-1": [
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
          introductionAr: "الجذر التربيعي لعدد ما هو العدد الذي إذا ضرب في نفسه أعطى العدد الأصلي. الجذر التكعيبي هو العدد الذي إذا ضرب في نفسه ثلاث مرات أعطى العدد الأصلي.",
          introductionEn: "The square root of a number is the number that when multiplied by itself gives the original number. The cube root is the number that when multiplied by itself three times gives the original number.",
          summaryAr: "الجذر النوني لعدد a هو العدد الذي إذا رفع للنون أعطى a. خصائص الجذور: جذر حاصل الضرب = حاصل ضرب الجذور، جذر القسمة = قسمة الجذور.",
          summaryEn: "The nth root of a number a is the number that when raised to the nth power gives a. Properties: root of product = product of roots, root of quotient = quotient of roots.",
          duration: 45,
          order: 1,
          isFree: true,
          objectives: [
            { textAr: "فهم مفهوم الجذر التربيعي والتكعيبي", textEn: "Understand square and cube roots" },
            { textAr: "تطبيق خصائص الجذور", textEn: "Apply properties of roots" },
            { textAr: "تبسيط التعابير الجذرية", textEn: "Simplify radical expressions" },
          ],
          concepts: [
            { termAr: "الجذر التربيعي", termEn: "Square Root", definitionAr: "العدد الذي إذا رفع للتربيع أعطى العدد الأصلي", definitionEn: "The number that when squared gives the original number" },
            { termAr: "الجذر التكعيبي", termEn: "Cube Root", definitionAr: "العدد الذي إذا رفع للتكعيب أعطى العدد الأصلي", definitionEn: "The number that when cubed gives the original number" },
          ],
          formulas: [
            { formula: "root(a × b) = root(a) × root(b)", explanationAr: "جذر حاصل الضرب = حاصل ضرب الجذور", explanationEn: "Root of product equals product of roots" },
            { formula: "root(a/b) = root(a) / root(b)", explanationAr: "جذر القسمة = قسمة الجذور", explanationEn: "Root of quotient equals quotient of roots" },
          ],
          examples: [
            {
              questionAr: "بسّط: الجذر التربيعي لـ 72",
              questionEn: "Simplify: Square root of 72",
              solutionAr: "جذر 72 = جذر (36 × 2) = 6 × جذر 2",
              solutionEn: "Square root of 72 = Square root of (36 × 2) = 6 × Square root of 2",
              stepsAr: JSON.stringify(["نفكك 72 إلى عوامل: 72 = 36 × 2", "جذر 72 = جذر 36 × جذر 2 = 6 جذر 2"]),
              stepsEn: JSON.stringify(["Factorize 72: 72 = 36 × 2", "Square root of 72 = Square root of 36 × Square root of 2 = 6 × Square root of 2"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "قيمة الجذر التربيعي لـ 144 هي:",
              questionEn: "The value of square root of 144 is:",
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
          descriptionAr: "دراسة الأسس وخصائصها الأساسية",
          descriptionEn: "Study of exponents and their basic properties",
          introductionAr: "الأس هو طريقة مختصرة لكتابة ضرب عدد ما في نفسه عدة مرات. مثلاً: 2³ = 2 × 2 × 2 = 8. للأسس خصائص مهمة تساعد في تبسيط التعابير الجبرية.",
          introductionEn: "An exponent is a shorthand way of writing a number multiplied by itself several times. For example: 2³ = 2 × 2 × 2 = 8. Exponents have important properties that help simplify algebraic expressions.",
          summaryAr: "a^m × a^n = a^(m+n)، a^m ÷ a^n = a^(m-n)، (a^m)^n = a^(mn)، a^0 = 1، a^(-n) = 1/a^n",
          summaryEn: "a^m × a^n = a^(m+n), a^m ÷ a^n = a^(m-n), (a^m)^n = a^(mn), a^0 = 1, a^(-n) = 1/a^n",
          duration: 45,
          order: 2,
          isFree: true,
          objectives: [
            { textAr: "فهم قوانين الأسس", textEn: "Understand exponent laws" },
            { textAr: "تبسيط التعابير الأسية", textEn: "Simplify exponential expressions" },
            { textAr: "حل معادلات أسية بسيطة", textEn: "Solve simple exponential equations" },
          ],
          concepts: [
            { termAr: "الأس", termEn: "Exponent", definitionAr: "العدد الذي يدل على كم مرة يُضرب الأساس في نفسه", definitionEn: "The number indicating how many times the base is multiplied by itself" },
            { termAr: "الأساس", termEn: "Base", definitionAr: "العدد الذي يُرفع لأس معين", definitionEn: "The number raised to a certain exponent" },
          ],
          formulas: [
            { formula: "a^m × a^n = a^(m+n)", explanationAr: "ضرب الأسس: جمع الأسس", explanationEn: "Multiplying exponents: add the powers" },
            { formula: "a^m ÷ a^n = a^(m-n)", explanationAr: "قسمة الأسس: طرح الأسس", explanationEn: "Dividing exponents: subtract the powers" },
            { formula: "(a^m)^n = a^(mn)", explanationAr: "أس الأس: ضرب الأسس", explanationEn: "Power of a power: multiply the exponents" },
          ],
          examples: [
            {
              questionAr: "بسّط: 2³ × 2⁴",
              questionEn: "Simplify: 2³ × 2⁴",
              solutionAr: "2³ × 2⁴ = 2^(3+4) = 2⁷ = 128",
              solutionEn: "2³ × 2⁴ = 2^(3+4) = 2⁷ = 128",
              stepsAr: JSON.stringify(["نطبق قانون ضرب الأسس: a^m × a^n = a^(m+n)", "2³ × 2⁴ = 2^(3+4) = 2⁷", "2⁷ = 128"]),
              stepsEn: JSON.stringify(["Apply the multiplication law: a^m × a^n = a^(m+n)", "2³ × 2⁴ = 2^(3+4) = 2⁷", "2⁷ = 128"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "قيمة 3⁰ هي:",
              questionEn: "The value of 3⁰ is:",
              optionsAr: ["0", "1", "3", "غير معرف"],
              optionsEn: ["0", "1", "3", "Undefined"],
              answer: "1",
              explanationAr: "أي عدد مرفوع للأس الصفر يساوي 1",
              explanationEn: "Any number raised to the power of zero equals 1",
            },
          ],
        },
      ],
    },
    {
      nameAr: "وحدة المعادلات والمتباينات",
      nameEn: "Equations and Inequalities Unit",
      slug: "equations-inequalities-1",
      order: 2,
      lessons: [
        {
          titleAr: "المعادلات الخطية",
          titleEn: "Linear Equations",
          slug: "linear-equations-1",
          descriptionAr: "دراسة المعادلات الخطية وحلها",
          descriptionEn: "Study of linear equations and solving them",
          introductionAr: "المعادلة الخطية هي معادلة من الدرجة الأولى في مجهول واحد أو أكثر. حل المعادلة هو إيجاد قيمة المجهول التي تحقق المعادلة.",
          introductionEn: "A linear equation is a first-degree equation in one or more unknowns. Solving the equation means finding the value of the unknown that satisfies the equation.",
          summaryAr: "لحل معادلة خطية: نبسط الطرفين، ننقل الحدود المتشابهة، نعزل المجهول.",
          summaryEn: "To solve a linear equation: simplify both sides, collect like terms, isolate the unknown.",
          duration: 40,
          order: 1,
          isFree: true,
          objectives: [
            { textAr: "حل معادلات خطية بمجهول واحد", textEn: "Solve linear equations in one variable" },
            { textAr: "التحقق من صحة الحل", textEn: "Verify the solution" },
          ],
          concepts: [
            { termAr: "المعادلة الخطية", termEn: "Linear Equation", definitionAr: "معادلة من الدرجة الأولى", definitionEn: "A first-degree equation" },
            { termAr: "حل المعادلة", termEn: "Solution", definitionAr: "القيمة التي تحقق المعادلة", definitionEn: "The value that satisfies the equation" },
          ],
          formulas: [
            { formula: "ax + b = 0", explanationAr: "صيغة المعادلة الخطية", explanationEn: "Linear equation form" },
          ],
          examples: [
            {
              questionAr: "حل المعادلة: 2x + 5 = 13",
              questionEn: "Solve the equation: 2x + 5 = 13",
              solutionAr: "x = 4",
              solutionEn: "x = 4",
              stepsAr: JSON.stringify(["2x + 5 = 13", "2x = 13 - 5 = 8", "x = 8/2 = 4"]),
              stepsEn: JSON.stringify(["2x + 5 = 13", "2x = 13 - 5 = 8", "x = 8/2 = 4"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "حل المعادلة 3x - 6 = 12 هو:",
              questionEn: "The solution of 3x - 6 = 12 is:",
              optionsAr: ["x = 2", "x = 6", "x = 3", "x = 4"],
              optionsEn: ["x = 2", "x = 6", "x = 3", "x = 4"],
              answer: "x = 6",
              explanationAr: "3x = 18, x = 6",
              explanationEn: "3x = 18, x = 6",
            },
          ],
        },
      ],
    },
  ],
  // كيمياء - الصف الأول الثانوي
  "chemistry-1": [
    {
      nameAr: "وحدة الذرات والجزيئات",
      nameEn: "Atoms and Molecules Unit",
      slug: "atoms-molecules-1",
      order: 1,
      lessons: [
        {
          titleAr: "تركيب الذرة",
          titleEn: "Structure of the Atom",
          slug: "atom-structure-1",
          descriptionAr: "دراسة التركيب الأساسي للذرة ومكوناتها",
          descriptionEn: "Study of the basic structure of the atom and its components",
          introductionAr: "الذرة هي وحدة البناء الأساسية للمادة. تتكون الذرة من نواة مركزية تحتوي على بروتونات موجبة ونيوترونات متعادلة، وتدور حولها إلكترونات سالبة في مستويات الطاقة.",
          introductionEn: "The atom is the basic building block of matter. An atom consists of a central nucleus containing positive protons and neutral neutrons, with negative electrons orbiting around it in energy levels.",
          summaryAr: "الذرة = نواة (بروتونات + نيوترونات) + إلكترونات. العدد الذري = عدد البروتونات. العدد الكتلي = عدد البروتونات + النيوترونات.",
          summaryEn: "Atom = Nucleus (protons + neutrons) + Electrons. Atomic number = number of protons. Mass number = protons + neutrons.",
          duration: 50,
          order: 1,
          isFree: true,
          objectives: [
            { textAr: "التعرف على مكونات الذرة", textEn: "Identify the components of the atom" },
            { textAr: "فهم العدد الذري والعدد الكتلي", textEn: "Understand atomic number and mass number" },
            { textAr: "حساب عدد البروتونات والنيوترونات والإلكترونات", textEn: "Calculate protons, neutrons, and electrons" },
          ],
          concepts: [
            { termAr: "الذرة", termEn: "Atom", definitionAr: "وحدة البناء الأساسية للمادة", definitionEn: "The basic building block of matter" },
            { termAr: "النواة", termEn: "Nucleus", definitionAr: "مركز الذرة يحتوي على البروتونات والنيوترونات", definitionEn: "Center of the atom containing protons and neutrons" },
            { termAr: "البروتون", termEn: "Proton", definitionAr: "جسيم موجب الشحنة في النواة", definitionEn: "A positively charged particle in the nucleus" },
            { termAr: "النيوترون", termEn: "Neutron", definitionAr: "جسيم متعادل الشحنة في النواة", definitionEn: "A neutral particle in the nucleus" },
            { termAr: "الإلكترون", termEn: "Electron", definitionAr: "جسيم سالب الشحنة يدور حول النواة", definitionEn: "A negatively charged particle orbiting the nucleus" },
          ],
          formulas: [
            { formula: "العدد الكتلي = عدد البروتونات + عدد النيوترونات", explanationAr: "حساب العدد الكتلي", explanationEn: "Calculate mass number" },
            { formula: "عدد الإلكترونات = عدد البروتونات (في الذرة المتعادلة)", explanationAr: "حساب عدد الإلكترونات", explanationEn: "Calculate number of electrons" },
          ],
          examples: [
            {
              questionAr: "ذرة كربون عدددها الذري 6 والعدد الكتلي 12. أوجد عدد البروتونات والنيوترونات والإلكترونات.",
              questionEn: "A carbon atom has atomic number 6 and mass number 12. Find protons, neutrons, and electrons.",
              solutionAr: "البروتونات = 6، الإلكترونات = 6، النيوترونات = 12 - 6 = 6",
              solutionEn: "Protons = 6, Electrons = 6, Neutrons = 12 - 6 = 6",
              stepsAr: JSON.stringify(["العدد الذري = عدد البروتونات = 6", "في الذرة المتعادلة: عدد الإلكترونات = عدد البروتونات = 6", "النيوترونات = العدد الكتلي - العدد الذري = 12 - 6 = 6"]),
              stepsEn: JSON.stringify(["Atomic number = number of protons = 6", "In neutral atom: electrons = protons = 6", "Neutrons = Mass number - Atomic number = 12 - 6 = 6"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "الجسيم الذي يحدد العدد الذري للعنصر هو:",
              questionEn: "The particle that determines the atomic number is:",
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
  // لغة عربية - الصف الأول الثانوي
  "arabic-1": [
    {
      nameAr: "وحدة النحو والصرف",
      nameEn: "Grammar and Morphology Unit",
      slug: "grammar-morphology-1",
      order: 1,
      lessons: [
        {
          titleAr: "المبتدأ والخبر",
          titleEn: "Subject and Predicate",
          slug: "subject-predicate-1",
          descriptionAr: "دراسة المبتدأ والخبر وأنواعهما",
          descriptionEn: "Study of subject and predicate and their types",
          introductionAr: "الجملة الاسمية تبدأ باسم ويُخبر عنه. المبتدأ هو الاسم المُبدوء به الجملة الاسمية، والخبر هو ما يُخبر عن المبتدأ ويتمم معناه.",
          introductionEn: "A nominal sentence begins with a noun that is described. The subject (mubtada) is the noun that starts the nominal sentence, and the predicate (khabar) describes the subject and completes its meaning.",
          summaryAr: "المبتدأ: الاسم المُبدوء به الجملة الاسمية. الخبر: ما يُخبر عن المبتدأ. أنواع الخبر: مفرد، جملة (اسمية/فعلية)، شبه جملة (ظرف/جار ومجرور).",
          summaryEn: "Subject: The noun starting the nominal sentence. Predicate: What describes the subject. Types: singular, sentence (nominal/verbal), semi-sentence (adverb/prepositional phrase).",
          duration: 45,
          order: 1,
          isFree: true,
          objectives: [
            { textAr: "التعرف على المبتدأ والخبر", textEn: "Identify subject and predicate" },
            { textAr: "تحديد أنواع الخبر", textEn: "Determine types of predicate" },
            { textAr: "إعراب الجملة الاسمية", textEn: "Parse the nominal sentence" },
          ],
          concepts: [
            { termAr: "المبتدأ", termEn: "Subject (Mubtada)", definitionAr: "الاسم المُبدوء به الجملة الاسمية ويكون مرفوعاً", definitionEn: "The noun starting the nominal sentence, always in nominative case" },
            { termAr: "الخبر", termEn: "Predicate (Khabar)", definitionAr: "ما يُخبر عن المبتدأ ويتمم معناه ويكون مرفوعاً", definitionEn: "What describes the subject and completes its meaning, always in nominative case" },
            { termAr: "الجملة الاسمية", termEn: "Nominal Sentence", definitionAr: "جملة تبدأ باسم", definitionEn: "A sentence beginning with a noun" },
          ],
          formulas: [],
          examples: [
            {
              questionAr: "أعرب الجملة: العلمُ نورٌ",
              questionEn: "Parse the sentence: Knowledge is light",
              solutionAr: "العلمُ: مبتدأ مرفوع وعلامة رفعه الضمة. نورٌ: خبر مرفوع وعلامة رفعه الضمة.",
              solutionEn: "العلمُ: subject, nominative, marked by damma. نورٌ: predicate, nominative, marked by damma.",
              stepsAr: JSON.stringify(["نبحث عن الاسم المُبدوء به = العلمُ (مبتدأ)", "نبحث عن المُخبر به = نورٌ (خبر)"]),
              stepsEn: JSON.stringify(["Find the starting noun = العلمُ (subject)", "Find what describes it = نورٌ (predicate)"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "في جملة 'السماءُ صافيةٌ'، الخبر هو:",
              questionEn: "In the sentence 'The sky is clear', the predicate is:",
              optionsAr: ["السماء", "صافية", "الضمير المستتر", "لا يوجد خبر"],
              optionsEn: ["السماء", "صافية", "Hidden pronoun", "No predicate"],
              answer: "صافية",
              explanationAr: "السماءُ: مبتدأ، صافيةٌ: خبر (خبر مفرد)",
              explanationEn: "السماءُ: subject, صافيةٌ: predicate (singular predicate)",
            },
          ],
        },
      ],
    },
  ],
  // لغة إنجليزية - الصف الأول الثانوي
  "english-1": [
    {
      nameAr: "Grammar Unit",
      nameEn: "وحدة القواعد",
      slug: "grammar-unit-1",
      order: 1,
      lessons: [
        {
          titleAr: "Present Simple Tense",
          titleEn: "زمن المضارع البسيط",
          slug: "present-simple-1",
          descriptionAr: "دراسة زمن المضارع البسيط واستخداماته",
          descriptionEn: "Study of Present Simple tense and its uses",
          introductionAr: "المضارع البسيط يستخدم للتعبير عن الحقائق الثابتة والعادات والروتين اليومي. يتكون من المصدر الأساسي للفعل مع إضافة s أو es للفعل مع الضمائر المفردة.",
          introductionEn: "Present Simple is used to express facts, habits, and daily routines. It consists of the base form of the verb, adding s or es for third person singular.",
          summaryAr: "الاستخدامات: حقائق، عادات، جداول زمنية. التكوين: I/You/We/They + base verb، He/She/It + verb+s/es. النفي: do not/does not + base verb.",
          summaryEn: "Uses: facts, habits, schedules. Formation: I/You/We/They + base verb, He/She/It + verb+s/es. Negative: do not/does not + base verb.",
          duration: 45,
          order: 1,
          isFree: true,
          objectives: [
            { textAr: "فهم استخدامات المضارع البسيط", textEn: "Understand uses of Present Simple" },
            { textAr: "تكوين جمل صحيحة", textEn: "Form correct sentences" },
            { textAr: "التمييز بين التأكيد والنفي والسؤال", textEn: "Distinguish between affirmative, negative, and question" },
          ],
          concepts: [
            { termAr: "Present Simple", termEn: "المضارع البسيط", definitionAr: "زمن للتعبير عن الحقائق والعادات", definitionEn: "A tense for expressing facts and habits" },
            { termAr: "Third Person Singular", termEn: "الضمير المفرد الغائب", definitionAr: "He, She, It - يضاف للفعل معها s/es", definitionEn: "He, She, It - verb takes s/es" },
          ],
          formulas: [
            { formula: "Subject + verb (+ s/es for 3rd person)", explanationAr: "تكوين الجملة المثبتة", explanationEn: "Affirmative sentence formation" },
            { formula: "Subject + do/does + not + base verb", explanationAr: "تكوين الجملة المنفية", explanationEn: "Negative sentence formation" },
          ],
          examples: [
            {
              questionAr: "Complete: She ___ (go) to school every day.",
              questionEn: "أكمل: She ___ (go) to school every day.",
              solutionAr: "She goes to school every day.",
              solutionEn: "She goes to school every day.",
              stepsAr: JSON.stringify(["Subject = She (third person singular)", "Add es to 'go' → goes"]),
              stepsEn: JSON.stringify(["Subject = She (third person singular)", "Add es to 'go' → goes"]),
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              questionAr: "Choose the correct form: The sun ___ in the east.",
              questionEn: "اختر الصحيح: The sun ___ in the east.",
              optionsAr: ["rise", "rises", "rising", "risen"],
              optionsEn: ["rise", "rises", "rising", "risen"],
              answer: "rises",
              explanationAr: "The sun = It (third person singular) → verb + s",
              explanationEn: "The sun = It (third person singular) → verb + s",
            },
          ],
        },
      ],
    },
  ],
};

export async function POST() {
  try {
    console.log("🚀 Starting complete database seeding...");

    // 1. إنشاء السنوات الدراسية
    console.log("📚 Creating academic years...");
    for (const year of academicYearsData) {
      await db.academicYear.upsert({
        where: { code: year.code },
        update: year,
        create: year,
      });
    }

    // 2. إنشاء التخصصات
    console.log("🎓 Creating specializations...");
    for (const spec of specializationsData) {
      await db.specialization.upsert({
        where: { code: spec.code },
        update: spec,
        create: spec,
      });
    }

    // 3. إنشاء الفصول الدراسية
    console.log("📅 Creating semesters...");
    for (const semester of semestersData) {
      await db.semester.upsert({
        where: { code: semester.code },
        update: semester,
        create: semester,
      });
    }

    // 4. إنشاء المواد الدراسية
    console.log("📖 Creating subjects...");
    let totalSubjects = 0;

    // الصف الأول - مواد مشتركة
    const firstYear = await db.academicYear.findUnique({ where: { code: "first-year" } });
    if (firstYear) {
      for (const subject of subjectsData["first-year-common"]) {
        await db.subject.upsert({
          where: { slug: subject.slug },
          update: { ...subject, yearId: firstYear.id, specializationId: null, isCommon: true },
          create: { ...subject, yearId: firstYear.id, specializationId: null, isCommon: true },
        });
        totalSubjects++;
      }
    }

    // الصف الثاني - التخصصات
    const secondYear = await db.academicYear.findUnique({ where: { code: "second-year" } });
    const scienceSpec = await db.specialization.findUnique({ where: { code: "science" } });
    const mathSpec = await db.specialization.findUnique({ where: { code: "math" } });
    const artsSpec = await db.specialization.findUnique({ where: { code: "arts" } });

    if (secondYear) {
      // علمي علوم
      if (scienceSpec) {
        for (const subject of subjectsData["second-year-science"]) {
          await db.subject.upsert({
            where: { slug: subject.slug },
            update: { ...subject, yearId: secondYear.id, specializationId: scienceSpec.id, isCommon: false },
            create: { ...subject, yearId: secondYear.id, specializationId: scienceSpec.id, isCommon: false },
          });
          totalSubjects++;
        }
      }
      // علمي رياضة
      if (mathSpec) {
        for (const subject of subjectsData["second-year-math"]) {
          await db.subject.upsert({
            where: { slug: subject.slug },
            update: { ...subject, yearId: secondYear.id, specializationId: mathSpec.id, isCommon: false },
            create: { ...subject, yearId: secondYear.id, specializationId: mathSpec.id, isCommon: false },
          });
          totalSubjects++;
        }
      }
      // أدبي
      if (artsSpec) {
        for (const subject of subjectsData["second-year-arts"]) {
          await db.subject.upsert({
            where: { slug: subject.slug },
            update: { ...subject, yearId: secondYear.id, specializationId: artsSpec.id, isCommon: false },
            create: { ...subject, yearId: secondYear.id, specializationId: artsSpec.id, isCommon: false },
          });
          totalSubjects++;
        }
      }
    }

    // الصف الثالث - التخصصات
    const thirdYear = await db.academicYear.findUnique({ where: { code: "third-year" } });
    if (thirdYear) {
      // علمي علوم
      if (scienceSpec) {
        for (const subject of subjectsData["third-year-science"]) {
          await db.subject.upsert({
            where: { slug: subject.slug },
            update: { ...subject, yearId: thirdYear.id, specializationId: scienceSpec.id, isCommon: false },
            create: { ...subject, yearId: thirdYear.id, specializationId: scienceSpec.id, isCommon: false },
          });
          totalSubjects++;
        }
      }
      // علمي رياضة
      if (mathSpec) {
        for (const subject of subjectsData["third-year-math"]) {
          await db.subject.upsert({
            where: { slug: subject.slug },
            update: { ...subject, yearId: thirdYear.id, specializationId: mathSpec.id, isCommon: false },
            create: { ...subject, yearId: thirdYear.id, specializationId: mathSpec.id, isCommon: false },
          });
          totalSubjects++;
        }
      }
      // أدبي
      if (artsSpec) {
        for (const subject of subjectsData["third-year-arts"]) {
          await db.subject.upsert({
            where: { slug: subject.slug },
            update: { ...subject, yearId: thirdYear.id, specializationId: artsSpec.id, isCommon: false },
            create: { ...subject, yearId: thirdYear.id, specializationId: artsSpec.id, isCommon: false },
          });
          totalSubjects++;
        }
      }
    }

    // 5. إنشاء الوحدات والدروس
    console.log("📝 Creating units and lessons...");
    let totalUnits = 0;
    let totalLessons = 0;

    for (const [subjectSlug, units] of Object.entries(unitsAndLessonsData)) {
      const subject = await db.subject.findUnique({ where: { slug: subjectSlug } });
      if (!subject) continue;

      const firstSemester = await db.semester.findUnique({ where: { code: "first-semester" } });

      for (const unitData of units) {
        const unit = await db.unit.upsert({
          where: { slug: unitData.slug },
          update: {
            nameAr: unitData.nameAr,
            nameEn: unitData.nameEn,
            order: unitData.order,
            subjectId: subject.id,
            semesterId: firstSemester?.id,
          },
          create: {
            nameAr: unitData.nameAr,
            nameEn: unitData.nameEn,
            slug: unitData.slug,
            order: unitData.order,
            subjectId: subject.id,
            semesterId: firstSemester?.id,
          },
        });
        totalUnits++;

        // إنشاء الدروس
        for (const lessonData of unitData.lessons) {
          const lesson = await db.lesson.upsert({
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
          for (let i = 0; i < lessonData.objectives.length; i++) {
            await db.objective.create({
              data: {
                textAr: lessonData.objectives[i].textAr,
                textEn: lessonData.objectives[i].textEn,
                order: i + 1,
                lessonId: lesson.id,
              },
            });
          }

          // إنشاء المفاهيم
          for (let i = 0; i < lessonData.concepts.length; i++) {
            await db.concept.create({
              data: {
                termAr: lessonData.concepts[i].termAr,
                termEn: lessonData.concepts[i].termEn,
                definitionAr: lessonData.concepts[i].definitionAr,
                definitionEn: lessonData.concepts[i].definitionEn,
                order: i + 1,
                lessonId: lesson.id,
              },
            });
          }

          // إنشاء القوانين
          for (let i = 0; i < lessonData.formulas.length; i++) {
            await db.formula.create({
              data: {
                formula: lessonData.formulas[i].formula,
                explanationAr: lessonData.formulas[i].explanationAr,
                explanationEn: lessonData.formulas[i].explanationEn,
                order: i + 1,
                lessonId: lesson.id,
              },
            });
          }

          // إنشاء الأمثلة
          for (let i = 0; i < lessonData.examples.length; i++) {
            await db.example.create({
              data: {
                questionAr: lessonData.examples[i].questionAr,
                questionEn: lessonData.examples[i].questionEn,
                solutionAr: lessonData.examples[i].solutionAr,
                solutionEn: lessonData.examples[i].solutionEn,
                stepsAr: lessonData.examples[i].stepsAr,
                stepsEn: lessonData.examples[i].stepsEn,
                order: i + 1,
                lessonId: lesson.id,
              },
            });
          }

          // إنشاء الأسئلة
          for (let i = 0; i < lessonData.questions.length; i++) {
            await db.question.create({
              data: {
                type: lessonData.questions[i].type,
                questionAr: lessonData.questions[i].questionAr,
                questionEn: lessonData.questions[i].questionEn,
                optionsAr: JSON.stringify(lessonData.questions[i].optionsAr),
                optionsEn: JSON.stringify(lessonData.questions[i].optionsEn),
                answer: lessonData.questions[i].answer,
                explanationAr: lessonData.questions[i].explanationAr,
                explanationEn: lessonData.questions[i].explanationEn,
                order: i + 1,
                lessonId: lesson.id,
              },
            });
          }
        }
      }
    }

    // 6. إنشاء المحاكيات
    console.log("🎮 Creating simulators...");
    const simulatorsData = [
      { nameAr: "محاكي الحركة", nameEn: "Motion Simulator", slug: "motion-sim", type: "physics", descriptionAr: "محاكاة الحركة المنتظمة والمتسارعة", descriptionEn: "Simulate uniform and accelerated motion", icon: "Play" },
      { nameAr: "محاكي القوى", nameEn: "Forces Simulator", slug: "forces-sim", type: "physics", descriptionAr: "محاكاة القوى ونيوتن", descriptionEn: "Simulate forces and Newton's laws", icon: "Zap" },
      { nameAr: "محاكي الدوائر", nameEn: "Circuits Simulator", slug: "circuits-sim", type: "physics", descriptionAr: "محاكاة الدوائر الكهربائية", descriptionEn: "Simulate electrical circuits", icon: "Cpu" },
      { nameAr: "محاكي الذرة", nameEn: "Atom Simulator", slug: "atom-sim", type: "chemistry", descriptionAr: "محاكاة تركيب الذرة", descriptionEn: "Simulate atomic structure", icon: "Atom" },
      { nameAr: "محاكي التفاعلات", nameEn: "Reactions Simulator", slug: "reactions-sim", type: "chemistry", descriptionAr: "محاكاة التفاعلات الكيميائية", descriptionEn: "Simulate chemical reactions", icon: "FlaskConical" },
      { nameAr: "محاكي الدوال", nameEn: "Functions Simulator", slug: "functions-sim", type: "math", descriptionAr: "رسم وتحليل الدوال", descriptionEn: "Plot and analyze functions", icon: "TrendingUp" },
      { nameAr: "محاكي الهندسة", nameEn: "Geometry Simulator", slug: "geometry-sim", type: "math", descriptionAr: "إنشاء أشكال هندسية", descriptionEn: "Create geometric shapes", icon: "Target" },
      { nameAr: "محاكي الخلايا", nameEn: "Cell Simulator", slug: "cell-sim", type: "biology", descriptionAr: "استكشاف تركيب الخلية", descriptionEn: "Explore cell structure", icon: "Microscope" },
    ];

    for (const sim of simulatorsData) {
      await db.simulator.upsert({
        where: { slug: sim.slug },
        update: sim,
        create: sim,
      });
    }

    console.log("✅ Seeding completed successfully!");

    return NextResponse.json({
      success: true,
      message: "تم إنشاء البيانات بنجاح",
      stats: {
        academicYears: academicYearsData.length,
        specializations: specializationsData.length,
        semesters: semestersData.length,
        subjects: totalSubjects,
        units: totalUnits,
        lessons: totalLessons,
        simulators: simulatorsData.length,
      },
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return NextResponse.json(
      { error: "فشل في إنشاء البيانات", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
