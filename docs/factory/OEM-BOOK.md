# كتيّب التشغيل والصيانة — SmartEdu Data Factory

## OEM Book — Operation & Maintenance Manual

> **الإصدار**: 1.0  
> **التاريخ**: يوليو 2025  
> **المشروع**: SmartEdu Data Factory — مصنع المحتوى التعليمي  
> **النطاق**: منصة تعليمية للمرحلة الثانوية المصرية  
> **التصنيف**: وثيقة داخلية — لفريق التشغيل فقط

---

## فهرس المحتويات

- [الجزء الأول: التشغيل](#الجزء-الأول-التشغيل)
  - [1. التركيب والتهيئة](#1-التركيب-والتهيئة)
  - [2. التشغيل اليومي](#2-التشغيل-اليومي)
  - [3. إدارة المحتوى](#3-إدارة-المحتوى)
  - [4. إدارة الـ AI Models](#4-إدارة-الـ-ai-models)
  - [5. المزامنة](#5-المزامنة)
- [الجزء الثاني: الصيانة](#الجزء-الثاني-الصيانة)
  - [6. النسخ الاحتياطي](#6-النسخ-الاحتياطي)
  - [7. التحديثات](#7-التحديثات)
  - [8. استكشاف الأخطاء](#8-استكشاف-الأخطاء)
  - [9. الأداء والتحسين](#9-الأداء-والتحسين)
- [الجزء الثالث: المراجع](#الجزء-الثالث-المراجع)
  - [10. قائمة المنافذ](#10-قائمة-المنافذ)
  - [11. قائمة API Endpoints](#11-قائمة-api-endpoints)
  - [12. هيكل الملفات](#12-هيكل-الملفات)
  - [13. متغيرات البيئة](#13-متغيرات-البيئة)
  - [14. سجل التغييرات](#14-سجل-التغييرات)

---

# الجزء الأول: التشغيل

---

## 1. التركيب والتهيئة

### 1.1 نظرة عامة على النظام

نظام SmartEdu Data Factory يتكون من عدة مكونات تعمل معًا لإنشاء محتوى تعليمي من الكتب المدرسية الممسوحة ضوئيًا:

```
┌──────────────────────────────────────────────────────────────────┐
│                    SmartEdu Data Factory                         │
│                                                                  │
│  ┌─────────────┐   ┌──────────────────┐   ┌──────────────────┐  │
│  │ Factory      │   │ Factory          │   │ Student          │  │
│  │ Dashboard    │   │ Backend          │   │ Platform         │  │
│  │ (Next.js)    │◄──│ (Express +       │   │ (Next.js)        │  │
│  │ Port 3002    │   │  Socket.io)      │   │ Port 4000        │  │
│  └─────────────┘   │ Port 3001        │   └────────┬─────────┘  │
│                     └────────┬─────────┘            │            │
│                              │                      │            │
│  ┌──────────┐  ┌────────────┼────────────┐  ┌──────┴───────┐   │
│  │ LM Studio│  │ Ollama     │ Pinokio/   │  │ SQLite DB    │   │
│  │ :1234    │  │ :11434     │ Foocus     │  │ db/custom.db │   │
│  └──────────┘  └────────────┘ :7860       │  │              │   │
│                                     └──────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 المتطلبات الأساسية (Prerequisites)

#### 1.2.1 البرمجيات المطلوبة

| البرنامج | الإصدار المطلوب | الغرض | طريقة التحقق |
|-----------|----------------|-------|-------------|
| Node.js | ≥ 22.x | تشغيل Backend + Dashboard + Platform | `node --version` |
| npm | ≥ 10.x | إدارة الحزم | `npm --version` |
| Python | ≥ 3.10 | Content Extractor + TTS + Scripts | `python --version` |
| pip | أحدث إصدار | إدارة حزم Python | `pip --version` |
| Git | أحدث إصدار | التحكم بالإصدارات | `git --version` |
| FFmpeg | ≥ 6.0 | ضغط الفيديو | `ffmpeg -version` |

#### 1.2.2 البرمجيات الخارجية الاختيارية

| البرنامج | المنفذ | الغرض | ملاحظة |
|-----------|-------|-------|--------|
| LM Studio | 1234 | تشغيل نماذج LLM محلية | مستخدم مثبّت |
| Ollama | 11434 | تشغيل نماذج VLM + LLM | مستخدم مثبّت |
| Pinokio / Foocus | 7860 | توليد الصور بالذكاء الاصطناعي | مستخدم مثبّت |

#### 1.2.3 متطلبات الأجهزة (Hardware Requirements)

| المكون | الحد الأدنى | الموصى به | ملاحظات |
|--------|------------|----------|---------|
| المعالج (CPU) | Intel i5 | Intel i7-10750H أو أحدث | يُستخدم في معالجة PDF والـ Pipeline |
| الذاكرة (RAM) | 16 GB | 32 GB | النماذج الكبيرة تحتاج ≥16 GB |
| كرت الشاشة (GPU) | أي GPU | NVIDIA RTX 4000 (8 GB VRAM) | لاستخراج المحتوى بالـ VLM |
| التخزين | 100 GB مساحة حرة | 256 GB SSD | للنماذج + بيانات الكتب + الفيديو |
| نظام التشغيل | Windows 10/11 64-bit | Windows 11 | النظام مصمم أساسًا لـ Windows |

### 1.3 خطوات التركيب على Windows

#### 1.3.1 تثبيت Node.js و npm

1. افتح المتصفح واذهب إلى: https://nodejs.org
2. حمّل نسخة **LTS** (Long Term Support) — إصدار 22 أو أحدث
3. شغّل ملف التثبيت واتبع الخطوات (اترك الإعدادات الافتراضية)
4. تحقق من التثبيت:

```bash
node --version    # يجب أن يُظهر v22.x.x أو أحدث
npm --version     # يجب أن يُظهر 10.x.x أو أحدث
```

#### 1.3.2 تثبيت Python

1. افتح: https://www.python.org/downloads/
2. حمّل Python 3.10 أو أحدث
3. **مهم جدًا**: فعّل خيار **"Add Python to PATH"** أثناء التثبيت
4. تحقق:

```bash
python --version   # يجب أن يُظهر 3.10.x أو أحدث
pip --version
```

#### 1.3.3 تثبيت FFmpeg

1. افتح: https://www.gyan.dev/ffmpeg/builds/
2. حمّل نسخة **release full**
3. استخرج الملفات إلى `C:\ffmpeg\`
4. أضف `C:\ffmpeg\bin` إلى متغيرات النظام **PATH**
5. أعد تشغيل Terminal وتحقق:

```bash
ffmpeg -version
```

#### 1.3.4 تثبيت LM Studio

1. افتح: https://lmstudio.ai/
2. حمّل وثبّت LM Studio
3. بعد التثبيت، شغّله وحمّل النماذج المطلوبة (انظر القسم 4)

#### 1.3.5 تثبيت Ollama

1. افتح: https://ollama.ai
2. حمّل نسخة Windows وثبّتها
3. Ollama يبدأ تلقائيًا كخدمة خلفية على المنفذ 11434
4. تحقق:

```bash
ollama list
```

#### 1.3.6 استنساخ المشروع وتثبيت الحزم

```bash
# استنساخ المشروع (إذا لم يكن موجودًا)
git clone <repo-url> my-project
cd my-project

# تثبيت حزم المشروع الرئيسي (Student Platform)
npm install

# تثبيت حزم Factory Backend + Dashboard
cd mini-services/control-center
npm install

# تثبيت حزم Factory Dashboard App
cd dashboard-app
npm install

# العودة إلى مجلد Factory
cd ..

# تثبيت حزم Python لـ Content Extractor
cd content-extractor
pip install -r requirements.txt
```

> **ملاحظة**: حزم Python المطلوبة هي:
> - `PyMuPDF>=1.23.0` — لتحويل PDF إلى صور
> - `Pillow>=10.0.0` — لمعالجة الصور
> - `psutil>=5.9.0` — لمراقبة GPU/RAM
> - `ollama>=0.4.0` — للاتصال بـ Ollama API
> - `edge-tts` — لتوليد الصوت بالعربية (يُثبّت تلقائيًا مع generate_tts.py)

### 1.4 متغيرات البيئة (Environment Variables)

#### 1.4.1 متغيرات المشروع الرئيسي (Student Platform)

أنشئ ملف `.env` في الجذر الرئيسي للمشروع:

```env
# قاعدة البيانات (SQLite)
DATABASE_URL="file:./db/custom.db"

# منفذ Student Platform
PORT=4000
```

#### 1.4.2 متغيرات Factory Backend

أنشئ ملف `.env` في `mini-services/control-center/`:

```env
# منفذ Factory Backend
PORT=3001

# إعدادات Queue Worker
QUEUE_POLL_INTERVAL_MS=5000
DASHBOARD_SOCKET_IO_PORT=3001
EXIT_WHEN_EMPTY=false
```

#### 1.4.3 متغيرات Factory Dashboard

أنشئ ملف `.env` في `mini-services/control-center/dashboard-app/`:

```env
# منفذ Dashboard
PORT=3002

# عنوان Factory Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 1.5 تهيئة قاعدة البيانات

قاعدة البيانات المستخدمة هي **SQLite** عبر **Prisma ORM**. ملف البيانات موجود في `db/custom.db`.

#### 1.5.1 إنشاء/تحديث هيكل الجداول

```bash
# من جذر المشروع
npx prisma db push
```

#### 1.5.2 توليد Prisma Client

```bash
npx prisma generate
```

#### 1.5.3 ملء البيانات الأولية (Seeding)

```bash
npx tsx prisma/seed.ts
```

#### 1.5.4 إعادة تعيين قاعدة البيانات بالكامل

> **تحذير**: هذا يحذف جميع البيانات الموجودة!

```bash
npm run db:reset
# أو يدويًا:
npx prisma db push --force-reset && npx tsx prisma/seed.ts
```

### 1.6 تهيئة إعدادات Pipeline

ملف الإعدادات المركزي موجود في `data/config/pipeline-config.json`. يحتوي على إعدادات كل مراحل الـ Pipeline:

```json
{
  "global": {
    "project_name": "Smart Education Factory",
    "language": "ar-EG",
    "debug_mode": false
  },
  "stage_1_pdf_to_image": {
    "dpi": 150,
    "max_size": 512,
    "image_format": "PNG"
  },
  "stage_2_vlm_extraction": {
    "preferred_model": "qwen2.5vl:7b",
    "cooldown_seconds": 10,
    "vram_limit_mb": 7168
  },
  "stage_5_video_factory": {
    "tts": {
      "voice": "ar-EG-SalmaNeural",
      "rate": "+5%"
    },
    "remotion": {
      "concurrency": 4,
      "fps": 30,
      "resolution_width": 1920,
      "resolution_height": 1080
    },
    "ffmpeg": {
      "crf": 22,
      "preset": "fast"
    }
  }
}
```

يمكن تعديل هذه الإعدادات عبر الـ Dashboard أو مباشرة عبر API:

```bash
# قراءة الإعدادات الحالية
curl http://localhost:3001/api/config

# تحديث إعدادات معينة
curl -X POST http://localhost:3001/api/config \
  -H "Content-Type: application/json" \
  -d '{"stage_5_video_factory": {"tts": {"voice": "ar-EG-HodaNeural"}}}'
```

---

## 2. التشغيل اليومي

### 2.1 ترتيب تشغيل الخدمات

**ترتيب التشغيل مهم جدًا!** اتبع هذا الترتيب بالضبط:

```
الخطوة 1 → تشغيل AI Models (LM Studio / Ollama)
الخطوة 2 → تشغيل Factory Backend (Port 3001)
الخطوة 3 → تشغيل Factory Dashboard (Port 3002)
الخطوة 4 → تشغيل Student Platform (Port 4000) [اختياري]
الخطوة 5 → تشغيل Queue Worker [عند الحاجة لعرض الفيديو]
```

#### 2.1.1 الخطوة 1: تشغيل نماذج الذكاء الاصطناعي

**LM Studio:**
1. افتح تطبيق LM Studio
2. اختر النموذج المطلوب من القائمة الجانبية
3. اضغط **"Load"**
4. تأكد من ظهور المنفذ 1234 في شريط الحالة

**Ollama:**
1. Ollama يعمل تلقائيًا كخدمة خلفية بعد التثبيت
2. تحقق من التشغيل:
```bash
ollama list
```
3. إذا لم يكن يعمل:
```bash
ollama serve
```

#### 2.1.2 الخطوة 2: تشغيل Factory Backend

```bash
cd mini-services/control-center
npm run dashboard:dev
```

أو بدون auto-reload:
```bash
node dashboard-server.js
```

**علامات النجاح:**
```
[2025-07-01T10:00:00.000Z] Server listening on port 3001
```

#### 2.1.3 الخطوة 3: تشغيل Factory Dashboard

افتح **Terminal جديد**:
```bash
cd mini-services/control-center/dashboard-app
npm run dev
```

**علامات النجاح:**
```
  ▲ Next.js 15.1.0
  - Local:    http://localhost:3002
```

#### 2.1.4 الخطوة 4: تشغيل Student Platform (اختياري)

افتح **Terminal جديد** من جذر المشروع:
```bash
npm run dev
```

**علامات النجاح:**
```
  ▲ Next.js 15.1.7
  - Local:    http://localhost:4000
```

#### 2.1.5 الخطوة 5: تشغيل Queue Worker (لإنتاج الفيديو)

افتح **Terminal جديد**:
```bash
cd mini-services/control-center
node scripts/queue-worker.js
```

**علامات النجاح:**
```
[2025-07-01T10:00:00.000Z] [queue-worker] [INFO] Queue worker starting (poll interval = 5000ms)
```

### 2.2 إيقاف الخدمات

اتبع **الترتيب العكسي**:

```
الخطوة 1 → إيقاف Queue Worker (Ctrl+C في الـ Terminal)
الخطوة 2 → إيقاف Student Platform (Ctrl+C)
الخطوة 3 → إيقاف Factory Dashboard (Ctrl+C)
الخطوة 4 → إيقاف Factory Backend (Ctrl+C)
الخطوة 5 → إيقاف AI Models (إغلاق LM Studio / ollama stop)
```

> **ملاحظة**: الـ Queue Worker يتمتع بـ graceful shutdown. عند الضغط على `Ctrl+C` يُنهي العملية الحالية ثم يخرج بأمان.

### 2.3 إجراءات الفحص الصحي (Health Check)

#### 2.3.1 فحص سريع لكل الخدمات

```bash
# فحص Factory Backend
curl -s http://localhost:3001/api/system/status | python -m json.tool

# فحص Factory Dashboard
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002
# المطلوب: 200

# فحص Student Platform
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000
# المطلوب: 200

# فحص LM Studio
curl -s http://localhost:1234/v1/models | python -m json.tool

# فحص Ollama
ollama list
```

#### 2.3.2 فحص حالة النظام الشاملة

```bash
curl http://localhost:3001/api/system/status
```

**الاستجابة المتوقعة:**
```json
{
  "cpu_percent": 45.2,
  "memory": {
    "total": 16384,
    "used": 8192,
    "free": 8192,
    "percent": 50
  },
  "disk": {
    "total": 512000,
    "used": 256000,
    "free": 256000,
    "percent": 50
  },
  "gpu": {
    "name": "NVIDIA RTX 4000",
    "vram_total": 8192,
    "vram_used": 4096,
    "vram_free": 4096,
    "utilization": 75
  },
  "uptime_sec": 3600
}
```

#### 2.3.3 قائمة فحص يومية (Daily Checklist)

- [ ] Factory Backend يعمل على المنفذ 3001
- [ ] Factory Dashboard يعمل على المنفذ 3002
- [ ] Student Platform يعمل على المنفذ 4000 (إذا مطلوب)
- [ ] LM Studio أو Ollama يحتوي على نموذج محمّل
- [ ] مساحة القرص الحرة > 20 GB
- [ ] الذاكرة RAM المستخدمة < 80%
- [ ] لا توجد تعارضات في المنافذ

### 2.4 مراقبة الـ Dashboard

افتح المتصفح على العنوان: **http://localhost:3002**

يتضمن الـ Dashboard الأقسام التالية:

| القسم | الوصف |
|-------|-------|
| **الرئيسية** | ملخص إحصائي: عدد الكتب، الدروس، الفيديوهات، حالة الـ Queue |
| **الكتب** | قائمة جميع الكتب المحملة وحالة الاستخراج |
| **الفيديو** | Studio لإنتاج الفيديو، حالة الـ Queue، الفيديوهات المُنتجة |
| **الإعدادات** | تعديل إعدادات Pipeline، متغيرات النظام |

---

## 3. إدارة المحتوى

### 3.1 نظرة عامة على Pipeline المحتوى

الـ Pipeline يمر بـ 6 مراحل رئيسية:

```
┌─────────────┐    ┌──────────────┐    ┌───────────┐    ┌────────────┐
│  Stage 1    │───▶│  Stage 2     │───▶│  Stage 3  │───▶│  Stage 4   │
│  PDF→Image  │    │  VLM Extract │    │  Merge    │    │  Generate  │
│  (PyMuPDF)  │    │  (Ollama)    │    │  Pages    │    │  Master    │
└─────────────┘    └──────────────┘    └───────────┘    └─────┬──────┘
                                                                │
┌─────────────┐    ┌──────────────┐                            │
│  Stage 6    │◀───│  Stage 5     │◀───────────────────────────┘
│  Distribute │    │  Video       │
│  (Export)   │    │  Factory     │
└─────────────┘    └──────────────┘
```

### 3.2 رفع كتب PDF (Uploading PDF Books)

#### 3.2.1 عبر الـ Dashboard (الطريقة الموصى بها)

1. افتح http://localhost:3002
2. اذهب إلى صفحة **"الكتب"**
3. اضغط **"رفع كتاب جديد"**
4. املأ البيانات:
   - **ملف PDF**: اختر ملف الكتاب (الحد الأقصى 500 MB)
   - **العنوان**: مثلاً "الفيزياء للصف الثالث الثانوي - المعاصر"
   - **المادة**: `physics` / `chemistry` / `math` / `biology` / ...
   - **الصف**: `3rd-secondary` / `2nd-secondary` / `1st-secondary`
   - **الناشر** (اختياري): `المعاصر` / `الامتحان` / `التفوق`
5. اضغط **"رفع"**

#### 3.2.2 عبر API

```bash
curl -X POST http://localhost:3001/api/books/upload \
  -F "pdf=@/path/to/book.pdf" \
  -F "title=الفيزياء للصف الثالث الثانوي" \
  -F "subject=physics" \
  -F "grade=3rd-secondary" \
  -F "publisher=المعاصر"
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "book": {
      "id": "physics-3rd-secondary-abc123",
      "title": "الفيزياء للصف الثالث الثانوي",
      "subject": "physics",
      "total_pages": 200,
      "extraction_status": "pending"
    }
  }
}
```

#### 3.2.3 هيكل ملف الكتاب بعد الرفع

بعد رفع الكتاب، يُنشئ النظام الهيكل التالي تلقائيًا:

```
data/books/<bookId>/
├── source.pdf                    ← الكتاب الأصلي
├── master.json                   ← بيانات الكتاب الرئيسية
├── extraction.log                ← سجل عملية الاستخراج
├── lessons/                      ← بيانات الدروس المستخرجة
│   ├── lesson-1-1.json
│   ├── lesson-1-2.json
│   └── ...
├── images/                       ← الصور المرتبطة بالدروس
│   └── <lessonId>/
│       ├── img-abc123.png
│       └── ...
├── videos/                       ← الفيديوهات المُنتجة
│   ├── lesson-1-1.mp4
│   ├── lesson-1-1.mp3
│   └── ...
├── temp/                         ← صور الصفحات المؤقتة (PDF→Image)
├── raw-json/                     ← نتائج VLM لكل صفحة
└── merged-lessons/               ← نتائج دمج الصفحات
```

### 3.3 استخراج المحتوى (Content Extraction)

#### 3.3.1 عبر الـ Dashboard

1. من صفحة **الكتب**، اختر الكتاب المطلوب
2. اضغط **"بدء الاستخراج"**
3. راقب التقدم في شريط التقدم (Real-time عبر Socket.io)

#### 3.3.2 عبر API

```bash
# بدء الاستخراج
curl -X POST http://localhost:3001/api/books/<bookId>/extract

# مراقبة التقدم
curl http://localhost:3001/api/books/<bookId>/extract/status

# إيقاف الاستخراج
curl -X POST http://localhost:3001/api/books/<bookId>/extract/stop

# عرض السجلات
curl http://localhost:3001/api/books/<bookId>/logs
```

#### 3.3.3 عبر سطر الأوامر (Manual Pipeline)

**تشغيل الـ Pipeline الكامل:**
```bash
cd mini-services/control-center/content-extractor
python run-all.py --book-id <bookId>
```

**تشغيل مرحلة محددة:**
```bash
# فقط تحويل PDF إلى صور
python run-all.py --book-id <bookId> --only-step 1

# فقط استخراج VLM
python run-all.py --book-id <bookId> --only-step 2

# فقط دمج الصفحات
python run-all.py --book-id <bookId> --only-step 3

# فقط توليد master.json
python run-all.py --book-id <bookId> --only-step 4
```

**تخطي مراحل معينة:**
```bash
# تخطي تحويل PDF (الصور موجودة مسبقًا)
python run-all.py --book-id <bookId> --skip-convert

# تخطي VLM Extraction
python run-all.py --book-id <bookId> --skip-extraction
```

**الطريقة القديمة (Legacy):**
```bash
python run-all.py --pdf "books/physics-moaser.pdf"
```

#### 3.3.4 مراحل الاستخراج بالتفصيل

**Stage 1: PDF → Images**
- يستخدم PyMuPDF لتحويل كل صفحة PDF إلى صورة PNG
- الدقة الافتراضية: 150 DPI
- أقصى حجم للصورة: 512px
- الوقت التقريبي: ~1 ثانية لكل صفحة

**Stage 2: VLM Extraction (المحور الأساسي)**
- يرسل كل صفحة (صورة واحدة فقط!) إلى نموذج VLM عبر Ollama
- النموذج الافتراضي: `qwen2.5vl:7b`
- فترة انتظار (cooldown): 10 ثوانٍ بين كل صفحة
- يُراعي حماية الـ GPU: يتحقق من VRAM قبل كل طلب
- **وقت معالجة كتاب 200 صفحة: ~2-3 ساعات**
- يتم الحفظ التلقائي بعد كل صفحة (Resume capability)

**Stage 3: Merge Pages**
- يدمج نتائج الصفحات الفردية إلى دروس كاملة
- يحتاج ملف `book-index.json` لتعريف الصفحات لكل درس
- يستخدم استراتيجية إزالة التكرار: `latex_formula_and_term`

**Stage 4: Generate Master**
- يُنشئ ملف `master.json` الشامل
- يُنشئ ملفات `lesson-*.json` لكل درس
- يتضمن: تعريفات، معادلات، أسئلة، جداول

#### 3.3.5 تعريف فهرس الكتاب (book-index.json)

قبل تشغيل الـ Pipeline، أنشئ ملف `content-extractor/config/book-index.json`:

```json
{
  "book": "المعاصر فيزياء 3 ثانوي",
  "subject": "physics",
  "grade": "3",
  "term": "1",
  "chapters": [
    {
      "id": "ch-01-current-electricity",
      "name": "التيار الكهربي وقانون أوم",
      "lessons": [
        {
          "id": "lesson-01",
          "title": "الكميات الفيزيائية الكهربية",
          "pages": [1, 2, 3]
        },
        {
          "id": "lesson-02",
          "title": "شدة التيار الكهربي",
          "pages": [4, 5, 6, 7]
        }
      ]
    }
  ],
  "notes": {
    "page_offset": 0,
    "skip_pages": []
  }
}
```

> **ملاحظة مهمة**: `page_offset` يُضاف لكل رقم صفحة لحساب الصفحة الفعلية في PDF. استخدمه إذا كان الكتاب يحتوي على صفحات غلاف أو فهرس في البداية.

### 3.4 توليد المحتوى بالذكاء الاصطناعي (AI Text Generation)

يتم توليد المحتوى النصي (شرح، تعريفات، معادلات، أسئلة) أثناء مرحلة الـ VLM Extraction. لكن يمكن إعادة توليده أو تحسينه عبر:

#### 3.4.1 توليد سكريبت الفيديو

```bash
cd mini-services/control-center
python scripts/generate-script.py --book-id <bookId> --lesson-id <lessonId>

# باللهجة المصرية (افتراضي)
python scripts/generate-script.py --book-id physics --lesson-id lesson-1-1 --dialect egyptian_colloquial

# بالفصحى
python scripts/generate-script.py --book-id physics --lesson-id lesson-1-1 --dialect standard_arabic
```

#### 3.4.2 توليد الأسئلة بالـ LLM

يتم ذلك عبر الـ Dashboard أو عبر LM Studio API مباشرة. النموذج الموصى به:
- **سريع**: Qwen3 1.7B (~1.2 GB)
- **متوازن**: Qwen2.5 7B Instruction (~4.5 GB)
- **عالي الجودة**: Scaled Oss 36B (~20 GB، يحتاج 16 GB RAM)

### 3.5 توليد المحتوى البصري (Visual Content)

#### 3.5.1 رفع صور يدويًا

```bash
curl -X POST http://localhost:3001/api/books/<bookId>/lessons/<lessonId>/images \
  -F "image=@diagram.png" \
  -F "description=دائرة كهربية بسيطة" \
  -F "type=circuit"
```

**أنواع الصور المدعومة:**
| النوع | الوصف |
|-------|-------|
| `circuit` | دوائر كهربية |
| `graph` | رسوم بيانية |
| `diagram` | مخططات توضيحية |
| `photo` | صور فوتوغرافية |

#### 3.5.2 توليد صور بالذكاء الاصطناعي (Pinokio/Foocus)

1. شغّل Pinokio/Foocus على المنفذ 7860
2. استخدمه لتوليد صور توضيحية للدروس
3. ارفع الصور المولّدة عبر الـ Dashboard أو API

### 3.6 توليد الفيديو (Video Generation)

#### 3.6.1 توليد فيديو لدرس واحد عبر API

```bash
curl -X POST http://localhost:3001/api/videos/generate/<bookId>/<lessonId>
```

#### 3.6.2 توليد فيديو لعدة دروس (Batch)

```bash
curl -X POST http://localhost:3001/api/videos/generate-batch \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": "physics-3rd-secondary",
    "lesson_ids": ["lesson-1-1", "lesson-1-2", "lesson-1-3"]
  }'
```

#### 3.6.3 مراقبة حالة الفيديو

```bash
curl http://localhost:3001/api/videos/status/<bookId>/<lessonId>
```

#### 3.6.4 إلغاء إنتاج فيديو

```bash
curl -X POST http://localhost:3001/api/videos/cancel/<bookId>/<lessonId>
```

#### 3.6.5 مراحل إنتاج الفيديو بالتفصيل

يعمل `render-video.js` بالمراحل التالية:

1. **تحميل lesson.json** — قراءة بيانات الدرس
2. **توليد السكريبت** — إذا لم يكن `video.script_text` موجودًا، يشغّل `generate-script.py`
3. **توليد الصوت (TTS)** — عبر `generate_tts.py` باستخدام edge-tts
   - الصوت الافتراضي: `ar-EG-SalmaNeural`
   - يُنتج ملف MP3 + ملف timestamps JSON
4. **تجهيز الأصول (Staging)** — نسخ lesson.json + timestamps + صوت + صور إلى `public/` ليقرأها Remotion
5. **حساب المدة** — من مصفوفة `scenes` في الدرس
6. **Render بـ Remotion** — `npx remotion render LessonVideo` بـ concurrency=4
7. **ضغط بـ FFmpeg** — H.264/AAC، CRF=22، preset=fast
8. **حذف الملف المؤقت (Raw)** — تنظيف ملف الفيديو غير المضغوط
9. **تحديث البيانات** — كتابة `video_url`، `file_size_mb`، `duration_sec` في lesson.json
10. **تنظيف** — حذف الملفات المؤقتة من `public/`

#### 3.6.6 توليد فيديو يدوي (بدون Queue)

```bash
cd mini-services/control-center
node scripts/render-video.js --book-id=<bookId> --lesson-id=<lessonId>

# تخطي مرحلة TTS
node scripts/render-video.js --book-id=physics --lesson-id=lesson-1-1 --skip-tts

# تخطي مرحلة Render
node scripts/render-video.js --book-id=physics --lesson-id=lesson-1-1 --skip-render
```

#### 3.6.7 تشغيل Factory الكامل من سطر الأوامر

```bash
cd mini-services/control-center
node run-factory.js --lesson=ohm-law
```

هذا السكريبت يقوم بـ:
1. توليد الصوت بـ edge-tts
2. Render بـ Remotion
3. ضغط بـ FFmpeg
4. تنظيف الملفات المؤقتة

### 3.7 تعديل المحتوى الموجود (Editing Content)

#### 3.7.1 عبر الـ Dashboard (الطريقة الموصى بها)

1. افتح http://localhost:3002
2. اذهب إلى صفحة **الكتب**
3. اختر الكتاب ثم الدرس المطلوب
4. عدّل المحتوى في المحرر:
   - **نص الدرس**: المحرر النصي
   - **المعادلات**: محرر LaTeX (KaTeX)
   - **الأسئلة**: محرر الأسئلة
   - **الجداول**: محرر الجداول
   - **الصور**: مدير الصور

#### 3.7.2 عبر API

```bash
# قراءة بيانات درس
curl http://localhost:3001/api/books/<bookId>/lessons/<lessonId>

# تحديث بيانات درس (أرسل JSON كامل)
curl -X PUT http://localhost:3001/api/books/<bookId>/lessons/<lessonId> \
  -H "Content-Type: application/json" \
  -d @lesson-data.json

# اعتماد الدرس بعد المراجعة
curl -X POST http://localhost:3001/api/books/<bookId>/lessons/<lessonId>/review \
  -H "Content-Type: application/json" \
  -d '{"notes": "تمت المراجعة، الدرس جاهز"}'
```

#### 3.7.3 تعديل مباشر لملفات JSON

يمكنك تعديل ملفات `lesson-*.json` مباشرة في `data/books/<bookId>/lessons/`. التغييرات ستظهر في الـ Dashboard فورًا (لأن النظام يقرأ من الملفات مباشرة).

> **تحذير**: لا تعدّل ملف JSON أثناء عملية Render. انتظر حتى ينتهي الفيديو.

### 3.8 تصدير المحتوى للمنصة التعليمية (Export)

```bash
# تصدير جميع دروس كتاب
node scripts/export-education.js --book-id=<bookId>

# تصدير درس محدد
node scripts/export-education.js --book-id=<bookId> --lesson-id=<lessonId>

# تصدير مع تنسيق (pretty print)
node scripts/export-education.js --book-id=<bookId> --pretty
```

أو عبر API:
```bash
curl -X POST http://localhost:3001/api/videos/export-education \
  -H "Content-Type: application/json" \
  -d '{"book_id": "physics-3rd-secondary"}'
```

الملف يُحفظ في: `data/books/<bookId>/education-export.json`

---

## 4. إدارة الـ AI Models

### 4.1 LM Studio (localhost:1234)

#### 4.1.1 التشغيل

1. افتح LM Studio
2. من القائمة الجانبية، اختر النموذج
3. اضغط **"Load"** في أعلى يسار النافذة
4. تأكد من اختيار **"Server"** tab ومن أن المنفذ 1234 ظاهر

#### 4.1.2 النماذج المتاحة والاستخدامات

| النموذج | الحجم | السرعة | الجودة | الاستخدام الموصى به |
|---------|-------|--------|--------|-------------------|
| **Qwen3 1.7B** | ~1.2 GB | سريع جدًا | متوسطة | توليد أسئلة سريع، تصنيف |
| **Qwen2.5 7B Instruction** | ~4.5 GB | متوازن | جيدة | توليد الشروحات، الأسئلة المفصّلة |
| **Scaled Oss 36B** | ~20 GB | بطيء | عالية جدًا | مراجعة الجودة، توليد محتوى معقد |

#### 4.1.3 تحميل النماذج في LM Studio

1. من علامة التبويب **"Search"**
2. اكتب اسم النموذج (مثلاً `Qwen3 1.7B`)
3. اضغط **"Download"**
4. انتظر حتى يكتمل التحميل

#### 4.1.4 التحقق من عمل LM Studio

```bash
curl http://localhost:1234/v1/models
```

يجب أن يُظهر قائمة النماذج المحمّلة.

### 4.2 Ollama (localhost:11434)

#### 4.2.1 التشغيل

Ollama يعمل كخدمة خلفية تلقائيًا. إذا لم يكن يعمل:

```bash
ollama serve
```

#### 4.2.2 النماذج المتاحة والاستخدامات

| النموذج | الحجم | الاستخدام |
|---------|-------|----------|
| **qwen2.5vl:7b** | ~4.5 GB | استخراج المحتوى من صور الكتب (VLM) — **النموذج الأساسي** |
| **DeepSeek-Coder V2:16B** | ~10 GB | توليد أكواد، معالجة نصوص تقنية |
| **Qwen2.5-Coder:7B** | ~4.5 GB | توليد أكواد سريع |

#### 4.2.3 تثبيت النماذج

```bash
# النموذج الأساسي للاستخراج
ollama pull qwen2.5vl:7b

# نماذج بديلة (Fallback Chain)
ollama pull gemma3:4b
ollama pull llama3.2-vision:11b

# نماذج الكود
ollama pull deepseek-coder-v2:16b
ollama pull qwen2.5-coder:7b
```

#### 4.2.4 التحقق من عمل Ollama

```bash
ollama list
```

### 4.3 مراقبة استخدام GPU/RAM

#### 4.3.1 عبر API

```bash
curl http://localhost:3001/api/system/status
```

#### 4.3.2 عبر سطر الأوامر (NVIDIA GPU)

```bash
# مراقبة مستمرة
nvidia-smi -l 1

# قراءة واحدة
nvidia-smi
```

#### 4.3.3 مؤشرات مهمة

| المؤشر | الحد الآمن | حد التحذير | إجراء عند التحذير |
|--------|-----------|-----------|-----------------|
| GPU VRAM المستخدم | < 6 GB | > 7 GB | أوقف العمليات، أفرغ الذاكرة |
| GPU Utilization | < 90% | > 95% لفترات طويلة | قلل concurrency |
| RAM المستخدم | < 24 GB (من 32) | > 26 GB | أوقف النماذج غير المستخدمة |
| حرارة GPU | < 80°C | > 85°C | خفّف الحِمل، تحقق من التهوية |

### 4.4 التبديل بين النماذج

#### 4.4.1 في LM Studio

1. اضغط **"Unload"** للنموذج الحالي
2. اختر النموذج الجديد
3. اضغط **"Load"**

> **ملاحظة**: لا يمكنك تحميل أكثر من نموذج واحد في LM Studio في نفس الوقت (إلا إذا كان لديك ذاكرة كافية).

#### 4.4.2 في Ollama

Ollama يُفرّغ النماذج تلقائيًا عند عدم استخدامها. يمكنك:

```bash
# التبديل لنموذج مختلف أثناء الـ Pipeline
python run-all.py --book-id <bookId> --model gemma3:4b

# إزالة نموذج من الذاكرة
ollama stop qwen2.5vl:7b
```

#### 4.4.3 تعديل Fallback Chain

عدّل `pipeline-config.json`:

```json
{
  "stage_2_vlm_extraction": {
    "preferred_model": "qwen2.5vl:7b",
    "fallback_chain": ["qwen2.5vl:7b", "llama3.2-vision:11b", "gemma3:4b"]
  }
}
```

إذا فشل النموذج الأساسي (مثلاً OOM)، ينتقل تلقائيًا للنموذج التالي في السلسلة.

### 4.5 استكشاف مشاكل النماذج

| المشكلة | السبب المحتمل | الحل |
|---------|-------------|------|
| `ECONNREFUSED` على 1234 | LM Studio غير مفتوح | افتح LM Studio وحمّل نموذجًا |
| `ECONNREFUSED` على 11434 | Ollama لا يعمل | شغّل `ollama serve` |
| GPU OOM | VRAM لا يكفي | استخدم نموذج أصغر أو أغلق تطبيقات أخرى |
| Ollama timeout | الصورة كبيرة جدًا | قلّل `max_size` في الإعدادات إلى 256 |
| ناتج JSON غير صالح | النموذج أخطأ | يعاد تلقائيًا (3 محاولات)، أو شغّل بـ `--force` |
| جودة الاستخراج ضعيفة | DPI منخفض | ارفع DPI إلى 200 في الإعدادات |

---

## 5. المزامنة (Synchronization)

### 5.1 كيف تعمل المزامنة

نظام SmartEdu يتكون من جزأين يشاركان نفس قاعدة البيانات:

```
┌──────────────────────────┐         ┌──────────────────────────┐
│   Data Factory           │         │   Student Platform       │
│   (Content Creation)     │  Sync   │   (Content Consumption)  │
│                          │◄───────▶│                          │
│   - Create lessons       │         │   - Serve lessons        │
│   - Generate videos      │         │   - Student progress     │
│   - Extract content      │         │   - Quiz results         │
└──────────┬───────────────┘         └──────────┬───────────────┘
           │                                    │
           └──────────┐      ┌──────────────────┘
                      ▼      ▼
              ┌──────────────────┐
              │   SQLite Database │
              │   db/custom.db    │
              └──────────────────┘
```

- **Data Factory** يكتب المحتوى (دروس، أسئلة، فيديوهات)
- **Student Platform** يقرأ المحتوى ويُسجّل تقدم الطلاب
- كلاهما يشتركان في نفس ملف `db/custom.db`

### 5.2 تشغيل المزامنة يدويًا

بما أن النظام يستخدم SQLite مباشرة (ملف واحد)، لا يوجد إجراء "مزامنة" منفصل. لكن عند تصدير المحتوى:

```bash
# تصدير المحتوى من Factory للمنصة
cd mini-services/control-center
node scripts/export-education.js --book-id=<bookId>

# أو عبر API
curl -X POST http://localhost:3001/api/videos/export-education \
  -H "Content-Type: application/json" \
  -d '{"book_id": "<bookId>"}'
```

الملف المُصدَّر يُحفظ في `data/books/<bookId>/education-export.json` ويحتوي على:
- بيانات الكتاب
- بيانات كل درس (ملخص، أهداف، معادلات، أسئلة)
- رابط الفيديو (إذا تم إنتاجه)

### 5.3 حل التعارضات

بما أن النظام يستخدم ملف SQLite واحد:
- **لا يمكن** تشغيل Factory Backend و Student Platform معًا إذا كانا يكتبان في نفس الوقت
- **الحل**: شغّل Factory لإنتاج المحتوى، ثم أوقفه وشغّل Platform للتوزيع
- **الأفضل**: شغّل Factory على جهاز منفصل (الإنتاج)، و Platform على جهاز آخر (الاستهلاك)

### 5.4 مراقبة حالة المزامنة

```bash
# فحص حالة الكتب في Factory
curl http://localhost:3001/api/books

# فحص حالة Queue
curl http://localhost:3001/api/videos/queue

# فحص حالة النظام
curl http://localhost:3001/api/system/status
```

---

# الجزء الثاني: الصيانة

---

## 6. النسخ الاحتياطي (Backup)

### 6.1 نسخ احتياطي لقاعدة البيانات (SQLite)

#### 6.1.1 نسخ يدوي

```bash
# إنشاء مجلد النسخ الاحتياطي
mkdir -p backups/db

# نسخ ملف قاعدة البيانات مع الطابع الزمني
copy db\custom.db backups\db\custom_%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%.db
```

على Linux/Git Bash:
```bash
mkdir -p backups/db
cp db/custom.db "backups/db/custom_$(date +%Y%m%d_%H%M).db"
```

#### 6.1.2 نسخ باستخدام Prisma

```bash
# تصدير البيانات كـ JSON
npx tsx scripts/export-to-json.ts
```

### 6.2 نسخ احتياطي للمحتوى (Content Backup)

المحتوى المستخرج مخزّن في `mini-services/control-center/data/books/`:

```bash
# نسخ احتياطي كامل لدليل الكتب
xcopy "mini-services\control-center\data\books" "backups\content\books_%date:~-4%%date:~4,2%%date:~7,2%" /E /I /H
```

على Linux/Git Bash:
```bash
cp -r mini-services/control-center/data/books "backups/content/books_$(date +%Y%m%d)"
```

### 6.3 نسخ احتياطي لملفات الفيديو

```bash
# نسخ ملفات الفيديو فقط
mkdir -p backups/videos
robocopy "mini-services\control-center\data\books" "backups\videos" *.mp4 /S
```

### 6.4 خطة النسخ الاحتياطي المجدول (Scheduled Backup Plan)

| التكرار | المحتوى | الطريقة |
|---------|---------|---------|
| **يومي** | قاعدة البيانات (custom.db) | نسخ الملف (أوامر أعلاه) |
| **أسبوعي** | مجلد الكتب بالكامل | نسخ كامل لـ `data/books/` |
| **شهري** | كل المشروع (بما فيه node_modules) | `zip -r backup.zip my-project/` |
| **قبل كل تحديث** | قاعدة البيانات + الكتب | نسخ يدوي إلزامي |

> **ملاحظة مهمة**: دائمًا احتفظ بنسخة من مجلد `raw-json/` لكل كتاب — إعادة استخراجه تستغرق ساعات!

### 6.5 استعادة من نسخة احتياطية

```bash
# استعادة قاعدة البيانات
copy "backups\db\custom_20250701.db" db\custom.db

# استعادة محتوى كتاب محدد
xcopy "backups\content\books_20250701\physics-3rd-secondary" "mini-services\control-center\data\books\physics-3rd-secondary" /E /I /H
```

---

## 7. التحديثات (Updates)

### 7.1 تحديث المنصة الرئيسية (Student Platform)

```bash
cd my-project

# سحب التحديثات
git pull origin main

# تحديث الحزم
npm install

# تحديث قاعدة البيانات
npx prisma db push
npx prisma generate

# إعادة التشغيل
npm run dev
```

### 7.2 تحديث حزم الاعتماديات (Dependencies)

#### 7.2.1 المشروع الرئيسي

```bash
cd my-project

# فحص الحزم القديمة
npm outdated

# تحديث تلقائي (minor & patch فقط — آمن)
npm update

# تحديث حزمة محددة
npm install <package-name>@latest

# تحديث major versions (قد يحتاج تعديلات يدوية)
npx npm-check-updates -u
npm install
```

#### 7.2.2 Factory Backend

```bash
cd mini-services/control-center
npm update
```

#### 7.2.3 Factory Dashboard

```bash
cd mini-services/control-center/dashboard-app
npm update
```

#### 7.2.4 حزم Python

```bash
cd mini-services/control-center/content-extractor
pip install --upgrade -r requirements.txt
```

### 7.3 تحديث نماذج الذكاء الاصطناعي

#### 7.3.1 LM Studio

1. افتح LM Studio
2. اذهب إلى علامة التبويب **"Search"**
3. ابحث عن النموذج
4. إذا كان هناك إصدار أحدث، سيظهر زر **"Update"**

#### 7.3.2 Ollama

```bash
# تحديث نموذج محدد
ollama pull qwen2.5vl:7b    # يسحب أحدث إصدار تلقائيًا

# تحديث جميع النماذج
ollama pull qwen2.5vl:7b
ollama pull gemma3:4b
ollama pull deepseek-coder-v2:16b
ollama pull qwen2.5-coder:7b
```

### 7.4 إجراءات الترحيل (Migration Procedures)

#### 7.4.1 قبل التحديث — قائمة فحص

- [ ] نسخة احتياطية من `db/custom.db`
- [ ] نسخة احتياطية من `data/books/`
- [ ] تسجيل إصدارات الحزم الحالية: `npm list > packages-before.txt`
- [ ] إيقاف جميع الخدمات

#### 7.4.2 بعد التحديث — قائمة فحص

- [ ] تشغيل `npx prisma db push` لتحديث هيكل الجداول
- [ ] تشغيل `npm run dev` ومراقبة الأخطاء
- [ ] فحص http://localhost:3002 — Dashboard يعمل
- [ ] فحص http://localhost:3001/api/system/status — Backend يعمل
- [ ] اختبار رفع كتاب صغير كاختبار سريع
- [ ] مراجعة الـ Change Log

#### 7.4.3 التراجع عن تحديث (Rollback)

```bash
# التراجع عن تغييرات Git
git log --oneline -5    # عرض آخر 5 commits
git reset --hard <commit-hash>

# استعادة قاعدة البيانات
copy "backups\db\custom_before_update.db" db\custom.db

# إعادة تثبيت الحزم
rm -rf node_modules package-lock.json
npm install
```

---

## 8. استكشاف الأخطاء (Troubleshooting)

### 8.1 أخطاء المنافذ (Port Conflicts)

| الرسالة | المنفذ | السبب | الحل |
|---------|--------|-------|------|
| `EADDRINUSE: address already in use` | 3001 | Backend يعمل بالفعل | `taskkill /F /PID <pid>` أو أغلق Terminal |
| `EADDRINUSE` | 3002 | Dashboard يعمل بالفعل | أغلق Terminal الذي يشغّل Dashboard |
| `EADDRINUSE` | 4000 | Platform يعمل بالفعل | أغلق Terminal الذي يشغّل Platform |
| `EADDRINUSE` | 1234 | LM Studio يستخدم المنفذ | أغلق LM Studio أو غيّر المنفذ |
| `EADDRINUSE` | 11434 | Ollama يعمل بالفعل | عادي — Ollama يعمل كخدمة |

**البحث عن العملية التي تستخدم منفذًا:**
```bash
# Windows
netstat -ano | findstr :3001
tasklist | findstr <PID>

# Linux / Git Bash
lsof -i :3001
```

**قتل عملية:**
```bash
# Windows
taskkill /F /PID <PID>

# Linux
kill -9 <PID>
```

### 8.2 أخطاء قاعدة البيانات

#### 8.2.1 `DATABASE_URL not found`

```bash
# تحقق من وجود ملف .env
ls .env

# أنشئه إذا لم يكن موجودًا
echo "DATABASE_URL=file:./db/custom.db" > .env
```

#### 8.2.2 `Prisma Client not generated`

```bash
npx prisma generate
```

#### 8.2.3 `Table not found` أو `Column not found`

```bash
# تحديث هيكل الجداول
npx prisma db push
```

#### 8.2.4 قاعدة البيانات تالفة

```bash
# إعادة تعيين كاملة (يحذف البيانات!)
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

#### 8.2.5 `database is locked` (SQLite)

هذا يحدث عندما عمليتان تحاولان الكتابة في نفس الوقت:
1. أوقف جميع الخدمات
2. تأكد من عدم وجود عمليات Node.js عالقة
3. أعد تشغيل خدمة واحدة فقط

### 8.3 أخطاء نماذج الذكاء الاصطناعي (AI Model Errors)

#### 8.3.1 `Connection refused to localhost:1234`

**السبب**: LM Studio غير مفتوح أو لا يحتوي على نموذج محمّل.

**الحل**:
1. افتح LM Studio
2. حمّل نموذجًا
3. تأكد أن Server يعمل على المنفذ 1234

#### 8.3.2 `Connection refused to localhost:11434`

**السبب**: Ollama لا يعمل.

**الحل**:
```bash
ollama serve
```

#### 8.3.3 `GPU out of memory` أثناء الاستخراج

**السبب**: نموذج VLM كبير على الـ VRAM المتاح.

**الحلول**:
1. أغلق التطبيقات التي تستخدم GPU (ألعاب، متصفح مع تسريع GPU)
2. استخدم نموذج أصغر: `--model gemma3:4b`
3. قلل `max_size` في الإعدادات إلى 256
4. ارفع `cooldown_seconds` إلى 15-20

#### 8.3.4 `Ollama timeout` على صفحة معينة

**السبب**: الصورة معقدة جدًا أو النموذج يستغرق وقتًا طويلاً.

**الحل**:
- السكريبت يتخطى الصفحة تلقائيًا ويواصل
- أعد التشغيل — السكريبت يستأنف من آخر صفحة ناجحة
- للإجبار على إعادة المعالجة: احذف ملف `page_XXXX.json` من `raw-json/`

#### 8.3.5 `Invalid JSON` في ناتج VLM

**السبب**: النموذج أخرج JSON غير صالح.

**الحل**:
- السكريبت يعيد المحاولة 3 مرات تلقائيًا
- إذا استمر الفشل: حاول نموذج مختلفًا
- راجع `raw_response` في ملف الصفحة الفاشل

### 8.4 أخطاء معالجة PDF

#### 8.4.1 `PyMuPDF not installed`

```bash
cd mini-services/control-center/content-extractor
pip install PyMuPDF
```

#### 8.4.2 `PDF page too large` أو `Image too large`

**الحل**: قلل DPI في الإعدادات:
```json
{
  "stage_1_pdf_to_image": {
    "dpi": 100,
    "max_size": 256
  }
}
```

#### 8.4.3 `PDF is encrypted` أو `PDF is corrupted`

- تأكد أن ملف PDF ليس مشفرًا
- جرب فتح الملف في Adobe Reader أولًا
- إذا كان مشفرًا: افتحه واطبعه كـ PDF جديد (بلا حماية)

### 8.5 أخطاء إنتاج الفيديو (Video Rendering Errors)

#### 8.5.1 `edge-tts not installed`

```bash
pip install edge-tts
```

#### 8.5.2 `FFmpeg not found`

```bash
# تحقق
ffmpeg -version

# إذا لم يكن موجودًا، أضفه إلى PATH
# أو ثبّته من: https://www.gyan.dev/ffmpeg/builds/
```

#### 8.5.3 `Remotion render failed`

**السبب المحتمل**: خطأ في بيانات lesson.json.

**خطوات الحل**:
1. راجع ملف `data/books/<bookId>/videos/<lessonId>.log`
2. تحقق من صحة `scenes` array في lesson.json
3. تحقق من وجود صور مرجعية (إذا استخدمت `ImageDisplay`)
4. حاول تشغيل Remotion Studio لرؤية الخطأ بصريًا:

```bash
cd mini-services/control-center
npx remotion studio
```

#### 8.5.4 `FFmpeg compression failed`

**الحل**: السكريبت يحتفظ بالنسخة الأصلية كـ fallback. راجع ملف log للتفاصيل.

#### 8.5.5 فيديو بلا صوت

**السبب**: edge-tts فشل في توليد الصوت.

**الحل**:
1. تحقق من اتصال الإنترنت (edge-tts يحتاج إنترنت للاتصال بخدمات Microsoft)
2. جرب صوتًا مختلفًا: `--voice ar-EG-HodaNeural`
3. راجع ملف `generate_tts.py` log

### 8.6 مشاكل الأداء (Performance Issues)

| المشكلة | السبب | الحل |
|---------|-------|------|
| استخراج بطيء جدًا | cooldown طويل أو نموذج كبير | قلل cooldown، استخدم نموذج أصغر |
| فيديو يستغرق وقتًا طويلاً | concurrency = 4 فقط | ارفع إلى 8 (إذا RAM يكفي) |
| Dashboard بطيء | كثير من البيانات في الذاكرة | أعد تشغيل الخدمة |
| RAM ممتلئ | نماذج AI + Node.js + Remotion | أغلق ما لا تحتاجه |
| قرص ممتلئ | فيديوهات + صور + نماذج | احذف temp/ و raw-json/ بعد الانتهاء |

### 8.7 أخطاء عامة

#### 8.7.1 `MODULE_NOT_FOUND`

```bash
# أعد تثبيت الحزم
rm -rf node_modules package-lock.json
npm install
```

#### 8.7.2 `TypeError: Cannot read properties of undefined`

عادةً خطأ في بيانات lesson.json. تحقق من:
- وجود جميع الحقول المطلوبة
- أن `scenes` array غير فارغ
- أن `images` array يحتوي على مسارات صحيحة

#### 8.7.3 `Error: EMFILE: too many open files`

**السبب**: فتح ملفات كثيرة في نفس الوقت (خلال Batch rendering).

**الحل** (Windows):
```bash
# زيادة حد الملفات المفتوحة
# Windows: عادةً لا يحتاج تدخل
# Linux: ulimit -n 65536
```

---

## 9. الأداء والتحسين (Performance & Optimization)

### 9.1 إدارة ذاكرة GPU

#### 9.1.1 قواعد أساسية

- **لا تحمّل أكثر من نموذج واحد** في LM Studio في نفس الوقت
- **أغلق المتصفح** أثناء استخراج المحتوى (يستهلك VRAM)
- **استخدم نموذجًا مناسبًا** لحجم VRAM:

| VRAM المتاح | النموذج الموصى به |
|-------------|------------------|
| 4 GB | gemma3:4b أو qwen2.5vl:2b |
| 6-8 GB | qwen2.5vl:7b |
| 12+ GB | qwen2.5vl:7b + Qwen2.5 7B (معًا) |
| 16+ GB | Scaled Oss 36B + qwen2.5vl:7b |

#### 9.1.2 إعدادات حماية GPU في Pipeline

```json
{
  "stage_2_vlm_extraction": {
    "vram_limit_mb": 7168,
    "gpu_check_retries": 3,
    "gpu_retry_wait_seconds": 30,
    "cooldown_seconds": 10
  }
}
```

- `vram_limit_mb`: إذا تجاوز الاستخدام هذا الحد، يتوقف الـ Pipeline مؤقتًا
- `gpu_check_retries`: عدد مرات إعادة المحاولة قبل الإبلاغ عن فشل
- `cooldown_seconds`: فترة الانتظار بين الصفحات

### 9.2 تحسين Batch Processing

#### 9.2.1 إعداد Remotion Concurrency

```json
{
  "stage_5_video_factory": {
    "remotion": {
      "concurrency": 4
    }
  }
}
```

| RAM المتاح | Concurrency الموصى به |
|-----------|---------------------|
| 16 GB | 2-4 |
| 32 GB | 4-8 |
| 64 GB | 8-16 |

#### 9.2.2 إعداد Queue Worker

```bash
# فحص أسرع (كل ثانية)
QUEUE_POLL_INTERVAL_MS=1000 node scripts/queue-worker.js

# فحص أبطأ (توفير موارد)
QUEUE_POLL_INTERVAL_MS=10000 node scripts/queue-worker.js

# الخروج عند انتهاء الـ Queue
EXIT_WHEN_EMPTY=1 node scripts/queue-worker.js
```

### 9.3 تحسين قاعدة البيانات

#### 9.3.1 SQLite Optimization

```bash
# ضغط قاعدة البيانات
sqlite3 db/custom.db "VACUUM;"

# فحص سلامة قاعدة البيانات
sqlite3 db/custom.db "PRAGMA integrity_check;"

# عرض حجم قاعدة البيانات
ls -lh db/custom.db
```

#### 9.3.2 تنظيف البيانات القديمة

```bash
# حذف بيانات الـ Progress القديمة (عبر Prisma Studio أو SQL)
sqlite3 db/custom.db "DELETE FROM Progress WHERE watchedAt < datetime('now', '-30 days');"

# حذف QuizResult القديمة
sqlite3 db/custom.db "DELETE FROM QuizResult WHERE completedAt < datetime('now', '-30 days');"
```

### 9.4 إدارة الذاكرة المؤقتة (Cache Management)

#### 9.4.1 ملفات مؤقتة يجب حذفها

بعد الانتهاء من استخراج كتاب ومراجعته، يمكن حذف:

```
data/books/<bookId>/
├── temp/            ← يمكن حذفه (صور الصفحات المؤقتة)
├── raw-json/        ← ← حذف بحذر! إعادة توليده تستغرق ساعات
└── merged-lessons/  ← يمكن حذفه (يُعاد توليده من raw-json)
```

```bash
# حذف مجلد temp بعد الانتهاء
rm -rf data/books/<bookId>/temp

# حذف merged-lessons
rm -rf data/books/<bookId>/merged-lessons
```

#### 9.4.2 تنظيف Node.js Cache

```bash
# مسح npm cache
npm cache clean --force

# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

#### 9.4.3 تنظيف Remotion Cache

```bash
# مسح cache Renders
rm -rf mini-services/control-center/node_modules/.cache
```

#### 9.4.4 تنظيف FFmpeg Temp

FFmpeg يكتب ملفات مؤقتة في `%TEMP%` على Windows. يمكن حذفها:

```bash
# Windows
del /Q %TEMP%\*.tmp
del /Q %TEMP%\ff*.mp4
```

---

# الجزء الثالث: المراجع

---

## 10. قائمة المنافذ (Port Reference)

| الخدمة | المنفذ | البروتوكول | الوصف | مطلوب؟ |
|--------|--------|-----------|-------|--------|
| Student Platform | 4000 | HTTP | Next.js — منصة الطالب | اختياري |
| Factory Backend | 3001 | HTTP + WebSocket | Express + Socket.io — الـ API الرئيسي | **مطلوب** |
| Factory Dashboard | 3002 | HTTP | Next.js — لوحة التحكم | **مطلوب** |
| LM Studio | 1234 | HTTP | OpenAI-compatible API | مطلوب لـ LLM |
| Ollama | 11434 | HTTP | Ollama API | مطلوب لـ VLM |
| Pinokio/Foocus | 7860 | HTTP | واجهة توليد الصور | اختياري |

> **ملاحظة**: لا توجد إعدادات HTTPS/SSL — النظام مصمم للاستخدام المحلي (localhost) فقط.

---

## 11. قائمة API Endpoints

**Base URL**: `http://localhost:3001/api`

### 11.1 Books API — الكتب

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/books` | قائمة جميع الكتب |
| `POST` | `/api/books/upload` | رفع كتاب PDF جديد |
| `GET` | `/api/books/:bookId` | تفاصيل كتاب |
| `DELETE` | `/api/books/:bookId` | حذف كتاب |
| `POST` | `/api/books/:bookId/extract` | بدء استخراج المحتوى |
| `GET` | `/api/books/:bookId/extract/status` | حالة الاستخراج |
| `POST` | `/api/books/:bookId/extract/stop` | إيقاف الاستخراج |
| `GET` | `/api/books/:bookId/logs` | سجلات الكتاب |

### 11.2 Lessons API — الدروس

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/books/:bookId/lessons` | قائمة دروس كتاب |
| `GET` | `/api/books/:bookId/lessons/:lessonId` | تفاصيل درس |
| `PUT` | `/api/books/:bookId/lessons/:lessonId` | تحديث درس |
| `POST` | `/api/books/:bookId/lessons/:lessonId/images` | رفع صورة |
| `DELETE` | `/api/books/:bookId/lessons/:lessonId/images/:imageId` | حذف صورة |
| `POST` | `/api/books/:bookId/lessons/:lessonId/review` | اعتماد الدرس |

### 11.3 Videos API — الفيديوهات

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/videos/queue` | حالة الـ Queue |
| `POST` | `/api/videos/generate/:bookId/:lessonId` | إنتاج فيديو |
| `POST` | `/api/videos/generate-batch` | إنتاج batch |
| `GET` | `/api/videos/status/:bookId/:lessonId` | حالة فيديو |
| `POST` | `/api/videos/cancel/:bookId/:lessonId` | إلغاء إنتاج |
| `GET` | `/api/videos/:bookId/:lessonId/file` | تحميل فيديو MP4 |
| `POST` | `/api/videos/export-education` | تصدير للمنصة التعليمية |

### 11.4 Pipeline API — الإعدادات

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/config` | قراءة إعدادات Pipeline |
| `POST` | `/api/config` | تحديث إعدادات Pipeline |
| `GET` | `/api/system/status` | حالة النظام (CPU/RAM/Disk/GPU) |

### 11.5 Socket.io Events — الأحداث اللحظية

| Event | الاتجاه | الوصف |
|-------|---------|-------|
| `extraction-progress` | Server → Client | تقدم استخراج المحتوى |
| `video-progress` | Server → Client | تقدم إنتاج الفيديو |
| `queue-update` | Server → Client | تحديث حالة الـ Queue |
| `log` | Server → Client | رسائل السجل |

### 11.6 Student Platform API

**Base URL**: `http://localhost:4000/api`

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/subjects` | قائمة المواد |
| `GET` | `/api/lessons` | قائمة الدروس |
| `GET` | `/api/lessons/:id` | تفاصيل درس |
| `GET` | `/api/units/:id/lessons` | دروس وحدة |
| `GET` | `/api/structure` | هيكل المنهج الكامل |
| `GET` | `/api/progress` | تقدم الطالب |
| `POST` | `/api/progress` | تسجيل تقدم |

### 11.7 أكواد الخطأ

| HTTP Code | المعنى |
|-----------|--------|
| 200 | نجاح |
| 400 | طلب غير صالح |
| 404 | غير موجود |
| 500 | خطأ في الخادم |

تنسيق الخطأ الموحد:
```json
{
  "success": false,
  "error": "وصف الخطأ",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 12. هيكل الملفات (File Structure Reference)

### 12.1 هيكل المشروع العام

```
my-project/                              ← جذر المشروع
├── db/
│   └── custom.db                        ← قاعدة بيانات SQLite (مشاركة)
├── prisma/
│   ├── schema.prisma                    ← هيكل قاعدة البيانات
│   └── seed.ts                          ← بيانات أولية
├── docs/
│   ├── factory/                         ← وثائق Data Factory
│   │   ├── OEM-BOOK.md                  ← هذا الملف
│   │   ├── WORKFLOW.md                  ← سير العمل
│   │   ├── PLAN.md                      ← خطة التطوير
│   │   └── POD.md                       ← وثيقة المنتج
│   └── lessons/                         ← وثائق الدروس (Markdown)
├── content/                             ← محتوى TypeScript للمنصة
├── scripts/                             ← سكريبتات المنصة
├── src/                                 ← كود منصة الطالب (Next.js)
│   ├── app/                             ← App Router
│   │   ├── api/                         ← API Routes
│   │   ├── platform/                    ← صفحات المنصة
│   │   └── page.tsx                     ← Landing Page
│   ├── components/                      ← مكونات React
│   │   ├── simulators/                  ← محاكيات تفاعلية (90+)
│   │   ├── simulations/                 ← محاكيات متقدمة
│   │   ├── ui/                          ← مكونات shadcn/ui
│   │   └── quiz/                        ← نظام الاختبارات
│   ├── lib/                             ← أدوات مساعدة
│   └── hooks/                           ← React Hooks
├── public/
│   ├── data/                            ← بيانات JSON ثابتة
│   └── logo.svg                         ← الشعار
├── package.json                         ← حزم المنصة
├── next.config.ts                       ← إعدادات Next.js
└── .env                                 ← متغيرات البيئة
```

### 12.2 هيكل Data Factory

```
mini-services/control-center/            ← جذر Data Factory
├── dashboard-server.js                  ← Express Backend (Port 3001)
├── dashboard.js                         ← Dashboard بديل (قديم)
├── run-factory.js                       ← سكريبت تشغيل Factory كامل
├── package.json                         ← حزم Factory
├── remotion.config.ts                   ← إعدادات Remotion
│
├── lib/db/                              ← طبقة الوصول للبيانات
│   ├── books.js                         ← CRUD للكتب
│   ├── lessons.js                       ← CRUD للدروس
│   ├── queue.js                         ← إدارة Queue
│   └── config.js                        ← إعدادات Pipeline
│
├── scripts/                             ← سكريبتات التشغيل
│   ├── render-video.js                  ← إنتاج فيديو (المنسق الرئيسي)
│   ├── queue-worker.js                  ← خلفية معالجة Queue
│   ├── generate-script.py               ← توليد سكريبت الصوت
│   ├── generate_tts.py                  ← توليد TTS (edge-tts)
│   ├── test_stream.py                   ← اختبار streaming
│   ├── test_submaker.py                 ← اختبار subtitles
│   └── export-education.js              ← تصدير للمنصة التعليمية
│
├── src/                                 ← كود Remotion + Dashboard
│   ├── app/                             ← Next.js App (dashboard-server)
│   │   ├── api/                         ← API Routes
│   │   │   ├── get-text/route.ts        ← جلب نص الدرس
│   │   │   └── render/route.ts          ← trigger render
│   │   ├── page.tsx                     ← صفحة Remotion Studio
│   │   ├── layout.tsx                   ← Layout
│   │   └── components/                  ← مكونات Dashboard
│   ├── compositions/                    ← Remotion Compositions
│   │   └── LessonVideo.tsx              ← تكوين الفيديو التعليمي
│   ├── components/                      ← مكونات Remotion
│   │   ├── InfographicCinematic.tsx     ← إنفوجرافيك سينمائي
│   │   ├── MindMapCinematic.tsx         ← خريطة ذهنية سينمائية
│   │   ├── FormulaWrite.tsx             ← كتابة المعادلات
│   │   ├── ImageDisplay.tsx             ← عرض الصور
│   │   ├── TableDisplay.tsx             ← عرض الجداول
│   │   ├── QuizCinematic.tsx            ← اختبار سينمائي
│   │   ├── SimulatorCinematic.tsx       ← محاكي سينمائي
│   │   └── ControlPanel.tsx             ← لوحة تحكم
│   ├── data/                            ← بيانات الدروس
│   │   └── ohm-law.json                ← بيانات درس مثال
│   └── Root.tsx                         ← جذر Remotion
│
├── content-extractor/                   ← نظام استخراج المحتوى (Python)
│   ├── run-all.py                       ← تشغيل الـ Pipeline كاملًا
│   ├── requirements.txt                 ← حزم Python
│   ├── README.md                        ← توثيق Content Extractor
│   ├── config/
│   │   ├── extraction-prompt.txt        ← Prompt لنموذج VLM
│   │   ├── book-index.json              ← فهرس الكتاب
│   │   └── pipeline-config.json         ← إعدادات Pipeline (نسخة)
│   └── scripts/
│       ├── pdf-to-images.py             ← Stage 1: PDF → PNG
│       ├── extract-page.py              ← Stage 2: PNG → JSON (VLM)
│       ├── merge-pages.py               ← Stage 3: JSON → Lessons
│       ├── generate-markdown.py         ← ← توليد Markdown
│       └── generate-master.py           ← Stage 4: → master.json
│
├── dashboard-app/                       ← Factory Dashboard (Next.js, Port 3002)
│   ├── package.json                     ← حزم Dashboard
│   ├── next.config.mjs                  ← إعدادات Next.js
│   ├── tsconfig.json                    ← إعدادات TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 ← الصفحة الرئيسية
│   │   │   ├── layout.tsx               ← Layout
│   │   │   ├── books/
│   │   │   │   ├── page.tsx             ← قائمة الكتب
│   │   │   │   └── [id]/page.tsx        ← تفاصيل كتاب
│   │   │   ├── lessons/
│   │   │   │   └── [bookId]/[lessonId]/page.tsx ← محرر الدرس
│   │   │   ├── videos/                  ← صفحة الفيديو
│   │   │   └── settings/                ← صفحة الإعدادات
│   │   ├── components/
│   │   │   ├── Sidebar.tsx              ← القائمة الجانبية
│   │   │   ├── Header.tsx               ← الهيدر
│   │   │   ├── BookCard.tsx             ← بطاقة كتاب
│   │   │   ├── LessonTree.tsx           ← شجرة الدروس
│   │   │   ├── QueueList.tsx            ← قائمة Queue
│   │   │   ├── LogPanel.tsx             ← لوحة السجلات
│   │   │   ├── VideoPlayer.tsx          ← مشغل الفيديو
│   │   │   ├── StatsCard.tsx            ← بطاقة إحصائيات
│   │   │   ├── ProgressBar.tsx          ← شريط التقدم
│   │   │   ├── StatusBadge.tsx          ← شارة الحالة
│   │   │   ├── UploadBookModal.tsx      ← نافذة رفع الكتاب
│   │   │   ├── editor/                  ← محررات المحتوى
│   │   │   │   ├── TextEditor.tsx       ← محرر النص
│   │   │   │   ├── FormulaEditor.tsx    ← محرر المعادلات
│   │   │   │   ├── TableEditor.tsx      ← محرر الجداول
│   │   │   │   ├── QuestionEditor.tsx   ← محرر الأسئلة
│   │   │   │   └── ImageManager.tsx     ← مدير الصور
│   │   │   └── ui/                      ← مكونات واجهة المستخدم
│   │   ├── hooks/                       ← React Hooks
│   │   │   ├── use-fetch.ts             ← hook للجلب
│   │   │   └── use-async-action.ts      ← hook للإجراءات
│   │   ├── lib/
│   │   │   ├── api.ts                   ← دوال API
│   │   │   ├── utils.ts                 ← أدوات مساعدة
│   │   │   └── types/                   ← أنواع TypeScript
│   │   │       ├── index.ts
│   │   │       ├── book.ts
│   │   │       ├── lesson.ts
│   │   │       ├── video.ts
│   │   │       └── api.ts
│   │   └── app/
│   │       ├── globals.css              ← أنماط CSS
│   │       ├── loading.tsx              ← صفحة التحميل
│   │       ├── error.tsx                ← صفحة الخطأ
│   │       └── not-found.tsx            ← صفحة 404
│   └── components.json                  ← إعدادات shadcn/ui
│
├── data/                                ← بيانات التشغيل
│   ├── config/
│   │   └── pipeline-config.json         ← إعدادات Pipeline المركزية
│   ├── books/                           ← بيانات الكتب
│   │   ├── _template/                   ← قالب كتاب جديد
│   │   │   ├── lessons/
│   │   │   │   └── lesson.template.json
│   │   │   ├── queue.template.json
│   │   │   └── master.template.json
│   │   └── <bookId>/                    ← بيانات كل كتاب (انظر 3.2.3)
│   └── exports/                         ← ملفات التصدير
│
├── public/                              ← ملفات عامة (Remotion static)
│   ├── ohm-law.mp4                      ← فيديو مثال
│   ├── voiceovers/                      ← ملفات صوت TTS
│   └── timestamps/                      ← ملفات timestamps
│
└── docs/                                ← وثائق Factory
    ├── API_REFERENCE.md                 ← توثيق API
    ├── USER_GUIDE.md                    ← دليل المستخدم
    └── documentations/                  ← وثائق إضافية
```

### 12.3 نماذج قاعدة البيانات (Prisma Models)

| النموذج | الوصف | الجداول المرتبطة |
|---------|-------|-----------------|
| `AcademicYear` | المرحلة الدراسية (1/2/3 ثانوي) | Subject, User |
| `Specialization` | الشعبة (علمي رياضة / علمي علوم / أدبي) | Subject, User |
| `Subject` | المادة الدراسية | Unit, AcademicYear, Specialization |
| `Semester` | الفصل الدراسي (ترم 1/2) | Unit |
| `Unit` | الوحدة الدراسية | Lesson, Subject, Semester |
| `Lesson` | الدرس | Concept, Example, Formula, Question, Objective, Progress |
| `Concept` | مفهوم/مصطلح | Lesson |
| `Example` | مثال تطبيقي | Lesson |
| `Formula` | معادلة/قانون | Lesson |
| `Question` | سؤال (MCQ أو نصي) | Lesson |
| `Objective` | هدف تعليمي | Lesson |
| `Simulator` | محاكي تفاعلي | LessonSimulator |
| `LessonSimulator` | رابط درس-محاكي | Lesson, Simulator |
| `Progress` | تقدم الطالب | User, Lesson |
| `QuizResult` | نتيجة اختبار | User, Lesson |
| `User` | مستخدم | Progress, QuizResult, AcademicYear, Specialization |
| `Badge` | شارة/إنجاز | UserBadge |
| `UserBadge` | شارة مكتسبة | User |
| `Infographic` | إنفوجرافيك | Lesson |
| `MindMap` | خريطة ذهنية | Lesson |

---

## 13. متغيرات البيئة (Environment Variables)

### 13.1 متغيرات المشروع الرئيسي

| المتغير | القيمة الافتراضية | الوصف |
|---------|------------------|-------|
| `DATABASE_URL` | `file:./db/custom.db` | مسار قاعدة بيانات SQLite |
| `PORT` | 4000 | منفذ Student Platform |

### 13.2 متغيرات Factory Backend

| المتغير | القيمة الافتراضية | الوصف |
|---------|------------------|-------|
| `PORT` | 3001 | منفذ Factory Backend |
| `QUEUE_POLL_INTERVAL_MS` | 5000 | فترة فحص Queue (مللي ثانية) |
| `DASHBOARD_SOCKET_IO_PORT` | 3001 | منفذ Socket.io |
| `EXIT_WHEN_EMPTY` | false | خروج Worker عند انتهاء Queue |

### 13.3 متغيرات Factory Dashboard

| المتغير | القيمة الافتراضية | الوصف |
|---------|------------------|-------|
| `PORT` | 3002 | منفذ Dashboard |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | عنوان Backend API |

### 13.4 إعدادات Pipeline (pipeline-config.json)

| المسار | القيمة الافتراضية | الوصف |
|--------|------------------|-------|
| `global.project_name` | `Smart Education Factory` | اسم المشروع |
| `global.language` | `ar-EG` | اللغة الأساسية |
| `global.debug_mode` | `false` | وضع التطوير |
| `stage_1_pdf_to_image.dpi` | 150 | دقة تحويل PDF |
| `stage_1_pdf_to_image.max_size` | 512 | أقصى حجم صورة (px) |
| `stage_2_vlm_extraction.preferred_model` | `qwen2.5vl:7b` | نموذج VLM الأساسي |
| `stage_2_vlm_extraction.cooldown_seconds` | 10 | فترة الانتظار بين الصفحات |
| `stage_2_vlm_extraction.vram_limit_mb` | 7168 | حد VRAM (MB) |
| `stage_2_vlm_extraction.temperature` | 0.1 | درجة حرارة النموذج |
| `stage_2_vlm_extraction.max_tokens` | 2048 | أقصى عدد tokens لكل صفحة |
| `stage_3_merger.confidence_threshold` | 0.6 | عتبة الثقة للدمج |
| `stage_4_generator.voiceover_dialect` | `egyptian_colloquial` | لهجة السكريبت |
| `stage_4_generator.mcq_questions_count` | 5 | عدد أسئلة MCQ لكل درس |
| `stage_5_video_factory.tts.voice` | `ar-EG-SalmaNeural` | صوت TTS |
| `stage_5_video_factory.tts.rate` | `+5%` | سرعة الصوت |
| `stage_5_video_factory.remotion.concurrency` | 4 | عدد العمليات المتوازية |
| `stage_5_video_factory.remotion.fps` | 30 | إطارات في الثانية |
| `stage_5_video_factory.remotion.resolution_width` | 1920 | عرض الفيديو |
| `stage_5_video_factory.remotion.resolution_height` | 1080 | ارتفاع الفيديو |
| `stage_5_video_factory.ffmpeg.crf` | 22 | جودة الضغط (أقل = أفضل) |
| `stage_5_video_factory.ffmpeg.preset` | `fast` | سرعة الضغط |
| `stage_5_video_factory.ffmpeg.audio_bitrate` | `128k` | جودة الصوت |
| `stage_6_distribution.auto_upload` | false | رفع تلقائي لـ R2 |
| `stage_6_distribution.update_education_platform` | false | تحديث المنصة تلقائيًا |

---

## 14. سجل التغييرات (Change Log)

### v1.0.0 — يوليو 2025

**الإصدار الأولي من كتيب التشغيل والصيانة**

- توثيق كامل لعملية التركيب والتهيئة
- توثيق التشغيل اليومي لجميع الخدمات
- توثيق Pipeline استخراج المحتوى من PDF (6 مراحل)
- توثيق إنتاج الفيديو التعليمي (TTS → Remotion → FFmpeg)
- قائمة شاملة بـ API Endpoints
- دليل استكشاف الأخطاء والأداء
- هيكل ملفات المشروع بالتفصيل
- مراجع متغيرات البيئة والإعدادات

---

> **آخر تحديث**: يوليو 2025  
> **المسؤول عن الوثيقة**: فريق تطوير SmartEdu  
> **ملاحظة**: هذه الوثيقة مُخصصة للاستخدام الداخلي فقط. لأي استفسار، راجع `docs/factory/WORKFLOW.md` أو تواصل مع فريق التطوير.