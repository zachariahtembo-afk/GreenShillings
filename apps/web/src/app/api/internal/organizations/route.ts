import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    const partners = await prisma.capitalPartner.findMany({
      where,
      orderBy: { name: 'asc' },
      include: { _count: { select: { contacts: true, interactions: true } } },
    });

    return NextResponse.json(partners);
  } catch (err) {
    console.error('GET /api/internal/organizations error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    if (!body.partnerType?.trim()) {
      return NextResponse.json({ error: 'partnerType is required' }, { status: 400 });
    }
    if (!body.engagementType?.trim()) {
      return NextResponse.json({ error: 'engagementType is required' }, { status: 400 });
    }

    const partner = await prisma.capitalPartner.create({
      data: {
        name: body.name,
        partnerType: body.partnerType,
        engagementType: body.engagementType,
        geography: body.geography || null,
        contactName: body.contactName || null,
        contactEmail: body.contactEmail || null,
        website: body.website || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (err) {
    console.error('POST /api/internal/organizations error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
