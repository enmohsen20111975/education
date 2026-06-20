# 🗄️ توثيق قاعدة البيانات — SmartEdu v2.0

> **المستند:** تشريح جميع نماذج Prisma (25 نموذج)
> **الإصدار:** 2.0.0
> **القاعدة:** SQLite (ملف `db/custom.db`)

---

## 📐 المواصفات الفنية

```
ORM:         Prisma Client 6.11.1
Database:    SQLite (محلي — لا يحتاج خادم منفصل)
Connection:  connectionLimit = 1 (بيئة محلية)
Migrations:  db push (لا توجد ملفات migration)
Seed:        npx tsx prisma/seed.ts
```

---

## 🗂️ تصنيف النماذج

### القسم الأول: المنصة التعليمية (15 نموذج)

| النموذج | الوظيفة | السجلات التقريبية |
|--------|---------|------------------|
| AcademicYear | السنوات الدراسية | 3 |
| Specialization | التخصصات | 3 |
| Subject | المواد الدراسية | 74 |
| Semester | الفصول الدراسية | 2 |
| Unit | الوحدات الدراسية | 242 |
| Lesson | الدروس | 1,152 |
| Concept | المفاهيم الأساسية | 4,108 |
| Formula | القوانين والمعادلات | 774 |
| Example | الأمثلة المحلولة | 556 |
| Question | الأسئلة | 1,768 |
| Objective | الأهداف التعليمية | 5,240 |
| Simulator | المحاكيات التفاعلية | 106 |
| LessonSimulator | ربط دروس بمحاكيات | ~300 |
| Progress | تقدم الطلاب | dynamic |
| QuizResult | نتائج الاختبارات | dynamic |

### القسم الثاني: نظام المصنع (10 نماذج)

| النموذج | الوظيفة |
|--------|---------|
| Book | الكتب المرفوعة |
| BookPage | صفحات الكتب + نص OCR |
| ExtractedUnit | الوحدات المنظمة |
| ExtractedLesson | الدروس المنظمة + المحتوى |
| GeneratedVideo | سكربتات الفيديو |
| GeneratedSummary | الملخصات المُولّدة |
| ExamTemplate | قوالب الامتحانات |
| LearningMaterial | المواد المساعدة |

### القسم الثالث: إدارة المستخدمين (3 نماذج)

| النموذج | الوظيفة |
|--------|---------|
| User | المستخدمين |
| Badge | الشارات والإنجازات |
| UserBadge | ربط المستخدمين بالشارات |

---

## 🔍 تشريح النماذج — تفصيل كامل

---

### 🏫 AcademicYear — السنة الدراسية

```
┌─────────────────────────────────────┐
│           AcademicYear               │
├─────────────────────────────────────┤
│ id          String   @id @unique     │
│ nameAr      String   "الصف الأول"    │
│ nameEn      String   "First Year"     │
│ code        String   "first-year"     │
│ order       Int      1               │
│ createdAt   DateTime                 │
│ updatedAt   DateTime                 │
├─────────────────────────────────────┤
│ Relations:                           │
│   → Subject[]                        │
│   → User[]                           │
└─────────────────────────────────────┘
```

**البيانات المُخزّنة:**
| code | nameAr | nameEn |
|------|--------|--------|
| first-year | الصف الأول الثانوي | First Year Secondary |
| second-year | الصف الثاني الثانوي | Second Year Secondary |
| third-year | الصف الثالث الثانوي | Third Year Secondary |

---

### 🎓 Specialization — التخصص

```
┌─────────────────────────────────────┐
│          Specialization              │
├─────────────────────────────────────┤
│ id            String   @id          │
│ nameAr        String   "علمي علوم"  │
│ nameEn        String   "Science"    │
│ code          String   "science"    │
│ descriptionAr String?               │
│ descriptionEn String?               │
│ order         Int      1            │
├─────────────────────────────────────┤
│ Relations:                           │
│   → Subject[]                        │
│   → User[]                           │
└─────────────────────────────────────┘
```

**البيانات المُخزّنة:**
| code | nameAr |
|------|--------|
| science | علمي علوم |
| math | علمي رياضة |
| arts | أدبي |

---

### 📖 Subject — المادة الدراسية

```
┌─────────────────────────────────────┐
│             Subject                 │
├─────────────────────────────────────┤
│ id               String  @id         │
│ nameAr           String              │
│ nameEn           String              │
│ slug             String  @unique      │
│ icon             String  "Atom"       │
│ color            String  "#8B5CF6"    │
│ order            Int     1            │
│ yearId           String?  → AcademicYear│
│ specializationId String?  → Specialization│
│ isCommon         Boolean  false       │
├─────────────────────────────────────┤
│ Relations:                           │
│   → Unit[]                           │
│   → AcademicYear?                    │
│   → Specialization?                  │
└─────────────────────────────────────┘
```

