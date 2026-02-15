import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resendToken = process.env.RESEND_API_KEY;
const resend = resendToken ? new Resend(resendToken) : null;
const contactFromAddress =
  process.env.CONTACT_FROM_EMAIL || 'GreenShilling <hello@greenshilling.org>';
const contactRecipients =
  process.env.CONTACT_INBOX?.split(',')
    .map((v) => v.trim())
    .filter(Boolean) ?? [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { fullName, email, message, phone, organization, role, source } =
      body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'fullName, email, and message are required' },
        { status: 400 },
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        organization: organization || null,
        role: role || null,
        message,
        source: source || null,
      },
    });

    // Send notification email to team and auto-reply to user
    if (resend && contactRecipients.length > 0) {
      try {
        // Notification to team
        await resend.emails.send({
          from: contactFromAddress,
          to: contactRecipients,
          subject: `New Contact Inquiry from ${fullName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1B7A3D;">New Contact Inquiry</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${fullName}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
                ${phone ? `<tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>` : ''}
                ${organization ? `<tr><td style="padding: 8px; font-weight: bold;">Organization:</td><td style="padding: 8px;">${organization}</td></tr>` : ''}
                ${role ? `<tr><td style="padding: 8px; font-weight: bold;">Role:</td><td style="padding: 8px;">${role}</td></tr>` : ''}
                ${source ? `<tr><td style="padding: 8px; font-weight: bold;">Source:</td><td style="padding: 8px;">${source}</td></tr>` : ''}
              </table>
              <h3 style="color: #1B7A3D;">Message</h3>
              <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
            </div>
          `,
        });

        // Auto-reply to user
        await resend.emails.send({
          from: contactFromAddress,
          to: [email],
          subject: 'Thank you for contacting GREENSHILLING',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1B7A3D;">Thank you, ${fullName}!</h2>
              <p>We have received your message and appreciate you reaching out to GREENSHILLING.</p>
              <p>Our team will review your inquiry and get back to you within <strong>2-3 business days</strong>.</p>
              <p>If your matter is urgent, feel free to reply directly to this email.</p>
              <br />
              <p style="color: #666;">Warm regards,</p>
              <p style="color: #1B7A3D; font-weight: bold;">The GREENSHILLING Team</p>
              <hr style="border: none; border-top: 2px solid #1B7A3D; margin-top: 24px;" />
              <p style="font-size: 12px; color: #999;">
                GREENSHILLING &mdash; Equitable Carbon Finance for Tanzania<br />
                hello@greenshilling.org
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send contact emails:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    return NextResponse.json({ data: inquiry }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
