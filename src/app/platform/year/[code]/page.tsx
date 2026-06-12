"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, Globe, Moon, Sun, ChevronRight, Home, ArrowLeft,
  Atom, Calculator, FlaskConical, Leaf, BookOpen, Globe as GlobeIcon,
  Map, Landmark, Cpu, Eye, Sigma, BarChart3
} from "lucide-react";

const subjectIcons: Record<string, any> = {
  Atom, Calculator, FlaskConical, Leaf, BookOpen, Globe: GlobeIcon,
  Map, Landmark, Cpu, Eye, Sigma, BarChart3,
};

interface SubjectFromApi {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  order: number;
  isCommon: boolean;
  Unit: { id: string; nameAr: string; nameEn: string }[];
}

interface AcademicYearFromApi {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  Subject: SubjectFromApi[];
}

export default function YearPage() {
  const params = useParams();
  const yearCode = params.code as string;
  const { language, toggleLanguage, t } = useLanguage();
  const [yearData, setYearData] = useState<AcademicYearFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const isRTL = language === "ar";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/structure");
        const data = await res.json();
        const year = data.academicYears?.find((y: any) => y.code === yearCode);
        setYearData(year || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [yearCode]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const getYearName = () => {
    if (!yearData) return "";
    return language === "ar" ? yearData.nameAr : yearData.nameEn;
  };

  const subjects = yearData?.Subject || [];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/platform" className="flex items-center gap-2 hover:opacity-80 transition">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/platform" className="hover:text-purple-600 transition">
            {t("المنصة", "Platform")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 dark:text-white font-medium">
            {getYearName()}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {t("اختر المادة", "Select Subject")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {getYearName()} - {t("اختر المادة التي تريد دراستها", "Choose the subject you want to study")}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {subjects.map((subject, index) => {
              const IconComponent = subjectIcons[subject.icon] || BookOpen;
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/platform/subject/${subject.id}`}>
                    <Card className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg h-full">
                      <CardContent className="p-4 text-center">
                        <div 
                          className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${subject.color}20` }}
                        >
                          <IconComponent 
                            className="w-7 h-7" 
                            style={{ color: subject.color }} 
                          />
                        </div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1 line-clamp-1">
                          {language === "ar" ? subject.nameAr : subject.nameEn}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {subject.Unit?.length || 0} {t("وحدة", "units")}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
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
