/**
 * @module visual/logic-map-generator
 * @description مُولِّد الخرائط المنطقية (مخططات التدفق).
 * يستخرج الذكاء الاصطناعي خطوات العملية والقرارات،
 * ثم تُحسَب المواقع خوارزميًا في تخطيط من أعلى لأسفل.
 *
 * Logic map (flowchart) generator.
 * AI extracts process steps and decisions; positions are computed
 * algorithmically in a top-to-bottom layout.
 */

import { generateContent, TaskType } from "@/lib/ai";
import { db } from "@/lib/db";

// ============================================================
// الأنواع / Types
// ============================================================

/** عُقدة في الخريطة المنطقية */
export interface LogicMapNode {
  /** معرّف فريد */
  id: string;
  /** النص بالإنجليزية */
  label: string;
  /** النص بالعربية */
  labelAr: string;
  /** نوع العقدة */
  type: "start" | "process" | "decision" | "end" | "input" | "output";
  /** الموضع الأفقي */
  x: number;
  /** الموضع العمودي */
  y: number;
}

/** اتصال بين عُقدتين */
export interface LogicMapConnection {
  /** معرّف العقدة المصدر */
  from: string;
  /** معرّف العقدة الهدف */
  to: string;
  /** نص على الاتصال (مثل "نعم" / "لا" للقرارات) */
  label?: string;
  /** النص بالعربية */
  labelAr?: string;
}

/** بيانات الخريطة المنطقية الكاملة */
export interface LogicMapData {
  /** قائمة العُقد */
  nodes: LogicMapNode[];
  /** قائمة الاتصالات */
  connections: LogicMapConnection[];
  /** العنوان بالإنجليزية */
  title: string;
  /** العنوان بالعربية */
  titleAr: string;
}

/** خيارات توليد الخريطة المنطقية */
export interface LogicMapOptions {
  /** اللغة المفضلة */
  language?: "ar" | "en";
}

// ============================================================
// ثوابت / Constants
// ============================================================

/** المسافة العمودية بين المستويات */
const LEVEL_HEIGHT = 120;
/** المسافة الأفقية بين العُقد المتجاورة */
const NODE_GAP = 240;
/** عرض عقدة القرار (أوسع من غيرها) */
const DECISION_WIDTH = 180;
/** عرض العقدة العادية */
const NODE_WIDTH = 160;

/** ألوان حسب نوع العقدة */
const NODE_COLORS: Record<LogicMapNode["type"], string> = {
  start: "#10b981",
  process: "#6366f1",
  decision: "#f59e0b",
  end: "#ef4444",
  input: "#06b6d4",
  output: "#8b5cf6",
};

// ============================================================
// أنواع داخلية / Internal Types
// ============================================================

/** عقدة مُستخرَجة من الذكاء الاصطناعي (قبل حساب المواقع) */
interface ExtractedNode {
  id: string;
  label: string;
  labelAr: string;
  type: LogicMapNode["type"];
  level: number;
}

/** اتصال مُستخرَج من الذكاء الاصطناعي */
interface ExtractedConnection {
  from: string;
  to: string;
  label?: string;
  labelAr?: string;
}

/** استجابة JSON من الذكاء الاصطناعي */
interface AILogicMapResponse {
  nodes: Array<{
    id: string;
    label: string;
    labelAr: string;
    type: "start" | "process" | "decision" | "end" | "input" | "output";
  }>;
  connections: Array<{
    from: string;
    to: string;
    label?: string;
    labelAr?: string;
  }>;
}

// ============================================================
// الدوال المساعدة / Helper Functions
// ============================================================

