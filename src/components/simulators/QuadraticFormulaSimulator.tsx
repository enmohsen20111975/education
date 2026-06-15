"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw, Play, Lightbulb, SquareRoot } from "lucide-react";

interface QuadraticFormulaSimulatorProps {
  language: "ar" | "en";
}

export function QuadraticFormulaSimulator({ language }: QuadraticFormulaSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [manualInput, setManualInput] = useState({ a: "1", b: "-5", c: "6" });

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الصيغة العامة",
      description: "تعلم تطبيق الصيغة العامة خطوة بخطوة",
      formula: "الصيغة العامة",
      coefficientA: "المعامل أ",
      coefficientB: "المعامل ب",
      constantC: "الثابت ج",
      calculate: "احسب",
      reset: "إعادة",
      step1: "تحديد المعاملات",
      step2: "حساب المميز",
      step3: "تحديد نوع الجذور",
      step4: "تطبيق الصيغة",
      step5: "النتائج النهائية",
      discriminant: "المميز",
      discriminantValue: "قيمة المميز",
      twoRealRoots: "جذران حقيقيان مختلفان",
      oneRealRoot: "جذر حقيقي واحد (مضاعف)",
      complexRoots: "جذران مركبان",
      root1: "الجذر الأول",
      root2: "الجذر الثاني",
      enterValues: "أدخل القيم",
      applyFormula: "تطبيق الصيغة",
      interpretation: "التفسير الرياضي",
      plus: "باستخدام إشارة +",
      minus: "باستخدام إشارة -",
      explanation1: "الصيغة العامة تستخدم لحل أي معادلة تربيعية من الصيغة أ‌س² + ب‌س + ج = 0",
      explanation2: "المميز (Δ = ب² - 4أ‌ج) يحدد نوع الجذور",
      explanation3: "إذا كان Δ > 0: جذران حقيقيان مختلفان",
      explanation4: "إذا كان Δ = 0: جذر حقيقي واحد (مضاعف)",
      explanation5: "إذا كان Δ < 0: جذران مركبان",
    },
    en: {
      title: "Quadratic Formula Simulator",
      description: "Learn to apply the quadratic formula step by step",
      formula: "Quadratic Formula",
      coefficientA: "Coefficient a",
      coefficientB: "Coefficient b",
      constantC: "Constant c",
      calculate: "Calculate",
      reset: "Reset",
      step1: "Identify Coefficients",
      step2: "Calculate Discriminant",
      step3: "Determine Root Type",
      step4: "Apply Formula",
      step5: "Final Results",
      discriminant: "Discriminant",
      discriminantValue: "Discriminant Value",
      twoRealRoots: "Two distinct real roots",
      oneRealRoot: "One real root (double)",
      complexRoots: "Two complex roots",
      root1: "First Root",
      root2: "Second Root",
      enterValues: "Enter Values",
      applyFormula: "Apply Formula",
      interpretation: "Mathematical Interpretation",
      plus: "Using + sign",
      minus: "Using - sign",
      explanation1: "The quadratic formula solves any quadratic equation of form ax² + bx + c = 0",
      explanation2: "The discriminant (Δ = b² - 4ac) determines the type of roots",
      explanation3: "If Δ > 0: Two distinct real roots",
      explanation4: "If Δ = 0: One real root (double)",
      explanation5: "If Δ < 0: Two complex roots",
    },
  };

  const t = texts[language];

  // Calculate values
  const discriminant = b * b - 4 * a * c;
  const sqrtDiscriminant = discriminant >= 0 ? Math.sqrt(discriminant) : null;

  // Get root type
  const getRootType = () => {
    if (discriminant > 0) return "two-real";
    if (discriminant === 0) return "one-real";
    return "complex";
  };

  // Calculate roots
  const getRoots = () => {
    if (discriminant < 0) {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      return { type: "complex", real: realPart, imag: imagPart };
    }
    
    const x1 = (-b + sqrtDiscriminant!) / (2 * a);
    const x2 = (-b - sqrtDiscriminant!) / (2 * a);
    return { type: "real", x1, x2 };
  };

  // Animate steps
  const animateSteps = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setShowSteps(true);

    const steps = [1, 2, 3, 4, 5];
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        stepIndex++;
      } else {
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 800);
  };

  // Apply manual input
  const applyManualInput = () => {
    const newA = parseFloat(manualInput.a) || 1;
    const newB = parseFloat(manualInput.b) || 0;
    const newC = parseFloat(manualInput.c) || 0;
    
    if (newA !== 0) {
      setA(newA);
      setB(newB);
      setC(newC);
    }
  };

  // Draw canvas - Formula visualization
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw the quadratic formula
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 32px system-ui";
    ctx.textAlign = "center";
    
    // Formula: x = (-b ± √(b² - 4ac)) / 2a
    const formulaY = 60;
    
    // x =
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("x", width / 2 - 180, formulaY);
    ctx.fillStyle = "#1e293b";
    ctx.fillText("=", width / 2 - 140, formulaY);

    // Fraction line
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, formulaY + 15);
    ctx.lineTo(width / 2 + 160, formulaY + 15);
    ctx.stroke();

    // Numerator: -b ± √(b² - 4ac)
    ctx.font = "bold 20px system-ui";
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`-${b}`, width / 2 - 90, formulaY - 5);
    ctx.fillStyle = "#1e293b";
    ctx.fillText("±", width / 2 - 50, formulaY - 5);
    
    // Square root symbol with discriminant
    ctx.fillStyle = "#f97316";
    ctx.font = "bold 18px system-ui";
    ctx.fillText(`√(${b}² - 4×${a}×${c})`, width / 2 + 20, formulaY - 5);

    // Denominator: 2a
    ctx.fillStyle = "#ec4899";
    ctx.font = "bold 20px system-ui";
    ctx.fillText(`2×${a}`, width / 2 + 20, formulaY + 40);

    // Highlight current step
    if (showSteps && currentStep >= 2) {
      // Highlight discriminant
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.strokeRect(width / 2 - 30, formulaY - 30, 150, 30);
      
      // Show discriminant value
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 16px system-ui";
      ctx.fillText(`Δ = ${discriminant.toFixed(2)}`, width / 2 + 180, formulaY);
    }

    // Results section
    if (showSteps && currentStep >= 5) {
      const roots = getRoots();
      const resultY = 150;
      
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 24px system-ui";
      ctx.fillText(language === "ar" ? "النتائج" : "Results", width / 2, resultY);
      
      ctx.font = "20px system-ui";
      
      if (roots.type === "real") {
        ctx.fillStyle = "#3b82f6";
        ctx.fillText(`x₁ = ${roots.x1.toFixed(4)}`, width / 2 - 100, resultY + 40);
        ctx.fillStyle = "#22c55e";
        ctx.fillText(`x₂ = ${roots.x2.toFixed(4)}`, width / 2 + 100, resultY + 40);
      } else {
        ctx.fillStyle = "#8b5cf6";
        ctx.fillText(`x₁ = ${roots.real.toFixed(4)} + ${roots.imag.toFixed(4)}i`, width / 2, resultY + 40);
        ctx.fillText(`x₂ = ${roots.real.toFixed(4)} - ${roots.imag.toFixed(4)}i`, width / 2, resultY + 70);
      }
    }

    // Step indicators
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "left";
    
    const steps = [
      { num: 1, text: t.step1, done: currentStep >= 1 },
      { num: 2, text: t.step2, done: currentStep >= 2 },
      { num: 3, text: t.step3, done: currentStep >= 3 },
      { num: 4, text: t.step4, done: currentStep >= 4 },
      { num: 5, text: t.step5, done: currentStep >= 5 },
    ];

    steps.forEach((step, index) => {
      const y = 250 + index * 25;
      ctx.fillStyle = step.done ? "#22c55e" : "#94a3b8";
      ctx.fillText(`${step.num}. ${step.text}`, 20, y);
    });

  }, [a, b, c, discriminant, showSteps, currentStep, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setA(1);
    setB(-5);
    setC(6);
    setManualInput({ a: "1", b: "-5", c: "6" });
    setShowSteps(false);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const rootType = getRootType();
  const roots = getRoots();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-indigo-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Manual Input */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-4">
          <h4 className="font-bold">{t.enterValues}</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>{t.coefficientA}</Label>
              <Input
                type="number"
                value={manualInput.a}
                onChange={(e) => setManualInput({ ...manualInput, a: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t.coefficientB}</Label>
              <Input
                type="number"
                value={manualInput.b}
                onChange={(e) => setManualInput({ ...manualInput, b: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t.constantC}</Label>
              <Input
                type="number"
                value={manualInput.c}
                onChange={(e) => setManualInput({ ...manualInput, c: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={applyManualInput} variant="outline">
            {t.applyFormula}
          </Button>
        </div>

        {/* Sliders */}
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
              <label className="font-medium">{t.constantC}</label>
              <Badge variant="secondary">{c}</Badge>
            </div>
            <Slider value={[c]} onValueChange={([v]) => setC(v)} min={-10} max={10} step={1} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button onClick={animateSteps} disabled={isAnimating || a === 0} className="bg-indigo-500 hover:bg-indigo-600">
            <Play className="w-4 h-4 mr-2" />
            {t.calculate}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={380} className="w-full bg-slate-50" />
        </div>

        {/* Step Details */}
        {showSteps && (
          <div className="space-y-4">
            {/* Step 1 */}
            {currentStep >= 1 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-bold">{t.step1}</h4>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <span className="text-slate-500">a = </span>
                    <span className="font-bold text-blue-500">{a}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">b = </span>
                    <span className="font-bold text-green-500">{b}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">c = </span>
                    <span className="font-bold text-red-500">{c}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep >= 2 && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-bold">{t.step2}</h4>
                <p className="font-mono mt-2">
                  Δ = b² - 4ac = ({b})² - 4({a})({c}) = {b*b} - {4*a*c} = <span className="font-bold text-2xl">{discriminant}</span>
                </p>
              </div>
            )}

            {/* Step 3 */}
            {currentStep >= 3 && (
              <div className={`p-4 rounded-lg ${
                rootType === "two-real" ? "bg-green-100 dark:bg-green-950" :
                rootType === "one-real" ? "bg-yellow-100 dark:bg-yellow-950" :
                "bg-purple-100 dark:bg-purple-950"
              }`}>
                <h4 className="font-bold">{t.step3}</h4>
                <p className="font-bold mt-2">
                  {rootType === "two-real" ? t.twoRealRoots :
                   rootType === "one-real" ? t.oneRealRoot :
                   t.complexRoots}
                </p>
              </div>
            )}

            {/* Step 4 */}
            {currentStep >= 4 && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <h4 className="font-bold">{t.step4}</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-slate-500">{t.plus}</p>
                    <p className="font-mono">
                      x₁ = ({-b} + √{discriminant}) / {2*a}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{t.minus}</p>
                    <p className="font-mono">
                      x₂ = ({-b} - √{discriminant}) / {2*a}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentStep >= 5 && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                <h4 className="font-bold">{t.step5}</h4>
                {roots.type === "real" ? (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-slate-500">{t.root1}</p>
                      <p className="text-2xl font-mono font-bold text-blue-500">{roots.x1.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t.root2}</p>
                      <p className="text-2xl font-mono font-bold text-green-500">{roots.x2.toFixed(4)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-xl font-mono text-purple-500">
                      x₁ = {roots.real.toFixed(4)} + {roots.imag.toFixed(4)}i
                    </p>
                    <p className="text-xl font-mono text-purple-500">
                      x₂ = {roots.real.toFixed(4)} - {roots.imag.toFixed(4)}i
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mathematical Explanation */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            {t.interpretation}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>• {t.explanation1}</li>
            <li>• {t.explanation2}</li>
            <li>• {t.explanation3}</li>
            <li>• {t.explanation4}</li>
            <li>• {t.explanation5}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
