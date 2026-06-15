"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Atom, Ruler, Zap, Plus, Minus } from "lucide-react";

interface ElectricChargeSimulatorProps {
  language: "ar" | "en";
}

export function ElectricChargeSimulator({ language }: ElectricChargeSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [charge1, setCharge1] = useState(5); // μC (microcoulombs)
  const [charge2, setCharge2] = useState(-3); // μC
  const [distance, setDistance] = useState(0.5); // meters
  const [isRunning, setIsRunning] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Coulomb's constant
  const k = 8.99e9; // N·m²/C²

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الشحنة الكهربائية وقانون كولوم",
      description: "استكشف القوة بين الشحنات الكهربائية",
      charge1: "الشحنة الأولى (q₁)",
      charge2: "الشحنة الثانية (q₂)",
      distance: "المسافة بين الشحنتين",
      force: "القوة الكهربائية",
      microCoulomb: "ميكروكولوم",
      meters: "متر",
      newton: "نيوتن",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      attractive: "تجاذب",
      repulsive: "تنافر",
      coulombLaw: "قانون كولوم: F = k|q₁q₂|/r²",
      physicsExplanation: "التفسير الفيزيائي",
      sameSignRepel: "الشحنات المتشابهة تتنافر (+/+ أو -/-)",
      oppositeSignAttract: "الشحنات المختلفة تتجاذب (+/-)",
      forceDecreases: "القوة تتناسب عكسياً مع مربع المسافة",
      positive: "موجبة",
      negative: "سالبة",
      distanceUnit: "م",
      coulombConst: "ثابت كولوم: k = 8.99×10⁹ N·m²/C²",
    },
    en: {
      title: "Electric Charge & Coulomb's Law Simulator",
      description: "Explore the force between electric charges",
      charge1: "First Charge (q₁)",
      charge2: "Second Charge (q₂)",
      distance: "Distance Between Charges",
      force: "Electric Force",
      microCoulomb: "μC",
      meters: "m",
      newton: "N",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      attractive: "Attractive",
      repulsive: "Repulsive",
      coulombLaw: "Coulomb's Law: F = k|q₁q₂|/r²",
      physicsExplanation: "Physics Explanation",
      sameSignRepel: "Like charges repel each other (+/+ or -/-)",
      oppositeSignAttract: "Unlike charges attract each other (+/-)",
      forceDecreases: "Force is inversely proportional to the square of distance",
      positive: "Positive",
      negative: "Negative",
      distanceUnit: "m",
      coulombConst: "Coulomb's constant: k = 8.99×10⁹ N·m²/C²",
    },
  };

  const t = texts[language];

  // Calculate force using Coulomb's law
  const calculateForce = useCallback(() => {
    const q1Coulombs = charge1 * 1e-6; // Convert μC to C
    const q2Coulombs = charge2 * 1e-6;
    const force = k * Math.abs(q1Coulombs * q2Coulombs) / (distance * distance);
    return force;
  }, [charge1, charge2, distance]);

  // Determine if force is attractive or repulsive
  const isAttractive = charge1 * charge2 < 0;

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
    bgGradient.addColorStop(0, "#fefce8");
    bgGradient.addColorStop(1, "#fef9c3");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Calculate positions
    const centerX = width / 2;
    const centerY = height / 2;
    const visualDistance = Math.min(distance * 200, width * 0.6);
    const x1 = centerX - visualDistance / 2;
    const x2 = centerX + visualDistance / 2;

    // Draw force arrows
    const force = calculateForce();
    const arrowLength = Math.min(Math.log10(force + 1) * 20, 80);
    const arrowColor = isAttractive ? "#22c55e" : "#ef4444";

    if (arrowLength > 10) {
      // Left arrow
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const leftArrowDir = isAttractive ? 1 : -1;
      ctx.moveTo(x1 + leftArrowDir * 40, centerY);
      ctx.lineTo(x1 + leftArrowDir * 40 + leftArrowDir * arrowLength, centerY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = arrowColor;
      ctx.beginPath();
      ctx.moveTo(x1 + leftArrowDir * 40 + leftArrowDir * arrowLength, centerY);
      ctx.lineTo(x1 + leftArrowDir * 40 + leftArrowDir * arrowLength - leftArrowDir * 12, centerY - 8);
      ctx.lineTo(x1 + leftArrowDir * 40 + leftArrowDir * arrowLength - leftArrowDir * 12, centerY + 8);
      ctx.fill();

      // Right arrow
      ctx.strokeStyle = arrowColor;
      ctx.beginPath();
      const rightArrowDir = isAttractive ? -1 : 1;
      ctx.moveTo(x2 + rightArrowDir * 40, centerY);
      ctx.lineTo(x2 + rightArrowDir * 40 + rightArrowDir * arrowLength, centerY);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x2 + rightArrowDir * 40 + rightArrowDir * arrowLength, centerY);
      ctx.lineTo(x2 + rightArrowDir * 40 + rightArrowDir * arrowLength - rightArrowDir * 12, centerY - 8);
      ctx.lineTo(x2 + rightArrowDir * 40 + rightArrowDir * arrowLength - rightArrowDir * 12, centerY + 8);
      ctx.fill();
    }

    // Draw electric field lines
    if (isRunning || animationTime > 0) {
      const numLines = 8;
      const time = animationTime;
      ctx.strokeStyle = "rgba(147, 51, 234, 0.3)";
      ctx.lineWidth = 2;

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        const startRadius = 45;
        const maxRadius = 100 + Math.sin(time * 2 + i) * 20;

        // From charge 1
        ctx.beginPath();
        if (charge1 > 0) {
          ctx.moveTo(x1 + Math.cos(angle) * startRadius, centerY + Math.sin(angle) * startRadius);
          ctx.lineTo(x1 + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
        } else {
          ctx.moveTo(x1 + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
          ctx.lineTo(x1 + Math.cos(angle) * startRadius, centerY + Math.sin(angle) * startRadius);
        }
        ctx.stroke();

        // From charge 2
        ctx.beginPath();
        if (charge2 > 0) {
          ctx.moveTo(x2 + Math.cos(angle) * startRadius, centerY + Math.sin(angle) * startRadius);
          ctx.lineTo(x2 + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
        } else {
          ctx.moveTo(x2 + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
          ctx.lineTo(x2 + Math.cos(angle) * startRadius, centerY + Math.sin(angle) * startRadius);
        }
        ctx.stroke();
      }
    }

    // Draw charge 1
    const gradient1 = charge1 > 0 
      ? ctx.createRadialGradient(x1, centerY, 0, x1, centerY, 40)
      : ctx.createRadialGradient(x1, centerY, 0, x1, centerY, 40);
    
    if (charge1 > 0) {
      gradient1.addColorStop(0, "#ef4444");
      gradient1.addColorStop(1, "#dc2626");
    } else {
      gradient1.addColorStop(0, "#3b82f6");
      gradient1.addColorStop(1, "#2563eb");
    }

    ctx.beginPath();
    ctx.arc(x1, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = gradient1;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw + or - sign on charge 1
    ctx.fillStyle = "white";
    ctx.font = "bold 32px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(charge1 > 0 ? "+" : "−", x1, centerY);

    // Label for charge 1
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`q₁ = ${charge1} ${t.microCoulomb}`, x1, centerY + 60);

    // Draw charge 2
    const gradient2 = charge2 > 0 
      ? ctx.createRadialGradient(x2, centerY, 0, x2, centerY, 40)
      : ctx.createRadialGradient(x2, centerY, 0, x2, centerY, 40);
    
    if (charge2 > 0) {
      gradient2.addColorStop(0, "#ef4444");
      gradient2.addColorStop(1, "#dc2626");
    } else {
      gradient2.addColorStop(0, "#3b82f6");
      gradient2.addColorStop(1, "#2563eb");
    }

    ctx.beginPath();
    ctx.arc(x2, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = gradient2;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw + or - sign on charge 2
    ctx.fillStyle = "white";
    ctx.font = "bold 32px system-ui";
    ctx.fillText(charge2 > 0 ? "+" : "−", x2, centerY);

    // Label for charge 2
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`q₂ = ${charge2} ${t.microCoulomb}`, x2, centerY + 60);

    // Draw distance line
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x1, centerY + 90);
    ctx.lineTo(x2, centerY + 90);
    ctx.stroke();
    ctx.setLineDash([]);

    // Distance label
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`r = ${distance.toFixed(2)} ${t.distanceUnit}`, centerX, centerY + 105);

    // Force type indicator
    ctx.fillStyle = isAttractive ? "#22c55e" : "#ef4444";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(isAttractive ? `← ${t.attractive} →` : `→ ${t.repulsive} ←`, centerX, 30);

  }, [charge1, charge2, distance, isAttractive, isRunning, animationTime, t, calculateForce]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now() - animationTime * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setAnimationTime(elapsed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animationTime]);

  // Draw on every update
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setAnimationTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Get physics explanation
  const getPhysicsExplanation = () => {
    if (charge1 * charge2 > 0) {
      return t.sameSignRepel;
    } else if (charge1 * charge2 < 0) {
      return t.oppositeSignAttract;
    }
    return "";
  };

  const force = calculateForce();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Charge 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                {charge1 > 0 ? <Plus className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-blue-500" />}
                {t.charge1}
              </label>
              <Badge variant="secondary" className={charge1 > 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                {charge1} {t.microCoulomb}
              </Badge>
            </div>
            <Slider
              value={[charge1]}
              onValueChange={([value]) => setCharge1(value)}
              min={-10}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>-10 {t.microCoulomb}</span>
              <span>+10 {t.microCoulomb}</span>
            </div>
          </div>

          {/* Charge 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                {charge2 > 0 ? <Plus className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-blue-500" />}
                {t.charge2}
              </label>
              <Badge variant="secondary" className={charge2 > 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                {charge2} {t.microCoulomb}
              </Badge>
            </div>
            <Slider
              value={[charge2]}
              onValueChange={([value]) => setCharge2(value)}
              min={-10}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>-10 {t.microCoulomb}</span>
              <span>+10 {t.microCoulomb}</span>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-purple-500" />
                {t.distance}
              </label>
              <Badge variant="secondary">
                {distance.toFixed(2)} {t.meters}
              </Badge>
            </div>
            <Slider
              value={[distance]}
              onValueChange={([value]) => setDistance(value)}
              min={0.1}
              max={2}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0.1 {t.meters}</span>
              <span>2 {t.meters}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600"}
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
        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800 text-center">
          <code className="text-lg font-mono font-bold text-amber-700 dark:text-amber-300">{t.coulombLaw}</code>
          <div className="text-sm text-amber-600 dark:text-amber-400 mt-2">{t.coulombConst}</div>
        </div>

        {/* Animation Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={280}
            className="w-full"
          />
        </div>

        {/* Physics Explanation */}
        <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-700 dark:text-orange-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-orange-600 dark:text-orange-400 mb-2">{getPhysicsExplanation()}</p>
          <p className="text-orange-500 dark:text-orange-500 text-sm">{t.forceDecreases}</p>
        </div>

        {/* Force display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-amber-600">{force.toExponential(2)}</div>
            <div className="text-sm text-slate-500">{t.force} ({t.newton})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold" style={{ color: isAttractive ? "#22c55e" : "#ef4444" }}>
              {isAttractive ? t.attractive : t.repulsive}
            </div>
            <div className="text-sm text-slate-500">{t.force}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
