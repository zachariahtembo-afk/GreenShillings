import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, sessionToInternalUser } from '@/lib/auth';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ milestoneId: string }> },
) {
  try {
    const session = await auth();
    const user = sessionToInternalUser(session);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { milestoneId } = await params;

    // Find milestone
    const milestone = await prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 },
      );
    }

    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: milestone.projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    // Find subscribed donors
    const subscriptions = await prisma.donorSubscription.findMany({
      where: {
        projectId: milestone.projectId,
        isActive: true,
      },
      include: {
        donor: true,
      },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({
        message: 'No subscribed donors to notify',
        notified: 0,
      });
    }

    // Create NotificationLog entries with status PENDING
    const messageBody = `GREENSHILLINGS Update: ${milestone.title} - ${milestone.description}`;

    const notificationData = subscriptions.map((sub) => ({
      donorId: sub.donor.id,
      milestoneId: milestone.id,
      channel: sub.donor.preferredChannel,
      recipient: sub.donor.email,
      messageBody,
      status: 'PENDING' as const,
    }));

    await prisma.notificationLog.createMany({
      data: notificationData,
    });

    // Mark milestone as notified
    await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        isNotified: true,
        notifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Created ${subscriptions.length} notification(s) for milestone`,
      notified: subscriptions.length,
    });
  } catch (error) {
    console.error('Error notifying subscribers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
