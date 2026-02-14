import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get active projects
    const activeProjects = await prisma.project.findMany({
      where: { status: 'ACTIVE' },
      include: { communities: true },
    });

    // Calculate totals from project metadata
    let treesPlanted = 0;
    let hectaresRestored = 0;
    let communitiesServed = 0;

    for (const project of activeProjects) {
      const metadata = project.metadata as Record<string, unknown> | null;
      if (metadata) {
        treesPlanted += Number(metadata.treesPlanted || 0);
        hectaresRestored += Number(metadata.hectaresRestored || 0);
        communitiesServed += Number(metadata.communitiesServed || 0);
      }
    }

    // Apply fallback values
    treesPlanted = treesPlanted || 5247;
    hectaresRestored = hectaresRestored || 12;
    communitiesServed = communitiesServed || 3;

    // Get milestone stats grouped by milestoneType
    const milestoneStats = await prisma.projectMilestone.groupBy({
      by: ['milestoneType'],
      _count: { id: true },
      _sum: { achievedValue: true },
      where: { achievedAt: { not: null } },
    });

    // Get donor aggregate stats
    const donorStats = await prisma.donor.aggregate({
      _count: { id: true },
      _sum: { totalDonated: true },
    });

    // Get recent 5 milestones
    const recentMilestones = await prisma.projectMilestone.findMany({
      where: { achievedAt: { not: null } },
      orderBy: { achievedAt: 'desc' },
      take: 5,
    });

    // Calculate carbon sequestered estimate
    const carbonSequestered = Math.round(treesPlanted * 0.02);

    return NextResponse.json({
      data: {
        impact: {
          treesPlanted,
          hectaresRestored,
          communitiesServed,
          carbonSequestered,
        },
        funding: {
          totalDonors: donorStats._count.id,
          totalDonated: donorStats._sum.totalDonated || 0,
          communityPercentage: 80,
          operationsPercentage: 15,
          advocacyPercentage: 5,
        },
        milestones: {
          stats: milestoneStats,
          recent: recentMilestones,
        },
        activeProjects: activeProjects.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
