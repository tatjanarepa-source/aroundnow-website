# Where to look for kids' classes

The checklist for every research run. Add to it whenever you learn a new kind of place
or a new lead. A run takes **one area × one source type** (see `log.md` for what's next).

Focus for now: **Russian-speaking and English-speaking** classes. Other languages
(French, Polish, Spanish, German…) are welcome as a separate source type.

## Rules

- Use the organisation's **own website** (or the council's) as the source. Directories
  (Hoop, Happity, Netmums) are fine for *finding* leads, but confirm on the provider's site.
- **No Facebook, Instagram or WhatsApp scraping.** Leads from there go in `log.md` as
  "lead, not checked" for a person to look at.
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
- **Pubs with function rooms**: "what's on" or "events" pages (e.g. The Drapers Arms in Ealing).
- **Community centres and halls**: council-run and charity-run.
- **Libraries**: rhyme time, Bounce and Rhyme, Lego club, homework club.
- **Leisure centres**: swimming lessons, gymnastics, trampolining (Everyone Active, GLL/Better).
- **Parks and gardens**: forest school, nature clubs, park rangers' events.
- **Museums, galleries and theatres**: family workshops and holiday activities.

### Event sites
- **Eventbrite** (eventbrite.co.uk): search "<area> kids", "<area> baby", "<area> toddler" and
  family events. Many small organisers (churches, charities, baby groups) take bookings there.
  Read the event pages the way a parent would; no bulk scraping (against Eventbrite's terms).
  - A **recurring** event with upcoming dates becomes a normal listing (that counts as fresh).
  - A **one-off** event with an upcoming date becomes a listing with `Format = Workshop / event` and
    `EventDate` (and `EventEndDate` if it runs over several days). It disappears from the app after it ends.
  - Note the **organiser** in the batch row. Later we can pull their upcoming dates automatically.

### Council
- Family hubs and children's centres (the council's "family hubs" page).
- The council's Family Information Service / Local Offer directory.

### Franchises (one "find a class" page covers a whole region)
Baby Ballet, Tumble Tots, Water Babies, Puddle Ducks, Monkey Music, Hartbeeps, Toddler Sense,
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
| La Chouette Nursery School | Ealing W5 3TJ | French nursery |
| Ealing libraries: Northfields, Greenford, Hanwell, Acton | Ealing | Rhyme times; addresses already confirmed |
| Ealing Junior Chess Club | Ealing | |
| Supercamps (Notting Hill & Ealing High School) | Ealing | Holiday camp |
| Polish Saturday school near St Benedict's | Ealing | |
| Hartbeeps, Toddler Sense, Jo Jingles | Ealing | Franchises |
| Forest school: Horsenden Hill, Walpole Park, Pitshanger Park | Ealing | |
