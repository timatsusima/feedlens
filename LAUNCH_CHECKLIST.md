# 📋 FeedLens MVP - Launch Checklist

Use this checklist to ensure everything is ready before launch.

## ✅ Pre-Launch Checklist

### 1. Development Setup

- [ ] Clone/download project
- [ ] Install Node.js 18+ 
- [ ] Install PostgreSQL 14+
- [ ] Run `npm install` in root
- [ ] Run `npm install` in extension folder
- [ ] Copy `.env.example` to `.env`
- [ ] Update DATABASE_URL in `.env`

### 2. Database Setup

- [ ] PostgreSQL is running
- [ ] Database created: `createdb feedlens`
- [ ] Run: `npx prisma migrate dev --name init`
- [ ] Verify: `npx prisma studio` opens
- [ ] Test: Create a sample snapshot via Prisma Studio

### 3. Backend Testing

- [ ] Run: `npm run dev`
- [ ] Backend starts at http://localhost:3000
- [ ] Visit http://localhost:3000 → Homepage loads
- [ ] Visit http://localhost:3000/api/snapshot → API info shows
- [ ] Test POST with curl (see TESTING.md)
- [ ] Verify snapshot appears in database
- [ ] Visit snapshot page → Displays correctly
- [ ] No TypeScript errors: `npx tsc --noEmit`

### 4. Extension Setup

- [ ] Create placeholder icons (see extension/ICONS.md)
  - icon16.png
  - icon48.png  
  - icon128.png
- [ ] Or convert icon.svg to PNGs
- [ ] Run: `cd extension && npm run build`
- [ ] `dist` folder created
- [ ] `dist/manifest.json` exists
- [ ] `dist/content.js` exists
- [ ] `dist/styles.css` exists
- [ ] Icons copied to dist

### 5. Extension Loading

- [ ] Open Chrome
- [ ] Go to `chrome://extensions/`
- [ ] Enable "Developer mode"
- [ ] Click "Load unpacked"
- [ ] Select `extension/dist` folder
- [ ] Extension appears in list
- [ ] No errors in extension details
- [ ] Extension icon shows in toolbar

### 6. Extension Testing

- [ ] Navigate to https://www.youtube.com/
- [ ] Button "📸 Publish Snapshot" appears (top-right)
- [ ] Button is styled correctly
- [ ] Click button → Modal opens
- [ ] Modal shows video count
- [ ] Fill form (nickname required)
- [ ] Submit → Success screen shows
- [ ] URL is copyable
- [ ] Click "View Snapshot" → Opens in new tab
- [ ] Snapshot page displays correctly
- [ ] Videos have thumbnails
- [ ] Videos link to YouTube

### 7. Integration Testing

- [ ] End-to-end flow works:
  1. YouTube → Click button
  2. Fill form → Submit
  3. Success → Copy link
  4. Open link → Page loads
  5. Click video → YouTube opens
- [ ] Multiple snapshots work
- [ ] Different data (city, age, description) works
- [ ] Edge cases:
  - [ ] Very long nickname (should truncate)
  - [ ] Special characters in description
  - [ ] Empty optional fields
  - [ ] Many videos (50)
  - [ ] Few videos (1-5)

### 8. Error Handling

- [ ] Invalid data rejected
- [ ] Missing nickname shows error
- [ ] Network errors handled gracefully
- [ ] 404 page works (wrong snapshot ID)
- [ ] Browser console has no errors

### 9. Documentation Review

- [ ] README.md is clear
- [ ] INSTALLATION.md is accurate
- [ ] All links work
- [ ] No typos
- [ ] Instructions tested

### 10. Code Quality

- [ ] No `console.log` in production code
- [ ] No TODO comments
- [ ] No commented-out code
- [ ] TypeScript strict mode enabled
- [ ] No TypeScript `any` types
- [ ] Code is formatted consistently
- [ ] Meaningful variable names

---

## 🚀 Production Deployment Checklist

### 1. Database Setup

- [ ] Choose database provider:
  - [ ] Neon.tech (recommended)
  - [ ] Supabase
  - [ ] Railway
  - [ ] Render
- [ ] Create production database
- [ ] Save connection string
- [ ] Test connection from local machine

### 2. Backend Deployment

- [ ] Create Vercel account
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Run: `vercel` (first deployment)
- [ ] Add environment variables in Vercel:
  - [ ] DATABASE_URL
  - [ ] NEXT_PUBLIC_API_URL
- [ ] Run migrations on production DB:
  - `DATABASE_URL="prod-url" npx prisma migrate deploy`
- [ ] Deploy to production: `vercel --prod`
- [ ] Test production URL
- [ ] Visit /api/snapshot → Works
- [ ] Create test snapshot via API
- [ ] View test snapshot page

### 3. Extension Production Build

- [ ] Update API_URL in content.ts:
  ```typescript
  const API_URL = 'https://your-production-url.vercel.app';
  ```
- [ ] Create proper PNG icons (not placeholders)
- [ ] Update manifest.json:
  - [ ] Version: 1.0.0
  - [ ] Name: FeedLens
  - [ ] Description is clear
