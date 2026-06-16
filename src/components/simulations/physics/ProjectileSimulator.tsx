"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Target, ChevronUp } from "lucide-react";

interface ProjectileSimulatorProps {
  language: "ar" | "en";
}

interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
}

export function ProjectileSimulator({ language }: ProjectileSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Simulation parameters
  const [angle, setAngle] = useState(45); // degrees
  const [velocity, setVelocity] = useState(50); // m/s
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [projectilePos, setProjectilePos] = useState({ x: 0, y: 0 });
  
  const gravity = 9.8; // m/s²
  const isRTL = language === "ar";
  
  // Labels
  const labels = {
    title: isRTL ? "محاكاة الحركة المقذوفة" : "Projectile Motion Simulation",
    angle: isRTL ? "زاوية الإطلاق (درجة)" : "Launch Angle (°)",
    velocity: isRTL ? "السرعة الابتدائية (م/ث)" : "Initial Velocity (m/s)",
    start: isRTL ? "إطلاق" : "Launch",
    pause: isRTL ? "إيقاف" : "Pause",
    reset: isRTL ? "إعادة" : "Reset",
    maxHeight: isRTL ? "أقصى ارتفاع" : "Max Height",
    range: isRTL ? "المدى الأفقي" : "Range",
    flightTime: isRTL ? "زمن الطيران" : "Flight Time",
    currentHeight: isRTL ? "الارتفاع الحالي" : "Current Height",
    currentDistance: isRTL ? "المسافة الحالية" : "Current Distance",
    formulaTitle: isRTL ? "المعادلات" : "Equations",
    description: isRTL 
      ? "اضبط زاوية الإطلاق والسرعة الابتدائية ولاحظ مسار المقذوف"
      : "Adjust launch angle and initial velocity, then observe the projectile trajectory"
  };

  // Calculate trajectory
  const calculateTrajectory = useCallback(() => {
    const angleRad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);
    const totalTime = (2 * vy) / gravity;
    
    const points: TrajectoryPoint[] = [];
    const dt = totalTime / 100;
    
    for (let t = 0; t <= totalTime; t += dt) {
      const x = vx * t;
      const y = vy * t - 0.5 * gravity * t * t;
      if (y >= 0) {
        points.push({ x, y, t });
      }
    }
    
    return points;
  }, [angle, velocity, gravity]);

  // Calculate physics values
  const angleRad = (angle * Math.PI) / 180;
  const maxHeight = (velocity * velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * gravity);
  const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;
  const flightTime = (2 * velocity * Math.sin(angleRad)) / gravity;

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const groundY = height - 50;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGradient.addColorStop(0, "#bfdbfe");
    skyGradient.addColorStop(1, "#dbeafe");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, groundY);
    
    // Ground
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, groundY, width, 50);
    
    // Ground texture
    ctx.fillStyle = "#16a34a";
    for (let x = 0; x < width; x += 20) {
      ctx.fillRect(x, groundY, 2, 50);
    }
    
    // Draw trajectory path
    if (trajectory.length > 1) {
      const scaleX = (width - 100) / Math.max(range, 1);
      const scaleY = (groundY - 50) / Math.max(maxHeight, 1);
      
      ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      trajectory.forEach((point, i) => {
        const screenX = 50 + point.x * scaleX;
        const screenY = groundY - point.y * scaleY;
        if (i === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
      });
      
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw full predicted trajectory (dotted)
    const fullTrajectory = calculateTrajectory();
    if (fullTrajectory.length > 1 && !isRunning) {
      const scaleX = (width - 100) / Math.max(range, 1);
      const scaleY = (groundY - 50) / Math.max(maxHeight, 1);
      
      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      
      fullTrajectory.forEach((point, i) => {
        const screenX = 50 + point.x * scaleX;
        const screenY = groundY - point.y * scaleY;
        if (i === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
      });
      
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw launch platform
    ctx.fillStyle = "#64748b";
    ctx.fillRect(30, groundY - 20, 40, 20);
    
    // Draw cannon/launcher
    const cannonLength = 35;
    const cannonEndX = 50 + cannonLength * Math.cos(angleRad);
    const cannonEndY = groundY - 20 - cannonLength * Math.sin(angleRad);
    
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(50, groundY - 20);
    ctx.lineTo(cannonEndX, cannonEndY);
    ctx.stroke();
    
    // Cannon highlight
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(50, groundY - 20);
    ctx.lineTo(cannonEndX, cannonEndY);
    ctx.stroke();
    
    // Draw projectile
    const scaleX = (width - 100) / Math.max(range, 1);
    const scaleY = (groundY - 50) / Math.max(maxHeight, 1);
    
    const projX = 50 + projectilePos.x * scaleX;
    const projY = groundY - projectilePos.y * scaleY;
    
    // Projectile glow
    if (isRunning && projectilePos.y > 0) {
      const glow = ctx.createRadialGradient(projX, projY, 0, projX, projY, 20);
      glow.addColorStop(0, "rgba(251, 191, 36, 0.5)");
      glow.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(projX, projY, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Projectile
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(projX, projY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#fb923c";
    ctx.beginPath();
    ctx.arc(projX - 2, projY - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw distance markers
    ctx.fillStyle = "#1e293b";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    
    const markerInterval = Math.ceil(range / 5 / 10) * 10;
    for (let d = 0; d <= range; d += markerInterval) {
      const x = 50 + d * scaleX;
      ctx.fillRect(x - 1, groundY, 2, 10);
      ctx.fillText(`${d}m`, x, groundY + 25);
    }
    
    // Draw angle indicator
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(50, groundY - 20, 25, -Math.PI/2, -angleRad - Math.PI/2, true);
    ctx.stroke();
    
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(`${angle}°`, 75, groundY - 35);
    
  }, [trajectory, projectilePos, angle, angleRad, range, maxHeight, isRunning, calculateTrajectory]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    
    const fullTrajectory = calculateTrajectory();
    setTrajectory([]);
    
    let frameIndex = 0;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const t = elapsed * 0.5; // Slow down for visibility
      
      if (t >= flightTime) {
        // Animation complete
        setTrajectory(fullTrajectory);
        setProjectilePos({
          x: range,
          y: 0
        });
        setCurrentTime(flightTime);
        setIsRunning(false);
        return;
      }
      
      const angleRad = (angle * Math.PI) / 180;
      const vx = velocity * Math.cos(angleRad);
      const vy = velocity * Math.sin(angleRad);
      
      const x = vx * t;
      const y = vy * t - 0.5 * gravity * t * t;
      
      setTrajectory(fullTrajectory.slice(0, Math.floor((t / flightTime) * fullTrajectory.length)));
      setProjectilePos({ x: Math.max(0, x), y: Math.max(0, y) });
      setCurrentTime(t);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, angle, velocity, gravity, flightTime, range, calculateTrajectory]);

  // Draw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  const handleStart = () => {
    setTrajectory([]);
    setProjectilePos({ x: 0, y: 0 });
    setCurrentTime(0);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTrajectory([]);
    setProjectilePos({ x: 0, y: 0 });
    setCurrentTime(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          {labels.title}
        </CardTitle>
        <p className="text-sm text-slate-500">{labels.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canvas */}
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <canvas 
            ref={canvasRef} 
            width={700} 
            height={350}
            className="w-full h-auto"
          />
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Angle Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ChevronUp className="w-4 h-4" />
              {labels.angle}
            </Label>
            <Slider
              value={[angle]}
              onValueChange={(v) => setAngle(v[0])}
              min={5}
              max={85}
              step={1}
              disabled={isRunning}
            />
            <div className="text-center font-mono text-lg font-bold text-orange-600">
              {angle}°
            </div>
          </div>
          
          {/* Velocity Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{labels.velocity}</Label>
            <Slider
              value={[velocity]}
              onValueChange={(v) => setVelocity(v[0])}
              min={10}
              max={100}
              step={1}
              disabled={isRunning}
            />
            <div className="text-center font-mono text-lg font-bold text-blue-600">
              {velocity} m/s
            </div>
          </div>
        </div>
        
        {/* Predicted Values */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
            <div className="text-xs text-slate-500">{labels.maxHeight}</div>
            <div className="text-xl font-mono font-bold text-orange-600">
              {maxHeight.toFixed(2)} m
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <div className="text-xs text-slate-500">{labels.range}</div>
            <div className="text-xl font-mono font-bold text-blue-600">
              {range.toFixed(2)} m
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
            <div className="text-xs text-slate-500">{labels.flightTime}</div>
            <div className="text-xl font-mono font-bold text-green-600">
              {flightTime.toFixed(2)} s
            </div>
          </div>
        </div>
        
        {/* Current Values (during animation) */}
        {isRunning && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center animate-pulse">
              <div className="text-xs text-slate-500">{labels.currentHeight}</div>
              <div className="text-lg font-mono font-bold text-purple-600">
                {projectilePos.y.toFixed(2)} m
              </div>
            </div>
            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-center animate-pulse">
              <div className="text-xs text-slate-500">{labels.currentDistance}</div>
              <div className="text-lg font-mono font-bold text-cyan-600">
                {projectilePos.x.toFixed(2)} m
              </div>
            </div>
          </div>
        )}
        
        {/* Formulas */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl">
          <div className="text-sm font-semibold text-slate-700 mb-2">{labels.formulaTitle}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <span className="text-orange-600">H = v₀²sin²θ / 2g</span>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <span className="text-blue-600">R = v₀²sin2θ / g</span>
            </div>
            <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
              <span className="text-green-600">T = 2v₀sinθ / g</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <Button onClick={handleStart} className="gap-2 bg-orange-500 hover:bg-orange-600">
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
