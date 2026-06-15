"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, TrendingUp, BarChart3, LineChart, Activity, Zap } from "lucide-react";

interface MotionGraphSimulatorProps {
  language: "ar" | "en";
}

type GraphType = "position" | "velocity" | "acceleration";

export function MotionGraphSimulator({ language }: MotionGraphSimulatorProps) {
  const positionCanvasRef = useRef<HTMLCanvasElement>(null);
  const velocityCanvasRef = useRef<HTMLCanvasElement>(null);
  const accelerationCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [initialVelocity, setInitialVelocity] = useState(5); // m/s
  const [acceleration, setAcceleration] = useState(2); // m/s²
  const [initialPosition, setInitialPosition] = useState(0); // m
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [dataPoints, setDataPoints] = useState<{ time: number; position: number; velocity: number; acceleration: number }[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الرسوم البيانية للحركة",
      description: "استكشف العلاقة بين الموضع والسرعة والتسارع بيانياً",
      initialVelocity: "السرعة الابتدائية",
      acceleration: "التسارع",
      initialPosition: "الموضع الابتدائي",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      positionTime: "مخطط الموضع - الزمن (s-t)",
      velocityTime: "مخطط السرعة - الزمن (v-t)",
      accelerationTime: "مخطط التسارع - الزمن (a-t)",
      mps: "م/ث",
      ms2: "م/ث²",
      meters: "متر",
      seconds: "ثانية",
      slope: "الميل",
      area: "المساحة",
      slopeEqualsVelocity: "ميل منحنى s-t = السرعة",
      slopeEqualsAccel: "ميل منحنى v-t = التسارع",
      areaEqualsDisplacement: "مساحة تحت منحنى v-t = الإزاحة",
      positionFormula: "s = s₀ + v₀t + ½at²",
      velocityFormula: "v = v₀ + at",
      physicsNote: "ملاحظة فيزيائية",
      linearMotion: "حركة خطية منتظمة",
      uniformAccel: "حركة بتسارع منتظم",
      time: "الزمن",
    },
    en: {
      title: "Motion Graph Simulator",
      description: "Explore the relationship between position, velocity, and acceleration graphically",
      initialVelocity: "Initial Velocity",
      acceleration: "Acceleration",
      initialPosition: "Initial Position",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      positionTime: "Position-Time Graph (s-t)",
      velocityTime: "Velocity-Time Graph (v-t)",
      accelerationTime: "Acceleration-Time Graph (a-t)",
      mps: "m/s",
      ms2: "m/s²",
      meters: "m",
      seconds: "s",
      slope: "Slope",
      area: "Area",
      slopeEqualsVelocity: "Slope of s-t curve = Velocity",
      slopeEqualsAccel: "Slope of v-t curve = Acceleration",
      areaEqualsDisplacement: "Area under v-t curve = Displacement",
      positionFormula: "s = s₀ + v₀t + ½at²",
      velocityFormula: "v = v₀ + at",
      physicsNote: "Physics Note",
      linearMotion: "Linear motion",
      uniformAccel: "Uniformly accelerated motion",
      time: "Time",
    },
  };

  const t = texts[language];

  // Physics calculations
  const calculatePosition = useCallback((s0: number, v0: number, a: number, t: number) => {
    return s0 + v0 * t + 0.5 * a * t * t;
  }, []);

  const calculateVelocity = useCallback((v0: number, a: number, t: number) => {
    return v0 + a * t;
  }, []);

  const maxTime = 10;

  // Draw graph function
  const drawGraph = useCallback((
    canvas: HTMLCanvasElement | null,
    dataKey: GraphType,
    label: string,
    unit: string,
    maxValue: number,
    currentDataPoints: typeof dataPoints
  ) => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { left: 55, right: 20, top: 30, bottom: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    // Vertical grid lines (time)
    for (let i = 0; i <= maxTime; i++) {
      const x = padding.left + (i / maxTime) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (i / gridLines) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";

    // X-axis labels (time)
    for (let i = 0; i <= maxTime; i += 2) {
      const x = padding.left + (i / maxTime) * chartWidth;
      ctx.fillText(`${i}`, x, height - padding.bottom + 18);
    }
    ctx.fillText(language === "ar" ? "الزمن (ث)" : "Time (s)", width / 2, height - 5);

    // Y-axis labels
    ctx.textAlign = "right";
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (i / gridLines) * chartHeight;
      const value = maxValue - (i / gridLines) * maxValue;
      ctx.fillText(value.toFixed(0), padding.left - 8, y + 4);
    }

    // Y-axis title
    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(label, 0, 0);
    ctx.restore();

    // Draw theoretical curve (dashed)
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    for (let ti = 0; ti <= maxTime; ti += 0.1) {
      let value: number;
      if (dataKey === "position") {
        value = calculatePosition(initialPosition, initialVelocity, acceleration, ti);
      } else if (dataKey === "velocity") {
        value = calculateVelocity(initialVelocity, acceleration, ti);
      } else {
        value = acceleration;
      }

      const x = padding.left + (ti / maxTime) * chartWidth;
      const y = padding.top + ((maxValue - Math.max(0, value)) / maxValue) * chartHeight;

      if (ti === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual data points
    if (currentDataPoints.length > 1) {
      ctx.strokeStyle = dataKey === "position" ? "#22c55e" : dataKey === "velocity" ? "#3b82f6" : "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();

      currentDataPoints.forEach((point, i) => {
        let value: number;
        if (dataKey === "position") {
          value = point.position;
        } else if (dataKey === "velocity") {
          value = point.velocity;
        } else {
          value = point.acceleration;
        }

        const x = padding.left + (point.time / maxTime) * chartWidth;
        const y = padding.top + ((maxValue - Math.max(0, value)) / maxValue) * chartHeight;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw points
      ctx.fillStyle = dataKey === "position" ? "#22c55e" : dataKey === "velocity" ? "#3b82f6" : "#f59e0b";
      currentDataPoints.forEach((point) => {
        let value: number;
        if (dataKey === "position") {
          value = point.position;
        } else if (dataKey === "velocity") {
          value = point.velocity;
        } else {
          value = point.acceleration;
        }

        const x = padding.left + (point.time / maxTime) * chartWidth;
        const y = padding.top + ((maxValue - Math.max(0, value)) / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Current point indicator
    if (currentDataPoints.length > 0) {
      const lastPoint = currentDataPoints[currentDataPoints.length - 1];
      let value: number;
      if (dataKey === "position") {
        value = lastPoint.position;
      } else if (dataKey === "velocity") {
        value = lastPoint.velocity;
      } else {
        value = lastPoint.acceleration;
      }

      const x = padding.left + (lastPoint.time / maxTime) * chartWidth;
      const y = padding.top + ((maxValue - Math.max(0, value)) / maxValue) * chartHeight;

      ctx.fillStyle = dataKey === "position" ? "#22c55e" : dataKey === "velocity" ? "#3b82f6" : "#f59e0b";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Value label
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`${value.toFixed(1)} ${unit}`, x + 12, y + 4);
    }
  }, [initialPosition, initialVelocity, acceleration, maxTime, calculatePosition, calculateVelocity, language]);

  // Draw all graphs
  const drawAllGraphs = useCallback(() => {
    // Calculate max values for scaling
    const maxPosition = calculatePosition(initialPosition, initialVelocity, acceleration, maxTime);
    const maxVelocity = calculateVelocity(initialVelocity, acceleration, maxTime);

    drawGraph(positionCanvasRef.current, "position", language === "ar" ? "الموضع (م)" : "Position (m)", t.meters, Math.max(maxPosition * 1.2, 20), dataPoints);
    drawGraph(velocityCanvasRef.current, "velocity", language === "ar" ? "السرعة (م/ث)" : "Velocity (m/s)", t.mps, Math.max(maxVelocity * 1.2, 10), dataPoints);
    drawGraph(accelerationCanvasRef.current, "acceleration", language === "ar" ? "التسارع (م/ث²)" : "Accel. (m/s²)", t.ms2, Math.max(Math.abs(acceleration) * 2, 10), dataPoints);
  }, [dataPoints, initialPosition, initialVelocity, acceleration, calculatePosition, calculateVelocity, drawGraph, language, t]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startTime = Date.now() - time * 1000;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      if (elapsed >= maxTime) {
        setIsRunning(false);
        return;
      }

      const newPos = calculatePosition(initialPosition, initialVelocity, acceleration, elapsed);
      const newVel = calculateVelocity(initialVelocity, acceleration, elapsed);

      setTime(elapsed);

      // Add data point every 0.2 seconds
      if (dataPoints.length === 0 || elapsed - dataPoints[dataPoints.length - 1].time >= 0.2) {
        setDataPoints(prev => [...prev, {
          time: elapsed,
          position: newPos,
          velocity: newVel,
          acceleration: acceleration
        }]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, initialVelocity, acceleration, initialPosition, calculatePosition, calculateVelocity, time, dataPoints, maxTime]);

  // Draw on every update
  useEffect(() => {
    drawAllGraphs();
  }, [drawAllGraphs]);

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setDataPoints([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Handle slider changes
  const handleVelocityChange = ([value]: number[]) => {
    setInitialVelocity(value);
    handleReset();
  };

  const handleAccelerationChange = ([value]: number[]) => {
    setAcceleration(value);
    handleReset();
  };

  const handlePositionChange = ([value]: number[]) => {
    setInitialPosition(value);
    handleReset();
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Initial Position */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                {t.initialPosition}
              </label>
              <Badge variant="secondary">
                {initialPosition} {t.meters}
              </Badge>
            </div>
            <Slider
              value={[initialPosition]}
              onValueChange={handlePositionChange}
              min={0}
              max={20}
              step={1}
              disabled={isRunning}
            />
          </div>

          {/* Initial Velocity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                {t.initialVelocity}
              </label>
              <Badge variant="secondary">
                {initialVelocity} {t.mps}
              </Badge>
            </div>
            <Slider
              value={[initialVelocity]}
              onValueChange={handleVelocityChange}
              min={0}
              max={20}
              step={1}
              disabled={isRunning}
            />
          </div>

          {/* Acceleration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                {t.acceleration}
              </label>
              <Badge variant="secondary">
                {acceleration} {t.ms2}
              </Badge>
            </div>
            <Slider
              value={[acceleration]}
              onValueChange={handleAccelerationChange}
              min={-5}
              max={10}
              step={0.5}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-purple-500 hover:bg-purple-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Graphs */}
        <div className="space-y-4">
          {/* Position-Time Graph */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-50 dark:bg-green-950 px-4 py-2 border-b flex items-center gap-2">
              <LineChart className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-700 dark:text-green-300">{t.positionTime}</span>
            </div>
            <canvas
              ref={positionCanvasRef}
              width={600}
              height={200}
              className="w-full bg-white"
            />
          </div>

          {/* Velocity-Time Graph */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-950 px-4 py-2 border-b flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-700 dark:text-blue-300">{t.velocityTime}</span>
            </div>
            <canvas
              ref={velocityCanvasRef}
              width={600}
              height={200}
              className="w-full bg-white"
            />
          </div>

          {/* Acceleration-Time Graph */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-amber-50 dark:bg-amber-950 px-4 py-2 border-b flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-amber-700 dark:text-amber-300">{t.accelerationTime}</span>
            </div>
            <canvas
              ref={accelerationCanvasRef}
              width={600}
              height={200}
              className="w-full bg-white"
            />
          </div>
        </div>

        {/* Physics Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="font-bold text-green-700 dark:text-green-300 text-sm mb-1">{t.slope}</div>
            <div className="text-green-600 dark:text-green-400 text-xs">{t.slopeEqualsVelocity}</div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-1">{t.slope}</div>
            <div className="text-blue-600 dark:text-blue-400 text-xs">{t.slopeEqualsAccel}</div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="font-bold text-amber-700 dark:text-amber-300 text-sm mb-1">{t.area}</div>
            <div className="text-amber-600 dark:text-amber-400 text-xs">{t.areaEqualsDisplacement}</div>
          </div>
        </div>

        {/* Current Time */}
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {t.time}: {time.toFixed(2)} {t.seconds}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
