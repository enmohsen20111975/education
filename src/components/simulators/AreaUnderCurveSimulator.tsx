"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Square, Grid3X3, Play } from "lucide-react";

interface AreaUnderCurveSimulatorProps {
  language: "ar" | "en";
}

type ApproximationType = "left" | "right" | "midpoint" | "trapezoid";

export function AreaUnderCurveSimulator({ language }: AreaUnderCurveSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [approximationType, setApproximationType] = useState<ApproximationType>("left");
  const [numRectangles, setNumRectangles] = useState(4);
  const [lowerBound, setLowerBound] = useState(0);
  const [upperBound, setUpperBound] = useState(3);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المساحة تحت المنحنى",
      description: "تقريب المساحة باستخدام المستطيلات والأشكال شبه المنحرفة",
      left: "المجموع الأيسر",
      right: "المجموع الأيمن",
      midpoint: "نقطة المنتصف",
      trapezoid: "قاعدة شبه المنحرف",
      numRectangles: "عدد المستطيلات (n)",
      lowerBound: "الحد الأدنى",
      upperBound: "الحد الأعلى",
      approximation: "التقريب",
      exactArea: "المساحة الدقيقة",
      error: "الخطأ",
      percentError: "نسبة الخطأ",
      reset: "إعادة",
      animate: "تشغيل الحركة",
      pause: "إيقاف",
      explanation: "تقريب المساحة باستخدام Riemann sums: تقسيم المنطقة لأشكال هندسية بسيطة",
      convergence: "عندما n → ∞، يقترب التقريب من المساحة الدقيقة",
      rectangles: "مستطيلات",
    },
    en: {
      title: "Area Under Curve Simulator",
      description: "Approximate area using rectangles and trapezoids",
      left: "Left Riemann Sum",
      right: "Right Riemann Sum",
      midpoint: "Midpoint Rule",
      trapezoid: "Trapezoid Rule",
      numRectangles: "Number of Rectangles (n)",
      lowerBound: "Lower Bound",
      upperBound: "Upper Bound",
      approximation: "Approximation",
      exactArea: "Exact Area",
      error: "Error",
      percentError: "Error %",
      reset: "Reset",
      animate: "Play Animation",
      pause: "Pause",
      explanation: "Riemann sum approximation: dividing the region into simple geometric shapes",
      convergence: "As n → ∞, the approximation approaches the exact area",
      rectangles: "rectangles",
    },
  };

  const t = texts[language];

  // Function: f(x) = x² + 1
  const getFunctionValue = (x: number): number => {
    return x * x + 1;
  };

  // Calculate exact integral: ∫(x² + 1)dx = x³/3 + x
  const calculateExactArea = useCallback((): number => {
    const F = (x: number) => (x * x * x) / 3 + x;
    return F(upperBound) - F(lowerBound);
  }, [lowerBound, upperBound]);

  // Calculate approximation
  const calculateApproximation = useCallback((): number => {
    const dx = (upperBound - lowerBound) / numRectangles;
    let sum = 0;

    switch (approximationType) {
      case "left":
        for (let i = 0; i < numRectangles; i++) {
          const x = lowerBound + i * dx;
          sum += getFunctionValue(x) * dx;
        }
        break;
      case "right":
        for (let i = 1; i <= numRectangles; i++) {
          const x = lowerBound + i * dx;
          sum += getFunctionValue(x) * dx;
        }
        break;
      case "midpoint":
        for (let i = 0; i < numRectangles; i++) {
          const x = lowerBound + (i + 0.5) * dx;
          sum += getFunctionValue(x) * dx;
        }
        break;
      case "trapezoid":
        sum = (getFunctionValue(lowerBound) + getFunctionValue(upperBound)) / 2;
        for (let i = 1; i < numRectangles; i++) {
          const x = lowerBound + i * dx;
          sum += getFunctionValue(x);
        }
        sum *= dx;
        break;
    }

    return sum;
  }, [approximationType, numRectangles, lowerBound, upperBound]);

  const exactArea = calculateExactArea();
  const approxArea = calculateApproximation();
  const error = Math.abs(exactArea - approxArea);
  const percentError = (error / Math.abs(exactArea)) * 100;

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
    const yRange = 12;
    const yScale = (height / 2 - 40) / yRange;

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
    for (let y = 0; y <= yRange; y += 2) {
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

    // Draw rectangles/trapezoids
    const dx = (upperBound - lowerBound) / numRectangles;
    const displayedRects = showAnimation ? Math.min(animationStep + 1, numRectangles) : numRectangles;

    for (let i = 0; i < displayedRects; i++) {
      const x0 = lowerBound + i * dx;
      const x1 = lowerBound + (i + 1) * dx;
      const px0 = centerX + x0 * xScale;
      const px1 = centerX + x1 * xScale;

      if (approximationType === "trapezoid") {
        // Draw trapezoid
        const y0 = getFunctionValue(x0);
        const y1 = getFunctionValue(x1);
        const py0 = centerY - y0 * yScale;
        const py1 = centerY - y1 * yScale;

        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + i * 0.02})`;
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px0, centerY);
        ctx.lineTo(px0, py0);
        ctx.lineTo(px1, py1);
        ctx.lineTo(px1, centerY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Draw rectangle
        let sampleX: number;
        switch (approximationType) {
          case "left":
            sampleX = x0;
            break;
          case "right":
            sampleX = x1;
            break;
          case "midpoint":
            sampleX = (x0 + x1) / 2;
            break;
          default:
            sampleX = x0;
        }

        const y = getFunctionValue(sampleX);
        const py = centerY - y * yScale;
        const rectHeight = y * yScale;

        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + i * 0.02})`;
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1;
        ctx.fillRect(px0, py, dx * xScale, rectHeight);
        ctx.strokeRect(px0, py, dx * xScale, rectHeight);
      }
    }

    // Draw function curve
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px += 1) {
      const x = (px - centerX) / xScale;
      if (x < -xRange || x > xRange) continue;
      
      const y = getFunctionValue(x);
      const py = centerY - y * yScale;

      if (px === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw bounds
    const lowerBoundPx = centerX + lowerBound * xScale;
    const upperBoundPx = centerX + upperBound * xScale;

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(lowerBoundPx, 0);
    ctx.lineTo(lowerBoundPx, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(upperBoundPx, 0);
    ctx.lineTo(upperBoundPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Function label
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px system-ui";
    ctx.fillText("f(x) = x² + 1", centerX - 50, 30);

    // Origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [approximationType, numRectangles, lowerBound, upperBound, showAnimation, animationStep]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation
  useEffect(() => {
    if (showAnimation) {
      const animate = () => {
        setAnimationStep((prev) => {
          if (prev >= numRectangles - 1) {
            return 0;
          }
          return prev + 1;
        });
        animationRef.current = requestAnimationFrame(() => {
          setTimeout(animate, 300);
        });
      };
      animationRef.current = requestAnimationFrame(() => {
        setTimeout(animate, 300);
      });
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
  }, [showAnimation, numRectangles]);

  // Reset
  const handleReset = () => {
    setNumRectangles(4);
    setLowerBound(0);
    setUpperBound(3);
    setShowAnimation(false);
    setAnimationStep(0);
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Square className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-sky-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Approximation Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(["left", "right", "midpoint", "trapezoid"] as ApproximationType[]).map((type) => (
            <Button
              key={type}
              variant={approximationType === type ? "default" : "outline"}
              onClick={() => setApproximationType(type)}
              className={`text-xs md:text-sm ${approximationType === type ? "bg-sky-500 hover:bg-sky-600" : ""}`}
            >
              {t[type]}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.numRectangles}</label>
              <Badge variant="secondary">{numRectangles}</Badge>
            </div>
            <Slider
              value={[numRectangles]}
              onValueChange={([v]) => setNumRectangles(v)}
              min={1}
              max={50}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.lowerBound}</label>
              <Badge variant="secondary">{lowerBound.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[lowerBound]}
              onValueChange={([v]) => setLowerBound(v)}
              min={-3}
              max={3}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.upperBound}</label>
              <Badge variant="secondary">{upperBound.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[upperBound]}
              onValueChange={([v]) => setUpperBound(v)}
              min={0}
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

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.approximation}</p>
            <p className="font-mono font-bold text-blue-600">{approxArea.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.exactArea}</p>
            <p className="font-mono font-bold text-green-600">{exactArea.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.error}</p>
            <p className="font-mono font-bold text-red-600">{error.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.percentError}</p>
            <p className="font-mono font-bold text-orange-600">{percentError.toFixed(2)}%</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <div className="p-4 bg-sky-50 dark:bg-sky-950 rounded-lg">
            <p className="text-sm">{t.explanation}</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-500">{t.convergence}</p>
          </div>
        </div>

        {/* Current method info */}
        <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-lg text-center">
          <p className="text-sm">
            {language === "ar" 
              ? `${numRectangles} ${t.rectangles} | ${t.approximation}: ${approxArea.toFixed(4)}`
              : `${numRectangles} ${t.rectangles} | ${t.approximation}: ${approxArea.toFixed(4)}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
