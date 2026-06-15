"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause, Link } from "lucide-react";

interface CovalentBondSimulatorProps {
  language: "ar" | "en";
}

// Molecule data
const molecules = {
  H2: {
    name: { ar: "هيدروجين", en: "Hydrogen" },
    formula: "H₂",
    atoms: ["H", "H"],
    bondType: "single",
    bondAngle: 180,
    electrons: [1, 1],
    colors: ["#3b82f6", "#3b82f6"],
    sharedElectrons: 2,
  },
  O2: {
    name: { ar: "أكسجين", en: "Oxygen" },
    formula: "O₂",
    atoms: ["O", "O"],
    bondType: "double",
    bondAngle: 180,
    electrons: [6, 6],
    colors: ["#ef4444", "#ef4444"],
    sharedElectrons: 4,
  },
  N2: {
    name: { ar: "نيتروجين", en: "Nitrogen" },
    formula: "N₂",
    atoms: ["N", "N"],
    bondType: "triple",
    bondAngle: 180,
    electrons: [5, 5],
    colors: ["#8b5cf6", "#8b5cf6"],
    sharedElectrons: 6,
  },
  H2O: {
    name: { ar: "ماء", en: "Water" },
    formula: "H₂O",
    atoms: ["H", "O", "H"],
    bondType: "single",
    bondAngle: 104.5,
    electrons: [1, 6, 1],
    colors: ["#3b82f6", "#ef4444", "#3b82f6"],
    sharedElectrons: 4,
  },
  CO2: {
    name: { ar: "ثاني أكسيد الكربون", en: "Carbon Dioxide" },
    formula: "CO₂",
    atoms: ["O", "C", "O"],
    bondType: "double",
    bondAngle: 180,
    electrons: [6, 4, 6],
    colors: ["#ef4444", "#1e293b", "#ef4444"],
    sharedElectrons: 8,
  },
  CH4: {
    name: { ar: "ميثان", en: "Methane" },
    formula: "CH₄",
    atoms: ["C", "H", "H", "H", "H"],
    bondType: "single",
    bondAngle: 109.5,
    electrons: [4, 1, 1, 1, 1],
    colors: ["#1e293b", "#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6"],
    sharedElectrons: 8,
  },
};

const atomInfo: Record<string, { name: { ar: string; en: string }; valence: number }> = {
  H: { name: { ar: "هيدروجين", en: "Hydrogen" }, valence: 1 },
  O: { name: { ar: "أكسجين", en: "Oxygen" }, valence: 6 },
  N: { name: { ar: "نيتروجين", en: "Nitrogen" }, valence: 5 },
  C: { name: { ar: "كربون", en: "Carbon" }, valence: 4 },
  Cl: { name: { ar: "كلور", en: "Chlorine" }, valence: 7 },
};

