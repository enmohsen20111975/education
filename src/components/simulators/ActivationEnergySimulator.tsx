"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Zap, Play, Pause, Thermometer } from "lucide-react";

interface ActivationEnergySimulatorProps {
  language: "ar" | "en";
}

type ReactionType = "exothermic" | "endothermic";

export function ActivationEnergySimulator({ language }: ActivationEnergySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [reactionType, setReactionType] = useState<ReactionType>("exothermic");
  const [temperature, setTemperature] = useState(25);
  const [catalyst, setCatalyst] = useState(false);
  const [ballPosition, setBallPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const texts = {
    ar: {
      title: "محاكي طاقة التنشيط",
      description: "استكشف طاقة التنشيط وتأثير المحفزات على التفاعلات",
      exothermic: "تفاعل طارد للحرارة",
      endothermic: "تفاعل ماص للحرارة",
      withCatalyst: "مع محفز",
      withoutCatalyst: "بدون محفز",
      activationEnergy: "طاقة التنشيط (Ea)",
      energyReleased: "الطاقة المنطلقة",
      energyAbsorbed: "الطاقة الممتصة",
      reactants: "المتتفاعلات",
      products: "النواتج",
      transitionState: "حالة الانتقال",
      temperature: "الحرارة (°C)",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      catalystEffect: "تأثير المحفز",
      collisionTheory: "نظرية التصادم",
      thresholdEnergy: "الطاقة الحرجية",
      particlesAtThreshold: "الجزيئات فوق الطاقة الحرجية",
      reactionRate: "سرعة التفاعل",
      potentialEnergy: "الطاقة الكامنة",
      reactionProgress: "تقدم التفاعل"
    },
    en: {
      title: "Activation Energy Simulator",
      description: "Explore activation energy and catalyst effects on reactions",
      exothermic: "Exothermic Reaction",
      endothermic: "Endothermic Reaction",
      withCatalyst: "With Catalyst",
      withoutCatalyst: "Without Catalyst",
      activationEnergy: "Activation Energy (Ea)",
      energyReleased: "Energy Released",
      energyAbsorbed: "Energy Absorbed",
      reactants: "Reactants",
      products: "Products",
      transitionState: "Transition State",
      temperature: "Temperature (°C)",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      explanation: "Chemical Explanation",
      catalystEffect: "Catalyst Effect",
      collisionTheory: "Collision Theory",
      thresholdEnergy: "Threshold Energy",
      particlesAtThreshold: "Particles Above Threshold",
      reactionRate: "Reaction Rate",
      potentialEnergy: "Potential Energy",
      reactionProgress: "Reaction Progress"
    },
  };

  const t = texts[language];

  // Energy values
  const baseEa = reactionType === "exothermic" ? 75 : 90;
  const Ea = catalyst ? baseEa * 0.6 : baseEa;
  const reactantEnergy = reactionType === "exothermic" ? 50 : 40;
  const productEnergy = reactionType === "exothermic" ? 20 : 80;
  const deltaH = productEnergy - reactantEnergy;

  // Boltzmann distribution factor
  const thresholdParticles = Math.round(Math.exp(-Ea / (8.314 * (temperature + 273.15)) * 1000) * 100);
  const reactionRate = thresholdParticles * (catalyst ? 2 : 1);

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

    // Draw energy diagram
    const graphX = 60;
    const graphY = 30;
    const graphWidth = width - 120;
    const graphHeight = height - 100;
    const energyScale = graphHeight / 100;

    // Draw axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(graphX, graphY);
    ctx.lineTo(graphX, graphY + graphHeight);
    ctx.lineTo(graphX + graphWidth, graphY + graphHeight);
    ctx.stroke();

    // Y-axis label
    ctx.save();
    ctx.translate(20, graphY + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.potentialEnergy, 0, 0);
    ctx.restore();

    // X-axis label
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.reactionProgress, graphX + graphWidth / 2, height - 10);

    // Energy curve
    ctx.strokeStyle = reactionType === "exothermic" ? "#22c55e" : "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    // Reactants level
    const reactantY = graphY + graphHeight - reactantEnergy * energyScale;
    ctx.moveTo(graphX, reactantY);
    ctx.lineTo(graphX + graphWidth * 0.15, reactantY);

    // Peak (transition state)
    const peakX = graphX + graphWidth * 0.35;
    const peakY = graphY + graphHeight - (reactantEnergy + Ea) * energyScale;

    // Products level
    const productY = graphY + graphHeight - productEnergy * energyScale;

    // Draw the curve
    ctx.bezierCurveTo(
      graphX + graphWidth * 0.25, reactantY,
      peakX - 20, peakY,
      peakX, peakY
    );

    // Second half of curve (with/without catalyst path)
    if (catalyst) {
      const catalystPeakY = graphY + graphHeight - (reactantEnergy + Ea) * energyScale * 0.6;
      ctx.bezierCurveTo(
        peakX + 20, catalystPeakY,
        graphX + graphWidth * 0.45, productY + 20,
        graphX + graphWidth * 0.5, productY
      );
    } else {
      ctx.bezierCurveTo(
        peakX + 20, peakY,
        graphX + graphWidth * 0.45, productY + 20,
        graphX + graphWidth * 0.5, productY
      );
    }

    ctx.lineTo(graphX + graphWidth * 0.7, productY);
    ctx.stroke();

    // Draw catalyst path (dashed)
    if (catalyst) {
      ctx.strokeStyle = "#f59e0b";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX, reactantY);
      ctx.lineTo(graphX + graphWidth * 0.15, reactantY);
      
      const catalystPeakX = graphX + graphWidth * 0.35;
      const catalystPeakY = graphY + graphHeight - (reactantEnergy + Ea * 0.6) * energyScale;
      
      ctx.bezierCurveTo(
        graphX + graphWidth * 0.25, reactantY,
        catalystPeakX - 20, catalystPeakY,
        catalystPeakX, catalystPeakY
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw moving ball
    if (ballPosition > 0) {
      const ballProgress = ballPosition / 100;
      let ballX, ballY;

      if (ballProgress <= 0.35) {
        // Going up
        const t = ballProgress / 0.35;
        ballX = graphX + t * graphWidth * 0.35;
        const targetPeakY = catalyst ? 
          graphY + graphHeight - (reactantEnergy + Ea * 0.6) * energyScale :
          peakY;
        ballY = reactantY + t * (targetPeakY - reactantY);
      } else {
        // Coming down
        const t = (ballProgress - 0.35) / 0.65;
        ballX = graphX + graphWidth * 0.35 + t * graphWidth * 0.35;
        ballY = (catalyst ? 
          graphY + graphHeight - (reactantEnergy + Ea * 0.6) * energyScale :
          peakY) + t * (productY - (catalyst ? 
            graphY + graphHeight - (reactantEnergy + Ea * 0.6) * energyScale :
            peakY));
      }

      // Draw ball
      const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 12);
      gradient.addColorStop(0, "#fbbf24");
      gradient.addColorStop(1, "#f59e0b");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw energy labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "right";
    
    // Ea label
    const eaLabelY = reactantY - Ea * energyScale / 2;
    ctx.fillStyle = reactionType === "exothermic" ? "#22c55e" : "#3b82f6";
    ctx.fillText(`Ea = ${Ea.toFixed(0)} kJ/mol`, graphX - 5, eaLabelY);
    
    // Arrow for Ea
    ctx.strokeStyle = reactionType === "exothermic" ? "#22c55e" : "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(graphX - 10, reactantY);
    ctx.lineTo(graphX - 10, catalyst ? 
      graphY + graphHeight - (reactantEnergy + Ea * 0.6) * energyScale : 
      peakY);
    ctx.stroke();

    // Labels for reactants and products
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.reactants, graphX + graphWidth * 0.08, reactantY + 25);
    ctx.fillText(t.products, graphX + graphWidth * 0.6, productY + 25);
    ctx.fillText(t.transitionState, peakX, peakY - 15);

    // Energy difference indicator
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(graphX + graphWidth * 0.15, reactantY);
    ctx.lineTo(graphX + graphWidth * 0.65, reactantY);
    ctx.moveTo(graphX + graphWidth * 0.55, productY);
    ctx.lineTo(graphX + graphWidth * 0.65, productY);
    ctx.stroke();
    ctx.setLineDash([]);

    // ΔH label
    const deltaHLabelY = (reactantY + productY) / 2;
    ctx.fillStyle = deltaH < 0 ? "#22c55e" : "#3b82f6";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`ΔH = ${deltaH} kJ/mol`, graphX + graphWidth * 0.68, deltaHLabelY);

    // Draw particle distribution (bottom right)
    const distX = width - 180;
    const distY = height - 80;
    
    // Boltzmann distribution curve
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= 50; i++) {
      const x = distX + i * 2;
      const energy = i * 2;
      const factor = Math.exp(-((energy - Ea / 2) ** 2) / 1000) * (1 + temperature / 50);
      const y = distY - factor * 30;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Threshold line
    ctx.strokeStyle = "#ef4444";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(distX + Ea, distY);
    ctx.lineTo(distX + Ea, distY - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("E", distX + Ea, distY + 15);

  }, [reactionType, catalyst, temperature, ballPosition, language, t, Ea, deltaH, reactantEnergy, productEnergy]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isAnimating && ballPosition < 100) {
      const speed = 2 + temperature / 50;
      const interval = setInterval(() => {
        setBallPosition(p => Math.min(p + speed, 100));
      }, 50);
      return () => clearInterval(interval);
    } else if (ballPosition >= 100) {
      setIsAnimating(false);
    }
  }, [isAnimating, ballPosition, temperature]);

  const reset = () => {
    setIsAnimating(false);
    setBallPosition(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-amber-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Reaction Type Selection */}
        <div className="flex gap-2">
          <Button
            variant={reactionType === "exothermic" ? "default" : "outline"}
            onClick={() => { setReactionType("exothermic"); reset(); }}
            size="sm"
            className={reactionType === "exothermic" ? "bg-green-500" : ""}
          >
            {t.exothermic}
          </Button>
          <Button
            variant={reactionType === "endothermic" ? "default" : "outline"}
            onClick={() => { setReactionType("endothermic"); reset(); }}
            size="sm"
            className={reactionType === "endothermic" ? "bg-blue-500" : ""}
          >
            {t.endothermic}
          </Button>
        </div>

        {/* Catalyst Toggle */}
        <div className="flex gap-2">
          <Button
            variant={!catalyst ? "default" : "outline"}
            onClick={() => setCatalyst(false)}
            size="sm"
            className={!catalyst ? "bg-amber-500" : ""}
          >
            {t.withoutCatalyst}
          </Button>
          <Button
            variant={catalyst ? "default" : "outline"}
            onClick={() => setCatalyst(true)}
            size="sm"
            className={catalyst ? "bg-amber-500" : ""}
          >
            {t.withCatalyst}
          </Button>
        </div>

        {/* Temperature Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              {t.temperature}
            </label>
            <Badge variant="secondary">{temperature}°C</Badge>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={([v]) => setTemperature(v)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={550} height={350} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.activationEnergy}</p>
            <p className="font-bold text-amber-600">{Ea.toFixed(0)} kJ/mol</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{deltaH < 0 ? t.energyReleased : t.energyAbsorbed}</p>
            <p className="font-bold text-green-600">{Math.abs(deltaH)} kJ/mol</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.particlesAtThreshold}</p>
            <p className="font-bold text-purple-600">{thresholdParticles}%</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.reactionRate}</p>
            <p className="font-bold text-blue-600">{reactionRate.toFixed(1)}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-amber-50 rounded-lg space-y-3">
          <h4 className="font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {t.explanation}
          </h4>
          
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.activationEnergy}:</strong> هي الحد الأدنى من الطاقة اللازمة لبدء التفاعل الكيميائي.
                  الجزيئات يجب أن تمتلك طاقة كافية للتغلب على هذا الحاجز للوصول إلى حالة الانتقال.
                </>
              ) : (
                <>
                  <strong>{t.activationEnergy}:</strong> The minimum energy required to start a chemical reaction.
                  Molecules must have sufficient energy to overcome this barrier to reach the transition state.
                </>
              )}
            </p>
            
            <p>
              {catalyst && (
                language === "ar" ? (
                  <>
                    <strong>{t.catalystEffect}:</strong> المحفز يخفض طاقة التنشيط بتوفير مسار بديل للتفاعل،
                    مما يزيد سرعة التفاعل دون أن يُستهلك.
                  </>
                ) : (
                  <>
                    <strong>{t.catalystEffect}:</strong> The catalyst lowers activation energy by providing
                    an alternative reaction pathway, increasing reaction rate without being consumed.
                  </>
                )
              )}
            </p>
            
            <p>
              {language === "ar" ? (
                <>
                  <strong>{t.collisionTheory}:</strong> كلما زادت الحرارة، زادت طاقة الجزيئات،
                  وزاد عدد الجزيئات القادرة على تجاوز طاقة التنشيط.
                </>
              ) : (
                <>
                  <strong>{t.collisionTheory}:</strong> Higher temperature means more molecular energy,
                  and more molecules can overcome the activation energy barrier.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-amber-500 hover:bg-amber-600">
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
