"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Magnet, Sparkles } from "lucide-react";

interface MagnetismSimulatorProps {
  language: "ar" | "en";
}

export function MagnetismSimulator({ language }: MagnetismSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [magnetStrength, setMagnetStrength] = useState(50);
  const [distance, setDistance] = useState(100);
  const [materialType, setMaterialType] = useState<"ferromagnetic" | "paramagnetic" | "diamagnetic">("ferromagnetic");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [objectPosition, setObjectPosition] = useState(150);

  const texts = {
    ar: {
      title: "محاكي المغناطيسية",
      description: "استكشف خصائص المغناطيس وتأثيره على المواد المختلفة",
      magnetStrength: "قوة المغناطيس",
      distance: "المسافة",
      materialType: "نوع المادة",
      ferromagnetic: "مغناطيسي حديدي",
      paramagnetic: "مغناطيسي ضعيف",
      diamagnetic: "مغناطيسي معاكس",
      magneticForce: "القوة المغناطيسية",
      fieldLines: "خطوط المجال",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      north: "شمال",
      south: "جنوب",
      attracted: "منجذب",
      repelled: "مطارد",
      neutral: "محايد",
      formula: "المعادلة: F ∝ (m₁ × m₂) / r²",
      explanation: "التفسير الفيزيائي",
      ferromagneticExplain: "المواد المغناطيسية الحديدية (الحديد، النيكل، الكوبالت) تنجذب بقوة للمغناطيس وتصبح مغناطيسية مؤقتاً",
      paramagneticExplain: "المواد المغناطيسية الضعيفة (الألومنيوم، البلاتين) تنجذب بشكل ضعيف جداً للمغناطيس",
      diamagneticExplain: "المواد المغناطيسية المعاكسة (النحاس، الذهب، الماء) تطرد بشكل ضعيف جداً من المجال المغناطيسي",
    },
    en: {
      title: "Magnetism Simulator",
      description: "Explore magnet properties and their effect on different materials",
      magnetStrength: "Magnet Strength",
      distance: "Distance",
      materialType: "Material Type",
      ferromagnetic: "Ferromagnetic",
      paramagnetic: "Paramagnetic",
      diamagnetic: "Diamagnetic",
      magneticForce: "Magnetic Force",
      fieldLines: "Field Lines",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      north: "N",
      south: "S",
      attracted: "Attracted",
      repelled: "Repelled",
      neutral: "Neutral",
      formula: "Formula: F ∝ (m₁ × m₂) / r²",
      explanation: "Physical Explanation",
      ferromagneticExplain: "Ferromagnetic materials (Iron, Nickel, Cobalt) are strongly attracted to magnets and become temporarily magnetized",
      paramagneticExplain: "Paramagnetic materials (Aluminum, Platinum) are weakly attracted to magnets",
      diamagneticExplain: "Diamagnetic materials (Copper, Gold, Water) are weakly repelled by magnetic fields",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Calculate magnetic force based on inverse square law
  const calculateForce = useCallback(() => {
    const strengthMultiplier = materialType === "ferromagnetic" ? 1 : materialType === "paramagnetic" ? 0.1 : -0.05;
    const force = (magnetStrength * strengthMultiplier * 100) / (distance * distance);
    return force;
  }, [magnetStrength, distance, materialType]);

  const force = calculateForce();

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw magnet (bar magnet)
    const magnetX = 50;
    const magnetY = height / 2 - 40;
    const magnetWidth = 120;
    const magnetHeight = 80;

    // North pole (red)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(magnetX, magnetY, magnetWidth / 2, magnetHeight);
    
    // South pole (blue)
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(magnetX + magnetWidth / 2, magnetY, magnetWidth / 2, magnetHeight);

    // Labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t.north, magnetX + magnetWidth / 4, magnetY + magnetHeight / 2);
    ctx.fillText(t.south, magnetX + 3 * magnetWidth / 4, magnetY + magnetHeight / 2);

    // Draw magnetic field lines
    const lineCount = 8;
    ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
    ctx.lineWidth = 2;

    for (let i = 0; i < lineCount; i++) {
      const yOffset = (i - lineCount / 2 + 0.5) * 20;
      const startY = magnetY + magnetHeight / 2 + yOffset;
      
      // Right side field lines (from N to S externally)
      ctx.beginPath();
      ctx.moveTo(magnetX + magnetWidth, startY);
      
      // Bezier curve for field line
      const curveStrength = Math.abs(yOffset) * 2 + magnetStrength / 10;
      ctx.bezierCurveTo(
        magnetX + magnetWidth + curveStrength, startY - yOffset * 0.8,
        magnetX + magnetWidth + curveStrength, magnetY + magnetHeight / 2,
        magnetX + magnetWidth, magnetY + magnetHeight / 2 - yOffset
      );
      ctx.stroke();

      // Left side field lines
      ctx.beginPath();
      ctx.moveTo(magnetX, startY);
      ctx.bezierCurveTo(
        magnetX - curveStrength, startY - yOffset * 0.8,
        magnetX - curveStrength, magnetY + magnetHeight / 2,
        magnetX, magnetY + magnetHeight / 2 - yOffset
      );
      ctx.stroke();
    }

    // Draw arrows on field lines
    ctx.fillStyle = "rgba(168, 85, 247, 0.7)";
    for (let i = 0; i < 5; i++) {
      const y = magnetY + magnetHeight / 2 + (i - 2) * 20;
      const arrowX = magnetX + magnetWidth + 40;
      
      ctx.save();
      ctx.translate(arrowX, y);
      ctx.rotate(i < 2 ? Math.PI / 4 : (i > 2 ? -Math.PI / 4 : 0));
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 5);
      ctx.fill();
      ctx.restore();
    }

    // Draw test object
    const objectX = magnetX + magnetWidth + distance;
    const objectY = magnetY + magnetHeight / 2;
    
    // Object color based on material type
    const objectColor = materialType === "ferromagnetic" ? "#64748b" : 
                        materialType === "paramagnetic" ? "#94a3b8" : "#f59e0b";
    
    ctx.fillStyle = objectColor;
    ctx.beginPath();
    ctx.arc(objectX, objectY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw force arrow on object
    if (isRunning && Math.abs(force) > 0.01) {
      const arrowLength = Math.min(Math.abs(force) * 20, 80);
      const arrowDir = force > 0 ? -1 : 1; // Negative force means repulsion
      
      ctx.strokeStyle = force > 0 ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(objectX + arrowDir * 25, objectY);
      ctx.lineTo(objectX + arrowDir * (25 + arrowLength), objectY);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = force > 0 ? "#22c55e" : "#ef4444";
      ctx.beginPath();
      ctx.moveTo(objectX + arrowDir * (25 + arrowLength), objectY);
      ctx.lineTo(objectX + arrowDir * (15 + arrowLength), objectY - 8);
      ctx.lineTo(objectX + arrowDir * (15 + arrowLength), objectY + 8);
      ctx.fill();
    }

    // Draw distance indicator
    ctx.strokeStyle = "#64748b";
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(magnetX + magnetWidth, magnetY + magnetHeight + 30);
    ctx.lineTo(objectX, magnetY + magnetHeight + 30);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${distance} px`, (magnetX + magnetWidth + objectX) / 2, magnetY + magnetHeight + 45);

    // Animation for object movement
    if (isRunning) {
      const newPos = objectPosition + (force > 0 ? -2 : force < 0 ? 2 : 0);
      if (newPos > 200 && newPos < 350) {
        setObjectPosition(newPos);
      }
    }

  }, [magnetStrength, distance, materialType, isRunning, force, t, objectPosition]);

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

  const getForceStatus = () => {
    if (materialType === "ferromagnetic") return t.attracted;
    if (materialType === "paramagnetic") return t.attracted;
    return t.repelled;
  };

  const getExplanation = () => {
    if (materialType === "ferromagnetic") return t.ferromagneticExplain;
    if (materialType === "paramagnetic") return t.paramagneticExplain;
    return t.diamagneticExplain;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Magnet className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Material Type Selection */}
        <div className={`flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant={materialType === "ferromagnetic" ? "default" : "outline"} 
            onClick={() => setMaterialType("ferromagnetic")} 
            size="sm" 
            className={materialType === "ferromagnetic" ? "bg-purple-500" : ""}
          >
            {t.ferromagnetic}
          </Button>
          <Button 
            variant={materialType === "paramagnetic" ? "default" : "outline"} 
            onClick={() => setMaterialType("paramagnetic")} 
            size="sm" 
            className={materialType === "paramagnetic" ? "bg-purple-500" : ""}
          >
            {t.paramagnetic}
          </Button>
          <Button 
            variant={materialType === "diamagnetic" ? "default" : "outline"} 
            onClick={() => setMaterialType("diamagnetic")} 
            size="sm" 
            className={materialType === "diamagnetic" ? "bg-purple-500" : ""}
          >
            {t.diamagnetic}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.magnetStrength}</label>
              <Badge>{magnetStrength}%</Badge>
            </div>
            <Slider 
              value={[magnetStrength]} 
              onValueChange={([v]) => setMagnetStrength(v)} 
              min={10} 
              max={100} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.distance}</label>
              <Badge>{distance} px</Badge>
            </div>
            <Slider 
              value={[distance]} 
              onValueChange={([v]) => setDistance(v)} 
              min={50} 
              max={250} 
              step={10}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={300} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 bg-purple-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.magneticForce}</p>
            <p className="font-bold text-lg">{Math.abs(force).toFixed(4)} N</p>
            <p className="text-sm text-purple-600">{getForceStatus()}</p>
          </div>
          <div className={`p-4 bg-pink-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.formula}</p>
            <p className="text-sm font-mono mt-1">F = k(m₁m₂/r²)</p>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className={`p-4 bg-slate-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-purple-700">{t.explanation}</span>
          </div>
          <p className="text-sm text-slate-600">{getExplanation()}</p>
        </div>

        {/* Controls */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"}
          >
            {isRunning ? t.stop : t.start}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { 
              setIsRunning(false); 
              setTime(0); 
              setObjectPosition(150);
              setDistance(100);
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
