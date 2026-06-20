/**
 * @module visual/mindmap-generator
 * @description مُولِّد الخرائط الذهنية التفاعلية.
 * يستخرج الذكاء الاصطناعي المفاهيم والعلاقات، ثم تُحسَب المواقع خوارزميًا.
 *
 * Interactive mind map generator.
 * AI extracts concepts and relationships; positions are computed algorithmically.
 */

import { generateContent, TaskType } from "@/lib/ai";
import { db } from "@/lib/db";

// ============================================================
// الأنواع / Types
// ============================================================

/** عُقدة في الخريطة الذهنية */
export interface MindMapNode {
  /** معرّف فريد للعقدة */
  id: string;
  /** النص بالإنجليزية */
  label: string;
  /** النص بالعربية */
  labelAr: string;
  /** الموضع الأفقي */
  x: number;
  /** الموضع العمودي */
  y: number;
  /** لون العقدة */
  color: string;
  /** نوع العقدة: مركزية / فرعية / ورقية */
  type: "central" | "branch" | "leaf";
  /** معرّف العقدة الأم (للعُقد الفرعية والورقية) */
  parentId?: string;
  /** أيقونة اختيارية */
  icon?: string;
}

/** حافة تربط بين عُقدتين */
export interface MindMapEdge {
  /** معرّف العقدة المصدر */
  from: string;
  /** معرّف العقدة الهدف */
  to: string;
  /** نص اختياري على الحافة */
  label?: string;
}

/** بيانات الخريطة الذهنية الكاملة */
export interface MindMapData {
  /** قائمة العُقد */
  nodes: MindMapNode[];
  /** قائمة الحواف */
  edges: MindMapEdge[];
  /** نوع التخطيط */
  layout: "radial" | "tree" | "organic";
}

/** خيارات توليد الخريطة الذهنية */
export interface MindMapOptions {
  /** اللغة المفضلة */
  language?: "ar" | "en";
  /** نمط التخطيط */
  style?: "radial" | "tree";
}

// ============================================================
// ثوابت / Constants
// ============================================================

/** ألوان حسب عمق المفهوم — من الأغمق (المركز) إلى الأفتح (الأوراق) */
const DEPTH_COLORS = [
  "#6366f1", // عمق 0 — مركزي (بنفسجي)
  "#8b5cf6", // عمق 1 — فروع رئيسية
  "#a78bfa", // عمق 2 — فروع فرعية
  "#c4b5fd", // عمق 3 — أوراق
  "#ddd6fe", // عمق 4 — أوراق ثانوية
];

/** نصف قطر الفروع الرئيسية في التخطيط الشعاعي */
const RADIAL_BRANCH_RADIUS = 220;
/** نصف قطر الأوراق في التخطيط الشعاعي */
const RADIAL_LEAF_RADIUS = 400;
/** المسافة العمودية بين المستويات في التخطيط الشجري */
const TREE_LEVEL_HEIGHT = 140;
/** المسافة الأفقية بين العُقد الشقيقة */
const TREE_SIBLING_GAP = 200;

/** أيقونات مقترَحة حسب نوع المفهوم */
const CONCEPT_ICONS = [
  "💡", "🔬", "📐", "📊", "🧪", "⚙️", "📚", "🎯",
  "🔑", "🌟", "📈", "🧩", "📝", "🏆", "🔬", "🌍",
];

// ============================================================
// أنواع داخلية / Internal Types
// ============================================================

/** مفهوم مُستخرَج من الذكاء الاصطناعي (قبل حساب المواقع) */
interface ExtractedConcept {
  id: string;
  label: string;
  labelAr: string;
  depth: number;
  parentId?: string;
  icon?: string;
}

/** استجابة JSON من الذكاء الاصطناعي */
interface AIConceptResponse {
  centralTopic: { en: string; ar: string };
  branches: Array<{
    id: string;
    label: string;
    labelAr: string;
    icon?: string;
    leaves?: Array<{
      id: string;
      label: string;
      labelAr: string;
      icon?: string;
    }>;
  }>;
}

// ============================================================
// الدوال المساعدة / Helper Functions
// ============================================================

/**
 * توليد معرّف فريد قصير
 * Generates a short unique identifier
 */
