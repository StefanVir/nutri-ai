import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

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
    <html lang="ro">
      <body>
        <div className="app-shell">
          <div className="mobile-frame">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
