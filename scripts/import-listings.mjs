// Load data/listings-seed.csv into Supabase.
// Usage: npm run import:listings   (reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env)
// Re-running is safe: rows are matched on RecordID and updated in place.

import { readFileSync } from "node:fs";
import { parseCsv } from "./csv.mjs";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || SUPABASE_SECRET_KEY.includes("paste")) {
  console.error("Fill in SUPABASE_URL and SUPABASE_SECRET_KEY in .env first.");
  process.exit(1);
}

const csvPath = process.argv[2] || "data/listings-seed.csv";
const rows = parseCsv(readFileSync(csvPath, "utf8"));

const list = (s) => (s || "").split(",").map((v) => v.trim()).filter(Boolean);
const text = (s) => (s && s.trim()) || null;
const int = (s) => (s && s.trim() ? Number.parseInt(s, 10) : null);

const listings = rows.map((r) => ({
  id: r.RecordID,
  title: r.Title,
  provider_name: text(r.ProviderName),
  website: text(r.Website),
  contact_method: text(r.ContactMethod),
  delivery_mode: text(r.DeliveryMode),
  location_area: text(r.LocationArea),
  address: text(r.Address),
  postcode: text(r.Postcode),
  location: r.Lat && r.Lng ? `SRID=4326;POINT(${r.Lng} ${r.Lat})` : null,
  address_source: text(r.AddressSource),
  format: text(r.Format),
  category: text(r.Category),
  subjects: list(r.Subjects),
  age_min_months: int(r.AgeMinMonths),
  age_max_months: int(r.AgeMaxMonths),
  languages: list(r.LanguageSupport),
  runs_when: text(r.RunsWhen),
  holiday_club: r.HolidayClub === "Yes" ? true : r.HolidayClub === "No" ? false : null,
  days_of_week: list(r.DaysOfWeek),
  time_of_day: list(r.TimeOfDay),
  start_time: text(r.StartTime),
  end_time: text(r.EndTime),
  schedule_text: text(r.ScheduleText),
  event_date: text(r.EventDate),
  event_end_date: text(r.EventEndDate),
  price_text: text(r.PriceText),
  description: text(r.Description),
  pros: text(r.Pros),
  cons: text(r.Cons),
  status: r.Status || "Check",
  needs_info: text(r.NeedsInfo),
  source: text(r.Source),
}));

const contacts = rows
  .filter((r) => text(r.ContactDetails_PRIVATE))
  .map((r) => ({ listing_id: r.RecordID, contact_details: r.ContactDetails_PRIVATE.trim() }));

// Research batches carry LastChecked: it restarts the 90-day "needs re-checking" clock.
// A class a parent has already confirmed keeps its status, and the newer of the two dates wins.
if (rows.length && rows.every((r) => r.LastChecked)) {
  const existing = await current(listings.map((l) => l.id));
  listings.forEach((l, i) => {
    const was = existing.get(l.id);
    const checked = new Date(`${rows[i].LastChecked}T12:00:00Z`).toISOString();
    l.last_confirmed_at = was?.last_confirmed_at && was.last_confirmed_at > checked ? was.last_confirmed_at : checked;
    if (was && was.status !== "Check") l.status = was.status;
  });
}

await upsert("listings", listings);
await upsert("listing_contacts", contacts);
console.log(`Imported ${listings.length} listings (${listings.filter((l) => l.location).length} with a map pin) and ${contacts.length} private contacts.`);

function authHeaders() {
  const headers = { apikey: SUPABASE_SECRET_KEY };
  // Legacy service_role keys are JWTs and also need the Authorization header.
  if (SUPABASE_SECRET_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;
  return headers;
}

async function current(ids) {
  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/listings?select=id,status,last_confirmed_at&id=in.(${ids.map(encodeURIComponent).join(",")})`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    console.error(`Failed to read current listings: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  return new Map((await res.json()).map((l) => [l.id, l]));
}

async function upsert(table, body) {
  const headers = {
    ...authHeaders(),
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };
  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`Failed to import ${table}: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
}
