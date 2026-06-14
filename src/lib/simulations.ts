// التعريف بأنواع المحاكيات
export interface Simulation {
  id: string;
  lessonId: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: 'physics' | 'chemistry' | 'math' | 'biology' | 'interactive';
  category: 'experiment' | 'calculator' | 'visualization' | 'game';
  thumbnail: string;
  isFree: boolean;
}

// قائمة المحاكيات التعليمية مرتبطة بالدروس
export const simulations: Simulation[] = [
  // محاكيات الفيزياء
  {
    id: 'sim-physics-1',
    lessonId: 'id_physics_motion_1',
    titleAr: 'محاكاة الحركة المنتظمة',
    titleEn: 'Uniform Motion Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الحركة المنتظمة والعلاقة بين المسافة والزمن والسرعة',
    descriptionEn: 'Interactive experiment to understand uniform motion and the relationship between distance, time, and speed',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/motion.png',
    isFree: true
  },
  {
    id: 'sim-physics-2',
    lessonId: 'id_physics_forces_1',
    titleAr: 'محاكاة قوانين نيوتن',
    titleEn: "Newton's Laws Simulation",
    descriptionAr: 'تجربة تفاعلية لفهم قوانين نيوتن الثلاثة وتطبيقاتها',
    descriptionEn: 'Interactive experiment to understand Newton\'s three laws and their applications',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/newton.png',
    isFree: true
  },
  {
    id: 'sim-physics-3',
    lessonId: 'id_physics_energy_1',
    titleAr: 'محاكاة تحولات الطاقة',
    titleEn: 'Energy Transformations Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تحولات الطاقة وحفظ الطاقة',
    descriptionEn: 'Interactive experiment to understand energy transformations and conservation',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/energy.png',
    isFree: false
  },
  {
    id: 'sim-physics-4',
    lessonId: 'id_physics_waves_1',
    titleAr: 'محاكاة الموجات',
    titleEn: 'Waves Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص الموجات وأنواعها',
    descriptionEn: 'Interactive experiment to understand wave properties and types',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/waves.png',
    isFree: true
  },
  {
    id: 'sim-physics-5',
    lessonId: 'id_physics_electricity_1',
    titleAr: 'محاكاة الدوائر الكهربائية',
    titleEn: 'Electric Circuits Simulation',
    descriptionAr: 'تجربة تفاعلية لبناء وفحص الدوائر الكهربائية',
    descriptionEn: 'Interactive experiment to build and test electric circuits',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/circuits.png',
    isFree: true
  },
  {
    id: 'sim-physics-6',
    lessonId: 'id_physics_optics_1',
    titleAr: 'محاكاة الضوء والمرايا',
    titleEn: 'Light and Mirrors Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم انعكاس وانكسار الضوء',
    descriptionEn: 'Interactive experiment to understand light reflection and refraction',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/optics.png',
    isFree: false
  },

  // محاكيات الكيمياء
  {
    id: 'sim-chem-1',
    lessonId: 'id_chem_atoms_1',
    titleAr: 'محاكاة البناء الذري',
    titleEn: 'Atomic Structure Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تركيب الذرة والجسيمات دون الذرية',
    descriptionEn: 'Interactive experiment to understand atomic structure and subatomic particles',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/atom.png',
    isFree: true
  },
  {
    id: 'sim-chem-2',
    lessonId: 'id_chem_periodic_1',
    titleAr: 'الجدول الدوري التفاعلي',
    titleEn: 'Interactive Periodic Table',
    descriptionAr: 'استكشف الجدول الدوري وتعرف على خصائص العناصر',
    descriptionEn: 'Explore the periodic table and learn about element properties',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/periodic.png',
    isFree: true
  },
  {
    id: 'sim-chem-3',
    lessonId: 'id_chem_bonds_1',
    titleAr: 'محاكاة الروابط الكيميائية',
    titleEn: 'Chemical Bonds Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم أنواع الروابط الكيميائية',
    descriptionEn: 'Interactive experiment to understand types of chemical bonds',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/bonds.png',
    isFree: false
  },
  {
    id: 'sim-chem-4',
    lessonId: 'id_chem_reactions_1',
    titleAr: 'محاكاة التفاعلات الكيميائية',
    titleEn: 'Chemical Reactions Simulation',
    descriptionAr: 'تجربة تفاعلية لموازنة المعادلات الكيميائية',
    descriptionEn: 'Interactive experiment to balance chemical equations',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/reactions.png',
    isFree: true
  },
  {
    id: 'sim-chem-5',
    lessonId: 'id_chem_solutions_1',
    titleAr: 'محاكاة المحاليل',
    titleEn: 'Solutions Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تركيز المحاليل والتخفيف',
    descriptionEn: 'Interactive experiment to understand solution concentration and dilution',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/solutions.png',
    isFree: true
  },

  // محاكيات الرياضيات
  {
    id: 'sim-math-1',
    lessonId: 'id_math_functions_1',
    titleAr: 'راسم الدوال البياني',
    titleEn: 'Function Graph Plotter',
    descriptionAr: 'أداة تفاعلية لرسم وتحليل الدوال الرياضية',
    descriptionEn: 'Interactive tool to plot and analyze mathematical functions',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/graphs.png',
    isFree: true
  },
  {
    id: 'sim-math-2',
    lessonId: 'id_math_equations_1',
    titleAr: 'حل المعادلات التفاعلي',
    titleEn: 'Interactive Equation Solver',
    descriptionAr: 'أداة لحل المعادلات الخطية والتربيعية خطوة بخطوة',
    descriptionEn: 'Tool to solve linear and quadratic equations step by step',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/equations.png',
    isFree: true
  },
  {
    id: 'sim-math-3',
    lessonId: 'id_math_geometry_1',
    titleAr: 'محاكاة الهندسة',
    titleEn: 'Geometry Simulation',
    descriptionAr: 'أداة تفاعلية لإنشاء وتحليل الأشكال الهندسية',
    descriptionEn: 'Interactive tool to create and analyze geometric shapes',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/geometry.png',
    isFree: true
  },
  {
    id: 'sim-math-4',
    lessonId: 'id_math_trig_1',
    titleAr: 'دائرة الوحدة التفاعلية',
    titleEn: 'Interactive Unit Circle',
    descriptionAr: 'أداة تفاعلية لفهم الدوال المثلثية ودائرة الوحدة',
    descriptionEn: 'Interactive tool to understand trigonometric functions and the unit circle',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/unitcircle.png',
    isFree: false
  },
  {
    id: 'sim-math-5',
    lessonId: 'id_math_calculus_1',
    titleAr: 'محاكاة الاشتقاق والتكامل',
    titleEn: 'Differentiation and Integration Simulation',
    descriptionAr: 'أداة تفاعلية لفهم مفاهيم الاشتقاق والتكامل',
    descriptionEn: 'Interactive tool to understand differentiation and integration concepts',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/calculus.png',
    isFree: true
  },

  // محاكيات الأحياء
  {
    id: 'sim-bio-1',
    lessonId: 'id_bio_cells_1',
    titleAr: 'محاكاة الخلية',
    titleEn: 'Cell Simulation',
    descriptionAr: 'تجربة تفاعلية لاستكشاف مكونات الخلية ووظائفها',
    descriptionEn: 'Interactive experiment to explore cell components and functions',
    type: 'biology',
    category: 'visualization',
    thumbnail: '/simulations/cell.png',
    isFree: true
  },
  {
    id: 'sim-bio-2',
    lessonId: 'id_bio_dna_1',
    titleAr: 'محاكاة DNA',
    titleEn: 'DNA Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تركيب ووظيفة DNA',
    descriptionEn: 'Interactive experiment to understand DNA structure and function',
    type: 'biology',
    category: 'visualization',
    thumbnail: '/simulations/dna.png',
    isFree: true
  },
  {
    id: 'sim-bio-3',
    lessonId: 'id_bio_genetics_1',
    titleAr: 'محاكاة الوراثة',
    titleEn: 'Genetics Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قوانين الوراثة والمندل',
    descriptionEn: 'Interactive experiment to understand genetics and Mendel\'s laws',
    type: 'biology',
    category: 'experiment',
    thumbnail: '/simulations/genetics.png',
    isFree: false
  },
  {
    id: 'sim-bio-4',
    lessonId: 'id_bio_ecology_1',
    titleAr: 'محاكاة النظام البيئي',
    titleEn: 'Ecosystem Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم التوازن في النظام البيئي',
    descriptionEn: 'Interactive experiment to understand ecosystem balance',
    type: 'biology',
    category: 'visualization',
    thumbnail: '/simulations/ecosystem.png',
    isFree: true
  },

  // محاكيات عامة
  {
    id: 'sim-calc-scientific',
    lessonId: 'any',
    titleAr: 'الآلة الحاسبة العلمية',
    titleEn: 'Scientific Calculator',
    descriptionAr: 'آلة حاسبة علمية متقدمة لجميع العمليات الرياضية',
    descriptionEn: 'Advanced scientific calculator for all mathematical operations',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/calculator.png',
    isFree: true
  },
  {
    id: 'sim-unit-converter',
    lessonId: 'any',
    titleAr: 'محول الوحدات',
    titleEn: 'Unit Converter',
    descriptionAr: 'أداة لتحويل الوحدات المختلفة (طول، كتلة، درجة حرارة...)',
    descriptionEn: 'Tool to convert various units (length, mass, temperature...)',
    type: 'interactive',
    category: 'calculator',
    thumbnail: '/simulations/converter.png',
    isFree: true
  }
];

// دالة للحصول على المحاكيات المرتبطة بدرس معين
export function getSimulationsByLessonId(lessonId: string): Simulation[] {
  // البحث عن المحاكيات المرتبطة بالدرس أو المحاكيات العامة
  return simulations.filter(
    sim => sim.lessonId === lessonId || sim.lessonId === 'any'
  );
}

// دالة للحصول على المحاكيات حسب المادة
export function getSimulationsBySubject(subjectName: string): Simulation[] {
  const typeMap: Record<string, string[]> = {
    'الفيزياء': ['physics'],
    'Physics': ['physics'],
    'الكيمياء': ['chemistry'],
    'Chemistry': ['chemistry'],
    'الرياضيات': ['math'],
    'Mathematics': ['math'],
    'الرياضيات (1)': ['math'],
    'الرياضيات (2)': ['math'],
    'الأحياء': ['biology'],
    'Biology': ['biology']
  };

  const types = typeMap[subjectName] || [];
  return simulations.filter(sim => types.includes(sim.type));
}

// دالة للحصول على جميع المحاكيات المجانية
export function getFreeSimulations(): Simulation[] {
  return simulations.filter(sim => sim.isFree);
}
