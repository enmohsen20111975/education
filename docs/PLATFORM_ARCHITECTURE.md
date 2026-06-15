# 📚 التوثيق التقني الشامل لمنصة SmartEdu

## 🎯 نظرة عامة

منصة **SmartEdu** هي منصة تعليمية تفاعلية للمرحلة الثانوية المصرية، تقدم محتوى تعليمي شامل مع **111 محاكي تفاعلي** و **23 خريطة ذهنية** و **25 مخطط بياني** وأدوات تعليمية متقدمة.

---

## 📊 إحصائيات المحتوى (محدث يونيو 2025)

### المحتوى التفاعلي:
| العنصر | العدد | الحالة |
|--------|-------|--------|
| **المحاكيات التفاعلية** | 111 | ✅ مكتمل |
| **الخرائط الذهنية** | 23 | ✅ مكتمل |
| **المخططات البيانية** | 25 | ✅ مكتمل |

### إجمالي المحتوى:
| العنصر | العدد |
|--------|-------|
| السنوات الدراسية | 3 |
| المواد الدراسية | 39 |
| الوحدات الدراسية | 130+ |
| الدروس | 444 |
| الأسئلة | 8,000+ |

---

## 🗂️ هيكل المجلدات

```
src/
├── app/                          # صفحات Next.js (App Router)
│   ├── page.tsx                  # الصفحة الرئيسية (Landing Page)
│   ├── layout.tsx                # التخطيط الرئيسي
│   ├── globals.css               # الأنماط العامة
│   ├── api/                      # واجهات API
│   │   ├── subjects/route.ts     # جلب المواد الدراسية
│   │   ├── lessons/route.ts      # جلب الدروس
│   │   ├── lessons/[id]/route.ts # جلب درس محدد
│   │   ├── structure/route.ts    # هيكل المنهج
│   │   └── seed-*/route.ts       # سكريبتات تهيئة البيانات
│   └── platform/                 # صفحات المنصة
│       ├── page.tsx              # صفحة اختيار السنة الدراسية
│       ├── layout.tsx            # تخطيط المنصة
│       ├── year/[code]/page.tsx  # صفحة السنة الدراسية
│       ├── subject/[id]/page.tsx # صفحة المادة الدراسية
│       ├── lesson/[id]/page.tsx  # صفحة الدرس
│       ├── simulations/          # صفحات المحاكيات
│       │   ├── page.tsx          # قائمة المحاكيات
│       │   └── [id]/page.tsx     # صفحة محاكاة محددة
│       └── tools/page.tsx        # صفحة الأدوات
│
├── components/                   # المكونات القابلة لإعادة الاستخدام
│   ├── ui/                       # مكونات shadcn/ui
│   ├── quiz/                     # مكونات الاختبارات
│   │   └── InteractiveQuiz.tsx   # اختبار تفاعلي
│   ├── simulators/               # ⭐ 92 ملف محاكي تفاعلي
│   │   ├── MotionSimulator.tsx
│   │   ├── WaveSimulator.tsx
│   │   ├── FreeFallSimulator.tsx
│   │   ├── ForcesSimulator.tsx
│   │   ├── EnergySimulator.tsx
│   │   ├── ProjectileSimulator.tsx
│   │   ├── PeriodicTableSimulator.tsx
│   │   ├── FunctionsSimulator.tsx
│   │   ├── ... (92 محاكي)
│   │   └── MaxMinSimulator.tsx
│   ├── mindmap/                  # مكونات الخرائط الذهنية
│   │   └── MindMapViewer.tsx     # عارض الخرائط الذهنية
│   ├── tools/                    # أدوات تعليمية
│   │   ├── ScientificCalculator.tsx  # الآلة الحاسبة العلمية
│   │   └── UnitConverter.tsx     # محول الوحدات
│   ├── simulatorComponents.ts    # تصدير وربط المحاكيات
│   └── ThemeToggle.tsx           # تبديل الوضع الليلي
│
├── lib/                          # المكتبات والأدوات المساعدة
│   ├── db.ts                     # اتصال قاعدة البيانات (Prisma)
│   ├── static-data.ts            # جلب البيانات من JSON
│   ├── simulations.ts            # ⭐ بيانات 111 محاكي
│   ├── simulatorMap.ts           # ⭐ ربط IDs بالمكونات
│   ├── mindmaps.ts               # ⭐ بيانات 23 خريطة ذهنية
│   ├── charts.ts                 # ⭐ بيانات 25 مخطط بياني
│   ├── i18n.tsx                  # دعم تعدد اللغات
│   └── utils.ts                  # دوال مساعدة
│
├── hooks/                        # React Hooks
│   ├── useApi.ts                 # جلب البيانات من API
│   └── use-toast.ts              # إشعارات Toast
│
└── data/                         # بيانات ثابتة
    └── lessons.ts                # بيانات الدروس
```

