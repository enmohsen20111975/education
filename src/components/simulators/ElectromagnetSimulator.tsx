"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Zap, Magnet, Lightbulb } from "lucide-react";

interface ElectromagnetSimulatorProps {
  language: "ar" | "en";
}

export function ElectromagnetSimulator({ language }: ElectromagnetSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [current, setCurrent] = useState(5);
  const [turns, setTurns] = useState(20);
  const [coreType, setCoreType] = useState<"air" | "iron" | "steel">("iron");
  const [wireGauge, setWireGauge] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [pickedObject, setPickedObject] = useState<"none" | "nail" | "paperclip" | "coin">("none");

  const texts = {
    ar: {
      title: "محاكي المغناطيس الكهربائي",
      description: "ابني مغناطيساً كهربائياً واستكشف العوامل المؤثرة على قوته",
      current: "التيار (A)",
      turns: "عدد اللفات",
      coreType: "نوع القلب",
      wireGauge: "سمك السلك",
      air: "هواء",
      iron: "حديد",
      steel: "صلب",
      magneticField: "المجال المغناطيسي",
      fieldStrength: "قوة المجال (mT)",
      liftingCapacity: "القدرة على الرفع",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      pickNail: "مسمار",
      pickPaperclip: "دبوس ورق",
      pickCoin: "عملة معدنية",
      north: "N",
      south: "S",
      explanation: "التفسير الفيزيائي",
      formula: "المعادلة",
      formulaText: "B = μ₀ × μᵣ × n × I / L",
      whereMu: "حيث μ₀ = نفاذية الفراغ، μᵣ = النفاذية النسبية، n = عدد اللفات، I = التيار، L = الطول",
      factorsAffecting: "العوامل المؤثرة على قوة المغناطيس الكهربائي:",
      factor1: "1. التيار: زيادة التيار تزيد قوة المجال",
      factor2: "2. عدد اللفات: المزيد من اللفات = مجال أقوى",
      factor3: "3. نوع القلب: الحديد يضاعف المجال آلاف المرات",
      lifted: "تم رفعه!",
      notLifted: "لم يُرفع",
      tooHeavy: "ثقيل جداً",
    },
    en: {
      title: "Electromagnet Simulator",
      description: "Build an electromagnet and explore factors affecting its strength",
      current: "Current (A)",
      turns: "Number of Turns",
      coreType: "Core Type",
      wireGauge: "Wire Gauge",
      air: "Air",
      iron: "Iron",
      steel: "Steel",
      magneticField: "Magnetic Field",
      fieldStrength: "Field Strength (mT)",
      liftingCapacity: "Lifting Capacity",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      pickNail: "Nail",
      pickPaperclip: "Paperclip",
      pickCoin: "Coin",
      north: "N",
      south: "S",
      explanation: "Physical Explanation",
      formula: "Formula",
      formulaText: "B = μ₀ × μᵣ × n × I / L",
      whereMu: "Where μ₀ = vacuum permeability, μᵣ = relative permeability, n = turns, I = current, L = length",
      factorsAffecting: "Factors affecting electromagnet strength:",
      factor1: "1. Current: More current = stronger field",
      factor2: "2. Turns: More turns = stronger field",
      factor3: "3. Core type: Iron multiplies field thousands of times",
      lifted: "Lifted!",
      notLifted: "Not lifted",
      tooHeavy: "Too heavy",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Material permeability
  const getPermeability = () => {
    switch (coreType) {
      case "air": return 1;
      case "iron": return 5000;
      case "steel": return 100;
      default: return 1;
    }
  };

  // Calculate magnetic field strength
  const mu0 = 4 * Math.PI * 1e-7; // Vacuum permeability
  const length = 0.1; // 10 cm solenoid length
  const B = (mu0 * getPermeability() * turns * current) / length; // Tesla

  // Calculate lifting capacity (simplified)
  const getLiftingCapacity = () => {
    return B * 1000 * 10; // mT to relative capacity
  };

  // Check if object can be lifted
  const canLift = (object: string) => {
    const capacity = getLiftingCapacity();
    const objectWeight = object === "nail" ? 5 : object === "paperclip" ? 1 : object === "coin" ? 8 : 0;
    return capacity >= objectWeight;
  };

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
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw battery
    const batteryX = 50;
    const batteryY = centerY - 30;
    
    ctx.fillStyle = "#374151";
    ctx.fillRect(batteryX, batteryY, 40, 60);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(batteryX + 5, batteryY - 8, 30, 10);
    
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("+", batteryX + 20, batteryY + 25);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("-", batteryX + 20, batteryY + 45);

    // Draw wires connecting battery to coil
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(batteryX + 40, batteryY + 10);
    ctx.lineTo(batteryX + 80, batteryY + 10);
    ctx.lineTo(batteryX + 80, centerY - 50);
    ctx.lineTo(centerX - 100, centerY - 50);
    ctx.stroke();

    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(batteryX + 40, batteryY + 50);
    ctx.lineTo(batteryX + 80, batteryY + 50);
    ctx.lineTo(batteryX + 80, centerY + 50);
    ctx.lineTo(centerX + 100, centerY + 50);
    ctx.stroke();

    // Draw coil (solenoid)
    const coilWidth = 200;
    const coilHeight = 100;
    const coilX = centerX - coilWidth / 2;
    const coilY = centerY - coilHeight / 2;

    // Draw core
    const coreColor = coreType === "iron" ? "#64748b" : coreType === "steel" ? "#475569" : "#e2e8f0";
    ctx.fillStyle = coreColor;
    ctx.fillRect(coilX + 20, coilY + 20, coilWidth - 40, coilHeight - 40);

    // Draw coil turns
    const wireColors = isRunning ? ["#ef4444", "#f97316", "#eab308"] : ["#94a3b8", "#cbd5e1", "#e2e8f0"];
    const turnsToShow = Math.min(turns, 30);
    
    for (let i = 0; i < turnsToShow; i++) {
      const x = coilX + 15 + (i / turnsToShow) * (coilWidth - 30);
      ctx.strokeStyle = wireColors[i % wireColors.length];
      ctx.lineWidth = wireGauge + 1;
      ctx.beginPath();
      ctx.ellipse(x, centerY, 12, coilHeight / 2 - 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw magnetic field lines if running
    if (isRunning && current > 0) {
      const fieldIntensity = Math.min(B * 1000 * 2, 10);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
      ctx.lineWidth = 2;

      // Internal field lines (inside solenoid)
      for (let i = -Math.floor(fieldIntensity / 2); i <= Math.floor(fieldIntensity / 2); i++) {
        const y = centerY + i * 12;
        
        ctx.beginPath();
        ctx.moveTo(coilX - 30, y);
        ctx.lineTo(coilX + coilWidth + 30, y);
        ctx.stroke();

        // Arrow heads
        const animOffset = (time * 0.1) % 20;
        ctx.fillStyle = "rgba(168, 85, 247, 0.8)";
        
        for (let ax = coilX - 20; ax <= coilX + coilWidth + 20; ax += 40) {
          const actualX = ax + animOffset;
          if (actualX > coilX - 30 && actualX < coilX + coilWidth + 30) {
            ctx.beginPath();
            ctx.moveTo(actualX, y);
            ctx.lineTo(actualX - 6, y - 4);
            ctx.lineTo(actualX - 6, y + 4);
            ctx.fill();
          }
        }
      }

      // External field lines (curved returning)
      ctx.beginPath();
      ctx.arc(coilX + coilWidth + 20, centerY, 50 + Math.sin(time * 0.05) * 5, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(coilX - 20, centerY, 50 + Math.sin(time * 0.05) * 5, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();

      // N and S poles
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 20px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.north, coilX - 15, centerY + 6);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(t.south, coilX + coilWidth + 15, centerY + 6);
    }

    // Draw picked object
    if (pickedObject !== "none" && isRunning) {
      const objectY = centerY + coilHeight / 2 + 30 + (canLift(pickedObject) ? Math.sin(time * 0.1) * 3 : 30);
      const objectX = centerX;
      
      const lifted = canLift(pickedObject);
      
      if (lifted) {
        ctx.fillStyle = "#64748b";
      } else {
        ctx.fillStyle = "#94a3b8";
      }
      
      if (pickedObject === "nail") {
        ctx.fillRect(objectX - 4, objectY - 20, 8, 40);
        ctx.beginPath();
        ctx.arc(objectX, objectY - 20, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (pickedObject === "paperclip") {
        ctx.beginPath();
        ctx.moveTo(objectX - 10, objectY - 15);
        ctx.lineTo(objectX + 10, objectY - 15);
        ctx.lineTo(objectX + 10, objectY + 15);
        ctx.lineTo(objectX - 10, objectY + 15);
        ctx.lineTo(objectX - 10, objectY - 5);
        ctx.lineTo(objectX, objectY - 5);
        ctx.stroke();
        ctx.lineWidth = 2;
      } else if (pickedObject === "coin") {
        ctx.beginPath();
        ctx.arc(objectX, objectY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Status text
      ctx.fillStyle = lifted ? "#22c55e" : "#ef4444";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(lifted ? t.lifted : t.notLifted, objectX, objectY + 50);
    }

    // Current indicator
    if (isRunning) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(batteryX + 60, batteryY + 30, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Animated current flow
      const flowPos = (time * 2) % 100;
      ctx.fillStyle = "#22c55e";
      for (let i = 0; i < 5; i++) {
        const pos = (flowPos + i * 20) % 100;
        ctx.beginPath();
        ctx.arc(batteryX + 80, batteryY + 10 + pos * 0.4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

  }, [current, turns, coreType, wireGauge, isRunning, time, pickedObject, B, t]);

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

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Magnet className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Core Type Selection */}
        <div className={`flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant={coreType === "air" ? "default" : "outline"} 
            onClick={() => setCoreType("air")} 
            size="sm" 
            className={coreType === "air" ? "bg-amber-500" : ""}
          >
            {t.air}
          </Button>
          <Button 
            variant={coreType === "iron" ? "default" : "outline"} 
            onClick={() => setCoreType("iron")} 
            size="sm" 
            className={coreType === "iron" ? "bg-amber-500" : ""}
          >
            {t.iron}
          </Button>
          <Button 
            variant={coreType === "steel" ? "default" : "outline"} 
            onClick={() => setCoreType("steel")} 
            size="sm" 
            className={coreType === "steel" ? "bg-amber-500" : ""}
          >
            {t.steel}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.current}</label>
              <Badge>{current} A</Badge>
            </div>
            <Slider 
              value={[current]} 
              onValueChange={([v]) => setCurrent(v)} 
              min={0.5} 
              max={15} 
              step={0.5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.turns}</label>
              <Badge>{turns}</Badge>
            </div>
            <Slider 
              value={[turns]} 
              onValueChange={([v]) => setTurns(v)} 
              min={5} 
              max={100} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.wireGauge}</label>
              <Badge>{wireGauge} mm</Badge>
            </div>
            <Slider 
              value={[wireGauge]} 
              onValueChange={([v]) => setWireGauge(v)} 
              min={0.5} 
              max={3} 
              step={0.5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Object Selection */}
        <div className={`flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant={pickedObject === "nail" ? "default" : "outline"} 
            onClick={() => setPickedObject("nail")} 
            size="sm" 
            className={pickedObject === "nail" ? "bg-slate-500" : ""}
          >
            {t.pickNail}
          </Button>
          <Button 
            variant={pickedObject === "paperclip" ? "default" : "outline"} 
            onClick={() => setPickedObject("paperclip")} 
            size="sm" 
            className={pickedObject === "paperclip" ? "bg-slate-500" : ""}
          >
            {t.pickPaperclip}
          </Button>
          <Button 
            variant={pickedObject === "coin" ? "default" : "outline"} 
            onClick={() => setPickedObject("coin")} 
            size="sm" 
            className={pickedObject === "coin" ? "bg-slate-500" : ""}
          >
            {t.pickCoin}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={300} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-3 bg-amber-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.fieldStrength}</p>
            <p className="font-bold text-lg">{(B * 1000).toFixed(2)}</p>
          </div>
          <div className={`p-3 bg-orange-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.liftingCapacity}</p>
            <p className="font-bold text-lg">{getLiftingCapacity().toFixed(1)}</p>
          </div>
          <div className={`p-3 bg-yellow-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.formula}</p>
            <p className="font-mono text-sm">B = μnI/L</p>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className={`p-4 bg-amber-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="font-medium text-amber-700">{t.explanation}</span>
          </div>
          <p className="text-sm text-slate-600 mb-2">{t.formulaText}</p>
          <p className="text-xs text-slate-500 mb-3">{t.whereMu}</p>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>{t.factor1}</li>
            <li>{t.factor2}</li>
            <li>{t.factor3}</li>
          </ul>
        </div>

        {/* Controls */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}
          >
            <Zap className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {isRunning ? t.stop : t.start}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { 
              setIsRunning(false); 
              setTime(0);
              setPickedObject("none");
              setCurrent(5);
              setTurns(20);
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
