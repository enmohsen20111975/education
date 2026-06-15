"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Activity, Ruler, Timer } from "lucide-react";

interface PendulumSimulatorProps {
  language: "ar" | "en";
}

export function PendulumSimulator({ language }: PendulumSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [length, setLength] = useState(2); // meters
  const [initialAngle, setInitialAngle] = useState(45); // degrees
  const [gravity, setGravity] = useState(9.81); // m/s²
  const [damping, setDamping] = useState(0); // damping coefficient
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ time: number; angle: number; velocity: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي البندول البسيط",
      description: "استكشف الحركة التوافقية للبندول البسيط",
      length: "طول البندول",
      initialAngle: "الزاوية الابتدائية",
      gravity: "تسارع الجاذبية",
      damping: "معامل التخميد",
      period: "الدور",
      frequency: "التردد",
      currentAngle: "الزاوية الحالية",
      angularVelocity: "السرعة الزاوية",
      potentialEnergy: "الطاقة الكامنة",
      kineticEnergy: "الطاقة الحركية",
      totalEnergy: "الطاقة الكلية",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      chart: "الرسم البياني",
      meters: "متر",
      degrees: "درجة",
      ms2: "م/ث²",
      seconds: "ثانية",
      hz: "هرتز",
      radians: "راديان",
      rads: "راد/ث",
      formula: "T = 2π√(L/g)",
      theory: "النظرية",
      smallAngles: "للزوايا الصغيرة: T = 2π√(L/g)",
    },
    en: {
      title: "Simple Pendulum Simulator",
      description: "Explore harmonic motion of a simple pendulum",
      length: "Pendulum Length",
      initialAngle: "Initial Angle",
      gravity: "Gravity Acceleration",
      damping: "Damping Coefficient",
      period: "Period",
      frequency: "Frequency",
      currentAngle: "Current Angle",
      angularVelocity: "Angular Velocity",
      potentialEnergy: "Potential Energy",
      kineticEnergy: "Kinetic Energy",
      totalEnergy: "Total Energy",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      chart: "Chart",
      meters: "m",
      degrees: "°",
      ms2: "m/s²",
      seconds: "s",
      hz: "Hz",
      radians: "rad",
      rads: "rad/s",
      formula: "T = 2π√(L/g)",
      theory: "Theory",
      smallAngles: "For small angles: T = 2π√(L/g)",
    },
  };

  const t = texts[language];
  const g = gravity;
  const L = length;
  const theta0 = (initialAngle * Math.PI) / 180;

  // Calculate theoretical period
  const theoreticalPeriod = 2 * Math.PI * Math.sqrt(L / g);
  const frequency = 1 / theoreticalPeriod;

  // Physics simulation
  const simulateStep = useCallback((t: number, theta0: number, omega0: number, dt: number) => {
    // Using numerical integration (Euler method)
    const alpha = -(g / L) * Math.sin(theta0) - damping * omega0;
    const newOmega = omega0 + alpha * dt;
    const newTheta = theta0 + newOmega * dt;
    return { theta: newTheta, omega: newOmega };
  }, [g, L, damping]);

  // Calculate energies
  const mass = 1; // kg (normalized)
  const height = L * (1 - Math.cos(currentAngle));
  const potentialEnergy = mass * g * height;
  const velocity = L * angularVelocity;
  const kineticEnergy = 0.5 * mass * velocity * velocity;
  const totalEnergy = potentialEnergy + kineticEnergy;

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const pivotY = 30;
    const scale = Math.min(width, height) / (L * 2.5);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "#f0f9ff");
    bgGradient.addColorStop(1, "#e0f2fe");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw pivot point
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(centerX, pivotY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw support beam
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(centerX - 60, 10, 120, 15);

    // Calculate pendulum position
    const pendulumLength = L * scale;
    const bobX = centerX + pendulumLength * Math.sin(currentAngle);
    const bobY = pivotY + pendulumLength * Math.cos(currentAngle);

    // Draw pendulum rod
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw trail (ghost positions)
    ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < dataPoints.length; i += 2) {
      const ghostAngle = dataPoints[i].angle;
      const ghostX = centerX + pendulumLength * Math.sin(ghostAngle);
      const ghostY = pivotY + pendulumLength * Math.cos(ghostAngle);
      if (i === 0) ctx.moveTo(ghostX, ghostY);
      else ctx.lineTo(ghostX, ghostY);
    }
    ctx.stroke();

    // Draw bob shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.beginPath();
    ctx.ellipse(bobX + 3, bobY + 3, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw bob
    const bobGradient = ctx.createRadialGradient(bobX - 5, bobY - 5, 0, bobX, bobY, 20);
    bobGradient.addColorStop(0, "#60a5fa");
    bobGradient.addColorStop(1, "#2563eb");
    ctx.fillStyle = bobGradient;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Highlight on bob
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(bobX - 6, bobY - 6, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw angle arc
    if (Math.abs(currentAngle) > 0.01) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const arcRadius = 40;
      const startAngle = Math.PI / 2 - Math.abs(currentAngle);
      const endAngle = Math.PI / 2;
      ctx.arc(centerX, pivotY, arcRadius, 
        currentAngle > 0 ? startAngle : Math.PI - currentAngle, 
        Math.PI / 2, 
        currentAngle < 0
      );
      ctx.stroke();
    }

    // Draw velocity vector
    if (Math.abs(angularVelocity) > 0.01) {
      const vScale = 30;
      const vTangentX = angularVelocity * L * Math.cos(currentAngle) * vScale / L;
      const vTangentY = -angularVelocity * L * Math.sin(currentAngle) * vScale / L;
      
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vTangentX, bobY + vTangentY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      const arrowSize = 8;
      const angle = Math.atan2(vTangentY, vTangentX);
      ctx.moveTo(bobX + vTangentX, bobY + vTangentY);
      ctx.lineTo(bobX + vTangentX - arrowSize * Math.cos(angle - 0.4), bobY + vTangentY - arrowSize * Math.sin(angle - 0.4));
      ctx.lineTo(bobX + vTangentX - arrowSize * Math.cos(angle + 0.4), bobY + vTangentY - arrowSize * Math.sin(angle + 0.4));
      ctx.fill();
    }

    // Draw equilibrium line (dashed)
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, pivotY);
    ctx.lineTo(centerX, pivotY + pendulumLength + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(10, 10, 180, 100);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 180, 100);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = language === "ar" ? "right" : "left";
    const textX = language === "ar" ? 180 : 20;
    
    const angleDeg = (currentAngle * 180 / Math.PI).toFixed(1);
    const omegaDeg = (angularVelocity * 180 / Math.PI).toFixed(1);
    
    ctx.fillText(`${t.currentAngle}: ${angleDeg}${t.degrees}`, textX, 30);
    ctx.fillText(`${t.angularVelocity}: ${omegaDeg} ${t.degrees}/${t.seconds}`, textX, 50);
    ctx.fillText(`${t.period}: ${theoreticalPeriod.toFixed(2)} ${t.seconds}`, textX, 70);
    ctx.fillText(`${t.frequency}: ${frequency.toFixed(3)} ${t.hz}`, textX, 90);

    // Energy bar
    const barWidth = 150;
    const barHeight = 15;
    const barX = width - barWidth - 20;
    const barY = height - 30;
    
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const maxEnergy = mass * g * L * (1 - Math.cos(theta0)) + 0.5 * mass * Math.pow(L * Math.sqrt(g / L) * theta0, 2);
    const peWidth = (potentialEnergy / maxEnergy) * barWidth;
    const keWidth = (kineticEnergy / maxEnergy) * barWidth;
    
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(barX, barY, peWidth, barHeight);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(barX + peWidth, barY, keWidth, barHeight);

    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("PE", barX, barY - 5);
    ctx.fillText("KE", barX + barWidth - 20, barY - 5);

  }, [L, currentAngle, angularVelocity, theoreticalPeriod, frequency, potentialEnergy, kineticEnergy, theta0, dataPoints, t, language]);

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
    ctx.fillText(language === "ar" ? "الزاوية (درجة)" : "Angle (°)", 10, 25);
    ctx.fillText(language === "ar" ? "الزمن (ث)" : "Time (s)", width - 80, height - 15);

    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxTime = Math.max(5, dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].time * 1.2 : 5);
    const maxAngle = initialAngle * 1.2;

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
      const angleVal = maxAngle - (i / 5) * 2 * maxAngle;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.fillText(`${angleVal.toFixed(0)}`, padding - 25, y + 4);
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
    for (let t = 0; t <= maxTime; t += 0.05) {
      const angle = theta0 * Math.cos(Math.sqrt(g / L) * t);
      const x = padding + (t / maxTime) * chartWidth;
      const y = padding + ((maxAngle - angle * 180 / Math.PI) / (2 * maxAngle)) * chartHeight;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual data
    if (dataPoints.length > 1) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const x = padding + (point.time / maxTime) * chartWidth;
        const y = padding + ((maxAngle - point.angle * 180 / Math.PI) / (2 * maxAngle)) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [dataPoints, initialAngle, g, L, theta0, language]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const startTime = Date.now() - time * 1000;
    let currentTime = time;
    let theta = currentAngle;
    let omega = angularVelocity;
    const dt = 0.016; // 60 FPS

    const animate = () => {
      currentTime = (Date.now() - startTime) / 1000;
      
      // Update physics
      const result = simulateStep(currentTime, theta, omega, dt);
      theta = result.theta;
      omega = result.omega;

      setTime(currentTime);
      setCurrentAngle(theta);
      setAngularVelocity(omega);

      // Add data point every 0.05 seconds
      if (dataPoints.length === 0 || currentTime - dataPoints[dataPoints.length - 1].time >= 0.05) {
        setDataPoints(prev => [...prev, { time: currentTime, angle: theta, velocity: omega }]);
      }

      // Stop after reasonable time or if damped to near zero
      if (currentTime > 20 || (damping > 0 && Math.abs(theta) < 0.001 && Math.abs(omega) < 0.001)) {
        setIsRunning(false);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, simulateStep, damping, dataPoints]);

  // Draw
  useEffect(() => {
    drawCanvas();
    drawChart();
  }, [drawCanvas, drawChart]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setCurrentAngle(theta0);
    setAngularVelocity(0);
    setDataPoints([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Initialize angle
  useEffect(() => {
    setCurrentAngle(theta0);
  }, [theta0]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.description}</CardDescription>
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
                {t.length}
              </label>
              <Badge variant="secondary">{length.toFixed(1)} {t.meters}</Badge>
            </div>
            <Slider
              value={[length]}
              onValueChange={([value]) => { setLength(value); handleReset(); }}
              min={0.5}
              max={5}
              step={0.1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.initialAngle}</label>
              <Badge variant="secondary">{initialAngle} {t.degrees}</Badge>
            </div>
            <Slider
              value={[initialAngle]}
              onValueChange={([value]) => { setInitialAngle(value); handleReset(); }}
              min={5}
              max={60}
              step={1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.gravity}</label>
              <Badge variant="secondary">{gravity.toFixed(1)} {t.ms2}</Badge>
            </div>
            <Slider
              value={[gravity]}
              onValueChange={([value]) => setGravity(value)}
              min={1}
              max={20}
              step={0.1}
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
              max={1}
              step={0.01}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-500 hover:bg-blue-600"}
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

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={300} className="w-full" />
        </div>

        {/* Chart */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" />
              {t.chart}
            </h3>
          </div>
          <canvas ref={chartCanvasRef} width={600} height={200} className="w-full" />
        </div>

        {/* Energy info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.potentialEnergy}</p>
            <p className="font-bold text-lg text-blue-600">{potentialEnergy.toFixed(2)} J</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.kineticEnergy}</p>
            <p className="font-bold text-lg text-red-600">{kineticEnergy.toFixed(2)} J</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.totalEnergy}</p>
            <p className="font-bold text-lg text-green-600">{totalEnergy.toFixed(2)} J</p>
          </div>
        </div>

        {/* Theory */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-bold mb-2 text-amber-700 dark:text-amber-300">{t.theory}</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">{t.smallAngles}</p>
        </div>
      </CardContent>
    </Card>
  );
}
