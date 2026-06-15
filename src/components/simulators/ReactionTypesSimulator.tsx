"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause, FlaskConical, ArrowRightLeft, Combine, Minus } from "lucide-react";

interface ReactionTypesSimulatorProps {
  language: "ar" | "en";
}

type ReactionType = "combination" | "decomposition" | "singleReplacement" | "doubleReplacement";

interface ReactionData {
  equation: { ar: string; en: string };
  description: { ar: string; en: string };
  reactants: { symbol: string; color: string; count: number }[];
  products: { symbol: string; color: string; count: number }[];
  explanation: { ar: string; en: string };
}

const reactions: Record<ReactionType, ReactionData> = {
  combination: {
    equation: {
      ar: "2H₂ + O₂ → 2H₂O",
      en: "2H₂ + O₂ → 2H₂O"
    },
    description: {
      ar: "تفاعل الاتحاد: مادة أو أكثر تتحد لتكوين مركب جديد",
      en: "Combination Reaction: Two or more substances combine to form a new compound"
    },
    reactants: [
      { symbol: "H₂", color: "#3b82f6", count: 2 },
      { symbol: "O₂", color: "#ef4444", count: 1 }
    ],
    products: [
      { symbol: "H₂O", color: "#22c55e", count: 2 }
    ],
    explanation: {
      ar: "يتحد الهيدروجين مع الأكسجين لتكوين الماء. هذا تفاعل طارد للحرارة يُطلق كمية كبيرة من الطاقة.",
      en: "Hydrogen combines with oxygen to form water. This is an exothermic reaction that releases a large amount of energy."
    }
  },
  decomposition: {
    equation: {
      ar: "2H₂O → 2H₂ + O₂",
      en: "2H₂O → 2H₂ + O₂"
    },
    description: {
      ar: "تفاعل التحلل: مركب واحد يتحلل إلى مادتين أو أكثر",
      en: "Decomposition Reaction: A single compound breaks down into two or more substances"
    },
    reactants: [
      { symbol: "H₂O", color: "#22c55e", count: 2 }
    ],
    products: [
      { symbol: "H₂", color: "#3b82f6", count: 2 },
      { symbol: "O₂", color: "#ef4444", count: 1 }
    ],
    explanation: {
      ar: "يتحلل الماء إلى هيدروجين وأكسجين عند تمرير تيار كهربائي (تحليل كهربائي). هذا تفاعل ماص للطاقة.",
      en: "Water decomposes into hydrogen and oxygen when electricity is passed through it (electrolysis). This is an endothermic reaction."
    }
  },
  singleReplacement: {
    equation: {
      ar: "Zn + 2HCl → ZnCl₂ + H₂",
      en: "Zn + 2HCl → ZnCl₂ + H₂"
    },
    description: {
      ar: "تفاعل الإحلال الفردي: عنصر يحل محل عنصر آخر في مركب",
      en: "Single Replacement: One element replaces another element in a compound"
    },
    reactants: [
      { symbol: "Zn", color: "#8b5cf6", count: 1 },
      { symbol: "HCl", color: "#f59e0b", count: 2 }
    ],
    products: [
      { symbol: "ZnCl₂", color: "#06b6d4", count: 1 },
      { symbol: "H₂", color: "#3b82f6", count: 1 }
    ],
    explanation: {
      ar: "يحل الخارصين محل الهيدروجين في حمض الهيدروكلوريك، مكوناً كلوريد الخارصين وإطلاق غاز الهيدروجين.",
      en: "Zinc replaces hydrogen in hydrochloric acid, forming zinc chloride and releasing hydrogen gas."
    }
  },
  doubleReplacement: {
    equation: {
      ar: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
      en: "AgNO₃ + NaCl → AgCl↓ + NaNO₃"
    },
    description: {
      ar: "تفاعل الإحلال المزدوج: تبادل الأيونات بين مركبين",
      en: "Double Replacement: Ions exchange between two compounds"
    },
    reactants: [
      { symbol: "AgNO₃", color: "#6366f1", count: 1 },
      { symbol: "NaCl", color: "#f97316", count: 1 }
    ],
    products: [
      { symbol: "AgCl", color: "#eab308", count: 1 },
      { symbol: "NaNO₃", color: "#14b8a6", count: 1 }
    ],
    explanation: {
      ar: "تتبادل الأيونات بين نترات الفضة وكلوريد الصوديوم، ويتكون راسب أبيض من كلوريد الفضة.",
      en: "Ions exchange between silver nitrate and sodium chloride, forming a white precipitate of silver chloride."
    }
  }
};

