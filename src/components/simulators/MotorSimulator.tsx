"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Zap, Settings, Activity, Lightbulb } from "lucide-react";

interface MotorSimulatorProps {
  language: "ar" | "en";
}

export function MotorSimulator({ language }: MotorSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [voltage, setVoltage] = useState(12);
  const [fieldStrength, setFieldStrength] = useState(50);
  const [coilTurns, setCoilTurns] = useState(20);
  const [motorType, setMotorType] = useState<"dc" | "ac">("dc");
  const [isRunning, setIsRunning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [speed, setSpeed] = useState(0);

  const texts = {
    ar: {
      title: "محاكي المحرك الكهربائي",
      description: "استكشف مبدأ عمل المحرك الكهربائي وقوة لورنتز",
      voltage: "الجهد (V)",
      fieldStrength: "قوة المجال المغناطيسي",
      coilTurns: "لفات الملف",
      motorType: "نوع المحرك",
      dc: "تيار مستمر (DC)",
      ac: "تيار متردد (AC)",
      rpm: "سرعة الدوران (RPM)",
      torque: "عزم الدوران",
      power: "القدرة",
      efficiency: "الكفاءة",
      start: "تشغيل",
      stop: "إيقاف",
      reset: "إعادة",
      north: "شمال",
      south: "جنوب",
      explanation: "التفسير الفيزيائي",
      lorentzForce: "قوة لورنتز",
      lorentzForceText: "F = IL × B - القوة المؤثرة على سلك يحمل تيار في مجال مغناطيسي",
      motorPrinciple: "مبدأ المحرك",
      motorPrincipleText: "يتحول التيار الكهربائي إلى حركة دورانية بسبب تأثير المجال المغناطيسي على الملف الحامل للتيار",
      commutator: "المبدّل (Commutator)",
      commutatorText: "في محرك DC، يُعكس اتجاه التيار كل نصف دورة للحفاظ على استمرارية الدوران",
      rightHandRule: "قاعدة اليد اليمنى: الإبهام (التيار)، السبابة (المجال)، الوسطى (القوة)",
    },
    en: {
      title: "Electric Motor Simulator",
      description: "Explore the electric motor principle and Lorentz force",
      voltage: "Voltage (V)",
      fieldStrength: "Magnetic Field Strength",
      coilTurns: "Coil Turns",
      motorType: "Motor Type",
      dc: "DC Motor",
      ac: "AC Motor",
      rpm: "Rotation Speed (RPM)",
      torque: "Torque",
      power: "Power",
      efficiency: "Efficiency",
      start: "Start",
      stop: "Stop",
      reset: "Reset",
      north: "N",
      south: "S",
      explanation: "Physical Explanation",
      lorentzForce: "Lorentz Force",
      lorentzForceText: "F = IL × B - Force on a current-carrying wire in a magnetic field",
      motorPrinciple: "Motor Principle",
      motorPrincipleText: "Electric current is converted to rotational motion due to the magnetic field effect on the current-carrying coil",
      commutator: "Commutator",
      commutatorText: "In DC motors, current direction reverses every half turn to maintain continuous rotation",
      rightHandRule: "Right Hand Rule: Thumb (current), Index (field), Middle (force)",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Calculate motor parameters
  const calculateTorque = useCallback(() => {
    // τ = N × I × A × B × sin(θ)
    const current = voltage / 10; // Simplified: R = 10Ω
    const area = 0.01; // 100 cm²
    const B = fieldStrength * 0.001; // Tesla
    const tau = coilTurns * current * area * B * Math.abs(Math.sin(angle));
    return tau;
  }, [voltage, fieldStrength, coilTurns, angle]);

  const calculatePower = useCallback(() => {
    const tau = calculateTorque();
    const omega = speed * 2 * Math.PI / 60; // rad/s
    return tau * omega;
  }, [calculateTorque, speed]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw permanent magnets (stator)
    const magnetWidth = 60;
    const magnetHeight = 150;
    const magnetGap = 140;

    // Left magnet (N pole - red)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(centerX - magnetGap / 2 - magnetWidth, centerY - magnetHeight / 2, magnetWidth, magnetHeight);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t.north, centerX - magnetGap / 2 - magnetWidth / 2, centerY);

    // Right magnet (S pole - blue)
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(centerX + magnetGap / 2, centerY - magnetHeight / 2, magnetWidth, magnetHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(t.south, centerX + magnetGap / 2 + magnetWidth / 2, centerY);

    // Draw magnetic field lines between magnets
    ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
    ctx.lineWidth = 1.5;
    for (let i = -3; i <= 3; i++) {
      const y = centerY + i * 20;
      ctx.beginPath();
      ctx.moveTo(centerX - magnetGap / 2, y);
      ctx.lineTo(centerX + magnetGap / 2, y);
      ctx.stroke();
      
      // Arrow heads
      ctx.fillStyle = "rgba(168, 85, 247, 0.6)";
      ctx.beginPath();
      ctx.moveTo(centerX + magnetGap / 2 - 5, y);
      ctx.lineTo(centerX + magnetGap / 2 - 12, y - 4);
      ctx.lineTo(centerX + magnetGap / 2 - 12, y + 4);
      ctx.fill();
    }

    // Draw rotor (rotating coil)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // Coil (armature)
    const coilLength = 80;
    const coilWidth = 50;

    // Draw coil rectangle
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.strokeRect(-coilLength / 2, -coilWidth / 2, coilLength, coilWidth);

    // Draw coil sides (where force acts)
    const current = isRunning ? voltage / 10 : 0;
    if (isRunning && current > 0) {
      // Force on left side (into page or out depending on angle)
      const forceIndicator = Math.sin(angle);
      const leftForceColor = forceIndicator > 0 ? "#22c55e" : "#ef4444";
      const rightForceColor = forceIndicator > 0 ? "#ef4444" : "#22c55e";
      
      // Left side force arrow
      ctx.fillStyle = leftForceColor;
      ctx.beginPath();
      ctx.arc(-coilLength / 2, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      if (forceIndicator > 0) {
        // Into page (X)
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-coilLength / 2 - 4, -4);
        ctx.lineTo(-coilLength / 2 + 4, 4);
        ctx.moveTo(-coilLength / 2 + 4, -4);
        ctx.lineTo(-coilLength / 2 - 4, 4);
        ctx.stroke();
      } else {
        // Out of page (dot)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-coilLength / 2, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Right side force arrow
      ctx.fillStyle = rightForceColor;
      ctx.beginPath();
      ctx.arc(coilLength / 2, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      if (forceIndicator < 0) {
        // Into page (X)
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(coilLength / 2 - 4, -4);
        ctx.lineTo(coilLength / 2 + 4, 4);
        ctx.moveTo(coilLength / 2 + 4, -4);
        ctx.lineTo(coilLength / 2 - 4, 4);
        ctx.stroke();
      } else {
        // Out of page (dot)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(coilLength / 2, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw shaft
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Draw commutator (for DC motor)
    if (motorType === "dc") {
      const commutatorY = centerY + 100;
      
      // Commutator segments
      ctx.save();
      ctx.translate(centerX, commutatorY);
      ctx.rotate(angle);
      
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(-15, -8, 15, 16);
      ctx.fillStyle = "#b45309";
      ctx.fillRect(0, -8, 15, 16);
      
      ctx.restore();

      // Brushes
      ctx.fillStyle = "#374151";
      ctx.fillRect(centerX - 35, commutatorY - 5, 15, 10);
      ctx.fillRect(centerX + 20, commutatorY - 5, 15, 10);

      // Brush labels
      ctx.fillStyle = "#ef4444";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("+", centerX - 28, commutatorY + 20);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("-", centerX + 28, commutatorY + 20);

      // Wires to brushes
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 28, commutatorY + 5);
      ctx.lineTo(centerX - 28, commutatorY + 40);
      ctx.stroke();
      
      ctx.strokeStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(centerX + 28, commutatorY + 5);
      ctx.lineTo(centerX + 28, commutatorY + 40);
      ctx.stroke();

      // Battery symbol
      const batteryX = centerX;
      const batteryY = commutatorY + 50;
      
      ctx.fillStyle = "#374151";
      ctx.fillRect(batteryX - 20, batteryY, 40, 15);
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(batteryX - 5, batteryY - 5, 10, 5);
      
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 10px system-ui";
      ctx.fillText("+", batteryX - 10, batteryY + 10);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("-", batteryX + 10, batteryY + 10);
    }

    // Draw rotation direction indicator
    if (isRunning && speed > 0) {
      const arrowRadius = 60;
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, arrowRadius, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(centerX + arrowRadius * Math.cos(Math.PI / 4), centerY - arrowRadius * Math.sin(Math.PI / 4));
      ctx.lineTo(centerX + arrowRadius * Math.cos(Math.PI / 4) + 10, centerY - arrowRadius * Math.sin(Math.PI / 4) - 5);
      ctx.lineTo(centerX + arrowRadius * Math.cos(Math.PI / 4) + 5, centerY - arrowRadius * Math.sin(Math.PI / 4) + 10);
      ctx.fill();
    }

    // Speed indicator
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`${t.rpm}: ${speed.toFixed(0)}`, 10, 20);

  }, [voltage, fieldStrength, coilTurns, motorType, isRunning, angle, speed, t]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (isRunning) {
      // Calculate speed based on voltage and field strength
      const targetSpeed = (voltage * fieldStrength * coilTurns) / 50;
      
      const animate = () => {
        setSpeed(prev => {
          const diff = targetSpeed - prev;
          return prev + diff * 0.05; // Gradual acceleration
        });
        
        setAngle(prev => {
          const rotationSpeed = speed / 60 * Math.PI * 2 / 60; // radians per frame at 60fps
          return prev + rotationSpeed;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Gradual deceleration
      const decelerate = () => {
        setSpeed(prev => {
          if (prev < 1) {
            setSpeed(0);
            return 0;
          }
          return prev * 0.98;
        });
        
        setAngle(prev => prev + (speed / 60 * Math.PI * 2 / 60));
        
        if (speed > 1) {
          animationRef.current = requestAnimationFrame(decelerate);
        }
      };
      animationRef.current = requestAnimationFrame(decelerate);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, voltage, fieldStrength, coilTurns, speed]);

  const torque = calculateTorque();
  const power = calculatePower();
  const efficiency = 85 + (fieldStrength / 100) * 10;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-rose-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Motor Type Selection */}
        <div className={`flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant={motorType === "dc" ? "default" : "outline"} 
            onClick={() => setMotorType("dc")} 
            size="sm" 
            className={motorType === "dc" ? "bg-rose-500" : ""}
          >
            {t.dc}
          </Button>
          <Button 
            variant={motorType === "ac" ? "default" : "outline"} 
            onClick={() => setMotorType("ac")} 
            size="sm" 
            className={motorType === "ac" ? "bg-rose-500" : ""}
          >
            {t.ac}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.voltage}</label>
              <Badge>{voltage}V</Badge>
            </div>
            <Slider 
              value={[voltage]} 
              onValueChange={([v]) => setVoltage(v)} 
              min={3} 
              max={24} 
              step={1}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <label className="text-sm">{t.fieldStrength}</label>
              <Badge>{fieldStrength}%</Badge>
            </div>
            <Slider 
              value={[fieldStrength]} 
              onValueChange={([v]) => setFieldStrength(v)} 
              min={20} 
              max={100} 
              step={5}
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
              max={50} 
              step={5}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={500} height={350} className="w-full bg-white" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 bg-rose-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.rpm}</p>
            <p className="font-bold text-lg text-rose-600">{speed.toFixed(0)}</p>
          </div>
          <div className={`p-3 bg-pink-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.torque}</p>
            <p className="font-bold text-lg">{(torque * 1000).toFixed(2)} mN·m</p>
          </div>
          <div className={`p-3 bg-fuchsia-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.power}</p>
            <p className="font-bold text-lg">{(power * 1000).toFixed(2)} mW</p>
          </div>
          <div className={`p-3 bg-violet-50 rounded-lg ${isRTL ? "text-right" : "text-center"}`}>
            <p className="text-xs text-slate-500">{t.efficiency}</p>
            <p className="font-bold text-lg">{efficiency.toFixed(0)}%</p>
          </div>
        </div>

        {/* Physical Explanation */}
        <div className={`p-4 bg-rose-50 rounded-lg ${isRTL ? "text-right" : ""}`}>
          <div className="space-y-3">
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Activity className="w-4 h-4 text-rose-500" />
              <span className="font-medium text-rose-700">{t.lorentzForce}</span>
            </div>
            <p className="text-sm font-mono">{t.lorentzForceText}</p>
            
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-amber-700">{t.motorPrinciple}</span>
            </div>
            <p className="text-sm text-slate-600">{t.motorPrincipleText}</p>
            
            {motorType === "dc" && (
              <>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700">{t.commutator}</span>
                </div>
                <p className="text-sm text-slate-600">{t.commutatorText}</p>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-rose-500 hover:bg-rose-600"}
          >
            <Zap className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {isRunning ? t.stop : t.start}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { 
              setIsRunning(false); 
              setAngle(0);
              setSpeed(0);
              setVoltage(12);
              setFieldStrength(50);
              setCoilTurns(20);
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
