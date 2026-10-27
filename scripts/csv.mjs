// Minimal RFC 4180 CSV parser (quoted fields, embedded commas/newlines, "" escapes).
export function parseCsv(src) {
  src = src.replace(/^﻿/, "");
  const records = [];
  let field = "", record = [], inQuotes = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { record.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      record.push(field); field = "";
      if (record.some((v) => v !== "")) records.push(record);
      record = [];
    } else field += c;
  }
  if (field || record.length) { record.push(field); records.push(record); }
  const [header, ...data] = records;
  return data.map((vals) => Object.fromEntries(header.map((h, i) => [h, vals[i] ?? ""])));
}

export function toCsv(rows, header) {
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [header, ...rows.map((r) => header.map((h) => r[h]))].map((r) => r.map(q).join(",")).join("\n") + "\n";
}

// Column order of data/listings-seed.csv; research batches use the same columns.
export const LISTING_COLUMNS = ["RecordID", "Title", "ProviderName", "Website", "ContactMethod", "ContactDetails_PRIVATE",
  "DeliveryMode", "LocationArea", "Postcode", "Address", "Format", "Category", "Subjects", "AgeMinMonths", "AgeMaxMonths",
  "LanguageSupport", "RunsWhen", "HolidayClub", "DaysOfWeek", "TimeOfDay", "StartTime", "EndTime", "ScheduleText",
  "PriceText", "Description", "Pros", "Cons", "Status", "NeedsInfo", "AddressSource", "Lat", "Lng", "Source"];
