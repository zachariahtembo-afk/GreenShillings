import { NextRequest, NextResponse } from 'next/server';
import { requestHumanHandoff } from '@/lib/api/services/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 },
      );
    }

    const reason = body.reason || 'User requested human assistance';

    const result = await requestHumanHandoff(conversationId, reason);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in escalation endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
