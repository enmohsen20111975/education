"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, LineChart, Waves } from "lucide-react";

interface TrigCurvesSimulatorProps {
  language: "ar" | "en";
}

type TrigFunction = "sin" | "cos" | "tan";

export function TrigCurvesSimulator({ language }: TrigCurvesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);
  const [verticalShift, setVerticalShift] = useState(0);
  const [selectedFunction, setSelectedFunction] = useState<TrigFunction>("sin");
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const animationRef = useRef<number | null>(null);

  // Text translations
  const texts = {
    ar: {
      title: "راسم المنحنيات المثلثية",
      description: "استكشف تأثير المعاملات على المنحنيات المثلثية",
      sin: "جيب (sin)",
      cos: "جيب تمام (cos)",
      tan: "ظل (tan)",
      amplitude: "السعة (a)",
      frequency: "التردد (b)",
      phase: "الإزاحة الأفقية (c)",
      verticalShift: "الإزاحة الرأسية (d)",
      formula: "المعادلة",
      period: "الدورة",
      max: "القيمة العظمى",
      min: "القيمة الدنيا",
      showGrid: "إظهار الشبكة",
      animation: "تشغيل الحركة",
      pause: "إيقاف",
      reset: "إعادة",
      explanation: "المعادلة: y = a · func(b·x + c) + d",
      periodValue: "الدورة = 2π/|b|",
    },
    en: {
      title: "Trigonometric Curves Grapher",
      description: "Explore the effect of parameters on trig curves",
      sin: "Sine (sin)",
      cos: "Cosine (cos)",
      tan: "Tangent (tan)",
      amplitude: "Amplitude (a)",
      frequency: "Frequency (b)",
      phase: "Phase Shift (c)",
      verticalShift: "Vertical Shift (d)",
      formula: "Formula",
      period: "Period",
      max: "Maximum",
      min: "Minimum",
      showGrid: "Show Grid",
      animation: "Play Animation",
      pause: "Pause",
      reset: "Reset",
      explanation: "Equation: y = a · func(b·x + c) + d",
      periodValue: "Period = 2π/|b|",
    },
  };

  const t = texts[language];

  // Calculate function value
  const calculateY = useCallback((x: number): number => {
    const adjustedX = frequency * x + phase;
    let baseValue: number;
    
    switch (selectedFunction) {
      case "sin":
        baseValue = Math.sin(adjustedX);
        break;
      case "cos":
        baseValue = Math.cos(adjustedX);
        break;
      case "tan":
        baseValue = Math.tan(adjustedX);
        break;
      default:
        baseValue = 0;
    }
    
    return amplitude * baseValue + verticalShift;
  }, [selectedFunction, amplitude, frequency, phase, verticalShift]);

  // Calculate period
  const period = Math.abs(frequency) > 0 ? (2 * Math.PI) / Math.abs(frequency) : Infinity;

  // Calculate max/min
  const maxValue = selectedFunction === "tan" ? Infinity : amplitude + verticalShift;
  const minValue = selectedFunction === "tan" ? -Infinity : -amplitude + verticalShift;

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
    const xRange = 4 * Math.PI;
    const xScale = width / xRange;
    const yRange = selectedFunction === "tan" ? 10 : 5;
    const yScale = (height / 2 - 40) / yRange;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    if (showGrid) {
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      
      // Vertical lines (at π intervals)
      for (let x = -xRange / 2; x <= xRange / 2; x += Math.PI) {
        const px = centerX + x * xScale;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = -yRange; y <= yRange; y++) {
        const py = centerY - y * yScale;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }
    }

    // Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("x", width - 15, centerY - 10);
    ctx.fillText("y", centerX + 15, 20);

    // π markers on x-axis
    ctx.font = "10px system-ui";
    const piLabels = ["-2π", "-π", "π", "2π"];
    const piPositions = [-2 * Math.PI, -Math.PI, Math.PI, 2 * Math.PI];
    
    piLabels.forEach((label, i) => {
      const px = centerX + piPositions[i] * xScale;
      if (px > 20 && px < width - 20) {
        ctx.fillText(label, px, centerY + 15);
      }
    });

    // Y axis labels
    for (let y = -yRange; y <= yRange; y++) {
      if (y !== 0) {
        const py = centerY - y * yScale;
        ctx.fillText(`${y}`, centerX - 15, py + 4);
      }
    }

    // Draw moving point indicator
    const movingX = animationTime % (2 * Math.PI) - Math.PI;
    const movingY = calculateY(movingX);
    const movingPx = centerX + movingX * xScale;
    const movingPy = centerY - movingY * yScale;

    // Draw curve
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isFirst = true;
    for (let px = 0; px <= width; px += 1) {
      const x = (px - centerX) / xScale;
      const y = calculateY(x);
      const py = centerY - y * yScale;

      // Skip if out of bounds or for tan discontinuities
      if (py < -100 || py > height + 100 || !isFinite(py)) {
        isFirst = true;
        continue;
      }

      if (isFirst) {
        ctx.moveTo(px, py);
        isFirst = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw moving point
    if (showAnimation && isFinite(movingY)) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(movingPx, movingPy, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Vertical line to axis
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(movingPx, movingPy);
      ctx.lineTo(movingPx, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [amplitude, frequency, phase, verticalShift, selectedFunction, showGrid, calculateY, animationTime, showAnimation]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation
  useEffect(() => {
    if (showAnimation) {
      const animate = () => {
        setAnimationTime((prev) => prev + 0.05);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showAnimation]);

  // Reset
  const handleReset = () => {
    setAmplitude(1);
    setFrequency(1);
    setPhase(0);
    setVerticalShift(0);
    setShowAnimation(false);
    setAnimationTime(0);
  };

  // Get formula string
  const getFormula = () => {
    const func = selectedFunction;
    const aStr = amplitude === 1 ? "" : amplitude === -1 ? "-" : `${amplitude}`;
    const bStr = frequency === 1 ? "" : `${frequency}·`;
    const cSign = phase >= 0 ? "+" : "";
    const cStr = phase === 0 ? "" : `${cSign}${phase.toFixed(2)}`;
    const dSign = verticalShift >= 0 ? "+" : "";
    const dStr = verticalShift === 0 ? "" : ` ${dSign} ${verticalShift.toFixed(2)}`;
    
    return `y = ${aStr}${func}(${bStr}x${cStr})${dStr}`;
  };

  // Get color for selected function
  const getFunctionColor = () => {
    switch (selectedFunction) {
      case "sin":
        return "bg-green-500 hover:bg-green-600";
      case "cos":
        return "bg-blue-500 hover:bg-blue-600";
      case "tan":
        return "bg-purple-500 hover:bg-purple-600";
    }
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-teal-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Function Selection */}
        <div className="grid grid-cols-3 gap-2">
          {(["sin", "cos", "tan"] as TrigFunction[]).map((func) => (
            <Button
              key={func}
              variant={selectedFunction === func ? "default" : "outline"}
              onClick={() => setSelectedFunction(func)}
              className={`text-sm ${selectedFunction === func ? getFunctionColor() : ""}`}
            >
              {t[func]}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.amplitude}</label>
              <Badge variant="secondary">{amplitude.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[amplitude]}
              onValueChange={([v]) => setAmplitude(v)}
              min={-3}
              max={3}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.frequency}</label>
              <Badge variant="secondary">{frequency.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[frequency]}
              onValueChange={([v]) => setFrequency(v)}
              min={0.1}
              max={4}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.phase}</label>
              <Badge variant="secondary">{phase.toFixed(2)} rad</Badge>
            </div>
            <Slider
              value={[phase]}
              onValueChange={([v]) => setPhase(v)}
              min={-Math.PI}
              max={Math.PI}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.verticalShift}</label>
              <Badge variant="secondary">{verticalShift.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[verticalShift]}
              onValueChange={([v]) => setVerticalShift(v)}
              min={-3}
              max={3}
              step={0.1}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="rounded"
          />
          <label className="text-sm">{t.showGrid}</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAnimation(!showAnimation)}
            className={`flex-1 ${showAnimation ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            <Play className="w-4 h-4 mr-2" />
            {showAnimation ? t.pause : t.animation}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Formula */}
        <div className="p-4 bg-teal-50 dark:bg-teal-950 rounded-lg">
          <p className="text-sm text-slate-500 mb-1">{t.formula}:</p>
          <code className="text-xl font-mono font-bold text-teal-600">{getFormula()}</code>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={700} height={400} className="w-full" />
        </div>

        {/* Properties */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.period}</p>
            <p className="font-mono font-bold text-blue-600">
              {period === Infinity ? "∞" : `${period.toFixed(2)} rad`}
            </p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.max}</p>
            <p className="font-mono font-bold text-green-600">
              {maxValue === Infinity ? "∞" : maxValue.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.min}</p>
            <p className="font-mono font-bold text-red-600">
              {minValue === -Infinity ? "-∞" : minValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm">{t.explanation}</p>
          <p className="text-sm text-slate-500 mt-1">{t.periodValue}</p>
        </div>
      </CardContent>
    </Card>
  );
}
