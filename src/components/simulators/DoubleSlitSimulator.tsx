"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Zap, Ruler, Waves, Split } from "lucide-react";

interface DoubleSlitSimulatorProps {
  language: "ar" | "en";
}

export function DoubleSlitSimulator({ language }: DoubleSlitSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [wavelength, setWavelength] = useState(550); // nm
  const [slitSeparation, setSlitSeparation] = useState(0.5); // mm
  const [slitWidth, setSlitWidth] = useState(0.1); // mm
  const [screenDistance, setScreenDistance] = useState(1); // meters
  const [showInterference, setShowInterference] = useState(true);
  const [showIntensity, setShowIntensity] = useState(true);
  const [animateWave, setAnimateWave] = useState(false);
  const [time, setTime] = useState(0);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي تجربة الشق المزدوج",
      description: "استكشف التداخل البناء والهدام للضوء",
      wavelength: "الطول الموجي",
      slitSeparation: "المسافة بين الشقين",
      slitWidth: "عرض الشق",
      screenDistance: "بعد الشاشة",
      fringeSpacing: "تباعد الأهداب",
      constructive: "تداخل بناء",
      destructive: "تداخل هدام",
      showInterference: "عرض نمط التداخل",
      showIntensity: "رسم بياني للشدة",
      reset: "إعادة",
      nanometer: "نانومتر",
      millimeter: "ملم",
      meter: "متر",
      brightFringe: "هدب مضيء",
      darkFringe: "هدب مظلم",
      physicsNote: "تجربة الشق المزدوج تثبت الطبيعة الموجية للضوء. عندما يمر الضوء عبر شقين، تتداخل الموجات منتجة نمطاً من خطوط مضيئة ومظلمة.",
      formula: "d × sin(θ) = m × λ",
      formulaDesc: "شرط التداخل البناء: المسافة بين الشقين × جيب الزاوية = رقم الهدب × الطول الموجي",
      youngsExperiment: "تجربة يونغ",
      pathDifference: "فرق المسار",
    },
    en: {
      title: "Double-Slit Experiment Simulator",
      description: "Explore constructive and destructive interference",
      wavelength: "Wavelength",
      slitSeparation: "Slit Separation",
      slitWidth: "Slit Width",
      screenDistance: "Screen Distance",
      fringeSpacing: "Fringe Spacing",
      constructive: "Constructive Interference",
      destructive: "Destructive Interference",
      showInterference: "Show Interference Pattern",
      showIntensity: "Show Intensity Graph",
      reset: "Reset",
      nanometer: "nm",
      millimeter: "mm",
      meter: "m",
      brightFringe: "Bright Fringe",
      darkFringe: "Dark Fringe",
      physicsNote: "The double-slit experiment proves the wave nature of light. When light passes through two slits, the waves interfere producing a pattern of bright and dark lines.",
      formula: "d × sin(θ) = m × λ",
      formulaDesc: "Constructive interference: slit separation × sin(angle) = fringe order × wavelength",
      youngsExperiment: "Young's Experiment",
      pathDifference: "Path Difference",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Convert units
  const wavelengthM = wavelength * 1e-9; // nm to meters
  const slitSeparationM = slitSeparation * 1e-3; // mm to meters
  const slitWidthM = slitWidth * 1e-3; // mm to meters

  // Calculate fringe spacing: Δy = λD/d
  const fringeSpacing = (wavelengthM * screenDistance) / slitSeparationM * 1000; // in mm

  // Get color for wavelength
  const getWavelengthColor = (wl: number) => {
    if (wl >= 380 && wl < 450) return "#8b5cf6";
    if (wl >= 450 && wl < 495) return "#3b82f6";
    if (wl >= 495 && wl < 570) return "#22c55e";
    if (wl >= 570 && wl < 590) return "#eab308";
    if (wl >= 590 && wl < 620) return "#f97316";
    if (wl >= 620 && wl < 750) return "#ef4444";
    return "#ffffff";
  };

  const lightColor = getWavelengthColor(wavelength);

  // Calculate combined intensity (interference + diffraction)
  const calculateIntensity = (y: number) => {
    const theta = Math.atan(y / (screenDistance * 1000));

    // Interference factor: cos²(πdy/λD)
    const interferenceArg = (Math.PI * slitSeparationM * Math.sin(theta)) / wavelengthM;
    const interference = Math.pow(Math.cos(interferenceArg), 2);

    // Diffraction factor: sinc²(πay/λD)
    const diffractionArg = (Math.PI * slitWidthM * Math.sin(theta)) / wavelengthM;
    const diffraction = diffractionArg === 0 ? 1 : Math.pow(Math.sin(diffractionArg) / diffractionArg, 2);

    return interference * diffraction;
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

    const barrierX = 120;
    const screenX = width - 150;
    const centerY = height / 2;
    const slitPixelSeparation = 30;
    const slitPixelWidth = 4;

    // Draw incident wave
    const phase = animateWave ? time * 5 : 0;
    const waveSpacing = 12;

    for (let w = 0; w < 8; w++) {
      const waveY = centerY - 4 * waveSpacing + w * waveSpacing;

      ctx.strokeStyle = lightColor + "60";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 20; x < barrierX; x += 2) {
        const y = waveY + 4 * Math.sin((x / 15) + phase + w * 0.3);
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw barrier with two slits
    ctx.fillStyle = "#374151";
    ctx.fillRect(barrierX - 8, 0, 16, centerY - slitPixelSeparation / 2 - slitPixelWidth);
    ctx.fillRect(barrierX - 8, centerY - slitPixelSeparation / 2 + slitPixelWidth, 16, slitPixelSeparation - slitPixelWidth * 2);
    ctx.fillRect(barrierX - 8, centerY + slitPixelSeparation / 2 + slitPixelWidth, 16, height - centerY - slitPixelSeparation / 2 - slitPixelWidth);

    // Highlight slits
    ctx.fillStyle = lightColor + "40";
    ctx.fillRect(barrierX - 8, centerY - slitPixelSeparation / 2 - slitPixelWidth, 16, slitPixelWidth * 2);
    ctx.fillRect(barrierX - 8, centerY + slitPixelSeparation / 2 - slitPixelWidth, 16, slitPixelWidth * 2);

    // Draw diffracted waves from both slits
    if (showInterference) {
      const numWaves = 20;

      for (let i = 0; i < numWaves; i++) {
        const angle1 = -Math.PI / 2 + (Math.PI * i) / numWaves;
        const angle2 = -Math.PI / 2 + (Math.PI * i) / numWaves;

        // From top slit
        ctx.strokeStyle = lightColor + "40";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(barrierX + 8, centerY - slitPixelSeparation / 2);
        for (let d = 0; d < screenX - barrierX - 30; d += 3) {
          const x = barrierX + 8 + d * Math.cos(angle1);
          const y = centerY - slitPixelSeparation / 2 + d * Math.sin(angle1);
          const waveY = y + 2 * Math.sin((d / 10) + phase);
          if (d === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();

        // From bottom slit
        ctx.beginPath();
        ctx.moveTo(barrierX + 8, centerY + slitPixelSeparation / 2);
        for (let d = 0; d < screenX - barrierX - 30; d += 3) {
          const x = barrierX + 8 + d * Math.cos(angle2);
          const y = centerY + slitPixelSeparation / 2 + d * Math.sin(angle2);
          const waveY = y + 2 * Math.sin((d / 10) + phase + Math.PI);
          if (d === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    }

    // Draw screen
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(screenX, 0, 100, height);

    // Draw interference pattern on screen
    for (let y = 0; y < height; y++) {
      const relY = (y - centerY) / 50;
      const intensity = calculateIntensity(relY);
      const alpha = Math.floor(intensity * 255).toString(16).padStart(2, '0');

      ctx.fillStyle = lightColor + alpha;
      ctx.fillRect(screenX + 10, y, 80, 1);
    }

    // Draw intensity graph
    if (showIntensity) {
      const graphHeight = 80;
      const graphY = height - 100;

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(barrierX + 30, graphY, screenX - barrierX - 70, graphHeight);

      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const graphWidth = screenX - barrierX - 70;
      for (let i = 0; i <= graphWidth; i++) {
        const relY = ((i / graphWidth) - 0.5) * 200;
        const intensity = calculateIntensity(relY / 50);
        const plotY = graphY + graphHeight - intensity * graphHeight;

        if (i === 0) ctx.moveTo(barrierX + 30 + i, plotY);
        else ctx.lineTo(barrierX + 30 + i, plotY);
      }
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t.brightFringe, barrierX + 30 + graphWidth / 2, graphY - 5);

      // Mark fringe positions
      const fringePixelSpacing = fringeSpacing * 15;
      for (let m = -3; m <= 3; m++) {
        if (m === 0) continue;
        const fringeX = barrierX + 30 + graphWidth / 2 + m * fringePixelSpacing / 5;
        if (fringeX > barrierX + 30 && fringeX < screenX - 40) {
          ctx.fillStyle = m % 2 === 0 ? lightColor : "#ef4444";
          ctx.beginPath();
          ctx.arc(fringeX, graphY + graphHeight + 10, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(`m=${m}`, fringeX, graphY + graphHeight + 25);
        }
      }
    }

    // Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(isRTL ? "الحاجز" : "Barrier", barrierX, height - 10);
    ctx.fillText(isRTL ? "الشاشة" : "Screen", screenX + 50, height - 10);

    // Slit labels
    ctx.fillStyle = lightColor;
    ctx.font = "10px system-ui";
    ctx.fillText("S₁", barrierX + 25, centerY - slitPixelSeparation / 2);
    ctx.fillText("S₂", barrierX + 25, centerY + slitPixelSeparation / 2 + 4);

    // Path difference illustration
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(barrierX + 8, centerY - slitPixelSeparation / 2);
    ctx.lineTo(screenX - 30, centerY);
    ctx.moveTo(barrierX + 8, centerY + slitPixelSeparation / 2);
    ctx.lineTo(screenX - 30, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Δy label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 11px system-ui";
    ctx.fillText("Δy", barrierX + (screenX - barrierX) / 2, centerY + slitPixelSeparation / 2 + 15);

  }, [wavelength, slitSeparation, slitWidth, screenDistance, showInterference, showIntensity, animateWave, time, lightColor, fringeSpacing, t, isRTL]);

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
    setSlitSeparation(0.5);
    setSlitWidth(0.1);
    setScreenDistance(1);
    setShowInterference(true);
    setShowIntensity(true);
    setAnimateWave(false);
    setTime(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Split className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-emerald-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-sm">{t.wavelength}</label>
              <Badge variant="secondary" className="text-xs" style={{ backgroundColor: lightColor + "20", color: lightColor }}>
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
            <div className="h-2 rounded-full overflow-hidden" style={{
              background: "linear-gradient(to right, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444)"
            }}>
              <div
                className="w-1 h-full bg-white"
                style={{ marginLeft: `${((wavelength - 380) / 320) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-sm">{t.slitSeparation}</label>
              <Badge variant="secondary" className="text-xs">{slitSeparation} {t.millimeter}</Badge>
            </div>
            <Slider
              value={[slitSeparation]}
              onValueChange={([value]) => setSlitSeparation(value)}
              min={0.1}
              max={2}
              step={0.05}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-sm">{t.slitWidth}</label>
              <Badge variant="secondary" className="text-xs">{slitWidth} {t.millimeter}</Badge>
            </div>
            <Slider
              value={[slitWidth]}
              onValueChange={([value]) => setSlitWidth(value)}
              min={0.02}
              max={0.5}
              step={0.02}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-sm">{t.screenDistance}</label>
              <Badge variant="secondary" className="text-xs">{screenDistance} {t.meter}</Badge>
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
            <Switch checked={showInterference} onCheckedChange={setShowInterference} />
            <label className="text-sm">{t.showInterference}</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={showIntensity} onCheckedChange={setShowIntensity} />
            <label className="text-sm">{t.showIntensity}</label>
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
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-4 rounded-lg">
          <h4 className="font-bold text-emerald-700 mb-1">{t.youngsExperiment}</h4>
          <code className="text-lg font-mono">{t.formula}</code>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{t.formulaDesc}</p>
        </div>

        {/* Canvas */}
        <div className="border-2 border-emerald-200 rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={380} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.fringeSpacing}</p>
            <p className="text-xl font-bold text-emerald-600">{fringeSpacing.toFixed(2)} {t.millimeter}</p>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.constructive}</p>
            <p className="text-xl font-bold text-teal-600">{t.brightFringe}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.destructive}</p>
            <p className="text-xl font-bold text-red-600">{t.darkFringe}</p>
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
