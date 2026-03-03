/**
 * FeedLens Popup Script
 * Communicates with the content script via chrome.tabs.sendMessage
 */

// ─── i18n helper ──────────────────────────────────────────────────────────

function tp(key: string, substitutions?: string | string[]): string {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

/** Apply translations to all elements with data-i18n / data-i18n-placeholder. */
function applyI18n(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')!;
    const msg = tp(key);
    if (msg !== key) el.textContent = msg;
  });

  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')!;
    const msg = tp(key);
    if (msg !== key) el.placeholder = msg;
  });
}

// ─── State ─────────────────────────────────────────────────────────────────

let isViewing = false;

async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}

async function isYouTube(tab: chrome.tabs.Tab): Promise<boolean> {
  return !!tab.url?.includes('youtube.com');
}

async function sendToContent(message: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const tab = await getActiveTab();
  if (!tab?.id) return { ok: false, error: 'No active tab' };
  try {
    const res = await chrome.tabs.sendMessage(tab.id, message);
    return res ?? { ok: true };
  } catch {
    return { ok: false, error: tp('popup_error_not_ready') };
  }
}

function showError(msg: string): void {
  const el = document.getElementById('view-error')!;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError(): void {
  const el = document.getElementById('view-error')!;
  el.style.display = 'none';
}

function setViewingState(nickname: string): void {
  isViewing = true;

  const bar   = document.getElementById('viewing-bar')!;
  const label = document.getElementById('viewing-label')!;
  label.textContent = tp('popup_viewing_label', [nickname]);
  bar.style.display       = 'flex';
  bar.style.flexDirection = 'column';

  (document.getElementById('snapshot-input') as HTMLInputElement).disabled = true;
  document.querySelector<HTMLButtonElement>('.btn-view')!.disabled = true;
}

function clearViewingState(): void {
  isViewing = false;

  document.getElementById('viewing-bar')!.style.display = 'none';

  const input = document.getElementById('snapshot-input') as HTMLInputElement;
  input.disabled = false;
  input.value    = '';

  document.querySelector<HTMLButtonElement>('.btn-view')!.disabled = false;
  hideError();
}

// ─── Init ──────────────────────────────────────────────────────────────────

async function init(): Promise<void> {
  applyI18n();

  const tab = await getActiveTab();

  if (!tab || !(await isYouTube(tab))) {
    document.getElementById('not-youtube')!.style.display = 'block';
    document.getElementById('main-content')!.style.display = 'none';
    return;
  }

  // ── Publish button ──
  document.getElementById('publish-btn')!.addEventListener('click', async () => {
    const btn = document.getElementById('publish-btn') as HTMLButtonElement;
    btn.disabled    = true;
    btn.textContent = tp('popup_btn_scrolling');

    const res = await sendToContent({ action: 'publish' });

    if (!res.ok) {
      btn.disabled    = false;
      btn.textContent = tp('popup_btn_publish');
      showError(res.error ?? tp('popup_error_collecting'));
    } else {
      window.close();
    }
  });

  // ── View form ──
  document.getElementById('view-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const input = document.getElementById('snapshot-input') as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    const viewBtn = document.querySelector<HTMLButtonElement>('.btn-view')!;
    viewBtn.disabled    = true;
    viewBtn.textContent = tp('popup_btn_loading');

    const res = await sendToContent({ action: 'viewSnapshot', idOrUrl: value });

    if (!res.ok) {
      viewBtn.disabled    = false;
      viewBtn.textContent = tp('popup_btn_load');
      showError(res.error ?? tp('popup_error_load_failed'));
    } else {
      const uuidMatch = value.match(/([a-f0-9-]{36})/i);
      setViewingState(uuidMatch ? '…' : '…');
      viewBtn.textContent = tp('popup_btn_load');

      // Fetch nickname for display
      if (uuidMatch) {
        fetch(`http://localhost:3000/api/snapshot/${uuidMatch[1]}`)
          .then(r => r.json())
          .then(data => { if (data.nickname) setViewingState(data.nickname); })
          .catch(() => {});
      }
    }
  });

  // ── Exit view button ──
  document.getElementById('exit-view-btn')!.addEventListener('click', async () => {
    await sendToContent({ action: 'exitView' });
    clearViewingState();
  });
}

// Listen for exitView events from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'viewExited') {
    clearViewingState();
  }
});

// Suppress unused var warning
void isViewing;

init();
