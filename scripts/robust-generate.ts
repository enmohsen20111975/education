import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function main() {
  const zai = await ZAI.create();
  const curriculumPath = path.join(process.cwd(), 'public', 'data', 'curriculum.json');
  const data = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));

  // Count lessons needing content
  let lessonsProcessed = 0;
  let lessonsGenerated = 0;

  for (const year of data.academicYears) {
    for (const subject of year.Subject) {
      for (const unit of subject.Unit) {
        for (const lesson of unit.Lesson) {
          // Skip if already has content
          if (lesson.introductionAr && lesson.introductionAr.length > 50) {
            continue;
          }

          lessonsProcessed++;
          console.log(`\n[${lessonsProcessed}] 📖 ${lesson.titleAr} (${subject.nameAr})`);

          try {
            const prompt = `أنت معلم خبير في المنهج المصري. أنشئ محتوى تعليمي شامل لهذا الدرس:

العنوان: ${lesson.titleAr}
المادة: ${subject.nameAr}
الوحدة: ${unit.nameAr}

أرجع JSON فقط:
{
  "introductionAr": "مقدمة شاملة (300 كلمة)",
  "summaryAr": "ملخص الدرس",
  "objectives": ["هدف1", "هدف2", "هدف3"],
  "concepts": [{"term": "مصطلح", "definition": "تعريف"}],
  "examples": [{"question": "سؤال", "solution": "حل"}],
  "questions": [{"q": "سؤال", "options": ["أ","ب","ج","د"], "answer": "أ", "explanation": "شرح"}]
}`;

            const completion = await zai.chat.completions.create({
              messages: [
                { role: 'assistant', content: 'أنت معلم مصري خبير. أرجع JSON فقط.' },
                { role: 'user', content: prompt }
              ],
              thinking: { type: 'disabled' }
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) throw new Error('Empty response');

            // Parse JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON');
            const content = JSON.parse(jsonMatch[0]);

            // Update lesson
            lesson.introductionAr = content.introductionAr || lesson.introductionAr;
            lesson.summaryAr = content.summaryAr || lesson.summaryAr;
            lesson.Objective = (content.objectives || []).map((text: string, i: number) => ({
              id: `obj-${lesson.id}-${i}`,
              lessonId: lesson.id,
              textAr: text,
              textEn: text,
              order: i + 1
            }));
            lesson.Concept = (content.concepts || []).map((c: any, i: number) => ({
              id: `con-${lesson.id}-${i}`,
              lessonId: lesson.id,
              termAr: c.term,
              termEn: c.term,
              definitionAr: c.definition,
              definitionEn: c.definition,
              order: i + 1
            }));

            // Save after each lesson
            fs.writeFileSync(curriculumPath, JSON.stringify(data, null, 2));
            console.log(`    ✅ Saved`);
            lessonsGenerated++;

            // Wait 2 seconds between lessons
            await new Promise(r => setTimeout(r, 2000));

          } catch (error: any) {
            console.log(`    ❌ Error: ${error.message}`);
          }

          // Stop after 20 lessons per run
          if (lessonsGenerated >= 20) {
            console.log('\n📊 Batch complete! Saved 20 lessons.');
            console.log('Run again to continue...');
            return;
          }
        }
      }
    }
  }

  console.log(`\n✅ All lessons complete! Total generated: ${lessonsGenerated}`);
}

main().catch(console.error);
