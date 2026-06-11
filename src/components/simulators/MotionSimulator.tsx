"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Car, TrendingUp, Zap } from "lucide-react";

interface MotionSimulatorProps {
  language: "ar" | "en";
}

export function MotionSimulator({ language }: MotionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [initialVelocity, setInitialVelocity] = useState(5); // m/s
  const [acceleration, setAcceleration] = useState(2); // m/s²
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(5);
  const [dataPoints, setDataPoints] = useState<{ time: number; velocity: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الحركة",
      description: "استكشف العلاقة بين السرعة والتسارع والموضع",
      initialVelocity: "السرعة الابتدائية",
      acceleration: "التسارع",
      currentVelocity: "السرعة الحالية",
      position: "الموضع",
      time: "الزمن",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      chart: "رسم بياني: السرعة vs الزمن",
      mps: "م/ث",
      ms2: "م/ث²",
      meters: "متر",
      seconds: "ثانية",
      formula: "المعادلة: v = v₀ + at",
    },
    en: {
      title: "Motion Simulator",
      description: "Explore the relationship between velocity, acceleration, and position",
      initialVelocity: "Initial Velocity",
      acceleration: "Acceleration",
      currentVelocity: "Current Velocity",
      position: "Position",
      time: "Time",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      chart: "Chart: Velocity vs Time",
      mps: "m/s",
      ms2: "m/s²",
      meters: "m",
      seconds: "s",
      formula: "Formula: v = v₀ + at",
    },
  };

  const t = texts[language];

  // Physics calculations
  const calculateVelocity = useCallback((v0: number, a: number, t: number) => {
    return v0 + a * t;
  }, []);

  const calculatePosition = useCallback((v0: number, a: number, t: number) => {
    return v0 * t + 0.5 * a * t * t;
  }, []);

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw road
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, height - 80, width, 40);

    // Draw road markings
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, height - 60);
    ctx.lineTo(width, height - 60);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw distance markers
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.fillText(`${i * 10}`, x, height - 35);
      ctx.beginPath();
      ctx.moveTo(x, height - 80);
      ctx.lineTo(x, height - 70);
      ctx.stroke();
    }

    // Calculate car position (scaled to fit canvas)
    const maxDistance = 100; // meters
    const carX = Math.min((position / maxDistance) * width, width - 60);

    // Draw car (simple rectangle with wheels)
    const carY = height - 110;
    
    // Car body
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.roundRect(carX, carY, 50, 25, 5);
    ctx.fill();

    // Car roof
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.roundRect(carX + 10, carY - 15, 30, 18, 3);
    ctx.fill();

    // Wheels
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(carX + 12, carY + 25, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carX + 38, carY + 25, 8, 0, Math.PI * 2);
    ctx.fill();

    // Velocity arrow
    if (currentVelocity > 0) {
      const arrowLength = Math.min(currentVelocity * 5, 80);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(carX + 50, carY + 12);
      ctx.lineTo(carX + 50 + arrowLength, carY + 12);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(carX + 50 + arrowLength, carY + 12);
      ctx.lineTo(carX + 45 + arrowLength, carY + 7);
      ctx.lineTo(carX + 45 + arrowLength, carY + 17);
      ctx.fill();
    }

    // Draw info box
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(10, 10, 180, 80);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 180, 80);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`${t.time}: ${time.toFixed(1)} ${t.seconds}`, 20, 35);
    ctx.fillText(`${t.position}: ${position.toFixed(1)} ${t.meters}`, 20, 55);
    ctx.fillText(`${t.currentVelocity}: ${currentVelocity.toFixed(1)} ${t.mps}`, 20, 75);
  }, [position, time, currentVelocity, t]);

  // Draw the chart
  const drawChart = useCallback(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.fillText(language === "ar" ? "السرعة (م/ث)" : "Velocity (m/s)", 10, 25);
    ctx.fillText(language === "ar" ? "الزمن (ث)" : "Time (s)", width - 80, height - 15);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    const maxTime = 10;
    const maxVelocity = 30;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Vertical grid lines
    for (let i = 0; i <= maxTime; i++) {
      const x = padding + (i / maxTime) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.fillText(`${i}`, x - 3, height - padding + 15);
    }

    // Horizontal grid lines
    for (let i = 0; i <= maxVelocity; i += 5) {
      const y = height - padding - (i / maxVelocity) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.fillText(`${i}`, padding - 20, y + 4);
    }

    // Draw data points and line
    if (dataPoints.length > 1) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();

      dataPoints.forEach((point, i) => {
        const x = padding + (point.time / maxTime) * chartWidth;
        const y = height - padding - (point.velocity / maxVelocity) * chartHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      ctx.fillStyle = "#16a34a";
      dataPoints.forEach((point) => {
        const x = padding + (point.time / maxTime) * chartWidth;
        const y = height - padding - (point.velocity / maxVelocity) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [dataPoints, language]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now() - time * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (elapsed >= 10) {
        setIsRunning(false);
        return;
      }

      const newVelocity = calculateVelocity(initialVelocity, acceleration, elapsed);
      const newPosition = calculatePosition(initialVelocity, acceleration, elapsed);

      setTime(elapsed);
      setCurrentVelocity(newVelocity);
      setPosition(newPosition);

      // Add data point every 0.5 seconds
      if (dataPoints.length === 0 || elapsed - dataPoints[dataPoints.length - 1].time >= 0.5) {
        setDataPoints((prev) => [...prev, { time: elapsed, velocity: newVelocity }]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, initialVelocity, acceleration, calculateVelocity, calculatePosition, time, dataPoints]);

  // Draw on every update
  useEffect(() => {
    drawCanvas();
    drawChart();
  }, [drawCanvas, drawChart]);

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setPosition(0);
    setCurrentVelocity(initialVelocity);
    setDataPoints([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-emerald-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Initial Velocity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                {t.initialVelocity}
              </label>
              <Badge variant="secondary">
                {initialVelocity} {t.mps}
              </Badge>
            </div>
            <Slider
              value={[initialVelocity]}
              onValueChange={([value]) => {
                setInitialVelocity(value);
                setCurrentVelocity(value);
              }}
              min={0}
              max={20}
              step={1}
              disabled={isRunning}
            />
          </div>

          {/* Acceleration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                {t.acceleration}
              </label>
              <Badge variant="secondary">
                {acceleration} {t.ms2}
              </Badge>
            </div>
            <Slider
              value={[acceleration]}
              onValueChange={([value]) => setAcceleration(value)}
              min={-5}
              max={10}
              step={0.5}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"}
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

        {/* Animation Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full"
          />
        </div>

        {/* Chart Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              {t.chart}
            </h3>
          </div>
          <canvas
            ref={chartCanvasRef}
            width={600}
            height={250}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
