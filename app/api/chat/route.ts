import { NextRequest, NextResponse } from 'next/server';
import { chatbotService } from '@/lib/services/chatbot-service';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    const response = await chatbotService.generateResponse(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Erreur API chatbot:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quickFacts = await chatbotService.getQuickFacts();
    return NextResponse.json({ quickFacts });
  } catch (error) {
    console.error('Erreur API quick facts:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 