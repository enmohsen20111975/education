"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Film,
  RefreshCw,
  Cpu,
  Sparkles,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Download,
  Upload,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  Zap,
  Brain,
  Activity,
  BookOpen,
  Layers,
  Video,
  Eye,
  RefreshCwIcon,
  Wifi,
  WifiOff,
  CircleDot,
  Square,
  RotateCcw,
  Clapperboard,
  GitBranch,
  Database,
  HardDrive,
  Server,
  Shield,
  Trash2,
  ChevronDown,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

interface FactoryStats {
  totalLessons: number;
  lessonsWithContent: number;
  lessonsWithoutContent: number;
  totalConcepts: number;
  totalFormulas: number;
  totalQuestions: number;
  totalExamples: number;
  aiModelsAvailable: {
    lmStudio: boolean;
    ollama: boolean;
  };
  syncStatus: "connected" | "disconnected";
}

interface LessonItem {
  id: string;
  title: string;
  subject: string;
  year: string;
}

interface SyncLessonStatus {
  lessonId: string;
  hasConcepts: boolean;
  hasFormulas: boolean;
  hasExamples: boolean;
  hasObjectives: boolean;
  hasQuestions: boolean;
  hasMindMap: boolean;
  hasInfographic: boolean;
  totalContent: number;
}

interface VideoJob {
  id: string;
  lessonId: string;
  lessonTitle: string;
  status: string;
  progress: number;
  currentStep: string;
  scenesCompleted: number;
  totalScenes: number;
  error?: string;
  createdAt: string;
  updatedAt: string;
  outputPath?: string;
  language: string;
  style: string;
  voice: string;
}

interface AIHealth {
  lmStudio: {
    available: boolean;
    model: string;
    vram: string;
    error?: string;
  };
  ollama: {
    available: boolean;
    models: string[];
    vram: string;
    error?: string;
  };
  system: {
    gpuAvailable: boolean;
    ramFree: string;
    error?: string;
  };
  timestamp: string;
}

interface ActivityItem {
  id: string;
  type: "generate" | "video" | "sync" | "visual";
  message: string;
  status: "success" | "error" | "processing";
  timestamp: Date;
}

type SectionKey = "dashboard" | "text" | "visual" | "video" | "sync" | "ai";

// ============================================================
// Constants
// ============================================================

const CONTENT_TYPES = [
  { value: "concepts", labelAr: "المفاهيم", labelEn: "Concepts" },
  { value: "formulas", labelAr: "القوانين والصيغ", labelEn: "Formulas" },
  { value: "examples", labelAr: "الأمثلة التوضيحية", labelEn: "Examples" },
  { value: "questions", labelAr: "الأسئلة", labelEn: "Questions" },
  { value: "objectives", labelAr: "الأهداف التعليمية", labelEn: "Objectives" },
] as const;

const VISUAL_TYPES = [
  { value: "mindmap", labelAr: "خريطة ذهنية", labelEn: "Mind Map" },
  { value: "infographic", labelAr: "إنفوجرافيك", labelEn: "Infographic" },
  { value: "chart", labelAr: "رسم بياني", labelEn: "Chart" },
  { value: "cards", labelAr: "بطاقات تعليمية", labelEn: "Cards" },
  { value: "logicmap", labelAr: "خريطة منطقية", labelEn: "Logic Map" },
] as const;

const VIDEO_STYLES = [
  { value: "explainer", labelAr: "شرح تفاعلي", labelEn: "Explainer" },
  { value: "whiteboard", labelAr: "سبورة بيضاء", labelEn: "Whiteboard" },
  { value: "cinematic", labelAr: "سينمائي", labelEn: "Cinematic" },
] as const;

const VOICES = [
  { value: "male-ar", labelAr: "صوت ذكر عربي", labelEn: "Male Arabic" },
  { value: "female-ar", labelAr: "صوت أنثى عربي", labelEn: "Female Arabic" },
  { value: "male-en", labelAr: "صوت ذكر إنجليزي", labelEn: "Male English" },
  { value: "female-en", labelAr: "صوت أنثى إنجليزي", labelEn: "Female English" },
] as const;

const PIPELINE_STEPS = [
  { key: "scripting", labelAr: "توليد النص", labelEn: "Scripting" },
  { key: "tts", labelAr: "تحويل النص لكلام", labelEn: "TTS" },
  { key: "composing", labelAr: "تركيب المشاهد", labelEn: "Composing" },
  { key: "rendering", labelAr: "العرض النهائي", labelEn: "Rendering" },
] as const;

