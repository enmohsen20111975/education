"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Circle, AngleIcon } from "lucide-react";

interface AnglesSimulatorProps {
  language: "ar" | "en";
}

export function AnglesSimulator({ language }: AnglesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [angle, setAngle] = useState(45);
  const [showProtractor, setShowProtractor] = useState(true);
  const [animationAngle, setAnimationAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الزوايا",
      description: "قياس وتصنيف الزوايا بشكل تفاعلي",
      angle: "الزاوية",
      degrees: "درجة",
      acute: "حادة",
      right: "قائمة",
      obtuse: "منفرجة",
      straight: "مستقيمة",
      reflex: "مائلة",
      full: "كاملة",
      classification: "تصنيف الزاوية",
      showProtractor: "إظهار المنقلة",
      hideProtractor: "إخفاء المنقلة",
      animate: "تحريك",
      reset: "إعادة",
      range: "نطاق الزاوية",
      acuteRange: "0° - 90°",
      rightAngle: "90°",
      obtuseRange: "90° - 180°",
      straightAngle: "180°",
      reflexRange: "180° - 360°",
      fullAngle: "360°",
      properties: "الخصائص",
      complement: "المتممة",
      supplement: "المكملة",
      arcLength: "طول القوس",
      sectorArea: "مساحة القطاع",
      radius: "نصف القطر",
      formulaArc: "طول القوس = θ × r",
      formulaSector: "مساحة القطاع = ½ × r² × θ",
    },
    en: {
      title: "Angles Simulator",
      description: "Interactive angle measurement and classification",
      angle: "Angle",
      degrees: "degrees",
      acute: "Acute",
      right: "Right",
      obtuse: "Obtuse",
      straight: "Straight",
      reflex: "Reflex",
      full: "Full",
      classification: "Angle Classification",
      showProtractor: "Show Protractor",
      hideProtractor: "Hide Protractor",
      animate: "Animate",
      reset: "Reset",
      range: "Angle Range",
      acuteRange: "0° - 90°",
      rightAngle: "90°",
      obtuseRange: "90° - 180°",
      straightAngle: "180°",
      reflexRange: "180° - 360°",
      fullAngle: "360°",
      properties: "Properties",
      complement: "Complement",
      supplement: "Supplement",
      arcLength: "Arc Length",
      sectorArea: "Sector Area",
      radius: "Radius",
      formulaArc: "Arc Length = θ × r",
      formulaSector: "Sector Area = ½ × r² × θ",
    },
  };

  const t = texts[language];

  // Get angle classification
  const getAngleClassification = (angleDeg: number) => {
    if (angleDeg < 90) return { type: t.acute, color: "#22c55e", range: t.acuteRange };
    if (angleDeg === 90) return { type: t.right, color: "#3b82f6", range: t.rightAngle };
    if (angleDeg < 180) return { type: t.obtuse, color: "#f59e0b", range: t.obtuseRange };
    if (angleDeg === 180) return { type: t.straight, color: "#8b5cf6", range: t.straightAngle };
    if (angleDeg < 360) return { type: t.reflex, color: "#ec4899", range: t.reflexRange };
    return { type: t.full, color: "#06b6d4", range: t.fullAngle };
  };

  const classification = getAngleClassification(angle);
  const displayAngle = isAnimating ? animationAngle : angle;
  const complement = 90 - displayAngle;
  const supplement = 180 - displayAngle;
  const radius = 100;
  const arcLength = (displayAngle * Math.PI / 180) * radius;
  const sectorArea = 0.5 * radius * radius * (displayAngle * Math.PI / 180);

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
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw protractor
    if (showProtractor) {
      // Draw outer arc
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 360; i += 10) {
        const rad = (i * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(rad) * 150, centerY - Math.sin(rad) * 150);
        ctx.stroke();
      }

      // Draw degree marks
      ctx.fillStyle = "#64748b";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      
      for (let i = 0; i <= 360; i += 30) {
        const rad = (i * Math.PI) / 180;
        const markLength = i % 90 === 0 ? 140 : 145;
        const x = centerX + Math.cos(rad) * markLength;
        const y = centerY - Math.sin(rad) * markLength;
        
        if (i <= 180) {
          ctx.fillText(`${i}°`, x, y);
        }
      }
    }

    // Draw reference line (horizontal)
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 160, centerY);
    ctx.lineTo(centerX + 160, centerY);
    ctx.stroke();

    // Draw angle arc
    const arcRadius = 60;
    const startRad = 0;
    const endRad = (displayAngle * Math.PI) / 180;

    ctx.strokeStyle = classification.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, arcRadius, startRad, -endRad, true);
    ctx.stroke();

    // Fill the sector
    ctx.fillStyle = classification.color + "30";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, arcRadius, startRad, -endRad, true);
    ctx.closePath();
    ctx.fill();

    // Draw the angle line
    const lineLength = 140;
    const angleRad = (displayAngle * Math.PI) / 180;
    const endX = centerX + Math.cos(-angleRad) * lineLength;
    const endY = centerY + Math.sin(-angleRad) * lineLength;

    ctx.strokeStyle = classification.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw vertex point
    ctx.fillStyle = classification.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw angle label
    const labelRad = ((displayAngle / 2) * Math.PI) / 180;
    const labelX = centerX + Math.cos(-labelRad) * 80;
    const labelY = centerY + Math.sin(-labelRad) * 80;

    ctx.fillStyle = classification.color;
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${displayAngle}°`, labelX, labelY);

  }, [displayAngle, showProtractor, classification]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationAngle((prev) => {
        if (prev >= 360) {
          setIsAnimating(false);
          return 360;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Reset
  const handleReset = () => {
    setAngle(45);
    setAnimationAngle(0);
    setIsAnimating(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Circle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Angle Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.angle}</label>
            <Badge style={{ backgroundColor: classification.color, color: "white" }}>
              {angle}°
            </Badge>
          </div>
          <Slider
            value={[angle]}
            onValueChange={([value]) => {
              setAngle(value);
              setIsAnimating(false);
            }}
            min={0}
            max={360}
            step={1}
          />
        </div>

        {/* Classification */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t.classification}</span>
            <Badge style={{ backgroundColor: classification.color, color: "white" }} className="text-lg px-4 py-1">
              {classification.type}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-2">{t.range}: {classification.range}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowProtractor(!showProtractor)}
          >
            {showProtractor ? t.hideProtractor : t.showProtractor}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAnimationAngle(0);
              setIsAnimating(true);
            }}
            disabled={isAnimating}
          >
            <Play className="w-4 h-4 mr-2" />
            {t.animate}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={350} className="w-full" />
        </div>

        {/* Properties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
            <p className="text-sm text-slate-500">{t.complement}</p>
            <p className="font-bold text-emerald-600">{complement > 0 ? `${complement.toFixed(1)}°` : "-"}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
            <p className="text-sm text-slate-500">{t.supplement}</p>
            <p className="font-bold text-blue-600">{supplement > 0 ? `${supplement.toFixed(1)}°` : "-"}</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
            <p className="text-sm text-slate-500">{t.arcLength}</p>
            <p className="font-bold text-purple-600">{arcLength.toFixed(1)} ({t.radius}: {radius})</p>
          </div>
          <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950">
            <p className="text-sm text-slate-500">{t.sectorArea}</p>
            <p className="font-bold text-pink-600">{sectorArea.toFixed(1)}</p>
          </div>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.formulaArc}</code>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.formulaSector}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
