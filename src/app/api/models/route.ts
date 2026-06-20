import { NextResponse } from 'next/server';
import {
  checkServiceHealth,
  listLMStudioModels,
  listOllamaModels,
} from '@/lib/llm-client';

// GET /api/models — Get all model info from available services
export async function GET() {
  try {
    const [lmstudioHealth, ollamaHealth] = await Promise.allSettled([
      checkServiceHealth('lmstudio'),
      checkServiceHealth('ollama'),
    ]);

    const lmstudioAvailable =
      lmstudioHealth.status === 'fulfilled' && lmstudioHealth.value.available;
    const ollamaAvailable =
      ollamaHealth.status === 'fulfilled' && ollamaHealth.value.available;

    const [lmstudioModels, ollamaModels] = await Promise.allSettled([
      listLMStudioModels(),
      listOllamaModels(),
    ]);

    return NextResponse.json({
      lmstudio: {
        available: lmstudioAvailable,
        models:
          lmstudioModels.status === 'fulfilled' ? lmstudioModels.value : [],
      },
      ollama: {
        available: ollamaAvailable,
        models:
          ollamaModels.status === 'fulfilled' ? ollamaModels.value : [],
      },
      required: [
        {
          name: 'qwen2.5-vl:7b',
          source: 'ollama',
          size: '4.5 GB',
          command: 'ollama pull qwen2.5-vl:7b',
          downloaded:
            ollamaModels.status === 'fulfilled' &&
            ollamaModels.value.some((m) => m.name.includes('qwen2.5-vl')),
        },
        {
          name: 'llava:7b',
          source: 'ollama',
          size: '4.7 GB',
          command: 'ollama pull llava:7b',
          downloaded:
            ollamaModels.status === 'fulfilled' &&
            ollamaModels.value.some((m) => m.name.includes('llava')),
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}