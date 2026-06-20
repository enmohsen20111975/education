import { NextResponse } from 'next/server';
import { listOllamaModels } from '@/lib/llm-client';

// GET /api/models/required — Return list of required/recommended models with status
export async function GET() {
  try {
    const downloadedModels = await listOllamaModels().catch(() => []);

    const requiredModels = [
      {
        name: 'qwen2.5-vl:7b',
        source: 'ollama',
        purpose: 'نموذج رؤية لاستخراج النص من الصور',
        size: '4.5 GB',
        required: false,
        downloaded: downloadedModels.some((m) =>
          m.name.includes('qwen2.5-vl')
        ),
        command: 'ollama pull qwen2.5-vl:7b',
      },
      {
        name: 'llava:7b',
        source: 'ollama',
        purpose: 'نموذج رؤية بديل',
        size: '4.7 GB',
        required: false,
        downloaded: downloadedModels.some((m) =>
          m.name.includes('llava')
        ),
        command: 'ollama pull llava:7b',
      },
    ];

    return NextResponse.json(requiredModels);
  } catch (error) {
    console.error('Error fetching required models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch required models' },
      { status: 500 }
    );
  }
}