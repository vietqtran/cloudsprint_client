import './globals.css';
import 'ldrs/react/Ring.css';

import React, { Suspense } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { TanstackQueryProviders } from '@/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Cloud Sprint',
    template: '%s | Cloud Sprint',
  },
  description: 'Your site description goes here',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cloudsprint.com',
    siteName: 'Cloud Sprint',
    images: [
      {
        url: 'https://cloudsprint/og-image.jpg',
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
