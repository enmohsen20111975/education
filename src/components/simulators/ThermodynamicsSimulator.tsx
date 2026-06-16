"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Thermometer, Flame, Snowflake } from "lucide-react";

interface ThermodynamicsSimulatorProps {
  language: "ar" | "en";
}

export function ThermodynamicsSimulator({ language }: ThermodynamicsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState(1);
  const [volume, setVolume] = useState(22.4);
  const [moles, setMoles] = useState(1);

  const texts = {
    ar: {
      title: "محاكي الديناميكا الحرارية",
      description: "استكشف قانون الغاز المثالي: PV = nRT",
      temperature: "الدرجة (°C)",
      pressure: "الضغط (atm)",
      volume: "الحجم (L)",
      moles: "عدد المولات",
      kineticEnergy: "الطاقة الحركية",
      idealGasLaw: "قانون الغاز المثالي: PV = nRT",
      gasConstant: "ثابت الغاز R = 0.0821 L·atm/(mol·K)",
      hot: "ساخن",
      cold: "بارد",
      reset: "إعادة",
    },
    en: {
      title: "Thermodynamics Simulator",
      description: "Explore the Ideal Gas Law: PV = nRT",
      temperature: "Temperature (°C)",
      pressure: "Pressure (atm)",
      volume: "Volume (L)",
      moles: "Moles (n)",
      kineticEnergy: "Kinetic Energy",
      idealGasLaw: "Ideal Gas Law: PV = nRT",
      gasConstant: "Gas Constant R = 0.0821 L·atm/(mol·K)",
      hot: "Hot",
      cold: "Cold",
      reset: "Reset",
    },
  };

  const t = texts[language];

  // Calculate ideal gas properties
  const tempK = temperature + 273.15;
  const calculatedVolume = (moles * 0.0821 * tempK) / pressure;
  const kineticEnergy = (3 / 2) * moles * 8.314 * tempK;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Container
    const containerX = 50;
    const containerY = 50;
    const containerW = 300;
    const containerH = 200;
    const pistonY = containerY + containerH - (volume / 50) * containerH;

    // Background gradient based on temperature
    const tempRatio = (temperature + 100) / 300;
    const r = Math.min(255, Math.floor(200 + tempRatio * 55));
    const b = Math.max(0, Math.floor(200 - tempRatio * 200));
    ctx.fillStyle = `rgb(${r}, 100, ${b})`;
    ctx.fillRect(containerX, pistonY, containerW, containerY + containerH - pistonY);

    // Container walls
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 4;
    ctx.strokeRect(containerX, containerY, containerW, containerH);

    // Piston
    ctx.fillStyle = "#64748b";
    ctx.fillRect(containerX - 10, pistonY - 20, containerW + 20, 20);
    ctx.strokeStyle = "#475569";
    ctx.strokeRect(containerX - 10, pistonY - 20, containerW + 20, 20);

    // Pressure arrows
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    const arrowCount = 5;
    for (let i = 0; i < arrowCount; i++) {
      const ax = containerX + (i + 1) * (containerW / (arrowCount + 1));
      const arrowLen = pressure * 10;
      ctx.beginPath();
      ctx.moveTo(ax, pistonY - 30);
      ctx.lineTo(ax, pistonY - 30 - arrowLen);
      ctx.stroke();
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(ax, pistonY - 30 - arrowLen);
      ctx.lineTo(ax - 5, pistonY - 25 - arrowLen);
      ctx.lineTo(ax + 5, pistonY - 25 - arrowLen);
      ctx.fill();
    }

    // Gas particles
    const particleCount = Math.min(50, Math.floor(moles * 10));
    const time = Date.now() / 1000;
    const speed = (temperature + 100) / 50;

    ctx.fillStyle = temperature > 0 ? "#ef4444" : "#3b82f6";
    for (let i = 0; i < particleCount; i++) {
      const baseX = containerX + 30 + (i % 7) * 35;
      const baseY = pistonY + 30 + Math.floor(i / 7) * 25;
      const offsetX = Math.sin(time * speed + i) * 15;
      const offsetY = Math.cos(time * speed + i * 1.5) * 10;
      
      if (baseY + offsetY < containerY + containerH - 10 && baseY + offsetY > pistonY + 10) {
        ctx.beginPath();
        ctx.arc(baseX + offsetX, baseY + offsetY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`${volume.toFixed(1)} L`, containerX + containerW / 2 - 20, containerY + containerH + 30);
    ctx.fillText(`${pressure.toFixed(1)} atm`, containerX + containerW + 20, pistonY);

    // Temperature indicator
    const tempX = containerX + containerW + 80;
    const tempY = 80;
    const thermometerH = 150;

    // Thermometer background
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(tempX, tempY, 30, thermometerH);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(tempX, tempY, 30, thermometerH);

    // Thermometer bulb
    ctx.fillStyle = temperature > 0 ? "#ef4444" : "#3b82f6";
    ctx.beginPath();
    ctx.arc(tempX + 15, tempY + thermometerH + 15, 20, 0, Math.PI * 2);
    ctx.fill();

    // Mercury level
    const mercuryH = ((temperature + 100) / 300) * thermometerH;
    ctx.fillRect(tempX + 5, tempY + thermometerH - mercuryH, 20, mercuryH + 15);

    // Temperature scale
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.fillText("100°C", tempX + 35, tempY + 10);
    ctx.fillText("0°C", tempX + 35, tempY + thermometerH * 0.67);
    ctx.fillText("-100°C", tempX + 35, tempY + thermometerH);

    // Current temp
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px system-ui";
    ctx.fillText(`${temperature}°C`, tempX - 5, tempY + thermometerH + 55);

    // Kinetic energy bar
    const keX = tempX + 80;
    const keH = (kineticEnergy / 5000) * 100;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(keX, tempY + thermometerH - keH, 30, keH);
    ctx.strokeStyle = "#1e293b";
    ctx.strokeRect(keX, tempY, 30, thermometerH);
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "10px system-ui";
    ctx.fillText("KE", keX + 8, tempY + thermometerH + 15);

  }, [temperature, pressure, volume, moles, kineticEnergy]);

  // Animation
  useEffect(() => {
    const animate = () => {
      drawCanvas();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [drawCanvas]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-orange-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                {temperature > 25 ? <Flame className="w-4 h-4 text-red-500" /> : 
                 temperature < 0 ? <Snowflake className="w-4 h-4 text-blue-500" /> : 
                 <Thermometer className="w-4 h-4" />}
                {t.temperature}
              </label>
              <Badge variant="secondary">{temperature}°C</Badge>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={-100}
              max={200}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.pressure}</label>
              <Badge variant="secondary">{pressure.toFixed(1)} atm</Badge>
            </div>
            <Slider
              value={[pressure]}
              onValueChange={([v]) => setPressure(v)}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.moles}</label>
              <Badge variant="secondary">{moles.toFixed(1)} mol</Badge>
            </div>
            <Slider
              value={[moles]}
              onValueChange={([v]) => setMoles(v)}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.volume}</label>
              <Badge variant="secondary">{volume.toFixed(1)} L</Badge>
            </div>
            <Slider
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              min={5}
              max={50}
              step={1}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={550}
            height={320}
            className="w-full bg-white"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.volume} (calculated)</p>
            <p className="font-bold text-xl text-orange-600">{calculatedVolume.toFixed(2)} L</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.kineticEnergy}</p>
            <p className="font-bold text-xl text-red-600">{kineticEnergy.toFixed(0)} J</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">T (Kelvin)</p>
            <p className="font-bold text-xl text-blue-600">{tempK.toFixed(1)} K</p>
          </div>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <code className="text-sm font-mono">{t.idealGasLaw}</code>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <code className="text-sm font-mono">{t.gasConstant}</code>
          </div>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={() => { setTemperature(25); setPressure(1); setVolume(22.4); setMoles(1); }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
