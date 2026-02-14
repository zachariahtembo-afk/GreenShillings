import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, requirePartnerOrAdmin } from '@/lib/api/auth';
import {
  optionalString,
  optionalNumber,
  parseStringArray,
  parseDocumentStatus,
  parseDocumentVisibility,
} from '@/lib/api/helpers';
import type { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();

    const title = optionalString(body.title);
    const fileName = optionalString(body.fileName);
    const storageKey = optionalString(body.storageKey);
    const contentType = optionalString(body.contentType);

    if (!title || !fileName || !storageKey || !contentType) {
      return NextResponse.json(
        { error: 'title, fileName, storageKey, and contentType are required' },
        { status: 400 },
      );
    }

    const description = optionalString(body.description);
    const category = optionalString(body.category);
    const projectId = optionalString(body.projectId);
    const sizeBytes = optionalNumber(body.sizeBytes);
    const standards = parseStringArray(body.standards);
    const methodologies = parseStringArray(body.methodologies);
    const tags = parseStringArray(body.tags);
    const organizationIds = parseStringArray(body.organizationIds);
    const status = parseDocumentStatus(body.status) ?? 'DRAFT';
    const visibility = parseDocumentVisibility(body.visibility) ?? 'SELECTED';
    const version = optionalString(body.version) ?? 'v01';

    const document = await prisma.document.create({
      data: {
        title,
        description,
        fileName,
        storageKey,
        contentType,
        sizeBytes,
        status,
        version,
        category,
        standards,
        methodologies,
        tags,
        visibility,
        projectId,
        access:
          organizationIds.length > 0
            ? {
                createMany: {
                  data: organizationIds.map((orgId) => ({
                    organizationId: orgId,
                  })),
                },
              }
            : undefined,
      },
      include: {
        project: true,
        access: true,
      },
    });

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await requirePartnerOrAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const projectId = optionalString(searchParams.get('projectId') ?? undefined);
    const category = optionalString(searchParams.get('category') ?? undefined);
    const statusFilter = parseDocumentStatus(
      searchParams.get('status') ?? undefined,
    );

    const where: Prisma.DocumentWhereInput = {};

    if (projectId) where.projectId = projectId;
    if (category) where.category = category;
    if (statusFilter) where.status = statusFilter;

    // Partners can only see PUBLIC documents or documents they have explicit access to
    if (auth.role === 'PARTNER' && auth.organizationId) {
      where.OR = [
        { visibility: 'PUBLIC' },
        {
          access: {
            some: { organizationId: auth.organizationId },
          },
        },
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        project: true,
        access: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: documents });
  } catch (error) {
    console.error('Error listing documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
