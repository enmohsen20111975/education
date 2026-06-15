"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Zap, Ruler, Waves } from "lucide-react";

interface DiffractionSimulatorProps {
  language: "ar" | "en";
}

export function DiffractionSimulator({ language }: DiffractionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [wavelength, setWavelength] = useState(550); // nm
  const [slitWidth, setSlitWidth] = useState(10); // micrometers
  const [screenDistance, setScreenDistance] = useState(1); // meters
  const [showIntensityGraph, setShowIntensityGraph] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [animateWave, setAnimateWave] = useState(false);
  const [time, setTime] = useState(0);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي حيود الضوء",
      description: "استكشف حيود الضوء عند الشق الواحد",
      wavelength: "الطول الموجي",
      slitWidth: "عرض الشق",
      screenDistance: "بعد الشاشة",
      centralMaximum: "الحد الأقصى المركزي",
      firstMinimum: "أول حد أدنى",
      secondMinimum: "ثاني حد أدنى",
      diffractionAngle: "زاوية الحيود",
      showIntensityGraph: "رسم بياني للشدة",
      showRays: "عرض الأشعة",
      reset: "إعادة",
      nanometer: "نانومتر",
      micrometer: "ميكرومتر",
      meter: "متر",
      degrees: "درجة",
      intensity: "الشدة",
      position: "الموضع",
      physicsNote: "الحيود هو انحراج الموجات حول حواف العوائق. عندما يمر الضوء خلال شق ضيق، ينتشر ويشكل نمطاً من الحدود المضيئة والمظلمة على الشاشة.",
      formula: "a × sin(θ) = m × λ",
      formulaDesc: "شرط الحد الأدنى: عرض الشق × جيب الزاوية = رقم الحد × الطول الموجي",
      colorLabel: "اللون",
    },
    en: {
      title: "Light Diffraction Simulator",
      description: "Explore light diffraction through a single slit",
      wavelength: "Wavelength",
      slitWidth: "Slit Width",
      screenDistance: "Screen Distance",
      centralMaximum: "Central Maximum",
      firstMinimum: "First Minimum",
      secondMinimum: "Second Minimum",
      diffractionAngle: "Diffraction Angle",
      showIntensityGraph: "Show Intensity Graph",
      showRays: "Show Rays",
      reset: "Reset",
      nanometer: "nm",
      micrometer: "μm",
      meter: "m",
      degrees: "°",
      intensity: "Intensity",
      position: "Position",
      physicsNote: "Diffraction is the bending of waves around obstacles. When light passes through a narrow slit, it spreads out and forms a pattern of bright and dark fringes on a screen.",
      formula: "a × sin(θ) = m × λ",
      formulaDesc: "Minimum condition: slit width × sin(angle) = order × wavelength",
      colorLabel: "Color",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Convert units for calculations
  const wavelengthM = wavelength * 1e-9; // nm to meters
  const slitWidthM = slitWidth * 1e-6; // micrometers to meters

  // Calculate first minimum angle: sin(θ) = λ/a
  const calculateMinAngle = (order: number) => {
    const sinTheta = (order * wavelengthM) / slitWidthM;
    if (Math.abs(sinTheta) >= 1) return null;
    return Math.asin(sinTheta) * (180 / Math.PI);
  };

  const firstMinAngle = calculateMinAngle(1);
  const secondMinAngle = calculateMinAngle(2);

  // Calculate central maximum width on screen
  const centralMaxWidth = firstMinAngle ? 2 * screenDistance * Math.tan((firstMinAngle * Math.PI) / 180) * 1000 : 0; // in mm

  // Get color for wavelength
  const getWavelengthColor = (wl: number) => {
    if (wl >= 380 && wl < 450) return "#8b5cf6"; // Violet
    if (wl >= 450 && wl < 495) return "#3b82f6"; // Blue
    if (wl >= 495 && wl < 570) return "#22c55e"; // Green
    if (wl >= 570 && wl < 590) return "#eab308"; // Yellow
    if (wl >= 590 && wl < 620) return "#f97316"; // Orange
    if (wl >= 620 && wl < 750) return "#ef4444"; // Red
    return "#ffffff";
  };

  const lightColor = getWavelengthColor(wavelength);

  // Calculate intensity at position
  const calculateIntensity = (y: number) => {
    const theta = Math.atan(y / (screenDistance * 1000)); // y in mm, convert to m
    const beta = (Math.PI * slitWidthM * Math.sin(theta)) / wavelengthM;

    if (Math.abs(beta) < 0.001) return 1;
    return Math.pow(Math.sin(beta) / beta, 2);
  };

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
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    const slitX = 100;
    const screenX = width - 150;
    const centerY = height / 2;

    // Draw incident light waves
    if (showRays) {
      const waveSpacing = 15;
      const numWaves = 8;

      for (let i = 0; i < numWaves; i++) {
        const waveY = centerY - (numWaves / 2 - i) * waveSpacing;

        ctx.strokeStyle = lightColor + "80";
        ctx.lineWidth = 2;

        // Animated wave
        const phase = animateWave ? time * 5 : 0;
        ctx.beginPath();
        for (let x = 20; x < slitX; x += 2) {
          const y = waveY + 3 * Math.sin((x / 20) + phase + i * 0.5);
          if (x === 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Arrow showing light direction
      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.moveTo(slitX - 40, centerY);
      ctx.lineTo(slitX - 55, centerY - 8);
      ctx.lineTo(slitX - 55, centerY + 8);
      ctx.fill();
    }

    // Draw barrier with slit
    ctx.fillStyle = "#374151";
    ctx.fillRect(slitX - 10, 0, 20, centerY - slitWidth * 3);
    ctx.fillRect(slitX - 10, centerY + slitWidth * 3, 20, height - centerY - slitWidth * 3);

    // Slit opening
    ctx.fillStyle = lightColor + "40";
    ctx.fillRect(slitX - 10, centerY - slitWidth * 3, 20, slitWidth * 6);

    // Draw diffracted waves
    if (showRays) {
      const numRays = 15;
      const maxAngle = Math.PI / 2;

      for (let i = 0; i < numRays; i++) {
        const angle = -maxAngle + (2 * maxAngle * i) / (numRays - 1);
        const intensity = calculateIntensity(Math.tan(angle) * (screenX - slitX) / 10);

        if (intensity < 0.05) continue;

        ctx.strokeStyle = lightColor + Math.floor(intensity * 200).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;

        const phase = animateWave ? time * 5 : 0;
        ctx.beginPath();
        ctx.moveTo(slitX + 10, centerY);

        for (let d = 0; d < screenX - slitX - 20; d += 3) {
          const x = slitX + 10 + d * Math.cos(angle);
          const y = centerY + d * Math.sin(angle);
          const waveY = y + 3 * Math.sin((d / 15) + phase);
          if (d === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    }

    // Draw screen
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(screenX, 0, 100, height);

    // Draw diffraction pattern on screen
    for (let y = 0; y < height; y++) {
      const relY = y - centerY;
      const intensity = calculateIntensity(relY / 5);
      const alpha = Math.floor(intensity * 255).toString(16).padStart(2, '0');

      ctx.fillStyle = lightColor + alpha;
      ctx.fillRect(screenX + 10, y, 80, 1);
    }

    // Draw intensity graph
    if (showIntensityGraph) {
      const graphX = slitX + 50;
      const graphWidth = screenX - slitX - 100;
      const graphHeight = 60;

      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(graphX, height - 80, graphWidth, graphHeight);

      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i <= graphWidth; i++) {
        const relY = ((i / graphWidth) - 0.5) * height;
        const intensity = calculateIntensity(relY / 5);
        const graphY = height - 80 + graphHeight - intensity * graphHeight;

        if (i === 0) ctx.moveTo(graphX + i, graphY);
        else ctx.lineTo(graphX + i, graphY);
      }
      ctx.stroke();

      // Graph label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.intensity, graphX + graphWidth / 2, height - 85);
    }

    // Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(isRTL ? "الشق" : "Slit", slitX, height - 20);
    ctx.fillText(isRTL ? "الشاشة" : "Screen", screenX + 50, height - 20);

    // Draw angles
    if (firstMinAngle !== null && firstMinAngle < 45) {
      const angleRad = (firstMinAngle * Math.PI) / 180;
      const lineLength = 50;

      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(slitX + 10, centerY);
      ctx.lineTo(slitX + 10 + lineLength, centerY - lineLength * Math.tan(angleRad));
      ctx.stroke();
      ctx.setLineDash([]);

      // Angle arc
      ctx.strokeStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(slitX + 10, centerY, 30, 0, -angleRad, true);
      ctx.stroke();

      ctx.fillStyle = "#f59e0b";
      ctx.font = "11px system-ui";
      ctx.fillText(`θ₁ = ${firstMinAngle.toFixed(1)}${t.degrees}`, slitX + 60, centerY - 20);
    }

  }, [wavelength, slitWidth, screenDistance, showRays, showIntensityGraph, animateWave, time, lightColor, firstMinAngle, t, isRTL]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation loop
  useEffect(() => {
    if (!animateWave) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 0.1);
    }, 16);

    return () => clearInterval(interval);
  }, [animateWave]);

  // Reset
  const handleReset = () => {
    setWavelength(550);
    setSlitWidth(10);
    setScreenDistance(1);
    setShowRays(true);
    setShowIntensityGraph(true);
    setAnimateWave(false);
    setTime(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-indigo-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: lightColor }} />
                {t.wavelength}
              </label>
              <Badge variant="secondary" style={{ backgroundColor: lightColor + "20", color: lightColor }}>
                {wavelength} {t.nanometer}
              </Badge>
            </div>
            <Slider
              value={[wavelength]}
              onValueChange={([value]) => setWavelength(value)}
              min={380}
              max={700}
              step={10}
            />
            {/* Color spectrum */}
            <div className="h-2 rounded-full overflow-hidden" style={{
              background: "linear-gradient(to right, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444)"
            }}>
              <div
                className="w-1 h-full bg-white border-l border-r border-white"
                style={{ marginLeft: `${((wavelength - 380) / 320) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-indigo-500" />
                {t.slitWidth}
              </label>
              <Badge variant="secondary">{slitWidth} {t.micrometer}</Badge>
            </div>
            <Slider
              value={[slitWidth]}
              onValueChange={([value]) => setSlitWidth(value)}
              min={1}
              max={50}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.screenDistance}</label>
              <Badge variant="secondary">{screenDistance} {t.meter}</Badge>
            </div>
            <Slider
              value={[screenDistance]}
              onValueChange={([value]) => setScreenDistance(value)}
              min={0.5}
              max={3}
              step={0.1}
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Switch checked={showRays} onCheckedChange={setShowRays} />
            <label className="text-sm">{t.showRays}</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={showIntensityGraph} onCheckedChange={setShowIntensityGraph} />
            <label className="text-sm">{t.showIntensityGraph}</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={animateWave} onCheckedChange={setAnimateWave} />
            <label className="text-sm">{isRTL ? "تحريك الموجة" : "Animate Wave"}</label>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Formula */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 p-4 rounded-lg">
          <code className="text-lg font-mono">{t.formula}</code>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{t.formulaDesc}</p>
        </div>

        {/* Canvas */}
        <div className="border-2 border-indigo-200 rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={350} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.firstMinimum}</p>
            <p className="text-xl font-bold text-indigo-600">
              {firstMinAngle ? `${firstMinAngle.toFixed(2)}${t.degrees}` : (isRTL ? "غير محدد" : "N/A")}
            </p>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.secondMinimum}</p>
            <p className="text-xl font-bold text-violet-600">
              {secondMinAngle && secondMinAngle < 90 ? `${secondMinAngle.toFixed(2)}${t.degrees}` : (isRTL ? "غير محدد" : "N/A")}
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.centralMaximum}</p>
            <p className="text-xl font-bold text-purple-600">{centralMaxWidth.toFixed(1)} mm</p>
          </div>
          <div className="p-3 bg-pink-50 dark:bg-pink-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.colorLabel}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: lightColor }} />
              <span className="font-bold">{wavelength} nm</span>
            </div>
          </div>
        </div>

        {/* Physics Note */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">{t.physicsNote}</p>
        </div>
      </CardContent>
    </Card>
  );
}
