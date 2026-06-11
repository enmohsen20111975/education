"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Target, Lightbulb, Calculator, FlaskConical, 
  ChevronLeft, ChevronRight, Play, CheckCircle, ArrowRight,
  FileText, Zap, Brain, HelpCircle, Network, BarChart3,
  Share2, Copy, Twitter, Facebook, Link2, PartyPopper,
  Sparkles, Check, RotateCcw, Eye, EyeOff, Trophy, Star
} from "lucide-react";
import type { LessonContent } from "@/data/lessons";
import { MotionSimulator } from "@/components/simulators/MotionSimulator";
import { ForcesSimulator } from "@/components/simulators/ForcesSimulator";
import { EnergySimulator } from "@/components/simulators/EnergySimulator";
import { FreeFallSimulator } from "@/components/simulators/FreeFallSimulator";
import { WaveSimulator } from "@/components/simulators/WaveSimulator";
import { FunctionsSimulator } from "@/components/simulators/FunctionsSimulator";
import { PeriodicTableSimulator } from "@/components/simulators/PeriodicTableSimulator";
import { ProjectileSimulator } from "@/components/simulators/ProjectileSimulator";
import MindMap, { MIND_MAPS, type MindMapType } from "@/components/MindMap";
import { Infographic, energyCircleData, atomTimelineData, speedComparisonData } from "@/components/Infographic";

interface LessonViewProps {
  lesson: LessonContent;
  language: "ar" | "en";
  onBack: () => void;
}

// Confetti Particle Component
const ConfettiParticle = ({ color, x, delay }: { color: string; x: number; delay: number }) => (
  <motion.div
    className="absolute w-3 h-3 rounded-sm"
    style={{ 
      backgroundColor: color,
      left: `${x}%`,
      top: -20
    }}
    initial={{ y: 0, rotate: 0, opacity: 1 }}
    animate={{ 
      y: window.innerHeight + 100,
      rotate: Math.random() * 720 - 360,
      opacity: [1, 1, 0]
    }}
    transition={{ 
      duration: 2 + Math.random() * 2,
      delay,
      ease: "easeIn"
    }}
  />
);

// Flip Card Component for Concepts
const FlipCard = ({ term, definition, language }: { term: string; definition: string; language: "ar" | "en" }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <div 
      className="relative h-48 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 flex flex-col items-center justify-center p-4 shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
            <Lightbulb className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="font-bold text-lg text-center">{term}</h3>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {language === "ar" ? "انقر للقلب" : "Click to flip"}
          </p>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 flex items-center justify-center p-4 shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          dir={dir}
        >
          <p className="text-center text-slate-700 dark:text-slate-300">{definition}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Step Animation Component for Examples
const AnimatedStep = ({ step, index, isVisible }: { step: string; index: number; isVisible: boolean }) => {
  return (
    <motion.div
      className="flex items-start gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: index * 0.2, duration: 0.4 }}
    >
      <motion.span 
        className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center text-sm shrink-0"
        initial={{ scale: 0 }}
        animate={isVisible ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: index * 0.2 + 0.1, type: "spring", stiffness: 300 }}
      >
        {index + 1}
      </motion.span>
      <code className="text-slate-700 dark:text-slate-300">{step}</code>
    </motion.div>
  );
};

