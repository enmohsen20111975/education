"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Atom, RotateCcw, Link } from "lucide-react";

interface ChemicalBondSimulatorProps {
  language: "ar" | "en";
}

export function ChemicalBondSimulator({ language }: ChemicalBondSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [bondType, setBondType] = useState<"ionic" | "covalent" | "metallic">("ionic");
  const [animationStep, setAnimationStep] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الروابط الكيميائية",
      description: "استكشف أنواع الروابط الكيميائية",
      ionic: "رابطة أيونية",
      covalent: "رابطة تساهمية",
      metallic: "رابطة فلزية",
      description_ionic: "انتقال الإلكترونات من فلز إلى لا فلز",
      description_covalent: "مشاركة الإلكترونات بين ذرتين",
      description_metallic: "بحر من الإلكترونات في شبكة فلزية",
      example: "مثال",
      sodiumChloride: "كلوريد الصوديوم (NaCl)",
      water: "الماء (H₂O)",
      copper: "النحاس (Cu)",
      playAnimation: "تشغيل",
      reset: "إعادة",
      electrons: "الإلكترونات",
      positive: "موجب",
      negative: "سالب",
    },
    en: {
      title: "Chemical Bond Simulator",
      description: "Explore types of chemical bonds",
      ionic: "Ionic Bond",
      covalent: "Covalent Bond",
      metallic: "Metallic Bond",
      description_ionic: "Transfer of electrons from metal to non-metal",
      description_covalent: "Sharing of electrons between two atoms",
      description_metallic: "Sea of electrons in a metallic lattice",
      example: "Example",
      sodiumChloride: "Sodium Chloride (NaCl)",
      water: "Water (H₂O)",
      copper: "Copper (Cu)",
      playAnimation: "Play",
      reset: "Reset",
      electrons: "Electrons",
      positive: "positive",
      negative: "negative",
    },
  };

  const t = texts[language];

  const drawIonic = useCallback((step: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Sodium atom (Na)
    const naX = 150;
    const naY = height / 2;
    
    // Chlorine atom (Cl)
    const clX = 450;
    const clY = height / 2;

    // Draw Sodium
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(naX, naY, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Na", naX, naY + 8);

    // Draw Chlorine
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(clX, clY, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.fillText("Cl", clX, clY + 8);

    // Electrons
    if (step >= 1) {
      // Na electron (valence)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      const electronX = step < 3 ? naX + 60 : clX - 30;
      const electronY = step < 3 ? naY : clY - 20;
      ctx.arc(electronX, electronY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "10px system-ui";
      ctx.fillText("e⁻", electronX, electronY + 4);

      // Arrow showing transfer
      if (step === 2) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(naX + 70, naY);
        ctx.lineTo(clX - 70, clY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Charges after transfer
    if (step >= 3) {
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 20px system-ui";
      ctx.fillText("Na⁺", naX, naY - 70);
      ctx.fillStyle = "#ef4444";
      ctx.fillText("Cl⁻", clX, clY - 80);

      // Ionic bond line
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(naX + 50, naY);
      ctx.lineTo(clX - 60, clY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, []);

  const drawCovalent = useCallback((step: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Two hydrogen atoms
    const h1X = 200;
    const h2X = 400;
    const hY = height / 2;

    // Draw Hydrogen 1
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(h1X, hY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("H", h1X, hY + 8);

    // Draw Hydrogen 2
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(h2X, hY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText("H", h2X, hY + 8);

    // Shared electrons
    if (step >= 1) {
      ctx.fillStyle = "#ef4444";
      // Shared pair in the middle
      const sharedX = (h1X + h2X) / 2;
      ctx.beginPath();
      ctx.arc(sharedX, hY - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sharedX, hY + 10, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bond line
    if (step >= 2) {
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(h1X + 40, hY);
      ctx.lineTo(h2X - 40, hY);
      ctx.stroke();

      // H2 molecule label
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 20px system-ui";
      ctx.fillText("H₂", (h1X + h2X) / 2, hY - 60);
    }

  }, []);

  const drawMetallic = useCallback((step: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(0, 0, width, height);

    // Metal ion lattice
    const positions = [
      { x: 150, y: 100 }, { x: 300, y: 100 }, { x: 450, y: 100 },
      { x: 150, y: 200 }, { x: 300, y: 200 }, { x: 450, y: 200 },
      { x: 150, y: 300 }, { x: 300, y: 300 }, { x: 450, y: 300 },
    ];

    // Draw metal ions
    ctx.fillStyle = "#f59e0b";
    positions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Cu⁺", pos.x, pos.y + 6);
      ctx.fillStyle = "#f59e0b";
    });

    // Sea of electrons
    if (step >= 1) {
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
      ctx.fillRect(120, 70, 360, 260);

      // Free electrons
      ctx.fillStyle = "#3b82f6";
      for (let i = 0; i < 20; i++) {
        const x = 130 + Math.random() * 340;
        const y = 80 + Math.random() * 240;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Labels
    if (step >= 2) {
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px system-ui";
      ctx.fillText(language === "ar" ? "أيونات النحاس الموجبة" : "Positive Copper Ions", 300, 350);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(language === "ar" ? "بحر من الإلكترونات الحرة" : "Sea of Free Electrons", 300, 380);
    }

  }, [language]);

  const drawCanvas = useCallback(() => {
    switch (bondType) {
      case "ionic":
        drawIonic(animationStep);
        break;
      case "covalent":
        drawCovalent(animationStep);
        break;
      case "metallic":
        drawMetallic(animationStep);
        break;
    }
  }, [bondType, animationStep, drawIonic, drawCovalent, drawMetallic]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const playAnimation = () => {
    setAnimationStep(0);
    const steps = [1, 2, 3];
    steps.forEach((step, index) => {
      setTimeout(() => setAnimationStep(step), (index + 1) * 1000);
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Link className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Bond Type Selection */}
        <div className="flex gap-3">
          <Button
            variant={bondType === "ionic" ? "default" : "outline"}
            onClick={() => { setBondType("ionic"); setAnimationStep(0); }}
            className={bondType === "ionic" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
          >
            {t.ionic}
          </Button>
          <Button
            variant={bondType === "covalent" ? "default" : "outline"}
            onClick={() => { setBondType("covalent"); setAnimationStep(0); }}
            className={bondType === "covalent" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
          >
            {t.covalent}
          </Button>
          <Button
            variant={bondType === "metallic" ? "default" : "outline"}
            onClick={() => { setBondType("metallic"); setAnimationStep(0); }}
            className={bondType === "metallic" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
          >
            {t.metallic}
          </Button>
        </div>

        {/* Description */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm">
            {bondType === "ionic" && t.description_ionic}
            {bondType === "covalent" && t.description_covalent}
            {bondType === "metallic" && t.description_metallic}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {t.example}: {bondType === "ionic" ? t.sodiumChloride : bondType === "covalent" ? t.water : t.copper}
          </p>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full bg-white"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={playAnimation} className="bg-cyan-500 hover:bg-cyan-600">
            {t.playAnimation}
          </Button>
          <Button variant="outline" onClick={() => setAnimationStep(0)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
