"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Network, Plus, Trash2, ZoomIn, ZoomOut, 
  Move, Download, Share2
} from "lucide-react";

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  children: string[];
  parentId: string | null;
}

interface MindMapProps {
  language: "ar" | "en";
  initialTopic?: string;
}

const colors = [
  "#8b5cf6", "#ec4899", "#f97316", "#22c55e", 
  "#3b82f6", "#ef4444", "#06b6d4", "#eab308"
];

export function MindMapEditor({ language, initialTopic }: MindMapProps) {
  const [nodes, setNodes] = useState<Record<string, MindMapNode>>({
    "root": {
      id: "root",
      text: initialTopic || (language === "ar" ? "الموضوع الرئيسي" : "Main Topic"),
      x: 400,
      y: 300,
      color: "#8b5cf6",
      children: [],
      parentId: null
    }
  });
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "خريطة ذهنية تفاعلية" : "Interactive Mind Map",
    addNode: isRTL ? "إضافة فرع" : "Add Branch",
    deleteNode: isRTL ? "حذف" : "Delete",
    editNode: isRTL ? "تعديل" : "Edit",
    zoomIn: isRTL ? "تكبير" : "Zoom In",
    zoomOut: isRTL ? "تصغير" : "Zoom Out",
    reset: isRTL ? "إعادة تعيين" : "Reset",
    export: isRTL ? "تصدير" : "Export",
    placeholder: isRTL ? "أدخل النص..." : "Enter text..."
  };

  const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addNode = useCallback((parentId: string) => {
    const parent = nodes[parentId];
    if (!parent) return;
    
    // Calculate position for new node
    const childCount = parent.children.length;
    const angle = (childCount * 45) - 90; // Spread nodes in a fan pattern
    const distance = 150;
    
    const newX = parent.x + Math.cos(angle * Math.PI / 180) * distance;
    const newY = parent.y + Math.sin(angle * Math.PI / 180) * distance;
    
    const newNodeId = generateId();
    const newNode: MindMapNode = {
      id: newNodeId,
      text: isRTL ? "فكرة جديدة" : "New Idea",
      x: newX,
      y: newY,
      color: colors[(Object.keys(nodes).length) % colors.length],
      children: [],
      parentId
    };
    
    setNodes(prev => ({
      ...prev,
      [parentId]: {
        ...prev[parentId],
        children: [...prev[parentId].children, newNodeId]
      },
      [newNodeId]: newNode
    }));
  }, [nodes, isRTL]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === "root") return; // Can't delete root
    
    const node = nodes[nodeId];
    if (!node || !node.parentId) return;
    
    // Remove from parent's children
    setNodes(prev => {
      const newNodes = { ...prev };
      
      // Remove node and all its descendants
      const removeRecursive = (id: string) => {
        const n = newNodes[id];
        if (n) {
          n.children.forEach(childId => removeRecursive(childId));
          delete newNodes[id];
        }
      };
      
      removeRecursive(nodeId);
      
      // Update parent
      if (newNodes[node.parentId!]) {
        newNodes[node.parentId!] = {
          ...newNodes[node.parentId!],
          children: newNodes[node.parentId!].children.filter(c => c !== nodeId)
        };
      }
      
      return newNodes;
    });
    
    setSelectedNode(null);
  }, [nodes]);

  const updateNodeText = useCallback((nodeId: string, text: string) => {
    setNodes(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], text }
    }));
  }, []);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setEditText(nodes[nodeId].text);
    setIsEditing(true);
  };

  const handleTextSubmit = () => {
    if (selectedNode && editText.trim()) {
      updateNodeText(selectedNode, editText.trim());
    }
    setIsEditing(false);
  };

  // Render connections
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    Object.values(nodes).forEach(node => {
      if (node.parentId && nodes[node.parentId]) {
        const parent = nodes[node.parentId];
        connections.push(
          <line
            key={`${node.parentId}-${node.id}`}
            x1={parent.x}
            y1={parent.y}
            x2={node.x}
            y2={node.y}
            stroke={node.color}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
        );
      }
    });
    
    return connections;
  };

  // Render nodes
  const renderNodes = () => {
    return Object.values(nodes).map(node => {
      const isSelected = selectedNode === node.id;
      const isRoot = node.id === "root";
      
      return (
        <g
          key={node.id}
          transform={`translate(${node.x}, ${node.y})`}
          onClick={() => handleNodeClick(node.id)}
          style={{ cursor: "pointer" }}
        >
          {/* Node background */}
          <ellipse
            rx={Math.max(60, node.text.length * 8)}
            ry="25"
            fill={node.color}
            stroke={isSelected ? "#000" : "transparent"}
            strokeWidth={isSelected ? 3 : 0}
          />
          
          {/* Node text */}
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={isRoot ? 16 : 14}
            fontWeight="bold"
          >
            {node.text.length > 20 ? node.text.slice(0, 18) + "..." : node.text}
          </text>
          
          {/* Add button */}
          {isSelected && !isEditing && (
            <g transform="translate(40, -35)">
              <circle
                r="12"
                fill="white"
                stroke={node.color}
                strokeWidth="2"
                onClick={(e) => {
                  e.stopPropagation();
                  addNode(node.id);
                }}
                style={{ cursor: "pointer" }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill={node.color}
                fontSize="16"
                fontWeight="bold"
              >
                +
              </text>
            </g>
          )}
          
          {/* Delete button */}
          {isSelected && node.id !== "root" && !isEditing && (
            <g transform="translate(-40, -35)">
              <circle
                r="12"
                fill="white"
                stroke="#ef4444"
                strokeWidth="2"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                style={{ cursor: "pointer" }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ef4444"
                fontSize="14"
              >
                ×
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-500" />
            {labels.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Edit input */}
        {isEditing && selectedNode && (
          <div className="flex gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTextSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              placeholder={labels.placeholder}
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleTextSubmit}>
              {isRTL ? "حفظ" : "Save"}
            </Button>
          </div>
        )}
        
        {/* Mind Map Canvas */}
        <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden" style={{ height: "500px" }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center"
            }}
          >
            {/* Grid pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Connections */}
            {renderConnections()}
            
            {/* Nodes */}
            {renderNodes()}
          </svg>
        </div>
        
        {/* Instructions */}
        <div className="flex flex-wrap gap-2 text-sm text-slate-500">
          <Badge variant="outline">
            {isRTL ? "انقر على العقدة لتحديدها" : "Click node to select"}
          </Badge>
          <Badge variant="outline">
            {isRTL ? "انقر + لإضافة فرع" : "Click + to add branch"}
          </Badge>
          <Badge variant="outline">
            {isRTL ? "انقر × للحذف" : "Click × to delete"}
          </Badge>
        </div>
        
        {/* Add root branch button */}
        {selectedNode === "root" && !isEditing && (
          <Button onClick={() => addNode("root")} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            {labels.addNode}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
