import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

interface Lesson {
  id: string;
  titleAr: string;
  titleEn: string;
  unitId: string;
  introductionAr: string;
  introductionEn: string;
  summaryAr: string;
  summaryEn: string;
  Objective: any[];
  Concept: any[];
  Formula: any[];
  Example: any[];
  Question: any[];
}

interface Unit {
  id: string;
  nameAr: string;
  nameEn: string;
  Lesson: Lesson[];
}

interface Subject {
  id: string;
  nameAr: string;
  nameEn: string;
  Unit: Unit[];
}

interface AcademicYear {
  id: string;
  nameAr: string;
  nameEn: string;
  Subject: Subject[];
}

interface GeneratedContent {
  introduction: { ar: string; en: string };
  detailedExplanation: { ar: string; en: string };
  keyPoints: { ar: string[]; en: string[] };
  examples: { ar: { title: string; content: string; steps: string[] }[]; en: { title: string; content: string; steps: string[] }[] };
  practiceQuestions: { ar: { question: string; options: string[]; answer: string; explanation: string }[]; en: { question: string; options: string[]; answer: string; explanation: string }[] };
  summary: { ar: string; en: string };
}

// Load curriculum
function loadCurriculum() {
  const curriculumPath = path.join(process.cwd(), 'public', 'data', 'curriculum.json');
  const content = fs.readFileSync(curriculumPath, 'utf-8');
  return JSON.parse(content);
}

// Save curriculum
function saveCurriculum(data: any) {
  const curriculumPath = path.join(process.cwd(), 'public', 'data', 'curriculum.json');
  fs.writeFileSync(curriculumPath, JSON.stringify(data, null, 2));
}

// Sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate content for a single lesson with retry logic
async function generateContent(
  zai: any,
  lesson: Lesson,
  subjectName: string,
  unitName: string,
  yearName: string,
  maxRetries: number = 5
): Promise<GeneratedContent | null> {
  const systemPrompt = `أنت معلم خبير في المنهج المصري للمرحلة الثانوية. تقوم بإنشاء محتوى تعليمي شامل ومفصل للدروس.

يجب أن يكون المحتوى:
1. شرح مفصل وواضح (500-800 كلمة على الأقل)
2. أمثلة عملية وحلول خطوة بخطوة
3. أسئلة اختبارية متعددة الخيارات مع شرح الإجابات
4. ملخص شامل للدرس

اللغة: العربية والإنجليزية لكل قسم.

أرجع JSON فقط بدون أي نص إضافي.`;

  const userPrompt = `أنشئ محتوى تعليمي شامل لهذا الدرس:

📚 معلومات الدرس:
- العنوان بالعربي: ${lesson.titleAr}
- العنوان بالإنجليزي: ${lesson.titleEn}
- المادة: ${subjectName}
- الوحدة: ${unitName}
- الصف: ${yearName}

أرجع المحتوى بتنسيق JSON بالشكل التالي:
{
  "introduction": {
    "ar": "مقدمة شاملة للدرس (200-300 كلمة)",
    "en": "Comprehensive introduction (200-300 words)"
  },
  "detailedExplanation": {
    "ar": "شرح مفصل للدرس (500-800 كلمة)",
    "en": "Detailed explanation (500-800 words)"
  },
  "keyPoints": {
    "ar": ["النقطة 1", "النقطة 2", "النقطة 3", "النقطة 4"],
    "en": ["Point 1", "Point 2", "Point 3", "Point 4"]
  },
  "examples": {
    "ar": [{"title": "عنوان المثال", "content": "محتوى المثال", "steps": ["خطوة 1", "خطوة 2"]}],
    "en": [{"title": "Example title", "content": "Example content", "steps": ["Step 1", "Step 2"]}]
  },
  "practiceQuestions": {
    "ar": [{"question": "السؤال", "options": ["أ", "ب", "ج", "د"], "answer": "أ", "explanation": "شرح الإجابة"}],
    "en": [{"question": "Question", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "Answer explanation"}]
  },
  "summary": {
    "ar": "ملخص شامل للدرس",
    "en": "Comprehensive summary"
  }
}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        thinking: { type: 'disabled' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('Empty response');

      // Extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');

      return JSON.parse(jsonMatch[0]) as GeneratedContent;
    } catch (error: any) {
      const isRateLimit = error.message?.includes('429');
      const waitTime = isRateLimit ? 60000 * attempt : 5000 * attempt; // 1 min * attempt for rate limit, 5 sec * attempt otherwise

      console.log(`    ⚠️  Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`    ⏳ Waiting ${waitTime / 1000} seconds before retry...`);
        await sleep(waitTime);
      }
    }
  }

  return null;
}

