# Research log

Each run takes the **first unticked line** in the queue, saves one batch file in `batches/`,
ticks the line and adds a row to "Done". Keep batches small (up to ~10 classes).

## Queue

About once a month (or when the app shows several "Needs re-checking"), do a **re-check run** first (see the skill).

Ealing first, then the rest of London borough by borough, then England (franchise finders only).

- [x] Ealing: churches, church halls and pubs (incl. The Drapers Arms)
- [x] Ealing: churches, sweep 2: list every church via A Church Near You + other denominations, check each events page (checked so far: St Mary's, St Andrew's URC, St John's, St Stephen's, All Saints, St Paul's hall)
- [x] Ealing: Eventbrite kids, baby and family events (next 2 months)
- [x] Ealing: language (La Chouette French nursery, Polish Saturday school, Russian schools)
- [ ] Ealing: libraries (Northfields, Greenford, Hanwell, Acton rhyme times) **(run locally: council sites block the cloud run)**
- [ ] Ealing: council family hubs and children's centres **(run locally: council sites block the cloud run)**
- [ ] Ealing: Eventbrite, browse in Chrome (monthly: Google `site:eventbrite.co.uk Ealing toddler OR baby OR kids OR family`, past 3 months) **(run locally: Eventbrite search needs a real browser)**. Last done 2026-10-27
- [ ] Ealing: franchises (Baby Ballet, Hartbeeps, Toddler Sense, Jo Jingles, Water Babies…)
- [ ] Ealing: gymnastics and swimming
- [ ] Ealing: art, music and drama
- [ ] Ealing: ballet and dance
- [ ] Ealing: sport (football, tennis, martial arts) and chess
- [ ] Ealing: parks, forest school, museums
- [ ] Ealing: holiday camps
- [ ] London: Russian-speaking classes and schools (all boroughs)
- [ ] London: French and other language nurseries and Saturday schools
- [ ] Hounslow: churches, libraries, family hubs
- [ ] Hammersmith & Fulham: churches, libraries, family hubs

## Done

| Date | Run | Batch file | Classes | Notes |
|---|---|---|---|---|
| 2026-10-27 | Ealing: Eventbrite in Chrome | (none) | 0 | Eventbrite's own Ealing kids/baby/toddler pages show only ~6 promoted adult events. Google `site:eventbrite.co.uk` found 10 Ealing pages: Bach to Baby (already listed), NHS paediatric OT parent workshops (for parents, not added), candlelit Christmas concert at St John's W13 and Ealing Beaver Project walks (general events, not kids' activities). Eventbrite is thin for Ealing kids; Ticket Tailor, Happity and organisers' own sites matter more |
| 2026-10-27 | Ealing: libraries | `2026-10-27-ealing-libraries.csv` | 0 | Blocked: libraries.ealing.gov.uk, ealing.events.mylibrary.digital and ealingfamiliesdirectory.org.uk return 403 to the research tool, so no session could be read first-hand. Leads below. Needs a person (or a run with browser access) |
| 2026-10-27 | Ealing: council family hubs | `2026-10-27-ealing-family-hubs.csv` | 0 | Blocked: the April 2026 centre timetable PDFs on ealing.gov.uk now 404 and the families directory returns 403. Leads below |
| 2026-10-27 | Ealing: language (Gemstones added locally via Google) | `2026-10-27-ealing-language.csv` | 2 | La Chouette bilingual nursery (2026-27 terms and fees on its site; May 2024 post says it will move, no new address); Polish Saturday school at St Gregory's (no lesson times found; 2026/27 enrolment closed in July). Znaniye Russian School Ealing (Sat 10:00-14:00, Ealing Green College, W5 5EW) left out: already live as R033, not re-checked here |
| 2026-10-27 | Ealing: Eventbrite kids, baby and family events | `2026-10-27-ealing-eventbrite.csv` | 2 | Bach to Baby Christmas concerts at Haven Green Baptist (21 Nov; 19 Dec at 10:00 and 11:30). Eventbrite's search pages only load in a full browser, so little came from Eventbrite itself. First cloud run; push failed, batch recreated locally |
| 2026-10-27 | Ealing: churches, sweep 2 | `2026-10-27-ealing-churches-sweep2.csv` | 6 | Haven Green Playtime; St Barnabas Noisy Mass + stay & play; St Peter's Pebbles; Ealing 135 (Northfields weekly stay & play, Greenford 11 Nov, forest school 21 Nov). Checked on A Church Near You 15685–15700: Christ the Saviour, St Barnabas, St John's, St Matthew, St Peter's, St Martin's West Acton, All Saints South Acton, Ascension Hanger Hill, All Hallows Greenford, St Gabriel North Acton, Holy Cross Greenford: no weekday groups listed. Also Ealing Green Church (coffee morning only), Ealing Abbey, Methodists |
| 2026-10-27 | Ealing: churches, church halls and pubs | `2026-10-27-ealing-churches-pubs.csv` | 7 | 5 church toddler groups (incl. Mini Saints, All Saints, added from a parent's tip), Perform drama ×2 at St Paul's hall. Drapers Arms and Little Lounge dropped (evidence from 2025). No other Ealing pub found with kids' activities |

## Leads not checked

Things a person should look at (Facebook-only groups, pages that need a login, unclear venues).

- The Kids' Table at The Drapers Arms (24-25 High Street, W5 5DB): Sundays 12:00–16:00, ages 3–10, free for diners. Only source is Happity, dated Nov 2025. Ask the pub.
- The Little Lounge, Salvation Army West Ealing (8 Leeland Road, W13 9HH): Mon/Wed 10:00–11:30 term time, 0–5. Only source is Eventbrite, April 2025.
- Baby Sensory at St Mary's Ealing (W5 5RH): weekday mornings, listing from 2024. Check under franchises.
- The Drapers Arms pumpkin painting and carving, Sat 31 Oct 2026, 10:00–13:00: a one-off event; the app has no event dates yet.
- No toddler group found online for: Ealing Abbey, Christ the Saviour, St Barnabas Pitshanger, Ealing Green Church, Ealing Christian Centre. Ask local parents.
- Ealing Abbey parish hall (Charbury Grove, W5 2DY): Happity shows a Thursday group, 3 months–10 years, details missing. No parish page found.
- Kingsdown Methodist Church (W13): Splash and Dash Pre-School Playgroup (Ofsted listed). Check under nurseries.
- Hartbeeps Baby Beeps at Haven Green Baptist (Tuesdays, Happity 2024). Check under franchises.
- Log Cabin Children's Centre, Northfields Avenue W5: Stay and Play, booking needed (April 2026 timetable). Check under council.
- No weekday toddler group found for St Peter's, St Barnabas or St Matthew's own websites either.
- Eventbrite Ealing search pages (`eventbrite.co.uk/d/united-kingdom--ealing/kids/`) need a real browser; worth a look by a person.
- The Drayton Court, W13: "Bring Your Baby" pub quiz, 13 Nov (search snippet only; a parents' event rather than a kids' one).
- West Ealing library: story time and crafts, 18–19 Nov (search snippet). Check under libraries.
- Other Ealing pubs: none found with regular kids' sessions. Worth asking parents which pubs have kids' corners.
- Znaniye Russian School Ealing is live as R033; needs its details compared with znaniye.com (Sat 10:00-14:00, Ealing Green College W5 5EW, ages 2.5-18). Its old Christ the Saviour site is closed.
- Polish school lesson hours: szkola.org/godziny page did not load; a person could read it.
- Other Russian groups in Ealing: none found beyond Znaniye.
- Ealing libraries (search snippets only, not read first-hand): Bounce and Rhyme and Storytime at Jubilee Gardens Library, Southall, Tuesdays 12:30, ages 0-5, free, drop-in, dates listed to autumn 2026; Ealing Central Library Bounce and Rhyme, Fridays 10:00-11:00, under 5s (dates seen 2025 and May 2026); Acton Town Hall Library storytime and bounce and rhyme, Tuesdays 10:00-10:30, ages 0-5. Nothing found for Northfields, Greenford or Hanwell. Source: libraries.ealing.gov.uk/events
- Ealing children's centres (April 2026 flyers, now removed): Acton Park (Stay and Play 0-5, Sensory and Creative Play 18 months-5, tel on ealing.gov.uk, booking by scan code); Hathaway (Bumps to Babies Thu? 10:00-11:00, day unconfirmed); Log Cabin (Stay and Play, booking only); South Acton and John Perryn also have flyers. Current timetables are via ealingfamiliesdirectory.org.uk
- Why blocked: the sites answered 403 to the tool; I did not try to get around that.
