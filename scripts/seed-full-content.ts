import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// ==================== محتوى الصف الأول الثانوي ====================

const firstYearContent: Record<string, any> = {
  // اللغة العربية
  'اللغة العربية': {
    lessons: {
      'مقدمة في النحو': {
        objectives: [
          { ar: 'التعرف على مفهوم النحو وأهميته في اللغة العربية', en: 'Understanding the concept of grammar and its importance in Arabic' },
          { ar: 'التمييز بين أنواع الكلمات (اسم، فعل، حرف)', en: 'Distinguishing between types of words (noun, verb, particle)' },
          { ar: 'فهم الإعراب والبناء في اللغة العربية', en: 'Understanding inflection and construction in Arabic' }
        ],
        concepts: [
          { ar: 'النحو', en: 'Grammar', defAr: 'علم يُعرف به أواخر الكلمات إعراباً وبناءً', defEn: 'The science of knowing the endings of words in terms of inflection and construction' },
          { ar: 'الاسم', en: 'Noun', defAr: 'كلمة تدل على معنى في نفسها ولا تقترن بزمان', defEn: 'A word that indicates a meaning in itself and is not associated with time' },
          { ar: 'الفعل', en: 'Verb', defAr: 'كلمة تدل على معنى في نفسها وتقترن بزمان', defEn: 'A word that indicates a meaning in itself and is associated with time' },
          { ar: 'الحرف', en: 'Particle', defAr: 'كلمة لا يظهر معناها إلا مع غيرها', defEn: 'A word whose meaning does not appear except with others' }
        ],
        examples: [
          { qAr: 'أعرب كلمة "الطالب" في جملة: جاء الطالبُ', qEn: 'Parse the word "الطالب" in: جاء الطالبُ', sAr: 'الطالبُ: فاعل مرفوع وعلامة رفعه الضمة', sEn: 'الطالبُ: subject, nominative, marked by damma' }
        ],
        questions: [
          { qAr: 'ما الفرق بين الاسم والفعل؟', qEn: 'What is the difference between a noun and a verb?', answer: 'الزمان', options: ['الزمان', 'المعنى', 'اللفظ', 'الكتابة'] },
          { qAr: 'كم أقسام الكلام في اللغة العربية؟', qEn: 'How many parts of speech in Arabic?', answer: 'ثلاثة', options: ['اثنان', 'ثلاثة', 'أربعة', 'خمسة'] }
        ]
      },
      'المبتدأ والخبر': {
        objectives: [
          { ar: 'التعرف على المبتدأ والخبر وعلاقتهما', en: 'Understanding the subject and predicate and their relationship' },
          { ar: 'معرفة أنواع المبتدأ والخبر', en: 'Knowing the types of subject and predicate' },
          { ar: 'التدرب على إعراب الجملة الاسمية', en: 'Practicing parsing the nominal sentence' }
        ],
        concepts: [
          { ar: 'المبتدأ', en: 'Subject', defAr: 'الاسم المرفوع الذي نبدأ به الجملة الاسمية', defEn: 'The nominative noun with which we begin the nominal sentence' },
          { ar: 'الخبر', en: 'Predicate', defAr: 'الاسم المرفوع الذي يكمل معنى الجملة الاسمية', defEn: 'The nominative noun that completes the meaning of the nominal sentence' },
          { ar: 'الجملة الاسمية', en: 'Nominal Sentence', defAr: 'الجملة التي تبدأ باسم', defEn: 'A sentence that begins with a noun' }
        ],
        examples: [
          { qAr: 'حدد المبتدأ والخبر: السماءُ صافيةٌ', qEn: 'Identify subject and predicate: السماءُ صافيةٌ', sAr: 'السماءُ: مبتدأ مرفوع، صافيةٌ: خبر مرفوع', sEn: 'السماءُ: subject nominative, صافيةٌ: predicate nominative' }
        ],
        questions: [
          { qAr: 'ما علامة رفع المبتدأ والخبر؟', qEn: 'What is the nominative mark of subject and predicate?', answer: 'الضمة', options: ['الضمة', 'الفتحة', 'الكسرة', 'السكون'] }
        ]
      }
    }
  },
  
  // الرياضيات
  'الرياضيات': {
    lessons: {
      'الأعداد الحقيقية': {
        objectives: [
          { ar: 'التعرف على مجموعة الأعداد الحقيقية', en: 'Understanding the set of real numbers' },
          { ar: 'التمييز بين الأعداد النسبية وغير النسبية', en: 'Distinguishing between rational and irrational numbers' },
          { ar: 'إجراء العمليات الحسابية على الأعداد الحقيقية', en: 'Performing arithmetic operations on real numbers' }
        ],
        concepts: [
          { ar: 'الأعداد الحقيقية', en: 'Real Numbers', defAr: 'مجموعة تشمل جميع الأعداد النسبية وغير النسبية', defEn: 'A set that includes all rational and irrational numbers' },
          { ar: 'الأعداد النسبية', en: 'Rational Numbers', defAr: 'أعداد يمكن كتابتها على صورة كسر (بسط/مقام)', defEn: 'Numbers that can be written as a fraction (numerator/denominator)' },
          { ar: 'الأعداد غير النسبية', en: 'Irrational Numbers', defAr: 'أعداد لا يمكن كتابتها على صورة كسر مثل √2', defEn: 'Numbers that cannot be written as a fraction like √2' }
        ],
        formulas: [
          { f: '|أ| = أ إذا أ ≥ 0، |أ| = -أ إذا أ < 0', arExp: 'القيمة المطلقة', enExp: 'Absolute Value' },
          { f: '√(أ × ب) = √أ × √ب', arExp: 'خاصية الجذور', enExp: 'Square Root Property' }
        ],
        examples: [
          { qAr: 'أوجد القيمة المطلقة لـ -5', qEn: 'Find the absolute value of -5', sAr: '|-5| = 5', sEn: '|-5| = 5', steps: 'لأن -5 < 0، إذن |-5| = -(-5) = 5' },
          { qAr: 'هل √3 عدد نسبي؟', qEn: 'Is √3 a rational number?', sAr: 'لا، √3 عدد غير نسبي', sEn: 'No, √3 is an irrational number' }
        ],
        questions: [
          { qAr: 'ما مجموعة الأعداد الحقيقية؟', qEn: 'What is the set of real numbers?', answer: 'الأعداد النسبية وغير النسبية', options: ['الأعداد الصحيحة فقط', 'الأعداد النسبية وغير النسبية', 'الأعداد الطبيعية فقط', 'الأعداد الأولية'] },
          { qAr: 'أوجد |7|', qEn: 'Find |7|', answer: '7', options: ['7', '-7', '0', '14'] }
        ]
      },
      'الكسور والعمليات عليها': {
        objectives: [
          { ar: 'إتقان جمع وطرح الكسور', en: 'Mastering addition and subtraction of fractions' },
          { ar: 'إتقان ضرب وقسمة الكسور', en: 'Mastering multiplication and division of fractions' },
          { ar: 'تبسيط الكسور الجبرية', en: 'Simplifying algebraic fractions' }
        ],
        concepts: [
          { ar: 'البسط', en: 'Numerator', defAr: 'العدد أعلى خط الكسر', defEn: 'The number above the fraction line' },
          { ar: 'المقام', en: 'Denominator', defAr: 'العدد أسفل خط الكسر', defEn: 'The number below the fraction line' },
          { ar: 'المقام المشترك', en: 'Common Denominator', defAr: 'مضاعف مشترك للمقامات', defEn: 'A common multiple of denominators' }
        ],
        formulas: [
          { f: 'أ/ب + ج/د = (أ×د + ج×ب)/(ب×د)', arExp: 'جمع الكسور', enExp: 'Adding Fractions' },
          { f: '(أ/ب) × (ج/د) = (أ×ج)/(ب×د)', arExp: 'ضرب الكسور', enExp: 'Multiplying Fractions' },
          { f: '(أ/ب) ÷ (ج/د) = (أ×د)/(ب×ج)', arExp: 'قسمة الكسور', enExp: 'Dividing Fractions' }
        ],
        examples: [
          { qAr: 'احسب: 1/2 + 1/3', qEn: 'Calculate: 1/2 + 1/3', sAr: '5/6', sEn: '5/6', steps: 'المقام المشترك = 6\n3/6 + 2/6 = 5/6' }
        ],
        questions: [
          { qAr: 'ما ناتج 2/3 × 3/4؟', qEn: 'What is 2/3 × 3/4?', answer: '1/2', options: ['6/12', '1/2', '5/7', '6/7'] }
        ]
      }
    }
  },
  
  // الفيزياء
  'الفيزياء': {
    lessons: {
      'مقدمة في الفيزياء': {
        objectives: [
          { ar: 'التعرف على مفهوم الفيزياء وأهميتها', en: 'Understanding the concept and importance of physics' },
          { ar: 'معرفة فروع الفيزياء الرئيسية', en: 'Knowing the main branches of physics' },
          { ar: 'فهم المنهج العلمي في الفيزياء', en: 'Understanding the scientific method in physics' }
        ],
        concepts: [
          { ar: 'الفيزياء', en: 'Physics', defAr: 'علم يدرس المادة والطاقة والعلاقة بينهما', defEn: 'The science that studies matter, energy, and the relationship between them' },
          { ar: 'المادة', en: 'Matter', defAr: 'كل ما له كتلة ويشغل حيزاً من الفراغ', defEn: 'Anything that has mass and occupies space' },
          { ar: 'الطاقة', en: 'Energy', defAr: 'القدرة على القيام بشغل أو إحداث تغيير', defEn: 'The ability to do work or cause change' }
        ],
        examples: [
          { qAr: 'أمثلة على تحولات الطاقة في الحياة اليومية', qEn: 'Examples of energy transformations in daily life', sAr: 'المصباح الكهربائي: طاقة كهربائية ← طاقة ضوئية وحرارية', sEn: 'Electric lamp: electrical energy → light and heat energy' }
        ],
        questions: [
          { qAr: 'ما الذي تدرسه الفيزياء؟', qEn: 'What does physics study?', answer: 'المادة والطاقة', options: ['المادة والطاقة', 'الكائنات الحية فقط', 'التفاعلات الكيميائية فقط', 'الظواهر الجوية فقط'] }
        ]
      },
      'الحركة والسرعة': {
        objectives: [
          { ar: 'التعرف على مفهوم الحركة وأنواعها', en: 'Understanding the concept and types of motion' },
          { ar: 'حساب السرعة المتوسطة', en: 'Calculating average speed' },
          { ar: 'التمييز بين السرعة والتسارع', en: 'Distinguishing between speed and acceleration' }
        ],
        concepts: [
          { ar: 'الحركة', en: 'Motion', defAr: 'تغير موضع الجسم بالنسبة لنقطة ثابتة بمرور الزمن', defEn: 'Change in the position of an object relative to a fixed point over time' },
          { ar: 'السرعة', en: 'Speed', defAr: 'المسافة المقطوعة خلال وحدة الزمن', defEn: 'The distance traveled per unit of time' },
          { ar: 'التسارع', en: 'Acceleration', defAr: 'معدل تغير السرعة بالنسبة للزمن', defEn: 'The rate of change of velocity with respect to time' }
        ],
        formulas: [
          { f: 'سر = ف/ز', arExp: 'السرعة = الإزاحة / الزمن', enExp: 'Speed = Displacement / Time' },
          { f: 'ت = (سر2 - سر1) / ز', arExp: 'التسارع = تغير السرعة / الزمن', enExp: 'Acceleration = Change in Speed / Time' }
        ],
        examples: [
          { qAr: 'سيارة تقطع 100 كم في ساعتين، ما سرعتها المتوسطة؟', qEn: 'A car travels 100 km in 2 hours, what is its average speed?', sAr: '50 كم/ساعة', sEn: '50 km/h', steps: 'السرعة = المسافة / الزمن = 100 / 2 = 50 كم/ساعة' }
        ],
        questions: [
          { qAr: 'ما وحدة قياس السرعة في النظام الدولي؟', qEn: 'What is the SI unit of speed?', answer: 'م/ث', options: ['م/ث', 'كم/ساعة', 'م/ث²', 'نيوتن'] },
          { qAr: 'إذا كانت سرعة جسم 20 م/ث وقطع مسافة 100 م، فما الزمن؟', qEn: 'If an object speed is 20 m/s and traveled 100 m, what is the time?', answer: '5 ثواني', options: ['2 ثواني', '5 ثواني', '10 ثواني', '200 ثانية'] }
        ]
      }
    }
  },
  
  // الكيمياء
  'الكيمياء': {
    lessons: {
      'مقدمة في الكيمياء': {
        objectives: [
          { ar: 'التعرف على مفهوم الكيمياء وأهميتها', en: 'Understanding the concept and importance of chemistry' },
          { ar: 'معرفة حالات المادة الثلاث', en: 'Knowing the three states of matter' },
          { ar: 'فهم الفرق بين العنصر والمركب', en: 'Understanding the difference between element and compound' }
        ],
        concepts: [
          { ar: 'الكيمياء', en: 'Chemistry', defAr: 'علم يدرس المادة وتحولاتها والتفاعلات الكيميائية', defEn: 'The science that studies matter, its transformations, and chemical reactions' },
          { ar: 'العنصر', en: 'Element', defAr: 'مادة نقية لا يمكن تحليلها لمواد أبسط', defEn: 'A pure substance that cannot be broken down into simpler substances' },
          { ar: 'المركب', en: 'Compound', defAr: 'مادة تتكون من اتحاد عنصرين أو أكثر بنسب ثابتة', defEn: 'A substance formed by the union of two or more elements in fixed ratios' }
        ],
        examples: [
          { qAr: 'أمثلة على عناصر ومركبات', qEn: 'Examples of elements and compounds', sAr: 'عناصر: حديد، أكسجين، ذهب\nمركبات: ماء (H2O)، ملح الطعام (NaCl)', sEn: 'Elements: iron, oxygen, gold\nCompounds: water (H2O), table salt (NaCl)' }
        ],
        questions: [
          { qAr: 'الماء عنصر أم مركب؟', qEn: 'Is water an element or compound?', answer: 'مركب', options: ['عنصر', 'مركب', 'خليط', 'محلول'] }
        ]
      },
      'الذرات والجزيئات': {
        objectives: [
          { ar: 'التعرف على تركيب الذرة', en: 'Understanding the structure of the atom' },
          { ar: 'معرفة مكونات الذرة (البروتونات، النيوترونات، الإلكترونات)', en: 'Knowing the components of the atom (protons, neutrons, electrons)' },
          { ar: 'فهم مفهوم العدد الذري والكتلة الذرية', en: 'Understanding atomic number and atomic mass' }
        ],
        concepts: [
          { ar: 'الذرة', en: 'Atom', defAr: 'أصغر وحدة بنائية للمادة تحتفظ بخواص العنصر', defEn: 'The smallest building unit of matter that retains the properties of the element' },
          { ar: 'البروتون', en: 'Proton', defAr: 'جسيم موجب الشحنة في نواة الذرة', defEn: 'A positively charged particle in the nucleus of the atom' },
          { ar: 'الإلكترون', en: 'Electron', defAr: 'جسيم سالب الشحنة يدور حول النواة', defEn: 'A negatively charged particle orbiting the nucleus' },
          { ar: 'النيوترون', en: 'Neutron', defAr: 'جسيم متعادل الشحنة في نواة الذرة', defEn: 'A neutral particle in the nucleus of the atom' }
        ],
        formulas: [
          { f: 'العدد الذري (Z) = عدد البروتونات = عدد الإلكترونات', arExp: 'في الذرة المتعادلة', enExp: 'In a neutral atom' },
          { f: 'الكتلة الذرية (A) = عدد البروتونات + عدد النيوترونات', arExp: 'حساب الكتلة الذرية', enExp: 'Calculating atomic mass' }
        ],
        examples: [
          { qAr: 'ذرة كربون عددها الذري 6، ما عدد البروتونات والإلكترونات؟', qEn: 'A carbon atom has atomic number 6, what is the number of protons and electrons?', sAr: '6 بروتونات، 6 إلكترونات', sEn: '6 protons, 6 electrons' }
        ],
        questions: [
          { qAr: 'أين توجد البروتونات في الذرة؟', qEn: 'Where are protons located in the atom?', answer: 'النواة', options: ['النواة', 'حول النواة', 'في الأغلفة', 'خارج الذرة'] },
          { qAr: 'ما شحنة الإلكترون؟', qEn: 'What is the charge of the electron?', answer: 'سالبة', options: ['موجبة', 'سالبة', 'متعادلة', 'لا شحنة لها'] }
        ]
      }
    }
  },
  
  // الأحياء
  'الأحياء': {
    lessons: {
      'مقدمة في علم الأحياء': {
        objectives: [
          { ar: 'التعرف على مفهوم علم الأحياء وأهميته', en: 'Understanding the concept and importance of biology' },
          { ar: 'معرفة خصائص الكائنات الحية', en: 'Knowing the characteristics of living organisms' },
          { ar: 'فهم مستويات التنظيم الحيوي', en: 'Understanding levels of biological organization' }
        ],
        concepts: [
          { ar: 'علم الأحياء', en: 'Biology', defAr: 'علم يدرس الكائنات الحية وخصائصها ووظائفها', defEn: 'The science that studies living organisms, their characteristics and functions' },
          { ar: 'الخلية', en: 'Cell', defAr: 'الوحدة البنائية والوظيفية الأساسية للحياة', defEn: 'The basic structural and functional unit of life' },
          { ar: 'التمثيل الغذائي', en: 'Metabolism', defAr: 'مجموعة التفاعلات الكيميائية في الخلية', defEn: 'All chemical reactions in the cell' }
        ],
        examples: [
          { qAr: 'ما خصائص الكائنات الحية؟', qEn: 'What are the characteristics of living organisms?', sAr: 'النمو، التكاثر، التغذية، التنفس، الإخراج، الحركة، الإحساس', sEn: 'Growth, reproduction, nutrition, respiration, excretion, movement, sensation' }
        ],
        questions: [
          { qAr: 'ما الوحدة الأساسية للحياة؟', qEn: 'What is the basic unit of life?', answer: 'الخلية', options: ['الذرة', 'الجزيء', 'الخلية', 'النسيج'] }
        ]
      }
    }
  },
  
  // التاريخ
  'التاريخ': {
    lessons: {
      'مقدمة عن الحضارة المصرية': {
        objectives: [
          { ar: 'التعرف على نشأة الحضارة المصرية القديمة', en: 'Understanding the origins of ancient Egyptian civilization' },
          { ar: 'معرفة العوامل التي ساعدت على قيام الحضارة', en: 'Knowing the factors that helped establish the civilization' },
          { ar: 'فهم أهمية نهر النيل في الحضارة المصرية', en: 'Understanding the importance of the Nile River in Egyptian civilization' }
        ],
        concepts: [
          { ar: 'الحضارة', en: 'Civilization', defAr: 'مجموعة المظاهر المادية والمعنوية التي ينتجها الإنسان', defEn: 'The set of material and immaterial aspects produced by humans' },
          { ar: 'الحضارة المصرية القديمة', en: 'Ancient Egyptian Civilization', defAr: 'إحدى أعرق الحضارات في التاريخ البشري، نشأت على ضفاف نهر النيل', defEn: 'One of the oldest civilizations in human history, originated on the banks of the Nile' },
          { ar: 'التاريخ', en: 'History', defAr: 'علم يدرس الماضي البشري من خلال الآثار والوثائق', defEn: 'The science that studies the human past through artifacts and documents' }
        ],
        examples: [
          { qAr: 'أهم إنجازات الحضارة المصرية القديمة', qEn: 'Most important achievements of ancient Egyptian civilization', sAr: 'الأهرامات، الكتابة الهيروغليفية، التحنيط، الطب، الفلك', sEn: 'Pyramids, Hieroglyphic writing, Mummification, Medicine, Astronomy' }
        ],
        questions: [
          { qAr: 'أين نشأت الحضارة المصرية القديمة؟', qEn: 'Where did ancient Egyptian civilization originate?', answer: 'على ضفاف نهر النيل', options: ['على ضفاف دجلة والفرات', 'على ضفاب نهر النيل', 'في شبه الجزيرة العربية', 'في أوروبا'] },
          { qAr: 'ما هي لغة المصريين القدماء؟', qEn: 'What was the language of ancient Egyptians?', answer: 'الهيروغليفية', options: ['العربية', 'الهيروغليفية', 'اللاتينية', 'اليونانية'] }
        ]
      },
      'الملوك والفراعنة': {
        objectives: [
          { ar: 'التعرف على أشهر الفراعنة المصريين', en: 'Learning about the most famous Egyptian pharaohs' },
          { ar: 'معرفة إنجازات الملوك المصريين', en: 'Knowing the achievements of Egyptian kings' },
          { ar: 'فهم نظام الحكم في مصر القديمة', en: 'Understanding the ruling system in ancient Egypt' }
        ],
        concepts: [
          { ar: 'الفرعون', en: 'Pharaoh', defAr: 'لقب ملوك مصر القديمة، كان يُعتبر ممثل الآلهة على الأرض', defEn: 'Title of ancient Egyptian kings, considered representatives of gods on earth' },
          { ar: 'الأسر الحاكمة', en: 'Ruling Dynasties', defAr: 'تتابع الملوك من أسرة واحدة في حكم مصر', defEn: 'Succession of kings from one family in ruling Egypt' },
          { ar: 'المملكة', en: 'Kingdom', defAr: 'فترة تاريخية تتميز بالقوة والاستقرار', defEn: 'A historical period characterized by strength and stability' }
        ],
        examples: [
          { qAr: 'أشهر فراعنة مصر القديمة', qEn: 'Most famous pharaohs of ancient Egypt', sAr: 'خوفو (باني الهرم الأكبر)، حتشبسوت، رمسيس الثاني، توت عنخ آمون', sEn: 'Khufu (builder of the Great Pyramid), Hatshepsut, Ramesses II, Tutankhamun' }
        ],
        questions: [
          { qAr: 'من بني الهرم الأكبر؟', qEn: 'Who built the Great Pyramid?', answer: 'الملك خوفو', options: ['الملك خوفو', 'رعمسيس الثاني', 'توت عنخ آمون', 'حتشبسوت'] },
          { qAr: 'من هي أشهر ملكات مصر القديمة؟', qEn: 'Who is the most famous queen of ancient Egypt?', answer: 'حتشبسوت', options: ['كليوباترا', 'حتشبسوت', 'نفرتيتي', 'إيزيس'] }
        ]
      },
      'الفن والعمارة': {
        objectives: [
          { ar: 'التعرف على فنون مصر القديمة', en: 'Learning about ancient Egyptian arts' },
          { ar: 'معرفة أساليب البناء والعمارة المصرية', en: 'Knowing Egyptian building and architectural styles' },
          { ar: 'فهم أهمية الفن في الحياة المصرية القديمة', en: 'Understanding the importance of art in ancient Egyptian life' }
        ],
        concepts: [
          { ar: 'الهرم', en: 'Pyramid', defAr: 'بناء ضخم على شكل هرم، بُني ليكون مقبرة للملك', defEn: 'A massive pyramid-shaped structure built to be the tomb of the king' },
          { ar: 'المعبد', en: 'Temple', defAr: 'مكان العبادة في مصر القديمة', defEn: 'Place of worship in ancient Egypt' },
          { ar: 'الهيروغليفية', en: 'Hieroglyphics', defAr: 'الكتابة المصرية القديمة بالرموز والصور', defEn: 'Ancient Egyptian writing using symbols and pictures' }
        ],
        examples: [
          { qAr: 'أهم المعالم المعمارية المصرية', qEn: 'Most important Egyptian architectural landmarks', sAr: 'أهرامات الجيزة، معبد الكرنك، معبد الأقصر، أبو سمبل', sEn: 'Giza Pyramids, Karnak Temple, Luxor Temple, Abu Simbel' }
        ],
        questions: [
          { qAr: 'كم عدد أهرامات الجيزة؟', qEn: 'How many pyramids are in Giza?', answer: '3', options: ['1', '2', '3', '5'] },
          { qAr: 'ما اسم أكبر معبد في مصر القديمة؟', qEn: 'What is the name of the largest temple in ancient Egypt?', answer: 'معبد الكرنك', options: ['معبد الكرنك', 'معبد الأقصر', 'أبو سمبل', 'معبد إدفو'] }
        ]
      },
      'نشأة الحضارة الإسلامية': {
        objectives: [
          { ar: 'التعرف على بداية الحضارة الإسلامية', en: 'Understanding the beginning of Islamic civilization' },
          { ar: 'معرفة أهم إنجازات الحضارة الإسلامية', en: 'Knowing the main achievements of Islamic civilization' },
          { ar: 'فهم دور المسلمين في نقل العلوم', en: 'Understanding the role of Muslims in transmitting sciences' }
        ],
        concepts: [
          { ar: 'الحضارة الإسلامية', en: 'Islamic Civilization', defAr: 'حضارة قامت على أساس الإسلام وامتدت من الصين إلى الأندلس', defEn: 'A civilization based on Islam that extended from China to Andalusia' },
          { ar: 'العصر الذهبي', en: 'Golden Age', defAr: 'فترة ازدهار العلوم والفنون الإسلامية', defEn: 'A period of flourishing Islamic sciences and arts' },
          { ar: 'الترجمة', en: 'Translation', defAr: 'حركة نقل العلوم من اليونانية والفارسية إلى العربية', defEn: 'The movement of transferring sciences from Greek and Persian to Arabic' }
        ],
        examples: [
          { qAr: 'أهم علماء الحضارة الإسلامية', qEn: 'Most important scholars of Islamic civilization', sAr: 'ابن سينا (الطب)، الخوارزمي (الرياضيات)، جابر بن حيان (الكيمياء)، الفارابي (الفلسفة)', sEn: 'Ibn Sina (Medicine), Al-Khwarizmi (Mathematics), Jabir ibn Hayyan (Chemistry), Al-Farabi (Philosophy)' }
        ],
        questions: [
          { qAr: 'من هو أبو الكيمياء؟', qEn: 'Who is the father of chemistry?', answer: 'جابر بن حيان', options: ['ابن سينا', 'الخوارزمي', 'جابر بن حيان', 'الفارابي'] },
          { qAr: 'في أي مدينة تأسست أول جامعة في العالم؟', qEn: 'In which city was the first university in the world founded?', answer: 'القرويين - فاس', options: ['بغداد', 'القاهرة', 'القرويين - فاس', 'دمشق'] }
        ]
      },
      'العلوم في الحضارة الإسلامية': {
        objectives: [
          { ar: 'التعرف على إنجازات المسلمين في العلوم', en: 'Learning about Muslim achievements in sciences' },
          { ar: 'معرفة علماء المسلمين واكتشافاتهم', en: 'Knowing Muslim scholars and their discoveries' },
          { ar: 'فهم تأثير الحضارة الإسلامية على أوروبا', en: 'Understanding the influence of Islamic civilization on Europe' }
        ],
        concepts: [
          { ar: 'الخوارزميات', en: 'Algorithms', defAr: 'مجموعة من الخطوات المنظمة لحل مشكلة معينة', defEn: 'A set of organized steps to solve a specific problem' },
          { ar: 'الجبر', en: 'Algebra', defAr: 'فرع من الرياضيات طوره الخوارزمي', defEn: 'A branch of mathematics developed by Al-Khwarizmi' },
          { ar: 'الصيدلة', en: 'Pharmacy', defAr: 'علم تحضير الأدوية وتطويرها', defEn: 'The science of preparing and developing medicines' }
        ],
        examples: [
          { qAr: 'إنجازات المسلمين في الطب', qEn: 'Muslim achievements in medicine', sAr: 'القانون في الطب لابن سينا، اكتشاف الدورة الدموية الصغرى، الجراحة', sEn: 'Canon of Medicine by Ibn Sina, discovery of pulmonary circulation, surgery' }
        ],
        questions: [
          { qAr: 'من مؤلف كتاب "القانون في الطب"؟', qEn: 'Who wrote "Canon of Medicine"?', answer: 'ابن سينا', options: ['الرازي', 'ابن سينا', 'الخوارزمي', 'ابن النفيس'] },
          { qAr: 'ما الكلمة التي أضيفت للغة الإنجليزية من اسم الخوارزمي؟', qEn: 'What word was added to English from Al-Khwarizmi name?', answer: 'Algorithm', options: ['Algebra', 'Algorithm', 'Chemistry', 'Zero'] }
        ]
      }
    }
  },
  
  // الجغرافيا
  'الجغرافيا': {
    lessons: {
      'موقع مصر وأهميته': {
        objectives: [
          { ar: 'التعرف على الموقع الجغرافي لمصر', en: 'Understanding the geographical location of Egypt' },
          { ar: 'معرفة أهمية موقع مصر الاستراتيجي', en: 'Knowing the strategic importance of Egypt location' },
          { ar: 'فهم حدود مصر الجغرافية', en: 'Understanding the geographical borders of Egypt' }
        ],
        concepts: [
          { ar: 'الموقع الفلكي', en: 'Astronomical Location', defAr: 'موقع مصر بالنسبة لخطوط الطول ودوائر العرض', defEn: 'Egypt location relative to longitude and latitude lines' },
          { ar: 'الموقع الجغرافي', en: 'Geographical Location', defAr: 'موقع مصر بالنسبة للقارات والمحيطات والبحار', defEn: 'Egypt location relative to continents, oceans and seas' },
          { ar: 'قناة السويس', en: 'Suez Canal', defAr: 'ممر مائي يربط بين البحر الأحمر والبحر المتوسط', defEn: 'A waterway connecting the Red Sea and the Mediterranean' }
        ],
        examples: [
          { qAr: 'أهمية موقع مصر الاستراتيجي', qEn: 'Strategic importance of Egypt location', sAr: 'تربط بين قارات آسيا وأفريقيا وأوروبا، تتحكم في قناة السويس', sEn: 'Connects Asia, Africa and Europe, controls the Suez Canal' }
        ],
        questions: [
          { qAr: 'في أي قارة تقع مصر؟', qEn: 'In which continent is Egypt located?', answer: 'أفريقيا', options: ['آسيا', 'أفريقيا', 'أوروبا', 'أمريكا'] },
          { qAr: 'ما البحران اللذان تطل عليهما مصر؟', qEn: 'Which two seas does Egypt overlook?', answer: 'الأحمر والمتوسط', options: ['الأحمر والمتوسط', 'الأحمر والأسود', 'المتوسط والأسود', 'الخليج والمتوسط'] }
        ]
      },
      'التضاريس المصرية': {
        objectives: [
          { ar: 'التعرف على تضاريس مصر المختلفة', en: 'Understanding the different terrains of Egypt' },
          { ar: 'معرفة أنواع التضاريس في مصر', en: 'Knowing the types of terrain in Egypt' },
          { ar: 'فهم تأثير التضاريس على السكان', en: 'Understanding the effect of terrain on population' }
        ],
        concepts: [
          { ar: 'وادي النيل', en: 'Nile Valley', defAr: 'السهل الخصيب على جانبي نهر النيل', defEn: 'The fertile plain on both sides of the Nile River' },
          { ar: 'الدلتا', en: 'Delta', defAr: 'مثلث عند مصب النهر حيث تتفرع الفروع', defEn: 'A triangle at the river mouth where branches diverge' },
          { ar: 'الصحراء', en: 'Desert', defAr: 'منطقة جافة قليلة الأمطار والنباتات', defEn: 'An arid area with little rain and plants' }
        ],
        examples: [
          { qAr: 'أنواع التضاريس في مصر', qEn: 'Types of terrain in Egypt', sAr: 'وادي النيل والدلتا (5% من المساحة)، الصحراء الغربية، الصحراء الشرقية، شبه جزيرة سيناء', sEn: 'Nile Valley and Delta (5% of area), Western Desert, Eastern Desert, Sinai Peninsula' }
        ],
        questions: [
          { qAr: 'ما نسبة وادي النيل والدلتا من مساحة مصر؟', qEn: 'What percentage of Egypt area is the Nile Valley and Delta?', answer: '5%', options: ['5%', '10%', '20%', '50%'] },
          { qAr: 'ما أكبر صحاري مصر؟', qEn: 'What is the largest desert in Egypt?', answer: 'الصحراء الغربية', options: ['الصحراء الغربية', 'الصحراء الشرقية', 'صحراء سيناء', 'صحراء النوبة'] }
        ]
      },
      'المناخ والموارد': {
        objectives: [
          { ar: 'التعرف على مناخ مصر وخصائصه', en: 'Understanding Egypt climate and characteristics' },
          { ar: 'معرفة الموارد الطبيعية في مصر', en: 'Knowing the natural resources in Egypt' },
          { ar: 'فهم أهمية المياه في مصر', en: 'Understanding the importance of water in Egypt' }
        ],
        concepts: [
          { ar: 'المناخ الصحراوي', en: 'Desert Climate', defAr: 'مناخ حار جاف صيفاً، معتدل ممطر شتاء', defEn: 'Hot dry climate in summer, moderate rainy in winter' },
          { ar: 'الموارد الطبيعية', en: 'Natural Resources', defAr: 'المواد المتوفرة في الطبيعة والتي يمكن استغلالها', defEn: 'Materials available in nature that can be exploited' },
          { ar: 'الرياح التجارية', en: 'Trade Winds', defAr: 'رياح منتظمة تهب من الشمال على مصر', defEn: 'Regular winds blowing from the north on Egypt' }
        ],
        examples: [
          { qAr: 'الموارد المعدنية في مصر', qEn: 'Mineral resources in Egypt', sAr: 'البترول، الغاز الطبيعي، الفوسفات، الحديد، الذهب', sEn: 'Petroleum, Natural gas, Phosphate, Iron, Gold' }
        ],
        questions: [
          { qAr: 'ما نوع مناخ مصر؟', qEn: 'What type of climate does Egypt have?', answer: 'صحراوي', options: ['استوائي', 'صحراوي', 'متوسطي', 'قطبي'] },
          { qAr: 'ما أهم مورد مائي في مصر؟', qEn: 'What is the most important water resource in Egypt?', answer: 'نهر النيل', options: ['نهر النيل', 'الأمطار', 'المياه الجوفية', 'البحار'] }
        ]
      }
    }
  },
  
  // اللغة الإنجليزية
  'اللغة الإنجليزية': {
    lessons: {
      'Reading Comprehension': {
        objectives: [
          { ar: 'تطوير مهارات فهم المقروء', en: 'Developing reading comprehension skills' },
          { ar: 'التعرف على استراتيجيات القراءة الفعالة', en: 'Learning effective reading strategies' },
          { ar: 'تحليل النصوص وفهم المعنى الضمني', en: 'Analyzing texts and understanding implied meaning' }
        ],
        concepts: [
          { ar: 'القراءة النقدية', en: 'Critical Reading', defAr: 'قراءة تحليلية تهدف إلى فهم وتقييم النص', defEn: 'Analytical reading aimed at understanding and evaluating the text' },
          { ar: 'المعنى السياقي', en: 'Contextual Meaning', defAr: 'معنى الكلمة من خلال السياق', defEn: 'The meaning of a word through context' },
          { ar: 'الفكرة الرئيسية', en: 'Main Idea', defAr: 'النقطة المركزية التي يدور حولها النص', defEn: 'The central point around which the text revolves' }
        ],
        examples: [
          { qAr: 'استراتيجيات فهم المقروء', qEn: 'Reading comprehension strategies', sAr: 'Skimming, Scanning, Prediction, Questioning, Summarizing', sEn: 'Skimming, Scanning, Prediction, Questioning, Summarizing' }
        ],
        questions: [
          { qAr: 'ما الفرق بين Skimming و Scanning؟', qEn: 'What is the difference between Skimming and Scanning?', answer: 'Skimming للفكرة العامة، Scanning للتفاصيل', options: ['لا فرق', 'Skimming للفكرة العامة، Scanning للتفاصيل', 'كلاهما للتفاصيل', 'كلاهما للفكرة العامة'] }
        ]
      },
      'Grammar Basics': {
        objectives: [
          { ar: 'فهم قواعد اللغة الإنجليزية الأساسية', en: 'Understanding basic English grammar rules' },
          { ar: 'التدرب على الأزمنة الرئيسية', en: 'Practicing main tenses' },
          { ar: 'بناء جمل صحيحة', en: 'Building correct sentences' }
        ],
        concepts: [
          { ar: 'الفعل', en: 'Verb', defAr: 'كلمة تدل على فعل أو حالة', defEn: 'A word indicating an action or state' },
          { ar: 'الزمن', en: 'Tense', defAr: 'شكل الفعل الذي يدل على زمان الحدث', defEn: 'The form of the verb indicating the time of the action' },
          { ar: 'الجملة', en: 'Sentence', defAr: 'مجموعة كلمات لها معنى كامل', defEn: 'A group of words with complete meaning' }
        ],
        formulas: [
          { f: 'Present Simple: S + V(s/es)', arExp: 'المضارع البسيط', enExp: 'Present Simple Tense' },
          { f: 'Past Simple: S + V2', arExp: 'الماضي البسيط', enExp: 'Past Simple Tense' },
          { f: 'Future Simple: S + will + V', arExp: 'المستقبل البسيط', enExp: 'Future Simple Tense' }
        ],
        examples: [
          { qAr: 'حول إلى الماضي البسيط: She walks to school', qEn: 'Change to past simple: She walks to school', sAr: 'She walked to school', sEn: 'She walked to school' }
        ],
        questions: [
          { qAr: 'ما الصيغة الصحيحة: He _____ to the cinema yesterday', qEn: 'What is the correct form: He _____ to the cinema yesterday', answer: 'went', options: ['go', 'goes', 'went', 'going'] }
        ]
      }
    }
  },
  
  // اللغة الفرنسية
  'اللغة الفرنسية': {
    lessons: {
      'الأبجدية والنطق': {
        objectives: [
          { ar: 'التعرف على الحروف الفرنسية ونطقها', en: 'Learning French letters and pronunciation' },
          { ar: 'فهم قواعد النطق الفرنسية', en: 'Understanding French pronunciation rules' },
          { ar: 'التدرب على نطق الكلمات بشكل صحيح', en: 'Practicing correct word pronunciation' }
        ],
        concepts: [
          { ar: 'الحروف المتحركة', en: 'Vowels', defAr: 'A, E, I, O, U, Y - حروف تُنطق دون عائق', defEn: 'Letters pronounced without obstruction' },
          { ar: 'الحروف الساكنة', en: 'Consonants', defAr: 'الحروف التي تحتاج لتوقف جزئي في النطق', defEn: 'Letters requiring partial stop in pronunciation' },
          { ar: 'النبر', en: 'Accent', defAr: 'علامات تغير نطق الحروف (é, è, ê)', defEn: 'Marks that change letter pronunciation' }
        ],
        examples: [
          { qAr: 'نطق الحروف الفرنسية المميزة', qEn: 'Pronunciation of distinctive French letters', sAr: 'J = ج (جو), R = ر (مقصوصة), U = يو', sEn: 'J = zh, R = guttural r, U = yu' }
        ],
        questions: [
          { qAr: 'كيف ينطق حرف R في الفرنسية؟', qEn: 'How is R pronounced in French?', answer: 'مقصوصة من الحلق', options: ['مثل الإنجليزية', 'مقصوصة من الحلق', 'صامت', 'مثل العربية'] }
        ]
      },
      'التحيات والتعارف': {
        objectives: [
          { ar: 'تعلم التحيات الأساسية في الفرنسية', en: 'Learning basic greetings in French' },
          { ar: 'التدرب على التعارف بالفرنسية', en: 'Practicing introductions in French' },
          { ar: 'استخدام الضمائر المناسبة', en: 'Using appropriate pronouns' }
        ],
        concepts: [
          { ar: 'التحية الرسمية', en: 'Formal Greeting', defAr: 'Bonjour, Bonsoir - تستخدم مع الغرباء', defEn: 'Used with strangers' },
          { ar: 'التحية غير الرسمية', en: 'Informal Greeting', defAr: 'Salut, Coucou - تستخدم مع الأصدقاء', defEn: 'Used with friends' },
          { ar: 'صيغة المخاطب', en: 'Address Form', defAr: 'Tu (أنت) للصديق، Vous (أنتما/أنتم) للرسمي', defEn: 'Tu for friend, Vous for formal' }
        ],
        examples: [
          { qAr: 'تحيات أساسية', qEn: 'Basic greetings', sAr: 'Bonjour = صباح الخير\nBonsoir = مساء الخير\nAu revoir = مع السلامة\nMerci = شكراً', sEn: 'Bonjour = Good morning\nBonsoir = Good evening\nAu revoir = Goodbye\nMerci = Thank you' }
        ],
        questions: [
          { qAr: 'ما معنى Bonjour؟', qEn: 'What does Bonjour mean?', answer: 'صباح الخير', options: ['صباح الخير', 'مساء الخير', 'مع السلامة', 'شكراً'] }
        ]
      }
    }
  },
  
  // الفلسفة والمنطق
  'الفلسفة والمنطق': {
    lessons: {
      'ما هي الفلسفة؟': {
        objectives: [
          { ar: 'التعرف على مفهوم الفلسفة', en: 'Understanding the concept of philosophy' },
          { ar: 'معرفة أهمية التفكير الفلسفي', en: 'Knowing the importance of philosophical thinking' },
          { ar: 'فهم الفرق بين الفلسفة والعلوم الأخرى', en: 'Understanding the difference between philosophy and other sciences' }
        ],
        concepts: [
          { ar: 'الفلسفة', en: 'Philosophy', defAr: 'حب الحكمة - التفكير العقلاني في المسائل الأساسية', defEn: 'Love of wisdom - rational thinking about fundamental issues' },
          { ar: 'الحكمة', en: 'Wisdom', defAr: 'المعرفة العميقة والقدرة على التطبيق السليم', defEn: 'Deep knowledge and ability to apply correctly' },
          { ar: 'التساؤل الفلسفي', en: 'Philosophical Questioning', defAr: 'طرح الأسئلة الجذرية عن الوجود والمعرفة والقيم', defEn: 'Asking radical questions about existence, knowledge, and values' }
        ],
        examples: [
          { qAr: 'الأسئلة الفلسفية الأساسية', qEn: 'Fundamental philosophical questions', sAr: 'من نحن؟ ما الحقيقة؟ ما العدل؟ ما المعنى؟', sEn: 'Who are we? What is truth? What is justice? What is meaning?' }
        ],
        questions: [
          { qAr: 'ما أصل كلمة فلسفة؟', qEn: 'What is the origin of the word philosophy?', answer: 'يوناني (فيلو صوفيا)', options: ['عربي', 'يوناني', 'لاتيني', 'فارسي'] },
          { qAr: 'ما معنى فيلو صوفيا؟', qEn: 'What does philo-sophia mean?', answer: 'حب الحكمة', options: ['البحث عن الحقيقة', 'حب الحكمة', 'التفكير المنطقي', 'دراسة الطبيعة'] }
        ]
      },
      'أساسيات المنطق': {
        objectives: [
          { ar: 'التعرف على مفهوم المنطق', en: 'Understanding the concept of logic' },
          { ar: 'معرفة أنواع الاستدلال', en: 'Knowing types of reasoning' },
          { ar: 'التدرب على التفكير المنطقي', en: 'Practicing logical thinking' }
        ],
        concepts: [
          { ar: 'المنطق', en: 'Logic', defAr: 'علم يدرس قواعد التفكير السليم', defEn: 'The science that studies the rules of correct thinking' },
          { ar: 'الاستدلال', en: 'Reasoning', defAr: 'انتقال الذهن من مقدمات إلى نتيجة', defEn: 'The mind moving from premises to a conclusion' },
          { ar: 'القياس', en: 'Syllogism', defAr: 'شكل منطقي يتكون من مقدمتين ونتيجة', defEn: 'A logical form consisting of two premises and a conclusion' }
        ],
        examples: [
          { qAr: 'مثال على القياس المنطقي', qEn: 'Example of logical syllogism', sAr: 'كل إنسان فانٍ (كبرى)\nسقراط إنسان (صغرى)\nإذن سقراط فانٍ (نتيجة)', sEn: 'All humans are mortal (major)\nSocrates is human (minor)\nTherefore, Socrates is mortal (conclusion)' }
        ],
        questions: [
          { qAr: 'ما هو المنطق؟', qEn: 'What is logic?', answer: 'علم قواعد التفكير السليم', options: ['علم الرياضيات', 'علم قواعد التفكير السليم', 'علم النفس', 'علم اللغة'] }
        ]
      }
    }
  }
};

