"use client";

import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  FlaskConical, 
  Trophy, 
  ChevronLeft, 
  ChevronRight,
  Lock,
  CheckCircle,
  Globe,
  User,
  Atom,
  Calculator,
  Beaker
} from "lucide-react";
import { useState } from "react";
import { MotionSimulator } from "@/components/simulators/MotionSimulator";
import { ForcesSimulator } from "@/components/simulators/ForcesSimulator";
import { EnergySimulator } from "@/components/simulators/EnergySimulator";

// بيانات المواد العلمية
const subjects = [
  { 
    id: "physics", 
    nameAr: "الفيزياء", 
    nameEn: "Physics",
    icon: Atom,
    color: "from-emerald-500 to-teal-600",
    lessonsCount: 15,
    simulatorsCount: 5
  },
  { 
    id: "math", 
    nameAr: "الرياضيات", 
    nameEn: "Mathematics",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
    lessonsCount: 12,
    simulatorsCount: 4
  },
  { 
    id: "chemistry", 
    nameAr: "الكيمياء", 
    nameEn: "Chemistry",
    icon: Beaker,
    color: "from-purple-500 to-pink-600",
    lessonsCount: 10,
    simulatorsCount: 3
  },
];

// بيانات وهمية للدروس - الفيزياء
const physicsLessons = [
  { id: "1", titleAr: "مقدمة في الحركة", titleEn: "Introduction to Motion", unit: "mechanics", duration: 12, isFree: true, order: 1 },
  { id: "2", titleAr: "السرعة والتسارع", titleEn: "Velocity and Acceleration", unit: "mechanics", duration: 15, isFree: true, order: 2 },
  { id: "3", titleAr: "معادلات الحركة", titleEn: "Equations of Motion", unit: "mechanics", duration: 14, isFree: false, order: 3 },
  { id: "4", titleAr: "السقوط الحر", titleEn: "Free Fall", unit: "mechanics", duration: 10, isFree: false, order: 4 },
  { id: "5", titleAr: "مقدمة في القوى", titleEn: "Introduction to Forces", unit: "forces", duration: 12, isFree: false, order: 5 },
  { id: "6", titleAr: "قوانين نيوتن", titleEn: "Newton's Laws", unit: "forces", duration: 16, isFree: false, order: 6 },
  { id: "7", titleAr: "توازن القوى", titleEn: "Force Equilibrium", unit: "forces", duration: 13, isFree: false, order: 7 },
  { id: "8", titleAr: "مقدمة في الطاقة", titleEn: "Introduction to Energy", unit: "energy", duration: 11, isFree: false, order: 8 },
  { id: "9", titleAr: "الطاقة الحركية والكامنة", titleEn: "Kinetic and Potential Energy", unit: "energy", duration: 14, isFree: false, order: 9 },
];

// بيانات وهمية للتقدم
const mockProgress = {
  completedLessons: 2,
  totalScore: 85,
  currentLesson: 3,
};

// بيانات المحاكيات
const simulators = [
  { id: "motion", icon: Play, color: "bg-emerald-500", subject: "physics" },
  { id: "forces", icon: FlaskConical, color: "bg-orange-500", subject: "physics" },
  { id: "energy", icon: Trophy, color: "bg-purple-500", subject: "physics" },
];

