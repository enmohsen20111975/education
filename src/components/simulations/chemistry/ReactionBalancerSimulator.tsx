"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Scale, Check, X, RefreshCw, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

interface ReactionBalancerSimulatorProps {
  language: "ar" | "en";
}

interface ChemicalEquation {
  id: string;
  reactants: { formula: string; coefficient: number; display: string }[];
  products: { formula: string; coefficient: number; display: string }[];
  type: "synthesis" | "decomposition" | "single-replacement" | "double-replacement" | "combustion";
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  hintAr: string;
  hintEn: string;
}

const chemicalEquations: ChemicalEquation[] = [
  {
    id: "h2-o2-h2o",
    reactants: [
      { formula: "H₂", coefficient: 2, display: "H₂" },
      { formula: "O₂", coefficient: 1, display: "O₂" }
    ],
    products: [
      { formula: "H₂O", coefficient: 2, display: "H₂O" }
    ],
    type: "synthesis",
    nameAr: "تفاعل تكون الماء",
    nameEn: "Water Formation Reaction",
    descriptionAr: "يتفاعل الهيدروجين مع الأكسجين لتكوين الماء",
    descriptionEn: "Hydrogen reacts with Oxygen to form water",
    hintAr: "العدد الأصغر المشترك للذرات هو المفتاح",
    hintEn: "The least common multiple of atoms is the key"
  },
  {
    id: "fe-o2-fe2o3",
    reactants: [
      { formula: "Fe", coefficient: 4, display: "Fe" },
      { formula: "O₂", coefficient: 3, display: "O₂" }
    ],
    products: [
      { formula: "Fe₂O₃", coefficient: 2, display: "Fe₂O₃" }
    ],
    type: "synthesis",
    nameAr: "صدأ الحديد",
    nameEn: "Iron Rusting",
    descriptionAr: "يتفاعل الحديد مع الأكسجين لتكوين أكسيد الحديد (الصدأ)",
    descriptionEn: "Iron reacts with Oxygen to form Iron Oxide (rust)",
    hintAr: "وازن الأكسجين أولاً (عدد زوجي)",
    hintEn: "Balance oxygen first (even number)"
  },
  {
    id: "na-cl2-nacl",
    reactants: [
      { formula: "Na", coefficient: 2, display: "Na" },
      { formula: "Cl₂", coefficient: 1, display: "Cl₂" }
    ],
    products: [
      { formula: "NaCl", coefficient: 2, display: "NaCl" }
    ],
    type: "synthesis",
    nameAr: "تفاعل تكون ملح الطعام",
    nameEn: "Table Salt Formation",
    descriptionAr: "يتفاعل الصوديوم مع الكلور لتكوين كلوريد الصوديوم",
    descriptionEn: "Sodium reacts with Chlorine to form Sodium Chloride",
    hintAr: "لدينا ذرتا كلور في المتفاعلات",
    hintEn: "We have 2 chlorine atoms in reactants"
  },
  {
    id: "ch4-o2-co2-h2o",
    reactants: [
      { formula: "CH₄", coefficient: 1, display: "CH₄" },
      { formula: "O₂", coefficient: 2, display: "O₂" }
    ],
    products: [
      { formula: "CO₂", coefficient: 1, display: "CO₂" },
      { formula: "H₂O", coefficient: 2, display: "H₂O" }
    ],
    type: "combustion",
    nameAr: "احتراق الميثان",
    nameEn: "Methane Combustion",
    descriptionAr: "يحترق الميثان في وجود الأكسجين منتجاً ثاني أكسيد الكربون والماء",
    descriptionEn: "Methane burns in the presence of Oxygen producing CO₂ and water",
    hintAr: "ابدأ بالكربون، ثم الهيدروجين، ثم الأكسجين",
    hintEn: "Start with carbon, then hydrogen, then oxygen"
  },
  {
    id: "mg-hcl-mgcl2-h2",
    reactants: [
      { formula: "Mg", coefficient: 1, display: "Mg" },
      { formula: "HCl", coefficient: 2, display: "HCl" }
    ],
    products: [
      { formula: "MgCl₂", coefficient: 1, display: "MgCl₂" },
      { formula: "H₂", coefficient: 1, display: "H₂" }
    ],
    type: "single-replacement",
    nameAr: "تفاعل المغنسيوم مع حمض الهيدروكلوريك",
    nameEn: "Magnesium with Hydrochloric Acid",
    descriptionAr: "يحل المغنسيوم محل الهيدروجين في الحمض",
    descriptionEn: "Magnesium replaces Hydrogen in the acid",
    hintAr: "لدينا ذرة ماغنسيوم واحدة وذرتي هيدروجين",
    hintEn: "We have one Mg atom and need 2 H atoms"
  },
  {
    id: "naoh-hcl-nacl-h2o",
    reactants: [
      { formula: "NaOH", coefficient: 1, display: "NaOH" },
      { formula: "HCl", coefficient: 1, display: "HCl" }
    ],
    products: [
      { formula: "NaCl", coefficient: 1, display: "NaCl" },
      { formula: "H₂O", coefficient: 1, display: "H₂O" }
    ],
    type: "double-replacement",
    nameAr: "تفاعل التعادل",
    nameEn: "Neutralization Reaction",
    descriptionAr: "يتفاعل هيدروكسيد الصوديوم مع حمض الهيدروكلوريك لتكوين ملح وماء",
    descriptionEn: "Sodium hydroxide reacts with HCl to form salt and water",
    hintAr: "المعادلة متوازنة بالفعل!",
    hintEn: "The equation is already balanced!"
  },
  {
    id: "caco3-cao-co2",
    reactants: [
      { formula: "CaCO₃", coefficient: 1, display: "CaCO₃" }
    ],
    products: [
      { formula: "CaO", coefficient: 1, display: "CaO" },
      { formula: "CO₂", coefficient: 1, display: "CO₂" }
    ],
    type: "decomposition",
    nameAr: "تحلل كربونات الكالسيوم",
    nameEn: "Calcium Carbonate Decomposition",
    descriptionAr: "تتحلل كربونات الكالسيوم بالحرارة إلى أكسيد الكالسيوم وثاني أكسيد الكربون",
    descriptionEn: "Calcium carbonate decomposes with heat to CaO and CO₂",
    hintAr: "عد الذرات في كل جانب",
    hintEn: "Count atoms on each side"
  }
];

