import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/token';
import { checkRateLimit } from '@/lib/rateLimiter';

const Schema = z.object({
  token:  z.string().min(1).max(128),
  reason: z.string().max(500).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting — hash the IP, never store raw
  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '0.0.0.0';

  if (!checkRateLimit(rawIp)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { token, reason } = Schema.parse(body);

    const snapshot = await prisma.snapshot.findUnique({
      where: { id },
      select: { deletedAt: true, deletionTokenHash: true },
    });

    if (!snapshot || snapshot.deletedAt !== null) {
      return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
    }

    if (!snapshot.deletionTokenHash) {
      // Snapshot predates the token system; cannot use token-based removal
      return NextResponse.json(
        { error: 'This snapshot was created before removal tokens were introduced. Contact the admin.' },
        { status: 422 }
      );
    }

    const tokenHash = hashToken(token);
    if (tokenHash !== snapshot.deletionTokenHash) {
      return NextResponse.json({ error: 'Invalid removal token.' }, { status: 403 });
    }

    await prisma.snapshot.update({
      where: { id },
      data: {
        deletedAt:     new Date(),
        deletionReason: reason?.trim() || 'user_request',
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error processing removal request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
