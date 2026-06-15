"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Music, Speaker, Gauge, Activity } from "lucide-react";

interface ResonanceSimulatorProps {
  language: "ar" | "en";
}

export function ResonanceSimulator({ language }: ResonanceSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resonanceCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [naturalFrequency, setNaturalFrequency] = useState(2);
  const [drivingFrequency, setDrivingFrequency] = useState(2);
  const [damping, setDamping] = useState(0.1);
  const [drivingAmplitude, setDrivingAmplitude] = useState(30);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الرنين الصوتي",
      description: "استكشف ظاهرة الرنين والاهتزاز القسري",
      naturalFrequency: "التردد الطبيعي",
      drivingFrequency: "تردد القوة المؤثرة",
      damping: "معامل التخميد",
      drivingAmplitude: "سعة القوة المؤثرة",
      pause: "إيقاف",
      play: "تشغيل",
      reset: "إعادة",
      hz: "هرتز",
      amplitude: "السعة",
      resonance: "رنين!",
      nearResonance: "قريب من الرنين",
      offResonance: "بعيد عن الرنين",
      frequencyRatio: "نسبة الترددات",
      responseAmplitude: "سعة الاستجابة",
      phaseShift: "إزاحة الطور",
      explanation: "التفسير الفيزيائي",
      resonanceExp: "عندما يساوي تردد القوة المؤثرة التردد الطبيعي للنظام، يحدث الرنين وتكون السعة أقصى ما يمكن.",
      dampingExp: "التخميد يقلل من سعة الرنين ويجعل الاستجابة أكثر اتساعاً ترددياً.",
      qualityFactor: "معامل الجودة (Q)",
      bandwidth: "عرض النطاق",
      formula: "A = F₀ / √[(ω₀² - ω²)² + (bω)²]",
      setResonance: "ضبط الرنين",
    },
    en: {
      title: "Acoustic Resonance Simulator",
      description: "Explore resonance and forced oscillation",
      naturalFrequency: "Natural Frequency",
      drivingFrequency: "Driving Frequency",
      damping: "Damping Coefficient",
      drivingAmplitude: "Driving Amplitude",
      pause: "Pause",
      play: "Play",
      reset: "Reset",
      hz: "Hz",
      amplitude: "Amplitude",
      resonance: "Resonance!",
      nearResonance: "Near Resonance",
      offResonance: "Off Resonance",
      frequencyRatio: "Frequency Ratio",
      responseAmplitude: "Response Amplitude",
      phaseShift: "Phase Shift",
      explanation: "Physical Explanation",
      resonanceExp: "When driving frequency equals natural frequency, resonance occurs and amplitude is maximized.",
      dampingExp: "Damping reduces resonance amplitude and broadens the frequency response.",
      qualityFactor: "Quality Factor (Q)",
      bandwidth: "Bandwidth",
      formula: "A = F₀ / √[(ω₀² - ω²)² + (bω)²]",
      setResonance: "Set Resonance",
    },
  };

  const t = texts[language];

  // Calculate response amplitude
  const calculateResponseAmplitude = useCallback((fDrive: number, fNatural: number, damp: number, amp: number) => {
    const omega0 = fNatural * 2 * Math.PI;
    const omega = fDrive * 2 * Math.PI;
    const b = damp * 2;
    
    if (omega0 === 0) return 0;
    
    const denominator = Math.sqrt(
      Math.pow(omega0 * omega0 - omega * omega, 2) + Math.pow(b * omega, 2)
    );
    
    return amp * (omega0 * omega0) / denominator;
  }, []);

  const responseAmplitude = calculateResponseAmplitude(drivingFrequency, naturalFrequency, damping, drivingAmplitude);

  // Calculate phase shift
  const calculatePhaseShift = useCallback((fDrive: number, fNatural: number, damp: number) => {
    const omega0 = fNatural * 2 * Math.PI;
    const omega = fDrive * 2 * Math.PI;
    const b = damp * 2;
    
    if (omega0 === 0) return 0;
    
    return Math.atan2(b * omega, omega0 * omega0 - omega * omega);
  }, []);

  const phaseShift = calculatePhaseShift(drivingFrequency, naturalFrequency, damping);

  // Quality factor
  const qualityFactor = damping > 0 ? naturalFrequency / (2 * damping) : Infinity;

  // Check resonance condition
  const getResonanceState = () => {
    const ratio = drivingFrequency / naturalFrequency;
    if (Math.abs(ratio - 1) < 0.1) return "resonance";
    if (Math.abs(ratio - 1) < 0.3) return "near";
    return "off";
  };

  const resonanceState = getResonanceState();

  // Draw main oscillation canvas
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

    // Center line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw driving force (small oscillation)
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += 2) {
      const phase = (x / 50) * 2 * Math.PI * drivingFrequency - time * drivingFrequency * 2 * Math.PI;
      const y = centerY - drivingAmplitude * 0.3 * Math.sin(phase);
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw response oscillation
    const clampedAmplitude = Math.min(responseAmplitude, 100);
    
    ctx.strokeStyle = resonanceState === "resonance" ? "#22c55e" : 
                       resonanceState === "near" ? "#f59e0b" : "#8b5cf6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += 2) {
      const phase = (x / 50) * 2 * Math.PI * drivingFrequency - time * drivingFrequency * 2 * Math.PI - phaseShift;
      const y = centerY - clampedAmplitude * Math.sin(phase);
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw amplitude envelope
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY - clampedAmplitude);
    ctx.lineTo(width, centerY - clampedAmplitude);
    ctx.moveTo(0, centerY + clampedAmplitude);
    ctx.lineTo(width, centerY + clampedAmplitude);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    
    ctx.fillStyle = "#3b82f6";
    ctx.fillText(language === "ar" ? "القوة المؤثرة" : "Driving Force", 10, 20);
    
    ctx.fillStyle = resonanceState === "resonance" ? "#22c55e" : 
                    resonanceState === "near" ? "#f59e0b" : "#8b5cf6";
    ctx.fillText(language === "ar" ? "الاستجابة" : "Response", 10, 40);

    // Resonance indicator
    if (resonanceState === "resonance") {
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("⚡ " + t.resonance + " ⚡", width / 2, height - 20);
    }

  }, [drivingFrequency, naturalFrequency, drivingAmplitude, responseAmplitude, phaseShift, time, resonanceState, language, t]);

  // Draw resonance curve
  const drawResonanceCurve = useCallback(() => {
    const canvas = resonanceCanvasRef.current;
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

    // Axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, height - 30);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(40, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? "نسبة التردد (ω/ω₀)" : "Frequency Ratio (ω/ω₀)", width / 2, height - 5);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(language === "ar" ? "السعة" : "Amplitude", 0, 0);
    ctx.restore();

    // Draw resonance curve
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const plotWidth = width - 60;
    const plotHeight = height - 50;

    for (let i = 0; i <= plotWidth; i++) {
      const ratio = (i / plotWidth) * 2.5 + 0.1;
      const fDrive = ratio * naturalFrequency;
      const amp = calculateResponseAmplitude(fDrive, naturalFrequency, damping, drivingAmplitude);
      const normalizedAmp = Math.min(amp / 100, 1);
      
      const x = 40 + i;
      const y = height - 30 - normalizedAmp * plotHeight;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Mark current position
    const currentRatio = drivingFrequency / naturalFrequency;
    const currentX = 40 + (currentRatio / 2.5) * plotWidth;
    const normalizedCurrentAmp = Math.min(responseAmplitude / 100, 1);
    const currentY = height - 30 - normalizedCurrentAmp * plotHeight;

    // Vertical line at current position
    ctx.strokeStyle = resonanceState === "resonance" ? "#22c55e" : 
                       resonanceState === "near" ? "#f59e0b" : "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(currentX, height - 30);
    ctx.lineTo(currentX, 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current point
    ctx.fillStyle = resonanceState === "resonance" ? "#22c55e" : 
                    resonanceState === "near" ? "#f59e0b" : "#ef4444";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Mark resonance peak (ω/ω₀ = 1)
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const resonanceX = 40 + (1 / 2.5) * plotWidth;
    ctx.beginPath();
    ctx.moveTo(resonanceX, height - 30);
    ctx.lineTo(resonanceX, 10);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("1.0", resonanceX, height - 18);

    // X-axis tick marks
    for (let r = 0.5; r <= 2.5; r += 0.5) {
      const x = 40 + (r / 2.5) * plotWidth;
      ctx.fillStyle = "#64748b";
      ctx.fillText(r.toFixed(1), x, height - 18);
    }

  }, [naturalFrequency, damping, drivingAmplitude, drivingFrequency, responseAmplitude, resonanceState, calculateResponseAmplitude, language]);

  useEffect(() => {
    drawCanvas();
    drawResonanceCurve();
  }, [drawCanvas, drawResonanceCurve]);

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

  const setToResonance = () => {
    setDrivingFrequency(naturalFrequency);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Speaker className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-emerald-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Quick Resonance Button */}
        <Button
          onClick={setToResonance}
          className="w-full bg-emerald-500 hover:bg-emerald-600"
        >
          <Music className="w-4 h-4 mr-2" />
          {t.setResonance}
        </Button>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.naturalFrequency}</label>
              <Badge variant="secondary">{naturalFrequency.toFixed(1)} {t.hz}</Badge>
            </div>
            <Slider
              value={[naturalFrequency]}
              onValueChange={([value]) => setNaturalFrequency(value)}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.drivingFrequency}</label>
              <Badge variant="secondary">{drivingFrequency.toFixed(1)} {t.hz}</Badge>
            </div>
            <Slider
              value={[drivingFrequency]}
              onValueChange={([value]) => setDrivingFrequency(value)}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.damping}</label>
              <Badge variant="secondary">{damping.toFixed(2)}</Badge>
            </div>
            <Slider
              value={[damping]}
              onValueChange={([value]) => setDamping(value)}
              min={0.01}
              max={0.5}
              step={0.01}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.drivingAmplitude}</label>
              <Badge variant="secondary">{drivingAmplitude}</Badge>
            </div>
            <Slider
              value={[drivingAmplitude]}
              onValueChange={([value]) => setDrivingAmplitude(value)}
              min={10}
              max={50}
              step={5}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.play}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Main Oscillation Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={700} height={200} className="w-full" />
        </div>

        {/* Resonance Curve Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={resonanceCanvasRef} width={700} height={150} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg text-center ${
            resonanceState === "resonance" ? "bg-green-50 dark:bg-green-950" :
            resonanceState === "near" ? "bg-amber-50 dark:bg-amber-950" :
            "bg-slate-50 dark:bg-slate-800"
          }`}>
            <p className="text-sm text-slate-500">{language === "ar" ? "الحالة" : "State"}</p>
            <p className={`text-lg font-bold ${
              resonanceState === "resonance" ? "text-green-600" :
              resonanceState === "near" ? "text-amber-600" :
              "text-slate-600"
            }`}>
              {resonanceState === "resonance" ? t.resonance :
               resonanceState === "near" ? t.nearResonance :
               t.offResonance}
            </p>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.responseAmplitude}</p>
            <p className="text-xl font-bold text-violet-600">{Math.min(responseAmplitude, 100).toFixed(1)}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.phaseShift}</p>
            <p className="text-xl font-bold text-blue-600">{(phaseShift * 180 / Math.PI).toFixed(0)}°</p>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.qualityFactor}</p>
            <p className="text-xl font-bold text-teal-600">{isFinite(qualityFactor) ? qualityFactor.toFixed(1) : "∞"}</p>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
          <code className="text-sm font-mono">{t.formula}</code>
        </div>

        {/* Physical Explanation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            {t.resonanceExp}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t.dampingExp}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
