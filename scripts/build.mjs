// Copy only the public website files into dist/ for deployment, so local-only
// files (.env, data/ with private contacts, scripts/, supabase/) are never published.
import { cpSync, rmSync, mkdirSync } from "node:fs";

const PUBLIC = ["index.html", "app.js", "style.css", "sw.js", "manifest.webmanifest", "icons", "vendor"];

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const path of PUBLIC) cpSync(path, `dist/${path}`, { recursive: true });
console.log(`Built dist/ with: ${PUBLIC.join(", ")}`);