// ==================== دالة إضافة المحتوى ====================

async function addLessonContent(lesson: any, content: any) {
  // إضافة الأهداف
  if (content.objectives) {
    for (let i = 0; i < content.objectives.length; i++) {
      const obj = content.objectives[i];
      await db.objective.create({
        data: {
          id: `obj_${Math.random().toString(36).substr(2, 16)}`,
          lessonId: lesson.id,
          textAr: obj.ar,
          textEn: obj.en,
          order: i + 1
        }
      });
    }
  }

  // إضافة المفاهيم
  if (content.concepts) {
    for (let i = 0; i < content.concepts.length; i++) {
      const concept = content.concepts[i];
      await db.concept.create({
        data: {
          id: `con_${Math.random().toString(36).substr(2, 16)}`,
          lessonId: lesson.id,
          termAr: concept.ar,
          termEn: concept.en,
          definitionAr: concept.defAr,
          definitionEn: concept.defEn,
          order: i + 1
        }
      });
    }
  }

  // إضافة القوانين
  if (content.formulas) {
    for (let i = 0; i < content.formulas.length; i++) {
      const formula = content.formulas[i];
      await db.formula.create({
        data: {
          id: `for_${Math.random().toString(36).substr(2, 16)}`,
          lessonId: lesson.id,
          formula: formula.f,
          explanationAr: formula.arExp,
          explanationEn: formula.enExp,
          order: i + 1
        }
      });
    }
  }

  // إضافة الأمثلة
  if (content.examples) {
    for (let i = 0; i < content.examples.length; i++) {
      const example = content.examples[i];
      await db.example.create({
        data: {
          id: `exa_${Math.random().toString(36).substr(2, 16)}`,
          lessonId: lesson.id,
          questionAr: example.qAr,
          questionEn: example.qEn,
          solutionAr: example.sAr,
          solutionEn: example.sEn,
          stepsAr: example.steps || '',
          stepsEn: example.steps || '',
          order: i + 1
        }
      });
    }
  }

  // إضافة الأسئلة
  if (content.questions) {
    for (let i = 0; i < content.questions.length; i++) {
      const q = content.questions[i];
      await db.question.create({
        data: {
          id: `que_${Math.random().toString(36).substr(2, 16)}`,
          lessonId: lesson.id,
          type: 'mcq',
          questionAr: q.qAr,
          questionEn: q.qEn,
          optionsAr: JSON.stringify(q.options),
          optionsEn: JSON.stringify(q.options),
          answer: q.answer,
          points: 1,
          order: i + 1
        }
      });
    }
  }
}

