"use client";

import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Play, FlaskConical, ChevronLeft, ChevronRight, Globe, User,
  Atom, Calculator, Beaker, Lock, CheckCircle, Clock, Brain
} from "lucide-react";
import { useState } from "react";
import { LessonView } from "@/components/LessonView";
import { lessonsData, type LessonContent } from "@/data/lessons";
import MindMap, { MIND_MAPS, type MindMapType } from "@/components/MindMap";

// بيانات المواد العلمية
const subjects = [
  { 
    id: "physics", 
    nameAr: "الفيزياء", 
    nameEn: "Physics",
    icon: Atom,
    color: "from-emerald-500 to-teal-600",
  },
  { 
    id: "math", 
    nameAr: "الرياضيات", 
    nameEn: "Mathematics",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
  },
  { 
    id: "chemistry", 
    nameAr: "الكيمياء", 
    nameEn: "Chemistry",
    icon: Beaker,
    color: "from-purple-500 to-pink-600",
  },
];

// بيانات الخرائط الذهنية المتاحة
const mindMapsList: { id: MindMapType; nameAr: string; nameEn: string; color: string }[] = [
  { id: "motion", nameAr: "الحركة", nameEn: "Motion", color: "bg-emerald-500" },
  { id: "energy", nameAr: "الطاقة", nameEn: "Energy", color: "bg-purple-500" },
  { id: "atom", nameAr: "الذرة", nameEn: "Atom", color: "bg-cyan-500" },
];

// بيانات وهمية للتقدم
const mockProgress = {
  completedLessons: ["motion-intro", "velocity-acceleration"],
  currentLesson: "equations-motion",
};

