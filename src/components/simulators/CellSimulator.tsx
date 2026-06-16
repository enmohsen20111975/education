"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dna, RotateCcw, Microscope } from "lucide-react";

interface CellSimulatorProps {
  language: "ar" | "en";
}

export function CellSimulator({ language }: CellSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const texts = {
    ar: {
      title: "محاكي الخلية",
      description: "استكشف مكونات الخلية النباتية والحيوانية",
      cellType: "نوع الخلية",
      plant: "نباتية",
      animal: "حيوانية",
      organelles: "العضيات",
      nucleus: "النواة",
      mitochondria: "الميتوكوندريا",
      ribosomes: "الريبوسومات",
      er: "الشبكة الإندوبلازمية",
      golgi: "جهاز جولجي",
      lysosomes: "الليسوسومات",
      chloroplast: "البلاستيدات الخضراء",
      cellWall: "جدار الخلية",
      vacuole: "الفجوة العصارية",
      function: "الوظيفة",
      reset: "إعادة",
      clickToExplore: "انقر على العضيات لاستكشافها",
    },
    en: {
      title: "Cell Simulator",
      description: "Explore plant and animal cell components",
      cellType: "Cell Type",
      plant: "Plant",
      animal: "Animal",
      organelles: "Organelles",
      nucleus: "Nucleus",
      mitochondria: "Mitochondria",
      ribosomes: "Ribosomes",
      er: "Endoplasmic Reticulum",
      golgi: "Golgi Apparatus",
      lysosomes: "Lysosomes",
      chloroplast: "Chloroplast",
      cellWall: "Cell Wall",
      vacuole: "Vacuole",
      function: "Function",
      reset: "Reset",
      clickToExplore: "Click on organelles to explore",
    },
  };

  const t = texts[language];

  const [cellType, setCellType] = useState<"plant" | "animal">("animal");

  const organelleInfo: Record<string, { color: string; functionAr: string; functionEn: string }> = {
    nucleus: {
      color: "#8b5cf6",
      functionAr: "مركز التحكم في الخلية، تحتوي على المادة الوراثية DNA",
      functionEn: "Control center of the cell, contains genetic material DNA",
    },
    mitochondria: {
      color: "#f59e0b",
      functionAr: "محطة الطاقة في الخلية، تنتج ATP",
      functionEn: "Powerhouse of the cell, produces ATP",
    },
    ribosomes: {
      color: "#ef4444",
      functionAr: "تصنع البروتينات من الأحماض الأمينية",
      functionEn: "Synthesize proteins from amino acids",
    },
    er: {
      color: "#06b6d4",
      functionAr: "نقل المواد داخل الخلية",
      functionEn: "Transport materials within the cell",
    },
    golgi: {
      color: "#ec4899",
      functionAr: "تعديل وتعبئة البروتينات",
      functionEn: "Modify and package proteins",
    },
    lysosomes: {
      color: "#84cc16",
      functionAr: "هضم المواد الزائدة والضارة",
      functionEn: "Digest waste materials and harmful substances",
    },
    chloroplast: {
      color: "#22c55e",
      functionAr: "إجراء عملية البناء الضوئي",
      functionEn: "Perform photosynthesis",
    },
    cellWall: {
      color: "#a16207",
      functionAr: "توفير الدعم والحماية للخلية",
      functionEn: "Provide structural support and protection",
    },
    vacuole: {
      color: "#6366f1",
      functionAr: "تخزين الماء والمغذيات",
      functionEn: "Store water and nutrients",
    },
  };

  const drawCell = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const cellRadius = 120 * zoom;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(0, 0, width, height);

    if (cellType === "plant") {
      // Cell wall (rectangle for plant cell)
      ctx.fillStyle = "#a16207";
      ctx.fillRect(cx - cellRadius - 10, cy - cellRadius - 10, (cellRadius + 10) * 2, (cellRadius + 10) * 2);
      
      // Cell membrane
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(cx - cellRadius, cy - cellRadius, cellRadius * 2, cellRadius * 2);
      
      // Large central vacuole
      ctx.fillStyle = "#dbeafe";
      ctx.fillRect(cx - cellRadius * 0.7, cy - cellRadius * 0.7, cellRadius * 1.4, cellRadius * 1.4);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - cellRadius * 0.7, cy - cellRadius * 0.7, cellRadius * 1.4, cellRadius * 1.4);
    } else {
      // Cell membrane (oval for animal cell)
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.ellipse(cx, cy, cellRadius, cellRadius * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Nucleus
    const nucleusColor = selectedOrganelle === "nucleus" ? "#a78bfa" : "#8b5cf6";
    ctx.fillStyle = nucleusColor;
    ctx.beginPath();
    ctx.arc(cx, cy, cellRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Nucleolus
    ctx.fillStyle = "#6d28d9";
    ctx.beginPath();
    ctx.arc(cx, cy, cellRadius * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Mitochondria
    const mitoColor = selectedOrganelle === "mitochondria" ? "#fcd34d" : "#f59e0b";
    ctx.fillStyle = mitoColor;
    const mitoPositions = cellType === "plant" 
      ? [{ x: cx - cellRadius * 0.5, y: cy - cellRadius * 0.4 }, { x: cx + cellRadius * 0.4, y: cy + cellRadius * 0.3 }]
      : [{ x: cx - cellRadius * 0.6, y: cy - cellRadius * 0.3 }, { x: cx + cellRadius * 0.5, y: cy + cellRadius * 0.2 }];
    
    mitoPositions.forEach(pos => {
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y, cellRadius * 0.12, cellRadius * 0.06, Math.random(), 0, Math.PI * 2);
      ctx.fill();
      // Inner membrane folds
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pos.x - cellRadius * 0.08, pos.y);
      ctx.lineTo(pos.x - cellRadius * 0.04, pos.y - 3);
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y + 3);
      ctx.moveTo(pos.x + cellRadius * 0.04, pos.y);
      ctx.lineTo(pos.x + cellRadius * 0.08, pos.y - 3);
      ctx.stroke();
    });

    // Endoplasmic Reticulum
    const erColor = selectedOrganelle === "er" ? "#22d3ee" : "#06b6d4";
    ctx.strokeStyle = erColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const startY = cy + cellRadius * 0.2 + i * 15;
      ctx.moveTo(cx + cellRadius * 0.35, startY);
      ctx.bezierCurveTo(
        cx + cellRadius * 0.5, startY - 10,
        cx + cellRadius * 0.6, startY + 10,
        cx + cellRadius * 0.7, startY
      );
    }
    ctx.stroke();

    // Golgi Apparatus
    const golgiColor = selectedOrganelle === "golgi" ? "#f472b6" : "#ec4899";
    ctx.fillStyle = golgiColor;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(cx - cellRadius * 0.4 + i * 8, cy + cellRadius * 0.4, cellRadius * 0.08 + i * 3, cellRadius * 0.03, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ribosomes (small dots)
    if (selectedOrganelle === "ribosomes" || !selectedOrganelle) {
      ctx.fillStyle = selectedOrganelle === "ribosomes" ? "#f87171" : "#ef4444";
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * cellRadius * 0.8;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Lysosomes (animal only)
    if (cellType === "animal") {
      const lysoColor = selectedOrganelle === "lysosomes" ? "#a3e635" : "#84cc16";
      ctx.fillStyle = lysoColor;
      ctx.beginPath();
      ctx.arc(cx - cellRadius * 0.5, cy - cellRadius * 0.4, cellRadius * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + cellRadius * 0.3, cy - cellRadius * 0.5, cellRadius * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }

    // Chloroplasts (plant only)
    if (cellType === "plant") {
      const chloroColor = selectedOrganelle === "chloroplast" ? "#4ade80" : "#22c55e";
      ctx.fillStyle = chloroColor;
      const chloroPos = [
        { x: cx - cellRadius * 0.3, y: cy - cellRadius * 0.6 },
        { x: cx + cellRadius * 0.35, y: cy - cellRadius * 0.5 },
        { x: cx - cellRadius * 0.2, y: cy + cellRadius * 0.6 },
      ];
      chloroPos.forEach(pos => {
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, cellRadius * 0.1, cellRadius * 0.06, Math.random(), 0, Math.PI * 2);
        ctx.fill();
        // Thylakoids
        ctx.strokeStyle = "#15803d";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, cellRadius * 0.03, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.fillText(cellType === "plant" ? t.plant : t.animal, 10, 20);

  }, [cellType, selectedOrganelle, zoom, t.plant, t.animal]);

  useEffect(() => {
    drawCell();
  }, [drawCell]);

  const handleOrganelleClick = (name: string) => {
    setSelectedOrganelle(selectedOrganelle === name ? null : name);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-green-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Cell Type Toggle */}
        <div className="flex gap-3">
          <Button
            variant={cellType === "animal" ? "default" : "outline"}
            onClick={() => { setCellType("animal"); setSelectedOrganelle(null); }}
            className={cellType === "animal" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {t.animal}
          </Button>
          <Button
            variant={cellType === "plant" ? "default" : "outline"}
            onClick={() => { setCellType("plant"); setSelectedOrganelle(null); }}
            className={cellType === "plant" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {t.plant}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Organelle Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(organelleInfo).map(([key, info]) => {
            if (key === "chloroplast" && cellType !== "plant") return null;
            if (key === "cellWall" && cellType !== "plant") return null;
            if (key === "lysosomes" && cellType !== "animal") return null;
            
            return (
              <Button
                key={key}
                variant={selectedOrganelle === key ? "default" : "outline"}
                onClick={() => handleOrganelleClick(key)}
                size="sm"
                style={{ borderColor: info.color }}
                className={selectedOrganelle === key ? "text-white" : ""}
              >
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: info.color }}
                />
                {t[key as keyof typeof t] || key}
              </Button>
            );
          })}
        </div>

        {/* Selected Organelle Info */}
        {selectedOrganelle && organelleInfo[selectedOrganelle] && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: organelleInfo[selectedOrganelle].color + "20" }}>
            <h4 className="font-bold mb-2" style={{ color: organelleInfo[selectedOrganelle].color }}>
              {t[selectedOrganelle as keyof typeof t] || selectedOrganelle}
            </h4>
            <p className="text-sm">
              {language === "ar" 
                ? organelleInfo[selectedOrganelle].functionAr 
                : organelleInfo[selectedOrganelle].functionEn}
            </p>
          </div>
        )}

        {/* Instructions */}
        <p className="text-sm text-slate-500 text-center">{t.clickToExplore}</p>

        {/* Reset */}
        <Button variant="outline" onClick={() => { setSelectedOrganelle(null); setZoom(1); }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
