"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Waves, Car, Radio, ArrowRight } from "lucide-react";

interface DopplerSimulatorProps {
  language: "ar" | "en";
}

export function DopplerSimulator({ language }: DopplerSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [sourceSpeed, setSourceSpeed] = useState(50); // As percentage of wave speed
  const [waveSpeed, setWaveSpeed] = useState(100);
  const [frequency, setFrequency] = useState(2);
  const [showObserver, setShowObserver] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [observerPosition, setObserverPosition] = useState(0.7);

  const texts = {
    ar: {
      title: "محاكي تأثير دوبلر",
      description: "استكشف تغير التردد بسبب حركة المصدر",
      sourceSpeed: "سرعة المصدر",
      waveSpeed: "سرعة الموجة",
      frequency: "التردد الأصلي",
      showObserver: "عرض المراقب",
      pause: "إيقاف",
      play: "تشغيل",
      reset: "إعادة",
      hz: "هرتز",
      mps: "م/ث",
      observedFreqFront: "التردد الملاحظ (أمام)",
      observedFreqBack: "التردد الملاحظ (خلف)",
      wavelength: "الطول الموجي",
      source: "المصدر",
      observer: "المراقب",
      explanation: "التفسير الفيزيائي",
      dopplerExp: "عندما يقترب المصدر من المراقب، تنضغط الموجات ويزداد التردد الملاحظ. عندما يبتعد، تتباعد الموجات ويقل التردد.",
      formula: "f' = f × v/(v ± vs)",
      approaching: "اقتراب",
      receding: "ابتعاد",
      higherPitch: "صوت أعلى",
      lowerPitch: "صوت أقل",
      redShift: "انزياح أحمر",
      blueShift: "انزياح أزرق",
    },
    en: {
      title: "Doppler Effect Simulator",
      description: "Explore frequency shift due to source motion",
      sourceSpeed: "Source Speed",
      waveSpeed: "Wave Speed",
      frequency: "Original Frequency",
      showObserver: "Show Observer",
      pause: "Pause",
      play: "Play",
      reset: "Reset",
      hz: "Hz",
      mps: "m/s",
      observedFreqFront: "Observed Frequency (Front)",
      observedFreqBack: "Observed Frequency (Back)",
      wavelength: "Wavelength",
      source: "Source",
      observer: "Observer",
      explanation: "Physical Explanation",
      dopplerExp: "When the source approaches, waves compress and observed frequency increases. When receding, waves spread out and frequency decreases.",
      formula: "f' = f × v/(v ± vs)",
      approaching: "Approaching",
      receding: "Receding",
      higherPitch: "Higher Pitch",
      lowerPitch: "Lower Pitch",
      redShift: "Red Shift",
      blueShift: "Blue Shift",
    },
  };

  const t = texts[language];

  // Calculate Doppler-shifted frequencies
  const actualSourceSpeed = (sourceSpeed / 100) * waveSpeed;
  
  // Frequency observed in front of moving source (approaching)
  const observedFreqFront = frequency * waveSpeed / (waveSpeed - actualSourceSpeed);
  
  // Frequency observed behind moving source (receding)
  const observedFreqBack = frequency * waveSpeed / (waveSpeed + actualSourceSpeed);

  // Wavelengths
  const wavelengthOriginal = waveSpeed / frequency;
  const wavelengthFront = waveSpeed / observedFreqFront;
  const wavelengthBack = waveSpeed / observedFreqBack;

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    for (let y = 0; y <= height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    for (let x = 0; x <= width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Calculate source position (moving left to right)
    const cycleTime = width / (actualSourceSpeed * 0.5 + 0.1);
    const sourceX = ((time * actualSourceSpeed * 0.5) % width);
    
    // Draw wavefronts
    const numWaves = 15;
    const waveInterval = 1 / frequency;
    
    for (let i = 0; i < numWaves; i++) {
      const waveTime = time - i * waveInterval;
      if (waveTime < 0) continue;
      
      // Position where this wave was emitted
      const emitX = ((waveTime * actualSourceSpeed * 0.5) % width);
      
      // Radius = wave speed × time since emission
      const radius = waveSpeed * 0.5 * (time - waveTime);
      
      // Draw circle
      const alpha = Math.max(0.1, 1 - i / numWaves);
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(emitX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw source
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(sourceX, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Source icon
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("S", sourceX, centerY);

    // Draw velocity arrow
    if (actualSourceSpeed > 0) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(sourceX + 25, centerY);
      ctx.lineTo(sourceX + 45, centerY - 5);
      ctx.lineTo(sourceX + 45, centerY + 5);
      ctx.fill();
    }

    // Draw observer
    if (showObserver) {
      const obsX = width * observerPosition;
      
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(obsX, centerY, 12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#fff";
      ctx.fillText("O", obsX, centerY);
      
      // Calculate observed frequency at observer position
      const isApproaching = obsX > sourceX;
      const observedFreq = isApproaching ? observedFreqFront : observedFreqBack;
      
      // Show frequency label near observer
      ctx.fillStyle = isApproaching ? "#3b82f6" : "#ef4444";
      ctx.font = "11px system-ui";
      ctx.fillText(`${observedFreq.toFixed(1)} Hz`, obsX, centerY - 25);
    }

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    
    // Source label
    ctx.fillStyle = "#ef4444";
    ctx.fillText(t.source, 10, 20);
    
    // Wavelength indicators
    ctx.fillStyle = "#3b82f6";
    ctx.font = "11px system-ui";
    
    // Front wavelength (compressed)
    ctx.fillText(`${language === "ar" ? "أمام" : "Front"}: λ = ${wavelengthFront.toFixed(1)}`, 10, height - 40);
    
    // Back wavelength (stretched)
    ctx.fillText(`${language === "ar" ? "خلف" : "Back"}: λ = ${wavelengthBack.toFixed(1)}`, 10, height - 20);

    // Direction labels
    if (actualSourceSpeed > 0) {
      ctx.fillStyle = "#22c55e";
      ctx.font = "10px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(t.approaching, width - 10, 20);
      ctx.fillStyle = "#ef4444";
      ctx.fillText(t.receding, 10, 40);
    }

  }, [sourceSpeed, waveSpeed, frequency, time, showObserver, observerPosition, actualSourceSpeed, observedFreqFront, observedFreqBack, wavelengthFront, wavelengthBack, language, t]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const startTime = Date.now() - time * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTime(elapsed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, time]);

  const handleReset = () => {
    setTime(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.sourceSpeed}</label>
              <Badge variant="secondary">{sourceSpeed}%</Badge>
            </div>
            <Slider
              value={[sourceSpeed]}
              onValueChange={([value]) => setSourceSpeed(value)}
              min={0}
              max={90}
              step={5}
            />
            <p className="text-xs text-slate-500">
              {actualSourceSpeed.toFixed(0)} {t.mps}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.waveSpeed}</label>
              <Badge variant="secondary">{waveSpeed} {t.mps}</Badge>
            </div>
            <Slider
              value={[waveSpeed]}
              onValueChange={([value]) => setWaveSpeed(value)}
              min={50}
              max={200}
              step={10}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.frequency}</label>
              <Badge variant="secondary">{frequency} {t.hz}</Badge>
            </div>
            <Slider
              value={[frequency]}
              onValueChange={([value]) => setFrequency(value)}
              min={0.5}
              max={5}
              step={0.5}
            />
          </div>
        </div>

        {/* Observer position */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{language === "ar" ? "موضع المراقب" : "Observer Position"}</label>
            <Badge variant="secondary">{Math.round(observerPosition * 100)}%</Badge>
          </div>
          <Slider
            value={[observerPosition]}
            onValueChange={([value]) => setObserverPosition(value)}
            min={0.1}
            max={0.9}
            step={0.1}
          />
        </div>

        {/* Show observer toggle */}
        <div className="flex items-center gap-3">
          <Switch checked={showObserver} onCheckedChange={setShowObserver} />
          <label className="text-sm">{t.showObserver}</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-cyan-500 hover:bg-cyan-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.play}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={700} height={280} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.frequency}</p>
            <p className="text-xl font-bold text-cyan-600">{frequency} {t.hz}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.observedFreqFront}</p>
            <p className="text-xl font-bold text-blue-600">
              {isFinite(observedFreqFront) ? observedFreqFront.toFixed(1) : "∞"} {t.hz}
            </p>
            <p className="text-xs text-blue-500">{t.higherPitch}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.observedFreqBack}</p>
            <p className="text-xl font-bold text-red-600">{observedFreqBack.toFixed(1)} {t.hz}</p>
            <p className="text-xs text-red-500">{t.lowerPitch}</p>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.wavelength}</p>
            <p className="text-xl font-bold text-teal-600">{wavelengthOriginal.toFixed(1)}</p>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
          <code className="text-sm font-mono">{t.formula}</code>
        </div>

        {/* Physical Explanation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Radio className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            {t.dopplerExp}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <ArrowRight className="w-4 h-4" />
              {t.approaching}: {t.blueShift} / {t.higherPitch}
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <ArrowRight className="w-4 h-4 rotate-180" />
              {t.receding}: {t.redShift} / {t.lowerPitch}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
