import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const Schema = z.object({
  snapshotId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { snapshotId } = Schema.parse(body);

    const snapshot = await prisma.snapshot.findUnique({
      where: { id: snapshotId },
      select: { id: true, nickname: true },
    });

    if (!snapshot) {
      return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
    }

    const cookieStore = await cookies();
    cookieStore.set('feedlens_unlocked', '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    cookieStore.set('feedlens_my_snapshot', snapshotId, {
      httpOnly: false, // readable by JS for display
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ ok: true, nickname: snapshot.nickname });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid snapshot ID' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
