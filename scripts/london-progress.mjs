// London basic layer (plan agreed 2 Nov 2026): live classes per source group against rough targets.
// Run: npm run progress (needs SUPABASE_SECRET_KEY in .env). Targets are estimates; adjust as we learn.
const url = "https://dftaitxrrbihsmkinezq.supabase.co", sk = process.env.SUPABASE_SECRET_KEY;
const rows = await (await fetch(`${url}/rest/v1/listings?select=id,title,provider_name,category,location_area&status=in.(Active,Check)&provider_type=eq.organisation&limit=20000`, { headers: { apikey: sk, Authorization: `Bearer ${sk}` } })).json();
const FR = /little kickers|water babies|baby sensory|toddler sense|monkey music|hartbeeps|rugbytots|tumble tots|stagecoach|perform\b|kumon|jo jingles|puddle ducks|turtle tots|bach to baby|sing and sign|babyballet|diddi dance|mini mozart|little voices|explore learning|musical bumps|jiggy wrigglers|boogie mites|baby ballet|little dance academy|footy fun|turtle|aquatots|swimming nature|first swim|gliders|mini first aid|hullabaloo|sensory sound|lingotot|tinies|creation station|kidz|razzamataz|pyjama drama|songbirds|tiny talk|little gym|tots/i;
const groups = [
  ["Franchises (class finders)", 1800, (r) => FR.test(`${r.provider_name} ${r.title}`)],
  ["Libraries", 900, (r) => /librar/i.test(`${r.provider_name} ${r.title}`)],
  ["Leisure centres", 600, (r) => /leisure|everyone active|\bbetter\b|gll|lampton|places leisure|fusion lifestyle|pools?\b|lido/i.test(`${r.provider_name} ${r.title}`)],
  ["Children's centres / family hubs", 500, (r) => /children.?s centre|family hub|stay (and|&) play/i.test(`${r.provider_name} ${r.title}`)],
  ["Museums, farms, zoos, attractions", 300, (r) => /museum|zoo|farm|gallery|palace|attraction/i.test(`${r.category} ${r.provider_name} ${r.title}`) || ["Museums", "Outdoor / Nature", "Events / Parties"].includes(r.category)],
];
const used = new Set(); const out = [];
for (const [name, target, test] of groups) { const n = rows.filter((r) => !used.has(r.id) && test(r)); n.forEach((r) => used.add(r.id)); out.push([name, n.length, target]); }
const bar = (p, w = 20) => "█".repeat(Math.round(p * w)) + "░".repeat(w - Math.round(p * w));
let tot = 0, tgt = 0;
for (const [name, n, t] of out) { const c = Math.min(n, t); tot += c; tgt += t; console.log(`${name.padEnd(36)} ${bar(Math.min(1, n / t))} ${String(Math.round(100 * Math.min(1, n / t))).padStart(3)}%  ${n} / ~${t}`); }
console.log(`${"LONDON BASIC LAYER".padEnd(36)} ${bar(tot / tgt)} ${String(Math.round(100 * tot / tgt)).padStart(3)}%  ${tot} / ~${tgt}`);
console.log(`(other live classes, e.g. Ealing deep research: ${rows.length - used.size}; total live ${rows.length})`);
