# Local-First Next.js User List App

A modern, local-first Next.js app using Zustand for state, Dexie.js for IndexedDB caching, and Tailwind CSS for styling. Features offline support, favorites, search, sorting, and a responsive UI with dark mode.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Offline/Failure Simulation
- Use the **"Go Offline"** toggle in the top-right to simulate offline mode. This disables API fetches and forces the app to use cached data.
- You can also disconnect your network or block requests to `randomuser.me` to test offline fallback.

## Known Issues / Limitations
- The app only fetches 10 users on first load; no infinite scroll or real API pagination.
- IndexedDB is cleared only by browser or dev tools; no in-app clear/reset.
- Some UI elements may need further polish for accessibility (a11y).
- SSR dark mode is handled with a script; true SSR theme from cookies is not yet implemented.

## What Could Be Improved
- Add real API pagination and infinite scroll.
- Use service workers for even better offline support.
- Improve accessibility and add keyboard navigation.
- Add tests (unit, integration, e2e) and CI setup.
- Polish the UI further and add animations.
