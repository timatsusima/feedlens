/**
 * FeedLens Chrome Extension - Content Script
 * Listens for messages from the popup and handles:
 *   - Collecting YouTube homepage videos and publishing a snapshot
 *   - Loading and injecting a snapshot feed into the YouTube page
 */

// ─── Types ─────────────────────────────────────────────────────────────────

interface VideoData {
  videoId: string;
  title: string;
  channel: string;
  position: number;
}

interface SnapshotData {
  id: string;
  nickname: string;
  city?: string;
  ageBucket?: string;
  description?: string;
  collectedAt: string;
  surface: string;
  locale?: string;
  timezone?: string;
  collectedCount: number;
  uniqueVideoCount: number;
  duplicateCount: number;
  isPartial: boolean;
  videos: VideoData[];
}

interface SnapshotPayload {
  // User info
  nickname: string;
  city?: string;
  age_bucket?: string;
  description?: string;

  // Collection metadata
  schemaVersion: number;
  surface: 'home' | 'watchnext';
  collectedAt: string;       // ISO 8601
  timezone: string;          // IANA or offset string
  locale: string;            // BCP-47 from navigator.language
  collectorVersion: string;  // "ext/1.0.0"

  // Quality flags (also recomputed server-side)
  targetCount: number;
  collectedCount: number;
  uniqueVideoCount: number;
  duplicateCount: number;
  isPartial: boolean;

  snapshot: VideoData[];
}

interface SimilarSnapshot {
  id: string;
  nickname: string;
  city: string | null;
  ageBucket: string | null;
  thumbs: string[];      // YouTube video IDs for thumbnail previews
  videoCount: number;
}

interface PublishResult {
  id: string;
  removalToken: string;
  similar: SimilarSnapshot[];
}

const API_URL = 'https://feedlens.vercel.app';

// ─── i18n helper ──────────────────────────────────────────────────────────

function t(key: string, substitutions?: string | string[]): string {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

// ─── Message listener (from popup) ────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'publish') {
    handlePublish().then(
      () => sendResponse({ ok: true }),
      (err) => sendResponse({ ok: false, error: String(err) })
    );
    return true;
  }

  if (message.action === 'viewSnapshot') {
    handleViewSnapshot(message.idOrUrl as string).then(
      () => sendResponse({ ok: true }),
      (err) => sendResponse({ ok: false, error: String(err) })
    );
    return true;
  }

  if (message.action === 'exitView') {
    exitViewMode();
    sendResponse({ ok: true });
  }

  if (message.action === 'ping') {
    sendResponse({ ok: true });
  }
});

// ─── Publish flow ──────────────────────────────────────────────────────────

async function handlePublish(): Promise<void> {
  const videos = await collectVideos();

  if (videos.length === 0) {
    throw new Error(t('error_no_videos'));
  }

  showPublishModal(videos);
}

// ─── View flow ─────────────────────────────────────────────────────────────

async function handleViewSnapshot(idOrUrl: string): Promise<void> {
  const snapshotId = parseSnapshotId(idOrUrl);
  if (!snapshotId) throw new Error('Invalid snapshot ID or URL');

  const response = await fetch(`${API_URL}/api/snapshot/${snapshotId}`);
  if (!response.ok) {
    throw new Error(response.status === 404 ? 'Snapshot not found' : 'Failed to load snapshot');
  }

  const snapshot: SnapshotData = await response.json();
  injectFeedOverlay(snapshot);
}

function parseSnapshotId(input: string): string | null {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/snapshot\/([a-f0-9-]{36})/i);
  if (urlMatch) return urlMatch[1];
  if (/^[a-f0-9-]{36}$/.test(trimmed)) return trimmed;
  return null;
}

// ─── Collection metadata helpers ──────────────────────────────────────────

function detectSurface(): 'home' | 'watchnext' {
  const path = window.location.pathname;
  if (path === '/' || path === '') return 'home';
  if (window.location.href.includes('/watch')) return 'watchnext';
  return 'home';
}

function getTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) return tz;
  } catch { /* fall through */ }

  // Fallback: compute UTC offset string
  const offset = -new Date().getTimezoneOffset(); // minutes, positive = east
  const h = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
  const m = (Math.abs(offset) % 60).toString().padStart(2, '0');
  return `${offset >= 0 ? '+' : '-'}${h}:${m}`;
}

function getCollectorVersion(): string {
  try {
    const v = chrome.runtime.getManifest().version;
    return `ext/${v}`;
  } catch {
    return 'ext/1.0.0'; // TODO: keep in sync with manifest
  }
}

// ─── Video collection ──────────────────────────────────────────────────────

async function collectVideos(): Promise<VideoData[]> {
  const TARGET = 50;

  await waitForVideos();
  await scrollToLoadVideos(TARGET);

  const seen = new Set<string>();
  const videos: VideoData[] = [];

  const allWatchLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href*="watch"]')
  ).filter(a => {
    try {
      const url = new URL(a.href);
      return url.searchParams.has('v') && !a.href.includes('/shorts/');
    } catch { return false; }
  });

  for (const link of allWatchLinks) {
    if (videos.length >= TARGET) break;
    try {
      const videoId = new URL(link.href).searchParams.get('v')!;
      if (seen.has(videoId)) continue;

      const card = link.closest(
        'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ' +
        'ytd-compact-video-renderer, ytd-reel-item-renderer, li[class], article'
      );

      const title   = card ? getTitleFromCard(card) : getTitleFromLink(link);
      const channel = card ? getChannelFromCard(card) : 'Unknown Channel';

      seen.add(videoId);
      videos.push({ videoId, title, channel, position: videos.length });
    } catch { continue; }
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  return videos;
}

async function scrollToLoadVideos(target: number): Promise<void> {
  const MAX_WAIT_MS = 20_000; // up to 20 s total
  const SCROLL_STEP = 1200;   // larger jump → more content enters viewport at once
  const PAUSE_MS    = 700;    // give YouTube's lazy-loader time to render new items
  const STUCK_LIMIT = 4;      // give up if count hasn't grown for N consecutive scrolls

  const start = Date.now();
  let lastCount = 0;
  let stuckFor  = 0;

  // Count unique video IDs — mirrors what collectVideos() actually keeps
  const countUniqueVideos = () => {
    const ids = new Set<string>();
    document.querySelectorAll<HTMLAnchorElement>('a[href*="watch?v="]').forEach(a => {
      try {
        const id = new URL(a.href).searchParams.get('v');
        if (id) ids.add(id);
      } catch { /* skip malformed hrefs */ }
    });
    return ids.size;
  };

  while (Date.now() - start < MAX_WAIT_MS) {
    const current = countUniqueVideos();
    if (current >= target) break;

    if (current === lastCount) {
      stuckFor++;
      if (stuckFor >= STUCK_LIMIT) break; // YouTube has nothing more to load
    } else {
      stuckFor  = 0;
      lastCount = current;
    }

    // 'instant' is reliable in content scripts; 'smooth' may not move the
    // viewport before the next iteration fires
    window.scrollBy({ top: SCROLL_STEP, behavior: 'instant' });
    await sleep(PAUSE_MS);
  }

  // Extra pause for any deferred DOM renders after the last network batch
  await sleep(800);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTitleFromCard(card: Element): string {
  const titleAttr = card.querySelector<HTMLAnchorElement>('a#video-title-link')?.getAttribute('title');
  if (titleAttr?.trim()) return titleAttr.trim().substring(0, 200);

  const titleEl = card.querySelector<HTMLElement>('yt-formatted-string#video-title, h3 a[href*="watch?v="]');
  if (titleEl) {
    const clone = titleEl.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer, span[class*="time"]').forEach(n => n.remove());
    const text = clone.textContent?.replace(/\s+/g, ' ').trim();
    if (text && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(text)) return text.substring(0, 200);
  }

  const ariaLabel = card.querySelector<HTMLElement>('a#video-title-link')?.getAttribute('aria-label');
  if (ariaLabel?.trim()) return ariaLabel.trim().substring(0, 200);

  return 'Unknown Title';
}

function getChannelFromCard(card: Element): string {
  const channelLink = card.querySelector<HTMLAnchorElement>(
    'a[href^="/@"], a[href^="/channel/"], a[href^="/user/"]'
  );
  const fromLink = channelLink?.textContent?.replace(/\s+/g, ' ').trim();
  if (fromLink) return fromLink.substring(0, 100);

  const channelEl = card.querySelector<HTMLElement>('ytd-channel-name');
  const fromEl    = channelEl?.textContent?.replace(/\s+/g, ' ').trim();
  if (fromEl) return fromEl.substring(0, 100);

  return 'Unknown Channel';
}

function getTitleFromLink(link: HTMLAnchorElement): string {
  const t = link.getAttribute('title')?.trim() ||
            link.getAttribute('aria-label')?.trim() || '';
  if (t && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(t)) return t.substring(0, 200);
  return 'Unknown Title';
}

function waitForVideos(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector('a[href*="watch?v="]')) { resolve(); return; }
    let attempts = 0;
    const check = () => {
      attempts++;
      if (document.querySelector('a[href*="watch?v="]') || attempts > 50) resolve();
      else setTimeout(check, 100);
    };
    check();
  });
}

