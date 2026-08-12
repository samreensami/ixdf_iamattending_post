import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IxDF AI Summit Badge Generator',
  description: 'Generate your official attendance badge for AI Summit Lahore 2026',
  icons: {
    icon: '/favicon.ico', // Apex / Custom favicon (Vercel logo hataane ke liye)
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'IxDF AI Summit Badge Generator',
    description: 'Generate your official attendance badge for AI Summit Lahore 2026',
    images: [
      {
        url: '/templates/template.png', // Jab link share ho toh Vercel card ki jagah Poster dikhe
        width: 1200,
        height: 630,
        alt: 'AI Summit Badge Generator',
      },
    ],
  },
};