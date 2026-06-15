"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, TreeDeciduous, Leaf, Sun } from "lucide-react";

interface PhotosynthesisSimulatorProps {
  language: "ar" | "en";
}

export function PhotosynthesisSimulator({ language }: PhotosynthesisSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [lightIntensity, setLightIntensity] = useState(50);
  const [co2Level, setCo2Level] = useState(400);
  const [temperature, setTemperature] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [oxygenProduced, setOxygenProduced] = useState(0);
  const [glucoseProduced, setGlucoseProduced] = useState(0);

  const texts = {
    ar: {
      title: "محاكي البناء الضوئي",
      description: "استكشف عملية البناء الضوئي في النباتات",
      lightIntensity: "شدة الضوء (%)",
      co2Level: "تركيز CO₂ (ppm)",
      temperature: "الدرجة (°C)",
      oxygen: "الأكسجين المنتج",
      glucose: "الجلوكوز المنتج",
      water: "الماء",
      light: "الضوء",
      chloroplast: "البلاستيدة الخضراء",
      equation: "6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      factors: "العوامل المؤثرة",
    },
    en: {
      title: "Photosynthesis Simulator",
      description: "Explore the photosynthesis process in plants",
      lightIntensity: "Light Intensity (%)",
      co2Level: "CO₂ Level (ppm)",
      temperature: "Temperature (°C)",
      oxygen: "Oxygen Produced",
      glucose: "Glucose Produced",
      water: "Water",
      light: "Light",
      chloroplast: "Chloroplast",
      equation: "6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      factors: "Affecting Factors",
    },
  };

  const t = texts[language];

  // Calculate photosynthesis rate
  const lightFactor = lightIntensity / 100;
  const co2Factor = co2Level / 1000;
  const tempFactor = temperature > 40 ? 0.1 : temperature < 5 ? 0.1 : Math.sin((temperature - 5) * Math.PI / 35);
  const rate = lightFactor * co2Factor * tempFactor * 10;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    ctx.clearRect(0, 0, width, height);

    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height / 2);
    skyGradient.addColorStop(0, "#87CEEB");
    skyGradient.addColorStop(1, "#E0F7FA");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height / 2);

    // Ground
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, height / 2, width, height / 2);

    // Sun
    ctx.fillStyle = `rgba(255, 200, 0, ${0.5 + lightIntensity / 200})`;
    ctx.beginPath();
    ctx.arc(width - 80, 60, 30 + lightIntensity / 5, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays
    ctx.strokeStyle = `rgba(255, 200, 0, ${lightIntensity / 150})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time;
      ctx.beginPath();
      ctx.moveTo(width - 80 + Math.cos(angle) * 40, 60 + Math.sin(angle) * 40);
      ctx.lineTo(width - 80 + Math.cos(angle) * 60, 60 + Math.sin(angle) * 60);
      ctx.stroke();
    }

    // Draw plant
    ctx.fillStyle = "#228B22";
    
    // Stem
    ctx.fillRect(width / 2 - 10, height / 2 - 20, 20, 100);
    
    // Leaves
    const drawLeaf = (x: number, y: number, angle: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawLeaf(width / 2 + 30, height / 2 - 30, 0.3, 50);
    drawLeaf(width / 2 - 30, height / 2 - 30, -0.3, 50);
    drawLeaf(width / 2 + 20, height / 2 - 60, 0.5, 40);
    drawLeaf(width / 2 - 20, height / 2 - 60, -0.5, 40);

    // Chloroplast inside leaf
    ctx.fillStyle = "#006400";
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2 - 50, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animate particles when running
    if (isRunning && rate > 0) {
      // CO2 molecules (red) entering
      ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
      for (let i = 0; i < 5; i++) {
        const x = width / 2 + Math.sin(time * 2 + i) * 30;
        const y = height / 2 - 70 - (time * 20 + i * 20) % 40;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "8px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("CO₂", x, y + 3);
        ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
      }

      // O2 molecules (blue) exiting
      ctx.fillStyle = "rgba(59, 130, 246, 0.7)";
      for (let i = 0; i < 3; i++) {
        const x = width / 2 + Math.cos(time * 3 + i) * 20;
        const y = height / 2 - 80 - ((time * 30 + i * 30) % 60);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText("O₂", x, y + 3);
        ctx.fillStyle = "rgba(59, 130, 246, 0.7)";
      }

      // Water drops
      ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
      for (let i = 0; i < 3; i++) {
        const x = width / 2 - 60 + i * 60;
        const y = height / 2 + 20 + Math.sin(time * 2 + i) * 10;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Light arrows
    if (lightIntensity > 0) {
      ctx.strokeStyle = `rgba(255, 200, 0, ${lightIntensity / 100})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(width - 80, 90);
        ctx.lineTo(width / 2 + (i - 1) * 30, height / 2 - 60);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("CO₂", 50, height / 2 - 30);
    ctx.fillText("H₂O", 50, height / 2 + 20);
    ctx.fillText("O₂", width - 50, height / 2 - 40);
    ctx.fillText("C₆H₁₂O₆", width - 50, height / 2);

  }, [lightIntensity, isRunning, rate]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setOxygenProduced(o => o + rate * 0.01);
        setGlucoseProduced(g => g + rate * 0.001);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, rate]);

  const reset = () => {
    setIsRunning(false);
    setOxygenProduced(0);
    setGlucoseProduced(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <TreeDeciduous className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-green-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm flex items-center gap-1"><Sun className="w-4 h-4" /> {t.lightIntensity}</label>
              <Badge>{lightIntensity}%</Badge>
            </div>
            <Slider value={[lightIntensity]} onValueChange={([v]) => setLightIntensity(v)} min={0} max={100} step={5} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.co2Level}</label>
              <Badge>{co2Level} ppm</Badge>
            </div>
            <Slider value={[co2Level]} onValueChange={([v]) => setCo2Level(v)} min={100} max={1000} step={50} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.temperature}</label>
              <Badge>{temperature}°C</Badge>
            </div>
            <Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} min={0} max={50} step={1} />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={300} className="w-full bg-white" />
        </div>

        {/* Equation */}
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <code className="text-sm font-mono">{t.equation}</code>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.oxygen}</p>
            <p className="font-bold text-xl text-blue-600">{oxygenProduced.toFixed(2)} mol</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.glucose}</p>
            <p className="font-bold text-xl text-amber-600">{glucoseProduced.toFixed(3)} mol</p>
          </div>
        </div>

        {/* Rate indicator */}
        <div className="p-3 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-600">{t.factors}:</p>
          <div className="flex gap-4 mt-2">
            <Badge variant="outline">Light: {(lightFactor * 100).toFixed(0)}%</Badge>
            <Badge variant="outline">CO₂: {(co2Factor * 100).toFixed(0)}%</Badge>
            <Badge variant="outline">Temp: {(tempFactor * 100).toFixed(0)}%</Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRunning(!isRunning)} className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}>
            <Leaf className="w-4 h-4 mr-2" />
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
