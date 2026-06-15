"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun, ArrowLeft, Network, Palette } from "lucide-react";
import { simulations } from "@/lib/simulations";
import { simulatorMap } from "@/lib/simulatorMap";
import { ScientificCalculator } from "@/components/tools/ScientificCalculator";
import { MindMapEditor } from "@/components/simulations/MindMapEditor";
import { InfographicEditor } from "@/components/simulations/InfographicEditor";

interface SimulationClientProps {
  simId: string;
}

export default function SimulationClient({ simId }: SimulationClientProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const [isDark, setIsDark] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);

  const isRTL = language === "ar";

  useEffect(() => {
    const sim = simulations.find(s => s.id === simId);
    setSimulation(sim);
  }, [simId]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Render the appropriate simulation component using the map
  const renderSimulation = () => {
    // Check for special tools
    if (simId === "mind-map") {
      return <MindMapEditor language={language} />;
    }
    if (simId === "infographic") {
      return <InfographicEditor language={language} />;
    }
    if (simId === "sim-calc-scientific") {
      return (
        <div className="max-w-md mx-auto">
          <ScientificCalculator language={language} />
        </div>
      );
    }

    // Use simulatorMap for all other simulations
    const SimulatorComponent = simulatorMap[simId];
    if (SimulatorComponent) {
      return <SimulatorComponent language={language} />;
    }

    // Default placeholder
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-4xl">🔬</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          {language === "ar" ? "المحاكاة قيد التطوير" : "Simulation Under Development"}
        </h3>
        <p className="text-slate-500">
          {language === "ar" 
            ? "هذه المحاكاة قيد الإنشاء وستكون متاحة قريباً"
            : "This simulation is being developed and will be available soon"
          }
        </p>
      </div>
    );
  };

  const title = simulation
    ? (language === "ar" ? simulation.titleAr : simulation.titleEn)
    : (language === "ar" ? "المحاكاة التفاعلية" : "Interactive Simulation");

  const description = simulation
    ? (language === "ar" ? simulation.descriptionAr : simulation.descriptionEn)
    : "";

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/platform/simulations" className="flex items-center gap-2 hover:opacity-80 transition">
                <img src="/logo.jpeg" alt="SmartEdu" className="w-10 h-10 rounded-xl object-cover" />
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
                  {t("تعلم ذكي", "SmartEdu")}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/platform/simulations">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </motion.div>

        {/* Simulation Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {renderSimulation()}
        </motion.div>

        {/* Quick Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {t("أدوات سريعة", "Quick Tools")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/platform/simulations/mind-map">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <Network className="w-6 h-6 text-purple-500" />
                <span className="text-xs">{t("خريطة ذهنية", "Mind Map")}</span>
              </Button>
            </Link>
            <Link href="/platform/simulations/infographic">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <Palette className="w-6 h-6 text-pink-500" />
                <span className="text-xs">{t("إنفوجرافيك", "Infographic")}</span>
              </Button>
            </Link>
            <Link href="/platform/simulations/sim-calc-scientific">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <span className="text-2xl">🔢</span>
                <span className="text-xs">{t("آلة حاسبة", "Calculator")}</span>
              </Button>
            </Link>
            <Link href="/platform/simulations">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <span className="text-2xl">🔬</span>
                <span className="text-xs">{t("كل المحاكيات", "All Simulations")}</span>
              </Button>
            </Link>
          </div>
        </motion.div>
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
