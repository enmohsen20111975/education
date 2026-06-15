"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Atom, Layers, Zap } from "lucide-react";

interface ElectronConfigurationSimulatorProps {
  language: "ar" | "en";
}

// Element data with electron configurations
const elements = [
  { symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", atomicNumber: 1, config: "1s¹" },
  { symbol: "He", nameAr: "هيليوم", nameEn: "Helium", atomicNumber: 2, config: "1s²" },
  { symbol: "Li", nameAr: "ليثيوم", nameEn: "Lithium", atomicNumber: 3, config: "1s² 2s¹" },
  { symbol: "Be", nameAr: "بريليوم", nameEn: "Beryllium", atomicNumber: 4, config: "1s² 2s²" },
  { symbol: "B", nameAr: "بورون", nameEn: "Boron", atomicNumber: 5, config: "1s² 2s² 2p¹" },
  { symbol: "C", nameAr: "كربون", nameEn: "Carbon", atomicNumber: 6, config: "1s² 2s² 2p²" },
  { symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", atomicNumber: 7, config: "1s² 2s² 2p³" },
  { symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", atomicNumber: 8, config: "1s² 2s² 2p⁴" },
  { symbol: "F", nameAr: "فلور", nameEn: "Fluorine", atomicNumber: 9, config: "1s² 2s² 2p⁵" },
  { symbol: "Ne", nameAr: "نيون", nameEn: "Neon", atomicNumber: 10, config: "1s² 2s² 2p⁶" },
  { symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", atomicNumber: 11, config: "1s² 2s² 2p⁶ 3s¹" },
  { symbol: "Mg", nameAr: "ماغنسيوم", nameEn: "Magnesium", atomicNumber: 12, config: "1s² 2s² 2p⁶ 3s²" },
  { symbol: "Al", nameAr: "ألومنيوم", nameEn: "Aluminum", atomicNumber: 13, config: "1s² 2s² 2p⁶ 3s² 3p¹" },
  { symbol: "Si", nameAr: "سيليكون", nameEn: "Silicon", atomicNumber: 14, config: "1s² 2s² 2p⁶ 3s² 3p²" },
  { symbol: "P", nameAr: "فوسفور", nameEn: "Phosphorus", atomicNumber: 15, config: "1s² 2s² 2p⁶ 3s² 3p³" },
  { symbol: "S", nameAr: "كبريت", nameEn: "Sulfur", atomicNumber: 16, config: "1s² 2s² 2p⁶ 3s² 3p⁴" },
  { symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", atomicNumber: 17, config: "1s² 2s² 2p⁶ 3s² 3p⁵" },
  { symbol: "Ar", nameAr: "أرجون", nameEn: "Argon", atomicNumber: 18, config: "1s² 2s² 2p⁶ 3s² 3p⁶" },
  { symbol: "K", nameAr: "بوتاسيوم", nameEn: "Potassium", atomicNumber: 19, config: "[Ar] 4s¹" },
  { symbol: "Ca", nameAr: "كالسيوم", nameEn: "Calcium", atomicNumber: 20, config: "[Ar] 4s²" },
];

export function ElectronConfigurationSimulator({ language }: ElectronConfigurationSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [selectedElement, setSelectedElement] = useState(elements[5]); // Carbon
  const [customElectrons, setCustomElectrons] = useState(6);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  const texts = {
    ar: {
      title: "محاكي التوزيع الإلكتروني",
      description: "تعلم كيف تتوزع الإلكترونات في مستويات الطاقة",
      selectElement: "اختر عنصر",
      customMode: "وضع مخصص",
      electrons: "عدد الإلكترونات",
      configuration: "التوزيع الإلكتروني",
      energyLevel: "مستوى الطاقة",
      sublevel: "المستوى الفرعي",
      electronsInLevel: "الإلكترونات",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      animate: "تحريك التوزيع",
      aufbau: "قاعدة أوفباو",
      aufbauDesc: "تمتلئ المستويات الفرعية بالترتيب: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p",
      pauli: "مبدأ باولي",
      pauliDesc: "كل مستوى فرعي يتسع لعدد محدود من الإلكترونات: s=2, p=6, d=10, f=14",
      hund: "قاعدة هند",
      hundDesc: "في المستويات الفرعية المتساوية الطاقة، تشغل الإلكترونات المدارات منفصلة أولاً",
      shells: "الأغلفة الإلكترونية",
      valence: "إلكترونات التكافؤ",
      core: "إلكترونات القلب",
    },
    en: {
      title: "Electron Configuration Simulator",
      description: "Learn how electrons distribute in energy levels",
      selectElement: "Select Element",
      customMode: "Custom Mode",
      electrons: "Number of Electrons",
      configuration: "Electron Configuration",
      energyLevel: "Energy Level",
      sublevel: "Sublevel",
      electronsInLevel: "Electrons",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      animate: "Animate Filling",
      aufbau: "Aufbau Principle",
      aufbauDesc: "Sublevels fill in order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p",
      pauli: "Pauli Exclusion Principle",
      pauliDesc: "Each sublevel holds limited electrons: s=2, p=6, d=10, f=14",
      hund: "Hund's Rule",
      hundDesc: "In equal-energy sublevels, electrons occupy separate orbitals first",
      shells: "Electron Shells",
      valence: "Valence Electrons",
      core: "Core Electrons",
    },
  };

  const t = texts[language];
  const electronCount = isCustomMode ? customElectrons : selectedElement.atomicNumber;

  // Calculate electron configuration
  const calculateConfiguration = (electrons: number): Map<string, number> => {
    const config = new Map<string, number>();
    const order = [
      { sub: "1s", max: 2 },
      { sub: "2s", max: 2 },
      { sub: "2p", max: 6 },
      { sub: "3s", max: 2 },
      { sub: "3p", max: 6 },
      { sub: "4s", max: 2 },
      { sub: "3d", max: 10 },
      { sub: "4p", max: 6 },
      { sub: "5s", max: 2 },
      { sub: "4d", max: 10 },
      { sub: "5p", max: 6 },
    ];

    let remaining = electrons;
    for (const { sub, max } of order) {
      if (remaining <= 0) break;
      const filled = Math.min(remaining, max);
      config.set(sub, filled);
      remaining -= filled;
    }

    return config;
  };

  const config = calculateConfiguration(electronCount);

  // Get shells info
  const getShellsInfo = (config: Map<string, number>): number[] => {
    const shells: number[] = [0, 0, 0, 0, 0];
    config.forEach((count, sublevel) => {
      const n = parseInt(sublevel[0]) - 1;
      shells[n] = (shells[n] || 0) + count;
    });
    return shells.filter(s => s > 0);
  };

  const shellsInfo = getShellsInfo(config);

  // Get valence electrons (electrons in outermost shell)
  const getValenceElectrons = (config: Map<string, number>): number => {
    let maxN = 0;
    let valence = 0;
    config.forEach((count, sublevel) => {
      const n = parseInt(sublevel[0]);
      if (n > maxN) {
        maxN = n;
        valence = count;
      } else if (n === maxN) {
        valence += count;
      }
    });
    return valence;
  };

  const valenceElectrons = getValenceElectrons(config);
  const coreElectrons = electronCount - valenceElectrons;

  // Draw the configuration
  const drawConfiguration = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    bgGradient.addColorStop(0, "#fefce8");
    bgGradient.addColorStop(1, "#fef9c3");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw energy diagram (left side)
    const diagramX = 80;
    const diagramY = 50;
    const levelHeight = 30;
    const levelSpacing = 45;

    // Energy levels
    const levels = [
      { n: 1, subs: ["1s"], y: 0 },
      { n: 2, subs: ["2s", "2p"], y: 1 },
      { n: 3, subs: ["3s", "3p", "3d"], y: 2.2 },
      { n: 4, subs: ["4s", "4p", "4d", "4f"], y: 3.5 },
    ];

    // Draw energy axis
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(diagramX, diagramY);
    ctx.lineTo(diagramX, diagramY + 4.5 * levelSpacing);
    ctx.stroke();

    // Energy label
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(language === "ar" ? "الطاقة ↑" : "Energy ↑", 0, 0);
    ctx.restore();

    // Draw levels
    levels.forEach((level) => {
      const y = diagramY + level.y * levelSpacing;

      // Level line
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(diagramX, y);
      ctx.lineTo(diagramX + 400, y);
      ctx.stroke();

      // Level number
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(`n = ${level.n}`, diagramX - 10, y + 4);

      // Sublevels
      level.subs.forEach((sub, i) => {
        const subX = diagramX + 30 + i * 100;
        const electronsInSub = config.get(sub) || 0;
        const maxElectrons = sub.includes("s") ? 2 : sub.includes("p") ? 6 : sub.includes("d") ? 10 : 14;
        const orbitalCount = maxElectrons / 2;

        // Sublevel box
        ctx.fillStyle = electronsInSub > 0 ? "#fef08a" : "#f8fafc";
        ctx.strokeStyle = electronsInSub > 0 ? "#eab308" : "#e2e8f0";
        ctx.lineWidth = electronsInSub > 0 ? 2 : 1;
        
        const boxWidth = orbitalCount * 25 + 20;
        ctx.fillRect(subX - 10, y - 12, boxWidth, 28);
        ctx.strokeRect(subX - 10, y - 12, boxWidth, 28);

        // Sublevel label
        ctx.fillStyle = "#374151";
        ctx.font = "bold 11px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(sub, subX - 5, y - 18);

        // Draw orbitals with electrons
        for (let orb = 0; orb < orbitalCount; orb++) {
          const orbX = subX + orb * 25 + 10;

          // Orbital box
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1;
          ctx.strokeRect(orbX - 8, y - 8, 20, 16);

          // Calculate electrons in this orbital
          const ePerOrbital = Math.ceil(electronsInSub / orbitalCount);
          const startOrb = orb * ePerOrbital;
          const eInThisOrb = Math.min(ePerOrbital, Math.max(0, electronsInSub - startOrb));

          // Draw electrons (arrows)
          if (eInThisOrb >= 1) {
            // Up arrow
            ctx.fillStyle = "#3b82f6";
            ctx.beginPath();
            ctx.moveTo(orbX - 3, y - 2);
            ctx.lineTo(orbX - 3, y + 4);
            ctx.lineTo(orbX - 5, y + 2);
            ctx.moveTo(orbX - 3, y - 2);
            ctx.lineTo(orbX - 1, y);
            ctx.stroke();
          }
          if (eInThisOrb >= 2) {
            // Down arrow
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.moveTo(orbX + 3, y + 4);
            ctx.lineTo(orbX + 3, y - 2);
            ctx.lineTo(orbX + 1, y);
            ctx.moveTo(orbX + 3, y + 4);
            ctx.lineTo(orbX + 5, y + 2);
            ctx.stroke();
          }
        }
      });
    });

    // Draw atom representation (right side)
    const atomX = centerX + 200;
    const atomY = centerY;

    // Shells
    const baseRadius = 30;
    shellsInfo.forEach((count, i) => {
      const radius = baseRadius + i * 25;
      
      ctx.strokeStyle = `hsl(${200 + i * 30}, 70%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(atomX, atomY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Electrons
      for (let e = 0; e < count; e++) {
        const angle = rotation + (e * 2 * Math.PI) / count;
        const ex = atomX + radius * Math.cos(angle);
        const ey = atomY + radius * Math.sin(angle);

        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(ex, ey, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Nucleus
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(atomX, atomY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Element symbol
    if (!isCustomMode) {
      ctx.fillStyle = "#374151";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(selectedElement.symbol, atomX, atomY + 5);
    }

  }, [config, shellsInfo, rotation, isCustomMode, selectedElement, language]);

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
    drawConfiguration();
  }, [drawConfiguration]);

  // Format configuration string
  const formatConfig = (config: Map<string, number>): string => {
    const parts: string[] = [];
    config.forEach((count, sub) => {
      if (count > 0) {
        const superscripts = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"];
        parts.push(`${sub}${superscripts[count] || count}`);
      }
    });
    return parts.join(" ");
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-3">
          <Button
            variant={!isCustomMode ? "default" : "outline"}
            onClick={() => setIsCustomMode(false)}
            className={!isCustomMode ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {t.selectElement}
          </Button>
          <Button
            variant={isCustomMode ? "default" : "outline"}
            onClick={() => setIsCustomMode(true)}
            className={isCustomMode ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {t.customMode}
          </Button>
        </div>

        {/* Element selector or custom slider */}
        {!isCustomMode ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {elements.slice(0, 12).map((el) => (
                <Button
                  key={el.symbol}
                  variant={selectedElement.symbol === el.symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedElement(el)}
                  className={selectedElement.symbol === el.symbol ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {el.symbol}
                </Button>
              ))}
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{selectedElement.symbol}</span>
                <span>{language === "ar" ? selectedElement.nameAr : selectedElement.nameEn}</span>
                <Badge variant="secondary">Z = {selectedElement.atomicNumber}</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.electrons}</label>
              <Badge className="bg-amber-500">{customElectrons}</Badge>
            </div>
            <Slider
              value={[customElectrons]}
              onValueChange={([value]) => setCustomElectrons(value)}
              min={1}
              max={36}
              step={1}
            />
          </div>
        )}

        {/* Control buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={() => setRotation(0)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas ref={canvasRef} width={700} height={350} className="w-full" />
        </div>

        {/* Configuration display */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t.configuration}:</span>
            <code className="text-lg font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded">
              {formatConfig(config)}
            </code>
          </div>
        </div>

        {/* Electron counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.electrons}</p>
            <p className="font-bold text-2xl text-blue-600">{electronCount}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.shells}</p>
            <p className="font-bold text-2xl text-purple-600">{shellsInfo.length}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.valence}</p>
            <p className="font-bold text-2xl text-green-600">{valenceElectrons}</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.core}</p>
            <p className="font-bold text-2xl text-orange-600">{coreElectrons}</p>
          </div>
        </div>

        {/* Shell distribution */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-medium mb-3">{t.shells}</h4>
          <div className="flex flex-wrap gap-3">
            {shellsInfo.map((count, i) => (
              <div key={i} className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {language === "ar" ? "غلاف" : "Shell"} {i + 1}: {count}
                </Badge>
                <div className="flex gap-1">
                  {Array.from({ length: count }).map((_, j) => (
                    <div key={j} className="w-3 h-3 rounded-full bg-blue-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <h5 className="font-bold text-blue-700 dark:text-blue-300">{t.aufbau}</h5>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">{t.aufbauDesc}</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Atom className="w-4 h-4 text-purple-500" />
              <h5 className="font-bold text-purple-700 dark:text-purple-300">{t.pauli}</h5>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400">{t.pauliDesc}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-green-500" />
              <h5 className="font-bold text-green-700 dark:text-green-300">{t.hund}</h5>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">{t.hundDesc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
