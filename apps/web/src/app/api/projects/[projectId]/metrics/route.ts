import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { communities: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get milestones for this project
    const milestones = await prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: { achievedAt: 'desc' },
    });

    // Extract metadata fields
    const metadata = project.metadata as Record<string, unknown> | null;
    const treesPlanted = Number(metadata?.treesPlanted || 0);
    const hectaresRestored = Number(metadata?.hectaresRestored || 0);
    const farmersParticipating = Number(metadata?.farmersParticipating || 0);
    const carbonEstimate = Number(metadata?.carbonEstimate || 0);
    const coordinates = metadata?.coordinates as { lat: number; lng: number } | null;

    return NextResponse.json({
      data: {
        project: {
          id: project.id,
          name: project.name,
          status: project.status,
          location: project.location,
          projectType: project.projectType,
        },
        metrics: {
          treesPlanted,
          hectaresRestored,
          farmersParticipating,
          carbonEstimate,
          coordinates,
        },
        milestones,
        communities: project.communities,
      },
    });
  } catch (error) {
    console.error('Error fetching project metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
