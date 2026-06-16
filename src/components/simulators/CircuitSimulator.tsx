"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Battery, RotateCcw, Zap } from "lucide-react";

interface CircuitSimulatorProps {
  language: "ar" | "en";
}

export function CircuitSimulator({ language }: CircuitSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(100);
  const [currentFlow, setCurrentFlow] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الدوائر الكهربائية",
      description: "استكشف قانون أوم: V = I × R",
      voltage: "الجهد (V)",
      resistance: "المقاومة (Ω)",
      current: "التيار (A)",
      power: "القدرة (W)",
      ohmsLaw: "قانون أوم: V = I × R",
      powerFormula: "القدرة: P = V × I",
      reset: "إعادة",
    },
    en: {
      title: "Electric Circuit Simulator",
      description: "Explore Ohm's Law: V = I × R",
      voltage: "Voltage (V)",
      resistance: "Resistance (Ω)",
      current: "Current (A)",
      power: "Power (W)",
      ohmsLaw: "Ohm's Law: V = I × R",
      powerFormula: "Power: P = V × I",
      reset: "Reset",
    },
  };

  const t = texts[language];

  const current = voltage / resistance;
  const power = voltage * current;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Wire color based on current
    const wireColor = `rgb(${Math.min(255, 50 + current * 100)}, 100, 100)`;

    // Draw circuit
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;

    // Main circuit path
    const cx = width / 2;
    const cy = height / 2;
    const w = 200;
    const h = 80;

    // Draw wires
    ctx.strokeStyle = wireColor;
    ctx.beginPath();
    // Top wire
    ctx.moveTo(cx - w, cy - h);
    ctx.lineTo(cx + w, cy - h);
    // Right wire
    ctx.lineTo(cx + w, cy + h);
    // Bottom wire
    ctx.lineTo(cx - w, cy + h);
    // Left wire (back to start)
    ctx.lineTo(cx - w, cy - h);
    ctx.stroke();

    // Draw battery (left side)
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - w - 5, cy - 15);
    ctx.lineTo(cx - w - 5, cy + 15);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - w + 5, cy - 8);
    ctx.lineTo(cx - w + 5, cy + 8);
    ctx.stroke();

    // Battery label
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.fillText(`${voltage}V`, cx - w - 25, cy + 35);

    // Draw resistor (zigzag on right side)
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const rx = cx + w;
    let ry = cy - h + 20;
    ctx.moveTo(rx, cy - h);
    ctx.lineTo(rx, ry);
    
    // Zigzag pattern
    const zigzagCount = 6;
    const zigzagHeight = 15;
    const zigzagWidth = 10;
    
    for (let i = 0; i < zigzagCount; i++) {
      ctx.lineTo(rx - zigzagWidth, ry + zigzagHeight / 2);
      ctx.lineTo(rx + zigzagWidth, ry + zigzagHeight);
      ry += zigzagHeight;
    }
    ctx.lineTo(rx, cy + h);
    ctx.stroke();

    // Resistor label
    ctx.fillStyle = "#f59e0b";
    ctx.fillText(`${resistance}Ω`, rx + 15, cy);

    // Draw ammeter (bottom)
    ctx.strokeStyle = "#3b82f6";
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(cx, cy + h + 20, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = "bold 14px system-ui";
    ctx.fillText("A", cx - 5, cy + h + 25);

    // Draw current flow animation (moving dots)
    const dotCount = 8;
    const time = Date.now() / 1000;
    const speed = current * 2;

    ctx.fillStyle = "#ef4444";
    for (let i = 0; i < dotCount; i++) {
      const offset = (i / dotCount + time * speed) % 1;
      
      // Calculate position along circuit
      let dx, dy;
      const perimeter = 2 * (2 * w + 2 * h);
      const pos = offset * perimeter;
      
      if (pos < w * 2) {
        // Top wire
        dx = cx - w + pos / 2;
        dy = cy - h;
      } else if (pos < w * 2 + h * 2) {
        // Right wire
        dx = cx + w;
        dy = cy - h + (pos - w * 2) / 2;
      } else if (pos < w * 4 + h * 2) {
        // Bottom wire
        dx = cx + w - (pos - w * 2 - h * 2) / 2;
        dy = cy + h;
      } else {
        // Left wire
        dx = cx - w;
        dy = cy + h - (pos - w * 4 - h * 2) / 2;
      }

      ctx.beginPath();
      ctx.arc(dx, dy, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw current value
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px system-ui";
    ctx.fillText(`${current.toFixed(3)} A`, cx + 50, cy + h + 25);

  }, [voltage, resistance, current]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawCanvas();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawCanvas]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.voltage}</label>
              <Badge variant="secondary">{voltage} V</Badge>
            </div>
            <Slider
              value={[voltage]}
              onValueChange={([v]) => setVoltage(v)}
              min={1}
              max={24}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.resistance}</label>
              <Badge variant="secondary">{resistance} Ω</Badge>
            </div>
            <Slider
              value={[resistance]}
              onValueChange={([v]) => setResistance(v)}
              min={10}
              max={500}
              step={10}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full bg-white"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-slate-500">{t.current}</p>
            <p className="font-bold text-2xl text-blue-600">{current.toFixed(3)} A</p>
            <p className="text-xs text-slate-400">{(current * 1000).toFixed(1)} mA</p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
            <p className="text-sm text-slate-500">{t.power}</p>
            <p className="font-bold text-2xl text-amber-600">{power.toFixed(3)} W</p>
            <p className="text-xs text-slate-400">{(power * 1000).toFixed(1)} mW</p>
          </div>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <code className="text-sm font-mono">{t.ohmsLaw}</code>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <code className="text-sm font-mono">{t.powerFormula}</code>
          </div>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={() => { setVoltage(12); setResistance(100); }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
