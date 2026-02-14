import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');
    const partnerId = searchParams.get('partnerId');
    const proposalId = searchParams.get('proposalId');

    const where = {
      ...(contactId && { contactId }),
      ...(partnerId && { partnerId }),
      ...(proposalId && { proposalId }),
    };

    const interactions = await prisma.interaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 50,
      include: {
        contact: { select: { id: true, name: true } },
        partner: { select: { id: true, name: true } },
        proposal: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(interactions);
  } catch (err) {
    console.error('GET /api/internal/interactions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    if (!body.type?.trim()) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }
    if (!body.subject?.trim()) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 });
    }

    const interaction = await prisma.interaction.create({
      data: {
        type: body.type,
        subject: body.subject,
        notes: body.notes || null,
        date: body.date ? new Date(body.date) : new Date(),
        loggedBy: user.email,
        contactId: body.contactId || null,
        partnerId: body.partnerId || null,
        proposalId: body.proposalId || null,
      },
    });

    return NextResponse.json(interaction, { status: 201 });
  } catch (err) {
    console.error('POST /api/internal/interactions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
