# 📋 سجل العمل | Worklog

---

## Session: 2026-06-12

### Task ID: 1
**Agent:** Main
**Task:** إصلاح مشاكل العرض بعد الـ deployment

**Work Log:**
- فحص الـ dev server والـ logs
- اكتشاف خطأ في Prisma API (أسماء حقول غلط)
- إصلاح `/api/structure/route.ts` لاستخدام `Subject`, `Unit`, `Specialization`
- تحديث `MainPlatform.tsx` للتعامل مع الأسماء الصح
- اختبار الصفحة وتأكيد عملها

**Stage Summary:**
- ✅ إصلاح Prisma API schema mismatch
- ✅ تحديث الـ interfaces
- ✅ الصفحة تعمل بشكل صحيح

---

### Task ID: 2
**Agent:** Main
**Task:** إصلاح نظام التنقل

**Work Log:**
- إنشاء نظام Routing كامل
- صفحة الهبوط: `/`
- المنصة: `/platform`
- اختيار السنة: `/platform/year/[code]`
- اختيار المادة: `/platform/subject/[id]`
- صفحة الدرس: `/platform/lesson/[id]`
- إزالة نظام النقاط العام من أسفل الصفحة

**Stage Summary:**
- ✅ كل شاشة لها URL مستقل
- ✅ زر Back/Forward يعمل
- ✅ يمكن فتح أكتر من Tab

---

### Task ID: 3
**Agent:** Main
**Task:** تنظيف البيانات المكررة

**Work Log:**
- إنشاء API لفحص التكرارات: `/api/debug-subjects`
- اكتشاف 38 مادة مكررة من أصل 74
- إنشاء API للتنظيف: `/api/cleanup-duplicates`
- حذف المواد المكررة والاحتفاظ بالأكثر وحدات
- النتيجة: 36 مادة بدون تكرار

**Stage Summary:**
- ✅ حذف 38 مادة مكررة
- ✅ توزيع المواد: أولى (10)، ثانية (12)، ثالثة (14)

---

### Task ID: 4
**Agent:** Main
**Task:** إصلاح التخصصات

**Work Log:**
- فحص التخصصات الموجودة
- اكتشاف تكرار: علمي رياضة (2)، أدبي (2)
- إنشاء API للإصلاح: `/api/fix-specializations`
- توحيد التخصصات إلى 3: science, math, arts
- ربط المواد بالتخصصات الصحيحة

**Stage Summary:**
- ✅ 3 تخصصات فقط
- ✅ المواد مرتبطة صح حسب النظام المصري

---

### Task ID: 5
**Agent:** Main
**Task:** إنشاء UI اختيار التخصص

**Work Log:**
- تعديل صفحة `/platform/year/[code]/page.tsx`
- إضافة شاشة اختيار التخصص للسنة الثانية والثالثة
- فلترة المواد حسب التخصص المختار
- إضافة زر "تغيير التخصص"
- اختبار كل تخصص: علمي علوم، علمي رياضة، أدبي

**Stage Summary:**
- ✅ اختيار التخصص يظهر للسنة الثانية والثالثة
- ✅ المواد تظهر بشكل صحيح لكل تخصص
- ✅ المواد المشتركة تظهر للكل

---

### Task ID: 6
**Agent:** Main
**Task:** التوثيق

**Work Log:**
- إنشاء ملف DOCUMENTATION.md
- توثيق البنية التقنية
- توثيق قاعدة البيانات
- توثيق نظام التخصصات
- توثيق المشاكل والحلول

**Stage Summary:**
- ✅ ملف توثيق شامل
- ✅ سجل العمل (Worklog)

---

## 📊 ملخص الجلسة

| المهمة | الحالة |
|--------|--------|
| إصلاح العرض | ✅ |
| نظام التنقل | ✅ |
| تنظيف البيانات | ✅ |
| إصلاح التخصصات | ✅ |
| UI التخصصات | ✅ |
| التوثيق | ✅ |

---

## 🔜 المهام المتبقية

1. نظام تسجيل الدخول
2. نظام التتبع التفصيلي لكل طالب
3. التقارير والإحصائيات
4. المحاكيات التفاعلية
5. نشر على Hostinger

---

## Session: 2025-01-09 (Continued)

### Task ID: 8
**Agent:** Main
**Task:** رفع قاعدة البيانات وإنشاء Seed Script

**Work Log:**
- قراءة الخطة الرئيسية (master_plan_thanaweya.md - 1585 سطر)
- إنشاء seed script شامل (prisma/seed.ts)
- إضافة أوامر db:seed و db:reset لـ package.json
- اختبار الـ seed script بنجاح
- push إلى GitHub

**البيانات المُنشأة:**
- 3 سنوات دراسية (أولى، ثانية، ثالثة ثانوي)
- 3 تخصصات (علمي علوم، علمي رياضة، أدبي)
- 39 مادة دراسية
- 148 وحدة دراسية
- 444 درس مع محتوى
- 6 شارات (badges)

**توزيع المواد:**
- الصف الأول: 10 مواد (كلها مشتركة)
- الصف الثاني: 14 مادة (3 مشتركة + 4 علمي علوم + 3 علمي رياضة + 4 أدبي)
- الصف الثالث: 15 مادة (3 مشتركة + 4 علمي علوم + 4 علمي رياضة + 4 أدبي)

**Stage Summary:**
- ✅ Seed script شامل
- ✅ قاعدة بيانات جاهزة للـ deployment
- ✅ Push إلى GitHub

---

## 📊 ملخص الجلسة الكاملة

| المهمة | الحالة |
|--------|--------|
| إصلاح العرض | ✅ |
| نظام التنقل | ✅ |
| تنظيف البيانات | ✅ |
| إصلاح التخصصات | ✅ |
| UI التخصصات | ✅ |
| التوثيق | ✅ |
| إصلاح المناهج الناقصة | ✅ |
| توزيع التخصصات | ✅ |
| Seed Script | ✅ |

---

## Session: 2025-01-09

### Task ID: 7
**Agent:** Main
**Task:** إصلاح المناهج الناقصة وتوزيع التخصصات

**Work Log:**
- فحص المواد بدون وحدات (6 مواد)
- اكتشاف تكرار في الرياضيات بالصف الثالث
- حذف "الرياضيات (2)" المكررة (0 وحدات)
- توحيد التسمية: "الرياضيات 1" → "الرياضيات (1)"، "الرياضيات 2" → "الرياضيات (2)"
- إضافة وحدات ودروس للمواد الناقصة:
  - التاريخ (3 وحدات، 7 دروس)
  - الجغرافيا (2 وحدات، 5 دروس)
  - اللغة الفرنسية (2 وحدات، 5 دروس)
  - الفلسفة والمنطق (2 وحدات، 4 دروس)
  - الرياضيات (1) للصف الثاني (3 وحدات، 9 دروس)
