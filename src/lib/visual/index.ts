/**
 * @module visual
 * @description نقطة التصدير المركزية لطبقة المحتوى البصري.
 * يُصدَّر كل شيء من ملف واحد لتسهيل الاستيراد.
 *
 * Central export point for the visual content layer.
 * Everything is exported from one file for convenient importing.
 */

// ============================================================
// مُولِّد الخريطة الذهنية / Mind Map Generator
// ============================================================

export {
  generateMindMap,
} from "./mindmap-generator";

export type {
  MindMapNode,
  MindMapEdge,
  MindMapData,
} from "./mindmap-generator";

// ============================================================
// مُولِّد الإنفوجرافيك / Infographic Generator
// ============================================================

export {
  generateInfographic,
} from "./infographic-generator";

export type {
  InfographicSection,
  InfographicData,
} from "./infographic-generator";

// ============================================================
// مُولِّد الرسوم البيانية / Chart Generator
// ============================================================

export {
  generateChart,
} from "./chart-generator";

export type {
  ChartData,
  ChartDataset,
} from "./chart-generator";

// ============================================================
// مُولِّد البطاقات / Card Generator
// ============================================================

export {
  generateCards,
} from "./card-generator";

export type {
  AnimatedCard,
  CardFront,
  CardBack,
} from "./card-generator";

// ============================================================
// مُولِّد الخريطة المنطقية / Logic Map Generator
// ============================================================

export {
  generateLogicMap,
} from "./logic-map-generator";

export type {
  LogicMapNode,
  LogicMapConnection,
  LogicMapData,
} from "./logic-map-generator";

// ============================================================
// الخدمة الرئيسية / Master Visual Service
// ============================================================

export {
  generateAllVisuals,
} from "./visual-service";

export type {
  VisualType,
  GenerateAllOptions,
  GenerateAllResult,
} from "./visual-service";