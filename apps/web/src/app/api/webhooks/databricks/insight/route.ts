import { NextRequest, NextResponse } from 'next/server';
import { createInsight, isSanityAdminConfigured } from '@/lib/api/services/sanity-admin';
import { optionalString, parseStringArray } from '@/lib/api/helpers';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.DATABRICKS_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 },
      );
    }

    const headerSecret = optionalString(
      request.headers.get('x-webhook-secret') ?? undefined,
    );

    if (!headerSecret || headerSecret !== webhookSecret) {
      return NextResponse.json(
        { error: 'Invalid webhook secret' },
        { status: 401 },
      );
    }

    if (!isSanityAdminConfigured()) {
      return NextResponse.json(
        { error: 'Sanity admin client is not configured' },
        { status: 503 },
      );
    }

    const body = await request.json();

    const title = optionalString(body.title);
    const excerpt = optionalString(body.excerpt);

    if (!title || !excerpt) {
      return NextResponse.json(
        { error: 'title and excerpt are required' },
        { status: 400 },
      );
    }

    // Convert body content to Portable Text blocks if it's a plain string
    let portableTextBody: Array<{
      _type: 'block';
      children: Array<{ _type: 'span'; text: string }>;
    }>;

    if (Array.isArray(body.body)) {
      portableTextBody = body.body;
    } else if (typeof body.body === 'string' && body.body.trim()) {
      // Convert plain text to Portable Text blocks (split by double newlines for paragraphs)
      const paragraphs = body.body
        .split(/\n\n+/)
        .map((text: string) => text.trim())
        .filter((text: string) => text.length > 0);

      portableTextBody = paragraphs.map((text: string) => ({
        _type: 'block' as const,
        children: [{ _type: 'span' as const, text }],
      }));
    } else {
      portableTextBody = [
        {
          _type: 'block' as const,
          children: [{ _type: 'span' as const, text: excerpt }],
        },
      ];
    }

    const categorySlug = optionalString(body.categorySlug);
    const tags = parseStringArray(body.tags);
    const publishedAt = optionalString(body.publishedAt);

    const result = await createInsight({
      title,
      excerpt,
      body: portableTextBody,
      categorySlug,
      tags,
      publishedAt,
    });

    return NextResponse.json(
      {
        data: {
          id: result._id,
          title,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error processing Databricks insight webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
