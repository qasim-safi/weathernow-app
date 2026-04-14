/* ============================================================
   WeatherNow | script.js
   Demo mode: shows pre-loaded city data (no API key needed).
   Live mode: set API_KEY below and DEMO_MODE = false.
   Free API key: https://openweathermap.org/api
   ============================================================ */

const API_KEY   = 'YOUR_API_KEY_HERE';   // ← paste your key here
const DEMO_MODE = true;                  // ← set false after adding key

let currentUnit = 'C';
let currentData  = null;
let lastCategory = '';
let debounceTimer;

/* ── Demo data for popular cities ─────────────────────────── */
const DEMO = {
  karachi:  { city:'Karachi',  country:'Pakistan',       code:'PK', temp:34, feels:38, desc:'Hazy sunshine',    icon:'🌤️', hum:'62%',  wind:'18 km/h', vis:'8 km',  pres:'1010 hPa', sr:'05:52 AM', ss:'06:38 PM', fc:[{d:'Mon',i:'☀️',h:35,l:28},{d:'Tue',i:'🌤️',h:33,l:27},{d:'Wed',i:'⛅',h:31,l:26},{d:'Thu',i:'🌧️',h:29,l:25},{d:'Fri',i:'🌤️',h:32,l:27}] },
  lahore:   { city:'Lahore',   country:'Pakistan',       code:'PK', temp:31, feels:35, desc:'Partly cloudy',    icon:'⛅', hum:'55%',  wind:'12 km/h', vis:'10 km', pres:'1008 hPa', sr:'05:48 AM', ss:'06:45 PM', fc:[{d:'Mon',i:'⛅',h:32,l:24},{d:'Tue',i:'☀️',h:34,l:25},{d:'Wed',i:'☀️',h:36,l:26},{d:'Thu',i:'⛅',h:33,l:24},{d:'Fri',i:'🌧️',h:28,l:22}] },
  london:   { city:'London',   country:'United Kingdom', code:'GB', temp:12, feels:10, desc:'Overcast clouds',  icon:'☁️', hum:'78%',  wind:'22 km/h', vis:'6 km',  pres:'1015 hPa', sr:'06:10 AM', ss:'07:55 PM', fc:[{d:'Mon',i:'🌧️',h:11,l:7},{d:'Tue',i:'☁️',h:13,l:8},{d:'Wed',i:'⛅',h:15,l:9},{d:'Thu',i:'☀️',h:16,l:10},{d:'Fri',i:'⛅',h:14,l:9}] },
  'new york':{ city:'New York', country:'United States', code:'US', temp:18, feels:17, desc:'Clear sky',        icon:'☀️', hum:'48%',  wind:'14 km/h', vis:'16 km', pres:'1022 hPa', sr:'06:28 AM', ss:'07:38 PM', fc:[{d:'Mon',i:'☀️',h:20,l:14},{d:'Tue',i:'⛅',h:22,l:16},{d:'Wed',i:'🌧️',h:17,l:13},{d:'Thu',i:'⛅',h:19,l:14},{d:'Fri',i:'☀️',h:21,l:15}] },
  tokyo:    { city:'Tokyo',    country:'Japan',          code:'JP', temp:22, feels:22, desc:'Scattered clouds', icon:'⛅', hum:'66%',  wind:'10 km/h', vis:'12 km', pres:'1018 hPa', sr:'05:30 AM', ss:'06:20 PM', fc:[{d:'Mon',i:'⛅',h:24,l:18},{d:'Tue',i:'☀️',h:25,l:19},{d:'Wed',i:'☀️',h:26,l:20},{d:'Thu',i:'🌦️',h:22,l:17},{d:'Fri',i:'🌧️',h:20,l:16}] },
  dubai:    { city:'Dubai',    country:'UAE',            code:'AE', temp:40, feels:44, desc:'Hot and hazy',     icon:'🌫️', hum:'38%',  wind:'16 km/h', vis:'5 km',  pres:'1003 hPa', sr:'05:55 AM', ss:'06:50 PM', fc:[{d:'Mon',i:'☀️',h:41,l:30},{d:'Tue',i:'☀️',h:42,l:31},{d:'Wed',i:'☀️',h:42,l:32},{d:'Thu',i:'🌫️',h:39,l:29},{d:'Fri',i:'☀️',h:40,l:30}] },
};

