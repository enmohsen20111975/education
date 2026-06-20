"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Square,
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  Film,
  FileText,
  Mic,
  Layers,
  Download,
  Settings,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Video,
  Clapperboard,
  MessageSquare,
  Workflow,
  MonitorPlay,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

// ============================================================
// الأنواع / Types
// ============================================================

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
  language: string;
  style: string;
  voice: string;
}

interface LessonItem {
  id: string;
  titleAr: string;
  titleEn: string;
  unitName?: string;
}

// ============================================================
// ثوابت الحركات / Animation Constants
// ============================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200 } },
};

const statusColors: Record<string, string> = {
  queued: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  scripting: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  tts: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30",
  composing: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  rendering: "bg-pink-500/20 text-pink-600 border-pink-500/30",
  done: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  error: "bg-red-500/20 text-red-600 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-600 border-gray-500/30",
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  queued: { ar: "في الانتظار", en: "Queued" },
  scripting: { ar: "توليد النص", en: "Scripting" },
  tts: { ar: "تحويل لكلام", en: "TTS" },
  composing: { ar: "تركيب المشاهد", en: "Composing" },
  rendering: { ar: "العرض النهائي", en: "Rendering" },
  done: { ar: "مكتمل", en: "Done" },
  error: { ar: "خطأ", en: "Error" },
  cancelled: { ar: "ملغى", en: "Cancelled" },
};

const statusIcons: Record<string, React.ReactNode> = {
  queued: <Clock className="w-4 h-4" />,
  scripting: <FileText className="w-4 h-4" />,
  tts: <Mic className="w-4 h-4" />,
  composing: <Layers className="w-4 h-4" />,
  rendering: <MonitorPlay className="w-4 h-4" />,
  done: <CheckCircle2 className="w-4 h-4" />,
  error: <XCircle className="w-4 h-4" />,
  cancelled: <AlertCircle className="w-4 h-4" />,
};

const pipelineSteps = [
  { key: "scripting", icon: FileText, ar: "توليد النص", en: "Script Gen" },
  { key: "tts", icon: Mic, ar: "تحويل لكلام", en: "TTS" },
  { key: "composing", icon: Layers, ar: "تركيب المشاهد", en: "Compose" },
  { key: "rendering", icon: MonitorPlay, ar: "العرض النهائي", en: "Render" },
];

// ============================================================
// المكون الرئيسي / Main Component
// ============================================================

