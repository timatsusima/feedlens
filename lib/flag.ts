/**
 * IANA timezone → ISO 3166-1 alpha-2 country code.
 * Covers CIS, Europe, Americas, Asia-Pacific.
 */
const TZ_COUNTRY: Record<string, string> = {
  // ── Kazakhstan ─────────────────────────────────────────────
  'Asia/Almaty':    'KZ', 'Asia/Aqtau':    'KZ', 'Asia/Aqtobe':  'KZ',
  'Asia/Atyrau':   'KZ', 'Asia/Oral':     'KZ', 'Asia/Qostanay':'KZ',
  'Asia/Qyzylorda':'KZ',

  // ── Russia ──────────────────────────────────────────────────
  'Europe/Moscow':        'RU', 'Europe/Kaliningrad':   'RU',
  'Europe/Samara':        'RU', 'Europe/Saratov':       'RU',
  'Europe/Ulyanovsk':     'RU', 'Europe/Volgograd':     'RU',
  'Asia/Yekaterinburg':   'RU', 'Asia/Omsk':            'RU',
  'Asia/Novosibirsk':     'RU', 'Asia/Barnaul':         'RU',
  'Asia/Tomsk':           'RU', 'Asia/Novokuznetsk':    'RU',
  'Asia/Krasnoyarsk':     'RU', 'Asia/Irkutsk':         'RU',
  'Asia/Chita':           'RU', 'Asia/Yakutsk':         'RU',
  'Asia/Vladivostok':     'RU', 'Asia/Magadan':         'RU',
  'Asia/Sakhalin':        'RU', 'Asia/Kamchatka':       'RU',
  'Asia/Anadyr':          'RU', 'Asia/Srednekolymsk':   'RU',
  'Asia/Ust-Nera':        'RU', 'Asia/Khandyga':        'RU',

  // ── CIS ─────────────────────────────────────────────────────
  'Europe/Kyiv':    'UA', 'Europe/Kiev':     'UA',  // both spellings
  'Europe/Minsk':   'BY',
  'Asia/Tashkent':  'UZ', 'Asia/Samarkand':  'UZ',
  'Asia/Bishkek':   'KG',
  'Asia/Dushanbe':  'TJ',
  'Asia/Ashgabat':  'TM',
  'Asia/Baku':      'AZ',
  'Asia/Tbilisi':   'GE',
  'Asia/Yerevan':   'AM',
  'Europe/Chisinau':'MD',

  // ── Baltic ──────────────────────────────────────────────────
  'Europe/Riga':    'LV', 'Europe/Tallinn': 'EE', 'Europe/Vilnius': 'LT',

  // ── Europe ──────────────────────────────────────────────────
  'Europe/London':    'GB', 'Europe/Berlin':   'DE', 'Europe/Paris':    'FR',
  'Europe/Amsterdam':'NL',  'Europe/Warsaw':   'PL', 'Europe/Prague':   'CZ',
  'Europe/Madrid':   'ES',  'Europe/Rome':     'IT', 'Europe/Istanbul': 'TR',
  'Europe/Helsinki': 'FI',  'Europe/Stockholm':'SE', 'Europe/Oslo':     'NO',
  'Europe/Copenhagen':'DK', 'Europe/Zurich':   'CH', 'Europe/Vienna':   'AT',
  'Europe/Brussels': 'BE',  'Europe/Lisbon':   'PT', 'Europe/Athens':   'GR',
  'Europe/Budapest': 'HU',  'Europe/Bucharest':'RO', 'Europe/Sofia':    'BG',
  'Europe/Belgrade': 'RS',  'Europe/Zagreb':   'HR', 'Europe/Sarajevo': 'BA',
  'Europe/Skopje':   'MK',  'Europe/Ljubljana':'SI', 'Europe/Podgorica':'ME',
  'Europe/Tirane':   'AL',

  // ── Americas ────────────────────────────────────────────────
  'America/New_York':    'US', 'America/Chicago':       'US',
  'America/Denver':      'US', 'America/Los_Angeles':   'US',
  'America/Phoenix':     'US', 'America/Anchorage':     'US',
  'Pacific/Honolulu':    'US', 'America/Detroit':       'US',
  'America/Indiana/Indianapolis': 'US',
  'America/Toronto':   'CA', 'America/Vancouver':  'CA',
  'America/Edmonton':  'CA', 'America/Winnipeg':   'CA',
  'America/Halifax':   'CA', 'America/St_Johns':   'CA',
  'America/Sao_Paulo': 'BR', 'America/Fortaleza':  'BR',
  'America/Manaus':    'BR', 'America/Belem':      'BR',
  'America/Mexico_City':'MX','America/Monterrey':  'MX',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Bogota': 'CO', 'America/Lima': 'PE',
  'America/Santiago': 'CL', 'America/Caracas': 'VE',

  // ── Asia ────────────────────────────────────────────────────
  'Asia/Dubai':    'AE', 'Asia/Riyadh':  'SA', 'Asia/Kuwait':  'KW',
  'Asia/Baghdad':  'IQ', 'Asia/Tehran':  'IR',
  'Asia/Karachi':  'PK', 'Asia/Kolkata': 'IN', 'Asia/Calcutta':'IN',
  'Asia/Dhaka':    'BD', 'Asia/Colombo': 'LK',
  'Asia/Kathmandu':'NP', 'Asia/Kabul':   'AF',
  'Asia/Shanghai': 'CN', 'Asia/Urumqi':  'CN', 'Asia/Chongqing':'CN',
  'Asia/Hong_Kong':'HK', 'Asia/Taipei':  'TW',
  'Asia/Tokyo':    'JP', 'Asia/Seoul':   'KR',
  'Asia/Singapore':'SG', 'Asia/Jakarta': 'ID', 'Asia/Makassar':'ID',
  'Asia/Bangkok':  'TH', 'Asia/Phnom_Penh':'KH','Asia/Vientiane':'LA',
  'Asia/Yangon':   'MM', 'Asia/Rangoon': 'MM',
  'Asia/Ho_Chi_Minh':'VN','Asia/Saigon': 'VN',
  'Asia/Kuala_Lumpur':'MY',
  'Asia/Manila':   'PH',
  'Asia/Jerusalem':'IL', 'Asia/Nicosia': 'CY',

  // ── Africa ──────────────────────────────────────────────────
  'Africa/Cairo':     'EG', 'Africa/Nairobi':  'KE',
  'Africa/Lagos':     'NG', 'Africa/Johannesburg':'ZA',
  'Africa/Casablanca':'MA', 'Africa/Tunis':    'TN',

  // ── Pacific ─────────────────────────────────────────────────
  'Australia/Sydney':    'AU', 'Australia/Melbourne':'AU',
  'Australia/Brisbane':  'AU', 'Australia/Perth':    'AU',
  'Australia/Adelaide':  'AU',
  'Pacific/Auckland': 'NZ', 'Pacific/Fiji': 'FJ',
};

