"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Sun, Circle, Ruler } from "lucide-react";

interface LightReflectionSimulatorProps {
  language: "ar" | "en";
}

export function LightReflectionSimulator({ language }: LightReflectionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [incidentAngle, setIncidentAngle] = useState(45);
  const [showNormal, setShowNormal] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [mirrorType, setMirrorType] = useState<"flat" | "concave" | "convex">("flat");
  const [animateRay, setAnimateRay] = useState(false);
  const [rayProgress, setRayProgress] = useState(1);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي انعكاس الضوء",
      description: "استكشف قانون الانعكاس وزوايا السقوط والانعكاس",
      incidentAngle: "زاوية السقوط",
      reflectedAngle: "زاوية الانعكاس",
      normal: "الخط العمودي",
      showNormal: "عرض الخط العمودي",
      showAngles: "عرض الزوايا",
      flatMirror: "مرآة مستوية",
      concaveMirror: "مرآة مقعرة",
      convexMirror: "مرآة محدبة",
      reset: "إعادة",
      lawTitle: "قانون الانعكاس",
      lawFormula: "زاوية السقوط = زاوية الانعكاس",
      degrees: "درجة",
      incidentRay: "شعاع ساقط",
      reflectedRay: "شعاع منعكس",
      mirror: "المرآة",
      physicsNote: "عندما يسقط الضوء على سطح عاكس، ينعكس بحيث تكون زاوية السقوط مساوية لزاوية الانعكاس، ويكون الشعاعان في مستوى واحد مع الخط العمودي.",
    },
    en: {
      title: "Light Reflection Simulator",
      description: "Explore the law of reflection and incident/reflected angles",
      incidentAngle: "Incident Angle",
      reflectedAngle: "Reflected Angle",
      normal: "Normal Line",
      showNormal: "Show Normal Line",
      showAngles: "Show Angles",
      flatMirror: "Flat Mirror",
      concaveMirror: "Concave Mirror",
      convexMirror: "Convex Mirror",
      reset: "Reset",
      lawTitle: "Law of Reflection",
      lawFormula: "Angle of Incidence = Angle of Reflection",
      degrees: "°",
      incidentRay: "Incident Ray",
      reflectedRay: "Reflected Ray",
      mirror: "Mirror",
      physicsNote: "When light hits a reflective surface, it reflects such that the angle of incidence equals the angle of reflection, and both rays lie in the same plane with the normal.",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Calculate reflected angle (always equals incident angle for flat mirror)
  const reflectedAngle = incidentAngle;

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

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#f0f9ff");
    gradient.addColorStop(1, "#e0f2fe");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const mirrorLength = 150;
    const rayLength = 120;

    // Draw mirror based on type
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    if (mirrorType === "flat") {
      // Flat mirror (vertical line)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - mirrorLength);
      ctx.lineTo(centerX, centerY + mirrorLength);
      ctx.stroke();

      // Mirror backing (hatching)
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      for (let y = centerY - mirrorLength; y < centerY + mirrorLength; y += 10) {
        ctx.beginPath();
        ctx.moveTo(centerX + 8, y);
        ctx.lineTo(centerX + 18, y + 10);
        ctx.stroke();
      }
    } else if (mirrorType === "concave") {
      // Concave mirror (curves inward)
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(centerX + 80, centerY, 100, Math.PI * 0.6, Math.PI * 1.4);
      ctx.stroke();

      // Reflective surface indicator
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px system-ui";
      ctx.fillText(isRTL ? "سطح عاكس" : "Reflective", centerX - 60, centerY + mirrorLength + 20);
    } else if (mirrorType === "convex") {
      // Convex mirror (curves outward)
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(centerX - 80, centerY, 100, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

      // Reflective surface indicator
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px system-ui";
      ctx.fillText(isRTL ? "سطح عاكس" : "Reflective", centerX + 40, centerY + mirrorLength + 20);
    }

    // Draw normal line (dashed vertical line)
    if (showNormal) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 130);
      ctx.lineTo(centerX, centerY + 130);
      ctx.stroke();
      ctx.setLineDash([]);

      // Normal label
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.normal, centerX, centerY - 140);
    }

    // Calculate ray positions
    const angleRad = (incidentAngle * Math.PI) / 180;

    // Incident ray (from upper left to center)
    const incidentStartX = centerX - rayLength * Math.sin(angleRad);
    const incidentStartY = centerY - rayLength * Math.cos(angleRad);

    // Reflected ray (from center to upper right)
    const reflectedEndX = centerX + rayLength * Math.sin(angleRad);
    const reflectedEndY = centerY - rayLength * Math.cos(angleRad);

    // Draw incident ray with animation
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
      const arrowPos = 0.7;
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

    // Draw reflected ray with animation
    const reflectedProgress = animateRay ? Math.max(0, rayProgress - 0.3) : 1;
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + (reflectedEndX - centerX) * reflectedProgress,
      centerY + (reflectedEndY - centerY) * reflectedProgress
    );
    ctx.stroke();

    // Reflected ray arrow
    if (reflectedProgress > 0.5) {
      const arrowPos = 0.7;
      const arrowX = centerX + (reflectedEndX - centerX) * arrowPos;
      const arrowY = centerY + (reflectedEndY - centerY) * arrowPos;
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(-Math.PI / 2 + angleRad);
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -12);
      ctx.lineTo(8, -12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw point of incidence
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw angle arcs
    if (showAngles && !animateRay) {
      // Incident angle arc
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, -Math.PI / 2, -Math.PI / 2 + angleRad, false);
      ctx.stroke();

      // Reflected angle arc
      ctx.strokeStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, -Math.PI / 2 - angleRad, -Math.PI / 2, false);
      ctx.stroke();

      // Angle labels
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 14px system-ui";
      const incidentLabelX = centerX - 60 * Math.sin(angleRad / 2);
      const incidentLabelY = centerY - 60 * Math.cos(angleRad / 2);
      ctx.fillText(`${incidentAngle}${t.degrees}`, incidentLabelX, incidentLabelY);

      ctx.fillStyle = "#3b82f6";
      const reflectedLabelX = centerX + 60 * Math.sin(angleRad / 2);
      const reflectedLabelY = centerY - 60 * Math.cos(angleRad / 2);
      ctx.fillText(`${reflectedAngle}${t.degrees}`, reflectedLabelX, reflectedLabelY);
    }

    // Ray labels
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";

    ctx.fillStyle = "#f59e0b";
    ctx.fillText(t.incidentRay, 20, 30);

    ctx.fillStyle = "#3b82f6";
    ctx.fillText(t.reflectedRay, 20, 50);

    // Legend
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(100, 40, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "left";
    ctx.fillText(isRTL ? "نقطة السقوط" : "Point of incidence", 110, 44);

  }, [incidentAngle, showNormal, showAngles, mirrorType, animateRay, rayProgress, t, isRTL]);

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
        if (prev >= 1.3) {
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
    setMirrorType("flat");
    setShowNormal(true);
    setShowAngles(true);
    setAnimateRay(false);
    setRayProgress(1);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Circle className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Mirror Type Selection */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant={mirrorType === "flat" ? "default" : "outline"}
            onClick={() => setMirrorType("flat")}
            className={mirrorType === "flat" ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {t.flatMirror}
          </Button>
          <Button
            variant={mirrorType === "concave" ? "default" : "outline"}
            onClick={() => setMirrorType("concave")}
            className={mirrorType === "concave" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {t.concaveMirror}
          </Button>
          <Button
            variant={mirrorType === "convex" ? "default" : "outline"}
            onClick={() => setMirrorType("convex")}
            className={mirrorType === "convex" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            {t.convexMirror}
          </Button>
        </div>

        {/* Incident Angle Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              {t.incidentAngle}
            </label>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {incidentAngle}{t.degrees}
            </Badge>
          </div>
          <Slider
            value={[incidentAngle]}
            onValueChange={([value]) => setIncidentAngle(value)}
            min={5}
            max={85}
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
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 p-4 rounded-lg">
          <h4 className="font-bold text-amber-700 mb-2">{t.lawTitle}</h4>
          <code className="text-lg font-mono">{t.lawFormula}</code>
        </div>

        {/* Canvas */}
        <div className="border-2 border-amber-200 rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.incidentAngle}</p>
            <p className="text-2xl font-bold text-amber-600">{incidentAngle}{t.degrees}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.reflectedAngle}</p>
            <p className="text-2xl font-bold text-blue-600">{reflectedAngle}{t.degrees}</p>
          </div>
        </div>

        {/* Physics Note */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">{t.physicsNote}</p>
        </div>
      </CardContent>
    </Card>
  );
}
