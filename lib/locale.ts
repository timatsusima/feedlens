import { cookies, headers } from 'next/headers';

export type Locale = 'en' | 'ru';

/**
 * Determine the active locale:
 * 1. Explicit cookie (user chose)
 * 2. Accept-Language header auto-detection
 * 3. Default: English
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get('feedlens_locale')?.value;
  if (fromCookie === 'ru' || fromCookie === 'en') return fromCookie;

  const headersList = await headers();
  const acceptLang = headersList.get('accept-language') ?? '';
  if (/\bru\b/i.test(acceptLang)) return 'ru';

  return 'en';
}
