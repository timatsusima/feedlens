# 📸 FeedLens

> Open-source platform for publishing snapshots of YouTube recommendations

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

## 🎯 What is FeedLens?

FeedLens lets you **capture and share** a snapshot of your YouTube homepage recommendations. It's a simple way to show others what YouTube is recommending to you, discover patterns in content, and compare recommendations across different demographics.

### Why FeedLens?

- 🔍 **Understand** what YouTube recommends to different people
- 📊 **Compare** recommendation patterns across demographics
- 🌐 **Share** your feed with one click
- 🔒 **Privacy-first** - no tracking, no cookies, no personal data
- 💻 **Open source** - transparent and community-driven

## ✨ Features

- 📸 **One-click** snapshot publishing
- 🔒 **Privacy-first** design (no tracking, no cookies)
- 🌐 **Public shareable** links
- ⚡ **Fast & lightweight** (minimal dependencies)
- 💻 **Open source** (MIT License)
- 🎨 **Clean UI** (modern, responsive)

## 🚀 Quick Start

⚡ **Want to get started fast?** See [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide.

For detailed instructions, see [INSTALLATION.md](./INSTALLATION.md).

### Backend Setup

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
npx prisma migrate dev --name init

# Start dev server
npm run dev
```

### Chrome Extension Setup

```bash
# Build extension
cd extension
npm install
npm run build

# Load in Chrome:
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` folder
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| 📘 [INSTALLATION.md](./INSTALLATION.md) | Complete setup guide for development |
| 🏗 [ARCHITECTURE.md](./ARCHITECTURE.md) | Project structure & tech stack details |
| 🧪 [TESTING.md](./TESTING.md) | Manual testing procedures |
| 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| 🗺 [ROADMAP.md](./ROADMAP.md) | Future features & development phases |
| 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute to the project |
| ✅ [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) | Pre-launch and deployment checklist |
| 📦 [MVP_SUMMARY.md](./MVP_SUMMARY.md) | Complete MVP implementation summary |
| ❓ [FAQ.md](./FAQ.md) | Frequently asked questions |
| 📁 [FILE_INVENTORY.md](./FILE_INVENTORY.md) | Complete file listing and statistics |

## 📊 Project Statistics

- **34 files** created
- **~4,800 lines** total (code + documentation)
- **~1,450 lines** of production code
- **~3,300 lines** of documentation
- **Production-ready** MVP

## 🎥 How It Works

```
1. Install Extension → 2. Visit YouTube → 3. Click "Publish" → 4. Share Link!
```

## 🏗 Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   YouTube   │────────>│  Extension  │────────>│   Backend    │
│   Homepage  │         │ (Manifest3) │         │  (Next.js)   │
└─────────────┘         └─────────────┘         └──────────────┘
                              │                         │
                              │                         ▼
                              │                  ┌──────────────┐
                              │                  │  PostgreSQL  │
                              │                  └──────────────┘
                              ▼
                        ┌─────────────┐
                        │   Public    │
                        │  Snapshot   │
                        │    Page     │
                        └─────────────┘
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

## 🔬 Dataset Fields (v2 schema)

Each snapshot now carries rich research-ready metadata:

| Field | Type | Description |
|-------|------|-------------|
| `schemaVersion` | int | Payload schema version (current: `1`) |
| `surface` | string | Where feed was captured: `"home"` or `"watchnext"` |
| `collectedAt` | datetime | Client-side capture timestamp (ISO 8601) |
| `timezone` | string? | IANA tz (`"Europe/Moscow"`) or offset (`"+05:00"`) |
| `locale` | string? | BCP-47 locale from `navigator.language` (e.g. `"ru-RU"`) |
| `targetCount` | int | Intended number of videos (default: 50) |
| `collectedCount` | int | Actually collected (server-verified) |
| `uniqueVideoCount` | int | Deduplicated count of video IDs |
| `duplicateCount` | int | `collectedCount − uniqueVideoCount` |
| `isPartial` | bool | `true` when `collectedCount < targetCount` |
| `collectorVersion` | string? | Extension version, e.g. `"ext/1.0.0"` |

Quality flags are **recomputed server-side** from the actual video array (client values are accepted but overwritten).

## 🔑 Removal Token

When a snapshot is published, the API returns a one-time `removalToken` (64-char hex).

- **Displayed once** in the extension success screen — not stored anywhere else.
- The server stores only the **SHA-256 hash** of the token.
- To remove your snapshot: open the snapshot page → click "Request removal" → paste the token.
- If the token is lost, contact the admin; user self-removal is not possible without it.

## 🗑 Soft Delete

Snapshots are **soft-deleted** by default (user request or admin action):

- `deletedAt` is set; the row remains in the database.
- All public endpoints (`GET /api/snapshot/:id`, snapshot page, Discover feed) return **404** for soft-deleted snapshots.
- Admins can view deleted records via `/admin` with "Show deleted" toggle.
- Hard delete (physical row removal) is available to admins only via `DELETE /api/admin/snapshots/:id?hard=1`.

## 🔒 Privacy

**What we collect:**
- ✅ Public YouTube video IDs (visible to everyone)
- ✅ Video titles and channel names (public data)
- ✅ Your nickname and optional demographic info

**What we DON'T collect:**
- ❌ Cookies
- ❌ IP addresses
- ❌ Browsing history
- ❌ YouTube account info
- ❌ Any private identifiers

**100% open source** - Verify in the code!

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Extension** | Chrome Manifest v3, TypeScript |
| **Validation** | Zod |
| **Styling** | CSS (no framework) |

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick start:**
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a PR

## 🗺 Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

**Coming soon:**
- 🔍 Search & discovery
- 📊 Analytics & insights
- 🤖 ML-powered recommendations
- 🌐 More platforms (Instagram, TikTok, etc.)

## 📝 License

MIT License - See [LICENSE](./LICENSE)

Free to use, modify, and distribute.

## 🙏 Acknowledgments

Built with modern web technologies and a privacy-first approach.

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/timatsusima/feedlens/issues)
- **Discussions**: [GitHub Discussions](https://github.com/timatsusima/feedlens/discussions)
- **Email**: akira.kumo@proton.me

---

**Made with ❤️ by the FeedLens community**

⭐ Star us on GitHub if you find this useful!
