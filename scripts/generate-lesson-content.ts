import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

interface LessonInput {
  id: string;
  titleAr: string;
  titleEn: string;
  subjectName: string;
  unitName: string;
  yearName: string;
}

interface GeneratedContent {
  introduction: {
    ar: string;
    en: string;
  };
  detailedExplanation: {
    ar: string;
    en: string;
  };
  keyPoints: {
    ar: string[];
    en: string[];
  };
  examples: {
    ar: { title: string; content: string; steps: string[] }[];
    en: { title: string; content: string; steps: string[] }[];
  };
  practiceQuestions: {
    ar: { question: string; options: string[]; answer: string; explanation: string }[];
    en: { question: string; options: string[]; answer: string; explanation: string }[];
  };
  summary: {
    ar: string;
    en: string;
  };
}

async function generateLessonContent(lesson: LessonInput): Promise<GeneratedContent> {
  const zai = await ZAI.create();

  const systemPrompt = `أنت معلم خبير في المنهج المصري للمرحلة الثانوية. تقوم بإنشاء محتوى تعليمي شامل ومفصل للدروس.

يجب أن يكون المحتوى:
1. شرح مفصل وواضح (500-800 كلمة على الأقل)
2. أمثلة عملية وحلول خطوة بخطوة
3. أسئلة اختبارية متعددة الخيارات مع شرح الإجابات
4. ملخص شامل للدرس

اللغة: العربية والإنجليزية لكل قسم.`;

  const userPrompt = `أنشئ محتوى تعليمي شامل لهذا الدرس:

📚 معلومات الدرس:
- العنوان بالعربي: ${lesson.titleAr}
- العنوان بالإنجليزي: ${lesson.titleEn}
- المادة: ${lesson.subjectName}
- الوحدة: ${lesson.unitName}
- الصف: ${lesson.yearName}

أرجع المحتوى بتنسيق JSON بالشكل التالي:
{
  "introduction": {
    "ar": "مقدمة شاملة للدرس (200-300 كلمة)",
    "en": "Comprehensive introduction (200-300 words)"
  },
  "detailedExplanation": {
    "ar": "شرح مفصل ومفصل للدرس (500-800 كلمة)",
    "en": "Detailed explanation (500-800 words)"
  },
  "keyPoints": {
    "ar": ["النقطة 1", "النقطة 2", "النقطة 3", ...],
    "en": ["Point 1", "Point 2", "Point 3", ...]
  },
  "examples": {
    "ar": [{"title": "عنوان", "content": "المثال", "steps": ["خطوة 1", "خطوة 2"]}],
    "en": [{"title": "Title", "content": "Example", "steps": ["Step 1", "Step 2"]}]
  },
  "practiceQuestions": {
    "ar": [{"question": "السؤال", "options": ["أ", "ب", "ج", "د"], "answer": "أ", "explanation": "الشرح"}],
    "en": [{"question": "Question", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "Explanation"}]
  },
  "summary": {
    "ar": "ملخص شامل للدرس",
    "en": "Comprehensive summary"
  }
}

أرجع JSON فقط بدون أي نص إضافي.`;

  console.log(`🤖 Generating content for: ${lesson.titleAr}`);

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'assistant', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    thinking: { type: 'disabled' }
  });

  const response = completion.choices[0]?.message?.content;

  if (!response) {
    throw new Error('Empty response from AI');
  }

  // Extract JSON from response
  let jsonStr = response;
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  try {
    return JSON.parse(jsonStr) as GeneratedContent;
  } catch (e) {
    console.error('Failed to parse JSON response');
    console.error('Response:', response.substring(0, 500));
    throw e;
  }
}

async function saveLessonContent(lessonId: string, content: GeneratedContent) {
  const lessonsDir = path.join(process.cwd(), 'data', 'lessons');
  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }

  const filePath = path.join(lessonsDir, `${lessonId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`✅ Saved: ${lessonId}.json`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const lessonId = args[0];
  const lessonTitle = args[1];
  const subjectName = args[2] || 'غير محدد';
  const unitName = args[3] || 'غير محدد';
  const yearName = args[4] || 'غير محدد';

  if (!lessonId || !lessonTitle) {
    console.error('Usage: tsx generate-lesson-content.ts <lessonId> <lessonTitle> [subjectName] [unitName] [yearName]');
    process.exit(1);
  }

  const lesson: LessonInput = {
    id: lessonId,
    titleAr: lessonTitle,
    titleEn: args[5] || lessonTitle,
    subjectName,
    unitName,
    yearName
  };

  console.log(`\n📚 Processing Lesson: ${lesson.titleAr}`);
  console.log(`   Subject: ${lesson.subjectName}`);
  console.log(`   Unit: ${lesson.unitName}`);
  console.log(`   Year: ${lesson.yearName}\n`);

  try {
    const content = await generateLessonContent(lesson);
    await saveLessonContent(lesson.id, content);
    console.log(`\n✅ Successfully generated content for: ${lesson.titleAr}`);
  } catch (error) {
    console.error(`\n❌ Failed to generate content:`, error);
    process.exit(1);
  }
}

main();
