# SEO pages – build plan (6 Nov 2026)

Based on `docs/brief.md` 8.2. Nothing is built yet. This is the plan for Tatjana to OK.

## What we have today
- 3,224 listings (3,164 "Check", 45 "Active", the rest removed or ended) in 493 different `location_area` names
  (Wimbledon 68, Chiswick 49, Balham 41, Ealing Broadway 40…). 212 areas have 5 or more listings.
- The site is one map page. The Cloudflare Worker only runs for `/api/*`, so Google sees an almost empty page.

## How it would work
1. **The Worker renders the pages.** Add `/london/*` and `/sitemap.xml` to `run_worker_first`. The Worker asks
   Supabase for the listings and sends back a plain, fast HTML page (list of classes, short intro, a link
   "Open on the map", which opens the app at that area). No Next.js and no app rewrite.
2. **Addresses:**
   - `/london`: list of boroughs
   - `/london/ealing`: one borough (from the postcode; postcodes.io gives the borough for free, stored once in a
     new `borough` column)
   - `/london/ealing/swimming`: activity in a borough (same activity groups as the Filters)
   - `/london/ealing/swimming/toddlers`: by age (babies 0–1, toddlers 1–3, preschool 3–5, kids 5–11, teens 11+)
   - `/class/<id>-<title-in-words>`: one page per class
   Neighbourhoods (Chiswick, Wimbledon) can come later as `/london/hounslow/chiswick` once boroughs work.
3. **Titles**, e.g. "Toddler swimming classes in Ealing | Wigglebi", plus a description from the real counts
   ("14 classes, 5 free, updated 6 Nov").
4. **Noindex under 5 listings.** The page still works for visitors.
5. **Event markup** (schema.org `Event` / `EventSeries`) on class pages: dates and times, place, price, ages.
   Only where we have real values (never guess, same rule as research).
6. **sitemap.xml**, made by the Worker, listing only the indexed pages. Submit it in Google Search Console
   (Tatjana: free account, verified through Cloudflare DNS once wigglebi.com is connected).
7. **Caching:** pages are cached at Cloudflare for about an hour, so Supabase isn't asked on every visit.

## Things to decide
- Should "Check" listings (not yet confirmed) appear on Google pages, or only "Active"? Today almost everything is
  "Check", so "Active only" would leave nearly empty pages. Suggestion: show both, labelled the same way as in the app.
- Copying: public pages make the whole list easy to copy (the app limits this on purpose, see v22). Suggestion: the
  pages show title, area, day/time, ages and price, and the full details stay in the app.
- Order: build this after testers start, or before? Google takes months anyway. Suggestion: right after the domain
  is connected, so the clock starts early.

## Order of work (about 2–3 sessions)
1. Add the `borough` column and fill it from postcodes (one script, postcodes.io bulk lookup)
2. Worker: class pages + event markup
3. Worker: borough / activity / age pages + noindex rule
4. sitemap.xml, robots.txt, Search Console
