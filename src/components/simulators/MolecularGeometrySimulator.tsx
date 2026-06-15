"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause, RotateCw, Box } from "lucide-react";

interface MolecularGeometrySimulatorProps {
  language: "ar" | "en";
}

// VSEPR Molecular geometries
const geometries = {
  linear: {
    name: { ar: "خطي", en: "Linear" },
    formula: "AX₂",
    bondAngle: 180,
    electronGroups: 2,
    lonePairs: 0,
    examples: ["CO₂", "BeCl₂"],
    description: { ar: "شكل خطي مع زاوية 180°", en: "Linear shape with 180° angle" },
  },
  trigonalPlanar: {
    name: { ar: "مثلثي مستوي", en: "Trigonal Planar" },
    formula: "AX₃",
    bondAngle: 120,
    electronGroups: 3,
    lonePairs: 0,
    examples: ["BF₃", "SO₃"],
    description: { ar: "شكل مثلثي في مستوى واحد", en: "Triangular shape in one plane" },
  },
  bent: {
    name: { ar: "منحني (مثلثي)", en: "Bent (Angular)" },
    formula: "AX₂E",
    bondAngle: 117,
    electronGroups: 3,
    lonePairs: 1,
    examples: ["SO₂", "O₃"],
    description: { ar: "شكل منحني بسبب زوج حر", en: "Bent shape due to lone pair" },
  },
  tetrahedral: {
    name: { ar: "رباعي الوجوه", en: "Tetrahedral" },
    formula: "AX₄",
    bondAngle: 109.5,
    electronGroups: 4,
    lonePairs: 0,
    examples: ["CH₄", "CCl₄"],
    description: { ar: "شكل رباعي السطوح منتظم", en: "Regular tetrahedral shape" },
  },
  trigonalPyramidal: {
    name: { ar: "هرمي ثلاثي", en: "Trigonal Pyramidal" },
    formula: "AX₃E",
    bondAngle: 107,
    electronGroups: 4,
    lonePairs: 1,
    examples: ["NH₃", "PH₃"],
    description: { ar: "شكل هرمي مع زوج حر واحد", en: "Pyramidal shape with one lone pair" },
  },
  bentTetrahedral: {
    name: { ar: "منحني (رباعي)", en: "Bent (Tetrahedral)" },
    formula: "AX₂E₂",
    bondAngle: 104.5,
    electronGroups: 4,
    lonePairs: 2,
    examples: ["H₂O", "H₂S"],
    description: { ar: "شكل منحني مع زوجين حرين", en: "Bent shape with two lone pairs" },
  },
  trigonalBipyramidal: {
    name: { ar: "هرمي ثلاثي مزدوج", en: "Trigonal Bipyramidal" },
    formula: "AX₅",
    bondAngle: [90, 120],
    electronGroups: 5,
    lonePairs: 0,
    examples: ["PCl₅", "PF₅"],
    description: { ar: "شكل هرمي ثلاثي مزدوج", en: "Double pyramidal shape" },
  },
  seesaw: {
    name: { ar: "أرجوحة", en: "Seesaw" },
    formula: "AX₄E",
    bondAngle: [90, 120],
    electronGroups: 5,
    lonePairs: 1,
    examples: ["SF₄", "TeCl₄"],
    description: { ar: "شكل أرجوحة مع زوج حر", en: "Seesaw shape with lone pair" },
  },
  octahedral: {
    name: { ar: "ثماني الوجوه", en: "Octahedral" },
    formula: "AX₆",
    bondAngle: 90,
    electronGroups: 6,
    lonePairs: 0,
    examples: ["SF₆", "PCl₆⁻"],
    description: { ar: "شكل ثماني السطوح", en: "Octahedral shape" },
  },
  squarePyramidal: {
    name: { ar: "هرمي مربع", en: "Square Pyramidal" },
    formula: "AX₅E",
    bondAngle: 90,
    electronGroups: 6,
    lonePairs: 1,
    examples: ["ClF₅", "BrF₅"],
    description: { ar: "شكل هرمي قاعدته مربعة", en: "Pyramid with square base" },
  },
};

