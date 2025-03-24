import type { Metadata } from 'next';
import './globals.css';

import { Toaster } from '@/components/ui/sonner';
import { TanstackQueryProviders } from '@/providers';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Your Site Name',
    template: '%s | Your Site Name',
  },
  description: 'Your site description goes here',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.yourdomain.com',
    siteName: 'Your Site Name',
    images: [
      {
        url: 'https://www.yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Og Image Alt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yoursite',
    creator: '@yourhandle',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <Suspense fallback={null}>
          <TanstackQueryProviders>
            {children}
            <Toaster />
          </TanstackQueryProviders>
        </Suspense>
      </body>
    </html>
  );
}
