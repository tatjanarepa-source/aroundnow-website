// Check a research batch before it goes on the map.
// Usage: npm run check:batch -- research/batches/2026-10-27-ealing-churches-pubs.csv
//
// - checks required fields and allowed values (the same lists the app filters on)
// - fills Lat/Lng from the postcode (postcodes.io) and saves the file
// - warns about likely duplicates of live listings or of other batch files
// Exits with code 1 if any row has errors, so a scheduled run can stop before importing.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { parseCsv, toCsv, LISTING_COLUMNS } from "./csv.mjs";

const SUPABASE_URL = "https://dftaitxrrbihsmkinezq.supabase.co";
const SUPABASE_KEY = "sb_publishable_bNlpFrdOhFmab51drVpBCQ_PO7564tA"; // public key, same as app.js

const FORMATS = ["Group class", "After-school class", "Workshop / event", "Holiday camp", "Preschool / nursery",
  "Weekend school", "Online course"];
const CATEGORIES = ["Languages", "Sports / Dance", "Performing arts", "Arts / Crafts", "Chess", "STEM / Thinking",
  "Childcare / Preschool", "Outdoor / Nature", "Soft play", "Museums", "Life skills", "Mixed", "Events / Parties"];
const RUNS = ["Term time", "Year-round", "Holidays"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["Morning", "Afternoon", "Evening"];

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run check:batch -- <batch.csv>");
  process.exit(1);
}
const rows = parseCsv(readFileSync(path, "utf8"));
const list = (s) => (s || "").split(",").map((v) => v.trim()).filter(Boolean);
const pc = (s) => (s || "").replace(/\s+/g, "").toUpperCase();
const words = (s) => new Set((s || "").toLowerCase().replace(/[^a-z0-9а-я ]/g, " ").split(/\s+/).filter((w) => w.length > 3));
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

const problems = new Map(); // RecordID -> { errors: [], warnings: [] }
const note = (r, kind, msg) => {
  const p = problems.get(r.RecordID) || { errors: [], warnings: [] };
  p[kind].push(msg);
  problems.set(r.RecordID, p);
};

// 1. Fields and allowed values
const missingCols = LISTING_COLUMNS.filter((c) => !(c in (rows[0] || {})));
if (missingCols.length) {
  console.error(`Missing columns: ${missingCols.join(", ")}`);
  process.exit(1);
}
const seenIds = new Set();
for (const r of rows) {
  if (!r.RecordID) note(r, "errors", "no RecordID");
  if (seenIds.has(r.RecordID)) note(r, "errors", "RecordID used twice in this file");
  seenIds.add(r.RecordID);
  for (const f of ["Title", "ProviderName", "Website", "Format", "Category", "Source"]) {
    if (!r[f].trim()) note(r, "errors", `${f} is empty`);
  }
  if (r.Format && !FORMATS.includes(r.Format)) note(r, "errors", `Format "${r.Format}" not one of: ${FORMATS.join(" | ")}`);
  if (r.Category && !CATEGORIES.includes(r.Category)) note(r, "errors", `Category "${r.Category}" not one of: ${CATEGORIES.join(" | ")}`);
  if (r.RunsWhen && !RUNS.includes(r.RunsWhen)) note(r, "errors", `RunsWhen "${r.RunsWhen}" not one of: ${RUNS.join(" | ")}`);
  for (const d of list(r.DaysOfWeek)) if (!DAYS.includes(d)) note(r, "errors", `day "${d}" should be one of ${DAYS.join(",")}`);
  for (const t of list(r.TimeOfDay)) if (!TIMES.includes(t)) note(r, "errors", `TimeOfDay "${t}" should be one of ${TIMES.join(",")}`);
  for (const f of ["AgeMinMonths", "AgeMaxMonths"]) if (r[f] && !/^\d+$/.test(r[f])) note(r, "errors", `${f} must be whole months`);
  for (const f of ["StartTime", "EndTime"]) if (r[f] && !/^\d\d:\d\d$/.test(r[f])) note(r, "errors", `${f} must look like 09:30`);
  const today = new Date().toISOString().slice(0, 10);
  for (const f of ["EventDate", "EventEndDate"]) if (r[f] && !/^\d{4}-\d\d-\d\d$/.test(r[f])) note(r, "errors", `${f} must look like 2026-10-31`);
  if (!/^\d{4}-\d\d-\d\d$/.test(r.LastChecked || "")) note(r, "errors", "LastChecked must be the date you checked it, like 2026-10-31");
  else if (r.LastChecked > today) note(r, "errors", "LastChecked is in the future");
  if (r.EventEndDate && !r.EventDate) note(r, "errors", "EventEndDate without EventDate");
  if (r.EventEndDate && r.EventEndDate < r.EventDate) note(r, "errors", "EventEndDate is before EventDate");
  if ((r.EventEndDate || r.EventDate) && (r.EventEndDate || r.EventDate) < today) note(r, "errors", "event is already over");
  if (r.Format === "Workshop / event" && !r.EventDate && !list(r.DaysOfWeek).length) note(r, "warnings", "event without a date or days");
  if (r.ContactDetails_PRIVATE) note(r, "errors", "ContactDetails_PRIVATE must stay empty: batch files are public on GitHub");
  if (r.Status !== "Check") note(r, "errors", 'Status must be "Check" (research is never shown as confirmed)');
  if (r.DeliveryMode !== "Online" && !r.Postcode) note(r, "errors", "in-person listing without a postcode");
  if (!r.AgeMinMonths && !r.AgeMaxMonths) note(r, "warnings", "no ages");
  if (!list(r.DaysOfWeek).length && !r.EventDate && r.Format !== "Online course") note(r, "warnings", "no days (won't match Today/Tomorrow/Weekend)");
}

