"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, CircuitBoard, Zap, Battery, Lightbulb } from "lucide-react";

interface SeriesParallelSimulatorProps {
  language: "ar" | "en";
}

export function SeriesParallelSimulator({ language }: SeriesParallelSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Circuit configuration
  const [circuitType, setCircuitType] = useState<"series" | "parallel">("series");
  const [voltage, setVoltage] = useState(12); // Volts
  const [r1, setR1] = useState(100); // Ohms
  const [r2, setR2] = useState(200); // Ohms
  const [r3, setR3] = useState(300); // Ohms
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي دوائر التوالي والتوازي",
      description: "استكشف الفرق بين دوائر التوالي والتوازي",
      voltage: "جهد البطارية",
      resistance1: "المقاومة الأولى (R₁)",
      resistance2: "المقاومة الثانية (R₂)",
      resistance3: "المقاومة الثالثة (R₃)",
      totalResistance: "المقاومة الكلية",
      totalCurrent: "التيار الكلي",
      series: "دائرة توالي",
      parallel: "دائرة توازي",
      volts: "فولت",
      ohms: "أوم",
      amps: "أمبير",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      physicsExplanation: "التفسير الفيزيائي",
      seriesRule: "في التوالي: المقاومة الكلية = R₁ + R₂ + R₃",
      parallelRule: "في التوازي: 1/R = 1/R₁ + 1/R₂ + 1/R₃",
      seriesCurrent: "في التوالي: التيار واحد في جميع المقاومات",
      parallelCurrent: "في التوازي: الجهد واحد على جميع المقاومات",
      currentThrough: "التيار عبر",
      voltageAcross: "الجهد عبر",
      power: "القدرة",
      watts: "وات",
    },
    en: {
      title: "Series & Parallel Circuits Simulator",
      description: "Explore the difference between series and parallel circuits",
      voltage: "Battery Voltage",
      resistance1: "First Resistance (R₁)",
      resistance2: "Second Resistance (R₂)",
      resistance3: "Third Resistance (R₃)",
      totalResistance: "Total Resistance",
      totalCurrent: "Total Current",
      series: "Series Circuit",
      parallel: "Parallel Circuit",
      volts: "V",
      ohms: "Ω",
      amps: "A",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      physicsExplanation: "Physics Explanation",
      seriesRule: "In series: Total resistance = R₁ + R₂ + R₃",
      parallelRule: "In parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃",
      seriesCurrent: "In series: Same current through all resistors",
      parallelCurrent: "In parallel: Same voltage across all resistors",
      currentThrough: "Current through",
      voltageAcross: "Voltage across",
      power: "Power",
      watts: "W",
    },
  };

  const t = texts[language];

  // Calculate total resistance
  const calculateTotalResistance = useCallback(() => {
    if (circuitType === "series") {
      return r1 + r2 + r3;
    } else {
      // Parallel: 1/R = 1/R1 + 1/R2 + 1/R3
      return 1 / (1 / r1 + 1 / r2 + 1 / r3);
    }
  }, [circuitType, r1, r2, r3]);

  // Calculate total current
  const calculateTotalCurrent = useCallback(() => {
    return voltage / calculateTotalResistance();
  }, [voltage, calculateTotalResistance]);

  // Calculate current through each resistor
  const getCurrentThroughResistor = useCallback((resistor: number, index: number) => {
    const totalR = calculateTotalResistance();
    const totalI = calculateTotalCurrent();

    if (circuitType === "series") {
      return totalI;
    } else {
      // In parallel, V is same, I = V/R
      return voltage / resistor;
    }
  }, [circuitType, voltage, calculateTotalResistance, calculateTotalCurrent]);

  // Calculate voltage across each resistor
  const getVoltageAcrossResistor = useCallback((resistor: number, index: number) => {
    const totalI = calculateTotalCurrent();

    if (circuitType === "series") {
      return totalI * resistor;
    } else {
      // In parallel, voltage is same as source
      return voltage;
    }
  }, [circuitType, voltage, calculateTotalCurrent]);

  // Draw the circuit
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
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "#f0fdf4");
    bgGradient.addColorStop(1, "#dcfce7");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Calculate values
    const totalR = calculateTotalResistance();
    const totalI = calculateTotalCurrent();

    // Animation offset for current flow
    const animOffset = isAnimating ? animationTime * 50 : 0;

    if (circuitType === "series") {
      // Series circuit layout
      const batteryX = 80;
      const batteryY = height / 2;
      
      // Draw wires and components
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 3;

      // Bottom wire
      ctx.beginPath();
      ctx.moveTo(batteryX, batteryY + 40);
      ctx.lineTo(width - 80, batteryY + 40);
      ctx.stroke();

      // Right wire
      ctx.beginPath();
      ctx.moveTo(width - 80, batteryY + 40);
      ctx.lineTo(width - 80, batteryY - 40);
      ctx.stroke();

      // Top wire with resistors
      ctx.beginPath();
      ctx.moveTo(width - 80, batteryY - 40);
      ctx.lineTo(450, batteryY - 40);
      ctx.stroke();

      // Draw current flow animation
      if (isAnimating) {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 5;
        ctx.setLineDash([10, 20]);
        ctx.lineDashOffset = -animOffset;
        ctx.beginPath();
        ctx.moveTo(batteryX, batteryY - 40);
        ctx.lineTo(batteryX, batteryY + 40);
        ctx.lineTo(width - 80, batteryY + 40);
        ctx.lineTo(width - 80, batteryY - 40);
        ctx.lineTo(batteryX, batteryY - 40);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw resistors
      const resistors = [
        { x: 400, y: batteryY - 40, r: r1, label: "R₁" },
        { x: 280, y: batteryY - 40, r: r2, label: "R₂" },
        { x: 160, y: batteryY - 40, r: r3, label: "R₃" },
      ];

      resistors.forEach((res, i) => {
        // Draw resistor symbol (zigzag)
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(res.x + 40, res.y);
        for (let j = 0; j < 6; j++) {
          ctx.lineTo(res.x + 40 - (j + 1) * 12, res.y + (j % 2 === 0 ? 10 : -10));
        }
        ctx.lineTo(res.x - 40, res.y);
        ctx.stroke();

        // Draw connection lines
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(res.x + 40, res.y);
        ctx.lineTo(res.x + 50, res.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(res.x - 40, res.y);
        ctx.lineTo(res.x - 50, res.y);
        ctx.stroke();

        // Label
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(res.label, res.x, res.y - 20);
        ctx.fillText(`${res.r}Ω`, res.x, res.y + 25);

        // Current indicator
        const current = getCurrentThroughResistor(res.r, i);
        const voltageDrop = getVoltageAcrossResistor(res.r, i);
        ctx.fillStyle = "#22c55e";
        ctx.font = "10px system-ui";
        ctx.fillText(`${(current * 1000).toFixed(1)}mA`, res.x, res.y + 40);
      });

      // Left wire back to battery
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(120, batteryY - 40);
      ctx.lineTo(batteryX, batteryY - 40);
      ctx.stroke();

      // Draw battery
      // Battery symbol
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(batteryX - 5, batteryY - 30, 10, 20);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(batteryX - 15, batteryY + 10, 30, 10);

      // Battery label
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${voltage}V`, batteryX, batteryY + 60);

      // Current direction arrow
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(batteryX - 30, batteryY);
      ctx.lineTo(batteryX - 40, batteryY - 8);
      ctx.lineTo(batteryX - 40, batteryY + 8);
      ctx.fill();
      ctx.font = "12px system-ui";
      ctx.fillText("I", batteryX - 50, batteryY + 4);

    } else {
      // Parallel circuit layout
      const batteryX = 80;
      const batteryY = height / 2;

      // Draw main wires
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 3;

      // Bottom main wire
      ctx.beginPath();
      ctx.moveTo(batteryX, batteryY + 60);
      ctx.lineTo(width - 80, batteryY + 60);
      ctx.stroke();

      // Top main wire
      ctx.beginPath();
      ctx.moveTo(batteryX, batteryY - 60);
      ctx.lineTo(width - 80, batteryY - 60);
      ctx.stroke();

      // Battery connections
      ctx.beginPath();
      ctx.moveTo(batteryX, batteryY - 60);
      ctx.lineTo(batteryX, batteryY - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(batteryX, batteryY + 20);
      ctx.lineTo(batteryX, batteryY + 60);
      ctx.stroke();

      // Draw current flow animation
      if (isAnimating) {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 5;
        ctx.setLineDash([10, 20]);
        ctx.lineDashOffset = -animOffset;
        ctx.beginPath();
        ctx.moveTo(batteryX, batteryY - 60);
        ctx.lineTo(width - 80, batteryY - 60);
        ctx.lineTo(width - 80, batteryY + 60);
        ctx.lineTo(batteryX, batteryY + 60);
        ctx.lineTo(batteryX, batteryY - 60);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw resistors in parallel
      const resistors = [
        { x: 200, r: r1, label: "R₁" },
        { x: 320, r: r2, label: "R₂" },
        { x: 440, r: r3, label: "R₃" },
      ];

      resistors.forEach((res, i) => {
        // Vertical wire
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(res.x, batteryY - 60);
        ctx.lineTo(res.x, batteryY - 30);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(res.x, batteryY + 30);
        ctx.lineTo(res.x, batteryY + 60);
        ctx.stroke();

        // Resistor symbol
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(res.x, batteryY - 30);
        for (let j = 0; j < 6; j++) {
          ctx.lineTo(res.x + (j % 2 === 0 ? 12 : -12), batteryY - 30 + (j + 1) * 10);
        }
        ctx.lineTo(res.x, batteryY + 30);
        ctx.stroke();

        // Label
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(res.label, res.x + 25, batteryY - 5);
        ctx.fillText(`${res.r}Ω`, res.x + 25, batteryY + 10);

        // Current through this resistor
        const current = getCurrentThroughResistor(res.r, i);
        ctx.fillStyle = "#22c55e";
        ctx.font = "10px system-ui";
        ctx.fillText(`${(current * 1000).toFixed(1)}mA`, res.x - 30, batteryY + 4);
      });

      // Draw battery
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(batteryX - 5, batteryY - 20, 10, 15);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(batteryX - 15, batteryY + 5, 30, 10);

      // Battery label
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${voltage}V`, batteryX, batteryY + 80);
    }

    // Draw info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.roundRect(width - 200, 10, 190, 100, 8);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = language === "ar" ? "right" : "left";
    const textX = language === "ar" ? width - 20 : width - 180;

    ctx.fillText(`${t.totalResistance}:`, textX, 32);
    ctx.fillText(`${t.totalCurrent}:`, textX, 62);
    ctx.fillText(`${t.power}:`, textX, 92);

    ctx.fillStyle = "#f59e0b";
    ctx.fillText(`${totalR.toFixed(1)} ${t.ohms}`, textX, 50);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`${(totalI * 1000).toFixed(2)} mA`, textX, 80);
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(`${(voltage * totalI).toFixed(2)} ${t.watts}`, textX, 100);

  }, [circuitType, voltage, r1, r2, r3, isAnimating, animationTime, calculateTotalResistance, calculateTotalCurrent, getCurrentThroughResistor, getVoltageAcrossResistor, t, language]);

  // Animation loop
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
  }, [drawCanvas]);

  const handleReset = () => {
    setIsAnimating(false);
    setAnimationTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const totalR = calculateTotalResistance();
  const totalI = calculateTotalCurrent();
  const totalPower = voltage * totalI;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CircuitBoard className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-green-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Circuit Type Selector */}
        <div className="flex gap-3">
          <Button
            variant={circuitType === "series" ? "default" : "outline"}
            onClick={() => setCircuitType("series")}
            className={circuitType === "series" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {t.series}
          </Button>
          <Button
            variant={circuitType === "parallel" ? "default" : "outline"}
            onClick={() => setCircuitType("parallel")}
            className={circuitType === "parallel" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
          >
            {t.parallel}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Voltage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Battery className="w-4 h-4 text-red-500" />
                {t.voltage}
              </label>
              <Badge variant="secondary">{voltage} {t.volts}</Badge>
            </div>
            <Slider
              value={[voltage]}
              onValueChange={([value]) => setVoltage(value)}
              min={1}
              max={24}
              step={1}
            />
          </div>

          {/* R1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.resistance1}</label>
              <Badge variant="secondary">{r1} {t.ohms}</Badge>
            </div>
            <Slider
              value={[r1]}
              onValueChange={([value]) => setR1(value)}
              min={10}
              max={500}
              step={10}
            />
          </div>

          {/* R2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.resistance2}</label>
              <Badge variant="secondary">{r2} {t.ohms}</Badge>
            </div>
            <Slider
              value={[r2]}
              onValueChange={([value]) => setR2(value)}
              min={10}
              max={500}
              step={10}
            />
          </div>

          {/* R3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.resistance3}</label>
              <Badge variant="secondary">{r3} {t.ohms}</Badge>
            </div>
            <Slider
              value={[r3]}
              onValueChange={([value]) => setR3(value)}
              min={10}
              max={500}
              step={10}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            className={isAnimating ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"}
          >
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg text-center border border-green-200 dark:border-green-800">
            <code className="text-sm font-mono font-bold text-green-700 dark:text-green-300">
              {circuitType === "series" ? "R = R₁ + R₂ + R₃" : "1/R = 1/R₁ + 1/R₂ + 1/R₃"}
            </code>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg text-center border border-amber-200 dark:border-amber-800">
            <code className="text-sm font-mono font-bold text-amber-700 dark:text-amber-300">I = V/R</code>
          </div>
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

        {/* Physics Explanation */}
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-green-500" />
            <span className="font-bold text-green-700 dark:text-green-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-green-600 dark:text-green-400 mb-1">
            {circuitType === "series" ? t.seriesRule : t.parallelRule}
          </p>
          <p className="text-green-500 dark:text-green-500 text-sm">
            {circuitType === "series" ? t.seriesCurrent : t.parallelCurrent}
          </p>
        </div>

        {/* Values display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-amber-600">{totalR.toFixed(1)}</div>
            <div className="text-sm text-slate-500">{t.totalResistance} ({t.ohms})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-green-600">{(totalI * 1000).toFixed(2)}</div>
            <div className="text-sm text-slate-500">{t.totalCurrent} (mA)</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-red-600">{voltage}</div>
            <div className="text-sm text-slate-500">{t.voltage} ({t.volts})</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-violet-600">{totalPower.toFixed(2)}</div>
            <div className="text-sm text-slate-500">{t.power} ({t.watts})</div>
          </div>
        </div>

        {/* Individual resistor values */}
        <div className="grid grid-cols-3 gap-3">
          {[r1, r2, r3].map((r, i) => {
            const current = getCurrentThroughResistor(r, i);
            const vDrop = getVoltageAcrossResistor(r, i);
            const power = vDrop * current;
            return (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                <div className="font-bold text-amber-600 mb-2">R{i + 1}: {r}Ω</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <div>I = {(current * 1000).toFixed(2)} mA</div>
                  <div>V = {vDrop.toFixed(2)} V</div>
                  <div>P = {power.toFixed(3)} W</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
