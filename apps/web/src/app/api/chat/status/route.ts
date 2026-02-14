import { NextResponse } from 'next/server';
import { isOpenAIEnabled, SUGGESTED_QUESTIONS } from '@/lib/api/services/openai';

export function GET() {
  return NextResponse.json({
    data: {
      enabled: isOpenAIEnabled(),
      suggestedQuestions: SUGGESTED_QUESTIONS,
      rateLimit: {
        publicLimit: 3,
        windowHours: 24,
        partnersUnlimited: true,
      },
    },
  });
}
