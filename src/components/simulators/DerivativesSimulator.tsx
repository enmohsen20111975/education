"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, TrendingUp, LineChart, Ruler } from "lucide-react";

interface DerivativesSimulatorProps {
  language: "ar" | "en";
}

type FunctionType = "polynomial" | "trig" | "exponential" | "logarithm";

export function DerivativesSimulator({ language }: DerivativesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [functionType, setFunctionType] = useState<FunctionType>("polynomial");
  const [point, setPoint] = useState(2);
  const [tangentLine, setTangentLine] = useState(true);
  const [secantLine, setSecantLine] = useState(false);
  const [hValue, setHValue] = useState(1);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الاشتقاق",
      description: "استكشف مفهوم المشتقة والخط المماس",
      polynomial: "دالة كثيرة الحدود",
      trig: "دالة مثلثية",
      exponential: "دالة أسية",
      logarithm: "دالة لوغاريتمية",
      point: "النقطة (x)",
      showTangent: "الخط المماس",
      showSecant: "الخط القاطع",
      hValue: "قيمة h",
      derivative: "المشتقة",
      derivativeValue: "قيمة المشتقة",
      slope: "الميل",
      formula: "الدالة الأصلية",
      derivativeFormula: "المشتقة",
      reset: "إعادة",
      explanation: "المشتقة تمثل معدل التغير اللحظي للدالة عند نقطة معينة",
      tangentExplanation: "الخط المماس: خط يمس المنحنى عند نقطة واحدة وميله يساوي المشتقة",
      secantExplanation: "الخط القاطع: يمر بنقطتين على المنحنى، عندما h→0 يصبح الخط المماس",
    },
    en: {
      title: "Derivatives Simulator",
      description: "Explore the concept of derivatives and tangent lines",
      polynomial: "Polynomial Function",
      trig: "Trigonometric Function",
      exponential: "Exponential Function",
      logarithm: "Logarithmic Function",
      point: "Point (x)",
      showTangent: "Tangent Line",
      showSecant: "Secant Line",
      hValue: "h Value",
      derivative: "Derivative",
      derivativeValue: "Derivative Value",
      slope: "Slope",
      formula: "Original Function",
      derivativeFormula: "Derivative",
      reset: "Reset",
      explanation: "The derivative represents the instantaneous rate of change of a function at a point",
      tangentExplanation: "Tangent line: touches the curve at one point with slope equal to the derivative",
      secantExplanation: "Secant line: passes through two points, as h→0 it becomes the tangent",
    },
  };

  const t = texts[language];

  // Get function value
  const getFunctionValue = useCallback((x: number): number => {
    switch (functionType) {
      case "polynomial":
        return x * x * x - 2 * x * x + x + 1;
      case "trig":
        return Math.sin(x);
      case "exponential":
        return Math.exp(x / 2);
      case "logarithm":
        return x > 0 ? Math.log(x) : NaN;
      default:
        return 0;
    }
  }, [functionType]);

  // Get derivative value (analytical)
  const getDerivativeValue = useCallback((x: number): number => {
    switch (functionType) {
      case "polynomial":
        return 3 * x * x - 4 * x + 1;
      case "trig":
        return Math.cos(x);
      case "exponential":
        return 0.5 * Math.exp(x / 2);
      case "logarithm":
        return x > 0 ? 1 / x : NaN;
      default:
        return 0;
    }
  }, [functionType]);

  // Get function expression
  const getFunctionExpression = () => {
    switch (functionType) {
      case "polynomial":
        return "f(x) = x³ - 2x² + x + 1";
      case "trig":
        return "f(x) = sin(x)";
      case "exponential":
        return "f(x) = e^(x/2)";
      case "logarithm":
        return "f(x) = ln(x)";
      default:
        return "";
    }
  };

  // Get derivative expression
  const getDerivativeExpression = () => {
    switch (functionType) {
      case "polynomial":
        return "f'(x) = 3x² - 4x + 1";
      case "trig":
        return "f'(x) = cos(x)";
      case "exponential":
        return "f'(x) = ½e^(x/2)";
      case "logarithm":
        return "f'(x) = 1/x";
      default:
        return "";
    }
  };

  // Calculate derivative numerically
  const numericalDerivative = useCallback((x: number, h: number = 0.0001): number => {
    return (getFunctionValue(x + h) - getFunctionValue(x - h)) / (2 * h);
  }, [getFunctionValue]);

  // Current values
  const fx = getFunctionValue(point);
  const derivative = getDerivativeValue(point);
  const numericalDeriv = numericalDerivative(point);

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

    // Calculate scale based on function type
    const xRange = functionType === "logarithm" ? 6 : 5;
    const xScale = width / (xRange * 2);
    const yRange = functionType === "exponential" ? 15 : functionType === "polynomial" ? 40 : 3;
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
    for (let y = -yRange; y <= yRange; y += yRange / 5) {
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

    // Point coordinates
    const pointPx = centerX + point * xScale;
    const pointPy = centerY - fx * yScale;

    // Draw secant line
    if (secantLine) {
      const x2 = point + hValue;
      const y2 = getFunctionValue(x2);
      const secantSlope = (y2 - fx) / hValue;
      
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      const lineX1 = point - 2;
      const lineY1 = fx - secantSlope * 2;
      const lineX2 = point + hValue + 2;
      const lineY2 = y2 + secantSlope * 2;
      
      ctx.moveTo(centerX + lineX1 * xScale, centerY - lineY1 * yScale);
      ctx.lineTo(centerX + lineX2 * xScale, centerY - lineY2 * yScale);
      ctx.stroke();
      ctx.setLineDash([]);

      // Second point
      const point2Px = centerX + x2 * xScale;
      const point2Py = centerY - y2 * yScale;
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(point2Px, point2Py, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw tangent line
    if (tangentLine && isFinite(derivative)) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const lineLength = 3;
      const x1 = point - lineLength;
      const y1 = fx - derivative * lineLength;
      const x2 = point + lineLength;
      const y2 = fx + derivative * lineLength;
      
      ctx.moveTo(centerX + x1 * xScale, centerY - y1 * yScale);
      ctx.lineTo(centerX + x2 * xScale, centerY - y2 * yScale);
      ctx.stroke();
    }

    // Draw main point
    if (isFinite(fx)) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(pointPx, pointPy, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Point label
      ctx.fillStyle = "#334155";
      ctx.font = "11px system-ui";
      ctx.fillText(`(${point.toFixed(1)}, ${fx.toFixed(2)})`, pointPx + 15, pointPy - 10);
    }

    // Origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [functionType, point, tangentLine, secantLine, hValue, getFunctionValue, fx, derivative]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setPoint(2);
    setHValue(1);
    setTangentLine(true);
    setSecantLine(false);
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-red-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Function Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(["polynomial", "trig", "exponential", "logarithm"] as FunctionType[]).map((type) => (
            <Button
              key={type}
              variant={functionType === type ? "default" : "outline"}
              onClick={() => setFunctionType(type)}
              className={`text-xs md:text-sm ${functionType === type ? "bg-red-500 hover:bg-red-600" : ""}`}
            >
              {t[type]}
            </Button>
          ))}
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">{t.formula}</p>
            <code className="text-sm font-mono font-bold text-blue-600">{getFunctionExpression()}</code>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">{t.derivativeFormula}</p>
            <code className="text-sm font-mono font-bold text-red-600">{getDerivativeExpression()}</code>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.point}</label>
              <Badge variant="secondary">x = {point.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[point]}
              onValueChange={([v]) => setPoint(v)}
              min={functionType === "logarithm" ? 0.5 : -4}
              max={functionType === "logarithm" ? 5 : 4}
              step={0.1}
            />
          </div>

          {secantLine && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.hValue}</label>
                <Badge variant="secondary">h = {hValue.toFixed(2)}</Badge>
              </div>
              <Slider
                value={[hValue]}
                onValueChange={([v]) => setHValue(v)}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tangentLine}
              onChange={(e) => setTangentLine(e.target.checked)}
              className="rounded"
            />
            <label className="text-sm">{t.showTangent}</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={secantLine}
              onChange={(e) => setSecantLine(e.target.checked)}
              className="rounded"
            />
            <label className="text-sm">{t.showSecant}</label>
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

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">f({point.toFixed(1)})</p>
            <p className="font-mono font-bold text-blue-600">{isFinite(fx) ? fx.toFixed(4) : "—"}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.derivativeValue}</p>
            <p className="font-mono font-bold text-red-600">{isFinite(derivative) ? derivative.toFixed(4) : "—"}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.slope}</p>
            <p className="font-mono font-bold text-green-600">{isFinite(derivative) ? derivative.toFixed(4) : "—"}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{language === "ar" ? "عددياً" : "Numerical"}</p>
            <p className="font-mono font-bold text-purple-600">{isFinite(numericalDeriv) ? numericalDeriv.toFixed(4) : "—"}</p>
          </div>
        </div>

        {/* Explanations */}
        <div className="space-y-3">
          {tangentLine && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm">{t.tangentExplanation}</p>
            </div>
          )}
          {secantLine && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm">{t.secantExplanation}</p>
            </div>
          )}
        </div>

        {/* Main Explanation */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm">{t.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
