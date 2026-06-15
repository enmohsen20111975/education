"use client";

import { useState } from "react";

interface ProbabilitySimulatorProps {
  language: "ar" | "en";
}

export function ProbabilitySimulator({ language }: ProbabilitySimulatorProps) {
  const [coinFlips, setCoinFlips] = useState(10);
  const [results, setResults] = useState<{heads: number, tails: number} | null>(null);

  const flipCoins = () => {
    let heads = 0;
    for (let i = 0; i < coinFlips; i++) {
      if (Math.random() > 0.5) heads++;
    }
    setResults({ heads, tails: coinFlips - heads });
  };

  const texts = {
    ar: {
      title: "محاكاة الاحتمالات",
      flips: "عدد الرميات",
      flip: "ارمِ",
      heads: "صور",
      tails: "كتابة",
      probability: "الاحتمال",
    },
    en: {
      title: "Probability Simulator",
      flips: "Number of Flips",
      flip: "Flip",
      heads: "Heads",
      tails: "Tails",
      probability: "Probability",
    },
  };

  const t = texts[language];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">{t.title}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t.flips}: {coinFlips}</label>
          <input
            type="range"
            min="1"
            max="100"
            value={coinFlips}
            onChange={(e) => setCoinFlips(Number(e.target.value))}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <button
          onClick={flipCoins}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:opacity-90 transition"
        >
          {t.flip} 🪙
        </button>
        {results && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-4xl mb-2">👑</p>
              <p className="text-sm text-slate-500">{t.heads}</p>
              <p className="text-2xl font-bold text-yellow-600">{results.heads}</p>
              <p className="text-sm text-slate-400">{((results.heads / coinFlips) * 100).toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-4xl mb-2">📖</p>
              <p className="text-sm text-slate-500">{t.tails}</p>
              <p className="text-2xl font-bold text-slate-600">{results.tails}</p>
              <p className="text-sm text-slate-400">{((results.tails / coinFlips) * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
