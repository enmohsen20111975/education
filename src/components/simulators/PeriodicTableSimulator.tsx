"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Atom, Zap, Flame, Wind, Droplets, Beaker } from "lucide-react";

interface PeriodicTableProps {
  language: "ar" | "en";
}

// Periodic table data (simplified)
const elements = [
  // Period 1
  { symbol: "H", nameAr: "هيدروجين", nameEn: "Hydrogen", number: 1, mass: 1.008, category: "nonmetal", group: 1, period: 1 },
  { symbol: "He", nameAr: "هيليوم", nameEn: "Helium", number: 2, mass: 4.003, category: "noble-gas", group: 18, period: 1 },
  // Period 2
  { symbol: "Li", nameAr: "ليثيوم", nameEn: "Lithium", number: 3, mass: 6.941, category: "alkali-metal", group: 1, period: 2 },
  { symbol: "Be", nameAr: "بريليوم", nameEn: "Beryllium", number: 4, mass: 9.012, category: "alkaline-earth", group: 2, period: 2 },
  { symbol: "B", nameAr: "بورون", nameEn: "Boron", number: 5, mass: 10.81, category: "metalloid", group: 13, period: 2 },
  { symbol: "C", nameAr: "كربون", nameEn: "Carbon", number: 6, mass: 12.01, category: "nonmetal", group: 14, period: 2 },
  { symbol: "N", nameAr: "نيتروجين", nameEn: "Nitrogen", number: 7, mass: 14.01, category: "nonmetal", group: 15, period: 2 },
  { symbol: "O", nameAr: "أكسجين", nameEn: "Oxygen", number: 8, mass: 16.00, category: "nonmetal", group: 16, period: 2 },
  { symbol: "F", nameAr: "فلور", nameEn: "Fluorine", number: 9, mass: 19.00, category: "halogen", group: 17, period: 2 },
  { symbol: "Ne", nameAr: "نيون", nameEn: "Neon", number: 10, mass: 20.18, category: "noble-gas", group: 18, period: 2 },
  // Period 3
  { symbol: "Na", nameAr: "صوديوم", nameEn: "Sodium", number: 11, mass: 22.99, category: "alkali-metal", group: 1, period: 3 },
  { symbol: "Mg", nameAr: "ماغنسيوم", nameEn: "Magnesium", number: 12, mass: 24.31, category: "alkaline-earth", group: 2, period: 3 },
  { symbol: "Al", nameAr: "ألومنيوم", nameEn: "Aluminum", number: 13, mass: 26.98, category: "post-transition", group: 13, period: 3 },
  { symbol: "Si", nameAr: "سيليكون", nameEn: "Silicon", number: 14, mass: 28.09, category: "metalloid", group: 14, period: 3 },
  { symbol: "P", nameAr: "فوسفور", nameEn: "Phosphorus", number: 15, mass: 30.97, category: "nonmetal", group: 15, period: 3 },
  { symbol: "S", nameAr: "كبريت", nameEn: "Sulfur", number: 16, mass: 32.07, category: "nonmetal", group: 16, period: 3 },
  { symbol: "Cl", nameAr: "كلور", nameEn: "Chlorine", number: 17, mass: 35.45, category: "halogen", group: 17, period: 3 },
  { symbol: "Ar", nameAr: "أرجون", nameEn: "Argon", number: 18, mass: 39.95, category: "noble-gas", group: 18, period: 3 },
  // Period 4
  { symbol: "K", nameAr: "بوتاسيوم", nameEn: "Potassium", number: 19, mass: 39.10, category: "alkali-metal", group: 1, period: 4 },
  { symbol: "Ca", nameAr: "كالسيوم", nameEn: "Calcium", number: 20, mass: 40.08, category: "alkaline-earth", group: 2, period: 4 },
  { symbol: "Fe", nameAr: "حديد", nameEn: "Iron", number: 26, mass: 55.85, category: "transition-metal", group: 8, period: 4 },
  { symbol: "Cu", nameAr: "نحاس", nameEn: "Copper", number: 29, mass: 63.55, category: "transition-metal", group: 11, period: 4 },
  { symbol: "Zn", nameAr: "زنك", nameEn: "Zinc", number: 30, mass: 65.38, category: "transition-metal", group: 12, period: 4 },
  { symbol: "Br", nameAr: "بروم", nameEn: "Bromine", number: 35, mass: 79.90, category: "halogen", group: 17, period: 4 },
  { symbol: "Kr", nameAr: "كريبتون", nameEn: "Krypton", number: 36, mass: 83.80, category: "noble-gas", group: 18, period: 4 },
  // Period 5
  { symbol: "Ag", nameAr: "فضة", nameEn: "Silver", number: 47, mass: 107.87, category: "transition-metal", group: 11, period: 5 },
  { symbol: "I", nameAr: "يود", nameEn: "Iodine", number: 53, mass: 126.90, category: "halogen", group: 17, period: 5 },
  { symbol: "Xe", nameAr: "زينون", nameEn: "Xenon", number: 54, mass: 131.29, category: "noble-gas", group: 18, period: 5 },
  // Period 6
  { symbol: "Au", nameAr: "ذهب", nameEn: "Gold", number: 79, mass: 196.97, category: "transition-metal", group: 11, period: 6 },
  { symbol: "Hg", nameAr: "زئبق", nameEn: "Mercury", number: 80, mass: 200.59, category: "transition-metal", group: 12, period: 6 },
  { symbol: "Pb", nameAr: "رصاص", nameEn: "Lead", number: 82, mass: 207.2, category: "post-transition", group: 14, period: 6 },
  { symbol: "Rn", nameAr: "رادون", nameEn: "Radon", number: 86, mass: 222, category: "noble-gas", group: 18, period: 6 },
  // Period 7
  { symbol: "U", nameAr: "يورانيوم", nameEn: "Uranium", number: 92, mass: 238.03, category: "actinide", group: 3, period: 7 },
];

