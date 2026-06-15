"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { GitBranch, RotateCcw, Circle } from "lucide-react";

interface LineIntersectionSimulatorProps {
  language: "ar" | "en";
}

export function LineIntersectionSimulator({ language }: LineIntersectionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Line 1: y = m1x + b1
  const [m1, setM1] = useState(1);
  const [b1, setB1] = useState(2);

  // Line 2: y = m2x + b2
  const [m2, setM2] = useState(-0.5);
  const [b2, setB2] = useState(4);

  const [xRange, setXRange] = useState(10);
  const [showIntersection, setShowIntersection] = useState(true);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي تقاطع المستقيمات",
      description: "استكشف تقاطع خطين مستقيمين",
      line1: "الخط الأول",
      line2: "الخط الثاني",
      slope: "الميل (m)",
      intercept: "نقطة التقاطع (b)",
      intersection: "نقطة التقاطع",
      noIntersection: "لا يوجد تقاطع (خطان متوازيان)",
      sameLine: "نفس الخط",
      xCoordinate: "الإحداثي السيني",
      yCoordinate: "الإحداثي الصادي",
      equation: "المعادلة",
      reset: "إعادة",
      showIntersection: "إظهار نقطة التقاطع",
      interpretation: "التفسير الرياضي",
      parallel: "الخطين متوازيان",
      perpendicular: "الخطين متعامدان",
      angleBetween: "الزاوية بين الخطين",
      degrees: "درجة",
    },
    en: {
      title: "Line Intersection Simulator",
      description: "Explore the intersection of two lines",
      line1: "First Line",
      line2: "Second Line",
      slope: "Slope (m)",
      intercept: "Intercept (b)",
      intersection: "Intersection Point",
      noIntersection: "No intersection (parallel lines)",
      sameLine: "Same Line",
      xCoordinate: "X-coordinate",
      yCoordinate: "Y-coordinate",
      equation: "Equation",
      reset: "Reset",
      showIntersection: "Show Intersection",
      interpretation: "Mathematical Interpretation",
      parallel: "Lines are parallel",
      perpendicular: "Lines are perpendicular",
      angleBetween: "Angle between lines",
      degrees: "degrees",
    },
  };

  const t = texts[language];

  // Calculate intersection point
  const getIntersection = useCallback(() => {
    // y = m1x + b1
    // y = m2x + b2
    // m1x + b1 = m2x + b2
    // x(m1 - m2) = b2 - b1
    // x = (b2 - b1) / (m1 - m2)

    if (m1 === m2) {
      if (b1 === b2) {
        return { type: "same" as const };
      }
      return { type: "parallel" as const };
    }

    const x = (b2 - b1) / (m1 - m2);
    const y = m1 * x + b1;

    return { type: "intersection" as const, x, y };
  }, [m1, b1, m2, b2]);

  // Calculate angle between lines
  const getAngleBetweenLines = useCallback(() => {
    if (m1 === m2) return 0;
    const angle = Math.atan(Math.abs((m1 - m2) / (1 + m1 * m2)));
    return (angle * 180) / Math.PI;
  }, [m1, m2]);

  // Check if perpendicular
  const isPerpendicular = Math.abs(m1 * m2 + 1) < 0.01;

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = (width / 2 - 60) / xRange;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for (let x = -xRange; x <= xRange; x++) {
      const px = centerX + x * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      if (x !== 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${x}`, px, centerY + 15);
      }
    }

    for (let y = -xRange; y <= xRange; y++) {
      const py = centerY - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (y !== 0) {
        ctx.fillText(`${y}`, centerX - 15, py + 4);
      }
    }

    // Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText("x", width - 20, centerY - 10);
    ctx.fillText("y", centerX + 15, 20);

    // Draw Line 1 (blue)
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px += 1) {
      const x = (px - centerX) / scale;
      const y = m1 * x + b1;
      const py = centerY - y * scale;

      if (py > -1000 && py < height + 1000) {
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Line 2 (green)
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px += 1) {
      const x = (px - centerX) / scale;
      const y = m2 * x + b2;
      const py = centerY - y * scale;

      if (py > -1000 && py < height + 1000) {
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw intersection point
    const intersection = getIntersection();
    if (showIntersection && intersection.type === "intersection") {
      const px = centerX + intersection.x * scale;
      const py = centerY - intersection.y * scale;

      // Highlight circle
      ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.fill();

      // Point
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 14px system-ui";
      ctx.fillText(
        `(${intersection.x.toFixed(2)}, ${intersection.y.toFixed(2)})`,
        px + 15,
        py - 10
      );
    }

    // Legend
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(20, 20, 20, 4);
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.fillText(language === "ar" ? "الخط الأول" : "Line 1", 50, 25);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(20, 40, 20, 4);
    ctx.fillStyle = "#1e293b";
    ctx.fillText(language === "ar" ? "الخط الثاني" : "Line 2", 50, 45);

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [m1, b1, m2, b2, xRange, showIntersection, getIntersection, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setM1(1);
    setB1(2);
    setM2(-0.5);
    setB2(4);
    setXRange(10);
    setShowIntersection(true);
  };

  const intersection = getIntersection();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Line 1 Controls */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-4">
          <h3 className="font-bold text-blue-600 flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded" />
            {t.line1}: y = {m1}x + {b1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>{t.slope}</label>
                <Badge variant="secondary">{m1}</Badge>
              </div>
              <Slider value={[m1]} onValueChange={([v]) => setM1(v)} min={-5} max={5} step={0.1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>{t.intercept}</label>
                <Badge variant="secondary">{b1}</Badge>
              </div>
              <Slider value={[b1]} onValueChange={([v]) => setB1(v)} min={-10} max={10} step={0.5} />
            </div>
          </div>
        </div>

        {/* Line 2 Controls */}
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg space-y-4">
          <h3 className="font-bold text-green-600 flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500 rounded" />
            {t.line2}: y = {m2}x + {b2}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>{t.slope}</label>
                <Badge variant="secondary">{m2}</Badge>
              </div>
              <Slider value={[m2]} onValueChange={([v]) => setM2(v)} min={-5} max={5} step={0.1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>{t.intercept}</label>
                <Badge variant="secondary">{b2}</Badge>
              </div>
              <Slider value={[b2]} onValueChange={([v]) => setB2(v)} min={-10} max={10} step={0.5} />
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-4">
          <input type="checkbox" checked={showIntersection} onChange={(e) => setShowIntersection(e.target.checked)} />
          <label className="font-medium">{t.showIntersection}</label>
        </div>

        {/* Reset button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={400} className="w-full bg-white" />
        </div>

        {/* Intersection Result */}
        <div className={`p-4 rounded-lg ${
          intersection.type === "intersection" ? "bg-red-50 dark:bg-red-950" :
          intersection.type === "parallel" ? "bg-yellow-50 dark:bg-yellow-950" :
          "bg-gray-50 dark:bg-gray-950"
        }`}>
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Circle className="w-4 h-4" />
            {t.intersection}
          </h4>
          
          {intersection.type === "intersection" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">{t.xCoordinate}</p>
                <p className="text-2xl font-mono font-bold">{intersection.x.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.yCoordinate}</p>
                <p className="text-2xl font-mono font-bold">{intersection.y.toFixed(4)}</p>
              </div>
            </div>
          )}
          
          {intersection.type === "parallel" && (
            <p className="text-yellow-600">{t.noIntersection}</p>
          )}
          
          {intersection.type === "same" && (
            <p className="text-gray-600">{t.sameLine}</p>
          )}
        </div>

        {/* Mathematical Interpretation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg ${m1 === m2 ? "bg-yellow-100" : "bg-slate-100"}`}>
            <p className="text-sm text-slate-500">{t.parallel}?</p>
            <p className="font-bold">{m1 === m2 ? (language === "ar" ? "نعم" : "Yes") : (language === "ar" ? "لا" : "No")}</p>
          </div>
          
          <div className={`p-3 rounded-lg ${isPerpendicular ? "bg-green-100" : "bg-slate-100"}`}>
            <p className="text-sm text-slate-500">{t.perpendicular}?</p>
            <p className="font-bold">{isPerpendicular ? (language === "ar" ? "نعم" : "Yes") : (language === "ar" ? "لا" : "No")}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-slate-100">
            <p className="text-sm text-slate-500">{t.angleBetween}</p>
            <p className="font-bold">{getAngleBetweenLines().toFixed(2)}°</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
          <h4 className="font-bold mb-2">{t.interpretation}</h4>
          <p className="text-sm">
            {intersection.type === "intersection"
              ? (language === "ar"
                  ? `نقطة التقاطع هي الحل المشترك للمعادلتين. عند هذه النقطة، كلا الخطين لهما نفس قيم x و y.`
                  : `The intersection point is the common solution to both equations. At this point, both lines have the same x and y values.`)
              : intersection.type === "parallel"
              ? (language === "ar"
                  ? `الخطين متوازيان لأن لهما نفس الميل (${m1}) ولكن نقاط تقاطع مختلفة مع محور الصادات.`
                  : `The lines are parallel because they have the same slope (${m1}) but different y-intercepts.`)
              : (language === "ar"
                  ? `الخطين متطابقان - كل نقطة على الخط الأول هي أيضاً على الخط الثاني.`
                  : `The lines are identical - every point on the first line is also on the second line.`)
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
