// Listings live in Supabase (see supabase/schema.sql). The publishable key is
// meant to be public: the database only allows reading visible listings.
const SUPABASE_URL = "https://dftaitxrrbihsmkinezq.supabase.co";
const SUPABASE_KEY = "sb_publishable_bNlpFrdOhFmab51drVpBCQ_PO7564tA";

// Launch area: Ealing Broadway
const DEFAULT_PLACE = { lat: 51.5149, lng: -0.3017, name: "Ealing Broadway", kind: "default" };
const QUICK_AREAS = [
  { name: "Ealing Broadway", lat: 51.5149, lng: -0.3017 },
  { name: "Acton", lat: 51.5081, lng: -0.2730 },
  { name: "Hanwell", lat: 51.5099, lng: -0.3367 },
  { name: "Chiswick", lat: 51.4924, lng: -0.2628 },
  { name: "Notting Hill", lat: 51.5136, lng: -0.2006 },
];

const RADII = [1, 3, 5, 10];
const AGES = [6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144]; // months; 6 = "under 1", 144 = "12+"
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const onWeekday = (l) => l.d.some((d) => WEEKDAYS.includes(d));

// "When" and "Type" in parents' words, mapped onto the stored schedule fields
const WHEN = {
  weekends: (l) => l.d.includes("Sat") || l.d.includes("Sun"),
  afterschool: (l) => onWeekday(l) && (l.tm.includes("Afternoon") || l.tm.includes("Evening")),
  mornings: (l) => onWeekday(l) && l.tm.includes("Morning"),
  holidays: (l) => l.f === "Holiday camp" || l.r === "Holidays" || l.r === "Both" || l.h === 1,
};
const TYPES = {
  weekendschool: (l) => l.f === "Weekend school",
  weekly: (l) => l.f === "Group class" || l.f === "After-school class",
  camps: (l) => l.f === "Holiday camp",
  nursery: (l) => l.f === "Preschool / nursery",
  events: (l) => l.f === "Workshop / event",
  online: (l) => l.on === 1,
};
// Ealing school holidays (council dates; academies can differ by a day or two).
// Half terms are Mon–Fri only: weekend schools usually still meet on the weekends around them.
// Outside TERM_KNOWN we don't guess, so term-time classes aren't hidden.
const TERM_KNOWN = { from: "2026-09-03", to: "2027-07-21" };
const SCHOOL_HOLIDAYS = [
  { from: "2026-10-26", to: "2026-10-30", k: "half" },
  { from: "2026-12-19", to: "2027-01-03", k: "xmas" },
  { from: "2027-02-15", to: "2027-02-19", k: "half" },
  { from: "2027-03-26", to: "2027-04-11", k: "easter" },
  { from: "2027-05-31", to: "2027-06-04", k: "half" },
];
const DATES = ["today", "tomorrow", "weekend"];

const CATEGORIES = ["Languages", "Sports / Dance", "Performing arts", "Arts / Crafts", "Chess", "STEM / Thinking",
  "Childcare / Preschool", "Outdoor / Nature", "Life skills", "Mixed", "Events / Parties"];
// One colour per activity, for the map pins and the dot on each card
const CAT_COLORS = {
  "Languages": "#7cc7ff", "Sports / Dance": "#6ee7a8", "Performing arts": "#c9a2ff", "Arts / Crafts": "#ff9bc9",
  "Chess": "#a5b4fc", "STEM / Thinking": "#67e8f9", "Childcare / Preschool": "#ffe27a", "Outdoor / Nature": "#5eead4",
  "Life skills": "#fca5a5", "Mixed": "#ffb86b", "Events / Parties": "#ff9bc9",
};
const catColor = (c) => CAT_COLORS[c] || "#a3adc2";

