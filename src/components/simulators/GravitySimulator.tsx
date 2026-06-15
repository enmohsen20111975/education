"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Orbit, Ruler, Timer, Gauge, Apple } from "lucide-react";

interface GravitySimulatorProps {
  language: "ar" | "en";
}

export function GravitySimulator({ language }: GravitySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [mass1, setMass1] = useState(1000); // kg (central body)
  const [mass2, setMass2] = useState(1); // kg (orbiting body)
  const [initialDistance, setInitialDistance] = useState(100); // meters
  const [initialVelocity, setInitialVelocity] = useState(5); // m/s (tangential)
  const [G, setG] = useState(6.674e-11); // Gravitational constant
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [x, setX] = useState(100);
  const [y, setY] = useState(0);
  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(5);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الجاذبية وقانون نيوتن",
      description: "استكشف قانون الجذب العام لحركة الأجسام",
      mass1: "كتلة الجسم المركزي",
      mass2: "كتلة الجسم المداري",
      initialDistance: "المسافة الابتدائية",
      initialVelocity: "السرعة الابتدائية",
      gravitationalForce: "قوة الجاذبية",
      currentDistance: "المسافة الحالية",
      currentVelocity: "السرعة الحالية",
      escapeVelocity: "سرعة الإفلات",
      orbitalVelocity: "السرعة المدارية",
      potentialEnergy: "طاقة الوضع",
      kineticEnergy: "الطاقة الحركية",
      totalEnergy: "الطاقة الكلية",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      formula: "F = G·m₁·m₂/r²",
      newtonsLaw: "قانون نيوتن للجذب العام",
      kg: "كجم",
      meters: "متر",
      ms: "م/ث",
      n: "نيوتن",
      seconds: "ثانية",
      joules: "جول",
      orbitType: "نوع المدار",
      circular: "دائري",
      elliptical: "بيضاوي",
      parabolic: "مكافئ",
      hyperbolic: "زائد",
      bound: "مقيد",
      unbound: "غير مقيد",
      orbit: "مدار",
      crash: "اصطدام!",
      orbiting: "يدور",
    },
    en: {
      title: "Gravity & Newton's Law Simulator",
      description: "Explore universal gravitation and orbital mechanics",
      mass1: "Central Body Mass",
      mass2: "Orbiting Body Mass",
      initialDistance: "Initial Distance",
      initialVelocity: "Initial Velocity",
      gravitationalForce: "Gravitational Force",
      currentDistance: "Current Distance",
      currentVelocity: "Current Velocity",
      escapeVelocity: "Escape Velocity",
      orbitalVelocity: "Orbital Velocity",
      potentialEnergy: "Potential Energy",
      kineticEnergy: "Kinetic Energy",
      totalEnergy: "Total Energy",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      formula: "F = G·m₁·m₂/r²",
      newtonsLaw: "Newton's Law of Universal Gravitation",
      kg: "kg",
      meters: "m",
      ms: "m/s",
      n: "N",
      seconds: "s",
      joules: "J",
      orbitType: "Orbit Type",
      circular: "Circular",
      elliptical: "Elliptical",
      parabolic: "Parabolic",
      hyperbolic: "Hyperbolic",
      bound: "Bound",
      unbound: "Unbound",
      orbit: "Orbit",
      crash: "Crash!",
      orbiting: "Orbiting",
    },
  };

  const t = texts[language];
  const M = mass1;
  const m = mass2;

  // Calculate current distance and velocity
  const distance = Math.sqrt(x * x + y * y);
  const speed = Math.sqrt(vx * vx + vy * vy);

  // Calculate gravitational force
  const gravitationalForce = G * M * m / (distance * distance);

  // Calculate orbital velocity (for circular orbit)
  const orbitalVelocity = Math.sqrt(G * M / initialDistance);

  // Calculate escape velocity
  const escapeVelocity = Math.sqrt(2 * G * M / initialDistance);

  // Calculate energies
  const potentialEnergy = -G * M * m / distance;
  const kineticEnergy = 0.5 * m * speed * speed;
  const totalEnergy = potentialEnergy + kineticEnergy;

  // Determine orbit type
  const getOrbitType = () => {
    if (distance < 5) return "crash";
    if (totalEnergy < 0) {
      // Bound orbit
      const eccentricity = Math.sqrt(1 + (2 * totalEnergy * Math.pow(distance * speed * Math.sin(Math.atan2(y, x)), 2)) / (G * M * m));
      if (eccentricity < 0.1) return "circular";
      return "elliptical";
    } else if (totalEnergy === 0) {
      return "parabolic";
    } else {
      return "hyperbolic";
    }
  };

  const orbitType = getOrbitType();

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (initialDistance * 4);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw space background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    bgGradient.addColorStop(0, "#1e1b4b");
    bgGradient.addColorStop(1, "#0f0d1a");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 100; i++) {
      const starX = (Math.sin(i * 567) * 0.5 + 0.5) * width;
      const starY = (Math.cos(i * 234) * 0.5 + 0.5) * height;
      const starSize = (Math.sin(i * 89) * 0.5 + 0.5) * 2;
      ctx.beginPath();
      ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw trail
    if (trail.length > 1) {
      ctx.strokeStyle = "rgba(147, 197, 253, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      trail.forEach((point, i) => {
        const screenX = centerX + point.x * scale;
        const screenY = centerY - point.y * scale;
        if (i === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
      });
      ctx.stroke();
    }

    // Draw central body (planet/star)
    const centralGradient = ctx.createRadialGradient(centerX - 10, centerY - 10, 0, centerX, centerY, 25);
    centralGradient.addColorStop(0, "#fbbf24");
    centralGradient.addColorStop(0.5, "#f59e0b");
    centralGradient.addColorStop(1, "#d97706");
    ctx.fillStyle = centralGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fill();

    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#fbbf24";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Central body label
    ctx.fillStyle = "#fff";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${(M / 1000).toFixed(0)}k ${t.kg}`, centerX, centerY + 40);

    // Calculate orbiting body position
    const bodyX = centerX + x * scale;
    const bodyY = centerY - y * scale;

    // Draw gravitational force vector
    if (distance > 10) {
      const forceScale = 50000;
      const fx = -x / distance * gravitationalForce * forceScale;
      const fy = -y / distance * gravitationalForce * forceScale;
      
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bodyX, bodyY);
      ctx.lineTo(bodyX + fx, bodyY - fy);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(-fy, fx);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(bodyX + fx, bodyY - fy);
      ctx.lineTo(bodyX + fx - 8 * Math.cos(angle - 0.4), bodyY - fy + 8 * Math.sin(angle - 0.4));
      ctx.lineTo(bodyX + fx - 8 * Math.cos(angle + 0.4), bodyY - fy + 8 * Math.sin(angle + 0.4));
      ctx.fill();
    }

    // Draw velocity vector
    const vScale = 5;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bodyX, bodyY);
    ctx.lineTo(bodyX + vx * vScale, bodyY - vy * vScale);
    ctx.stroke();

    // Velocity arrow head
    const vAngle = Math.atan2(-vy, vx);
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(bodyX + vx * vScale, bodyY - vy * vScale);
    ctx.lineTo(bodyX + vx * vScale - 8 * Math.cos(vAngle - 0.4), bodyY - vy * vScale + 8 * Math.sin(vAngle - 0.4));
    ctx.lineTo(bodyX + vx * vScale - 8 * Math.cos(vAngle + 0.4), bodyY - vy * vScale + 8 * Math.sin(vAngle + 0.4));
    ctx.fill();

    // Draw orbiting body
    const bodyGradient = ctx.createRadialGradient(bodyX - 3, bodyY - 3, 0, bodyX, bodyY, 10);
    bodyGradient.addColorStop(0, "#60a5fa");
    bodyGradient.addColorStop(1, "#2563eb");
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.arc(bodyX, bodyY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(10, 10, 200, 180);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 200, 180);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "left";
    
    ctx.fillText(`${t.currentDistance}: ${distance.toFixed(1)} ${t.meters}`, 20, 30);
    ctx.fillText(`${t.currentVelocity}: ${speed.toFixed(2)} ${t.ms}`, 20, 50);
    ctx.fillText(`${t.gravitationalForce}: ${gravitationalForce.toExponential(2)} ${t.n}`, 20, 70);
    ctx.fillText(`${t.orbitalVelocity}: ${orbitalVelocity.toFixed(2)} ${t.ms}`, 20, 90);
    ctx.fillText(`${t.escapeVelocity}: ${escapeVelocity.toFixed(2)} ${t.ms}`, 20, 110);
    
    // Energy
    ctx.fillText(`${t.potentialEnergy}: ${potentialEnergy.toExponential(2)} ${t.joules}`, 20, 135);
    ctx.fillText(`${t.kineticEnergy}: ${kineticEnergy.toExponential(2)} ${t.joules}`, 20, 155);
    ctx.fillText(`${t.totalEnergy}: ${totalEnergy.toExponential(2)} ${t.joules}`, 20, 175);

    // Orbit type indicator
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(width - 150, 10, 140, 50);
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(width - 150, 10, 140, 50);
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px system-ui";
    ctx.fillText(t.orbitType + ":", width - 140, 30);
    
    let orbitColor = "#22c55e";
    let orbitText = "";
    if (orbitType === "crash") {
      orbitColor = "#ef4444";
      orbitText = t.crash;
    } else if (orbitType === "circular") {
      orbitText = t.circular;
    } else if (orbitType === "elliptical") {
      orbitText = t.elliptical;
    } else if (orbitType === "parabolic") {
      orbitColor = "#f59e0b";
      orbitText = t.parabolic;
    } else {
      orbitColor = "#ef4444";
      orbitText = t.hyperbolic;
    }
    
    ctx.fillStyle = orbitColor;
    ctx.font = "bold 14px system-ui";
    ctx.fillText(orbitText, width - 140, 50);

    // Time display
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(width - 150, height - 40, 140, 30);
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.fillText(`${t.seconds}: ${time.toFixed(1)}`, width - 140, height - 20);

    // Legend
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(10, height - 70, 150, 60);
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(10, height - 70, 150, 60);
    
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, height - 55);
    ctx.lineTo(40, height - 55);
    ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.font = "10px system-ui";
    ctx.fillText(t.currentVelocity, 50, height - 52);
    
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(20, height - 35);
    ctx.lineTo(40, height - 35);
    ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.fillText(t.gravitationalForce, 50, height - 32);

  }, [x, y, vx, vy, distance, speed, gravitationalForce, orbitalVelocity, escapeVelocity, potentialEnergy, kineticEnergy, totalEnergy, orbitType, trail, time, M, initialDistance, t]);

  // Physics simulation
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let currentX = x;
    let currentY = y;
    let currentVx = vx;
    let currentVy = vy;
    let currentTime = time;
    const dt = 0.1;

    const animate = () => {
      // Calculate distance
      const r = Math.sqrt(currentX * currentX + currentY * currentY);
      
      // Check for crash
      if (r < 5) {
        setIsRunning(false);
        return;
      }

      // Calculate gravitational acceleration
      const a = G * M / (r * r);
      const ax = -a * currentX / r;
      const ay = -a * currentY / r;

      // Update velocity (Euler method)
      currentVx += ax * dt;
      currentVy += ay * dt;

      // Update position
      currentX += currentVx * dt;
      currentY += currentVy * dt;

      currentTime += dt;

      setX(currentX);
      setY(currentY);
      setVx(currentVx);
      setVy(currentVy);
      setTime(currentTime);

      // Add to trail
      setTrail(prev => {
        const newTrail = [...prev, { x: currentX, y: currentY }];
        return newTrail.slice(-500);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, G, M]);

  // Draw
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setX(initialDistance);
    setY(0);
    setVx(0);
    setVy(initialVelocity);
    setTrail([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Initialize
  useEffect(() => {
    handleReset();
  }, [initialDistance, initialVelocity]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Apple className="w-6 h-6" />
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-500" />
                {t.mass1}
              </label>
              <Badge variant="secondary">{mass1} {t.kg}</Badge>
            </div>
            <Slider
              value={[mass1]}
              onValueChange={([value]) => { setMass1(value); handleReset(); }}
              min={100}
              max={10000}
              step={100}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.mass2}</label>
              <Badge variant="secondary">{mass2} {t.kg}</Badge>
            </div>
            <Slider
              value={[mass2]}
              onValueChange={([value]) => setMass2(value)}
              min={0.1}
              max={10}
              step={0.1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.initialDistance}</label>
              <Badge variant="secondary">{initialDistance} {t.meters}</Badge>
            </div>
            <Slider
              value={[initialDistance]}
              onValueChange={([value]) => { setInitialDistance(value); handleReset(); }}
              min={50}
              max={200}
              step={5}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-500" />
                {t.initialVelocity}
              </label>
              <Badge variant="secondary">{initialVelocity.toFixed(1)} {t.ms}</Badge>
            </div>
            <Slider
              value={[initialVelocity]}
              onValueChange={([value]) => { setInitialVelocity(value); handleReset(); }}
              min={0}
              max={20}
              step={0.5}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Reference velocities */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-slate-500">{t.orbitalVelocity}</p>
            <p className="font-bold text-purple-600">{orbitalVelocity.toFixed(2)} {t.ms}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">{t.escapeVelocity}</p>
            <p className="font-bold text-red-600">{escapeVelocity.toFixed(2)} {t.ms}</p>
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

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
          <code className="text-sm font-mono">{t.formula}</code>
          <p className="text-xs text-slate-500 mt-1">{t.newtonsLaw}</p>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>

        {/* Orbit status */}
        <div className={`p-4 rounded-lg border ${
          orbitType === "crash" ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800" :
          orbitType === "hyperbolic" ? "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800" :
          "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold">
                {orbitType === "crash" ? t.crash : 
                 orbitType === "circular" ? t.circular + " " + t.orbit :
                 orbitType === "elliptical" ? t.elliptical + " " + t.orbit :
                 orbitType === "parabolic" ? t.parabolic + " " + t.orbit :
                 t.hyperbolic + " " + t.orbit}
              </span>
              <span className="text-sm text-slate-500 ml-2">
                ({totalEnergy < 0 ? t.bound : t.unbound})
              </span>
            </div>
            <div className="text-sm">
              {t.totalEnergy}: <span className="font-mono">{totalEnergy.toExponential(2)} {t.joules}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
