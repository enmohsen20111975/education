'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ArrowLeft, Download, Copy, Code, Eye, Layers,
  Loader2, FileJson, FileText, ChevronDown, ChevronRight, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useFactoryStore } from '@/lib/factory-store';

type PreviewMode = 'formatted' | 'json' | 'lessons';

interface Lesson {
  id: string;
  title: string;
  unitId: string;
  content: string;
  summary: string;
  keyPoints: string[];
  order: number;
}

interface Unit {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

const previewModes: { key: PreviewMode; label: string; icon: React.ReactNode }[] = [
  { key: 'formatted', label: 'عرض منسق', icon: <Eye className="w-4 h-4" /> },
  { key: 'json', label: 'عرض JSON', icon: <Code className="w-4 h-4" /> },
  { key: 'lessons', label: 'عرض الدروس', icon: <Layers className="w-4 h-4" /> },
];

function convertToMarkdown(units: Unit[], bookTitle?: string): string {
  let md = `# ${bookTitle || 'محتوى الكتاب'}\n\n`;
  md += `---\n\n`;

  for (const unit of units) {
    md += `## ${unit.title}\n\n`;
    for (const lesson of unit.lessons) {
      md += `### ${lesson.title}\n\n`;
      md += `${lesson.content}\n\n`;
      if (lesson.summary) {
        md += `**الملخص:** ${lesson.summary}\n\n`;
      }
      if (lesson.keyPoints && lesson.keyPoints.length > 0) {
        md += `**النقاط الرئيسية:**\n`;
        for (const point of lesson.keyPoints) {
          md += `- ${point}\n`;
        }
        md += '\n';
      }
      md += `---\n\n`;
    }
  }

  return md;
}

export default function PreviewTab() {
  const { selectedBookId, setActiveTab } = useFactoryStore();
  const [previewMode, setPreviewMode] = useState<PreviewMode>('formatted');
  const [units, setUnits] = useState<Unit[]>([]);
  const [bookTitle, setBookTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const fetchUnits = useCallback(async () => {
    if (!selectedBookId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [unitsRes, bookRes] = await Promise.all([
        fetch(`/api/books/${selectedBookId}/units`),
        fetch(`/api/books/${selectedBookId}`),
      ]);

      if (unitsRes.ok) {
        const data = await unitsRes.json();
        const unitsData = Array.isArray(data) ? data : data.units || [];
        const transformed: Unit[] = unitsData.map((u: any) => ({
          id: u.id,
          title: u.titleAr || u.title || '',
          order: u.order || 0,
          lessons: (u.ExtractedLesson || u.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.titleAr || l.title || '',
            unitId: u.id,
            content: l.content || '',
            summary: l.summary || '',
            keyPoints: typeof l.keyPoints === 'string' ? JSON.parse(l.keyPoints || '[]') : (l.keyPoints || []),
            order: l.order || 0,
          })),
        }));
        setUnits(transformed);
        if (transformed.length > 0) {
          setExpandedUnits(new Set([transformed[0].id]));
        }
      }

      if (bookRes.ok) {
        const data = await bookRes.json();
        const book = data.book || data;
        setBookTitle(book.title || '');
      }
    } catch {
      toast.error('فشل في تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  }, [selectedBookId]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  };

  const hasContent = units.length > 0 && units.some((u) => u.lessons.length > 0);

  // Export JSON
  const handleExportJSON = () => {
    if (!selectedBookId) return;
    const exportData = { bookId: selectedBookId, title: bookTitle, units, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bookTitle || 'content'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير JSON بنجاح');
  };

  // Export Markdown
  const handleExportMarkdown = () => {
    if (!hasContent) return;
    const md = convertToMarkdown(units, bookTitle);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bookTitle || 'content'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير Markdown بنجاح');
  };

  // Copy All
  const handleCopyAll = async () => {
    if (!hasContent) return;
    const md = convertToMarkdown(units, bookTitle);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      toast.success('تم النسخ إلى الحافظة');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('فشل في النسخ');
    }
  };

  // No book selected
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
          اختر كتاباً من تبويب المصادر أو المحتوى
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setActiveTab('books')}
        >
          <ArrowLeft className="w-4 h-4 ml-1" />
          الذهاب للمصادر
        </Button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-8 w-40" />
        <div className="space-y-4 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Book selected but no content
  if (!hasContent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">
          لا يوجد محتوى مستخرج بعد
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          قم باستخراج ومعالجة الكتاب أولاً
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setActiveTab('extraction')}
        >
          <ArrowLeft className="w-4 h-4 ml-1" />
          الذهاب للاستخراج
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header: Book Title + Export Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{bookTitle || 'معاينة المحتوى'}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {units.length} وحدة • {units.reduce((acc, u) => acc + u.lessons.length, 0)} درس
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJSON} className="text-xs">
            <FileJson className="w-3.5 h-3.5 ml-1" />
            تصدير JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportMarkdown} className="text-xs">
            <Download className="w-3.5 h-3.5 ml-1" />
            تصدير Markdown
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyAll} className="text-xs">
            {copied ? (
              <CheckCircle className="w-3.5 h-3.5 ml-1 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 ml-1" />
            )}
            نسخ الكل
          </Button>
        </div>
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted w-fit">
        {previewModes.map((mode) => (
          <Button
            key={mode.key}
            variant={previewMode === mode.key ? 'default' : 'ghost'}
            size="sm"
            className="text-xs h-8 gap-1.5"
            onClick={() => setPreviewMode(mode.key)}
          >
            {mode.icon}
            {mode.label}
          </Button>
        ))}
      </div>

