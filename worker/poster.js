// Reads a photo of a poster or flyer and fills in the "Add a class" form, using Claude Haiku 5.5.
// Used by the Worker (worker/index.js) and by scripts/try-poster.mjs for trying it on a local photo.

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

export const MODEL = "claude-haiku-5-5";

// The same choices the form offers (ADD_CATS, ADD_KINDS, ADD_RUNS and days in app.js); "" means not on the poster
const CATEGORIES = ["Languages", "Sports / Dance", "Performing arts", "Arts / Crafts", "STEM / Thinking", "Chess",
  "Outdoor / Nature", "Soft play", "Museums", "Childcare / Preschool", "Mixed"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Poster = z.object({
  is_class: z.boolean().describe("false if the photo isn't about a children's class, club, camp, nursery or event"),
  name: z.string().describe("name of the class or event, as on the poster"),
  org: z.string().describe("who runs it: club, school, company or venue"),
  website: z.string().describe("website, Instagram or Facebook address printed on the poster"),
  kind: z.enum(["weekly", "oneoff", "camp", "nursery", ""])
    .describe("weekly = regular sessions; oneoff = a single dated event; camp = holiday camp; nursery = preschool/nursery"),
  category: z.enum([...CATEGORIES, ""]).describe("Mixed only if nothing else fits"),
  age_min_months: z.number().nullable().describe("youngest age in months (3 years = 36), null if not shown"),
  age_max_months: z.number().nullable().describe("oldest age in months (up to 5 years = 60), null if not shown or no upper age"),
  languages: z.array(z.string()).describe("languages it's taught in, in English, e.g. [\"English\"] or [\"Russian\", \"English\"]"),
  online: z.boolean(),
  venue: z.string().describe("venue name, e.g. St Mary's Church Hall"),
  address: z.string().describe("street address without the postcode"),
  postcode: z.string().describe("full UK postcode, e.g. W5 5JY, only if printed"),
  days: z.array(z.enum(DAYS)),
  runs: z.enum(["term", "year", "hols", ""]).describe("term = term time only; year = all year; hols = school holidays"),
  date: z.string().describe("first or only date as YYYY-MM-DD, for one-off events and camps"),
  date_to: z.string().describe("last date as YYYY-MM-DD, for camps"),
  time_from: z.string().describe("start time as HH:MM, 24-hour"),
  time_to: z.string().describe("end time as HH:MM, 24-hour"),
  price: z.enum(["free", "paid", "unsure"]),
  price_text: z.string().describe("price as written, e.g. £8 a session, max 80 characters"),
  note: z.string().describe("one or two short sentences parents need: booking, what to bring, drop-in. Max 300 characters"),
});

function instructions(today) {
  return `You read photos of posters, flyers and screenshots about children's activities in the UK and fill in a form
that a parent will check before it goes on a map. Today is ${today}.

- Only use what the photo shows. If something isn't there, use "" (or null, [], false, "unsure" for price). A parent
  fills the gaps; a wrong guess is worse than a blank.
- Dates without a year are the next time that date comes after today.
- "Term time" or school-term dates mean runs = term. Weekly classes with no such hint: runs = "".
- Ages: "toddlers" alone is not an age. "18 months to 3 years" = 18 and 36. "Under 5s" = 0 and 59. "5+" = 60 and null.
- Keep the poster's own wording for names. Don't add marketing words.
- If the photo isn't about a children's activity, set is_class to false and leave the rest empty.`;
}

// imageBase64: the photo as base64 (no "data:" prefix); mediaType: image/jpeg, image/png, image/webp or image/gif
export async function readPoster({ apiKey, imageBase64, mediaType, today }) {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 8000,
    // Reading a poster is a simple job: low effort keeps it quick and cheap
    output_config: { effort: "low", format: zodOutputFormat(Poster) },
    system: instructions(today),
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
        { type: "text", text: "Fill in the form from this photo." },
      ],
    }],
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) {
    return { fields: null, usage: response.usage, stop: response.stop_reason };
  }
  return { fields: response.parsed_output, usage: response.usage, stop: response.stop_reason };
}
