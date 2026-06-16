# 📚 التوثيق التقني الشامل لمنصة SmartEdu

## 🎯 نظرة عامة

منصة **SmartEdu** هي منصة تعليمية تفاعلية للمرحلة الثانوية المصرية، تقدم محتوى تعليمي شامل مع محاكيات تفاعلية وأدوات تعليمية متقدمة.

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
│   ├── simulations/              # مكونات المحاكيات
│   │   ├── SimulationCard.tsx    # بطاقة المحاكاة
│   │   ├── MindMapEditor.tsx     # محرر الخرائط الذهنية
│   │   ├── InfographicEditor.tsx # محرر الإنفوجرافيك
│   │   ├── physics/              # محاكيات الفيزياء
│   │   ├── chemistry/            # محاكيات الكيمياء
│   │   ├── math/                 # محاكيات الرياضيات
│   │   └── biology/              # محاكيات الأحياء
│   ├── tools/                    # أدوات تعليمية
│   │   ├── ScientificCalculator.tsx  # الآلة الحاسبة العلمية
│   │   └── UnitConverter.tsx     # محول الوحدات
│   ├── MindMap.tsx               # عرض الخريطة الذهنية
│   ├── Infographic.tsx           # عرض الإنفوجرافيك
│   └── ThemeToggle.tsx           # تبديل الوضع الليلي
│
├── lib/                          # المكتبات والأدوات المساعدة
│   ├── db.ts                     # اتصال قاعدة البيانات (Prisma)
│   ├── static-data.ts            # جلب البيانات من JSON
│   ├── simulations.ts            # بيانات المحاكيات
│   ├── i18n.tsx                  # دعم تعدد اللغات
│   └── utils.ts                  # دوال مساعدة
│
├── hooks/                        # React Hooks
│   ├── useApi.ts                 # جلب البيانات من API
│   └── use-toast.ts              # إشعارات Toast
│
└── data/                         # بيانات ثابتة
    └── lessons.ts                # بيانات الدروس

public/
├── data/
│   └── curriculum.json           # بيانات المنهج الكاملة
├── logo.jpeg                     # شعار المنصة
└── favicon.ico                   # أيقونة المتصفح