/**
 * City name (normalized) → country code.
 * Overrides timezone when user explicitly specifies city (avoids Omsk→KZ, Almaty→RU).
 */
const CITY_COUNTRY: Record<string, string> = {
  // Russia
  'омск': 'RU', 'omsk': 'RU',
  'москва': 'RU', 'moscow': 'RU', 'спб': 'RU', 'санкт-петербург': 'RU',
  'saint petersburg': 'RU',
  'екатеринбург': 'RU', 'yekaterinburg': 'RU', 'новосибирск': 'RU',
  'нижний новгород': 'RU', 'nizhny novgorod': 'RU', 'казань': 'RU', 'самара': 'RU',
  'ростов-на-дону': 'RU', 'rostov-on-don': 'RU', 'красноярск': 'RU', 'владивосток': 'RU',
  'voronezh': 'RU', 'krasnodar': 'RU', 'saratov': 'RU', 'tolyatti': 'RU',
  // Kazakhstan
  'алматы': 'KZ', 'almaty': 'KZ', 'астана': 'KZ', 'astana': 'KZ',
  'нур-султан': 'KZ', 'шымкент': 'KZ', 'shymkent': 'KZ', 'караганда': 'KZ',
  'karaganda': 'KZ', 'aktobe': 'KZ', 'taraz': 'KZ',
  // Ukraine, Belarus, etc.
  'киев': 'UA', 'kyiv': 'UA', 'kiev': 'UA', 'kharkiv': 'UA', 'odesa': 'UA',
  'dnipro': 'UA', 'lviv': 'UA',
  'минск': 'BY', 'minsk': 'BY', 'gomel': 'BY', 'mogilev': 'BY',
  // Major world cities (for dropdown-derived country when not explicitly set)
  'london': 'GB', 'berlin': 'DE', 'paris': 'FR', 'amsterdam': 'NL', 'madrid': 'ES',
  'rome': 'IT', 'vienna': 'AT', 'prague': 'CZ', 'warsaw': 'PL', 'budapest': 'HU',
  'bucharest': 'RO', 'athens': 'GR', 'lisbon': 'PT', 'brussels': 'BE', 'zurich': 'CH',
  'stockholm': 'SE', 'oslo': 'NO', 'copenhagen': 'DK', 'helsinki': 'FI', 'dublin': 'IE',
  'istanbul': 'TR', 'milan': 'IT', 'barcelona': 'ES', 'munich': 'DE', 'hamburg': 'DE',
  'new york': 'US', 'los angeles': 'US', 'chicago': 'US', 'houston': 'US',
  'san francisco': 'US', 'miami': 'US', 'toronto': 'CA', 'vancouver': 'CA',
  'montreal': 'CA', 'mexico city': 'MX', 'são paulo': 'BR', 'rio de janeiro': 'BR',
  'buenos aires': 'AR', 'bogotá': 'CO', 'lima': 'PE', 'santiago': 'CL',
  'tokyo': 'JP', 'seoul': 'KR', 'singapore': 'SG', 'hong kong': 'HK',
  'shanghai': 'CN', 'beijing': 'CN', 'taipei': 'TW', 'bangkok': 'TH',
  'jakarta': 'ID', 'kuala lumpur': 'MY', 'manila': 'PH',
  'ho chi minh city': 'VN', 'mumbai': 'IN', 'delhi': 'IN',
  'dubai': 'AE', 'riyadh': 'SA', 'tel aviv': 'IL', 'cairo': 'EG',
  'sydney': 'AU', 'melbourne': 'AU', 'auckland': 'NZ',
};

