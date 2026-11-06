# Privacy note – draft for Tatjana to check (6 Nov 2026)

Checked against the code on 6 Nov (app.js, worker/, supabase/migrations/). Once you approve it, this replaces the
"Your privacy" part of `docs/about-draft.md`. Things in [square brackets] need your answer.

**Correction to the About draft:** it says "we don't store where you are". That isn't quite true. When you use
"Near me", the usage counts store the point rounded to about 1 km (no name, email or IP address). The wording below
says that.

---

## Your privacy

Wigglebi is run by [Tatjana Prohazka / "a parent in Ealing"], [contact email]. We keep as little as we can.

**Without an account**
- You can use Wigglebi without signing in.
- To count how many people use it, the app makes a random device number (no name, email or IP address) and records
  when the app opens, which area you search (for "Near me", only a point rounded to about 1 km), how far, which ages,
  and which classes you open. We delete these counts after a year.
- Your settings (look, distance, language) stay on your phone.

**If you sign in** (to add, edit or confirm a class, or to message a tutor)
- We keep your email address so you can sign in again. We never share it or sell it.
- Classes you add or edit are kept with your account, so a bad edit can be undone.
- Messages to a tutor go through us. The tutor only sees your email if they reply.
- Photos of posters are sent to Claude (Anthropic's AI) to read the details. We don't keep the photo.

**If you send us a message**
- We see your message, and your search and filters only if you tick the box to include them.

**Other services**
- The map comes from OpenFreeMap and OpenStreetMap, and the fonts come from Google Fonts. Your browser loads them
  directly, so those services see your IP address.
- The database is Supabase and the site runs on Cloudflare.
- We don't use ads, advertising trackers or Google Analytics.

**Your rights (UK GDPR):** email [contact email] to see your data or have it deleted, including your account.

---

Notes for Claude:
- [ ] Before going live, decide whether to host the fonts ourselves (then Google Fonts can come off the list)
- [ ] Add a "Delete my account" button, or keep it by email
