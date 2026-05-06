import mammoth from 'mammoth';
import ExcelJS from 'exceljs';
import Tesseract from 'tesseract.js';

// pdf-parse reads a test file during module init when bundled by Next.js.
// Dynamic require at call-time (not import-time) sidesteps the issue.
// serverExternalPackages in next.config.ts is the belt; this is the suspenders.
async function parsePdf(buffer: Buffer): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    return data.text.trim();
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
            // Pass the ArrayBuffer directly — cleaner than slicing Buffer internals
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

        // ── PDF ────────────────────────────────────────────────────────────
        if (name.endsWith('.pdf') || type === 'application/pdf') {
            return await parsePdf(buffer);
        }

        // ── Images — OCR ───────────────────────────────────────────────────
        if (type.startsWith('image/') || IMAGE_EXTENSIONS.test(name)) {
            const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
            return text;
        }

        // ── Fallback: try reading as UTF-8 text ────────────────────────────
        return await file.text();

    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`extractTextFromFile failed for "${file.name}":`, err);
        // Return a descriptive error instead of throwing so one bad file
        // doesn't abort the whole batch.
        return `[Error processing ${file.name}: ${msg}]`;
    }
}
