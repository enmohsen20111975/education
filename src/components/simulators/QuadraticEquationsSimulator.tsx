"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Square, RotateCcw, Play, Calculator } from "lucide-react";

interface QuadraticEquationsSimulatorProps {
  language: "ar" | "en";
}

export function QuadraticEquationsSimulator({ language }: QuadraticEquationsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for ax² + bx + c = 0
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const [showSolution, setShowSolution] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المعادلات التربيعية",
      description: "تعلم حل المعادلات التربيعية باستخدام الطرق المختلفة",
      equation: "المعادلة",
      coefficientA: "المعامل (أ)",
      coefficientB: "المعامل (ب)",
      coefficientC: "الثابت (ج)",
      solve: "حل المعادلة",
      reset: "إعادة",
      discriminant: "المميز (Δ = ب² - 4أ‌ج)",
      solution: "الحل",
      roots: "الجذور",
      twoRealRoots: "جذران حقيقيان مختلفان",
      oneRealRoot: "جذر حقيقي واحد (مضاعف)",
      noRealRoots: "لا توجد جذور حقيقية",
      steps: "خطوات الحل",
      step1: "حساب المميز",
      step2: "تطبيق الصيغة العامة",
      step3: "النتائج",
      formula: "الصيغة العامة",
      vertex: "رأس القطع المكافئ",
      axisOfSymmetry: "محور التناظر",
      interpretation: "التفسير الرياضي",
    },
    en: {
      title: "Quadratic Equations Simulator",
      description: "Learn to solve quadratic equations using different methods",
      equation: "Equation",
      coefficientA: "Coefficient (a)",
      coefficientB: "Coefficient (b)",
      coefficientC: "Constant (c)",
      solve: "Solve Equation",
      reset: "Reset",
      discriminant: "Discriminant (Δ = b² - 4ac)",
      solution: "Solution",
      roots: "Roots",
      twoRealRoots: "Two distinct real roots",
      oneRealRoot: "One real root (double)",
      noRealRoots: "No real roots",
      steps: "Solution Steps",
      step1: "Calculate Discriminant",
      step2: "Apply Quadratic Formula",
      step3: "Results",
      formula: "Quadratic Formula",
      vertex: "Parabola Vertex",
      axisOfSymmetry: "Axis of Symmetry",
      interpretation: "Mathematical Interpretation",
    },
  };

  const t = texts[language];

  // Calculate discriminant
  const discriminant = b * b - 4 * a * c;

  // Calculate roots
  const getRoots = useCallback(() => {
    if (discriminant < 0) {
      return { type: "complex" as const };
    }
    
    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    
    return { type: "real" as const, x1, x2 };
  }, [a, b, discriminant]);

  // Get root type description
  const getRootTypeDescription = () => {
    if (discriminant > 0) return t.twoRealRoots;
    if (discriminant === 0) return t.oneRealRoot;
    return t.noRealRoots;
  };

  // Solve equation with animation
  const solveEquation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    setShowSolution(false);

    const steps = [1, 2, 3];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAnimationStep(steps[currentStep]);
        currentStep++;
      } else {
        setShowSolution(true);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  // Draw canvas - Parabola visualization
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const xRange = 10;
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
    }

    for (let y = -xRange; y <= xRange; y++) {
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

    // Draw parabola
    const calculateY = (x: number) => a * x * x + b * x + c;

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px += 1) {
      const x = (px - centerX) / scale;
      const y = calculateY(x);
      const py = centerY - y * scale;

      if (py > -1000 && py < height + 1000) {
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw roots if they exist and solution is shown
    if (showSolution) {
      const roots = getRoots();
      
      if (roots.type === "real") {
        // Root 1
        const x1Px = centerX + roots.x1 * scale;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(x1Px, centerY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 12px system-ui";
        ctx.fillText(`x₁ = ${roots.x1.toFixed(2)}`, x1Px + 10, centerY - 15);

        // Root 2 (if different)
        if (Math.abs(roots.x1 - roots.x2) > 0.01) {
          const x2Px = centerX + roots.x2 * scale;
          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(x2Px, centerY, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillText(`x₂ = ${roots.x2.toFixed(2)}`, x2Px + 10, centerY - 15);
        }
      }

      // Draw vertex
      const vertexX = -b / (2 * a);
      const vertexY = calculateY(vertexX);
      const vxPx = centerX + vertexX * scale;
      const vyPx = centerY - vertexY * scale;

      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(vxPx, vyPx, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f97316";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(`(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, vxPx + 10, vyPx - 10);

      // Draw axis of symmetry
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(vxPx, 0);
      ctx.lineTo(vxPx, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Equation label
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    const equationStr = `${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0`;
    ctx.fillText(equationStr, centerX, 30);

  }, [a, b, c, showSolution, getRoots]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setA(1);
    setB(-3);
    setC(2);
    setShowSolution(false);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  const roots = getRoots();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Square className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Equation Display */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
          <p className="text-sm text-slate-500 mb-2">{language === "ar" ? "الصيغة: أ‌س² + ب‌س + ج = 0" : "Form: ax² + bx + c = 0"}</p>
          <div className="flex items-center justify-center gap-2 text-3xl font-mono font-bold">
            <span className="text-rose-500">{a}</span>
            <span>{language === "ar" ? "س²" : "x²"}</span>
            <span className="text-slate-400">{b >= 0 ? "+" : ""}</span>
            <span className="text-pink-500">{b}</span>
            <span>{language === "ar" ? "س" : "x"}</span>
            <span className="text-slate-400">{c >= 0 ? "+" : ""}</span>
            <span className="text-purple-500">{c}</span>
            <span className="text-slate-400">= 0</span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientA}</label>
              <Badge variant="secondary">{a}</Badge>
            </div>
            <Slider value={[a]} onValueChange={([v]) => setA(v)} min={-5} max={5} step={1} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientB}</label>
              <Badge variant="secondary">{b}</Badge>
            </div>
            <Slider value={[b]} onValueChange={([v]) => setB(v)} min={-10} max={10} step={1} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientC}</label>
              <Badge variant="secondary">{c}</Badge>
            </div>
            <Slider value={[c]} onValueChange={([v]) => setC(v)} min={-10} max={10} step={1} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button onClick={solveEquation} disabled={isAnimating || a === 0} className="bg-rose-500 hover:bg-rose-600">
            <Play className="w-4 h-4 mr-2" />
            {t.solve}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={350} className="w-full bg-white" />
        </div>

        {/* Discriminant */}
        <div className={`p-4 rounded-lg ${
          discriminant > 0 ? "bg-green-50 dark:bg-green-950" :
          discriminant === 0 ? "bg-yellow-50 dark:bg-yellow-950" :
          "bg-red-50 dark:bg-red-950"
        }`}>
          <h4 className="font-bold mb-2">{t.discriminant}</h4>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-mono font-bold">
              Δ = b² - 4ac = {b}² - 4({a})({c}) = {discriminant.toFixed(2)}
            </div>
          </div>
          <p className="mt-2 font-medium">{getRootTypeDescription()}</p>
        </div>

        {/* Solution Steps */}
        {(animationStep > 0 || showSolution) && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{t.steps}</h3>
            
            {animationStep >= 1 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="font-bold">{t.step1}</p>
                <p className="font-mono">Δ = b² - 4ac = {b}² - 4({a})({c}) = {discriminant}</p>
              </div>
            )}

            {animationStep >= 2 && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="font-bold">{t.step2}</p>
                <p className="font-mono text-sm">
                  x = (-b ± √Δ) / 2a = ({-b} ± √{discriminant.toFixed(2)}) / {2 * a}
                </p>
              </div>
            )}

            {animationStep >= 3 && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950 rounded-lg">
                <p className="font-bold">{t.step3}</p>
                {roots.type === "real" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">x₁</p>
                      <p className="text-2xl font-mono font-bold text-red-500">{roots.x1.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">x₂</p>
                      <p className="text-2xl font-mono font-bold text-green-500">{roots.x2.toFixed(4)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-purple-500">
                    {language === "ar" 
                      ? "الجذور مركبة: لا يوجد تقاطع مع محور السينات"
                      : "Complex roots: No intersection with x-axis"}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Vertex info */}
        {showSolution && a !== 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-slate-500">{t.vertex}</p>
              <p className="font-mono font-bold">
                ({(-b / (2 * a)).toFixed(2)}, {(a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c).toFixed(2)})
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
              <p className="text-sm text-slate-500">{t.axisOfSymmetry}</p>
              <p className="font-mono font-bold">{language === "ar" ? `س = ${(-b / (2 * a)).toFixed(2)}` : `x = ${(-b / (2 * a)).toFixed(2)}`}</p>
            </div>
          </div>
        )}

        {/* Formula Reference */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h4 className="font-bold mb-2">{t.formula}</h4>
          <p className="text-2xl font-mono text-center">
            x = (-b ± √(b² - 4ac)) / 2a
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
