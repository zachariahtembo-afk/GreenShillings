import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  simulateNDVIAnalysis,
  estimateCarbonFromNDVI,
  generateVerificationReport,
} from '@/lib/api/services/planet';

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

    const metadata = project.metadata as Record<string, unknown> | null;
    const coordinates = metadata?.coordinates as { lat: number; lng: number } | null;
    const hectares = Number(metadata?.hectaresRestored || metadata?.targetHectares || 5);

    // If no coordinates exist, return simulated data with low confidence
    if (!coordinates) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const ndviHistory = simulateNDVIAnalysis(
        projectId,
        oneYearAgo.toISOString(),
        new Date().toISOString()
      );

      const latestNDVI = ndviHistory.length > 0
        ? ndviHistory[ndviHistory.length - 1].meanNDVI
        : 0.3;
      const baselineNDVI = ndviHistory.length > 0
        ? ndviHistory[0].meanNDVI
        : 0.3;
      const ndviChange = Number((latestNDVI - baselineNDVI).toFixed(3));

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (ndviChange > 0.05) trend = 'improving';
      if (ndviChange < -0.05) trend = 'declining';

      const carbonEstimate = estimateCarbonFromNDVI(latestNDVI, hectares, 'agroforestry');

      return NextResponse.json({
        data: {
          projectId,
          verificationDate: new Date().toISOString(),
          imagery: {
            available: false,
            count: 0,
          },
          ndvi: {
            current: latestNDVI,
            baseline: baselineNDVI,
            change: ndviChange,
            trend,
          },
          carbon: carbonEstimate,
          confidence: 'low' as const,
          note: 'No coordinates available for this project. Verification data is simulated.',
        },
      });
    }

    // Coordinates exist - generate full verification report
    const result = await generateVerificationReport(projectId, coordinates, hectares);

    if (!result.success || !result.verification) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate verification report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: result.verification,
    });
  } catch (error) {
    console.error('Error generating verification report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
