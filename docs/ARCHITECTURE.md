# 🏗️ هندسة النظام — SmartEdu v2.0

> **المستند:** المخطط المعماري والتشريح الهندسي الكامل
> **الإصدار:** 2.0.0 | **الآخر تحديث:** يونيو 2025

---

## 📐 الفلسفة المعمارية

يعتمد المشروع على معمارية **Monorepo Dual-System** تجمع بين:
1. **منصة عرض تعليمية** — موجهة للطالب النهائي
2. **مصنع إنتاج محتوى** — موجه لمنشئ المحتوى (المعلم/المطور)

### المبادئ التصميمية

| المبدأ | التطبيق |
|--------|---------|
| **فصل المسؤوليات** | Factory (إنتاج) مقابل Platform (عرض) |
| **الملفاتية** | كل ملف له مسؤولية واحدة محددة |
| **التدرجية** | من البسيط (رفع PDF) إلى المعقد (توليد فيديو) |
| **الاستقلالية** | كل تبويبة تعمل بشكل مستقل مع تبعيات محددة |
| **الترقية** | أقل تبعيات ممكنة بين المكونات |

---

## 🧠 المخطط المعماري — الطبقات

```
┌─────────────────────────────────────────────────────────────────────┐
│                        طبقة العرض (Presentation)                    │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│  │   Factory Dashboard  │  │        Platform Pages                 │ │
│  │   (12 تبويبة)        │  │   (سنة → مادة → درس → اختبار)        │ │
│  │   shadcn/ui + RTL    │  │   shadcn/ui + RTL                     │ │
│  └──────────┬───────────┘  └────────────────┬─────────────────────┘ │
├─────────────┼──────────────────────────────┼────────────────────────┤
│             │     طبقة الحالة (State)       │                        │
│  ┌──────────▼───────────┐  ┌────────────────▼─────────────────────┐ │
│  │   Zustand Store      │  │   TanStack Query + Static Data       │ │
│  │   (factory-store.ts) │  │   (curriculum.json + API)            │ │
│  └──────────┬───────────┘  └────────────────┬─────────────────────┘ │
├─────────────┼──────────────────────────────┼────────────────────────┤
│             │    طبقة الاتصال (Transport)   │                        │
│  ┌──────────▼───────────┐  ┌────────────────▼─────────────────────┐ │
│  │   API Routes (39)    │  │   Static JSON + Prisma Queries       │ │
│  │   Next.js App Router │  │                                      │ │
│  └──────────┬───────────┘  └────────────────┬─────────────────────┘ │
├─────────────┼──────────────────────────────┼────────────────────────┤
│             │    طبقة الخدمات (Services)     │                        │
│  ┌──────────▼───────────┐  ┌────────────────▼─────────────────────┐ │
│  │   OCR Engine         │  │   LLM Client                         │ │
│  │   Tesseract.js       │  │   LM Studio (Port 1234)              │ │
│  │   pdfjs-dist         │  │   Ollama (Port 11434)                │ │
│  └──────────┬───────────┘  └────────────────┬─────────────────────┘ │
├─────────────┼──────────────────────────────┼────────────────────────┤
│             │    طبقة البيانات (Data)        │                        │
│  ┌──────────▼───────────────────────────────▼─────────────────────┐ │
│  │                    Prisma ORM + SQLite                          │ │
│  │                    (25 نموذج × 25 علاقة)                        │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 تدفق البيانات — خط الإنتاج الكامل

### مخطط تدفق مصنع الفيديو

```
                          ┌──────────────┐
                          │  1. رفع PDF   │
                          │  SourcesTab   │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │  2. استخراج   │   OCR Engine
                          │  نصوص OCR     │   Tesseract.js
                          │  ExtractionTab│   pdfjs-dist
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │  3. تنظيم    │   LLM Client
                          │  المحتوى      │   LM Studio
                          │  ContentTab   │   Qwen2.5-7b
                          └──────┬───────┘
                                 │
                    ┌────────────┼────────────┬────────────┐
                    │            │            │            │
             ┌──────▼─────┐ ┌──▼───┐ ┌─────▼───┐ ┌─────▼────┐
             │ 4a. سكربت  │ │ 4b.  │ │ 4c.     │ │ 4d.      │
             │ فيديو      │ │ملخصات│ │ امتحانات│ │ مواد     │
             │ VideoTab   │ │Summ. │ │ Exams   │ │ Materials│
             └──────┬─────┘ └──────┘ └─────────┘ └──────────┘
                    │
             ┌──────▼─────┐
             │ 5. تجميع   │   TTS + Video
             │ فيديو      │   FFmpeg
             │ PreviewTab  │
             └────────────┘
