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
  Cpu, Microscope, BarChart3, Users, Menu, X, RefreshCw, Database, Trophy,
  Leaf, Map, Landmark, Sigma, Eye, Waves, Dna, Activity, CircleDot, Sun as SunIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LessonView } from "@/components/LessonView";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RewardsSystem, 
  AchievementBar, 
  BadgesDisplay, 
  NewBadgeModal,
  useRewards,
} from "@/components/RewardsSystem";
import { useApi, type LessonDetailFromApi } from "@/hooks/useApi";

// أيقونات المواد
const subjectIcons: Record<string, any> = {
  Atom,
  Calculator,
  FlaskConical,
  Leaf,
  Map,
  Landmark,
  BookOpen,
  Globe,
  Cpu,
  Eye,
  Sigma,
  BarChart3,
};

// نوع بيانات السنة الدراسية
interface AcademicYearFromApi {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  order: number;
  subjects: SubjectFromApi[];
}

interface SubjectFromApi {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  order: number;
  isCommon: boolean;
  specialization?: {
    id: string;
    code: string;
    nameAr: string;
    nameEn: string;
  } | null;
  units: UnitFromApi[];
}

interface UnitFromApi {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  order: number;
}

interface SpecializationFromApi {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
}

// المكون الرئيسي
function MainContent() {
  const { language, toggleLanguage, t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectFromApi | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailFromApi | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // جلب هيكل المنهج من API
  const { data: structureData, loading: structureLoading, refetch: refetchStructure } = useApi<{
    academicYears: AcademicYearFromApi[];
    specializations: SpecializationFromApi[];
    semesters: any[];
  }>("/api/structure");
  
  const academicYears = structureData?.academicYears || [];
  const specializations = structureData?.specializations || [];
  
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

  // الحصول على المواد حسب السنة والتخصص
  const getSubjectsForYearAndSpec = () => {
    if (!selectedYear || !academicYears) return [];
    
    const year = academicYears.find(y => y.code === selectedYear);
    if (!year) return [];
    
    let subjects = year.subjects;
    
    // فلترة حسب التخصص
    if (selectedSpecialization && selectedYear !== "first") {
      subjects = subjects.filter(s => 
        s.isCommon || s.specialization?.code === selectedSpecialization
      );
    }
    
    return subjects;
  };

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
          >
            {language === "ar" ? "ثانوية تفاعلية" : "Interactive HS"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/80"
          >
            {language === "ar" ? "المنهج المصري الكامل" : "Complete Egyptian Curriculum"}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* شريط الإنجاز */}
      <AchievementBar progress={userProgress} language={language} />

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
                  {language === "ar" ? "المنهج المصري" : "Egyptian Curriculum"}
                </p>
              </div>
            </motion.div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-2">
              {/* زر التحديث */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetchStructure()}
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
                {userProgress.earnedBadges?.length > 0 && (
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
            >
              <LessonView
                lesson={selectedLesson}
                language={language}
                onBack={() => setSelectedLesson(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* اختيار السنة الدراسية */}
              {!selectedYear && (
                <div>
                  <div className="text-center mb-8">
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2"
                    >
                      {language === "ar" ? "اختر السنة الدراسية" : "Select Academic Year"}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2 } }}
                      className="text-slate-600 dark:text-slate-400"
                    >
                      {language === "ar" 
                        ? "المنهج المصري للثانوية العامة" 
                        : "Egyptian Secondary School Curriculum"}
                    </motion.p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {structureLoading ? (
                      <div className="col-span-3 text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-500">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
                      </div>
                    ) : (
                      academicYears.map((year, index) => (
                        <motion.div
                          key={year.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card
                            onClick={() => setSelectedYear(year.code)}
                            className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
                          >
                            <CardContent className="p-6 text-center">
                              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ${
                                year.code === 'first' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                                year.code === 'second' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                                'bg-gradient-to-br from-emerald-400 to-teal-500'
                              }`}>
                                {year.code === 'first' ? '1' : year.code === 'second' ? '2' : '3'}
                              </div>
                              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                                {language === "ar" ? year.nameAr : year.nameEn}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {year.subjects?.length || 0} {language === "ar" ? "مادة" : "subjects"}
                              </p>
                              {year.code === 'third' && (
                                <Badge className="mt-2 bg-amber-500 text-white">
                                  {language === "ar" ? "السنة النهائية" : "Final Year"}
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* اختيار التخصص (لثانية وتالتة) */}
              {selectedYear && selectedYear !== "first" && !selectedSpecialization && (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedYear(null)}
                    className="mb-4"
                  >
                    {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {language === "ar" ? "العودة للسنوات" : "Back to Years"}
                  </Button>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      {language === "ar" ? "اختر التخصص" : "Select Specialization"}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {language === "ar" 
                        ? `${academicYears.find(y => y.code === selectedYear)?.nameAr}` 
                        : `${academicYears.find(y => y.code === selectedYear)?.nameEn}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {specializations.map((spec, index) => (
                      <motion.div
                        key={spec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          onClick={() => setSelectedSpecialization(spec.code)}
                          className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-emerald-500/50 transition-all duration-300"
                        >
                          <CardContent className="p-6 text-center">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                              spec.code === 'math-science' ? 'bg-gradient-to-br from-blue-400 to-purple-500' :
                              spec.code === 'science' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                              'bg-gradient-to-br from-amber-400 to-orange-500'
                            }`}>
                              {spec.code === 'math-science' ? (
                                <Calculator className="w-8 h-8 text-white" />
                              ) : spec.code === 'science' ? (
                                <Leaf className="w-8 h-8 text-white" />
                              ) : (
                                <BookOpen className="w-8 h-8 text-white" />
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                              {language === "ar" ? spec.nameAr : spec.nameEn}
                            </h3>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* عرض المواد */}
              {selectedYear && (selectedYear === "first" || selectedSpecialization) && !selectedSubject && (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (selectedSpecialization) {
                        setSelectedSpecialization(null);
                      } else {
                        setSelectedYear(null);
                      }
                    }}
                    className="mb-4"
                  >
                    {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {language === "ar" ? "العودة" : "Back"}
                  </Button>

                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      {language === "ar" 
                        ? `${academicYears.find(y => y.code === selectedYear)?.nameAr}${selectedSpecialization ? ` - ${specializations.find(s => s.code === selectedSpecialization)?.nameAr}` : ''}`
                        : `${academicYears.find(y => y.code === selectedYear)?.nameEn}${selectedSpecialization ? ` - ${specializations.find(s => s.code === selectedSpecialization)?.nameEn}` : ''}`}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getSubjectsForYearAndSpec().map((subject, index) => {
                      const Icon = subjectIcons[subject.icon] || BookOpen;
                      
                      return (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            onClick={() => setSelectedSubject(subject)}
                            className="cursor-pointer hover:border-emerald-500/50 transition-all"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                                  subject.color === 'emerald' ? 'from-emerald-400 to-teal-500' :
                                  subject.color === 'purple' ? 'from-purple-400 to-pink-500' :
                                  subject.color === 'blue' ? 'from-blue-400 to-cyan-500' :
                                  subject.color === 'amber' ? 'from-amber-400 to-orange-500' :
                                  subject.color === 'rose' ? 'from-rose-400 to-pink-500' :
                                  subject.color === 'teal' ? 'from-teal-400 to-cyan-500' :
                                  'from-slate-400 to-slate-500'
                                }`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-800 dark:text-white">
                                    {language === "ar" ? subject.nameAr : subject.nameEn}
                                  </h3>
                                  <p className="text-sm text-slate-500">
                                    {subject.units?.length || 0} {language === "ar" ? "وحدة" : "units"}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* عرض الوحدات والدروس */}
              {selectedSubject && (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedSubject(null)}
                    className="mb-4"
                  >
                    {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {language === "ar" ? "العودة للمواد" : "Back to Subjects"}
                  </Button>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {language === "ar" ? selectedSubject.nameAr : selectedSubject.nameEn}
                    </h2>
                  </div>

                  {/* الوحدات */}
                  {selectedSubject.units?.map((unit, unitIndex) => (
                    <Card key={unit.id} className="mb-4">
                      <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
                        <h3 className="font-bold text-slate-800 dark:text-white">
                          {language === "ar" ? unit.nameAr : unit.nameEn}
                        </h3>
                      </div>
                      <div className="p-4 text-center text-slate-500">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          {language === "ar" ? "الدروس قيد الإضافة..." : "Lessons are being added..."}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {language === "ar" ? "المرحلة الأولى: الفيزياء والرياضيات للثالثة الثانوي" : "Phase 1: Physics & Math for 3rd Year"}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* إحصائيات */}
              {!selectedYear && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <Card className="text-center p-4">
                    <Database className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">3</div>
                    <div className="text-sm text-slate-500">{language === "ar" ? "سنوات دراسية" : "Years"}</div>
                  </Card>
                  <Card className="text-center p-4">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">12</div>
                    <div className="text-sm text-slate-500">{language === "ar" ? "محاكي تفاعلي" : "Simulators"}</div>
                  </Card>
                  <Card className="text-center p-4">
                    <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">3</div>
                    <div className="text-sm text-slate-500">{language === "ar" ? "تخصصات" : "Tracks"}</div>
                  </Card>
                  <Card className="text-center p-4">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{points}</div>
                    <div className="text-sm text-slate-500">{language === "ar" ? "نقطة" : "Points"}</div>
                  </Card>
                </motion.div>
              )}
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
                ? "© 2024 ثانوية تفاعلية - المنهج المصري الكامل" 
                : "© 2024 Interactive HS - Complete Egyptian Curriculum"}
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Database className="w-3 h-3" />
                API Ready
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                v3.0
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* نافذة المكافآت */}
      <RewardsSystem
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        userProgress={userProgress}
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
