# 🌐 توثيق واجهات API — SmartEdu v2.0

> **المستند:** مرجع كامل لجميع نقاط النهاية (39 route)
> **الإصدار:** 2.0.0

---

## 📋 دليل الاستخدام

| الرمز | المعنى |
|------|--------|
| `GET` | قراءة بيانات |
| `POST` | إنشاء / معالجة |
| `PUT` | تحديث |
| `DELETE` | حذف |
| 🔒 | يتطلب معرّف كتاب في المسار |
| 🤖 | يتطلب خدمة LLM عاملة |

---

## 📚 مجموعة إدارة الكتب — Books API

### `GET /api/books`

**الوظيفة:** جلب قائمة جميع الكتب المرفوعة

**الاستجابة:**
```json
{
  "books": [
    {
      "id": "uuid",
      "title": "كتاب الفيزياء للصف الثالث",
      "fileName": "physics-grade3.pdf",
      "fileSize": 15728640,
      "totalPages": 250,
      "language": "ar",
      "status": "completed",
      "progress": 100,
      "error": null,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "pageCount": 250,
      "unitCount": 12
    }
  ]
}
```

### `POST /api/books`

**الوظيفة:** رفع كتاب PDF جديد (multipart/form-data)

**البيانات:**
| الحقل | النوع | مطلوب | الوصف |
|-------|-------|-------|-------|
| `file` | File | ✅ | ملف PDF |
| `title` | string | ❌ | عنوان الكتاب (يُستخرج من اسم الملف) |
| `language` | string | ❌ | لغة OCR (ara/eng) |

**الاستجابة:**
```json
{
  "book": {
    "id": "uuid",
    "title": "كتاب الفيزياء",
    "fileName": "physics.pdf",
    "status": "uploaded"
  }
}
```

### `GET /api/books/[id]`

**الوظيفة:** جلب تفاصيل كتاب محدد

**الاستجابة:**
```json
{
  "book": { ... }
}
```

### `DELETE /api/books/[id]`

**الوظيفة:** حذف كتاب وجميع بياناته المرتبطة (cascade)

---

### `POST /api/books/[id]/extract` 🤖

**الوظيفة:** تشغيل استخراج OCR على جميع صفحات الكتاب

**المحرك:** `extraction-pipeline.ts :: processBookOCR()`

**الآلية:**
1. التحقق من حالة الكتاب (`uploaded` فقط)
2. تحديث الحالة إلى `extracting`
3. لكل صفحة:
   - تحويل PDF → PNG Buffer (pdfjs-dist)
   - تعريف النص (Tesseract.js)
   - حفظ BookPage record
   - تحديث progress
4. تحديث الحالة إلى `extracted`

**الاستجابة:**
```json
{
  "success": true,
  "message": "OCR extraction started for book...",
  "totalPages": 250
}
```

---

### `POST /api/books/[id]/process` 🤖

**الوظيفة:** تنظيم النصوص المستخرجة باستخدام LLM

**المحرك:** `extraction-pipeline.ts :: processBookWithLLM()`

**الآلية:**
1. التحقق من حالة الكتاب (`extracted` فقط)
2. جمع نصوص جميع الصفحات
3. بناء prompt عربي منظم
4. إرسال إلى LLM (LM Studio / Ollama)
5. استخراج JSON من الرد
6. حفظ ExtractedUnit + ExtractedLesson records
7. تحديث الحالة إلى `completed`

**الاستجابة:**
```json
{
  "success": true,
  "message": "LLM processing started...",
  "units": 8,
  "lessons": 45
}
```

---

### `GET /api/books/[id]/pages`

**الوظيفة:** جلب صفحات كتاب مع حالة OCR

**الاستجابة:**
```json
{
  "pages": [
    {
      "id": "uuid",
      "pageNumber": 1,
      "ocrText": "النص المستخرج...",
      "status": "done"
    }
  ]
}
```

### `GET /api/books/[id]/units`

**الوظيفة:** جلب الوحدات والدروس المستخرجة (مع التداخل)

**الاستجابة:**
```json
{
  "units": [
    {
      "id": "uuid",
      "unitNumber": 1,
      "titleAr": "الوحدة الأولى: الحركة",
      "titleEn": "Unit 1: Motion",
      "description": "...",
      "ExtractedLesson": [
        {
          "id": "uuid",
          "lessonNumber": 1,
          "titleAr": "المسافة والزمن",
          "content": "...",
          "summary": "...",
          "keyPoints": "[\"نقطة 1\", \"نقطة 2\"]",
          "status": "draft"
        }
      ]
    }
  ]
}
```

---

## 🎬 مجموعة توليد المحتوى — Content Generation API

### `POST /api/generate/video-script` 🤖

**الوظيفة:** توليد سكربت فيديو تعليمي من درس

**البيانات:**
```json
{
  "lessonId": "uuid",
  "style": "explanatory",    // explanatory | storytelling | exam_review
  "duration": "medium",     // short | medium | long
  "customScript": "..."     // اختياري: سكربت مخصص
}
```