- إصلاح توزيع الفيزياء والكيمياء:
  - إنشاء نسخ لعلمي علوم من نسخ علمي رياضة
  - الصف الثاني: فيزياء (6 وحدات)، كيمياء (6 وحدات)
  - الصف الثالث: فيزياء (7 وحدات)، كيمياء (6 وحدات)
- تحديث الـ documentation

**Stage Summary:**
- ✅ كل المواد بيها محتوى
- ✅ 39 مادة، 182 وحدة، 814 درس
- ✅ توزيع صحيح للتخصصات
- ✅ التوثيق محدث

---

## 📊 ملخص الجلسة الكاملة

| المهمة | الحالة |
|--------|--------|
| إصلاح العرض | ✅ |
| نظام التنقل | ✅ |
| تنظيف البيانات | ✅ |
| إصلاح التخصصات | ✅ |
| UI التخصصات | ✅ |
| التوثيق | ✅ |
| إصلاح المناهج الناقصة | ✅ |
| توزيع التخصصات | ✅ |

---

## Session: 2025-01-10

### Task ID: 2-c
**Agent:** Simulator Agent
**Task:** إنشاء محاكيات الموجات التفاعلية

**Work Log:**
- إنشاء 5 محاكيات فيزيائية للموجات في `/src/components/simulators/`:
  1. `WaveInterferenceSimulator.tsx` - محاكاة تداخل الموجات البنّاء والهدّام
  2. `WaveReflectionSimulator.tsx` - محاكاة انعكاس الموجات من نهاية ثابتة وحرة
  3. `StandingWaveSimulator.tsx` - محاكاة الموجات الواقفة والتوافقيات
  4. `DopplerSimulator.tsx` - محاكاة تأثير دوبلر
  5. `ResonanceSimulator.tsx` - محاكاة الرنين الصوتي والاهتزاز القسري

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization
  - تحكمات تفاعلية (sliders, buttons, switches)
  - تفسير فيزيائي للنتائج
  - دعم RTL للغة العربية
  - حسابات فيزيائية دقيقة

- تحديث `simulatorComponents.ts`:
  - إضافة exports للمحاكيات الجديدة
  - إضافة imports للمحاكيات
  - إضافة mappings في `simulatorMap`

**Stage Summary:**
- ✅ 5 محاكيات موجات كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات فيزيائية
- ✅ Lint passed بدون أخطاء

---

## Session: 2025-01-10 (Continued)

### Task ID: 2-d
**Agent:** Light/Optics Simulator Agent
**Task:** إنشاء محاكيات الضوء والبصريات التفاعلية

**Work Log:**
- إنشاء 5 محاكيات فيزيائية للضوء والبصريات في `/src/components/simulators/`:
  1. `LightReflectionSimulator.tsx` - محاكاة انعكاس الضوء
     - قانون الانعكاس (زاوية السقوط = زاوية الانعكاس)
     - دعم المرايا المستوية والمقعرة والمحدبة
     - عرض الخط العمودي والزوايا
     - تحريك الشعاع

  2. `LightRefractionSimulator.tsx` - محاكاة انكسار الضوء (قانون سنيل)
     - قانون سنيل: n₁ × sin(θ₁) = n₂ × sin(θ₂)
     - اختيار وسطين مختلفين (هواء، ماء، زجاج، ماس، بلاستيك، زيت)
     - حساب الزاوية الحرجة
     - كشف الانعكاس الكلي الداخلي

  3. `LensesSimulator.tsx` - محاكاة العدسات
     - عدسات محدبة (جامعة) ومقعرة (مفرقة)
     - تتبع الأشعة الضوئية
     - حساب بعد الصورة والتكبير
     - تحديد نوع الصورة (حقيقية/تخيلية، مقلوبة/معتدلة)

  4. `DiffractionSimulator.tsx` - محاكاة حيود الضوء
     - حيود الضوء عند شق واحد
     - التحكم في الطول الموجي (380-700 nm)
     - رسم بياني لشدة الضوء
     - حساب زوايا الحدود الدنيا

  5. `DoubleSlitSimulator.tsx` - محاكاة تجربة الشق المزدوج
     - تجربة يونغ للتداخل
     - تتبع الأشعة من الشقين
     - حساب تباعد الأهداب
     - عرض نمط التداخل على الشاشة

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, switches)
  - تفسير فيزيائي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات فيزيائية دقيقة
  - صيغ رياضية معروضة

- تحديث `simulatorComponents.ts`:
  - إضافة 5 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 5 mappings جديدة في `simulatorMap`:
    - `sim-physics-light-reflection`
    - `sim-physics-light-refraction`
    - `sim-physics-lenses`
    - `sim-physics-diffraction`
    - `sim-physics-double-slit`

**Stage Summary:**
- ✅ 5 محاكيات ضوء وبصريات كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات فيزيائية شاملة
- ✅ حسابات دقيقة (قانون سنيل، صيغة العدسة، حيود، تداخل)
- ✅ Lint passed بدون أخطاء

---

## Session: 2025-01-10 (Continued)

### Task ID: 2-a
**Agent:** Physics Simulators Developer
**Task:** إنشاء 5 محاكيات فيزيائية تفاعلية للحركة

**Work Log:**

1. قراءة المحاكيات الموجودة كمرجع (MotionSimulator.tsx, FreeFallSimulator.tsx)

2. إنشاء `VelocitySimulator.tsx` - محاكاة السرعة والتسارع
   - Canvas-based animation لسيارة متحركة
   - تحكم بالسرعة الابتدائية (0-30 م/ث)
   - تحكم بالتسارع (-5 إلى +10 م/ث²)
   - عرض الطاقة الحركية والتفسير الفيزيائي
   - دعم RTL للعربية

3. إنشاء `MotionGraphSimulator.tsx` - رسوم بيانية للحركة
   - 3 مخططات متزامنة (s-t, v-t, a-t)
   - تحديث مباشر أثناء المحاكاة
   - شرح العلاقة بين المنحنيات (الميل = السرعة/التسارع، المساحة = الإزاحة)
   - منحنيات نظرية (متقطع) وبيانات فعلية

4. إنشاء `MotionEquationsSimulator.tsx` - حاسبة معادلات الحركة
   - حساب أي مجهول من معادلات الحركة الأربعة
   - عرض المعادلات الأساسية
   - خطوات الحل والتفسير الفيزيائي
   - أمثلة جاهزة للتطبيق
   - عرض نوع الحركة (متسارع/متباطئ/منتظم)

