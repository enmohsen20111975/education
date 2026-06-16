"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Link2, ArrowRight, RotateCcw, Play, Pause } from "lucide-react";

interface ChemicalBondSimulatorProps {
  language: "ar" | "en";
}

interface Atom {
  symbol: string;
  nameAr: string;
  nameEn: string;
  protons: number;
  electrons: number;
  valenceElectrons: number;
  color: string;
}

interface BondExample {
  type: "ionic" | "covalent";
  nameAr: string;
  nameEn: string;
  formula: string;
  atom1: Atom;
  atom2: Atom;
  descriptionAr: string;
  descriptionEn: string;
  electronTransfer?: number;
  sharedElectrons?: number;
}

const atoms: Atom[] = [
  { symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", protons: 11, electrons: 11, valenceElectrons: 1, color: "#ef4444" },
  { symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", protons: 17, electrons: 17, valenceElectrons: 7, color: "#22c55e" },
  { symbol: "Mg", nameAr: "مغنسيوم", nameEn: "Magnesium", protons: 12, electrons: 12, valenceElectrons: 2, color: "#f97316" },
  { symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", protons: 8, electrons: 8, valenceElectrons: 6, color: "#3b82f6" },
  { symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", protons: 1, electrons: 1, valenceElectrons: 1, color: "#a855f7" },
  { symbol: "Ca", nameAr: "كالسيوم", nameEn: "Calcium", protons: 20, electrons: 20, valenceElectrons: 2, color: "#eab308" },
  { symbol: "F", nameAr: "فلور", nameEn: "Fluorine", protons: 9, electrons: 9, valenceElectrons: 7, color: "#06b6d4" },
  { symbol: "C", nameAr: "كربون", nameEn: "Carbon", protons: 6, electrons: 6, valenceElectrons: 4, color: "#64748b" },
  { symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", protons: 7, electrons: 7, valenceElectrons: 5, color: "#8b5cf6" },
];

const bondExamples: BondExample[] = [
  {
    type: "ionic",
    nameAr: "كلوريد الصوديوم (ملح الطعام)",
    nameEn: "Sodium Chloride (Table Salt)",
    formula: "NaCl",
    atom1: atoms[0], // Na
    atom2: atoms[1], // Cl
    descriptionAr: "يمنح الصوديوم إلكتروناً واحداً للكلور، مما يكوّن رابطة أيونية",
    descriptionEn: "Sodium donates one electron to Chlorine, forming an ionic bond",
    electronTransfer: 1
  },
  {
    type: "ionic",
    nameAr: "أكسيد المغنسيوم",
    nameEn: "Magnesium Oxide",
    formula: "MgO",
    atom1: atoms[2], // Mg
    atom2: atoms[3], // O
    descriptionAr: "يمنح المغنسيوم إلكترونين للأكسجين، مما يكوّن رابطة أيونية",
    descriptionEn: "Magnesium donates two electrons to Oxygen, forming an ionic bond",
    electronTransfer: 2
  },
  {
    type: "covalent",
    nameAr: "الماء",
    nameEn: "Water",
    formula: "H₂O",
    atom1: atoms[4], // H
    atom2: atoms[3], // O
    descriptionAr: "يتشارك الهيدروجين والأكسجين في إلكترونين، مما يكوّن رابطة تساهمية",
    descriptionEn: "Hydrogen and Oxygen share two electrons, forming a covalent bond",
    sharedElectrons: 2
  },
  {
    type: "covalent",
    nameAr: "فلوريد الهيدروجين",
    nameEn: "Hydrogen Fluoride",
    formula: "HF",
    atom1: atoms[4], // H
    atom2: atoms[6], // F
    descriptionAr: "يتشارك الهيدروجين والفلور في إلكترون واحد",
    descriptionEn: "Hydrogen and Fluorine share one electron",
    sharedElectrons: 1
  },
  {
    type: "covalent",
    nameAr: "الميثان",
    nameEn: "Methane",
    formula: "CH₄",
    atom1: atoms[7], // C
    atom2: atoms[4], // H
    descriptionAr: "يتشارك الكربون مع 4 ذرات هيدروجين في روابط تساهمية",
    descriptionEn: "Carbon shares electrons with 4 Hydrogen atoms in covalent bonds",
    sharedElectrons: 8
  }
];

export function ChemicalBondSimulator({ language }: ChemicalBondSimulatorProps) {
  const [selectedBond, setSelectedBond] = useState<BondExample>(bondExamples[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [bondType, setBondType] = useState<"ionic" | "covalent">("ionic");
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكي الروابط الكيميائية" : "Chemical Bond Simulator",
    ionicBond: isRTL ? "الرابطة الأيونية" : "Ionic Bond",
    covalentBond: isRTL ? "الرابطة التساهمية" : "Covalent Bond",
    selectExample: isRTL ? "اختر مثالاً" : "Select Example",
    before: isRTL ? "قبل التفاعل" : "Before",
    after: isRTL ? "بعد التفاعل" : "After",
    play: isRTL ? "تشغيل" : "Play",
    pause: isRTL ? "إيقاف" : "Pause",
    reset: isRTL ? "إعادة" : "Reset",
    electronTransfer: isRTL ? "انتقال الإلكترونات" : "Electron Transfer",
    electronSharing: isRTL ? "تشارك الإلكترونات" : "Electron Sharing",
    valenceElectrons: isRTL ? "إلكترونات التكافؤ" : "Valence Electrons",
    resultingIons: isRTL ? "الأيونات الناتجة" : "Resulting Ions",
    molecule: isRTL ? "الجزيء الناتج" : "Resulting Molecule",
    ionicDesc: isRTL 
      ? "تتشكل عندما ينتقل إلكترون أو أكثر من ذرة إلى أخرى"
      : "Formed when one or more electrons transfer from one atom to another",
    covalentDesc: isRTL 
      ? "تتشكل عندما تتشارك ذرتان أو أكثر في إلكترونات"
      : "Formed when two or more atoms share electrons"
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const timer = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAnimating]);

  const filteredBonds = bondExamples.filter(b => b.type === bondType);

  const handlePlayPause = () => {
    if (!isAnimating) {
      setAnimationStep(0);
    }
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setAnimationStep(0);
  };

  const handleBondTypeChange = (type: "ionic" | "covalent") => {
    setBondType(type);
    const filtered = bondExamples.filter(b => b.type === type);
    setSelectedBond(filtered[0]);
    handleReset();
  };

  // Render an atom with valence electrons
  const renderAtom = (atom: Atom, showTransfer: boolean = false, isDonor: boolean = false, transferred: number = 0) => {
    const valence = atom.valenceElectrons;
    const currentValence = showTransfer 
      ? (isDonor ? valence - transferred : valence + transferred)
      : valence;
    
    return (
      <div className="flex flex-col items-center gap-2">
        {/* Atom visualization */}
        <div 
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: atom.color + "20",
            border: `3px solid ${atom.color}`
          }}
        >
          {/* Valence electrons orbit */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Electron shells */}
            {Array.from({ length: Math.min(8, currentValence) }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 40;
              const y = 50 + Math.sin(angle) * 40;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  className={isAnimating && showTransfer && i < transferred ? "animate-pulse" : ""}
                />
              );
            })}
          </svg>
          
          {/* Atom symbol */}
          <span className="text-2xl font-bold" style={{ color: atom.color }}>
            {atom.symbol}
          </span>
        </div>
        
        {/* Labels */}
        <div className="text-center">
          <div className="font-medium">{isRTL ? atom.nameAr : atom.nameEn}</div>
          <div className="text-xs text-slate-500">
            {isRTL ? `التكافؤ: ${currentValence}` : `Valence: ${currentValence}`}
          </div>
        </div>
      </div>
    );
  };

  // Render the bond animation
  const renderBondAnimation = () => {
    const showProcess = animationStep >= 1 && animationStep <= 2;
    const showResult = animationStep >= 3;
    
    return (
      <div className="relative bg-slate-900 rounded-xl p-6 min-h-[280px]">
        <div className="flex items-center justify-center gap-8">
          {/* First Atom */}
          <div className="transform transition-all duration-500">
            {renderAtom(
              selectedBond.atom1, 
              showResult, 
              selectedBond.type === "ionic",
              selectedBond.electronTransfer || 0
            )}
          </div>
          
          {/* Animation Arrow / Bond */}
          <div className="flex flex-col items-center gap-2">
            {selectedBond.type === "ionic" ? (
              <>
                {/* Electron transfer arrow */}
                {showProcess && (
                  <div className="flex items-center gap-2 animate-pulse">
                    <span className="text-blue-400 font-mono text-lg">e⁻</span>
                    <ArrowRight className="w-8 h-8 text-yellow-400" />
                  </div>
                )}
                
                {/* Bond formed */}
                {showResult && (
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-yellow-400" />
                    <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded" />
                    <div className="w-4 h-4 rounded-full bg-orange-400" />
                  </div>
                )}
                
                {!showProcess && !showResult && (
                  <div className="text-slate-500">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Electron sharing */}
                {showProcess && (
                  <div className="flex items-center gap-2 animate-pulse">
                    <span className="text-blue-400 font-mono text-sm">
                      {isRTL ? "تشارك" : "share"}
                    </span>
                  </div>
                )}
                
                {/* Covalent bond lines */}
                {showResult && (
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: Math.min(selectedBond.sharedElectrons || 1, 3) }).map((_, i) => (
                      <div key={i} className="w-12 h-0.5 bg-blue-400" />
                    ))}
                  </div>
                )}
                
                {!showProcess && !showResult && (
                  <div className="text-slate-500">
                    <Link2 className="w-8 h-8" />
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Second Atom */}
          <div className="transform transition-all duration-500">
            {renderAtom(
              selectedBond.atom2, 
              showResult, 
              selectedBond.type === "ionic",
              0
            )}
          </div>
        </div>
        
        {/* Result Label */}
        {showResult && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              {selectedBond.formula}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-purple-500" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bond Type Selector */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={bondType === "ionic" ? "default" : "outline"}
            onClick={() => handleBondTypeChange("ionic")}
            className={bondType === "ionic" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {labels.ionicBond}
          </Button>
          <Button
            variant={bondType === "covalent" ? "default" : "outline"}
            onClick={() => handleBondTypeChange("covalent")}
            className={bondType === "covalent" ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            {labels.covalentBond}
          </Button>
        </div>

        {/* Bond Type Description */}
        <div className={`p-4 rounded-xl text-center ${
          bondType === "ionic" 
            ? "bg-red-50 dark:bg-red-900/20" 
            : "bg-blue-50 dark:bg-blue-900/20"
        }`}>
          <p className="text-sm">
            {bondType === "ionic" ? labels.ionicDesc : labels.covalentDesc}
          </p>
        </div>

        {/* Bond Animation */}
        {renderBondAnimation()}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button onClick={handlePlayPause} className="gap-2">
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAnimating ? labels.pause : labels.play}
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {labels.reset}
          </Button>
        </div>

        {/* Example Selector */}
        <div>
          <Label className="text-sm font-medium mb-2 block">{labels.selectExample}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filteredBonds.map((bond, index) => (
              <Button
                key={index}
                variant={selectedBond.formula === bond.formula ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedBond(bond);
                  handleReset();
                }}
                className="flex flex-col items-center py-3"
              >
                <span className="font-bold">{bond.formula}</span>
                <span className="text-xs opacity-70">
                  {isRTL ? bond.nameAr.split(" ")[0] : bond.nameEn.split(" ")[0]}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Bond Info */}
        <div className={`p-4 rounded-xl ${
          selectedBond.type === "ionic"
            ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
            : "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
        }`}>
          <div className="flex items-center gap-4 mb-3">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {selectedBond.formula}
            </Badge>
            <span className="font-medium">
              {isRTL ? selectedBond.nameAr : selectedBond.nameEn}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isRTL ? selectedBond.descriptionAr : selectedBond.descriptionEn}
          </p>
          
          {/* Key facts */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold">
                {selectedBond.type === "ionic" 
                  ? selectedBond.electronTransfer 
                  : selectedBond.sharedElectrons}
              </div>
              <div className="text-xs text-slate-500">
                {selectedBond.type === "ionic"
                  ? (isRTL ? "إلكترونات منقولة" : "Electrons transferred")
                  : (isRTL ? "إلكترونات مشتركة" : "Electrons shared")}
              </div>
            </div>
            <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold">
                {selectedBond.type === "ionic"
                  ? (isRTL ? "أيون+" : "Ion+")
                  : (isRTL ? "جزيء" : "Molecule")}
              </div>
              <div className="text-xs text-slate-500">
                {isRTL ? "نوع الرابطة" : "Bond Type"}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Note */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <span className="text-purple-500">💡</span>
            {isRTL ? "معلومة مهمة" : "Key Concept"}
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            {bondType === "ionic" ? (
              <>
                <li>• {isRTL ? "الفلزات تميل لفقدان إلكترونات" : "Metals tend to lose electrons"}</li>
                <li>• {isRTL ? "اللافلزات تميل لاكتساب إلكترونات" : "Non-metals tend to gain electrons"}</li>
                <li>• {isRTL ? "تتكون أيونات موجبة وسالبة" : "Positive and negative ions are formed"}</li>
              </>
            ) : (
              <>
                <li>• {isRTL ? "اللافلزات تتشارك في الإلكترونات" : "Non-metals share electrons"}</li>
                <li>• {isRTL ? "كل ذرة تكمل مستوى طاقتها الخارجي" : "Each atom completes its outer shell"}</li>
                <li>• {isRTL ? "تتكون جزيئات مستقرة" : "Stable molecules are formed"}</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
