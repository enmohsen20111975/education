"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dna, RotateCcw, Play, Pause, Info } from "lucide-react";

interface BasePair {
  base1: string;
  base2: string;
  color: string;
}

interface DNASimulatorProps {
  language: "ar" | "en";
}

const basePairInfo = {
  A: {
    nameAr: "أدينين",
    nameEn: "Adenine",
    pairsWith: "T",
    color: "#ef4444",
    functionAr: "يزوج مع الثايمين برابطتين هيدروجينيتين",
    functionEn: "Pairs with Thymine using two hydrogen bonds"
  },
  T: {
    nameAr: "ثايمين",
    nameEn: "Thymine",
    pairsWith: "A",
    color: "#22c55e",
    functionAr: "يزوج مع الأدينين برابطتين هيدروجينيتين",
    functionEn: "Pairs with Adenine using two hydrogen bonds"
  },
  G: {
    nameAr: "جوانين",
    nameEn: "Guanine",
    pairsWith: "C",
    color: "#3b82f6",
    functionAr: "يزوج مع السايتوسين بثلاث روابط هيدروجينية",
    functionEn: "Pairs with Cytosine using three hydrogen bonds"
  },
  C: {
    nameAr: "سايتوسين",
    nameEn: "Cytosine",
    pairsWith: "G",
    color: "#f59e0b",
    functionAr: "يزوج مع الجوانين بثلاث روابط هيدروجينية",
    functionEn: "Pairs with Guanine using three hydrogen bonds"
  }
};

const dnaSequence = ["A", "T", "G", "C", "G", "A", "T", "C", "G", "A", "T", "G"];

