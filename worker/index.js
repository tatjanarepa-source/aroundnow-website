// The small server part of AroundNow (Cloudflare Worker). Everything else is the static site in dist/,
// served as it is; only /api/* comes here (wrangler.jsonc → run_worker_first).
//
// POST /api/read-poster  { image: <base64>, type: "image/jpeg" }  with the parent's sign-in token
//   → { fields: {...} } for the "Add a class" form, read from the photo by Claude Haiku 5.5.
// Only signed-in parents, 10 photos a day each and 200 a day in total (supabase/migrations/20261030_poster_reads.sql),
// so a misuse can't run up the bill. The Anthropic key is a Worker secret: npx wrangler secret put ANTHROPIC_API_KEY

import Anthropic from "@anthropic-ai/sdk";
import { readPoster } from "./poster.js";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BASE64 = 5_000_000; // ~3.7 MB photo; the app shrinks photos to well under 1 MB first

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

async function posterRoute(request, env) {
  if (request.method !== "POST") return json(405, { error: "method" });
  const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return json(401, { error: "signin" });

  let body;
  try { body = await request.json(); } catch (e) { return json(400, { error: "bad_request" }); }
  const { image, type } = body || {};
  if (typeof image !== "string" || !IMAGE_TYPES.includes(type)) return json(400, { error: "bad_request" });
  if (image.length > MAX_BASE64) return json(413, { error: "too_big" });

  // Signed in, and under today's limits? The database answers with the parent's own token, so a made-up token fails here
  const gate = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/start_poster_read`, {
    method: "POST",
    headers: { apikey: env.SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  if (gate.status === 401 || gate.status === 403) return json(401, { error: "signin" });
  if (!gate.ok) {
    console.error("start_poster_read failed", gate.status, await gate.text());
    return json(502, { error: "failed" });
  }
  const allowed = await gate.json();
  if (allowed !== "ok") return json(429, { error: allowed }); // "user_limit" or "global_limit"

  try {
    const today = new Date().toISOString().slice(0, 10);
    const { fields, usage, stop } = await readPoster({ apiKey: env.ANTHROPIC_API_KEY, imageBase64: image, mediaType: type, today });
    console.log("read-poster", JSON.stringify({ stop, input: usage.input_tokens, output: usage.output_tokens }));
    if (!fields) return json(422, { error: "unreadable" });
    if (!fields.is_class) return json(422, { error: "not_a_class" });
    return json(200, { fields });
  } catch (e) {
    console.error("read-poster error", e);
    if (e instanceof Anthropic.RateLimitError || e instanceof Anthropic.InternalServerError) return json(503, { error: "busy" });
    return json(502, { error: "failed" });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/read-poster") return posterRoute(request, env);
    if (url.pathname.startsWith("/api/")) return json(404, { error: "not_found" });
    return env.ASSETS.fetch(request);
  },
};