function uid(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * الحصول على لون حسب العمق
 * Gets color based on depth level
 */
function getColorForDepth(depth: number): string {
  return DEPTH_COLORS[Math.min(depth, DEPTH_COLORS.length - 1)];
}

/**
 * الحصول على أيقونة عشوائية
 * Gets a random icon
 */
function randomIcon(): string {
  return CONCEPT_ICONS[Math.floor(Math.random() * CONCEPT_ICONS.length)];
}

/**
 * استخراج بيانات الدرس من قاعدة البيانات
 * Fetches lesson content from the database
 */
async function fetchLessonContent(lessonId: string): Promise<{
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  introductionAr: string;
  introductionEn: string;
  concepts: Array<{ termAr: string; termEn: string; definitionAr: string; definitionEn: string }>;
  formulas: Array<{ formula: string; explanationAr: string; explanationEn: string }>;
  objectives: Array<{ textAr: string; textEn: string }>;
} | null> {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: {
      titleAr: true,
      titleEn: true,
      summaryAr: true,
      summaryEn: true,
      introductionAr: true,
      introductionEn: true,
      Concept: { orderBy: { order: "asc" } },
      Formula: { orderBy: { order: "asc" } },
      Objective: { orderBy: { order: "asc" } },
    },
  });

  if (!lesson) return null;

  return {
    titleAr: lesson.titleAr,
    titleEn: lesson.titleEn,
    summaryAr: lesson.summaryAr,
    summaryEn: lesson.summaryEn,
    introductionAr: lesson.introductionAr,
    introductionEn: lesson.introductionEn,
    concepts: lesson.Concept.map((c) => ({
      termAr: c.termAr,
      termEn: c.termEn,
      definitionAr: c.definitionAr,
      definitionEn: c.definitionEn,
    })),
    formulas: lesson.Formula.map((f) => ({
      formula: f.formula,
      explanationAr: f.explanationAr,
      explanationEn: f.explanationEn,
    })),
    objectives: lesson.Objective.map((o) => ({
      textAr: o.textAr,
      textEn: o.textEn,
    })),
  };
}

// ============================================================
// استخراج المفاهيم بالذكاء الاصطناعي / AI Concept Extraction
// ============================================================

/**
 * استخراج المفاهيم والعلاقات من محتوى الدرس باستخدام الذكاء الاصطناعي
 * Extracts concepts and relationships from lesson content using AI
 */
async function extractConceptsWithAI(
  content: Awaited<ReturnType<typeof fetchLessonContent>>,
  language: "ar" | "en"
): Promise<ExtractedConcept[]> {
  const langInstruction =
    language === "ar"
      ? "أجب بالعربية والإنجليزية لكل مفهوم."
      : "Answer in both English and Arabic for each concept.";

  const conceptList = content.concepts
    .map((c, i) => `${i + 1}. ${c.termEn} / ${c.termAr}: ${c.definitionEn}`)
    .join("\n");

  const formulaList = content.formulas
    .map((f, i) => `${i + 1}. ${f.formula} — ${f.explanationEn}`)
    .join("\n");

  const objectiveList = content.objectives
    .map((o, i) => `${i + 1}. ${o.textEn}`)
    .join("\n");

  const prompt = `${langInstruction}

Lesson: ${content.titleEn} / ${content.titleAr}
Summary: ${content.summaryEn}

Key Concepts:
${conceptList || "No concepts available."}

Formulas:
${formulaList || "No formulas available."}

Learning Objectives:
${objectiveList || "No objectives available."}

Extract the mind map structure for this lesson. Return ONLY valid JSON with this exact format:
{
  "centralTopic": { "en": "Main Topic", "ar": "الموضوع الرئيسي" },
  "branches": [
    {
      "id": "b1",
      "label": "Branch Name",
      "labelAr": "اسم الفرع",
      "icon": "💡",
      "leaves": [
        { "id": "b1_l1", "label": "Leaf Name", "labelAr": "اسم الورقة", "icon": "🔬" }
      ]
    }
  ]
}

Rules:
- Create 3-7 main branches from the central topic
- Each branch should have 2-4 leaves
- Use relevant emojis for icons
- Labels must be concise (1-4 words)
- Cover all key concepts, formulas, and objectives
- Return ONLY the JSON, no markdown or explanation`;

  const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
    language,
    temperature: 0.7,
    maxTokens: 4000,
  });

  // استخراج JSON من الاستجابة
  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `لم يتم العثور على JSON صالح في استجابة الذكاء الاصطناعي.\n` +
      `No valid JSON found in AI response.`
    );
  }

  const parsed: AIConceptResponse = JSON.parse(jsonMatch[0]);
  const concepts: ExtractedConcept[] = [];

  // العقدة المركزية
  concepts.push({
    id: "central",
    label: parsed.centralTopic.en,
    labelAr: parsed.centralTopic.ar,
    depth: 0,
    icon: "🎯",
  });

  // الفروع والأوراق
  for (const branch of parsed.branches) {
    concepts.push({
      id: branch.id,
      label: branch.label,
      labelAr: branch.labelAr,
      depth: 1,
      parentId: "central",
      icon: branch.icon || randomIcon(),
    });

    for (const leaf of branch.leaves ?? []) {
      concepts.push({
        id: leaf.id,
        label: leaf.label,
        labelAr: leaf.labelAr,
        depth: 2,
        parentId: branch.id,
        icon: leaf.icon || randomIcon(),
      });
    }
  }

  return concepts;
}

