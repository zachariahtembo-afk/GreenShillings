import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { auth, sessionToInternalUser } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';
import { createUploadUrl, storageConfig } from '../../../../../../lib/api/services/storage';
import { sanitizeFileName } from '../../../../../../lib/api/helpers';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  if (!storageConfig.enabled) {
    return NextResponse.json({ error: 'Storage is not configured' }, { status: 503 });
  }

  // Verify proposal exists
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

  const body = await req.json();
  const { fileName, contentType } = body;

  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 });
  }

  const safeFileName = sanitizeFileName(fileName);
  const key = `proposals/${id}/${randomUUID()}_${safeFileName}`;

  const uploadUrl = await createUploadUrl({ key, contentType });

  // Create the document record
  const document = await prisma.proposalDocument.create({
    data: {
      proposalId: id,
      title: fileName,
      fileName: safeFileName,
      storageKey: key,
      contentType,
      sizeBytes: body.sizeBytes || null,
    },
  });

  return NextResponse.json({ uploadUrl, document }, { status: 201 });
}

// List documents for a proposal
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const documents = await prisma.proposalDocument.findMany({
      where: { proposalId: id },
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error listing proposal documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
