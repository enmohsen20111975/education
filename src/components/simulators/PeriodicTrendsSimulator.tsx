"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Atom, Zap, CircleDot, Minus } from "lucide-react";

interface PeriodicTrendsSimulatorProps {
  language: "ar" | "en";
}

// Simplified periodic table data with trends
const elements = [
  // Period 1
  { symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", z: 1, period: 1, group: 1, radius: 53, ie: 1312, ea: 73, en: 2.20 },
  { symbol: "He", nameAr: "هيليوم", nameEn: "Helium", z: 2, period: 1, group: 18, radius: 31, ie: 2372, ea: 0, en: 0 },
  // Period 2
  { symbol: "Li", nameAr: "ليثيوم", nameEn: "Lithium", z: 3, period: 2, group: 1, radius: 167, ie: 520, ea: 60, en: 0.98 },
  { symbol: "Be", nameAr: "بريليوم", nameEn: "Beryllium", z: 4, period: 2, group: 2, radius: 112, ie: 900, ea: 0, en: 1.57 },
  { symbol: "B", nameAr: "بورون", nameEn: "Boron", z: 5, period: 2, group: 13, radius: 87, ie: 801, ea: 27, en: 2.04 },
  { symbol: "C", nameAr: "كربون", nameEn: "Carbon", z: 6, period: 2, group: 14, radius: 67, ie: 1086, ea: 122, en: 2.55 },
  { symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", z: 7, period: 2, group: 15, radius: 56, ie: 1402, ea: 0, en: 3.04 },
  { symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", z: 8, period: 2, group: 16, radius: 48, ie: 1314, ea: 141, en: 3.44 },
  { symbol: "F", nameAr: "فلور", nameEn: "Fluorine", z: 9, period: 2, group: 17, radius: 42, ie: 1681, ea: 328, en: 3.98 },
  { symbol: "Ne", nameAr: "نيون", nameEn: "Neon", z: 10, period: 2, group: 18, radius: 38, ie: 2081, ea: 0, en: 0 },
  // Period 3
  { symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", z: 11, period: 3, group: 1, radius: 190, ie: 496, ea: 53, en: 0.93 },
  { symbol: "Mg", nameAr: "ماغنسيوم", nameEn: "Magnesium", z: 12, period: 3, group: 2, radius: 145, ie: 738, ea: 0, en: 1.31 },
  { symbol: "Al", nameAr: "ألومنيوم", nameEn: "Aluminum", z: 13, period: 3, group: 13, radius: 118, ie: 578, ea: 43, en: 1.61 },
  { symbol: "Si", nameAr: "سيليكون", nameEn: "Silicon", z: 14, period: 3, group: 14, radius: 111, ie: 787, ea: 134, en: 1.90 },
  { symbol: "P", nameAr: "فوسفور", nameEn: "Phosphorus", z: 15, period: 3, group: 15, radius: 98, ie: 1012, ea: 72, en: 2.19 },
  { symbol: "S", nameAr: "كبريت", nameEn: "Sulfur", z: 16, period: 3, group: 16, radius: 88, ie: 1000, ea: 200, en: 2.58 },
  { symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", z: 17, period: 3, group: 17, radius: 79, ie: 1251, ea: 349, en: 3.16 },
  { symbol: "Ar", nameAr: "أرجون", nameEn: "Argon", z: 18, period: 3, group: 18, radius: 71, ie: 1520, ea: 0, en: 0 },
];

export function PeriodicTrendsSimulator({ language }: PeriodicTrendsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTrend, setSelectedTrend] = useState<"radius" | "ie" | "ea" | "en">("radius");
  const [selectedElement, setSelectedElement] = useState(elements[0]);
  const [hoveredElement, setHoveredElement] = useState<typeof elements[0] | null>(null);

  const texts = {
    ar: {
      title: "محاكي الاتجاهات الدورية",
      description: "استكشف الاتجاهات الدورية في الجدول الدوري",
      selectTrend: "اختر الاتجاه",
      atomicRadius: "نصف القطر الذري",
      ionizationEnergy: "طاقة التأين",
      electronAffinity: "الألفة الإلكترونية",
      electronegativity: "السالبية الكهربائية",
      element: "العنصر",
      value: "القيمة",
      period: "الدورة",
      group: "المجموعة",
      trendAcross: "الاتجاه عبر الدورة",
      trendDown: "الاتجاه أسفل المجموعة",
      increases: "يزداد",
      decreases: "يقل",
      explanation: "التفسير",
      radiusExp: "نصف القطر الذري يقل عبر الدورة بسبب زيادة الشحنة النووية الفعالة، ويزداد أسفل المجموعة بسبب إضافة أغلفة إلكترونية جديدة.",
      ieExp: "طاقة التأين تزداد عبر الدورة (صعوبة نزع إلكترون من ذرة أصغر)، وتقل أسفل المجموعة (الإلكترونات الخارجية أبعد عن النواة).",
      eaExp: "الألفة الإلكترونية تزداد عبر الدورة (قبول إلكترون أسهل)، وتقل أسفل المجموعة. الغازات النبيلة لها ألفة صفرية.",
      enExp: "السالبية الكهربائية تزداد عبر الدورة وتقل أسفل المجموعة. الفلور هو الأعلى سالبية (3.98)، والفرنسيوم الأقل (0.7).",
      pm: "بيكومتر",
      kjmol: "كيلوجول/مول",
      unit: "وحدة",
    },
    en: {
      title: "Periodic Trends Simulator",
      description: "Explore periodic trends in the periodic table",
      selectTrend: "Select Trend",
      atomicRadius: "Atomic Radius",
      ionizationEnergy: "Ionization Energy",
      electronAffinity: "Electron Affinity",
      electronegativity: "Electronegativity",
      element: "Element",
      value: "Value",
      period: "Period",
      group: "Group",
      trendAcross: "Trend Across Period",
      trendDown: "Trend Down Group",
      increases: "Increases",
      decreases: "Decreases",
      explanation: "Explanation",
      radiusExp: "Atomic radius decreases across a period due to increasing effective nuclear charge, and increases down a group due to adding new electron shells.",
      ieExp: "Ionization energy increases across a period (harder to remove electron from smaller atom), and decreases down a group (outer electrons farther from nucleus).",
      eaExp: "Electron affinity increases across a period (easier to accept electron), and decreases down a group. Noble gases have zero affinity.",
      enExp: "Electronegativity increases across a period and decreases down a group. Fluorine has the highest electronegativity (3.98), Francium the lowest (0.7).",
      pm: "pm",
      kjmol: "kJ/mol",
      unit: "Unit",
    },
  };

  const t = texts[language];

  const trendConfig = {
    radius: {
      name: t.atomicRadius,
      key: "radius" as const,
      unit: t.pm,
      color: "#3b82f6",
      across: "decreases",
      down: "increases",
      exp: t.radiusExp,
    },
    ie: {
      name: t.ionizationEnergy,
      key: "ie" as const,
      unit: t.kjmol,
      color: "#ef4444",
      across: "increases",
      down: "decreases",
      exp: t.ieExp,
    },
    ea: {
      name: t.electronAffinity,
      key: "ea" as const,
      unit: t.kjmol,
      color: "#10b981",
      across: "increases",
      down: "decreases",
      exp: t.eaExp,
    },
    en: {
      name: t.electronegativity,
      key: "en" as const,
      unit: "",
      color: "#f59e0b",
      across: "increases",
      down: "decreases",
      exp: t.enExp,
    },
  };

  const currentTrend = trendConfig[selectedTrend];

  // Draw trend visualization
  const drawTrend = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 40, right: 30, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Get elements for periods 2 and 3 (most commonly compared)
    const period2 = elements.filter(e => e.period === 2);
    const period3 = elements.filter(e => e.period === 3);

    // Calculate range
    const allValues = [...period2, ...period3].map(e => e[currentTrend.key]);
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const value = maxVal - (i / 5) * range;
      ctx.fillStyle = "#64748b";
      ctx.font = "11px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(value.toFixed(0), padding.left - 10, y + 4);
    }

    // Draw axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Y-axis label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${currentTrend.name} (${currentTrend.unit})`, 0, 0);
    ctx.restore();

    // Draw bars for period 2
    const barWidth = (chartWidth / period2.length) * 0.4;
    const barGap = (chartWidth / period2.length) * 0.1;

    period2.forEach((element, i) => {
      const value = element[currentTrend.key];
      const barHeight = ((value - minVal) / range) * chartHeight;
      const x = padding.left + i * (chartWidth / period2.length) + barGap;
      const y = height - padding.bottom - barHeight;

      // Bar
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
      gradient.addColorStop(0, currentTrend.color);
      gradient.addColorStop(1, `${currentTrend.color}88`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Element symbol
      ctx.fillStyle = "#374151";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(element.symbol, x + barWidth / 2, height - padding.bottom + 15);

      // Value on top
      if (value > 0) {
        ctx.fillStyle = currentTrend.color;
        ctx.font = "9px system-ui";
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      }
    });

    // Period 2 label
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? "الدورة الثانية" : "Period 2", padding.left + chartWidth / 4, height - 20);

    // Draw bars for period 3
    const offset = chartWidth / 2;
    period3.forEach((element, i) => {
      const value = element[currentTrend.key];
      const barHeight = ((value - minVal) / range) * chartHeight;
      const x = padding.left + offset + i * (chartWidth / period3.length) + barGap;
      const y = height - padding.bottom - barHeight;

      // Bar
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
      gradient.addColorStop(0, `${currentTrend.color}cc`);
      gradient.addColorStop(1, `${currentTrend.color}66`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Element symbol
      ctx.fillStyle = "#374151";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(element.symbol, x + barWidth / 2, height - padding.bottom + 15);

      // Value on top
      if (value > 0) {
        ctx.fillStyle = currentTrend.color;
        ctx.font = "9px system-ui";
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      }
    });

    // Period 3 label
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? "الدورة الثالثة" : "Period 3", padding.left + offset + chartWidth / 4, height - 20);

    // Draw trend arrows
    const arrowY = padding.top + 20;
    
    // Across trend
    ctx.fillStyle = currentTrend.across === "increases" ? "#10b981" : "#ef4444";
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    const acrossText = language === "ar" 
      ? (currentTrend.across === "increases" ? "↗ يزداد" : "↘ يقل")
      : (currentTrend.across === "increases" ? "Increases →" : "Decreases →");
    ctx.fillText(acrossText, padding.left + 50, arrowY);

    // Down trend
    const downText = language === "ar"
      ? (currentTrend.down === "increases" ? "↓ يزداد" : "↑ يقل")
      : (currentTrend.down === "increases" ? "↓ Increases" : "↑ Decreases");
    ctx.fillText(downText, width - padding.right - 100, arrowY);

  }, [selectedTrend, currentTrend, language]);

  // Draw
  useEffect(() => {
    drawTrend();
  }, [drawTrend]);

  // Get element value
  const getElementValue = (element: typeof elements[0]) => {
    return element[currentTrend.key];
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Trend selector */}
        <div className="space-y-3">
          <label className="font-medium">{t.selectTrend}</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(trendConfig) as Array<keyof typeof trendConfig>).map((trend) => (
              <Button
                key={trend}
                variant={selectedTrend === trend ? "default" : "outline"}
                onClick={() => setSelectedTrend(trend)}
                style={selectedTrend === trend ? { backgroundColor: trendConfig[trend].color } : {}}
              >
                {trendConfig[trend].name}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={700} height={300} className="w-full" />
        </div>

        {/* Trend indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {currentTrend.across === "increases" ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">{t.trendAcross}</span>
            </div>
            <Badge className={currentTrend.across === "increases" ? "bg-green-500" : "bg-red-500"}>
              {currentTrend.across === "increases" ? t.increases : t.decreases}
            </Badge>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {currentTrend.down === "increases" ? (
                <TrendingDown className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">{t.trendDown}</span>
            </div>
            <Badge className={currentTrend.down === "increases" ? "bg-green-500" : "bg-red-500"}>
              {currentTrend.down === "increases" ? t.increases : t.decreases}
            </Badge>
          </div>
        </div>

        {/* Mini periodic table */}
        <div className="space-y-2">
          <h4 className="font-medium">{t.selectTrend}</h4>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(9, 1fr)" }}>
            {elements.map((element) => {
              const value = getElementValue(element);
              const intensity = value / Math.max(...elements.map(e => getElementValue(e)));
              
              return (
                <div
                  key={element.symbol}
                  className="aspect-square rounded flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110"
                  style={{
                    backgroundColor: value > 0 ? `${currentTrend.color}${Math.floor(intensity * 200 + 55).toString(16)}` : "#f1f5f9",
                    border: selectedElement.symbol === element.symbol ? `2px solid ${currentTrend.color}` : "1px solid #e2e8f0",
                  }}
                  onClick={() => setSelectedElement(element)}
                  onMouseEnter={() => setHoveredElement(element)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <span className="text-[10px] text-slate-500">{element.z}</span>
                  <span className="font-bold text-sm">{element.symbol}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected element info */}
        {(selectedElement || hoveredElement) && (
          <div className="p-4 rounded-lg border" style={{ borderColor: currentTrend.color }}>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white"
                style={{ backgroundColor: currentTrend.color }}
              >
                <span className="text-xs">{(selectedElement || hoveredElement)!.z}</span>
                <span className="text-2xl font-bold">{(selectedElement || hoveredElement)!.symbol}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">
                  {language === "ar" ? (selectedElement || hoveredElement)!.nameAr : (selectedElement || hoveredElement)!.nameEn}
                </h4>
                <div className="flex gap-4 text-sm text-slate-600">
                  <span>{t.period}: {(selectedElement || hoveredElement)!.period}</span>
                  <span>{t.group}: {(selectedElement || hoveredElement)!.group}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">{currentTrend.name}</p>
                <p className="text-2xl font-bold" style={{ color: currentTrend.color }}>
                  {getElementValue(selectedElement || hoveredElement!)} {currentTrend.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="p-4 rounded-lg border-2" style={{ borderColor: `${currentTrend.color}40`, backgroundColor: `${currentTrend.color}10` }}>
          <h4 className="font-bold mb-2" style={{ color: currentTrend.color }}>{t.explanation}</h4>
          <p className="text-slate-600 dark:text-slate-400">{currentTrend.exp}</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <CircleDot className="w-5 h-5 mx-auto mb-1 text-blue-500" />
            <p className="text-xs text-slate-500">{t.atomicRadius}</p>
            <p className="font-bold text-blue-600">{language === "ar" ? "يزداد ↓" : "↓ Increases"}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-red-500" />
            <p className="text-xs text-slate-500">{t.ionizationEnergy}</p>
            <p className="font-bold text-red-600">{language === "ar" ? "يزداد →" : "→ Increases"}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <Minus className="w-5 h-5 mx-auto mb-1 text-green-500" />
            <p className="text-xs text-slate-500">{t.electronAffinity}</p>
            <p className="font-bold text-green-600">{language === "ar" ? "يزداد →" : "→ Increases"}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
            <Atom className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <p className="text-xs text-slate-500">{t.electronegativity}</p>
            <p className="font-bold text-amber-600">{language === "ar" ? "يزداد →" : "→ Increases"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
