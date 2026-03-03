import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/unlock-and-redirect?id=UUID&city=X&age=Y
 *
 * Called by the Chrome Extension after publishing a snapshot.
 * 1. Validates the snapshot exists in the DB.
 * 2. Sets feedlens_unlocked cookie for the website.
 * 3. Redirects to /discover?welcome=1&city=X&age=Y so the user
 *    immediately sees a personalized "people like you" section.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const snapshotId = searchParams.get('id') ?? '';
  const city       = searchParams.get('city') ?? '';
  const age        = searchParams.get('age') ?? '';

  // Validate UUID format
  if (!/^[0-9a-f-]{36}$/i.test(snapshotId)) {
    return NextResponse.redirect(new URL('/discover', request.url));
  }

  const snapshot = await prisma.snapshot.findUnique({
    where: { id: snapshotId, deletedAt: null },
    select: { id: true },
  });

  if (!snapshot) {
    return NextResponse.redirect(new URL('/discover', request.url));
  }

  // Set unlock cookies
  const cookieStore = await cookies();
  cookieStore.set('feedlens_unlocked', '1', {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  cookieStore.set('feedlens_my_snapshot', snapshotId, {
    httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });

  // Build personalized Discover URL
  const discoverParams = new URLSearchParams({ welcome: '1' });
  if (city)  discoverParams.set('city', city);
  if (age)   discoverParams.set('age', age);

  const redirectUrl = new URL(`/discover?${discoverParams}`, request.url);
  return NextResponse.redirect(redirectUrl);
}
