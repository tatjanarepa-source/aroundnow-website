// Show the latest messages sent with "Something not right? Tell us".
// Usage: npm run feedback [-- 50]   (reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env)

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Fill in SUPABASE_URL and SUPABASE_SECRET_KEY in .env first.");
  process.exit(1);
}
const limit = Number(process.argv[2]) || 20;

const headers = { apikey: SUPABASE_SECRET_KEY };
// Legacy service_role keys are JWTs and also need the Authorization header.
if (SUPABASE_SECRET_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;

const res = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/feedback?select=*&order=created_at.desc&limit=${limit}`, { headers });
if (!res.ok) {
  console.error(`Could not read feedback: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const rows = await res.json();
if (!rows.length) console.log("No feedback yet.");
for (const r of rows.reverse()) {
  console.log(`\n#${r.id} · ${new Date(r.created_at).toLocaleString("en-GB")}${r.contact ? ` · ${r.contact}` : ""}${r.user_id ? " · signed in" : ""}`);
  console.log(r.message);
  if (r.context) console.log(`  search: ${JSON.stringify(r.context)}`);
}
