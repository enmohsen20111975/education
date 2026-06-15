"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Atom, Play, Pause, Waves } from "lucide-react";

interface MetallicBondSimulatorProps {
  language: "ar" | "en";
}

// Metal properties
const metals = {
  Na: { name: { ar: "صوديوم", en: "Sodium" }, symbol: "Na", valence: 1, meltingPoint: 98, conductivity: 0.35, color: "#a3a3a3" },
  Mg: { name: { ar: "مغنيسيوم", en: "Magnesium" }, symbol: "Mg", valence: 2, meltingPoint: 650, conductivity: 0.53, color: "#d4d4d4" },
  Al: { name: { ar: "ألومنيوم", en: "Aluminum" }, symbol: "Al", valence: 3, meltingPoint: 660, conductivity: 0.61, color: "#e5e5e5" },
  Fe: { name: { ar: "حديد", en: "Iron" }, symbol: "Fe", valence: 2, meltingPoint: 1538, conductivity: 0.17, color: "#737373" },
  Cu: { name: { ar: "نحاس", en: "Copper" }, symbol: "Cu", valence: 1, meltingPoint: 1085, conductivity: 1.0, color: "#f59e0b" },
  Au: { name: { ar: "ذهب", en: "Gold" }, symbol: "Au", valence: 1, meltingPoint: 1064, conductivity: 0.70, color: "#fcd34d" },
  Ag: { name: { ar: "فضة", en: "Silver" }, symbol: "Ag", valence: 1, meltingPoint: 962, conductivity: 1.0, color: "#f5f5f5" },
  Zn: { name: { ar: "زنك", en: "Zinc" }, symbol: "Zn", valence: 2, meltingPoint: 420, conductivity: 0.29, color: "#94a3b8" },
};

