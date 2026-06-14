"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Zap, Battery, Lightbulb, RotateCcw } from "lucide-react";

interface ElectricCircuitSimulationProps {
  language: "ar" | "en";
}

export function ElectricCircuitSimulation({ language }: ElectricCircuitSimulationProps) {
  // Circuit parameters
  const [voltage, setVoltage] = useState(12); // Volts
  const [resistance, setResistance] = useState(100); // Ohms
  const [isConnected, setIsConnected] = useState(false);
  
  // Calculated values
  const current = isConnected ? (voltage / resistance) * 1000 : 0; // mA
  const power = isConnected ? (voltage * voltage) / resistance : 0; // Watts
  const bulbBrightness = Math.min(100, (current / 500) * 100);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكاة الدوائر الكهربائية" : "Electric Circuit Simulation",
    voltage: isRTL ? "الجهد (فولت)" : "Voltage (V)",
    resistance: isRTL ? "المقاومة (أوم)" : "Resistance (Ω)",
    current: isRTL ? "التيار (ملي أمبير)" : "Current (mA)",
    power: isRTL ? "القدرة (واط)" : "Power (W)",
    connect: isRTL ? "تشغيل" : "Connect",
    disconnect: isRTL ? "إيقاف" : "Disconnect",
    reset: isRTL ? "إعادة" : "Reset",
    ohmLaw: isRTL ? "قانون أوم: ت = ج / م" : "Ohm's Law: I = V / R",
    powerFormula: isRTL ? "القدرة: ق = ج² / م" : "Power: P = V² / R"
  };

  const handleReset = () => {
    setVoltage(12);
    setResistance(100);
    setIsConnected(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circuit Visualization */}
        <div className="relative bg-slate-100 dark:bg-slate-800 rounded-xl p-8 min-h-[300px]">
          <svg viewBox="0 0 400 250" className="w-full h-auto">
            {/* Wires */}
            <path
              d="M 50 50 L 50 200 L 350 200 L 350 50"
              fill="none"
              stroke={isConnected ? "#3b82f6" : "#94a3b8"}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 50 50 L 175 50"
              fill="none"
              stroke={isConnected ? "#3b82f6" : "#94a3b8"}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 225 50 L 350 50"
              fill="none"
              stroke={isConnected ? "#3b82f6" : "#94a3b8"}
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Battery */}
            <g transform="translate(50, 100)">
              <rect x="-15" y="-40" width="30" height="80" fill="#1e293b" rx="5" />
              <rect x="-10" y="-45" width="20" height="10" fill="#475569" rx="2" />
              <text x="0" y="0" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {voltage}V
              </text>
              <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8">
                + −
              </text>
            </g>
            
            {/* Resistor */}
            <g transform="translate(200, 50)">
              <rect x="-25" y="-12" width="50" height="24" fill="#a78bfa" rx="3" />
              <text x="0" y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                {resistance}Ω
              </text>
              {/* Resistor bands */}
              <rect x="-20" y="-12" width="4" height="24" fill="#ef4444" />
              <rect x="-10" y="-12" width="4" height="24" fill="#22c55e" />
              <rect x="0" y="-12" width="4" height="24" fill="#eab308" />
            </g>
            
            {/* Light Bulb */}
            <g transform="translate(350, 100)">
              {/* Bulb glow */}
              {isConnected && (
                <circle
                  cx="0"
                  cy="-10"
                  r="40"
                  fill={`rgba(255, 200, 0, ${bulbBrightness / 200})`}
                  filter="blur(10px)"
                />
              )}
              {/* Bulb shape */}
              <ellipse
                cx="0"
                cy="-10"
                rx="25"
                ry="30"
                fill={isConnected ? `rgb(255, ${200 + bulbBrightness * 0.55}, ${100 - bulbBrightness * 0.5})` : "#e2e8f0"}
                stroke="#94a3b8"
                strokeWidth="2"
              />
              {/* Filament */}
              <path
                d="M -8 -5 Q -4 -15 0 -5 Q 4 5 8 -5"
                fill="none"
                stroke={isConnected ? "#f97316" : "#94a3b8"}
                strokeWidth="2"
              />
              {/* Base */}
              <rect x="-15" y="20" width="30" height="15" fill="#64748b" rx="2" />
            </g>
            
            {/* Current flow animation */}
            {isConnected && (
              <>
                <circle r="4" fill="#fbbf24">
                  <animateMotion dur={`${2 / (current / 100)}s`} repeatCount="indefinite">
                    <mpath href="#currentPath" />
                  </animateMotion>
                </circle>
                <path
                  id="currentPath"
                  d="M 50 50 L 50 200 L 350 200 L 350 50 L 225 50 L 175 50 L 50 50"
                  fill="none"
                  stroke="transparent"
                />
              </>
            )}
            
            {/* Switch */}
            <g transform="translate(125, 50)">
              <circle cx="0" cy="0" r="6" fill="#64748b" />
              <line
                x1="0"
                y1="0"
                x2="30"
                y2={isConnected ? 0 : -15}
                stroke="#64748b"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ transition: "all 0.3s ease" }}
              />
              <circle cx="50" cy="0" r="6" fill="#64748b" />
            </g>
          </svg>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voltage Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Battery className="w-4 h-4" /> {labels.voltage}
            </Label>
            <Slider
              value={[voltage]}
              onValueChange={(v) => setVoltage(v[0])}
              min={1}
              max={24}
              step={1}
            />
            <div className="text-center font-mono text-lg font-bold text-green-600">
              {voltage} V
            </div>
          </div>
          
          {/* Resistance Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{labels.resistance}</Label>
            <Slider
              value={[resistance]}
              onValueChange={(v) => setResistance(v[0])}
              min={10}
              max={1000}
              step={10}
            />
            <div className="text-center font-mono text-lg font-bold text-purple-600">
              {resistance} Ω
            </div>
          </div>
        </div>
        
        {/* Measurements */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <div className="text-sm text-slate-500">{labels.current}</div>
            <div className="text-2xl font-mono font-bold text-blue-600">
              {current.toFixed(2)} mA
            </div>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
            <div className="text-sm text-slate-500">{labels.power}</div>
            <div className="text-2xl font-mono font-bold text-orange-600">
              {power.toFixed(3)} W
            </div>
          </div>
        </div>
        
        {/* Formulas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg text-center">
            <p className="font-mono text-sm font-bold text-blue-600">{labels.ohmLaw}</p>
            <p className="text-xs text-slate-500 mt-1">
              I = {voltage} / {resistance} = {(voltage / resistance * 1000).toFixed(2)} mA
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg text-center">
            <p className="font-mono text-sm font-bold text-orange-600">{labels.powerFormula}</p>
            <p className="text-xs text-slate-500 mt-1">
              P = {voltage}² / {resistance} = {power.toFixed(3)} W
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setIsConnected(!isConnected)}
            className={`gap-2 ${isConnected ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            <Zap className="w-4 h-4" />
            {isConnected ? labels.disconnect : labels.connect}
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {labels.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
