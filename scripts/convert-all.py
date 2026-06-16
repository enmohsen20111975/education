#!/usr/bin/env python3
"""
Convert external TypeScript lesson data to Markdown files
"""

import re
import os

def extract_value(content, key, pattern=r"'([^']*)'"):
    """Extract a value from TypeScript content"""
    search_pattern = f"{key}:\\s*{pattern}"
    match = re.search(search_pattern, content)
    return match.group(1) if match else ""

def extract_array(content, key):
    """Extract array content from TypeScript"""
    # Find the array block
    pattern = f"{key}:\\s*\\[(.*?)\\]"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1)
    return ""

def parse_questions(questions_block):
    """Parse questions from TypeScript block"""
    questions = []
    # Split by question objects
    q_pattern = r'\{\s*id:\s*(\d+),\s*question:\s*[\'"]([^"\']+)[\'"]'
    
    for match in re.finditer(q_pattern, questions_block):
        q_id = match.group(1)
        q_text = match.group(2)
        questions.append({
            'id': q_id,
            'question': q_text
        })
    
    return questions

def create_markdown_lesson(lesson_data, subject_name, year_name, term):
    """Create markdown content for a lesson"""
    
    md = f"""# {lesson_data.get('title', 'درس بدون عنوان')}

## 📚 معلومات الدرس
- **السنة الدراسية**: {year_name}
- **المادة**: {subject_name}
- **الترم**: {term}

---

## 📝 العنوان الفرعي
{lesson_data.get('subtitle', '')}

---

## 🎯 التشبيه (القياس)
> {lesson_data.get('analogy', 'لم يتم إضافة تشبيه بعد')}

---

## 💡 المفهوم الأساسي
{lesson_data.get('coreConcept', 'لم يتم إضافة المفهوم الأساسي بعد')}

---

## 📖 الشرح العميق
"""
    
    explanations = lesson_data.get('deepExplanation', [])
    if isinstance(explanations, list):
        for i, exp in enumerate(explanations, 1):
            md += f"\n### النقطة {i}:\n{exp}\n"
    else:
        md += str(explanations)
    
    md += f"""
---

## 🎮 المحاكاة
**عنوان المحاكاة**: {lesson_data.get('infographicTitle', 'غير محدد')}

---

## ❓ أسئلة للتدريب
"""
    
    questions = lesson_data.get('questions', [])
    for i, q in enumerate(questions, 1):
        md += f"""
### السؤال {i}:
**{q.get('question', '')}**

"""
        options = q.get('options', [])
        if isinstance(options, list):
            for j, opt in enumerate(options):
                letter = chr(65 + j)  # A, B, C, D
                correct = "✅" if j == q.get('correctIndex', -1) else ""
                md += f"{letter}) {opt} {correct}\n"
        
        md += f"""
**الشرح**: {q.get('explanation', '')}

⚠️ **تنبيه**: {q.get('trickWarning', 'لا يوجد')}
"""
    
    md += "\n---\n*تم إنشاء هذا الدرس من البيانات الخارجية*\n"
    
    return md

def extract_lessons_from_file(file_path, year_name):
    """Extract all lessons from a TypeScript file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lessons = []
    
    # Find lesson blocks
    lesson_pattern = r'\{\s*id:\s*[\'"]([^"\']+)[\'"],\s*title:\s*[\'"]([^"\']+)[\'"]'
    
    # More detailed extraction
    # Find title lines
    title_matches = re.findall(r"title:\s*[\'"]([^"\']+)[\'"]", content)
    print(f"  Found {len(title_matches)} titles in {file_path}")
    
    return title_matches

def main():
    print("=" * 60)
    print("🚀 تحويل بيانات الدروس إلى ملفات Markdown")
    print("=" * 60)
    
    # Grade 10
    print("\n📚 الصف الأول الثانوي:")
    grade10_path = '/home/z/Gemini-education-version/lib/data/grade10.ts'
    extract_lessons_from_file(grade10_path, 'الصف الأول الثانوي')
    
    # Grade 11
    print("\n📚 الصف الثاني الثانوي:")
    grade11_path = '/home/z/Gemini-education-version/lib/data/grade11.ts'
    extract_lessons_from_file(grade11_path, 'الصف الثاني الثانوي')
    
    # Grade 12
    print("\n📚 الصف الثالث الثانوي:")
    grade12_path = '/home/z/Gemini-education-version/lib/data/grade12.ts'
    extract_lessons_from_file(grade12_path, 'الصف الثالث الثانوي')
    
    print("\n" + "=" * 60)
    print("✅ تم التحليل بنجاح!")
    print("=" * 60)

if __name__ == '__main__':
    main()
