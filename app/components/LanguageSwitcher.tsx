'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/lib/locale';

interface Props {
  current: Locale;
  label: string; // "RU" or "EN" — what to show (the OTHER language)
}

export default function LanguageSwitcher({ current, label }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const next: Locale = current === 'en' ? 'ru' : 'en';

  async function switchLocale() {
    await fetch('/api/set-locale', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ locale: next }),
    });
    startTransition(() => { router.refresh(); });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="lang-switcher"
      title={next === 'ru' ? 'Переключить на русский' : 'Switch to English'}
    >
      {label}
    </button>
  );
}
