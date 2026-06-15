// الخرائط الذهنية التعليمية - 23 خريطة
export interface MindMapNode {
  id: string;
  textAr: string;
  textEn: string;
  children?: MindMapNode[];
  color?: string;
}

export interface MindMap {
  id: string;
  lessonId: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  subject: 'physics' | 'chemistry' | 'math' | 'biology';
  rootNode: MindMapNode;
}

export const mindmaps: MindMap[] = [
  // ==========================================
  // خرائط الفيزياء (7 خرائط)
  // ==========================================
  {
    id: 'mindmap-physics-motion',
    lessonId: 'motion-intro',
    titleAr: 'خريطة الحركة',
    titleEn: 'Motion Mind Map',
    descriptionAr: 'خريطة ذهنية شاملة لمفاهيم الحركة والسرعة والتسارع',
    descriptionEn: 'Comprehensive mind map for motion, velocity, and acceleration concepts',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'الحركة',
      textEn: 'Motion',
      color: '#3b82f6',
      children: [
        {
          id: 'types',
          textAr: 'أنواع الحركة',
          textEn: 'Types of Motion',
          color: '#60a5fa',
          children: [
            { id: 'uniform', textAr: 'حركة منتظمة', textEn: 'Uniform Motion' },
            { id: 'accelerated', textAr: 'حركة متسارعة', textEn: 'Accelerated Motion' },
            { id: 'circular', textAr: 'حركة دائرية', textEn: 'Circular Motion' },
            { id: 'projectile', textAr: 'حركة مقذوفات', textEn: 'Projectile Motion' }
          ]
        },
        {
          id: 'quantities',
          textAr: 'الكميات الحركية',
          textEn: 'Kinematic Quantities',
          color: '#f59e0b',
          children: [
            { id: 'displacement', textAr: 'الإزاحة (Δx)', textEn: 'Displacement (Δx)' },
            { id: 'velocity', textAr: 'السرعة (v)', textEn: 'Velocity (v)' },
            { id: 'acceleration', textAr: 'التسارع (a)', textEn: 'Acceleration (a)' },
            { id: 'time', textAr: 'الزمن (t)', textEn: 'Time (t)' }
          ]
        },
        {
          id: 'equations',
          textAr: 'معادلات الحركة',
          textEn: 'Equations of Motion',
          color: '#10b981',
          children: [
            { id: 'eq1', textAr: 'v = v₀ + at', textEn: 'v = v₀ + at' },
            { id: 'eq2', textAr: 'x = x₀ + v₀t + ½at²', textEn: 'x = x₀ + v₀t + ½at²' },
            { id: 'eq3', textAr: 'v² = v₀² + 2aΔx', textEn: 'v² = v₀² + 2aΔx' },
            { id: 'eq4', textAr: 'Δx = ½(v + v₀)t', textEn: 'Δx = ½(v + v₀)t' }
          ]
        },
        {
          id: 'graphs',
          textAr: 'الرسوم البيانية',
          textEn: 'Graphs',
          color: '#ef4444',
          children: [
            { id: 'xt', textAr: 'موضع-زمن', textEn: 'Position-Time' },
            { id: 'vt', textAr: 'سرعة-زمن', textEn: 'Velocity-Time' },
            { id: 'at', textAr: 'تسارع-زمن', textEn: 'Acceleration-Time' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-physics-forces',
    lessonId: 'forces-intro',
    titleAr: 'خريطة القوى',
    titleEn: 'Forces Mind Map',
    descriptionAr: 'خريطة ذهنية لأنواع القوى وقوانين نيوتن',
    descriptionEn: 'Mind map for force types and Newton\'s laws',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'القوى',
      textEn: 'Forces',
      color: '#8b5cf6',
      children: [
        {
          id: 'newton',
          textAr: 'قوانين نيوتن',
          textEn: "Newton's Laws",
          color: '#a78bfa',
          children: [
            { id: 'law1', textAr: 'القصور الذاتي', textEn: 'Inertia' },
            { id: 'law2', textAr: 'F = ma', textEn: 'F = ma' },
            { id: 'law3', textAr: 'الفعل ورد الفعل', textEn: 'Action-Reaction' }
          ]
        },
        {
          id: 'types',
          textAr: 'أنواع القوى',
          textEn: 'Force Types',
          color: '#f472b6',
          children: [
            { id: 'gravity', textAr: 'الجاذبية', textEn: 'Gravity' },
            { id: 'normal', textAr: 'القوة العمودية', textEn: 'Normal Force' },
            { id: 'friction', textAr: 'الاحتكاك', textEn: 'Friction' },
            { id: 'tension', textAr: 'الشد', textEn: 'Tension' }
          ]
        },
        {
          id: 'friction-types',
          textAr: 'أنواع الاحتكاك',
          textEn: 'Friction Types',
          color: '#fb923c',
          children: [
            { id: 'static', textAr: 'احتكاك سكوني', textEn: 'Static Friction' },
            { id: 'kinetic', textAr: 'احتكاك حركي', textEn: 'Kinetic Friction' },
            { id: 'rolling', textAr: 'احتكاك تدحرجي', textEn: 'Rolling Friction' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-physics-energy',
    lessonId: 'energy-intro',
    titleAr: 'خريطة الطاقة',
    titleEn: 'Energy Mind Map',
    descriptionAr: 'خريطة ذهنية لأنواع الطاقة وتحولاتها',
    descriptionEn: 'Mind map for energy types and transformations',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'الطاقة',
      textEn: 'Energy',
      color: '#eab308',
      children: [
        {
          id: 'types',
          textAr: 'أنواع الطاقة',
          textEn: 'Energy Types',
          color: '#fde047',
          children: [
            { id: 'kinetic', textAr: 'طاقة حركية (KE = ½mv²)', textEn: 'Kinetic Energy (KE = ½mv²)' },
            { id: 'potential', textAr: 'طاقة كامنة', textEn: 'Potential Energy' },
            { id: 'thermal', textAr: 'طاقة حرارية', textEn: 'Thermal Energy' },
            { id: 'electrical', textAr: 'طاقة كهربائية', textEn: 'Electrical Energy' }
          ]
        },
        {
          id: 'potential-types',
          textAr: 'الطاقة الكامنة',
          textEn: 'Potential Energy',
          color: '#4ade80',
          children: [
            { id: 'gravitational', textAr: 'جاذبية (PE = mgh)', textEn: 'Gravitational (PE = mgh)' },
            { id: 'elastic', textAr: 'مرنة (PE = ½kx²)', textEn: 'Elastic (PE = ½kx²)' }
          ]
        },
        {
          id: 'conservation',
          textAr: 'حفظ الطاقة',
          textEn: 'Energy Conservation',
          color: '#22c55e',
          children: [
            { id: 'mechanical', textAr: 'E = KE + PE', textEn: 'E = KE + PE' },
            { id: 'total', textAr: 'الطاقة الكلية ثابتة', textEn: 'Total Energy is Constant' }
          ]
        },
        {
          id: 'work',
          textAr: 'الشغل',
          textEn: 'Work',
          color: '#0ea5e9',
          children: [
            { id: 'formula', textAr: 'W = F·d·cosθ', textEn: 'W = F·d·cosθ' },
            { id: 'power', textAr: 'القدرة P = W/t', textEn: 'Power P = W/t' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-physics-waves',
    lessonId: 'wave-properties',
    titleAr: 'خريطة الموجات',
    titleEn: 'Waves Mind Map',
    descriptionAr: 'خريطة ذهنية لخصائص الموجات وأنواعها',
    descriptionEn: 'Mind map for wave properties and types',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'الموجات',
      textEn: 'Waves',
      color: '#06b6d4',
      children: [
        {
          id: 'types',
          textAr: 'أنواع الموجات',
          textEn: 'Wave Types',
          color: '#22d3ee',
          children: [
            { id: 'transverse', textAr: 'مستعرضة', textEn: 'Transverse' },
            { id: 'longitudinal', textAr: 'طولية', textEn: 'Longitudinal' },
            { id: 'mechanical', textAr: 'ميكانيكية', textEn: 'Mechanical' },
            { id: 'electromagnetic', textAr: 'كهرومغناطيسية', textEn: 'Electromagnetic' }
          ]
        },
        {
          id: 'properties',
          textAr: 'خصائص الموجة',
          textEn: 'Wave Properties',
          color: '#a78bfa',
          children: [
            { id: 'wavelength', textAr: 'الطول الموجي (λ)', textEn: 'Wavelength (λ)' },
            { id: 'frequency', textAr: 'التردد (f)', textEn: 'Frequency (f)' },
            { id: 'amplitude', textAr: 'السعة (A)', textEn: 'Amplitude (A)' },
            { id: 'period', textAr: 'الدور (T)', textEn: 'Period (T)' }
          ]
        },
        {
          id: 'equations',
          textAr: 'المعادلات',
          textEn: 'Equations',
          color: '#f472b6',
          children: [
            { id: 'speed', textAr: 'v = fλ', textEn: 'v = fλ' },
            { id: 'period', textAr: 'T = 1/f', textEn: 'T = 1/f' },
            { id: 'energy', textAr: 'E ∝ A²', textEn: 'E ∝ A²' }
          ]
        },
        {
          id: 'phenomena',
          textAr: 'ظواهر موجية',
          textEn: 'Wave Phenomena',
          color: '#fb923c',
          children: [
            { id: 'reflection', textAr: 'الانعكاس', textEn: 'Reflection' },
            { id: 'refraction', textAr: 'الانكسار', textEn: 'Refraction' },
            { id: 'interference', textAr: 'التداخل', textEn: 'Interference' },
            { id: 'diffraction', textAr: 'الحيود', textEn: 'Diffraction' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-physics-electricity',
    lessonId: 'electric-current',
    titleAr: 'خريطة الكهرباء',
    titleEn: 'Electricity Mind Map',
    descriptionAr: 'خريطة ذهنية للتيار الكهربائي والدوائر',
    descriptionEn: 'Mind map for electric current and circuits',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'الكهرباء',
      textEn: 'Electricity',
      color: '#f59e0b',
      children: [
        {
          id: 'current',
          textAr: 'التيار الكهربائي',
          textEn: 'Electric Current',
          color: '#fbbf24',
          children: [
            { id: 'definition', textAr: 'I = Q/t', textEn: 'I = Q/t' },
            { id: 'unit', textAr: 'الأمبير (A)', textEn: 'Ampere (A)' },
            { id: 'direction', textAr: 'اتجاه التيار', textEn: 'Current Direction' }
          ]
        },
        {
          id: 'voltage',
          textAr: 'الجهد الكهربائي',
          textEn: 'Voltage',
          color: '#ef4444',
          children: [
            { id: 'v-def', textAr: 'V = W/Q', textEn: 'V = W/Q' },
            { id: 'v-unit', textAr: 'الفولت (V)', textEn: 'Volt (V)' }
          ]
        },
        {
          id: 'resistance',
          textAr: 'المقاومة',
          textEn: 'Resistance',
          color: '#8b5cf6',
          children: [
            { id: 'ohm', textAr: 'قانون أوم: V = IR', textEn: "Ohm's Law: V = IR" },
            { id: 'r-factors', textAr: 'العوامل المؤثرة', textEn: 'Affecting Factors' },
            { id: 'r-unit', textAr: 'الأوم (Ω)', textEn: 'Ohm (Ω)' }
          ]
        },
        {
          id: 'circuits',
          textAr: 'الدوائر',
          textEn: 'Circuits',
          color: '#10b981',
          children: [
            { id: 'series', textAr: 'توالي', textEn: 'Series' },
            { id: 'parallel', textAr: 'توازي', textEn: 'Parallel' },
            { id: 'power', textAr: 'P = VI = I²R', textEn: 'P = VI = I²R' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-physics-magnetism',
    lessonId: 'magnetism-intro',
    titleAr: 'خريطة المغناطيسية',
    titleEn: 'Magnetism Mind Map',
    descriptionAr: 'خريطة ذهنية للمغناطيسية والحث الكهرومغناطيسي',
    descriptionEn: 'Mind map for magnetism and electromagnetic induction',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'المغناطيسية',
      textEn: 'Magnetism',
      color: '#dc2626',
      children: [
        {
          id: 'magnets',
          textAr: 'المغناطيسات',
          textEn: 'Magnets',
          color: '#f87171',
          children: [
            { id: 'poles', textAr: 'القطبان الشمالي والجنوبي', textEn: 'North and South Poles' },
            { id: 'field', textAr: 'المجال المغناطيسي', textEn: 'Magnetic Field' },
            { id: 'lines', textAr: 'خطوط المجال', textEn: 'Field Lines' }
          ]
        },
        {
          id: 'electromagnetism',
          textAr: 'الكهرومغناطيسية',
          textEn: 'Electromagnetism',
          color: '#3b82f6',
          children: [
            { id: 'current-field', textAr: 'تيار ← مجال', textEn: 'Current → Field' },
            { id: 'solenoid', textAr: 'الملف اللولبي', textEn: 'Solenoid' },
            { id: 'electromagnet', textAr: 'المغناطيس الكهربائي', textEn: 'Electromagnet' }
          ]
        },
        {
          id: 'induction',
          textAr: 'الحث',
          textEn: 'Induction',
          color: '#22c55e',
          children: [
            { id: 'faraday', textAr: 'قانون فاراداي', textEn: "Faraday's Law" },
            { id: 'lenz', textAr: 'قانون لينز', textEn: "Lenz's Law" },
            { id: 'emf', textAr: 'القوة الدافعة الكهربائية', textEn: 'EMF' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-physics-optics',
    lessonId: 'light-waves',
    titleAr: 'خريطة الضوء والبصريات',
    titleEn: 'Light and Optics Mind Map',
    descriptionAr: 'خريطة ذهنية للضوء والمرايا والعدسات',
    descriptionEn: 'Mind map for light, mirrors, and lenses',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'الضوء والبصريات',
      textEn: 'Light and Optics',
      color: '#8b5cf6',
      children: [
        {
          id: 'reflection',
          textAr: 'الانعكاس',
          textEn: 'Reflection',
          color: '#a78bfa',
          children: [
            { id: 'law', textAr: 'زاوية السقوط = زاوية الانعكاس', textEn: 'Angle of incidence = Angle of reflection' },
            { id: 'mirrors', textAr: 'المرايا', textEn: 'Mirrors' }
          ]
        },
        {
          id: 'refraction',
          textAr: 'الانكسار',
          textEn: 'Refraction',
          color: '#06b6d4',
          children: [
            { id: 'snell', textAr: 'قانون سنيل', textEn: "Snell's Law" },
            { id: 'index', textAr: 'معامل الانكسار n', textEn: 'Refractive Index n' },
            { id: 'critical', textAr: 'الزاوية الحرجة', textEn: 'Critical Angle' }
          ]
        },
        {
          id: 'lenses',
          textAr: 'العدسات',
          textEn: 'Lenses',
          color: '#f59e0b',
          children: [
            { id: 'convex', textAr: 'محدبة', textEn: 'Convex' },
            { id: 'concave', textAr: 'مقعرة', textEn: 'Concave' },
            { id: 'focus', textAr: 'البعد البؤري f', textEn: 'Focal Length f' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // خرائط الكيمياء (6 خرائط)
  // ==========================================
  {
    id: 'mindmap-chemistry-atom',
    lessonId: 'atom-components',
    titleAr: 'خريطة البناء الذري',
    titleEn: 'Atomic Structure Mind Map',
    descriptionAr: 'خريطة ذهنية لتركيب الذرة والجسيمات',
    descriptionEn: 'Mind map for atomic structure and particles',
    subject: 'chemistry',
    rootNode: {
      id: 'root',
      textAr: 'الذرة',
      textEn: 'Atom',
      color: '#ec4899',
      children: [
        {
          id: 'particles',
          textAr: 'الجسيمات',
          textEn: 'Particles',
          color: '#f472b6',
          children: [
            { id: 'proton', textAr: 'بروتون (+1)', textEn: 'Proton (+1)' },
            { id: 'neutron', textAr: 'نيوترون (0)', textEn: 'Neutron (0)' },
            { id: 'electron', textAr: 'إلكترون (-1)', textEn: 'Electron (-1)' }
          ]
        },
        {
          id: 'nucleus',
          textAr: 'النواة',
          textEn: 'Nucleus',
          color: '#a855f7',
          children: [
            { id: 'protons', textAr: 'البروتونات', textEn: 'Protons' },
            { id: 'neutrons', textAr: 'النيوترونات', textEn: 'Neutrons' },
            { id: 'mass', textAr: 'الكتلة الذرية', textEn: 'Atomic Mass' }
          ]
        },
        {
          id: 'electrons',
          textAr: 'الإلكترونات',
          textEn: 'Electrons',
          color: '#3b82f6',
          children: [
            { id: 'shells', textAr: 'مستويات الطاقة', textEn: 'Energy Levels' },
            { id: 'orbitals', textAr: 'الأفلاك (s, p, d, f)', textEn: 'Orbitals (s, p, d, f)' },
            { id: 'config', textAr: 'التوزيع الإلكتروني', textEn: 'Electron Configuration' }
          ]
        },
        {
          id: 'numbers',
          textAr: 'الأعداد الذرية',
          textEn: 'Atomic Numbers',
          color: '#22c55e',
          children: [
            { id: 'z', textAr: 'العدد الذري Z', textEn: 'Atomic Number Z' },
            { id: 'a', textAr: 'العدد الكتلي A', textEn: 'Mass Number A' },
            { id: 'isotopes', textAr: 'النظائر', textEn: 'Isotopes' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-chemistry-periodic',
    lessonId: 'periodic-table',
    titleAr: 'خريطة الجدول الدوري',
    titleEn: 'Periodic Table Mind Map',
    descriptionAr: 'خريطة ذهنية للجدول الدوري والعناصر',
    descriptionEn: 'Mind map for periodic table and elements',
    subject: 'chemistry',
    rootNode: {
      id: 'root',
      textAr: 'الجدول الدوري',
      textEn: 'Periodic Table',
      color: '#06b6d4',
      children: [
        {
          id: 'structure',
          textAr: 'البنية',
          textEn: 'Structure',
          color: '#22d3ee',
          children: [
            { id: 'periods', textAr: '7 دورات', textEn: '7 Periods' },
            { id: 'groups', textAr: '18 مجموعة', textEn: '18 Groups' }
          ]
        },
        {
          id: 'blocks',
          textAr: 'الكتل',
          textEn: 'Blocks',
          color: '#a78bfa',
          children: [
            { id: 's-block', textAr: 'كتلة s', textEn: 's-block' },
            { id: 'p-block', textAr: 'كتلة p', textEn: 'p-block' },
            { id: 'd-block', textAr: 'كتلة d', textEn: 'd-block' },
            { id: 'f-block', textAr: 'كتلة f', textEn: 'f-block' }
          ]
        },
        {
          id: 'trends',
          textAr: 'الاتجاهات الدورية',
          textEn: 'Periodic Trends',
          color: '#f472b6',
          children: [
            { id: 'radius', textAr: 'نصف القطر الذري', textEn: 'Atomic Radius' },
            { id: 'ionization', textAr: 'طاقة التأين', textEn: 'Ionization Energy' },
            { id: 'electronegativity', textAr: 'السالبية الكهربائية', textEn: 'Electronegativity' }
          ]
        },
        {
          id: 'groups-names',
          textAr: 'أسماء المجموعات',
          textEn: 'Group Names',
          color: '#fbbf24',
          children: [
            { id: 'alkali', textAr: 'فلزات قلوية', textEn: 'Alkali Metals' },
            { id: 'halogens', textAr: 'الهالوجينات', textEn: 'Halogens' },
            { id: 'noble', textAr: 'الغازات النبيلة', textEn: 'Noble Gases' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-chemistry-bonds',
    lessonId: 'ionic-bonding',
    titleAr: 'خريطة الروابط الكيميائية',
    titleEn: 'Chemical Bonds Mind Map',
    descriptionAr: 'خريطة ذهنية لأنواع الروابط الكيميائية',
    descriptionEn: 'Mind map for types of chemical bonds',
    subject: 'chemistry',
    rootNode: {
      id: 'root',
      textAr: 'الروابط الكيميائية',
      textEn: 'Chemical Bonds',
      color: '#f59e0b',
      children: [
        {
          id: 'ionic',
          textAr: 'رابطة أيونية',
          textEn: 'Ionic Bond',
          color: '#fbbf24',
          children: [
            { id: 'transfer', textAr: 'انتقال إلكترونات', textEn: 'Electron Transfer' },
            { id: 'cation-anion', textAr: 'كاتيون + أنيون', textEn: 'Cation + Anion' },
            { id: 'example', textAr: 'NaCl', textEn: 'NaCl' }
          ]
        },
        {
          id: 'covalent',
          textAr: 'رابطة تساهمية',
          textEn: 'Covalent Bond',
          color: '#22c55e',
          children: [
            { id: 'sharing', textAr: 'مشاركة إلكترونات', textEn: 'Electron Sharing' },
            { id: 'polar', textAr: 'قطبية', textEn: 'Polar' },
            { id: 'nonpolar', textAr: 'غير قطبية', textEn: 'Non-polar' }
          ]
        },
        {
          id: 'metallic',
          textAr: 'رابطة فلزية',
          textEn: 'Metallic Bond',
          color: '#8b5cf6',
          children: [
            { id: 'sea', textAr: 'بحر الإلكترونات', textEn: 'Electron Sea' },
            { id: 'conductivity', textAr: 'التوصيل الكهربي', textEn: 'Electrical Conductivity' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-chemistry-reactions',
    lessonId: 'types-of-reactions',
    titleAr: 'خريطة التفاعلات الكيميائية',
    titleEn: 'Chemical Reactions Mind Map',
    descriptionAr: 'خريطة ذهنية لأنواع التفاعلات الكيميائية',
    descriptionEn: 'Mind map for types of chemical reactions',
    subject: 'chemistry',
    rootNode: {
      id: 'root',
      textAr: 'التفاعلات الكيميائية',
      textEn: 'Chemical Reactions',
      color: '#ef4444',
      children: [
        {
          id: 'types',
          textAr: 'أنواع التفاعلات',
          textEn: 'Reaction Types',
          color: '#f87171',
          children: [
            { id: 'synthesis', textAr: 'اتحاد: A + B → AB', textEn: 'Synthesis: A + B → AB' },
            { id: 'decomposition', textAr: 'تحلل: AB → A + B', textEn: 'Decomposition: AB → A + B' },
            { id: 'single', textAr: 'إحلال فردي', textEn: 'Single Replacement' },
            { id: 'double', textAr: 'إحلال مزدوج', textEn: 'Double Replacement' }
          ]
        },
        {
          id: 'balancing',
          textAr: 'موازنة المعادلات',
          textEn: 'Balancing Equations',
          color: '#fbbf24',
          children: [
            { id: 'law', textAr: 'قانون حفظ الكتلة', textEn: 'Law of Conservation of Mass' },
            { id: 'coefficients', textAr: 'المعاملات', textEn: 'Coefficients' }
          ]
        },
        {
          id: 'rate',
          textAr: 'سرعة التفاعل',
          textEn: 'Reaction Rate',
          color: '#a855f7',
          children: [
            { id: 'factors', textAr: 'العوامل المؤثرة', textEn: 'Affecting Factors' },
            { id: 'catalyst', textAr: 'المحفزات', textEn: 'Catalysts' },
            { id: 'activation', textAr: 'طاقة التنشيط', textEn: 'Activation Energy' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-chemistry-equilibrium',
    lessonId: 'chemical-equilibrium',
    titleAr: 'خريطة التوازن الكيميائي',
    titleEn: 'Chemical Equilibrium Mind Map',
    descriptionAr: 'خريطة ذهنية للتوازن الكيميائي',
    descriptionEn: 'Mind map for chemical equilibrium',
    subject: 'chemistry',
    rootNode: {
      id: 'root',
      textAr: 'التوازن الكيميائي',
      textEn: 'Chemical Equilibrium',
      color: '#8b5cf6',
      children: [
        {
          id: 'definition',
          textAr: 'التعريف',
          textEn: 'Definition',
          color: '#a78bfa',
          children: [
            { id: 'dynamic', textAr: 'توازن ديناميكي', textEn: 'Dynamic Equilibrium' },
            { id: 'rates', textAr: 'معدل أمامي = معدل عكسي', textEn: 'Forward rate = Reverse rate' }
          ]
        },
        {
          id: 'constant',
          textAr: 'ثابت التوازن',
          textEn: 'Equilibrium Constant',
          color: '#22c55e',
          children: [
            { id: 'kc', textAr: 'Kc', textEn: 'Kc' },
            { id: 'kp', textAr: 'Kp', textEn: 'Kp' },
            { id: 'expression', textAr: 'قانون الكتلة', textEn: 'Mass Action Law' }
          ]
        },
        {
          id: 'lechatelier',
          textAr: 'مبدأ لوشاتيليه',
          textEn: "Le Chatelier's Principle",
          color: '#f59e0b',
          children: [
            { id: 'concentration', textAr: 'تأثير التركيز', textEn: 'Concentration Effect' },
            { id: 'temperature', textAr: 'تأثير الحرارة', textEn: 'Temperature Effect' },
            { id: 'pressure', textAr: 'تأثير الضغط', textEn: 'Pressure Effect' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-chemistry-solutions',
    lessonId: 'types-of-reactions',
    titleAr: 'خريطة المحاليل',
    titleEn: 'Solutions Mind Map',
    descriptionAr: 'خريطة ذهنية للمحاليل والتركيز',
    descriptionEn: 'Mind map for solutions and concentration',
    subject: 'chemistry',
    rootNode: {
      id: 'root',
      textAr: 'المحاليل',
      textEn: 'Solutions',
      color: '#0ea5e9',
      children: [
        {
          id: 'components',
          textAr: 'المكونات',
          textEn: 'Components',
          color: '#38bdf8',
          children: [
            { id: 'solute', textAr: 'المذاب', textEn: 'Solute' },
            { id: 'solvent', textAr: 'المذيب', textEn: 'Solvent' }
          ]
        },
        {
          id: 'concentration',
          textAr: 'التركيز',
          textEn: 'Concentration',
          color: '#22c55e',
          children: [
            { id: 'molarity', textAr: 'المولارية M = n/V', textEn: 'Molarity M = n/V' },
            { id: 'molality', textAr: 'المولالية', textEn: 'Molality' },
            { id: 'percent', textAr: 'النسبة المئوية', textEn: 'Percentage' }
          ]
        },
        {
          id: 'solubility',
          textAr: 'الذوبانية',
          textEn: 'Solubility',
          color: '#f472b6',
          children: [
            { id: 'factors', textAr: 'العوامل المؤثرة', textEn: 'Affecting Factors' },
            { id: 'temperature', textAr: 'تأثير الحرارة', textEn: 'Temperature Effect' }
          ]
        },
        {
          id: 'acidbase',
          textAr: 'الأحماض والقواعد',
          textEn: 'Acids and Bases',
          color: '#fbbf24',
          children: [
            { id: 'ph', textAr: 'الرقم الهيدروجيني pH', textEn: 'pH Scale' },
            { id: 'arrhenius', textAr: 'نظرية أرهينيوس', textEn: 'Arrhenius Theory' },
            { id: 'bronsted', textAr: 'نظرية برونستد-لوري', textEn: 'Brønsted-Lowry Theory' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // خرائط الرياضيات (7 خرائط)
  // ==========================================
  {
    id: 'mindmap-math-algebra',
    lessonId: 'linear-equations',
    titleAr: 'خريطة الجبر',
    titleEn: 'Algebra Mind Map',
    descriptionAr: 'خريطة ذهنية للمعادلات والجبر',
    descriptionEn: 'Mind map for equations and algebra',
    subject: 'math',
    rootNode: {
      id: 'root',
      textAr: 'الجبر',
      textEn: 'Algebra',
      color: '#8b5cf6',
      children: [
        {
          id: 'equations',
          textAr: 'المعادلات',
          textEn: 'Equations',
          color: '#a78bfa',
          children: [
            { id: 'linear', textAr: 'معادلات خطية', textEn: 'Linear Equations' },
            { id: 'quadratic', textAr: 'معادلات تربيعية', textEn: 'Quadratic Equations' },
            { id: 'systems', textAr: 'أنظمة معادلات', textEn: 'Systems of Equations' }
          ]
        },
        {
          id: 'functions',
          textAr: 'الدوال',
          textEn: 'Functions',
          color: '#f472b6',
          children: [
            { id: 'linear-f', textAr: 'دوال خطية', textEn: 'Linear Functions' },
            { id: 'quadratic-f', textAr: 'دوال تربيعية', textEn: 'Quadratic Functions' },
            { id: 'exponential', textAr: 'دوال أسية', textEn: 'Exponential Functions' }
          ]
        },
        {
          id: 'inequalities',
          textAr: 'المتباينات',
          textEn: 'Inequalities',
          color: '#22c55e',
          children: [
            { id: 'linear-i', textAr: 'متباينات خطية', textEn: 'Linear Inequalities' },
            { id: 'quadratic-i', textAr: 'متباينات تربيعية', textEn: 'Quadratic Inequalities' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-math-functions',
    lessonId: 'linear-equations',
    titleAr: 'خريطة الدوال',
    titleEn: 'Functions Mind Map',
    descriptionAr: 'خريطة ذهنية للدوال الرياضية',
    descriptionEn: 'Mind map for mathematical functions',
    subject: 'math',
    rootNode: {
      id: 'root',
      textAr: 'الدوال',
      textEn: 'Functions',
      color: '#06b6d4',
      children: [
        {
          id: 'types',
          textAr: 'أنواع الدوال',
          textEn: 'Function Types',
          color: '#22d3ee',
          children: [
            { id: 'polynomial', textAr: 'دوال كثيرة الحدود', textEn: 'Polynomial Functions' },
            { id: 'rational', textAr: 'دوال نسبية', textEn: 'Rational Functions' },
            { id: 'trigonometric', textAr: 'دوال مثلثية', textEn: 'Trigonometric Functions' },
            { id: 'logarithmic', textAr: 'دوال لوغاريتمية', textEn: 'Logarithmic Functions' }
          ]
        },
        {
          id: 'properties',
          textAr: 'خصائص الدوال',
          textEn: 'Function Properties',
          color: '#f59e0b',
          children: [
            { id: 'domain', textAr: 'مجال الدالة', textEn: 'Domain' },
            { id: 'range', textAr: 'مدى الدالة', textEn: 'Range' },
            { id: 'inverse', textAr: 'الدالة العكسية', textEn: 'Inverse Function' }
          ]
        },
        {
          id: 'transformations',
          textAr: 'التحويلات',
          textEn: 'Transformations',
          color: '#ef4444',
          children: [
            { id: 'shift', textAr: 'إزاحة', textEn: 'Shift' },
            { id: 'stretch', textAr: 'تمدد', textEn: 'Stretch' },
            { id: 'reflect', textAr: 'انعكاس', textEn: 'Reflection' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-math-trigonometry',
    lessonId: 'trigonometric-functions',
    titleAr: 'خريطة علم المثلثات',
    titleEn: 'Trigonometry Mind Map',
    descriptionAr: 'خريطة ذهنية للدوال المثلثية',
    descriptionEn: 'Mind map for trigonometric functions',
    subject: 'math',
    rootNode: {
      id: 'root',
      textAr: 'علم المثلثات',
      textEn: 'Trigonometry',
      color: '#ec4899',
      children: [
        {
          id: 'ratios',
          textAr: 'النسب المثلثية',
          textEn: 'Trigonometric Ratios',
          color: '#f472b6',
          children: [
            { id: 'sin', textAr: 'sin θ = مقابل/وتر', textEn: 'sin θ = opposite/hypotenuse' },
            { id: 'cos', textAr: 'cos θ = مجاور/وتر', textEn: 'cos θ = adjacent/hypotenuse' },
            { id: 'tan', textAr: 'tan θ = مقابل/مجاور', textEn: 'tan θ = opposite/adjacent' }
          ]
        },
        {
          id: 'unit-circle',
          textAr: 'دائرة الوحدة',
          textEn: 'Unit Circle',
          color: '#8b5cf6',
          children: [
            { id: 'radians', textAr: 'الراديان', textEn: 'Radians' },
            { id: 'degrees', textAr: 'الدرجات', textEn: 'Degrees' },
            { id: 'special', textAr: 'الزوايا الخاصة', textEn: 'Special Angles' }
          ]
        },
        {
          id: 'identities',
          textAr: 'المتطابقات',
          textEn: 'Identities',
          color: '#22c55e',
          children: [
            { id: 'pythagorean', textAr: 'sin²θ + cos²θ = 1', textEn: 'sin²θ + cos²θ = 1' },
            { id: 'double', textAr: 'متطابقات الزاوية المضاعفة', textEn: 'Double Angle Identities' },
            { id: 'sum', textAr: 'متطابقات الجمع', textEn: 'Sum Identities' }
          ]
        },
        {
          id: 'laws',
          textAr: 'القوانين',
          textEn: 'Laws',
          color: '#f59e0b',
          children: [
            { id: 'sine-law', textAr: 'قانون الجيب', textEn: 'Law of Sines' },
            { id: 'cosine-law', textAr: 'قانون جيب التمام', textEn: 'Law of Cosines' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-math-calculus',
    lessonId: 'derivatives',
    titleAr: 'خريطة التفاضل والتكامل',
    titleEn: 'Calculus Mind Map',
    descriptionAr: 'خريطة ذهنية للتفاضل والتكامل',
    descriptionEn: 'Mind map for differentiation and integration',
    subject: 'math',
    rootNode: {
      id: 'root',
      textAr: 'التفاضل والتكامل',
      textEn: 'Calculus',
      color: '#f59e0b',
      children: [
        {
          id: 'limits',
          textAr: 'النهايات',
          textEn: 'Limits',
          color: '#fbbf24',
          children: [
            { id: 'definition', textAr: 'تعريف النهاية', textEn: 'Limit Definition' },
            { id: 'properties', textAr: 'خصائص النهايات', textEn: 'Limit Properties' },
            { id: 'continuity', textAr: 'الاستمرارية', textEn: 'Continuity' }
          ]
        },
        {
          id: 'derivatives',
          textAr: 'المشتقات',
          textEn: 'Derivatives',
          color: '#ef4444',
          children: [
            { id: 'definition', textAr: "f'(x) = lim(h→0) [f(x+h)-f(x)]/h", textEn: "f'(x) = lim(h→0) [f(x+h)-f(x)]/h" },
            { id: 'rules', textAr: 'قواعد الاشتقاق', textEn: 'Differentiation Rules' },
            { id: 'applications', textAr: 'تطبيقات المشتقة', textEn: 'Derivative Applications' }
          ]
        },
        {
          id: 'integrals',
          textAr: 'التكاملات',
          textEn: 'Integrals',
          color: '#22c55e',
          children: [
            { id: 'indefinite', textAr: 'تكامل غير محدد', textEn: 'Indefinite Integral' },
            { id: 'definite', textAr: 'تكامل محدد', textEn: 'Definite Integral' },
            { id: 'ftc', textAr: 'نظرية التأسيس', textEn: 'Fundamental Theorem' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-math-geometry',
    lessonId: 'angles-measurement',
    titleAr: 'خريطة الهندسة',
    titleEn: 'Geometry Mind Map',
    descriptionAr: 'خريطة ذهنية للأشكال الهندسية',
    descriptionEn: 'Mind map for geometric shapes',
    subject: 'math',
    rootNode: {
      id: 'root',
      textAr: 'الهندسة',
      textEn: 'Geometry',
      color: '#10b981',
      children: [
        {
          id: 'angles',
          textAr: 'الزوايا',
          textEn: 'Angles',
          color: '#34d399',
          children: [
            { id: 'acute', textAr: 'حادة (< 90°)', textEn: 'Acute (< 90°)' },
            { id: 'right', textAr: 'قائمة (90°)', textEn: 'Right (90°)' },
            { id: 'obtuse', textAr: 'منفرجة (> 90°)', textEn: 'Obtuse (> 90°)' },
            { id: 'straight', textAr: 'مستقيمة (180°)', textEn: 'Straight (180°)' }
          ]
        },
        {
          id: 'triangles',
          textAr: 'المثلثات',
          textEn: 'Triangles',
          color: '#f472b6',
          children: [
            { id: 'equilateral', textAr: 'متساوي الأضلاع', textEn: 'Equilateral' },
            { id: 'isosceles', textAr: 'متساوي الساقين', textEn: 'Isosceles' },
            { id: 'scalene', textAr: 'مختلف الأضلاع', textEn: 'Scalene' }
          ]
        },
        {
          id: 'polygons',
          textAr: 'المضلعات',
          textEn: 'Polygons',
          color: '#8b5cf6',
          children: [
            { id: 'quadrilateral', textAr: 'رباعي الأضلاع', textEn: 'Quadrilateral' },
            { id: 'pentagon', textAr: 'خماسي', textEn: 'Pentagon' },
            { id: 'hexagon', textAr: 'سداسي', textEn: 'Hexagon' }
          ]
        },
        {
          id: 'circle',
          textAr: 'الدائرة',
          textEn: 'Circle',
          color: '#f59e0b',
          children: [
            { id: 'radius', textAr: 'نصف القطر r', textEn: 'Radius r' },
            { id: 'diameter', textAr: 'القطر d = 2r', textEn: 'Diameter d = 2r' },
            { id: 'circumference', textAr: 'المحيط C = 2πr', textEn: 'Circumference C = 2πr' },
            { id: 'area', textAr: 'المساحة A = πr²', textEn: 'Area A = πr²' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-matrices',
    lessonId: 'systems-equations',
    titleAr: 'خريطة المصفوفات',
    titleEn: 'Matrices Mind Map',
    descriptionAr: 'خريطة ذهنية للمصفوفات والعمليات عليها',
    descriptionEn: 'Mind map for matrices and operations',
    subject: 'math',
    rootNode: {
      id: 'root',
      textAr: 'المصفوفات',
      textEn: 'Matrices',
      color: '#6366f1',
      children: [
        {
          id: 'types',
          textAr: 'أنواع المصفوفات',
          textEn: 'Matrix Types',
          color: '#818cf8',
          children: [
            { id: 'square', textAr: 'مصفوفة مربعة', textEn: 'Square Matrix' },
            { id: 'identity', textAr: 'مصفوفة الوحدة', textEn: 'Identity Matrix' },
            { id: 'zero', textAr: 'المصفوفة الصفرية', textEn: 'Zero Matrix' }
          ]
        },
        {
          id: 'operations',
          textAr: 'العمليات',
          textEn: 'Operations',
          color: '#22c55e',
          children: [
            { id: 'addition', textAr: 'الجمع', textEn: 'Addition' },
            { id: 'subtraction', textAr: 'الطرح', textEn: 'Subtraction' },
            { id: 'multiplication', textAr: 'الضرب', textEn: 'Multiplication' }
          ]
        },
        {
          id: 'determinant',
          textAr: 'المحدد',
          textEn: 'Determinant',
          color: '#f472b6',
          children: [
            { id: '2x2', textAr: 'محدد 2×2', textEn: '2×2 Determinant' },
            { id: '3x3', textAr: 'محدد 3×3', textEn: '3×3 Determinant' }
          ]
        },
        {
          id: 'inverse',
          textAr: 'المصفوفة العكسية',
          textEn: 'Inverse Matrix',
          color: '#f59e0b',
          children: [
            { id: 'formula', textAr: 'A⁻¹ = adj(A)/|A|', textEn: 'A⁻¹ = adj(A)/|A|' },
            { id: 'condition', textAr: '|A| ≠ 0', textEn: '|A| ≠ 0' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-math-vectors',
    lessonId: 'angles-measurement',
    titleAr: 'خريطة المتجهات',
    titleEn: 'Vectors Mind Map',
    descriptionAr: 'خريطة ذهنية للمتجهات والعمليات عليها',
    descriptionEn: 'Mind map for vectors and operations',
    subject: 'math',
    rootNode: {
      id: 'root',
      textAr: 'المتجهات',
      textEn: 'Vectors',
      color: '#14b8a6',
      children: [
        {
          id: 'definition',
          textAr: 'التعريف',
          textEn: 'Definition',
          color: '#2dd4bf',
          children: [
            { id: 'magnitude', textAr: 'المقدار |v|', textEn: 'Magnitude |v|' },
            { id: 'direction', textAr: 'الاتجاه', textEn: 'Direction' },
            { id: 'components', textAr: 'المركبات', textEn: 'Components' }
          ]
        },
        {
          id: 'operations',
          textAr: 'العمليات',
          textEn: 'Operations',
          color: '#f472b6',
          children: [
            { id: 'addition', textAr: 'الجمع', textEn: 'Addition' },
            { id: 'subtraction', textAr: 'الطرح', textEn: 'Subtraction' },
            { id: 'scalar', textAr: 'الضرب في عدد', textEn: 'Scalar Multiplication' }
          ]
        },
        {
          id: 'products',
          textAr: 'الضرب',
          textEn: 'Products',
          color: '#f59e0b',
          children: [
            { id: 'dot', textAr: 'حاصل الضرب الاتجاهي a·b', textEn: 'Dot Product a·b' },
            { id: 'cross', textAr: 'حاصل الضرب المتجهي a×b', textEn: 'Cross Product a×b' }
          ]
        }
      ]
    }
  },

  // ==========================================
  // خرائط إضافية (3 خرائط)
  // ==========================================
  {
    id: 'mindmap-scientific-method',
    lessonId: 'any',
    titleAr: 'خريطة المنهج العلمي',
    titleEn: 'Scientific Method Mind Map',
    descriptionAr: 'خريطة ذهنية للمنهج العلمي',
    descriptionEn: 'Mind map for scientific method',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'المنهج العلمي',
      textEn: 'Scientific Method',
      color: '#64748b',
      children: [
        {
          id: 'steps',
          textAr: 'الخطوات',
          textEn: 'Steps',
          color: '#94a3b8',
          children: [
            { id: 'observation', textAr: 'الملاحظة', textEn: 'Observation' },
            { id: 'question', textAr: 'السؤال', textEn: 'Question' },
            { id: 'hypothesis', textAr: 'الفرضية', textEn: 'Hypothesis' },
            { id: 'experiment', textAr: 'التجربة', textEn: 'Experiment' },
            { id: 'analysis', textAr: 'التحليل', textEn: 'Analysis' },
            { id: 'conclusion', textAr: 'الاستنتاج', textEn: 'Conclusion' }
          ]
        },
        {
          id: 'variables',
          textAr: 'المتغيرات',
          textEn: 'Variables',
          color: '#f472b6',
          children: [
            { id: 'independent', textAr: 'المتغير المستقل', textEn: 'Independent Variable' },
            { id: 'dependent', textAr: 'المتغير التابع', textEn: 'Dependent Variable' },
            { id: 'controlled', textAr: 'المتغيرات المضبوطة', textEn: 'Controlled Variables' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-units-measurements',
    lessonId: 'any',
    titleAr: 'خريطة الوحدات والقياسات',
    titleEn: 'Units and Measurements Mind Map',
    descriptionAr: 'خريطة ذهنية لوحدات القياس',
    descriptionEn: 'Mind map for measurement units',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'الوحدات والقياسات',
      textEn: 'Units and Measurements',
      color: '#0d9488',
      children: [
        {
          id: 'si',
          textAr: 'نظام الوحدات SI',
          textEn: 'SI Units System',
          color: '#14b8a6',
          children: [
            { id: 'length', textAr: 'الطول: متر (m)', textEn: 'Length: meter (m)' },
            { id: 'mass', textAr: 'الكتلة: كيلوجرام (kg)', textEn: 'Mass: kilogram (kg)' },
            { id: 'time', textAr: 'الزمن: ثانية (s)', textEn: 'Time: second (s)' },
            { id: 'current', textAr: 'التيار: أمبير (A)', textEn: 'Current: ampere (A)' },
            { id: 'temperature', textAr: 'الحرارة: كلفن (K)', textEn: 'Temperature: kelvin (K)' }
          ]
        },
        {
          id: 'derived',
          textAr: 'الوحدات المشتقة',
          textEn: 'Derived Units',
          color: '#f472b6',
          children: [
            { id: 'force', textAr: 'القوة: نيوتن (N)', textEn: 'Force: newton (N)' },
            { id: 'energy', textAr: 'الطاقة: جول (J)', textEn: 'Energy: joule (J)' },
            { id: 'power', textAr: 'القدرة: واط (W)', textEn: 'Power: watt (W)' }
          ]
        },
        {
          id: 'prefixes',
          textAr: 'السوابق',
          textEn: 'Prefixes',
          color: '#fbbf24',
          children: [
            { id: 'kilo', textAr: 'كيلو (k) = 10³', textEn: 'kilo (k) = 10³' },
            { id: 'milli', textAr: 'ملي (m) = 10⁻³', textEn: 'milli (m) = 10⁻³' },
            { id: 'micro', textAr: 'ميكرو (μ) = 10⁻⁶', textEn: 'micro (μ) = 10⁻⁶' },
            { id: 'nano', textAr: 'نانو (n) = 10⁻⁹', textEn: 'nano (n) = 10⁻⁹' }
          ]
        }
      ]
    }
  },
  {
    id: 'mindmap-measurement-errors',
    lessonId: 'any',
    titleAr: 'خريطة الأخطاء التجريبية',
    titleEn: 'Experimental Errors Mind Map',
    descriptionAr: 'خريطة ذهنية لأنواع الأخطاء في القياس',
    descriptionEn: 'Mind map for types of measurement errors',
    subject: 'physics',
    rootNode: {
      id: 'root',
      textAr: 'الأخطاء التجريبية',
      textEn: 'Experimental Errors',
      color: '#dc2626',
      children: [
        {
          id: 'types',
          textAr: 'أنواع الأخطاء',
          textEn: 'Error Types',
          color: '#f87171',
          children: [
            { id: 'systematic', textAr: 'أخطاء نظامية', textEn: 'Systematic Errors' },
            { id: 'random', textAr: 'أخطاء عشوائية', textEn: 'Random Errors' }
          ]
        },
        {
          id: 'accuracy-precision',
          textAr: 'الدقة والضبط',
          textEn: 'Accuracy and Precision',
          color: '#22c55e',
          children: [
            { id: 'accuracy', textAr: 'الدقة (القيمة الحقيقية)', textEn: 'Accuracy (True Value)' },
            { id: 'precision', textAr: 'الضبط (التكرار)', textEn: 'Precision (Reproducibility)' }
          ]
        },
        {
          id: 'uncertainty',
          textAr: 'عدم اليقين',
          textEn: 'Uncertainty',
          color: '#8b5cf6',
          children: [
            { id: 'absolute', textAr: 'عدم اليقين المطلق', textEn: 'Absolute Uncertainty' },
            { id: 'relative', textAr: 'عدم اليقين النسبي', textEn: 'Relative Uncertainty' },
            { id: 'percentage', textAr: 'النسبة المئوية', textEn: 'Percentage Uncertainty' }
          ]
        }
      ]
    }
  }
];

// Helper functions
export function getMindmapById(id: string): MindMap | undefined {
  return mindmaps.find(m => m.id === id);
}

export function getMindmapsByLessonId(lessonId: string): MindMap[] {
  return mindmaps.filter(m => m.lessonId === lessonId || m.lessonId === 'any');
}

export function getMindmapsBySubject(subject: string): MindMap[] {
  return mindmaps.filter(m => m.subject === subject);
}

export function getMindmapsStats() {
  return {
    total: mindmaps.length,
    physics: mindmaps.filter(m => m.subject === 'physics').length,
    chemistry: mindmaps.filter(m => m.subject === 'chemistry').length,
    math: mindmaps.filter(m => m.subject === 'math').length,
    biology: mindmaps.filter(m => m.subject === 'biology').length
  };
}
