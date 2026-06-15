"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Triangle, RotateCcw, Move, Focus, Crosshair } from "lucide-react";

interface ParabolaGraphSimulatorProps {
  language: "ar" | "en";
}

export function ParabolaGraphSimulator({ language }: ParabolaGraphSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for y = ax² + bx + c
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [xRange, setXRange] = useState(10);
  const [showVertex, setShowVertex] = useState(true);
  const [showRoots, setShowRoots] = useState(true);
  const [showAxisOfSymmetry, setShowAxisOfSymmetry] = useState(true);
  const [showFocus, setShowFocus] = useState(false);
  const [showDirectrix, setShowDirectrix] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "راسم القطع المكافئ",
      description: "استكشف خصائص القطع المكافئ y = ax² + bx + c",
      coefficientA: "المعامل أ (تحكم الفتحة)",
      coefficientB: "المعامل ب (تحكم الميل)",
      constantC: "الثابت ج (نقطة التقاطع)",
      equation: "المعادلة",
      vertex: "الرأس",
      roots: "الجذور",
      axisOfSymmetry: "محور التناظر",
      focus: "البؤرة",
      directrix: "الدليل",
      showVertex: "إظهار الرأس",
      showRoots: "إظهار الجذور",
      showAxisOfSymmetry: "إظهار محور التناظر",
      showFocus: "إظهار البؤرة والدليل",
      reset: "إعادة",
      opensUp: "فتحة للأعلى",
      opensDown: "فتحة للأسفل",
      narrow: "ضيق",
      wide: "واسع",
      noRealRoots: "لا توجد جذور حقيقية",
      oneRoot: "جذر واحد",
      twoRoots: "جذران",
      properties: "خصائص القطع المكافئ",
      discriminant: "المميز",
    },
    en: {
      title: "Parabola Graph Simulator",
      description: "Explore properties of the parabola y = ax² + bx + c",
      coefficientA: "Coefficient a (controls opening)",
      coefficientB: "Coefficient b (controls tilt)",
      constantC: "Constant c (y-intercept)",
      equation: "Equation",
      vertex: "Vertex",
      roots: "Roots",
      axisOfSymmetry: "Axis of Symmetry",
      focus: "Focus",
      directrix: "Directrix",
      showVertex: "Show Vertex",
      showRoots: "Show Roots",
      showAxisOfSymmetry: "Show Axis of Symmetry",
      showFocus: "Show Focus & Directrix",
      reset: "Reset",
      opensUp: "Opens upward",
      opensDown: "Opens downward",
      narrow: "Narrow",
      wide: "Wide",
      noRealRoots: "No real roots",
      oneRoot: "One root",
      twoRoots: "Two roots",
      properties: "Parabola Properties",
      discriminant: "Discriminant",
    },
  };

  const t = texts[language];

  // Calculate vertex
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  // Calculate discriminant
  const discriminant = b * b - 4 * a * c;

  // Calculate roots
  const getRoots = () => {
    if (discriminant < 0) return [];
    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    if (Math.abs(x1 - x2) < 0.001) return [x1];
    return [x1, x2].sort((a, b) => a - b);
  };

  // Calculate focus and directrix (for y = ax² form)
  const getFocusDirectrix = () => {
    if (a === 0) return { focus: null, directrix: null };
    
    // Transform to vertex form: y = a(x - h)² + k
    // where h = -b/2a, k = vertexY
    // In vertex form, focus is at (h, k + 1/4a) and directrix is y = k - 1/4a
    
    const p = 1 / (4 * a);
    return {
      focus: { x: vertexX, y: vertexY + p },
      directrixY: vertexY - p,
      p: p
    };
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

      if (x !== 0 && x % 2 === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${x}`, px, centerY + 15);
      }
    }

    for (let y = -xRange; y <= xRange; y++) {
      const py = centerY - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (y !== 0 && y % 2 === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`${y}`, centerX - 15, py + 4);
      }
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
    ctx.fillText("x", width - 20, centerY - 10);
    ctx.fillText("y", centerX + 15, 20);

    // Draw axis of symmetry
    if (showAxisOfSymmetry && a !== 0) {
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      const axisX = centerX + vertexX * scale;
      ctx.beginPath();
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, height);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // Draw directrix
    if (showDirectrix && a !== 0) {
      const fd = getFocusDirectrix();
      if (fd.directrixY !== null) {
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        
        const directrixPy = centerY - fd.directrixY * scale;
        ctx.beginPath();
        ctx.moveTo(0, directrixPy);
        ctx.lineTo(width, directrixPy);
        ctx.stroke();
        
        ctx.setLineDash([]);
        
        // Label
        ctx.fillStyle = "#06b6d4";
        ctx.font = "12px system-ui";
        ctx.fillText(language === "ar" ? "الدليل" : "Directrix", 10, directrixPy - 5);
      }
    }

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

    // Draw vertex
    if (showVertex && a !== 0) {
      const vx = centerX + vertexX * scale;
      const vy = centerY - vertexY * scale;

      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(vx, vy, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f97316";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(`(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, vx + 10, vy - 10);
    }

    // Draw focus
    if (showFocus && a !== 0) {
      const fd = getFocusDirectrix();
      if (fd.focus) {
        const fx = centerX + fd.focus.x * scale;
        const fy = centerY - fd.focus.y * scale;

        ctx.fillStyle = "#ec4899";
        ctx.beginPath();
        ctx.arc(fx, fy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ec4899";
        ctx.font = "bold 12px system-ui";
        ctx.fillText(language === "ar" ? "بؤرة" : "Focus", fx + 10, fy - 5);
      }
    }

    // Draw roots
    if (showRoots) {
      const roots = getRoots();
      roots.forEach((root, index) => {
        const rx = centerX + root * scale;
        
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(rx, centerY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 12px system-ui";
        ctx.fillText(`x = ${root.toFixed(2)}`, rx + 10, centerY + index * 20 - 20);
      });
    }

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [a, b, c, xRange, showVertex, showRoots, showAxisOfSymmetry, showFocus, showDirectrix, vertexX, vertexY, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setA(1);
    setB(0);
    setC(0);
    setXRange(10);
    setShowVertex(true);
    setShowRoots(true);
    setShowAxisOfSymmetry(true);
    setShowFocus(false);
    setShowDirectrix(false);
  };

  // Get opening direction
  const getOpeningDirection = () => a > 0 ? t.opensUp : t.opensDown;

  // Get width description
  const getWidthDescription = () => Math.abs(a) > 1 ? t.narrow : (Math.abs(a) < 1 ? t.wide : "");

  const roots = getRoots();
  const fd = getFocusDirectrix();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Triangle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Equation Display */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
          <p className="text-2xl font-mono font-bold">
            <span className="text-slate-500">y = </span>
            <span className="text-amber-500">{a}</span>
            <span className="text-slate-500">x² </span>
            {b !== 0 && (
              <>
                <span className="text-slate-400">{b >= 0 ? "+" : ""}</span>
                <span className="text-orange-500">{b}</span>
                <span className="text-slate-500">x </span>
              </>
            )}
            {c !== 0 && (
              <>
                <span className="text-slate-400">{c >= 0 ? "+" : ""}</span>
                <span className="text-red-500">{c}</span>
              </>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientA}</label>
              <Badge variant="secondary">{a}</Badge>
            </div>
            <Slider value={[a]} onValueChange={([v]) => setA(v)} min={-3} max={3} step={0.1} />
            <p className="text-sm text-slate-500">{getOpeningDirection()} {getWidthDescription()}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.coefficientB}</label>
              <Badge variant="secondary">{b}</Badge>
            </div>
            <Slider value={[b]} onValueChange={([v]) => setB(v)} min={-10} max={10} step={0.5} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.constantC}</label>
              <Badge variant="secondary">{c}</Badge>
            </div>
            <Slider value={[c]} onValueChange={([v]) => setC(v)} min={-10} max={10} step={0.5} />
          </div>
        </div>

        {/* Display Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showVertex} onChange={(e) => setShowVertex(e.target.checked)} />
            <label className="text-sm">{t.showVertex}</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showRoots} onChange={(e) => setShowRoots(e.target.checked)} />
            <label className="text-sm">{t.showRoots}</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showAxisOfSymmetry} onChange={(e) => setShowAxisOfSymmetry(e.target.checked)} />
            <label className="text-sm">{t.showAxisOfSymmetry}</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showFocus} onChange={(e) => setShowFocus(e.target.checked)} />
            <label className="text-sm">{t.showFocus}</label>
          </div>
        </div>

        {/* Range control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{language === "ar" ? "مدى الرسم" : "Graph Range"}</label>
            <Badge variant="secondary">±{xRange}</Badge>
          </div>
          <Slider value={[xRange]} onValueChange={([v]) => setXRange(v)} min={5} max={20} step={1} />
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

        {/* Properties */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">{t.properties}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vertex */}
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-slate-500">{t.vertex}</p>
              <p className="font-mono font-bold">
                ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
              </p>
            </div>

            {/* Roots */}
            <div className={`p-3 rounded-lg ${
              roots.length === 0 ? "bg-red-50 dark:bg-red-950" :
              roots.length === 1 ? "bg-yellow-50 dark:bg-yellow-950" :
              "bg-green-50 dark:bg-green-950"
            }`}>
              <p className="text-sm text-slate-500">{t.roots}</p>
              {roots.length === 0 ? (
                <p className="text-sm">{t.noRealRoots}</p>
              ) : roots.length === 1 ? (
                <p className="font-mono font-bold">x = {roots[0].toFixed(2)}</p>
              ) : (
                <p className="font-mono font-bold text-sm">
                  x₁ = {roots[0].toFixed(2)}, x₂ = {roots[1].toFixed(2)}
                </p>
              )}
            </div>

            {/* Axis of Symmetry */}
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <p className="text-sm text-slate-500">{t.axisOfSymmetry}</p>
              <p className="font-mono font-bold">
                {language === "ar" ? `س = ${vertexX.toFixed(2)}` : `x = ${vertexX.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Focus & Directrix */}
          {showFocus && a !== 0 && fd.focus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-pink-50 dark:bg-pink-950 rounded-lg">
                <p className="text-sm text-slate-500">{t.focus}</p>
                <p className="font-mono font-bold">
                  ({fd.focus.x.toFixed(2)}, {fd.focus.y.toFixed(2)})
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {language === "ar" ? `المسافة من الرأس: ${Math.abs(fd.p).toFixed(3)}` : `Distance from vertex: ${Math.abs(fd.p).toFixed(3)}`}
                </p>
              </div>
              <div className="p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                <p className="text-sm text-slate-500">{t.directrix}</p>
                <p className="font-mono font-bold">
                  {language === "ar" ? `ص = ${fd.directrixY?.toFixed(2)}` : `y = ${fd.directrixY?.toFixed(2)}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Discriminant info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h4 className="font-bold mb-2">{t.discriminant}</h4>
          <div className="flex items-center gap-4">
            <p className="font-mono">
              Δ = b² - 4ac = {b}² - 4({a})({c}) = <span className="font-bold text-xl">{discriminant.toFixed(2)}</span>
            </p>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {discriminant > 0 
              ? (language === "ar" ? "المميز موجب: يوجد جذران حقيقيان مختلفان" : "Positive discriminant: Two distinct real roots")
              : discriminant === 0 
                ? (language === "ar" ? "المميز صفر: يوجد جذر واحد (مضاعف)" : "Zero discriminant: One repeated root")
                : (language === "ar" ? "المميز سالب: لا توجد جذور حقيقية" : "Negative discriminant: No real roots")
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
