'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────

interface Stats {
  totalSnapshots: number;
  totalVideos: number;
  snapshotsToday: number;
  snapshotsThisWeek: number;
  uniqueCities: number;
}

interface SnapshotRow {
  id: string;
  nickname: string;
  city: string | null;
  ageBucket: string | null;
  description: string | null;
  createdAt: string;
  deletedAt: string | null;
  deletionReason: string | null;
  surface: string;
  locale: string | null;
  collectedCount: number;
  isPartial: boolean;
  _count: { videos: number };
}

interface SnapshotsResponse {
  snapshots: SnapshotRow[];
  total: number;
  page: number;
  pages: number;
  includeDeleted: boolean;
}

// ─── Login ────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setError('Invalid password'); return; }
      onLogin();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">🔑 FeedLens Admin</h1>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Admin password"
            className="admin-input"
            required
            autoFocus
          />
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [data, setData] = useState<SnapshotsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchSnapshots = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (query) params.set('q', query);
    if (includeDeleted) params.set('includeDeleted', '1');
    const res = await fetch(`/api/admin/snapshots?${params}`);
    if (res.ok) setData(await res.json());
  }, [page, query, includeDeleted]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchSnapshots(); }, [fetchSnapshots]);

  async function handleDelete(id: string, nickname: string, hard = false) {
    const msg = hard
      ? `HARD delete "${nickname}"? This permanently removes all data and cannot be undone.`
      : `Soft-delete snapshot by "${nickname}"? It will be hidden but can be reviewed.`;
    if (!confirm(msg)) return;
    setDeleting(id);
    try {
      const url = hard ? `/api/admin/snapshots/${id}?hard=1` : `/api/admin/snapshots/${id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        await fetchSnapshots();
        await fetchStats();
      }
    } finally {
      setDeleting(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    onLogout();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  }

  const fmt = (d: string) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

  return (
    <main className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">📊 FeedLens Admin</h1>
        <button onClick={handleLogout} className="admin-btn admin-btn-ghost">Logout</button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.totalSnapshots}</div>
            <div className="admin-stat-label">Total Snapshots</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.snapshotsToday}</div>
            <div className="admin-stat-label">Today</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.snapshotsThisWeek}</div>
            <div className="admin-stat-label">This Week</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.totalVideos.toLocaleString()}</div>
            <div className="admin-stat-label">Total Videos</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.uniqueCities}</div>
            <div className="admin-stat-label">Cities</div>
          </div>
        </div>
      )}

      {/* Search + Table */}
      <div className="admin-section">
        <div className="admin-toolbar">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by nickname…"
              className="admin-input"
            />
            <button type="submit" className="admin-btn admin-btn-primary">Search</button>
            {query && (
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => { setSearch(''); setQuery(''); setPage(1); }}
              >
                Clear
              </button>
            )}
          </form>
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={e => { setIncludeDeleted(e.target.checked); setPage(1); }}
            />
            <span>Show deleted</span>
          </label>
          {data && (
            <span className="admin-count">{data.total} snapshot{data.total !== 1 ? 's' : ''}</span>
          )}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nickname</th>
                <th>Surface / Locale</th>
                <th>City</th>
                <th>Age</th>
                <th>Videos</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data && (
                <tr><td colSpan={7} className="admin-loading">Loading…</td></tr>
              )}
              {data?.snapshots.length === 0 && (
                <tr><td colSpan={7} className="admin-loading">No snapshots found</td></tr>
              )}
              {data?.snapshots.map(s => (
                <tr key={s.id} className={`admin-row${s.deletedAt ? ' admin-row-deleted' : ''}`}>
                  <td className="admin-td-nick">
                    <a href={`/snapshot/${s.id}`} target="_blank" rel="noopener noreferrer">
                      {s.nickname}
                    </a>
                    {s.deletedAt && (
                      <span className="admin-badge-deleted" title={s.deletionReason ?? ''}>
                        deleted
                      </span>
                    )}
                    {s.isPartial && (
                      <span className="admin-badge-partial">partial</span>
                    )}
                    {s.description && (
                      <span className="admin-td-desc" title={s.description}>
                        {s.description.substring(0, 60)}{s.description.length > 60 ? '…' : ''}
                      </span>
                    )}
                  </td>
                  <td className="admin-td-date">
                    <span>{s.surface}</span>
                    {s.locale && <span style={{ display: 'block', color: '#aaa', fontSize: '0.75rem' }}>{s.locale}</span>}
                  </td>
                  <td>{s.city ?? '—'}</td>
                  <td>{s.ageBucket ?? '—'}</td>
                  <td className="admin-td-num">
                    {s._count.videos}
                    {s.collectedCount > 0 && s.collectedCount !== s._count.videos && (
                      <span style={{ color: '#aaa', fontSize: '0.75rem' }}> /{s.collectedCount}</span>
                    )}
                  </td>
                  <td className="admin-td-date">{fmt(s.createdAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <a
                        href={`/snapshot/${s.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-sm admin-btn-ghost"
                      >
                        View
                      </a>
                      {!s.deletedAt && (
                        <button
                          onClick={() => handleDelete(s.id, s.nickname)}
                          disabled={deleting === s.id}
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          title="Soft delete"
                        >
                          {deleting === s.id ? '…' : 'Delete'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(s.id, s.nickname, true)}
                        disabled={deleting === s.id}
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        title="Hard delete (permanent)"
                        style={{ opacity: 0.6 }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="admin-pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="admin-btn admin-btn-ghost"
            >
              ← Prev
            </button>
            <span className="admin-page-info">Page {page} of {data.pages}</span>
            <button
              disabled={page === data.pages}
              onClick={() => setPage(p => p + 1)}
              className="admin-btn admin-btn-ghost"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Root Component ────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Quick auth check by hitting a protected endpoint
    fetch('/api/admin/stats')
      .then(r => setAuthenticated(r.ok))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return <main className="admin-login-page"><p style={{ color: '#666' }}>Loading…</p></main>;
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />;
}
