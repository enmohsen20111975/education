"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, CheckCircle2, XCircle, Lightbulb, ChevronLeft, ChevronRight, Trophy } from "lucide-react";

interface BalancingEquationsSimulatorProps {
  language: "ar" | "en";
}

interface Equation {
  id: string;
  equation: { ar: string; en: string };
  reactants: { symbol: string; coefficient: number; atoms: Record<string, number> }[];
  products: { symbol: string; coefficient: number; atoms: Record<string, number> }[];
  hint: { ar: string; en: string };
  difficulty: "easy" | "medium" | "hard";
}

const equations: Equation[] = [
  {
    id: "h2-o2",
    equation: { ar: "H₂ + O₂ → H₂O", en: "H₂ + O₂ → H₂O" },
    reactants: [
      { symbol: "H₂", coefficient: 2, atoms: { H: 2 } },
      { symbol: "O₂", coefficient: 1, atoms: { O: 2 } }
    ],
    products: [
      { symbol: "H₂O", coefficient: 2, atoms: { H: 2, O: 1 } }
    ],
    hint: {
      ar: "ابدأ بالأكسجين: تحتاج 2 ذرة أكسجين في النواتج، فضع 2 أمام H₂O، ثم وازن الهيدروجين.",
      en: "Start with oxygen: you need 2 oxygen atoms in products, so put 2 before H₂O, then balance hydrogen."
    },
    difficulty: "easy"
  },
  {
    id: "fe-o2",
    equation: { ar: "Fe + O₂ → Fe₂O₃", en: "Fe + O₂ → Fe₂O₃" },
    reactants: [
      { symbol: "Fe", coefficient: 4, atoms: { Fe: 1 } },
      { symbol: "O₂", coefficient: 3, atoms: { O: 2 } }
    ],
    products: [
      { symbol: "Fe₂O₃", coefficient: 2, atoms: { Fe: 2, O: 3 } }
    ],
    hint: {
      ar: "أوجد المضاعف المشترك الأصغر للأكسجين (2×3=6)، ثم وازن الحديد.",
      en: "Find the LCM for oxygen (2×3=6), then balance iron."
    },
    difficulty: "medium"
  },
  {
    id: "ch4-o2",
    equation: { ar: "CH₄ + O₂ → CO₂ + H₂O", en: "CH₄ + O₂ → CO₂ + H₂O" },
    reactants: [
      { symbol: "CH₄", coefficient: 1, atoms: { C: 1, H: 4 } },
      { symbol: "O₂", coefficient: 2, atoms: { O: 2 } }
    ],
    products: [
      { symbol: "CO₂", coefficient: 1, atoms: { C: 1, O: 2 } },
      { symbol: "H₂O", coefficient: 2, atoms: { H: 2, O: 1 } }
    ],
    hint: {
      ar: "وازن الكربون أولاً، ثم الهيدروجين، وأخيراً الأكسجين.",
      en: "Balance carbon first, then hydrogen, and finally oxygen."
    },
    difficulty: "medium"
  },
  {
    id: "al-hcl",
    equation: { ar: "Al + HCl → AlCl₃ + H₂", en: "Al + HCl → AlCl₃ + H₂" },
    reactants: [
      { symbol: "Al", coefficient: 2, atoms: { Al: 1 } },
      { symbol: "HCl", coefficient: 6, atoms: { H: 1, Cl: 1 } }
    ],
    products: [
      { symbol: "AlCl₃", coefficient: 2, atoms: { Al: 1, Cl: 3 } },
      { symbol: "H₂", coefficient: 3, atoms: { H: 2 } }
    ],
    hint: {
      ar: "وازن Al و Cl أولاً، ثم H. استخدم الأعداد الأصغر ممكن.",
      en: "Balance Al and Cl first, then H. Use the smallest whole numbers."
    },
    difficulty: "hard"
  },
  {
    id: "na-cl2",
    equation: { ar: "Na + Cl₂ → NaCl", en: "Na + Cl₂ → NaCl" },
    reactants: [
      { symbol: "Na", coefficient: 2, atoms: { Na: 1 } },
      { symbol: "Cl₂", coefficient: 1, atoms: { Cl: 2 } }
    ],
    products: [
      { symbol: "NaCl", coefficient: 2, atoms: { Na: 1, Cl: 1 } }
    ],
    hint: {
      ar: "الكلور ثنائي الذرة، تحتاج 2 NaCl للحصول على ذرتي كلور.",
      en: "Chlorine is diatomic, you need 2 NaCl to get 2 chlorine atoms."
    },
    difficulty: "easy"
  }
];

