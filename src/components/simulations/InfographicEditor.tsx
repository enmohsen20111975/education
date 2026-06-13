"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Palette, Plus, Trash2, Layout, Type, 
  Square, Circle, AlignLeft, Download
} from "lucide-react";

interface InfographicElement {
  id: string;
  type: "text" | "shape" | "icon";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fontSize?: number;
  shape?: "rectangle" | "circle" | "arrow";
}

interface InfographicEditorProps {
  language: "ar" | "en";
}

const colors = [
  "#8b5cf6", "#ec4899", "#f97316", "#22c55e", 
  "#3b82f6", "#ef4444", "#06b6d4", "#eab308",
  "#000000", "#ffffff"
];

const shapes = ["rectangle", "circle", "arrow"] as const;

export function InfographicEditor({ language }: InfographicEditorProps) {
  const [elements, setElements] = useState<InfographicElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState("#f8fafc");
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محرر إنفوجرافيك" : "Infographic Editor",
    addText: isRTL ? "إضافة نص" : "Add Text",
    addShape: isRTL ? "إضافة شكل" : "Add Shape",
    text: isRTL ? "النص" : "Text",
    color: isRTL ? "اللون" : "Color",
    delete: isRTL ? "حذف" : "Delete",
    export: isRTL ? "تصدير" : "Export",
    placeholder: isRTL ? "أدخل النص هنا..." : "Enter text here..."
  };

  const generateId = () => `elem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addText = () => {
    if (!text.trim()) return;
    
    const newElement: InfographicElement = {
      id: generateId(),
      type: "text",
      content: text,
      x: 50 + (elements.length * 20) % 200,
      y: 50 + (elements.length * 20) % 200,
      width: text.length * 12,
      height: 30,
      color: "#000000",
      fontSize: 16
    };
    
    setElements([...elements, newElement]);
    setText("");
    setSelectedId(newElement.id);
  };

  const addShape = (shape: "rectangle" | "circle" | "arrow") => {
    const newElement: InfographicElement = {
      id: generateId(),
      type: "shape",
      content: "",
      x: 50 + (elements.length * 30) % 300,
      y: 50 + (elements.length * 30) % 300,
      width: 100,
      height: shape === "arrow" ? 20 : 80,
      color: colors[elements.length % colors.length],
      shape
    };
    
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<InfographicElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedId(null);
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  // Drag state
  const [dragging, setDragging] = useState<{
    id: string;
    startX: number;
    startY: number;
    elemX: number;
    elemY: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    setDragging({
      id,
      startX: e.clientX,
      startY: e.clientY,
      elemX: element.x,
      elemY: element.y
    });
    setSelectedId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    
    updateElement(dragging.id, {
      x: Math.max(0, dragging.elemX + dx),
      y: Math.max(0, dragging.elemY + dy)
    });
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const renderElement = (element: InfographicElement) => {
    const isSelected = selectedId === element.id;
    
    const commonStyle: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      cursor: "move",
      border: isSelected ? "2px dashed #8b5cf6" : "none",
      padding: element.type === "text" ? "8px" : undefined
    };
    
    if (element.type === "text") {
      return (
        <div
          key={element.id}
          style={{
            ...commonStyle,
            fontSize: element.fontSize,
            color: element.color,
            fontWeight: "bold",
            whiteSpace: "nowrap"
          }}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
        >
          {element.content}
        </div>
      );
    }
    
    if (element.type === "shape") {
      if (element.shape === "circle") {
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              width: element.width,
              height: element.width,
              borderRadius: "50%",
              backgroundColor: element.color
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          />
        );
      }
      
      if (element.shape === "arrow") {
        return (
          <svg
            key={element.id}
            style={{ ...commonStyle, width: element.width * 2, height: element.height + 20 }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <defs>
              <marker
                id={`arrowhead-${element.id}`}
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill={element.color} />
              </marker>
            </defs>
            <line
              x1="0"
              y1="10"
              x2={element.width * 2 - 20}
              y2="10"
              stroke={element.color}
              strokeWidth="4"
              markerEnd={`url(#arrowhead-${element.id})`}
            />
          </svg>
        );
      }
      
      return (
        <div
          key={element.id}
          style={{
            ...commonStyle,
            width: element.width,
            height: element.height,
            backgroundColor: element.color,
            borderRadius: "8px"
          }}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
        />
      );
    }
    
    return null;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-500" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={labels.placeholder}
              className="w-48"
              onKeyDown={(e) => e.key === "Enter" && addText()}
            />
            <Button onClick={addText} size="sm">
              <Type className="w-4 h-4 mr-1" />
              {labels.addText}
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button onClick={() => addShape("rectangle")} size="sm" variant="outline">
              <Square className="w-4 h-4" />
            </Button>
            <Button onClick={() => addShape("circle")} size="sm" variant="outline">
              <Circle className="w-4 h-4" />
            </Button>
          </div>
          
          {selectedElement && (
            <Button 
              onClick={() => deleteElement(selectedId!)} 
              size="sm" 
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {labels.delete}
            </Button>
          )}
        </div>
        
        {/* Color picker for selected element */}
        {selectedElement && (
          <div className="flex items-center gap-2">
            <Label className="text-sm">{labels.color}:</Label>
            <div className="flex gap-1 flex-wrap">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateElement(selectedId!, { color })}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedElement.color === color ? "border-black" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Canvas */}
        <div
          className="relative rounded-xl overflow-hidden border-2 border-slate-200"
          style={{ 
            height: "400px",
            backgroundColor: bgColor
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {elements.map(renderElement)}
          
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Layout className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{isRTL ? "أضف عناصر للبدء" : "Add elements to start"}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Background color */}
        <div className="flex items-center gap-2">
          <Label className="text-sm">{isRTL ? "لون الخلفية" : "Background"}:</Label>
          <div className="flex gap-1">
            {["#f8fafc", "#ffffff", "#fef3c7", "#dcfce7", "#e0e7ff", "#1e293b"].map(color => (
              <button
                key={color}
                onClick={() => setBgColor(color)}
                className={`w-6 h-6 rounded border-2 ${
                  bgColor === color ? "border-purple-500" : "border-slate-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        
        {/* Element count */}
        <div className="text-sm text-slate-500 text-center">
          {elements.length} {isRTL ? "عنصر" : "elements"}
        </div>
      </CardContent>
    </Card>
  );
}