export function DNASimulator({ language }: DNASimulatorProps) {
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredPair, setHoveredPair] = useState<number | null>(null);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكاة الدي إن أيه" : "DNA Simulator",
    doubleHelix: isRTL ? "اللولب المزدوج" : "Double Helix",
    basePairs: isRTL ? "أزواج القواعد" : "Base Pairs",
    clickToLearn: isRTL ? "انقر على القاعدة لمعرفة المزيد" : "Click a base to learn more",
    structure: isRTL ? "التركيب" : "Structure",
    function: isRTL ? "الوظيفة" : "Function",
    pairsWith: isRTL ? "يزوج مع" : "Pairs with",
    hydrogenBonds: isRTL ? "روابط هيدروجينية" : "Hydrogen Bonds",
    rotate: isRTL ? "تدوير" : "Rotate",
    stop: isRTL ? "إيقاف" : "Stop",
    reset: isRTL ? "إعادة" : "Reset"
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 2) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getComplement = (base: string) => basePairInfo[base as keyof typeof basePairInfo].pairsWith;
  
  const handleReset = () => {
    setRotation(0);
    setIsAnimating(false);
    setSelectedBase(null);
    setHoveredPair(null);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-purple-500" />
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
        {/* DNA Visualization */}
        <div className="relative bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 min-h-[500px] flex items-center justify-center overflow-hidden">
          <div 
            className="relative"
            style={{ 
              transform: `rotateY(${rotation}deg)`,
              transition: isAnimating ? "none" : "transform 0.3s ease",
              transformStyle: "preserve-3d"
            }}
          >
            <svg viewBox="0 0 400 600" className="w-[300px] h-[500px]">
              {/* Background strands */}
              <defs>
                <linearGradient id="strandGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="strandGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              
              {/* DNA Double Helix Structure */}
              {dnaSequence.map((base, index) => {
                const y1 = 50 + index * 40;
                const y2 = y1 + 30;
                const xOffset1 = Math.sin((index * 30 + rotation) * Math.PI / 180) * 60;
                const xOffset2 = -xOffset1;
                const baseInfo = basePairInfo[base as keyof typeof basePairInfo];
                const complement = basePairInfo[baseInfo.pairsWith as keyof typeof basePairInfo];
                
                return (
                  <g key={index}>
                    {/* Connecting backbone - Left */}
                    {index > 0 && (
                      <path
                        d={`M ${150 + Math.sin(((index-1) * 30 + rotation) * Math.PI / 180) * 60} ${50 + (index-1) * 40 + 15}
                            Q ${150 + xOffset1} ${y1}
                            ${150 + xOffset1} ${y1 + 15}`}
                        fill="none"
                        stroke="url(#strandGradient1)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    )}
                    
                    {/* Connecting backbone - Right */}
                    {index > 0 && (
                      <path
                        d={`M ${250 + Math.sin(((index-1) * 30 + rotation) * Math.PI / 180) * -60} ${50 + (index-1) * 40 + 15}
                            Q ${250 + xOffset2} ${y1}
                            ${250 + xOffset2} ${y1 + 15}`}
                        fill="none"
                        stroke="url(#strandGradient2)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    )}
                    
                    {/* Base pair connection (hydrogen bonds) */}
                    <line
                      x1={150 + xOffset1}
                      y1={y1 + 15}
                      x2={250 + xOffset2}
                      y2={y1 + 15}
                      stroke={hoveredPair === index ? "#fbbf24" : "#d1d5db"}
                      strokeWidth={base === "G" || base === "C" ? 3 : 2}
                      strokeDasharray={base === "G" || base === "C" ? "6 3" : "4 4"}
                      className="transition-all duration-200"
                    />
                    
                    {/* Base 1 (Left) */}
                    <g
                      onClick={() => setSelectedBase(base)}
                      onMouseEnter={() => setHoveredPair(index)}
                      onMouseLeave={() => setHoveredPair(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={150 + xOffset1}
                        cy={y1 + 15}
                        r="18"
                        fill={baseInfo.color}
                        stroke={selectedBase === base ? "#000" : "none"}
                        strokeWidth="2"
                        className="transition-all duration-200"
                        style={{
                          filter: hoveredPair === index ? "brightness(1.1)" : "none"
                        }}
                      />
                      <text
                        x={150 + xOffset1}
                        y={y1 + 20}
                        textAnchor="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {base}
                      </text>
                    </g>
                    
                    {/* Base 2 (Right - Complement) */}
                    <g
                      onClick={() => setSelectedBase(baseInfo.pairsWith)}
                      onMouseEnter={() => setHoveredPair(index)}
                      onMouseLeave={() => setHoveredPair(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={250 + xOffset2}
                        cy={y1 + 15}
                        r="18"
                        fill={complement.color}
                        stroke={selectedBase === baseInfo.pairsWith ? "#000" : "none"}
                        strokeWidth="2"
                        className="transition-all duration-200"
                        style={{
                          filter: hoveredPair === index ? "brightness(1.1)" : "none"
                        }}
                      />
                      <text
                        x={250 + xOffset2}
                        y={y1 + 20}
                        textAnchor="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {baseInfo.pairsWith}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        
        {/* Base Legend */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(basePairInfo).map(([base, info]) => (
            <button
              key={base}
              onClick={() => setSelectedBase(base)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedBase === base ? "ring-2 ring-black scale-105" : ""
              }`}
              style={{ backgroundColor: info.color, color: "white" }}
            >
              {base} - {isRTL ? info.nameAr : info.nameEn}
            </button>
          ))}
        </div>
        
        {/* Selected Base Info */}
        {selectedBase && (
          <div 
            className="p-6 rounded-xl text-white"
            style={{ backgroundColor: basePairInfo[selectedBase as keyof typeof basePairInfo].color }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {isRTL ? basePairInfo[selectedBase as keyof typeof basePairInfo].nameAr : basePairInfo[selectedBase as keyof typeof basePairInfo].nameEn}
                </h3>
                <Badge className="bg-white/30 mt-1">
                  {selectedBase}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-80">{labels.pairsWith}:</p>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {selectedBase}
                </span>
                <span className="text-2xl">—</span>
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {basePairInfo[selectedBase as keyof typeof basePairInfo].pairsWith}
                </span>
              </div>
              <p className="mt-3 font-medium">
                {isRTL ? basePairInfo[selectedBase as keyof typeof basePairInfo].functionAr : basePairInfo[selectedBase as keyof typeof basePairInfo].functionEn}
              </p>
            </div>
          </div>
        )}
        
        {/* Educational Content */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {labels.structure}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isRTL 
              ? "DNA يتكون من لولبين متقابلين يشكلان اللولب المزدوج. تتصل القواعد النيتروجينية في المنتصف بروابط هيدروجينية: A-T برابطتين، G-C بثلاث روابط."
              : "DNA consists of two strands twisted together forming a double helix. Nitrogenous bases connect in the middle with hydrogen bonds: A-T with two bonds, G-C with three bonds."}
          </p>
        </div>
        
        {/* Instructions */}
        <p className="text-sm text-slate-500 text-center">
          {labels.clickToLearn}
        </p>
      </CardContent>
    </Card>
  );
}
