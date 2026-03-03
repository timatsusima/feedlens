import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

/**
 * DELETE /api/admin/snapshots/:id
 *
 * Default: soft delete (sets deletedAt + deletionReason="admin")
 * Hard delete: add query param ?hard=1  (physically removes row + cascade videos)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const hard = new URL(request.url).searchParams.get('hard') === '1';

  const snapshot = await prisma.snapshot.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!snapshot) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (hard) {
    await prisma.snapshot.delete({ where: { id } });
    return NextResponse.json({ ok: true, deleted: 'hard' });
  }

  await prisma.snapshot.update({
    where: { id },
    data: {
      deletedAt:      new Date(),
      deletionReason: 'admin',
    },
  });

  return NextResponse.json({ ok: true, deleted: 'soft' });
}
