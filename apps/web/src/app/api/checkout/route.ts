import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import {
  optionalString,
  optionalNumber,
  isValidChannel,
  formatPhoneNumber,
  VALID_CHANNELS,
} from '@/lib/api/helpers';
import type { NotificationChannel, DonationFrequency } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, fullName } = body;
    const amount = optionalNumber(body.amount);
    const frequency: DonationFrequency = body.frequency === 'MONTHLY' ? 'MONTHLY' : 'ONE_TIME';

    // Validate required fields
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

    // Upsert donor — do NOT increment donationCount/totalDonated yet.
    // That happens in the webhook after payment confirms.
    const donor = await prisma.donor.upsert({
      where: { email },
      create: {
        email,
        fullName,
        phone: formattedPhone ?? null,
        whatsappNumber: formattedWhatsapp ?? null,
        preferredChannel,
        donationCount: 0,
        totalDonated: 0,
      },
      update: {
        fullName,
        ...(formattedPhone ? { phone: formattedPhone } : {}),
        ...(formattedWhatsapp ? { whatsappNumber: formattedWhatsapp } : {}),
        preferredChannel,
      },
    });

    // Create a PENDING donation record
    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        amount,
        currency: 'USD',
        status: 'PENDING',
        frequency,
      },
    });

    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://greenshilling.org';

    const session = await getStripe().checkout.sessions.create({
      mode: frequency === 'MONTHLY' ? 'subscription' : 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: 'GREENSHILLING Donation',
              description:
                frequency === 'MONTHLY'
                  ? 'Monthly donation to support equitable carbon finance in Tanzania'
                  : 'One-time donation to support equitable carbon finance in Tanzania',
            },
            ...(frequency === 'MONTHLY'
              ? { recurring: { interval: 'month' } }
              : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        donationId: donation.id,
        donorId: donor.id,
      },
      success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donate?canceled=true`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
