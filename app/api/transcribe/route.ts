import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) return NextResponse.json({ error: 'Missing GOOGLE_API_KEY' }, { status: 500 });

        const form = await req.formData();
        const file = form.get('audio') as File | null;
        if (!file) return NextResponse.json({ error: 'Missing audio file' }, { status: 400 });

        const audioBuffer = Buffer.from(await file.arrayBuffer());
        console.log(`[transcribe] received audio: ${audioBuffer.length} bytes, type: ${file.type}`);

        if (audioBuffer.length === 0) {
            return NextResponse.json({ error: 'Audio file is empty' }, { status: 400 });
        }

        const audioBase64 = audioBuffer.toString('base64');
        // Strip codec params — Gemini rejects "audio/webm;codecs=opus"
        const mimeType = (file.type || 'audio/webm').split(';')[0];
        console.log(`[transcribe] sending to Gemini, mimeType=${mimeType}, base64 size=${audioBase64.length}`);

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: audioBase64,
                                }
                            },
                            {
                                text: 'Transcribe this audio recording exactly as spoken. Return only the transcribed text, no commentary, no formatting.'
                            }
                        ]
                    }]
                })
            }
        );

        const geminiData = await geminiRes.json();
        console.log(`[transcribe] Gemini status=${geminiRes.status}`, JSON.stringify(geminiData).slice(0, 500));

        if (!geminiRes.ok) {
            const errMsg = geminiData?.error?.message || `Gemini API error ${geminiRes.status}`;
            throw new Error(errMsg);
        }

        // Safety block check
        if (geminiData.promptFeedback?.blockReason) {
            throw new Error(`Blocked by safety filter: ${geminiData.promptFeedback.blockReason}`);
        }

        const candidate = geminiData.candidates?.[0];
        if (!candidate?.content) {
            const finishReason = candidate?.finishReason ?? 'unknown';
            throw new Error(`No transcription returned (finishReason: ${finishReason})`);
        }

        const text = candidate.content.parts?.[0]?.text ?? '';
        console.log(`[transcribe] success, text length=${text.length}`);

        return NextResponse.json({ text: text.trim() });
    } catch (error: any) {
        console.error('[transcribe] error:', error);
        return NextResponse.json({ error: error?.message || 'Transcription error' }, { status: 500 });
    }
}
