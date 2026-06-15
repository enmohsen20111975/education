"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, FlaskConical, Droplets, Plus, Minus, Beaker } from "lucide-react";

interface AcidsBasesSimulatorProps {
  language: "ar" | "en";
}

interface Substance {
  name: { ar: string; en: string };
  formula: string;
  type: "acid" | "base" | "neutral";
  strength: "strong" | "weak";
  color: string;
  defaultPH: number;
}

const substances: Record<string, Substance> = {
  hcl: {
    name: { ar: "حمض الهيدروكلوريك", en: "Hydrochloric Acid" },
    formula: "HCl",
    type: "acid",
    strength: "strong",
    color: "#ef4444",
    defaultPH: 1
  },
  h2so4: {
    name: { ar: "حمض الكبريتيك", en: "Sulfuric Acid" },
    formula: "H₂SO₄",
    type: "acid",
    strength: "strong",
    color: "#dc2626",
    defaultPH: 0.5
  },
  ch3cooh: {
    name: { ar: "حمض الخليك (الخل)", en: "Acetic Acid (Vinegar)" },
    formula: "CH₃COOH",
    type: "acid",
    strength: "weak",
    color: "#f97316",
    defaultPH: 3
  },
  naoh: {
    name: { ar: "هيدروكسيد الصوديوم", en: "Sodium Hydroxide" },
    formula: "NaOH",
    type: "base",
    strength: "strong",
    color: "#3b82f6",
    defaultPH: 14
  },
  nh3: {
    name: { ar: "الأمونيا", en: "Ammonia" },
    formula: "NH₃",
    type: "base",
    strength: "weak",
    color: "#06b6d4",
    defaultPH: 11
  },
  h2o: {
    name: { ar: "الماء المقطر", en: "Distilled Water" },
    formula: "H₂O",
    type: "neutral",
    strength: "neutral",
    color: "#22c55e",
    defaultPH: 7
  }
};

// pH indicator colors
const getPHColor = (pH: number): string => {
  if (pH < 3) return "#ef4444"; // Red
  if (pH < 5) return "#f97316"; // Orange
  if (pH < 6) return "#eab308"; // Yellow
  if (pH < 8) return "#22c55e"; // Green
  if (pH < 10) return "#06b6d4"; // Cyan
  if (pH < 12) return "#3b82f6"; // Blue
  return "#8b5cf6"; // Purple
};

