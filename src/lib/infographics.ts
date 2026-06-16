// ==========================================
// أنواع البيانات للمخططات البيانية
// Data Types for Infographics
// ==========================================

// عنصر المقارنة | Comparison Item
export interface ComparisonItem {
  label: string;
  labelAr: string;
  value1: number;
  value2: number;
  label1: string;
  label2: string;
  maxValue?: number;
}

// خطوة العملية | Process Step
export interface ProcessStep {
  step: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon?: string;
}

// قسم الدائرة | Circle Segment
export interface CircleSegment {
  label: string;
  labelAr: string;
  value: number;
  color: string;
  description?: string;
  descriptionAr?: string;
}

// حدث الجدول الزمني | Timeline Event
export interface TimelineEvent {
  year: string;
  yearAr?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon?: string;
}

// بيانات المخططات | Chart Data
export interface ComparisonData {
  items: ComparisonItem[];
  showValues?: boolean;
}

export interface ProcessData {
  steps: ProcessStep[];
  showNumbers?: boolean;
}

export interface CircleData {
  segments: CircleSegment[];
  showPercentage?: boolean;
  centerLabel?: string;
  centerLabelAr?: string;
}

export interface TimelineData {
  events: TimelineEvent[];
  showYear?: boolean;
}

// Props الرئيسية | Main Props
export interface InfographicData {
  id: string;
  type: "comparison" | "process" | "circle" | "timeline";
  data: ComparisonData | ProcessData | CircleData | TimelineData;
  title: string;
  titleAr: string;
  subject: string;
  subjectAr: string;
}

// ==========================================
// الفيزياء | Physics
// ==========================================

const physicsInfographics: InfographicData[] = [
  // السرعة مقابل السرعة المتجهة | Speed vs Velocity
  {
    id: "physics-speed-velocity",
    type: "comparison",
    title: "Speed vs Velocity",
    titleAr: "السرعة مقابل السرعة المتجهة",
    subject: "Physics",
    subjectAr: "الفيزياء",
    data: {
      items: [
        {
          label: "Definition",
          labelAr: "التعريف",
          value1: 100,
          value2: 100,
          label1: "Speed",
          label2: "Velocity",
        },
        {
          label: "Scalar/Vector",
          labelAr: "كمية قياسية/متجهة",
          value1: 100,
          value2: 100,
          label1: "Scalar",
          label2: "Vector",
        },
        {
          label: "Direction",
          labelAr: "الاتجاه",
          value1: 0,
          value2: 100,
          label1: "No Direction",
          label2: "Has Direction",
        },
        {
          label: "Formula",
          labelAr: "القانون",
          value1: 100,
          value2: 100,
          label1: "d/t",
          label2: "Δd/Δt",
        },
        {
          label: "Example",
          labelAr: "مثال",
          value1: 80,
          value2: 80,
          label1: "80 km/h",
          label2: "80 km/h North",
        },
      ],
      showValues: false,
    },
  },

  // أنواع الطاقة | Energy Types
  {
    id: "physics-energy-types",
    type: "circle",
    title: "Types of Energy",
    titleAr: "أنواع الطاقة",
    subject: "Physics",
    subjectAr: "الفيزياء",
    data: {
      segments: [
        {
          label: "Kinetic Energy",
          labelAr: "الطاقة الحركية",
          value: 25,
          color: "#10B981",
          description: "Energy of motion - ½mv²",
          descriptionAr: "طاقة الحركة - ½mv²",
        },
        {
          label: "Potential Energy",
          labelAr: "الطاقة الكامنة",
          value: 25,
          color: "#F59E0B",
          description: "Stored energy due to position - mgh",
          descriptionAr: "الطاقة المخزنة بسبب الموضع - mgh",
        },
        {
          label: "Thermal Energy",
          labelAr: "الطاقة الحرارية",
          value: 20,
          color: "#EF4444",
          description: "Energy from heat",
          descriptionAr: "الطاقة الناتجة عن الحرارة",
        },
        {
          label: "Electrical Energy",
          labelAr: "الطاقة الكهربائية",
          value: 15,
          color: "#3B82F6",
          description: "Energy from electric charges",
          descriptionAr: "الطاقة الناتجة عن الشحنات الكهربائية",
        },
        {
          label: "Chemical Energy",
          labelAr: "الطاقة الكيميائية",
          value: 10,
          color: "#8B5CF6",
          description: "Energy stored in chemical bonds",
          descriptionAr: "الطاقة المخزنة في الروابط الكيميائية",
        },
        {
          label: "Nuclear Energy",
          labelAr: "الطاقة النووية",
          value: 5,
          color: "#EC4899",
          description: "Energy from atomic nuclei",
          descriptionAr: "الطاقة من نوى الذرات",
        },
      ],
      showPercentage: true,
      centerLabel: "Energy",
      centerLabelAr: "الطاقة",
    },
  },

  // خصائص الموجات | Wave Properties
  {
    id: "physics-wave-properties",
    type: "process",
    title: "Wave Properties",
    titleAr: "خصائص الموجات",
    subject: "Physics",
    subjectAr: "الفيزياء",
    data: {
      steps: [
        {
          step: 1,
          title: "Wavelength (λ)",
          titleAr: "الطول الموجي (λ)",
          description: "Distance between two consecutive crests or troughs, measured in meters",
          descriptionAr: "المسافة بين قمتين متتاليتين أو قاعين متتاليين، تُقاس بالأمتار",
          icon: "ruler",
        },
        {
          step: 2,
          title: "Frequency (f)",
          titleAr: "التردد (f)",
          description: "Number of complete waves per second, measured in Hertz (Hz)",
          descriptionAr: "عدد الموجات الكاملة في الثانية، يُقاس بالهرتز",
          icon: "activity",
        },
        {
          step: 3,
          title: "Amplitude (A)",
          titleAr: "السعة (A)",
          description: "Maximum displacement from equilibrium position, determines wave energy",
          descriptionAr: "أقصى إزاحة من وضع الاتزان، تحدد طاقة الموجة",
          icon: "trending-up",
        },
        {
          step: 4,
          title: "Wave Speed (v)",
          titleAr: "سرعة الموجة (v)",
          description: "Speed at which wave travels through medium: v = f × λ",
          descriptionAr: "السرعة التي تنتقل بها الموجة عبر الوسط: v = f × λ",
          icon: "zap",
        },
      ],
      showNumbers: true,
    },
  },

  // أنواع الدوائر الكهربائية | Circuit Types
  {
    id: "physics-circuit-types",
    type: "comparison",
    title: "Circuit Types",
    titleAr: "أنواع الدوائر الكهربائية",
    subject: "Physics",
    subjectAr: "الفيزياء",
    data: {
      items: [
        {
          label: "Current Path",
          labelAr: "مسار التيار",
          value1: 100,
          value2: 50,
          label1: "Series",
          label2: "Parallel",
        },
        {
          label: "Voltage",
          labelAr: "الجهد",
          value1: 33,
          value2: 100,
          label1: "Divided",
          label2: "Same",
        },
        {
          label: "Current",
          labelAr: "تيار",
          value1: 100,
          value2: 33,
          label1: "Same",
          label2: "Divided",
        },
        {
          label: "Resistance",
          labelAr: "المقاومة",
          value1: 100,
          value2: 33,
          label1: "Add Up",
          label2: "Decreases",
        },
        {
          label: "If One Breaks",
          labelAr: "إذا انقطع واحد",
          value1: 0,
          value2: 100,
          label1: "All Stop",
          label2: "Others Work",
        },
      ],
      showValues: false,
    },
  },
];

