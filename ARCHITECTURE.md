# Project Structure

```
FeedLens/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API Routes
│   │   └── snapshot/
│   │       └── route.ts          # POST /api/snapshot - Create snapshot
│   ├── snapshot/                 # Public snapshot pages
│   │   └── [id]/
│   │       ├── page.tsx          # Snapshot detail page
│   │       └── not-found.tsx     # 404 page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
│
├── extension/                    # Chrome Extension (Manifest v3)
│   ├── manifest.json             # Extension manifest
│   ├── content.ts                # Content script (main logic)
│   ├── styles.css                # Extension styles
│   ├── package.json              # Extension dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── icon.svg                  # Icon template
│   └── README.md                 # Extension docs
│
├── lib/                          # Shared utilities
│   └── prisma.ts                 # Prisma client singleton
│
├── prisma/                       # Database
│   └── schema.prisma             # Database schema
│
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── INSTALLATION.md               # Setup guide
├── middleware.ts                 # Next.js middleware (CORS)
├── next.config.js                # Next.js config
├── package.json                  # Backend dependencies
├── README.md                     # Project overview
└── tsconfig.json                 # TypeScript config
```

## Key Files Explained

### Backend

**`app/api/snapshot/route.ts`**
- POST endpoint for creating snapshots
- Validates data with Zod
- Stores snapshot + videos in PostgreSQL
- Returns snapshot ID and URL

**`app/snapshot/[id]/page.tsx`**
- Dynamic route for viewing snapshots
- Server-side rendered
- Fetches snapshot data from database
- Displays videos with thumbnails

**`lib/prisma.ts`**
- Singleton Prisma client
- Prevents multiple instances in development
- Used across API routes and pages

**`middleware.ts`**
- Handles CORS for API routes
- Allows requests from Chrome extension
- Responds to preflight OPTIONS requests

**`prisma/schema.prisma`**
- Database schema definition
- Two models: Snapshot and Video
- One-to-many relationship

### Chrome Extension

**`extension/content.ts`**
- Main content script injected into YouTube
- Adds "Publish Snapshot" button
- Collects video data from DOM
- Shows modal form
- Posts data to API
- Displays success screen

**`extension/manifest.json`**
- Extension configuration
- Permissions: activeTab, youtube.com
- Content scripts configuration
- Extension metadata

**`extension/styles.css`**
- Styles for button and modal
- Clean, modern UI
- Responsive design

## Data Flow

1. **User clicks button** → `content.ts` injects button
2. **Collects videos** → Scrapes YouTube DOM for video data
3. **Shows modal** → User fills in nickname, city, age, description
4. **Posts to API** → `POST /api/snapshot`
5. **Validates data** → Zod schema validation
6. **Saves to DB** → Prisma creates Snapshot + Videos
7. **Returns URL** → `/snapshot/{id}`
8. **Shows success** → User can copy/share link
9. **Public page** → Anyone can view at `/snapshot/{id}`

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Extension**: Chrome Manifest v3, TypeScript
- **Validation**: Zod
- **Styling**: CSS (no framework for minimal bundle)

## API Endpoints

### POST /api/snapshot

Create a new snapshot.

**Request:**
```json
{
  "nickname": "string (required, max 50)",
  "city": "string (optional, max 50)",
  "age_bucket": "18-24 | 25-34 | 35-44 | 45+ (optional)",
  "description": "string (optional, max 500)",
  "snapshot": [
    {
      "videoId": "string (max 20)",
      "title": "string (max 200)",
      "channel": "string (max 100)",
      "position": "number (0-49)"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid",
  "url": "/snapshot/{id}"
}
```

### GET /snapshot/[id]

View a public snapshot (server-rendered page).

## Database Schema

### Snapshot
- `id` - UUID (primary key)
- `nickname` - String (required)
- `city` - String (optional)
- `ageBucket` - String (optional)
- `description` - Text (optional)
- `createdAt` - DateTime (auto)
- `videos` - Relation to Video[]

### Video
- `id` - UUID (primary key)
- `snapshotId` - UUID (foreign key)
- `videoId` - String (YouTube video ID)
- `title` - String
- `channel` - String
- `position` - Integer

## Privacy & Security

### What We Collect
✅ Public video IDs from YouTube homepage
✅ Public video titles and channels
✅ User-provided nickname (anonymous)
✅ Optional: city, age range, description

### What We DON'T Collect
❌ Cookies
❌ IP addresses
❌ User accounts
❌ Browsing history
❌ Private identifiers
❌ Authentication tokens

### Security Measures
- Input validation with Zod
- SQL injection protection (Prisma)
- CORS configuration
- No authentication required (privacy-first)
