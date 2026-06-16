"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, RotateCcw, Info, Dna } from "lucide-react";

interface Trait {
  id: string;
  nameAr: string;
  nameEn: string;
  dominantAr: string;
  dominantEn: string;
  recessiveAr: string;
  recessiveEn: string;
  dominantSymbol: string;
  recessiveSymbol: string;
}

interface PunnettSquareSimulatorProps {
  language: "ar" | "en";
}

const traits: Trait[] = [
  {
    id: "eye_color",
    nameAr: "لون العيون",
    nameEn: "Eye Color",
    dominantAr: "عيون بنية",
    dominantEn: "Brown eyes (B)",
    recessiveAr: "عيون زرقاء",
    recessiveEn: "Blue eyes (b)",
    dominantSymbol: "B",
    recessiveSymbol: "b"
  },
  {
    id: "hair_texture",
    nameAr: "ملمس الشعر",
    nameEn: "Hair Texture",
    dominantAr: "شعر مجعد",
    dominantEn: "Curly hair (C)",
    recessiveAr: "شعر ناعم",
    recessiveEn: "Straight hair (c)",
    dominantSymbol: "C",
    recessiveSymbol: "c"
  },
  {
    id: "earlobe",
    nameAr: "شحمة الأذن",
    nameEn: "Earlobe Attachment",
    dominantAr: "شحمة مفككة",
    dominantEn: "Free earlobe (E)",
    recessiveAr: "شحمة ملتصقة",
    recessiveEn: "Attached earlobe (e)",
    dominantSymbol: "E",
    recessiveSymbol: "e"
  },
  {
    id: "dimples",
    nameAr: "الغمازات",
    nameEn: "Dimples",
    dominantAr: "وجود غمازات",
    dominantEn: "Dimples present (D)",
    recessiveAr: "بدون غمازات",
    recessiveEn: "No dimples (d)",
    dominantSymbol: "D",
    recessiveSymbol: "d"
  },
  {
    id: "tongue_roll",
    nameAr: "لف اللسان",
    nameEn: "Tongue Rolling",
    dominantAr: "يستطيع لف اللسان",
    dominantEn: "Can roll tongue (R)",
    recessiveAr: "لا يستطيع لف اللسان",
    recessiveEn: "Cannot roll tongue (r)",
    dominantSymbol: "R",
    recessiveSymbol: "r"
  },
  {
    id: "freckles",
    nameAr: "النمش",
    nameEn: "Freckles",
    dominantAr: "وجود نمش",
    dominantEn: "Freckles present (F)",
    recessiveAr: "بدون نمش",
    recessiveEn: "No freckles (f)",
    dominantSymbol: "F",
    recessiveSymbol: "f"
  }
];

const genotypes = ["AA", "Aa", "aa"];

