import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { optionalString, slugify } from '@/lib/api/helpers';
import { requireAdmin } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const organizations = await prisma.partnerOrganization.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        accessKeyId: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: organizations });
  } catch (error) {
    console.error('Error listing partner organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const name = optionalString(body.name);

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 },
      );
    }

    const slug = optionalString(body.slug) ?? slugify(name);
    const accessKeyId = `org_${crypto.randomBytes(6).toString('hex')}`;
    const accessKeySecret = crypto.randomBytes(24).toString('hex');
    const accessKeyHash = await bcrypt.hash(accessKeySecret, 10);

    const organization = await prisma.partnerOrganization.create({
      data: {
        name,
        slug,
        accessKeyId,
        accessKeyHash,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          status: organization.status,
          accessKeyId: organization.accessKeyId,
          accessKeySecret,
          createdAt: organization.createdAt,
          updatedAt: organization.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'An organization with that name or slug already exists' },
        { status: 409 },
      );
    }
    console.error('Error creating partner organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
