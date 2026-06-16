// Full converter: TypeScript data -> Markdown files
import fs from 'fs';
import path from 'path';

const BASE_DIR = '/home/z/my-project/docs/lessons';

// Extract all lesson data from a TypeScript file
function parseGradeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = {
    subjects: [],
    lessons: []
  };

  // Current parsing context
  let currentSubject = null;
  let currentUnit = null;
  let currentChapter = null;
  let currentTerm = 'term-1';

  // Split content into lines for easier parsing
  const lines = content.split('\n');

  let inLesson = false;
  let lessonData = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect subject
    if (line.includes("id: 'g10_") && !line.includes('_u') && !line.includes('_c') && !line.includes('_l')) {
      const match = line.match(/id: '([^']+)'/);
      if (match) {
        const nameMatch = lines[i + 1]?.match(/name: '([^']+)'/);
        currentSubject = {
          id: match[1],
          name: nameMatch ? nameMatch[1] : '',
          term1Units: [],
          term2Units: []
        };
        data.subjects.push(currentSubject);
      }
    }

    // Detect term1Units or term2Units
    if (line.includes('term1Units:')) currentTerm = 'term-1';
    if (line.includes('term2Units:')) currentTerm = 'term-2';

    // Detect lesson start
    if (line.includes("id: '") && line.includes("_l") && !inLesson) {
      inLesson = true;
      lessonData = { term: currentTerm };
      const match = line.match(/id: '([^']+)'/);
      if (match) lessonData.id = match[1];
    }

    // Extract lesson fields
    if (inLesson) {
      if (line.includes("title: '")) {
        const match = line.match(/title: '([^']+)'/);
        if (match) lessonData.title = match[1];
      }
      if (line.includes("subtitle: '")) {
        const match = line.match(/subtitle: '([^']+)'/);
        if (match) lessonData.subtitle = match[1];
      }
      if (line.includes("analogy: '")) {
        const match = line.match(/analogy: '([^']+)'/);
        if (match) lessonData.analogy = match[1];
      }
      if (line.includes("coreConcept: '")) {
        const match = line.match(/coreConcept: '([^']+)'/);
        if (match) lessonData.coreConcept = match[1];
      }
      if (line.includes("infographicTitle: '")) {
        const match = line.match(/infographicTitle: '([^']+)'/);
        if (match) lessonData.infographicTitle = match[1];
      }
      if (line.includes('deepExplanation: [') || line.includes('deepExplanation:[')) {
        // Extract array items
        const explanations = [];
        let j = i + 1;
        while (j < lines.length && !lines[j].includes('],')) {
          const expMatch = lines[j].match(/'([^']+)'/);
          if (expMatch) explanations.push(expMatch[1]);
          j++;
        }
        lessonData.deepExplanation = explanations;
      }
      if (line.includes('questions: [') || line.includes('questions:[')) {
        // End of lesson
        inLesson = false;
        if (currentSubject && lessonData.title) {
          lessonData.subjectId = currentSubject.id;
          lessonData.subjectName = currentSubject.name;
          data.lessons.push(lessonData);
        }
        lessonData = {};
      }
    }
  }

  return data;
}

// Create markdown content
function createMarkdown(lesson) {
  return `# ${lesson.title || 'درس بدون عنوان'}

## 📚 معلومات الدرس
- **المادة**: ${lesson.subjectName || 'غير محدد'}
- **الترم**: ${lesson.term === 'term-1' ? 'الترم الأول' : 'الترم الثاني'}

---

## 📝 العنوان الفرعي
${lesson.subtitle || ''}

---

## 🎯 التشبيه (القياس بالعامية)
> ${lesson.analogy || 'لم يتم إضافة تشبيه بعد'}

---

## 💡 المفهوم الأساسي
${lesson.coreConcept || 'لم يتم إضافة المفهوم الأساسي بعد'}

---

## 📖 الشرح العميق
${(lesson.deepExplanation || []).map((exp, i) => `### النقطة ${i + 1}:
${exp}`).join('\n\n')}

---

## 🎮 المحاكاة
**عنوان المحاكاة**: ${lesson.infographicTitle || 'غير محدد'}

---

*تم إنشاء هذا الدرس من البيانات الخارجية*
`;
}

// Main conversion
console.log('🚀 تحويل البيانات إلى ملفات Markdown\n');

// Parse grade 10
console.log('📚 الصف الأول الثانوي...');
const grade10Data = parseGradeFile('/home/z/Gemini-education-version/lib/data/grade10.ts');
console.log(`   Found ${grade10Data.lessons.length} lessons`);
console.log(`   Subjects: ${grade10Data.subjects.map(s => s.name).join(', ')}`);

// Parse grade 11
console.log('\n📚 الصف الثاني الثانوي...');
const grade11Data = parseGradeFile('/home/z/Gemini-education-version/lib/data/grade11.ts');
console.log(`   Found ${grade11Data.lessons.length} lessons`);
console.log(`   Subjects: ${grade11Data.subjects.map(s => s.name).join(', ')}`);

// Parse grade 12
console.log('\n📚 الصف الثالث الثانوي...');
const grade12Data = parseGradeFile('/home/z/Gemini-education-version/lib/data/grade12.ts');
console.log(`   Found ${grade12Data.lessons.length} lessons`);
console.log(`   Subjects: ${grade12Data.subjects.map(s => s.name).join(', ')}`);

// Create markdown files for grade 10
console.log('\n📝 إنشاء ملفات Markdown...');
let created = 0;

for (const lesson of grade10Data.lessons) {
  const subjectDir = `${BASE_DIR}/first-year/${lesson.term}`;
  const fileName = lesson.subjectName?.replace(/\s+/g, '_') || 'unknown';
  const filePath = `${subjectDir}/${fileName}.md`;

  // Append to existing file or create new
  const mdContent = createMarkdown(lesson);

  if (fs.existsSync(filePath)) {
    // Append to existing file
    fs.appendFileSync(filePath, '\n\n---\n\n' + mdContent);
  } else {
    fs.writeFileSync(filePath, mdContent);
  }
  created++;
}

console.log(`\n✅ تم إنشاء ${created} ملف`);
console.log('\n🎉 تم التحويل بنجاح!');