prisma/
└── schema.prisma                 # مخطط قاعدة البيانات
```

---

## 📊 قاعدة البيانات (Prisma Schema)

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
- إحصائيات المنصة (عدد الدروس، المحاكيات، الأسئلة)
- الميزات الرئيسية (تعلم تفاعلي، تحديات، ذكاء اصطناعي)
- المواد الدراسية المتاحة
- آراء الطلاب
- روابط السوشيال ميديا

**المكونات المستخدمة:**
- `motion` (Framer Motion) للحركات
- `Button`, `Badge`, `Card` من shadcn/ui
- أيقونات `lucide-react`

---

### 2. صفحة المنصة (`/platform`)
**الملف:** `src/app/platform/page.tsx`

**الوظيفة:** نقطة الدخول للمنصة التعليمية:
- عرض السنوات الدراسية الثلاث
- روابط سريعة للمحاكيات والأدوات
- إحصائيات المنصة

**مصدر البيانات:** `getAcademicYearsStatic()` من `/data/curriculum.json`

---

### 3. صفحة السنة الدراسية (`/platform/year/[code]`)
**الملف:** `src/app/platform/year/[code]/page.tsx`

**الوظيفة:** عرض:
- معلومات السنة الدراسية
- التخصصات المتاحة (للصف الثاني والثالث)
- المواد الدراسية حسب التخصص

**المعاملات:** `code` = `first-year` | `second-year` | `third-year`

---

### 4. صفحة المادة الدراسية (`/platform/subject/[id]`)
**الملف:** `src/app/platform/subject/[id]/page.tsx`

**الوظيفة:** عرض:
- معلومات المادة
- الوحدات الدراسية
- الدروس في كل وحدة
- شريط التقدم

---

### 5. صفحة الدرس (`/platform/lesson/[id]`)
**الملف:** `src/app/platform/lesson/[id]/page.tsx`

**الوظيفة:** صفحة الدرس الشاملة مع تبويبات:

| التبويب | المحتوى |
|---------|---------|
| **المحتوى** | مقدمة الدرس وملخصه |
| **الأهداف** | أهداف الدرس التعليمية |
| **المفاهيم** | المصطلحات والتعريفات |
| **الصيغ** | القوانين والمعادلات |
| **الأمثلة** | أمثلة محلولة خطوة بخطوة |
| **المحاكيات** | محاكيات تفاعلية مرتبطة بالدرس |
| **الاختبار** | أسئلة اختيار من متعدد |

**المكونات المستخدمة:**
- `InteractiveQuiz` للاختبارات
- `SimulationList` لعرض المحاكيات
- `Tabs` للتنقل بين الأقسام

---

### 6. صفحة المحاكيات (`/platform/simulations`)
**الملف:** `src/app/platform/simulations/page.tsx`

**الوظيفة:**
- عرض جميع المحاكيات التعليمية
- فلترة حسب النوع (فيزياء، كيمياء، رياضيات، أحياء)
- البحث في المحاكيات

---

### 7. صفحة الأدوات (`/platform/tools`)
**الملف:** `src/app/platform/tools/page.tsx`

**الوظيفة:** أدوات تعليمية متنوعة:
- آلة حاسبة علمية
- محول وحدات
- جدول دوري
- ورقة الصيغ

---

## 🧪 نظام المحاكيات

### الملف الرئيسي: `src/lib/simulations.ts`

```typescript
interface Simulation {
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
```

### المحاكيات المتاحة (24+ محاكاة):

#### الفيزياء:
| المحاكاة | الوصف | النوع |
|----------|-------|-------|
| الحركة المنتظمة | فهم العلاقة بين المسافة والزمن والسرعة | experiment |
| قوانين نيوتن | قوانين الحركة الثلاثة | experiment |
| تحولات الطاقة | حفظ وتحول الطاقة | visualization |
| الموجات | خصائص وأنواع الموجات | visualization |
| الدوائر الكهربائية | بناء وفحص الدوائر | experiment |
| الضوء والمرايا | الانعكاس والانكسار | experiment |

#### الكيمياء:
| المحاكاة | الوصف | النوع |
|----------|-------|-------|
| البناء الذري | تركيب الذرة والجسيمات | visualization |
| الجدول الدوري | استكشاف العناصر | visualization |
| الروابط الكيميائية | أنواع الروابط | experiment |
| التفاعلات الكيميائية | موازنة المعادلات | experiment |
| المحاليل | التركيز والتخفيف | experiment |

#### الرياضيات:
| المحاكاة | الوصف | النوع |
|----------|-------|-------|
| راسم الدوال | رسم وتحليل الدوال | calculator |
| حل المعادلات | حل خطوة بخطوة | calculator |
| الهندسة | إنشاء الأشكال الهندسية | visualization |
| دائرة الوحدة | الدوال المثلثية | visualization |
| الاشتقاق والتكامل | مفاهيم التفاضل | visualization |

#### الأحياء:
| المحاكاة | الوصف | النوع |
|----------|-------|-------|
| الخلية | مكونات ووظائف الخلية | visualization |
| DNA | تركيب ووظيفة DNA | visualization |
| الوراثة | قوانين مندل | experiment |
| النظام البيئي | التوازن البيئي | visualization |

### دوال المساعدة:
```typescript
// جلب محاكيات درس معين
getSimulationsByLessonId(lessonId: string): Simulation[]

// جلب محاكيات مادة معينة
getSimulationsBySubject(subjectName: string): Simulation[]

// جلب المحاكيات المجانية
getFreeSimulations(): Simulation[]
```

---

## 📝 نظام الاختبارات

### المكون: `src/components/quiz/InteractiveQuiz.tsx`

**المميزات:**
- عرض سؤال بسؤال
- شريط تقدم
- تغذية راجعة فورية
- شرح لكل إجابة
- نظام نقاط
- تقييم الأداء (ممتاز/جيد/يحتاج مراجعة)

**هيكل السؤال:**
```typescript
interface Question {
  id: string;
  type: string;
  questionAr: string;
  questionEn: string;
  optionsAr?: string;  // JSON string
  optionsEn?: string;  // JSON string
  answer: string;
  explanationAr?: string;
  explanationEn?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

---

## 🛠️ الأدوات التعليمية

### 1. الآلة الحاسبة العلمية
**الملف:** `src/components/tools/ScientificCalculator.tsx`

**الوظائف:**
- العمليات الأساسية (+, -, ×, ÷)
- الدوال المثلثية (sin, cos, tan)
- اللوغاريتمات (log, ln)
- الجذور والأسس
- المضروب (factorial)
- الذاكرة (MS, MR, MC)

### 2. محول الوحدات
**الملف:** `src/components/tools/UnitConverter.tsx`

**التحويلات:**
- الطول (متر، قدم، بوصة...)
- الكتلة (كيلوجرام، جنيه...)
- درجة الحرارة (سيليزي، فهرنهايت)
- الوقت، السرعة، الحجم

---

## 🌐 مصدر البيانات

### الطريقة 1: من JSON ثابت (للنشر الثابت)
```typescript
// src/lib/static-data.ts
const data = await fetch('/data/curriculum.json');
```

### الطريقة 2: من قاعدة البيانات (للتطوير)
```typescript
// src/lib/db.ts
import { db } from '@/lib/db';
const subjects = await db.subject.findMany();
```

---

## 📋 هيكل ملف البيانات (`public/data/curriculum.json`)

```json
{
  "academicYears": [
    {
      "id": "year-1",
      "nameAr": "الصف الأول الثانوي",
      "nameEn": "First Year Secondary",
      "code": "first-year",
      "Subject": [
        {
          "id": "subject-id",
          "nameAr": "الفيزياء",
          "nameEn": "Physics",
          "icon": "Atom",
          "color": "#8B5CF6",
          "Unit": [
            {
              "id": "unit-id",
              "nameAr": "وحدة الحركة",
              "nameEn": "Motion Unit",
              "Lesson": [
                {
                  "id": "lesson-id",
                  "titleAr": "عنوان الدرس",
                  "titleEn": "Lesson Title",
                  "introductionAr": "المقدمة...",
                  "summaryAr": "الملخص...",
                  "Objective": [],
                  "Concept": [],
                  "Formula": [],
                  "Example": [],
                  "Question": []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🎨 نظام الأنماط والتصميم

### الألوان الرئيسية:
```css
--purple-600: #9333EA;   /* اللون الأساسي */
--pink-600: #DB2777;     /* اللون الثانوي */
--cyan-500: #06B6D4;     /* للإبراز */
--orange-500: #F97316;   /* للتحذيرات */
```

### التدرجات:
```css
gradient-primary: from-purple-600 to-pink-600
gradient-accent: from-cyan-500 to-blue-500
gradient-hero: from-purple-500/20 via-pink-500/20 to-orange-500/20
```

### RTL Support:
- دعم كامل للغة العربية
- تبديل تلقائي لاتجاه النص
- ترجمة لجميع النصوص

---

## 📱 الاستجابة (Responsive Design)

### نقاط التوقف:
```css
sm: 640px   /* الهواتف الكبيرة */
md: 768px   /* الأجهزة اللوحية */
lg: 1024px  /* الحواسيب المحمولة */
xl: 1280px  /* الشاشات الكبيرة */
```

---

## 🔄 خطة العمل للنواقص

### الأولوية العالية:
1. ✅ نظام المحاكيات - مكتمل
2. ✅ نظام الاختبارات - مكتمل
3. ✅ الآلة الحاسبة العلمية - مكتمل
4. 🔄 محول الوحدات - يحتاج تحسين
5. 🔄 الخرائط الذهنية - مبدئي
6. 🔄 الإنفوجرافيك - مبدئي

### الأولوية المتوسطة:
1. 🔄 الجدول الدوري التفاعلي
2. 🔄 ورقة الصيغ الشاملة
3. 🔄 نظام الشارات والإنجازات
4. 🔄 نظام النقاط

### الأولوية المنخفضة:
1. ⏳ نظام التقدم والحفظ
2. ⏳ وضع عدم الاتصال
3. ⏳ نظام الملاحظات

---

## 📈 إحصائيات المحتوى

| العنصر | العدد |
|--------|-------|
| السنوات الدراسية | 3 |
| المواد الدراسية | 18+ |
| الوحدات الدراسية | 50+ |
| الدروس | 1,152+ |
| المحاكيات | 24+ |
| الأسئلة | 5,000+ |

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

## 📝 ملاحظات مهمة

1. **النشر الثابت:** المنصة مصممة للنشر كـ Static Site باستخدام `output: "export"`
2. **البيانات:** جميع البيانات تُحمل من `/data/curriculum.json` في وضع الإنتاج
3. **اللغات:** دعم كامل للعربية والإنجليزية
4. **الأداء:** استخدام الـ Caching وتحسين الصور
5. **إمكانية الوصول:** دعم قارئات الشاشة والتنقل بلوحة المفاتيح

---

## 📂 تفاصيل الملفات الرئيسية

### صفحة الدرس (`src/app/platform/lesson/[id]/page.tsx`)
- **التبويبات:** المحتوى، الأهداف، المفاهيم، الصيغ، الأمثلة، المحاكيات، الاختبار
- **البيانات:** تُحمل من `loadStaticData()`
- **المحاكيات:** `getSimulationsByLessonId()`
- **الاختبار:** `InteractiveQuiz` component

### المكونات التفاعلية:
| المكون | المسار | الوظيفة |
|--------|--------|---------|
| InteractiveQuiz | `components/quiz/` | اختبار تفاعلي |
| SimulationCard | `components/simulations/` | بطاقة محاكاة |
| ScientificCalculator | `components/tools/` | آلة حاسبة |
| UnitConverter | `components/tools/` | محول وحدات |
| MindMap | `components/` | خريطة ذهنية |
| Infographic | `components/` | إنفوجرافيك |

---

*آخر تحديث: يونيو 2025*
