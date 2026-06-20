'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Video, FileText, Mic, Film, CheckCircle, Circle, Loader2,
  Settings, ExternalLink, Info, ArrowLeft, Wand2, Volume2,
  MonitorPlay, Clapperboard, Cpu, ImageIcon, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useFactoryStore, type ExtractedLesson } from '@/lib/factory-store';

// ─── Types ───────────────────────────────────────────────────────────
interface LessonData {
  id: string;
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
}

type ScriptStyle = 'explanatory' | 'storytelling' | 'exam_review';
type ScriptLength = 'short' | 'medium' | 'long';
type TTSEngine = 'edge-tts' | 'qwen3-tts';
type VoiceOption = 'ar-EG-Hoda' | 'ar-SA-Najm' | 'ar-AE-Fatima';
type Resolution = '720p' | '1080p' | '4K';
type BgStyle = 'simple' | 'educational' | 'animated';

// ─── Helpers ─────────────────────────────────────────────────────────
function getLessonFromUnits(
  units: { ExtractedLesson: ExtractedLesson[] }[],
  lessonId: string | null
): LessonData | null {
  if (!lessonId) return null;
  for (const unit of units) {
    const found = unit.ExtractedLesson?.find((l) => l.id === lessonId);
    if (found) {
      return {
        id: found.id,
        title: found.titleAr || found.titleEn || '',
        content: found.content || '',
        summary: found.summary || '',
        keyPoints: typeof found.keyPoints === 'string'
          ? JSON.parse(found.keyPoints || '[]')
          : Array.isArray(found.keyPoints)
            ? found.keyPoints
            : [],
      };
    }
  }
  return null;
}

// ─── Labels ──────────────────────────────────────────────────────────
const scriptStyleLabels: Record<ScriptStyle, string> = {
  explanatory: 'شرح تفصيلي',
  storytelling: 'سرد قصصي',
  exam_review: 'مراجعة امتحان',
};

const scriptLengthLabels: Record<ScriptLength, string> = {
  short: 'قصير (3 دقائق)',
  medium: 'متوسط (5 دقائق)',
  long: 'طويل (10 دقائق)',
};

const voiceLabels: Record<VoiceOption, string> = {
  'ar-EG-Hoda': 'هدى (مصرية)',
  'ar-SA-Najm': 'نجم (سعودية)',
  'ar-AE-Fatima': 'فاطمة (إماراتية)',
};

const resolutionLabels: Record<Resolution, string> = {
  '720p': '720p',
  '1080p': '1080p',
  '4K': '4K',
};

const bgStyleLabels: Record<BgStyle, string> = {
  simple: 'بسيط',
  educational: 'تعليمي',
  animated: 'متحرك',
};

// ─── Tools ───────────────────────────────────────────────────────────
const availableTools = [
  {
    name: 'Qwen3-TTS Milx (Pinokio)',
    description: 'محرك صوتي محلي عالي الجودة للنص العربي',
    icon: <Mic className="w-4 h-4" />,
    instructions: 'شغّل من خلال Pinokio → اختر النموذج → أدخل النص → حمّل الصوت',
    color: 'text-emerald-500',
  },
  {
    name: 'Foocus (Pinokio)',
    description: 'توليد صور وخلفيات مخصصة للفيديو',
    icon: <ImageIcon className="w-4 h-4" />,
    instructions: 'شغّل Foocus → أدخل وصف الخلفية → انتظر التوليد → حمّل الصورة',
    color: 'text-amber-500',
  },
  {
    name: 'Wan2.1 (Pinokio)',
    description: 'توليد فيديو من الصور والنصوص',
    icon: <Film className="w-4 h-4" />,
    instructions: 'شغّل Wan2.1 → ارفع الخلفية والصوت → أنشئ الفيديو',
    color: 'text-purple-500',
  },
  {
    name: 'Edge-TTS',
    description: 'محرك صوتي سحابي مجاني من مايكروسوفت',
    icon: <Volume2 className="w-4 h-4" />,
    instructions: 'متاح مباشرة عبر الإنترنت — لا حاجة للتثبيت',
    color: 'text-sky-500',
  },
];

// ─── Progress Steps ─────────────────────────────────────────────────
const progressSteps = [
  { label: 'اختيار الدرس', icon: <CheckCircle className="w-4 h-4" /> },
  { label: 'توليد السكربت', icon: <FileText className="w-4 h-4" /> },
  { label: 'توليد الصوت', icon: <Mic className="w-4 h-4" /> },
  { label: 'تجميع الفيديو', icon: <Film className="w-4 h-4" /> },
  { label: 'المعاينة', icon: <MonitorPlay className="w-4 h-4" /> },
];