/**
 * جلب محتوى الدرس من قاعدة البيانات
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
  examples: Array<{
    questionAr: string;
    questionEn: string;
    solutionAr: string;
    solutionEn: string;
    stepsAr: string;
    stepsEn: string;
  }>;
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
      Example: { orderBy: { order: "asc" } },
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
    examples: lesson.Example.map((e) => ({
      questionAr: e.questionAr,
      questionEn: e.questionEn,
      solutionAr: e.solutionAr,
      solutionEn: e.solutionEn,
      stepsAr: e.stepsAr,
      stepsEn: e.stepsEn,
    })),
  };
}

// ============================================================
// حساب المواقع / Position Calculation
// ============================================================

/**
 * حساب المستوى لكل عقدة باستخدام البحث العرضي (BFS)
 * Computes the level for each node using BFS from the start node
 */
function computeNodeLevels(
  nodes: ExtractedNode[],
  connections: ExtractedConnection[]
): Map<string, number> {
  const levels = new Map<string, number>();
  const nodeMap = new Map<string, ExtractedNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  // بناء خريطة التبعية
  const outgoing = new Map<string, string[]>();
  for (const n of nodes) {
    outgoing.set(n.id, []);
  }
  for (const c of connections) {
    outgoing.get(c.from)?.push(c.to);
  }

  // البحث عن عقدة البداية
  const startNode = nodes.find((n) => n.type === "start") ?? nodes[0];
  if (!startNode) return levels;

  // BFS
  const queue: Array<{ id: string; level: number }> = [
    { id: startNode.id, level: 0 },
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    levels.set(id, level);

    for (const next of outgoing.get(id) ?? []) {
      if (!visited.has(next)) {
        queue.push({ id: next, level: level + 1 });
      }
    }
  }

  // إضافة أي عُقد لم تُزَر (عُقد معزولة)
  for (const n of nodes) {
    if (!visited.has(n.id)) {
      levels.set(n.id, (levels.get(n.id) ?? 0) + 1);
    }
  }

  return levels;
}

/**
 * حساب المواقع بتخطيط من أعلى لأسفل
 * Computes positions using a top-to-bottom layout
 */
function computeLayout(
  nodes: ExtractedNode[],
  connections: ExtractedConnection[]
): LogicMapNode[] {
  const levels = computeNodeLevels(nodes, connections);

  // تجميع العُقد حسب المستوى
  const nodesByLevel = new Map<number, ExtractedNode[]>();
  for (const node of nodes) {
    const level = levels.get(node.id) ?? 0;
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
  }

  // حساب المواقع
  const result: LogicMapNode[] = [];
  const maxLevel = Math.max(...nodesByLevel.keys(), 0);

  for (let level = 0; level <= maxLevel; level++) {
    const levelNodes = nodesByLevel.get(level) ?? [];
    const count = levelNodes.length;

    if (count === 0) continue;

    const totalWidth = (count - 1) * NODE_GAP;
    const startX = -totalWidth / 2;

    for (let i = 0; i < count; i++) {
      const node = levelNodes[i];
      result.push({
        id: node.id,
        label: node.label,
        labelAr: node.labelAr,
        type: node.type,
        x: Math.round(startX + i * NODE_GAP),
        y: Math.round(level * LEVEL_HEIGHT),
      });
    }
  }

  return result;
}

// ============================================================
// التوليد بالذكاء الاصطناعي / AI Generation
// ============================================================

/**
 * استخراج خريطة منطقية بالذكاء الاصطناعي
 * Extracts a logic map using AI
 */
