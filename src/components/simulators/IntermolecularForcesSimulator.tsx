"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause, Waves, Thermometer } from "lucide-react";

interface IntermolecularForcesSimulatorProps {
  language: "ar" | "en";
}

// Types of intermolecular forces
const forceTypes = {
  hydrogenBond: {
    name: { ar: "رابطة هيدروجينية", en: "Hydrogen Bond" },
    strength: 40,
    examples: ["H₂O", "NH₃", "HF"],
    description: {
      ar: "أقوى قوى تجاذب بين الجزيئات، تنشأ بين H مرتبط بـ N, O, أو F وذرة متجاورة",
      en: "Strongest intermolecular force, forms between H bonded to N, O, or F and a neighboring atom",
    },
    color: "#ef4444",
  },
  dipoleDipole: {
    name: { ar: "ثنائي قطب-ثنائي قطب", en: "Dipole-Dipole" },
    strength: 20,
    examples: ["HCl", "CO", "SO₂"],
    description: {
      ar: "تجاذب بين الجزيئات القطبية، الطرف الموجب يجذب السالب",
      en: "Attraction between polar molecules, positive end attracts negative end",
    },
    color: "#8b5cf6",
  },
  londonDispersion: {
    name: { ar: "قوى لندن-ديسبيرسون", en: "London Dispersion" },
    strength: 5,
    examples: ["All molecules", "Noble gases"],
    description: {
      ar: "أضعف القوى، موجودة في كل الجزيئات بسبب لحظية عدم تماثل الإلكترونات",
      en: "Weakest forces, present in all molecules due to temporary electron asymmetry",
    },
    color: "#3b82f6",
  },
};

// Molecules for comparison
const molecules = {
  H2O: {
    name: { ar: "ماء", en: "Water" },
    formula: "H₂O",
    forces: ["hydrogenBond", "dipoleDipole", "londonDispersion"],
    boilingPoint: 100,
    polarity: "polar",
    color: "#06b6d4",
  },
  NH3: {
    name: { ar: "أمونيا", en: "Ammonia" },
    formula: "NH₃",
    forces: ["hydrogenBond", "dipoleDipole", "londonDispersion"],
    boilingPoint: -33,
    polarity: "polar",
    color: "#22c55e",
  },
  HCl: {
    name: { ar: "كلوريد الهيدروجين", en: "Hydrogen Chloride" },
    formula: "HCl",
    forces: ["dipoleDipole", "londonDispersion"],
    boilingPoint: -85,
    polarity: "polar",
    color: "#f59e0b",
  },
  CH4: {
    name: { ar: "ميثان", en: "Methane" },
    formula: "CH₄",
    forces: ["londonDispersion"],
    boilingPoint: -161,
    polarity: "nonpolar",
    color: "#64748b",
  },
  CO2: {
    name: { ar: "ثاني أكسيد الكربون", en: "Carbon Dioxide" },
    formula: "CO₂",
    forces: ["londonDispersion"],
    boilingPoint: -78,
    polarity: "nonpolar",
    color: "#94a3b8",
  },
  HF: {
    name: { ar: "فلوريد الهيدروجين", en: "Hydrogen Fluoride" },
    formula: "HF",
    forces: ["hydrogenBond", "dipoleDipole", "londonDispersion"],
    boilingPoint: 20,
    polarity: "polar",
    color: "#ec4899",
  },
};