5. إنشاء `PlanetaryFallSimulator.tsx` - السقوط الحر على الكواكب
   - 8 كواكب بجاذبية مختلفة (الأرض، القمر، المريخ، المشتري، الزهرة، عطارد، زحل، نبتون)
   - مقارنة زمن السقوط بين الكواكب (رسم بياني)
   - حساب الوزن على كل كوكب
   - تفسير فيزيائي لتأثير الجاذبية

6. إنشاء `FrictionSimulator.tsx` - محاكاة الاحتكاك
   - 5 أسطح مختلفة (خشب، جليد، خرسانة، مطاط، زجاج)
   - معاملات احتكاك سكوني وحركي
   - تحكم بالكتلة (1-50 كجم)
   - تحكم بالقوة المؤثرة (0-200 نيوتن)
   - تحكم بزاوية الميل (0-45 درجة)
   - عرض القوى المؤثرة (عمودية، احتكاك، محصلة)
   - تفسير فرق الاحتكاك السكوني والحركي

7. تحديث `simulatorComponents.ts`:
   - إضافة 5 exports جديدة
   - إضافة imports للمحاكيات
   - إضافة 5 mappings جديدة في `simulatorMap`:
     - `sim-physics-velocity-1`
     - `sim-physics-motion-graph-1`
     - `sim-physics-equations-1`
     - `sim-physics-planetary-fall-1`
     - `sim-physics-friction-1`

**Stage Summary:**
- ✅ 5 محاكيات فيزيائية جديدة
- ✅ Canvas-based مع تفاعل كامل
- ✅ دعم RTL للعربية
- ✅ تفسير فيزيائي للنتائج
- ✅ حسابات فيزيائية دقيقة
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/VelocitySimulator.tsx` (280 سطر)
- `/home/z/my-project/src/components/simulators/MotionGraphSimulator.tsx` (380 سطر)
- `/home/z/my-project/src/components/simulators/MotionEquationsSimulator.tsx` (320 سطر)
- `/home/z/my-project/src/components/simulators/PlanetaryFallSimulator.tsx` (420 سطر)
- `/home/z/my-project/src/components/simulators/FrictionSimulator.tsx` (380 سطر)

---

## Session: 2025-01-10 (Continued)

### Task ID: 2-b
**Agent:** Physics Simulator Agent
**Task:** إنشاء محاكيات فيزيائية تفاعلية (بندول، زنبرك، حركة دائرية، جاذبية، أقمار صناعية)

**Work Log:**
- إنشاء 5 محاكيات فيزيائية في `/src/components/simulators/`:

  1. `PendulumSimulator.tsx` - محاكاة البندول البسيط
     - حساب الدور والتردد: T = 2π√(L/g)
     - محاكاة الحركة التوافقية البسيطة
     - دعم التخميد (damping)
     - رسم بياني للزاوية مع الزمن
     - حساب الطاقة الكامنة والحركية والكلية
     - عرض متجهات السرعة والتسارع

  2. `SpringSimulator.tsx` - محاكاة الزنبرك والحركة التوافقية البسيطة
     - قانون هوك: F = -kx
     - حساب الدور: T = 2π√(m/k)
     - محاكاة باستخدام طريقة Runge-Kutta
     - دعم التخميد
     - رسم بياني للإزاحة مع الزمن
     - حساب الطاقات

  3. `CircularMotionSimulator.tsx` - محاكاة الحركة الدائرية
     - السرعة الخطية والزاوية
     - التسارع المركزي: a = v²/r = ω²r
     - القوة المركزية: F = mv²/r
     - عرض متجهات السرعة والتسارع
     - رسم بياني للموضع (x, y) مع الزمن
     - حساب الزخم الزاوي

  4. `GravitySimulator.tsx` - محاكاة الجاذبية وقانون نيوتن
     - قانون الجذب العام: F = G·m₁·m₂/r²
     - محاكاة مدارات (دائرية، بيضاوية، مكافئ، زائد)
     - حساب سرعة الإفلات والسرعة المدارية
     - عرض نوع المدار حسب الطاقة الكلية
     - تتبع مسار الجسم المداري

  5. `SatelliteSimulator.tsx` - محاكاة الأقمار الصناعية
     - السرعة المدارية: v = √(GM/r)
     - الدور المداري: T = 2π√(r³/GM)
     - تصنيف المدارات (LEO, MEO, HEO, Geostationary)
     - محاكاة الأرض مع القارات والغيوم
     - حسابات فيزيائية حقيقية (كتلة الأرض، نصف القطر)
     - عرض متجهات السرعة وقوة الجاذبية

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, checkboxes)
  - تفسير فيزيائي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات فيزيائية دقيقة
  - صيغ رياضية معروضة

- تحديث `simulatorComponents.ts`:
  - إضافة 5 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 5 mappings جديدة في `simulatorMap`

**Stage Summary:**
- ✅ 5 محاكيات فيزيائية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات فيزيائية شاملة
- ✅ حسابات دقيقة (معادلات الحركة، الطاقة، القوى)
- ✅ Lint passed بدون أخطاء


---

## Session: 2025-01-10 (Continued)

### Task ID: 2-f
**Agent:** Magnetism Simulator Agent
**Task:** إنشاء محاكيات المغناطيسية التفاعلية

**Work Log:**
- إنشاء 6 محاكيات فيزيائية للمغناطيسية في `/src/components/simulators/`:

  1. `MagnetismSimulator.tsx` - محاكاة المغناطيسية والمجال المغناطيسي
     - محاكاة تفاعلية لمغناطيس قضيب مع مادة قابلة للاختبار
     - 3 أنواع من المواد: مغناطيسية حديدي، ضعيف، معاكس
     - حساب القوة المغناطيسية باستخدام قانون التربيع العكسي
     - تفسير فيزيائي لكل نوع مادة
     - عرض خطوط المجال المغناطيسي

  2. `MagneticFieldLinesSimulator.tsx` - محاكاة خطوط المجال المغناطيسي
     - تصور خطوط المجال لـ 3 أنواع من المغناطيسات:
       - مغناطيس قضيب
       - مغناطيس حدوة حصان
       - مغناطيس دائري
     - بوصلة تفاعلية تتبع حركة الماوس
     - حساب شدة المجال عند أي نقطة
     - تفسير فيزيائي لخطوط المجال

  3. `ElectromagnetSimulator.tsx` - محاكاة المغناطيس الكهربائي
     - بناء مغناطيس كهربائي تفاعلي
     - التحكم بالتيار، عدد اللفات، نوع القلب، سمك السلك
     - محاكاة رفع أجسام مختلفة (مسمار، دبوس ورق، عملة)
     - حساب قوة المجال باستخدام المعادلة: B = μ₀ × μᵣ × n × I / L
     - تفسير العوامل المؤثرة على قوة المغناطيس

  4. `InductionSimulator.tsx` - محاكاة الحث الكهرومغناطيسي (قانون فاراداي)
     - محاكاة تحريك مغناطيس داخل ملف
     - حساب القوة الدافعة الكهربائية الحثية: EMF = -N × (ΔΦ/Δt)
     - رسم بياني مباشر للـ EMF
     - عرض قانون لنز وتفسيره
     - غلفانومتر يوضح اتجاه تيار الحث

  5. `TransformerSimulator.tsx` - محاكاة المحول الكهربائي
     - محول رافع وخافض وعزل
     - التحكم بالجهد الابتدائي، عدد اللفات، نوع القلب
     - رسم بياني للموجات الجهدية (ابتدائي وثانوي)
     - حساب نسبة التحويل والقدرة والكفاءة
     - تفسير المعادلة الأساسية: V₁/V₂ = N₁/N₂

  6. `MotorSimulator.tsx` - محاكاة المحرك الكهربائي
     - محرك DC و AC
     - محاكاة دوران الملف (rotor) في المجال المغناطيسي
     - عرض المبدّل (commutator) لمحرك DC
     - حساب سرعة الدوران، عزم الدوران، القدرة
     - تفسير قوة لورنتز ومبدأ عمل المحرك

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, switches)
  - تفسير فيزيائي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات فيزيائية دقيقة
  - صيغ رياضية معروضة

- تحديث `simulatorComponents.ts`:
  - إضافة 6 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 6 mappings جديدة في `simulatorMap`:
    - `sim-physics-magnetism-1`
    - `sim-physics-magnetic-field-lines`
    - `sim-physics-electromagnet-1`
    - `sim-physics-induction-1`
    - `sim-physics-transformer-1`
    - `sim-physics-motor-1`

**Stage Summary:**
- ✅ 6 محاكيات مغناطيسية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات فيزيائية شاملة
- ✅ حسابات دقيقة (قانون فاراداي، قوة لورنتز، نسبة التحويل)
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/MagnetismSimulator.tsx`
- `/home/z/my-project/src/components/simulators/MagneticFieldLinesSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ElectromagnetSimulator.tsx`
- `/home/z/my-project/src/components/simulators/InductionSimulator.tsx`
- `/home/z/my-project/src/components/simulators/TransformerSimulator.tsx`
- `/home/z/my-project/src/components/simulators/MotorSimulator.tsx`

