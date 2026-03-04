import { Suspense } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';
import { snapshotFlag } from '@/lib/flag';
import UnlockGate from './UnlockGate';
import DiscoverFilters, { type FilterValues } from './DiscoverFilters';

interface PageProps {
  searchParams: Promise<{
    welcome?: string; city?: string; age?: string;
    q?: string; country?: string;
  }>;
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
  description: true, createdAt: true, locale: true, timezone: true,
  country: true, isPartial: true,
  videos: { take: 4, orderBy: { position: 'asc' as const }, select: { videoId: true } },
  _count: { select: { videos: true } },
};

const AGE_BUCKETS = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

export default async function DiscoverPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const d = getDictionary(locale);
  const dis = d.discover;

  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get('feedlens_unlocked')?.value === '1';

  if (!isUnlocked) {
    return <UnlockGate d={d} />;
  }

  const params = await searchParams;
  const isWelcome   = params.welcome === '1';
  const welcomeCity = typeof params.city    === 'string' ? params.city    : undefined;
  const welcomeAge  = typeof params.age     === 'string' ? params.age     : undefined;

  // Filter params
  const fq       = typeof params.q       === 'string' ? params.q.trim()              : '';
  const fCity    = typeof params.city    === 'string' && !isWelcome ? params.city.trim()   : '';
  const fAge     = typeof params.age     === 'string' && !isWelcome ? params.age.trim()    : '';
  const fCountry = typeof params.country === 'string' ? params.country.trim().toUpperCase() : '';

  // When we're in welcome mode, city/age params are for the banner, not for filters
  const filterCity    = isWelcome ? '' : fCity;
  const filterAge     = isWelcome ? '' : fAge;

  const filterValues: FilterValues = {
    q: fq, city: filterCity, age: filterAge, country: fCountry,
  };

  const hasFilters = fq || filterCity || filterAge || fCountry;

  // Build Prisma WHERE
  const baseWhere = {
    deletedAt: null as null,
    ...(fq         ? { nickname:  { contains: fq,            mode: 'insensitive' as const } } : {}),
    ...(filterCity ? { city:      { contains: filterCity,    mode: 'insensitive' as const } } : {}),
    ...(filterAge  ? { ageBucket: filterAge } : {}),
    ...(fCountry   ? { country: fCountry } : {}),
  };

  // Welcome banner snapshots
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
    where: baseWhere,
    orderBy: { createdAt: 'desc' },
    take: 48,
    select: CARD_SELECT,
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }).format(date);

  const SnapshotCard = ({ snapshot }: { snapshot: SnapRow }) => {
    const flag = snapshotFlag(snapshot.timezone, snapshot.locale, snapshot.city);
    return (
      <Link href={`/snapshot/${snapshot.id}`} className="discover-card">
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
            {flag && <span className="discover-card-flag">{flag}</span>}
            <span className="discover-card-name">{snapshot.nickname}</span>
            {snapshot.city      && <span className="discover-card-tag">📍 {snapshot.city}</span>}
            {snapshot.ageBucket && <span className="discover-card-tag">🎂 {snapshot.ageBucket}</span>}
          </div>
          {snapshot.description && (
            <p className="discover-card-desc">{snapshot.description}</p>
          )}
          <div className="discover-card-footer">
            <span>
              {snapshot._count.videos} {dis.videosLabel}
              {snapshot.isPartial && (
                <span style={{ marginLeft: 4, color: '#ca8a04', fontSize: '0.72rem', fontWeight: 700 }}>
                  {dis.partial}
                </span>
              )}
            </span>
            <span>{formatDate(snapshot.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  };

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

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="discover-header">
        <div>
          <h1 className="discover-title">{dis.title}</h1>
          <p className="discover-subtitle">{dis.subtitle}</p>
        </div>
        <Link href="/" className="button button-sm">{dis.publishBtn}</Link>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <Suspense>
        <DiscoverFilters
          values={filterValues}
          ageBuckets={AGE_BUCKETS}
          placeholder={{ q: dis.filterQPh, city: dis.filterCityPh, country: dis.filterCountryPh }}
          labels={{
            q:       dis.filterQ,
            city:    dis.filterCity,
            country: dis.filterCountry,
            age:     dis.filterAge,
            clear:   dis.filterClear,
          }}
        />
      </Suspense>

      {/* ── Results count (when filtering) ─────────────────────────────── */}
      {hasFilters && (
        <p className="discover-results-count">
          {snapshots.length} {dis.filterResults}
        </p>
      )}

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