export function BalancingEquationsSimulator({ language }: BalancingEquationsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coefficients, setCoefficients] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const texts = {
    ar: {
      title: "لعبة موازنة المعادلات الكيميائية",
      description: "علّم نفسك موازنة المعادلات الكيميائية بطريقة تفاعلية",
      balance: "وازن المعادلة",
      check: "تحقق",
      hint: "تلميح",
      next: "التالي",
      previous: "السابق",
      reset: "إعادة",
      score: "النتيجة",
      attempts: "المحاولات",
      correct: "صحيح! 🎉",
      incorrect: "حاول مرة أخرى",
      balanced: "المعادلة متوازنة!",
      unbalanced: "المعادلة غير متوازنة",
      reactants: "المتتفاعلات",
      products: "النواتج",
      enterCoefficients: "أدخل المعاملات",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      equation: "المعادلة",
      atoms: "الذرات",
      explanation: "قانون حفظ الكتلة: عدد ذرات كل عنصر في المتفاعلات = عدد ذراته في النواتج"
    },
    en: {
      title: "Chemical Equation Balancing Game",
      description: "Learn to balance chemical equations interactively",
      balance: "Balance the Equation",
      check: "Check",
      hint: "Hint",
      next: "Next",
      previous: "Previous",
      reset: "Reset",
      score: "Score",
      attempts: "Attempts",
      correct: "Correct! 🎉",
      incorrect: "Try again",
      balanced: "Equation is balanced!",
      unbalanced: "Equation is unbalanced",
      reactants: "Reactants",
      products: "Products",
      enterCoefficients: "Enter Coefficients",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      equation: "Equation",
      atoms: "Atoms",
      explanation: "Law of Conservation of Mass: atoms of each element in reactants = atoms in products"
    },
  };

  const t = texts[language];
  const currentEquation = equations[currentIndex];

  // Initialize coefficients when equation changes
  useEffect(() => {
    const totalItems = currentEquation.reactants.length + currentEquation.products.length;
    setCoefficients(new Array(totalItems).fill(1));
    setIsCorrect(null);
    setShowHint(false);
  }, [currentIndex]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const countAtoms = (side: "reactants" | "products") => {
    const items = side === "reactants" ? currentEquation.reactants : currentEquation.products;
    const startIndex = side === "reactants" ? 0 : currentEquation.reactants.length;
    
    const atomCounts: Record<string, number> = {};
    
    items.forEach((item, idx) => {
      const coeff = coefficients[startIndex + idx] || 1;
      Object.entries(item.atoms).forEach(([atom, count]) => {
        atomCounts[atom] = (atomCounts[atom] || 0) + coeff * count;
      });
    });
    
    return atomCounts;
  };

  const checkBalance = () => {
    const reactantAtoms = countAtoms("reactants");
    const productAtoms = countAtoms("products");
    
    const allAtoms = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);
    
    let balanced = true;
    for (const atom of allAtoms) {
      if ((reactantAtoms[atom] || 0) !== (productAtoms[atom] || 0)) {
        balanced = false;
        break;
      }
    }
    
    setAttempts(a => a + 1);
    setIsCorrect(balanced);
    if (balanced) {
      setScore(s => s + 1);
    }
    return balanced;
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

    const reactantAtoms = countAtoms("reactants");
    const productAtoms = countAtoms("products");
    
    // Draw atom count comparison
    const atoms = [...new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)])];
    const barWidth = 50;
    const maxHeight = 100;
    const startX = 50;
    const baseY = height - 40;
    
    atoms.forEach((atom, idx) => {
      const x = startX + idx * (barWidth + 30);
      const reactantHeight = Math.min((reactantAtoms[atom] || 0) * 15, maxHeight);
      const productHeight = Math.min((productAtoms[atom] || 0) * 15, maxHeight);
      
      // Reactant bar (blue)
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(x, baseY - reactantHeight, barWidth / 2 - 2, reactantHeight);
      
      // Product bar (green)
      ctx.fillStyle = reactantAtoms[atom] === productAtoms[atom] ? "#22c55e" : "#ef4444";
      ctx.fillRect(x + barWidth / 2 + 2, baseY - productHeight, barWidth / 2 - 2, productHeight);
      
      // Atom label
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(atom, x + barWidth / 2, baseY + 20);
      
      // Count labels
      ctx.font = "12px system-ui";
      ctx.fillStyle = "#64748b";
      ctx.fillText(`${reactantAtoms[atom] || 0}`, x + barWidth / 4, baseY - reactantHeight - 5);
      ctx.fillText(`${productAtoms[atom] || 0}`, x + 3 * barWidth / 4, baseY - productHeight - 5);
    });

    // Legend
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(width - 150, 20, 15, 15);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(width - 150, 45, 15, 15);
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(t.reactants, width - 130, 32);
    ctx.fillText(t.products, width - 130, 57);

    // Base line
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, baseY);
    ctx.lineTo(width - 30, baseY);
    ctx.stroke();

  }, [coefficients, currentIndex, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const resetCoefficients = () => {
    const totalItems = currentEquation.reactants.length + currentEquation.products.length;
    setCoefficients(new Array(totalItems).fill(1));
    setIsCorrect(null);
  };

  const updateCoefficient = (index: number, value: number) => {
    const newCoeffs = [...coefficients];
    newCoeffs[index] = Math.max(1, Math.min(10, value));
    setCoefficients(newCoeffs);
    setIsCorrect(null);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Atom className="w-6 h-6" />
            </div>
            <div>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription className="text-emerald-100">{t.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Trophy className="w-5 h-5 mx-auto" />
              <p className="text-sm">{t.score}: {score}/{attempts}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {t.previous}
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(currentEquation.difficulty)}>
              {t[currentEquation.difficulty as keyof typeof t]}
            </Badge>
            <span className="text-sm text-slate-500">
              {currentIndex + 1} / {equations.length}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(i => Math.min(equations.length - 1, i + 1))}
            disabled={currentIndex === equations.length - 1}
          >
            {t.next}
            {language === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Equation Display */}
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-xs text-slate-500 mb-2">{t.equation}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {currentEquation.reactants.map((r, idx) => (
              <div key={`reactant-${idx}`} className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={coefficients[idx] || 1}
                  onChange={(e) => updateCoefficient(idx, parseInt(e.target.value) || 1)}
                  className="w-12 h-10 text-center border-2 border-slate-300 rounded-lg font-bold text-lg focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-xl font-mono font-bold">{r.symbol}</span>
                {idx < currentEquation.reactants.length - 1 && <span className="text-xl mx-1">+</span>}
              </div>
            ))}
            <span className="text-2xl mx-3">→</span>
            {currentEquation.products.map((p, idx) => {
              const globalIdx = currentEquation.reactants.length + idx;
              return (
                <div key={`product-${idx}`} className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={coefficients[globalIdx] || 1}
                    onChange={(e) => updateCoefficient(globalIdx, parseInt(e.target.value) || 1)}
                    className="w-12 h-10 text-center border-2 border-slate-300 rounded-lg font-bold text-lg focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-xl font-mono font-bold">{p.symbol}</span>
                  {idx < currentEquation.products.length - 1 && <span className="text-xl mx-1">+</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Atom Count Chart */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={200} className="w-full bg-slate-50" />
        </div>

        {/* Feedback */}
        {isCorrect !== null && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <p className="font-bold text-green-700">{t.correct}</p>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                <p className="font-bold text-red-700">{t.incorrect}</p>
              </>
            )}
          </div>
        )}

        {/* Hint */}
        {showHint && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>💡 {t.hint}:</strong> {currentEquation.hint[language]}
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-800">
            <strong>📖</strong> {t.explanation}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          <Button onClick={checkBalance} className="bg-emerald-500 hover:bg-emerald-600">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {t.check}
          </Button>
          <Button variant="outline" onClick={() => setShowHint(!showHint)}>
            <Lightbulb className="w-4 h-4 mr-2" />
            {t.hint}
          </Button>
          <Button variant="outline" onClick={resetCoefficients}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
