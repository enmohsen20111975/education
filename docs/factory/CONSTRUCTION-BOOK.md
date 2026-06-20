# 📖 دليل البناء الكامل — SmartEdu Data Factory

> **Full Instruction & Construction Book Reference**
> **الإصدار**: 1.0.0
> **التاريخ**: يوليو 2025
> **الحالة**: المرجع الرسمي الكامل للبناء
> **المستودع**: [GitHub — education](https://github.com/enmohsen20111975/education)
> **المسار المحلي (Windows)**: `D:\My WebStie Applications\Mywebsite applications final\Smart_Education\education`

---

## 📋 جدول المحتويات

### Part A: البناء التقني (Technical Construction)
1. [نظرة عامة على البناء](#part-a-البناء-التقني-technical-construction)
2. [هيكل المشروع التفصيلي](#2-هيكل-المشروع-التفصيلي-detailed-project-structure)
3. [بناء الواجهة الأمامية](#3-بناء-الواجهة-الأمامية-frontend-construction)
4. [بناء قاعدة البيانات](#4-بناء-قاعدة-البيانات-database-construction)
5. [بناء الـ API](#5-بناء-الـ-api-api-construction)
6. [بناء المصنع](#6-بناء-المصنع-factory-construction)

### Part B: مرجع التكامل (Integration Reference)
7. [تكامل المنصة والمصنع](#7-تكامل-المنصة-والمصنع-platform-factory-integration)
8. [تكامل نماذج الذكاء الاصطناعي](#8-تكامل-نماذج-الذكاء-الاصطناعي-ai-models-integration)
9. [تكامل الأنظمة الخارجية](#9-تكامل-الأنظمة-الخارجية-external-systems-integration)

### Part C: إرشادات البناء والتعديل (Build & Modify Guide)
10. [كيفية إضافة صفحة جديدة](#10-كيفية-إضافة-صفحة-جديدة)
11. [كيفية إضافة مكون جديد](#11-كيفية-إضافة-مكون-جديد)
12. [كيفية إضافة جدول جديد في DB](#12-كيفية-إضافة-جدول-جديد-في-db)
13. [كيفية إضافة API endpoint جديد](#13-كيفية-إضافة-api-endpoint-جديد)
14. [كيفية إضافة نوع محتوى بصري جديد](#14-كيفية-إضافة-نوع-محتوى-بصري-جديد)
15. [كيفية إضافة مرحلة فيديو جديدة](#15-كيفية-إضافة-مرحلة-فيديو-جديدة)

### Part D: المراجع التقنية (Technical References)
16. [ملف package.json كامل بالشرح](#16-ملف-packagejson-كامل-بالشرح)
17. [ملف next.config.ts بالشرح](#17-ملف-nextconfigts-بالشرح)
18. [ملف prisma/schema.prisma بالشرح](#18-ملف-prismaschemaprisma-بالشرح)
19. [ملف .env بالشرح](#19-ملف-env-بالشرح)
20. [قائمة المكونات shadcn/ui المستخدمة](#20-قائمة-المكونات-shadcnui-المستخدمة)

---

# Part A: البناء التقني (Technical Construction)

## 1. نظرة عامة على البناء

### 1.1 ما تم بناؤه

منصة **SmartEdu** (تعلم ذكي) هي منصة تعليمية تفاعلية شاملة للمرحلة الثانوية المصرية (الصف الأول والثاني والثالث الثانوي)، تدعم الشعب العلمية (علمي رياضيات / علمي علوم) والأدبية.

### 1.2 إحصائيات الكود

| البند | العدد |
|-------|-------|
| إجمالي ملفات المصدر (`src/`) | **253 ملف** |
| إجمالي أسطر الكود المصدري | **~92,066 سطر** |
| مكونات المحاكيات (Simulators) | **106 ملف .tsx** |
| مكونات shadcn/ui | **53 ملف .tsx** |
| ملفات CSS عالمية | **1 ملف** (230 سطر) |
| جدول قاعدة البيانات (Prisma Models) | **20 جدول** |
| الصفحات (App Router) | **10 صفحات رئيسية + ملفات Client** |
| API Routes | **22 endpoint** |
| لغات مدعومة | **عربي + إنجليزي** |

### 1.3 المحتوى التعليمي

| البند | الكمية |
|-------|--------|
| السنوات الدراسية | 3 (أولى / ثانية / ثالثة ثانوي) |
| التخصصات | علمي رياضيات / علمي علوم / أدبي |
| المواد الدراسية | **74 مادة** |
| الدروس | **1,152+ درس** |
| المحاكيات التفاعلية | **111 محاكي** |
| الأسئلة | **5,000+ سؤال** |
| الوحدات الدراسية | 200+ وحدة |
| الخرائط الذهنية | **23 خريطة** |
| المخططات البيانية | **25 مخطط** |

### 1.4 ملخص تاريخ البناء (Git Sessions)

تم بناء المشروع عبر عدة جلسات تطوير متتالية:

**الجلسة 1 — التأسيس الأساسي**
- إنشاء مشروع Next.js 15 مع TypeScript
- إعداد Tailwind CSS 3.4 + shadcn/ui (new-york style)
- تصميم وإنشاء Landing Page كاملة
- بناء هيكل App Router الأساسي (`/platform`, `/platform/year/[code]`)
- إعداد Prisma ORM مع SQLite
- إنشاء الـ 20 جدول في قاعدة البيانات

**الجلسة 2 — المحتوى والبيانات**
- بناء 74 مادة دراسية عبر 3 سنوات
- إنشاء 1,152+ درس ببيانات عربية/إنجليزية
- كتابة Seed Scripts لملء قاعدة البيانات
- بناء نظام التخصصات (Science Math / Science / Arts)
- إعداد Static Data Export لـ `curriculum.json`

**الجلسة 3 — المحاكيات التفاعلية (92+ محاكي)**
- بناء 106 ملف محاكي (Physics / Chemistry / Math / Biology)
- إنشاء `simulatorMap.ts` للربط بين المعرفات والمكونات
- بناء صفحة `/platform/simulations` مع البحث والفلترة
- بناء صفحة `/platform/simulations/[id]` لعرض المحاكي

**الجلسة 4 — الأدوات والاختبارات**
- بناء `ScientificCalculator.tsx` — آلة حاسبة علمية
- بناء `UnitConverter.tsx` — محول وحدات
- بناء `InteractiveQuiz.tsx` — نظام اختبارات تفاعلي
- إنشاء صفحة `/platform/tools`

**الجلسة 5 — نظام اللغات والثيمات**
- بناء `i18n.tsx` — نظام لغات مخصص (Arabic/English)
- إعداد `ThemeProvider.tsx` مع next-themes
- دعم RTL/LTR تلقائي
- تصميم CSS Variables للـ Light/Dark mode

**الجلسة 6 — المحتوى البصري المتقدم**
- بناء `MindMapViewer.tsx` — عارض الخرائط الذهنية
- بناء `Infographic.tsx` — عارض الإنفوجرافيك
- بناء `ContentRenderer.tsx` — محتوى تفاعلي
- بناء `MathRenderer.tsx` — عرض المعادلات الرياضية (KaTeX)
- بناء `ScienceDiagrams.tsx` — رسوم علمية
- بناء `GeographicMaps.tsx` — خرائط جغرافية
- بناء `GeometricDiagrams.tsx` — رسوم هندسية

**الجلسة 7 — المصنع (Data Factory)**
- كتابة POD (Product Requirements Document)
- كتابة PLAN (خطة التنفيذ)
- تصميم هيكل `mini-services/control-center/`

### 1.5 التقنيات الأساسية

| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| Next.js | 15.1.7 | إطار العمل الرئيسي (App Router) |
| React | 18.2.0 | مكتبة الواجهة |
| TypeScript | 5.3.3 | لغة البرمجة |
| Prisma | 6.11.1 | ORM لقاعدة البيانات |
| SQLite | — | قاعدة البيانات (ملف `db/custom.db`) |
| Tailwind CSS | 3.4.1 | إطار التصميم |
| shadcn/ui | new-york | مكتبة المكونات |
| Framer Motion | 11.0.3 | الرسوم المتحركة |
| next-themes | 0.2.1 | نظام الثيمات (Dark/Light) |
| KaTeX | 0.17.0 | عرض المعادلات الرياضية |
| Lucide React | 0.312.0 | أيقونات |
| Recharts | 2.12.0 | رسوم بيانية |

---

## 2. هيكل المشروع التفصيلي (Detailed Project Structure)

### 2.1 الشجرة الكاملة للمشروع

```
education/
├── 📄 package.json                      # إعدادات المشروع والتبعيات
├── 📄 next.config.ts                    # إعدادات Next.js
├── 📄 tailwind.config.ts                # إعدادات Tailwind CSS
├── 📄 tsconfig.json                     # إعدادات TypeScript
├── 📄 components.json                   # إعدادات shadcn/ui
├── 📄 postcss.config.mjs                # إعدادات PostCSS
├── 📄 eslint.config.mjs                 # إعدادات ESLint
├── 📄 vercel.json                       # إعدادات Vercel (للاستضافة)
├── 📄 Caddyfile                         # إعدادات Caddy (للاستضافة)
├── 📄 .env                              # متغيرات البيئة (غير موجود في Git)
│
├── 📁 prisma/
│   ├── 📄 schema.prisma                 # مخطط قاعدة البيانات (20 جدول)
│   └── 📄 seed.ts                       # سكربت البذور الأساسي
│
├── 📁 db/
│   └── 📄 custom.db                     # ملف SQLite (قاعدة البيانات)
│
├── 📁 public/
│   ├── 🖼️ logo.jpeg                     # شعار المنصة
│   ├── 🖼️ logo.svg                      # شعار SVG
│   ├── 🖼️ favicon.ico                   # أيقونة المتصفح
│   ├── 📄 robots.txt                    # تعليمات عناكب البحث
│   └── 📁 data/
│       ├── 📄 curriculum.json           # البيانات التعليمية الكاملة (Static Export)
│       ├── 📄 question-bank.json        # بنك الأسئلة
│       └── 📄 question-bank-bilingual.json  # بنك الأسئلة ثنائي اللغة
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx                # Root Layout (ThemeProvider + Toaster)
│   │   ├── 📄 page.tsx                  # Landing Page (صفحة رئيسية تسويقية)
│   │   ├── 📄 globals.css               # الأنماط العالمية + CSS Variables
│   │   │
│   │   ├── 📁 platform/                 # 🎯 منطقة المنصة التعليمية
│   │   │   ├── 📄 layout.tsx            # Platform Layout (LanguageProvider)
│   │   │   ├── 📄 page.tsx              # صفحة اختيار السنة الدراسية
│   │   │   │
│   │   │   ├── 📁 year/[code]/
│   │   │   │   ├── 📄 page.tsx          # Server Component — generateStaticParams
│   │   │   │   └── 📄 YearClient.tsx    # Client Component — عرض التخصصات والمواد
│   │   │   │
│   │   │   ├── 📁 subject/[id]/
│   │   │   │   ├── 📄 page.tsx          # Server Component — generateStaticParams
│   │   │   │   ├── 📄 SubjectClient.tsx # Client Component — عرض الوحدات والدروس
│   │   │   │   └── 📄 SubjectPageClient.tsx
│   │   │   │
│   │   │   ├── 📁 lesson/[id]/
│   │   │   │   ├── 📄 page.tsx          # Server Component — generateStaticParams
│   │   │   │   ├── 📄 LessonClient.tsx  # Client Component — عرض الدرس الكامل
│   │   │   │   └── 📄 LessonPageClient.tsx
│   │   │   │
│   │   │   ├── 📁 simulations/
│   │   │   │   ├── 📄 page.tsx          # صفحة كل المحاكيات مع البحث والفلترة
│   │   │   │   └── 📁 [id]/
│   │   │   │       ├── 📄 page.tsx      # صفحة المحاكي الفردي
│   │   │   │       └── 📄 SimulationClient.tsx
│   │   │   │
│   │   │   └── 📁 tools/
│   │   │       └── 📄 page.tsx          # صفحة الأدوات (حاسبة + محول وحدات)
│   │   │
│   │   └── 📁 api/                      # 🎯 API Routes
│   │       ├── 📄 route.ts              # API root
│   │       ├── 📄 seed/route.ts         # Seed database
│   │       ├── 📄 seed-complete/route.ts
│   │       ├── 📄 seed-lessons/route.ts
│   │       ├── 📄 seed-lessons-v2/route.ts
│   │       ├── 📄 seed-all-lessons/route.ts
│   │       ├── 📄 seed-curriculum/route.ts
│   │       ├── 📄 seed-egyptian/route.ts
│   │       ├── 📄 content/seed/route.ts
│   │       ├── 📄 subjects/route.ts     # GET /api/subjects
│   │       ├── 📄 structure/route.ts    # GET /api/structure
│   │       ├── 📄 simulators/route.ts   # GET /api/simulators
│   │       ├── 📄 progress/route.ts     # POST /api/progress
│   │       ├── 📄 lessons/route.ts      # GET /api/lessons
│   │       ├── 📁 lessons/[id]/
│   │       │   └── 📄 route.ts          # GET /api/lessons/:id
│   │       ├── 📁 units/[id]/lessons/
│   │       │   └── 📄 route.ts          # GET /api/units/:id/lessons
│   │       ├── 📄 debug-db/route.ts     # Debug endpoint
│   │       ├── 📄 debug-subjects/route.ts
│   │       ├── 📄 check-specializations/route.ts
│   │       ├── 📄 fix-specializations/route.ts
│   │       └── 📄 cleanup-duplicates/route.ts
│   │
│   ├── 📁 components/
│   │   ├── 📄 ThemeProvider.tsx         # مزود الثيم (Dark/Light)
│   │   ├── 📄 ThemeToggle.tsx           # زر تبديل الثيم
│   │   ├── 📄 MainPlatform.tsx          # المكون الرئيسي للمنصة
│   │   ├── 📄 LessonView.tsx            # عرض الدرس
│   │   ├── 📄 MindMap.tsx               # خريطة ذهنية
│   │   ├── 📄 Infographic.tsx           # إنفوجرافيك
│   │   ├── 📄 RewardsSystem.tsx         # نظام المكافآت
│   │   ├── 📄 simulatorComponents.ts    # مكونات المحاكيات المساعدة
│   │   │
│   │   ├── 📁 ui/                       # 🎯 مكونات shadcn/ui (53 ملف)
│   │   │   ├── 📄 accordion.tsx
│   │   │   ├── 📄 alert-dialog.tsx
│   │   │   ├── 📄 alert.tsx
│   │   │   ├── 📄 aspect-ratio.tsx
│   │   │   ├── 📄 avatar.tsx
│   │   │   ├── 📄 badge.tsx
│   │   │   ├── 📄 breadcrumb.tsx
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 calendar.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 carousel.tsx
│   │   │   ├── 📄 chart.tsx
│   │   │   ├── 📄 checkbox.tsx
│   │   │   ├── 📄 collapsible.tsx
│   │   │   ├── 📄 command.tsx
│   │   │   ├── 📄 context-menu.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   ├── 📄 drawer.tsx
│   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   ├── 📄 form.tsx
│   │   │   ├── 📄 hover-card.tsx
│   │   │   ├── 📄 input-otp.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 label.tsx
│   │   │   ├── 📄 menubar.tsx
│   │   │   ├── 📄 navigation-menu.tsx
│   │   │   ├── 📄 pagination.tsx
│   │   │   ├── 📄 popover.tsx
│   │   │   ├── 📄 progress.tsx
│   │   │   ├── 📄 radio-group.tsx
│   │   │   ├── 📄 resizable.tsx
│   │   │   ├── 📄 scroll-area.tsx
│   │   │   ├── 📄 select.tsx
│   │   │   ├── 📄 separator.tsx
│   │   │   ├── 📄 sheet.tsx
│   │   │   ├── 📄 sidebar.tsx
│   │   │   ├── 📄 skeleton.tsx
│   │   │   ├── 📄 slider.tsx
│   │   │   ├── 📄 sonner.tsx
│   │   │   ├── 📄 switch.tsx
│   │   │   ├── 📄 table.tsx
│   │   │   ├── 📄 tabs.tsx
│   │   │   ├── 📄 textarea.tsx
│   │   │   ├── 📄 toaster.tsx
│   │   │   ├── 📄 toast.tsx
│   │   │   ├── 📄 toggle-group.tsx
│   │   │   ├── 📄 toggle.tsx
│   │   │   ├── 📄 tooltip.tsx
│   │   │   ├── 📄 ContentRenderer.tsx   # مخصص — محتوى تعليمي
│   │   │   ├── 📄 MathRenderer.tsx      # مخصص — عرض KaTeX
│   │   │   ├── 📄 ScienceDiagrams.tsx   # مخصص — رسوم علمية
│   │   │   ├── 📄 GeographyMaps.tsx     # مخصص — خرائط
│   │   │   └── 📄 GeometricDiagrams.tsx # مخصص — رسوم هندسية
│   │   │
│   │   ├── 📁 quiz/                     # 🎯 نظام الاختبارات
│   │   │   ├── 📄 index.ts              # Exports
│   │   │   └── 📄 InteractiveQuiz.tsx   # مكون الاختبار التفاعلي
│   │   │
│   │   ├── 📁 simulators/               # 🎯 106 ملف محاكي
│   │   │   ├── (Physics — 45+ محاكي)
│   │   │   │   ├── 📄 MotionSimulator.tsx
│   │   │   │   ├── 📄 WaveSimulator.tsx
│   │   │   │   ├── 📄 FreeFallSimulator.tsx
│   │   │   │   ├── 📄 ForcesSimulator.tsx
│   │   │   │   ├── 📄 EnergySimulator.tsx
│   │   │   │   ├── 📄 ProjectileSimulator.tsx
│   │   │   │   ├── 📄 MomentumSimulator.tsx
│   │   │   │   ├── 📄 GravitySimulator.tsx
│   │   │   │   ├── 📄 PendulumSimulator.tsx
│   │   │   │   ├── 📄 SpringSimulator.tsx
│   │   │   │   ├── 📄 FrictionSimulator.tsx
│   │   │   │   ├── 📄 VelocitySimulator.tsx
│   │   │   │   ├── 📄 SatelliteSimulator.tsx
│   │   │   │   ├── 📄 CircuitSimulator.tsx
│   │   │   │   ├── 📄 ElectricCircuitSimulator.tsx
│   │   │   │   ├── 📄 OhmsLawSimulator.tsx
│   │   │   │   ├── 📄 ElectricFieldSimulator.tsx
│   │   │   │   ├── 📄 ElectricChargeSimulator.tsx
│   │   │   │   ├── 📄 ElectricPowerSimulator.tsx
│   │   │   │   ├── 📄 ElectricPotentialSimulator.tsx
│   │   │   │   ├── 📄 SeriesParallelSimulator.tsx
│   │   │   │   ├── 📄 MagnetismSimulator.tsx
│   │   │   │   ├── 📄 MagneticFieldLinesSimulator.tsx
│   │   │   │   ├── 📄 ElectromagnetSimulator.tsx
│   │   │   │   ├── 📄 ElectromagnetismSimulator.tsx
│   │   │   │   ├── 📄 InductionSimulator.tsx
│   │   │   │   ├── 📄 TransformerSimulator.tsx
│   │   │   │   ├── 📄 MotorSimulator.tsx
│   │   │   │   ├── 📄 LightReflectionSimulator.tsx
│   │   │   │   ├── 📄 LightRefractionSimulator.tsx
│   │   │   │   ├── 📄 LensesSimulator.tsx
│   │   │   │   ├── 📄 MirrorSimulator.tsx
│   │   │   │   ├── 📄 OpticsSimulator.tsx
│   │   │   │   ├── 📄 WaveInterferenceSimulator.tsx
│   │   │   │   ├── 📄 WaveReflectionSimulator.tsx
│   │   │   │   ├── 📄 StandingWaveSimulator.tsx
│   │   │   │   ├── 📄 SoundWaveSimulator.tsx
│   │   │   │   ├── 📄 DopplerSimulator.tsx
│   │   │   │   ├── 📄 ResonanceSimulator.tsx
│   │   │   │   ├── 📄 DiffractionSimulator.tsx
│   │   │   │   ├── 📄 DoubleSlitSimulator.tsx
│   │   │   │   ├── 📄 MotionGraphSimulator.tsx
│   │   │   │   ├── 📄 MotionEquationsSimulator.tsx
│   │   │   │   ├── 📄 PlanetaryFallSimulator.tsx
│   │   │   │   ├── 📄 CircularMotionSimulator.tsx
│   │   │   │   ├── 📄 TemperatureSimulator.tsx
│   │   │   │   └── 📄 ThermodynamicsSimulator.tsx
│   │   │   │
│   │   │   ├── (Chemistry — 22+ محاكي)
│   │   │   │   ├── 📄 PeriodicTableSimulator.tsx
│   │   │   │   ├── 📄 AtomStructureSimulator.tsx
│   │   │   │   ├── 📄 AtomicModelsSimulator.tsx
│   │   │   │   ├── 📄 ElectronConfigurationSimulator.tsx
│   │   │   │   ├── 📄 OrbitalsSimulator.tsx
│   │   │   │   ├── 📄 PeriodicTrendsSimulator.tsx
│   │   │   │   ├── 📄 ElectronegativitySimulator.tsx
│   │   │   │   ├── 📄 IonicBondSimulator.tsx
│   │   │   │   ├── 📄 CovalentBondSimulator.tsx
│   │   │   │   ├── 📄 MetallicBondSimulator.tsx
│   │   │   │   ├── 📄 ChemicalBondSimulator.tsx
│   │   │   │   ├── 📄 MolecularGeometrySimulator.tsx
│   │   │   │   ├── 📄 IntermolecularForcesSimulator.tsx
│   │   │   │   ├── 📄 PolaritySimulator.tsx
│   │   │   │   ├── 📄 ReactionTypesSimulator.tsx
│   │   │   │   ├── 📄 BalancingEquationsSimulator.tsx
│   │   │   │   ├── 📄 ReactionRateSimulator.tsx
│   │   │   │   ├── 📄 ActivationEnergySimulator.tsx
│   │   │   │   ├── 📄 ChemicalEquilibriumSimulator.tsx
│   │   │   │   ├── 📄 SolutionsSimulator.tsx
│   │   │   │   ├── 📄 AcidsBasesSimulator.tsx
│   │   │   │   └── 📄 PlateTectonicsSimulator.tsx
│   │   │   │
│   │   │   ├── (Math — 20+ محاكي)
│   │   │   │   ├── 📄 FunctionsSimulator.tsx
│   │   │   │   ├── 📄 GeometrySimulator.tsx
│   │   │   │   ├── 📄 TrigonometrySimulator.tsx
│   │   │   │   ├── 📄 TrigFunctionsSimulator.tsx
│   │   │   │   ├── 📄 TrigIdentitiesSimulator.tsx
│   │   │   │   ├── 📄 TrigCurvesSimulator.tsx
│   │   │   │   ├── 📄 QuadraticEquationsSimulator.tsx
│   │   │   │   ├── 📄 QuadraticFormulaSimulator.tsx
│   │   │   │   ├── 📄 SystemsEquationsSimulator.tsx
│   │   │   │   ├── 📄 LinearEquationsSimulator.tsx
│   │   │   │   ├── 📄 MatricesSimulator.tsx
│   │   │   │   ├── 📄 VectorsSimulator.tsx
│   │   │   │   ├── 📄 DotProductSimulator.tsx
│   │   │   │   ├── 📄 CrossProductSimulator.tsx
│   │   │   │   ├── 📄 StatisticsSimulator.tsx
│   │   │   │   ├── 📄 ProbabilitySimulator.tsx
│   │   │   │   ├── 📄 LogarithmsSimulator.tsx
│   │   │   │   ├── 📄 LimitsSimulator.tsx
│   │   │   │   ├── 📄 DerivativesSimulator.tsx
│   │   │   │   ├── 📄 IntegralsSimulator.tsx
│   │   │   │   ├── 📄 AreaUnderCurveSimulator.tsx
│   │   │   │   ├── 📄 MaxMinSimulator.tsx
│   │   │   │   ├── 📄 LineGraphSimulator.tsx
│   │   │   │   ├── 📄 ParabolaGraphSimulator.tsx
│   │   │   │   ├── 📄 LineIntersectionSimulator.tsx
│   │   │   │   ├── 📄 AnglesSimulator.tsx
│   │   │   │   ├── 📄 PythagoreanSimulator.tsx
│   │   │   │   ├── 📄 PolygonsSimulator.tsx
│   │   │   │   ├── 📄 LawOfSinesSimulator.tsx
│   │   │   │   ├── 📄 LawOfCosinesSimulator.tsx
│   │   │   │   ├── 📄 CircleGeometrySimulator.tsx
│   │   │   │   └── 📄 AreaVolumeSimulator.tsx
│   │   │   │
│   │   │   ├── (Biology — 5+ محاكي)
│   │   │   │   ├── 📄 CellSimulator.tsx
│   │   │   │   ├── 📄 GeneticsSimulator.tsx
│   │   │   │   ├── 📄 DNAsimulator.tsx
│   │   │   │   ├── 📄 PhotosynthesisSimulator.tsx
│   │   │   │   └── 📄 WaterCycleSimulator.tsx
│   │   │   │
│   │   │   └── 📄 SimulationCard.tsx   # بطاقة المحاكي في القائمة
│   │   │
│   │   ├── 📁 simulations/              # 🎯 محاكيات متقدمة (قديمة)
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 SimulationCard.tsx
│   │   │   ├── 📄 MindMapEditor.tsx
│   │   │   ├── 📄 InfographicEditor.tsx
│   │   │   ├── 📁 physics/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 ProjectileSimulator.tsx
│   │   │   │   ├── 📄 WaveSimulation.tsx
│   │   │   │   ├── 📄 MotionSimulation.tsx
│   │   │   │   └── 📄 ElectricCircuitSimulation.tsx
│   │   │   ├── 📁 chemistry/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 ReactionBalancerSimulator.tsx
│   │   │   │   ├── 📄 PeriodicTableSimulation.tsx
│   │   │   │   ├── 📄 AtomicStructureSimulation.tsx
│   │   │   │   └── 📄 ChemicalBondSimulator.tsx
│   │   │   ├── 📁 math/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 GeometrySimulator.tsx
│   │   │   │   ├── 📄 StatisticsSimulator.tsx
│   │   │   │   ├── 📄 FunctionGrapher.tsx
│   │   │   │   └── 📄 TrigonometrySimulator.tsx
│   │   │   └── 📁 biology/
│   │   │       ├── 📄 index.ts
│   │   │       ├── 📄 MitosisSimulator.tsx
│   │   │       ├── 📄 CellSimulation.tsx
│   │   │       ├── 📄 DNAsimulator.tsx
│   │   │       └── 📄 PunnettSquareSimulator.tsx
│   │   │
│   │   ├── 📁 tools/                    # 🎯 الأدوات التعليمية
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 ScientificCalculator.tsx
│   │   │   └── 📄 UnitConverter.tsx
│   │   │
│   │   ├── 📁 mindmap/                  # 🎯 نظام الخرائط الذهنية
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 MindMapViewer.tsx
│   │   │
│   │   └── 📁 lesson/                   # 🎯 مكونات الدرس
│   │       └── 📄 LessonResources.tsx
│   │
│   ├── 📁 lib/                          # 🎯 المكتبات والأدوات
│   │   ├── 📄 utils.ts                  # cn() helper + أدوات مساعدة
│   │   ├── 📄 db.ts                     # Prisma Client (singleton pattern)
│   │   ├── 📄 i18n.tsx                  # نظام اللغات (LanguageProvider + useLanguage)
│   │   ├── 📄 static-data.ts            # محمل البيانات الثابتة (fetch curriculum.json)
│   │   ├── 📄 static-params.ts          # generateStaticParams — IDs لكل الصفحات الديناميكية
│   │   ├── 📄 simulations.ts            # بيانات 111 محاكي (2,198 سطر)
│   │   ├── 📄 simulatorMap.ts           # خريطة ربط ID → Component (293 سطر)
│   │   ├── 📄 data.ts                   # بيانات إضافية
│   │   ├── 📄 lessons.ts                # بيانات الدروس
│   │   ├── 📄 mindmaps.ts               # بيانات الخرائط الذهنية
│   │   ├── 📄 infographics.ts           # بيانات الإنفوجرافيك
│   │   ├── 📄 charts.ts                 # بيانات الرسوم البيانية
│   │   ├── 📄 arabic-utils.ts           # أدوات معالجة النص العربي
│   │   └── 📄 useApi.ts (في hooks/)     # Custom hook للـ API
│   │
│   ├── 📁 hooks/                        # Custom React Hooks
│   │   ├── 📄 use-toast.ts              # Toast notification hook
│   │   ├── 📄 use-mobile.ts             # Mobile detection hook
│   │   └── 📄 useApi.ts                 # API fetching hook
│   │
│   └── 📁 data/
│       └── 📄 lessons.ts                # بيانات الدروس الثابتة
│
├── 📁 scripts/                          # 🎯 سكربتات التوليد والتحويل
│   ├── 📄 seed-database.ts              # Seed قاعدة البيانات
│   ├── 📄 seed-first-year.ts            # بذر بيانات الصف الأول
│   ├── 📄 seed-second-year.ts           # بذر بيانات الصف الثاني
│   ├── 📄 seed-third-year.ts            # بذر بيانات الصف الثالث
│   ├── 📄 seed-complete-content.ts      # بذر المحتوى الكامل
│   ├── 📄 seed-comprehensive-content.ts # بذر محتوى شامل
│   ├── 📄 seed-full-content.ts          # بذر المحتوى الكامل
│   ├── 📄 seed-content.ts               # بذر المحتوى
│   ├── 📄 seed-interactive.ts           # بذر المحتوى التفاعلي
│   ├── 📄 batch-generate-content.ts     # توليد محتوى بالجملة
│   ├── 📄 generate-lesson-content.ts    # توليد محتوى درس واحد
│   ├── 📄 generate-content-robust.ts    # توليد محتوى متين
│   ├── 📄 generate-missing-content.ts   # توليد المحتوى المفقود
│   ├── 📄 robust-generate.ts            # توليد متين
│   ├── 📄 generate-questions.ts         # توليد أسئلة
│   ├── 📄 generate-questions-llm.mjs    # توليد أسئلة بـ LLM
│   ├── 📄 generate-bilingual-questions.mjs # أسئلة ثنائية اللغة
│   ├── 📄 export-to-json.ts             # تصدير البيانات إلى JSON
│   ├── 📄 export-to-json.mjs            # تصدير (ESM)
│   ├── 📄 convert-all.py                # تحويل بيانات (Python)
│   ├── 📄 convert-data.py               # تحويل بيانات
│   ├── 📄 convert-external-data.js      # تحويل البيانات الخارجية
│   ├── 📄 converter.mjs                 # محول بيانات
│   ├── 📄 full-converter.mjs            # محول كامل
│   ├── 📄 postbuild.js                  # سكربت بعد البناء
│   ├── 📄 continuous-generate.sh        # توليد مستمر (Shell)
│   └── 📄 fast-generate.sh              # توليد سريع (Shell)
│
├── 📁 external-data/                    # 🎯 بيانات خارجية مستوردة
│   ├── 📄 types.ts                      # أنواع البيانات
│   ├── 📄 grade10.ts                    # بيانات الصف العاشر
│   ├── 📄 grade11.ts                    # بيانات الصف الحادي عشر
│   ├── 📄 grade12.ts                    # بيانات الصف الثاني عشر
│   ├── 📄 questionPool.ts               # بنك الأسئلة
│   └── 📄 lionJourney.ts                # بيانات Lion Journey
│
├── 📁 content/                          # 🎯 محتوى تعليمي خارجي
│   ├── 📄 external-types.ts
│   ├── 📄 external-grade10.ts
│   ├── 📄 external-grade11.ts
│   ├── 📄 external-grade12.ts
│   └── 📁 physics/grade-3/term-1/chapter-01/
│       └── 📄 lesson-01-physical-quantities.md
│
├── 📁 docs/                             # 🎯 التوثيق
│   ├── 📄 PLATFORM_ARCHITECTURE.md      # بنية المنصة
│   ├── 📁 factory/                      # 🎯 توثيق المصنع
│   │   ├── 📄 POD.md                    # Product Requirements Document
│   │   ├── 📄 PLAN.md                   # خطة التنفيذ
│   │   ├── 📄 WORKFLOW.md               # سير العمل
│   │   └── 📄 CONSTRUCTION-BOOK.md      # 📖 هذا الملف
│   └── 📁 lessons/                      # 🎯 محتوى الدروس (Markdown)
│       ├── 📁 first-year/
│       │   ├── 📄 الفيزياء.md
│       │   ├── 📄 الرياضيات.md
│       │   ├── 📄 الكيمياء.md
│       │   └── 📁 term-1/ ... term-2/
│       ├── 📁 second-year/
│       │   ├── 📁 science-math/
│       │   ├── 📁 science-sciences/
│       │   ├── 📁 arts/
│       │   └── 📁 _arts_hidden/
│       └── 📁 third-year/
│           ├── 📁 science-math/
│           ├── 📁 science-sciences/
│           ├── 📁 arts/
│           └── 📁 _arts_hidden/
│
├── 📁 mini-services/                    # 🎯 مصانع البيانات (مخطط — قيد التطوير)
│   └── 📁 control-center/               # Video Factory Dashboard
│       ├── 📁 dashboard-app/            # Next.js Dashboard
│       ├── 📁 lib/db/                   # Factory DB layer
│       ├── 📁 scripts/                  # Video rendering, queue worker
│       ├── 📁 src/components/           # Remotion video components
│       └── 📁 content-extractor/        # Python PDF extraction
│
└── 📁 skills/                           # 🎯 مهارات AI مساعدة (لا علاقة لها بالمنصة مباشرة)
    ├── (skills من z-ai-web-dev-sdk)
    └── ...
```

### 2.2 تدفق البيانات (Data Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Landing Page (/)                            │
│  LanguageProvider → ThemeProvider → Framer Motion Animations    │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Link
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Platform Page (/platform)                          │
│  → loadStaticData() → curriculum.json → getAcademicYearsStatic() │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Select Year
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│         Year Page (/platform/year/[code])                       │
│  → loadStaticData() → Filter by code → Show Specializations    │
│  → Select Specialization → Filter Subjects                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Select Subject
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│        Subject Page (/platform/subject/[id])                    │
│  → loadStaticData() → getSubjectByIdStatic() → Units + Lessons  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Select Lesson
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│         Lesson Page (/platform/lesson/[id])                     │
│  → loadStaticData() → getLessonByIdStatic()                     │
│  → Show: introduction, concepts, formulas, examples, quiz       │
│  → Related simulators via simulatorMap                          │
└─────────────────────────────────────────────────────────────────┘
```

**مصدر البيانات الأساسي**: `public/data/curriculum.json`
- يُحمّل عبر `loadStaticData()` في `src/lib/static-data.ts`
- يُولَّد من قاعدة البيانات عبر سكربتات `scripts/export-to-json.ts`
- يُستخدم في كل الصفحات عبر الـ Client Components

---

## 3. بناء الواجهة الأمامية (Frontend Construction)

### 3.1 Landing Page — `src/app/page.tsx`

**الوصف**: صفحة تسويقية كاملة تعرض مميزات المنصة.

**البنية**:
- `"use client"` — كل الصفحة Client Component
- `LanguageProvider` يلف المحتوى (مغلف في الـ export)
- `useTheme()` من `next-themes` للثيم
- `useLanguage()` من `i18n.tsx` للغات

**الأقسام**:

| القسم | المكونات المستخدمة | الوصف |
|-------|---------------------|-------|
| Navbar | `motion.nav`, `Button`, `Badge` | شريط تنقل ثابت مع زر لغة وثيم |
| Hero | `motion.div`, `AnimatePresence` | عنوان رئيسي + CTA + خلفية متحركة |
| Stats | `motion.div`, `scaleIn` variants | 4 إحصائيات (1152+ درس، 54+ محاكي...) |
| Features | `Card`, `CardContent` | 4 بطاقات مميزات (تفاعلي، مكافآت، AI، مجتمع) |
| Subjects | `motion.div`, `scaleIn` | 6 بطاقات مواد بأيقونات ملونة |
| Testimonials | `Card`, `Star` | 3 شهادات طلاب |
| CTA | `Button`, `motion.div` | دعوة للتسجيل |
| Social | `Instagram`, `Twitter`, `Youtube` | أيقونات تواصل اجتماعي |
| Footer | `motion.a` | شعار + حقوق ملكية |

**الرسوم المتحركة (Framer Motion)**:
- `fadeInUp`: يظهر من الأسفل (`opacity: 0, y: 30 → 1, 0`)
- `staggerContainer`: يظهر الأبناء بالتتابع (`staggerChildren: 0.1`)
- `scaleIn`: يظهر بالتكبير (`scale: 0 → 1`, spring animation)
- `floatAnimation`: يطفو للأعلى والأسفل (`y: [0, -10, 0]`، تكرار لا نهائي)

### 3.2 Platform Page — `src/app/platform/page.tsx`

**الوصف**: صفحة اختيار السنة الدراسية.

**البنية**:
- `"use client"` — Client Component
- يستخدم `getAcademicYearsStatic()` لتحميل السنوات من `curriculum.json`
- يعرض 3 بطاقات سنوات (أولى / ثانية / ثالثة)
- يعرض بطاقتين للأدوات المميزة (المحاكيات + الآلة الحاسبة)
- يعرض 4 إحصائيات سريعة

**تدرجات ألوان السنوات**:
- الصف الأول: `from-purple-400 to-pink-500`
- الصف الثاني: `from-cyan-400 to-blue-500`
- الصف الثالث: `from-orange-400 to-red-500`

### 3.3 Year Page — `src/app/platform/year/[code]/`

**البنية المزدوجة (Server + Client)**:
- `page.tsx` (Server Component): يستدعي `generateStaticParams()` من `static-params.ts` ويستقبل `params` كـ `Promise` (Next.js 15 pattern)
- `YearClient.tsx` (Client Component): يعرض التخصصات والمواد

**تدفق البيانات**:
1. `YearClient` يستقبل `yearCode` كـ prop
2. يستدعي `loadStaticData()` لتحميل `curriculum.json`
3. يفلتر البيانات بالـ `yearCode`
4. يعرض التخصصات (Science Math / Science / Arts) كـ Tabs
5. عند اختيار تخصص، يفلتر المواد ويعرضها

**دعم التخصصات**:
- `science`: تدرج أخضر (`from-green-500 to-teal-500`) + أيقونة Atom
- `math`: تدرج أزرق (`from-blue-500 to-cyan-500`) + أيقونة Calculator
- `arts`: تدرج برتقالي (`from-orange-500 to-red-500`) + أيقونة BookOpen
- `common`: المواد المشتركة بين كل التخصصات

### 3.4 Subject Page — `src/app/platform/subject/[id]/`

**البنية**:
- `page.tsx` (Server): `generateStaticParams()` → يستقبل `params` كـ `Promise`
- `SubjectClient.tsx` (Client): يعرض الوحدات والدروس

**المحتوى**:
- Header مع اسم المادة + زر العودة
- قائمة الوحدات مع الدروس بداخلها (Accordion أو Cards)
- كل درس يعرض: العنوان، المدة، حالة المجانية/المقفلة
- رابط لكل درس `/platform/lesson/[id]`

### 3.5 Lesson Page — `src/app/platform/lesson/[id]/`

**البنية**:
- `page.tsx` (Server): `generateStaticParams()` → 496 lesson ID
- `LessonClient.tsx` (Client): عرض الدرس الكامل

**محتوى الدرس**:
- العنوان والمقدمة (introductionAr/En)
- أهداف الدرس (Objectives)
- المفاهيم الأساسية (Concepts) مع التعريفات
- الصيغ الرياضية (Formulas) مع الشرح
- أمثلة محلولة (Examples) مع الخطوات
- المحاكيات المرتبطة (عبر `simulatorMap`)
- الاختبار التفاعلي (InteractiveQuiz)
- ملخص الدرس (summaryAr/En)

### 3.6 Simulations Page — `src/app/platform/simulations/page.tsx`

**الوصف**: صفحة عرض كل المحاكيات مع البحث والفلترة.

**الوظائف**:
- بحث بالعنوان والوصف (عربي + إنجليزي)
- فلترة حسب النوع (Physics / Chemistry / Math / Biology / Interactive)
- عرض بطاقات المحاكيات مجمعة حسب النوع
- كل بطاقة تعرض: الأيقونة، العنوان، الوصف، زر "افتح المحاكي"

**مصدر البيانات**: `simulations` array من `src/lib/simulations.ts` (111 محاكي)

### 3.7 Simulation Detail — `src/app/platform/simulations/[id]/`

**البنية**:
- `page.tsx` (Server): يعرض المحاكي المطلوب
- `SimulationClient.tsx` (Client): يبحث في `simulatorMap` ويستدعي المكون المناسب

**آلية الربط**: `simulatorMap.ts` يربط معرف المحاكي (مثل `sim-motion-1`) بالمكون React المناسب (مثل `MotionSimulator`)

### 3.8 Tools Page — `src/app/platform/tools/page.tsx`

**الأدوات المتاحة**:
1. **الآلة الحاسبة العلمية** (`ScientificCalculator.tsx`)
2. **محول الوحدات** (`UnitConverter.tsx`)
3. **الجدول الدوري** (يربط بـ `PeriodicTableSimulator`)
4. **ورقة الصيغ** (قسم مخطط)

### 3.9 نظام الثيمات (Theme System)

**الملف**: `src/components/ThemeProvider.tsx`

**المبدأ**: استخدام `next-themes` — NOT `useState` يدوي.

```tsx
// ✅ الصحيح — ما تم استخدامه
import { ThemeProvider as NextThemesProvider } from "next-themes";

// ❌ الخاطئ — لم يُستخدم
const [isDark, setIsDark] = useState(false);
```

**الإعدادات**:
- `attribute="class"` — يضيف/يحذف class `dark` على `<html>`
- `defaultTheme="system"` — يتبع إعدادات النظام
- `enableSystem` — يدعم الوضع التلقائي
- `disableTransitionOnChange={false}` — يسمح بـ transitions عند التبديل

**CSS Variables**: مُعرَّفة في `globals.css`:
- `:root` — متغيرات الوضع الفاتح (background: #FAFBFC, primary: #8B5CF6)
- `.dark` — متغيرات الوضع الداكن (background: #0F0F1A, primary: #A78BFA)

### 3.10 نظام اللغات (i18n System)

**الملف**: `src/lib/i18n.tsx`

**المبدأ**: `LanguageProvider` + `useLanguage()` hook — NOT `next-intl`.

**لماذا لا next-intl**: المشروع لا يحتاج routing-based i18n. كل المحتوى ثنائي اللغة في نفس الصفحة.

**التصميم**:
```tsx
type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (ar: string, en?: string) => string;  // دالة الترجمة
  dir: "rtl" | "ltr";
}
```

**دالة `t()` (Translation)**:
- إذا تم تمرير وسيطين: `t("مرحبا", "Hello")` — يختار بناءً على اللغة
- إذا تم تمرير وسط واحد: `t("nav.home")` — يبحث في قاموس `translations`

**RTL Support**:
- عند تغيير اللغة إلى العربية: `document.documentElement.dir = "rtl"`
- عند تغييرها للإنجليزية: `document.documentElement.dir = "ltr"`
- يتم تطبيق `dir={isRTL ? "rtl" : "ltr"}` على كل صفحة

**حفظ التفضيل**: `localStorage.getItem("language")` — يبقى الاختيار بعد إغلاق المتصفح.

### 3.11 الرسوم المتحركة (Animations)

**المكتبة**: Framer Motion 11.0.3

**الأنماط المستخدمة**:

| النمط | الوصف | الاستخدام |
|-------|-------|-----------|
| `fadeInUp` | يظهر من الأسفل | عناوين الأقسام، البطاقات |
| `staggerContainer` | ظهور متتابع للأبناء | Grid of cards |
| `scaleIn` | ظهر بالتكبير (spring) | إحصائيات، أيقونات |
| `floatAnimation` | طفو مستمر | عناصر الخلفية |
| `whileInView` | يبدأ عند الظهور في viewport | كل الأقسام |
| `whileHover` | تأثير عند التمرير | البطاقات، الأزرار |
| `whileTap` | تأثير عند الضغط | الأزرار |

**CSS Animations** (في `tailwind.config.ts` + `globals.css`):
- `gradient-shift`: تدرج متحرك (3s ease infinite)
- `float`: طفو (3s ease-in-out infinite)
- `pulse-glow`: توهج نابض (2s ease-in-out infinite)

### 3.12 الأنماط المخصصة (Custom CSS Classes)

| الكلاس | الوصف |
|--------|-------|
| `.gradient-primary` | تدرج بنفسجي → وردي |
| `.gradient-secondary` | تدرج سماوي → بنفسجي |
| `.gradient-accent` | تدرج برتقالي → وردي |
| `.gradient-success` | تدرج أخضر → سماوي |
| `.gradient-hero` | تدرج ثلاثي (667eea → 764ba2 → f093fb) |
| `.gradient-mesh` | خلفية mesh متعددة التدرجات |
| `.glass` | تأثير زجاجي (blur + semi-transparent) |
| `.neon-purple/pink/cyan` | توهج نيون للنصوص |
| `.neon-border` | توهج نيون للحدود |
| `.card-youth` | بطاقة بتصميم شبابي (hover: translateY + shadow) |
| `.btn-youth` | زر بتدرج + hover scale + shimmer effect |

---

## 4. بناء قاعدة البيانات (Database Construction)

### 4.1 التصميم العام

- **القاعدة**: SQLite (ملف `db/custom.db`)
- **الـ ORM**: Prisma 6.11.1
- **العدد**: 20 جدول (Model)
- **العلاقات**: One-to-Many أساساً مع Cascade Delete
- **المعرفات**: String IDs مُولَّدة (ليس auto-increment)

### 4.2 الجداول بالتفصيل

#### AcademicYear — السنوات الدراسية

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | المفتاح الرئيسي |
| nameAr | String | الاسم بالعربي (مثلاً: "الصف الأول الثانوي") |
| nameEn | String | الاسم بالإنجليزي (مثلاً: "First Year") |
| code | String @unique | كود فريد (first-year / second-year / third-year) |
| order | Int | ترتيب العرض (1, 2, 3) |
| createdAt | DateTime | تاريخ الإنشاء |
| updatedAt | DateTime | تاريخ التحديث |

**العلاقات**: `Subject[]` , `User[]`

#### Specialization — التخصصات

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | المفتاح الرئيسي |
| nameAr | String | (علمي رياضيات / علمي علوم / أدبي) |
| nameEn | String | (Science Math / Science / Arts) |
| code | String @unique | (science-math / science / arts) |
| descriptionAr | String? | وصف اختياري |
| descriptionEn | String? | وصف اختياري |
| order | Int | ترتيب العرض |

**العلاقات**: `Subject[]` , `User[]`

#### Subject — المواد الدراسية

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | المفتاح الرئيسي |
| nameAr | String | (فيزياء، كيمياء، رياضيات...) |
| nameEn | String | (Physics, Chemistry, Math...) |
| slug | String @unique | (physics, chemistry, math...) |
| icon | String | اسم أيقونة Lucide (Atom, FlaskConical...) |
| color | String | كود اللون (hex) |
| order | Int | ترتيب العرض |
| yearId | String? | مرجع للسنة الدراسية |
| specializationId | String? | مرجع للتخصص (null = مشتركة) |
| isCommon | Boolean | هل المادة مشتركة بين كل التخصصات؟ |

**العلاقات**: `AcademicYear?` , `Specialization?` , `Unit[]`

#### Unit — الوحدات الدراسية

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | المفتاح الرئيسي |
| subjectId | String | المادة الأم |
| semesterId | String? | الفصل الدراسي |
| nameAr | String | اسم الوحدة |
| nameEn | String | اسم الوحدة |
| slug | String @unique | |
| order | Int | ترتيب |

**العلاقات**: `Subject` (onDelete: Cascade) , `Semester?` , `Lesson[]`

#### Lesson — الدروس

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | المفتاح الرئيسي |
| unitId | String | الوحدة الأم |
| titleAr | String | عنوان الدرس |
| titleEn | String | عنوان الدرس |
| slug | String @unique | |
| descriptionAr | String | وصف الدرس |
| descriptionEn | String | وصف الدرس |
| duration | Int | المدة بالدقائق |
| isFree | Boolean | هل مجاني؟ |
| videoUrl | String? | رابط الفيديو |
| pdfUrl | String? | رابط الـ PDF |
| thumbnailUrl | String? | صورة مصغرة |
| introductionAr | String | مقدمة بالعربي |
| introductionEn | String | مقدمة بالإنجليزي |
| summaryAr | String | ملخص بالعربي |
| summaryEn | String | ملخص بالإنجليزي |

**العلاقات**: `Unit` , `Concept[]` , `Example[]` , `Formula[]` , `Objective[]` , `Question[]` , `LessonSimulator[]` , `Progress[]` , `QuizResult[]`

#### Concept — المفاهيم

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String | الدرس الأم |
| termAr | String | المصطلح بالعربي |
| termEn | String | المصطلح بالإنجليزي |
| definitionAr | String | التعريف بالعربي |
| definitionEn | String | التعريف بالإنجليزي |
| order | Int | الترتيب |

#### Formula — الصيغ الرياضية

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String | الدرس الأم |
| formula | String | الصيغة (LaTeX أو نص) |
| explanationAr | String | الشرح بالعربي |
| explanationEn | String | الشرح بالإنجليزي |
| order | Int | الترتيب |

#### Example — الأمثلة المحلولة

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String | الدرس الأم |
| questionAr | String | السؤال بالعربي |
| questionEn | String | السؤال بالإنجليزي |
| solutionAr | String | الحل بالعربي |
| solutionEn | String | الحل بالإنجليزي |
| stepsAr | String | الخطوات بالعربي |
| stepsEn | String | الخطوات بالإنجليزي |
| order | Int | الترتيب |

#### Objective — أهداف الدرس

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String | |
| textAr | String | |
| textEn | String | |
| order | Int | |

#### Question — الأسئلة

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String | |
| type | String | (mcq / true-false / fill-blank) |
| questionAr | String | |
| questionEn | String | |
| optionsAr | String? | JSON array للخيارات |
| optionsEn | String? | |
| answer | String | الإجابة الصحيحة |
| explanationAr | String? | |
| explanationEn | String? | |
| points | Int | النقاط (default: 1) |
| difficulty | String | (easy / medium / hard) |
| order | Int | |

#### QuizResult — نتائج الاختبارات

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| userId | String | |
| lessonId | String | |
| score | Int | الدرجة |
| totalPoints | Int | المجموع الكلي |
| answers | String | JSON للإجابات |
| completedAt | DateTime | |

**@@unique**: `[userId, lessonId]`

#### Simulator — المحاكيات

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| nameAr | String | |
| nameEn | String | |
| slug | String @unique | |
| type | String | (physics / chemistry / math / biology) |
| descriptionAr | String | |
| descriptionEn | String | |
| icon | String? | |
| difficulty | String | (beginner / intermediate / advanced) |

#### LessonSimulator — ربط الدروس بالمحاكيات

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String | |
| simulatorId | String | |

**@@unique**: `[lessonId, simulatorId]`

#### User — المستخدمون

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| email | String @unique | |
| name | String | |
| password | String? | |
| role | String | (student / teacher / admin) — default: student |
| yearId | String? | |
| specializationId | String? | |
| isSubscribed | Boolean | |
| points | Int | النقاط (gamification) |
| level | String | (beginner / intermediate / advanced) |

#### Progress — تقدم المستخدم

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| userId | String | |
| lessonId | String | |
| completed | Boolean | |
| score | Int? | |
| timeSpent | Int | بالثواني |
| watchedAt | DateTime? | |

**@@unique**: `[userId, lessonId]`

#### Badge — الشارات

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| slug | String @unique | |
| nameAr | String | |
| nameEn | String | |
| descriptionAr | String | |
| descriptionEn | String | |
| icon | String | |
| color | String | |
| requirement | Int | عدد النقاط المطلوبة |
| type | String | |

#### UserBadge — شارات المستخدم

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| userId | String | |
| badgeSlug | String | |
| earnedAt | DateTime | |

**@@unique**: `[userId, badgeSlug]`

#### Semester — الفصول الدراسية

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| nameAr | String | (الفصل الدراسي الأول / الثاني) |
| nameEn | String | (Term 1 / Term 2) |
| code | String @unique | (term-1 / term-2) |
| order | Int | |

#### MindMap — الخرائط الذهنية

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String @unique | درس واحد = خريطة واحدة |
| data | String | JSON structure |

#### Infographic — الإنفوجرافيك

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | String @id | |
| lessonId | String @unique | |
| type | String | نوع الإنفوجرافيك |
| data | String | JSON data |

### 4.3 مخطط العلاقات (ER Diagram)

```
AcademicYear ──┬──► Subject ──► Unit ──► Lesson ──┬──► Concept
               │              │                     ├──► Formula
               │              │                     ├──► Example
               └──► User      │                     ├──► Objective
                              │                     ├──► Question
                              │                     ├──► LessonSimulator ◄──► Simulator
                              │                     ├──► MindMap
Specialization ──┬──► Subject │                     ├──► Infographic
               │              │                     │
               └──► User      └──► Semester          │
                                                     │
User ──┬──► Progress ◄─────────────────────────────┘
       ├──► QuizResult ◄──────────────────────────┘
       └──► UserBadge ◄──► Badge
```

### 4.4 Seed Scripts

| السكربت | المسار | الوظيفة |
|---------|--------|---------|
| Seed أساسي | `prisma/seed.ts` | بذر البيانات الأساسية |
| الصف الأول | `scripts/seed-first-year.ts` | بيانات الصف الأول (10 مواد) |
| الصف الثاني | `scripts/seed-second-year.ts` | بيانات الصف الثاني (15+ مادة) |
| الصف الثالث | `scripts/seed-third-year.ts` | بيانات الصف الثالث (15+ مادة) |
| المحتوى الكامل | `scripts/seed-complete-content.ts` | محتوى كل الدروس |
| المحتوى الشامل | `scripts/seed-comprehensive-content.ts` | محتوى + أسئلة + محاكيات |
| التوليد بالجملة | `scripts/batch-generate-content.ts` | توليد محتوى بالجملة |

**الأوامر**:
```bash
npx tsx prisma/seed.ts          # البذر الأساسي
npx tsx scripts/seed-first-year.ts
npx tsx scripts/seed-second-year.ts
npx tsx scripts/seed-third-year.ts
npm run db:seed                 # اختصار للبذر الأساسي
npm run db:reset                # إعادة تعيين + بذر
```

---

## 5. بناء الـ API (API Construction)

### 5.1 قائمة الـ Endpoints

#### Content APIs (محتوى تعليمي)

| Method | المسار | الوصف | الـ Response |
|--------|--------|-------|-------------|
| GET | `/api/structure` | هيكل المنصة الكامل | `{ academicYears, specializations, semesters }` |
| GET | `/api/subjects` | كل المواد | `Subject[]` |
| GET | `/api/lessons` | كل الدروس | `Lesson[]` |
| GET | `/api/lessons/[id]` | درس واحد بالـ ID | `Lesson` مع العلاقات |
| GET | `/api/units/[id]/lessons` | دروس وحدة معينة | `Lesson[]` |
| GET | `/api/simulators` | كل المحاكيات | `Simulator[]` |
| POST | `/api/progress` | تحديث تقدم الطالب | `{ success: boolean }` |

#### Seed APIs (بذر البيانات)

| Method | المسار | الوصف |
|--------|--------|-------|
| POST | `/api/seed` | بذر أساسي |
| POST | `/api/seed-complete` | بذر كامل |
| POST | `/api/seed-lessons` | بذر الدروس |
| POST | `/api/seed-lessons-v2` | بذر الدروس (إصدار 2) |
| POST | `/api/seed-all-lessons` | بذر كل الدروس |
| POST | `/api/seed-curriculum` | بذر المنهج الكامل |
| POST | `/api/seed-egyptian` | بذر المنهج المصري |
| POST | `/api/content/seed` | بذر المحتوى |

#### Debug APIs (تصحيح)

| Method | المسار | الوصف |
|--------|--------|-------|
| GET | `/api/debug-db` | فحص قاعدة البيانات |
| GET | `/api/debug-subjects` | فحص المواد |
| GET | `/api/check-specializations` | فحص التخصصات |
| POST | `/api/fix-specializations` | إصلاح التخصصات |
| POST | `/api/cleanup-duplicates` | حذف المكررات |

### 5.2 مثال على Response Format

```json
// GET /api/structure
{
  "academicYears": [
    {
      "id": "id_first_year",
      "code": "first-year",
      "nameAr": "الصف الأول الثانوي",
      "nameEn": "First Year Secondary",
      "order": 1,
      "Subject": [
        {
          "id": "id_physics_1",
          "nameAr": "الفيزياء",
          "nameEn": "Physics",
          "icon": "Atom",
          "color": "#8B5CF6",
          "isCommon": true,
          "Unit": [...]
        }
      ]
    }
  ],
  "specializations": [
    { "id": "id_sci_math", "code": "science-math", "nameAr": "علمي رياضيات", "nameEn": "Science Math" }
  ],
  "semesters": [
    { "id": "id_term1", "code": "term-1", "nameAr": "الفصل الدراسي الأول", "nameEn": "Term 1" }
  ]
}
```

### 5.3 Authentication

حالياً لا يوجد نظام مصادقة فعّال. تم تثبيت `next-auth@4.24.5` كـ dependency لكنه غير مُفعَّل بعد. الـ `User` model موجود في قاعدة البيانات جاهزاً للربط.

---

## 6. بناء المصنع (Factory Construction)

> **ملاحظة**: المصنع (Data Factory) في مرحلة التصميم والتخطيط. تم كتابة POD وPLAN لكن التنفيذ لا يزال قيد التطوير.

### 6.1 الوثائق المكتوبة

| الوثيقة | المسار | الوصف |
|---------|--------|-------|
| POD | `docs/factory/POD.md` | وثيقة متطلبات المنتج (1,803 سطر) |
| PLAN | `docs/factory/PLAN.md` | خطة التنفيذ |
| WORKFLOW | `docs/factory/WORKFLOW.md` | سير العمل |

### 6.2 هيكل المصنع المخطط

```
mini-services/control-center/
├── dashboard-app/          # لوحة التحكم (Next.js منفصل على port 3002)
├── lib/db/                 # طبقة قاعدة بيانات المصنع
├── scripts/                # سكربتات التوليد
│   ├── video-renderer      # تصيير الفيديو (Remotion)
│   └── queue-worker        # نظام الطوابير
├── src/components/         # مكونات Remotion للفيديو
└── content-extractor/      # استخراج المحتوى من PDF (Python)
    └── (Tesseract OCR + AI extraction)
```

### 6.3 مكونات المصنع

| المكون | التقنية | الوصف |
|--------|---------|-------|
| Dashboard | Next.js (port 3002) | واجهة إدارة مركزية |
| Content Extractor | Python + Tesseract | استخراج نصوص من كتب PDF |
| Video Renderer | Remotion | توليد فيديوهات تعليمية |
| Queue System | مخصص | إدارة مهام التوليد |
| AI Integration | LM Studio / Ollama | توليد محتوى بالذكاء الاصطناعي |
| DB Sync | Prisma | مزامنة ثنائية مع المنصة |

---

# Part B: مرجع التكامل (Integration Reference)

## 7. تكامل المنصة والمصنع (Platform-Factory Integration)

### 7.1 قاعدة البيانات المشتركة

المنصة والمصنع يشتركان في نفس ملف SQLite (`db/custom.db`) ونفس Prisma schema. هذا يعني:

- المصنع يمكنه الكتابة مباشرة في جداول المنصة
- لا حاجة لـ API intermediate
- تغييرات المصنع تظهر فوراً في المنصة

### 7.2 نقاط التكامل

```
Factory (port 3002)                    Platform (port 4000)
      │                                       │
      │── Write to custom.db ─────────────────►│
      │── Generate curriculum.json ───────────►│
      │── Generate question-bank.json ────────►│
      │                                       │
      │◄────── Read structure ────────────────│
      │◄────── Read lesson IDs ───────────────│
```

### 7.3 آلية المزامنة

1. المصنع يكتب المحتوى في قاعدة البيانات عبر Prisma
2. سكربت `export-to-json.ts` يصدّر كل البيانات إلى `public/data/curriculum.json`
3. المنصة تقرأ `curriculum.json` عبر `loadStaticData()` في Client-side
4. لا حاجة لإعادة تشغيل الخادم —只需 إعادة تحميل الصفحة

---

## 8. تكامل نماذج الذكاء الاصطناعي (AI Models Integration)

### 8.1 الاتصال بـ LM Studio

```
LM Studio (Local) ←── HTTP API ──→ Factory Scripts
Host: http://localhost:1234
Endpoint: /v1/chat/completions
Model: اختيار المستخدم (مثل: llama-3, mistral, etc.)
```

### 8.2 الاتصال بـ Ollama

```
Ollama (Local) ←── HTTP API ──→ Factory Scripts
Host: http://localhost:11434
Endpoint: /api/generate
Models: llama3, mistral, gemma, etc.
```

### 8.3 Model Routing

المصنع يتيح اختيار النموذج ديناميكياً:
- توليد المحتوى النصي: يمكن استخدام أي نموذج
- توليد الأسئلة: نماذج متخصصة في Q&A
- مراجعة المحتوى: نماذج مع تحقق من الدقة

### 8.4 Error Handling

```typescript
// نمط التعامل مع أخطاء AI
try {
  const response = await fetch('http://localhost:1234/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: selectedModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  if (!response.ok) throw new Error(`AI Error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
} catch (error) {
  console.error('AI generation failed:', error);
  return fallbackContent; // محتوى احتياطي
}
```

---

## 9. تكامل الأنظمة الخارجية (External Systems Integration)

### 9.1 Remotion (Video Generation)

- **الغرض**: توليد فيديوهات تعليمية آلياً
- **الموقع**: `mini-services/control-center/src/components/`
- **الحالة**: مخطط — لم يُنفَّذ بعد
- **التكامل**: يستخدم بيانات الدروس من `curriculum.json`

### 9.2 Tesseract (OCR)

- **الغرض**: استخراج النصوص من كتب PDF الممسوحة ضوئياً
- **الموقع**: `mini-services/control-center/content-extractor/`
- **اللغة**: Python
- **التكامل**: النص المستخرج يُرسل لنماذج AI للتنظيم

### 9.3 Python Scripts

| السكربت | المسار | الوظيفة |
|---------|--------|---------|
| convert-all.py | `scripts/` | تحويل كل البيانات |
| convert-data.py | `scripts/` | تحويل بيانات |
| content-extractor | `mini-services/.../` | استخراج من PDF |

---

# Part C: إرشادات البناء والتعديل (Build & Modify Guide)

## 10. كيفية إضافة صفحة جديدة

### الخطوة 1: إنشاء المجلد والملف

إذا كانت صفحة ثابتة (مثل `/platform/about`):
```
src/app/platform/about/
└── page.tsx
```

إذا كانت صفحة ديناميكية (مثل `/platform/teacher/[id]`):
```
src/app/platform/teacher/[id]/
├── page.tsx          # Server Component
└── TeacherClient.tsx # Client Component
```

### الخطوة 2: Server Component مع generateStaticParams

```tsx
// src/app/platform/teacher/[id]/page.tsx
import { teacherIds } from "@/lib/static-params";
import TeacherClient from "./TeacherClient";

export function generateStaticParams() {
  return teacherIds.map((id) => ({ id }));
}

export default async function TeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;  // Next.js 15 pattern
  return <TeacherClient teacherId={id} />;
}
```

### الخطوة 3: Client Component

```tsx
// src/app/platform/teacher/[id]/TeacherClient.tsx
"use client";

import { useLanguage } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function TeacherClient({ teacherId }: { teacherId: string }) {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const isRTL = language === "ar";

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Page content */}
    </div>
  );
}
```

### الخطوة 4: أضف الـ IDs إلى static-params.ts

```tsx
// src/lib/static-params.ts
export const teacherIds = ["id_teacher1", "id_teacher2"];
```

---

## 11. كيفية إضافة مكون جديد

### مكون UI (shadcn/ui)

```bash
npx shadcn@latest add [component-name]
```

مثال:
```bash
npx shadcn@latest add dialog
```

يتم إنشاء الملف تلقائياً في `src/components/ui/dialog.tsx`.

### مكون مخصص

أنشئ الملف في المجلد المناسب:

```
src/components/simulators/MyNewSimulator.tsx
```

ثم أضفه إلى `simulatorMap.ts`:

```tsx
import { MyNewSimulator } from '@/components/simulators/MyNewSimulator';

const simulatorComponentMap: Record<string, React.FC> = {
  // ... existing
  'sim-my-new': MyNewSimulator,
};
```

وأضف بياناته في `simulations.ts`:

```tsx
{
  id: 'sim-my-new',
  lessonId: 'some-lesson-id',
  titleAr: 'محاكي جديد',
  titleEn: 'New Simulator',
  descriptionAr: 'وصف المحاكي',
  descriptionEn: 'Simulator description',
  type: 'physics',  // أو chemistry, math, biology
  category: 'experiment',  // أو calculator, visualization, game
  thumbnail: '/simulations/new.png',
  isFree: true
}
```

---

## 12. كيفية إضافة جدول جديد في DB

### الخطوة 1: عدّل `prisma/schema.prisma`

```prisma
model VideoLesson {
  id          String   @id
  lessonId    String
  videoUrl    String
  duration    Int
  quality     String   @default("1080p")
  createdAt   DateTime @default(now())
  Lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([lessonId])
}
```

### الخطوة 2: أضف العلاقة في الـ Lesson Model

```prisma
model Lesson {
  // ... existing fields
  VideoLesson  VideoLesson[]
}
```

### الخطوة 3: تطبيق التغييرات

```bash
npx prisma db push        # تطبيق على SQLite
npx prisma generate        # توليد Prisma Client
```

### الخطوة 4: أعد تصدير البيانات

```bash
npx tsx scripts/export-to-json.ts
```

---

## 13. كيفية إضافة API endpoint جديد

### الخطوة 1: أنشئ ملف الـ Route

```
src/app/api/videos/route.ts
```

### الخطوة 2: اكتب الـ Handler

```typescript
// src/app/api/videos/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const videos = await db.videoLesson.findMany({
      include: { Lesson: true },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const video = await db.videoLesson.create({
      data: body,
    });
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
```

### لنموذج ديناميكي

```
src/app/api/videos/[id]/route.ts
```

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

---

## 14. كيفية إضافة نوع محتوى بصري جديد

### الخطوة 1: أنشئ المكون

```tsx
// src/components/ui/MyNewVisual.tsx
"use client";

interface MyNewVisualProps {
  data: any;
  language: "ar" | "en";
}

export function MyNewVisual({ data, language }: MyNewVisualProps) {
  // Render visual content
  return <div>...</div>;
}
```

### الخطوة 2: أضف نموذج قاعدة البيانات (إن لزم)

انظر [القسم 12](#12-كيفية-إضافة-جدول-جديد-في-db).

### الخطوة 3: أضف الربط في صفحة الدرس

في `LessonClient.tsx` أو `LessonPageClient.tsx`، أضف الشرط:

```tsx
{visualType === 'my-new-visual' && (
  <MyNewVisual data={visualData} language={language} />
)}
```

---

## 15. كيفية إضافة مرحلة فيديو جديدة

### الخطوة 1: أضف Video Lesson إلى قاعدة البيانات

انظر [القسم 12] لإضافة الجدول.

### الخطوة 2: أضف مكون Remotion

```
mini-services/control-center/src/components/LessonVideo.tsx
```

### الخطوة 3: أضف سكربت التصيير

```
mini-services/control-center/scripts/render-lesson-video.ts
```

### الخطوة 4: أضف رابط الفيديو في بيانات الدرس

```typescript
await db.lesson.update({
  where: { id: lessonId },
  data: { videoUrl: `/videos/${lessonId}.mp4` },
});
```

---

# Part D: المراجع التقنية (Technical References)

## 16. ملف package.json كامل بالشرح

```json
{
  "name": "smartedu",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=18.18.0"          // الحد الأدنى: Node.js 18.18
  },
  "scripts": {
    "dev": "next dev -p 4000",                    // تشغيل على port 4000
    "postinstall": "prisma generate || echo ...",  // توليد Prisma تلقائياً
    "build": "next build",                        // بناء الإنتاج
    "start": "next start",                        // تشغيل الإنتاج
    "lint": "eslint .",                           // فحص الكود
    "db:push": "prisma db push",                  // تطبيق Schema على DB
    "db:generate": "prisma generate",             // توليد Prisma Client
    "db:seed": "npx tsx prisma/seed.ts",          // بذر البيانات
    "db:reset": "prisma db push --force-reset && npx tsx prisma/seed.ts",  // إعادة تعيين كاملة
    "export-data": "npx tsx scripts/export-to-json.ts",   // تصدير JSON
    "generate-content": "npx tsx scripts/batch-generate-content.ts",  // توليد بالجملة
    "generate-single": "npx tsx scripts/generate-lesson-content.ts"   // توليد درس واحد
  }
}
```

### التبعيات الرئيسية (Dependencies)

| الحزمة | الإصدار | الغرض |
|--------|---------|-------|
| `next` | 15.1.7 | إطار العمل الرئيسي (App Router) |
| `react` / `react-dom` | 18.2.0 | مكتبة الواجهة |
| `@prisma/client` | 6.11.1 | Prisma ORM Client |
| `prisma` | 6.11.1 | Prisma CLI |
| `framer-motion` | 11.0.3 | رسوم متحركة |
| `next-themes` | 0.2.1 | Dark/Light mode |
| `lucide-react` | 0.312.0 | أيقونات |
| `katex` | 0.17.0 | معادلات رياضية |
| `recharts` | 2.12.0 | رسوم بيانية |
| `react-markdown` | 9.0.1 | عرض Markdown |
| `zustand` | 4.5.0 | State management |
| `@tanstack/react-query` | 5.17.9 | Server state management |
| `@tanstack/react-table` | 8.11.8 | جداول متقدمة |
| `react-hook-form` | 7.49.3 | نماذج (Forms) |
| `zod` | 3.22.4 | Validation |
| `next-auth` | 4.24.5 | مصادقة (غير مفعّل بعد) |
| `sharp` | 0.33.2 | معالجة صور |
| `uuid` | 9.0.1 | توليد IDs |
| `date-fns` | 3.3.1 | تواريخ |
| `sonner` | 1.4.0 | Toast notifications |
| `clsx` + `tailwind-merge` | latest | دمج classNames |
| `class-variance-authority` | 0.7.0 | Component variants |
| `cmdk` | 0.2.1 | Command palette |
| `vaul` | 0.9.0 | Drawer component |
| `embla-carousel-react` | 8.0.0 | Carousel |
| `@dnd-kit/core` | 6.3.1 | Drag and Drop |
| `input-otp` | 1.2.2 | OTP input |

### تبعيات Radix UI (أساس shadcn/ui)

| الحزمة | الغرض |
|--------|-------|
| `@radix-ui/react-accordion` | أكورديون |
| `@radix-ui/react-alert-dialog` | حوار تنبيه |
| `@radix-ui/react-dialog` | حوار/نافذة منبثقة |
| `@radix-ui/react-dropdown-menu` | قائمة منسدلة |
| `@radix-ui/react-select` | قائمة اختيار |
| `@radix-ui/react-tabs` | تبويبات |
| `@radix-ui/react-toast` | إشعارات |
| `@radix-ui/react-tooltip` | تلميحات |
| `@radix-ui/react-popover` | نافذة منبثقة |
| `@radix-ui/react-checkbox` | خانة اختيار |
| `@radix-ui/react-radio-group` | مجموعة أزرار راديو |
| `@radix-ui/react-switch` | مفتاح تبديل |
| `@radix-ui/react-slider` | شريط تمرير |
| `@radix-ui/react-progress` | شريط تقدم |
| `@radix-ui/react-scroll-area` | منطقة تمرير |
| `@radix-ui/react-separator` | فاصل |
| `@radix-ui/react-collapsible` | قابل للطي |
| `@radix-ui/react-navigation-menu` | قائمة تنقل |
| `@radix-ui/react-menubar` | شريط قوائم |
| `@radix-ui/react-context-menu` | قائمة سياق |
| `@radix-ui/react-hover-card` | بطاقة عند التمرير |
| `@radix-ui/react-avatar` | صورة رمزية |
| `@radix-ui/react-label` | تسمية |
| `@radix-ui/react-toggle` | زر تبديل |
| `@radix-ui/react-toggle-group` | مجموعة تبديل |
| `@radix-ui/react-aspect-ratio` | نسبة أبعاد |
| `@radix-ui/react-slot` | Slot component |

---

## 17. ملف next.config.ts بالشرح

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",  // ← مُعلَّق للوضع التطويري
  // Uncomment للنشر على Hostinger (static export)
  // عند التفعيل: لا يمكن استخدام API Routes أو middleware

  typescript: {
    ignoreBuildErrors: true,
    // ← يتجاهل أخطاء TypeScript أثناء البناء
    // مفيد في مرحلة التطوير السريع
    // ⚠️ يجب إزالته للإنتاج
  },

  eslint: {
    ignoreDuringBuilds: true,
    // ← يتجاهل أخطاء ESLint أثناء البناء
    // ⚠️ يجب إزالته للإنتاج
  },

  reactStrictMode: false,
  // ← إيقاف Strict Mode
  // يمنع التحذيرات المزدوجة في التطوير
  // لا يؤثر على الإنتاج

  images: {
    unoptimized: true,
    // ← يتعطيل تحسين الصور
    // مطلوب لـ static export (output: "export")
    // بدون هذا، Next.js يحتاج خادم لتحسين الصور
  },
};

export default nextConfig;
```

### ملاحظات مهمة:
1. **output: "export"** مُعلَّق لأنه يعطل API Routes. يُفعَّل فقط عند النشر على استضافة ثابتة.
2. **ignoreBuildErrors** و **ignoreDuringBuilds** وضعتا للسرعة. يجب إزالتهما قبل الإنتاج النهائي.
3. **unoptimized: true** مطلوب لأن الصور تُحمَّل من `public/` وليس من CDN.

---

## 18. ملف prisma/schema.prisma بالشرح

```prisma
generator client {
  provider = "prisma-client-js"
  // ← يولّد Prisma Client بـ JavaScript/TypeScript
  // المجلد: node_modules/.prisma/client
  // الاستيراد: import { PrismaClient } from '@prisma/client'
}

datasource db {
  provider = "sqlite"
  // ← SQLite — قاعدة بيانات ملفية
  // لا يحتاج خادم منفصل
  // مناسب للاستضافة المشتركة (Hostinger)

  url = env("DATABASE_URL")
  // ← من ملف .env
  // القيمة: "file:./db/custom.db"
}
```

### ملاحظات التصميم:
1. **String IDs** — كل المفاتيح الأساسية من نوع String (UUID أو custom IDs)، وليس auto-increment. هذا يسهل التصدير والاستيراد.
2. **Cascade Delete** — معظم العلاقات تستخدم `onDelete: Cascade`. حذف سنة = حذف كل مواده ودروسه.
3. **Optional Relations** — بعض العلاقات اختيارية (مثل `yearId?` في Subject) لدعم المواد المشتركة.
4. **Unique Constraints** — تُستخدم لمنع التكرار (مثل `@@unique([userId, lessonId])` في Progress).

---

## 19. ملف .env بالشرح

```bash
# قاعدة البيانات
DATABASE_URL="file:./db/custom.db"
# ← مسار ملف SQLite نسبي لمشروع Prisma
# Prisma يبحث عنه من: prisma/schema.prisma → ../db/custom.db

# لا يوجد حالياً:
# NEXTAUTH_SECRET=      # سيُضاف عند تفعيل المصادقة
# NEXTAUTH_URL=         # سيُضاف عند تفعيل المصادقة
# AI_MODEL_URL=         # سيُضاف عند تفعيل المصنع
```

> **تحذير**: ملف `.env` لا يجب رفعه على Git. تأكد أنه في `.gitignore`.

---

## 20. قائمة المكونات shadcn/ui المستخدمة

### المكونات المثبتة (53 ملف في `src/components/ui/`)

| # | المكون | الملف | الاستخدام في المشروع |
|---|--------|-------|---------------------|
| 1 | Accordion | `accordion.tsx` | طي/فتح الوحدات في صفحة المادة |
| 2 | Alert Dialog | `alert-dialog.tsx` | حوارات التأكيد |
| 3 | Alert | `alert.tsx` | إشعارات |
| 4 | Aspect Ratio | `aspect-ratio.tsx` | نسب أبعاد الصور |
| 5 | Avatar | `avatar.tsx` | صور المستخدمين |
| 6 | Badge | `badge.tsx` | شارات (مجاني/مدفوع، تخصص) |
| 7 | Breadcrumb | `breadcrumb.tsx` | مسار التنقل |
| 8 | Button | `button.tsx` | **الأكثر استخداماً** — كل الأزرار |
| 9 | Calendar | `calendar.tsx` | التقويم |
| 10 | Card | `card.tsx` | **الأكثر استخداماً** — بطاقات السنوات، المواد، الدروس |
| 11 | Carousel | `carousel.tsx` | عرض شرائح |
| 12 | Chart | `chart.tsx` | رسوم بيانية (مع Recharts) |
| 13 | Checkbox | `checkbox.tsx` | خانات اختيار |
| 14 | Collapsible | `collapsible.tsx` | محتوى قابل للطي |
| 15 | Command | `command.tsx` | Command palette |
| 16 | Context Menu | `context-menu.tsx` | قائمة سياق |
| 17 | Dialog | `dialog.tsx` | نوافذ منبثقة |
| 18 | Drawer | `drawer.tsx` | درج جانبي |
| 19 | Dropdown Menu | `dropdown-menu.tsx` | قوائم منسدلة |
| 20 | Form | `form.tsx` | نماذج (مع react-hook-form) |
| 21 | Hover Card | `hover-card.tsx` | بطاقات عند التمرير |
| 22 | Input OTP | `input-otp.tsx` | إدخال OTP |
| 23 | Input | `input.tsx` | حقول إدخال نصية |
| 24 | Label | `label.tsx` | تسميات الحقول |
| 25 | Menubar | `menubar.tsx` | شريط القوائم |
| 26 | Navigation Menu | `navigation-menu.tsx` | قائمة التنقل |
| 27 | Pagination | `pagination.tsx` | ترقيم الصفحات |
| 28 | Popover | `popover.tsx` | نوافذ منبثقة صغيرة |
| 29 | Progress | `progress.tsx` | شريط التقدم (في الاختبارات) |
| 30 | Radio Group | `radio-group.tsx` | أزرار راديو |
| 31 | Resizable | `resizable.tsx` | أقسام قابلة لتغيير الحجم |
| 32 | Scroll Area | `scroll-area.tsx` | منطقة تمرير مخصصة |
| 33 | Select | `select.tsx` | قوائم اختيار |
| 34 | Separator | `separator.tsx` | فواصل |
| 35 | Sheet | `sheet.tsx` | لوحة جانبية |
| 36 | Sidebar | `sidebar.tsx` | شريط جانبي |
| 37 | Skeleton | `skeleton.tsx` | هيكل تحميل |
| 38 | Slider | `slider.tsx` | منزلقات (في المحاكيات) |
| 39 | Sonner | `sonner.tsx` | Toast (بديل لـ Radix Toast) |
| 40 | Switch | `switch.tsx` | مفاتيح تبديل |
| 41 | Table | `table.tsx` | جداول |
| 42 | Tabs | `tabs.tsx` | **مستخدم كثيراً** — تبويبات التخصصات |
| 43 | Textarea | `textarea.tsx` | حقول نصية كبيرة |
| 44 | Toaster | `toaster.tsx` | حاوية الإشعارات |
| 45 | Toast | `toast.tsx` | إشعارات |
| 46 | Toggle | `toggle.tsx` | زر تبديل |
| 47 | Toggle Group | `toggle-group.tsx` | مجموعة تبديل |
| 48 | Tooltip | `tooltip.tsx` | تلميحات |

### مكونات مخصصة إضافية في `ui/`

| المكون | الوصف |
|--------|-------|
| `ContentRenderer.tsx` | عرض محتوى تعليمي تفاعلي |
| `MathRenderer.tsx` | عرض المعادلات الرياضية (KaTeX) |
| `ScienceDiagrams.tsx` | رسوم علمية تفاعلية |
| `GeographyMaps.tsx` | خرائط جغرافية |
| `GeometricDiagrams.tsx` | رسوم هندسية |

### إعدادات shadcn/ui

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",        // نمط new-york (أكثر حداثة)
  "rsc": true,                // React Server Components
  "tsx": true,                // TypeScript
  "tailwind": {
    "css": "src/app/globals.css",
    "baseColor": "neutral",   // لون أساسي محايد
    "cssVariables": true,     // استخدام CSS variables
    "prefix": ""              // بدون بادئة
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"     // مكتبة أيقونات Lucide
}
```

### إضافة مكون shadcn/ui جديد

```bash
# مثال: إضافة Skeleton
npx shadcn@latest add skeleton

# سيتم إنشاء:
# src/components/ui/skeleton.tsx
# مع الاستيراد الصحيح من @/lib/utils
```

---

# الملاحق

## Appendix A: القرارات التقنية الكاملة

| القرار | الاختيار | البديل المرفوض | السبب |
|--------|----------|----------------|-------|
| إطار العمل | Next.js 15 App Router | Pages Router | Server Components + better DX |
| params | `await params` (Promise) | `params.xxx` (direct) | Next.js 15 requirement |
| الثيمات | `next-themes` (class) | manual useState | أقل تعقيداً، يدعم system preference |
| اللغات | Custom LanguageProvider | next-intl | لا يحتاج routing-based i18n |
| قاعدة البيانات | Prisma + SQLite | Raw SQL / PostgreSQL | سهولة التطوير المحلي + لا يحتاج خادم |
| التصميم | Tailwind + shadcn/ui | Custom CSS / MUI | سرعة التطوير + تناسق |
| الرسوم المتحركة | Framer Motion | CSS animations | أكثر تحكماً وأسهل |
| البيانات الثابتة | JSON file + fetch | API calls | أسرع + يعمل مع static export |
| المعرفات | String (custom) | Integer (auto-increment) | أسهل للتصدير والاستيراد |
| output: export | معلَّق (dev) | مُفعَّل (prod) | API Routes لا تعمل مع static export |

## Appendix B: أوامر التشغيل الشائعة

```bash
# التطوير
npm run dev                    # تشغيل على port 4000

# قاعدة البيانات
npm run db:push                # تطبيق Schema
npm run db:generate            # توليد Prisma Client
npm run db:seed                # بذر البيانات
npm run db:reset               # إعادة تعيين كاملة

# تصدير
npm run export-data            # تصدير curriculum.json

# توليد محتوى
npm run generate-content       # بالجملة
npm run generate-single        # درس واحد

# البناء والنشر
npm run build                  # بناء الإنتاج
npm run start                  # تشغيل الإنتاج

# إضافة مكون
npx shadcn@latest add [name]   # إضافة مكون shadcn/ui
```

## Appendix C: المنافذ (Ports)

| الخدمة | المنفذ | الوصف |
|--------|--------|-------|
| المنصة الرئيسية | 4000 | Next.js dev server |
| المصنع (مخطط) | 3002 | Factory Dashboard |
| LM Studio | 1234 | AI models API |
| Ollama | 11434 | AI models API |

## Appendix D: الألوان الأساسية

| المتغير | Light | Dark | الاستخدام |
|---------|-------|------|-----------|
| `--background` | #FAFBFC | #0F0F1A | خلفية الصفحة |
| `--foreground` | #1a1a2e | #F9FAFB | لون النص الرئيسي |
| `--primary` | #8B5CF6 | #A78BFA | اللون الأساسي (بنفسجي) |
| `--accent` | #EC4899 | #F472B6 | اللون المُكمِّل (وردي) |
| `--card` | #FFFFFF | #1A1A2E | خلفية البطاقات |
| `--border` | #E5E7EB | #374151 | الحدود |
| `--muted` | #F3F4F6 | #2D2D44 | العناصر المُخفتة |

---

> **آخر تحديث**: يوليو 2025
> **المسؤول عن التوثيق**: SmartEdu Team
> **هذا الدليل هو المرجع الرسمي والوحيد لفهم وتعديل وتوسيع مشروع SmartEdu**