**ملاحظات:**
- `isCommon = true`: المادة مشتركة بين كل التخصصات (عربي، إنجليزي)
- `yearId` مطلوب دائماً، `specializationId` اختياري
- `slug` يُستخدم في URLs

---

### 📚 Unit — الوحدة الدراسية

```
┌─────────────────────────────────────┐
│              Unit                   │
├─────────────────────────────────────┤
│ id         String  @id               │
│ subjectId  String  → Subject         │
│ semesterId String? → Semester        │
│ nameAr     String                    │
│ nameEn     String                    │
│ slug       String  @unique           │
│ order      Int     1                 │
├─────────────────────────────────────┤
│ Relations:                           │
│   → Lesson[]                         │
│   → Subject                          │
│   → Semester?                        │
└─────────────────────────────────────┘
```

---

### 📝 Lesson — الدرس

```
┌─────────────────────────────────────┐
│            Lesson                  │
├─────────────────────────────────────┤
│ id              String   @id          │
│ unitId          String   → Unit      │
│ titleAr         String              │
│ titleEn         String              │
│ slug            String   @unique      │
│ descriptionAr   String              │
│ descriptionEn   String              │
│ duration        Int      45         │
│ order           Int      1           │
│ isFree          Boolean  false      │
│ videoUrl        String?              │
│ pdfUrl          String?              │
│ thumbnailUrl    String?              │
│ introductionAr  String              │
│ introductionEn  String              │
│ summaryAr       String              │
│ summaryEn       String              │
├─────────────────────────────────────┤
│ Relations:                           │
│   → Concept[]                        │
│   → Example[]                        │
│   → Formula[]                        │
│   → Objective[]                      │
│   → Question[]                       │
│   → LessonSimulator[]                │
│   → Progress[]                       │
│   → QuizResult[]                     │
│   → Unit                             │
└─────────────────────────────────────┘
```

**هذا النموذج هو المحور المركزي للمنصة — يرتبط بـ 8 علاقات.**

---

### 💡 Concept — المفهوم الأساسي

```
┌─────────────────────────────────────┐
│            Concept                  │
├─────────────────────────────────────┤
│ id            String  @id            │
│ lessonId      String  → Lesson       │
│ termAr        String  "الكتلة"      │
│ termEn        String  "Mass"        │
│ definitionAr  String               │
│ definitionEn  String               │
│ order         Int     1             │
└─────────────────────────────────────┘
```

### 📐 Formula — القانون / المعادلة

```
┌─────────────────────────────────────┐
│            Formula                  │
├─────────────────────────────────────┤
│ id             String  @id         │
│ lessonId       String  → Lesson      │
│ formula        String  "F = ma"     │
│ explanationAr  String              │
│ explanationEn  String              │
│ order          Int     1             │
└─────────────────────────────────────┘
```

### ✏️ Example — المثال المحلول

```
┌─────────────────────────────────────┐
│            Example                  │
├─────────────────────────────────────┤
│ id         String  @id              │
│ lessonId   String  → Lesson         │
│ questionAr String                   │
│ questionEn String                   │
│ solutionAr String                   │
│ solutionEn String                   │
│ stepsAr    String                   │
│ stepsEn    String                   │
│ order      Int     1                 │
└─────────────────────────────────────┘
```

### ❓ Question — السؤال

```
┌─────────────────────────────────────┐
│            Question                 │
├─────────────────────────────────────┤
│ id            String  @id            │
│ lessonId      String  → Lesson       │
│ type          String  "mcq"         │
│ questionAr    String               │
│ questionEn    String               │
│ optionsAr     String? (JSON array) │
│ optionsEn     String? (JSON array) │
│ answer        String               │
│ explanationAr String?              │
│ explanationEn String?              │
│ points        Int     1             │
│ difficulty    String  "medium"      │
│ order         Int     1             │
└─────────────────────────────────────┘
```

**أنواع الأسئلة:** `mcq` | `true_false` | `fill_blank` | `essay`

### 🎯 Objective — الهدف التعليمي

```
┌─────────────────────────────────────┐
│           Objective                 │
├─────────────────────────────────────┤
│ id       String  @id                │
│ lessonId String  → Lesson           │
│ textAr   String  "أن يفهم الطالب..." │
│ textEn   String  "The student should..."│
│ order    Int     1                  │
└─────────────────────────────────────┘
```

---

## 🏭 نماذج المصنع — Book Extraction System

---

### 📕 Book — الكتاب