export function AcidsBasesSimulator({ language }: AcidsBasesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedSubstance, setSelectedSubstance] = useState<string>("hcl");
  const [concentration, setConcentration] = useState(0.1); // Molar
  const [volume, setVolume] = useState(50); // mL
  const [titrant, setTitrant] = useState<"NaOH" | "HCl">("NaOH");
  const [titrantVolume, setTitrantVolume] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);

  const texts = {
    ar: {
      title: "محاكي الأحماض والقواعد وpH",
      description: "استكشف الأحماض والقواعد وقياس pH والمعايرة",
      selectSubstance: "اختر المادة",
      concentration: "التركيز (M)",
      volume: "الحجم (mL)",
      pH: "الرقم الهيدروجيني (pH)",
      pOH: "الرقم الهيدروكسي (pOH)",
      hIon: "تركيز H⁺",
      ohIon: "تركيز OH⁻",
      acid: "حمض",
      base: "قاعدة",
      neutral: "محايد",
      strong: "قوي",
      weak: "ضعيف",
      acidic: "حمضي",
      basic: "قاعدي",
      neutralSolution: "محايد",
      titration: "المعايرة",
      addTitrant: "إضافة المعاير",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      phScale: "مقياس pH",
      arrheniusTheory: "نظرية أرهينيوس",
      bronstedTheory: "نظرية برونستد-لوري",
      indicator: "الكاشف",
      showIndicator: "إظهار الكاشف",
      equivalencePoint: "نقطة التكافؤ",
      moles: "مول",
      molar: "مولار"
    },
    en: {
      title: "Acids, Bases, and pH Simulator",
      description: "Explore acids, bases, pH measurement, and titration",
      selectSubstance: "Select Substance",
      concentration: "Concentration (M)",
      volume: "Volume (mL)",
      pH: "pH Value",
      pOH: "pOH Value",
      hIon: "H⁺ Concentration",
      ohIon: "OH⁻ Concentration",
      acid: "Acid",
      base: "Base",
      neutral: "Neutral",
      strong: "Strong",
      weak: "Weak",
      acidic: "Acidic",
      basic: "Basic",
      neutralSolution: "Neutral",
      titration: "Titration",
      addTitrant: "Add Titrant",
      reset: "Reset",
      explanation: "Chemical Explanation",
      phScale: "pH Scale",
      arrheniusTheory: "Arrhenius Theory",
      bronstedTheory: "Brønsted-Lowry Theory",
      indicator: "Indicator",
      showIndicator: "Show Indicator",
      equivalencePoint: "Equivalence Point",
      moles: "mol",
      molar: "M"
    },
  };

  const t = texts[language];
  const substance = substances[selectedSubstance];

  // Calculate pH based on substance and concentration
  const calculatePH = useCallback(() => {
    if (substance.type === "neutral") return 7;
    
    if (substance.type === "acid") {
      if (substance.strength === "strong") {
        // Strong acid: pH = -log[H+]
        return -Math.log10(concentration);
      } else {
        // Weak acid: approximate using Ka
        const Ka = substance.formula === "CH₃COOH" ? 1.8e-5 : 1e-5;
        const H = Math.sqrt(Ka * concentration);
        return -Math.log10(H);
      }
    } else {
      // Base
      if (substance.strength === "strong") {
        // Strong base: pOH = -log[OH-], pH = 14 - pOH
        const pOH = -Math.log10(concentration);
        return 14 - pOH;
      } else {
        // Weak base
        const Kb = substance.formula === "NH₃" ? 1.8e-5 : 1e-5;
        const OH = Math.sqrt(Kb * concentration);
        const pOH = -Math.log10(OH);
        return 14 - pOH;
      }
    }
  }, [substance, concentration]);

  const pH = Math.min(14, Math.max(0, calculatePH()));
  const pOH = 14 - pH;
  const H_conc = Math.pow(10, -pH);
  const OH_conc = Math.pow(10, -pOH);

  // Titration calculation
  const molesAnalyte = concentration * (volume / 1000);
  const molesTitrant = 0.1 * (titrantVolume / 1000); // 0.1 M titrant
  const equivalenceVolume = molesAnalyte / 0.1 * 1000;

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

    // Draw pH scale
    const scaleX = 50;
    const scaleY = 30;
    const scaleWidth = 60;
    const scaleHeight = height - 80;

    // Draw scale background with gradient
    for (let i = 0; i <= 14; i++) {
      const y = scaleY + (i / 14) * scaleHeight;
      ctx.fillStyle = getPHColor(i);
      ctx.fillRect(scaleX, y, scaleWidth, scaleHeight / 14);
    }

    // Scale labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "right";
    for (let i = 0; i <= 14; i++) {
      const y = scaleY + (i / 14) * scaleHeight + 5;
      ctx.fillText(`${14 - i}`, scaleX - 5, y);
    }

    // Current pH indicator
    const pHY = scaleY + ((14 - pH) / 14) * scaleHeight;
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(scaleX + scaleWidth, pHY);
    ctx.lineTo(scaleX + scaleWidth + 15, pHY - 8);
    ctx.lineTo(scaleX + scaleWidth + 15, pHY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`pH = ${pH.toFixed(2)}`, scaleX + scaleWidth + 20, pHY + 5);

    // Draw beaker with solution
    const beakerX = width / 2 + 50;
    const beakerY = 50;
    const beakerWidth = 150;
    const beakerHeight = height - 120;

    // Beaker outline
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(beakerX, beakerY);
    ctx.lineTo(beakerX, beakerY + beakerHeight);
    ctx.lineTo(beakerX + beakerWidth, beakerY + beakerHeight);
    ctx.lineTo(beakerX + beakerWidth, beakerY);
    ctx.stroke();

    // Solution color based on pH and indicator
    const solutionColor = showIndicator ? getPHColor(pH) : substance.color;
    const solutionHeight = (volume / 100) * beakerHeight;
    
    ctx.fillStyle = solutionColor;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(beakerX + 3, beakerY + beakerHeight - solutionHeight, beakerWidth - 6, solutionHeight - 3);
    ctx.globalAlpha = 1;

    // Draw ions visualization
    const time = Date.now() / 1000;
    if (substance.type === "acid" || titrant === "HCl") {
      // Draw H+ ions
      ctx.fillStyle = "#ef4444";
      const hIonCount = Math.ceil(H_conc * 100);
      for (let i = 0; i < Math.min(hIonCount, 30); i++) {
        const x = beakerX + 20 + ((i * 17 + time * 30) % (beakerWidth - 40));
        const y = beakerY + beakerHeight - solutionHeight + 20 + ((i * 23 + time * 20) % (solutionHeight - 40));
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 6px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("H⁺", x, y);
        ctx.fillStyle = "#ef4444";
      }
    }

    if (substance.type === "base" || titrant === "NaOH") {
      // Draw OH- ions
      ctx.fillStyle = "#3b82f6";
      const ohIonCount = Math.ceil(OH_conc * 100);
      for (let i = 0; i < Math.min(ohIonCount, 30); i++) {
        const x = beakerX + 20 + ((i * 19 + time * 25) % (beakerWidth - 40));
        const y = beakerY + beakerHeight - solutionHeight + 20 + ((i * 29 + time * 18) % (solutionHeight - 40));
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 5px system-ui";
        ctx.fillText("OH⁻", x, y);
        ctx.fillStyle = "#3b82f6";
      }
    }

    // Draw titration curve if titrating
    if (titrantVolume > 0) {
      const curveX = width - 180;
      const curveY = 50;
      const curveW = 150;
      const curveH = 100;

      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      ctx.strokeRect(curveX, curveY, curveW, curveH);

      // Draw titration curve
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let v = 0; v <= titrantVolume; v++) {
        const x = curveX + (v / 100) * curveW;
        let phAtV: number;

        if (substance.type === "acid") {
          if (v < equivalenceVolume) {
            phAtV = pH - (v / equivalenceVolume) * (pH - 7) * 0.5;
          } else if (Math.abs(v - equivalenceVolume) < 2) {
            phAtV = 7;
          } else {
            phAtV = 7 + ((v - equivalenceVolume) / 20) * 4;
          }
        } else {
          if (v < equivalenceVolume) {
            phAtV = pH + (v / equivalenceVolume) * (7 - pH) * 0.5;
          } else if (Math.abs(v - equivalenceVolume) < 2) {
            phAtV = 7;
          } else {
            phAtV = 7 - ((v - equivalenceVolume) / 20) * 4;
          }
        }

        const y = curveY + curveH - (phAtV / 14) * curveH;
        
        if (v === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#64748b";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.titration, curveX + curveW / 2, curveY + curveH + 15);
      ctx.fillText("mL", curveX + curveW / 2, curveY + curveH + 25);
    }

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(substance.formula, beakerX + beakerWidth / 2, beakerY - 10);

  }, [substance, concentration, volume, pH, H_conc, OH_conc, titrantVolume, titrant, showIndicator, equivalenceVolume, language, t]);

  useEffect(() => {
    drawCanvas();
    const interval = setInterval(drawCanvas, 100);
    return () => clearInterval(interval);
  }, [drawCanvas]);

  const reset = () => {
    setConcentration(0.1);
    setVolume(50);
    setTitrantVolume(0);
    setShowIndicator(false);
  };

  const getSolutionType = () => {
    if (pH < 6.5) return "acidic";
    if (pH > 7.5) return "basic";
    return "neutral";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-white/80">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Substance Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectSubstance}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(substances).map(([key, value]) => (
              <Button
                key={key}
                variant={selectedSubstance === key ? "default" : "outline"}
                onClick={() => { setSelectedSubstance(key); reset(); }}
                size="sm"
                className={selectedSubstance === key ? "" : ""}
                style={selectedSubstance === key ? { backgroundColor: value.color } : {}}
              >
                <Beaker className="w-4 h-4 mr-1" />
                {value.formula}
              </Button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {substance.name[language]} - {t[substance.type as keyof typeof t]} ({t[substance.strength as keyof typeof t]})
          </p>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={280} className="w-full bg-slate-50" />
        </div>

        {/* Solution Type Badge */}
        <div className={`p-3 rounded-lg text-center ${
          getSolutionType() === "acidic" ? "bg-red-50" :
          getSolutionType() === "basic" ? "bg-blue-50" : "bg-green-50"
        }`}>
          <Badge variant="outline" className={
            getSolutionType() === "acidic" ? "border-red-500 text-red-600" :
            getSolutionType() === "basic" ? "border-blue-500 text-blue-600" :
            "border-green-500 text-green-600"
          }>
            {t[getSolutionType() as keyof typeof t]}
          </Badge>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Concentration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">{t.concentration}</label>
              <Badge>{concentration.toFixed(3)} {t.molar}</Badge>
            </div>
            <Slider
              value={[concentration * 100]}
              onValueChange={([v]) => setConcentration(v / 100)}
              min={1}
              max={100}
              step={1}
            />
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">{t.volume}</label>
              <Badge>{volume} mL</Badge>
            </div>
            <Slider
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              min={10}
              max={100}
              step={5}
            />
          </div>
        </div>

        {/* Titration Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t.titration}</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={titrant === "NaOH" ? "default" : "outline"}
                onClick={() => { setTitrant("NaOH"); setTitrantVolume(0); }}
                className={titrant === "NaOH" ? "bg-blue-500" : ""}
              >
                NaOH
              </Button>
              <Button
                size="sm"
                variant={titrant === "HCl" ? "default" : "outline"}
                onClick={() => { setTitrant("HCl"); setTitrantVolume(0); }}
                className={titrant === "HCl" ? "bg-red-500" : ""}
              >
                HCl
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTitrantVolume(v => Math.max(0, v - 5))}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <div className="flex-1 text-center">
              <Badge variant="secondary">{titrantVolume} mL</Badge>
              <p className="text-xs text-slate-500 mt-1">
                {t.equivalencePoint}: {equivalenceVolume.toFixed(1)} mL
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTitrantVolume(v => Math.min(100, v + 5))}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Indicator Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={showIndicator ? "default" : "outline"}
            onClick={() => setShowIndicator(!showIndicator)}
            size="sm"
            className={showIndicator ? "bg-purple-500" : ""}
          >
            <Droplets className="w-4 h-4 mr-2" />
            {t.showIndicator}
          </Button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.pH}</p>
            <p className="font-bold text-red-600 text-lg">{pH.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.pOH}</p>
            <p className="font-bold text-blue-600 text-lg">{pOH.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.hIon}</p>
            <p className="font-bold text-orange-600 text-sm">{H_conc.toExponential(2)} M</p>
          </div>
          <div className="p-3 bg-cyan-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.ohIon}</p>
            <p className="font-bold text-cyan-600 text-sm">{OH_conc.toExponential(2)} M</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
          <h4 className="font-bold flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            {t.explanation}
          </h4>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.arrheniusTheory}:</strong> الحمض مادة تطلق H⁺ في الماء،
                  والقاعدة مادة تطلق OH⁻ في الماء.
                </>
              ) : (
                <>
                  <strong>{t.arrheniusTheory}:</strong> An acid releases H⁺ in water,
                  and a base releases OH⁻ in water.
                </>
              )}
            </p>
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.bronstedTheory}:</strong> الحمض مادة مانحة للبروتون،
                  والقاعدة مادة مستقبلة للبروتون.
                </>
              ) : (
                <>
                  <strong>{t.bronstedTheory}:</strong> An acid is a proton donor,
                  and a base is a proton acceptor.
                </>
              )}
            </p>
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.phScale}:</strong> pH = -log[H⁺]، حيث pH &lt; 7 حمضي،
                  pH = 7 محايد، pH &gt; 7 قاعدي.
                </>
              ) : (
                <>
                  <strong>{t.phScale}:</strong> pH = -log[H⁺], where pH &lt; 7 is acidic,
                  pH = 7 is neutral, pH &gt; 7 is basic.
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
