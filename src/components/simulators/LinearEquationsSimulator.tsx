"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Minus, Plus, Divide, X } from "lucide-react";

interface LinearEquationsSimulatorProps {
  language: "ar" | "en";
}

export function LinearEquationsSimulator({ language }: LinearEquationsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for equation ax + b = c
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(7);
  const [showSolution, setShowSolution] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المعادلات الخطية",
      description: "تعلم حل المعادلات الخطية خطوة بخطوة",
      equation: "المعادلة",
      coefficient: "المعامل (أ)",
      constant: "الثابت (ب)",
      result: "النتيجة (ج)",
      solve: "حل المعادلة",
      reset: "إعادة",
      solution: "الحل",
      steps: "خطوات الحل",
      step1: "نطرح ب من الطرفين",
      step2: "نقسم على أ",
      step3: "النتيجة النهائية",
      linearEquation: "معادلة خطية",
      form: "الصيغة: أ‌س + ب = ج",
      value: "القيمة",
      checkAnswer: "تحقق من الحل",
      correct: "صحيح!",
      explanation: "التفسير الرياضي",
      balance: "ميزان المعادلة",
      leftSide: "الطرف الأيسر",
      rightSide: "الطرف الأيمن",
    },
    en: {
      title: "Linear Equations Simulator",
      description: "Learn to solve linear equations step by step",
      equation: "Equation",
      coefficient: "Coefficient (a)",
      constant: "Constant (b)",
      result: "Result (c)",
      solve: "Solve Equation",
      reset: "Reset",
      solution: "Solution",
      steps: "Solution Steps",
      step1: "Subtract b from both sides",
      step2: "Divide by a",
      step3: "Final Result",
      linearEquation: "Linear Equation",
      form: "Form: ax + b = c",
      value: "Value",
      checkAnswer: "Check Solution",
      correct: "Correct!",
      explanation: "Mathematical Explanation",
      balance: "Equation Balance",
      leftSide: "Left Side",
      rightSide: "Right Side",
    },
  };

  const t = texts[language];

  // Calculate solution
  const solution = (c - b) / a;

  // Animation steps
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

  // Draw balance visualization
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw balance scale
    const pivotX = width / 2;
    const pivotY = 60;
    const beamLength = 200;
    const tilt = showSolution ? 0 : (Math.sin(Date.now() / 500) * 0.05);

    // Stand
    ctx.fillStyle = "#64748b";
    ctx.fillRect(pivotX - 10, pivotY, 20, height - pivotY - 80);

    // Base
    ctx.fillRect(pivotX - 60, height - 80, 120, 10);

    // Beam
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(tilt);

    ctx.fillStyle = "#475569";
    ctx.fillRect(-beamLength, -5, beamLength * 2, 10);

    // Left pan (ax + b)
    ctx.fillStyle = "#3b82f6";
    const leftPanY = 30;
    ctx.beginPath();
    ctx.moveTo(-beamLength + 20, 0);
    ctx.lineTo(-beamLength, leftPanY);
    ctx.lineTo(-beamLength + 40, leftPanY);
    ctx.lineTo(-beamLength + 20, 0);
    ctx.fill();

    // Right pan (c)
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(beamLength - 20, 0);
    ctx.lineTo(beamLength, leftPanY);
    ctx.lineTo(beamLength - 40, leftPanY);
    ctx.lineTo(beamLength - 20, 0);
    ctx.fill();

    ctx.restore();

    // Labels
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";

    // Left side label
    ctx.fillStyle = "#3b82f6";
    const leftText = `${a}x + ${b}`;
    ctx.fillText(leftText, pivotX - beamLength + 20, pivotY + 80);

    // Right side label
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`${c}`, pivotX + beamLength - 20, pivotY + 80);

    // Equation in middle
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 24px system-ui";
    ctx.fillText(`${a}x + ${b} = ${c}`, pivotX, height - 30);

    // Solution visualization
    if (showSolution) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 20px system-ui";
      ctx.fillText(`${language === "ar" ? "س" : "x"} = ${solution.toFixed(2)}`, pivotX, height / 2 + 20);
    }

  }, [a, b, c, showSolution, solution, language]);

  useEffect(() => {
    drawCanvas();
    const interval = setInterval(drawCanvas, 50);
    return () => clearInterval(interval);
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setA(2);
    setB(3);
    setC(7);
    setShowSolution(false);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  // Get step content
  const getStepContent = (step: number) => {
    if (step === 0) return null;
    
    const newLeft = animationStep >= 1 ? a : a;
    const newRight = animationStep >= 1 ? c - b : c;
    const newDivLeft = animationStep >= 2 ? 1 : a;
    const finalResult = animationStep >= 3 ? solution : 0;

    switch (step) {
      case 1:
        return (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="font-mono text-lg">
              {language === "ar" 
                ? `${a}س = ${c} - ${b} = ${c - b}`
                : `${a}x = ${c} - ${b} = ${c - b}`}
            </p>
            <p className="text-sm text-slate-500 mt-1">{t.step1}</p>
          </div>
        );
      case 2:
        return (
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="font-mono text-lg">
              {language === "ar"
                ? `س = ${c - b} ÷ ${a} = ${((c - b) / a).toFixed(2)}`
                : `x = ${c - b} ÷ ${a} = ${((c - b) / a).toFixed(2)}`}
            </p>
            <p className="text-sm text-slate-500 mt-1">{t.step2}</p>
          </div>
        );
      case 3:
        return (
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
            <p className="font-mono text-lg font-bold">
              {language === "ar" ? `س = ${solution.toFixed(2)}` : `x = ${solution.toFixed(2)}`}
            </p>
            <p className="text-sm text-slate-500 mt-1">{t.step3}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Minus className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Equation Display */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl text-center">
          <p className="text-sm text-slate-500 mb-2">{t.form}</p>
          <div className="flex items-center justify-center gap-4 text-3xl font-mono font-bold">
            <span className="text-blue-500">{a}</span>
            <span>{language === "ar" ? "س" : "x"}</span>
            <span className="text-slate-400">+</span>
            <span className="text-green-500">{b}</span>
            <span className="text-slate-400">=</span>
            <span className="text-red-500">{c}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficient}</label>
              <Badge variant="secondary">{a}</Badge>
            </div>
            <Slider value={[a]} onValueChange={([v]) => setA(v)} min={1} max={10} step={1} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.constant}</label>
              <Badge variant="secondary">{b}</Badge>
            </div>
            <Slider value={[b]} onValueChange={([v]) => setB(v)} min={0} max={20} step={1} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.result}</label>
              <Badge variant="secondary">{c}</Badge>
            </div>
            <Slider value={[c]} onValueChange={([v]) => setC(v)} min={1} max={30} step={1} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={solveEquation} 
            disabled={isAnimating}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Play className="w-4 h-4 mr-2" />
            {t.solve}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas - Balance Scale */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={300} className="w-full bg-slate-50" />
        </div>

        {/* Solution Steps */}
        {(animationStep > 0 || showSolution) && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">{t.steps}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {animationStep >= 1 && getStepContent(1)}
              {animationStep >= 2 && getStepContent(2)}
              {animationStep >= 3 && getStepContent(3)}
            </div>
          </div>
        )}

        {/* Mathematical Explanation */}
        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
          <h4 className="font-bold mb-2">{t.explanation}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {language === "ar" 
              ? `المعادلة الخطية ${a}س + ${b} = ${c} تمثل خطاً مستقيماً. الحل س = ${solution.toFixed(2)} هو النقطة التي يتقاطع فيها الخط مع محور السينات.`
              : `The linear equation ${a}x + ${b} = ${c} represents a straight line. The solution x = ${solution.toFixed(2)} is where the line intersects the x-axis.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
