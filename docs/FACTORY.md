# 🏭 دليل المصنع التفصيلي — Video Factory v2.0

> **المستند:** التشريح الهندسي الكامل لنظام مصنع الفيديو التعليمي
> **الإصدار:** 2.0.0

---

## 🎯 التعريف والهدف

**مصنع النصوص (Book Text Factory)** هو نظام متكامل لتحويل الكتب المدرسية (PDF) إلى محتوى تعليمي منظم، ثم إنتاج مواد تعليمية متعددة الأنواع منه.

### سير العمل الكامل

```
PDF ──→ نص خام ──→ محتوى منظم ──→ سكربت / ملخص / امتحان / مواد
                                        │
                                        ▼
                                   صوت (TTS)
                                        │
                                        ▼
                                   فيديو تعليمي
                                        │
                                        ▼
                                   تصدير + نشر
```

---

## 🖥️ لوحة التحكم الرئيسية — FactoryDashboard

**الملف:** `src/components/factory/FactoryDashboard.tsx`

### البنية المعمارية للمكون

```
FactoryDashboard (root)
├── SidebarContent (desktop: fixed, mobile: Sheet drawer)
│   ├── Logo Section (Factory icon + title)
│   ├── Nav Sections (4 أقسام × 12 تبويبة)
│   └── Collapse Button
├── Top Bar (current tab name + ThemeToggle)
└── Content Area (renderTab() + Framer Motion)
```

### أقسام التنقل

```
┌─────────────────────────────────────────────┐
│   الرئيسية                                   │
│   ├── 📊 لوحة التحكم (home)                  │
│   └── 📦 المصادر (sources)                   │
├─────────────────────────────────────────────┤
│   العملية                                    │
│   ├── ⚡ الاستخراج (extraction)              │
│   ├── 📄 المحتوى (content)                   │
│   └── 👁️ المعاينة (preview)                  │
├─────────────────────────────────────────────┤
│   الإنتاج                                    │
│   ├── 🎬 الفيديو (video)                     │
│   ├── 📝 الملخصات (summaries)               │
│   ├── 📋 الامتحانات (exams)                  │
│   └── 🧠 المواد المساعدة (materials)        │
├─────────────────────────────────────────────┤
│   النظام                                     │
│   ├── 🤖 النماذج (models)                    │
│   ├── ⚙️ الإعدادات (settings)               │
│   └── 📜 السجلات (logs)                      │
└─────────────────────────────────────────────┘
```

---

## 📦 تبويبة المصادر — SourcesTab

**الملف:** `src/components/factory/SourcesTab.tsx`
**المكمل:** `src/components/factory/BookUploader.tsx`

### الوظائف

| الوظيفة | الوصف |
|---------|-------|
| رفع PDF | سحب وإفلات + زر اختيار ملف |
| رفع صور | اختيار متعدد مع معاينة مصغّرة |
| إضافة URL | حقل إدخال رابط (placeholder) |
| قائمة الكتب | جدول يعرض الكتب المرفوعة مع فلترة |

### مكون BookUploader

```
BookUploader
├── Drop Zone (drag & drop)
│   ├── منطقة إفلات كبيرة (dashed border)
│   ├── أيقونة Upload + نص تعليمي
│   └── مؤشر السحب (active state)
├── File Input (hidden)
└── Upload Handler
    ├── التحقق من نوع الملف (PDF)
    ├── POST /api/books (FormData)
    └── Toast notification
```

---

## ⚡ تبويبة الاستخراج — ExtractionTab

**الملف:** `src/components/factory/ExtractionTab.tsx`

### مراحل الاستخراج

```
📋 قائمة الكتب
    │
    ├── [استخراج] → POST /api/books/[id]/extract
    │   ├── Book.status = 'extracting'
    │   ├── شريط تقدم (progress 0-100%)
    │   └── Book.status = 'extracted'
    │
    ├── [تنظيم] → POST /api/books/[id]/process
    │   ├── Book.status = 'processing'
    │   ├── شريط تقدم (progress 0-100%)
    │   └── Book.status = 'completed'
    │
    └── عرض الحالة:
        ├── uploaded ✅ → extracting ⏳ → extracted ✅ → processing ⏳ → completed ✅
        └── error ❌ (مع رسالة الخطأ)
```

---

## 📄 تبويبة المحتوى — ContentTab

**الملف:** `src/components/factory/ContentTab.tsx`

### البنية