function VideoFactoryContent() {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // ─── حالة التطبيق / App State ───
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ar");
  const [selectedStyle, setSelectedStyle] = useState<string>("explainer");
  const [selectedVoice, setSelectedVoice] = useState<string>("female-ar");
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [activeJob, setActiveJob] = useState<VideoJob | null>(null);
  const [isProducing, setIsProducing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // ─── تحميل الدروس / Load lessons ───
  const loadLessons = useCallback(async () => {
    setIsLoadingLessons(true);
    try {
      const res = await fetch("/api/lessons");
      if (res.ok) {
        const data = await res.json();
        const lessonItems: LessonItem[] = (data.data?.lessons ?? data.lessons ?? []).map(
          (l: { id: string; titleAr: string; titleEn: string; Unit?: { nameAr: string } }) => ({
            id: l.id,
            titleAr: l.titleAr,
            titleEn: l.titleEn,
            unitName: l.Unit?.nameAr,
          })
        );
        setLessons(lessonItems);
        if (lessonItems.length > 0 && !selectedLesson) {
          setSelectedLesson(lessonItems[0].id);
        }
      }
    } catch {
      console.error("Failed to load lessons");
    } finally {
      setIsLoadingLessons(false);
    }
  }, [selectedLesson]);

  // ─── تحميل المهام / Load jobs ───
  const loadJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/video/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.data?.jobs ?? []);
        // تحديث المهمة النشطة
        const activeJobs = (data.data?.jobs ?? []).filter(
          (j: VideoJob) => !["done", "error", "cancelled"].includes(j.status)
        );
        if (activeJobs.length > 0) {
          setActiveJob(activeJobs[0]);
          setIsProducing(true);
        } else {
          if (activeJob && (activeJob.status === "done" || activeJob.status === "error")) {
            // Keep showing completed job briefly
          } else {
            setActiveJob(null);
            setIsProducing(false);
          }
        }
      }
    } catch {
      console.error("Failed to load jobs");
    }
  }, [activeJob]);

  // ─── جلب البيانات الأولية / Fetch initial data ───
  useEffect(() => {
    loadLessons();
    loadJobs();
  }, [loadLessons, loadJobs]);

  // ─── استقصاء المهام النشطة / Poll active jobs ───
  useEffect(() => {
    if (isProducing) {
      pollingRef.current = setInterval(loadJobs, 2000);
    } else if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isProducing, loadJobs]);

  // ─── إظهار إشعار / Show toast ───
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ─── بدء الإنتاج / Start production ───
  const handleProduce = async () => {
    if (!selectedLesson) return;

    try {
      setIsProducing(true);
      const res = await fetch("/api/video/produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: selectedLesson,
          language: selectedLanguage,
          style: selectedStyle,
          voice: selectedVoice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ message: data.data?.message || "تم إنشاء المهمة بنجاح", type: "success" });
        loadJobs();
      } else {
        setToast({ message: data.error || "حدث خطأ", type: "error" });
        setIsProducing(false);
      }
    } catch {
      setToast({ message: "فشل الاتصال بالخادم", type: "error" });
      setIsProducing(false);
    }
  };

  // ─── إلغاء المهمة / Cancel job ───
  const handleCancel = async (jobId: string) => {
    try {
      const res = await fetch("/api/video/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ message: "تم إلغاء المهمة", type: "success" });
        loadJobs();
      }
    } catch {
      setToast({ message: "فشل إلغاء المهمة", type: "error" });
    }
  };

  // ─── تصدير البيانات / Export data ───
  const handleExport = async (lessonId: string) => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/video/export/${lessonId}?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `remotion-export-${lessonId}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setToast({ message: "تم تصدير البيانات بنجاح", type: "success" });
      } else {
        const data = await res.json();
        setToast({ message: data.error || "فشل التصدير", type: "error" });
      }
    } catch {
      setToast({ message: "فشل التصدير", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedLessonData = lessons.find((l) => l.id === selectedLesson);

  return (
    <div
      className={`min-h-screen flex flex-col bg-background overflow-x-hidden ${language === "ar" ? "rtl" : "ltr"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* ==================== NAVBAR ==================== */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Clapperboard className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("مصنع الفيديو", "Video Factory")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("Phase 5 — خط إنتاج الفيديو التعليمي", "Phase 5 — Educational Video Pipeline")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="rounded-full">
              <Globe className="w-4 h-4 mr-1" />
              {language === "ar" ? "EN" : "عربي"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} className="rounded-full">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ==================== TOAST ==================== */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "50%" }}
            animate={{ opacity: 1, y: 0, x: "50%" }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl border shadow-lg text-sm font-medium backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600"
                : "bg-red-500/15 border-red-500/30 text-red-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
          {/* ─── Hero / Stats ─── */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Film,
                value: jobs.filter((j) => j.status === "done").length.toString(),
                label: { ar: "فيديو مكتمل", en: "Videos Done" },
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: Loader2,
                value: jobs.filter((j) => ["queued", "scripting", "tts", "composing", "rendering"].includes(j.status)).length.toString(),
                label: { ar: "قيد الإنتاج", en: "In Progress" },
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: FileText,
                value: jobs.filter((j) => j.status === "scripting").length.toString(),
                label: { ar: "نصوص جاري توليدها", en: "Scripts Running" },
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: Video,
                value: jobs.length.toString(),
                label: { ar: "إجمالي المهام", en: "Total Jobs" },
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, i) => (
              <motion.div key={i} variants={scaleIn} whileHover={{ y: -3 }}>
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shrink-0`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{t(stat.label.ar, stat.label.en)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ==================== LEFT PANEL: Controls ==================== */}
            <div className="lg:col-span-1 space-y-4">
              {/* ─── Lesson Selector ─── */}
              <motion.div variants={fadeInUp}>
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-500" />
                      {t("اختر درساً", "Select a Lesson")}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {t("اختر الدرس لإنتاج فيديو تعليمي له", "Choose a lesson to produce an educational video")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isLoadingLessons ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("اختر درساً...", "Choose a lesson...")} />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="max-h-64">
                            {lessons.map((lesson) => (
                              <SelectItem key={lesson.id} value={lesson.id} className="py-2">
                                <span className="font-medium">{language === "ar" ? lesson.titleAr : lesson.titleEn}</span>
                                {lesson.unitName && (
                                  <span className="text-muted-foreground text-xs mr-2">— {lesson.unitName}</span>
                                )}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}

                    {selectedLessonData && (
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-sm font-semibold">{language === "ar" ? selectedLessonData.titleAr : selectedLessonData.titleEn}</p>
                        {selectedLessonData.unitName && (
                          <p className="text-xs text-muted-foreground">{selectedLessonData.unitName}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* ─── Production Settings ─── */}
              <motion.div variants={fadeInUp}>
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="w-4 h-4 text-orange-500" />
                      {t("إعدادات الإنتاج", "Production Settings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Language */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("اللغة", "Language")}
                      </label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">{t("العربية", "Arabic")}</SelectItem>
                          <SelectItem value="en">{t("English", "الإنجليزية")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Style */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("نمط الفيديو", "Video Style")}
                      </label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="explainer">{t("شرح تفاعلي", "Explainer")}</SelectItem>
                          <SelectItem value="whiteboard">{t("سبورة بيضاء", "Whiteboard")}</SelectItem>
                          <SelectItem value="cinematic">{t("سينمائي", "Cinematic")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Voice */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("الصوت", "Voice")}
                      </label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female-ar">{t("أنثى — عربي", "Female — Arabic")}</SelectItem>
                          <SelectItem value="male-ar">{t("ذكر — عربي", "Male — Arabic")}</SelectItem>
                          <SelectItem value="female-en">{t("أنثى — إنجليزي", "Female — English")}</SelectItem>
                          <SelectItem value="male-en">{t("ذكر — إنجليزي", "Male — English")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleProduce}
                        disabled={!selectedLesson || isProducing}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                        size="lg"
                      >
                        {isProducing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t("جاري الإنتاج...", "Producing...")}
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {t("ابدأ إنتاج الفيديو", "Start Video Production")}
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleExport(selectedLesson)}
                        disabled={!selectedLesson || isExporting}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        {isExporting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {t("تصدير لـ Remotion", "Export for Remotion")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ==================== CENTER + RIGHT: Pipeline & Jobs ==================== */}
            <div className="lg:col-span-2 space-y-4">
              {/* ─── Pipeline Visualization ─── */}
              <motion.div variants={fadeInUp}>
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-cyan-500" />
                      {t("خط الإنتاج", "Production Pipeline")}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {t(
                        "المراحل: نص ← كلام ← تركيب ← عرض",
                        "Pipeline: Script → TTS → Compose → Render"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeJob ? (
                      <div className="space-y-4">
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{activeJob.lessonTitle}</span>
                            <span className="text-muted-foreground">{activeJob.progress}%</span>
                          </div>
                          <Progress value={activeJob.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">{activeJob.currentStep}</p>
                        </div>

                        {/* Pipeline steps */}
                        <div className="grid grid-cols-4 gap-3">
                          {pipelineSteps.map((step) => {
                            const stepIndex = pipelineSteps.findIndex((s) => s.key === step.key);
                            const activeStepIndex = pipelineSteps.findIndex((s) => s.key === activeJob.status);
                            const isActive = step.key === activeJob.status;
                            const isCompleted = stepIndex < activeStepIndex || activeJob.status === "done";
                            const isPending = stepIndex > activeStepIndex;

                            return (
                              <motion.div
                                key={step.key}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                  isActive
                                    ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                                    : isCompleted
                                    ? "border-emerald-500/50 bg-emerald-500/10"
                                    : "border-border/50 bg-muted/30 opacity-50"
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isActive
                                      ? "bg-purple-600 text-white animate-pulse"
                                      : isCompleted
                                      ? "bg-emerald-500 text-white"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {isActive ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                  ) : isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                  ) : (
                                    <step.icon className="w-5 h-5" />
                                  )}
                                </div>
                                <span className="text-[10px] font-medium text-center">
                                  {t(step.ar, step.en)}
                                </span>
                                {isPending && (
                                  <div className="absolute top-2 right-2">
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Scene progress */}
                        {activeJob.totalScenes > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Layers className="w-3.5 h-3.5" />
                            <span>
                              {activeJob.scenesCompleted} / {activeJob.totalScenes}{" "}
                              {t("مشهد", "scenes")}
                            </span>
                          </div>
                        )}

                        {/* Cancel button */}
                        {!["done", "error", "cancelled"].includes(activeJob.status) && (
                          <Button
                            onClick={() => handleCancel(activeJob.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Square className="w-3.5 h-3.5 mr-1.5" />
                            {t("إلغاء المهمة", "Cancel Job")}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                          <Clapperboard className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                          {t("لا توجد مهمة نشطة", "No Active Job")}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          {t(
                            "اختر درساً من القائمة على اليسار واضغط 'ابدأ إنتاج الفيديو' لبدء خط الإنتاج",
                            "Select a lesson from the left panel and click 'Start Video Production' to begin"
                          )}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* ─── Jobs List ─── */}
              <motion.div variants={fadeInUp}>
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        {t("سجل المهام", "Jobs History")}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {jobs.length} {t("مهمة", "jobs")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {jobs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        {t("لا توجد مهام بعد", "No jobs yet")}
                      </div>
                    ) : (
                      <ScrollArea className="max-h-96">
                        <div className="space-y-2">
                          {jobs.map((job, index) => (
                            <motion.div
                              key={job.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                                activeJob?.id === job.id
                                  ? "border-purple-500/40 bg-purple-500/5"
                                  : "border-border/50 bg-card"
                              }`}
                              onClick={() => setActiveJob(job)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                      statusColors[job.status] ?? "bg-muted"
                                    } border`}
                                  >
                                    {statusIcons[job.status] ?? <Clock className="w-4 h-4" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{job.lessonTitle}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <Badge
                                        variant="outline"
                                        className={`text-[10px] px-1.5 py-0 ${
                                          statusColors[job.status] ?? ""
                                        } border`}
                                      >
                                        {t(statusLabels[job.status]?.ar ?? job.status, statusLabels[job.status]?.en ?? job.status)}
                                      </Badge>
                                      <span className="text-[10px] text-muted-foreground">
                                        {job.style} • {job.voice}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end shrink-0">
                                  <span className="text-xs font-mono text-muted-foreground">
                                    {job.progress}%
                                  </span>
                                  {!["done", "error", "cancelled"].includes(job.status) && (
                                    <Progress
                                      value={job.progress}
                                      className="h-1.5 w-16 mt-1"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Progress details for active job */}
                              {activeJob?.id === job.id &&
                                !["queued", "done", "error", "cancelled"].includes(job.status) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="mt-3 pt-3 border-t border-border/50"
                                  >
                                    <p className="text-xs text-muted-foreground mb-2">
                                      {job.currentStep}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                      <ChevronRight className="w-3 h-3 text-purple-500" />
                                      <span>
                                        {job.scenesCompleted} / {job.totalScenes}{" "}
                                        {t("مشهد", "scenes")}
                                      </span>
                                    </div>
                                  </motion.div>
                                )}

                              {/* Error message */}
                              {job.status === "error" && job.error && (
                                <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                  <p className="text-[11px] text-red-600 break-words">{job.error}</p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* ─── Pipeline Architecture ─── */}
              <motion.div variants={fadeInUp}>
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      {t("هيكل خط الإنتاج", "Pipeline Architecture")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          icon: FileText,
                          title: { ar: "توليد النص", en: "Script Generation" },
                          desc: {
                            ar: "ذكاء اصطناعي يولد نصوص المشاهد من محتوى الدرس",
                            en: "AI generates scene narrations from lesson content",
                          },
                          color: "text-purple-500",
                          bgColor: "bg-purple-500/10",
                        },
                        {
                          icon: Mic,
                          title: { ar: "تحويل لكلام", en: "Text-to-Speech" },
                          desc: {
                            ar: "Edge TTS يحول النصوص لأصوات طبيعية بالعربية",
                            en: "Edge TTS converts texts to natural Arabic voices",
                          },
                          color: "text-cyan-500",
                          bgColor: "bg-cyan-500/10",
                        },
                        {
                          icon: Layers,
                          title: { ar: "تركيب المشاهد", en: "Scene Composition" },
                          desc: {
                            ar: "تجميع البصريات والصوت مع الانتقالات",
                            en: "Assembling visuals, audio and transitions",
                          },
                          color: "text-orange-500",
                          bgColor: "bg-orange-500/10",
                        },
                        {
                          icon: MonitorPlay,
                          title: { ar: "العرض النهائي", en: "Final Render" },
                          desc: {
                            ar: "Remotion يعرض الفيديو بجودة عالية",
                            en: "Remotion renders high-quality video output",
                          },
                          color: "text-pink-500",
                          bgColor: "bg-pink-500/10",
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          variants={scaleIn}
                          whileHover={{ y: -2 }}
                          className={`p-3 rounded-xl border border-border/50 ${item.bgColor}`}
                        >
                          <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                          <h4 className="text-xs font-bold mb-1">
                            {t(item.title.ar, item.title.en)}
                          </h4>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            {t(item.desc.ar, item.desc.en)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="mt-auto py-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clapperboard className="w-4 h-4 text-purple-500" />
              <span>{t("مصنع الفيديو — Phase 5", "Video Factory — Phase 5")}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{t("SmartEdu © 2025", "SmartEdu © 2025")}</span>
              <Separator orientation="vertical" className="h-3" />
              <span>
                {t("إنتاج تعليمي بالذكاء الاصطناعي", "AI-Powered Educational Production")}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function VideoFactoryPage() {
  return (
    <LanguageProvider>
      <VideoFactoryContent />
    </LanguageProvider>
  );
}