export function ReactionTypesSimulator({ language }: ReactionTypesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [reactionType, setReactionType] = useState<ReactionType>("combination");
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);

  const texts = {
    ar: {
      title: "محاكي أنواع التفاعلات الكيميائية",
      description: "استكشف أنواع التفاعلات الكيميائية الأربعة الرئيسية",
      combination: "اتحاد",
      decomposition: "تحلل",
      singleReplacement: "إحلال فردي",
      doubleReplacement: "إحلال مزدوج",
      reactants: "المتتفاعلات",
      products: "النواتج",
      equation: "المعادلة الكيميائية",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      speed: "السرعة",
      explanation: "التفسير الكيميائي",
      before: "قبل التفاعل",
      after: "بعد التفاعل",
      reactionProgress: "تقدم التفاعل"
    },
    en: {
      title: "Chemical Reaction Types Simulator",
      description: "Explore the four main types of chemical reactions",
      combination: "Combination",
      decomposition: "Decomposition",
      singleReplacement: "Single Replacement",
      doubleReplacement: "Double Replacement",
      reactants: "Reactants",
      products: "Products",
      equation: "Chemical Equation",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      speed: "Speed",
      explanation: "Chemical Explanation",
      before: "Before Reaction",
      after: "After Reaction",
      reactionProgress: "Reaction Progress"
    },
  };

  const t = texts[language];
  const reaction = reactions[reactionType];

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

    const time = Date.now() / 1000;
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw reaction container
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(30, 20, width - 60, height - 40, 10);
    ctx.stroke();

    // Draw arrow
    const arrowX = centerX;
    ctx.fillStyle = "#64748b";
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(arrowX - 15, centerY - 60);
    ctx.lineTo(arrowX + 15, centerY - 60);
    ctx.lineTo(arrowX + 15, centerY - 65);
    ctx.lineTo(arrowX + 30, centerY - 55);
    ctx.lineTo(arrowX + 15, centerY - 45);
    ctx.lineTo(arrowX + 15, centerY - 50);
    ctx.lineTo(arrowX - 15, centerY - 50);
    ctx.closePath();
    ctx.fill();

    // Draw progress label
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(progress)}%`, arrowX, centerY - 70);

    // Draw reactants (left side)
    const reactantStartX = 80;
    const reactantY = centerY + 20;
    let reactantX = reactantStartX;
    
    reaction.reactants.forEach((reactant, idx) => {
      const visibility = 1 - (progress / 100);
      const particlesVisible = Math.ceil(reactant.count * visibility);
      
      for (let i = 0; i < particlesVisible; i++) {
        const offsetX = (i % 2) * 40;
        const offsetY = Math.floor(i / 2) * 40;
        const x = reactantX + offsetX + Math.sin(time * 2 + i) * 3;
        const y = reactantY + offsetY + Math.cos(time * 2 + i) * 3;
        
        drawMolecule(ctx, x, y, reactant.symbol, reactant.color, visibility);
      }
      reactantX += 100;
    });

    // Draw products (right side)
    const productStartX = centerX + 60;
    let productX = productStartX;
    
    reaction.products.forEach((product, idx) => {
      const visibility = progress / 100;
      const particlesVisible = Math.ceil(product.count * visibility);
      
      for (let i = 0; i < particlesVisible; i++) {
        const offsetX = (i % 2) * 40;
        const offsetY = Math.floor(i / 2) * 40;
        const x = productX + offsetX + Math.sin(time * 2 + i) * 3;
        const y = reactantY + offsetY + Math.cos(time * 2 + i) * 3;
        
        drawMolecule(ctx, x, y, product.symbol, product.color, visibility);
      }
      productX += 80;
    });

    // Draw labels
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.reactants, centerX / 2, height - 25);
    ctx.fillText(t.products, centerX + width / 4, height - 25);

  }, [progress, reactionType, language, t]);

  const drawMolecule = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    symbol: string,
    color: string,
    opacity: number
  ) => {
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol, x, y);
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isRunning && progress < 100) {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + speed * 2, 100));
      }, 50);
      return () => clearInterval(interval);
    } else if (progress >= 100) {
      setIsRunning(false);
    }
  }, [isRunning, progress, speed]);

  const reset = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const reactionTypes: { key: ReactionType; icon: React.ReactNode; color: string }[] = [
    { key: "combination", icon: <Combine className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
    { key: "decomposition", icon: <Minus className="w-4 h-4" />, color: "from-red-500 to-orange-500" },
    { key: "singleReplacement", icon: <ArrowRightLeft className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
    { key: "doubleReplacement", icon: <FlaskConical className="w-4 h-4" />, color: "from-green-500 to-teal-500" },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Reaction Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {reactionTypes.map(({ key, icon, color }) => (
            <Button
              key={key}
              variant={reactionType === key ? "default" : "outline"}
              onClick={() => {
                setReactionType(key);
                reset();
              }}
              className={`h-auto py-3 flex-col gap-1 ${reactionType === key ? `bg-gradient-to-r ${color}` : ""}`}
            >
              {icon}
              <span className="text-xs">{t[key]}</span>
            </Button>
          ))}
        </div>

        {/* Equation Display */}
        <div className="p-4 bg-slate-100 rounded-lg text-center">
          <p className="text-xs text-slate-500 mb-1">{t.equation}</p>
          <p className="text-xl font-mono font-bold">{reaction.equation[language]}</p>
          <p className="text-sm text-slate-600 mt-2">{reaction.description[language]}</p>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={280} className="w-full bg-slate-50" />
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.before}</span>
            <span>{t.after}</span>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm">{t.speed}</label>
            <Badge>{speed}x</Badge>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([v]) => setSpeed(v)}
            min={0.5}
            max={3}
            step={0.5}
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">{t.reactants}</p>
            <div className="flex flex-wrap gap-1">
              {reaction.reactants.map((r, i) => (
                <Badge key={i} style={{ backgroundColor: r.color, color: "white" }}>
                  {r.count > 1 ? r.count : ""}{r.symbol}
                </Badge>
              ))}
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">{t.products}</p>
            <div className="flex flex-wrap gap-1">
              {reaction.products.map((p, i) => (
                <Badge key={i} style={{ backgroundColor: p.color, color: "white" }}>
                  {p.count > 1 ? p.count : ""}{p.symbol}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-violet-50 rounded-lg">
          <h4 className="font-bold flex items-center gap-2 mb-2">
            <Atom className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600">{reaction.explanation[language]}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsRunning(!isRunning)} className="bg-violet-500 hover:bg-violet-600">
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
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
