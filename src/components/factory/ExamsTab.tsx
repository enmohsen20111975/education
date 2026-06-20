'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, FileQuestion, Clock, Star, Download,
  Printer, Save, Trash2, Plus, Eye, EyeOff,
  CheckCircle, AlertTriangle, BookOpen, Loader2, RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { useFactoryStore, type ExtractedUnit, type ExtractedLesson } from '@/lib/factory-store';

// ── Types ──
interface MCQOption {
  text: string;
  label: string;
}

interface ExamQuestion {
  id: string;
  number: number;
  type: 'mcq' | 'trueFalse' | 'fillBlank' | 'essay';
  question: string;
  options?: MCQOption[];
  correctAnswer: string | number;
  points: number;
  difficulty: string;
  sourceLessonId?: string;
  sourceLessonTitle?: string;
  expanded?: boolean;
}

interface ExamConfig {
  examType: 'quiz' | 'midterm' | 'final' | 'practice';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionTypes: {
    mcq: boolean;
    trueFalse: boolean;
    fillBlank: boolean;
    essay: boolean;
  };
}

interface GeneratedExam {
  id: string;
  title: string;
  type: string;
  typeAr: string;
  difficulty: string;
  difficultyAr: string;
  duration: number;
  totalMarks: number;
  questions: ExamQuestion[];
  createdAt: string;
  bookTitle: string;
}

// ── Constants ──
const examTypes = [
  { value: 'quiz', label: 'اختبار سريع', questions: 10, duration: 15 },
  { value: 'midterm', label: 'اختبار نصفي', questions: 20, duration: 45 },
  { value: 'final', label: 'اختبار نهائي', questions: 30, duration: 60 },
  { value: 'practice', label: 'تدريب', questions: 15, duration: 30 },
] as const;

const difficulties = [
  { value: 'easy', label: 'سهل' },
  { value: 'medium', label: 'متوسط' },
  { value: 'hard', label: 'صعب' },
  { value: 'mixed', label: 'مختلط' },
] as const;

const questionTypeLabels: Record<string, string> = {
  mcq: 'اختيار من متعدد',
  trueFalse: 'صح وخطأ',
  fillBlank: 'إكمال فراغ',
  essay: 'مقالية',
};

const questionTypeBadges: Record<string, string> = {
  mcq: 'اختيار',
  trueFalse: 'صح/خطأ',
  fillBlank: 'إكمال',
  essay: 'مقالي',
};

const difficultyLabels: Record<string, string> = {
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
  mixed: 'مختلط',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  hard: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  mixed: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
};

const optionLabels = ['أ', 'ب', 'ج', 'د'];
const distractors = [
  'لا يوجد مما سبق',
  'جميع ما سبق',
  'الخيار أ والب',
  'يعتمد على السياق',
  'غير صحيح',
  'صحيح جزئياً',
  'لا شيء مما ذكر',
  'كل ما سبق',
  'أ وب فقط',
  'ج ود فقط',
];

// ── Helpers ──
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateMCQ(keyPoint: string, lesson: ExtractedLesson, difficulty: string): ExamQuestion {
  const cleanPoint = keyPoint.trim();
  const altOptions = shuffleArray(distractors).slice(0, 3);
  const correctIdx = Math.floor(Math.random() * 4);
  const options: MCQOption[] = [];
  for (let i = 0; i < 4; i++) {
    if (i === correctIdx) {
      options.push({ text: cleanPoint, label: optionLabels[i] });
    } else {
      options.push({ text: altOptions[i % 3], label: optionLabels[i] });
    }
  }
  return {
    id: crypto.randomUUID(),
    number: 0,
    type: 'mcq',
    question: `ما هو المفهوم الصحيح بشأن: ${cleanPoint}?`,
    options,
    correctAnswer: correctIdx,
    points: difficulty === 'hard' ? 3 : difficulty === 'easy' ? 1 : 2,
    difficulty: difficulty === 'mixed' ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] : difficulty,
    sourceLessonId: lesson.id,
    sourceLessonTitle: lesson.titleAr,
  };
}

