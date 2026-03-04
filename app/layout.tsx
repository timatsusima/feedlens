import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeSwitcher from './components/ThemeSwitcher';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://feedlens.vercel.app';

export const metadata: Metadata = {
  title: 'FeedLens — YouTube Recommendation Snapshots',
  description: 'Publish your YouTube feed and explore what others are watching. Anonymous, open-source, privacy-first.',
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    siteName: 'FeedLens',
    type: 'website',
    url: BASE_URL,
    title: 'FeedLens — YouTube Recommendation Snapshots',
    description: 'Publish your YouTube feed and explore what others are watching. Anonymous, open-source, privacy-first.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FeedLens — YouTube Recommendation Snapshots',
    description: 'See what YouTube recommends to people around the world.',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const d = getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <nav className="site-nav">
            <a href="/" className="site-nav-logo">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{display:'inline-block',verticalAlign:'middle',marginRight:7,marginBottom:2}}>
                <rect width="20" height="20" rx="5" fill="#ff0000"/>
                <circle cx="10" cy="10" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="1.5" fill="white"/>
              </svg>
              Feed<span>Lens</span>
            </a>
            <a href="/discover" className="site-nav-link">{d.nav.discover}</a>
            <div className="site-nav-right">
              <ThemeSwitcher labels={{ light: d.nav.themeLight, dark: d.nav.themeDark, system: d.nav.themeSystem }} />
              <LanguageSwitcher current={locale} label={d.nav.langSwitch} />
            </div>
          </nav>
        {children}
        <footer className="site-footer">
          <span>© 2026 FeedLens</span>
          <a href="/privacy">{d.nav.privacy}</a>
        </footer>
        <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
