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
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const contacts = await prisma.cRMContact.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        partner: { select: { id: true, name: true } },
        _count: { select: { interactions: true } },
      },
    });

    return NextResponse.json(contacts);
  } catch (err) {
    console.error('GET /api/internal/contacts error:', err);
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

    const contact = await prisma.cRMContact.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        title: body.title || null,
        partnerId: body.partnerId || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error('POST /api/internal/contacts error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