const STRINGS = {
  en: {
    age: "Age", under1: "Under 1", ageGroup: "Child’s age. Two kids? Tap both ages",
    filters: "Filters", quick: "Quick filters", language: "Language", activity: "Activity", type: "Type", distance: "Distance",
    includeOnline: "Include online classes", uiSwitch: "App language: English. Tap for Russian",
    where: "Where to look", nearMe: "Near me", useMyLocation: "Use my location", locating: "Finding your location…",
    blocked: "Location is blocked. Allow it in your browser settings, or search an area.",
    locFail: "Couldn’t get your location. Search an area instead.",
    searchArea: "Area, town or postcode", go: "Go", searching: "Looking it up…", notFound: (q) => `Couldn’t find “${q}”.`,
    quickAreas: "Popular areas", reset: "Reset", clearAll: "Clear all", close: "Close",
    nearby: (n) => `${n} nearby`, plusOnline: (n) => ` + ${n} online`, fullList: "Full list", showMap: "Show map",
    within: (r) => `within ${r}`,
    show: (n) => (n ? `Show ${classes(n)}` : "No matches yet"),
    loading: "Loading classes…", loadError: "Could not load classes. Check your connection.",
    checkDetails: "Check details", online: "Online", holidayClub: "Holiday club", suitsBoth: "Suits both", suitsAll: "Suits all",
    dWhen: "When", dPrice: "Price", dWhere: "Where", priceUnknown: "Not listed yet", areaOnly: "exact venue not listed yet",
    parents: "What parents say", good: "Good", watch: "Watch out",
    checkNote: "Some details may be out of date. Check the official page before you go.",
    noSource: "Community-submitted, no official source", website: "Official website", directions: "Directions",
    lighter: "Faded pins: area only, no exact address", nothing: "Nothing matches these filters.", agesNA: "Ages not listed",
    tryWeekend: "Try this weekend", onlineToo: (n) => `${classes(n)} online too`, showWord: "Show", hideWord: "Hide",
    widenText: (n, r) => (n ? `Only ${classes(n)} within ${r} km.` : `Nothing within ${r} km yet.`),
    widenCta: (r, extra) => `Show within ${r} km (+${extra})`,
    and: " & ",
    date: { today: "Today", tomorrow: "Tomorrow", weekend: "This weekend" },
    hol: { half: "half term", xmas: "the Christmas holidays", easter: "the Easter holidays" },
    holNote: (h, range) => `Ealing schools are off for ${h} (${range}). Term-time classes are hidden; holiday clubs are shown.`,
    noDays: (n) => `${n === 1 ? "1 more class nearby doesn’t" : `${n} more classes nearby don’t`} list their days. Check their websites.`,
    w: { weekends: "Weekends", afterschool: "After school", mornings: "Weekday mornings", holidays: "School holidays" },
    ty: { weekendschool: "Weekend schools", weekly: "Weekly classes", camps: "Holiday camps", nursery: "Nursery", events: "Events", online: "Online" },
    cat: { "Languages": "Languages", "Sports / Dance": "Sport & dance", "Performing arts": "Music & theatre", "Arts / Crafts": "Arts & crafts",
      "Chess": "Chess", "STEM / Thinking": "Science & thinking", "Childcare / Preschool": "Nursery", "Outdoor / Nature": "Outdoors",
      "Life skills": "Life skills", "Mixed": "Clubs", "Events / Parties": "Events & parties" },
    lang: { Russian: "Russian", English: "English" },
    day: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
  },
  ru: {
    age: "Возраст", under1: "До 1", ageGroup: "Возраст ребёнка. Двое детей? Выберите оба",
    filters: "Фильтры", quick: "Быстрые фильтры", language: "Язык", activity: "Направление", type: "Тип", distance: "Расстояние",
    includeOnline: "Показывать онлайн-занятия", uiSwitch: "Язык приложения: русский. Нажмите для английского",
    where: "Где искать", nearMe: "Рядом со мной", useMyLocation: "Определить моё местоположение", locating: "Определяем местоположение…",
    blocked: "Доступ к геолокации запрещён. Разрешите его в настройках браузера или найдите район.",
    locFail: "Не удалось определить местоположение. Найдите район.",
    searchArea: "Район, город или индекс", go: "Найти", searching: "Ищем…", notFound: (q) => `Не нашли «${q}».`,
    quickAreas: "Популярные районы", reset: "Сбросить", clearAll: "Сбросить всё", close: "Закрыть",
    nearby: (n) => `${n} рядом`, plusOnline: (n) => ` + ${n} онлайн`, fullList: "Весь список", showMap: "Показать карту",
    within: (r) => `в радиусе ${r}`,
    show: (n) => (n ? `Показать ${classes(n)}` : "Ничего не найдено"),
    loading: "Загружаем занятия…", loadError: "Не удалось загрузить занятия. Проверьте интернет.",
    checkDetails: "Проверьте детали", online: "Онлайн", holidayClub: "Лагерь на каникулах", suitsBoth: "Подходит обоим", suitsAll: "Подходит всем",
    dWhen: "Когда", dPrice: "Цена", dWhere: "Где", priceUnknown: "Пока не указана", areaOnly: "точный адрес пока не указан",
    parents: "Что говорят родители", good: "Плюсы", watch: "Минусы",
    checkNote: "Часть информации может быть устаревшей. Перед визитом проверьте на официальном сайте.",
    noSource: "Добавлено сообществом, без официального источника", website: "Официальный сайт", directions: "Маршрут",
    lighter: "Бледные метки: только район, без точного адреса", nothing: "По этим фильтрам ничего нет.", agesNA: "Возраст не указан",
    tryWeekend: "Попробовать выходные", onlineToo: (n) => `Ещё онлайн: ${classes(n)}`, showWord: "Показать", hideWord: "Скрыть",
    widenText: (n, r) => (n ? `В радиусе ${r} км — только ${classes(n)}.` : `В радиусе ${r} км пока ничего нет.`),
    widenCta: (r, extra) => `Показать в радиусе ${r} км (+${extra})`,
    and: " и ",
    date: { today: "Сегодня", tomorrow: "Завтра", weekend: "Эти выходные" },
    hol: { half: "короткие каникулы", xmas: "рождественские каникулы", easter: "пасхальные каникулы" },
    holNote: (h, range) => `В школах Илинга ${h} (${range}). Занятия только в учебное время скрыты, каникулярные клубы показаны.`,
    noDays: (n) => `Ещё ${n} ${ruForm(n, "занятие рядом не указывает", "занятия рядом не указывают", "занятий рядом не указывают")} дни. Проверьте на их сайтах.`,
    w: { weekends: "Выходные", afterschool: "После школы", mornings: "Будни, утро", holidays: "Каникулы" },
    ty: { weekendschool: "Школы выходного дня", weekly: "Кружки и секции", camps: "Лагеря", nursery: "Детский сад", events: "Мероприятия", online: "Онлайн" },
    cat: { "Languages": "Языки", "Sports / Dance": "Спорт и танцы", "Performing arts": "Музыка и театр", "Arts / Crafts": "Творчество",
      "Chess": "Шахматы", "STEM / Thinking": "Наука и мышление", "Childcare / Preschool": "Детский сад", "Outdoor / Nature": "На природе",
      "Life skills": "Навыки для жизни", "Mixed": "Кружки", "Events / Parties": "Праздники и события" },
    lang: { Russian: "Русский", English: "Английский" },
    day: { Mon: "Пн", Tue: "Вт", Wed: "Ср", Thu: "Чт", Fri: "Пт", Sat: "Сб", Sun: "Вс" },
  },
};

const ICON = {
  pin: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
  chevron: '<svg class="i" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  sliders: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>',
  close: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  locate: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  external: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
  directions: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>',
  plus: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
  minus: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
  info: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
};

const state = {
  ui: "en", ages: [], radius: 3, langs: [], date: null, when: [], types: [], cats: [],
  showOnline: false, expanded: false, sheet: null, detail: null,
  place: { ...DEFAULT_PLACE }, placeStatus: "", placeWarn: false,
  items: [], loaded: false, error: false,
};

