'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Download, Copy, Edit, ChevronLeft, ChevronRight, Shuffle,
  Loader2, BookOpen, Palette, Save, FileJson, X, Layers as FlashcardsIcon,
  BarChart3, Map, FunctionSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useFactoryStore, type ExtractedUnit, type ExtractedLesson } from '@/lib/factory-store';

// ── Types ──
type MaterialType = 'mindmap' | 'infographic' | 'flashcards' | 'formulaSheet' | 'conceptMap';

interface MaterialTypeConfig {
  id: MaterialType;
  icon: string;
  label: string;
  description: string;
}

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
  color: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
}

interface FormulaItem {
  id: string;
  formula: string;
  description: string;
  topic: string;
}

interface ConceptNode {
  id: string;
  text: string;
  connections: { targetId: string; label: string }[];
  color: string;
}

interface InfographicData {
  title: string;
  stats: { label: string; value: string }[];
  points: { text: string; icon: string }[];
  colorScheme: string;
}

interface MindMapData { type: 'mindmap'; root: MindMapNode }
interface FlashcardsData { type: 'flashcards'; cards: Flashcard[] }
interface FormulaSheetData { type: 'formulaSheet'; formulas: FormulaItem[]; topic: string }
interface ConceptMapData { type: 'conceptMap'; nodes: ConceptNode[] }

interface GeneratedMaterial {
  id: string;
  type: MaterialType;
  title: string;
  lessonTitle: string;
  createdAt: string;
  data: MindMapData | FlashcardsData | FormulaSheetData | ConceptMapData | InfographicData;
}

// ── Constants ──
const materialTypes: MaterialTypeConfig[] = [
  { id: 'mindmap', icon: '🧠', label: 'خريطة ذهنية', description: 'Visual concept connections' },
  { id: 'infographic', icon: '📊', label: 'إنفوجرافيك', description: 'Visual data summary' },
  { id: 'flashcards', icon: '📝', label: 'بطاقات تعليمية', description: 'Q&A cards' },
  { id: 'formulaSheet', icon: '📐', label: 'ورقة معادلات', description: 'All formulas in one page' },
  { id: 'conceptMap', icon: '🗺️', label: 'خريطة مفاهيم', description: 'Concept relationships' },
];

const branchColors = [
  'text-emerald-600 dark:text-emerald-400',
  'text-amber-600 dark:text-amber-400',
  'text-rose-600 dark:text-rose-400',
  'text-purple-600 dark:text-purple-400',
  'text-teal-600 dark:text-teal-400',
  'text-orange-600 dark:text-orange-400',
];

const branchBgColors = [
  'bg-emerald-500/10 border-emerald-500/30',
  'bg-amber-500/10 border-amber-500/30',
  'bg-rose-500/10 border-rose-500/30',
  'bg-purple-500/10 border-purple-500/30',
  'bg-teal-500/10 border-teal-500/30',
  'bg-orange-500/10 border-orange-500/30',
];

const colorSchemes = [
  { id: 'emerald', label: 'أخضر', primary: 'emerald' },
  { id: 'amber', label: 'ذهبي', primary: 'amber' },
  { id: 'rose', label: 'وردي', primary: 'rose' },
  { id: 'purple', label: 'بنفسجي', primary: 'purple' },
  { id: 'teal', label: 'فيروزي', primary: 'teal' },
];

// ── Helpers ──
function getKeyPoints(lesson: ExtractedLesson): string[] {
  if (!lesson.keyPoints) return [];
  if (typeof lesson.keyPoints === 'string') {
    try { return JSON.parse(lesson.keyPoints || '[]'); }
    catch { return []; }
  }
  return lesson.keyPoints || [];
}

