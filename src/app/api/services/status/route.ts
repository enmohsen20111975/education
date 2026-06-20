import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkPort(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}/`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function checkTesseract(): Promise<{ available: boolean; message: string }> {
  try {
    const { stdout } = await execAsync('tesseract --version 2>&1');
    return {
      available: true,
      message: stdout.split('\n')[0] || 'Tesseract is installed',
    };
  } catch {
    return {
      available: false,
      message: 'Tesseract OCR is not installed',
    };
  }
}

// GET /api/services/status — Check all services status
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [lmstudioAvailable, ollamaAvailable, tesseract] = await Promise.all([
      checkPort(1234),
      checkPort(11434),
      checkTesseract(),
    ]);

    const services = [
      {
        name: 'LM Studio',
        available: lmstudioAvailable,
        message: lmstudioAvailable
          ? 'LM Studio is running on port 1234'
          : 'LM Studio is not running',
        port: 1234,
      },
      {
        name: 'Ollama',
        available: ollamaAvailable,
        message: ollamaAvailable
          ? 'Ollama is running on port 11434'
          : 'Ollama is not running',
        port: 11434,
      },
      {
        name: 'Tesseract',
        available: tesseract.available,
        message: tesseract.message,
      },
    ];

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error checking services:', error);
    return NextResponse.json(
      { error: 'Failed to check services' },
      { status: 500 }
    );
  }
}