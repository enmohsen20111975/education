"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Scale, Thermometer, Clock, Zap, Droplet } from "lucide-react";

interface UnitConverterProps {
  language: "ar" | "en";
}

interface UnitCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: any;
  units: { id: string; nameAr: string; nameEn: string; factor: number }[];
}

const categories: UnitCategory[] = [
  {
    id: "length",
    nameAr: "الطول",
    nameEn: "Length",
    icon: Ruler,
    units: [
      { id: "km", nameAr: "كيلومتر", nameEn: "Kilometer", factor: 1000 },
      { id: "m", nameAr: "متر", nameEn: "Meter", factor: 1 },
      { id: "cm", nameAr: "سنتيمتر", nameEn: "Centimeter", factor: 0.01 },
      { id: "mm", nameAr: "ميلليمتر", nameEn: "Millimeter", factor: 0.001 },
      { id: "mile", nameAr: "ميل", nameEn: "Mile", factor: 1609.344 },
      { id: "ft", nameAr: "قدم", nameEn: "Foot", factor: 0.3048 },
      { id: "in", nameAr: "بوصة", nameEn: "Inch", factor: 0.0254 },
    ]
  },
  {
    id: "mass",
    nameAr: "الكتلة",
    nameEn: "Mass",
    icon: Scale,
    units: [
      { id: "kg", nameAr: "كيلوجرام", nameEn: "Kilogram", factor: 1 },
      { id: "g", nameAr: "جرام", nameEn: "Gram", factor: 0.001 },
      { id: "mg", nameAr: "ميلليجرام", nameEn: "Milligram", factor: 0.000001 },
      { id: "lb", nameAr: "رطل", nameEn: "Pound", factor: 0.453592 },
      { id: "oz", nameAr: "أونصة", nameEn: "Ounce", factor: 0.0283495 },
      { id: "ton", nameAr: "طن", nameEn: "Metric Ton", factor: 1000 },
    ]
  },
  {
    id: "temperature",
    nameAr: "درجة الحرارة",
    nameEn: "Temperature",
    icon: Thermometer,
    units: [
      { id: "c", nameAr: "سيليزي", nameEn: "Celsius", factor: 1 },
      { id: "f", nameAr: "فهرنهايت", nameEn: "Fahrenheit", factor: 1 },
      { id: "k", nameAr: "كلفن", nameEn: "Kelvin", factor: 1 },
    ]
  },
  {
    id: "time",
    nameAr: "الزمن",
    nameEn: "Time",
    icon: Clock,
    units: [
      { id: "s", nameAr: "ثانية", nameEn: "Second", factor: 1 },
      { id: "min", nameAr: "دقيقة", nameEn: "Minute", factor: 60 },
      { id: "h", nameAr: "ساعة", nameEn: "Hour", factor: 3600 },
      { id: "day", nameAr: "يوم", nameEn: "Day", factor: 86400 },
      { id: "week", nameAr: "أسبوع", nameEn: "Week", factor: 604800 },
    ]
  },
  {
    id: "speed",
    nameAr: "السرعة",
    nameEn: "Speed",
    icon: Zap,
    units: [
      { id: "mps", nameAr: "متر/ثانية", nameEn: "m/s", factor: 1 },
      { id: "kmph", nameAr: "كم/ساعة", nameEn: "km/h", factor: 0.277778 },
      { id: "mph", nameAr: "ميل/ساعة", nameEn: "mph", factor: 0.44704 },
      { id: "knot", nameAr: "عقدة", nameEn: "Knot", factor: 0.514444 },
    ]
  },
  {
    id: "volume",
    nameAr: "الحجم",
    nameEn: "Volume",
    icon: Droplet,
    units: [
      { id: "l", nameAr: "لتر", nameEn: "Liter", factor: 1 },
      { id: "ml", nameAr: "ميلليلتر", nameEn: "Milliliter", factor: 0.001 },
      { id: "m3", nameAr: "متر مكعب", nameEn: "Cubic Meter", factor: 1000 },
      { id: "gal", nameAr: "جالون", nameEn: "Gallon", factor: 3.78541 },
    ]
  }
];

export function UnitConverter({ language }: UnitConverterProps) {
  const [activeCategory, setActiveCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محول الوحدات" : "Unit Converter",
    from: isRTL ? "من" : "From",
    to: isRTL ? "إلى" : "To",
    result: isRTL ? "النتيجة" : "Result",
    swap: isRTL ? "تبديل" : "Swap",
    enterValue: isRTL ? "أدخل القيمة" : "Enter value"
  };

  const convert = (value: number, from: string, to: string, category: string): number => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return value;
    
    const fromUnitData = cat.units.find(u => u.id === from);
    const toUnitData = cat.units.find(u => u.id === to);
    
    if (!fromUnitData || !toUnitData) return value;
    
    // Special handling for temperature
    if (category === "temperature") {
      let celsius: number;
      
      // Convert to Celsius first
      switch (from) {
        case "c": celsius = value; break;
        case "f": celsius = (value - 32) * 5 / 9; break;
        case "k": celsius = value - 273.15; break;
        default: celsius = value;
      }
      
      // Convert from Celsius to target
      switch (to) {
        case "c": return celsius;
        case "f": return celsius * 9 / 5 + 32;
        case "k": return celsius + 273.15;
        default: return celsius;
      }
    }
    
    // Standard conversion using factors
    const baseValue = value * fromUnitData.factor;
    return baseValue / toUnitData.factor;
  };

  const handleConvert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setToValue("");
      return;
    }
    
    const result = convert(value, fromUnit, toUnit, activeCategory);
    
    // Format the result
    if (Math.abs(result) < 0.0001 || Math.abs(result) >= 1000000) {
      setToValue(result.toExponential(6));
    } else {
      setToValue(result.toFixed(6).replace(/\.?0+$/, ""));
    }
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const cat = categories.find(c => c.id === category);
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[0].id);
      setToUnit(cat.units[1].id);
      setFromValue("1");
      setToValue("");
    }
  };

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-blue-500" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {isRTL ? cat.nameAr : cat.nameEn}
              </Button>
            );
          })}
        </div>
        
        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* From */}
          <div className="space-y-2">
            <Label>{labels.from}</Label>
            <Input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder={labels.enterValue}
              className="h-12 text-lg"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory?.units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {isRTL ? unit.nameAr : unit.nameEn} ({unit.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center">
            <Button onClick={handleSwap} variant="outline" size="lg">
              ⇄ {labels.swap}
            </Button>
          </div>
          
          {/* To */}
          <div className="space-y-2">
            <Label>{labels.to}</Label>
            <div className="h-12 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center">
              <span className="text-lg font-mono font-bold text-green-600">
                {toValue || "—"}
              </span>
            </div>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory?.units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {isRTL ? unit.nameAr : unit.nameEn} ({unit.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Convert Button */}
        <Button onClick={handleConvert} className="w-full h-12 text-lg">
          {labels.result}
        </Button>
        
        {/* Quick Reference */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {currentCategory?.units.slice(0, 6).map((unit) => (
            <div key={unit.id} className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-center">
              <div className="font-bold">{isRTL ? unit.nameAr : unit.nameEn}</div>
              <div className="text-xs text-slate-500">({unit.id})</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
