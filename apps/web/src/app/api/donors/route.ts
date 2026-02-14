import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  optionalString,
  isValidChannel,
  formatPhoneNumber,
  VALID_CHANNELS,
} from '@/lib/api/helpers';
import type { NotificationChannel } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, fullName } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'email and fullName are required' },
        { status: 400 },
      );
    }

    const phone = optionalString(body.phone);
    const rawWhatsapp = optionalString(body.whatsappNumber);
    const whatsappNumber = rawWhatsapp ?? phone;
    const notificationsEnabled = body.notificationsEnabled !== false;

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

    const formattedPhone = phone ? formatPhoneNumber(phone) : null;
    const formattedWhatsapp = whatsappNumber
      ? formatPhoneNumber(whatsappNumber)
      : null;

    const donor = await prisma.donor.upsert({
      where: { email },
      create: {
        email,
        fullName,
        phone: formattedPhone,
        whatsappNumber: formattedWhatsapp,
        preferredChannel,
        notificationsEnabled,
      },
      update: {
        fullName,
        phone: formattedPhone,
        whatsappNumber: formattedWhatsapp,
        preferredChannel,
        notificationsEnabled,
      },
    });

    return NextResponse.json({ data: donor }, { status: 201 });
  } catch (error) {
    console.error('Error registering donor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
