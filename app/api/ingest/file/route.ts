import { NextRequest, NextResponse } from 'next/server';
import { ragSystem } from '@/lib/rag/rag-system';
import { extractTextFromFile } from '@/lib/ingestion/extract-text';

export const runtime = 'nodejs';

const MAX_FILE_MB = 10;
// Preview sent back to client so the chat can inject it directly into the prompt
const PREVIEW_CHARS = 3_000;

export async function POST(req: NextRequest) {
    try {
        if (!ragSystem.isInitialized) {
            await ragSystem.initialize();
        }

        const form = await req.formData();
        const files = form.getAll('files') as File[];

        if (!files.length) {
            return NextResponse.json({ error: 'No files received' }, { status: 400 });
        }

        let ingested = 0;
        const results: { name: string; status: string; preview?: string }[] = [];

        for (const file of files) {
            const sizeMb = file.size / (1024 * 1024);

            if (sizeMb > MAX_FILE_MB) {
                results.push({ name: file.name, status: `skipped — too large (${sizeMb.toFixed(1)} MB)` });
                continue;
            }

            try {
                const text = (await extractTextFromFile(file)).slice(0, 300_000);

                if (!text.trim()) {
                    results.push({ name: file.name, status: 'skipped — no text found' });
                    continue;
                }

                await ragSystem.addTextDocument({
                    content: text,
                    title: file.name,
                    type: 'note',
                    temporary: true,
                });

                // Return the first PREVIEW_CHARS so the client can inject content
                // directly into the chat API payload (more reliable than RAG lookup alone)
                results.push({ name: file.name, status: 'ok', preview: text.slice(0, PREVIEW_CHARS) });
                ingested++;
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Unknown error';
                results.push({ name: file.name, status: `error: ${msg}` });
                console.error(`Failed to process ${file.name}:`, err);
            }
        }

        return NextResponse.json({ status: 'ok', ingested, results });

    } catch (err: any) {
        console.error('Ingest route error:', err);
        return NextResponse.json({ error: err?.message ?? 'Upload error' }, { status: 500 });
    }
}
