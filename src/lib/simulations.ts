// التعريف بأنواع المحاكيات
export interface Simulation {
  id: string;
  lessonId: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: 'physics' | 'chemistry' | 'math' | 'biology' | 'geography' | 'interactive';
  category: 'experiment' | 'calculator' | 'visualization' | 'game';
  thumbnail: string;
  isFree: boolean;
}

// قائمة المحاكيات التعليمية - 111 محاكي
export const simulations: Simulation[] = [
  // ==========================================
  // الفيزياء - الميكانيكا (25 محاكي)
  // ==========================================
  {
    id: 'sim-physics-motion-1',
    lessonId: 'motion-intro',
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
    id: 'sim-physics-motion-2',
    lessonId: 'motion-intro',
    titleAr: 'رسم البيانات الحركية',
    titleEn: 'Motion Graphs Plotter',
    descriptionAr: 'أداة لرسم منحنيات الموضع والسرعة والتسارع versus الزمن',
    descriptionEn: 'Tool to plot position, velocity, and acceleration vs time curves',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/graphs.png',
    isFree: true
  },
  {
    id: 'sim-physics-motion-3',
    lessonId: 'velocity-acceleration',
    titleAr: 'محاكاة السرعة والتسارع',
    titleEn: 'Velocity and Acceleration Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الفرق بين السرعة المتوسطة واللحظية والتسارع',
    descriptionEn: 'Interactive experiment to understand average vs instantaneous velocity and acceleration',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/velocity.png',
    isFree: true
  },
  {
    id: 'sim-physics-motion-4',
    lessonId: 'equations-motion',
    titleAr: 'حاسبة معادلات الحركة',
    titleEn: 'Motion Equations Calculator',
    descriptionAr: 'حاسبة تفاعلية لمعادلات الحركة uniformly accelerated motion',
    descriptionEn: 'Interactive calculator for uniformly accelerated motion equations',
    type: 'physics',
    category: 'calculator',
    thumbnail: '/simulations/calculator.png',
    isFree: true
  },
  {
    id: 'sim-physics-freefall-1',
    lessonId: 'free-fall',
    titleAr: 'محاكاة السقوط الحر',
    titleEn: 'Free Fall Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم السقوط الحر وتأثير الجاذبية',
    descriptionEn: 'Interactive experiment to understand free fall and gravity effects',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/freefall.png',
    isFree: true
  },
  {
    id: 'sim-physics-freefall-2',
    lessonId: 'free-fall',
    titleAr: 'مقارنة السقوط على الكواكب',
    titleEn: 'Planetary Fall Comparison',
    descriptionAr: 'مقارنة السقوط الحر على مختلف الكواكب والقمر',
    descriptionEn: 'Compare free fall on different planets and the moon',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/planets.png',
    isFree: false
  },
  {
    id: 'sim-physics-forces-1',
    lessonId: 'forces-intro',
    titleAr: 'محاكاة القوى والتوازن',
    titleEn: 'Forces and Equilibrium Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم القوى والتوازن ومحصلة القوى',
    descriptionEn: 'Interactive experiment to understand forces, equilibrium, and net force',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/forces.png',
    isFree: true
  },
  {
    id: 'sim-physics-forces-2',
    lessonId: 'forces-intro',
    titleAr: 'تحليل القوى المتجهة',
    titleEn: 'Vector Forces Analysis',
    descriptionAr: 'أداة لتحليل القوى إلى مركبات ودمج المتجهات',
    descriptionEn: 'Tool to resolve forces into components and combine vectors',
    type: 'physics',
    category: 'calculator',
    thumbnail: '/simulations/vectors.png',
    isFree: true
  },
  {
    id: 'sim-physics-newton-1',
    lessonId: 'newton-laws',
    titleAr: 'محاكاة قانون نيوتن الأول',
    titleEn: "Newton's First Law Simulation",
    descriptionAr: 'تجربة تفاعلية لفهم قانون القصور الذاتي',
    descriptionEn: 'Interactive experiment to understand the law of inertia',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/newton1.png',
    isFree: true
  },
  {
    id: 'sim-physics-newton-2',
    lessonId: 'newton-laws',
    titleAr: 'محاكاة قانون نيوتن الثاني',
    titleEn: "Newton's Second Law Simulation",
    descriptionAr: 'تجربة تفاعلية لفهم العلاقة بين القوة والكتلة والتسارع',
    descriptionEn: 'Interactive experiment to understand F=ma relationship',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/newton2.png',
    isFree: true
  },
  {
    id: 'sim-physics-newton-3',
    lessonId: 'newton-laws',
    titleAr: 'محاكاة قانون نيوتن الثالث',
    titleEn: "Newton's Third Law Simulation",
    descriptionAr: 'تجربة تفاعلية لفهم الفعل ورد الفعل',
    descriptionEn: 'Interactive experiment to understand action and reaction',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/newton3.png',
    isFree: true
  },
  {
    id: 'sim-physics-newton-4',
    lessonId: 'newton-laws',
    titleAr: 'محاكاة الاحتكاك',
    titleEn: 'Friction Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قوة الاحتكاك وأنواعها',
    descriptionEn: 'Interactive experiment to understand friction force and its types',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/friction.png',
    isFree: false
  },
  {
    id: 'sim-physics-projectile-1',
    lessonId: 'motion-intro',
    titleAr: 'محاكاة القذيفة',
    titleEn: 'Projectile Motion Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم حركة المقذوفات ومسارها',
    descriptionEn: 'Interactive experiment to understand projectile motion and trajectory',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/projectile.png',
    isFree: true
  },
  {
    id: 'sim-physics-projectile-2',
    lessonId: 'motion-intro',
    titleAr: 'مقذوفات بزوايا مختلفة',
    titleEn: 'Projectiles at Different Angles',
    descriptionAr: 'مقارنة مسارات المقذوفات عند زوايا إطلاق مختلفة',
    descriptionEn: 'Compare projectile trajectories at different launch angles',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/angles.png',
    isFree: true
  },
  {
    id: 'sim-physics-energy-1',
    lessonId: 'energy-intro',
    titleAr: 'محاكاة الطاقة الحركية والكامنة',
    titleEn: 'Kinetic and Potential Energy Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الطاقة الحركية والكامنة وتحولاتهما',
    descriptionEn: 'Interactive experiment to understand kinetic and potential energy transformation',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/energy.png',
    isFree: true
  },
  {
    id: 'sim-physics-energy-2',
    lessonId: 'energy-intro',
    titleAr: 'محاكاة حفظ الطاقة',
    titleEn: 'Energy Conservation Simulation',
    descriptionAr: 'تجربة تفاعلية لإثبات قانون حفظ الطاقة الميكانيكية',
    descriptionEn: 'Interactive experiment to prove mechanical energy conservation',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/conservation.png',
    isFree: true
  },
  {
    id: 'sim-physics-energy-3',
    lessonId: 'energy-intro',
    titleAr: 'محاكاة البندول البسيط',
    titleEn: 'Simple Pendulum Simulation',
    descriptionAr: 'تجربة تفاعلية لدراسة البندول البسيط وتحولات الطاقة',
    descriptionEn: 'Interactive experiment to study simple pendulum and energy transformation',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/pendulum.png',
    isFree: true
  },
  {
    id: 'sim-physics-energy-4',
    lessonId: 'energy-intro',
    titleAr: 'محاكاة الزنبرك',
    titleEn: 'Spring Oscillation Simulation',
    descriptionAr: 'تجربة تفاعلية لدراسة الحركة التوافقية البسيطة للزنبرك',
    descriptionEn: 'Interactive experiment to study simple harmonic motion of a spring',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/spring.png',
    isFree: false
  },
  {
    id: 'sim-physics-momentum-1',
    lessonId: 'newton-laws',
    titleAr: 'محاكاة الزخم والتصادم',
    titleEn: 'Momentum and Collision Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الزخم وحفظه في التصادمات',
    descriptionEn: 'Interactive experiment to understand momentum and its conservation in collisions',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/momentum.png',
    isFree: true
  },
  {
    id: 'sim-physics-momentum-2',
    lessonId: 'newton-laws',
    titleAr: 'تصادمات مرنة وغير مرنة',
    titleEn: 'Elastic and Inelastic Collisions',
    descriptionAr: 'مقارنة بين التصادمات المرنة وغير المرنة',
    descriptionEn: 'Compare elastic and inelastic collisions',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/collision.png',
    isFree: true
  },
  {
    id: 'sim-physics-work-1',
    lessonId: 'energy-intro',
    titleAr: 'محاكاة الشغل والقدرة',
    titleEn: 'Work and Power Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم مفهومي الشغل والقدرة',
    descriptionEn: 'Interactive experiment to understand work and power concepts',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/work.png',
    isFree: true
  },
  {
    id: 'sim-physics-circular-1',
    lessonId: 'velocity-acceleration',
    titleAr: 'محاكاة الحركة الدائرية',
    titleEn: 'Circular Motion Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الحركة الدائرية المنتظمة والقوة المركزية',
    descriptionEn: 'Interactive experiment to understand uniform circular motion and centripetal force',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/circular.png',
    isFree: false
  },
  {
    id: 'sim-physics-gravity-1',
    lessonId: 'forces-intro',
    titleAr: 'محاكاة الجاذبية',
    titleEn: 'Gravity Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قانون الجاذبية العام لنيوتن',
    descriptionEn: 'Interactive experiment to understand Newton\'s law of universal gravitation',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/gravity.png',
    isFree: true
  },
  {
    id: 'sim-physics-satellite-1',
    lessonId: 'forces-intro',
    titleAr: 'محاكاة الأقمار الصناعية',
    titleEn: 'Satellite Motion Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم حركة الأقمار الصناعية والسرعات المدارية',
    descriptionEn: 'Interactive experiment to understand satellite motion and orbital velocities',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/satellite.png',
    isFree: false
  },

  // ==========================================
  // الفيزياء - الموجات (15 محاكي)
  // ==========================================
  {
    id: 'sim-physics-wave-1',
    lessonId: 'wave-properties',
    titleAr: 'محاكاة الموجات المستعرضة',
    titleEn: 'Transverse Waves Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص الموجات المستعرضة',
    descriptionEn: 'Interactive experiment to understand transverse wave properties',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/wave.png',
    isFree: true
  },
  {
    id: 'sim-physics-wave-2',
    lessonId: 'wave-properties',
    titleAr: 'محاكاة الموجات الطولية',
    titleEn: 'Longitudinal Waves Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص الموجات الطولية',
    descriptionEn: 'Interactive experiment to understand longitudinal wave properties',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/longitudinal.png',
    isFree: true
  },
  {
    id: 'sim-physics-wave-3',
    lessonId: 'wave-properties',
    titleAr: 'محاكاة تداخل الموجات',
    titleEn: 'Wave Interference Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم ظاهرة التداخل والبناء والهدم',
    descriptionEn: 'Interactive experiment to understand interference, constructive and destructive',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/interference.png',
    isFree: true
  },
  {
    id: 'sim-physics-wave-4',
    lessonId: 'wave-properties',
    titleAr: 'محاكاة انعكاس الموجات',
    titleEn: 'Wave Reflection Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم انعكاس الموجات من الأطراف الثابتة والمتحركة',
    descriptionEn: 'Interactive experiment to understand wave reflection from fixed and free ends',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/reflection.png',
    isFree: true
  },
  {
    id: 'sim-physics-wave-5',
    lessonId: 'wave-properties',
    titleAr: 'محاكاة الموجات الواقفة',
    titleEn: 'Standing Waves Simulation',
    descriptionAr: 'تجربة تفاعلية لتكوين الموجات الواقفة والعقد والبطون',
    descriptionEn: 'Interactive experiment to form standing waves, nodes, and antinodes',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/standing.png',
    isFree: false
  },
  {
    id: 'sim-physics-sound-1',
    lessonId: 'sound-waves',
    titleAr: 'محاكاة الموجات الصوتية',
    titleEn: 'Sound Waves Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص الصوت وسرعته',
    descriptionEn: 'Interactive experiment to understand sound properties and speed',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/sound.png',
    isFree: true
  },
  {
    id: 'sim-physics-sound-2',
    lessonId: 'sound-waves',
    titleAr: 'محاكاة دوبلر',
    titleEn: 'Doppler Effect Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تأثير دوبلر',
    descriptionEn: 'Interactive experiment to understand the Doppler effect',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/doppler.png',
    isFree: true
  },
  {
    id: 'sim-physics-sound-3',
    lessonId: 'sound-waves',
    titleAr: 'محاكاة الرنين الصوتي',
    titleEn: 'Acoustic Resonance Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الرنين في الأنابيب المهتزة',
    descriptionEn: 'Interactive experiment to understand resonance in vibrating tubes',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/resonance.png',
    isFree: true
  },
  {
    id: 'sim-physics-sound-4',
    lessonId: 'sound-waves',
    titleAr: 'محاكاة النغمات وطبقات الصوت',
    titleEn: 'Pitch and Frequency Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم العلاقة بين التردد وطبقة الصوت',
    descriptionEn: 'Interactive experiment to understand the relationship between frequency and pitch',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/pitch.png',
    isFree: true
  },
  {
    id: 'sim-physics-light-1',
    lessonId: 'light-waves',
    titleAr: 'محاكاة انعكاس الضوء',
    titleEn: 'Light Reflection Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قانون الانعكاس والمرايا',
    descriptionEn: 'Interactive experiment to understand reflection law and mirrors',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/reflection-light.png',
    isFree: true
  },
  {
    id: 'sim-physics-light-2',
    lessonId: 'light-waves',
    titleAr: 'محاكاة انكسار الضوء',
    titleEn: 'Light Refraction Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قانون سنيل والانكسار',
    descriptionEn: 'Interactive experiment to understand Snell\'s law and refraction',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/refraction.png',
    isFree: true
  },
  {
    id: 'sim-physics-light-3',
    lessonId: 'light-waves',
    titleAr: 'محاكاة العدسات',
    titleEn: 'Lenses Simulation',
    descriptionAr: 'تجربة تفاعلية لتكوين الصور بالعدسات المحدبة والمقعرة',
    descriptionEn: 'Interactive experiment to form images with convex and concave lenses',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/lenses.png',
    isFree: true
  },
  {
    id: 'sim-physics-light-4',
    lessonId: 'light-waves',
    titleAr: 'محاكاة حيود الضوء',
    titleEn: 'Light Diffraction Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم ظاهرة الحيود والشقوق',
    descriptionEn: 'Interactive experiment to understand diffraction and slits',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/diffraction.png',
    isFree: false
  },
  {
    id: 'sim-physics-light-5',
    lessonId: 'light-waves',
    titleAr: 'محاكاة تجربة الشق المزدوج',
    titleEn: 'Double Slit Experiment Simulation',
    descriptionAr: 'محاكاة لتجربة يونج للشق المزدوج والتداخل',
    descriptionEn: 'Simulation of Young\'s double slit experiment and interference',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/doubleslit.png',
    isFree: true
  },
  {
    id: 'sim-physics-optics-1',
    lessonId: 'light-waves',
    titleAr: 'محاكاة المرايا الكروية',
    titleEn: 'Spherical Mirrors Simulation',
    descriptionAr: 'تجربة تفاعلية لتكوين الصور بالمرايا المقعرة والمحدبة',
    descriptionEn: 'Interactive experiment to form images with concave and convex mirrors',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/mirrors.png',
    isFree: true
  },

  // ==========================================
  // الفيزياء - الكهرباء والمغناطيسية (16 محاكي)
  // ==========================================
  {
    id: 'sim-physics-electricity-1',
    lessonId: 'electric-charge',
    titleAr: 'محاكاة الشحنة الكهربائية',
    titleEn: 'Electric Charge Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الشحنة الكهربائية وقانون كولوم',
    descriptionEn: 'Interactive experiment to understand electric charge and Coulomb\'s law',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/charge.png',
    isFree: true
  },
  {
    id: 'sim-physics-electricity-2',
    lessonId: 'electric-charge',
    titleAr: 'محاكاة المجال الكهربائي',
    titleEn: 'Electric Field Simulation',
    descriptionAr: 'تجربة تفاعلية لرسم وتحليل المجالات الكهربائية',
    descriptionEn: 'Interactive experiment to plot and analyze electric fields',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/efield.png',
    isFree: true
  },
  {
    id: 'sim-physics-electricity-3',
    lessonId: 'electric-charge',
    titleAr: 'محاكاة الجهد الكهربائي',
    titleEn: 'Electric Potential Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الجهد الكهربائي والطاقة الكامنة',
    descriptionEn: 'Interactive experiment to understand electric potential and potential energy',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/potential.png',
    isFree: false
  },
  {
    id: 'sim-physics-circuit-1',
    lessonId: 'electric-current',
    titleAr: 'محاكاة الدوائر الكهربائية البسيطة',
    titleEn: 'Simple Circuits Simulation',
    descriptionAr: 'تجربة تفاعلية لبناء دوائر كهربائية بسيطة',
    descriptionEn: 'Interactive experiment to build simple electric circuits',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/circuit.png',
    isFree: true
  },
  {
    id: 'sim-physics-circuit-2',
    lessonId: 'simple-circuits',
    titleAr: 'محاكاة التوالي والتوازي',
    titleEn: 'Series and Parallel Circuits Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم دوائر التوالي والتوازي',
    descriptionEn: 'Interactive experiment to understand series and parallel circuits',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/series-parallel.png',
    isFree: true
  },
  {
    id: 'sim-physics-circuit-3',
    lessonId: 'simple-circuits',
    titleAr: 'محاكاة قانون أوم',
    titleEn: "Ohm's Law Simulation",
    descriptionAr: 'تجربة تفاعلية لإثبات قانون أوم والعلاقة بين V, I, R',
    descriptionEn: 'Interactive experiment to prove Ohm\'s law and V, I, R relationship',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/ohm.png',
    isFree: true
  },
  {
    id: 'sim-physics-circuit-4',
    lessonId: 'electric-power',
    titleAr: 'محاكاة القدرة الكهربائية',
    titleEn: 'Electric Power Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم القدرة الكهربائية وحسابها',
    descriptionEn: 'Interactive experiment to understand electric power and its calculation',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/power.png',
    isFree: true
  },
  {
    id: 'sim-physics-circuit-5',
    lessonId: 'simple-circuits',
    titleAr: 'محاكاة المقاومات',
    titleEn: 'Resistors Simulation',
    descriptionAr: 'تجربة تفاعلية لحساب المقاومات المكافئة',
    descriptionEn: 'Interactive experiment to calculate equivalent resistance',
    type: 'physics',
    category: 'calculator',
    thumbnail: '/simulations/resistors.png',
    isFree: true
  },
  {
    id: 'sim-physics-magnetism-1',
    lessonId: 'magnetism-intro',
    titleAr: 'محاكاة المغناطيسية',
    titleEn: 'Magnetism Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم المغناطيس والمجال المغناطيسي',
    descriptionEn: 'Interactive experiment to understand magnets and magnetic fields',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/magnet.png',
    isFree: true
  },
  {
    id: 'sim-physics-magnetism-2',
    lessonId: 'magnetism-intro',
    titleAr: 'محاكاة خطوط المجال المغناطيسي',
    titleEn: 'Magnetic Field Lines Simulation',
    descriptionAr: 'تجربة تفاعلية لرسم خطوط المجال المغناطيسي',
    descriptionEn: 'Interactive experiment to plot magnetic field lines',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/mfield.png',
    isFree: true
  },
  {
    id: 'sim-physics-electromagnetism-1',
    lessonId: 'electromagnetism',
    titleAr: 'محاكاة المغناطيس الكهربائي',
    titleEn: 'Electromagnet Simulation',
    descriptionAr: 'تجربة تفاعلية لصنع مغناطيس كهربائي',
    descriptionEn: 'Interactive experiment to build an electromagnet',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/electromagnet.png',
    isFree: true
  },
  {
    id: 'sim-physics-electromagnetism-2',
    lessonId: 'electromagnetism',
    titleAr: 'محاكاة الحث الكهرومغناطيسي',
    titleEn: 'Electromagnetic Induction Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قانون فاراداي والحث',
    descriptionEn: 'Interactive experiment to understand Faraday\'s law and induction',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/induction.png',
    isFree: true
  },
  {
    id: 'sim-physics-electromagnetism-3',
    lessonId: 'electromagnetism',
    titleAr: 'محاكاة المحول الكهربائي',
    titleEn: 'Transformer Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم عمل المحولات الكهربائية',
    descriptionEn: 'Interactive experiment to understand electric transformers',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/transformer.png',
    isFree: false
  },
  {
    id: 'sim-physics-electromagnetism-4',
    lessonId: 'electromagnetism',
    titleAr: 'محاكاة المحرك الكهربائي',
    titleEn: 'Electric Motor Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم مبدأ عمل المحرك الكهربائي',
    descriptionEn: 'Interactive experiment to understand electric motor principle',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/motor.png',
    isFree: true
  },
  {
    id: 'sim-physics-electromagnetism-5',
    lessonId: 'electromagnetism',
    titleAr: 'محاكاة الموجات الكهرومغناطيسية',
    titleEn: 'Electromagnetic Waves Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الطيف الكهرومغناطيسي',
    descriptionEn: 'Interactive experiment to understand the electromagnetic spectrum',
    type: 'physics',
    category: 'visualization',
    thumbnail: '/simulations/emwaves.png',
    isFree: true
  },
  {
    id: 'sim-physics-thermodynamics-1',
    lessonId: 'energy-intro',
    titleAr: 'محاكاة الديناميكا الحرارية',
    titleEn: 'Thermodynamics Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قوانين الديناميكا الحرارية',
    descriptionEn: 'Interactive experiment to understand thermodynamics laws',
    type: 'physics',
    category: 'experiment',
    thumbnail: '/simulations/thermo.png',
    isFree: true
  },

  // ==========================================
  // الكيمياء - البنية الذرية والجدول الدوري (15 محاكي)
  // ==========================================
  {
    id: 'sim-chemistry-atom-1',
    lessonId: 'atom-components',
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
    id: 'sim-chemistry-atom-2',
    lessonId: 'atom-components',
    titleAr: 'محاكاة النموذج الذري',
    titleEn: 'Atomic Models Simulation',
    descriptionAr: 'تطور النماذج الذرية من دالتون إلى بور',
    descriptionEn: 'Evolution of atomic models from Dalton to Bohr',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/models.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-atom-3',
    lessonId: 'electronic-configuration',
    titleAr: 'محاكاة التوزيع الإلكتروني',
    titleEn: 'Electron Configuration Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم التوزيع الإلكتروني في مستويات الطاقة',
    descriptionEn: 'Interactive experiment to understand electron configuration in energy levels',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/electron.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-atom-4',
    lessonId: 'electronic-configuration',
    titleAr: 'محاكاة الأفلاك الإلكترونية',
    titleEn: 'Orbitals Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم أشكال الأفلاك s, p, d, f',
    descriptionEn: 'Interactive experiment to understand shapes of s, p, d, f orbitals',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/orbitals.png',
    isFree: false
  },
  {
    id: 'sim-chemistry-periodic-1',
    lessonId: 'periodic-table',
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
    id: 'sim-chemistry-periodic-2',
    lessonId: 'periodic-trends',
    titleAr: 'محاكاة الاتجاهات الدورية',
    titleEn: 'Periodic Trends Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم نصف القطر الذري وطاقة التأين',
    descriptionEn: 'Interactive experiment to understand atomic radius and ionization energy trends',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/trends.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-periodic-3',
    lessonId: 'periodic-trends',
    titleAr: 'محاكاة السالبية الكهربائية',
    titleEn: 'Electronegativity Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم السالبية الكهربائية واتجاهاتها',
    descriptionEn: 'Interactive experiment to understand electronegativity and its trends',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/electronegativity.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-periodic-4',
    lessonId: 'periodic-table',
    titleAr: 'محاكاة المجموعات والدورات',
    titleEn: 'Groups and Periods Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تصنيف العناصر في المجموعات والدورات',
    descriptionEn: 'Interactive experiment to understand element classification in groups and periods',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/groups.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-bond-1',
    lessonId: 'ionic-bonding',
    titleAr: 'محاكاة الرابطة الأيونية',
    titleEn: 'Ionic Bond Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تكوين الرابطة الأيونية',
    descriptionEn: 'Interactive experiment to understand ionic bond formation',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/ionic.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-bond-2',
    lessonId: 'covalent-bonding',
    titleAr: 'محاكاة الرابطة التساهمية',
    titleEn: 'Covalent Bond Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تكوين الرابطة التساهمية',
    descriptionEn: 'Interactive experiment to understand covalent bond formation',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/covalent.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-bond-3',
    lessonId: 'metallic-bonding',
    titleAr: 'محاكاة الرابطة الفلزية',
    titleEn: 'Metallic Bond Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص الروابط الفلزية',
    descriptionEn: 'Interactive experiment to understand metallic bond properties',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/metallic.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-bond-4',
    lessonId: 'intermolecular-forces',
    titleAr: 'محاكاة قوى التجاذب الجزيئية',
    titleEn: 'Intermolecular Forces Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قوى فان دير فالس والروابط الهيدروجينية',
    descriptionEn: 'Interactive experiment to understand Van der Waals forces and hydrogen bonds',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/imf.png',
    isFree: false
  },
  {
    id: 'sim-chemistry-bond-5',
    lessonId: 'covalent-bonding',
    titleAr: 'محاكاة هندسة الجزيئات',
    titleEn: 'Molecular Geometry Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم الأشكال الهندسية للجزيئات (VSEPR)',
    descriptionEn: 'Interactive experiment to understand molecular geometry (VSEPR)',
    type: 'chemistry',
    category: 'visualization',
    thumbnail: '/simulations/geometry-chem.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-bond-6',
    lessonId: 'covalent-bonding',
    titleAr: 'محاكاة قطبية الجزيئات',
    titleEn: 'Molecular Polarity Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم قطبية الجزيئات',
    descriptionEn: 'Interactive experiment to understand molecular polarity',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/polarity.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-nomenclature-1',
    lessonId: 'types-of-reactions',
    titleAr: 'محاكاة تسمية المركبات',
    titleEn: 'Compound Nomenclature Simulation',
    descriptionAr: 'تعلم كيفية تسمية المركبات الأيونية والتساهمية',
    descriptionEn: 'Learn how to name ionic and covalent compounds',
    type: 'chemistry',
    category: 'game',
    thumbnail: '/simulations/nomenclature.png',
    isFree: true
  },

  // ==========================================
  // الكيمياء - التفاعلات الكيميائية (10 محاكي)
  // ==========================================
  {
    id: 'sim-chemistry-reaction-1',
    lessonId: 'types-of-reactions',
    titleAr: 'محاكاة أنواع التفاعلات',
    titleEn: 'Types of Reactions Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم أنواع التفاعلات الكيميائية',
    descriptionEn: 'Interactive experiment to understand types of chemical reactions',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/reactions.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-reaction-2',
    lessonId: 'balancing-equations',
    titleAr: 'محاكاة موازنة المعادلات',
    titleEn: 'Balancing Equations Simulation',
    descriptionAr: 'تجربة تفاعلية لموازنة المعادلات الكيميائية',
    descriptionEn: 'Interactive experiment to balance chemical equations',
    type: 'chemistry',
    category: 'game',
    thumbnail: '/simulations/balance.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-reaction-3',
    lessonId: 'reaction-rate',
    titleAr: 'محاكاة سرعة التفاعل',
    titleEn: 'Reaction Rate Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم العوامل المؤثرة على سرعة التفاعل',
    descriptionEn: 'Interactive experiment to understand factors affecting reaction rate',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/rate.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-reaction-4',
    lessonId: 'reaction-rate',
    titleAr: 'محاكاة طاقة التنشيط',
    titleEn: 'Activation Energy Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم طاقة التنشيط والعوامل الحفازة',
    descriptionEn: 'Interactive experiment to understand activation energy and catalysts',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/activation.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-reaction-5',
    lessonId: 'chemical-equilibrium',
    titleAr: 'محاكاة التوازن الكيميائي',
    titleEn: 'Chemical Equilibrium Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم التوازن الكيميائي ومبدأ لوشاتيليه',
    descriptionEn: 'Interactive experiment to understand chemical equilibrium and Le Chatelier\'s principle',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/equilibrium.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-reaction-6',
    lessonId: 'chemical-equilibrium',
    titleAr: 'محاكاة ثابت التوازن',
    titleEn: 'Equilibrium Constant Simulation',
    descriptionAr: 'حاسبة تفاعلية لحساب ثابت التوازن Kc و Kp',
    descriptionEn: 'Interactive calculator for equilibrium constant Kc and Kp',
    type: 'chemistry',
    category: 'calculator',
    thumbnail: '/simulations/kc.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-solution-1',
    lessonId: 'types-of-reactions',
    titleAr: 'محاكاة المحاليل',
    titleEn: 'Solutions Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم تركيز المحاليل والتخفيف',
    descriptionEn: 'Interactive experiment to understand solution concentration and dilution',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/solutions.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-solution-2',
    lessonId: 'types-of-reactions',
    titleAr: 'محاكاة المولارية',
    titleEn: 'Molarity Simulation',
    descriptionAr: 'حاسبة تفاعلية لحساب المولارية والتخفيف',
    descriptionEn: 'Interactive calculator for molarity and dilution',
    type: 'chemistry',
    category: 'calculator',
    thumbnail: '/simulations/molarity.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-acid-1',
    lessonId: 'types-of-reactions',
    titleAr: 'محاكاة الأحماض والقواعد',
    titleEn: 'Acids and Bases Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص الأحماض والقواعد',
    descriptionEn: 'Interactive experiment to understand acids and bases properties',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/acidbase.png',
    isFree: true
  },
  {
    id: 'sim-chemistry-acid-2',
    lessonId: 'types-of-reactions',
    titleAr: 'محاكاة الرقم الهيدروجيني pH',
    titleEn: 'pH Scale Simulation',
    descriptionAr: 'تجربة تفاعلية لقياس وفهم مقياس pH',
    descriptionEn: 'Interactive experiment to measure and understand pH scale',
    type: 'chemistry',
    category: 'experiment',
    thumbnail: '/simulations/ph.png',
    isFree: true
  },

  // ==========================================
  // الرياضيات - الجبر والمعادلات (15 محاكي)
  // ==========================================
  {
    id: 'sim-math-equations-1',
    lessonId: 'linear-equations',
    titleAr: 'محاكاة المعادلات الخطية',
    titleEn: 'Linear Equations Simulation',
    descriptionAr: 'تجربة تفاعلية لحل المعادلات الخطية',
    descriptionEn: 'Interactive experiment to solve linear equations',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/linear.png',
    isFree: true
  },
  {
    id: 'sim-math-equations-2',
    lessonId: 'linear-equations',
    titleAr: 'راسم الخط المستقيم',
    titleEn: 'Line Graph Plotter',
    descriptionAr: 'أداة تفاعلية لرسم المعادلات الخطية',
    descriptionEn: 'Interactive tool to plot linear equations',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/line.png',
    isFree: true
  },
  {
    id: 'sim-math-equations-3',
    lessonId: 'linear-equations',
    titleAr: 'محاكاة تقاطع المستقيمات',
    titleEn: 'Line Intersection Simulation',
    descriptionAr: 'تجربة تفاعلية لإيجاد نقطة تقاطع خطين',
    descriptionEn: 'Interactive experiment to find intersection point of two lines',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/intersection.png',
    isFree: true
  },
  {
    id: 'sim-math-quadratic-1',
    lessonId: 'quadratic-equations',
    titleAr: 'محاكاة المعادلات التربيعية',
    titleEn: 'Quadratic Equations Simulation',
    descriptionAr: 'تجربة تفاعلية لحل المعادلات التربيعية',
    descriptionEn: 'Interactive experiment to solve quadratic equations',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/quadratic.png',
    isFree: true
  },
  {
    id: 'sim-math-quadratic-2',
    lessonId: 'quadratic-equations',
    titleAr: 'راسم القطع المكافئ',
    titleEn: 'Parabola Graph Plotter',
    descriptionAr: 'أداة تفاعلية لرسم القطوع المكافئة',
    descriptionEn: 'Interactive tool to plot parabolas',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/parabola.png',
    isFree: true
  },
  {
    id: 'sim-math-quadratic-3',
    lessonId: 'quadratic-equations',
    titleAr: 'محاكاة الصيغة العامة',
    titleEn: 'Quadratic Formula Simulation',
    descriptionAr: 'تجربة تفاعلية لتطبيق الصيغة العامة',
    descriptionEn: 'Interactive experiment to apply the quadratic formula',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/formula.png',
    isFree: true
  },
  {
    id: 'sim-math-systems-1',
    lessonId: 'systems-equations',
    titleAr: 'محاكاة أنظمة المعادلات',
    titleEn: 'Systems of Equations Simulation',
    descriptionAr: 'تجربة تفاعلية لحل أنظمة المعادلات الخطية',
    descriptionEn: 'Interactive experiment to solve systems of linear equations',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/systems.png',
    isFree: true
  },
  {
    id: 'sim-math-systems-2',
    lessonId: 'systems-equations',
    titleAr: 'محاكاة طريقة الحذف',
    titleEn: 'Elimination Method Simulation',
    descriptionAr: 'تجربة تفاعلية لحل أنظمة بطريقة الحذف',
    descriptionEn: 'Interactive experiment to solve systems by elimination',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/elimination.png',
    isFree: true
  },
  {
    id: 'sim-math-systems-3',
    lessonId: 'systems-equations',
    titleAr: 'محاكاة طريقة التعويض',
    titleEn: 'Substitution Method Simulation',
    descriptionAr: 'تجربة تفاعلية لحل أنظمة بطريقة التعويض',
    descriptionEn: 'Interactive experiment to solve systems by substitution',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/substitution.png',
    isFree: true
  },
  {
    id: 'sim-math-log-1',
    lessonId: 'logarithms',
    titleAr: 'محاكاة اللوغاريتمات',
    titleEn: 'Logarithms Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم اللوغاريتمات وخواصها',
    descriptionEn: 'Interactive experiment to understand logarithms and their properties',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/log.png',
    isFree: true
  },
  {
    id: 'sim-math-log-2',
    lessonId: 'logarithms',
    titleAr: 'راسم الدوال اللوغاريتمية',
    titleEn: 'Logarithmic Functions Plotter',
    descriptionAr: 'أداة تفاعلية لرسم الدوال اللوغاريتمية والأسية',
    descriptionEn: 'Interactive tool to plot logarithmic and exponential functions',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/loggraph.png',
    isFree: true
  },
  {
    id: 'sim-math-functions-1',
    lessonId: 'linear-equations',
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
    id: 'sim-math-functions-2',
    lessonId: 'linear-equations',
    titleAr: 'محاكاة تحويلات الدوال',
    titleEn: 'Function Transformations Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم انزياح وتمدد الدوال',
    descriptionEn: 'Interactive experiment to understand function shifts and stretches',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/transform.png',
    isFree: true
  },
  {
    id: 'sim-matrices-1',
    lessonId: 'systems-equations',
    titleAr: 'محاكاة المصفوفات',
    titleEn: 'Matrices Simulation',
    descriptionAr: 'تجربة تفاعلية للعمليات على المصفوفات',
    descriptionEn: 'Interactive experiment for matrix operations',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/matrices.png',
    isFree: true
  },
  {
    id: 'sim-matrices-2',
    lessonId: 'systems-equations',
    titleAr: 'حاسبة محدد المصفوفة',
    titleEn: 'Matrix Determinant Calculator',
    descriptionAr: 'حاسبة تفاعلية لحساب محدد المصفوفة',
    descriptionEn: 'Interactive calculator for matrix determinant',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/determinant.png',
    isFree: true
  },

  // ==========================================
  // الرياضيات - الهندسة وعلم المثلثات (15 محاكي)
  // ==========================================
  {
    id: 'sim-math-geometry-1',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة الزوايا',
    titleEn: 'Angles Simulation',
    descriptionAr: 'تجربة تفاعلية لقياس وتصنيف الزوايا',
    descriptionEn: 'Interactive experiment to measure and classify angles',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/angles.png',
    isFree: true
  },
  {
    id: 'sim-math-geometry-2',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة المضلعات',
    titleEn: 'Polygons Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص المضلعات',
    descriptionEn: 'Interactive experiment to understand polygon properties',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/polygons.png',
    isFree: true
  },
  {
    id: 'sim-math-geometry-3',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة الدائرة',
    titleEn: 'Circle Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم خصائص الدائرة',
    descriptionEn: 'Interactive experiment to understand circle properties',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/circle.png',
    isFree: true
  },
  {
    id: 'sim-math-geometry-4',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة المساحة والحجم',
    titleEn: 'Area and Volume Simulation',
    descriptionAr: 'حاسبة تفاعلية للمساحات والأحجام',
    descriptionEn: 'Interactive calculator for areas and volumes',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/area.png',
    isFree: true
  },
  {
    id: 'sim-math-geometry-5',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة فيثاغورس',
    titleEn: 'Pythagorean Theorem Simulation',
    descriptionAr: 'تجربة تفاعلية لإثبات نظرية فيثاغورس',
    descriptionEn: 'Interactive experiment to prove the Pythagorean theorem',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/pythagoras.png',
    isFree: true
  },
  {
    id: 'sim-math-trig-1',
    lessonId: 'trigonometric-functions',
    titleAr: 'محاكاة الدوال المثلثية',
    titleEn: 'Trigonometric Functions Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم sine, cosine, tangent',
    descriptionEn: 'Interactive experiment to understand sine, cosine, tangent',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/trig.png',
    isFree: true
  },
  {
    id: 'sim-math-trig-2',
    lessonId: 'trigonometric-functions',
    titleAr: 'دائرة الوحدة التفاعلية',
    titleEn: 'Interactive Unit Circle',
    descriptionAr: 'أداة تفاعلية لفهم الدوال المثلثية ودائرة الوحدة',
    descriptionEn: 'Interactive tool to understand trigonometric functions and the unit circle',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/unitcircle.png',
    isFree: true
  },
  {
    id: 'sim-math-trig-3',
    lessonId: 'trigonometric-functions',
    titleAr: 'راسم المنحنيات المثلثية',
    titleEn: 'Trigonometric Curves Plotter',
    descriptionAr: 'أداة تفاعلية لرسم منحنيات sine و cosine',
    descriptionEn: 'Interactive tool to plot sine and cosine curves',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/sincurve.png',
    isFree: true
  },
  {
    id: 'sim-math-trig-4',
    lessonId: 'trigonometric-identities',
    titleAr: 'محاكاة المتطابقات المثلثية',
    titleEn: 'Trigonometric Identities Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم المتطابقات المثلثية الأساسية',
    descriptionEn: 'Interactive experiment to understand basic trigonometric identities',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/identities.png',
    isFree: true
  },
  {
    id: 'sim-math-trig-5',
    lessonId: 'sine-cosine-laws',
    titleAr: 'محاكاة قانون الجيب',
    titleEn: 'Law of Sines Simulation',
    descriptionAr: 'تجربة تفاعلية لتطبيق قانون الجيب',
    descriptionEn: 'Interactive experiment to apply the law of sines',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/sinelaw.png',
    isFree: true
  },
  {
    id: 'sim-math-trig-6',
    lessonId: 'sine-cosine-laws',
    titleAr: 'محاكاة قانون جيب التمام',
    titleEn: 'Law of Cosines Simulation',
    descriptionAr: 'تجربة تفاعلية لتطبيق قانون جيب التمام',
    descriptionEn: 'Interactive experiment to apply the law of cosines',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/cosinelaw.png',
    isFree: true
  },
  {
    id: 'sim-math-trig-7',
    lessonId: 'sine-cosine-laws',
    titleAr: 'محاكاة حل المثلثات',
    titleEn: 'Solving Triangles Simulation',
    descriptionAr: 'تجربة تفاعلية لحل المثلثات باستخدام قوانين الجيب وجيب التمام',
    descriptionEn: 'Interactive experiment to solve triangles using sine and cosine laws',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/triangles.png',
    isFree: true
  },
  {
    id: 'sim-math-vectors-1',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة المتجهات',
    titleEn: 'Vectors Simulation',
    descriptionAr: 'تجربة تفاعلية للعمليات على المتجهات',
    descriptionEn: 'Interactive experiment for vector operations',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/vectors.png',
    isFree: true
  },
  {
    id: 'sim-math-vectors-2',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة حاصل الضرب الاتجاهي',
    titleEn: 'Dot Product Simulation',
    descriptionAr: 'تجربة تفاعلية لحساب حاصل الضرب الاتجاهي',
    descriptionEn: 'Interactive experiment to calculate dot product',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/dotproduct.png',
    isFree: true
  },
  {
    id: 'sim-math-vectors-3',
    lessonId: 'angles-measurement',
    titleAr: 'محاكاة حاصل الضرب المتجهي',
    titleEn: 'Cross Product Simulation',
    descriptionAr: 'تجربة تفاعلية لحساب حاصل الضرب المتجهي',
    descriptionEn: 'Interactive experiment to calculate cross product',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/crossproduct.png',
    isFree: true
  },

  // ==========================================
  // الرياضيات - التفاضل والتكامل (10 محاكي)
  // ==========================================
  {
    id: 'sim-math-calculus-1',
    lessonId: 'limits',
    titleAr: 'محاكاة النهايات',
    titleEn: 'Limits Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم مفهوم النهاية',
    descriptionEn: 'Interactive experiment to understand the concept of limits',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/limits.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-2',
    lessonId: 'limits',
    titleAr: 'حاسبة النهايات',
    titleEn: 'Limits Calculator',
    descriptionAr: 'حاسبة تفاعلية لإيجاد نهايات الدوال',
    descriptionEn: 'Interactive calculator to find limits of functions',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/limcalc.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-3',
    lessonId: 'derivatives',
    titleAr: 'محاكاة الاشتقاق',
    titleEn: 'Differentiation Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم مفهوم المشتقة',
    descriptionEn: 'Interactive experiment to understand the concept of derivatives',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/derivative.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-4',
    lessonId: 'derivatives',
    titleAr: 'حاسبة المشتقات',
    titleEn: 'Derivatives Calculator',
    descriptionAr: 'حاسبة تفاعلية لإيجاد مشتقات الدوال',
    descriptionEn: 'Interactive calculator to find derivatives of functions',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/derivcalc.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-5',
    lessonId: 'derivatives-applications',
    titleAr: 'محاكاة معدل التغير',
    titleEn: 'Rate of Change Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم معدل التغير اللحظي',
    descriptionEn: 'Interactive experiment to understand instantaneous rate of change',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/rateofchange.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-6',
    lessonId: 'derivatives-applications',
    titleAr: 'محاكاة القيم العظمى والدنيا',
    titleEn: 'Maxima and Minima Simulation',
    descriptionAr: 'تجربة تفاعلية لإيجاد القيم العظمى والدنيا المحلية',
    descriptionEn: 'Interactive experiment to find local maxima and minima',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/maxmin.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-7',
    lessonId: 'derivatives-applications',
    titleAr: 'محاكاة رسم المنحنيات',
    titleEn: 'Curve Sketching Simulation',
    descriptionAr: 'تجربة تفاعلية لرسم المنحنيات باستخدام الاشتقاق',
    descriptionEn: 'Interactive experiment to sketch curves using differentiation',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/sketching.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-8',
    lessonId: 'integration',
    titleAr: 'محاكاة التكامل',
    titleEn: 'Integration Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم مفهوم التكامل',
    descriptionEn: 'Interactive experiment to understand the concept of integration',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/integral.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-9',
    lessonId: 'integration',
    titleAr: 'حاسبة التكاملات',
    titleEn: 'Integrals Calculator',
    descriptionAr: 'حاسبة تفاعلية لإيجاد تكاملات الدوال',
    descriptionEn: 'Interactive calculator to find integrals of functions',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/intcalc.png',
    isFree: true
  },
  {
    id: 'sim-math-calculus-10',
    lessonId: 'integration',
    titleAr: 'محاكاة المساحة تحت المنحنى',
    titleEn: 'Area Under Curve Simulation',
    descriptionAr: 'تجربة تفاعلية لحساب المساحة تحت المنحنى',
    descriptionEn: 'Interactive experiment to calculate area under the curve',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/areacurve.png',
    isFree: true
  },

  // ==========================================
  // محاكيات عامة وأدوات (5 محاكي)
  // ==========================================
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
  },
  {
    id: 'sim-graphing-tool',
    lessonId: 'any',
    titleAr: 'أداة الرسم البياني',
    titleEn: 'Graphing Tool',
    descriptionAr: 'أداة متقدمة لرسم الدوال والمنحنيات',
    descriptionEn: 'Advanced tool for plotting functions and curves',
    type: 'math',
    category: 'visualization',
    thumbnail: '/simulations/graphing.png',
    isFree: true
  },
  {
    id: 'sim-statistics-1',
    lessonId: 'any',
    titleAr: 'محاكاة الإحصاء',
    titleEn: 'Statistics Simulation',
    descriptionAr: 'تجربة تفاعلية لحساب المتوسط والانحراف المعياري',
    descriptionEn: 'Interactive experiment to calculate mean and standard deviation',
    type: 'math',
    category: 'calculator',
    thumbnail: '/simulations/statistics.png',
    isFree: true
  },
  {
    id: 'sim-probability-1',
    lessonId: 'any',
    titleAr: 'محاكاة الاحتمالات',
    titleEn: 'Probability Simulation',
    descriptionAr: 'تجربة تفاعلية لفهم مفاهيم الاحتمالات',
    descriptionEn: 'Interactive experiment to understand probability concepts',
    type: 'math',
    category: 'experiment',
    thumbnail: '/simulations/probability.png',
    isFree: true
  }
];

