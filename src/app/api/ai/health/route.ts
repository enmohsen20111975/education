import { NextResponse } from 'next/server';
import { lmStudioHealth } from '@/lib/ai/lm-studio';
import { ollamaHealth } from '@/lib/ai/ollama';
import { getFullSystemHealth } from '@/lib/ai/model-router';

/**
 * نقطة نهاية فحص حالة خدمات الذكاء الاصطناعي
 * AI services health check endpoint
 *
 * GET /api/ai/health
 *
 * يُرجع حالة LM Studio و Ollama ومعلومات النظام
 * Returns the status of LM Studio, Ollama, and system information
 */
export async function GET() {
  try {
    const health = await getFullSystemHealth();

    return NextResponse.json(
      {
        lmStudio: {
          available: health.lmStudio.available,
          model: health.lmStudio.model,
          vram: health.lmStudio.vram,
          error: health.lmStudio.error,
        },
        ollama: {
          available: health.ollama.available,
          models: health.ollama.models,
          vram: health.ollama.vram,
          error: health.ollama.error,
        },
        system: {
          gpuAvailable: health.system.gpuAvailable,
          ramFree: health.system.ramFree,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    // في حالة فشل الفحص الشامل، نحاول فحص كل خدمة على حدة
    const message = error instanceof Error ? error.message : String(error);

    let lmStudioStatus;
    let ollamaStatus;

    try {
      lmStudioStatus = await lmStudioHealth();
    } catch {
      lmStudioStatus = { available: false, model: '', error: 'فشل الفحص / Check failed' };
    }

    try {
      ollamaStatus = await ollamaHealth();
    } catch {
      ollamaStatus = { available: false, models: [], error: 'فشل الفحص / Check failed' };
    }

    return NextResponse.json(
      {
        lmStudio: {
          available: lmStudioStatus.available,
          model: lmStudioStatus.model,
          vram: lmStudioStatus.vram,
          error: lmStudioStatus.error,
        },
        ollama: {
          available: ollamaStatus.available,
          models: ollamaStatus.models,
          vram: ollamaStatus.vram,
          error: ollamaStatus.error,
        },
        system: {
          gpuAvailable: false,
          ramFree: 'غير متاح / N/A',
          error: message,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 503, // Service Unavailable
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}