"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Waves, ArrowRight, CornerDownRight } from "lucide-react";

interface WaveReflectionSimulatorProps {
  language: "ar" | "en";
}

export function WaveReflectionSimulator({ language }: WaveReflectionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(2);
  const [reflectionType, setReflectionType] = useState<"fixed" | "free">("fixed");
  const [showIncident, setShowIncident] = useState(true);
  const [showReflected, setShowReflected] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [wallPosition, setWallPosition] = useState(0.7); // 0 to 1

  const texts = {
    ar: {
      title: "محاكي انعكاس الموجات",
      description: "استكشف انعكاس الموجات من نهاية ثابتة وحرة",
      amplitude: "السعة",
      frequency: "التردد",
      fixedEnd: "نهاية ثابتة",
      freeEnd: "نهاية حرة",
      showIncident: "عرض الموجة الساقطة",
      showReflected: "عرض الموجة المنعكسة",
      pause: "إيقاف",
      play: "تشغيل",
      reset: "إعادة",
      hz: "هرتز",
      incidentWave: "الموجة الساقطة",
      reflectedWave: "الموجة المنعكسة",
      wallPosition: "موضع الحاجز",
      explanation: "التفسير الفيزيائي",
      fixedExp: "عند النهاية الثابتة: تنعكس الموجة مع انقلاب في الطور (تتحول القمة إلى قاع والعكس)",
      freeExp: "عند النهاية الحرة: تنعكس الموجة بدون انقلاب في الطور",
      phaseShift: "إزاحة الطور",
      noPhaseShift: "لا توجد إزاحة طور",
      halfWaveShift: "إزاحة نصف موجة (180°)",
    },
    en: {
      title: "Wave Reflection Simulator",
      description: "Explore wave reflection from fixed and free ends",
      amplitude: "Amplitude",
      frequency: "Frequency",
      fixedEnd: "Fixed End",
      freeEnd: "Free End",
      showIncident: "Show Incident Wave",
      showReflected: "Show Reflected Wave",
      pause: "Pause",
      play: "Play",
      reset: "Reset",
      hz: "Hz",
      incidentWave: "Incident Wave",
      reflectedWave: "Reflected Wave",
      wallPosition: "Wall Position",
      explanation: "Physical Explanation",
      fixedExp: "At fixed end: wave reflects with phase inversion (peak becomes trough and vice versa)",
      freeExp: "At free end: wave reflects without phase inversion",
      phaseShift: "Phase Shift",
      noPhaseShift: "No phase shift",
      halfWaveShift: "Half-wave shift (180°)",
    },
  };

  const t = texts[language];

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const wallX = width * wallPosition;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    for (let y = 0; y <= height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    for (let x = 0; x <= width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw wall
    ctx.fillStyle = reflectionType === "fixed" ? "#374151" : "#60a5fa";
    ctx.fillRect(wallX, 0, 8, height);
    
    // Wall label
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      reflectionType === "fixed" ? 
        (language === "ar" ? "نهاية ثابتة" : "Fixed End") : 
        (language === "ar" ? "نهاية حرة" : "Free End"),
      wallX + 4, 
      20
    );

    // Center line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(wallX, centerY);
    ctx.stroke();

    const wavelength = 80;
    const phaseOffset = reflectionType === "fixed" ? Math.PI : 0;

    // Draw incident wave (left to right, stops at wall)
    if (showIncident) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let x = 0; x <= wallX; x += 2) {
        const phase = (x / wavelength) * 2 * Math.PI - time * frequency * 2 * Math.PI;
        const y = centerY - amplitude * Math.sin(phase);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Direction arrow for incident wave
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(wallX - 60, centerY - 60);
      ctx.lineTo(wallX - 40, centerY - 60);
      ctx.lineTo(wallX - 40, centerY - 65);
      ctx.lineTo(wallX - 30, centerY - 57);
      ctx.lineTo(wallX - 40, centerY - 50);
      ctx.lineTo(wallX - 40, centerY - 55);
      ctx.lineTo(wallX - 60, centerY - 55);
      ctx.fill();
    }

    // Draw reflected wave (right to left, from wall)
    if (showReflected) {
      ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let x = wallX; x >= 0; x -= 2) {
        // Reflected wave travels in opposite direction
        const distanceFromWall = wallX - x;
        const phase = -(distanceFromWall / wavelength) * 2 * Math.PI - time * frequency * 2 * Math.PI + phaseOffset;
        const y = centerY - amplitude * Math.sin(phase);
        
        if (x === wallX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Direction arrow for reflected wave
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(wallX - 60, centerY + 50);
      ctx.lineTo(wallX - 80, centerY + 50);
      ctx.lineTo(wallX - 80, centerY + 45);
      ctx.lineTo(wallX - 90, centerY + 53);
      ctx.lineTo(wallX - 80, centerY + 60);
      ctx.lineTo(wallX - 80, centerY + 55);
      ctx.lineTo(wallX - 60, centerY + 55);
      ctx.fill();
    }

    // Labels
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    
    if (showIncident) {
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(t.incidentWave, 10, 30);
    }
    
    if (showReflected) {
      ctx.fillStyle = "#ef4444";
      ctx.fillText(t.reflectedWave, 10, 50);
    }

    // Draw phase indicator at wall
    const incidentPhaseAtWall = -time * frequency * 2 * Math.PI;
    const reflectedPhaseAtWall = -time * frequency * 2 * Math.PI + phaseOffset;
    
    const incidentY = centerY - amplitude * Math.sin(incidentPhaseAtWall);
    const reflectedY = centerY - amplitude * Math.sin(reflectedPhaseAtWall);

    // Draw points at wall
    if (showIncident && showReflected) {
      ctx.beginPath();
      ctx.arc(wallX, incidentY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(wallX, reflectedY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.stroke();
    }

  }, [amplitude, frequency, time, showIncident, showReflected, wallPosition, reflectionType, language, t]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const startTime = Date.now() - time * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTime(elapsed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, time]);

  const handleReset = () => {
    setTime(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CornerDownRight className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Reflection Type Toggle */}
        <div className="flex gap-3">
          <Button
            variant={reflectionType === "fixed" ? "default" : "outline"}
            onClick={() => setReflectionType("fixed")}
            className={reflectionType === "fixed" ? "bg-gray-700 hover:bg-gray-800" : ""}
          >
            {t.fixedEnd}
          </Button>
          <Button
            variant={reflectionType === "free" ? "default" : "outline"}
            onClick={() => setReflectionType("free")}
            className={reflectionType === "free" ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            {t.freeEnd}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.amplitude}</label>
              <Badge variant="secondary">{amplitude}</Badge>
            </div>
            <Slider
              value={[amplitude]}
              onValueChange={([value]) => setAmplitude(value)}
              min={10}
              max={60}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.frequency}</label>
              <Badge variant="secondary">{frequency} {t.hz}</Badge>
            </div>
            <Slider
              value={[frequency]}
              onValueChange={([value]) => setFrequency(value)}
              min={0.5}
              max={4}
              step={0.5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.wallPosition}</label>
              <Badge variant="secondary">{Math.round(wallPosition * 100)}%</Badge>
            </div>
            <Slider
              value={[wallPosition]}
              onValueChange={([value]) => setWallPosition(value)}
              min={0.5}
              max={0.9}
              step={0.1}
            />
          </div>
        </div>

        {/* Show waves toggles */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <Switch checked={showIncident} onCheckedChange={setShowIncident} />
            <label className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              {t.showIncident}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={showReflected} onCheckedChange={setShowReflected} />
            <label className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              {t.showReflected}
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-rose-500 hover:bg-rose-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.play}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={700} height={280} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${reflectionType === "fixed" ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-950"}`}>
            <p className="text-sm text-slate-500 mb-1">{language === "ar" ? "نوع الانعكاس" : "Reflection Type"}</p>
            <p className="text-lg font-bold">
              {reflectionType === "fixed" ? t.fixedEnd : t.freeEnd}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${reflectionType === "fixed" ? "bg-red-50 dark:bg-red-950" : "bg-green-50 dark:bg-green-950"}`}>
            <p className="text-sm text-slate-500 mb-1">{t.phaseShift}</p>
            <p className={`text-lg font-bold ${reflectionType === "fixed" ? "text-red-600" : "text-green-600"}`}>
              {reflectionType === "fixed" ? t.halfWaveShift : t.noPhaseShift}
            </p>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Waves className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {reflectionType === "fixed" ? t.fixedExp : t.freeExp}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
