import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  optionalString,
  optionalNumber,
  isValidChannel,
  formatPhoneNumber,
  VALID_CHANNELS,
} from '@/lib/api/helpers';
import type { NotificationChannel } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, fullName } = body;
    const amount = optionalNumber(body.amount);

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'email and fullName are required' },
        { status: 400 },
      );
    }

    if (amount === undefined || amount <= 0) {
      return NextResponse.json(
        { error: 'A valid positive amount is required' },
        { status: 400 },
      );
    }

    if (amount > 1_000_000) {
      return NextResponse.json(
        { error: 'Donation amount exceeds the maximum allowed ($1,000,000)' },
        { status: 400 },
      );
    }

    const phone = optionalString(body.phone);
    const rawWhatsapp = optionalString(body.whatsappNumber);
    const projectId = optionalString(body.projectId);

    let preferredChannel: NotificationChannel = 'EMAIL';
    if (body.preferredChannel) {
      if (!isValidChannel(body.preferredChannel)) {
        return NextResponse.json(
          {
            error: `Invalid preferredChannel. Must be one of: ${VALID_CHANNELS.join(', ')}`,
          },
          { status: 400 },
        );
      }
      preferredChannel =
        body.preferredChannel.toUpperCase() as NotificationChannel;
    }

    const formattedPhone = phone ? formatPhoneNumber(phone) : undefined;
    const formattedWhatsapp = rawWhatsapp
      ? formatPhoneNumber(rawWhatsapp)
      : formattedPhone;

    // Upsert donor and increment donation stats
    const donor = await prisma.donor.upsert({
      where: { email },
      create: {
        email,
        fullName,
        phone: formattedPhone ?? null,
        whatsappNumber: formattedWhatsapp ?? null,
        preferredChannel,
        donationCount: 1,
        totalDonated: amount,
        lastDonationAt: new Date(),
      },
      update: {
        fullName,
        ...(formattedPhone ? { phone: formattedPhone } : {}),
        ...(formattedWhatsapp ? { whatsappNumber: formattedWhatsapp } : {}),
        preferredChannel,
        donationCount: { increment: 1 },
        totalDonated: { increment: amount },
        lastDonationAt: new Date(),
      },
    });

    // Subscribe donor to project if projectId provided
    if (projectId) {
      await prisma.donorSubscription.upsert({
        where: {
          donorId_projectId: { donorId: donor.id, projectId },
        },
        create: {
          donorId: donor.id,
          projectId,
          isActive: true,
        },
        update: {
          isActive: true,
        },
      });
    }

    // Create donation record — direct recording (no payment gateway),
    // so mark as SUCCEEDED immediately to match the donor stats increment above.
    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        amount,
        currency: body.currency || 'USD',
        status: 'SUCCEEDED',
        frequency: body.frequency === 'MONTHLY' ? 'MONTHLY' : 'ONE_TIME',
      },
    });

    // Fetch updated donor for correct counts
    const updatedDonor = await prisma.donor.findUnique({
      where: { id: donor.id },
    });

    return NextResponse.json(
      {
        donorId: updatedDonor!.id,
        donationId: donation.id,
        donationCount: updatedDonor!.donationCount,
        totalDonated: updatedDonor!.totalDonated,
        confirmationSent: false,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error recording donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
