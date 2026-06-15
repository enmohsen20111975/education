"use client";

import { useMemo } from "react";

interface GeographyMapProps {
  type: "egypt" | "world" | "africa" | "asia" | "climate" | "rivers" | "mountains" | "population";
  highlight?: string[];
  language?: "ar" | "en";
  className?: string;
}

// خرائط تفاعلية للجغرافيا
export function GeographyMap({ type, highlight = [], language = "ar", className = "" }: GeographyMapProps) {
  const map = useMemo(() => {
    switch (type) {
      case "egypt":
        return <EgyptMap highlight={highlight} language={language} />;
      case "world":
        return <WorldMap highlight={highlight} language={language} />;
      case "africa":
        return <AfricaMap highlight={highlight} language={language} />;
      case "asia":
        return <AsiaMap highlight={highlight} language={language} />;
      case "climate":
        return <ClimateMap language={language} />;
      case "rivers":
        return <RiversMap language={language} />;
      case "mountains":
        return <MountainsMap language={language} />;
      case "population":
        return <PopulationMap language={language} />;
      default:
        return <EgyptMap highlight={highlight} language={language} />;
    }
  }, [type, highlight, language]);

  return (
    <div className={`bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-950 rounded-xl p-4 ${className}`}>
      <svg viewBox="0 0 500 400" className="w-full h-auto">
        {map}
      </svg>
    </div>
  );
}

// خريطة مصر
function EgyptMap({ highlight, language }: { highlight: string[]; language: string }) {
  const labels = {
    egypt: language === "ar" ? "مصر" : "Egypt",
    cairo: language === "ar" ? "القاهرة" : "Cairo",
    alexandria: language === "ar" ? "الإسكندرية" : "Alexandria",
    luxor: language === "ar" ? "الأقصر" : "Luxor",
    aswan: language === "ar" ? "أسوان" : "Aswan",
    suez: language === "ar" ? "السويس" : "Suez",
    nile: language === "ar" ? "نهر النيل" : "Nile River",
    redSea: language === "ar" ? "البحر الأحمر" : "Red Sea",
    medSea: language === "ar" ? "البحر المتوسط" : "Mediterranean",
  };

  return (
    <>
      {/* البحر المتوسط */}
      <rect x="50" y="20" width="400" height="60" fill="#60A5FA" opacity="0.5" rx="5" />
      <text x="250" y="55" textAnchor="middle" className="text-xs fill-blue-800">{labels.medSea}</text>
      
      {/* البحر الأحمر */}
      <path d="M 420 150 Q 450 200 430 280 L 400 280 Q 420 200 400 150 Z" fill="#EF4444" opacity="0.4" />
      <text x="435" y="220" textAnchor="middle" className="text-xs fill-red-700" transform="rotate(90, 435, 220)">{labels.redSea}</text>
      
      {/* خريطة مصر */}
      <path
        d="M 100 80 
           L 180 80 L 200 100 L 220 95 L 250 100 L 280 95 L 310 100 L 340 95 L 380 100 L 400 120
           L 390 150 L 380 180 L 370 220 L 360 260 L 350 300 L 340 340
           L 280 350 L 220 340 L 160 320 L 100 280
           L 90 220 L 80 160 L 90 100 Z"
        fill="rgba(245, 158, 11, 0.4)"
        stroke="#D97706"
        strokeWidth="2"
      />
      
      {/* نهر النيل */}
      <path
        d="M 250 80 Q 240 120 245 160 Q 250 200 245 240 Q 240 280 260 340"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="4"
      />
      <text x="270" y="200" className="text-xs fill-blue-600">{labels.nile}</text>
      
      {/* الدلتا */}
      <path
        d="M 200 100 Q 220 110 250 105 Q 280 110 300 100"
        fill="rgba(34, 197, 94, 0.5)"
        stroke="#22C55E"
        strokeWidth="1"
      />
      
      {/* المدن */}
      <circle cx="250" cy="130" r="6" fill="#1F2937" className={highlight.includes('cairo') ? 'animate-pulse' : ''} />
      <text x="270" y="135" className="text-sm font-bold fill-slate-800">{labels.cairo}</text>
      
      <circle cx="180" cy="95" r="5" fill="#DC2626" className={highlight.includes('alexandria') ? 'animate-pulse' : ''} />
      <text x="140" y="95" className="text-xs fill-slate-700">{labels.alexandria}</text>
      
      <circle cx="260" cy="250" r="5" fill="#7C3AED" className={highlight.includes('luxor') ? 'animate-pulse' : ''} />
      <text x="280" y="255" className="text-xs fill-slate-700">{labels.luxor}</text>
      
      <circle cx="265" cy="320" r="5" fill="#0891B2" className={highlight.includes('aswan') ? 'animate-pulse' : ''} />
      <text x="285" y="325" className="text-xs fill-slate-700">{labels.aswan}</text>
      
      <circle cx="380" cy="150" r="4" fill="#EC4899" className={highlight.includes('suez') ? 'animate-pulse' : ''} />
      <text x="395" y="155" className="text-xs fill-slate-700">{labels.suez}</text>
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.egypt}</text>
    </>
  );
}

