import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const outputs = await prisma.advocacyOutput.findMany({
      orderBy: { publicationDate: 'desc' },
    });

    return NextResponse.json({ data: outputs });
  } catch (error) {
    console.error('Error fetching advocacy outputs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
