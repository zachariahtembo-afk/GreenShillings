import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/api/services/openai';
import type { ChatMessage } from '@/lib/api/services/openai';
import { optionalString } from '@/lib/api/helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 },
      );
    }

    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
      : [];
    const sessionId = optionalString(body.sessionId);
    const conversationId = optionalString(body.conversationId);
    const isPartner = body.isPartner === true;

    // Get visitor IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const visitorIp = forwarded?.split(',')[0]?.trim() || 'unknown';

    const result = await chat(message, history, {
      sessionId,
      visitorIp,
      isPartner,
      conversationId,
    });

    if (!result.success) {
      // Rate limit reached — return 200 with limitReached flag so the widget can show CTA
      if (result.error === 'limit_reached') {
        return NextResponse.json({
          data: { message: result.message, limitReached: true, remainingMessages: 0 },
        });
      }
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      data: {
        message: result.message,
        remainingMessages: result.remainingMessages,
        conversationId: result.conversationId,
        limitReached: false,
      },
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