**الاستجابة:**
```json
{
  "script": "السكربت المُولّد بالكامل...",
  "style": "explanatory",
  "wordCount": 850
}
```

### `POST /api/generate/summary` 🤖

**الوظيفة:** توليد ملخص تعليمي

**البيانات:**
```json
{
  "lessonId": "uuid",
  "type": "summary",        // summary | notes | key_concepts | study_guide
  "length": "medium",       // short | medium | comprehensive
  "audience": "student"      // student | teacher
}
```

**الاستجابة:**
```json
{
  "summary": {
    "id": "uuid",
    "type": "summary",
    "title": "ملخص: القوانين الثلاثة لنيوتن",
    "content": "...",
    "wordCount": 450
  }
}
```

### `POST /api/generate/exam` 🤖

**الوظيفة:** توليد امتحان من درس

**البيانات:**
```json
{
  "lessonId": "uuid",
  "examType": "quiz",        // quiz | midterm | final | practice
  "difficulty": "medium",    // easy | medium | hard | mixed
  "duration": 30,
  "totalMarks": 20,
  "questionTypes": ["mcq", "true_false", "fill_blank", "essay"]
}
```

**الاستجابة:**
```json
{
  "exam": {
    "id": "uuid",
    "title": "اختبار: القوانين الثلاثة لنيوتن",
    "examType": "quiz",
    "difficulty": "medium",
    "questions": [
      {
        "id": 1,
        "type": "mcq",
        "question": "أي من التالي يمثل القانون الأول لنيوتن؟",
        "options": ["القوة = الكتلة × التسارع", "...", "...", "..."],
        "correctAnswer": 0,
        "points": 2
      }
    ],
    "answerKey": ["0", "true", "F=ma", "..."],
    "totalQuestions": 10
  }
}
```

### `POST /api/generate/material` 🤖

**الوظيفة:** توليد مادة تعليمية مساعدة

**البيانات:**
```json
{
  "lessonId": "uuid",
  "type": "mindmap"          // mindmap | infographic | diagram | flashcards | formula_sheet
}
```

**الاستجابة (mindmap/flashcards — programmatic):**
```json
{
  "material": {
    "id": "uuid",
    "type": "mindmap",
    "title": "خريطة ذهنية: القوانين الثلاثة",
    "data": "{\"nodes\": [...], \"edges\": [...]}"
  }
}
```

**الاستجابة (infographic/formula_sheet — LLM):**
```json
{
  "material": {
    "id": "uuid",
    "type": "infographic",
    "title": "إنفوجرافيك: نيوتن",
    "data": "{\"title\": ..., \"statistics\": [...], \"keyPoints\": [...]}"
  }
}
```

---

## 🤖 مجموعة إدارة النماذج — Models API

### `GET /api/models`

**الوظيفة:** جلب قائمة النماذج المتاحة من LM Studio و Ollama

**الاستجابة:**
```json
{
  "lmstudio": {
    "available": true,
    "models": [
      { "name": "qwen2.5-7b", "size": "4.5 GB", "type": "text-generation" }
    ]
  },
  "ollama": {
    "available": true,
    "models": [
      { "name": "deepseek-coder-v2:16b", "size": "9.2 GB", "type": "code" },
      { "name": "qwen2.5-coder:7b", "size": "4.4 GB", "type": "code" }
    ]
  }
}
```

### `GET /api/models/required`

**الوظيفة:** جلب قائمة النماذج المطلوبة والموصى بها

**الاستجابة:**
```json
{
  "required": [
    { "name": "qwen2.5-7b", "service": "lmstudio", "purpose": "تنظيم المحتوى التعليمي", "size": "4.5 GB" }
  ],
  "recommended": [
    { "name": "deepseek-coder-v2:16b", "service": "ollama", "purpose": "توليد الكود", "size": "9.2 GB" }
  ]
}
```

### `POST /api/models/[name]/download` 🤖

**الوظيفة:** تحميل نموذج جديد عبر Ollama

**الاستجابة:**
```json
{
  "success": true,
  "message": "Model 'phi3:mini' pulled successfully"
}
```

---

## 📊 مجموعة بيانات المنصة — Platform Data API

### `GET /api/structure`

**الوظيفة:** جلب هيكل المنهج الكامل (سنوات، تخصصات، مواد، فصول)

**الاستجابة:**
```json
{
  "academicYears": [...],
  "specializations": [...],
  "semesters": [...]
}
```

### `GET /api/subjects`

**الوظيفة:** جلب قائمة المواد

### `GET /api/lessons`

**الوظيفة:** جلب قائمة الدروس

### `GET /api/lessons/[id]`

**الوظيفة:** جلب تفاصيل درس كامل (مع كل العلاقات)

