"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Triangle, Square } from "lucide-react";

interface LawOfCosinesSimulatorProps {
  language: "ar" | "en";
}

type CalculationMode = "side" | "angle";

export function LawOfCosinesSimulator({ language }: LawOfCosinesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [mode, setMode] = useState<CalculationMode>("side");
  
  // For finding side (SSS -> angle)
  const [sideA, setSideA] = useState(8);
  const [sideB, setSideB] = useState(6);
  const [angleC, setAngleC] = useState(60);
  
  // For finding angle (SAS -> side)
  const [sideA_input, setSideA_input] = useState(5);
  const [sideB_input, setSideB_input] = useState(7);
  const [sideC_input, setSideC_input] = useState(9);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي قانون جيب التمام",
      description: "احسب أضلاع وزوايا المثلث باستخدام قانون جيب التمام",
      findSide: "إيجاد الضلع (SAS)",
      findAngle: "إيجاد الزاوية (SSS)",
      sideA: "الضلع a",
      sideB: "الضلع b",
      sideC: "الضلع c",
      angleA: "الزاوية A",
      angleB: "الزاوية B",
      angleC: "الزاوية C",
      law: "قانون جيب التمام",
      formula1: "c² = a² + b² - 2ab·cos(C)",
      formula2: "cos(C) = (a² + b² - c²) / 2ab",
      reset: "إعادة",
      result: "النتيجة",
      explanation: "قانون جيب التمام يعمم نظرية فيثاغورس لأي مثلث",
      units: "وحدات",
      degrees: "درجة",
      sasExplanation: "عند معرفة ضلعين والزاوية المحصورة بينهما",
      sssExplanation: "عند معرفة الأضلاع الثلاثة",
    },
    en: {
      title: "Law of Cosines Simulator",
      description: "Calculate triangle sides and angles using the Law of Cosines",
      findSide: "Find Side (SAS)",
      findAngle: "Find Angle (SSS)",
      sideA: "Side a",
      sideB: "Side b",
      sideC: "Side c",
      angleA: "Angle A",
      angleB: "Angle B",
      angleC: "Angle C",
      law: "Law of Cosines",
      formula1: "c² = a² + b² - 2ab·cos(C)",
      formula2: "cos(C) = (a² + b² - c²) / 2ab",
      reset: "Reset",
      result: "Result",
      explanation: "The Law of Cosines generalizes the Pythagorean theorem for any triangle",
      units: "units",
      degrees: "degrees",
      sasExplanation: "When two sides and the included angle are known",
      sssExplanation: "When all three sides are known",
    },
  };

  const t = texts[language];

  // Calculate for SAS mode (find side c)
  const angleCRad = (angleC * Math.PI) / 180;
  const calculatedSideC = Math.sqrt(
    sideA * sideA + sideB * sideB - 2 * sideA * sideB * Math.cos(angleCRad)
  );
  
  // Calculate other angles for SAS mode
  const calculateAngleA_SAS = () => {
    if (calculatedSideC === 0) return 0;
    const cosA = (sideB * sideB + calculatedSideC * calculatedSideC - sideA * sideA) / 
                 (2 * sideB * calculatedSideC);
    return Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI;
  };
  
  const calculateAngleB_SAS = () => {
    if (calculatedSideC === 0) return 0;
    const cosB = (sideA * sideA + calculatedSideC * calculatedSideC - sideB * sideB) / 
                 (2 * sideA * calculatedSideC);
    return Math.acos(Math.max(-1, Math.min(1, cosB))) * 180 / Math.PI;
  };

  const angleA_SAS = calculateAngleA_SAS();
  const angleB_SAS = calculateAngleB_SAS();

  // Calculate for SSS mode (find angles)
  const calculateAngleA_SSS = () => {
    if (sideB_input === 0 || sideC_input === 0) return 0;
    const cosA = (sideB_input * sideB_input + sideC_input * sideC_input - sideA_input * sideA_input) / 
                 (2 * sideB_input * sideC_input);
    return Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI;
  };
  
  const calculateAngleB_SSS = () => {
    if (sideA_input === 0 || sideC_input === 0) return 0;
    const cosB = (sideA_input * sideA_input + sideC_input * sideC_input - sideB_input * sideB_input) / 
                 (2 * sideA_input * sideC_input);
    return Math.acos(Math.max(-1, Math.min(1, cosB))) * 180 / Math.PI;
  };
  
  const calculateAngleC_SSS = () => {
    if (sideA_input === 0 || sideB_input === 0) return 0;
    const cosC = (sideA_input * sideA_input + sideB_input * sideB_input - sideC_input * sideC_input) / 
                 (2 * sideA_input * sideB_input);
    return Math.acos(Math.max(-1, Math.min(1, cosC))) * 180 / Math.PI;
  };

  const angleA_SSS = calculateAngleA_SSS();
  const angleB_SSS = calculateAngleB_SSS();
  const angleC_SSS = calculateAngleC_SSS();

  // Check if SSS is valid
  const isValidSSS = (sideA_input + sideB_input > sideC_input) && 
                      (sideA_input + sideC_input > sideB_input) && 
                      (sideB_input + sideC_input > sideA_input);

  // Current triangle data based on mode
  const currentData = mode === "side" 
    ? { a: sideA, b: sideB, c: calculatedSideC, A: angleA_SAS, B: angleB_SAS, C: angleC }
    : { a: sideA_input, b: sideB_input, c: sideC_input, A: angleA_SSS, B: angleB_SSS, C: angleC_SSS };

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    if (!isValidSSS && mode === "angle") {
      ctx.fillStyle = "#ef4444";
      ctx.font = "16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(
        language === "ar" ? "أضلاع غير صالحة للمثلث!" : "Invalid sides for a triangle!",
        width / 2,
        height / 2
      );
      return;
    }

    const { a, b, c, A, B, C } = currentData;

    // Calculate triangle vertices
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (Math.max(a, b, c) * 1.5);

    // Place vertex A at origin, B along x-axis
    const Ax = centerX - (c * scale) / 2;
    const Ay = centerY + 50;
    const Bx = Ax + c * scale;
    const By = Ay;
    
    // Calculate C position
    const angleARad = (A * Math.PI) / 180;
    const Cx = Ax + b * scale * Math.cos(angleARad);
    const Cy = Ay - b * scale * Math.sin(angleARad);

    // Draw triangle
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.lineTo(Cx, Cy);
    ctx.closePath();
    ctx.stroke();

    // Fill triangle
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
    ctx.fill();

    // Draw angles arcs
    const arcRadius = 25;

    // Angle A arc
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const aRad = (A * Math.PI) / 180;
    ctx.arc(Ax, Ay, arcRadius, -aRad, 0);
    ctx.stroke();

    // Angle B arc
    ctx.beginPath();
    const bRad = (B * Math.PI) / 180;
    ctx.arc(Bx, By, arcRadius, Math.PI, Math.PI + bRad);
    ctx.stroke();

    // Angle C arc
    ctx.beginPath();
    const cRad = (C * Math.PI) / 180;
    ctx.arc(Cx, Cy, arcRadius, Math.PI - cRad, Math.PI);
    ctx.stroke();

    // Draw vertices
    const drawVertex = (x: number, y: number, label: string, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
    };

    drawVertex(Ax, Ay, "A", "#ef4444");
    drawVertex(Bx, By, "B", "#22c55e");
    drawVertex(Cx, Cy, "C", "#8b5cf6");

    // Draw side labels
    ctx.fillStyle = "#334155";
    ctx.font = "12px system-ui";
    
    // Side a (opposite A = BC)
    const aMidX = (Bx + Cx) / 2;
    const aMidY = (By + Cy) / 2;
    ctx.fillText(`a = ${a.toFixed(1)}`, aMidX + 15, aMidY);

    // Side b (opposite B = AC)
    const bMidX = (Ax + Cx) / 2;
    const bMidY = (Ay + Cy) / 2;
    ctx.fillText(`b = ${b.toFixed(1)}`, bMidX - 30, bMidY);

    // Side c (opposite C = AB)
    const cMidX = (Ax + Bx) / 2;
    ctx.fillText(`c = ${c.toFixed(1)}`, cMidX, Ay + 20);

    // Draw angle labels
    ctx.font = "bold 11px system-ui";
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`${A.toFixed(1)}°`, Ax + 35, Ay - 10);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`${B.toFixed(1)}°`, Bx - 35, By - 10);
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(`${C.toFixed(1)}°`, Cx, Cy + 25);

  }, [mode, currentData, isValidSSS, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    if (mode === "side") {
      setSideA(8);
      setSideB(6);
      setAngleC(60);
    } else {
      setSideA_input(5);
      setSideB_input(7);
      setSideC_input(9);
    }
  };

  // Area calculation
  const area = mode === "side" 
    ? 0.5 * sideA * sideB * Math.sin(angleCRad)
    : 0.5 * sideA_input * sideB_input * Math.sin((angleC_SSS * Math.PI) / 180);

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Square className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-emerald-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Law Formula */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-center">
          <p className="text-sm text-slate-500 mb-1">{t.law}</p>
          <code className="text-lg font-mono font-bold text-emerald-600">{t.formula1}</code>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === "side" ? "default" : "outline"}
            onClick={() => setMode("side")}
            className={mode === "side" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
          >
            {t.findSide}
          </Button>
          <Button
            variant={mode === "angle" ? "default" : "outline"}
            onClick={() => setMode("angle")}
            className={mode === "angle" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
          >
            {t.findAngle}
          </Button>
        </div>

        {/* SAS Mode Controls */}
        {mode === "side" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.sideA}</label>
                <Badge variant="secondary">{sideA} {t.units}</Badge>
              </div>
              <Slider
                value={[sideA]}
                onValueChange={([v]) => setSideA(v)}
                min={1}
                max={15}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.sideB}</label>
                <Badge variant="secondary">{sideB} {t.units}</Badge>
              </div>
              <Slider
                value={[sideB]}
                onValueChange={([v]) => setSideB(v)}
                min={1}
                max={15}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.angleC}</label>
                <Badge variant="secondary">{angleC}°</Badge>
              </div>
              <Slider
                value={[angleC]}
                onValueChange={([v]) => setAngleC(v)}
                min={10}
                max={170}
                step={1}
              />
            </div>
          </div>
        )}

        {/* SSS Mode Controls */}
        {mode === "angle" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.sideA}</label>
                <Badge variant="secondary">{sideA_input} {t.units}</Badge>
              </div>
              <Slider
                value={[sideA_input]}
                onValueChange={([v]) => setSideA_input(v)}
                min={1}
                max={15}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.sideB}</label>
                <Badge variant="secondary">{sideB_input} {t.units}</Badge>
              </div>
              <Slider
                value={[sideB_input]}
                onValueChange={([v]) => setSideB_input(v)}
                min={1}
                max={15}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.sideC}</label>
                <Badge variant="secondary">{sideC_input} {t.units}</Badge>
              </div>
              <Slider
                value={[sideC_input]}
                onValueChange={([v]) => setSideC_input(v)}
                min={1}
                max={15}
                step={0.5}
              />
            </div>
          </div>
        )}

        {/* Warning if invalid SSS */}
        {mode === "angle" && !isValidSSS && (
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-red-600 text-sm">
            {language === "ar"
              ? "الأضلاع لا تشكل مثلثاً صالحاً!"
              : "These sides don't form a valid triangle!"}
          </div>
        )}

        {/* Explanation */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
          {mode === "side" ? t.sasExplanation : t.sssExplanation}
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={350} className="w-full" />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">{t.result}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Angles */}
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{t.angleA}</p>
              <p className="text-xl font-bold text-red-600">
                {mode === "side" ? angleA_SAS.toFixed(1) : angleA_SSS.toFixed(1)}°
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{t.angleB}</p>
              <p className="text-xl font-bold text-green-600">
                {mode === "side" ? angleB_SAS.toFixed(1) : angleB_SSS.toFixed(1)}°
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{t.angleC}</p>
              <p className="text-xl font-bold text-purple-600">
                {mode === "side" ? angleC.toFixed(1) : angleC_SSS.toFixed(1)}°
              </p>
            </div>

            {/* Sides */}
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{t.sideA}</p>
              <p className="text-xl font-bold text-red-600">
                {mode === "side" ? sideA.toFixed(2) : sideA_input.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{t.sideB}</p>
              <p className="text-xl font-bold text-green-600">
                {mode === "side" ? sideB.toFixed(2) : sideB_input.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
              <p className="text-xs text-slate-500">{t.sideC}</p>
              <p className="text-xl font-bold text-purple-600">
                {mode === "side" ? calculatedSideC.toFixed(2) : sideC_input.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Area */}
          {(mode === "side" || isValidSSS) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{language === "ar" ? "المساحة" : "Area"}</p>
                <p className="text-xl font-bold text-blue-600">{area.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{language === "ar" ? "المحيط" : "Perimeter"}</p>
                <p className="text-xl font-bold text-orange-600">
                  {(mode === "side" ? sideA + sideB + calculatedSideC : sideA_input + sideB_input + sideC_input).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Explanation */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm">{t.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