let map, markersLayer;
let fittedFor = ""; // place + distance the map was last framed for

function $(id) { return document.getElementById(id); }
function T() { return STRINGS[state.ui]; }
function isRu() { return state.ui === "ru"; }

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- Remembered choices (per phone; the app works fine without them) ----

const PREFS_KEY = "aroundnow-prefs";
function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    if (p.ui === "en" || p.ui === "ru") state.ui = p.ui;
    if (Array.isArray(p.ages)) state.ages = p.ages.filter((a) => AGES.includes(a));
    if (Array.isArray(p.langs)) state.langs = p.langs.filter((x) => typeof x === "string");
    if (RADII.includes(p.radius)) state.radius = p.radius;
  } catch (e) { /* storage unavailable */ }
}
function savePrefs() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ui: state.ui, ages: state.ages, langs: state.langs, radius: state.radius }));
  } catch (e) { /* storage unavailable */ }
}

// ---- Data ----

// PostgREST returns PostGIS points as hex EWKB: byte order, type (+SRID flag), [SRID], x, y
function parsePoint(loc) {
  if (!loc) return null;
  if (typeof loc === "object" && Array.isArray(loc.coordinates)) return { x: loc.coordinates[0], y: loc.coordinates[1] };
  if (typeof loc !== "string" || loc.length < 42) return null;
  const bytes = new Uint8Array(loc.match(/../g).map((h) => parseInt(h, 16)));
  const view = new DataView(bytes.buffer);
  const le = bytes[0] === 1;
  const offset = view.getUint32(1, le) & 0x20000000 ? 9 : 5;
  return { x: view.getFloat64(offset, le), y: view.getFloat64(offset + 8, le) };
}

function shortPrice(p) {
  if (!p) return "";
  if (/^free\b/i.test(p)) return isRu() ? "Бесплатно" : "Free";
  const m = p.match(/£\s?\d+(?:\.\d+)?(?:\s?[–-]\s?£?\d+)?/);
  if (!m) return "";
  return (/^(approx|about)/i.test(p) ? "~" : "") + m[0].replace(/\s/g, "");
}

function normalize(r) {
  const pt = parsePoint(r.location);
  const online = r.delivery_mode === "Online";
  if (!online && !pt) return null; // nowhere to show it yet
  let langs = r.languages || [];
  if (langs.includes("Bilingual")) {
    langs = [...new Set(langs.filter((x) => x !== "Bilingual").concat(["Russian", "English"]))];
  }
  return {
    i: r.id, t: r.title, a: online ? "Online" : r.location_area || "", y: pt ? pt.y : null, x: pt ? pt.x : null,
    ap: (r.address_source || "").startsWith("Approximate") ? 1 : 0, on: online ? 1 : 0,
    mn: r.age_min_months, mx: r.age_max_months, l: langs, d: r.days_of_week || [], tm: r.time_of_day || [],
    st: (r.start_time || "").slice(0, 5), et: (r.end_time || "").slice(0, 5), f: r.format || "", c: r.category || "", r: r.runs_when || "",
    h: r.holiday_club ? 1 : 0, s: r.schedule_text || "", p: r.price_text || "", ds: r.description || "",
    g: r.pros || "", b: r.cons || "", w: r.website || "", k: r.status === "Check" ? 1 : 0,
    ad: [r.address, r.postcode].filter(Boolean).join(", "),
  };
}

