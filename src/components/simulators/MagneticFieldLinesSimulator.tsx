"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Compass, Eye, Lightbulb } from "lucide-react";

interface MagneticFieldLinesSimulatorProps {
  language: "ar" | "en";
}

export function MagneticFieldLinesSimulator({ language }: MagneticFieldLinesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [fieldStrength, setFieldStrength] = useState(50);
  const [magnetType, setMagnetType] = useState<"bar" | "horseshoe" | "circular">("bar");
  const [showCompass, setShowCompass] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 250, y: 150 });
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي خطوط المجال المغناطيسي",
      description: "تصور خطوط المجال المغناطيسي لأنواع مختلفة من المغناطيسات",
      fieldStrength: "قوة المجال",
      magnetType: "نوع المغناطيس",
      bar: "مغناطيس قضيب",
      horseshoe: "مغناطيس حدوة حصان",
      circular: "مغناطيس دائري",
      showCompass: "إظهار البوصلة",
      fieldDirection: "اتجاه المجال",
      fieldIntensity: "شدة المجال",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      north: "شمال",
      south: "جنوب",
      explanation: "التفسير الفيزيائي",
      fieldLinesExplain: "خطوط المجال المغناطيسي تخرج من القطب الشمالي وتدخل في القطب الجنوبي. كثافة الخطوط تدل على شدة المجال - كلما كانت الخطوط أقرب، كان المجال أقوى.",
      rightHandRule: "قاعدة اليد اليمنى: إذا أشرت بإبهامك في اتجاه التيار، فإن اتجاه الأصابع الملتفة يمثل اتجاه المجال المغناطيسي",
    },
    en: {
      title: "Magnetic Field Lines Simulator",
      description: "Visualize magnetic field lines for different types of magnets",
      fieldStrength: "Field Strength",
      magnetType: "Magnet Type",
      bar: "Bar Magnet",
      horseshoe: "Horseshoe Magnet",
      circular: "Circular Magnet",
      showCompass: "Show Compass",
      fieldDirection: "Field Direction",
      fieldIntensity: "Field Intensity",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      north: "N",
      south: "S",
      explanation: "Physical Explanation",
      fieldLinesExplain: "Magnetic field lines emerge from the North pole and enter the South pole. The density of lines indicates field strength - closer lines mean stronger field.",
      rightHandRule: "Right Hand Rule: If you point your thumb in the direction of current, your curling fingers show the direction of the magnetic field",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Calculate field at a point
  const calculateFieldAtPoint = useCallback((x: number, y: number, centerX: number, centerY: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 20) return { bx: 0, by: 0, strength: 0 };
    
    // Simplified dipole field calculation
    const strength = (fieldStrength * 5000) / (dist * dist);
    const angle = Math.atan2(dy, dx);
    
    return {
      bx: -strength * Math.cos(angle),
      by: -strength * Math.sin(angle),
      strength: strength
    };
  }, [fieldStrength]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "rgba(100, 116, 139, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (magnetType === "bar") {
      // Draw bar magnet
      const magnetWidth = 120;
      const magnetHeight = 50;
      const magnetX = centerX - magnetWidth / 2;
      const magnetY = centerY - magnetHeight / 2;

      // North pole
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(magnetX, magnetY, magnetWidth / 2, magnetHeight);
      
      // South pole
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(magnetX + magnetWidth / 2, magnetY, magnetWidth / 2, magnetHeight);

      // Labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t.north, magnetX + magnetWidth / 4, centerY);
      ctx.fillText(t.south, magnetX + 3 * magnetWidth / 4, centerY);

      // Draw field lines
      drawBarMagnetFieldLines(ctx, centerX, centerY, magnetWidth, magnetHeight);

    } else if (magnetType === "horseshoe") {
      // Draw horseshoe magnet
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 20;
      
      // Left arm (N)
      ctx.beginPath();
      ctx.strokeStyle = "#ef4444";
      ctx.moveTo(centerX - 80, centerY - 60);
      ctx.lineTo(centerX - 80, centerY + 40);
      ctx.arc(centerX - 40, centerY + 40, 40, Math.PI, 0, true);
      ctx.stroke();
      
      // Right arm (S)
      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6";
      ctx.moveTo(centerX + 80, centerY - 60);
      ctx.lineTo(centerX + 80, centerY + 40);
      ctx.arc(centerX + 40, centerY + 40, 40, 0, Math.PI, true);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.north, centerX - 80, centerY - 40);
      ctx.fillText(t.south, centerX + 80, centerY - 40);

      // Draw field lines for horseshoe
      drawHorseshoeFieldLines(ctx, centerX, centerY);

    } else if (magnetType === "circular") {
      // Draw circular magnet (ring)
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.stroke();

      // Color halves
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      
      ctx.strokeStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.north, centerX + 85, centerY);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(t.south, centerX - 85, centerY);

      // Draw field lines for circular
      drawCircularFieldLines(ctx, centerX, centerY);
    }

    // Draw compass at mouse position
    if (showCompass) {
      drawCompass(ctx, mousePos.x, mousePos.y, centerX, centerY);
    }

    // Draw field intensity indicator
    const field = calculateFieldAtPoint(mousePos.x, mousePos.y, centerX, centerY);
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`${t.fieldIntensity}: ${field.strength.toFixed(4)} T`, 10, 20);

  }, [magnetType, fieldStrength, showCompass, mousePos, t, calculateFieldAtPoint]);

  const drawBarMagnetFieldLines = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, magnetWidth: number, magnetHeight: number) => {
    const lineCount = Math.floor(fieldStrength / 10);
    
    ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
    ctx.lineWidth = 2;

    for (let i = 0; i < lineCount; i++) {
      const yOffset = (i - lineCount / 2 + 0.5) * (magnetHeight / lineCount);
      const startY = centerY + yOffset;
      const curveDepth = Math.abs(yOffset) * 1.5 + 20 + (fieldStrength / 5);

      // Right side (from N to S externally)
      ctx.beginPath();
      ctx.moveTo(centerX + magnetWidth / 2, startY);
      ctx.bezierCurveTo(
        centerX + magnetWidth / 2 + curveDepth, startY,
        centerX + magnetWidth / 2 + curveDepth, centerY - yOffset,
        centerX - magnetWidth / 2, centerY - yOffset
      );
      ctx.stroke();

      // Draw arrow
      const arrowX = centerX + magnetWidth / 2 + curveDepth / 2;
      const arrowY = startY;
      drawArrow(ctx, arrowX, arrowY, yOffset > 0 ? Math.PI / 2 : -Math.PI / 2, "rgba(168, 85, 247, 0.8)");
    }
  };

  const drawHorseshoeFieldLines = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
    ctx.lineWidth = 2;

    const lineCount = Math.floor(fieldStrength / 15);
    
    for (let i = 0; i < lineCount; i++) {
      const xOff = 20 + i * 15;
      
      ctx.beginPath();
      ctx.moveTo(centerX - 80 + xOff / 2, centerY - 60);
      ctx.bezierCurveTo(
        centerX - 80 + xOff, centerY,
        centerX + 80 - xOff, centerY,
        centerX + 80 - xOff / 2, centerY - 60
      );
      ctx.stroke();
    }
  };

  const drawCircularFieldLines = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
    ctx.lineWidth = 2;

    const lineCount = Math.floor(fieldStrength / 10);
    
    for (let i = 0; i < lineCount; i++) {
      const radius = 80 + i * 25;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw arrows on the circle
      for (let j = 0; j < 4; j++) {
        const angle = (j * Math.PI / 2) + (isRunning ? time * 0.02 : 0);
        const ax = centerX + radius * Math.cos(angle);
        const ay = centerY + radius * Math.sin(angle);
        drawArrow(ctx, ax, ay, angle + Math.PI / 2, "rgba(168, 85, 247, 0.8)");
      }
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-4, -5);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawCompass = (ctx: CanvasRenderingContext2D, x: number, y: number, centerX: number, centerY: number) => {
    const field = calculateFieldAtPoint(x, y, centerX, centerY);
    const angle = Math.atan2(field.by, field.bx);

    // Compass body
    ctx.fillStyle = "#fef3c7";
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Compass needle
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // North pointer (red)
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(-5, 5);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();

    // South pointer (blue)
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(-5, -5);
    ctx.lineTo(5, -5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // N label
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("N", x, y - 28);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setTime(prev => prev + 1);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    setMousePos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Magnet Type Selection */}
        <div className={`flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant={magnetType === "bar" ? "default" : "outline"} 
            onClick={() => setMagnetType("bar")} 
            size="sm" 
            className={magnetType === "bar" ? "bg-violet-500" : ""}
          >
            {t.bar}
          </Button>
          <Button 
            variant={magnetType === "horseshoe" ? "default" : "outline"} 
            onClick={() => setMagnetType("horseshoe")} 
            size="sm" 
            className={magnetType === "horseshoe" ? "bg-violet-500" : ""}
          >
            {t.horseshoe}
          </Button>
          <Button 
            variant={magnetType === "circular" ? "default" : "outline"} 
            onClick={() => setMagnetType("circular")} 
            size="sm" 
            className={magnetType === "circular" ? "bg-violet-500" : ""}
          >
            {t.circular}
          </Button>
        </div>

        {/* Controls */}
        <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
          <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <label className="text-sm">{t.fieldStrength}</label>
            <Badge>{fieldStrength}%</Badge>
          </div>
          <Slider 
            value={[fieldStrength]} 
            onValueChange={([v]) => setFieldStrength(v)} 
            min={20} 
            max={100} 
            step={5}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        {/* Show Compass Toggle */}
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <input 
            type="checkbox" 
            checked={showCompass} 
            onChange={(e) => setShowCompass(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm flex items-center gap-2">
            <Compass className="w-4 h-4" />
            {t.showCompass}
          </label>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={300} 
            className="w-full bg-white cursor-crosshair"
            onMouseMove={handleMouseMove}
          />
        </div>

        {/* Physical Explanation */}
        <div className={`p-4 bg-violet-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Lightbulb className="w-4 h-4 text-violet-500" />
            <span className="font-medium text-violet-700">{t.explanation}</span>
          </div>
          <p className="text-sm text-slate-600">{t.fieldLinesExplain}</p>
        </div>

        {/* Controls */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-violet-500 hover:bg-violet-600"}
          >
            {isRunning ? t.stop : t.start}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { 
              setIsRunning(false); 
              setTime(0);
              setFieldStrength(50);
              setMagnetType("bar");
            }}
          >
            <RotateCcw className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