```
┌─────────────────────────────────────┐
│             Book                   │
├─────────────────────────────────────┤
│ id          String     @id          │
│ title       String                  │
│ fileName    String                  │
│ filePath    String                  │
│ fileSize    Int        0            │
│ totalPages  Int        0            │
│ language    String     "ar"         │
│ status      String     "uploaded"   │
│ progress    Int        0            │
│ error       String?                 │
├─────────────────────────────────────┤
│ Relations:                           │
│   → BookPage[]                       │
│   → ExtractedUnit[]                  │
├─────────────────────────────────────┤
│ Lifecycle:                           │
│   uploaded → extracting → extracted  │
│   → processing → completed | error   │
└─────────────────────────────────────┘
```

**دورة حياة الكتاب:**
```
uploaded ──→ extracting ──→ extracted ──→ processing ──→ completed
               │                            │
               └──→ error ←────────────────┘
```

### 📄 BookPage — صفحة الكتاب

```
┌─────────────────────────────────────┐
│           BookPage                  │
├─────────────────────────────────────┤
│ id         String  @id              │
│ bookId     String  → Book           │
│ pageNumber Int                      │
│ ocrText    String  ""               │
│ status     String  "pending"       │
├─────────────────────────────────────┤
│ Constraints:                         │
│   @@unique([bookId, pageNumber])    │
│ Lifecycle:                           │
│   pending → processing → done | error│
└─────────────────────────────────────┘
```

### 📦 ExtractedUnit — الوحدة المستخرجة

```
┌─────────────────────────────────────┐
│        ExtractedUnit                │
├─────────────────────────────────────┤
│ id          String     @id          │
│ bookId      String     → Book       │
│ unitNumber  Int                     │
│ titleAr     String                  │
│ titleEn     String                  │
│ description String     ""           │
│ order       Int        1            │
├─────────────────────────────────────┤
│ Relations:                           │
│   → Book                             │
│   → ExtractedLesson[]                │
└─────────────────────────────────────┘
```

### 📋 ExtractedLesson — الدرس المستخرج

```
┌─────────────────────────────────────┐
│       ExtractedLesson               │
├─────────────────────────────────────┤
│ id            String     @id        │
│ unitId        String     → ExtractedUnit│
│ lessonNumber  Int                   │
│ titleAr       String                │
│ titleEn       String                │
│ content       String     ""         │
│ summary       String     ""         │
│ keyPoints     String     "[]"       │
│ order         Int        1           │
│ status        String     "draft"    │
├─────────────────────────────────────┤
│ Relations:                           │
│   → ExtractedUnit                    │
│   → GeneratedVideo[]                 │
│   → GeneratedSummary[]               │
│   → ExamTemplate[]                   │
│   → LearningMaterial[]               │
├─────────────────────────────────────┤
│ ملاحظة: keyPoints مخزّن كـ JSON    │
│   مثال: '["نقطة 1","نقطة 2","نقطة 3"]'│
└─────────────────────────────────────┘
```

**هذا النموذج هو المحور المركزي للمصنع — يرتبط بـ 5 علاقات.**

---

## 🎬 نماذج توليد المحتوى — Content Generation

---

### 🎥 GeneratedVideo — الفيديو المُولّد

```
┌─────────────────────────────────────┐
│        GeneratedVideo               │
├─────────────────────────────────────┤
│ id          String   @id            │
│ lessonId    String   → ExtractedLesson│
│ title       String                  │
│ script      String   ""             │
│ scriptStyle String   "explanatory"  │
│ duration    Int      0              │
│ ttsEngine   String   "edge-tts"     │
│ ttsVoice    String   "ar-EG-Hoda"   │
│ status      String   "draft"        │
│ audioUrl    String?                 │
│ videoUrl    String?                 │
│ error       String?                 │
├─────────────────────────────────────┤
│ Styles: explanatory|storytelling|exam_review│
│ Status: draft→generating_script→generating_audio│
│         →assembling→ready|error     │
└─────────────────────────────────────┘
```

### 📝 GeneratedSummary — الملخص

```
┌─────────────────────────────────────┐
│       GeneratedSummary              │
├─────────────────────────────────────┤
│ id          String   @id            │
│ lessonId    String   → ExtractedLesson│
│ type        String   "summary"      │
│ title       String                  │
│ content     String   ""             │
│ format      String   "markdown"     │
│ wordCount   Int      0              │
├─────────────────────────────────────┤
│ Types: summary|notes|key_concepts|study_guide│
│ Format: markdown|plain_text|structured│
└─────────────────────────────────────┘
```

### 📋 ExamTemplate — قالب الامتحان

