import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        project: { select: { name: true } },
        documents: true,
        interactions: {
          orderBy: { date: 'desc' },
          include: { contact: true },
        },
      },
    });

    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(proposal);
  } catch (err) {
    console.error('GET /api/internal/grants/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.fundingBody !== undefined && { fundingBody: body.fundingBody }),
        ...(body.fundingTarget !== undefined && { fundingTarget: body.fundingTarget ? parseFloat(body.fundingTarget) : null }),
        ...(body.currency !== undefined && { currency: body.currency }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
        ...(body.deadline !== undefined && { deadline: body.deadline ? new Date(body.deadline) : null }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.submittedAt !== undefined && { submittedAt: body.submittedAt ? new Date(body.submittedAt) : null }),
      },
    });

    return NextResponse.json(proposal);
  } catch (err) {
    console.error('PUT /api/internal/grants/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    await prisma.proposal.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/internal/grants/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
