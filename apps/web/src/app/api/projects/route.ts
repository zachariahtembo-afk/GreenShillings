import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public endpoint - used by public-facing pages
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { communities: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
