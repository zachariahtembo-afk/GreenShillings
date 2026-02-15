import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
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
    const { email, name, organizationId, authMethod, password } = body;

    // Validate required fields
    if (!email || !name || !organizationId || !authMethod) {
      return NextResponse.json(
        { error: 'email, name, organizationId, and authMethod are required' },
        { status: 400 },
      );
    }

    if (authMethod !== 'magic-link' && authMethod !== 'password') {
      return NextResponse.json(
        { error: 'authMethod must be "magic-link" or "password"' },
        { status: 400 },
      );
    }

    // Check if a PortalUser with this email already exists
    const existing = await prisma.portalUser.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A portal user with this email already exists' },
        { status: 409 },
      );
    }

    // Build auth-specific fields
    let passwordHash: string | null = null;
    let magicLinkToken: string | null = null;
    let magicLinkExpiry: Date | null = null;

    if (authMethod === 'password' && password) {
      passwordHash = await hash(password, 10);
    }

    if (authMethod === 'magic-link') {
      magicLinkToken = crypto.randomBytes(48).toString('hex');
      magicLinkExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    // Create the PortalUser
    const portalUser = await prisma.portalUser.create({
      data: {
        email,
        name,
        role: 'PARTNER',
        organizationId,
        passwordHash,
        magicLinkToken,
        magicLinkExpiry,
        invitedAt: new Date(),
      },
      include: {
        organization: { select: { id: true, name: true } },
      },
    });

    // Send invite email via Resend
    if (resend) {
      try {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || 'https://greenshilling.org';

        if (authMethod === 'magic-link') {
          const loginLink = `${appUrl}/portal/login?token=${magicLinkToken}`;

          await resend.emails.send({
            from: fromAddress,
            to: [email],
            subject: 'You have been invited to the GREENSHILLING Partner Portal',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1B7A3D;">Welcome to GREENSHILLING, ${name}!</h2>
                <p>You have been invited to join the GREENSHILLING Partner Portal.</p>
                <p>Click the link below to log in and get started:</p>
                <p style="margin: 24px 0;">
                  <a href="${loginLink}" style="background: #1B7A3D; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                    Access the Portal
                  </a>
                </p>
                <p style="color: #666; font-size: 14px;">This link will expire in 7 days. If it has expired, please contact your administrator for a new invite.</p>
                <hr style="border: none; border-top: 2px solid #1B7A3D; margin-top: 24px;" />
                <p style="font-size: 12px; color: #999;">
                  GREENSHILLING &mdash; Equitable Carbon Finance for Tanzania<br />
                  hello@greenshilling.org
                </p>
              </div>
            `,
          });
        } else if (authMethod === 'password') {
          const portalLoginUrl = `${appUrl}/portal/login`;

          await resend.emails.send({
            from: fromAddress,
            to: [email],
            subject: 'You have been invited to the GREENSHILLING Partner Portal',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1B7A3D;">Welcome to GREENSHILLING, ${name}!</h2>
                <p>You have been invited to join the GREENSHILLING Partner Portal.</p>
                <p>You can log in using the credentials below:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Email:</td>
                    <td style="padding: 8px;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Password:</td>
                    <td style="padding: 8px;">${password}</td>
                  </tr>
                </table>
                <p style="margin: 24px 0;">
                  <a href="${portalLoginUrl}" style="background: #1B7A3D; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                    Log In to the Portal
                  </a>
                </p>
                <p style="color: #666; font-size: 14px;">For security, we recommend changing your password after your first login.</p>
                <hr style="border: none; border-top: 2px solid #1B7A3D; margin-top: 24px;" />
                <p style="font-size: 12px; color: #999;">
                  GREENSHILLING &mdash; Equitable Carbon Finance for Tanzania<br />
                  hello@greenshilling.org
                </p>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error('Failed to send portal invite email:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    // Return created user excluding sensitive fields
    const { passwordHash: _pw, magicLinkToken: _token, ...safeUser } = portalUser; // eslint-disable-line @typescript-eslint/no-unused-vars

    return NextResponse.json({ data: safeUser }, { status: 201 });
  } catch (error) {
    console.error('POST /api/portal-users/invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
