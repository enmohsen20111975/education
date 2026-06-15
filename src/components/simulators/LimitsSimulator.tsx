"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Target, TrendingUp, ArrowLeft, ArrowRight } from "lucide-react";

interface LimitsSimulatorProps {
  language: "ar" | "en";
}

type LimitType = "polynomial" | "rational" | "trig" | "exponential";

export function LimitsSimulator({ language }: LimitsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [limitType, setLimitType] = useState<LimitType>("polynomial");
  const [approachValue, setApproachValue] = useState(2);
  const [delta, setDelta] = useState(0.5);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي النهايات",
      description: "استكشف مفهوم النهايات والاقتراب من نقطة",
      polynomial: "دالة كثيرة الحدود",
      rational: "دالة كسرية",
      trig: "دالة مثلثية",
      exponential: "دالة أسية",
      approachPoint: "نقطة الاقتراب (a)",
      delta: "المسافة من النقطة (δ)",
      limit: "النهاية",
      formula: "الدالة",
      leftApproach: "من اليسار",
      rightApproach: "من اليمين",
      value: "القيمة",
      reset: "إعادة",
      animate: "تشغيل الحركة",
      pause: "إيقاف",
      explanation: "النهاية هي القيمة التي تقترب منها الدالة عندما يقترب x من نقطة معينة",
      limitExists: "النهاية موجودة!",
      limitNotExists: "النهاية غير موجودة (مختلفة من الجهتين)",
      atPoint: "عند x = ",
    },
    en: {
      title: "Limits Simulator",
      description: "Explore the concept of limits and approaching a point",
      polynomial: "Polynomial Function",
      rational: "Rational Function",
      trig: "Trigonometric Function",
      exponential: "Exponential Function",
      approachPoint: "Approach Point (a)",
      delta: "Distance from Point (δ)",
      limit: "Limit",
      formula: "Function",
      leftApproach: "From Left",
      rightApproach: "From Right",
      value: "Value",
      reset: "Reset",
      animate: "Play Animation",
      pause: "Pause",
      explanation: "A limit is the value a function approaches as x gets closer to a specific point",
      limitExists: "Limit exists!",
      limitNotExists: "Limit doesn't exist (different from both sides)",
      atPoint: "At x = ",
    },
  };

  const t = texts[language];

  // Define functions
  const getFunction = useCallback((x: number): number => {
    switch (limitType) {
      case "polynomial":
        // f(x) = x² - 4x + 3
        return x * x - 4 * x + 3;
      case "rational":
        // f(x) = (x² - 4) / (x - 2), with hole at x = 2
        if (Math.abs(x - 2) < 0.0001) return NaN;
        return (x * x - 4) / (x - 2);
      case "trig":
        // f(x) = sin(x) / x, with hole at x = 0
        if (Math.abs(x) < 0.0001) return 1;
        return Math.sin(x) / x;
      case "exponential":
        // f(x) = (e^x - 1) / x, with hole at x = 0
        if (Math.abs(x) < 0.0001) return 1;
        return (Math.exp(x) - 1) / x;
      default:
        return 0;
    }
  }, [limitType]);

  // Get function expression
  const getFunctionExpression = () => {
    switch (limitType) {
      case "polynomial":
        return "f(x) = x² - 4x + 3";
      case "rational":
        return "f(x) = (x² - 4) / (x - 2)";
      case "trig":
        return "f(x) = sin(x) / x";
      case "exponential":
        return "f(x) = (eˣ - 1) / x";
      default:
        return "";
    }
  };

  // Get the approach point based on function type
  const getApproachPoint = useCallback(() => {
    switch (limitType) {
      case "polynomial":
        return approachValue;
      case "rational":
        return 2; // Always approach x = 2 for rational
      case "trig":
        return 0; // Always approach x = 0 for sin(x)/x
      case "exponential":
        return 0; // Always approach x = 0 for (e^x-1)/x
      default:
        return approachValue;
    }
  }, [limitType, approachValue]);

  const approachPoint = getApproachPoint();

  // Calculate limit value
  const calculateLimit = useCallback(() => {
    switch (limitType) {
      case "polynomial":
        return approachPoint * approachPoint - 4 * approachPoint + 3;
      case "rational":
        return 4; // lim (x²-4)/(x-2) as x→2 = 4
      case "trig":
        return 1; // lim sin(x)/x as x→0 = 1
      case "exponential":
        return 1; // lim (e^x-1)/x as x→0 = 1
      default:
        return 0;
    }
  }, [limitType, approachPoint]);

  const limitValue = calculateLimit();

  // Calculate left and right values
  const leftValue = getFunction(approachPoint - delta);
  const rightValue = getFunction(approachPoint + delta);

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

    // Calculate scale
    const xRange = limitType === "polynomial" ? 6 : 4;
    const xScale = width / (xRange * 2);
    const yRange = limitType === "polynomial" ? 10 : 3;
    const yScale = (height / 2 - 60) / yRange;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let x = -xRange; x <= xRange; x++) {
      const px = centerX + x * xScale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    for (let y = -yRange; y <= yRange; y++) {
      const py = centerY - y * yScale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#334155";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    for (let x = -xRange; x <= xRange; x++) {
      if (x !== 0) {
        ctx.fillText(`${x}`, centerX + x * xScale, centerY + 15);
      }
    }

    // Draw approach point
    const approachPx = centerX + approachPoint * xScale;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(approachPx, 0);
    ctx.lineTo(approachPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw function
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isFirst = true;
    for (let px = 0; px <= width; px += 1) {
      const x = (px - centerX) / xScale;
      const y = getFunction(x);
      const py = centerY - y * yScale;

      if (!isFinite(y) || isNaN(y) || py < -50 || py > height + 50) {
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

    // Draw limit point (hole or point)
    const limitPy = centerY - limitValue * yScale;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(approachPx, limitPy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw approach points with animation
    const animatedDelta = showAnimation ? delta * (1 - animationStep / 20) : delta;
    
    // Left approach point
    const leftX = approachPoint - animatedDelta;
    const leftY = getFunction(leftX);
    if (isFinite(leftY)) {
      const leftPx = centerX + leftX * xScale;
      const leftPy = centerY - leftY * yScale;
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(leftPx, leftPy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right approach point
    const rightX = approachPoint + animatedDelta;
    const rightY = getFunction(rightX);
    if (isFinite(rightY)) {
      const rightPx = centerX + rightX * xScale;
      const rightPy = centerY - rightY * yScale;
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.arc(rightPx, rightPy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw limit value
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px system-ui";
    ctx.fillText(`${language === "ar" ? "النهاية" : "Limit"} = ${limitValue.toFixed(3)}`, approachPx + 10, limitPy - 10);

    // Origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [limitType, approachPoint, delta, getFunction, limitValue, showAnimation, animationStep, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation
  useEffect(() => {
    if (showAnimation) {
      const animate = () => {
        setAnimationStep((prev) => {
          if (prev >= 20) {
            return 0;
          }
          return prev + 1;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAnimationStep(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showAnimation]);

  // Reset
  const handleReset = () => {
    setApproachValue(2);
    setDelta(0.5);
    setShowAnimation(false);
    setAnimationStep(0);
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Function Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(["polynomial", "rational", "trig", "exponential"] as LimitType[]).map((type) => (
            <Button
              key={type}
              variant={limitType === type ? "default" : "outline"}
              onClick={() => setLimitType(type)}
              className={`text-xs md:text-sm ${limitType === type ? "bg-amber-500 hover:bg-amber-600" : ""}`}
            >
              {t[type]}
            </Button>
          ))}
        </div>

        {/* Formula */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
          <p className="text-sm text-slate-500 mb-1">{t.formula}</p>
          <code className="text-lg font-mono font-bold text-amber-600">{getFunctionExpression()}</code>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {limitType === "polynomial" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.approachPoint}</label>
                <Badge variant="secondary">{approachValue}</Badge>
              </div>
              <Slider
                value={[approachValue]}
                onValueChange={([v]) => setApproachValue(v)}
                min={-3}
                max={3}
                step={0.1}
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.delta}</label>
              <Badge variant="secondary">δ = {delta.toFixed(3)}</Badge>
            </div>
            <Slider
              value={[delta]}
              onValueChange={([v]) => setDelta(v)}
              min={0.01}
              max={1}
              step={0.01}
            />
          </div>
        </div>

        {/* Animation Button */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAnimation(!showAnimation)}
            className={`flex-1 ${showAnimation ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            {showAnimation ? t.pause : t.animate}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>

        {/* Values */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4 text-green-600" />
              <p className="text-xs text-slate-500">{t.leftApproach}</p>
            </div>
            <p className="font-mono font-bold text-green-600">
              {isFinite(leftValue) ? leftValue.toFixed(4) : "—"}
            </p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.limit}</p>
            <p className="font-mono font-bold text-red-600">{limitValue.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <p className="text-xs text-slate-500">{t.rightApproach}</p>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </div>
            <p className="font-mono font-bold text-purple-600">
              {isFinite(rightValue) ? rightValue.toFixed(4) : "—"}
            </p>
          </div>
        </div>

        {/* Result */}
        <div className={`p-4 rounded-lg text-center ${
          Math.abs(leftValue - rightValue) < 0.01 || !isFinite(leftValue) || !isFinite(rightValue)
            ? "bg-green-50 dark:bg-green-950" 
            : "bg-yellow-50 dark:bg-yellow-950"
        }`}>
          <p className={`font-medium ${
            Math.abs(leftValue - rightValue) < 0.01 || !isFinite(leftValue) || !isFinite(rightValue)
              ? "text-green-600" 
              : "text-yellow-600"
          }`}>
            {Math.abs(leftValue - rightValue) < 0.01 || !isFinite(leftValue) || !isFinite(rightValue)
              ? t.limitExists
              : t.limitNotExists}
          </p>
          <p className="text-sm mt-1">
            {t.atPoint} x = {approachPoint}: lim f(x) = {limitValue.toFixed(4)}
          </p>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm">{t.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
