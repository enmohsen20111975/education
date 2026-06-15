"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Gauge, Zap } from "lucide-react";

interface MomentumSimulatorProps {
  language: "ar" | "en";
}

export function MomentumSimulator({ language }: MomentumSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [mass1, setMass1] = useState(2);
  const [velocity1, setVelocity1] = useState(5);
  const [mass2, setMass2] = useState(3);
  const [velocity2, setVelocity2] = useState(-3);
  const [isRunning, setIsRunning] = useState(false);
  const [collisionOccurred, setCollisionOccurred] = useState(false);

  const texts = {
    ar: {
      title: "محاكي الزخم والتصادم",
      description: "استكشف قانون حفظ الزخم: m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'",
      mass1: "كتلة الجسم الأول (kg)",
      mass2: "كتلة الجسم الثاني (kg)",
      velocity1: "سرعة الجسم الأول (m/s)",
      velocity2: "سرعة الجسم الثاني (m/s)",
      momentum1: "زخم الجسم الأول",
      momentum2: "زخم الجسم الثاني",
      totalMomentum: "الزخم الكلي",
      beforeCollision: "قبل التصادم",
      afterCollision: "بعد التصادم",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      conservation: "قانون حفظ الزخم",
    },
    en: {
      title: "Momentum & Collision Simulator",
      description: "Explore conservation of momentum: m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'",
      mass1: "Mass 1 (kg)",
      mass2: "Mass 2 (kg)",
      velocity1: "Velocity 1 (m/s)",
      velocity2: "Velocity 2 (m/s)",
      momentum1: "Momentum 1",
      momentum2: "Momentum 2",
      totalMomentum: "Total Momentum",
      beforeCollision: "Before Collision",
      afterCollision: "After Collision",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      conservation: "Conservation of Momentum",
    },
  };

  const t = texts[language];

  // Calculate momenta
  const p1 = mass1 * velocity1;
  const p2 = mass2 * velocity2;
  const totalP = p1 + p2;

  // Calculate velocities after elastic collision
  const v1After = ((mass1 - mass2) * velocity1 + 2 * mass2 * velocity2) / (mass1 + mass2);
  const v2After = ((mass2 - mass1) * velocity2 + 2 * mass1 * velocity1) / (mass1 + mass2);

  const [pos1, setPos1] = useState(velocity1 > 0 ? 50 : 400);
  const [pos2, setPos2] = useState(velocity2 > 0 ? 50 : 400);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw ground
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, height - 40, width, 40);

    // Draw scale
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    for (let i = 0; i <= 10; i++) {
      const x = i * (width / 10);
      ctx.fillText(`${i * 50}`, x, height - 20);
      ctx.beginPath();
      ctx.moveTo(x, height - 40);
      ctx.lineTo(x, height - 35);
      ctx.stroke();
    }

    // Draw ball 1
    const ball1Radius = 20 + mass1 * 5;
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(pos1, height - 60 - ball1Radius / 2, ball1Radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${mass1}kg`, pos1, height - 55 - ball1Radius / 2);

    // Draw ball 2
    const ball2Radius = 20 + mass2 * 5;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(pos2, height - 60 - ball2Radius / 2, ball2Radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(`${mass2}kg`, pos2, height - 55 - ball2Radius / 2);

    // Draw velocity arrows
    const arrowScale = 15;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    
    // Arrow for ball 1
    const v1 = collisionOccurred ? v1After : velocity1;
    if (Math.abs(v1) > 0.1) {
      ctx.beginPath();
      ctx.moveTo(pos1, height - 100);
      ctx.lineTo(pos1 + v1 * arrowScale, height - 100);
      ctx.stroke();
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(pos1 + v1 * arrowScale, height - 100);
      ctx.lineTo(pos1 + v1 * arrowScale - (v1 > 0 ? 8 : -8), height - 105);
      ctx.lineTo(pos1 + v1 * arrowScale - (v1 > 0 ? 8 : -8), height - 95);
      ctx.fill();
    }

    // Arrow for ball 2
    const v2 = collisionOccurred ? v2After : velocity2;
    if (Math.abs(v2) > 0.1) {
      ctx.strokeStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(pos2, height - 100);
      ctx.lineTo(pos2 + v2 * arrowScale, height - 100);
      ctx.stroke();
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(pos2 + v2 * arrowScale, height - 100);
      ctx.lineTo(pos2 + v2 * arrowScale - (v2 > 0 ? 8 : -8), height - 105);
      ctx.lineTo(pos2 + v2 * arrowScale - (v2 > 0 ? 8 : -8), height - 95);
      ctx.fill();
    }

  }, [pos1, pos2, mass1, mass2, velocity1, velocity2, v1After, v2After, collisionOccurred]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const startSimulation = () => {
    setIsRunning(true);
    setCollisionOccurred(false);
    setPos1(velocity1 > 0 ? 50 : 400);
    setPos2(velocity2 > 0 ? 50 : 400);

    let p1 = velocity1 > 0 ? 50 : 400;
    let p2 = velocity2 > 0 ? 50 : 400;
    let collided = false;

    const animate = () => {
      if (!collided) {
        p1 += velocity1 * 2;
        p2 += velocity2 * 2;

        // Check collision
        const ball1Radius = 20 + mass1 * 5;
        const ball2Radius = 20 + mass2 * 5;
        if (Math.abs(p1 - p2) < (ball1Radius + ball2Radius) / 2) {
          collided = true;
          setCollisionOccurred(true);
        }
      } else {
        p1 += v1After * 2;
        p2 += v2After * 2;
      }

      setPos1(Math.max(30, Math.min(470, p1)));
      setPos2(Math.max(30, Math.min(470, p2)));

      if (p1 > 0 && p1 < 500 && p2 > 0 && p2 < 500) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    setIsRunning(false);
    setCollisionOccurred(false);
    setPos1(velocity1 > 0 ? 50 : 400);
    setPos2(velocity2 > 0 ? 50 : 400);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.mass1}</label>
              <Badge>{mass1} kg</Badge>
            </div>
            <Slider value={[mass1]} onValueChange={([v]) => setMass1(v)} min={1} max={10} step={0.5} disabled={isRunning} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.velocity1}</label>
              <Badge>{velocity1} m/s</Badge>
            </div>
            <Slider value={[velocity1]} onValueChange={([v]) => setVelocity1(v)} min={-10} max={10} step={0.5} disabled={isRunning} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.mass2}</label>
              <Badge>{mass2} kg</Badge>
            </div>
            <Slider value={[mass2]} onValueChange={([v]) => setMass2(v)} min={1} max={10} step={0.5} disabled={isRunning} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.velocity2}</label>
              <Badge>{velocity2} m/s</Badge>
            </div>
            <Slider value={[velocity2]} onValueChange={([v]) => setVelocity2(v)} min={-10} max={10} step={0.5} disabled={isRunning} />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={200} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.momentum1}</p>
            <p className="font-bold text-lg">{p1.toFixed(1)} kg·m/s</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.momentum2}</p>
            <p className="font-bold text-lg">{p2.toFixed(1)} kg·m/s</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.totalMomentum}</p>
            <p className="font-bold text-lg">{totalP.toFixed(1)} kg·m/s</p>
          </div>
        </div>

        {/* Collision Results */}
        {collisionOccurred && (
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-bold mb-2">{t.afterCollision}:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>v₁' = {v1After.toFixed(2)} m/s</div>
              <div>v₂' = {v2After.toFixed(2)} m/s</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={startSimulation} disabled={isRunning} className="bg-blue-500 hover:bg-blue-600">
            <Zap className="w-4 h-4 mr-2" />
            {t.start}
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
