/**
 * OCR Utility — Server-side only
 *
 * Extracts text from PDF pages using pdfjs-dist (render → image) + tesseract.js (image → text).
 */

import { createWorker } from 'tesseract.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PageTextResult {
  pageNumber: number;
  text: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Render a single PDF page to a PNG Buffer using pdfjs-dist + @napi-rs/canvas.
 */
async function renderPageToBuffer(
  page: import('pdfjs-dist/types/src/display/api').PDFPageProxy,
  scale = 2.0,
): Promise<Buffer> {
  // Dynamic import for @napi-rs/canvas (native module)
  const { createCanvas } = await import('@napi-rs/canvas');

  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');

  // pdfjs-dist expects a browser-like CanvasRenderingContext2D.
  // @napi-rs/canvas implements the same API so we can pass it directly.
  const canvasContext = ctx as unknown as Parameters<typeof page.render>[0]['canvasContext'];

  await page.render({ canvasContext, viewport }).promise;

  return Buffer.from(canvas.toBuffer('image/png'));
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Extract text from a single page image using Tesseract OCR.
 *
 * @param pageData  PNG / JPEG Buffer of a rendered page
 * @param language  Tesseract language code (default `'ara'`)
 */
export async function extractTextFromPage(
  pageData: Buffer,
  language = 'ara',
): Promise<string> {
  const worker = await createWorker(language);
  try {
    const {
      data: { text },
    } = await worker.recognize(pageData);
    return text;
  } finally {
    await worker.terminate();
  }
}

/**
 * Extract text from every page of a PDF file.
 *
 * Workflow:
 *  1. Load the PDF with pdfjs-dist
 *  2. Render each page to a high-resolution PNG buffer
 *  3. Run Tesseract OCR on every buffer (single reused worker)
 *
 * @param filePath  Absolute path to the PDF on disk
 * @param language  Tesseract language code (default `'ara'`)
 * @returns Array of `{ pageNumber, text }` — one entry per page
 */
export async function extractTextFromPDF(
  filePath: string,
  language = 'ara',
): Promise<PageTextResult[]> {
  // Heavy imports — only loaded when the function is actually called
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const fs = await import('fs');
  const path = await import('path');

  // Point pdfjs to its bundled worker script
  const workerPath = path.join(
    process.cwd(),
    'node_modules',
    'pdfjs-dist',
    'legacy',
    'build',
    'pdf.worker.mjs',
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const totalPages = pdf.numPages;

  // Create a single Tesseract worker and reuse it across all pages
  const worker = await createWorker(language);

  const results: PageTextResult[] = [];

  try {
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const buffer = await renderPageToBuffer(page);

      const {
        data: { text },
      } = await worker.recognize(buffer);

      results.push({ pageNumber: i, text });
    }
  } finally {
    await worker.terminate();
  }

  return results;
}

/**
 * Return the list of OCR languages supported by the application.
 */
export function getSupportedLanguages(): string[] {
  return ['ara', 'eng'];
}
