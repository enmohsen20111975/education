"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Scale, Play, Pause, Plus, Minus, Thermometer, Gauge } from "lucide-react";

interface ChemicalEquilibriumSimulatorProps {
  language: "ar" | "en";
}

export function ChemicalEquilibriumSimulator({ language }: ChemicalEquilibriumSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Equilibrium: N₂ + 3H₂ ⇌ 2NH₃ (Haber process)
  const [concentrationN2, setConcentrationN2] = useState(1.0);
  const [concentrationH2, setConcentrationH2] = useState(3.0);
  const [concentrationNH3, setConcentrationNH3] = useState(0.5);
  const [temperature, setTemperature] = useState(400);
  const [pressure, setPressure] = useState(200);
  const [isRunning, setIsRunning] = useState(false);
  const [equilibriumReached, setEquilibriumReached] = useState(false);

  const texts = {
    ar: {
      title: "محاكي التوازن الكيميائي",
      description: "استكشف مبدأ لوشاتيليه والتفاعل العكوس",
      equation: "N₂ + 3H₂ ⇌ 2NH₃",
      equationName: "تفاعل هابر (صناعة الأمونيا)",
      nitrogen: "النيتروجين (N₂)",
      hydrogen: "الهيدروجين (H₂)",
      ammonia: "الأمونيا (NH₃)",
      concentration: "التركيز (mol/L)",
      temperature: "الحرارة (°C)",
      pressure: "الضغط (atm)",
      equilibriumConstant: "ثابت التوازن (Kc)",
      reactionQuotient: "حاصل التفاعل (Q)",
      forwardRate: "سرعة التفاعل الأمامي",
      reverseRate: "سرعة التفاعل العكسي",
      addN2: "إضافة N₂",
      addH2: "إضافة H₂",
      addNH3: "إضافة NH₃",
      removeN2: "إزالة N₂",
      removeH2: "إزالة H₂",
      removeNH3: "إزالة NH₃",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      leChatelier: "مبدأ لوشاتيليه",
      equilibriumState: "حالة التوازن",
      shiftsRight: "التفاعل يتجه لليمين",
      shiftsLeft: "التفاعل يتجه لليسار",
      atEquilibrium: "في حالة توازن",
      explanation: "التفسير الكيميائي",
      exothermicForward: "التفاعل الأمامي طارد للحرارة",
      increaseTempShift: "زيادة الحرارة تُزيح التوازن لليسار",
      decreaseTempShift: "تقليل الحرارة تُزيح التوازن لليمين",
      increasePressureShift: "زيادة الضغط تُزيح التوازن نحو جانب موالات أقل",
      decreasePressureShift: "تقليل الضغط تُزيح التوازن نحو جانب موالات أكثر",
      moles: "مولات"
    },
    en: {
      title: "Chemical Equilibrium Simulator",
      description: "Explore Le Chatelier's principle and reversible reactions",
      equation: "N₂ + 3H₂ ⇌ 2NH₃",
      equationName: "Haber Process (Ammonia Synthesis)",
      nitrogen: "Nitrogen (N₂)",
      hydrogen: "Hydrogen (H₂)",
      ammonia: "Ammonia (NH₃)",
      concentration: "Concentration (mol/L)",
      temperature: "Temperature (°C)",
      pressure: "Pressure (atm)",
      equilibriumConstant: "Equilibrium Constant (Kc)",
      reactionQuotient: "Reaction Quotient (Q)",
      forwardRate: "Forward Reaction Rate",
      reverseRate: "Reverse Reaction Rate",
      addN2: "Add N₂",
      addH2: "Add H₂",
      addNH3: "Add NH₃",
      removeN2: "Remove N₂",
      removeH2: "Remove H₂",
      removeNH3: "Remove NH₃",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      leChatelier: "Le Chatelier's Principle",
      equilibriumState: "Equilibrium State",
      shiftsRight: "Reaction shifts right",
      shiftsLeft: "Reaction shifts left",
      atEquilibrium: "At equilibrium",
      explanation: "Chemical Explanation",
      exothermicForward: "Forward reaction is exothermic",
      increaseTempShift: "Increasing temperature shifts equilibrium left",
      decreaseTempShift: "Decreasing temperature shifts equilibrium right",
      increasePressureShift: "Increasing pressure shifts equilibrium toward fewer moles",
      decreasePressureShift: "Decreasing pressure shifts equilibrium toward more moles",
      moles: "moles"
    },
  };

  const t = texts[language];

  // Calculate Kc (temperature dependent - simplified)
  const Kc = Math.exp(-(-92000 + 200 * (temperature - 298)) / (8.314 * (temperature + 273.15))) * 1000;
  
  // Calculate Q (reaction quotient)
  const Q = concentrationNH3 ** 2 / (concentrationN2 * concentrationH2 ** 3);

  // Determine shift direction
  const getShiftDirection = () => {
    const ratio = Q / Kc;
    if (Math.abs(ratio - 1) < 0.05) return "equilibrium";
    return ratio < 1 ? "right" : "left";
  };

  const shiftDirection = getShiftDirection();

  // Calculate rates
  const forwardRate = 0.1 * concentrationN2 * concentrationH2 ** 3;
  const reverseRate = 0.01 * concentrationNH3 ** 2;

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

    const time = Date.now() / 1000;

    // Draw reaction container
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(30, 30, width - 60, height - 80, 10);
    ctx.stroke();

    // Draw molecule visualization
    const moleculeY = height / 2 - 20;
    
    // N₂ molecules (blue)
    const n2Count = Math.ceil(concentrationN2 * 5);
    ctx.fillStyle = "#3b82f6";
    for (let i = 0; i < n2Count; i++) {
      const x = 70 + (i % 5) * 35 + Math.sin(time * 2 + i) * 5;
      const y = moleculeY - 40 + Math.floor(i / 5) * 35 + Math.cos(time * 2 + i) * 5;
      drawMolecule(ctx, x, y, "N₂", "#3b82f6", 15);
    }

    // H₂ molecules (red)
    const h2Count = Math.ceil(concentrationH2 * 2);
    ctx.fillStyle = "#ef4444";
    for (let i = 0; i < Math.min(h2Count, 15); i++) {
      const x = 250 + (i % 6) * 30 + Math.sin(time * 2.5 + i) * 5;
      const y = moleculeY - 50 + Math.floor(i / 6) * 30 + Math.cos(time * 2.5 + i) * 5;
      drawMolecule(ctx, x, y, "H₂", "#ef4444", 12);
    }

    // NH₃ molecules (green)
    const nh3Count = Math.ceil(concentrationNH3 * 5);
    ctx.fillStyle = "#22c55e";
    for (let i = 0; i < nh3Count; i++) {
      const x = 420 + (i % 4) * 40 + Math.sin(time * 1.5 + i) * 5;
      const y = moleculeY - 40 + Math.floor(i / 4) * 40 + Math.cos(time * 1.5 + i) * 5;
      drawMolecule(ctx, x, y, "NH₃", "#22c55e", 15);
    }

    // Draw equilibrium arrows
    const arrowY = height - 60;
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    
    // Forward arrow
    ctx.beginPath();
    ctx.moveTo(150, arrowY);
    ctx.lineTo(350, arrowY);
    ctx.lineTo(340, arrowY - 8);
    ctx.moveTo(350, arrowY);
    ctx.lineTo(340, arrowY + 8);
    ctx.stroke();
    
    // Forward rate label
    ctx.fillStyle = forwardRate > reverseRate ? "#22c55e" : "#64748b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`→ ${forwardRate.toFixed(3)}`, 250, arrowY - 15);

    // Reverse arrow
    ctx.beginPath();
    ctx.moveTo(350, arrowY + 20);
    ctx.lineTo(150, arrowY + 20);
    ctx.lineTo(160, arrowY + 12);
    ctx.moveTo(150, arrowY + 20);
    ctx.lineTo(160, arrowY + 28);
    ctx.stroke();
    
    // Reverse rate label
    ctx.fillStyle = reverseRate > forwardRate ? "#ef4444" : "#64748b";
    ctx.fillText(`← ${reverseRate.toFixed(3)}`, 250, arrowY + 45);

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.nitrogen, 120, 50);
    ctx.fillText(t.hydrogen, 300, 50);
    ctx.fillText(t.ammonia, 480, 50);

  }, [concentrationN2, concentrationH2, concentrationNH3, temperature, language, t, forwardRate, reverseRate]);

  const drawMolecule = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    symbol: string,
    color: string,
    size: number
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size * 0.7}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol, x, y);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Simulate equilibrium shift
  useEffect(() => {
    if (isRunning && !equilibriumReached) {
      const interval = setInterval(() => {
        const direction = getShiftDirection();
        
        if (direction === "equilibrium") {
          setEquilibriumReached(true);
          setIsRunning(false);
          return;
        }

        const step = 0.02;
        
        if (direction === "right") {
          // Shift right: consume N₂ and H₂, produce NH₃
          setConcentrationN2(c => Math.max(0.1, c - step * 0.5));
          setConcentrationH2(c => Math.max(0.1, c - step * 1.5));
          setConcentrationNH3(c => Math.min(5, c + step));
        } else {
          // Shift left: produce N₂ and H₂, consume NH₃
          setConcentrationN2(c => Math.min(3, c + step * 0.5));
          setConcentrationH2(c => Math.min(9, c + step * 1.5));
          setConcentrationNH3(c => Math.max(0.1, c - step));
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, equilibriumReached, Q, Kc]);

  const reset = () => {
    setConcentrationN2(1.0);
    setConcentrationH2(3.0);
    setConcentrationNH3(0.5);
    setTemperature(400);
    setPressure(200);
    setIsRunning(false);
    setEquilibriumReached(false);
  };

  const adjustConcentration = (substance: "N2" | "H2" | "NH3", delta: number) => {
    setEquilibriumReached(false);
    switch (substance) {
      case "N2":
        setConcentrationN2(c => Math.max(0.1, Math.min(3, c + delta)));
        break;
      case "H2":
        setConcentrationH2(c => Math.max(0.1, Math.min(9, c + delta)));
        break;
      case "NH3":
        setConcentrationNH3(c => Math.max(0.1, Math.min(5, c + delta)));
        break;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Equation Display */}
        <div className="p-4 bg-slate-100 rounded-lg text-center">
          <p className="text-2xl font-mono font-bold">{t.equation}</p>
          <p className="text-sm text-slate-600 mt-1">{t.equationName}</p>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={250} className="w-full bg-slate-50" />
        </div>

        {/* Equilibrium Status */}
        <div className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
          equilibriumReached ? "bg-green-100" : 
          shiftDirection === "right" ? "bg-blue-100" : 
          shiftDirection === "left" ? "bg-red-100" : "bg-slate-100"
        }`}>
          <Badge variant={equilibriumReached ? "default" : "secondary"} 
            className={equilibriumReached ? "bg-green-500" : ""}>
            {equilibriumReached ? t.atEquilibrium : 
              shiftDirection === "right" ? t.shiftsRight : t.shiftsLeft}
          </Badge>
        </div>

        {/* Concentration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{t.nitrogen}</label>
              <Badge variant="outline" style={{ borderColor: "#3b82f6", color: "#3b82f6" }}>
                {concentrationN2.toFixed(2)} M
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => adjustConcentration("N2", -0.5)}>
                <Minus className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => adjustConcentration("N2", 0.5)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{t.hydrogen}</label>
              <Badge variant="outline" style={{ borderColor: "#ef4444", color: "#ef4444" }}>
                {concentrationH2.toFixed(2)} M
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => adjustConcentration("H2", -0.5)}>
                <Minus className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => adjustConcentration("H2", 0.5)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{t.ammonia}</label>
              <Badge variant="outline" style={{ borderColor: "#22c55e", color: "#22c55e" }}>
                {concentrationNH3.toFixed(2)} M
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => adjustConcentration("NH3", -0.5)}>
                <Minus className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => adjustConcentration("NH3", 0.5)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Temperature and Pressure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                {t.temperature}
              </label>
              <Badge>{temperature}°C</Badge>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => { setTemperature(v); setEquilibriumReached(false); }}
              min={200}
              max={600}
              step={25}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                {t.pressure}
              </label>
              <Badge>{pressure} atm</Badge>
            </div>
            <Slider
              value={[pressure]}
              onValueChange={([v]) => { setPressure(v); setEquilibriumReached(false); }}
              min={50}
              max={400}
              step={25}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-rose-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.equilibriumConstant}</p>
            <p className="font-bold text-rose-600">{Kc.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.reactionQuotient}</p>
            <p className="font-bold text-pink-600">{Q.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.forwardRate}</p>
            <p className="font-bold text-green-600">{forwardRate.toFixed(4)}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.reverseRate}</p>
            <p className="font-bold text-blue-600">{reverseRate.toFixed(4)}</p>
          </div>
        </div>

        {/* Le Chatelier Explanation */}
        <div className="p-4 bg-rose-50 rounded-lg space-y-2">
          <h4 className="font-bold flex items-center gap-2">
            <Scale className="w-4 h-4" />
            {t.leChatelier}
          </h4>
          <div className="text-sm text-slate-600 space-y-1">
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.exothermicForward}:</strong> ΔH = -92 kJ/mol
                </>
              ) : (
                <>
                  <strong>{t.exothermicForward}:</strong> ΔH = -92 kJ/mol
                </>
              )}
            </p>
            <p>
              {temperature > 450 ? t.increaseTempShift : temperature < 350 ? t.decreaseTempShift : ""}
            </p>
            <p>
              {pressure > 250 ? t.increasePressureShift : pressure < 150 ? t.decreasePressureShift : ""}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {language === "ar" 
                ? "ملاحظة: 4 مولات متفاعلات ← 2 مولات نواتج"
                : "Note: 4 moles reactants → 2 moles products"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRunning(!isRunning)} className="bg-rose-500 hover:bg-rose-600">
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
