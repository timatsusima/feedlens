/**
 * Converts a BCP-47 locale tag (e.g. "ru-RU", "en-US", "kk-KZ")
 * to the corresponding country flag emoji (e.g. 🇷🇺, 🇺🇸, 🇰🇿).
 * Returns empty string when locale is absent or country code is unknown.
 */
export function localeToFlag(locale?: string | null): string {
  if (!locale) return '';
  const parts = locale.split('-');
  if (parts.length < 2) return '';
  const country = parts[parts.length - 1].toUpperCase();
  if (country.length !== 2 || !/^[A-Z]{2}$/.test(country)) return '';
  // Regional Indicator Symbol Letters: 🇦 = U+1F1E6, offset by char code of 'A' (65)
  return [...country]
    .map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

/**
 * Extracts the 2-letter country code from a locale tag.
 * "ru-RU" → "RU", "kk-KZ" → "KZ"
 */
export function localeToCountryCode(locale?: string | null): string {
  if (!locale) return '';
  const parts = locale.split('-');
  if (parts.length < 2) return '';
  const country = parts[parts.length - 1].toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : '';
}