const categoryColors: Record<string, string> = {
  "alkali-metal": "bg-red-400 hover:bg-red-500",
  "alkaline-earth": "bg-orange-400 hover:bg-orange-500",
  "transition-metal": "bg-yellow-400 hover:bg-yellow-500",
  "post-transition": "bg-green-400 hover:bg-green-500",
  "metalloid": "bg-teal-400 hover:bg-teal-500",
  "nonmetal": "bg-blue-400 hover:bg-blue-500",
  "halogen": "bg-indigo-400 hover:bg-indigo-500",
  "noble-gas": "bg-purple-400 hover:bg-purple-500",
  "lanthanide": "bg-pink-400 hover:bg-pink-500",
  "actinide": "bg-rose-400 hover:bg-rose-500",
};

const categoryNames = {
  ar: {
    "alkali-metal": "فلز قلوي",
    "alkaline-earth": "فلز أرضي قلوي",
    "transition-metal": "فلز انتقالي",
    "post-transition": "فلز بعد انتقالي",
    "metalloid": "أشباه الفلزات",
    "nonmetal": "لا فلز",
    "halogen": "هالوجين",
    "noble-gas": "غاز نبيل",
    "lanthanide": "لانثانيد",
    "actinide": "أكتينيد",
  },
  en: {
    "alkali-metal": "Alkali Metal",
    "alkaline-earth": "Alkaline Earth",
    "transition-metal": "Transition Metal",
    "post-transition": "Post-Transition",
    "metalloid": "Metalloid",
    "nonmetal": "Nonmetal",
    "halogen": "Halogen",
    "noble-gas": "Noble Gas",
    "lanthanide": "Lanthanide",
    "actinide": "Actinide",
  },
};

