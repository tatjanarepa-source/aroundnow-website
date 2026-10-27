---
name: find-classes
description: Research kids' classes on the web for AroundNow, one area × one source type per run, and save them as a checked batch file. Use when the user says "find classes", "find more classes", "research classes", "scrape classes", or a scheduled research run starts.
---

# Find classes

One run = one line of the queue, up to ~10 classes, saved as you go.

## 1. Pick the job
- If the user named an area and source type (e.g. "find classes: Ealing, gymnastics"), do that.
- Otherwise take the **first unticked line** in `research/log.md`.
- Read `research/sources.md` for the rules and known leads. Follow the rules exactly.

## 2. Start the batch file first
Create `research/batches/YYYY-MM-DD-<area>-<topic>.csv` (lowercase, hyphens) with the header row
from `LISTING_COLUMNS` in `scripts/csv.mjs`. **Add each class to it as soon as it's verified.**
Don't wait until the end; a run can be cut off at any time.

RecordID: `W` + `YYMMDD` + `-` + two digits, e.g. `W261027-01`.

## 3. Research
- Start with known leads for the area. Read "How to search" in `sources.md`: in a local session, use
  Google in Chrome; it finds far more than the built-in search.
- For **venues** (churches, libraries, community centres, leisure centres): first list every venue in
  the area, then open each one's events or what's-on page. Keyword searches miss groups with their own
  names. For **providers** (franchises, activities): search, then confirm on their site.
- Confirm every class on the provider's own site (or the council's). Quote, don't guess.
- Apply the **freshness rule** in `sources.md`: if the newest evidence is over 12 months old, don't add
  the row; list it under "Leads not checked" with the date you found.
- Fill the columns like this:
  - `Format`: Group class | After-school class | Workshop / event | Holiday camp | Preschool / nursery | Weekend school | Online course
  - `Category`: Languages | Sports / Dance | Performing arts | Arts / Crafts | Chess | STEM / Thinking | Childcare / Preschool | Outdoor / Nature | Life skills | Mixed | Events / Parties
  - `RunsWhen`: Term time | Year-round | Holidays. `HolidayClub`: Yes | No
  - `DaysOfWeek`: `Mon, Sat`. `TimeOfDay`: Morning | Afternoon | Evening. `StartTime`/`EndTime`: `09:30`
  - One-off events and dated camps: `EventDate` / `EventEndDate` as `2026-10-31` (only upcoming ones).
    Leave `DaysOfWeek` empty for a one-off event
  - Ages in **months** (3 years = 36). `LanguageSupport`: e.g. `English` or `Russian, English`
  - `Status`: always `Check`. `ContactMethod`: Website / Email / Phone. Leave `ContactDetails_PRIVATE` empty
  - `NeedsInfo`: what's missing or uncertain, and how current the timetable looks
  - `AddressSource`: the site the address came from. `Source`: `Web research YYYY-MM-DD`
  - `LastChecked`: the date you confirmed it (today). Importing it restarts the 90-day clock
  - Leave `Lat`/`Lng` empty; the check script fills them.
- One row per venue and class. If a provider runs the same class at 3 venues, that's 3 rows.

## Re-check run ("re-check classes")
Classes show "Needs re-checking" 90 days after their last check and disappear at 120 days unless a
parent confirms them. A re-check run keeps good ones alive:
1. List the live listings checked longest ago: `GET /rest/v1/listings?select=id,title,website,last_confirmed_at,created_at&order=last_confirmed_at.asc.nullsfirst&limit=15`
   (publishable key from `scripts/check-batch.mjs`). Skip anything checked in the last 60 days.
2. Copy each one's row from its batch file (or `data/listings-seed.csv`) into
   `research/batches/YYYY-MM-DD-recheck.csv`, open its website and update times, prices and `NeedsInfo`.
3. Still running → `LastChecked` = today. Gone or no fresh evidence → leave it out and note it in the log
   (it will expire by itself; tell the user if it should be removed sooner).
4. Check, log and finish as below. Importing keeps parents' confirmations.

## 4. Check
Run `npm run check:batch -- research/batches/<file>.csv`. Fix every ERROR. For "may duplicate"
warnings, look at both; drop the row if it's the same class, or say why it isn't.

## 5. Log
In `research/log.md`: tick the queue line, add a row to "Done" (date, run, file, number of classes,
notes), and put anything you couldn't check under "Leads not checked". If you learned a new kind of
source, add it to `research/sources.md`.

## 6. Finish
- Commit the batch file and the log (`Research: <area> <topic>`). Don't deploy.
- **Importing to the live site** needs the secret key in `.env`, so it's only done locally and only
  when the user asks: `npm run import:listings -- research/batches/<file>.csv`.
- Tell the user in plain words: how many classes, which ones, what's uncertain, and the next line in the queue.
