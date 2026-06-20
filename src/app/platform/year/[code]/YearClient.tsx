"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe, Moon, Sun, ChevronRight, ArrowLeft, ArrowRight,
  Atom, Calculator, FlaskConical, Leaf, BookOpen, Globe as GlobeIcon,
  Map, Landmark, Cpu, Eye, Sigma, BarChart3
} from "lucide-react";
import { loadStaticData } from "@/lib/static-data";
import { useTheme } from "next-themes";

const subjectIcons: Record<string, any> = {
  Atom, Calculator, FlaskConical, Leaf, BookOpen, Globe: GlobeIcon,
  Map, Landmark, Cpu, Eye, Sigma, BarChart3,
};

interface Subject {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  order: number;
  isCommon: boolean;
  Specialization?: { id: string; code: string; nameAr: string; nameEn: string } | null;
  Unit: { id: string; nameAr: string; nameEn: string }[];
}

interface Specialization {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
}

interface AcademicYear {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  Subject: Subject[];
}

const specializationColors: Record<string, string> = {
  'science': 'from-green-500 to-teal-500',
  'math': 'from-blue-500 to-cyan-500',
  'arts': 'from-orange-500 to-red-500',
};

const specializationIcons: Record<string, any> = {
  'science': Atom,
  'math': Calculator,
  'arts': BookOpen,
};

interface YearClientProps {
  yearCode: string;
}

export default function YearClient({ yearCode }: YearClientProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [yearData, setYearData] = useState<AcademicYear | null>(null);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  const isRTL = language === "ar";
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadStaticData();
        const year = data?.academicYears?.find((y: any) => y.code === yearCode);
        setYearData(year || null);
        setSpecializations(data?.specializations || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [yearCode]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const getYearName = () => {
    if (!yearData) return "";
    return language === "ar" ? yearData.nameAr : yearData.nameEn;
  };

  // Check if this year needs specialization selection
  const needsSpecialization = yearCode === 'second-year' || yearCode === 'third-year';

  // Filter subjects based on specialization
  const getFilteredSubjects = () => {
    if (!yearData?.Subject) return [];

    const allSubjects = yearData.Subject;

    // First year - show all subjects
    if (!needsSpecialization) {
      return allSubjects;
    }

    // Second/Third year - filter by specialization
    if (!selectedSpec) return [];

    return allSubjects.filter(subject => {
      // Common subjects are shown to everyone
      if (subject.isCommon) return true;

      // Show subjects matching the selected specialization
      if (subject.Specialization?.code === selectedSpec) return true;

      return false;
    });
  };

  const subjects = getFilteredSubjects();

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
            {needsSpecialization && !selectedSpec
              ? t("اختر التخصص", "Select Specialization")
              : t("اختر المادة", "Select Subject")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {getYearName()} - {needsSpecialization && !selectedSpec
              ? t("اختر التخصص المناسب لك", "Choose your specialization")
              : t("اختر المادة التي تريد دراستها", "Choose the subject you want to study")}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : needsSpecialization && !selectedSpec ? (
          // Show specialization selection
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {specializations.map((spec, index) => {
              const IconComponent = specializationIcons[spec.code] || BookOpen;
              const gradient = specializationColors[spec.code] || 'from-purple-500 to-pink-500';

              return (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl h-full"
                    onClick={() => setSelectedSpec(spec.code)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r ${gradient}`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {language === "ar" ? spec.nameAr : spec.nameEn}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {spec.code === 'science' && t("أحياء + فيزياء + كيمياء + رياضيات", "Biology + Physics + Chemistry + Math")}
                        {spec.code === 'math' && t("فيزياء + كيمياء + رياضيات متقدمة", "Physics + Chemistry + Advanced Math")}
                        {spec.code === 'arts' && t("تاريخ + جغرافيا + فلسفة + علم نفس", "History + Geography + Philosophy + Psychology")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Show subjects
          <>
            {/* Show selected specialization with back button */}
            {needsSpecialization && selectedSpec && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSpec(null)}
                  className="mb-4"
                >
                  <BackArrow className="w-4 h-4 mr-2" />
                  {t("تغيير التخصص", "Change Specialization")}
                </Button>

                <Badge className={`px-4 py-2 text-sm bg-gradient-to-r ${specializationColors[selectedSpec] || 'from-purple-500 to-pink-500'} text-white border-0`}>
                  {language === "ar"
                    ? specializations.find(s => s.code === selectedSpec)?.nameAr
                    : specializations.find(s => s.code === selectedSpec)?.nameEn}
                </Badge>
              </motion.div>
            )}

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
                          {subject.isCommon && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {t("مشترك", "Common")}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
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