```
ContentTab
├── شريط جانبي (اليسار)
│   ├── قائمة الكتب (من النخور)
│   └── قائمة الوحدات (شجرة)
│       └── ExtractedUnit[]
│           └── ExtractedLesson[] (قائمة منسدلة)
│
└── منطقة المحرر (اليمين)
    ├── عنوان الدرس
    ├── tabs المحرر:
    │   ├── المحتوى (Textarea — content)
    │   ├── الملخص (Textarea — summary)
    │   └── النقاط الرئيسية (JSON editor — keyPoints)
    ├── زر حفظ → PUT /api/lessons/[id]
    └── حالة الدرس (draft/reviewed/approved)
```

### معالجة keyPoints

```typescript
// keyPoints يُخزّن كـ JSON string في قاعدة البيانات
// القراءة:
const points = JSON.parse(lesson.keyPoints) // string[]

// الكتابة:
await fetch(`/api/lessons/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ keyPoints: JSON.stringify(points) })
})
```

---

## 🎬 تبويبة الفيديو — VideoTab

**الملف:** `src/components/factory/VideoTab.tsx`
**الحجم:** ~667 سطر

### خط الإنتاج (5 مراحل)

```
┌──────────────────────────────────────────────────────┐
│  1            2              3             4     5  │
│ اختيار → توليد → توليد → تجميع → المعاينة        │
│ الدرس   السكربت  الصوت   الفيديو                     │
│  ✅      ⏳        ⏳       ⏳      ⏳                │
└──────────────────────────────────────────────────────┘
```

### بطاقات التكوين

#### 1. بطاقة السكربت
```
├── عنوان الدرس (read-only)
├── نمط السكربت:
│   ├── شرح تفصيلي (explanatory)
│   ├── سرد قصصي (storytelling)
│   └── مراجعة امتحان (exam_review)
├── طول السكربت:
│   ├── قصير (~300 كلمة)
│   ├── متوسط (~600 كلمة)
│   └── طويل (~1000 كلمة)
├── زر توليد → POST /api/generate/video-script
│   └── fallback: توليد محلي من lesson content/keyPoints
└── محرر النص (Textarea) + عداد الكلمات
```

#### 2. بطاقة الصوت
```
├── محرك TTS:
│   ├── Edge-TTS (Microsoft)
│   └── Qwen3-TTS (Pinokio)
├── الصوت:
│   ├── ar-EG-Hoda (مصرية)
│   ├── ar-SA-Najm (سعودية)
│   └── ar-AE-Fatima (إماراتية)
├── السرعة: Slider (0.5x — 2.0x)
└── زر توليد الصوت (placeholder)
```

#### 3. بطاقة الفيديو
```
├── الدقة:
│   ├── 720p
│   ├── 1080p
│   └── 4K
├── نمط الخلفية:
│   ├── بسيط
│   ├── تعليمي
│   └── متحرك
└── زر تجميع الفيديو (coming soon)
```

#### 4. الأدوات المتاحة (Sidebar)
```
├── Qwen3-TTS Milx (Pinokio) — توليد صوت
├── Foocus (Pinokio) — توليد صور
├── Wan2.1 (Pinokio) — توليد فيديو
└── Edge-TTS — صوت عربي مجاني
```

---

## 📝 تبويبة الملخصات — SummariesTab

**الملف:** `src/components/factory/SummariesTab.tsx`
**الحجم:** ~395 سطر

### أنواع الملخصات

| النوع | الأيقونة | الوصف |
|-------|---------|-------|
| ملخص مركز | 📄 | ملخص شامل للدرس |
| مذكرات دراسية | 📓 | مذكرات منظمة للطالب |
| مفاهيم رئيسية | 💡 | قائمة المفاهيم مع الشرح |
| دليل مراجعة | ✅ | قائمة تحقق + أسئلة مقترحة |

### توليد الدفعي
- توليد لدرس واحد أو لكل الدروس
- 4 أنواع × 3 أطوال × 2 جمهور = 24 تكوين ممكن
- توليد محلي من lesson data (لا يحتاج API)

### التصدير
- نسخ إلى الحافظة
- تصدير كملف Word (.doc) — HTML blob مع RTL styling
- حفظ في localStorage

---

## 📋 تبويبة الامتحانات — ExamsTab

**الملف:** `src/components/factory/ExamsTab.tsx`
**الحجم:** ~865 سطر

### أنواع الامتحانات

| النوع | الوصف |
|-------|-------|
| quiz | اختبار قصير (10 دقائق) |
| midterm | امتحان نصفي (45 دقيقة) |
| final | امتحان نهائي (90 دقيقة) |
| practice | تمرين تدريبي |

### مستويات الصعوبة

| المستوى | توزيع الأسئلة |
|---------|---------------|
| سهل | أسئلة تذكر وفهم |
| متوسط | أسئلة تطبيق |
| صعب | أسئلة تحليل وتركيب |
| مختلط | مزيج من كل المستويات |

### أنماط الأسئلة (4 أنواع)

| النمط | الوصف | التوليد |
|-------|-------|---------|
| MCQ | اختيار من متعدد | من keyPoints → خيارات |
| True/False | صح أو خطأ | من keyPoints → affirmations |
| Fill Blank | املأ الفراغ | من content → extract terms |
| Essay | مقال قصير | من summary → open questions |

### المميزات

- توليد محلي بالكامل (لا يحتاج API)
- عرض أسئلة مع Collapsible
- كشف/إخفاء الإجابات
- تعديل الأسئلة والخيارات
- إضافة/حذف أسئلة يدوياً
- تصدير كـ JSON أو ملف نصي
- حفظ كمسودة (localStorage)
- تبويبات متعددة للامتحانات

---

## 🧠 تبويبة المواد المساعدة — MaterialsTab

**الملف:** `src/components/factory/MaterialsTab.tsx`
**الحجم:** ~795 سطر

### أنواع المواد (5 أنواع)

#### 1. 🗺️ خريطة ذهنية (Mind Map)
```
MindMapView
├── عقدة مركزية (عنوان الدرس)
├── فروع ملونة من keyPoints
├── فروع فرعية (sub-points)
├── تصدير JSON
└── تصدير صورة (placeholder)
```

#### 2. 📊 إنفوجرافيك (Infographic)
```
InfographicView
├── تدرج رأسي ملون (header)
├── بطاقات إحصائيات
├── نقاط رئيسية مع أيقونات
├── نظام ألوان (5 مخططات)
└── تصدير (placeholder)
```

#### 3. 📝 بطاقات تعليمية (Flashcards)
```
FlashcardsView
├── بطاقة أمامية (السؤال / المصطلح)
├── بطاقة خلفية (الإجابة / التعريف)
├── flip animation (framer-motion rotateY)
├── تنقل: السابق / التالي
├── خلط عشوائي (Shuffle)
├── شريط تقدم
└── نسخ / تصدير PDF (placeholder)
```

#### 4. 📐 ورقة معادلات (Formula Sheet)
```
FormulaSheetView
├── جدول منظم
├── استخراج المعادلات من content
│   (بحث عن: معادلة، قانون، صيغة، = ، F=...)
├── نسخ فردية لكل معادلة
└── تصدير الكل كنص
```

#### 5. 🗺️ خريطة مفاهيم (Concept Map)
```
ConceptMapView
├── عقدة مركزية
├── عقد فرعية (keyPoints)
├── روابط اتجاهية مع تسميات
│   ("يشمل"، "يرتبط بـ"، "ينتج عنه")
├── تخطيط تلقائي
└── تصدير JSON
```

---

## 🤖 تبويبة النماذج — ModelsTab

**الملف:** `src/components/factory/ModelsTab.tsx`

### الوظائف

| الوظيفة | الوصف |
|---------|-------|
| حالة الخدمات | مؤشرات اتصال (LM Studio, Ollama) |
| قائمة النماذج | جدول النماذج المتاحة مع الحجم |
| تحميل نماذج | زر تحميل عبر Ollama |
| النماذج المطلوبة | قائمة النماذج الموصى بها |

---

## ⚙️ تبويبة الإعدادات — SettingsTab

**الملف:** `src/components/factory/SettingsTab.tsx`

### أقسام الإعدادات

#### 1. إعدادات OCR
```
├── اللغة: العربية / الإنجليزية / كلاهما
└── الجودة: منخفضة / متوسطة / عالية
```

#### 2. إعدادات الذكاء الاصطناعي
```
├── الخدمة الافتراضية: LM Studio / Ollama
├── النموذج الافتراضي: (input field)
├── منفذ LM Studio: 1234
├── منفذ Ollama: 11434
└── اختبار الاتصال (buttons → GET /api/services/status)
```

#### 3. إعدادات عامة
```
├── الحفظ التلقائي: Switch
└── السمة: داكنة / فاتحة / تلقائي
```

#### 4. إدارة البيانات
```
├── مسح كل الكتب (DESTRUCTIVE — مع تأكيد)
├── مسح السجلات
├── تصدير الإعدادات كـ JSON
└── استيراد الإعدادات من JSON
```

---

## 📜 تبويبة السجلات — LogsTab

**الملف:** `src/components/factory/LogsTab.tsx`

### أنواع السجلات

| النوع | اللون | الأيقونة |
|-------|-------|---------|
| info | أزرق | Info |
| success | أخضر | CheckCircle |
| warning | أصفر | AlertTriangle |
| error | أحمر | XCircle |

### المميزات

- فلترة حسب النوع مع عداد
- بحث نصي في السجلات
- طابع زمني نسبي ("منذ 5 دقائق")
- حدود: 200 سجل (أقدم يتم حذفه)
- تصدير JSON
- حذف جميع السجلات (مع تأكيد)
- AnimatePresence للحركات

---

## 🏠 تبويبة الرئيسية — HomeTab

**الملف:** `src/components/factory/HomeTab.tsx`

### المحتوى

```
HomeTab
├── 4 بطاقات إحصائية:
│   ├── 📚 الكتب (totalBooks)
│   ├── 📄 الصفحات (totalPagesExtracted)
│   ├── 📦 الوحدات (totalUnits)
│   └── 📋 الدروس (totalLessons)
│
├── 4 بطاقات إجراءات سريعة:
│   ├── رفع كتاب جديد
│   ├── عرض المحتوى
│   ├── توليد ملخصات
│   └── إدارة النماذج
│
├── النشاط الأخير (آخر 5 سجلات)
│
└── حالة النظام:
    ├── LM Studio (connected/disconnected)
    ├── Ollama (connected/disconnected)
    ├── Tesseract (ready)
    └── عدد النماذج المتاحة
