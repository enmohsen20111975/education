"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, Globe, Moon, Sun, ChevronRight, ArrowLeft,
  Clock, Play, Lock, BookOpen, Target, Lightbulb, 
  FileText, HelpCircle, Beaker, Share2, Bookmark,
  CheckCircle, X, ChevronDown
} from "lucide-react";

interface LessonDetailFromApi {
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
  introduction: { ar: string; en: string };
  summary: { ar: string; en: string };
  unit: {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    subject: {
      id: string;
      slug: string;
      nameAr: string;
      nameEn: string;
      icon: string;
      color: string;
    };
  };
  objectives: { ar: string[]; en: string[] };
  keyConcepts: { ar: { term: string; definition: string }[]; en: { term: string; definition: string }[] };
  formulas: { ar: { formula: string; explanation: string }[]; en: { formula: string; explanation: string }[] };
  examples: { ar: { question: string; solution: string; steps: string[] }[]; en: { question: string; solution: string; steps: string[] }[] };
  simulators: string[];
  questions: any[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const { language, toggleLanguage, t } = useLanguage();
  const [lesson, setLesson] = useState<LessonDetailFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const isRTL = language === "ar";

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data.lesson);
        }
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
    return language === "ar" ? lesson.introduction?.ar : lesson.introduction?.en;
  };

  const getSummary = () => {
    if (!lesson) return "";
    return language === "ar" ? lesson.summary?.ar : lesson.summary?.en;
  };

  const getObjectives = () => {
    if (!lesson) return [];
    return language === "ar" ? lesson.objectives?.ar || [] : lesson.objectives?.en || [];
  };

  const getKeyConcepts = () => {
    if (!lesson) return [];
    return language === "ar" ? lesson.keyConcepts?.ar || [] : lesson.keyConcepts?.en || [];
  };

  const getFormulas = () => {
    if (!lesson) return [];
    return language === "ar" ? lesson.formulas?.ar || [] : lesson.formulas?.en || [];
  };

  const getExamples = () => {
    if (!lesson) return [];
    return language === "ar" ? lesson.examples?.ar || [] : lesson.examples?.en || [];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/platform" className="flex items-center gap-2 hover:opacity-80 transition">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
                  {t("تعلم ذكي", "SmartEdu")}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {lesson?.unit?.subject && (
                <Link href={`/platform/subject/${lesson.unit.subject.id}`}>
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
              {lesson.unit?.subject && (
                <>
                  <Link 
                    href={`/platform/subject/${lesson.unit.subject.id}`} 
                    className="hover:text-purple-600 transition"
                  >
                    {language === "ar" ? lesson.unit.subject.nameAr : lesson.unit.subject.nameEn}
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
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Lesson Content Tabs */}
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2 bg-white dark:bg-slate-800 rounded-xl">
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
                  {/* Objectives */}
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

                  {/* Introduction */}
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

                  {/* Summary */}
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

              {/* Quiz Tab */}
              <TabsContent value="quiz">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6 text-center">
                      <HelpCircle className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        {t("اختبار الدرس", "Lesson Quiz")}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {t("اختبر فهمك للدرس من خلال الأسئلة التفاعلية", "Test your understanding with interactive questions")}
                      </p>
                      <Button className="gradient-primary text-white px-8">
                        {t("ابدأ الاختبار", "Start Quiz")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Simulators */}
            {lesson.simulators && lesson.simulators.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Card className="border-0 shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-cyan-500" />
                      {t("المحاكيات التفاعلية", "Interactive Simulators")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {lesson.simulators.map((sim, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1">
                          {sim}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
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
