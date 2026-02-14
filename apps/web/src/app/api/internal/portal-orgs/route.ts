import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function GET() {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const orgs = await prisma.partnerOrganization.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { users: true } } },
    });

    return NextResponse.json(orgs);
  } catch (err) {
    console.error('GET /api/internal/portal-orgs error:', err);
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

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const accessKeyId = 'pak_' + randomBytes(16).toString('hex');
    const accessKey = randomBytes(32).toString('hex');
    const accessKeyHash = await hash(accessKey, 10);

    const org = await prisma.partnerOrganization.create({
      data: {
        name: body.name,
        slug,
        accessKeyId,
        accessKeyHash,
      },
    });

    return NextResponse.json({ ...org, accessKey }, { status: 201 });
  } catch (err) {
    console.error('POST /api/internal/portal-orgs error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
