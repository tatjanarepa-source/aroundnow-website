# Tasks

Ideas and problems to come back to. Newest first. Tick when done.

## Every morning

1. Ask Claude "what did the night run find?" → review the new batch files, then import the good ones
   (`npm run import:listings -- research/batches/<file>.csv`) and `git pull` first.
2. `npm run feedback` also says when the last database backup was; it shouts "!!! BACKUP" if it's over 2 days old.
3. Pick the next thing from the lists below. The nightly run works down `research/log.md` → Queue by itself;
   jobs marked "run locally" need Claude in Chrome on this computer.

## Tomorrow (3 Nov)

1. Phone (v49): edit the Ballet Class languages (Romamian → Romanian from the list); add a class with "Not mentioned" days; Filters → Dance style → Ballet; a test city request
2. `npm run stats` and `npm run edits` (first real numbers), `npm run feedback`
3. Ballet Class (YMCA South Ealing): still running? call 020 8832 1501 or the teacher; phone number in the description OK to show?
4. Say "go" to restart research: redo Monkey Music + Baby Sensory per age group, rest of Little Kickers and Hartbeeps (south/south-east/east), then libraries, leisure centres, children's centres, museums
5. Review the 90-day freshness check before London grows (ideas below)

## Tatjana's ideas (1–2 Nov 2026)

Done in v41 and v42 (deployed 2 Nov):
- [x] Tap the address on a class page → Google directions (the Directions button was already there)
- [x] "All ages" button on the add-a-class form (from birth, no upper age; tap again to clear)
- [x] "Suits both" / "Suits all" tag removed

Research (London basic layer rule: one row per age group / session applies):
- [ ] Children's centres: one row per session (her screenshot of Grange: Tiny Sports Stars, bumps to babies, stay and
      play all in one "When" text) → redo as a `...-update.csv` with the next monthly timetable
- [ ] New searches: crazy golf, bowling, paintball (age limits!), sport competitions, football, rugby, cricket, tennis
      clubs and tennis classes, ballet competitions
- [ ] Liut Swim (Russian swimming school, R016–R018): live but only area pins (Chiswick, Brent Cross, Brentford), no
      postcode or times → re-check from its Facebook page

App ideas (need a decision on how):
- [ ] **"Plan my day" for members** (Tatjana, 3 Nov): the parent picks how far they're happy to travel and the kids' ages, and gets a day plan (classes, then a playground, café or museum nearby, in time order). Name ideas: Day Scanner, Fun Scanner
- [x] **"Message the tutor"** (built 4 Nov, v51; Tatjana picked the contact form over in-app chat): private tutors (provider_type individual) show on the map without website, address or phone; signed-in parents send a message (max 10 a day), stored in contact_messages; `npm run messages` shows them with the tutor's private contact to forward, `npm run messages -- sent <n>` marks one done. To go live: run supabase/migrations/20261104_message_tutor.sql, then deploy. Only tutors with an email in listing_contacts show (Tatjana, 4 Nov: no email, no way to pass it on); none of the 4 has one yet (R046 has a contact but no email). The same SQL raises the list limit from 2,000 to 6,000 (a 25 km circle from Ealing already hit 2,000 on 4 Nov). Later: send automatically by email (needs an email service, e.g. Resend)
- [x] Pick several days in the calendar (v42): days in the strip add up, e.g. "80 on Tue, Thu"; tap a day again to take it off
- [x] "Don't show" in Filters (v42): hide types (weekend schools, nursery…) or activities; crossed out, remembered on the phone
- [ ] Group events by theme: Christmas, Halloween, Easter… (a "theme" field on events + chips in season)
- [ ] Look up events far ahead by choosing dates (maybe for members)
- [ ] Classes with several sessions: "more dynamic" view, e.g. show the next session from the current time (maybe for
      members)
- [ ] Let individuals add their own classes (now organisations only; brief 7.5 hid private individuals; needs rules:
      no home addresses on the map? sign-in, confirmation)
