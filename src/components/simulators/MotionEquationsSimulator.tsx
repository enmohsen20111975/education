"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calculator, RotateCcw, Zap, TrendingUp, Timer, Move, ArrowRight, Lightbulb, CheckCircle2 } from "lucide-react";

interface MotionEquationsSimulatorProps {
  language: "ar" | "en";
}

type SolveFor = "displacement" | "finalVelocity" | "time" | "acceleration";

export function MotionEquationsSimulator({ language }: MotionEquationsSimulatorProps) {
  // State
  const [initialVelocity, setInitialVelocity] = useState<string>("0");
  const [finalVelocity, setFinalVelocity] = useState<string>("");
  const [acceleration, setAcceleration] = useState<string>("2");
  const [time, setTime] = useState<string>("5");
  const [displacement, setDisplacement] = useState<string>("");
  const [solveFor, setSolveFor] = useState<SolveFor>("displacement");
  const [result, setResult] = useState<{ value: number; unit: string; formula: string } | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  // Text translations
  const texts = {
    ar: {
      title: "حاسبة معادلات الحركة",
      description: "احسب المجهولات في معادلات الحركة الخطية",
      initialVelocity: "السرعة الابتدائية (v₀)",
      finalVelocity: "السرعة النهائية (v)",
      acceleration: "التسارع (a)",
      time: "الزمن (t)",
      displacement: "الإزاحة (s)",
      solveFor: "أحسب",
      calculate: "احسب",
      reset: "إعادة",
      result: "النتيجة",
      formula: "المعادلة المستخدمة",
      steps: "خطوات الحل",
      mps: "م/ث",
      ms2: "م/ث²",
      seconds: "ثانية",
      meters: "متر",
      physicsExplanation: "التفسير الفيزيائي",
      equations: "المعادلات الأساسية",
      firstEquation: "v = v₀ + at",
      secondEquation: "s = v₀t + ½at²",
      thirdEquation: "v² = v₀² + 2as",
      fourthEquation: "s = ½(v₀ + v)t",
      velocityChange: "التغير في السرعة",
      avgVelocity: "متوسط السرعة",
      distanceTraveled: "المسافة المقطوعة",
      motionType: "نوع الحركة",
      accelerated: "حركة متسارعة",
      decelerated: "حركة متباطئة",
      uniform: "حركة منتظمة",
      examples: "أمثلة",
      carExample: "سيارة تبدأ من السكون وتتسارع بـ 3 م/ث² لمدة 5 ثوانٍ",
      brakeExample: "سيارة تسير بسرعة 20 م/ث وتتباطأ بـ 4 م/ث² حتى تتوقف",
      inputValues: "القيم المدخلة",
      enterValues: "أدخل القيم المعروفة",
      explanation: {
        displacement: "الإزاحة هي التغير في الموضع، وتُحسب من المسافة بين نقطة البداية والنهاية",
        finalVelocity: "السرعة النهائية هي سرعة الجسم في نهاية الفترة الزمنية",
        time: "الزمن المستغرق للوصول من السرعة الابتدائية إلى السرعة النهائية",
        acceleration: "التسارع هو معدل التغير في السرعة مع الزمن",
      },
    },
    en: {
      title: "Motion Equations Calculator",
      description: "Calculate unknowns in linear motion equations",
      initialVelocity: "Initial Velocity (v₀)",
      finalVelocity: "Final Velocity (v)",
      acceleration: "Acceleration (a)",
      time: "Time (t)",
      displacement: "Displacement (s)",
      solveFor: "Calculate",
      calculate: "Calculate",
      reset: "Reset",
      result: "Result",
      formula: "Formula Used",
      steps: "Solution Steps",
      mps: "m/s",
      ms2: "m/s²",
      seconds: "s",
      meters: "m",
      physicsExplanation: "Physics Explanation",
      equations: "Fundamental Equations",
      firstEquation: "v = v₀ + at",
      secondEquation: "s = v₀t + ½at²",
      thirdEquation: "v² = v₀² + 2as",
      fourthEquation: "s = ½(v₀ + v)t",
      velocityChange: "Velocity Change",
      avgVelocity: "Average Velocity",
      distanceTraveled: "Distance Traveled",
      motionType: "Motion Type",
      accelerated: "Accelerated Motion",
      decelerated: "Decelerated Motion",
      uniform: "Uniform Motion",
      examples: "Examples",
      carExample: "A car starts from rest and accelerates at 3 m/s² for 5 seconds",
      brakeExample: "A car moving at 20 m/s decelerates at 4 m/s² until it stops",
      inputValues: "Input Values",
      enterValues: "Enter known values",
      explanation: {
        displacement: "Displacement is the change in position, calculated from the distance between start and end points",
        finalVelocity: "Final velocity is the speed of the object at the end of the time period",
        time: "Time taken to go from initial to final velocity",
        acceleration: "Acceleration is the rate of change of velocity with time",
      },
    },
  };

  const t = texts[language];

  // Calculate based on selected unknown
  const calculate = () => {
    const v0 = parseFloat(initialVelocity) || 0;
    const v = parseFloat(finalVelocity);
    const a = parseFloat(acceleration);
    const tVal = parseFloat(time);
    const s = parseFloat(displacement);

    let calculatedResult: { value: number; unit: string; formula: string } | null = null;

    switch (solveFor) {
      case "displacement":
        if (!isNaN(v0) && !isNaN(a) && !isNaN(tVal)) {
          const sCalc = v0 * tVal + 0.5 * a * tVal * tVal;
          calculatedResult = {
            value: sCalc,
            unit: t.meters,
            formula: "s = v₀t + ½at²",
          };
        }
        break;

      case "finalVelocity":
        if (!isNaN(v0) && !isNaN(a) && !isNaN(tVal)) {
          const vCalc = v0 + a * tVal;
          calculatedResult = {
            value: vCalc,
            unit: t.mps,
            formula: "v = v₀ + at",
          };
        }
        break;

      case "time":
        if (!isNaN(v0) && !isNaN(v) && !isNaN(a) && a !== 0) {
          const tCalc = (v - v0) / a;
          if (tCalc >= 0) {
            calculatedResult = {
              value: tCalc,
              unit: t.seconds,
              formula: "t = (v - v₀) / a",
            };
          }
        } else if (!isNaN(v0) && !isNaN(s) && !isNaN(a)) {
          // Using quadratic formula: s = v₀t + ½at²
          const discriminant = v0 * v0 + 2 * a * s;
          if (discriminant >= 0) {
            const tCalc = (-v0 + Math.sqrt(discriminant)) / a;
            if (tCalc >= 0) {
              calculatedResult = {
                value: tCalc,
                unit: t.seconds,
                formula: "s = v₀t + ½at² (quadratic)",
              };
            }
          }
        }
        break;

      case "acceleration":
        if (!isNaN(v0) && !isNaN(v) && !isNaN(tVal) && tVal !== 0) {
          const aCalc = (v - v0) / tVal;
          calculatedResult = {
            value: aCalc,
            unit: t.ms2,
            formula: "a = (v - v₀) / t",
          };
        } else if (!isNaN(v0) && !isNaN(s) && !isNaN(tVal) && tVal !== 0) {
          const aCalc = (2 * (s - v0 * tVal)) / (tVal * tVal);
          calculatedResult = {
            value: aCalc,
            unit: t.ms2,
            formula: "a = 2(s - v₀t) / t²",
          };
        }
        break;
    }

    setResult(calculatedResult);
    setShowSteps(true);
  };

  // Reset function
  const handleReset = () => {
    setInitialVelocity("0");
    setFinalVelocity("");
    setAcceleration("2");
    setTime("5");
    setDisplacement("");
    setResult(null);
    setShowSteps(false);
    setSolveFor("displacement");
  };

  // Get motion type
  const getMotionType = () => {
    const a = parseFloat(acceleration) || 0;
    if (a > 0) return t.accelerated;
    if (a < 0) return t.decelerated;
    return t.uniform;
  };

  // Get additional info
  const getAdditionalInfo = () => {
    const v0 = parseFloat(initialVelocity) || 0;
    const a = parseFloat(acceleration) || 0;
    const tVal = parseFloat(time) || 0;

    const vFinal = v0 + a * tVal;
    const velocityChange = Math.abs(vFinal - v0);
    const avgVelocity = (v0 + vFinal) / 2;

    return {
      velocityChange,
      avgVelocity,
      motionType: getMotionType(),
    };
  };

  const additionalInfo = getAdditionalInfo();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-cyan-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Equations Reference */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[t.firstEquation, t.secondEquation, t.thirdEquation, t.fourthEquation].map((eq, i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-center">
              <code className="text-sm font-mono">{eq}</code>
            </div>
          ))}
        </div>

        {/* Solve For Selection */}
        <div className="space-y-3">
          <label className="font-medium flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-cyan-500" />
            {t.solveFor}
          </label>
          <div className="flex flex-wrap gap-2">
            {(["displacement", "finalVelocity", "time", "acceleration"] as SolveFor[]).map((type) => (
              <Button
                key={type}
                variant={solveFor === type ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSolveFor(type);
                  setResult(null);
                }}
                className={solveFor === type ? "bg-cyan-500 hover:bg-cyan-600" : ""}
              >
                {type === "displacement" && t.displacement.split(" ")[0]}
                {type === "finalVelocity" && t.finalVelocity.split(" ")[0]}
                {type === "time" && t.time.split(" ")[0]}
                {type === "acceleration" && t.acceleration.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Initial Velocity */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {t.initialVelocity}
            </label>
            <Input
              type="number"
              value={initialVelocity}
              onChange={(e) => setInitialVelocity(e.target.value)}
              placeholder="0"
              disabled={solveFor === "finalVelocity" && !time && !acceleration}
            />
          </div>

          {/* Final Velocity */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              {t.finalVelocity}
            </label>
            <Input
              type="number"
              value={finalVelocity}
              onChange={(e) => setFinalVelocity(e.target.value)}
              placeholder="?"
              disabled={solveFor === "finalVelocity"}
              className={solveFor === "finalVelocity" ? "bg-cyan-50 dark:bg-cyan-950" : ""}
            />
          </div>

          {/* Acceleration */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              {t.acceleration}
            </label>
            <Input
              type="number"
              value={acceleration}
              onChange={(e) => setAcceleration(e.target.value)}
              placeholder="0"
              disabled={solveFor === "acceleration"}
              className={solveFor === "acceleration" ? "bg-cyan-50 dark:bg-cyan-950" : ""}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" />
              {t.time}
            </label>
            <Input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="?"
              disabled={solveFor === "time"}
              className={solveFor === "time" ? "bg-cyan-50 dark:bg-cyan-950" : ""}
            />
          </div>

          {/* Displacement */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Move className="w-4 h-4 text-rose-500" />
              {t.displacement}
            </label>
            <Input
              type="number"
              value={displacement}
              onChange={(e) => setDisplacement(e.target.value)}
              placeholder="?"
              disabled={solveFor === "displacement"}
              className={solveFor === "displacement" ? "bg-cyan-50 dark:bg-cyan-950" : ""}
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex gap-3">
          <Button
            onClick={calculate}
            className="bg-cyan-500 hover:bg-cyan-600 flex-1"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {t.calculate}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="p-4 bg-cyan-50 dark:bg-cyan-950 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-600" />
              <span className="font-bold text-cyan-700 dark:text-cyan-300">{t.result}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-cyan-600">
                  {result.value.toFixed(2)} {result.unit}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  <code>{result.formula}</code>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.velocityChange}:</span>
                  <span className="font-medium">{additionalInfo.velocityChange.toFixed(2)} {t.mps}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.avgVelocity}:</span>
                  <span className="font-medium">{additionalInfo.avgVelocity.toFixed(2)} {t.mps}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.motionType}:</span>
                  <Badge variant="outline">{additionalInfo.motionType}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Physics Explanation */}
        {result && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-amber-700 dark:text-amber-300">{t.physicsExplanation}</span>
            </div>
            <p className="text-amber-600 dark:text-amber-400 text-sm">
              {t.explanation[solveFor]}
            </p>
          </div>
        )}

        {/* Examples */}
        <div className="space-y-2">
          <label className="font-medium text-sm text-slate-500">{t.examples}:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-left h-auto py-2"
              onClick={() => {
                setInitialVelocity("0");
                setAcceleration("3");
                setTime("5");
                setSolveFor("displacement");
              }}
            >
              <span className="text-xs">{t.carExample}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-left h-auto py-2"
              onClick={() => {
                setInitialVelocity("20");
                setFinalVelocity("0");
                setAcceleration("-4");
                setSolveFor("time");
              }}
            >
              <span className="text-xs">{t.brakeExample}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