// خريطة العالم
function WorldMap({ highlight, language }: { highlight: string[]; language: string }) {
  const labels = {
    world: language === "ar" ? "خريطة العالم" : "World Map",
    africa: language === "ar" ? "أفريقيا" : "Africa",
    asia: language === "ar" ? "آسيا" : "Asia",
    europe: language === "ar" ? "أوروبا" : "Europe",
    america: language === "ar" ? "أمريكا" : "America",
    australia: language === "ar" ? "أستراليا" : "Australia",
  };

  return (
    <>
      {/* المحيطات */}
      <rect x="0" y="0" width="500" height="400" fill="#DBEAFE" />
      
      {/* أفريقيا */}
      <path
        d="M 220 130 Q 200 150 190 180 Q 180 220 200 260 Q 220 300 240 310 Q 260 300 270 270 Q 280 240 275 200 Q 270 160 250 140 Z"
        fill="rgba(245, 158, 11, 0.5)"
        stroke="#D97706"
        strokeWidth="1.5"
        className={highlight.includes('africa') ? 'animate-pulse' : ''}
      />
      <text x="230" y="230" className="text-xs fill-amber-800">{labels.africa}</text>
      
      {/* آسيا */}
      <path
        d="M 280 80 Q 320 70 380 80 Q 420 100 450 130 Q 460 170 450 210 Q 420 250 380 260 Q 340 250 300 230 Q 270 200 270 160 Q 275 120 280 80 Z"
        fill="rgba(239, 68, 68, 0.4)"
        stroke="#DC2626"
        strokeWidth="1.5"
        className={highlight.includes('asia') ? 'animate-pulse' : ''}
      />
      <text x="360" y="170" className="text-xs fill-red-800">{labels.asia}</text>
      
      {/* أوروبا */}
      <path
        d="M 240 60 Q 280 50 320 60 Q 340 80 330 100 Q 300 110 270 100 Q 250 90 240 60 Z"
        fill="rgba(59, 130, 246, 0.4)"
        stroke="#3B82F6"
        strokeWidth="1.5"
        className={highlight.includes('europe') ? 'animate-pulse' : ''}
      />
      <text x="285" y="85" className="text-xs fill-blue-800">{labels.europe}</text>
      
      {/* أمريكا الشمالية */}
      <path
        d="M 50 80 Q 90 60 130 80 Q 150 120 140 170 Q 120 200 90 190 Q 60 170 50 130 Z"
        fill="rgba(16, 185, 129, 0.4)"
        stroke="#10B981"
        strokeWidth="1.5"
        className={highlight.includes('america') ? 'animate-pulse' : ''}
      />
      
      {/* أمريكا الجنوبية */}
      <path
        d="M 100 220 Q 120 210 130 240 Q 140 280 130 320 Q 110 350 90 330 Q 80 290 90 250 Q 95 230 100 220 Z"
        fill="rgba(16, 185, 129, 0.5)"
        stroke="#10B981"
        strokeWidth="1.5"
        className={highlight.includes('america') ? 'animate-pulse' : ''}
      />
      <text x="100" y="150" className="text-xs fill-emerald-800">{labels.america}</text>
      
      {/* أستراليا */}
      <path
        d="M 400 280 Q 430 270 450 290 Q 460 320 440 340 Q 410 350 390 330 Q 385 310 400 280 Z"
        fill="rgba(139, 92, 246, 0.4)"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        className={highlight.includes('australia') ? 'animate-pulse' : ''}
      />
      <text x="420" y="315" className="text-xs fill-purple-800">{labels.australia}</text>
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.world}</text>
    </>
  );
}

