// Point this at your deployed Cloudflare Worker, e.g.
// "https://aroundnow-worker-tatjana.<your-subdomain>.workers.dev"
const API_URL = "https://aroundnow-worker-tatjana.aroundnow-tatjana.workers.dev";

const state = {
  lat: 51.5074,
  lng: -0.1278,
  radiusKm: 3,
  categories: new Set(["fun", "culture"]),
  q: "",
  demo: true,
  view: "list",
  items: [],
};

let map, markersLayer;

function $(id) { return document.getElementById(id); }

function init() {
  $("fetchBtn").addEventListener("click", fetchFeed);
  $("applyBtn").addEventListener("click", fetchFeed);
  $("locBtn").addEventListener("click", useMyLocation);
  $("cityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    searchCity($("cityInput").value);
  });
  $("keyword").addEventListener("input", (e) => { state.q = e.target.value; });
  $("demoToggle").addEventListener("change", (e) => { state.demo = e.target.checked; });

  $("categoryChips").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const cat = btn.dataset.cat;
    if (state.categories.has(cat)) {
      state.categories.delete(cat);
      btn.classList.remove("active");
    } else {
      state.categories.add(cat);
      btn.classList.add("active");
    }
  });

  document.querySelectorAll(".radius-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".radius-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.radiusKm = Number(btn.dataset.radius);
    });
  });

  $("listViewBtn").addEventListener("click", () => setView("list"));
  $("mapViewBtn").addEventListener("click", () => setView("map"));

  useMyLocation();
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

function useMyLocation() {
  if (!navigator.geolocation) {
    setPlaceStatus("Showing: London — location isn't available here, search a city instead.", true);
    fetchFeed();
    return;
  }
  setPlaceStatus("Finding your location…");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.lat = pos.coords.latitude;
      state.lng = pos.coords.longitude;
      setPlaceStatus("Showing: near you");
      fetchFeed();
    },
    (err) => {
      console.warn("Location error", err);
      const why = err.code === err.PERMISSION_DENIED ? "location is blocked" : "couldn't get your location";
      setPlaceStatus(`Showing: London — ${why}, search a city instead.`, true);
      fetchFeed();
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
    const qs = new URLSearchParams({ q: query, format: "jsonv2", limit: "1" });
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
    fetchFeed();
  } catch (e) {
    console.warn("Geocode error", e);
    setPlaceStatus("City search failed — check your connection.", true);
  } finally {
    $("cityBtn").disabled = false;
  }
}

async function fetchFeed() {
  $("fetchBtn").textContent = "...";
  try {
    const qs = new URLSearchParams({
      lat: String(state.lat),
      lng: String(state.lng),
      radius_km: String(state.radiusKm),
      categories: [...state.categories].join(","),
    });
    if (state.q.trim()) qs.set("q", state.q.trim());
    if (state.demo) qs.set("demo", "true");

    const res = await fetch(`${API_URL}/v1/feed?${qs.toString()}`);
    const data = await res.json();
    state.items = Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    console.warn("Fetch error", e);
    alert("Could not load events. Check the API URL and your connection.");
    state.items = [];
  } finally {
    $("fetchBtn").textContent = "Fetch";
    renderList();
    if (state.view === "map") renderMarkers();
  }
}

function renderList() {
  const container = $("listItems");
  const empty = $("listEmpty");
  container.innerHTML = "";
  if (!state.items.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  for (const item of state.items) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-title">${escapeHtml(item.title || "")}</div>
      <div class="card-meta">${escapeHtml(item.type || "")} • ${escapeHtml(item.category || "")}</div>
      <div class="card-meta">${escapeHtml(item.venue?.name || "")} • ${item.distance_km ?? "–"} km</div>
    `;
    container.appendChild(card);
  }
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

function renderMarkers() {
  if (!map) return;
  markersLayer.clearLayers();

  const points = [];

  const userMarker = L.marker([state.lat, state.lng]).bindPopup("<b>You are here</b>");
  userMarker.addTo(markersLayer);
  points.push([state.lat, state.lng]);

  for (const item of state.items) {
    const lat = Number(item?.venue?.lat);
    const lng = Number(item?.venue?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const gmUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + "," + lng)}`;
    const popupHtml = `
      <b>${escapeHtml(item.title || "")}</b>
      ${item?.venue?.address ? `<div>${escapeHtml(item.venue.address)}</div>` : ""}
      <div style="margin-top:6px;"><a href="${gmUrl}" target="_blank" rel="noreferrer">Open in Google Maps</a></div>
    `;
    L.marker([lat, lng]).bindPopup(popupHtml).addTo(markersLayer);
    points.push([lat, lng]);
  }

  if (points.length) {
    map.fitBounds(L.latLngBounds(points).pad(0.25));
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

init();
