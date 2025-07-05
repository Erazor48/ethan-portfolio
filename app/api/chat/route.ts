import { NextRequest, NextResponse } from 'next/server';
import { MCPSystem } from '@/lib/ai/mcp-system';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - simple implementation
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `chat:${clientIP}`;
    
    // Basic validation
    const body = await request.json();
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request format. Messages array is required.' },
        { status: 400 }
      );
    }

    // Validate messages structure
    const messages = body.messages.map((msg: any) => {
      if (!msg.content || typeof msg.content !== 'string') {
        throw new Error('Invalid message format');
      }
      if (!['user', 'assistant'].includes(msg.role)) {
        throw new Error('Invalid message role');
      }
      return {
        role: msg.role as 'user' | 'assistant',
        content: msg.content.trim()
      };
    });

    // Check message length
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.content.length > 500) {
      return NextResponse.json(
        { error: 'Message too long. Maximum 500 characters allowed.' },
        { status: 400 }
      );
    }

    // Check if last message is from user
    if (lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user.' },
        { status: 500 }
      );
    }

    // Initialize MCP System
    const mcpSystem = new MCPSystem();
    
    // Process message with MCP System
    const response = await mcpSystem.processMessage(messages);

    return NextResponse.json({
      message: response.message,
      tools_used: response.tools_used,
      confidence: response.confidence,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      },
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