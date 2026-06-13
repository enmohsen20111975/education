"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleDot, ZoomIn, ZoomOut, RotateCcw, Info } from "lucide-react";

interface CellOrganelle {
  id: string;
  nameAr: string;
  nameEn: string;
  functionAr: string;
  functionEn: string;
  color: string;
}

interface CellSimulationProps {
  language: "ar" | "en";
}

const organelles: CellOrganelle[] = [
  {
    id: "nucleus",
    nameAr: "النواة",
    nameEn: "Nucleus",
    functionAr: "مركز التحكم في الخلية، تحتوي على المادة الوراثية DNA",
    functionEn: "Control center of the cell, contains genetic material DNA",
    color: "#8b5cf6"
  },
  {
    id: "mitochondria",
    nameAr: "الميتوكندريا",
    nameEn: "Mitochondria",
    functionAr: "مركز إنتاج الطاقة في الخلية (ATP)",
    functionEn: "Powerhouse of the cell, produces ATP energy",
    color: "#f97316"
  },
  {
    id: "ribosome",
    nameAr: "الريبوسومات",
    nameEn: "Ribosomes",
    functionAr: "تصنع البروتينات من الأحماض الأمينية",
    functionEn: "Synthesize proteins from amino acids",
    color: "#ef4444"
  },
  {
    id: "er",
    nameAr: "الشبكة الإندوبلازمية",
    nameEn: "Endoplasmic Reticulum",
    functionAr: "نقل المواد داخل الخلية وتصنيع البروتينات والدهون",
    functionEn: "Transport materials within cell, produce proteins and lipids",
    color: "#22c55e"
  },
  {
    id: "golgi",
    nameAr: "جهاز جولجي",
    nameEn: "Golgi Apparatus",
    functionAr: "تعديل وتغليف البروتينات للتصدير",
    functionEn: "Modify and package proteins for export",
    color: "#06b6d4"
  },
  {
    id: "lysosome",
    nameAr: "الليسوسومات",
    nameEn: "Lysosomes",
    functionAr: "هضم المواد والفضلات الخلوية",
    functionEn: "Digest cellular waste and materials",
    color: "#ec4899"
  },
  {
    id: "membrane",
    nameAr: "غشاء الخلية",
    nameEn: "Cell Membrane",
    functionAr: "تحكم في دخول وخروج المواد من الخلية",
    functionEn: "Control entry and exit of materials",
    color: "#3b82f6"
  },
  {
    id: "cytoplasm",
    nameAr: "السيتوبلازم",
    nameEn: "Cytoplasm",
    functionAr: "الوسط السائل الذي توجد فيه العضيات",
    functionEn: "Fluid medium where organelles are suspended",
    color: "#fef3c7"
  }
];

