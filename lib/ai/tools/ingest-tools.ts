import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { ragSystem } from '../../rag/rag-system';

export class IngestTextTool extends StructuredTool {
    name = 'ingest_text';
    description = 'Ingest arbitrary text into the knowledge base (RAG) as a temporary note.';
    schema = z.object({
        title: z.string().min(1),
        content: z.string().min(1),
    });
    async _call(input: z.infer<typeof this.schema>) {
        const doc = await ragSystem.addTextDocument({
            content: input.content,
            title: input.title,
            type: 'note',
            temporary: true,
        });
        return JSON.stringify({ status: 'ok', id: doc.metadata.id, title: input.title });
    }
}

export class IngestUrlTool extends StructuredTool {
    name = 'ingest_url';
    description = 'Fetch and ingest content from a URL into the knowledge base (RAG).';
    schema = z.object({ url: z.string().url(), title: z.string().optional() });
    async _call(input: z.infer<typeof this.schema>) {
        const res = await fetch(input.url);
        if (!res.ok) {
            return `Failed to fetch URL (HTTP ${res.status})`;
        }
        const text = (await res.text()).slice(0, 8000);
        const doc = await ragSystem.addTextDocument({
            content: text,
            title: input.title || input.url,
            type: 'url',
            sourceUrl: input.url,
            temporary: true,
        });
        return JSON.stringify({ status: 'ok', id: doc.metadata.id, url: input.url });
    }
}

export class IngestTranscriptTool extends StructuredTool {
    name = 'ingest_transcript';
    description = 'Ingest a speech transcript (already text) into the knowledge base (RAG).';
    schema = z.object({ title: z.string().min(1), transcript: z.string().min(1) });
    async _call(input: z.infer<typeof this.schema>) {
        const doc = await ragSystem.addTextDocument({
            content: input.transcript,
            title: input.title,
            type: 'transcript',
            temporary: true,
        });
        return JSON.stringify({ status: 'ok', id: doc.metadata.id, title: input.title });
    }
}

export const ingestTools = [new IngestTextTool(), new IngestUrlTool(), new IngestTranscriptTool()];