// ==========================================
// الكيمياء | Chemistry
// ==========================================

const chemistryInfographics: InfographicData[] = [
  // خصائص العناصر | Element Properties
  {
    id: "chemistry-element-properties",
    type: "circle",
    title: "Element Properties",
    titleAr: "خصائص العناصر",
    subject: "Chemistry",
    subjectAr: "الكيمياء",
    data: {
      segments: [
        {
          label: "Metals",
          labelAr: "الفلات",
          value: 75,
          color: "#10B981",
          description: "Good conductors, malleable, ductile, shiny",
          descriptionAr: "موصلات جيدة، قابلة للطرق والسحب، لامعة",
        },
        {
          label: "Non-metals",
          labelAr: "اللافللات",
          value: 17,
          color: "#F59E0B",
          description: "Poor conductors, brittle, dull appearance",
          descriptionAr: "موصلات ضعيفة، هشة، مظهر غير لامع",
        },
        {
          label: "Metalloids",
          labelAr: "أشباه الفلات",
          value: 8,
          color: "#8B5CF6",
          description: "Semi-conductors, properties of both metals and non-metals",
          descriptionAr: "أشباه موصلات، خصائص مشتركة بين الفلات واللافللات",
        },
      ],
      showPercentage: true,
      centerLabel: "Elements",
      centerLabelAr: "العناصر",
    },
  },

  // أنواع التفاعلات | Reaction Types
  {
    id: "chemistry-reaction-types",
    type: "process",
    title: "Types of Chemical Reactions",
    titleAr: "أنواع التفاعلات الكيميائية",
    subject: "Chemistry",
    subjectAr: "الكيمياء",
    data: {
      steps: [
        {
          step: 1,
          title: "Synthesis",
          titleAr: "تفاعل الاتحاد",
          description: "A + B → AB: Two or more substances combine to form one compound",
          descriptionAr: "مادتان أو أكثر تتحدان لتكوين مركب واحد",
          icon: "plus",
        },
        {
          step: 2,
          title: "Decomposition",
          titleAr: "تفاعل التفكك",
          description: "AB → A + B: One compound breaks down into simpler substances",
          descriptionAr: "مركب واحد يتفكك إلى مواد أبسط",
          icon: "minus",
        },
        {
          step: 3,
          title: "Single Replacement",
          titleAr: "تفاعل الاستبدال البسيط",
          description: "A + BC → AC + B: One element replaces another in a compound",
          descriptionAr: "عنصر يحل محل عنصر آخر في مركب",
          icon: "repeat",
        },
        {
          step: 4,
          title: "Double Replacement",
          titleAr: "تفاعل الاستبدال المزدوج",
          description: "AB + CD → AD + CB: Ions exchange between two compounds",
          descriptionAr: "تبادل الأيونات بين مركبين",
          icon: "shuffle",
        },
        {
          step: 5,
          title: "Combustion",
          titleAr: "تفاعل الاحتراق",
          description: "Fuel + O₂ → CO₂ + H₂O: Substance reacts with oxygen releasing energy",
          descriptionAr: "مادة تتفاعل مع الأكسجين وتطلق طاقة",
          icon: "flame",
        },
      ],
      showNumbers: true,
    },
  },

  // أنواع الروابط | Bond Types
  {
    id: "chemistry-bond-types",
    type: "comparison",
    title: "Chemical Bond Types",
    titleAr: "أنواع الروابط الكيميائية",
    subject: "Chemistry",
    subjectAr: "الكيمياء",
    data: {
      items: [
        {
          label: "Electron Transfer",
          labelAr: "نقل الإلكترونات",
          value1: 100,
          value2: 0,
          label1: "Ionic",
          label2: "Covalent",
        },
        {
          label: "Electron Sharing",
          labelAr: "مشاركة الإلكترونات",
          value1: 0,
          value2: 100,
          label1: "Ionic",
          label2: "Covalent",
        },
        {
          label: "Between",
          labelAr: "بين",
          value1: 100,
          value2: 50,
          label1: "Metal + Non-metal",
          label2: "Non-metal + Non-metal",
        },
        {
          label: "Melting Point",
          labelAr: "درجة الانصهار",
          value1: 100,
          value2: 50,
          label1: "High",
          label2: "Low",
        },
        {
          label: "Conductivity",
          labelAr: "التوصيل الكهربائي",
          value1: 80,
          value2: 20,
          label1: "High (molten/aq)",
          label2: "Low",
        },
      ],
      showValues: false,
    },
  },

  // حالات المادة | States of Matter
  {
    id: "chemistry-states-matter",
    type: "circle",
    title: "States of Matter",
    titleAr: "حالات المادة",
    subject: "Chemistry",
    subjectAr: "الكيمياء",
    data: {
      segments: [
        {
          label: "Solid",
          labelAr: "الصلبة",
          value: 25,
          color: "#3B82F6",
          description: "Fixed shape and volume, particles vibrate in place",
          descriptionAr: "شكل وحجم ثابتان، الجزيئات تهتز في مكانها",
        },
        {
          label: "Liquid",
          labelAr: "السائلة",
          value: 25,
          color: "#10B981",
          description: "Fixed volume, takes container shape, particles flow",
          descriptionAr: "حجم ثابت، يأخذ شكل الإناء، الجزيئات تتدفق",
        },
        {
          label: "Gas",
          labelAr: "الغازية",
          value: 25,
          color: "#F59E0B",
          description: "No fixed shape or volume, particles move freely",
          descriptionAr: "لا شكل ولا حجم ثابت، الجزيئات تتحرك بحرية",
        },
        {
          label: "Plasma",
          labelAr: "البلازما",
          value: 25,
          color: "#EF4444",
          description: "Ionized gas, conducts electricity, found in stars",
          descriptionAr: "غاز متأين، يوصل الكهرباء، موجود في النجوم",
        },
      ],
      showPercentage: true,
      centerLabel: "Matter",
      centerLabelAr: "المادة",
    },
  },
];

