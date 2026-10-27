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
- [ ] Ealing: libraries (Northfields, Greenford, Hanwell, Acton rhyme times)
- [ ] Ealing: council family hubs and children's centres
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
| 2026-10-27 | Ealing: language | `2026-10-27-ealing-language.csv` | 2 | La Chouette bilingual nursery (2026-27 terms and fees on its site; May 2024 post says it will move, no new address); Polish Saturday school at St Gregory's (no lesson times found; 2026/27 enrolment closed in July). Znaniye Russian School Ealing (Sat 10:00-14:00, Ealing Green College, W5 5EW) left out: already live as R033, not re-checked here |
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
