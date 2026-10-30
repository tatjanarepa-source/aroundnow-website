// Back up the database: every table, the parents' accounts and the database setup (supabase/*.sql).
// Usage: npm run backup   (reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env)
//
// Supabase's Free plan keeps no backups, so this runs every night (Windows Task Scheduler, see README).
// Each run writes a folder outside the project, so backups (they hold parents' emails) never reach GitHub:
//   C:\Users\<you>\Documents\AroundNow-Backups\2026-10-30\listings.json, …, auth-users.json, supabase\…
// BACKUP_DIR in .env changes where. BACKUP_COPY_DIR (e.g. a Google Drive folder) gets a second copy.
// Keeps the last 14 days plus the first backup of each month.

import { mkdirSync, writeFileSync, readdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// Each table with a unique column to page through it in a fixed order
const TABLES = { listings: "id", listing_contacts: "listing_id", listing_confirmations: "id", listing_reports: "id", feedback: "id" };
const KEEP_DAYS = 14;

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Fill in SUPABASE_URL and SUPABASE_SECRET_KEY in .env first.");
  process.exit(1);
}
const base = SUPABASE_URL.replace(/\/$/, "");
const headers = { apikey: SUPABASE_SECRET_KEY };
// Legacy service_role keys are JWTs and also need the Authorization header.
if (SUPABASE_SECRET_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;

const root = process.env.BACKUP_DIR || join(homedir(), "Documents", "AroundNow-Backups");
const day = new Date().toISOString().slice(0, 10);
const dir = join(root, day);
mkdirSync(dir, { recursive: true });

// A table, 1000 rows at a time (the most the API returns in one go)
async function table(name) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${base}/rest/v1/${name}?select=*&order=${TABLES[name]}`, {
      headers: { ...headers, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`${name}: ${res.status} ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

// Parents' sign-in accounts (id, email, when they signed up); needed to keep "who added / confirmed what"
async function users() {
  const all = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${base}/auth/v1/admin/users?page=${page}&per_page=1000`, { headers });
    if (!res.ok) throw new Error(`auth users: ${res.status} ${await res.text()}`);
    const { users: list } = await res.json();
    all.push(...list);
    if (list.length < 1000) return all;
  }
}

const summary = [];
let failed = false;
for (const name of Object.keys(TABLES)) {
  try {
    const rows = await table(name);
    writeFileSync(join(dir, `${name}.json`), JSON.stringify(rows, null, 1));
    summary.push(`${name} ${rows.length}`);
  } catch (e) {
    failed = true;
    console.error(`FAILED ${e.message}`);
  }
}
try {
  const list = await users();
  writeFileSync(join(dir, "auth-users.json"), JSON.stringify(list, null, 1));
  summary.push(`accounts ${list.length}`);
} catch (e) {
  failed = true;
  console.error(`FAILED ${e.message}`);
}
// The database setup (tables, rules, functions) as it is in the project
cpSync("supabase", join(dir, "supabase"), { recursive: true });
writeFileSync(join(dir, "README.txt"), [
  `AroundNow database backup, ${new Date().toISOString()}`,
  `From ${base}`,
  "",
  "To restore into a fresh Supabase project: run supabase/schema.sql, then supabase/migrations/*.sql oldest first,",
  "re-create the accounts in auth-users.json (same ids), then load each table's .json (listings first).",
  "Contains parents' email addresses: keep it private.",
].join("\n"));
if (!failed) writeFileSync(join(dir, "OK"), summary.join("\n"));

// Keep the last KEEP_DAYS days and the first backup of each month
function prune(folder) {
  if (!existsSync(folder)) return;
  const days = readdirSync(folder).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  const cutoff = new Date(Date.now() - KEEP_DAYS * 864e5).toISOString().slice(0, 10);
  const firstOfMonth = new Set();
  for (const d of days) {
    const month = d.slice(0, 7);
    if (d < cutoff && !firstOfMonth.has(month)) { firstOfMonth.add(month); continue; }
    firstOfMonth.add(month);
    if (d < cutoff) rmSync(join(folder, d), { recursive: true, force: true });
  }
}
prune(root);

const copyRoot = process.env.BACKUP_COPY_DIR;
if (copyRoot) {
  try {
    cpSync(dir, join(copyRoot, day), { recursive: true });
    prune(copyRoot);
    summary.push(`copied to ${copyRoot}`);
  } catch (e) {
    failed = true;
    console.error(`FAILED copying to ${copyRoot}: ${e.message}`);
  }
}

console.log(`${failed ? "Backup INCOMPLETE" : "Backup done"}: ${dir}\n  ${new Date().toLocaleString("en-GB")}: ${summary.join(", ")}`);
process.exit(failed ? 1 : 0);