// خريطة أفريقيا
function AfricaMap({ highlight, language }: { highlight: string[]; language: string }) {
  const labels = {
    africa: language === "ar" ? "قارة أفريقيا" : "Africa Continent",
    sahara: language === "ar" ? "الصحراء الكبرى" : "Sahara Desert",
    nile: language === "ar" ? "نهر النيل" : "Nile River",
    congo: language === "ar" ? "نهر الكونغو" : "Congo River",
    victoria: language === "ar" ? "بحيرة فكتوريا" : "Lake Victoria",
    atlas: language === "ar" ? "جبال الأطلس" : "Atlas Mountains",
  };

  return (
    <>
      {/* القارة */}
      <path
        d="M 200 50 Q 180 70 170 100 Q 160 140 150 180 Q 140 230 160 280 Q 180 330 220 350 Q 260 360 300 340 Q 340 310 350 270 Q 360 230 340 180 Q 320 130 290 90 Q 260 60 220 50 Z"
        fill="rgba(245, 158, 11, 0.3)"
        stroke="#D97706"
        strokeWidth="2"
      />
      
      {/* الصحراء الكبرى */}
      <ellipse cx="230" cy="120" rx="80" ry="50" fill="rgba(217, 119, 6, 0.4)" stroke="#B45309" strokeWidth="1" strokeDasharray="4,2" />
      <text x="230" y="125" textAnchor="middle" className="text-xs fill-amber-900">{labels.sahara}</text>
      
      {/* نهر النيل */}
      <path d="M 280 70 Q 270 110 275 160 Q 280 210 270 260 Q 260 300 280 340" fill="none" stroke="#3B82F6" strokeWidth="3" />
      <text x="290" y="200" className="text-xs fill-blue-600">{labels.nile}</text>
      
      {/* نهر الكونغو */}
      <path d="M 250 250 Q 270 260 280 280 Q 290 300 270 320" fill="none" stroke="#06B6D4" strokeWidth="2.5" />
      <text x="295" y="290" className="text-xs fill-cyan-600">{labels.congo}</text>
      
      {/* بحيرة فكتوريا */}
      <ellipse cx="305" cy="250" rx="25" ry="15" fill="#60A5FA" stroke="#2563EB" strokeWidth="1" />
      <text x="305" y="255" textAnchor="middle" className="text-xs fill-blue-800">{labels.victoria}</text>
      
      {/* جبال الأطلس */}
      <path d="M 170 80 Q 180 70 195 75 Q 210 70 220 80" fill="none" stroke="#7C3AED" strokeWidth="3" />
      <text x="195" y="65" textAnchor="middle" className="text-xs fill-purple-700">{labels.atlas}</text>
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.africa}</text>
    </>
  );
}

