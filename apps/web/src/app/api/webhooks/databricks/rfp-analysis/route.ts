import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '../../../../../lib/prisma';

function timingSafeCompare(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) {
    // Compare against itself to maintain constant time, then return false
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.DATABRICKS_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const headerSecret = request.headers.get('x-webhook-secret');
  if (!headerSecret || !timingSafeCompare(headerSecret, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
  }

  const body = await request.json();
  const { proposalId } = body;

  if (!proposalId) {
    return NextResponse.json({ error: 'proposalId is required' }, { status: 400 });
  }

  const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
  if (!proposal) {
    return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
  }

  await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      analysisResult: body,
      analysisStatus: 'completed',
    },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