// ==========================================
// الأحياء | Biology
// ==========================================

const biologyInfographics: InfographicData[] = [
  // أنواع الخلايا | Cell Types
  {
    id: "biology-cell-types",
    type: "comparison",
    title: "Cell Types",
    titleAr: "أنواع الخلايا",
    subject: "Biology",
    subjectAr: "الأحياء",
    data: {
      items: [
        {
          label: "Nucleus",
          labelAr: "النواة",
          value1: 100,
          value2: 0,
          label1: "Eukaryotic",
          label2: "Prokaryotic",
        },
        {
          label: "Membrane Organelles",
          labelAr: "عضيات غشائية",
          value1: 100,
          value2: 0,
          label1: "Eukaryotic",
          label2: "Prokaryotic",
        },
        {
          label: "Size",
          labelAr: "الحجم",
          value1: 100,
          value2: 30,
          label1: "Larger (10-100μm)",
          label2: "Smaller (1-10μm)",
        },
        {
          label: "DNA Form",
          labelAr: "شكل الحمض النووي",
          value1: 100,
          value2: 50,
          label1: "Linear in nucleus",
          label2: "Circular in cytoplasm",
        },
        {
          label: "Examples",
          labelAr: "أمثلة",
          value1: 80,
          value2: 80,
          label1: "Plants, Animals",
          label2: "Bacteria",
        },
      ],
      showValues: false,
    },
  },

  // أجهزة الجسم | Body Systems
  {
    id: "biology-body-systems",
    type: "circle",
    title: "Human Body Systems",
    titleAr: "أجهزة جسم الإنسان",
    subject: "Biology",
    subjectAr: "الأحياء",
    data: {
      segments: [
        {
          label: "Circulatory",
          labelAr: "الدوري",
          value: 12,
          color: "#EF4444",
          description: "Heart, blood vessels - transports nutrients and oxygen",
          descriptionAr: "القلب، الأوعية الدموية - ينقل المغذيات والأكسجين",
        },
        {
          label: "Respiratory",
          labelAr: "التنفسي",
          value: 12,
          color: "#3B82F6",
          description: "Lungs, airways - gas exchange",
          descriptionAr: "الرئتين، الممرات الهوائية - تبادل الغازات",
        },
        {
          label: "Digestive",
          labelAr: "الهضمي",
          value: 12,
          color: "#F59E0B",
          description: "Stomach, intestines - breaks down food",
          descriptionAr: "المعدة، الأمعاء - يهضم الطعام",
        },
        {
          label: "Nervous",
          labelAr: "العصبي",
          value: 12,
          color: "#8B5CF6",
          description: "Brain, nerves - controls body functions",
          descriptionAr: "الدماغ، الأعصاب - يتحكم في وظائف الجسم",
        },
        {
          label: "Skeletal",
          labelAr: "الهيكلي",
          value: 12,
          color: "#EC4899",
          description: "Bones, joints - support and protection",
          descriptionAr: "العظام، المفاصل - الدعم والحماية",
        },
        {
          label: "Muscular",
          labelAr: "العضلي",
          value: 12,
          color: "#10B981",
          description: "Muscles - movement and posture",
          descriptionAr: "العضلات - الحركة والوضعية",
        },
        {
          label: "Reproductive",
          labelAr: "التناسلي",
          value: 8,
          color: "#14B8A6",
          description: "Reproductive organs - reproduction",
          descriptionAr: "الأعضاء التناسلية - التكاثر",
        },
        {
          label: "Excretory",
          labelAr: "الإخراجي",
          value: 8,
          color: "#F97316",
          description: "Kidneys, bladder - removes waste",
          descriptionAr: "الكليتين، المثانة - يزيل الفضلات",
        },
      ],
      showPercentage: true,
      centerLabel: "Body Systems",
      centerLabelAr: "أجهزة الجسم",
    },
  },

  // دورة حياة الخلية | Cell Life Cycle
  {
    id: "biology-cell-cycle",
    type: "process",
    title: "Cell Life Cycle",
    titleAr: "دورة حياة الخلية",
    subject: "Biology",
    subjectAr: "الأحياء",
    data: {
      steps: [
        {
          step: 1,
          title: "Interphase (G1)",
          titleAr: "الطور البيني (G1)",
          description: "Cell grows and prepares for DNA replication",
          descriptionAr: "الخلية تنمو وتستعد لتكاثر الحمض النووي",
          icon: "circle",
        },
        {
          step: 2,
          title: "Interphase (S)",
          titleAr: "الطور البيني (S)",
          description: "DNA replication occurs - chromosomes duplicated",
          descriptionAr: "يحدث تكاثر الحمض النووي - الكروموسومات تتضاعف",
          icon: "copy",
        },
        {
          step: 3,
          title: "Interphase (G2)",
          titleAr: "الطور البيني (G2)",
          description: "Cell prepares for division, organelles duplicate",
          descriptionAr: "الخلية تستعد للانقسام، العضيات تتضاعف",
          icon: "settings",
        },
        {
          step: 4,
          title: "Mitosis",
          titleAr: "الانقسام المتساوي",
          description: "Nucleus divides: Prophase → Metaphase → Anaphase → Telophase",
          descriptionAr: "النواة تنقسم: الطور التمهيدي → الطور الاستوائي → الطور الانفصالي → الطور النهائي",
          icon: "git-branch",
        },
        {
          step: 5,
          title: "Cytokinesis",
          titleAr: "انقسام السيتوبلازم",
          description: "Cytoplasm divides, two identical daughter cells form",
          descriptionAr: "السيتوبلازم ينقسم، خليتان ابنتان متطابقتان تتكونان",
          icon: "split",
        },
      ],
      showNumbers: true,
    },
  },

  // مكونات النظام البيئي | Ecosystem Components
  {
    id: "biology-ecosystem",
    type: "circle",
    title: "Ecosystem Components",
    titleAr: "مكونات النظام البيئي",
    subject: "Biology",
    subjectAr: "الأحياء",
    data: {
      segments: [
        {
          label: "Producers",
          labelAr: "المنتجات",
          value: 35,
          color: "#10B981",
          description: "Plants, algae - make their own food through photosynthesis",
          descriptionAr: "النباتات، الطحالب - تصنع غذائها بنفسها عبر البناء الضوئي",
        },
        {
          label: "Primary Consumers",
          labelAr: "المستهلكات الأولية",
          value: 25,
          color: "#F59E0B",
          description: "Herbivores - eat producers",
          descriptionAr: "آكلات العشب - تأكل المنتجات",
        },
        {
          label: "Secondary Consumers",
          labelAr: "المستهلكات الثانوية",
          value: 20,
          color: "#EF4444",
          description: "Carnivores - eat primary consumers",
          descriptionAr: "آكلات اللحوم - تأكل المستهلكات الأولية",
        },
        {
          label: "Decomposers",
          labelAr: "المحللات",
          value: 20,
          color: "#8B5CF6",
          description: "Bacteria, fungi - break down dead organisms",
          descriptionAr: "البكتيريا، الفطريات - تحلل الكائنات الميتة",
        },
      ],
      showPercentage: true,
      centerLabel: "Ecosystem",
      centerLabelAr: "النظام البيئي",
    },
  },
];

