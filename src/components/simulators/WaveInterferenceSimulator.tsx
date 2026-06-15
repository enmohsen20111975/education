"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Waves, Combine, ArrowRightLeft } from "lucide-react";

interface WaveInterferenceSimulatorProps {
  language: "ar" | "en";
}

export function WaveInterferenceSimulator({ language }: WaveInterferenceSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State for two waves
  const [amplitude1, setAmplitude1] = useState(40);
  const [amplitude2, setAmplitude2] = useState(40);
  const [frequency1, setFrequency1] = useState(2);
  const [frequency2, setFrequency2] = useState(2);
  const [phase1, setPhase1] = useState(0);
  const [phase2, setPhase2] = useState(0);
  const [showIndividual, setShowIndividual] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);

  const texts = {
    ar: {
      title: "محاكي تداخل الموجات",
      description: "استكشف ظاهرة التداخل البنّاء والهدّام",
      amplitude1: "سعة الموجة 1",
      amplitude2: "سعة الموجة 2",
      frequency1: "تردد الموجة 1",
      frequency2: "تردد الموجة 2",
      phase1: "طور الموجة 1",
      phase2: "طور الموجة 2",
      showIndividual: "عرض الموجات الفردية",
      pause: "إيقاف",
      play: "تشغيل",
      reset: "إعادة",
      hz: "هرتز",
      degrees: "درجة",
      wave1: "الموجة 1",
      wave2: "الموجة 2",
      resultant: "الموجة المحصلة",
      constructive: "تداخل بنّاء",
      destructive: "تداخل هدّام",
      interferenceType: "نوع التداخل",
      maxAmplitude: "أقصى سعة محصلة",
      explanation: "التفسير الفيزيائي",
      constructiveExp: "عندما تتطابق قمم الموجتين، يحدث تداخل بنّاء وتزداد السعة",
      destructiveExp: "عندما تقابل قمة موجة قاع موجة أخرى، يحدث تداخل هدّام وتقل السلة",
      partialExp: "تداخل جزئي بين البنّاء والهدّام",
    },
    en: {
      title: "Wave Interference Simulator",
      description: "Explore constructive and destructive interference",
      amplitude1: "Wave 1 Amplitude",
      amplitude2: "Wave 2 Amplitude",
      frequency1: "Wave 1 Frequency",
      frequency2: "Wave 2 Frequency",
      phase1: "Wave 1 Phase",
      phase2: "Wave 2 Phase",
      showIndividual: "Show Individual Waves",
      pause: "Pause",
      play: "Play",
      reset: "Reset",
      hz: "Hz",
      degrees: "°",
      wave1: "Wave 1",
      wave2: "Wave 2",
      resultant: "Resultant Wave",
      constructive: "Constructive",
      destructive: "Destructive",
      interferenceType: "Interference Type",
      maxAmplitude: "Max Resultant Amplitude",
      explanation: "Physical Explanation",
      constructiveExp: "When wave peaks align, constructive interference occurs and amplitude increases",
      destructiveExp: "When a peak meets a trough, destructive interference occurs and amplitude decreases",
      partialExp: "Partial interference between constructive and destructive",
    },
  };

  const t = texts[language];

  // Calculate resultant amplitude
  const phaseDiff = Math.abs(phase1 - phase2) * Math.PI / 180;
  const maxResultant = Math.sqrt(
    amplitude1 * amplitude1 + amplitude2 * amplitude2 + 
    2 * amplitude1 * amplitude2 * Math.cos(phaseDiff)
  );

  // Determine interference type
  const getInterferenceType = () => {
    if (amplitude1 === 0 && amplitude2 === 0) return "none";
    if (Math.abs(phase1 - phase2) < 10 || Math.abs(Math.abs(phase1 - phase2) - 360) < 10) {
      return "constructive";
    } else if (Math.abs(Math.abs(phase1 - phase2) - 180) < 10) {
      return "destructive";
    }
    return "partial";
  };

  const interferenceType = getInterferenceType();

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

    // Center line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    const wavelength = 80;

    // Draw Wave 1 (blue)
    if (showIndividual) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x <= width; x += 2) {
        const phase = (x / wavelength) * 2 * Math.PI * frequency1 / 2 - time * frequency1 * 2 * Math.PI + phase1 * Math.PI / 180;
        const y = centerY - amplitude1 * Math.sin(phase);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw Wave 2 (red)
    if (showIndividual) {
      ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x <= width; x += 2) {
        const phase = (x / wavelength) * 2 * Math.PI * frequency2 / 2 - time * frequency2 * 2 * Math.PI + phase2 * Math.PI / 180;
        const y = centerY - amplitude2 * Math.sin(phase);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw Resultant Wave (purple)
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += 2) {
      const phase1Val = (x / wavelength) * 2 * Math.PI * frequency1 / 2 - time * frequency1 * 2 * Math.PI + phase1 * Math.PI / 180;
      const phase2Val = (x / wavelength) * 2 * Math.PI * frequency2 / 2 - time * frequency2 * 2 * Math.PI + phase2 * Math.PI / 180;
      
      const y1 = amplitude1 * Math.sin(phase1Val);
      const y2 = amplitude2 * Math.sin(phase2Val);
      const y = centerY - (y1 + y2);
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Labels
    ctx.font = "12px system-ui";
    
    // Wave 1 label
    ctx.fillStyle = "#3b82f6";
    ctx.fillText(t.wave1, 10, 20);
    
    // Wave 2 label
    ctx.fillStyle = "#ef4444";
    ctx.fillText(t.wave2, 100, 20);
    
    // Resultant label
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(t.resultant, 190, 20);

    // Draw amplitude envelope
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY - maxResultant);
    ctx.lineTo(width, centerY - maxResultant);
    ctx.moveTo(0, centerY + maxResultant);
    ctx.lineTo(width, centerY + maxResultant);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [amplitude1, amplitude2, frequency1, frequency2, phase1, phase2, time, showIndividual, t, maxResultant]);

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
    setPhase1(0);
    setPhase2(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const setConstructive = () => {
    setPhase1(0);
    setPhase2(0);
  };

  const setDestructive = () => {
    setPhase1(0);
    setPhase2(180);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Combine className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-violet-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Quick Presets */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={setConstructive}
            className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            {t.constructive}
          </Button>
          <Button
            variant="outline"
            onClick={setDestructive}
            className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            {t.destructive}
          </Button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wave 1 Controls */}
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-600 flex items-center gap-2">
              <Waves className="w-4 h-4" />
              {t.wave1}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.amplitude1}</label>
                <Badge variant="secondary">{amplitude1}</Badge>
              </div>
              <Slider
                value={[amplitude1]}
                onValueChange={([value]) => setAmplitude1(value)}
                min={0}
                max={60}
                step={5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.frequency1}</label>
                <Badge variant="secondary">{frequency1} {t.hz}</Badge>
              </div>
              <Slider
                value={[frequency1]}
                onValueChange={([value]) => setFrequency1(value)}
                min={0.5}
                max={5}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.phase1}</label>
                <Badge variant="secondary">{phase1}{t.degrees}</Badge>
              </div>
              <Slider
                value={[phase1]}
                onValueChange={([value]) => setPhase1(value)}
                min={0}
                max={360}
                step={15}
              />
            </div>
          </div>

          {/* Wave 2 Controls */}
          <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <h4 className="font-semibold text-red-600 flex items-center gap-2">
              <Waves className="w-4 h-4" />
              {t.wave2}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.amplitude2}</label>
                <Badge variant="secondary">{amplitude2}</Badge>
              </div>
              <Slider
                value={[amplitude2]}
                onValueChange={([value]) => setAmplitude2(value)}
                min={0}
                max={60}
                step={5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.frequency2}</label>
                <Badge variant="secondary">{frequency2} {t.hz}</Badge>
              </div>
              <Slider
                value={[frequency2]}
                onValueChange={([value]) => setFrequency2(value)}
                min={0.5}
                max={5}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t.phase2}</label>
                <Badge variant="secondary">{phase2}{t.degrees}</Badge>
              </div>
              <Slider
                value={[phase2]}
                onValueChange={([value]) => setPhase2(value)}
                min={0}
                max={360}
                step={15}
              />
            </div>
          </div>
        </div>

        {/* Show individual toggle */}
        <div className="flex items-center gap-3">
          <Switch checked={showIndividual} onCheckedChange={setShowIndividual} />
          <label className="text-sm">{t.showIndividual}</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-violet-500 hover:bg-violet-600"}
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
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.wave1} {language === "ar" ? "سعة" : "Amp"}</p>
            <p className="text-xl font-bold text-blue-600">{amplitude1}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.wave2} {language === "ar" ? "سعة" : "Amp"}</p>
            <p className="text-xl font-bold text-red-600">{amplitude2}</p>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.maxAmplitude}</p>
            <p className="text-xl font-bold text-violet-600">{maxResultant.toFixed(1)}</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            interferenceType === "constructive" ? "bg-green-50 dark:bg-green-950" :
            interferenceType === "destructive" ? "bg-red-50 dark:bg-red-950" :
            "bg-amber-50 dark:bg-amber-950"
          }`}>
            <p className="text-sm text-slate-500">{t.interferenceType}</p>
            <p className={`text-xl font-bold ${
              interferenceType === "constructive" ? "text-green-600" :
              interferenceType === "destructive" ? "text-red-600" :
              "text-amber-600"
            }`}>
              {interferenceType === "constructive" ? t.constructive :
               interferenceType === "destructive" ? t.destructive :
               language === "ar" ? "جزئي" : "Partial"}
            </p>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Waves className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {interferenceType === "constructive" ? t.constructiveExp :
             interferenceType === "destructive" ? t.destructiveExp :
             t.partialExp}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
