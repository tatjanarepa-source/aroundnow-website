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
const CATEGORIES = ["Languages", "Sports / Dance", "Performing arts", "Arts / Crafts", "Chess", "STEM / Thinking",
  "Childcare / Preschool", "Outdoor / Nature", "Life skills", "Mixed"];

const STRINGS = {
  en: {
    childAge: "Child’s age", any: "Any", anyAge: "Any age", under1: "Under 1", siblings: "Two kids? Tap both ages",
    language: "Language", more: "More", activity: "Activity", includeOnline: "Include online classes",
    where: "Where to look", nearMe: "Near me", useMyLocation: "Use my location", locating: "Finding your location…",
    blocked: "Location is blocked. Allow it in your browser settings, or search an area.",
    locFail: "Couldn’t get your location. Search an area instead.",
    searchArea: "Area, town or postcode", go: "Go", searching: "Looking it up…", notFound: (q) => `Couldn’t find “${q}”.`,
    quickAreas: "Popular areas", reset: "Reset", clearAll: "Clear all", close: "Close", edit: "Edit",
    map: "Map", list: "List", loading: "Loading classes…", loadError: "Could not load classes. Check your connection.",
    needsCheck: "Needs checking", online: "Online", holidayClub: "Holiday club", suitsBoth: "Suits both", suitsAll: "Suits all",
    dWhen: "When", dPrice: "Price", dWhere: "Where", priceUnknown: "Not listed yet", areaOnly: "exact venue not listed yet",
    parents: "What parents say", good: "Good", watch: "Watch out",
    checkNote: "Some details may be out of date. Check the official page before you go.",
    noSource: "Community-submitted, no official source", website: "Official website", directions: "Directions", details: "Details",
    lighter: "Lighter pins: area only, no exact address", nothing: "Nothing matches these filters.", agesNA: "Ages not listed",
    w: { weekends: "Weekends", afterschool: "After school", mornings: "Weekday mornings", holidays: "School holidays" },
    ty: { weekendschool: "Weekend schools", weekly: "Weekly classes", camps: "Holiday camps", nursery: "Nursery", events: "Events", online: "Online" },
    cat: { "Languages": "Languages", "Sports / Dance": "Sport & dance", "Performing arts": "Music & theatre", "Arts / Crafts": "Arts & crafts",
      "Chess": "Chess", "STEM / Thinking": "Science & thinking", "Childcare / Preschool": "Nursery", "Outdoor / Nature": "Outdoors",
      "Life skills": "Life skills", "Mixed": "Clubs" },
    lang: { Russian: "Russian", English: "English" },
    day: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
  },
  ru: {
    childAge: "Возраст ребёнка", any: "Любой", anyAge: "Любой возраст", under1: "До 1", siblings: "Двое детей? Выберите оба",
    language: "Язык", more: "Ещё", activity: "Направление", includeOnline: "Показывать онлайн-занятия",
    where: "Где искать", nearMe: "Рядом со мной", useMyLocation: "Определить моё местоположение", locating: "Определяем местоположение…",
    blocked: "Доступ к геолокации запрещён. Разрешите его в настройках браузера или найдите район.",
    locFail: "Не удалось определить местоположение. Найдите район.",
    searchArea: "Район, город или индекс", go: "Найти", searching: "Ищем…", notFound: (q) => `Не нашли «${q}».`,
    quickAreas: "Популярные районы", reset: "Сбросить", clearAll: "Сбросить всё", close: "Закрыть", edit: "Изменить",
    map: "Карта", list: "Список", loading: "Загружаем занятия…", loadError: "Не удалось загрузить занятия. Проверьте интернет.",
    needsCheck: "Нужно проверить", online: "Онлайн", holidayClub: "Лагерь на каникулах", suitsBoth: "Подходит обоим", suitsAll: "Подходит всем",
    dWhen: "Когда", dPrice: "Цена", dWhere: "Где", priceUnknown: "Пока не указана", areaOnly: "точный адрес пока не указан",
    parents: "Что говорят родители", good: "Плюсы", watch: "Минусы",
    checkNote: "Часть информации может быть устаревшей. Перед визитом проверьте на официальном сайте.",
    noSource: "Добавлено сообществом, без официального источника", website: "Официальный сайт", directions: "Маршрут", details: "Подробнее",
    lighter: "Светлые метки: только район, без точного адреса", nothing: "По этим фильтрам ничего нет.", agesNA: "Возраст не указан",
    w: { weekends: "Выходные", afterschool: "После школы", mornings: "Будни, утро", holidays: "Каникулы" },
    ty: { weekendschool: "Школы выходного дня", weekly: "Кружки и секции", camps: "Лагеря", nursery: "Детский сад", events: "Мероприятия", online: "Онлайн" },
    cat: { "Languages": "Языки", "Sports / Dance": "Спорт и танцы", "Performing arts": "Музыка и театр", "Arts / Crafts": "Творчество",
      "Chess": "Шахматы", "STEM / Thinking": "Наука и мышление", "Childcare / Preschool": "Детский сад", "Outdoor / Nature": "На природе",
      "Life skills": "Навыки для жизни", "Mixed": "Кружки" },
    lang: { Russian: "Русский", English: "Английский" },
    day: { Mon: "Пн", Tue: "Вт", Wed: "Ср", Thu: "Чт", Fri: "Пт", Sat: "Сб", Sun: "Вс" },
  },
};