async function loadListings() {
  const cols = ["id", "title", "website", "delivery_mode", "location_area", "address", "postcode", "location", "address_source",
    "format", "category", "age_min_months", "age_max_months", "languages", "runs_when", "holiday_club", "days_of_week",
    "time_of_day", "start_time", "end_time", "schedule_text", "price_text", "description", "pros", "cons", "status"].join(",");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/listings?select=${cols}&status=in.(Active,Check)`, {
      headers: { apikey: SUPABASE_KEY },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    state.items = (await res.json()).map(normalize).filter(Boolean);
    state.error = false;
  } catch (e) {
    console.warn("Load error", e);
    state.error = true;
  }
  state.loaded = true;
  render();
}

// ---- Filtering ----

function distKm(p, l) {
  const kx = 111.32 * Math.cos((p.lat * Math.PI) / 180);
  const dx = (l.x - p.lng) * kx;
  const dy = (l.y - p.lat) * 110.57;
  return Math.sqrt(dx * dx + dy * dy);
}

function fitsAge(l, a) { return (l.mn == null || l.mn <= a) && (l.mx == null || l.mx >= a); }

// ---- Dates ----
// Listings store a weekly pattern (days + term time / holidays), not dates,
// so "today" means: runs on today's weekday, and today is in term if it's term-time only.

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayKey(d) { return DAY_ORDER[(d.getDay() + 6) % 7]; }

function datesFor(key) {
  const now = new Date();
  const at = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + n);
  if (key === "today") return [at(0)];
  if (key === "tomorrow") return [at(1)];
  const dow = now.getDay(); // 0 = Sunday
  if (dow === 6) return [at(0), at(1)];
  if (dow === 0) return [at(0)];
  return [at(6 - dow), at(7 - dow)];
}

function schoolHoliday(d) {
  const iso = isoDate(d);
  return SCHOOL_HOLIDAYS.find((h) => h.from <= iso && iso <= h.to) || null;
}
// "term", "holiday", or null when we don't know the school calendar for that date
function termOn(d) {
  const iso = isoDate(d);
  if (iso < TERM_KNOWN.from || iso > TERM_KNOWN.to) return null;
  return schoolHoliday(d) ? "holiday" : "term";
}

// "regular", "club" (holiday club on a school-holiday weekday), or "" if not on that day
function runsOn(l, d) {
  const day = dayKey(d), term = termOn(d);
  if (regularOn(l, d, day, term)) return "regular";
  if (term === "holiday" && WEEKDAYS.includes(day) && (l.f === "Holiday camp" || l.h)) return "club";
  return "";
}
function regularOn(l, d, day, term) {
  const days = l.d.length ? l.d : (l.f === "Preschool / nursery" || l.f === "Holiday camp" ? WEEKDAYS : []);
  if (!days.includes(day)) return false;
  if (l.r === "Term time" && term === "holiday") return false;
  if ((l.r === "Holidays" || l.f === "Holiday camp") && term === "term") return false;
  // Already finished today
  if (isoDate(d) === isoDate(new Date()) && l.et) {
    const now = new Date();
    if (`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` >= l.et) return false;
  }
  return true;
}
function onDates(l, dates) { return dates.some((d) => runsOn(l, d)); }
function hasDays(l) { return l.d.length > 0 || l.f === "Preschool / nursery" || l.f === "Holiday camp"; }

// `skip` leaves one filter group out, which is how a chip knows whether it would find anything
function passes(l, skip) {
  const s = state;
  if (skip !== "ages" && s.ages.length && !s.ages.some((a) => fitsAge(l, a))) return false;
  if (skip !== "langs" && s.langs.length && !s.langs.some((x) => l.l.includes(x))) return false;
  if (skip !== "date" && s.date && !onDates(l, datesFor(s.date))) return false;
  if (skip !== "when" && s.when.length && !s.when.some((w) => WHEN[w](l))) return false;
  if (skip !== "types" && s.types.length && !s.types.some((t) => TYPES[t](l))) return false;
  if (skip !== "cats" && s.cats.length && !s.cats.includes(l.c)) return false;
  return true;
}

function compute() {
  const rows = state.items.map((l) => ({ l, d: l.on ? null : distKm(state.place, l) }));
  const inPerson = rows.filter((o) => !o.l.on);
  const pool = inPerson.filter((o) => o.d <= state.radius);
  const nearby = pool.filter((o) => passes(o.l)).sort((a, b) => a.d - b.d);
  const onlineAll = rows.filter((o) => o.l.on);
  const online = onlineAll.filter((o) => passes(o.l));
  const showOnline = state.showOnline || state.types.includes("online");
  return { rows, inPerson, pool, nearby, onlineAll, online, showOnline, shown: showOnline ? nearby.concat(online) : nearby };
}

// Would anything nearby show up if this one choice in `group` were picked?
function finds(c, group, test) { return c.pool.some((o) => passes(o.l, group) && test(o.l)); }

// Languages actually offered nearby, most common first
function nearbyLangs(c) {
  const counts = {};
  c.pool.filter((o) => passes(o.l, "langs")).forEach((o) => o.l.l.forEach((x) => { counts[x] = (counts[x] || 0) + 1; }));
  state.langs.forEach((x) => { if (!(x in counts)) counts[x] = 0; });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map((x) => ({ x, n: counts[x] }));
}

// ---- Wording ----

function ruForm(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
function classes(n) {
  return isRu() ? `${n} ${ruForm(n, "занятие", "занятия", "занятий")}` : `${n} ${n === 1 ? "class" : "classes"}`;
}
function km(v) {
  const s = v < 10 ? v.toFixed(1) : String(Math.round(v));
  return isRu() ? `${s.replace(".", ",")} км` : `${s} km`;
}
function rLabel(r) { return isRu() ? `${r} км` : `${r} km`; }
function ageWord(m) { return m === 6 ? T().under1 : m === 144 ? "12+" : String(m / 12); }

function ageText(l) {
  const ru = isRu();
  const f = (m) => {
    if (m === 0) return "0";
    if (m < 12) return ru ? `${m} мес.` : `${m} mo`;
    const y = m / 12;
    if (Number.isInteger(y)) return String(y);
    if (m % 12 === 6) return ru ? `${Math.floor(y)},5` : `${Math.floor(y)}½`;
    return ru ? y.toFixed(1).replace(".", ",") : y.toFixed(1);
  };
  const { mn, mx } = l;
  if (mn == null && mx == null) return T().agesNA;
  // Baby classes read better in months: "0–13 mo"
  if (mx != null && mx < 24 && mx % 12) return ru ? `${mn || 0}–${mx} мес.` : `${mn || 0}–${mx} mo`;
  if (ru) {
    if (mn != null && mx != null) return `${f(mn)}–${f(mx)} ${ruForm(Math.floor(mx / 12), "год", "года", "лет")}`;
    if (mn != null) return `от ${f(mn)}${mn < 12 ? "" : mn === 12 ? " года" : " лет"}`;
    return `до ${f(mx)}${mx === 12 ? " года" : " лет"}`;
  }
  if (mn != null && mx != null) return `Ages ${f(mn)}–${f(mx)}`;
  if (mn != null) return `Ages ${f(mn)}+`;
  return `Up to ${f(mx)}`;
}

function daysText(days) {
  const L = T().day;
  const ds = DAY_ORDER.filter((d) => days.includes(d));
  if (!ds.length) return "";
  const idx = ds.map((d) => DAY_ORDER.indexOf(d));
  const run = idx.every((v, n) => n === 0 || v === idx[n - 1] + 1);
  if (ds.length >= 3 && run) return `${L[ds[0]]}–${L[ds[ds.length - 1]]}`;
  return ds.map((d) => L[d]).join(", ");
}

function whenText(l) {
  const d = daysText(l.d);
  return d && l.st ? `${d} ${l.st}` : d;
}

function langText(l) { return l.l.map((x) => T().lang[x] || x).join(T().and); }

function whereText(l, d) {
  if (l.on) return T().online;
  return `${l.a} · ${l.ap ? "~" : ""}${km(d)}`;
}

function rangeText(h) {
  const f = (iso) => new Date(`${iso}T12:00`).toLocaleDateString(isRu() ? "ru-RU" : "en-GB", { day: "numeric", month: "short" });
  return `${f(h.from)} – ${f(h.to)}`;
}

function placeName() { return state.place.kind === "me" ? T().nearMe : state.place.name; }

// ---- Rendering ----

function pressed(on) { return `aria-pressed="${on ? "true" : "false"}"`; }

// Every filter is the same chip. No counts on chips: one that would find nothing is just dimmed.
function chipHtml(act, v, label, on, zero, aria) {
  const dim = zero && !on && state.loaded ? " zero" : "";
  const name = aria ? ` aria-label="${esc(aria)}"` : "";
  return `<button type="button" class="chip${dim}" data-act="${act}" data-v="${esc(v)}" ${pressed(on)}${name}>${esc(label)}</button>`;
}

function renderTop() {
  const t = T(), btn = $("placeBtn");
  btn.innerHTML = `${ICON.pin}<span class="place-text"><span class="name">${esc(placeName())}</span><span class="km">${t.within(rLabel(state.radius))}</span></span>${ICON.chevron}`;
  btn.setAttribute("aria-label", `${t.where}: ${placeName()}, ${rLabel(state.radius)}`);
  $("uiBtn").textContent = state.ui.toUpperCase();
  $("uiBtn").setAttribute("aria-label", t.uiSwitch);
  document.documentElement.lang = state.ui;
}

function renderFilters(c) {
  const s = state, t = T(), el = $("filters");
  const ages = AGES.map((a) => chipHtml("age", a, a === 6 ? "<1" : ageWord(a), s.ages.includes(a),
    !finds(c, "ages", (l) => fitsAge(l, a)), a === 6 ? t.under1 : "")).join("");
  // Rarely used filters live in the Filters sheet; its badge says how many are on
  const hidden = s.when.length + s.types.length + s.cats.length + (s.showOnline ? 1 : 0);
  const filtersBtn = `<button type="button" class="chip${hidden ? " active" : ""}" data-act="sheet" data-v="filters">${ICON.sliders}<span>${t.filters}</span>${hidden ? `<span class="badge">${hidden}</span>` : ""}</button>`;
  const dates = DATES.map((k) => {
    const ds = datesFor(k);
    return chipHtml("date", k, t.date[k], s.date === k, !finds(c, "date", (l) => onDates(l, ds)));
  }).join("");
  const langs = nearbyLangs(c).map(({ x, n }) => chipHtml("lang", x, t.lang[x] || x, s.langs.includes(x), n === 0)).join("");

  // Keep each row's sideways scroll, so tapping "9" doesn't jump the row back to the start
  const keep = [...el.querySelectorAll(".scroller")].map((r) => r.scrollLeft);
  el.innerHTML = `<div class="scroller" role="group" aria-label="${esc(t.ageGroup)}"><span class="scroller-label">${t.age}</span>${ages}</div>
    <div class="scroller" role="group" aria-label="${esc(t.quick)}">${filtersBtn}${dates}${langs}</div>`;
  el.querySelectorAll(".scroller").forEach((r, n) => { r.scrollLeft = keep[n] || 0; });
}

function renderHead(c) {
  const s = state, t = T();
  const extra = c.showOnline && c.online.length ? t.plusOnline(c.online.length) : "";
  $("countLabel").textContent = s.loaded && !s.error ? t.nearby(c.nearby.length) + extra : "";
}

function renderPanel() {
  $("panel").classList.toggle("expanded", state.expanded);
  $("panelBtn").textContent = state.expanded ? T().showMap : T().fullList;
}

function cardHtml(o, dates, multi) {
  const s = state, t = T(), l = o.l;
  // Matched only through its holiday club: the term-time days would mislead
  const club = dates && !dates.some((d) => runsOn(l, d) === "regular");
  const meta = [club ? "" : whenText(l), langText(l), shortPrice(l.p)].filter(Boolean).join(" · ");
  const tags = [`<span class="agetag">${esc(ageText(l))}</span>`];
  if (multi && (l.mn != null || l.mx != null) && s.ages.every((a) => fitsAge(l, a))) {
    tags.push(`<span class="tag">${s.ages.length === 2 ? t.suitsBoth : t.suitsAll}</span>`);
  }
  if ((club || s.when.includes("holidays")) && l.h && l.f !== "Holiday camp") tags.push(`<span class="tag">${t.holidayClub}</span>`);
  if (l.k) tags.push(`<span class="check">${t.checkDetails}</span>`);
  const where = [t.cat[l.c] || l.c, l.on ? "" : l.a].filter(Boolean).join(" · ");
  const dist = l.on ? t.online : `${l.ap ? "~" : ""}${km(o.d)}`;
  return `<button type="button" class="card" data-act="open" data-v="${esc(l.i)}">
    <span class="card-top"><span class="dot" style="background:${catColor(l.c)}"></span><span class="card-cat">${esc(where)}</span><span class="card-km">${esc(dist)}</span></span>
    <span class="card-title">${esc(l.t)}</span>
    ${meta ? `<span class="card-meta">${esc(meta)}</span>` : ""}
    <span class="tags">${tags.join("")}</span>
  </button>`;
}

function renderList(c) {
  const s = state, t = T(), list = $("list");
  if (!s.loaded) { list.innerHTML = `<div class="loading">${t.loading}</div>`; return; }
  if (s.error) { list.innerHTML = `<div class="loading">${t.loadError}</div>`; return; }

  let html = "";
  const dates = s.date ? datesFor(s.date) : null;
  const hol = dates && dates.map(schoolHoliday).find(Boolean);
  if (hol) html += `<div class="notice">${esc(t.holNote(t.hol[hol.k], rangeText(hol)))}</div>`;

  const w = widenInfo(c);
  if (w) {
    html += `<div class="notice"><span>${esc(w.text)}</span><button type="button" class="primary small" data-act="radius" data-v="${w.r}">${esc(w.cta)}</button></div>`;
  }

  const multi = s.ages.length >= 2;
  html += c.shown.map((o) => cardHtml(o, dates, multi)).join("");

  if (c.online.length && !s.types.includes("online")) {
    html += `<button type="button" class="online-row" data-act="online"><span>${esc(t.onlineToo(c.online.length))}</span><span>${s.showOnline ? t.hideWord : t.showWord}</span></button>`;
  }
  if (s.date) {
    const n = c.pool.filter((o) => passes(o.l, "date") && !hasDays(o.l)).length;
    if (n) html += `<p class="muted-row">${esc(t.noDays(n))}</p>`;
  }
  if (c.nearby.some((o) => o.l.ap)) html += `<p class="muted-row">${t.lighter}</p>`;
  if (!c.shown.length && !w) {
    const weekend = s.date && s.date !== "weekend"
      ? `<button type="button" class="chip" data-act="date" data-v="weekend">${t.tryWeekend}</button>` : "";
    html += `<div class="empty"><span>${t.nothing}</span><div class="wrap">${weekend}<button type="button" class="chip" data-act="clear">${t.clearAll}</button></div></div>`;
  }
  list.innerHTML = html;
}

function widenInfo(c) {
  const n = c.nearby.length;
  if (n >= 3) return null;
  const next = RADII.filter((r) => r > state.radius)
    .map((r) => ({ r, n: c.inPerson.filter((o) => o.d <= r && passes(o.l)).length }))
    .find((x) => x.n > n);
  if (!next) return null;
  return { r: next.r, text: T().widenText(n, state.radius), cta: T().widenCta(next.r, next.n - n) };
}

function renderSheet(c) {
  const s = state, t = T(), el = $("sheet");
  if (!s.sheet) { el.hidden = true; el.innerHTML = ""; el.dataset.open = ""; return; }
  // Re-rendering an open sheet keeps its scroll and typed text, and doesn't replay the slide-in
  const again = el.dataset.open === s.sheet;
  const oldBody = el.querySelector(".sheet-body");
  const scrollTop = again && oldBody ? oldBody.scrollTop : 0;
  const typed = again && $("areaInput") ? $("areaInput").value : "";
  let title, body, foot;
  const show = `<button type="button" class="primary" data-act="closeSheet">${esc(t.show(c.shown.length))}</button>`;

  if (s.sheet === "place") {
    title = t.where;
    const status = s.placeStatus ? `<p class="status${s.placeWarn ? " warn" : ""}">${esc(s.placeStatus)}</p>` : "";
    const areas = QUICK_AREAS.map((a, n) =>
      chipHtml("area", n, a.name, s.place.kind !== "me" && s.place.kind !== "search" && s.place.name === a.name, false)).join("");
    const radii = RADII.map((r) => chipHtml("radius", r, rLabel(r), s.radius === r, false)).join("");
    body = `<button type="button" class="row-btn" data-act="nearMe">${ICON.locate}<span>${t.useMyLocation}</span></button>
      <form class="search-form" id="areaForm"><input id="areaInput" type="text" placeholder="${t.searchArea}" autocomplete="off" aria-label="${t.searchArea}" />
      <button type="submit">${t.go}</button></form>${status}
      <div class="sec"><h3>${t.quickAreas}</h3><div class="wrap">${areas}</div></div>
      <div class="sec"><h3>${t.distance}</h3><div class="wrap">${radii}</div></div>`;
    foot = show;
  } else {
    title = t.filters;
    const dates = DATES.map((k) => {
      const ds = datesFor(k);
      return chipHtml("date", k, t.date[k], s.date === k, !finds(c, "date", (l) => onDates(l, ds)));
    }).join("");
    const when = Object.keys(WHEN).map((w) => chipHtml("when", w, t.w[w], s.when.includes(w), !finds(c, "when", WHEN[w]))).join("");
    const types = Object.keys(TYPES).map((k) => {
      const src = k === "online" ? c.onlineAll : c.pool;
      return chipHtml("type", k, t.ty[k], s.types.includes(k), !src.some((o) => passes(o.l, "types") && TYPES[k](o.l)));
    }).join("");
    const counts = {};
    c.pool.filter((o) => passes(o.l, "cats")).forEach((o) => { counts[o.l.c] = (counts[o.l.c] || 0) + 1; });
    const cats = CATEGORIES.filter((k) => counts[k] || s.cats.includes(k))
      .map((k) => chipHtml("cat", k, t.cat[k] || k, s.cats.includes(k), !counts[k])).join("");
    const langs = nearbyLangs(c).map(({ x, n }) => chipHtml("lang", x, t.lang[x] || x, s.langs.includes(x), n === 0)).join("");
    body = `<div class="sec"><h3>${t.dWhen}</h3><div class="wrap">${dates}${when}</div></div>
      <div class="sec"><h3>${t.type}</h3><div class="wrap">${types}</div></div>
      ${cats ? `<div class="sec"><h3>${t.activity}</h3><div class="wrap">${cats}</div></div>` : ""}
      ${langs ? `<div class="sec"><h3>${t.language}</h3><div class="wrap">${langs}</div></div>` : ""}
      <button type="button" class="row-btn switch-row" data-act="online" ${pressed(s.showOnline)}>
        <span>${t.includeOnline}</span><span class="switch${s.showOnline ? " on" : ""}"></span></button>`;
    foot = `<button type="button" class="text-btn" data-act="resetFilters">${t.reset}</button>${show}`;
  }

  el.innerHTML = `<button type="button" class="backdrop" data-act="closeSheet" aria-label="${t.close}"></button>
    <div class="sheet${again ? "" : " enter"}" role="dialog" aria-label="${esc(title)}">
      <div class="sheet-head"><h2>${esc(title)}</h2><button type="button" class="chip sq" data-act="closeSheet" aria-label="${t.close}">${ICON.close}</button></div>
      <div class="sheet-body">${body}</div>
      <div class="sheet-foot">${foot}</div>
    </div>`;
  el.hidden = false;
  el.dataset.open = s.sheet;
  el.querySelector(".sheet-body").scrollTop = scrollTop;
  const form = $("areaForm");
  if (form) {
    $("areaInput").value = typed;
    form.addEventListener("submit", (e) => { e.preventDefault(); searchArea($("areaInput").value); });
  }
}

function renderDetail(c) {
  const t = T(), el = $("detail");
  const o = state.detail && c.rows.find((x) => x.l.i === state.detail);
  if (!o) { el.hidden = true; el.innerHTML = ""; el.dataset.open = ""; return; }
  const again = el.dataset.open === state.detail;
  const l = o.l;
  const type = Object.keys(TYPES).find((k) => TYPES[k](l));
  const tags = [`<span class="agetag">${esc(ageText(l))}</span>`];
  if (type) tags.push(`<span class="tag">${esc(t.ty[type])}</span>`);
  if (l.l.length) tags.push(`<span class="tag">${esc(langText(l))}</span>`);
  if (l.h && l.f !== "Holiday camp") tags.push(`<span class="tag">${t.holidayClub}</span>`);
  const where = l.on ? t.online : l.ad || `${l.a} (${t.areaOnly})`;
  const notes = l.g || l.b ? `<div style="display:flex;flex-direction:column;gap:10px"><b style="font-size:16px">${t.parents}</b>
      ${l.g ? `<div class="note good">${ICON.plus}<div><b>${t.good}</b><span>${esc(l.g)}</span></div></div>` : ""}
      ${l.b ? `<div class="note bad">${ICON.minus}<div><b>${t.watch}</b><span>${esc(l.b)}</span></div></div>` : ""}</div>` : "";
  const dir = l.y != null && !l.on ? `https://www.google.com/maps/search/?api=1&query=${l.y},${l.x}` : "";

  el.innerHTML = `<button type="button" class="backdrop" style="flex:none;height:64px" data-act="closeDetail" aria-label="${t.close}"></button>
    <div class="sheet tall${again ? "" : " enter"}" role="dialog" aria-label="${esc(l.t)}">
      <div class="sheet-head">
        <span class="card-top" style="flex:1;min-width:0"><span class="dot" style="background:${catColor(l.c)}"></span><span class="card-cat">${esc(t.cat[l.c] || l.c)}</span></span>
        <button type="button" class="chip sq" data-act="closeDetail" aria-label="${t.close}">${ICON.close}</button>
      </div>
      <div class="sheet-body" style="padding:0"><div class="detail-body">
        <h2>${esc(l.t)}</h2>
        <span class="where">${ICON.pin}<span>${esc(whereText(l, o.d))}</span></span>
        <span class="tags">${tags.join("")}</span>
        <dl class="facts">
          <div><dt>${t.dWhen}</dt><dd>${esc(l.s || daysText(l.d) || "—")}</dd></div>
          <div><dt>${t.dPrice}</dt><dd>${esc(l.p || t.priceUnknown)}</dd></div>
          <div><dt>${t.dWhere}</dt><dd>${esc(where)}</dd></div>
        </dl>
        ${l.ds ? `<p>${esc(l.ds)}</p>` : ""}
        ${notes}
        ${l.k ? `<div class="check-note">${ICON.info}<span>${t.checkNote}</span></div>` : ""}
        ${l.w ? "" : `<span class="muted">${t.noSource}</span>`}
      </div></div>
      <div class="actions">
        ${l.w ? `<a class="primary" href="${esc(l.w)}" target="_blank" rel="noreferrer"><span>${t.website}</span>${ICON.external}</a>` : ""}
        ${dir ? `<a class="secondary" href="${dir}" target="_blank" rel="noreferrer">${ICON.directions}<span>${t.directions}</span></a>` : ""}
      </div>
    </div>`;
  el.hidden = false;
  el.dataset.open = state.detail;
}

