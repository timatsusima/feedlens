# ❓ FeedLens - Frequently Asked Questions

## General Questions

### What is FeedLens?

FeedLens is an open-source platform that lets you capture and share snapshots of your YouTube homepage recommendations. It helps you understand what YouTube recommends to you and compare with others.

### Why would I want to share my recommendations?

- Show others what YouTube thinks you're interested in
- Compare recommendations across different demographics
- Understand content bubbles and recommendation patterns
- Research YouTube's algorithm behavior
- Have fun comparing with friends

### Is FeedLens free?

Yes! FeedLens is completely free and open source (MIT License). You can use it, modify it, and even run your own instance.

### Who built FeedLens?

FeedLens is an open-source community project. See [CONTRIBUTING.md](./CONTRIBUTING.md) to get involved.

## Privacy & Security

### What data does FeedLens collect?

**We collect:**
- Public YouTube video IDs (visible to everyone on YouTube)
- Video titles and channel names (public data)
- Your nickname (you choose this)
- Optional: city, age range, description

**We DON'T collect:**
- Cookies
- IP addresses
- Browsing history
- YouTube account information
- Any private identifiers
- Watch history
- Login credentials

### Is my data safe?

Yes. We only collect public information that's already visible on YouTube. Your snapshot is stored in a PostgreSQL database and made publicly accessible via a unique link.

### Can I delete my snapshot?

Currently, snapshots are permanent. If you need a snapshot removed, contact us at akira.kumo@proton.me with the snapshot ID.

(Note: Delete functionality is planned for Phase 1)

### Does FeedLens track me?

No. We don't use cookies, tracking pixels, or any analytics on the extension or website. We're privacy-first by design.

### Is the code really open source?

Yes! The entire codebase is available on GitHub under the MIT License. You can verify exactly what we're doing.

### Can I run my own instance?

Absolutely! See [INSTALLATION.md](./INSTALLATION.md) for setup instructions.

## Technical Questions

### How does FeedLens work?

1. Chrome extension scrapes video data from your YouTube homepage
2. You fill out a form (nickname required)
3. Extension posts data to our backend API
4. Backend saves snapshot to PostgreSQL database
5. You get a public link to share

### What browsers are supported?

Currently Chrome only (Manifest v3). Firefox, Edge, and Safari support is planned for Phase 5. See [ROADMAP.md](./ROADMAP.md).

### Does it work on mobile?

Not yet. The extension only works on desktop Chrome. Mobile apps are planned for Phase 5.

### What if YouTube changes their website?

The extension scrapes YouTube's DOM, so if YouTube makes major changes, the extension might break. We'll update it when needed. If you notice it's broken, please report an issue on GitHub.

### Can I contribute to FeedLens?

Yes! We welcome contributions. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### What tech stack does FeedLens use?

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma
- **Extension**: Chrome Manifest v3

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

## Usage Questions

### How many videos does FeedLens capture?

Up to 50 videos from your YouTube homepage.

### Can I edit my snapshot after publishing?

Not currently. Once published, snapshots are immutable. Edit functionality is planned for Phase 1.

### Can I make my snapshot private?

No. All snapshots are public by design. Don't publish if you don't want it public!

### How long are snapshots stored?

Indefinitely. We don't currently delete old snapshots.

### Can I see other people's snapshots?

Yes! That's the whole point. Browse recent snapshots on the homepage (feature coming in Phase 1).

### Can I compare two snapshots?

Not yet, but it's planned for Phase 2. See [ROADMAP.md](./ROADMAP.md).

### What if I don't have 50 videos on my homepage?

That's fine. FeedLens will capture however many are available (minimum 1).

### Does it work on YouTube Music or YouTube TV?

No, only regular YouTube (youtube.com homepage).

## Extension Questions

### How do I install the extension?

See [extension/README.md](./extension/README.md) for detailed instructions.

Quick version:
1. Download/build the extension
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `extension/dist` folder

### Where is the Chrome Web Store link?

The extension is not yet on the Chrome Web Store. It's still in MVP phase. See [DEPLOYMENT.md](./DEPLOYMENT.md) for publishing instructions.

### Why isn't the button showing up?

Make sure:
- You're on youtube.com (not youtube.com/watch)
- You're on the homepage
- The page has fully loaded
- The extension is enabled
- You're using Chrome

### The extension is collecting 0 videos. What's wrong?

- Make sure you're on the YouTube homepage (not a video page)
- Try refreshing the page
- Check if YouTube's DOM structure changed
- Report an issue on GitHub

### Is the extension safe?

Yes. It's open source, so you can verify the code. It only runs on YouTube and only collects public video data.

### Can I use FeedLens at work/school?

That depends on your organization's policies. FeedLens doesn't track you, but check with your IT department before installing extensions.

## Deployment Questions

### How do I deploy to production?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

### What hosting do you recommend?

- **Backend**: Vercel (free tier works for MVP)
- **Database**: Neon, Supabase, or Railway (free tiers available)

### How much does hosting cost?

For the MVP with <1,000 users:
- Vercel: Free (Hobby plan)
- Database: Free (Neon/Supabase)
- Domain: ~$12/year (optional)

**Total: ~$1/month**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for scaling costs.

