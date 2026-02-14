import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePartnerOrAdmin } from '@/lib/api/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const auth = await requirePartnerOrAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { documentId } = await params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        project: true,
        access: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 },
      );
    }

    // Partners can only see PUBLIC documents or documents they have explicit access to
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

    return NextResponse.json({ data: document });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
