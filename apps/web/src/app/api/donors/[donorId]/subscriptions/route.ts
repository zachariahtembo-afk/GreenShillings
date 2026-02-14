import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ donorId: string }> },
) {
  try {
    const { donorId } = await params;

    const subscriptions = await prisma.donorSubscription.findMany({
      where: { donorId, isActive: true },
      orderBy: { subscribedAt: 'desc' },
    });

    return NextResponse.json({ data: subscriptions });
  } catch (error) {
    console.error('Error fetching donor subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ donorId: string }> },
) {
  try {
    const { donorId } = await params;
    const body = await request.json();

    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 },
      );
    }

    // Verify donor exists
    const donor = await prisma.donor.findUnique({ where: { id: donorId } });
    if (!donor) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }

    const subscription = await prisma.donorSubscription.upsert({
      where: {
        donorId_projectId: { donorId, projectId },
      },
      create: {
        donorId,
        projectId,
        isActive: true,
      },
      update: {
        isActive: true,
      },
    });

    return NextResponse.json({ data: subscription }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing donor to project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
