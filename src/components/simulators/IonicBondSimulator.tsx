"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause, Zap } from "lucide-react";

interface IonicBondSimulatorProps {
  language: "ar" | "en";
}

// Element data for common ionic bonding
const elements = {
  Na: { name: { ar: "صوديوم", en: "Sodium" }, symbol: "Na", electrons: 11, protons: 11, color: "#f59e0b", group: 1 },
  Cl: { name: { ar: "كلور", en: "Chlorine" }, symbol: "Cl", electrons: 17, protons: 17, color: "#22c55e", group: 17 },
  Mg: { name: { ar: "مغنيسيوم", en: "Magnesium" }, symbol: "Mg", electrons: 12, protons: 12, color: "#8b5cf6", group: 2 },
  O: { name: { ar: "أكسجين", en: "Oxygen" }, symbol: "O", electrons: 8, protons: 8, color: "#ef4444", group: 16 },
  Ca: { name: { ar: "كالسيوم", en: "Calcium" }, symbol: "Ca", electrons: 20, protons: 20, color: "#3b82f6", group: 2 },
  F: { name: { ar: "فلور", en: "Fluorine" }, symbol: "F", electrons: 9, protons: 9, color: "#06b6d4", group: 17 },
  K: { name: { ar: "بوتاسيوم", en: "Potassium" }, symbol: "K", electrons: 19, protons: 19, color: "#ec4899", group: 1 },
  Br: { name: { ar: "بروم", en: "Bromine" }, symbol: "Br", electrons: 35, protons: 35, color: "#a855f7", group: 17 },
};

const compounds: Record<string, { cation: keyof typeof elements; anion: keyof typeof elements; formula: string; name: { ar: string; en: string } }> = {
  "NaCl": { cation: "Na", anion: "Cl", formula: "NaCl", name: { ar: "كلوريد الصوديوم (ملح الطعام)", en: "Sodium Chloride (Table Salt)" } },
  "MgO": { cation: "Mg", anion: "O", formula: "MgO", name: { ar: "أكسيد المغنيسيوم", en: "Magnesium Oxide" } },
  "CaF2": { cation: "Ca", anion: "F", formula: "CaF₂", name: { ar: "فلوريد الكالسيوم", en: "Calcium Fluoride" } },
  "KBr": { cation: "K", anion: "Br", formula: "KBr", name: { ar: "بروميد البوتاسيوم", en: "Potassium Bromide" } },
};

