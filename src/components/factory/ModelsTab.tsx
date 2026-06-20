'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Server, Wifi, WifiOff, RefreshCw, Download, Loader2,
  Package, Bot, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ServiceStatus {
  name: string;
  label: string;
  connected: boolean;
  port: number;
  availableModels: ModelInfo[];
}

interface ModelInfo {
  name: string;
  size: string;
  type: string;
}

interface RequiredModel {
  name: string;
  service: string;
  purpose: string;
  size: string;
  downloadStatus: 'available' | 'downloading' | 'installed' | 'error';
  command?: string;
}

const requiredModels: RequiredModel[] = [
  {
    name: 'qwen2.5-vl:7b',
    service: 'Ollama',
    purpose: 'نموذج رؤية لفهم صور الكتب',
    size: '4.5 GB',
    downloadStatus: 'available',
    command: 'ollama pull qwen2.5-vl:7b',
  },
  {
    name: 'llava:7b',
    service: 'Ollama',
    purpose: 'نموذج رؤية بديل',
    size: '4.7 GB',
    downloadStatus: 'available',
    command: 'ollama pull llava:7b',
  },
  {
    name: 'minicpm-v:8b',
    service: 'Ollama',
    purpose: 'نموذج رؤية خفيف',
    size: '4.6 GB',
    downloadStatus: 'available',
    command: 'ollama pull minicpm-v:8b',
  },
  {
    name: 'qwen2.5:14b',
    service: 'Ollama',
    purpose: 'نموذج نصي أكبر لتنظيم أفضل',
    size: '9 GB',
    downloadStatus: 'available',
    command: 'ollama pull qwen2.5:14b',
  },
  {
    name: 'tesseract-ocr',
    service: 'System',
    purpose: 'محرك OCR للنصوص العربية',
    size: 'حزمة نظام',
    downloadStatus: 'available',
    command: 'sudo apt install tesseract-ocr tesseract-ocr-ara',
  },
];

export default function ModelsTab() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/services/status');
      if (res.ok) {
        const data = await res.json();
        const servicesList = Array.isArray(data) ? data : data.services || [];
        setServices(servicesList.map((s: any) => ({
          name: s.name?.toLowerCase().replace(/\s+/g, '-') || s.name,
          label: s.name,
          connected: s.available ?? s.connected ?? false,
          port: s.port || 0,
          availableModels: s.availableModels || [],
        })));
      }
    } catch {
      // Use default if API is not available
      setServices([
        { name: 'lm-studio', label: 'LM Studio', connected: false, port: 1234, availableModels: [] },
        { name: 'ollama', label: 'Ollama', connected: false, port: 11434, availableModels: [] },
        { name: 'tesseract', label: 'Tesseract OCR', connected: false, port: 0, availableModels: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleDownload = async (model: RequiredModel) => {
    setDownloadingModel(model.name);
    try {
      const res = await fetch(`/api/models/${model.name}/download`, { method: 'POST' });
      if (res.ok) {
        toast.success(`بدأ تحميل ${model.name}`);
      } else {
        toast.error('فشل في بدء التحميل');
      }
    } catch {
      toast.error('حدث خطأ أثناء التحميل');
    } finally {
      setDownloadingModel(null);
    }
  };

  const serviceIcons: Record<string, React.ReactNode> = {
    'lm-studio': <Bot className="w-5 h-5" />,
    'ollama': <Package className="w-5 h-5" />,
    'tesseract': <Eye className="w-5 h-5" />,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-8 w-48 mt-8" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Service Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">حالة الخدمات</h2>
          <Button variant="outline" size="sm" onClick={fetchStatus}>
            <RefreshCw className="w-4 h-4 ml-1" />
            تحديث
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service.connected ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                        {serviceIcons[service.name] || <Server className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{service.label}</h3>
                        <p className="text-xs text-muted-foreground">
                          {service.name === 'tesseract' ? 'محرك OCR' : 'الذكاء الاصطناعي المحلي'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${service.connected ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'}`}
                    >
                      {service.connected ? (
                        <><Wifi className="w-3 h-3 ml-1" /> متصل</>
                      ) : (
                        <><WifiOff className="w-3 h-3 ml-1" /> غير متصل</>
                      )}
                    </Badge>
                  </div>
                  {service.port > 0 && (
                    <p className="text-xs text-muted-foreground">
                      المنفذ: {service.port}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Available Models */}
      {services.some((s) => s.connected && s.availableModels.length > 0) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">النماذج المتاحة</h2>
          <div className="space-y-2">
            {services.map((service) =>
              service.connected && service.availableModels.length > 0 ? (
                <Card key={`models-${service.name}`}>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-2">{service.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.availableModels.map((model) => (
                        <Badge key={model.name} variant="outline" className="text-xs gap-1">
                          <Package className="w-3 h-3" />
                          {model.name}
                          <span className="text-muted-foreground">({model.size})</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null
            )}
          </div>
        </div>
      )}

      {services.some((s) => s.connected && s.availableModels.length > 0) && <Separator />}

      {/* Required Models */}
      <div>
        <h2 className="text-lg font-semibold mb-4">النماذج المطلوبة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-sm">{model.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {model.service}
                      </Badge>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        model.downloadStatus === 'installed'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : model.downloadStatus === 'downloading'
                          ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                          : 'bg-gray-500/15 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {model.downloadStatus === 'installed' ? 'مثبّت' : model.downloadStatus === 'downloading' ? 'جارٍ التحميل' : 'غير مثبّت'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{model.purpose}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{model.size}</span>
                    <div className="flex items-center gap-2">
                      {model.command && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(model.command!);
                            toast.success('تم نسخ الأمر');
                          }}
                        >
                          تحميل عبر الأوامر
                        </Button>
                      )}
                      {model.downloadStatus === 'available' && model.service !== 'System' && (
                        <Button
                          size="sm"
                          className="text-xs"
                          onClick={() => handleDownload(model)}
                          disabled={downloadingModel === model.name}
                        >
                          {downloadingModel === model.name ? (
                            <Loader2 className="w-3.5 h-3.5 ml-1 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5 ml-1" />
                          )}
                          تحميل
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}