# 🚀 FeedLens - Quick Start Guide

> Get FeedLens running in **5 minutes**

## ⚡ Prerequisites

Make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ PostgreSQL 14+ (`psql --version`)
- ✅ Chrome Browser
- ✅ Git

## 📦 Step 1: Get the Code

```bash
# Clone the repository (or download ZIP)
git clone https://github.com/yourusername/feedlens.git
cd feedlens
```

## 🗄 Step 2: Setup Database

```bash
# Create database
createdb feedlens

# Or using psql:
psql -U postgres
CREATE DATABASE feedlens;
\q
```

## ⚙️ Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use your favorite editor
```

Update `DATABASE_URL`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/feedlens?schema=public"
```

## 💻 Step 4: Backend Setup

```bash
# Install dependencies
npm install

# Generate Prisma client and run migrations
npx prisma migrate dev --name init

# Verify database is ready
npx prisma studio
# Opens http://localhost:5555 - you should see empty tables

# Start backend (keep this running)
npm run dev
```

Backend now running at **http://localhost:3000** ✅

Test it: Visit http://localhost:3000 → you should see the homepage

## 🧩 Step 5: Extension Setup

Open a **new terminal** (keep backend running):

```bash
# Go to extension folder
cd extension

# Install dependencies
npm install

# Build extension
npm run build
```

Extension built in `extension/dist/` ✅

## 🔌 Step 6: Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right)
4. Click **"Load unpacked"**
5. Navigate to `feedlens/extension/dist` and select it
6. Extension should appear in your list ✅

## 🎬 Step 7: Test Everything

1. **Visit YouTube**: Go to https://www.youtube.com/
2. **Find the button**: Look for "📸 Publish Snapshot" in top-right corner
3. **Click it**: Modal should open showing video count
4. **Fill form**: 
   - Nickname: `test_user` (required)
   - City: `San Francisco` (optional)
   - Age: `25-34` (optional)
5. **Submit**: Should see success screen with link
6. **View snapshot**: Click "View Snapshot" or copy link
7. **Verify**: Should see your snapshot with videos ✅

## ✅ Verification Checklist

- [ ] Backend running at http://localhost:3000
- [ ] Homepage loads
- [ ] API responds at http://localhost:3000/api/snapshot
- [ ] Extension loaded in Chrome (no errors)
- [ ] Button appears on YouTube
- [ ] Modal works
- [ ] Snapshot created successfully
- [ ] Snapshot page displays correctly
- [ ] Videos clickable

## 🎉 Success!

You now have FeedLens running locally!

### What's Next?

**For Development:**
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the codebase
2. Check [TESTING.md](./TESTING.md) for testing procedures
3. See [CONTRIBUTING.md](./CONTRIBUTING.md) to start contributing

**For Production:**
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy
2. Use [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) before going live
3. Read [FAQ.md](./FAQ.md) for common questions

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 3000 is in use
lsof -i :3000

# Try different port
PORT=3001 npm run dev
```

### Database connection error

```bash
# Verify PostgreSQL is running
pg_isready

# Check if database exists
psql -l | grep feedlens

# Regenerate Prisma client
npx prisma generate
```

### Extension not loading

- Check for errors in `chrome://extensions/`
- Verify `dist` folder exists and contains files
- Try rebuilding: `cd extension && npm run build`
- Clear Chrome cache and reload extension

### Button not appearing on YouTube

- Refresh the YouTube page
- Make sure you're on youtube.com (not /watch)
- Check browser console for errors
- Verify extension is enabled

### "No videos found" error

- Scroll down on YouTube to load videos
- Wait for page to fully load
- Try incognito mode (fresh YouTube session)

## 📚 Documentation

Full documentation available:
- **Setup**: [INSTALLATION.md](./INSTALLATION.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)  
- **Testing**: [TESTING.md](./TESTING.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **FAQ**: [FAQ.md](./FAQ.md)

## 💡 Tips

**Development Mode:**

```bash
# Backend - watch mode
npm run dev

# Extension - watch mode
cd extension
npm run watch
```

**Database Management:**

```bash
# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name description
```

**Extension Development:**

After making changes:
1. Rebuild: `npm run build`
2. Go to `chrome://extensions/`
3. Click reload icon on FeedLens extension
4. Refresh YouTube page

## 🆘 Need Help?

- 📖 Read [FAQ.md](./FAQ.md)
- 🐛 Report issues on GitHub
- 💬 Ask in GitHub Discussions
- 📧 Email: support@feedlens.com

## ⏱ Time Check

If you followed this guide, you should have:
- ✅ Backend running (2 mins)
- ✅ Database setup (1 min)
- ✅ Extension built (1 min)
- ✅ Extension loaded (1 min)
- ✅ First snapshot created (30 sec)

**Total: ~5 minutes** ⚡

---

**Ready to build? Check out [CONTRIBUTING.md](./CONTRIBUTING.md)!**

**Ready to deploy? See [DEPLOYMENT.md](./DEPLOYMENT.md)!**