---

### Task ID: 2-e
**Agent:** Electric Circuits Simulator Agent
**Task:** إنشاء محاكيات الكهرباء التفاعلية

**Work Log:**
- إنشاء 6 محاكيات كهربائية في `/src/components/simulators/`:

  1. `ElectricChargeSimulator.tsx` - محاكاة الشحنة الكهربائية وقانون كولوم
     - قانون كولوم: F = k|q₁q₂|/r²
     - تحكم بالشحنتين (-10 إلى +10 ميكروكولوم)
     - تحكم بالمسافة (0.1 إلى 2 متر)
     - عرض القوة (تجاذب/تنافر)
     - خطوط المجال الكهربائي

  2. `ElectricFieldSimulator.tsx` - محاكاة المجال الكهربائي
     - عرض خطوط المجال الكهربائي
     - خطوط تساوي الجهد
     - شحنة اختبار تفاعلية (نقر لتحريك)
     - حساب شدة المجال والمسافة

  3. `ElectricPotentialSimulator.tsx` - محاكاة الجهد الكهربائي
     - حساب الجهد: V = kQ/r
     - حساب الطاقة الكامنة: U = kQq/r
     - رسم بياني للجهد مع المسافة
     - أسطح تساوي الجهد

  4. `SeriesParallelSimulator.tsx` - محاكاة دوائر التوالي والتوازي
     - تبديل بين دائرة توالي وتوازي
     - 3 مقاومات قابلة للتعديل
     - تحريك التيار في الدائرة
     - حساب المقاومة الكلية والتيار الكلي
     - عرض التيار والجهد عبر كل مقاومة

  5. `OhmsLawSimulator.tsx` - محاكاة قانون أوم
     - حساب أي مجهول (V, I, R)
     - منحنى V-I التفاعلي
     - تحريك التيار في الدائرة
     - عرض القدرة الكهربائية

  6. `ElectricPowerSimulator.tsx` - محاكاة القدرة الكهربائية
     - صيغ القدرة: P=VI, P=I²R, P=V²/R
     - حساب الطاقة: E = P × t
     - مصباح يضيء حسب القدرة
     - رسم بياني للقدرة مع الزمن
     - حساب التكلفة التقريبية (جنيه مصري)
     - حساب الحرارة المتولدة

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons)
  - تفسير فيزيائي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات فيزيائية دقيقة
  - صيغ رياضية معروضة

- تحديث `simulatorComponents.ts`:
  - إضافة 6 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 6 mappings جديدة في `simulatorMap`:
    - `sim-physics-electric-charge-1`
    - `sim-physics-electric-field-1`
    - `sim-physics-electric-potential-1`
    - `sim-physics-series-parallel-1`
    - `sim-physics-ohms-law-1`
    - `sim-physics-electric-power-1`

