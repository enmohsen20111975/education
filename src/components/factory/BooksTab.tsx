'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Play, Eye, Trash2, Loader2,
  CheckCircle, XCircle, AlertCircle, FileText, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import BookUploader from './BookUploader';
import { useFactoryStore } from '@/lib/factory-store';

export interface Book {
  id: string;
  title: string;
  filename: string;
  fileSize: number;
  totalPages: number;
  status: 'uploaded' | 'extracting' | 'extracted' | 'processing' | 'completed' | 'error';
  extractionProgress?: number;
  processingProgress?: number;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  uploaded: { label: 'مرفوع', color: 'bg-gray-500/15 text-gray-600 dark:text-gray-400', icon: <FileText className="w-3 h-3" /> },
  extracting: { label: 'جارٍ الاستخراج', color: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  extracted: { label: 'تم الاستخراج', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
  processing: { label: 'جارٍ المعالجة', color: 'bg-sky-500/15 text-sky-600 dark:text-sky-400', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  completed: { label: 'مكتمل', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400', icon: <CheckCircle className="w-3 h-3" /> },
  error: { label: 'خطأ', color: 'bg-red-500/15 text-red-600 dark:text-red-400', icon: <XCircle className="w-3 h-3" /> },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function BooksTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { setActiveTab, setSelectedBookId, setExtractionProgress, setProcessingProgress, setIsExtracting, setIsProcessing } = useFactoryStore();

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : data.books || []);
      }
    } catch {
      toast.error('فشل في تحميل الكتب');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/books/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم حذف الكتاب بنجاح');
        setBooks((prev) => prev.filter((b) => b.id !== deleteId));
      } else {
        toast.error('فشل في حذف الكتاب');
      }
    } catch {
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleExtract = async (bookId: string) => {
    setIsExtracting(true);
    setExtractionProgress(0);
    setSelectedBookId(bookId);
    try {
      const res = await fetch(`/api/books/${bookId}/extract`, { method: 'POST' });
      if (res.ok) {
        toast.success('بدأ استخراج النص');
        setBooks((prev) =>
          prev.map((b) =>
            b.id === bookId ? { ...b, status: 'extracting' } : b
          )
        );
        setActiveTab('extraction');
      } else {
        toast.error('فشل في بدء الاستخراج');
        setIsExtracting(false);
      }
    } catch {
      toast.error('حدث خطأ');
      setIsExtracting(false);
    }
  };

  const handleProcess = async (bookId: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setSelectedBookId(bookId);
    try {
      const res = await fetch(`/api/books/${bookId}/process`, { method: 'POST' });
      if (res.ok) {
        toast.success('بدأت معالجة المحتوى بالذكاء الاصطناعي');
        setBooks((prev) =>
          prev.map((b) =>
            b.id === bookId ? { ...b, status: 'processing' } : b
          )
        );
        setActiveTab('extraction');
      } else {
        toast.error('فشل في بدء المعالجة');
        setIsProcessing(false);
      }
    } catch {
      toast.error('حدث خطأ');
      setIsProcessing(false);
    }
  };

  const handleView = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveTab('extraction');
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">رفع كتاب جديد</h2>
        <BookUploader onUploadSuccess={fetchBooks} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">الكتب المرفوعة</h2>
        <Button variant="outline" size="sm" onClick={fetchBooks}>
          <RefreshCw className="w-4 h-4 ml-1" />
          تحديث
        </Button>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            لا توجد كتب محملة بعد. قم برفع كتاب PDF للبدء.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book, index) => {
            const status = statusConfig[book.status] || statusConfig.uploaded;
            const showProgress = book.status === 'extracting' || book.status === 'processing';

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {book.title || book.filename}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {book.filename}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatSize(book.fileSize)}</span>
                      <span>•</span>
                      <span>{book.totalPages || 0} صفحة</span>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant="secondary"
                      className={`${status.color} text-xs gap-1`}
                    >
                      {status.icon}
                      {status.label}
                    </Badge>

                    {/* Progress Bar */}
                    {showProgress && (
                      <div className="space-y-1">
                        <Progress
                          value={book.status === 'extracting' ? (book.extractionProgress || 0) : (book.processingProgress || 0)}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          {book.status === 'extracting'
                            ? `${book.extractionProgress || 0}%`
                            : `${book.processingProgress || 0}%`}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      {book.status === 'uploaded' && (
                        <Button
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleExtract(book.id)}
                        >
                          <Play className="w-3.5 h-3.5 ml-1" />
                          بدء الاستخراج
                        </Button>
                      )}
                      {book.status === 'extracted' && (
                        <Button
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleProcess(book.id)}
                        >
                          <Play className="w-3.5 h-3.5 ml-1" />
                          بدء المعالجة
                        </Button>
                      )}
                      {(book.status === 'extracting' || book.status === 'processing') && (
                        <Button size="sm" className="flex-1 text-xs" disabled>
                          <Loader2 className="w-3.5 h-3.5 ml-1 animate-spin" />
                          جارٍ التنفيذ...
                        </Button>
                      )}
                      {(book.status === 'extracted' || book.status === 'completed') && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleView(book.id)}
                        >
                          <Eye className="w-3.5 h-3.5 ml-1" />
                          عرض
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(book.id)}
                        disabled={book.status === 'extracting' || book.status === 'processing'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الكتاب؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 ml-1" />
              )}
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}