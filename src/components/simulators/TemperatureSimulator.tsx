"use client";

import { useState } from "react";

interface TemperatureSimulatorProps {
  language: "ar" | "en";
}

export function TemperatureSimulator({ language }: TemperatureSimulatorProps) {
  const [celsius, setCelsius] = useState(25);

  const fahrenheit = (celsius * 9/5) + 32;
  const kelvin = celsius + 273.15;

  const texts = {
    ar: {
      title: "محاكاة درجة الحرارة",
      celsius: "درجة مئوية",
      fahrenheit: "درجة فهرنهايت",
      kelvin: "كلفن",
    },
    en: {
      title: "Temperature Simulator",
      celsius: "Celsius",
      fahrenheit: "Fahrenheit",
      kelvin: "Kelvin",
    },
  };

  const t = texts[language];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">{t.title}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t.celsius}: {celsius}°C</label>
          <input
            type="range"
            min="-273"
            max="500"
            value={celsius}
            onChange={(e) => setCelsius(Number(e.target.value))}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.fahrenheit}</p>
            <p className="text-2xl font-bold text-blue-600">{fahrenheit.toFixed(1)}°F</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.kelvin}</p>
            <p className="text-2xl font-bold text-green-600">{kelvin.toFixed(1)}K</p>
          </div>
        </div>
      </div>
    </div>
  );
}
