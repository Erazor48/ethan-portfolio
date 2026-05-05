import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });

        const form = await req.formData();
        const file = form.get('audio') as File | null;
        if (!file) return NextResponse.json({ error: 'Missing audio file' }, { status: 400 });

        const client = new OpenAI({ apiKey });

        // OpenAI SDK v4 accepte un File directement en environnement web-like
        const transcription = await client.audio.transcriptions.create({
            file,
            model: 'whisper-1',
            // response_format: 'json', // text renvoyé dans .text
            temperature: 0.0,
        } as any);

        const text = (transcription as any).text || '';
        return NextResponse.json({ text });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Transcription error' }, { status: 500 });
    }
}
