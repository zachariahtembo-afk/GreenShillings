import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  optionalString,
  optionalNumber,
  isValidMilestoneType,
  VALID_MILESTONE_TYPES,
} from '@/lib/api/helpers';
import type { MilestoneType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { projectId, title, description } = body;

    if (!projectId || !title || !description) {
      return NextResponse.json(
        { error: 'projectId, title, and description are required' },
        { status: 400 },
      );
    }

    let milestoneType: MilestoneType = 'CUSTOM';
    if (body.milestoneType) {
      if (!isValidMilestoneType(body.milestoneType)) {
        return NextResponse.json(
          {
            error: `Invalid milestoneType. Must be one of: ${VALID_MILESTONE_TYPES.join(', ')}`,
          },
          { status: 400 },
        );
      }
      milestoneType = body.milestoneType.toUpperCase() as MilestoneType;
    }

    const targetValue = optionalNumber(body.targetValue);
    const achievedValue = optionalNumber(body.achievedValue);
    const imageUrl = optionalString(body.imageUrl);
    const location = optionalString(body.location);
    const achievedAt = body.achievedAt ? new Date(body.achievedAt) : null;

    const milestone = await prisma.projectMilestone.create({
      data: {
        projectId,
        title,
        description,
        milestoneType,
        targetValue: targetValue ?? null,
        achievedValue: achievedValue ?? null,
        achievedAt,
        imageUrl: imageUrl ?? null,
        location: location ?? null,
        metadata: body.metadata ?? null,
      },
    });

    return NextResponse.json({ data: milestone }, { status: 201 });
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
