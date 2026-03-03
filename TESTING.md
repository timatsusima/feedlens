# Testing Guide

## Manual Testing

### Backend Testing

#### 1. Test API Health

```bash
curl http://localhost:3000/api/snapshot
```

Expected response:
```json
{
  "message": "FeedLens API",
  "endpoints": {
    "POST /api/snapshot": "Create a new snapshot"
  }
}
```

#### 2. Test Snapshot Creation

```bash
curl -X POST http://localhost:3000/api/snapshot \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "test_user",
    "city": "San Francisco",
    "age_bucket": "25-34",
    "description": "My YouTube recommendations",
    "snapshot": [
      {
        "videoId": "dQw4w9WgXcQ",
        "title": "Test Video",
        "channel": "Test Channel",
        "position": 0
      },
      {
        "videoId": "jNQXAC9IVRw",
        "title": "Another Test",
        "channel": "Test Channel 2",
        "position": 1
      }
    ]
  }'
```

Expected response:
```json
{
  "success": true,
  "id": "uuid-here",
  "url": "/snapshot/uuid-here"
}
```

#### 3. Test Snapshot Viewing

Visit: `http://localhost:3000/snapshot/{id}` (use ID from step 2)

You should see:
- Nickname, city, age bucket
- Description
- Grid of 2 videos with thumbnails
- Each video clickable to YouTube

#### 4. Test Validation

Invalid nickname (too long):
```bash
curl -X POST http://localhost:3000/api/snapshot \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "this_is_a_very_long_nickname_that_exceeds_fifty_characters",
    "snapshot": [
      {
        "videoId": "test",
        "title": "Test",
        "channel": "Test",
        "position": 0
      }
    ]
  }'
```

Expected: 400 error with validation details

Missing required field:
```bash
curl -X POST http://localhost:3000/api/snapshot \
  -H "Content-Type: application/json" \
  -d '{
    "snapshot": [
      {
        "videoId": "test",
        "title": "Test",
        "channel": "Test",
        "position": 0
      }
    ]
  }'
```

Expected: 400 error

### Extension Testing

#### 1. Basic Functionality

1. Load extension in Chrome
2. Navigate to https://www.youtube.com/
3. Wait for page to load completely
4. Verify "📸 Publish Snapshot" button appears in top-right
5. Button should be red, rounded, with shadow

#### 2. Video Collection

1. Click "📸 Publish Snapshot" button
2. Button text should change to "Collecting..."
3. Wait for modal to appear
4. Modal should show:
   - "X videos collected" message
   - Form fields (nickname required)
   - Cancel and Publish buttons

#### 3. Form Validation

1. Try to submit without nickname
2. Should see browser validation error
3. Fill in nickname (e.g., "tester123")
4. Try different age ranges
5. Submit form

#### 4. Success Flow

1. After submission, modal should update to success screen
2. Success screen should show:
   - ✅ Success message
   - URL input (readonly)
   - Copy button
   - "View Snapshot" link
   - Close button
3. Click "Copy Link" → should copy to clipboard
4. Click "View Snapshot" → should open in new tab
5. Verify snapshot page displays correctly

#### 5. Error Handling

Test with backend down:

1. Stop Next.js dev server
2. Try to publish snapshot
3. Should see error alert
4. Button should re-enable

#### 6. Edge Cases

**Empty Homepage**
1. Clear YouTube homepage (use incognito mode, new account)
2. Try to publish
3. Should see "No videos found" alert

**Network Issues**
1. Disconnect internet
2. Try to publish
3. Should see error alert

**Special Characters**
1. Use nickname with special chars: `test_user-123!`
2. Use description with emojis and Unicode
3. Should work correctly

### Database Testing

#### Verify Data Storage

```bash
npx prisma studio
```

1. Open http://localhost:5555
2. Click "Snapshot" table
3. Verify your test snapshot exists
4. Check all fields populated correctly
5. Click "Video" table
6. Verify videos linked to snapshot
7. Verify position ordering

#### Test Cascade Delete

```sql
-- In Prisma Studio or psql
DELETE FROM snapshots WHERE nickname = 'test_user';
```

Verify all related videos are also deleted (cascade).

## Automated Testing (Future)

### Unit Tests

Create `__tests__` directories for:

- API validation logic
- Video data extraction
- Prisma queries

### Integration Tests

- API endpoint tests
- Database operations
- Extension content script

### E2E Tests

Use Playwright or Cypress:
- Full user flow from YouTube → publish → view
- Cross-browser testing
- Mobile responsive testing

## Performance Testing

### Backend

```bash
# Install Apache Bench
brew install ab

# Test API endpoint
ab -n 1000 -c 10 -p data.json -T application/json http://localhost:3000/api/snapshot
```

Expected:
- Response time: < 100ms
- Success rate: 100%

### Extension

Check performance in Chrome DevTools:
1. Open DevTools → Performance tab
2. Record while collecting videos
3. Verify:
   - No layout thrashing
   - Smooth animations
   - Memory stable

### Database

```bash
# Analyze query performance
npx prisma studio
```

Check slow queries, add indexes if needed.

## Browser Compatibility

Test extension on:
- Chrome (latest)
- Chrome (previous version)
- Chromium-based browsers (Edge, Brave, Opera)

## Common Issues

### Extension Not Working on YouTube

**Problem**: Button doesn't appear
**Solution**: 
- Check if you're on youtube.com/watch (video page) vs youtube.com (home)
- Extension only works on homepage
- Refresh page and wait for full load

**Problem**: Videos not collecting
**Solution**:
- YouTube updated their DOM structure
- Update selectors in `content.ts`
- Check browser console for errors

### API Errors

**Problem**: CORS errors
**Solution**:
- Verify middleware.ts is configured
- Check extension requests to correct URL
- Update NEXT_PUBLIC_API_URL if needed

**Problem**: Database connection failed
**Solution**:
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npx prisma generate`

### Performance Issues

**Problem**: Slow snapshot creation
**Solution**:
- Add database indexes
- Optimize Prisma queries
- Use database pooling (PgBouncer)

**Problem**: Extension slows down YouTube
**Solution**:
- Use requestIdleCallback for collection
- Throttle DOM queries
- Remove console.logs in production
