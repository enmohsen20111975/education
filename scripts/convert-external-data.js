// Script to convert external data to markdown files
const fs = require('fs');
const path = require('path');

// Read the external data files
const grade10 = require('../content/external-grade10.ts');
const grade11 = require('../content/external-grade11.ts');
const grade12 = require('../content/external-grade12.ts');

// Actually we need to parse TypeScript, so let's use a different approach
// Read the file as text and extract data

function parseTypeScriptFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Extract the export data
  return content;
}

function convertLessonToMarkdown(lesson, unit, chapter, subject, year, term) {
  return `# ${lesson.title}

## 📚 معلومات الدرس
- **السنة الدراسية**: ${year}
- **المادة**: ${subject}
- **الترم**: ${term}
- **الوحدة**: ${unit.title}
- **الفصل**: ${chapter.title}

---

## 📝 العنوان الفرعي
${lesson.subtitle || ''}

---

## 🎯 التشبيه (القياس)
${lesson.analogy || 'لم يتم إضافة تشبيه بعد'}

---

## 💡 المفهوم الأساسي
${lesson.coreConcept || 'لم يتم إضافة المفهوم الأساسي بعد'}

---

## 📖 الشرح العميق
${(lesson.deepExplanation || []).map((exp, i) => `${i + 1}. ${exp}`).join('\n\n')}

---

## 🎮 المحاكاة
**عنوان المحاكاة**: ${lesson.infographicTitle || 'غير محدد'}
**نوع المحاكاة**: ${lesson.infographicType || 'غير محدد'}

---

## ❓ أسئلة للتدريب
${(lesson.questions || []).map((q, i) => `
### السؤال ${i + 1}: ${q.question}

**الاختيارات:**
${q.options.map((opt, j) => `${String.fromCharCode(65 + j)}) ${opt}`).join('\n')}

**الإجابة الصحيحة**: ${String.fromCharCode(65 + q.correctIndex)}

**الشرح**: ${q.explanation}

⚠️ **تحذير**: ${q.trickWarning || 'لا يوجد'}
`).join('\n---\n')}

---
*تم إنشاء هذا الدرس من البيانات الخارجية*
`;
}

console.log('Script loaded. Run manually with specific data.');
