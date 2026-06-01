# Athletes to Entrepreneurs — Guest Directory

A standalone directory of every guest from the **Athletes to Entrepreneurs: The Alumni Journey**
podcast, with their LinkedIn profiles loaded in — modeled on the Den dashboard's directory.

## How it works

```
Google Sheet (Guests + Profiles tabs)
        │
        ▼
BubbleLab "Guests API" flow 12088  ──POST──▶  returns all guests + embedded
   (reads both tabs, joins by URL)             LinkedIn profiles in one call
        │
        ▼
This app (React + TanStack Query)
   • DirectoryPage — searchable grid of guest cards (photo, name, tagline)
   • GuestPage — full profile: about, experience, education, skills, certs
```

- **Data** is pre-scraped: a separate enrichment flow (BubbleLab flow 12087) scraped every
  guest's LinkedIn via `scrapeProfile` into the sheet's `Profiles` tab as JSON. The app just
  reads it — every profile is loaded up front, no per-guest clicking.
- The app fetches once (~1.3 MB), caches for 30 min, and does search + detail entirely client-side.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for any static host (HashRouter — no server config needed):

```bash
npm run build && npm run preview
```

## Config

The Guests API URL defaults to the live BubbleLab webhook (see `src/lib/api.ts`). Override with
`VITE_GUESTS_API_URL` in `.env.local` if you redeploy the flow. See `.env.example`.

## Refreshing the data

Re-run the BubbleLab flows (via the Bubble Studio or MCP):

- **12037** — Athletes to Entrepreneurs scraper (RSS → guest names + LinkedIn URLs → `Guests` tab)
- **12087** — Enrich Guest LinkedIn Profiles (scrape each URL → `Profiles` tab). Batched:
  `{ "reset": true, "skip": 0, "maxRows": 40 }`, then bump `skip` by 40, `reset:false`.
- **12088** — Guests API (read-only; what this app calls)

Spreadsheet: `1VUjzrm95v0G-4tKUlx-yvgSzgNLRZICw-NQMtz6aYfU`