```
┌─────────────────────────────────────┐
│        ExamTemplate                │
├─────────────────────────────────────┤
│ id          String   @id            │
│ lessonId    String   → ExtractedLesson│
│ title       String                  │
│ examType    String   "quiz"         │
│ difficulty  String   "medium"      │
│ duration    Int      30             │
│ totalMarks  Int      20             │
│ questions   String   "[]" (JSON)    │
│ answerKey   String   "[]" (JSON)    │
│ status      String   "draft"        │
├─────────────────────────────────────┤
│ Types: quiz|midterm|final|practice   │
│ Difficulty: easy|medium|hard|mixed   │
│ Status: draft|reviewed|approved      │
└─────────────────────────────────────┘
```

### 🧠 LearningMaterial — المادة التعليمية

```
┌─────────────────────────────────────┐
│      LearningMaterial               │
├─────────────────────────────────────┤
│ id          String   @id            │
│ lessonId    String   → ExtractedLesson│
│ type        String   "mindmap"      │
│ title       String                  │
│ description String   ""             │
│ data        String   "" (JSON)      │
│ imageUrl    String?                 │
│ status      String   "draft"        │
├─────────────────────────────────────┤
│ Types: mindmap|infographic|diagram| │
│        flashcards|formula_sheet     │
│ Status: draft|reviewed|approved      │
└─────────────────────────────────────┘
```

---

## 👤 نماذج المستخدمين

### User — المستخدم

```
┌─────────────────────────────────────┐
│             User                   │
├─────────────────────────────────────┤
│ id               String   @id        │
│ email            String   @unique     │
│ name             String              │
│ password         String?             │
│ role             String   "student"   │
│ yearId           String?  → AcademicYear│
│ specializationId String?  → Specialization│
│ isSubscribed     Boolean  false      │
│ points           Int      0          │
│ level            String   "beginner" │
├─────────────────────────────────────┤
│ Relations:                           │
│   → Progress[]                       │
│   → QuizResult[]                     │
│   → UserBadge[]                      │
│   → AcademicYear?                    │
│   → Specialization?                  │
└─────────────────────────────────────┘
```

### Badge — الشارة

```
┌─────────────────────────────────────┐
│             Badge                   │
├─────────────────────────────────────┤
│ id            String   @id           │
│ slug          String   @unique       │
│ nameAr        String                 │
│ nameEn        String                 │
│ descriptionAr String                │
│ descriptionEn String                │
│ icon          String                 │
│ color         String                 │
│ requirement   Int                    │
│ type          String                 │
└─────────────────────────────────────┘
```

### UserBadge — ربط المستخدم بالشارة

```
┌─────────────────────────────────────┐
│           UserBadge                 │
├─────────────────────────────────────┤
│ id        String   @id              │
│ userId    String   → User           │
│ badgeSlug String                    │
│ earnedAt  DateTime                 │
├─────────────────────────────────────┤
│ Constraints:                         │
│   @@unique([userId, badgeSlug])      │
└─────────────────────────────────────┘
```

---

## 📊 ملخص العلاقات

### الخريطة العلائقية الكاملة

```
AcademicYear ──(1:N)──→ Subject
Specialization ──(1:N)──→ Subject
Subject ──(1:N)──→ Unit
Semester ──(1:N)──→ Unit
Unit ──(1:N)──→ Lesson
Lesson ──(1:N)──→ Concept
Lesson ──(1:N)──→ Formula
Lesson ──(1:N)──→ Example
Lesson ──(1:N)──→ Objective
Lesson ──(1:N)──→ Question
Lesson ──(1:N)──→ Progress ←──(N:1)── User
Lesson ──(1:N)──→ QuizResult ←──(N:1)── User
Lesson ──(M:N)──→ Simulator ←── LessonSimulator
User ──(1:N)──→ UserBadge ←──(N:1)── Badge

Book ──(1:N)──→ BookPage
Book ──(1:N)──→ ExtractedUnit
ExtractedUnit ──(1:N)──→ ExtractedLesson
ExtractedLesson ──(1:N)──→ GeneratedVideo
ExtractedLesson ──(1:N)──→ GeneratedSummary
ExtractedLesson ──(1:N)──→ ExamTemplate
ExtractedLesson ──(1:N)──→ LearningMaterial
```

---

## 🔢 إحصائيات الحجم التقديري

| النموذج | سجلات | متوسط حجم السجل | إجمالي تقديري |
|--------|-------|-----------------|---------------|
| AcademicYear | 3 | 200 B | 0.6 KB |
| Subject | 74 | 500 B | 37 KB |
| Unit | 242 | 300 B | 73 KB |
| Lesson | 1,152 | 2 KB | 2.3 MB |
| Concept | 4,108 | 500 B | 2.0 MB |
| Formula | 774 | 400 B | 310 KB |
| Example | 556 | 1 KB | 560 KB |
| Question | 1,768 | 800 B | 1.4 MB |
| Objective | 5,240 | 300 B | 1.6 MB |
| **الإجمالي** | **~14,000** | — | **~8.6 MB** |

---

*آخر تحديث: يونيو 2025*
