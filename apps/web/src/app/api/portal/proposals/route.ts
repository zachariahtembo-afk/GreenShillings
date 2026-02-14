import { NextRequest, NextResponse } from 'next/server';
import { auth, type SessionWithPortal } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

/**
 * POST /api/portal/proposals
 * Create a new proposal from the portal. Works for both staff and partner users.
 * Staff users can create proposals freely. Partner users create proposals
 * attributed to their email.
 */
export async function POST(req: NextRequest) {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const proposal = await prisma.proposal.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        fundingBody: body.fundingBody?.trim() || null,
        fundingTarget: body.fundingTarget ? parseFloat(body.fundingTarget) : null,
        currency: body.currency || 'USD',
        priority: body.priority || 'medium',
        deadline: body.deadline ? new Date(body.deadline) : null,
        notes: body.notes?.trim() || null,
        submittedBy: session.user.email,
        submittedByName: session.user.name || 'Portal User',
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (err) {
    console.error('POST /api/portal/proposals error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
