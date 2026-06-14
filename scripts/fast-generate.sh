#!/bin/bash
# Fast content generation using z-ai CLI

START=${1:-36}
COUNT=${2:-10}

cd /home/z/my-project

# Get lessons that need content
python3 << EOF
import json
import subprocess
import time

with open('public/data/curriculum.json', 'r') as f:
    data = json.load(f)

lessons = []
for year in data.get('academicYears', []):
    for subj in year.get('Subject', []):
        for unit in subj.get('Unit', []):
            for lesson in unit.get('Lesson', []):
                if len(lesson.get('introductionAr', '')) <= 50:
                    lessons.append({
                        'id': lesson['id'],
                        'title': lesson['titleAr'],
                        'subject': subj['nameAr'],
                        'unit': unit['nameAr']
                    })

print(f"Found {len(lessons)} lessons needing content")

# Process lessons
for i, lesson in enumerate(lessons[:COUNT]):
    print(f"\n[{i+1}/{min(COUNT, len(lessons))}] {lesson['title']}")

    prompt = f"""أنت معلم خبير في المنهج المصري للمرحلة الثانوية.
أنشئ محتوى تعليمي شامل لهذا الدرس:

العنوان: {lesson['title']}
المادة: {lesson['subject']}
الوحدة: {lesson['unit']}

أرجع JSON فقط:
{{
  "introductionAr": "مقدمة شاملة (300-500 كلمة)",
  "summaryAr": "ملخص الدرس",
  "objectives": ["هدف 1", "هدف 2", "هدف 3"],
  "keyPoints": ["نقطة 1", "نقطة 2", "نقطة 3"],
  "examples": ["مثال 1", "مثال 2"]
}}"""

    try:
        result = subprocess.run(
            ['z-ai', 'chat', '-p', prompt, '-o', f'/tmp/lesson_{lesson["id"]}.json'],
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode == 0:
            print(f"  ✅ Generated")
        else:
            print(f"  ❌ Failed: {result.stderr[:50]}")

    except Exception as e:
        print(f"  ❌ Error: {e}")

    time.sleep(1)

print(f"\nDone! Generated content for {min(COUNT, len(lessons))} lessons")
EOF
