"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Circle, Move } from "lucide-react";

interface TrigFunctionsSimulatorProps {
  language: "ar" | "en";
}

type TrigFunction = "sin" | "cos" | "tan";

export function TrigFunctionsSimulator({ language }: TrigFunctionsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [angle, setAngle] = useState(45);
  const [selectedFunction, setSelectedFunction] = useState<TrigFunction>("sin");
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const animationRef = useRef<number | null>(null);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الدوال المثلثية",
      description: "استكشف دوال sin, cos, tan على دائرة الوحدة",
      sin: "جيب (sin)",
      cos: "جيب تمام (cos)",
      tan: "ظل (tan)",
      angle: "الزاوية (درجة)",
      radians: "راديان",
      degrees: "درجة",
      value: "القيمة",
      unitCircle: "دائرة الوحدة",
      graph: "الرسم البياني",
      coordinates: "الإحداثيات",
      formula: "المعادلة",
      animation: "تشغيل الحركة",
      pause: "إيقاف",
      reset: "إعادة",
      speed: "السرعة",
      explanation: "التفسير الرياضي",
      sinExplanation: "الجيب = الإحداثي الصادي (y) للنقطة على دائرة الوحدة",
      cosExplanation: "جيب التمام = الإحداثي السيني (x) للنقطة على دائرة الوحدة",
      tanExplanation: "الظل = الجيب ÷ جيب التمام = y/x (ممثل بخط مماس)",
    },
    en: {
      title: "Trigonometric Functions Simulator",
      description: "Explore sin, cos, tan functions on the unit circle",
      sin: "Sine (sin)",
      cos: "Cosine (cos)",
      tan: "Tangent (tan)",
      angle: "Angle (degrees)",
      radians: "Radians",
      degrees: "Degrees",
      value: "Value",
      unitCircle: "Unit Circle",
      graph: "Graph",
      coordinates: "Coordinates",
      formula: "Formula",
      animation: "Play Animation",
      pause: "Pause",
      reset: "Reset",
      speed: "Speed",
      explanation: "Mathematical Explanation",
      sinExplanation: "Sine = y-coordinate of the point on the unit circle",
      cosExplanation: "Cosine = x-coordinate of the point on the unit circle",
      tanExplanation: "Tangent = Sine ÷ Cosine = y/x (represented by tangent line)",
    },
  };

  const t = texts[language];

  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180;

  // Calculate trig values
  const sinValue = Math.sin(angleRad);
  const cosValue = Math.cos(angleRad);
  const tanValue = Math.tan(angleRad);

  // Get current function value
  const getCurrentValue = useCallback(() => {
    switch (selectedFunction) {
      case "sin":
        return sinValue;
      case "cos":
        return cosValue;
      case "tan":
        return tanValue;
    }
  }, [selectedFunction, sinValue, cosValue, tanValue]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    const gridSize = radius / 4;
    
    for (let i = -4; i <= 4; i++) {
      // Vertical
      ctx.beginPath();
      ctx.moveTo(centerX + i * gridSize, 0);
      ctx.lineTo(centerX + i * gridSize, height);
      ctx.stroke();
      // Horizontal
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * gridSize);
      ctx.lineTo(width, centerY + i * gridSize);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#334155";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("x", width - 15, centerY - 10);
    ctx.fillText("y", centerX + 15, 15);

    // Unit labels
    ctx.font = "10px system-ui";
    ctx.fillText("1", centerX + radius, centerY + 15);
    ctx.fillText("-1", centerX - radius, centerY + 15);
    ctx.fillText("1", centerX + 10, centerY - radius);
    ctx.fillText("-1", centerX + 10, centerY + radius);

    // Draw unit circle
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Point on circle
    const pointX = centerX + cosValue * radius;
    const pointY = centerY - sinValue * radius;

    // Draw angle arc
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const arcRadius = 30;
    if (angleRad >= 0) {
      ctx.arc(centerX, centerY, arcRadius, 0, -angleRad, true);
    } else {
      ctx.arc(centerX, centerY, arcRadius, 0, -angleRad, false);
    }
    ctx.stroke();

    // Draw radius line
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();

    // Draw sin projection (horizontal line to y-axis)
    if (selectedFunction === "sin" || selectedFunction === "tan") {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pointX, pointY);
      ctx.lineTo(centerX, pointY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sin value indicator on y-axis
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(centerX, pointY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw cos projection (vertical line to x-axis)
    if (selectedFunction === "cos" || selectedFunction === "tan") {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pointX, pointY);
      ctx.lineTo(pointX, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cos value indicator on x-axis
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(pointX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw tangent line for tan
    if (selectedFunction === "tan" && Math.abs(cosValue) > 0.01) {
      const tanLineLength = tanValue * radius;
      
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX + radius, centerY);
      ctx.lineTo(centerX + radius, centerY - tanLineLength);
      ctx.stroke();

      // Tangent point
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(centerX + radius, centerY - tanLineLength, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw point on circle
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [angleRad, sinValue, cosValue, tanValue, selectedFunction]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation
  useEffect(() => {
    if (showAnimation) {
      const animate = () => {
        setAngle((prev) => (prev + animationSpeed) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showAnimation, animationSpeed]);

  // Reset
  const handleReset = () => {
    setShowAnimation(false);
    setAngle(45);
    setAnimationSpeed(1);
  };

  // Get explanation
  const getExplanation = () => {
    switch (selectedFunction) {
      case "sin":
        return t.sinExplanation;
      case "cos":
        return t.cosExplanation;
      case "tan":
        return t.tanExplanation;
    }
  };

  // Get color for selected function
  const getFunctionColor = () => {
    switch (selectedFunction) {
      case "sin":
        return "text-green-600";
      case "cos":
        return "text-blue-600";
      case "tan":
        return "text-purple-600";
    }
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Circle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-orange-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Function Selection */}
        <div className="grid grid-cols-3 gap-2">
          {(["sin", "cos", "tan"] as TrigFunction[]).map((func) => (
            <Button
              key={func}
              variant={selectedFunction === func ? "default" : "outline"}
              onClick={() => setSelectedFunction(func)}
              className={`text-sm ${selectedFunction === func ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            >
              {t[func]}
            </Button>
          ))}
        </div>

        {/* Angle Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.angle}</label>
            <Badge variant="secondary">{angle.toFixed(0)}°</Badge>
          </div>
          <Slider
            value={[angle]}
            onValueChange={([v]) => setAngle(v)}
            min={0}
            max={360}
            step={1}
          />
        </div>

        {/* Animation Speed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.speed}</label>
            <Badge variant="secondary">{animationSpeed.toFixed(1)}x</Badge>
          </div>
          <Slider
            value={[animationSpeed]}
            onValueChange={([v]) => setAnimationSpeed(v)}
            min={0.1}
            max={5}
            step={0.1}
          />
        </div>

        {/* Animation Button */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAnimation(!showAnimation)}
            className={`flex-1 ${showAnimation ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            <Play className="w-4 h-4 mr-2" />
            {showAnimation ? t.pause : t.animation}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Values Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.degrees}</p>
            <p className="text-lg font-bold">{angle.toFixed(0)}°</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.radians}</p>
            <p className="text-lg font-bold">{angleRad.toFixed(3)}</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.coordinates}</p>
            <p className="text-sm font-bold">({cosValue.toFixed(3)}, {sinValue.toFixed(3)})</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t[selectedFunction]}({t.value})</p>
            <p className={`text-lg font-bold ${getFunctionColor()}`}>
              {getCurrentValue().toFixed(4)}
            </p>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={400} className="w-full" />
        </div>

        {/* Explanation */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">{t.explanation}</p>
          <p className="text-sm">{getExplanation()}</p>
        </div>

        {/* All Values */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">sin</p>
            <p className="font-mono font-bold text-green-600">{sinValue.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">cos</p>
            <p className="font-mono font-bold text-blue-600">{cosValue.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">tan</p>
            <p className="font-mono font-bold text-purple-600">
              {Math.abs(tanValue) > 100 ? "∞" : tanValue.toFixed(4)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