---

## 🧪 نظام المحاكيات (111 محاكي)

### الملف الرئيسي: `src/lib/simulations.ts`

```typescript
interface Simulation {
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
```

### توزيع المحاكيات حسب المادة:

| المادة | العدد | الأنواع |
|--------|-------|---------|
| **الفيزياء** | 56 | ميكانيكا، موجات، ضوء، كهرباء، مغناطيسية |
| **الكيمياء** | 25 | ذرات، روابط، تفاعلات، محاليل |
| **الرياضيات** | 30 | جبر، هندسة، مثلثات، تفاضل وتكامل |
| **أخرى** | - | جغرافيا، أدوات عامة |

### المحاكيات حسب الفئة:

#### 🔬 الفيزياء - الميكانيكا (25 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| الحركة المنتظمة | MotionSimulator.tsx | العلاقة بين المسافة والزمن والسرعة |
| السرعة والتسارع | VelocitySimulator.tsx | سرعة متوسطة ولحظية |
| الرسوم البيانية للحركة | MotionGraphSimulator.tsx | s-t, v-t, a-t graphs |
| معادلات الحركة | MotionEquationsSimulator.tsx | حسابات الحركة المتسارعة |
| السقوط الحر | FreeFallSimulator.tsx | تأثير الجاذبية |
| السقوط على الكواكب | PlanetaryFallSimulator.tsx | مقارنة الجاذبية |
| القوى | ForcesSimulator.tsx | قوانين نيوتن |
| الاحتكاك | FrictionSimulator.tsx | أنواع الاحتكاك |
| المقذوفات | ProjectileSimulator.tsx | مسارات المقذوفات |
| الطاقة | EnergySimulator.tsx | حركية وكامنة |
| البندول | PendulumSimulator.tsx | الحركة التوافقية |
| الزنبرك | SpringSimulator.tsx | قانون هوك |
| الحركة الدائرية | CircularMotionSimulator.tsx | القوة المركزية |
| الجاذبية | GravitySimulator.tsx | قانون نيوتن للجذب |
| الأقمار الصناعية | SatelliteSimulator.tsx | المدارات |
| الزخم | MomentumSimulator.tsx | التصادمات |
| الديناميكا الحرارية | ThermodynamicsSimulator.tsx | قوانين الحرارة |

#### 🌊 الفيزياء - الموجات (15 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| الموجات المستعرضة | WaveSimulator.tsx | خصائص الموجات |
| تداخل الموجات | WaveInterferenceSimulator.tsx | بناء وهدم |
| انعكاس الموجات | WaveReflectionSimulator.tsx | أطراف ثابتة ومتحركة |
| الموجات الواقفة | StandingWaveSimulator.tsx | عقد وبطون |
| الموجات الصوتية | SoundWaveSimulator.tsx | خصائص الصوت |
| تأثير دوبلر | DopplerSimulator.tsx | انزياح التردد |
| الرنين | ResonanceSimulator.tsx | الرنين الصوتي |

#### 💡 الفيزياء - الضوء والبصريات (5 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| انعكاس الضوء | LightReflectionSimulator.tsx | قانون الانعكاس |
| انكسار الضوء | LightRefractionSimulator.tsx | قانون سنيل |
| العدسات | LensesSimulator.tsx | تكوين الصور |
| الحيود | DiffractionSimulator.tsx | حيود الضوء |
| الشق المزدوج | DoubleSlitSimulator.tsx | تجربة يونج |

#### ⚡ الفيزياء - الكهرباء والمغناطيسية (16 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| الشحنة الكهربائية | ElectricChargeSimulator.tsx | قانون كولوم |
| المجال الكهربائي | ElectricFieldSimulator.tsx | خطوط المجال |
| الجهد الكهربائي | ElectricPotentialSimulator.tsx | الطاقة الكامنة |
| الدوائر الكهربائية | CircuitSimulator.tsx | دوائر بسيطة |
| التوالي والتوازي | SeriesParallelSimulator.tsx | حساب المقاومات |
| قانون أوم | OhmsLawSimulator.tsx | V=IR |
| القدرة الكهربائية | ElectricPowerSimulator.tsx | P=VI |
| المغناطيسية | MagnetismSimulator.tsx | المجال المغناطيسي |
| خطوط المجال | MagneticFieldLinesSimulator.tsx | رسم الخطوط |
| المغناطيس الكهربائي | ElectromagnetSimulator.tsx | الملفات |
| الحث الكهرومغناطيسي | InductionSimulator.tsx | قانون فاراداي |
| المحول | TransformerSimulator.tsx | تحويل الجهد |
| المحرك | MotorSimulator.tsx | المبدأ |