// ─── Publish modal ─────────────────────────────────────────────────────────

function showPublishModal(videos: VideoData[]): void {
  removeElement('feedlens-modal');

  // Compute quality flags up-front for display in the modal
  const collectedCount   = videos.length;
  const uniqueIds        = new Set(videos.map(v => v.videoId));
  const uniqueVideoCount = uniqueIds.size;
  const duplicateCount   = collectedCount - uniqueVideoCount;
  const TARGET           = 50;
  const isPartial        = collectedCount < TARGET;

  const qualitySummary = isPartial
    ? `<span class="fl-badge-warn">${t('modal_badge_partial', [String(collectedCount), String(TARGET)])}</span>`
    : `<span class="fl-badge-ok">${t('modal_badge_ok', [String(collectedCount)])}</span>`;

  const modal = document.createElement('div');
  modal.id        = 'feedlens-modal';
  modal.className = 'feedlens-modal';
  modal.innerHTML = `
    <div class="feedlens-modal-content">
      <div class="feedlens-modal-header">
        <h2>${t('modal_title')}</h2>
        <button class="feedlens-modal-close" onclick="document.getElementById('feedlens-modal').remove()">×</button>
      </div>
      <div class="feedlens-modal-body">
        <p class="feedlens-info">
          ${qualitySummary}
          ${duplicateCount > 0 ? `<span class="fl-badge-warn">${t('modal_duplicates', [String(duplicateCount)])}</span>` : ''}
          ${t('modal_collected_suffix')}
        </p>
        <form id="feedlens-form" class="feedlens-form">
          <div class="feedlens-form-group">
            <label for="fl-nickname">${t('modal_lbl_nickname')} <span class="required">*</span></label>
            <input type="text" id="fl-nickname" name="nickname" required maxlength="50"
              placeholder="${t('modal_ph_nickname')}">
          </div>
          <div class="feedlens-form-group">
            <label for="fl-city">${t('modal_lbl_city')}</label>
            <input type="text" id="fl-city" name="city" maxlength="50"
              placeholder="${t('modal_ph_city')}">
          </div>
          <div class="feedlens-form-group">
            <label for="fl-age">${t('modal_lbl_age')}</label>
            <select id="fl-age" name="age_bucket">
              <option value="">${t('modal_opt_age_none')}</option>
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="35-44">35–44</option>
              <option value="45+">45+</option>
            </select>
          </div>
          <div class="feedlens-form-group">
            <label for="fl-desc">${t('modal_lbl_desc')}</label>
            <textarea id="fl-desc" name="description" rows="3" maxlength="500"
              placeholder="${t('modal_ph_desc')}"></textarea>
          </div>
          <div class="feedlens-form-actions">
            <button type="button" onclick="document.getElementById('feedlens-modal').remove()"
              class="feedlens-btn-secondary">${t('modal_btn_cancel')}</button>
            <button type="submit" class="feedlens-btn-primary">${t('modal_btn_publish')}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('#feedlens-form') as HTMLFormElement;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd       = new FormData(form);
    const nickname = (fd.get('nickname') as string)?.trim();
    if (!nickname) { alert(t('modal_alert_no_nickname')); return; }

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    submitBtn.disabled    = true;
    submitBtn.textContent = t('modal_btn_publishing');

    try {
      const payload: SnapshotPayload = {
        nickname,
        snapshot: videos,

        // Collection metadata
        schemaVersion:   1,
        surface:         detectSurface(),
        collectedAt:     new Date().toISOString(),
        timezone:        getTimezone(),
        locale:          navigator.language,
        collectorVersion: getCollectorVersion(),

        // Quality flags
        targetCount:      TARGET,
        collectedCount,
        uniqueVideoCount,
        duplicateCount,
        isPartial,
      };

      const city = (fd.get('city') as string)?.trim();
      const age  = fd.get('age_bucket') as string;
      const desc = (fd.get('description') as string)?.trim();
      if (city) payload.city        = city;
      if (age)  payload.age_bucket  = age;
      if (desc) payload.description = desc;

      const res = await fetch(`${API_URL}/api/snapshot`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }

      const data: PublishResult = await res.json();
      showSuccessScreen(data.id, data.removalToken, data.similar ?? [], city, age);
    } catch (err) {
      alert((err instanceof Error ? err.message : String(err)));
      submitBtn.disabled    = false;
      submitBtn.textContent = t('modal_btn_publish');
    }
  };
}

function showSuccessScreen(
  snapshotId: string,
  removalToken: string,
  similar: SimilarSnapshot[],
  city?: string,
  ageBucket?: string,
): void {
  const modal = document.getElementById('feedlens-modal');
  if (!modal) return;

  const snapshotUrl = `${API_URL}/snapshot/${snapshotId}`;

  // Build personalized Discover deep-link (via unlock-and-redirect route)
  const unlockParams = new URLSearchParams({ id: snapshotId, welcome: '1' });
  if (city)      unlockParams.set('city', city);
  if (ageBucket) unlockParams.set('age', ageBucket);
  const discoverUrl = `${API_URL}/api/unlock-and-redirect?${unlockParams}`;

  // Similar snapshots mini-previews
  const similarHtml = similar.length > 0 ? `
    <div class="feedlens-similar">
      <p class="feedlens-similar-title">${t('success_similar_title')}</p>
      <div class="feedlens-similar-list">
        ${similar.map(s => `
          <a class="feedlens-similar-item" href="${esc(`${API_URL}/snapshot/${s.id}`)}" target="_blank">
            <div class="feedlens-similar-thumbs">
              ${s.thumbs.slice(0, 3).map(id =>
                `<img src="https://img.youtube.com/vi/${esc(id)}/mqdefault.jpg" alt="" loading="lazy">`
              ).join('')}
            </div>
            <span class="feedlens-similar-name">
              ${esc(s.nickname)}${s.city ? ` · ${esc(s.city)}` : ''}${s.ageBucket ? ` · ${esc(s.ageBucket)}` : ''}
            </span>
          </a>
        `).join('')}
      </div>
    </div>
  ` : '';

  modal.innerHTML = `
    <div class="feedlens-modal-content">
      <div class="feedlens-success">
        <h2>${t('success_title')}</h2>
        <p>${t('success_text')}</p>

        <div class="feedlens-success-link">
          <input type="text" id="fl-snap-url" value="${esc(snapshotUrl)}" readonly onclick="this.select()">
          <button onclick="navigator.clipboard.writeText('${esc(snapshotUrl)}');this.textContent='${t('success_btn_copied')}'">
            ${t('success_btn_copy')}
          </button>
        </div>

        ${similarHtml}

        <a href="${esc(discoverUrl)}" target="_blank" class="feedlens-btn-explore">
          ${t('success_explore')}
        </a>

        <div class="feedlens-token-box">
          <p class="feedlens-token-label">${t('success_token_label')}</p>
          <div class="feedlens-success-link">
            <input type="text" id="fl-token" value="${esc(removalToken)}" readonly onclick="this.select()">
            <button onclick="navigator.clipboard.writeText('${esc(removalToken)}');this.textContent='${t('success_btn_copied')}'">
              ${t('success_btn_copy')}
            </button>
          </div>
          <p class="feedlens-token-hint">${t('success_token_hint')}</p>
        </div>

        <div class="feedlens-success-actions">
          <a href="${esc(snapshotUrl)}" target="_blank" class="feedlens-btn-secondary">${t('success_btn_view')}</a>
          <button onclick="document.getElementById('feedlens-modal').remove()" class="feedlens-btn-secondary">
            ${t('success_btn_close')}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ─── Feed overlay (View mode) ──────────────────────────────────────────────

function injectFeedOverlay(snapshot: SnapshotData): void {
  exitViewMode();
  injectBanner(snapshot);

  const overlay     = document.createElement('div');
  overlay.id        = 'feedlens-feed-overlay';
  overlay.className = 'feedlens-feed-overlay';
  overlay.innerHTML = `
    <div class="feedlens-feed-grid">
      ${snapshot.videos.map(renderVideoCard).join('')}
    </div>
  `;

  const target =
    document.querySelector('ytd-browse') ||
    document.querySelector('#primary') ||
    document.querySelector('ytd-rich-grid-renderer');

  if (target) {
    (target as HTMLElement).style.display = 'none';
    target.parentElement?.insertBefore(overlay, target);
  } else {
    document.body.appendChild(overlay);
  }
}

function injectBanner(snapshot: SnapshotData): void {
  const date = new Date(snapshot.collectedAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const meta = [snapshot.city, snapshot.ageBucket].filter(Boolean).join(', ');

  const banner     = document.createElement('div');
  banner.id        = 'feedlens-view-banner';
  banner.className = 'feedlens-view-banner';
  banner.innerHTML = `
    <div class="feedlens-view-banner-inner">
      <div class="feedlens-view-banner-info">
        <span class="feedlens-view-banner-icon">👁</span>
        <div>
          <strong>${t('banner_viewing', [esc(snapshot.nickname)])}</strong>
          ${meta ? `<span class="feedlens-view-banner-meta">${esc(meta)}</span>` : ''}
          <span class="feedlens-view-banner-meta">${date} · ${snapshot.videos.length}</span>
          ${snapshot.description ? `<span class="feedlens-view-banner-desc">${esc(snapshot.description)}</span>` : ''}
        </div>
      </div>
      <div class="feedlens-view-banner-actions">
        <a href="${API_URL}/snapshot/${snapshot.id}" target="_blank"
          class="feedlens-btn-secondary feedlens-btn-sm">${t('banner_open_page')}</a>
        <button class="feedlens-btn-exit" id="feedlens-exit-btn">${t('banner_exit')}</button>
      </div>
    </div>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
  document.getElementById('feedlens-exit-btn')?.addEventListener('click', exitViewMode);
}

function exitViewMode(): void {
  removeElement('feedlens-view-banner');

  const overlay = document.getElementById('feedlens-feed-overlay');
  if (overlay) {
    const target =
      document.querySelector<HTMLElement>('ytd-browse') ||
      document.querySelector<HTMLElement>('#primary') ||
      document.querySelector<HTMLElement>('ytd-rich-grid-renderer');
    if (target) target.style.removeProperty('display');
    overlay.remove();
  }

  chrome.runtime.sendMessage({ action: 'viewExited' }).catch(() => {});
}

function renderVideoCard(video: VideoData): string {
  const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
  const href  = `https://www.youtube.com/watch?v=${video.videoId}`;
  return `
    <a class="feedlens-video-card" href="${href}" target="_blank" rel="noopener noreferrer">
      <div class="feedlens-video-thumb-wrap">
        <img class="feedlens-video-thumb" src="${thumb}" alt="${esc(video.title)}" loading="lazy">
        <span class="feedlens-video-position">#${video.position + 1}</span>
      </div>
      <div class="feedlens-video-meta">
        <div class="feedlens-video-title">${esc(video.title)}</div>
        <div class="feedlens-video-channel">${esc(video.channel)}</div>
      </div>
    </a>
  `;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function removeElement(id: string): void {
  document.getElementById(id)?.remove();
}
