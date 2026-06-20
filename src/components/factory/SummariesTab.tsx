'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, BookOpen, Loader2, Save, Copy, Download,
  ArrowLeft, Wand2, Users, FileOutput, BarChart3,
  CheckCircle, BookMarked, Lightbulb, GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useFactoryStore, type ExtractedLesson } from '@/lib/factory-store';

// ─── Types ───────────────────────────────────────────────────────────
type ContentType = 'summary' | 'notes' | 'key_concepts' | 'study_guide';
type Audience = 'student' | 'teacher';
type ContentLength = 'short' | 'medium' | 'full';

interface LessonData {
  id: string;
  title: string;
  unitTitle: string;
  content: string;
  summary: string;
  keyPoints: string[];
}

interface GeneratedSummary {
  lessonId: string;
  lessonTitle: string;
  type: ContentType;
  audience: Audience;
  content: string;
  wordCount: number;
}

// ─── Labels ──────────────────────────────────────────────────────────
const contentTypeLabels: Record<ContentType, { label: string; icon: React.ReactNode }> = {
  summary: { label: 'ملخص مركز', icon: <FileText className="w-3.5 h-3.5" /> },
  notes: { label: 'مذكرات دراسية', icon: <BookMarked className="w-3.5 h-3.5" /> },
  key_concepts: { label: 'مفاهيم رئيسية', icon: <Lightbulb className="w-3.5 h-3.5" /> },
  study_guide: { label: 'دليل مراجعة', icon: <GraduationCap className="w-3.5 h-3.5" /> },
};

const audienceLabels: Record<Audience, string> = {
  student: 'طالب',
  teacher: 'معلم',
};

const lengthLabels: Record<ContentLength, string> = {
  short: 'مختصر (صفحة)',
  medium: 'متوسط (3 صفحات)',
  full: 'شامل',
};

// ─── Client-side Content Generators ──────────────────────────────────
function generateClientSide(
  lesson: LessonData,
  type: ContentType,
  audience: Audience,
  length: ContentLength
): string {
  const isStudent = audience === 'student';
  const isShort = length === 'short';
  const keyPointsList = lesson.keyPoints.length > 0
    ? lesson.keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join('\n')
    : 'لا توجد نقاط رئيسية محددة.';

  const summaryText = lesson.summary || (lesson.content ? lesson.content.slice(0, 500) + (lesson.content.length > 500 ? '...' : '') : 'لا يوجد ملخص متاح.');

  const contentText = isShort
    ? (lesson.content ? lesson.content.slice(0, 800) + (lesson.content.length > 800 ? '...' : '') : '')
    : lesson.content || '';

  switch (type) {
    case 'summary':
      return `# ملخص: ${lesson.title}\n\n`
        + `## النقاط الرئيسية\n\n${keyPointsList}\n\n`
        + `## الملخص\n\n${summaryText}\n`
        + (isShort ? '' : `\n## التفاصيل\n\n${contentText}\n`);

    case 'notes': {
      let notes = `# مذكرات دراسية: ${lesson.title}\n\n`;
      notes += isStudent
        ? `> مذكرات مُعدّة للطالب — مركّزة وواضحة\n\n`
        : `> مذكرات مُعدّة للمعلم — شاملة ومفصّلة\n\n`;
      notes += `## الوحدة: ${lesson.unitTitle}\n\n`;
      notes += `### المفاهيم الأساسية\n\n${keyPointsList}\n\n`;
      if (lesson.summary) {
        notes += `### الملخص التعليمي\n\n${lesson.summary}\n\n`;
      }
      if (contentText) {
        notes += `### المحتوى التفصيلي\n\n${contentText}\n`;
      }
      if (!isShort && !isStudent) {
        notes += `\n### ملاحظات للمعلم\n\n`;
        notes += `- تأكد من تغطية جميع النقاط الرئيسية\n`;
        notes += `- خصص وقتاً كافياً للأسئلة والأمثلة\n`;
        notes += `- استخدم أمثلة عملية من الواقع\n`;
      }
      return notes;
    }

    case 'key_concepts': {
      let concepts = `# المفاهيم الرئيسية: ${lesson.title}\n\n`;
      concepts += `## الوحدة: ${lesson.unitTitle}\n\n`;
      concepts += `---\n\n`;
      lesson.keyPoints.forEach((kp, i) => {
        concepts += `### المفهوم ${i + 1}: ${kp}\n\n`;
        if (lesson.content) {
          // Try to find a sentence in content that relates to this key point
          const sentences = lesson.content.split(/[.؟!]\s*/).filter(Boolean);
          const related = sentences.find((s) => s.includes(kp.slice(0, 10)));
          if (related) {
            concepts += `> ${related.trim()}.\n\n`;
          }
        }
        concepts += `\n`;
      });
      if (lesson.summary) {
        concepts += `---\n\n## الخلاصة\n\n${lesson.summary}\n`;
      }
      return concepts;
    }

    case 'study_guide': {
      let guide = `# دليل مراجعة: ${lesson.title}\n\n`;
      guide += isStudent
        ? `**الجمهور المستهدف:** طالب\n`
        : `**الجمهور المستهدف:** معلم\n`;
      guide += `**الوحدة:** ${lesson.unitTitle}\n\n---\n\n`;

      guide += `## أهداف الدرس\n\n`;
      lesson.keyPoints.forEach((kp, i) => {
        guide += `- [ ] ${kp}\n`;
      });
      guide += `\n`;

      guide += `## ملخص سريع\n\n${summaryText}\n\n`;

      if (!isShort) {
        guide += `## المحتوى الكامل\n\n${contentText}\n\n`;
        guide += `## أسئلة مراجعة مقترحة\n\n`;
        lesson.keyPoints.slice(0, 3).forEach((kp) => {
          guide += `1. اشرح ${kp}؟\n`;
        });
        guide += `\n`;
      }

      return guide;
    }

    default:
      return summaryText;
  }
}

