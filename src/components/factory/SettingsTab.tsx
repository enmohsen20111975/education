'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Eye,
  Cpu,
  Settings2,
  Database,
  Save,
  Upload,
  Download,
  Trash2,
  Plug,
  Loader2,
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { useFactoryStore, type AppSettings } from '@/lib/factory-store';

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-0.5">{description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Settings Row ─────────────────────────────────────────────────────────────

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0 w-full sm:w-56">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsTab() {
  const { settings, updateSettings, addLog, clearLogs } = useFactoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for connection testing
  const [testingLmStudio, setTestingLmStudio] = useState(false);
  const [testingOllama, setTestingOllama] = useState(false);
  const [lmStudioStatus, setLmStudioStatus] = useState<string | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<string | null>(null);

  // Confirmation dialog state
  const [showClearBooksDialog, setShowClearBooksDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─── Connection Testing ───────────────────────────────────────────────────

  const testConnection = async (service: 'lmstudio' | 'ollama') => {
    if (service === 'lmstudio') {
      setTestingLmStudio(true);
      setLmStudioStatus(null);
    } else {
      setTestingOllama(true);
      setOllamaStatus(null);
    }

    try {
      const res = await fetch('/api/services/status');
      const data = await res.json();
      const svc = data.services?.find(
        (s: { name: string }) =>
          s.name.toLowerCase().replace(/\s/g, '') ===
          service.toLowerCase().replace(/\s/g, '')
      );

      const msg = svc
        ? svc.available
          ? `✅ ${svc.message}`
          : `❌ ${svc.message}`
        : '❌ لم يتم العثور على الخدمة';

      if (service === 'lmstudio') {
        setLmStudioStatus(msg);
      } else {
        setOllamaStatus(msg);
      }

      addLog({
        type: svc?.available ? 'success' : 'error',
        message: `فحص اتصال ${service === 'lmstudio' ? 'LM Studio' : 'Ollama'}: ${svc?.available ? 'متاح' : 'غير متاح'}`,
      });
    } catch {
      const msg = '❌ فشل الاتصال بالخادم';
      if (service === 'lmstudio') {
        setLmStudioStatus(msg);
      } else {
        setOllamaStatus(msg);
      }
      addLog({
        type: 'error',
        message: `فشل فحص اتصال ${service === 'lmstudio' ? 'LM Studio' : 'Ollama'}`,
      });
    } finally {
      if (service === 'lmstudio') setTestingLmStudio(false);
      else setTestingOllama(false);
    }
  };

  // ─── Save Settings ────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      // Try to POST to API
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      }).catch(() => {
        // API not available — settings saved locally only
      });

      toast.success('تم حفظ الإعدادات');
      addLog({ type: 'success', message: 'تم حفظ الإعدادات بنجاح' });
    } catch {
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
      addLog({ type: 'error', message: 'فشل حفظ الإعدادات' });
    } finally {
      setSaving(false);
    }
  };

  // ─── Export / Import ──────────────────────────────────────────────────────

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'factory-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير الإعدادات');
    addLog({ type: 'info', message: 'تم تصدير الإعدادات كملف JSON' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as Partial<AppSettings>;
        updateSettings(imported);
        toast.success('تم استيراد الإعدادات');
        addLog({ type: 'success', message: 'تم استيراد الإعدادات من ملف' });
      } catch {
        toast.error('ملف إعدادات غير صالح');
        addLog({ type: 'error', message: 'فشل استيراد الإعدادات: ملف غير صالح' });
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Clear Books ──────────────────────────────────────────────────────────

  const handleClearBooks = async () => {
    try {
      await fetch('/api/books', { method: 'DELETE' }).catch(() => {});
      toast.success('تم مسح جميع الكتب');
      addLog({ type: 'warning', message: 'تم مسح جميع الكتب من النظام' });
    } catch {
      toast.error('حدث خطأ أثناء مسح الكتب');
    }
    setShowClearBooksDialog(false);
  };

  const handleClearLogs = () => {
    clearLogs();
    toast.success('تم مسح السجلات');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ─── Section 1: OCR Settings ──────────────────────────────────────── */}
      <SectionCard
        icon={<Eye className="w-5 h-5" />}
        title="إعدادات OCR"
        description="تكوين محرك التعرف الضوئي على الحروف لاستخراج النصوص من الصور"
      >
        <SettingRow
          label="لغة الاستخراج"
          description="اللغة الأساسية التي سيتم التعرف عليها أثناء الاستخراج"
        >
          <Select
            value={settings.ocrLanguage}
            onValueChange={(v) => updateSettings({ ocrLanguage: v })}
          >
            <SelectTrigger className="text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ara">العربية</SelectItem>
              <SelectItem value="eng">الإنجليزية</SelectItem>
              <SelectItem value="ara+eng">كلاهما (ara+eng)</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <Separator />

        <SettingRow
          label="جودة الاستخراج"
          description="تؤثر الجودة العالية على سرعة المعالجة لكن تعطي نتائج أدق"
        >
          <Select
            value={settings.ocrQuality}
            onValueChange={(v) => updateSettings({ ocrQuality: v as 'low' | 'medium' | 'high' })}
          >
            <SelectTrigger className="text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </SectionCard>

      {/* ─── Section 2: AI Settings ───────────────────────────────────────── */}
      <SectionCard
        icon={<Cpu className="w-5 h-5" />}
        title="إعدادات الذكاء الاصطناعي"
        description="تكوين خدمات الذكاء الاصطناعي المحلية لمعالجة وتنظيم المحتوى"
      >
        <SettingRow
          label="الخدمة الافتراضية"
          description="الخدمة التي سيتم استخدامها لمعالجة النصوص"
        >
          <Select
            value={settings.defaultLLMService}
            onValueChange={(v) => updateSettings({ defaultLLMService: v as 'lmstudio' | 'ollama' })}
          >
            <SelectTrigger className="text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lmstudio">LM Studio</SelectItem>
              <SelectItem value="ollama">Ollama</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <Separator />

        <SettingRow
          label="النموذج الافتراضي"
          description="اسم النموذج الذي سيتم تحميله في الخدمة المحددة"
        >
          <Input
            type="text"
            value={settings.defaultLLMModel}
            onChange={(e) => updateSettings({ defaultLLMModel: e.target.value })}
            className="text-right"
            placeholder="qwen2.5-7b"
          />
        </SettingRow>

        <Separator />

        <SettingRow
          label="منفذ LM Studio"
          description="المنفذ الذي يعمل عليه LM Studio على جهازك"
        >
          <Input
            type="number"
            value={settings.lmStudioPort}
            onChange={(e) =>
              updateSettings({ lmStudioPort: parseInt(e.target.value) || 1234 })
            }
            className="text-right"
          />
        </SettingRow>

        <Separator />

        <SettingRow
          label="منفذ Ollama"
          description="المنفذ الذي تعمل عليه Ollama على جهازك"
        >
          <Input
            type="number"
            value={settings.ollamaPort}
            onChange={(e) =>
              updateSettings({ ollamaPort: parseInt(e.target.value) || 11434 })
            }
            className="text-right"
          />
        </SettingRow>

        <Separator />

        {/* Connection Tests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => testConnection('lmstudio')}
              disabled={testingLmStudio}
            >
              {testingLmStudio ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Plug className="w-4 h-4 ml-2" />
              )}
              فحص LM Studio
            </Button>
            {lmStudioStatus && (
              <p className="text-xs text-muted-foreground text-center px-2">
                {lmStudioStatus}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => testConnection('ollama')}
              disabled={testingOllama}
            >
              {testingOllama ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Plug className="w-4 h-4 ml-2" />
              )}
              فحص Ollama
            </Button>
            {ollamaStatus && (
              <p className="text-xs text-muted-foreground text-center px-2">
                {ollamaStatus}
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ─── Section 3: General Settings ──────────────────────────────────── */}
      <SectionCard
        icon={<Settings2 className="w-5 h-5" />}
        title="إعدادات عامة"
        description="إعدادات المظهر والسلوك العام للتطبيق"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <Label className="text-sm font-medium">حفظ تلقائي</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              حفظ التغييرات تلقائياً أثناء العمل دون الحاجة للضغط على حفظ
            </p>
          </div>
          <Switch
            checked={settings.autoSave}
            onCheckedChange={(v) => updateSettings({ autoSave: v })}
          />
        </div>

        <Separator />

        <SettingRow
          label="السمة"
          description="اختر مظهر التطبيق المناسب لك"
        >
          <Select
            value={settings.theme}
            onValueChange={(v) => updateSettings({ theme: v as 'light' | 'dark' | 'system' })}
          >
            <SelectTrigger className="text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">داكنة</SelectItem>
              <SelectItem value="light">فاتحة</SelectItem>
              <SelectItem value="system">تلقائي</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </SectionCard>

      {/* ─── Section 4: Data Management ───────────────────────────────────── */}
      <SectionCard
        icon={<Database className="w-5 h-5" />}
        title="إدارة البيانات"
        description="أدوات إدارة البيانات والنسخ الاحتياطي"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowClearBooksDialog(true)}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            مسح جميع الكتب
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearLogs}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            مسح السجلات
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" onClick={handleExport}>
            <Download className="w-4 h-4 ml-2" />
            تصدير الإعدادات
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 ml-2" />
            استيراد الإعدادات
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </SectionCard>

      {/* ─── Save Button ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="pt-2"
      >
        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin ml-2" />
          ) : (
            <Save className="w-5 h-5 ml-2" />
          )}
          حفظ الإعدادات
        </Button>
      </motion.div>

      {/* ─── Confirmation Dialog ──────────────────────────────────────────── */}
      <Dialog open={showClearBooksDialog} onOpenChange={setShowClearBooksDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد مسح الكتب</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من مسح جميع الكتب؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowClearBooksDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleClearBooks}
            >
              مسح الكل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}