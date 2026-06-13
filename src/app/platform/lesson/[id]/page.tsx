"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Moon, Sun, ChevronRight, ArrowLeft,
  Clock, Play, Lock, BookOpen, Target, Lightbulb, 
  FileText, HelpCircle, Beaker, CheckCircle, FlaskConical
} from "lucide-react";
import { loadStaticData } from "@/lib/static-data";
import { getSimulationsByLessonId, getSimulationsBySubject, Simulation } from "@/lib/simulations";
import { SimulationList } from "@/components/simulations/SimulationCard";
import { InteractiveQuiz } from "@/components/quiz/InteractiveQuiz";

interface Objective {
  id: string;
  textAr: string;
  textEn: string;
  order: number;
}

interface Concept {
  id: string;
  termAr: string;
  termEn: string;
  definitionAr: string;
  definitionEn: string;
  order: number;
}

interface Formula {
  id: string;
  formula: string;
  explanationAr: string;
  explanationEn: string;
  order: number;
}

interface Example {
  id: string;
  questionAr: string;
  questionEn: string;
  solutionAr: string;
  solutionEn: string;
  stepsAr: string;
  stepsEn: string;
  order: number;
}

interface Question {
  id: string;
  type: string;
  questionAr: string;
  questionEn: string;
  optionsAr?: string;
  optionsEn?: string;
  answer: string;
  explanationAr?: string;
  explanationEn?: string;
  points: number;
  difficulty: string;
  order: number;
}

