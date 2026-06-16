"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Triangle, Square, Circle, Hexagon, RectangleHorizontal, RotateCcw } from "lucide-react";

interface GeometrySimulatorProps {
  language: "ar" | "en";
}

type ShapeType = "circle" | "rectangle" | "triangle" | "square" | "hexagon";

export function GeometrySimulator({ language }: GeometrySimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [shape, setShape] = useState<ShapeType>("circle");
  const [dimensions, setDimensions] = useState({
    radius: 80,
    width: 150,
    height: 100,
    side: 100,
  });
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكي الهندسة" : "Geometry Simulator",
    selectShape: isRTL ? "اختر الشكل" : "Select Shape",
    circle: isRTL ? "دائرة" : "Circle",
    rectangle: isRTL ? "مستطيل" : "Rectangle",
    triangle: isRTL ? "مثلث" : "Triangle",
    square: isRTL ? "مربع" : "Square",
    hexagon: isRTL ? "سداسي" : "Hexagon",
    radius: isRTL ? "نصف القطر (r)" : "Radius (r)",
    width: isRTL ? "العرض (w)" : "Width (w)",
    height: isRTL ? "الارتفاع (h)" : "Height (h)",
    side: isRTL ? "الضلع (s)" : "Side (s)",
    area: isRTL ? "المساحة" : "Area",
    perimeter: isRTL ? "المحيط" : "Perimeter",
    formula: isRTL ? "الصيغة" : "Formula",
    reset: isRTL ? "إعادة تعيين" : "Reset",
    properties: isRTL ? "الخصائص" : "Properties",
    calculations: isRTL ? "الحسابات" : "Calculations"
  };

  const shapeLabels: Record<ShapeType, string> = {
    circle: labels.circle,
    rectangle: labels.rectangle,
    triangle: labels.triangle,
    square: labels.square,
    hexagon: labels.hexagon,
  };

  const calculateArea = useCallback(() => {
    switch (shape) {
      case "circle":
        return Math.PI * dimensions.radius * dimensions.radius;
      case "rectangle":
        return dimensions.width * dimensions.height;
      case "triangle":
        return (dimensions.side * dimensions.side * Math.sqrt(3)) / 4;
      case "square":
        return dimensions.side * dimensions.side;
      case "hexagon":
        return ((3 * Math.sqrt(3)) / 2) * dimensions.side * dimensions.side;
      default:
        return 0;
    }
  }, [shape, dimensions]);

  const calculatePerimeter = useCallback(() => {
    switch (shape) {
      case "circle":
        return 2 * Math.PI * dimensions.radius;
      case "rectangle":
        return 2 * (dimensions.width + dimensions.height);
      case "triangle":
        return 3 * dimensions.side;
      case "square":
        return 4 * dimensions.side;
      case "hexagon":
        return 6 * dimensions.side;
      default:
        return 0;
    }
  }, [shape, dimensions]);

  const getFormula = useCallback(() => {
    switch (shape) {
      case "circle":
        return { area: "A = πr²", perimeter: "P = 2πr" };
      case "rectangle":
        return { area: "A = w × h", perimeter: "P = 2(w + h)" };
      case "triangle":
        return { area: "A = (√3/4)s²", perimeter: "P = 3s" };
      case "square":
        return { area: "A = s²", perimeter: "P = 4s" };
      case "hexagon":
        return { area: "A = (3√3/2)s²", perimeter: "P = 6s" };
      default:
        return { area: "", perimeter: "" };
    }
  }, [shape]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    const gridSize = 20;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Shape fill
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    
    switch (shape) {
      case "circle": {
        ctx.beginPath();
        ctx.arc(centerX, centerY, dimensions.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Radius line
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + dimensions.radius, centerY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Radius label
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`r = ${dimensions.radius}`, centerX + dimensions.radius / 2, centerY - 10);
        break;
      }
      
      case "rectangle": {
        const x = centerX - dimensions.width / 2;
        const y = centerY - dimensions.height / 2;
        
        ctx.beginPath();
        ctx.rect(x, y, dimensions.width, dimensions.height);
        ctx.fill();
        ctx.stroke();
        
        // Width label
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`w = ${dimensions.width}`, centerX, y + dimensions.height + 25);
        
        // Height label
        ctx.fillStyle = "#f97316";
        ctx.save();
        ctx.translate(x - 15, centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`h = ${dimensions.height}`, 0, 0);
        ctx.restore();
        break;
      }
      
      case "triangle": {
        const h = (dimensions.side * Math.sqrt(3)) / 2;
        const p1 = { x: centerX, y: centerY - h / 1.5 };
        const p2 = { x: centerX - dimensions.side / 2, y: centerY + h / 3 };
        const p3 = { x: centerX + dimensions.side / 2, y: centerY + h / 3 };
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Side label
        ctx.fillStyle = "#8b5cf6";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`s = ${dimensions.side}`, centerX, p2.y + 25);
        break;
      }
      
      case "square": {
        const x = centerX - dimensions.side / 2;
        const y = centerY - dimensions.side / 2;
        
        ctx.beginPath();
        ctx.rect(x, y, dimensions.side, dimensions.side);
        ctx.fill();
        ctx.stroke();
        
        // Side label
        ctx.fillStyle = "#06b6d4";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`s = ${dimensions.side}`, centerX, y + dimensions.side + 25);
        break;
      }
      
      case "hexagon": {
        const angle = Math.PI / 3;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const x = centerX + dimensions.side * Math.cos(angle * i - Math.PI / 6);
          const y = centerY + dimensions.side * Math.sin(angle * i - Math.PI / 6);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Side label
        ctx.fillStyle = "#ec4899";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`s = ${dimensions.side}`, centerX, centerY + dimensions.side + 25);
        break;
      }
    }
  }, [shape, dimensions]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleReset = () => {
    setShape("circle");
    setDimensions({ radius: 80, width: 150, height: 100, side: 100 });
  };

  const renderDimensionControls = () => {
    switch (shape) {
      case "circle":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{labels.radius}</span>
              <code className="text-blue-600">{dimensions.radius}</code>
            </div>
            <Slider
              value={[dimensions.radius]}
              onValueChange={(v) => setDimensions({ ...dimensions, radius: v[0] })}
              min={20}
              max={150}
              step={1}
            />
          </div>
        );
      
      case "rectangle":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{labels.width}</span>
                <code className="text-green-600">{dimensions.width}</code>
              </div>
              <Slider
                value={[dimensions.width]}
                onValueChange={(v) => setDimensions({ ...dimensions, width: v[0] })}
                min={50}
                max={250}
                step={1}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{labels.height}</span>
                <code className="text-orange-600">{dimensions.height}</code>
              </div>
              <Slider
                value={[dimensions.height]}
                onValueChange={(v) => setDimensions({ ...dimensions, height: v[0] })}
                min={30}
                max={180}
                step={1}
              />
            </div>
          </div>
        );
      
      case "triangle":
      case "square":
      case "hexagon":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{labels.side}</span>
              <code className="text-purple-600">{dimensions.side}</code>
            </div>
            <Slider
              value={[dimensions.side]}
              onValueChange={(v) => setDimensions({ ...dimensions, side: v[0] })}
              min={30}
              max={150}
              step={1}
            />
          </div>
        );
    }
  };

  const ShapeIcon = {
    circle: Circle,
    rectangle: RectangleHorizontal,
    triangle: Triangle,
    square: Square,
    hexagon: Hexagon,
  }[shape];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {ShapeIcon && <ShapeIcon className="w-5 h-5 text-blue-500" />}
            {labels.title}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {labels.reset}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canvas */}
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={350}
              className="w-full h-auto bg-white"
            />
          </div>
          
          {/* Controls and Calculations */}
          <div className="space-y-6">
            {/* Shape Selector */}
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                {labels.selectShape}
              </label>
              <Select value={shape} onValueChange={(v) => setShape(v as ShapeType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4" />
                      {labels.circle}
                    </div>
                  </SelectItem>
                  <SelectItem value="rectangle">
                    <div className="flex items-center gap-2">
                      <RectangleHorizontal className="w-4 h-4" />
                      {labels.rectangle}
                    </div>
                  </SelectItem>
                  <SelectItem value="triangle">
                    <div className="flex items-center gap-2">
                      <Triangle className="w-4 h-4" />
                      {labels.triangle}
                    </div>
                  </SelectItem>
                  <SelectItem value="square">
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4" />
                      {labels.square}
                    </div>
                  </SelectItem>
                  <SelectItem value="hexagon">
                    <div className="flex items-center gap-2">
                      <Hexagon className="w-4 h-4" />
                      {labels.hexagon}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Dimension Controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-medium mb-3">{labels.properties}</h4>
              {renderDimensionControls()}
            </div>
            
            {/* Calculations */}
            <div className="space-y-3">
              <h4 className="font-medium">{labels.calculations}</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 mb-1">{labels.area}</p>
                  <code className="text-xl font-bold text-blue-700">
                    {calculateArea().toFixed(2)}
                  </code>
                  <p className="text-xs text-blue-500 mt-2 font-mono">
                    {getFormula().area}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 mb-1">{labels.perimeter}</p>
                  <code className="text-xl font-bold text-green-700">
                    {calculatePerimeter().toFixed(2)}
                  </code>
                  <p className="text-xs text-green-500 mt-2 font-mono">
                    {getFormula().perimeter}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Detailed Formula */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium mb-2 text-purple-700 dark:text-purple-400">{labels.formula}</h4>
              <div className="space-y-2 text-sm">
                {shape === "circle" && (
                  <>
                    <p><strong>{labels.area}:</strong> A = π × {dimensions.radius}² = π × {(dimensions.radius ** 2).toLocaleString()} ≈ {calculateArea().toFixed(2)}</p>
                    <p><strong>{labels.perimeter}:</strong> P = 2π × {dimensions.radius} ≈ {calculatePerimeter().toFixed(2)}</p>
                  </>
                )}
                {shape === "rectangle" && (
                  <>
                    <p><strong>{labels.area}:</strong> A = {dimensions.width} × {dimensions.height} = {calculateArea().toFixed(2)}</p>
                    <p><strong>{labels.perimeter}:</strong> P = 2({dimensions.width} + {dimensions.height}) = {calculatePerimeter().toFixed(2)}</p>
                  </>
                )}
                {shape === "triangle" && (
                  <>
                    <p><strong>{labels.area}:</strong> A = (√3/4) × {dimensions.side}² ≈ {calculateArea().toFixed(2)}</p>
                    <p><strong>{labels.perimeter}:</strong> P = 3 × {dimensions.side} = {calculatePerimeter().toFixed(2)}</p>
                  </>
                )}
                {shape === "square" && (
                  <>
                    <p><strong>{labels.area}:</strong> A = {dimensions.side}² = {calculateArea().toFixed(2)}</p>
                    <p><strong>{labels.perimeter}:</strong> P = 4 × {dimensions.side} = {calculatePerimeter().toFixed(2)}</p>
                  </>
                )}
                {shape === "hexagon" && (
                  <>
                    <p><strong>{labels.area}:</strong> A = (3√3/2) × {dimensions.side}² ≈ {calculateArea().toFixed(2)}</p>
                    <p><strong>{labels.perimeter}:</strong> P = 6 × {dimensions.side} = {calculatePerimeter().toFixed(2)}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
