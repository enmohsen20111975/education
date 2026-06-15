"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Waves, Activity, Music } from "lucide-react";

interface StandingWaveSimulatorProps {
  language: "ar" | "en";
}

export function StandingWaveSimulator({ language }: StandingWaveSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [amplitude, setAmplitude] = useState(40);
  const [wavelength, setWavelength] = useState(100);
  const [harmonics, setHarmonics] = useState(1);
  const [showNodes, setShowNodes] = useState(true);
  const [showAntinodes, setShowAntinodes] = useState(true);
  const [showComponentWaves, setShowComponentWaves] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [stringLength, setStringLength] = useState(400);

  const texts = {
    ar: {
      title: "محاكي الموجات الواقفة",
      description: "استكشف تكوين الموجات الواقفة والعقد والبطون",
      amplitude: "السعة",
      wavelength: "الطول الموجي",
      harmonics: "رقم التوافقية",
      stringLength: "طول الوتر",
      showNodes: "عرض العقد",
      showAntinodes: "عرض البطون",
      showComponentWaves: "عرض الموجات المكونة",
      pause: "إيقاف",
      play: "تشغيل",
      reset: "إعادة",
      nodes: "العقد",
      antinodes: "البطون",
      node: "عقدة",
      antinode: "بطن",
      fundamental: "التوافقية الأساسية",
      secondHarmonic: "التوافقية الثانية",
      thirdHarmonic: "التوافقية الثالثة",
      nthHarmonic: "التوافقية",
      frequency: "التردد",
      wavelengthFormula: "λ = 2L/n",
      frequencyFormula: "f = n × f₁",
      explanation: "التفسير الفيزيائي",
      standingWaveExp: "الموجة الواقفة تتكون من تداخل موجة ساقطة ومنعكسة. العقد هي نقاط عدم اهتزاز، والبطون هي نقاط أقصى اهتزاز.",
      fundamentalExp: "التوافقية الأساسية: نصف موجة واحدة على طول الوتر",
      harmonicExp: "كل توافقية أعلى تضيف موجة كاملة إضافية",
    },
    en: {
      title: "Standing Wave Simulator",
      description: "Explore standing wave formation, nodes and antinodes",
      amplitude: "Amplitude",
      wavelength: "Wavelength",
      harmonics: "Harmonic Number",
      stringLength: "String Length",
      showNodes: "Show Nodes",
      showAntinodes: "Show Antinodes",
      showComponentWaves: "Show Component Waves",
      pause: "Pause",
      play: "Play",
      reset: "Reset",
      nodes: "Nodes",
      antinodes: "Antinodes",
      node: "Node",
      antinode: "Antinode",
      fundamental: "Fundamental",
      secondHarmonic: "2nd Harmonic",
      thirdHarmonic: "3rd Harmonic",
      nthHarmonic: "Harmonic",
      frequency: "Frequency",
      wavelengthFormula: "λ = 2L/n",
      frequencyFormula: "f = n × f₁",
      explanation: "Physical Explanation",
      standingWaveExp: "A standing wave forms from interference of incident and reflected waves. Nodes are points of no vibration, antinodes are points of maximum vibration.",
      fundamentalExp: "Fundamental: one half-wavelength fits on the string",
      harmonicExp: "Each higher harmonic adds another full wavelength",
    },
  };

  const t = texts[language];

  // Calculate wavelength for nth harmonic: λ = 2L/n
  const effectiveWavelength = (2 * stringLength) / harmonics;
  
  // Calculate node and antinode positions
  const nodePositions: number[] = [];
  const antinodePositions: number[] = [];
  
  for (let i = 0; i <= harmonics; i++) {
    nodePositions.push((i / harmonics) * stringLength);
  }
  
  for (let i = 0; i < harmonics; i++) {
    antinodePositions.push(((i + 0.5) / harmonics) * stringLength);
  }

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const startX = 50;
    const endX = startX + stringLength;

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

    // Draw fixed ends
    ctx.fillStyle = "#374151";
    ctx.fillRect(startX - 8, centerY - 60, 8, 120);
    ctx.fillRect(endX, centerY - 60, 8, 120);

    // Center line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, centerY);
    ctx.lineTo(endX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw component waves if enabled
    if (showComponentWaves) {
      // Incident wave (right-moving)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = startX; x <= endX; x += 2) {
        const relX = x - startX;
        const phase = (relX / effectiveWavelength) * 2 * Math.PI - time * 3;
        const y = centerY - amplitude * Math.sin(phase);
        
        if (x === startX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reflected wave (left-moving, with phase inversion at fixed end)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.beginPath();
      
      for (let x = startX; x <= endX; x += 2) {
        const relX = x - startX;
        const phase = -(relX / effectiveWavelength) * 2 * Math.PI - time * 3 + Math.PI;
        const y = centerY - amplitude * Math.sin(phase);
        
        if (x === startX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw standing wave
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    for (let x = startX; x <= endX; x += 2) {
      const relX = x - startX;
      // Standing wave: y = 2A sin(kx) cos(ωt)
      const k = (harmonics * Math.PI) / stringLength;
      const spatialPart = Math.sin(k * relX);
      const temporalPart = Math.cos(time * 3);
      const y = centerY - 2 * amplitude * spatialPart * temporalPart * 0.5;
      
      if (x === startX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw envelope
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    for (let x = startX; x <= endX; x += 2) {
      const relX = x - startX;
      const k = (harmonics * Math.PI) / stringLength;
      const envelope = Math.abs(Math.sin(k * relX)) * amplitude;
      
      if (x === startX) {
        ctx.moveTo(x, centerY - envelope);
      } else {
        ctx.lineTo(x, centerY - envelope);
      }
    }
    ctx.stroke();
    
    ctx.beginPath();
    for (let x = startX; x <= endX; x += 2) {
      const relX = x - startX;
      const k = (harmonics * Math.PI) / stringLength;
      const envelope = Math.abs(Math.sin(k * relX)) * amplitude;
      
      if (x === startX) {
        ctx.moveTo(x, centerY + envelope);
      } else {
        ctx.lineTo(x, centerY + envelope);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw nodes
    if (showNodes) {
      ctx.fillStyle = "#ef4444";
      for (const pos of nodePositions) {
        const x = startX + pos;
        ctx.beginPath();
        ctx.arc(x, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Node label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N", x, centerY);
        ctx.fillStyle = "#ef4444";
      }
    }

    // Draw antinodes
    if (showAntinodes) {
      ctx.fillStyle = "#22c55e";
      for (const pos of antinodePositions) {
        const x = startX + pos;
        ctx.beginPath();
        ctx.arc(x, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Antinode label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("A", x, centerY);
        ctx.fillStyle = "#22c55e";
      }
    }

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    
    // Harmonic label
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(
      harmonics === 1 ? t.fundamental :
      harmonics === 2 ? t.secondHarmonic :
      harmonics === 3 ? t.thirdHarmonic :
      `${t.nthHarmonic} ${harmonics}`,
      startX, 25
    );

    // Wavelength label
    ctx.fillStyle = "#64748b";
    ctx.fillText(`λ = ${effectiveWavelength.toFixed(0)} px`, startX, 45);

    // Legend
    if (showNodes) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(width - 100, 25, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#64748b";
      ctx.fillText(t.node, width - 85, 28);
    }
    
    if (showAntinodes) {
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(width - 100, 45, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#64748b";
      ctx.fillText(t.antinode, width - 85, 48);
    }

  }, [amplitude, harmonics, stringLength, time, showNodes, showAntinodes, showComponentWaves, effectiveWavelength, nodePositions, antinodePositions, t]);

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

  const getHarmonicName = () => {
    if (harmonics === 1) return t.fundamental;
    if (harmonics === 2) return t.secondHarmonic;
    if (harmonics === 3) return t.thirdHarmonic;
    return `${t.nthHarmonic} ${harmonics}`;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-indigo-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Harmonic Presets */}
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              variant={harmonics === n ? "default" : "outline"}
              onClick={() => setHarmonics(n)}
              className={harmonics === n ? "bg-indigo-500 hover:bg-indigo-600" : ""}
              size="sm"
            >
              {n === 1 ? t.fundamental : `${t.nthHarmonic} ${n}`}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.amplitude}</label>
              <Badge variant="secondary">{amplitude}</Badge>
            </div>
            <Slider
              value={[amplitude]}
              onValueChange={([value]) => setAmplitude(value)}
              min={10}
              max={60}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.stringLength}</label>
              <Badge variant="secondary">{stringLength}</Badge>
            </div>
            <Slider
              value={[stringLength]}
              onValueChange={([value]) => setStringLength(value)}
              min={200}
              max={500}
              step={50}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.harmonics}</label>
              <Badge variant="secondary">n = {harmonics}</Badge>
            </div>
            <Slider
              value={[harmonics]}
              onValueChange={([value]) => setHarmonics(value)}
              min={1}
              max={6}
              step={1}
            />
          </div>
        </div>

        {/* Show toggles */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <Switch checked={showNodes} onCheckedChange={setShowNodes} />
            <label className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              {t.showNodes}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={showAntinodes} onCheckedChange={setShowAntinodes} />
            <label className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              {t.showAntinodes}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={showComponentWaves} onCheckedChange={setShowComponentWaves} />
            <label className="text-sm">{t.showComponentWaves}</label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-500 hover:bg-indigo-600"}
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
          <canvas ref={canvasRef} width={700} height={250} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.harmonics}</p>
            <p className="text-xl font-bold text-indigo-600">{getHarmonicName()}</p>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{language === "ar" ? "الطول الموجي" : "Wavelength"}</p>
            <p className="text-xl font-bold text-violet-600">λ = {effectiveWavelength.toFixed(0)}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.nodes}</p>
            <p className="text-xl font-bold text-red-600">{nodePositions.length}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.antinodes}</p>
            <p className="text-xl font-bold text-green-600">{antinodePositions.length}</p>
          </div>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.wavelengthFormula}</code>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <code className="text-sm font-mono">{t.frequencyFormula}</code>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Waves className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            {t.standingWaveExp}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {harmonics === 1 ? t.fundamentalExp : t.harmonicExp}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
