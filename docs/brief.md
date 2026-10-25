# Project Brief: AroundNow — Local Kids & Family Activities Platform

Draft v1. Copied from the claude.ai "AroundNow" project (kids-events-platform-brief.md) on 2026-10-25.

**Updates since the brief (2026-10-25):** launch area is **Ealing, London**. Kids only for now. Big focus: make it easy for anyone to add a listing so everyone else sees it on the map. First data comes from a list collected from other mums.

## 1. Summary

**The problem:** A parent wakes up Saturday morning and wants to know what's happening nearby today — a class, an exhibition, a pop-up, a festival — filtered by their child's age, within a short distance of home. That information is currently scattered across Facebook groups, council websites, word of mouth, and individual tutors' Instagram pages.

**The idea:** A mobile-friendly web platform (not a native app) that aggregates local classes, tutors, nurseries, exhibitions, and family/adult entertainment into a single searchable, filterable, live map. Community-driven content and community-driven moderation, so it can scale without one person policing everything.

**Launch focus (v1):** Kids and family activities — classes, tutors, nurseries, exhibitions, kid-friendly events. The data model and category system are built from day one to extend to adult/general entertainment (open-air cinema, festivals, "boozy" activity bars like axe-throwing, beer festivals, etc.) without a rebuild.

**Monetization:** Not a priority for launch. Longer-term direction is ads or sponsorship (e.g. featured/sponsored listings), not subscriptions — to be revisited once there's usage.

**Name:** AroundNow.

## 2. Core User Story

"I'm a mum with a 2-year-old. It's Saturday morning. I want to see, on a map, what's on today or this week within a mile of me, filtered to things appropriate for a 2-year-old, and know which ones are happening right now."

Secondary user stories:

- A venue or class organiser wants to add a recurring weekly class once, not re-enter it every week.
- A community member spots that a listed class no longer runs and wants to flag it, without needing to "complain" formally.
- (Phase 2) A chess tutor wants to list their sessions without exposing their personal phone/email, and receive enquiries through in-app messaging.

## 3. Content Model

### 3.1 Category types (top-level classification)

This is one of the most important structural decisions, since it drives filtering. Suggested top-level categories:

- **Educational** — classes, tutoring, language schools, workshops
- **Entertainment** — exhibitions, shows, cinema, festivals
- **Physical/Wellness** — sports, yoga, boot camps, dance
- **Childcare** — nurseries, drop-in creche, playgroups
- **Adult/Family social (post-v1)** — activity bars (axe throwing etc.), beer festivals, open-air cinema for grown-ups

Each listing has one primary category and can carry secondary tags (e.g. "Educational" + tags: language, age 2-4, recurring).

### 3.2 Listing types

- **One-off event** (e.g. a single exhibition day, a festival)
- **Recurring class** (e.g. "every Tuesday 10am") — needs a recurrence pattern, not manual weekly re-entry
- **Ongoing/standing listing** (e.g. a nursery with no specific date — always "open")

### 3.3 Listing attributes (draft)

