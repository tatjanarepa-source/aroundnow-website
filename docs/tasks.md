# Tasks

Ideas and problems to come back to. Newest first. Tick when done.

## Every morning

1. Ask Claude "what did the night run find?" → review the new batch files, then import the good ones
   (`npm run import:listings -- research/batches/<file>.csv`) and `git pull` first.
2. Pick the next thing from the lists below. The nightly run works down `research/log.md` → Queue by itself;
   jobs marked "run locally" need Claude in Chrome on this computer.

## App plan (agreed 28 Oct 2026)

Decisions: remove the spreadsheet "good / watch out" comments; miles by default (km as an option); ratings and open
comments later; laptop/tablet layout = big map with the list in a side panel.

### Phase 1 – Claude works alone (all local, tested in the browser, one deploy at the end)
- [x] Distance: "about 1.1 km" instead of "~1.1 km" (the "~" looked like a minus sign)
- [x] Miles / km switch next to the location, miles by default; distance choices ½, 2, 3, 6 miles (1, 3, 5, 10 km)
- [x] Remove the "include online" toggle at the bottom (keep the Online filter)
- [x] Remove the random "good / watch out" comments from cards and details
- [x] Hidden age chips: the selected ages show as a chip at the start of the age row; tap it to clear them
      (closes the "Hidden age chips" item below)
- [x] "Add a class" form: ages in months as well as years (e.g. 3, 6, 18 months), since many baby classes start
      at "6 weeks", "4 months" or "18 months". Today the form only offers whole years
- [x] "N more just outside your circle" hint, with a button to widen the distance
- [x] Laptop and tablet layout: map on the right, filters and list in a left side panel
- [x] Tester feedback button ("Something not right? Send to developer"): sends filters, rough area, screen size,
      app version and a typed question, after asking. Code and SQL file ready; needs Tatjana's SQL run (Phase 2)
- [x] Pre-deploy check: automated test that loads the app, sees listings and tries the main filters;
      `npm run deploy` stops if it fails
- [x] Design options (not built into the app yet): colour-coded cards (stripe vs tint) and a see-through panel over
      the map, as a clickable mock-up to choose from
- [x] Research: add eventfirst.co.uk (Russian/Ukrainian children's events) as a source; check its West London events

### Phase 2 – needs Tatjana (short steps at the end of Phase 1)
- [x] Run `supabase/migrations/20261028_feedback.sql` in the Supabase SQL editor
- [x] `npm run deploy` (runs `npm run check` first) and `git push`
- [x] `npm run import:listings -- research/batches/2026-10-28-london-eventfirst.csv` (Baba Yaga show)
- [ ] On the phone, compare: the normal app, `?look=stripe`, `?look=tint`, `?look=glass` (can be combined, e.g.
      `?look=stripe,glass`). Tell Claude which to keep; the others get removed
- [ ] Look at the app on a laptop and a tablet (list on the left, map on the right)
- [ ] Try "Something not right? Tell us" at the end of the list; read messages with `npm run feedback`

### Phase 3 – next (needs accounts or decisions)
- [ ] Email service for sign-in emails to real users (e.g. Resend, free tier): Tatjana signs up, Claude connects it
- [ ] Password sign-in with "forgot password", and/or Google sign-in
- [ ] "About / How it works" page
- [ ] Add a class from a photo of a poster (AI reads it and fills in the form): needs an AI API key and a small server part
- [ ] Staging copy of the site to try changes before they go live

### Later
- [ ] Parent tips/comments for signed-in users, with report button and moderation
- [ ] Ratings (once there are enough users)
- [ ] Bigger database plan (backups, more traffic)

## Open

- [ ] **"Brentford Fountain isn't on the map"** (28 Oct): it is live (soft play, family swim, lessons, gymnastics, 4 cards in one
  map bubble). Likely causes on the phone: the 3 km circle around "Near me" doesn't reach Brentford; a When filter
  (Today/Weekend) hides listings without days (family swim, lessons); an age or activity filter; or an old app version
  (close and reopen). Maybe: show "N more just outside your circle" so it's obvious.
- [ ] **Classes to research next** (parents' tips and leads, full list in `research/sources.md` → Known leads):
  - Ealing Council play centres (free, 0–12): council page is undated, check they're still open
  - YMCA South Ealing: gymnastics (no current times) and a café with a play area
  - Everyone Active Reynolds and Elthorne (no pools; other kids' activities?)
  - Brentford FC Boogie Bees dance (no sessions this term); Ealing SEND multi-sports at Greenford Sports Centre (8–16, day not read)
  - Riding schools and city farms: Stag Lodge, Barnfield, Littlebourne, Deen City Farm (in the nightly queue)
  - First Swim Twickenham pool (Chiswick done)
  - Maples Children's Centre: Friary Park community centre address missing
  - Znaniye Russian school (live as R033): compare its details with znaniye.com
- [ ] **Keep an eye on** (listings that may change soon):
  - Finnegan's World: weekday nursery (2–5) "opening soon"; add it when it opens
  - A Little Me Time "Little Explorers Play Club" (Fri, £5): booking form only showed May 2026 dates; is it still on?
  - First Swim Chiswick: only Level 1 times read; no beginner toddler class this term (winter term from 23 Nov)
  - Ealing Central library sessions: only one week of dates was published; check they repeat weekly
- [ ] **Missing pool times**: Brentford Fountain family swim and New Chiswick Pool lessons and inflatable sessions have
  prices but no days, so they never show under Today/Tomorrow/Weekend. Times are in the Lampton Leisure app.
- [ ] **Hidden age chips still filter the list** (found 2026-10-27)
  On the phone, ages 2 and 3 were selected, but "12+" was also still on from an earlier visit. It sat off-screen
  at the end of the scrolling age row, so a 4–16 tennis class showed up and looked like a bug. The app remembers ages
  between visits, which makes this easy to miss.
  Ideas to think through (may need a design change):
  - Scroll the age row so the first selected chip is in view, or move selected ages to the front of the row
  - A short summary next to "Age", e.g. "2, 3, 12+", or a "Clear" button when any age is on
  - Show which ages each card matched ("for 12+") when several are selected
  - Fewer chips that all fit on one row: age bands (Baby, 1–2, 3–4, 5–7, 8–11, 12+) instead of 13 single years
  - Ask "remember my ages?" instead of always remembering them
- [ ] **Re-check children's centres each month**: Ealing publishes new timetable PDFs every month
  (ealingfamiliesdirectory.org.uk/childrens-centre-timetables). Next: early November 2026.
