"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Target, Lightbulb, Calculator, FlaskConical, 
  ChevronLeft, ChevronRight, Play, CheckCircle, ArrowRight,
  FileText, Zap, Brain, HelpCircle
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

interface LessonViewProps {
  lesson: LessonContent;
  language: "ar" | "en";
  onBack: () => void;
}

export function LessonView({ lesson, language, onBack }: LessonViewProps) {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const dir = language === "ar" ? "rtl" : "ltr";

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
    },
  };

  const t = texts[language];
  const content = language === "ar" ? lesson : lesson; // Use appropriate language content

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

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          {dir === "rtl" ? <ChevronRight className="w-4 h-4 ml-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
          {t.back}
        </Button>
      </div>

      {/* Lesson Title Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${
          lesson.subject === "physics" ? "from-emerald-500 to-teal-500" :
          lesson.subject === "math" ? "from-blue-500 to-indigo-500" :
          "from-purple-500 to-pink-500"
        }`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {language === "ar" ? lesson.unitAr : lesson.unitEn}
                </Badge>
                <Badge variant="secondary">
                  {lesson.duration} {t.minutes}
                </Badge>
                {lesson.isFree ? (
                  <Badge className="bg-emerald-100 text-emerald-700">{t.free}</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700">{t.premium}</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">
                {language === "ar" ? lesson.titleAr : lesson.titleEn}
              </h1>
            </div>
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              lesson.subject === "physics" ? "bg-emerald-100" :
              lesson.subject === "math" ? "bg-blue-100" :
              "bg-purple-100"
            }`}>
              {lesson.subject === "physics" ? <FlaskConical className="w-8 h-8 text-emerald-600" /> :
               lesson.subject === "math" ? <Calculator className="w-8 h-8 text-blue-600" /> :
               <FlaskConical className="w-8 h-8 text-purple-600" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="intro" className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{t.introduction}</span>
          </TabsTrigger>
          <TabsTrigger value="objectives" className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">{t.objectives}</span>
          </TabsTrigger>
          <TabsTrigger value="concepts" className="flex items-center gap-1">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">{t.keyConcepts}</span>
          </TabsTrigger>
          <TabsTrigger value="formulas" className="flex items-center gap-1">
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">{t.formulas}</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">{t.examples}</span>
          </TabsTrigger>
          <TabsTrigger value="simulators" className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">{t.simulators}</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">{t.summary}</span>
          </TabsTrigger>
        </TabsList>

        {/* Introduction */}
        <TabsContent value="intro" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                {t.introduction}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line text-lg leading-relaxed">
                  {language === "ar" ? lesson.introduction.ar : lesson.introduction.en}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectives */}
        <TabsContent value="objectives" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                {t.objectives}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {(language === "ar" ? lesson.objectives.ar : lesson.objectives.en).map((obj, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-lg">{obj}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Key Concepts */}
        <TabsContent value="concepts" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                {t.keyConcepts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {(language === "ar" ? lesson.keyConcepts.ar : lesson.keyConcepts.en).map((concept, index) => (
                  <div key={index} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{concept.term}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{concept.definition}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formulas */}
        <TabsContent value="formulas" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-500" />
                {t.formulas}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {(language === "ar" ? lesson.formulas.ar : lesson.formulas.en).map((formula, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <code className="text-2xl font-mono font-bold text-purple-700 dark:text-purple-300">
                        {formula.formula}
                      </code>
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{formula.explanation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                {t.examples}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(language === "ar" ? lesson.examples.ar : lesson.examples.en).map((example, index) => (
                  <div key={index} className="border rounded-xl overflow-hidden">
                    {/* Question */}
                    <div className="p-4 bg-green-50 dark:bg-green-950 border-b">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <span className="font-bold text-green-700 dark:text-green-300">{t.question}:</span>
                          <p className="mt-1 text-lg">{example.question}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Solution */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border-b">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <span className="font-bold text-blue-700 dark:text-blue-300">{t.solution}:</span>
                          <p className="mt-1 text-lg font-mono">{example.solution}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Steps */}
                    <div className="p-4">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{t.steps}:</span>
                      <div className="mt-2 space-y-2">
                        {example.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm shrink-0">
                              {stepIndex + 1}
                            </span>
                            <code className="text-slate-700 dark:text-slate-300">{step}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulators */}
        <TabsContent value="simulators" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                {t.simulators}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {lesson.simulators.map((simId) => (
                  <div key={simId} className="border rounded-xl overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{getSimulatorName(simId)}</h3>
                          <p className="text-sm text-slate-500">{t.simulator}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      {renderSimulator(simId)}
                    </div>
                  </div>
                ))}
                
                {lesson.simulators.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    {language === "ar" ? "لا توجد محاكيات لهذا الدرس" : "No simulators for this lesson"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary */}
        <TabsContent value="summary" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                {t.summary}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-lg leading-relaxed">
                  {language === "ar" ? lesson.summary.ar : lesson.summary.en}
                </p>
              </div>
              
              {/* Quick Review */}
              <div className="mt-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  {language === "ar" ? "مراجعة سريعة" : "Quick Review"}
                </h3>
                <div className="grid gap-3">
                  {(language === "ar" ? lesson.keyConcepts.ar : lesson.keyConcepts.en).slice(0, 3).map((concept, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span><strong>{concept.term}:</strong> {concept.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
