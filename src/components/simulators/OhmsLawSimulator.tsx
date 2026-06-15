"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Zap, Battery, Gauge, Activity } from "lucide-react";

interface OhmsLawSimulatorProps {
  language: "ar" | "en";
}

export function OhmsLawSimulator({ language }: OhmsLawSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State - choose which variable to calculate
  const [calcMode, setCalcMode] = useState<"v" | "i" | "r">("i");
  const [voltage, setVoltage] = useState(12);
  const [current, setCurrent] = useState(0.1);
  const [resistance, setResistance] = useState(120);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي قانون أوم",
      description: "استكشف العلاقة بين الجهد والتيار والمقاومة",
      voltage: "الجهد الكهربائي (V)",
      current: "تيار (I)",
      resistance: "المقاومة (R)",
      volts: "فولت",
      amps: "أمبير",
      milliAmps: "ملي أمبير",
      ohms: "أوم",
      calculateVoltage: "حساب الجهد",
      calculateCurrent: "حساب التيار",
      calculateResistance: "حساب المقاومة",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      ohmsLaw: "قانون أوم: V = I × R",
      physicsExplanation: "التفسير الفيزيائي",
      ohmDefinition: "قانون أوم: الجهد يتناسب طردياً مع التيار عند ثبوت المقاومة",
      voltageExplain: "V = I × R : الجهد = التيار × المقاومة",
      currentExplain: "I = V / R : التيار = الجهد ÷ المقاومة",
      resistanceExplain: "R = V / I : المقاومة = الجهد ÷ التيار",
      ivCurve: "منحنى V-I",
      linear: "خطي (يتبع قانون أوم)",
      slope: "الميل = المقاومة",
      power: "القدرة",
      watts: "وات",
    },
    en: {
      title: "Ohm's Law Simulator",
      description: "Explore the relationship between voltage, current, and resistance",
      voltage: "Voltage (V)",
      current: "Current (I)",
      resistance: "Resistance (R)",
      volts: "V",
      amps: "A",
      milliAmps: "mA",
      ohms: "Ω",
      calculateVoltage: "Calculate Voltage",
      calculateCurrent: "Calculate Current",
      calculateResistance: "Calculate Resistance",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      ohmsLaw: "Ohm's Law: V = I × R",
      physicsExplanation: "Physics Explanation",
      ohmDefinition: "Ohm's Law: Voltage is directly proportional to current at constant resistance",
      voltageExplain: "V = I × R : Voltage = Current × Resistance",
      currentExplain: "I = V / R : Current = Voltage / Resistance",
      resistanceExplain: "R = V / I : Resistance = Voltage / Current",
      ivCurve: "V-I Curve",
      linear: "Linear (follows Ohm's law)",
      slope: "Slope = Resistance",
      power: "Power",
      watts: "W",
    },
  };

  const t = texts[language];

  // Calculate based on mode
  const getCalculatedValues = useCallback(() => {
    let v = voltage;
    let i = current;
    let r = resistance;

    if (calcMode === "v") {
      v = i * r;
    } else if (calcMode === "i") {
      i = v / r;
    } else {
      r = v / i;
    }

    return { voltage: v, current: i, resistance: r };
  }, [calcMode, voltage, current, resistance]);

  const values = getCalculatedValues();
  const power = values.voltage * values.current;

  // Draw main canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    const bgGradient = ctx.createLinearGradient(0, 0, width, 0);
    bgGradient.addColorStop(0, "#fef3c7");
    bgGradient.addColorStop(1, "#fef9c3");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Animation offset
    const animOffset = isAnimating ? animationTime * 30 : 0;

    // Draw circuit
    const centerX = width / 2;
    const centerY = height / 2;
    const circuitWidth = 350;
    const circuitHeight = 120;

    // Draw wires
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 4;

    // Draw circuit path
    ctx.beginPath();
    ctx.moveTo(centerX - circuitWidth / 2, centerY - circuitHeight / 2);
    ctx.lineTo(centerX + circuitWidth / 2, centerY - circuitHeight / 2);
    ctx.lineTo(centerX + circuitWidth / 2, centerY + circuitHeight / 2);
    ctx.lineTo(centerX - circuitWidth / 2, centerY + circuitHeight / 2);
    ctx.closePath();
    ctx.stroke();

    // Draw animated current flow
    if (isAnimating) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 6;
      ctx.setLineDash([15, 25]);
      ctx.lineDashOffset = -animOffset;
      ctx.beginPath();
      ctx.moveTo(centerX - circuitWidth / 2, centerY - circuitHeight / 2);
      ctx.lineTo(centerX + circuitWidth / 2, centerY - circuitHeight / 2);
      ctx.lineTo(centerX + circuitWidth / 2, centerY + circuitHeight / 2);
      ctx.lineTo(centerX - circuitWidth / 2, centerY + circuitHeight / 2);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw battery (left side)
    const batteryX = centerX - circuitWidth / 2;
    // Positive terminal
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(batteryX - 8, centerY - 25, 16, 8);
    // Negative terminal
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(batteryX - 12, centerY + 17, 24, 8);
    // Body
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(batteryX - 6, centerY - 17, 12, 34);

    // Battery label
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${values.voltage.toFixed(1)}V`, batteryX, centerY + 50);

    // Draw resistor (top)
    const resistorX = centerX;
    const resistorY = centerY - circuitHeight / 2;

    // Resistor zigzag
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(resistorX - 60, resistorY);
    for (let i = 0; i < 8; i++) {
      ctx.lineTo(resistorX - 50 + i * 15, resistorY + (i % 2 === 0 ? 15 : -15));
    }
    ctx.lineTo(resistorX + 60, resistorY);
    ctx.stroke();

    // Resistor label
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`${values.resistance.toFixed(0)}Ω`, resistorX, resistorY - 25);

    // Draw ammeter (right side)
    const ammeterX = centerX + circuitWidth / 2;
    ctx.beginPath();
    ctx.arc(ammeterX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = "#dbeafe";
    ctx.fill();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Ammeter symbol
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 18px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", ammeterX, centerY);

    // Current value
    const displayCurrent = values.current >= 1 
      ? `${values.current.toFixed(2)} ${t.amps}` 
      : `${(values.current * 1000).toFixed(1)} ${t.milliAmps}`;
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textBaseline = "top";
    ctx.fillText(displayCurrent, ammeterX, centerY + 35);

    // Draw current direction arrow
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(centerX + 30, resistorY - 35);
    ctx.lineTo(centerX + 40, resistorY - 45);
    ctx.lineTo(centerX + 40, resistorY - 25);
    ctx.fill();

    // Current direction label
    ctx.fillStyle = "#16a34a";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("I →", centerX + 50, resistorY - 40);

    // Draw power indicator (bottom)
    const powerWidth = Math.min(power / 5, 100);
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(centerX - 60, centerY + circuitHeight / 2 + 20, 120, 30);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - 60, centerY + circuitHeight / 2 + 20, 120, 30);

    // Power bar
    const powerGradient = ctx.createLinearGradient(centerX - 58, 0, centerX - 58 + powerWidth, 0);
    powerGradient.addColorStop(0, "#22c55e");
    powerGradient.addColorStop(1, "#ef4444");
    ctx.fillStyle = powerGradient;
    ctx.fillRect(centerX - 58, centerY + circuitHeight / 2 + 22, powerWidth, 26);

    // Power label
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${t.power}: ${power.toFixed(2)} ${t.watts}`, centerX, centerY + circuitHeight / 2 + 65);

  }, [values, power, isAnimating, animationTime, t]);

  // Draw V-I graph
  const drawGraph = useCallback(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = padding; i < width - padding; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, padding);
      ctx.lineTo(i, height - padding);
      ctx.stroke();
    }
    for (let i = padding; i < height - padding; i += 30) {
      ctx.beginPath();
      ctx.moveTo(padding, i);
      ctx.lineTo(width - padding, i);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#374151";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${t.voltage} (${t.volts})`, width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${t.current} (${t.amps})`, 0, 0);
    ctx.restore();

    // Draw V-I curve (I = V/R)
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const maxV = 30;
    const maxI = 0.5;

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let v = 0; v <= maxV; v += 0.5) {
      const i = v / values.resistance;
      const x = padding + (v / maxV) * graphWidth;
      const y = height - padding - (i / maxI) * graphHeight;

      if (v === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw current point
    const pointX = padding + (values.voltage / maxV) * graphWidth;
    const pointY = height - padding - (values.current / maxI) * graphHeight;

    // Draw dashed lines to axes
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(padding, pointY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw point
    ctx.beginPath();
    ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#8b5cf6";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw resistance line label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`R = ${values.resistance.toFixed(0)}Ω`, padding + 20, padding + 20);

    // Scale labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    for (let i = 0; i <= 6; i++) {
      const x = padding + (i / 6) * graphWidth;
      ctx.fillText(`${(i * 5).toFixed(0)}`, x, height - padding + 15);
    }
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i / 5) * graphHeight;
      const iValue = (i / 5) * maxI;
      ctx.fillText(iValue.toFixed(2), padding - 5, y + 4);
    }

  }, [values, t]);

  // Animation
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now() - animationTime * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setAnimationTime(elapsed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animationTime]);

  // Draw on every update
  useEffect(() => {
    drawCanvas();
    drawGraph();
  }, [drawCanvas, drawGraph]);

  const handleReset = () => {
    setIsAnimating(false);
    setAnimationTime(0);
    setVoltage(12);
    setCurrent(0.1);
    setResistance(120);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
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
        {/* Mode Selector */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant={calcMode === "i" ? "default" : "outline"}
            onClick={() => setCalcMode("i")}
            className={calcMode === "i" ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {t.calculateCurrent}
          </Button>
          <Button
            variant={calcMode === "v" ? "default" : "outline"}
            onClick={() => setCalcMode("v")}
            className={calcMode === "v" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            {t.calculateVoltage}
          </Button>
          <Button
            variant={calcMode === "r" ? "default" : "outline"}
            onClick={() => setCalcMode("r")}
            className={calcMode === "r" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {t.calculateResistance}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Voltage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Battery className="w-4 h-4 text-red-500" />
                {t.voltage}
              </label>
              <Badge variant="secondary" className={calcMode === "v" ? "bg-green-100 text-green-700" : ""}>
                {values.voltage.toFixed(1)} {t.volts}
              </Badge>
            </div>
            <Slider
              value={[voltage]}
              onValueChange={([value]) => setVoltage(value)}
              min={1}
              max={30}
              step={0.5}
              disabled={calcMode === "v"}
            />
          </div>

          {/* Current */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                {t.current}
              </label>
              <Badge variant="secondary" className={calcMode === "i" ? "bg-green-100 text-green-700" : ""}>
                {values.current >= 1 ? `${values.current.toFixed(2)} ${t.amps}` : `${(values.current * 1000).toFixed(1)} ${t.milliAmps}`}
              </Badge>
            </div>
            <Slider
              value={[current]}
              onValueChange={([value]) => setCurrent(value)}
              min={0.01}
              max={0.5}
              step={0.01}
              disabled={calcMode === "i"}
            />
          </div>

          {/* Resistance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-500" />
                {t.resistance}
              </label>
              <Badge variant="secondary" className={calcMode === "r" ? "bg-green-100 text-green-700" : ""}>
                {values.resistance.toFixed(0)} {t.ohms}
              </Badge>
            </div>
            <Slider
              value={[resistance]}
              onValueChange={([value]) => setResistance(value)}
              min={10}
              max={500}
              step={10}
              disabled={calcMode === "r"}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            className={isAnimating ? "bg-amber-500 hover:bg-amber-600" : "bg-yellow-500 hover:bg-yellow-600"}
          >
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Formula */}
        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800 text-center">
          <code className="text-lg font-mono font-bold text-amber-700 dark:text-amber-300">{t.ohmsLaw}</code>
        </div>

        {/* Circuit Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={280}
            className="w-full"
          />
        </div>

        {/* V-I Graph */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
            {t.ivCurve} - {t.linear}
          </div>
          <canvas
            ref={graphCanvasRef}
            width={600}
            height={200}
            className="w-full"
          />
        </div>

        {/* Physics Explanation */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-700 dark:text-amber-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-amber-600 dark:text-amber-400 mb-2">{t.ohmDefinition}</p>
          <div className="text-amber-500 dark:text-amber-500 text-sm space-y-1">
            <p>• {t.voltageExplain}</p>
            <p>• {t.currentExplain}</p>
            <p>• {t.resistanceExplain}</p>
          </div>
        </div>

        {/* Values display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-red-600">{values.voltage.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.voltage} ({t.volts})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-green-600">
              {values.current >= 1 ? values.current.toFixed(2) : (values.current * 1000).toFixed(1)}
            </div>
            <div className="text-sm text-slate-500">{t.current} ({values.current >= 1 ? t.amps : t.milliAmps})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-amber-600">{values.resistance.toFixed(0)}</div>
            <div className="text-sm text-slate-500">{t.resistance} ({t.ohms})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-violet-600">{power.toFixed(2)}</div>
            <div className="text-sm text-slate-500">{t.power} ({t.watts})</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