/* ── Helpers ─────────────────────────────────────────────── */
function toF(c)   { return Math.round(c * 9/5 + 32); }
function fmtTemp(c){ return currentUnit === 'C' ? `${c}°C` : `${toF(c)}°F`; }
function now()    { return new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); }

function show(id)  { document.getElementById(id).classList.remove('hidden'); }
function hide(id)  { document.getElementById(id).classList.add('hidden'); }
function setText(id, val){ document.getElementById(id).textContent = val; }

/* ── Unit toggle ─────────────────────────────────────────── */
function setUnit(u) {
  currentUnit = u;
  document.getElementById('btn-c').classList.toggle('active', u === 'C');
  document.getElementById('btn-f').classList.toggle('active', u === 'F');
  document.getElementById('btn-c').setAttribute('aria-pressed', u === 'C');
  document.getElementById('btn-f').setAttribute('aria-pressed', u === 'F');
  if (currentData) renderData(currentData);
}

/* ── Search ──────────────────────────────────────────────── */
function doSearch() {
  const q = document.getElementById('cityInput').value.trim();
  if (!q) return;
  hide('dropdownList');
  if (DEMO_MODE) loadDemo(q);
  else           fetchLive(q);
}

function quickCity(name) {
  document.getElementById('cityInput').value = name;
  doSearch();
}

function onInputChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const q = document.getElementById('cityInput').value.trim().toLowerCase();
    if (!q) { hide('dropdownList'); return; }
    const matches = Object.values(DEMO).filter(d => d.city.toLowerCase().startsWith(q));
    const list = document.getElementById('dropdownList');
    if (!matches.length) { hide('dropdownList'); return; }
    list.innerHTML = matches.map(d =>
      `<li onclick="quickCity('${d.city}')">${d.city}, ${d.country}</li>`
    ).join('');
    show('dropdownList');
  }, 250);
}

/* ── Demo mode ────────────────────────────────────────────── */
function loadDemo(q) {
  const key = q.toLowerCase().trim();
  const data = DEMO[key];
  if (!data) {
    showError(`City "${q}" not found in demo. Try: Karachi, Lahore, London, New York, Tokyo, Dubai.`);
    return;
  }
  currentData = data;
  renderData(data);
}

/* ── Live API mode ───────────────────────────────────────── */
async function fetchLive(city) {
  hide('mainCard'); hide('forecastCard'); hide('alertBox');
  show('loadingBox');
  try {
    const base = 'https://api.openweathermap.org/data/2.5';
    const [wr, fr] = await Promise.all([
      fetch(`${base}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`).then(r=>r.json()),
      fetch(`${base}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`).then(r=>r.json()),
    ]);
    if (wr.cod !== 200) { showError(wr.message || 'City not found.'); return; }
    const d = {
      city:    wr.name,
      country: wr.sys.country,
      code:    wr.sys.country,
      temp:    Math.round(wr.main.temp),
      feels:   Math.round(wr.main.feels_like),
      desc:    wr.weather[0].description,
      icon:    mapIcon(wr.weather[0].icon),
      hum:     `${wr.main.humidity}%`,
      wind:    `${Math.round(wr.wind.speed * 3.6)} km/h`,
      vis:     `${(wr.visibility/1000).toFixed(1)} km`,
      pres:    `${wr.main.pressure} hPa`,
      sr:      fmtTime(wr.sys.sunrise, wr.timezone),
      ss:      fmtTime(wr.sys.sunset,  wr.timezone),
      fc:      buildForecast(fr.list),
    };
    currentData = d;
    renderData(d);
  } catch(e) { showError('Network error. Check your connection.'); }
  finally    { hide('loadingBox'); }
}

