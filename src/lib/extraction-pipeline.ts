/**
 * Extraction Pipeline — Server-side only
 *
 * Orchestrates the full Book → Structured Content workflow:
 *  1. `processBookOCR`   — PDF pages → Tesseract OCR → BookPage records
 *  2. `processBookWithLLM` — Raw OCR text → LLM structuring → ExtractedUnit / ExtractedLesson records
 */

import { PrismaClient } from '@prisma/client';
import { extractTextFromPDF } from '@/lib/ocr';
import { chatWithLM } from '@/lib/llm-client';
import { v4 as uuidv4 } from 'uuid';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LLMUnit {
  unitNumber: number;
  titleAr: string;
  titleEn: string;
  description: string;
  lessons: LLMLesson[];
}

interface LLMLesson {
  lessonNumber: number;
  titleAr: string;
  titleEn: string;
  content: string;
  summary: string;
  keyPoints: string[];
}

interface LLMParseResult {
  units: LLMUnit[];
}

// ---------------------------------------------------------------------------
// 1. OCR Extraction
// ---------------------------------------------------------------------------

/**
 * Run full OCR extraction for a book.
 *
 * For each page of the PDF:
 *  1. Create a `BookPage` record (status = 'processing')
 *  2. Run Tesseract OCR on the rendered page image
 *  3. Save the extracted text to the record (status = 'done')
 *  4. Update the parent `Book` progress
 *
 * On completion the book status is set to `'extracted'`.
 * On any unrecoverable error the book status is set to `'error'`.
 */
