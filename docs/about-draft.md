# About page – draft for Tatjana to check (31 Oct 2026)

Wording first; once it's right, Claude builds it into the app as an "About" sheet (link in the menu and at the bottom
of the list), in English and Russian. Things in [square brackets] need your answer.

---

## About AroundNow

**What's on for kids near you, on one map.**

AroundNow started with a simple Saturday-morning question: *what can I do with my little one today, close to home?*
The answers were scattered across Facebook groups, council PDFs, Instagram pages and word of mouth. So we put them
on one map.

You'll find baby and toddler groups, classes, clubs, holiday camps, library rhyme times, soft play, swimming,
museums and family events: filtered by your child's age, how far you want to go, and when.

[Who's behind it, e.g. "AroundNow is made by Tatjana, a mum in Ealing, with help from other local parents." Your name
and photo, or keep it anonymous?]

## How classes get on the map

- **We look them up.** Most listings come from the organiser's own website or the council's, and we note when we last
  checked. We never guess a time or a price: if we couldn't find it, we leave it blank.
- **Parents add them.** Know a class that's missing? Tap **+** and add it in a minute, or take a photo of a poster or
  flyer and we'll fill in the details for you to check.
- **Parents confirm them.** New listings say "Not yet confirmed" until a parent who's been there confirms it.
- **They stay fresh.** Every listing needs a fresh check every few months. If nobody confirms it, it is marked
  "Needs re-checking" and later disappears from the map.

## Spotted something wrong?

Open the class and tap **"Something wrong with this class? Tell us"**. If two parents report the same class, it's
hidden until we've looked at it. For anything else, use **"Tell us"** at the bottom of the list.

Always check the details on the organiser's own website before you go: times and prices can change.

## Only organisations

We list classes and events run by organisations: venues, schools, clubs, charities, councils and businesses. We don't
list private individuals (such as a tutor working from home or a childminder), so nobody's personal details end up
on a map.

## Your privacy

- You can use AroundNow without an account.
- **"Near me"** uses your location only on your phone to sort the list; we don't store where you are.
  [Claude to double-check against the code before this goes live.]
- If you sign in (to add or confirm a class), we keep your email address so you can sign in again. We never share it.
- If you send us a message, we only see your search and filters if you tick the box to include them.
- [Analytics: do we use any? Today: none. Keep this line if that stays true.]

## Support AroundNow

AroundNow is free and has no ads. If it saved you a rainy Saturday, you can
[buy us a coffee](link to come). It helps pay for the map, the database and the time spent keeping listings up to date.

## Contact

[An email address for organisers and parents, e.g. hello@… Do you want one, or only the "Tell us" form?]

---

### Notes for Claude when building it
- Check every privacy claim against app.js, worker/ and Supabase before publishing (location, what feedback stores,
  any third-party requests such as map tiles from OpenStreetMap: mention that the map comes from OpenStreetMap).
- Russian version: translate after Tatjana approves the English.
- Re-check the "Needs re-checking" / disappear timings against the app (90 days / 120 days in the find-classes skill).
