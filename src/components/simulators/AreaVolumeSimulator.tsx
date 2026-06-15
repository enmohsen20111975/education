"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Box, Triangle, Circle, Hexagon } from "lucide-react";

interface AreaVolumeSimulatorProps {
  language: "ar" | "en";
}

type ShapeType = "cube" | "sphere" | "cylinder" | "cone" | "pyramid" | "rectangular";

export function AreaVolumeSimulator({ language }: AreaVolumeSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [shape, setShape] = useState<ShapeType>("cube");
  const [dimension1, setDimension1] = useState(100); // length/radius
  const [dimension2, setDimension2] = useState(100); // width/height
  const [dimension3, setDimension3] = useState(100); // height

  // Text translations
  const texts = {
    ar: {
      title: "حاسبة المساحة والحجم",
      description: "احسب المساحة السطحية والحجم للأشكال الهندسية",
      selectShape: "اختر الشكل",
      cube: "مكعب",
      sphere: "كرة",
      cylinder: "أسطوانة",
      cone: "مخروط",
      pyramid: "هرم مربع",
      rectangular: "متوازي مستطيلات",
      length: "الطول",
      width: "العرض",
      height: "الارتفاع",
      radius: "نصف القطر",
      sideLength: "طول الضلع",
      surfaceArea: "المساحة السطحية",
      volume: "الحجم",
      lateralArea: "المساحة الجانبية",
      baseArea: "مساحة القاعدة",
      reset: "إعادة",
      formulas: "المعادلات",
      cubeAreaFormula: "م = 6 × ل²",
      cubeVolumeFormula: "ح = ل³",
      sphereAreaFormula: "م = 4πن²",
      sphereVolumeFormula: "ح = (4/3)πن³",
      cylinderAreaFormula: "م = 2πن² + 2πنه",
      cylinderVolumeFormula: "ح = πن²هـ",
      coneAreaFormula: "م = πن² + πنل",
      coneVolumeFormula: "ح = (1/3)πن²هـ",
      pyramidAreaFormula: "م = ل² + 2ل×√(ه²+(ل/2)²)",
      pyramidVolumeFormula: "ح = (1/3)×ل²×هـ",
      unit: "وحدة",
      squareUnits: "وحدة²",
      cubicUnits: "وحدة³",
    },
    en: {
      title: "Area & Volume Calculator",
      description: "Calculate surface area and volume of geometric shapes",
      selectShape: "Select Shape",
      cube: "Cube",
      sphere: "Sphere",
      cylinder: "Cylinder",
      cone: "Cone",
      pyramid: "Square Pyramid",
      rectangular: "Rectangular Prism",
      length: "Length",
      width: "Width",
      height: "Height",
      radius: "Radius",
      sideLength: "Side Length",
      surfaceArea: "Surface Area",
      volume: "Volume",
      lateralArea: "Lateral Area",
      baseArea: "Base Area",
      reset: "Reset",
      formulas: "Formulas",
      cubeAreaFormula: "SA = 6 × s²",
      cubeVolumeFormula: "V = s³",
      sphereAreaFormula: "SA = 4πr²",
      sphereVolumeFormula: "V = (4/3)πr³",
      cylinderAreaFormula: "SA = 2πr² + 2πrh",
      cylinderVolumeFormula: "V = πr²h",
      coneAreaFormula: "SA = πr² + πrl",
      coneVolumeFormula: "V = (1/3)πr²h",
      pyramidAreaFormula: "SA = s² + 2s×√(h²+(s/2)²)",
      pyramidVolumeFormula: "V = (1/3)×s²×h",
      unit: "unit",
      squareUnits: "units²",
      cubicUnits: "units³",
    },
  };

  const t = texts[language];

  // Shape configuration
  const shapeConfig: Record<ShapeType, { color: string; icon: React.ReactNode }> = {
    cube: { color: "#3b82f6", icon: <Box className="w-4 h-4" /> },
    sphere: { color: "#22c55e", icon: <Circle className="w-4 h-4" /> },
    cylinder: { color: "#f59e0b", icon: <Circle className="w-4 h-4" /> },
    cone: { color: "#ec4899", icon: <Triangle className="w-4 h-4" /> },
    pyramid: { color: "#8b5cf6", icon: <Hexagon className="w-4 h-4" /> },
    rectangular: { color: "#06b6d4", icon: <Box className="w-4 h-4" /> },
  };

  // Calculate area and volume
  const calculateProperties = () => {
    let surfaceArea = 0;
    let volume = 0;
    let lateralArea = 0;
    let baseArea = 0;

    const l = dimension1;
    const w = dimension2;
    const h = dimension3;

    switch (shape) {
      case "cube":
        surfaceArea = 6 * l * l;
        volume = l * l * l;
        baseArea = l * l;
        lateralArea = 4 * l * l;
        break;
      case "sphere":
        surfaceArea = 4 * Math.PI * l * l;
        volume = (4 / 3) * Math.PI * l * l * l;
        baseArea = 0;
        lateralArea = surfaceArea;
        break;
      case "cylinder":
        baseArea = Math.PI * l * l;
        lateralArea = 2 * Math.PI * l * h;
        surfaceArea = 2 * baseArea + lateralArea;
        volume = Math.PI * l * l * h;
        break;
      case "cone":
        baseArea = Math.PI * l * l;
        const slantHeight = Math.sqrt(l * l + h * h);
        lateralArea = Math.PI * l * slantHeight;
        surfaceArea = baseArea + lateralArea;
        volume = (1 / 3) * Math.PI * l * l * h;
        break;
      case "pyramid":
        baseArea = l * l;
        const slant = Math.sqrt((l / 2) * (l / 2) + h * h);
        lateralArea = 2 * l * slant;
        surfaceArea = baseArea + lateralArea;
        volume = (1 / 3) * l * l * h;
        break;
      case "rectangular":
        surfaceArea = 2 * (l * w + w * h + h * l);
        volume = l * w * h;
        baseArea = l * w;
        lateralArea = 2 * (l * h + w * h);
        break;
    }

    return { surfaceArea, volume, lateralArea, baseArea };
  };

  const props = calculateProperties();

  // Get formulas for current shape
  const getFormulas = () => {
    const formulas: Record<ShapeType, { area: string; volume: string }> = {
      cube: { area: t.cubeAreaFormula, volume: t.cubeVolumeFormula },
      sphere: { area: t.sphereAreaFormula, volume: t.sphereVolumeFormula },
      cylinder: { area: t.cylinderAreaFormula, volume: t.cylinderVolumeFormula },
      cone: { area: t.coneAreaFormula, volume: t.coneVolumeFormula },
      pyramid: { area: t.pyramidAreaFormula, volume: t.pyramidVolumeFormula },
      rectangular: { area: "SA = 2(lw + wh + hl)", volume: "V = l × w × h" },
    };
    return formulas[shape];
  };

  const formulas = getFormulas();

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    const color = shapeConfig[shape].color;
    const scale = Math.min(dimension1, 120) / 100;

    ctx.strokeStyle = color;
    ctx.fillStyle = color + "30";
    ctx.lineWidth = 3;

    switch (shape) {
      case "cube":
      case "rectangular": {
        const size = 80 * scale;
        const depth = shape === "cube" ? size : 60 * (dimension2 / 100);
        const heightOffset = shape === "cube" ? size : 50 * (dimension3 / 100);
        
        // Draw 3D cube/prism
        // Front face
        ctx.beginPath();
        ctx.rect(centerX - size/2, centerY - size/2, size, size);
        ctx.fill();
        ctx.stroke();

        // Top face
        ctx.beginPath();
        ctx.moveTo(centerX - size/2, centerY - size/2);
        ctx.lineTo(centerX - size/2 + depth/2, centerY - size/2 - heightOffset/2);
        ctx.lineTo(centerX + size/2 + depth/2, centerY - size/2 - heightOffset/2);
        ctx.lineTo(centerX + size/2, centerY - size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right face
        ctx.beginPath();
        ctx.moveTo(centerX + size/2, centerY - size/2);
        ctx.lineTo(centerX + size/2 + depth/2, centerY - size/2 - heightOffset/2);
        ctx.lineTo(centerX + size/2 + depth/2, centerY + size/2 - heightOffset/2);
        ctx.lineTo(centerX + size/2, centerY + size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
      case "sphere": {
        // Draw sphere
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw latitude lines
        ctx.strokeStyle = color + "60";
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY - 30 * scale + i * 15 * scale, 80 * scale * (1 - i * 0.2), 20 * scale, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      }
      case "cylinder": {
        const r = 60 * scale;
        const cylHeight = 120 * (dimension3 / 100);
        
        // Draw ellipse at bottom
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + cylHeight/2, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw sides
        ctx.beginPath();
        ctx.moveTo(centerX - r, centerY - cylHeight/2);
        ctx.lineTo(centerX - r, centerY + cylHeight/2);
        ctx.moveTo(centerX + r, centerY - cylHeight/2);
        ctx.lineTo(centerX + r, centerY + cylHeight/2);
        ctx.stroke();

        // Draw top ellipse
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - cylHeight/2, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      }
      case "cone": {
        const r = 60 * scale;
        const coneHeight = 120 * (dimension3 / 100);
        
        // Draw ellipse at base
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + coneHeight/2, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw sides
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - coneHeight/2);
        ctx.lineTo(centerX - r, centerY + coneHeight/2);
        ctx.lineTo(centerX + r, centerY + coneHeight/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
      case "pyramid": {
        const size = 100 * scale;
        const pyrHeight = 100 * (dimension3 / 100);
        
        // Draw base
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 50);
        ctx.lineTo(centerX - size/2, centerY + 20);
        ctx.lineTo(centerX, centerY - 10);
        ctx.lineTo(centerX + size/2, centerY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw sides
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 50);
        ctx.lineTo(centerX, centerY - pyrHeight/2);
        ctx.lineTo(centerX - size/2, centerY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 50);
        ctx.lineTo(centerX, centerY - pyrHeight/2);
        ctx.lineTo(centerX + size/2, centerY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - size/2, centerY + 20);
        ctx.lineTo(centerX, centerY - pyrHeight/2);
        ctx.lineTo(centerX + size/2, centerY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
    }

    // Draw dimensions labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";

  }, [shape, dimension1, dimension2, dimension3]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setShape("cube");
    setDimension1(100);
    setDimension2(100);
    setDimension3(100);
  };

  // Render dimension sliders based on shape
  const renderDimensionSliders = () => {
    switch (shape) {
      case "cube":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.sideLength}</label>
              <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension1}</Badge>
            </div>
            <Slider
              value={[dimension1]}
              onValueChange={([value]) => setDimension1(value)}
              min={20}
              max={200}
              step={5}
            />
          </div>
        );
      case "sphere":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.radius}</label>
              <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension1}</Badge>
            </div>
            <Slider
              value={[dimension1]}
              onValueChange={([value]) => setDimension1(value)}
              min={20}
              max={200}
              step={5}
            />
          </div>
        );
      case "cylinder":
      case "cone":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.radius}</label>
                <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension1}</Badge>
              </div>
              <Slider
                value={[dimension1]}
                onValueChange={([value]) => setDimension1(value)}
                min={20}
                max={150}
                step={5}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.height}</label>
                <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension3}</Badge>
              </div>
              <Slider
                value={[dimension3]}
                onValueChange={([value]) => setDimension3(value)}
                min={20}
                max={200}
                step={5}
              />
            </div>
          </div>
        );
      case "pyramid":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.sideLength}</label>
                <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension1}</Badge>
              </div>
              <Slider
                value={[dimension1]}
                onValueChange={([value]) => setDimension1(value)}
                min={20}
                max={150}
                step={5}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.height}</label>
                <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension3}</Badge>
              </div>
              <Slider
                value={[dimension3]}
                onValueChange={([value]) => setDimension3(value)}
                min={20}
                max={200}
                step={5}
              />
            </div>
          </div>
        );
      case "rectangular":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.length}</label>
                <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension1}</Badge>
              </div>
              <Slider
                value={[dimension1]}
                onValueChange={([value]) => setDimension1(value)}
                min={20}
                max={200}
                step={5}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.width}</label>
                <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension2}</Badge>
              </div>
              <Slider
                value={[dimension2]}
                onValueChange={([value]) => setDimension2(value)}
                min={20}
                max={200}
                step={5}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">{t.height}</label>
                <Badge style={{ backgroundColor: shapeConfig[shape].color }}>{dimension3}</Badge>
              </div>
              <Slider
                value={[dimension3]}
                onValueChange={([value]) => setDimension3(value)}
                min={20}
                max={200}
                step={5}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-orange-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Shape Selection */}
        <div className="space-y-3">
          <label className="font-medium">{t.selectShape}</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {(Object.keys(shapeConfig) as ShapeType[]).map((s) => (
              <Button
                key={s}
                variant={shape === s ? "default" : "outline"}
                onClick={() => setShape(s)}
                className={`flex flex-col items-center p-3 h-auto ${shape === s ? "text-white" : ""}`}
                style={shape === s ? { backgroundColor: shapeConfig[s].color } : {}}
              >
                {shapeConfig[s].icon}
                <span className="text-xs mt-1">{language === "ar" ? t[s as keyof typeof t] : t[s as keyof typeof t]}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Dimension Sliders */}
        {renderDimensionSliders()}

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={500} height={300} className="w-full" />
        </div>

        {/* Properties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <p className="text-sm text-slate-500">{t.surfaceArea}</p>
            <p className="font-bold text-xl text-blue-600">{props.surfaceArea.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{t.squareUnits}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
            <p className="text-sm text-slate-500">{t.volume}</p>
            <p className="font-bold text-xl text-emerald-600">{props.volume.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{t.cubicUnits}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
            <p className="text-sm text-slate-500">{t.lateralArea}</p>
            <p className="font-bold text-xl text-purple-600">{props.lateralArea.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{t.squareUnits}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
            <p className="text-sm text-slate-500">{t.baseArea}</p>
            <p className="font-bold text-xl text-amber-600">{props.baseArea.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{t.squareUnits}</p>
          </div>
        </div>

        {/* Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">{t.surfaceArea}</p>
            <code className="text-sm font-mono">{formulas.area}</code>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">{t.volume}</p>
            <code className="text-sm font-mono">{formulas.volume}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
