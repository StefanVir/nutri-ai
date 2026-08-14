import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/components.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'NutriAI — Intelligent Nutrition & The Swipe Machine',
  description: 'Platformă web Mobile-First de nutriție inteligentă, generare de mese prin Swipe & Matchup Showdown și calcul automat de macronutrienți.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07090e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={plusJakarta.variable}>
      <body className={plusJakarta.className}>
        <div className="app-shell">
          <div className="mobile-frame">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
