// Listings live in Supabase (see supabase/schema.sql). The publishable key is
// meant to be public: the database only allows reading visible listings.
const SUPABASE_URL = "https://dftaitxrrbihsmkinezq.supabase.co";
const SUPABASE_KEY = "sb_publishable_bNlpFrdOhFmab51drVpBCQ_PO7564tA";

// Launch area: Ealing Broadway
const DEFAULT_PLACE = { lat: 51.5149, lng: -0.3017, name: "Ealing" };

// Pick-lists — must match the check constraints in supabase/schema.sql
const OPTIONS = {
  categories: ["Languages", "Arts / Crafts", "Performing arts", "Sports / Dance", "Chess", "STEM / Thinking",
    "Childcare / Preschool", "Outdoor / Nature", "Events / Parties", "Life skills", "Mixed"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  times: ["Morning", "Afternoon", "Evening"],
  formats: ["Weekend school", "After-school class", "Group class", "Preschool / nursery", "Holiday camp",
    "Workshop / event", "Online course"],
  languages: ["Russian", "English", "Bilingual"],
  runsWhen: ["Term time", "Holidays", "Both", "Year-round"],
};

const state = {
  lat: DEFAULT_PLACE.lat,
  lng: DEFAULT_PLACE.lng,
  radiusKm: 10,
  ageMonths: null,
  q: "",
  includeOnline: true,
  filters: Object.fromEntries(Object.keys(OPTIONS).map((k) => [k, new Set()])),
  view: "list",
  items: [],
  error: false,
};

let map, markersLayer;
let requestSeq = 0;

function $(id) { return document.getElementById(id); }

function init() {
  buildAgeOptions();
  buildChips();

  $("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.q = $("keyword").value.trim();
    fetchListings();
  });
  $("cityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    searchCity($("cityInput").value);
  });
  $("locBtn").addEventListener("click", useMyLocation);
  $("ageSelect").addEventListener("change", (e) => {
    state.ageMonths = e.target.value === "" ? null : Number(e.target.value);
    fetchListings();
  });
  $("radiusSelect").addEventListener("change", (e) => {
    state.radiusKm = Number(e.target.value);
    fetchListings();
  });
  $("onlineToggle").addEventListener("change", (e) => {
    state.includeOnline = e.target.checked;
    fetchListings();
  });
  $("clearBtn").addEventListener("click", clearFilters);

  $("listViewBtn").addEventListener("click", () => setView("list"));
  $("mapViewBtn").addEventListener("click", () => setView("map"));

  fetchListings();
  useMyLocation({ quiet: true });
}

function buildAgeOptions() {
  const select = $("ageSelect");
  for (let years = 1; years <= 16; years++) {
    const opt = document.createElement("option");
    opt.value = String(years * 12);
    opt.textContent = years === 1 ? "1 year" : `${years} years`;
    select.appendChild(opt);
  }
}

function buildChips() {
  document.querySelectorAll(".chips[data-group]").forEach((container) => {
    const group = container.dataset.group;
    for (const value of OPTIONS[group]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = value;
      btn.dataset.value = value;
      container.appendChild(btn);
    }
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      const set = state.filters[group];
      if (set.has(btn.dataset.value)) set.delete(btn.dataset.value);
      else set.add(btn.dataset.value);
      btn.classList.toggle("active");
      updateFilterCount();
      fetchListings();
    });
  });
}

function updateFilterCount() {
  const n = ["days", "times", "formats", "languages", "runsWhen"]
    .reduce((sum, k) => sum + state.filters[k].size, 0);
  $("filterCount").hidden = n === 0;
  $("filterCount").textContent = String(n);
}

function clearFilters() {
  for (const set of Object.values(state.filters)) set.clear();
  document.querySelectorAll(".chip.active").forEach((b) => b.classList.remove("active"));
  state.ageMonths = null;
  $("ageSelect").value = "";
  state.q = "";
  $("keyword").value = "";
  state.includeOnline = true;
  $("onlineToggle").checked = true;
  updateFilterCount();
  fetchListings();
}

function setView(view) {
  state.view = view;
  $("listViewBtn").classList.toggle("active", view === "list");
  $("mapViewBtn").classList.toggle("active", view === "map");
  $("listView").hidden = view !== "list";
  $("mapView").hidden = view !== "map";
  if (view === "map") {
    ensureMap();
    setTimeout(() => map.invalidateSize(), 0);
    renderMarkers();
  }
}

