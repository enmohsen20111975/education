"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dna, RotateCcw, Shuffle } from "lucide-react";

interface GeneticsSimulatorProps {
  language: "ar" | "en";
}

export function GeneticsSimulator({ language }: GeneticsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [parent1Genotype, setParent1Genotype] = useState<"AA" | "Aa" | "aa">("Aa");
  const [parent2Genotype, setParent2Genotype] = useState<"AA" | "Aa" | "aa">("Aa");

  const texts = {
    ar: {
      title: "محاكي الوراثة",
      description: "استكشف قانون مندل وتراكيب الجينات",
      parent1: "الأب",
      parent2: "الأم",
      genotype: "التركيب الجيني",
      phenotype: "التركيب الظاهري",
      offspring: "النسل",
      ratio: "النسبة",
      homozygousDominant: "متماثل سائد (AA)",
      heterozygous: "متغاير (Aa)",
      homozygousRecessive: "متماثل متنحي (aa)",
      dominant: "سائد",
      recessive: "متنحي",
      punnettSquare: "مربع بنيت",
      generate: "توليد",
      reset: "إعادة",
    },
    en: {
      title: "Genetics Simulator",
      description: "Explore Mendel's laws and genotypes",
      parent1: "Father",
      parent2: "Mother",
      genotype: "Genotype",
      phenotype: "Phenotype",
      offspring: "Offspring",
      ratio: "Ratio",
      homozygousDominant: "Homozygous Dominant (AA)",
      heterozygous: "Heterozygous (Aa)",
      homozygousRecessive: "Homozygous Recessive (aa)",
      dominant: "Dominant",
      recessive: "Recessive",
      punnettSquare: "Punnett Square",
      generate: "Generate",
      reset: "Reset",
    },
  };

  const t = texts[language];

  // Calculate offspring ratios
  const calculateOffspring = () => {
    const alleles1 = parent1Genotype.split('');
    const alleles2 = parent2Genotype.split('');
    
    const offspring: Record<string, number> = {};
    
    alleles1.forEach(a1 => {
      alleles2.forEach(a2 => {
        const sorted = [a1, a2].sort().join('');
        offspring[sorted] = (offspring[sorted] || 0) + 1;
      });
    });
    
    const total = 4;
    const ratios = {
      AA: (offspring['AA'] || 0) / total,
      Aa: (offspring['Aa'] || 0) / total,
      aa: (offspring['aa'] || 0) / total,
    };
    
    const dominantPhenotype = ratios.AA + ratios.Aa;
    const recessivePhenotype = ratios.aa;
    
    return { offspring, ratios, dominantPhenotype, recessivePhenotype };
  };

  const { offspring, ratios, dominantPhenotype, recessivePhenotype } = calculateOffspring();

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw Punnett Square
    const squareSize = 100;
    const startX = 120;
    const startY = 100;
    
    const alleles1 = parent1Genotype.split('');
    const alleles2 = parent2Genotype.split('');

    // Grid
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + squareSize * 2);
    ctx.stroke();
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(startX, startY + squareSize);
    ctx.lineTo(startX + squareSize * 2, startY + squareSize);
    ctx.stroke();

    // Parent 2 alleles (top)
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(alleles2[0], startX + squareSize / 2, startY - 20);
    ctx.fillText(alleles2[1], startX + squareSize * 1.5, startY - 20);

    // Parent 1 alleles (left)
    ctx.fillText(alleles1[0], startX - 30, startY + squareSize / 2 + 8);
    ctx.fillText(alleles1[1], startX - 30, startY + squareSize * 1.5 + 8);

    // Fill in the squares
    const combinations = [
      [alleles1[0] + alleles2[0], 0, 0],
      [alleles1[0] + alleles2[1], 1, 0],
      [alleles1[1] + alleles2[0], 0, 1],
      [alleles1[1] + alleles2[1], 1, 1],
    ];

    combinations.forEach(([combo, col, row]) => {
      const sorted = (combo as string).split('').sort().join('');
      const x = startX + col * squareSize;
      const y = startY + row * squareSize;
      
      // Background color
      if (sorted === 'AA') {
        ctx.fillStyle = "#dcfce7";
      } else if (sorted === 'Aa') {
        ctx.fillStyle = "#fef3c7";
      } else {
        ctx.fillStyle = "#fee2e2";
      }
      ctx.fillRect(x, y, squareSize, squareSize);
      
      // Genotype
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 28px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(sorted, x + squareSize / 2, y + squareSize / 2 + 10);
    });

    // Square borders
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, squareSize, squareSize);
    ctx.strokeRect(startX + squareSize, startY, squareSize, squareSize);
    ctx.strokeRect(startX, startY + squareSize, squareSize, squareSize);
    ctx.strokeRect(startX + squareSize, startY + squareSize, squareSize, squareSize);

    // Parent labels
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(t.parent2 + ": " + parent2Genotype, startX, 40);
    ctx.fillText(t.parent1 + ": " + parent1Genotype, 10, startY + squareSize);

    // Results section
    const resultsX = startX + squareSize * 2 + 50;
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px system-ui";
    ctx.fillText(t.offspring + ":", resultsX, 60);
    
    ctx.font = "14px system-ui";
    let yPos = 90;
    
    if (ratios.AA > 0) {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(resultsX, yPos - 15, ratios.AA * 150, 20);
      ctx.fillStyle = "#1e293b";
      ctx.fillText(`AA: ${(ratios.AA * 100).toFixed(0)}%`, resultsX + 160, yPos);
      yPos += 30;
    }
    
    if (ratios.Aa > 0) {
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(resultsX, yPos - 15, ratios.Aa * 150, 20);
      ctx.fillStyle = "#1e293b";
      ctx.fillText(`Aa: ${(ratios.Aa * 100).toFixed(0)}%`, resultsX + 160, yPos);
      yPos += 30;
    }
    
    if (ratios.aa > 0) {
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(resultsX, yPos - 15, ratios.aa * 150, 20);
      ctx.fillStyle = "#1e293b";
      ctx.fillText(`aa: ${(ratios.aa * 100).toFixed(0)}%`, resultsX + 160, yPos);
    }

    // Phenotype
    yPos += 50;
    ctx.font = "bold 14px system-ui";
    ctx.fillText(t.phenotype + ":", resultsX, yPos);
    yPos += 25;
    ctx.font = "13px system-ui";
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`${t.dominant}: ${(dominantPhenotype * 100).toFixed(0)}%`, resultsX, yPos);
    yPos += 20;
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`${t.recessive}: ${(recessivePhenotype * 100).toFixed(0)}%`, resultsX, yPos);

  }, [parent1Genotype, parent2Genotype, ratios, dominantPhenotype, recessivePhenotype, t]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-teal-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Genotype Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="font-medium">{t.parent1} - {t.genotype}</label>
            <div className="flex gap-2">
              {(["AA", "Aa", "aa"] as const).map((g) => (
                <Button
                  key={g}
                  variant={parent1Genotype === g ? "default" : "outline"}
                  onClick={() => setParent1Genotype(g)}
                  size="sm"
                  className={parent1Genotype === g ? "bg-teal-500 hover:bg-teal-600" : ""}
                >
                  {g}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {parent1Genotype === "AA" ? t.homozygousDominant : 
               parent1Genotype === "Aa" ? t.heterozygous : t.homozygousRecessive}
            </p>
          </div>

          <div className="space-y-3">
            <label className="font-medium">{t.parent2} - {t.genotype}</label>
            <div className="flex gap-2">
              {(["AA", "Aa", "aa"] as const).map((g) => (
                <Button
                  key={g}
                  variant={parent2Genotype === g ? "default" : "outline"}
                  onClick={() => setParent2Genotype(g)}
                  size="sm"
                  className={parent2Genotype === g ? "bg-teal-500 hover:bg-teal-600" : ""}
                >
                  {g}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {parent2Genotype === "AA" ? t.homozygousDominant : 
               parent2Genotype === "Aa" ? t.heterozygous : t.homozygousRecessive}
            </p>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full bg-white"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border rounded"></div>
            <span className="text-sm">AA - {t.homozygousDominant}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-200 border rounded"></div>
            <span className="text-sm">Aa - {t.heterozygous}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border rounded"></div>
            <span className="text-sm">aa - {t.homozygousRecessive}</span>
          </div>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={() => { setParent1Genotype("Aa"); setParent2Genotype("Aa"); }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  );
}