// ============================================================
// حساب المواقع / Position Calculation
// ============================================================

/**
 * حساب المواقع بتخطيط شعاعي
 * Computes positions using a radial layout algorithm
 */
function computeRadialLayout(concepts: ExtractedConcept[]): MindMapNode[] {
  const nodes: MindMapNode[] = [];
  const central = concepts.find((c) => c.depth === 0)!;

  // العقدة المركزية
  nodes.push({
    id: central.id,
    label: central.label,
    labelAr: central.labelAr,
    x: 0,
    y: 0,
    color: getColorForDepth(0),
    type: "central",
    icon: central.icon,
  });

  // الفروع الرئيسية (عمق 1)
  const branches = concepts.filter((c) => c.depth === 1);
  const branchCount = branches.length;
  const angleStep = (2 * Math.PI) / branchCount;
  const startAngle = -Math.PI / 2; // يبدأ من الأعلى

  // تجميع الأوراق حسب الأم
  const leavesByParent = new Map<string, ExtractedConcept[]>();
  for (const c of concepts.filter((c) => c.depth === 2)) {
    const parentId = c.parentId!;
    if (!leavesByParent.has(parentId)) {
      leavesByParent.set(parentId, []);
    }
    leavesByParent.get(parentId)!.push(c);
  }

  for (let i = 0; i < branchCount; i++) {
    const branch = branches[i];
    const angle = startAngle + i * angleStep;
    const bx = Math.cos(angle) * RADIAL_BRANCH_RADIUS;
    const by = Math.sin(angle) * RADIAL_BRANCH_RADIUS;

    nodes.push({
      id: branch.id,
      label: branch.label,
      labelAr: branch.labelAr,
      x: Math.round(bx),
      y: Math.round(by),
      color: getColorForDepth(1),
      type: "branch",
      parentId: central.id,
      icon: branch.icon,
    });

    // الأوراق لفرع هذا
    const leaves = leavesByParent.get(branch.id) ?? [];
    const leafCount = leaves.length;

    if (leafCount > 0) {
      const spreadAngle = angleStep * 0.7; // انتشار الأوراق أضيق من تباعد الفروع
      const leafAngleStep = leafCount > 1 ? spreadAngle / (leafCount - 1) : 0;
      const leafStartAngle = angle - spreadAngle / 2;

      for (let j = 0; j < leafCount; j++) {
        const leaf = leaves[j];
        const leafAngle = leafCount === 1 ? angle : leafStartAngle + j * leafAngleStep;
        const lx = Math.cos(leafAngle) * RADIAL_LEAF_RADIUS;
        const ly = Math.sin(leafAngle) * RADIAL_LEAF_RADIUS;

        nodes.push({
          id: leaf.id,
          label: leaf.label,
          labelAr: leaf.labelAr,
          x: Math.round(lx),
          y: Math.round(ly),
          color: getColorForDepth(2),
          type: "leaf",
          parentId: branch.id,
          icon: leaf.icon,
        });
      }
    }
  }

  return nodes;
}

/**
 * حساب المواقع بتخطيط شجري
 * Computes positions using a tree layout algorithm
 */