function setPlaceStatus(text, warn = false) {
  const el = $("placeStatus");
  el.textContent = text;
  el.classList.toggle("warn", warn);
}

// On start-up ({quiet: true}) a failure just keeps Ealing; when the user taps 📍 we explain.
function useMyLocation({ quiet = false } = {}) {
  if (!navigator.geolocation) {
    if (!quiet) setPlaceStatus("Location isn't available here — search a city instead.", true);
    return;
  }
  if (!quiet) setPlaceStatus("Finding your location…");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.lat = pos.coords.latitude;
      state.lng = pos.coords.longitude;
      setPlaceStatus("Showing: near you");
      fetchListings();
    },
    (err) => {
      console.warn("Location error", err);
      if (quiet) return;
      const why = err.code === err.PERMISSION_DENIED ? "location is blocked" : "couldn't get your location";
      setPlaceStatus(`Showing: ${DEFAULT_PLACE.name} — ${why}, search a city instead.`, true);
    },
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 }
  );
}

// Geocode with OpenStreetMap's Nominatim. Their usage policy allows light use
// (max 1 request/second, no autocomplete), so we only search on submit.
async function searchCity(query) {
  query = query.trim();
  if (!query) return;
  $("cityBtn").disabled = true;
  setPlaceStatus(`Looking up "${query}"…`);
  try {
    const qs = new URLSearchParams({ q: query, format: "jsonv2", limit: "1", countrycodes: "gb" });
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs.toString()}`, {
      headers: { "Accept-Language": navigator.language || "en" },
    });
    const results = await res.json();
    if (!Array.isArray(results) || !results.length) {
      setPlaceStatus(`Couldn't find "${query}" — try another spelling.`, true);
      return;
    }
    const place = results[0];
    state.lat = Number(place.lat);
    state.lng = Number(place.lon);
    setPlaceStatus(`Showing: ${place.display_name.split(",").slice(0, 2).join(",")}`);
    fetchListings();
  } catch (e) {
    console.warn("Geocode error", e);
    setPlaceStatus("City search failed — check your connection.", true);
  } finally {
    $("cityBtn").disabled = false;
  }
}