function mapIcon(code) {
  const m = {
    '01d':'☀️','01n':'🌙','02d':'⛅','02n':'🌥️',
    '03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️',
    '09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
    '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️',
    '50d':'🌫️','50n':'🌫️',
  };
  return m[code] || '🌡️';
}

function fmtTime(unix, tz) {
  const d = new Date((unix + tz) * 1000);
  return d.toUTCString().slice(17, 22);
}

function buildForecast(list) {
  const days = {};
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) days[date] = { temps:[], icons:[] };
    days[date].temps.push(item.main.temp);
    days[date].icons.push(item.weather[0].icon);
  });
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return Object.entries(days).slice(0,5).map(([date, v]) => ({
    d: dayNames[new Date(date).getDay()],
    i: mapIcon(v.icons[Math.floor(v.icons.length/2)]),
    h: Math.round(Math.max(...v.temps)),
    l: Math.round(Math.min(...v.temps)),
  }));
}

/* ── Render ─────────────────────────────────────────────── */
function renderData(d) {
  hide('loadingBox'); hide('alertBox');

  setText('cityName',    d.city);
  setText('countryName', `${d.country} ${flagEmoji(d.code)}`);
  setText('dateTime',    now());
  document.getElementById('weatherIcon').textContent = d.icon;
  setText('weatherDesc', d.desc);
  setText('tempVal',     currentUnit === 'C' ? d.temp : toF(d.temp));
  setText('tempUnit',    currentUnit === 'C' ? '°C' : '°F');
  setText('feelsLike',   fmtTemp(d.feels));
  setText('humidity',    d.hum);
  setText('windSpeed',   d.wind);
  setText('visibility',  d.vis);
  setText('pressure',    d.pres);
  setText('sunrise',     d.sr);
  setText('sunset',      d.ss);

  // Forecast
  const strip = document.getElementById('forecastStrip');
  strip.innerHTML = d.fc.map(f => `
    <div class="fc-day" role="listitem">
      <div class="fc-day-name">${f.d}</div>
      <div class="fc-icon">${f.i}</div>
      <div class="fc-high">${currentUnit==='C' ? f.h : toF(f.h)}°</div>
      <div class="fc-low">${currentUnit==='C' ? f.l : toF(f.l)}°</div>
    </div>`).join('');

  show('mainCard'); show('forecastCard');
  // Show/hide API notice
  document.getElementById('apiNotice').style.display = DEMO_MODE ? 'flex' : 'none';
}

function flagEmoji(code) {
  if (!code || code.length !== 2) return '';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E0 + c.charCodeAt(0) - 65));
}

function showError(msg) {
  hide('loadingBox'); hide('mainCard'); hide('forecastCard');
  document.getElementById('alertBox').textContent = msg;
  show('alertBox');
}

/* ── Geolocation ─────────────────────────────────────────── */
function getGeo() {
  if (!navigator.geolocation) { showError('Geolocation not supported by your browser.'); return; }
  hide('alertBox');
  show('loadingBox');
  navigator.geolocation.getCurrentPosition(
    pos => {
      if (DEMO_MODE) {
        hide('loadingBox');
        loadDemo('karachi'); // default demo city for geolocation
        document.getElementById('cityName').textContent += ' (Your Area)';
      } else {
        const { latitude, longitude } = pos.coords;
        fetchByCoords(latitude, longitude);
      }
    },
    err => { hide('loadingBox'); showError('Could not get your location.'); }
  );
}

async function fetchByCoords(lat, lon) {
  try {
    const r = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    ).then(r => r.json());
    if (r.name) {
      document.getElementById('cityInput').value = r.name;
      fetchLive(r.name);
    }
  } catch { showError('Could not fetch weather for your location.'); }
}

/* ── Init ────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Auto-load a demo city on startup
  loadDemo('karachi');

  // Close dropdown on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-bar')) hide('dropdownList');
  });
});