- [ ] Build: `npm run build`
- [ ] Test with production backend
- [ ] Verify everything works
- [ ] Create ZIP: `cd dist && zip -r ../feedlens.zip .`

### 4. Chrome Web Store

- [ ] Create developer account ($5 fee)
- [ ] Go to Chrome Web Store Developer Dashboard
- [ ] Click "New Item"
- [ ] Upload feedlens.zip
- [ ] Fill store listing:
  - [ ] Title
  - [ ] Description
  - [ ] Category
  - [ ] Screenshots (5 required)
  - [ ] Icon (128x128)
  - [ ] Privacy policy URL
- [ ] Submit for review
- [ ] Wait 1-3 days for approval

### 5. Privacy Policy

- [ ] Create privacy policy page
- [ ] Host on your domain or GitHub Pages
- [ ] Link from extension store listing
- [ ] Ensure it covers:
  - [ ] What data is collected
  - [ ] What data is NOT collected
  - [ ] How data is used
  - [ ] User rights
  - [ ] Contact information

### 6. Domain & SSL

- [ ] (Optional) Register custom domain
- [ ] Configure DNS to point to Vercel
- [ ] Add domain in Vercel settings
- [ ] Verify SSL certificate (automatic)
- [ ] Update NEXT_PUBLIC_API_URL

### 7. Monitoring

- [ ] Set up error tracking:
  - [ ] Sentry, or
  - [ ] Vercel Analytics, or
  - [ ] LogRocket
- [ ] Set up uptime monitoring:
  - [ ] UptimeRobot (free)
  - [ ] Pingdom
- [ ] Configure alerts

### 8. Backups

- [ ] Verify database backups enabled
- [ ] Test restore procedure
- [ ] Document backup schedule
- [ ] Save production credentials securely

### 9. Security

- [ ] Enable rate limiting (see DEPLOYMENT.md)
- [ ] Review CORS settings
- [ ] Check for exposed secrets
- [ ] Verify input validation
- [ ] Test with malicious data

### 10. Performance

- [ ] Test page load speed
- [ ] Check database query performance
- [ ] Verify images load quickly
- [ ] Test on slow connection
- [ ] Test on mobile (responsive)

---

## 🎉 Launch Day Checklist

### Pre-Launch

- [ ] All above checklists complete
- [ ] Test everything one more time
- [ ] Prepare launch announcement
- [ ] Screenshot/screen record demo
- [ ] Write launch post
- [ ] Prepare social media posts

### Launch

- [ ] Extension approved on Chrome Web Store
- [ ] Backend deployed and stable
- [ ] Create first public snapshot (as demo)
- [ ] Share demo link in announcement

### Announce On

- [ ] Reddit:
  - [ ] r/youtube
  - [ ] r/dataisbeautiful
  - [ ] r/SideProject
  - [ ] r/webdev
- [ ] Product Hunt
- [ ] Twitter/X
- [ ] Hacker News (Show HN)
- [ ] Dev.to
- [ ] LinkedIn
- [ ] Discord communities

### Post-Launch

- [ ] Monitor for errors (first hour)
- [ ] Respond to feedback quickly
- [ ] Fix critical bugs immediately
- [ ] Thank users and contributors
- [ ] Plan first update

---

## 📊 Success Metrics

Track these after launch:

### Week 1
- [ ] Extension installs: _____
- [ ] Snapshots created: _____
- [ ] Page views: _____
- [ ] Error rate: _____
- [ ] User feedback received: _____

### Week 2-4
- [ ] Daily active users: _____
- [ ] Retention rate: _____
- [ ] Average snapshots per user: _____
- [ ] Social shares: _____
- [ ] GitHub stars: _____

---

## 🐛 Emergency Contacts

If something breaks:

### Backend Issues
```bash
# Rollback Vercel
vercel rollback

# Check logs
vercel logs

# Restart deployment
vercel --prod
```

### Database Issues
```bash
# Check status
npx prisma studio

# Rollback migration
npx prisma migrate resolve --rolled-back migration_name
```

### Extension Issues
- Update content.ts
- Rebuild: `npm run build`
- Re-submit to Chrome Web Store
- Email users about update

---

## 🎯 Milestone Checklist

### MVP (Current)
- [x] Extension works
- [x] Backend deployed
- [x] Database setup
- [x] Public pages
- [x] Documentation

### First 10 Users
- [ ] 10 extension installs
- [ ] 10+ snapshots created
- [ ] No critical bugs
- [ ] Positive feedback

### First 100 Users
- [ ] Featured on Product Hunt
- [ ] Reddit front page
- [ ] 100+ installs
- [ ] Community forming

### First 1,000 Users
- [ ] Consistent daily usage
- [ ] <1% error rate
- [ ] Phase 1 features started
- [ ] Revenue model (optional)

---

## 📝 Notes

- Print this checklist
- Check items as you complete them
- Don't skip steps
- Test thoroughly before launch
- Have fun! 🎉

---

**Ready to launch when all items are checked!** ✅

**Good luck! 🚀**