**الاستجابة:**
```json
{
  "lesson": {
    "id": "uuid",
    "titleAr": "...",
    "titleEn": "...",
    "introductionAr": "...",
    "summaryAr": "...",
    "objectives": [...],
    "concepts": [...],
    "formulas": [...],
    "examples": [...],
    "questions": [...],
    "simulators": [...]
  }
}
```

### `GET /api/units/[id]/lessons`

**الوظيفة:** جلب دروس وحدة محددة

### `GET /api/simulators`

**الوظيفة:** جلب قائمة المحاكيات التفاعلية

---

## 🛠️ مجموعة إدارة النظام — System Management API

### `GET /api/stats`

**الوظيفة:** جلب إحصائيات النظام الكاملة

**الاستجابة:**
```json
{
  "totalBooks": 5,
  "totalPagesExtracted": 1250,
  "totalUnits": 45,
  "totalLessons": 230,
  "booksByStatus": {
    "uploaded": 1,
    "extracting": 0,
    "extracted": 1,
    "processing": 0,
    "completed": 3,
    "error": 0
  }
}
```

### `GET /api/settings`

**الوظيفة:** جلب إعدادات النظام

**الاستجابة:**
```json
{
  "ocrLanguage": "ara",
  "ocrQuality": "high",
  "lmStudioPort": 1234,
  "ollamaPort": 11434,
  "defaultLLMService": "lmstudio",
  "defaultLLMModel": "qwen2.5-7b",
  "autoSave": true,
  "theme": "dark"
}
```

### `POST /api/settings`

**الوظيفة:** تحديث إعدادات النظام

**البيانات:** كائن JSON يحتوي على الحقول المراد تحديثها

### `GET /api/logs`

**الوظيفة:** جلب سجل الأنشطة

### `POST /api/logs`

**الوظيفة:** إضافة سجل نشاط جديد

### `DELETE /api/logs`

**الوظيفة:** مسح جميع السجلات

### `POST /api/cleanup`

**الوظيفة:** حذف جميع الكتب والبيانات المرتبطة (cascade)

### `GET /api/services/status`

**الوظيفة:** فحص حالة خدمات الذكاء الاصطناعي

**الاستجابة:**
```json
{
  "lmstudio": {
    "available": true,
    "message": "LM Studio is running and ready",
    "port": 1234
  },
  "ollama": {
    "available": false,
    "message": "Ollama unreachable: connect ECONNREFUSED",
    "port": 11434
  },
  "tesseract": {
    "available": true,
    "message": "Tesseract.js ready"
  }
}
```

---

## 📝 أكواد الحالات

### حالة الكتاب (Book Status)

| الحالة | الوصف |
|--------|-------|
| `uploaded` | تم الرفع، ينتظر الاستخراج |
| `extracting` | جاري استخراج النصوص (OCR) |
| `extracted` | اكتمل الاستخراج، ينتظر التنظيم |
| `processing` | جاري تنظيم المحتوى (LLM) |
| `completed` | اكتملت جميع المراحل |
| `error` | حدث خطأ (تفاصيل في حقل `error`) |

### حالة الصفحة (Page Status)

| الحالة | الوصف |
|--------|-------|
| `pending` | تنتظر المعالجة |
| `processing` | جاري التعرف (OCR) |
| `done` | اكتمل التعرف |
| `error` | فشل التعرف |

### حالة الدرس (Lesson Status)

| الحالة | الوصف |
|--------|-------|
| `draft` | مسودة (افتراضي) |
| `reviewed` | تمت المراجعة |
| `approved` | تمت الموافقة |

### حالة الفيديو (Video Status)

| الحالة | الوصف |
|--------|-------|
| `draft` | مسودة |
| `generating_script` | جاري توليد السكربت |
| `generating_audio` | جاري توليد الصوت |
| `assembling` | جاري تجميع الفيديو |
| `ready` | جاهز للمعاينة |
| `error` | حدث خطأ |

---

## ⚠️ معالجة الأخطاء

جميع نقاط النهاية تُرجع تنسيقاً موحداً عند حدوث خطأ:

```json
{
  "error": true,
  "message": "وصف الخطأ التفصيلي",
  "code": "ERROR_CODE"
}
```

**أكواد HTTP المستخدمة:**

| الكود | المعنى |
|-------|-------|
| `200` | نجاح |
| `201` | تم الإنشاء |
| `400` | بيانات غير صالحة |
| `404` | غير موجود |
| `500` | خطأ في الخادم |

---

## 🔧 أدوات التصحيح — Debug API

هذه النقاط مخصصة للتطوير فقط ولا تُستخدم في الإنتاج:

| النقطة | الوظيفة |
|--------|---------|
| `GET /api/debug-db` | فحص محتوى قاعدة البيانات |
| `GET /api/debug-subjects` | فحص المواد والتخصصات |
| `POST /api/check-specializations` | التحقق من التخصصات |
| `POST /api/fix-specializations` | إصلاح التخصصات المكررة |
| `POST /api/cleanup-duplicates` | حذف البيانات المكررة |

---

*آخر تحديث: يونيو 2025*