async function fetchListings() {
  const seq = ++requestSeq;
  $("searchBtn").textContent = "…";
  const set = (k) => (state.filters[k].size ? [...state.filters[k]] : null);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_listings`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        p_lat: state.lat,
        p_lng: state.lng,
        p_radius_km: state.radiusKm,
        p_age_months: state.ageMonths,
        p_categories: set("categories"),
        p_formats: set("formats"),
        p_days: set("days"),
        p_times: set("times"),
        p_languages: set("languages"),
        p_runs_when: set("runsWhen"),
        p_q: state.q || null,
        p_include_online: state.includeOnline,
      }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const data = await res.json();
    if (seq !== requestSeq) return; // a newer search has already started
    state.items = Array.isArray(data) ? data : [];
    state.error = false;
  } catch (e) {
    console.warn("Fetch error", e);
    if (seq !== requestSeq) return;
    state.items = [];
    state.error = true;
  } finally {
    if (seq === requestSeq) {
      $("searchBtn").textContent = "Search";
      renderList();
      if (state.view === "map") renderMarkers();
    }
  }
}

function formatAge(min, max) {
  const fmt = (m) => (m < 12 ? `${m} mo` : `${+(m / 12).toFixed(1)}`);
  if (min == null && max == null) return "";
  if (max == null) return `Ages ${fmt(min)}+`;
  if (min == null) return `Up to ${fmt(max)} yrs`;
  return `Ages ${fmt(min)}–${fmt(max)}`;
}

function formatWhen(item) {
  if (item.schedule_text) return item.schedule_text;
  return (item.days_of_week || []).join(", ");
}

function whereLine(item) {
  if (item.delivery_mode === "Online") return "Online";
  const parts = [item.location_area || item.address];
  if (item.distance_km != null) parts.push(`${item.distance_km} km`);
  return parts.filter(Boolean).join(" • ");
}

function renderList() {
  const container = $("listItems");
  const empty = $("listEmpty");
  container.innerHTML = "";
  $("resultCount").textContent = state.items.length ? `${state.items.length} found` : "";
  if (!state.items.length) {
    empty.textContent = state.error
      ? "Could not load listings — check your connection."
      : "Nothing matches — try a bigger radius or fewer filters.";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  for (const item of state.items) {
    const card = document.createElement("article");
    card.className = "card";
    const age = formatAge(item.age_min_months, item.age_max_months);
    const hasNotes = item.pros || item.cons;
    card.innerHTML = `
      <div class="card-head">
        <div class="card-title">${escapeHtml(item.title)}</div>
        ${item.status === "Check" ? `<span class="badge warn" title="Some details may be out of date">Needs checking</span>` : ""}
      </div>
      <div class="card-meta">${escapeHtml([item.category, item.format].filter(Boolean).join(" • "))}</div>
      <div class="card-meta">📍 ${escapeHtml(whereLine(item))}</div>
      ${age ? `<div class="card-meta">👶 ${escapeHtml(age)}</div>` : ""}
      ${formatWhen(item) ? `<div class="card-meta">🗓 ${escapeHtml(formatWhen(item))}</div>` : ""}
      ${item.price_text ? `<div class="card-meta">💷 ${escapeHtml(item.price_text)}</div>` : ""}
      ${item.description ? `<p class="card-desc">${escapeHtml(item.description)}</p>` : ""}
      ${hasNotes ? `
        <details class="card-notes">
          <summary>What parents say</summary>
          ${item.pros ? `<p><b>👍</b> ${escapeHtml(item.pros)}</p>` : ""}
          ${item.cons ? `<p><b>👎</b> ${escapeHtml(item.cons)}</p>` : ""}
        </details>` : ""}
      <div class="card-links">
        ${item.website ? `<a href="${escapeHtml(item.website)}" target="_blank" rel="noreferrer">Official page ↗</a>`
                       : `<span class="muted">Community-submitted, no official source</span>`}
        ${item.lat != null ? `<button type="button" class="link-btn" data-id="${escapeHtml(item.id)}">Show on map</button>` : ""}
      </div>
    `;
    container.appendChild(card);
  }
  container.querySelectorAll(".link-btn").forEach((btn) => {
    btn.addEventListener("click", () => showOnMap(btn.dataset.id));
  });
}

function ensureMap() {
  if (map) return;
  map = L.map("map", { zoomControl: true });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  map.setView([state.lat, state.lng], 13);
}

const markerById = new Map();

function renderMarkers() {
  if (!map) return;
  markersLayer.clearLayers();
  markerById.clear();

  const points = [[state.lat, state.lng]];
  L.circleMarker([state.lat, state.lng], { radius: 7, color: "#0b66ff", fillOpacity: 0.9 })
    .bindPopup("<b>Search centre</b>")
    .addTo(markersLayer);

  let online = 0;
  for (const item of state.items) {
    if (item.lat == null || item.lng == null) { online++; continue; }
    const age = formatAge(item.age_min_months, item.age_max_months);
    const popupHtml = `
      <b>${escapeHtml(item.title)}</b>
      ${item.address ? `<div>${escapeHtml(item.address)}${item.postcode ? `, ${escapeHtml(item.postcode)}` : ""}</div>` : ""}
      ${age ? `<div>${escapeHtml(age)}</div>` : ""}
      ${formatWhen(item) ? `<div>${escapeHtml(formatWhen(item))}</div>` : ""}
      <div style="margin-top:6px;">
        ${item.website ? `<a href="${escapeHtml(item.website)}" target="_blank" rel="noreferrer">Official page</a> · ` : ""}
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.lat + "," + item.lng)}" target="_blank" rel="noreferrer">Directions</a>
      </div>
    `;
    const marker = L.marker([item.lat, item.lng]).bindPopup(popupHtml).addTo(markersLayer);
    markerById.set(item.id, marker);
    points.push([item.lat, item.lng]);
  }

  $("mapNote").hidden = online === 0;
  $("mapNote").textContent = `+ ${online} online or without a fixed venue — see the list.`;

  if (points.length > 1) map.fitBounds(L.latLngBounds(points).pad(0.15));
  else map.setView([state.lat, state.lng], 13);
}

function showOnMap(id) {
  setView("map");
  const marker = markerById.get(id);
  if (marker) {
    map.setView(marker.getLatLng(), 15);
    marker.openPopup();
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

init();
