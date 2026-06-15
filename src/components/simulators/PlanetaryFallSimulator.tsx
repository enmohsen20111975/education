"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, ArrowDown, Globe, Timer, Zap, Scale, Rocket } from "lucide-react";

interface PlanetaryFallSimulatorProps {
  language: "ar" | "en";
}

// Planet data with gravity
const planets = {
  earth: { gravity: 9.81, color: "#3b82f6", nameAr: "الأرض", nameEn: "Earth", emoji: "🌍" },
  moon: { gravity: 1.62, color: "#94a3b8", nameAr: "القمر", nameEn: "Moon", emoji: "🌙" },
  mars: { gravity: 3.71, color: "#ef4444", nameAr: "المريخ", nameEn: "Mars", emoji: "🔴" },
  jupiter: { gravity: 24.79, color: "#f97316", nameAr: "المشتري", nameEn: "Jupiter", emoji: "🟠" },
  venus: { gravity: 8.87, color: "#fbbf24", nameAr: "الزهرة", nameEn: "Venus", emoji: "🟡" },
  mercury: { gravity: 3.7, color: "#a3a3a3", nameAr: "عطارد", nameEn: "Mercury", emoji: "⚫" },
  saturn: { gravity: 10.44, color: "#eab308", nameAr: "زحل", nameEn: "Saturn", emoji: "🪐" },
  neptune: { gravity: 11.15, color: "#06b6d4", nameAr: "نبتون", nameEn: "Neptune", emoji: "🔵" },
};

type PlanetKey = keyof typeof planets;

