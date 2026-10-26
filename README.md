# AroundNow

Kids' classes and activities near you, on a map. Launch area: Ealing, London.
Pick your child's age, a place and a distance, then narrow down by day
(today, tomorrow, this weekend), language, type and activity.

A plain, phone-friendly website (an installable PWA) rather than an app-store
app. The product brief is in [`docs/brief.md`](docs/brief.md).

Live: https://aroundnow-website.aroundnow-tatjana.workers.dev

## How it's built

Plain HTML/CSS/JS, no framework:

- `index.html`, `style.css`, `app.js` — the app itself: a dark map with a
  results panel that slides up for the full list
- `vendor/leaflet/` — the Leaflet map library, kept locally rather than
  loaded from a CDN. Map tiles come from OpenStreetMap, darkened with a CSS
  filter
- `manifest.webmanifest` + `sw.js` + `icons/` — make it installable
  ("Add to Home Screen"). The service worker always tries the network first,
  so updates show straight away; the cache is only the offline fallback

### Listings

Listings live in **Supabase** (Postgres + PostGIS), project `aroundnow`.
The site reads them directly with the publishable key, which is meant to be
public: the database only allows reading visible listings.

- `supabase/schema.sql` — tables (`listings`, plus a private
  `listing_contacts` table with no public access) and the search function.
  Paste it into Supabase → SQL Editor to set up a fresh project
- `npm run import:listings` — loads `data/listings-seed.csv` (the mums'
  spreadsheet) into Supabase. Needs the secret key in `.env`; both `data/`
  and `.env` are git-ignored because they hold private contact details

### Dates and school holidays

Listings store a weekly pattern (days, time, term time or holidays), not
dates. "Today" means the class runs on today's weekday and, if it's
term-time only, that today is a school day. Ealing's school holidays are in
`SCHOOL_HOLIDAYS` in `app.js`, currently up to July 2028 — add the next
year when the council publishes it.

## Running locally

```
npm run dev
```

then open `http://127.0.0.1:8532`. Geolocation only works over HTTPS or on
`localhost`.

## Deploying

```
npm run deploy
```

Copies only the public files into `dist/` (`scripts/build.mjs`), then
`wrangler deploy` publishes them as a Cloudflare Worker with static assets
(`wrangler.jsonc`). First run prompts for a Cloudflare login.

## Next

- "Add a class": signed-in users add listings that appear on the map
- Local users confirm new listings; old ones get re-checked
- Pre-fill listing details from the organiser's website
- Custom domain instead of the workers.dev address
