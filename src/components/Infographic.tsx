"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  Lightbulb,
  TrendingUp,
  Zap,
  Target,
  GitBranch,
  Layers,
  Activity,
} from "lucide-react";

// ==========================================
// أنواع البيانات للمخططات المختلفة
// ==========================================

// عنصر المقارنة
interface ComparisonItem {
  label: string;
  labelAr: string;
  value1: number;
  value2: number;
  label1: string;
  label2: string;
  maxValue?: number;
}

// خطوة العملية
interface ProcessStep {
  step: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon?: string;
}

// قسم الدائرة
interface CircleSegment {
  label: string;
  labelAr: string;
  value: number;
  color: string;
  description?: string;
  descriptionAr?: string;
}

// حدث الجدول الزمني
interface TimelineEvent {
  year: string;
  yearAr?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon?: string;
}

// بيانات المخططات
interface ComparisonData {
  items: ComparisonItem[];
  showValues?: boolean;
}

interface ProcessData {
  steps: ProcessStep[];
  showNumbers?: boolean;
}

interface CircleData {
  segments: CircleSegment[];
  showPercentage?: boolean;
  centerLabel?: string;
  centerLabelAr?: string;
}

interface TimelineData {
  events: TimelineEvent[];
  showYear?: boolean;
}

// Props الرئيسية
interface InfographicProps {
  type: "comparison" | "process" | "circle" | "timeline";
  data: ComparisonData | ProcessData | CircleData | TimelineData;
  language: "ar" | "en";
  title?: string;
  titleAr?: string;
  className?: string;
}

// ==========================================
// ألوان متناسقة للمخططات
// ==========================================
const COLORS = {
  primary: "#10B981", // أخضر زمردي
  secondary: "#F59E0B", // برتقالي
  tertiary: "#8B5CF6", // بنفسجي
  quaternary: "#EF4444", // أحمر
  quinary: "#3B82F6", // أزرق
  senary: "#EC4899", // وردي
};

