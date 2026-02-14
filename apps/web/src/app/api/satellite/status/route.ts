import { NextResponse } from 'next/server';
import { isPlanetEnabled } from '@/lib/api/services/planet';

export function GET() {
  return NextResponse.json({
    data: {
      enabled: isPlanetEnabled(),
      capabilities: {
        imagery: true,
        ndviAnalysis: true,
        carbonEstimation: true,
        verification: true,
      },
    },
  });
}