- Title, description, category, sub-tags
- **Age range** (this is the key filter for your use case — needs to be a structured range, not free text, e.g. min/max age in months or years)
- Location (address + lat/long for map)
- Schedule (single date/time, or recurrence rule + duration)
- Cost (free / £ amount / "contact for pricing")
- Organiser (tutor, business, venue, or "community submitted")
- **Link to official page** (organiser's own website/social page), where one exists — encourages users to verify details directly at the source. Optional, not mandatory: listings with no official source (e.g. a church playgroup that only ever existed as a flyer) are still allowed, just clearly labelled "community-submitted, no official source" so users can weigh reliability accordingly
- Contact method — v1 relies on the official link above; no in-app messaging needed while listings are limited to organisations (see 7.5)
- Photos (optional)
- Status: pending review / active / flagged for review / expired / removed

## 4. Discovery & Filtering

- **Live map view** — pins for all listings within the visible area
- **"Happening now" highlight** — anything currently in progress (based on schedule) is visually distinct on the map (e.g. a pulsing pin or different colour)
- **Radius filter** — e.g. "within 1 mile of me"
- **Age filter** — critical filter, tied to the structured age-range field
- **Category / tag filters** — educational, entertainment, recurring vs one-off, free vs paid, etc.
- **Date/time filter** — today, this weekend, this week

## 5. Submission & Approval Workflow

Two submission paths:

- **Prefilled event type** — organiser picks from an existing template (e.g. "language class," "yoga session") and just fills in date/location/age range. Lower friction, faster to go live.
- **Custom listing** — anything that doesn't fit a template. Requires admin confirmation before going live, since it's higher-risk for spam or miscategorisation.

Community-based moderation (to reduce reliance on a single admin):

- Only registered users can review, flag, list, or approve — no unregistered/anonymous path (see Section 7.1).
- A listing needs a threshold of approvals to go live or stay live — e.g. 1–3 confirmations (exact number TBD/testable) from registered users before it's marked "verified," otherwise it sits as "unreviewed" but still visible with a clear label.
- **"No longer valid" flow:** a registered user can submit a lightweight "this doesn't look right anymore" flag rather than a formal complaint. Enough flags moves a listing to flagged for review.

## 6. Reviews & Trust

- Star rating + written review, available to registered users only
- Listings display a verification status (verified / unreviewed / flagged) so users can judge reliability at a glance
- v1: no personal contact details to protect, since only organisations are listed (see 7.5) — users go via the listing's official link. In-app messaging is a phase 2 addition, alongside private tutor listings

## 7. Trust & Safety — Decisions

### 7.1 Registration required — no anonymous contributions

Only registered users can list a class/event or leave feedback. This removes the anonymous-abuse problem at the root rather than managing it with rate limits or CAPTCHA — if you're contributing content, you have an account and a track record attached to it. Simpler to build, and it directly enables the trust-score model in 7.3 (which needs an identity to attach history to).

Browsing, searching, and viewing the map remain fully open to anyone — registration is only required to contribute.

### 7.2 Approval threshold — and keeping this a directory, not a verifier

Flat rule: 1 approval to go live, regardless of category. AroundNow is deliberately just a list with links, not a verification service — especially important for scaling beyond the UK, where local registers (like Ofsted) won't exist or won't be checkable. Rather than trying to verify organisers against official sources, every listing is encouraged to carry a link to an official page (website, social profile, or even a parent venue's page, e.g. the church a playgroup runs out of), and the platform's stance is explicit: this is a directory — please check the linked source for anything important.

That link is a strong recommendation, not a hard requirement — plenty of genuinely good local activities (a church playgroup that's only ever existed as a noticeboard flyer) have no online presence at all, and blocking those would cut out exactly the long-tail content that makes AroundNow useful. Listings with no official link are simply labelled "community-submitted, no official source" so users can weigh them accordingly. This keeps the model simple and consistent everywhere you expand, instead of needing a different verification mechanism per country.

**Needed before launch:** clear Terms of Service stating AroundNow is a discovery/listings platform, not a verifier of provider accuracy, safety, or credentials — users are advised to check the linked official source and do their own due diligence. (Draft this with a solicitor — not something to wing.)

### 7.3 Trust score for registered users

Every registered user can flag/review/confirm/approve — no separate "moderator" application or appointment process — but their input is weighted by a trust score based on:

- Account age
- History of contributions that weren't later reversed or flagged as wrong
- Geographic relevance (a confirmation from someone local to that listing counts more than one from far away)

Higher-trust users' approvals/flags move a listing's status faster; this is what lets moderation scale without a formal moderator hierarchy.

### 7.4 Recurring listings & staleness

Auto-expiry cycle: after a fixed window without any confirmation (e.g. 60–90 days), a recurring listing is auto-flagged "please reconfirm," with a nudge to the organiser. If unconfirmed after a further window, it's auto-hidden (not deleted) pending reconfirmation. Applies to nurseries, Sunday schools, language schools, and similar standing listings.

### 7.5 Tutor verification — scoped down for v1

No identity/safeguarding checks at launch. Instead, v1 only accepts listings from organisations/businesses (nurseries, schools, established clubs) rather than solo private individuals — this sidesteps the identity-verification question almost entirely, since AroundNow is listing entities rather than vetting people. Solo private tutors (e.g. a private chess tutor) are a phase 2 feature, once there's more clarity on what light-touch verification (if any) makes sense — bundled with in-app messaging (7.6 below), since messaging only becomes necessary once there are individuals whose personal contact details need protecting.

### 7.6 In-app messaging — deferred to phase 2

Not needed for v1: organisations already have a public official page/contact route, so there's no personal contact information to shield. Build this alongside the private-tutor feature in phase 2, when there's actually a reason for it — real-time delivery, notifications, and spam-resistance add real scope, not worth taking on before it's needed.

### 7.7 Geographic rollout

London → UK → global. Start hyper-local, prove the model, expand outward in stages.

## 8. Technical Direction

- **Not a native app** — a responsive web platform that works well on mobile browsers (installable as a home-screen web app if useful), so there's no App Store/Play Store dependency or approval process.
- **Needs:** map integration (live pins, radius search), structured data for age ranges and recurrence, user registration/auth, and a trust-score system that weights registered users' contributions (no separate moderator role to manage). In-app messaging is deferred to phase 2 (see 7.6).

### 8.1 Build approach — code-first, not a no-code builder

No-code/low-code tools (Bubble, Webflow, WordPress + directory plugins, etc.) were considered and ruled out. The reasoning: the parts that make AroundNow distinctive — trust-score weighting, recurring listings with auto-expiry, "happening now" live map highlighting, tiered approval — are custom logic that no drag-and-drop builder or plugin provides out of the box. Since Claude is doing the actual writing/building, real code is a better fit than a proprietary visual canvas that Claude can't directly edit — a locked GUI tool would mean typing everything in by hand while being talked through it, slower than writing the code directly.

Where possible, the stack also reuses existing infrastructure and decisions from a previous Claude-built project (a kids' sleep Android app using Firebase and Cloudflare), rather than starting every piece from zero.

Decided stack:

- **Frontend:** React / Next.js — a standard, responsive web app. Works identically on Android, iPhone, and desktop through the browser; no app store, no platform lock-in. Can be set up as a PWA later ("Add to Home Screen") for an app-like feel without leaving the web.
- **Auth:** Firebase Authentication, reused from the existing kids' sleep app project — Google + email sign-in logic is already designed and working. The native Android sign-in code doesn't carry over directly (it's Kotlin/Java), but the same Firebase project and auth design work via Firebase's Web JS SDK for the Next.js frontend — a day of integration work, not a rebuild of the concept. Can share the same Firebase project/user base as the sleep app if useful, or a separate project under the same account.
- **Hosting:** Cloudflare — reused as-is, same infrastructure (CDN, DNS, edge functions) regardless of which app sits behind it.
- **Listings database:** Supabase (Postgres + PostGIS), kept separate from Firebase Auth, specifically for listings data. Reasoning: AroundNow's core feature — "everything within 1 mile, filtered by age range, category, and date, live" — is a compound, multi-dimensional query. Firebase's Firestore can do radius search (via geohashing), but combining radius + age range + category + date/time in a single live query is awkward there. Postgres with PostGIS is purpose-built for exactly this kind of layered geospatial-plus-attribute filtering, so it's worth using even though it means two backend services instead of one. Auth and listings data don't need to live in the same database — Firebase confirms who someone is, Supabase handles what's near them.
- **Who writes it:** Claude (via Claude Code for the ongoing, file-by-file build), working from this brief as the spec.

## 9. Cold Start — Seeding the First Listings

An empty map isn't useful, and nobody submits listings to an empty platform — so the first weeks matter more than any technical decision.

- **Scraping has real limits here.** The most valuable long-tail content (church playgroups, noticeboard flyers, word-of-mouth classes) is, almost by definition, not online anywhere to scrape. Automated scraping will mainly surface what's already well-documented (Eventbrite, council event pages) — a useful baseline, but not the differentiated content that makes AroundNow worth using. Scraping sites like Facebook groups also generally breaches their terms of service — a real practical risk (account bans, legal exposure), not just a technicality.
- **Realistic mix for launch area (London borough):**
  - Official APIs / open data where they exist (council event calendars, Eventbrite API) for a baseline
  - Manual legwork — visiting the same noticeboards, church halls, and playgroups a scraper couldn't reach, and adding them by hand (or via a small group of local parent volunteers)
- Worth treating this as its own workstream with its own plan, not an afterthought once the platform is built.

## 10. Next Steps

- [ ] Draft Terms of Service with a solicitor (disclaiming AroundNow as a discovery platform, not a verifier of listings)
- [ ] Define the trust score formula in more detail (weights for account age, contribution history, geographic relevance)
- [ ] Sketch the data model (categories, listing types, roles, trust score) in more detail
- [ ] Rough wireframe of the map + filter + listing detail screens
- [x] Confirm launch area within London — **Ealing** (2026-10-25)
- [ ] Plan initial listing-seeding approach for launch area (manual legwork + open data sources)
- [ ] Set up Supabase project (listings/PostGIS) + Next.js scaffold, and wire up Firebase Web SDK auth, once ready to start building
