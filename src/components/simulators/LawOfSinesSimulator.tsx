"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw, Triangle, Calculator } from "lucide-react";

interface LawOfSinesSimulatorProps {
  language: "ar" | "en";
}

export function LawOfSinesSimulator({ language }: LawOfSinesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State - Triangle parameters
  const [angleA, setAngleA] = useState(45);
  const [angleB, setAngleB] = useState(60);
  const [sideA, setSideA] = useState(10);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي قانون الجيب",
      description: "احسب أضلاع وزوايا المثلث باستخدام قانون الجيب",
      angleA: "الزاوية A",
      angleB: "الزاوية B",
      angleC: "الزاوية C",
      sideA: "الضلع a (مقابل A)",
      sideB: "الضلع b (مقابل B)",
      sideC: "الضلع c (مقابل C)",
      law: "قانون الجيب",
      formula: "a/sin(A) = b/sin(B) = c/sin(C)",
      calculate: "احسب",
      reset: "إعادة",
      result: "النتيجة",
      explanation: "قانون الجيب يربط بين أطوال الأضلاع وجيوب الزوايا المقابلة لها",
      angleSum: "مجموع الزوايا = 180°",
      degrees: "درجة",
      units: "وحدات",
    },
    en: {
      title: "Law of Sines Simulator",
      description: "Calculate triangle sides and angles using the Law of Sines",
      angleA: "Angle A",
      angleB: "Angle B",
      angleC: "Angle C",
      sideA: "Side a (opposite to A)",
      sideB: "Side b (opposite to B)",
      sideC: "Side c (opposite to C)",
      law: "Law of Sines",
      formula: "a/sin(A) = b/sin(B) = c/sin(C)",
      calculate: "Calculate",
      reset: "Reset",
      result: "Result",
      explanation: "The Law of Sines relates the lengths of sides to the sines of opposite angles",
      angleSum: "Sum of angles = 180°",
      degrees: "degrees",
      units: "units",
    },
  };

  const t = texts[language];

  // Calculate triangle values
  const angleC = 180 - angleA - angleB;
  const angleARad = (angleA * Math.PI) / 180;
  const angleBRad = (angleB * Math.PI) / 180;
  const angleCRad = (angleC * Math.PI) / 180;

  // Calculate other sides using law of sines
  const sinA = Math.sin(angleARad);
  const sinB = Math.sin(angleBRad);
  const sinC = Math.sin(angleCRad);

  const sideB = sinB > 0 ? (sideA * sinB) / sinA : 0;
  const sideC = sinC > 0 ? (sideA * sinC) / sinA : 0;

  // Calculate area using formula: Area = 0.5 * a * b * sin(C)
  const area = 0.5 * sideA * sideB * sinC;

  // Validity check
  const isValidTriangle = angleA > 0 && angleB > 0 && angleC > 0;

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

    if (!isValidTriangle) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(
        language === "ar" ? "زوايا غير صالحة! يجب أن يكون المجموع 180°" : "Invalid angles! Sum must be 180°",
        width / 2,
        height / 2
      );
      return;
    }

    // Calculate triangle vertices
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (Math.max(sideA, sideB, sideC) * 1.5);

    // Place vertex A at origin, B along x-axis
    const Ax = centerX - (sideC * scale) / 2;
    const Ay = centerY + 50;
    const Bx = Ax + sideC * scale;
    const By = Ay;
    
    // Calculate C position using angle A
    const Cx = Ax + sideB * scale * Math.cos(angleARad);
    const Cy = Ay - sideB * scale * Math.sin(angleARad);

    // Draw triangle
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.lineTo(Cx, Cy);
    ctx.closePath();
    ctx.stroke();

    // Fill triangle
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.fill();

    // Draw angles arcs
    const arcRadius = 25;

    // Angle A arc
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(Ax, Ay, arcRadius, -angleARad, 0);
    ctx.stroke();

    // Angle B arc
    ctx.beginPath();
    const startAngleB = Math.PI;
    const endAngleB = Math.PI + angleBRad;
    ctx.arc(Bx, By, arcRadius, startAngleB, endAngleB);
    ctx.stroke();

    // Angle C arc
    ctx.beginPath();
    ctx.arc(Cx, Cy, arcRadius, Math.PI - angleCRad, Math.PI);
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
    ctx.fillText(`a = ${sideA.toFixed(1)}`, aMidX + 15, aMidY);

    // Side b (opposite B = AC)
    const bMidX = (Ax + Cx) / 2;
    const bMidY = (Ay + Cy) / 2;
    ctx.fillText(`b = ${sideB.toFixed(1)}`, bMidX - 30, bMidY);

    // Side c (opposite C = AB)
    const cMidX = (Ax + Bx) / 2;
    ctx.fillText(`c = ${sideC.toFixed(1)}`, cMidX, Ay + 20);

    // Draw angle labels
    ctx.font = "bold 11px system-ui";
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`${angleA}°`, Ax + 35, Ay - 10);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`${angleB}°`, Bx - 35, By - 10);
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(`${angleC.toFixed(1)}°`, Cx, Cy + 25);

  }, [angleA, angleB, angleC, angleARad, angleBRad, sideA, sideB, sideC, isValidTriangle, language]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setAngleA(45);
    setAngleB(60);
    setSideA(10);
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Triangle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Law Formula */}
        <div className="p-4 bg-rose-50 dark:bg-rose-950 rounded-lg text-center">
          <p className="text-sm text-slate-500 mb-1">{t.law}</p>
          <code className="text-lg font-mono font-bold text-rose-600">{t.formula}</code>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.angleA}</label>
              <Badge variant="secondary">{angleA}°</Badge>
            </div>
            <Slider
              value={[angleA]}
              onValueChange={([v]) => setAngleA(v)}
              min={10}
              max={150}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.angleB}</label>
              <Badge variant="secondary">{angleB}°</Badge>
            </div>
            <Slider
              value={[angleB]}
              onValueChange={([v]) => setAngleB(v)}
              min={10}
              max={150}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.sideA}</label>
              <Badge variant="secondary">{sideA} {t.units}</Badge>
            </div>
            <Slider
              value={[sideA]}
              onValueChange={([v]) => setSideA(v)}
              min={1}
              max={20}
              step={0.5}
            />
          </div>
        </div>

        {/* Warning if invalid */}
        {!isValidTriangle && (
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-red-600 text-sm">
            {language === "ar"
              ? "مجموع الزوايا يجب أن يكون 180°. حالياً: " + (angleA + angleB).toFixed(0) + "°"
              : "Angles sum must be 180°. Current: " + (angleA + angleB).toFixed(0) + "°"}
          </div>
        )}

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
        {isValidTriangle && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{t.result}</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Angles */}
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.angleA}</p>
                <p className="text-xl font-bold text-red-600">{angleA}°</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.angleB}</p>
                <p className="text-xl font-bold text-green-600">{angleB}°</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.angleC}</p>
                <p className="text-xl font-bold text-purple-600">{angleC.toFixed(1)}°</p>
              </div>

              {/* Sides */}
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.sideA}</p>
                <p className="text-xl font-bold text-red-600">{sideA.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.sideB}</p>
                <p className="text-xl font-bold text-green-600">{sideB.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{t.sideC}</p>
                <p className="text-xl font-bold text-purple-600">{sideC.toFixed(2)}</p>
              </div>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{language === "ar" ? "المساحة" : "Area"}</p>
                <p className="text-xl font-bold text-blue-600">{area.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
                <p className="text-xs text-slate-500">{language === "ar" ? "المحيط" : "Perimeter"}</p>
                <p className="text-xl font-bold text-orange-600">{(sideA + sideB + sideC).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm">{t.explanation}</p>
          <p className="text-xs text-slate-500 mt-2">{t.angleSum}</p>
        </div>
      </CardContent>
    </Card>
  );
}
