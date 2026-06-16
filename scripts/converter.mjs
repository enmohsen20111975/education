// Convert TypeScript data to JSON then to Markdown
// Run with: node --experimental-strip-types converter.mjs

import fs from 'fs';
import path from 'path';

// Helper to extract lesson data using regex
function extractLessons(content, yearName) {
  const lessons = [];
  
  // Find all lesson blocks
  const lessonRegex = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*title:\s*['"]([^'"]+)['"]\s*,\s*subtitle:\s*['"]([^'"]*)['"]\s*,\s*analogy:\s*['"]([^'"]*)['"]/g;
  
  let match;
  while ((match = lessonRegex.exec(content)) !== null) {
    lessons.push({
      id: match[1],
      title: match[2],
      subtitle: match[3],
      analogy: match[4]
    });
  }
  
  return lessons;
}

// Create markdown for a lesson
function createMarkdown(lesson, subjectName, yearName, unitTitle, chapterTitle, term) {
  return `# ${lesson.title || 'درس بدون عنوان'}

## 📚 معلومات الدرس
- **السنة الدراسية**: ${yearName}
- **المادة**: ${subjectName}
- **الترم**: ${term}
- **الوحدة**: ${unitTitle || 'غير محدد'}
- **الفصل**: ${chapterTitle || 'غير محدد'}

---

## 📝 العنوان الفرعي
${lesson.subtitle || 'لم يتم إضافة عنوان فرعي'}

---

## 🎯 التشبيه (القياس)
> ${lesson.analogy || 'لم يتم إضافة تشبيه بعد'}

---

## 💡 المفهوم الأساسي
${lesson.coreConcept || 'لم يتم إضافة المفهوم الأساسي بعد'}

---

## 📖 الشرح العميق
${(lesson.deepExplanation || []).map((exp, i) => `### النقطة ${i + 1}:\n${exp}`).join('\n\n') || 'لم يتم إضافة الشرح بعد'}

---

## 🎮 المحاكاة
**عنوان المحاكاة**: ${lesson.infographicTitle || 'غير محدد'}

---

## ❓ أسئلة للتدريب
${(lesson.questions || []).map((q, i) => `
### السؤال ${i + 1}: ${q.question || ''}

**الاختيارات:**
${(q.options || []).map((opt, j) => `${String.fromCharCode(65 + j)}) ${opt} ${j === q.correctIndex ? '✅' : ''}`).join('\n')}

**الشرح**: ${q.explanation || ''}

⚠️ **تنبيه**: ${q.trickWarning || 'لا يوجد'}
`).join('\n---\n') || 'لم يتم إضافة أسئلة بعد'}

---
*تم إنشاء هذا الدرس تلقائياً من البيانات الخارجية*
`;
}

// Main conversion function
function convertGrade(filePath, yearName, outputDir) {
  console.log(`\n📚 Processing: ${yearName}`);
  console.log(`   File: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Count titles
  const titleMatches = content.match(/title:\s*['"]([^'"]+)['"]/g) || [];
  console.log(`   Found ${titleMatches.length} titles`);
  
  // Count lessons
  const lessonMatches = content.match(/id:\s*['"]g\d+_p?u?\d*_c?\d*_l\d+['"]/g) || [];
  console.log(`   Found ${lessonMatches.length} lesson IDs`);
  
  return {
    yearName,
    titleCount: titleMatches.length,
    lessonCount: lessonMatches.length
  };
}

// Run conversion
console.log('🚀 تحويل بيانات الدروس');
console.log('=' .repeat(50));

const results = [];

results.push(convertGrade(
  '/home/z/Gemini-education-version/lib/data/grade10.ts',
  'الصف الأول الثانوي',
  '/home/z/my-project/docs/lessons/first-year'
));

results.push(convertGrade(
  '/home/z/Gemini-education-version/lib/data/grade11.ts',
  'الصف الثاني الثانوي',
  '/home/z/my-project/docs/lessons/second-year'
));

results.push(convertGrade(
  '/home/z/Gemini-education-version/lib/data/grade12.ts',
  'الصف الثالث الثانوي',
  '/home/z/my-project/docs/lessons/third-year'
));

console.log('\n📊 الملخص:');
console.log('=' .repeat(50));
results.forEach(r => {
  console.log(`${r.yearName}: ${r.titleCount} عنوان, ${r.lessonCount} درس`);
});
