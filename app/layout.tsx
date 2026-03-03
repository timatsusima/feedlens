import type { Metadata } from 'next';
import './globals.css';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';
import LanguageSwitcher from './components/LanguageSwitcher';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://feedlens.vercel.app';

export const metadata: Metadata = {
  title: 'FeedLens — YouTube Recommendation Snapshots',
  description: 'Publish your YouTube feed and explore what others are watching. Anonymous, open-source, privacy-first.',
  metadataBase: new URL(BASE_URL),
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
    <html lang={locale}>
      <body>
        <nav className="site-nav">
          <a href="/" className="site-nav-logo">📸 FeedLens</a>
          <a href="/discover" className="site-nav-link">{d.nav.discover}</a>
          <div className="site-nav-right">
            <LanguageSwitcher current={locale} label={d.nav.langSwitch} />
          </div>
        </nav>
        {children}
        <footer className="site-footer">
          <span>© 2026 FeedLens</span>
          <a href="/privacy">{d.nav.privacy}</a>
        </footer>
      </body>
    </html>
  );
}
