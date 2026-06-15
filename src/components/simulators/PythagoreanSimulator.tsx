"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Triangle, CheckCircle, XCircle, Calculator } from "lucide-react";

interface PythagoreanSimulatorProps {
  language: "ar" | "en";
}

export function PythagoreanSimulator({ language }: PythagoreanSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [sideA, setSideA] = useState(60);
  const [sideB, setSideB] = useState(80);
  const [showSquares, setShowSquares] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي نظرية فيثاغورس",
      description: "استكشف العلاقة بين أضلاع المثلث القائم",
      sideA: "الضلع الأول (أ)",
      sideB: "الضلع الثاني (ب)",
      hypotenuse: "الوتر (ج)",
      theorem: "النظرية",
      theoremText: "أ² + ب² = ج²",
      verification: "التحقق",
      leftSide: "أ² + ب²",
      rightSide: "ج²",
      correct: "صحيح! النظرية متحققة",
      showSquares: "إظهار المربعات",
      hideSquares: "إخفاء المربعات",
      animate: "تحريك الإثبات",
      reset: "إعادة",
      squares: "المربعات",
      squareA: "مساحة مربع أ",
      squareB: "مساحة مربع ب",
      squareC: "مساحة مربع ج",
      sumOfSquares: "مجموع أ² + ب²",
      rightTriangle: "مثلث قائم الزاوية",
      applications: "التطبيقات",
      distance: "المسافة",
      diagonal: "القطر",
      findHypotenuse: "حساب الوتر",
      findSide: "حساب الضلع",
      angle: "الزاوية",
      degrees: "درجة",
    },
    en: {
      title: "Pythagorean Theorem Simulator",
      description: "Explore the relationship between sides of right triangles",
      sideA: "Side A",
      sideB: "Side B",
      hypotenuse: "Hypotenuse (C)",
      theorem: "Theorem",
      theoremText: "a² + b² = c²",
      verification: "Verification",
      leftSide: "a² + b²",
      rightSide: "c²",
      correct: "Correct! Theorem verified",
      showSquares: "Show Squares",
      hideSquares: "Hide Squares",
      animate: "Animate Proof",
      reset: "Reset",
      squares: "Squares",
      squareA: "Square A Area",
      squareB: "Square B Area",
      squareC: "Square C Area",
      sumOfSquares: "Sum of a² + b²",
      rightTriangle: "Right Triangle",
      applications: "Applications",
      distance: "Distance",
      diagonal: "Diagonal",
      findHypotenuse: "Find Hypotenuse",
      findSide: "Find Side",
      angle: "Angle",
      degrees: "degrees",
    },
  };

  const t = texts[language];

  // Calculate hypotenuse
  const sideC = Math.sqrt(sideA * sideA + sideB * sideB);
  const squareA = sideA * sideA;
  const squareB = sideB * sideB;
  const squareC = sideC * sideC;
  const sumOfSquares = squareA + squareB;

  // Calculate angle
  const angleA = Math.atan2(sideB, sideA) * (180 / Math.PI);
  const angleB = 90 - angleA;

  // Verification
  const isCorrect = Math.abs(squareC - sumOfSquares) < 0.01;

  // Animation
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          setIsAnimating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 - 50;
    const centerY = height / 2 + 30;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    const scale = 1.2;
    const a = sideA * scale;
    const b = sideB * scale;
    const c = sideC * scale;

    // Triangle vertices
    const vertexA = { x: centerX, y: centerY };
    const vertexB = { x: centerX + a, y: centerY };
    const vertexC = { x: centerX, y: centerY - b };

    // Draw squares if enabled
    if (showSquares) {
      const progress = animationProgress / 100;

      // Square on side A (bottom)
      ctx.fillStyle = "#3b82f620";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(vertexA.x - 10, vertexA.y - 10, a, a);
      ctx.fill();
      ctx.stroke();

      // Square on side B (left)
      ctx.fillStyle = "#22c55e20";
      ctx.strokeStyle = "#22c55e";
      ctx.beginPath();
      ctx.rect(vertexA.x - b - 10, vertexA.y - b + 10, b, b);
      ctx.fill();
      ctx.stroke();

      // Square on hypotenuse (rotated)
      ctx.fillStyle = "#f59e0b20";
      ctx.strokeStyle = "#f59e0b";
      ctx.save();
      ctx.translate(vertexB.x, vertexB.y);
      ctx.rotate(-Math.atan2(b, a));
      ctx.beginPath();
      ctx.rect(0, -c, c, c);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Animate squares merging
      if (isAnimating && progress > 0.5) {
        const mergeProgress = (progress - 0.5) * 2;
        ctx.globalAlpha = mergeProgress;
        
        // Show that a² + b² = c² visually
        ctx.fillStyle = "#8b5cf640";
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = 3;
        
        // Highlight the equality
        ctx.beginPath();
        ctx.arc(width - 100, height / 2, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.globalAlpha = 1;
      }
    }

    // Draw the triangle
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(vertexA.x, vertexA.y);
    ctx.lineTo(vertexB.x, vertexB.y);
    ctx.lineTo(vertexC.x, vertexC.y);
    ctx.closePath();
    ctx.stroke();

    // Fill triangle
    ctx.fillStyle = "#6366f120";
    ctx.fill();

    // Draw right angle marker
    const markerSize = 15;
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vertexA.x + markerSize, vertexA.y);
    ctx.lineTo(vertexA.x + markerSize, vertexA.y - markerSize);
    ctx.lineTo(vertexA.x, vertexA.y - markerSize);
    ctx.stroke();

    // Draw vertices
    const vertices = [
      { point: vertexA, label: "A" },
      { point: vertexB, label: "B" },
      { point: vertexC, label: "C" },
    ];

    vertices.forEach((v) => {
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(v.point.x, v.point.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#334155";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      const labelOffset = 20;
      ctx.fillText(v.label, v.point.x + (v.label === "B" ? labelOffset : v.label === "C" ? -labelOffset : -labelOffset), 
                          v.point.y + (v.label === "A" ? labelOffset : -labelOffset));
    });

    // Draw side labels
    ctx.font = "bold 12px system-ui";
    ctx.fillStyle = "#3b82f6";
    ctx.textAlign = "center";
    ctx.fillText(`a = ${sideA}`, vertexA.x + a / 2, vertexA.y + 25);

    ctx.fillStyle = "#22c55e";
    ctx.fillText(`b = ${sideB}`, vertexA.x - 25, vertexA.y - b / 2);

    ctx.fillStyle = "#f59e0b";
    const midHypX = (vertexB.x + vertexC.x) / 2 + 15;
    const midHypY = (vertexB.y + vertexC.y) / 2;
    ctx.fillText(`c = ${sideC.toFixed(1)}`, midHypX, midHypY);

  }, [sideA, sideB, sideC, showSquares, animationProgress, isAnimating]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setSideA(60);
    setSideB(80);
    setShowSquares(true);
    setAnimationProgress(0);
    setIsAnimating(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Triangle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Theorem Display */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 p-4 rounded-lg text-center">
          <p className="text-sm text-slate-500 mb-1">{t.theorem}</p>
          <code className="text-2xl font-bold text-violet-600">{t.theoremText}</code>
        </div>

        {/* Side Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.sideA}</label>
              <Badge className="bg-blue-500">{sideA}</Badge>
            </div>
            <Slider
              value={[sideA]}
              onValueChange={([value]) => setSideA(value)}
              min={20}
              max={150}
              step={1}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.sideB}</label>
              <Badge className="bg-emerald-500">{sideB}</Badge>
            </div>
            <Slider
              value={[sideB]}
              onValueChange={([value]) => setSideB(value)}
              min={20}
              max={150}
              step={1}
            />
          </div>
        </div>

        {/* Hypotenuse Display */}
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-between">
          <span className="font-semibold">{t.hypotenuse}</span>
          <Badge className="bg-amber-500 text-lg px-4 py-1">{sideC.toFixed(2)}</Badge>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowSquares(!showSquares)}
          >
            {showSquares ? t.hideSquares : t.showSquares}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAnimationProgress(0);
              setIsAnimating(true);
            }}
            disabled={isAnimating}
          >
            <Calculator className="w-4 h-4 mr-2" />
            {t.animate}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={350} className="w-full" />
        </div>

        {/* Verification */}
        <div className={`p-4 rounded-lg ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950" : "bg-red-50 dark:bg-red-950"}`}>
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <span className={`font-bold ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
              {isCorrect ? t.correct : "Error"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-500">{t.leftSide}</p>
              <p className="font-bold text-lg">{squareA} + {squareB} = {sumOfSquares}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500">{t.rightSide}</p>
              <p className="font-bold text-lg">{squareC.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Squares Info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-center">
            <p className="text-sm text-slate-500">{t.squareA}</p>
            <p className="font-bold text-blue-600">{squareA}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-center">
            <p className="text-sm text-slate-500">{t.squareB}</p>
            <p className="font-bold text-emerald-600">{squareB}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 text-center">
            <p className="text-sm text-slate-500">{t.squareC}</p>
            <p className="font-bold text-amber-600">{squareC.toFixed(2)}</p>
          </div>
        </div>

        {/* Angles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950 text-center">
            <p className="text-sm text-slate-500">∠A</p>
            <p className="font-bold text-purple-600">{angleA.toFixed(1)}°</p>
          </div>
          <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950 text-center">
            <p className="text-sm text-slate-500">∠B</p>
            <p className="font-bold text-pink-600">{angleB.toFixed(1)}°</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
