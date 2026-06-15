"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, RotateCw, Box, Info } from "lucide-react";

interface CrossProductSimulatorProps {
  language: "ar" | "en";
}

export function CrossProductSimulator({ language }: CrossProductSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for Vector A (in X-Y plane)
  const [vectorAx, setVectorAx] = useState(100);
  const [vectorAy, setVectorAy] = useState(50);

  // State for Vector B (in X-Y plane)
  const [vectorBx, setVectorBx] = useState(50);
  const [vectorBy, setVectorBy] = useState(100);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي حاصل الضرب المتجهي",
      description: "استكشف الضرب الاتجاهي للمتجهات (Cross Product)",
      vectorA: "المتجه أ",
      vectorB: "المتجه ب",
      vectorC: "حاصل الضرب المتجهي (أ × ب)",
      xComponent: "المركبة السينية",
      yComponent: "المركبة الصادية",
      zComponent: "المركبة العينية",
      magnitude: "المقدار",
      angle: "الزاوية",
      angleBetween: "الزاوية بين المتجهين",
      crossProductMagnitude: "مقدار حاصل الضرب",
      crossProductDirection: "اتجاه حاصل الضرب",
      formula1: "|أ × ب| = |أ| |ب| sin(θ)",
      formula2: "أ × ب = (أص×بع - أع×بص) كـ + (أع×بس - أس×بع) صـ + (أس×بص - أص×بس) عـ",
      parallelogramArea: "مساحة متوازي الأضلاع",
      triangleArea: "مساحة المثلث",
      rightHandRule: "قاعدة اليد اليمنى",
      rightHandRuleDesc: "الأصابع من أ إلى ب، الإبهام يشير لاتجاه أ × ب",
      perpendicular: "متعامد على المستوى",
      outOfPage: "خارج الصفحة (موجب)",
      intoPage: "داخل الصفحة (سالب)",
      parallel: "متوازيان (حاصل الضرب = صفر)",
      reset: "إعادة",
      degrees: "درجة",
      determinant: "المحددة",
      interpretation: "التفسير الهندسي",
    },
    en: {
      title: "Cross Product Simulator",
      description: "Explore vector cross product operations",
      vectorA: "Vector A",
      vectorB: "Vector B",
      vectorC: "Cross Product (A × B)",
      xComponent: "X Component",
      yComponent: "Y Component",
      zComponent: "Z Component",
      magnitude: "Magnitude",
      angle: "Angle",
      angleBetween: "Angle Between Vectors",
      crossProductMagnitude: "Cross Product Magnitude",
      crossProductDirection: "Cross Product Direction",
      formula1: "|A × B| = |A| |B| sin(θ)",
      formula2: "A × B = (AyBz-AzBy)i + (AzBx-AxBz)j + (AxBy-AyBx)k",
      parallelogramArea: "Parallelogram Area",
      triangleArea: "Triangle Area",
      rightHandRule: "Right Hand Rule",
      rightHandRuleDesc: "Fingers from A to B, thumb points to A × B direction",
      perpendicular: "Perpendicular to plane",
      outOfPage: "Out of page (positive)",
      intoPage: "Into page (negative)",
      parallel: "Parallel (cross product = 0)",
      reset: "Reset",
      degrees: "degrees",
      determinant: "Determinant",
      interpretation: "Geometric Interpretation",
    },
  };

  const t = texts[language];

  // Calculate vector magnitudes
  const magA = Math.sqrt(vectorAx * vectorAx + vectorAy * vectorAy);
  const magB = Math.sqrt(vectorBx * vectorBx + vectorBy * vectorBy);

  // Calculate angle between vectors
  const dotProduct2D = vectorAx * vectorBx + vectorAy * vectorBy;
  const angleBetween = Math.acos(dotProduct2D / (magA * magB)) * (180 / Math.PI);

  // Calculate cross product (in 2D, result is along Z-axis)
  // A × B = Ax*By - Ay*Bx (Z-component)
  const crossProductZ = vectorAx * vectorBy - vectorAy * vectorBx;
  const crossProductMagnitude = Math.abs(crossProductZ);

  // Determine direction
  const direction = crossProductZ > 0 ? t.outOfPage : crossProductZ < 0 ? t.intoPage : t.parallel;
  const directionIcon = crossProductZ > 0 ? "⊙" : crossProductZ < 0 ? "⊗" : "○";

  // Calculate areas
  const parallelogramArea = crossProductMagnitude;
  const triangleArea = parallelogramArea / 2;

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw parallelogram
    ctx.fillStyle = "#8b5cf620";
    ctx.strokeStyle = "#8b5cf660";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + vectorAx, originY - vectorAy);
    ctx.lineTo(originX + vectorAx + vectorBx, originY - vectorAy - vectorBy);
    ctx.lineTo(originX + vectorBx, originY - vectorBy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw triangle (half of parallelogram)
    ctx.fillStyle = "#f59e0b40";
    ctx.strokeStyle = "#f59e0b80";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + vectorAx, originY - vectorAy);
    ctx.lineTo(originX + vectorBx, originY - vectorBy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw angle arc between vectors
    const angleStart = Math.atan2(vectorAy, vectorAx);
    const angleEnd = Math.atan2(vectorBy, vectorBx);

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(originX, originY, 30, -angleStart, -angleEnd, angleStart > angleEnd);
    ctx.stroke();

    // Draw angle label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    const midAngle = (angleStart + angleEnd) / 2;
    ctx.fillText(`θ`, originX + 45 * Math.cos(-midAngle), originY + 45 * Math.sin(-midAngle));

    // Draw Vector A
    const endAx = originX + vectorAx;
    const endAy = originY - vectorAy;
    const angleRadA = Math.atan2(-vectorAy, vectorAx);

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(endAx, endAy);
    ctx.stroke();

    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(endAx, endAy);
    ctx.lineTo(endAx - 12 * Math.cos(angleRadA - Math.PI / 6), endAy - 12 * Math.sin(angleRadA - Math.PI / 6));
    ctx.lineTo(endAx - 12 * Math.cos(angleRadA + Math.PI / 6), endAy - 12 * Math.sin(angleRadA + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 16px system-ui";
    ctx.fillText("A", endAx + 15, endAy - 10);

    // Draw Vector B
    const endBx = originX + vectorBx;
    const endBy = originY - vectorBy;
    const angleRadB = Math.atan2(-vectorBy, vectorBx);

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(endBx, endBy);
    ctx.stroke();

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(endBx, endBy);
    ctx.lineTo(endBx - 12 * Math.cos(angleRadB - Math.PI / 6), endBy - 12 * Math.sin(angleRadB - Math.PI / 6));
    ctx.lineTo(endBx - 12 * Math.cos(angleRadB + Math.PI / 6), endBy - 12 * Math.sin(angleRadB + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 16px system-ui";
    ctx.fillText("B", endBx + 15, endBy - 10);

    // Draw cross product direction indicator at origin
    const indicatorSize = 20;
    ctx.fillStyle = "#8b5cf6";
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;

    if (crossProductZ !== 0) {
      ctx.beginPath();
      ctx.arc(originX, originY, indicatorSize, 0, Math.PI * 2);
      ctx.stroke();

      if (crossProductZ > 0) {
        // Out of page - draw dot
        ctx.beginPath();
        ctx.arc(originX, originY, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Into page - draw X
        ctx.beginPath();
        ctx.moveTo(originX - 8, originY - 8);
        ctx.lineTo(originX + 8, originY + 8);
        ctx.moveTo(originX + 8, originY - 8);
        ctx.lineTo(originX - 8, originY + 8);
        ctx.stroke();
      }

      // Draw C label
      ctx.font = "bold 14px system-ui";
      ctx.fillText("A×B", originX, originY + 35);
    }

    // Draw origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(originX, originY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [vectorAx, vectorAy, vectorBx, vectorBy, crossProductZ]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setVectorAx(100);
    setVectorAy(50);
    setVectorBx(50);
    setVectorBy(100);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <RotateCw className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Vector A Controls */}
        <div className="p-4 border rounded-lg border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-blue-500">{t.vectorA}</Badge>
            <span className="text-sm text-slate-500">({vectorAx}, {vectorAy}, 0)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.xComponent}</label>
                <Badge variant="outline">{vectorAx}</Badge>
              </div>
              <Slider
                value={[vectorAx]}
                onValueChange={([value]) => setVectorAx(value)}
                min={-150}
                max={150}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.yComponent}</label>
                <Badge variant="outline">{vectorAy}</Badge>
              </div>
              <Slider
                value={[vectorAy]}
                onValueChange={([value]) => setVectorAy(value)}
                min={-150}
                max={150}
                step={5}
              />
            </div>
          </div>
        </div>

        {/* Vector B Controls */}
        <div className="p-4 border rounded-lg border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/50">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-emerald-500">{t.vectorB}</Badge>
            <span className="text-sm text-slate-500">({vectorBx}, {vectorBy}, 0)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.xComponent}</label>
                <Badge variant="outline">{vectorBx}</Badge>
              </div>
              <Slider
                value={[vectorBx]}
                onValueChange={([value]) => setVectorBx(value)}
                min={-150}
                max={150}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.yComponent}</label>
                <Badge variant="outline">{vectorBy}</Badge>
              </div>
              <Slider
                value={[vectorBy]}
                onValueChange={([value]) => setVectorBy(value)}
                min={-150}
                max={150}
                step={5}
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={350} className="w-full" />
        </div>

        {/* Cross Product Result */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">{t.vectorC}</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{directionIcon}</span>
              <Badge className="bg-purple-500 text-lg px-4 py-1">
                {crossProductZ > 0 ? "+" : crossProductZ < 0 ? "-" : "0"} {t.zComponent}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">{t.crossProductMagnitude}</p>
              <p className="font-bold text-lg">{crossProductMagnitude.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-500">{t.angleBetween}</p>
              <p className="font-bold text-lg">{angleBetween.toFixed(1)}°</p>
            </div>
            <div>
              <p className="text-slate-500">{t.parallelogramArea}</p>
              <p className="font-bold text-lg">{parallelogramArea.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-500">{t.triangleArea}</p>
              <p className="font-bold text-lg">{triangleArea.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Direction Info */}
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <RotateCw className="w-4 h-4" />
            {t.rightHandRule}
          </h3>
          <p className="text-sm text-slate-600">{t.rightHandRuleDesc}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">⊙</span>
              <span>{t.outOfPage}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⊗</span>
              <span>{t.intoPage}</span>
            </div>
          </div>
        </div>

        {/* Formulas */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t.interpretation}
          </h3>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">{t.determinant}</p>
            <div className="font-mono text-sm">
              <p>A × B = | i    j    k |</p>
              <p className="mr-6">| {vectorAx}  {vectorAy}   0 |</p>
              <p className="mr-6">| {vectorBx}  {vectorBy}   0 |</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.formula1}</code>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
            <p className="text-sm font-medium text-blue-700">{t.vectorA}</p>
            <p className="text-xs text-slate-500">|A| = {magA.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
            <p className="text-sm font-medium text-emerald-700">{t.vectorB}</p>
            <p className="text-xs text-slate-500">|B| = {magB.toFixed(1)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
