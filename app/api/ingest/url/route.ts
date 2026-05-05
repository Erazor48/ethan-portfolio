import { NextRequest, NextResponse } from 'next/server';
import { ragSystem } from '@/lib/rag/rag-system';

export async function POST(req: NextRequest) {
    try {
        const { url, title } = await req.json();
        if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });
        const res = await fetch(url);
        if (!res.ok) return NextResponse.json({ error: `Fetch failed ${res.status}` }, { status: 502 });
        const text = (await res.text()).slice(0, 8000);
        await ragSystem.addTextDocument({ content: text, title: title || url, type: 'url', sourceUrl: url, temporary: true });
        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}












