"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause, Zap, Magnet } from "lucide-react";

interface PolaritySimulatorProps {
  language: "ar" | "en";
}

// Electronegativity values (Pauling scale)
const electronegativity: Record<string, number> = {
  H: 2.1,
  Li: 1.0,
  Be: 1.5,
  B: 2.0,
  C: 2.5,
  N: 3.0,
  O: 3.5,
  F: 4.0,
  Na: 0.9,
  Mg: 1.2,
  Al: 1.5,
  Si: 1.8,
  P: 2.1,
  S: 2.5,
  Cl: 3.0,
  K: 0.8,
  Ca: 1.0,
  Br: 2.8,
  I: 2.5,
};

// Molecules for comparison
const molecules = {
  H2O: {
    name: { ar: "ماء", en: "Water" },
    formula: "H₂O",
    atoms: ["H", "O", "H"],
    bonds: [[0, 1], [1, 2]],
    geometry: "bent",
    dipoleMoment: 1.85,
    bondAngle: 104.5,
    isPolar: true,
    color: "#06b6d4",
  },
  CO2: {
    name: { ar: "ثاني أكسيد الكربون", en: "Carbon Dioxide" },
    formula: "CO₂",
    atoms: ["O", "C", "O"],
    bonds: [[0, 1], [1, 2]],
    geometry: "linear",
    dipoleMoment: 0,
    bondAngle: 180,
    isPolar: false,
    color: "#64748b",
  },
  NH3: {
    name: { ar: "أمونيا", en: "Ammonia" },
    formula: "NH₃",
    atoms: ["N", "H", "H", "H"],
    bonds: [[0, 1], [0, 2], [0, 3]],
    geometry: "trigonal-pyramidal",
    dipoleMoment: 1.47,
    bondAngle: 107,
    isPolar: true,
    color: "#22c55e",
  },
  CH4: {
    name: { ar: "ميثان", en: "Methane" },
    formula: "CH₄",
    atoms: ["C", "H", "H", "H", "H"],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
    geometry: "tetrahedral",
    dipoleMoment: 0,
    bondAngle: 109.5,
    isPolar: false,
    color: "#8b5cf6",
  },
  HCl: {
    name: { ar: "كلوريد الهيدروجين", en: "Hydrogen Chloride" },
    formula: "HCl",
    atoms: ["H", "Cl"],
    bonds: [[0, 1]],
    geometry: "linear",
    dipoleMoment: 1.08,
    bondAngle: 180,
    isPolar: true,
    color: "#f59e0b",
  },
  BF3: {
    name: { ar: "ثلاثي فلوريد البورون", en: "Boron Trifluoride" },
    formula: "BF₃",
    atoms: ["B", "F", "F", "F"],
    bonds: [[0, 1], [0, 2], [0, 3]],
    geometry: "trigonal-planar",
    dipoleMoment: 0,
    bondAngle: 120,
    isPolar: false,
    color: "#ec4899",
  },
  H2S: {
    name: { ar: "كبريتيد الهيدروجين", en: "Hydrogen Sulfide" },
    formula: "H₂S",
    atoms: ["H", "S", "H"],
    bonds: [[0, 1], [1, 2]],
    geometry: "bent",
    dipoleMoment: 0.97,
    bondAngle: 92.1,
    isPolar: true,
    color: "#eab308",
  },
  CCl4: {
    name: { ar: "رباعي كلوريد الكربون", en: "Carbon Tetrachloride" },
    formula: "CCl₄",
    atoms: ["C", "Cl", "Cl", "Cl", "Cl"],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
    geometry: "tetrahedral",
    dipoleMoment: 0,
    bondAngle: 109.5,
    isPolar: false,
    color: "#14b8a6",
  },
};

