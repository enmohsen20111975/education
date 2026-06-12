"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Target, TrendingUp, Wind } from "lucide-react";

interface ProjectileSimulatorProps {
  language: "ar" | "en";
}

export function ProjectileSimulator({ language }: ProjectileSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [initialVelocity, setInitialVelocity] = useState(20); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [height, setHeight] = useState(10); // meters
  const [isRunning, setIsRunning] = useState(false);
  const [trajectoryPoints, setTrajectoryPoints] = useState<{ x: number; y: number; t: number }[]>([]);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0, t: 0 });
  const [maxRange, setMaxRange] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);

  const g = 9.8;

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الرمي الأفقي",
      description: "استكشف مسار المقذوفات والمدى الأفقي",
      initialVelocity: "السرعة الابتدائية",
      angle: "زاوية الرمي",
      launchHeight: "ارتفاع الإطلاق",
      range: "المدى الأفقي",
      maxHeight: "أقصى ارتفاع",
      flightTime: "زمن الطيران",
      start: "إطلاق",
      pause: "إيقاف",
      reset: "إعادة",
      meters: "متر",
      mps: "م/ث",
      degrees: "درجة",
      seconds: "ثانية",
      formula: "R = v₀²sin(2θ)/g | H = v₀²sin²θ/2g",
      trajectory: "مسار المقذوف",
      currentPos: "الموضع الحالي",
      velocity: "السرعة الحالية",
    },
    en: {
      title: "Projectile Motion Simulator",
      description: "Explore projectile trajectory and range",
      initialVelocity: "Initial Velocity",
      angle: "Launch Angle",
      launchHeight: "Launch Height",
      range: "Horizontal Range",
      maxHeight: "Maximum Height",
      flightTime: "Flight Time",
      start: "Launch",
      pause: "Pause",
      reset: "Reset",
      meters: "m",
      mps: "m/s",
      degrees: "°",
      seconds: "s",
      formula: "R = v₀²sin(2θ)/g | H = v₀²sin²θ/2g",
      trajectory: "Projectile Path",
      currentPos: "Current Position",
      velocity: "Current Velocity",
    },
  };

  const t = texts[language];

  // Calculate trajectory properties (pure calculation, no setState)
  const getTrajectoryValues = useCallback((v0: number, ang: number, h: number) => {
    const angleRad = (ang * Math.PI) / 180;
    const v0x = v0 * Math.cos(angleRad);
    const v0y = v0 * Math.sin(angleRad);
    
    // Time to reach maximum height
    const tUp = v0y / g;
    // Maximum height from launch point
    const hMax = h + (v0y * v0y) / (2 * g);
    // Time to fall from max height to ground
    const tDown = Math.sqrt((2 * hMax) / g);
    // Total flight time
    const tTotal = tUp + tDown;
    // Horizontal range
    const range = v0x * tTotal;

    return { v0x, v0y, tTotal, range, hMax };
  }, []);

  // Calculate trajectory and update state
  const calculateTrajectory = useCallback(() => {
    const values = getTrajectoryValues(initialVelocity, angle, height);
    setMaxRange(values.range);
    setMaxHeight(values.hMax);
    return values;
  }, [initialVelocity, angle, height, getTrajectoryValues]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const heightCanvas = canvas.height;
    const padding = 60;

    // Clear
    ctx.clearRect(0, 0, width, heightCanvas);

    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, heightCanvas);
    skyGradient.addColorStop(0, "#0ea5e9");
    skyGradient.addColorStop(1, "#7dd3fc");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, heightCanvas);

    // Calculate scale
    const maxX = Math.max(maxRange * 1.2, 100);
    const maxY = Math.max(maxHeight * 1.3, 50);
    const scaleX = (width - 2 * padding) / maxX;
    const scaleY = (heightCanvas - 2 * padding) / maxY;

    // Convert coordinates
    const toCanvasX = (x: number) => padding + x * scaleX;
    const toCanvasY = (y: number) => heightCanvas - padding - y * scaleY;

    // Ground
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, toCanvasY(0), width, padding + 10);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= Math.ceil(maxX / 20); i++) {
      const x = toCanvasX(i * 20);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, toCanvasY(0));
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${i * 20}`, x, toCanvasY(0) + 15);
    }

    for (let i = 0; i <= Math.ceil(maxY / 10); i++) {
      const y = toCanvasY(i * 10);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.fillText(`${i * 10}`, padding - 15, y + 4);
    }

    // Launch platform
    ctx.fillStyle = "#64748b";
    ctx.fillRect(padding - 10, toCanvasY(height), 20, toCanvasY(0) - toCanvasY(height));

    // Draw trajectory path (theoretical)
    const angleRad = (angle * Math.PI) / 180;
    const v0x = initialVelocity * Math.cos(angleRad);
    const v0y = initialVelocity * Math.sin(angleRad);
    
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    for (let t = 0; t <= 10; t += 0.05) {
      const x = v0x * t;
      const y = height + v0y * t - 0.5 * g * t * t;
      if (y < 0) break;
      
      if (t === 0) ctx.moveTo(toCanvasX(x), toCanvasY(y));
      else ctx.lineTo(toCanvasX(x), toCanvasY(y));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual trajectory points
    if (trajectoryPoints.length > 1) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      trajectoryPoints.forEach((point, i) => {
        if (i === 0) ctx.moveTo(toCanvasX(point.x), toCanvasY(point.y));
        else ctx.lineTo(toCanvasX(point.x), toCanvasY(point.y));
      });
      ctx.stroke();

      // Trail dots
      ctx.fillStyle = "#fca5a5";
      trajectoryPoints.forEach((point, i) => {
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.arc(toCanvasX(point.x), toCanvasY(point.y), 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Draw projectile (current position)
    if (isRunning || trajectoryPoints.length > 0) {
      const ballX = toCanvasX(currentPos.x);
      const ballY = toCanvasY(currentPos.y);

      // Glow
      ctx.beginPath();
      const glow = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 25);
      glow.addColorStop(0, "rgba(239, 68, 68, 0.5)");
      glow.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.fillStyle = glow;
      ctx.arc(ballX, ballY, 25, 0, Math.PI * 2);
      ctx.fill();

      // Ball
      const ballGradient = ctx.createRadialGradient(ballX - 3, ballY - 3, 0, ballX, ballY, 10);
      ballGradient.addColorStop(0, "#fbbf24");
      ballGradient.addColorStop(1, "#f59e0b");
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Velocity vector
    if (isRunning && currentPos.y > 0) {
      const angleRad = (angle * Math.PI) / 180;
      const vx = initialVelocity * Math.cos(angleRad);
      const vy = initialVelocity * Math.sin(angleRad) - g * currentPos.t;
      const vMag = Math.sqrt(vx * vx + vy * vy);
      const vAngle = Math.atan2(-vy, vx);
      
      const arrowLength = vMag * 1.5;
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(currentPos.x), toCanvasY(currentPos.y));
      ctx.lineTo(
        toCanvasX(currentPos.x) + Math.cos(vAngle) * arrowLength,
        toCanvasY(currentPos.y) - Math.sin(vAngle) * arrowLength
      );
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(language === "ar" ? "المدى (م)" : "Range (m)", width - 100, toCanvasY(0) + 35);
    
    ctx.save();
    ctx.translate(15, heightCanvas / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(language === "ar" ? "الارتفاع (م)" : "Height (m)", 0, 0);
    ctx.restore();
  }, [maxRange, maxHeight, trajectoryPoints, currentPos, isRunning, initialVelocity, angle, height, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const { v0x, v0y, tTotal, range } = getTrajectoryValues(initialVelocity, angle, height);
    const startTime = Date.now() - currentPos.t * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (elapsed >= tTotal) {
        // Landed
        setCurrentPos({ x: range, y: 0, t: tTotal });
        setIsRunning(false);
        return;
      }

      const x = v0x * elapsed;
      const y = height + v0y * elapsed - 0.5 * g * elapsed * elapsed;

      setCurrentPos({ x, y: Math.max(0, y), t: elapsed });
      setTrajectoryPoints(prev => [...prev, { x, y: Math.max(0, y), t: elapsed }]);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, calculateTrajectory, maxRange, height]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setTrajectoryPoints([]);
    setCurrentPos({ x: 0, y: height, t: 0 });
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Get current velocity
  const getCurrentVelocity = () => {
    const angleRad = (angle * Math.PI) / 180;
    const vx = initialVelocity * Math.cos(angleRad);
    const vy = initialVelocity * Math.sin(angleRad) - g * currentPos.t;
    return Math.sqrt(vx * vx + vy * vy);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-sky-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.initialVelocity}</label>
              <Badge variant="secondary">{initialVelocity} {t.mps}</Badge>
            </div>
            <Slider
              value={[initialVelocity]}
              onValueChange={([value]) => { setInitialVelocity(value); handleReset(); }}
              min={5}
              max={50}
              step={1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.angle}</label>
              <Badge variant="secondary">{angle}{t.degrees}</Badge>
            </div>
            <Slider
              value={[angle]}
              onValueChange={([value]) => { setAngle(value); handleReset(); }}
              min={5}
              max={85}
              step={1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.launchHeight}</label>
              <Badge variant="secondary">{height} {t.meters}</Badge>
            </div>
            <Slider
              value={[height]}
              onValueChange={([value]) => { setHeight(value); handleReset(); }}
              min={0}
              max={30}
              step={1}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-sky-500 hover:bg-sky-600"}
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
          <canvas ref={canvasRef} width={700} height={300} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.range}</p>
            <p className="text-xl font-bold text-sky-600">{maxRange.toFixed(1)} {t.meters}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.maxHeight}</p>
            <p className="text-xl font-bold text-purple-600">{maxHeight.toFixed(1)} {t.meters}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.flightTime}</p>
            <p className="text-xl font-bold text-amber-600">
              {(Math.sqrt(2 * maxHeight / g) + (initialVelocity * Math.sin(angle * Math.PI / 180)) / g).toFixed(2)} {t.seconds}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.velocity}</p>
            <p className="text-xl font-bold text-emerald-600">{getCurrentVelocity().toFixed(1)} {t.mps}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