### Do I need a custom domain?

No. Vercel provides a free .vercel.app domain.

### How do I update the extension after deployment?

1. Make changes
2. Update version in manifest.json
3. Rebuild: `npm run build`
4. Re-submit to Chrome Web Store (if published)
5. Users get automatic updates

## Troubleshooting

### "No videos found" error

- Ensure you're on the YouTube homepage
- Wait for the page to fully load
- Try scrolling down to load more videos
- Refresh the page and try again

### "Failed to publish snapshot" error

- Check your internet connection
- Verify the backend is running (if local)
- Check browser console for errors
- Try again in a few minutes

### Extension button disappeared

- Refresh the YouTube page
- Check if extension is still enabled
- Reload the extension in chrome://extensions/
- Reinstall the extension

### Snapshot page won't load

- Verify the snapshot ID is correct
- Check if the backend is running
- Verify database connection
- Check browser console for errors

### Database connection errors

- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env
- Check database credentials
- Run `npx prisma generate`

### TypeScript errors

- Run `npm install` to ensure dependencies installed
- Check TypeScript version (should be 5+)
- Run `npx tsc --noEmit` to see all errors
- Clear node_modules and reinstall if needed

## Feature Requests

### Can you add [feature]?

Check [ROADMAP.md](./ROADMAP.md) first. If it's not there:
1. Search existing GitHub issues
2. Create a new feature request issue
3. Explain the use case
4. Wait for community feedback

### When will [feature] be ready?

We don't provide timelines. Features are prioritized based on community needs and contributor availability.

### Can I vote on features?

Yes! 👍 upvote GitHub issues you want to see.

### Can I sponsor development?

Sponsorship options coming soon. For now, contributions are the best way to help.

## Community

### Where can I get help?

1. Read the documentation (start with [README.md](./README.md))
2. Search GitHub Issues
3. Ask in GitHub Discussions
4. Email: akira.kumo@proton.me

### How do I report a bug?

1. Check if it's already reported in GitHub Issues
2. Create a new issue with:
   - Description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment (OS, Chrome version, etc.)

### How do I suggest improvements?

1. Check [ROADMAP.md](./ROADMAP.md)
2. Search GitHub Issues and Discussions
3. Create a new discussion or issue
4. Explain your idea clearly

### Can I join the development team?

FeedLens is open source - you're already part of the team! Just start contributing:
1. Fork the repo
2. Pick an issue or suggest a feature
3. Submit a PR
4. Participate in discussions

See [CONTRIBUTING.md](./CONTRIBUTING.md).

### Where can I follow updates?

- GitHub (watch the repository)
- Twitter/X: @feedlens (coming soon)
- Blog: feedlens.com/blog (coming soon)

## Research & Academic Use

### Can I use FeedLens for research?

Yes! That's one of our goals. FeedLens is perfect for studying recommendation algorithms.

### Can I export snapshot data?

Not yet, but it's planned for Phase 6. See [ROADMAP.md](./ROADMAP.md).

For now, you can query the database directly if running your own instance.

### Do you have a public dataset?

Not yet. Public dataset API is planned for Phase 6.

### Can I cite FeedLens in my paper?

Yes! Suggested citation:

```
FeedLens: Open-source platform for YouTube recommendation snapshots.
GitHub: https://github.com/timatsusima/feedlens
Accessed: [Date]
```

### Can we collaborate on research?

Yes! Email akira.kumo@proton.me with your proposal.

## Business & Legal

### What license is FeedLens under?

MIT License. See [LICENSE](./LICENSE).

### Can I use FeedLens commercially?

Yes, the MIT License allows commercial use.

### Can I modify FeedLens?

Yes! Modify, fork, distribute - it's all allowed under MIT License.

### Do you have a privacy policy?

Yes. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the privacy policy template.

### Do you have terms of service?

Not yet. Coming soon for the hosted version.

### Who owns the data?

- Snapshots you create: Publicly shared, no ownership claims
- Codebase: MIT License (community-owned)
- FeedLens name/brand: Community project

### Can I create a competing service?

Yes. MIT License allows this. We'd prefer you contribute instead, but you're free to fork.

## Future Plans

### What's next for FeedLens?

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

**Phase 1**: Search & discovery, better UX
**Phase 2**: Analytics & comparisons
**Phase 3**: ML & embeddings
**Phase 4**: Social features
**Phase 5**: More platforms & browsers
**Phase 6**: Research tools
**Phase 7**: Enhanced privacy & security

### Will FeedLens always be free?

The core features will always be free and open source. We may add optional premium features in the future, but the main platform will remain free.

### Will you add ads?

No. We're committed to a privacy-first, ad-free experience.

### How will FeedLens sustain itself?

Options we're considering:
- Sponsorships
- Grants (research-focused)
- Premium features (optional)
- Hosting services

But for now, it's purely community-driven.

## Still Have Questions?

- 📧 Email: akira.kumo@proton.me
- 💬 GitHub Discussions: [Link]
- 🐛 GitHub Issues: [Link]
- 🌐 Website: feedlens.com

---

**Last updated**: March 3, 2026

**Didn't find your answer?** Ask in GitHub Discussions!
