"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Atom, Circle, Play, Pause, RotateCcw } from "lucide-react";

interface OrbitalsSimulatorProps {
  language: "ar" | "en";
}

export function OrbitalsSimulator({ language }: OrbitalsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [selectedOrbital, setSelectedOrbital] = useState<"s" | "p" | "d" | "f">("s");
  const [selectedSubOrbital, setSelectedSubOrbital] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [showNodes, setShowNodes] = useState(false);
  const [density, setDensity] = useState(500);

  const texts = {
    ar: {
      title: "محاكي الأفلاك الإلكترونية",
      description: "استكشف أشكال الأفلاك الإلكترونية s, p, d, f",
      orbitalType: "نوع الفلك",
      subOrbital: "الفلك الفرعي",
      electrons: "الإلكترونات",
      shape: "الشكل",
      nodes: "العقد",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      showNodes: "إظهار العقد",
      density: "كثافة الإلكترونات",
      description: "الوصف",
      orbitals: {
        s: {
          name: "فلك s",
          shape: "كروي",
          nodes: "0 عقد سطحية",
          desc: "الفلك s له شكل كروي متماثل حول النواة. لا توجد عقد سطحية (مناطق معدومة الكثافة). يوجد فلك s واحد في كل مستوى طاقة.",
          subs: ["s"],
        },
        p: {
          name: "فلك p",
          shape: "مغزلي (دمبيل)",
          nodes: "عقدة سطحية واحدة",
          desc: "الفلك p على شكل دمبيل (مغزلي) مع عقدة عند النواة. توجد 3 أفلاك p (px, py, pz) متعامدة. يبدأ من مستوى الطاقة الثاني.",
          subs: ["px", "py", "pz"],
        },
        d: {
          name: "فلك d",
          shape: "زهرية أو كلوريد",
          nodes: "عقدتان سطحيتان",
          desc: "أفلاك d لها أشكال أكثر تعقيداً. 4 منها على شكل زهرية بأربع وريقات، وواحد (dz²) على شكل طوق مع حلقة. يوجد 5 أفلاك d.",
          subs: ["dxy", "dxz", "dyz", "dx²-y²", "dz²"],
        },
        f: {
          name: "فلك f",
          shape: "معقد جداً",
          nodes: "3 عقد سطحية",
          desc: "أفلاك f هي الأكثر تعقيداً بأشكال متعددة الفصوص. يوجد 7 أفلاك f. تظهر في العناصر الانتقالية الداخلية (اللانثانيدات والأكتينيدات).",
          subs: ["fz³", "fxz²", "fyz²", "fxyz", "fz(x²-y²)", "fx(x²-3y²)", "fy(3x²-y²)"],
        },
      },
    },
    en: {
      title: "Electron Orbitals Simulator",
      description: "Explore the shapes of s, p, d, f electron orbitals",
      orbitalType: "Orbital Type",
      subOrbital: "Sub-orbital",
      electrons: "Electrons",
      shape: "Shape",
      nodes: "Nodes",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      showNodes: "Show Nodes",
      density: "Electron Density",
      description: "Description",
      orbitals: {
        s: {
          name: "s Orbital",
          shape: "Spherical",
          nodes: "0 nodal surfaces",
          desc: "The s orbital has a spherical shape symmetric around the nucleus. No nodal surfaces (zero-density regions). There is one s orbital in each energy level.",
          subs: ["s"],
        },
        p: {
          name: "p Orbital",
          shape: "Dumbbell",
          nodes: "1 nodal surface",
          desc: "The p orbital is dumbbell-shaped with a node at the nucleus. There are 3 p orbitals (px, py, pz) perpendicular to each other. Starts from the second energy level.",
          subs: ["px", "py", "pz"],
        },
        d: {
          name: "d Orbital",
          shape: "Four-leaf clover",
          nodes: "2 nodal surfaces",
          desc: "d orbitals have more complex shapes. 4 are four-lobed clover shapes, and one (dz²) is a collar with a ring. There are 5 d orbitals.",
          subs: ["dxy", "dxz", "dyz", "dx²-y²", "dz²"],
        },
        f: {
          name: "f Orbital",
          shape: "Very complex",
          nodes: "3 nodal surfaces",
          desc: "f orbitals are the most complex with multi-lobed shapes. There are 7 f orbitals. They appear in inner transition elements (lanthanides and actinides).",
          subs: ["fz³", "fxz²", "fyz²", "fxyz", "fz(x²-y²)", "fx(x²-3y²)", "fy(3x²-y²)"],
        },
      },
    },
  };

  const t = texts[language];
  const orbitalInfo = t.orbitals[selectedOrbital];
  const subOrbitals = orbitalInfo.subs;

  // Draw the orbital
  const drawOrbital = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 100;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    bgGradient.addColorStop(0, "#f5f3ff");
    bgGradient.addColorStop(1, "#ede9fe");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Coordinate axes
    ctx.strokeStyle = "rgba(100, 116, 139, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY);
    ctx.lineTo(centerX + 150, centerY);
    ctx.moveTo(centerX, centerY - 150);
    ctx.lineTo(centerX, centerY + 150);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("x", centerX + 145, centerY - 10);
    ctx.fillText("y", centerX + 15, centerY - 140);

    // Draw probability cloud based on orbital type
    const drawProbabilityCloud = (probability: (r: number, theta: number, phi: number) => number) => {
      const points: { x: number; y: number; alpha: number }[] = [];

      for (let i = 0; i < density; i++) {
        // Random spherical coordinates
        const r = Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        const prob = probability(r, theta, phi);

        if (Math.random() < prob) {
          // Convert to Cartesian (rotated view)
          const viewAngle = rotation * 0.5;
          const x = r * Math.sin(phi) * Math.cos(theta + viewAngle);
          const y = r * Math.sin(phi) * Math.sin(theta + viewAngle);
          const z = r * Math.cos(phi);

          // Simple 3D projection
          const projX = centerX + x * scale + z * 20;
          const projY = centerY + y * scale;

          points.push({ x: projX, y: projY, alpha: prob });
        }
      }

      // Draw points
      points.forEach((point) => {
        const colors: Record<string, string> = { s: "#8b5cf6", p: "#3b82f6", d: "#10b981", f: "#f59e0b" };
        ctx.fillStyle = `${colors[selectedOrbital]}${Math.floor(point.alpha * 80).toString(16).padStart(2, "0")}`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Probability functions for each orbital type
    switch (selectedOrbital) {
      case "s":
        // Spherical - only radial dependence
        drawProbabilityCloud((r, _theta, _phi) => {
          const radial = Math.exp(-r) * (1 - r + r * r / 3);
          return Math.max(0, Math.min(1, radial * radial));
        });
        break;

      case "p":
        // Dumbbell shape
        const pAxis = selectedSubOrbital; // 0: x, 1: y, 2: z
        drawProbabilityCloud((r, theta, phi) => {
          // Angular part depends on axis
          let angular: number;
          switch (pAxis) {
            case 0: // px
              angular = Math.sin(phi) * Math.cos(theta);
              break;
            case 1: // py
              angular = Math.sin(phi) * Math.sin(theta);
              break;
            default: // pz
              angular = Math.cos(phi);
          }
          const radial = r * Math.exp(-r / 2);
          return Math.max(0, Math.min(1, Math.abs(radial * angular)));
        });
        break;

      case "d":
        // Four-leaf clover shapes
        const dType = selectedSubOrbital;
        drawProbabilityCloud((r, theta, phi) => {
          let angular: number;
          switch (dType) {
            case 0: // dxy
              angular = Math.sin(phi) * Math.sin(phi) * Math.sin(2 * theta);
              break;
            case 1: // dxz
              angular = Math.sin(phi) * Math.cos(phi) * Math.cos(theta);
              break;
            case 2: // dyz
              angular = Math.sin(phi) * Math.cos(phi) * Math.sin(theta);
              break;
            case 3: // dx²-y²
              angular = Math.sin(phi) * Math.sin(phi) * Math.cos(2 * theta);
              break;
            default: // dz²
              angular = (3 * Math.cos(phi) * Math.cos(phi) - 1);
          }
          const radial = r * r * Math.exp(-r / 3);
          return Math.max(0, Math.min(1, Math.abs(radial * angular)));
        });
        break;

      case "f":
        // Complex shapes
        const fType = selectedSubOrbital;
        drawProbabilityCloud((r, theta, phi) => {
          let angular: number;
          const cp = Math.cos(phi);
          const sp = Math.sin(phi);
          const ct = Math.cos(theta);
          const st = Math.sin(theta);
          
          switch (fType) {
            case 0: // fz³
              angular = cp * (5 * cp * cp - 3);
              break;
            case 1: // fxz²
              angular = st * cp * (5 * cp * cp - 1);
              break;
            case 2: // fyz²
              angular = st * sp * cp * cp;
              break;
            case 3: // fxyz
              angular = st * st * sp * ct * cp;
              break;
            case 4: // fz(x²-y²)
              angular = st * st * cp * Math.cos(2 * theta);
              break;
            case 5: // fx(x²-3y²)
              angular = st * st * st * ct * (ct * ct - 3 * st * st);
              break;
            default: // fy(3x²-y²)
              angular = st * st * st * sp * (3 * ct * ct - st * st);
          }
          const radial = r * r * r * Math.exp(-r / 4);
          return Math.max(0, Math.min(1, Math.abs(radial * angular)));
        });
        break;
    }

    // Draw nodal planes if enabled
    if (showNodes) {
      ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      if (selectedOrbital === "p") {
        // One nodal plane through origin
        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY);
        ctx.lineTo(centerX + 100, centerY);
        ctx.stroke();
      }

      if (selectedOrbital === "d" && selectedSubOrbital < 4) {
        // Two nodal planes for clover shapes
        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY);
        ctx.lineTo(centerX + 100, centerY);
        ctx.moveTo(centerX, centerY - 100);
        ctx.lineTo(centerX, centerY + 100);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    // Nucleus
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("+", centerX, centerY + 3);

    // Orbital name
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(subOrbitals[selectedSubOrbital], centerX, 30);

  }, [selectedOrbital, selectedSubOrbital, rotation, showNodes, density, subOrbitals]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      setRotation(prev => prev + 0.01);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  // Draw
  useEffect(() => {
    drawOrbital();
  }, [drawOrbital]);

  // Reset sub-orbital when orbital type changes
  useEffect(() => {
    setSelectedSubOrbital(0);
  }, [selectedOrbital]);

  const orbitalColors = {
    s: "bg-purple-500 hover:bg-purple-600",
    p: "bg-blue-500 hover:bg-blue-600",
    d: "bg-green-500 hover:bg-green-600",
    f: "bg-amber-500 hover:bg-amber-600",
  };

  const orbitalBorderColors = {
    s: "border-purple-500",
    p: "border-blue-500",
    d: "border-green-500",
    f: "border-amber-500",
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Orbital type selector */}
        <div className="space-y-3">
          <label className="font-medium">{t.orbitalType}</label>
          <div className="flex gap-2">
            {(["s", "p", "d", "f"] as const).map((orb) => (
              <Button
                key={orb}
                variant={selectedOrbital === orb ? "default" : "outline"}
                onClick={() => setSelectedOrbital(orb)}
                className={selectedOrbital === orb ? orbitalColors[orb] : ""}
              >
                {orb.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Sub-orbital selector */}
        {subOrbitals.length > 1 && (
          <div className="space-y-3">
            <label className="font-medium">{t.subOrbital}</label>
            <div className="flex flex-wrap gap-2">
              {subOrbitals.map((sub, index) => (
                <Button
                  key={sub}
                  variant={selectedSubOrbital === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubOrbital(index)}
                  className={selectedSubOrbital === index ? orbitalColors[selectedOrbital] : ""}
                >
                  {sub}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Control buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? orbitalColors[selectedOrbital] : "bg-green-500 hover:bg-green-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={() => setRotation(0)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
          <Button
            variant={showNodes ? "default" : "outline"}
            onClick={() => setShowNodes(!showNodes)}
          >
            <Circle className="w-4 h-4 mr-2" />
            {t.showNodes}
          </Button>
        </div>

        {/* Density slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t.density}</label>
            <Badge variant="secondary">{density}</Badge>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            value={density}
            onChange={(e) => setDensity(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Canvas */}
        <div className={`border-2 rounded-lg overflow-hidden ${orbitalBorderColors[selectedOrbital]}`}>
          <canvas ref={canvasRef} width={500} height={400} className="w-full bg-slate-50" />
        </div>

        {/* Orbital info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${orbitalBorderColors[selectedOrbital]} bg-opacity-10`}>
            <h5 className="font-medium mb-1">{t.shape}</h5>
            <p className="font-bold text-lg">{orbitalInfo.shape}</p>
          </div>
          <div className={`p-4 rounded-lg border ${orbitalBorderColors[selectedOrbital]} bg-opacity-10`}>
            <h5 className="font-medium mb-1">{t.nodes}</h5>
            <p className="font-bold text-lg">{orbitalInfo.nodes}</p>
          </div>
          <div className={`p-4 rounded-lg border ${orbitalBorderColors[selectedOrbital]} bg-opacity-10`}>
            <h5 className="font-medium mb-1">{t.electrons}</h5>
            <p className="font-bold text-lg">{selectedOrbital === "s" ? "2" : selectedOrbital === "p" ? "6" : selectedOrbital === "d" ? "10" : "14"}</p>
          </div>
        </div>

        {/* Description */}
        <div className={`p-4 rounded-lg border ${orbitalBorderColors[selectedOrbital]} bg-opacity-5`}>
          <h4 className="font-bold mb-2">{t.description}</h4>
          <p className="text-slate-600 dark:text-slate-400">{orbitalInfo.desc}</p>
        </div>

        {/* Orbital summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">s</div>
            <div className="text-sm text-slate-500">{language === "ar" ? "1 فلك" : "1 orbital"}</div>
            <div className="text-sm text-slate-500">2 e⁻</div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">p</div>
            <div className="text-sm text-slate-500">{language === "ar" ? "3 أفلاك" : "3 orbitals"}</div>
            <div className="text-sm text-slate-500">6 e⁻</div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-2xl font-bold text-green-600">d</div>
            <div className="text-sm text-slate-500">{language === "ar" ? "5 أفلاك" : "5 orbitals"}</div>
            <div className="text-sm text-slate-500">10 e⁻</div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">f</div>
            <div className="text-sm text-slate-500">{language === "ar" ? "7 أفلاك" : "7 orbitals"}</div>
            <div className="text-sm text-slate-500">14 e⁻</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
