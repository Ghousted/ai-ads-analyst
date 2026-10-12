import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Clario',
  description: 'Clario turns your Meta Ads and GA4 data into a weekly report your clients can follow, and lets you know when a client might be about to leave.',
  icons: { icon: '/assets/clario-mark-v2.png' },
  openGraph: {
    title: 'Clario: weekly ad reports in plain English',
    description: 'Plain-language ad reports and explainable churn warnings for freelance marketers and small agencies.',
    type: 'website',
    images: ['/assets/clario-mark-v2.png'],
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,900;1,9..40,900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