interface LessonDetail {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  duration: number;
  isFree: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  introductionAr: string;
  introductionEn: string;
  summaryAr: string;
  summaryEn: string;
  Objective: Objective[];
  Concept: Concept[];
  Formula: Formula[];
  Example: Example[];
  Question: Question[];
  Unit: {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    Subject: {
      id: string;
      slug: string;
      nameAr: string;
      nameEn: string;
      icon: string;
      color: string;
    };
  };
}

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { language, toggleLanguage, t } = useLanguage();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [relatedSimulations, setRelatedSimulations] = useState<Simulation[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const isRTL = language === "ar";

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await loadStaticData();
        
        let foundLesson: LessonDetail | null = null;
        
        for (const year of data?.academicYears || []) {
          for (const subject of year.Subject || []) {
            for (const unit of subject.Unit || []) {
              const lesson = unit.Lesson?.find((l: any) => l.id === lessonId);
              if (lesson) {
                foundLesson = {
                  ...lesson,
                  Unit: { ...unit, Subject: subject }
                };
                
                // Get related simulations
                const simByLesson = getSimulationsByLessonId(lesson.id);
                const simBySubject = getSimulationsBySubject(subject.nameAr);
                const allSims = [...simByLesson];
                simBySubject.forEach(sim => {
                  if (!allSims.find(s => s.id === sim.id)) {
                    allSims.push(sim);
                  }
                });
                setRelatedSimulations(allSims);
                
                break;
              }
            }
            if (foundLesson) break;
          }
          if (foundLesson) break;
        }
        
        setLesson(foundLesson);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLesson();
  }, [lessonId]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const getTitle = () => {
    if (!lesson) return "";
    return language === "ar" ? lesson.titleAr : lesson.titleEn;
  };

  const getDescription = () => {
    if (!lesson) return "";
    return language === "ar" ? lesson.descriptionAr : lesson.descriptionEn;
  };

  const getIntroduction = () => {
    if (!lesson) return "";
    return language === "ar" ? lesson.introductionAr : lesson.introductionEn;
  };

  const getSummary = () => {
    if (!lesson) return "";
    return language === "ar" ? lesson.summaryAr : lesson.summaryEn;
  };

  const getObjectives = () => {
    if (!lesson?.Objective) return [];
    return lesson.Objective.sort((a, b) => a.order - b.order).map(obj => 
      language === "ar" ? obj.textAr : obj.textEn
    );
  };

  const getKeyConcepts = () => {
    if (!lesson?.Concept) return [];
    return lesson.Concept.sort((a, b) => a.order - b.order).map(concept => ({
      term: language === "ar" ? concept.termAr : concept.termEn,
      definition: language === "ar" ? concept.definitionAr : concept.definitionEn
    }));
  };

  const getFormulas = () => {
    if (!lesson?.Formula) return [];
    return lesson.Formula.sort((a, b) => a.order - b.order).map(formula => ({
      formula: formula.formula,
      explanation: language === "ar" ? formula.explanationAr : formula.explanationEn
    }));
  };

  const getExamples = () => {
    if (!lesson?.Example) return [];
    return lesson.Example.sort((a, b) => a.order - b.order).map(example => ({
      question: language === "ar" ? example.questionAr : example.questionEn,
      solution: language === "ar" ? example.solutionAr : example.solutionEn,
      steps: language === "ar" ? example.stepsAr?.split('\n') : example.stepsEn?.split('\n')
    }));
  };

  const getQuestions = () => {
    if (!lesson?.Question) return [];
    return lesson.Question.sort((a, b) => a.order - b.order);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/platform" className="flex items-center gap-2 hover:opacity-80 transition">
                <img src="/logo.jpeg" alt="SmartEdu" className="w-10 h-10 rounded-xl object-cover" />
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
                  {t("تعلم ذكي", "SmartEdu")}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {lesson?.Unit?.Subject && (
                <Link href={`/platform/subject/${lesson.Unit.Subject.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("العودة", "Back")}
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-2"
              >
                <Globe className="w-4 h-4" />
                {language === "ar" ? "EN" : "عربي"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : !lesson ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              {t("الدرس غير موجود", "Lesson not found")}
            </h2>
            <Link href="/platform">
              <Button>
                {t("العودة للمنصة", "Back to Platform")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
              <Link href="/platform" className="hover:text-purple-600 transition">
                {t("المنصة", "Platform")}
              </Link>
              <ChevronRight className="w-4 h-4" />
              {lesson.Unit?.Subject && (
                <>
                  <Link 
                    href={`/platform/subject/${lesson.Unit.Subject.id}`} 
                    className="hover:text-purple-600 transition"
                  >
                    {language === "ar" ? lesson.Unit.Subject.nameAr : lesson.Unit.Subject.nameEn}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-slate-800 dark:text-white font-medium line-clamp-1">
                {getTitle()}
              </span>
            </nav>

            {/* Lesson Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  lesson.isFree 
                    ? "bg-green-100 dark:bg-green-900/30" 
                    : "bg-purple-100 dark:bg-purple-900/30"
                }`}>
                  {lesson.isFree ? (
                    <Play className="w-6 h-6 text-green-600" />
                  ) : (
                    <Lock className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                    {getTitle()}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {getDescription()}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lesson.duration} {t("دقيقة", "min")}
                    </div>
                    {lesson.isFree && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                        {t("مجاني", "Free")}
                      </Badge>
                    )}
                    {relatedSimulations.length > 0 && (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                        <FlaskConical className="w-3 h-3 mr-1" />
                        {relatedSimulations.length} {t("محاكاة", "simulations")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Lesson Content Tabs */}
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 h-auto p-2 bg-white dark:bg-slate-800 rounded-xl">
                <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t("المحتوى", "Content")}
                </TabsTrigger>
                <TabsTrigger value="concepts" className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {t("المفاهيم", "Concepts")}
                </TabsTrigger>
                <TabsTrigger value="formulas" className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                  <Target className="w-4 h-4 mr-2" />
                  {t("القوانين", "Formulas")}
                </TabsTrigger>
                <TabsTrigger value="examples" className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                  <FileText className="w-4 h-4 mr-2" />
                  {t("أمثلة", "Examples")}
                </TabsTrigger>
                <TabsTrigger value="simulations" className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                  <Beaker className="w-4 h-4 mr-2" />
                  {t("محاكيات", "Simulations")}
                </TabsTrigger>
                <TabsTrigger value="quiz" className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t("اختبار", "Quiz")}
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {getObjectives().length > 0 && (
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-500" />
                          {t("أهداف الدرس", "Lesson Objectives")}
                        </h3>
                        <ul className="space-y-2">
                          {getObjectives().map((obj: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-600 dark:text-slate-300">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {getIntroduction() && (
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-500" />
                          {t("مقدمة الدرس", "Introduction")}
                        </h3>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                          {getIntroduction()}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {getSummary() && (
                    <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-500" />
                          {t("ملخص الدرس", "Summary")}
                        </h3>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                          {getSummary()}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              {/* Concepts Tab */}
              <TabsContent value="concepts">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-purple-500" />
                        {t("المفاهيم الأساسية", "Key Concepts")}
                      </h3>
                      {getKeyConcepts().length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                          {t("لا توجد مفاهيم بعد", "No concepts yet")}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {getKeyConcepts().map((concept: any, i: number) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                              <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">
                                {concept.term}
                              </h4>
                              <p className="text-slate-600 dark:text-slate-300">
                                {concept.definition}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Formulas Tab */}
              <TabsContent value="formulas">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-500" />
                        {t("القوانين والمعادلات", "Formulas & Equations")}
                      </h3>
                      {getFormulas().length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                          {t("لا توجد قوانين بعد", "No formulas yet")}
                        </p>
                      ) : (
                        <div className="grid gap-4">
                          {getFormulas().map((formula: any, i: number) => (
                            <div key={i} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                              <div className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400 mb-2 text-center py-2">
                                {formula.formula}
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-center">
                                {formula.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Examples Tab */}
              <TabsContent value="examples">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        {t("أمثلة محلولة", "Solved Examples")}
                      </h3>
                      {getExamples().length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                          {t("لا توجد أمثلة بعد", "No examples yet")}
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {getExamples().map((example: any, i: number) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                              <div className="p-4 bg-slate-50 dark:bg-slate-800">
                                <h4 className="font-bold text-slate-800 dark:text-white">
                                  {t("سؤال", "Question")} {i + 1}:
                                </h4>
                                <p className="text-slate-600 dark:text-slate-300 mt-2">
                                  {example.question}
                                </p>
                              </div>
                              <div className="p-4">
                                <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">
                                  {t("الحل", "Solution")}:
                                </h5>
                                <p className="text-slate-600 dark:text-slate-300">
                                  {example.solution}
                                </p>
                                {example.steps && example.steps.length > 0 && (
                                  <ol className="mt-3 space-y-2">
                                    {example.steps.map((step: string, j: number) => (
                                      <li key={j} className="flex items-start gap-2">
                                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                          {j + 1}
                                        </span>
                                        <span className="text-slate-600 dark:text-slate-300">{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Simulations Tab */}
              <TabsContent value="simulations">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Beaker className="w-5 h-5 text-purple-500" />
                        {t("المحاكيات التفاعلية", "Interactive Simulations")}
                      </h3>
                      <SimulationList 
                        simulations={relatedSimulations} 
                        language={language}
                        onSimulationClick={(sim) => {
                          console.log("Opening simulation:", sim.id);
                          // TODO: Open simulation modal or navigate to simulation page
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Quiz Tab */}
              <TabsContent value="quiz">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      {!showQuiz ? (
                        <div className="text-center py-8">
                          <HelpCircle className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                            {t("اختبار الدرس", "Lesson Quiz")}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 mb-2">
                            {t("اختبر فهمك للدرس من خلال الأسئلة التفاعلية", "Test your understanding with interactive questions")}
                          </p>
                          <p className="text-sm text-slate-500 mb-6">
                            {getQuestions().length} {t("أسئلة", "questions")}
                          </p>
                          <Button 
                            className="gradient-primary text-white px-8"
                            onClick={() => setShowQuiz(true)}
                            disabled={getQuestions().length === 0}
                          >
                            {t("ابدأ الاختبار", "Start Quiz")}
                          </Button>
                        </div>
                      ) : (
                        <InteractiveQuiz 
                          questions={getQuestions()} 
                          language={language}
                          onComplete={(score, total) => {
                            console.log("Quiz completed:", score, total);
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            © 2025 {t("تعلم ذكي. كل الحقوق محفوظة.", "SmartEdu. All rights reserved.")}
          </p>
        </div>
      </footer>
    </div>
  );
}
