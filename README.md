# AroundNow

A "what's happening near me right now" website. Pick a location (or tap
**Use my location**), a radius (1/3/5 km), category filters, and an optional
keyword — see nearby events/places as a list or on a map.

Originally prototyped as a native Expo/React Native app, but native
deployment (Apple App Store review) turned out to be more friction than
it's worth. This is a plain, phone-friendly **website** instead — same
backend, no app store, works on both iOS and Android from any browser.

## How it's built

Plain HTML/CSS/JS, no build step, no framework:

- `index.html`, `style.css`, `app.js` — the app itself
- `vendor/leaflet/` — the Leaflet map library, vendored locally (not loaded
  from a CDN) so the site has no third-party runtime dependency and can
  work offline
- `manifest.webmanifest` + `sw.js` + `icons/` — makes it an installable
  **PWA**: on a phone, "Add to Home Screen" gives a full-screen app-like
  launch icon, no App Store needed. The service worker caches the app
  shell for fast/offline loads, but always hits the network fresh for the
  live events feed (`/v1/*`)
- `package.json` — `npm run dev` (local static server) and `npm run deploy`
  (Cloudflare Pages)

### Backend

Talks to `aroundnow_worker` (separate project, Cloudflare Worker,
TypeScript) via `GET /v1/feed?lat=&lng=&radius_km=&categories=&q=&demo=`.
That Worker proxies Eventbrite, caches results in KV, and has CORS open —
so this site can call it directly with no backend changes. `demo=true`
returns a couple of fake pins for testing without a live Eventbrite token.

## Running locally

```
npm run dev
```

then open `http://127.0.0.1:8532`. Geolocation only works over HTTPS or on
`localhost` — real on-device testing needs a deployed URL, not just the
local file.

## Deploying

```
npm run deploy
```

Runs `wrangler pages deploy . --project-name=aroundnow-website`
(Cloudflare Pages, pairs with the existing Worker). First run prompts for
Cloudflare login.

## Status / open items

- `API_URL` in `app.js` is a placeholder until `aroundnow_worker` is
  (re-)deployed and we have its real `*.workers.dev` URL.
- `aroundnow_worker`'s `wrangler.toml` currently has `EVENTBRITE_TOKEN` as
  a plaintext var — should move to a Cloudflare secret
  (`wrangler secret put EVENTBRITE_TOKEN`) next time it's deployed.
- `aroundnow_worker`'s `wrangler` version (3.61.0) is out of date (4.x
  available).
- Custom domain for the Pages site vs. the default `*.pages.dev` URL — TBD.
