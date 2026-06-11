"use client";

import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Play, FlaskConical, ChevronLeft, ChevronRight, Globe, User,
  Atom, Calculator, Beaker, ArrowDown, Target, Waves, FunctionSquare, TrendingUp
} from "lucide-react";
import { useState } from "react";

// Import all simulators
import { MotionSimulator } from "@/components/simulators/MotionSimulator";
import { ForcesSimulator } from "@/components/simulators/ForcesSimulator";
import { EnergySimulator } from "@/components/simulators/EnergySimulator";
import { FreeFallSimulator } from "@/components/simulators/FreeFallSimulator";
import { ProjectileSimulator } from "@/components/simulators/ProjectileSimulator";
import { WaveSimulator } from "@/components/simulators/WaveSimulator";
import { FunctionsSimulator } from "@/components/simulators/FunctionsSimulator";
import { PeriodicTableSimulator } from "@/components/simulators/PeriodicTableSimulator";

// بيانات المواد العلمية
const subjects = [
  { 
    id: "physics", 
    nameAr: "الفيزياء", 
    nameEn: "Physics",
    icon: Atom,
    color: "from-emerald-500 to-teal-600",
    simulatorsCount: 6
  },
  { 
    id: "math", 
    nameAr: "الرياضيات", 
    nameEn: "Mathematics",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
    simulatorsCount: 1
  },
  { 
    id: "chemistry", 
    nameAr: "الكيمياء", 
    nameEn: "Chemistry",
    icon: Beaker,
    color: "from-purple-500 to-pink-600",
    simulatorsCount: 1
  },
];

// بيانات المحاكيات
const allSimulators = [
  // Physics
  { id: "motion", icon: Play, color: "bg-emerald-500", subject: "physics", gradient: "from-emerald-500 to-teal-500" },
  { id: "forces", icon: FlaskConical, color: "bg-orange-500", subject: "physics", gradient: "from-orange-500 to-red-500" },
  { id: "energy", icon: TrendingUp, color: "bg-purple-500", subject: "physics", gradient: "from-purple-500 to-pink-500" },
  { id: "freeFall", icon: ArrowDown, color: "bg-red-500", subject: "physics", gradient: "from-red-500 to-orange-500" },
  { id: "projectile", icon: Target, color: "bg-sky-500", subject: "physics", gradient: "from-sky-500 to-blue-600" },
  { id: "wave", icon: Waves, color: "bg-blue-500", subject: "physics", gradient: "from-blue-500 to-cyan-500" },
  // Math
  { id: "functions", icon: FunctionSquare, color: "bg-indigo-500", subject: "math", gradient: "from-indigo-500 to-purple-500" },
  // Chemistry
  { id: "periodicTable", icon: Atom, color: "bg-purple-600", subject: "chemistry", gradient: "from-purple-500 to-pink-500" },
];

function DashboardContent() {
  const { language, setLanguage, t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"dashboard" | "simulators">("dashboard");
  const [activeSimulator, setActiveSimulator] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Get simulators by subject
  const getSimulatorsBySubject = (subjectId: string) => 
    allSimulators.filter(s => s.subject === subjectId);

  // Render simulator component
  const renderSimulator = () => {
    switch (activeSimulator) {
      case "motion":
        return <MotionSimulator language={language} />;
      case "forces":
        return <ForcesSimulator language={language} />;
      case "energy":
        return <EnergySimulator language={language} />;
      case "freeFall":
        return <FreeFallSimulator language={language} />;
      case "projectile":
        return <ProjectileSimulator language={language} />;
      case "wave":
        return <WaveSimulator language={language} />;
      case "functions":
        return <FunctionsSimulator language={language} />;
      case "periodicTable":
        return <PeriodicTableSimulator language={language} />;
      default:
        return null;
    }
  };

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
              variant={activeTab === "simulators" ? "default" : "ghost"} 
              onClick={() => { setActiveTab("simulators"); setActiveSimulator(null); }}
              className={activeTab === "simulators" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {t("nav.simulators")}
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
        {activeTab === "dashboard" && !activeSimulator && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{t("dashboard.welcome")}</h2>
                <p className="text-emerald-100 text-lg">{t("dashboard.subtitle")}</p>
                <div className="mt-4 flex gap-4">
                  <Button 
                    className="bg-white text-emerald-600 hover:bg-emerald-50"
                    onClick={() => setActiveTab("simulators")}
                  >
                    {language === "ar" ? "ابدأ الاستكشاف" : "Start Exploring"}
                    {dir === "rtl" ? <ChevronLeft className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Subjects Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {language === "ar" ? "المواد الدراسية" : "Subjects"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <Card 
                    key={subject.id}
                    className="border-0 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => { setSelectedSubject(subject.id); setActiveTab("simulators"); }}
                  >
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4 animate-pulse`}>
                        <subject.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">
                        {language === "ar" ? subject.nameAr : subject.nameEn}
                      </h3>
                      <p className="text-slate-500">
                        {subject.simulatorsCount} {language === "ar" ? "محاكي تفاعلي" : "interactive simulators"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Access to Simulators */}
            <div>
              <h2 className="text-2xl font-bold mb-4">{t("simulators.title")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allSimulators.slice(0, 8).map((sim) => (
                  <Card 
                    key={sim.id}
                    className="border-0 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                    onClick={() => { setActiveSimulator(sim.id); }}
                  >
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sim.gradient} flex items-center justify-center mb-3 group-hover:animate-bounce`}>
                        <sim.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">{t(`simulators.${sim.id}`)}</h3>
                      <p className="text-sm text-slate-500 mt-1">{t(`simulators.${sim.id}Desc`)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Simulators Tab */}
        {activeTab === "simulators" && !activeSimulator && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("simulators.title")}</h2>

            {/* Subject Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedSubject === null ? "default" : "outline"}
                onClick={() => setSelectedSubject(null)}
                className={selectedSubject === null ? "bg-emerald-600 hover:bg-emerald-700" : ""}
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

            {/* Simulators Grid */}
            <div className="grid gap-4">
              {(selectedSubject ? getSimulatorsBySubject(selectedSubject) : allSimulators).map((sim) => (
                <Card 
                  key={sim.id}
                  className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={() => setActiveSimulator(sim.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${sim.gradient}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sim.gradient} flex items-center justify-center animate-pulse`}>
                          <sim.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{t(`simulators.${sim.id}`)}</h3>
                          <p className="text-slate-500">{t(`simulators.${sim.id}Desc`)}</p>
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
          </div>
        )}

        {/* Active Simulator */}
        {activeSimulator && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setActiveSimulator(null)} className="mb-4">
              {dir === "rtl" ? <ChevronRight className="w-4 h-4 ml-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
              {language === "ar" ? "العودة للمحاكيات" : "Back to Simulators"}
            </Button>
            {renderSimulator()}
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
