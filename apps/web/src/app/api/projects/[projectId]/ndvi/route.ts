import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { simulateNDVIAnalysis } from '@/lib/api/services/planet';

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

    // Get months query parameter (default 12)
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '12', 10);

    // Calculate start date from months ago
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const endDate = new Date();

    // Run NDVI analysis simulation
    const timeSeries = simulateNDVIAnalysis(
      projectId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    // Build summary from time series
    const currentNDVI = timeSeries.length > 0
      ? timeSeries[timeSeries.length - 1].meanNDVI
      : 0;
    const baselineNDVI = timeSeries.length > 0
      ? timeSeries[0].meanNDVI
      : 0;
    const change = Number((currentNDVI - baselineNDVI).toFixed(3));

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (change > 0.05) trend = 'improving';
    if (change < -0.05) trend = 'declining';

    const vegetationCover = timeSeries.length > 0
      ? timeSeries[timeSeries.length - 1].vegetationCoverPercent
      : 0;

    return NextResponse.json({
      data: {
        projectId,
        period: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          months,
        },
        summary: {
          currentNDVI,
          baselineNDVI,
          change,
          trend,
          vegetationCover,
        },
        timeSeries,
      },
    });
  } catch (error) {
    console.error('Error fetching NDVI analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