// ==========================================
// الرياضيات | Mathematics
// ==========================================

const mathematicsInfographics: InfographicData[] = [
  // أنواع الأعداد | Number Types
  {
    id: "math-number-types",
    type: "circle",
    title: "Types of Numbers",
    titleAr: "أنواع الأعداد",
    subject: "Mathematics",
    subjectAr: "الرياضيات",
    data: {
      segments: [
        {
          label: "Natural Numbers (ℕ)",
          labelAr: "الأعداد الطبيعية (ℕ)",
          value: 20,
          color: "#10B981",
          description: "Counting numbers: 1, 2, 3, 4, ...",
          descriptionAr: "أعداد العد: 1، 2، 3، 4، ...",
        },
        {
          label: "Whole Numbers (W)",
          labelAr: "الأعداد الكاملة (W)",
          value: 15,
          color: "#3B82F6",
          description: "Natural numbers + zero: 0, 1, 2, 3, ...",
          descriptionAr: "الأعداد الطبيعية + الصفر: 0، 1، 2، 3، ...",
        },
        {
          label: "Integers (ℤ)",
          labelAr: "الأعداد الصحيحة (ℤ)",
          value: 20,
          color: "#F59E0B",
          description: "Whole numbers + negatives: ..., -2, -1, 0, 1, 2, ...",
          descriptionAr: "الأعداد الكاملة + السالبة: ...، -2، -1، 0، 1، 2، ...",
        },
        {
          label: "Rational Numbers (ℚ)",
          labelAr: "الأعداد النسبية (ℚ)",
          value: 20,
          color: "#8B5CF6",
          description: "Fractions and decimals: ½, 0.75, -3/4",
          descriptionAr: "الكسور والأعداد العشرية: ½، 0.75، -3/4",
        },
        {
          label: "Irrational Numbers",
          labelAr: "الأعداد غير النسبية",
          value: 15,
          color: "#EF4444",
          description: "Non-terminating, non-repeating: π, √2, e",
          descriptionAr: "غير منتهية، غير متكررة: π، √2، e",
        },
        {
          label: "Real Numbers (ℝ)",
          labelAr: "الأعداد الحقيقية (ℝ)",
          value: 10,
          color: "#EC4899",
          description: "All rational + irrational numbers",
          descriptionAr: "كل الأعداد النسبية وغير النسبية",
        },
      ],
      showPercentage: true,
      centerLabel: "Numbers",
      centerLabelAr: "الأعداد",
    },
  },

  // أنواع الدوال | Function Types
  {
    id: "math-function-types",
    type: "comparison",
    title: "Types of Functions",
    titleAr: "أنواع الدوال",
    subject: "Mathematics",
    subjectAr: "الرياضيات",
    data: {
      items: [
        {
          label: "Graph Shape",
          labelAr: "شكل الرسم البياني",
          value1: 100,
          value2: 50,
          label1: "Linear",
          label2: "Quadratic",
        },
        {
          label: "Equation Form",
          labelAr: "شكل المعادلة",
          value1: 50,
          value2: 100,
          label1: "y = mx + b",
          label2: "y = ax² + bx + c",
        },
        {
          label: "Degree",
          labelAr: "الدرجة",
          value1: 33,
          value2: 66,
          label1: "1st Degree",
          label2: "2nd Degree",
        },
        {
          label: "Rate of Change",
          labelAr: "معدل التغير",
          value1: 100,
          value2: 0,
          label1: "Constant",
          label2: "Variable",
        },
        {
          label: "Symmetry",
          labelAr: "التماثل",
          value1: 0,
          value2: 100,
          label1: "None",
          label2: "Axis of Symmetry",
        },
      ],
      showValues: false,
    },
  },

  // الأشكال الهندسية | Geometry Shapes
  {
    id: "math-geometry-shapes",
    type: "process",
    title: "Classification of Triangles",
    titleAr: "تصنيف المثلثات",
    subject: "Mathematics",
    subjectAr: "الرياضيات",
    data: {
      steps: [
        {
          step: 1,
          title: "Equilateral",
          titleAr: "متساوي الأضلاع",
          description: "All three sides equal, all angles = 60°",
          descriptionAr: "الثلاثة أضلاع متساوية، كل الزوايا = 60°",
          icon: "triangle",
        },
        {
          step: 2,
          title: "Isosceles",
          titleAr: "متساوي الساقين",
          description: "Two sides equal, two angles equal",
          descriptionAr: "ضلعان متساويان، زاويتان متساويتان",
          icon: "triangle",
        },
        {
          step: 3,
          title: "Scalene",
          titleAr: "مختلف الأضلاع",
          description: "No equal sides, no equal angles",
          descriptionAr: "لا أضلاع متساوية، لا زوايا متساوية",
          icon: "triangle",
        },
        {
          step: 4,
          title: "Right-angled",
          titleAr: "قائم الزاوية",
          description: "One angle = 90°, follows Pythagorean theorem",
          descriptionAr: "زاوية واحدة = 90°، يتبع نظرية فيثاغورس",
          icon: "square",
        },
      ],
      showNumbers: true,
    },
  },
];

