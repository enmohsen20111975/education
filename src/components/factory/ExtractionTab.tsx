'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, Circle, Loader2, Play, ArrowLeft,
  BookOpen, AlertCircle, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useFactoryStore } from '@/lib/factory-store';

interface PageResult {
  pageNumber: number;
  textPreview: string;
  status: 'pending' | 'processing' | 'success' | 'error';
}

interface BookDetail {
  id: string;
  title: string;
  status: string;
  totalPages: number;
  progress: number;
  error?: string;
}

const steps = [
  { id: 1, label: 'رفع الكتاب', icon: BookOpen },
  { id: 2, label: 'استخراج النص بالـ OCR', icon: Circle },
  { id: 3, label: 'تنظيم المحتوى بالذكاء الاصطناعي', icon: Circle },
  { id: 4, label: 'المراجعة والموافقة', icon: Circle },
];

function getStepStatus(stepId: number, bookStatus: string, progress: number): 'completed' | 'current' | 'pending' {
  if (stepId === 1) return bookStatus ? 'completed' : 'pending';
  if (stepId === 2) {
    if (bookStatus === 'extracted' || bookStatus === 'processing' || bookStatus === 'completed') return 'completed';
    if (bookStatus === 'extracting') return 'current';
    return 'pending';
  }
  if (stepId === 3) {
    if (bookStatus === 'completed') return 'completed';
    if (bookStatus === 'processing') return 'current';
    return 'pending';
  }
  if (stepId === 4) {
    if (bookStatus === 'completed') return 'completed';
    return 'pending';
  }
  return 'pending';
}

export default function ExtractionTab() {
  const { selectedBookId, setActiveTab, extractionProgress, setExtractionProgress, processingProgress, setProcessingProgress } = useFactoryStore();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [pages, setPages] = useState<PageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingExtraction, setStartingExtraction] = useState(false);
  const [startingProcessing, setStartingProcessing] = useState(false);

  const fetchBookData = useCallback(async () => {
    if (!selectedBookId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [bookRes, pagesRes] = await Promise.all([
        fetch(`/api/books/${selectedBookId}`),
        fetch(`/api/books/${selectedBookId}/pages`),
      ]);
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        setBook(bookData.book || bookData);
        setExtractionProgress(bookData.extractionProgress || 0);
        setProcessingProgress(bookData.processingProgress || 0);
      }
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        const pagesList = Array.isArray(pagesData) ? pagesData : pagesData.pages || [];
        setPages(pagesList.map((p: any) => ({
          pageNumber: p.pageNumber,
          textPreview: p.ocrText || '',
          status: p.status === 'done' ? 'success' : p.status === 'processing' ? 'processing' : p.status === 'error' ? 'error' : 'pending',
        })));
      }
    } catch {
      toast.error('فشل في تحميل بيانات الكتاب');
    } finally {
      setLoading(false);
    }
  }, [selectedBookId, setExtractionProgress, setProcessingProgress]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  // Poll progress during active operations
  useEffect(() => {
    if (!selectedBookId) return;
    const isActive = book?.status === 'extracting' || book?.status === 'processing';
    if (!isActive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/books/${selectedBookId}`);
        if (res.ok) {
          const data = await res.json();
          const bookData = data.book || data;
          setBook(bookData);
          setExtractionProgress(bookData.progress || 0);
          setProcessingProgress(bookData.progress || 0);
        }
      } catch { /* silent */ }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedBookId, book?.status, setExtractionProgress, setProcessingProgress]);

  const handleStartExtraction = async () => {
    if (!selectedBookId) return;
    setStartingExtraction(true);
    try {
      const res = await fetch(`/api/books/${selectedBookId}/extract`, { method: 'POST' });
      if (res.ok) {
        toast.success('بدأ استخراج النص');
        fetchBookData();
      } else {
        toast.error('فشل في بدء الاستخراج');
      }
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setStartingExtraction(false);
    }
  };

  const handleStartProcessing = async () => {
    if (!selectedBookId) return;
    setStartingProcessing(true);
    try {
      const res = await fetch(`/api/books/${selectedBookId}/process`, { method: 'POST' });
      if (res.ok) {
        toast.success('بدأت معالجة المحتوى بالذكاء الاصطناعي');
        fetchBookData();
      } else {
        toast.error('فشل في بدء المعالجة');
      }
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setStartingProcessing(false);
    }
  };

  if (!selectedBookId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
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
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  const currentProgress = book?.progress || 0;
  const isActive = book?.status === 'extracting' || book?.status === 'processing';

  return (
    <div className="space-y-6">
      {/* Book Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{book?.title || 'كتاب'}</h2>
          <p className="text-sm text-muted-foreground">{book?.totalPages || 0} صفحة</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchBookData}>
            <RefreshCw className="w-4 h-4 ml-1" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Steps Visualization */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-6 right-6 left-6 h-0.5 bg-border" />
            <div
              className="absolute top-6 right-6 h-0.5 bg-primary transition-all duration-700"
              style={{
                width: `${(book?.status === 'extracted' || book?.status === 'processing' || book?.status === 'completed') ? '100%' : book?.status === 'extracting' ? '33%' : '0%'}`,
              }}
            />

            {steps.map((step) => {
              const status = getStepStatus(step.id, book?.status || '', currentProgress);
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                      ${status === 'completed' ? 'bg-primary text-primary-foreground' : ''}
                      ${status === 'current' ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                      ${status === 'pending' ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : status === 'current' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className={`text-xs text-center max-w-[120px] leading-tight ${status === 'pending' ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          {isActive && (
            <div className="mt-6 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {book?.status === 'extracting' ? 'استخراج النص...' : 'معالجة المحتوى...'}
                </span>
                <span className="font-medium">{currentProgress}%</span>
              </div>
              <Progress value={currentProgress} className="h-3" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3">
            {(!book?.status || book.status === 'uploaded' || book.status === 'error') && (
              <Button onClick={handleStartExtraction} disabled={startingExtraction}>
                {startingExtraction ? (
                  <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 ml-1" />
                )}
                بدء الاستخراج
              </Button>
            )}
            {(book?.status === 'extracted') && (
              <Button onClick={handleStartProcessing} disabled={startingProcessing}>
                {startingProcessing ? (
                  <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 ml-1" />
                )}
                بدء المعالجة
              </Button>
            )}
            {book?.status === 'completed' && (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1">
                <CheckCircle className="w-4 h-4 ml-1" />
                اكتمل بنجاح
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">نتائج الاستخراج لكل صفحة</CardTitle>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              لا توجد نتائج استخراج بعد. ابدأ الاستخراج أولاً.
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2">
                {pages.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium">{page.pageNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">
                        {page.textPreview || 'لا يوجد نص مستخرج'}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs shrink-0 ${
                        page.status === 'success'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : page.status === 'error'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                          : page.status === 'processing'
                          ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                          : 'bg-gray-500/15 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {page.status === 'success' ? 'نجاح' : page.status === 'error' ? 'خطأ' : page.status === 'processing' ? 'جارٍ' : 'في الانتظار'}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}