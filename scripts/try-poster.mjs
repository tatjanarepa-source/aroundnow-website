// Try "Fill in from a photo" on photos on this laptop, without the app: prints what Claude read and what it cost.
// Usage: npm run try-poster -- path/to/poster.jpg [more.jpg …]
// Reads ANTHROPIC_API_KEY from .dev.vars (the file `npx wrangler dev` uses; never uploaded to GitHub).

import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { readPoster, MODEL } from "../worker/poster.js";

try { process.loadEnvFile(".dev.vars"); } catch { /* no .dev.vars */ }
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Put ANTHROPIC_API_KEY=… in .dev.vars first.");
  process.exit(1);
}
const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: npm run try-poster -- path/to/poster.jpg");
  process.exit(1);
}

const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
// Claude Haiku 5.5, per million tokens (up to 100K-token prompts)
const PRICE = { input: 0.10, output: 0.50 };
const today = new Date().toISOString().slice(0, 10);

for (const file of files) {
  const mediaType = TYPES[extname(file).toLowerCase()];
  if (!mediaType) { console.error(`${file}: not a jpg, png, webp or gif`); continue; }
  const started = Date.now();
  const { fields, usage, stop } = await readPoster({ apiKey, imageBase64: readFileSync(file).toString("base64"), mediaType, today });
  const cost = (usage.input_tokens * PRICE.input + usage.output_tokens * PRICE.output) / 1e6;
  console.log(`\n=== ${file} (${MODEL}, ${((Date.now() - started) / 1000).toFixed(1)} s, ` +
    `${usage.input_tokens} in / ${usage.output_tokens} out, about $${cost.toFixed(4)}, stop: ${stop})`);
  console.log(fields ? JSON.stringify(fields, null, 2) : "(nothing read)");
}