async function main() {
  console.log('=== Starting Content Seed ===');
  
  // جلب كل الدروس بدون محتوى
  const lessons = await db.lesson.findMany({
    include: {
      Unit: { include: { Subject: { include: { AcademicYear: true } } } },
      _count: { select: { Objective: true } }
    }
  });
  
  const lessonsWithoutContent = lessons.filter(l => l._count.Objective === 0);
  console.log(`Found ${lessonsWithoutContent.length} lessons without content`);
  
  let added = 0;
  
  for (const lesson of lessonsWithoutContent) {
    const subjectName = lesson.Unit.Subject.nameAr;
    const lessonTitle = lesson.titleAr;
    
    // البحث عن المحتوى المناسب
    const subjectContent = firstYearContent[subjectName];
    if (subjectContent?.lessons?.[lessonTitle]) {
      console.log(`Adding content for: ${subjectName} - ${lessonTitle}`);
      await addLessonContent(lesson, subjectContent.lessons[lessonTitle]);
      added++;
    } else {
      // إضافة محتوى افتراضي
      console.log(`Adding default content for: ${subjectName} - ${lessonTitle}`);
      await addLessonContent(lesson, {
        objectives: [
          { ar: `فهم درس ${lessonTitle}`, en: `Understanding ${lessonTitle}` }
        ],
        concepts: [
          { ar: 'المفهوم الأساسي', en: 'Basic Concept', defAr: `شرح ${lessonTitle}`, defEn: `Explanation of ${lessonTitle}` }
        ],
        questions: [
          { qAr: `ما هو الهدف من درس ${lessonTitle}؟`, qEn: `What is the purpose of ${lessonTitle}?`, answer: 'الفهم', options: ['الفهم', 'الحفظ', 'التكرار', 'النسخ'] }
        ]
      });
      added++;
    }
  }
  
  console.log(`\n=== Done! Added content to ${added} lessons ===`);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