export async function processBookOCR(
  bookId: string,
  db: PrismaClient,
): Promise<void> {
  // Fetch book — throws if not found
  const book = await db.book.findUniqueOrThrow({ where: { id: bookId } });

  // Guard: don't re-extract a completed book
  if (book.status === 'completed' || book.status === 'extracted') {
    return;
  }

  try {
    // Mark book as extracting
    await db.book.update({
      where: { id: bookId },
      data: { status: 'extracting', progress: 0, error: null },
    });

    // Run Tesseract on every page
    const pages = await extractTextFromPDF(book.filePath, book.language || 'ara');
    const total = pages.length;

    for (let idx = 0; idx < total; idx++) {
      const page = pages[idx];

      // Upsert the page record
      await db.bookPage.upsert({
        where: { bookId_pageNumber: { bookId, pageNumber: page.pageNumber } },
        create: {
          bookId,
          pageNumber: page.pageNumber,
          ocrText: page.text,
          status: 'done',
        },
        update: {
          ocrText: page.text,
          status: 'done',
        },
      });

      // Update overall book progress (0 → 100 across OCR phase)
      const progressPct = Math.round(((idx + 1) / total) * 100);
      await db.book.update({
        where: { id: bookId },
        data: { progress: progressPct },
      });
    }

    // Update total page count and mark extraction complete
    await db.book.update({
      where: { id: bookId },
      data: { status: 'extracted', totalPages: total, progress: 100 },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db.book.update({
      where: { id: bookId },
      data: { status: 'error', error: `OCR extraction failed: ${message}` },
    });
    throw err; // re-throw so the caller can handle
  }
}

// ---------------------------------------------------------------------------
// 2. LLM Structuring
// ---------------------------------------------------------------------------

/**
 * Process a book's OCR text with an LLM to produce structured units & lessons.
 *
 * 1. Collect all page text ordered by page number
 * 2. Send a structured prompt to the LLM (preferring LM Studio / qwen2.5-7b)
 * 3. Parse the JSON response
 * 4. Persist `ExtractedUnit` and `ExtractedLesson` records
 *
 * On completion the book status is set to `'completed'`.
 */
export async function processBookWithLLM(
  bookId: string,
  db: PrismaClient,
): Promise<void> {
  const book = await db.book.findUniqueOrThrow({ where: { id: bookId } });

  // Require OCR to be done first
  if (book.status !== 'extracted') {
    throw new Error(`Book "${bookId}" must be in 'extracted' status before LLM processing`);
  }

  try {
    await db.book.update({
      where: { id: bookId },
      data: { status: 'processing', progress: 0, error: null },
    });

    // 1. Gather raw text from all pages (ordered)
    const bookPages = await db.bookPage.findMany({
      where: { bookId },
      orderBy: { pageNumber: 'asc' },
    });

    const rawText = bookPages
      .map((p) => `--- صفحة ${p.pageNumber} ---\n${p.ocrText}`)
      .join('\n\n');

    if (!rawText.trim()) {
      throw new Error('No OCR text found — cannot process with LLM');
    }

    // 2. Generate the structuring prompt
    const prompt = generateStructurePrompt(rawText, book.title);

    // 3. Call the LLM (prefer LM Studio with qwen2.5-7b)
    const llmResponse = await chatWithLM(prompt, undefined, {
      service: 'lmstudio',
      model: 'qwen2.5-7b',
      temperature: 0.2,
    });

    // 4. Parse JSON from the LLM response
    const parsed = parseLLMResponse(llmResponse);

    // 5. Delete any previously extracted units (idempotent re-run)
    await db.extractedLesson.deleteMany({
      where: { unit: { bookId } },
    });
    await db.extractedUnit.deleteMany({
      where: { bookId },
    });

    // 6. Persist units & lessons
    const totalUnits = parsed.units.length;

    for (let uIdx = 0; uIdx < totalUnits; uIdx++) {
      const unitData = parsed.units[uIdx];

      const unit = await db.extractedUnit.create({
        data: {
          id: uuidv4(),
          bookId,
          unitNumber: unitData.unitNumber,
          titleAr: unitData.titleAr,
          titleEn: unitData.titleEn || '',
          description: unitData.description || '',
          order: unitData.unitNumber,
        },
      });

      // Create lessons for this unit
      const lessons = unitData.lessons ?? [];
      for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
        const lessonData = lessons[lIdx];

        await db.extractedLesson.create({
          data: {
            id: uuidv4(),
            unitId: unit.id,
            lessonNumber: lessonData.lessonNumber,
            titleAr: lessonData.titleAr,
            titleEn: lessonData.titleEn || '',
            content: lessonData.content || '',
            summary: lessonData.summary || '',
            keyPoints: JSON.stringify(lessonData.keyPoints ?? []),
            order: lessonData.lessonNumber,
            status: 'draft',
          },
        });
      }

      // Update progress proportionally
      const progressPct = Math.round(((uIdx + 1) / totalUnits) * 100);
      await db.book.update({
        where: { id: bookId },
        data: { progress: progressPct },
      });
    }

    // Mark book as completed
    await db.book.update({
      where: { id: bookId },
      data: { status: 'completed', progress: 100 },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db.book.update({
      where: { id: bookId },
      data: { status: 'error', error: `LLM processing failed: ${message}` },
    });
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Prompt generation
// ---------------------------------------------------------------------------

/**
 * Build the Arabic-language structuring prompt that asks the LLM to
 * decompose raw OCR text into units, lessons, summaries and key points.
 *
 * The prompt explicitly asks for a valid JSON response with no markdown fences.
 */
export function generateStructurePrompt(
  rawText: string,
  bookTitle: string,
): string {
  return `
أنت مساعد ذكي متخصص في تنظيم المحتوى التعليمي للكتب المدرسية.

المهمة:
لديّ كتاب مدرسي بعنوان "${bookTitle}". النص أدناه مستخرج عبر OCR من صفحات الكتاب المختلفة.
أريد منك تحليل هذا النص وتقسيمه إلى وحدات ودروس بشكل منظم.

التعليمات:
1. حدد الوحدات أو الفصول الرئيسية في الكتاب
2. داخل كل وحدة حدد الدروس الفرعية
3. استخرج أهم النقاط والملخص لكل درس
4. أعد النتيجة كملف JSON فقط بدون أي نص آخر أو markdown fences

الصيغة المطلوبة لل JSON:
{
  "units": [
    {
      "unitNumber": 1,
      "titleAr": "اسم الوحدة بالعربي",
      "titleEn": "اسم الوحدة بالإنجليزي",
      "description": "وصف مختصر للوحدة",
      "lessons": [
        {
          "lessonNumber": 1,
          "titleAr": "عنوان الدرس بالعربي",
          "titleEn": "عنوان الدرس بالإنجليزي",
          "content": "محتوى الدرس الكامل",
          "summary": "ملخص مختصر للدرس",
          "keyPoints": ["نقطة مهمة 1", "نقطة مهمة 2", "نقطة مهمة 3"]
        }
      ]
    }
  ]
}

ملاحظات هامة:
- أجب ب JSON صالح فقط بدون أي نص إضافي
- احتفظ بالنص العربي كما هو دون تغيير
- ترجم العناوين فقط للإنجليزي
- اجعل keyPoints مصفوفة نصوص
- إذا لم تتمكن من تحديد وحدات ودروس واضحة، ضع كل المحتوى في وحدة واحدة ودرس واحد

--- النص المستخرج ---

${rawText}
`.trim();
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Parse the LLM response, stripping markdown fences and extracting valid JSON.
 */
function parseLLMResponse(response: string): LLMParseResult {
  let cleaned = response.trim();

  // Strip common markdown code fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned) as LLMParseResult;
    if (!parsed.units || !Array.isArray(parsed.units)) {
      throw new Error('Missing "units" array in LLM response');
    }
    return parsed;
  } catch (err) {
    // Try a more aggressive extraction: find the first { and last }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as LLMParseResult;
      } catch {
        // fall through to error
      }
    }
    throw new Error(
      `Failed to parse LLM JSON response: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
