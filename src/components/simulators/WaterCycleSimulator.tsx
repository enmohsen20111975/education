"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, River, Mountain, Wind } from "lucide-react";

interface WaterCycleSimulatorProps {
  language: "ar" | "en";
}

export function WaterCycleSimulator({ language }: WaterCycleSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي دورة المياه في الطبيعة",
      description: "استكشف مراحل دورة المياه: التبخر، التكاثف، الهطول",
      temperature: "الحرارة (°C)",
      humidity: "الرطوبة (%)",
      evaporation: "التبخر",
      condensation: "التكاثف",
      precipitation: "الهطول",
      collection: "التجمع",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      stages: "مراحل الدورة",
    },
    en: {
      title: "Water Cycle Simulator",
      description: "Explore the water cycle stages: evaporation, condensation, precipitation",
      temperature: "Temperature (°C)",
      humidity: "Humidity (%)",
      evaporation: "Evaporation",
      condensation: "Condensation",
      precipitation: "Precipitation",
      collection: "Collection",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      stages: "Cycle Stages",
    },
  };

  const t = texts[language];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    skyGradient.addColorStop(0, "#87CEEB");
    skyGradient.addColorStop(1, "#E0F7FA");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);

    // Sun
    ctx.fillStyle = `rgba(255, 200, 0, ${0.5 + temperature / 100})`;
    ctx.beginPath();
    ctx.arc(width - 60, 50, 25, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays
    ctx.strokeStyle = `rgba(255, 200, 0, 0.5)`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 0.02;
      ctx.beginPath();
      ctx.moveTo(width - 60 + Math.cos(angle) * 30, 50 + Math.sin(angle) * 30);
      ctx.lineTo(width - 60 + Math.cos(angle) * 45, 50 + Math.sin(angle) * 45);
      ctx.stroke();
    }

    // Mountains
    ctx.fillStyle = "#6B7280";
    ctx.beginPath();
    ctx.moveTo(0, height * 0.6);
    ctx.lineTo(80, height * 0.35);
    ctx.lineTo(160, height * 0.6);
    ctx.fill();

    ctx.fillStyle = "#4B5563";
    ctx.beginPath();
    ctx.moveTo(120, height * 0.6);
    ctx.lineTo(200, height * 0.3);
    ctx.lineTo(280, height * 0.6);
    ctx.fill();

    // Clouds
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + humidity / 200})`;
    const drawCloud = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
      ctx.arc(x + size * 0.8, y, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCloud(100, 80, 40 + humidity / 10);
    drawCloud(250, 60, 50 + humidity / 10);
    drawCloud(350, 90, 35 + humidity / 10);

    // Water body (lake/ocean)
    ctx.fillStyle = "#3B82F6";
    ctx.fillRect(0, height * 0.7, width, height * 0.3);

    // Water waves
    ctx.strokeStyle = "#60A5FA";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 5) {
        const y = height * 0.72 + i * 20 + Math.sin((x + time * 2) * 0.05) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Evaporation arrows (rising water vapor)
    if (isRunning) {
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
      ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 5; i++) {
        const x = 50 + i * 80;
        const baseY = height * 0.68;
        const offset = (time * 2 + i * 30) % 150;
        
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x, baseY - offset);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, baseY - offset, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rain drops
      if (humidity > 60) {
        ctx.fillStyle = "#3B82F6";
        for (let i = 0; i < Math.floor((humidity - 60) / 5); i++) {
          const x = 80 + (i * 37 + time) % 300;
          const y = 120 + (time * 3 + i * 20) % 100;
          ctx.beginPath();
          ctx.ellipse(x, y, 2, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Rain to ground
      if (humidity > 70) {
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 1;
        for (let i = 0; i < Math.floor((humidity - 70) / 3); i++) {
          const x = 100 + (i * 45 + time * 0.5) % 280;
          ctx.beginPath();
          ctx.moveTo(x, height * 0.4);
          ctx.lineTo(x - 5, height * 0.6);
          ctx.stroke();
        }
      }
    }

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";

    if (isRunning) {
      // Evaporation label
      ctx.fillStyle = "#3B82F6";
      ctx.fillText(t.evaporation, width / 2 - 50, height * 0.5);

      // Condensation label
      ctx.fillStyle = "#6B7280";
      ctx.fillText(t.condensation, width / 2 + 50, 50);

      // Precipitation label
      if (humidity > 60) {
        ctx.fillStyle = "#3B82F6";
        ctx.fillText(t.precipitation, width / 2, height * 0.45);
      }

      // Collection label
      ctx.fillStyle = "#1e40af";
      ctx.fillText(t.collection, width / 2, height - 20);
    }

    // Temperature indicator
    ctx.fillStyle = temperature > 30 ? "#ef4444" : "#3b82f6";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`${temperature}°C`, width - 60, 90);

  }, [temperature, humidity, isRunning, time, t]);

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

  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <River className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.temperature}</label>
              <Badge>{temperature}°C</Badge>
            </div>
            <Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} min={10} max={40} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.humidity}</label>
              <Badge>{humidity}%</Badge>
            </div>
            <Slider value={[humidity]} onValueChange={([v]) => setHumidity(v)} min={30} max={90} step={5} />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={450} height={320} className="w-full bg-white" />
        </div>

        {/* Stages */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 bg-blue-50 rounded text-center">
            <p className="text-xs text-slate-500">{t.evaporation}</p>
            <p className="text-lg">💨</p>
          </div>
          <div className="p-2 bg-gray-100 rounded text-center">
            <p className="text-xs text-slate-500">{t.condensation}</p>
            <p className="text-lg">☁️</p>
          </div>
          <div className="p-2 bg-blue-100 rounded text-center">
            <p className="text-xs text-slate-500">{t.precipitation}</p>
            <p className="text-lg">🌧️</p>
          </div>
          <div className="p-2 bg-cyan-50 rounded text-center">
            <p className="text-xs text-slate-500">{t.collection}</p>
            <p className="text-lg">💧</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRunning(!isRunning)} className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}>
            <Wind className="w-4 h-4 mr-2" />
            {isRunning ? t.stop : t.start}
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
