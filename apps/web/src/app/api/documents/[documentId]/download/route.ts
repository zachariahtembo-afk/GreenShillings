import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createDownloadUrl, storageConfig } from '@/lib/api/services/storage';
import { requirePartnerOrAdmin } from '@/lib/api/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const auth = await requirePartnerOrAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    if (!storageConfig.enabled) {
      return NextResponse.json(
        { error: 'Storage is not configured' },
        { status: 503 },
      );
    }

    const { documentId } = await params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { access: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 },
      );
    }

    // Partners can only download PUBLIC documents or documents they have explicit access to
    if (auth.role === 'PARTNER' && auth.organizationId) {
      const hasAccess =
        document.visibility === 'PUBLIC' ||
        document.access.some(
          (a) => a.organizationId === auth.organizationId,
        );

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 },
        );
      }
    }

    const downloadUrl = await createDownloadUrl({
      key: document.storageKey,
    });

    return NextResponse.json({
      data: {
        downloadUrl,
        fileName: document.fileName,
        contentType: document.contentType,
      },
    });
  } catch (error) {
    console.error('Error creating download URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
