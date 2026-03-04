'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface Props {
  labels: { light: string; dark: string; system: string };
}

const ICONS = {
  light: '☀️',
  dark:  '🌙',
  system: '💻',
} as const;

export default function ThemeSwitcher({ labels }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const current = (theme ?? 'dark') as Theme;
  const displayIcon = resolvedTheme === 'light' ? ICONS.light : ICONS.dark;
  const displayLabel = current === 'system' ? labels.system : current === 'light' ? labels.light : labels.dark;

  const handleSelect = useCallback(
    (value: Theme) => {
      setTheme(value);
      setOpen(false);
    },
    [setTheme],
  );

  if (!mounted) {
    return (
      <div className="theme-switcher">
        <button className="theme-switcher-trigger" type="button" disabled>
          <span className="theme-switcher-trigger-icon">🌙</span>
          <span className="theme-switcher-trigger-label">{labels.dark}</span>
          <span className="theme-switcher-trigger-arrow">▾</span>
        </button>
      </div>
    );
  }

  return (
    <div className="theme-switcher" ref={menuRef}>
      <button
        type="button"
        className="theme-switcher-trigger"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={displayLabel}
      >
        <span className="theme-switcher-trigger-icon">{displayIcon}</span>
        <span className="theme-switcher-trigger-label">{displayLabel}</span>
        <span className="theme-switcher-trigger-arrow">▾</span>
      </button>
      {open && (
        <div className="theme-switcher-menu" role="listbox">
          <button
            type="button"
            className={`theme-switcher-option${current === 'light' ? ' theme-switcher-option--active' : ''}`}
            onClick={() => handleSelect('light')}
            role="option"
            aria-selected={current === 'light'}
          >
            <span className="theme-switcher-option-icon">{ICONS.light}</span>
            {labels.light}
          </button>
          <button
            type="button"
            className={`theme-switcher-option${current === 'dark' ? ' theme-switcher-option--active' : ''}`}
            onClick={() => handleSelect('dark')}
            role="option"
            aria-selected={current === 'dark'}
          >
            <span className="theme-switcher-option-icon">{ICONS.dark}</span>
            {labels.dark}
          </button>
          <button
            type="button"
            className={`theme-switcher-option${current === 'system' ? ' theme-switcher-option--active' : ''}`}
            onClick={() => handleSelect('system')}
            role="option"
            aria-selected={current === 'system'}
          >
            <span className="theme-switcher-option-icon">{ICONS.system}</span>
            {labels.system}
          </button>
        </div>
      )}
    </div>
  );
}
