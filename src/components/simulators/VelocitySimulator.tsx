"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Zap, TrendingUp, Gauge, Timer, Car } from "lucide-react";

interface VelocitySimulatorProps {
  language: "ar" | "en";
}

export function VelocitySimulator({ language }: VelocitySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [initialVelocity, setInitialVelocity] = useState(0); // m/s
  const [acceleration, setAcceleration] = useState(2); // m/s²
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left

  // Text translations
  const texts = {
    ar: {
      title: "محاكي السرعة والتسارع",
      description: "استكشف العلاقة بين السرعة والتسارع مع محاكاة تفاعلية",
      initialVelocity: "السرعة الابتدائية",
      acceleration: "التسارع",
      currentVelocity: "السرعة الحالية",
      position: "الموضع",
      time: "الزمن",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      mps: "م/ث",
      ms2: "م/ث²",
      meters: "متر",
      seconds: "ثانية",
      physicsExplanation: "التفسير الفيزيائي",
      whenAccelPositive: "عندما يكون التسارع موجباً، تزداد السرعة مع الزمن",
      whenAccelNegative: "عندما يكون التسارع سالباً، تقل السرعة مع الزمن (تباطؤ)",
      velocityFormula: "v = v₀ + at",
      positionFormula: "x = x₀ + v₀t + ½at²",
      kineticEnergy: "الطاقة الحركية",
      joules: "جول",
      mass: "الكتلة",
      kg: "كجم",
      direction: "الاتجاه",
      right: "يمين",
      left: "يسار",
      accelerating: "تسارع",
      decelerating: "تباطؤ",
      constantSpeed: "سرعة ثابتة",
    },
    en: {
      title: "Velocity & Acceleration Simulator",
      description: "Explore the relationship between velocity and acceleration",
      initialVelocity: "Initial Velocity",
      acceleration: "Acceleration",
      currentVelocity: "Current Velocity",
      position: "Position",
      time: "Time",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      mps: "m/s",
      ms2: "m/s²",
      meters: "m",
      seconds: "s",
      physicsExplanation: "Physics Explanation",
      whenAccelPositive: "When acceleration is positive, velocity increases over time",
      whenAccelNegative: "When acceleration is negative, velocity decreases over time (deceleration)",
      velocityFormula: "v = v₀ + at",
      positionFormula: "x = x₀ + v₀t + ½at²",
      kineticEnergy: "Kinetic Energy",
      joules: "J",
      mass: "Mass",
      kg: "kg",
      direction: "Direction",
      right: "Right",
      left: "Left",
      accelerating: "Accelerating",
      decelerating: "Decelerating",
      constantSpeed: "Constant Speed",
    },
  };

  const t = texts[language];
  const mass = 10; // kg (fixed for simplicity)

  // Physics calculations
  const calculateVelocity = useCallback((v0: number, a: number, t: number) => {
    return v0 + a * t;
  }, []);

  const calculatePosition = useCallback((v0: number, a: number, t: number) => {
    return v0 * t + 0.5 * a * t * t;
  }, []);

  const calculateKineticEnergy = useCallback((m: number, v: number) => {
    return 0.5 * m * v * v;
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

    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "#f0f9ff");
    bgGradient.addColorStop(1, "#e0f2fe");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw road
    ctx.fillStyle = "#64748b";
    ctx.fillRect(0, height - 80, width, 40);

    // Draw road markings
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(0, height - 60);
    ctx.lineTo(width, height - 60);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw distance markers
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px system-ui";
    const maxDistance = 200;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(x - 1, height - 80, 2, 10);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${i * 20}`, x, height - 35);
    }

    // Calculate car position (scaled to fit canvas)
    const carX = Math.max(30, Math.min((position / maxDistance) * width, width - 80));
    const carY = height - 115;

    // Draw car shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(carX + 30, height - 45, 35, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw car body
    const carGradient = ctx.createLinearGradient(carX, carY, carX, carY + 35);
    carGradient.addColorStop(0, "#3b82f6");
    carGradient.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = carGradient;
    ctx.beginPath();
    ctx.roundRect(carX, carY, 60, 30, 5);
    ctx.fill();

    // Car roof
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.roundRect(carX + 12, carY - 18, 36, 22, 4);
    ctx.fill();

    // Windows
    ctx.fillStyle = "#bfdbfe";
    ctx.fillRect(carX + 15, carY - 14, 14, 14);
    ctx.fillRect(carX + 31, carY - 14, 14, 14);

    // Wheels
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(carX + 15, carY + 30, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carX + 45, carY + 30, 10, 0, Math.PI * 2);
    ctx.fill();

    // Wheel centers
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(carX + 15, carY + 30, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carX + 45, carY + 30, 4, 0, Math.PI * 2);
    ctx.fill();

    // Velocity arrow
    const arrowLength = Math.min(Math.abs(currentVelocity) * 3, 100);
    if (arrowLength > 5) {
      ctx.strokeStyle = currentVelocity >= 0 ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      const arrowStart = carX + 60;
      const arrowEnd = currentVelocity >= 0 ? arrowStart + arrowLength : carX - arrowLength;
      ctx.moveTo(arrowStart, carY + 15);
      ctx.lineTo(arrowEnd, carY + 15);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = currentVelocity >= 0 ? "#22c55e" : "#ef4444";
      ctx.beginPath();
      if (currentVelocity >= 0) {
        ctx.moveTo(arrowEnd, carY + 15);
        ctx.lineTo(arrowEnd - 12, carY + 8);
        ctx.lineTo(arrowEnd - 12, carY + 22);
      } else {
        ctx.moveTo(arrowEnd, carY + 15);
        ctx.lineTo(arrowEnd + 12, carY + 8);
        ctx.lineTo(arrowEnd + 12, carY + 22);
      }
      ctx.fill();
    }

    // Acceleration indicator
    if (acceleration !== 0) {
      const accelColor = acceleration > 0 ? "#22c55e" : "#ef4444";
      ctx.fillStyle = accelColor;
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(acceleration > 0 ? "⚡+" : "⚡-", carX + 30, carY - 25);
    }

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 200, 100, 8);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 13px system-ui";
    ctx.textAlign = language === "ar" ? "right" : "left";
    const textX = language === "ar" ? 200 : 20;

    ctx.fillText(`${t.time}: ${time.toFixed(1)} ${t.seconds}`, textX, 32);
    ctx.fillText(`${t.position}: ${position.toFixed(1)} ${t.meters}`, textX, 52);
    ctx.fillText(`${t.currentVelocity}: ${currentVelocity.toFixed(1)} ${t.mps}`, textX, 72);
    ctx.fillText(`${t.kineticEnergy}: ${calculateKineticEnergy(mass, Math.abs(currentVelocity)).toFixed(0)} ${t.joules}`, textX, 92);

    // Direction indicator
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = language === "ar" ? "right" : "left";
    const statusText = acceleration > 0 ? t.accelerating : acceleration < 0 ? t.decelerating : t.constantSpeed;
    ctx.fillText(statusText, textX, 110);
  }, [position, time, currentVelocity, acceleration, mass, calculateKineticEnergy, t, language]);

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

      if (elapsed >= 15) {
        setIsRunning(false);
        return;
      }

      const newVelocity = calculateVelocity(initialVelocity, acceleration, elapsed);
      const newPosition = calculatePosition(initialVelocity, acceleration, elapsed);

      // Stop if velocity becomes negative (car reversed direction)
      if (initialVelocity >= 0 && newVelocity < 0 && acceleration < 0) {
        setIsRunning(false);
        return;
      }

      setTime(elapsed);
      setCurrentVelocity(newVelocity);
      setPosition(Math.max(0, newPosition));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, initialVelocity, acceleration, calculateVelocity, calculatePosition, time]);

  // Draw on every update
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setPosition(0);
    setCurrentVelocity(initialVelocity);
    setDirection(1);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Get physics explanation
  const getPhysicsExplanation = () => {
    if (acceleration > 0) {
      return t.whenAccelPositive;
    } else if (acceleration < 0) {
      return t.whenAccelNegative;
    }
    return "";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
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
              max={30}
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
              <Badge variant="secondary" className={acceleration < 0 ? "bg-red-100 text-red-700" : acceleration > 0 ? "bg-green-100 text-green-700" : ""}>
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
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-500 hover:bg-blue-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.velocityFormula}</code>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.positionFormula}</code>
          </div>
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

        {/* Physics Explanation */}
        {acceleration !== 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-blue-700 dark:text-blue-300">{t.physicsExplanation}</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400">{getPhysicsExplanation()}</p>
          </div>
        )}

        {/* Current values display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{time.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.seconds}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{currentVelocity.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.mps}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{position.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.meters}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-amber-600">{calculateKineticEnergy(mass, Math.abs(currentVelocity)).toFixed(0)}</div>
            <div className="text-sm text-slate-500">{t.joules}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