export function cityToCountryCode(city?: string | null): string {
  if (!city) return '';
  const k = city.trim().toLowerCase().replace(/\s+/g, ' ');
  return CITY_COUNTRY[k] ?? '';
}

/**
 * Derives a 2-letter country code from an IANA timezone string.
 * "Asia/Almaty" → "KZ"
 */
export function timezoneToCountryCode(tz?: string | null): string {
  if (!tz) return '';
  return TZ_COUNTRY[tz] ?? '';
}

/**
 * Converts a BCP-47 locale tag to a 2-letter country code.
 * "ru-RU" → "RU", "kk-KZ" → "KZ"
 */
export function localeToCountryCode(locale?: string | null): string {
  if (!locale) return '';
  const parts = locale.split('-');
  if (parts.length < 2) return '';
  const cc = parts[parts.length - 1].toUpperCase();
  return /^[A-Z]{2}$/.test(cc) ? cc : '';
}

/**
 * Converts a 2-letter ISO country code to its flag emoji.
 * "KZ" → 🇰🇿, "RU" → 🇷🇺
 */
export function countryCodeToFlag(code?: string | null): string {
  if (!code || code.length !== 2) return '';
  return [...code.toUpperCase()]
    .map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

/**
 * Returns the best flag emoji for a snapshot.
 * Prefers: 1) city (explicit), 2) timezone, 3) locale.
 */
export function snapshotFlag(
  timezone?: string | null,
  locale?: string | null,
  city?: string | null,
): string {
  const cityCode = cityToCountryCode(city);
  if (cityCode) return countryCodeToFlag(cityCode);
  const tzCode = timezoneToCountryCode(timezone);
  if (tzCode) return countryCodeToFlag(tzCode);
  return countryCodeToFlag(localeToCountryCode(locale));
}

/** Legacy helper kept for compat */
export function localeToFlag(locale?: string | null): string {
  return countryCodeToFlag(localeToCountryCode(locale));
}
