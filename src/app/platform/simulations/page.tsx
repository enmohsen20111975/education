"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Moon, Sun, ArrowLeft, ArrowRight, Search, 
  Atom, FlaskConical, Calculator, Dna, CircleDot
} from "lucide-react";
import { simulations, Simulation } from "@/lib/simulations";
import { useTheme } from "next-themes";
import { SimulationCard } from "@/components/simulations/SimulationCard";

export default function SimulationsPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const isDark = theme === "dark";

  const isRTL = language === "ar";
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const typeIcons: Record<string, any> = {
    physics: Atom,
    chemistry: FlaskConical,
    math: Calculator,
    biology: Dna,
    interactive: CircleDot
  };

  const typeLabels: Record<string, { ar: string; en: string }> = {
    physics: { ar: "فيزياء", en: "Physics" },
    chemistry: { ar: "كيمياء", en: "Chemistry" },
    math: { ar: "رياضيات", en: "Mathematics" },
    biology: { ar: "أحياء", en: "Biology" },
    interactive: { ar: "تفاعلي", en: "Interactive" }
  };

  // Filter simulations
  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch = searchQuery === "" || 
      sim.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeType === "all" || sim.type === activeType;
    
    return matchesSearch && matchesType;
  });

  // Group by type
  const groupedSimulations: Record<string, Simulation[]> = {};
  filteredSimulations.forEach(sim => {
    if (!groupedSimulations[sim.type]) {
      groupedSimulations[sim.type] = [];
    }
    groupedSimulations[sim.type].push(sim);
  });

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
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
              <Link href="/platform">
                <Button variant="ghost" size="sm" className="gap-2">
                  <BackArrow className="w-4 h-4" />
                  {t("العودة", "Back")}
                </Button>
              </Link>
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {t("المحاكيات التعليمية", "Educational Simulations")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("استكشف المحاكيات التفاعلية لتعزيز فهمك للمفاهيم العلمية", "Explore interactive simulations to enhance your understanding of scientific concepts")}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
            <Input
              type="text"
              placeholder={t("ابحث عن محاكاة...", "Search for a simulation...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-10' : 'pl-10'} h-12`}
            />
          </div>

          {/* Type Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={activeType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType("all")}
              className="flex-shrink-0"
            >
              {t("الكل", "All")}
            </Button>
            {Object.entries(typeLabels).map(([type, labels]) => {
              const Icon = typeIcons[type];
              return (
                <Button
                  key={type}
                  variant={activeType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType(type)}
                  className="flex-shrink-0 gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {language === "ar" ? labels.ar : labels.en}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Simulations Grid */}
        {filteredSimulations.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {t("لا توجد محاكيات مطابقة للبحث", "No simulations match your search")}
            </p>
          </div>
        ) : activeType === "all" ? (
          // Grouped by type
          <div className="space-y-8">
            {Object.entries(groupedSimulations).map(([type, sims]) => {
              const Icon = typeIcons[type];
              const label = typeLabels[type];
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-purple-500" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                      {language === "ar" ? label.ar : label.en}
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({sims.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sims.map((sim) => (
                      <SimulationCard
                        key={sim.id}
                        simulation={sim}
                        language={language}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Single type grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSimulations.map((sim) => (
              <SimulationCard
                key={sim.id}
                simulation={sim}
                language={language}
              />
            ))}
          </div>
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