const ICON = {
  pin: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
  chevron: '<svg class="i" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  sliders: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>',
  close: '<svg class="i" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  map: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4z"/><path d="M9 4v13.5M15 6.5V20"/></svg>',
  list: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg>',
  locate: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  external: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
  directions: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>',
  plus: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
  minus: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
  info: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
};

const state = {
  ui: "en", ages: [], radius: 3, langs: [], when: [], types: [], cats: [],
  showOnline: false, view: "list", sheet: null, detail: null, compact: false,
  place: { ...DEFAULT_PLACE }, placeStatus: "", placeWarn: false,
  items: [], loaded: false, error: false,
};

let map, markersLayer;

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
    st: (r.start_time || "").slice(0, 5), f: r.format || "", c: r.category || "", r: r.runs_when || "",
    h: r.holiday_club ? 1 : 0, s: r.schedule_text || "", p: r.price_text || "", ds: r.description || "",
    g: r.pros || "", b: r.cons || "", w: r.website || "", k: r.status === "Check" ? 1 : 0,
    ad: [r.address, r.postcode].filter(Boolean).join(", "),
  };
}

async function loadListings() {
  const cols = ["id", "title", "website", "delivery_mode", "location_area", "address", "postcode", "location", "address_source",
    "format", "category", "age_min_months", "age_max_months", "languages", "runs_when", "holiday_club", "days_of_week",
    "time_of_day", "start_time", "schedule_text", "price_text", "description", "pros", "cons", "status"].join(",");
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

// `skip` leaves one filter group out, which is how each chip counts what it would find
function passes(l, skip) {
  const s = state;
  if (skip !== "ages" && s.ages.length && !s.ages.some((a) => fitsAge(l, a))) return false;
  if (skip !== "langs" && s.langs.length && !s.langs.some((x) => l.l.includes(x))) return false;
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

function agesSummary() {
  const labs = state.ages.slice().sort((a, b) => a - b).map(ageWord);
  if (isRu()) return `Возраст: ${labs.join(", ")}`;
  if (labs.length === 1) return state.ages[0] === 6 ? "Under 1" : `Age ${labs[0]}`;
  return `Ages ${labs.join(", ")}`;
}

function ageText(l) {
  const ru = isRu();
  const f = (m) => {
    if (m < 12) return ru ? `${m} мес.` : `${m} mo`;
    const y = m / 12;
    if (Number.isInteger(y)) return String(y);
    if (m % 12 === 6) return ru ? `${Math.floor(y)},5` : `${Math.floor(y)}½`;
    return ru ? y.toFixed(1).replace(".", ",") : y.toFixed(1);
  };
  const { mn, mx } = l;
  if (mn == null && mx == null) return T().agesNA;
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
  return d && l.st ? `${d} · ${l.st}` : d;
}

function langText(l) { return l.l.map((x) => T().lang[x] || x).join(" · "); }

function whereText(l, d) {
  if (l.on) return T().online;
  return `${l.a} · ${l.ap ? "~" : ""}${km(d)}`;
}

function placeName() { return state.place.kind === "me" ? T().nearMe : state.place.name; }

// ---- Rendering ----

function pressed(on) { return `aria-pressed="${on ? "true" : "false"}"`; }

function chipHtml(act, v, label, count, on) {
  const zero = count === 0 && !on ? " zero" : "";
  const n = count === "" ? "" : `<span class="n">${count}</span>`;
  return `<button type="button" class="chip${zero}" data-act="${act}" data-v="${esc(v)}" ${pressed(on)}><span>${esc(label)}</span>${n}</button>`;
}

function renderFilters(c) {
  const s = state, t = T(), el = $("filters");
  if (s.compact) {
    const parts = [s.ages.length ? agesSummary() : t.anyAge, `${placeName()} · ${rLabel(s.radius)}`];
    if (s.langs.length) parts.push(s.langs.map((x) => t.lang[x] || x).join(", "));
    s.when.forEach((w) => parts.push(t.w[w]));
    s.types.forEach((k) => parts.push(t.ty[k]));
    if (s.cats.length) parts.push(`${t.more} · ${s.cats.length}`);
    el.innerHTML = `<div class="compact-bar">${ICON.sliders}<span>${esc(parts.join(" · "))}</span>
      <button type="button" class="pill-btn" data-act="expand">${t.edit}</button></div>`;
    return;
  }

  const ages = [`<button type="button" class="bubble wide" data-act="ageAny" aria-label="${t.anyAge}" ${pressed(!s.ages.length)}>${t.any}</button>`]
    .concat(AGES.map((a) => `<button type="button" class="bubble" data-act="age" data-v="${a}" aria-label="${ageWord(a)}" ${pressed(s.ages.includes(a))}>${a === 6 ? "&lt;1" : ageWord(a)}</button>`))
    .join("");

  const radii = RADII.map((r) => `<button type="button" data-act="radius" data-v="${r}" ${pressed(s.radius === r)}>${rLabel(r)}</button>`).join("");

  // Only languages actually offered nearby, most common first
  const langCounts = {};
  c.pool.filter((o) => passes(o.l, "langs")).forEach((o) => o.l.l.forEach((x) => { langCounts[x] = (langCounts[x] || 0) + 1; }));
  s.langs.forEach((x) => { if (!(x in langCounts)) langCounts[x] = 0; });
  const langs = chipHtml("langAny", "", t.any, "", !s.langs.length) + Object.keys(langCounts)
    .sort((a, b) => langCounts[b] - langCounts[a])
    .map((x) => chipHtml("lang", x, t.lang[x] || x, langCounts[x], s.langs.includes(x))).join("");

  const when = Object.keys(WHEN).map((w) =>
    chipHtml("when", w, t.w[w], c.pool.filter((o) => passes(o.l, "when") && WHEN[w](o.l)).length, s.when.includes(w))).join("");
  const types = Object.keys(TYPES).map((k) => {
    const src = k === "online" ? c.onlineAll : c.pool;
    return chipHtml("type", k, t.ty[k], src.filter((o) => passes(o.l, "types") && TYPES[k](o.l)).length, s.types.includes(k));
  }).join("");
  const moreOn = s.cats.length > 0 || s.showOnline;

  el.innerHTML = `<div class="filters-open">
    <div class="row-label"><b>${t.childAge}</b><span>${t.siblings}</span></div>
    <div class="hs">${ages}</div>
    <div class="place-row">
      <button type="button" class="place-btn" data-act="sheet" data-v="place">${ICON.pin}<span>${esc(placeName())}</span>${ICON.chevron}</button>
      <span class="seg blue">${radii}</span>
    </div>
    <div class="hs"><b>${t.language}</b>${langs}</div>
    <div class="hs">${when}<span class="divider"></span>${types}
      <button type="button" class="chip" data-act="sheet" data-v="more" ${pressed(moreOn)}>${ICON.sliders}<span>${s.cats.length ? `${t.more} · ${s.cats.length}` : t.more}</span></button>
    </div>
  </div>`;
}

function renderList(c) {
  const s = state, t = T(), list = $("list");
  if (!s.loaded) { list.innerHTML = `<div class="empty">${t.loading}</div>`; return; }
  if (s.error) { list.innerHTML = `<div class="empty">${t.loadError}</div>`; return; }

  let html = "";
  const w = widenInfo(c);
  if (w) {
    html += `<div class="notice"><span>${esc(w.text)}</span><button type="button" class="pill-btn solid" data-act="radius" data-v="${w.r}">${esc(w.cta)}</button></div>`;
  }

  const multi = s.ages.length >= 2;
  html += c.shown.map((o) => {
    const l = o.l;
    const tags = [`<span class="tag age">${esc(ageText(l))}</span>`];
    const wt = whenText(l);
    if (wt) tags.push(`<span class="tag">${esc(wt)}</span>`);
    if (l.l.length) tags.push(`<span class="tag">${esc(langText(l))}</span>`);
    const ps = shortPrice(l.p);
    if (ps) tags.push(`<span class="tag">${esc(ps)}</span>`);
    if (s.when.includes("holidays") && l.h && l.f !== "Holiday camp") tags.push(`<span class="tag">${t.holidayClub}</span>`);
    if (multi && (l.mn != null || l.mx != null) && s.ages.every((a) => fitsAge(l, a))) {
      tags.push(`<span class="tag blue">${s.ages.length === 2 ? t.suitsBoth : t.suitsAll}</span>`);
    }
    return `<button type="button" class="card" data-act="open" data-v="${esc(l.i)}">
      <span class="card-head"><span class="card-title">${esc(l.t)}</span>${l.k ? `<span class="tag warn">${t.needsCheck}</span>` : ""}</span>
      <span class="where">${ICON.pin}<span>${esc(whereText(l, o.d))}</span></span>
      <span class="tags">${tags.join("")}</span>
    </button>`;
  }).join("");

  if (c.online.length && !s.types.includes("online")) {
    const label = isRu() ? `Ещё онлайн: ${classes(c.online.length)}` : `${classes(c.online.length)} online too`;
    const cta = s.showOnline ? (isRu() ? "Скрыть" : "Hide") : (isRu() ? "Показать" : "Show");
    html += `<button type="button" class="online-row" data-act="online"><span>${esc(label)}</span><span>${cta}</span></button>`;
  }
  if (!c.shown.length && !w) {
    html += `<div class="empty"><span>${t.nothing}</span><button type="button" class="pill-btn" data-act="clear">${t.clearAll}</button></div>`;
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
  const r = state.radius;
  return {
    r: next.r,
    text: isRu()
      ? (n ? `В радиусе ${r} км — только ${classes(n)}.` : `В радиусе ${r} км пока ничего нет.`)
      : (n ? `Only ${classes(n)} within ${r} km.` : `Nothing within ${r} km yet.`),
    cta: isRu() ? `Показать в радиусе ${next.r} км (+${next.n - n})` : `Show within ${next.r} km (+${next.n - n})`,
  };
}

function renderHead(c) {
  const s = state, t = T();
  const extra = c.showOnline && c.online.length ? (isRu() ? ` + ${c.online.length} онлайн` : ` + ${c.online.length} online`) : "";
  $("countLabel").textContent = !s.loaded ? "" : isRu()
    ? `${classes(c.nearby.length)} в радиусе ${s.radius} км${extra}`
    : `${classes(c.nearby.length)} within ${s.radius} km${extra}`;
  const hasFilters = s.ages.length || s.langs.length || s.when.length || s.types.length || s.cats.length || s.showOnline;
  $("clearBtn").hidden = !hasFilters;
  $("clearBtn").textContent = t.clearAll;
  $("viewToggle").innerHTML = s.view === "list" ? `${ICON.map}<span>${t.map}</span>` : `${ICON.list}<span>${t.list}</span>`;
  document.querySelectorAll("#uiSwitch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === s.ui)));
  document.documentElement.lang = s.ui;
}

function renderSheet(c) {
  const s = state, t = T(), el = $("sheet");
  if (!s.sheet) { el.hidden = true; el.innerHTML = ""; return; }
  let title, body, foot = "";
  const total = c.shown.length;
  const show = total ? (isRu() ? `Показать ${classes(total)}` : `Show ${classes(total)}`) : (isRu() ? "Ничего не найдено" : "No matches yet");

  if (s.sheet === "place") {
    title = t.where;
    const status = s.placeStatus ? `<p class="status${s.placeWarn ? " warn" : ""}">${esc(s.placeStatus)}</p>` : "";
    body = `<button type="button" class="row-btn" data-act="nearMe">${ICON.locate}<span>${t.useMyLocation}</span></button>
      <form class="search-form" id="areaForm"><input id="areaInput" type="text" placeholder="${t.searchArea}" autocomplete="off" aria-label="${t.searchArea}" />
      <button type="submit">${t.go}</button></form>${status}
      <p class="sub-title" style="margin-top:18px">${t.quickAreas}</p>
      ${QUICK_AREAS.map((a, n) => `<button type="button" class="row-btn" data-act="area" data-v="${n}">${ICON.pin}<span>${esc(a.name)}</span></button>`).join("")}`;
  } else {
    title = t.more;
    const counts = {};
    c.pool.filter((o) => passes(o.l, "cats")).forEach((o) => { counts[o.l.c] = (counts[o.l.c] || 0) + 1; });
    const cats = CATEGORIES.filter((k) => counts[k] || s.cats.includes(k))
      .map((k) => chipHtml("cat", k, t.cat[k], counts[k] || 0, s.cats.includes(k))).join("");
    body = `<p class="sub-title">${t.activity}</p><div class="wrap">${cats}</div>
      <button type="button" class="row-btn" style="justify-content:space-between;margin-top:16px;border-top:1px solid var(--line-soft)" data-act="online" ${pressed(s.showOnline)}>
        <span>${t.includeOnline}</span><span class="switch${s.showOnline ? " on" : ""}"></span></button>`;
    foot = `<div class="sheet-foot"><button type="button" class="link-btn" data-act="resetMore">${t.reset}</button>
      <button type="button" class="primary" data-act="closeSheet">${esc(show)}</button></div>`;
  }

  el.innerHTML = `<button type="button" class="backdrop" data-act="closeSheet" aria-label="${t.close}"></button>
    <div class="sheet" role="dialog" aria-label="${esc(title)}">
      <div class="sheet-head"><h2>${esc(title)}</h2><button type="button" class="icon-btn" data-act="closeSheet" aria-label="${t.close}">${ICON.close}</button></div>
      <div class="sheet-body">${body}</div>${foot}
    </div>`;
  el.hidden = false;
  const form = $("areaForm");
  if (form) form.addEventListener("submit", (e) => { e.preventDefault(); searchArea($("areaInput").value); });
}

function renderDetail(c) {
  const t = T(), el = $("detail");
  const o = state.detail && c.rows.find((x) => x.l.i === state.detail);
  if (!o) { el.hidden = true; el.innerHTML = ""; return; }
  const l = o.l;
  const type = Object.keys(TYPES).find((k) => TYPES[k](l));
  const tags = [`<span class="tag age">${esc(ageText(l))}</span>`];
  if (type) tags.push(`<span class="tag">${esc(t.ty[type])}</span>`);
  if (l.l.length) tags.push(`<span class="tag">${esc(langText(l))}</span>`);
  if (l.h && l.f !== "Holiday camp") tags.push(`<span class="tag">${t.holidayClub}</span>`);
  const where = l.on ? t.online : l.ad || `${l.a} (${t.areaOnly})`;
  const notes = l.g || l.b ? `<div style="display:flex;flex-direction:column;gap:10px"><b style="font-size:16px">${t.parents}</b>
      ${l.g ? `<div class="note good">${ICON.plus}<div><b>${t.good}</b><span>${esc(l.g)}</span></div></div>` : ""}
      ${l.b ? `<div class="note bad">${ICON.minus}<div><b>${t.watch}</b><span>${esc(l.b)}</span></div></div>` : ""}</div>` : "";
  const dir = l.y != null && !l.on ? `https://www.google.com/maps/search/?api=1&query=${l.y},${l.x}` : "";

  el.innerHTML = `<button type="button" class="backdrop" style="flex:none;height:64px" data-act="closeDetail" aria-label="${t.close}"></button>
    <div class="sheet tall" role="dialog" aria-label="${esc(l.t)}">
      <div class="sheet-head" style="justify-content:flex-end"><button type="button" class="icon-btn" data-act="closeDetail" aria-label="${t.close}">${ICON.close}</button></div>
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
}

function ensureMap() {
  if (map) return;
  map = L.map("map", { zoomControl: true });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  map.setView([state.place.lat, state.place.lng], 13);
}

function renderMap(c) {
  const t = T();
  $("list").hidden = state.view !== "list";
  $("mapWrap").hidden = state.view !== "map";
  if (state.view !== "map") return;
  ensureMap();
  markersLayer.clearLayers();
  const centre = [state.place.lat, state.place.lng];
  L.circle(centre, { radius: state.radius * 1000, color: "#1f5fd6", weight: 2, dashArray: "6 6", fillOpacity: 0.05 }).addTo(markersLayer);
  L.circleMarker(centre, { radius: 8, color: "#fff", weight: 3, fillColor: "#1f5fd6", fillOpacity: 1 }).addTo(markersLayer);

  for (const o of c.nearby) {
    const l = o.l;
    L.circleMarker([l.y, l.x], {
      radius: 10, color: "#fff", weight: 2, fillColor: l.ap ? "#8aa6da" : "#1f5fd6", fillOpacity: 1,
    }).bindPopup(`<b>${esc(l.t)}</b>${esc(whereText(l, o.d))}<br>${esc(ageText(l))}
      <br><button type="button" class="pill-btn solid" data-act="open" data-v="${esc(l.i)}">${t.details}</button>`).addTo(markersLayer);
  }
  const approx = c.nearby.some((o) => o.l.ap);
  $("mapNote").innerHTML = `${esc(isRu() ? `На карте: ${classes(c.nearby.length)}` : `${classes(c.nearby.length)} on the map`)}${approx ? `<span>${t.lighter}</span>` : ""}`;
  const bounds = L.latLng(centre).toBounds(state.radius * 2000);
  setTimeout(() => { map.invalidateSize(); map.fitBounds(bounds, { padding: [16, 16] }); }, 0);
}

function render({ keepScroll = false } = {}) {
  const c = compute();
  renderFilters(c);
  renderHead(c);
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
  ui: (v) => { state.ui = v; savePrefs(); },
  ageAny: () => { state.ages = []; savePrefs(); },
  age: (v) => { toggle("ages", Number(v)); savePrefs(); },
  radius: (v) => { state.radius = Number(v); savePrefs(); },
  langAny: () => { state.langs = []; savePrefs(); },
  lang: (v) => { toggle("langs", v); savePrefs(); },
  when: (v) => toggle("when", v),
  type: (v) => toggle("types", v),
  cat: (v) => toggle("cats", v),
  online: () => { state.showOnline = !state.showOnline; },
  clear: () => {
    Object.assign(state, { ages: [], langs: [], when: [], types: [], cats: [], showOnline: false });
    savePrefs();
  },
  resetMore: () => { Object.assign(state, { cats: [], showOnline: false }); },
  sheet: (v) => { state.sheet = v; state.placeStatus = ""; },
  closeSheet: () => { state.sheet = null; },
  open: (v) => { state.detail = v; },
  closeDetail: () => { state.detail = null; },
  view: () => { state.view = state.view === "list" ? "map" : "list"; state.compact = false; },
  expand: () => { state.compact = false; },
  nearMe: () => { useMyLocation(); return "async"; },
  area: (v) => {
    const a = QUICK_AREAS[Number(v)];
    state.place = { lat: a.lat, lng: a.lng, name: a.name, kind: "area" };
    state.sheet = null;
  },
};

// Actions that only open or close a panel keep the list where it was
const KEEP_SCROLL = new Set(["sheet", "closeSheet", "open", "closeDetail", "expand"]);

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el || !ACTIONS[el.dataset.act]) return;
  const act = el.dataset.act;
  if (!KEEP_SCROLL.has(act) && map) map.closePopup();
  if (ACTIONS[act](el.dataset.v) === "async") return;
  render({ keepScroll: KEEP_SCROLL.has(act) });
});

// Fold the filters into one line once the list has been scrolled a little
$("list").addEventListener("scroll", (e) => {
  const el = e.currentTarget;
  if (!state.compact && el.scrollTop > 40 && el.scrollHeight - el.clientHeight > 260) {
    state.compact = true;
    renderFilters(compute());
  } else if (state.compact && el.scrollTop <= 0) {
    state.compact = false;
    renderFilters(compute());
  }
}, { passive: true });

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (state.detail) state.detail = null;
  else if (state.sheet) state.sheet = null;
  else return;
  render({ keepScroll: true });
});

loadPrefs();
render();
loadListings();
useMyLocation({ quiet: true });
