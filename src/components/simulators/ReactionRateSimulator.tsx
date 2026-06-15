"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause } from "lucide-react";

interface ReactionRateSimulatorProps {
  language: "ar" | "en";
}

export function ReactionRateSimulator({ language }: ReactionRateSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [temperature, setTemperature] = useState(25);
  const [concentrationA, setConcentrationA] = useState(1);
  const [concentrationB, setConcentrationB] = useState(1);
  const [catalyst, setCatalyst] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const texts = {
    ar: {
      title: "محاكي سرعة التفاعل الكيميائي",
      description: "استكشف العوامل المؤثرة على سرعة التفاعل",
      temperature: "الحرارة (°C)",
      concentrationA: "تركيز A (mol/L)",
      concentrationB: "تركيز B (mol/L)",
      catalyst: "محفز",
      withCatalyst: "مع محفز",
      withoutCatalyst: "بدون محفز",
      reactionRate: "سرعة التفاعل",
      activationEnergy: "طاقة التنشيط",
      particles: "الجزيئات المتفاعلة",
      products: "النواتج",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      collision: "نظرية التصادم",
    },
    en: {
      title: "Chemical Reaction Rate Simulator",
      description: "Explore factors affecting reaction rate",
      temperature: "Temperature (°C)",
      concentrationA: "Concentration A (mol/L)",
      concentrationB: "Concentration B (mol/L)",
      catalyst: "Catalyst",
      withCatalyst: "With Catalyst",
      withoutCatalyst: "Without Catalyst",
      reactionRate: "Reaction Rate",
      activationEnergy: "Activation Energy",
      particles: "Reacting Particles",
      products: "Products",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      collision: "Collision Theory",
    },
  };

  const t = texts[language];

  // Calculate reaction rate using Arrhenius equation (simplified)
  const Ea = catalyst ? 30 : 50; // Activation energy in kJ/mol
  const R = 8.314;
  const T = temperature + 273.15;
  const k = Math.exp(-Ea * 1000 / (R * T)) * (catalyst ? 10 : 1);
  const rate = k * concentrationA * concentrationB * 1000;

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

    // Draw container
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 30, width - 100, height - 80);

    // Draw particles based on concentration and progress
    const particleCountA = Math.floor(concentrationA * 20 * (1 - progress / 100));
    const particleCountB = Math.floor(concentrationB * 20 * (1 - progress / 100));
    const productCount = Math.floor(progress * 0.4);

    const time = Date.now() / (200 - temperature);

    // Draw A particles (blue)
    ctx.fillStyle = "#3b82f6";
    for (let i = 0; i < particleCountA; i++) {
      const x = 70 + ((i * 37 + time) % (width - 140));
      const y = 50 + ((i * 53 + time * 0.7) % (height - 130));
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("A", x, y + 3);
      ctx.fillStyle = "#3b82f6";
    }

    // Draw B particles (red)
    ctx.fillStyle = "#ef4444";
    for (let i = 0; i < particleCountB; i++) {
      const x = 70 + ((i * 43 + time * 0.8) % (width - 140));
      const y = 50 + ((i * 61 + time * 0.6) % (height - 130));
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText("B", x, y + 3);
      ctx.fillStyle = "#ef4444";
    }

    // Draw products (green)
    ctx.fillStyle = "#22c55e";
    for (let i = 0; i < productCount; i++) {
      const x = 70 + ((i * 31 + time * 0.3) % (width - 140));
      const y = 50 + ((i * 47 + time * 0.2) % (height - 130));
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText("AB", x, y + 3);
      ctx.fillStyle = "#22c55e";
    }

    // Draw energy diagram
    const diagX = width - 150;
    const diagY = 50;
    const diagW = 120;
    const diagH = 80;

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.strokeRect(diagX, diagY, diagW, diagH);

    // Energy curve
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(diagX + 10, diagY + diagH - 20);
    ctx.lineTo(diagX + 30, diagY + diagH - 20);
    ctx.quadraticCurveTo(diagX + 50, diagY + 10, diagX + 70, diagY + 30);
    ctx.quadraticCurveTo(diagX + 90, diagY + 50, diagX + diagW - 10, diagY + diagH - 30);
    ctx.stroke();

    // Activation energy label
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`Ea = ${Ea} kJ`, diagX + 5, diagY - 5);

    // Temperature indicator
    ctx.fillStyle = temperature > 50 ? "#ef4444" : temperature > 25 ? "#f59e0b" : "#3b82f6";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${temperature}°C`, width / 2, height - 20);

  }, [temperature, concentrationA, concentrationB, progress, Ea]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isRunning && progress < 100) {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + rate * 0.5, 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, progress, rate]);

  const reset = () => {
    setIsRunning(false);
    setProgress(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-green-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Catalyst Toggle */}
        <div className="flex gap-2">
          <Button variant={!catalyst ? "default" : "outline"} onClick={() => setCatalyst(false)} size="sm" className={!catalyst ? "bg-green-500" : ""}>
            {t.withoutCatalyst}
          </Button>
          <Button variant={catalyst ? "default" : "outline"} onClick={() => setCatalyst(true)} size="sm" className={catalyst ? "bg-green-500" : ""}>
            {t.withCatalyst}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.temperature}</label>
              <Badge>{temperature}°C</Badge>
            </div>
            <Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} min={0} max={100} step={5} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.concentrationA}</label>
              <Badge>{concentrationA.toFixed(1)} M</Badge>
            </div>
            <Slider value={[concentrationA]} onValueChange={([v]) => setConcentrationA(v)} min={0.1} max={2} step={0.1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.concentrationB}</label>
              <Badge>{concentrationB.toFixed(1)} M</Badge>
            </div>
            <Slider value={[concentrationB]} onValueChange={([v]) => setConcentrationB(v)} min={0.1} max={2} step={0.1} />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={280} className="w-full bg-white" />
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.particles}</span>
            <span>{t.products}: {Math.floor(progress * 0.4)}</span>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.reactionRate}</p>
            <p className="font-bold text-lg">{rate.toFixed(4)} mol/(L·s)</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.activationEnergy}</p>
            <p className="font-bold text-lg">{Ea} kJ/mol</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRunning(!isRunning)} className="bg-green-500 hover:bg-green-600">
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
