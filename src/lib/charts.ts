// المخططات البيانية التعليمية - 25 مخطط
export interface ChartData {
  labels: string[];
  labelsAr: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  labelAr: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
}

export interface EducationalChart {
  id: string;
  lessonId: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar';
  subject: 'physics' | 'chemistry' | 'math';
  data: ChartData;
  xAxisLabel?: string;
  xAxisLabelAr?: string;
  yAxisLabel?: string;
  yAxisLabelAr?: string;
  formulas?: { ar: string; en: string }[];
  insights?: { ar: string; en: string }[];
}

export const educationalCharts: EducationalChart[] = [
  // ==========================================
  // مخططات الفيزياء (10 مخططات)
  // ==========================================
  {
    id: 'chart-speed-comparison',
    lessonId: 'motion-intro',
    titleAr: 'مقارنة سرعات الحيوانات',
    titleEn: 'Animal Speeds Comparison',
    descriptionAr: 'مقارنة بين سرعات مختلف الحيوانات بالكيلومتر/ساعة',
    descriptionEn: 'Comparison of different animal speeds in km/h',
    type: 'bar',
    subject: 'physics',
    data: {
      labels: ['Cheetah', 'Lion', 'Horse', 'Dog', 'Human', 'Elephant'],
      labelsAr: ['الفهد', 'الأسد', 'الحصان', 'الكلب', 'الإنسان', 'الفيل'],
      datasets: [{
        label: 'Speed (km/h)',
        labelAr: 'السرعة (كم/س)',
        data: [120, 80, 70, 50, 45, 40],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
      }]
    },
    xAxisLabel: 'Animals',
    xAxisLabelAr: 'الحيوانات',
    yAxisLabel: 'Speed (km/h)',
    yAxisLabelAr: 'السرعة (كم/س)',
    insights: [
      { ar: 'الفهد هو أسرع حيوان بري', en: 'Cheetah is the fastest land animal' },
      { ar: 'السرعة تعتمد على بنية الجسم', en: 'Speed depends on body structure' }
    ]
  },
  {
    id: 'chart-gravity-planets',
    lessonId: 'free-fall',
    titleAr: 'تسارع الجاذبية على الكواكب',
    titleEn: 'Gravitational Acceleration on Planets',
    descriptionAr: 'مقارنة تسارع الجاذبية (m/s²) على كواكب المجموعة الشمسية',
    descriptionEn: 'Comparison of gravitational acceleration (m/s²) on solar system planets',
    type: 'bar',
    subject: 'physics',
    data: {
      labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      labelsAr: ['عطارد', 'الزهرة', 'الأرض', 'المريخ', 'المشتري', 'زحل', 'أورانوس', 'نبتون'],
      datasets: [{
        label: 'g (m/s²)',
        labelAr: 'تسارع الجاذبية (م/ث²)',
        data: [3.7, 8.87, 9.8, 3.71, 24.79, 10.44, 8.69, 11.15],
        backgroundColor: '#8b5cf6'
      }]
    },
    yAxisLabel: 'g (m/s²)',
    yAxisLabelAr: 'تسارع الجاذبية (م/ث²)',
    formulas: [{ ar: 'g = GM/r²', en: 'g = GM/r²' }],
    insights: [
      { ar: 'المشتري له أكبر تسارع جاذبية', en: 'Jupiter has the highest gravitational acceleration' },
      { ar: 'الجاذبية تتناسب مع كتلة الكوكب', en: 'Gravity is proportional to planet mass' }
    ]
  },
  {
    id: 'chart-motion-graph',
    lessonId: 'equations-motion',
    titleAr: 'منحنيات الحركة المنتظمة والمتسارعة',
    titleEn: 'Uniform and Accelerated Motion Curves',
    descriptionAr: 'مقارنة منحنيات الموضع والسرعة للحركة المنتظمة والمتسارعة',
    descriptionEn: 'Comparison of position and velocity curves for uniform and accelerated motion',
    type: 'line',
    subject: 'physics',
    data: {
      labels: ['0', '1', '2', '3', '4', '5'],
      labelsAr: ['0', '1', '2', '3', '4', '5'],
      datasets: [
        {
          label: 'Position (Uniform)',
          labelAr: 'الموضع (منتظم)',
          data: [0, 10, 20, 30, 40, 50],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: 'Position (Accelerated)',
          labelAr: 'الموضع (متسارع)',
          data: [0, 5, 20, 45, 80, 125],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
      ]
    },
    xAxisLabel: 'Time (s)',
    xAxisLabelAr: 'الزمن (ث)',
    yAxisLabel: 'Position (m)',
    yAxisLabelAr: 'الموضع (م)',
    formulas: [
      { ar: 'x = vt (منتظم)', en: 'x = vt (uniform)' },
      { ar: 'x = ½at² (متسارع)', en: 'x = ½at² (accelerated)' }
    ]
  },
  {
    id: 'chart-energy-types',
    lessonId: 'energy-intro',
    titleAr: 'أنواع الطاقة وتحولاتها',
    titleEn: 'Energy Types and Transformations',
    descriptionAr: 'توزيع أنواع الطاقة في نظام طاقة متجددة',
    descriptionEn: 'Distribution of energy types in a renewable energy system',
    type: 'pie',
    subject: 'physics',
    data: {
      labels: ['Kinetic', 'Potential', 'Thermal', 'Electrical', 'Chemical'],
      labelsAr: ['حركية', 'كامنة', 'حرارية', 'كهربائية', 'كيميائية'],
      datasets: [{
        label: 'Energy %',
        labelAr: 'الطاقة %',
        data: [25, 20, 15, 30, 10],
        backgroundColor: ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6']
      }]
    },
    insights: [
      { ar: 'الطاقة الكهربائية هي الأكثر استخداماً', en: 'Electrical energy is the most used' },
      { ar: 'الطاقة لا تفنى ولا تستحدث', en: 'Energy cannot be created or destroyed' }
    ]
  },
  {
    id: 'chart-wave-properties',
    lessonId: 'wave-properties',
    titleAr: 'العلاقة بين التردد والطول الموجي',
    titleEn: 'Frequency vs Wavelength Relationship',
    descriptionAr: 'العلاقة العكسية بين التردد والطول الموجي',
    descriptionEn: 'Inverse relationship between frequency and wavelength',
    type: 'line',
    subject: 'physics',
    data: {
      labels: ['100', '200', '300', '400', '500', '600', '700'],
      labelsAr: ['100', '200', '300', '400', '500', '600', '700'],
      datasets: [{
        label: 'Wavelength (nm)',
        labelAr: 'الطول الموجي (نم)',
        data: [700, 600, 500, 450, 400, 350, 300],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)'
      }]
    },
    xAxisLabel: 'Frequency (THz)',
    xAxisLabelAr: 'التردد (تيرا هرتز)',
    yAxisLabel: 'Wavelength (nm)',
    yAxisLabelAr: 'الطول الموجي (نم)',
    formulas: [{ ar: 'v = fλ', en: 'v = fλ' }],
    insights: [
      { ar: 'علاقة عكسية بين التردد والطول الموجي', en: 'Inverse relationship between frequency and wavelength' }
    ]
  },
  {
    id: 'chart-electromagnetic-spectrum',
    lessonId: 'light-waves',
    titleAr: 'الطيف الكهرومغناطيسي',
    titleEn: 'Electromagnetic Spectrum',
    descriptionAr: 'توزيع الطيف الكهرومغناطيسي حسب الطول الموجي',
    descriptionEn: 'Distribution of electromagnetic spectrum by wavelength',
    type: 'bar',
    subject: 'physics',
    data: {
      labels: ['Radio', 'Microwave', 'IR', 'Visible', 'UV', 'X-ray', 'Gamma'],
      labelsAr: ['راديو', 'ميكروويف', 'تحت حمراء', 'مرئي', 'فوق بنفسجية', 'أشعة سينية', 'أشعة جاما'],
      datasets: [{
        label: 'Wavelength (m)',
        labelAr: 'الطول الموجي (م)',
        data: [1, 0.01, 0.00001, 0.0000005, 0.00000001, 0.0000000001, 0.000000000001],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']
      }]
    },
    yAxisLabel: 'Wavelength (m)',
    yAxisLabelAr: 'الطول الموجي (م)',
    insights: [
      { ar: 'أشعة جاما لها أقصر طول موجي', en: 'Gamma rays have the shortest wavelength' },
      { ar: 'موجات الراديو لها أطول طول موجي', en: 'Radio waves have the longest wavelength' }
    ]
  },
  {
    id: 'chart-resistance-factors',
    lessonId: 'electric-current',
    titleAr: 'العوامل المؤثرة في المقاومة',
    titleEn: 'Factors Affecting Resistance',
    descriptionAr: 'تأثير طول السلك على المقاومة الكهربائية',
    descriptionEn: 'Effect of wire length on electrical resistance',
    type: 'line',
    subject: 'physics',
    data: {
      labels: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
      labelsAr: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
      datasets: [{
        label: 'Resistance (Ω)',
        labelAr: 'المقاومة (أوم)',
        data: [0.17, 0.34, 0.51, 0.68, 0.85, 1.02, 1.19, 1.36, 1.53, 1.7],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }]
    },
    xAxisLabel: 'Length (cm)',
    xAxisLabelAr: 'الطول (سم)',
    yAxisLabel: 'Resistance (Ω)',
    yAxisLabelAr: 'المقاومة (أوم)',
    formulas: [{ ar: 'R = ρL/A', en: 'R = ρL/A' }],
    insights: [
      { ar: 'المقاومة تتناسب طردياً مع الطول', en: 'Resistance is directly proportional to length' }
    ]
  },
  {
    id: 'chart-sound-speed',
    lessonId: 'sound-waves',
    titleAr: 'سرعة الصوت في الأوساط المختلفة',
    titleEn: 'Speed of Sound in Different Media',
    descriptionAr: 'مقارنة سرعة الصوت في الهواء والماء والصلب',
    descriptionEn: 'Comparison of sound speed in air, water, and solids',
    type: 'bar',
    subject: 'physics',
    data: {
      labels: ['Air (20°C)', 'Water', 'Wood', 'Steel', 'Glass'],
      labelsAr: ['هواء (20°)', 'ماء', 'خشب', 'صلب', 'زجاج'],
      datasets: [{
        label: 'Speed (m/s)',
        labelAr: 'السرعة (م/ث)',
        data: [343, 1480, 3300, 5960, 5640],
        backgroundColor: ['#60a5fa', '#22d3ee', '#a78bfa', '#f472b6', '#fbbf24']
      }]
    },
    yAxisLabel: 'Speed (m/s)',
    yAxisLabelAr: 'السرعة (م/ث)',
    insights: [
      { ar: 'الصوت أسرع في الصلب عن الهواء', en: 'Sound is faster in solids than air' },
      { ar: 'كثافة الوسط تؤثر على سرعة الصوت', en: 'Medium density affects sound speed' }
    ]
  },
  {
    id: 'chart-simple-harmonic',
    lessonId: 'energy-intro',
    titleAr: 'الحركة التوافقية البسيطة',
    titleEn: 'Simple Harmonic Motion',
    descriptionAr: 'منحنى الإزاحة مع الزمن في الحركة التوافقية البسيطة',
    descriptionEn: 'Displacement vs time curve in simple harmonic motion',
    type: 'line',
    subject: 'physics',
    data: {
      labels: ['0', 'T/4', 'T/2', '3T/4', 'T', '5T/4', '3T/2', '7T/4', '2T'],
      labelsAr: ['0', 'T/4', 'T/2', '3T/4', 'T', '5T/4', '3T/2', '7T/4', '2T'],
      datasets: [{
        label: 'Displacement',
        labelAr: 'الإزاحة',
        data: [0, 1, 0, -1, 0, 1, 0, -1, 0],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)'
      }]
    },
    xAxisLabel: 'Time',
    xAxisLabelAr: 'الزمن',
    yAxisLabel: 'Displacement (A)',
    yAxisLabelAr: 'الإزاحة (A)',
    formulas: [{ ar: 'x = A sin(ωt)', en: 'x = A sin(ωt)' }]
  },
  {
    id: 'chart-newton-laws-applications',
    lessonId: 'newton-laws',
    titleAr: 'تطبيقات قوانين نيوتن',
    titleEn: "Newton's Laws Applications",
    descriptionAr: 'أمثلة على تطبيقات قوانين نيوتن في الحياة اليومية',
    descriptionEn: 'Examples of Newton\'s laws applications in daily life',
    type: 'pie',
    subject: 'physics',
    data: {
      labels: ['Transportation', 'Sports', 'Engineering', 'Space', 'Daily Life'],
      labelsAr: ['المواصلات', 'الرياضة', 'الهندسة', 'الفضاء', 'الحياة اليومية'],
      datasets: [{
        label: 'Applications',
        labelAr: 'التطبيقات',
        data: [30, 20, 25, 15, 10],
        backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444']
      }]
    }
  },

  // ==========================================
  // مخططات الكيمياء (8 مخططات)
  // ==========================================
  {
    id: 'chart-periodic-trends-radius',
    lessonId: 'periodic-trends',
    titleAr: 'نصف القطر الذري في الدورة الثالثة',
    titleEn: 'Atomic Radius in Period 3',
    descriptionAr: 'تغير نصف القطر الذري عبر الدورة الثالثة',
    descriptionEn: 'Change in atomic radius across period 3',
    type: 'bar',
    subject: 'chemistry',
    data: {
      labels: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
      labelsAr: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
      datasets: [{
        label: 'Atomic Radius (pm)',
        labelAr: 'نصف القطر الذري (بيكومتر)',
        data: [186, 160, 143, 117, 110, 104, 99, 71],
        backgroundColor: '#8b5cf6'
      }]
    },
    yAxisLabel: 'Radius (pm)',
    yAxisLabelAr: 'نصف القطر (بيكومتر)',
    insights: [
      { ar: 'نصف القطر يقل عبر الدورة', en: 'Radius decreases across the period' },
      { ar: 'السبب: زيادة الشحنة النووية', en: 'Reason: Increased nuclear charge' }
    ]
  },
  {
    id: 'chart-ionization-energy',
    lessonId: 'periodic-trends',
    titleAr: 'طاقة التأين في الدورة الثانية',
    titleEn: 'Ionization Energy in Period 2',
    descriptionAr: 'تغير طاقة التأين الأولى عبر الدورة الثانية',
    descriptionEn: 'Change in first ionization energy across period 2',
    type: 'line',
    subject: 'chemistry',
    data: {
      labels: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
      labelsAr: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
      datasets: [{
        label: 'IE (kJ/mol)',
        labelAr: 'طاقة التأين (كيلوجول/مول)',
        data: [520, 899, 801, 1086, 1402, 1314, 1681, 2081],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }]
    },
    yAxisLabel: 'IE (kJ/mol)',
    yAxisLabelAr: 'طاقة التأين (كيلوجول/مول)',
    insights: [
      { ar: 'طاقة التأين تزداد عبر الدورة', en: 'Ionization energy increases across period' },
      { ar: 'استثناءات عند أنصاف الممتلئة', en: 'Exceptions at half-filled orbitals' }
    ]
  },
  {
    id: 'chart-electronegativity',
    lessonId: 'periodic-trends',
    titleAr: 'السالبية الكهربائية للعناصر',
    titleEn: 'Electronegativity of Elements',
    descriptionAr: 'السالبية الكهربائية لمجموعة مختارة من العناصر',
    descriptionEn: 'Electronegativity of selected elements',
    type: 'bar',
    subject: 'chemistry',
    data: {
      labels: ['F', 'O', 'Cl', 'N', 'Br', 'I', 'C', 'S', 'H'],
      labelsAr: ['F', 'O', 'Cl', 'N', 'Br', 'I', 'C', 'S', 'H'],
      datasets: [{
        label: 'Electronegativity',
        labelAr: 'السالبية الكهربائية',
        data: [4.0, 3.5, 3.0, 3.0, 2.8, 2.5, 2.5, 2.5, 2.1],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f472b6', '#60a5fa']
      }]
    },
    yAxisLabel: 'Pauling Scale',
    yAxisLabelAr: 'مقياس باولنج',
    insights: [
      { ar: 'الفلور هو الأكثر سالبية', en: 'Fluorine is the most electronegative' },
      { ar: 'السالبية تزيد عبر الدورة', en: 'Electronegativity increases across period' }
    ]
  },
  {
    id: 'chart-bond-types',
    lessonId: 'ionic-bonding',
    titleAr: 'أنواع الروابط الكيميائية',
    titleEn: 'Types of Chemical Bonds',
    descriptionAr: 'توزيع أنواع الروابط الكيميائية في المركبات الشائعة',
    descriptionEn: 'Distribution of chemical bond types in common compounds',
    type: 'pie',
    subject: 'chemistry',
    data: {
      labels: ['Ionic', 'Covalent (Polar)', 'Covalent (Non-polar)', 'Metallic', 'Hydrogen Bond'],
      labelsAr: ['أيونية', 'تساهمية (قطبية)', 'تساهمية (غير قطبية)', 'فلزية', 'رابطة هيدروجينية'],
      datasets: [{
        label: 'Percentage',
        labelAr: 'النسبة المئوية',
        data: [35, 30, 15, 15, 5],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']
      }]
    }
  },
  {
    id: 'chart-ph-scale',
    lessonId: 'types-of-reactions',
    titleAr: 'مقياس pH للمحاليل الشائعة',
    titleEn: 'pH Scale of Common Solutions',
    descriptionAr: 'قيم pH للمحاليل الشائعة',
    descriptionEn: 'pH values of common solutions',
    type: 'bar',
    subject: 'chemistry',
    data: {
      labels: ['HCl', 'Lemon', 'Vinegar', 'Coffee', 'Water', 'Blood', 'Soap', 'Bleach', 'NaOH'],
      labelsAr: ['حمض الهيدروكلوريك', 'ليمون', 'خل', 'قهوة', 'ماء', 'دم', 'صابون', 'مبيض', 'هيدروكسيد صوديوم'],
      datasets: [{
        label: 'pH Value',
        labelAr: 'قيمة pH',
        data: [1, 2, 3, 5, 7, 7.4, 10, 12, 14],
        backgroundColor: ['#dc2626', '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#a855f7']
      }]
    },
    yAxisLabel: 'pH',
    yAxisLabelAr: 'pH',
    formulas: [{ ar: 'pH = -log[H⁺]', en: 'pH = -log[H⁺]' }],
    insights: [
      { ar: 'pH < 7 = حمض، pH > 7 = قاعدة', en: 'pH < 7 = acid, pH > 7 = base' }
    ]
  },
  {
    id: 'chart-solubility-temperature',
    lessonId: 'types-of-reactions',
    titleAr: 'تأثير الحرارة على الذوبانية',
    titleEn: 'Effect of Temperature on Solubility',
    descriptionAr: 'تغير ذوبانية الأملاح مع درجة الحرارة',
    descriptionEn: 'Change in salt solubility with temperature',
    type: 'line',
    subject: 'chemistry',
    data: {
      labels: ['0', '20', '40', '60', '80', '100'],
      labelsAr: ['0', '20', '40', '60', '80', '100'],
      datasets: [
        {
          label: 'KNO₃',
          labelAr: 'KNO₃',
          data: [13, 32, 64, 110, 169, 246],
          borderColor: '#ef4444'
        },
        {
          label: 'NaCl',
          labelAr: 'NaCl',
          data: [35.7, 36, 36.6, 37.3, 38.4, 39.8],
          borderColor: '#3b82f6'
        },
        {
          label: 'Ce₂(SO₄)₃',
          labelAr: 'Ce₂(SO₄)₃',
          data: [20, 10, 6, 4, 3, 2],
          borderColor: '#22c55e'
        }
      ]
    },
    xAxisLabel: 'Temperature (°C)',
    xAxisLabelAr: 'درجة الحرارة (°م)',
    yAxisLabel: 'Solubility (g/100g water)',
    yAxisLabelAr: 'الذوبانية (جم/100جم ماء)',
    insights: [
      { ar: 'معظم الأملاح تزداد ذوبانيتها', en: 'Most salts increase in solubility' },
      { ar: 'بعض الأملاح تقل ذوبانيتها', en: 'Some salts decrease in solubility' }
    ]
  },
  {
    id: 'chart-reaction-rate-factors',
    lessonId: 'reaction-rate',
    titleAr: 'العوامل المؤثرة على سرعة التفاعل',
    titleEn: 'Factors Affecting Reaction Rate',
    descriptionAr: 'تأثير درجة الحرارة على سرعة التفاعل',
    descriptionEn: 'Effect of temperature on reaction rate',
    type: 'line',
    subject: 'chemistry',
    data: {
      labels: ['10', '20', '30', '40', '50', '60'],
      labelsAr: ['10', '20', '30', '40', '50', '60'],
      datasets: [{
        label: 'Relative Rate',
        labelAr: 'السرعة النسبية',
        data: [1, 2, 4, 8, 16, 32],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)'
      }]
    },
    xAxisLabel: 'Temperature (°C)',
    xAxisLabelAr: 'درجة الحرارة (°م)',
    yAxisLabel: 'Relative Rate',
    yAxisLabelAr: 'السرعة النسبية',
    formulas: [{ ar: 'لكل 10° ترتفع السرعة 2×', en: 'For every 10° rate doubles' }]
  },
  {
    id: 'chart-atomic-structure',
    lessonId: 'atom-components',
    titleAr: 'تركيب بعض الذرات',
    titleEn: 'Structure of Some Atoms',
    descriptionAr: 'عدد البروتونات والنيوترونات والإلكترونات',
    descriptionEn: 'Number of protons, neutrons, and electrons',
    type: 'bar',
    subject: 'chemistry',
    data: {
      labels: ['H', 'He', 'C', 'N', 'O', 'Na', 'Cl', 'Fe'],
      labelsAr: ['H', 'He', 'C', 'N', 'O', 'Na', 'Cl', 'Fe'],
      datasets: [
        {
          label: 'Protons',
          labelAr: 'بروتونات',
          data: [1, 2, 6, 7, 8, 11, 17, 26],
          backgroundColor: '#ef4444'
        },
        {
          label: 'Neutrons',
          labelAr: 'نيوترونات',
          data: [0, 2, 6, 7, 8, 12, 18, 30],
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Electrons',
          labelAr: 'إلكترونات',
          data: [1, 2, 6, 7, 8, 11, 17, 26],
          backgroundColor: '#22c55e'
        }
      ]
    },
    yAxisLabel: 'Count',
    yAxisLabelAr: 'العدد',
    insights: [
      { ar: 'عدد البروتونات = عدد الإلكترونات (ذرة متعادلة)', en: 'Protons = Electrons (neutral atom)' }
    ]
  },

  // ==========================================
  // مخططات الرياضيات (7 مخططات)
  // ==========================================
  {
    id: 'chart-quadratic-functions',
    lessonId: 'quadratic-equations',
    titleAr: 'أنواع القطوع المكافئة',
    titleEn: 'Types of Parabolas',
    descriptionAr: 'مقارنة القطوع المكافئة بمعاملات مختلفة',
    descriptionEn: 'Comparison of parabolas with different coefficients',
    type: 'line',
    subject: 'math',
    data: {
      labels: ['-3', '-2', '-1', '0', '1', '2', '3'],
      labelsAr: ['-3', '-2', '-1', '0', '1', '2', '3'],
      datasets: [
        {
          label: 'y = x²',
          labelAr: 'y = x²',
          data: [9, 4, 1, 0, 1, 4, 9],
          borderColor: '#3b82f6'
        },
        {
          label: 'y = 2x²',
          labelAr: 'y = 2x²',
          data: [18, 8, 2, 0, 2, 8, 18],
          borderColor: '#ef4444'
        },
        {
          label: 'y = 0.5x²',
          labelAr: 'y = 0.5x²',
          data: [4.5, 2, 0.5, 0, 0.5, 2, 4.5],
          borderColor: '#22c55e'
        }
      ]
    },
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    formulas: [{ ar: 'y = ax² + bx + c', en: 'y = ax² + bx + c' }],
    insights: [
      { ar: '|a| أكبر ⇒ فتحة أضيق', en: 'Larger |a| ⇒ narrower opening' }
    ]
  },
  {
    id: 'chart-trig-functions',
    lessonId: 'trigonometric-functions',
    titleAr: 'الدوال المثلثية الأساسية',
    titleEn: 'Basic Trigonometric Functions',
    descriptionAr: 'منحنيات sin و cos و tan',
    descriptionEn: 'Curves of sin, cos, and tan',
    type: 'line',
    subject: 'math',
    data: {
      labels: ['0', 'π/2', 'π', '3π/2', '2π'],
      labelsAr: ['0', 'π/2', 'π', '3π/2', '2π'],
      datasets: [
        {
          label: 'sin(x)',
          labelAr: 'sin(x)',
          data: [0, 1, 0, -1, 0],
          borderColor: '#3b82f6'
        },
        {
          label: 'cos(x)',
          labelAr: 'cos(x)',
          data: [1, 0, -1, 0, 1],
          borderColor: '#ef4444'
        }
      ]
    },
    xAxisLabel: 'x (radians)',
    xAxisLabelAr: 'x (راديان)',
    yAxisLabel: 'y',
    formulas: [{ ar: 'sin²θ + cos²θ = 1', en: 'sin²θ + cos²θ = 1' }]
  },
  {
    id: 'chart-exponential-logarithm',
    lessonId: 'logarithms',
    titleAr: 'الدوال الأسية واللوغاريتمية',
    titleEn: 'Exponential and Logarithmic Functions',
    descriptionAr: 'مقارنة الدالة الأسية والدالة اللوغاريتمية',
    descriptionEn: 'Comparison of exponential and logarithmic functions',
    type: 'line',
    subject: 'math',
    data: {
      labels: ['-2', '-1', '0', '1', '2', '3'],
      labelsAr: ['-2', '-1', '0', '1', '2', '3'],
      datasets: [
        {
          label: 'y = eˣ',
          labelAr: 'y = eˣ',
          data: [0.14, 0.37, 1, 2.72, 7.39, 20.09],
          borderColor: '#8b5cf6'
        },
        {
          label: 'y = ln(x)',
          labelAr: 'y = ln(x)',
          data: [null, null, null, 0, 0.69, 1.1],
          borderColor: '#f59e0b'
        }
      ]
    },
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    formulas: [
      { ar: 'y = eˣ', en: 'y = eˣ' },
      { ar: 'y = ln(x)', en: 'y = ln(x)' }
    ]
  },
  {
    id: 'chart-derivative-application',
    lessonId: 'derivatives',
    titleAr: 'تطبيق المشتقة',
    titleEn: 'Derivative Application',
    descriptionAr: 'استخدام المشتقة لإيجاد القيمة العظمى',
    descriptionEn: 'Using derivative to find maximum value',
    type: 'line',
    subject: 'math',
    data: {
      labels: ['-2', '-1', '0', '1', '2', '3', '4'],
      labelsAr: ['-2', '-1', '0', '1', '2', '3', '4'],
      datasets: [
        {
          label: 'f(x) = -x² + 4x',
          labelAr: 'f(x) = -x² + 4x',
          data: [-12, -5, 0, 3, 4, 3, 0],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: "f'(x) = -2x + 4",
          labelAr: "f'(x) = -2x + 4",
          data: [8, 6, 4, 2, 0, -2, -4],
          borderColor: '#ef4444'
        }
      ]
    },
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    formulas: [{ ar: 'القيمة العظمى عند f\'(x) = 0', en: 'Maximum when f\'(x) = 0' }],
    insights: [
      { ar: 'القيمة العظمى عند x = 2', en: 'Maximum value at x = 2' }
    ]
  },
  {
    id: 'chart-integration-area',
    lessonId: 'integration',
    titleAr: 'التكامل والمساحة',
    titleEn: 'Integration and Area',
    descriptionAr: 'حساب المساحة تحت المنحنى باستخدام التكامل',
    descriptionEn: 'Calculating area under curve using integration',
    type: 'area',
    subject: 'math',
    data: {
      labels: ['0', '1', '2', '3', '4'],
      labelsAr: ['0', '1', '2', '3', '4'],
      datasets: [{
        label: 'f(x) = x²',
        labelAr: 'f(x) = x²',
        data: [0, 1, 4, 9, 16],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.3)'
      }]
    },
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    formulas: [
      { ar: '∫₀⁴ x² dx = [x³/3]₀⁴ = 64/3', en: '∫₀⁴ x² dx = [x³/3]₀⁴ = 64/3' }
    ],
    insights: [
      { ar: 'المساحة = 21.33 وحدة²', en: 'Area = 21.33 units²' }
    ]
  },
  {
    id: 'chart-statistics-distribution',
    lessonId: 'any',
    titleAr: 'التوزيع الطبيعي',
    titleEn: 'Normal Distribution',
    descriptionAr: 'منحنى التوزيع الطبيعي القياسي',
    descriptionEn: 'Standard normal distribution curve',
    type: 'line',
    subject: 'math',
    data: {
      labels: ['-3σ', '-2σ', '-1σ', 'μ', '1σ', '2σ', '3σ'],
      labelsAr: ['-3σ', '-2σ', '-1σ', 'μ', '1σ', '2σ', '3σ'],
      datasets: [{
        label: 'Probability Density',
        labelAr: 'كثافة الاحتمال',
        data: [0.004, 0.054, 0.242, 0.399, 0.242, 0.054, 0.004],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)'
      }]
    },
    xAxisLabel: 'Standard Deviations',
    xAxisLabelAr: 'الانحرافات المعيارية',
    yAxisLabel: 'Probability Density',
    yAxisLabelAr: 'كثافة الاحتمال',
    insights: [
      { ar: '68% من البيانات ضمن ±1σ', en: '68% of data within ±1σ' },
      { ar: '95% من البيانات ضمن ±2σ', en: '95% of data within ±2σ' }
    ]
  },
  {
    id: 'chart-geometry-angles',
    lessonId: 'angles-measurement',
    titleAr: 'زوايا المثلث',
    titleEn: 'Triangle Angles',
    descriptionAr: 'زوايا أنواع المثلثات المختلفة',
    descriptionEn: 'Angles of different triangle types',
    type: 'bar',
    subject: 'math',
    data: {
      labels: ['Equilateral', 'Isosceles', 'Right', 'Obtuse', 'Acute'],
      labelsAr: ['متساوي الأضلاع', 'متساوي الساقين', 'قائم', 'منفرج', 'حاد'],
      datasets: [{
        label: 'Angle Sum (°)',
        labelAr: 'مجموع الزوايا (°)',
        data: [180, 180, 180, 180, 180],
        backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
      }]
    },
    yAxisLabel: 'Degrees (°)',
    yAxisLabelAr: 'درجات (°)',
    formulas: [{ ar: 'مجموع زوايا المثلث = 180°', en: 'Sum of triangle angles = 180°' }]
  }
];

// Helper functions
export function getChartById(id: string): EducationalChart | undefined {
  return educationalCharts.find(c => c.id === id);
}

export function getChartsByLessonId(lessonId: string): EducationalChart[] {
  return educationalCharts.filter(c => c.lessonId === lessonId || c.lessonId === 'any');
}

export function getChartsBySubject(subject: string): EducationalChart[] {
  return educationalCharts.filter(c => c.subject === subject);
}

export function getChartsStats() {
  return {
    total: educationalCharts.length,
    physics: educationalCharts.filter(c => c.subject === 'physics').length,
    chemistry: educationalCharts.filter(c => c.subject === 'chemistry').length,
    math: educationalCharts.filter(c => c.subject === 'math').length
  };
}
