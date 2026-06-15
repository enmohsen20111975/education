"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Droplets, Plus, Minus, Thermometer, Beaker } from "lucide-react";

interface SolutionsSimulatorProps {
  language: "ar" | "en";
}

type SoluteType = "NaCl" | "sugar" | "CuSO4";

interface SoluteData {
  name: { ar: string; en: string };
  formula: string;
  color: string;
  molarMass: number;
  maxSolubility: number; // g/100mL at 25°C
  particleColor: string;
}

const solutes: Record<SoluteType, SoluteData> = {
  NaCl: {
    name: { ar: "كلوريد الصوديوم (ملح الطعام)", en: "Sodium Chloride (Table Salt)" },
    formula: "NaCl",
    color: "#f8fafc",
    molarMass: 58.44,
    maxSolubility: 36,
    particleColor: "#cbd5e1"
  },
  sugar: {
    name: { ar: "السكر (سكروز)", en: "Sugar (Sucrose)" },
    formula: "C₁₂H₂₂O₁₁",
    color: "#fef3c7",
    molarMass: 342.3,
    maxSolubility: 200,
    particleColor: "#fde68a"
  },
  CuSO4: {
    name: { ar: "كبريتات النحاس", en: "Copper Sulfate" },
    formula: "CuSO₄",
    color: "#bfdbfe",
    molarMass: 159.61,
    maxSolubility: 23,
    particleColor: "#3b82f6"
  }
};

