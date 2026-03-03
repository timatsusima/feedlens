import type { Metadata } from 'next';
import './globals.css';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';
import LanguageSwitcher from './components/LanguageSwitcher';

export const metadata: Metadata = {
  title: 'FeedLens — YouTube Recommendation Snapshots',
  description: 'Publish and explore snapshots of YouTube recommendations',
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
      </body>
    </html>
  );
}
