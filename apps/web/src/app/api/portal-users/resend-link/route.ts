import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth, sessionToInternalUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const fromAddress =
  process.env.CONTACT_FROM_EMAIL || 'GreenShilling <hello@greenshilling.org>';

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    // Find the portal user
    const portalUser = await prisma.portalUser.findUnique({
      where: { id: userId },
      include: {
        organization: { select: { id: true, name: true } },
      },
    });

    if (!portalUser) {
      return NextResponse.json(
        { error: 'Portal user not found' },
        { status: 404 },
      );
    }

    // Generate new magic link token with 7-day expiry
    const magicLinkToken = crypto.randomBytes(48).toString('hex');
    const magicLinkExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Update the user with the new token
    await prisma.portalUser.update({
      where: { id: userId },
      data: {
        magicLinkToken,
        magicLinkExpiry,
      },
    });

    // Send the magic link email
    if (resend) {
      try {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || 'https://greenshilling.org';
        const loginLink = `${appUrl}/portal/login?token=${magicLinkToken}`;

        await resend.emails.send({
          from: fromAddress,
          to: [portalUser.email],
          subject: 'Your new GREENSHILLING Portal login link',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1B7A3D;">Hello, ${portalUser.name}!</h2>
              <p>A new login link has been generated for your GREENSHILLING Partner Portal account.</p>
              <p>Click the link below to log in:</p>
              <p style="margin: 24px 0;">
                <a href="${loginLink}" style="background: #1B7A3D; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Access the Portal
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">This link will expire in 7 days. If you did not request this link, please ignore this email.</p>
              <hr style="border: none; border-top: 2px solid #1B7A3D; margin-top: 24px;" />
              <p style="font-size: 12px; color: #999;">
                GREENSHILLING &mdash; Equitable Carbon Finance for Tanzania<br />
                hello@greenshilling.org
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send magic link email:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    return NextResponse.json(
      { message: 'Magic link has been resent successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('POST /api/portal-users/resend-link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
