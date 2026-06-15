"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RotateCcw, Move, Ruler } from "lucide-react";

interface LineGraphSimulatorProps {
  language: "ar" | "en";
}

export function LineGraphSimulator({ language }: LineGraphSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for y = mx + b
  const [slope, setSlope] = useState(2);
  const [yIntercept, setYIntercept] = useState(1);
  const [xRange, setXRange] = useState(10);
  const [showPoint, setShowPoint] = useState(false);
  const [selectedX, setSelectedX] = useState(2);
  const [showSlopeTriangle, setShowSlopeTriangle] = useState(true);

  // Text translations
  const texts = {
    ar: {
      title: "راسم الخط المستقيم",
      description: "استكشف معادلة الخط المستقيم y = mx + b",
      slope: "الميل (m)",
      yIntercept: "نقطة التقاطع مع محور الصادات (b)",
      equation: "المعادلة",
      rise: "الارتفاع",
      run: "الامتداد",
      slopeFormula: "الميل = الارتفاع / الامتداد",
      pointOnLine: "نقطة على الخط",
      xCoordinate: "الإحداثي السيني",
      yCoordinate: "الإحداثي الصادي",
      showPoint: "إظهار نقطة",
      showSlopeTriangle: "إظهار مثلث الميل",
      reset: "إعادة",
      slopeValue: "قيمة الميل",
      positive: "موجب - الخط صاعد",
      negative: "سالب - الخط هابط",
      zero: "صفر - خط أفقي",
      interpretation: "التفسير الرياضي",
      xValue: "قيمة س",
      yValue: "قيمة ص",
    },
    en: {
      title: "Line Graph Simulator",
      description: "Explore the linear equation y = mx + b",
      slope: "Slope (m)",
      yIntercept: "Y-intercept (b)",
      equation: "Equation",
      rise: "Rise",
      run: "Run",
      slopeFormula: "Slope = Rise / Run",
      pointOnLine: "Point on Line",
      xCoordinate: "X-coordinate",
      yCoordinate: "Y-coordinate",
      showPoint: "Show Point",
      showSlopeTriangle: "Show Slope Triangle",
      reset: "Reset",
      slopeValue: "Slope Value",
      positive: "Positive - Line goes up",
      negative: "Negative - Line goes down",
      zero: "Zero - Horizontal line",
      interpretation: "Mathematical Interpretation",
      xValue: "X Value",
      yValue: "Y Value",
    },
  };

  const t = texts[language];

  // Calculate y for given x
  const calculateY = (x: number) => slope * x + yIntercept;

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

    // Slope triangle
    if (showSlopeTriangle && slope !== 0) {
      const triangleX = selectedX > 0 ? 0 : 2;
      const run = Math.abs(2);
      const rise = slope * run;
      
      const startX = centerX + triangleX * scale;
      const startY = centerY - calculateY(triangleX) * scale;
      const endX = startX + run * scale;
      const endY = centerY - calculateY(triangleX + run) * scale;

      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Horizontal line (run)
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, startY);
      ctx.stroke();

      // Vertical line (rise)
      ctx.beginPath();
      ctx.moveTo(endX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(`run = ${run}`, (startX + endX) / 2, startY - 10);
      ctx.fillText(`rise = ${rise.toFixed(1)}`, endX + 10, (startY + endY) / 2);
    }

    // Draw the line
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px++) {
      const x = (px - centerX) / scale;
      const y = calculateY(x);
      const py = centerY - y * scale;

      if (py > -1000 && py < height + 1000) {
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Y-intercept point
    const yIntX = centerX;
    const yIntY = centerY - yIntercept * scale;
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(yIntX, yIntY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#22c55e";
    ctx.font = "12px system-ui";
    ctx.fillText(`(0, ${yIntercept})`, yIntX + 15, yIntY - 5);

    // Selected point
    if (showPoint) {
      const pointY = calculateY(selectedX);
      const px = centerX + selectedX * scale;
      const py = centerY - pointY * scale;

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(`(${selectedX}, ${pointY.toFixed(2)})`, px + 15, py - 5);

      // Dashed lines to axes
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, centerY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(centerX, py);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [slope, yIntercept, xRange, showPoint, selectedX, showSlopeTriangle]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setSlope(2);
    setYIntercept(1);
    setXRange(10);
    setShowPoint(false);
    setSelectedX(2);
    setShowSlopeTriangle(true);
  };

  // Get slope description
  const getSlopeDescription = () => {
    if (slope > 0) return t.positive;
    if (slope < 0) return t.negative;
    return t.zero;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-teal-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Equation Display */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
          <p className="text-3xl font-mono font-bold">
            <span className="text-slate-500">y = </span>
            <span className="text-teal-500">{slope}</span>
            <span className="text-slate-500">x + </span>
            <span className="text-emerald-500">{yIntercept}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.slope}</label>
              <Badge variant="secondary" className={slope > 0 ? "bg-green-100 text-green-700" : slope < 0 ? "bg-red-100 text-red-700" : ""}>
                {slope.toFixed(1)}
              </Badge>
            </div>
            <Slider value={[slope]} onValueChange={([v]) => setSlope(v)} min={-5} max={5} step={0.1} />
            <p className="text-sm text-slate-500">{getSlopeDescription()}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.yIntercept}</label>
              <Badge variant="secondary">{yIntercept}</Badge>
            </div>
            <Slider value={[yIntercept]} onValueChange={([v]) => setYIntercept(v)} min={-10} max={10} step={0.5} />
          </div>
        </div>

        {/* Point selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input type="checkbox" checked={showPoint} onChange={(e) => setShowPoint(e.target.checked)} />
            <label className="font-medium">{t.showPoint}</label>
          </div>
          
          {showPoint && (
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <label>{t.xCoordinate}</label>
                <Badge variant="secondary">{selectedX}</Badge>
              </div>
              <Slider value={[selectedX]} onValueChange={([v]) => setSelectedX(v)} min={-xRange} max={xRange} step={0.5} />
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <p className="font-mono">
                  {language === "ar" ? `عند س = ${selectedX}، ص = ${calculateY(selectedX).toFixed(2)}` : `When x = ${selectedX}, y = ${calculateY(selectedX).toFixed(2)}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Slope triangle toggle */}
        <div className="flex items-center gap-4">
          <input type="checkbox" checked={showSlopeTriangle} onChange={(e) => setShowSlopeTriangle(e.target.checked)} />
          <label className="font-medium">{t.showSlopeTriangle}</label>
        </div>

        {/* Range control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{language === "ar" ? "مدى الرسم" : "Graph Range"}</label>
            <Badge variant="secondary">±{xRange}</Badge>
          </div>
          <Slider value={[xRange]} onValueChange={([v]) => setXRange(v)} min={5} max={20} step={1} />
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

        {/* Slope Formula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <h4 className="font-bold mb-2">{t.slopeFormula}</h4>
            <div className="flex items-center gap-2 text-2xl font-mono">
              <span className="text-teal-500">m</span>
              <span>=</span>
              <span className="text-orange-500">{t.rise}</span>
              <span>/</span>
              <span className="text-blue-500">{t.run}</span>
              <span>=</span>
              <span className="font-bold">{slope.toFixed(1)}</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <h4 className="font-bold mb-2">{t.interpretation}</h4>
            <p className="text-sm">
              {language === "ar"
                ? `الخط يمر بنقطة (0، ${yIntercept}) على محور الصادات، ويميل بمقدار ${slope} وحدات رأسية لكل وحدة أفقية.`
                : `The line passes through (0, ${yIntercept}) on the y-axis and rises ${slope} vertical units for each horizontal unit.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