async function extractLogicMapWithAI(
  content: NonNullable<Awaited<ReturnType<typeof fetchLessonContent>>>,
  language: "ar" | "en"
): Promise<{ nodes: ExtractedNode[]; connections: ExtractedConnection[] }> {
  const langInstruction =
    language === "ar"
      ? "أجب بالعربية والإنجليزية لكل عنصر."
      : "Answer in both English and Arabic for each element.";

  const conceptList = content.concepts
    .map((c, i) => `${i + 1}. ${c.termEn} / ${c.termAr}: ${c.definitionEn}`)
    .join("\n");

  const formulaList = content.formulas
    .map((f, i) => `${i + 1}. ${f.formula} — ${f.explanationEn}`)
    .join("\n");

  const exampleSteps = content.examples
    .map((e, i) => `${i + 1}. ${e.questionEn}\n   Steps: ${e.stepsEn}`)
    .join("\n");

  const prompt = `${langInstruction}

Create a logic map (flowchart) for this lesson that shows the process, reasoning, or concept flow.

Lesson: ${content.titleEn} / ${content.titleAr}
Summary: ${content.summaryEn}
Introduction: ${content.introductionEn}

Key Concepts:
${conceptList || "No concepts available."}

Formulas:
${formulaList || "No formulas available."}

Example Steps:
${exampleSteps || "No examples available."}

Return ONLY valid JSON:
{
  "nodes": [
    {
      "id": "n1",
      "label": "Node Label",
      "labelAr": "تسمية العقدة",
      "type": "start|process|decision|end|input|output"
    }
  ],
  "connections": [
    {
      "from": "n1",
      "to": "n2",
      "label": "Yes",
      "labelAr": "نعم"
    }
  ]
}

Rules:
- Must start with exactly one "start" node
- Must end with at least one "end" node
- Use "decision" for conditional branches (provide "Yes/No" labels on connections)
- Use "process" for steps/actions
- Use "input" for data/inputs and "output" for results/outputs
- 5-12 nodes total
- Keep labels concise (1-6 words)
- Each node must be connected
- Return ONLY the JSON, no markdown or explanation`;

  const result = await generateContent(TaskType.TEXT_GENERATION, prompt, {
    language,
    temperature: 0.7,
    maxTokens: 4000,
  });

  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `لم يتم العثور على JSON صالح في استجابة الخريطة المنطقية.\n` +
      `No valid JSON found in logic map AI response.`
    );
  }

  const parsed: AILogicMapResponse = JSON.parse(jsonMatch[0]);

  if (!parsed.nodes || parsed.nodes.length === 0) {
    throw new Error(
      "لم يتم استخراج أي عُقد للخريطة المنطقية.\n" +
      "No nodes extracted for the logic map."
    );
  }

  return {
    nodes: parsed.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      labelAr: n.labelAr,
      type: n.type,
      level: 0, // سيتم حسابه لاحقًا
    })),
    connections: parsed.connections.map((c) => ({
      from: c.from,
      to: c.to,
      label: c.label,
      labelAr: c.labelAr,
    })),
  };
}

// ============================================================
// الدالة الرئيسية / Main Function
// ============================================================

/**
 * توليد خريطة منطقية (مخطط تدفق) لدرس معين
 * Generates a logic map (flowchart) for a given lesson
 *
 * @param lessonId - معرّف الدرس / Lesson identifier
 * @param options - خيارات التوليد / Generation options
 * @returns بيانات الخريطة المنطقية / Logic map data
 * @throws {Error} إذا لم يتم العثور على الدرس أو فشل الذكاء الاصطناعي
 *
 * @example
 * ```ts
 * const logicMap = await generateLogicMap("lesson_123", {
 *   language: "ar",
 * });
 * console.log(logicMap.nodes.length);
 * ```
 */
export async function generateLogicMap(
  lessonId: string,
  options?: LogicMapOptions
): Promise<LogicMapData> {
  const language = options?.language ?? "ar";

  // 1. جلب محتوى الدرس
  const content = await fetchLessonContent(lessonId);
  if (!content) {
    throw new Error(
      `الدرس ذو المعرّف "${lessonId}" غير موجود.\n` +
      `Lesson with ID "${lessonId}" not found.`
    );
  }

  // 2. استخراج العُقد والاتصالات بالذكاء الاصطناعي
  const { nodes, connections } = await extractLogicMapWithAI(content, language);

  // 3. حساب المواقع خوارزميًا
  const positionedNodes = computeLayout(nodes, connections);

  // 4. تجميع النتيجة
  return {
    nodes: positionedNodes,
    connections,
    title: content.titleEn,
    titleAr: content.titleAr,
  };
}