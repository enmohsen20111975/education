"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Magnet, Zap } from "lucide-react";

interface ElectromagnetismSimulatorProps {
  language: "ar" | "en";
}

export function ElectromagnetismSimulator({ language }: ElectromagnetismSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [current, setCurrent] = useState(5);
  const [turns, setTurns] = useState(10);
  const [coreType, setCoreType] = useState<"air" | "iron">("iron");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الكهرومغناطيسية",
      description: "استكشف العلاقة بين التيار الكهربائي والمجال المغناطيسي",
      current: "التيار (A)",
      turns: "عدد اللفات",
      coreType: "نواة القلب",
      air: "هواء",
      iron: "حديد",
      magneticField: "المجال المغناطيسي",
      fieldStrength: "قوة المجال",
      direction: "اتجاه التيار",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
    },
    en: {
      title: "Electromagnetism Simulator",
      description: "Explore the relationship between electric current and magnetic field",
      current: "Current (A)",
      turns: "Number of Turns",
      coreType: "Core Type",
      air: "Air",
      iron: "Iron",
      magneticField: "Magnetic Field",
      fieldStrength: "Field Strength",
      direction: "Current Direction",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
    },
  };

  const t = texts[language];

  // Calculate magnetic field strength
  const mu0 = 4 * Math.PI * 1e-7;
  const muR = coreType === "iron" ? 1000 : 1;
  const B = (mu0 * muR * turns * current) / 0.1; // Simplified formula

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw coil (solenoid)
    const coilWidth = 200;
    const coilHeight = 100;
    
    // Draw iron core if selected
    if (coreType === "iron") {
      ctx.fillStyle = "#64748b";
      ctx.fillRect(centerX - coilWidth / 2 + 20, centerY - coilHeight / 2 + 10, coilWidth - 40, coilHeight - 20);
    }

    // Draw coil turns
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    for (let i = 0; i < turns; i++) {
      const x = centerX - coilWidth / 2 + (i / turns) * coilWidth;
      ctx.beginPath();
      ctx.ellipse(x, centerY, 15, coilHeight / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw magnetic field lines
    if (isRunning || B > 0) {
      const fieldIntensity = Math.min(B / 0.1, 5);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      
      // Internal field lines (inside solenoid)
      for (let i = -2; i <= 2; i++) {
        const y = centerY + i * 15;
        ctx.beginPath();
        ctx.moveTo(centerX - coilWidth / 2 - 50, y);
        ctx.lineTo(centerX + coilWidth / 2 + 50, y);
        ctx.stroke();
        
        // Arrow heads
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(centerX + coilWidth / 2 + 50, y);
        ctx.lineTo(centerX + coilWidth / 2 + 40, y - 5);
        ctx.lineTo(centerX + coilWidth / 2 + 40, y + 5);
        ctx.fill();
      }

      // External field lines (curved)
      ctx.beginPath();
      ctx.arc(centerX + coilWidth / 2 + 30, centerY, 60 + Math.sin(time * 0.1) * 10, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX - coilWidth / 2 - 30, centerY, 60 + Math.sin(time * 0.1) * 10, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();
    }

    // Draw current direction indicator
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("I →", centerX, centerY + coilHeight / 2 + 30);

    // Draw N and S poles
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 24px system-ui";
    ctx.fillText("N", centerX - coilWidth / 2 - 30, centerY + 8);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("S", centerX + coilWidth / 2 + 30, centerY + 8);

    // Field strength indicator
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.fillText(`B = ${(B * 1000).toFixed(2)} mT`, centerX, 30);

  }, [current, turns, coreType, isRunning, B, time]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setTime(t => t + 1);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Magnet className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-yellow-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Core Type */}
        <div className="flex gap-2">
          <Button variant={coreType === "air" ? "default" : "outline"} onClick={() => setCoreType("air")} size="sm" className={coreType === "air" ? "bg-yellow-500" : ""}>
            {t.air}
          </Button>
          <Button variant={coreType === "iron" ? "default" : "outline"} onClick={() => setCoreType("iron")} size="sm" className={coreType === "iron" ? "bg-yellow-500" : ""}>
            {t.iron}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.current}</label>
              <Badge>{current} A</Badge>
            </div>
            <Slider value={[current]} onValueChange={([v]) => setCurrent(v)} min={1} max={20} step={0.5} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.turns}</label>
              <Badge>{turns}</Badge>
            </div>
            <Slider value={[turns]} onValueChange={([v]) => setTurns(v)} min={5} max={50} step={1} />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={300} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-yellow-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.fieldStrength}</p>
            <p className="font-bold text-lg">{(B * 1000).toFixed(2)} mT</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.magneticField}</p>
            <p className="font-bold text-lg">{coreType === "iron" ? "قوي جداً" : "ضعيف"}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRunning(!isRunning)} className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"}>
            <Zap className="w-4 h-4 mr-2" />
            {isRunning ? t.stop : t.start}
          </Button>
          <Button variant="outline" onClick={() => { setIsRunning(false); setTime(0); }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
