"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Atom, CircleDot, Circle } from "lucide-react";

interface AtomStructureSimulatorProps {
  language: "ar" | "en";
}

// Element data
const elements = [
  { symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", protons: 1, neutrons: 0, electrons: 1 },
  { symbol: "He", nameAr: "هيليوم", nameEn: "Helium", protons: 2, neutrons: 2, electrons: 2 },
  { symbol: "Li", nameAr: "ليثيوم", nameEn: "Lithium", protons: 3, neutrons: 4, electrons: 3 },
  { symbol: "Be", nameAr: "بريليوم", nameEn: "Beryllium", protons: 4, neutrons: 5, electrons: 4 },
  { symbol: "B", nameAr: "بورون", nameEn: "Boron", protons: 5, neutrons: 6, electrons: 5 },
  { symbol: "C", nameAr: "كربون", nameEn: "Carbon", protons: 6, neutrons: 6, electrons: 6 },
  { symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", protons: 7, neutrons: 7, electrons: 7 },
  { symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", protons: 8, neutrons: 8, electrons: 8 },
  { symbol: "F", nameAr: "فلور", nameEn: "Fluorine", protons: 9, neutrons: 10, electrons: 9 },
  { symbol: "Ne", nameAr: "نيون", nameEn: "Neon", protons: 10, neutrons: 10, electrons: 10 },
  { symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", protons: 11, neutrons: 12, electrons: 11 },
  { symbol: "Mg", nameAr: "ماغنسيوم", nameEn: "Magnesium", protons: 12, neutrons: 12, electrons: 12 },
  { symbol: "Al", nameAr: "ألومنيوم", nameEn: "Aluminum", protons: 13, neutrons: 14, electrons: 13 },
  { symbol: "Si", nameAr: "سيليكون", nameEn: "Silicon", protons: 14, neutrons: 14, electrons: 14 },
  { symbol: "P", nameAr: "فوسفور", nameEn: "Phosphorus", protons: 15, neutrons: 16, electrons: 15 },
  { symbol: "S", nameAr: "كبريت", nameEn: "Sulfur", protons: 16, neutrons: 16, electrons: 16 },
  { symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", protons: 17, neutrons: 18, electrons: 17 },
  { symbol: "Ar", nameAr: "أرجون", nameEn: "Argon", protons: 18, neutrons: 22, electrons: 18 },
];

export function AtomStructureSimulator({ language }: AtomStructureSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [selectedElement, setSelectedElement] = useState(elements[5]); // Carbon by default
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const [isRunning, setIsRunning] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [showLabels, setShowLabels] = useState(true);

  const texts = {
    ar: {
      title: "محاكي البناء الذري",
      description: "استكشف بنية الذرة: البروتونات والنيوترونات والإلكترونات",
      protons: "البروتونات",
      neutrons: "النيوترونات",
      electrons: "الإلكترونات",
      element: "العنصر",
      customElement: "عنصر مخصص",
      nucleus: "النواة",
      electronShells: "الأغلفة الإلكترونية",
      atomicNumber: "العدد الذري",
      massNumber: "الكتلة الذرية",
      charge: "الشحنة",
      neutral: "متعادل",
      positive: "موجب",
      negative: "سالب",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      showLabels: "إظهار التسميات",
      proton: "بروتون (+)",
      neutron: "نيوترون (0)",
      electron: "إلكترون (-)",
      shell: "غلاف",
      explanation: "التفسير الكيميائي",
      nucleusInfo: "تحتوي النواة على البروتونات (موجبة الشحنة) والنيوترونات (متعادلة)، وهي مسؤولة عن معظم كتلة الذرة.",
      electronInfo: "تدور الإلكترونات (سالبة الشحنة) حول النواة في مستويات طاقة محددة تسمى الأغلفة الإلكترونية.",
      chargeInfo: "الذرة المتعادلة: عدد البروتونات = عدد الإلكترونات. عند اختلافهما تتكون أيون مشحون.",
    },
    en: {
      title: "Atomic Structure Simulator",
      description: "Explore atomic structure: protons, neutrons, and electrons",
      protons: "Protons",
      neutrons: "Neutrons",
      electrons: "Electrons",
      element: "Element",
      customElement: "Custom Element",
      nucleus: "Nucleus",
      electronShells: "Electron Shells",
      atomicNumber: "Atomic Number",
      massNumber: "Mass Number",
      charge: "Charge",
      neutral: "Neutral",
      positive: "Positive",
      negative: "Negative",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      showLabels: "Show Labels",
      proton: "Proton (+)",
      neutron: "Neutron (0)",
      electron: "Electron (-)",
      shell: "Shell",
      explanation: "Chemical Explanation",
      nucleusInfo: "The nucleus contains protons (positively charged) and neutrons (neutral), and is responsible for most of the atom's mass.",
      electronInfo: "Electrons (negatively charged) orbit the nucleus in specific energy levels called electron shells.",
      chargeInfo: "Neutral atom: number of protons = number of electrons. When they differ, a charged ion is formed.",
    },
  };

  const t = texts[language];

  // Calculate electron shells (2, 8, 18 rule)
  const getElectronShells = (electronCount: number): number[] => {
    const shells: number[] = [];
    const maxElectrons = [2, 8, 18, 32, 32, 18, 8];
    let remaining = electronCount;
    
    for (let i = 0; i < maxElectrons.length && remaining > 0; i++) {
      const inShell = Math.min(remaining, maxElectrons[i]);
      shells.push(inShell);
      remaining -= inShell;
    }
    
    return shells;
  };

  const shells = getElectronShells(electrons);
  const charge = protons - electrons;
  const chargeText = charge === 0 ? t.neutral : charge > 0 ? `+${charge}` : `${charge}`;

  // Draw the atom
  const drawAtom = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    bgGradient.addColorStop(0, "#f0f9ff");
    bgGradient.addColorStop(1, "#e0f2fe");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw electron shells (orbits)
    const baseRadius = 50;
    const shellSpacing = 40;

    shells.forEach((_, index) => {
      const radius = baseRadius + index * shellSpacing;
      ctx.strokeStyle = "rgba(100, 116, 139, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (showLabels) {
        ctx.fillStyle = "#64748b";
        ctx.font = "12px system-ui";
        ctx.textAlign = language === "ar" ? "right" : "left";
        ctx.fillText(`${t.shell} ${index + 1}`, language === "ar" ? centerX - radius - 5 : centerX + radius + 5, centerY);
      }
    });

    // Draw electrons on shells with rotation
    let electronIndex = 0;
    shells.forEach((electronCount, shellIndex) => {
      const radius = baseRadius + shellIndex * shellSpacing;
      const angleStep = (Math.PI * 2) / electronCount;

      for (let i = 0; i < electronCount; i++) {
        const angle = rotation + i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Electron glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        glowGradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
        glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)");
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Electron
        const electronGradient = ctx.createRadialGradient(x - 2, y - 2, 0, x, y, 8);
        electronGradient.addColorStop(0, "#60a5fa");
        electronGradient.addColorStop(1, "#2563eb");
        ctx.fillStyle = electronGradient;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Minus sign
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.stroke();

        electronIndex++;
      }
    });

    // Draw nucleus
    const nucleusRadius = Math.max(25, 15 + Math.sqrt(protons + neutrons) * 3);
    
    // Nucleus glow
    const nucleusGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nucleusRadius + 10);
    nucleusGlow.addColorStop(0, "rgba(239, 68, 68, 0.3)");
    nucleusGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
    ctx.fillStyle = nucleusGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius + 10, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus background
    const nucleusGradient = ctx.createRadialGradient(centerX - 5, centerY - 5, 0, centerX, centerY, nucleusRadius);
    nucleusGradient.addColorStop(0, "#fca5a5");
    nucleusGradient.addColorStop(1, "#dc2626");
    ctx.fillStyle = nucleusGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw protons and neutrons inside nucleus
    const particles = protons + neutrons;
    const particleRadius = 6;
    const rows = Math.ceil(Math.sqrt(particles));
    
    let pIndex = 0;
    let nIndex = 0;
    
    for (let row = 0; row < rows && (pIndex < protons || nIndex < neutrons); row++) {
      const colsInRow = Math.min(rows, particles - row * rows);
      const startX = centerX - (colsInRow - 1) * particleRadius;
      const y = centerY - (rows - 1) * particleRadius / 2 + row * particleRadius * 1.2;
      
      for (let col = 0; col < colsInRow && (pIndex < protons || nIndex < neutrons); col++) {
        const x = startX + col * particleRadius * 2;
        const isProton = pIndex < protons;
        
        if (isProton) {
          // Proton
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(x, y, particleRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Plus sign
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
          
          pIndex++;
        } else {
          // Neutron
          ctx.fillStyle = "#94a3b8";
          ctx.beginPath();
          ctx.arc(x, y, particleRadius, 0, Math.PI * 2);
          ctx.fill();
          
          nIndex++;
        }
      }
    }

    // Legend
    if (showLabels) {
      const legendX = language === "ar" ? width - 120 : 20;
      const legendY = 20;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillRect(legendX, legendY, 100, 80);
      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(legendX, legendY, 100, 80);

      ctx.font = "11px system-ui";
      ctx.textAlign = language === "ar" ? "right" : "left";
      const textX = language === "ar" ? legendX + 90 : legendX + 25;

      // Proton legend
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(language === "ar" ? legendX + 80 : legendX + 12, legendY + 18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#374151";
      ctx.fillText(t.proton, textX, legendY + 22);

      // Neutron legend
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(language === "ar" ? legendX + 80 : legendX + 12, legendY + 40, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#374151";
      ctx.fillText(t.neutron, textX, legendY + 44);

      // Electron legend
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(language === "ar" ? legendX + 80 : legendX + 12, legendY + 62, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#374151";
      ctx.fillText(t.electron, textX, legendY + 66);
    }

  }, [protons, neutrons, electrons, rotation, showLabels, shells, t, language]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      setRotation(prev => prev + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  // Draw
  useEffect(() => {
    drawAtom();
  }, [drawAtom]);

  // Handle element selection
  const handleElementSelect = (element: typeof elements[0]) => {
    setSelectedElement(element);
    setProtons(element.protons);
    setNeutrons(element.neutrons);
    setElectrons(element.electrons);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-red-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Element selector */}
        <div className="space-y-3">
          <label className="font-medium">{t.element}</label>
          <div className="flex flex-wrap gap-2">
            {elements.slice(0, 10).map((el) => (
              <Button
                key={el.symbol}
                variant={selectedElement?.symbol === el.symbol ? "default" : "outline"}
                size="sm"
                onClick={() => handleElementSelect(el)}
                className={selectedElement?.symbol === el.symbol ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {el.symbol}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <CircleDot className="w-4 h-4 text-red-500" />
                {t.protons}
              </label>
              <Badge variant="destructive">{protons}</Badge>
            </div>
            <Slider
              value={[protons]}
              onValueChange={([value]) => setProtons(value)}
              min={1}
              max={20}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <Circle className="w-4 h-4 text-slate-400" />
                {t.neutrons}
              </label>
              <Badge variant="secondary">{neutrons}</Badge>
            </div>
            <Slider
              value={[neutrons]}
              onValueChange={([value]) => setNeutrons(value)}
              min={0}
              max={30}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <Circle className="w-4 h-4 text-blue-500" />
                {t.electrons}
              </label>
              <Badge className="bg-blue-500">{electrons}</Badge>
            </div>
            <Slider
              value={[electrons]}
              onValueChange={([value]) => setElectrons(value)}
              min={0}
              max={20}
              step={1}
            />
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-red-500 hover:bg-red-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={() => { setRotation(0); }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
          <Button
            variant={showLabels ? "default" : "outline"}
            onClick={() => setShowLabels(!showLabels)}
          >
            {t.showLabels}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.atomicNumber}</p>
            <p className="font-bold text-2xl text-red-600">{protons}</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.massNumber}</p>
            <p className="font-bold text-2xl text-orange-600">{protons + neutrons}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.electrons}</p>
            <p className="font-bold text-2xl text-blue-600">{electrons}</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${charge === 0 ? "bg-green-50 dark:bg-green-950" : charge > 0 ? "bg-red-50 dark:bg-red-950" : "bg-blue-50 dark:bg-blue-950"}`}>
            <p className="text-xs text-slate-500">{t.charge}</p>
            <p className={`font-bold text-2xl ${charge === 0 ? "text-green-600" : charge > 0 ? "text-red-600" : "text-blue-600"}`}>{chargeText}</p>
          </div>
        </div>

        {/* Electron shells */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-medium mb-2">{t.electronShells}</h4>
          <div className="flex flex-wrap gap-2">
            {shells.map((count, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {t.shell} {index + 1}: {count} {t.electrons}
              </Badge>
            ))}
          </div>
        </div>

        {/* Chemical explanation */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-bold mb-2 text-amber-700 dark:text-amber-300">{t.explanation}</h4>
          <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1" style={{ listStyleType: "disc", paddingInlineStart: "20px" }}>
            <li>{t.nucleusInfo}</li>
            <li>{t.electronInfo}</li>
            <li>{t.chargeInfo}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