#### ⚗️ الكيمياء - البنية الذرية (6 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| البناء الذري | AtomStructureSimulator.tsx | البروتونات والنيوترونات |
| النماذج الذرية | AtomicModelsSimulator.tsx | دالتون إلى بور |
| التوزيع الإلكتروني | ElectronConfigurationSimulator.tsx | مستويات الطاقة |
| الأفلاك الإلكترونية | OrbitalsSimulator.tsx | s, p, d, f |
| الجدول الدوري | PeriodicTableSimulator.tsx | استكشاف العناصر |
| الاتجاهات الدورية | PeriodicTrendsSimulator.tsx | نصف القطر، التأين |

#### 🔬 الكيمياء - الروابط والتفاعلات (13 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| الرابطة الأيونية | IonicBondSimulator.tsx | انتقال الإلكترونات |
| الرابطة التساهمية | CovalentBondSimulator.tsx | مشاركة الإلكترونات |
| الرابطة الفلزية | MetallicBondSimulator.tsx | بحر الإلكترونات |
| هندسة الجزيئات | MolecularGeometrySimulator.tsx | VSEPR |
| قوى التجاذب | IntermolecularForcesSimulator.tsx | فان دير فالس |
| أنواع التفاعلات | ReactionTypesSimulator.tsx | اتحاد، تحلل، إحلال |
| موازنة المعادلات | BalancingEquationsSimulator.tsx | لعبة تفاعلية |
| طاقة التنشيط | ActivationEnergySimulator.tsx | المحفزات |
| التوازن الكيميائي | ChemicalEquilibriumSimulator.tsx | لوشاتيليه |
| سرعة التفاعل | ReactionRateSimulator.tsx | العوامل المؤثرة |
| المحاليل | SolutionsSimulator.tsx | المولارية |
| الأحماض والقواعد | AcidsBasesSimulator.tsx | مقياس pH |

#### 📐 الرياضيات - الجبر (9 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| المعادلات الخطية | LinearEquationsSimulator.tsx | ax + b = c |
| رسم الخط المستقيم | LineGraphSimulator.tsx | y = mx + b |
| تقاطع المستقيمات | LineIntersectionSimulator.tsx | نقطة التقاطع |
| المعادلات التربيعية | QuadraticEquationsSimulator.tsx | المميز والجذور |
| القطع المكافئ | ParabolaGraphSimulator.tsx | الرأس والجذور |
| الصيغة العامة | QuadraticFormulaSimulator.tsx | تطبيق الصيغة |
| أنظمة المعادلات | SystemsEquationsSimulator.tsx | حلول متعددة |
| اللوغاريتمات | LogarithmsSimulator.tsx | الخصائص |
| المصفوفات | MatricesSimulator.tsx | العمليات |

#### 📏 الرياضيات - الهندسة (8 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| الزوايا | AnglesSimulator.tsx | قياس وتصنيف |
| المضلعات | PolygonsSimulator.tsx | خصائص |
| الدائرة | CircleGeometrySimulator.tsx | محيط ومساحة |
| المساحة والحجم | AreaVolumeSimulator.tsx | أشكال هندسية |
| فيثاغورس | PythagoreanSimulator.tsx | الإثبات |
| المتجهات | VectorsSimulator.tsx | جمع وطرح |
| الضرب الاتجاهي | DotProductSimulator.tsx | الإسقاط |
| الضرب المتجهي | CrossProductSimulator.tsx | قاعدة اليد اليمنى |

#### 📊 الرياضيات - المثلثات والتفاضل (13 محاكي):
| المحاكاة | الملف | الوصف |
|----------|-------|-------|
| الدوال المثلثية | TrigFunctionsSimulator.tsx | sin, cos, tan |
| دائرة الوحدة | TrigonometrySimulator.tsx | العلاقات |
| المنحنيات المثلثية | TrigCurvesSimulator.tsx | الرسم |
| المتطابقات | TrigIdentitiesSimulator.tsx | التحقق |
| قانون الجيب | LawOfSinesSimulator.tsx | حل المثلثات |
| قانون جيب التمام | LawOfCosinesSimulator.tsx | SAS, SSS |
| النهايات | LimitsSimulator.tsx | التعريف |
| المشتقات | DerivativesSimulator.tsx | الخط المماس |
| التكاملات | IntegralsSimulator.tsx | المساحة |
| المساحة تحت المنحنى | AreaUnderCurveSimulator.tsx | Riemann |
| القيم العظمى والدنيا | MaxMinSimulator.tsx | النقاط الحرجة |

