"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ArrowUpRight, Plus, Minus, Move } from "lucide-react";

interface VectorsSimulatorProps {
  language: "ar" | "en";
}

interface Vector {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
}

export function VectorsSimulator({ language }: VectorsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [vectors, setVectors] = useState<Vector[]>([
    { id: "1", x: 80, y: 60, color: "#3b82f6", label: "A" },
    { id: "2", x: 50, y: 90, color: "#22c55e", label: "B" },
  ]);
  const [showResultant, setShowResultant] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المتجهات",
      description: "جمع وطرح المتجهات بشكل تفاعلي",
      vector: "المتجه",
      magnitude: "المقدار",
      direction: "الاتجاه",
      components: "المركبات",
      xComponent: "المركبة السينية",
      yComponent: "المركبة الصادية",
      resultant: "المحصلة",
      addVectors: "جمع المتجهات",
      subtractVectors: "طرح المتجهات",
      showResultant: "إظهار المحصلة",
      hideResultant: "إخفاء المحصلة",
      showComponents: "إظهار المركبات",
      hideComponents: "إخفاء المركبات",
      addVector: "إضافة متجه",
      removeVector: "حذف",
      reset: "إعادة",
      angle: "الزاوية",
      degrees: "درجة",
      result: "النتيجة",
      formula: "المعادلة",
      magnitudeFormula: "المقدار = √(س² + ص²)",
      directionFormula: "الاتجاه = tan⁻¹(ص/س)",
      unitVector: "متجه الوحدة",
    },
    en: {
      title: "Vectors Simulator",
      description: "Add and subtract vectors interactively",
      vector: "Vector",
      magnitude: "Magnitude",
      direction: "Direction",
      components: "Components",
      xComponent: "X Component",
      yComponent: "Y Component",
      resultant: "Resultant",
      addVectors: "Add Vectors",
      subtractVectors: "Subtract Vectors",
      showResultant: "Show Resultant",
      hideResultant: "Hide Resultant",
      showComponents: "Show Components",
      hideComponents: "Hide Components",
      addVector: "Add Vector",
      removeVector: "Remove",
      reset: "Reset",
      angle: "Angle",
      degrees: "degrees",
      result: "Result",
      formula: "Formula",
      magnitudeFormula: "Magnitude = √(x² + y²)",
      directionFormula: "Direction = tan⁻¹(y/x)",
      unitVector: "Unit Vector",
    },
  };

  const t = texts[language];

  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
  const labels = ["A", "B", "C", "D", "E", "F"];

  // Calculate vector properties
  const getVectorMagnitude = (x: number, y: number) => Math.sqrt(x * x + y * y);
  const getVectorAngle = (x: number, y: number) => Math.atan2(y, x) * (180 / Math.PI);

  // Calculate resultant
  const calculateResultant = useCallback(() => {
    let rx = 0;
    let ry = 0;

    vectors.forEach((v, index) => {
      if (operation === "add") {
        rx += v.x;
        ry += v.y;
      } else {
        if (index === 0) {
          rx = v.x;
          ry = v.y;
        } else {
          rx -= v.x;
          ry -= v.y;
        }
      }
    });

    return { x: rx, y: ry };
  }, [vectors, operation]);

  const resultant = calculateResultant();
  const resultantMagnitude = getVectorMagnitude(resultant.x, resultant.y);
  const resultantAngle = getVectorAngle(resultant.x, resultant.y);

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("X", width - 15, originY - 10);
    ctx.fillText("Y", originX + 15, 15);

    // Draw tick marks
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      const x = originX + i * 25;
      const y = originY - i * 25;
      
      ctx.fillText(String(i * 20), x, originY + 15);
      ctx.fillText(String(i * 20), originX - 15, y + 4);
    }

    // Draw components if enabled
    if (showComponents) {
      vectors.forEach((v) => {
        ctx.strokeStyle = v.color + "60";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // X component
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + v.x, originY);
        ctx.stroke();

        // Y component
        ctx.beginPath();
        ctx.moveTo(originX + v.x, originY);
        ctx.lineTo(originX + v.x, originY - v.y);
        ctx.stroke();

        ctx.setLineDash([]);
      });
    }

    // Draw vectors
    vectors.forEach((v) => {
      const endX = originX + v.x;
      const endY = originY - v.y;
      const mag = getVectorMagnitude(v.x, v.y);
      const angle = Math.atan2(v.y, v.x);

      // Draw arrow line
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrow head
      const headLength = 12;
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY + headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY + headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Draw label
      ctx.fillStyle = v.color;
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(v.label, endX + 15, endY - 10);

      // Draw magnitude label
      ctx.font = "11px system-ui";
      ctx.fillText(`|${v.label}| = ${mag.toFixed(1)}`, endX + 25, endY + 5);
    });

    // Draw resultant
    if (showResultant && vectors.length > 1) {
      const endX = originX + resultant.x;
      const endY = originY - resultant.y;
      const angle = Math.atan2(resultant.y, resultant.x);

      // Draw arrow line
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrow head
      const headLength = 15;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY + headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY + headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Draw R label
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("R", endX + 20, endY - 15);
    }

    // Draw origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(originX, originY, 5, 0, Math.PI * 2);
    ctx.fill();

  }, [vectors, showResultant, showComponents, resultant]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Add vector
  const addVector = () => {
    if (vectors.length >= 6) return;
    const newIndex = vectors.length;
    setVectors([
      ...vectors,
      {
        id: Date.now().toString(),
        x: 50,
        y: 50,
        color: colors[newIndex % colors.length],
        label: labels[newIndex % labels.length],
      },
    ]);
  };

  // Remove vector
  const removeVector = (id: string) => {
    setVectors(vectors.filter((v) => v.id !== id));
  };

  // Update vector
  const updateVector = (id: string, x: number, y: number) => {
    setVectors(vectors.map((v) => (v.id === id ? { ...v, x, y } : v)));
  };

  // Reset
  const handleReset = () => {
    setVectors([
      { id: "1", x: 80, y: 60, color: "#3b82f6", label: "A" },
      { id: "2", x: 50, y: 90, color: "#22c55e", label: "B" },
    ]);
    setShowResultant(true);
    setShowComponents(false);
    setOperation("add");
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Move className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-indigo-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Operation Selection */}
        <div className="flex gap-2">
          <Button
            variant={operation === "add" ? "default" : "outline"}
            onClick={() => setOperation("add")}
            className={operation === "add" ? "bg-indigo-500 hover:bg-indigo-600" : ""}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addVectors}
          </Button>
          <Button
            variant={operation === "subtract" ? "default" : "outline"}
            onClick={() => setOperation("subtract")}
            className={operation === "subtract" ? "bg-violet-500 hover:bg-violet-600" : ""}
          >
            <Minus className="w-4 h-4 mr-2" />
            {t.subtractVectors}
          </Button>
        </div>

        {/* Vectors List */}
        <div className="space-y-4">
          {vectors.map((v, index) => (
            <div key={v.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: v.color, color: "white" }}>
                  {t.vector} {v.label}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVector(v.id)}
                  className="text-red-500"
                  disabled={vectors.length <= 2}
                >
                  {t.removeVector}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">{t.xComponent}</label>
                    <Badge variant="outline">{v.x}</Badge>
                  </div>
                  <Slider
                    value={[v.x]}
                    onValueChange={([value]) => updateVector(v.id, value, v.y)}
                    min={-150}
                    max={150}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">{t.yComponent}</label>
                    <Badge variant="outline">{v.y}</Badge>
                  </div>
                  <Slider
                    value={[v.y]}
                    onValueChange={([value]) => updateVector(v.id, v.x, value)}
                    min={-150}
                    max={150}
                    step={5}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">{t.magnitude}:</span>
                  <span className="font-bold ml-2">{getVectorMagnitude(v.x, v.y).toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-slate-500">{t.angle}:</span>
                  <span className="font-bold ml-2">{getVectorAngle(v.x, v.y).toFixed(1)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={addVector} disabled={vectors.length >= 6}>
            <Plus className="w-4 h-4 mr-2" />
            {t.addVector}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowResultant(!showResultant)}
          >
            {showResultant ? t.hideResultant : t.showResultant}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowComponents(!showComponents)}
          >
            {showComponents ? t.hideComponents : t.showComponents}
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

        {/* Resultant Properties */}
        {showResultant && vectors.length > 1 && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight className="w-5 h-5 text-red-500" />
              <span className="font-bold text-red-700">{t.resultant}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500">{t.xComponent}</p>
                <p className="font-bold text-red-600">{resultant.x.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.yComponent}</p>
                <p className="font-bold text-red-600">{resultant.y.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.magnitude}</p>
                <p className="font-bold text-red-600">{resultantMagnitude.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.angle}</p>
                <p className="font-bold text-red-600">{resultantAngle.toFixed(1)}°</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.magnitudeFormula}</code>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.directionFormula}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