function computeTreeLayout(concepts: ExtractedConcept[]): MindMapNode[] {
  const nodes: MindMapNode[] = [];
  const central = concepts.find((c) => c.depth === 0)!;

  // العقدة الجذرية في الأعلى
  nodes.push({
    id: central.id,
    label: central.label,
    labelAr: central.labelAr,
    x: 0,
    y: 0,
    color: getColorForDepth(0),
    type: "central",
    icon: central.icon,
  });

  // الفروع الرئيسية
  const branches = concepts.filter((c) => c.depth === 1);
  const branchCount = branches.length;
  const totalBranchWidth = (branchCount - 1) * TREE_SIBLING_GAP;
  const startX = -totalBranchWidth / 2;

  // تجميع الأوراق حسب الأم
  const leavesByParent = new Map<string, ExtractedConcept[]>();
  for (const c of concepts.filter((c) => c.depth === 2)) {
    const parentId = c.parentId!;
    if (!leavesByParent.has(parentId)) {
      leavesByParent.set(parentId, []);
    }
    leavesByParent.get(parentId)!.push(c);
  }

  for (let i = 0; i < branchCount; i++) {
    const branch = branches[i];
    const bx = startX + i * TREE_SIBLING_GAP;
    const by = TREE_LEVEL_HEIGHT;

    nodes.push({
      id: branch.id,
      label: branch.label,
      labelAr: branch.labelAr,
      x: Math.round(bx),
      y: Math.round(by),
      color: getColorForDepth(1),
      type: "branch",
      parentId: central.id,
      icon: branch.icon,
    });

    // الأوراق
    const leaves = leavesByParent.get(branch.id) ?? [];
    const leafCount = leaves.length;
    const leafTotalWidth = (leafCount - 1) * (TREE_SIBLING_GAP * 0.6);
    const leafStartX = bx - leafTotalWidth / 2;

    for (let j = 0; j < leafCount; j++) {
      const leaf = leaves[j];
      const lx = leafCount === 1 ? bx : leafStartX + j * TREE_SIBLING_GAP * 0.6;

      nodes.push({
        id: leaf.id,
        label: leaf.label,
        labelAr: leaf.labelAr,
        x: Math.round(lx),
        y: Math.round(by + TREE_LEVEL_HEIGHT),
        color: getColorForDepth(2),
        type: "leaf",
        parentId: branch.id,
        icon: leaf.icon,
      });
    }
  }

  return nodes;
}

/**
 * بناء الحواف من العُقد
 * Builds edges from node parent relationships
 */
function buildEdges(nodes: MindMapNode[]): MindMapEdge[] {
  const edges: MindMapEdge[] = [];

  for (const node of nodes) {
    if (node.parentId) {
      edges.push({ from: node.parentId, to: node.id });
    }
  }

  return edges;
}

// ============================================================
// التخزين في قاعدة البيانات / Database Storage
// ============================================================

/**
 * تخزين الخريطة الذهنية في قاعدة البيانات
 * Stores the mind map in the database (upsert)
 */
async function storeMindMap(
  lessonId: string,
  data: MindMapData
): Promise<void> {
  const jsonString = JSON.stringify(data);

  await db.mindMap.upsert({
    where: { lessonId },
    create: {
      id: `mm_${lessonId}`,
      lessonId,
      data: jsonString,
    },
    update: {
      data: jsonString,
    },
  });
}

// ============================================================
// الدالة الرئيسية / Main Function
// ============================================================

/**
 * توليد خريطة ذهنية تفاعلية لدرس معين
 * Generates an interactive mind map for a given lesson
 *
 * @param lessonId - معرّف الدرس / Lesson identifier
 * @param options - خيارات التوليد / Generation options
 * @returns بيانات الخريطة الذهنية / Mind map data
 * @throws {Error} إذا لم يتم العثور على الدرس أو فشل الذكاء الاصطناعي
 *
 * @example
 * ```ts
 * const mindMap = await generateMindMap("lesson_123", {
 *   language: "ar",
 *   style: "radial",
 * });
 * console.log(mindMap.nodes.length); // عدد العُقد
 * ```
 */
export async function generateMindMap(
  lessonId: string,
  options?: MindMapOptions
): Promise<MindMapData> {
  const language = options?.language ?? "ar";
  const style = options?.style ?? "radial";

  // 1. جلب محتوى الدرس
  const content = await fetchLessonContent(lessonId);
  if (!content) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\n` +
      `Lesson with ID "${lessonId}" not found.`
    );
  }

  // 2. استخراج المفاهيم بالذكاء الاصطناعي
  const concepts = await extractConceptsWithAI(content, language);

  if (concepts.length === 0) {
    throw new Error(
      "لم يتم استخراج أي مفاهيم من الدرس.\n" +
      "No concepts extracted from the lesson."
    );
  }

  // 3. حساب المواقع خوارزميًا
  const nodes =
    style === "radial"
      ? computeRadialLayout(concepts)
      : computeTreeLayout(concepts);

  // 4. بناء الحواف
  const edges = buildEdges(nodes);

  // 5. تجميع النتيجة
  const mindMapData: MindMapData = {
    nodes,
    edges,
    layout: style,
  };

  // 6. تخزين في قاعدة البيانات
  await storeMindMap(lessonId, mindMapData);

  return mindMapData;
}