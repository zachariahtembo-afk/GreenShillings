import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    const partner = await prisma.capitalPartner.findUnique({
      where: { id },
      include: {
        contacts: { orderBy: { name: 'asc' } },
        interactions: {
          orderBy: { date: 'desc' },
          take: 20,
          include: { contact: true, proposal: { select: { title: true } } },
        },
      },
    });

    if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(partner);
  } catch (err) {
    console.error('GET /api/internal/organizations/[id] error:', err);
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

    const partner = await prisma.capitalPartner.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.partnerType !== undefined && { partnerType: body.partnerType }),
        ...(body.engagementType !== undefined && { engagementType: body.engagementType }),
        ...(body.geography !== undefined && { geography: body.geography }),
        ...(body.contactName !== undefined && { contactName: body.contactName }),
        ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail }),
        ...(body.website !== undefined && { website: body.website }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json(partner);
  } catch (err) {
    console.error('PUT /api/internal/organizations/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    await prisma.capitalPartner.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/internal/organizations/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
