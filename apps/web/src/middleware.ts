import { NextResponse, NextRequest } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, x-admin-key, x-partner-key-id, x-partner-key, x-webhook-secret',
};

const ALLOWED_ORIGINS = [
  'https://greenshilling.org',
  'https://www.greenshilling.org',
  'http://localhost:3000',
  'http://localhost:4001',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow Vercel preview deployments
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // CORS handling for API routes
  if (pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');

    // If no origin or origin not allowed, skip CORS headers
    if (!origin || !isAllowedOrigin(origin)) {
      // Still allow the request (same-origin requests have no Origin header)
      if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200 });
      }
      return NextResponse.next();
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: { ...CORS_HEADERS, 'Access-Control-Allow-Origin': origin },
      });
    }

    // Add CORS headers to response (skip basic auth for API routes)
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    return response;
  }

  // Basic auth for staging/preview protection (non-API routes only)
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) return NextResponse.next();

  const header = req.headers.get('authorization');
  if (header && header.startsWith('Basic ')) {
    const base64Credentials = header.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString();
    const [providedUser, providedPass] = credentials.split(':');
    if (providedUser === user && providedPass === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|health).*)'],
};
