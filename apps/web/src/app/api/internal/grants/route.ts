import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status ? { status: status as never } : {};

    const proposals = await prisma.proposal.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { project: { select: { name: true } } },
    });

    return NextResponse.json(proposals);
  } catch (err) {
    console.error('GET /api/internal/grants error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const proposal = await prisma.proposal.create({
      data: {
        title: body.title,
        description: body.description || null,
        fundingBody: body.fundingBody || null,
        fundingTarget: body.fundingTarget ? parseFloat(body.fundingTarget) : null,
        currency: body.currency || 'USD',
        priority: body.priority || 'medium',
        assignedTo: body.assignedTo || null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        notes: body.notes || null,
        submittedBy: user.email,
        submittedByName: user.name,
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (err) {
    console.error('POST /api/internal/grants error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
