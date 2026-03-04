import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateRemovalToken } from '@/lib/token';
import { timezoneToCountryCode, cityToCountryCode } from '@/lib/flag';

// ─── Types ────────────────────────────────────────────────────────────────

interface SimilarSnapshot {
  id: string;
  nickname: string;
  city: string | null;
  ageBucket: string | null;
  thumbs: string[];    // first 3 YouTube video IDs
  videoCount: number;
}

// ─── Zod schemas ──────────────────────────────────────────────────────────

const VideoSchema = z.object({
  videoId:  z.string().min(1).max(20),
  title:    z.string().min(1).max(200),
  channel:  z.string().min(1).max(100),
  position: z.number().int().min(0),
});

const SnapshotSchema = z.object({
  nickname:    z.string().min(1).max(50).trim(),
  city:        z.string().max(50).trim().optional(),
  age_bucket:  z.enum(['18-24', '25-34', '35-44', '45+']).optional(),
  description: z.string().max(500).trim().optional(),

  snapshot: z.array(VideoSchema).min(1).max(100),

  schemaVersion:    z.number().int().min(1).default(1),
  surface:          z.enum(['home', 'watchnext']).default('home'),
  collectedAt:      z.string().datetime({ offset: true }).optional(),
  timezone:         z.string().max(50).optional(),
  locale:           z.string().max(20).optional(),
  targetCount:      z.number().int().min(1).max(500).default(50),
  collectorVersion: z.string().max(50).optional(),

  // Client-computed flags (recomputed server-side)
  collectedCount:   z.number().int().optional(),
  uniqueVideoCount: z.number().int().optional(),
  duplicateCount:   z.number().int().optional(),
  isPartial:        z.boolean().optional(),
});

// ─── Similar snapshot query ────────────────────────────────────────────────

const SIMILAR_SELECT = {
  id: true, nickname: true, city: true, ageBucket: true,
  videos: { take: 3, orderBy: { position: 'asc' as const }, select: { videoId: true } },
  _count: { select: { videos: true } },
};

async function findSimilar(params: {
  excludeId: string;
  city?: string | null;
  ageBucket?: string | null;
}): Promise<SimilarSnapshot[]> {
  const { excludeId, city, ageBucket } = params;
  const found = new Map<string, (typeof SIMILAR_SELECT extends object ? unknown : never)>();

  type Row = {
    id: string; nickname: string; city: string | null; ageBucket: string | null;
    videos: { videoId: string }[]; _count: { videos: number };
  };

  const rows: Row[] = [];

  // Round 1: exact match (city + ageBucket)
  if (city && ageBucket && rows.length < 3) {
    const r = await prisma.snapshot.findMany({
      where: { deletedAt: null, id: { not: excludeId }, city, ageBucket },
      orderBy: { createdAt: 'desc' }, take: 3, select: SIMILAR_SELECT,
    });
    r.forEach(s => { if (!found.has(s.id)) { found.set(s.id, s); rows.push(s as Row); } });
  }

  // Round 2: city only
  if (city && rows.length < 3) {
    const seen = [excludeId, ...rows.map(r => r.id)];
    const r = await prisma.snapshot.findMany({
      where: { deletedAt: null, id: { notIn: seen }, city },
      orderBy: { createdAt: 'desc' }, take: 3 - rows.length, select: SIMILAR_SELECT,
    });
    r.forEach(s => { if (!found.has(s.id)) { found.set(s.id, s); rows.push(s as Row); } });
  }

  // Round 3: latest (fallback)
  if (rows.length < 3) {
    const seen = [excludeId, ...rows.map(r => r.id)];
    const r = await prisma.snapshot.findMany({
      where: { deletedAt: null, id: { notIn: seen } },
      orderBy: { createdAt: 'desc' }, take: 3 - rows.length, select: SIMILAR_SELECT,
    });
    r.forEach(s => { if (!found.has(s.id)) rows.push(s as Row); });
  }

  return rows.slice(0, 3).map(s => ({
    id:         s.id,
    nickname:   s.nickname,
    city:       s.city,
    ageBucket:  s.ageBucket,
    thumbs:     s.videos.map(v => v.videoId),
    videoCount: s._count.videos,
  }));
}

// ─── POST /api/snapshot ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = SnapshotSchema.parse(body);

    // Quality flags recomputed server-side
    const videos         = data.snapshot;
    const collectedCount = videos.length;
    const uniqueIds      = new Set(videos.map(v => v.videoId));
    const uniqueVideoCount = uniqueIds.size;
    const duplicateCount = collectedCount - uniqueVideoCount;
    const targetCount    = data.targetCount;
    const isPartial      = collectedCount < targetCount;

    const { raw: removalToken, hash: deletionTokenHash } = generateRemovalToken();

    const snapshot = await prisma.snapshot.create({
      data: {
        nickname:    data.nickname,
        city:        data.city ?? null,
        ageBucket:   data.age_bucket ?? null,
        description: data.description ?? null,

        schemaVersion: data.schemaVersion,
        surface:       data.surface,
        collectedAt:   data.collectedAt ? new Date(data.collectedAt) : new Date(),
        timezone:      data.timezone ?? null,
        locale:        data.locale ?? null,
        country:       cityToCountryCode(data.city) || timezoneToCountryCode(data.timezone) || null,

        targetCount, collectedCount, uniqueVideoCount, duplicateCount, isPartial,
        collectorVersion: data.collectorVersion ?? null,
        deletionTokenHash,

        videos: {
          create: videos.map(v => ({
            videoId: v.videoId, title: v.title, channel: v.channel, position: v.position,
          })),
        },
      },
      select: { id: true },
    });

    // Find similar snapshots to show in extension success screen
    const similar = await findSimilar({
      excludeId: snapshot.id,
      city:      data.city,
      ageBucket: data.age_bucket,
    });

    return NextResponse.json(
      {
        success: true,
        id:           snapshot.id,
        url:          `/snapshot/${snapshot.id}`,
        removalToken,
        similar,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error creating snapshot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── GET /api/snapshot — health check ────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    message: 'FeedLens API', version: 2,
    endpoints: {
      'POST /api/snapshot':                     'Create a new snapshot',
      'GET  /api/snapshot/:id':                 'Get snapshot by ID',
      'POST /api/snapshot/:id/request-removal': 'Request snapshot deletion',
    },
  });
}