**Stage Summary:**
- ✅ 6 محاكيات كهربائية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات فيزيائية شاملة
- ✅ حسابات دقيقة (قانون كولوم، قانون أوم، القدرة)
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/ElectricChargeSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ElectricFieldSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ElectricPotentialSimulator.tsx`
- `/home/z/my-project/src/components/simulators/SeriesParallelSimulator.tsx`
- `/home/z/my-project/src/components/simulators/OhmsLawSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ElectricPowerSimulator.tsx`

---

### Task ID: 2-h
**Agent:** Chemistry Bond Simulators Agent
**Task:** إنشاء محاكيات الكيمياء للروابط والجزيئات

**Work Log:**
- إنشاء 6 محاكيات كيميائية في `/src/components/simulators/`:

  1. `IonicBondSimulator.tsx` - محاكاة الرابطة الأيونية
     - محاكاة انتقال الإلكترونات بين الذرات
     - 4 مركبات أيونية: NaCl, MgO, CaF₂, KBr
     - عرض تكوين الكاتيون والأنيون
     - حساب طاقة الشبكة البلورية
     - عرض الشبكة البلورية ثلاثية الأبعاد
     - تفسير قاعدة الثمانية

  2. `CovalentBondSimulator.tsx` - محاكاة الرابطة التساهمية
     - محاكاة مشاركة الإلكترونات بين الذرات
     - 6 جزيئات: H₂, O₂, N₂, H₂O, CO₂, CH₄
     - عرض الروابط الأحادية والثنائية والثلاثية
     - عرض الأزواج الحرة من الإلكترونات
     - حساب طاقة الرابطة وزوايا الرابطة
     - تفسير قاعدة الثمانية

  3. `MetallicBondSimulator.tsx` - محاكاة الرابطة الفلزية
     - محاكاة بحر الإلكترونات (delocalized electrons)
     - 8 فلزات: Na, Mg, Al, Fe, Cu, Au, Ag, Zn
     - التحكم بالحرارة والجهد الكهربي
     - عرض التوصيل الكهربي عند تطبيق جهد
     - حساب التوصيلية ودرجة الانصهار
     - تفسير خصائص الفلزات (الطرق، السحب، اللمعان)

  4. `MolecularGeometrySimulator.tsx` - محاكاة هندسة الجزيئات (VSEPR)
     - 10 أشكال جزيئية:
       - خطي، مثلثي مستوي، منحني
       - رباعي الوجوه، هرمي ثلاثي
       - هرمي ثلاثي مزدوج، أرجوحة
       - ثماني الوجوه، هرمي مربع
     - عرض ثلاثي الأبعاد مع دوران تفاعلي
     - عرض الأزواج الحرة وسحابات الإلكترونات
     - حساب زوايا الرابطة والتهجين
     - تحديد قطبية الجزيء

  5. `IntermolecularForcesSimulator.tsx` - محاكاة قوى التجاذب الجزيئية
     - 3 أنواع من القوى:
       - رابطة هيدروجينية (أقوى)
       - ثنائي قطب-ثنائي قطب
       - قوى لندن-ديسبيرسون (أضعف)
     - 6 جزيئات للتمثيل: H₂O, NH₃, HCl, CH₄, CO₂, HF
     - التحكم بالحرارة لمشاهدة تغير الحالة
     - عرض خطوط القوى بين الجزيئات
     - حساب درجة الغليان وقوة التجاذب

  6. `PolaritySimulator.tsx` - محاكاة قطبية الجزيئات
     - محاكاة عزم ثنائي القطب
     - 8 جزيئات: H₂O, CO₂, NH₃, CH₄, HCl, BF₃, H₂S, CCl₄
     - عرض الشحنات الجزئية (δ+ و δ-)
     - عرض ثنائيات أقطاب الروابط
     - تطبيق مجال كهربي لمشاهدة استجابة الجزيء
     - حساب فرق السالبية الكهربية
     - تفسير الذوبانية ("المثل يذوب في المثل")

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, checkboxes)
  - تفسير كيميائي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات كيميائية دقيقة

- تحديث `simulatorComponents.ts`:
  - إضافة 6 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 6 mappings جديدة في `simulatorMap`:
    - `sim-chemistry-ionic-bond`
    - `sim-chemistry-covalent-bond`
    - `sim-chemistry-metallic-bond`
    - `sim-chemistry-molecular-geometry`
    - `sim-chemistry-intermolecular-forces`
    - `sim-chemistry-polarity`

**Stage Summary:**
- ✅ 6 محاكيات كيميائية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات كيميائية شاملة
- ✅ حسابات دقيقة (السالبية الكهربية، عزم ثنائي القطب، طاقة الشبكة)
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/IonicBondSimulator.tsx`
- `/home/z/my-project/src/components/simulators/CovalentBondSimulator.tsx`
- `/home/z/my-project/src/components/simulators/MetallicBondSimulator.tsx`
- `/home/z/my-project/src/components/simulators/MolecularGeometrySimulator.tsx`
- `/home/z/my-project/src/components/simulators/IntermolecularForcesSimulator.tsx`
- `/home/z/my-project/src/components/simulators/PolaritySimulator.tsx`

---

### Task ID: 2-g
**Agent:** Chemistry Simulators Developer
**Task:** إنشاء محاكيات الكيمياء التفاعلية للبناء الذري

**Work Log:**
- إنشاء 6 محاكيات كيميائية في `/src/components/simulators/`:

  1. `AtomStructureSimulator.tsx` - محاكاة البناء الذري
     - عرض البروتونات والنيوترونات والإلكترونات
     - اختيار العناصر من 1 إلى 20
     - وضع مخصص للتحكم في عدد الجسيمات
     - حساب الأغلفة الإلكترونية (2, 8, 18)
     - تحريك الإلكترونات حول النواة
     - عرض الشحنة والكتلة الذرية
     - تفسير كيميائي للبناء الذري

  2. `AtomicModelsSimulator.tsx` - محاكاة تطور النماذج الذرية
     - نموذج دالتون (1803) - الذرة المصمتة
     - نموذج طومسون (1897) - البرقوق في الكعكة
     - نموذج رذرفورد (1911) - النواة والفراغ
     - نموذج بور (1913) - مستويات الطاقة
     - النموذج الكمومي (1926) - الأفلاك الاحتمالية
     - رسوم متحركة لكل نموذج مع شرح تاريخي
     - خط زمني تفاعلي

  3. `ElectronConfigurationSimulator.tsx` - محاكاة التوزيع الإلكتروني
     - اختيار العناصر أو وضع مخصص
     - رسم بياني لمستويات الطاقة والأفلاك
     - عرض التوزيع الإلكتروني بالرموز (1s² 2s² 2p⁶...)
     - حساب إلكترونات التكافؤ والقلب
     - شرح قواعد أوفباو وباولي وهند
     - تمثيل بصري للذرة مع الأغلفة

  4. `OrbitalsSimulator.tsx` - محاكاة الأفلاك الإلكترونية
     - عرض أفلاك s, p, d, f ثلاثية الأبعاد
     - سحابات احتمالية متحركة
     - اختيار الأفلاك الفرعية (s, px/py/pz, dxy/dxz/dyz/dx²-y²/dz², f...)
     - التحكم في كثافة الإلكترونات
     - إظهار العقد السطحية
     - شرح أشكال الأفلاك وعدد الإلكترونات

  5. `PeriodicTrendsSimulator.tsx` - محاكاة الاتجاهات الدورية
     - نصف القطر الذري (pm)
     - طاقة التأين (kJ/mol)
     - الألفة الإلكترونية (kJ/mol)
     - السالبية الكهربائية (مقياس باولنج)
     - رسوم بيانية للدورات 2 و 3
     - جدول دوري مصغر تفاعلي
     - شرح الاتجاهات عبر الدورة وأسفل المجموعة

  6. `ElectronegativitySimulator.tsx` - محاكاة السالبية الكهربائية
     - مقارنة بين عنصرين
     - مقياس باولنج الكامل
     - تحديد نوع الرابطة:
       - أيونية (ΔEN > 1.7)
       - تساهمية قطبية (0.4 < ΔEN < 1.7)
       - تساهمية غير قطبية (ΔEN < 0.4)
     - عرض انتقال الإلكترون والشحنات الجزئية
     - شرح الاتجاهات في الجدول الدوري

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, selectors)
  - تفسير كيميائي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات كيميائية دقيقة

