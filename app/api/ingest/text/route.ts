import { NextRequest, NextResponse } from 'next/server';
import { ragSystem } from '@/lib/rag/rag-system';

export async function POST(req: NextRequest) {
    try {
        const { title, content } = await req.json();
        if (!title || !content) {
            return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
        }
        await ragSystem.addTextDocument({ content: String(content).slice(0, 8000), title: String(title), type: 'note', temporary: true });
        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}