export function MolecularGeometrySimulator({ language }: MolecularGeometrySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [selectedGeometry, setSelectedGeometry] = useState<keyof typeof geometries>("tetrahedral");
  const [rotationX, setRotationX] = useState(30);
  const [rotationY, setRotationY] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [showElectronClouds, setShowElectronClouds] = useState(true);

  const texts = {
    ar: {
      title: "محاكي هندسة الجزيئات (VSEPR)",
      description: "استكشف الأشكال الجزيئية بنظرية تنافر أزواج الإلكترونات",
      selectGeometry: "اختر الشكل الجزيئي",
      bondAngle: "زاوية الرابطة",
      electronGroups: "مجموعات الإلكترونات",
      bondingPairs: "أزواج الرابطة",
      lonePairs: "الأزواج الحرة",
      examples: "أمثلة",
      formula: "الصيغة",
      shape: "الشكل",
      rotationX: "الدوران الرأسي",
      rotationY: "الدوران الأفقي",
      showLonePairs: "إظهار الأزواج الحرة",
      showElectronClouds: "إظهار سحابات الإلكترونات",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      vseprTheory: "نظرية VSEPR",
      electronRepulsion: "تنافر الإلكترونات",
      molecularShape: "الشكل الجزيئي",
      hybridization: "التهجين",
      polarity: "القطبية",
      polar: "قطبي",
      nonpolar: "غير قطبي",
      electronDomains: "مجالات الإلكترونات",
    },
    en: {
      title: "Molecular Geometry Simulator (VSEPR)",
      description: "Explore molecular shapes using VSEPR theory",
      selectGeometry: "Select Molecular Shape",
      bondAngle: "Bond Angle",
      electronGroups: "Electron Groups",
      bondingPairs: "Bonding Pairs",
      lonePairs: "Lone Pairs",
      examples: "Examples",
      formula: "Formula",
      shape: "Shape",
      rotationX: "Vertical Rotation",
      rotationY: "Horizontal Rotation",
      showLonePairs: "Show Lone Pairs",
      showElectronClouds: "Show Electron Clouds",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      explanation: "Chemical Explanation",
      vseprTheory: "VSEPR Theory",
      electronRepulsion: "Electron Repulsion",
      molecularShape: "Molecular Shape",
      hybridization: "Hybridization",
      polarity: "Polarity",
      polar: "Polar",
      nonpolar: "Nonpolar",
      electronDomains: "Electron Domains",
    },
  };

  const t = texts[language];
  const geometry = geometries[selectedGeometry];

  // Get hybridization based on electron groups
  const getHybridization = (groups: number) => {
    switch (groups) {
      case 2: return "sp";
      case 3: return "sp²";
      case 4: return "sp³";
      case 5: return "sp³d";
      case 6: return "sp³d²";
      default: return "sp³";
    }
  };

  // Determine if molecule is polar
  const isPolar = geometry.lonePairs > 0 || selectedGeometry === "bent" || selectedGeometry === "trigonalPyramidal" || selectedGeometry === "seesaw" || selectedGeometry === "squarePyramidal";

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const bondLength = 70;
    const atomRadius = 20;
    const lonePairRadius = 8;

    // Convert degrees to radians
    const radX = (rotationX * Math.PI) / 180;
    const radY = (rotationY * Math.PI) / 180;

    // 3D projection function
    const project = (x: number, y: number, z: number) => {
      // Rotate around Y axis
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      
      // Rotate around X axis
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      
      // Simple perspective
      const scale = 1 + z2 / 500;
      return {
        x: centerX + x1 * scale,
        y: centerY + y1 * scale,
        z: z2,
        scale: scale,
      };
    };

    // Draw electron clouds first (background)
    if (showElectronClouds) {
      ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
      const cloudPositions = getAtomPositions(bondLength * 1.2, selectedGeometry);
      cloudPositions.forEach(pos => {
        const projected = project(pos.x, pos.y, pos.z);
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 35 * projected.scale, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Get atom positions based on geometry
    const atomPositions = getAtomPositions(bondLength, selectedGeometry);
    
    // Sort by z for proper rendering order
    const sortedPositions = atomPositions.map((pos, index) => ({
      ...pos,
      index,
      projected: project(pos.x, pos.y, pos.z),
    })).sort((a, b) => a.projected.z - b.projected.z);

    // Draw bonds first
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    sortedPositions.forEach(pos => {
      if (!pos.isLonePair && !pos.isCenter) {
        const centerProj = project(0, 0, 0);
        ctx.beginPath();
        ctx.moveTo(centerProj.x, centerProj.y);
        ctx.lineTo(pos.projected.x, pos.projected.y);
        ctx.stroke();
      }
    });

    // Draw central atom
    const centerProj = project(0, 0, 0);
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerProj.x, centerProj.y, atomRadius * centerProj.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${14 * centerProj.scale}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", centerProj.x, centerProj.y);

    // Draw surrounding atoms and lone pairs
    sortedPositions.forEach(pos => {
      if (pos.isCenter) return;
      
      const p = pos.projected;
      
      if (pos.isLonePair && showLonePairs) {
        // Draw lone pair
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(p.x - 5, p.y, lonePairRadius * p.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x + 5, p.y, lonePairRadius * p.scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = "#64748b";
        ctx.font = `bold ${10 * p.scale}px system-ui`;
        ctx.fillText("LP", p.x, p.y - 15 * p.scale);
      } else if (!pos.isLonePair) {
        // Draw atom
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(p.x, p.y, atomRadius * 0.8 * p.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${12 * p.scale}px system-ui`;
        ctx.fillText("X", p.x, p.y);
      }
    });

    // Draw bond angle
    if (atomPositions.length >= 3 && typeof geometry.bondAngle === "number") {
      ctx.fillStyle = "#6366f1";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${geometry.bondAngle}°`, centerX + 50, centerY - 60);
    }

    // Draw geometry name
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      (language === "ar" ? geometry.name.ar : geometry.name.en) + " (" + geometry.formula + ")",
      centerX,
      height - 20
    );

  }, [selectedGeometry, rotationX, rotationY, showLonePairs, showElectronClouds]);

  const getAtomPositions = (bondLength: number, geom: keyof typeof geometries) => {
    const positions: { x: number; y: number; z: number; isLonePair?: boolean; isCenter?: boolean }[] = [];
    const lp = geometries[geom].lonePairs;
    const eg = geometries[geom].electronGroups;
    const bp = eg - lp;

    // Center atom marker
    positions.push({ x: 0, y: 0, z: 0, isCenter: true });

    switch (geom) {
      case "linear":
        positions.push({ x: -bondLength, y: 0, z: 0 });
        positions.push({ x: bondLength, y: 0, z: 0 });
        break;
      case "trigonalPlanar":
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3;
          positions.push({ x: bondLength * Math.cos(angle), y: bondLength * Math.sin(angle), z: 0 });
        }
        break;
      case "bent":
        positions.push({ x: -bondLength * 0.9, y: bondLength * 0.5, z: 0 });
        positions.push({ x: bondLength * 0.9, y: bondLength * 0.5, z: 0 });
        positions.push({ x: 0, y: -bondLength, z: 0, isLonePair: true });
        break;
      case "tetrahedral":
        const tetAngles = [
          { x: 0, y: -1, z: 0 },
          { x: Math.sqrt(8) / 3, y: 1 / 3, z: 0 },
          { x: -Math.sqrt(2) / 3, y: 1 / 3, z: Math.sqrt(6) / 3 },
          { x: -Math.sqrt(2) / 3, y: 1 / 3, z: -Math.sqrt(6) / 3 },
        ];
        tetAngles.forEach(a => {
          positions.push({ x: a.x * bondLength, y: a.y * bondLength, z: a.z * bondLength });
        });
        break;
      case "trigonalPyramidal":
        positions.push({ x: 0, y: -bondLength, z: 0, isLonePair: true });
        const pyrAngles = [
          { x: Math.sqrt(8) / 3, y: 1 / 3, z: 0 },
          { x: -Math.sqrt(2) / 3, y: 1 / 3, z: Math.sqrt(6) / 3 },
          { x: -Math.sqrt(2) / 3, y: 1 / 3, z: -Math.sqrt(6) / 3 },
        ];
        pyrAngles.forEach(a => {
          positions.push({ x: a.x * bondLength, y: a.y * bondLength, z: a.z * bondLength });
        });
        break;
      case "bentTetrahedral":
        positions.push({ x: 0, y: -bondLength, z: 0, isLonePair: true });
        positions.push({ x: Math.sqrt(8) / 3 * bondLength, y: bondLength / 3, z: 0, isLonePair: true });
        positions.push({ x: -Math.sqrt(2) / 3 * bondLength, y: bondLength / 3, z: Math.sqrt(6) / 3 * bondLength });
        positions.push({ x: -Math.sqrt(2) / 3 * bondLength, y: bondLength / 3, z: -Math.sqrt(6) / 3 * bondLength });
        break;
      case "trigonalBipyramidal":
        // Axial
        positions.push({ x: 0, y: -bondLength, z: 0 });
        positions.push({ x: 0, y: bondLength, z: 0 });
        // Equatorial
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3;
          positions.push({ x: bondLength * 0.7 * Math.cos(angle), y: 0, z: bondLength * 0.7 * Math.sin(angle) });
        }
        break;
      case "seesaw":
        positions.push({ x: 0, y: -bondLength, z: 0, isLonePair: true });
        positions.push({ x: 0, y: bondLength, z: 0 });
        positions.push({ x: bondLength * 0.7, y: 0, z: 0 });
        positions.push({ x: -bondLength * 0.35, y: 0, z: bondLength * 0.6 });
        positions.push({ x: -bondLength * 0.35, y: 0, z: -bondLength * 0.6 });
        break;
      case "octahedral":
        positions.push({ x: 0, y: -bondLength, z: 0 });
        positions.push({ x: 0, y: bondLength, z: 0 });
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          positions.push({ x: bondLength * 0.7 * Math.cos(angle), y: 0, z: bondLength * 0.7 * Math.sin(angle) });
        }
        break;
      case "squarePyramidal":
        positions.push({ x: 0, y: -bondLength, z: 0, isLonePair: true });
        positions.push({ x: 0, y: bondLength, z: 0 });
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          positions.push({ x: bondLength * 0.7 * Math.cos(angle), y: 0, z: bondLength * 0.7 * Math.sin(angle) });
        }
        break;
    }

    return positions;
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Auto rotation
  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setRotationY(r => (r + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRotating]);

  const reset = () => {
    setRotationX(30);
    setRotationY(0);
    setIsRotating(true);
  };

  const bondingPairs = geometry.electronGroups - geometry.lonePairs;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Geometry Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectGeometry}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(geometries).map(([key, geom]) => (
              <Button
                key={key}
                variant={selectedGeometry === key ? "default" : "outline"}
                onClick={() => setSelectedGeometry(key as keyof typeof geometries)}
                size="sm"
                className={selectedGeometry === key ? "bg-violet-500" : ""}
              >
                {language === "ar" ? geom.name.ar : geom.name.en}
              </Button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="electronClouds"
              checked={showElectronClouds}
              onChange={(e) => setShowElectronClouds(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="electronClouds" className="text-sm">{t.showElectronClouds}</label>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.rotationX}</label>
              <Badge>{rotationX}°</Badge>
            </div>
            <Slider
              value={[rotationX]}
              onValueChange={([v]) => setRotationX(v)}
              min={-90}
              max={90}
              step={5}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.rotationY}</label>
              <Badge>{rotationY}°</Badge>
            </div>
            <Slider
              value={[rotationY]}
              onValueChange={([v]) => setRotationY(v)}
              min={0}
              max={359}
              step={5}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas ref={canvasRef} width={550} height={320} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-violet-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.formula}</p>
            <p className="font-bold text-violet-600">{geometry.formula}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.bondAngle}</p>
            <p className="font-bold text-purple-600">
              {Array.isArray(geometry.bondAngle) 
                ? `${geometry.bondAngle[0]}° / ${geometry.bondAngle[1]}°`
                : `${geometry.bondAngle}°`}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.bondingPairs}</p>
            <p className="font-bold text-blue-600">{bondingPairs}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.lonePairs}</p>
            <p className="font-bold text-red-600">{geometry.lonePairs}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">{t.hybridization}</p>
            <p className="font-bold text-slate-700">{getHybridization(geometry.electronGroups)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">{t.polarity}</p>
            <p className={`font-bold ${isPolar ? "text-red-600" : "text-green-600"}`}>
              {isPolar ? (language === "ar" ? t.polar : "Polar") : (language === "ar" ? t.nonpolar : "Nonpolar")}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">{t.examples}</p>
            <p className="font-bold text-slate-700">{geometry.examples.join(", ")}</p>
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
                <strong>نظرية VSEPR:</strong> تتخذ الجزيئات شكلاً يجعل زوايا التنافر بين أزواج الإلكترونات أكبر ما يمكن.
                الأزواج الحرة تتنافر أكثر من أزواج الرابطة، مما يقلل زوايا الرابطة.
                في شكل <strong>{geometry.name.ar}</strong>، زاوية الرابطة = {Array.isArray(geometry.bondAngle) 
                  ? `${geometry.bondAngle[0]}° أو ${geometry.bondAngle[1]}°`
                  : `${geometry.bondAngle}°`}.
              </>
            ) : (
              <>
                <strong>VSEPR Theory:</strong> Molecules adopt shapes that maximize angles between electron pairs.
                Lone pairs repel more than bonding pairs, reducing bond angles.
                In <strong>{geometry.name.en}</strong> shape, bond angle = {Array.isArray(geometry.bondAngle) 
                  ? `${geometry.bondAngle[0]}° or ${geometry.bondAngle[1]}°`
                  : `${geometry.bondAngle}°`}.
              </>
            )}
          </p>
          <p className="text-sm text-slate-600">
            <strong>{t.electronDomains}:</strong>{" "}
            {language === "ar"
              ? `${geometry.electronGroups} مجالات إلكترونية (${bondingPairs} رابطة + ${geometry.lonePairs} حر) = تهجين ${getHybridization(geometry.electronGroups)}`
              : `${geometry.electronGroups} electron domains (${bondingPairs} bonding + ${geometry.lonePairs} lone) = ${getHybridization(geometry.electronGroups)} hybridization`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRotating(!isRotating)} className="bg-violet-500 hover:bg-violet-600">
            {isRotating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRotating ? t.pause : t.start}
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
