"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Atom, Plus, Minus, RotateCcw, Info } from "lucide-react";

interface AtomicStructureSimulationProps {
  language: "ar" | "en";
}

interface Element {
  symbol: string;
  nameAr: string;
  nameEn: string;
  protons: number;
  neutrons: number;
  electrons: number;
  category: string;
}

const elements: Element[] = [
  { symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", protons: 1, neutrons: 0, electrons: 1, category: "nonmetal" },
  { symbol: "He", nameAr: "هيليوم", nameEn: "Helium", protons: 2, neutrons: 2, electrons: 2, category: "noble" },
  { symbol: "Li", nameAr: "ليثيوم", nameEn: "Lithium", protons: 3, neutrons: 4, electrons: 3, category: "metal" },
  { symbol: "C", nameAr: "كربون", nameEn: "Carbon", protons: 6, neutrons: 6, electrons: 6, category: "nonmetal" },
  { symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", protons: 7, neutrons: 7, electrons: 7, category: "nonmetal" },
  { symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", protons: 8, neutrons: 8, electrons: 8, category: "nonmetal" },
  { symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", protons: 11, neutrons: 12, electrons: 11, category: "metal" },
  { symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", protons: 17, neutrons: 18, electrons: 17, category: "nonmetal" },
  { symbol: "Fe", nameAr: "حديد", nameEn: "Iron", protons: 26, neutrons: 30, electrons: 26, category: "metal" },
];

export function AtomicStructureSimulation({ language }: AtomicStructureSimulationProps) {
  const [protons, setProtons] = useState(1);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(1);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكاة البناء الذري" : "Atomic Structure Simulation",
    protons: isRTL ? "بروتونات (+)" : "Protons (+)",
    neutrons: isRTL ? "نيوترونات" : "Neutrons",
    electrons: isRTL ? "إلكترونات (-)" : "Electrons (-)",
    nucleus: isRTL ? "النواة" : "Nucleus",
    shells: isRTL ? "المستويات" : "Shells",
    charge: isRTL ? "الشحنة" : "Charge",
    massNumber: isRTL ? "العدد الكتلي" : "Mass Number",
    reset: isRTL ? "إعادة" : "Reset",
    selectElement: isRTL ? "اختر عنصراً" : "Select Element",
    elementInfo: isRTL ? "معلومات العنصر" : "Element Info"
  };

  const charge = protons - electrons;
  const massNumber = protons + neutrons;
  
  // Find matching element
  const matchingElement = elements.find(e => e.protons === protons);
  
  // Calculate electron shells
  const getElectronShells = (numElectrons: number): number[] => {
    const shells: number[] = [];
    const maxPerShell = [2, 8, 18, 32, 32, 18, 8];
    let remaining = numElectrons;
    
    for (const max of maxPerShell) {
      if (remaining <= 0) break;
      const inShell = Math.min(remaining, max);
      shells.push(inShell);
      remaining -= inShell;
    }
    
    return shells;
  };
  
  const electronShells = getElectronShells(electrons);
  
  const handleElementSelect = (element: Element) => {
    setProtons(element.protons);
    setNeutrons(element.neutrons);
    setElectrons(element.electrons);
  };

  const handleReset = () => {
    setProtons(1);
    setNeutrons(0);
    setElectrons(1);
  };

  // Generate positions for particles in nucleus
  const generateNucleusPositions = (count: number, radius: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const r = Math.random() * radius;
      positions.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      });
    }
    return positions;
  };

  const protonPositions = generateNucleusPositions(protons, 35);
  const neutronPositions = generateNucleusPositions(neutrons, 35);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-purple-500" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Atom Visualization */}
        <div className="relative bg-slate-900 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px] h-auto">
            {/* Electron shells */}
            {electronShells.map((count, shellIndex) => {
              const radius = 50 + shellIndex * 30;
              return (
                <g key={shellIndex}>
                  {/* Shell orbit */}
                  <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  {/* Electrons on this shell */}
                  {Array.from({ length: count }).map((_, i) => {
                    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
                    const x = 150 + Math.cos(angle) * radius;
                    const y = 150 + Math.sin(angle) * radius;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill="#3b82f6"
                          stroke="#60a5fa"
                          strokeWidth="2"
                        >
                          <animate
                            attributeName="cx"
                            values={`${150 + Math.cos(angle) * radius};${150 + Math.cos(angle + Math.PI * 2) * radius};${150 + Math.cos(angle) * radius}`}
                            dur={`${3 + shellIndex}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="cy"
                            values={`${150 + Math.sin(angle) * radius};${150 + Math.sin(angle + Math.PI * 2) * radius};${150 + Math.sin(angle) * radius}`}
                            dur={`${3 + shellIndex}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="8"
                          fontWeight="bold"
                        >
                          −
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
            
            {/* Nucleus */}
            <circle cx="150" cy="150" r="40" fill="#1e1b4b" opacity="0.8" />
            
            {/* Protons in nucleus */}
            {protonPositions.map((pos, i) => (
              <circle
                key={`p-${i}`}
                cx={150 + pos.x}
                cy={150 + pos.y}
                r="8"
                fill="#ef4444"
                stroke="#fca5a5"
                strokeWidth="1"
              />
            ))}
            
            {/* Neutrons in nucleus */}
            {neutronPositions.map((pos, i) => (
              <circle
                key={`n-${i}`}
                cx={150 + pos.x}
                cy={150 + pos.y}
                r="8"
                fill="#6b7280"
                stroke="#9ca3af"
                strokeWidth="1"
              />
            ))}
            
            {/* Legend */}
            <g transform="translate(10, 270)">
              <circle cx="0" cy="0" r="6" fill="#ef4444" />
              <text x="10" y="4" fill="#94a3b8" fontSize="10">{isRTL ? "بروتون" : "Proton"}</text>
              <circle cx="80" cy="0" r="6" fill="#6b7280" />
              <text x="90" y="4" fill="#94a3b8" fontSize="10">{isRTL ? "نيوترون" : "Neutron"}</text>
              <circle cx="170" cy="0" r="6" fill="#3b82f6" />
              <text x="180" y="4" fill="#94a3b8" fontSize="10">{isRTL ? "إلكترون" : "Electron"}</text>
            </g>
          </svg>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-3 gap-4">
          {/* Protons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-red-600">{labels.protons}</Label>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setProtons(Math.max(1, protons - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-mono text-xl font-bold w-8 text-center">{protons}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setProtons(Math.min(118, protons + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Neutrons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">{labels.neutrons}</Label>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNeutrons(Math.max(0, neutrons - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-mono text-xl font-bold w-8 text-center">{neutrons}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNeutrons(Math.min(200, neutrons + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Electrons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-blue-600">{labels.electrons}</Label>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setElectrons(Math.max(0, electrons - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-mono text-xl font-bold w-8 text-center">{electrons}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setElectrons(Math.min(118, electrons + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl text-center ${
            charge === 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-yellow-50 dark:bg-yellow-900/20"
          }`}>
            <div className="text-sm text-slate-500">{labels.charge}</div>
            <div className="text-2xl font-mono font-bold">
              {charge === 0 ? "0" : charge > 0 ? `+${charge}` : charge}
            </div>
            <div className="text-xs text-slate-400">
              {charge === 0 
                ? (isRTL ? "ذرة متعادلة" : "Neutral atom")
                : charge > 0
                  ? (isRTL ? "أيون موجب" : "Cation")
                  : (isRTL ? "أيون سالب" : "Anion")
              }
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
            <div className="text-sm text-slate-500">{labels.massNumber}</div>
            <div className="text-2xl font-mono font-bold">{massNumber}</div>
            <div className="text-xs text-slate-400">
              {isRTL ? `${protons}p + ${neutrons}n` : `${protons}p + ${neutrons}n`}
            </div>
          </div>
        </div>
        
        {/* Element Info */}
        {matchingElement && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {matchingElement.symbol}
            </div>
            <div>
              <div className="font-bold text-lg">
                {isRTL ? matchingElement.nameAr : matchingElement.nameEn}
              </div>
              <div className="text-sm text-slate-500">
                {isRTL ? `العدد الذري: ${matchingElement.protons}` : `Atomic Number: ${matchingElement.protons}`}
              </div>
            </div>
          </div>
        )}
        
        {/* Element Quick Select */}
        <div>
          <Label className="text-sm font-medium mb-2 block">{labels.selectElement}</Label>
          <div className="flex flex-wrap gap-2">
            {elements.slice(0, 9).map((element) => (
              <Button
                key={element.symbol}
                variant={protons === element.protons ? "default" : "outline"}
                size="sm"
                onClick={() => handleElementSelect(element)}
                className="min-w-[50px]"
              >
                {element.symbol}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Reset */}
        <div className="flex justify-center">
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {labels.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