// خريطة آسيا
function AsiaMap({ highlight, language }: { highlight: string[]; language: string }) {
  const labels = {
    asia: language === "ar" ? "قارة آسيا" : "Asia Continent",
    arabianGulf: language === "ar" ? "الخليج العربي" : "Arabian Gulf",
    himalaya: language === "ar" ? "جبال الهيمالايا" : "Himalaya Mountains",
    ganges: language === "ar" ? "نهر الغانج" : "Ganges River",
    yangtze: language === "ar" ? "نهر يانغتسي" : "Yangtze River",
  };

  return (
    <>
      {/* القارة */}
      <path
        d="M 100 100 Q 150 80 220 70 Q 300 60 380 80 Q 430 100 460 150 Q 480 200 470 260 Q 450 310 400 330 Q 350 340 300 330 Q 250 320 200 290 Q 150 260 120 220 Q 90 180 100 100 Z"
        fill="rgba(239, 68, 68, 0.2)"
        stroke="#DC2626"
        strokeWidth="2"
      />
      
      {/* الخليج العربي */}
      <path d="M 170 180 Q 180 200 170 220 Q 160 230 150 220" fill="#60A5FA" opacity="0.6" stroke="#2563EB" strokeWidth="1" />
      <text x="165" y="210" textAnchor="middle" className="text-xs fill-blue-700">{labels.arabianGulf}</text>
      
      {/* جبال الهيمالايا */}
      <path d="M 250 180 Q 280 170 310 175 Q 340 170 370 180" fill="none" stroke="#7C3AED" strokeWidth="4" />
      <text x="310" y="160" textAnchor="middle" className="text-xs fill-purple-700">{labels.himalaya}</text>
      
      {/* نهر الغانج */}
      <path d="M 280 200 Q 290 220 300 250 Q 310 270 300 290" fill="none" stroke="#3B82F6" strokeWidth="2" />
      <text x="315" y="260" className="text-xs fill-blue-600">{labels.ganges}</text>
      
      {/* نهر يانغتسي */}
      <path d="M 350 200 Q 370 220 390 240 Q 410 260 430 270" fill="none" stroke="#06B6D4" strokeWidth="2" />
      <text x="400" y="250" className="text-xs fill-cyan-600">{labels.yangtze}</text>
      
      {/* العنوان */}
      <text x="280" y="380" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.asia}</text>
    </>
  );
}

// خريطة المناخ
function ClimateMap({ language }: { language: string }) {
  const labels = {
    climate: language === "ar" ? "مناطق المناخ في العالم" : "World Climate Zones",
    tropical: language === "ar" ? "منطقة استوائية" : "Tropical",
    desert: language === "ar" ? "منطقة صحراوية" : "Desert",
    temperate: language === "ar" ? "منطقة معتدلة" : "Temperate",
    polar: language === "ar" ? "منطقة قطبية" : "Polar",
  };

  return (
    <>
      {/* المنطقة القطبية الشمالية */}
      <rect x="0" y="0" width="500" height="60" fill="rgba(147, 197, 253, 0.6)" />
      <text x="250" y="35" textAnchor="middle" className="text-xs fill-blue-900">{labels.polar}</text>
      
      {/* المنطقة المعتدلة الشمالية */}
      <rect x="0" y="60" width="500" height="100" fill="rgba(74, 222, 128, 0.4)" />
      <text x="250" y="110" textAnchor="middle" className="text-xs fill-green-900">{labels.temperate}</text>
      
      {/* المنطقة الاستوائية */}
      <rect x="0" y="160" width="500" height="80" fill="rgba(251, 146, 60, 0.4)" />
      <text x="250" y="200" textAnchor="middle" className="text-xs fill-orange-900">{labels.tropical}</text>
      
      {/* المنطقة الصحراوية */}
      <rect x="0" y="155" width="500" height="40" fill="rgba(217, 119, 6, 0.3)" />
      <text x="250" y="180" textAnchor="middle" className="text-xs fill-amber-900">{labels.desert}</text>
      
      {/* المنطقة المعتدلة الجنوبية */}
      <rect x="0" y="240" width="500" height="100" fill="rgba(74, 222, 128, 0.4)" />
      
      {/* المنطقة القطبية الجنوبية */}
      <rect x="0" y="340" width="500" height="60" fill="rgba(147, 197, 253, 0.6)" />
      
      {/* خط الاستواء */}
      <line x1="0" y1="200" x2="500" y2="200" stroke="#EF4444" strokeWidth="2" strokeDasharray="10,5" />
      <text x="20" y="195" className="text-xs fill-red-600">{language === "ar" ? "خط الاستواء" : "Equator"}</text>
      
      {/* مدار السرطان */}
      <line x1="0" y1="140" x2="500" y2="140" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5,5" />
      <text x="20" y="135" className="text-xs fill-amber-600">{language === "ar" ? "مدار السرطان" : "Tropic of Cancer"}</text>
      
      {/* مدار الجدي */}
      <line x1="0" y1="260" x2="500" y2="260" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5,5" />
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.climate}</text>
    </>
  );
}

