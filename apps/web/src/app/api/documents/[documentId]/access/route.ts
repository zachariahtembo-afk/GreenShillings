import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { parseStringArray } from '@/lib/api/helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { documentId } = await params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const organizationIds = parseStringArray(body.organizationIds);

    if (organizationIds.length === 0) {
      return NextResponse.json(
        { error: 'organizationIds array is required and must not be empty' },
        { status: 400 },
      );
    }

    const result = await prisma.documentAccess.createMany({
      data: organizationIds.map((orgId) => ({
        documentId,
        organizationId: orgId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        data: {
          granted: result.count,
          documentId,
          organizationIds,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error granting document access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
