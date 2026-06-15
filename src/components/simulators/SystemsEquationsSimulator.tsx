"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Layers, RotateCcw, Play, Calculator, GitMerge } from "lucide-react";

interface SystemsEquationsSimulatorProps {
  language: "ar" | "en";
}

type SolutionMethod = "graphical" | "substitution" | "elimination";

export function SystemsEquationsSimulator({ language }: SystemsEquationsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // System of equations: 
  // a1x + b1y = c1
  // a2x + b2y = c2
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);

  const [a2, setA2] = useState(2);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(4);

  const [method, setMethod] = useState<SolutionMethod>("graphical");
  const [showSolution, setShowSolution] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [xRange, setXRange] = useState(10);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي أنظمة المعادلات",
      description: "حل أنظمة المعادلات الخطية بطريقة مختلفة",
      equation1: "المعادلة الأولى",
      equation2: "المعادلة الثانية",
      coefficient: "المعامل",
      constant: "الثابت",
      solve: "حل النظام",
      reset: "إعادة",
      solution: "الحل",
      graphical: "الطريقة البيانية",
      substitution: "طريقة التعويض",
      elimination: "طريقة الحذف",
      uniqueSolution: "حل وحيد",
      noSolution: "لا يوجد حل (خطان متوازيان)",
      infiniteSolutions: "عدد لا نهائي من الحلول (نفس الخط)",
      xValue: "قيمة س",
      yValue: "قيمة ص",
      steps: "خطوات الحل",
      step1: "كتابة المعادلتين",
      step2: "حل المعادلة",
      step3: "التعويض",
      step4: "الحل النهائي",
      interpretation: "التفسير الرياضي",
      intersection: "نقطة التقاطع",
    },
    en: {
      title: "Systems of Equations Simulator",
      description: "Solve systems of linear equations using different methods",
      equation1: "First Equation",
      equation2: "Second Equation",
      coefficient: "Coefficient",
      constant: "Constant",
      solve: "Solve System",
      reset: "Reset",
      solution: "Solution",
      graphical: "Graphical Method",
      substitution: "Substitution Method",
      elimination: "Elimination Method",
      uniqueSolution: "Unique solution",
      noSolution: "No solution (parallel lines)",
      infiniteSolutions: "Infinite solutions (same line)",
      xValue: "X value",
      yValue: "Y value",
      steps: "Solution Steps",
      step1: "Write equations",
      step2: "Solve equation",
      step3: "Substitute",
      step4: "Final solution",
      interpretation: "Mathematical Interpretation",
      intersection: "Intersection Point",
    },
  };

  const t = texts[language];

  // Calculate solution
  const getSolution = useCallback(() => {
    // Using Cramer's rule
    const det = a1 * b2 - a2 * b1;
    
    if (det === 0) {
      // Check if same line or parallel
      const ratio1 = a1 / a2;
      const ratio2 = b1 / b2;
      const ratio3 = c1 / c2;
      
      if (Math.abs(ratio1 - ratio2) < 0.001 && Math.abs(ratio2 - ratio3) < 0.001) {
        return { type: "infinite" as const };
      }
      return { type: "none" as const };
    }

    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;

    return { type: "unique" as const, x, y };
  }, [a1, b1, c1, a2, b2, c2]);

  // Animate solution
  const solveEquations = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    setShowSolution(false);

    const steps = [1, 2, 3, 4];
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setAnimationStep(steps[stepIndex]);
        stepIndex++;
      } else {
        setShowSolution(true);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 700);
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

    // Axis labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("x", width - 20, centerY - 10);
    ctx.fillText("y", centerX + 15, 20);

    // Helper to draw line from ax + by = c
    const drawLine = (a: number, b: number, c: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      // y = (c - ax) / b
      for (let px = 0; px <= width; px += 1) {
        const x = (px - centerX) / scale;
        let y: number;
        
        if (b !== 0) {
          y = (c - a * x) / b;
        } else {
          // Vertical line: x = c/a
          const verticalX = c / a;
          if (Math.abs(x - verticalX) < 0.1) {
            ctx.moveTo(centerX + verticalX * scale, 0);
            ctx.lineTo(centerX + verticalX * scale, height);
          }
          continue;
        }

        const py = centerY - y * scale;

        if (py > -1000 && py < height + 1000) {
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = color;
      ctx.font = "12px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(label, 20, color === "#3b82f6" ? 30 : 50);
    };

    // Draw both lines
    drawLine(a1, b1, c1, "#3b82f6", language === "ar" ? "المعادلة 1" : "Eq 1");
    drawLine(a2, b2, c2, "#22c55e", language === "ar" ? "المعادلة 2" : "Eq 2");

    // Draw solution point
    const solution = getSolution();
    if (showSolution && solution.type === "unique") {
      const px = centerX + solution.x * scale;
      const py = centerY - solution.y * scale;

      // Highlight
      ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.fill();

      // Point
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 14px system-ui";
      ctx.fillText(`(${solution.x.toFixed(2)}, ${solution.y.toFixed(2)})`, px + 15, py - 10);
    }

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [a1, b1, c1, a2, b2, c2, xRange, showSolution, getSolution, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setA1(1);
    setB1(1);
    setC1(5);
    setA2(2);
    setB2(-1);
    setC2(4);
    setShowSolution(false);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  const solution = getSolution();

  // Format equation
  const formatEquation = (a: number, b: number, c: number, num: number) => {
    const xVar = language === "ar" ? "س" : "x";
    const yVar = language === "ar" ? "ص" : "y";
    return `${a}${xVar} ${b >= 0 ? "+" : ""}${b}${yVar} = ${c}`;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Method Selection */}
        <div className="flex gap-2 flex-wrap">
          {(["graphical", "substitution", "elimination"] as SolutionMethod[]).map((m) => (
            <Button
              key={m}
              variant={method === m ? "default" : "outline"}
              onClick={() => setMethod(m)}
              className={method === m ? "bg-cyan-500 hover:bg-cyan-600" : ""}
            >
              {t[m]}
            </Button>
          ))}
        </div>

        {/* Equation 1 Controls */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-4">
          <h3 className="font-bold text-blue-600">{t.equation1}: {formatEquation(a1, b1, c1, 1)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>a₁</label>
                <Badge variant="secondary">{a1}</Badge>
              </div>
              <Slider value={[a1]} onValueChange={([v]) => setA1(v)} min={-5} max={5} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>b₁</label>
                <Badge variant="secondary">{b1}</Badge>
              </div>
              <Slider value={[b1]} onValueChange={([v]) => setB1(v)} min={-5} max={5} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>c₁</label>
                <Badge variant="secondary">{c1}</Badge>
              </div>
              <Slider value={[c1]} onValueChange={([v]) => setC1(v)} min={-10} max={10} step={1} />
            </div>
          </div>
        </div>

        {/* Equation 2 Controls */}
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg space-y-4">
          <h3 className="font-bold text-green-600">{t.equation2}: {formatEquation(a2, b2, c2, 2)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>a₂</label>
                <Badge variant="secondary">{a2}</Badge>
              </div>
              <Slider value={[a2]} onValueChange={([v]) => setA2(v)} min={-5} max={5} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>b₂</label>
                <Badge variant="secondary">{b2}</Badge>
              </div>
              <Slider value={[b2]} onValueChange={([v]) => setB2(v)} min={-5} max={5} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>c₂</label>
                <Badge variant="secondary">{c2}</Badge>
              </div>
              <Slider value={[c2]} onValueChange={([v]) => setC2(v)} min={-10} max={10} step={1} />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button onClick={solveEquations} disabled={isAnimating} className="bg-cyan-500 hover:bg-cyan-600">
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
          <canvas ref={canvasRef} width={700} height={400} className="w-full bg-white" />
        </div>

        {/* Solution */}
        <div className={`p-4 rounded-lg ${
          solution.type === "unique" ? "bg-green-50 dark:bg-green-950" :
          solution.type === "none" ? "bg-yellow-50 dark:bg-yellow-950" :
          "bg-gray-50 dark:bg-gray-950"
        }`}>
          <h4 className="font-bold mb-2">{t.solution}</h4>
          
          {solution.type === "unique" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">{t.xValue}</p>
                <p className="text-3xl font-mono font-bold text-blue-500">{solution.x.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.yValue}</p>
                <p className="text-3xl font-mono font-bold text-green-500">{solution.y.toFixed(4)}</p>
              </div>
            </div>
          ) : solution.type === "none" ? (
            <p className="text-yellow-600 text-lg">{t.noSolution}</p>
          ) : (
            <p className="text-gray-600 text-lg">{t.infiniteSolutions}</p>
          )}
        </div>

        {/* Solution Steps based on method */}
        {showSolution && solution.type === "unique" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{t.steps}</h3>
            
            {method === "substitution" && (
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="font-bold">{t.step1}</p>
                  <p className="font-mono text-sm mt-1">
                    {language === "ar"
                      ? `من المعادلة 1: ${b1}ص = ${c1} - ${a1}س`
                      : `From Eq 1: ${b1}y = ${c1} - ${a1}x`}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="font-bold">{t.step2}</p>
                  <p className="font-mono text-sm mt-1">
                    {language === "ar"
                      ? `ص = (${c1} - ${a1}س) / ${b1}`
                      : `y = (${c1} - ${a1}x) / ${b1}`}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <p className="font-bold">{t.step3}</p>
                  <p className="font-mono text-sm mt-1">
                    {language === "ar"
                      ? `التعويض في المعادلة 2`
                      : `Substitute into Eq 2`}
                  </p>
                </div>
              </>
            )}

            {method === "elimination" && (
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="font-bold">{t.step1}</p>
                  <p className="font-mono text-sm mt-1">
                    {language === "ar"
                      ? `نضرب المعادلة 1 في ${b2} والمعادلة 2 في ${-b1}`
                      : `Multiply Eq 1 by ${b2} and Eq 2 by ${-b1}`}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="font-bold">{t.step2}</p>
                  <p className="font-mono text-sm mt-1">
                    {language === "ar"
                      ? `نجمع المعادلتين لحذف ص`
                      : `Add equations to eliminate y`}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <p className="font-bold">{t.step3}</p>
                  <p className="font-mono text-sm mt-1">
                    {language === "ar"
                      ? `س = ${solution.x.toFixed(4)}`
                      : `x = ${solution.x.toFixed(4)}`}
                  </p>
                </div>
              </>
            )}

            {method === "graphical" && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="font-bold">{t.intersection}</p>
                <p className="font-mono text-sm mt-1">
                  {language === "ar"
                    ? `نقطة التقاطع هي الحل المشترك للمعادلتين`
                    : `The intersection point is the common solution to both equations`}
                </p>
              </div>
            )}

            <div className="p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
              <p className="font-bold">{t.step4}</p>
              <p className="text-xl font-mono mt-1">
                {language === "ar"
                  ? `س = ${solution.x.toFixed(4)}، ص = ${solution.y.toFixed(4)}`
                  : `x = ${solution.x.toFixed(4)}, y = ${solution.y.toFixed(4)}`}
              </p>
            </div>
          </div>
        )}

        {/* Mathematical Interpretation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h4 className="font-bold mb-2">{t.interpretation}</h4>
          <p className="text-sm">
            {solution.type === "unique"
              ? (language === "ar"
                  ? "النظام له حل وحيد عند نقطة تقاطع الخطين. هذا يعني أن القيمتين (س، ص) تحققان كلتا المعادلتين."
                  : "The system has a unique solution at the intersection point. This means the values (x, y) satisfy both equations.")
              : solution.type === "none"
                ? (language === "ar"
                    ? "الخطين متوازيان ولا يتقاطعان، لذا لا يوجد حل يحقق كلا المعادلتين."
                    : "The lines are parallel and don't intersect, so there's no solution satisfying both equations.")
                : (language === "ar"
                    ? "المعادلتان تمثلان نفس الخط، فكل نقطة على الخط هي حل للنظام."
                    : "Both equations represent the same line, so every point on the line is a solution.")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
