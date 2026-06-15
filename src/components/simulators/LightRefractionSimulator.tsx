"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Droplets, ArrowDown, AlertCircle } from "lucide-react";

interface LightRefractionSimulatorProps {
  language: "ar" | "en";
}

// Refractive indices for common materials
const materials = {
  air: { n: 1.0, nameAr: "الهواء", nameEn: "Air" },
  water: { n: 1.33, nameAr: "الماء", nameEn: "Water" },
  glass: { n: 1.5, nameAr: "الزجاج", nameEn: "Glass" },
  diamond: { n: 2.42, nameAr: "الماس", nameEn: "Diamond" },
  plastic: { n: 1.46, nameAr: "البلاستيك", nameEn: "Plastic" },
  oil: { n: 1.47, nameAr: "الزيت", nameEn: "Oil" },
};

export function LightRefractionSimulator({ language }: LightRefractionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [incidentAngle, setIncidentAngle] = useState(45);
  const [medium1, setMedium1] = useState<"air" | "water" | "glass" | "diamond" | "plastic" | "oil">("air");
  const [medium2, setMedium2] = useState<"air" | "water" | "glass" | "diamond" | "plastic" | "oil">("glass");
  const [showNormal, setShowNormal] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [animateRay, setAnimateRay] = useState(false);
  const [rayProgress, setRayProgress] = useState(1);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي انكسار الضوء",
      description: "استكشف قانون سنيل للانكسار",
      incidentAngle: "زاوية السقوط",
      refractedAngle: "زاوية الانكسار",
      normal: "الخط العمودي",
      showNormal: "عرض الخط العمودي",
      showAngles: "عرض الزوايا",
      firstMedium: "الوسط الأول",
      secondMedium: "الوسط الثاني",
      refractiveIndex: "معامل الانكسار",
      reset: "إعادة",
      snellLaw: "قانون سنيل",
      snellFormula: "n₁ × sin(θ₁) = n₂ × sin(θ₂)",
      degrees: "°",
      incidentRay: "شعاع ساقط",
      refractedRay: "شعاع منكسر",
      totalReflection: "انعكاس كلي",
      criticalAngle: "الزاوية الحرجة",
      speedRatio: "نسبة السرعة",
      physicsNote: "ينكسر الضوء عند الانتقال بين وسطين مختلفين. إذا كان الضوء ينتقل من وسط أقل كثافة إلى أوسط أعلى كثافة، ينحني نحو الخط العمودي، والعكس صحيح.",
      totalReflectionNote: "عندما تتجاوز زاوية السقوط الزاوية الحرجة، يحدث انعكاس كلي داخلي ولا يمر الضوء للوسط الثاني.",
    },
    en: {
      title: "Light Refraction Simulator",
      description: "Explore Snell's Law of Refraction",
      incidentAngle: "Incident Angle",
      refractedAngle: "Refracted Angle",
      normal: "Normal Line",
      showNormal: "Show Normal Line",
      showAngles: "Show Angles",
      firstMedium: "First Medium",
      secondMedium: "Second Medium",
      refractiveIndex: "Refractive Index",
      reset: "Reset",
      snellLaw: "Snell's Law",
      snellFormula: "n₁ × sin(θ₁) = n₂ × sin(θ₂)",
      degrees: "°",
      incidentRay: "Incident Ray",
      refractedRay: "Refracted Ray",
      totalReflection: "Total Internal Reflection",
      criticalAngle: "Critical Angle",
      speedRatio: "Speed Ratio",
      physicsNote: "Light bends when passing between different media. When light moves from a less dense to a denser medium, it bends toward the normal, and vice versa.",
      totalReflectionNote: "When the incident angle exceeds the critical angle, total internal reflection occurs and no light passes into the second medium.",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Get material properties
  const n1 = materials[medium1].n;
  const n2 = materials[medium2].n;

  // Calculate refracted angle using Snell's law
  const calculateRefractedAngle = useCallback(() => {
    const sinTheta1 = Math.sin((incidentAngle * Math.PI) / 180);
    const sinTheta2 = (n1 * sinTheta1) / n2;

    // Check for total internal reflection
    if (Math.abs(sinTheta2) > 1) {
      return null; // Total internal reflection
    }

    return Math.asin(sinTheta2) * (180 / Math.PI);
  }, [incidentAngle, n1, n2]);

  const refractedAngle = calculateRefractedAngle();

  // Calculate critical angle (only when n1 > n2)
  const criticalAngle = n1 > n2 ? Math.asin(n2 / n1) * (180 / Math.PI) : null;

  // Check for total internal reflection
  const isTotalReflection = refractedAngle === null;

  // Calculate speed ratio
  const speedRatio = n2 / n1;

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw first medium (upper half)
    const medium1Colors: Record<string, string> = {
      air: "#e0f2fe",
      water: "#bfdbfe",
      glass: "#e2e8f0",
      diamond: "#f1f5f9",
      plastic: "#fef3c7",
      oil: "#fef9c3",
    };

    const medium2Colors: Record<string, string> = {
      air: "#e0f2fe",
      water: "#3b82f6",
      glass: "#64748b",
      diamond: "#a855f7",
      plastic: "#fbbf24",
      oil: "#eab308",
    };

    // Upper medium
    ctx.fillStyle = medium1Colors[medium1];
    ctx.fillRect(0, 0, width, centerY);

    // Lower medium
    ctx.fillStyle = medium2Colors[medium2];
    ctx.fillRect(0, centerY, width, centerY);

    // Interface line
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw normal line
    if (showNormal) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 150);
      ctx.lineTo(centerX, centerY + 150);
      ctx.stroke();
      ctx.setLineDash([]);

      // Normal label
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.normal, centerX, centerY - 160);
    }

    const angleRad = (incidentAngle * Math.PI) / 180;
    const rayLength = 120;

    // Incident ray (from upper left to center)
    const incidentStartX = centerX - rayLength * Math.sin(angleRad);
    const incidentStartY = centerY - rayLength * Math.cos(angleRad);

    // Draw incident ray
    const incidentProgress = animateRay ? rayProgress : 1;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(incidentStartX, incidentStartY);
    ctx.lineTo(
      centerX - (centerX - incidentStartX) * (1 - incidentProgress),
      centerY - (centerY - incidentStartY) * (1 - incidentProgress)
    );
    ctx.stroke();

    // Incident ray arrow
    if (incidentProgress > 0.5) {
      const arrowPos = 0.6;
      const arrowX = incidentStartX + (centerX - incidentStartX) * arrowPos;
      const arrowY = incidentStartY + (centerY - incidentStartY) * arrowPos;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(Math.PI / 2 + angleRad);
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -12);
      ctx.lineTo(8, -12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw refracted or reflected ray
    const refractedProgress = animateRay ? Math.max(0, rayProgress - 0.4) : 1;

    if (!isTotalReflection && refractedAngle !== null) {
      // Refracted ray
      const refractedAngleRad = (refractedAngle * Math.PI) / 180;
      const refractedEndX = centerX + rayLength * Math.sin(refractedAngleRad);
      const refractedEndY = centerY + rayLength * Math.cos(refractedAngleRad);

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + (refractedEndX - centerX) * refractedProgress,
        centerY + (refractedEndY - centerY) * refractedProgress
      );
      ctx.stroke();

      // Refracted ray arrow
      if (refractedProgress > 0.5) {
        const arrowPos = 0.6;
        const arrowX = centerX + (refractedEndX - centerX) * arrowPos;
        const arrowY = centerY + (refractedEndY - centerY) * arrowPos;
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(-Math.PI / 2 + refractedAngleRad);
        ctx.moveTo(0, 0);
        ctx.lineTo(-8, -12);
        ctx.lineTo(8, -12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw angle arcs
      if (showAngles && !animateRay) {
        // Incident angle arc
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, -Math.PI / 2, -Math.PI / 2 + angleRad, false);
        ctx.stroke();

        // Refracted angle arc
        ctx.strokeStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, Math.PI / 2, Math.PI / 2 - refractedAngleRad, true);
        ctx.stroke();

        // Angle labels
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 14px system-ui";
        const incLabelX = centerX - 60 * Math.sin(angleRad / 2);
        const incLabelY = centerY - 60 * Math.cos(angleRad / 2);
        ctx.fillText(`${incidentAngle}${t.degrees}`, incLabelX, incLabelY);

        ctx.fillStyle = "#3b82f6";
        const refLabelX = centerX + 60 * Math.sin(refractedAngleRad / 2);
        const refLabelY = centerY + 60 * Math.cos(refractedAngleRad / 2);
        ctx.fillText(`${refractedAngle.toFixed(1)}${t.degrees}`, refLabelX, refLabelY);
      }
    } else {
      // Total internal reflection - draw reflected ray
      const reflectedEndX = centerX + rayLength * Math.sin(angleRad);
      const reflectedEndY = centerY - rayLength * Math.cos(angleRad);

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + (reflectedEndX - centerX) * refractedProgress,
        centerY + (reflectedEndY - centerY) * refractedProgress
      );
      ctx.stroke();

      // Total reflection label
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.totalReflection, centerX, centerY + 50);
    }

    // Point of incidence
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Medium labels
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = isRTL ? "right" : "left";
    const labelX = isRTL ? width - 20 : 20;

    ctx.fillStyle = n1 > 1.1 ? "#ffffff" : "#1e40af";
    ctx.fillText(isRTL ? materials[medium1].nameAr : materials[medium1].nameEn, labelX, 30);
    ctx.font = "12px system-ui";
    ctx.fillText(`n = ${n1.toFixed(2)}`, labelX, 50);

    ctx.fillStyle = n2 > 1.3 ? "#ffffff" : "#1e40af";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(isRTL ? materials[medium2].nameAr : materials[medium2].nameEn, labelX, centerY + 30);
    ctx.font = "12px system-ui";
    ctx.fillText(`n = ${n2.toFixed(2)}`, labelX, centerY + 50);

  }, [incidentAngle, medium1, medium2, showNormal, showAngles, animateRay, rayProgress, refractedAngle, isTotalReflection, t, isRTL, n1, n2]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation effect
  useEffect(() => {
    if (!animateRay) {
      setRayProgress(1);
      return;
    }

    setRayProgress(0);
    const interval = setInterval(() => {
      setRayProgress(prev => {
        if (prev >= 1.4) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.02;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [animateRay]);

  // Reset
  const handleReset = () => {
    setIncidentAngle(45);
    setMedium1("air");
    setMedium2("glass");
    setShowNormal(true);
    setShowAngles(true);
    setAnimateRay(false);
    setRayProgress(1);
  };

  const materialOptions = Object.entries(materials).map(([key, value]) => ({
    value: key,
    label: language === "ar" ? value.nameAr : value.nameEn,
    n: value.n,
  }));

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Medium Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-medium">{t.firstMedium}</label>
            <select
              value={medium1}
              onChange={(e) => setMedium1(e.target.value as typeof medium1)}
              className="w-full p-2 border rounded-lg bg-white"
            >
              {materialOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} (n = {opt.n})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-medium">{t.secondMedium}</label>
            <select
              value={medium2}
              onChange={(e) => setMedium2(e.target.value as typeof medium2)}
              className="w-full p-2 border rounded-lg bg-white"
            >
              {materialOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} (n = {opt.n})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Incident Angle Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-amber-500" />
              {t.incidentAngle}
            </label>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {incidentAngle}{t.degrees}
            </Badge>
          </div>
          <Slider
            value={[incidentAngle]}
            onValueChange={([value]) => setIncidentAngle(value)}
            min={1}
            max={89}
            step={1}
          />
        </div>

        {/* Toggles */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Switch checked={showNormal} onCheckedChange={setShowNormal} />
            <label className="text-sm">{t.showNormal}</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={showAngles} onCheckedChange={setShowAngles} />
            <label className="text-sm">{t.showAngles}</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={animateRay} onCheckedChange={setAnimateRay} />
            <label className="text-sm">{isRTL ? "تحريك الشعاع" : "Animate Ray"}</label>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Formula */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4 rounded-lg">
          <h4 className="font-bold text-blue-700 mb-2">{t.snellLaw}</h4>
          <code className="text-lg font-mono">{t.snellFormula}</code>
        </div>

        {/* Canvas */}
        <div className="border-2 border-blue-200 rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.incidentAngle}</p>
            <p className="text-xl font-bold text-amber-600">{incidentAngle}{t.degrees}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.refractedAngle}</p>
            <p className="text-xl font-bold text-blue-600">
              {isTotalReflection ? (isRTL ? "انعكاس كلي" : "TIR") : `${refractedAngle?.toFixed(1)}${t.degrees}`}
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.refractiveIndex} 1</p>
            <p className="text-xl font-bold text-purple-600">{n1.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.refractiveIndex} 2</p>
            <p className="text-xl font-bold text-cyan-600">{n2.toFixed(2)}</p>
          </div>
        </div>

        {/* Critical Angle Warning */}
        {criticalAngle && incidentAngle > criticalAngle && (
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-bold text-red-700">{t.totalReflection}</p>
              <p className="text-sm text-red-600">
                {t.criticalAngle}: {criticalAngle.toFixed(1)}{t.degrees}
              </p>
            </div>
          </div>
        )}

        {/* Physics Note */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isTotalReflection ? t.totalReflectionNote : t.physicsNote}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
