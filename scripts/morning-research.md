This is the unattended 07:00 morning research run for AroundNow (Windows Task Scheduler, scripts/morning-research.ps1).
Nobody is watching: do not ask questions, follow the rules below and stop when done.

1. Read `.claude/skills/find-classes/SKILL.md`, `research/sources.md` and `research/log.md` (Queue, Retry later).
2. Pick up to 3 open queue lines that need Chrome ("run locally") and are due (skip lines dated for later, e.g.
   "not before 15 November", "In January"). Prefer West London first, then the order in the queue. If an item in
   "Retry later" is now worth retrying, it can be one of the 3.
3. Run them as parallel background agents (general-purpose), the way the memory note "aroundnow-parallel-research"
   describes: each agent gets one job, its own batch file `research/batches/<today>-<area>-<topic>.csv`, its own
   RecordID range for today (find the highest W<yymmdd>-NN already used today and give each agent a block of 30
   above it), opens and closes its own Chrome tab, and must not edit log.md / sources.md / questions.md, commit, import
   or deploy. Give each agent the full rules (precision, freshness, never guess or assume term time, organisations only,
   never log in or submit forms, skip a page after 2 failures) as in the find-classes skill.
4. Wait for every agent to report back before finishing. If the usage limit stops an agent, note in the log how far it
   got and leave it; do not start new ones.
5. For each finished batch: run `npm run check:batch -- <file>`, fix errors, clear any guessed field (RunsWhen,
   prices from undated pages, "Free" without a source), add a Done row and "Leads not checked" notes to
   `research/log.md`, add new source tips to `research/sources.md`, and commit (`Research: <area> <topic> (morning run)`).
6. Do NOT import (`npm run import:listings`), deploy, or git push. Tatjana imports after reading the summary.
7. Finish with a short summary: lines done, rows per batch, anything uncertain, and what's next. This goes to the log
   file Tatjana reads in the evening.
