'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, FileText, Layers, Activity,
  Upload, Zap, Edit, Bot,
  CheckCircle, XCircle, AlertCircle, Info, Loader2, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useFactoryStore, type TabType } from '@/lib/factory-store';

interface StatsData {
  totalBooks: number;
  totalPages: number;
  totalUnits: number;
  totalLessons: number;
  activeOperations: number;
}

interface ServiceInfo {
  name: string;
  available: boolean;
  message: string;
}

interface BookItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

const statCards = [
  {
    key: 'totalBooks' as const,
    label: 'إجمالي الكتب',
    icon: BookOpen,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    trendLabel: 'كتاب',
  },
  {
    key: 'totalPages' as const,
    label: 'الصفحات المستخرجة',
    icon: FileText,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    trendLabel: 'صفحة',
  },
  {
    key: 'totalLessons' as const,
    label: 'الوحدات والدروس',
    icon: Layers,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    trendLabel: 'وحدة/درس',
  },
  {
    key: 'activeOperations' as const,
    label: 'العمليات النشطة',
    icon: Activity,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10',
    trendLabel: 'عملية',
  },
];

const quickActions = [
  {
    label: 'رفع كتاب جديد',
    icon: Upload,
    tab: 'books' as TabType,
    description: 'رفع ملف PDF أو صور',
  },
  {
    label: 'بدء الاستخراج',
    icon: Zap,
    tab: 'extraction' as TabType,
    description: 'استخراج النص من الكتب',
  },
  {
    label: 'مراجعة المحتوى',
    icon: Edit,
    tab: 'content' as TabType,
    description: 'تعديل ومراجعة الدروس',
  },
  {
    label: 'إدارة النماذج',
    icon: Bot,
    tab: 'models' as TabType,
    description: 'نماذج الذكاء الاصطناعي',
  },
];

const logTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  info: {
    icon: <Info className="w-4 h-4" />,
    color: 'text-sky-500',
  },
  success: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-emerald-500',
  },
  warning: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-amber-500',
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-500',
  },
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'الآن';
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `منذ ${diffHr} ساعة`;
  const diffDay = Math.floor(diffHr / 24);
  return `منذ ${diffDay} يوم`;
}

function generateLogsFromBooks(books: BookItem[]): LogEntry[] {
  const logs: LogEntry[] = [];
  for (const book of books.slice(0, 5)) {
    let type: LogEntry['type'] = 'info';
    let msg = `تم رفع كتاب "${book.title}"`;
    if (book.status === 'completed') {
      type = 'success';
      msg = `اكتملت معالجة كتاب "${book.title}"`;
    } else if (book.status === 'extracting' || book.status === 'processing') {
      type = 'warning';
      msg = `جارٍ ${book.status === 'extracting' ? 'استخراج' : 'معالجة'} كتاب "${book.title}"`;
    } else if (book.status === 'error') {
      type = 'error';
      msg = `حدث خطأ في كتاب "${book.title}"`;
    } else if (book.status === 'extracted') {
      type = 'success';
      msg = `تم استخراج نص كتاب "${book.title}"`;
    }
    logs.push({
      id: book.id,
      type,
      message: msg,
      timestamp: book.createdAt,
    });
  }
  return logs;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function HomeTab() {
  const { setActiveTab, setSelectedBookId } = useFactoryStore();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<{ lmstudio: { available: boolean; models: any[] }; ollama: { available: boolean; models: any[] } } | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, servicesRes, booksRes, modelsRes] = await Promise.allSettled([
        fetch('/api/stats'),
        fetch('/api/services/status'),
        fetch('/api/books'),
        fetch('/api/models'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json();
        setStats(data);
      }

      if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
        const data = await servicesRes.value.json();
        setServices(data.services || []);
      }

      if (booksRes.status === 'fulfilled' && booksRes.value.ok) {
        const data = await booksRes.value.json();
        const bookList = Array.isArray(data) ? data : data.books || [];
        setBooks(bookList);
        setLogs(generateLogsFromBooks(bookList));
      }

      if (modelsRes.status === 'fulfilled' && modelsRes.value.ok) {
        const data = await modelsRes.value.json();
        setModels(data);
      }
    } catch {
      toast.error('فشل في تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const totalModels =
    (models?.lmstudio?.models?.length || 0) + (models?.ollama?.models?.length || 0);

  const lmStudio = services.find((s) => s.name === 'LM Studio');
  const ollama = services.find((s) => s.name === 'Ollama');

  if (loading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">لوحة التحكم</h2>
          <p className="text-sm text-muted-foreground">نظرة عامة على مصنع النصوص</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboard}>
          <RefreshCw className="w-4 h-4 ml-1" />
          تحديث
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats ? stats[card.key] : 0;
          return (
            <motion.div key={card.key} variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-muted">
                      {card.trendLabel}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-semibold mb-3">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                  onClick={() => setActiveTab(action.tab)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Activity + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Activity className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">لا يوجد نشاط بعد</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ابدأ برفع كتاب لرؤية النشاط هنا
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-72">
                  <div className="space-y-1">
                    {logs.map((log) => {
                      const config = logTypeConfig[log.type];
                      return (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className={`${config.color} mt-0.5 shrink-0`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-relaxed line-clamp-2">{log.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {formatTimeAgo(log.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">حالة النظام</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {/* LM Studio */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${lmStudio?.available ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-sm font-medium">LM Studio</p>
                    <p className="text-[11px] text-muted-foreground">
                      {lmStudio?.available ? 'متصل - المنفذ 1234' : 'غير متصل'}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={lmStudio?.available
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/15 text-red-600 dark:text-red-400'
                  }
                >
                  {lmStudio?.available ? 'متصل' : 'غير متصل'}
                </Badge>
              </div>

              {/* Ollama */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${ollama?.available ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-sm font-medium">Ollama</p>
                    <p className="text-[11px] text-muted-foreground">
                      {ollama?.available ? 'متصل - المنفذ 11434' : 'غير متصل'}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={ollama?.available
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/15 text-red-600 dark:text-red-400'
                  }
                >
                  {ollama?.available ? 'متصل' : 'غير متصل'}
                </Badge>
              </div>

              <Separator />

              {/* Models Count */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">النماذج المتاحة</p>
                    <p className="text-[11px] text-muted-foreground">
                      نماذج الذكاء الاصطناعي المحملة
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  {totalModels}
                </Badge>
              </div>

              {/* Tesseract */}
              {(() => {
                const tesseract = services.find((s) => s.name === 'Tesseract');
                return tesseract && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tesseract.available ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <div>
                        <p className="text-sm font-medium">Tesseract OCR</p>
                        <p className="text-[11px] text-muted-foreground">محرك التعرف على النصوص</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={tesseract.available
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/15 text-red-600 dark:text-red-400'
                      }
                    >
                      {tesseract.available ? 'مثبت' : 'غير مثبت'}
                    </Badge>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}