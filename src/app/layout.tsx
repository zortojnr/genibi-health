import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GENIBI NT Healthcare Plus',
  description: 'Complete Web-Based Health Companion for Mental Well-Being and Healthcare Management',
  keywords: [
    'mental health',
    'healthcare',
    'telemedicine',
    'AI assistant',
    'Nigeria',
    'wellness',
    'medical records',
    'appointments'
  ],
  authors: [{ name: 'GENIBI Team' }],
  creator: 'GENIBI Team',
  publisher: 'GENIBI Healthcare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://genibi-health.com'),
  openGraph: {
    title: 'GENIBI NT Healthcare Plus',
    description: 'Complete Web-Based Health Companion for Mental Well-Being and Healthcare Management',
    url: 'https://genibi-health.com',
    siteName: 'GENIBI NT Healthcare Plus',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GENIBI NT Healthcare Plus',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GENIBI NT Healthcare Plus',
    description: 'Complete Web-Based Health Companion for Mental Well-Being and Healthcare Management',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#14b8a6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GENIBI Health" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#14b8a6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} antialiased bg-neutral-50 text-neutral-900`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#171717',
                border: '1px solid #e5e5e5',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '12px 16px',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