export function IntermolecularForcesSimulator({ language }: IntermolecularForcesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [selectedForce, setSelectedForce] = useState<keyof typeof forceTypes>("hydrogenBond");
  const [selectedMolecule, setSelectedMolecule] = useState<keyof typeof molecules>("H2O");
  const [temperature, setTemperature] = useState(25);
  const [isAnimating, setIsAnimating] = useState(true);
  const [moleculeCount, setMoleculeCount] = useState(8);
  const [showForceLines, setShowForceLines] = useState(true);

  const texts = {
    ar: {
      title: "محاكي قوى التجاذب بين الجزيئية",
      description: "استكشف قوى التجاذب بين الجزيئات وتأثيرها",
      selectForce: "اختر نوع القوة",
      selectMolecule: "اختر الجزيء",
      temperature: "الحرارة (°C)",
      moleculeCount: "عدد الجزيئات",
      boilingPoint: "درجة الغليان",
      strength: "قوة التجاذب",
      showForceLines: "إظهار خطوط القوى",
      hydrogenBond: "رابطة هيدروجينية",
      dipoleDipole: "ثنائي قطب-ثنائي قطب",
      londonDispersion: "قوى لندن",
      polar: "قطبي",
      nonpolar: "غير قطبي",
      polarity: "القطبية",
      presentForces: "القوى الموجودة",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      effectOnProperties: "التأثير على الخصائص",
      phaseState: "الحالة الفيزيائية",
      solid: "صلب",
      liquid: "سائل",
      gas: "غاز",
      intermolecularForces: "القوى بين الجزيئية",
      attractiveForces: "قوى التجاذب",
      repulsiveForces: "قوى التنافر",
    },
    en: {
      title: "Intermolecular Forces Simulator",
      description: "Explore forces between molecules and their effects",
      selectForce: "Select Force Type",
      selectMolecule: "Select Molecule",
      temperature: "Temperature (°C)",
      moleculeCount: "Number of Molecules",
      boilingPoint: "Boiling Point",
      strength: "Attraction Strength",
      showForceLines: "Show Force Lines",
      hydrogenBond: "Hydrogen Bond",
      dipoleDipole: "Dipole-Dipole",
      londonDispersion: "London Forces",
      polar: "Polar",
      nonpolar: "Nonpolar",
      polarity: "Polarity",
      presentForces: "Present Forces",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      explanation: "Chemical Explanation",
      effectOnProperties: "Effect on Properties",
      phaseState: "Phase State",
      solid: "Solid",
      liquid: "Liquid",
      gas: "Gas",
      intermolecularForces: "Intermolecular Forces",
      attractiveForces: "Attractive Forces",
      repulsiveForces: "Repulsive Forces",
    },
  };

  const t = texts[language];
  const force = forceTypes[selectedForce];
  const molecule = molecules[selectedMolecule];

  // Determine phase state based on temperature and boiling point
  const getPhaseState = () => {
    if (temperature < molecule.boilingPoint - 50) return "solid";
    if (temperature < molecule.boilingPoint) return "liquid";
    return "gas";
  };

  const phaseState = getPhaseState();

  // Calculate total force strength for the molecule
  const getTotalStrength = () => {
    return molecule.forces.reduce((sum, f) => sum + forceTypes[f].strength, 0);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background based on phase
    const bgColors = {
      solid: "#e0f2fe",
      liquid: "#dbeafe",
      gas: "#fef3c7",
    };
    ctx.fillStyle = bgColors[phaseState];
    ctx.fillRect(0, 0, width, height);

    const time = Date.now() / 1000;
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate kinetic energy based on temperature
    const kineticEnergy = temperature / 100;

    // Generate molecule positions
    const positions: { x: number; y: number; vx: number; vy: number }[] = [];
    const spacing = Math.min(width, height) / (Math.sqrt(moleculeCount) + 1);

    for (let i = 0; i < moleculeCount; i++) {
      const row = Math.floor(i / Math.ceil(Math.sqrt(moleculeCount)));
      const col = i % Math.ceil(Math.sqrt(moleculeCount));
      const baseX = 60 + col * spacing;
      const baseY = 60 + row * spacing;
      
      // Add thermal motion
      const thermalX = Math.sin(time * 3 + i * 0.5) * kineticEnergy * 15;
      const thermalY = Math.cos(time * 2.5 + i * 0.7) * kineticEnergy * 15;
      
      positions.push({
        x: baseX + thermalX,
        y: baseY + thermalY,
        vx: thermalX,
        vy: thermalY,
      });
    }

    // Draw force lines between nearby molecules
    if (showForceLines) {
      positions.forEach((pos1, i) => {
        positions.forEach((pos2, j) => {
          if (i >= j) return;
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < spacing * 1.5) {
            // Draw force line
            const forceStrength = 1 - distance / (spacing * 1.5);
            const dominantForce = molecule.forces[0];
            const forceColor = forceTypes[dominantForce].color;
            
            ctx.strokeStyle = `${forceColor}${Math.floor(forceStrength * 80).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = forceStrength * 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw hydrogen bonds specifically
            if (dominantForce === "hydrogenBond" && forceStrength > 0.5) {
              ctx.fillStyle = "#ef4444";
              ctx.font = "10px system-ui";
              ctx.textAlign = "center";
              ctx.fillText("H-bond", (pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
            }
          }
        });
      });
    }

    // Draw molecules
    positions.forEach((pos, index) => {
      const radius = 20;
      
      // Draw molecule
      const gradient = ctx.createRadialGradient(pos.x - 5, pos.y - 5, 0, pos.x, pos.y, radius);
      gradient.addColorStop(0, molecule.color);
      gradient.addColorStop(1, molecule.color + "80");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw molecule symbol
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(molecule.formula, pos.x, pos.y);
      
      // Draw dipole arrow for polar molecules
      if (molecule.polarity === "polar") {
        const arrowLength = radius + 10;
        const angle = Math.atan2(pos.vy, pos.vx);
        
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - radius);
        ctx.lineTo(pos.x, pos.y - arrowLength);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(pos.x - 4, pos.y - arrowLength + 4);
        ctx.lineTo(pos.x, pos.y - arrowLength);
        ctx.lineTo(pos.x + 4, pos.y - arrowLength + 4);
        ctx.stroke();
        
        // δ+ and δ- labels
        ctx.fillStyle = "#ef4444";
        ctx.font = "8px system-ui";
        ctx.fillText("δ+", pos.x, pos.y + radius + 8);
        ctx.fillStyle = "#3b82f6";
        ctx.fillText("δ-", pos.x, pos.y - radius - 8);
      }
    });

    // Draw temperature scale
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`${temperature}°C`, 10, height - 30);
    
    // Draw boiling point marker
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`BP: ${molecule.boilingPoint}°C`, 10, height - 15);

    // Draw phase state
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "right";
    const phaseLabels = { solid: t.solid, liquid: t.liquid, gas: t.gas };
    ctx.fillText(phaseLabels[phaseState], width - 10, height - 20);

  }, [selectedForce, selectedMolecule, temperature, moleculeCount, showForceLines, phaseState]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation loop
  useEffect(() => {
    if (isAnimating) {
      let frameId: number;
      const animate = () => {
        drawCanvas();
        frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }
  }, [isAnimating, drawCanvas]);

  const reset = () => {
    setTemperature(25);
    setMoleculeCount(8);
    setIsAnimating(true);
  };

  const totalStrength = getTotalStrength();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Force Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectForce}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(forceTypes).map(([key, f]) => (
              <Button
                key={key}
                variant={selectedForce === key ? "default" : "outline"}
                onClick={() => setSelectedForce(key as keyof typeof forceTypes)}
                size="sm"
                className={selectedForce === key ? "bg-cyan-500" : ""}
              >
                {language === "ar" ? f.name.ar : f.name.en}
              </Button>
            ))}
          </div>
        </div>

        {/* Molecule Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectMolecule}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(molecules).map(([key, m]) => (
              <Button
                key={key}
                variant={selectedMolecule === key ? "default" : "outline"}
                onClick={() => setSelectedMolecule(key as keyof typeof molecules)}
                size="sm"
                className={selectedMolecule === key ? "bg-teal-500" : ""}
              >
                {m.formula}
              </Button>
            ))}
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="forceLines"
            checked={showForceLines}
            onChange={(e) => setShowForceLines(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="forceLines" className="text-sm">{t.showForceLines}</label>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.temperature}</label>
              <Badge>{temperature}°C</Badge>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={-200}
              max={200}
              step={10}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.moleculeCount}</label>
              <Badge>{moleculeCount}</Badge>
            </div>
            <Slider
              value={[moleculeCount]}
              onValueChange={([v]) => setMoleculeCount(v)}
              min={4}
              max={16}
              step={1}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={280} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-cyan-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.boilingPoint}</p>
            <p className="font-bold text-cyan-600">{molecule.boilingPoint}°C</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.strength}</p>
            <p className="font-bold text-teal-600">{totalStrength} kJ/mol</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.polarity}</p>
            <p className={`font-bold ${molecule.polarity === "polar" ? "text-blue-600" : "text-gray-600"}`}>
              {molecule.polarity === "polar" ? t.polar : t.nonpolar}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.phaseState}</p>
            <p className="font-bold text-amber-600">
              {phaseState === "solid" ? t.solid : phaseState === "liquid" ? t.liquid : t.gas}
            </p>
          </div>
        </div>

        {/* Present Forces */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-2">{t.presentForces}</p>
          <div className="flex flex-wrap gap-2">
            {molecule.forces.map(f => (
              <Badge key={f} style={{ backgroundColor: forceTypes[f].color + "20", color: forceTypes[f].color }}>
                {language === "ar" ? forceTypes[f].name.ar : forceTypes[f].name.en}
              </Badge>
            ))}
          </div>
        </div>

        {/* Chemical Explanation */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
          <h4 className="font-bold flex items-center gap-2">
            <Atom className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600">
            {language === "ar" ? (
              <>
                في جزيء <strong>{molecule.name.ar}</strong>، القوى بين الجزيئية هي: {molecule.forces.map(f => forceTypes[f].name.ar).join("، ")}.
                هذه القوى تحدد درجة الغليان ({molecule.boilingPoint}°C) والحالة الفيزيائية.
                كلما زادت قوة التجاذب، ارتفعت درجة الغليان.
              </>
            ) : (
              <>
                In <strong>{molecule.name.en}</strong> molecule, intermolecular forces are: {molecule.forces.map(f => forceTypes[f].name.en).join(", ")}.
                These forces determine the boiling point ({molecule.boilingPoint}°C) and physical state.
                Stronger attractions lead to higher boiling points.
              </>
            )}
          </p>
          <p className="text-sm text-slate-600">
            <strong>{t.effectOnProperties}:</strong>{" "}
            {language === "ar"
              ? "القوى بين الجزيئية تؤثر على: درجة الغليان، درجة الانصهار، اللزوجة، التوتر السطحي، وقابلية الذوبان."
              : "Intermolecular forces affect: boiling point, melting point, viscosity, surface tension, and solubility."}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-cyan-500 hover:bg-cyan-600">
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t.pause : t.start}
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