// ─── Component ───────────────────────────────────────────────────────
export default function SummariesTab() {
  const { selectedBookId, units, addLog } = useFactoryStore();

  // Generation settings
  const [contentType, setContentType] = useState<ContentType>('summary');
  const [audience, setAudience] = useState<Audience>('student');
  const [contentLength, setContentLength] = useState<ContentLength>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Generated content
  const [generatedSummaries, setGeneratedSummaries] = useState<GeneratedSummary[]>([]);
  const [selectedSummaryIndex, setSelectedSummaryIndex] = useState<number | null>(null);

  // Editing
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Flatten all lessons from units
  const allLessons: LessonData[] = useMemo(() => {
    const lessons: LessonData[] = [];
    for (const unit of units) {
      for (const lesson of unit.ExtractedLesson || []) {
        lessons.push({
          id: lesson.id,
          title: lesson.titleAr || lesson.titleEn || '',
          unitTitle: unit.titleAr || unit.titleEn || '',
          content: lesson.content || '',
          summary: lesson.summary || '',
          keyPoints: typeof lesson.keyPoints === 'string'
            ? JSON.parse(lesson.keyPoints || '[]')
            : Array.isArray(lesson.keyPoints)
              ? lesson.keyPoints
              : [],
        });
      }
    }
    return lessons;
  }, [units]);

  // Quick stats
  const stats = useMemo(() => {
    const coveredIds = new Set(generatedSummaries.map((s) => s.lessonId));
    const totalWords = generatedSummaries.reduce((sum, s) => sum + s.wordCount, 0);
    return {
      generatedCount: generatedSummaries.length,
      totalWords,
      coveredLessons: coveredIds.size,
      totalLessons: allLessons.length,
    };
  }, [generatedSummaries, allLessons]);

  const selectedSummary = selectedSummaryIndex !== null
    ? generatedSummaries[selectedSummaryIndex]
    : null;

  // Sync edited content when selecting a summary
  const selectSummary = useCallback((index: number) => {
    setSelectedSummaryIndex(index);
    setEditedContent(generatedSummaries[index].content);
  }, [generatedSummaries]);

  // ─── Generate single lesson summary ────────────────────────────────
  const handleGenerate = async () => {
    // Generate for first lesson that doesn't have this type yet
    const existingIds = new Set(
      generatedSummaries.filter((s) => s.type === contentType).map((s) => s.lessonId)
    );
    const targetLesson = allLessons.find((l) => !existingIds.has(l.id));
    if (!targetLesson) {
      toast.info('تم توليد ملخصات لجميع الدروس من هذا النوع');
      return;
    }

    setIsGenerating(true);
    addLog({
      type: 'info',
      message: `بدء توليد ${contentTypeLabels[contentType].label} للدرس: ${targetLesson.title}`,
    });

    // Try API first
    try {
      const res = await fetch('/api/generate/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: targetLesson.id,
          type: contentType,
          audience,
          length: contentLength,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          const newSummary: GeneratedSummary = {
            lessonId: targetLesson.id,
            lessonTitle: targetLesson.title,
            type: contentType,
            audience,
            content: data.content,
            wordCount: data.content.split(/\s+/).length,
          };
          const updated = [...generatedSummaries, newSummary];
          setGeneratedSummaries(updated);
          setSelectedSummaryIndex(updated.length - 1);
          setEditedContent(newSummary.content);
          addLog({ type: 'success', message: `تم توليد ملخص: ${targetLesson.title}` });
          toast.success('تم توليد المحتوى بنجاح');
          setIsGenerating(false);
          return;
        }
      }
    } catch {
      // Fall through to client-side
    }

    // Client-side generation with small delay for UX
    await new Promise((r) => setTimeout(r, 800));

    const content = generateClientSide(targetLesson, contentType, audience, contentLength);
    const newSummary: GeneratedSummary = {
      lessonId: targetLesson.id,
      lessonTitle: targetLesson.title,
      type: contentType,
      audience,
      content,
      wordCount: content.split(/\s+/).length,
    };

    const updated = [...generatedSummaries, newSummary];
    setGeneratedSummaries(updated);
    setSelectedSummaryIndex(updated.length - 1);
    setEditedContent(newSummary.content);

    addLog({ type: 'success', message: `تم توليد محتوى محلياً: ${targetLesson.title}` });
    toast.success('تم توليد المحتوى بنجاح');
    setIsGenerating(false);
  };

  // ─── Batch generate for all lessons ────────────────────────────────
  const handleBatchGenerate = async () => {
    if (allLessons.length === 0) return;
    setIsBatchGenerating(true);
    addLog({
      type: 'info',
      message: `بدء توليد ${contentTypeLabels[contentType].label} لجميع الدروس (${allLessons.length} درس)`,
    });

    const newSummaries: GeneratedSummary[] = [];

    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];

      // Check if already generated for this type
      const exists = generatedSummaries.find(
        (s) => s.lessonId === lesson.id && s.type === contentType
      );
      if (exists) {
        newSummaries.push(exists);
        continue;
      }

      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

      const content = generateClientSide(lesson, contentType, audience, contentLength);
      const summary: GeneratedSummary = {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        type: contentType,
        audience,
        content,
        wordCount: content.split(/\s+/).length,
      };
      newSummaries.push(summary);

      // Update state progressively
      const merged = [...generatedSummaries.filter((s) => s.type !== contentType), ...newSummaries];
      setGeneratedSummaries(merged);
    }

    if (newSummaries.length > 0) {
      setSelectedSummaryIndex(0);
      setEditedContent(newSummaries[0].content);
    }

    addLog({ type: 'success', message: `تم توليد ملخصات لـ ${newSummaries.length} درس` });
    toast.success(`تم توليد محتوى لـ ${newSummaries.length} درس بنجاح`);
    setIsBatchGenerating(false);
  };

  // ─── Save edited content ───────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedSummary) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/lessons/${selectedSummary.lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: editedContent }),
      });
      if (res.ok) {
        // Update local state
        const updated = [...generatedSummaries];
        updated[selectedSummaryIndex!] = {
          ...updated[selectedSummaryIndex!],
          content: editedContent,
          wordCount: editedContent.split(/\s+/).length,
        };
        setGeneratedSummaries(updated);
        toast.success('تم الحفظ بنجاح');
        addLog({ type: 'success', message: `تم حفظ: ${selectedSummary.lessonTitle}` });
      } else {
        toast.error('فشل في الحفظ');
      }
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Copy to clipboard ─────────────────────────────────────────────
  const handleCopy = () => {
    if (!editedContent) return;
    navigator.clipboard.writeText(editedContent);
    toast.success('تم النسخ إلى الحافظة');
  };

  // ─── Export as Word-like (HTML blob) ───────────────────────────────
  const handleExportDoc = () => {
    if (!editedContent) return;
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${selectedSummary?.lessonTitle || 'ملخص'}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 40px; line-height: 1.8; direction: rtl; }
          h1 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 8px; }
          h2 { color: #047857; margin-top: 24px; }
          h3 { color: #065f46; }
          blockquote { background: #f0fdf4; padding: 12px 16px; border-right: 4px solid #059669; margin: 12px 0; }
          ul, ol { padding-right: 20px; }
          li { margin-bottom: 6px; }
          hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
          code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        </style>
      </head>
      <body>${editedContent.replace(/\n/g, '<br>')}</body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSummary?.lessonTitle || 'ملخص'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير الملف');
  };

  // ─── Empty state: no book selected ─────────────────────────────────
  if (!selectedBookId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">
          اختر كتاباً لبدء توليد الملخصات
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Generation Panel ───────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-sm">لوحة توليد المحتوى</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {allLessons.length > 0
                  ? `${allLessons.length} درس متاح للتوليد`
                  : 'لا توجد دروس مستخرجة بعد'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-4 space-y-4">
          {/* Content Type */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">نوع المحتوى</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(contentTypeLabels) as ContentType[]).map((type) => {
                const info = contentTypeLabels[type];
                const isSelected = contentType === type;
                return (
                  <Button
                    key={type}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => setContentType(type)}
                  >
                    {info.icon}
                    {info.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Audience & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                الجمهور المستهدف
              </label>
              <div className="flex gap-2">
                {(Object.keys(audienceLabels) as Audience[]).map((a) => (
                  <Button
                    key={a}
                    variant={audience === a ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setAudience(a)}
                  >
                    {audienceLabels[a]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <FileOutput className="w-3.5 h-3.5" />
                الطول
              </label>
              <div className="flex gap-2">
                {(Object.keys(lengthLabels) as ContentLength[]).map((l) => (
                  <Button
                    key={l}
                    variant={contentLength === l ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setContentLength(l)}
                  >
                    {lengthLabels[l]}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isBatchGenerating || allLessons.length === 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جارٍ التوليد...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 ml-2" />
                  توليد المحتوى
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleBatchGenerate}
              disabled={isGenerating || isBatchGenerating || allLessons.length === 0}
            >
              {isBatchGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جارٍ التوليد للكل... ({generatedSummaries.length}/{allLessons.length})
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 ml-2" />
                  توليد لكل الدروس
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Quick Stats ────────────────────────────────────────────── */}
      {generatedSummaries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.generatedCount}</p>
                <p className="text-[10px] text-muted-foreground">ملخصات مُولّدة</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.totalWords.toLocaleString('ar')}</p>
                <p className="text-[10px] text-muted-foreground">إجمالي الكلمات</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{stats.coveredLessons}/{stats.totalLessons}</p>
                <p className="text-[10px] text-muted-foreground">دروس مغطّاة</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── Content Display ────────────────────────────────────────── */}
      {generatedSummaries.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-20rem)]">
          {/* Left sidebar: summary list */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-xs">الملخصات المُولّدة</CardTitle>
            </CardHeader>
            <Separator />
            <ScrollArea className="h-[calc(100%-3.5rem)]">
              <div className="p-2 space-y-1">
                {generatedSummaries.map((s, index) => (
                  <button
                    key={`${s.lessonId}-${s.type}`}
                    onClick={() => selectSummary(index)}
                    className={`
                      w-full text-right p-2.5 rounded-lg transition-colors text-xs
                      ${selectedSummaryIndex === index
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'hover:bg-muted/80 text-foreground'
                      }
                    `}
                  >
                    <p className="font-medium truncate">{s.lessonTitle}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                        {contentTypeLabels[s.type].label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {s.wordCount} كلمة
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Right content: editor */}
          <Card className="lg:col-span-3 overflow-hidden">
            {selectedSummary ? (
              <div className="flex flex-col h-full">
                <CardHeader className="pb-2 px-4 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm truncate">{selectedSummary.lessonTitle}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {contentTypeLabels[selectedSummary.type].label}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {audienceLabels[selectedSummary.audience]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {editedContent.split(/\s+/).length} كلمة
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="text-xs"
                        title="نسخ"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExportDoc}
                        className="text-xs"
                        title="تصدير Word"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-xs"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 ml-1" />
                        )}
                        حفظ
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <ScrollArea className="flex-1">
                  <div className="p-4">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[400px] text-sm font-mono leading-relaxed"
                      dir="rtl"
                    />
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FileText className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  اختر ملخصاً من القائمة لعرضه وتعديله
                </p>
              </div>
            )}
          </Card>
        </div>
      ) : allLessons.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <Wand2 className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            جاهز لتوليد المحتوى
          </p>
          <p className="text-xs text-muted-foreground/70">
            اختر نوع المحتوى ثم اضغط &quot;توليد المحتوى&quot; أو &quot;توليد لكل الدروس&quot;
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <BookOpen className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            لا توجد دروس مستخرجة
          </p>
          <p className="text-xs text-muted-foreground/70">
            قم باستخراج المحتوى من الكتاب أولاً من تبويب الاستخراج
          </p>
        </motion.div>
      )}
    </div>
  );
}