export function SolutionsSimulator({ language }: SolutionsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [soluteType, setSoluteType] = useState<SoluteType>("NaCl");
  const [soluteMass, setSoluteMass] = useState(10); // grams
  const [waterVolume, setWaterVolume] = useState(100); // mL
  const [temperature, setTemperature] = useState(25); // °C
  const [isStirring, setIsStirring] = useState(false);
  const [dissolvedMass, setDissolvedMass] = useState(0);

  const texts = {
    ar: {
      title: "محاكي المحاليل والتركيز",
      description: "استكشف الذوبان والتركيز وتأثير الحرارة",
      solute: "المذاب",
      solvent: "المذيب (الماء)",
      mass: "الكتلة (g)",
      volume: "الحجم (mL)",
      temperature: "الحرارة (°C)",
      concentration: "التركيز المولاري (M)",
      molarity: "المولارية",
      molality: "المولالية",
      solubility: "الذوبانية",
      saturated: "محلول مشبع",
      unsaturated: "محلول غير مشبع",
      supersaturated: "محلول فوق مشبع",
      dissolved: "المذاب الذائب",
      undissolved: "المذاب غير الذائب",
      addSolute: "إضافة مذاب",
      removeSolute: "إزالة مذاب",
      addWater: "إضافة ماء",
      removeWater: "إزالة ماء",
      stir: "تقليب",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      solvationProcess: "عملية الإذابة",
      factorsAffecting: "العوامل المؤثرة على الذوبانية",
      particles: "الجزيئات",
      formula: "الصيغة",
      molarMass: "الكتلة المولية",
      maxSolubilityAtTemp: "الذوبانية القصوى عند هذه الحرارة",
      grams: "جم",
      moles: "مول",
      liters: "لتر"
    },
    en: {
      title: "Solutions and Concentration Simulator",
      description: "Explore dissolution, concentration, and temperature effects",
      solute: "Solute",
      solvent: "Solvent (Water)",
      mass: "Mass (g)",
      volume: "Volume (mL)",
      temperature: "Temperature (°C)",
      concentration: "Molar Concentration (M)",
      molarity: "Molarity",
      molality: "Molality",
      solubility: "Solubility",
      saturated: "Saturated Solution",
      unsaturated: "Unsaturated Solution",
      supersaturated: "Supersaturated Solution",
      dissolved: "Dissolved Solute",
      undissolved: "Undissolved Solute",
      addSolute: "Add Solute",
      removeSolute: "Remove Solute",
      addWater: "Add Water",
      removeWater: "Remove Water",
      stir: "Stir",
      reset: "Reset",
      explanation: "Chemical Explanation",
      solvationProcess: "Solvation Process",
      factorsAffecting: "Factors Affecting Solubility",
      particles: "Particles",
      formula: "Formula",
      molarMass: "Molar Mass",
      maxSolubilityAtTemp: "Max Solubility at This Temperature",
      grams: "g",
      moles: "mol",
      liters: "L"
    },
  };

  const t = texts[language];
  const solute = solutes[soluteType];

  // Calculate temperature-adjusted solubility (approximate)
  const tempFactor = 1 + (temperature - 25) * 0.02;
  const maxSolubility = solute.maxSolubility * tempFactor;

  // Calculate maximum mass that can dissolve
  const maxDissolvable = (maxSolubility / 100) * waterVolume;

  // Update dissolved mass when parameters change
  useEffect(() => {
    const newDissolved = Math.min(soluteMass, maxDissolvable);
    setDissolvedMass(newDissolved);
  }, [soluteMass, maxDissolvable, isStirring]);

  // Calculate concentration
  const molesDissolved = dissolvedMass / solute.molarMass;
  const volumeInLiters = waterVolume / 1000;
  const molarity = molesDissolved / volumeInLiters;

  // Calculate molality (mol/kg solvent)
  const waterMassKg = waterVolume / 1000; // Assuming density = 1 g/mL
  const molality = molesDissolved / waterMassKg;

  // Determine solution state
  const getSolutionState = () => {
    if (soluteMass <= dissolvedMass + 0.01) return "unsaturated";
    if (soluteMass > maxDissolvable) return "saturated";
    return "unsaturated";
  };

  const solutionState = getSolutionState();

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

    // Draw beaker
    const beakerX = width / 2 - 100;
    const beakerY = 30;
    const beakerWidth = 200;
    const beakerHeight = height - 80;

    // Beaker outline
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(beakerX, beakerY);
    ctx.lineTo(beakerX, beakerY + beakerHeight);
    ctx.lineTo(beakerX + beakerWidth, beakerY + beakerHeight);
    ctx.lineTo(beakerX + beakerWidth, beakerY);
    ctx.stroke();

    // Water level based on volume
    const waterHeight = (waterVolume / 200) * beakerHeight;
    const waterY = beakerY + beakerHeight - waterHeight;

    // Draw solution with color intensity based on concentration
    const intensity = Math.min(molarity / 2, 1);
    const baseColor = solute.color;
    
    ctx.fillStyle = baseColor;
    ctx.globalAlpha = 0.3 + intensity * 0.5;
    ctx.fillRect(beakerX + 3, waterY, beakerWidth - 6, waterHeight - 3);
    ctx.globalAlpha = 1;

    // Draw water surface
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(beakerX + 3, waterY);
    ctx.lineTo(beakerX + beakerWidth - 3, waterY);
    ctx.stroke();

    // Draw dissolved particles
    const time = Date.now() / 1000;
    const dissolvedParticles = Math.floor(dissolvedMass / 2);
    
    ctx.fillStyle = solute.particleColor;
    for (let i = 0; i < dissolvedParticles; i++) {
      const x = beakerX + 20 + ((i * 17 + time * 20) % (beakerWidth - 40));
      const y = waterY + 20 + ((i * 23 + time * 15) % (waterHeight - 40));
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw undissolved particles at bottom
    const undissolvedMass = soluteMass - dissolvedMass;
    const undissolvedParticles = Math.floor(undissolvedMass / 2);
    
    ctx.fillStyle = solute.particleColor;
    for (let i = 0; i < undissolvedParticles; i++) {
      const x = beakerX + 20 + (i * 15) % (beakerWidth - 40);
      const y = beakerY + beakerHeight - 15 - Math.floor(i / 10) * 8;
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw volume markings
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "right";
    
    for (let v = 50; v <= 200; v += 50) {
      const markY = beakerY + beakerHeight - (v / 200) * beakerHeight;
      ctx.fillRect(beakerX + beakerWidth - 5, markY, 5, 1);
      ctx.fillText(`${v}`, beakerX + beakerWidth - 10, markY + 3);
    }

    // Draw thermometer
    const thermX = beakerX - 40;
    const thermY = beakerY + 50;
    
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(thermX, thermY);
    ctx.lineTo(thermX, thermY + 100);
    ctx.stroke();
    
    // Mercury level
    const mercuryHeight = (temperature / 100) * 80;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(thermX - 3, thermY + 100 - mercuryHeight, 6, mercuryHeight);
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${temperature}°C`, thermX, thermY + 115);

  }, [soluteType, soluteMass, waterVolume, temperature, dissolvedMass, molarity]);

  useEffect(() => {
    drawCanvas();
    const interval = setInterval(drawCanvas, 100);
    return () => clearInterval(interval);
  }, [drawCanvas]);

  const reset = () => {
    setSoluteMass(10);
    setWaterVolume(100);
    setTemperature(25);
    setDissolvedMass(0);
    setIsStirring(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Solute Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.solute}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(solutes).map(([key, value]) => (
              <Button
                key={key}
                variant={soluteType === key ? "default" : "outline"}
                onClick={() => { setSoluteType(key as SoluteType); reset(); }}
                size="sm"
                className={soluteType === key ? "bg-cyan-500" : ""}
              >
                <Beaker className="w-4 h-4 mr-1" />
                {language === "ar" ? value.name.ar.split("(")[0] : value.name.en.split("(")[0]}
              </Button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {solute.name[language]} ({solute.formula}) - {t.molarMass}: {solute.molarMass} g/mol
          </p>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={300} className="w-full bg-slate-50" />
        </div>

        {/* Solution State */}
        <div className={`p-3 rounded-lg text-center ${
          solutionState === "saturated" ? "bg-red-50" :
          solutionState === "supersaturated" ? "bg-purple-50" : "bg-green-50"
        }`}>
          <Badge variant="outline" className={
            solutionState === "saturated" ? "border-red-500 text-red-600" :
            solutionState === "supersaturated" ? "border-purple-500 text-purple-600" :
            "border-green-500 text-green-600"
          }>
            {t[solutionState as keyof typeof t]}
          </Badge>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solute Mass */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">{t.mass} ({t.solute.toLowerCase()})</label>
              <Badge>{soluteMass} {t.grams}</Badge>
            </div>
            <Slider
              value={[soluteMass]}
              onValueChange={([v]) => setSoluteMass(v)}
              min={1}
              max={100}
              step={1}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSoluteMass(m => Math.max(1, m - 10))}>
                <Minus className="w-3 h-3" /> {t.removeSolute}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSoluteMass(m => Math.min(100, m + 10))}>
                <Plus className="w-3 h-3" /> {t.addSolute}
              </Button>
            </div>
          </div>

          {/* Water Volume */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">{t.volume}</label>
              <Badge>{waterVolume} mL</Badge>
            </div>
            <Slider
              value={[waterVolume]}
              onValueChange={([v]) => setWaterVolume(v)}
              min={50}
              max={200}
              step={10}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setWaterVolume(v => Math.max(50, v - 25))}>
                <Minus className="w-3 h-3" /> {t.removeWater}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setWaterVolume(v => Math.min(200, v + 25))}>
                <Plus className="w-3 h-3" /> {t.addWater}
              </Button>
            </div>
          </div>
        </div>

        {/* Temperature */}
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
            onValueChange={([v]) => setTemperature(v)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-cyan-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.concentration}</p>
            <p className="font-bold text-cyan-600">{molarity.toFixed(3)} M</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.molality}</p>
            <p className="font-bold text-blue-600">{molality.toFixed(3)} m</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.dissolved}</p>
            <p className="font-bold text-green-600">{dissolvedMass.toFixed(1)} {t.grams}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.maxSolubilityAtTemp}</p>
            <p className="font-bold text-orange-600">{maxSolubility.toFixed(1)} g/100mL</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-cyan-50 rounded-lg space-y-2">
          <h4 className="font-bold flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            {t.explanation}
          </h4>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.solvationProcess}:</strong> عند إذابة المذاب في المذيب، تتغلب جزيئات المذيب
                  على قوى التجاذب بين جزيئات المذاب وتحيط بها.
                </>
              ) : (
                <>
                  <strong>{t.solvationProcess}:</strong> When dissolving solute in solvent, solvent molecules
                  overcome attractive forces between solute molecules and surround them.
                </>
              )}
            </p>
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.factorsAffecting}:</strong>
                  <br />• الحرارة: زيادة الحرارة تزيد الذوبانية للمواد الصلبة عادةً
                  <br />• الطبيعة الكيميائية: "المثل يذيب المثل"
                  <br />• الضغط: يؤثر على غازات المذابات
                </>
              ) : (
                <>
                  <strong>{t.factorsAffecting}:</strong>
                  <br />• Temperature: Higher temperature usually increases solubility for solids
                  <br />• Chemical nature: "Like dissolves like"
                  <br />• Pressure: Affects gaseous solutes
                </>
              )}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
