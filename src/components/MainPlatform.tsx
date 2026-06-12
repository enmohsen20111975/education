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

// مكون بطاقة الوحدة
function UnitCard({ 
  unit, 
  language,
  onSelectLesson 
}: { 
  unit: UnitFromApi; 
  language: string;
  onSelectLesson: (lessonId: string) => void;
}) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!expanded || hasLoaded.current) return;
    
    hasLoaded.current = true;
    
    const loadLessons = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/units/${unit.id}/lessons`);
        const data = await res.json();
        setLessons(data.lessons || []);
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    
    loadLessons();
  }, [expanded, unit.id]);

  return (
    <Card className="mb-4 overflow-hidden">
      <div 
        className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-bold text-slate-800 dark:text-white">
          {language === "ar" ? unit.nameAr : unit.nameEn}
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {lessons.length || "..."} {language === "ar" ? "درس" : "lessons"}
          </Badge>
          <ChevronLeft className={`w-4 h-4 transition-transform ${expanded ? "-rotate-90" : ""}`} />
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-4 text-slate-500">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {language === "ar" ? "لا توجد دروس بعد" : "No lessons yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  onClick={() => onSelectLesson(lesson.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      {lesson.isFree ? (
                        <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        {language === "ar" ? lesson.titleAr : lesson.titleEn}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.duration} {language === "ar" ? "دقيقة" : "min"}</span>
                        {lesson.simulators?.length > 0 && (
                          <>
                            <span>•</span>
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>{lesson.simulators.length} {language === "ar" ? "محاكي" : "sims"}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// المكون الرئيسي
export default function MainPlatform({ onBack }: { onBack?: () => void }) {
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
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // الحصول على المواد حسب السنة والتخصص
  const getSubjectsForYearAndSpec = () => {
    if (!selectedYear || !academicYears) return [];
    
    const year = academicYears.find(y => y.code === selectedYear);
    if (!year) return [];
    
    let subjects = year.subjects;
    
    // فلترة حسب التخصص
    if (selectedSpecialization && selectedYear !== "first-year") {
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
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center z-50">
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
            {language === "ar" ? "تعلم ذكي" : "SmartEdu"}
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
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedLesson(null);
                setSelectedSubject(null);
                setSelectedSpecialization(null);
                setSelectedYear(null);
              }}
            >
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {language === "ar" ? "تعلم ذكي" : "SmartEdu"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "ar" ? "المنهج المصري" : "Egyptian Curriculum"}
                </p>
              </div>
            </motion.div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-2">
              {/* زر العودة للanding page */}
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="rounded-full gap-2"
                >
                  <ChevronRight className="w-4 h-4" />
                  {language === "ar" ? "الرئيسية" : "Home"}
                </Button>
              )}
              
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

              {/* زر تبديل اللغة */}
              <Button
                variant="outline"
                onClick={toggleLanguage}
                className="gap-2 rounded-full px-4 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium">
                  {language === "ar" ? "English" : "عربي"}
                </span>
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
          ) : selectedSubject ? (
            // عرض وحدات المادة
            <motion.div
              key="subject-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button
                variant="ghost"
                onClick={() => setSelectedSubject(null)}
                className="mb-4"
              >
                {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {language === "ar" ? "العودة للمواد" : "Back to Subjects"}
              </Button>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: selectedSubject.color + '20' }}
                  >
                    {(() => {
                      const IconComponent = subjectIcons[selectedSubject.icon] || BookOpen;
                      return <IconComponent className="w-8 h-8" style={{ color: selectedSubject.color }} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {language === "ar" ? selectedSubject.nameAr : selectedSubject.nameEn}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                      {selectedSubject.units.length} {language === "ar" ? "وحدة" : "units"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedSubject.units
                  .sort((a, b) => a.order - b.order)
                  .map((unit) => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      language={language}
                      onSelectLesson={handleSelectLesson}
                    />
                  ))}
              </div>
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
                        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
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
                            className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
                          >
                            <CardContent className="p-6 text-center">
                              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ${
                                year.code === 'first-year' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                                year.code === 'second-year' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' :
                                'bg-gradient-to-br from-orange-400 to-red-500'
                              }`}>
                                {year.code === 'first-year' ? '1' : year.code === 'second-year' ? '2' : '3'}
                              </div>
                              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                                {language === "ar" ? year.nameAr : year.nameEn}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {year.subjects?.length || 0} {language === "ar" ? "مادة" : "subjects"}
                              </p>
                              {year.code === 'third-year' && (
                                <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
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
              {selectedYear && selectedYear !== "first-year" && !selectedSpecialization && (
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
                          className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-300"
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
                                <FlaskConical className="w-8 h-8 text-white" />
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
              {(selectedYear === "first-year" || selectedSpecialization) && (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (selectedYear !== "first-year") {
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

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      {language === "ar" ? "اختر المادة" : "Select Subject"}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {language === "ar" 
                        ? selectedSpecialization 
                          ? specializations.find(s => s.code === selectedSpecialization)?.nameAr
                          : academicYears.find(y => y.code === selectedYear)?.nameAr
                        : selectedSpecialization 
                          ? specializations.find(s => s.code === selectedSpecialization)?.nameEn
                          : academicYears.find(y => y.code === selectedYear)?.nameEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getSubjectsForYearAndSpec()
                      .sort((a, b) => a.order - b.order)
                      .map((subject, index) => (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            onClick={() => setSelectedSubject(subject)}
                            className="cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg group"
                          >
                            <CardContent className="p-4 text-center">
                              <div 
                                className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: subject.color + '20' }}
                              >
                                {(() => {
                                  const IconComponent = subjectIcons[subject.icon] || BookOpen;
                                  return <IconComponent className="w-7 h-7" style={{ color: subject.color }} />;
                                })()}
                              </div>
                              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">
                                {language === "ar" ? subject.nameAr : subject.nameEn}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {subject.units.length} {language === "ar" ? "وحدة" : "units"}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* نظام المكافآت */}
      <RewardsSystem
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        language={language}
      />
    </div>
  );
}