function DashboardContent() {
  const { language, setLanguage, t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"dashboard" | "lessons" | "mindmaps">("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("physics");
  const [selectedMindMap, setSelectedMindMap] = useState<MindMapType>("motion");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white">
                {language === "ar" ? "ثانوية تفاعلية" : "Interactive HS"}
              </h1>
              <p className="text-xs text-slate-500">
                {language === "ar" ? "منصة تعليمية تفاعلية" : "Interactive Learning Platform"}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"} 
              onClick={() => setActiveTab("dashboard")}
              className={activeTab === "dashboard" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {t("nav.home")}
            </Button>
            <Button 
              variant={activeTab === "lessons" ? "default" : "ghost"} 
              onClick={() => setActiveTab("lessons")}
              className={activeTab === "lessons" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {language === "ar" ? "الدروس" : "Lessons"}
            </Button>
            <Button 
              variant={activeTab === "mindmaps" ? "default" : "ghost"} 
              onClick={() => setActiveTab("mindmaps")}
              className={activeTab === "mindmaps" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              <Brain className="w-4 h-4 mr-2" />
              {language === "ar" ? "خرائط ذهنية" : "Mind Maps"}
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="rounded-full"
            >
              <Globe className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{t("dashboard.welcome")}</h2>
                <p className="text-emerald-100 text-lg">{t("dashboard.subtitle")}</p>
                <div className="mt-6 flex gap-4">
                  <Button 
                    className="bg-white text-emerald-600 hover:bg-emerald-50"
                    onClick={() => setActiveTab("lessons")}
                  >
                    {language === "ar" ? "ابدأ التعلم" : "Start Learning"}
                    {dir === "rtl" ? <ChevronLeft className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500">{language === "ar" ? "تقدمك الكلي" : "Your Progress"}</span>
                    <span className="text-2xl font-bold">{completedCount}/{totalLessons}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">{language === "ar" ? "دروس مكتملة" : "Completed"}</p>
                      <p className="text-2xl font-bold">{completedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">{language === "ar" ? "ساعات التعلم" : "Study Hours"}</p>
                      <p className="text-2xl font-bold">2.5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subjects Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {language === "ar" ? "المواد الدراسية" : "Subjects"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map((subject) => {
                  const lessonCount = lessonsData.filter(l => l.subject === subject.id).length;
                  return (
                    <Card 
                      key={subject.id}
                      className="border-0 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => { setSelectedSubject(subject.id); setActiveTab("lessons"); }}
                    >
                      <CardContent className="p-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4`}>
                          <subject.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">
                          {language === "ar" ? subject.nameAr : subject.nameEn}
                        </h3>
                        <p className="text-slate-500">
                          {lessonCount} {language === "ar" ? "درس" : "lessons"}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Mind Maps Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {language === "ar" ? "الخرائط الذهنية" : "Mind Maps"}
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("mindmaps")}
                  className="gap-2"
                >
                  {language === "ar" ? "عرض الكل" : "View All"}
                  {dir === "rtl" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mindMapsList.map((map) => (
                  <Card 
                    key={map.id}
                    className="border-0 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    onClick={() => { setSelectedMindMap(map.id); setActiveTab("mindmaps"); }}
                  >
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${map.color} flex items-center justify-center mb-4`}>
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold">
                        {language === "ar" ? map.nameAr : map.nameEn}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {language === "ar" ? "خريطة تفاعلية" : "Interactive mind map"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Continue Learning */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {language === "ar" ? "استمر في التعلم" : "Continue Learning"}
              </h2>
              {lessonsData.find(l => l.id === mockProgress.currentLesson) && (
                <Card 
                  className="border-0 shadow-md cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setSelectedLesson(lessonsData.find(l => l.id === mockProgress.currentLesson)!)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2">{language === "ar" ? "الدرس التالي" : "Next Lesson"}</Badge>
                        <h3 className="text-xl font-bold">
                          {language === "ar" 
                            ? lessonsData.find(l => l.id === mockProgress.currentLesson)?.titleAr
                            : lessonsData.find(l => l.id === mockProgress.currentLesson)?.titleEn}
                        </h3>
                        <p className="text-slate-500">
                          {lessonsData.find(l => l.id === mockProgress.currentLesson)?.duration} {language === "ar" ? "دقيقة" : "min"}
                        </p>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        {language === "ar" ? "ابدأ" : "Start"}
                        {dir === "rtl" ? <ChevronLeft className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === "lessons" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {language === "ar" ? "قائمة الدروس" : "Lessons List"}
            </h2>

            {/* Subject Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedSubject === "all" ? "default" : "outline"}
                onClick={() => setSelectedSubject("all")}
                className={selectedSubject === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {language === "ar" ? "الكل" : "All"}
              </Button>
              {subjects.map((subject) => (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? "default" : "outline"}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={selectedSubject === subject.id ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {language === "ar" ? subject.nameAr : subject.nameEn}
                </Button>
              ))}
            </div>

            {/* Lessons by Unit */}
            {units.map((unit) => {
              const unitLessons = groupedLessons[unit] || [];
              const filteredLessons = selectedSubject === "all" 
                ? unitLessons 
                : unitLessons.filter(l => l.subject === selectedSubject);
              
              if (filteredLessons.length === 0) return null;

              const unitInfo = filteredLessons[0];
              
              return (
                <div key={unit} className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      unit === "mechanics" ? "bg-emerald-500" : 
                      unit === "forces" ? "bg-orange-500" : 
                      unit === "energy" ? "bg-purple-500" : "bg-blue-500"
                    }`} />
                    {language === "ar" ? unitInfo.unitAr : unitInfo.unitEn}
                  </h3>
                  
                  <div className="grid gap-3">
                    {filteredLessons.map((lesson) => {
                      const isCompleted = mockProgress.completedLessons.includes(lesson.id);
                      const isLocked = !lesson.isFree && !mockProgress.completedLessons.includes(lesson.id) && lesson.order > 2;
                      
                      return (
                        <Card 
                          key={lesson.id}
                          className={`border-0 shadow-md transition-all cursor-pointer hover:shadow-lg ${
                            isLocked ? "opacity-60" : ""
                          }`}
                          onClick={() => !isLocked && setSelectedLesson(lesson)}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isCompleted 
                                  ? "bg-emerald-100 dark:bg-emerald-900" 
                                  : isLocked 
                                    ? "bg-slate-100 dark:bg-slate-800"
                                    : "bg-amber-100 dark:bg-amber-900"
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                                ) : isLocked ? (
                                  <Lock className="w-6 h-6 text-slate-400" />
                                ) : (
                                  <Play className="w-6 h-6 text-amber-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {language === "ar" ? lesson.titleAr : lesson.titleEn}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {lesson.duration} {language === "ar" ? "دقيقة" : "min"}
                                  </span>
                                  {lesson.isFree ? (
                                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                                      {language === "ar" ? "مجاني" : "Free"}
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                                      {language === "ar" ? "مدفوع" : "Premium"}
                                    </Badge>
                                  )}
                                  {lesson.simulators.length > 0 && (
                                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
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
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mind Maps Tab */}
        {activeTab === "mindmaps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {language === "ar" ? "الخرائط الذهنية التفاعلية" : "Interactive Mind Maps"}
              </h2>
            </div>

            {/* Mind Map Selector */}
            <div className="flex gap-2 flex-wrap">
              {mindMapsList.map((map) => (
                <Button
                  key={map.id}
                  variant={selectedMindMap === map.id ? "default" : "outline"}
                  onClick={() => setSelectedMindMap(map.id)}
                  className={selectedMindMap === map.id ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {language === "ar" ? map.nameAr : map.nameEn}
                </Button>
              ))}
            </div>

            {/* Mind Map Display */}
            <Card className="border-0 shadow-lg overflow-hidden">
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

            {/* Description */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-600" />
                  {language === "ar" ? "كيفية استخدام الخريطة الذهنية" : "How to use the Mind Map"}
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {language === "ar" ? "انقر على العقدة لتوسيع أو طي الفروع" : "Click on a node to expand or collapse branches"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {language === "ar" ? "استخدم العجلة للتكبير والتصغير" : "Use the mouse wheel to zoom in/out"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {language === "ar" ? "اسحب لتحريك الخريطة" : "Drag to pan the map"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {language === "ar" ? "استخدم زر 'توسيع الكل' لعرض كل الفروع" : "Use 'Expand All' button to show all branches"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-slate-900 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => setActiveTab("dashboard")}
          >
            <BookOpen className={`w-5 h-5 ${activeTab === "dashboard" ? "text-emerald-600" : ""}`} />
            <span className="text-xs">{t("nav.home")}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => setActiveTab("lessons")}
          >
            <Play className={`w-5 h-5 ${activeTab === "lessons" ? "text-emerald-600" : ""}`} />
            <span className="text-xs">{language === "ar" ? "الدروس" : "Lessons"}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => setActiveTab("mindmaps")}
          >
            <Brain className={`w-5 h-5 ${activeTab === "mindmaps" ? "text-emerald-600" : ""}`} />
            <span className="text-xs">{language === "ar" ? "خرائط" : "Mind Maps"}</span>
          </Button>
        </div>
      </nav>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 py-4 hidden md:block">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          © 2024 {language === "ar" ? "ثانوية تفاعلية" : "Interactive High School"}. {t("footer.rights")}
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}