// دالة للحصول على المحاكيات المرتبطة بدرس معين
export function getSimulationsByLessonId(lessonId: string): Simulation[] {
  return simulations.filter(
    sim => sim.lessonId === lessonId || sim.lessonId === 'any'
  );
}

// دالة للحصول على المحاكيات حسب المادة ورقم الوحدة
export function getSimulationsBySubjectAndUnit(subjectName: string, unitOrder: number): Simulation[] {
  // خريطة ربط المواد بأنواع المحاكيات
  const subjectTypeMap: Record<string, string[]> = {
    'الفيزياء': ['physics'],
    'Physics': ['physics'],
    'الكيمياء': ['chemistry'],
    'Chemistry': ['chemistry'],
    'الرياضيات': ['math'],
    'الرياضيات (1)': ['math'],
    'الرياضيات (2)': ['math'],
    'Mathematics': ['math'],
    'الأحياء': ['biology'],
    'Biology': ['biology'],
    'الجغرافيا': ['geography'],
    'Geography': ['geography'],
  };

  const types = subjectTypeMap[subjectName] || [];
  
  // فلترة المحاكيات حسب النوع
  let filtered = simulations.filter(sim => types.includes(sim.type));
  
  // ترتيب المحاكيات حسب الوحدة (كل وحدة ليها محاكيات معينة)
  // الوحدة 1: المحاكيات الأولى، الوحدة 2: المحاكيات التالية، إلخ
  const simsPerUnit = 5; // عدد المحاكيات لكل وحدة
  const startIdx = Math.min((unitOrder - 1) * simsPerUnit, filtered.length - simsPerUnit);
  const endIdx = Math.min(startIdx + simsPerUnit, filtered.length);
  
  if (startIdx >= 0 && filtered.length > 0) {
    return filtered.slice(Math.max(0, startIdx), endIdx);
  }
  
  return filtered.slice(0, simsPerUnit);
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

// دالة للحصول على محاكي بالـ ID
export function getSimulationById(id: string): Simulation | undefined {
  return simulations.find(sim => sim.id === id);
}

// إحصائيات المحاكيات
export function getSimulationsStats() {
  return {
    total: simulations.length,
    physics: simulations.filter(s => s.type === 'physics').length,
    chemistry: simulations.filter(s => s.type === 'chemistry').length,
    math: simulations.filter(s => s.type === 'math').length,
    biology: simulations.filter(s => s.type === 'biology').length,
    free: simulations.filter(s => s.isFree).length
  };
}

// ==========================================
// نظام الربط الذكي للمحاكيات بالدروس
// ==========================================

/**
 * خريطة ربط المحاكيات بالمادات
 * تربط اسم المادة (بالعربية) بقائمة معرفات المحاكيات المناسبة
 */
export const subjectSimulationMap: Record<string, string[]> = {
  'الفيزياء': [
    // الميكانيكا
    'sim-physics-motion-1', 'sim-physics-motion-2', 'sim-physics-motion-3', 'sim-physics-motion-4',
    'sim-physics-freefall-1', 'sim-physics-freefall-2',
    'sim-physics-forces-1', 'sim-physics-forces-2',
    'sim-physics-newton-1', 'sim-physics-newton-2', 'sim-physics-newton-3', 'sim-physics-newton-4',
    'sim-physics-projectile-1', 'sim-physics-projectile-2',
    'sim-physics-energy-1', 'sim-physics-energy-2', 'sim-physics-energy-3', 'sim-physics-energy-4',
    'sim-physics-momentum-1', 'sim-physics-momentum-2',
    'sim-physics-work-1', 'sim-physics-circular-1',
    'sim-physics-gravity-1', 'sim-physics-satellite-1',
    // الموجات
    'sim-physics-wave-1', 'sim-physics-wave-2', 'sim-physics-wave-3', 'sim-physics-wave-4', 'sim-physics-wave-5',
    'sim-physics-sound-1', 'sim-physics-sound-2', 'sim-physics-sound-3', 'sim-physics-sound-4',
    'sim-physics-light-1', 'sim-physics-light-2', 'sim-physics-light-3', 'sim-physics-light-4', 'sim-physics-light-5',
    'sim-physics-optics-1',
    // الكهرباء والمغناطيسية
    'sim-physics-electricity-1', 'sim-physics-electricity-2', 'sim-physics-electricity-3',
    'sim-physics-circuit-1', 'sim-physics-circuit-2', 'sim-physics-circuit-3', 'sim-physics-circuit-4', 'sim-physics-circuit-5',
    'sim-physics-magnetism-1', 'sim-physics-magnetism-2',
    'sim-physics-electromagnetism-1', 'sim-physics-electromagnetism-2', 'sim-physics-electromagnetism-3', 
    'sim-physics-electromagnetism-4', 'sim-physics-electromagnetism-5',
    'sim-physics-thermodynamics-1'
  ],
  'Physics': [
    // نفس محاكيات الفيزياء بالإنجليزية
    'sim-physics-motion-1', 'sim-physics-motion-2', 'sim-physics-motion-3', 'sim-physics-motion-4',
    'sim-physics-freefall-1', 'sim-physics-freefall-2',
    'sim-physics-forces-1', 'sim-physics-forces-2',
    'sim-physics-newton-1', 'sim-physics-newton-2', 'sim-physics-newton-3', 'sim-physics-newton-4',
    'sim-physics-projectile-1', 'sim-physics-projectile-2',
    'sim-physics-energy-1', 'sim-physics-energy-2', 'sim-physics-energy-3', 'sim-physics-energy-4',
    'sim-physics-momentum-1', 'sim-physics-momentum-2',
    'sim-physics-work-1', 'sim-physics-circular-1',
    'sim-physics-gravity-1', 'sim-physics-satellite-1',
    'sim-physics-wave-1', 'sim-physics-wave-2', 'sim-physics-wave-3', 'sim-physics-wave-4', 'sim-physics-wave-5',
    'sim-physics-sound-1', 'sim-physics-sound-2', 'sim-physics-sound-3', 'sim-physics-sound-4',
    'sim-physics-light-1', 'sim-physics-light-2', 'sim-physics-light-3', 'sim-physics-light-4', 'sim-physics-light-5',
    'sim-physics-optics-1',
    'sim-physics-electricity-1', 'sim-physics-electricity-2', 'sim-physics-electricity-3',
    'sim-physics-circuit-1', 'sim-physics-circuit-2', 'sim-physics-circuit-3', 'sim-physics-circuit-4', 'sim-physics-circuit-5',
    'sim-physics-magnetism-1', 'sim-physics-magnetism-2',
    'sim-physics-electromagnetism-1', 'sim-physics-electromagnetism-2', 'sim-physics-electromagnetism-3', 
    'sim-physics-electromagnetism-4', 'sim-physics-electromagnetism-5',
    'sim-physics-thermodynamics-1'
  ],
  'الكيمياء': [
    // البنية الذرية
    'sim-chemistry-atom-1', 'sim-chemistry-atom-2', 'sim-chemistry-atom-3', 'sim-chemistry-atom-4',
    'sim-chemistry-periodic-1', 'sim-chemistry-periodic-2', 'sim-chemistry-periodic-3', 'sim-chemistry-periodic-4',
    // الروابط الكيميائية
    'sim-chemistry-bond-1', 'sim-chemistry-bond-2', 'sim-chemistry-bond-3', 'sim-chemistry-bond-4', 
    'sim-chemistry-bond-5', 'sim-chemistry-bond-6',
    // التفاعلات الكيميائية
    'sim-chemistry-nomenclature-1',
    'sim-chemistry-reaction-1', 'sim-chemistry-reaction-2', 'sim-chemistry-reaction-3', 'sim-chemistry-reaction-4',
    'sim-chemistry-reaction-5', 'sim-chemistry-reaction-6',
    'sim-chemistry-solution-1', 'sim-chemistry-solution-2',
    'sim-chemistry-acid-1', 'sim-chemistry-acid-2'
  ],
  'Chemistry': [
    // نفس محاكيات الكيمياء بالإنجليزية
    'sim-chemistry-atom-1', 'sim-chemistry-atom-2', 'sim-chemistry-atom-3', 'sim-chemistry-atom-4',
    'sim-chemistry-periodic-1', 'sim-chemistry-periodic-2', 'sim-chemistry-periodic-3', 'sim-chemistry-periodic-4',
    'sim-chemistry-bond-1', 'sim-chemistry-bond-2', 'sim-chemistry-bond-3', 'sim-chemistry-bond-4', 
    'sim-chemistry-bond-5', 'sim-chemistry-bond-6',
    'sim-chemistry-nomenclature-1',
    'sim-chemistry-reaction-1', 'sim-chemistry-reaction-2', 'sim-chemistry-reaction-3', 'sim-chemistry-reaction-4',
    'sim-chemistry-reaction-5', 'sim-chemistry-reaction-6',
    'sim-chemistry-solution-1', 'sim-chemistry-solution-2',
    'sim-chemistry-acid-1', 'sim-chemistry-acid-2'
  ],
  'الرياضيات': [
    // الجبر والمعادلات
    'sim-math-equations-1', 'sim-math-equations-2', 'sim-math-equations-3',
    'sim-math-quadratic-1', 'sim-math-quadratic-2', 'sim-math-quadratic-3',
    'sim-math-systems-1', 'sim-math-systems-2', 'sim-math-systems-3',
    'sim-math-log-1', 'sim-math-log-2',
    'sim-math-functions-1', 'sim-math-functions-2',
    'sim-matrices-1', 'sim-matrices-2',
    // الهندسة وعلم المثلثات
    'sim-math-geometry-1', 'sim-math-geometry-2', 'sim-math-geometry-3', 'sim-math-geometry-4', 'sim-math-geometry-5',
    'sim-math-trig-1', 'sim-math-trig-2', 'sim-math-trig-3', 'sim-math-trig-4', 'sim-math-trig-5', 
    'sim-math-trig-6', 'sim-math-trig-7',
    'sim-math-vectors-1', 'sim-math-vectors-2', 'sim-math-vectors-3',
    // التفاضل والتكامل
    'sim-math-calculus-1', 'sim-math-calculus-2', 'sim-math-calculus-3', 'sim-math-calculus-4',
    'sim-math-calculus-5', 'sim-math-calculus-6', 'sim-math-calculus-7', 'sim-math-calculus-8',
    'sim-math-calculus-9', 'sim-math-calculus-10',
    // أدوات عامة
    'sim-calc-scientific', 'sim-graphing-tool', 'sim-statistics-1', 'sim-probability-1'
  ],
  'Mathematics': [
    // نفس محاكيات الرياضيات بالإنجليزية
    'sim-math-equations-1', 'sim-math-equations-2', 'sim-math-equations-3',
    'sim-math-quadratic-1', 'sim-math-quadratic-2', 'sim-math-quadratic-3',
    'sim-math-systems-1', 'sim-math-systems-2', 'sim-math-systems-3',
    'sim-math-log-1', 'sim-math-log-2',
    'sim-math-functions-1', 'sim-math-functions-2',
    'sim-matrices-1', 'sim-matrices-2',
    'sim-math-geometry-1', 'sim-math-geometry-2', 'sim-math-geometry-3', 'sim-math-geometry-4', 'sim-math-geometry-5',
    'sim-math-trig-1', 'sim-math-trig-2', 'sim-math-trig-3', 'sim-math-trig-4', 'sim-math-trig-5', 
    'sim-math-trig-6', 'sim-math-trig-7',
    'sim-math-vectors-1', 'sim-math-vectors-2', 'sim-math-vectors-3',
    'sim-math-calculus-1', 'sim-math-calculus-2', 'sim-math-calculus-3', 'sim-math-calculus-4',
    'sim-math-calculus-5', 'sim-math-calculus-6', 'sim-math-calculus-7', 'sim-math-calculus-8',
    'sim-math-calculus-9', 'sim-math-calculus-10',
    'sim-calc-scientific', 'sim-graphing-tool', 'sim-statistics-1', 'sim-probability-1'
  ],
  'الرياضيات (1)': [
    'sim-math-equations-1', 'sim-math-equations-2', 'sim-math-equations-3',
    'sim-math-quadratic-1', 'sim-math-quadratic-2', 'sim-math-quadratic-3',
    'sim-math-systems-1', 'sim-math-systems-2', 'sim-math-systems-3',
    'sim-math-geometry-1', 'sim-math-geometry-2', 'sim-math-geometry-3', 'sim-math-geometry-4', 'sim-math-geometry-5',
    'sim-math-trig-1', 'sim-math-trig-2', 'sim-math-trig-3',
    'sim-calc-scientific', 'sim-graphing-tool'
  ],
  'الرياضيات (2)': [
    'sim-math-log-1', 'sim-math-log-2',
    'sim-math-functions-1', 'sim-math-functions-2',
    'sim-matrices-1', 'sim-matrices-2',
    'sim-math-trig-4', 'sim-math-trig-5', 'sim-math-trig-6', 'sim-math-trig-7',
    'sim-math-vectors-1', 'sim-math-vectors-2', 'sim-math-vectors-3',
    'sim-math-calculus-1', 'sim-math-calculus-2', 'sim-math-calculus-3', 'sim-math-calculus-4',
    'sim-math-calculus-5', 'sim-math-calculus-6', 'sim-math-calculus-7', 'sim-math-calculus-8',
    'sim-math-calculus-9', 'sim-math-calculus-10',
    'sim-calc-scientific', 'sim-graphing-tool'
  ],
  'الأحياء': [],
  'Biology': [],
  'الجغرافيا': [],
  'Geography': []
};

/**
 * خريطة الكلمات المفتاحية لربط المحاكيات بالدروس
 * تربط اسم الوحدة أو موضوع الدرس بكلمات مفتاحية للمطابقة مع المحاكيات
 */
export const lessonKeywordMap: Record<string, string[]> = {
  // الفيزياء - الميكانيكا
  'الميكانيكا': ['motion', 'velocity', 'acceleration', 'forces', 'newton', 'momentum', 'energy', 'projectile', 'freefall', 'gravity', 'circular'],
  'الحركة على خط مستقيم': ['motion', 'velocity', 'acceleration', 'graphs', 'equations'],
  'قوانين نيوتن للحركة': ['newton', 'forces', 'friction', 'inertia'],
  
  // الفيزياء - الكهربية
  'الكهربية': ['electricity', 'circuit', 'current', 'voltage', 'resistance', 'ohm', 'power'],
  'التيار الكهربي وقانون أوم': ['circuit', 'ohm', 'current', 'voltage', 'resistance'],
  'ربط المقاومات على التوالي والتوازي': ['circuit', 'resistors', 'series', 'parallel'],
  'القدرة الكهربائية والطاقة الكهربية': ['power', 'electricity', 'energy'],
  
  // الفيزياء - المغناطيسية
  'المغناطيسية': ['magnetism', 'magnetic', 'field', 'electromagnet'],
  'المجال المغناطيسي والقوة المغناطيسية': ['magnetism', 'magnetic', 'field'],
  'القوة المغناطيسية على سلك يمر به تيار': ['magnetism', 'electromagnet', 'induction'],
  'الحث الكهرومغناطيسي': ['electromagnet', 'induction', 'transformer', 'motor'],
  'المولدات والمحولات': ['transformer', 'motor', 'induction', 'electromagnet'],
  
  // الفيزياء - الموجات
  'الموجات': ['wave', 'sound', 'interference', 'reflection', 'standing'],
  'خواص الموجات': ['wave', 'frequency', 'amplitude', 'wavelength'],
  'ظواهر الموجات': ['wave', 'interference', 'reflection', 'doppler'],
  
  // الفيزياء - البصريات
  'البصريات': ['light', 'lenses', 'mirrors', 'reflection', 'refraction', 'diffraction'],
  'الانعكاس والمرايا': ['light', 'reflection', 'mirrors'],
  'الانكسار والعدسات': ['light', 'refraction', 'lenses'],
  'الظواهر الضوئية والأجهزة البصرية': ['light', 'diffraction', 'doubleslit', 'optics'],
  
  // الكيمياء - البنية الذرية
  'البنية الذرية': ['atom', 'atomic', 'electron', 'orbital', 'nucleus'],
  'التركيب الإلكتروني للذرة': ['electron', 'orbital', 'configuration'],
  'الجدول الدوري الحديث': ['periodic', 'trends', 'electronegativity', 'groups'],
  
  // الكيمياء - الروابط
  'الروابط الكيميائية': ['bond', 'ionic', 'covalent', 'metallic', 'molecular'],
  'الرابطة الأيونية': ['ionic', 'bond'],
  'الرابطة التساهمية': ['covalent', 'bond', 'molecular', 'geometry', 'polarity'],
  'الرابطة الفلزية': ['metallic', 'bond'],
  'قوى فان دير فالس والروابط الهيدروجينية': ['intermolecular', 'hydrogen', 'imf'],
  
  // الكيمياء - التفاعلات
  'التفاعلات الكيميائية': ['reaction', 'equilibrium', 'rate', 'activation'],
  'أنواع التفاعلات الكيميائية': ['reaction', 'types', 'nomenclature'],
  'سرعة التفاعل الكيميائي': ['rate', 'activation', 'reaction'],
  
  // الكيمياء العضوية
  'الكيمياء العضوية': [],
  'الهيدروكربونات المشبعة (الألكانات)': [],
  'الهيدروكربونات غير المشبعة': [],
  'الكحولات والإيثيرات': [],
  'الأحماض الكربوكسيلية والإسترات': [],
  
  // الرياضيات - الجبر
  'الجبر': ['equations', 'linear', 'quadratic', 'systems', 'functions', 'matrices'],
  
  // الرياضيات - الهندسة
  'الهندسة': ['geometry', 'angles', 'polygons', 'circle', 'pythagoras', 'vectors'],
  
  // الرياضيات - التفاضل
  'التفاضل': ['derivative', 'limits', 'calculus', 'rate', 'maxima', 'minima'],
  
  // الرياضيات - التكامل
  'التكامل': ['integral', 'calculus', 'area', 'curve'],
  
  // الرياضيات - الاحتمالات
  'الاحتمالات': ['probability', 'statistics'],
  
  // الأحياء - الخلية
  'الخلية': [],
  'تركيب الخلية النباتية والحيوانية': [],
  'الانقسام الخلوي': [],
  'الأيض الخلوي': [],
  
  // الأحياء - الوراثة
  'الوراثة': [],
  'قوانين مندل للوراثة': [],
  'الوراثة غير المندلية': [],
  'DNA والتركيب الوراثي': [],
  'الطفرات والهندسة الوراثية': [],
  
  // الأحياء - الأنظمة الحيوية
  'الأنظمة الحيوية': [],
  'الجهاز الهضمي والدوري': [],
  'الجهاز التنفسي والعصبي': [],
  
  // الأحياء - البيئة
  'البيئة': [],
  'النظام البيئي والسلاسل الغذائية': [],
  'التوازن البيئي والتنوع الحيوي': []
};

/**
 * خريطة ربط الوحدات بالمحاكيات المحددة
 * تربط اسم الوحدة مباشرة بمعرفات المحاكيات المناسبة
 */
export const unitSimulationMap: Record<string, string[]> = {
  // فيزياء - الميكانيكا
  'الميكانيكا': [
    'sim-physics-motion-1', 'sim-physics-motion-2', 'sim-physics-motion-3', 'sim-physics-motion-4',
    'sim-physics-freefall-1', 'sim-physics-freefall-2',
    'sim-physics-forces-1', 'sim-physics-forces-2',
    'sim-physics-newton-1', 'sim-physics-newton-2', 'sim-physics-newton-3', 'sim-physics-newton-4',
    'sim-physics-projectile-1', 'sim-physics-projectile-2',
    'sim-physics-energy-1', 'sim-physics-energy-2', 'sim-physics-energy-3', 'sim-physics-energy-4',
    'sim-physics-momentum-1', 'sim-physics-momentum-2',
    'sim-physics-work-1', 'sim-physics-circular-1',
    'sim-physics-gravity-1', 'sim-physics-satellite-1'
  ],
  // فيزياء - الموجات
  'الموجات': [
    'sim-physics-wave-1', 'sim-physics-wave-2', 'sim-physics-wave-3', 'sim-physics-wave-4', 'sim-physics-wave-5',
    'sim-physics-sound-1', 'sim-physics-sound-2', 'sim-physics-sound-3', 'sim-physics-sound-4'
  ],
  // فيزياء - الكهربية
  'الكهربية': [
    'sim-physics-electricity-1', 'sim-physics-electricity-2', 'sim-physics-electricity-3',
    'sim-physics-circuit-1', 'sim-physics-circuit-2', 'sim-physics-circuit-3', 'sim-physics-circuit-4', 'sim-physics-circuit-5'
  ],
  // فيزياء - المغناطيسية
  'المغناطيسية': [
    'sim-physics-magnetism-1', 'sim-physics-magnetism-2',
    'sim-physics-electromagnetism-1', 'sim-physics-electromagnetism-2', 'sim-physics-electromagnetism-3',
    'sim-physics-electromagnetism-4', 'sim-physics-electromagnetism-5'
  ],
  // فيزياء - البصريات
  'البصريات': [
    'sim-physics-light-1', 'sim-physics-light-2', 'sim-physics-light-3', 'sim-physics-light-4', 'sim-physics-light-5',
    'sim-physics-optics-1'
  ],
  // كيمياء - البنية الذرية
  'البنية الذرية': [
    'sim-chemistry-atom-1', 'sim-chemistry-atom-2', 'sim-chemistry-atom-3', 'sim-chemistry-atom-4',
    'sim-chemistry-periodic-1', 'sim-chemistry-periodic-2', 'sim-chemistry-periodic-3', 'sim-chemistry-periodic-4'
  ],
  // كيمياء - الروابط الكيميائية
  'الروابط الكيميائية': [
    'sim-chemistry-bond-1', 'sim-chemistry-bond-2', 'sim-chemistry-bond-3', 'sim-chemistry-bond-4',
    'sim-chemistry-bond-5', 'sim-chemistry-bond-6'
  ],
  // كيمياء - التفاعلات الكيميائية
  'التفاعلات الكيميائية': [
    'sim-chemistry-nomenclature-1',
    'sim-chemistry-reaction-1', 'sim-chemistry-reaction-2', 'sim-chemistry-reaction-3', 'sim-chemistry-reaction-4',
    'sim-chemistry-reaction-5', 'sim-chemistry-reaction-6',
    'sim-chemistry-solution-1', 'sim-chemistry-solution-2',
    'sim-chemistry-acid-1', 'sim-chemistry-acid-2'
  ],
  // كيمياء - الكيمياء العضوية
  'الكيمياء العضوية': [],
  // رياضيات - الجبر
  'الجبر': [
    'sim-math-equations-1', 'sim-math-equations-2', 'sim-math-equations-3',
    'sim-math-quadratic-1', 'sim-math-quadratic-2', 'sim-math-quadratic-3',
    'sim-math-systems-1', 'sim-math-systems-2', 'sim-math-systems-3',
    'sim-math-log-1', 'sim-math-log-2',
    'sim-math-functions-1', 'sim-math-functions-2',
    'sim-matrices-1', 'sim-matrices-2'
  ],
  // رياضيات - الهندسة
  'الهندسة': [
    'sim-math-geometry-1', 'sim-math-geometry-2', 'sim-math-geometry-3', 'sim-math-geometry-4', 'sim-math-geometry-5',
    'sim-math-trig-1', 'sim-math-trig-2', 'sim-math-trig-3', 'sim-math-trig-4', 'sim-math-trig-5',
    'sim-math-trig-6', 'sim-math-trig-7',
    'sim-math-vectors-1', 'sim-math-vectors-2', 'sim-math-vectors-3'
  ],
  // رياضيات - التفاضل
  'التفاضل': [
    'sim-math-calculus-1', 'sim-math-calculus-2', 'sim-math-calculus-3', 'sim-math-calculus-4',
    'sim-math-calculus-5', 'sim-math-calculus-6', 'sim-math-calculus-7'
  ],
  // رياضيات - التكامل
  'التكامل': [
    'sim-math-calculus-8', 'sim-math-calculus-9', 'sim-math-calculus-10'
  ],
  // رياضيات - الاحتمالات
  'الاحتمالات': [
    'sim-statistics-1', 'sim-probability-1'
  ],
  // أحياء - الخلية
  'الخلية': [],
  // أحياء - الوراثة
  'الوراثة': [],
  // أحياء - الأنظمة الحيوية
  'الأنظمة الحيوية': [],
  // أحياء - البيئة
  'البيئة': []
};

/**
 * دالة للحصول على المحاكيات المناسبة للمادة
 * @param subjectName اسم المادة (بالعربية أو الإنجليزية)
 * @returns قائمة المحاكيات المناسبة للمادة
 */
export function getSimulationsForSubject(subjectName: string): Simulation[] {
  const simIds = subjectSimulationMap[subjectName] || [];
  
  if (simIds.length === 0) {
    // إذا لم يتم العثور على محاكيات محددة، نرجع المحاكيات حسب النوع
    return getSimulationsBySubject(subjectName);
  }
  
  // نرجع المحاكيات بالترتيب المحدد
  return simIds
    .map(id => simulations.find(sim => sim.id === id))
    .filter((sim): sim is Simulation => sim !== undefined);
}

/**
 * دالة للحصول على المحاكيات المناسبة لدرس معين
 * @param lessonId معرف الدرس
 * @param lessonTitle عنوان الدرس
 * @param subjectName اسم المادة
 * @param unitName اسم الوحدة (اختياري)
 * @returns قائمة المحاكيات المناسبة للدرس
 */
export function getSimulationsForLesson(
  lessonId: string, 
  lessonTitle: string, 
  subjectName: string,
  unitName?: string
): Simulation[] {
  // 1. محاولة الحصول على المحاكيات من الربط المباشر بالـ lessonId
  const directSimulations = getSimulationsByLessonId(lessonId);
  if (directSimulations.length > 0 && directSimulations.some(s => s.lessonId !== 'any')) {
    return directSimulations.filter(s => s.lessonId !== 'any');
  }
  
  // 2. محاولة الحصول على المحاكيات من خريطة الوحدات
  if (unitName && unitSimulationMap[unitName] && unitSimulationMap[unitName].length > 0) {
    const unitSimIds = unitSimulationMap[unitName];
    return unitSimIds
      .map(id => simulations.find(sim => sim.id === id))
      .filter((sim): sim is Simulation => sim !== undefined)
      .slice(0, 6); // نرجع أول 6 محاكيات للوحدة
  }
  
  // 3. البحث بالكلمات المفتاحية في عنوان الدرس
  const keywords = lessonKeywordMap[lessonTitle] || lessonKeywordMap[unitName || ''] || [];
  
  if (keywords.length > 0) {
    // الحصول على محاكيات المادة
    const subjectSimulations = getSimulationsForSubject(subjectName);
    
    // فلترة المحاكيات التي تحتوي على كلمات مفتاحية مطابقة
    const matchedSimulations = subjectSimulations.filter(sim => {
      const simText = `${sim.id} ${sim.titleAr} ${sim.titleEn} ${sim.descriptionAr} ${sim.descriptionEn}`.toLowerCase();
      return keywords.some(keyword => simText.includes(keyword.toLowerCase()));
    });
    
    if (matchedSimulations.length > 0) {
      return matchedSimulations.slice(0, 6);
    }
  }
  
  // 4. البحث في نص عنوان الدرس للكلمات المفتاحية
  const titleLower = lessonTitle.toLowerCase();
  const subjectSimulations = getSimulationsForSubject(subjectName);
  
  // قاموس الكلمات المفتاحية العربية للمطابقة
  const arabicKeywords: Record<string, string[]> = {
    'حركة': ['motion', 'حركة'],
    'سرعة': ['velocity', 'سرعة'],
    'تسارع': ['acceleration', 'تسارع'],
    'قوة': ['forces', 'قوة'],
    'نيوتن': ['newton', 'نيوتن'],
    'طاقة': ['energy', 'طاقة'],
    'زخم': ['momentum', 'زخم'],
    'موجة': ['wave', 'موجة'],
    'صوت': ['sound', 'صوت'],
    'ضوء': ['light', 'ضوء'],
    'كهرب': ['electricity', 'circuit', 'كهرب'],
    'مغناط': ['magnet', 'مغناط'],
    'ذرة': ['atom', 'ذرة'],
    'إلكترون': ['electron', 'إلكترون'],
    'جدول دوري': ['periodic', 'جدول'],
    'رابطة': ['bond', 'رابطة'],
    'تفاعل': ['reaction', 'تفاعل'],
    'معادلة': ['equations', 'معادلة'],
    'دالة': ['functions', 'دالة'],
    'هندسة': ['geometry', 'هندسة'],
    'مثلث': ['trig', 'مثلث'],
    'تفاضل': ['derivative', 'calculus', 'تفاضل'],
    'تكامل': ['integral', 'تكامل'],
    'احتمال': ['probability', 'احتمال']
  };
  
  // البحث عن كلمات مفتاحية مطابقة في عنوان الدرس
  const matchedKeywords: string[] = [];
  for (const [key, values] of Object.entries(arabicKeywords)) {
    if (titleLower.includes(key)) {
      matchedKeywords.push(...values);
    }
  }
  
  if (matchedKeywords.length > 0) {
    const matched = subjectSimulations.filter(sim => {
      const simText = `${sim.id} ${sim.titleAr} ${sim.titleEn}`.toLowerCase();
      return matchedKeywords.some(kw => simText.includes(kw.toLowerCase()));
    });
    
    if (matched.length > 0) {
      return matched.slice(0, 6);
    }
  }
  
  // 5. إرجاع المحاكيات العامة للمادة كحل أخير
  return subjectSimulations.slice(0, 6);
}

/**
 * دالة للحصول على المحاكيات المناسبة لوحدة معينة
 * @param unitName اسم الوحدة
 * @param subjectName اسم المادة
 * @returns قائمة المحاكيات المناسبة للوحدة
 */
export function getSimulationsForUnit(unitName: string, subjectName: string): Simulation[] {
  // محاولة الحصول من خريطة الوحدات
  if (unitSimulationMap[unitName] && unitSimulationMap[unitName].length > 0) {
    return unitSimulationMap[unitName]
      .map(id => simulations.find(sim => sim.id === id))
      .filter((sim): sim is Simulation => sim !== undefined);
  }
  
  // استخدام الكلمات المفتاحية
  const keywords = lessonKeywordMap[unitName] || [];
  const subjectSimulations = getSimulationsForSubject(subjectName);
  
  if (keywords.length > 0) {
    return subjectSimulations
      .filter(sim => {
        const simText = `${sim.id} ${sim.titleAr} ${sim.titleEn} ${sim.descriptionAr} ${sim.descriptionEn}`.toLowerCase();
        return keywords.some(keyword => simText.includes(keyword.toLowerCase()));
      })
      .slice(0, 8);
  }
  
  // إرجاع المحاكيات العامة للمادة
  return subjectSimulations.slice(0, 8);
}

/**
 * دالة للحصول على المحاكيات ذات الصلة بموضوع معين
 * @param topic الموضوع أو الكلمة المفتاحية
 * @param subjectName اسم المادة (اختياري)
 * @returns قائمة المحاكيات ذات الصلة
 */
export function getRelatedSimulations(topic: string, subjectName?: string): Simulation[] {
  const topicLower = topic.toLowerCase();
  
  let baseSimulations = subjectName ? getSimulationsForSubject(subjectName) : simulations;
  
  return baseSimulations.filter(sim => {
    const simText = `${sim.id} ${sim.titleAr} ${sim.titleEn} ${sim.descriptionAr} ${sim.descriptionEn}`.toLowerCase();
    return simText.includes(topicLower);
  });
}

/**
 * دالة للحصول على المحاكيات المميزة (المجانية والمهمة)
 * @param subjectName اسم المادة (اختياري)
 * @param limit الحد الأقصى للعدد
 * @returns قائمة المحاكيات المميزة
 */
export function getFeaturedSimulations(subjectName?: string, limit: number = 6): Simulation[] {
  let baseSimulations = subjectName ? getSimulationsForSubject(subjectName) : simulations;
  
  // نرجع المحاكيات المجانية والمهمة
  return baseSimulations
    .filter(sim => sim.isFree)
    .slice(0, limit);
}

/**
 * دالة للبحث في المحاكيات
 * @param query نص البحث
 * @param filters معايير التصفية (اختياري)
 * @returns قائمة المحاكيات المطابقة
 */
export function searchSimulations(
  query: string, 
  filters?: {
    subject?: string;
    category?: 'experiment' | 'calculator' | 'visualization' | 'game';
    isFree?: boolean;
  }
): Simulation[] {
  const queryLower = query.toLowerCase();
  
  let results = simulations.filter(sim => {
    const searchText = `${sim.id} ${sim.titleAr} ${sim.titleEn} ${sim.descriptionAr} ${sim.descriptionEn}`.toLowerCase();
    return searchText.includes(queryLower);
  });
  
  // تطبيق معايير التصفية
  if (filters) {
    if (filters.subject) {
      const subjectTypes = subjectSimulationMap[filters.subject] || [];
      results = results.filter(sim => subjectTypes.includes(sim.id));
    }
    
    if (filters.category) {
      results = results.filter(sim => sim.category === filters.category);
    }
    
    if (filters.isFree !== undefined) {
      results = results.filter(sim => sim.isFree === filters.isFree);
    }
  }
  
  return results;
}
