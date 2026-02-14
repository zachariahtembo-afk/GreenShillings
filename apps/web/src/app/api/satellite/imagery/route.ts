import { NextRequest, NextResponse } from 'next/server';
import { getProjectImagery } from '@/lib/api/services/planet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { lat, lng } = body;

    if (lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'lat and lng are required' },
        { status: 400 },
      );
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json(
        { error: 'lat and lng must be valid numbers' },
        { status: 400 },
      );
    }

    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { error: 'lat must be between -90 and 90' },
        { status: 400 },
      );
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'lng must be between -180 and 180' },
        { status: 400 },
      );
    }

    let radiusKm = 2;
    if (body.radiusKm !== undefined) {
      const parsedRadius = Number(body.radiusKm);
      if (Number.isNaN(parsedRadius) || parsedRadius < 0 || parsedRadius > 100) {
        return NextResponse.json(
          { error: 'radiusKm must be a number between 0 and 100' },
          { status: 400 },
        );
      }
      radiusKm = parsedRadius;
    }

    const result = await getProjectImagery(
      { lat: latitude, lng: longitude },
      {
        radiusKm,
        startDate: body.startDate,
        endDate: body.endDate,
        maxCloudCover:
          body.maxCloudCover !== undefined
            ? Number(body.maxCloudCover)
            : undefined,
      },
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({
      images: result.images,
      bbox: result.bbox,
    });
  } catch (error) {
    console.error('Error searching satellite imagery:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
