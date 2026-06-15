"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Globe, MapPin, Navigation } from "lucide-react";

interface PlateTectonicsSimulatorProps {
  language: "ar" | "en";
}

export function PlateTectonicsSimulator({ language }: PlateTectonicsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [plateSpeed, setPlateSpeed] = useState(2);
  const [boundaryType, setBoundaryType] = useState<"convergent" | "divergent" | "transform">("convergent");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الألواح التكتونية",
      description: "استكشف أنواع حدود الألواح التكتونية",
      plateSpeed: "سرعة الحركة (سم/سنة)",
      convergent: "حد تقاربي",
      divergent: "حد تباعدي",
      transform: "حد تحويلي",
      mountains: "جبال",
      trench: "خندق",
      volcano: "بركان",
      earthquake: "زلزال",
      ridge: "سلسلة جبال محيطية",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      features: "المظاهر الجيولوجية",
    },
    en: {
      title: "Plate Tectonics Simulator",
      description: "Explore types of plate boundaries",
      plateSpeed: "Movement Speed (cm/yr)",
      convergent: "Convergent",
      divergent: "Divergent",
      transform: "Transform",
      mountains: "Mountains",
      trench: "Trench",
      volcano: "Volcano",
      earthquake: "Earthquake",
      ridge: "Mid-ocean Ridge",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      features: "Geological Features",
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
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Background - mantle
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, 0, width, height);

    // Asthenosphere (molten rock)
    const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
    gradient.addColorStop(0, "#B8860B");
    gradient.addColorStop(1, "#FF4500");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height * 0.7, width, height * 0.3);

    // Convection currents
    ctx.strokeStyle = "rgba(255, 100, 0, 0.4)";
    ctx.lineWidth = 2;
    const convOffset = isRunning ? time * 0.02 : 0;
    
    // Left convection
    ctx.beginPath();
    ctx.arc(width * 0.25, height * 0.85, 40, Math.PI + convOffset, convOffset);
    ctx.stroke();
    
    // Right convection
    ctx.beginPath();
    ctx.arc(width * 0.75, height * 0.85, 40, convOffset, Math.PI + convOffset);
    ctx.stroke();

    // Draw plates based on boundary type
    const offset = isRunning ? Math.sin(time * 0.05) * plateSpeed * 5 : 0;

    if (boundaryType === "convergent") {
      // Left plate (oceanic)
      ctx.fillStyle = "#4B5563";
      ctx.beginPath();
      ctx.moveTo(0, centerY - 30);
      ctx.lineTo(centerX - 20 + offset, centerY - 30);
      ctx.lineTo(centerX - 30 + offset, centerY + 20);
      ctx.lineTo(0, centerY + 20);
      ctx.fill();

      // Right plate (continental)
      ctx.fillStyle = "#8B7355";
      ctx.beginPath();
      ctx.moveTo(centerX + 20 - offset, centerY - 50);
      ctx.lineTo(width, centerY - 50);
      ctx.lineTo(width, centerY + 20);
      ctx.lineTo(centerX + 30 - offset, centerY + 20);
      ctx.fill();

      // Subduction zone
      ctx.fillStyle = "#374151";
      ctx.beginPath();
      ctx.moveTo(centerX - 20 + offset, centerY - 30);
      ctx.lineTo(centerX + 20 - offset, centerY - 50);
      ctx.lineTo(centerX + 30 - offset, centerY + 20);
      ctx.lineTo(centerX - 30 + offset, centerY + 20);
      ctx.fill();

      // Mountains on continental plate
      ctx.fillStyle = "#6B7280";
      for (let i = 0; i < 3; i++) {
        const mx = centerX + 60 - offset + i * 40;
        ctx.beginPath();
        ctx.moveTo(mx, centerY - 50);
        ctx.lineTo(mx + 20, centerY - 80 - i * 10);
        ctx.lineTo(mx + 40, centerY - 50);
        ctx.fill();
      }

      // Volcano
      ctx.fillStyle = "#4B5563";
      ctx.beginPath();
      ctx.moveTo(centerX + 30 - offset, centerY - 50);
      ctx.lineTo(centerX + 50 - offset, centerY - 90);
      ctx.lineTo(centerX + 70 - offset, centerY - 50);
      ctx.fill();
      
      // Lava
      if (isRunning) {
        ctx.fillStyle = "#FF4500";
        ctx.beginPath();
        ctx.arc(centerX + 50 - offset, centerY - 85, 5 + Math.sin(time * 0.1) * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Trench
      ctx.fillStyle = "#1F2937";
      ctx.beginPath();
      ctx.moveTo(centerX - 30 + offset, centerY + 20);
      ctx.lineTo(centerX - 10 + offset, centerY + 40);
      ctx.lineTo(centerX + 10 - offset, centerY + 40);
      ctx.lineTo(centerX + 30 - offset, centerY + 20);
      ctx.fill();

      // Labels
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.trench, centerX, centerY + 60);
      ctx.fillText(t.mountains, centerX + 120, centerY - 90);
      ctx.fillText(t.volcano, centerX + 50, centerY - 100);

    } else if (boundaryType === "divergent") {
      // Left plate
      ctx.fillStyle = "#4B5563";
      ctx.beginPath();
      ctx.moveTo(0, centerY - 30);
      ctx.lineTo(centerX - 30 - offset, centerY - 30);
      ctx.lineTo(centerX - 40 - offset, centerY + 20);
      ctx.lineTo(0, centerY + 20);
      ctx.fill();

      // Right plate
      ctx.fillStyle = "#4B5563";
      ctx.beginPath();
      ctx.moveTo(centerX + 30 + offset, centerY - 30);
      ctx.lineTo(width, centerY - 30);
      ctx.lineTo(width, centerY + 20);
      ctx.lineTo(centerX + 40 + offset, centerY + 20);
      ctx.fill();

      // Rift / magma rising
      ctx.fillStyle = "#FF4500";
      ctx.beginPath();
      ctx.moveTo(centerX - 30 - offset, centerY - 30);
      ctx.lineTo(centerX - 10, centerY - 50 + Math.sin(time * 0.1) * 5);
      ctx.lineTo(centerX + 10, centerY - 50 + Math.sin(time * 0.1) * 5);
      ctx.lineTo(centerX + 30 + offset, centerY - 30);
      ctx.lineTo(centerX + 40 + offset, centerY + 20);
      ctx.lineTo(centerX, centerY + 40);
      ctx.lineTo(centerX - 40 - offset, centerY + 20);
      ctx.fill();

      // Ridge formation
      ctx.fillStyle = "#6B7280";
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY - 60);
      ctx.lineTo(centerX, centerY - 80);
      ctx.lineTo(centerX + 20, centerY - 60);
      ctx.lineTo(centerX + 15, centerY - 50);
      ctx.lineTo(centerX - 15, centerY - 50);
      ctx.fill();

      // Labels
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.ridge, centerX, centerY - 90);

    } else if (boundaryType === "transform") {
      // Top plate
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(0, centerY - 60, width, 50);

      // Bottom plate
      ctx.fillStyle = "#4B5563";
      ctx.fillRect(0, centerY + 10, width, 50);

      // Fault line
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, centerY - 10);
      ctx.lineTo(width, centerY - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      // Movement arrows
      if (isRunning) {
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 3;
        
        // Top plate arrow (moving right)
        ctx.beginPath();
        ctx.moveTo(centerX - 50 + offset, centerY - 35);
        ctx.lineTo(centerX + 50 + offset, centerY - 35);
        ctx.stroke();
        ctx.fillStyle = "#3B82F6";
        ctx.beginPath();
        ctx.moveTo(centerX + 50 + offset, centerY - 35);
        ctx.lineTo(centerX + 40 + offset, centerY - 40);
        ctx.lineTo(centerX + 40 + offset, centerY - 30);
        ctx.fill();

        // Bottom plate arrow (moving left)
        ctx.strokeStyle = "#EF4444";
        ctx.beginPath();
        ctx.moveTo(centerX + 50 - offset, centerY + 35);
        ctx.lineTo(centerX - 50 - offset, centerY + 35);
        ctx.stroke();
        ctx.fillStyle = "#EF4444";
        ctx.beginPath();
        ctx.moveTo(centerX - 50 - offset, centerY + 35);
        ctx.lineTo(centerX - 40 - offset, centerY + 30);
        ctx.lineTo(centerX - 40 - offset, centerY + 40);
        ctx.fill();

        // Earthquake
        ctx.strokeStyle = "#FBBF24";
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const r = 10 + i * 15 + Math.sin(time * 0.2) * 5;
          ctx.beginPath();
          ctx.arc(centerX, centerY - 10, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Labels
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.earthquake, centerX, centerY + 80);
    }

    // Direction arrows on plates
    ctx.fillStyle = "#fff";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    
    if (boundaryType === "convergent") {
      ctx.fillText("→", centerX - 80 + offset, centerY);
      ctx.fillText("←", centerX + 60 - offset, centerY);
    } else if (boundaryType === "divergent") {
      ctx.fillText("←", centerX - 80 - offset, centerY);
      ctx.fillText("→", centerX + 60 + offset, centerY);
    }

  }, [boundaryType, plateSpeed, isRunning, time, t]);

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
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Boundary Type */}
        <div className="flex gap-2 flex-wrap">
          <Button variant={boundaryType === "convergent" ? "default" : "outline"} onClick={() => setBoundaryType("convergent")} size="sm" className={boundaryType === "convergent" ? "bg-amber-500" : ""}>
            {t.convergent}
          </Button>
          <Button variant={boundaryType === "divergent" ? "default" : "outline"} onClick={() => setBoundaryType("divergent")} size="sm" className={boundaryType === "divergent" ? "bg-amber-500" : ""}>
            {t.divergent}
          </Button>
          <Button variant={boundaryType === "transform" ? "default" : "outline"} onClick={() => setBoundaryType("transform")} size="sm" className={boundaryType === "transform" ? "bg-amber-500" : ""}>
            {t.transform}
          </Button>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm">{t.plateSpeed}</label>
            <Badge>{plateSpeed} cm/yr</Badge>
          </div>
          <Slider value={[plateSpeed]} onValueChange={([v]) => setPlateSpeed(v)} min={1} max={10} step={0.5} />
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={450} height={300} className="w-full bg-white" />
        </div>

        {/* Features */}
        <div className="p-3 bg-amber-50 rounded-lg">
          <p className="text-sm font-medium mb-2">{t.features}:</p>
          <div className="flex flex-wrap gap-2">
            {boundaryType === "convergent" && (
              <>
                <Badge variant="outline">{t.mountains} 🏔️</Badge>
                <Badge variant="outline">{t.volcano} 🌋</Badge>
                <Badge variant="outline">{t.trench}</Badge>
              </>
            )}
            {boundaryType === "divergent" && (
              <>
                <Badge variant="outline">{t.ridge}</Badge>
                <Badge variant="outline">{t.volcano} 🌋</Badge>
              </>
            )}
            {boundaryType === "transform" && (
              <>
                <Badge variant="outline">{t.earthquake} ⚡</Badge>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRunning(!isRunning)} className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}>
            <Navigation className="w-4 h-4 mr-2" />
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
