"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ArrowUp, ArrowDown, Target } from "lucide-react";

interface MaxMinSimulatorProps {
  language: "ar" | "en";
}

type FunctionType = "quadratic" | "cubic" | "trig" | "rational";

export function MaxMinSimulator({ language }: MaxMinSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [functionType, setFunctionType] = useState<FunctionType>("quadratic");
  const [coefficientA, setCoefficientA] = useState(1);
  const [coefficientB, setCoefficientB] = useState(0);
  const [coefficientC, setCoefficientC] = useState(0);
  const [showDerivative, setShowDerivative] = useState(true);
  const [showCriticalPoints, setShowCriticalPoints] = useState(true);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي القيم العظمى والدنيا",
      description: "استكشف النقاط الحرجة والقيم العظمى والدنيا المحلية",
      quadratic: "دالة تربيعية",
      cubic: "دالة تكعيبية",
      trig: "دالة مثلثية",
      rational: "دالة كسرية",
      coefficientA: "المعامل a",
      coefficientB: "المعامل b",
      coefficientC: "المعامل c",
      showDerivative: "إظهار المشتقة",
      showCriticalPoints: "إظهار النقاط الحرجة",
      maxValue: "القيمة العظمى",
      minValue: "القيمة الدنيا",
      criticalPoints: "النقاط الحرجة",
      derivative: "المشتقة",
      function: "الدالة",
      reset: "إعادة",
      explanation: "النقاط الحرجة هي النقاط التي تكون فيها المشتقة = صفر أو غير موجودة",
      localMax: "قيمة عظمى محلية: المشتقة تغير من + إلى -",
      localMin: "قيمة دنيا محلية: المشتقة تغير من - إلى +",
      inflection: "نقطة انعطاف: المشتقة لا تغير إشارتها",
    },
    en: {
      title: "Max/Min Values Simulator",
      description: "Explore critical points and local maxima/minima",
      quadratic: "Quadratic Function",
      cubic: "Cubic Function",
      trig: "Trigonometric Function",
      rational: "Rational Function",
      coefficientA: "Coefficient a",
      coefficientB: "Coefficient b",
      coefficientC: "Coefficient c",
      showDerivative: "Show Derivative",
      showCriticalPoints: "Show Critical Points",
      maxValue: "Maximum Value",
      minValue: "Minimum Value",
      criticalPoints: "Critical Points",
      derivative: "Derivative",
      function: "Function",
      reset: "Reset",
      explanation: "Critical points are where the derivative equals zero or doesn't exist",
      localMax: "Local maximum: derivative changes from + to -",
      localMin: "Local minimum: derivative changes from - to +",
      inflection: "Inflection point: derivative doesn't change sign",
    },
  };

  const t = texts[language];

  // Get function value
  const getFunctionValue = useCallback((x: number): number => {
    switch (functionType) {
      case "quadratic":
        return coefficientA * x * x + coefficientB * x + coefficientC;
      case "cubic":
        return coefficientA * x * x * x + coefficientB * x * x + coefficientC * x;
      case "trig":
        return coefficientA * Math.sin(x) + coefficientB * Math.cos(x);
      case "rational":
        if (Math.abs(x - coefficientB) < 0.01) return NaN;
        return coefficientA / (x - coefficientB) + coefficientC;
      default:
        return 0;
    }
  }, [functionType, coefficientA, coefficientB, coefficientC]);

  // Get derivative value
  const getDerivativeValue = useCallback((x: number): number => {
    switch (functionType) {
      case "quadratic":
        return 2 * coefficientA * x + coefficientB;
      case "cubic":
        return 3 * coefficientA * x * x + 2 * coefficientB * x + coefficientC;
      case "trig":
        return coefficientA * Math.cos(x) - coefficientB * Math.sin(x);
      case "rational":
        if (Math.abs(x - coefficientB) < 0.01) return NaN;
        return -coefficientA / ((x - coefficientB) * (x - coefficientB));
      default:
        return 0;
    }
  }, [functionType, coefficientA, coefficientB, coefficientC]);

  // Find critical points
  const findCriticalPoints = useCallback((): { x: number; type: "max" | "min" | "inflection" }[] => {
    const points: { x: number; type: "max" | "min" | "inflection" }[] = [];
    const h = 0.001;

    switch (functionType) {
      case "quadratic":
        if (coefficientA !== 0) {
          const x = -coefficientB / (2 * coefficientA);
          points.push({
            x,
            type: coefficientA < 0 ? "max" : "min",
          });
        }
        break;
      case "cubic":
        // f'(x) = 3ax² + 2bx + c = 0
        const disc = 4 * coefficientB * coefficientB - 12 * coefficientA * coefficientC;
        if (disc >= 0 && coefficientA !== 0) {
          const x1 = (-2 * coefficientB + Math.sqrt(disc)) / (6 * coefficientA);
          const x2 = (-2 * coefficientB - Math.sqrt(disc)) / (6 * coefficientA);
          
          // Check sign change
          const d1Left = getDerivativeValue(x1 - h);
          const d1Right = getDerivativeValue(x1 + h);
          const d2Left = getDerivativeValue(x2 - h);
          const d2Right = getDerivativeValue(x2 + h);
          
          if (d1Left * d1Right < 0) {
            points.push({ x: x1, type: d1Left > 0 ? "max" : "min" });
          }
          if (d2Left * d2Right < 0) {
            points.push({ x: x2, type: d2Left > 0 ? "max" : "min" });
          }
        }
        break;
      case "trig":
        // f'(x) = a*cos(x) - b*sin(x) = 0
        // tan(x) = a/b
        if (coefficientB !== 0) {
          const x0 = Math.atan(coefficientA / coefficientB);
          for (let k = -3; k <= 3; k++) {
            const x = x0 + k * Math.PI;
            const dLeft = getDerivativeValue(x - h);
            const dRight = getDerivativeValue(x + h);
            if (dLeft * dRight < 0) {
              points.push({ x, type: dLeft > 0 ? "max" : "min" });
            }
          }
        } else {
          for (let k = -3; k <= 3; k++) {
            const x = k * Math.PI + (coefficientA > 0 ? 0 : Math.PI / 2);
            const dLeft = getDerivativeValue(x - h);
            const dRight = getDerivativeValue(x + h);
            if (dLeft * dRight < 0) {
              points.push({ x, type: dLeft > 0 ? "max" : "min" });
            }
          }
        }
        break;
      case "rational":
        // No critical points for this rational function
        break;
    }

    return points;
  }, [functionType, coefficientA, coefficientB, coefficientC, getDerivativeValue]);

  const criticalPoints = findCriticalPoints();

  // Get function expression
  const getFunctionExpression = () => {
    switch (functionType) {
      case "quadratic":
        return `f(x) = ${coefficientA}x² + ${coefficientB}x + ${coefficientC}`;
      case "cubic":
        return `f(x) = ${coefficientA}x³ + ${coefficientB}x² + ${coefficientC}x`;
      case "trig":
        return `f(x) = ${coefficientA}sin(x) + ${coefficientB}cos(x)`;
      case "rational":
        return `f(x) = ${coefficientA}/(x - ${coefficientB}) + ${coefficientC}`;
      default:
        return "";
    }
  };

  // Get derivative expression
  const getDerivativeExpression = () => {
    switch (functionType) {
      case "quadratic":
        return `f'(x) = ${2 * coefficientA}x + ${coefficientB}`;
      case "cubic":
        return `f'(x) = ${3 * coefficientA}x² + ${2 * coefficientB}x + ${coefficientC}`;
      case "trig":
        return `f'(x) = ${coefficientA}cos(x) - ${coefficientB}sin(x)`;
      case "rational":
        return `f'(x) = -${coefficientA}/(x - ${coefficientB})²`;
      default:
        return "";
    }
  };

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
    const xRange = functionType === "trig" ? 2 * Math.PI : 5;
    const xScale = width / (xRange * 2);
    const yRange = 10;
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
    for (let y = -yRange; y <= yRange; y += 2) {
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

    // Draw derivative
    if (showDerivative) {
      ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      let isFirst = true;
      for (let px = 0; px <= width; px += 1) {
        const x = (px - centerX) / xScale;
        const y = getDerivativeValue(x);
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
    }

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

    // Draw critical points
    if (showCriticalPoints) {
      criticalPoints.forEach((point) => {
        const px = centerX + point.x * xScale;
        const py = centerY - getFunctionValue(point.x) * yScale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          // Point color based on type
          ctx.fillStyle = point.type === "max" ? "#ef4444" : "#22c55e";
          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fill();

          // Label
          ctx.fillStyle = point.type === "max" ? "#ef4444" : "#22c55e";
          ctx.font = "bold 10px system-ui";
          ctx.fillText(
            point.type === "max" ? (language === "ar" ? "عظمى" : "Max") : (language === "ar" ? "دنيا" : "Min"),
            px,
            py - 15
          );
        }
      });
    }

    // Function label
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 12px system-ui";
    ctx.fillText(getFunctionExpression(), centerX, 25);

    // Origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [functionType, coefficientA, coefficientB, coefficientC, showDerivative, showCriticalPoints, criticalPoints, getFunctionValue, getDerivativeValue, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setCoefficientA(1);
    setCoefficientB(0);
    setCoefficientC(0);
    setShowDerivative(true);
    setShowCriticalPoints(true);
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-fuchsia-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Function Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(["quadratic", "cubic", "trig", "rational"] as FunctionType[]).map((type) => (
            <Button
              key={type}
              variant={functionType === type ? "default" : "outline"}
              onClick={() => setFunctionType(type)}
              className={`text-xs md:text-sm ${functionType === type ? "bg-fuchsia-500 hover:bg-fuchsia-600" : ""}`}
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
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">{t.derivative}</p>
            <code className="text-sm font-mono font-bold text-green-600">{getDerivativeExpression()}</code>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientA}</label>
              <Badge variant="secondary">{coefficientA.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[coefficientA]}
              onValueChange={([v]) => setCoefficientA(v)}
              min={-3}
              max={3}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientB}</label>
              <Badge variant="secondary">{coefficientB.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[coefficientB]}
              onValueChange={([v]) => setCoefficientB(v)}
              min={-5}
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientC}</label>
              <Badge variant="secondary">{coefficientC.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[coefficientC]}
              onValueChange={([v]) => setCoefficientC(v)}
              min={-5}
              max={5}
              step={0.1}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDerivative}
              onChange={(e) => setShowDerivative(e.target.checked)}
              className="rounded"
            />
            <label className="text-sm">{t.showDerivative}</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showCriticalPoints}
              onChange={(e) => setShowCriticalPoints(e.target.checked)}
              className="rounded"
            />
            <label className="text-sm">{t.showCriticalPoints}</label>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>

        {/* Critical Points */}
        {criticalPoints.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold">{t.criticalPoints}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {criticalPoints.map((point, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    point.type === "max"
                      ? "bg-red-50 dark:bg-red-950"
                      : "bg-green-50 dark:bg-green-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {point.type === "max" ? (
                      <ArrowUp className="w-5 h-5 text-red-500" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {point.type === "max" ? t.maxValue : t.minValue}
                      </p>
                      <p className="font-mono text-sm">
                        x = {point.x.toFixed(3)}, f(x) = {getFunctionValue(point.x).toFixed(3)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanations */}
        <div className="space-y-3">
          <div className="p-3 bg-fuchsia-50 dark:bg-fuchsia-950 rounded-lg">
            <p className="text-sm">{t.explanation}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="p-2 bg-red-50 dark:bg-red-950 rounded text-sm">
              <span className="font-medium text-red-600">{t.localMax}</span>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-sm">
              <span className="font-medium text-green-600">{t.localMin}</span>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded text-sm">
              <span className="font-medium text-yellow-600">{t.inflection}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