export function PeriodicTableSimulator({ language }: PeriodicTableProps) {
  const [selectedElement, setSelectedElement] = useState<typeof elements[0] | null>(null);
  const [hoveredElement, setHoveredElement] = useState<typeof elements[0] | null>(null);

  const texts = {
    ar: {
      title: "الجدول الدوري التفاعلي",
      description: "استكشف العناصر الكيميائية وخصائصها",
      atomicNumber: "العدد الذري",
      atomicMass: "الكتلة الذرية",
      category: "التصنيف",
      group: "المجموعة",
      period: "الدورة",
      electronConfig: "التوزيع الإلكتروني",
      properties: "الخصائص",
    },
    en: {
      title: "Interactive Periodic Table",
      description: "Explore chemical elements and their properties",
      atomicNumber: "Atomic Number",
      atomicMass: "Atomic Mass",
      category: "Category",
      group: "Group",
      period: "Period",
      electronConfig: "Electron Configuration",
      properties: "Properties",
    },
  };

  const t = texts[language];
  const catNames = categoryNames[language];

  // Animation for elements
  const [animationEnabled, setAnimationEnabled] = useState(true);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
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
      <CardContent className="p-6 space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded ${color.split(" ")[0]}`} />
              <span className="text-xs">{catNames[cat as keyof typeof catNames] || cat}</span>
            </div>
          ))}
        </div>

        {/* Periodic Table Grid */}
        <div className="overflow-x-auto">
          <div className="grid gap-1 min-w-[800px]" style={{ gridTemplateColumns: "repeat(18, minmax(45px, 1fr))" }}>
            {Array.from({ length: 7 * 18 }).map((_, index) => {
              const period = Math.floor(index / 18) + 1;
              const group = (index % 18) + 1;
              const element = elements.find(e => e.group === group && e.period === period);

              if (element) {
                return (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-lg p-1 cursor-pointer
                      flex flex-col items-center justify-center
                      transition-all duration-300 transform
                      ${categoryColors[element.category]}
                      ${selectedElement?.symbol === element.symbol ? "ring-4 ring-black scale-110 z-10" : ""}
                      ${animationEnabled ? "hover:scale-110 hover:shadow-lg" : ""}
                    `}
                    onMouseEnter={() => setHoveredElement(element)}
                    onMouseLeave={() => setHoveredElement(null)}
                    onClick={() => setSelectedElement(element)}
                  >
                    <span className="text-[10px] text-slate-700">{element.number}</span>
                    <span className="font-bold text-sm text-slate-800">{element.symbol}</span>
                    <span className="text-[8px] text-slate-600">{element.mass.toFixed(1)}</span>
                  </div>
                );
              }

              return <div key={index} className="aspect-square" />;
            })}
          </div>
        </div>

        {/* Element Details */}
        {(selectedElement || hoveredElement) && (
          <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            selectedElement ? "bg-white border-purple-300 shadow-lg" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-start gap-6">
              {/* Element Symbol Box */}
              <div className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center text-white ${
                categoryColors[(selectedElement || hoveredElement)!.category].split(" ")[0]
              }`}>
                <span className="text-xs">{(selectedElement || hoveredElement)!.number}</span>
                <span className="text-3xl font-bold">{(selectedElement || hoveredElement)!.symbol}</span>
                <span className="text-xs">{(selectedElement || hoveredElement)!.mass.toFixed(2)}</span>
              </div>

              {/* Element Info */}
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">
                  {language === "ar" 
                    ? (selectedElement || hoveredElement)!.nameAr 
                    : (selectedElement || hoveredElement)!.nameEn}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">{t.atomicNumber}: </span>
                    <span className="font-medium">{(selectedElement || hoveredElement)!.number}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.atomicMass}: </span>
                    <span className="font-medium">{(selectedElement || hoveredElement)!.mass.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.category}: </span>
                    <Badge className={categoryColors[(selectedElement || hoveredElement)!.category].split(" ")[0]}>
                      {catNames[(selectedElement || hoveredElement)!.category as keyof typeof catNames]}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.group}: </span>
                    <span className="font-medium">{(selectedElement || hoveredElement)!.group}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.period}: </span>
                    <span className="font-medium">{(selectedElement || hoveredElement)!.period}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interesting Facts */}
        {selectedElement && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {language === "ar" ? "معلومة مثيرة للاهتمام" : "Interesting Fact"}
            </h4>
            <p className="text-sm text-slate-600">
              {selectedElement.symbol === "Au" && (language === "ar" 
                ? "الذهب لا يصدأ ولا يتأثر بالأحماض العادية، ولذلك استخدمه الفراعنة في صناعة التماثيل والحلي."
                : "Gold doesn't rust and isn't affected by ordinary acids, which is why pharaohs used it for statues and jewelry.")}
              {selectedElement.symbol === "Fe" && (language === "ar"
                ? "الحديد هو أكثر العناصر وفرة على الأرض ويشكل حوالي 35% من كتلة الأرض."
                : "Iron is the most abundant element on Earth, making up about 35% of Earth's mass.")}
              {selectedElement.symbol === "O" && (language === "ar"
                ? "الأكسجين يشكل حوالي 21% من الغلاف الجوي وهو ضروري لتنفس الكائنات الحية."
                : "Oxygen makes up about 21% of the atmosphere and is essential for living organisms to breathe.")}
              {selectedElement.symbol === "H" && (language === "ar"
                ? "الهيدروجين هو أخف عنصر في الكون وهو العنصر الأكثر وفرة في الكون."
                : "Hydrogen is the lightest element in the universe and the most abundant element in the universe.")}
              {selectedElement.symbol === "C" && (language === "ar"
                ? "الكربون هو أساس الحياة على الأرض، وكل المركبات العضوية تحتوي على الكربون."
                : "Carbon is the basis of life on Earth, and all organic compounds contain carbon.")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
