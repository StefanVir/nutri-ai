import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/components.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NutriAI — Intelligent Nutrition & The Swipe Machine',
  description: 'Platformă web Mobile-First de nutriție inteligentă, generare de mese prin Swipe & Matchup Showdown și calcul automat de macronutrienți.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07090e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={plusJakartaSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={plusJakartaSans.className}>
        <div className="app-shell">
          <div className="mobile-frame">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

