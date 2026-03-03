import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';
import RemovalModal from './RemovalModal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SnapshotPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const d = getDictionary(locale);
  const s = d.snapshot;

  const snapshot = await prisma.snapshot.findUnique({
    where: { id },
    include: { videos: { orderBy: { position: 'asc' } } },
  });

  if (!snapshot || snapshot.deletedAt !== null) notFound();

  const fmtDate = (date: Date, tz?: string | null) =>
    new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: tz && isValidTZ(tz) ? tz : undefined,
    }).format(date);

  const fmtDateShort = (date: Date) =>
    new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(date);

  const surfaceLabel = snapshot.surface === 'watchnext' ? s.surfaceWatch : s.surfaceHome;
  const qualityOk    = !snapshot.isPartial && snapshot.duplicateCount === 0;

  const dupLabel = snapshot.duplicateCount === 1 ? s.duplicate : s.duplicates;

  return (
    <main className="container">
      <div className="snapshot-container">

        {/* ── Header ── */}
        <div className="snapshot-header">
          <h1>{s.title}</h1>
          <div className="snapshot-meta">
            <span>👤 {snapshot.nickname}</span>
            {snapshot.city      && <span>📍 {snapshot.city}</span>}
            {snapshot.ageBucket && <span>🎂 {snapshot.ageBucket}</span>}
            {snapshot.locale    && <span>🌐 {snapshot.locale}</span>}
            <span>📅 {fmtDateShort(snapshot.createdAt)}</span>
            <span>🎬 {snapshot.videos.length} {locale === 'ru' ? 'видео' : 'videos'}</span>
          </div>
          {snapshot.description && (
            <p className="snapshot-description">{snapshot.description}</p>
          )}
        </div>

        {/* ── Metadata block ── */}
        <div className="snapshot-meta-block">
          <div className="snapshot-meta-row">
            <span className="snapshot-meta-key">{s.surface}</span>
            <span className="snapshot-meta-val">{surfaceLabel}</span>
          </div>
          <div className="snapshot-meta-row">
            <span className="snapshot-meta-key">{s.capturedAt}</span>
            <span className="snapshot-meta-val">
              {fmtDate(snapshot.collectedAt, snapshot.timezone)}
              {snapshot.timezone && (
                <span className="snapshot-meta-tz"> {snapshot.timezone}</span>
              )}
            </span>
          </div>
          {snapshot.locale && (
            <div className="snapshot-meta-row">
              <span className="snapshot-meta-key">{s.locale}</span>
              <span className="snapshot-meta-val">{snapshot.locale}</span>
            </div>
          )}
          {snapshot.collectorVersion && (
            <div className="snapshot-meta-row">
              <span className="snapshot-meta-key">{s.collector}</span>
              <span className="snapshot-meta-val">{snapshot.collectorVersion}</span>
            </div>
          )}
        </div>

        {/* ── Quality block ── */}
        <div className={`snapshot-quality${qualityOk ? ' snapshot-quality-ok' : ' snapshot-quality-warn'}`}>
          <span className="snapshot-quality-title">
            {qualityOk ? s.qualityOk : s.qualityWarn}
          </span>
          <div className="snapshot-quality-stats">
            <span>
              <strong>{snapshot.collectedCount}</strong>/{snapshot.targetCount} {s.collected}
            </span>
            <span>
              <strong>{snapshot.uniqueVideoCount}</strong> {s.unique}
            </span>
            {snapshot.duplicateCount > 0 && (
              <span className="snapshot-quality-dup">
                {snapshot.duplicateCount} {dupLabel}
              </span>
            )}
            {snapshot.isPartial && (
              <span className="snapshot-quality-badge-partial">{s.partial}</span>
            )}
          </div>
        </div>

        {/* ── Video grid ── */}
        <div className="video-grid">
          {snapshot.videos.map(video => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-card"
            >
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                alt={video.title}
                className="video-thumbnail"
                loading="lazy"
              />
              <div className="video-info">
                <div className="video-title">{video.title}</div>
                <div className="video-channel">{video.channel}</div>
                <div className="video-position">#{video.position + 1}</div>
              </div>
            </a>
          ))}
        </div>

        {/* ── Footer: removal ── */}
        <div className="snapshot-footer">
          <p className="snapshot-footer-note">{s.footerNote}</p>
          <RemovalModal snapshotId={id} d={d} />
        </div>

      </div>
    </main>
  );
}

function isValidTZ(tz: string): boolean {
  try { Intl.DateTimeFormat(undefined, { timeZone: tz }); return true; }
  catch { return false; }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();

  const snapshot = await prisma.snapshot.findUnique({
    where: { id },
    select: { nickname: true, city: true, deletedAt: true },
  });

  if (!snapshot || snapshot.deletedAt) {
    return { title: locale === 'ru' ? 'Снапшот не найден' : 'Snapshot Not Found' };
  }

  const city = snapshot.city ? (locale === 'ru' ? ` из ${snapshot.city}` : ` from ${snapshot.city}`) : '';
  return {
    title: `${snapshot.nickname} · FeedLens`,
    description: locale === 'ru'
      ? `Рекомендации YouTube пользователя ${snapshot.nickname}${city}`
      : `${snapshot.nickname}'s YouTube recommendations${city}`,
  };
}
