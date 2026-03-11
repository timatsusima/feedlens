import { NextResponse } from 'next/server';
import { COUNTRIES, CITIES } from '@/lib/locations';

export async function GET() {
  return NextResponse.json({
    countries: COUNTRIES,
    cities: CITIES,
  });
}
