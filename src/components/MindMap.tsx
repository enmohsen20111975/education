"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// أنواع البيانات للخريطة الذهنية
interface MindMapNode {
  id: string;
  text: string;
  textAr: string;
  x: number;
  y: number;
  color: string;
  children?: MindMapNode[];
}

interface MindMapProps {
  data: MindMapNode;
  language: "ar" | "en";
  onNodeClick?: (node: MindMapNode) => void;
}

// ألوان متناسقة للفروع
const BRANCH_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#06b6d4", // cyan
];

// حساب مواضع الفروع حول العقدة الرئيسية
function calculateBranchPositions(
  centerX: number,
  centerY: number,
  branchCount: number,
  radius: number
): { x: number; y: number; angle: number }[] {
  const positions: { x: number; y: number; angle: number }[] = [];
  const angleStep = (2 * Math.PI) / branchCount;

  for (let i = 0; i < branchCount; i++) {
    const angle = angleStep * i - Math.PI / 2; // البدء من الأعلى
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle,
    });
  }

  return positions;
}

// حساب مواضع الأطفال حول الفرع
function calculateChildPositions(
  parentX: number,
  parentY: number,
  parentAngle: number,
  childCount: number,
  radius: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const spreadAngle = Math.PI / 3; // زاوية الانتشار
  const angleStart = parentAngle - spreadAngle / 2;
  const angleStep = childCount > 1 ? spreadAngle / (childCount - 1) : 0;

  for (let i = 0; i < childCount; i++) {
    const angle = childCount === 1 ? parentAngle : angleStart + angleStep * i;
    positions.push({
      x: parentX + radius * Math.cos(angle),
      y: parentY + radius * Math.sin(angle),
    });
  }

  return positions;
}

// مكون العقدة الواحدة
interface NodeProps {
  node: MindMapNode;
  x: number;
  y: number;
  language: "ar" | "en";
  isRoot?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onClick?: () => void;
}

function MindMapNodeComponent({
  node,
  x,
  y,
  language,
  isRoot = false,
  isExpanded,
  onToggle,
  onClick,
}: NodeProps) {
  const text = language === "ar" ? node.textAr : node.text;
  const hasChildren = node.children && node.children.length > 0;

  // حساب حجم العقدة بناءً على النص
  const nodeWidth = isRoot ? 140 : Math.max(100, text.length * 12 + 40);
  const nodeHeight = isRoot ? 60 : 45;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        if (hasChildren) {
          onToggle();
        }
        onClick?.();
      }}
    >
      {/* ظل العقدة */}
      <motion.rect
        x={x - nodeWidth / 2 + 3}
        y={y - nodeHeight / 2 + 3}
        width={nodeWidth}
        height={nodeHeight}
        rx={isRoot ? 20 : 12}
        ry={isRoot ? 20 : 12}
        fill="rgba(0,0,0,0.1)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      />

      {/* العقدة الرئيسية */}
      <motion.rect
        x={x - nodeWidth / 2}
        y={y - nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        rx={isRoot ? 20 : 12}
        ry={isRoot ? 20 : 12}
        fill={isRoot ? node.color : `${node.color}dd`}
        stroke={isRoot ? node.color : `${node.color}88`}
        strokeWidth={isRoot ? 3 : 2}
        whileHover={{
          scale: 1.05,
          filter: "brightness(1.1)",
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          filter: isRoot ? "drop-shadow(0 4px 6px rgba(0,0,0,0.2))" : "none",
        }}
      />

      {/* النص */}
      <motion.text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={isRoot ? 16 : 13}
        fontWeight={isRoot ? "bold" : "600"}
        style={{
          fontFamily: language === "ar" ? "inherit" : "inherit",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {text}
      </motion.text>

      {/* مؤشر التوسع */}
      {hasChildren && (
        <motion.g
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: `${x}px ${y + nodeHeight / 2 + 8}px` }}
        >
          <circle
            cx={x}
            cy={y + nodeHeight / 2 + 8}
            r={8}
            fill="white"
            stroke={node.color}
            strokeWidth={2}
          />
          <text
            x={x}
            y={y + nodeHeight / 2 + 9}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={node.color}
            fontSize={10}
            fontWeight="bold"
          >
            {isExpanded ? "−" : "+"}
          </text>
        </motion.g>
      )}
    </motion.g>
  );
}

// مكون الخط المنحني بين العقد
interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay?: number;
}