// 2. Map pins from postcodes
const toGeocode = rows.filter((r) => r.Postcode && !(r.Lat && r.Lng));
if (toGeocode.length) {
  const res = await fetch("https://api.postcodes.io/postcodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcodes: toGeocode.map((r) => r.Postcode) }),
  });
  const { result } = await res.json();
  for (const [i, r] of toGeocode.entries()) {
    let hit = result?.[i]?.result;
    // Organisations often still print a postcode that Royal Mail has since retired; it still has a location
    if (!hit) {
      const old = await fetch(`https://api.postcodes.io/terminated_postcodes/${encodeURIComponent(r.Postcode)}`).then((x) => x.json());
      if (old?.result) {
        hit = old.result;
        note(r, "warnings", `postcode ${r.Postcode} was retired in ${old.result.year_terminated}; pin uses its old location`);
      }
    }
    if (!hit) { note(r, "errors", `postcode ${r.Postcode} not found`); continue; }
    r.Postcode = hit.postcode;
    r.Lat = String(hit.latitude);
    r.Lng = String(hit.longitude);
    if (!r.LocationArea) r.LocationArea = hit.admin_ward || hit.admin_district || "";
  }
  writeFileSync(path, toCsv(rows, LISTING_COLUMNS));
}

// 3. Duplicates: live listings, plus every other batch in the same folder
const others = [];
const live = await fetch(`${SUPABASE_URL}/rest/v1/listings?select=id,title,provider_name,postcode,website`, {
  headers: { apikey: SUPABASE_KEY },
});
if (live.ok) {
  for (const l of await live.json()) others.push({ id: l.id, where: "live", title: l.title, provider: l.provider_name, postcode: l.postcode, website: l.website });
} else console.warn(`Could not load live listings (${live.status}); duplicate check covers batch files only.`);
for (const f of readdirSync(dirname(path)).filter((f) => f.endsWith(".csv") && f !== basename(path))) {
  for (const r of parseCsv(readFileSync(join(dirname(path), f), "utf8"))) {
    others.push({ id: r.RecordID, where: f, title: r.Title, provider: r.ProviderName, postcode: r.Postcode, website: r.Website });
  }
}
for (const r of rows) {
  for (const o of others) {
    // A live row with an ID from this file is this batch, already imported (re-importing updates it)
    if (o.where === "live" && seenIds.has(o.id)) continue;
    if (o.id === r.RecordID) { note(r, "errors", `RecordID already used (${o.where})`); continue; }
    const samePlace = pc(o.postcode) && pc(o.postcode) === pc(r.Postcode);
    const sameSite = host(o.website) && host(o.website) === host(r.Website);
    const a = words(`${r.Title} ${r.ProviderName}`), b = words(`${o.title} ${o.provider}`);
    const overlap = [...a].filter((w) => b.has(w)).length;
    if ((samePlace && (sameSite || overlap >= 2)) || (sameSite && overlap >= 3)) {
      note(r, "warnings", `may duplicate ${o.id} "${o.title}" (${o.where})`);
    }
  }
}

// Report
let errors = 0;
for (const r of rows) {
  const p = problems.get(r.RecordID);
  if (!p) continue;
  errors += p.errors.length;
  console.log(`${r.RecordID} ${r.Title}`);
  for (const e of p.errors) console.log(`  ERROR    ${e}`);
  for (const w of p.warnings) console.log(`  warning  ${w}`);
}
const pinned = rows.filter((r) => r.Lat && r.Lng).length;
console.log(`\n${rows.length} rows, ${pinned} with a map pin, ${errors} errors.`);
process.exit(errors ? 1 : 0);