export function PunnettSquareSimulator({ language }: PunnettSquareSimulatorProps) {
  const [selectedTrait, setSelectedTrait] = useState<Trait>(traits[0]);
  const [parent1Genotype, setParent1Genotype] = useState<string>("Aa");
  const [parent2Genotype, setParent2Genotype] = useState<string>("Aa");
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكاة مربع بنيت" : "Punnett Square Simulator",
    selectTrait: isRTL ? "اختر الصفة" : "Select Trait",
    parent1: isRTL ? "الوالد الأول" : "Parent 1",
    parent2: isRTL ? "الوالد الثاني" : "Parent 2",
    genotype: isRTL ? "التركيب الجيني" : "Genotype",
    offspring: isRTL ? "النسل المتوقع" : "Expected Offspring",
    genotypes: isRTL ? "التراكيب الجينية" : "Genotypes",
    phenotypes: isRTL ? "التراكيب الظاهرية" : "Phenotypes",
    dominant: isRTL ? "سائد" : "Dominant",
    recessive: isRTL ? "تنحي" : "Recessive",
    probability: isRTL ? "الاحتمالية" : "Probability",
    reset: isRTL ? "إعادة" : "Reset",
    homozygousDominant: isRTL ? "متماثل سائد" : "Homozygous Dominant",
    heterozygous: isRTL ? "مختلف" : "Heterozygous",
    homozygousRecessive: isRTL ? "متماثل تنحي" : "Homozygous Recessive"
  };

  // Convert genotype notation
  const convertGenotype = (genotype: string, trait: Trait) => {
    return genotype.replace(/A/g, trait.dominantSymbol).replace(/a/g, trait.recessiveSymbol);
  };

  // Calculate Punnett square results
  const punnettResults = useMemo(() => {
    const getAlleles = (genotype: string) => {
      return [genotype[0], genotype[1]];
    };
    
    const parent1Alleles = getAlleles(parent1Genotype);
    const parent2Alleles = getAlleles(parent2Genotype);
    
    const offspring: string[][] = [];
    const genotypeCounts: Record<string, number> = {};
    
    for (let i = 0; i < 2; i++) {
      offspring[i] = [];
      for (let j = 0; j < 2; j++) {
        const allele1 = parent1Alleles[i];
        const allele2 = parent2Alleles[j];
        // Sort to put dominant first
        const offspringGenotype = allele1 === allele2 ? allele1 + allele2 : 
          (allele1 === 'A' ? allele1 + allele2 : allele2 + allele1);
        offspring[i][j] = offspringGenotype;
        genotypeCounts[offspringGenotype] = (genotypeCounts[offspringGenotype] || 0) + 1;
      }
    }
    
    // Calculate phenotype counts
    const dominantCount = (genotypeCounts['AA'] || 0) + (genotypeCounts['Aa'] || 0);
    const recessiveCount = genotypeCounts['aa'] || 0;
    
    return {
      offspring,
      genotypeCounts,
      phenotypeCounts: {
        dominant: dominantCount,
        recessive: recessiveCount
      }
    };
  }, [parent1Genotype, parent2Genotype]);

  const handleReset = () => {
    setSelectedTrait(traits[0]);
    setParent1Genotype("Aa");
    setParent2Genotype("Aa");
  };

  const getGenotypeLabel = (genotype: string) => {
    if (genotype === "AA") return labels.homozygousDominant;
    if (genotype === "Aa") return labels.heterozygous;
    return labels.homozygousRecessive;
  };

  const getPhenotypeColor = (genotype: string) => {
    if (genotype.includes('A')) return "bg-green-100 border-green-500 text-green-700";
    return "bg-orange-100 border-orange-500 text-orange-700";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-emerald-500" />
            {labels.title}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trait Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">{labels.selectTrait}</label>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait) => (
              <button
                key={trait.id}
                onClick={() => setSelectedTrait(trait)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTrait.id === trait.id
                    ? "bg-emerald-500 text-white scale-105"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {isRTL ? trait.nameAr : trait.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Trait Info */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Badge className="bg-white/30 mb-2">{labels.dominant}</Badge>
              <p className="text-sm">{isRTL ? selectedTrait.dominantAr : selectedTrait.dominantEn}</p>
            </div>
            <div>
              <Badge className="bg-white/30 mb-2">{labels.recessive}</Badge>
              <p className="text-sm">{isRTL ? selectedTrait.recessiveAr : selectedTrait.recessiveEn}</p>
            </div>
          </div>
        </div>

        {/* Parent Genotype Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parent 1 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Dna className="w-4 h-4 text-blue-500" />
              {labels.parent1}
            </h4>
            <div className="flex gap-2 flex-wrap">
              {genotypes.map((genotype) => (
                <button
                  key={genotype}
                  onClick={() => setParent1Genotype(genotype)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono font-bold transition-all ${
                    parent1Genotype === genotype
                      ? "bg-blue-500 text-white scale-105"
                      : "bg-white dark:bg-slate-800 border border-blue-200 hover:border-blue-400"
                  }`}
                >
                  {convertGenotype(genotype, selectedTrait)}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {getGenotypeLabel(parent1Genotype)}
            </p>
          </div>

          {/* Parent 2 */}
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Dna className="w-4 h-4 text-pink-500" />
              {labels.parent2}
            </h4>
            <div className="flex gap-2 flex-wrap">
              {genotypes.map((genotype) => (
                <button
                  key={genotype}
                  onClick={() => setParent2Genotype(genotype)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono font-bold transition-all ${
                    parent2Genotype === genotype
                      ? "bg-pink-500 text-white scale-105"
                      : "bg-white dark:bg-slate-800 border border-pink-200 hover:border-pink-400"
                  }`}
                >
                  {convertGenotype(genotype, selectedTrait)}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {getGenotypeLabel(parent2Genotype)}
            </p>
          </div>
        </div>

        {/* Punnett Square */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
          <h4 className="font-semibold mb-4 text-center">{labels.offspring}</h4>
          
          {/* Square Grid */}
          <div className="max-w-[280px] mx-auto">
            {/* Header row */}
            <div className="grid grid-cols-3 gap-1 mb-1">
              <div className="aspect-square" />
              {parent2Genotype.split('').map((allele, i) => (
                <div key={i} className="aspect-square flex items-center justify-center font-bold text-pink-600 text-lg">
                  {allele === 'A' ? selectedTrait.dominantSymbol : selectedTrait.recessiveSymbol}
                </div>
              ))}
            </div>
            
            {/* Body rows */}
            {parent1Genotype.split('').map((parent1Allele, row) => (
              <div key={row} className="grid grid-cols-3 gap-1 mb-1">
                {/* Row header */}
                <div className="aspect-square flex items-center justify-center font-bold text-blue-600 text-lg">
                  {parent1Allele === 'A' ? selectedTrait.dominantSymbol : selectedTrait.recessiveSymbol}
                </div>
                {/* Offspring cells */}
                {punnettResults.offspring[row]?.map((offspring, col) => (
                  <div
                    key={col}
                    className={`aspect-square rounded-lg flex items-center justify-center font-mono font-bold text-sm border-2 transition-all ${getPhenotypeColor(offspring)}`}
                  >
                    {convertGenotype(offspring, selectedTrait)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Genotype Ratios */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-500" />
              {labels.genotypes}
            </h4>
            <div className="space-y-2">
              {Object.entries(punnettResults.genotypeCounts).map(([genotype, count]) => (
                <div key={genotype} className="flex items-center justify-between">
                  <span className="font-mono font-bold">
                    {convertGenotype(genotype, selectedTrait)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(count / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-500 w-12 text-right">
                      {(count / 4) * 100}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phenotype Ratios */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-500" />
              {labels.phenotypes}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  {isRTL ? selectedTrait.dominantAr.split(' ')[0] : selectedTrait.dominantEn.split(' ')[0]}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(punnettResults.phenotypeCounts.dominant / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-12 text-right">
                    {(punnettResults.phenotypeCounts.dominant / 4) * 100}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  {isRTL ? selectedTrait.recessiveAr.split(' ')[0] : selectedTrait.recessiveEn.split(' ')[0]}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(punnettResults.phenotypeCounts.recessive / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-12 text-right">
                    {(punnettResults.phenotypeCounts.recessive / 4) * 100}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Info className="w-4 h-4" />
            {isRTL ? "معلومة" : "Did you know?"}
          </h4>
          <p className="text-sm text-amber-600 dark:text-amber-300">
            {isRTL 
              ? `التركيب الجيني ${convertGenotype('Aa', selectedTrait)} يظهر الصفة السائدة (${isRTL ? selectedTrait.dominantAr.split(' ')[0] : selectedTrait.dominantEn.split(' ')[0]}) لأن الأليل السائد يخفي تأثير الأليل التنحي. فقط التركيب ${convertGenotype('aa', selectedTrait)} يظهر الصفة التنحية.`
              : `The genotype ${convertGenotype('Aa', selectedTrait)} shows the dominant trait (${selectedTrait.dominantEn.split(' ')[0]}) because the dominant allele masks the recessive one. Only the ${convertGenotype('aa', selectedTrait)} genotype shows the recessive trait.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