const reactionTypeLabels = {
  synthesis: { ar: "تفاعل اتحاد", en: "Synthesis Reaction", color: "bg-green-500" },
  decomposition: { ar: "تفاعل تحلل", en: "Decomposition Reaction", color: "bg-orange-500" },
  "single-replacement": { ar: "تفاعل إحلال أحادي", en: "Single Replacement", color: "bg-blue-500" },
  "double-replacement": { ar: "تفاعل إحلال ثنائي", en: "Double Replacement", color: "bg-purple-500" },
  combustion: { ar: "تفاعل احتراق", en: "Combustion Reaction", color: "bg-red-500" }
};

export function ReactionBalancerSimulator({ language }: ReactionBalancerSimulatorProps) {
  const [selectedEquation, setSelectedEquation] = useState<ChemicalEquation>(chemicalEquations[0]);
  const [userCoefficients, setUserCoefficients] = useState<Record<string, string>>({});
  const [isBalanced, setIsBalanced] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "مُوازن المعادلات الكيميائية" : "Chemical Equation Balancer",
    instructions: isRTL 
      ? "أدخل المعاملات المناسبة لتحقيق التوازن في المعادلة الكيميائية"
      : "Enter the correct coefficients to balance the chemical equation",
    reactants: isRTL ? "المتفاعلات" : "Reactants",
    products: isRTL ? "النواتج" : "Products",
    check: isRTL ? "تحقق" : "Check",
    reset: isRTL ? "إعادة" : "Reset",
    hint: isRTL ? "تلميح" : "Hint",
    showSolution: isRTL ? "إظهار الحل" : "Show Solution",
    hideSolution: isRTL ? "إخفاء الحل" : "Hide Solution",
    balanced: isRTL ? "المعادلة متوازنة! 🎉" : "Equation is balanced! 🎉",
    notBalanced: isRTL ? "المعادلة غير متوازنة، حاول مرة أخرى" : "Equation is not balanced, try again",
    selectEquation: isRTL ? "اختر معادلة" : "Select Equation",
    score: isRTL ? "النتيجة" : "Score",
    coefficient: isRTL ? "المعامل" : "Coefficient",
    newEquation: isRTL ? "معادلة جديدة" : "New Equation",
    lawOfConservation: isRTL 
      ? "قانون حفظ الكتلة: عدد ذرات كل عنصر في المتفاعلات = عدد ذرات كل عنصر في النواتج"
      : "Law of Conservation of Mass: Number of atoms of each element in reactants = Number of atoms in products"
  };

  // Initialize coefficients when equation changes
  useEffect(() => {
    const initialCoefficients: Record<string, string> = {};
    selectedEquation.reactants.forEach(r => {
      initialCoefficients[`r-${r.formula}`] = "";
    });
    selectedEquation.products.forEach(p => {
      initialCoefficients[`p-${p.formula}`] = "";
    });
    setUserCoefficients(initialCoefficients);
    setIsBalanced(null);
    setShowHint(false);
    setShowSolution(false);
  }, [selectedEquation]);

  const handleCoefficientChange = (key: string, value: string) => {
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setUserCoefficients(prev => ({ ...prev, [key]: value }));
      setIsBalanced(null);
    }
  };

  const checkBalance = () => {
    let correct = true;
    
    // Check reactants
    for (const r of selectedEquation.reactants) {
      const key = `r-${r.formula}`;
      const userValue = parseInt(userCoefficients[key]) || 0;
      if (userValue !== r.coefficient) {
        correct = false;
        break;
      }
    }
    
    // Check products
    if (correct) {
      for (const p of selectedEquation.products) {
        const key = `p-${p.formula}`;
        const userValue = parseInt(userCoefficients[key]) || 0;
        if (userValue !== p.coefficient) {
          correct = false;
          break;
        }
      }
    }
    
    setIsBalanced(correct);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleReset = () => {
    const initialCoefficients: Record<string, string> = {};
    selectedEquation.reactants.forEach(r => {
      initialCoefficients[`r-${r.formula}`] = "";
    });
    selectedEquation.products.forEach(p => {
      initialCoefficients[`p-${p.formula}`] = "";
    });
    setUserCoefficients(initialCoefficients);
    setIsBalanced(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleNewEquation = () => {
    const currentIndex = chemicalEquations.findIndex(e => e.id === selectedEquation.id);
    const nextIndex = (currentIndex + 1) % chemicalEquations.length;
    setSelectedEquation(chemicalEquations[nextIndex]);
  };

  const fillSolution = () => {
    const solutionCoefficients: Record<string, string> = {};
    selectedEquation.reactants.forEach(r => {
      solutionCoefficients[`r-${r.formula}`] = r.coefficient.toString();
    });
    selectedEquation.products.forEach(p => {
      solutionCoefficients[`p-${p.formula}`] = p.coefficient.toString();
    });
    setUserCoefficients(solutionCoefficients);
    setShowSolution(true);
  };

  // Render a compound with coefficient input
  const renderCompound = (
    compound: { formula: string; coefficient: number; display: string },
    type: "reactant" | "product",
    index: number,
    total: number
  ) => {
    const key = type === "reactant" ? `r-${compound.formula}` : `p-${compound.formula}`;
    const showPlus = index < total - 1;
    
    return (
      <div key={compound.formula} className="flex items-center gap-2">
        <Input
          type="text"
          value={userCoefficients[key] || ""}
          onChange={(e) => handleCoefficientChange(key, e.target.value)}
          placeholder="?"
          className="w-12 h-10 text-center font-mono text-lg"
        />
        <span className="text-xl font-mono font-medium">{compound.display}</span>
        {showPlus && (
          <span className="text-2xl font-bold text-slate-400 mx-2">+</span>
        )}
      </div>
    );
  };

  const reactionType = reactionTypeLabels[selectedEquation.type];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            {labels.title}
          </div>
          <Badge variant="secondary" className="text-sm">
            {labels.score}: {score.correct}/{score.total}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-center">{labels.instructions}</p>
          <p className="text-xs text-slate-500 text-center mt-2">{labels.lawOfConservation}</p>
        </div>

        {/* Reaction Type Badge */}
        <div className="flex justify-center">
          <Badge className={`${reactionType.color} text-white`}>
            {isRTL ? reactionType.ar : reactionType.en}
          </Badge>
        </div>

        {/* Equation Display */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
          {/* Reactants */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="text-sm font-medium text-slate-500 mr-2">{labels.reactants}:</span>
            {selectedEquation.reactants.map((r, i) => 
              renderCompound(r, "reactant", i, selectedEquation.reactants.length)
            )}
          </div>
          
          {/* Arrow */}
          <div className="flex justify-center my-4">
            <div className="flex items-center gap-2">
              <div className="w-16 h-0.5 bg-slate-300 dark:bg-slate-600" />
              <span className="text-2xl">→</span>
              <div className="w-16 h-0.5 bg-slate-300 dark:bg-slate-600" />
            </div>
          </div>
          
          {/* Products */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-medium text-slate-500 mr-2">{labels.products}:</span>
            {selectedEquation.products.map((p, i) => 
              renderCompound(p, "product", i, selectedEquation.products.length)
            )}
          </div>
        </div>

        {/* Result Message */}
        {isBalanced !== null && (
          <div className={`p-4 rounded-xl flex items-center justify-center gap-3 ${
            isBalanced 
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}>
            {isBalanced ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium">
              {isBalanced ? labels.balanced : labels.notBalanced}
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={checkBalance} className="gap-2">
            <Check className="w-4 h-4" />
            {labels.check}
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {labels.reset}
          </Button>
          <Button 
            onClick={() => setShowHint(!showHint)} 
            variant="outline"
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {labels.hint}
            {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={() => showSolution ? setShowSolution(false) : fillSolution()} 
            variant="outline"
            className="gap-2"
          >
            {showSolution ? labels.hideSolution : labels.showSolution}
          </Button>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <p className="text-sm text-center">
              💡 {isRTL ? selectedEquation.hintAr : selectedEquation.hintEn}
            </p>
          </div>
        )}

        {/* Equation Description */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <h4 className="font-medium mb-2">
            {isRTL ? selectedEquation.nameAr : selectedEquation.nameEn}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isRTL ? selectedEquation.descriptionAr : selectedEquation.descriptionEn}
          </p>
        </div>

        {/* Equation Selector */}
        <div>
          <Label className="text-sm font-medium mb-2 block">{labels.selectEquation}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {chemicalEquations.map((eq) => (
              <Button
                key={eq.id}
                variant={selectedEquation.id === eq.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEquation(eq)}
                className="text-xs h-auto py-2"
              >
                {eq.reactants.map(r => r.display).join(" + ")} → {eq.products.map(p => p.display).join(" + ")}
              </Button>
            ))}
          </div>
        </div>

        {/* New Equation Button */}
        <div className="flex justify-center">
          <Button onClick={handleNewEquation} variant="secondary" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {labels.newEquation}
          </Button>
        </div>

        {/* Educational Tips */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <h4 className="font-medium mb-3">{isRTL ? "نصائح للموازنة" : "Balancing Tips"}</h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li>• {isRTL ? "ابدأ بالعنصر الأقل تعقيداً" : "Start with the least complex element"}</li>
            <li>• {isRTL ? "اترك الأكسجين والهيدروجين للنهاية" : "Leave oxygen and hydrogen for last"}</li>
            <li>• {isRTL ? "تحقق من توازن كل عنصر على حدة" : "Check each element separately"}</li>
            <li>• {isRTL ? "استخدم أصغر عدد صحيح للمعاملات" : "Use the smallest whole numbers for coefficients"}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
