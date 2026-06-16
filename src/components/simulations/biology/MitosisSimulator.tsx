"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Split, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info } from "lucide-react";

interface MitosisPhase {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  duration: number;
}

interface MitosisSimulatorProps {
  language: "ar" | "en";
}

const phases: MitosisPhase[] = [
  {
    id: "interphase",
    nameAr: "الطور البيني",
    nameEn: "Interphase",
    descriptionAr: "الخلية في حالة نمو وتستعد للانقسام. تتضاعف الكروموسومات والمادة الوراثية.",
    duration: 0
  },
  {
    id: "prophase",
    nameAr: "الطور التمهيدي",
    nameEn: "Prophase",
    descriptionAr: "يتكثف الكروماتين إلى كروموسومات واضحة. يختفي الغشاء النووي وتظهر الألياف المغزلية.",
    duration: 1
  },
  {
    id: "metaphase",
    nameAr: "طور الاستواء",
    nameEn: "Metaphase",
    descriptionAr: "تصطف الكروموسومات في منتصف الخلية على اللوحة الاستوائية. الألياف المغزلية متصلة بالسنتروميرات.",
    duration: 2
  },
  {
    id: "anaphase",
    nameAr: "طور الصعود",
    nameEn: "Anaphase",
    descriptionAr: "تنفصل الكروماتيدات الشقيقة وتتحرك نحو قطبي الخلية المتقابلين.",
    duration: 3
  },
  {
    id: "telophase",
    nameAr: "الطور النهائي",
    nameEn: "Telophase",
    descriptionAr: "تصل الكروموسومات إلى الأقطاب ويتشكل غشاء نووي جديد حول كل مجموعة.",
    duration: 4
  },
  {
    id: "cytokinesis",
    nameAr: "انقسام السيتوبلازم",
    nameEn: "Cytokinesis",
    descriptionAr: "ينقسم السيتوبلازم وتتشكل خليتان ابنتان متطابقتان وراثياً.",
    duration: 5
  }
];

