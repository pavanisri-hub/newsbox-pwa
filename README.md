# Newsbox PWA

Newsbox is an **offline‑friendly** news reader built as a Progressive Web App (PWA). It lets users browse top headlines, read full articles, bookmark items, and keep reading even when the network is unreliable or completely offline.

---

## Links

- **Live Demo:** https://newsbox-gdq2y2jrv-pavani-sris-projects.vercel.app/  
- **Source Code:** https://github.com/pavanisri-hub/newsbox-pwa.git

> If the live demo cannot fetch headlines due to GNews CORS limits, please run the project locally (instructions below) to see full online + offline behavior.

---

## Features

- Installable PWA with app‑like experience (standalone display, custom icons, splash screen).
- Offline‑first headlines: previously loaded news remains readable without network.
- Custom offline fallback page for uncached routes.
- Persistent bookmarks stored in IndexedDB and available offline.
- Online/offline status bar that updates as connectivity changes.
- Responsive layout optimized for mobile, tablet, and desktop.
- Simple sync feedback for bookmarks (`Saving…` → `Saved for offline`).
- Deployed on Vercel with HTTPS.

---

## Architecture Overview

### Tech stack

- **Framework:** React + Vite  
- **Routing:** React Router  
- **PWA tooling:** `vite-plugin-pwa` (Workbox under the hood)  
- **Client storage:** IndexedDB (via a small wrapper in `src/lib/db.js`)  
- **HTTP:** Fetch API  
- **Deployment:** Vercel (static hosting + optional serverless API proxy)

### Project structure (simplified)

src/
main.jsx # App bootstrap
App.jsx # Routes + layout + status bar
pages/
HomePage.jsx # Top headlines list
ArticlePage.jsx # Single article view + bookmark actions
BookmarksPage.jsx # Offline bookmarks list
lib/
newsApi.js # fetchTopHeadlines(...) – news fetching logic
db.js # IndexedDB helpers for articles + bookmarks
hooks/
useOnlineStatus.js # Tracks navigator.onLine + window events
public/
offline.html # Custom offline fallback page
pwa-192x192.png
pwa-512x512.png
vite.config.js # Vite + vite-plugin-pwa configuration


### Data flow

- **Home page**
  - Calls `fetchTopHeadlines(...)` from `lib/newsApi.js`.
  - Successful responses are:
    - Rendered in the UI.
    - Saved into IndexedDB (`articles` store) for offline access.
  - On network failure, Home page falls back to reading headlines from IndexedDB so the user still sees previously loaded news.

- **Article page**
  - Receives an `article` object via React Router navigation state.
  - Bookmark button triggers `toggleBookmark(article)` from `lib/db.js`:
    - Saves/removes the article in an IndexedDB `bookmarks` store.
    - Shows small textual status: `Saving…` → `Saved for offline`.

- **Bookmarks page**
  - Reads all bookmarked articles from IndexedDB and lists them.
  - Works fully offline.

- **Online/offline status**
  - `useOnlineStatus` hook listens for `online` / `offline` events and `navigator.onLine`.
  - `App` renders a subtle status bar (`Online` / `Offline`) at the top.

---

## PWA & Caching Strategy

### Web App Manifest

Configured via `vite-plugin-pwa`:

- `name`, `short_name`, `description`
- `start_url: "/"`, `display: "standalone"`
- Theme color and background color for splash
- At least two icons: `192x192` and `512x512` PNG

This makes the app installable on supported browsers and gives a custom splash screen when opened from the home screen.

### Service Worker & Workbox

- **App shell + static assets**
  - JS, CSS, fonts, logo, icons, and `offline.html` are precached by Workbox at build time.
  - Served with a **Cache‑First** strategy: instant loads after first visit and good offline reliability.

- **Dynamic content (news API)**
  - Headlines are fetched with **Network‑First** logic:
    - Try network request first.
    - On success: render and cache the articles in IndexedDB.
    - On failure (offline / API unavailable): read last saved articles from IndexedDB and show them instead.
  - This balances freshness with offline availability.

- **Offline fallback page**
  - For navigations to routes that are not cached, the service worker returns `offline.html`, which explains that the user is offline and prompts them to return to a cached page.