function DashboardContent() {
  const { language, setLanguage, t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"dashboard" | "lessons" | "simulators">("dashboard");
  const [selectedSubject, setSelectedSubject] = useState<string>("physics");
  const [activeSimulator, setActiveSimulator] = useState<string | null>(null);

  // حساب التقدم
  const progressPercentage = (mockProgress.completedLessons / physicsLessons.length) * 100;

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
              onClick={() => { setActiveTab("dashboard"); setActiveSimulator(null); }}
              className={activeTab === "dashboard" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {t("nav.home")}
            </Button>
            <Button 
              variant={activeTab === "lessons" ? "default" : "ghost"} 
              onClick={() => { setActiveTab("lessons"); setActiveSimulator(null); }}
              className={activeTab === "lessons" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {t("nav.lessons")}
            </Button>
            <Button 
              variant={activeTab === "simulators" ? "default" : "ghost"} 
              onClick={() => { setActiveTab("simulators"); setActiveSimulator(null); }}
              className={activeTab === "simulators" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {t("nav.simulators")}
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="rounded-full"
            >
              <Globe className="w-4 h-4" />
            </Button>
            
            {/* User Avatar */}
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
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">{t("dashboard.welcome")}</h2>
                <p className="text-emerald-100">{t("dashboard.subtitle")}</p>
              </CardContent>
            </Card>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id}
                  className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => { setSelectedSubject(subject.id); setActiveTab("lessons"); }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                        <subject.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {language === "ar" ? subject.nameAr : subject.nameEn}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {subject.lessonsCount} {language === "ar" ? "درس" : "lessons"} • {subject.simulatorsCount} {language === "ar" ? "محاكي" : "simulators"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardDescription>{t("dashboard.progress")}</CardDescription>
                  <CardTitle className="text-3xl">{mockProgress.completedLessons}/{physicsLessons.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercentage} className="h-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardDescription>{t("dashboard.completedLessons")}</CardDescription>
                  <CardTitle className="text-3xl text-emerald-600">{mockProgress.completedLessons}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {language === "ar" ? "درس مكتمل" : "lessons completed"}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardDescription>{t("dashboard.totalScore")}</CardDescription>
                  <CardTitle className="text-3xl text-amber-500">{mockProgress.totalScore}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {language === "ar" ? "معدل ممتاز" : "Excellent rate"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access to Simulators */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-purple-500" />
                  {t("simulators.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {simulators.map((sim) => (
                    <div 
                      key={sim.id}
                      className="p-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => { setActiveTab("simulators"); setActiveSimulator(sim.id); }}
                    >
                      <div className={`w-10 h-10 rounded-lg ${sim.color} flex items-center justify-center mb-3`}>
                        <sim.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-medium">{t(`simulators.${sim.id}`)}</h3>
                      <p className="text-sm text-slate-500 mt-1">{t(`simulators.${sim.id}Desc`)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === "lessons" && (
          <div className="space-y-6">
            {/* Subject Tabs */}
            <Tabs defaultValue="physics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {subjects.map((subject) => (
                  <TabsTrigger key={subject.id} value={subject.id} className="flex items-center gap-2">
                    <subject.icon className="w-4 h-4" />
                    {language === "ar" ? subject.nameAr : subject.nameEn}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="physics" className="space-y-4 mt-6">
                <h2 className="text-2xl font-bold">{language === "ar" ? "دروس الفيزياء" : "Physics Lessons"}</h2>
                
                {/* Group by Unit */}
                {["mechanics", "forces", "energy"].map((unit) => (
                  <div key={unit} className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        unit === "mechanics" ? "bg-emerald-500" : 
                        unit === "forces" ? "bg-orange-500" : "bg-purple-500"
                      }`} />
                      {t(`unit.${unit}`)}
                    </h3>
                    <div className="grid gap-3">
                      {physicsLessons.filter(l => l.unit === unit).map((lesson) => {
                        const isCompleted = parseInt(lesson.id) <= mockProgress.completedLessons;
                        const isLocked = !lesson.isFree && mockProgress.completedLessons < lesson.order - 1;
                        
                        return (
                          <Card 
                            key={lesson.id} 
                            className={`border-0 shadow-md transition-all cursor-pointer hover:shadow-lg ${
                              isLocked ? "opacity-60" : ""
                            }`}
                          >
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isCompleted 
                                    ? "bg-emerald-100 dark:bg-emerald-900" 
                                    : "bg-slate-100 dark:bg-slate-800"
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  ) : isLocked ? (
                                    <Lock className="w-5 h-5 text-slate-400" />
                                  ) : (
                                    <Play className="w-5 h-5 text-slate-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {language === "ar" ? lesson.titleAr : lesson.titleEn}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>{lesson.duration} {t("lessons.duration")}</span>
                                    {lesson.isFree && (
                                      <Badge variant="secondary" className="text-xs">
                                        {t("lessons.free")}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isCompleted && (
                                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                    {t("lessons.completed")}
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
                ))}
              </TabsContent>

              <TabsContent value="math" className="mt-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-8 text-center">
                    <Calculator className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">{language === "ar" ? "دروس الرياضيات" : "Mathematics Lessons"}</h2>
                    <p className="text-slate-500">{language === "ar" ? "قريباً..." : "Coming soon..."}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chemistry" className="mt-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-8 text-center">
                    <Beaker className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">{language === "ar" ? "دروس الكيمياء" : "Chemistry Lessons"}</h2>
                    <p className="text-slate-500">{language === "ar" ? "قريباً..." : "Coming soon..."}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Simulators Tab */}
        {activeTab === "simulators" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("simulators.title")}</h2>

            {/* Simulator Selection */}
            {!activeSimulator && (
              <div className="grid gap-4">
                {simulators.map((sim) => (
                  <Card 
                    key={sim.id} 
                    className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setActiveSimulator(sim.id)}
                  >
                    <div className={`h-2 ${sim.color}`} />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl ${sim.color} flex items-center justify-center`}>
                            <sim.icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{t(`simulators.${sim.id}`)}</h3>
                            <p className="text-slate-500 mt-1">{t(`simulators.${sim.id}Desc`)}</p>
                          </div>
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          {t("simulators.open")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Active Simulator */}
            {activeSimulator === "motion" && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setActiveSimulator(null)} className="mb-4">
                  {dir === "rtl" ? <ChevronRight className="w-4 h-4 ml-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
                  {language === "ar" ? "العودة للمحاكيات" : "Back to Simulators"}
                </Button>
                <MotionSimulator language={language} />
              </div>
            )}

            {activeSimulator === "forces" && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setActiveSimulator(null)} className="mb-4">
                  {dir === "rtl" ? <ChevronRight className="w-4 h-4 ml-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
                  {language === "ar" ? "العودة للمحاكيات" : "Back to Simulators"}
                </Button>
                <ForcesSimulator language={language} />
              </div>
            )}

            {activeSimulator === "energy" && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setActiveSimulator(null)} className="mb-4">
                  {dir === "rtl" ? <ChevronRight className="w-4 h-4 ml-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
                  {language === "ar" ? "العودة للمحاكيات" : "Back to Simulators"}
                </Button>
                <EnergySimulator language={language} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-slate-900 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => { setActiveTab("dashboard"); setActiveSimulator(null); }}
          >
            <BookOpen className={`w-5 h-5 ${activeTab === "dashboard" ? "text-emerald-600" : ""}`} />
            <span className="text-xs">{t("nav.home")}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => { setActiveTab("lessons"); setActiveSimulator(null); }}
          >
            <Play className={`w-5 h-5 ${activeTab === "lessons" ? "text-emerald-600" : ""}`} />
            <span className="text-xs">{t("nav.lessons")}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => { setActiveTab("simulators"); setActiveSimulator(null); }}
          >
            <FlaskConical className={`w-5 h-5 ${activeTab === "simulators" ? "text-emerald-600" : ""}`} />
            <span className="text-xs">{t("nav.simulators")}</span>
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
