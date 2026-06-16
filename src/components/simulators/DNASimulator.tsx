"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dna, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface DNASimulatorProps {
  language: "ar" | "en";
}

export function DNASimulator({ language }: DNASimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [sequence1, setSequence1] = useState("ATCGATCG");
  const [sequence2, setSequence2] = useState("TAGCTAGC");
  const [showLabels, setShowLabels] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [animating, setAnimating] = useState(false);

  const texts = {
    ar: {
      title: "محاكي DNA",
      description: "استكشف بنية الحمض النووي والتكامل القاعدي",
      strand1: "الخيط الأول (5' → 3')",
      strand2: "الخيط الثاني (3' → 5')",
      basePairing: "التكامل القاعدي",
      adenine: "أدينين (A)",
      thymine: "ثايمين (T)",
      guanine: "جوانين (G)",
      cytosine: "سايتوسين (C)",
      pairingRule: "A ↔ T | G ↔ C",
      showLabels: "إظهار التسميات",
      animate: "تدوير",
      stop: "إيقاف",
      reset: "إعادة",
      validPair: "زوج صحيح ✓",
      invalidPair: "زوج غير صحيح ✗",
    },
    en: {
      title: "DNA Simulator",
      description: "Explore DNA structure and base pairing",
      strand1: "Strand 1 (5' → 3')",
      strand2: "Strand 2 (3' → 5')",
      basePairing: "Base Pairing",
      adenine: "Adenine (A)",
      thymine: "Thymine (T)",
      guanine: "Guanine (G)",
      cytosine: "Cytosine (C)",
      pairingRule: "A ↔ T | G ↔ C",
      showLabels: "Show Labels",
      animate: "Animate",
      stop: "Stop",
      reset: "Reset",
      validPair: "Valid pair ✓",
      invalidPair: "Invalid pair ✗",
    },
  };

  const t = texts[language];

  const baseColors: Record<string, string> = {
    A: "#ef4444", // Adenine - Red
    T: "#22c55e", // Thymine - Green
    G: "#3b82f6", // Guanine - Blue
    C: "#f59e0b", // Cytosine - Orange
  };

  const complementaryBase: Record<string, string> = {
    A: "T",
    T: "A",
    G: "C",
    C: "G",
  };

  const checkPairing = (base1: string, base2: string): boolean => {
    return complementaryBase[base1] === base2;
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = "#f0fdf4";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const helixWidth = 120;
    const baseHeight = 35;
    const startY = -((sequence1.length - 1) * baseHeight) / 2;

    // Draw DNA double helix
    for (let i = 0; i < sequence1.length; i++) {
      const base1 = sequence1[i];
      const base2 = sequence2[i];
      const y = startY + i * baseHeight;

      // Left backbone
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      const leftX = -helixWidth / 2 + Math.sin((i + rotation / 10) * 0.5) * 15;
      ctx.moveTo(leftX - 20, y - baseHeight / 2);
      ctx.lineTo(leftX - 20, y + baseHeight / 2);
      ctx.stroke();

      // Right backbone
      ctx.beginPath();
      const rightX = helixWidth / 2 + Math.sin((i + rotation / 10 + Math.PI) * 0.5) * 15;
      ctx.moveTo(rightX + 20, y - baseHeight / 2);
      ctx.lineTo(rightX + 20, y + baseHeight / 2);
      ctx.stroke();

      // Base 1 (left)
      ctx.fillStyle = baseColors[base1] || "#64748b";
      ctx.beginPath();
      ctx.arc(leftX, y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Base 1 label
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(base1, leftX, y);

      // Base 2 (right)
      ctx.fillStyle = baseColors[base2] || "#64748b";
      ctx.beginPath();
      ctx.arc(rightX, y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Base 2 label
      ctx.fillStyle = "#fff";
      ctx.fillText(base2, rightX, y);

      // Hydrogen bonds between bases
      const isValid = checkPairing(base1, base2);
      ctx.strokeStyle = isValid ? "#22c55e" : "#ef4444";
      ctx.lineWidth = isValid ? 3 : 2;
      ctx.setLineDash(isValid ? [] : [4, 4]);
      ctx.beginPath();
      ctx.moveTo(leftX + 15, y);
      ctx.lineTo(rightX - 15, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      if (showLabels && i === Math.floor(sequence1.length / 2)) {
        ctx.fillStyle = "#64748b";
        ctx.font = "10px system-ui";
        ctx.textAlign = "left";
        ctx.fillText("5'", leftX - 50, y);
        ctx.fillText("3'", rightX + 35, y);
      }
    }

    ctx.restore();

    // Title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.basePairing + ": " + t.pairingRule, width / 2, 25);

    // Legend
    const legendY = height - 40;
    const legendX = 30;
    ctx.font = "12px system-ui";
    
    ["A", "T", "G", "C"].forEach((base, i) => {
      ctx.fillStyle = baseColors[base];
      ctx.beginPath();
      ctx.arc(legendX + i * 80, legendY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "left";
      ctx.fillText(base, legendX + i * 80 + 15, legendY + 4);
    });

  }, [sequence1, sequence2, showLabels, rotation, t]);

  // Animation
  useEffect(() => {
    if (animating) {
      const animate = () => {
        setRotation((r) => (r + 1) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animating]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const generateComplementary = () => {
    const comp = sequence1.split('').map(b => complementaryBase[b] || b).join('');
    setSequence2(comp);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-emerald-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Sequence Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-medium text-sm">{t.strand1}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sequence1}
                onChange={(e) => setSequence1(e.target.value.toUpperCase().replace(/[^ATGC]/g, ""))}
                className="flex-1 px-3 py-2 border rounded-lg uppercase font-mono"
                maxLength={10}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">{t.strand2}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sequence2}
                onChange={(e) => setSequence2(e.target.value.toUpperCase().replace(/[^ATGC]/g, ""))}
                className="flex-1 px-3 py-2 border rounded-lg uppercase font-mono"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={generateComplementary} variant="outline" size="sm">
            {language === "ar" ? "تكملة تلقائية" : "Auto Complement"}
          </Button>
          <Button 
            onClick={() => setAnimating(!animating)}
            size="sm"
            className={animating ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}
          >
            {animating ? t.stop : t.animate}
          </Button>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm">{t.showLabels}</label>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full"
          />
        </div>

        {/* Pairing Status */}
        <div className="flex flex-wrap gap-2 justify-center">
          {sequence1.split('').map((base, i) => {
            const base2 = sequence2[i];
            const isValid = base2 && checkPairing(base, base2);
            return (
              <Badge 
                key={i}
                variant={isValid ? "default" : "destructive"}
                className={isValid ? "bg-green-500" : ""}
              >
                {base}-{base2 || "?"} {isValid ? "✓" : "✗"}
              </Badge>
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
          <div className="p-2 bg-red-100 rounded">
            <span className="font-bold">A</span> - {t.adenine}
          </div>
          <div className="p-2 bg-green-100 rounded">
            <span className="font-bold">T</span> - {t.thymine}
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <span className="font-bold">G</span> - {t.guanine}
          </div>
          <div className="p-2 bg-amber-100 rounded">
            <span className="font-bold">C</span> - {t.cytosine}
          </div>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={() => { setSequence1("ATCGATCG"); setSequence2("TAGCTAGC"); setRotation(0); setAnimating(false); }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
