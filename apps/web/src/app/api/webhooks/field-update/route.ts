import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { optionalString } from '@/lib/api/helpers';
import type { MilestoneType } from '@prisma/client';

const UPDATE_TYPE_MAP: Record<string, MilestoneType> = {
  trees_planted: 'TREES_PLANTED',
  hectares_restored: 'HECTARES_RESTORED',
  community_trained: 'COMMUNITY_TRAINED',
  carbon_verified: 'CARBON_VERIFIED',
  harvest_completed: 'HARVEST_COMPLETED',
  payment_distributed: 'PAYMENT_DISTRIBUTED',
  monitoring_complete: 'MONITORING_COMPLETE',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { projectId, updateType } = body;

    if (!projectId || !updateType) {
      return NextResponse.json(
        { error: 'projectId and updateType are required' },
        { status: 400 },
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    // Map updateType to milestoneType
    const milestoneType: MilestoneType =
      UPDATE_TYPE_MAP[updateType.toLowerCase()] ?? 'CUSTOM';

    const value = body.value;
    const description = optionalString(body.description);
    const location = optionalString(body.location);
    const imageUrl = optionalString(body.imageUrl);

    const milestone = await prisma.projectMilestone.create({
      data: {
        projectId,
        title: `${updateType} update`,
        description: description ?? `Field update: ${updateType}`,
        milestoneType,
        achievedValue: typeof value === 'number' ? value : null,
        achievedAt: new Date(),
        location: location ?? null,
        imageUrl: imageUrl ?? null,
      },
    });

    return NextResponse.json(
      { milestone, notifications: null },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error processing field update webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