const SECTION_CONFIG: Record<SectionKey, { icon: typeof LayoutDashboard; labelAr: string; labelEn: string }> = {
  dashboard: { icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard" },
  text: { icon: FileText, labelAr: "محتوى نصي", labelEn: "Text Content" },
  visual: { icon: Image, labelAr: "محتوى بصري", labelEn: "Visual Content" },
  video: { icon: Film, labelAr: "مصنع الفيديو", labelEn: "Video Factory" },
  sync: { icon: RefreshCw, labelAr: "المزامنة", labelEn: "Synchronization" },
  ai: { icon: Cpu, labelAr: "إعدادات الذكاء الاصطناعي", labelEn: "AI Settings" },
};

// ============================================================
// Animation Variants
// ============================================================

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

// ============================================================
// Main Page Component
// ============================================================

export default function FactoryDashboard() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage, t, dir } = useLanguage();
  const isRTL = language === "ar";

  // ─── State ─────────────────────────────────────
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<FactoryStats | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [syncStatuses, setSyncStatuses] = useState<SyncLessonStatus[]>([]);
  const [videoJobs, setVideoJobs] = useState<VideoJob[]>([]);
  const [aiHealth, setAiHealth] = useState<AIHealth | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [visualGenerating, setVisualGenerating] = useState(false);
  const [videoProducing, setVideoProducing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [videoStyle, setVideoStyle] = useState("explainer");
  const [videoVoice, setVideoVoice] = useState("female-ar");
  const [videoLanguage, setVideoLanguage] = useState("ar");
  const [selectedVisualType, setSelectedVisualType] = useState<string>("mindmap");
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [visualPreview, setVisualPreview] = useState<Record<string, unknown> | null>(null);
  const [textPreview, setTextPreview] = useState<Record<string, unknown> | null>(null);
  const [syncLogs, setSyncLogs] = useState<{ message: string; time: string; type: "push" | "pull" | "batch" }[]>([]);
  const [pollInterval, setPollInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const activityIdRef = useRef(0);

  // ─── Derived ───────────────────────────────────
  const subjects = Array.from(new Set(lessons.map((l) => l.subject))).filter(Boolean);
  const years = Array.from(new Set(lessons.map((l) => l.year))).filter(Boolean);

  const filteredLessons = lessons.filter((l) => {
    const matchesSearch = !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || l.subject === subjectFilter;
    const matchesYear = yearFilter === "all" || l.year === yearFilter;
    return matchesSearch && matchesSubject && matchesYear;
  });

  // ─── Data Fetching ─────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/stats");
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch {
      // silent
    }
  }, []);

  const fetchLessons = useCallback(async () => {
    try {
      const res = await fetch("/api/sync/lessons");
      const json = await res.json();
      if (json.lessons) setLessons(json.lessons);
    } catch {
      // silent
    }
  }, []);

  const fetchSyncStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/sync/status");
      const json = await res.json();
      if (json.lessons) setSyncStatuses(json.lessons);
    } catch {
      // silent
    }
  }, []);

  const fetchVideoJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/video/jobs");
      const json = await res.json();
      if (json.success) setVideoJobs(json.data.jobs);
    } catch {
      // silent
    }
  }, []);

  const fetchAIHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/health");
      const json = await res.json();
      setAiHealth(json);
    } catch {
      // silent
    }
  }, []);

  const addActivity = useCallback((type: ActivityItem["type"], message: string, status: ActivityItem["status"]) => {
    setActivities((prev) => [
      { id: String(++activityIdRef.current), type, message, status, timestamp: new Date() },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchLessons(), fetchSyncStatus(), fetchVideoJobs(), fetchAIHealth()]);
    setLoading(false);
  }, [fetchStats, fetchLessons, fetchSyncStatus, fetchVideoJobs, fetchAIHealth]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Poll video jobs when active
  useEffect(() => {
    if (activeSection === "video") {
      const interval = setInterval(fetchVideoJobs, 3000);
      setPollInterval(interval);
      return () => { clearInterval(interval); setPollInterval(null); };
    }
    if (pollInterval) { clearInterval(pollInterval); setPollInterval(null); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // ─── Handlers ──────────────────────────────────
  const handleGenerateContent = async (lessonId: string, types: string[]) => {
    if (!lessonId) return;
    setGenerating(true);
    setGenProgress(10);
    setGenStatus(t("جاري التوليد...", "Generating..."));
    addActivity("generate", t(`توليد محتوى للدرس ${lessonId}`, `Generating content for ${lessonId}`), "processing");

    try {
      const res = await fetch("/api/generate/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, types: types.length > 0 ? types : undefined, language }),
      });
      setGenProgress(70);
      const json = await res.json();
      setGenProgress(90);

      if (json.success) {
        setTextPreview(json.content);
        setGenProgress(100);
        setGenStatus(t("تم التوليد بنجاح!", "Generation successful!"));
        addActivity("generate", t(`تم توليد المحتوى (${json.stats?.map((s: { type: string; count: number }) => `${s.count} ${s.type}`).join(", ") || "—"})`, `Content generated (${json.stats?.map((s: { type: string; count: number }) => `${s.count} ${s.type}`).join(", ") || "—"})`), "success");
        fetchStats();
        fetchSyncStatus();
      } else {
        setGenStatus(t("فشل التوليد", "Generation failed"));
        addActivity("generate", t(`فشل: ${json.error}`, `Failed: ${json.error}`), "error");
      }
    } catch (err) {
      setGenStatus(t("خطأ في الاتصال", "Connection error"));
      addActivity("generate", t("خطأ في الاتصال بالخادم", "Server connection error"), "error");
    } finally {
      setTimeout(() => { setGenerating(false); setGenProgress(0); setGenStatus(""); }, 2000);
    }
  };

  const handleBatchGenerate = async () => {
    if (filteredLessons.length === 0) return;
    setGenerating(true);
    setGenProgress(5);
    setGenStatus(t("جاري التوليد الدفعي...", "Batch generating..."));
    addActivity("generate", t(`توليد دفعي لـ ${filteredLessons.length} درس`, `Batch generating ${filteredLessons.length} lessons`), "processing");

    try {
      const res = await fetch("/api/generate/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonIds: filteredLessons.slice(0, 10).map((l) => l.id), language }),
      });
      setGenProgress(80);
      const json = await res.json();

      if (json.success) {
        setGenProgress(100);
        const succ = json.results?.filter((r: { status: string }) => r.status === "success").length ?? 0;
        setGenStatus(t(`تم توليد ${succ} من ${json.results?.length}`, `Generated ${succ} of ${json.results?.length}`));
        addActivity("generate", t(`اكتمل التوليد الدفعي: ${succ} نجح`, `Batch complete: ${succ} succeeded`), "success");
        fetchStats();
        fetchSyncStatus();
      } else {
        setGenStatus(t("فشل التوليد الدفعي", "Batch generation failed"));
        addActivity("generate", t("فشل التوليد الدفعي", "Batch generation failed"), "error");
      }
    } catch {
      setGenStatus(t("خطأ في الاتصال", "Connection error"));
    } finally {
      setTimeout(() => { setGenerating(false); setGenProgress(0); setGenStatus(""); }, 2000);
    }
  };

  const handleGenerateVisual = async () => {
    if (!selectedLesson) return;
    setVisualGenerating(true);
    addActivity("visual", t(`توليد ${selectedVisualType} للدرس`, `Generating ${selectedVisualType} for lesson`), "processing");

    try {
      const res = await fetch("/api/visual/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: selectedLesson, types: [selectedVisualType], language }),
      });
      const json = await res.json();

      if (json.success) {
        setVisualPreview(json.content);
        addActivity("visual", t("تم توليد المحتوى البصري", "Visual content generated"), "success");
      } else {
        addActivity("visual", t(`فشل: ${json.error}`, `Failed: ${json.error}`), "error");
      }
    } catch {
      addActivity("visual", t("خطأ في الاتصال", "Connection error"), "error");
    } finally {
      setVisualGenerating(false);
    }
  };

  const handleStartVideo = async () => {
    if (!selectedLesson) return;
    setVideoProducing(true);
    addActivity("video", t(`بدء إنتاج فيديو للدرس`, `Starting video production for lesson`), "processing");

    try {
      const res = await fetch("/api/video/produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: selectedLesson, language: videoLanguage, style: videoStyle, voice: videoVoice }),
      });
      const json = await res.json();

      if (json.success) {
        addActivity("video", t(`تم إنشاء مهمة الفيديو: ${json.data.jobId}`, `Video job created: ${json.data.jobId}`), "success");
        fetchVideoJobs();
      } else {
        addActivity("video", t(`فشل: ${json.error}`, `Failed: ${json.error}`), "error");
      }
    } catch {
      addActivity("video", t("خطأ في الاتصال", "Connection error"), "error");
    } finally {
      setVideoProducing(false);
    }
  };

  const handleCancelVideo = async (jobId: string) => {
    try {
      await fetch("/api/video/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      fetchVideoJobs();
      addActivity("video", t("تم إلغاء مهمة الفيديو", "Video job cancelled"), "success");
    } catch {
      // silent
    }
  };

  const handlePushSync = async (lessonId?: string) => {
    setSyncing(true);
    const targetId = lessonId || selectedLesson;
    if (!targetId) { setSyncing(false); return; }

    addActivity("sync", t("جاري الدفع إلى المنصة...", "Pushing to platform..."), "processing");

    try {
      // First pull content
      const pullRes = await fetch("/api/sync/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: targetId }),
      });
      const pullData = await pullRes.json();

      if (pullData.error) {
        addActivity("sync", t(`فشل السحب: ${pullData.error}`, `Pull failed: ${pullData.error}`), "error");
        setSyncing(false);
        return;
      }

      // Then push back
      const pushRes = await fetch("/api/sync/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pullData),
      });
      const pushData = await pushRes.json();

      if (pushData.success) {
        const items = pushData.items?.map((i: { type: string; count: number }) => `${i.count} ${i.type}`).join(", ") || "—";
        addActivity("sync", t(`تم الدفع بنجاح: ${items}`, `Push successful: ${items}`), "success");
        setSyncLogs((prev) => [{ message: t(`دفع: ${items}`, `Push: ${items}`), time: new Date().toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US"), type: "push" }, ...prev.slice(0, 29)]);
      } else {
        addActivity("sync", t(`فشل الدفع`, "Push failed"), "error");
      }

      fetchSyncStatus();
      fetchStats();
    } catch {
      addActivity("sync", t("خطأ في المزامنة", "Sync error"), "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleBatchSync = async () => {
    setSyncing(true);
    addActivity("sync", t("جاري المزامنة الدفعية...", "Batch syncing..."), "processing");

    try {
      const lessonsToSync = filteredLessons.slice(0, 10);
      const payloads = [];

      for (const l of lessonsToSync) {
        const pullRes = await fetch("/api/sync/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: l.id }),
        });
        const pullData = await pullRes.json();
        if (!pullData.error) payloads.push(pullData);
      }

      const res = await fetch("/api/sync/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessons: payloads }),
      });
      const json = await res.json();

      const succ = json.results?.filter((r: { success: boolean }) => r.success).length ?? 0;
      addActivity("sync", t(`اكتملت المزامنة الدفعية: ${succ} من ${payloads.length}`, `Batch sync complete: ${succ} of ${payloads.length}`), "success");
      setSyncLogs((prev) => [{ message: t(`مزامنة دفعية: ${succ} نجح من ${payloads.length}`, `Batch sync: ${succ} of ${payloads.length} succeeded`), time: new Date().toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US"), type: "batch" }, ...prev.slice(0, 29)]);
      fetchSyncStatus();
      fetchStats();
    } catch {
      addActivity("sync", t("خطأ في المزامنة الدفعية", "Batch sync error"), "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleTestConnection = async (service: "lmStudio" | "ollama") => {
    addActivity("ai", t(`فحص اتصال ${service}`, `Testing ${service} connection`), "processing");
    await fetchAIHealth();
    addActivity("ai", t("تم فحص الاتصال", "Connection tested"), "success");
  };

  // ─── Helpers ───────────────────────────────────
  const getStatusColor = (status: string) => {
    if (status === "done" || status === "success" || status === "completed") return "text-emerald-500";
    if (status === "error" || status === "failed") return "text-red-500";
    if (status === "processing" || status === "scripting" || status === "tts" || status === "composing" || status === "rendering") return "text-amber-500";
    return "text-muted-foreground";
  };

  const getStatusIcon = (status: string) => {
    if (status === "done" || status === "success" || status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === "error" || status === "failed") return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === "processing" || status === "scripting" || status === "tts" || status === "composing" || status === "rendering") return <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getVideoPipelineStepIndex = (status: string) => {
    const map: Record<string, number> = { queued: -1, scripting: 0, tts: 1, composing: 2, rendering: 3, done: 4, error: -1, cancelled: -1 };
    return map[status] ?? -1;
  };

  const lessonSyncStatus = (lessonId: string) => syncStatuses.find((s) => s.lessonId === lessonId);

  // ============================================================
  // Render: Navbar
  // ============================================================

  const renderNavbar = () => (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              SmartEdu
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-1 ms-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-accent">
              {t("المنصة", "Platform")}
            </a>
            <div className="px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-sm font-medium text-foreground">
              {t("مصنع البيانات", "Data Factory")}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="h-9 w-9 rounded-lg hover:bg-accent"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg hover:bg-accent"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );

  // ============================================================
  // Render: Sidebar
  // ============================================================

  const renderSidebar = () => (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 bottom-0 z-40 w-64 border-e border-white/10 bg-background/95 backdrop-blur-xl transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full")}
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">
            {t("الأقسام", "Sections")}
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {(Object.entries(SECTION_CONFIG) as [SectionKey, typeof SECTION_CONFIG[SectionKey]][]).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = activeSection === key;
              return (
                <motion.button
                  key={key}
                  whileHover={{ x: isRTL ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setActiveSection(key); setSidebarOpen(false); }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? "bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-400 shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{t(config.labelAr, config.labelEn)}</span>
                  {isActive && (
                    <motion.div layoutId="sidebar-indicator" className="ms-auto">
                      <ChevronDown className={`h-4 w-4 text-purple-400 ${isRTL ? "rotate-90" : "-rotate-90"}`} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </nav>

          <Separator className="my-3" />

          <div className="space-y-2 px-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CircleDot className="h-3.5 w-3.5 text-emerald-500" />
              <span>{t("متصل", "Connected")}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {t("الإصدار 2.0.0", "Version 2.0.0")}
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  // ============================================================
  // Render: Dashboard Section
  // ============================================================

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
          <Skeleton className="h-64 rounded-2xl sm:col-span-2 lg:col-span-4" />
        </div>
      );
    }

    if (!stats) return null;

    const statCards = [
      {
        label: t("إجمالي الدروس", "Total Lessons"),
        value: stats.totalLessons,
        icon: BookOpen,
        gradient: "from-purple-500 to-pink-500",
        sub: t(`${stats.lessonsWithContent} بها محتوى`, `${stats.lessonsWithContent} with content`),
      },
      {
        label: t("المحتوى المُولَّد", "Content Generated"),
        value: stats.totalConcepts + stats.totalFormulas + stats.totalQuestions + stats.totalExamples,
        icon: Layers,
        gradient: "from-pink-500 to-orange-400",
        sub: t(`${stats.totalConcepts} مفهوم · ${stats.totalFormulas} صيغة`, `${stats.totalConcepts} concepts · ${stats.totalFormulas} formulas`),
      },
      {
        label: t("الفيديوهات", "Videos"),
        value: videoJobs.filter((j) => j.status === "done").length,
        icon: Video,
        gradient: "from-orange-400 to-amber-500",
        sub: t(`${videoJobs.filter((j) => ["scripting", "tts", "composing", "rendering"].includes(j.status)).length} قيد الإنتاج`, `${videoJobs.filter((j) => ["scripting", "tts", "composing", "rendering"].includes(j.status)).length} in production`),
      },
      {
        label: t("نماذج الذكاء الاصطناعي", "AI Models"),
        value: (stats.aiModelsAvailable.lmStudio ? 1 : 0) + (stats.aiModelsAvailable.ollama ? 1 : 0),
        icon: Brain,
        gradient: "from-rose-500 to-purple-600",
        sub: [
          stats.aiModelsAvailable.lmStudio && "LM Studio",
          stats.aiModelsAvailable.ollama && "Ollama",
        ].filter(Boolean).join(" · ") || t("لا توجد نماذج متصلة", "No models connected"),
        healthColor: stats.aiModelsAvailable.lmStudio || stats.aiModelsAvailable.ollama ? "text-emerald-500" : "text-red-500",
      },
    ];

    return (
      <motion.div {...fadeIn} className="space-y-6">
        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div key={idx} variants={staggerItem}>
                <Card className="relative overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{card.label}</p>
                        <p className="text-3xl font-bold mt-1">{card.value}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <span className={card.healthColor || ""}>{card.sub}</span>
                        </p>
                      </div>
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("إجراءات سريعة", "Quick Actions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setActiveSection("text")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20"
                >
                  <Sparkles className="h-4 w-4 me-2" />
                  {t("توليد محتوى", "Generate Content")}
                </Button>
                <Button
                  onClick={() => setActiveSection("video")}
                  variant="outline"
                  className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                >
                  <Clapperboard className="h-4 w-4 me-2" />
                  {t("بدء إنتاج فيديو", "Start Video Production")}
                </Button>
                <Button
                  onClick={() => setActiveSection("sync")}
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <RefreshCw className="h-4 w-4 me-2" />
                  {t("مزامنة الكل", "Sync All")}
                </Button>
                <Button
                  onClick={loadAll}
                  variant="outline"
                  className="border-white/10 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4 me-2" />
                  {t("تحديث", "Refresh")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Health + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AI Models Health */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-purple-400" />
                  {t("حالة نماذج الذكاء الاصطناعي", "AI Models Health")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiHealth ? (
                  <>
                    {/* LM Studio */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        {aiHealth.lmStudio.available ? (
                          <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                        )}
                        <div>
                          <p className="text-sm font-medium">LM Studio</p>
                          <p className="text-xs text-muted-foreground">{aiHealth.lmStudio.model || t("غير متصل", "Disconnected")}</p>
                        </div>
                      </div>
                      <Badge variant={aiHealth.lmStudio.available ? "default" : "destructive"} className="text-xs">
                        {aiHealth.lmStudio.available ? t("متصل", "Connected") : t("غير متصل", "Disconnected")}
                      </Badge>
                    </div>

                    {/* Ollama */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        {aiHealth.ollama.available ? (
                          <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Ollama</p>
                          <p className="text-xs text-muted-foreground">
                            {aiHealth.ollama.models?.length > 0 ? aiHealth.ollama.models.join(", ") : t("غير متصل", "Disconnected")}
                          </p>
                        </div>
                      </div>
                      <Badge variant={aiHealth.ollama.available ? "default" : "destructive"} className="text-xs">
                        {aiHealth.ollama.available ? t("متصل", "Connected") : t("غير متصل", "Disconnected")}
                      </Badge>
                    </div>

                    {/* System */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{t("النظام", "System")}</p>
                          <p className="text-xs text-muted-foreground">
                            GPU: {aiHealth.system.gpuAvailable ? t("متاح", "Available") : t("غير متاح", "N/A")} · {t("RAM حرة", "RAM free")}: {aiHealth.system.ramFree || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Skeleton className="h-14 rounded-xl" />
                    <Skeleton className="h-14 rounded-xl" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-pink-400" />
                  {t("النشاط الأخير", "Recent Activity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      {t("لا يوجد نشاط بعد", "No activity yet")}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          {getStatusIcon(activity.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.timestamp.toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // ============================================================
  // Render: Text Content Section
  // ============================================================

  const renderTextContent = () => (
    <motion.div {...fadeIn} className="space-y-4">
      {/* Filters */}
      <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`} />
              <Input
                placeholder={t("ابحث عن درس...", "Search for a lesson...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? "pe-10" : "ps-10"}`}
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("المادة", "Subject")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("جميع المواد", "All Subjects")}</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("السنة", "Year")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("جميع السنوات", "All Years")}</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Batch Action */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
            <Button
              onClick={handleBatchGenerate}
              disabled={generating || filteredLessons.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20"
              size="sm"
            >
              {generating ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Sparkles className="h-4 w-4 me-2" />}
              {t("توليد محتوى الدروس المعروضة", "Generate Content for Shown Lessons")}
            </Button>
            {generating && (
              <div className="flex-1">
                <Progress value={genProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{genStatus}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson List */}
      <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("الدروس", "Lessons")} ({filteredLessons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[500px]">
            {filteredLessons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                {t("لا توجد دروس", "No lessons found")}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLessons.map((lesson) => {
                  const sync = lessonSyncStatus(lesson.id);
                  const contentCount = sync?.totalContent ?? 0;
                  const hasAny = contentCount > 0;

                  return (
                    <div key={lesson.id} className="p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-muted/30 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-medium truncate max-w-xs">{lesson.title}</h4>
                            <Badge variant={hasAny ? "default" : "secondary"} className="text-xs shrink-0">
                              {hasAny ? t(`${contentCount} عنصر`, `${contentCount} items`) : t("فارغ", "Empty")}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{lesson.subject} · {lesson.year}</p>

                          {/* Content Status Indicators */}
                          {sync && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {[
                                { key: "hasConcepts", label: t("مفاهيم", "Concepts"), ar: "مفاهيم" },
                                { key: "hasFormulas", label: t("صيغ", "Formulas"), ar: "صيغ" },
                                { key: "hasExamples", label: t("أمثلة", "Examples"), ar: "أمثلة" },
                                { key: "hasObjectives", label: t("أهداف", "Objectives"), ar: "أهداف" },
                                { key: "hasQuestions", label: t("أسئلة", "Questions"), ar: "أسئلة" },
                              ].map((item) => (
                                <div key={item.key} className="flex items-center gap-1">
                                  {sync[item.key as keyof SyncLessonStatus] ? (
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-muted-foreground/40" />
                                  )}
                                  <span className="text-xs text-muted-foreground">{item.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Select value={selectedContentTypes.includes(lesson.id) ? "selected" : "all"} onValueChange={(val) => {
                            if (val === "all") {
                              handleGenerateContent(lesson.id, []);
                            }
                          }}>
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue placeholder={t("توليد نوع", "Generate Type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all" onClick={() => handleGenerateContent(lesson.id, [])}>
                                {t("توليد الكل", "Generate All")}
                              </SelectItem>
                              {CONTENT_TYPES.map((ct) => (
                                <SelectItem key={ct.value} value={ct.value} onClick={() => handleGenerateContent(lesson.id, [ct.value])}>
                                  {t(ct.labelAr, ct.labelEn)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Content Preview */}
      {textPreview && (
        <motion.div {...fadeIn}>
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t("معاينة المحتوى", "Content Preview")}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setTextPreview(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <pre className="text-xs bg-muted/50 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(textPreview, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );

  // ============================================================
  // Render: Visual Content Section
  // ============================================================

  const renderVisualContent = () => (
    <motion.div {...fadeIn} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Controls */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("إعدادات التوليد البصري", "Visual Generation Settings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lesson Selector */}
            <div className="space-y-2">
              <Label className="text-sm">{t("اختر درساً", "Select a Lesson")}</Label>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger>
                  <SelectValue placeholder={t("اختر درساً...", "Choose a lesson...")} />
                </SelectTrigger>
                <SelectContent>
                  {filteredLessons.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      <span className="truncate max-w-60 inline-block">{l.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visual Type */}
            <div className="space-y-2">
              <Label className="text-sm">{t("نوع المحتوى البصري", "Visual Content Type")}</Label>
              <div className="grid grid-cols-1 gap-2">
                {VISUAL_TYPES.map((vt) => (
                  <button
                    key={vt.value}
                    onClick={() => setSelectedVisualType(vt.value)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl text-sm text-start transition-all border
                      ${selectedVisualType === vt.value
                        ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                        : "border-white/5 hover:border-white/10 hover:bg-muted/30 text-foreground"
                      }
                    `}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedVisualType === vt.value
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : "bg-muted"
                    }`}>
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    {t(vt.labelAr, vt.labelEn)}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerateVisual}
              disabled={visualGenerating || !selectedLesson}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20"
            >
              {visualGenerating ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Sparkles className="h-4 w-4 me-2" />}
              {t("توليد المحتوى البصري", "Generate Visual Content")}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("معاينة", "Preview")}</CardTitle>
            <CardDescription>{t("هيكل المحتوى البصري المُولَّد", "Generated visual content structure")}</CardDescription>
          </CardHeader>
          <CardContent>
            {visualPreview ? (
              <ScrollArea className="max-h-[500px]">
                <pre className="text-xs bg-muted/50 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(visualPreview, null, 2)}
                </pre>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Eye className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm">{t("اختر درساً ونوع المحتوى ثم اضغط توليد", "Select a lesson and type, then click Generate")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  // ============================================================
  // Render: Video Factory Section
  // ============================================================

  const renderVideoFactory = () => {
    const activeJobs = videoJobs.filter((j) => !["done", "error", "cancelled"].includes(j.status));
    const completedJobs = videoJobs.filter((j) => ["done", "error", "cancelled"].includes(j.status));

    return (
      <motion.div {...fadeIn} className="space-y-4">
        {/* Settings */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("إعدادات الإنتاج", "Production Settings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Lesson */}
              <div className="space-y-2">
                <Label className="text-sm">{t("الدرس", "Lesson")}</Label>
                <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("اختر درساً...", "Choose a lesson...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLessons.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label className="text-sm">{t("النمط", "Style")}</Label>
                <Select value={videoStyle} onValueChange={setVideoStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_STYLES.map((vs) => (
                      <SelectItem key={vs.value} value={vs.value}>{t(vs.labelAr, vs.labelEn)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Voice */}
              <div className="space-y-2">
                <Label className="text-sm">{t("الصوت", "Voice")}</Label>
                <Select value={videoVoice} onValueChange={setVideoVoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((v) => (
                      <SelectItem key={v.value} value={v.value}>{t(v.labelAr, v.labelEn)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="text-sm">{t("اللغة", "Language")}</Label>
                <Select value={videoLanguage} onValueChange={setVideoLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">{t("العربية", "Arabic")}</SelectItem>
                    <SelectItem value="en">{t("الإنجليزية", "English")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleStartVideo}
              disabled={videoProducing || !selectedLesson}
              className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20"
            >
              {videoProducing ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Play className="h-4 w-4 me-2" />}
              {t("بدء الإنتاج", "Start Production")}
            </Button>
          </CardContent>
        </Card>

        {/* Pipeline Visualization */}
        {activeJobs.length > 0 && (
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("خط الإنتاج", "Production Pipeline")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJobs.map((job) => {
                const currentStepIdx = getVideoPipelineStepIndex(job.status);

                return (
                  <div key={job.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                        <span className="text-sm font-medium">{job.lessonTitle}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelVideo(job.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Square className="h-3.5 w-3.5 me-1" />
                        {t("إلغاء", "Cancel")}
                      </Button>
                    </div>

                    {/* Pipeline Steps */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {PIPELINE_STEPS.map((step, idx) => {
                        const isActive = idx === currentStepIdx;
                        const isDone = idx < currentStepIdx;
                        const isPending = idx > currentStepIdx;

                        return (
                          <div key={step.key} className="flex-1">
                            <div className={`
                              h-2 rounded-full transition-all duration-500
                              ${isDone ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : ""}
                              ${isActive ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" : ""}
                              ${isPending ? "bg-muted" : ""}
                            `} />
                            <p className={`text-xs mt-1 truncate ${isActive ? "text-purple-400 font-medium" : "text-muted-foreground"}`}>
                              {t(step.labelAr, step.labelEn)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3">
                      <Progress value={job.progress} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground shrink-0">{job.progress}%</span>
                      <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">{job.currentStep}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Job History */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("سجل المهام", "Job History")} ({videoJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              {videoJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Film className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  {t("لا توجد مهام بعد", "No jobs yet")}
                </div>
              ) : (
                <div className="space-y-2">
                  {videoJobs.map((job) => (
                    <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      {getStatusIcon(job.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{job.lessonTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.status} · {job.style} · {job.voice}
                        </p>
                      </div>
                      <div className="text-end shrink-0">
                        <p className={`text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.progress}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US")}
                        </p>
                      </div>
                      {job.status === "done" && (
                        <Badge variant="default" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shrink-0">
                          <CheckCircle2 className="h-3 w-3 me-1" />
                          {t("مكتمل", "Done")}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ============================================================
  // Render: Sync Section
  // ============================================================

  const renderSync = () => {
    const syncedLessons = syncStatuses.filter((s) => s.totalContent > 0).length;
    const totalLessons = syncStatuses.length;

    return (
      <motion.div {...fadeIn} className="space-y-4">
        {/* Sync Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{syncedLessons}</p>
                  <p className="text-xs text-muted-foreground">{t("دروس بمحتوى", "Lessons with content")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                  <ArrowUpDown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalLessons > 0 ? Math.round((syncedLessons / totalLessons) * 100) : 0}%</p>
                  <p className="text-xs text-muted-foreground">{t("نسبة المزامنة", "Sync Rate")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <RefreshCwIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{syncLogs.length}</p>
                  <p className="text-xs text-muted-foreground">{t("عمليات المزامنة", "Sync Operations")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Actions */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("إجراءات المزامنة", "Sync Actions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm">{t("اختر درساً", "Select a Lesson")}</Label>
                <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("اختر درساً...", "Choose a lesson...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLessons.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handlePushSync()}
                disabled={syncing || !selectedLesson}
                variant="outline"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                {syncing ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Upload className="h-4 w-4 me-2" />}
                {t("دفع إلى المنصة", "Push to Platform")}
              </Button>

              <Button
                onClick={async () => {
                  if (!selectedLesson) return;
                  setSyncing(true);
                  try {
                    const res = await fetch("/api/sync/pull", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ lessonId: selectedLesson }),
                    });
                    const json = await res.json();
                    if (json.error) {
                      addActivity("sync", t(`فشل السحب: ${json.error}`, `Pull failed: ${json.error}`), "error");
                    } else {
                      addActivity("sync", t("تم سحب المحتوى بنجاح", "Content pulled successfully"), "success");
                      setSyncLogs((prev) => [{ message: t("سحب محتوى الدرس", "Pulled lesson content"), time: new Date().toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US"), type: "pull" }, ...prev.slice(0, 29)]);
                    }
                  } catch {
                    addActivity("sync", t("خطأ في السحب", "Pull error"), "error");
                  }
                  setSyncing(false);
                }}
                disabled={syncing || !selectedLesson}
                variant="outline"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <Download className="h-4 w-4 me-2" />
                {t("سحب من المنصة", "Pull from Platform")}
              </Button>

              <Button
                onClick={handleBatchSync}
                disabled={syncing || filteredLessons.length === 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20"
              >
                {syncing ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <RefreshCw className="h-4 w-4 me-2" />}
                {t("مزامنة دفعية", "Batch Sync")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sync Logs */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("سجل المزامنة", "Sync History")}</CardTitle>
              {syncLogs.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSyncLogs([])} className="text-xs">
                  <Trash2 className="h-3.5 w-3.5 me-1" />
                  {t("مسح", "Clear")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-64">
              {syncLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  {t("لا يوجد سجل مزامنة", "No sync history")}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {syncLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {log.type === "push" && <Upload className="h-3 w-3 me-1 text-emerald-500" />}
                        {log.type === "pull" && <Download className="h-3 w-3 me-1 text-purple-500" />}
                        {log.type === "batch" && <RefreshCw className="h-3 w-3 me-1 text-orange-500" />}
                        {log.type === "push" ? t("دفع", "Push") : log.type === "pull" ? t("سحب", "Pull") : t("دفعة", "Batch")}
                      </Badge>
                      <span className="text-sm flex-1">{log.message}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Lesson Sync Status Grid */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("حالة الدروس", "Lesson Status")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="space-y-1.5">
                {syncStatuses.map((status) => {
                  const lesson = lessons.find((l) => l.id === status.lessonId);
                  const contentPercent = Math.min(100, Math.round((status.totalContent / 7) * 100));

                  return (
                    <div key={status.lessonId} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lesson?.title || status.lessonId}</p>
                        <p className="text-xs text-muted-foreground">{lesson?.subject} · {status.totalContent} {t("عنصر", "items")}</p>
                      </div>
                      <div className="w-24 shrink-0">
                        <Progress value={contentPercent} className="h-1.5" />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-end shrink-0">{contentPercent}%</span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ============================================================
  // Render: AI Settings Section
  // ============================================================

  const renderAISettings = () => (
    <motion.div {...fadeIn} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LM Studio */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="h-4.5 w-4.5 text-purple-400" />
                LM Studio
              </CardTitle>
              <div className={`h-3 w-3 rounded-full ${aiHealth?.lmStudio.available ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">{t("الحالة", "Status")}</Label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                {aiHealth?.lmStudio.available ? (
                  <Wifi className="h-4 w-4 text-emerald-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  {aiHealth?.lmStudio.available ? t("متصل", "Connected") : t("غير متصل", "Disconnected")}
                </span>
              </div>
            </div>

            {aiHealth?.lmStudio.model && (
              <div className="space-y-2">
                <Label className="text-sm">{t("النموذج النشط", "Active Model")}</Label>
                <div className="p-3 rounded-xl bg-muted/50 text-sm">{aiHealth.lmStudio.model}</div>
              </div>
            )}

            {aiHealth?.lmStudio.vram && (
              <div className="space-y-2">
                <Label className="text-sm">VRAM</Label>
                <div className="p-3 rounded-xl bg-muted/50 text-sm">{aiHealth.lmStudio.vram}</div>
              </div>
            )}

            {aiHealth?.lmStudio.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {aiHealth.lmStudio.error}
              </div>
            )}

            <Button
              onClick={() => handleTestConnection("lmStudio")}
              variant="outline"
              className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <RefreshCw className="h-4 w-4 me-2" />
              {t("فحص الاتصال", "Test Connection")}
            </Button>
          </CardContent>
        </Card>

        {/* Ollama */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4.5 w-4.5 text-pink-400" />
                Ollama
              </CardTitle>
              <div className={`h-3 w-3 rounded-full ${aiHealth?.ollama.available ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">{t("الحالة", "Status")}</Label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                {aiHealth?.ollama.available ? (
                  <Wifi className="h-4 w-4 text-emerald-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  {aiHealth?.ollama.available ? t("متصل", "Connected") : t("غير متصل", "Disconnected")}
                </span>
              </div>
            </div>

            {aiHealth?.ollama.models && aiHealth.ollama.models.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">{t("النماذج المتاحة", "Available Models")}</Label>
                <div className="p-3 rounded-xl bg-muted/50 space-y-1">
                  {aiHealth.ollama.models.map((model, idx) => (
                    <div key={idx} className="text-sm flex items-center gap-2">
                      <CircleDot className="h-3 w-3 text-pink-400" />
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiHealth?.ollama.vram && (
              <div className="space-y-2">
                <Label className="text-sm">VRAM</Label>
                <div className="p-3 rounded-xl bg-muted/50 text-sm">{aiHealth.ollama.vram}</div>
              </div>
            )}

            {aiHealth?.ollama.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {aiHealth.ollama.error}
              </div>
            )}

            <Button
              onClick={() => handleTestConnection("ollama")}
              variant="outline"
              className="w-full border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
            >
              <RefreshCw className="h-4 w-4 me-2" />
              {t("فحص الاتصال", "Test Connection")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Resources */}
      <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-orange-400" />
            {t("مراقبة الموارد", "Resource Monitoring")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <p className="text-sm font-medium">{t("معالج الرسوميات", "GPU")}</p>
              <p className="text-lg font-bold mt-1">
                {aiHealth?.system.gpuAvailable ? (
                  <span className="text-emerald-500">{t("متاح", "Available")}</span>
                ) : (
                  <span className="text-muted-foreground">{t("غير متاح", "N/A")}</span>
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <HardDrive className="h-8 w-8 mx-auto mb-2 text-pink-400" />
              <p className="text-sm font-medium">{t("الذاكرة الحرة", "Free RAM")}</p>
              <p className="text-lg font-bold mt-1">
                {aiHealth?.system.ramFree || t("غير متاح", "N/A")}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <Server className="h-8 w-8 mx-auto mb-2 text-orange-400" />
              <p className="text-sm font-medium">{t("آخر فحص", "Last Check")}</p>
              <p className="text-sm font-bold mt-1">
                {aiHealth?.timestamp
                  ? new Date(aiHealth.timestamp).toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US")
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // ============================================================
  // Render: Section Router
  // ============================================================

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return renderDashboard();
      case "text": return renderTextContent();
      case "visual": return renderVisualContent();
      case "video": return renderVideoFactory();
      case "sync": return renderSync();
      case "ai": return renderAISettings();
      default: return renderDashboard();
    }
  };

  const sectionLabel = SECTION_CONFIG[activeSection];

  // ============================================================
  // Main Render
  // ============================================================

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      {renderNavbar()}

      <div className="flex flex-1">
        {/* Sidebar */}
        {renderSidebar()}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            {/* Section Header */}
            <motion.div {...fadeIn} className="mb-6">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}>
                  {(() => { const Icon = sectionLabel.icon; return <Icon className="h-5 w-5 text-white" />; })()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    {t(sectionLabel.labelAr, sectionLabel.labelEn)}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {activeSection === "dashboard" && t("نظرة شاملة على مصنع البيانات", "Overview of the data factory")}
                    {activeSection === "text" && t("توليد وإدارة المحتوى النصي", "Generate and manage text content")}
                    {activeSection === "visual" && t("توليد المحتوى البصري التعليمي", "Generate educational visual content")}
                    {activeSection === "video" && t("إنتاج الفيديوهات التعليمية", "Produce educational videos")}
                    {activeSection === "sync" && t("مزامنة المحتوى مع المنصة", "Sync content with the platform")}
                    {activeSection === "ai" && t("إعدادات ومراقبة نماذج الذكاء الاصطناعي", "AI model settings and monitoring")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section Content */}
            <AnimatePresence mode="wait">
              <div key={activeSection}>
                {renderSection()}
              </div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t border-white/5 py-6 px-4 sm:px-6">
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} SmartEdu — {t("جميع الحقوق محفوظة", "All Rights Reserved")}</p>
              <p>{t("الإصدار", "Version")} 2.0.0 — {t("مصنع البيانات", "Data Factory")}</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}