"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Atom, Zap, ArrowRight, Scale, GitCompare } from "lucide-react";

interface ElectronegativitySimulatorProps {
  language: "ar" | "en";
}

// Element data with electronegativity (Pauling scale)
const elements = [
  { symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", en: 2.20, group: 1, period: 1 },
  { symbol: "Li", nameAr: "ليثيوم", nameEn: "Lithium", en: 0.98, group: 1, period: 2 },
  { symbol: "Be", nameAr: "بريليوم", nameEn: "Beryllium", en: 1.57, group: 2, period: 2 },
  { symbol: "B", nameAr: "بورون", nameEn: "Boron", en: 2.04, group: 13, period: 2 },
  { symbol: "C", nameAr: "كربون", nameEn: "Carbon", en: 2.55, group: 14, period: 2 },
  { symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", en: 3.04, group: 15, period: 2 },
  { symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", en: 3.44, group: 16, period: 2 },
  { symbol: "F", nameAr: "فلور", nameEn: "Fluorine", en: 3.98, group: 17, period: 2 },
  { symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", en: 0.93, group: 1, period: 3 },
  { symbol: "Mg", nameAr: "ماغنسيوم", nameEn: "Magnesium", en: 1.31, group: 2, period: 3 },
  { symbol: "Al", nameAr: "ألومنيوم", nameEn: "Aluminum", en: 1.61, group: 13, period: 3 },
  { symbol: "Si", nameAr: "سيليكون", nameEn: "Silicon", en: 1.90, group: 14, period: 3 },
  { symbol: "P", nameAr: "فوسفور", nameEn: "Phosphorus", en: 2.19, group: 15, period: 3 },
  { symbol: "S", nameAr: "كبريت", nameEn: "Sulfur", en: 2.58, group: 16, period: 3 },
  { symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", en: 3.16, group: 17, period: 3 },
  { symbol: "K", nameAr: "بوتاسيوم", nameEn: "Potassium", en: 0.82, group: 1, period: 4 },
  { symbol: "Ca", nameAr: "كالسيوم", nameEn: "Calcium", en: 1.00, group: 2, period: 4 },
  { symbol: "Br", nameAr: "بروم", nameEn: "Bromine", en: 2.96, group: 17, period: 4 },
  { symbol: "I", nameAr: "يود", nameEn: "Iodine", en: 2.66, group: 17, period: 5 },
];

export function ElectronegativitySimulator({ language }: ElectronegativitySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [element1, setElement1] = useState(elements[6]); // Oxygen
  const [element2, setElement2] = useState(elements[1]); // Lithium
  const [mode, setMode] = useState<"compare" | "scale" | "bonds">("compare");

  const texts = {
    ar: {
      title: "محاكي السالبية الكهربائية",
      description: "استكشف مفهوم السالبية الكهربائية وتأثيرها على الروابط الكيميائية",
      compare: "مقارنة العناصر",
      scale: "مقياس باولنج",
      bonds: "الروابط الكيميائية",
      selectElement1: "العنصر الأول",
      selectElement2: "العنصر الثاني",
      electronegativity: "السالبية الكهربائية",
      difference: "الفرق",
      bondType: "نوع الرابطة",
      ionic: "أيونية",
      polarCovalent: "تساهمية قطبية",
      nonpolarCovalent: "تساهمية غير قطبية",
      electronTransfer: "انتقال الإلكترون",
      partialCharges: "الشحنات الجزئية",
      explanation: "التفسير",
      ionicExp: "عندما يكون الفرق أكبر من 1.7، تنتقل الإلكترونات من العنصر الأقل سالبية إلى الأعلى، وتتكون أيونات.",
      polarExp: "عندما يكون الفرق بين 0.4 و 1.7، تنجذب الإلكترونات نحو العنصر الأكثر سالبية، وتتكون شحنات جزئية.",
      nonpolarExp: "عندما يكون الفرق أقل من 0.4، تتشارك الذرتان الإلكترونات بشكل متساوٍ تقريباً.",
      trend: "الاتجاه في الجدول الدوري",
      trendExp: "السالبية الكهربائية تزداد عبر الدورة (من اليسار لليمين) وتقل أسفل المجموعة (من أعلى لأسفل). الفلور هو الأعلى سالبية (3.98).",
      paulingScale: "مقياس باولنج",
      paulingExp: "مقياس باولنج هو الأكثر شيوعاً، يتراوح من 0.7 (الفرنسيوم) إلى 3.98 (الفلور). كلما زادت القيمة، زادت قدرة الذرة على جذب الإلكترونات.",
    },
    en: {
      title: "Electronegativity Simulator",
      description: "Explore electronegativity and its effect on chemical bonds",
      compare: "Compare Elements",
      scale: "Pauling Scale",
      bonds: "Chemical Bonds",
      selectElement1: "First Element",
      selectElement2: "Second Element",
      electronegativity: "Electronegativity",
      difference: "Difference",
      bondType: "Bond Type",
      ionic: "Ionic",
      polarCovalent: "Polar Covalent",
      nonpolarCovalent: "Nonpolar Covalent",
      electronTransfer: "Electron Transfer",
      partialCharges: "Partial Charges",
      explanation: "Explanation",
      ionicExp: "When the difference is greater than 1.7, electrons transfer from the less electronegative element to the more electronegative one, forming ions.",
      polarExp: "When the difference is between 0.4 and 1.7, electrons are attracted toward the more electronegative element, creating partial charges.",
      nonpolarExp: "When the difference is less than 0.4, the atoms share electrons almost equally.",
      trend: "Periodic Table Trend",
      trendExp: "Electronegativity increases across a period (left to right) and decreases down a group (top to bottom). Fluorine has the highest electronegativity (3.98).",
      paulingScale: "Pauling Scale",
      paulingExp: "The Pauling scale is the most common, ranging from 0.7 (Francium) to 3.98 (Fluorine). Higher values indicate greater ability to attract electrons.",
    },
  };

  const t = texts[language];

  // Calculate bond properties
  const enDifference = Math.abs(element1.en - element2.en);
  
  const getBondType = (diff: number) => {
    if (diff >= 1.7) return { type: "ionic", name: t.ionic, color: "#ef4444" };
    if (diff >= 0.4) return { type: "polar", name: t.polarCovalent, color: "#f59e0b" };
    return { type: "nonpolar", name: t.nonpolarCovalent, color: "#10b981" };
  };

  const bondInfo = getBondType(enDifference);

  // Determine which element is more electronegative
  const moreEN = element1.en > element2.en ? element1 : element2;
  const lessEN = element1.en > element2.en ? element2 : element1;

  // Draw visualization
  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#faf5ff");
    bgGradient.addColorStop(1, "#f3e8ff");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    if (mode === "compare" || mode === "bonds") {
      // Draw two atoms
      const atom1X = centerX - 120;
      const atom2X = centerX + 120;
      const atomY = centerY;

      // Atom 1 (less electronegative)
      const radius1 = 60;
      const gradient1 = ctx.createRadialGradient(atom1X - 10, atomY - 10, 0, atom1X, atomY, radius1);
      gradient1.addColorStop(0, "#fde68a");
      gradient1.addColorStop(1, "#f59e0b");
      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.arc(atom1X, atomY, radius1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Atom 1 label
      ctx.fillStyle = "#78350f";
      ctx.font = "bold 28px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(element1.symbol, atom1X, atomY + 10);
      ctx.font = "12px system-ui";
      ctx.fillText(`EN: ${element1.en.toFixed(2)}`, atom1X, atomY + 40);

      // Atom 2 (more electronegative)
      const radius2 = 60;
      const gradient2 = ctx.createRadialGradient(atom2X - 10, atomY - 10, 0, atom2X, atomY, radius2);
      gradient2.addColorStop(0, "#93c5fd");
      gradient2.addColorStop(1, "#3b82f6");
      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.arc(atom2X, atomY, radius2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Atom 2 label
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "bold 28px system-ui";
      ctx.fillText(element2.symbol, atom2X, atomY + 10);
      ctx.font = "12px system-ui";
      ctx.fillText(`EN: ${element2.en.toFixed(2)}`, atom2X, atomY + 40);

      // Draw bond
      ctx.strokeStyle = bondInfo.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(atom1X + radius1 + 5, atomY);
      ctx.lineTo(atom2X - radius2 - 5, atomY);
      ctx.stroke();

      // Draw bond type label
      ctx.fillStyle = bondInfo.color;
      ctx.font = "bold 14px system-ui";
      ctx.fillText(bondInfo.name, centerX, atomY - 80);

      // Draw EN difference
      ctx.fillStyle = "#64748b";
      ctx.font = "12px system-ui";
      ctx.fillText(`ΔEN = ${enDifference.toFixed(2)}`, centerX, atomY + 80);

      // Draw electrons or charges based on bond type
      if (bondInfo.type === "ionic") {
        // Show electron transfer
        const electronX = atom1X + 100;
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(electronX, atomY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(electronX - 4, atomY);
        ctx.lineTo(electronX + 4, atomY);
        ctx.stroke();

        // Arrow
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(atom1X + 80, atomY);
        ctx.lineTo(atom1X + 130, atomY);
        ctx.lineTo(atom1X + 120, atomY - 5);
        ctx.moveTo(atom1X + 130, atomY);
        ctx.lineTo(atom1X + 120, atomY + 5);
        ctx.stroke();

        // Charges
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 16px system-ui";
        ctx.fillText("+", atom1X, atomY - radius1 - 10);
        ctx.fillText("-", atom2X, atomY - radius2 - 10);
      } else if (bondInfo.type === "polar") {
        // Show partial charges
        ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
        ctx.font = "bold 16px system-ui";
        ctx.fillText("δ+", atom1X, atomY - radius1 - 10);
        
        ctx.fillStyle = "rgba(59, 130, 246, 0.7)";
        ctx.fillText("δ-", atom2X, atomY - radius2 - 10);

        // Electron cloud skewed towards more EN
        ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
        ctx.beginPath();
        ctx.ellipse(centerX + 30, atomY, 150, 40, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Nonpolar - symmetric electron cloud
        ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
        ctx.beginPath();
        ctx.ellipse(centerX, atomY, 200, 40, 0, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (mode === "scale") {
      // Draw Pauling scale
      const scaleX = 80;
      const scaleY = 80;
      const scaleWidth = width - 160;
      const scaleHeight = 30;

      // Scale background
      const scaleGradient = ctx.createLinearGradient(scaleX, 0, scaleX + scaleWidth, 0);
      scaleGradient.addColorStop(0, "#fef08a");
      scaleGradient.addColorStop(0.3, "#fbbf24");
      scaleGradient.addColorStop(0.5, "#fb923c");
      scaleGradient.addColorStop(0.7, "#f87171");
      scaleGradient.addColorStop(1, "#ef4444");
      
      ctx.fillStyle = scaleGradient;
      ctx.fillRect(scaleX, scaleY, scaleWidth, scaleHeight);

      // Scale border
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 2;
      ctx.strokeRect(scaleX, scaleY, scaleWidth, scaleHeight);

      // Scale labels
      ctx.fillStyle = "#374151";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      
      for (let i = 0; i <= 4; i++) {
        const x = scaleX + (i / 4) * scaleWidth;
        ctx.fillText(i.toString(), x, scaleY + scaleHeight + 20);
        ctx.beginPath();
        ctx.moveTo(x, scaleY + scaleHeight);
        ctx.lineTo(x, scaleY + scaleHeight + 5);
        ctx.stroke();
      }

      // Plot elements
      elements.forEach((el, i) => {
        const x = scaleX + (el.en / 4) * scaleWidth;
        const y = scaleY + scaleHeight + 50 + (i % 6) * 25;

        // Marker on scale
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(x, scaleY + scaleHeight);
        ctx.lineTo(x - 3, scaleY + scaleHeight + 10);
        ctx.lineTo(x + 3, scaleY + scaleHeight + 10);
        ctx.closePath();
        ctx.fill();

        // Element label
        ctx.fillStyle = "#374151";
        ctx.font = "11px system-ui";
        ctx.textAlign = language === "ar" ? "right" : "left";
        const labelX = language === "ar" ? scaleX + scaleWidth + 10 : scaleX - 10;
        ctx.fillText(`${el.symbol} (${el.en})`, x, y);
      });

      // Highlight selected elements
      [element1, element2].forEach((el) => {
        const x = scaleX + (el.en / 4) * scaleWidth;
        ctx.strokeStyle = el === element1 ? "#ef4444" : "#3b82f6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, scaleY + scaleHeight / 2, 10, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

  }, [element1, element2, enDifference, bondInfo, mode, language]);

  // Draw
  useEffect(() => {
    drawVisualization();
  }, [drawVisualization]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Mode selector */}
        <div className="flex gap-2">
          <Button
            variant={mode === "compare" ? "default" : "outline"}
            onClick={() => setMode("compare")}
            className={mode === "compare" ? "bg-violet-500 hover:bg-violet-600" : ""}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {t.compare}
          </Button>
          <Button
            variant={mode === "scale" ? "default" : "outline"}
            onClick={() => setMode("scale")}
            className={mode === "scale" ? "bg-violet-500 hover:bg-violet-600" : ""}
          >
            <Scale className="w-4 h-4 mr-2" />
            {t.scale}
          </Button>
          <Button
            variant={mode === "bonds" ? "default" : "outline"}
            onClick={() => setMode("bonds")}
            className={mode === "bonds" ? "bg-violet-500 hover:bg-violet-600" : ""}
          >
            <Atom className="w-4 h-4 mr-2" />
            {t.bonds}
          </Button>
        </div>

        {/* Element selectors (for compare and bonds modes) */}
        {(mode === "compare" || mode === "bonds") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-medium">{t.selectElement1}</label>
              <div className="flex flex-wrap gap-2">
                {elements.slice(0, 10).map((el) => (
                  <Button
                    key={el.symbol}
                    variant={element1.symbol === el.symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setElement1(el)}
                    className={element1.symbol === el.symbol ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    {el.symbol}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium">{t.selectElement2}</label>
              <div className="flex flex-wrap gap-2">
                {elements.slice(0, 10).map((el) => (
                  <Button
                    key={el.symbol}
                    variant={element2.symbol === el.symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setElement2(el)}
                    className={element2.symbol === el.symbol ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    {el.symbol}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={600} height={300} className="w-full" />
        </div>

        {/* Results (for compare and bonds modes) */}
        {(mode === "compare" || mode === "bonds") && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{element1.symbol}</p>
              <p className="font-bold text-lg text-amber-600">{element1.en.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{element2.symbol}</p>
              <p className="font-bold text-lg text-blue-600">{element2.en.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{t.difference}</p>
              <p className="font-bold text-lg text-purple-600">Δ = {enDifference.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${bondInfo.color}20` }}>
              <p className="text-xs text-slate-500">{t.bondType}</p>
              <p className="font-bold text-lg" style={{ color: bondInfo.color }}>{bondInfo.name}</p>
            </div>
          </div>
        )}

        {/* Bond type scale */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-medium mb-3">{t.bondType}</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-8 rounded-lg overflow-hidden flex">
              <div className="flex-1 bg-green-500 flex items-center justify-center text-white text-xs font-medium">
                {t.nonpolarCovalent}
              </div>
              <div className="flex-1 bg-amber-500 flex items-center justify-center text-white text-xs font-medium">
                {t.polarCovalent}
              </div>
              <div className="flex-1 bg-red-500 flex items-center justify-center text-white text-xs font-medium">
                {t.ionic}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500">
            <span>0</span>
            <span>0.4</span>
            <span>1.7</span>
            <span>4.0</span>
          </div>
          {enDifference > 0 && (
            <div className="relative mt-2">
              <div
                className="absolute w-3 h-3 bg-slate-800 rounded-full transform -translate-x-1/2"
                style={{ left: `${(enDifference / 4) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-lg border-2 border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950">
          <h4 className="font-bold mb-2 text-violet-700 dark:text-violet-300">{t.explanation}</h4>
          {bondInfo.type === "ionic" && <p className="text-sm text-violet-600 dark:text-violet-400">{t.ionicExp}</p>}
          {bondInfo.type === "polar" && <p className="text-sm text-violet-600 dark:text-violet-400">{t.polarExp}</p>}
          {bondInfo.type === "nonpolar" && <p className="text-sm text-violet-600 dark:text-violet-400">{t.nonpolarExp}</p>}
        </div>

        {/* Trend explanation */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-violet-500" />
            {t.trend}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.trendExp}</p>
        </div>

        {/* Pauling scale info */}
        {mode === "scale" && (
          <div className="p-4 rounded-lg bg-violet-100 dark:bg-violet-900">
            <h4 className="font-bold mb-2 text-violet-700 dark:text-violet-300">{t.paulingScale}</h4>
            <p className="text-sm text-violet-600 dark:text-violet-400">{t.paulingExp}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
