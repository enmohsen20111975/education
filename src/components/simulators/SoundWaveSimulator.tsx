"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Volume2, Activity } from "lucide-react";

interface SoundWaveSimulatorProps {
  language: "ar" | "en";
}

export function SoundWaveSimulator({ language }: SoundWaveSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(50);
  const [waveType, setWaveType] = useState<"sine" | "square" | "triangle">("sine");
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الموجات الصوتية",
      description: "استكشف خصائص الموجات الصوتية: التردد والسعة",
      frequency: "التردد (Hz)",
      amplitude: "السعة",
      waveType: "نوع الموجة",
      sine: "جيبية",
      square: "مربعة",
      triangle: "مثلثية",
      wavelength: "طول الموجة",
      period: "الدورة",
      speed: "سرعة الصوت",
      play: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
    },
    en: {
      title: "Sound Wave Simulator",
      description: "Explore sound wave properties: frequency and amplitude",
      frequency: "Frequency (Hz)",
      amplitude: "Amplitude",
      waveType: "Wave Type",
      sine: "Sine",
      square: "Square",
      triangle: "Triangle",
      wavelength: "Wavelength",
      period: "Period",
      speed: "Speed of Sound",
      play: "Play",
      stop: "Stop",
      reset: "Reset",
    },
  };

  const t = texts[language];

  const wavelength = 343 / frequency;
  const period = 1 / frequency;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw center line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw wave
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    const scale = frequency / 100;
    const offset = time * frequency * 0.01;

    for (let x = 0; x < width; x++) {
      let y;
      const t = (x / width) * Math.PI * 2 * scale + offset;
      
      switch (waveType) {
        case "square":
          y = Math.sign(Math.sin(t)) * amplitude;
          break;
        case "triangle":
          y = (2 / Math.PI) * Math.asin(Math.sin(t)) * amplitude;
          break;
        default:
          y = Math.sin(t) * amplitude;
      }

      if (x === 0) {
        ctx.moveTo(x, centerY - y);
      } else {
        ctx.lineTo(x, centerY - y);
      }
    }
    ctx.stroke();

    // Draw amplitude markers
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY - amplitude);
    ctx.lineTo(width, centerY - amplitude);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY + amplitude);
    ctx.lineTo(width, centerY + amplitude);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.fillText(`A = ${amplitude}`, 10, centerY - amplitude - 5);
    ctx.fillText(`f = ${frequency} Hz`, 10, 20);
    ctx.fillText(`λ = ${wavelength.toFixed(2)} m`, 10, 40);

  }, [frequency, amplitude, waveType, time, wavelength]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isPlaying) {
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
  }, [isPlaying]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Wave Type */}
        <div className="flex gap-2">
          <Button variant={waveType === "sine" ? "default" : "outline"} onClick={() => setWaveType("sine")} size="sm" className={waveType === "sine" ? "bg-purple-500" : ""}>
            {t.sine}
          </Button>
          <Button variant={waveType === "square" ? "default" : "outline"} onClick={() => setWaveType("square")} size="sm" className={waveType === "square" ? "bg-purple-500" : ""}>
            {t.square}
          </Button>
          <Button variant={waveType === "triangle" ? "default" : "outline"} onClick={() => setWaveType("triangle")} size="sm" className={waveType === "triangle" ? "bg-purple-500" : ""}>
            {t.triangle}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.frequency}</label>
              <Badge>{frequency} Hz</Badge>
            </div>
            <Slider value={[frequency]} onValueChange={([v]) => setFrequency(v)} min={20} max={2000} step={10} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.amplitude}</label>
              <Badge>{amplitude}%</Badge>
            </div>
            <Slider value={[amplitude]} onValueChange={([v]) => setAmplitude(v)} min={10} max={100} step={5} />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={250} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.wavelength}</p>
            <p className="font-bold">{wavelength.toFixed(2)} m</p>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.period}</p>
            <p className="font-bold">{(period * 1000).toFixed(2)} ms</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.speed}</p>
            <p className="font-bold">343 m/s</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsPlaying(!isPlaying)} className={isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"}>
            <Activity className="w-4 h-4 mr-2" />
            {isPlaying ? t.stop : t.play}
          </Button>
          <Button variant="outline" onClick={() => { setIsPlaying(false); setTime(0); }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
