"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Zap, Battery, Gauge, Lightbulb, Flame, Clock } from "lucide-react";

interface ElectricPowerSimulatorProps {
  language: "ar" | "en";
}

export function ElectricPowerSimulator({ language }: ElectricPowerSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [voltage, setVoltage] = useState(12);
  const [current, setCurrent] = useState(2);
  const [time, setTime] = useState(1); // hours
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [powerHistory, setPowerHistory] = useState<{ time: number; power: number; energy: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي القدرة الكهربائية",
      description: "استكشف القدرة والطاقة الكهربائية",
      voltage: "الجهد (V)",
      current: "التيار (I)",
      time: "الزمن",
      power: "القدرة الكهربائية",
      energy: "الطاقة الكهربائية",
      watts: "وات",
      kiloWatts: "كيلووات",
      joules: "جول",
      wattHour: "وات·ساعة",
      kiloWattHour: "كيلووات·ساعة",
      hours: "ساعة",
      volts: "فولت",
      amps: "أمبير",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      powerFormula1: "P = V × I",
      powerFormula2: "P = I² × R",
      powerFormula3: "P = V² / R",
      energyFormula: "E = P × t",
      physicsExplanation: "التفسير الفيزيائي",
      powerDefinition: "القدرة الكهربائية هي معدل تحويل الطاقة الكهربائية",
      energyDefinition: "الطاقة الكهربائية = القدرة × الزمن",
      cost: "التكلفة التقريبية",
      egyptianPound: "جنيه مصري",
      resistance: "المقاومة المحسوبة",
      ohms: "أوم",
      powerGraph: "رسم القدرة مع الزمن",
      efficiency: "الكفاءة",
      heat: "الحرارة المتولدة",
      calories: "سعرة",
    },
    en: {
      title: "Electric Power Simulator",
      description: "Explore electric power and energy",
      voltage: "Voltage (V)",
      current: "Current (I)",
      time: "Time",
      power: "Electric Power",
      energy: "Electric Energy",
      watts: "W",
      kiloWatts: "kW",
      joules: "J",
      wattHour: "Wh",
      kiloWattHour: "kWh",
      hours: "h",
      volts: "V",
      amps: "A",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      powerFormula1: "P = V × I",
      powerFormula2: "P = I² × R",
      powerFormula3: "P = V² / R",
      energyFormula: "E = P × t",
      physicsExplanation: "Physics Explanation",
      powerDefinition: "Electric power is the rate of converting electrical energy",
      energyDefinition: "Electric energy = Power × Time",
      cost: "Approximate Cost",
      egyptianPound: "EGP",
      resistance: "Calculated Resistance",
      ohms: "Ω",
      powerGraph: "Power vs Time Graph",
      efficiency: "Efficiency",
      heat: "Heat Generated",
      calories: "cal",
    },
  };

  const t = texts[language];

  // Calculate values
  const power = voltage * current; // Watts
  const resistance = voltage / current; // Ohms
  const energyWh = power * time; // Watt-hours
  const energyJoules = energyWh * 3600; // Joules
  const costPerKwh = 0.58; // Egyptian Pounds per kWh (approximate)
  const cost = (energyWh / 1000) * costPerKwh;
  const heatCalories = energyJoules * 0.239; // Convert Joules to calories

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
    bgGradient.addColorStop(0, "#fdf4ff");
    bgGradient.addColorStop(1, "#fae8ff");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Animation offset
    const animOffset = isAnimating ? animationTime * 40 : 0;

    // Draw power meter/gauge
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw light bulb
    const bulbX = centerX;
    const bulbY = centerY - 30;

    // Bulb glow effect based on power
    const glowIntensity = Math.min(power / 100, 1);
    if (glowIntensity > 0) {
      const glowGradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, 80);
      glowGradient.addColorStop(0, `rgba(251, 191, 36, ${glowIntensity * 0.8})`);
      glowGradient.addColorStop(0.5, `rgba(251, 191, 36, ${glowIntensity * 0.3})`);
      glowGradient.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bulb body
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, 35, 0, Math.PI * 2);
    const bulbGradient = ctx.createRadialGradient(bulbX - 10, bulbY - 10, 0, bulbX, bulbY, 35);
    if (power > 0) {
      bulbGradient.addColorStop(0, "#fef3c7");
      bulbGradient.addColorStop(0.5, "#fbbf24");
      bulbGradient.addColorStop(1, "#f59e0b");
    } else {
      bulbGradient.addColorStop(0, "#e5e7eb");
      bulbGradient.addColorStop(1, "#9ca3af");
    }
    ctx.fillStyle = bulbGradient;
    ctx.fill();
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bulb base
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(bulbX - 15, bulbY + 35, 30, 25);

    // Filament
    ctx.strokeStyle = power > 0 ? "#f97316" : "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bulbX - 10, bulbY);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(bulbX - 5 + i * 7, bulbY + (i % 2 === 0 ? -8 : 8));
    }
    ctx.lineTo(bulbX + 10, bulbY);
    ctx.stroke();

    // Draw power flow animation
    if (isAnimating) {
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 15]);
      ctx.lineDashOffset = -animOffset;

      // Left flow
      ctx.beginPath();
      ctx.moveTo(50, centerY);
      ctx.lineTo(bulbX - 50, centerY);
      ctx.stroke();

      // Right flow
      ctx.beginPath();
      ctx.moveTo(bulbX + 50, centerY);
      ctx.lineTo(width - 50, centerY);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // Draw power meter
    const meterX = 80;
    const meterY = height - 80;

    // Meter background
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(meterX - 40, meterY - 40, 80, 60, 8);
    ctx.fill();

    // Power value
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 18px system-ui";
    ctx.textAlign = "center";
    const displayPower = power >= 1000 ? `${(power / 1000).toFixed(1)}k` : power.toFixed(0);
    ctx.fillText(`${displayPower}W`, meterX, meterY - 5);

    // Label
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px system-ui";
    ctx.fillText(t.power, meterX, meterY + 12);

    // Draw energy meter
    const energyMeterX = width - 80;
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(energyMeterX - 50, meterY - 40, 100, 60, 8);
    ctx.fill();

    // Energy value
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 16px system-ui";
    const displayEnergy = energyWh >= 1000 
      ? `${(energyWh / 1000).toFixed(2)} kWh`
      : `${energyWh.toFixed(1)} Wh`;
    ctx.fillText(displayEnergy, energyMeterX, meterY - 5);

    // Label
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px system-ui";
    ctx.fillText(t.energy, energyMeterX, meterY + 12);

    // Draw circuit elements at bottom
    // Battery symbol
    const battX = 60;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(battX - 3, centerY - 20, 6, 12);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(battX - 8, centerY + 8, 16, 6);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(battX - 4, centerY - 8, 8, 16);

    // Battery label
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${voltage}V`, battX, centerY + 40);

    // Resistor symbol
    const resX = width - 60;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(resX - 30, centerY);
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(resX - 20 + i * 10, centerY + (i % 2 === 0 ? 12 : -12));
    }
    ctx.lineTo(resX + 30, centerY);
    ctx.stroke();

    // Resistor label
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.fillText(`${resistance.toFixed(0)}Ω`, resX, centerY + 35);

  }, [voltage, current, power, energyWh, resistance, isAnimating, animationTime, t]);

  // Draw history graph
  const drawHistoryGraph = useCallback(() => {
    const canvas = historyCanvasRef.current;
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
    ctx.fillText(`${t.time} (${t.hours})`, width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${t.power} (${t.watts})`, 0, 0);
    ctx.restore();

    // Draw power line (constant for given V and I)
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const maxTime = 5;
    const maxPower = 200;

    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const powerY = height - padding - (power / maxPower) * graphHeight;
    ctx.moveTo(padding, powerY);
    ctx.lineTo(padding + (time / maxTime) * graphWidth, powerY);
    ctx.stroke();

    // Draw power point
    ctx.beginPath();
    ctx.arc(padding + (time / maxTime) * graphWidth, powerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#8b5cf6";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw energy area
    ctx.fillStyle = "rgba(139, 92, 246, 0.2)";
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, powerY);
    ctx.lineTo(padding + (time / maxTime) * graphWidth, powerY);
    ctx.lineTo(padding + (time / maxTime) * graphWidth, height - padding);
    ctx.closePath();
    ctx.fill();

    // Energy label
    ctx.fillStyle = "#8b5cf6";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`E = ${energyWh.toFixed(1)} Wh`, padding + (time / maxTime) * graphWidth / 2, height - padding - 20);

    // Scale labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * graphWidth;
      ctx.fillText(`${i}`, x, height - padding + 15);
    }
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const y = height - padding - (i / 4) * graphHeight;
      ctx.fillText(`${i * 50}`, padding - 5, y + 4);
    }

  }, [power, time, energyWh, t]);

  // Animation and history update
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now() - animationTime * 1000;
    let lastHistoryUpdate = 0;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setAnimationTime(elapsed);

      // Update history every 0.5 seconds
      if (elapsed - lastHistoryUpdate >= 0.5) {
        lastHistoryUpdate = elapsed;
        setPowerHistory(prev => {
          const newEntry = {
            time: elapsed,
            power: power,
            energy: power * (elapsed / 3600) // Wh
          };
          return [...prev.slice(-20), newEntry];
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animationTime, power]);

  // Draw on every update
  useEffect(() => {
    drawCanvas();
    drawHistoryGraph();
  }, [drawCanvas, drawHistoryGraph]);

  const handleReset = () => {
    setIsAnimating(false);
    setAnimationTime(0);
    setPowerHistory([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-fuchsia-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              max={50}
              step={1}
            />
          </div>

          {/* Current */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                {t.current}
              </label>
              <Badge variant="secondary">{current} {t.amps}</Badge>
            </div>
            <Slider
              value={[current]}
              onValueChange={([value]) => setCurrent(value)}
              min={0.1}
              max={10}
              step={0.1}
            />
          </div>

          {/* Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                {t.time}
              </label>
              <Badge variant="secondary">{time} {t.hours}</Badge>
            </div>
            <Slider
              value={[time]}
              onValueChange={([value]) => setTime(value)}
              min={0.1}
              max={5}
              step={0.1}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            className={isAnimating ? "bg-fuchsia-500 hover:bg-fuchsia-600" : "bg-pink-500 hover:bg-pink-600"}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-fuchsia-50 dark:bg-fuchsia-950 p-3 rounded-lg text-center border border-fuchsia-200 dark:border-fuchsia-800">
            <code className="text-sm font-mono font-bold text-fuchsia-700 dark:text-fuchsia-300">{t.powerFormula1}</code>
          </div>
          <div className="bg-pink-50 dark:bg-pink-950 p-3 rounded-lg text-center border border-pink-200 dark:border-pink-800">
            <code className="text-sm font-mono font-bold text-pink-700 dark:text-pink-300">{t.powerFormula2}</code>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded-lg text-center border border-violet-200 dark:border-violet-800">
            <code className="text-sm font-mono font-bold text-violet-700 dark:text-violet-300">{t.powerFormula3}</code>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg text-center border border-amber-200 dark:border-amber-800">
            <code className="text-sm font-mono font-bold text-amber-700 dark:text-amber-300">{t.energyFormula}</code>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={250}
            className="w-full"
          />
        </div>

        {/* Power Graph */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
            {t.powerGraph}
          </div>
          <canvas
            ref={historyCanvasRef}
            width={600}
            height={200}
            className="w-full"
          />
        </div>

        {/* Physics Explanation */}
        <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-950 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-fuchsia-500" />
            <span className="font-bold text-fuchsia-700 dark:text-fuchsia-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 mb-2">{t.powerDefinition}</p>
          <p className="text-fuchsia-500 dark:text-fuchsia-500 text-sm">{t.energyDefinition}</p>
        </div>

        {/* Values display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-fuchsia-600">
              {power >= 1000 ? `${(power / 1000).toFixed(2)} kW` : `${power.toFixed(1)} W`}
            </div>
            <div className="text-sm text-slate-500">{t.power}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-amber-600">
              {energyWh >= 1000 ? `${(energyWh / 1000).toFixed(2)} kWh` : `${energyWh.toFixed(1)} Wh`}
            </div>
            <div className="text-sm text-slate-500">{t.energy}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-green-600">{resistance.toFixed(1)} Ω</div>
            <div className="text-sm text-slate-500">{t.resistance}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-blue-600">{cost.toFixed(2)} {t.egyptianPound}</div>
            <div className="text-sm text-slate-500">{t.cost}</div>
          </div>
        </div>

        {/* Additional info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span className="font-bold text-red-700 dark:text-red-300">{t.heat}</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{heatCalories.toFixed(0)}</div>
            <div className="text-sm text-red-500">{t.calories}</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5 text-green-500" />
              <span className="font-bold text-green-700 dark:text-green-300">{t.energy}</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{(energyJoules / 1000).toFixed(1)} kJ</div>
            <div className="text-sm text-green-500">{t.joules}</div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-blue-700 dark:text-blue-300">{t.time}</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{time.toFixed(1)} h</div>
            <div className="text-sm text-blue-500">{time * 60} min</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