// ─── Component ───────────────────────────────────────────────────────
export default function VideoTab() {
  const { units, selectedLessonId, setActiveTab, addLog } = useFactoryStore();

  const lesson = useMemo(
    () => getLessonFromUnits(units, selectedLessonId),
    [units, selectedLessonId]
  );

  // Script state
  const [scriptStyle, setScriptStyle] = useState<ScriptStyle>('explanatory');
  const [scriptLength, setScriptLength] = useState<ScriptLength>('medium');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isSavingScript, setIsSavingScript] = useState(false);

  // Audio state
  const [ttsEngine, setTtsEngine] = useState<TTSEngine>('edge-tts');
  const [voice, setVoice] = useState<VoiceOption>('ar-EG-Hoda');
  const [speed, setSpeed] = useState(1.0);

  // Video state
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [bgStyle, setBgStyle] = useState<BgStyle>('educational');

  // Current progress step (0-4)
  const currentStep = useMemo(() => {
    if (!lesson) return -1;
    if (generatedScript) return 2;
    return 1;
  }, [lesson, generatedScript]);

  // ─── Client-side script generation ──────────────────────────────────
  const handleGenerateScript = async () => {
    if (!lesson) return;
    setIsGeneratingScript(true);
    addLog({ type: 'info', message: `بدء توليد سكربت فيديو: ${lesson.title}` });

    // Simulate API call with fallback to client-side generation
    try {
      const res = await fetch('/api/generate/video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          style: scriptStyle,
          length: scriptLength,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.script) {
          setGeneratedScript(data.script);
          addLog({ type: 'success', message: 'تم توليد السكربت بنجاح' });
          toast.success('تم توليد السكربت بنجاح');
          return;
        }
      }
    } catch {
      // API not available — fall through to client-side
    }

    // Client-side generation
    await new Promise((r) => setTimeout(r, 1500));
    const styleIntro: Record<ScriptStyle, string> = {
      explanatory: 'في هذا الدرس الشرح التفصيلي',
      storytelling: 'في قصة اليوم التعليمية',
      exam_review: 'في مراجعتنا اليوم للامتحان',
    };
    const lengthNote: Record<ScriptLength, string> = {
      short: '(نسخة مختصرة)',
      medium: '',
      long: '(نسخة مفصلة وشاملة)',
    };

    let script = `# سكربت فيديو: ${lesson.title}\n\n`;
    script += `${styleIntro[scriptStyle]}${lengthNote[scriptLength]}\n\n`;
    script += `---\n\n`;
    script += `## المقدمة\n\n`;
    script += `مرحباً بكم. ${styleIntro[scriptStyle]} سنتناول موضوع "${lesson.title}". `;
    script += `هذا الدرس جزء مهم من المنهج الدراسي. دعونا نبدأ.\n\n`;

    if (lesson.keyPoints.length > 0) {
      script += `## النقاط الرئيسية\n\n`;
      lesson.keyPoints.forEach((kp, i) => {
        script += `${i + 1}. ${kp}\n`;
      });
      script += `\n`;
    }

    if (lesson.summary) {
      script += `## الملخص\n\n${lesson.summary}\n\n`;
    }

    if (lesson.content) {
      const contentPreview = lesson.content.length > 2000
        ? lesson.content.slice(0, 2000) + '\n\n...'
        : lesson.content;
      script += `## المحتوى التفصيلي\n\n${contentPreview}\n\n`;
    }

    script += `---\n\n`;
    script += `## الخاتمة\n\n`;
    script += `بهذا نكون قد انتهينا من "${lesson.title}". `;
    script += `نرجو أن يكون الشرح واضحاً ومفيداً. إلى اللقاء في الدرس القادم!`;

    setGeneratedScript(script);
    addLog({ type: 'success', message: 'تم توليد السكربت محلياً بنجاح' });
    toast.success('تم توليد السكربت بنجاح');
    setIsGeneratingScript(false);
  };

  const handleSaveScript = async () => {
    if (!lesson || !generatedScript) return;
    setIsSavingScript(true);
    try {
      const res = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: generatedScript }),
      });
      if (res.ok) {
        toast.success('تم حفظ السكربت بنجاح');
        addLog({ type: 'success', message: `تم حفظ سكربت: ${lesson.title}` });
      } else {
        toast.error('فشل في حفظ السكربت');
      }
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSavingScript(false);
    }
  };

  const handleGenerateAudio = () => {
    toast.info('يجب تشغيل خدمة TTS أولاً', {
      description: `استخدم ${ttsEngine === 'edge-tts' ? 'Edge-TTS' : 'Qwen3-TTS'} لتوليد الصوت`,
    });
    addLog({
      type: 'warning',
      message: `محاولة توليد صوت بـ ${ttsEngine} — الخدمة غير متصلة`,
    });
  };

  const handleGenerateVideo = () => {
    toast.info('سيتم إضافة هذه الميزة قريباً', {
      description: 'توليد الفيديو المتكامل قيد التطوير',
    });
    addLog({ type: 'info', message: 'محاولة توليد فيديو — الميزة قيد التطوير' });
  };

  // ─── Empty state ───────────────────────────────────────────────────
  if (!selectedLessonId || !lesson) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">
          اختر درساً من تبويب المحتوى لبدء إنتاج الفيديو
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setActiveTab('content')}
        >
          <ArrowLeft className="w-4 h-4 ml-1" />
          الذهاب للمحتوى
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Progress Steps ─────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2">
            {progressSteps.map((step, index) => {
              const done = index < currentStep;
              const active = index === currentStep;
              const future = index > currentStep;
              return (
                <div key={index} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                        ${done ? 'bg-emerald-500 text-white' : active ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/50' : 'bg-muted text-muted-foreground'}
                      `}
                    >
                      {done ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : active ? (
                        index === 1 && isGeneratingScript ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          step.icon
                        )
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                    </div>
                    <span className={`text-[10px] text-center ${active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded-full ${index < currentStep ? 'bg-emerald-500' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ─── Main Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Main content (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* ─── Video Script Generator ────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Clapperboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-sm">مولّد السكربت</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{lesson.title}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-4">
              {/* Script Style */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">نمط السكربت</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(scriptStyleLabels) as ScriptStyle[]).map((style) => (
                    <Button
                      key={style}
                      variant={scriptStyle === style ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setScriptStyle(style)}
                    >
                      {scriptStyleLabels[style]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Script Length */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">طول السكربت</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(scriptLengthLabels) as ScriptLength[]).map((len) => (
                    <Button
                      key={len}
                      variant={scriptLength === len ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setScriptLength(len)}
                    >
                      {scriptLengthLabels[len]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript}
                className="w-full sm:w-auto"
              >
                {isGeneratingScript ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جارٍ التوليد...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 ml-2" />
                    توليد السكربت
                  </>
                )}
              </Button>

              {/* Generated Script */}
              {isGeneratingScript ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : generatedScript ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">السكربت المُولّد</label>
                    <span className="text-[10px] text-muted-foreground">
                      {generatedScript.split(/\s+/).length} كلمة
                    </span>
                  </div>
                  <Textarea
                    value={generatedScript}
                    onChange={(e) => setGeneratedScript(e.target.value)}
                    className="min-h-[200px] text-sm font-mono leading-relaxed"
                    dir="rtl"
                  />
                  <Button
                    onClick={handleSaveScript}
                    disabled={isSavingScript}
                    variant="outline"
                    size="sm"
                  >
                    {isSavingScript ? (
                      <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 ml-1" />
                    )}
                    حفظ السكربت
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* ─── Audio Settings ────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-sm">إعدادات الصوت</CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* TTS Engine */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">محرك الصوت</label>
                  <Select value={ttsEngine} onValueChange={(v) => setTtsEngine(v as TTSEngine)}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edge-tts">Edge-TTS</SelectItem>
                      <SelectItem value="qwen3-tts">Qwen3-TTS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">الصوت</label>
                  <Select value={voice} onValueChange={(v) => setVoice(v as VoiceOption)}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(voiceLabels) as VoiceOption[]).map((v) => (
                        <SelectItem key={v} value={v}>{voiceLabels[v]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    السرعة: {speed.toFixed(1)}x
                  </label>
                  <div className="pt-2">
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* TTS Status & Generate */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-muted-foreground">
                    خدمة TTS غير متصلة حالياً
                  </span>
                </div>
                <Button onClick={handleGenerateAudio} variant="outline" size="sm">
                  <Volume2 className="w-4 h-4 ml-1" />
                  توليد الصوت
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ─── Video Assembly ────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-sm">تجميع الفيديو</CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Resolution */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">الدقة</label>
                  <div className="flex gap-2">
                    {(Object.keys(resolutionLabels) as Resolution[]).map((r) => (
                      <Button
                        key={r}
                        variant={resolution === r ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs flex-1"
                        onClick={() => setResolution(r)}
                      >
                        {resolutionLabels[r]}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Background Style */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">نمط الخلفية</label>
                  <div className="flex gap-2">
                    {(Object.keys(bgStyleLabels) as BgStyle[]).map((b) => (
                      <Button
                        key={b}
                        variant={bgStyle === b ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs flex-1"
                        onClick={() => setBgStyle(b)}
                      >
                        {bgStyleLabels[b]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button onClick={handleGenerateVideo} variant="outline">
                <MonitorPlay className="w-4 h-4 ml-2" />
                توليد الفيديو
              </Button>

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  يمكنك استخدام <strong className="text-foreground">Foocus</strong> لتوليد خلفيات وصور مخصصة للفيديو.
                  قم بتوليد الصور أولاً ثم استخدمها في تجميع الفيديو.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Tools Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-16">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-sm">الأدوات المتاحة</CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-3">
              <ScrollArea className="max-h-[calc(100vh-16rem)]">
                <div className="space-y-3">
                  {availableTools.map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg border space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className={`text-xs font-medium ${tool.color}`}>
                          {tool.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground pr-5">
                        {tool.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 pr-5 leading-relaxed">
                        💡 {tool.instructions}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}