export function PlanetaryFallSimulator({ language }: PlanetaryFallSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey>("earth");
  const [height, setHeight] = useState(50); // meters
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [ballY, setBallY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ time: number; velocity: number; height: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "السقوط الحر على الكواكب",
      description: "استكشف تأثير الجاذبية المختلفة على السقوط الحر",
      height: "الارتفاع الابتدائي",
      gravity: "تسارع الجاذبية",
      currentHeight: "الارتفاع الحالي",
      velocity: "السرعة الحالية",
      time: "الزمن",
      start: "إسقاط",
      pause: "إيقاف",
      reset: "إعادة",
      chart: "مقارنة زمن السقوط على الكواكب",
      meters: "متر",
      mps: "م/ث",
      ms2: "م/ث²",
      seconds: "ثانية",
      formula: "h = ½gt² | v = gt",
      impact: "الاصطدام!",
      impactSpeed: "سرعة الاصطدام",
      fallTime: "زمن السقوط",
      selectPlanet: "اختر الكوكب",
      physicsExplanation: "التفسير الفيزيائي",
      gravityDifference: "الجاذبية أقوى على الكواكب الكبيرة، مما يجعل السقوط أسرع",
      weightDifference: "وزنك على هذا الكوكب سيكون مختلفاً عن وزنك على الأرض",
      yourWeight: "وزنك على",
      yourWeightOnEarth: "وزنك على الأرض",
      kg: "كجم",
      comparativeData: "بيانات مقارنة",
      fastestFall: "أسرع سقوط",
      slowestFall: "أبطأ سقوط",
    },
    en: {
      title: "Planetary Free Fall Simulator",
      description: "Explore how different gravity affects free fall",
      height: "Initial Height",
      gravity: "Gravity Acceleration",
      currentHeight: "Current Height",
      velocity: "Current Velocity",
      time: "Time",
      start: "Drop",
      pause: "Pause",
      reset: "Reset",
      chart: "Fall Time Comparison Across Planets",
      meters: "m",
      mps: "m/s",
      ms2: "m/s²",
      seconds: "s",
      formula: "h = ½gt² | v = gt",
      impact: "Impact!",
      impactSpeed: "Impact Speed",
      fallTime: "Fall Time",
      selectPlanet: "Select Planet",
      physicsExplanation: "Physics Explanation",
      gravityDifference: "Gravity is stronger on larger planets, making fall faster",
      weightDifference: "Your weight on this planet would be different from Earth",
      yourWeight: "Your weight on",
      yourWeightOnEarth: "Your weight on Earth",
      kg: "kg",
      comparativeData: "Comparative Data",
      fastestFall: "Fastest Fall",
      slowestFall: "Slowest Fall",
    },
  };

  const t = texts[language];
  const planet = planets[selectedPlanet];
  const g = planet.gravity;

  // Physics calculations
  const calculateFallTime = useCallback((h: number, g: number) => {
    return Math.sqrt((2 * h) / g);
  }, []);

  const totalFallTime = calculateFallTime(height, g);

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const heightCanvas = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, heightCanvas);

    // Draw planet-specific background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, heightCanvas);
    if (selectedPlanet === "moon") {
      bgGradient.addColorStop(0, "#1e293b");
      bgGradient.addColorStop(1, "#0f172a");
    } else if (selectedPlanet === "mars") {
      bgGradient.addColorStop(0, "#fecaca");
      bgGradient.addColorStop(1, "#fee2e2");
    } else if (selectedPlanet === "jupiter") {
      bgGradient.addColorStop(0, "#fed7aa");
      bgGradient.addColorStop(1, "#fef3c7");
    } else {
      bgGradient.addColorStop(0, "#bfdbfe");
      bgGradient.addColorStop(1, "#dbeafe");
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, heightCanvas);

    // Draw tower/building
    ctx.fillStyle = selectedPlanet === "moon" ? "#475569" : "#64748b";
    ctx.fillRect(30, 20, 50, heightCanvas - 50);

    // Windows
    ctx.fillStyle = "#fef3c7";
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 1; col++) {
        ctx.fillRect(42 + col * 20, 35 + row * 30, 12, 18);
      }
    }

    // Draw ground with planet color
    ctx.fillStyle = planet.color;
    ctx.fillRect(0, heightCanvas - 30, width, 30);

    // Draw planet name on ground
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(planet.emoji, width / 2, heightCanvas - 10);

    // Draw height scale
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width - 40, 30);
    ctx.lineTo(width - 40, heightCanvas - 30);
    ctx.stroke();

    // Height markers
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    for (let i = 0; i <= 5; i++) {
      const y = 30 + ((heightCanvas - 60) * i) / 5;
      const h = height - (height * i) / 5;
      ctx.beginPath();
      ctx.moveTo(width - 45, y);
      ctx.lineTo(width - 35, y);
      ctx.stroke();
      ctx.fillText(`${Math.round(h)}`, width - 30, y + 4);
    }

    // Calculate ball position
    const ballCanvasY = 30 + ((heightCanvas - 60) * ballY) / height;
    const ballRadius = 12;

    // Draw ball
    const ballGradient = ctx.createRadialGradient(
      110 - 3, ballCanvasY - 3, 0,
      110, ballCanvasY, ballRadius
    );
    ballGradient.addColorStop(0, "#ef4444");
    ballGradient.addColorStop(1, "#b91c1c");
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(110, ballCanvasY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Velocity arrow
    if (velocity > 0 && ballY < height) {
      const arrowLength = Math.min(velocity * 1.5, 40);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(110, ballCanvasY + ballRadius);
      ctx.lineTo(110, ballCanvasY + ballRadius + arrowLength);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(110, ballCanvasY + ballRadius + arrowLength);
      ctx.lineTo(105, ballCanvasY + ballRadius + arrowLength - 8);
      ctx.lineTo(115, ballCanvasY + ballRadius + arrowLength - 8);
      ctx.fill();
    }

    // Impact effect
    if (ballY >= height) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
      ctx.beginPath();
      ctx.arc(110, heightCanvas - 30, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.roundRect(150, 10, 180, 90, 8);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`${t.time}: ${time.toFixed(2)} ${t.seconds}`, 160, 30);
    ctx.fillText(`${t.currentHeight}: ${(height - ballY).toFixed(1)} ${t.meters}`, 160, 50);
    ctx.fillText(`${t.velocity}: ${velocity.toFixed(1)} ${t.mps}`, 160, 70);
    ctx.fillText(`${t.fallTime}: ${totalFallTime.toFixed(2)} ${t.seconds}`, 160, 90);

    // Planet name
    ctx.fillStyle = planet.color;
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`${planet.emoji} ${language === "ar" ? planet.nameAr : planet.nameEn}`, 160, 110);
  }, [height, ballY, velocity, time, totalFallTime, planet, selectedPlanet, language, t]);

  // Draw comparison chart
  const drawChart = useCallback(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const heightCanvas = canvas.height;
    const padding = { left: 80, right: 20, top: 30, bottom: 50 };

    // Clear
    ctx.clearRect(0, 0, width, heightCanvas);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, heightCanvas);

    // Calculate fall times for all planets
    const planetKeys = Object.keys(planets) as PlanetKey[];
    const fallTimes = planetKeys.map(key => ({
      key,
      time: calculateFallTime(height, planets[key].gravity),
      planet: planets[key]
    }));

    const maxTime = Math.max(...fallTimes.map(f => f.time));
    const barWidth = (width - padding.left - padding.right) / planetKeys.length - 10;

    // Draw bars
    fallTimes.forEach((data, i) => {
      const x = padding.left + i * (barWidth + 10) + 5;
      const barHeight = (data.time / maxTime) * (heightCanvas - padding.top - padding.bottom);
      const y = heightCanvas - padding.bottom - barHeight;

      // Bar
      ctx.fillStyle = data.key === selectedPlanet ? data.planet.color : `${data.planet.color}80`;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();

      // Time label
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${data.time.toFixed(2)}s`, x + barWidth / 2, y - 5);

      // Planet emoji
      ctx.font = "14px system-ui";
      ctx.fillText(data.planet.emoji, x + barWidth / 2, heightCanvas - padding.bottom + 20);

      // Planet name
      ctx.fillStyle = "#64748b";
      ctx.font = "9px system-ui";
      const name = language === "ar" ? data.planet.nameAr : data.planet.nameEn;
      ctx.fillText(name.substring(0, 6), x + barWidth / 2, heightCanvas - padding.bottom + 35);
    });

    // Y-axis label
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(20, heightCanvas / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(language === "ar" ? "زمن السقوط (ث)" : "Fall Time (s)", 0, 0);
    ctx.restore();
  }, [height, selectedPlanet, calculateFallTime, language]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const startTime = Date.now() - time * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      if (elapsed >= totalFallTime) {
        setTime(totalFallTime);
        setBallY(height);
        setVelocity(g * totalFallTime);
        setIsRunning(false);
        return;
      }

      const newY = 0.5 * g * elapsed * elapsed;
      const newV = g * elapsed;

      setTime(elapsed);
      setBallY(Math.min(newY, height));
      setVelocity(newV);

      // Add data point
      if (dataPoints.length === 0 || elapsed - dataPoints[dataPoints.length - 1].time >= 0.1) {
        setDataPoints(prev => [...prev, {
          time: elapsed,
          velocity: newV,
          height: height - newY
        }]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, g, height, totalFallTime, time, dataPoints]);

  // Draw
  useEffect(() => {
    drawCanvas();
    drawChart();
  }, [drawCanvas, drawChart]);

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setBallY(0);
    setVelocity(0);
    setDataPoints([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Calculate weight on planet (assuming 70kg person)
  const earthWeight = 70 * 9.81; // Newtons
  const planetWeight = 70 * g;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Planet Selection */}
        <div className="space-y-3">
          <label className="font-medium flex items-center gap-2">
            <Rocket className="w-4 h-4 text-violet-500" />
            {t.selectPlanet}
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(planets) as PlanetKey[]).map((key) => (
              <Button
                key={key}
                variant={selectedPlanet === key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedPlanet(key);
                  handleReset();
                }}
                className={selectedPlanet === key ? "bg-violet-500 hover:bg-violet-600" : ""}
              >
                {planets[key].emoji} {language === "ar" ? planets[key].nameAr : planets[key].nameEn}
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.height}</label>
              <Badge variant="secondary">{height} {t.meters}</Badge>
            </div>
            <Slider
              value={[height]}
              onValueChange={([value]) => { setHeight(value); handleReset(); }}
              min={10}
              max={100}
              step={5}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500" />
                {t.gravity}
              </label>
              <Badge variant="secondary" style={{ backgroundColor: `${planet.color}20`, color: planet.color }}>
                {g.toFixed(2)} {t.ms2}
              </Badge>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              {language === "ar" 
                ? `الجاذبية على ${planet.nameAr} = ${planet.gravity} م/ث²`
                : `Gravity on ${planet.nameEn} = ${planet.gravity} m/s²`
              }
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-violet-500 hover:bg-violet-600"}
            disabled={ballY >= height}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
          <code className="text-sm font-mono">{t.formula}</code>
        </div>

        {/* Animation Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={250} className="w-full" />
        </div>

        {/* Comparison Chart */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Timer className="w-4 h-4 text-violet-500" />
              {t.chart}
            </h3>
          </div>
          <canvas ref={chartCanvasRef} width={600} height={180} className="w-full" />
        </div>

        {/* Weight Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400">{t.yourWeightOnEarth}</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{earthWeight.toFixed(1)} N</div>
            <div className="text-xs text-blue-500">(70 {t.kg})</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: `${planet.color}20`, borderColor: `${planet.color}50` }}>
            <div className="text-sm" style={{ color: planet.color }}>{t.yourWeight} {language === "ar" ? planet.nameAr : planet.nameEn}</div>
            <div className="text-2xl font-bold" style={{ color: planet.color }}>{planetWeight.toFixed(1)} N</div>
            <div className="text-xs" style={{ color: planet.color }}>(70 {t.kg})</div>
          </div>
        </div>

        {/* Impact info */}
        {ballY >= height && (
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💥</span>
              <span className="font-bold text-red-700 dark:text-red-300">{t.impact}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">{t.impactSpeed}:</span>
                <span className="font-bold ml-2">{velocity.toFixed(2)} {t.mps}</span>
              </div>
              <div>
                <span className="text-slate-500">{t.fallTime}:</span>
                <span className="font-bold ml-2">{totalFallTime.toFixed(2)} {t.seconds}</span>
              </div>
            </div>
          </div>
        )}

        {/* Physics Explanation */}
        <div className="p-4 bg-violet-50 dark:bg-violet-950 rounded-lg border border-violet-200 dark:border-violet-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-violet-500" />
            <span className="font-bold text-violet-700 dark:text-violet-300">{t.physicsExplanation}</span>
          </div>
          <p className="text-violet-600 dark:text-violet-400 text-sm">{t.gravityDifference}</p>
        </div>
      </CardContent>
    </Card>
  );
}
