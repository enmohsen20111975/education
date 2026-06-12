"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Zap, Battery, TrendingUp, Sun } from "lucide-react";

interface EnergySimulatorProps {
  language: "ar" | "en";
}

export function EnergySimulator({ language }: EnergySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [height, setHeight] = useState(10); // meters
  const [mass, setMass] = useState(2); // kg
  const [isRunning, setIsRunning] = useState(false);
  const [ballPosition, setBallPosition] = useState(0); // 0 = top, 1 = bottom
  const [showEnergyBars, setShowEnergyBars] = useState(true);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي تحول الطاقة",
      description: "استكشف تحول الطاقة الكامنة إلى حركية",
      height: "الارتفاع",
      mass: "الكتلة",
      potentialEnergy: "الطاقة الكامنة",
      kineticEnergy: "الطاقة الحركية",
      totalEnergy: "الطاقة الكلية",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      meters: "متر",
      kg: "كجم",
      joules: "جول",
      formulaPE: "PE = mgh",
      formulaKE: "KE = ½mv²",
      conservation: "قانون حفظ الطاقة: PE + KE = ثابت",
    },
    en: {
      title: "Energy Transformation Simulator",
      description: "Explore potential to kinetic energy transformation",
      height: "Height",
      mass: "Mass",
      potentialEnergy: "Potential Energy",
      kineticEnergy: "Kinetic Energy",
      totalEnergy: "Total Energy",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      meters: "m",
      kg: "kg",
      joules: "J",
      formulaPE: "PE = mgh",
      formulaKE: "KE = ½mv²",
      conservation: "Energy Conservation: PE + KE = constant",
    },
  };

  const t = texts[language];
  const g = 9.8; // gravity

  // Calculate energies
  const totalEnergy = mass * g * height; // Maximum PE at top
  const currentHeight = height * (1 - ballPosition);
  const potentialEnergy = mass * g * currentHeight;
  const kineticEnergy = totalEnergy - potentialEnergy;
  const velocity = Math.sqrt(2 * g * height * ballPosition);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const heightCanvas = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, heightCanvas);

    // Draw background - sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, heightCanvas);
    gradient.addColorStop(0, "#e0f2fe");
    gradient.addColorStop(1, "#f0f9ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, heightCanvas);

    // Calculate positions
    const rampStartX = 50;
    const rampEndX = width - 50;
    const rampTopY = 50;
    const rampBottomY = heightCanvas - 50;
    const rampWidth = rampEndX - rampStartX;
    const rampHeight = rampBottomY - rampTopY;

    // Draw ramp (incline)
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(rampStartX, rampTopY);
    ctx.lineTo(rampEndX, rampBottomY);
    ctx.lineTo(rampEndX, rampBottomY + 20);
    ctx.lineTo(rampStartX - 20, rampBottomY + 20);
    ctx.lineTo(rampStartX - 20, rampTopY);
    ctx.closePath();
    ctx.fillStyle = "#cbd5e1";
    ctx.fill();
    ctx.stroke();

    // Draw ground
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, rampBottomY + 20, width, 30);

    // Calculate ball position on ramp
    const ballX = rampStartX + ballPosition * rampWidth;
    const ballY = rampTopY + ballPosition * rampHeight;
    const ballRadius = 15 + mass * 2;

    // Draw ball shadow
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.beginPath();
    ctx.ellipse(ballX + 3, ballY + 3, ballRadius, ballRadius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw ball
    const ballGradient = ctx.createRadialGradient(ballX - 5, ballY - 5, 0, ballX, ballY, ballRadius);
    ballGradient.addColorStop(0, "#f97316");
    ballGradient.addColorStop(1, "#ea580c");
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c2410c";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw height indicator
    if (!isRunning || ballPosition === 0) {
      ctx.strokeStyle = "#8b5cf6";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rampStartX - 30, rampTopY);
      ctx.lineTo(rampStartX - 30, rampBottomY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Height label
      ctx.fillStyle = "#8b5cf6";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(`${height} ${t.meters}`, rampStartX - 35, (rampTopY + rampBottomY) / 2);
    }

    // Draw velocity arrow if moving
    if (velocity > 0) {
      const arrowLength = Math.min(velocity * 5, 60);
      const angle = Math.atan2(rampHeight, rampWidth);
      
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + Math.cos(angle) * arrowLength, ballY + Math.sin(angle) * arrowLength);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(
        ballX + Math.cos(angle) * arrowLength,
        ballY + Math.sin(angle) * arrowLength
      );
      ctx.lineTo(
        ballX + Math.cos(angle) * (arrowLength - 10) - Math.sin(angle) * 5,
        ballY + Math.sin(angle) * (arrowLength - 10) + Math.cos(angle) * 5
      );
      ctx.lineTo(
        ballX + Math.cos(angle) * (arrowLength - 10) + Math.sin(angle) * 5,
        ballY + Math.sin(angle) * (arrowLength - 10) - Math.cos(angle) * 5
      );
      ctx.fill();
    }
  }, [ballPosition, mass, height, velocity, isRunning, t.meters]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now();
    const duration = 2000; // 2 seconds to roll down

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out for more realistic motion (acceleration)
      const easeOut = 1 - Math.pow(1 - progress, 2);
      
      setBallPosition(easeOut);

      if (progress >= 1) {
        setIsRunning(false);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setBallPosition(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Energy bar colors
  const getEnergyColor = (type: "pe" | "ke" | "total") => {
    switch (type) {
      case "pe":
        return "bg-purple-500";
      case "ke":
        return "bg-emerald-500";
      case "total":
        return "bg-amber-500";
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Height */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                {t.height}
              </label>
              <Badge variant="secondary">{height} {t.meters}</Badge>
            </div>
            <Slider
              value={[height]}
              onValueChange={([value]) => setHeight(value)}
              min={1}
              max={20}
              step={1}
              disabled={isRunning}
            />
          </div>

          {/* Mass */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Battery className="w-4 h-4 text-amber-500" />
                {t.mass}
              </label>
              <Badge variant="secondary">{mass} {t.kg}</Badge>
            </div>
            <Slider
              value={[mass]}
              onValueChange={([value]) => setMass(value)}
              min={1}
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
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-purple-500 hover:bg-purple-600"}
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
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.formulaPE}</code>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.formulaKE}</code>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={200} className="w-full" />
        </div>

        {/* Energy Bars */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{language === "ar" ? "توزيع الطاقة" : "Energy Distribution"}</h3>
            <Badge>{totalEnergy.toFixed(1)} {t.joules}</Badge>
          </div>

          {/* Potential Energy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                {t.potentialEnergy}
              </span>
              <span className="font-medium">{potentialEnergy.toFixed(1)} {t.joules}</span>
            </div>
            <Progress value={(potentialEnergy / totalEnergy) * 100} className="h-3 [&>div]:bg-purple-500" />
          </div>

          {/* Kinetic Energy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                {t.kineticEnergy}
              </span>
              <span className="font-medium">{kineticEnergy.toFixed(1)} {t.joules}</span>
            </div>
            <Progress value={(kineticEnergy / totalEnergy) * 100} className="h-3 [&>div]:bg-emerald-500" />
          </div>

          {/* Total Energy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                {t.totalEnergy}
              </span>
              <span className="font-medium">{totalEnergy.toFixed(1)} {t.joules}</span>
            </div>
            <Progress value={100} className="h-3 [&>div]:bg-amber-500" />
          </div>

          {/* Velocity */}
          {velocity > 0 && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {language === "ar" ? "السرعة الحالية" : "Current Velocity"}
                </span>
                <span className="font-bold">{velocity.toFixed(2)} m/s</span>
              </div>
            </div>
          )}
        </div>

        {/* Conservation Law */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
          <p className="text-center text-sm font-medium text-purple-700 dark:text-purple-300">
            {t.conservation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
