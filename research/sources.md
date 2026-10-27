# Where to look for kids' classes

The checklist for every research run. Add to it whenever you learn a new kind of place
or a new lead. A run takes **one area × one source type** (see `log.md` for what's next).

Focus for now: **Russian-speaking and English-speaking** classes. Other languages
(French, Polish, Spanish, German…) are welcome as a separate source type.

## How to search

- **Google finds what the built-in search misses** (Gemstones didn't appear in 3 built-in searches but was
  Google's first result). In a local session, search Google in Chrome (`google.com/search?q=...&hl=en`) and
  read the results page. The cloud run has no browser, so for hard-to-find things mark the job "run locally".
- Search the way a parent would: "<activity> <area>", "Russian Saturday school <area>", "baby class <postcode>".
  Also try the name in other languages (Самоцветы = Gemstones) and the venue ("Saturday school Little Ealing Primary").
- Schools rent their halls at weekends: "<school name> Saturday" finds language schools and clubs.

## Rules

- Use the organisation's **own website** (or the council's) as the source. Directories
  (Hoop, Happity, Netmums) are fine for *finding* leads, but confirm on the provider's site.
- **No Facebook, Instagram or WhatsApp scraping.** Leads from there go in `log.md` as
  "lead, not checked" for a person to look at.
- **Church services for children count** (e.g. toddler services followed by stay & play). Say it's a
  service in `Description`/`NeedsInfo` so parents know.
- **Organisations only.** No private individuals (a tutor working from home, a childminder).
- **Freshness: what counts.** A class goes on the map only if there is evidence from the
  **last 12 months** (a dated timetable or term, upcoming dates), or the organisation's **own
  website** lists it as running now. If the newest evidence is older than 12 months, or it
  appears only on a directory (Happity, Eventbrite, Hoop) with past dates, it does **not**
  count: put it under "Leads not checked" in `log.md` instead.
- **A parent's first-hand report** ("I go every Thursday") counts as fresh evidence. Still look
  for the organiser's own page to get the exact times; parents' times can be off.
- Never guess a day, time, age or price. Leave it empty and say what's missing in `NeedsInfo`.
- Every row gets `Status = Check`, so it shows as "Not yet confirmed" until a parent confirms it.
- Note how current the timetable is ("2026/27 timetable", "page updated Sep 2026") in `NeedsInfo`.
- No private contact details (personal phone numbers or emails) in batch files.

## Source types

### Places that host classes
- **Churches and church halls**: don't rely on keyword searches; groups have their own names
  ("Mini Saints", "Tiddlers", "Shining Stars"). Sweep venue by venue instead:
  1. List every church in the area: A Church Near You (Church of England: search the postcode),
     plus Catholic parishes, Baptist, Methodist, URC, Salvation Army and independent churches.
  2. For each church, open its events page (`achurchnearyou.com/church/<id>/service-and-events/events-all/`)
     and its own website's "what's on" or "children and families" page.
  3. Write in `log.md` which churches you checked, so the next run doesn't repeat them.
  Note: churches rarely post weekday groups on A Church Near You. Their own website ("hosting our
  community", "children and families") and booking pages are usually where they are.
  Ealing's Church of England churches are A Church Near You IDs 15685–15700.
- **Pubs with function rooms**: "what's on" or "events" pages (e.g. The Drapers Arms in Ealing).
- **Community centres and halls**: council-run and charity-run.
- **Libraries**: rhyme time, Bounce and Rhyme, Lego club, homework club.
- **Leisure centres**: swimming lessons, gymnastics, trampolining (Everyone Active, GLL/Better).
- **Parks and gardens**: forest school, nature clubs, park rangers' events.
- **Museums, galleries and theatres**: family workshops and holiday activities.

### Football club community trusts
Professional clubs' charities run toddler football, gymnastics, dance, holiday camps and after-school clubs, often
under their own brand names. Ealing area: **Brentford FC Community Sports Trust** (Mini Bees football, Tumble Bees
gymnastics, Boogie Bees dance at Gunnersbury Park Sports Hub; done 2026-10-27), **QPR in the Community Trust**,
**Fulham FC Foundation**, **Chelsea Foundation**. Their own site often links an old timetable; the current term is on
their booking platform.

### Booking platforms (best for current timetables)
- **Pebble** (activities.bookpebble.co.uk): a provider's `/supplier/...` page lists every venue with this term's
  sessions, ages and "next session" date. Find it with Google `site:activities.bookpebble.co.uk <provider>`.
  Venue sections expand on click; each session card opens a panel with times and the lowest price.
- **ClassForKids** (classforkids.io) and **Happity** (happity.co.uk): good for finding leads; confirm on the provider's site.
- School after-school clubs listed there (e.g. "Mount Carmel – Year 3&4 tennis") are usually for that school's pupils only: skip.

### Event sites
- **Ticket Tailor** (tickettailor.com): used by small charities, e.g. Ealing 135
  (`tickettailor.com/events/ealing135`): stay & plays, forest school. Organiser pages list all upcoming dates.
- **Eventbrite** (eventbrite.co.uk): its own search pages need a real browser and mostly show promoted adult
  events. Best route: Google `site:eventbrite.co.uk <area> toddler OR baby OR kids OR family`. Thin for Ealing kids
  (Oct 2026). Otherwise search "<area> kids", "<area> baby", "<area> toddler" and
  family events. Many small organisers (churches, charities, baby groups) take bookings there.
  Read the event pages the way a parent would; no bulk scraping (against Eventbrite's terms).
  - A **recurring** event with upcoming dates becomes a normal listing (that counts as fresh).
  - A **one-off** event with an upcoming date becomes a listing with `Format = Workshop / event` and
    `EventDate` (and `EventEndDate` if it runs over several days). It disappears from the app after it ends.
  - Note the **organiser** in the batch row. Later we can pull their upcoming dates automatically.

### Council
- Family hubs and children's centres (the council's "family hubs" page). Ealing: monthly PDF timetables linked from
  `ealingfamiliesdirectory.org.uk/childrens-centre-timetables` (needs a real browser to find the links; the PDFs themselves
  download fine). Read the 3 locality PDFs; the text is in 5 day columns, so extract by column (pypdf with positions)
- The council's Family Information Service / Local Offer directory.

### Franchises (one "find a class" page covers a whole region)
Bach to Baby (family concerts), Baby Ballet, Tumble Tots, Water Babies, Puddle Ducks, Monkey Music, Hartbeeps, Toddler Sense,
Baby Sensory, Jo Jingles, Little Kickers, Mini Professionals, Stagecoach, Perform, Razzamataz,
Kumon, Explore Learning, Crafty Kids, Rugbytots, Footy Pups, Diddi Dance.

### Independent providers, by activity
Ballet and dance, gymnastics, swimming, art, music, drama, martial arts, football,
tennis, chess, coding, cooking.

### Language
- **Russian**: Saturday and Sunday schools, Russian-speaking clubs, art, music, chess, ballet.
- **French**: nurseries, *écoles du samedi*, Petite École.
- **Other**: Polish Saturday schools (often at Catholic parishes), Spanish, German, Italian, Japanese, Ukrainian.

## Known leads (check these first in their area)

| Lead | Area | Notes |
|---|---|---|
| The Drapers Arms | Ealing Broadway | Pub; offers some classes from about 3 years. Find its events page |
| All Saints Ealing, W5 3JJ | Ealing Common | Done: Mini Saints (found by a parent, missed by keyword search) |
| Gemstones (Samotsvety) Russian Saturday school | Little Ealing W5 4EA | Done 2026-10-27. Our search tool missed it; Google found it at once (gemstoneselc.com) |
| La Chouette Nursery School | Ealing W5 3TJ | French nursery |
| Ealing libraries: Northfields, Greenford, Hanwell, Acton | Ealing | Rhyme times; addresses already confirmed |
| Ealing Junior Chess Club | Ealing | |
| Supercamps (Notting Hill & Ealing High School) | Ealing | Holiday camp |
| Polish Saturday school near St Benedict's | Ealing | |
| Hartbeeps, Toddler Sense, Jo Jingles | Ealing | Franchises |
| Forest school: Horsenden Hill, Walpole Park, Pitshanger Park | Ealing | |
| Footy Fun 4 Kids (Mini Kickers, 1–3 years) | Ealing | footyfun4kids.com; drop-in toddler football |
| Little Kickers Ealing and Uxbridge | Ealing | Franchise, 18 months–8 years |
| Toddlers & Kids Football at All Saints, Ealing Common | Ealing Common | Saturdays, seen on clubhubuk.co.uk; find the organiser |
| First Steps Sports Club, We Make Footballers, Ealing United FC | Ealing | Football 2–12 years |
| Twisters gymnastics and dance | West Ealing / Acton | twisters.org.uk; preschool gym at St John's W13, Acton Baptist Church |
| Ealing Gymnastics, YMCA South Ealing, Club des Sports, The Little Gym Chiswick | Ealing / Chiswick | Gymnastics |
| QPR in the Community Trust, Fulham FC Foundation | West London | Club community trusts, like Brentford's |