function ensureMap() {
  if (map) return;
  map = L.map("map", { zoomControl: false, attributionControl: false });
  // Top right, just under the search bar: the bottom of the map is covered by the results panel
  L.control.attribution({ position: "topright", prefix: false }).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  map.setView([state.place.lat, state.place.lng], 13);
}

function renderMap(c) {
  ensureMap();
  markersLayer.clearLayers();
  const centre = [state.place.lat, state.place.lng];
  const lime = "#c8f560";
  L.circle(centre, {
    radius: state.radius * 1000, color: lime, weight: 1.5, opacity: 0.6, dashArray: "6 6", fillColor: lime, fillOpacity: 0.05, interactive: false,
  }).addTo(markersLayer);
  L.circleMarker(centre, { radius: 6, color: lime, weight: 10, opacity: 0.25, fillColor: lime, fillOpacity: 1, interactive: false }).addTo(markersLayer);

  for (const o of c.nearby) {
    const l = o.l;
    L.circleMarker([l.y, l.x], {
      radius: 8, color: "#0d1322", weight: 3, opacity: l.ap ? 0.6 : 1, fillColor: catColor(l.c), fillOpacity: l.ap ? 0.45 : 1,
    }).on("click", () => { state.detail = l.i; render({ keepScroll: true }); }).addTo(markersLayer);
  }

  // Re-frame only when the place or distance changes, so filtering doesn't make the map jump
  const key = `${state.place.lat},${state.place.lng},${state.radius}`;
  if (key !== fittedFor) {
    fittedFor = key;
    fitMap();
  }
}

