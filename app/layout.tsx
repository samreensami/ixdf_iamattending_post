import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IxDF AI Summit Badge Generator',
  description: 'Generate your official attendance badge for AI Summit Lahore 2026',
  openGraph: {
    title: 'IxDF AI Summit Badge Generator',
    description: 'Generate your official attendance badge for AI Summit Lahore 2026',
    images: [
      {
        url: '/templates/ixdf_logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'IxDF Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}