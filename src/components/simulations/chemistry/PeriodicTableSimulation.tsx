"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atom, FlaskConical } from "lucide-react";

interface PeriodicTableSimulationProps {
  language: "ar" | "en";
}

// Periodic table data
const elements = [
  // Period 1
  { number: 1, symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", mass: 1.008, category: "nonmetal", group: 1, period: 1 },
  { number: 2, symbol: "He", nameAr: "هيليوم", nameEn: "Helium", mass: 4.003, category: "noble", group: 18, period: 1 },
  // Period 2
  { number: 3, symbol: "Li", nameAr: "ليثيوم", nameEn: "Lithium", mass: 6.941, category: "alkali-metal", group: 1, period: 2 },
  { number: 4, symbol: "Be", nameAr: "بريليوم", nameEn: "Beryllium", mass: 9.012, category: "alkaline", group: 2, period: 2 },
  { number: 5, symbol: "B", nameAr: "بورون", nameEn: "Boron", mass: 10.81, category: "metalloid", group: 13, period: 2 },
  { number: 6, symbol: "C", nameAr: "كربون", nameEn: "Carbon", mass: 12.01, category: "nonmetal", group: 14, period: 2 },
  { number: 7, symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", mass: 14.01, category: "nonmetal", group: 15, period: 2 },
  { number: 8, symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", mass: 16.00, category: "nonmetal", group: 16, period: 2 },
  { number: 9, symbol: "F", nameAr: "فلور", nameEn: "Fluorine", mass: 19.00, category: "halogen", group: 17, period: 2 },
  { number: 10, symbol: "Ne", nameAr: "نيون", nameEn: "Neon", mass: 20.18, category: "noble", group: 18, period: 2 },
  // Period 3
  { number: 11, symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", mass: 22.99, category: "alkali-metal", group: 1, period: 3 },
  { number: 12, symbol: "Mg", nameAr: "مغنسيوم", nameEn: "Magnesium", mass: 24.31, category: "alkaline", group: 2, period: 3 },
  { number: 13, symbol: "Al", nameAr: "ألومنيوم", nameEn: "Aluminium", mass: 26.98, category: "metal", group: 13, period: 3 },
  { number: 14, symbol: "Si", nameAr: "سيليكون", nameEn: "Silicon", mass: 28.09, category: "metalloid", group: 14, period: 3 },
  { number: 15, symbol: "P", nameAr: "فسفور", nameEn: "Phosphorus", mass: 30.97, category: "nonmetal", group: 15, period: 3 },
  { number: 16, symbol: "S", nameAr: "كبريت", nameEn: "Sulfur", mass: 32.07, category: "nonmetal", group: 16, period: 3 },
  { number: 17, symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", mass: 35.45, category: "halogen", group: 17, period: 3 },
  { number: 18, symbol: "Ar", nameAr: "أرجون", nameEn: "Argon", mass: 39.95, category: "noble", group: 18, period: 3 },
  // Period 4
  { number: 19, symbol: "K", nameAr: "بوتاسيوم", nameEn: "Potassium", mass: 39.10, category: "alkali-metal", group: 1, period: 4 },
  { number: 20, symbol: "Ca", nameAr: "كالسيوم", nameEn: "Calcium", mass: 40.08, category: "alkaline", group: 2, period: 4 },
  { number: 26, symbol: "Fe", nameAr: "حديد", nameEn: "Iron", mass: 55.85, category: "transition", group: 8, period: 4 },
  { number: 29, symbol: "Cu", nameAr: "نحاس", nameEn: "Copper", mass: 63.55, category: "transition", group: 11, period: 4 },
  { number: 30, symbol: "Zn", nameAr: "زنك", nameEn: "Zinc", mass: 65.38, category: "transition", group: 12, period: 4 },
  { number: 35, symbol: "Br", nameAr: "بروم", nameEn: "Bromine", mass: 79.90, category: "halogen", group: 17, period: 4 },
  { number: 36, symbol: "Kr", nameAr: "كريبتون", nameEn: "Krypton", mass: 83.80, category: "noble", group: 18, period: 4 },
  // Period 5
  { number: 47, symbol: "Ag", nameAr: "فضة", nameEn: "Silver", mass: 107.87, category: "transition", group: 11, period: 5 },
  { number: 53, symbol: "I", nameAr: "يود", nameEn: "Iodine", mass: 126.90, category: "halogen", group: 17, period: 5 },
  { number: 54, symbol: "Xe", nameAr: "زينون", nameEn: "Xenon", mass: 131.29, category: "noble", group: 18, period: 5 },
  // Period 6
  { number: 79, symbol: "Au", nameAr: "ذهب", nameEn: "Gold", mass: 196.97, category: "transition", group: 11, period: 6 },
  { number: 80, symbol: "Hg", nameAr: "زئبق", nameEn: "Mercury", mass: 200.59, category: "transition", group: 12, period: 6 },
  { number: 82, symbol: "Pb", nameAr: "رصاص", nameEn: "Lead", mass: 207.2, category: "metal", group: 14, period: 6 },
];

const categoryColors: Record<string, { bg: string; text: string; labelAr: string; labelEn: string }> = {
  "alkali-metal": { bg: "#ef4444", text: "white", labelAr: "فلز قلوي", labelEn: "Alkali Metal" },
  "alkaline": { bg: "#f97316", text: "white", labelAr: "فلز قلوي ترابي", labelEn: "Alkaline Earth" },
  "transition": { bg: "#eab308", text: "black", labelAr: "فلز انتقالي", labelEn: "Transition Metal" },
  "metal": { bg: "#84cc16", text: "black", labelAr: "فلز", labelEn: "Metal" },
  "metalloid": { bg: "#22c55e", text: "white", labelAr: "شبه فلز", labelEn: "Metalloid" },
  "nonmetal": { bg: "#06b6d4", text: "white", labelAr: "لا فلز", labelEn: "Nonmetal" },
  "halogen": { bg: "#8b5cf6", text: "white", labelAr: "هالوجين", labelEn: "Halogen" },
  "noble": { bg: "#ec4899", text: "white", labelAr: "غاز نبيل", labelEn: "Noble Gas" },
};

export function PeriodicTableSimulation({ language }: PeriodicTableSimulationProps) {
  const [selectedElement, setSelectedElement] = useState<typeof elements[0] | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "الجدول الدوري التفاعلي" : "Interactive Periodic Table",
    selectElement: isRTL ? "انقر على عنصر لعرض التفاصيل" : "Click an element to see details",
    atomicNumber: isRTL ? "العدد الذري" : "Atomic Number",
    atomicMass: isRTL ? "الكتلة الذرية" : "Atomic Mass",
    category: isRTL ? "التصنيف" : "Category",
    electrons: isRTL ? "الإلكترونات" : "Electrons",
    protons: isRTL ? "البروتونات" : "Protons"
  };

  const handleElementClick = (element: typeof elements[0]) => {
    setSelectedElement(element);
  };

  // Filter elements by category
  const getFilteredElements = () => {
    if (!hoveredCategory) return elements;
    return elements.filter(e => e.category === hoveredCategory);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-purple-500" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Legend */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(categoryColors).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setHoveredCategory(hoveredCategory === key ? null : key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-transform ${
                hoveredCategory === key ? "scale-110 ring-2 ring-black" : ""
              }`}
              style={{ backgroundColor: value.bg, color: value.text }}
            >
              {isRTL ? value.labelAr : value.labelEn}
            </button>
          ))}
        </div>

        {/* Periodic Table Grid */}
        <div className="overflow-x-auto">
          <div className="grid gap-1 min-w-[800px]" style={{ gridTemplateColumns: "repeat(18, 1fr)" }}>
            {/* Generate grid cells */}
            {Array.from({ length: 7 * 18 }).map((_, index) => {
              const period = Math.floor(index / 18) + 1;
              const group = (index % 18) + 1;
              
              // Find element at this position
              const element = elements.find(e => e.group === group && e.period === period);
              
              if (element) {
                const colors = categoryColors[element.category] || { bg: "#94a3b8", text: "white" };
                const isFiltered = hoveredCategory && element.category !== hoveredCategory;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleElementClick(element)}
                    className={`aspect-square p-1 rounded-lg transition-all ${
                      selectedElement?.number === element.number ? "ring-2 ring-black scale-105 z-10" : ""
                    } ${isFiltered ? "opacity-30" : ""}`}
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    <div className="text-[8px] opacity-70">{element.number}</div>
                    <div className="text-sm font-bold">{element.symbol}</div>
                    <div className="text-[6px] opacity-70 truncate">
                      {isRTL ? element.nameAr : element.nameEn}
                    </div>
                  </button>
                );
              }
              
              return <div key={index} className="aspect-square" />;
            })}
          </div>
        </div>

        {/* Element Details */}
        {selectedElement && (
          <div className="p-6 rounded-xl" style={{ 
            backgroundColor: categoryColors[selectedElement.category]?.bg || "#94a3b8",
            color: categoryColors[selectedElement.category]?.text || "white"
          }}>
            <div className="flex items-start gap-6">
              {/* Symbol */}
              <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-5xl font-bold">{selectedElement.symbol}</span>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {isRTL ? selectedElement.nameAr : selectedElement.nameEn}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-white/20 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-70">{labels.atomicNumber}</div>
                    <div className="text-xl font-bold">{selectedElement.number}</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-70">{labels.atomicMass}</div>
                    <div className="text-xl font-bold">{selectedElement.mass}</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-70">{labels.protons}</div>
                    <div className="text-xl font-bold">{selectedElement.number}</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-70">{labels.electrons}</div>
                    <div className="text-xl font-bold">{selectedElement.number}</div>
                  </div>
                </div>
                <Badge className="mt-4 bg-white/30">
                  {categoryColors[selectedElement.category]?.[isRTL ? "labelAr" : "labelEn"]}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <p className="text-sm text-slate-500 text-center">
          {labels.selectElement}
        </p>
      </CardContent>
    </Card>
  );
}
