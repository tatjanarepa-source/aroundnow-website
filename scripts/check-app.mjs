// Checks run before every deploy (npm run deploy runs this first and stops if anything fails).
// Usage: npm run check
//
// It catches the mistakes that have bitten us: a syntax error in the app, a file the page needs
// but the build leaves out, the app asking the database for a column or activity it doesn't have yet
// (deploying before running a migration), and forgetting to bump the version that makes phones
// pick up the new app.
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const ok = (msg) => console.log(`  ok  ${msg}`);
const fail = (msg) => { problems.push(msg); console.log(`  FAIL ${msg}`); };

// 1. The scripts parse
for (const f of ["app.js", "sw.js", "worker/index.js", "worker/poster.js"]) {
  const r = spawnSync(process.execPath, ["--check", f], { encoding: "utf8" });
  r.status === 0 ? ok(`${f} has no syntax errors`) : fail(`${f} has a syntax error:\n${r.stderr}`);
}

const app = readFileSync("app.js", "utf8");
const sw = readFileSync("sw.js", "utf8");
const html = readFileSync("index.html", "utf8");

// 2. Every local file the page or the offline cache needs exists (and is inside a published folder)
const PUBLIC = ["index.html", "app.js", "style.css", "sw.js", "manifest.webmanifest", "icons", "vendor"];
const local = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map((m) => m[1])
  .concat([...sw.matchAll(/"\.\/([^"]+)"/g)].map((m) => m[1]).filter(Boolean));
for (const f of new Set(local)) {
  const published = PUBLIC.some((p) => f === p || f.startsWith(`${p}/`));
  if (!existsSync(f)) fail(`${f} is used by the page but doesn't exist`);
  else if (!published) fail(`${f} is used by the page but the build doesn't publish it (scripts/build.mjs)`);
}
ok(`${new Set(local).size} files the page needs are present`);

// 3. The version shown in feedback matches the cache name, so phones and feedback agree
const appVersion = (app.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
const cacheName = (sw.match(/const CACHE_NAME = "([^"]+)"/) || [])[1];
if (appVersion && cacheName && cacheName.endsWith(`-${appVersion}`)) ok(`version ${appVersion} matches sw.js`);
else fail(`APP_VERSION (${appVersion}) in app.js and CACHE_NAME (${cacheName}) in sw.js should end the same; bump both together`);

// 4. The live database answers the exact question the app asks
const url = (app.match(/const SUPABASE_URL = "([^"]+)"/) || [])[1];
const key = (app.match(/const SUPABASE_KEY = "([^"]+)"/) || [])[1];
const home = app.match(/const DEFAULT_PLACE = \{ lat: ([\d.-]+), lng: ([\d.-]+)/);
if (!url || !key || !home) {
  fail("couldn't find SUPABASE_URL, SUPABASE_KEY or DEFAULT_PLACE in app.js");
} else {
  try {
    const res = await fetch(`${url}/rest/v1/rpc/listings_near`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ p_lat: Number(home[1]), p_lng: Number(home[2]) }),
    });
    if (!res.ok) {
      fail(`the database refused the app's listings query (${res.status}): ${(await res.text()).slice(0, 300)}\n` +
        "       Usually a migration in supabase/migrations hasn't been run yet.");
    } else {
      const rows = await res.json();
      rows.length ? ok(`database returns ${rows.length} listings for the app's query`) : fail("the database returned no listings");
      // 5. Every activity in the data has a name and colour in the app
      const known = new Set(JSON.parse(`[${(app.match(/const CATEGORIES = \[([\s\S]*?)\];/) || [])[1] || ""}]`));
      const unknown = [...new Set(rows.map((r) => r.category))].filter((c) => c && !known.has(c));
      unknown.length ? fail(`activities in the data that the app doesn't know: ${unknown.join(", ")}`) : ok("every activity in the data is known to the app");
    }
    // 6. The whole listings table can't be downloaded with the public key (supabase/migrations/20261028_2_lock_listings.sql)
    const open = await fetch(`${url}/rest/v1/listings?select=id&limit=1`, { headers: { apikey: key } });
    if (open.ok && (await open.json()).length) {
      console.log("  note the listings table is still open to the public: run 20261028_2_lock_listings.sql after deploying");
    } else ok("the listings table can't be downloaded with the public key");
  } catch (e) {
    fail(`couldn't reach the database: ${e.message}`);
  }
}

if (problems.length) {
  console.log(`\n${problems.length} problem(s). Not deploying.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