const SEGMENT_COLORS = [
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#3B82F6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

// ==========================================
// حركات Framer Motion
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ==========================================
// مكون مخطط المقارنة
// ==========================================
function ComparisonChart({
  data,
  language,
}: {
  data: ComparisonData;
  language: "ar" | "en";
}) {
  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={dir}
    >
      {/* مفتاح الخريطة */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium">{data.items[0]?.label1 || "A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span className="text-sm font-medium">{data.items[0]?.label2 || "B"}</span>
        </div>
      </div>

      {/* عناصر المقارنة */}
      {data.items.map((item, index) => {
        const maxVal = item.maxValue || Math.max(item.value1, item.value2, 100);
        const percent1 = (item.value1 / maxVal) * 100;
        const percent2 = (item.value2 / maxVal) * 100;

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
          >
            {/* التسمية */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-lg">
                {isRTL ? item.labelAr : item.label}
              </span>
              {data.showValues && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-emerald-600 font-medium">{item.value1}</span>
                  <span className="text-amber-600 font-medium">{item.value2}</span>
                </div>
              )}
            </div>

            {/* أشرطة المقارنة */}
            <div className="space-y-2">
              {/* الشريط الأول */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">
                  {item.label1}
                </span>
                <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent1}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm font-medium text-emerald-600 w-12 text-end">
                  {item.value1}
                </span>
              </div>

              {/* الشريط الثاني */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">
                  {item.label2}
                </span>
                <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent2}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm font-medium text-amber-600 w-12 text-end">
                  {item.value2}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ==========================================
// مكون مخطط العملية
// ==========================================
function ProcessFlow({
  data,
  language,
}: {
  data: ProcessData;
  language: "ar" | "en";
}) {
  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  // أيقونات متاحة
  const iconMap: Record<string, React.ReactNode> = {
    lightbulb: <Lightbulb className="w-5 h-5" />,
    target: <Target className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    check: <CheckCircle className="w-5 h-5" />,
    activity: <Activity className="w-5 h-5" />,
    layers: <Layers className="w-5 h-5" />,
    trending: <TrendingUp className="w-5 h-5" />,
    gitbranch: <GitBranch className="w-5 h-5" />,
  };

  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={dir}
    >
      {/* خط الربط العمودي */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-300 via-emerald-500 to-teal-500 transform -translate-x-1/2 hidden md:block" />

      <div className="space-y-6">
        {data.steps.map((step, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`flex items-center gap-4 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* المحتوى */}
            <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {/* رقم الخطوة */}
                    {data.showNumbers !== false && (
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                        {step.step}
                      </div>
                    )}
                    {/* أيقونة */}
                    {step.icon && iconMap[step.icon] && (
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600">
                        {iconMap[step.icon]}
                      </div>
                    )}
                    <h3 className="font-bold text-lg">
                      {isRTL ? step.titleAr : step.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {isRTL ? step.descriptionAr : step.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* النقطة المركزية */}
            <div className="hidden md:flex w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-4 border-emerald-500 items-center justify-center z-10 shadow-lg">
              <span className="font-bold text-emerald-600">{step.step}</span>
            </div>

            {/* مساحة فارغة للمحاذاة */}
            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ==========================================
// مكون مخطط الدائرة
// ==========================================
function CircleDiagram({
  data,
  language,
}: {
  data: CircleData;
  language: "ar" | "en";
}) {
  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  // حساب الزوايا والأقواس
  const total = data.segments.reduce((sum, seg) => sum + seg.value, 0);
  
  const segmentsWithAngles = useMemo(() => {
    // استخدام reduce لبناء المصفوفة مع تتبع الزاوية الحالية
    const result = data.segments.reduce<{
      segments: Array<{
        label: string;
        labelAr: string;
        value: number;
        color: string;
        description?: string;
        descriptionAr?: string;
        percentage: number;
        startAngle: number;
        endAngle: number;
      }>;
      currentAngle: number;
    }>((acc, seg, index) => {
      const percentage = (seg.value / total) * 100;
      const angle = (seg.value / total) * 360;
      const startAngle = acc.currentAngle;
      const endAngle = acc.currentAngle + angle;

      acc.segments.push({
        ...seg,
        percentage,
        startAngle,
        endAngle,
        color: seg.color || SEGMENT_COLORS[index % SEGMENT_COLORS.length],
      });

      acc.currentAngle = endAngle;
      return acc;
    }, { segments: [], currentAngle: -90 });

    return result.segments;
  }, [data.segments, total]);

  // إنشاء مسار القوس SVG
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const startX = 100 + radius * Math.cos(startRad);
    const startY = 100 + radius * Math.sin(startRad);
    const endX = 100 + radius * Math.cos(endRad);
    const endY = 100 + radius * Math.sin(endRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M 100 100 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={dir}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* الدائرة */}
        <motion.div
          variants={scaleVariants}
          className="relative w-64 h-64 lg:w-80 lg:h-80"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-0">
            {/* خلفية الدائرة */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-200 dark:text-slate-700"
            />
            
            {/* الأقسام */}
            {segmentsWithAngles.map((seg, index) => (
              <motion.path
                key={index}
                d={createArcPath(seg.startAngle, seg.endAngle, 80)}
                fill={seg.color}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
            
            {/* الدائرة المركزية */}
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="white"
              className="dark:fill-slate-800"
            />
            
            {/* النص المركزي */}
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-bold fill-slate-700 dark:fill-slate-200"
            >
              {isRTL ? data.centerLabelAr : data.centerLabel || (data.showPercentage !== false ? `${total}%` : total)}
            </text>
          </svg>
        </motion.div>

        {/* التسميات */}
        <div className="flex-1 space-y-3">
          {segmentsWithAngles.map((seg, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{isRTL ? seg.labelAr : seg.label}</span>
                  <Badge variant="outline" className="ml-2">
                    {data.showPercentage !== false ? `${seg.percentage.toFixed(1)}%` : seg.value}
                  </Badge>
                </div>
                {(isRTL ? seg.descriptionAr : seg.description) && (
                  <p className="text-sm text-slate-500 mt-1">
                    {isRTL ? seg.descriptionAr : seg.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// مكون الجدول الزمني
// ==========================================
function Timeline({
  data,
  language,
}: {
  data: TimelineData;
  language: "ar" | "en";
}) {
  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  // أيقونات متاحة
  const iconMap: Record<string, React.ReactNode> = {
    lightbulb: <Lightbulb className="w-5 h-5" />,
    target: <Target className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    check: <CheckCircle className="w-5 h-5" />,
    activity: <Activity className="w-5 h-5" />,
    clock: <Clock className="w-5 h-5" />,
    circle: <Circle className="w-5 h-5" />,
  };

  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={dir}
    >
      {/* الخط الأفقي للجدول الزمني */}
      <div className="absolute left-0 right-0 top-8 h-1 bg-gradient-to-r from-purple-300 via-purple-500 to-pink-500 hidden lg:block" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
        {data.events.map((event, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`relative ${index % 2 === 0 ? "lg:pt-12" : "lg:pt-0"}`}
          >
            {/* النقطة الزمنية */}
            <div className="absolute left-4 lg:left-1/2 top-0 lg:top-8 transform lg:-translate-x-1/2 z-10">
              <motion.div
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-4 border-purple-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.2 }}
              >
                {event.icon && iconMap[event.icon] ? (
                  <div className="text-purple-500 scale-75">{iconMap[event.icon]}</div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                )}
              </motion.div>
            </div>

            {/* البطاقة */}
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ml-12 lg:ml-0 ${
              index % 2 === 0 ? "lg:mr-auto lg:mr-[10%] lg:max-w-[85%]" : "lg:ml-auto lg:ml-[10%] lg:max-w-[85%]"
            }`}>
              <CardContent className="p-4">
                {/* السنة */}
                {data.showYear !== false && (
                  <Badge className="mb-2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {isRTL && event.yearAr ? event.yearAr : event.year}
                  </Badge>
                )}

                {/* العنوان */}
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {event.icon && iconMap[event.icon] && (
                    <span className="text-purple-500">{iconMap[event.icon]}</span>
                  )}
                  {isRTL ? event.titleAr : event.title}
                </h3>

                {/* الوصف */}
                <p className="text-slate-600 dark:text-slate-300">
                  {isRTL ? event.descriptionAr : event.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ==========================================
// المكون الرئيسي
// ==========================================
export function Infographic({
  type,
  data,
  language,
  title,
  titleAr,
  className = "",
}: InfographicProps) {
  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  // أيقونة حسب النوع
  const typeIcons = {
    comparison: <TrendingUp className="w-5 h-5" />,
    process: <GitBranch className="w-5 h-5" />,
    circle: <Circle className="w-5 h-5" />,
    timeline: <Clock className="w-5 h-5" />,
  };

  // ألوان حسب النوع
  const typeColors = {
    comparison: "from-emerald-500 to-teal-500",
    process: "from-blue-500 to-indigo-500",
    circle: "from-purple-500 to-pink-500",
    timeline: "from-amber-500 to-orange-500",
  };

  // عنوان افتراضي حسب النوع
  const defaultTitles = {
    comparison: { ar: "مخطط المقارنة", en: "Comparison Chart" },
    process: { ar: "خطوات العملية", en: "Process Flow" },
    circle: { ar: "التوزيع النسبي", en: "Distribution Chart" },
    timeline: { ar: "الجدول الزمني", en: "Timeline" },
  };

  const displayTitle = (isRTL ? titleAr : title) || defaultTitles[type][language];

  // عرض المخطط المناسب
  const renderChart = () => {
    switch (type) {
      case "comparison":
        return <ComparisonChart data={data as ComparisonData} language={language} />;
      case "process":
        return <ProcessFlow data={data as ProcessData} language={language} />;
      case "circle":
        return <CircleDiagram data={data as CircleData} language={language} />;
      case "timeline":
        return <Timeline data={data as TimelineData} language={language} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      dir={dir}
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        {/* شريط العنوان الملون */}
        <div className={`h-2 bg-gradient-to-r ${typeColors[type]}`} />
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              type === "comparison" ? "bg-emerald-100 text-emerald-600" :
              type === "process" ? "bg-blue-100 text-blue-600" :
              type === "circle" ? "bg-purple-100 text-purple-600" :
              "bg-amber-100 text-amber-600"
            }`}>
              {typeIcons[type]}
            </div>
            {displayTitle}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4">
          {renderChart()}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ==========================================
// أمثلة جاهزة للاستخدام
// ==========================================

// مثال: مقارنة السرعة المتوسطة واللحظية
export const speedComparisonData: ComparisonData = {
  items: [
    {
      label: "Average Speed",
      labelAr: "السرعة المتوسطة",
      value1: 60,
      value2: 45,
      label1: "Car A",
      label2: "Car B",
      maxValue: 100,
    },
    {
      label: "Instant Speed",
      labelAr: "السرعة اللحظية",
      value1: 80,
      value2: 55,
      label1: "Car A",
      label2: "Car B",
      maxValue: 100,
    },
    {
      label: "Acceleration",
      labelAr: "التسارع",
      value1: 15,
      value2: 20,
      label1: "Car A",
      label2: "Car B",
      maxValue: 30,
    },
  ],
  showValues: true,
};

// مثال: خطوات حل مسألة فيزيائية
export const physicsProcessData: ProcessData = {
  steps: [
    {
      step: 1,
      title: "Read and Understand",
      titleAr: "القراءة والفهم",
      description: "Read the problem carefully and identify the given information and what is required.",
      descriptionAr: "اقرأ المسألة بعناية وحدد المعطيات والمطلوب.",
      icon: "lightbulb",
    },
    {
      step: 2,
      title: "Draw a Diagram",
      titleAr: "رسم تخطيطي",
      description: "Draw a clear diagram showing all forces and variables.",
      descriptionAr: "ارسم تخطيطاً واضحاً يوضح جميع القوى والمتغيرات.",
      icon: "target",
    },
    {
      step: 3,
      title: "Choose the Right Law",
      titleAr: "اختيار القانون المناسب",
      description: "Select the appropriate physical law or equation for the problem.",
      descriptionAr: "اختر القانون الفيزيائي أو المعادلة المناسبة للمسألة.",
      icon: "zap",
    },
    {
      step: 4,
      title: "Solve and Verify",
      titleAr: "الحل والتحقق",
      description: "Solve the equation and verify that the answer is reasonable.",
      descriptionAr: "حل المعادلة وتحقق من أن الإجابة منطقية.",
      icon: "check",
    },
  ],
  showNumbers: true,
};

// مثال: أنواع الطاقة (دائرة)
export const energyCircleData: CircleData = {
  segments: [
    {
      label: "Kinetic Energy",
      labelAr: "الطاقة الحركية",
      value: 35,
      color: "#10B981",
      description: "Energy of motion",
      descriptionAr: "طاقة الحركة",
    },
    {
      label: "Potential Energy",
      labelAr: "طاقة الوضع",
      value: 25,
      color: "#F59E0B",
      description: "Stored energy",
      descriptionAr: "الطاقة المخزنة",
    },
    {
      label: "Thermal Energy",
      labelAr: "الطاقة الحرارية",
      value: 20,
      color: "#EF4444",
      description: "Heat energy",
      descriptionAr: "طاقة الحرارة",
    },
    {
      label: "Chemical Energy",
      labelAr: "الطاقة الكيميائية",
      value: 15,
      color: "#8B5CF6",
      description: "Energy in bonds",
      descriptionAr: "الطاقة في الروابط",
    },
    {
      label: "Other Forms",
      labelAr: "أشكال أخرى",
      value: 5,
      color: "#3B82F6",
      description: "Nuclear, electrical, etc.",
      descriptionAr: "النووية، الكهربائية، إلخ.",
    },
  ],
  showPercentage: true,
  centerLabel: "Energy",
  centerLabelAr: "الطاقة",
};

// مثال: تطور نظرية الذرة (Timeline)
export const atomTimelineData: TimelineData = {
  events: [
    {
      year: "400 BC",
      yearAr: "400 ق.م",
      title: "Democritus",
      titleAr: "ديموقريطس",
      description: "First proposed the concept of indivisible particles called atoms.",
      descriptionAr: "أول من اقترح مفهوم الجسيمات غير القابلة للتجزئة المسماة ذرات.",
      icon: "circle",
    },
    {
      year: "1803",
      yearAr: "1803",
      title: "Dalton's Model",
      titleAr: "نموذج دالتون",
      description: "Atoms are solid spheres, and different elements have different atoms.",
      descriptionAr: "الذرات كرات صلبة، والعناصر المختلفة لها ذرات مختلفة.",
      icon: "activity",
    },
    {
      year: "1897",
      yearAr: "1897",
      title: "Thomson's Model",
      titleAr: "نموذج طومسون",
      description: "Discovered electrons, proposed the plum pudding model.",
      descriptionAr: "اكتشف الإلكترونات، اقترح نموذج البرقوق في العجينة.",
      icon: "zap",
    },
    {
      year: "1911",
      yearAr: "1911",
      title: "Rutherford's Model",
      titleAr: "نموذج رذرفورد",
      description: "Atoms have a dense nucleus with electrons orbiting around it.",
      descriptionAr: "الذرات لها نواة كثيفة مع إلكترونات تدور حولها.",
      icon: "target",
    },
    {
      year: "1913",
      yearAr: "1913",
      title: "Bohr's Model",
      titleAr: "نموذج بور",
      description: "Electrons orbit in specific energy levels around the nucleus.",
      descriptionAr: "الإلكترونات تدور في مستويات طاقة محددة حول النواة.",
      icon: "lightbulb",
    },
    {
      year: "1926",
      yearAr: "1926",
      title: "Quantum Model",
      titleAr: "النموذج الكمومي",
      description: "Electrons exist in probability clouds, not definite orbits.",
      descriptionAr: "الإلكترونات موجودة في سحب احتمالية، وليست مدارات محددة.",
      icon: "check",
    },
  ],
  showYear: true,
};

// تصدير الأنواع للاستخدام الخارجي
export type {
  InfographicProps,
  ComparisonItem,
  ComparisonData,
  ProcessStep,
  ProcessData,
  CircleSegment,
  CircleData,
  TimelineEvent,
  TimelineData,
};
