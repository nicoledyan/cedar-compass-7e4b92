# Cedar Compass

A small, local-first collection of personal tools and guides. The deliberately unusual repository name reduces casual discovery, but this GitHub Pages site is public and is **not** private or secure.

## Routes

- `/#/` — collection landing page
- `/#/grow-strong` — migrated 24-week fitness planner
- `/#/springs-guide` — saveable Colorado Springs city guide
- `/#/home-finder` — locally saved and personally scored Zillow shortlist

Hash-based routing is intentional: direct links and refreshes work on GitHub Pages without a custom 404 fallback.

## Architecture

```text
src/
  features/
    grow-strong/       Fitness UI, program data, Dexie storage, hooks and utilities
    springs-guide/     Guide components, typed activity data and localStorage hook
  pages/               Collection landing page
  shared/components/   Small cross-page controls
  App.tsx               Site routes
```

The Grow Strong source was migrated conservatively from `nicoledyan/fitness`. Its programming, checklists, progress tracking, backup/restore, IndexedDB schema, responsive design, and light-only presentation are retained. Its old hash-based internal tabs now use component state so they do not conflict with the app-level HashRouter. The original repository remains untouched.

The city guide was converted from the supplied standalone HTML into typed React data and reusable hero, filter, progress, section, and card components. Its 70 activities retain their original copy, categories, tips, official links, and Google Maps links.

Home Finder accepts individual Zillow listing URLs, prevents duplicates, extracts a readable address from common Zillow URLs, and stores the record locally. Listing facts are explicitly user-confirmed rather than scraped. Its explained scoring follows the documented lifestyle-first weights, treats elevated wildfire risk as a prominent deal breaker, and supports permanent record deletion with confirmation.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Quality and production checks:

```bash
npm run typecheck
npm run build
npm run preview
```

The Vite base path is `/cedar-compass-7e4b92/`. Change it in `vite.config.ts` if the repository is renamed.

## Deploy to GitHub Pages

1. Create a public repository named `cedar-compass-7e4b92` under `nicoledyan`.
2. Push this project to the repository's `main` branch.
3. Open **Settings → Pages** in GitHub.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Open the **Actions** tab and wait for “Deploy to GitHub Pages” to succeed.
6. Visit `https://nicoledyan.github.io/cedar-compass-7e4b92/`.

The workflow installs locked dependencies, type-checks, builds, uploads `dist`, and deploys it. Repository Pages settings may take a few minutes to publish the first deployment.

## Add another page

1. Add a page or feature module under `src/pages` or `src/features`.
2. Add its route in `src/App.tsx`.
3. Add a card to `src/pages/LandingPage.tsx`.
4. Use `HomeLink` on the page or wrap it in the existing `ToolPage` layout.
5. Run `npm run typecheck && npm run build`.

## Add a guide activity

Add a typed item to the relevant section in `src/features/springs-guide/data/activities.ts`. Give it a permanent, unique `id`; changing an ID makes the browser treat it as a new activity. Categories drive filters, and links should use full `https://` URLs.

## Local persistence and privacy

- Fitness state uses Dexie/IndexedDB in the current browser.
- Guide completions use localStorage with stable activity IDs.
- No analytics, tracking, authentication, database service, or external API is used.
- Progress is device- and browser-specific; it does not sync.
- Clearing site data removes saved progress. Grow Strong's Settings page can export a backup before clearing data.
- Anyone with the URL can access and forward this publicly hosted site. The obscure name only reduces casual discovery.

## PWA notes

The original fitness PWA behavior is retained at the collection level: the built site registers one service worker and has a shared manifest. Because this is now a multi-page collection, installing it adds the collection rather than a fitness-only app.
