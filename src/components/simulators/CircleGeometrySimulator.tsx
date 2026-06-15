"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Circle, PieChart } from "lucide-react";

interface CircleGeometrySimulatorProps {
  language: "ar" | "en";
}

export function CircleGeometrySimulator({ language }: CircleGeometrySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [radius, setRadius] = useState(100);
  const [centralAngle, setCentralAngle] = useState(90);
  const [showChord, setShowChord] = useState(true);
  const [showTangent, setShowTangent] = useState(false);
  const [showSector, setShowSector] = useState(true);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي هندسة الدائرة",
      description: "استكشف خصائص الدائرة والأقواس والقطاعات",
      radius: "نصف القطر",
      diameter: "القطر",
      circumference: "المحيط",
      area: "المساحة",
      centralAngle: "الزاوية المركزية",
      arcLength: "طول القوس",
      chordLength: "طول الوتر",
      sectorArea: "مساحة القطاع",
      segmentArea: "مساحة القطعة",
      tangentLength: "طول المماس",
      showChord: "إظهار الوتر",
      hideChord: "إخفاء الوتر",
      showTangent: "إظهار المماس",
      hideTangent: "إخفاء المماس",
      showSector: "إظهار القطاع",
      hideSector: "إخفاء القطاع",
      reset: "إعادة",
      formulas: "المعادلات",
      circumferenceFormula: "م = 2πن",
      areaFormula: "م = πن²",
      arcFormula: "ط = θ/360 × 2πن",
      chordFormula: "و = 2ن جب(θ/2)",
      sectorFormula: "ق = θ/360 × πن²",
    },
    en: {
      title: "Circle Geometry Simulator",
      description: "Explore circle properties, arcs, and sectors",
      radius: "Radius",
      diameter: "Diameter",
      circumference: "Circumference",
      area: "Area",
      centralAngle: "Central Angle",
      arcLength: "Arc Length",
      chordLength: "Chord Length",
      sectorArea: "Sector Area",
      segmentArea: "Segment Area",
      tangentLength: "Tangent Length",
      showChord: "Show Chord",
      hideChord: "Hide Chord",
      showTangent: "Show Tangent",
      hideTangent: "Hide Tangent",
      showSector: "Show Sector",
      hideSector: "Hide Sector",
      reset: "Reset",
      formulas: "Formulas",
      circumferenceFormula: "C = 2πr",
      areaFormula: "A = πr²",
      arcFormula: "L = θ/360 × 2πr",
      chordFormula: "c = 2r sin(θ/2)",
      sectorFormula: "S = θ/360 × πr²",
    },
  };

  const t = texts[language];

  // Calculate circle properties
  const diameter = 2 * radius;
  const circumference = 2 * Math.PI * radius;
  const area = Math.PI * radius * radius;
  
  // Arc length
  const arcLength = (centralAngle / 360) * circumference;
  
  // Chord length
  const chordLength = 2 * radius * Math.sin((centralAngle * Math.PI) / 360);
  
  // Sector area
  const sectorArea = (centralAngle / 360) * area;
  
  // Segment area (sector - triangle)
  const triangleArea = 0.5 * radius * radius * Math.sin((centralAngle * Math.PI) / 180);
  const segmentArea = sectorArea - triangleArea;

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
    const scale = Math.min(width, height) / 300;
    const displayRadius = radius * scale * 0.8;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw sector if enabled
    if (showSector) {
      const startAngle = 0;
      const endAngle = -(centralAngle * Math.PI) / 180;

      ctx.fillStyle = "#3b82f630";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, displayRadius, startAngle, endAngle, true);
      ctx.closePath();
      ctx.fill();
    }

    // Draw the circle
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, displayRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw radius lines
    const angleRad = (centralAngle * Math.PI) / 180;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    
    // First radius (horizontal)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + displayRadius, centerY);
    ctx.stroke();

    // Second radius (at angle)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + displayRadius * Math.cos(-angleRad), centerY + displayRadius * Math.sin(-angleRad));
    ctx.stroke();

    // Draw arc highlight
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, displayRadius, 0, -angleRad, true);
    ctx.stroke();

    // Draw chord if enabled
    if (showChord && centralAngle > 0 && centralAngle < 360) {
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + displayRadius, centerY);
      ctx.lineTo(centerX + displayRadius * Math.cos(-angleRad), centerY + displayRadius * Math.sin(-angleRad));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw tangent if enabled
    if (showTangent) {
      const tangentLength = displayRadius * 0.6;
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2;
      
      // Tangent at point on the circle (right side)
      ctx.beginPath();
      ctx.moveTo(centerX + displayRadius, centerY - tangentLength);
      ctx.lineTo(centerX + displayRadius, centerY + tangentLength);
      ctx.stroke();

      // Right angle marker
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 1;
      const markerSize = 10;
      ctx.beginPath();
      ctx.moveTo(centerX + displayRadius - markerSize, centerY);
      ctx.lineTo(centerX + displayRadius - markerSize, centerY - markerSize);
      ctx.lineTo(centerX + displayRadius, centerY - markerSize);
      ctx.stroke();
    }

    // Draw center point
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw angle arc
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, -angleRad, true);
    ctx.stroke();

    // Draw angle label
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${centralAngle}°`, centerX + 45, centerY - 15);

    // Draw radius label
    ctx.fillStyle = "#22c55e";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`r = ${radius}`, centerX + displayRadius / 2, centerY + 20);

  }, [radius, centralAngle, showChord, showTangent, showSector]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setRadius(100);
    setCentralAngle(90);
    setShowChord(true);
    setShowTangent(false);
    setShowSector(true);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Circle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Radius Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.radius}</label>
            <Badge className="bg-blue-500">{radius}</Badge>
          </div>
          <Slider
            value={[radius]}
            onValueChange={([value]) => setRadius(value)}
            min={30}
            max={150}
            step={5}
          />
        </div>

        {/* Central Angle Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.centralAngle}</label>
            <Badge className="bg-amber-500">{centralAngle}°</Badge>
          </div>
          <Slider
            value={[centralAngle]}
            onValueChange={([value]) => setCentralAngle(value)}
            min={0}
            max={360}
            step={1}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowSector(!showSector)}
          >
            {showSector ? t.hideSector : t.showSector}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowChord(!showChord)}
          >
            {showChord ? t.hideChord : t.showChord}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTangent(!showTangent)}
          >
            {showTangent ? t.hideTangent : t.showTangent}
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

        {/* Properties Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
            <p className="text-sm text-slate-500">{t.diameter}</p>
            <p className="font-bold text-blue-600">{diameter.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950">
            <p className="text-sm text-slate-500">{t.circumference}</p>
            <p className="font-bold text-cyan-600">{circumference.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
            <p className="text-sm text-slate-500">{t.area}</p>
            <p className="font-bold text-emerald-600">{area.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
            <p className="text-sm text-slate-500">{t.arcLength}</p>
            <p className="font-bold text-amber-600">{arcLength.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950">
            <p className="text-sm text-slate-500">{t.chordLength}</p>
            <p className="font-bold text-pink-600">{chordLength.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
            <p className="text-sm text-slate-500">{t.sectorArea}</p>
            <p className="font-bold text-purple-600">{sectorArea.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
            <p className="text-sm text-slate-500">{t.segmentArea}</p>
            <p className="font-bold text-orange-600">{segmentArea.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950">
            <p className="text-sm text-slate-500">{t.tangentLength}</p>
            <p className="font-bold text-rose-600">∞</p>
          </div>
        </div>

        {/* Formulas */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            {t.formulas}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.circumferenceFormula}</code>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.areaFormula}</code>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.arcFormula}</code>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
              <code className="text-sm font-mono">{t.chordFormula}</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