- تحديث `simulatorComponents.ts`:
  - إضافة 6 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 6 mappings جديدة في `simulatorMap`:
    - `sim-chemistry-atom-structure`
    - `sim-chemistry-atomic-models`
    - `sim-chemistry-electron-config`
    - `sim-chemistry-orbitals`
    - `sim-chemistry-periodic-trends`
    - `sim-chemistry-electronegativity`

**Stage Summary:**
- ✅ 6 محاكيات كيميائية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات كيميائية شاملة
- ✅ حسابات دقيقة (التوزيع الإلكتروني، السالبية، الاتجاهات الدورية)
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/AtomStructureSimulator.tsx`
- `/home/z/my-project/src/components/simulators/AtomicModelsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ElectronConfigurationSimulator.tsx`
- `/home/z/my-project/src/components/simulators/OrbitalsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/PeriodicTrendsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ElectronegativitySimulator.tsx`

---

### Task ID: 2-i
**Agent:** Chemistry Reactions Simulator Agent
**Task:** إنشاء محاكيات التفاعلات الكيميائية التفاعلية

**Work Log:**
- إنشاء 6 محاكيات كيميائية في `/src/components/simulators/`:

  1. `ReactionTypesSimulator.tsx` - محاكاة أنواع التفاعلات الكيميائية
     - 4 أنواع من التفاعلات:
       - تفاعل الاتحاد (2H₂ + O₂ → 2H₂O)
       - تفاعل التحلل (2H₂O → 2H₂ + O₂)
       - تفاعل الإحلال الفردي (Zn + 2HCl → ZnCl₂ + H₂)
       - تفاعل الإحلال المزدوج (AgNO₃ + NaCl → AgCl↓ + NaNO₃)
     - محاكاة حركية للجزيئات
     - التحكم في سرعة التفاعل
     - عرض المعادلات الكيميائية
     - تفسير كيميائي لكل نوع تفاعل

  2. `BalancingEquationsSimulator.tsx` - لعبة موازنة المعادلات الكيميائية
     - 5 معادلات بمستويات صعوبة مختلفة
     - إدخال المعاملات التفاعلي
     - رسم بياني لمقارنة عدد الذرات
     - نظام تسجيل النقاط
     - تلميحات مساعدة
     - شرح قانون حفظ الكتلة

  3. `ActivationEnergySimulator.tsx` - محاكاة طاقة التنشيط
     - تفاعلات طاردة وماصة للحرارة
     - رسم بياني للطاقة الكامنة
     - تأثير المحفزات (خفض طاقة التنشيط)
     - التحكم بالحرارة
     - توزيع بولتزمان للطاقة
     - حساب نسبة الجزيئات فوق طاقة التنشيط

  4. `ChemicalEquilibriumSimulator.tsx` - محاكاة التوازن الكيميائي
     - تفاعل هابر: N₂ + 3H₂ ⇌ 2NH₃
     - تطبيق مبدأ لوشاتيليه:
       - تأثير تغير التركيز
       - تأثير تغير الحرارة
       - تأثير تغير الضغط
     - حساب ثابت التوازن (Kc) وحاصل التفاعل (Q)
     - محاكاة انتقال التوازن
     - سرعات التفاعل الأمامي والعكسي

  5. `SolutionsSimulator.tsx` - محاكاة المحاليل والتركيز
     - 3 مواد مذابة: NaCl, سكر, CuSO₄
     - التحكم بكتلة المذاب وحجم المذيب
     - تأثير الحرارة على الذوبانية
     - حساب التركيز المولاري والمولالية
     - تحديد حالة المحلول (مشبع/غير مشبع)
     - محاكاة حركية للجزيئات المذابة

  6. `AcidsBasesSimulator.tsx` - محاكاة الأحماض والقواعد وpH
     - 6 مواد: HCl, H₂SO₄, CH₃COOH, NaOH, NH₃, H₂O
     - حساب pH و pOH وتركيز الأيونات
     - محاكاة المعايرة (titration)
     - كاشف pH (يتغير لونه حسب الحموضة)
     - منحنى المعايرة
     - شرح نظريات أرهينيوس وبرونستد-لوري

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, selectors)
  - تفسير كيميائي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات كيميائية دقيقة

- تحديث `simulatorComponents.ts`:
  - إضافة 6 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 6 mappings جديدة في `simulatorMap`:
    - `sim-chemistry-reaction-types`
    - `sim-chemistry-balancing-equations`
    - `sim-chemistry-activation-energy`
    - `sim-chemical-equilibrium`
    - `sim-chemistry-solutions`
    - `sim-chemistry-acids-bases`

**Stage Summary:**
- ✅ 6 محاكيات كيميائية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات كيميائية شاملة
- ✅ حسابات دقيقة (pH، ثابت التوازن، التركيز، طاقة التنشيط)
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/ReactionTypesSimulator.tsx`
- `/home/z/my-project/src/components/simulators/BalancingEquationsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ActivationEnergySimulator.tsx`
- `/home/z/my-project/src/components/simulators/ChemicalEquilibriumSimulator.tsx`
- `/home/z/my-project/src/components/simulators/SolutionsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/AcidsBasesSimulator.tsx`

---

### Task ID: 2-k
**Agent:** Engineering Geometry Simulator Agent
**Task:** إنشاء محاكيات هندسية تفاعلية للرياضيات

