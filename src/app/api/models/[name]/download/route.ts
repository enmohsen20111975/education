import { NextResponse } from 'next/server';
import { pullOllamaModel } from '@/lib/llm-client';

// POST /api/models/[name]/download — Download an Ollama model
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    if (!name) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const result = await pullOllamaModel(name);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error downloading model:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to download model' },
      { status: 500 }
    );
  }
}