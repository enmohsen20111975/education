"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Box, Gauge, ArrowUpRight, ArrowDownRight, Zap, Lightbulb, Weight } from "lucide-react";

interface FrictionSimulatorProps {
  language: "ar" | "en";
}

type SurfaceType = "wood" | "ice" | "concrete" | "rubber" | "glass";

// Surface friction coefficients
const surfaces: Record<SurfaceType, { muStatic: number; muKinetic: number; nameAr: string; nameEn: string; color: string }> = {
  wood: { muStatic: 0.5, muKinetic: 0.3, nameAr: "خشب", nameEn: "Wood", color: "#a16207" },
  ice: { muStatic: 0.1, muKinetic: 0.05, nameAr: "جليد", nameEn: "Ice", color: "#67e8f9" },
  concrete: { muStatic: 0.7, muKinetic: 0.5, nameAr: "خرسانة", nameEn: "Concrete", color: "#78716c" },
  rubber: { muStatic: 1.0, muKinetic: 0.8, nameAr: "مطاط", nameEn: "Rubber", color: "#1f2937" },
  glass: { muStatic: 0.3, muKinetic: 0.2, nameAr: "زجاج", nameEn: "Glass", color: "#bfdbfe" },
};

export function FrictionSimulator({ language }: FrictionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [surface, setSurface] = useState<SurfaceType>("wood");
  const [mass, setMass] = useState(10); // kg
  const [appliedForce, setAppliedForce] = useState(0); // N
  const [angle, setAngle] = useState(0); // degrees
  const [isRunning, setIsRunning] = useState(false);
  const [velocity, setVelocity] = useState(0); // m/s
  const [position, setPosition] = useState(0); // m
  const [time, setTime] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الاحتكاك",
      description: "استكشف قوة الاحتكاك وعواملها المختلفة",
      mass: "الكتلة",
      appliedForce: "القوة المؤثرة",
      angle: "زاوية السطح",
      velocity: "السرعة",
      position: "الموضع",
      time: "الزمن",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      surface: "نوع السطح",
      staticFriction: "احتكاك سكون",
      kineticFriction: "احتكاك حركي",
      frictionForce: "قوة الاحتكاك",
      normalForce: "القوة العمودية",
      weight: "الوزن",
      netForce: "القوة المحصلة",
      acceleration: "التسارع",
      mps: "م/ث",
      ms2: "م/ث²",
      meters: "متر",
      seconds: "ثانية",
      newtons: "نيوتن",
      kg: "كجم",
      degrees: "درجة",
      physicsExplanation: "التفسير الفيزيائي",
      staticFrictionExplanation: "قوة الاحتكاك السكوني تساوي القوة المؤثرة حتى تصل إلى أقصى قيمة",
      kineticFrictionExplanation: "قوة الاحتكاك الحركي ثابتة وتعاكس اتجاه الحركة",
      angleEffect: "زيادة زاوية الميل تقلل القوة العمودية وتزيد مركبة الوزن الموازية للسطح",
      formulaStatic: "f_s ≤ μ_s × N",
      formulaKinetic: "f_k = μ_k × N",
      willMove: "سيتحرك",
      wontMove: "لن يتحرك",
      moving: "متحرك",
      stationary: "ساكن",
      coefficients: "معاملات الاحتكاك",
    },
    en: {
      title: "Friction Simulator",
      description: "Explore friction force and its factors",
      mass: "Mass",
      appliedForce: "Applied Force",
      angle: "Surface Angle",
      velocity: "Velocity",
      position: "Position",
      time: "Time",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      surface: "Surface Type",
      staticFriction: "Static Friction",
      kineticFriction: "Kinetic Friction",
      frictionForce: "Friction Force",
      normalForce: "Normal Force",
      weight: "Weight",
      netForce: "Net Force",
      acceleration: "Acceleration",
      mps: "m/s",
      ms2: "m/s²",
      meters: "m",
      seconds: "s",
      newtons: "N",
      kg: "kg",
      degrees: "°",
      physicsExplanation: "Physics Explanation",
      staticFrictionExplanation: "Static friction equals the applied force until it reaches maximum value",
      kineticFrictionExplanation: "Kinetic friction is constant and opposes the direction of motion",
      angleEffect: "Increasing the angle reduces normal force and increases weight component parallel to surface",
      formulaStatic: "f_s ≤ μ_s × N",
      formulaKinetic: "f_k = μ_k × N",
      willMove: "Will Move",
      wontMove: "Won't Move",
      moving: "Moving",
      stationary: "Stationary",
      coefficients: "Friction Coefficients",
    },
  };

  const t = texts[language];
  const g = 9.81;
  const surfaceData = surfaces[surface];

  // Physics calculations
  const calculatePhysics = useCallback(() => {
    const angleRad = (angle * Math.PI) / 180;
    const weight = mass * g;
    const normalForce = weight * Math.cos(angleRad);
    const weightComponent = weight * Math.sin(angleRad);
    
    const maxStaticFriction = surfaceData.muStatic * normalForce;
    const kineticFriction = surfaceData.muKinetic * normalForce;
    
    const totalAppliedForce = appliedForce + weightComponent;
    
    // Check if object will move
    const willMove = totalAppliedForce > maxStaticFriction;
    
    let frictionForce: number;
    let netForce: number;
    let acceleration: number;

    if (willMove) {
      frictionForce = kineticFriction;
      netForce = totalAppliedForce - frictionForce;
      acceleration = netForce / mass;
    } else {
      frictionForce = Math.min(totalAppliedForce, maxStaticFriction);
      netForce = 0;
      acceleration = 0;
    }

    return {
      weight,
      normalForce,
      weightComponent,
      maxStaticFriction,
      kineticFriction,
      frictionForce,
      netForce,
      acceleration,
      willMove,
    };
  }, [mass, angle, appliedForce, surfaceData, g]);

  const physics = calculatePhysics();

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const angleRad = (angle * Math.PI) / 180;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, "#e0f2fe");
    skyGradient.addColorStop(1, "#f0f9ff");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Calculate surface position
    const surfaceStartY = height - 80;
    const surfaceEndY = surfaceStartY - Math.tan(angleRad) * width;

    // Draw surface (inclined plane)
    ctx.fillStyle = surfaceData.color;
    ctx.beginPath();
    ctx.moveTo(0, surfaceStartY);
    ctx.lineTo(width, surfaceEndY);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Draw surface pattern (texture lines)
    ctx.strokeStyle = `${surfaceData.color}80`;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      const y1 = surfaceStartY - Math.tan(angleRad) * x;
      const y2 = y1 + 10;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x + 5, y2);
      ctx.stroke();
    }

    // Draw box
    const boxSize = 50;
    const boxX = 50 + (position % 300);
    const boxY = surfaceStartY - Math.tan(angleRad) * boxX - boxSize - 5;

    // Box shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(boxX + boxSize / 2 + 3, surfaceStartY - Math.tan(angleRad) * (boxX + boxSize / 2) + 5, boxSize / 2, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw box
    ctx.save();
    ctx.translate(boxX + boxSize / 2, boxY + boxSize / 2);
    ctx.rotate(-angleRad);
    
    // Box body
    const boxGradient = ctx.createLinearGradient(-boxSize / 2, -boxSize / 2, boxSize / 2, boxSize / 2);
    boxGradient.addColorStop(0, "#f97316");
    boxGradient.addColorStop(1, "#ea580c");
    ctx.fillStyle = boxGradient;
    ctx.fillRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);

    // Box label (mass)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${mass}`, 0, 5);
    
    ctx.restore();

    // Draw force arrows
    const centerX = boxX + boxSize / 2;
    const centerY = boxY + boxSize / 2;

    // Applied force arrow (if any)
    if (appliedForce > 0) {
      const arrowLength = Math.min(appliedForce * 1.5, 80);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX + boxSize / 2, centerY);
      ctx.lineTo(centerX + boxSize / 2 + arrowLength, centerY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(centerX + boxSize / 2 + arrowLength, centerY);
      ctx.lineTo(centerX + boxSize / 2 + arrowLength - 10, centerY - 8);
      ctx.lineTo(centerX + boxSize / 2 + arrowLength - 10, centerY + 8);
      ctx.fill();

      // Label
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(`${appliedForce}N`, centerX + boxSize / 2 + arrowLength / 2, centerY - 15);
    }

    // Friction arrow (opposite direction)
    if (physics.frictionForce > 0) {
      const frictionArrowLength = Math.min(physics.frictionForce * 2, 60);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - boxSize / 2, centerY);
      ctx.lineTo(centerX - boxSize / 2 - frictionArrowLength, centerY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(centerX - boxSize / 2 - frictionArrowLength, centerY);
      ctx.lineTo(centerX - boxSize / 2 - frictionArrowLength + 10, centerY - 8);
      ctx.lineTo(centerX - boxSize / 2 - frictionArrowLength + 10, centerY + 8);
      ctx.fill();

      // Label
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 11px system-ui";
      ctx.fillText(`f`, centerX - boxSize / 2 - frictionArrowLength / 2, centerY - 15);
    }

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 200, 120, 8);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";
    
    const statusText = isMoving ? t.moving : t.stationary;
    const statusColor = isMoving ? "#22c55e" : "#f59e0b";
    
    ctx.fillStyle = statusColor;
    ctx.fillText(statusText, 20, 30);
    
    ctx.fillStyle = "#1e293b";
    ctx.fillText(`${t.normalForce}: ${physics.normalForce.toFixed(1)} ${t.newtons}`, 20, 50);
    ctx.fillText(`${t.frictionForce}: ${physics.frictionForce.toFixed(1)} ${t.newtons}`, 20, 70);
    ctx.fillText(`${t.netForce}: ${physics.netForce.toFixed(1)} ${t.newtons}`, 20, 90);
    ctx.fillText(`${t.acceleration}: ${physics.acceleration.toFixed(2)} ${t.ms2}`, 20, 110);
  }, [angle, position, appliedForce, physics, isMoving, mass, surfaceData, t]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    if (!physics.willMove && velocity === 0) {
      setIsRunning(false);
      return;
    }

    const startTime = Date.now() - time * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      if (elapsed >= 10 || position >= 400) {
        setIsRunning(false);
        return;
      }

      const newVelocity = velocity + physics.acceleration * 0.016;
      const newPosition = position + newVelocity * 0.016;

      setTime(elapsed);
      setVelocity(Math.max(0, newVelocity));
      setPosition(newPosition);
      setIsMoving(newVelocity > 0.1);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, physics, velocity, position, time]);

  // Draw on update
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setVelocity(0);
    setPosition(0);
    setTime(0);
    setIsMoving(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Surface Selection */}
        <div className="space-y-3">
          <label className="font-medium flex items-center gap-2">
            <Box className="w-4 h-4 text-rose-500" />
            {t.surface}
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(surfaces) as SurfaceType[]).map((key) => (
              <Button
                key={key}
                variant={surface === key ? "default" : "outline"}
                size="sm"
                onClick={() => { setSurface(key); handleReset(); }}
                className={surface === key ? "bg-rose-500 hover:bg-rose-600" : ""}
                style={surface === key ? { backgroundColor: surfaces[key].color } : { borderColor: surfaces[key].color }}
              >
                {language === "ar" ? surfaces[key].nameAr : surfaces[key].nameEn}
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mass */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Weight className="w-4 h-4 text-slate-500" />
                {t.mass}
              </label>
              <Badge variant="secondary">{mass} {t.kg}</Badge>
            </div>
            <Slider
              value={[mass]}
              onValueChange={([value]) => { setMass(value); handleReset(); }}
              min={1}
              max={50}
              step={1}
              disabled={isRunning}
            />
          </div>

          {/* Applied Force */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                {t.appliedForce}
              </label>
              <Badge variant="secondary">{appliedForce} {t.newtons}</Badge>
            </div>
            <Slider
              value={[appliedForce]}
              onValueChange={([value]) => { setAppliedForce(value); handleReset(); }}
              min={0}
              max={200}
              step={5}
              disabled={isRunning}
            />
          </div>

          {/* Angle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-purple-500" />
                {t.angle}
              </label>
              <Badge variant="secondary">{angle}{t.degrees}</Badge>
            </div>
            <Slider
              value={[angle]}
              onValueChange={([value]) => { setAngle(value); handleReset(); }}
              min={0}
              max={45}
              step={1}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-rose-500 hover:bg-rose-600"}
            disabled={!physics.willMove && velocity === 0}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Movement Status */}
        <div className="flex items-center gap-4">
          <Badge className={physics.willMove ? "bg-green-500" : "bg-amber-500"}>
            {physics.willMove ? t.willMove : t.wontMove}
          </Badge>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.formulaStatic}</code>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.formulaKinetic}</code>
          </div>
        </div>

        {/* Animation Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={200} className="w-full" />
        </div>

        {/* Coefficients Table */}
        <div className="p-4 bg-rose-50 dark:bg-rose-950 rounded-lg border border-rose-200 dark:border-rose-800">
          <div className="font-bold text-rose-700 dark:text-rose-300 mb-3">{t.coefficients}</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-rose-600 dark:text-rose-400">{t.staticFriction} (μs):</span>
              <span className="font-bold">{surfaceData.muStatic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-600 dark:text-rose-400">{t.kineticFriction} (μk):</span>
              <span className="font-bold">{surfaceData.muKinetic}</span>
            </div>
          </div>
        </div>

        {/* Current Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{physics.normalForce.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.normalForce} ({t.newtons})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{physics.frictionForce.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.frictionForce} ({t.newtons})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{physics.netForce.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.netForce} ({t.newtons})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{physics.acceleration.toFixed(2)}</div>
            <div className="text-sm text-slate-500">{t.acceleration} ({t.ms2})</div>
          </div>
        </div>

        {/* Physics Explanation */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-700 dark:text-amber-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-amber-600 dark:text-amber-400 text-sm">
            {isMoving ? t.kineticFrictionExplanation : t.staticFrictionExplanation}
          </p>
          {angle > 0 && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">{t.angleEffect}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
