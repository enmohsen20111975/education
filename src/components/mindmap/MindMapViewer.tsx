'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MindMap, MindMapNode } from '@/lib/mindmaps';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MindMapViewerProps {
  mindmap: MindMap;
  language: 'ar' | 'en';
}

interface NodePosition {
  x: number;
  y: number;
  node: MindMapNode;
  level: number;
}

export function MindMapViewer({ mindmap, language }: MindMapViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);

  const isArabic = language === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  // Calculate node positions in a radial/tree layout
  const calculateNodePositions = useCallback((rootNode: MindMapNode, centerX: number, centerY: number): NodePosition[] => {
    const positions: NodePosition[] = [];
    const levelRadius = 150;
    const nodeSize = 60;

    const processNode = (node: MindMapNode, x: number, y: number, level: number, angleStart: number, angleEnd: number) => {
      positions.push({ x, y, node, level });

      if (node.children && node.children.length > 0) {
        const childCount = node.children.length;
        const angleRange = angleEnd - angleStart;
        const angleStep = angleRange / Math.max(childCount, 1);
        const radius = levelRadius * (level + 1);

        node.children.forEach((child, index) => {
          const angle = angleStart + angleStep * (index + 0.5);
          const childX = x + radius * Math.cos(angle);
          const childY = y + radius * Math.sin(angle);
          const childAngleRange = angleStep * 0.8;
          processNode(child, childX, childY, level + 1, angle - childAngleRange / 2, angle + childAngleRange / 2);
        });
      }
    };

    // Start from center with full circle
    processNode(rootNode, centerX, centerY, 0, -Math.PI / 2, Math.PI * 1.5);

    return positions;
  }, []);

  // Draw the mind map
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
    ctx.scale(scale, scale);

    const centerX = 0;
    const centerY = 0;
    const positions = calculateNodePositions(mindmap.rootNode, centerX, centerY);
    setNodePositions(positions);

    // Draw connections first
    positions.forEach(pos => {
      if (pos.node.children) {
        pos.node.children.forEach(child => {
          const childPos = positions.find(p => p.node.id === child.id);
          if (childPos) {
            ctx.beginPath();
            ctx.strokeStyle = pos.node.color || '#94a3b8';
            ctx.lineWidth = 2;
            ctx.moveTo(pos.x, pos.y);
            
            // Curved line
            const midX = (pos.x + childPos.x) / 2;
            const midY = (pos.y + childPos.y) / 2 - 20;
            ctx.quadraticCurveTo(midX, midY, childPos.x, childPos.y);
            ctx.stroke();
          }
        });
      }
    });

    // Draw nodes
    positions.forEach(pos => {
      const node = pos.node;
      const nodeWidth = Math.max(80, (isArabic ? node.textAr : node.textEn).length * 8 + 20);
      const nodeHeight = 40 + pos.level * 5;
      const radius = 8;

      // Node shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Node background
      ctx.beginPath();
      ctx.roundRect(pos.x - nodeWidth / 2, pos.y - nodeHeight / 2, nodeWidth, nodeHeight, radius);
      ctx.fillStyle = node.color || (pos.level === 0 ? '#3b82f6' : '#ffffff');
      ctx.fill();
      ctx.strokeStyle = selectedNode?.id === node.id ? '#1d4ed8' : '#e2e8f0';
      ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1;
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Node text
      const text = isArabic ? node.textAr : node.textEn;
      ctx.font = `${pos.level === 0 ? 'bold ' : ''}${Math.max(12, 14 - pos.level)}px 'Segoe UI', Tahoma, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = pos.level === 0 || (node.color && !node.color.startsWith('#f')) ? '#ffffff' : '#1e293b';
      ctx.fillText(text, pos.x, pos.y);
    });

    ctx.restore();
  }, [mindmap, scale, offset, selectedNode, isArabic, calculateNodePositions]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2 - offset.x) / scale;
    const y = (e.clientY - rect.top - canvas.height / 2 - offset.y) / scale;

    // Find clicked node
    const clickedNode = nodePositions.find(pos => {
      const nodeWidth = Math.max(80, (isArabic ? pos.node.textAr : pos.node.textEn).length * 8 + 20);
      const nodeHeight = 40 + pos.level * 5;
      return (
        x >= pos.x - nodeWidth / 2 &&
        x <= pos.x + nodeWidth / 2 &&
        y >= pos.y - nodeHeight / 2 &&
        y <= pos.y + nodeHeight / 2
      );
    });

    setSelectedNode(clickedNode?.node || null);
  };

  // Zoom handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.3));
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] bg-slate-50 rounded-lg overflow-hidden" dir={dir}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} title={isArabic ? 'تكبير' : 'Zoom In'}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} title={isArabic ? 'تصغير' : 'Zoom Out'}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} title={isArabic ? 'إعادة ضبط' : 'Reset'}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10 text-xs text-muted-foreground bg-white/80 px-3 py-1.5 rounded-full flex items-center gap-1">
        <Move className="h-3 w-3" />
        {isArabic ? 'اسحب للتحريك • انقر للتحديد' : 'Drag to pan • Click to select'}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-xs border">
          <h4 className="font-bold text-sm mb-1" style={{ color: selectedNode.color || '#3b82f6' }}>
            {isArabic ? selectedNode.textAr : selectedNode.textEn}
          </h4>
          {selectedNode.children && selectedNode.children.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">
                {isArabic ? 'الفروع:' : 'Branches:'}
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedNode.children.map((child, i) => (
                  <span key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                    {isArabic ? child.textAr : child.textEn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MindMapViewer;
