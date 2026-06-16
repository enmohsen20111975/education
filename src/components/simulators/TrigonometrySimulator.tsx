"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Triangle, Ruler } from "lucide-react";

interface TrigonometrySimulatorProps {
  language: "ar" | "en";
}

export function TrigonometrySimulator({ language }: TrigonometrySimulatorProps) {
  const unitCircleRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);
  
  const [angle, setAngle] = useState(45);
  const [showSin, setShowSin] = useState(true);
  const [showCos, setShowCos] = useState(true);
  const [showTan, setShowTan] = useState(false);

  const texts = {
    ar: {
      title: "محاكي حساب المثلثات",
      description: "استكشف الدوال المثلثية والدائرة الوحدة",
      angle: "الزاوية",
      sin: "جا (Sin)",
      cos: "جتا (Cos)",
      tan: "ظا (Tan)",
      unitCircle: "الدائرة الوحدة",
      graph: "الرسم البياني",
      value: "القيمة",
      reset: "إعادة",
      degrees: "درجة",
      radians: "راديان",
    },
    en: {
      title: "Trigonometry Simulator",
      description: "Explore trigonometric functions and the unit circle",
      angle: "Angle",
      sin: "Sin",
      cos: "Cos",
      tan: "Tan",
      unitCircle: "Unit Circle",
      graph: "Graph",
      value: "Value",
      reset: "Reset",
      degrees: "degrees",
      radians: "radians",
    },
  };

  const t = texts[language];

  const radians = (angle * Math.PI) / 180;
  const sinVal = Math.sin(radians);
  const cosVal = Math.cos(radians);
  const tanVal = Math.tan(radians);

  const drawUnitCircle = useCallback(() => {
    const canvas = unitCircleRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const r = 100;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = -r; i <= r; i += 25) {
      ctx.beginPath();
      ctx.moveTo(cx + i, cy - r - 20);
      ctx.lineTo(cx + i, cy + r + 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r - 20, cy + i);
      ctx.lineTo(cx + r + 20, cy + i);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Unit circle
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Angle arc
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, -radians, true);
    ctx.stroke();

    // Point on circle
    const px = cx + r * cosVal;
    const py = cy - r * sinVal;

    // Cosine line (horizontal)
    if (showCos) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, cy);
      ctx.stroke();

      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(`cos = ${cosVal.toFixed(3)}`, cx + 10, cy + 20);
    }

    // Sine line (vertical)
    if (showSin) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(`sin = ${sinVal.toFixed(3)}`, px + 10, py - 10);
    }

    // Radius line
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Point
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    // Angle label
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`${angle}°`, cx + 40, cy - 15);

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.fillText("x", width - 20, cy - 10);
    ctx.fillText("y", cx + 10, 20);

  }, [angle, radians, sinVal, cosVal, showSin, showCos]);

  const drawGraph = useCallback(() => {
    const canvas = graphRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = 50;
    const cy = height / 2;
    const scaleX = (width - 100) / (2 * Math.PI);
    const scaleY = 60;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    // Vertical lines (every π/2)
    for (let i = 0; i <= 4; i++) {
      const x = cx + (i * Math.PI / 2) * scaleX;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(width - 20, cy);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.fillText("1", cx - 15, cy - scaleY + 5);
    ctx.fillText("0", cx - 15, cy + 5);
    ctx.fillText("-1", cx - 15, cy + scaleY + 5);

    // X-axis labels
    ctx.fillText("0", cx, cy + 20);
    ctx.fillText("π/2", cx + (Math.PI / 2) * scaleX - 10, cy + 20);
    ctx.fillText("π", cx + Math.PI * scaleX - 5, cy + 20);
    ctx.fillText("3π/2", cx + (3 * Math.PI / 2) * scaleX - 15, cy + 20);
    ctx.fillText("2π", cx + 2 * Math.PI * scaleX - 10, cy + 20);

    // Draw sin curve
    if (showSin) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let a = 0; a <= 2 * Math.PI; a += 0.01) {
        const x = cx + a * scaleX;
        const y = cy - Math.sin(a) * scaleY;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw cos curve
    if (showCos) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let a = 0; a <= 2 * Math.PI; a += 0.01) {
        const x = cx + a * scaleX;
        const y = cy - Math.cos(a) * scaleY;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw tan curve
    if (showTan) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let a = 0; a <= 2 * Math.PI; a += 0.01) {
        const tanVal = Math.tan(a);
        if (Math.abs(tanVal) < 3) {
          const x = cx + a * scaleX;
          const y = cy - tanVal * scaleY;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Draw current angle marker
    const currentX = cx + radians * scaleX;
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(currentX, 20);
    ctx.lineTo(currentX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [showSin, showCos, showTan, radians]);

  useEffect(() => {
    drawUnitCircle();
    drawGraph();
  }, [drawUnitCircle, drawGraph]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Triangle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Angle Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.angle}</label>
            <Badge variant="secondary">{angle}° ({(radians).toFixed(2)} rad)</Badge>
          </div>
          <Slider
            value={[angle]}
            onValueChange={([v]) => setAngle(v)}
            min={0}
            max={360}
            step={1}
          />
        </div>

        {/* Function toggles */}
        <div className="flex gap-3">
          <Button
            variant={showSin ? "default" : "outline"}
            onClick={() => setShowSin(!showSin)}
            className={showSin ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {t.sin}
          </Button>
          <Button
            variant={showCos ? "default" : "outline"}
            onClick={() => setShowCos(!showCos)}
            className={showCos ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {t.cos}
          </Button>
          <Button
            variant={showTan ? "default" : "outline"}
            onClick={() => setShowTan(!showTan)}
            className={showTan ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {t.tan}
          </Button>
        </div>

        {/* Canvases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b">
              <h3 className="font-medium text-sm">{t.unitCircle}</h3>
            </div>
            <canvas ref={unitCircleRef} width={280} height={280} className="w-full bg-white" />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b">
              <h3 className="font-medium text-sm">{t.graph}</h3>
            </div>
            <canvas ref={graphRef} width={400} height={280} className="w-full bg-white" />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.sin}</p>
            <p className="font-bold text-xl text-red-600">{sinVal.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.cos}</p>
            <p className="font-bold text-xl text-green-600">{cosVal.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.tan}</p>
            <p className="font-bold text-xl text-amber-600">
              {Math.abs(tanVal) > 10 ? "∞" : tanVal.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={() => setAngle(45)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
