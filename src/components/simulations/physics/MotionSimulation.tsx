"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Car } from "lucide-react";

interface MotionSimulationProps {
  language: "ar" | "en";
}

export function MotionSimulation({ language }: MotionSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [velocity, setVelocity] = useState(50); // pixels per second
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [objectX, setObjectX] = useState(50);
  
  const isRTL = language === "ar";
  
  // Labels
  const labels = {
    title: isRTL ? "محاكاة الحركة المنتظمة" : "Uniform Motion Simulation",
    velocity: isRTL ? "السرعة (م/ث)" : "Velocity (m/s)",
    time: isRTL ? "الزمن (ث)" : "Time (s)",
    distance: isRTL ? "المسافة (م)" : "Distance (m)",
    start: isRTL ? "ابدأ" : "Start",
    pause: isRTL ? "إيقاف" : "Pause",
    reset: isRTL ? "إعادة" : "Reset",
    formula: isRTL ? "القانون: المسافة = السرعة × الزمن" : "Formula: Distance = Velocity × Time",
    description: isRTL 
      ? "اضبط السرعة ولاحظ كيف تتغير المسافة مع الزمن في الحركة المنتظمة"
      : "Adjust the velocity and observe how distance changes with time in uniform motion"
  };

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, width, height);
    
    // Draw road
    ctx.fillStyle = "#64748b";
    ctx.fillRect(0, height / 2 - 20, width, 40);
    
    // Draw road markings
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw distance markers
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    for (let i = 0; i <= 100; i += 20) {
      const x = 50 + (i / 100) * (width - 100);
      ctx.fillRect(x, height / 2 + 25, 2, 10);
      ctx.fillText(`${i}m`, x, height / 2 + 50);
    }
    
    // Draw car (simple representation)
    const carX = objectX;
    const carY = height / 2 - 15;
    
    // Car body
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.roundRect(carX - 25, carY - 10, 50, 20, 5);
    ctx.fill();
    
    // Car roof
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.roundRect(carX - 15, carY - 20, 30, 12, 3);
    ctx.fill();
    
    // Wheels
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(carX - 15, carY + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carX + 15, carY + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw velocity arrow
    if (velocity > 0) {
      const arrowLength = velocity;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(carX + 30, carY);
      ctx.lineTo(carX + 30 + arrowLength, carY);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(carX + 30 + arrowLength, carY);
      ctx.lineTo(carX + 25 + arrowLength, carY - 5);
      ctx.lineTo(carX + 25 + arrowLength, carY + 5);
      ctx.fill();
      
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`v = ${velocity} m/s`, carX + 30 + arrowLength / 2, carY - 15);
    }
    
  }, [objectX, velocity]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    
    const startTime = Date.now() - time * 1000;
    
    const animate = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      const newTime = currentTime;
      const newDistance = velocity * newTime;
      const newX = 50 + (newDistance % 100) * ((canvasRef.current!.width - 100) / 100);
      
      setTime(parseFloat(newTime.toFixed(2)));
      setDistance(parseFloat(newDistance.toFixed(2)));
      setObjectX(newX);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, velocity]);

  // Draw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setDistance(0);
    setObjectX(50);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-500" />
          {labels.title}
        </CardTitle>
        <p className="text-sm text-slate-500">{labels.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canvas */}
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={200}
            className="w-full h-auto"
          />
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Velocity Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{labels.velocity}</Label>
            <Slider
              value={[velocity]}
              onValueChange={(v) => setVelocity(v[0])}
              min={0}
              max={100}
              step={1}
              disabled={isRunning}
            />
            <div className="text-center font-mono text-lg font-bold text-blue-600">
              {velocity} m/s
            </div>
          </div>
          
          {/* Stats */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-500">{labels.time}</div>
              <div className="text-2xl font-mono font-bold">{time.toFixed(2)} s</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-500">{labels.distance}</div>
              <div className="text-2xl font-mono font-bold">{distance.toFixed(2)} m</div>
            </div>
          </div>
        </div>
        
        {/* Formula */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl text-center">
          <p className="font-mono text-lg font-bold text-blue-600">
            {labels.formula}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {distance.toFixed(2)} = {velocity} × {time.toFixed(2)}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <Button onClick={handleStart} className="gap-2">
              <Play className="w-4 h-4" />
              {labels.start}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="secondary" className="gap-2">
              <Pause className="w-4 h-4" />
              {labels.pause}
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {labels.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
