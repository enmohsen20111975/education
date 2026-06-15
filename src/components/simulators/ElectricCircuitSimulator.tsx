"use client";

import { useState } from "react";

interface ElectricCircuitSimulatorProps {
  language: "ar" | "en";
}

export function ElectricCircuitSimulator({ language }: ElectricCircuitSimulatorProps) {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(100);

  const current = voltage / resistance;
  const power = voltage * current;

  const texts = {
    ar: {
      title: "محاكاة الدوائر الكهربائية",
      voltage: "الجهد (V)",
      resistance: "المقاومة (Ω)",
      current: "التيار (A)",
      power: "القدرة (W)",
    },
    en: {
      title: "Electric Circuit Simulator",
      voltage: "Voltage (V)",
      resistance: "Resistance (Ω)",
      current: "Current (A)",
      power: "Power (W)",
    },
  };

  const t = texts[language];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">{t.title}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t.voltage}: {voltage}V</label>
          <input
            type="range"
            min="1"
            max="24"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t.resistance}: {resistance}Ω</label>
          <input
            type="range"
            min="10"
            max="1000"
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.current}</p>
            <p className="text-2xl font-bold text-blue-600">{(current * 1000).toFixed(1)}mA</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.power}</p>
            <p className="text-2xl font-bold text-green-600">{(power * 1000).toFixed(1)}mW</p>
          </div>
        </div>
      </div>
    </div>
  );
}