- [ ] **Parents edit classes themselves** (v43, 2 Nov: "driven by the people", replaces v42's "Suggest a change"): "Edit this class" on every class page opens the add form filled in; signed-in parents only; only changed fields are saved; the class goes back to "Not yet confirmed" until ANOTHER parent confirms (the editor can't). Every edit kept with old/new values: `npm run edits`, `npm run edits -- undo <id>`; 20 edits per person per day. To go live: run supabase/migrations/20261102_3_edit_listing.sql, then deploy. Note: re-importing a research batch overwrites parents' edits to those rows (check npm run edits before re-importing)
- [x] Statistics (v42): `npm run stats` (people per day, app opens, areas searched, ages, classes opened, reports, messages, suggested changes, classes added). Needs supabase/migrations/20261102_2_usage_stats.sql run first. Could become a private dashboard page later. Statistics page for Tatjana: users, areas searched, reported issues, classes added (needs simple, privacy-
      friendly counting: Cloudflare Web Analytics + counts from Supabase; areas only as rough areas)
- [x] Ballet filter (v46): "Dance style" row in Filters (Ballet, Tap, Jazz, Contemporary, Street & hip hop, Ballroom & Latin) when dance is nearby

- [x] Language list on the add/edit form (v49): English/Russian buttons, "Add a language…" list (~48 London languages + any already on the map), "+ Add a new language" with tidy capitals and "Did you mean Romanian?"
- [x] "Want AroundNow in your city? Give us a shout" (v49): in the Where sheet and when nothing is found; arrives as "City request: <city>" in npm run feedback, counted in npm run stats
- [x] Fix "romamian" → "Romanian" on C261102da572 (done 3 Nov)

## London basic layer (agreed 2 Nov 2026)

Whole of London, but only the big structured sources for now; deep borough-by-borough research (churches, halls,
independent schools) is parked: not realistic at this stage. `npm run progress` shows the bars. Start: 10% (412 of ~4,100).

- [ ] Franchise class finders, London-wide (~1,800): Little Kickers, Water Babies, Baby Sensory/Toddler Sense,
      Monkey Music, Hartbeeps, Rugbytots, Tumble Tots, Stagecoach, Kumon, Puddle Ducks, Jo Jingles, Musical Bumps,
      Diddi Dance, babyballet, Creation Station, Pyjama Drama, Little Gym and similar. One row per venue
- [ ] Libraries, every borough (~900): rhyme times, story times, Lego clubs
- [ ] Leisure centres (~600): Better/GLL, Everyone Active, Places Leisure, council-run: swim lessons, soft play, gym
- [ ] Children's centres / family hubs, every borough (~500)
- [ ] Museums, city farms, zoos, attractions (~300)
- [ ] Then stop adding and review.
- [ ] **Review the 90-day freshness check before London grows** (asked 2 Nov). With ~4,000 classes, 90 days means
      ~45 re-checks a day. Ideas: re-check by provider (one class finder refreshes all its venues), a no-AI script
      that re-opens each page and flags only the changed ones, longer intervals for stable sources (libraries,
      museums, franchises) and shorter for small independents, parent confirmations

## Day by day + light mode (built and deployed 1 Nov, v31)

