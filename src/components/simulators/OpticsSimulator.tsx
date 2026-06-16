"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RotateCcw, Glasses } from "lucide-react";

interface OpticsSimulatorProps {
  language: "ar" | "en";
}

export function OpticsSimulator({ language }: OpticsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [objectDistance, setObjectDistance] = useState(30);
  const [focalLength, setFocalLength] = useState(15);
  const [lensType, setLensType] = useState<"convex" | "concave">("convex");

  const texts = {
    ar: {
      title: "محاكي العدسات والضوء",
      description: "استكشف كيفية تكوين الصور بالعدسات",
      objectDistance: "بعد الجسم",
      focalLength: "البعد البؤري",
      imagePosition: "موضع الصورة",
      magnification: "التكبير",
      imageType: "نوع الصورة",
      convex: "عدسة محدبة",
      concave: "عدسة مقعرة",
      real: "حقيقية",
      virtual: "تخيلية",
      inverted: "مقلوبة",
      upright: "معتدلة",
      reset: "إعادة",
      cm: "سم",
    },
    en: {
      title: "Optics & Lens Simulator",
      description: "Explore image formation with lenses",
      objectDistance: "Object Distance",
      focalLength: "Focal Length",
      imagePosition: "Image Position",
      magnification: "Magnification",
      imageType: "Image Type",
      convex: "Convex Lens",
      concave: "Concave Lens",
      real: "Real",
      virtual: "Virtual",
      inverted: "Inverted",
      upright: "Upright",
      reset: "Reset",
      cm: "cm",
    },
  };

  const t = texts[language];

  // Calculate image using lens equation: 1/f = 1/do + 1/di
  const calculateImage = useCallback(() => {
    const f = lensType === "convex" ? focalLength : -focalLength;
    const do_ = objectDistance;
    
    // 1/di = 1/f - 1/do
    const di = (f * do_) / (do_ - f);
    const m = -di / do_;
    
    const isReal = di > 0;
    const isInverted = m < 0;
    
    return { di, m, isReal, isInverted };
  }, [objectDistance, focalLength, lensType]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 4;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw principal axis
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw lens
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    if (lensType === "convex") {
      // Convex lens shape
      ctx.moveTo(centerX, centerY - 80);
      ctx.quadraticCurveTo(centerX + 20, centerY, centerX, centerY + 80);
      ctx.moveTo(centerX, centerY - 80);
      ctx.quadraticCurveTo(centerX - 20, centerY, centerX, centerY + 80);
    } else {
      // Concave lens shape
      ctx.moveTo(centerX - 10, centerY - 80);
      ctx.quadraticCurveTo(centerX + 10, centerY, centerX - 10, centerY + 80);
      ctx.moveTo(centerX + 10, centerY - 80);
      ctx.quadraticCurveTo(centerX - 10, centerY, centerX + 10, centerY + 80);
    }
    ctx.stroke();

    // Draw focal points
    const f = focalLength * scale;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(centerX + f, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX - f, centerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Labels for focal points
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.fillText("F", centerX + f - 5, centerY + 20);
    ctx.fillText("F'", centerX - f - 8, centerY + 20);

    // Draw object (arrow)
    const objX = centerX - objectDistance * scale;
    const objHeight = 50;
    
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, centerY);
    ctx.lineTo(objX, centerY - objHeight);
    ctx.stroke();
    
    // Arrow head
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(objX, centerY - objHeight - 10);
    ctx.lineTo(objX - 6, centerY - objHeight);
    ctx.lineTo(objX + 6, centerY - objHeight);
    ctx.fill();

    // Calculate and draw image
    const { di, m, isReal, isInverted } = calculateImage();
    const imgX = centerX + di * scale;
    const imgHeight = Math.abs(m) * objHeight;

    if (Math.abs(di) < 200) {
      ctx.strokeStyle = isReal ? "#f59e0b" : "#f59e0b";
      ctx.lineWidth = 3;
      ctx.setLineDash(isReal ? [] : [5, 5]);
      
      ctx.beginPath();
      ctx.moveTo(imgX, centerY);
      ctx.lineTo(imgX, centerY + (isInverted ? imgHeight : -imgHeight));
      ctx.stroke();
      ctx.setLineDash([]);

      // Image arrow head
      ctx.fillStyle = "#f59e0b";
      const imgY = centerY + (isInverted ? imgHeight : -imgHeight);
      ctx.beginPath();
      ctx.moveTo(imgX, imgY + (isInverted ? 10 : -10));
      ctx.lineTo(imgX - 6, imgY);
      ctx.lineTo(imgX + 6, imgY);
      ctx.fill();
    }

    // Draw light rays
    ctx.setLineDash([]);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    
    // Ray 1: Parallel to axis, then through focal point
    ctx.beginPath();
    ctx.moveTo(objX, centerY - objHeight);
    ctx.lineTo(centerX, centerY - objHeight);
    if (isReal) {
      ctx.lineTo(imgX, centerY + (isInverted ? imgHeight : -imgHeight));
    } else {
      // Virtual ray extension
      ctx.setLineDash([3, 3]);
      ctx.lineTo(centerX - f, centerY);
      ctx.setLineDash([]);
      ctx.moveTo(centerX, centerY - objHeight);
      ctx.lineTo(imgX, centerY - imgHeight);
    }
    ctx.stroke();

    // Ray 2: Through center of lens
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(objX, centerY - objHeight);
    if (isReal) {
      ctx.lineTo(imgX, centerY + (isInverted ? imgHeight : -imgHeight));
    } else {
      ctx.lineTo(centerX, centerY - (objHeight * di) / objectDistance);
      ctx.setLineDash([3, 3]);
      ctx.lineTo(imgX, centerY - imgHeight);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(language === "ar" ? "الجسم" : "Object", objX - 15, centerY + 25);
    
    if (Math.abs(di) < 200) {
      ctx.fillText(language === "ar" ? "الصورة" : "Image", imgX - 15, centerY + 25);
    }

  }, [objectDistance, focalLength, lensType, calculateImage, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const { di, m, isReal, isInverted } = calculateImage();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Glasses className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Lens Type Selection */}
        <div className="flex gap-3">
          <Button
            variant={lensType === "convex" ? "default" : "outline"}
            onClick={() => setLensType("convex")}
            className={lensType === "convex" ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {t.convex}
          </Button>
          <Button
            variant={lensType === "concave" ? "default" : "outline"}
            onClick={() => setLensType("concave")}
            className={lensType === "concave" ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {t.concave}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.objectDistance}</label>
              <Badge variant="secondary">{objectDistance} {t.cm}</Badge>
            </div>
            <Slider
              value={[objectDistance]}
              onValueChange={([v]) => setObjectDistance(v)}
              min={10}
              max={60}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.focalLength}</label>
              <Badge variant="secondary">{focalLength} {t.cm}</Badge>
            </div>
            <Slider
              value={[focalLength]}
              onValueChange={([v]) => setFocalLength(v)}
              min={5}
              max={30}
              step={1}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={700}
            height={300}
            className="w-full bg-white"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.imagePosition}</p>
            <p className="font-bold text-lg">{di.toFixed(1)} {t.cm}</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.magnification}</p>
            <p className="font-bold text-lg">{Math.abs(m).toFixed(2)}x</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.imageType}</p>
            <p className="font-bold text-lg">{isReal ? t.real : t.virtual}</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-500">{language === "ar" ? "الاتجاه" : "Orientation"}</p>
            <p className="font-bold text-lg">{isInverted ? t.inverted : t.upright}</p>
          </div>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={() => { setObjectDistance(30); setFocalLength(15); }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