```

### تفصيل كل مرحلة

#### المرحلة 1: رفع المصدر (Source Ingestion)

```
المستخدم ←→ SourcesTab ←→ API: /api/books (POST)
                              │
                    ┌─────────┼─────────┐
                    │         │         │
              PDF File   صور متعددة   URL ويب
              (drag&drop) (multi-select) (placeholder)
                    │
                    ▼
              /uploads/ directory
              Book record (Prisma)
```

**المكون:** `SourcesTab.tsx` + `BookUploader.tsx`
**الـ API:** `POST /api/books`
**التخزين:** مجلد `uploads/` محلي + سجل `Book` في Prisma

#### المرحلة 2: استخراج النصوص (OCR Extraction)

```
API: /api/books/[id]/extract
         │
         ▼
extraction-pipeline.ts :: processBookOCR()
         │
    ┌────┴────┐
    │         │
pdfjs-dist  Tesseract.js
(render PDF  (recognize
 to images)  Arabic text)
    │         │
    └────┬────┘
         │
    BookPage records (واحد لكل صفحة)
         │
    Book.status = 'extracted'
```

**المحرك:** `src/lib/ocr.ts`
- `extractTextFromPDF()` — يقرأ PDF ويعالج كل صفحة
- `extractTextFromPage()` — يتعرف على النص العربي/الإنجليزي
- `renderPageToBuffer()` — يحول صفحة PDF إلى PNG Buffer

#### المرحلة 3: تنظيم المحتوى (LLM Structuring)

```
API: /api/books/[id]/process
         │
         ▼
extraction-pipeline.ts :: processBookWithLLM()
         │
    جمع نصوص الصفحات
         │
    توليد Prompt عربي منظم
         │
    ┌────┴────┐
    │         │
LM Studio  Ollama
(Qwen2.5) (Deepseek)
    │         │
    └────┬────┘
         │
    parseLLMResponse() — تنظيف JSON من markdown fences
         │
    ┌────┴────────────┐
    │                 │
ExtractedUnit[]   ExtractedLesson[]
(وحدات)           (دروس: content, summary, keyPoints)
```

**المحرك:** `src/lib/extraction-pipeline.ts`
- `generateStructurePrompt()` — بناء prompt عربي متخصص
- `parseLLMResponse()` — استخراج JSON من رد LLM

#### المرحلة 4: توليد المحتوى (Content Generation)

```
                    ExtractedLesson (محتوى منظم)
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼────┐         ┌─────▼─────┐        ┌──────▼──────┐
    │ سكربت   │         │ ملخصات     │        │ امتحانات    │
    │ فيديو   │         │            │        │             │
    └─────────┘         └───────────┘        └─────────────┘
    API: generate/      API: generate/      API: generate/
    video-script        summary              exam
    
         │                    │                    │
    ┌────▼────┐         ┌─────▼─────┐        ┌──────▼──────┐
    │Generated │         │ Generated │        │ ExamTemplate│
    │ Video    │         │ Summary   │        │             │
    └─────────┘         └───────────┘        └─────────────┘
                              │
                    ┌─────────▼──────────┐
                    │ LearningMaterial   │
                    │ (خريطة/بطاقات/    │
                    │  إنفوجرافيك/...)   │
                    └────────────────────┘
