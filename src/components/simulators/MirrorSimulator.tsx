"use client";

import { useState } from "react";

interface MirrorSimulatorProps {
  language: "ar" | "en";
}

export function MirrorSimulator({ language }: MirrorSimulatorProps) {
  const [objectDistance, setObjectDistance] = useState(20);

  const texts = {
    ar: {
      title: "محاكاة المرايا",
      objectDistance: "بعد الجسم",
      imageDistance: "بعد الصورة",
      magnification: "التكبير",
    },
    en: {
      title: "Mirror Simulator",
      objectDistance: "Object Distance",
      imageDistance: "Image Distance",
      magnification: "Magnification",
    },
  };

  const t = texts[language];
  const focalLength = 10;
  const imageDistance = (focalLength * objectDistance) / (objectDistance - focalLength);
  const magnification = -imageDistance / objectDistance;

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">{t.title}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t.objectDistance}: {objectDistance}cm</label>
          <input
            type="range"
            min="11"
            max="100"
            value={objectDistance}
            onChange={(e) => setObjectDistance(Number(e.target.value))}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.imageDistance}</p>
            <p className="text-2xl font-bold text-blue-600">{imageDistance.toFixed(1)}cm</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-sm text-slate-500">{t.magnification}</p>
            <p className="text-2xl font-bold text-green-600">{magnification.toFixed(2)}x</p>
          </div>
        </div>
      </div>
    </div>
  );
}
