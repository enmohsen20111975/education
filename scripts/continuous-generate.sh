#!/bin/bash
# Continuous generation script

cd /home/z/my-project

START=24
BATCH_SIZE=5
TOTAL=444

current=$START

while [ $current -lt $TOTAL ]; do
    echo "=== Processing lessons $current to $((current + BATCH_SIZE)) ==="

    bun run generate-content $current $BATCH_SIZE 2>&1

    # Count lessons with content
    COUNT=$(cat public/data/curriculum.json | python3 -c "
import json
with open('public/data/curriculum.json') as f:
    data = json.load(f)
print(sum(1 for y in data.get('academicYears', []) for s in y.get('Subject', []) for u in s.get('Unit', []) for l in u.get('Lesson', []) if len(l.get('introductionAr', '')) > 50))
" 2>/dev/null)

    echo "Total lessons with content: $COUNT/$TOTAL"

    # Push to git
    git add -A
    git commit -m "feat: Generated content for $COUNT lessons ($((COUNT * 100 / TOTAL))%)"
    git push origin main

    current=$((current + BATCH_SIZE))

    # Check if we've reached the end
    if [ $COUNT -ge $TOTAL ]; then
        echo "All lessons have content!"
        break
    fi
done

echo "Generation complete!"
