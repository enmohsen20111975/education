"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Circle, Ruler, Timer, Gauge } from "lucide-react";

interface CircularMotionSimulatorProps {
  language: "ar" | "en";
}

export function CircularMotionSimulator({ language }: CircularMotionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [radius, setRadius] = useState(2); // meters
  const [angularVelocity, setAngularVelocity] = useState(2); // rad/s
  const [mass, setMass] = useState(1); // kg
  const [showVectors, setShowVectors] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [angle, setAngle] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ time: number; angle: number; x: number; y: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الحركة الدائرية",
      description: "استكشف الحركة الدائرية المنتظمة والقوة المركزية",
      radius: "نصف القطر",
      angularVelocity: "السرعة الزاوية",
      mass: "الكتلة",
      linearVelocity: "السرعة الخطية",
      period: "الدور",
      frequency: "التردد",
      centripetalAcceleration: "التسارع المركزي",
      centripetalForce: "القوة المركزية",
      angularMomentum: "الزخم الزاوي",
      kineticEnergy: "الطاقة الحركية",
      position: "الموضع",
      velocity: "السرعة",
      acceleration: "التسارع",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      chart: "الرسم البياني",
      meters: "متر",
      kg: "كجم",
      ms: "م/ث",
      rads: "راد/ث",
      ms2: "م/ث²",
      n: "نيوتن",
      seconds: "ثانية",
      hz: "هرتز",
      joules: "جول",
      formula: "a = v²/r = ω²r",
      showVectors: "إظهار المتجهات",
      tangentialVelocity: "السرعة المماسية",
      centripetalForceArrow: "القوة المركزية",
    },
    en: {
      title: "Circular Motion Simulator",
      description: "Explore uniform circular motion and centripetal force",
      radius: "Radius",
      angularVelocity: "Angular Velocity",
      mass: "Mass",
      linearVelocity: "Linear Velocity",
      period: "Period",
      frequency: "Frequency",
      centripetalAcceleration: "Centripetal Acceleration",
      centripetalForce: "Centripetal Force",
      angularMomentum: "Angular Momentum",
      kineticEnergy: "Kinetic Energy",
      position: "Position",
      velocity: "Velocity",
      acceleration: "Acceleration",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      chart: "Chart",
      meters: "m",
      kg: "kg",
      ms: "m/s",
      rads: "rad/s",
      ms2: "m/s²",
      n: "N",
      seconds: "s",
      hz: "Hz",
      joules: "J",
      formula: "a = v²/r = ω²r",
      showVectors: "Show Vectors",
      tangentialVelocity: "Tangential Velocity",
      centripetalForceArrow: "Centripetal Force",
    },
  };

  const t = texts[language];
  const r = radius;
  const omega = angularVelocity;
  const m = mass;

  // Calculate derived quantities
  const linearVelocity = r * omega;
  const period = (2 * Math.PI) / omega;
  const frequency = 1 / period;
  const centripetalAcceleration = r * omega * omega;
  const centripetalForce = m * centripetalAcceleration;
  const angularMomentum = m * r * r * omega;
  const kineticEnergy = 0.5 * m * linearVelocity * linearVelocity;

  // Current position
  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (r * 3);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    bgGradient.addColorStop(0, "#f0fdf4");
    bgGradient.addColorStop(1, "#dcfce7");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw circular path
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, r * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw radius line
    const ballX = centerX + x * scale;
    const ballY = centerY - y * scale;
    
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(ballX, ballY);
    ctx.stroke();

    // Draw center point
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw angle arc
    if (Math.abs(angle) > 0.01) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const arcRadius = 30;
      const displayAngle = -angle + (angle < 0 ? Math.PI * 2 : 0);
      ctx.arc(centerX, centerY, arcRadius, 0, -angle, angle > 0);
      ctx.stroke();
      
      // Angle text
      ctx.fillStyle = "#f59e0b";
      ctx.font = "11px system-ui";
      const angleDeg = ((angle * 180 / Math.PI) % 360).toFixed(0);
      ctx.fillText(`${angleDeg}°`, centerX + 40, centerY - 10);
    }

    // Draw trail (previous positions)
    ctx.strokeStyle = "rgba(34, 197, 94, 0.3)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const trailLength = 30;
    const startIdx = Math.max(0, dataPoints.length - trailLength);
    for (let i = startIdx; i < dataPoints.length; i++) {
      const trailX = centerX + dataPoints[i].x * scale;
      const trailY = centerY - dataPoints[i].y * scale;
      if (i === startIdx) ctx.moveTo(trailX, trailY);
      else ctx.lineTo(trailX, trailY);
    }
    ctx.stroke();

    // Draw vectors if enabled
    if (showVectors) {
      // Tangential velocity vector (perpendicular to radius)
      const vScale = 20;
      const vx = -omega * y * vScale;
      const vy = -omega * x * vScale;
      
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + vx, ballY - vy);
      ctx.stroke();
      
      // Arrow head for velocity
      ctx.fillStyle = "#3b82f6";
      const vAngle = Math.atan2(-vy, vx);
      ctx.beginPath();
      ctx.moveTo(ballX + vx, ballY - vy);
      ctx.lineTo(ballX + vx - 10 * Math.cos(vAngle - 0.4), ballY - vy + 10 * Math.sin(vAngle - 0.4));
      ctx.lineTo(ballX + vx - 10 * Math.cos(vAngle + 0.4), ballY - vy + 10 * Math.sin(vAngle + 0.4));
      ctx.fill();

      // Centripetal acceleration/force vector (towards center)
      const aScale = 5;
      const ax = -x / r * centripetalAcceleration * aScale;
      const ay = -y / r * centripetalAcceleration * aScale;
      
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + ax, ballY - ay);
      ctx.stroke();
      
      // Arrow head for acceleration
      ctx.fillStyle = "#ef4444";
      const aAngle = Math.atan2(-ay, ax);
      ctx.beginPath();
      ctx.moveTo(ballX + ax, ballY - ay);
      ctx.lineTo(ballX + ax - 8 * Math.cos(aAngle - 0.4), ballY - ay + 8 * Math.sin(aAngle - 0.4));
      ctx.lineTo(ballX + ax - 8 * Math.cos(aAngle + 0.4), ballY - ay + 8 * Math.sin(aAngle + 0.4));
      ctx.fill();

      // Labels
      ctx.font = "10px system-ui";
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("v", ballX + vx / 2 - 5, ballY - vy / 2);
      ctx.fillStyle = "#ef4444";
      ctx.fillText("a", ballX + ax / 2, ballY - ay / 2 - 5);
    }

    // Draw ball shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.beginPath();
    ctx.ellipse(ballX + 3, ballY + 3, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw ball
    const ballGradient = ctx.createRadialGradient(ballX - 4, ballY - 4, 0, ballX, ballY, 15);
    ballGradient.addColorStop(0, "#4ade80");
    ballGradient.addColorStop(1, "#16a34a");
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Mass label on ball
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${m}${t.kg}`, ballX, ballY + 4);

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(10, 10, 180, 140);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 180, 140);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "left";
    
    ctx.fillText(`${t.linearVelocity}: ${linearVelocity.toFixed(2)} ${t.ms}`, 20, 30);
    ctx.fillText(`${t.period}: ${period.toFixed(2)} ${t.seconds}`, 20, 50);
    ctx.fillText(`${t.frequency}: ${frequency.toFixed(2)} ${t.hz}`, 20, 70);
    ctx.fillText(`${t.centripetalAcceleration}: ${centripetalAcceleration.toFixed(2)} ${t.ms2}`, 20, 90);
    ctx.fillText(`${t.centripetalForce}: ${centripetalForce.toFixed(2)} ${t.n}`, 20, 110);
    ctx.fillText(`${t.angularMomentum}: ${angularMomentum.toFixed(2)} kg·m²/s`, 20, 130);

    // Position display
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(width - 140, 10, 130, 50);
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(width - 140, 10, 130, 50);
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "11px system-ui";
    ctx.fillText(`x: ${x.toFixed(2)} ${t.meters}`, width - 130, 30);
    ctx.fillText(`y: ${y.toFixed(2)} ${t.meters}`, width - 130, 50);

    // Legend
    if (showVectors) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillRect(10, height - 60, 150, 50);
      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(10, height - 60, 150, 50);
      
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, height - 45);
      ctx.lineTo(40, height - 45);
      ctx.stroke();
      ctx.fillStyle = "#1e293b";
      ctx.font = "10px system-ui";
      ctx.fillText(t.tangentialVelocity, 50, height - 42);
      
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(20, height - 25);
      ctx.lineTo(40, height - 25);
      ctx.stroke();
      ctx.fillStyle = "#1e293b";
      ctx.fillText(t.centripetalForceArrow, 50, height - 22);
    }

  }, [r, x, y, angle, omega, m, showVectors, linearVelocity, period, frequency, centripetalAcceleration, centripetalForce, angularMomentum, dataPoints, t]);

  // Draw the chart (X-Y position over time)
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
    ctx.fillText(language === "ar" ? "الموضع (م)" : "Position (m)", 10, 25);
    ctx.fillText(language === "ar" ? "الزمن (ث)" : "Time (s)", width - 80, height - 15);

    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxTime = Math.max(2, dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].time * 1.2 : 2);
    const maxPos = r * 1.2;

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
      const posVal = maxPos - (i / 5) * 2 * maxPos;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.fillText(`${posVal.toFixed(1)}`, padding - 25, y + 4);
    }

    // Zero line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    const zeroY = padding + chartHeight / 2;
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(width - padding, zeroY);
    ctx.stroke();

    // Draw theoretical curves
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= maxTime; t += 0.02) {
      const xVal = r * Math.cos(omega * t);
      const chartX = padding + (t / maxTime) * chartWidth;
      const chartY = padding + ((maxPos - xVal) / (2 * maxPos)) * chartHeight;
      if (t === 0) ctx.moveTo(chartX, chartY);
      else ctx.lineTo(chartX, chartY);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
    ctx.beginPath();
    for (let t = 0; t <= maxTime; t += 0.02) {
      const yVal = r * Math.sin(omega * t);
      const chartX = padding + (t / maxTime) * chartWidth;
      const chartY = padding + ((maxPos - yVal) / (2 * maxPos)) * chartHeight;
      if (t === 0) ctx.moveTo(chartX, chartY);
      else ctx.lineTo(chartX, chartY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual data - X position
    if (dataPoints.length > 1) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const chartX = padding + (point.time / maxTime) * chartWidth;
        const chartY = padding + ((maxPos - point.x) / (2 * maxPos)) * chartHeight;
        if (i === 0) ctx.moveTo(chartX, chartY);
        else ctx.lineTo(chartX, chartY);
      });
      ctx.stroke();

      // Y position
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const chartX = padding + (point.time / maxTime) * chartWidth;
        const chartY = padding + ((maxPos - point.y) / (2 * maxPos)) * chartHeight;
        if (i === 0) ctx.moveTo(chartX, chartY);
        else ctx.lineTo(chartX, chartY);
      });
      ctx.stroke();
    }

    // Legend
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(width - 100, 20, 15, 10);
    ctx.fillStyle = "#1e293b";
    ctx.font = "10px system-ui";
    ctx.fillText("x", width - 80, 28);
    
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(width - 100, 35, 15, 10);
    ctx.fillStyle = "#1e293b";
    ctx.fillText("y", width - 80, 43);

  }, [dataPoints, r, omega, language]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const startTime = Date.now() - time * 1000;
    let lastDataTime = time;

    const animate = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      const currentAngle = (omega * currentTime) % (2 * Math.PI);
      
      setTime(currentTime);
      setAngle(currentAngle);

      // Add data point every 0.05 seconds
      if (currentTime - lastDataTime >= 0.05) {
        const posX = r * Math.cos(currentAngle);
        const posY = r * Math.sin(currentAngle);
        setDataPoints(prev => [...prev, { time: currentTime, angle: currentAngle, x: posX, y: posY }]);
        lastDataTime = currentTime;
      }

      // Keep data points manageable
      if (dataPoints.length > 200) {
        setDataPoints(prev => prev.slice(-150));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, omega, r, time, dataPoints.length]);

  // Draw
  useEffect(() => {
    drawCanvas();
    drawChart();
  }, [drawCanvas, drawChart]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setAngle(0);
    setDataPoints([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Circle className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-green-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-500" />
                {t.radius}
              </label>
              <Badge variant="secondary">{radius.toFixed(1)} {t.meters}</Badge>
            </div>
            <Slider
              value={[radius]}
              onValueChange={([value]) => { setRadius(value); handleReset(); }}
              min={0.5}
              max={5}
              step={0.1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Gauge className="w-4 h-4 text-green-500" />
                {t.angularVelocity}
              </label>
              <Badge variant="secondary">{angularVelocity.toFixed(1)} {t.rads}</Badge>
            </div>
            <Slider
              value={[angularVelocity]}
              onValueChange={([value]) => { setAngularVelocity(value); handleReset(); }}
              min={0.5}
              max={5}
              step={0.1}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.mass}</label>
              <Badge variant="secondary">{mass.toFixed(1)} {t.kg}</Badge>
            </div>
            <Slider
              value={[mass]}
              onValueChange={([value]) => setMass(value)}
              min={0.5}
              max={5}
              step={0.1}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Show vectors toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showVectors"
            checked={showVectors}
            onChange={(e) => setShowVectors(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="showVectors" className="text-sm cursor-pointer">{t.showVectors}</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"}
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
          <canvas ref={canvasRef} width={600} height={350} className="w-full" />
        </div>

        {/* Chart */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Timer className="w-4 h-4 text-green-500" />
              {t.chart}
            </h3>
          </div>
          <canvas ref={chartCanvasRef} width={600} height={200} className="w-full" />
        </div>

        {/* Parameters info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.linearVelocity}</p>
            <p className="font-bold text-lg text-green-600">{linearVelocity.toFixed(2)} {t.ms}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.centripetalAcceleration}</p>
            <p className="font-bold text-lg text-blue-600">{centripetalAcceleration.toFixed(2)} {t.ms2}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.centripetalForce}</p>
            <p className="font-bold text-lg text-red-600">{centripetalForce.toFixed(2)} {t.n}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.kineticEnergy}</p>
            <p className="font-bold text-lg text-amber-600">{kineticEnergy.toFixed(2)} {t.joules}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
