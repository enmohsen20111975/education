'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight, ChevronDown, FileText, FolderOpen,
  Plus, Trash2, Save, Download, Loader2, Edit, ArrowLeft, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useFactoryStore } from '@/lib/factory-store';

interface Lesson {
  id: string;
  title: string;
  unitId: string;
  content: string;
  summary: string;
  keyPoints: string[];
  status: 'draft' | 'reviewed' | 'approved';
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function ContentTab() {
  const { selectedBookId, setActiveTab } = useFactoryStore();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingSummary, setEditingSummary] = useState('');
  const [editingKeyPoints, setEditingKeyPoints] = useState<string[]>([]);
  const [editingStatus, setEditingStatus] = useState<string>('draft');
  const [newKeyPoint, setNewKeyPoint] = useState('');

  const fetchUnits = useCallback(async () => {
    if (!selectedBookId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${selectedBookId}/units`);
      if (res.ok) {
        const data = await res.json();
        const unitsData = Array.isArray(data) ? data : data.units || [];
        // Transform units: parse keyPoints from JSON string and map titles
        const transformed = unitsData.map((u: any) => ({
          id: u.id,
          title: u.titleAr || u.title || '',
          lessons: (u.ExtractedLesson || u.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.titleAr || l.title || '',
            unitId: u.id,
            content: l.content || '',
            summary: l.summary || '',
            keyPoints: typeof l.keyPoints === 'string' ? JSON.parse(l.keyPoints || '[]') : (l.keyPoints || []),
            status: l.status || 'draft',
          })),
        }));
        setUnits(transformed);
        if (transformed.length > 0) {
          setExpandedUnits(new Set([transformed[0].id]));
        }
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
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  };

  const selectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setEditingTitle(lesson.title);
    setEditingContent(lesson.content);
    setEditingSummary(lesson.summary);
    setEditingKeyPoints([...lesson.keyPoints]);
    setEditingStatus(lesson.status);
  };

  const handleSave = async () => {
    if (!selectedLesson) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: editingTitle,
          content: editingContent,
          summary: editingSummary,
          keyPoints: editingKeyPoints,
          status: editingStatus,
        }),
      });
      if (res.ok) {
        toast.success('تم حفظ التعديلات بنجاح');
        setSelectedLesson({ ...selectedLesson, title: editingTitle, content: editingContent, summary: editingSummary, keyPoints: editingKeyPoints, status: editingStatus as Lesson['status'] });
        fetchUnits();
      } else {
        toast.error('فشل في حفظ التعديلات');
      }
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!selectedBookId) return;
    const exportData = { bookId: selectedBookId, units, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${selectedBookId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير المحتوى بنجاح');
  };

  const addKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setEditingKeyPoints([...editingKeyPoints, newKeyPoint.trim()]);
      setNewKeyPoint('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setEditingKeyPoints(editingKeyPoints.filter((_, i) => i !== index));
  };

  const statusLabels: Record<string, string> = {
    draft: 'مسودة',
    reviewed: 'مراجع',
    approved: 'موافق عليه',
  };

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
          لم يتم اختيار كتاب. اختر كتاباً من تبويب الكتب أولاً.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setActiveTab('books')}
        >
          <ArrowLeft className="w-4 h-4 ml-1" />
          الذهاب للكتب
        </Button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        <Skeleton className="rounded-xl h-full" />
        <Skeleton className="rounded-xl h-full lg:col-span-2" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
      {/* Left: Tree View */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">الوحدات والدروس</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="p-2">
            {units.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                لا يوجد محتوى مستخرج بعد
              </div>
            ) : (
              units.map((unit, unitIndex) => (
                <div key={unit.id}>
                  <button
                    onClick={() => toggleUnit(unit.id)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/80 transition-colors text-right"
                  >
                    {expandedUnits.has(unit.id) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-sm font-medium truncate">
                      الوحدة {unitIndex + 1}: {unit.title}
                    </span>
                  </button>
                  {expandedUnits.has(unit.id) && (
                    <div className="mr-6 space-y-0.5">
                      {unit.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson)}
                          className={`
                            w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-right
                            ${selectedLesson?.id === lesson.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/80'}
                          `}
                        >
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-xs truncate flex-1">
                            الدرس {lessonIndex + 1}: {lesson.title}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] shrink-0 ${
                              lesson.status === 'approved'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : lesson.status === 'reviewed'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-gray-500/15 text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {statusLabels[lesson.status]}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Right: Editor */}
      <Card className="lg:col-span-2 overflow-hidden">
        {selectedLesson ? (
          <div className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">تعديل الدرس</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={editingStatus} onValueChange={setEditingStatus}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="reviewed">مراجع</SelectItem>
                      <SelectItem value="approved">موافق عليه</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? (
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
              <div className="p-4 space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">العنوان</label>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">المحتوى</label>
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="min-h-[200px] text-sm"
                    placeholder="محتوى الدرس..."
                  />
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">الملخص</label>
                  <Textarea
                    value={editingSummary}
                    onChange={(e) => setEditingSummary(e.target.value)}
                    className="min-h-[100px] text-sm"
                    placeholder="ملخص الدرس..."
                  />
                </div>

                {/* Key Points */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">النقاط الرئيسية</label>
                  <div className="space-y-2">
                    {editingKeyPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <Input
                          value={point}
                          onChange={(e) => {
                            const updated = [...editingKeyPoints];
                            updated[index] = e.target.value;
                            setEditingKeyPoints(updated);
                          }}
                          className="text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive shrink-0"
                          onClick={() => removeKeyPoint(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newKeyPoint}
                        onChange={(e) => setNewKeyPoint(e.target.value)}
                        placeholder="نقطة جديدة..."
                        className="text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyPoint())}
                      />
                      <Button variant="outline" size="sm" onClick={addKeyPoint}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Edit className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              اختر درساً من القائمة لبدء التعديل
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}