```

---

## 🔌 هندسة الاتصالات — API Routes

### التصنيف الوظيفي

```
API Routes (39 نقطة نهاية)
│
├── 📚 إدارة الكتب (6)
│   ├── GET    /api/books               قائمة الكتب
│   ├── POST   /api/books               رفع كتاب جديد
│   ├── GET    /api/books/[id]          تفاصيل الكتاب
│   ├── DELETE /api/books/[id]          حذف الكتاب
│   ├── POST   /api/books/[id]/extract  استخراج OCR
│   ├── POST   /api/books/[id]/process  تنظيم LLM
│   ├── GET    /api/books/[id]/pages    صفحات الكتاب
│   └── GET    /api/books/[id]/units    وحدات مستخرجة
│
├── 🎬 توليد المحتوى (4)
│   ├── POST   /api/generate/video-script  سكربت فيديو
│   ├── POST   /api/generate/summary       ملخص تعليمي
│   ├── POST   /api/generate/exam          امتحان
│   └── POST   /api/generate/material      مادة تعليمية
│
├── 🤖 إدارة النماذج (3)
│   ├── GET    /api/models               قائمة النماذج
│   ├── GET    /api/models/required      النماذج المطلوبة
│   └── POST   /api/models/[name]/download تحميل نموذج
│
├── 📊 بيانات المنصة (8)
│   ├── GET    /api/structure            هيكل المنهج
│   ├── GET    /api/subjects             المواد
│   ├── GET    /api/lessons              الدروس
│   ├── GET    /api/lessons/[id]         درس محدد
│   ├── GET    /api/units/[id]/lessons   دروس وحدة
│   └── GET    /api/simulators           المحاكيات
│
├── 🛠️ إدارة النظام (5)
│   ├── GET    /api/stats                إحصائيات
│   ├── GET/POST /api/settings           إعدادات
│   ├── GET/POST/DELETE /api/logs        سجلات
│   ├── POST   /api/cleanup              مسح بيانات
│   └── GET    /api/services/status      حالة الخدمات
│
├── 🌱 تهيئة البيانات (8)
│   └── POST   /api/seed-*, /api/content/seed  سكريبتات seed
│
└── 🔧 تصحيح (5)
    └── /api/debug-*, /api/fix-*, /api/check-*  أدوات تصحيح
```

---

## 🗄️ هندسة قاعدة البيانات — العلاقات

### المخطط العلائقي

```
المنصة التعليمية                  نظام المصنع
═══════════════                  ════════════

AcademicYear ──┐                Book ──────────────┐
               │                                     │
Specialization─┤                BookPage (OCR)       │
               │                                     │
Subject ───────┤                ExtractedUnit ───────┤
               │                  │                │
Unit ──────────┤                  │                │
               │            ExtractedLesson ────┐  │
Lesson ────────┘                  │              │  │
  │                                │              │  │
  ├── Concept                      ├── GeneratedVideo
  ├── Formula                      ├── GeneratedSummary
  ├── Example                      ├── ExamTemplate
  ├── Objective                    └── LearningMaterial
  ├── Question
  ├── LessonSimulator
  │     └── Simulator
  ├── Progress
  │     └── User
  └── QuizResult
        └── User

