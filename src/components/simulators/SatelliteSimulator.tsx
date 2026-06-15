"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Orbit, Ruler, Timer, Gauge, Satellite } from "lucide-react";

interface SatelliteSimulatorProps {
  language: "ar" | "en";
}

export function SatelliteSimulator({ language }: SatelliteSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Physical constants
  const G = 6.674e-11; // Gravitational constant
  const earthMass = 5.972e24; // kg
  const earthRadius = 6.371e6; // meters
  const earthRadiusKm = 6371; // km

  // State
  const [altitude, setAltitude] = useState(400); // km above Earth surface
  const [mass, setMass] = useState(1000); // kg (satellite mass)
  const [showOrbit, setShowOrbit] = useState(true);
  const [showForces, setShowForces] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [angle, setAngle] = useState(0);
  const [trail, setTrail] = useState<number[]>([]);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي الأقمار الصناعية",
      description: "استكشف مدارات الأقمار الصناعية حول الأرض",
      altitude: "الارتفاع عن سطح الأرض",
      satelliteMass: "كتلة القمر الصناعي",
      orbitalVelocity: "السرعة المدارية",
      orbitalPeriod: "الدور المداري",
      orbitalCircumference: "محيط المدار",
      gravitationalAcceleration: "تسارع الجاذبية",
      centrifugalForce: "القوة الطاردة المركزية",
      gravitationalForce: "قوة الجاذبية",
      linearVelocity: "السرعة الخطية",
      angularVelocity: "السرعة الزاوية",
      start: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      km: "كم",
      kg: "كجم",
      ms: "م/ث",
      seconds: "ثانية",
      minutes: "دقيقة",
      hours: "ساعة",
      ms2: "م/ث²",
      n: "نيوتن",
      rads: "راد/ث",
      formula: "v = √(GM/r)",
      showOrbit: "إظهار المدار",
      showForces: "إظهار القوى",
      earth: "الأرض",
      satellite: "القمر الصناعي",
      geostationary: "متزامن مع الأرض",
      leo: "مدار أرضي منخفض",
      meo: "مدار أرضي متوسط",
      heo: "مدار أرضي عالي",
      orbitRadius: "نصف قطر المدار",
      distanceFromCenter: "المسافة من المركز",
      orbits: "مدارات",
      completed: "مكتملة",
    },
    en: {
      title: "Satellite Orbit Simulator",
      description: "Explore satellite orbits around Earth",
      altitude: "Altitude Above Earth",
      satelliteMass: "Satellite Mass",
      orbitalVelocity: "Orbital Velocity",
      orbitalPeriod: "Orbital Period",
      orbitalCircumference: "Orbital Circumference",
      gravitationalAcceleration: "Gravitational Acceleration",
      centrifugalForce: "Centrifugal Force",
      gravitationalForce: "Gravitational Force",
      linearVelocity: "Linear Velocity",
      angularVelocity: "Angular Velocity",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      km: "km",
      kg: "kg",
      ms: "m/s",
      seconds: "s",
      minutes: "min",
      hours: "h",
      ms2: "m/s²",
      n: "N",
      rads: "rad/s",
      formula: "v = √(GM/r)",
      showOrbit: "Show Orbit",
      showForces: "Show Forces",
      earth: "Earth",
      satellite: "Satellite",
      geostationary: "Geostationary",
      leo: "Low Earth Orbit (LEO)",
      meo: "Medium Earth Orbit (MEO)",
      heo: "High Earth Orbit (HEO)",
      orbitRadius: "Orbit Radius",
      distanceFromCenter: "Distance from Center",
      orbits: "Orbits",
      completed: "completed",
    },
  };

  const t = texts[language];

  // Calculate orbital parameters
  const orbitRadius = earthRadius + altitude * 1000; // meters
  const orbitRadiusKm = earthRadiusKm + altitude; // km
  
  // Orbital velocity: v = sqrt(GM/r)
  const orbitalVelocity = Math.sqrt(G * earthMass / orbitRadius);
  
  // Orbital period: T = 2π * sqrt(r³/GM)
  const orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(orbitRadius, 3) / (G * earthMass));
  
  // Angular velocity
  const angularVelocity = 2 * Math.PI / orbitalPeriod;
  
  // Gravitational acceleration at orbit
  const gravAcceleration = G * earthMass / (orbitRadius * orbitRadius);
  
  // Forces
  const gravForce = G * earthMass * mass / (orbitRadius * orbitRadius);
  const centrifugalForce = mass * orbitalVelocity * orbitalVelocity / orbitRadius;
  
  // Orbital circumference
  const circumference = 2 * Math.PI * orbitRadius;
  
  // Determine orbit type
  const getOrbitType = () => {
    if (altitude < 2000) return "leo";
    if (altitude < 35786) return "meo";
    if (Math.abs(altitude - 35786) < 100) return "geostationary";
    return "heo";
  };
  
  const orbitType = getOrbitType();

  // Format time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)} ${t.seconds}`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} ${t.minutes}`;
    return `${(seconds / 3600).toFixed(2)} ${t.hours}`;
  };

  // Draw the animation canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 40;
    
    // Scale: map the orbit to fit in canvas
    const maxAltitudeKm = 50000; // Max displayed altitude
    const scale = maxRadius / (earthRadiusKm + maxAltitudeKm);
    const earthDisplayRadius = earthRadiusKm * scale;
    const orbitDisplayRadius = orbitRadiusKm * scale;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw space background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    bgGradient.addColorStop(0, "#0c0a1d");
    bgGradient.addColorStop(1, "#000000");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 200; i++) {
      const starX = (Math.sin(i * 567 + 123) * 0.5 + 0.5) * width;
      const starY = (Math.cos(i * 234 + 456) * 0.5 + 0.5) * height;
      const starSize = (Math.sin(i * 89 + 789) * 0.5 + 0.5) * 1.5;
      ctx.beginPath();
      ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw orbit path
    if (showOrbit) {
      ctx.strokeStyle = "rgba(147, 197, 253, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitDisplayRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw atmosphere glow
    const atmosGradient = ctx.createRadialGradient(centerX, centerY, earthDisplayRadius * 0.9, centerX, centerY, earthDisplayRadius * 1.15);
    atmosGradient.addColorStop(0, "rgba(100, 200, 255, 0.3)");
    atmosGradient.addColorStop(1, "rgba(100, 200, 255, 0)");
    ctx.fillStyle = atmosGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthDisplayRadius * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Draw Earth
    const earthGradient = ctx.createRadialGradient(centerX - earthDisplayRadius * 0.3, centerY - earthDisplayRadius * 0.3, 0, centerX, centerY, earthDisplayRadius);
    earthGradient.addColorStop(0, "#3b82f6");
    earthGradient.addColorStop(0.4, "#2563eb");
    earthGradient.addColorStop(0.7, "#1d4ed8");
    earthGradient.addColorStop(1, "#1e3a8a");
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthDisplayRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw continents (simplified)
    ctx.fillStyle = "#22c55e";
    // Simple continent shapes
    ctx.beginPath();
    ctx.ellipse(centerX - earthDisplayRadius * 0.2, centerY - earthDisplayRadius * 0.1, earthDisplayRadius * 0.3, earthDisplayRadius * 0.25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + earthDisplayRadius * 0.3, centerY + earthDisplayRadius * 0.2, earthDisplayRadius * 0.2, earthDisplayRadius * 0.15, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.ellipse(centerX - earthDisplayRadius * 0.4, centerY - earthDisplayRadius * 0.3, earthDisplayRadius * 0.15, earthDisplayRadius * 0.08, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + earthDisplayRadius * 0.2, centerY + earthDisplayRadius * 0.4, earthDisplayRadius * 0.2, earthDisplayRadius * 0.06, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Calculate satellite position
    const satX = centerX + orbitDisplayRadius * Math.cos(angle);
    const satY = centerY - orbitDisplayRadius * Math.sin(angle);

    // Draw trail
    if (trail.length > 1) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      trail.forEach((a, i) => {
        const tx = centerX + orbitDisplayRadius * Math.cos(a);
        const ty = centerY - orbitDisplayRadius * Math.sin(a);
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      });
      ctx.stroke();
    }

    // Draw forces
    if (showForces) {
      // Gravitational force (towards Earth)
      const forceScale = 0.00000001;
      const gravForceDisplay = gravForce * forceScale;
      
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(satX - Math.cos(angle) * gravForceDisplay, satY + Math.sin(angle) * gravForceDisplay);
      ctx.stroke();
      
      // Arrow head
      const gAngle = Math.atan2(Math.sin(angle), -Math.cos(angle));
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(satX - Math.cos(angle) * gravForceDisplay, satY + Math.sin(angle) * gravForceDisplay);
      ctx.lineTo(satX - Math.cos(angle) * gravForceDisplay - 8 * Math.cos(gAngle - 0.4), satY + Math.sin(angle) * gravForceDisplay - 8 * Math.sin(gAngle - 0.4));
      ctx.lineTo(satX - Math.cos(angle) * gravForceDisplay - 8 * Math.cos(gAngle + 0.4), satY + Math.sin(angle) * gravForceDisplay - 8 * Math.sin(gAngle + 0.4));
      ctx.fill();

      // Velocity vector (tangential)
      const vScale = 0.02;
      const vAngle = angle + Math.PI / 2;
      const vx = Math.cos(vAngle) * orbitalVelocity * vScale;
      const vy = Math.sin(vAngle) * orbitalVelocity * vScale;
      
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(satX + vx, satY - vy);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(satX + vx, satY - vy);
      ctx.lineTo(satX + vx - 8 * Math.cos(vAngle - 0.4), satY - vy + 8 * Math.sin(vAngle - 0.4));
      ctx.lineTo(satX + vx - 8 * Math.cos(vAngle + 0.4), satY - vy + 8 * Math.sin(vAngle + 0.4));
      ctx.fill();
    }

    // Draw satellite
    const satGradient = ctx.createRadialGradient(satX - 3, satY - 3, 0, satX, satY, 10);
    satGradient.addColorStop(0, "#fbbf24");
    satGradient.addColorStop(1, "#d97706");
    ctx.fillStyle = satGradient;
    ctx.beginPath();
    ctx.arc(satX, satY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Satellite glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#fbbf24";
    ctx.beginPath();
    ctx.arc(satX, satY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Solar panels
    ctx.fillStyle = "#1e40af";
    ctx.fillRect(satX - 20, satY - 2, 12, 4);
    ctx.fillRect(satX + 8, satY - 2, 12, 4);

    // Info panel
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(10, 10, 220, 200);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 220, 200);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "left";
    
    ctx.fillText(`${t.altitude}: ${altitude.toFixed(0)} ${t.km}`, 20, 30);
    ctx.fillText(`${t.orbitRadius}: ${orbitRadiusKm.toFixed(0)} ${t.km}`, 20, 50);
    ctx.fillText(`${t.orbitalVelocity}: ${orbitalVelocity.toFixed(0)} ${t.ms}`, 20, 70);
    ctx.fillText(`${t.orbitalPeriod}: ${formatTime(orbitalPeriod)}`, 20, 90);
    ctx.fillText(`${t.angularVelocity}: ${(angularVelocity * 1000).toFixed(3)} m${t.rads}`, 20, 110);
    ctx.fillText(`${t.gravitationalAcceleration}: ${gravAcceleration.toFixed(2)} ${t.ms2}`, 20, 130);
    ctx.fillText(`${t.gravitationalForce}: ${gravForce.toFixed(1)} ${t.n}`, 20, 150);
    ctx.fillText(`${t.linearVelocity}: ${orbitalVelocity.toFixed(0)} ${t.ms}`, 20, 170);
    ctx.fillText(`${t.orbitalCircumference}: ${(circumference / 1000).toFixed(0)} ${t.km}`, 20, 190);

    // Orbit type indicator
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(width - 180, 10, 170, 50);
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(width - 180, 10, 170, 50);
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px system-ui";
    ctx.fillText(t.orbitType + ":", width - 170, 30);
    
    let orbitLabel = "";
    let orbitColor = "#3b82f6";
    if (orbitType === "leo") {
      orbitLabel = t.leo;
      orbitColor = "#22c55e";
    } else if (orbitType === "meo") {
      orbitLabel = t.meo;
      orbitColor = "#f59e0b";
    } else if (orbitType === "geostationary") {
      orbitLabel = t.geostationary;
      orbitColor = "#8b5cf6";
    } else {
      orbitLabel = t.heo;
      orbitColor = "#ef4444";
    }
    
    ctx.fillStyle = orbitColor;
    ctx.font = "bold 12px system-ui";
    ctx.fillText(orbitLabel, width - 170, 50);

    // Orbits completed
    const orbitsCompleted = time / orbitalPeriod;
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(width - 180, height - 40, 170, 30);
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px system-ui";
    ctx.fillText(`${t.orbits}: ${orbitsCompleted.toFixed(2)} ${t.completed}`, width - 170, height - 20);

    // Time display
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(10, height - 40, 150, 30);
    ctx.fillStyle = "#1e293b";
    ctx.fillText(`Time: ${formatTime(time)}`, 20, height - 20);

    // Legend
    if (showForces) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillRect(10, 220, 150, 50);
      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(10, 220, 150, 50);
      
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, 235);
      ctx.lineTo(40, 235);
      ctx.stroke();
      ctx.fillStyle = "#1e293b";
      ctx.font = "10px system-ui";
      ctx.fillText(t.linearVelocity, 50, 238);
      
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(20, 255);
      ctx.lineTo(40, 255);
      ctx.stroke();
      ctx.fillStyle = "#1e293b";
      ctx.fillText(t.gravitationalForce, 50, 258);
    }

  }, [altitude, mass, angle, time, showOrbit, showForces, trail, orbitRadius, orbitRadiusKm, orbitalVelocity, orbitalPeriod, angularVelocity, gravAcceleration, gravForce, circumference, t]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const startTime = Date.now() - time * 1000;
    const realTimeScale = 100; // Speed up simulation

    const animate = () => {
      const currentTime = (Date.now() - startTime) / 1000 * realTimeScale;
      const currentAngle = (angularVelocity * currentTime) % (2 * Math.PI);
      
      setTime(currentTime);
      setAngle(currentAngle);

      // Add to trail
      setTrail(prev => {
        const newTrail = [...prev, currentAngle];
        return newTrail.slice(-200);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, angularVelocity, time]);

  // Draw
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setAngle(0);
    setTrail([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Satellite className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-500" />
                {t.altitude}
              </label>
              <Badge variant="secondary">{altitude.toFixed(0)} {t.km}</Badge>
            </div>
            <Slider
              value={[altitude]}
              onValueChange={([value]) => { setAltitude(value); handleReset(); }}
              min={200}
              max={40000}
              step={100}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t.satelliteMass}</label>
              <Badge variant="secondary">{mass.toFixed(0)} {t.kg}</Badge>
            </div>
            <Slider
              value={[mass]}
              onValueChange={([value]) => setMass(value)}
              min={100}
              max={10000}
              step={100}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOrbit"
              checked={showOrbit}
              onChange={(e) => setShowOrbit(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showOrbit" className="text-sm cursor-pointer">{t.showOrbit}</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showForces"
              checked={showForces}
              onChange={(e) => setShowForces(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showForces" className="text-sm cursor-pointer">{t.showForces}</label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-cyan-500 hover:bg-cyan-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
          <code className="text-sm font-mono">{t.formula}</code>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={600} height={450} className="w-full" />
        </div>

        {/* Orbit info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.orbitalVelocity}</p>
            <p className="font-bold text-lg text-cyan-600">{orbitalVelocity.toFixed(0)} {t.ms}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.orbitalPeriod}</p>
            <p className="font-bold text-lg text-blue-600">{formatTime(orbitalPeriod)}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.distanceFromCenter}</p>
            <p className="font-bold text-lg text-green-600">{orbitRadiusKm.toFixed(0)} {t.km}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
            <p className="text-xs text-slate-500">{t.gravitationalForce}</p>
            <p className="font-bold text-lg text-purple-600">{gravForce.toFixed(0)} {t.n}</p>
          </div>
        </div>

        {/* Geostationary info */}
        {Math.abs(altitude - 35786) < 500 && (
          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛰️</span>
              <span className="font-bold text-purple-700 dark:text-purple-300">{t.geostationary}</span>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              {language === "ar" 
                ? "في هذا الارتفاع، دور القمر الصناعي = 24 ساعة، أي يظل فوق نفس النقطة على الأرض"
                : "At this altitude, orbital period = 24 hours, satellite stays above the same point on Earth"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
