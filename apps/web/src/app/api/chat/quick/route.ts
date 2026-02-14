import { NextRequest, NextResponse } from 'next/server';
import { quickAnswer } from '@/lib/api/services/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'question is required' },
        { status: 400 },
      );
    }

    const result = await quickAnswer(question);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in quick answer endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