export function PolaritySimulator({ language }: PolaritySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [selectedMolecule, setSelectedMolecule] = useState<keyof typeof molecules>("H2O");
  const [fieldStrength, setFieldStrength] = useState(50);
  const [showDipole, setShowDipole] = useState(true);
  const [showPartialCharges, setShowPartialCharges] = useState(true);
  const [showBondDipoles, setShowBondDipoles] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  const texts = {
    ar: {
      title: "محاكي قطبية الجزيئات",
      description: "استكشف القطبية الجزيئية وعزم ثنائي القطب",
      selectMolecule: "اختر الجزيء",
      dipoleMoment: "عزم ثنائي القطب",
      bondAngle: "زاوية الرابطة",
      electronegativityDiff: "فرق السالبية الكهربية",
      polarity: "القطبية",
      polar: "قطبي",
      nonpolar: "غير قطبي",
      partialCharges: "الشحنات الجزئية",
      bondDipoles: "ثنائيات أقطاب الروابط",
      netDipole: "عزم ثنائي القطب المحصل",
      showDipole: "إظهار ثنائي القطب",
      showPartialCharges: "إظهار الشحنات الجزئية",
      showBondDipoles: "إظهار ثنائيات أقطاب الروابط",
      electricField: "المجال الكهربي",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      polarityDetermination: "تحديد القطبية",
      factorsAffectingPolarity: "العوامل المؤثرة على القطبية",
      molecularGeometry: "الشكل الجزيئي",
      bondPolarity: "قطبية الرابطة",
      solubility: "الذوبانية",
      likeDissolvesLike: "المثل يذوب في المثل",
    },
    en: {
      title: "Molecular Polarity Simulator",
      description: "Explore molecular polarity and dipole moments",
      selectMolecule: "Select Molecule",
      dipoleMoment: "Dipole Moment",
      bondAngle: "Bond Angle",
      electronegativityDiff: "Electronegativity Difference",
      polarity: "Polarity",
      polar: "Polar",
      nonpolar: "Nonpolar",
      partialCharges: "Partial Charges",
      bondDipoles: "Bond Dipoles",
      netDipole: "Net Dipole Moment",
      showDipole: "Show Dipole",
      showPartialCharges: "Show Partial Charges",
      showBondDipoles: "Show Bond Dipoles",
      electricField: "Electric Field",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      explanation: "Chemical Explanation",
      polarityDetermination: "Polarity Determination",
      factorsAffectingPolarity: "Factors Affecting Polarity",
      molecularGeometry: "Molecular Geometry",
      bondPolarity: "Bond Polarity",
      solubility: "Solubility",
      likeDissolvesLike: "Like Dissolves Like",
    },
  };

  const t = texts[language];
  const molecule = molecules[selectedMolecule];

  // Calculate bond polarity for each bond
  const getBondPolarities = () => {
    return molecule.bonds.map(([a, b]) => {
      const enA = electronegativity[molecule.atoms[a]] || 2.0;
      const enB = electronegativity[molecule.atoms[b]] || 2.0;
      return {
        bond: [a, b],
        diff: Math.abs(enA - enB),
        direction: enB > enA ? b : a,
      };
    });
  };

  const bondPolarities = getBondPolarities();

  // Calculate max electronegativity difference
  const maxEnDiff = Math.max(...bondPolarities.map(bp => bp.diff));

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background with electric field effect
    if (fieldStrength > 0) {
      const fieldGradient = ctx.createLinearGradient(0, 0, width, 0);
      fieldGradient.addColorStop(0, `rgba(239, 68, 68, ${fieldStrength / 200})`);
      fieldGradient.addColorStop(1, `rgba(59, 130, 246, ${fieldStrength / 200})`);
      ctx.fillStyle = fieldGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Field lines
      ctx.strokeStyle = `rgba(100, 116, 139, ${fieldStrength / 100})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = 30 + i * ((height - 60) / 7);
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
        
        // Arrows
        ctx.beginPath();
        ctx.moveTo(width - 30, y - 5);
        ctx.lineTo(width - 20, y);
        ctx.lineTo(width - 30, y + 5);
        ctx.stroke();
      }
      
      // Field labels
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("+", 15, height / 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("-", width - 15, height / 2);
    } else {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now() / 1000;

    // Calculate molecule alignment with field
    const alignmentAngle = molecule.isPolar && fieldStrength > 0 
      ? Math.sin(time * 0.5) * 0.1 + (rotationAngle * Math.PI / 180)
      : rotationAngle * Math.PI / 180;

    // Draw molecule
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(alignmentAngle);

    const bondLength = 60;
    const atomRadius = 22;

    // Get atom positions based on geometry
    const atomPositions = getAtomPositions(molecule.geometry, bondLength);
    
    // Draw bonds
    molecule.bonds.forEach(([a, b], index) => {
      const posA = atomPositions[a];
      const posB = atomPositions[b];
      
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(posA.x, posA.y);
      ctx.lineTo(posB.x, posB.y);
      ctx.stroke();
      
      // Draw bond dipole arrow
      if (showBondDipoles) {
        const bp = bondPolarities[index];
        const midX = (posA.x + posB.x) / 2;
        const midY = (posA.y + posB.y) / 2;
        
        // Direction of dipole (toward more electronegative atom)
        const targetPos = bp.direction === b ? posB : posA;
        const dx = targetPos.x - midX;
        const dy = targetPos.y - midY;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        if (len > 0 && bp.diff > 0.4) {
          const arrowLen = 20;
          const ax = (dx / len) * arrowLen;
          const ay = (dy / len) * arrowLen;
          
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(midX - ax * 0.5, midY - ay * 0.5);
          ctx.lineTo(midX + ax * 0.5, midY + ay * 0.5);
          ctx.stroke();
          
          // Arrow head
          ctx.beginPath();
          ctx.moveTo(midX + ax * 0.5, midY + ay * 0.5);
          ctx.lineTo(midX + ax * 0.3 - ay * 0.15, midY + ay * 0.3 + ax * 0.15);
          ctx.moveTo(midX + ax * 0.5, midY + ay * 0.5);
          ctx.lineTo(midX + ax * 0.3 + ay * 0.15, midY + ay * 0.3 - ax * 0.15);
          ctx.stroke();
        }
      }
    });

    // Draw atoms
    molecule.atoms.forEach((atom, index) => {
      const pos = atomPositions[index];
      const en = electronegativity[atom] || 2.0;
      
      // Atom color based on electronegativity
      const enColor = en > 2.5 ? "#3b82f6" : en < 2.0 ? "#ef4444" : "#64748b";
      
      ctx.fillStyle = enColor;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, atomRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Atom symbol
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(atom, pos.x, pos.y);
      
      // Partial charge
      if (showPartialCharges) {
        const avgEn = 2.5;
        const charge = en - avgEn;
        if (Math.abs(charge) > 0.3) {
          ctx.fillStyle = charge > 0 ? "#3b82f6" : "#ef4444";
          ctx.font = "bold 10px system-ui";
          const chargeSymbol = charge > 0 ? "δ-" : "δ+";
          ctx.fillText(chargeSymbol, pos.x, pos.y - atomRadius - 8);
        }
      }
    });

    // Draw net dipole moment
    if (showDipole && molecule.isPolar && molecule.dipoleMoment > 0) {
      const dipoleLength = 80;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -dipoleLength / 2);
      ctx.lineTo(0, dipoleLength / 2);
      ctx.stroke();
      
      // Arrow head pointing to negative end
      ctx.beginPath();
      ctx.moveTo(-8, -dipoleLength / 2 + 12);
      ctx.lineTo(0, -dipoleLength / 2);
      ctx.lineTo(8, -dipoleLength / 2 + 12);
      ctx.stroke();
      
      // Dipole label
      ctx.fillStyle = "#ef4444";
      ctx.font = "10px system-ui";
      ctx.fillText("μ", 15, 0);
    }

    ctx.restore();

    // Draw dipole moment value
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      `μ = ${molecule.dipoleMoment} D`,
      centerX,
      height - 15
    );

  }, [selectedMolecule, fieldStrength, showDipole, showPartialCharges, showBondDipoles, rotationAngle]);

  const getAtomPositions = (geometry: string, bondLength: number) => {
    const positions: { x: number; y: number }[] = [];
    
    switch (geometry) {
      case "linear":
        positions.push({ x: -bondLength, y: 0 });
        positions.push({ x: 0, y: 0 });
        positions.push({ x: bondLength, y: 0 });
        break;
      case "bent":
        const bentAngle = (104.5 * Math.PI) / 180;
        positions.push({ x: -bondLength * Math.cos(bentAngle / 2), y: bondLength * Math.sin(bentAngle / 2) });
        positions.push({ x: 0, y: 0 });
        positions.push({ x: bondLength * Math.cos(bentAngle / 2), y: bondLength * Math.sin(bentAngle / 2) });
        break;
      case "trigonal-planar":
        positions.push({ x: 0, y: 0 });
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
          positions.push({ x: bondLength * Math.cos(angle), y: bondLength * Math.sin(angle) });
        }
        break;
      case "trigonal-pyramidal":
        positions.push({ x: 0, y: -10 });
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3;
          positions.push({ x: bondLength * 0.7 * Math.cos(angle), y: bondLength * 0.5 + bondLength * 0.5 * Math.sin(angle) });
        }
        break;
      case "tetrahedral":
        positions.push({ x: 0, y: 0 });
        const tetAngles = [
          { x: 0, y: -bondLength },
          { x: bondLength * 0.94, y: bondLength * 0.33 },
          { x: -bondLength * 0.47, y: bondLength * 0.33 + bondLength * 0.82 },
          { x: -bondLength * 0.47, y: bondLength * 0.33 - bondLength * 0.82 },
        ];
        tetAngles.forEach(a => positions.push({ x: a.x, y: a.y }));
        break;
      default:
        positions.push({ x: 0, y: 0 });
    }
    
    return positions;
  };

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

  // Slow rotation
  useEffect(() => {
    if (isAnimating && !molecule.isPolar) {
      const interval = setInterval(() => {
        setRotationAngle(r => (r + 0.5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnimating, molecule.isPolar]);

  const reset = () => {
    setFieldStrength(50);
    setRotationAngle(0);
    setIsAnimating(true);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Magnet className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
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
                onClick={() => setSelectedMolecule(key as keyof typeof molecules)}
                size="sm"
                className={selectedMolecule === key ? "bg-rose-500" : ""}
              >
                {mol.formula}
              </Button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showDipole"
              checked={showDipole}
              onChange={(e) => setShowDipole(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showDipole" className="text-sm">{t.showDipole}</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPartialCharges"
              checked={showPartialCharges}
              onChange={(e) => setShowPartialCharges(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showPartialCharges" className="text-sm">{t.showPartialCharges}</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showBondDipoles"
              checked={showBondDipoles}
              onChange={(e) => setShowBondDipoles(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showBondDipoles" className="text-sm">{t.showBondDipoles}</label>
          </div>
        </div>

        {/* Electric Field Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm">{t.electricField}</label>
            <Badge>{fieldStrength}%</Badge>
          </div>
          <Slider
            value={[fieldStrength]}
            onValueChange={([v]) => setFieldStrength(v)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={280} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-rose-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.polarity}</p>
            <p className={`font-bold ${molecule.isPolar ? "text-rose-600" : "text-gray-600"}`}>
              {molecule.isPolar ? t.polar : t.nonpolar}
            </p>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.dipoleMoment}</p>
            <p className="font-bold text-pink-600">{molecule.dipoleMoment} D</p>
          </div>
          <div className="p-3 bg-fuchsia-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.bondAngle}</p>
            <p className="font-bold text-fuchsia-600">{molecule.bondAngle}°</p>
          </div>
          <div className="p-3 bg-violet-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.electronegativityDiff}</p>
            <p className="font-bold text-violet-600">{maxEnDiff.toFixed(1)}</p>
          </div>
        </div>

        {/* Bond Polarities */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-2">{t.bondDipoles}</p>
          <div className="space-y-1">
            {bondPolarities.map((bp, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{molecule.atoms[bp.bond[0]]}-{molecule.atoms[bp.bond[1]]}</span>
                <span className="text-slate-500">ΔEN = {bp.diff.toFixed(1)}</span>
                <Badge variant={bp.diff > 0.4 ? "default" : "secondary"} className="text-xs">
                  {bp.diff > 1.7 ? (language === "ar" ? "أيوني" : "Ionic") : 
                   bp.diff > 0.4 ? (language === "ar" ? "قطبي" : "Polar") : 
                   (language === "ar" ? "غير قطبي" : "Nonpolar")}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Chemical Explanation */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
          <h4 className="font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600">
            {language === "ar" ? (
              <>
                <strong>{molecule.name.ar}</strong> جزيء {molecule.isPolar ? "<strong>قطبي</strong>" : "<strong>غير قطبي</strong>"}.
                {molecule.isPolar 
                  ? ` عزم ثنائي القطب = ${molecule.dipoleMoment} Debye. الشحنة لا تتوزع بالتساوي بسبب اختلاف السالبية الكهربية والشكل الجزيئي.`
                  : ` رغم وجود روابط قطبية، يتلاشى عزم ثنائي القطب المحصل بسبب التناظر في الشكل الجزيئي.`}
              </>
            ) : (
              <>
                <strong>{molecule.name.en}</strong> is a <strong>{molecule.isPolar ? "polar" : "nonpolar"}</strong> molecule.
                {molecule.isPolar 
                  ? ` Dipole moment = ${molecule.dipoleMoment} Debye. Charge is unevenly distributed due to electronegativity differences and molecular geometry.`
                  : ` Despite polar bonds, the net dipole moment cancels out due to symmetric molecular geometry.`}
              </>
            )}
          </p>
          <p className="text-sm text-slate-600">
            <strong>{t.factorsAffectingPolarity}:</strong>
          </p>
          <ul className="text-sm text-slate-600 list-disc list-inside">
            <li>
              {language === "ar" 
                ? `${t.bondPolarity}: فرق السالبية الكهربية بين الذرات`
                : `${t.bondPolarity}: Electronegativity difference between atoms`}
            </li>
            <li>
              {language === "ar"
                ? `${t.molecularGeometry}: الشكل الجزيئي يحدد اتجاه ثنائيات الأقطاب`
                : `${t.molecularGeometry}: Molecular shape determines dipole directions`}
            </li>
          </ul>
          <p className="text-sm text-slate-600 mt-2">
            <strong>{t.solubility}:</strong>{" "}
            {language === "ar"
              ? `"${t.likeDissolvesLike}" - الجزيئات القطبية تذوب في مذيبات قطبية، وغير القطبية في مذيبات غير قطبية.`
              : `"${t.likeDissolvesLike}" - Polar molecules dissolve in polar solvents, nonpolar in nonpolar solvents.`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-rose-500 hover:bg-rose-600">
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