### ربط المحاكيات: `src/lib/simulatorMap.ts`

```typescript
export const simulatorMap: Record<string, SimulatorComponent> = {
  // 111 محاكي مربوط بمكوناته
  'sim-physics-motion-1': MotionSimulator,
  'sim-physics-wave-1': WaveSimulator,
  // ... (111 محاكي)
};
```

---

## 🧠 نظام الخرائط الذهنية (23 خريطة)

### الملف الرئيسي: `src/lib/mindmaps.ts`

```typescript
interface MindMapNode {
  id: string;
  textAr: string;
  textEn: string;
  children?: MindMapNode[];
  color?: string;
}

interface MindMap {
  id: string;
  lessonId: string;
  titleAr: string;
  titleEn: string;
  subject: 'physics' | 'chemistry' | 'math' | 'biology';
  rootNode: MindMapNode;
}
```

### توزيع الخرائط:

| المادة | العدد | الخرائط |
|--------|-------|---------|
| **الفيزياء** | 7 | الحركة، القوى، الطاقة، الموجات، الكهرباء، المغناطيسية، البصريات |
| **الكيمياء** | 6 | الذرة، الجدول الدوري، الروابط، التفاعلات، التوازن، المحاليل |
| **الرياضيات** | 7 | الجبر، الدوال، المثلثات، التفاضل والتكامل، الهندسة، المصفوفات، المتجهات |
| **عام** | 3 | المنهج العلمي، الوحدات، الأخطاء التجريبية |

### أمثلة على الخرائط:

#### خريطة الحركة (Physics):
```
الحركة
├── أنواع الحركة
│   ├── حركة منتظمة
│   ├── حركة متسارعة
│   ├── حركة دائرية
│   └── حركة مقذوفات
├── الكميات الحركية
│   ├── الإزاحة (Δx)
│   ├── السرعة (v)
│   ├── التسارع (a)
│   └── الزمن (t)
├── معادلات الحركة
│   ├── v = v₀ + at
│   ├── x = x₀ + v₀t + ½at²
│   └── v² = v₀² + 2aΔx
└── الرسوم البيانية
    ├── موضع-زمن
    ├── سرعة-زمن
    └── تسارع-زمن
```

### عارض الخرائط: `src/components/mindmap/MindMapViewer.tsx`

**المميزات:**
- Canvas-based rendering
- تكبير وتصغير
- سحب وتحريك
- تحديد العقد
- دعم RTL
- تصميم تفاعلي

---

## 📈 نظام المخططات البيانية (25 مخطط)

### الملف الرئيسي: `src/lib/charts.ts`

```typescript
interface EducationalChart {
  id: string;
  lessonId: string;
  titleAr: string;
  titleEn: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar';
  subject: 'physics' | 'chemistry' | 'math';
  data: ChartData;
  formulas?: { ar: string; en: string }[];
  insights?: { ar: string; en: string }[];
}
```

### توزيع المخططات:

| المادة | العدد | الأنواع |
|--------|-------|---------|
| **الفيزياء** | 10 | سرعات، جاذبية، حركة، طاقة، موجات، طيف، صوت |
| **الكيمياء** | 8 | نصف قطر، طاقة تأين، سالبية، روابط، pH، ذوبانية |
| **الرياضيات** | 7 | تربيعية، مثلثية، أسية، مشتقات، تكامل، توزيع طبيعي |

### أمثلة على المخططات:

1. **مقارنة سرعات الحيوانات** (Bar Chart)
2. **تسارع الجاذبية على الكواكب** (Bar Chart)
3. **منحنيات الحركة** (Line Chart)
4. **أنواع الطاقة** (Pie Chart)
5. **العلاقة بين التردد والطول الموجي** (Line Chart)
6. **الطيف الكهرومغناطيسي** (Bar Chart)
7. **نصف القطر الذري** (Bar Chart)
8. **طاقة التأين** (Line Chart)
9. **السالبية الكهربائية** (Bar Chart)
10. **مقياس pH** (Bar Chart)

---

## 📋 قاعدة البيانات (Prisma Schema)

### الجداول الرئيسية:

