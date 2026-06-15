"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Hexagon, Info } from "lucide-react";

interface PolygonsSimulatorProps {
  language: "ar" | "en";
}

const polygonNames: Record<string, { ar: string; en: string }> = {
  "3": { ar: "مثلث", en: "Triangle" },
  "4": { ar: "مربع / مستطيل", en: "Square/Rectangle" },
  "5": { ar: "خماسي", en: "Pentagon" },
  "6": { ar: "سداسي", en: "Hexagon" },
  "7": { ar: "سباعي", en: "Heptagon" },
  "8": { ar: "ثماني", en: "Octagon" },
  "9": { ar: "تساعي", en: "Nonagon" },
  "10": { ar: "عشاري", en: "Decagon" },
  "11": { ar: "أحادي عشر", en: "Hendecagon" },
  "12": { ar: "اثني عشري", en: "Dodecagon" },
};

export function PolygonsSimulator({ language }: PolygonsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [sides, setSides] = useState(6);
  const [showDiagonals, setShowDiagonals] = useState(false);
  const [showCenter, setShowCenter] = useState(true);
  const [sideLength, setSideLength] = useState(80);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المضلعات",
      description: "استكشف خصائص المضلعات المنتظمة",
      sides: "عدد الأضلاع",
      sideLength: "طول الضلع",
      perimeter: "المحيط",
      area: "المساحة",
      interiorAngle: "الزاوية الداخلية",
      exteriorAngle: "الزاوية الخارجية",
      diagonals: "عدد الأقطار",
      sumInterior: "مجموع الزوايا الداخلية",
      showDiagonals: "إظهار الأقطار",
      hideDiagonals: "إخفاء الأقطار",
      showCenter: "إظهار المركز",
      hideCenter: "إخفاء المركز",
      reset: "إعادة",
      polygonName: "اسم المضلع",
      formula: "المعادلات",
      areaFormula: "المساحة = ¼ × n × s² × cot(π/n)",
      perimeterFormula: "المحيط = n × s",
      interiorFormula: "الزاوية الداخلية = (n-2) × 180° / n",
      diagonalFormula: "عدد الأقطار = n × (n-3) / 2",
      regular: "منتظم",
      vertices: "الرؤوس",
    },
    en: {
      title: "Polygons Simulator",
      description: "Explore properties of regular polygons",
      sides: "Number of Sides",
      sideLength: "Side Length",
      perimeter: "Perimeter",
      area: "Area",
      interiorAngle: "Interior Angle",
      exteriorAngle: "Exterior Angle",
      diagonals: "Number of Diagonals",
      sumInterior: "Sum of Interior Angles",
      showDiagonals: "Show Diagonals",
      hideDiagonals: "Hide Diagonals",
      showCenter: "Show Center",
      hideCenter: "Hide Center",
      reset: "Reset",
      polygonName: "Polygon Name",
      formula: "Formulas",
      areaFormula: "Area = ¼ × n × s² × cot(π/n)",
      perimeterFormula: "Perimeter = n × s",
      interiorFormula: "Interior Angle = (n-2) × 180° / n",
      diagonalFormula: "Diagonals = n × (n-3) / 2",
      regular: "Regular",
      vertices: "Vertices",
    },
  };

  const t = texts[language];

  // Calculate polygon properties
  const interiorAngle = ((sides - 2) * 180) / sides;
  const exteriorAngle = 360 / sides;
  const sumInterior = (sides - 2) * 180;
  const numDiagonals = (sides * (sides - 3)) / 2;
  const perimeter = sides * sideLength;
  
  // Area of regular polygon: A = (n * s² * cot(π/n)) / 4
  const area = (sides * sideLength * sideLength) / (4 * Math.tan(Math.PI / sides));
  
  const apothem = sideLength / (2 * Math.tan(Math.PI / sides));
  const circumradius = sideLength / (2 * Math.sin(Math.PI / sides));

  // Get polygon color based on sides
  const getPolygonColor = () => {
    const colors: Record<number, string> = {
      3: "#ef4444",
      4: "#f59e0b",
      5: "#22c55e",
      6: "#3b82f6",
      7: "#8b5cf6",
      8: "#ec4899",
      9: "#06b6d4",
      10: "#84cc16",
      11: "#f97316",
      12: "#6366f1",
    };
    return colors[sides] || "#6366f1";
  };

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    const polygonColor = getPolygonColor();
    const radius = Math.min(sideLength * 2.5, 120);

    // Calculate vertices
    const vertices: { x: number; y: number }[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      vertices.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }

    // Draw diagonals if enabled
    if (showDiagonals && sides > 3) {
      ctx.strokeStyle = polygonColor + "40";
      ctx.lineWidth = 1;
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 2; j < vertices.length; j++) {
          if (i === 0 && j === vertices.length - 1) continue; // Skip adjacent
          ctx.beginPath();
          ctx.moveTo(vertices[i].x, vertices[i].y);
          ctx.lineTo(vertices[j].x, vertices[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw the polygon
    ctx.strokeStyle = polygonColor;
    ctx.lineWidth = 3;
    ctx.fillStyle = polygonColor + "20";
    ctx.beginPath();
    vertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw center point
    if (showCenter) {
      ctx.fillStyle = polygonColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw lines from center to vertices
      ctx.strokeStyle = polygonColor + "60";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      vertices.forEach((v) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Draw vertices
    vertices.forEach((v, i) => {
      ctx.fillStyle = polygonColor;
      ctx.beginPath();
      ctx.arc(v.x, v.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label vertices
      ctx.fillStyle = "#334155";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String.fromCharCode(65 + i), v.x, v.y - 12);
    });

    // Draw side length label
    if (sides >= 3) {
      const midX = (vertices[0].x + vertices[1].x) / 2;
      const midY = (vertices[0].y + vertices[1].y) / 2;
      ctx.fillStyle = "#64748b";
      ctx.font = "12px system-ui";
      ctx.fillText(`${sideLength}`, midX, midY + 20);
    }

  }, [sides, sideLength, showDiagonals, showCenter]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setSides(6);
    setSideLength(80);
    setShowDiagonals(false);
    setShowCenter(true);
  };

  const polygonName = polygonNames[sides.toString()] || { ar: `${sides} أضلاع`, en: `${sides}-gon` };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Hexagon className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-emerald-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Number of Sides */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.sides}</label>
            <Badge style={{ backgroundColor: getPolygonColor(), color: "white" }}>
              {sides}
            </Badge>
          </div>
          <Slider
            value={[sides]}
            onValueChange={([value]) => setSides(value)}
            min={3}
            max={12}
            step={1}
          />
        </div>

        {/* Side Length */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.sideLength}</label>
            <Badge variant="secondary">{sideLength}</Badge>
          </div>
          <Slider
            value={[sideLength]}
            onValueChange={([value]) => setSideLength(value)}
            min={40}
            max={120}
            step={5}
          />
        </div>

        {/* Polygon Name */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
          <span className="font-semibold">{t.polygonName}</span>
          <div className="flex items-center gap-2">
            <Badge style={{ backgroundColor: getPolygonColor(), color: "white" }}>
              {language === "ar" ? polygonName.ar : polygonName.en}
            </Badge>
            <Badge variant="outline">{t.regular}</Badge>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowDiagonals(!showDiagonals)}
          >
            {showDiagonals ? t.hideDiagonals : t.showDiagonals}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCenter(!showCenter)}
          >
            {showCenter ? t.hideCenter : t.showCenter}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={350} className="w-full" />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
            <p className="text-sm text-slate-500">{t.perimeter}</p>
            <p className="font-bold text-blue-600">{perimeter.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
            <p className="text-sm text-slate-500">{t.area}</p>
            <p className="font-bold text-emerald-600">{area.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
            <p className="text-sm text-slate-500">{t.interiorAngle}</p>
            <p className="font-bold text-purple-600">{interiorAngle.toFixed(1)}°</p>
          </div>
          <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950">
            <p className="text-sm text-slate-500">{t.exteriorAngle}</p>
            <p className="font-bold text-pink-600">{exteriorAngle.toFixed(1)}°</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
            <p className="text-sm text-slate-500">{t.sumInterior}</p>
            <p className="font-bold text-amber-600">{sumInterior}°</p>
          </div>
          <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950">
            <p className="text-sm text-slate-500">{t.diagonals}</p>
            <p className="font-bold text-cyan-600">{numDiagonals}</p>
          </div>
        </div>

        {/* Formulas */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t.formula}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.perimeterFormula}</code>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.areaFormula}</code>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.interiorFormula}</code>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.diagonalFormula}</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
