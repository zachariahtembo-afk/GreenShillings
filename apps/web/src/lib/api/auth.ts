import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { optionalString } from './helpers';

export type AuthContext = {
  role: 'ADMIN' | 'PARTNER' | 'ANON';
  organizationId?: string;
};

const ADMIN_API_KEY = optionalString(process.env.ADMIN_API_KEY);

export async function getAuthContext(req: NextRequest): Promise<AuthContext> {
  const adminKey = optionalString(req.headers.get('x-admin-key') ?? undefined);
  if (ADMIN_API_KEY && adminKey && adminKey === ADMIN_API_KEY) {
    return { role: 'ADMIN' };
  }

  const partnerKeyId = optionalString(req.headers.get('x-partner-key-id') ?? undefined);
  const partnerKey = optionalString(req.headers.get('x-partner-key') ?? undefined);
  if (!partnerKeyId || !partnerKey) {
    return { role: 'ANON' };
  }

  const organization = await prisma.partnerOrganization.findUnique({
    where: { accessKeyId: partnerKeyId },
  });

  if (!organization || organization.status !== 'ACTIVE') {
    return { role: 'ANON' };
  }

  const isValid = await bcrypt.compare(partnerKey, organization.accessKeyHash);
  if (!isValid) {
    return { role: 'ANON' };
  }

  return { role: 'PARTNER', organizationId: organization.id };
}

export async function requireAdmin(req: NextRequest): Promise<AuthContext | NextResponse> {
  if (!ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Admin access not configured' }, { status: 500 });
  }
  const auth = await getAuthContext(req);
  if (auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  return auth;
}

export async function requirePartnerOrAdmin(req: NextRequest): Promise<AuthContext | NextResponse> {
  const auth = await getAuthContext(req);
  if (auth.role === 'ANON') {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  return auth;
}