function generateTrueFalse(keyPoint: string, lesson: ExtractedLesson, difficulty: string): ExamQuestion {
  const cleanPoint = keyPoint.trim();
  const isCorrect = Math.random() > 0.3;
  return {
    id: crypto.randomUUID(),
    number: 0,
    type: 'trueFalse',
    question: isCorrect
      ? `صح أم خطأ: ${cleanPoint}`
      : `صح أم خطأ: ${cleanPoint.length > 10 ? cleanPoint.slice(0, -1) + ' مع بعض الاختلاف' : cleanPoint}`,
    correctAnswer: isCorrect ? 'صح' : 'خطأ',
    points: difficulty === 'hard' ? 2 : 1,
    difficulty: difficulty === 'mixed' ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] : difficulty,
    sourceLessonId: lesson.id,
    sourceLessonTitle: lesson.titleAr,
  };
}

function generateFillBlank(keyPoint: string, lesson: ExtractedLesson, difficulty: string): ExamQuestion {
  const cleanPoint = keyPoint.trim();
  const words = cleanPoint.split(/\s+/);
  if (words.length < 3) {
    return generateMCQ(cleanPoint, lesson, difficulty);
  }
  const blankIdx = Math.floor(Math.random() * Math.min(words.length - 1, 4)) + 1;
  const blankedWords = [...words];
  blankedWords[blankIdx] = '______';
  return {
    id: crypto.randomUUID(),
    number: 0,
    type: 'fillBlank',
    question: `أكمل الفراغ: ${blankedWords.join(' ')}`,
    correctAnswer: words[blankIdx],
    points: difficulty === 'hard' ? 3 : 2,
    difficulty: difficulty === 'mixed' ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] : difficulty,
    sourceLessonId: lesson.id,
    sourceLessonTitle: lesson.titleAr,
  };
}

function generateEssay(keyPoint: string, lesson: ExtractedLesson): ExamQuestion {
  return {
    id: crypto.randomUUID(),
    number: 0,
    type: 'essay',
    question: `اشرح بالتفصيل: ${keyPoint.trim()}. مع ذكر الأمثلة والتفاصيل الداعمة.`,
    correctAnswer: keyPoint.trim(),
    points: 5,
    difficulty: 'medium',
    sourceLessonId: lesson.id,
    sourceLessonTitle: lesson.titleAr,
  };
}

function generateExamFromLessons(
  lessons: ExtractedLesson[],
  config: ExamConfig,
  bookTitle: string,
): GeneratedExam {
  const allQuestions: ExamQuestion[] = [];
  const examTypeConfig = examTypes.find(t => t.value === config.examType)!;

  const enabledTypes: ('mcq' | 'trueFalse' | 'fillBlank' | 'essay')[] = [];
  if (config.questionTypes.mcq) enabledTypes.push('mcq');
  if (config.questionTypes.trueFalse) enabledTypes.push('trueFalse');
  if (config.questionTypes.fillBlank) enabledTypes.push('fillBlank');
  if (config.questionTypes.essay) enabledTypes.push('essay');
  if (enabledTypes.length === 0) enabledTypes.push('mcq');

  const lessonKeyPoints: { lesson: ExtractedLesson; point: string }[] = [];
  for (const lesson of lessons) {
    const kps = typeof lesson.keyPoints === 'string'
      ? JSON.parse(lesson.keyPoints || '[]')
      : (lesson.keyPoints || []);
    for (const point of kps) {
      if (point && typeof point === 'string' && point.trim().length > 5) {
        lessonKeyPoints.push({ lesson, point: point.trim() });
      }
    }
  }

  const shuffledPoints = shuffleArray(lessonKeyPoints);
  const targetCount = examTypeConfig.questions;

  for (let i = 0; i < targetCount && shuffledPoints.length > 0; i++) {
    const { lesson, point } = shuffledPoints[i % shuffledPoints.length];
    const qType = enabledTypes[i % enabledTypes.length];
    let q: ExamQuestion;
    switch (qType) {
      case 'mcq': q = generateMCQ(point, lesson, config.difficulty); break;
      case 'trueFalse': q = generateTrueFalse(point, lesson, config.difficulty); break;
      case 'fillBlank': q = generateFillBlank(point, lesson, config.difficulty); break;
      case 'essay': q = generateEssay(point, lesson); break;
      default: q = generateMCQ(point, lesson, config.difficulty);
    }
    allQuestions.push(q);
  }

  allQuestions.forEach((q, idx) => { q.number = idx + 1; });
  const totalMarks = allQuestions.reduce((sum, q) => sum + q.points, 0);

  return {
    id: crypto.randomUUID(),
    title: `امتحان ${bookTitle} - ${examTypeConfig.label}`,
    type: config.examType,
    typeAr: examTypeConfig.label,
    difficulty: config.difficulty,
    difficultyAr: difficultyLabels[config.difficulty],
    duration: examTypeConfig.duration,
    totalMarks,
    questions: allQuestions,
    createdAt: new Date().toISOString(),
    bookTitle,
  };
}

