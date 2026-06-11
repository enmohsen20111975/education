"use client";

import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Play, FlaskConical, ChevronLeft, ChevronRight, Globe, User,
  Atom, Calculator, Beaker, Lock, CheckCircle, Clock, Brain,
  Zap, Target, Award, TrendingUp, Moon, Sun, Sparkles, Rocket,
  Cpu, Microscope, BarChart3, Users, Menu, X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LessonView } from "@/components/LessonView";
import { lessonsData, type LessonContent } from "@/data/lessons";
import MindMap, { MIND_MAPS, type MindMapType } from "@/components/MindMap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RewardsSystem, 
  AchievementBar, 
  BadgesDisplay, 
  NewBadgeModal,
  useRewards,
  type UserProgress 
} from "@/components/RewardsSystem";

// ===== بيانات المواد العلمية =====
const subjects = [
  { 
    id: "physics", 
    nameAr: "الفيزياء", 
    nameEn: "Physics",
    icon: Atom,
    color: "from-emerald-400 via-teal-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    descriptionAr: "اكتشف أسرار الكون والقوانين الفيزيائية",
    descriptionEn: "Discover the secrets of the universe and physical laws",
    lessons: 41,
    simulators: 8,
  },
  { 
    id: "math", 
    nameAr: "الرياضيات", 
    nameEn: "Mathematics",
    icon: Calculator,
    color: "from-blue-400 via-cyan-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    descriptionAr: "عالم الأرقام والمعادلات السحرية",
    descriptionEn: "The world of numbers and magical equations",
    lessons: 41,
    simulators: 8,
  },
  { 
    id: "chemistry", 
    nameAr: "الكيمياء", 
    nameEn: "Chemistry",
    icon: Beaker,
    color: "from-purple-400 via-pink-500 to-rose-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
    descriptionAr: "تفاعلات ومركبات تغير العالم",
    descriptionEn: "Reactions and compounds that change the world",
    lessons: 41,
    simulators: 8,
  },
];

// ===== بيانات الخرائط الذهنية المتاحة =====
const mindMapsList: { id: MindMapType; nameAr: string; nameEn: string; color: string }[] = [
  { id: "motion", nameAr: "الحركة", nameEn: "Motion", color: "bg-emerald-500" },
  { id: "energy", nameAr: "الطاقة", nameEn: "Energy", color: "bg-purple-500" },
  { id: "atom", nameAr: "الذرة", nameEn: "Atom", color: "bg-cyan-500" },
];

// ===== بيانات المحاكيات المميزة =====
const featuredSimulators = [
  { 
    id: 1, 
    nameAr: "محاكي الحركة التوافقية", 
    nameEn: "Harmonic Motion Simulator",
    icon: Zap, 
    color: "from-amber-400 to-orange-500",
    subject: "physics"
  },
  { 
    id: 2, 
    nameAr: "محاكي التفاعلات الكيميائية", 
    nameEn: "Chemical Reactions Simulator",
    icon: FlaskConical, 
    color: "from-purple-400 to-pink-500",
    subject: "chemistry"
  },
  { 
    id: 3, 
    nameAr: "محاكي الرسوم البيانية", 
    nameEn: "Graphing Simulator",
    icon: BarChart3, 
    color: "from-blue-400 to-cyan-500",
    subject: "math"
  },
  { 
    id: 4, 
    nameAr: "محاكي الذرة", 
    nameEn: "Atom Simulator",
    icon: Microscope, 
    color: "from-teal-400 to-emerald-500",
    subject: "physics"
  },
];

// ===== بيانات وهمية للتقدم =====
const mockProgress = {
  completedLessons: ["motion-intro", "velocity-acceleration"],
  currentLesson: "equations-motion",
};

// ===== بيانات وهمية لنظام المكافآت =====
const initialRewardsProgress: UserProgress = {
  totalPoints: 150,
  completedLessons: 8,
  physicsLessons: 3,
  mathLessons: 3,
  chemistryLessons: 2,
  simulatorsUsed: 4,
  streakDays: 5,
  earnedBadges: ["active-learner"],
};