Tatjana picked design B ("Day by day", bigger map) from the design canvas
(https://claude.ai/artifact/1jCeBecu82UPimLufhmXmQ) and asked for both light and dark.
- [x] Light and dark looks: the app follows the phone's setting; "Where" sheet → Appearance: Phone setting / Light / Dark
      (remembered on that phone). The laptop is set to light, so the app opens light there unless Dark is picked
- [x] Day strip (Today + the next 6 days) replaces the Today / Tomorrow / This weekend chips; "This weekend" is in Filters
      and lights up Saturday and Sunday
- [x] A picked day lists its classes as a timetable: Morning / Afternoon / Evening / Time not listed, with start and
      end times; tap the day again for every day (the usual nearest-first cards)
- [x] Map pins show start times when a day is picked; a label that would cover another is left out until you zoom in
- [x] Filters button moved next to the count; the language chips are inside Filters now (counted on its badge)
- [x] Prices like "£2,935" no longer show as "£2"
- [x] v32: age chips all the same circle. v33: light look in the "Trendy 2026" colours Tatjana picked from the canvas
      (off-white, teal selected day and buttons, pink + button, sage map bubbles); dark look unchanged. Deployed 1 Nov
- [x] The map stays as big as before (the panel rests where it did), which is bigger than the "bigger map" mockup

Test after deploy (close and reopen the app first):
- [ ] Phone in dark mode → app dark; phone in light mode → app light; Where → Appearance → Light or Dark overrides it
- [ ] Tap a day → timetable and start times on the pins; tap it again → back to all days
- [ ] Filters → This weekend → Saturday and Sunday light up, and the list is split by day
- [ ] Say if the map should be bigger still

- [x] **Light look shows dark grey on Tatjana's phone** (1 Nov): live CSS has the right light colours and the laptop
      shows them; v37 added `color-scheme: only light` in case the phone's browser darkens sites. Fine on her phone
      on 2 Nov

- [x] **New free map** (v38, 1 Nov): OpenFreeMap through MapLibre inside Leaflet: "Liberty" in the light look,
      "Fiord" in the dark one (picked on the canvas). Old OpenStreetMap tiles if a phone has no WebGL. Tested in the
      browser (both looks, switching, zoom, start times). Deployed 1 Nov
- [ ] **Small shadows on cards and buttons** (v39, 2 Nov): picked on the canvas, "subtle" in the light look and
      "a bit more" in the dark one (dark also gets a faint light top edge). Day buttons, age circles, class cards,
      the + and the big buttons; the selected day and filled buttons glow in the accent colour. Deployed 2 Nov
- [ ] **Load only what's needed** (v40, 2 Nov; was: the app loads at most 500 classes, which from Ealing Broadway
      reached only 11.8 km). New `listings_within` sends the classes inside the chosen circle and the next bigger
      one (+1 km), without the description, schedule note and street address; `listing_details` sends those when a
      class is opened. Default 2 mi: about 44 KB instead of 98 KB. To go live: 1) run
      `supabase/migrations/20261102_listings_within.sql` in the Supabase SQL editor, 2) `npm run deploy` (the check
      stops the deploy until step 1 is done). `listings_near` stays for phones on older versions; drop it in a month
- [ ] **Google Maps look** (asked 1 Nov, mainly for the look): parked, keep the free map for now. Needs a Google
      Cloud account with billing, a Maps JavaScript API key (locked to the site), dark and light map styles; about
      10,000 free map loads a month then about $7 per 1,000 (check current pricing); about a day to swap the map.
      Free look-alikes to try first: CARTO Voyager tiles, OpenFreeMap styles

## Tatjana's list (30–31 Oct)

- [x] **"Reported" label** (Tatjana's idea, 1 Nov, v30; SQL run and deployed 1 Nov; test reports on St Mary's and A Little Me Time deleted): after the first report a class shows "Reported: not running?"
      (or "details wrong?" / "listed twice?") on its card, and its details ask the next parents "Do you know if that's
      right?" with "No, it still runs" (a confirmation: takes the label off and resets the count) and "Yes, I agree" (a
      second report: hides it until we check). Only the reason and date show, never who reported or their note.
      To go live: 1) run `supabase/migrations/20261101_reported_label.sql` in the Supabase SQL editor, 2) `npm run deploy`.
      Test: St Mary's Ealing babies group should show the label (from the 1 Nov test report). Then watch with real
      parents whether people report silly things; if they do, we could show the label only for "not running" / "details wrong"

- [x] **"Send report" did nothing and jumped to the top** (fixed in v28, deployed 1 Nov as v29). Every tap in a class's
      details redrew it from the top, so the "Pick what's wrong first." message under the button was out of sight and
      nothing was sent (your 31 Oct report never reached the database). Now the details keep their scroll position and
      the message scrolls into view. Test after deploy: open a class → "Something's wrong" → type a note without picking a
      reason → Send → the message shows; pick a reason → Send → "Thanks" shows