**Work Log:**
- إنشاء 8 محاكيات هندسية في `/src/components/simulators/`:

  1. `AnglesSimulator.tsx` - محاكاة الزوايا (قياس وتصنيف)
     - تحكم بالزاوية من 0° إلى 360°
     - تصنيف تلقائي (حادة، قائمة، منفرجة، مستقيمة، مائلة، كاملة)
     - إظهار/إخفاء المنقلة
     - تحريك من 0° إلى 360°
     - حساب الزوايا المتممة والمكملة
     - حساب طول القوس ومساحة القطاع
     - المعادلات: طول القوس = θ × r، مساحة القطاع = ½ × r² × θ

  2. `PolygonsSimulator.tsx` - محاكاة المضلعات
     - تحكم بعدد الأضلاع (3-12)
     - تحكم بطول الضلع
     - إظهار/إخفاء الأقطار والمركز
     - حساب الخصائص:
       - المحيط والمساحة
       - الزاوية الداخلية والخارجية
       - مجموع الزوايا الداخلية
       - عدد الأقطار
     - عرض أسماء المضلعات بالعربية والإنجليزية

  3. `CircleGeometrySimulator.tsx` - محاكاة خصائص الدائرة
     - تحكم بنصف القطر
     - تحكم بالزاوية المركزية
     - إظهار/إخفاء الوتر والمماس والقطاع
     - حساب:
       - القطر والمحيط والمساحة
       - طول القوس
       - طول الوتر
       - مساحة القطاع والقطعة

  4. `AreaVolumeSimulator.tsx` - حاسبة المساحة والحجم
     - 6 أشكال هندسية:
       - مكعب، كرة، أسطوانة، مخروط، هرم مربع، متوازي مستطيلات
     - تحكم بالأبعاد (طول، عرض، ارتفاع، نصف قطر)
     - حساب:
       - المساحة السطحية
       - الحجم
       - المساحة الجانبية
       - مساحة القاعدة
     - عرض المعادلات لكل شكل

  5. `PythagoreanSimulator.tsx` - محاكاة نظرية فيثاغورس
     - تحكم بالضلعين أ و ب
     - حساب الوتر تلقائياً
     - إظهار المربعات على الأضلاع
     - تحريك لإثبات النظرية
     - التحقق: أ² + ب² = ج²
     - حساب الزوايا

  6. `VectorsSimulator.tsx` - محاكاة المتجهات
     - إضافة حتى 6 متجهات
     - تحكم بالمركبة السينية والصادية
     - جمع وطرح المتجهات
     - إظهار المحصلة والمركبات
     - حساب المقدار والزاوية لكل متجه
     - شبكة إحداثيات تفاعلية

  7. `DotProductSimulator.tsx` - محاكاة حاصل الضرب الاتجاهي
     - متجهان A و B في المستوى
     - حساب حاصل الضرب النقطي
     - عرض الزاوية بين المتجهين
     - إظهار الإسقاط
     - تحديد العلاقة (متوازيان، متعامدان، حادة، منفرجة)
     - المعادلات: أ · ب = |أ| |ب| cos(θ) = أس × بس + أص × بص

  8. `CrossProductSimulator.tsx` - محاكاة حاصل الضرب المتجهي
     - متجهان A و B في المستوى XY
     - حساب حاصل الضرب المتجهي (على المحور Z)
     - عرض مساحة متوازي الأضلاع والمثلث
     - قاعدة اليد اليمنى
     - تحديد الاتجاه (خارج/داخل الصفحة)
     - المعادلة: |أ × ب| = |أ| |ب| sin(θ)

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, switches)
  - تفسير رياضي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات رياضية دقيقة
  - صيغ رياضية معروضة

- تحديث `simulatorComponents.ts`:
  - إضافة 8 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 8 mappings جديدة في `simulatorMap`:
    - `sim-math-angles`
    - `sim-math-polygons`
    - `sim-math-circle-geometry`
    - `sim-math-area-volume`
    - `sim-math-pythagorean`
    - `sim-math-vectors`
    - `sim-math-dot-product`
    - `sim-math-cross-product`