// ==========================================
// الجغرافيا | Geography
// ==========================================

const geographyInfographics: InfographicData[] = [
  // المناطق المناخية | Climate Zones
  {
    id: "geography-climate-zones",
    type: "circle",
    title: "Climate Zones",
    titleAr: "المناطق المناخية",
    subject: "Geography",
    subjectAr: "الجغرافيا",
    data: {
      segments: [
        {
          label: "Tropical",
          labelAr: "الاستوائية",
          value: 20,
          color: "#EF4444",
          description: "Hot and humid year-round, near equator",
          descriptionAr: "حارة ورطبة على مدار السنة، قرب خط الاستواء",
        },
        {
          label: "Subtropical",
          labelAr: "شبه الاستوائية",
          value: 15,
          color: "#F59E0B",
          description: "Warm summers, mild winters",
          descriptionAr: "صيف حار، شتاء معتدل",
        },
        {
          label: "Temperate",
          labelAr: "المعتدلة",
          value: 25,
          color: "#10B981",
          description: "Four distinct seasons, moderate temperatures",
          descriptionAr: "أربع فصول مميزة، درجات حرارة معتدلة",
        },
        {
          label: "Continental",
          labelAr: "القارية",
          value: 20,
          color: "#8B5CF6",
          description: "Hot summers, cold winters, away from oceans",
          descriptionAr: "صيف حار، شتاء بارد، بعيد عن المحيطات",
        },
        {
          label: "Polar",
          labelAr: "القطبية",
          value: 20,
          color: "#3B82F6",
          description: "Very cold year-round, ice and snow",
          descriptionAr: "باردة جداً على مدار السنة، جليد وثلوج",
        },
      ],
      showPercentage: true,
      centerLabel: "Climate",
      centerLabelAr: "المناخ",
    },
  },

  // توزيع السكان | Population Distribution
  {
    id: "geography-population",
    type: "comparison",
    title: "Population Distribution Factors",
    titleAr: "عوامل توزيع السكان",
    subject: "Geography",
    subjectAr: "الجغرافيا",
    data: {
      items: [
        {
          label: "Water Availability",
          labelAr: "توفر المياه",
          value1: 100,
          value2: 20,
          label1: "High Density",
          label2: "Low Density",
        },
        {
          label: "Climate",
          labelAr: "المناخ",
          value1: 80,
          value2: 30,
          label1: "Moderate",
          label2: "Extreme",
        },
        {
          label: "Terrain",
          labelAr: "التضاريس",
          value1: 90,
          value2: 20,
          label1: "Flat/Fertile",
          label2: "Mountainous",
        },
        {
          label: "Economic Opportunities",
          labelAr: "الفرص الاقتصادية",
          value1: 100,
          value2: 30,
          label1: "Jobs Available",
          label2: "Limited Jobs",
        },
        {
          label: "Infrastructure",
          labelAr: "البنية التحتية",
          value1: 95,
          value2: 25,
          label1: "Developed",
          label2: "Underdeveloped",
        },
      ],
      showValues: false,
    },
  },

  // أنواع الموارد | Resource Types
  {
    id: "geography-resources",
    type: "circle",
    title: "Natural Resource Types",
    titleAr: "أنواع الموارد الطبيعية",
    subject: "Geography",
    subjectAr: "الجغرافيا",
    data: {
      segments: [
        {
          label: "Renewable",
          labelAr: "المتجددة",
          value: 40,
          color: "#10B981",
          description: "Solar, wind, water - replenished naturally",
          descriptionAr: "الطاقة الشمسية، الرياح، المياه - تتجدد طبيعياً",
        },
        {
          label: "Non-renewable",
          labelAr: "غير المتجددة",
          value: 35,
          color: "#EF4444",
          description: "Oil, coal, natural gas - limited supply",
          descriptionAr: "البترول، الفحم، الغاز الطبيعي - إمدادات محدودة",
        },
        {
          label: "Flow Resources",
          labelAr: "موارد التدفق",
          value: 15,
          color: "#3B82F6",
          description: "Water cycle, tides - continuous flow",
          descriptionAr: "دورة المياه، المد والجزر - تدفق مستمر",
        },
        {
          label: "Stock Resources",
          labelAr: "الموارد المخزونة",
          value: 10,
          color: "#F59E0B",
          description: "Minerals in Earth's crust - usable with technology",
          descriptionAr: "المعادن في القشرة الأرضية - قابلة للاستخدام بالتكنولوجيا",
        },
      ],
      showPercentage: true,
      centerLabel: "Resources",
      centerLabelAr: "الموارد",
    },
  },
];