// Fit the search circle into the part of the map you can see: below the top bar, above the panel
function fitMap() {
  const app = $("app"), h = app.clientHeight;
  const panelTop = Math.max(h * 0.45, h - 420); // same as .panel's resting top in style.css
  const below = $("topbar").getBoundingClientRect().bottom - app.getBoundingClientRect().top;
  const bounds = L.latLng(state.place.lat, state.place.lng).toBounds(state.radius * 2000);
  map.invalidateSize();
  map.fitBounds(bounds, { paddingTopLeft: [16, below + 12], paddingBottomRight: [16, h - panelTop + 12] });
}

function render({ keepScroll = false } = {}) {
  const c = compute();
  renderTop();
  renderFilters(c);
  renderHead(c);
  renderPanel();
  if (!keepScroll) $("list").scrollTop = 0;
  renderList(c);
  renderMap(c);
  renderSheet(c);
  renderDetail(c);
}

// ---- Location ----

function useMyLocation({ quiet = false } = {}) {
  const t = T();
  if (!navigator.geolocation) {
    if (!quiet) { state.placeStatus = t.locFail; state.placeWarn = true; render({ keepScroll: true }); }
    return;
  }
  if (!quiet) { state.placeStatus = t.locating; state.placeWarn = false; render({ keepScroll: true }); }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.place = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: t.nearMe, kind: "me" };
      state.placeStatus = "";
      state.sheet = null;
      render();
    },
    (err) => {
      console.warn("Location error", err);
      if (quiet) return;
      state.placeStatus = err.code === err.PERMISSION_DENIED ? T().blocked : T().locFail;
      state.placeWarn = true;
      render({ keepScroll: true });
    },
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 }
  );
}