// ===== مكون شاشة التحميل =====
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // تأخير ظهور الشعار
    const logoTimer = setTimeout(() => setShowLogo(true), 300);
    
    // تحريك شريط التقدم
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearTimeout(logoTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-500/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* الشعار المتحرك */}
      <AnimatePresence>
        {showLogo && (
          <motion.div 
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", duration: 1, bounce: 0.3 }}
          >
            {/* أيقونة الشعار */}
            <motion.div 
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
              animate={{ 
                boxShadow: [
                  "0 0 60px rgba(16, 185, 129, 0.3)",
                  "0 0 100px rgba(16, 185, 129, 0.5)",
                  "0 0 60px rgba(16, 185, 129, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BookOpen className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            {/* اسم المنصة */}
            <motion.h1 
              className="mt-6 text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              ثانوية تفاعلية
            </motion.h1>
            <motion.p 
              className="mt-2 text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              منصة تعليمية تفاعلية
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* شريط التقدم */}
      <motion.div 
        className="absolute bottom-20 w-64 h-2 bg-slate-700 rounded-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      <motion.p 
        className="absolute bottom-12 text-slate-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        جاري التحميل... {Math.min(Math.round(progress), 100)}%
      </motion.p>
    </motion.div>
  );
}

// ===== مكون الجسيمات المتحركة =====
function ParticlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// ===== مكون العداد المتحرك =====
function AnimatedCounter({ 
  end, 
  duration = 2, 
  suffix = "" 
}: { 
  end: number; 
  duration?: number; 
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// ===== المكون الرئيسي =====
function DashboardContent() {
  const { language, setLanguage, t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"dashboard" | "lessons" | "mindmaps">("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("physics");
  const [selectedMindMap, setSelectedMindMap] = useState<MindMapType>("motion");
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // تأثير الوضع الداكن
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Group lessons by unit
  const groupedLessons = lessonsData.reduce((acc, lesson) => {
    if (!acc[lesson.unit]) {
      acc[lesson.unit] = [];
    }
    acc[lesson.unit].push(lesson);
    return acc;
  }, {} as Record<string, LessonContent[]>);

  // Get unique units
  const units = [...new Set(lessonsData.map(l => l.unit))];

  // Progress calculation
  const totalLessons = lessonsData.length;
  const completedCount = mockProgress.completedLessons.length;
  const progressPercentage = (completedCount / totalLessons) * 100;

  // نظام المكافآت
  const { progress: rewardsProgress, newBadge, closeBadgeModal } = useRewards(initialRewardsProgress);

  // If a lesson is selected, show the lesson view
  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900" dir={dir}>
        <div className="container mx-auto px-4 py-6">
          <LessonView 
            lesson={selectedLesson} 
            language={language} 
            onBack={() => setSelectedLesson(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500" dir={dir}>
      {/* ===== الهيدر ===== */}
      <motion.header 
        className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* الشعار */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25"
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1 
                className="font-bold text-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {language === "ar" ? "ثانوية تفاعلية" : "Interactive HS"}
              </motion.h1>
              <motion.p 
                className="text-xs text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {language === "ar" ? "منصة تعليمية تفاعلية" : "Interactive Learning Platform"}
              </motion.p>
            </div>
          </motion.div>

          {/* التنقل - سطح المكتب */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: "dashboard", label: t("nav.home"), icon: BookOpen },
              { id: "lessons", label: language === "ar" ? "الدروس" : "Lessons", icon: Play },
              { id: "mindmaps", label: language === "ar" ? "خرائط ذهنية" : "Mind Maps", icon: Brain },
            ].map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button 
                  variant={activeTab === item.id ? "default" : "ghost"} 
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`relative overflow-hidden group ${
                    activeTab === item.id 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25" 
                      : ""
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {activeTab !== item.id && (
                    <motion.span 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* الأزرار */}
          <div className="flex items-center gap-2">
            {/* زر تبديل اللغة */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="rounded-full border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 overflow-hidden group"
              >
                <motion.div
                  key={language}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
              </Button>
            </motion.div>

            {/* زر الوضع الداكن */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-4 h-4 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* زر المستخدم */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </Button>
            </motion.div>

            {/* زر القائمة للموبايل */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* قائمة الموبايل */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {[
                  { id: "dashboard", label: t("nav.home"), icon: BookOpen },
                  { id: "lessons", label: language === "ar" ? "الدروس" : "Lessons", icon: Play },
                  { id: "mindmaps", label: language === "ar" ? "خرائط ذهنية" : "Mind Maps", icon: Brain },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab(item.id as typeof activeTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start ${
                      activeTab === item.id 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" 
                        : ""
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ===== المحتوى الرئيسي ===== */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* تبويب لوحة التحكم */}
        {activeTab === "dashboard" && (
          <div className="space-y-10">
            {/* ===== البانر الرئيسي ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-2xl overflow-hidden relative">
                {/* الخلفية المتحركة */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  />
                </div>
                
                {/* الجسيمات */}
                <ParticlesBackground />
                
                <div className="relative p-8 md:p-12 text-white">
                  <motion.div
                    initial={{ opacity: 0, x: dir === "rtl" ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === "ar" ? "مرحباً بك في عالم التعلم التفاعلي" : "Welcome to Interactive Learning"}
                      </span>
                    </motion.div>
                    
                    <motion.h2 
                      className="text-3xl md:text-5xl font-bold mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {t("dashboard.welcome")}
                    </motion.h2>
                    <motion.p 
                      className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {t("dashboard.subtitle")}
                    </motion.p>
                    
                    <motion.div 
                      className="flex flex-wrap gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button 
                        size="lg"
                        className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl shadow-black/20 group"
                        onClick={() => setActiveTab("lessons")}
                      >
                        <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        {language === "ar" ? "ابدأ التعلم" : "Start Learning"}
                        {dir === "rtl" ? <ChevronLeft className="w-5 h-5 mr-2" /> : <ChevronRight className="w-5 h-5 ml-2" />}
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/10"
                        onClick={() => setActiveTab("mindmaps")}
                      >
                        <Brain className="w-5 h-5 mr-2" />
                        {language === "ar" ? "الخرائط الذهنية" : "Mind Maps"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </Card>
            </motion.section>

            {/* ===== الإحصائيات المتحركة ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: BookOpen, value: 41, labelAr: "درس", labelEn: "Lessons", color: "from-emerald-500 to-teal-500" },
                  { icon: FlaskConical, value: 8, labelAr: "محاكي", labelEn: "Simulators", color: "from-purple-500 to-pink-500" },
                  { icon: Atom, value: 3, labelAr: "مواد", labelEn: "Subjects", color: "from-blue-500 to-cyan-500" },
                  { icon: Users, value: 1500, labelAr: "طالب", labelEn: "Students", color: "from-amber-500 to-orange-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <CardContent className="p-6 text-center">
                        <motion.div 
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                          whileHover={{ rotate: 10 }}
                        >
                          <stat.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                          <AnimatedCounter end={stat.value} suffix="+" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          {language === "ar" ? stat.labelAr : stat.labelEn}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ===== نظام المكافآت والشارات ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-white"
                initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {language === "ar" ? "🏆 المكافآت والشارات" : "🏆 Rewards & Badges"}
              </motion.h2>
              <RewardsSystem progress={rewardsProgress} language={language} />
            </motion.section>

            {/* ===== بطاقات المواد 3D ===== */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-white"
                initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {language === "ar" ? "📚 المواد الدراسية" : "📚 Subjects"}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subjects.map((subject, index) => {
                  const lessonCount = lessonsData.filter(l => l.subject === subject.id).length;
                  const IconComponent = subject.icon;
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 }}
                      whileHover={{ y: -10, rotateY: 5 }}
                      style={{ perspective: 1000 }}
                      className="cursor-pointer"
                      onClick={() => { setSelectedSubject(subject.id); setActiveTab("lessons"); }}
                    >
                      <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${subject.bgColor}`}>
                        <CardContent className="p-6 relative">
                          {/* الخلفية المتحركة */}
                          <motion.div 
                            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${subject.color} opacity-20 rounded-full blur-2xl`}
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.2, 0.3, 0.2]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          />
                          
                          {/* الأيقونة */}
                          <motion.div 
                            className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-6 shadow-xl relative z-10`}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                          >
                            <IconComponent className="w-10 h-10 text-white" />
                          </motion.div>
                          
                          {/* المحتوى */}
                          <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white relative z-10">
                            {language === "ar" ? subject.nameAr : subject.nameEn}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-4 relative z-10">
                            {language === "ar" ? subject.descriptionAr : subject.descriptionEn}
                          </p>
                          
                          {/* الإحصائيات */}
                          <div className="flex gap-4 relative z-10">
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="w-4 h-4 text-emerald-500" />
                              <span className="font-semibold">{lessonCount}</span>
                              <span className="text-slate-500">{language === "ar" ? "درس" : "lessons"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FlaskConical className="w-4 h-4 text-purple-500" />
                              <span className="font-semibold">8</span>
                              <span className="text-slate-500">{language === "ar" ? "محاكي" : "simulators"}</span>
                            </div>
                          </div>
                          
                          {/* زر الاستكشاف */}
                          <motion.div 
                            className="mt-6 relative z-10"
                            whileHover={{ x: dir === "rtl" ? -5 : 5 }}
                          >
                            <Button className={`w-full bg-gradient-to-r ${subject.color} text-white shadow-lg group`}>
                              {language === "ar" ? "استكشف المادة" : "Explore Subject"}
                              {dir === "rtl" ? <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* ===== المحاكيات المميزة ===== */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-white"
                initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {language === "ar" ? "🔬 المحاكيات المميزة" : "🔬 Featured Simulators"}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {featuredSimulators.map((simulator, index) => {
                  const IconComponent = simulator.icon;
                  return (
                    <motion.div
                      key={simulator.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
                        <CardContent className="p-5">
                          <motion.div 
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${simulator.color} flex items-center justify-center mb-4 shadow-lg`}
                            whileHover={{ rotate: 15, scale: 1.1 }}
                          >
                            <IconComponent className="w-7 h-7 text-white" />
                          </motion.div>
                          <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {language === "ar" ? simulator.nameAr : simulator.nameEn}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {language === "ar" ? "محاكي تفاعلي" : "Interactive simulator"}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* ===== شريط التقدم المتحرك ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                          {language === "ar" ? "تقدمك في الرحلة التعليمية" : "Your Learning Journey"}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {completedCount} {language === "ar" ? "من" : "of"} {totalLessons} {language === "ar" ? "درس مكتمل" : "lessons completed"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.span 
                        className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                        key={Math.round(progressPercentage)}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {Math.round(progressPercentage)}%
                      </motion.span>
                    </div>
                  </div>
                  
                  {/* شريط التقدم */}
                  <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progressPercentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                      {/* تأثير اللمعان */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* نص تحفيزي */}
                  <motion.p 
                    className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    {progressPercentage < 30 
                      ? (language === "ar" ? "💪 بداية رائعة! استمر في التعلم" : "💪 Great start! Keep learning")
                      : progressPercentage < 70
                        ? (language === "ar" ? "🔥 أنت تتقدم بشكل ممتاز!" : "🔥 You're making excellent progress!")
                        : (language === "ar" ? "🏆 قريب جداً من الهدف! أنت بطل!" : "🏆 So close to the goal! You're a champion!")
                    }
                  </motion.p>
                </CardContent>
              </Card>
            </motion.section>

            {/* ===== استمر في التعلم ===== */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-white"
                initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {language === "ar" ? "🎯 استمر في التعلم" : "🎯 Continue Learning"}
              </motion.h2>
              {lessonsData.find(l => l.id === mockProgress.currentLesson) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className="border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    onClick={() => setSelectedLesson(lessonsData.find(l => l.id === mockProgress.currentLesson)!)}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* الجزء الملون */}
                        <div className="md:w-48 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Play className="w-16 h-16 text-white" />
                          </motion.div>
                        </div>
                        
                        {/* المحتوى */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge className="mb-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                {language === "ar" ? "الدرس التالي" : "Next Lesson"}
                              </Badge>
                              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                {language === "ar" 
                                  ? lessonsData.find(l => l.id === mockProgress.currentLesson)?.titleAr
                                  : lessonsData.find(l => l.id === mockProgress.currentLesson)?.titleEn}
                              </h3>
                              <div className="flex items-center gap-4 text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {lessonsData.find(l => l.id === mockProgress.currentLesson)?.duration} {language === "ar" ? "دقيقة" : "min"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Atom className="w-4 h-4" />
                                  {language === "ar" ? "الفيزياء" : "Physics"}
                                </span>
                              </div>
                            </div>
                            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg group">
                              {language === "ar" ? "ابدأ الآن" : "Start Now"}
                              {dir === "rtl" ? <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.section>
          </div>
        )}

        {/* ===== تبويب الدروس ===== */}
        {activeTab === "lessons" && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white"
              initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {language === "ar" ? "📖 قائمة الدروس" : "📖 Lessons List"}
            </motion.h2>

            {/* فلتر المواد */}
            <motion.div 
              className="flex gap-2 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant={selectedSubject === "all" ? "default" : "outline"}
                onClick={() => setSelectedSubject("all")}
                className={selectedSubject === "all" ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" : ""}
              >
                {language === "ar" ? "الكل" : "All"}
              </Button>
              {subjects.map((subject) => (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? "default" : "outline"}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={selectedSubject === subject.id ? `bg-gradient-to-r ${subject.color} text-white` : ""}
                >
                  <subject.icon className="w-4 h-4 mr-2" />
                  {language === "ar" ? subject.nameAr : subject.nameEn}
                </Button>
              ))}
            </motion.div>

            {/* الدروس حسب الوحدة */}
            {units.map((unit, unitIndex) => {
              const unitLessons = groupedLessons[unit] || [];
              const filteredLessons = selectedSubject === "all" 
                ? unitLessons 
                : unitLessons.filter(l => l.subject === selectedSubject);
              
              if (filteredLessons.length === 0) return null;

              const unitInfo = filteredLessons[0];
              
              return (
                <motion.div 
                  key={unit} 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: unitIndex * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <motion.div 
                      className={`w-3 h-3 rounded-full ${
                        unit === "mechanics" ? "bg-emerald-500" : 
                        unit === "forces" ? "bg-orange-500" : 
                        unit === "energy" ? "bg-purple-500" : "bg-blue-500"
                      }`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {language === "ar" ? unitInfo.unitAr : unitInfo.unitEn}
                  </h3>
                  
                  <div className="grid gap-3">
                    {filteredLessons.map((lesson, lessonIndex) => {
                      const isCompleted = mockProgress.completedLessons.includes(lesson.id);
                      const isLocked = !lesson.isFree && !mockProgress.completedLessons.includes(lesson.id) && lesson.order > 2;
                      
                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: lessonIndex * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <Card 
                            className={`border-0 shadow-md transition-all cursor-pointer hover:shadow-lg ${
                              isLocked ? "opacity-60" : ""
                            }`}
                            onClick={() => !isLocked && setSelectedLesson(lesson)}
                          >
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <motion.div 
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    isCompleted 
                                      ? "bg-gradient-to-br from-emerald-500 to-teal-500" 
                                      : isLocked 
                                        ? "bg-slate-100 dark:bg-slate-800"
                                        : "bg-gradient-to-br from-amber-400 to-orange-500"
                                  }`}
                                  whileHover={{ rotate: 10 }}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="w-6 h-6 text-white" />
                                  ) : isLocked ? (
                                    <Lock className="w-6 h-6 text-slate-400" />
                                  ) : (
                                    <Play className="w-6 h-6 text-white" />
                                  )}
                                </motion.div>
                                <div>
                                  <h4 className="font-semibold text-lg text-slate-800 dark:text-white">
                                    {language === "ar" ? lesson.titleAr : lesson.titleEn}
                                  </h4>
                                  <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {lesson.duration} {language === "ar" ? "دقيقة" : "min"}
                                    </span>
                                    {lesson.isFree ? (
                                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                        {language === "ar" ? "مجاني" : "Free"}
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                        {language === "ar" ? "مدفوع" : "Premium"}
                                      </Badge>
                                    )}
                                    {lesson.simulators.length > 0 && (
                                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                        <FlaskConical className="w-3 h-3 mr-1" />
                                        {lesson.simulators.length} {language === "ar" ? "محاكي" : "simulators"}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isCompleted && (
                                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                    {language === "ar" ? "مكتمل" : "Completed"}
                                  </Badge>
                                )}
                                {dir === "rtl" ? <ChevronLeft className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ===== تبويب الخرائط الذهنية ===== */}
        {activeTab === "mindmaps" && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white"
              initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {language === "ar" ? "🧠 الخرائط الذهنية التفاعلية" : "🧠 Interactive Mind Maps"}
            </motion.h2>

            {/* أزرار اختيار الخريطة */}
            <motion.div 
              className="flex gap-2 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {mindMapsList.map((map) => (
                <Button
                  key={map.id}
                  variant={selectedMindMap === map.id ? "default" : "outline"}
                  onClick={() => setSelectedMindMap(map.id)}
                  className={selectedMindMap === map.id ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" : ""}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {language === "ar" ? map.nameAr : map.nameEn}
                </Button>
              ))}
            </motion.div>

            {/* عرض الخريطة الذهنية */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-[600px]">
                    <MindMap 
                      data={MIND_MAPS[selectedMindMap]} 
                      language={language}
                      onNodeClick={(node) => {
                        console.log("Clicked node:", node);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* تعليمات الاستخدام */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="w-5 h-5 text-emerald-600" />
                    </motion.div>
                    {language === "ar" ? "كيفية استخدام الخريطة الذهنية" : "How to use the Mind Map"}
                  </h3>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                    {[
                      { color: "bg-emerald-500", textAr: "انقر على العقدة لتوسيع أو طي الفروع", textEn: "Click on a node to expand or collapse branches" },
                      { color: "bg-blue-500", textAr: "استخدم العجلة للتكبير والتصغير", textEn: "Use the mouse wheel to zoom in/out" },
                      { color: "bg-purple-500", textAr: "اسحب لتحريك الخريطة", textEn: "Drag to pan the map" },
                      { color: "bg-amber-500", textAr: "استخدم زر 'توسيع الكل' لعرض كل الفروع", textEn: "Use 'Expand All' button to show all branches" },
                    ].map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <motion.span 
                          className={`w-2 h-2 rounded-full ${item.color}`}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                        />
                        {language === "ar" ? item.textAr : item.textEn}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* ===== التنقل للموبايل ===== */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-around py-2">
          {[
            { id: "dashboard", icon: BookOpen, label: t("nav.home") },
            { id: "lessons", icon: Play, label: language === "ar" ? "الدروس" : "Lessons" },
            { id: "mindmaps", icon: Brain, label: language === "ar" ? "خرائط" : "Mind Maps" },
          ].map((item) => (
            <Button 
              key={item.id}
              variant="ghost" 
              className="flex flex-col gap-1 h-auto py-2 px-4"
              onClick={() => setActiveTab(item.id as typeof activeTab)}
            >
              <motion.div
                animate={activeTab === item.id ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-emerald-600" : "text-slate-400"}`} />
              </motion.div>
              <span className={`text-xs ${activeTab === item.id ? "text-emerald-600 font-semibold" : "text-slate-500"}`}>
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </motion.nav>

      {/* ===== الفوتر ===== */}
      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-8 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* قسم الشعار */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    {language === "ar" ? "ثانوية تفاعلية" : "Interactive HS"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === "ar" ? "منصة تعليمية تفاعلية" : "Interactive Learning Platform"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {language === "ar" 
                  ? "منصة تعليمية متكاملة تهدف إلى تقديم تجربة تعلم تفاعلية وممتعة للطلاب."
                  : "A comprehensive educational platform aimed at providing an interactive and enjoyable learning experience for students."}
              </p>
            </motion.div>

            {/* روابط سريعة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">
                {language === "ar" ? "روابط سريعة" : "Quick Links"}
              </h4>
              <ul className="space-y-2">
                {[
                  { labelAr: "الدروس", labelEn: "Lessons", tab: "lessons" as const },
                  { labelAr: "الخرائط الذهنية", labelEn: "Mind Maps", tab: "mindmaps" as const },
                  { labelAr: "المحاكيات", labelEn: "Simulators", tab: "lessons" as const },
                ].map((link) => (
                  <li key={link.labelAr}>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                      onClick={() => setActiveTab(link.tab)}
                    >
                      {language === "ar" ? link.labelAr : link.labelEn}
                    </Button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* التواصل */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">
                {language === "ar" ? "تواصل معنا" : "Contact Us"}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {language === "ar" 
                  ? "نحن هنا لمساعدتك في رحلتك التعليمية."
                  : "We are here to help you in your learning journey."}
              </p>
            </motion.div>
          </div>

          {/* حقوق الملكية */}
          <motion.div 
            className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 {language === "ar" ? "ثانوية تفاعلية" : "Interactive High School"}. {t("footer.rights")}
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// ===== المكون الرئيسي للتصدير =====
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
        <LanguageProvider>
          <DashboardContent />
        </LanguageProvider>
      )}
    </>
  );
}