```

---

## 👁️ تبويبة المعاينة — PreviewTab

**الملف:** `src/components/factory/PreviewTab.tsx`

### أوضاع المعاينة

| الوضع | الوصف |
|-------|-------|
| منسّق | عرض الوحدات → الدروس مع المحتوى والنقاط |
| JSON | عرض البيانات الخام مع نسخ |
| دروس | عرض كل درس مع ملخص ونقاط رئيسية |

### التصدير
- نسخ JSON
- تصدير Markdown
- نسخ إلى الحافظة

---

## 🧠 Zustand Store — العصب العصبي للمصنع

**الملف:** `src/lib/factory-store.ts`

### البنية

```typescript
interface FactoryState {
  // التنقل
  activeTab: TabType          // التبويبة الحالية
  sidebarCollapsed: boolean   // حالة الشريط الجانبي

  // الكتب
  books: Book[]               // قائمة الكتب
  selectedBookId: string | null

  // الاستخراج
  isExtracting: boolean       // هل جاري الاستخراج
  isProcessing: boolean       // هل جاري المعالجة
  extractionProgress: number  // نسبة التقدم

  // المحتوى
  units: ExtractedUnit[]      // الوحدات المستخرجة
  selectedLessonId: string | null

  // الخدمات
  services: ServiceInfo[]     // حالة AI services

