import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const siteUrl = 'https://greenshillings.org';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B7A3D', // Brand forest green
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GREENSHILLINGS | Advocacy-led Climate Action for Tanzania',
    template: '%s | GREENSHILLINGS',
  },
  description:
    'GREENSHILLINGS is an advocacy-led climate organization in Tanzania, building locally led pilot projects and integrity infrastructure for carbon finance.',
  keywords: [
    'carbon finance',
    'Tanzania',
    'climate action',
    'carbon projects',
    'community development',
    'advocacy',
    'NGO',
    'carbon market reform',
    'equitable climate finance',
  ],
  authors: [{ name: 'GREENSHILLINGS' }],
  creator: 'GREENSHILLINGS',
  publisher: 'GREENSHILLINGS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'GREENSHILLINGS',
    title: 'GREENSHILLINGS | Advocacy-led Climate Action for Tanzania',
    description:
      'GREENSHILLINGS is an advocacy-led climate organization in Tanzania, building locally led pilot projects and integrity infrastructure for carbon finance.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GREENSHILLINGS - Advocacy-led climate action for Tanzania',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GREENSHILLINGS | Advocacy-led Climate Action for Tanzania',
    description:
      'GREENSHILLINGS is an advocacy-led climate organization in Tanzania, building locally led pilots.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'GREENSHILLINGS',
  url: siteUrl,
  description:
    'Advocacy-led climate organization in Tanzania, building locally led pilot projects and integrity infrastructure for carbon finance.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MW',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Tanzania',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-chalk font-sans text-gray antialiased">{children}</body>
    </html>
  );
}
