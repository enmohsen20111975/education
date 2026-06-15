"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, CircleDot, Info } from "lucide-react";

interface DotProductSimulatorProps {
  language: "ar" | "en";
}

export function DotProductSimulator({ language }: DotProductSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for Vector A
  const [vectorAx, setVectorAx] = useState(100);
  const [vectorAy, setVectorAy] = useState(60);

  // State for Vector B
  const [vectorBx, setVectorBx] = useState(60);
  const [vectorBy, setVectorBy] = useState(100);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي حاصل الضرب الاتجاهي",
      description: "استكشف الضرب النقطي للمتجهات (Dot Product)",
      vectorA: "المتجه أ",
      vectorB: "المتجه ب",
      xComponent: "المركبة السينية",
      yComponent: "المركبة الصادية",
      magnitude: "المقدار",
      angle: "الزاوية",
      angleBetween: "الزاوية بين المتجهين",
      dotProduct: "حاصل الضرب النقطي",
      formula1: "أ · ب = |أ| |ب| cos(θ)",
      formula2: "أ · ب = أس × بس + أص × بص",
      projection: "الإسقاط",
      projectionOfA: "إسقاط أ على ب",
      projectionOfB: "إسقاط ب على أ",
      perpendicular: "متعامدان",
      acute: "زاوية حادة",
      obtuse: "زاوية منفرجة",
      parallel: "متوازيان",
      antiparallel: "متضادان",
      result: "النتيجة",
      geometricInterpretation: "التفسير الهندسي",
      showProjection: "إظهار الإسقاط",
      hideProjection: "إخفاء الإسقاط",
      reset: "إعادة",
      degrees: "درجة",
      positive: "موجب",
      negative: "سالب",
      zero: "صفر",
    },
    en: {
      title: "Dot Product Simulator",
      description: "Explore vector dot product operations",
      vectorA: "Vector A",
      vectorB: "Vector B",
      xComponent: "X Component",
      yComponent: "Y Component",
      magnitude: "Magnitude",
      angle: "Angle",
      angleBetween: "Angle Between Vectors",
      dotProduct: "Dot Product",
      formula1: "A · B = |A| |B| cos(θ)",
      formula2: "A · B = Ax × Bx + Ay × By",
      projection: "Projection",
      projectionOfA: "Projection of A on B",
      projectionOfB: "Projection of B on A",
      perpendicular: "Perpendicular",
      acute: "Acute Angle",
      obtuse: "Obtuse Angle",
      parallel: "Parallel",
      antiparallel: "Antiparallel",
      result: "Result",
      geometricInterpretation: "Geometric Interpretation",
      showProjection: "Show Projection",
      hideProjection: "Hide Projection",
      reset: "Reset",
      degrees: "degrees",
      positive: "Positive",
      negative: "Negative",
      zero: "Zero",
    },
  };

  const t = texts[language];

  // Calculate vector properties
  const magA = Math.sqrt(vectorAx * vectorAx + vectorAy * vectorAy);
  const magB = Math.sqrt(vectorBx * vectorBx + vectorBy * vectorBy);
  const angleA = Math.atan2(vectorAy, vectorAx) * (180 / Math.PI);
  const angleB = Math.atan2(vectorBy, vectorBx) * (180 / Math.PI);

  // Calculate angle between vectors
  const angleBetween = Math.acos(
    (vectorAx * vectorBx + vectorAy * vectorBy) / (magA * magB)
  ) * (180 / Math.PI);

  // Calculate dot product
  const dotProduct = vectorAx * vectorBx + vectorAy * vectorBy;

  // Calculate projections
  const projectionAOnB = dotProduct / magB;
  const projectionBOnA = dotProduct / magA;

  // Determine relationship
  const getRelationship = () => {
    if (Math.abs(angleBetween - 90) < 1) return { type: t.perpendicular, color: "#f59e0b" };
    if (Math.abs(angleBetween) < 1 || Math.abs(angleBetween - 180) < 1) {
      return dotProduct > 0 ? { type: t.parallel, color: "#22c55e" } : { type: t.antiparallel, color: "#ef4444" };
    }
    return angleBetween < 90 ? { type: t.acute, color: "#3b82f6" } : { type: t.obtuse, color: "#ec4899" };
  };

  const relationship = getRelationship();

  // State for showing projection
  const [showProjection, setShowProjection] = useState(true);

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

    // Draw angle arc between vectors
    const angleStart = Math.atan2(vectorAy, vectorAx);
    const angleEnd = Math.atan2(vectorBy, vectorBx);

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(originX, originY, 40, -angleStart, -angleEnd, angleStart > angleEnd);
    ctx.stroke();

    // Draw angle label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    const midAngle = (angleStart + angleEnd) / 2;
    ctx.fillText(`${angleBetween.toFixed(1)}°`, originX + 55 * Math.cos(-midAngle), originY + 55 * Math.sin(-midAngle));

    // Draw projection if enabled
    if (showProjection) {
      // Projection of A on B
      const projScale = projectionAOnB / magB;
      ctx.strokeStyle = "#3b82f640";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Draw projection line from tip of A perpendicular to B
      const tipAx = originX + vectorAx;
      const tipAy = originY - vectorAy;
      const projPointX = originX + projScale * vectorBx;
      const projPointY = originY - projScale * vectorBy;

      ctx.beginPath();
      ctx.moveTo(tipAx, tipAy);
      ctx.lineTo(projPointX, projPointY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw projected segment
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(projPointX, projPointY);
      ctx.stroke();
    }

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

    // Arrow head for A
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(endAx, endAy);
    ctx.lineTo(endAx - 12 * Math.cos(angleRadA - Math.PI / 6), endAy - 12 * Math.sin(angleRadA - Math.PI / 6));
    ctx.lineTo(endAx - 12 * Math.cos(angleRadA + Math.PI / 6), endAy - 12 * Math.sin(angleRadA + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label A
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

    // Arrow head for B
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(endBx, endBy);
    ctx.lineTo(endBx - 12 * Math.cos(angleRadB - Math.PI / 6), endBy - 12 * Math.sin(angleRadB - Math.PI / 6));
    ctx.lineTo(endBx - 12 * Math.cos(angleRadB + Math.PI / 6), endBy - 12 * Math.sin(angleRadB + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label B
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 16px system-ui";
    ctx.fillText("B", endBx + 15, endBy - 10);

    // Draw origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(originX, originY, 5, 0, Math.PI * 2);
    ctx.fill();

  }, [vectorAx, vectorAy, vectorBx, vectorBy, angleBetween, showProjection, projectionAOnB, magB]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setVectorAx(100);
    setVectorAy(60);
    setVectorBx(60);
    setVectorBy(100);
    setShowProjection(true);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CircleDot className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Vector A Controls */}
        <div className="p-4 border rounded-lg border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-blue-500">{t.vectorA}</Badge>
            <span className="text-sm text-slate-500">({vectorAx}, {vectorAy})</span>
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
          <div className="mt-2 text-sm">
            |A| = <span className="font-bold">{magA.toFixed(1)}</span>, 
            θ = <span className="font-bold">{angleA.toFixed(1)}°</span>
          </div>
        </div>

        {/* Vector B Controls */}
        <div className="p-4 border rounded-lg border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/50">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-emerald-500">{t.vectorB}</Badge>
            <span className="text-sm text-slate-500">({vectorBx}, {vectorBy})</span>
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
          <div className="mt-2 text-sm">
            |B| = <span className="font-bold">{magB.toFixed(1)}</span>, 
            θ = <span className="font-bold">{angleB.toFixed(1)}°</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowProjection(!showProjection)}
          >
            {showProjection ? t.hideProjection : t.showProjection}
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

        {/* Dot Product Result */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">{t.dotProduct}</span>
            <Badge 
              className={`text-lg px-4 py-1 ${dotProduct > 0 ? "bg-emerald-500" : dotProduct < 0 ? "bg-red-500" : "bg-gray-500"}`}
            >
              {dotProduct.toFixed(1)}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">{t.angleBetween}</p>
              <p className="font-bold">{angleBetween.toFixed(1)}°</p>
            </div>
            <div>
              <p className="text-slate-500">{t.projectionOfA}</p>
              <p className="font-bold">{projectionAOnB.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-500">{t.projectionOfB}</p>
              <p className="font-bold">{projectionBOnA.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-500">{t.result}</p>
              <Badge style={{ backgroundColor: relationship.color, color: "white" }}>
                {relationship.type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Formulas */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t.geometricInterpretation}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Geometric</p>
              <code className="text-sm font-mono">{t.formula1}</code>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Algebraic</p>
              <code className="text-sm font-mono">{t.formula2}</code>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
          <h3 className="font-semibold mb-2">{t.geometricInterpretation}</h3>
          <ul className="text-sm space-y-1">
            <li>• {t.positive}: {t.acute} (&lt; 90°) - المتجهان في نفس الاتجاه العام</li>
            <li>• {t.zero}: {t.perpendicular} (= 90°) - المتجهان متعامدان</li>
            <li>• {t.negative}: {t.obtuse} (&gt; 90°) - المتجهان في اتجاهين متعاكسين</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
