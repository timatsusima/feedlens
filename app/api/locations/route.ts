import { NextResponse } from 'next/server';
import { COUNTRIES, CITIES, CITIES_BY_COUNTRY } from '@/lib/locations';

export async function GET() {
  return NextResponse.json({
    countries: COUNTRIES,
    cities: CITIES,
    citiesByCountry: CITIES_BY_COUNTRY,
  });
}
