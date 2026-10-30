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
- `supabase/migrations/` — later changes, run after `schema.sql`, oldest first.
  So far: v1 shows organisations only; private individuals are kept but hidden
- `npm run import:listings` — loads `data/listings-seed.csv` (the mums'
  spreadsheet) into Supabase. Needs the secret key in `.env`; both `data/`
  and `.env` are git-ignored because they hold private contact details
- `npm run backup` — copies every table, the parents' accounts and `supabase/`
  to `Documents\AroundNow-Backups\<date>\` (outside the project; keeps 14 days
  plus one a month). Supabase's Free plan keeps no backups, so Windows Task
  Scheduler runs it nightly at 23:30 ("AroundNow nightly backup", log in
  `backup.log` there). `npm run feedback` warns if the last one is over 2 days old

### Adding and checking classes

Signed-in parents add classes with the "+" button (a 4-step form); everyone
else can confirm or report them. Sign-in is Supabase Auth: a code sent by
email, or Google once it's switched on. `vendor/supabase/` holds the
supabase-js browser build (2.117.3), kept locally like Leaflet.

- A new class shows straight away as "Not yet confirmed". One "Yes, it's
  real" from a different signed-in parent confirms it.
- "Something else" as the activity waits for an admin (status `Pending`).
- Two reports from different parents hide it (status `Flagged`).
- No confirmation for 90 days: back to "Not yet confirmed". 120 days: hidden.
  One-off events disappear after their date. The website works this out from
  `last_confirmed_at`, `created_at` and the event dates.
- After someone taps Directions or the website for an unconfirmed class, the
  next visit (half a day later) asks "Did you go?". Kept on their phone only.

The rules the browser can't be trusted with (who added it, its status, one
confirmation per person, no confirming your own, 10 new classes a day) are
enforced in the database: `supabase/migrations/20261026_2_add_a_class.sql`.

**Reviewing (admin):** Supabase → Table Editor → `listings`, filter status
`Pending` or `Flagged`, and set it to `Check`, `Active` or `Removed`. Reasons
are in `listing_reports`; tick `resolved` once dealt with. "Something else"
classes are stored with category `Mixed` (shown as "Clubs"); change it to the
right one when approving.

**One-time Supabase settings:**
- Authentication → URL Configuration: Site URL = the live site; add the live
  site and `http://127.0.0.1:8532` (each with `/**`) to Redirect URLs.
- The sign-in email is Supabase's standard one, with a link. Its wording can
  only be changed once an email service is connected (below); then add the
  code `{{ .Token }}` to it so people can type the code in the app instead.
- Supabase's built-in email only reaches members of your Supabase team, a few
  an hour. Before other parents sign in by email, connect an email service
  (Authentication → SMTP), or switch on Google (Authentication → Providers).

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

## Finding more classes (repeatable research)

Say **"find classes"** in Claude Code. The `find-classes` skill takes the next job
in `research/log.md`, follows the checklist and rules in `research/sources.md`
(own websites, no Facebook, evidence from the last 12 months), and saves a batch
to `research/batches/`. Then:

```
npm run check:batch -- research/batches/<file>.csv       # checks fields, adds map pins, flags duplicates
npm run import:listings -- research/batches/<file>.csv   # puts it on the live site (needs .env)
```

Batches use the seed columns plus `EventDate` / `EventEndDate` for one-off events
and dated camps; those show under Today / Tomorrow / This weekend and disappear
once they're over.

## Deploying

```
npm run deploy
```

Copies only the public files into `dist/` (`scripts/build.mjs`), then
`wrangler deploy` publishes them as a Cloudflare Worker with static assets
(`wrangler.jsonc`). First run prompts for a Cloudflare login.

## Next

- Email service for sign-in codes (or Google sign-in) before opening to other parents
- Terms of Service and a privacy note (brief 7.2)
- Pre-fill listing details from the organiser's website
- Custom domain instead of the workers.dev address
