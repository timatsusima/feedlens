import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const [totalSnapshots, totalVideos, snapshotsToday, snapshotsThisWeek, uniqueCities] =
    await Promise.all([
      prisma.snapshot.count(),
      prisma.video.count(),
      prisma.snapshot.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.snapshot.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.snapshot.groupBy({ by: ['city'], where: { city: { not: null } } }),
    ]);

  return NextResponse.json({
    totalSnapshots,
    totalVideos,
    snapshotsToday,
    snapshotsThisWeek,
    uniqueCities: uniqueCities.length,
  });
}