// ==========================================
// اللغة العربية | Arabic Language
// ==========================================

const arabicInfographics: InfographicData[] = [
  // أنواع الجمل | Sentence Types
  {
    id: "arabic-sentence-types",
    type: "comparison",
    title: "Types of Sentences in Arabic",
    titleAr: "أنواع الجمل في اللغة العربية",
    subject: "Arabic",
    subjectAr: "اللغة العربية",
    data: {
      items: [
        {
          label: "Main Component",
          labelAr: "المكون الرئيسي",
          value1: 100,
          value2: 100,
          label1: "Noun (اسم)",
          label2: "Verb (فعل)",
        },
        {
          label: "Begins With",
          labelAr: "تبدأ بـ",
          value1: 100,
          value2: 100,
          label1: "Noun",
          label2: "Verb",
        },
        {
          label: "Tense",
          labelAr: "الزمن",
          value1: 0,
          value2: 100,
          label1: "No specific tense",
          label2: "Past/Present/Imperative",
        },
        {
          label: "Example",
          labelAr: "مثال",
          value1: 50,
          value2: 50,
          label1: "الطالبُ مجتهدٌ",
          label2: "يدرسُ الطالبُ",
        },
      ],
      showValues: false,
    },
  },

  // أشكال الشعر | Poetry Forms
  {
    id: "arabic-poetry-forms",
    type: "process",
    title: "Forms of Arabic Poetry",
    titleAr: "أشكال الشعر العربي",
    subject: "Arabic",
    subjectAr: "اللغة العربية",
    data: {
      steps: [
        {
          step: 1,
          title: "Traditional (العمودي)",
          titleAr: "الشعر العمودي",
          description: "Follows meter (بحر) and rhyme (قافية), one poem = one meter",
          descriptionAr: "يلتزم بالبحر والقافية، القصيدة على بحر واحد",
          icon: "book",
        },
        {
          step: 2,
          title: "Free Verse (الحر)",
          titleAr: "شعر التفعيلة",
          description: "Free from single meter, uses poetic units (تفعيلات)",
          descriptionAr: "تحرر من وحدة البحر، يستخدم التفعيلات",
          icon: "feather",
        },
        {
          step: 3,
          title: "Prose Poetry (النثر)",
          titleAr: "قصيدة النثر",
          description: "Free from meter and rhyme, focuses on imagery",
          descriptionAr: "تحرر من الوزن والقافية، يركز على الصورة الشعرية",
          icon: "edit",
        },
      ],
      showNumbers: true,
    },
  },

  // الصور البيانية | Literary Devices
  {
    id: "arabic-literary-devices",
    type: "circle",
    title: "Figurative Language",
    titleAr: "الصور البيانية",
    subject: "Arabic",
    subjectAr: "اللغة العربية",
    data: {
      segments: [
        {
          label: "Simile (تشبيه)",
          labelAr: "التشبيه",
          value: 30,
          color: "#10B981",
          description: "Comparison using 'like' or 'as' (كـ، مثل)",
          descriptionAr: "مقارنة باستخدام أداة تشبيه (كـ، مثل)",
        },
        {
          label: "Metaphor (استعارة)",
          labelAr: "الاستعارة",
          value: 25,
          color: "#F59E0B",
          description: "Direct comparison without comparison words",
          descriptionAr: "تشبيه بليغ بدون أداة تشبيه",
        },
        {
          label: "Personification (تشخيص)",
          labelAr: "التشخيص",
          value: 20,
          color: "#8B5CF6",
          description: "Giving human qualities to non-human things",
          descriptionAr: "إسباغ صفات الإنسان على غير الإنسان",
        },
        {
          label: "Hyperbole (مبالغة)",
          labelAr: "المبالغة",
          value: 15,
          color: "#EF4444",
          description: "Exaggeration for effect",
          descriptionAr: "تضخيم الصورة للتأثير",
        },
        {
          label: "Metonymy (كناية)",
          labelAr: "الكناية",
          value: 10,
          color: "#3B82F6",
          description: "Using associated word to describe something",
          descriptionAr: "ذكر شيء للدلالة على شيء آخر مرتبط به",
        },
      ],
      showPercentage: true,
      centerLabel: "Figures",
      centerLabelAr: "الصور",
    },
  },
];

