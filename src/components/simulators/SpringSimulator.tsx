"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Waves, Ruler, Timer, Zap } from "lucide-react";

interface SpringSimulatorProps {
  language: "ar" | "en";
}

export function SpringSimulator({ language }: SpringSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [mass, setMass] = useState(1); // kg
  const [springConstant, setSpringConstant] = useState(10); // N/m
  const [initialDisplacement, setInitialDisplacement] = useState(0.3); // meters
  const [damping, setDamping] = useState(0); // damping coefficient
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [displacement, setDisplacement] = useState(0.3);
  const [velocity, setVelocity] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ time: number; displacement: number; velocity: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الزنبرك والحركة التوافقية",
      description: "استكشف الحركة التوافقية البسيطة والزنبرك",
      mass: "الكتلة",
      springConstant: "ثابت الزنبرك",
      initialDisplacement: "الإزاحة الابتدائية",
      damping: "معامل التخميد",
      period: "الدور",
      frequency: "التردد",
      angularFrequency: "التردد الزاوي",
      currentDisplacement: "الإزاحة الحالية",
      currentVelocity: "السرعة الحالية",
      potentialEnergy: "طاقة الوضع",
      kineticEnergy: "الطاقة الحركية",
      totalEnergy: "الطاقة الكلية",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      chart: "الرسم البياني",
      meters: "متر",
      kg: "كجم",
      nm: "ن/م",
      ms: "م/ث",
      seconds: "ثانية",
      hz: "هرتز",
      rads: "راد/ث",
      joules: "جول",
      formula: "T = 2π√(m/k)",
      hookesLaw: "قانون هوك: F = -kx",
      theory: "النظرية",
      equilibrium: "موضع الاتزان",
      compression: "ضغط",
      extension: "تمدد",
    },
    en: {
      title: "Spring & Simple Harmonic Motion Simulator",
      description: "Explore simple harmonic motion and spring dynamics",
      mass: "Mass",
      springConstant: "Spring Constant",
      initialDisplacement: "Initial Displacement",
      damping: "Damping Coefficient",
      period: "Period",
      frequency: "Frequency",
      angularFrequency: "Angular Frequency",
      currentDisplacement: "Current Displacement",
      currentVelocity: "Current Velocity",
      potentialEnergy: "Potential Energy",
      kineticEnergy: "Kinetic Energy",
      totalEnergy: "Total Energy",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      chart: "Chart",
      meters: "m",
      kg: "kg",
      nm: "N/m",
      ms: "m/s",
      seconds: "s",
      hz: "Hz",
      rads: "rad/s",
      joules: "J",
      formula: "T = 2π√(m/k)",
      hookesLaw: "Hooke's Law: F = -kx",
      theory: "Theory",
      equilibrium: "Equilibrium Position",
      compression: "Compression",
      extension: "Extension",
    },
  };

  const t = texts[language];
  const m = mass;
  const k = springConstant;
  const x0 = initialDisplacement;

  // Calculate theoretical values
  const omega = Math.sqrt(k / m); // Angular frequency
  const period = 2 * Math.PI / omega;
  const frequency = 1 / period;

  // Calculate energies
  const potentialEnergy = 0.5 * k * displacement * displacement;
  const kineticEnergy = 0.5 * m * velocity * velocity;
  const totalEnergy = 0.5 * k * x0 * x0;

  // Draw spring function
  const drawSpring = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    coils: number = 15
  ) => {
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const coilWidth = 12;
    
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    // Draw coils
    const coilLength = length / (coils + 2);
    let currentX = startX;
    let currentY = startY;
    
    // Initial straight segment
    currentX += dx / length * coilLength;
    currentY += dy / length * coilLength;
    ctx.lineTo(currentX, currentY);
    
    // Coils
    for (let i = 0; i < coils; i++) {
      const progress = (i + 1) / (coils + 2);
      const nextProgress = (i + 2) / (coils + 2);
      const centerX = startX + dx * (progress + nextProgress) / 2;
      const centerY = startY + dy * (progress + nextProgress) / 2;
      
      const perpX = -dy / length * coilWidth;
      const perpY = dx / length * coilWidth;
      
      if (i % 2 === 0) {
        ctx.lineTo(centerX + perpX, centerY + perpY);
      } else {
        ctx.lineTo(centerX - perpX, centerY - perpY);
      }
    }
    
    // Final straight segment
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }, []);

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const wallX = 50;
    const scale = 200; // pixels per meter

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, 0);
    bgGradient.addColorStop(0, "#fef3c7");
    bgGradient.addColorStop(1, "#fefce8");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw wall
    ctx.fillStyle = "#78716c";
    ctx.fillRect(wallX - 15, centerY - 80, 15, 160);
    
    // Wall pattern
    ctx.strokeStyle = "#57534e";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(wallX - 15, centerY - 80 + i * 20);
      ctx.lineTo(wallX, centerY - 60 + i * 20);
      ctx.stroke();
    }

    // Calculate spring and mass position
    const equilibriumX = 250;
    const massX = equilibriumX + displacement * scale;
    const naturalLength = equilibriumX - wallX;

    // Draw equilibrium line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(equilibriumX, centerY - 60);
    ctx.lineTo(equilibriumX, centerY + 60);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw equilibrium label
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.equilibrium, equilibriumX, centerY + 75);

    // Draw spring
    drawSpring(ctx, wallX, centerY, massX - 30, centerY, 20);

    // Draw mass shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(massX - 28, centerY + 3, 56, 56);

    // Draw mass (block)
    const blockGradient = ctx.createLinearGradient(massX - 30, centerY - 30, massX + 30, centerY + 30);
    blockGradient.addColorStop(0, "#f97316");
    blockGradient.addColorStop(1, "#ea580c");
    ctx.fillStyle = blockGradient;
    ctx.beginPath();
    ctx.roundRect(massX - 30, centerY - 30, 60, 60, 8);
    ctx.fill();

    // Mass label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${mass}${t.kg}`, massX, centerY + 5);

    // Draw displacement arrow
    if (Math.abs(displacement) > 0.01) {
      const arrowY = centerY + 70;
      ctx.strokeStyle = displacement > 0 ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(equilibriumX, arrowY);
      ctx.lineTo(massX, arrowY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = displacement > 0 ? "#22c55e" : "#ef4444";
      ctx.beginPath();
      if (displacement > 0) {
        ctx.moveTo(massX, arrowY);
        ctx.lineTo(massX - 10, arrowY - 6);
        ctx.lineTo(massX - 10, arrowY + 6);
      } else {
        ctx.moveTo(massX, arrowY);
        ctx.lineTo(massX + 10, arrowY - 6);
        ctx.lineTo(massX + 10, arrowY + 6);
      }
      ctx.fill();

      // Displacement value
      ctx.fillStyle = "#1e293b";
      ctx.font = "12px system-ui";
      ctx.fillText(`${(displacement * 100).toFixed(1)} cm`, (equilibriumX + massX) / 2, arrowY + 20);
    }

    // Draw velocity vector
    if (Math.abs(velocity) > 0.01) {
      const vArrowLength = velocity * 50;
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(massX, centerY - 50);
      ctx.lineTo(massX + vArrowLength, centerY - 50);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      if (velocity > 0) {
        ctx.moveTo(massX + vArrowLength, centerY - 50);
        ctx.lineTo(massX + vArrowLength - 10, centerY - 56);
        ctx.lineTo(massX + vArrowLength - 10, centerY - 44);
      } else {
        ctx.moveTo(massX + vArrowLength, centerY - 50);
        ctx.lineTo(massX + vArrowLength + 10, centerY - 56);
        ctx.lineTo(massX + vArrowLength + 10, centerY - 44);
      }
      ctx.fill();

      ctx.fillStyle = "#3b82f6";
      ctx.font = "11px system-ui";
      ctx.fillText(`v = ${velocity.toFixed(2)} ${t.ms}`, massX, centerY - 60);
    }

    // Draw force arrows (spring force)
    const springForce = -k * displacement;
    if (Math.abs(springForce) > 0.1) {
      const forceArrowLength = springForce * 10;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(massX, centerY);
      ctx.lineTo(massX + forceArrowLength, centerY);
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.font = "10px system-ui";
      ctx.fillText(`F = ${springForce.toFixed(1)} N`, massX + forceArrowLength / 2, centerY - 5);
    }

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(width - 200, 10, 190, 120);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(width - 200, 10, 190, 120);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "right";
    
    ctx.fillText(`${t.period}: ${period.toFixed(2)} ${t.seconds}`, width - 20, 30);
    ctx.fillText(`${t.frequency}: ${frequency.toFixed(2)} ${t.hz}`, width - 20, 50);
    ctx.fillText(`${t.angularFrequency}: ${omega.toFixed(2)} ${t.rads}`, width - 20, 70);
    ctx.fillText(`${t.currentDisplacement}: ${(displacement * 100).toFixed(1)} cm`, width - 20, 90);
    ctx.fillText(`${t.currentVelocity}: ${velocity.toFixed(2)} ${t.ms}`, width - 20, 110);

    // State indicator
    const stateText = displacement > 0 ? t.extension : displacement < 0 ? t.compression : "";
    if (stateText) {
      ctx.fillStyle = displacement > 0 ? "#22c55e" : "#ef4444";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(stateText, wallX + 10, centerY - 70);
    }

  }, [displacement, velocity, mass, k, period, frequency, omega, drawSpring, t]);

  // Draw the chart
  const drawChart = useCallback(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText(language === "ar" ? "الإزاحة (م)" : "Displacement (m)", 10, 25);
    ctx.fillText(language === "ar" ? "الزمن (ث)" : "Time (s)", width - 80, height - 15);

    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxTime = Math.max(5, dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].time * 1.2 : 5);
    const maxDisp = x0 * 1.2;

    // Grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * chartWidth;
      const timeVal = (i / 5) * maxTime;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.fillText(`${timeVal.toFixed(1)}`, x - 10, height - padding + 15);

      const y = padding + (i / 5) * chartHeight;
      const dispVal = maxDisp - (i / 5) * 2 * maxDisp;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.fillText(`${(dispVal * 100).toFixed(0)}`, padding - 30, y + 4);
    }

    // Zero line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    const zeroY = padding + chartHeight / 2;
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(width - padding, zeroY);
    ctx.stroke();

    // Draw theoretical sine wave
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= maxTime; t += 0.02) {
      const dampedDisp = x0 * Math.exp(-damping * t / (2 * m)) * Math.cos(omega * t);
      const x = padding + (t / maxTime) * chartWidth;
      const y = padding + ((maxDisp - dampedDisp) / (2 * maxDisp)) * chartHeight;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual data
    if (dataPoints.length > 1) {
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const x = padding + (point.time / maxTime) * chartWidth;
        const y = padding + ((maxDisp - point.displacement) / (2 * maxDisp)) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [dataPoints, x0, omega, damping, m, language]);

  // Physics simulation using Runge-Kutta 4th order
  const simulateStep = useCallback((x: number, v: number, dt: number) => {
    // dx/dt = v
    // dv/dt = -(k/m)x - (c/m)v
    
    const k1v = v;
    const k1a = -(k / m) * x - (damping / m) * v;
    
    const k2v = v + 0.5 * dt * k1a;
    const k2a = -(k / m) * (x + 0.5 * dt * k1v) - (damping / m) * k2v;
    
    const k3v = v + 0.5 * dt * k2a;
    const k3a = -(k / m) * (x + 0.5 * dt * k2v) - (damping / m) * k3v;
    
    const k4v = v + dt * k3a;
    const k4a = -(k / m) * (x + dt * k3v) - (damping / m) * k4v;
    
    const newX = x + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    const newV = v + (dt / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
    
    return { x: newX, v: newV };
  }, [k, m, damping]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let currentTime = time;
    let x = displacement;
    let v = velocity;
    const dt = 0.016;
    let lastDataTime = currentTime;

    const animate = () => {
      currentTime += dt;
      
      // Update physics
      const result = simulateStep(x, v, dt);
      x = result.x;
      v = result.v;

      setTime(currentTime);
      setDisplacement(x);
      setVelocity(v);

      // Add data point every 0.05 seconds
      if (currentTime - lastDataTime >= 0.05) {
        setDataPoints(prev => [...prev, { time: currentTime, displacement: x, velocity: v }]);
        lastDataTime = currentTime;
      }

      // Stop after reasonable time or if damped to near zero
      if (currentTime > 20 || (damping > 0 && Math.abs(x) < 0.001 && Math.abs(v) < 0.001)) {
        setIsRunning(false);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, simulateStep, damping, time, displacement, velocity]);

  // Draw
  useEffect(() => {
    drawCanvas();
    drawChart();
  }, [drawCanvas, drawChart]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setDisplacement(x0);
    setVelocity(0);
    setDataPoints([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Initialize displacement
  useEffect(() => {
    setDisplacement(x0);
  }, [x0]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-orange-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-500" />
                {t.mass}
              </label>
              <Badge variant="secondary">{mass.toFixed(1)} {t.kg}</Badge>
            </div>
            <Slider
              value={[mass]}
              onValueChange={([value]) => { setMass(value); handleReset(); }}
              min={0.5}
              max={5}
              step={0.1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                {t.springConstant}
              </label>
              <Badge variant="secondary">{springConstant.toFixed(1)} {t.nm}</Badge>
            </div>
            <Slider
              value={[springConstant]}
              onValueChange={([value]) => { setSpringConstant(value); handleReset(); }}
              min={1}
              max={50}
              step={1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.initialDisplacement}</label>
              <Badge variant="secondary">{(initialDisplacement * 100).toFixed(0)} cm</Badge>
            </div>
            <Slider
              value={[initialDisplacement]}
              onValueChange={([value]) => { setInitialDisplacement(value); handleReset(); }}
              min={0.05}
              max={0.5}
              step={0.01}
              disabled={isRunning}
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
              min={0}
              max={2}
              step={0.01}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600"}
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
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center space-y-1">
          <code className="text-sm font-mono">{t.formula}</code>
          <br />
          <code className="text-sm font-mono">{t.hookesLaw}</code>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={250} className="w-full" />
        </div>

        {/* Chart */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Timer className="w-4 h-4 text-orange-500" />
              {t.chart}
            </h3>
          </div>
          <canvas ref={chartCanvasRef} width={600} height={200} className="w-full" />
        </div>

        {/* Energy info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.potentialEnergy}</p>
            <p className="font-bold text-lg text-blue-600">{potentialEnergy.toFixed(3)} {t.joules}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.kineticEnergy}</p>
            <p className="font-bold text-lg text-red-600">{kineticEnergy.toFixed(3)} {t.joules}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.totalEnergy}</p>
            <p className="font-bold text-lg text-green-600">{totalEnergy.toFixed(3)} {t.joules}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