function ConnectionLine({ x1, y1, x2, y2, color, delay = 0 }: ConnectionLineProps) {
  // حساب نقطة التحكم للمنحنى
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;

  // إنشاء منحنى ناعم
  const controlX1 = x1 + dx * 0.25;
  const controlY1 = y1 + dy * 0.1;
  const controlX2 = x2 - dx * 0.25;
  const controlY2 = y2 - dy * 0.1;

  const path = `M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`;

  return (
    <motion.path
      d={path}
      stroke={color}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.7 }}
      transition={{
        pathLength: { duration: 0.8, delay, ease: "easeOut" },
        opacity: { duration: 0.3, delay },
      }}
      style={{
        filter: `drop-shadow(0 2px 4px ${color}33)`,
      }}
    />
  );
}

// المكون الرئيسي للخريطة الذهنية
export default function MindMap({ data, language, onNodeClick }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // حالة التكبير والتحريك
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // حالة توسع الفروع
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // أبعاد SVG
  const width = 800;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;

  // تبديل توسع العقدة
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // معالجة التكبير بالعجلة
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.3), 3));
  }, []);

  // معالجة بدء السحب
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);

  // معالجة السحب
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  // معالجة نهاية السحب
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // إعادة ضبط العرض
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setExpandedNodes(new Set());
  }, []);

  // توسيع الكل
  const handleExpandAll = useCallback(() => {
    const allNodeIds = new Set<string>();
    const collectIds = (node: MindMapNode) => {
      if (node.children && node.children.length > 0) {
        allNodeIds.add(node.id);
        node.children.forEach(collectIds);
      }
    };
    collectIds(data);
    setExpandedNodes(allNodeIds);
  }, [data]);

  // حساب مواضع الفروع
  const children = data.children || [];
  const branchPositions = calculateBranchPositions(centerX, centerY, children.length, 180);

  // تقديم العقد الفرعية
  const renderBranches = () => {
    return children.map((child, index) => {
      const pos = branchPositions[index];
      const isExpanded = expandedNodes.has(child.id);
      const childNodes = child.children || [];
      const childPositions = isExpanded
        ? calculateChildPositions(pos.x, pos.y, pos.angle, childNodes.length, 120)
        : [];

      return (
        <g key={child.id}>
          {/* الخط من المركز إلى الفرع */}
          <ConnectionLine
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            color={child.color}
            delay={index * 0.1}
          />

          {/* العقدة الفرعية */}
          <MindMapNodeComponent
            node={child}
            x={pos.x}
            y={pos.y}
            language={language}
            isExpanded={isExpanded}
            onToggle={() => toggleNode(child.id)}
            onClick={() => onNodeClick?.(child)}
          />

          {/* العقد الأبناء */}
          <AnimatePresence>
            {isExpanded &&
              childNodes.map((grandChild, gcIndex) => {
                const gcPos = childPositions[gcIndex];
                return (
                  <g key={grandChild.id}>
                    <ConnectionLine
                      x1={pos.x}
                      y1={pos.y}
                      x2={gcPos.x}
                      y2={gcPos.y}
                      color={grandChild.color}
                      delay={gcIndex * 0.05}
                    />
                    <MindMapNodeComponent
                      node={grandChild}
                      x={gcPos.x}
                      y={gcPos.y}
                      language={language}
                      isExpanded={expandedNodes.has(grandChild.id)}
                      onToggle={() => toggleNode(grandChild.id)}
                      onClick={() => onNodeClick?.(grandChild)}
                    />
                  </g>
                );
              })}
          </AnimatePresence>
        </g>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* شريط الأدوات */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {language === "ar" ? "إعادة ضبط" : "Reset"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExpandAll}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-md text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          {language === "ar" ? "توسيع الكل" : "Expand All"}
        </motion.button>
      </div>

      {/* مؤشر التكبير */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-md text-sm text-slate-600 dark:text-slate-300">
        {Math.round(scale * 100)}%
      </div>

      {/* أزرار التكبير */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setScale((s) => Math.min(s * 1.2, 3))}
          className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-md flex items-center justify-center text-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          +
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setScale((s) => Math.max(s * 0.8, 0.3))}
          className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-md flex items-center justify-center text-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          −
        </motion.button>
      </div>

      {/* تعليمات */}
      <div className="absolute top-4 right-4 z-10 px-3 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-md text-xs text-slate-500 dark:text-slate-400">
        {language === "ar" ? "اسحب للتحريك • العجلة للتكبير • انقر لل توسيع" : "Drag to pan • Scroll to zoom • Click to expand"}
      </div>

      {/* SVG الرئيسي */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* خلفية شبكية */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-slate-200 dark:text-slate-700"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* الفروع */}
        {renderBranches()}

        {/* العقدة الرئيسية */}
        <MindMapNodeComponent
          node={data}
          x={centerX}
          y={centerY}
          language={language}
          isRoot
          isExpanded={true}
          onToggle={() => {}}
        />
      </svg>
    </div>
  );
}

// بيانات الخرائط الذهنية الجاهزة
export const MIND_MAPS = {
  motion: {
    id: "motion-root",
    text: "Motion",
    textAr: "الحركة",
    x: 0,
    y: 0,
    color: "#10b981",
    children: [
      {
        id: "velocity",
        text: "Velocity",
        textAr: "السرعة",
        x: 0,
        y: 0,
        color: "#3b82f6",
        children: [
          { id: "speed", text: "Speed", textAr: "السرعة القياسية", x: 0, y: 0, color: "#60a5fa" },
          { id: "direction", text: "Direction", textAr: "الاتجاه", x: 0, y: 0, color: "#93c5fd" },
          { id: "units", text: "Units (m/s)", textAr: "الوحدات (م/ث)", x: 0, y: 0, color: "#bfdbfe" },
        ],
      },
      {
        id: "acceleration",
        text: "Acceleration",
        textAr: "التسارع",
        x: 0,
        y: 0,
        color: "#8b5cf6",
        children: [
          { id: "positive", text: "Positive", textAr: "موجب", x: 0, y: 0, color: "#a78bfa" },
          { id: "negative", text: "Negative", textAr: "سالب", x: 0, y: 0, color: "#c4b5fd" },
          { id: "formula", text: "a = Δv/Δt", textAr: "ت = Δسرعة/Δزمن", x: 0, y: 0, color: "#ddd6fe" },
        ],
      },
      {
        id: "displacement",
        text: "Displacement",
        textAr: "الإزاحة",
        x: 0,
        y: 0,
        color: "#f59e0b",
        children: [
          { id: "vector", text: "Vector", textAr: "كمية متجهة", x: 0, y: 0, color: "#fbbf24" },
          { id: "distance-diff", text: "vs Distance", textAr: "ضد المسافة", x: 0, y: 0, color: "#fcd34d" },
        ],
      },
      {
        id: "distance",
        text: "Distance",
        textAr: "المسافة",
        x: 0,
        y: 0,
        color: "#f43f5e",
        children: [
          { id: "scalar", text: "Scalar", textAr: "كمية قياسية", x: 0, y: 0, color: "#fb7185" },
          { id: "path", text: "Path Length", textAr: "طول المسار", x: 0, y: 0, color: "#fda4af" },
        ],
      },
      {
        id: "equations",
        text: "Equations",
        textAr: "المعادلات",
        x: 0,
        y: 0,
        color: "#06b6d4",
        children: [
          { id: "eq1", text: "v = v₀ + at", textAr: "ع = ع₀ + ت×ز", x: 0, y: 0, color: "#22d3ee" },
          { id: "eq2", text: "s = v₀t + ½at²", textAr: "ف = ع₀×ز + ½ت×ز²", x: 0, y: 0, color: "#67e8f9" },
          { id: "eq3", text: "v² = v₀² + 2as", textAr: "ع² = ع₀² + 2×ت×ف", x: 0, y: 0, color: "#a5f3fc" },
        ],
      },
    ],
  },
  energy: {
    id: "energy-root",
    text: "Energy",
    textAr: "الطاقة",
    x: 0,
    y: 0,
    color: "#8b5cf6",
    children: [
      {
        id: "kinetic",
        text: "Kinetic Energy",
        textAr: "الطاقة الحركية",
        x: 0,
        y: 0,
        color: "#3b82f6",
        children: [
          { id: "ke-formula", text: "KE = ½mv²", textAr: "طح = ½ك×سرعة²", x: 0, y: 0, color: "#60a5fa" },
          { id: "mass-vel", text: "Mass & Velocity", textAr: "الكتلة والسرعة", x: 0, y: 0, color: "#93c5fd" },
        ],
      },
      {
        id: "potential",
        text: "Potential Energy",
        textAr: "الطاقة الكامنة",
        x: 0,
        y: 0,
        color: "#10b981",
        children: [
          { id: "gravitational", text: "Gravitational", textAr: "الجاذبية", x: 0, y: 0, color: "#34d399" },
          { id: "elastic", text: "Elastic", textAr: "المرنة", x: 0, y: 0, color: "#6ee7b7" },
          { id: "pe-formula", text: "PE = mgh", textAr: "طك = ك×ج×ف", x: 0, y: 0, color: "#a7f3d0" },
        ],
      },
      {
        id: "conservation",
        text: "Conservation",
        textAr: "حفظ الطاقة",
        x: 0,
        y: 0,
        color: "#f59e0b",
        children: [
          { id: "total-energy", text: "Total Energy", textAr: "الطاقة الكلية", x: 0, y: 0, color: "#fbbf24" },
          { id: "transform", text: "Transformation", textAr: "التحول", x: 0, y: 0, color: "#fcd34d" },
        ],
      },
      {
        id: "work",
        text: "Work",
        textAr: "الشغل",
        x: 0,
        y: 0,
        color: "#f43f5e",
        children: [
          { id: "work-formula", text: "W = F × d", textAr: "ش = ق × ف", x: 0, y: 0, color: "#fb7185" },
          { id: "power", text: "Power", textAr: "القدرة", x: 0, y: 0, color: "#fda4af" },
        ],
      },
    ],
  },
  atom: {
    id: "atom-root",
    text: "Atom",
    textAr: "الذرة",
    x: 0,
    y: 0,
    color: "#06b6d4",
    children: [
      {
        id: "proton",
        text: "Proton",
        textAr: "البروتون",
        x: 0,
        y: 0,
        color: "#f43f5e",
        children: [
          { id: "positive-charge", text: "Positive (+)", textAr: "موجب (+)", x: 0, y: 0, color: "#fb7185" },
          { id: "in-nucleus", text: "In Nucleus", textAr: "في النواة", x: 0, y: 0, color: "#fda4af" },
          { id: "mass-1", text: "Mass ≈ 1 amu", textAr: "كتلة ≈ 1 و.ك.ذ", x: 0, y: 0, color: "#fecdd3" },
        ],
      },
      {
        id: "neutron",
        text: "Neutron",
        textAr: "النيوترون",
        x: 0,
        y: 0,
        color: "#8b5cf6",
        children: [
          { id: "neutral", text: "Neutral (0)", textAr: "متعادل (0)", x: 0, y: 0, color: "#a78bfa" },
          { id: "in-nucleus-2", text: "In Nucleus", textAr: "في النواة", x: 0, y: 0, color: "#c4b5fd" },
          { id: "mass-2", text: "Mass ≈ 1 amu", textAr: "كتلة ≈ 1 و.ك.ذ", x: 0, y: 0, color: "#ddd6fe" },
        ],
      },
      {
        id: "electron",
        text: "Electron",
        textAr: "الإلكترون",
        x: 0,
        y: 0,
        color: "#3b82f6",
        children: [
          { id: "negative", text: "Negative (-)", textAr: "سالب (-)", x: 0, y: 0, color: "#60a5fa" },
          { id: "orbits", text: "In Orbits", textAr: "في المدارات", x: 0, y: 0, color: "#93c5fd" },
          { id: "mass-3", text: "Mass ≈ 0", textAr: "كتلة ≈ 0", x: 0, y: 0, color: "#bfdbfe" },
        ],
      },
      {
        id: "nucleus",
        text: "Nucleus",
        textAr: "النواة",
        x: 0,
        y: 0,
        color: "#10b981",
        children: [
          { id: "protons-neutrons", text: "p⁺ + n⁰", textAr: "بروتونات + نيوترونات", x: 0, y: 0, color: "#34d399" },
          { id: "mass-number", text: "Mass Number (A)", textAr: "عدد الكتلة (A)", x: 0, y: 0, color: "#6ee7b7" },
        ],
      },
      {
        id: "atomic-number",
        text: "Atomic Number (Z)",
        textAr: "العدد الذري (Z)",
        x: 0,
        y: 0,
        color: "#f59e0b",
        children: [
          { id: "proton-count", text: "Number of p⁺", textAr: "عدد البروتونات", x: 0, y: 0, color: "#fbbf24" },
          { id: "identity", text: "Element Identity", textAr: "هوية العنصر", x: 0, y: 0, color: "#fcd34d" },
        ],
      },
    ],
  },
};

// نوع بيانات الخرائط المتاحة
export type MindMapType = keyof typeof MIND_MAPS;
