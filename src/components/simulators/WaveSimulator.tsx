"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Waves, Activity, Zap } from "lucide-react";

interface WaveSimulatorProps {
  language: "ar" | "en";
}

export function WaveSimulator({ language }: WaveSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(2);
  const [wavelength, setWavelength] = useState(100);
  const [showParticles, setShowParticles] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [waveType, setWaveType] = useState<"transverse" | "longitudinal">("transverse");

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الموجات",
      description: "استكشف أنواع الموجات وخصائصها",
      amplitude: "السعة",
      frequency: "التردد",
      wavelength: "الطول الموجي",
      period: "الدورة الزمنية",
      speed: "سرعة الموجة",
      transverse: "موجة مستعرضة",
      longitudinal: "موجة طولية",
      showParticles: "عرض جزيئات الوسط",
      pause: "إيقاف",
      play: "تشغيل",
      reset: "إعادة",
      formula: "v = f × λ",
      hz: "هرتز",
      meters: "متر",
      mps: "م/ث",
      particles: "جزيئات الوسط",
      waveDirection: "اتجاه انتشار الموجة",
    },
    en: {
      title: "Wave Simulator",
      description: "Explore wave types and properties",
      amplitude: "Amplitude",
      frequency: "Frequency",
      wavelength: "Wavelength",
      period: "Period",
      speed: "Wave Speed",
      transverse: "Transverse Wave",
      longitudinal: "Longitudinal Wave",
      showParticles: "Show Medium Particles",
      pause: "Pause",
      play: "Play",
      reset: "Reset",
      formula: "v = f × λ",
      hz: "Hz",
      meters: "m",
      mps: "m/s",
      particles: "Medium Particles",
      waveDirection: "Wave Direction",
    },
  };

  const t = texts[language];

  // Calculate wave properties
  const period = 1 / frequency;
  const waveSpeed = frequency * wavelength;

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y <= height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x <= width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    if (waveType === "transverse") {
      // Draw transverse wave
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 4;
      ctx.beginPath();

      for (let x = 0; x <= width; x += 2) {
        const phase = (x / wavelength) * 2 * Math.PI - time * frequency * 2 * Math.PI;
        const y = centerY + amplitude * Math.sin(phase);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw wave envelope (max/min)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, centerY - amplitude);
      ctx.lineTo(width, centerY - amplitude);
      ctx.moveTo(0, centerY + amplitude);
      ctx.lineTo(width, centerY + amplitude);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw particles (dots moving up and down)
      if (showParticles) {
        const particleSpacing = 30;
        for (let x = particleSpacing / 2; x < width; x += particleSpacing) {
          const phase = (x / wavelength) * 2 * Math.PI - time * frequency * 2 * Math.PI;
          const y = centerY + amplitude * Math.sin(phase);

          // Velocity arrow
          const velocity = -amplitude * frequency * 2 * Math.PI * Math.cos(phase);
          const arrowLength = velocity * 0.3;

          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();

          // Arrow showing particle motion direction
          if (Math.abs(arrowLength) > 5) {
            ctx.strokeStyle = arrowLength > 0 ? "#22c55e" : "#ef4444";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - arrowLength);
            ctx.stroke();
          }
        }
      }

      // Wave direction arrow
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(width - 50, centerY);
      ctx.lineTo(width - 70, centerY - 8);
      ctx.lineTo(width - 70, centerY + 8);
      ctx.fill();
      ctx.font = "12px system-ui";
      ctx.fillText(t.waveDirection, width - 120, centerY - 20);

    } else {
      // Longitudinal wave
      const particleSpacing = 15;
      
      for (let x = particleSpacing; x < width; x += particleSpacing) {
        const phase = (x / wavelength) * 2 * Math.PI - time * frequency * 2 * Math.PI;
        const displacement = (amplitude * 0.3) * Math.sin(phase);
        const newX = x + displacement;

        // Density color (compression = dark, rarefaction = light)
        const density = Math.cos(phase);
        const color = density > 0 
          ? `rgba(59, 130, 246, ${0.5 + density * 0.5})` 
          : `rgba(147, 197, 253, ${0.5 - density * 0.3})`;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(newX, centerY, 8 + density * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw compression/rarefaction labels
      ctx.font = "11px system-ui";
      ctx.fillStyle = "#1e40af";
      ctx.fillText(language === "ar" ? "انضغاط" : "Compression", 50, centerY - 50);
      ctx.fillStyle = "#93c5fd";
      ctx.fillText(language === "ar" ? "تخلخل" : "Rarefaction", 150, centerY - 50);
    }

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    
    // Amplitude label
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    ctx.lineTo(20, centerY - amplitude);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillText(`A = ${amplitude}`, 25, centerY - amplitude / 2);

    // Wavelength label
    const wlX = wavelength;
    ctx.beginPath();
    ctx.moveTo(20, centerY + amplitude + 20);
    ctx.lineTo(20 + wlX, centerY + amplitude + 20);
    ctx.strokeStyle = "#22c55e";
    ctx.stroke();
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`λ = ${wavelength}`, 20 + wlX / 2 - 20, centerY + amplitude + 35);

  }, [amplitude, frequency, wavelength, time, showParticles, waveType, language, t.waveDirection]);

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

  // Reset
  const handleReset = () => {
    setTime(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Wave Type Toggle */}
        <div className="flex gap-3">
          <Button
            variant={waveType === "transverse" ? "default" : "outline"}
            onClick={() => setWaveType("transverse")}
            className={waveType === "transverse" ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            {t.transverse}
          </Button>
          <Button
            variant={waveType === "longitudinal" ? "default" : "outline"}
            onClick={() => setWaveType("longitudinal")}
            className={waveType === "longitudinal" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
          >
            {t.longitudinal}
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
              max={80}
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
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.wavelength}</label>
              <Badge variant="secondary">{wavelength} {t.meters}</Badge>
            </div>
            <Slider
              value={[wavelength]}
              onValueChange={([value]) => setWavelength(value)}
              min={50}
              max={200}
              step={10}
            />
          </div>
        </div>

        {/* Particle toggle */}
        {waveType === "transverse" && (
          <div className="flex items-center gap-3">
            <Switch checked={showParticles} onCheckedChange={setShowParticles} />
            <label className="text-sm">{t.showParticles}</label>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-500 hover:bg-blue-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.play}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
          <code className="text-sm font-mono">{t.formula}</code>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={700} height={250} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.period}</p>
            <p className="text-xl font-bold text-blue-600">{period.toFixed(2)} {t.hz === "هرتز" ? "ثانية" : "s"}</p>
          </div>
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.speed}</p>
            <p className="text-xl font-bold text-cyan-600">{waveSpeed.toFixed(1)} {t.mps}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.frequency}</p>
            <p className="text-xl font-bold text-purple-600">{frequency} {t.hz}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