Badge ─── UserBadge ─── User
```

---

## 🎨 هندسة واجهة المستخدم

### نظام التصميم

```
Design System
├── Color Palette: Emerald/Green (primary) — لا أزرق/بنفسجي
├── Typography: RTL Arabic (Tajawal/Cairo)
├── Components: shadcn/ui New York style
├── Icons: Lucide React
├── Animations: Framer Motion (page transitions, hover effects)
├── Layout: Responsive (mobile-first)
│   ├── Mobile: Sheet drawer (hamburger menu)
│   ├── Tablet: Collapsible sidebar
│   └── Desktop: Fixed sidebar + content area
└── Theme: Dark/Light/System (next-themes)
```

### تخطيط المصنع

```
┌─────────────────────────────────────────────────────────┐
│ Desktop Layout                                           │
│ ┌──────────┬──────────────────────────────────────────┐ │
│ │ Sidebar  │  Top Bar (current tab name + theme)     │ │
│ │ (280px)  ├──────────────────────────────────────────┤ │
│ │          │                                          │ │
│ │  🏠 Home │  Content Area                           │ │
│ │  📦 Src  │  (renderTab() switches)                  │ │
│ │  ⚡ Ext  │                                          │ │
│ │  📄 Cnt  │                                          │ │
│ │  👁️ Prev │                                          │ │
│ │  🎬 Vid  │                                          │ │
│ │  📝 Sum  │                                          │ │
│ │  📋 Exam │                                          │ │
│ │  🧠 Mat  │                                          │ │
│ │  🤖 Mod  │                                          │ │
│ │  ⚙️ Set  │                                          │ │
│ │  📜 Log  │                                          │ │
│ └──────────┴──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Mobile Layout:
┌──────────────────┐
│ ☰ Tab Name    🌙 │  ← Top bar with Sheet trigger
├──────────────────┤
│                  │
│  Content Area    │
│  (full width)    │
│                  │
│                  │
└──────────────────┘
[Sheet drawer slides from right]
```

---

## ⚡ هندسة الأداء

### تحسينات مُطبقة

| التقنية | التفصيل |
|---------|---------|
| **Dynamic Imports** | pdfjs-dist و @napi-rs/canvas يُحمّلان فقط عند الحاجة |
| **Worker Reuse** | Tesseract worker واحد يُعاد استخدامه لكل صفحات PDF |
| **Buffer Pool** | تحويل صفحات PDF إلى PNG Buffers في الذاكرة |
| **Lazy Rendering** | Skeleton loaders أثناء تحميل البيانات |
| **Batch Updates** | تحديثات Progress مجمّعة في خط الأنابيب |
| **Connection Pool** | Prisma connectionLimit = 1 (بيئة محلية) |

### نقاط الاختناق المتوقعة

| العمليّة | السبب | الحل المقترح |
|---------|-------|-------------|
| OCR على PDF كبير | كل صفحة تُعرض ثم تُعرّف | Parallel processing (مستقبلاً) |
| LLM structuring | النموذج المحلي بطيء | Streaming response + progress |
| توليد الامتحانات دفعي | N API calls متتالية | Batch queue + background job |

---

## 🔒 اعتبارات الأمان

| النقطة | التطبيق |
|--------|---------|
| **File Upload** | التحقق من نوع الملف (PDF فقط) + حجم أقصى |
| **SQL Injection** | Prisma ORM يمنع SQL injection تلقائياً |
| **XSS** | React يهرب HTML تلقائياً |
| **API Abuse** | Timeout على كل request (120s) |
| **Local Services** | LM Studio/Ollama على localhost فقط |

---

## 📏 معايير الكود

### قواعد TypeScript

- **Strict Mode** مُفعّل
- جميع الملفات نوعية بالكامل (no `any`)
- واجهات TypeScript لكل البيانات المُمرّرة

### قواعد المكونات

- `'use client'` على كل مكون تفاعلي
- `'use server'` على كل API route
- أسماء الملفات: PascalCase للمكونات، kebab-case للـ API
- لا `console.log` في الإنتاج (يُستبدل بـ error logging)

### قواعد الأسلوب

- لا ألوان أزرق/بنفسجي (Emerald/Green فقط)
- دعم RTL كامل
- نص عربي لكل عنصر واجهة
- `min-h-screen flex flex-col` للتخطيط الجذري
- Footer ثابت مع `mt-auto`

---

*آخر تحديث: يونيو 2025*
