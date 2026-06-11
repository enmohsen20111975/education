"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Scale, ArrowRight, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

interface ForcesSimulatorProps {
  language: "ar" | "en";
}

interface Force {
  id: string;
  magnitude: number;
  direction: "left" | "right";
  color: string;
}

export function ForcesSimulator({ language }: ForcesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [forces, setForces] = useState<Force[]>([
    { id: "1", magnitude: 10, direction: "right", color: "#22c55e" },
    { id: "2", magnitude: 10, direction: "left", color: "#ef4444" },
  ]);
  const [objectMass, setObjectMass] = useState(5); // kg
  const [showResult, setShowResult] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي توازن القوى",
      description: "استكشف توازن القوى وحركة الأجسام",
      force: "القوة",
      toRight: "إلى اليمين",
      toLeft: "إلى اليسار",
      magnitude: "المقدار",
      direction: "الاتجاه",
      addForce: "إضافة قوة",
      removeForce: "حذف",
      reset: "إعادة",
      check: "تحقق من التوازن",
      mass: "كتلة الجسم",
      kg: "كجم",
      newton: "نيوتن",
      netForce: "محصلة القوى",
      acceleration: "التسارع",
      balanced: "متوازن! ∑F = 0",
      notBalanced: "غير متوازن!",
      movesRight: "يتحرك يميناً",
      movesLeft: "يتحرك يساراً",
      newtonPerKg: "م/ث²",
      formula: "∑F = ma",
    },
    en: {
      title: "Forces Balance Simulator",
      description: "Explore force equilibrium and object motion",
      force: "Force",
      toRight: "To Right",
      toLeft: "To Left",
      magnitude: "Magnitude",
      direction: "Direction",
      addForce: "Add Force",
      removeForce: "Remove",
      reset: "Reset",
      check: "Check Balance",
      mass: "Object Mass",
      kg: "kg",
      newton: "N",
      netForce: "Net Force",
      acceleration: "Acceleration",
      balanced: "Balanced! ∑F = 0",
      notBalanced: "Not Balanced!",
      movesRight: "Moves Right",
      movesLeft: "Moves Left",
      newtonPerKg: "m/s²",
      formula: "∑F = ma",
    },
  };

  const t = texts[language];

  // Colors for forces
  const forceColors = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

  // Calculate net force
  const calculateNetForce = useCallback(() => {
    return forces.reduce((sum, force) => {
      return sum + (force.direction === "right" ? force.magnitude : -force.magnitude);
    }, 0);
  }, [forces]);

  const netForce = calculateNetForce();
  const acceleration = netForce / objectMass;
  const isBalanced = Math.abs(netForce) < 0.1;

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw ground line
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY + 60);
    ctx.lineTo(width, centerY + 60);
    ctx.stroke();

    // Draw the object (box)
    const boxSize = 80;
    ctx.fillStyle = isBalanced ? "#22c55e" : "#f59e0b";
    ctx.strokeStyle = isBalanced ? "#16a34a" : "#d97706";
    ctx.lineWidth = 3;
    
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(centerX - boxSize/2 + 5, centerY - boxSize/2 + 5, boxSize, boxSize);
    
    // Box
    ctx.fillStyle = isBalanced ? "#22c55e" : "#f59e0b";
    ctx.fillRect(centerX - boxSize/2, centerY - boxSize/2, boxSize, boxSize);
    ctx.strokeRect(centerX - boxSize/2, centerY - boxSize/2, boxSize, boxSize);

    // Draw mass label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${objectMass} ${t.kg}`, centerX, centerY + 5);

    // Draw forces as arrows
    forces.forEach((force, index) => {
      const arrowLength = force.magnitude * 4;
      const y = centerY - 60 - (index * 25);
      
      if (force.direction === "right") {
        // Arrow to right
        ctx.strokeStyle = force.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX + boxSize/2, y);
        ctx.lineTo(centerX + boxSize/2 + arrowLength, y);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = force.color;
        ctx.beginPath();
        ctx.moveTo(centerX + boxSize/2 + arrowLength, y);
        ctx.lineTo(centerX + boxSize/2 + arrowLength - 10, y - 8);
        ctx.lineTo(centerX + boxSize/2 + arrowLength - 10, y + 8);
        ctx.fill();

        // Label
        ctx.fillStyle = force.color;
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(`F${index + 1} = ${force.magnitude}N`, centerX + boxSize/2 + arrowLength + 10, y + 4);
      } else {
        // Arrow to left
        ctx.strokeStyle = force.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - boxSize/2, y);
        ctx.lineTo(centerX - boxSize/2 - arrowLength, y);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = force.color;
        ctx.beginPath();
        ctx.moveTo(centerX - boxSize/2 - arrowLength, y);
        ctx.lineTo(centerX - boxSize/2 - arrowLength + 10, y - 8);
        ctx.lineTo(centerX - boxSize/2 - arrowLength + 10, y + 8);
        ctx.fill();

        // Label
        ctx.fillStyle = force.color;
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "right";
        ctx.fillText(`F${index + 1} = ${force.magnitude}N`, centerX - boxSize/2 - arrowLength - 10, y + 4);
      }
    });

    // Draw net force indicator
    if (showResult) {
      const netForceLength = Math.abs(netForce) * 4;
      const resultY = centerY + 100;

      if (netForce !== 0) {
        const direction = netForce > 0 ? 1 : -1;
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(centerX, resultY);
        ctx.lineTo(centerX + direction * netForceLength, resultY);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = "#8b5cf6";
        ctx.beginPath();
        if (direction > 0) {
          ctx.moveTo(centerX + netForceLength, resultY);
          ctx.lineTo(centerX + netForceLength - 15, resultY - 12);
          ctx.lineTo(centerX + netForceLength - 15, resultY + 12);
        } else {
          ctx.moveTo(centerX - netForceLength, resultY);
          ctx.lineTo(centerX - netForceLength + 15, resultY - 12);
          ctx.lineTo(centerX - netForceLength + 15, resultY + 12);
        }
        ctx.fill();

        // Label
        ctx.fillStyle = "#8b5cf6";
        ctx.font = "bold 14px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`∑F = ${netForce.toFixed(1)}N`, centerX, resultY + 25);
      }
    }
  }, [forces, objectMass, showResult, isBalanced, netForce, t.kg]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Add a new force
  const addForce = () => {
    const newForce: Force = {
      id: Date.now().toString(),
      magnitude: 5,
      direction: forces.length % 2 === 0 ? "right" : "left",
      color: forceColors[forces.length % forceColors.length],
    };
    setForces([...forces, newForce]);
  };

  // Remove a force
  const removeForce = (id: string) => {
    setForces(forces.filter((f) => f.id !== id));
  };

  // Update a force
  const updateForce = (id: string, updates: Partial<Force>) => {
    setForces(forces.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  // Reset
  const handleReset = () => {
    setForces([
      { id: "1", magnitude: 10, direction: "right", color: "#22c55e" },
      { id: "2", magnitude: 10, direction: "left", color: "#ef4444" },
    ]);
    setObjectMass(5);
    setShowResult(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-orange-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Object Mass */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t.mass}</label>
            <Badge variant="secondary">{objectMass} {t.kg}</Badge>
          </div>
          <Slider
            value={[objectMass]}
            onValueChange={([value]) => setObjectMass(value)}
            min={1}
            max={20}
            step={1}
          />
        </div>

        {/* Forces List */}
        <div className="space-y-4">
          <h3 className="font-semibold">{t.force}</h3>
          {forces.map((force, index) => (
            <div key={force.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: force.color, color: "white" }}>
                  {t.force} {index + 1}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeForce(force.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t.removeForce}
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm text-slate-500">{t.magnitude}</label>
                  <Slider
                    value={[force.magnitude]}
                    onValueChange={([value]) => updateForce(force.id, { magnitude: value })}
                    min={1}
                    max={30}
                    step={1}
                  />
                </div>
                <Badge variant="outline">{force.magnitude} {t.newton}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={force.direction === "right" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateForce(force.id, { direction: "right" })}
                  className={force.direction === "right" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  {t.toRight}
                </Button>
                <Button
                  variant={force.direction === "left" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateForce(force.id, { direction: "left" })}
                  className={force.direction === "left" ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  {t.toLeft}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={addForce} disabled={forces.length >= 6}>
            {t.addForce}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
          <Button
            onClick={() => setShowResult(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Play className="w-4 h-4 mr-2" />
            {t.check}
          </Button>
        </div>

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
          <code className="text-sm font-mono">{t.formula}</code>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={250} className="w-full" />
        </div>

        {/* Result */}
        {showResult && (
          <div className={`p-4 rounded-lg ${isBalanced ? "bg-emerald-50 dark:bg-emerald-950" : "bg-amber-50 dark:bg-amber-950"}`}>
            <div className="flex items-center gap-3 mb-3">
              {isBalanced ? (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              ) : (
                <XCircle className="w-6 h-6 text-amber-500" />
              )}
              <span className={`font-bold ${isBalanced ? "text-emerald-700" : "text-amber-700"}`}>
                {isBalanced ? t.balanced : t.notBalanced}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">{t.netForce}:</span>
                <span className="font-bold ml-2">{netForce.toFixed(1)} {t.newton}</span>
              </div>
              <div>
                <span className="text-slate-500">{t.acceleration}:</span>
                <span className="font-bold ml-2">{acceleration.toFixed(2)} {t.newtonPerKg}</span>
              </div>
            </div>
            {!isBalanced && (
              <p className="mt-2 text-sm text-slate-600">
                {netForce > 0 ? t.movesRight : t.movesLeft}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
