"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Calculator, Check, X, Equal } from "lucide-react";

interface TrigIdentitiesSimulatorProps {
  language: "ar" | "en";
}

type IdentityType = "pythagorean" | "double" | "sum" | "product";

export function TrigIdentitiesSimulator({ language }: TrigIdentitiesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [angle, setAngle] = useState(30);
  const [angle2, setAngle2] = useState(45);
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityType>("pythagorean");

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المتطابقات المثلثية",
      description: "استكشف وأثبت المتطابقات المثلثية الأساسية",
      pythagorean: "متطابقات فيثاغورس",
      double: "متطابقات الزاوية المضاعفة",
      sum: "متطابقات جمع الزوايا",
      product: "متطابقات تحويل الضرب لمجموع",
      angle: "الزاوية α (درجة)",
      angle2: "الزاوية β (درجة)",
      leftSide: "الطرف الأيسر",
      rightSide: "الطرف الأيمن",
      difference: "الفرق",
      verified: "المتطابقة متحققة! ✓",
      notVerified: "الفرق طفيف بسبب التقريب",
      identity: "المتطابقة",
      reset: "إعادة",
      identities: {
        pythagorean1: "sin²α + cos²α = 1",
        pythagorean2: "tan²α + 1 = sec²α",
        pythagorean3: "1 + cot²α = csc²α",
        double1: "sin(2α) = 2sin(α)cos(α)",
        double2: "cos(2α) = cos²(α) - sin²(α)",
        double3: "cos(2α) = 2cos²(α) - 1",
        sum1: "sin(α+β) = sin(α)cos(β) + cos(α)sin(β)",
        sum2: "cos(α+β) = cos(α)cos(β) - sin(α)sin(β)",
        product1: "sin(α)cos(β) = ½[sin(α+β) + sin(α-β)]",
        product2: "cos(α)cos(β) = ½[cos(α+β) + cos(α-β)]",
      },
    },
    en: {
      title: "Trigonometric Identities Simulator",
      description: "Explore and prove fundamental trig identities",
      pythagorean: "Pythagorean Identities",
      double: "Double Angle Identities",
      sum: "Sum & Difference Identities",
      product: "Product-to-Sum Identities",
      angle: "Angle α (degrees)",
      angle2: "Angle β (degrees)",
      leftSide: "Left Side",
      rightSide: "Right Side",
      difference: "Difference",
      verified: "Identity Verified! ✓",
      notVerified: "Minor difference due to rounding",
      identity: "Identity",
      reset: "Reset",
      identities: {
        pythagorean1: "sin²α + cos²α = 1",
        pythagorean2: "tan²α + 1 = sec²α",
        pythagorean3: "1 + cot²α = csc²α",
        double1: "sin(2α) = 2sin(α)cos(α)",
        double2: "cos(2α) = cos²(α) - sin²(α)",
        double3: "cos(2α) = 2cos²(α) - 1",
        sum1: "sin(α+β) = sin(α)cos(β) + cos(α)sin(β)",
        sum2: "cos(α+β) = cos(α)cos(β) - sin(α)sin(β)",
        product1: "sin(α)cos(β) = ½[sin(α+β) + sin(α-β)]",
        product2: "cos(α)cos(β) = ½[cos(α+β) + cos(α-β)]",
      },
    },
  };

  const t = texts[language];

  // Convert angles to radians
  const angleRad = (angle * Math.PI) / 180;
  const angle2Rad = (angle2 * Math.PI) / 180;

  // Calculate trig values
  const sinA = Math.sin(angleRad);
  const cosA = Math.cos(angleRad);
  const tanA = Math.tan(angleRad);
  const sinB = Math.sin(angle2Rad);
  const cosB = Math.cos(angle2Rad);

  // Get identities for current selection
  const getIdentities = () => {
    switch (selectedIdentity) {
      case "pythagorean":
        return [
          {
            name: t.identities.pythagorean1,
            left: sinA * sinA + cosA * cosA,
            right: 1,
          },
          {
            name: t.identities.pythagorean2,
            left: tanA * tanA + 1,
            right: 1 / (cosA * cosA),
          },
          {
            name: t.identities.pythagorean3,
            left: 1 + (1 / tanA) * (1 / tanA),
            right: 1 / (sinA * sinA),
          },
        ];
      case "double":
        return [
          {
            name: t.identities.double1,
            left: Math.sin(2 * angleRad),
            right: 2 * sinA * cosA,
          },
          {
            name: t.identities.double2,
            left: Math.cos(2 * angleRad),
            right: cosA * cosA - sinA * sinA,
          },
          {
            name: t.identities.double3,
            left: Math.cos(2 * angleRad),
            right: 2 * cosA * cosA - 1,
          },
        ];
      case "sum":
        return [
          {
            name: t.identities.sum1,
            left: Math.sin(angleRad + angle2Rad),
            right: sinA * cosB + cosA * sinB,
          },
          {
            name: t.identities.sum2,
            left: Math.cos(angleRad + angle2Rad),
            right: cosA * cosB - sinA * sinB,
          },
        ];
      case "product":
        return [
          {
            name: t.identities.product1,
            left: sinA * cosB,
            right: 0.5 * (Math.sin(angleRad + angle2Rad) + Math.sin(angleRad - angle2Rad)),
          },
          {
            name: t.identities.product2,
            left: cosA * cosB,
            right: 0.5 * (Math.cos(angleRad + angle2Rad) + Math.cos(angleRad - angle2Rad)),
          },
        ];
    }
  };

  const identities = getIdentities();

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

    // Draw visual representation
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    // Draw unit circle
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Axes
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Point for angle α
    const x1 = centerX + cosA * radius;
    const y1 = centerY - sinA * radius;

    // Point for angle β (if needed)
    const x2 = centerX + cosB * radius;
    const y2 = centerY - sinB * radius;

    // Draw angle arc for α
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, -angleRad, true);
    ctx.stroke();

    // Draw radius to point α
    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Point α
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(x1, y1, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw sin projection
    ctx.strokeStyle = "#22c55e";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(centerX, y1);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw cos projection
    ctx.strokeStyle = "#f59e0b";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = "#334155";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    
    // Angle label
    ctx.fillText(`α = ${angle}°`, centerX + 50, centerY - 20);
    
    // Sin and cos labels
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`sin = ${sinA.toFixed(3)}`, centerX - 60, y1 + 4);
    
    ctx.fillStyle = "#f59e0b";
    ctx.fillText(`cos = ${cosA.toFixed(3)}`, x1, centerY + 20);

    // If sum/product identity, draw second angle
    if ((selectedIdentity === "sum" || selectedIdentity === "product") && angle2 !== angle) {
      // Draw angle arc for β
      ctx.strokeStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, 0, -angle2Rad, true);
      ctx.stroke();

      // Draw radius to point β
      ctx.strokeStyle = "#a855f7";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Point β
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(x2, y2, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillText(`β = ${angle2}°`, centerX + 80, centerY - 35);
    }

    // Origin
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [angle, angle2, angleRad, angle2Rad, sinA, cosA, sinB, cosB, selectedIdentity]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setAngle(30);
    setAngle2(45);
  };

  return (
    <Card className="border-0 shadow-lg" dir={language === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Identity Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(["pythagorean", "double", "sum", "product"] as IdentityType[]).map((type) => (
            <Button
              key={type}
              variant={selectedIdentity === type ? "default" : "outline"}
              onClick={() => setSelectedIdentity(type)}
              className={`text-xs md:text-sm ${selectedIdentity === type ? "bg-purple-500 hover:bg-purple-600" : ""}`}
            >
              {t[type]}
            </Button>
          ))}
        </div>

        {/* Angle Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.angle}</label>
              <Badge variant="secondary">{angle}°</Badge>
            </div>
            <Slider
              value={[angle]}
              onValueChange={([v]) => setAngle(v)}
              min={0}
              max={360}
              step={1}
            />
          </div>

          {(selectedIdentity === "sum" || selectedIdentity === "product") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.angle2}</label>
                <Badge variant="secondary">{angle2}°</Badge>
              </div>
              <Slider
                value={[angle2]}
                onValueChange={([v]) => setAngle2(v)}
                min={0}
                max={360}
                step={1}
              />
            </div>
          )}
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={300} className="w-full" />
        </div>

        {/* Identities Verification */}
        <div className="space-y-4">
          {identities.map((identity, index) => {
            const diff = Math.abs(identity.left - identity.right);
            const isVerified = diff < 0.0001;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${isVerified ? "border-green-200 bg-green-50 dark:bg-green-950" : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isVerified ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-yellow-500" />
                  )}
                  <code className="font-mono text-sm font-bold">{identity.name}</code>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-500">{t.leftSide}</p>
                    <p className="font-mono font-bold">{identity.left.toFixed(6)}</p>
                  </div>
                  <div>
                    <Equal className="w-6 h-6 mx-auto text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t.rightSide}</p>
                    <p className="font-mono font-bold">{identity.right.toFixed(6)}</p>
                  </div>
                </div>
                <p className={`text-sm mt-2 ${isVerified ? "text-green-600" : "text-yellow-600"}`}>
                  {t.difference}: {diff.toFixed(10)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {identities.every((id) => Math.abs(id.left - id.right) < 0.0001)
              ? t.verified
              : t.notVerified}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
