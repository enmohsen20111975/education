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
  Sparkles, Check, RotateCcw, Eye, EyeOff, Trophy, Star, Clock
} from "lucide-react";
import { MotionSimulator } from "@/components/simulators/MotionSimulator";
import { ForcesSimulator } from "@/components/simulators/ForcesSimulator";
import { EnergySimulator } from "@/components/simulators/EnergySimulator";
import { FreeFallSimulator } from "@/components/simulators/FreeFallSimulator";
import { WaveSimulator } from "@/components/simulators/WaveSimulator";
import { FunctionsSimulator } from "@/components/simulators/FunctionsSimulator";
import { PeriodicTableSimulator } from "@/components/simulators/PeriodicTableSimulator";
import { ProjectileSimulator } from "@/components/simulators/ProjectileSimulator";
import MindMap from "@/components/MindMap";
import { Infographic } from "@/components/Infographic";
import type { LessonDetailFromApi } from "@/hooks/useApi";

interface LessonViewProps {
  lesson: LessonDetailFromApi;
  language: "ar" | "en";
  onBack: () => void;
  onComplete?: () => void;
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
      y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800,
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

export function LessonView({ lesson, language, onBack, onComplete }: LessonViewProps) {
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
    onComplete?.();
  };

  // Copy link to clipboard
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, []);

  // Get localized content
  const getLocalizedContent = (content: { ar: string; en: string }) => {
    return language === "ar" ? content.ar : content.en;
  };

  const getLocalizedArray = (content: { ar: any[]; en: any[] }) => {
    return language === "ar" ? content.ar : content.en;
  };

  // Tab items
  const tabItems = [
    { value: "intro", icon: BookOpen, label: language === "ar" ? "المقدمة" : "Intro" },
    { value: "objectives", icon: Target, label: language === "ar" ? "الأهداف" : "Goals" },
    { value: "concepts", icon: Lightbulb, label: language === "ar" ? "المفاهيم" : "Concepts" },
    { value: "formulas", icon: Calculator, label: language === "ar" ? "المعادلات" : "Formulas" },
    { value: "examples", icon: FileText, label: language === "ar" ? "الأمثلة" : "Examples" },
    { value: "simulator", icon: Zap, label: language === "ar" ? "المحاكي" : "Simulator" },
    { value: "mindmap", icon: Network, label: language === "ar" ? "الخريطة" : "Mind Map" },
    { value: "infographic", icon: BarChart3, label: language === "ar" ? "الرسم" : "Chart" },
    { value: "summary", icon: Brain, label: language === "ar" ? "الملخص" : "Summary" },
  ];

  // Render simulator
  const renderSimulator = (simSlug: string) => {
    switch (simSlug) {
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
        return (
          <div className="text-center py-12 text-slate-500">
            {language === "ar" ? "المحاكي غير متاح" : "Simulator not available"}
          </div>
        );
    }
  };

  return (
    <div className="relative" dir={dir}>
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <ConfettiParticle
                key={i}
                color={["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#f43f5e"][i % 5]}
                x={Math.random() * 100}
                delay={Math.random() * 0.5}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="shrink-0"
          >
            {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              {getLocalizedContent(lesson.titleAr && lesson.titleEn ? { ar: lesson.titleAr, en: lesson.titleEn } : { ar: lesson.titleAr, en: lesson.titleEn })}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="w-3 h-3" />
                {language === "ar" ? lesson.unit.nameAr : lesson.unit.nameEn}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {lesson.duration} {language === "ar" ? "دقيقة" : "min"}
              </Badge>
              {lesson.simulators?.length > 0 && (
                <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Zap className="w-3 h-3" />
                  {lesson.simulators.length} {language === "ar" ? "محاكي" : "simulators"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">
              {language === "ar" ? "التقدم" : "Progress"}
            </span>
            <span className="font-medium text-emerald-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabItems.map((tab) => (
            <NavTabButton
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
              isActive={activeSection === tab.value}
              onClick={() => handleSectionChange(tab.value)}
              visited={visitedSections.has(tab.value)}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Introduction Section */}
          {activeSection === "intro" && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {language === "ar" ? "المقدمة" : "Introduction"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                    {getLocalizedContent(lesson.introduction)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Objectives Section */}
          {activeSection === "objectives" && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {language === "ar" ? "الأهداف التعليمية" : "Learning Objectives"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {getLocalizedArray(lesson.objectives).map((objective: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 pt-1">{objective}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Concepts Section */}
          {activeSection === "concepts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getLocalizedArray(lesson.keyConcepts).map((concept: { term: string; definition: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
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
          )}

          {/* Formulas Section */}
          {activeSection === "formulas" && (
            <div className="space-y-4">
              {getLocalizedArray(lesson.formulas).map((formula: { formula: string; explanation: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="flex items-stretch">
                      <div className="w-24 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        #{index + 1}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="text-center mb-2">
                          <code className="text-2xl font-mono text-purple-600 dark:text-purple-400">
                            {formula.formula}
                          </code>
                        </div>
                        <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                          {formula.explanation}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Examples Section */}
          {activeSection === "examples" && (
            <div className="space-y-6">
              {getLocalizedArray(lesson.examples).map((example: { question: string; solution: string; steps: string[] }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        {language === "ar" ? `مثال ${index + 1}` : `Example ${index + 1}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                          {example.question}
                        </p>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {example.steps?.map((step: string, stepIndex: number) => (
                          <AnimatedStep
                            key={stepIndex}
                            step={step}
                            index={stepIndex}
                            isVisible={true}
                          />
                        ))}
                      </div>

                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                        <p className="font-medium text-emerald-800 dark:text-emerald-200">
                          <strong>{language === "ar" ? "الحل: " : "Solution: "}</strong>
                          {example.solution}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Simulator Section */}
          {activeSection === "simulator" && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {language === "ar" ? "المحاكي التفاعلي" : "Interactive Simulator"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {lesson.simulators?.length > 0 ? (
                  <div>
                    {lesson.simulators.length > 1 && (
                      <div className="flex gap-2 p-4 bg-slate-100 dark:bg-slate-800 overflow-x-auto">
                        {lesson.simulators.map((sim: string, index: number) => (
                          <Badge key={sim} variant="outline" className="shrink-0">
                            {sim}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {renderSimulator(lesson.simulators[0])}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === "ar" ? "لا يوجد محاكي لهذا الدرس" : "No simulator for this lesson"}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Mind Map Section */}
          {activeSection === "mindmap" && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  {language === "ar" ? "الخريطة الذهنية" : "Mind Map"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {lesson.mindMap ? (
                  <div className="h-[600px]">
                    <MindMap data={lesson.mindMap} language={language} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === "ar" ? "لا توجد خريطة ذهنية لهذا الدرس" : "No mind map for this lesson"}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Infographic Section */}
          {activeSection === "infographic" && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {language === "ar" ? "الرسم التوضيحي" : "Infographic"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {lesson.infographic ? (
                  <Infographic
                    type={lesson.infographic.type}
                    data={lesson.infographic.data}
                    language={language}
                  />
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === "ar" ? "لا يوجد رسم توضيحي لهذا الدرس" : "No infographic for this lesson"}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Summary Section */}
          {activeSection === "summary" && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  {language === "ar" ? "ملخص الدرس" : "Lesson Summary"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {getLocalizedContent(lesson.summary)}
                  </p>
                </div>

                {/* Complete Lesson Button */}
                {!isCompleted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={handleComplete}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {language === "ar" ? "إكمال الدرس" : "Complete Lesson"}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 text-center p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl"
                  >
                    <PartyPopper className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                    <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {language === "ar" ? "أحسنت! 🎉" : "Great Job! 🎉"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {language === "ar" ? "لقد أكملت هذا الدرس بنجاح" : "You've completed this lesson successfully"}
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      <Badge className="bg-amber-500 text-white">
                        <Trophy className="w-3 h-3 mr-1" />
                        +50 {language === "ar" ? "نقطة" : "points"}
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 p-4 md:hidden">
        <div className="flex justify-between items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const currentIndex = tabItems.findIndex(t => t.value === activeSection);
              if (currentIndex > 0) {
                handleSectionChange(tabItems[currentIndex - 1].value);
              }
            }}
            disabled={activeSection === "intro"}
          >
            {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          <div className="flex-1 text-center">
            <span className="text-sm text-slate-500">
              {tabItems.findIndex(t => t.value === activeSection) + 1} / {tabItems.length}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const currentIndex = tabItems.findIndex(t => t.value === activeSection);
              if (currentIndex < tabItems.length - 1) {
                handleSectionChange(tabItems[currentIndex + 1].value);
              }
            }}
            disabled={activeSection === "summary"}
          >
            {language === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
