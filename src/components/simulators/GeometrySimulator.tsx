"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Triangle, Square, Hexagon, Circle } from "lucide-react";

interface GeometrySimulatorProps {
  language: "ar" | "en";
}

export function GeometrySimulator({ language }: GeometrySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [shape, setShape] = useState<"triangle" | "square" | "polygon" | "circle">("triangle");
  const [sides, setSides] = useState(3);
  const [size, setSize] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showAngles, setShowAngles] = useState(true);

  const texts = {
    ar: {
      title: "محاكي الأشكال الهندسية",
      description: "استكشف الأشكال الهندسية والزوايا والمساحات",
      triangle: "مثلث",
      square: "مربع",
      polygon: "مضلع",
      circle: "دائرة",
      sides: "عدد الأضلاع",
      size: "الحجم",
      rotation: "الدوران",
      perimeter: "المحيط",
      area: "المساحة",
      interiorAngle: "الزاوية الداخلية",
      exteriorAngle: "الزاوية الخارجية",
      showAngles: "إظهار الزوايا",
      reset: "إعادة",
    },
    en: {
      title: "Geometry Simulator",
      description: "Explore geometric shapes, angles, and areas",
      triangle: "Triangle",
      square: "Square",
      polygon: "Polygon",
      circle: "Circle",
      sides: "Number of Sides",
      size: "Size",
      rotation: "Rotation",
      perimeter: "Perimeter",
      area: "Area",
      interiorAngle: "Interior Angle",
      exteriorAngle: "Exterior Angle",
      showAngles: "Show Angles",
      reset: "Reset",
    },
  };

  const t = texts[language];

  // Calculate properties
  const getProperties = () => {
    if (shape === "circle") {
      const radius = size;
      return {
        perimeter: 2 * Math.PI * radius,
        area: Math.PI * radius * radius,
        interiorAngle: 360,
        exteriorAngle: 0,
      };
    }
    
    const n = shape === "triangle" ? 3 : shape === "square" ? 4 : sides;
    const interiorAngle = ((n - 2) * 180) / n;
    const exteriorAngle = 360 / n;
    const perimeter = n * size;
    const apothem = size / (2 * Math.tan(Math.PI / n));
    const area = 0.5 * perimeter * apothem;
    
    return { perimeter, area, interiorAngle, exteriorAngle };
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);

    const props = getProperties();

    if (shape === "circle") {
      // Draw circle
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke();

      // Radius
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size, 0);
      ctx.stroke();
      
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#ef4444";
      ctx.font = "12px system-ui";
      ctx.fillText("r", size / 2, -10);
    } else {
      const n = shape === "triangle" ? 3 : shape === "square" ? 4 : sides;
      const angle = (2 * Math.PI) / n;
      const radius = size / (2 * Math.sin(Math.PI / n));

      // Draw polygon
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const points = [];
      for (let i = 0; i < n; i++) {
        const x = radius * Math.cos(angle * i - Math.PI / 2);
        const y = radius * Math.sin(angle * i - Math.PI / 2);
        points.push({ x, y });
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Fill with semi-transparent color
      ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
      ctx.fill();

      // Draw angles
      if (showAngles) {
        ctx.fillStyle = "#f59e0b";
        ctx.font = "10px system-ui";
        
        points.forEach((point, i) => {
          const prev = points[(i - 1 + n) % n];
          const next = points[(i + 1) % n];
          
          // Draw angle arc
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 2;
          ctx.beginPath();
          const startAngle = Math.atan2(prev.y - point.y, prev.x - point.x);
          const endAngle = Math.atan2(next.y - point.y, next.x - point.x);
          ctx.arc(point.x, point.y, 20, startAngle, endAngle);
          ctx.stroke();

          // Angle label
          ctx.fillText(`${props.interiorAngle.toFixed(0)}°`, point.x + 25, point.y);
        });
      }

      // Draw center
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`n = ${shape === "triangle" ? 3 : shape === "square" ? 4 : shape === "circle" ? "∞" : sides}`, 10, 20);

  }, [shape, sides, size, rotation, showAngles]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const props = getProperties();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Triangle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Shape Selection */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={shape === "triangle" ? "default" : "outline"}
            onClick={() => setShape("triangle")}
            size="sm"
            className={shape === "triangle" ? "bg-rose-500 hover:bg-rose-600" : ""}
          >
            <Triangle className="w-4 h-4 mr-1" />
            {t.triangle}
          </Button>
          <Button
            variant={shape === "square" ? "default" : "outline"}
            onClick={() => setShape("square")}
            size="sm"
            className={shape === "square" ? "bg-rose-500 hover:bg-rose-600" : ""}
          >
            <Square className="w-4 h-4 mr-1" />
            {t.square}
          </Button>
          <Button
            variant={shape === "polygon" ? "default" : "outline"}
            onClick={() => setShape("polygon")}
            size="sm"
            className={shape === "polygon" ? "bg-rose-500 hover:bg-rose-600" : ""}
          >
            <Hexagon className="w-4 h-4 mr-1" />
            {t.polygon}
          </Button>
          <Button
            variant={shape === "circle" ? "default" : "outline"}
            onClick={() => setShape("circle")}
            size="sm"
            className={shape === "circle" ? "bg-rose-500 hover:bg-rose-600" : ""}
          >
            <Circle className="w-4 h-4 mr-1" />
            {t.circle}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shape === "polygon" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t.sides}</label>
                <Badge variant="secondary">{sides}</Badge>
              </div>
              <Slider
                value={[sides]}
                onValueChange={([v]) => setSides(v)}
                min={3}
                max={12}
                step={1}
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t.size}</label>
              <Badge variant="secondary">{size}</Badge>
            </div>
            <Slider
              value={[size]}
              onValueChange={([v]) => setSize(v)}
              min={30}
              max={150}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t.rotation}</label>
              <Badge variant="secondary">{rotation}°</Badge>
            </div>
            <Slider
              value={[rotation]}
              onValueChange={([v]) => setRotation(v)}
              min={0}
              max={360}
              step={5}
            />
          </div>
        </div>

        {/* Show Angles Toggle */}
        {shape !== "circle" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAngles}
              onChange={(e) => setShowAngles(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm">{t.showAngles}</label>
          </div>
        )}

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={500}
            height={350}
            className="w-full bg-white"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.perimeter}</p>
            <p className="font-bold text-lg">{props.perimeter.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.area}</p>
            <p className="font-bold text-lg">{props.area.toFixed(2)}</p>
          </div>
          {shape !== "circle" && (
            <>
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.interiorAngle}</p>
                <p className="font-bold text-lg">{props.interiorAngle.toFixed(1)}°</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.exteriorAngle}</p>
                <p className="font-bold text-lg">{props.exteriorAngle.toFixed(1)}°</p>
              </div>
            </>
          )}
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={() => { setSides(3); setSize(100); setRotation(0); }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
