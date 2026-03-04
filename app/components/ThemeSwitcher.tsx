'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface Props {
  labels: { light: string; dark: string; system: string };
}

export default function ThemeSwitcher({ labels }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (theme ?? 'dark') as Theme;
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTheme(e.target.value as Theme);
    },
    [setTheme],
  );

  if (!mounted) {
    return (
      <div className="theme-switcher" aria-hidden="true">
        <select className="theme-switcher-select" disabled defaultValue="dark">
          <option value="dark">{labels.dark}</option>
        </select>
      </div>
    );
  }

  return (
    <div className="theme-switcher">
      <label htmlFor="theme-select" className="theme-switcher-label">
        <span className="theme-switcher-icon">
          {resolvedTheme === 'light' ? '☀️' : '🌙'}
        </span>
      </label>
      <select
        id="theme-select"
        className="theme-switcher-select"
        value={current}
        onChange={handleChange}
        aria-label={labels.dark}
      >
        <option value="light">{labels.light}</option>
        <option value="dark">{labels.dark}</option>
        <option value="system">{labels.system}</option>
      </select>
    </div>
  );
}