function extractFormulas(content: string, topic: string): FormulaItem[] {
  const formulas: FormulaItem[] = [];
  const lines = content.split(/[\n.،؛]/).filter(l => l.trim().length > 0);
  const seen = new Set<string>();
  const keywords = ['=', 'معادلة', 'قانون', 'صيغة', 'حساب', 'نسبة', 'كثافة', 'سرعة', 'قوة', 'طاقة', 'ضغط', 'مساحة', 'حجم'];

  for (const line of lines) {
    const trimmed = line.trim();
    if (keywords.some(kw => trimmed.includes(kw)) && trimmed.length < 200 && !seen.has(trimmed)) {
      seen.add(trimmed);
      formulas.push({ id: crypto.randomUUID(), formula: trimmed, description: `مستخرج من ${topic}`, topic });
    }
  }

  if (formulas.length === 0) {
    for (const line of lines.slice(0, 8)) {
      const trimmed = line.trim();
      if (trimmed.length > 10 && trimmed.length < 150 && !seen.has(trimmed)) {
        seen.add(trimmed);
        formulas.push({ id: crypto.randomUUID(), formula: trimmed, description: `مفهوم أساسي من ${topic}`, topic });
      }
    }
  }
  return formulas;
}

function shuffleArray<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

// ── Client-side generators ──
function generateMindMap(lesson: ExtractedLesson): MindMapData {
  const kps = getKeyPoints(lesson);
  const children: MindMapNode[] = kps.map((kp, i) => ({
    id: crypto.randomUUID(),
    text: kp,
    children: [],
    color: branchColors[i % branchColors.length],
  }));
  return {
    type: 'mindmap',
    root: {
      id: crypto.randomUUID(),
      text: lesson.titleAr || lesson.titleEn || 'الموضوع الرئيسي',
      children,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  };
}

function generateFlashcards(lesson: ExtractedLesson): FlashcardsData {
  const kps = getKeyPoints(lesson);
  const cards: Flashcard[] = [];
  for (const kp of kps) {
    if (kp.trim().length > 5) {
      const words = kp.split(/\s+/);
      cards.push({
        id: crypto.randomUUID(),
        front: `ما هو المقصود بـ: ${words.slice(0, Math.min(5, words.length)).join(' ')}؟`,
        back: kp,
        category: lesson.titleAr,
      });
    }
  }
  const sentences = (lesson.content || '').split(/[.\n]/).filter(s => s.trim().length > 20 && s.trim().length < 200);
  for (const sentence of sentences.slice(0, 10)) {
    const trimmed = sentence.trim();
    cards.push({
      id: crypto.randomUUID(),
      front: `اشرح: ${trimmed.slice(0, 60)}...`,
      back: trimmed,
      category: lesson.titleAr,
    });
  }
  return { type: 'flashcards', cards };
}

function generateFormulaSheet(lesson: ExtractedLesson): FormulaSheetData {
  return { type: 'formulaSheet', formulas: extractFormulas(lesson.content || '', lesson.titleAr), topic: lesson.titleAr };
}

function generateConceptMap(lesson: ExtractedLesson): ConceptMapData {
  const kps = getKeyPoints(lesson);
  const nodes: ConceptNode[] = [];
  nodes.push({
    id: crypto.randomUUID(), text: lesson.titleAr || 'الموضوع',
    connections: kps.map(() => ({ targetId: '', label: 'يشمل' })),
    color: branchColors[0],
  });
  for (let i = 0; i < kps.length; i++) {
    nodes.push({
      id: crypto.randomUUID(), text: kps[i],
      connections: i < kps.length - 1 ? [{ targetId: '', label: 'يرتبط بـ' }] : [],
      color: branchColors[(i + 1) % branchColors.length],
    });
  }
  // Fix references
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].connections = nodes[i].connections.map(conn => {
      if (!conn.targetId) return { ...conn, targetId: nodes[Math.min(i + 1, nodes.length - 1)].id };
      if (!isNaN(Number(conn.targetId))) return { ...conn, targetId: nodes[Math.min(Number(conn.targetId), nodes.length - 1)].id };
      return conn;
    });
  }
  return { type: 'conceptMap', nodes };
}

function generateInfographic(lesson: ExtractedLesson): InfographicData {
  const kps = getKeyPoints(lesson);
  const sentences = (lesson.content || '').split(/[.\n]/).filter(s => s.trim().length > 0);
  return {
    title: lesson.titleAr,
    stats: [
      { label: 'عدد النقاط الرئيسية', value: String(kps.length) },
      { label: 'عدد الجمل', value: String(sentences.length) },
      { label: 'طول المحتوى', value: `${(lesson.content || '').length} حرف` },
      { label: 'الدروس', value: '1' },
    ],
    points: kps.slice(0, 8).map(kp => ({
      text: kp,
      icon: ['📌', '💡', '🔑', '⚡', '🎯', '✨', '📊', '📝'][Math.floor(Math.random() * 8)],
    })),
    colorScheme: 'emerald',
  };
}

