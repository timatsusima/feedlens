'use client';

import { useState } from 'react';
import type { Dict } from '@/lib/dictionaries';

interface Props {
  snapshotId: string;
  d: Dict;
}

export default function RemovalModal({ snapshotId, d }: Props) {
  const r = d.removal;
  const [open, setOpen]       = useState(false);
  const [token, setToken]     = useState('');
  const [reason, setReason]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/snapshot/${snapshotId}/request-removal`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token: token.trim(), reason: reason.trim() || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? r.errFallback);
        return;
      }

      setDone(true);
    } catch {
      setError(r.errNetwork);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="removal-trigger">
        {r.triggerBtn}
      </button>
    );
  }

  return (
    <div className="removal-backdrop" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="removal-modal" role="dialog" aria-modal="true">
        <div className="removal-header">
          <h2 className="removal-title">{r.title}</h2>
          <button className="removal-close" onClick={() => setOpen(false)} aria-label={r.closeLabel}>×</button>
        </div>

        {done ? (
          <div className="removal-success">
            <p className="removal-success-icon">✅</p>
            <p><strong>{r.doneTitle}</strong> {r.doneText}</p>
            <p className="removal-success-note">{r.doneNote}</p>
          </div>
        ) : (
          <>
            <p className="removal-desc">
              {r.desc.split('\n').map((line, i) => (
                <span key={i}>{i === 0 ? <><strong>{line.split(' ').slice(0, 4).join(' ')}</strong>{' ' + line.split(' ').slice(4).join(' ')}</> : line}{i === 0 && <br />}</span>
              ))}
            </p>

            <form onSubmit={handleSubmit} className="removal-form">
              <label htmlFor="removal-token" className="removal-label">{r.tokenLabel}</label>
              <input
                id="removal-token"
                type="text"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder={r.tokenPh}
                required
                className="removal-input removal-input-mono"
                autoComplete="off"
                spellCheck={false}
              />

              <label htmlFor="removal-reason" className="removal-label">
                {r.reasonLabel}{' '}
                <span style={{ fontWeight: 400, color: '#909090' }}>{r.reasonOptional}</span>
              </label>
              <textarea
                id="removal-reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={r.reasonPh}
                maxLength={500}
                rows={3}
                className="removal-input removal-textarea"
              />

              {error && <p className="removal-error">{error}</p>}

              <div className="removal-actions">
                <button type="button" onClick={() => setOpen(false)} className="removal-btn-cancel">
                  {r.btnCancel}
                </button>
                <button type="submit" disabled={loading || !token.trim()} className="removal-btn-submit">
                  {loading ? r.btnVerifying : r.btnRemove}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
