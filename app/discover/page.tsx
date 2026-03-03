import { cookies } from 'next/headers';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';
import UnlockGate from './UnlockGate';

interface PageProps {
  searchParams: Promise<{ welcome?: string; city?: string; age?: string }>;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const d = getDictionary(locale);
  return {
    title: `${d.discover.title} · FeedLens`,
    description: d.discover.subtitle,
  };
}

const CARD_SELECT = {
  id: true, nickname: true, city: true, ageBucket: true,
  description: true, createdAt: true, locale: true, isPartial: true,
  videos: { take: 4, orderBy: { position: 'asc' as const }, select: { videoId: true } },
  _count: { select: { videos: true } },
};

export default async function DiscoverPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const d = getDictionary(locale);
  const dis = d.discover;

  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get('feedlens_unlocked')?.value === '1';

  if (!isUnlocked) {
    return <UnlockGate d={d} />;
  }

  // Welcome mode params (from unlock-and-redirect route)
  const params = await searchParams;
  const isWelcome   = params.welcome === '1';
  const welcomeCity = typeof params.city === 'string' ? params.city : undefined;
  const welcomeAge  = typeof params.age  === 'string' ? params.age  : undefined;

  // Fetch "similar" snapshots for welcome banner
  type SnapRow = Awaited<ReturnType<typeof prisma.snapshot.findMany<{ select: typeof CARD_SELECT }>>>[number];

  let welcomeSnaps: SnapRow[] = [];
  if (isWelcome) {
    if (welcomeCity || welcomeAge) {
      welcomeSnaps = await prisma.snapshot.findMany({
        where: {
          deletedAt: null,
          ...(welcomeCity ? { city: welcomeCity } : {}),
          ...(welcomeAge  ? { ageBucket: welcomeAge } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: CARD_SELECT,
      });
    }
    // Fallback: just grab the 3 latest if nothing matched
    if (welcomeSnaps.length === 0) {
      welcomeSnaps = await prisma.snapshot.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: CARD_SELECT,
      });
    }
  }

  // Main feed
  const snapshots = await prisma.snapshot.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 24,
    select: CARD_SELECT,
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }).format(date);

  const SnapshotCard = ({ snapshot }: { snapshot: SnapRow }) => (
    <Link key={snapshot.id} href={`/snapshot/${snapshot.id}`} className="discover-card">
      <div className="discover-card-thumbs">
        {snapshot.videos.map(v => (
          <img
            key={v.videoId}
            src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
            alt=""
            className="discover-card-thumb"
            loading="lazy"
          />
        ))}
        {snapshot._count.videos > 4 && (
          <div className="discover-card-more">+{snapshot._count.videos - 4}</div>
        )}
      </div>
      <div className="discover-card-info">
        <div className="discover-card-meta">
          <span className="discover-card-name">{snapshot.nickname}</span>
          {snapshot.city      && <span className="discover-card-tag">📍 {snapshot.city}</span>}
          {snapshot.ageBucket && <span className="discover-card-tag">🎂 {snapshot.ageBucket}</span>}
          {snapshot.locale    && <span className="discover-card-tag">🌐 {snapshot.locale}</span>}
        </div>
        {snapshot.description && (
          <p className="discover-card-desc">{snapshot.description}</p>
        )}
        <div className="discover-card-footer">
          <span>
            {snapshot._count.videos} {dis.videosLabel}
            {snapshot.isPartial && (
              <span style={{ marginLeft: 4, color: '#b45309', fontSize: '0.72rem', fontWeight: 700 }}>
                {dis.partial}
              </span>
            )}
          </span>
          <span>{formatDate(snapshot.createdAt)}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <main className="container">
      {/* ── Welcome banner ─────────────────────────────────────────────── */}
      {isWelcome && (
        <div className="welcome-banner">
          <div className="welcome-banner-text">
            <h2 className="welcome-banner-title">{dis.welcomeTitle}</h2>
            <p className="welcome-banner-subtitle">
              {welcomeSnaps.length > 0 ? dis.welcomeText : dis.welcomeNoSimilar}
            </p>
          </div>

          {welcomeSnaps.length > 0 && (
            <>
              <h3 className="welcome-section-title">
                {dis.welcomeSimilarTitle}
                {(welcomeCity || welcomeAge) && (
                  <span className="welcome-filter-badge">
                    {[welcomeCity, welcomeAge].filter(Boolean).join(' · ')}
                  </span>
                )}
              </h3>
              <div className="discover-grid welcome-grid">
                {welcomeSnaps.map(s => <SnapshotCard key={s.id} snapshot={s} />)}
              </div>
              <h3 className="welcome-section-title welcome-all-title">{dis.welcomeAllTitle}</h3>
            </>
          )}
        </div>
      )}

      {/* ── Main header ────────────────────────────────────────────────── */}
      <div className="discover-header">
        <div>
          <h1 className="discover-title">{dis.title}</h1>
          <p className="discover-subtitle">{dis.subtitle}</p>
        </div>
        <Link href="/" className="button button-sm">{dis.publishBtn}</Link>
      </div>

      {/* ── Main feed ──────────────────────────────────────────────────── */}
      {snapshots.length === 0 ? (
        <p className="discover-empty">{dis.empty}</p>
      ) : (
        <div className="discover-grid">
          {snapshots.map(s => <SnapshotCard key={s.id} snapshot={s} />)}
        </div>
      )}
    </main>
  );
}
