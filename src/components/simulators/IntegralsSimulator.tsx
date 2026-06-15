"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Layers, Calculator, Play } from "lucide-react";

interface IntegralsSimulatorProps {
  language: "ar" | "en";
}

type FunctionType = "polynomial" | "trig" | "exponential";

export function IntegralsSimulator({ language }: IntegralsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [functionType, setFunctionType] = useState<FunctionType>("polynomial");
  const [lowerBound, setLowerBound] = useState(0);
  const [upperBound, setUpperBound] = useState(2);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي التكامل",
      description: "استكشف مفهوم التكامل المحدود",
      polynomial: "دالة كثيرة الحدود",
      trig: "دالة مثلثية",
      exponential: "دالة أسية",
      lowerBound: "الحد الأدنى (a)",
      upperBound: "الحد الأعلى (b)",
      integral: "التكامل",
      definiteIntegral: "التكامل المحدود",
      function: "الدالة",
      antiderivative: "الدالة الأصلية",
      area: "المساحة",
      value: "القيمة",
      reset: "إعادة",
      animate: "تشغيل الحركة",
      pause: "إيقاف",
      explanation: "التكامل المحدود يمثل المساحة تحت المنحنى بين حدين",
      fundamentalTheorem: "نظرية التأسيس: ∫ₐᵇ f(x)dx = F(b) - F(a)",
    },
    en: {
      title: "Integrals Simulator",
      description: "Explore the concept of definite integrals",
      polynomial: "Polynomial Function",
      trig: "Trigonometric Function",
      exponential: "Exponential Function",
      lowerBound: "Lower Bound (a)",
      upperBound: "Upper Bound (b)",
      integral: "Integral",
      definiteIntegral: "Definite Integral",
      function: "Function",
      antiderivative: "Antiderivative",
      area: "Area",
      value: "Value",
      reset: "Reset",
      animate: "Play Animation",
      pause: "Pause",
      explanation: "The definite integral represents the area under the curve between two bounds",
      fundamentalTheorem: "Fundamental Theorem: ∫ₐᵇ f(x)dx = F(b) - F(a)",
    },
  };

  const t = texts[language];

  // Get function value
  const getFunctionValue = useCallback((x: number): number => {
    switch (functionType) {
      case "polynomial":
        return x * x;
      case "trig":
        return Math.sin(x);
      case "exponential":
        return Math.exp(x / 2);
      default:
        return 0;
    }
  }, [functionType]);

  // Get antiderivative value
  const getAntiderivativeValue = useCallback((x: number): number => {
    switch (functionType) {
      case "polynomial":
        return (x * x * x) / 3;
      case "trig":
        return -Math.cos(x);
      case "exponential":
        return 2 * Math.exp(x / 2);
      default:
        return 0;
    }
  }, [functionType]);

  // Calculate definite integral
  const calculateDefiniteIntegral = useCallback((): number => {
    return getAntiderivativeValue(upperBound) - getAntiderivativeValue(lowerBound);
  }, [getAntiderivativeValue, lowerBound, upperBound]);

  // Numerical integration (Simpson's rule)
  const numericalIntegration = useCallback((a: number, b: number, n: number = 100): number => {
    const h = (b - a) / n;
    let sum = getFunctionValue(a) + getFunctionValue(b);
    
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * getFunctionValue(x);
    }
    
    return (h / 3) * sum;
  }, [getFunctionValue]);

  // Get function expression
  const getFunctionExpression = () => {
    switch (functionType) {
      case "polynomial":
        return "f(x) = x²";
      case "trig":
        return "f(x) = sin(x)";
      case "exponential":
        return "f(x) = e^(x/2)";
      default:
        return "";
    }
  };

  // Get antiderivative expression
  const getAntiderivativeExpression = () => {
    switch (functionType) {
      case "polynomial":
        return "F(x) = x³/3";
      case "trig":
        return "F(x) = -cos(x)";
      case "exponential":
        return "F(x) = 2e^(x/2)";
      default:
        return "";
    }
  };

  const integralValue = calculateDefiniteIntegral();
  const numericalValue = numericalIntegration(lowerBound, upperBound);

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
    const xRange = 5;
    const xScale = width / (xRange * 2);
    const yRange = 5;
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

    // Draw shaded area (integral region)
    const minX = Math.min(lowerBound, upperBound);
    const maxX = Math.max(lowerBound, upperBound);
    const animatedMaxX = showAnimation ? minX + (maxX - minX) * animationProgress : maxX;

    ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    ctx.beginPath();
    
    const lowerPx = centerX + minX * xScale;
    const upperPx = centerX + animatedMaxX * xScale;
    
    ctx.moveTo(lowerPx, centerY);
    
    for (let px = lowerPx; px <= upperPx; px += 1) {
      const x = (px - centerX) / xScale;
      const y = getFunctionValue(x);
      const py = centerY - y * yScale;
      ctx.lineTo(px, py);
    }
    
    ctx.lineTo(upperPx, centerY);
    ctx.closePath();
    ctx.fill();

    // Draw function
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isFirst = true;
    for (let px = 0; px <= width; px += 1) {
      const x = (px - centerX) / xScale;
      const y = getFunctionValue(x);
      const py = centerY - y * yScale;

      if (!isFinite(y) || isNaN(y) || py < -100 || py > height + 100) {
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

    // Draw bounds
    const lowerBoundPx = centerX + lowerBound * xScale;
    const upperBoundPx = centerX + upperBound * xScale;
    
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Lower bound
    ctx.beginPath();
    ctx.moveTo(lowerBoundPx, 0);
    ctx.lineTo(lowerBoundPx, height);
    ctx.stroke();
    
    // Upper bound
    ctx.beginPath();
    ctx.moveTo(upperBoundPx, 0);
    ctx.lineTo(upperBoundPx, height);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Labels for bounds
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 11px system-ui";
    ctx.fillText(`a=${lowerBound.toFixed(1)}`, lowerBoundPx, 20);
    ctx.fillText(`b=${upperBound.toFixed(1)}`, upperBoundPx, 20);

    // Origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [functionType, lowerBound, upperBound, getFunctionValue, showAnimation, animationProgress]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation
  useEffect(() => {
    if (showAnimation) {
      const animate = () => {
        setAnimationProgress((prev) => {
          if (prev >= 1) {
            return 0;
          }
          return prev + 0.02;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAnimationProgress(1);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showAnimation]);

  // Reset
  const handleReset = () => {
    setLowerBound(0);
    setUpperBound(2);
    setShowAnimation(false);
    setAnimationProgress(0);
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-indigo-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Function Type Selection */}
        <div className="grid grid-cols-3 gap-2">
          {(["polynomial", "trig", "exponential"] as FunctionType[]).map((type) => (
            <Button
              key={type}
              variant={functionType === type ? "default" : "outline"}
              onClick={() => setFunctionType(type)}
              className={`text-xs md:text-sm ${functionType === type ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
            >
              {t[type]}
            </Button>
          ))}
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">{t.function}</p>
            <code className="text-sm font-mono font-bold text-blue-600">{getFunctionExpression()}</code>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">{t.antiderivative}</p>
            <code className="text-sm font-mono font-bold text-indigo-600">{getAntiderivativeExpression()}</code>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.lowerBound}</label>
              <Badge variant="secondary">a = {lowerBound.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[lowerBound]}
              onValueChange={([v]) => setLowerBound(v)}
              min={-4}
              max={4}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.upperBound}</label>
              <Badge variant="secondary">b = {upperBound.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[upperBound]}
              onValueChange={([v]) => setUpperBound(v)}
              min={-4}
              max={4}
              step={0.1}
            />
          </div>
        </div>

        {/* Animation Button */}
        <Button
          onClick={() => setShowAnimation(!showAnimation)}
          className={`w-full ${showAnimation ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          <Play className="w-4 h-4 mr-2" />
          {showAnimation ? t.pause : t.animate}
        </Button>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>

        {/* Integral notation */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-center">
          <p className="text-sm text-slate-500 mb-1">{t.definiteIntegral}</p>
          <code className="text-xl font-mono font-bold text-indigo-600">
            ∫<sub>{lowerBound.toFixed(1)}</sub><sup>{upperBound.toFixed(1)}</sup> f(x)dx = {integralValue.toFixed(4)}
          </code>
        </div>

        {/* Values */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.integral}</p>
            <p className="font-mono font-bold text-indigo-600">{integralValue.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{language === "ar" ? "عددياً" : "Numerical"}</p>
            <p className="font-mono font-bold text-blue-600">{numericalValue.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.area}</p>
            <p className="font-mono font-bold text-green-600">{Math.abs(integralValue).toFixed(4)}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm mb-2">{t.explanation}</p>
          <p className="text-xs text-slate-500">{t.fundamentalTheorem}</p>
        </div>
      </CardContent>
    </Card>
  );
}
