# FeedLens Installation Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Chrome Browser

## Backend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create a PostgreSQL database:

```bash
createdb feedlens
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update with your database credentials:

```
DATABASE_URL="postgresql://username:password@localhost:5432/feedlens?schema=public"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database schema
- Generate Prisma Client

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 6. Verify API

Open http://localhost:3000/api/snapshot - you should see:

```json
{
  "message": "FeedLens API",
  "endpoints": {
    "POST /api/snapshot": "Create a new snapshot"
  }
}
```

## Chrome Extension Setup

### 1. Install Dependencies

```bash
cd extension
npm install
```

### 2. Build Extension

```bash
npm run build
```

This creates a `dist` folder with the compiled extension.

### 3. Create Icons (Optional)

The extension needs icon files. You can:

1. Use the provided `icon.svg` as a template
2. Convert to PNG (16x16, 48x48, 128x128) using:
   - Online: https://cloudconvert.com/svg-to-png
   - CLI: `convert icon.svg -resize 128x128 icon128.png`
3. Place PNG files in the `extension` folder before building

Or create simple placeholder icons:

```bash
# Create simple colored squares as placeholders
convert -size 16x16 xc:red icon16.png
convert -size 48x48 xc:red icon48.png  
convert -size 128x128 xc:red icon128.png
```

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `extension/dist` folder
5. The FeedLens extension should now appear in your extensions list

### 5. Test Extension

1. Navigate to https://www.youtube.com/
2. You should see a "📸 Publish Snapshot" button in the top-right corner
3. Click it to test the snapshot collection

## Production Deployment

### Backend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Update environment variables in Vercel dashboard:
- `DATABASE_URL` - Your production PostgreSQL URL
- `NEXT_PUBLIC_API_URL` - Your production URL

### Extension (Chrome Web Store)

1. Build production version:
```bash
cd extension
npm run build
```

2. Zip the `dist` folder
3. Upload to Chrome Web Store Developer Dashboard

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l`

### Extension Not Loading

- Check console for errors (right-click extension → Inspect)
- Verify `dist` folder exists and contains `manifest.json`
- Reload extension after code changes

### CORS Issues

- Ensure middleware is properly configured
- Update `NEXT_PUBLIC_API_URL` in extension to match backend URL

### Videos Not Collecting

- Verify you're on YouTube homepage
- Check browser console for errors
- YouTube's DOM may have changed - update selectors in `content.ts`

## Development Commands

### Backend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev  # Create new migration
npx prisma db push   # Push schema without migration
```

### Extension

```bash
npm run build        # Build extension
npm run watch        # Watch mode for development
```

## Database Schema

View and manage your data:

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555

## Next Steps

- Add authentication (optional)
- Implement analytics
- Add search functionality
- Create comparison features
- Add embeddings for recommendations
