import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { simulateNDVIAnalysis, estimateCarbonFromNDVI } from '@/lib/api/services/planet';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Extract hectares from metadata (default 5)
    const metadata = project.metadata as Record<string, unknown> | null;
    const hectares = Number(metadata?.hectaresRestored || metadata?.targetHectares || 5);

    // Run NDVI for last month to get current vegetation state
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const ndviResults = simulateNDVIAnalysis(
      projectId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    // Use the latest NDVI value for carbon estimation
    const latestNDVI = ndviResults.length > 0
      ? ndviResults[ndviResults.length - 1].meanNDVI
      : 0.3;

    // Estimate carbon with agroforestry type
    const carbonEstimate = estimateCarbonFromNDVI(latestNDVI, hectares, 'agroforestry');

    return NextResponse.json({
      data: {
        projectId,
        projectName: project.name,
        hectares,
        ndvi: {
          currentValue: latestNDVI,
          analysisDate: endDate.toISOString().split('T')[0],
        },
        carbon: carbonEstimate,
      },
    });
  } catch (error) {
    console.error('Error fetching carbon estimation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
