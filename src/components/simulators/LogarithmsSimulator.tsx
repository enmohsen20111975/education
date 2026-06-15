"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, RotateCcw, Calculator, TrendingUp } from "lucide-react";

interface LogarithmsSimulatorProps {
  language: "ar" | "en";
}

export function LogarithmsSimulator({ language }: LogarithmsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [base, setBase] = useState(10);
  const [xValue, setXValue] = useState(100);
  const [showExponential, setShowExponential] = useState(true);
  const [showLogarithmic, setShowLogarithmic] = useState(true);
  const [calculationType, setCalculationType] = useState<"log" | "exponential">("log");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<number | null>(null);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي اللوغاريتمات",
      description: "استكشف الدوال اللوغاريتمية والأسية",
      base: "الأساس",
      xValue: "القيمة (س)",
      logarithm: "اللوغاريتم",
      exponential: "الدالة الأسية",
      result: "النتيجة",
      calculate: "احسب",
      reset: "إعادة",
      showExponential: "إظهار الدالة الأسية",
      showLogarithmic: "إظهار الدالة اللوغاريتمية",
      logarithmValue: "قيمة اللوغاريتم",
      formula: "الصيغة",
      properties: "خصائص اللوغاريتم",
      prop1: "logₐ(a) = 1",
      prop2: "logₐ(1) = 0",
      prop3: "logₐ(x·y) = logₐ(x) + logₐ(y)",
      prop4: "logₐ(x/y) = logₐ(x) - logₐ(y)",
      prop5: "logₐ(xⁿ) = n·logₐ(x)",
      interpretation: "التفسير الرياضي",
      logDef: "اللوغاريتم هو العملية العكسية للأس",
      enterValue: "أدخل القيمة",
      calculateLog: "احسب اللوغاريتم",
      calculateExp: "احسب الأس",
      logResult: "نتيجة اللوغاريتم",
      expResult: "نتيجة الأس",
    },
    en: {
      title: "Logarithms Simulator",
      description: "Explore logarithmic and exponential functions",
      base: "Base",
      xValue: "Value (x)",
      logarithm: "Logarithm",
      exponential: "Exponential Function",
      result: "Result",
      calculate: "Calculate",
      reset: "Reset",
      showExponential: "Show Exponential",
      showLogarithmic: "Show Logarithmic",
      logarithmValue: "Logarithm Value",
      formula: "Formula",
      properties: "Logarithm Properties",
      prop1: "logₐ(a) = 1",
      prop2: "logₐ(1) = 0",
      prop3: "logₐ(x·y) = logₐ(x) + logₐ(y)",
      prop4: "logₐ(x/y) = logₐ(x) - logₐ(y)",
      prop5: "logₐ(xⁿ) = n·logₐ(x)",
      interpretation: "Mathematical Interpretation",
      logDef: "Logarithm is the inverse operation of exponentiation",
      enterValue: "Enter Value",
      calculateLog: "Calculate Logarithm",
      calculateExp: "Calculate Exponential",
      logResult: "Logarithm Result",
      expResult: "Exponential Result",
    },
  };

  const t = texts[language];

  // Calculate logarithm
  const logBase = (x: number, b: number) => Math.log(x) / Math.log(b);

  // Calculate result
  const handleCalculate = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    if (calculationType === "log") {
      if (val > 0 && base > 0 && base !== 1) {
        setResult(logBase(val, base));
      }
    } else {
      setResult(Math.pow(base, val));
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
    const scale = 40;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for (let x = -10; x <= 10; x++) {
      const px = centerX + x * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }

    for (let y = -10; y <= 10; y++) {
      const py = centerY - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
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
    ctx.textAlign = "center";
    ctx.fillText("x", width - 20, centerY - 10);
    ctx.fillText("y", centerX + 15, 20);

    // Draw exponential function: y = base^x
    if (showExponential) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();

      let firstPoint = true;
      for (let px = -centerX; px <= width - centerX; px += 2) {
        const x = px / scale;
        const y = Math.pow(base, x);
        const py = centerY - y * scale;

        if (py > -100 && py < height + 100 && !isNaN(y) && isFinite(y)) {
          if (firstPoint) {
            ctx.moveTo(px + centerX, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px + centerX, py);
          }
        }
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = "#3b82f6";
      ctx.font = "14px system-ui";
      ctx.fillText(`y = ${base}ˣ`, width - 80, 40);
    }

    // Draw logarithmic function: y = log_base(x)
    if (showLogarithmic && base > 0 && base !== 1) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();

      let firstPoint = true;
      for (let x = 0.01; x <= 10; x += 0.05) {
        const y = logBase(x, base);
        const px = centerX + x * scale;
        const py = centerY - y * scale;

        if (py > -100 && py < height + 100 && !isNaN(y) && isFinite(y)) {
          if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = "#22c55e";
      ctx.font = "14px system-ui";
      ctx.fillText(`y = log${base}(x)`, width - 100, 60);
    }

    // Mark current point
    if (xValue > 0) {
      const logVal = logBase(xValue, base);
      const px = centerX + xValue * scale;
      const py = centerY - logVal * scale;

      if (px > 0 && px < width && py > 0 && py < height) {
        // Point on log curve
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();

        // Dashed lines to axes
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(centerX, py);
        ctx.stroke();

        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = "#ef4444";
        ctx.font = "12px system-ui";
        ctx.fillText(`(${xValue.toFixed(1)}, ${logVal.toFixed(2)})`, px + 10, py - 10);
      }
    }

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [base, xValue, showExponential, showLogarithmic]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setBase(10);
    setXValue(100);
    setShowExponential(true);
    setShowLogarithmic(true);
    setInputValue("");
    setResult(null);
  };

  // Current logarithm value
  const currentLogValue = logBase(xValue, base);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-green-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Base Selection */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={base === 10 ? "default" : "outline"}
            onClick={() => setBase(10)}
            className={base === 10 ? "bg-green-500" : ""}
          >
            log₁₀
          </Button>
          <Button
            variant={base === 2 ? "default" : "outline"}
            onClick={() => setBase(2)}
            className={base === 2 ? "bg-green-500" : ""}
          >
            log₂
          </Button>
          <Button
            variant={base === Math.E ? "default" : "outline"}
            onClick={() => setBase(Math.E)}
            className={base === Math.E ? "bg-green-500" : ""}
          >
            ln
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.base}</label>
              <Badge variant="secondary">{base.toFixed(2)}</Badge>
            </div>
            <Slider value={[base]} onValueChange={([v]) => setBase(v)} min={0.1} max={10} step={0.1} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.xValue}</label>
              <Badge variant="secondary">{xValue}</Badge>
            </div>
            <Slider value={[xValue]} onValueChange={([v]) => setXValue(v)} min={0.1} max={100} step={0.1} />
          </div>
        </div>

        {/* Display Options */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showExponential} onChange={(e) => setShowExponential(e.target.checked)} />
            <label className="text-sm">{t.showExponential}</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showLogarithmic} onChange={(e) => setShowLogarithmic(e.target.checked)} />
            <label className="text-sm">{t.showLogarithmic}</label>
          </div>
        </div>

        {/* Result */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
          <h4 className="font-bold mb-2">{t.logarithmValue}</h4>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-mono">
              log<sub>{base.toFixed(1)}</sub>({xValue.toFixed(1)}) = 
            </p>
            <p className="text-3xl font-mono font-bold text-green-600">
              {currentLogValue.toFixed(4)}
            </p>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {language === "ar"
              ? `هذا يعني أن ${base.toFixed(1)}^${currentLogValue.toFixed(4)} = ${xValue.toFixed(1)}`
              : `This means ${base.toFixed(1)}^${currentLogValue.toFixed(4)} = ${xValue.toFixed(1)}`}
          </p>
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

        {/* Calculator */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-4">
          <h4 className="font-bold">{language === "ar" ? "الآلة الحاسبة" : "Calculator"}</h4>
          
          <div className="flex gap-2">
            <Button
              variant={calculationType === "log" ? "default" : "outline"}
              onClick={() => setCalculationType("log")}
              size="sm"
              className={calculationType === "log" ? "bg-green-500" : ""}
            >
              {t.calculateLog}
            </Button>
            <Button
              variant={calculationType === "exponential" ? "default" : "outline"}
              onClick={() => setCalculationType("exponential")}
              size="sm"
              className={calculationType === "exponential" ? "bg-green-500" : ""}
            >
              {t.calculateExp}
            </Button>
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>{t.enterValue}</Label>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={calculationType === "log" ? "x" : "exponent"}
                className="mt-1"
              />
            </div>
            <Button onClick={handleCalculate} className="bg-green-500 hover:bg-green-600">
              <Calculator className="w-4 h-4 mr-2" />
              {t.calculate}
            </Button>
          </div>

          {result !== null && (
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-slate-500">
                {calculationType === "log" ? t.logResult : t.expResult}
              </p>
              <p className="text-2xl font-mono font-bold">
                {result.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Properties */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <h4 className="font-bold mb-3">{t.properties}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <code className="text-green-600">{t.prop1}</code>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar" ? "لوغاريتم الأساس نفسه يساوي 1" : "Logarithm of base itself equals 1"}
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <code className="text-green-600">{t.prop2}</code>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar" ? "لوغاريتم 1 يساوي 0" : "Logarithm of 1 equals 0"}
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <code className="text-blue-600">{t.prop3}</code>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar" ? "حاصل ضرب الأعداد = مجموع اللوغاريتمات" : "Product rule"}
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <code className="text-blue-600">{t.prop4}</code>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar" ? "قسمة الأعداد = فرق اللوغاريتمات" : "Quotient rule"}
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded md:col-span-2">
              <code className="text-purple-600">{t.prop5}</code>
              <p className="text-xs text-slate-500 mt-1">
                {language === "ar" ? "قوة الأساس تخرج مضروبة" : "Power rule"}
              </p>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h4 className="font-bold mb-2">{t.interpretation}</h4>
          <p className="text-sm">{t.logDef}</p>
          <p className="text-sm mt-2">
            {language === "ar"
              ? `إذا كان ${base.toFixed(1)}ˣ = ${xValue.toFixed(1)}، فإن x = ${currentLogValue.toFixed(4)}`
              : `If ${base.toFixed(1)}ˣ = ${xValue.toFixed(1)}, then x = ${currentLogValue.toFixed(4)}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
