// Parents' edits to classes (supabase/migrations/20261102_3_edit_listing.sql): what changed, and undo a bad one.
// Usage: npm run edits [-- 30]          the last 30 edits (default 20)
//        npm run edits -- undo <id>     put the class back as it was before edit <id>
// Reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env.

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Fill in SUPABASE_URL and SUPABASE_SECRET_KEY in .env first.");
  process.exit(1);
}
const base = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
const headers = { apikey: SUPABASE_SECRET_KEY, Authorization: `Bearer ${SUPABASE_SECRET_KEY}`, "Content-Type": "application/json" };
async function call(method, path, body) {
  const res = await fetch(`${base}/${path}`, { method, headers: { ...headers, Prefer: "return=representation" }, body: body && JSON.stringify(body) });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  return res.status === 204 ? null : res.json();
}
const show = (v) => (v == null || v === "" ? "—" : Array.isArray(v) ? v.join(", ") : String(v)).slice(0, 120);

if (process.argv[2] === "undo") {
  const id = Number(process.argv[3]);
  const [e] = await call("GET", `listing_edits?id=eq.${id}&select=*`);
  if (!e) { console.error(`No edit ${id}.`); process.exit(1); }
  if (e.undone) { console.log(`Edit ${id} was already undone.`); process.exit(0); }
  await call("PATCH", `listings?id=eq.${encodeURIComponent(e.listing_id)}`, e.before);
  await call("PATCH", `listing_edits?id=eq.${id}`, { undone: true });
  console.log(`Undone: ${e.listing_id} is back as it was before edit ${id} (${Object.keys(e.before).join(", ")}).`);
  process.exit(0);
}

const limit = Number(process.argv[2]) || 20;
let rows;
try {
  rows = await call("GET", `listing_edits?select=*&order=created_at.desc&limit=${limit}`);
} catch (e) {
  console.error(e.message.includes("listing_edits") ? "Run supabase/migrations/20261102_3_edit_listing.sql first." : e.message);
  process.exit(1);
}
if (!rows.length) { console.log("No edits yet."); process.exit(0); }
const ids = [...new Set(rows.map((r) => r.listing_id))].map((x) => `"${x}"`).join(",");
const titles = Object.fromEntries((await call("GET", `listings?select=id,title,status&id=in.(${encodeURIComponent(ids)})`)).map((l) => [l.id, l]));
const users = {};
for (const r of rows) users[r.user_id] = (users[r.user_id] || 0) + 1;

for (const r of rows) {
  const l = titles[r.listing_id] || {};
  console.log(`\n#${r.id} · ${new Date(r.created_at).toLocaleString("en-GB")} · ${l.title || r.listing_id} (${r.listing_id}, now ${l.status || "?"})${r.undone ? " · UNDONE" : ""}`);
  console.log(`  by parent ${r.user_id.slice(0, 8)} (${users[r.user_id]} of these edits)`);
  for (const k of Object.keys(r.after)) {
    if (k === "location") continue;
    console.log(`  ${k}: ${show(r.before[k])}  →  ${show(r.after[k])}`);
  }
}
console.log("\nTo undo one: npm run edits -- undo <number>\n");