// Geocode with OpenStreetMap's Nominatim. Their usage policy allows light use
// (max 1 request/second, no autocomplete), so we only search on submit.
async function searchArea(query) {
  query = query.trim();
  if (!query) return;
  state.placeStatus = T().searching;
  state.placeWarn = false;
  render({ keepScroll: true });
  try {
    const qs = new URLSearchParams({ q: query, format: "jsonv2", limit: "1", countrycodes: "gb" });
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs.toString()}`, {
      headers: { "Accept-Language": state.ui },
    });
    const results = await res.json();
    if (!Array.isArray(results) || !results.length) {
      state.placeStatus = T().notFound(query);
      state.placeWarn = true;
    } else {
      const p = results[0];
      state.place = { lat: Number(p.lat), lng: Number(p.lon), name: p.display_name.split(",")[0], kind: "search" };
      state.placeStatus = "";
      state.sheet = null;
    }
  } catch (e) {
    console.warn("Geocode error", e);
    state.placeStatus = T().locFail;
    state.placeWarn = true;
  }
  render();
}

// ---- Events ----

function toggle(key, v) {
  state[key] = state[key].includes(v) ? state[key].filter((x) => x !== v) : state[key].concat([v]);
}

const ACTIONS = {
  ui: () => { state.ui = isRu() ? "en" : "ru"; savePrefs(); },
  age: (v) => { toggle("ages", Number(v)); savePrefs(); },
  radius: (v) => { state.radius = Number(v); savePrefs(); },
  lang: (v) => { toggle("langs", v); savePrefs(); },
  date: (v) => { state.date = state.date === v ? null : v; },
  when: (v) => toggle("when", v),
  type: (v) => toggle("types", v),
  cat: (v) => toggle("cats", v),
  online: () => { state.showOnline = !state.showOnline; },
  clear: () => {
    Object.assign(state, { ages: [], langs: [], date: null, when: [], types: [], cats: [], showOnline: false });
    savePrefs();
  },
  // Everything except age, which is about the child rather than this search
  resetFilters: () => {
    Object.assign(state, { langs: [], date: null, when: [], types: [], cats: [], showOnline: false });
    savePrefs();
  },
  sheet: (v) => { state.sheet = v; state.placeStatus = ""; },
  closeSheet: () => { state.sheet = null; },
  open: (v) => { state.detail = v; },
  closeDetail: () => { state.detail = null; },
  panel: () => { state.expanded = !state.expanded; },
  nearMe: () => { useMyLocation(); return "async"; },
  area: (v) => {
    const a = QUICK_AREAS[Number(v)];
    state.place = { lat: a.lat, lng: a.lng, name: a.name, kind: "area" };
    state.sheet = null;
  },
};

// Actions that only open or close something keep the list where it was
const KEEP_SCROLL = new Set(["ui", "sheet", "closeSheet", "open", "closeDetail", "panel"]);

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el || !ACTIONS[el.dataset.act]) return;
  const act = el.dataset.act;
  if (ACTIONS[act](el.dataset.v) === "async") return;
  render({ keepScroll: KEEP_SCROLL.has(act) });
});

// Drag the panel's handle or header up for the full list, down for the map; a tap toggles
const panel = $("panel");
let drag = null;

panel.addEventListener("pointerdown", (e) => {
  if (!e.target.closest(".drag-zone") || e.target.closest("button")) return;
  drag = { y: e.clientY, top: panel.offsetTop, moved: false };
  panel.setPointerCapture(e.pointerId);
  panel.classList.add("dragging");
});
panel.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dy = e.clientY - drag.y;
  if (Math.abs(dy) > 6) drag.moved = true;
  const h = $("app").clientHeight;
  panel.style.top = `${Math.min(h - 120, Math.max(60, drag.top + dy))}px`;
});
function endDrag(e) {
  if (!drag) return;
  const { y, moved } = drag;
  drag = null;
  panel.classList.remove("dragging");
  panel.style.top = "";
  if (e.type !== "pointercancel") {
    const dy = e.clientY - y;
    if (!moved) state.expanded = !state.expanded;
    else if (Math.abs(dy) > 40) state.expanded = dy < 0;
  }
  renderPanel();
}
panel.addEventListener("pointerup", endDrag);
panel.addEventListener("pointercancel", endDrag);

// Scrolling the list while the panel is low opens it fully
$("list").addEventListener("scroll", (e) => {
  if (!state.expanded && e.currentTarget.scrollTop > 24) {
    state.expanded = true;
    renderPanel();
  }
}, { passive: true });

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (state.detail) state.detail = null;
  else if (state.sheet) state.sheet = null;
  else if (state.expanded) state.expanded = false;
  else return;
  render({ keepScroll: true });
});

loadPrefs();
render();
loadListings();
useMyLocation({ quiet: true });
