"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Zap, Magnet, Lightbulb, Activity } from "lucide-react";

interface InductionSimulatorProps {
  language: "ar" | "en";
}

export function InductionSimulator({ language }: InductionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [magnetPosition, setMagnetPosition] = useState(150);
  const [magnetSpeed, setMagnetSpeed] = useState(3);
  const [coilTurns, setCoilTurns] = useState(20);
  const [magnetStrength, setMagnetStrength] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [time, setTime] = useState(0);
  const [emfHistory, setEmfHistory] = useState<number[]>([]);
  const [currentEmf, setCurrentEmf] = useState(0);

  const texts = {
    ar: {
      title: "محاكي الحث الكهرومغناطيسي",
      description: "استكشف قانون فاراداي: يتولد تيار حثي عند تغير التدفق المغناطيسي",
      magnetPosition: "موضع المغناطيس",
      magnetSpeed: "سرعة الحركة",
      coilTurns: "لفات الملف",
      magnetStrength: "قوة المغناطيس",
      inducedEmf: "القوة الدافعة الكهربائية الحثية",
      magneticFlux: "التدفق المغناطيسي",
      inducedCurrent: "تيار الحث",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      moveDown: "تحريك للأسفل",
      moveUp: "تحريك للأعلى",
      north: "شمال",
      south: "جنوب",
      lenzLaw: "قانون لنز",
      lenzLawText: "يسري تيار الحث في اتجاه يعارض التغير في التدفق المغناطيسي الذي أنشأه",
      faradayLaw: "قانون فاراداي",
      faradayLawText: "القوة الدافعة الكهربائية الحثية = -N × (ΔΦ/Δt)",
      explanation: "التفسير الفيزيائي",
      increasingFlux: "تدفق متزايد",
      decreasingFlux: "تدفق متناقص",
      coilArea: "مساحة الملف",
      emfGraph: "رسم بياني للقوة الدافعة",
    },
    en: {
      title: "Electromagnetic Induction Simulator",
      description: "Explore Faraday's Law: induced current arises from changing magnetic flux",
      magnetPosition: "Magnet Position",
      magnetSpeed: "Movement Speed",
      coilTurns: "Coil Turns",
      magnetStrength: "Magnet Strength",
      inducedEmf: "Induced EMF",
      magneticFlux: "Magnetic Flux",
      inducedCurrent: "Induced Current",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      moveDown: "Move Down",
      moveUp: "Move Up",
      north: "N",
      south: "S",
      lenzLaw: "Lenz's Law",
      lenzLawText: "Induced current flows in a direction that opposes the change in magnetic flux that created it",
      faradayLaw: "Faraday's Law",
      faradayLawText: "EMF = -N × (ΔΦ/Δt)",
      explanation: "Physical Explanation",
      increasingFlux: "Increasing Flux",
      decreasingFlux: "Decreasing Flux",
      coilArea: "Coil Area",
      emfGraph: "EMF Graph",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Calculate magnetic flux and EMF
  const calculateFlux = useCallback((magPos: number) => {
    const coilCenter = 200;
    const distance = Math.abs(magPos - coilCenter);
    const maxDistance = 100;
    
    // Flux decreases with distance (simplified model)
    const flux = magnetStrength * 0.001 * Math.exp(-distance * distance / (2 * maxDistance * maxDistance));
    return flux;
  }, [magnetStrength]);

  const flux = calculateFlux(magnetPosition);

  // Calculate EMF using Faraday's law
  const calculateEmf = useCallback(() => {
    if (!isRunning) return 0;
    
    // EMF = -N * dΦ/dt
    const velocity = direction === "down" ? magnetSpeed : -magnetSpeed;
    const dFlux = -magnetStrength * 0.0001 * velocity * Math.sin(time * 0.1);
    const emf = -coilTurns * dFlux * 1000; // Scale for visualization
    
    return Math.abs(emf) > 0.01 ? emf : 0;
  }, [isRunning, magnetSpeed, magnetStrength, coilTurns, direction, time]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw coil
    const coilX = 250;
    const coilY = 200;
    const coilWidth = 80;
    const coilHeight = 60;

    // Draw coil turns
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    for (let i = 0; i < Math.min(coilTurns, 20); i++) {
      const y = coilY - coilHeight / 2 + (i / Math.min(coilTurns, 20)) * coilHeight;
      ctx.beginPath();
      ctx.ellipse(coilX, y, coilWidth / 2, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw coil wire connections
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(coilX - coilWidth / 2, coilY - coilHeight / 2);
    ctx.lineTo(coilX - coilWidth / 2 - 40, coilY - coilHeight / 2 - 30);
    ctx.lineTo(coilX - coilWidth / 2 - 60, coilY - coilHeight / 2 - 30);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(coilX + coilWidth / 2, coilY + coilHeight / 2);
    ctx.lineTo(coilX + coilWidth / 2 + 40, coilY + coilHeight / 2 + 30);
    ctx.lineTo(coilX + coilWidth / 2 + 60, coilY + coilHeight / 2 + 30);
    ctx.stroke();

    // Draw galvanometer
    const galvX = coilX - coilWidth / 2 - 30;
    const galvY = coilY + 60;
    
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(galvX, galvY, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(galvX, galvY, 25, 0, Math.PI * 2);
    ctx.fill();

    // Galvanometer needle
    const emfValue = currentEmf;
    const needleAngle = Math.min(Math.max(emfValue * 0.5, -Math.PI / 3), Math.PI / 3);
    
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(galvX, galvY);
    ctx.lineTo(galvX + 20 * Math.sin(needleAngle), galvY - 20 * Math.cos(needleAngle));
    ctx.stroke();

    // Draw magnet
    const magnetX = coilX;
    const magnetY = magnetPosition;
    const magnetWidth = 50;
    const magnetHeight = 80;

    // North pole (top - red)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(magnetX - magnetWidth / 2, magnetY - magnetHeight / 2, magnetWidth, magnetHeight / 2);
    
    // South pole (bottom - blue)
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(magnetX - magnetWidth / 2, magnetY, magnetWidth, magnetHeight / 2);

    // Labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t.north, magnetX, magnetY - magnetHeight / 4);
    ctx.fillText(t.south, magnetX, magnetY + magnetHeight / 4);

    // Draw magnetic field lines
    if (isRunning) {
      const fieldIntensity = magnetStrength / 50;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
      ctx.lineWidth = 1.5;

      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        const startX = magnetX + i * 10;
        ctx.moveTo(startX, magnetY + magnetHeight / 2 + 10);
        ctx.lineTo(startX, magnetY + magnetHeight / 2 + 40 + Math.abs(i) * 5);
        ctx.stroke();
      }
    }

    // Draw induced current arrows
    if (Math.abs(currentEmf) > 0.1) {
      const arrowColor = currentEmf > 0 ? "#22c55e" : "#ef4444";
      ctx.fillStyle = arrowColor;
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2;

      // Arrow direction based on Lenz's law
      const arrowDir = currentEmf > 0 ? 1 : -1;
      
      // Draw current flow arrows around coil
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) + (time * 0.05 * arrowDir);
        const ax = coilX + (coilWidth / 2 + 15) * Math.cos(angle);
        const ay = coilY + 20 * Math.sin(angle);
        
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(angle + Math.PI / 2 * arrowDir);
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(6, 4);
        ctx.lineTo(-6, 4);
        ctx.fill();
        ctx.restore();
      }
    }

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.coilArea, coilX, coilY + coilHeight / 2 + 80);

  }, [magnetPosition, coilTurns, magnetStrength, isRunning, currentEmf, t, time]);

  const drawGraph = useCallback(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, height - 20);
    ctx.lineTo(width - 10, height - 20);
    ctx.stroke();

    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("EMF (mV)", 0, 0);
    ctx.restore();

    // X-axis label
    ctx.fillText("t", width - 15, height - 5);

    // Draw zero line
    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(40, height / 2);
    ctx.lineTo(width - 10, height / 2);
    ctx.stroke();

    // Draw EMF history
    if (emfHistory.length > 1) {
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const maxEmf = Math.max(...emfHistory.map(Math.abs), 1);
      const scaleX = (width - 50) / emfHistory.length;
      const scaleY = (height - 40) / (maxEmf * 2);
      
      emfHistory.forEach((emf, i) => {
        const x = 40 + i * scaleX;
        const y = height / 2 - emf * scaleY;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

  }, [emfHistory]);

  useEffect(() => {
    drawCanvas();
    drawGraph();
  }, [drawCanvas, drawGraph]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setTime(prev => prev + 1);
        
        // Update magnet position
        setMagnetPosition(prev => {
          const newPos = prev + (direction === "down" ? magnetSpeed : -magnetSpeed);
          
          // Boundary check
          if (newPos > 280 || newPos < 50) {
            setDirection(prev => prev === "down" ? "up" : "down");
            return newPos > 280 ? 280 : 50;
          }
          return newPos;
        });

        // Calculate and store EMF
        const emf = calculateEmf();
        setCurrentEmf(emf);
        
        setEmfHistory(prev => {
          const newHistory = [...prev, emf];
          return newHistory.slice(-100);
        });

        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, magnetSpeed, direction, calculateEmf]);

  const getFluxStatus = () => {
    const velocity = direction === "down" ? 1 : -1;
    const distToCoil = Math.abs(magnetPosition - 200);
    
    if (distToCoil < 50) {
      return velocity > 0 ? t.increasingFlux : t.decreasingFlux;
    }
    return "";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-green-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.magnetSpeed}</label>
              <Badge>{magnetSpeed}</Badge>
            </div>
            <Slider 
              value={[magnetSpeed]} 
              onValueChange={([v]) => setMagnetSpeed(v)} 
              min={1} 
              max={10} 
              step={0.5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.coilTurns}</label>
              <Badge>{coilTurns}</Badge>
            </div>
            <Slider 
              value={[coilTurns]} 
              onValueChange={([v]) => setCoilTurns(v)} 
              min={5} 
              max={100} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.magnetStrength}</label>
              <Badge>{magnetStrength}%</Badge>
            </div>
            <Slider 
              value={[magnetStrength]} 
              onValueChange={([v]) => setMagnetStrength(v)} 
              min={20} 
              max={100} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Direction Buttons */}
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant={direction === "down" ? "default" : "outline"} 
            onClick={() => setDirection("down")} 
            size="sm" 
            className={direction === "down" ? "bg-green-500" : ""}
          >
            {t.moveDown}
          </Button>
          <Button 
            variant={direction === "up" ? "default" : "outline"} 
            onClick={() => setDirection("up")} 
            size="sm" 
            className={direction === "up" ? "bg-green-500" : ""}
          >
            {t.moveUp}
          </Button>
        </div>

        {/* Main Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={350} className="w-full bg-white" />
        </div>

        {/* Graph Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={graphCanvasRef} width={500} height={120} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-3 bg-green-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.inducedEmf}</p>
            <p className="font-bold text-lg text-green-600">{currentEmf.toFixed(2)} mV</p>
            <p className="text-xs text-green-500">{getFluxStatus()}</p>
          </div>
          <div className={`p-3 bg-emerald-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.magneticFlux}</p>
            <p className="font-bold text-lg">{(flux * 1000).toFixed(4)} mWb</p>
          </div>
          <div className={`p-3 bg-teal-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.faradayLaw}</p>
            <p className="font-mono text-sm">ε = -N(dΦ/dt)</p>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className={`p-4 bg-green-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
          <div className="space-y-3">
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Activity className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-700">{t.faradayLaw}</span>
            </div>
            <p className="text-sm text-slate-600">{t.faradayLawText}</p>
            
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-amber-700">{t.lenzLaw}</span>
            </div>
            <p className="text-sm text-slate-600">{t.lenzLawText}</p>
          </div>
        </div>

        {/* Controls */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          >
            <Magnet className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {isRunning ? t.stop : t.start}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { 
              setIsRunning(false); 
              setTime(0);
              setMagnetPosition(150);
              setEmfHistory([]);
              setCurrentEmf(0);
            }}
          >
            <RotateCcw className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
