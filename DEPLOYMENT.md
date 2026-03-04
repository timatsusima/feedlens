# Deployment Guide

## Production Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_API_URL` in extension
- [ ] Create production database
- [ ] Set environment variables
- [ ] Test all features end-to-end
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Create backups

## Backend Deployment (Vercel)

### Prerequisites

- Vercel account
- PostgreSQL database (Neon, Supabase, or Railway)

### Steps

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Configure Environment Variables**

Create `.env.production`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
NEXT_PUBLIC_API_URL="https://your-domain.vercel.app"
```

4. **Deploy**

```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

5. **Set Environment Variables in Vercel Dashboard**

- Go to your project settings
- Add `DATABASE_URL`
- Add `NEXT_PUBLIC_API_URL`

6. **Run Database Migration**

```bash
# From your local machine, targeting production DB
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Alternative: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy
railway up
```

## Database Hosting Options

### Option 1: Neon (Recommended)

- Serverless PostgreSQL
- Free tier available
- Good for MVP
- https://neon.tech

### Option 2: Supabase

- PostgreSQL with extras
- Free tier available
- Built-in UI
- https://supabase.com

### Option 3: Railway

- Full PostgreSQL instance
- Simple setup
- $5/month minimum
- https://railway.app

### Option 4: Render

- Free PostgreSQL (90 days)
- Auto-scaling
- https://render.com

## Chrome Extension Deployment

### Prepare for Chrome Web Store

1. **Update manifest.json**

Remove localhost references:

```json
{
  "name": "FeedLens",
  "version": "1.0.0",
  "description": "Publish snapshots of your YouTube recommendations"
}
```

2. **Update API URL in content.ts**

```typescript
const API_URL = 'https://your-production-domain.com';
```

3. **Build Production Version**

```bash
cd extension
npm run build
```

4. **Create Icons**

Ensure you have proper PNG icons:
- icon16.png
- icon48.png
- icon128.png

5. **Create ZIP**

```bash
cd dist
zip -r ../feedlens-extension.zip .
```

### Publish to Chrome Web Store

1. **Create Developer Account**

- Go to https://chrome.google.com/webstore/devconsole
- Pay $5 one-time fee

2. **Upload Extension**

- Click "New Item"
- Upload `feedlens-extension.zip`

3. **Fill Store Listing**

**Title**: FeedLens - YouTube Recommendation Snapshots

**Description**:
```
Publish and share snapshots of your YouTube recommendations.

FeedLens lets you capture your YouTube homepage recommendations in one click and share them with a public link. Perfect for showing others what YouTube recommends to you, comparing recommendations, and understanding content trends.

Features:
• One-click snapshot publishing
• No tracking or cookies
• Public shareable links
• Privacy-first design
• Open source

Privacy:
We only collect public video data visible on YouTube. No cookies, browsing history, or private information is ever collected or stored.
```

**Category**: Social & Communication

**Language**: English

**Screenshots**: (5 required, 1280x800 or 640x400)
1. Extension button on YouTube
2. Collection modal
3. Form filled out
4. Success screen
5. Public snapshot page

**Icon**: Upload 128x128 icon

**Privacy Policy**: Link to your privacy policy page

4. **Submit for Review**

- Review typically takes 1-3 days
- You'll receive email when approved

### Privacy Policy (Required)

Create `privacy-policy.md` or host on your site:

```markdown
# FeedLens Privacy Policy

Last updated: March 2026

## Data We Collect

FeedLens collects only:
- Public YouTube video IDs from your homepage
- Public video titles and channel names
- Optional: Nickname, city, age range, and description you provide

## Data We DON'T Collect

- Cookies
- IP addresses  
- Browsing history
- YouTube account information
- Any private identifiers

## How We Use Data

Your snapshots are:
- Stored in our database
- Made publicly accessible via unique links
- Never sold or shared with third parties

## Data Retention

Snapshots are stored indefinitely unless you request deletion.

## Your Rights

You can request deletion by contacting: akira.kumo@proton.me

## Changes

We'll update this policy as needed. Check back periodically.

## Contact

Questions? Email akira.kumo@proton.me
```

## Domain Configuration

### Custom Domain (Optional)

1. **Register Domain**

- Use Namecheap, Google Domains, or Cloudflare

2. **Configure DNS**

Add these records:
```
A     @     76.76.21.21 (Vercel IP)
CNAME www   cname.vercel-dns.com
```

3. **Add to Vercel**

- Project Settings → Domains
- Add your domain
- Follow verification steps

### SSL Certificate

- Vercel provides automatic HTTPS
- No configuration needed

## Monitoring & Logging

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to layout.tsx:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

Consider:
- Sentry
- LogRocket
- Datadog

### Uptime Monitoring

- UptimeRobot (free)
- Pingdom
- StatusCake

## Performance Optimization

### Database

1. **Add Indexes**

```prisma
model Snapshot {
  // ...
  @@index([createdAt])
  @@index([nickname])
}

model Video {
  // ...
  @@index([snapshotId])
  @@index([videoId])
}
```

2. **Connection Pooling**

Use PgBouncer or Prisma Data Proxy

### Caching

Add Redis for:
- Recent snapshots
- Popular videos
- API responses

### CDN

- Vercel Edge Network (built-in)
- Cloudflare (additional layer)

## Backup Strategy

### Database Backups

Most hosting providers offer automatic backups.

Manual backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Code Backups

- Git repository (already done)
- GitHub provides redundancy

## Security Hardening

### Rate Limiting

Add rate limiting to API:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply to API routes
```

### Input Validation

Already using Zod, but ensure:
- SQL injection protection (Prisma handles this)
- XSS prevention (React escapes by default)
- CSRF protection (not needed for stateless API)

### Environment Variables

Never commit:
- Database URLs
- API keys
- Secrets

Use `.env.local` and Vercel environment variables.

## Costs Estimation

### MVP (0-1K users)

- Vercel: Free (Hobby plan)
- Database: Free (Neon/Supabase)
- Domain: $12/year
- **Total: ~$1/month**

### Growth (1K-10K users)

- Vercel: $20/month (Pro)
- Database: $25/month
- CDN: Included
- **Total: ~$45/month**

### Scale (10K+ users)

- Vercel: $20-100/month
- Database: $50-200/month
- Redis: $10-50/month
- **Total: $80-350/month**

## Post-Deployment

### Monitor

1. Check error rates
2. Monitor response times
3. Watch database size
4. Track extension installs

### Iterate

1. Gather user feedback
2. Fix bugs quickly
3. Plan next features
4. Update documentation

### Promote

1. Post on Reddit (r/youtube, r/dataisbeautiful)
2. Product Hunt launch
3. Twitter/X announcement
4. Dev.to article

## Rollback Plan

If something goes wrong:

```bash
# Rollback Vercel deployment
vercel rollback

# Revert database migration
npx prisma migrate resolve --rolled-back migration_name
```

## Support

Create:
- GitHub Issues for bugs
- Discussions for questions
- Email for privacy concerns

---

**Good luck with your launch! 🚀**