export function MitosisSimulator({ language }: MitosisSimulatorProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكاة الانقسام المتساوي" : "Mitosis Simulator",
    phases: isRTL ? "مراحل الانقسام" : "Phases",
    play: isRTL ? "تشغيل" : "Play",
    pause: isRTL ? "إيقاف" : "Pause",
    reset: isRTL ? "إعادة" : "Reset",
    previous: isRTL ? "السابق" : "Previous",
    next: isRTL ? "التالي" : "Next",
    duration: isRTL ? "المدة" : "Duration",
    stage: isRTL ? "المرحلة" : "Stage"
  };

  const currentPhase = phases[currentPhaseIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 100) {
            if (currentPhaseIndex < phases.length - 1) {
              setCurrentPhaseIndex(i => i + 1);
              return 0;
            } else {
              setIsAnimating(false);
              return 100;
            }
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAnimating, currentPhaseIndex]);

  const handlePhaseChange = (index: number) => {
    setCurrentPhaseIndex(index);
    setAnimationProgress(0);
  };

  const handleReset = () => {
    setCurrentPhaseIndex(0);
    setAnimationProgress(0);
    setIsAnimating(false);
  };

  const renderCellVisualization = () => {
    const progress = animationProgress / 100;
    
    switch (currentPhase.id) {
      case "interphase":
        return (
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Cell membrane */}
            <ellipse cx="150" cy="150" rx="130" ry="130" fill="#fef3c7" stroke="#3b82f6" strokeWidth="4" />
            {/* Nucleus */}
            <ellipse cx="150" cy="150" rx="50" ry="50" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="3" />
            {/* Chromatin (loose) */}
            <path d="M130 140 Q140 130 150 140 Q160 150 170 140" stroke="#a78bfa" strokeWidth="3" fill="none" />
            <path d="M135 155 Q145 165 155 155 Q165 145 175 155" stroke="#a78bfa" strokeWidth="3" fill="none" />
            <circle cx="160" cy="145" r="8" fill="#c4b5fd" />
          </svg>
        );
      
      case "prophase":
        return (
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Cell membrane */}
            <ellipse cx="150" cy="150" rx="130" ry="130" fill="#fef3c7" stroke="#3b82f6" strokeWidth="4" />
            {/* Disappearing nuclear membrane */}
            <ellipse cx="150" cy="150" rx={50 - progress * 20} ry={50 - progress * 20} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity={1 - progress} />
            {/* Condensing chromosomes */}
            <rect x="130" y="135" width="40" height="6" rx="3" fill="#8b5cf6" transform={`rotate(${progress * 20} 150 150)`} />
            <rect x="130" y="155" width="40" height="6" rx="3" fill="#8b5cf6" transform={`rotate(-${progress * 15} 150 150)`} />
            <rect x="125" y="145" width="20" height="6" rx="3" fill="#8b5cf6" transform={`rotate(${progress * 30} 150 150)`} />
            <rect x="155" y="145" width="20" height="6" rx="3" fill="#8b5cf6" transform={`rotate(-${progress * 25} 150 150)`} />
            {/* Spindle fibers appearing */}
            <line x1="50" y1="150" x2="100" y2="150" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" opacity={progress} />
            <line x1="200" y1="150" x2="250" y2="150" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" opacity={progress} />
            {/* Centrosomes */}
            <circle cx="60" cy="150" r="10" fill="#64748b" opacity={progress} />
            <circle cx="240" cy="150" r="10" fill="#64748b" opacity={progress} />
          </svg>
        );
      
      case "metaphase":
        return (
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Cell membrane */}
            <ellipse cx="150" cy="150" rx="130" ry="130" fill="#fef3c7" stroke="#3b82f6" strokeWidth="4" />
            {/* Spindle fibers */}
            <line x1="50" y1="150" x2="130" y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1="170" y1="150" x2="250" y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1="55" y1="140" x2="130" y2="145" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="55" y1="160" x2="130" y2="155" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="170" y1="145" x2="245" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="170" y1="155" x2="245" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Metaphase plate - chromosomes aligned */}
            <rect x="135" y="130" width="30" height="8" rx="4" fill="#8b5cf6" />
            <rect x="135" y="145" width="30" height="8" rx="4" fill="#8b5cf6" />
            <rect x="135" y="160" width="30" height="8" rx="4" fill="#8b5cf6" />
            {/* Centromeres */}
            <circle cx="150" cy="134" r="4" fill="#a78bfa" />
            <circle cx="150" cy="149" r="4" fill="#a78bfa" />
            <circle cx="150" cy="164" r="4" fill="#a78bfa" />
            {/* Centrosomes at poles */}
            <circle cx="50" cy="150" r="12" fill="#64748b" />
            <circle cx="250" cy="150" r="12" fill="#64748b" />
            {/* Equator line */}
            <line x1="150" y1="50" x2="150" y2="250" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
          </svg>
        );
      
      case "anaphase":
        return (
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Cell membrane - slightly elongated */}
            <ellipse cx="150" cy="150" rx={130 + progress * 10} ry="130" fill="#fef3c7" stroke="#3b82f6" strokeWidth="4" />
            {/* Spindle fibers */}
            <line x1="40" y1="150" x2={110 - progress * 20} y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1={190 + progress * 20} y1="150" x2="260" y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1="45" y1="135" x2={115 - progress * 25} y2="145" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="45" y1="165" x2={115 - progress * 25} y2="155" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={185 + progress * 25} y1="145" x2="255" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={185 + progress * 25} y1="155" x2="255" y2="165" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Separating chromosomes - moving to poles */}
            <rect x={100 - progress * 40} y="130" width="25" height="8" rx="4" fill="#8b5cf6" />
            <rect x={100 - progress * 40} y="145" width="25" height="8" rx="4" fill="#8b5cf6" />
            <rect x={175 + progress * 40} y="130" width="25" height="8" rx="4" fill="#8b5cf6" />
            <rect x={175 + progress * 40} y="145" width="25" height="8" rx="4" fill="#8b5cf6" />
            {/* Centrosomes */}
            <circle cx="40" cy="150" r="12" fill="#64748b" />
            <circle cx="260" cy="150" r="12" fill="#64748b" />
          </svg>
        );
      
      case "telophase":
        return (
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Cell membrane - pinching in the middle */}
            <path 
              d={`M 150 20 
                  Q ${280 - progress * 30} 150 150 280 
                  Q ${20 + progress * 30} 150 150 20`}
              fill="#fef3c7" 
              stroke="#3b82f6" 
              strokeWidth="4" 
            />
            {/* New nuclear membranes forming */}
            <ellipse cx="80" cy="150" rx={30 + progress * 10} ry={30 + progress * 10} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4,4" />
            <ellipse cx="220" cy="150" rx={30 + progress * 10} ry={30 + progress * 10} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4,4" />
            {/* Chromosomes at poles (decondensing) */}
            <rect x="60" y="140" width="30" height="6" rx="3" fill="#a78bfa" transform="rotate(15 80 150)" />
            <rect x="60" y="155" width="30" height="6" rx="3" fill="#a78bfa" transform="rotate(-10 80 150)" />
            <rect x="210" y="140" width="30" height="6" rx="3" fill="#a78bfa" transform="rotate(-15 220 150)" />
            <rect x="210" y="155" width="30" height="6" rx="3" fill="#a78bfa" transform="rotate(10 220 150)" />
            {/* Cleavage furrow */}
            <path d={`M 150 100 Q ${130 + progress * 10} 150 150 200`} fill="none" stroke="#3b82f6" strokeWidth="3" />
          </svg>
        );
      
      case "cytokinesis":
        return (
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Two daughter cells */}
            <ellipse cx={110 - progress * 20} cy="150" rx="70" ry="80" fill="#fef3c7" stroke="#3b82f6" strokeWidth="4" />
            <ellipse cx={190 + progress * 20} cy="150" rx="70" ry="80" fill="#fef3c7" stroke="#3b82f6" strokeWidth="4" />
            {/* Nuclei */}
            <ellipse cx={110 - progress * 20} cy="150" rx="35" ry="35" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
            <ellipse cx={190 + progress * 20} cy="150" rx="35" ry="35" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
            {/* Chromatin */}
            <path d={`M${95 - progress * 20} 145 Q${105 - progress * 20} 135 ${115 - progress * 20} 145`} stroke="#a78bfa" strokeWidth="2" fill="none" />
            <path d={`M${95 - progress * 20} 160 Q${105 - progress * 20} 170 ${115 - progress * 20} 160`} stroke="#a78bfa" strokeWidth="2" fill="none" />
            <path d={`M${175 + progress * 20} 145 Q${185 + progress * 20} 135 ${195 + progress * 20} 145`} stroke="#a78bfa" strokeWidth="2" fill="none" />
            <path d={`M${175 + progress * 20} 160 Q${185 + progress * 20} 170 ${195 + progress * 20} 160`} stroke="#a78bfa" strokeWidth="2" fill="none" />
            {/* Nucleoli */}
            <circle cx={120 - progress * 20} cy="145" r="6" fill="#c4b5fd" />
            <circle cx={200 + progress * 20} cy="145" r="6" fill="#c4b5fd" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Split className="w-5 h-5 text-blue-500" />
            {labels.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase Navigation */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => handlePhaseChange(index)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentPhaseIndex === index 
                  ? "bg-blue-500 text-white scale-105" 
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isRTL ? phase.nameAr : phase.nameEn}
            </button>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-100"
            style={{ width: `${animationProgress}%` }}
          />
        </div>
        
        {/* Cell Visualization */}
        <div className="relative bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
          {renderCellVisualization()}
        </div>
        
        {/* Current Phase Info */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {isRTL ? currentPhase.nameAr : currentPhase.nameEn}
              </h3>
              <Badge className="bg-white/30 mt-1">
                {isRTL ? currentPhase.nameEn : currentPhase.nameAr}
              </Badge>
            </div>
          </div>
          <p className="font-medium">
            {isRTL ? currentPhase.descriptionAr : currentPhase.descriptionEn}
          </p>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePhaseChange(Math.max(0, currentPhaseIndex - 1))}
            disabled={currentPhaseIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            {labels.previous}
          </Button>
          <span className="text-sm text-slate-500">
            {labels.stage} {currentPhaseIndex + 1} / {phases.length}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePhaseChange(Math.min(phases.length - 1, currentPhaseIndex + 1))}
            disabled={currentPhaseIndex === phases.length - 1}
          >
            {labels.next}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