      {/* Preview Content */}
      <AnimatePresence mode="wait">
        {/* Formatted Preview */}
        {previewMode === 'formatted' && (
          <motion.div
            key="formatted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-6 pr-2">
                {units.map((unit, unitIdx) => (
                  <div key={unit.id}>
                    {/* Unit Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{unitIdx + 1}</span>
                      </div>
                      <h3 className="text-base font-semibold">{unit.title || `الوحدة ${unitIdx + 1}`}</h3>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-4 mr-6">
                      {unit.lessons.map((lesson, lessonIdx) => (
                        <Card key={lesson.id} className="overflow-hidden">
                          <CardHeader className="pb-2 pt-3 px-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  {lessonIdx + 1}
                                </span>
                              </div>
                              {lesson.title || `الدرس ${lessonIdx + 1}`}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 space-y-3">
                            {/* Content */}
                            {lesson.content && (
                              <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                                {lesson.content}
                              </div>
                            )}

                            {/* Summary */}
                            {lesson.summary && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">الملخص</p>
                                  <p className="text-sm leading-relaxed text-foreground/80">{lesson.summary}</p>
                                </div>
                              </>
                            )}

                            {/* Key Points */}
                            {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-2">النقاط الرئيسية</p>
                                  <ul className="space-y-1.5">
                                    {lesson.keyPoints.map((point, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                        <span className="text-foreground/80">{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {unitIdx < units.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}

        {/* JSON Preview */}
        {previewMode === 'json' && (
          <motion.div
            key="json"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-amber-500" />
                    بيانات JSON الخام
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(JSON.stringify({ title: bookTitle, units }, null, 2));
                        toast.success('تم النسخ');
                      } catch { toast.error('فشل في النسخ'); }
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 ml-1" />
                    نسخ
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-22rem)]">
                  <pre className="p-4 text-xs leading-relaxed font-mono bg-muted/50 text-foreground/90 whitespace-pre-wrap break-words" dir="ltr">
                    {JSON.stringify({ title: bookTitle, units }, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Lesson View */}
        {previewMode === 'lessons' && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2 pr-2">
                {units.map((unit, unitIdx) => {
                  const isExpanded = expandedUnits.has(unit.id);
                  return (
                    <Card key={unit.id} className="overflow-hidden">
                      <button
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-right"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary shrink-0">
                            {unit.lessons.length} درس
                          </Badge>
                          <span className="text-sm font-medium truncate">
                            {unit.title || `الوحدة ${unitIdx + 1}`}
                          </span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Separator />
                            <div className="p-3 space-y-2">
                              {unit.lessons.map((lesson, lessonIdx) => (
                                <div
                                  key={lesson.id}
                                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                        {lessonIdx + 1}
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium">{lesson.title || `الدرس ${lessonIdx + 1}`}</p>
                                  </div>
                                  {lesson.summary && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 mr-7">
                                      {lesson.summary}
                                    </p>
                                  )}
                                  {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2 mr-7">
                                      {lesson.keyPoints.slice(0, 3).map((point, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-[10px] bg-primary/5">
                                          {point.length > 30 ? point.slice(0, 30) + '...' : point}
                                        </Badge>
                                      ))}
                                      {lesson.keyPoints.length > 3 && (
                                        <Badge variant="secondary" className="text-[10px]">
                                          +{lesson.keyPoints.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

