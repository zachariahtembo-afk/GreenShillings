import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createUploadUrl, storageConfig } from '@/lib/api/services/storage';
import { optionalString, sanitizeFileName } from '@/lib/api/helpers';
import { requireAdmin } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    if (!storageConfig.enabled) {
      return NextResponse.json(
        { error: 'Storage is not configured' },
        { status: 503 },
      );
    }

    const body = await request.json();
    const fileName = optionalString(body.fileName);
    const contentType = optionalString(body.contentType);

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName and contentType are required' },
        { status: 400 },
      );
    }

    const safeFileName = sanitizeFileName(fileName);
    const date = new Date().toISOString().slice(0, 10);
    const key = `documents/${date}/${randomUUID()}_${safeFileName}`;

    const uploadUrl = await createUploadUrl({ key, contentType });

    return NextResponse.json({
      data: {
        uploadUrl,
        storageKey: key,
        bucket: storageConfig.bucket,
      },
    });
  } catch (error) {
    console.error('Error creating upload URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
