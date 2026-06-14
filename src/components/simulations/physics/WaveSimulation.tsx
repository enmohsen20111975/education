"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Radio, Play, Pause, RotateCcw } from "lucide-react";

interface WaveSimulationProps {
  language: "ar" | "en";
}

export function WaveSimulation({ language }: WaveSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Wave parameters
  const [amplitude, setAmplitude] = useState(50);
  const [wavelength, setWavelength] = useState(100);
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(true);
  const [phase, setPhase] = useState(0);
  const [waveType, setWaveType] = useState<"sine" | "square" | "triangle">("sine");
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكاة الموجات" : "Wave Simulation",
    amplitude: isRTL ? "السعة" : "Amplitude",
    wavelength: isRTL ? "الطول الموجي" : "Wavelength",
    speed: isRTL ? "السرعة" : "Speed",
    start: isRTL ? "تشغيل" : "Start",
    pause: isRTL ? "إيقاف" : "Pause",
    reset: isRTL ? "إعادة" : "Reset",
    sineWave: isRTL ? "موجة جيبية" : "Sine Wave",
    squareWave: isRTL ? "موجة مربعة" : "Square Wave",
    triangleWave: isRTL ? "موجة مثلثية" : "Triangle Wave",
    frequency: isRTL ? "التردد" : "Frequency",
    period: isRTL ? "الدور" : "Period"
  };

  const frequency = speed / wavelength;
  const period = wavelength / speed;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Clear
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x <= width; x += 20) {
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
    
    // Draw wave
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      const normalizedX = (x + phase) / wavelength;
      let y: number;
      
      switch (waveType) {
        case "sine":
          y = centerY - amplitude * Math.sin(normalizedX * 2 * Math.PI);
          break;
        case "square":
          y = centerY - amplitude * (Math.sin(normalizedX * 2 * Math.PI) >= 0 ? 1 : -1);
          break;
        case "triangle":
          const t = (normalizedX * 2) % 2;
          y = centerY - amplitude * (t < 1 ? 2 * t - 1 : 3 - 2 * t);
          break;
        default:
          y = centerY;
      }
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw wavelength markers
    ctx.fillStyle = "#ec4899";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    
    const firstMarker = 50;
    const secondMarker = firstMarker + wavelength;
    
    if (secondMarker < width) {
      ctx.beginPath();
      ctx.moveTo(firstMarker, centerY - amplitude - 20);
      ctx.lineTo(firstMarker, centerY - amplitude - 10);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(secondMarker, centerY - amplitude - 20);
      ctx.lineTo(secondMarker, centerY - amplitude - 10);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(firstMarker, centerY - amplitude - 15);
      ctx.lineTo(secondMarker, centerY - amplitude - 15);
      ctx.stroke();
      
      ctx.fillText(`λ = ${wavelength}`, (firstMarker + secondMarker) / 2, centerY - amplitude - 25);
    }
    
    // Draw amplitude marker
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(width - 30, centerY);
    ctx.lineTo(width - 30, centerY - amplitude);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width - 35, centerY);
    ctx.lineTo(width - 25, centerY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width - 35, centerY - amplitude);
    ctx.lineTo(width - 25, centerY - amplitude);
    ctx.stroke();
    
    ctx.fillText(`A = ${amplitude}`, width - 30, centerY - amplitude / 2);
    
  }, [amplitude, wavelength, phase, waveType]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    
    const animate = () => {
      setPhase(prev => prev + speed / 10);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, speed]);

  // Draw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  const handleReset = () => {
    setAmplitude(50);
    setWavelength(100);
    setSpeed(50);
    setPhase(0);
    setIsRunning(true);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-purple-500" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canvas */}
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <canvas 
            ref={canvasRef} 
            width={700} 
            height={300}
            className="w-full h-auto"
          />
        </div>
        
        {/* Wave Type Selection */}
        <div className="flex flex-wrap gap-2 justify-center">
          {(["sine", "square", "triangle"] as const).map((type) => (
            <Button
              key={type}
              variant={waveType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setWaveType(type)}
            >
              {type === "sine" ? labels.sineWave : type === "square" ? labels.squareWave : labels.triangleWave}
            </Button>
          ))}
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label>{labels.amplitude}: {amplitude}</Label>
            <Slider
              value={[amplitude]}
              onValueChange={(v) => setAmplitude(v[0])}
              min={10}
              max={100}
              step={1}
            />
          </div>
          
          <div className="space-y-3">
            <Label>{labels.wavelength}: {wavelength}</Label>
            <Slider
              value={[wavelength]}
              onValueChange={(v) => setWavelength(v[0])}
              min={30}
              max={200}
              step={1}
            />
          </div>
          
          <div className="space-y-3">
            <Label>{labels.speed}: {speed}</Label>
            <Slider
              value={[speed]}
              onValueChange={(v) => setSpeed(v[0])}
              min={10}
              max={100}
              step={1}
            />
          </div>
        </div>
        
        {/* Calculated Values */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
            <div className="text-sm text-slate-500">{labels.frequency}</div>
            <div className="text-2xl font-mono font-bold text-purple-600">
              {frequency.toFixed(3)} Hz
            </div>
          </div>
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-center">
            <div className="text-sm text-slate-500">{labels.period}</div>
            <div className="text-2xl font-mono font-bold text-pink-600">
              {period.toFixed(3)} s
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? labels.pause : labels.start}
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            {labels.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