// Navigation Tab Button Component
const NavTabButton = ({ 
  value, 
  icon: Icon, 
  label, 
  isActive,
  onClick,
  visited
}: { 
  value: string; 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
  visited: boolean;
}) => (
  <motion.button
    onClick={onClick}
    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
      isActive 
        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" 
        : visited
          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
    }`}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.div
      animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
      transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
    >
      <Icon className="w-4 h-4" />
    </motion.div>
    <span className="hidden sm:inline">{label}</span>
    {visited && !isActive && (
      <Check className="w-3 h-3 text-emerald-500" />
    )}
    {isActive && (
      <motion.div
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
        layoutId="activeTab"
      />
    )}
  </motion.button>
);

export function LessonView({ lesson, language, onBack }: LessonViewProps) {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set(["intro"]));
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const dir = language === "ar" ? "rtl" : "ltr";

  // Calculate progress
  const totalSections = 9;
  const progress = (visitedSections.size / totalSections) * 100;

  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setVisitedSections(prev => new Set([...prev, section]));
  };

  // Handle lesson completion
  const handleComplete = () => {
    setIsCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Copy link to clipboard
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, []);

  // Share functions
  const shareOnTwitter = () => {
    const text = language === "ar" 
      ? `تعلمت درس ${lesson.titleAr} على منصة ثانوية تفاعلية!`
      : `I just learned ${lesson.titleEn} on Thawaniya Interactive!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const texts = {
    ar: {
      objectives: "أهداف الدرس",
      introduction: "المقدمة",
      keyConcepts: "المفاهيم الأساسية",
      formulas: "المعادلات",
      examples: "أمثلة محلولة",
      simulators: "المحاكيات التفاعلية",
      summary: "الملخص",
      mindMap: "الخريطة الذهنية",
      infographics: "الرسوم التوضيحية",
      back: "العودة للدروس",
      minutes: "دقيقة",
      free: "مجاني",
      premium: "مدفوع",
      simulator: "محاكي تفاعلي",
      showSimulator: "افتح المحاكي",
      question: "السؤال",
      solution: "الحل",
      steps: "خطوات الحل",
      definition: "التعريف",
      term: "المصطلح",
      explanation: "الشرح",
      interactiveMindMap: "خريطة ذهنية تفاعلية للمفاهيم",
      visualDiagrams: "مخططات توضيحية للدرس",
      completeLesson: "أكملت الدرس",
      lessonCompleted: "تم إكمال الدرس!",
      congratulations: "تهانينا! لقد أكملت هذا الدرس بنجاح",
      pointsEarned: "نقطة مكتسبة",
      share: "مشاركة",
      shareLesson: "شارك الدرس",
      copyLink: "نسخ الرابط",
      linkCopied: "تم النسخ!",
      shareOnTwitter: "شارك على تويتر",
      shareOnFacebook: "شارك على فيسبوك",
      progress: "التقدم",
      keyPoints: "النقاط المهمة",
      clickToFlip: "انقر للقلب",
      flipCard: "بطاقة تفاعلية",
      letsLearn: "هيا نتعلم!",
    },
    en: {
      objectives: "Objectives",
      introduction: "Introduction",
      keyConcepts: "Key Concepts",
      formulas: "Formulas",
      examples: "Solved Examples",
      simulators: "Interactive Simulators",
      summary: "Summary",
      mindMap: "Mind Map",
      infographics: "Infographics",
      back: "Back to Lessons",
      minutes: "min",
      free: "Free",
      premium: "Premium",
      simulator: "Interactive Simulator",
      showSimulator: "Open Simulator",
      question: "Question",
      solution: "Solution",
      steps: "Solution Steps",
      definition: "Definition",
      term: "Term",
      explanation: "Explanation",
      interactiveMindMap: "Interactive Mind Map of Concepts",
      visualDiagrams: "Visual Diagrams for the Lesson",
      completeLesson: "Complete Lesson",
      lessonCompleted: "Lesson Completed!",
      congratulations: "Congratulations! You have successfully completed this lesson",
      pointsEarned: "points earned",
      share: "Share",
      shareLesson: "Share Lesson",
      copyLink: "Copy Link",
      linkCopied: "Copied!",
      shareOnTwitter: "Share on Twitter",
      shareOnFacebook: "Share on Facebook",
      progress: "Progress",
      keyPoints: "Key Points",
      clickToFlip: "Click to flip",
      flipCard: "Interactive Card",
      letsLearn: "Let's Learn!",
    },
  };

  const t = texts[language];

  // Confetti colors
  const confettiColors = ["#10b981", "#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"];

  // Render simulator by ID
  const renderSimulator = (simId: string) => {
    switch (simId) {
      case "motion":
        return <MotionSimulator language={language} />;
      case "forces":
        return <ForcesSimulator language={language} />;
      case "energy":
        return <EnergySimulator language={language} />;
      case "freeFall":
        return <FreeFallSimulator language={language} />;
      case "wave":
        return <WaveSimulator language={language} />;
      case "functions":
        return <FunctionsSimulator language={language} />;
      case "periodicTable":
        return <PeriodicTableSimulator language={language} />;
      case "projectile":
        return <ProjectileSimulator language={language} />;
      default:
        return null;
    }
  };

  // Get simulator name
  const getSimulatorName = (simId: string) => {
    const names: Record<string, { ar: string; en: string }> = {
      motion: { ar: "محاكي الحركة", en: "Motion Simulator" },
      forces: { ar: "محاكي القوى", en: "Forces Simulator" },
      energy: { ar: "محاكي الطاقة", en: "Energy Simulator" },
      freeFall: { ar: "محاكي السقوط الحر", en: "Free Fall Simulator" },
      wave: { ar: "محاكي الموجات", en: "Wave Simulator" },
      functions: { ar: "محاكي الدوال", en: "Functions Simulator" },
      periodicTable: { ar: "الجدول الدوري", en: "Periodic Table" },
      projectile: { ar: "محاكي الرمي الأفقي", en: "Projectile Motion" },
    };
    return names[simId]?.[language] || simId;
  };

  // Get mind map for lesson
  const getMindMapForLesson = (): MindMapType | null => {
    if (lesson.id.includes("motion") || lesson.id.includes("velocity") || lesson.id.includes("acceleration")) {
      return "motion";
    }
    if (lesson.id.includes("energy") || lesson.id.includes("work")) {
      return "energy";
    }
    if (lesson.id.includes("atom") || lesson.id.includes("periodic") || lesson.id.includes("electron")) {
      return "atom";
    }
    // Default based on subject
    if (lesson.subject === "physics") return "motion";
    if (lesson.subject === "chemistry") return "atom";
    return "motion";
  };

  // Get infographic for lesson
  const getInfographicForLesson = () => {
    if (lesson.id.includes("energy")) {
      return {
        type: "circle" as const,
        data: energyCircleData,
        title: language === "ar" ? "أنواع الطاقة" : "Types of Energy",
      };
    }
    if (lesson.id.includes("atom")) {
      return {
        type: "timeline" as const,
        data: atomTimelineData,
        title: language === "ar" ? "تطور نظرية الذرة" : "Atomic Theory Evolution",
      };
    }
    if (lesson.id.includes("motion") || lesson.id.includes("velocity")) {
      return {
        type: "comparison" as const,
        data: speedComparisonData,
        title: language === "ar" ? "مقارنة السرعة والتسارع" : "Velocity vs Acceleration",
      };
    }
    // Default
    return {
      type: "circle" as const,
      data: energyCircleData,
      title: language === "ar" ? "توزيع المفاهيم" : "Concepts Distribution",
    };
  };

  const mindMapType = getMindMapForLesson();
  const infographicData = getInfographicForLesson();

  // Section order for navigation
  const sections = [
    { value: "intro", icon: BookOpen, label: t.introduction },
    { value: "objectives", icon: Target, label: t.objectives },
    { value: "concepts", icon: Lightbulb, label: t.keyConcepts },
    { value: "formulas", icon: Calculator, label: t.formulas },
    { value: "examples", icon: FileText, label: t.examples },
    { value: "simulators", icon: Play, label: t.simulators },
    { value: "mindmap", icon: Network, label: t.mindMap },
    { value: "infographics", icon: BarChart3, label: t.infographics },
    { value: "summary", icon: Brain, label: t.summary },
  ];

  return (
    <div className="space-y-6 relative" dir={dir}>
      {/* Progress Bar - Fixed at top */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-800 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Shine effect */}
        <motion.div
          className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "200vw"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </motion.div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <ConfettiParticle
                key={i}
                color={confettiColors[i % confettiColors.length]}
                x={Math.random() * 100}
                delay={Math.random() * 0.5}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          {dir === "rtl" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
          {t.back}
        </Button>

        {/* Share Button */}
        <div className="relative">
          <Button 
            variant="outline" 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            {t.share}
          </Button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 rounded-xl shadow-xl border p-3 min-w-[200px] z-50"
              >
                <p className="text-sm font-medium text-slate-500 mb-2">{t.shareLesson}</p>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={shareOnTwitter}>
                    <Twitter className="w-4 h-4 text-sky-500" />
                    {t.shareOnTwitter}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={shareOnFacebook}>
                    <Facebook className="w-4 h-4 text-blue-600" />
                    {t.shareOnFacebook}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={copyLink}>
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? t.linkCopied : t.copyLink}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between text-sm text-slate-500 px-1">
        <span>{t.progress}: {Math.round(progress)}%</span>
        <span>{visitedSections.size}/{totalSections}</span>
      </div>

      {/* Lesson Title Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${
          lesson.subject === "physics" ? "from-emerald-500 to-teal-500" :
          lesson.subject === "math" ? "from-blue-500 to-cyan-500" :
          "from-purple-500 to-pink-500"
        }`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline">
                  {language === "ar" ? lesson.unitAr : lesson.unitEn}
                </Badge>
                <Badge variant="secondary">
                  {lesson.duration} {t.minutes}
                </Badge>
                {lesson.isFree ? (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">{t.free}</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">{t.premium}</Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {language === "ar" ? lesson.titleAr : lesson.titleEn}
              </h1>
            </div>
            <motion.div 
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
                lesson.subject === "physics" ? "bg-emerald-100 dark:bg-emerald-900" :
                lesson.subject === "math" ? "bg-blue-100 dark:bg-blue-900" :
                "bg-purple-100 dark:bg-purple-900"
              }`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              {lesson.subject === "physics" ? <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" /> :
               lesson.subject === "math" ? <Calculator className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" /> :
               <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Navigation Tabs */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {sections.map((section) => (
            <NavTabButton
              key={section.value}
              value={section.value}
              icon={section.icon}
              label={section.label}
              isActive={activeSection === section.value}
              onClick={() => handleSectionChange(section.value)}
              visited={visitedSections.has(section.value)}
            />
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {/* Introduction */}
        {activeSection === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                  {t.introduction}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Introduction Image/Illustration */}
                  <div className="flex flex-col justify-center">
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-lg leading-relaxed">
                        {language === "ar" ? lesson.introduction.ar : lesson.introduction.en}
                      </div>
                    </div>
                    
                    {/* Key Points Highlight */}
                    <motion.div 
                      className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl border border-emerald-200 dark:border-emerald-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">{t.keyPoints}</span>
                      </div>
                      <ul className="space-y-2">
                        {(language === "ar" ? lesson.objectives.ar : lesson.objectives.en).slice(0, 3).map((obj, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start gap-2 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                          >
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{obj}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Visual Illustration */}
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className={`relative w-full max-w-xs aspect-square rounded-2xl p-8 ${
                      lesson.subject === "physics" ? "bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900" :
                      lesson.subject === "math" ? "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900" :
                      "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900"
                    }`}>
                      {/* Animated illustration */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className={`w-32 h-32 rounded-full flex items-center justify-center ${
                            lesson.subject === "physics" ? "bg-emerald-200 dark:bg-emerald-800" :
                            lesson.subject === "math" ? "bg-blue-200 dark:bg-blue-800" :
                            "bg-purple-200 dark:bg-purple-800"
                          }`}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          {lesson.subject === "physics" ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                              <FlaskConical className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                            </motion.div>
                          ) : lesson.subject === "math" ? (
                            <Calculator className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <FlaskConical className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                          )}
                        </motion.div>
                      </div>

                      {/* Floating elements */}
                      <motion.div
                        className="absolute top-8 left-8 w-8 h-8 rounded-full bg-white/50 dark:bg-black/20"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute bottom-12 right-8 w-6 h-6 rounded-full bg-white/30 dark:bg-black/10"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute top-16 right-12 w-4 h-4 rounded-full bg-white/40 dark:bg-black/15"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Let's Learn Button */}
                <motion.div 
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    onClick={() => handleSectionChange("objectives")}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    {t.letsLearn}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Objectives */}
        {activeSection === "objectives" && (
          <motion.div
            key="objectives"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  {t.objectives}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {(language === "ar" ? lesson.objectives.ar : lesson.objectives.en).map((obj, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl border border-blue-100 dark:border-blue-900"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shrink-0"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {index + 1}
                      </motion.div>
                      <span className="text-lg pt-1">{obj}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Concepts - With Flip Cards */}
        {activeSection === "concepts" && (
          <motion.div
            key="concepts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  {t.keyConcepts}
                  <Badge variant="secondary" className="ml-2">
                    {t.clickToFlip}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(language === "ar" ? lesson.keyConcepts.ar : lesson.keyConcepts.en).map((concept, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FlipCard
                        term={concept.term}
                        definition={concept.definition}
                        language={language}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Formulas - Enhanced Design */}
        {activeSection === "formulas" && (
          <motion.div
            key="formulas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-500" />
                  {t.formulas}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {(language === "ar" ? lesson.formulas.ar : lesson.formulas.en).map((formula, index) => (
                    <motion.div 
                      key={index} 
                      className="relative p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950 dark:via-pink-950 dark:to-purple-950 rounded-2xl border border-purple-200 dark:border-purple-800 overflow-hidden"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/50 to-pink-200/50 dark:from-purple-800/30 dark:to-pink-800/30 rounded-full -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <motion.div 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-md"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.15 + 0.1 }}
                          >
                            <code className="text-xl sm:text-2xl font-mono font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formula.formula}
                            </code>
                          </motion.div>
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Zap className="w-8 h-8 text-purple-400" />
                          </motion.div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">{formula.explanation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Examples - Step by Step Animation */}
        {activeSection === "examples" && (
          <motion.div
            key="examples"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  {t.examples}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(language === "ar" ? lesson.examples.ar : lesson.examples.en).map((example, index) => (
                    <motion.div 
                      key={index} 
                      className="border rounded-2xl overflow-hidden shadow-lg"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {/* Question */}
                      <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-b">
                        <div className="flex items-start gap-3">
                          <motion.div 
                            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <HelpCircle className="w-5 h-5 text-white" />
                          </motion.div>
                          <div className="flex-1">
                            <span className="font-bold text-green-700 dark:text-green-300 text-lg">{t.question}:</span>
                            <p className="mt-2 text-lg">{example.question}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Solution */}
                      <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-b">
                        <div className="flex items-start gap-3">
                          <motion.div 
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                          </motion.div>
                          <div className="flex-1">
                            <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">{t.solution}:</span>
                            <p className="mt-2 text-xl font-mono font-bold text-blue-600 dark:text-blue-400">{example.solution}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Steps */}
                      <div className="p-5 bg-slate-50 dark:bg-slate-900">
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-lg flex items-center gap-2">
                          <ArrowRight className="w-5 h-5 text-emerald-500" />
                          {t.steps}:
                        </span>
                        <div className="mt-4 space-y-3">
                          {example.steps.map((step, stepIndex) => (
                            <AnimatedStep 
                              key={stepIndex} 
                              step={step} 
                              index={stepIndex} 
                              isVisible={true} 
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Simulators */}
        {activeSection === "simulators" && (
          <motion.div
            key="simulators"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-red-500" />
                  {t.simulators}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {lesson.simulators.map((simId) => (
                    <motion.div 
                      key={simId} 
                      className="border rounded-2xl overflow-hidden"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                    >
                      <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-b">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Play className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-lg">{getSimulatorName(simId)}</h3>
                            <p className="text-sm text-slate-500">{t.simulator}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        {renderSimulator(simId)}
                      </div>
                    </motion.div>
                  ))}
                  
                  {lesson.simulators.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      {language === "ar" ? "لا توجد محاكيات لهذا الدرس" : "No simulators for this lesson"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Mind Map */}
        {activeSection === "mindmap" && (
          <motion.div
            key="mindmap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-500" />
                  {t.mindMap}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 mb-4">{t.interactiveMindMap}</p>
                <div className="h-[500px] rounded-xl overflow-hidden border">
                  {mindMapType && (
                    <MindMap 
                      data={MIND_MAPS[mindMapType]} 
                      language={language} 
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Infographics */}
        {activeSection === "infographics" && (
          <motion.div
            key="infographics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  {t.infographics}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 mb-4">{t.visualDiagrams}</p>
                <Infographic
                  type={infographicData.type}
                  data={infographicData.data}
                  language={language}
                  title={infographicData.title}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Summary with Completion */}
        {activeSection === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  {t.summary}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl border border-indigo-200 dark:border-indigo-800"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-lg leading-relaxed">
                    {language === "ar" ? lesson.summary.ar : lesson.summary.en}
                  </p>
                </motion.div>
                
                {/* Quick Review */}
                <div className="mt-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    {language === "ar" ? "مراجعة سريعة" : "Quick Review"}
                  </h3>
                  <div className="grid gap-3">
                    {(language === "ar" ? lesson.keyConcepts.ar : lesson.keyConcepts.en).slice(0, 3).map((concept, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span><strong>{concept.term}:</strong> {concept.definition}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Completion Section */}
                <motion.div 
                  className="mt-8 p-6 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {isCompleted ? (
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Trophy className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                        {t.lessonCompleted}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {t.congratulations}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Star className="w-5 h-5" />
                        <span className="font-bold">+50 {t.pointsEarned}</span>
                        <Star className="w-5 h-5" />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {language === "ar" 
                          ? "هل أنجزت هذا الدرس؟ اضغط لإتمامه والحصول على نقاط!"
                          : "Did you complete this lesson? Click to finish and earn points!"}
                      </p>
                      <motion.button
                        onClick={handleComplete}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PartyPopper className="w-6 h-6" />
                        {t.completeLesson}
                        <Sparkles className="w-6 h-6" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            const currentIndex = sections.findIndex(s => s.value === activeSection);
            if (currentIndex > 0) {
              handleSectionChange(sections[currentIndex - 1].value);
            }
          }}
          disabled={activeSection === "intro"}
          className="gap-2"
        >
          {dir === "rtl" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {language === "ar" ? "السابق" : "Previous"}
        </Button>

        <Button 
          variant="outline" 
          onClick={() => {
            const currentIndex = sections.findIndex(s => s.value === activeSection);
            if (currentIndex < sections.length - 1) {
              handleSectionChange(sections[currentIndex + 1].value);
            }
          }}
          disabled={activeSection === "summary"}
          className="gap-2"
        >
          {language === "ar" ? "التالي" : "Next"}
          {dir === "rtl" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
