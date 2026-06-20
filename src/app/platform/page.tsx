"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, Globe, Moon, Sun, Home,
  BookOpen, Users, Trophy, Beaker, Calculator
} from "lucide-react";
import { getAcademicYearsStatic } from "@/lib/static-data";

interface AcademicYear {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  order: number;
  Subject: any[];
}

export default function PlatformPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";
  const isRTL = language === "ar";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const years = await getAcademicYearsStatic();
        setAcademicYears(years);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <img src="/logo.jpeg" alt="SmartEdu" className="w-10 h-10 rounded-xl object-cover" />
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t("تعلم ذكي", "SmartEdu")}
                </span>
              </Link>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {t("المنهج المصري", "Egyptian Curriculum")}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  {t("الرئيسية", "Home")}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            {t("اختر السنة الدراسية", "Select Academic Year")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {t("ابدأ رحلتك التعليمية باختيار سنتك الدراسية", "Start your learning journey by selecting your academic year")}
          </p>
        </motion.div>

        {/* Featured Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12"
        >
          <Link href="/platform/simulations">
            <Card className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Beaker className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                    {t("المحاكيات التعليمية", "Educational Simulations")}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {t("تجارب تفاعلية لفهم المفاهيم العلمية", "Interactive experiments to understand scientific concepts")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/platform/simulations?type=calculator">
            <Card className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                    {t("الأدوات الحسابية", "Calculation Tools")}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {t("آلات حاسبة وأدوات رياضية متقدمة", "Advanced calculators and mathematical tools")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {academicYears.map((year, index) => (
              <motion.div
                key={year.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/platform/year/${year.code}`}>
                  <Card className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 h-full">
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ${
                        year.code === 'first-year' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                        year.code === 'second-year' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' :
                        'bg-gradient-to-br from-orange-400 to-red-500'
                      }`}>
                        {year.code === 'first-year' ? '1' : year.code === 'second-year' ? '2' : '3'}
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {language === "ar" ? year.nameAr : year.nameEn}
                      </h2>
                      <p className="text-sm text-slate-500 mb-3">
                        {year.Subject?.length || 0} {t("مادة", "subjects")}
                      </p>
                      {year.code === 'third-year' && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          {t("السنة النهائية", "Final Year")}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <Card className="bg-white/50 dark:bg-slate-800/50 border-0">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">1,152+</div>
              <div className="text-xs text-slate-500">{t("درس", "Lessons")}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-slate-800/50 border-0">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">54+</div>
              <div className="text-xs text-slate-500">{t("محاكي", "Simulators")}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-slate-800/50 border-0">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">5,000+</div>
              <div className="text-xs text-slate-500">{t("سؤال", "Questions")}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-slate-800/50 border-0">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">100%</div>
              <div className="text-xs text-slate-500">{t("منهج مصري", "Egyptian")}</div>
            </CardContent>
          </Card>
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
