"use client";

import { useState } from "react";

interface StatisticsSimulatorProps {
  language: "ar" | "en";
}

export function StatisticsSimulator({ language }: StatisticsSimulatorProps) {
  const [numbers, setNumbers] = useState("5, 8, 12, 15, 20, 25, 30");

  const nums = numbers.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  const mean = nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const median = sorted.length > 0 ? (sorted.length % 2 === 0 ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 : sorted[Math.floor(sorted.length/2)]) : 0;
  const variance = nums.length > 0 ? nums.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / nums.length : 0;
  const stdDev = Math.sqrt(variance);

  const texts = {
    ar: {
      title: "محاكاة الإحصاء",
      enterNumbers: "أدخل الأرقام (مفصولة بفواصل)",
      mean: "المتوسط",
      median: "الوسيط",
      stdDev: "الانحراف المعياري",
      count: "العدد",
    },
    en: {
      title: "Statistics Simulator",
      enterNumbers: "Enter numbers (comma separated)",
      mean: "Mean",
      median: "Median",
      stdDev: "Standard Deviation",
      count: "Count",
    },
  };

  const t = texts[language];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">{t.title}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t.enterNumbers}</label>
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-slate-700"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.count}</p>
            <p className="text-2xl font-bold text-purple-600">{nums.length}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.mean}</p>
            <p className="text-2xl font-bold text-blue-600">{mean.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.median}</p>
            <p className="text-2xl font-bold text-green-600">{median.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.stdDev}</p>
            <p className="text-2xl font-bold text-orange-600">{stdDev.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
