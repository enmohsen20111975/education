'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Trash2,
  Download,
  ScrollText,
  BookOpen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  useFactoryStore,
  type LogEntry,
  type LogType,
} from '@/lib/factory-store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `منذ ${seconds} ثانية`;
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${days} يوم`;
}

function formatFullTime(ts: string): string {
  return new Date(ts).toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const logTypeConfig: Record<
  LogType,
  {
    icon: React.ElementType;
    label: string;
    border: string;
    bg: string;
    iconColor: string;
  }
> = {
  info: {
    icon: Info,
    label: 'معلومات',
    border: 'border-r-blue-500',
    bg: 'bg-blue-500/5',
    iconColor: 'text-blue-500',
  },
  success: {
    icon: CheckCircle,
    label: 'نجاح',
    border: 'border-r-emerald-500',
    bg: 'bg-emerald-500/5',
    iconColor: 'text-emerald-500',
  },
  warning: {
    icon: AlertTriangle,
    label: 'تحذير',
    border: 'border-r-yellow-500',
    bg: 'bg-yellow-500/5',
    iconColor: 'text-yellow-500',
  },
  error: {
    icon: XCircle,
    label: 'خطأ',
    border: 'border-r-red-500',
    bg: 'bg-red-500/5',
    iconColor: 'text-red-500',
  },
};

const filterButtons: { value: LogType | 'all'; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'info', label: 'معلومات' },
  { value: 'success', label: 'نجاح' },
  { value: 'warning', label: 'تحذير' },
  { value: 'error', label: 'أخطاء' },
];

// ─── Log Row Component ────────────────────────────────────────────────────────

function LogRow({ entry }: { entry: LogEntry }) {
  const config = logTypeConfig[entry.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
      className={`border-r-4 ${config.border} ${config.bg} rounded-lg p-3 sm:p-4`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed break-words">{entry.message}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
            <time
              title={formatFullTime(entry.timestamp)}
              className="flex items-center gap-1"
            >
              {formatTimestamp(entry.timestamp)}
            </time>
            {entry.bookId && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                معرّف الكتاب: {entry.bookId.slice(0, 8)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LogsTab() {
  const { logs, clearLogs } = useFactoryStore();
  const [activeFilter, setActiveFilter] = useState<LogType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  // ─── Filtered & Searched Logs ─────────────────────────────────────────────

  const filteredLogs = useMemo(() => {
    let result = logs;

    if (activeFilter !== 'all') {
      result = result.filter((l) => l.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          l.bookTitle?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [logs, activeFilter, searchQuery]);

  // ─── Log counts per type ──────────────────────────────────────────────────

  const logCounts = useMemo(() => {
    const counts: Record<string, number> = { all: logs.length };
    for (const l of logs) {
      counts[l.type] = (counts[l.type] || 0) + 1;
    }
    return counts;
  }, [logs]);

  // ─── Real-time demo log generation ────────────────────────────────────────
  // We listen to store changes and the logs will naturally update via the store.
  // Other tabs call addLog() which updates the store directly.

  useEffect(() => {
    // Add initial demo log if logs are empty
    if (logs.length === 0) {
      useFactoryStore.getState().addLog({
        type: 'info',
        message: 'تم فتح صفحة السجلات — جاهز لتسجيل الأنشطة',
      });
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Export Logs ──────────────────────────────────────────────────────────

  const handleExport = () => {
    if (logs.length === 0) {
      toast.info('لا توجد سجلات للتصدير');
      return;
    }
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير السجلات');
  };

  // ─── Clear Logs ───────────────────────────────────────────────────────────

  const handleClearLogs = () => {
    clearLogs();
    setShowClearDialog(false);
    toast.success('تم مسح جميع السجلات');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* ─── Top Bar ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4 mb-4"
      >
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => {
            const isActive = activeFilter === btn.value;
            return (
              <Button
                key={btn.value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={
                  isActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : ''
                }
                onClick={() => setActiveFilter(btn.value)}
              >
                {btn.label}
                {logCounts[btn.value] !== undefined && (
                  <span
                    className={`mr-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {logCounts[btn.value] || 0}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="البحث في السجلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 ml-1.5" />
              تصدير
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              disabled={logs.length === 0}
            >
              <Trash2 className="w-4 h-4 ml-1.5" />
              مسح السجلات
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ─── Log List ──────────────────────────────────────────────────────── */}
      <ScrollArea className="flex-1 max-h-[calc(100vh-16rem)]">
        {filteredLogs.length > 0 ? (
          <div className="space-y-2 pb-4">
            <AnimatePresence mode="popLayout">
              {filteredLogs.map((entry) => (
                <LogRow key={entry.id} entry={entry} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ScrollText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              لا توجد سجلات بعد
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              ستظهر هنا جميع الأنشطة والإشعارات
            </p>
          </motion.div>
        )}
      </ScrollArea>

      {/* ─── Clear Confirmation Dialog ─────────────────────────────────────── */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد مسح السجلات</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من مسح جميع السجلات؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowClearDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleClearLogs}
            >
              مسح الكل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}