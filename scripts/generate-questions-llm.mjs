// LLM-Powered Bilingual Question Generator
// Generates high-quality educational questions using AI

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const zai = await ZAI.create();

// Subject configurations
const subjects = [
  {
    nameAr: 'الفيزياء',
    nameEn: 'Physics',
    concepts: [
      { ar: 'التيار الكهربائي', en: 'Electric Current', unit: { ar: 'أمبير', en: 'Ampere' } },
      { ar: 'فرق الجهد', en: 'Voltage', unit: { ar: 'فولت', en: 'Volt' } },
      { ar: 'المقاومة الكهربائية', en: 'Electrical Resistance', unit: { ar: 'أوم', en: 'Ohm' } },
      { ar: 'القوة', en: 'Force', unit: { ar: 'نيوتن', en: 'Newton' } },
      { ar: 'الطاقة', en: 'Energy', unit: { ar: 'جول', en: 'Joule' } },
      { ar: 'القدرة الكهربائية', en: 'Electrical Power', unit: { ar: 'واط', en: 'Watt' } },
      { ar: 'الزخم', en: 'Momentum', unit: { ar: 'كجم.م/ث', en: 'kg.m/s' } },
      { ar: 'العجلة', en: 'Acceleration', unit: { ar: 'م/ث²', en: 'm/s²' } },
      { ar: 'السرعة', en: 'Velocity', unit: { ar: 'م/ث', en: 'm/s' } },
      { ar: 'الكتلة', en: 'Mass', unit: { ar: 'كيلوجرام', en: 'Kilogram' } }
    ]
  },
  {
    nameAr: 'الأحياء',
    nameEn: 'Biology',
    concepts: [
      { ar: 'الخلية', en: 'Cell' },
      { ar: 'الميتوكوندريا', en: 'Mitochondria' },
      { ar: 'النواة', en: 'Nucleus' },
      { ar: 'الجين', en: 'Gene' },
      { ar: 'الدنا', en: 'DNA' },
      { ar: 'البروتين', en: 'Protein' },
      { ar: 'الكربوهيدرات', en: 'Carbohydrates' },
      { ar: 'الإنزيم', en: 'Enzyme' }
    ]
  },
  {
    nameAr: 'الكيمياء',
    nameEn: 'Chemistry',
    concepts: [
      { ar: 'الذرة', en: 'Atom' },
      { ar: 'الجزيء', en: 'Molecule' },
      { ar: 'الإلكترون', en: 'Electron' },
      { ar: 'البروتون', en: 'Proton' },
      { ar: 'النيوترون', en: 'Neutron' },
      { ar: 'الأيون', en: 'Ion' },
      { ar: 'الرابطة الكيميائية', en: 'Chemical Bond' },
      { ar: 'المول', en: 'Mole' }
    ]
  }
];

// Generate questions using LLM
async function generateQuestionsWithLLM(subject, concept, level, count = 5) {
  const levelDescriptions = {
    EASY: 'basic recall and simple definitions',
    MEDIUM: 'application and understanding',
    HARD: 'analysis and problem solving',
    EXPERT: 'synthesis and complex evaluation'
  };

  const prompt = `You are an expert Egyptian high school teacher creating bilingual (Arabic/English) exam questions.

Subject: ${subject.nameAr} / ${subject.nameEn}
Concept: ${concept.ar} / ${concept.en}
Difficulty Level: ${level} (${levelDescriptions[level]})

Generate ${count} multiple-choice questions at this difficulty level.

IMPORTANT: 
1. Each question must be in BOTH Arabic and English
2. Arabic questions should use Egyptian colloquial style (عامية مصرية)
3. Include 4 options for each question
4. Mark the correct answer index (0-3)
5. Include explanations in both languages

Return ONLY a valid JSON array with this exact structure:
[
  {
    "questionAr": "السؤال بالعربي بالعامية المصرية",
    "questionEn": "Question in English",
    "optionsAr": ["خيار1", "خيار2", "خيار3", "خيار4"],
    "optionsEn": ["Option1", "Option2", "Option3", "Option4"],
    "correctIndex": 0,
    "answerAr": "الإجابة الصحيحة بالعربي",
    "answerEn": "Correct answer in English",
    "explanationAr": "شرح الإجابة بالعامية المصرية",
    "explanationEn": "Explanation in English"
  }
]

Generate ${count} questions now.`;

  try {
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are an expert bilingual educator. Respond with ONLY valid JSON, no other text.' },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content;
    
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error(`Error generating questions: ${error.message}`);
    return [];
  }
}

// Main function
async function main() {
  console.log('🚀 توليد بنك الأسئلة ثنائي اللغة باستخدام AI\n');

  const allQuestions = [];
  const levels = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
  const questionsPerLevel = { EASY: 25, MEDIUM: 35, HARD: 25, EXPERT: 15 };

  for (const subject of subjects) {
    console.log(`📚 ${subject.nameAr} / ${subject.nameEn}`);
    
    for (const concept of subject.concepts) {
      console.log(`   🔹 ${concept.ar} / ${concept.en}`);
      
      for (const level of levels) {
        const count = Math.ceil(questionsPerLevel[level] / subject.concepts.length);
        const questions = await generateQuestionsWithLLM(subject, concept, level, count);
        
        // Add metadata
        questions.forEach(q => {
          q.level = level;
          q.year = 'الصف الأول الثانوي';
          q.term = 'term-1';
          q.specialization = null;
          q.subject = subject.nameAr;
          q.questionType = 'MCQ';
        });
        
        allQuestions.push(...questions);
        console.log(`      ✅ ${questions.length} سؤال ${level}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Save to file
  const outputPath = '/home/z/my-project/public/data/question-bank-bilingual.json';
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), 'utf-8');

  console.log('\n📊 الإحصائيات النهائية:');
  console.log(`   إجمالي الأسئلة: ${allQuestions.length}`);
  levels.forEach(level => {
    const count = allQuestions.filter(q => q.level === level).length;
    console.log(`   ${level}: ${count} سؤال`);
  });

  console.log(`\n✅ تم حفظ الأسئلة في: ${outputPath}`);

  return allQuestions;
}

main().catch(console.error);