export function CellSimulation({ language }: CellSimulationProps) {
  const [selectedOrganelle, setSelectedOrganelle] = useState<CellOrganelle | null>(null);
  const [zoom, setZoom] = useState(1);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكاة الخلية" : "Cell Simulation",
    animalCell: isRTL ? "خلية حيوانية" : "Animal Cell",
    plantCell: isRTL ? "خلية نباتية" : "Plant Cell",
    clickToLearn: isRTL ? "انقر على العضية لمعرفة المزيد" : "Click an organelle to learn more",
    function: isRTL ? "الوظيفة" : "Function",
    zoomIn: isRTL ? "تكبير" : "Zoom In",
    zoomOut: isRTL ? "تصغير" : "Zoom Out",
    reset: isRTL ? "إعادة" : "Reset"
  };

  const handleZoomIn = () => setZoom(Math.min(2, zoom + 0.2));
  const handleZoomOut = () => setZoom(Math.max(0.5, zoom - 0.2));
  const handleReset = () => {
    setZoom(1);
    setSelectedOrganelle(null);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-green-500" />
            {labels.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cell Visualization */}
        <div className="relative bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
          <div 
            className="relative"
            style={{ transform: `scale(${zoom})`, transition: "transform 0.3s ease" }}
          >
            <svg viewBox="0 0 400 400" className="w-[400px] h-[400px]">
              {/* Cell Membrane */}
              <ellipse
                cx="200"
                cy="200"
                rx="180"
                ry="170"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "membrane") || null)}
                style={{ cursor: "pointer" }}
              />
              
              {/* Cytoplasm */}
              <ellipse
                cx="200"
                cy="200"
                rx="170"
                ry="160"
                fill="#fef9c3"
                opacity="0.5"
              />
              
              {/* Nucleus */}
              <ellipse
                cx="200"
                cy="200"
                rx="60"
                ry="55"
                fill="#8b5cf6"
                stroke="#7c3aed"
                strokeWidth="3"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "nucleus") || null)}
                style={{ cursor: "pointer" }}
              />
              <ellipse cx="200" cy="200" rx="15" ry="12" fill="#a78bfa" />
              
              {/* Nucleolus */}
              <circle cx="210" cy="195" r="8" fill="#c4b5fd" />
              
              {/* Mitochondria 1 */}
              <ellipse
                cx="90"
                cy="150"
                rx="30"
                ry="15"
                fill="#f97316"
                stroke="#ea580c"
                strokeWidth="2"
                transform="rotate(-30 90 150)"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "mitochondria") || null)}
                style={{ cursor: "pointer" }}
              />
              <path d="M 75 145 Q 90 150 105 145" fill="none" stroke="#fb923c" strokeWidth="1.5" transform="rotate(-30 90 150)" />
              
              {/* Mitochondria 2 */}
              <ellipse
                cx="320"
                cy="250"
                rx="25"
                ry="12"
                fill="#f97316"
                stroke="#ea580c"
                strokeWidth="2"
                transform="rotate(45 320 250)"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "mitochondria") || null)}
                style={{ cursor: "pointer" }}
              />
              
              {/* Endoplasmic Reticulum */}
              <path
                d="M 280 130 Q 310 150 300 180 Q 290 210 320 230"
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeLinecap="round"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "er") || null)}
                style={{ cursor: "pointer" }}
              />
              
              {/* Rough ER with ribosomes */}
              <path
                d="M 120 280 Q 100 300 130 320 Q 160 340 140 360"
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeLinecap="round"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "er") || null)}
                style={{ cursor: "pointer" }}
              />
              
              {/* Ribosomes (small dots) */}
              {[
                [120, 280], [125, 285], [115, 290], [130, 320], [135, 325],
                [145, 340], [150, 345], [155, 350]
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ef4444"
                  onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "ribosome") || null)}
                  style={{ cursor: "pointer" }}
                />
              ))}
              
              {/* Golgi Apparatus */}
              <g onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "golgi") || null)} style={{ cursor: "pointer" }}>
                <path d="M 300 300 Q 330 310 340 330" fill="none" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" />
                <path d="M 295 315 Q 325 325 335 345" fill="none" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" />
                <path d="M 290 330 Q 320 340 330 360" fill="none" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" />
              </g>
              
              {/* Lysosomes */}
              <circle cx="100" cy="300" r="12" fill="#ec4899" stroke="#db2777" strokeWidth="2"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "lysosome") || null)}
                style={{ cursor: "pointer" }}
              />
              <circle cx="80" cy="280" r="10" fill="#ec4899" stroke="#db2777" strokeWidth="2"
                onClick={() => setSelectedOrganelle(organelles.find(o => o.id === "lysosome") || null)}
                style={{ cursor: "pointer" }}
              />
              
              {/* Centrosome */}
              <g transform="translate(280 180)">
                <rect x="-5" y="-15" width="10" height="30" fill="#64748b" rx="2" transform="rotate(45)" />
                <rect x="-5" y="-15" width="10" height="30" fill="#64748b" rx="2" transform="rotate(-45)" />
              </g>
            </svg>
          </div>
        </div>
        
        {/* Organelle Legend */}
        <div className="flex flex-wrap gap-2 justify-center">
          {organelles.slice(0, 7).map((org) => (
            <button
              key={org.id}
              onClick={() => setSelectedOrganelle(org)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedOrganelle?.id === org.id ? "ring-2 ring-black scale-105" : ""
              }`}
              style={{ backgroundColor: org.color, color: org.id === "cytoplasm" ? "black" : "white" }}
            >
              {isRTL ? org.nameAr : org.nameEn}
            </button>
          ))}
        </div>
        
        {/* Selected Organelle Info */}
        {selectedOrganelle && (
          <div 
            className="p-6 rounded-xl text-white"
            style={{ backgroundColor: selectedOrganelle.color }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {isRTL ? selectedOrganelle.nameAr : selectedOrganelle.nameEn}
                </h3>
                <Badge className="bg-white/30 mt-1">
                  {isRTL ? selectedOrganelle.nameEn : selectedOrganelle.nameAr}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">{labels.function}:</p>
              <p className="font-medium">
                {isRTL ? selectedOrganelle.functionAr : selectedOrganelle.functionEn}
              </p>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <p className="text-sm text-slate-500 text-center">
          {labels.clickToLearn}
        </p>
      </CardContent>
    </Card>
  );
}