  // السجلات
  logs: LogEntry[]            // سجل الأنشطة (max 200)

  // الإعدادات
  settings: AppSettings       // إعدادات النظام

  // الإحصائيات
  stats: {                    // إحصائيات عامة
    totalBooks: number
    totalPagesExtracted: number
    totalUnits: number
    totalLessons: number
  }
}
```

### الإعدادات الافتراضية

```typescript
{
  ocrLanguage: 'ara',
  ocrQuality: 'high',
  lmStudioPort: 1234,
  ollamaPort: 11434,
  defaultLLMService: 'lmstudio',
  defaultLLMModel: 'qwen2.5-7b',
  autoSave: true,
  theme: 'dark'
}
```

---

## 🔧 المحركات الخلفية — Lib Files

### `src/lib/ocr.ts` — محرك OCR

| الدالة | الوظيفة |
|--------|---------|
| `extractTextFromPage(pageData, language)` | تعرف على نص من صورة واحدة |
| `extractTextFromPDF(filePath, language)` | استخراج كل صفحات PDF |
| `renderPageToBuffer(page, scale)` | تحويل صفحة PDF إلى PNG Buffer |
| `getSupportedLanguages()` | قائمة اللغات المدعومة |

### `src/lib/llm-client.ts` — عميل LLM

| الدالة | الوظيفة |
|--------|---------|
| `chatWithLM(message, systemPrompt, options)` | إرسال رسالة للنموذج |
| `checkServiceHealth(service)` | فحص حالة الخدمة |
| `listOllamaModels()` | قائمة نماذج Ollama |
| `listLMStudioModels()` | قائمة نماذج LM Studio |
| `pullOllamaModel(name)` | تحميل نموذج جديد |

### `src/lib/extraction-pipeline.ts` — خط الأنابيب

| الدالة | الوظيفة |
|--------|---------|
| `processBookOCR(bookId, db)` | استخراج OCR كامل |
| `processBookWithLLM(bookId, db)` | تنظيم LLM كامل |
| `generateStructurePrompt(rawText, title)` | بناء prompt عربي |
| `parseLLMResponse(response)` | استخراج JSON من رد LLM |

---

*آخر تحديث: يونيو 2025*
