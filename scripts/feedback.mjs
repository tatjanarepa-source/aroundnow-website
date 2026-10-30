// Show the latest messages from testers and parents ("Tell us" in the app), and reports on single classes.
// Each message with a search attached gets a link that opens the app with exactly that search.
// Usage: npm run feedback [-- 50]   (reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env)

const SITE = "https://aroundnow-website.aroundnow-tatjana.workers.dev/";
const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Fill in SUPABASE_URL and SUPABASE_SECRET_KEY in .env first.");
  process.exit(1);
}
const limit = Number(process.argv[2]) || 20;
const base = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
const headers = { apikey: SUPABASE_SECRET_KEY };
// Legacy service_role keys are JWTs and also need the Authorization header.
if (SUPABASE_SECRET_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;

async function get(path) {
  const res = await fetch(`${base}/${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

const list = (a) => (a && a.length ? a.join(", ") : "");

let rows;
try {
  rows = await get(`feedback?select=*&order=created_at.desc&limit=${limit}`);
} catch (e) {
  console.error(`Could not read feedback: ${e.message}`);
  process.exit(1);
}
if (!rows.length) console.log("No feedback yet.");
for (const r of rows.reverse()) {
  console.log(`\n#${r.id} · ${new Date(r.created_at).toLocaleString("en-GB")}${r.contact ? ` · ${r.contact}` : ""}${r.user_id ? " · signed in" : ""}`);
  console.log(r.message);
  const c = r.context;
  if (!c) { console.log("  (no search attached)"); continue; }
  if (c.listing) {
    const l = c.listing;
    console.log(`  class:    ${l.id ? `${l.title} (${l.id})` : l}${l.activity ? ` · shown as ${l.activity}` : ""}` +
      `${l.subjects && l.subjects.length ? ` · subjects ${list(l.subjects)}` : ""}${l.ages ? ` · ages ${l.ages}` : ""}`);
  }
  if (c.problem) console.log(`  problem:  ${c.problem}`);
  const f = c.filters || {};
  const on = [f.date, list(f.when), list(f.types), list(f.prices), list(f.activities), list(f.langs),
    f.online ? "online on" : "", f.onlyNew ? "only new" : ""].filter(Boolean).join(" · ");
  console.log(`  where:    ${c.area ? c.area.name : "?"}, within ${c.distance}${c.ages && c.ages.length ? ` · ages ${list(c.ages)}` : ""}`);
  console.log(`  filters:  ${on || "none"}`);
  console.log(`  showed:   ${c.shown} classes${c.shownIds ? ` (${c.shownIds.slice(0, 12).join(", ")}${c.shownIds.length > 12 ? ", …" : ""})` : ""}`);
  console.log(`  device:   ${c.screen} · app ${c.app}${c.sent ? ` · their time ${c.sent}` : ""}`);
  if (c.replay) {
    console.log(`  open it:  ${SITE}#replay=${Buffer.from(JSON.stringify(c.replay), "utf8").toString("base64url")}`);
    if (c.replay.date || (c.replay.when || []).length) console.log("            (Today / Tomorrow / weekend follow today's date, not the day it was sent)");
  }
}

// Reports from signed-in parents on the "Know it?" box ("Something's wrong")
try {
  const reports = await get("listing_reports?select=listing_id,reason,note,resolved,created_at&resolved=eq.false&order=created_at.desc&limit=50");
  if (reports.length) {
    const ids = [...new Set(reports.map((r) => r.listing_id))];
    const titles = Object.fromEntries((await get(`listings?select=id,title&id=in.(${ids.map(encodeURIComponent).join(",")})`))
      .map((l) => [l.id, l.title]));
    console.log(`\n--- ${reports.length} open report(s) on classes ---`);
    for (const r of reports.reverse()) {
      console.log(`${new Date(r.created_at).toLocaleString("en-GB")} · ${titles[r.listing_id] || "?"} (${r.listing_id}) · ${r.reason}${r.note ? ` · ${r.note}` : ""}`);
    }
  }
} catch (e) {
  console.warn(`Could not read class reports: ${e.message}`);
}

// Classes parents added that look like one already listed: held back as Pending until you decide.
// In Supabase → listings: status 'Check' if it's a different class, 'Removed' if it's a copy.
try {
  const held = await get("listings?select=id,title,provider_name,postcode,duplicate_of,created_at&status=eq.Pending&duplicate_of=not.is.null&order=created_at");
  if (held.length) {
    const ids = [...new Set(held.map((l) => l.duplicate_of))];
    const twins = Object.fromEntries((await get(`listings?select=id,title,provider_name&id=in.(${ids.map(encodeURIComponent).join(",")})`))
      .map((l) => [l.id, l]));
    console.log(`\n--- ${held.length} new class(es) held back as possible duplicates ---`);
    for (const l of held) {
      const o = twins[l.duplicate_of] || {};
      console.log(`${new Date(l.created_at).toLocaleString("en-GB")} · ${l.title} · ${l.provider_name} · ${l.postcode || "online"} (${l.id})`);
      console.log(`  looks like: ${o.title || "?"} · ${o.provider_name || "?"} (${l.duplicate_of})`);
    }
  }
} catch (e) {
  // Before supabase/migrations/20261030_duplicates.sql has been run there's no duplicate_of column
  if (!/duplicate_of/.test(e.message)) console.warn(`Could not read possible duplicates: ${e.message}`);
}
