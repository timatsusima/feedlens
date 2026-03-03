import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid snapshot ID' }, { status: 400 });
    }

    const snapshot = await prisma.snapshot.findUnique({
      where: { id },
      include: {
        videos: { orderBy: { position: 'asc' } },
      },
    });

    // Treat soft-deleted snapshots as not found
    if (!snapshot || snapshot.deletedAt !== null) {
      return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
    }

    // Strip internal fields before returning
    const { deletionTokenHash: _hash, ...safeSnapshot } = snapshot;

    return NextResponse.json(safeSnapshot);
  } catch (error) {
    console.error('Error fetching snapshot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
