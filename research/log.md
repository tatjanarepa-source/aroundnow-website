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
- [x] Ealing: libraries (Northfields, Greenford, Hanwell, Acton rhyme times) **(run locally: council sites block the cloud run)**. Done locally 2026-10-27; repeat every 2–3 months (libraries.ealing.gov.uk/events/category/kids)
- [x] Ealing: council family hubs and children's centres **(run locally: council sites block the cloud run)**. Done locally 2026-10-27 from the October timetables; **monthly re-check** (new PDFs each month at ealingfamiliesdirectory.org.uk/childrens-centre-timetables)
- [ ] Ealing: Eventbrite, browse in Chrome (monthly: Google `site:eventbrite.co.uk Ealing toddler OR baby OR kids OR family`, past 3 months) **(run locally: Eventbrite search needs a real browser)**. Last done 2026-10-27
- [ ] Ealing: franchises (Baby Ballet, Hartbeeps, Toddler Sense, Jo Jingles, Water Babies…) **(run locally: hartbeeps.com returns 403; Water Babies, Jo Jingles and Baby Ballet only show times through a postcode/date-of-birth class finder)**
- [ ] Ealing: gymnastics and swimming (Everyone Active pools done 2026-10-27; still to do: gymnastics clubs, private swim schools) **(run locally: club sites don't resolve or are empty in the cloud run, Happity/YMCA pages 403; needs Google in Chrome)**
- [ ] Chiswick and Ealing: private swim schools (First Swim Chiswick done 2026-10-27; also has a Twickenham pool) **(run locally: firstswim.co.uk 503, Puddle Ducks page 404, Sevenus site not reachable from the cloud run)**
- [ ] Ealing: soft play (Tippitoes, council play centres, Hanwell POP, KIDZ#1, YMCA South Ealing)
- [ ] Ealing: art, music and drama
- [ ] Ealing: ballet and dance
- [ ] Ealing: sport (football, tennis, martial arts) and chess
- [ ] Ealing: parks, forest school, museums
- [ ] West London: riding schools and city farms (toddler pony sessions, lessons, pony days): Stag Lodge, Barnfield, Littlebourne, Deen City Farm
- [ ] Ealing: holiday camps
- [ ] London: Russian-speaking classes and schools (all boroughs)
- [ ] London: French and other language nurseries and Saturday schools
- [ ] Hounslow: children's centres, libraries, play centres (follow "Any council area" in sources.md)
- [ ] Hounslow: leisure centres (Lampton: Heston, Isleworth, Hanworth, Feltham), soft play, churches
- [ ] Hammersmith & Fulham: follow "Any council area" in sources.md
- [ ] Richmond, Hillingdon, Brent, Harrow: follow "Any council area" in sources.md

## Done

| Date | Run | Batch file | Classes | Notes |
|---|---|---|---|---|
| 2026-10-27 | Mandarin nursery, Ealing Broadway (parent's tip, local) | `2026-10-27-ealing-mandarin-nursery.csv` | 2 | A Little Me Time, 58 The Mall W5 3TA (the former family café): Ofsted-registered Mandarin–English nursery for ages 1–5, and the Little Explorers Play Club (Fri 9:15–10:00, £5 per family; booking form only shows May 2026 dates). Finnegan's World: soft play now weekends only, weekday nursery (2–5) "opening soon"; its soft play note updated in the pools/soft play batch |
| 2026-10-27 | Ealing Riding School (parent's tip, local) | `2026-10-27-ealing-riding-school.csv` | 6 | Dotty Club (parents may call it "Dolly club"): pony stay and play Fri and Sat 9:30–11:00, 2–7 years, £10 per family. Also Peek-at-Ponies (free, Thu 13:00, 2–5), Wild Tree House forest school (Thu 10:30, 2–8, £10), yard pony rides (Tue/Thu, 4–6, £35), Start To Ride lessons 5+ (£36 / 30 min; updates live listing E07) and After School Stable Club (6–14, £49). Pages undated but site lists Oct and Dec 2026 events. Postcode W5 3XD from directories |
| 2026-10-27 | First Swim Chiswick (parent's tip "1st swim", local) | `2026-10-27-chiswick-first-swim.csv` | 3 | Baby (6 weeks–2), toddler (2–4) and Kick-Start Kids (4–7) lessons at 500c Chiswick High Road W4 5AG. Winter term from 23 Nov 2026, 8 lessons: babies £192 (Sat £212), kids £210. Times come from the site's class finder (pick level + location, Search); only Level 1 read. No First Time Toddlers L1 in Chiswick this term |
| 2026-10-27 | Ealing: Everyone Active pools and soft play (local) | `2026-10-27-ealing-everyone-active.csv` | 10 | Ealing has 3 council pools, all Everyone Active: Acton Centre, Dormers Wells, Northolt (Gurnell closed for redevelopment). Each: family swim (adult ~£6, junior £2.65), inclusive (SEND) family swim, children's lessons (£41.46/month DD; adult-and-baby from 4 months at Acton and Northolt). Northolt has the only soft play (£5.65, 90-minute sessions daily, inclusive session Thu 11:00). everyoneactive.com centre pages work in Chrome: click LOAD MORE, then each activity card shows days, times and prices |
| 2026-10-27 | Brentford and Chiswick pools, soft play (parent's tip, local) | `2026-10-27-brentford-chiswick-pools-soft-play.csv` | 9 | Lampton Leisure (Hounslow): Brentford Fountain soft play £4.20, family swim £14.75 (wave machine, slide), swim school, recreational gymnastics (20 months+); New Chiswick Pool swim school and inflatable obstacle course £8.15. Pool times are in an embedded widget, not read: days left empty. Snakes & Ladders Syon Park (full hours and prices, Toddler Thursdays music) and Finnegan's World West Ealing (weekends, £9/hour; its postcode W13 9DD was retired in May 2026). New category Soft play. Leads: Tippitoes, council play centres |
| 2026-10-27 | Brentford FC Community Sports Trust (parent's tip, local) | `2026-10-27-ealing-brentford-cst.csv` | 8 | Mini Bees football (Mon, Fri, Sat) and Tumble Bees gymnastics (Mon, Fri toddlers; Big Bees Thu; Hive 1 Thu; Hive 2 Wed) at Gunnersbury Park Sports Hub W3 8LQ, all 2026/27 on Pebble. Their own site still links the 2025 timetable PDF; Pebble's supplier page has the current term. Boogie Bees dance: no current sessions on Pebble. Left out: Mount Carmel school after-school clubs (pupils only), Ealing SEND multi-sports at Greenford Sports Centre (8–16, check day) and adult sessions. Google leads for similar football and gymnastics saved in sources.md |
| 2026-10-27 | Ealing: children's centres (local, Chrome) | `2026-10-27-ealing-family-hubs.csv` | 21 | ealingfamiliesdirectory.org.uk works in a real browser; it links monthly PDF timetables (3 locality PDFs cover all centres: ACE, NAG, SWE). One row per centre with its open sessions (stay and play, music, little explorers, Tiny Sports Stars, baby groups) in ScheduleText, plus rows for sessions at other venues (Acton library, Southall library, North Hanwell Baptist, Copley Close, North Primary School). Left out: NHS clinics, referral-only and booked courses (infant massage, talk and play), Maples (sessions mostly clinics, Friary Park venue address unknown), Hathaway and Log Cabin (no sessions running), Northolt Park (moved to Petts Hill). Prices not stated in the PDFs |
| 2026-10-27 | Ealing: libraries (local, Chrome) | `2026-10-27-ealing-libraries.csv` | 11 | The council events site works in a real browser. Kids category (178 sessions, ~117 load) read on libraries.ealing.gov.uk; addresses from ealing.gov.uk find-your-library. Added: Hanwell storytime; Ealing Central Wed bounce & rhyme, kids chess club, Sat craft (only this week's dates published); Northolt bounce & rhyme, storytime, Sat storytime & craft; Southall and Jubilee Gardens bounce & rhyme; Acton coding club and Saturday craft. Ealing Central Fri bounce & rhyme is already live as E01 (still running, 30 Oct listed). No kids' events listed at Greenford, Northfields or West Ealing. Left out: one-off scavenger hunts and Halloween/Diwali crafts, Hanwell homework club, Acton craft corner and colouring club (irregular weeks) |
| 2026-10-27 | Ealing: Eventbrite in Chrome | (none) | 0 | Eventbrite's own Ealing kids/baby/toddler pages show only ~6 promoted adult events. Google `site:eventbrite.co.uk` found 10 Ealing pages: Bach to Baby (already listed), NHS paediatric OT parent workshops (for parents, not added), candlelit Christmas concert at St John's W13 and Ealing Beaver Project walks (general events, not kids' activities). Eventbrite is thin for Ealing kids; Ticket Tailor, Happity and organisers' own sites matter more |
| 2026-10-27 | Ealing: libraries | `2026-10-27-ealing-libraries.csv` | 0 | Blocked: libraries.ealing.gov.uk, ealing.events.mylibrary.digital and ealingfamiliesdirectory.org.uk return 403 to the research tool, so no session could be read first-hand. Leads below. Needs a person (or a run with browser access) |
| 2026-10-27 | Ealing: council family hubs | `2026-10-27-ealing-family-hubs.csv` | 0 | Blocked: the April 2026 centre timetable PDFs on ealing.gov.uk now 404 and the families directory returns 403. Leads below |
| 2026-10-27 | Ealing: language (Gemstones added locally via Google) | `2026-10-27-ealing-language.csv` | 2 | La Chouette bilingual nursery (2026-27 terms and fees on its site; May 2024 post says it will move, no new address); Polish Saturday school at St Gregory's (no lesson times found; 2026/27 enrolment closed in July). Znaniye Russian School Ealing (Sat 10:00-14:00, Ealing Green College, W5 5EW) left out: already live as R033, not re-checked here |
| 2026-10-27 | Ealing: Eventbrite kids, baby and family events | `2026-10-27-ealing-eventbrite.csv` | 2 | Bach to Baby Christmas concerts at Haven Green Baptist (21 Nov; 19 Dec at 10:00 and 11:30). Eventbrite's search pages only load in a full browser, so little came from Eventbrite itself. First cloud run; push failed, batch recreated locally |
| 2026-10-27 | Ealing: churches, sweep 2 | `2026-10-27-ealing-churches-sweep2.csv` | 6 | Haven Green Playtime; St Barnabas Noisy Mass + stay & play; St Peter's Pebbles; Ealing 135 (Northfields weekly stay & play, Greenford 11 Nov, forest school 21 Nov). Checked on A Church Near You 15685–15700: Christ the Saviour, St Barnabas, St John's, St Matthew, St Peter's, St Martin's West Acton, All Saints South Acton, Ascension Hanger Hill, All Hallows Greenford, St Gabriel North Acton, Holy Cross Greenford: no weekday groups listed. Also Ealing Green Church (coffee morning only), Ealing Abbey, Methodists |
| 2026-10-27 | Ealing: churches, church halls and pubs | `2026-10-27-ealing-churches-pubs.csv` | 7 | 5 church toddler groups (incl. Mini Saints, All Saints, added from a parent's tip), Perform drama ×2 at St Paul's hall. Drapers Arms and Little Lounge dropped (evidence from 2025). No other Ealing pub found with kids' activities |

## Leads not checked

Things a person should look at (Facebook-only groups, pages that need a login, unclear venues).

- Finnegan's World nursery (41 Broadway, West Ealing): weekday nursery for ages 2–5 "opening soon" (2026); add it when it opens.
- Cafés and soft plays turning into nurseries is a pattern: when a soft play page says "nursery", check whether weekday play still runs.

- Brentford FC CST: Boogie Bees dance (2+, Gunnersbury Park) has no current sessions on Pebble; Ealing SEND multi-sports at Greenford Sports Centre UB1 2NP, 18:00-19:00, ages 8-16 (day not read).

- The Kids' Table at The Drapers Arms (24-25 High Street, W5 5DB): Sundays 12:00–16:00, ages 3–10, free for diners. Only source is Happity, dated Nov 2025. Ask the pub.
- The Little Lounge, Salvation Army West Ealing (8 Leeland Road, W13 9HH): Mon/Wed 10:00–11:30 term time, 0–5. Only source is Eventbrite, April 2025.
- Baby Sensory at St Mary's Ealing (W5 5RH): weekday mornings, listing from 2024. Check under franchises.
- The Drapers Arms pumpkin painting and carving, Sat 31 Oct 2026, 10:00–13:00: a one-off event; the app has no event dates yet.
- No toddler group found online for: Ealing Abbey, Christ the Saviour, St Barnabas Pitshanger, Ealing Green Church, Ealing Christian Centre. Ask local parents.
- Ealing Abbey parish hall (Charbury Grove, W5 2DY): Happity shows a Thursday group, 3 months–10 years, details missing. No parish page found.
- Kingsdown Methodist Church (W13): Splash and Dash Pre-School Playgroup (Ofsted listed). Check under nurseries.
- Hartbeeps Baby Beeps at Haven Green Baptist (Tuesdays, Happity 2024). Check under franchises.
- Log Cabin and Hathaway children's centres: "no sessions running" on the October 2026 timetable page.
- Maples Children's Centre (W3 7LL): stay and play at Friary Park community centre (Tue 9:30–11, 0–4, drop in) and story and rhyme (Thu 9:30–10:30, pre-booked). Find the Friary Park venue address.
- No weekday toddler group found for St Peter's, St Barnabas or St Matthew's own websites either.
- Eventbrite Ealing search pages (`eventbrite.co.uk/d/united-kingdom--ealing/kids/`) need a real browser; worth a look by a person.
- The Drayton Court, W13: "Bring Your Baby" pub quiz, 13 Nov (search snippet only; a parents' event rather than a kids' one).
- West Ealing library: story time and crafts, 18–19 Nov (search snippet). Not on the library events site on 2026-10-27; recheck nearer the date.
- Libraries not checked: Perivale, Pitshanger, Northolt Leisure Centre library, Wood End (not in the events site's location list).
- Other Ealing pubs: none found with regular kids' sessions. Worth asking parents which pubs have kids' corners.
- Znaniye Russian School Ealing is live as R033; needs its details compared with znaniye.com (Sat 10:00-14:00, Ealing Green College W5 5EW, ages 2.5-18). Its old Christ the Saviour site is closed.
- Polish school lesson hours: szkola.org/godziny page did not load; a person could read it.
- Other Russian groups in Ealing: none found beyond Znaniye.
- Ealing libraries (search snippets only, not read first-hand): Bounce and Rhyme and Storytime at Jubilee Gardens Library, Southall, Tuesdays 12:30, ages 0-5, free, drop-in, dates listed to autumn 2026; Ealing Central Library Bounce and Rhyme, Fridays 10:00-11:00, under 5s (dates seen 2025 and May 2026); Acton Town Hall Library storytime and bounce and rhyme, Tuesdays 10:00-10:30, ages 0-5. Nothing found for Northfields, Greenford or Hanwell. Source: libraries.ealing.gov.uk/events
- Ealing children's centres (April 2026 flyers, now removed): Acton Park (Stay and Play 0-5, Sensory and Creative Play 18 months-5, tel on ealing.gov.uk, booking by scan code); Hathaway (Bumps to Babies Thu? 10:00-11:00, day unconfirmed); Log Cabin (Stay and Play, booking only); South Acton and John Perryn also have flyers. Current timetables are via ealingfamiliesdirectory.org.uk
- Franchises (2026-10-28, cloud run, nothing confirmed first-hand): Hartbeeps West & South West London (hartbeeps.com/west-south-west-london, 403; Happity says it covers Ealing, no venue or times seen). Water Babies venues in London North West: Castlebar School (Hathaway Gardens, W13 0DH), Mandeville School (UB6), Horsenden Primary, Nuffield Ealing; Happity says 0-5 years, £24.50 a session (not confirmed; times need the class finder at waterbabies.co.uk). Jo Jingles: class finder booking.jojingles.com/discover/ (needs a search). Baby Ballet: no school listed for Ealing, nearest Twickenham/Richmond/Kingston; Lyric Dance baby ballet 2-3 years at Ark Soane Academy W3 and Tiny Tiptoes Ballet at YMCA West London (South Ealing) seen on Happity/NHS only. Toddler Sense: none found in Ealing.
- Gymnastics/swimming (2026-10-28, cloud run, nothing confirmed first-hand): Ealing Gymnastics, St Benedict's School Sports Hall, 54 Eaton Rise W5 2ES (NHS directory only; ealinggymnastics.co.uk does not resolve from the cloud run). Aurora Gymnastics West London (site not reachable). Y Active kids gymnastics, YMCA South Ealing, 25 St Mary's Road W5 5RE: beginner class Wed 17:00-17:45, 5+, term time, £57.50 (Happity listing marked "coming soon", page 403; confirm on ymcawestlondon site). Twisters (twisters.org.uk) page returned no content. Nuffield Health Ealing swim lessons (babies 5 months+, kids 3+) are members only, so not added.
- Private swim schools (2026-10-28, cloud run, search snippets only): Puddle Ducks (Radisson RED Heathrow UB7, Oaklands School Hounslow TW3; private lessons from £35, from search snippet); Sevenus Swimming, Chiswick (baby and toddler 3 months-3 years, seen on Happity); London Baby Swim (NHS directory); a private pool in Whitton, Twickenham (NHS directory); First Swim Twickenham (92 Queens Road TW1 4ET) still not added.
- Why blocked: the sites answered 403 to the tool; I did not try to get around that.