export function CovalentBondSimulator({ language }: CovalentBondSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [selectedMolecule, setSelectedMolecule] = useState<keyof typeof molecules>("H2");
  const [bondProgress, setBondProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الرابطة التساهمية",
      description: "استكشف مشاركة الإلكترونات في الروابط التساهمية",
      selectMolecule: "اختر الجزيء",
      bondType: "نوع الرابطة",
      single: "أحادية",
      double: "ثنائية",
      triple: "ثلاثية",
      sharedElectrons: "الإلكترونات المشتركة",
      lonePairs: "الأزواج الحرة",
      bondAngle: "زاوية الرابطة",
      bondLength: "طول الرابطة",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      electronSharing: "مشاركة الإلكترونات",
      octetRule: "قاعدة الثمانية",
      bondEnergy: "طاقة الرابطة",
      polarCovalent: "رابطة تساهمية قطبية",
      nonpolarCovalent: "رابطة تساهمية غير قطبية",
      showLonePairs: "إظهار الأزواج الحرة",
      molecularGeometry: "الشكل الجزيئي",
    },
    en: {
      title: "Covalent Bond Simulator",
      description: "Explore electron sharing in covalent bonds",
      selectMolecule: "Select Molecule",
      bondType: "Bond Type",
      single: "Single",
      double: "Double",
      triple: "Triple",
      sharedElectrons: "Shared Electrons",
      lonePairs: "Lone Pairs",
      bondAngle: "Bond Angle",
      bondLength: "Bond Length",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      explanation: "Chemical Explanation",
      electronSharing: "Electron Sharing",
      octetRule: "Octet Rule",
      bondEnergy: "Bond Energy",
      polarCovalent: "Polar Covalent Bond",
      nonpolarCovalent: "Nonpolar Covalent Bond",
      showLonePairs: "Show Lone Pairs",
      molecularGeometry: "Molecular Geometry",
    },
  };

  const t = texts[language];
  const molecule = molecules[selectedMolecule];

  const getBondTypeName = (type: string) => {
    switch (type) {
      case "single": return t.single;
      case "double": return t.double;
      case "triple": return t.triple;
      default: return type;
    }
  };

  // Calculate bond energy (approximate)
  const getBondEnergy = (type: string) => {
    switch (type) {
      case "single": return "~350 kJ/mol";
      case "double": return "~600 kJ/mol";
      case "triple": return "~850 kJ/mol";
      default: return "~350 kJ/mol";
    }
  };

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

    const centerX = width / 2;
    const centerY = height / 2;
    const atomRadius = 35;
    const bondLength = 80;
    const electronRadius = 5;

    // Calculate atom positions based on molecule type
    const atomPositions: { x: number; y: number; atom: string; color: string }[] = [];
    
    if (molecule.atoms.length === 2) {
      // Diatomic molecule
      const separation = bondLength * 2 - bondProgress * 0.5;
      atomPositions.push(
        { x: centerX - separation / 2, y: centerY, atom: molecule.atoms[0], color: molecule.colors[0] },
        { x: centerX + separation / 2, y: centerY, atom: molecule.atoms[1], color: molecule.colors[1] }
      );
    } else if (molecule.atoms.length === 3) {
      // Triatomic (like H2O, CO2)
      const angle = molecule.bondAngle === 180 ? 0 : (molecule.bondAngle * Math.PI) / 180;
      
      if (molecule.atoms[1] === "C") {
        // CO2 - linear
        atomPositions.push(
          { x: centerX - bondLength, y: centerY, atom: molecule.atoms[0], color: molecule.colors[0] },
          { x: centerX, y: centerY, atom: molecule.atoms[1], color: molecule.colors[1] },
          { x: centerX + bondLength, y: centerY, atom: molecule.atoms[2], color: molecule.colors[2] }
        );
      } else {
        // H2O - bent
        atomPositions.push(
          { x: centerX + bondLength * Math.cos(Math.PI - angle / 2), y: centerY + bondLength * Math.sin(Math.PI - angle / 2), atom: molecule.atoms[0], color: molecule.colors[0] },
          { x: centerX, y: centerY, atom: molecule.atoms[1], color: molecule.colors[1] },
          { x: centerX + bondLength * Math.cos(angle / 2), y: centerY + bondLength * Math.sin(angle / 2), atom: molecule.atoms[2], color: molecule.colors[2] }
        );
      }
    } else if (molecule.atoms.length === 5) {
      // Tetrahedral (CH4)
      const angle = (rotationAngle * Math.PI) / 180;
      atomPositions.push(
        { x: centerX, y: centerY, atom: molecule.atoms[0], color: molecule.colors[0] }
      );
      for (let i = 1; i < 5; i++) {
        const theta = angle + ((i - 1) * Math.PI * 2) / 4;
        atomPositions.push({
          x: centerX + bondLength * Math.cos(theta),
          y: centerY + bondLength * Math.sin(theta) * 0.7,
          atom: molecule.atoms[i],
          color: molecule.colors[i],
        });
      }
    }

    // Draw bonds between atoms
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    
    if (molecule.atoms.length === 2 && atomPositions.length >= 2) {
      // Draw bond lines based on bond type
      const bondOffset = molecule.bondType === "double" ? 6 : molecule.bondType === "triple" ? 8 : 0;
      const numLines = molecule.bondType === "single" ? 1 : molecule.bondType === "double" ? 2 : 3;
      
      for (let i = 0; i < numLines; i++) {
        const offset = numLines === 1 ? 0 : (i - (numLines - 1) / 2) * bondOffset;
        ctx.beginPath();
        ctx.moveTo(atomPositions[0].x, atomPositions[0].y + offset);
        ctx.lineTo(atomPositions[1].x, atomPositions[1].y + offset);
        ctx.stroke();
      }
    } else if (molecule.atoms.length >= 3) {
      // Draw bonds from center atom to others
      for (let i = 1; i < atomPositions.length; i++) {
        if (molecule.bondType === "double") {
          // Draw double bond
          ctx.beginPath();
          ctx.moveTo(atomPositions[0].x, atomPositions[0].y - 4);
          ctx.lineTo(atomPositions[i].x, atomPositions[i].y - 4);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(atomPositions[0].x, atomPositions[0].y + 4);
          ctx.lineTo(atomPositions[i].x, atomPositions[i].y + 4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(atomPositions[0].x, atomPositions[0].y);
          ctx.lineTo(atomPositions[i].x, atomPositions[i].y);
          ctx.stroke();
        }
      }
    }

    // Draw shared electrons (bonding pair)
    if (bondProgress > 0) {
      const electronOpacity = bondProgress / 100;
      ctx.fillStyle = `rgba(251, 191, 36, ${electronOpacity})`;
      
      if (molecule.atoms.length === 2 && atomPositions.length >= 2) {
        const midX = (atomPositions[0].x + atomPositions[1].x) / 2;
        const midY = (atomPositions[0].y + atomPositions[1].y) / 2;
        
        // Draw shared electron pair
        const spacing = molecule.bondType === "triple" ? 15 : molecule.bondType === "double" ? 10 : 5;
        const pairs = molecule.bondType === "triple" ? 3 : molecule.bondType === "double" ? 2 : 1;
        
        for (let p = 0; p < pairs; p++) {
          const pairOffset = (p - (pairs - 1) / 2) * spacing;
          ctx.beginPath();
          ctx.arc(midX - 5, midY + pairOffset, electronRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(midX + 5, midY + pairOffset, electronRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw atoms
    atomPositions.forEach((pos, index) => {
      // Atom circle
      ctx.fillStyle = pos.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, atomRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Atom symbol
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(pos.atom, pos.x, pos.y);
      
      // Draw valence electrons around each atom
      const valence = molecule.electrons[index];
      const shared = Math.floor(molecule.sharedElectrons / (molecule.atoms.length === 2 ? 2 : molecule.atoms.length - 1));
      const loneElectrons = valence - shared;
      
      if (showLonePairs && loneElectrons > 0) {
        const electronPositions = getLonePairPositions(pos.x, pos.y, atomRadius, loneElectrons);
        ctx.fillStyle = "#fbbf24";
        electronPositions.forEach(ePos => {
          ctx.beginPath();
          ctx.arc(ePos.x, ePos.y, electronRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });

    // Draw bond angle for triatomic molecules
    if (molecule.atoms.length === 3 && molecule.bondAngle !== 180) {
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      const arcRadius = 50;
      const startAngle = Math.PI + Math.asin((atomPositions[0].y - centerY) / bondLength);
      const endAngle = Math.asin((atomPositions[2].y - centerY) / bondLength);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle);
      ctx.stroke();
      
      ctx.fillStyle = "#6366f1";
      ctx.font = "12px system-ui";
      ctx.fillText(`${molecule.bondAngle}°`, centerX + 60, centerY - 10);
    }

    // Draw molecule label
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(molecule.formula + " - " + (language === "ar" ? molecule.name.ar : molecule.name.en), centerX, height - 20);

  }, [selectedMolecule, bondProgress, showLonePairs, rotationAngle]);

  const getLonePairPositions = (x: number, y: number, radius: number, electrons: number): { x: number; y: number }[] => {
    const positions: { x: number; y: number }[] = [];
    const pairCount = Math.floor(electrons / 2);
    const singleElectron = electrons % 2;
    
    // Place lone pairs around the atom
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    
    for (let i = 0; i < pairCount; i++) {
      const angle = angles[i % 4];
      const distance = radius + 12;
      positions.push(
        { x: x + Math.cos(angle) * distance - 4, y: y + Math.sin(angle) * distance },
        { x: x + Math.cos(angle) * distance + 4, y: y + Math.sin(angle) * distance }
      );
    }
    
    return positions;
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isAnimating && bondProgress < 100) {
      const interval = setInterval(() => {
        setBondProgress(p => Math.min(p + 2, 100));
      }, 50);
      return () => clearInterval(interval);
    } else if (bondProgress >= 100) {
      setIsAnimating(false);
    }
  }, [isAnimating, bondProgress]);

  // Rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(r => (r + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const reset = () => {
    setIsAnimating(false);
    setBondProgress(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Link className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Molecule Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectMolecule}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(molecules).map(([key, mol]) => (
              <Button
                key={key}
                variant={selectedMolecule === key ? "default" : "outline"}
                onClick={() => {
                  setSelectedMolecule(key as keyof typeof molecules);
                  reset();
                }}
                size="sm"
                className={selectedMolecule === key ? "bg-blue-500" : ""}
              >
                {mol.formula}
              </Button>
            ))}
          </div>
        </div>

        {/* Show Lone Pairs Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lonePairs"
            checked={showLonePairs}
            onChange={(e) => setShowLonePairs(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="lonePairs" className="text-sm">{t.showLonePairs}</label>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas ref={canvasRef} width={550} height={320} className="w-full" />
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.electronSharing}</span>
            <Badge>{bondProgress}%</Badge>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-100"
              style={{ width: `${bondProgress}%` }}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.bondType}</p>
            <p className="font-bold text-blue-600">{getBondTypeName(molecule.bondType)}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.sharedElectrons}</p>
            <p className="font-bold text-indigo-600">{molecule.sharedElectrons}</p>
          </div>
          <div className="p-3 bg-violet-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.bondAngle}</p>
            <p className="font-bold text-violet-600">{molecule.bondAngle}°</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.bondEnergy}</p>
            <p className="font-bold text-purple-600 text-sm">{getBondEnergy(molecule.bondType)}</p>
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
                في جزيء <strong>{molecule.name.ar}</strong>، تشارك الذرات إلكتروناتها لتكملة مستوى الطاقة الخارجي.
                الرابطة التساهمية تنشأ من <strong>مشاركة أزواج الإلكترونات</strong> بين الذرات.
                {molecule.bondType === "double" && " الرابطة الثنائية تحتوي على زوجين من الإلكترونات المشتركة."}
                {molecule.bondType === "triple" && " الرابطة الثلاثية تحتوي على ثلاثة أزواج من الإلكترونات المشتركة."}
              </>
            ) : (
              <>
                In <strong>{molecule.name.en}</strong> molecule, atoms share electrons to complete their outer energy level.
                The covalent bond forms from <strong>sharing electron pairs</strong> between atoms.
                {molecule.bondType === "double" && " A double bond contains two shared electron pairs."}
                {molecule.bondType === "triple" && " A triple bond contains three shared electron pairs."}
              </>
            )}
          </p>
          <p className="text-sm text-slate-600">
            <strong>{t.octetRule}:</strong>{" "}
            {language === "ar"
              ? "تسعى الذرات للحصول على 8 إلكترونات في المستوى الأخير (أو 2 للهيدروجين)."
              : "Atoms seek 8 electrons in their outer shell (or 2 for Hydrogen)."}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-blue-500 hover:bg-blue-600">
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
