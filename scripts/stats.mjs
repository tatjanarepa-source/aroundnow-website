// AroundNow statistics for Tatjana: people using the app, areas searched, classes opened, reports, classes added.
// Usage: npm run stats [-- 30]   (days to look back, default 30; reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env)
// Usage rows come from the app (supabase/migrations/20261102_2_usage_stats.sql): a random number per phone, no
// names, emails or IPs, so "people" means phones/browsers.

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Fill in SUPABASE_URL and SUPABASE_SECRET_KEY in .env first.");
  process.exit(1);
}
const days = Number(process.argv[2]) || 30;
const base = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
const headers = { apikey: SUPABASE_SECRET_KEY, Authorization: `Bearer ${SUPABASE_SECRET_KEY}` };
const since = (d) => new Date(Date.now() - d * 864e5).toISOString();

async function getAll(path) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${base}/${path}`, { headers: { ...headers, Range: `${from}-${from + 999}` } });
    if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}
const pad = (s, n) => String(s).padEnd(n);
const top = (rows, key, n = 10) => {
  const m = new Map();
  for (const r of rows) { const k = key(r); if (k) m.set(k, (m.get(k) || 0) + 1); }
  return [...m].sort((a, b) => b[1] - a[1]).slice(0, n);
};

let usage = [];
try {
  usage = await getAll(`usage_events?select=created_at,device,kind,area,listing_id,ages&created_at=gte.${since(days)}&order=created_at.asc`);
} catch (e) {
  console.log(`(No usage rows yet: ${e.message.includes("usage_events") ? "run supabase/migrations/20261102_2_usage_stats.sql" : e.message})`);
}

const people = (d) => new Set(usage.filter((r) => r.created_at >= since(d)).map((r) => r.device)).size;
const opens = (d) => usage.filter((r) => r.kind === "open" && r.created_at >= since(d)).length;
console.log(`\nAroundNow statistics (last ${days} days, ${new Date().toLocaleString("en-GB")})\n`);
console.log("People (phones/browsers)      today  7 days  " + `${days} days`);
console.log(`  using the app              ${pad(people(1), 7)}${pad(people(7), 8)}${people(days)}`);
console.log(`  app opens                  ${pad(opens(1), 7)}${pad(opens(7), 8)}${opens(days)}`);

const days7 = [...Array(7)].map((_, i) => {
  const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
  const devs = new Set(usage.filter((r) => r.created_at.slice(0, 10) === d).map((r) => r.device));
  return `${d.slice(5)} ${"█".repeat(Math.min(devs.size, 40))} ${devs.size}`;
}).reverse();
console.log("\nPeople per day (last 7 days)");
days7.forEach((l) => console.log("  " + l));

console.log("\nAreas searched (top 10)");
const areas = top(usage.filter((r) => r.kind !== "detail"), (r) => r.area);
areas.length ? areas.forEach(([a, n]) => console.log(`  ${pad(n, 5)} ${a}`)) : console.log("  (none yet)");

console.log("\nAges picked (by searches)");
const ages = top(usage.filter((r) => r.kind !== "detail").flatMap((r) => (r.ages || []).map((a) => ({ a }))), (x) => (x.a === 6 ? "<1" : x.a === 144 ? "12+" : String(x.a / 12)));
ages.length ? console.log("  " + ages.map(([a, n]) => `${a}: ${n}`).join(" · ")) : console.log("  (none yet)");

const opened = top(usage.filter((r) => r.kind === "detail"), (r) => r.listing_id);
let titles = {};
if (opened.length) {
  const ids = opened.map(([id]) => `"${id}"`).join(",");
  for (const l of await getAll(`listings?select=id,title&id=in.(${encodeURIComponent(ids)})`)) titles[l.id] = l.title;
}
console.log("\nClasses opened most (top 10)");
opened.length ? opened.forEach(([id, n]) => console.log(`  ${pad(n, 5)} ${(titles[id] || id).slice(0, 80)}`)) : console.log("  (none yet)");

// Reports, messages and classes added
const reports = await getAll(`listing_reports?select=listing_id,reason,resolved,created_at&created_at=gte.${since(days)}`);
const openReports = (await getAll("listing_reports?select=listing_id&resolved=eq.false")).length;
const feedback = await getAll(`feedback?select=message,created_at&created_at=gte.${since(days)}`);
const changes = feedback.filter((f) => /^Suggested change/.test(f.message || "")).length;
const cities = feedback.filter((f) => /^City request/.test(f.message || "")).map((f) => f.message.replace(/^City request: /, "").split(" – ")[0]);
const added = await getAll(`listings?select=id,title,status,created_at&source=eq.Community&created_at=gte.${since(days)}`);
const live = (await getAll("listings?select=id&status=in.(Active,Check)")).length;
let edits = [];
try { edits = await getAll(`listing_edits?select=id,undone&created_at=gte.${since(days)}`); } catch (e) { /* not set up yet */ }

console.log(`\nReports and messages (last ${days} days)`);
console.log(`  class reports              ${reports.length} (open now: ${openReports})`);
top(reports, (r) => r.reason).forEach(([k, n]) => console.log(`    ${pad(n, 4)} ${k}`));
console.log(`  messages ("Tell us")       ${feedback.length - changes - cities.length}`);
console.log(`  city requests              ${cities.length}${cities.length ? ": " + cities.join(", ") : ""}`);
console.log(`  suggested changes          ${changes}`);
console.log(`\nClasses`);
console.log(`  live on the map            ${live}`);
console.log(`  edited by parents          ${edits.length} (undone: ${edits.filter((e) => e.undone).length}; details: npm run edits)`);
console.log(`  added by parents           ${added.length}${added.length ? ":" : ""}`);
added.slice(-10).forEach((l) => console.log(`    ${l.created_at.slice(0, 10)} ${l.title} (${l.status})`));
console.log("\nDetails of messages and reports: npm run feedback\n");