// ==========================================
// اللغة الإنجليزية | English Language
// ==========================================

const englishInfographics: InfographicData[] = [
  // الأزمنة | Tenses
  {
    id: "english-tenses",
    type: "process",
    title: "English Tenses",
    titleAr: "الأزمنة في اللغة الإنجليزية",
    subject: "English",
    subjectAr: "اللغة الإنجليزية",
    data: {
      steps: [
        {
          step: 1,
          title: "Present Simple",
          titleAr: "المضارع البسيط",
          description: "Habits, facts, routines: I work every day",
          descriptionAr: "العادات، الحقائق، الروتين: أعمل كل يوم",
          icon: "clock",
        },
        {
          step: 2,
          title: "Present Continuous",
          titleAr: "المضارع المستمر",
          description: "Actions happening now: I am working now",
          descriptionAr: "أفعال تحدث الآن: أنا أعمل الآن",
          icon: "activity",
        },
        {
          step: 3,
          title: "Past Simple",
          titleAr: "الماضي البسيط",
          description: "Completed actions: I worked yesterday",
          descriptionAr: "أفعال انتهت: عملتُ أمس",
          icon: "rewind",
        },
        {
          step: 4,
          title: "Past Continuous",
          titleAr: "الماضي المستمر",
          description: "Ongoing past actions: I was working when...",
          descriptionAr: "أفعال كانت مستمرة في الماضي: كنت أعمل عندما...",
          icon: "history",
        },
        {
          step: 5,
          title: "Future Simple",
          titleAr: "المستقبل البسيط",
          description: "Future actions, predictions: I will work tomorrow",
          descriptionAr: "أفعال مستقبلية، تنبؤات: سأعمل غداً",
          icon: "trending-up",
        },
        {
          step: 6,
          title: "Present Perfect",
          titleAr: "التام",
          description: "Past with present relevance: I have worked here for 5 years",
          descriptionAr: "ماضي له علاقة بالحاضر: عملت هنا لمدة 5 سنوات",
          icon: "check-circle",
        },
      ],
      showNumbers: true,
    },
  },

  // بنية الجملة | Sentence Structure
  {
    id: "english-sentence-structure",
    type: "process",
    title: "Sentence Structure",
    titleAr: "بنية الجملة",
    subject: "English",
    subjectAr: "اللغة الإنجليزية",
    data: {
      steps: [
        {
          step: 1,
          title: "Simple Sentence",
          titleAr: "جملة بسيطة",
          description: "One independent clause: The cat sleeps",
          descriptionAr: "جملة مستقلة واحدة: القطة تنام",
          icon: "minus",
        },
        {
          step: 2,
          title: "Compound Sentence",
          titleAr: "جملة مركبة",
          description: "Two independent clauses joined: The cat sleeps, and the dog barks",
          descriptionAr: "جملتان مستقلتان مرتبطتان: القطة تنام، والكلب ينبح",
          icon: "link",
        },
        {
          step: 3,
          title: "Complex Sentence",
          titleAr: "جملة معقدة",
          description: "Independent + dependent clause: When the cat sleeps, the dog barks",
          descriptionAr: "جملة مستقلة + تابعة: عندما تنام القطة، ينبح الكلب",
          icon: "git-branch",
        },
        {
          step: 4,
          title: "Compound-Complex",
          titleAr: "جملة مركبة معقدة",
          description: "Multiple independent + dependent clauses",
          descriptionAr: "جمل مستقلة متعددة + جمل تابعة",
          icon: "layers",
        },
      ],
      showNumbers: true,
    },
  },

  // أنواع الكتابة | Writing Types
  {
    id: "english-writing-types",
    type: "circle",
    title: "Types of Writing",
    titleAr: "أنواع الكتابة",
    subject: "English",
    subjectAr: "اللغة الإنجليزية",
    data: {
      segments: [
        {
          label: "Narrative",
          labelAr: "السردية",
          value: 25,
          color: "#10B981",
          description: "Tells a story with characters and plot",
          descriptionAr: "تحكي قصة بشخصيات وحبكة",
        },
        {
          label: "Descriptive",
          labelAr: "الوصفية",
          value: 20,
          color: "#3B82F6",
          description: "Paints a picture with words, sensory details",
          descriptionAr: "ترسم صورة بالكلمات، تفاصيل حسية",
        },
        {
          label: "Expository",
          labelAr: "التوضيحية",
          value: 25,
          color: "#F59E0B",
          description: "Explains, informs, presents facts",
          descriptionAr: "تشرح، تُعلم، تقدم حقائق",
        },
        {
          label: "Persuasive",
          labelAr: "الإقناعية",
          value: 20,
          color: "#EF4444",
          description: "Convinces reader to agree with a viewpoint",
          descriptionAr: "تقنع القارئ بوجهة نظر معينة",
        },
        {
          label: "Argumentative",
          labelAr: "الجدلية",
          value: 10,
          color: "#8B5CF6",
          description: "Presents arguments and counterarguments",
          descriptionAr: "تقدم حجج ومضادات الحجج",
        },
      ],
      showPercentage: true,
      centerLabel: "Writing",
      centerLabelAr: "الكتابة",
    },
  },
];

