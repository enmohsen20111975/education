"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe, Moon, Sun, ArrowLeft, Calculator, Ruler, 
  Thermometer, Scale, Timer
} from "lucide-react";
import { ScientificCalculator } from "@/components/tools/ScientificCalculator";

export default function ToolsPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  const isRTL = language === "ar";

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const tools = [
    { id: "calculator", icon: Calculator, labelAr: "الآلة الحاسبة", labelEn: "Calculator" },
    { id: "unit-converter", icon: Ruler, labelAr: "محول الوحدات", labelEn: "Unit Converter" },
    { id: "periodic-table", icon: Thermometer, labelAr: "الجدول الدوري", labelEn: "Periodic Table" },
    { id: "formula-sheet", icon: Scale, labelAr: "ورقة الصيغ", labelEn: "Formula Sheet" },
  ];

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
              <Link href="/platform">
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {t("الأدوات التعليمية", "Educational Tools")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("أدوات تفاعلية لمساعدتك في الدراسة", "Interactive tools to help you study")}
          </p>
        </motion.div>

        {/* Tools Tabs */}
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2 bg-white dark:bg-slate-800 rounded-xl">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <TabsTrigger 
                  key={tool.id} 
                  value={tool.id}
                  className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {language === "ar" ? tool.labelAr : tool.labelEn}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-purple-500" />
                    {t("الآلة الحاسبة العلمية", "Scientific Calculator")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScientificCalculator language={language} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Unit Converter Tab */}
          <TabsContent value="unit-converter">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-purple-500" />
                    {t("محول الوحدات", "Unit Converter")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Ruler className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    {t("قريباً - محول الوحدات الشامل", "Coming Soon - Comprehensive Unit Converter")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Periodic Table Tab */}
          <TabsContent value="periodic-table">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-purple-500" />
                    {t("الجدول الدوري", "Periodic Table")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Thermometer className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    {t("قريباً - الجدول الدوري التفاعلي", "Coming Soon - Interactive Periodic Table")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Formula Sheet Tab */}
          <TabsContent value="formula-sheet">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-500" />
                    {t("ورقة الصيغ", "Formula Sheet")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Scale className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    {t("قريباً - مجموعة الصيغ والمعادلات", "Coming Soon - Formula & Equation Collection")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
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