// خريطة الأنهار
function RiversMap({ language }: { language: string }) {
  const labels = {
    rivers: language === "ar" ? "أهم أنهار العالم" : "Major World Rivers",
    nile: language === "ar" ? "النيل" : "Nile",
    amazon: language === "ar" ? "الأمازون" : "Amazon",
    yangtze: language === "ar" ? "يانغتسي" : "Yangtze",
    mississippi: language === "ar" ? "المسيسيبي" : "Mississippi",
    danube: language === "ar" ? "الدانوب" : "Danube",
  };

  return (
    <>
      {/* خريطة بسيطة */}
      <rect x="0" y="0" width="500" height="350" fill="#DBEAFE" opacity="0.3" />
      
      {/* نهر النيل */}
      <path d="M 260 50 Q 250 100 255 150 Q 260 200 250 250 Q 240 290 260 340" fill="none" stroke="#3B82F6" strokeWidth="4" />
      <circle cx="260" cy="50" r="8" fill="#3B82F6" />
      <text x="280" y="180" className="text-sm font-bold fill-blue-700">{labels.nile}</text>
      
      {/* نهر الأمازون */}
      <path d="M 80 180 Q 100 190 130 185 Q 160 180 190 190 Q 220 195 250 185" fill="none" stroke="#10B981" strokeWidth="4" />
      <text x="130" y="170" className="text-sm font-bold fill-emerald-700">{labels.amazon}</text>
      
      {/* نهر يانغتسي */}
      <path d="M 380 120 Q 400 140 420 160 Q 440 180 460 200" fill="none" stroke="#F59E0B" strokeWidth="4" />
      <text x="400" y="130" className="text-sm font-bold fill-amber-700">{labels.yangtze}</text>
      
      {/* نهر المسيسيبي */}
      <path d="M 80 80 Q 90 120 85 160 Q 80 200 90 240" fill="none" stroke="#EF4444" strokeWidth="3" />
      <text x="95" y="150" className="text-xs fill-red-700">{labels.mississippi}</text>
      
      {/* نهر الدانوب */}
      <path d="M 300 80 Q 330 90 360 85 Q 390 90 420 80" fill="none" stroke="#8B5CF6" strokeWidth="3" />
      <text x="340" y="70" className="text-xs fill-purple-700">{labels.danube}</text>
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.rivers}</text>
    </>
  );
}

// خريطة الجبال
function MountainsMap({ language }: { language: string }) {
  const labels = {
    mountains: language === "ar" ? "أهم سلاسل الجبال في العالم" : "World Mountain Ranges",
    himalaya: language === "ar" ? "الهيمالايا" : "Himalaya",
    alps: language === "ar" ? "الألب" : "Alps",
    andes: language === "ar" ? "الأنديز" : "Andes",
    rockies: language === "ar" ? "روكي" : "Rockies",
    atlas: language === "ar" ? "الأطلس" : "Atlas",
  };

  return (
    <>
      {/* خريطة بسيطة */}
      <rect x="0" y="0" width="500" height="350" fill="#ECFDF5" opacity="0.3" />
      
      {/* جبال الهيمالايا */}
      <path d="M 280 150 Q 300 140 320 145 Q 340 135 360 140 Q 380 130 400 140" fill="none" stroke="#7C3AED" strokeWidth="5" />
      <text x="340" y="125" textAnchor="middle" className="text-sm font-bold fill-purple-700">{labels.himalaya}</text>
      {/* قمة إيفرست */}
      <polygon points="340,130 345,115 350,130" fill="#7C3AED" />
      <text x="340" y="110" textAnchor="middle" className="text-xs fill-purple-900">8848m</text>
      
      {/* جبال الألب */}
      <path d="M 280 80 Q 300 70 320 75 Q 340 68 360 78" fill="none" stroke="#3B82F6" strokeWidth="4" />
      <text x="320" y="60" textAnchor="middle" className="text-sm font-bold fill-blue-700">{labels.alps}</text>
      
      {/* جبال الأنديز */}
      <path d="M 120 100 Q 110 140 115 180 Q 120 220 110 260 Q 105 300 115 340" fill="none" stroke="#10B981" strokeWidth="4" />
      <text x="80" y="200" className="text-sm font-bold fill-emerald-700">{labels.andes}</text>
      
      {/* جبال روكي */}
      <path d="M 80 60 Q 90 100 85 140 Q 80 180 90 220" fill="none" stroke="#F59E0B" strokeWidth="4" />
      <text x="60" y="130" className="text-xs fill-amber-700">{labels.rockies}</text>
      
      {/* جبال الأطلس */}
      <path d="M 200 90 Q 220 85 240 90 Q 260 85 270 95" fill="none" stroke="#EF4444" strokeWidth="3" />
      <text x="235" y="75" textAnchor="middle" className="text-xs fill-red-700">{labels.atlas}</text>
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.mountains}</text>
    </>
  );
}

