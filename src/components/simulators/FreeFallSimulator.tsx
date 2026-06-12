"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, ArrowDown, Building, Timer, Zap } from "lucide-react";

interface FreeFallSimulatorProps {
  language: "ar" | "en";
}

export function FreeFallSimulator({ language }: FreeFallSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [height, setHeight] = useState(50); // meters
  const [gravity, setGravity] = useState(9.8); // m/s²
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [ballY, setBallY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ time: number; velocity: number; height: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي السقوط الحر",
      description: "استكشف حركة الأجسام تحت تأثير الجاذبية",
      height: "الارتفاع الابتدائي",
      gravity: "تسارع الجاذبية",
      currentHeight: "الارتفاع الحالي",
      velocity: "السرعة الحالية",
      time: "الزمن",
      start: "إسقاط",
      pause: "إيقاف",
      reset: "إعادة",
      chart: "رسم بياني: الارتفاع vs الزمن",
      meters: "متر",
      mps: "م/ث",
      ms2: "م/ث²",
      seconds: "ثانية",
      formula: "h = ½gt² | v = gt",
      ground: "الأرض",
      impact: "الاصطدام!",
      impactSpeed: "سرعة الاصطدام",
      fallTime: "زمن السقوط",
    },
    en: {
      title: "Free Fall Simulator",
      description: "Explore objects motion under gravity",
      height: "Initial Height",
      gravity: "Gravity Acceleration",
      currentHeight: "Current Height",
      velocity: "Current Velocity",
      time: "Time",
      start: "Drop",
      pause: "Pause",
      reset: "Reset",
      chart: "Chart: Height vs Time",
      meters: "m",
      mps: "m/s",
      ms2: "m/s²",
      seconds: "s",
      formula: "h = ½gt² | v = gt",
      ground: "Ground",
      impact: "Impact!",
      impactSpeed: "Impact Speed",
      fallTime: "Fall Time",
    },
  };

  const t = texts[language];
  const g = gravity;

  // Physics calculations
  const calculateFallTime = useCallback((h: number, g: number) => {
    return Math.sqrt((2 * h) / g);
  }, []);

  const totalFallTime = calculateFallTime(height, g);

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const heightCanvas = canvas.height;
    const currentHeight = height - ballY;

    // Clear canvas
    ctx.clearRect(0, 0, width, heightCanvas);

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, heightCanvas);
    skyGradient.addColorStop(0, "#87CEEB");
    skyGradient.addColorStop(1, "#E0F7FA");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, heightCanvas);

    // Draw building/tower on the left
    ctx.fillStyle = "#64748b";
    ctx.fillRect(30, 20, 60, heightCanvas - 50);
    
    // Windows on building
    ctx.fillStyle = "#fef3c7";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 2; col++) {
        ctx.fillRect(40 + col * 25, 35 + row * 30, 15, 20);
      }
    }

    // Draw ground
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, heightCanvas - 30, width, 30);
    
    // Draw height scale on right
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width - 50, 30);
    ctx.lineTo(width - 50, heightCanvas - 30);
    ctx.stroke();

    // Height markers
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    const maxDisplayHeight = height;
    for (let i = 0; i <= 5; i++) {
      const y = 30 + ((heightCanvas - 60) * i) / 5;
      const h = maxDisplayHeight - (maxDisplayHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(width - 55, y);
      ctx.lineTo(width - 45, y);
      ctx.stroke();
      ctx.fillText(`${Math.round(h)}`, width - 40, y + 4);
    }

    // Calculate ball position
    const ballCanvasY = 30 + ((heightCanvas - 60) * ballY) / height;
    const ballRadius = 12;

    // Draw ball shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(120 + 3, ballCanvasY + 3, ballRadius, ballRadius * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw ball
    const ballGradient = ctx.createRadialGradient(
      120 - 3, ballCanvasY - 3, 0,
      120, ballCanvasY, ballRadius
    );
    ballGradient.addColorStop(0, "#ef4444");
    ballGradient.addColorStop(1, "#b91c1c");
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(120, ballCanvasY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw velocity arrow
    if (velocity > 0 && ballY < height) {
      const arrowLength = Math.min(velocity * 2, 50);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(120, ballCanvasY + ballRadius);
      ctx.lineTo(120, ballCanvasY + ballRadius + arrowLength);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(120, ballCanvasY + ballRadius + arrowLength);
      ctx.lineTo(115, ballCanvasY + ballRadius + arrowLength - 10);
      ctx.lineTo(125, ballCanvasY + ballRadius + arrowLength - 10);
      ctx.fill();
    }

    // Impact effect
    if (ballY >= height) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
      ctx.beginPath();
      ctx.arc(120, heightCanvas - 30, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(150, 10, 160, 90);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(150, 10, 160, 90);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`${t.time}: ${time.toFixed(2)} ${t.seconds}`, 160, 30);
    ctx.fillText(`${t.currentHeight}: ${(height - ballY).toFixed(1)} ${t.meters}`, 160, 50);
    ctx.fillText(`${t.velocity}: ${velocity.toFixed(1)} ${t.mps}`, 160, 70);
    ctx.fillText(`${t.fallTime}: ${totalFallTime.toFixed(2)} ${t.seconds}`, 160, 90);
  }, [height, ballY, velocity, time, totalFallTime, t]);

  // Draw the chart
  const drawChart = useCallback(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const heightCanvas = canvas.height;
    const padding = 50;

    // Clear
    ctx.clearRect(0, 0, width, heightCanvas);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, heightCanvas);

    // Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, heightCanvas - padding);
    ctx.lineTo(width - padding, heightCanvas - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText(language === "ar" ? "الارتفاع (م)" : "Height (m)", 10, 25);
    ctx.fillText(language === "ar" ? "الزمن (ث)" : "Time (s)", width - 80, heightCanvas - 15);

    const chartWidth = width - 2 * padding;
    const chartHeight = heightCanvas - 2 * padding;
    const maxTime = totalFallTime * 1.2;
    const maxHeight = height * 1.1;

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * chartWidth;
      const t = (i / 5) * maxTime;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, heightCanvas - padding);
      ctx.stroke();
      ctx.fillText(`${t.toFixed(1)}`, x - 10, heightCanvas - padding + 15);

      const y = padding + (i / 5) * chartHeight;
      const h = maxHeight - (i / 5) * maxHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.fillText(`${h.toFixed(0)}`, padding - 25, y + 4);
    }

    // Draw theoretical curve
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= totalFallTime; t += 0.05) {
      const h = height - 0.5 * g * t * t;
      const x = padding + (t / maxTime) * chartWidth;
      const y = padding + ((maxHeight - h) / maxHeight) * chartHeight;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual data
    if (dataPoints.length > 1) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const x = padding + (point.time / maxTime) * chartWidth;
        const y = padding + ((maxHeight - point.height) / maxHeight) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Points
      ctx.fillStyle = "#ef4444";
      dataPoints.forEach((point) => {
        const x = padding + (point.time / maxTime) * chartWidth;
        const y = padding + ((maxHeight - point.height) / maxHeight) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [dataPoints, height, totalFallTime, g, language]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const startTime = Date.now() - time * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (elapsed >= totalFallTime) {
        setTime(totalFallTime);
        setBallY(height);
        setVelocity(g * totalFallTime);
        setIsRunning(false);
        return;
      }

      const newY = 0.5 * g * elapsed * elapsed;
      const newV = g * elapsed;

      setTime(elapsed);
      setBallY(Math.min(newY, height));
      setVelocity(newV);

      // Add data point every 0.1 seconds
      if (dataPoints.length === 0 || elapsed - dataPoints[dataPoints.length - 1].time >= 0.1) {
        setDataPoints(prev => [...prev, { 
          time: elapsed, 
          velocity: newV, 
          height: height - newY 
        }]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, g, height, totalFallTime, time, dataPoints]);

  // Draw
  useEffect(() => {
    drawCanvas();
    drawChart();
  }, [drawCanvas, drawChart]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setBallY(0);
    setVelocity(0);
    setDataPoints([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-red-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                {t.height}
              </label>
              <Badge variant="secondary">{height} {t.meters}</Badge>
            </div>
            <Slider
              value={[height]}
              onValueChange={([value]) => { setHeight(value); handleReset(); }}
              min={10}
              max={100}
              step={5}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                {t.gravity}
              </label>
              <Badge variant="secondary">{gravity} {t.ms2}</Badge>
            </div>
            <Slider
              value={[gravity]}
              onValueChange={([value]) => setGravity(value)}
              min={1}
              max={20}
              step={0.1}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-red-500 hover:bg-red-600"}
            disabled={ballY >= height}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
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
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={250} className="w-full" />
        </div>

        {/* Chart */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Timer className="w-4 h-4 text-red-500" />
              {t.chart}
            </h3>
          </div>
          <canvas ref={chartCanvasRef} width={600} height={200} className="w-full" />
        </div>

        {/* Impact info */}
        {ballY >= height && (
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💥</span>
              <span className="font-bold text-red-700 dark:text-red-300">{t.impact}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">{t.impactSpeed}:</span>
                <span className="font-bold ml-2">{velocity.toFixed(2)} {t.mps}</span>
              </div>
              <div>
                <span className="text-slate-500">{t.fallTime}:</span>
                <span className="font-bold ml-2">{totalFallTime.toFixed(2)} {t.seconds}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