**Stage Summary:**
- ✅ 8 محاكيات هندسية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات رياضية شاملة
- ✅ حسابات دقيقة (زوايا، مساحات، أحجام، متجهات)
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/AnglesSimulator.tsx`
- `/home/z/my-project/src/components/simulators/PolygonsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/CircleGeometrySimulator.tsx`
- `/home/z/my-project/src/components/simulators/AreaVolumeSimulator.tsx`
- `/home/z/my-project/src/components/simulators/PythagoreanSimulator.tsx`
- `/home/z/my-project/src/components/simulators/VectorsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/DotProductSimulator.tsx`
- `/home/z/my-project/src/components/simulators/CrossProductSimulator.tsx`

---

### Task ID: 2-j
**Agent:** Algebra Simulator Agent
**Task:** إنشاء محاكيات الجبر التفاعلية

**Work Log:**
- إنشاء 9 محاكيات جبرية في `/src/components/simulators/`:

  1. `LinearEquationsSimulator.tsx` - محاكاة المعادلات الخطية
     - معادلة ax + b = c
     - تحكم بالمعاملات a, b, c
     - حل خطوة بخطوة مع رسوم متحركة
     - ميزان توازن تفاعلي
     - تفسير رياضي للحل

  2. `LineGraphSimulator.tsx` - راسم الخط المستقيم
     - معادلة y = mx + b
     - تحكم بالميل (m) ونقطة التقاطع (b)
     - مثلث الميل (Rise/Run)
     - نقطة تفاعلية على الخط
     - حساب قيمة y لأي قيمة x

  3. `LineIntersectionSimulator.tsx` - محاكاة تقاطع المستقيمات
     - خطان: y = m₁x + b₁ و y = m₂x + b₂
     - تحكم بمعاملات الخطين
     - حساب نقطة التقاطع
     - تحديد نوع العلاقة (متوازيان، متعامدان، نفس الخط)
     - حساب الزاوية بين الخطين

  4. `QuadraticEquationsSimulator.tsx` - محاكاة المعادلات التربيعية
     - معادلة ax² + bx + c = 0
     - تحكم بالمعاملات a, b, c
     - رسم القطع المكافئ
     - حساب المميز (Discriminant)
     - عرض الجذور والرأس ومحور التناظر
     - حل خطوة بخطوة

  5. `ParabolaGraphSimulator.tsx` - راسم القطع المكافئ
     - معادلة y = ax² + bx + c
     - تحكم بالمعاملات
     - عرض: الرأس، الجذور، محور التناظر، البؤرة، الدليل
     - حساب المميز وتفسيره
     - تحديد فتحة القطع (للأعلى/للأسفل، ضيق/واسع)

  6. `QuadraticFormulaSimulator.tsx` - محاكاة الصيغة العامة
     - الصيغة: x = (-b ± √(b² - 4ac)) / 2a
     - إدخال يدوي للقيم
     - حل خطوة بخطوة مع رسوم متحركة
     - عرض المميز ونوع الجذور
     - تفسير شامل للصيغة

  7. `SystemsEquationsSimulator.tsx` - محاكاة أنظمة المعادلات
     - نظام معادلتين: a₁x + b₁y = c₁, a₂x + b₂y = c₂
     - 3 طرق للحل: بيانية، تعويض، حذف
     - تحكم بجميع المعاملات
     - رسم الخطين مع نقطة التقاطع
     - تحديد نوع الحل (وحيد، لا يوجد، لا نهائي)
     - خطوات حل مفصلة لكل طريقة

  8. `LogarithmsSimulator.tsx` - محاكاة اللوغاريتمات
     - دالة لوغاريتمية: logₐ(x)
     - دالة أسية: aˣ
     - اختيار الأساس (10, 2, e, مخصص)
     - رسم الدالتين معاً
     - آلة حاسبة للوغاريتم والأس
     - عرض خصائص اللوغاريتم

  9. `MatricesSimulator.tsx` - محاكاة المصفوفات
     - مصفوفتان 2×2 قابل للتعديل
     - 5 عمليات: جمع، طرح، ضرب، محدد، معكوس
     - عرض المصفوفات بأقواس
     - حساب المحدد والمعكوس
     - عرض خصائص المصفوفات

- كل محاكي يحتوي على:
  - `'use client'` directive
  - Props: `{ language: 'ar' | 'en' }`
  - Canvas-based visualization تفاعلية
  - تحكمات كاملة (sliders, buttons, inputs)
  - تفسير رياضي شامل للنتائج
  - دعم RTL للغة العربية
  - حسابات رياضية دقيقة
  - صيغ رياضية معروضة

- تحديث `simulatorComponents.ts`:
  - إضافة 9 exports جديدة
  - إضافة imports للمحاكيات
  - إضافة 9 mappings جديدة في `simulatorMap`:
    - `sim-math-linear-equations`
    - `sim-math-line-graph`
    - `sim-math-line-intersection`
    - `sim-math-quadratic-equations`
    - `sim-math-parabola-graph`
    - `sim-math-quadratic-formula`
    - `sim-math-systems-equations`
    - `sim-math-logarithms`
    - `sim-math-matrices`

**Stage Summary:**
- ✅ 9 محاكيات جبرية كاملة
- ✅ دعم ثنائي اللغة (عربي/إنجليزي)
- ✅ تحكمات تفاعلية كاملة
- ✅ تفسيرات رياضية شاملة
- ✅ حسابات دقيقة (معادلات، لوغاريتمات، مصفوفات)
- ✅ Lint passed بدون أخطاء

**الملفات المنشأة:**
- `/home/z/my-project/src/components/simulators/LinearEquationsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/LineGraphSimulator.tsx`
- `/home/z/my-project/src/components/simulators/LineIntersectionSimulator.tsx`
- `/home/z/my-project/src/components/simulators/QuadraticEquationsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/ParabolaGraphSimulator.tsx`
- `/home/z/my-project/src/components/simulators/QuadraticFormulaSimulator.tsx`
- `/home/z/my-project/src/components/simulators/SystemsEquationsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/LogarithmsSimulator.tsx`
- `/home/z/my-project/src/components/simulators/MatricesSimulator.tsx`


---

### Task ID: 2-l
**Agent:** Fullstack Dev
**Task:** إنشاء محاكيات علم المثلثات والتفاضل والتكامل

**Work Log:**
- إنشاء 10 محاكيات رياضية جديدة في مجلد `/home/z/my-project/src/components/simulators/`
- كل محاكي يدعم العربية والإنجليزية مع RTL
- استخدام Canvas للرسم التفاعلي
- تحكمات كاملة (sliders, buttons, checkboxes)
- تفسيرات رياضية واضحة

**Files Created:**
1. `TrigFunctionsSimulator.tsx` - محاكاة الدوال المثلثية (sin, cos, tan) على دائرة الوحدة
2. `TrigCurvesSimulator.tsx` - راسم المنحنيات المثلثية مع تأثير المعاملات
3. `TrigIdentitiesSimulator.tsx` - محاكاة المتطابقات المثلثية (فيثاغورس، الزاوية المضاعفة، الجمع)
4. `LawOfSinesSimulator.tsx` - محاكاة قانون الجيب لحساب أضلاع وزوايا المثلث
5. `LawOfCosinesSimulator.tsx` - محاكاة قانون جيب التمام (SAS و SSS)
6. `LimitsSimulator.tsx` - محاكاة النهايات مع الاقتراب من نقطة
7. `DerivativesSimulator.tsx` - محاكاة الاشتقاق والخط المماس
8. `IntegralsSimulator.tsx` - محاكاة التكامل المحدود
9. `AreaUnderCurveSimulator.tsx` - محاكاة المساحة تحت المنحنى (Riemann sums)
10. `MaxMinSimulator.tsx` - محاكاة القيم العظمى والدنيا والنقاط الحرجة

**Updated:**
- `simulatorComponents.ts` - إضافة الـ exports والـ simulatorMap

**Stage Summary:**
- ✅ 10 محاكيات جديدة لعلم المثلثات والتفاضل والتكامل
- ✅ دعم كامل للعربية والإنجليزية
- ✅ تصميم RTL للعربية
- ✅ Canvas-based مع تفاعل كامل
- ✅ تحكمات (sliders, buttons)
- ✅ تفسير رياضي للنتائج
- ✅ ESLint: لا أخطاء


---
Task ID: full-function-test
Agent: Main
Task: Full function test - discover and fix all issues

Work Log:
- Read worklog and understood current project state (SmartEdu v2.0)
- Checked dev server logs for errors
- Ran ESLint (7 errors only in scripts/, not in app code)
- Comprehensive code review of ALL pages (8 pages)
- Discovered and fixed 7 categories of issues:
  1. ThemeProvider conflict: All pages managed isDark state manually, conflicting with ThemeProvider from next-themes
  2. Sticky footer: All pages missing `flex flex-col` wrapper, making `mt-auto` on footer useless
  3. Landing page language: Had its own useState for language, not synced with platform's LanguageProvider
  4. "See How It Works" button: Did nothing, added smooth scroll to #features section
  5. RTL arrow direction: Back buttons used ArrowLeft even in RTL mode
  6. Next.js 15 params: Server components accessed params synchronously, but Next.js 15 requires await
  7. Missing factory route: /factory returns 404 (low priority - not linked from anywhere)
- Full HTTP test on all 8 routes - ALL return HTTP 200
- Verified no errors in dev log after fixes
- Verified all key content present (flex flex-col, mt-auto, features section, etc.)

Stage Summary:
- 10+ files modified across the project
- All 8 pages verified working: /, /platform, /platform/year/[code], /platform/subject/[id], /platform/lesson/[id], /platform/simulations, /platform/tools, /platform/simulations/[id]
- Zero compilation errors in dev log
- ESLint clean for all app source files
---
---
Task ID: docs-factory
Agent: Main
Task: Create comprehensive factory documentation (POD, PLAN, WORKFLOW, OEM-BOOK, CONSTRUCTION-BOOK)

Work Log:
- Saved user laptop specs and AI models to worklog
- Created docs/factory/POD.md (1,802 lines - Product Requirements Document)
- Created docs/factory/PLAN.md (1,056 lines - Implementation Plan)
- Created docs/factory/WORKFLOW.md (2,562 lines - Workflow Document)
- Created docs/factory/OEM-BOOK.md (2,074 lines - Operation & Maintenance Manual)
- Created docs/factory/CONSTRUCTION-BOOK.md (2,039 lines - Full Construction Reference)
- Total: ~9,533 lines of comprehensive Arabic documentation

Stage Summary:
- All 5 documentation files created in docs/factory/
- Total documentation: ~9,533 lines
- User specs saved: i7-10750H, 32GB RAM, RTX 4000 Max-Q 8GB
- AI Models: LM Studio (Qwen3 1.7B, Qwen2.5 7B, Scaled Oss 36B), Ollama (DeepSeek-Coder V2:16B, Qwen2.5-Coder:7B), Foocus (Image Gen)
- Ready for GitHub push
