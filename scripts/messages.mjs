// Messages parents sent to private tutors ("Message the tutor" in the app), with the tutor's private contact, so
// they can be passed on. Forward each one to the tutor (the parent's email is the reply address), then mark it sent.
// Usage: npm run messages             (messages not passed on yet)
//        npm run messages -- all      (the last 50, sent or not)
//        npm run messages -- sent 12  (mark message #12 as passed on)
// Reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env.

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Fill in SUPABASE_URL and SUPABASE_SECRET_KEY in .env first.");
  process.exit(1);
}
const base = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
const headers = { apikey: SUPABASE_SECRET_KEY, "Content-Type": "application/json" };
if (SUPABASE_SECRET_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;

async function call(path, opts = {}) {
  const res = await fetch(`${base}/${path}`, { headers, ...opts });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

const [cmd, arg] = process.argv.slice(2);
try {
  if (cmd === "sent") {
    const id = Number(arg);
    if (!id) throw new Error("Say which one: npm run messages -- sent <number>");
    const rows = await call(`contact_messages?id=eq.${id}`, {
      method: "PATCH", headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({ sent_at: new Date().toISOString() }),
    });
    console.log(rows.length ? `#${id} marked as passed on.` : `No message #${id}.`);
    process.exit(0);
  }
  const filter = cmd === "all" ? "" : "&sent_at=is.null";
  const rows = await call(`contact_messages?select=*,listings(title)&order=created_at.asc&limit=50${filter}`);
  if (!rows.length) {
    console.log(cmd === "all" ? "No messages yet." : "No messages waiting.");
    process.exit(0);
  }
  const ids = [...new Set(rows.map((r) => r.listing_id))];
  const contacts = await call(`listing_contacts?select=listing_id,contact_details&listing_id=in.(${ids.map(encodeURIComponent).join(",")})`);
  const contactOf = Object.fromEntries(contacts.map((c) => [c.listing_id, c.contact_details]));
  for (const r of rows) {
    console.log(`\n#${r.id} · ${new Date(r.created_at).toLocaleString("en-GB")}${r.sent_at ? " · passed on" : ""}`);
    console.log(`  to:       ${(r.listings && r.listings.title) || r.listing_id} (${r.listing_id})`);
    console.log(`  tutor:    ${contactOf[r.listing_id] || "!! no private contact on file: find one before passing it on"}`);
    console.log(`  reply to: ${r.reply_email}`);
    console.log(`  message:  ${r.message.replace(/\n/g, "\n            ")}`);
  }
  if (cmd !== "all") console.log("\nWhen you've forwarded one: npm run messages -- sent <number>");
} catch (e) {
  console.error(/contact_messages/.test(e.message) && /does not exist|42P01/.test(e.message)
    ? "Run supabase/migrations/20261104_message_tutor.sql in Supabase first."
    : `Could not read messages: ${e.message}`);
  process.exit(1);
}