// ==========================================
// التاريخ | History
// ==========================================

const historyInfographics: InfographicData[] = [
  // خط زمني للحضارات | Timeline of Civilizations
  {
    id: "history-civilizations-timeline",
    type: "timeline",
    title: "Timeline of Ancient Civilizations",
    titleAr: "خط زمني للحضارات القديمة",
    subject: "History",
    subjectAr: "التاريخ",
    data: {
      events: [
        {
          year: "3100 BCE",
          yearAr: "3100 ق.م",
          title: "Ancient Egypt",
          titleAr: "الحضارة المصرية القديمة",
          description: "Unification of Upper and Lower Egypt, beginning of pharaonic civilization",
          descriptionAr: "توحيد مصر العليا والسفلى، بداية الحضارة الفرعونية",
          icon: "landmark",
        },
        {
          year: "3000 BCE",
          yearAr: "3000 ق.م",
          title: "Mesopotamia",
          titleAr: "حضارة ما بين النهرين",
          description: "Sumerian civilization, invention of cuneiform writing",
          descriptionAr: "الحضارة السومرية، اختراع الكتابة المسمارية",
          icon: "scroll",
        },
        {
          year: "2600 BCE",
          yearAr: "2600 ق.م",
          title: "Indus Valley",
          titleAr: "حضارة وادي السند",
          description: "Advanced urban planning, sophisticated drainage systems",
          descriptionAr: "تخطيط حضري متقدم، أنظمة صرف متطورة",
          icon: "building",
        },
        {
          year: "2000 BCE",
          yearAr: "2000 ق.م",
          title: "Ancient Greece",
          titleAr: "الحضارة اليونانية",
          description: "Birth of democracy, philosophy, and Olympic games",
          descriptionAr: "مولد الديمقراطية، الفلسفة، والألعاب الأولمبية",
          icon: "columns",
        },
        {
          year: "753 BCE",
          yearAr: "753 ق.م",
          title: "Roman Empire",
          titleAr: "الإمبراطورية الرومانية",
          description: "Foundation of Rome, vast empire across Europe",
          descriptionAr: "تأسيس روما، إمبراطورية عظيمة عبر أوروبا",
          icon: "castle",
        },
      ],
      showYear: true,
    },
  },
];

// ==========================================
// التصدير الرئيسي | Main Export
// ==========================================

export const INFOGRAPHICS: InfographicData[] = [
  ...physicsInfographics,
  ...chemistryInfographics,
  ...biologyInfographics,
  ...mathematicsInfographics,
  ...geographyInfographics,
  ...arabicInfographics,
  ...englishInfographics,
  ...historyInfographics,
];

// تصدير حسب المادة | Export by Subject
export const INFOGRAPHICS_BY_SUBJECT: Record<string, InfographicData[]> = {
  physics: physicsInfographics,
  chemistry: chemistryInfographics,
  biology: biologyInfographics,
  mathematics: mathematicsInfographics,
  geography: geographyInfographics,
  arabic: arabicInfographics,
  english: englishInfographics,
  history: historyInfographics,
};

// دالة للحصول على إنفوجرافيك بالمعرف | Get Infographic by ID
export function getInfographicById(id: string): InfographicData | undefined {
  return INFOGRAPHICS.find((infographic) => infographic.id === id);
}

// دالة للحصول على إنفوجرافيك حسب المادة | Get Infographics by Subject
export function getInfographicsBySubject(subject: string): InfographicData[] {
  return INFOGRAPHICS.filter(
    (infographic) =>
      infographic.subject.toLowerCase() === subject.toLowerCase() ||
      infographic.subjectAr === subject
  );
}

// إحصائيات | Statistics
export const INFOGRAPHICS_STATS = {
  total: INFOGRAPHICS.length,
  bySubject: {
    physics: physicsInfographics.length,
    chemistry: chemistryInfographics.length,
    biology: biologyInfographics.length,
    mathematics: mathematicsInfographics.length,
    geography: geographyInfographics.length,
    arabic: arabicInfographics.length,
    english: englishInfographics.length,
    history: historyInfographics.length,
  },
  byType: {
    comparison: INFOGRAPHICS.filter((i) => i.type === "comparison").length,
    process: INFOGRAPHICS.filter((i) => i.type === "process").length,
    circle: INFOGRAPHICS.filter((i) => i.type === "circle").length,
    timeline: INFOGRAPHICS.filter((i) => i.type === "timeline").length,
  },
};
