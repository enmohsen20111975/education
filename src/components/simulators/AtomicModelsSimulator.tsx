"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Atom, Circle, Play, Pause, RotateCcw, Clock, Users } from "lucide-react";

interface AtomicModelsSimulatorProps {
  language: "ar" | "en";
}

export function AtomicModelsSimulator({ language }: AtomicModelsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [currentModel, setCurrentModel] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [rotation, setRotation] = useState(0);

  const texts = {
    ar: {
      title: "محاكي تطور النماذج الذرية",
      description: "استكشف تطور فهم البشر لبنية الذرة عبر التاريخ",
      selectModel: "اختر النموذج",
      year: "السنة",
      scientist: "العالم",
      discovery: "الاكتشاف",
      explanation: "التفسير",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      previous: "السابق",
      next: "التالي",
      models: [
        {
          name: "نموذج دالتون",
          nameEn: "Dalton Model",
          year: "1803",
          scientist: "جون دالتون",
          discovery: "الذرة ككرة مصمتة غير قابلة للتجزئة",
          explanation: "اعتقد دالتون أن الذرات هي أصغر جزء في المادة، وهي كرات مصمتة غير قابلة للتجزئة. كل عنصر له ذرات فريدة من حيث الكتلة والخصائص.",
          color: "#78716c"
        },
        {
          name: "نموذج طومسون",
          nameEn: "Thomson Model",
          year: "1897",
          scientist: "ج.ج. طومسون",
          discovery: "اكتشاف الإلكترون - نموذج البرقوق",
          explanation: "اكتشف طومسون الإلكترون باستخدام أنبوب الأشعة المهبطية. اقترح أن الذرة كرة موجبة الشحنة مع إلكترونات سالبة مدمجة فيها مثل حبات البرقوق في كعكة.",
          color: "#f59e0b"
        },
        {
          name: "نموذج رذرفورد",
          nameEn: "Rutherford Model",
          year: "1911",
          scientist: "إرنست رذرفورد",
          discovery: "اكتشاف النواة - تجربة رقاقة الذهب",
          explanation: "أثبتت تجربة رقاقة الذهب أن معظم كتلة الذرة تتركز في نواة صغيرة موجبة. الإلكترونات تدور حول النواة في فراغ كبير. الذرة في معظمها فراغ!",
          color: "#ef4444"
        },
        {
          name: "نموذج بور",
          nameEn: "Bohr Model",
          year: "1913",
          scientist: "نيلز بور",
          discovery: "مستويات الطاقة الكمية",
          explanation: "طور بور نموذج رذرفورد بإضافة فكرة أن الإلكترونات تدور في مستويات طاقة محددة (أغلفة). لا يمكن للإلكترون أن يوجد بين المستويات. هذا النموذج يفسر خطوط طيف الهيدروجين.",
          color: "#3b82f6"
        },
        {
          name: "النموذج الكمومي",
          nameEn: "Quantum Model",
          year: "1926",
          scientist: "شرودنجر، هايزنبرج",
          discovery: "الأفلاك الإلكترونية ومبدأ عدم اليقين",
          explanation: "النموذج الحديث يعتمد على ميكانيكا الكم. الإلكترونات ليست جسيمات محددة بل سحابات احتمالية (أفلاك) حول النواة. لا يمكن تحديد موقع وسرعة الإلكترون بدقة في نفس الوقت.",
          color: "#8b5cf6"
        }
      ]
    },
    en: {
      title: "Atomic Models Evolution Simulator",
      description: "Explore the evolution of human understanding of atomic structure",
      selectModel: "Select Model",
      year: "Year",
      scientist: "Scientist",
      discovery: "Discovery",
      explanation: "Explanation",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      previous: "Previous",
      next: "Next",
      models: [
        {
          name: "Dalton Model",
          nameEn: "Dalton Model",
          year: "1803",
          scientist: "John Dalton",
          discovery: "Atom as a solid, indivisible sphere",
          explanation: "Dalton believed atoms are the smallest part of matter - solid, indivisible spheres. Each element has unique atoms with distinct mass and properties.",
          color: "#78716c"
        },
        {
          name: "Thomson Model",
          nameEn: "Thomson Model",
          year: "1897",
          scientist: "J.J. Thomson",
          discovery: "Discovery of electron - Plum pudding model",
          explanation: "Thomson discovered the electron using cathode ray tubes. He proposed the atom as a positive sphere with negative electrons embedded like plums in a pudding.",
          color: "#f59e0b"
        },
        {
          name: "Rutherford Model",
          nameEn: "Rutherford Model",
          year: "1911",
          scientist: "Ernest Rutherford",
          discovery: "Discovery of nucleus - Gold foil experiment",
          explanation: "The gold foil experiment proved most of the atom's mass is concentrated in a small positive nucleus. Electrons orbit the nucleus in a vast empty space. Atoms are mostly empty space!",
          color: "#ef4444"
        },
        {
          name: "Bohr Model",
          nameEn: "Bohr Model",
          year: "1913",
          scientist: "Niels Bohr",
          discovery: "Quantized energy levels",
          explanation: "Bohr improved Rutherford's model by adding the concept that electrons orbit in specific energy levels (shells). Electrons cannot exist between levels. This explains hydrogen's spectral lines.",
          color: "#3b82f6"
        },
        {
          name: "Quantum Model",
          nameEn: "Quantum Model",
          year: "1926",
          scientist: "Schrödinger, Heisenberg",
          discovery: "Electron orbitals and uncertainty principle",
          explanation: "The modern model is based on quantum mechanics. Electrons are not fixed particles but probability clouds (orbitals) around the nucleus. Position and velocity cannot be determined precisely simultaneously.",
          color: "#8b5cf6"
        }
      ]
    }
  };

  const t = texts[language];
  const model = t.models[currentModel];

  // Draw the atomic model
  const drawModel = useCallback(() => {
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

    // Background gradient
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    bgGradient.addColorStop(0, "#f8fafc");
    bgGradient.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw based on model type
    switch (currentModel) {
      case 0: // Dalton - solid sphere
        drawDaltonModel(ctx, centerX, centerY);
        break;
      case 1: // Thomson - plum pudding
        drawThomsonModel(ctx, centerX, centerY);
        break;
      case 2: // Rutherford - nuclear model
        drawRutherfordModel(ctx, centerX, centerY, rotation);
        break;
      case 3: // Bohr - energy levels
        drawBohrModel(ctx, centerX, centerY, rotation);
        break;
      case 4: // Quantum - orbitals
        drawQuantumModel(ctx, centerX, centerY, rotation);
        break;
    }

    // Model name
    ctx.fillStyle = model.color;
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(model.name, centerX, 30);

  }, [currentModel, rotation, model]);

  // Dalton model - solid sphere
  const drawDaltonModel = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    // Solid sphere
    const gradient = ctx.createRadialGradient(cx - 20, cy - 20, 0, cx, cy, 80);
    gradient.addColorStop(0, "#a8a29e");
    gradient.addColorStop(1, "#78716c");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? "ذرة مصمتة" : "Solid Atom", cx, cy);
  };

  // Thomson model - plum pudding
  const drawThomsonModel = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    // Positive sphere (pudding)
    const gradient = ctx.createRadialGradient(cx - 20, cy - 20, 0, cx, cy, 100);
    gradient.addColorStop(0, "#fcd34d");
    gradient.addColorStop(1, "#f59e0b");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.fill();

    // Electrons (plums)
    const electrons = [
      { x: cx - 40, y: cy - 30 },
      { x: cx + 40, y: cy - 30 },
      { x: cx - 50, y: cy + 20 },
      { x: cx + 50, y: cy + 20 },
      { x: cx, y: cy - 50 },
      { x: cx, y: cy + 50 },
      { x: cx - 20, y: cy },
      { x: cx + 20, y: cy },
    ];

    electrons.forEach((e) => {
      // Electron
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(e.x, e.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Minus sign
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e.x - 5, e.y);
      ctx.lineTo(e.x + 5, e.y);
      ctx.stroke();
    });

    // Label
    ctx.fillStyle = "#78350f";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? "كرة موجبة" : "Positive sphere", cx, cy + 80);
  };

  // Rutherford model - nuclear
  const drawRutherfordModel = (ctx: CanvasRenderingContext2D, cx: number, cy: number, rot: number) => {
    // Orbit paths
    ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Nucleus
    const nucleusGradient = ctx.createRadialGradient(cx - 5, cy - 5, 0, cx, cy, 20);
    nucleusGradient.addColorStop(0, "#fca5a5");
    nucleusGradient.addColorStop(1, "#dc2626");
    ctx.fillStyle = nucleusGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();

    // Electrons orbiting
    for (let i = 0; i < 3; i++) {
      const angle = rot + (i * Math.PI * 2) / 3;
      const x = cx + 120 * Math.cos(angle);
      const y = cy + 120 * Math.sin(angle);

      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Arrow showing empty space
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy);
    ctx.lineTo(cx - 30, cy);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? "فراغ" : "Empty space", cx - 45, cy + 15);
  };

  // Bohr model - energy levels
  const drawBohrModel = (ctx: CanvasRenderingContext2D, cx: number, cy: number, rot: number) => {
    // Energy levels (shells)
    const shells = [60, 100, 140];
    const electronsInShells = [2, 4, 0]; // Example: 6 electrons

    shells.forEach((radius, shellIndex) => {
      // Shell path
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Shell label
      ctx.fillStyle = "#3b82f6";
      ctx.font = "11px system-ui";
      ctx.textAlign = language === "ar" ? "right" : "left";
      ctx.fillText(`n=${shellIndex + 1}`, language === "ar" ? cx - radius - 5 : cx + radius + 5, cy);
    });

    // Nucleus
    const nucleusGradient = ctx.createRadialGradient(cx - 5, cy - 5, 0, cx, cy, 15);
    nucleusGradient.addColorStop(0, "#fca5a5");
    nucleusGradient.addColorStop(1, "#dc2626");
    ctx.fillStyle = nucleusGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();

    // Electrons on shells
    shells.forEach((radius, shellIndex) => {
      const electrons = electronsInShells[shellIndex];
      for (let i = 0; i < electrons; i++) {
        const angle = rot + (i * Math.PI * 2) / electrons;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        // Electron glow
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Electron
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Energy level labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(language === "ar" ? "مستويات طاقة محددة" : "Discrete energy levels", cx, cy + 160);
  };

  // Quantum model - orbitals
  const drawQuantumModel = (ctx: CanvasRenderingContext2D, cx: number, cy: number, rot: number) => {
    // Probability clouds (orbitals)
    // 1s orbital (spherical)
    const draw1sOrbital = () => {
      for (let i = 0; i < 500; i++) {
        const r = Math.random() * 60;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = cx + r * Math.sin(phi) * Math.cos(theta + rot * 0.1);
        const y = cy + r * Math.sin(phi) * Math.sin(theta + rot * 0.1);
        
        const alpha = Math.max(0, 1 - r / 60);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // 2p orbital (dumbbell)
    const draw2pOrbital = () => {
      for (let i = 0; i < 300; i++) {
        const side = Math.random() > 0.5 ? 1 : -1;
        const r = Math.random() * 50;
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 30;
        
        const x = cx + side * (30 + r * 0.5) + spread * Math.cos(angle) * 0.3;
        const y = cy + spread * Math.sin(angle);
        
        const dist = Math.abs(x - cx);
        const alpha = Math.max(0, 0.5 - dist / 100);
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Draw 1s
    draw1sOrbital();

    // Draw 2p
    draw2pOrbital();

    // Nucleus (small)
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = "#8b5cf6";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("1s", cx, cy + 70);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("2p", cx + 80, cy);
    ctx.fillText("2p", cx - 80, cy);

    // Uncertainty label
    ctx.fillStyle = "#64748b";
    ctx.font = "10px system-ui";
    ctx.fillText(language === "ar" ? "سحابات احتمالية" : "Probability clouds", cx, cy + 170);
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      setRotation(prev => prev + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  // Draw
  useEffect(() => {
    drawModel();
  }, [drawModel]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader style={{ background: `linear-gradient(to right, ${model.color}, ${model.color}dd)` }} className="text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-white/80">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Model selector */}
        <div className="space-y-3">
          <label className="font-medium">{t.selectModel}</label>
          <div className="flex flex-wrap gap-2">
            {t.models.map((m, index) => (
              <Button
                key={index}
                variant={currentModel === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentModel(index)}
                style={currentModel === index ? { backgroundColor: m.color } : {}}
              >
                {m.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            style={{ backgroundColor: model.color }}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={() => setRotation(0)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentModel((prev) => (prev - 1 + t.models.length) % t.models.length)}
          >
            {t.previous}
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentModel((prev) => (prev + 1) % t.models.length)}
          >
            {t.next}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas ref={canvasRef} width={600} height={380} className="w-full" />
        </div>

        {/* Model info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: model.color, backgroundColor: `${model.color}10` }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" style={{ color: model.color }} />
              <span className="font-medium">{t.year}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: model.color }}>{model.year}</p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: model.color, backgroundColor: `${model.color}10` }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" style={{ color: model.color }} />
              <span className="font-medium">{t.scientist}</span>
            </div>
            <p className="text-lg font-semibold" style={{ color: model.color }}>{model.scientist}</p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: model.color, backgroundColor: `${model.color}10` }}>
            <div className="flex items-center gap-2 mb-2">
              <Atom className="w-4 h-4" style={{ color: model.color }} />
              <span className="font-medium">{t.discovery}</span>
            </div>
            <Badge style={{ backgroundColor: model.color }}>{model.discovery}</Badge>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-lg border" style={{ borderColor: model.color, backgroundColor: `${model.color}05` }}>
          <h4 className="font-bold mb-2" style={{ color: model.color }}>{t.explanation}</h4>
          <p className="text-slate-600 dark:text-slate-400">{model.explanation}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 rounded -translate-y-1/2" />
          <div className="flex justify-between relative">
            {t.models.map((m, index) => (
              <div
                key={index}
                className={`flex flex-col items-center cursor-pointer transition-all ${currentModel === index ? "scale-110" : "opacity-50"}`}
                onClick={() => setCurrentModel(index)}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10"
                  style={{ backgroundColor: m.color }}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1 font-medium">{m.year}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