// ── Animation ──
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

// ── Sub-renderers ──
function MindMapView({ data, onExportJSON }: { data: MindMapData; onExportJSON: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const root = data.root;

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setIsEditing(false); toast.success('تم تحديث البيانات'); }}>
            <Save className="w-3.5 h-3.5 ml-1" />حفظ
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => setIsEditing(false)}>
            <X className="w-3.5 h-3.5 ml-1" />إلغاء
          </Button>
        </div>
        <Textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} className="font-mono text-xs min-h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info('سيتم إضافة تصدير الصورة قريباً')}>
          <Download className="w-3.5 h-3.5 ml-1" />تصدير كصورة
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={onExportJSON}>
          <FileJson className="w-3.5 h-3.5 ml-1" />تصدير JSON
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => { setJsonText(JSON.stringify(data, null, 2)); setIsEditing(true); }}>
          <Edit className="w-3.5 h-3.5 ml-1" />تحرير
        </Button>
      </div>
      <Card className="p-6 overflow-x-auto">
        <div className="flex flex-col items-center min-w-fit">
          <div className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-lg">{root.text}</div>
          {root.children.length > 0 && <div className="w-px h-4 bg-border" />}
          {root.children.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
              {root.children.map((child, idx) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-3 bg-border" />
                  <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${branchBgColors[idx % branchBgColors.length]}`}>
                    <span className={branchColors[idx % branchColors.length]}>
                      {child.text.length > 60 ? child.text.slice(0, 60) + '...' : child.text}
                    </span>
                  </div>
                  {child.children && child.children.length > 0 && (
                    <>
                      <div className="w-px h-2 bg-border" />
                      <div className="flex gap-2 flex-wrap justify-center">
                        {child.children.map((sub) => (
                          <div key={sub.id} className="flex flex-col items-center">
                            <div className="w-px h-2 bg-border" />
                            <div className="px-2 py-1 rounded border border-border bg-muted/30 text-[10px] max-w-[120px] text-center">
                              {sub.text.length > 30 ? sub.text.slice(0, 30) + '...' : sub.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function FlashcardsView({ data }: { data: FlashcardsData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(data.cards);

  const currentCard = cards[currentIndex];
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <FlashcardsIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">لا توجد بطاقات كافية</p>
      </div>
    );
  }

  const handleShuffle = () => { setCards(shuffleArray(cards)); setCurrentIndex(0); toast.success('تم خلط البطاقات'); };
  const handlePrev = () => { setIsFlipped(false); setCurrentIndex(p => p > 0 ? p - 1 : cards.length - 1); };
  const handleNext = () => { setIsFlipped(false); setCurrentIndex(p => p < cards.length - 1 ? p + 1 : 0); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button size="sm" variant="outline" className="text-xs" onClick={handlePrev}>
          <ChevronRight className="w-4 h-4 ml-1" />السابق
        </Button>
        <span className="text-xs text-muted-foreground min-w-[80px] text-center">{currentIndex + 1} / {cards.length}</span>
        <Button size="sm" variant="outline" className="text-xs" onClick={handleNext}>
          التالي<ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={handleShuffle}>
          <Shuffle className="w-3.5 h-3.5 ml-1" />خلط
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => { if (currentCard && navigator.clipboard) { navigator.clipboard.writeText(`السؤال: ${currentCard.front}\nالإجابة: ${currentCard.back}`); toast.success('تم نسخ البطاقة'); } }}>
          <Copy className="w-3.5 h-3.5 ml-1" />نسخ
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info('سيتم إضافة تصدير PDF قريباً')}>
          <Download className="w-3.5 h-3.5 ml-1" />تصدير PDF
        </Button>
      </div>

      <div className="flex justify-center">
        <motion.div className="w-full max-w-md cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} whileTap={{ scale: 0.98 }}>
          <motion.div
            className="relative w-full"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Card className="min-h-[220px] flex flex-col items-center justify-center p-6 text-center" style={{ backfaceVisibility: 'hidden' }}>
              <Badge variant="secondary" className="mb-3 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{currentCard.category || 'سؤال'}</Badge>
              <p className="text-sm font-medium leading-relaxed">{currentCard.front}</p>
              <p className="text-[10px] text-muted-foreground mt-4">اضغط لقلب البطاقة</p>
            </Card>
            <Card className="absolute inset-0 min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <Badge variant="secondary" className="mb-3 text-[10px]">الإجابة</Badge>
              <p className="text-sm font-medium leading-relaxed">{currentCard.back}</p>
              <p className="text-[10px] text-muted-foreground mt-4">اضغط للعودة</p>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full bg-emerald-500 rounded-full" animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

function FormulaSheetView({ data }: { data: FormulaSheetData }) {
  if (data.formulas.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <FunctionSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">لم يتم العثور على معادلات في هذا الدرس</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <Button size="sm" variant="outline" className="text-xs" onClick={() => {
        const text = data.formulas.map((f, i) => `${i + 1}. ${f.formula}\n   ${f.description}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `formulas_${data.topic.replace(/\s+/g, '_')}.txt`; a.click();
        URL.revokeObjectURL(url); toast.success('تم تصدير جميع المعادلات');
      }}>
        <Download className="w-3.5 h-3.5 ml-1" />تصدير الكل
      </Button>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {data.formulas.map((formula) => (
              <div key={formula.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-mono leading-relaxed" dir="ltr">{formula.formula}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formula.description}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-xs h-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(formula.formula); toast.success('تم نسخ المعادلة'); } }}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConceptMapView({ data, onExportJSON }: { data: ConceptMapData; onExportJSON: () => void }) {
  if (data.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Map className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">لا توجد مفاهيم كافية لتوليد خريطة</p>
      </div>
    );
  }
  const centralNode = data.nodes[0];
  const otherNodes = data.nodes.slice(1);
  return (
    <div className="space-y-3">
      <Button size="sm" variant="outline" className="text-xs" onClick={onExportJSON}>
        <FileJson className="w-3.5 h-3.5 ml-1" />تصدير JSON
      </Button>
      <Card className="p-6 overflow-x-auto">
        <div className="flex flex-col items-center min-w-fit gap-6">
          <div className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg">{centralNode.text}</div>
          <div className="flex gap-4 flex-wrap justify-center">
            {otherNodes.map((node, idx) => (
              <div key={node.id} className="flex flex-col items-center">
                <span className="text-[9px] text-muted-foreground mb-1 px-2 py-0.5 rounded bg-muted/50">{node.connections[0]?.label || 'يرتبط'}</span>
                <div className="w-px h-2 bg-border" />
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium max-w-[150px] text-center ${branchBgColors[idx % branchBgColors.length]}`}>
                  <span className={branchColors[idx % branchColors.length]}>
                    {node.text.length > 50 ? node.text.slice(0, 50) + '...' : node.text}
                  </span>
                </div>
                {idx < otherNodes.length - 1 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-4 h-px bg-border" />
                    <span className="text-[8px] text-muted-foreground">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfographicView({ data }: { data: InfographicData }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <Label className="text-xs">نظام الألوان:</Label>
        <div className="flex gap-2">
          {colorSchemes.map((cs) => (
            <button
              key={cs.id}
              className={`w-6 h-6 rounded-full border-2 transition-all ${data.colorScheme === cs.id ? 'border-foreground scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: `var(--color-${cs.id}-500, #10b981)` }}
              title={cs.label}
              onClick={() => toast.info(`تم تغيير اللون إلى ${cs.label}`)}
            />
          ))}
        </div>
      </div>
      <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info('سيتم إضافة التصدير قريباً')}>
        <Download className="w-3.5 h-3.5 ml-1" />تصدير
      </Button>
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-l from-emerald-600 to-emerald-700 p-6 text-center text-white">
          <h3 className="font-bold text-lg">{data.title}</h3>
          <p className="text-sm text-emerald-100 mt-1">ملخص بصري</p>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.stats.map((stat, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          {data.points.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-2">النقاط الرئيسية</h4>
              <div className="space-y-2">
                {data.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm shrink-0">{point.icon}</span>
                    <p className="text-xs leading-relaxed">{point.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Component ──
export default function MaterialsTab() {
  const { books, selectedBookId, units, setUnits, setActiveTab, addLog } = useFactoryStore();
  const [selectedMaterialType, setSelectedMaterialType] = useState<MaterialType>('mindmap');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [generatedMaterials, setGeneratedMaterials] = useState<GeneratedMaterial[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<GeneratedMaterial | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedBook = useMemo(() => books.find((b) => b.id === selectedBookId), [books, selectedBookId]);
  const allLessons = useMemo(() => {
    const lessons: ExtractedLesson[] = [];
    for (const unit of units) { if (unit.ExtractedLesson) lessons.push(...unit.ExtractedLesson); }
    return lessons;
  }, [units]);

  const fetchUnits = useCallback(async () => {
    if (!selectedBookId) return;
    try {
      const res = await fetch(`/api/books/${selectedBookId}/units`);
      if (res.ok) { const data = await res.json(); setUnits(data.units || []); }
    } catch { toast.error('فشل في تحميل الوحدات'); }
  }, [selectedBookId, setUnits]);

  useEffect(() => { if (selectedBookId) fetchUnits(); }, [selectedBookId, fetchUnits]);
  useEffect(() => { if (allLessons.length > 0 && !selectedLessonId) setSelectedLessonId(allLessons[0].id); }, [allLessons, selectedLessonId]);

  const generateMaterial = useCallback((lessons: ExtractedLesson[], mt: MaterialType) => {
    const materials: GeneratedMaterial[] = [];
    const typeLabel = materialTypes.find(m => m.id === mt)?.label || '';
    for (const lesson of lessons) {
      let data: GeneratedMaterial['data'];
      switch (mt) {
        case 'mindmap': data = generateMindMap(lesson); break;
        case 'flashcards': data = generateFlashcards(lesson); break;
        case 'formulaSheet': data = generateFormulaSheet(lesson); break;
        case 'conceptMap': data = generateConceptMap(lesson); break;
        case 'infographic': data = generateInfographic(lesson); break;
      }
      materials.push({ id: crypto.randomUUID(), type: mt, title: `${typeLabel} - ${lesson.titleAr}`, lessonTitle: lesson.titleAr, createdAt: new Date().toISOString(), data: data! });
    }
    return materials;
  }, []);

  const handleGenerate = useCallback(() => {
    if (allLessons.length === 0) { toast.error('لا توجد دروس في الكتاب المحدد'); return; }
    const target = selectedLessonId ? allLessons.filter(l => l.id === selectedLessonId) : allLessons;
    if (target.length === 0) { toast.error('لم يتم العثور على الدرس المحدد'); return; }
    setIsGenerating(true);
    setTimeout(() => {
      const newMaterials = generateMaterial(target, selectedMaterialType);
      setGeneratedMaterials(prev => [...newMaterials.reverse(), ...prev]);
      setActiveMaterial(newMaterials[0]);
      setIsGenerating(false);
      const typeLabel = materialTypes.find(m => m.id === selectedMaterialType)?.label || '';
      addLog({ type: 'success', message: `تم توليد ${newMaterials.length} ${typeLabel} بنجاح` });
      toast.success(`تم توليد ${newMaterials.length} ${typeLabel}`);
    }, 600);
  }, [allLessons, selectedLessonId, selectedMaterialType, generateMaterial, addLog]);

  const handleGenerateAll = useCallback(() => {
    if (allLessons.length === 0) { toast.error('لا توجد دروس في الكتاب المحدد'); return; }
    setIsGenerating(true);
    setTimeout(() => {
      const newMaterials = generateMaterial(allLessons, selectedMaterialType);
      setGeneratedMaterials(prev => [...newMaterials.reverse(), ...prev]);
      setActiveMaterial(newMaterials[0]);
      setIsGenerating(false);
      const typeLabel = materialTypes.find(m => m.id === selectedMaterialType)?.label || '';
      addLog({ type: 'success', message: `تم توليد ${newMaterials.length} ${typeLabel} لكل الدروس` });
      toast.success(`تم توليد ${newMaterials.length} ${typeLabel} لكل الدروس`);
    }, 1000);
  }, [allLessons, selectedMaterialType, generateMaterial, addLog]);

  const handleExportJSON = useCallback(() => {
    if (!activeMaterial) return;
    const blob = new Blob([JSON.stringify(activeMaterial.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${activeMaterial.title.replace(/\s+/g, '_')}.json`; a.click();
    URL.revokeObjectURL(url); toast.success('تم التصدير كملف JSON');
  }, [activeMaterial]);

  // ── No book selected ──
  if (!selectedBookId) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold">توليد المواد المساعدة</h2>
          <p className="text-sm text-muted-foreground">إنشاء خرائط ذهنية وبطاقات تعليمية ومواد متنوعة</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-base mb-2">اختر كتاباً لبدء توليد المواد المساعدة</h3>
              <p className="text-sm text-muted-foreground max-w-sm">اختر كتاباً من قائمة المصادر لبدء توليد المواد التعليمية المختلفة</p>
              <Button variant="outline" className="mt-4" onClick={() => setActiveTab('sources')}>
                <BookOpen className="w-4 h-4 ml-2" />الذهاب للمصادر
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold">توليد المواد المساعدة</h2>
        <p className="text-sm text-muted-foreground">الكتاب: {selectedBook?.title || ''} — {allLessons.length} درس</p>
      </motion.div>

      {/* Material Type Selector — 5 cards in a grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {materialTypes.map((mt) => (
            <motion.div key={mt.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${selectedMaterialType === mt.id ? 'border-emerald-500 ring-1 ring-emerald-500/30 shadow-md' : 'hover:border-emerald-500/50'}`}
                onClick={() => setSelectedMaterialType(mt.id)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <span className="text-2xl">{mt.icon}</span>
                  <p className="text-sm font-medium">{mt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{mt.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Generation Panel */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 w-full sm:w-auto">
                <Label className="text-xs mb-1 block">الدرس المحدد</Label>
                <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
                  <SelectTrigger className="w-full text-xs"><SelectValue placeholder="اختر درساً" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">جميع الدروس</SelectItem>
                    {allLessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>{lesson.titleAr || lesson.titleEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleGenerate} disabled={isGenerating || allLessons.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                  {isGenerating ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Brain className="w-4 h-4 ml-2" />}
                  توليد المادة
                </Button>
                <Button variant="outline" onClick={handleGenerateAll} disabled={isGenerating || allLessons.length === 0} className="text-xs">
                  {isGenerating ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Shuffle className="w-4 h-4 ml-2" />}
                  توليد لكل الدروس
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Materials List */}
      {generatedMaterials.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold mb-2">المواد المولّدة ({generatedMaterials.length})</h3>
          <ScrollArea className="max-h-12">
            <div className="flex gap-2 flex-wrap pb-2">
              {generatedMaterials.map((mat) => (
                <Button
                  key={mat.id}
                  size="sm"
                  variant={activeMaterial?.id === mat.id ? 'default' : 'outline'}
                  className={`text-xs ${activeMaterial?.id === mat.id ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                  onClick={() => setActiveMaterial(mat)}
                >
                  {mat.title.length > 35 ? mat.title.slice(0, 35) + '...' : mat.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}

      {/* Active Material Display */}
      <AnimatePresence mode="wait">
        {activeMaterial && (
          <motion.div
            key={activeMaterial.id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{materialTypes.find(m => m.id === activeMaterial.type)?.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm">{activeMaterial.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{activeMaterial.lessonTitle}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {materialTypes.find(m => m.id === activeMaterial.type)?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              {activeMaterial.data.type === 'mindmap' && <MindMapView data={activeMaterial.data as MindMapData} onExportJSON={handleExportJSON} />}
              {activeMaterial.data.type === 'flashcards' && <FlashcardsView data={activeMaterial.data as FlashcardsData} />}
              {activeMaterial.data.type === 'formulaSheet' && <FormulaSheetView data={activeMaterial.data as FormulaSheetData} />}
              {activeMaterial.data.type === 'conceptMap' && <ConceptMapView data={activeMaterial.data as ConceptMapData} onExportJSON={handleExportJSON} />}
              {activeMaterial.data.type === 'infographic' && <InfographicView data={activeMaterial.data as InfographicData} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!activeMaterial && generatedMaterials.length === 0 && !isGenerating && (
        <motion.div variants={itemVariants}>
          <Card className="border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-base mb-2">لم يتم توليد مواد بعد</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                اختر نوع المادة والدرس ثم اضغط على &quot;توليد المادة&quot; لإنشاء محتوى تعليمي متنوع
              </p>
              {allLessons.length === 0 && <p className="text-xs text-amber-500 mt-2">لا توجد دروس مستخرجة في هذا الكتاب</p>}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
