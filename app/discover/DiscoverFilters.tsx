'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export interface FilterValues {
  q:       string;
  city:    string;
  age:     string;
  country: string;
}

interface Props {
  values:      FilterValues;
  placeholder: { q: string };
  labels:      { q: string; city: string; age: string; country: string; clear: string };
  ageBuckets:  string[];
  cities:      string[];
  countries:   { code: string; name: string }[];
}

export default function DiscoverFilters({ values, placeholder, labels, ageBuckets, cities, countries }: Props) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else        params.delete(key);
      // Reset to page 1 on any filter change
      params.delete('page');
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  const hasFilters = values.q || values.city || values.age || values.country;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ['q', 'city', 'age', 'country', 'page'].forEach(k => params.delete(k));
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  };

  return (
    <div className={`discover-filters${pending ? ' discover-filters--loading' : ''}`}>
      {/* Name search */}
      <div className="discover-filter-field">
        <label className="discover-filter-label">{labels.q}</label>
        <input
          className="discover-filter-input"
          type="search"
          placeholder={placeholder.q}
          defaultValue={values.q}
          onChange={e => update('q', e.target.value)}
        />
      </div>

      {/* City */}
      <div className="discover-filter-field">
        <label className="discover-filter-label">{labels.city}</label>
        <select
          className="discover-filter-select"
          value={values.city}
          onChange={e => update('city', e.target.value)}
        >
          <option value="">—</option>
          {values.city && !cities.includes(values.city) && (
            <option value={values.city}>{values.city}</option>
          )}
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div className="discover-filter-field">
        <label className="discover-filter-label">{labels.country}</label>
        <select
          className="discover-filter-select discover-filter-select--country"
          value={values.country}
          onChange={e => update('country', e.target.value)}
        >
          <option value="">—</option>
          {values.country && !countries.some(c => c.code === values.country) && (
            <option value={values.country}>{values.country}</option>
          )}
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Age bucket */}
      <div className="discover-filter-field">
        <label className="discover-filter-label">{labels.age}</label>
        <select
          className="discover-filter-select"
          value={values.age}
          onChange={e => update('age', e.target.value)}
        >
          <option value="">—</option>
          {ageBuckets.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button className="discover-filter-clear" onClick={clearAll} type="button">
          {labels.clear} ×
        </button>
      )}
    </div>
  );
}
