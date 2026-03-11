'use client';

import { useState } from 'react';
import { EXTENSION_CHROME_STORE_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import type { Dict } from '@/lib/dictionaries';

interface Props {
  d: Dict;
}

export default function UnlockGate({ d }: Props) {
  const g = d.gate;
  const router = useRouter();
  const [snapshotId, setSnapshotId] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Extract UUID from either raw ID or full URL
    const raw = snapshotId.trim();
    const uuidMatch = raw.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    const id = uuidMatch ? uuidMatch[1] : raw;

    try {
      const res = await fetch('/api/unlock', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ snapshotId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ? g.errNotFound : g.errNotFound);
        return;
      }

      router.refresh();
    } catch {
      setError(g.errNetwork);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="gate-page">
      <div className="gate-card">
        <div className="gate-icon">{g.icon}</div>
        <h1 className="gate-title">{g.title}</h1>
        <p className="gate-subtitle">
          {g.subtitle.split('\n').map((line, i) => (
            <span key={i}>{line}{i < g.subtitle.split('\n').length - 1 && <br />}</span>
          ))}
        </p>

        {/* Why block */}
        <div className="gate-why">
          <strong>{g.whyTitle}</strong>
          <p>{g.whyText}</p>
        </div>

        <div className="gate-steps">
          <div className="gate-step">
            <span className="gate-step-num">1</span>
            <div>
              <strong>
                <a href={EXTENSION_CHROME_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {g.step1Title}
                </a>
              </strong>
              <p>{g.step1Text}</p>
            </div>
          </div>
          <div className="gate-step">
            <span className="gate-step-num">2</span>
            <div>
              <strong>{g.step2Title}</strong>
              <p>{g.step2Text}</p>
            </div>
          </div>
          <div className="gate-step">
            <span className="gate-step-num">3</span>
            <div>
              <strong>{g.step3Title}</strong>
              <p>{g.step3Text}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="gate-form">
          <label htmlFor="snapshot-id" className="gate-label">
            {g.inputLabel}
          </label>
          <input
            id="snapshot-id"
            type="text"
            value={snapshotId}
            onChange={e => setSnapshotId(e.target.value)}
            placeholder={g.inputPlaceholder}
            className="gate-input"
            required
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="gate-error">{error}</p>}
          <button type="submit" disabled={loading} className="gate-btn">
            {loading ? g.btnVerify : g.btnUnlock}
          </button>
        </form>
      </div>
    </main>
  );
}
