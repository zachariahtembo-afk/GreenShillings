import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    const contact = await prisma.cRMContact.findUnique({
      where: { id },
      include: {
        partner: { select: { id: true, name: true } },
        interactions: {
          orderBy: { date: 'desc' },
          include: { proposal: { select: { id: true, title: true } } },
        },
      },
    });

    if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(contact);
  } catch (err) {
    console.error('GET /api/internal/contacts/[id] error:', err);
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

    const contact = await prisma.cRMContact.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.partnerId !== undefined && { partnerId: body.partnerId || null }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    return NextResponse.json(contact);
  } catch (err) {
    console.error('PUT /api/internal/contacts/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    await prisma.cRMContact.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/internal/contacts/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
