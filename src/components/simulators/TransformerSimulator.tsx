"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Zap, ArrowUpDown, Lightbulb, Activity } from "lucide-react";

interface TransformerSimulatorProps {
  language: "ar" | "en";
}

export function TransformerSimulator({ language }: TransformerSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [primaryVoltage, setPrimaryVoltage] = useState(220);
  const [primaryTurns, setPrimaryTurns] = useState(100);
  const [secondaryTurns, setSecondaryTurns] = useState(50);
  const [coreType, setCoreType] = useState<"closed" | "open">("closed");
  const [frequency, setFrequency] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي المحول الكهربائي",
      description: "استكشف مبدأ عمل المحول الكهربائي والعلاقة بين اللفات والجهد",
      primaryVoltage: "جهد الملف الابتدائي (V)",
      primaryTurns: "لفات الملف الابتدائي",
      secondaryTurns: "لفات الملف الثانوي",
      coreType: "نوع القلب",
      closedCore: "مغلق",
      openCore: "مفتوح",
      frequency: "التردد (Hz)",
      secondaryVoltage: "جهد الملف الثانوي",
      turnsRatio: "نسبة التحويل",
      transformerType: "نوع المحول",
      stepDown: "خافض",
      stepUp: "رافع",
      isolation: "عزل",
      efficiency: "الكفاءة",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      primary: "ابتدائي",
      secondary: "ثانوي",
      input: "دخل",
      output: "خرج",
      explanation: "التفسير الفيزيائي",
      formula: "المعادلة الأساسية",
      formulaText: "V₁/V₂ = N₁/N₂ = I₂/I₁",
      stepDownExplain: "محول خافض: عدد لفات الثانوي أقل من الابتدائي، فينتج جهد أقل وتيار أعلى",
      stepUpExplain: "محول رافع: عدد لفات الثانوي أكثر من الابتدائي، فينتج جهد أعلى وتيار أقل",
      powerConservation: "الحفاظ على القدرة: P₁ ≈ P₂ (بافتراض كفاءة 100%)",
    },
    en: {
      title: "Transformer Simulator",
      description: "Explore transformer principle and the relationship between turns and voltage",
      primaryVoltage: "Primary Voltage (V)",
      primaryTurns: "Primary Turns",
      secondaryTurns: "Secondary Turns",
      coreType: "Core Type",
      closedCore: "Closed",
      openCore: "Open",
      frequency: "Frequency (Hz)",
      secondaryVoltage: "Secondary Voltage",
      turnsRatio: "Turns Ratio",
      transformerType: "Transformer Type",
      stepDown: "Step-down",
      stepUp: "Step-up",
      isolation: "Isolation",
      efficiency: "Efficiency",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      primary: "Primary",
      secondary: "Secondary",
      input: "Input",
      output: "Output",
      explanation: "Physical Explanation",
      formula: "Fundamental Formula",
      formulaText: "V₁/V₂ = N₁/N₂ = I₂/I₁",
      stepDownExplain: "Step-down transformer: Secondary has fewer turns, producing lower voltage and higher current",
      stepUpExplain: "Step-up transformer: Secondary has more turns, producing higher voltage and lower current",
      powerConservation: "Power conservation: P₁ ≈ P₂ (assuming 100% efficiency)",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Calculate transformer values
  const turnsRatio = primaryTurns / secondaryTurns;
  const secondaryVoltage = primaryVoltage / turnsRatio;
  const primaryCurrent = 1; // Assume 1A for calculation
  const secondaryCurrent = primaryCurrent * turnsRatio;
  const efficiency = coreType === "closed" ? 98 : 75;

  const getTransformerType = () => {
    if (turnsRatio > 1.1) return t.stepDown;
    if (turnsRatio < 0.9) return t.stepUp;
    return t.isolation;
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

    // Draw iron core
    const coreWidth = 300;
    const coreHeight = 150;
    const coreX = centerX - coreWidth / 2;
    const coreY = centerY - coreHeight / 2;

    if (coreType === "closed") {
      // Closed core (rectangular)
      ctx.fillStyle = "#64748b";
      // Left vertical
      ctx.fillRect(coreX, coreY, 30, coreHeight);
      // Right vertical
      ctx.fillRect(coreX + coreWidth - 30, coreY, 30, coreHeight);
      // Top horizontal
      ctx.fillRect(coreX, coreY, coreWidth, 25);
      // Bottom horizontal
      ctx.fillRect(coreX, coreY + coreHeight - 25, coreWidth, 25);
    } else {
      // Open core (U-shaped)
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(coreX, coreY, 30, coreHeight);
      ctx.fillRect(coreX + coreWidth - 30, coreY, 30, coreHeight);
    }

    // Draw primary coil (left side)
    const primaryCoilX = coreX + 50;
    const primaryCoilY = centerY - 40;
    const primaryCoilHeight = 80;
    
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    const primaryTurnsToShow = Math.min(primaryTurns / 5, 20);
    
    for (let i = 0; i < primaryTurnsToShow; i++) {
      const y = primaryCoilY + (i / primaryTurnsToShow) * primaryCoilHeight;
      ctx.beginPath();
      ctx.ellipse(primaryCoilX, y, 25, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw secondary coil (right side)
    const secondaryCoilX = coreX + coreWidth - 50;
    const secondaryCoilY = centerY - 40;
    const secondaryCoilHeight = 80;
    
    ctx.strokeStyle = "#3b82f6";
    const secondaryTurnsToShow = Math.min(secondaryTurns / 5, 20);
    
    for (let i = 0; i < secondaryTurnsToShow; i++) {
      const y = secondaryCoilY + (i / secondaryTurnsToShow) * secondaryCoilHeight;
      ctx.beginPath();
      ctx.ellipse(secondaryCoilX, y, 25, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw magnetic flux lines
    if (isRunning) {
      const animOffset = (time * 0.05) % 30;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 5; i++) {
        const yOffset = (i - 2) * 15;
        const fluxX = coreX + 30 + ((animOffset + i * 6) % (coreWidth - 60));
        
        // Draw flux arrow
        ctx.beginPath();
        ctx.moveTo(fluxX, centerY + yOffset - 30);
        ctx.lineTo(fluxX, centerY + yOffset + 30);
        ctx.stroke();
        
        // Arrow head
        ctx.fillStyle = "rgba(168, 85, 247, 0.8)";
        ctx.beginPath();
        ctx.moveTo(fluxX, centerY + yOffset + 30);
        ctx.lineTo(fluxX - 5, centerY + yOffset + 22);
        ctx.lineTo(fluxX + 5, centerY + yOffset + 22);
        ctx.fill();
      }
    }

    // Draw AC source symbol (left)
    const sourceX = 50;
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sourceX, centerY, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // AC wave in circle
    ctx.beginPath();
    ctx.moveTo(sourceX - 15, centerY);
    for (let i = 0; i <= 30; i++) {
      const x = sourceX - 15 + i;
      const y = centerY + 10 * Math.sin((i / 15) * Math.PI);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw wires from source to primary
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(sourceX + 25, centerY - 15);
    ctx.lineTo(primaryCoilX - 35, centerY - 15);
    ctx.lineTo(primaryCoilX - 35, primaryCoilY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(sourceX + 25, centerY + 15);
    ctx.lineTo(primaryCoilX - 35, centerY + 15);
    ctx.lineTo(primaryCoilX - 35, primaryCoilY + primaryCoilHeight);
    ctx.stroke();

    // Draw load symbol (right)
    const loadX = width - 50;
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(loadX - 15, centerY - 20, 30, 40);
    ctx.stroke();
    
    // Resistor zigzag
    ctx.beginPath();
    ctx.moveTo(loadX - 10, centerY - 15);
    for (let i = 0; i < 6; i++) {
      const y = centerY - 15 + i * 6;
      ctx.lineTo(loadX + (i % 2 === 0 ? 10 : -10), y);
    }
    ctx.stroke();

    // Draw wires from secondary to load
    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(secondaryCoilX + 35, primaryCoilY);
    ctx.lineTo(loadX - 35, primaryCoilY);
    ctx.lineTo(loadX - 35, centerY - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(secondaryCoilX + 35, primaryCoilY + primaryCoilHeight);
    ctx.lineTo(loadX - 35, primaryCoilY + primaryCoilHeight);
    ctx.lineTo(loadX - 35, centerY + 20);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${t.primary} (${primaryTurns})`, primaryCoilX, centerY + 65);
    
    ctx.fillStyle = "#3b82f6";
    ctx.fillText(`${t.secondary} (${secondaryTurns})`, secondaryCoilX, centerY + 65);

    // Voltage labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "11px system-ui";
    ctx.fillText(`${primaryVoltage}V`, sourceX, centerY + 45);
    ctx.fillText(`${secondaryVoltage.toFixed(1)}V`, loadX, centerY + 45);

  }, [primaryVoltage, primaryTurns, secondaryTurns, coreType, isRunning, time, t]);

  const drawGraph = useCallback(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, height - 20);
    ctx.lineTo(width - 10, height - 20);
    ctx.stroke();

    // Draw sine waves for primary and secondary voltage
    const primaryAmp = 30;
    const secondaryAmp = primaryAmp / turnsRatio;

    // Primary voltage (red)
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 40; x < width - 10; x++) {
      const phase = isRunning ? time * 0.05 : 0;
      const y = height / 2 + primaryAmp * Math.sin((x - 40) * 0.05 + phase);
      if (x === 40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary voltage (blue)
    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();
    for (let x = 40; x < width - 10; x++) {
      const phase = isRunning ? time * 0.05 : 0;
      const y = height / 2 + secondaryAmp * Math.sin((x - 40) * 0.05 + phase);
      if (x === 40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Legend
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(50, 15, 15, 3);
    ctx.fillStyle = "#1e293b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`V₁ (${primaryVoltage}V)`, 70, 18);
    
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(150, 15, 15, 3);
    ctx.fillText(`V₂ (${secondaryVoltage.toFixed(1)}V)`, 170, 18);

  }, [primaryVoltage, secondaryVoltage, turnsRatio, isRunning, time]);

  useEffect(() => {
    drawCanvas();
    drawGraph();
  }, [drawCanvas, drawGraph]);

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
      <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowUpDown className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-teal-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Core Type Selection */}
        <div className={`flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant={coreType === "closed" ? "default" : "outline"} 
            onClick={() => setCoreType("closed")} 
            size="sm" 
            className={coreType === "closed" ? "bg-teal-500" : ""}
          >
            {t.closedCore}
          </Button>
          <Button 
            variant={coreType === "open" ? "default" : "outline"} 
            onClick={() => setCoreType("open")} 
            size="sm" 
            className={coreType === "open" ? "bg-teal-500" : ""}
          >
            {t.openCore}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.primaryVoltage}</label>
              <Badge>{primaryVoltage}V</Badge>
            </div>
            <Slider 
              value={[primaryVoltage]} 
              onValueChange={([v]) => setPrimaryVoltage(v)} 
              min={50} 
              max={500} 
              step={10}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.frequency}</label>
              <Badge>{frequency} Hz</Badge>
            </div>
            <Slider 
              value={[frequency]} 
              onValueChange={([v]) => setFrequency(v)} 
              min={10} 
              max={100} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.primaryTurns}</label>
              <Badge>{primaryTurns}</Badge>
            </div>
            <Slider 
              value={[primaryTurns]} 
              onValueChange={([v]) => setPrimaryTurns(v)} 
              min={10} 
              max={200} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.secondaryTurns}</label>
              <Badge>{secondaryTurns}</Badge>
            </div>
            <Slider 
              value={[secondaryTurns]} 
              onValueChange={([v]) => setSecondaryTurns(v)} 
              min={10} 
              max={200} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Main Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={280} className="w-full bg-white" />
        </div>

        {/* Graph Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={graphCanvasRef} width={500} height={100} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 bg-red-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.primaryVoltage}</p>
            <p className="font-bold text-lg text-red-600">{primaryVoltage}V</p>
          </div>
          <div className={`p-3 bg-blue-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.secondaryVoltage}</p>
            <p className="font-bold text-lg text-blue-600">{secondaryVoltage.toFixed(1)}V</p>
          </div>
          <div className={`p-3 bg-teal-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.turnsRatio}</p>
            <p className="font-bold text-lg">{turnsRatio.toFixed(2)}:1</p>
          </div>
          <div className={`p-3 bg-cyan-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.transformerType}</p>
            <p className="font-bold text-lg">{getTransformerType()}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 bg-slate-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
            <p className="text-xs text-slate-500">{t.input}</p>
            <p className="text-sm font-mono">P₁ = {primaryVoltage}V × {primaryCurrent.toFixed(2)}A = {(primaryVoltage * primaryCurrent).toFixed(0)}W</p>
          </div>
          <div className={`p-3 bg-slate-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
            <p className="text-xs text-slate-500">{t.output}</p>
            <p className="text-sm font-mono">P₂ ≈ {(primaryVoltage * primaryCurrent * efficiency / 100).toFixed(0)}W ({efficiency}%)</p>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className={`p-4 bg-teal-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Activity className="w-4 h-4 text-teal-500" />
            <span className="font-medium text-teal-700">{t.formula}</span>
          </div>
          <p className="text-sm font-mono mb-2">{t.formulaText}</p>
          <p className="text-sm text-slate-600">
            {turnsRatio > 1.1 ? t.stepDownExplain : turnsRatio < 0.9 ? t.stepUpExplain : t.powerConservation}
          </p>
        </div>

        {/* Controls */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-teal-500 hover:bg-teal-600"}
          >
            <Zap className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {isRunning ? t.stop : t.start}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { 
              setIsRunning(false); 
              setTime(0);
              setPrimaryVoltage(220);
              setPrimaryTurns(100);
              setSecondaryTurns(50);
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
