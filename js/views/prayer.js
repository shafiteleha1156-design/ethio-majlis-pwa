import { $, $$, el, esc, fmtTime12, spinner, toast } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { getPrayerTimes, getPosition, getHijriDate } from '../services.js';

const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const METHODS = [
  { id: 2, name: 'ISNA (North America)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm al-Qura, Makkah' },
  { id: 5, name: 'Egyptian Authority' },
  { id: 1, name: 'University of Karachi' },
];

export async function PrayerView(root) {
  root.innerHTML = `
    <div class="view-pad">
      <div class="card location-card">
        <div class="row between">
          <div class="row" style="gap:8px">${icon('pin')}<span id="loc-name">${esc(store.get('city')?.name || 'Detecting…')}</span></div>
          <button class="btn-chip" id="detect-btn">${icon('gps')} Auto</button>
        </div>
        <form id="city-form" class="row" style="gap:8px;margin-top:12px">
          <input class="input" id="city-input" placeholder="Enter city (e.g. Addis Ababa)" />
          <button class="btn btn-primary" type="submit">Set</button>
        </form>
      </div>

      <div class="card" style="margin-top:16px">
        <label class="field-label">Calculation Method</label>
        <select class="input" id="method-select">
          ${METHODS.map((m) => `<option value="${m.id}" ${store.get('calcMethod') === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
        </select>
      </div>

      <div id="times" style="margin-top:16px">${spinner()}</div>

      <div class="card" style="margin-top:16px">
        <div class="row between">
          <div class="row" style="gap:8px">${icon('bell')}<span>${t('notifications')}</span></div>
          <label class="switch"><input type="checkbox" id="notif-toggle" ${store.get('notifications') ? 'checked' : ''}><span class="slider"></span></label>
        </div>
      </div>

      <div class="section-head" style="margin-top:20px"><h2>Monthly Calendar</h2></div>
      <div id="calendar" class="card">${spinner()}</div>
    </div>
  `;

  const load = async () => {
    const box = $('#times', root);
    box.innerHTML = spinner();
    let loc = store.get('city');
    try {
      if (!loc) { const pos = await getPosition(); loc = { name: 'Current Location', ...pos }; store.set({ city: loc }); }
      const timings = await getPrayerTimes(loc);
      const now = new Date();
      const next = nextPrayer(timings, now);
      box.innerHTML = `<div class="prayer-list">${PRAYERS.map((p) => `
        <div class="prayer-row ${p === next ? 'active' : ''}">
          <span class="pr-icon">${icon(prayerIcon(p))}</span>
          <span class="pr-name">${p}</span>
          <span class="pr-time">${fmtTime12(timings[p])}</span>
          ${p === next ? `<span class="badge gold">${t('nextPrayer')}</span>` : ''}
        </div>`).join('')}</div>`;
      $('#loc-name', root).textContent = loc.name;
      renderCalendar(root, loc);
    } catch {
      box.innerHTML = `<p class="muted" style="padding:16px">Unable to load prayer times. Check your connection.</p>`;
    }
  };

  $('#detect-btn', root).addEventListener('click', async () => {
    try {
      const pos = await getPosition();
      store.set({ city: { name: 'Current Location', ...pos } });
      toast('Location updated', { icon: 'check' });
      load();
    } catch { toast('Location permission denied'); }
  });

  $('#city-form', root).addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = $('#city-input', root).value.trim();
    if (!q) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!data.length) { toast('City not found'); return; }
      store.set({ city: { name: data[0].display_name.split(',')[0], lat: +data[0].lat, lng: +data[0].lon } });
      toast('City set', { icon: 'check' });
      load();
    } catch { toast('Search failed offline'); }
  });

  $('#method-select', root).addEventListener('change', (e) => {
    store.set({ calcMethod: +e.target.value }); load();
  });
  $('#notif-toggle', root).addEventListener('change', (e) => {
    store.set({ notifications: e.target.checked });
    if (e.target.checked && 'Notification' in window) Notification.requestPermission();
  });

  load();
}

function prayerIcon(p) {
  return { Fajr: 'dawn', Sunrise: 'sun', Dhuhr: 'sun', Asr: 'sun', Maghrib: 'sunset', Isha: 'moon' }[p] || 'clock';
}

function nextPrayer(timings, now) {
  const main = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  for (const p of main) {
    const [h, m] = timings[p].split(':').map(Number);
    const d = new Date(now); d.setHours(h, m, 0, 0);
    if (d > now) return p;
  }
  return 'Fajr';
}

async function renderCalendar(root, loc) {
  const box = $('#calendar', root);
  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  try {
    const rows = [];
    for (let d = 1; d <= days; d++) {
      rows.push(`<div class="cal-row ${d === now.getDate() ? 'today' : ''}"><span>${d}</span></div>`);
    }
    box.innerHTML = `<p class="muted" style="margin-bottom:8px">${now.toLocaleString('default',{month:'long'})} ${now.getFullYear()} — tap a day in Prayer view to view details</p>
      <div class="cal-grid">${rows.join('')}</div>`;
  } catch { box.innerHTML = ''; }
}
