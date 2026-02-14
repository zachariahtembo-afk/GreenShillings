import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import type Stripe from 'stripe';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const fromAddress =
  process.env.CONTACT_FROM_EMAIL || 'GreenShillings <hello@greenshillings.org>';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 },
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const donationId = session.metadata?.donationId;
        const donorId = session.metadata?.donorId;

        if (!donationId || !donorId) {
          console.warn(
            'Stripe checkout.session.completed missing metadata:',
            session.id,
          );
          break;
        }

        // Guard against webhook retries — check current status first
        const existing = await prisma.donation.findUnique({
          where: { id: donationId },
          select: { status: true },
        });

        if (existing?.status === 'SUCCEEDED') {
          // Already processed — skip to avoid double-counting
          break;
        }

        // Update donation status to SUCCEEDED
        const donation = await prisma.donation.update({
          where: { id: donationId },
          data: {
            status: 'SUCCEEDED',
            metadata: {
              stripeSessionId: session.id,
              stripePaymentIntentId:
                typeof session.payment_intent === 'string'
                  ? session.payment_intent
                  : session.payment_intent?.id ?? null,
            },
          },
        });

        // Update donor stats — increment donationCount and totalDonated
        await prisma.donor.update({
          where: { id: donorId },
          data: {
            donationCount: { increment: 1 },
            totalDonated: { increment: donation.amount },
            lastDonationAt: new Date(),
          },
        });

        // Send confirmation email
        if (resend && session.customer_email) {
          try {
            await resend.emails.send({
              from: fromAddress,
              to: session.customer_email,
              subject: 'Thank you for your donation to GREENSHILLINGS!',
              html: `
                <h1>Thank you for your generous donation!</h1>
                <p>
                  We have received your donation of
                  <strong>$${donation.amount.toFixed(2)} USD</strong>.
                </p>
                <p>
                  Your contribution directly supports equitable carbon finance
                  in Tanzania, empowering local communities through sustainable
                  forestry, fair carbon credit distribution, and transparent
                  climate action.
                </p>
                <p>
                  Together, we are building a greener, more just future for
                  Tanzania and the world.
                </p>
                <p>With gratitude,<br/>The GREENSHILLINGS Team</p>
              `,
            });
          } catch (emailError) {
            console.error(
              'Failed to send donation confirmation email:',
              emailError,
            );
          }
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const donationId = session.metadata?.donationId;

        if (donationId) {
          await prisma.donation.update({
            where: { id: donationId },
            data: { status: 'FAILED' },
          });
        }

        break;
      }

      case 'invoice.payment_failed': {
        console.warn(
          'Subscription payment failed:',
          event.data.object,
        );
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
}
