"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Plus, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface FunctionGrapherProps {
  language: "ar" | "en";
}

interface PlottedFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const colors = ["#8b5cf6", "#ec4899", "#3b82f6", "#22c55e", "#f97316", "#ef4444", "#06b6d4"];

export function FunctionGrapher({ language }: FunctionGrapherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [functions, setFunctions] = useState<PlottedFunction[]>([
    { id: "1", expression: "x^2", color: colors[0], visible: true }
  ]);
  const [newExpression, setNewExpression] = useState("");
  const [scale, setScale] = useState(50); // pixels per unit
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "راسم الدوال البياني" : "Function Grapher",
    addFunction: isRTL ? "إضافة دالة" : "Add Function",
    expression: isRTL ? "التعبير الرياضي" : "Expression",
    placeholder: isRTL ? "مثال: x^2, sin(x), 2*x+1" : "e.g., x^2, sin(x), 2*x+1",
    zoomIn: isRTL ? "تكبير" : "Zoom In",
    zoomOut: isRTL ? "تصغير" : "Zoom Out",
    reset: isRTL ? "إعادة" : "Reset",
    hide: isRTL ? "إخفاء" : "Hide",
    show: isRTL ? "إظهار" : "Show",
    delete: isRTL ? "حذف" : "Delete",
    examples: isRTL ? "أمثلة" : "Examples"
  };

  // Parse and evaluate expression
  const evaluateExpression = (expr: string, x: number): number | null => {
    try {
      // Replace common mathematical functions
      let processed = expr
        .replace(/\^/g, "**")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/abs/g, "Math.abs")
        .replace(/log/g, "Math.log")
        .replace(/ln/g, "Math.log")
        .replace(/exp/g, "Math.exp")
        .replace(/pi/gi, "Math.PI")
        .replace(/e(?![xp])/g, "Math.E");
      
      // Evaluate using Function constructor
      const func = new Function("x", `return ${processed}`);
      return func(x);
    } catch {
      return null;
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    
    const gridSpacing = scale;
    
    // Vertical grid lines
    for (let x = (width / 2 + centerX) % gridSpacing; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = (height / 2 + centerY) % gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    
    // X-axis
    const yAxisPos = height / 2 + centerY;
    ctx.beginPath();
    ctx.moveTo(0, yAxisPos);
    ctx.lineTo(width, yAxisPos);
    ctx.stroke();
    
    // Y-axis
    const xAxisPos = width / 2 + centerX;
    ctx.beginPath();
    ctx.moveTo(xAxisPos, 0);
    ctx.lineTo(xAxisPos, height);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    
    // X-axis labels
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue;
      const x = xAxisPos + i * scale;
      if (x > 0 && x < width) {
        ctx.fillText(i.toString(), x, yAxisPos + 15);
      }
    }
    
    // Y-axis labels
    ctx.textAlign = "right";
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue;
      const y = yAxisPos - i * scale;
      if (y > 0 && y < height) {
        ctx.fillText(i.toString(), xAxisPos - 5, y + 4);
      }
    }
    
    // Origin
    ctx.fillText("0", xAxisPos - 5, yAxisPos + 15);
    
    // Draw functions
    functions.forEach(func => {
      if (!func.visible) return;
      
      ctx.strokeStyle = func.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let started = false;
      
      for (let px = 0; px < width; px++) {
        const x = (px - width / 2 - centerX) / scale;
        const y = evaluateExpression(func.expression, x);
        
        if (y !== null && !isNaN(y) && isFinite(y)) {
          const py = height / 2 + centerY - y * scale;
          
          if (py > -1000 && py < height + 1000) {
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        } else {
          started = false;
        }
      }
      
      ctx.stroke();
    });
    
  }, [functions, scale, centerX, centerY]);

  // Draw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  const addFunction = () => {
    if (!newExpression.trim()) return;
    
    const newFunc: PlottedFunction = {
      id: Date.now().toString(),
      expression: newExpression.trim(),
      color: colors[functions.length % colors.length],
      visible: true
    };
    
    setFunctions([...functions, newFunc]);
    setNewExpression("");
  };

  const toggleFunction = (id: string) => {
    setFunctions(functions.map(f => 
      f.id === id ? { ...f, visible: !f.visible } : f
    ));
  };

  const deleteFunction = (id: string) => {
    setFunctions(functions.filter(f => f.id !== id));
  };

  const handleZoomIn = () => {
    setScale(Math.min(200, scale * 1.2));
  };

  const handleZoomOut = () => {
    setScale(Math.max(10, scale / 1.2));
  };

  const handleReset = () => {
    setScale(50);
    setCenterX(0);
    setCenterY(0);
    setFunctions([{ id: "1", expression: "x^2", color: colors[0], visible: true }]);
  };

  const exampleFunctions = [
    { expr: "x^2", label: isRTL ? "دالة تربيعية" : "Quadratic" },
    { expr: "sin(x)", label: isRTL ? "جيب" : "Sine" },
    { expr: "cos(x)", label: isRTL ? "جيب تمام" : "Cosine" },
    { expr: "x^3", label: isRTL ? "دالة تكعيبية" : "Cubic" },
    { expr: "1/x", label: isRTL ? "دالة عكسية" : "Inverse" },
    { expr: "sqrt(x)", label: isRTL ? "جذر تربيعي" : "Square Root" },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-500" />
            {labels.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canvas */}
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <canvas 
            ref={canvasRef} 
            width={700} 
            height={400}
            className="w-full h-auto"
          />
        </div>
        
        {/* Add Function */}
        <div className="flex gap-2">
          <Input
            value={newExpression}
            onChange={(e) => setNewExpression(e.target.value)}
            placeholder={labels.placeholder}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && addFunction()}
          />
          <Button onClick={addFunction}>
            <Plus className="w-4 h-4 mr-2" />
            {labels.addFunction}
          </Button>
        </div>
        
        {/* Example Functions */}
        <div>
          <Label className="text-sm text-slate-500 mb-2 block">{labels.examples}:</Label>
          <div className="flex flex-wrap gap-2">
            {exampleFunctions.map((ex) => (
              <Button
                key={ex.expr}
                variant="outline"
                size="sm"
                onClick={() => setNewExpression(ex.expr)}
              >
                {ex.expr} ({ex.label})
              </Button>
            ))}
          </div>
        </div>
        
        {/* Function List */}
        <div className="space-y-2">
          {functions.map((func) => (
            <div
              key={func.id}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: func.color }}
              />
              <code className="flex-1 font-mono">{func.expression}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFunction(func.id)}
              >
                {func.visible ? labels.hide : labels.show}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteFunction(func.id)}
                className="text-red-500"
              >
                {labels.delete}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
