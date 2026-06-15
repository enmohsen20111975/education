"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Magnet, Zap, Target, Move } from "lucide-react";

interface ElectricFieldSimulatorProps {
  language: "ar" | "en";
}

export function ElectricFieldSimulator({ language }: ElectricFieldSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [charge, setCharge] = useState(5); // μC
  const [testChargeX, setTestChargeX] = useState(150);
  const [testChargeY, setTestChargeY] = useState(150);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showEquipotential, setShowEquipotential] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Coulomb's constant
  const k = 8.99e9;

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المجال الكهربائي",
      description: "استكشف المجال الكهربائي حول الشحنات",
      charge: "قيمة الشحنة",
      microCoulomb: "ميكروكولوم",
      electricField: "المجال الكهربائي",
      fieldStrength: "شدة المجال",
      distance: "المسافة",
      newtonPerCoulomb: "N/C",
      meters: "م",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      showFieldLines: "عرض خطوط المجال",
      showEquipotential: "خطوط تساوي الجهد",
      fieldDirection: "اتجاه المجال: من الموجب للسالب",
      physicsExplanation: "التفسير الفيزيائي",
      fieldDefinition: "المجال الكهربائي هو المنطقة التي تظهر فيها قوة كهربائية على شحنة اختبار",
      positiveCharge: "شحنة موجبة",
      negativeCharge: "شحنة سالبة",
      testCharge: "شحنة الاختبار (+1)",
      fieldFormula: "E = kQ/r²",
      potentialFormula: "V = kQ/r",
    },
    en: {
      title: "Electric Field Simulator",
      description: "Explore the electric field around charges",
      charge: "Charge Value",
      microCoulomb: "μC",
      electricField: "Electric Field",
      fieldStrength: "Field Strength",
      distance: "Distance",
      newtonPerCoulomb: "N/C",
      meters: "m",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      showFieldLines: "Show Field Lines",
      showEquipotential: "Equipotential Lines",
      fieldDirection: "Field direction: from positive to negative",
      physicsExplanation: "Physics Explanation",
      fieldDefinition: "Electric field is the region where an electric force acts on a test charge",
      positiveCharge: "Positive Charge",
      negativeCharge: "Negative Charge",
      testCharge: "Test Charge (+1)",
      fieldFormula: "E = kQ/r²",
      potentialFormula: "V = kQ/r",
    },
  };

  const t = texts[language];

  // Calculate electric field at a point
  const calculateField = useCallback((x: number, y: number, centerX: number, centerY: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const rPixels = Math.sqrt(dx * dx + dy * dy);
    const rMeters = rPixels / 100; // Convert pixels to meters (100 pixels = 1 meter)
    
    if (rPixels < 5) return { magnitude: 0, angle: 0 };

    const q = charge * 1e-6; // Convert μC to C
    const E = k * Math.abs(q) / (rMeters * rMeters);
    const angle = Math.atan2(dy, dx);
    
    return { magnitude: E, angle, rMeters };
  }, [charge]);

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
    if (charge > 0) {
      bgGradient.addColorStop(0, "#fef2f2");
      bgGradient.addColorStop(1, "#ffffff");
    } else {
      bgGradient.addColorStop(0, "#eff6ff");
      bgGradient.addColorStop(1, "#ffffff");
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw equipotential lines (circles)
    if (showEquipotential) {
      const numLines = 8;
      for (let i = 1; i <= numLines; i++) {
        const radius = i * 35;
        const alpha = 0.3 - i * 0.03;
        ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        const V = (k * Math.abs(charge * 1e-6) / ((radius / 100) || 0.01)) / 1000;
        ctx.fillStyle = "rgba(34, 197, 94, 0.7)";
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${V.toFixed(0)}kV`, centerX + radius + 10, centerY);
      }
    }

    // Draw field lines
    if (showFieldLines) {
      const numLines = 16;
      const lineColor = charge > 0 ? "rgba(239, 68, 68, 0.4)" : "rgba(59, 130, 246, 0.4)";
      
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        const startRadius = 45;
        const endRadius = Math.min(width, height) / 2 - 20;

        ctx.beginPath();
        
        if (charge > 0) {
          // Field lines go outward for positive charge
          ctx.moveTo(centerX + Math.cos(angle) * startRadius, centerY + Math.sin(angle) * startRadius);
          ctx.lineTo(centerX + Math.cos(angle) * endRadius, centerY + Math.sin(angle) * endRadius);
        } else {
          // Field lines go inward for negative charge
          ctx.moveTo(centerX + Math.cos(angle) * endRadius, centerY + Math.sin(angle) * endRadius);
          ctx.lineTo(centerX + Math.cos(angle) * startRadius, centerY + Math.sin(angle) * startRadius);
        }
        ctx.stroke();

        // Draw arrow heads
        const arrowRadius = startRadius + (endRadius - startRadius) / 2;
        const arrowX = centerX + Math.cos(angle) * arrowRadius;
        const arrowY = centerY + Math.sin(angle) * arrowRadius;
        
        ctx.fillStyle = charge > 0 ? "rgba(239, 68, 68, 0.6)" : "rgba(59, 130, 246, 0.6)";
        ctx.beginPath();
        if (charge > 0) {
          ctx.moveTo(arrowX + Math.cos(angle) * 8, arrowY + Math.sin(angle) * 8);
          ctx.lineTo(arrowX + Math.cos(angle - 0.5) * -8, arrowY + Math.sin(angle - 0.5) * -8);
          ctx.lineTo(arrowX + Math.cos(angle + 0.5) * -8, arrowY + Math.sin(angle + 0.5) * -8);
        } else {
          ctx.moveTo(arrowX - Math.cos(angle) * 8, arrowY - Math.sin(angle) * 8);
          ctx.lineTo(arrowX - Math.cos(angle - 0.5) * -8, arrowY - Math.sin(angle - 0.5) * -8);
          ctx.lineTo(arrowX - Math.cos(angle + 0.5) * -8, arrowY - Math.sin(angle + 0.5) * -8);
        }
        ctx.fill();
      }
    }

    // Draw main charge
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
    if (charge > 0) {
      gradient.addColorStop(0, "#f87171");
      gradient.addColorStop(1, "#dc2626");
    } else {
      gradient.addColorStop(0, "#60a5fa");
      gradient.addColorStop(1, "#2563eb");
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw + or - sign
    ctx.fillStyle = "white";
    ctx.font = "bold 32px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(charge > 0 ? "+" : "−", centerX, centerY);

    // Draw test charge
    const testGradient = ctx.createRadialGradient(testChargeX, testChargeY, 0, testChargeX, testChargeY, 15);
    testGradient.addColorStop(0, "#fbbf24");
    testGradient.addColorStop(1, "#d97706");

    ctx.beginPath();
    ctx.arc(testChargeX, testChargeY, 15, 0, Math.PI * 2);
    ctx.fillStyle = testGradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "bold 14px system-ui";
    ctx.fillText("+", testChargeX, testChargeY);

    // Draw field vector at test charge
    const field = calculateField(testChargeX, testChargeY, centerX, centerY);
    if (field.magnitude > 0 && field.rMeters > 0.01) {
      const arrowLength = Math.min(Math.log10(field.magnitude + 1) * 15, 60);
      const direction = charge > 0 ? 1 : -1;
      
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(testChargeX, testChargeY);
      ctx.lineTo(
        testChargeX + Math.cos(field.angle) * arrowLength * direction,
        testChargeY + Math.sin(field.angle) * arrowLength * direction
      );
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#8b5cf6";
      const headX = testChargeX + Math.cos(field.angle) * arrowLength * direction;
      const headY = testChargeY + Math.sin(field.angle) * arrowLength * direction;
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(
        headX - Math.cos(field.angle - 0.4) * 12 * direction,
        headY - Math.sin(field.angle - 0.4) * 12 * direction
      );
      ctx.lineTo(
        headX - Math.cos(field.angle + 0.4) * 12 * direction,
        headY - Math.sin(field.angle + 0.4) * 12 * direction
      );
      ctx.fill();
    }

    // Draw info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 180, 80, 8);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = language === "ar" ? "right" : "left";
    const textX = language === "ar" ? 180 : 20;

    ctx.fillText(`${t.fieldStrength}:`, textX, 30);
    ctx.fillText(`${field.magnitude.toExponential(2)} ${t.newtonPerCoulomb}`, textX, 50);
    ctx.fillText(`${t.distance}: ${field.rMeters.toFixed(2)} ${t.meters}`, textX, 70);

  }, [charge, testChargeX, testChargeY, showFieldLines, showEquipotential, calculateField, t, language]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now() - animationTime * 1000;
    const centerX = 300;
    const centerY = 175;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setAnimationTime(elapsed);
      
      // Move test charge in a circle
      const radius = 100;
      const speed = 0.5;
      setTestChargeX(centerX + Math.cos(elapsed * speed) * radius);
      setTestChargeY(centerY + Math.sin(elapsed * speed) * radius);
      
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
  }, [drawCanvas]);

  // Handle mouse/touch interaction
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Check if click is not on the main charge
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    if (Math.sqrt(dx * dx + dy * dy) > 50) {
      setTestChargeX(x);
      setTestChargeY(y);
    }
  };

  // Reset function
  const handleReset = () => {
    setIsAnimating(false);
    setAnimationTime(0);
    setTestChargeX(150);
    setTestChargeY(150);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const field = calculateField(testChargeX, testChargeY, 300, 175);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Magnet className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
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

          {/* Animation toggle */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsAnimating(!isAnimating)}
              className={isAnimating ? "bg-violet-500 hover:bg-violet-600" : "bg-purple-500 hover:bg-purple-600"}
            >
              {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAnimating ? t.pause : t.start}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Toggle options */}
        <div className="flex flex-wrap gap-4">
          <Button
            variant={showFieldLines ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFieldLines(!showFieldLines)}
            className={showFieldLines ? "bg-violet-500 hover:bg-violet-600" : ""}
          >
            <Zap className="w-4 h-4 mr-2" />
            {t.showFieldLines}
          </Button>
          <Button
            variant={showEquipotential ? "default" : "outline"}
            size="sm"
            onClick={() => setShowEquipotential(!showEquipotential)}
            className={showEquipotential ? "bg-green-500 hover:bg-green-600" : ""}
          >
            <Target className="w-4 h-4 mr-2" />
            {t.showEquipotential}
          </Button>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded-lg text-center border border-violet-200 dark:border-violet-800">
            <code className="text-sm font-mono font-bold text-violet-700 dark:text-violet-300">{t.fieldFormula}</code>
          </div>
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg text-center border border-green-200 dark:border-green-800">
            <code className="text-sm font-mono font-bold text-green-700 dark:text-green-300">{t.potentialFormula}</code>
          </div>
        </div>

        {/* Animation Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={350}
            className="w-full cursor-pointer"
            onClick={handleCanvasInteraction}
            onTouchMove={handleCanvasInteraction}
          />
          <div className="p-2 bg-slate-50 dark:bg-slate-900 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <Move className="w-4 h-4" />
            {language === "ar" ? "انقر لتحريك شحنة الاختبار" : "Click to move the test charge"}
          </div>
        </div>

        {/* Physics Explanation */}
        <div className="p-4 bg-violet-50 dark:bg-violet-950 rounded-lg border border-violet-200 dark:border-violet-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-violet-500" />
            <span className="font-bold text-violet-700 dark:text-violet-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-violet-600 dark:text-violet-400">{t.fieldDefinition}</p>
          <p className="text-violet-500 dark:text-violet-500 text-sm mt-2">{t.fieldDirection}</p>
        </div>

        {/* Field values */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-violet-600">{field.magnitude.toExponential(2)}</div>
            <div className="text-sm text-slate-500">{t.fieldStrength} ({t.newtonPerCoulomb})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-green-600">{field.rMeters.toFixed(2)}</div>
            <div className="text-sm text-slate-500">{t.distance} ({t.meters})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center col-span-2 md:col-span-1">
            <div className="text-xl font-bold text-amber-600">
              {charge > 0 ? t.positiveCharge : t.negativeCharge}
            </div>
            <div className="text-sm text-slate-500">{t.charge}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
