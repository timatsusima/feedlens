# FeedLens Chrome Extension

## 🚀 Installation

### Development Mode

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder

### Usage

1. Navigate to https://www.youtube.com/
2. Click the "📸 Publish Snapshot" button in the top-right corner
3. Fill in the form (nickname is required)
4. Click "Publish Snapshot"
5. Share your public snapshot link!

## 🔒 Privacy

This extension:
- ✅ Only collects public video data visible on YouTube homepage
- ✅ Does NOT access cookies
- ✅ Does NOT track browsing history
- ✅ Does NOT collect any private identifiers
- ✅ Open-source and transparent

## 📝 Data Collected

- Video ID (from public URL)
- Video title (public metadata)
- Channel name (public metadata)
- Position in recommendation list

## 🛠 Development

Watch mode:
```bash
npm run watch
```

After making changes, reload the extension in Chrome.