export function MetallicBondSimulator({ language }: MetallicBondSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [selectedMetal, setSelectedMetal] = useState<keyof typeof metals>("Cu");
  const [temperature, setTemperature] = useState(25);
  const [voltage, setVoltage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [electronDensity, setElectronDensity] = useState(50);
  const [showSeaOfElectrons, setShowSeaOfElectrons] = useState(true);

  const texts = {
    ar: {
      title: "محاكي الرابطة الفلزية",
      description: "استكشف بحر الإلكترونات والخصائص الفلزية",
      selectMetal: "اختر الفلز",
      seaOfElectrons: "بحر الإلكترونات",
      electronDensity: "كثافة الإلكترونات الحرة",
      temperature: "الحرارة (°C)",
      voltage: "الجهد الكهربي (V)",
      conductivity: "التوصيل الكهربي",
      meltingPoint: "درجة الانصهار",
      valenceElectrons: "إلكترونات التكافؤ",
      metallicProperties: "الخصائص الفلزية",
      malleability: "القابلية للطرق",
      ductility: "القابلية للسحب",
      thermalConductivity: "التوصيل الحراري",
      luster: "البريق",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      explanation: "التفسير الكيميائي",
      electronSea: "بحر الإلكترونات",
      delocalizedElectrons: "الإلكترونات الحرة (غير المتمركزة)",
      metallicBond: "الرابطة الفلزية",
      positiveIons: "الأيونات الموجبة",
      electricalConductivity: "التوصيل الكهربي",
      showElectronSea: "إظهار بحر الإلكترونات",
      currentFlow: "تدفق التيار",
    },
    en: {
      title: "Metallic Bond Simulator",
      description: "Explore the sea of electrons and metallic properties",
      selectMetal: "Select Metal",
      seaOfElectrons: "Sea of Electrons",
      electronDensity: "Free Electron Density",
      temperature: "Temperature (°C)",
      voltage: "Voltage (V)",
      conductivity: "Electrical Conductivity",
      meltingPoint: "Melting Point",
      valenceElectrons: "Valence Electrons",
      metallicProperties: "Metallic Properties",
      malleability: "Malleability",
      ductility: "Ductility",
      thermalConductivity: "Thermal Conductivity",
      luster: "Luster",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      explanation: "Chemical Explanation",
      electronSea: "Sea of Electrons",
      delocalizedElectrons: "Delocalized Electrons",
      metallicBond: "Metallic Bond",
      positiveIons: "Positive Ions",
      electricalConductivity: "Electrical Conductivity",
      showElectronSea: "Show Sea of Electrons",
      currentFlow: "Current Flow",
    },
  };

  const t = texts[language];
  const metal = metals[selectedMetal];

  // Calculate thermal motion based on temperature
  const thermalMotion = Math.min(temperature / 200, 2);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#e2e8f0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const time = Date.now() / 1000;
    const gridSize = 5;
    const spacing = Math.min(width, height) / (gridSize + 1);
    const offsetX = (width - spacing * (gridSize - 1)) / 2;
    const offsetY = (height - spacing * (gridSize - 1)) / 2;

    // Draw sea of electrons (delocalized electron cloud)
    if (showSeaOfElectrons) {
      const electronCloudAlpha = electronDensity / 100 * 0.3;
      ctx.fillStyle = `rgba(59, 130, 246, ${electronCloudAlpha})`;
      
      // Draw electron cloud as overlapping circles
      for (let i = 0; i < electronDensity / 5; i++) {
        const x = offsetX + Math.random() * (width - offsetX * 2);
        const y = offsetY + Math.random() * (height - offsetY * 2);
        const radius = 30 + Math.random() * 20;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw free electrons (animated)
    const freeElectronCount = Math.floor(electronDensity / 3);
    ctx.fillStyle = "#3b82f6";
    
    for (let i = 0; i < freeElectronCount; i++) {
      const baseX = offsetX + Math.random() * (width - offsetX * 2);
      const baseY = offsetY + Math.random() * (height - offsetY * 2);
      
      // Add voltage-induced drift
      const driftX = voltage * 20 * time;
      
      // Random thermal motion
      const thermalX = Math.sin(time * 3 + i * 0.5) * thermalMotion * 10;
      const thermalY = Math.cos(time * 2.5 + i * 0.7) * thermalMotion * 10;
      
      const x = baseX + thermalX + (isAnimating ? driftX % width : 0);
      const y = baseY + thermalY;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw electron trail when voltage applied
      if (voltage > 0 && isAnimating) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - voltage * 30, y);
        ctx.stroke();
      }
    }

    // Draw metal ion lattice
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = offsetX + col * spacing;
        const y = offsetY + row * spacing;
        
        // Add thermal vibration
        const vibX = Math.sin(time * 5 + row * 0.3 + col * 0.5) * thermalMotion * 3;
        const vibY = Math.cos(time * 4 + row * 0.4 + col * 0.6) * thermalMotion * 3;
        
        // Draw ion
        const ionRadius = 18;
        
        // Outer glow
        const ionGradient = ctx.createRadialGradient(
          x + vibX, y + vibY, 0,
          x + vibX, y + vibY, ionRadius * 1.5
        );
        ionGradient.addColorStop(0, metal.color);
        ionGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = ionGradient;
        ctx.beginPath();
        ctx.arc(x + vibX, y + vibY, ionRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Ion body
        ctx.fillStyle = metal.color;
        ctx.beginPath();
        ctx.arc(x + vibX, y + vibY, ionRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Ion border
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Ion symbol
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(metal.symbol, x + vibX, y + vibY);
        
        // Positive charge indicator
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 10px system-ui";
        ctx.fillText("+", x + vibX + ionRadius - 5, y + vibY - ionRadius + 5);
      }
    }

    // Draw voltage indicators
    if (voltage > 0) {
      // Positive terminal
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("+", 20, height / 2);
      
      // Negative terminal
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("-", width - 20, height / 2);
      
      // Current direction arrow
      if (isAnimating) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, height / 2);
        ctx.lineTo(width - 30, height / 2);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(width - 40, height / 2 - 8);
        ctx.lineTo(width - 30, height / 2);
        ctx.lineTo(width - 40, height / 2 + 8);
        ctx.stroke();
      }
    }

    // Temperature indicator
    ctx.fillStyle = temperature > metal.meltingPoint / 2 ? "#ef4444" : "#3b82f6";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${temperature}°C`, width / 2, height - 10);

  }, [selectedMetal, temperature, voltage, electronDensity, showSeaOfElectrons, isAnimating, thermalMotion]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation loop
  useEffect(() => {
    if (isAnimating) {
      let frameId: number;
      const animate = () => {
        drawCanvas();
        frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }
  }, [isAnimating, drawCanvas]);

  const reset = () => {
    setTemperature(25);
    setVoltage(0);
    setElectronDensity(50);
    setIsAnimating(true);
  };

  // Calculate conductivity percentage
  const conductivityPercent = (metal.conductivity * 100).toFixed(0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-slate-300">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Metal Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectMetal}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metals).map(([key, m]) => (
              <Button
                key={key}
                variant={selectedMetal === key ? "default" : "outline"}
                onClick={() => setSelectedMetal(key as keyof typeof metals)}
                size="sm"
                className={selectedMetal === key ? "bg-slate-700" : ""}
              >
                {m.symbol}
              </Button>
            ))}
          </div>
        </div>

        {/* Show Electron Sea Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="electronSea"
            checked={showSeaOfElectrons}
            onChange={(e) => setShowSeaOfElectrons(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="electronSea" className="text-sm">{t.showElectronSea}</label>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.electronDensity}</label>
              <Badge>{electronDensity}%</Badge>
            </div>
            <Slider
              value={[electronDensity]}
              onValueChange={([v]) => setElectronDensity(v)}
              min={10}
              max={100}
              step={5}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.temperature}</label>
              <Badge>{temperature}°C</Badge>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={0}
              max={1500}
              step={10}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">{t.voltage}</label>
              <Badge>{voltage}V</Badge>
            </div>
            <Slider
              value={[voltage]}
              onValueChange={([v]) => setVoltage(v)}
              min={0}
              max={12}
              step={1}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas ref={canvasRef} width={550} height={320} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.conductivity}</p>
            <p className="font-bold text-blue-600">{conductivityPercent}%</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.meltingPoint}</p>
            <p className="font-bold text-orange-600">{metal.meltingPoint}°C</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.valenceElectrons}</p>
            <p className="font-bold text-green-600">{metal.valence}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg text-center">
            <p className="text-xs text-slate-500">{language === "ar" ? metal.name.ar : metal.name.en}</p>
            <p className="font-bold text-slate-600">{metal.symbol}</p>
          </div>
        </div>

        {/* Metallic Properties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-violet-50 rounded-lg">
            <p className="text-xs text-slate-500">{t.malleability}</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-4 h-2 rounded ${i <= metal.valence + 2 ? "bg-violet-500" : "bg-violet-200"}`} />
              ))}
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-slate-500">{t.ductility}</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-4 h-2 rounded ${i <= metal.valence + 2 ? "bg-purple-500" : "bg-purple-200"}`} />
              ))}
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-slate-500">{t.thermalConductivity}</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-4 h-2 rounded ${i <= metal.conductivity * 5 ? "bg-amber-500" : "bg-amber-200"}`} />
              ))}
            </div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-slate-500">{t.luster}</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-4 h-2 rounded ${i <= 4 ? "bg-yellow-500" : "bg-yellow-200"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Chemical Explanation */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
          <h4 className="font-bold flex items-center gap-2">
            <Atom className="w-4 h-4" />
            {t.explanation}
          </h4>
          <p className="text-sm text-slate-600">
            {language === "ar" ? (
              <>
                في الفلزات، تتأين ذرات <strong>{metal.name.ar}</strong> وتصبح أيونات موجبة ({"+"}{metal.valence}).
                الإلكترونات الخارجية تصبح <strong>حرة (غير متمركزة)</strong> وتتحرك عبر الشبكة البلورية مكونة <strong>"بحر الإلكترونات"</strong>.
                هذه الإلكترونات الحرة هي المسؤولة عن خصائص الفلزات: التوصيل الكهربي والحراري، اللمعان، القابلية للطرق والسحب.
              </>
            ) : (
              <>
                In metals, <strong>{metal.name.en}</strong> atoms ionize to become positive ions (+{metal.valence}).
                Outer electrons become <strong>delocalized</strong> and move freely through the crystal lattice forming a <strong>"sea of electrons"</strong>.
                These free electrons are responsible for metallic properties: electrical and thermal conductivity, luster, malleability, and ductility.
              </>
            )}
          </p>
          <p className="text-sm text-slate-600">
            <strong>{t.electricalConductivity}:</strong>{" "}
            {language === "ar"
              ? "عند تطبيق جهد كهربي، تتحرك الإلكترونات الحرة في اتجاه واحد مما يولد تياراً كهربائياً."
              : "When voltage is applied, free electrons move in one direction, generating an electric current."}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-slate-700 hover:bg-slate-800">
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
