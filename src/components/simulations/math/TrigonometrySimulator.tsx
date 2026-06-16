"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Circle, RotateCcw, Play, Pause } from "lucide-react";

interface TrigonometrySimulatorProps {
  language: "ar" | "en";
}

export function TrigonometrySimulator({ language }: TrigonometrySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [angle, setAngle] = useState(45); // degrees
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTan, setShowTan] = useState(false);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكي حساب المثلثات" : "Trigonometry Simulator",
    unitCircle: isRTL ? "دائرة الوحدة" : "Unit Circle",
    angle: isRTL ? "الزاوية" : "Angle",
    degrees: isRTL ? "درجة" : "degrees",
    radians: isRTL ? "راديان" : "radians",
    sine: isRTL ? "جيب (sin)" : "Sine (sin)",
    cosine: isRTL ? "جيب تمام (cos)" : "Cosine (cos)",
    tangent: isRTL ? "ظل (tan)" : "Tangent (tan)",
    showTangent: isRTL ? "إظهار الظل" : "Show Tangent",
    hideTangent: isRTL ? "إخفاء الظل" : "Hide Tangent",
    reset: isRTL ? "إعادة تعيين" : "Reset",
    play: isRTL ? "تشغيل" : "Play",
    pause: isRTL ? "إيقاف" : "Pause",
    formulas: isRTL ? "الصيغ" : "Formulas",
    coordinates: isRTL ? "الإحداثيات" : "Coordinates",
    point: isRTL ? "النقطة على الدائرة" : "Point on Circle",
    specialAngles: isRTL ? "الزوايا الخاصة" : "Special Angles"
  };

  const angleRad = (angle * Math.PI) / 180;
  const sinValue = Math.sin(angleRad);
  const cosValue = Math.cos(angleRad);
  const tanValue = Math.tan(angleRad);

  const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    // Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    const gridSize = radius / 4;
    
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * gridSize, 0);
      ctx.lineTo(centerX + i * gridSize, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * gridSize);
      ctx.lineTo(width, centerY + i * gridSize);
      ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("1", centerX + radius, centerY + 20);
    ctx.fillText("-1", centerX - radius, centerY + 20);
    ctx.fillText("1", centerX + 15, centerY - radius);
    ctx.fillText("-1", centerX + 15, centerY + radius);
    
    // Unit circle
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Angle arc
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, -angleRad, true);
    ctx.stroke();
    
    // Angle point
    const pointX = centerX + cosValue * radius;
    const pointY = centerY - sinValue * radius;
    
    // Radius line
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();
    
    // Sin line (vertical)
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pointX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();
    
    // Sin label
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "right";
    const sinLabelX = pointX + (sinValue >= 0 ? -10 : -10);
    const sinLabelY = centerY + (pointY - centerY) / 2;
    ctx.fillText("sin", sinLabelX, sinLabelY);
    
    // Cos line (horizontal)
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, centerY);
    ctx.stroke();
    
    // Cos label
    ctx.fillStyle = "#f97316";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("cos", centerX + (pointX - centerX) / 2, centerY + 20);
    
    // Tangent line (if enabled and valid)
    if (showTan && Math.abs(cosValue) > 0.001) {
      const tanLength = Math.min(Math.abs(tanValue) * radius, radius * 3);
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + radius, centerY);
      ctx.lineTo(centerX + radius, centerY - tanLength * Math.sign(tanValue));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Point on circle
    ctx.fillStyle = "#8b5cf6";
    ctx.beginPath();
    ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Point coordinates
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    const coordText = `(${cosValue.toFixed(2)}, ${sinValue.toFixed(2)})`;
    ctx.fillText(coordText, pointX + 10, pointY - 10);
    
  }, [angle, sinValue, cosValue, tanValue, showTan]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Animation
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setAngle(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleReset = () => {
    setAngle(45);
    setIsAnimating(false);
    setShowTan(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-purple-500" />
            {labels.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? labels.pause : labels.play}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              {labels.reset}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canvas */}
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={400}
              className="w-full h-auto"
            />
          </div>
          
          {/* Controls and Values */}
          <div className="space-y-6">
            {/* Angle Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{labels.angle}</span>
                <span className="text-purple-600 font-bold">
                  {angle.toFixed(0)}° ({(angleRad).toFixed(2)} {labels.radians})
                </span>
              </div>
              <Slider
                value={[angle]}
                onValueChange={(v) => setAngle(v[0])}
                min={0}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
            
            {/* Trig Values */}
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 dark:text-green-400 font-medium">{labels.sine}</span>
                  <code className="text-lg font-bold text-green-600">{sinValue.toFixed(4)}</code>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex justify-between items-center">
                  <span className="text-orange-700 dark:text-orange-400 font-medium">{labels.cosine}</span>
                  <code className="text-lg font-bold text-orange-600">{cosValue.toFixed(4)}</code>
                </div>
              </div>
              
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <div className="flex justify-between items-center">
                  <span className="text-pink-700 dark:text-pink-400 font-medium">{labels.tangent}</span>
                  <code className="text-lg font-bold text-pink-600">
                    {Math.abs(cosValue) < 0.001 ? (isRTL ? "غير معرف" : "undefined") : tanValue.toFixed(4)}
                  </code>
                </div>
              </div>
            </div>
            
            {/* Toggle Tangent */}
            <Button 
              variant={showTan ? "default" : "outline"} 
              onClick={() => setShowTan(!showTan)}
              className="w-full"
            >
              {showTan ? labels.hideTangent : labels.showTangent}
            </Button>
            
            {/* Special Angles */}
            <div>
              <h4 className="font-medium mb-2 text-slate-600 dark:text-slate-400">{labels.specialAngles}</h4>
              <div className="flex flex-wrap gap-2">
                {specialAngles.map(a => (
                  <Button
                    key={a}
                    variant={Math.abs(angle - a) < 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAngle(a)}
                  >
                    {a}°
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Formulas */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-medium mb-2">{labels.formulas}</h4>
              <div className="space-y-1 font-mono text-sm">
                <p>sin(θ) = y/r = {sinValue.toFixed(4)}</p>
                <p>cos(θ) = x/r = {cosValue.toFixed(4)}</p>
                <p>tan(θ) = sin(θ)/cos(θ) = {Math.abs(cosValue) < 0.001 ? "∞" : tanValue.toFixed(4)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
