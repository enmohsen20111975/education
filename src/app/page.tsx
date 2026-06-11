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
  Cpu, Microscope, BarChart3, Users, Menu, X, RefreshCw, Database, Trophy
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LessonView } from "@/components/LessonView";
import MindMap from "@/components/MindMap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RewardsSystem, 
  AchievementBar, 
  BadgesDisplay, 
  NewBadgeModal,
  useRewards,
  type UserProgress 
} from "@/components/RewardsSystem";
import { useApi, type LessonDetailFromApi, type SubjectFromApi } from "@/hooks/useApi";

// أيقونات المواد
const subjectIcons: Record<string, any> = {
  Atom,
  Calculator,
  FlaskConical,
};

// أيقونات الوحدات
const unitIcons: Record<string, any> = {
  mechanics: Cpu,
  algebra: Calculator,
  "atomic-structure": Microscope,
};

// المكون الرئيسي
function MainContent() {
  const { language, toggleLanguage, t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailFromApi | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // جلب المواد من API
  const { data: subjectsData, loading: subjectsLoading, error: subjectsError, refetch: refetchSubjects } = useApi<{ subjects: SubjectFromApi[] }>("/api/subjects");
  const subjects = subjectsData?.subjects || [];
  
  // جلب الدروس من API
  const { data: lessonsData, loading: lessonsLoading, refetch: refetchLessons } = useApi<{ lessons: any[] }>("/api/lessons");
  const lessons = lessonsData?.lessons || [];
  
  // نظام المكافآت
  const { progress: userProgress, updateProgress, newBadge: earnedBadge, closeBadgeModal, points, level } = useRewards();
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState<any>(null);

  // تحميل صورة الطالب
  const [showSplash, setShowSplash] = useState(true);
  const splashRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // تحديد الدرس
  const handleSelectLesson = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLesson(data.lesson);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  };

  // إكمال الدرس
  const handleCompleteLesson = () => {
    if (selectedLesson) {
      const subjectKey = selectedSubject === 'physics' ? 'physicsLessons' : 
                         selectedSubject === 'math' ? 'mathLessons' : 'chemistryLessons';
      updateProgress({
        completedLessons: userProgress.completedLessons + 1,
        completedLessonIds: [...userProgress.completedLessonIds, selectedLesson.id],
        [subjectKey]: (userProgress[subjectKey as keyof typeof userProgress] as number) + 1,
        totalPoints: (userProgress.totalPoints || 0) + 50,
      });
      
      // فحص الشارات
      const completedLessons = userProgress.completedLessons + 1;
      if (completedLessons === 5) {
        const badge = { slug: "active-learner", nameAr: "المتعلم النشط", nameEn: "Active Learner" };
        updateProgress({
          earnedBadges: [...userProgress.earnedBadges, badge.slug]
        });
        setNewBadge(badge);
        setShowBadgeModal(true);
      }
    }
  };

  // الأيقونات
  const ThemeIcon = language === "ar" ? Moon : Sun;
  const LangIcon = Globe;
  const SubjectIcon = selectedSubject ? subjectIcons[selectedSubject] || BookOpen : BookOpen;

  // شاشة التحميل
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6 border-4 border-white/30 border-t-white rounded-full"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: language === "ar" ? "inherit" : "inherit" }}
          >
            {language === "ar" ? "ثانوية تفاعلية" : "Interactive High School"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/80"
          >
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* شريط الإنجاز */}
      <AchievementBar 
        progress={userProgress}
        language={language}
      />

      {/* الهيدر */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* اللوجو */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {language === "ar" ? "ثانوية تفاعلية" : "Interactive HS"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "ar" ? "تعلم بطريقة ممتعة" : "Learn with fun"}
                </p>
              </div>
            </motion.div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-2">
              {/* زر التحديث */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { refetchSubjects(); refetchLessons(); }}
                className="rounded-full"
                title={language === "ar" ? "تحديث البيانات" : "Refresh data"}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              {/* زر المكافآت */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRewards(true)}
                className="rounded-full relative"
              >
                <Trophy className="w-4 h-4" />
                {userProgress.earnedBadges.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    {userProgress.earnedBadges.length}
                  </span>
                )}
              </Button>

              {/* زر اللغة */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="rounded-full"
              >
                <Globe className="w-4 h-4" />
              </Button>

              {/* زر القائمة للموبايل */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* شاشة الدرس */}
        <AnimatePresence mode="wait">
          {selectedLesson ? (
            <motion.div
              key="lesson-view"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="h-full"
            >
              <LessonView
                lesson={selectedLesson}
                language={language}
                onBack={() => setSelectedLesson(null)}
                onComplete={handleCompleteLesson}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* عنوان الصفحة */}
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2"
                >
                  {language === "ar" ? "اختر مادة للبدء" : "Choose a Subject to Start"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.2 } }}
                  className="text-slate-600 dark:text-slate-400"
                >
                  {language === "ar" 
                    ? `${lessons.length} درس متاح مع محاكيات تفاعلية` 
                    : `${lessons.length} lessons available with interactive simulators`}
                </motion.p>
              </div>

              {/* عرض المواد */}
              {!selectedSubject && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {subjectsLoading ? (
                    <div className="col-span-3 text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-500">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
                    </div>
                  ) : (
                    subjects.map((subject, index) => {
                      const Icon = subjectIcons[subject.icon] || BookOpen;
                      const lessonCount = lessons.filter(l => l.unit.subject.slug === subject.slug).length;
                      
                      return (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card
                            onClick={() => setSelectedSubject(subject.slug)}
                            className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${
                                  subject.slug === 'physics' ? 'from-emerald-400 to-teal-600' :
                                  subject.slug === 'math' ? 'from-blue-400 to-cyan-600' :
                                  'from-purple-400 to-pink-600'
                                } shadow-lg`}>
                                  <Icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                                    {language === "ar" ? subject.nameAr : subject.nameEn}
                                  </h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    {lessonCount} {language === "ar" ? "درس" : "lessons"}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {subject.units.slice(0, 3).map((unit: any) => (
                                      <Badge key={unit.id} variant="secondary" className="text-xs">
                                        {language === "ar" ? unit.nameAr : unit.nameEn}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}

              {/* عرض الوحدات والدروس */}
              {selectedSubject && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* زر الرجوع */}
                  <Button
                    variant="ghost"
                    onClick={() => { setSelectedSubject(null); setSelectedUnit(null); }}
                    className="mb-4"
                  >
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    {language === "ar" ? "العودة للمواد" : "Back to Subjects"}
                  </Button>

                  {/* الوحدات */}
                  <div className="space-y-6">
                    {subjects
                      .find(s => s.slug === selectedSubject)
                      ?.units.map((unit: any, unitIndex: number) => {
                        const unitLessons = lessons.filter(l => l.unit.slug === unit.slug);
                        const UnitIcon = unitIcons[unit.slug] || BookOpen;
                        
                        return (
                          <motion.div
                            key={unit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: unitIndex * 0.1 }}
                          >
                            <Card className="overflow-hidden">
                              <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                                    <UnitIcon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">
                                      {language === "ar" ? unit.nameAr : unit.nameEn}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                      {unitLessons.length} {language === "ar" ? "درس" : "lessons"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {unitLessons.map((lesson: any, lessonIndex: number) => {
                                    const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
                                    
                                    return (
                                      <motion.div
                                        key={lesson.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: lessonIndex * 0.05 }}
                                      >
                                        <Card
                                          onClick={() => handleSelectLesson(lesson.id)}
                                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                            isCompleted 
                                              ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20' 
                                              : 'hover:border-emerald-500/30'
                                          }`}
                                        >
                                          <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isCompleted 
                                                  ? 'bg-emerald-500 text-white' 
                                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                              }`}>
                                                {isCompleted ? (
                                                  <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                  <span className="text-sm font-bold">{lesson.order}</span>
                                                )}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-slate-800 dark:text-white truncate">
                                                  {language === "ar" ? lesson.titleAr : lesson.titleEn}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                  <Clock className="w-3 h-3 text-slate-400" />
                                                  <span className="text-xs text-slate-500">
                                                    {lesson.duration} {language === "ar" ? "دقيقة" : "min"}
                                                  </span>
                                                  {lesson.simulators?.length > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                      <Zap className="w-3 h-3 mr-1" />
                                                      {lesson.simulators.length}
                                                    </Badge>
                                                  )}
                                                </div>
                                              </div>
                                              {!lesson.isFree && (
                                                <Lock className="w-4 h-4 text-slate-400" />
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                  </div>
                </motion.div>
              )}

              {/* إحصائيات سريعة */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card className="text-center p-4">
                  <Database className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{lessons.length}</div>
                  <div className="text-sm text-slate-500">{language === "ar" ? "درس" : "Lessons"}</div>
                </Card>
                <Card className="text-center p-4">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{subjects.length}</div>
                  <div className="text-sm text-slate-500">{language === "ar" ? "مادة" : "Subjects"}</div>
                </Card>
                <Card className="text-center p-4">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">8</div>
                  <div className="text-sm text-slate-500">{language === "ar" ? "محاكي" : "Simulators"}</div>
                </Card>
                <Card className="text-center p-4">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{points}</div>
                  <div className="text-sm text-slate-500">{language === "ar" ? "نقطة" : "Points"}</div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* الفوتر */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-start">
              {language === "ar" 
                ? "© 2024 ثانوية تفاعلية - تعلم بطريقة ممتعة" 
                : "© 2024 Interactive HS - Learn with fun"}
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Database className="w-3 h-3" />
                API Ready
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                v2.0
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* نافذة المكافآت */}
      <RewardsSystem
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        progress={userProgress}
        language={language}
      />

      {/* نافذة الشارة الجديدة */}
      <NewBadgeModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        badge={newBadge}
        language={language}
      />
    </div>
  );
}

// المكون الرئيسي مع Provider
export default function Home() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
