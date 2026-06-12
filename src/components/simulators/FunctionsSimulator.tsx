"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, FunctionSquare, TrendingUp, Grid3X3 } from "lucide-react";

interface FunctionsSimulatorProps {
  language: "ar" | "en";
}

type FunctionType = "linear" | "quadratic" | "sine" | "exponential" | "custom";

export function FunctionsSimulator({ language }: FunctionsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [functionType, setFunctionType] = useState<FunctionType>("linear");
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showDerivative, setShowDerivative] = useState(false);
  const [customFunction, setCustomFunction] = useState("x");
  const [xRange, setXRange] = useState(10);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الدوال الرياضية",
      description: "استكشف الدوال ورسومها البيانية",
      linear: "دالة خطية: y = ax + b",
      quadratic: "دالة تربيعية: y = ax² + bx + c",
      sine: "دالة جيبية: y = a·sin(bx) + c",
      exponential: "دالة أسية: y = a·e^(bx)",
      custom: "دالة مخصصة",
      coefficient: "المعامل a",
      constant: "الثابت b",
      constantC: "الثابت c",
      range: "مدى x",
      showGrid: "إظهار الشبكة",
      showDerivative: "إظهار المشتقة",
      reset: "إعادة",
      formula: "المعادلة",
      x: "س",
      y: "ص",
      derivative: "المشتقة",
      points: "النقاط المهمة",
      zeros: "أصفار الدالة",
      vertex: "رأس المنحنى",
    },
    en: {
      title: "Mathematical Functions Simulator",
      description: "Explore functions and their graphs",
      linear: "Linear: y = ax + b",
      quadratic: "Quadratic: y = ax² + bx + c",
      sine: "Sine: y = a·sin(bx) + c",
      exponential: "Exponential: y = a·e^(bx)",
      custom: "Custom Function",
      coefficient: "Coefficient a",
      constant: "Constant b",
      constantC: "Constant c",
      range: "X Range",
      showGrid: "Show Grid",
      showDerivative: "Show Derivative",
      reset: "Reset",
      formula: "Formula",
      x: "x",
      y: "y",
      derivative: "Derivative",
      points: "Key Points",
      zeros: "Zeros",
      vertex: "Vertex",
    },
  };

  const t = texts[language];

  // Calculate function value
  const calculateY = useCallback((x: number): number => {
    switch (functionType) {
      case "linear":
        return a * x + b;
      case "quadratic":
        return a * x * x + b * x + c;
      case "sine":
        return a * Math.sin(b * x) + c;
      case "exponential":
        return a * Math.exp(b * x);
      case "custom":
        // Simple function parser for basic expressions
        try {
          const expr = customFunction.toLowerCase();
          // Basic math functions
          if (expr === "x") return x;
          if (expr === "x^2" || expr === "x**2" || expr === "x*x") return x * x;
          if (expr === "x^3" || expr === "x**3") return x * x * x;
          if (expr === "sin(x)") return Math.sin(x);
          if (expr === "cos(x)") return Math.cos(x);
          if (expr === "tan(x)") return Math.tan(x);
          if (expr === "sqrt(x)" || expr === "x^0.5") return Math.sqrt(x);
          if (expr === "1/x") return 1 / x;
          if (expr === "abs(x)") return Math.abs(x);
          if (expr === "log(x)") return Math.log(x);
          if (expr === "exp(x)") return Math.exp(x);
          // Default to x for unrecognized
          return x;
        } catch {
          return 0;
        }
      default:
        return 0;
    }
  }, [functionType, a, b, c, customFunction]);

  // Calculate derivative
  const calculateDerivative = useCallback((x: number): number => {
    const h = 0.0001;
    return (calculateY(x + h) - calculateY(x - h)) / (2 * h);
  }, [calculateY]);

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
    const scale = (width / 2 - 50) / xRange;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    if (showGrid) {
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = -xRange; x <= xRange; x++) {
        const px = centerX + x * scale;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
        
        // Numbers
        if (x !== 0) {
          ctx.fillStyle = "#94a3b8";
          ctx.font = "10px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(`${x}`, px, centerY + 15);
        }
      }
      
      // Horizontal lines
      for (let y = -xRange; y <= xRange; y++) {
        const py = centerY - y * scale;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
        
        if (y !== 0) {
          ctx.fillText(`${y}`, centerX - 15, py + 4);
        }
      }
    }

    // Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.fillText(t.x, width - 20, centerY - 10);
    ctx.fillText(t.y, centerX + 10, 20);

    // Draw derivative first (behind main function)
    if (showDerivative) {
      ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let px = 0; px <= width; px += 2) {
        const x = (px - centerX) / scale;
        const y = calculateDerivative(x);
        const py = centerY - y * scale;

        if (py > -100 && py < height + 100) {
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    // Draw main function
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

    // Key points for quadratic
    if (functionType === "quadratic" && a !== 0) {
      const vertexX = -b / (2 * a);
      const vertexY = calculateY(vertexX);
      const vx = centerX + vertexX * scale;
      const vy = centerY - vertexY * scale;

      if (vx > 0 && vx < width && vy > 0 && vy < height) {
        // Vertex point
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(vx, vy, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#ef4444";
        ctx.font = "10px system-ui";
        ctx.fillText(`(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, vx + 10, vy - 10);
      }

      // Zeros (roots)
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        [x1, x2].forEach((xZero) => {
          if (Math.abs(xZero) <= xRange) {
            const pxZero = centerX + xZero * scale;
            ctx.fillStyle = "#22c55e";
            ctx.beginPath();
            ctx.arc(pxZero, centerY, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    }

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [xRange, showGrid, showDerivative, calculateY, calculateDerivative, functionType, a, b, c, t.x, t.y]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setA(1);
    setB(0);
    setC(0);
    setXRange(10);
  };

  // Get formula string
  const getFormula = () => {
    switch (functionType) {
      case "linear":
        return `y = ${a}x + ${b}`;
      case "quadratic":
        return `y = ${a}x² + ${b}x + ${c}`;
      case "sine":
        return `y = ${a}sin(${b}x) + ${c}`;
      case "exponential":
        return `y = ${a}e^(${b}x)`;
      case "custom":
        return `y = ${customFunction}`;
      default:
        return "";
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <FunctionSquare className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-indigo-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Function Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {(["linear", "quadratic", "sine", "exponential", "custom"] as FunctionType[]).map((type) => (
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

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficient}</label>
              <Badge variant="secondary">{a}</Badge>
            </div>
            <Slider value={[a]} onValueChange={([v]) => setA(v)} min={-5} max={5} step={0.1} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.constant}</label>
              <Badge variant="secondary">{b}</Badge>
            </div>
            <Slider value={[b]} onValueChange={([v]) => setB(v)} min={-10} max={10} step={0.5} />
          </div>

          {(functionType === "quadratic" || functionType === "sine") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.constantC}</label>
                <Badge variant="secondary">{c}</Badge>
              </div>
              <Slider value={[c]} onValueChange={([v]) => setC(v)} min={-10} max={10} step={0.5} />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.range}</label>
              <Badge variant="secondary">±{xRange}</Badge>
            </div>
            <Slider value={[xRange]} onValueChange={([v]) => setXRange(v)} min={2} max={20} step={1} />
          </div>
        </div>

        {/* Custom function input */}
        {functionType === "custom" && (
          <div className="space-y-2">
            <Label>{language === "ar" ? "أدخل الدالة (استخدم x)" : "Enter function (use x)"}</Label>
            <Input
              value={customFunction}
              onChange={(e) => setCustomFunction(e.target.value)}
              placeholder="x^2, sin(x), x+1, etc."
            />
          </div>
        )}

        {/* Options */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
            <label className="text-sm">{t.showGrid}</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showDerivative} onChange={(e) => setShowDerivative(e.target.checked)} />
            <label className="text-sm">{t.showDerivative}</label>
          </div>
        </div>

        {/* Buttons */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Formula */}
        <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg">
          <p className="text-sm text-slate-500 mb-1">{t.formula}:</p>
          <code className="text-xl font-mono font-bold text-indigo-600">{getFormula()}</code>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={400} className="w-full bg-white" />
        </div>

        {/* Key Points for Quadratic */}
        {functionType === "quadratic" && a !== 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-slate-500">{t.vertex}</p>
              <p className="font-mono">
                ({(-b / (2 * a)).toFixed(2)}, {calculateY(-b / (2 * a)).toFixed(2)})
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-slate-500">{t.zeros}</p>
              <p className="font-mono text-sm">
                {(() => {
                  const disc = b * b - 4 * a * c;
                  if (disc < 0) return language === "ar" ? "لا توجد أصفار حقيقية" : "No real zeros";
                  const x1 = (-b + Math.sqrt(disc)) / (2 * a);
                  const x2 = (-b - Math.sqrt(disc)) / (2 * a);
                  return `x = ${x1.toFixed(2)}, x = ${x2.toFixed(2)}`;
                })()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