export function IonicBondSimulator({ language }: IonicBondSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [selectedCompound, setSelectedCompound] = useState<keyof typeof compounds>("NaCl");
  const [electronTransferProgress, setElectronTransferProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLattice, setShowLattice] = useState(false);
  const [latticeSize, setLatticeSize] = useState(3);

  const texts = {
    ar: {
      title: "محاكي الرابطة الأيونية",
      description: "استكشف تكوين الرابطة الأيونية بانتقال الإلكترونات",
      selectCompound: "اختر المركب الأيوني",
      electronTransfer: "انتقال الإلكترونات",
      cation: "الكاتيون (أيون موجب)",
      anion: "الأنيون (أيون سالب)",
      bondFormation: "تكوين الرابطة",
      latticeStructure: "الشبكة البلورية",
      latticeSize: "حجم الشبكة",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      electronsTransferred: "الإلكترونات المنتقلة",
      electrostaticForce: "قوة التجاذب الكهروستاتيكية",
      before: "قبل التفاعل",
      after: "بعد التفاعل",
      explanation: "التفسير الكيميائي",
      electronConfiguration: "التوزيع الإلكتروني",
      octetRule: "قاعدة الثمانية",
      ionFormation: "تكون الأيونات",
      energyReleased: "الطاقة المنطلقة",
      latticeEnergy: "طاقة الشبكة البلورية",
    },
    en: {
      title: "Ionic Bond Simulator",
      description: "Explore ionic bond formation through electron transfer",
      selectCompound: "Select Ionic Compound",
      electronTransfer: "Electron Transfer",
      cation: "Cation (Positive Ion)",
      anion: "Anion (Negative Ion)",
      bondFormation: "Bond Formation",
      latticeStructure: "Lattice Structure",
      latticeSize: "Lattice Size",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      electronsTransferred: "Electrons Transferred",
      electrostaticForce: "Electrostatic Attraction",
      before: "Before Reaction",
      after: "After Reaction",
      explanation: "Chemical Explanation",
      electronConfiguration: "Electron Configuration",
      octetRule: "Octet Rule",
      ionFormation: "Ion Formation",
      energyReleased: "Energy Released",
      latticeEnergy: "Lattice Energy",
    },
  };

  const t = texts[language];
  const compound = compounds[selectedCompound];
  const cation = elements[compound.cation];
  const anion = elements[compound.anion];

  // Calculate electrons to transfer based on group
  const getElectronsToTransfer = (cationGroup: number, anionGroup: number) => {
    const cationElectrons = cationGroup <= 2 ? cationGroup : cationGroup - 10;
    const anionNeeded = 8 - (anionGroup - 10);
    return Math.min(cationElectrons, anionNeeded);
  };

  const electronsToTransfer = getElectronsToTransfer(cation.group, anion.group);
  
  // Calculate ion charges
  const cationCharge = electronsToTransfer;
  const anionCharge = -electronsToTransfer;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    if (showLattice) {
      drawLattice(ctx, width, height);
    } else {
      drawElectronTransfer(ctx, width, height);
    }
  }, [electronTransferProgress, selectedCompound, showLattice, latticeSize]);

  const drawElectronTransfer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const atomRadius = 50;
    const electronRadius = 6;

    // Progress affects positions
    const separation = 180 - (electronTransferProgress / 100) * 80;
    
    // Cation position (left, moves right as bond forms)
    const cationX = centerX - separation / 2;
    const cationY = centerY;
    
    // Anion position (right, moves left as bond forms)
    const anionX = centerX + separation / 2;
    const anionY = centerY;

    // Draw cation (left atom)
    ctx.fillStyle = cation.color;
    ctx.beginPath();
    ctx.arc(cationX, cationY, atomRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Cation nucleus
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cationX, cationY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cation.symbol, cationX, cationY);

    // Draw cation electrons (remaining after transfer)
    const cationRemainingElectrons = cation.electrons - (electronTransferProgress / 100) * electronsToTransfer;
    drawElectronShells(ctx, cationX, cationY, Math.round(cationRemainingElectrons), electronRadius, cation.color, 1);

    // Draw anion (right atom)
    ctx.fillStyle = anion.color;
    ctx.beginPath();
    ctx.arc(anionX, anionY, atomRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Anion nucleus
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(anionX, anionY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.fillText(anion.symbol, anionX, anionY);

    // Draw anion electrons (gaining electrons)
    const anionCurrentElectrons = anion.electrons + (electronTransferProgress / 100) * electronsToTransfer;
    drawElectronShells(ctx, anionX, anionY, Math.round(anionCurrentElectrons), electronRadius, anion.color, 1);

    // Draw transferring electrons
    if (electronTransferProgress > 0 && electronTransferProgress < 100) {
      const transferProgress = electronTransferProgress / 100;
      for (let i = 0; i < electronsToTransfer; i++) {
        const offset = (i * 15) - (electronsToTransfer - 1) * 7.5;
        const electronX = cationX + transferProgress * (anionX - cationX);
        const electronY = cationY + offset + Math.sin(transferProgress * Math.PI * 4 + i) * 10;
        
        ctx.fillStyle = "#fbbf24";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(electronX, electronY, electronRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Electron symbol
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 8px system-ui";
        ctx.fillText("e⁻", electronX, electronY);
      }
    }

    // Draw bond lines when complete
    if (electronTransferProgress >= 100) {
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cationX + atomRadius, cationY);
      ctx.lineTo(anionX - atomRadius, anionY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw charge labels
    if (electronTransferProgress > 50) {
      const chargeOpacity = (electronTransferProgress - 50) / 50;
      ctx.fillStyle = `rgba(255, 255, 255, ${chargeOpacity})`;
      ctx.font = "bold 16px system-ui";
      ctx.fillText(`${cationCharge > 1 ? cationCharge : ""}⁺`, cationX + atomRadius - 10, cationY - atomRadius + 10);
      ctx.fillText(`${Math.abs(anionCharge) > 1 ? Math.abs(anionCharge) : ""}⁻`, anionX + atomRadius - 10, anionY - atomRadius + 10);
    }

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? cation.name.ar : cation.name.en, cationX, cationY + atomRadius + 20);
    ctx.fillText(language === "ar" ? anion.name.ar : anion.name.en, anionX, anionY + atomRadius + 20);
  };

  const drawElectronShells = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    electrons: number, 
    electronRadius: number,
    color: string,
    charge: number
  ) => {
    const shells = [2, 8, 18, 32]; // Maximum electrons per shell
    let remainingElectrons = electrons;
    
    for (let shell = 0; shell < shells.length && remainingElectrons > 0; shell++) {
      const shellRadius = 25 + shell * 12;
      const electronsInShell = Math.min(remainingElectrons, shells[shell]);
      
      // Draw shell orbit
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, shellRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw electrons in shell
      for (let i = 0; i < electronsInShell; i++) {
        const angle = (i / electronsInShell) * Math.PI * 2 - Math.PI / 2;
        const electronX = x + Math.cos(angle) * shellRadius;
        const electronY = y + Math.sin(angle) * shellRadius;
        
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(electronX, electronY, electronRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      remainingElectrons -= electronsInShell;
    }
  };

  const drawLattice = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const spacing = 45;
    const ionRadius = 18;

    // Draw 3D-like lattice
    for (let row = 0; row < latticeSize; row++) {
      for (let col = 0; col < latticeSize; col++) {
        // Alternate between cation and anion
        const isCation = (row + col) % 2 === 0;
        const element = isCation ? cation : anion;
        
        const x = centerX + (col - (latticeSize - 1) / 2) * spacing;
        const y = centerY + (row - (latticeSize - 1) / 2) * spacing;
        
        // Draw ion
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(x, y, ionRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw symbol
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(element.symbol, x, y);
        
        // Draw charge
        ctx.font = "bold 8px system-ui";
        const charge = isCation ? "⁺" : "⁻";
        ctx.fillText(charge, x + ionRadius - 5, y - ionRadius + 5);
        
        // Draw bonds to neighbors
        ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
        ctx.lineWidth = 2;
        
        // Right neighbor
        if (col < latticeSize - 1) {
          ctx.beginPath();
          ctx.moveTo(x + ionRadius, y);
          ctx.lineTo(x + spacing - ionRadius, y);
          ctx.stroke();
        }
        
        // Bottom neighbor
        if (row < latticeSize - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y + ionRadius);
          ctx.lineTo(x, y + spacing - ionRadius);
          ctx.stroke();
        }
      }
    }

    // Draw label
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(compound.formula, centerX, height - 15);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isAnimating && electronTransferProgress < 100) {
      const interval = setInterval(() => {
        setElectronTransferProgress(p => Math.min(p + 2, 100));
      }, 50);
      return () => clearInterval(interval);
    } else if (electronTransferProgress >= 100) {
      setIsAnimating(false);
    }
  }, [isAnimating, electronTransferProgress]);

  const reset = () => {
    setIsAnimating(false);
    setElectronTransferProgress(0);
  };

  // Calculate lattice energy (simplified approximation)
  const latticeEnergy = Math.abs(cationCharge * anionCharge) * 800; // kJ/mol approximate

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Compound Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectCompound}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(compounds).map(([key, value]) => (
              <Button
                key={key}
                variant={selectedCompound === key ? "default" : "outline"}
                onClick={() => {
                  setSelectedCompound(key as keyof typeof compounds);
                  reset();
                }}
                size="sm"
                className={selectedCompound === key ? "bg-amber-500" : ""}
              >
                {value.formula}
              </Button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={!showLattice ? "default" : "outline"}
            onClick={() => setShowLattice(false)}
            size="sm"
            className={!showLattice ? "bg-amber-500" : ""}
          >
            {t.electronTransfer}
          </Button>
          <Button
            variant={showLattice ? "default" : "outline"}
            onClick={() => setShowLattice(true)}
            size="sm"
            className={showLattice ? "bg-amber-500" : ""}
          >
            {t.latticeStructure}
          </Button>
        </div>

        {/* Lattice Size Slider (when in lattice mode) */}
        {showLattice && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.latticeSize}</label>
              <Badge>{latticeSize}×{latticeSize}</Badge>
            </div>
            <Slider
              value={[latticeSize]}
              onValueChange={([v]) => setLatticeSize(v)}
              min={2}
              max={5}
              step={1}
            />
          </div>
        )}

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas ref={canvasRef} width={550} height={300} className="w-full" />
        </div>

        {/* Progress (only in electron transfer mode) */}
        {!showLattice && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t.before}</span>
              <span>{t.after}</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-100"
                style={{ width: `${electronTransferProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.cation}</p>
            <p className="font-bold text-amber-600">{cation.symbol}{cationCharge > 1 ? cationCharge : ""}⁺</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.anion}</p>
            <p className="font-bold text-green-600">{anion.symbol}{Math.abs(anionCharge) > 1 ? Math.abs(anionCharge) : ""}⁻</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.electronsTransferred}</p>
            <p className="font-bold text-orange-600">{electronsToTransfer}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.latticeEnergy}</p>
            <p className="font-bold text-purple-600">{latticeEnergy} kJ/mol</p>
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
                يفقد عنصر <strong>{cation.name.ar}</strong> {electronsToTransfer} إلكترون(ات) ليصبح كاتيون بشحنة +{cationCharge}،
                بينما يكتسب عنصر <strong>{anion.name.ar}</strong> هذه الإلكترونات ليصبح أنيون بشحنة {anionCharge}.
                تنشأ الرابطة الأيونية من قوة التجاذب الكهروستاتيكي بين الأيونات الموجبة والسالبة.
              </>
            ) : (
              <>
                <strong>{cation.name.en}</strong> loses {electronsToTransfer} electron(s) to become a cation with +{cationCharge} charge,
                while <strong>{anion.name.en}</strong> gains these electrons to become an anion with {anionCharge} charge.
                The ionic bond forms from electrostatic attraction between positive and negative ions.
              </>
            )}
          </p>
          <p className="text-sm text-slate-600">
            <strong>{t.octetRule}:</strong>{" "}
            {language === "ar"
              ? "كلا الأيونين يحققان التوزيع الإلكتروني المستقر (8 إلكترونات في المستوى الأخير)."
              : "Both ions achieve stable electron configuration (8 electrons in outer shell)."}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!showLattice && (
            <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-amber-500 hover:bg-amber-600">
              {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAnimating ? t.pause : t.start}
            </Button>
          )}
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
