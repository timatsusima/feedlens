import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page           = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit          = 20;
  const search         = searchParams.get('q') ?? '';
  const includeDeleted = searchParams.get('includeDeleted') === '1';

  const baseWhere = includeDeleted
    ? {}
    : { deletedAt: null };

  const where = search
    ? { ...baseWhere, nickname: { contains: search, mode: 'insensitive' as const } }
    : baseWhere;

  const [snapshots, total] = await Promise.all([
    prisma.snapshot.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { videos: true } } },
    }),
    prisma.snapshot.count({ where }),
  ]);

  return NextResponse.json({
    snapshots,
    total,
    page,
    pages: Math.ceil(total / limit),
    includeDeleted,
  });
}