function formatExamAsText(exam: GeneratedExam): string {
  const lines: string[] = [];
  lines.push('═'.repeat(60));
  lines.push(`  ${exam.title}`);
  lines.push('═'.repeat(60));
  lines.push(`  النوع: ${exam.typeAr}  |  الصعوبة: ${exam.difficultyAr}  |  المدة: ${exam.duration} دقيقة  |  الدرجة الكلية: ${exam.totalMarks}`);
  lines.push('─'.repeat(60));
  lines.push('');
  for (const q of exam.questions) {
    lines.push(`${q.number}. [${questionTypeLabels[q.type]}] (${q.points} نقطة) ${q.question}`);
    if (q.type === 'mcq' && q.options) {
      for (const opt of q.options) {
        lines.push(`   ${opt.label}) ${opt.text}`);
      }
    }
    lines.push('');
  }
  lines.push('─'.repeat(60));
  lines.push('  مفتاح الإجابات');
  lines.push('─'.repeat(60));
  for (const q of exam.questions) {
    let answer = '';
    if (q.type === 'mcq' && q.options) {
      answer = `${q.options[q.correctAnswer as number].label}) ${q.options[q.correctAnswer as number].text}`;
    } else {
      answer = String(q.correctAnswer);
    }
    lines.push(`${q.number}. ${answer}`);
  }
  lines.push('═'.repeat(60));
  return lines.join('\n');
}

// ── Animation variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

