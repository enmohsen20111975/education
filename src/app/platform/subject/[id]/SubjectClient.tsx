"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Globe, Moon, Sun, ChevronRight, ArrowLeft, ArrowRight,
  Atom, Calculator, FlaskConical, Leaf, BookOpen, Globe as GlobeIcon,
  Map, Landmark, Cpu, Eye, Sigma, BarChart3, ChevronDown, Lock,
  Clock, Play
} from "lucide-react";
import { loadStaticData } from "@/lib/static-data";
import { useTheme } from "next-themes";

const subjectIcons: Record<string, any> = {
  Atom, Calculator, FlaskConical, Leaf, BookOpen, Globe: GlobeIcon,
  Map, Landmark, Cpu, Eye, Sigma, BarChart3,
};

interface Lesson {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  duration: number;
  isFree: boolean;
  order: number;
}

interface Unit {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  order: number;
  Lesson: Lesson[];
}

interface SubjectDetail {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  yearId: string;
  Unit: Unit[];
  AcademicYear?: {
    id: string;
    code: string;
    nameAr: string;
    nameEn: string;
  };
}

interface SubjectClientProps {
  subjectId: string;
}

export default function SubjectClient({ subjectId }: SubjectClientProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  const isRTL = language === "ar";
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const data = await loadStaticData();

        let foundSubject: SubjectDetail | null = null;

        for (const year of data?.academicYears || []) {
          const subj = year.Subject?.find((s: any) => s.id === subjectId);
          if (subj) {
            foundSubject = { ...subj, AcademicYear: year };
            break;
          }
        }

        setSubject(foundSubject);
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);

    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }

    setExpandedUnits(newExpanded);
  };

  const getSubjectName = () => {
    if (!subject) return "";
    return language === "ar" ? subject.nameAr : subject.nameEn;
  };

  const IconComponent = subject ? (subjectIcons[subject.icon] || BookOpen) : BookOpen;

  const units = subject?.Unit || [];

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
              {subject?.AcademicYear && (
                <Link href={`/platform/year/${subject.AcademicYear.code}`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BackArrow className="w-4 h-4" />
                    {t("العودة", "Back")}
                  </Button>
                </Link>
              )}
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
          <Link href="/platform" className="hover:text-purple-600 transition">
            {t("المنصة", "Platform")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          {subject?.AcademicYear && (
            <>
              <Link
                href={`/platform/year/${subject.AcademicYear.code}`}
                className="hover:text-purple-600 transition"
              >
                {language === "ar" ? subject.AcademicYear.nameAr : subject.AcademicYear.nameEn}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-slate-800 dark:text-white font-medium">
            {getSubjectName()}
          </span>
        </nav>

        {/* Subject Header */}
        {subject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${subject.color}20` }}
            >
              <IconComponent className="w-8 h-8" style={{ color: subject.color }} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                {getSubjectName()}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {units.length} {t("وحدة دراسية", "units")}
              </p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {units.sort((a, b) => a.order - b.order).map((unit, index) => {
              const isExpanded = expandedUnits.has(unit.id);
              const lessons = unit.Lesson || [];

              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 shadow-md">
                    {/* Unit Header */}
                    <div
                      className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 cursor-pointer flex items-center justify-between hover:from-purple-50 hover:to-pink-50 dark:hover:from-slate-800 dark:hover:to-slate-900 transition-colors"
                      onClick={() => toggleUnit(unit.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white">
                            {language === "ar" ? unit.nameAr : unit.nameEn}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {lessons.length} {t("درس", "lessons")}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {/* Lessons List */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        {lessons.length === 0 ? (
                          <div className="p-8 text-center text-slate-500">
                            {t("لا توجد دروس بعد", "No lessons yet")}
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                              <Link
                                key={lesson.id}
                                href={`/platform/lesson/${lesson.id}`}
                                className="flex items-center justify-between p-4 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    lesson.isFree
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : "bg-slate-100 dark:bg-slate-800"
                                  }`}>
                                    {lesson.isFree ? (
                                      <Play className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <Lock className="w-5 h-5 text-slate-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-slate-800 dark:text-white">
                                      {language === "ar" ? lesson.titleAr : lesson.titleEn}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                      <Clock className="w-3 h-3" />
                                      {lesson.duration} {t("دقيقة", "min")}
                                      {lesson.isFree && (
                                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                          {t("مجاني", "Free")}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
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
