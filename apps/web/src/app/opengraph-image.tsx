import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GREENSHILLING - Advocacy-led climate action for Tanzania';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          padding: '80px',
        }}
      >
        {/* Green accent bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '48px',
              backgroundColor: '#16a34a',
              borderRadius: '4px',
            }}
          />
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            GREENSHILLING
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '900px',
          }}
        >
          <span
            style={{
              fontSize: '56px',
              fontWeight: 600,
              color: '#0f172a',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            Advocacy-led climate action for Tanzania
          </span>
          <span
            style={{
              fontSize: '24px',
              color: '#64748b',
              lineHeight: 1.5,
            }}
          >
            Designing equitable, high-integrity carbon projects that ensure climate finance reaches
            the communities who restore the land.
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: '#16a34a',
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
