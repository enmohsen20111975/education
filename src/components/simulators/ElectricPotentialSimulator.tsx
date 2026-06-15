"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Battery, Zap, Target, TrendingUp } from "lucide-react";

interface ElectricPotentialSimulatorProps {
  language: "ar" | "en";
}

export function ElectricPotentialSimulator({ language }: ElectricPotentialSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [charge, setCharge] = useState(5); // μC
  const [testPosition, setTestPosition] = useState(0.5); // meters from charge
  const [showGraph, setShowGraph] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Constants
  const k = 8.99e9; // Coulomb's constant

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الجهد الكهربائي",
      description: "استكشف الجهد الكهربائي والطاقة الكامنة",
      charge: "قيمة الشحنة",
      microCoulomb: "ميكروكولوم",
      distance: "المسافة من الشحنة",
      potential: "الجهد الكهربائي",
      potentialEnergy: "الطاقة الكامنة",
      volts: "فولت",
      joules: "جول",
      meters: "متر",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      showGraph: "عرض الرسم البياني",
      physicsExplanation: "التفسير الفيزيائي",
      potentialDefinition: "الجهد الكهربائي هو الشغل اللازم لنقل شحنة اختبار موجبة من اللانهاية إلى النقطة",
      workDone: "الشغل المبذول = التغير في الطاقة الكامنة",
      potentialFormula: "V = kQ/r",
      energyFormula: "U = kQq/r",
      positivePotential: "جهد موجب (بالقرب من شحنة موجبة)",
      negativePotential: "جهد سالب (بالقرب من شحنة سالبة)",
      moveCloser: "كلما اقتربت، زاد الجهد",
      testCharge: "شحنة الاختبار",
    },
    en: {
      title: "Electric Potential Simulator",
      description: "Explore electric potential and potential energy",
      charge: "Charge Value",
      microCoulomb: "μC",
      distance: "Distance from Charge",
      potential: "Electric Potential",
      potentialEnergy: "Potential Energy",
      volts: "V",
      joules: "J",
      meters: "m",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      showGraph: "Show Graph",
      physicsExplanation: "Physics Explanation",
      potentialDefinition: "Electric potential is the work needed to move a positive test charge from infinity to the point",
      workDone: "Work done = Change in potential energy",
      potentialFormula: "V = kQ/r",
      energyFormula: "U = kQq/r",
      positivePotential: "Positive potential (near positive charge)",
      negativePotential: "Negative potential (near negative charge)",
      moveCloser: "The closer you get, the higher the potential",
      testCharge: "Test Charge",
    },
  };

  const t = texts[language];
  const testChargeValue = 1e-6; // 1 μC test charge

  // Calculate electric potential
  const calculatePotential = useCallback((r: number) => {
    if (r <= 0.01) return charge > 0 ? Infinity : -Infinity;
    const q = charge * 1e-6;
    return k * q / r;
  }, [charge]);

  // Calculate potential energy
  const calculatePotentialEnergy = useCallback((r: number) => {
    if (r <= 0.01) return charge > 0 ? Infinity : -Infinity;
    const q = charge * 1e-6;
    return k * q * testChargeValue / r;
  }, [charge]);

  // Draw main canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = 100;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    const bgGradient = ctx.createLinearGradient(0, 0, width, 0);
    bgGradient.addColorStop(0, "#fefce8");
    bgGradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw scale ruler
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = centerX + i * 50;
      ctx.beginPath();
      ctx.moveTo(x, height - 30);
      ctx.lineTo(x, height - 40);
      ctx.stroke();
      
      ctx.fillStyle = "#64748b";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${(i * 0.5).toFixed(1)}`, x, height - 15);
    }
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText(`${t.meters}`, width - 30, height - 15);

    // Draw equipotential surfaces (circles in 2D)
    const numCircles = 6;
    for (let i = 1; i <= numCircles; i++) {
      const r = i * 50;
      const V = calculatePotential(r / 100);
      const colorIntensity = Math.abs(V) / 1000000;
      
      // Create gradient for equipotential
      const alpha = Math.max(0.1, Math.min(0.4, colorIntensity));
      ctx.strokeStyle = charge > 0 ? `rgba(239, 68, 68, ${alpha})` : `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      if (i % 2 === 0) {
        ctx.fillStyle = charge > 0 ? "#dc2626" : "#2563eb";
        ctx.font = "bold 10px system-ui";
        ctx.textAlign = "left";
        const labelX = centerX + r * Math.cos(Math.PI / 4);
        const labelY = centerY - r * Math.sin(Math.PI / 4);
        const displayV = V >= 1000 ? `${(V / 1000).toFixed(0)}kV` : `${V.toFixed(0)}V`;
        ctx.fillText(displayV, labelX + 5, labelY);
      }
    }

    // Draw main charge
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    if (charge > 0) {
      gradient.addColorStop(0, "#f87171");
      gradient.addColorStop(1, "#dc2626");
    } else {
      gradient.addColorStop(0, "#60a5fa");
      gradient.addColorStop(1, "#2563eb");
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw + or - sign
    ctx.fillStyle = "white";
    ctx.font = "bold 28px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(charge > 0 ? "+" : "−", centerX, centerY);

    // Draw test charge position
    const testX = centerX + testPosition * 100;
    const testY = centerY;

    // Draw potential arrow
    const potential = calculatePotential(testPosition);
    const arrowLength = Math.min(Math.log10(Math.abs(potential) + 1) * 10, 50);
    const arrowDirection = potential > 0 ? -1 : 1;

    if (arrowLength > 5) {
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(testX, testY);
      ctx.lineTo(testX + arrowDirection * arrowLength, testY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.moveTo(testX + arrowDirection * arrowLength, testY);
      ctx.lineTo(testX + arrowDirection * (arrowLength - 10), testY - 6);
      ctx.lineTo(testX + arrowDirection * (arrowLength - 10), testY + 6);
      ctx.fill();
    }

    // Draw test charge
    const testGradient = ctx.createRadialGradient(testX, testY, 0, testX, testY, 15);
    testGradient.addColorStop(0, "#fbbf24");
    testGradient.addColorStop(1, "#d97706");

    ctx.beginPath();
    ctx.arc(testX, testY, 15, 0, Math.PI * 2);
    ctx.fillStyle = testGradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "bold 14px system-ui";
    ctx.fillText("+", testX, testY);

    // Draw distance line
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX + 35, centerY + 50);
    ctx.lineTo(testX, centerY + 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // Distance label
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`r = ${testPosition.toFixed(2)} ${t.meters}`, (centerX + 35 + testX) / 2, centerY + 65);

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.roundRect(width - 180, 10, 170, 90, 8);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "right";
    const textX = width - 20;

    const displayPotential = potential >= 1000 
      ? `${(potential / 1000).toFixed(1)} kV` 
      : `${potential.toFixed(0)} V`;
    const energy = calculatePotentialEnergy(testPosition);
    const displayEnergy = Math.abs(energy) >= 1000 
      ? `${(energy / 1000).toFixed(2)} mJ` 
      : `${(energy * 1000).toFixed(2)} μJ`;

    ctx.fillText(`${t.potential}:`, textX, 32);
    ctx.fillStyle = charge > 0 ? "#dc2626" : "#2563eb";
    ctx.fillText(displayPotential, textX, 50);
    ctx.fillStyle = "#1e293b";
    ctx.fillText(`${t.potentialEnergy}:`, textX, 70);
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(displayEnergy, textX, 88);

  }, [charge, testPosition, calculatePotential, calculatePotentialEnergy, t]);

  // Draw graph canvas
  const drawGraph = useCallback(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = padding; i < width - padding; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, padding);
      ctx.lineTo(i, height - padding);
      ctx.stroke();
    }
    for (let i = padding; i < height - padding; i += 30) {
      ctx.beginPath();
      ctx.moveTo(padding, i);
      ctx.lineTo(width - padding, i);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${t.distance} (${t.meters})`, width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${t.potential} (${t.volts})`, 0, 0);
    ctx.restore();

    // Draw potential curve
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const maxR = 5; // meters
    const maxV = Math.abs(calculatePotential(0.1));
    const minV = -maxV;

    ctx.strokeStyle = charge > 0 ? "#dc2626" : "#2563eb";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= graphWidth; i++) {
      const r = 0.1 + (i / graphWidth) * (maxR - 0.1);
      const V = calculatePotential(r);
      
      // Clamp V to visible range
      const clampedV = Math.max(minV, Math.min(maxV, V));
      const x = padding + i;
      const y = height - padding - ((clampedV - minV) / (maxV - minV)) * graphHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw current position marker
    const markerX = padding + ((testPosition - 0.1) / (maxR - 0.1)) * graphWidth;
    const currentV = calculatePotential(testPosition);
    const clampedCurrentV = Math.max(minV, Math.min(maxV, currentV));
    const markerY = height - padding - ((clampedCurrentV - minV) / (maxV - minV)) * graphHeight;

    ctx.fillStyle = "#8b5cf6";
    ctx.beginPath();
    ctx.arc(markerX, markerY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw vertical dashed line to axis
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(markerX, markerY);
    ctx.lineTo(markerX, height - padding);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw scale labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * graphWidth;
      ctx.fillText(`${(i).toFixed(0)}`, x, height - padding + 15);
    }

    // Y-axis labels
    ctx.textAlign = "right";
    const vLabels = charge > 0 ? [0, maxV / 2, maxV] : [minV, 0, maxV / 2];
    vLabels.forEach((v, i) => {
      const y = height - padding - (i / 2) * graphHeight;
      const displayV = Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0);
      ctx.fillText(displayV, padding - 5, y + 4);
    });

  }, [charge, testPosition, calculatePotential, t]);

  // Animation
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now() - animationTime * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setAnimationTime(elapsed);
      
      // Oscillate test position
      const newPosition = 0.5 + Math.sin(elapsed * 0.5) * 0.3;
      setTestPosition(Math.max(0.15, Math.min(newPosition, 0.95)));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animationTime]);

  // Draw on every update
  useEffect(() => {
    drawCanvas();
    drawGraph();
  }, [drawCanvas, drawGraph]);

  const handleReset = () => {
    setIsAnimating(false);
    setAnimationTime(0);
    setTestPosition(0.5);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const potential = calculatePotential(testPosition);
  const energy = calculatePotentialEnergy(testPosition);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Battery className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-emerald-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Charge */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.charge}</label>
              <Badge variant="secondary" className={charge > 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                {charge} {t.microCoulomb}
              </Badge>
            </div>
            <Slider
              value={[charge]}
              onValueChange={([value]) => setCharge(value)}
              min={-10}
              max={10}
              step={1}
            />
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.distance}</label>
              <Badge variant="secondary">
                {testPosition.toFixed(2)} {t.meters}
              </Badge>
            </div>
            <Slider
              value={[testPosition]}
              onValueChange={([value]) => setTestPosition(value)}
              min={0.15}
              max={2}
              step={0.05}
              disabled={isAnimating}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            className={isAnimating ? "bg-emerald-500 hover:bg-emerald-600" : "bg-teal-500 hover:bg-teal-600"}
          >
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
          <Button
            variant={showGraph ? "default" : "outline"}
            onClick={() => setShowGraph(!showGraph)}
            className={showGraph ? "bg-violet-500 hover:bg-violet-600" : ""}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {t.showGraph}
          </Button>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg text-center border border-emerald-200 dark:border-emerald-800">
            <code className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300">{t.potentialFormula}</code>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded-lg text-center border border-violet-200 dark:border-violet-800">
            <code className="text-sm font-mono font-bold text-violet-700 dark:text-violet-300">{t.energyFormula}</code>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={250}
            className="w-full"
          />
        </div>

        {/* Graph Canvas */}
        {showGraph && (
          <div className="border rounded-lg overflow-hidden">
            <canvas
              ref={graphCanvasRef}
              width={600}
              height={200}
              className="w-full"
            />
          </div>
        )}

        {/* Physics Explanation */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-emerald-700 dark:text-emerald-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-emerald-600 dark:text-emerald-400 mb-2">{t.potentialDefinition}</p>
          <p className="text-emerald-500 dark:text-emerald-500 text-sm">{t.workDone}</p>
        </div>

        {/* Values display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-emerald-600">
              {potential >= 1000 ? `${(potential / 1000).toFixed(1)}k` : potential.toFixed(0)}
            </div>
            <div className="text-sm text-slate-500">{t.potential} ({t.volts})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-violet-600">
              {(energy * 1e6).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">{t.potentialEnergy} (μJ)</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-blue-600">{testPosition.toFixed(2)}</div>
            <div className="text-sm text-slate-500">{t.distance} ({t.meters})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold" style={{ color: charge > 0 ? "#dc2626" : "#2563eb" }}>
              {charge > 0 ? "+" : ""}{charge}
            </div>
            <div className="text-sm text-slate-500">{t.charge} ({t.microCoulomb})</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
