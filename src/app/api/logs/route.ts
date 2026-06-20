import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'data', 'factory-logs.json');

async function readLogs() {
  try {
    const data = await fs.readFile(LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeLogs(logs: unknown[]) {
  const dir = path.dirname(LOGS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(LOGS_FILE, JSON.stringify(logs.slice(0, 500), null, 2));
}

// GET /api/logs
export async function GET() {
  try {
    const logs = await readLogs();
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}

// POST /api/logs — Add a log entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const logs = await readLogs();
    const entry = {
      id: crypto.randomUUID(),
      type: body.type || 'info',
      message: body.message || '',
      timestamp: new Date().toISOString(),
      bookId: body.bookId || null,
    };
    logs.unshift(entry);
    await writeLogs(logs);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Error adding log:', error);
    return NextResponse.json({ error: 'Failed to add log' }, { status: 500 });
  }
}

// DELETE /api/logs — Clear all logs
export async function DELETE() {
  try {
    await writeLogs([]);
    return NextResponse.json({ message: 'Logs cleared' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}