- [x] **One "something's wrong" link** (built 31 Oct, v29, deployed 1 Nov): the "Something's wrong" button in the
      "Know it?" box is gone; the link "Something wrong with this class? Tell us" at the bottom of every class opens the
      report box (reasons + note, counts towards hiding) for signed-in parents, and the message form for everyone else or
      anyone who already reported it. Test after deploy, signed in and signed out. Was: two places: the "Something's wrong" button in the "Know it?" box
      (signed-in parents only; goes to `listing_reports`; two reports from different parents hide the class) and the link
      "Something wrong with this class? Tell us" (anyone; goes to `feedback`). Proposal: keep one link, "Something wrong?
      Tell us", for everyone; signed in → it counts as a report (can hide the class), not signed in → it is a message to us.
      (Tatjana OK'd 31 Oct)
- [x] **Where do reports go?** Both kinds are read with `npm run feedback`: messages (feedback table) and open reports on
      classes (listing_reports). Nobody is notified yet. Next step: an email to Tatjana when a report or message arrives
      (needs the email service from "Sign-in" below), or a daily summary
- [x] **Keep an eye on classes parents add**: `npm run feedback` now also lists every class parents added in the last
      14 days (none so far). Look at it each morning while the app is young
- [x] **Ballet at Ealing Green Church** wasn't listed: it's Ealing School of Dance (preschool ballet and tap, Mon/Thu/Fri
      after school; Saturday nursery ballet 2–3 at St Matthew's and Blondin Park). Batch
      `research/batches/2026-10-31-ealing-school-of-dance.csv` (3 rows), imported 1 Nov
- [ ] **Sign-in**: see Phase 3 (email service such as Resend so sign-in emails reach real users; password and/or Google
      sign-in). Needs Tatjana to create the email service account
- [ ] **About page**: draft written 31 Oct in `docs/about-draft.md` (questions in [brackets]); once Tatjana approves the
      wording Claude builds it into the app in English and Russian. Was: what AroundNow is, who runs it, how classes get on the map, how to report or add one, privacy.
      Claude can draft the text and page; Tatjana checks the wording
- [ ] **Earn money**: affiliate links checked 28 Oct (Ticketmaster via Impact ~0.6–1%, needs approval; Eventbrite none):
      not worth it until we list ticketed shows. Simplest start: a "Buy me a coffee" (or Ko-fi) link on the About page;
      Tatjana creates the account and sends the link. Later ideas: featured listings for providers, a small fee for
      providers to manage their own listing
- [ ] **Morning research at 07:00** (Tatjana chose 07:00, 31 Oct): `scripts/morning-research.ps1` + instructions in
      `scripts/morning-research.md` (2–3 parallel agents on the next "run locally" lines; commits, never imports, deploys
      or pushes; log in `Documents\AroundNow-Research-Logs\<date>.log`). Claude wasn't allowed to create the scheduled
      task itself; Tatjana registers it once (command in the 31 Oct chat / README). Each evening: read the log, then
      import the good batches. Was: research on a schedule around the 5-hour limit: research uses the 5-hour allowance fast (5 parallel agents
      used it up in ~20 min on 31 Oct, and the weekly limit was hit the same day). Idea: a morning run (e.g. 07:00) with
      2–3 agents so the allowance has reset by the evening when Tatjana works. Options: Windows Task Scheduler starting
      Claude Code on this laptop (Chrome must be open for the "run locally" jobs), or the existing nightly cloud run for
      jobs that don't need Chrome. Needs Tatjana to choose the time and how many agents

## Fill in a class from a photo (live 30 Oct, v27)

The + form starts with "Fill in from a photo": a parent takes or picks a photo of a poster, flyer or screenshot,
Claude Haiku 5.5 reads it on our server (`worker/`), the form fills in, and the parent checks every step before adding.
About $0.001 (0.08p) a photo, 3–9 seconds. Limits: signed-in parents only, 10 photos each a day, 200 a day for
everyone together. Key: Anthropic console (spend limit set); on the server as the secret `ANTHROPIC_API_KEY`, on this
laptop in `.dev.vars`. A new key: put it in `.dev.vars`, then
`! grep ANTHROPIC_API_KEY .dev.vars | cut -d= -f2- | tr -d '
' | npx wrangler secret put ANTHROPIC_API_KEY`

- [x] Tried on 6 real photos (30 Oct): all read right after fixing postcodes and family events
- [x] Works on the phone (30 Oct). The street address isn't on most posters: left for the parent to type
      (looking it up online would cost ~10x more and can pick the wrong venue)
- [x] v27 deployed 30 Oct (an old photo error no longer stays on the form)
- [ ] Later, if parents get stuck on the street line: make it optional when there's a venue and a full postcode
- [ ] Now and then: `select date(created_at), count(*) from poster_reads group by 1 order by 1 desc;` and the
      Anthropic console's usage page

## Database backups (nightly since 30 Oct)

Supabase's Free plan keeps no backups at all, so we make our own.
- [x] `npm run backup`: every table, the parents' accounts and the database setup, to
      `Documents\AroundNow-Backups\<date>\` (outside the project, never on GitHub; it holds parents' emails).
      Keeps 14 days plus the first backup of each month
- [x] Windows Task Scheduler runs it every night at 23:30 ("AroundNow nightly backup"); if the laptop is off,
      as soon as it's next on. Log: `Documents\AroundNow-Backups\backup.log`

To think about later:
- [ ] Second copy in Google Drive: install Google Drive for desktop, then add
      `BACKUP_COPY_DIR=G:\My Drive\AroundNow-Backups` to `.env` (the script already copies there when it's set)
- [ ] Full database copy with `pg_dump` as well (exact copy, one-step restore). Needs PostgreSQL 17 client tools
      on the laptop (the installed PostgreSQL 12 is too old) and the database password in `.env`
- [ ] Practise a restore into a spare free Supabase project, so we know the backup really works
- [ ] Backups only run when the laptop is on. Later: run them from a server instead (e.g. a scheduled GitHub Action
      or Cloudflare cron), with the copies stored privately
- [ ] Supabase Pro ($25/month): daily backups kept 7 days (restore from the dashboard, not downloadable) and no
      pausing; point-in-time recovery is about $100/month extra. Automatic failover only as an early test feature
      (Multigres), not for real apps yet. Revisit when there are real users

## Duplicates and sharing (live 30 Oct as v24)

To go live, in this order:
- [x] Run `supabase/migrations/20261030_duplicates.sql` in the Supabase SQL editor
- [x] `npm run deploy` and `git push`

Then test on the phone:
- [x] Open a class → share icon (top right, next to ×) → the phone's share menu → send to yourself on WhatsApp;
      the link opens the app on that class, with the map around it
- [x] Add a class with the same name and postcode as one on the map → "Is it one of these?" →
      "Yes, that's it" confirms the existing class; "No, mine is different" carries on to the last step
- [ ] Add the same class twice → the second time says "You’ve already added this class."
- [ ] "Something's wrong" on a class has "It’s listed twice"
- [ ] `npm run feedback` lists new classes held back as possible duplicates (with the class they look like)

Later: merge tool (keep one, move its confirmations, hide the other); WhatsApp link previews with the class name.

## To test on 29 Oct (everything from 28 Oct, live as v23)

Close and reopen the app (or reload on the laptop) first, so it has the latest version.

- [ ] Feedback on a class: open a class → "Something wrong with this class? Tell us" → pick e.g. "Wrong activity" → Send →
      "Thank you!" shows
- [ ] Filters → "A filter not working? Tell us" at the bottom
- [ ] In the form, the "Include my search…" tick box is visible, with area, ages and filters listed under it
- [ ] `npm run feedback`: the message shows the class and filters; the "open it" link opens the same search
- [ ] Price: Filters → Price → Free, then Paid; the list and map change
- [ ] Sports: Filters → Activity has Swimming, Gymnastics, Dance, Football, Martial arts, Tennis, Horse riding,
      Other sports; dance cards say the style ("Dance: Ballet, Tap")
- [ ] Area by area: search Camden or Richmond, classes there show; back to Ealing shows Ealing's again
- [ ] Original design: solid panel, plain cards, no "2, 3" chip in front of Age
- [ ] Baba Yaga New Year show is in the list
- [ ] Distances say "about 1.1 km"; miles/km switch in the place sheet; ½, 2, 3, 6 miles
- [ ] No "include online" switch at the bottom (Online is still in Filters)
- [ ] No "good / watch out" comments on cards
- [ ] Add a class: ages in months (e.g. 6, 18 months)
- [ ] Small distance → "N more within …" at the end of the list, with a button that widens it
- [ ] Laptop: list on the left, map on the right
- [x] Look at 2 open class reports (`npm run feedback`): Centrum Gymnastics "details are wrong" (27 Oct; fixed 1 Nov from its website: rhythmic gymnastics, ages 6–17, Tue/Thu/Fri 18–20 and Sat 8:45–10:45, £25 trial; report resolved);
      A Little Me Time nursery "not for kids" (28 Oct, Tatjana's test: deleted 1 Nov)

## App plan (agreed 28 Oct 2026)

Decisions: remove the spreadsheet "good / watch out" comments; miles by default (km as an option); ratings and open
comments later; laptop/tablet layout = big map with the list in a side panel.

### Phase 1 – Claude works alone (all local, tested in the browser, one deploy at the end)
- [x] Distance: "about 1.1 km" instead of "~1.1 km" (the "~" looked like a minus sign)
- [x] Miles / km switch next to the location, miles by default; distance choices ½, 2, 3, 6 miles (1, 3, 5, 10 km)
- [x] Remove the "include online" toggle at the bottom (keep the Online filter)
- [x] Remove the random "good / watch out" comments from cards and details
- [x] ~~Hidden age chips: the selected ages show as a chip at the start of the age row~~ Removed 28 Oct (Tatjana
      didn't like it); the "Hidden age chips" problem below is open again
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
- [x] On the phone, compared design options (stripe, tint, see-through panel, whole-card colours). Tatjana liked
      none of them: all removed 28 Oct (v20), the app looks as it did before
- [ ] Look at the app on a laptop (list on the left, map on the right). No tablet to test on
- [x] Feedback works (test #1, 28 Oct). v23: "Something wrong with this class? Tell us" on every class (with quick
      choices), "A filter not working? Tell us" in Filters, every filter sent with the message; `npm run feedback` prints
      it all plus an "open it" link that opens the app with the same search, and also lists open class reports

### Phase 3 – next (needs accounts or decisions)
- [ ] Email service for sign-in emails to real users (e.g. Resend, free tier): Tatjana signs up, Claude connects it
- [ ] Password sign-in with "forgot password", and/or Google sign-in
- [ ] "About / How it works" page
- [x] Add a class from a photo of a poster: built 30 Oct (v25), see "Fill in a class from a photo" above
- [ ] Staging copy of the site to try changes before they go live

### Ideas from Tatjana (28 Oct)
- [x] Price filter in the Filters sheet: Free / Paid (v21). Free = price starts with "Free"; listings with no price
      only show when no price is chosen
- [x] Split "Sports / Dance" into Swimming, Gymnastics, Dance, Football, Martial arts, Tennis, Horse riding and Other
      sports (v21). Done in the app from Subjects and title; the database still says "Sports / Dance". Dance cards
      name the style ("Dance: Ballet, Tap")
- [x] Make copying the whole database harder (28 Oct, v22): the app asks for one area at a time (20 km) through
      `listings_near`; the listings table and the old `search_listings` are closed to the public key
- [ ] Next step if needed: limit how often one visitor can ask (someone determined could still go area by area)
- [x] Affiliate links checked (28 Oct). Ticketmaster UK: programme on Impact (impact.com), roughly 0.6–1% of the ticket
      price, needs approval. Eventbrite: no open programme for sites like ours; only per-event links an organiser sends.
      No live listing links to either today, so not worth it yet. Revisit if we add Ticketmaster family shows or pantos
- [ ] More research without Tatjana: bigger or more frequent nightly runs (the cloud run already works down
      `research/log.md` each night; many sites block the cloud and need Chrome on this computer)

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