| الجدول | الوصف | العلاقات |
|--------|-------|----------|
| **AcademicYear** | السنوات الدراسية | Subject[], User[] |
| **Specialization** | التخصصات (علمي/أدبي) | Subject[], User[] |
| **Subject** | المواد الدراسية | Unit[], AcademicYear, Specialization |
| **Unit** | الوحدات الدراسية | Lesson[], Subject |
| **Lesson** | الدروس | Concept[], Formula[], Example[], Question[], Objective[] |
| **Concept** | المفاهيم | Lesson |
| **Formula** | الصيغ والقوانين | Lesson |
| **Example** | الأمثلة التوضيحية | Lesson |
| **Question** | أسئلة الاختبار | Lesson |
| **Objective** | أهداف الدرس | Lesson |
| **Simulator** | المحاكيات التعليمية | LessonSimulator[] |
| **User** | المستخدمين | Progress[], QuizResult[] |
| **Progress** | تقدم الطالب | User, Lesson |
| **Badge** | الشارات والإنجازات | UserBadge[] |

---

## 🖥️ الشاشات والصفحات

### 1. الصفحة الرئيسية (`/`)
**الملف:** `src/app/page.tsx`

**الوظيفة:** صفحة هبوط جذابة تعرض:
- العنوان الرئيسي والشعار
- إحصائيات المنصة (111 محاكي، 23 خريطة، 25 مخطط)
- الميزات الرئيسية
- المواد الدراسية المتاحة

---

### 2. صفحة الدرس (`/platform/lesson/[id]`)
**الملف:** `src/app/platform/lesson/[id]/page.tsx`

**التبويبات:**
| التبويب | المحتوى |
|---------|---------|
| **المحتوى** | مقدمة الدرس وملخصه |
| **الأهداف** | أهداف الدرس التعليمية |
| **المفاهيم** | المصطلحات والتعريفات |
| **الصيغ** | القوانين والمعادلات |
| **الأمثلة** | أمثلة محلولة |
| **المحاكيات** | محاكيات تفاعلية مرتبطة |
| **الاختبار** | أسئلة اختيار من متعدد |

---

## 🎨 نظام الأنماط والتصميم

### الألوان الرئيسية:
```css
--purple-600: #9333EA;   /* اللون الأساسي */
--pink-600: #DB2777;     /* اللون الثانوي */
--cyan-500: #06B6D4;     /* للإبراز */
--orange-500: #F97316;   /* للتحذيرات */
```

### RTL Support:
- دعم كامل للغة العربية
- تبديل تلقائي لاتجاه النص
- ترجمة لجميع النصوص

---

## 🚀 أوامر التشغيل

```bash
# تشغيل بيئة التطوير
bun run dev

# بناء المشروع
bun run build

# تصدير كـ Static Site
bun run export

# تهيئة قاعدة البيانات
bun run db:push

# فحص الكود
bun run lint
```

---

## 📂 الملفات الرئيسية الجديدة

| الملف | الوصف | الحجم |
|-------|-------|-------|
| `src/lib/simulations.ts` | بيانات 111 محاكي | ~15KB |
| `src/lib/simulatorMap.ts` | ربط المحاكيات بالمكونات | ~8KB |
| `src/lib/mindmaps.ts` | 23 خريطة ذهنية | ~25KB |
| `src/lib/charts.ts` | 25 مخطط بياني | ~18KB |
| `src/components/simulators/*.tsx` | 92 محاكي تفاعلي | ~500KB |
| `src/components/mindmap/MindMapViewer.tsx` | عارض الخرائط | ~6KB |

---

## ✅ حالة المشروع (يونيو 2025)

| الميزة | الحالة |
|--------|--------|
| المحاكيات التفاعلية (111) | ✅ مكتمل |
| الخرائط الذهنية (23) | ✅ مكتمل |
| المخططات البيانية (25) | ✅ مكتمل |
| نظام الاختبارات | ✅ مكتمل |
| الآلة الحاسبة العلمية | ✅ مكتمل |
| محول الوحدات | ✅ مكتمل |
| دعم RTL | ✅ مكتمل |
| دعم ثنائي اللغة | ✅ مكتمل |

---

## 📝 ملاحظات مهمة

1. **النشر الثابت:** المنصة مصممة للنشر كـ Static Site
2. **البيانات:** جميع البيانات تُحمل من `/data/curriculum.json`
3. **اللغات:** دعم كامل للعربية والإنجليزية
4. **الأداء:** استخدام الـ Caching وتحسين الصور
5. **إمكانية الوصول:** دعم قارئات الشاشة والتنقل بلوحة المفاتيح

---

*آخر تحديث: يونيو 2025 - تم إضافة 92 محاكي جديد، 23 خريطة ذهنية، و25 مخطط بياني*
