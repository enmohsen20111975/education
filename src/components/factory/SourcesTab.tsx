'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Image as ImageIcon, Globe,
  Loader2, X, Play, Eye, Trash2, Search,
  CheckCircle, XCircle, AlertCircle, RefreshCw, File
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useFactoryStore } from '@/lib/factory-store';

type UploadType = 'pdf' | 'images' | 'url';

interface BookItem {
  id: string;
  title: string;
  filename: string;
  fileSize: number;
  totalPages: number;
  status: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  uploaded: { label: 'مرفوع', color: 'bg-gray-500/15 text-gray-600 dark:text-gray-400', icon: <FileText className="w-3 h-3" /> },
  extracting: { label: 'جارٍ الاستخراج', color: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  extracted: { label: 'تم الاستخراج', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
  processing: { label: 'جارٍ المعالجة', color: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  completed: { label: 'مكتمل', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
  error: { label: 'خطأ', color: 'bg-red-500/15 text-red-600 dark:text-red-400', icon: <XCircle className="w-3 h-3" /> },
};

function formatSize(bytes: number): string {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatStatusAr(status: string): string {
  return statusConfig[status]?.label || status;
}

export default function SourcesTab() {
  const { setActiveTab, setSelectedBookId, setExtractionProgress, setIsExtracting } = useFactoryStore();
  const [activeUploadType, setActiveUploadType] = useState<UploadType>('pdf');
  const [books, setBooks] = useState<BookItem[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // PDF Upload state
  const [pdfDragging, setPdfDragging] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Images Upload state
  const [imgDragging, setImgDragging] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgProgress, setImgProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // URL state
  const [urlInput, setUrlInput] = useState('');
  const [urlFetching, setUrlFetching] = useState(false);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        const bookList = Array.isArray(data) ? data : data.books || [];
        setBooks(bookList);
        setFilteredBooks(bookList);
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

  // Filter books by search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredBooks(
      books.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.filename?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, books]);

  // PDF Upload
  const handlePdfFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('يرجى اختيار ملف PDF فقط');
      return;
    }
    setPdfUploading(true);
    setPdfProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setPdfProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          toast.success(`تم رفع "${file.name}" بنجاح`);
          fetchBooks();
        } else {
          toast.error('فشل في رفع الملف');
        }
        setPdfUploading(false);
        setPdfProgress(0);
      });
      xhr.addEventListener('error', () => {
        toast.error('حدث خطأ أثناء رفع الملف');
        setPdfUploading(false);
        setPdfProgress(0);
      });
      xhr.open('POST', '/api/books');
      xhr.send(formData);
    } catch {
      toast.error('حدث خطأ أثناء رفع الملف');
      setPdfUploading(false);
    }
  }, [fetchBooks]);

  // Images Upload
  const handleImagesFiles = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) =>
      f.type === 'image/png' || f.type === 'image/jpeg' || f.type === 'image/jpg'
    );
    if (validFiles.length === 0) {
      toast.error('يرجى اختيار صور PNG أو JPG فقط');
      return;
    }
    setSelectedImages((prev) => [...prev, ...validFiles]);
  }, []);

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = useCallback(async () => {
    if (selectedImages.length === 0) return;
    setImgUploading(true);
    setImgProgress(0);

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const formData = new FormData();
        formData.append('file', selectedImages[i]);
        formData.append('title', selectedImages[i].name.replace(/\.[^.]+$/, ''));

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const fileProgress = (e.loaded / e.total) * 100;
            const overallProgress = ((i + fileProgress / 100) / selectedImages.length) * 100;
            setImgProgress(Math.round(overallProgress));
          }
        });

        await new Promise<void>((resolve) => {
          xhr.addEventListener('load', () => resolve());
          xhr.addEventListener('error', () => resolve());
          xhr.open('POST', '/api/books');
          xhr.send(formData);
        });
      }
      toast.success(`تم رفع ${selectedImages.length} ملف بنجاح`);
      setSelectedImages([]);
      fetchBooks();
    } catch {
      toast.error('حدث خطأ أثناء رفع الصور');
    } finally {
      setImgUploading(false);
      setImgProgress(0);
    }
  }, [selectedImages, fetchBooks]);

  // URL Fetch (placeholder)
  const handleUrlFetch = () => {
    if (!urlInput.trim()) {
      toast.error('يرجى إدخال رابط صحيح');
      return;
    }
    setUrlFetching(true);
    setTimeout(() => {
      setUrlFetching(false);
      toast.info('سيتم إضافة هذه الميزة قريباً');
    }, 1500);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/books/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم حذف الكتاب بنجاح');
        fetchBooks();
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

  // Actions
  const handleExtract = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsExtracting(true);
    setExtractionProgress(0);
    fetch(`/api/books/${bookId}/extract`, { method: 'POST' })
      .then((res) => {
        if (res.ok) {
          toast.success('بدأ استخراج النص');
          setActiveTab('extraction');
        } else {
          toast.error('فشل في بدء الاستخراج');
        }
      })
      .catch(() => toast.error('حدث خطأ'));
  };

  const handleView = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveTab('extraction');
  };

  // Drag handlers for PDF
  const pdfDragOver = (e: React.DragEvent) => { e.preventDefault(); setPdfDragging(true); };
  const pdfDragLeave = (e: React.DragEvent) => { e.preventDefault(); setPdfDragging(false); };
  const pdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPdfDragging(false);
    if (e.dataTransfer.files.length > 0) handlePdfFile(e.dataTransfer.files[0]);
  };

  // Drag handlers for Images
  const imgDragOver = (e: React.DragEvent) => { e.preventDefault(); setImgDragging(true); };
  const imgDragLeave = (e: React.DragEvent) => { e.preventDefault(); setImgDragging(false); };
  const imgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImgDragging(false);
    if (e.dataTransfer.files.length > 0) handleImagesFiles(e.dataTransfer.files);
  };

  // Image thumbnail previews
  const imagePreviews = selectedImages.map((img) => URL.createObjectURL(img));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">المصادر</h2>
        <p className="text-sm text-muted-foreground">رفع الكتب والصور من مصادر متعددة</p>
      </div>

      {/* Upload Type Tabs */}
      <Tabs value={activeUploadType} onValueChange={(v) => setActiveUploadType(v as UploadType)} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="pdf" className="gap-1.5 text-xs">
            <FileText className="w-3.5 h-3.5" />
            ملف PDF
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-1.5 text-xs">
            <ImageIcon className="w-3.5 h-3.5" />
            صور (PNG/JPG)
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-1.5 text-xs">
            <Globe className="w-3.5 h-3.5" />
            رابط ويب
          </TabsTrigger>
        </TabsList>

        {/* PDF Upload */}
        <TabsContent value="pdf" className="mt-4">
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handlePdfFile(e.target.files[0]);
              e.target.value = '';
            }}
            className="hidden"
          />
          <div
            onClick={() => !pdfUploading && pdfInputRef.current?.click()}
            onDragOver={pdfDragOver}
            onDragLeave={pdfDragLeave}
            onDrop={pdfDrop}
            className={`
              relative flex flex-col items-center justify-center gap-3
              border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-200
              ${pdfDragging
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
              ${pdfUploading ? 'pointer-events-none opacity-60' : ''}
            `}
          >
            {pdfUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-medium">جارٍ رفع الملف...</p>
                <div className="w-full max-w-xs">
                  <Progress value={pdfProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">{pdfProgress}%</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">اسحب ملف PDF هنا أو اضغط للاختيار</p>
                  <p className="text-xs text-muted-foreground mt-1">يدعم ملفات PDF فقط</p>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Images Upload */}
        <TabsContent value="images" className="mt-4">
          <input
            ref={imgInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handleImagesFiles(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />
          <div
            onClick={() => !imgUploading && imgInputRef.current?.click()}
            onDragOver={imgDragOver}
            onDragLeave={imgDragLeave}
            onDrop={imgDrop}
            className={`
              relative flex flex-col items-center justify-center gap-3
              border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-200
              ${imgDragging
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
              ${imgUploading ? 'pointer-events-none opacity-60' : ''}
            `}
          >
            {imgUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-medium">جارٍ رفع الصور...</p>
                <div className="w-full max-w-xs">
                  <Progress value={imgProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">{imgProgress}%</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">اسحب الصور هنا أو اضغط للاختيار</p>
                  <p className="text-xs text-muted-foreground mt-1">يدعم PNG و JPG — يمكن اختيار عدة صور</p>
                </div>
              </>
            )}
          </div>

          {/* Image Thumbnails */}
          <AnimatePresence>
            {selectedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    الصور المختارة ({selectedImages.length})
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive text-xs"
                      onClick={() => setSelectedImages([])}
                    >
                      <X className="w-3.5 h-3.5 ml-1" />
                      إزالة الكل
                    </Button>
                    <Button size="sm" onClick={uploadImages} disabled={imgUploading}>
                      <Upload className="w-3.5 h-3.5 ml-1" />
                      رفع الكل
                    </Button>
                  </div>
                </div>
                <ScrollArea className="max-h-48">
                  <div className="flex flex-wrap gap-3">
                    {selectedImages.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden border bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreviews[idx]}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-[10px] text-muted-foreground mt-1 w-20 truncate text-center">
                          {img.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Web URL */}
        <TabsContent value="url" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium">رابط الصفحة</label>
                  <Input
                    placeholder="https://example.com/page"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch()}
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <Button onClick={handleUrlFetch} disabled={urlFetching} className="shrink-0">
                  {urlFetching ? (
                    <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 ml-1" />
                  )}
                  جلب المحتوى
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                أدخل رابط صفحة ويب لاستخراج المحتوى النصي منها. هذه الميزة قيد التطوير.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Books List */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold">الكتب المرفوعة ({filteredBooks.length})</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث في الكتب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-sm h-9 w-full sm:w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchBooks}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-0">
              <div className="space-y-3 p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredBooks.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center">
                <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد كتب مرفوعة بعد'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-xs">العنوان</TableHead>
                    <TableHead className="text-right text-xs hidden sm:table-cell">الملف</TableHead>
                    <TableHead className="text-right text-xs hidden md:table-cell">الحجم</TableHead>
                    <TableHead className="text-right text-xs hidden md:table-cell">الصفحات</TableHead>
                    <TableHead className="text-right text-xs">الحالة</TableHead>
                    <TableHead className="text-right text-xs">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => {
                    const status = statusConfig[book.status] || statusConfig.uploaded;
                    return (
                      <TableRow key={book.id} className="group">
                        <TableCell className="font-medium text-sm py-3">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {book.title || book.filename}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden sm:table-cell truncate max-w-[150px]">
                          {book.filename}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                          {formatSize(book.fileSize)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                          {book.totalPages || 0}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${status.color} text-xs gap-1`}>
                            {status.icon}
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {(book.status === 'uploaded' || book.status === 'error') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleExtract(book.id)}
                              >
                                <Play className="w-3.5 h-3.5 ml-0.5" />
                                استخراج
                              </Button>
                            )}
                            {(book.status === 'extracted' || book.status === 'completed') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleView(book.id)}
                              >
                                <Eye className="w-3.5 h-3.5 ml-0.5" />
                                عرض
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(book.id)}
                              disabled={book.status === 'extracting' || book.status === 'processing'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        )}
      </div>

      {/* Delete Dialog */}
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
    </motion.div>
  );
}