// ── Component ──
export default function ExamsTab() {
  const { books, selectedBookId, units, setUnits, setActiveTab, addLog } = useFactoryStore();

  const [config, setConfig] = useState<ExamConfig>({
    examType: 'quiz',
    difficulty: 'mixed',
    questionTypes: { mcq: true, trueFalse: true, fillBlank: true, essay: false },
  });
  const [generatedExams, setGeneratedExams] = useState<GeneratedExam[]>([]);
  const [activeExam, setActiveExam] = useState<GeneratedExam | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>([]);

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId),
    [books, selectedBookId],
  );

  const allLessons = useMemo(() => {
    const lessons: ExtractedLesson[] = [];
    for (const unit of units) {
      if (unit.ExtractedLesson) lessons.push(...unit.ExtractedLesson);
    }
    return lessons;
  }, [units]);

  const fetchUnits = useCallback(async () => {
    if (!selectedBookId) return;
    try {
      const res = await fetch(`/api/books/${selectedBookId}/units`);
      if (res.ok) {
        const data = await res.json();
        setUnits(data.units || []);
      }
    } catch {
      toast.error('فشل في تحميل الوحدات');
    }
  }, [selectedBookId, setUnits]);

  useEffect(() => {
    if (selectedBookId) fetchUnits();
  }, [selectedBookId, fetchUnits]);

  const handleGenerate = useCallback(() => {
    if (allLessons.length === 0) { toast.error('لا توجد دروس في الكتاب المحدد'); return; }
    setIsGenerating(true);
    setTimeout(() => {
      const exam = generateExamFromLessons(allLessons, config, selectedBook?.title || 'كتاب');
      setGeneratedExams((prev) => [exam, ...prev]);
      setActiveExam(exam);
      setShowAnswers(false);
      setIsGenerating(false);
      addLog({ type: 'success', message: `تم توليد ${exam.typeAr} جديد بنجاح (${exam.questions.length} سؤال)` });
      toast.success(`تم توليد الامتحان بنجاح - ${exam.questions.length} سؤال`);
    }, 800);
  }, [allLessons, config, selectedBook, addLog]);

  const handleGenerateBatch = useCallback(() => {
    if (allLessons.length === 0) { toast.error('لا توجد دروس في الكتاب المحدد'); return; }
    setIsGenerating(true);
    setTimeout(() => {
      const exams: GeneratedExam[] = [];
      for (const lesson of allLessons) {
        const exam = generateExamFromLessons([lesson], config, lesson.titleAr);
        exam.title = `${exam.typeAr} - ${lesson.titleAr}`;
        exams.push(exam);
      }
      setGeneratedExams((prev) => [...exams.reverse(), ...prev]);
      setActiveExam(exams[0]);
      setShowAnswers(false);
      setIsGenerating(false);
      addLog({ type: 'success', message: `تم توليد ${exams.length} امتحان لكل الدروس` });
      toast.success(`تم توليد ${exams.length} امتحان لكل الدروس`);
    }, 1200);
  }, [allLessons, config, addLog]);

  const handleExportJSON = useCallback(() => {
    if (!activeExam) return;
    const blob = new Blob([JSON.stringify(activeExam, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeExam.title.replace(/\s+/g, '_')}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير الامتحان كملف JSON');
  }, [activeExam]);

  const handlePrint = useCallback(() => {
    if (!activeExam) return;
    const text = formatExamAsText(activeExam);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeExam.title.replace(/\s+/g, '_')}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير الامتحان كملف نصي');
  }, [activeExam]);

  const handleSaveDraft = useCallback(() => {
    if (!activeExam) return;
    try {
      const saved = JSON.parse(localStorage.getItem('factory-exam-drafts') || '[]');
      saved.unshift(activeExam);
      localStorage.setItem('factory-exam-drafts', JSON.stringify(saved.slice(0, 20)));
      toast.success('تم حفظ الامتحان كمسودة');
      addLog({ type: 'info', message: `تم حفظ امتحان "${activeExam.title}" كمسودة` });
    } catch { toast.error('فشل في حفظ المسودة'); }
  }, [activeExam, addLog]);

  const handleStartEdit = useCallback((q: ExamQuestion) => {
    setEditingQuestion(q.id);
    setEditText(q.question);
    setEditOptions(q.options ? q.options.map(o => o.text) : []);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!activeExam || !editingQuestion) return;
    setActiveExam({
      ...activeExam,
      questions: activeExam.questions.map(q => {
        if (q.id !== editingQuestion) return q;
        return {
          ...q,
          question: editText,
          options: q.type === 'mcq' ? q.options?.map((o, i) => ({ ...o, text: editOptions[i] || o.text })) : q.options,
        };
      }),
    });
    setEditingQuestion(null);
    toast.success('تم تعديل السؤال');
  }, [activeExam, editingQuestion, editText, editOptions]);

  const handleDeleteQuestion = useCallback((qId: string) => {
    if (!activeExam) return;
    const newQuestions = activeExam.questions.filter(q => q.id !== qId).map((q, i) => ({ ...q, number: i + 1 }));
    const totalMarks = newQuestions.reduce((sum, q) => sum + q.points, 0);
    setActiveExam({ ...activeExam, questions: newQuestions, totalMarks });
    toast.success('تم حذف السؤال');
  }, [activeExam]);

  const handleAddQuestion = useCallback(() => {
    if (!activeExam) return;
    const newQ: ExamQuestion = {
      id: crypto.randomUUID(),
      number: activeExam.questions.length + 1,
      type: 'mcq',
      question: 'اكتب نص السؤال هنا...',
      options: [
        { text: 'الإجابة الصحيحة', label: 'أ' },
        { text: 'خيار بديل 1', label: 'ب' },
        { text: 'خيار بديل 2', label: 'ج' },
        { text: 'خيار بديل 3', label: 'د' },
      ],
      correctAnswer: 0,
      points: 2,
      difficulty: 'medium',
    };
    const updated = { ...activeExam, questions: [...activeExam.questions, newQ], totalMarks: activeExam.totalMarks + 2 };
    setActiveExam(updated);
    setEditingQuestion(newQ.id);
    setEditText(newQ.question);
    setEditOptions(newQ.options.map(o => o.text));
    toast.success('تمت إضافة سؤال جديد');
  }, [activeExam]);

  const toggleQuestionExpand = useCallback((qId: string) => {
    if (!activeExam) return;
    setActiveExam({
      ...activeExam,
      questions: activeExam.questions.map(q =>
        q.id === qId ? { ...q, expanded: !q.expanded } : q,
      ),
    });
  }, [activeExam]);

  // ── No book selected ──
  if (!selectedBookId) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold">توليد الامتحانات</h2>
          <p className="text-sm text-muted-foreground">إنشاء اختبارات وأسئلة متنوعة من محتوى الكتب</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-base mb-2">اختر كتاباً لبدء توليد الامتحانات</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                اختر كتاباً من قائمة المصادر لبدء توليد الأسئلة والاختبارات المتنوعة
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setActiveTab('sources')}>
                <BookOpen className="w-4 h-4 ml-2" />
                الذهاب للمصادر
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold">توليد الامتحانات</h2>
          <p className="text-sm text-muted-foreground">
            الكتاب: {selectedBook?.title || ''} — {allLessons.length} درس
          </p>
        </div>
      </motion.div>

      {/* ── Exam Configuration Panel ── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              إعدادات الامتحان
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Exam Type Selector — 4 toggle buttons */}
            <div>
              <Label className="text-xs font-medium mb-2 block">نوع الامتحان</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {examTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setConfig((c) => ({ ...c, examType: t.value }))}
                    className={`flex flex-col items-center p-3 rounded-lg border text-xs font-medium transition-all ${
                      config.examType === t.value
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-border hover:border-emerald-500/50 hover:bg-muted/50'
                    }`}
                  >
                    <span className="font-semibold">{t.label}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {t.questions} سؤال — {t.duration} د
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selector */}
            <div className="flex items-center gap-4 flex-wrap">
              <Label className="text-xs font-medium">مستوى الصعوبة:</Label>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <Button
                    key={d.value}
                    size="sm"
                    variant={config.difficulty === d.value ? 'default' : 'outline'}
                    className={`text-xs h-8 ${config.difficulty === d.value ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                    onClick={() => setConfig((c) => ({ ...c, difficulty: d.value }))}
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Question Types checkboxes */}
            <div>
              <Label className="text-xs font-medium mb-2 block">أنواع الأسئلة</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { key: 'mcq' as const, label: 'أسئلة اختيار من متعدد' },
                  { key: 'trueFalse' as const, label: 'أسئلة صح وخطأ' },
                  { key: 'fillBlank' as const, label: 'أسئلة إكمال فراغ' },
                  { key: 'essay' as const, label: 'أسئلة مقالية' },
                ]).map((qt) => (
                  <div key={qt.key} className="flex items-center gap-2">
                    <Checkbox
                      checked={config.questionTypes[qt.key]}
                      onCheckedChange={(checked) =>
                        setConfig((c) => ({ ...c, questionTypes: { ...c.questionTypes, [qt.key]: !!checked } }))
                      }
                    />
                    <label className="text-xs cursor-pointer select-none">{qt.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || allLessons.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <GraduationCap className="w-4 h-4 ml-2" />}
                توليد الامتحان
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateBatch}
                disabled={isGenerating || allLessons.length === 0}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <RotateCcw className="w-4 h-4 ml-2" />}
                توليد لكل الدروس
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Generated Exams List ── */}
      {generatedExams.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold mb-3">الامتحانات المولّدة ({generatedExams.length})</h3>
          <ScrollArea className="max-h-12">
            <div className="flex gap-2 flex-wrap pb-2">
              {generatedExams.map((exam) => (
                <Button
                  key={exam.id}
                  size="sm"
                  variant={activeExam?.id === exam.id ? 'default' : 'outline'}
                  className={`text-xs ${activeExam?.id === exam.id ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                  onClick={() => { setActiveExam(exam); setShowAnswers(false); }}
                >
                  <GraduationCap className="w-3.5 h-3.5 ml-1" />
                  {exam.title.length > 30 ? exam.title.slice(0, 30) + '...' : exam.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}

      {/* ── Active Exam Display ── */}
      <AnimatePresence mode="wait">
        {activeExam && (
          <motion.div
            key={activeExam.id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Exam Header Card */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm">{activeExam.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{activeExam.typeAr}</Badge>
                        <Badge variant="secondary" className={difficultyColors[activeExam.difficulty]}>{activeExam.difficultyAr}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" />{activeExam.duration} دقيقة</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1"><Star className="w-3 h-3" />{activeExam.totalMarks} نقطة</Badge>
                        <Badge variant="secondary">{activeExam.questions.length} سؤال</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={showAnswers ? 'default' : 'outline'}
                        className={`text-xs ${showAnswers ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                        onClick={() => setShowAnswers(!showAnswers)}
                      >
                        {showAnswers ? <EyeOff className="w-3.5 h-3.5 ml-1" /> : <Eye className="w-3.5 h-3.5 ml-1" />}
                        كشف الإجابات
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs" onClick={handleExportJSON}>
                        <Download className="w-3.5 h-3.5 ml-1" />تصدير امتحان
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs" onClick={handlePrint}>
                        <Printer className="w-3.5 h-3.5 ml-1" />طباعة
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs" onClick={handleSaveDraft}>
                        <Save className="w-3.5 h-3.5 ml-1" />حفظ كمسودة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Questions List */}
            <motion.div variants={itemVariants} className="space-y-3">
              <ScrollArea className="max-h-[calc(100vh-24rem)]">
                <div className="space-y-3 pr-2">
                  {activeExam.questions.map((q) => (
                    <Card key={q.id} className="overflow-hidden">
                      <Collapsible
                        open={editingQuestion === q.id || q.expanded || false}
                        onOpenChange={(open) => { if (editingQuestion !== q.id) toggleQuestionExpand(q.id); }}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{q.number}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-relaxed line-clamp-1">{q.question}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="secondary" className="text-[10px]">{questionTypeBadges[q.type]}</Badge>
                              <Badge variant="secondary" className="text-[10px]">{q.points} نقطة</Badge>
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="border-t px-4 py-3 space-y-3">
                            {editingQuestion === q.id ? (
                              /* Inline editor */
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs mb-1 block">نص السؤال</Label>
                                  <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="text-sm" rows={2} />
                                </div>
                                {q.type === 'mcq' && (
                                  <div className="space-y-2">
                                    <Label className="text-xs">الخيارات</Label>
                                    {editOptions.map((opt, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] shrink-0">{optionLabels[i]}</Badge>
                                        <Input value={opt} onChange={(e) => { const n = [...editOptions]; n[i] = e.target.value; setEditOptions(n); }} className="text-sm h-8" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Button size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveEdit}>
                                    <CheckCircle className="w-3.5 h-3.5 ml-1" />حفظ
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-xs" onClick={() => setEditingQuestion(null)}>إلغاء</Button>
                                </div>
                              </div>
                            ) : (
                              /* View mode */
                              <>
                                {q.type === 'mcq' && q.options && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {q.options.map((opt, i) => (
                                      <div
                                        key={i}
                                        className={`flex items-center gap-2 p-2 rounded-lg border text-sm ${
                                          showAnswers && i === q.correctAnswer ? 'border-emerald-500 bg-emerald-500/10' : 'border-border'
                                        }`}
                                      >
                                        <Badge variant="outline" className="text-[10px] shrink-0">{opt.label}</Badge>
                                        <span className="text-xs">{opt.text}</span>
                                        {showAnswers && i === q.correctAnswer && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-auto" />}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {q.type === 'trueFalse' && showAnswers && (
                                  <div className="flex gap-2">
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${q.correctAnswer === 'صح' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border'}`}>✓ صح</div>
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${q.correctAnswer === 'خطأ' ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'border-border'}`}>✗ خطأ</div>
                                  </div>
                                )}

                                {q.type === 'fillBlank' && showAnswers && (
                                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500">
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">الإجابة: {String(q.correctAnswer)}</span>
                                  </div>
                                )}

                                {q.type === 'essay' && showAnswers && (
                                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500">
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                                      <strong>نموذج الإجابة:</strong> {String(q.correctAnswer)}
                                    </p>
                                  </div>
                                )}

                                {q.sourceLessonTitle && (
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />المصدر: {q.sourceLessonTitle}
                                  </p>
                                )}

                                <div className="flex gap-2 pt-1">
                                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => handleStartEdit(q)}>
                                    <AlertTriangle className="w-3 h-3 ml-1" />تعديل
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive" onClick={() => handleDeleteQuestion(q.id)}>
                                    <Trash2 className="w-3 h-3 ml-1" />حذف
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {/* Add Question */}
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={handleAddQuestion}>
                  <Plus className="w-3.5 h-3.5 ml-1" />إضافة سؤال جديد
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {!activeExam && generatedExams.length === 0 && !isGenerating && (
        <motion.div variants={itemVariants}>
          <Card className="border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <FileQuestion className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-base mb-2">لم يتم توليد امتحانات بعد</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                قم بإعداد خيارات الامتحان ثم اضغط على &quot;توليد الامتحان&quot; لإنشاء أسئلة متنوعة من محتوى الكتاب
              </p>
              {allLessons.length === 0 && (
                <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />لا توجد دروس مستخرجة في هذا الكتاب
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