// Main batch processor
async function main() {
  const args = process.argv.slice(2);
  const maxCount = parseInt(args[0]) || 10;
  const startIndex = parseInt(args[1]) || 0; // Start from specific index

  console.log('\n🚀 Starting content generation for lessons WITHOUT content...\n');

  // Initialize ZAI
  const zai = await ZAI.create();

  // Load curriculum
  const curriculum = loadCurriculum();
  const academicYears = curriculum.academicYears as AcademicYear[];

  // Collect all lessons WITHOUT content
  interface LessonWithContext extends Lesson {
    subjectName: string;
    unitName: string;
    yearName: string;
    subjectId: string;
  }

  const lessonsWithoutContent: LessonWithContext[] = [];

  for (const year of academicYears) {
    for (const subject of year.Subject) {
      for (const unit of subject.Unit) {
        for (const lesson of unit.Lesson) {
          const hasContent = lesson.introductionAr && lesson.introductionAr.length > 100;
          if (!hasContent) {
            lessonsWithoutContent.push({
              ...lesson,
              subjectName: subject.nameAr,
              unitName: unit.nameAr,
              yearName: year.nameAr,
              subjectId: subject.id
            });
          }
        }
      }
    }
  }

  console.log(`📚 Total lessons without content: ${lessonsWithoutContent.length}`);
  console.log(`📝 Starting from index ${startIndex}, processing up to ${maxCount} lessons...\n`);

  let processed = 0;
  let failed = 0;
  const toProcess = lessonsWithoutContent.slice(startIndex, startIndex + maxCount);

  for (let i = 0; i < toProcess.length; i++) {
    const lesson = toProcess[i];
    const globalIndex = startIndex + i + 1;
    const total = lessonsWithoutContent.length;

    console.log(`\n[${globalIndex}/${total}] 📖 ${lesson.titleAr}`);
    console.log(`    Subject: ${lesson.subjectName}`);
    console.log(`    Unit: ${lesson.unitName}`);

    console.log(`    🤖 Generating content...`);
    const content = await generateContent(
      zai,
      lesson,
      lesson.subjectName,
      lesson.unitName,
      lesson.yearName,
      5 // max retries
    );

    if (!content) {
      console.log(`    ❌ Failed after all retries`);
      failed++;
      continue;
    }

    // Update lesson in curriculum
    for (const year of academicYears) {
      for (const subject of year.Subject) {
        if (subject.id !== lesson.subjectId) continue;

        for (const unit of subject.Unit) {
          const lessonIndex = unit.Lesson.findIndex(l => l.id === lesson.id);
          if (lessonIndex === -1) continue;

          // Update the lesson
          unit.Lesson[lessonIndex] = {
            ...unit.Lesson[lessonIndex],
            introductionAr: content.introduction.ar,
            introductionEn: content.introduction.en,
            summaryAr: content.summary.ar,
            summaryEn: content.summary.en,
            Objective: content.keyPoints.ar.map((text, i) => ({
              id: `obj-${lesson.id}-${i}`,
              lessonId: lesson.id,
              textAr: text,
              textEn: content.keyPoints.en[i] || text,
              order: i + 1
            })),
            Concept: content.keyPoints.ar.slice(0, 3).map((text, i) => ({
              id: `concept-${lesson.id}-${i}`,
              lessonId: lesson.id,
              termAr: text.split('،')[0] || text.substring(0, 50),
              termEn: content.keyPoints.en[i]?.split(',')[0] || text.substring(0, 50),
              definitionAr: text,
              definitionEn: content.keyPoints.en[i] || text,
              order: i + 1
            })),
            Example: content.examples.ar.map((ex, i) => ({
              id: `example-${lesson.id}-${i}`,
              lessonId: lesson.id,
              questionAr: ex.title + ': ' + ex.content,
              questionEn: content.examples.en[i]?.title + ': ' + content.examples.en[i]?.content || ex.title,
              solutionAr: ex.steps.join('\n'),
              solutionEn: content.examples.en[i]?.steps.join('\n') || ex.steps.join('\n'),
              stepsAr: ex.steps.join('\n'),
              stepsEn: content.examples.en[i]?.steps.join('\n') || ex.steps.join('\n'),
              order: i + 1
            })),
            Question: content.practiceQuestions.ar.map((q, i) => ({
              id: `q-${lesson.id}-${i}`,
              lessonId: lesson.id,
              type: 'multiple-choice',
              questionAr: q.question,
              questionEn: content.practiceQuestions.en[i]?.question || q.question,
              optionsAr: JSON.stringify(q.options),
              optionsEn: JSON.stringify(content.practiceQuestions.en[i]?.options || q.options),
              answer: q.answer,
              explanationAr: q.explanation,
              explanationEn: content.practiceQuestions.en[i]?.explanation || q.explanation,
              points: 1,
              difficulty: 'medium',
              order: i + 1
            }))
          };
        }
      }
    }

    // Save after each lesson
    saveCurriculum(curriculum);
    console.log(`    ✅ Content generated and saved!`);
    processed++;

    // Wait between successful requests to avoid rate limiting
    if (i < toProcess.length - 1) {
      console.log(`    ⏳ Waiting 10 seconds...`);
      await sleep(10000);
    }
  }

  console.log('\n\n📊 Summary:');
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📚 Next start index: ${startIndex + processed}`);
  console.log(`   📚 Lessons remaining without content: ${lessonsWithoutContent.length - startIndex - processed}\n`);
}

main();