// خريطة توزيع السكان
function PopulationMap({ language }: { language: string }) {
  const labels = {
    population: language === "ar" ? "توزيع السكان في العالم" : "World Population Distribution",
    high: language === "ar" ? "كثافة عالية" : "High Density",
    medium: language === "ar" ? "كثافة متوسطة" : "Medium Density",
    low: language === "ar" ? "كثافة منخفضة" : "Low Density",
  };

  return (
    <>
      {/* خريطة بسيطة */}
      <rect x="0" y="0" width="500" height="350" fill="#FEF3C7" opacity="0.3" />
      
      {/* مناطق الكثافة العالية */}
      <circle cx="360" cy="160" r="40" fill="rgba(239, 68, 68, 0.6)" />
      <text x="360" y="165" textAnchor="middle" className="text-xs fill-white font-bold">الصين</text>
      
      <circle cx="340" cy="200" r="35" fill="rgba(239, 68, 68, 0.5)" />
      <text x="340" y="205" textAnchor="middle" className="text-xs fill-white font-bold">الهند</text>
      
      <circle cx="300" cy="100" r="25" fill="rgba(251, 146, 60, 0.6)" />
      <text x="300" y="105" textAnchor="middle" className="text-xs fill-white">أوروبا</text>
      
      <circle cx="100" cy="150" r="20" fill="rgba(251, 146, 60, 0.5)" />
      <text x="100" y="155" textAnchor="middle" className="text-xs fill-amber-900">US</text>
      
      {/* مناطق الكثافة المنخفضة */}
      <ellipse cx="230" cy="130" rx="50" ry="30" fill="rgba(16, 185, 129, 0.3)" />
      <ellipse cx="130" cy="280" rx="30" ry="40" fill="rgba(16, 185, 129, 0.3)" />
      <circle cx="420" cy="280" r="20" fill="rgba(16, 185, 129, 0.3)" />
      
      {/* مفتاح الخريطة */}
      <rect x="20" y="300" width="15" height="15" fill="rgba(239, 68, 68, 0.6)" />
      <text x="40" y="312" className="text-xs fill-slate-700">{labels.high}</text>
      
      <rect x="20" y="320" width="15" height="15" fill="rgba(251, 146, 60, 0.6)" />
      <text x="40" y="332" className="text-xs fill-slate-700">{labels.medium}</text>
      
      <rect x="20" y="340" width="15" height="15" fill="rgba(16, 185, 129, 0.3)" />
      <text x="40" y="352" className="text-xs fill-slate-700">{labels.low}</text>
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.population}</text>
    </>
  );
}

// مكون لعرض مجموعة خرائط
export function GeographyMapsGrid({ maps, language = "ar" }: { 
  maps: Array<{ type: GeographyMapProps["type"]; highlight?: string[] }>;
  language?: "ar" | "en";
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {maps.map((map, index) => (
        <GeographyMap
          key={index}
          type={map.type}
          highlight={map.highlight}
          language={language}
        />
      ))}
    </div>
  );
}

export default GeographyMap;
