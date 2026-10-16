import mammoth from 'mammoth';
import ExcelJS from 'exceljs';
import Tesseract from 'tesseract.js';

// pdf-parse reads a test file during module init when bundled by Next.js.
// Dynamic require at call-time (not import-time) sidesteps the issue.
// serverExternalPackages in next.config.ts is the belt; this is the suspenders.
async function parsePdf(buffer: Buffer): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    return data.text.trim();
}

// Use Gemini 2.5 Flash (multimodal, stable) to extract text AND describe visual elements.
// Returns empty string only if the API key is missing — otherwise throws so the caller
// can log what went wrong and decide whether to fall back.
async function extractWithGeminiVision(buffer: Buffer, mimeType: string): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('[vision] GOOGLE_API_KEY is missing — skipping Gemini Vision');
        return '';
    }

    // Gemini inline_data hard limit is 20 MB after base64 encoding (~15 MB raw).
    const MAX_BYTES = 15 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
        console.warn(`[vision] File too large for inline Vision (${(buffer.length / 1e6).toFixed(1)} MB > 15 MB), falling back`);
        return '';
    }

    console.log(`[vision] Calling gemini-2.5-flash, mimeType=${mimeType}, size=${(buffer.length / 1024).toFixed(0)} KB`);

    const base64 = buffer.toString('base64');

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { inline_data: { mime_type: mimeType, data: base64 } },
                        {
                            text: 'Extract ALL readable text from this document exactly as written. Then add a section "Visual elements:" and describe any non-text content you see (charts, graphs, images, tables, colours, layout, icons, signatures, logos). Be thorough and structured.'
                        }
                    ]
                }]
            })
        }
    );

    const responseText = await res.text();
    console.log(`[vision] Response status=${res.status}, body=${responseText.slice(0, 400)}`);

    if (!res.ok) {
        throw new Error(`Gemini Vision API ${res.status}: ${responseText.slice(0, 200)}`);
    }

    const data = JSON.parse(responseText);

    if (data.promptFeedback?.blockReason) {
        throw new Error(`Gemini Vision blocked: ${data.promptFeedback.blockReason}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) {
        const finishReason = data.candidates?.[0]?.finishReason ?? 'unknown';
        throw new Error(`Gemini Vision returned no text (finishReason: ${finishReason})`);
    }

    console.log(`[vision] Extracted ${text.length} chars`);
    return text;
}

const TEXT_EXTENSIONS = ['.txt', '.md', '.py', '.js', '.ts', '.tsx', '.json', '.csv', '.xml', '.yaml', '.yml'];
const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|bmp|tiff?|webp)$/i;

export async function extractTextFromFile(file: File): Promise<string> {
    const name = (file.name ?? '').toLowerCase();
    const type = (file.type ?? '').toLowerCase();

    try {
        // ── Plain text / code ──────────────────────────────────────────────
        if (type.startsWith('text/') || TEXT_EXTENSIONS.some(ext => name.endsWith(ext))) {
            return await file.text();
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // ── Word document ──────────────────────────────────────────────────
        if (name.endsWith('.docx')) {
            const { value } = await mammoth.extractRawText({ buffer });
            return value;
        }

        // ── Excel spreadsheet ──────────────────────────────────────────────
        if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(await file.arrayBuffer());
            let out = '';
            workbook.eachSheet((ws) => {
                out += `\n--- Sheet: ${ws.name} ---\n`;
                ws.eachRow((row) => {
                    const cells: string[] = [];
                    row.eachCell((cell) => cells.push(cell.text || cell.value?.toString() || ''));
                    out += cells.join(',') + '\n';
                });
            });
            return out;
        }

        // ── PDF — Gemini Vision (text + visual) with pdf-parse text fallback ──
        if (name.endsWith('.pdf') || type === 'application/pdf') {
            try {
                const geminiText = await extractWithGeminiVision(buffer, 'application/pdf');
                if (geminiText.trim()) return geminiText;
            } catch (visionErr) {
                console.error(`[vision] PDF Vision failed for "${file.name}":`, visionErr);
            }
            console.log(`[extract] Falling back to pdf-parse for "${file.name}"`);
            return await parsePdf(buffer);
        }

        // ── Images — Gemini Vision (text + visual) with Tesseract OCR fallback ─
        if (type.startsWith('image/') || IMAGE_EXTENSIONS.test(name)) {
            const imageMime = type.startsWith('image/') ? type.split(';')[0] : 'image/jpeg';
            try {
                const geminiText = await extractWithGeminiVision(buffer, imageMime);
                if (geminiText.trim()) return geminiText;
            } catch (visionErr) {
                console.error(`[vision] Image Vision failed for "${file.name}":`, visionErr);
            }
            console.log(`[extract] Falling back to Tesseract OCR for "${file.name}"`);
            const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
            return text;
        }

        // ── Fallback: try reading as UTF-8 text ────────────────────────────
        return await file.text();

    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`extractTextFromFile failed for "${file.name}":`, err);
        return `[Error processing ${file.name}: ${msg}]`;
    }
}