---

## Offline Actions & Sync Behavior

The backend news API (GNews) is read‑only, so user actions are synchronized **locally** using IndexedDB.

- Users can bookmark/unbookmark articles both online and offline.
- Bookmark actions are written immediately to IndexedDB.
- On app reload or when network returns, UI loads from IndexedDB, so all bookmarks persist.
- After clicking “Add to bookmarks”:
  - UI briefly shows `Saving…` while the write completes.
  - Then shows `Saved for offline`, indicating the article is safely stored locally.

This provides a simple but effective offline‑first sync model without needing a custom server.

---

## Responsive Design

Layout is built mobile‑first with flexbox and media queries:

- On **mobile**:
  - Cards are full‑width, stacked vertically.
  - Thumbnail image is at the top of each card.
- On **desktop**:
  - Content area is centered with a max width (~960px).
  - Cards use a glassy effect, hover elevation, and thumbnail on the left.

Screenshots in the `screenshots/` folder show both mobile and desktop views.

---

## Setup & Local Development

### Prerequisites

- Node.js (LTS)
- npm or yarn
- GNews API key from https://gnews.io (free tier is enough)

### 1. Clone and install

git clone https://github.com/pavanisri-hub/newsbox-pwa.git
cd newsbox-pwa
npm install

### 2. Environment variables

Create `.env.local` in the project root:

VITE_GNEWS_API_KEY=d4a58e18a6111017531548361c5c429

Optional: if you use a proxy, otherwise omit
VITE_API_BASE=http://localhost:4173


### 3. Run in dev mode

npm run dev

Open http://localhost:5173


### 4. Build + PWA preview
npm run build
npm run preview

Open http://localhost:4173

Use the preview URL (`4173`) when you want to test installability, service worker, and offline behavior.

---

## Testing PWA Features

1. **Install the app**
   - Open in Chrome (`http://localhost:4173` or the Vercel URL).
   - Click the install icon in the address bar or “Install app” from the menu.
   - Launch from your OS app list / home screen.

2. **Online browsing**
   - Browse the “Top headlines” on Home.
   - Open an article and scroll through the content.

3. **Offline browsing**
   - With headlines loaded, open DevTools → Network → set to “Offline”.
   - Refresh the page:
     - Home should still show previously viewed headlines (from IndexedDB).
     - Bookmarks page should still show saved articles.
   - Navigating to a non‑cached route shows the offline fallback page.

4. **Offline bookmark actions**
   - While still “Offline”, open an article.
   - Click “Add to bookmarks” → see `Saving…` then `Saved for offline`.
   - Go to Bookmarks page and confirm it’s listed.
   - Switch DevTools Network back to “Online” and refresh; bookmark remains.

5. **Lighthouse audit**
   - In Chrome DevTools → Lighthouse, run a report focused on **Progressive Web App**.
   - PWA checks (installability, service worker, offline support) should pass.

---

## Deployment

The project is deployed on **Vercel**:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables configured in Vercel:
  - `VITE_GNEWS_API_KEY`
  - (Optional) `VITE_API_BASE` and/or `GNEWS_API_KEY` if using a proxy function

---

## Known Limitations

- The free tier of **GNews** can apply **CORS** and rate‑limit restrictions to some hosted origins.  
- If the live Vercel URL shows “Could not load news. Please try again.” while network is online, that is typically due to GNews rejecting the origin.
- All core PWA behavior (installability, offline cache, bookmarks, UI) works fully when run locally with a valid API key.

For evaluation, please:

- Use the live Vercel URL to confirm installability, manifest, service worker registration, and general UX.
- Use the local setup if you want to see live headlines with your own GNews key.

---

## Demo Video (Suggested Script) 

**Demo video** https://drive.google.com/file/d/1ZnAv8uuf6fTd__xgq_0BQKVGnOmesbaH/view?usp=sharing 

The accompanying demo video (2–4 minutes) walks through:

1. Opening the app and installing it.  
2. Browsing headlines online.  
3. Going offline and refreshing to show cached content.  
4. Bookmarking an article while offline and seeing it in the Bookmarks tab.  
5. Returning online with the bookmark still present.

