"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Circle, Focus, Move3D, ZoomIn, ZoomOut } from "lucide-react";

interface LensesSimulatorProps {
  language: "ar" | "en";
}

export function LensesSimulator({ language }: LensesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [lensType, setLensType] = useState<"convex" | "concave">("convex");
  const [objectDistance, setObjectDistance] = useState(150); // Distance from lens
  const [objectHeight, setObjectHeight] = useState(40);
  const [focalLength, setFocalLength] = useState(80);
  const [showRays, setShowRays] = useState(true);
  const [showFocalPoints, setShowFocalPoints] = useState(true);
  const [animateRays, setAnimateRays] = useState(false);
  const [rayProgress, setRayProgress] = useState(1);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي العدسات",
      description: "استكشف تكوين الصور بالعدسات",
      convexLens: "عدسة محدبة (جامعة)",
      concaveLens: "عدسة مقعرة (مفرقة)",
      objectDistance: "بعد الجسم",
      objectHeight: "ارتفاع الجسم",
      focalLength: "البعد البؤري",
      imageDistance: "بعد الصورة",
      imageHeight: "ارتفاع الصورة",
      magnification: "التكبير",
      showRays: "عرض الأشعة",
      showFocalPoints: "عرض البؤرتين",
      reset: "إعادة",
      focalPoint: "البؤرة",
      lens: "العدسة",
      object: "الجسم",
      image: "الصورة",
      realImage: "صورة حقيقية",
      virtualImage: "صورة تخيلية",
      inverted: "مقلوبة",
      upright: "معتدلة",
      magnified: "مكبرة",
      diminished: "مصغرة",
      sameSize: "نفس الحجم",
      lensFormula: "صيغة العدسة",
      lensFormulaEq: "1/f = 1/do + 1/di",
      physicsNote: "العدسة المحدبة تجمع الأشعة وتستخدم في النظارات والكاميرات. العدسة المقهرة تفرق الأشعة وتستخدم لتصحيح قصر النظر.",
      infinity: "∞",
    },
    en: {
      title: "Lenses Simulator",
      description: "Explore image formation with lenses",
      convexLens: "Convex Lens (Converging)",
      concaveLens: "Concave Lens (Diverging)",
      objectDistance: "Object Distance",
      objectHeight: "Object Height",
      focalLength: "Focal Length",
      imageDistance: "Image Distance",
      imageHeight: "Image Height",
      magnification: "Magnification",
      showRays: "Show Rays",
      showFocalPoints: "Show Focal Points",
      reset: "Reset",
      focalPoint: "Focal Point",
      lens: "Lens",
      object: "Object",
      image: "Image",
      realImage: "Real Image",
      virtualImage: "Virtual Image",
      inverted: "Inverted",
      upright: "Upright",
      magnified: "Magnified",
      diminished: "Diminished",
      sameSize: "Same Size",
      lensFormula: "Lens Formula",
      lensFormulaEq: "1/f = 1/do + 1/di",
      physicsNote: "A convex lens converges light rays and is used in glasses and cameras. A concave lens diverges light rays and is used to correct nearsightedness.",
      infinity: "∞",
    },
  };

  const t = texts[language];
  const isRTL = language === "ar";

  // Calculate image properties using lens formula
  const calculateImageProperties = useCallback(() => {
    const do_distance = objectDistance; // Object distance (positive = left of lens)
    const f = lensType === "convex" ? focalLength : -focalLength;

    // Lens formula: 1/f = 1/do + 1/di
    // di = (f * do) / (do - f)
    const di = (f * do_distance) / (do_distance - f);

    // Magnification: M = -di/do
    const M = -di / do_distance;

    // Image height
    const hi = objectHeight * M;

    return {
      imageDistance: di,
      magnification: M,
      imageHeight: hi,
      isReal: di > 0,
      isInverted: M < 0,
    };
  }, [objectDistance, focalLength, lensType]);

  const imageProps = calculateImageProperties();

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Principal axis
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw lens
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    if (lensType === "convex") {
      // Convex lens shape
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 100);
      ctx.quadraticCurveTo(centerX + 20, centerY, centerX, centerY + 100);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 100);
      ctx.quadraticCurveTo(centerX - 20, centerY, centerX, centerY + 100);
      ctx.stroke();
    } else {
      // Concave lens shape
      ctx.beginPath();
      ctx.moveTo(centerX - 5, centerY - 100);
      ctx.quadraticCurveTo(centerX + 25, centerY, centerX - 5, centerY + 100);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 5, centerY - 100);
      ctx.quadraticCurveTo(centerX - 25, centerY, centerX + 5, centerY + 100);
      ctx.stroke();
    }

    // Draw focal points
    if (showFocalPoints) {
      const f = focalLength;

      // Left focal point (F)
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(centerX - f, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("F", centerX - f, centerY + 20);

      // Right focal point (F')
      ctx.beginPath();
      ctx.arc(centerX + f, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("F'", centerX + f, centerY + 20);

      // 2F points
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.arc(centerX - 2 * f, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("2F", centerX - 2 * f, centerY + 20);

      ctx.beginPath();
      ctx.arc(centerX + 2 * f, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("2F'", centerX + 2 * f, centerY + 20);
    }

    // Draw object (arrow pointing up)
    const objX = centerX - objectDistance;
    const objTopY = centerY - objectHeight;

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, centerY);
    ctx.lineTo(objX, objTopY);
    ctx.stroke();

    // Object arrow head
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(objX - 8, objTopY + 15);
    ctx.lineTo(objX + 8, objTopY + 15);
    ctx.closePath();
    ctx.fill();

    // Object label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.object, objX, centerY + 20);

    // Draw rays and image
    if (showRays) {
      const rayProgressVal = animateRays ? rayProgress : 1;

      if (lensType === "convex") {
        // Convex lens ray tracing

        // Ray 1: Parallel to axis, then through F'
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objX, objTopY);
        const ray1X = centerX + (centerX + focalLength - centerX) * rayProgressVal;
        ctx.lineTo(centerX, objTopY);
        if (rayProgressVal > 0.5) {
          const ray1Progress = (rayProgressVal - 0.5) * 2;
          ctx.lineTo(
            centerX + (centerX + focalLength - centerX) * ray1Progress + (width / 2 - centerX) * ray1Progress * 0.5,
            objTopY + (centerY - objTopY) * ray1Progress * focalLength / (width / 2 - centerX)
          );
        }
        ctx.stroke();

        // Ray 2: Through center of lens
        ctx.strokeStyle = "#22c55e";
        ctx.beginPath();
        ctx.moveTo(objX, objTopY);
        const slope2 = (centerY - objTopY) / (centerX - objX);
        ctx.lineTo(centerX, centerY);
        if (rayProgressVal > 0.5) {
          ctx.lineTo(centerX + (width / 2) * rayProgressVal, centerY + slope2 * (width / 2) * rayProgressVal);
        }
        ctx.stroke();

        // Ray 3: Through F, then parallel
        ctx.strokeStyle = "#8b5cf6";
        ctx.beginPath();
        ctx.moveTo(objX, objTopY);
        const slope3 = (centerY - objTopY) / (centerX - focalLength - objX);
        const lensY3 = objTopY + slope3 * (centerX - objX);
        ctx.lineTo(centerX, lensY3);
        if (rayProgressVal > 0.5) {
          ctx.lineTo(centerX + (width / 2) * rayProgressVal, lensY3);
        }
        ctx.stroke();

        // Draw image (if real)
        if (imageProps.imageDistance > 0 && imageProps.imageDistance < width / 2) {
          const imgX = centerX + imageProps.imageDistance;
          const imgHeight = Math.abs(imageProps.imageHeight);

          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(imgX, centerY);
          ctx.lineTo(imgX, centerY + imgHeight * Math.sign(imageProps.imageHeight));
          ctx.stroke();
          ctx.setLineDash([]);

          // Image arrow
          ctx.fillStyle = "#3b82f6";
          const imgTopY = centerY + imageProps.imageHeight;
          ctx.beginPath();
          ctx.moveTo(imgTopY < centerY ? imgX : imgX, imgTopY);
          ctx.lineTo(imgX - 8, imgTopY + (imgTopY < centerY ? 15 : -15));
          ctx.lineTo(imgX + 8, imgTopY + (imgTopY < centerY ? 15 : -15));
          ctx.closePath();
          ctx.fill();

          ctx.font = "bold 12px system-ui";
          ctx.fillText(t.image, imgX, centerY + imgHeight + 35);
        }
      } else {
        // Concave lens ray tracing

        // Ray 1: Parallel to axis, appears to come from F
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objX, objTopY);
        ctx.lineTo(centerX, objTopY);
        if (rayProgressVal > 0.5) {
          // Diverging ray
          const slope = (objTopY - centerY) / (centerX - (centerX - focalLength));
          ctx.lineTo(centerX + (width / 2) * (rayProgressVal - 0.5) * 2, objTopY + slope * (width / 2) * (rayProgressVal - 0.5) * 2);
        }
        ctx.stroke();

        // Virtual ray extension (dashed)
        if (rayProgressVal > 0.5) {
          ctx.strokeStyle = "#ef4444";
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(centerX, objTopY);
          ctx.lineTo(centerX - focalLength, centerY);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Ray 2: Through center
        ctx.strokeStyle = "#22c55e";
        ctx.beginPath();
        ctx.moveTo(objX, objTopY);
        const slope2 = (centerY - objTopY) / (centerX - objX);
        ctx.lineTo(centerX, centerY);
        if (rayProgressVal > 0.5) {
          ctx.lineTo(centerX + (width / 2) * (rayProgressVal - 0.5) * 2, centerY + slope2 * (width / 2) * (rayProgressVal - 0.5) * 2);
        }
        ctx.stroke();

        // Draw virtual image (always on same side as object for concave)
        const virtualImgX = centerX + imageProps.imageDistance;
        if (imageProps.imageDistance < 0) {
          const imgX = centerX + imageProps.imageDistance;
          const imgHeight = Math.abs(imageProps.imageHeight);

          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(imgX, centerY);
          ctx.lineTo(imgX, centerY - imgHeight);
          ctx.stroke();
          ctx.setLineDash([]);

          // Virtual image arrow
          ctx.fillStyle = "#3b82f6";
          ctx.beginPath();
          ctx.moveTo(imgX, centerY - imgHeight);
          ctx.lineTo(imgX - 6, centerY - imgHeight + 12);
          ctx.lineTo(imgX + 6, centerY - imgHeight + 12);
          ctx.closePath();
          ctx.fill();

          ctx.font = "bold 12px system-ui";
          ctx.fillText(t.image + " (" + t.virtualImage + ")", imgX, centerY - imgHeight - 10);
        }
      }
    }

    // Lens label
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.lens, centerX, centerY - 110);

  }, [lensType, objectDistance, objectHeight, focalLength, showRays, showFocalPoints, animateRays, rayProgress, imageProps, t, isRTL]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Animation effect
  useEffect(() => {
    if (!animateRays) {
      setRayProgress(1);
      return;
    }

    setRayProgress(0);
    const interval = setInterval(() => {
      setRayProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.02;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [animateRays]);

  // Reset
  const handleReset = () => {
    setLensType("convex");
    setObjectDistance(150);
    setObjectHeight(40);
    setFocalLength(80);
    setShowRays(true);
    setShowFocalPoints(true);
    setAnimateRays(false);
    setRayProgress(1);
  };

  // Determine image characteristics
  const getImageCharacteristics = () => {
    const chars: string[] = [];

    if (lensType === "convex") {
      if (objectDistance > 2 * focalLength) {
        chars.push(t.diminished);
        chars.push(t.inverted);
        chars.push(t.realImage);
      } else if (objectDistance === 2 * focalLength) {
        chars.push(t.sameSize);
        chars.push(t.inverted);
        chars.push(t.realImage);
      } else if (objectDistance > focalLength) {
        chars.push(t.magnified);
        chars.push(t.inverted);
        chars.push(t.realImage);
      } else {
        chars.push(t.magnified);
        chars.push(t.upright);
        chars.push(t.virtualImage);
      }
    } else {
      chars.push(t.diminished);
      chars.push(t.upright);
      chars.push(t.virtualImage);
    }

    return chars;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Focus className="w-6 h-6" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Lens Type Selection */}
        <div className="flex gap-3">
          <Button
            variant={lensType === "convex" ? "default" : "outline"}
            onClick={() => setLensType("convex")}
            className={lensType === "convex" ? "bg-purple-500 hover:bg-purple-600" : ""}
          >
            <ZoomIn className="w-4 h-4 mr-2" />
            {t.convexLens}
          </Button>
          <Button
            variant={lensType === "concave" ? "default" : "outline"}
            onClick={() => setLensType("concave")}
            className={lensType === "concave" ? "bg-pink-500 hover:bg-pink-600" : ""}
          >
            <ZoomOut className="w-4 h-4 mr-2" />
            {t.concaveLens}
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Move3D className="w-4 h-4 text-amber-500" />
                {t.objectDistance}
              </label>
              <Badge variant="secondary">{objectDistance}</Badge>
            </div>
            <Slider
              value={[objectDistance]}
              onValueChange={([value]) => setObjectDistance(value)}
              min={30}
              max={280}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.objectHeight}</label>
              <Badge variant="secondary">{objectHeight}</Badge>
            </div>
            <Slider
              value={[objectHeight]}
              onValueChange={([value]) => setObjectHeight(value)}
              min={20}
              max={80}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Circle className="w-4 h-4 text-green-500" />
                {t.focalLength}
              </label>
              <Badge variant="secondary">{focalLength}</Badge>
            </div>
            <Slider
              value={[focalLength]}
              onValueChange={([value]) => setFocalLength(value)}
              min={30}
              max={120}
              step={5}
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Switch checked={showRays} onCheckedChange={setShowRays} />
            <label className="text-sm">{t.showRays}</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={showFocalPoints} onCheckedChange={setShowFocalPoints} />
            <label className="text-sm">{t.showFocalPoints}</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={animateRays} onCheckedChange={setAnimateRays} />
            <label className="text-sm">{isRTL ? "تحريك الأشعة" : "Animate Rays"}</label>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.reset}
        </Button>

        {/* Formula */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
          <h4 className="font-bold text-purple-700 mb-2">{t.lensFormula}</h4>
          <code className="text-lg font-mono">{t.lensFormulaEq}</code>
        </div>

        {/* Canvas */}
        <div className="border-2 border-purple-200 rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} width={700} height={350} className="w-full" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.objectDistance}</p>
            <p className="text-xl font-bold text-amber-600">{objectDistance}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.imageDistance}</p>
            <p className="text-xl font-bold text-blue-600">
              {Math.abs(imageProps.imageDistance) > 500 ? t.infinity : imageProps.imageDistance.toFixed(1)}
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.magnification}</p>
            <p className="text-xl font-bold text-purple-600">
              {Math.abs(imageProps.magnification) > 10 ? ">" + imageProps.magnification.toFixed(0) : imageProps.magnification.toFixed(2)}x
            </p>
          </div>
          <div className="p-3 bg-pink-50 dark:bg-pink-950 rounded-lg text-center">
            <p className="text-sm text-slate-500">{t.imageHeight}</p>
            <p className="text-xl font-bold text-pink-600">
              {Math.abs(imageProps.imageHeight).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Image Characteristics */}
        <div className="flex gap-2 flex-wrap">
          {getImageCharacteristics().map((char, idx) => (
            <Badge key={idx} variant="outline" className="bg-slate-50">
              {char}
            </Badge>
          ))}
        </div>

        {/* Physics Note */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">{t.physicsNote}</p>
        </div>
      </CardContent>
    </Card>
  );
}
