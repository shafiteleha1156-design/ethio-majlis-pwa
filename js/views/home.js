import { $, el, esc, fmtTime12, spinner } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { go } from '../router.js';
import { getHijriDate, getPrayerTimes, getPosition } from '../services.js';
import { VERSES, HADITHS, QUOTES, QUICK_MENU } from '../data.js';
import { getUser } from '../firebase.js';

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return t('greetingMorning');
  if (h < 18) return t('greetingAfternoon');
  return t('greetingEvening');
}

function pickDaily(arr) {
  const day = Math.floor(Date.now() / 86400000);
  return arr[day % arr.length];
}

export async function HomeView(root) {
  const verse = pickDaily(VERSES);
  const hadith = pickDaily(HADITHS);
  const quote = pickDaily(QUOTES);
  const user = getUser();
  const displayName = user?.name || user?.email?.split('@')[0] || t('guest');

  root.innerHTML = `
    <section class="hero fade-in">
      <img src="/public/images/kaaba-hero.png" alt="The Holy Kaaba in Mecca" class="hero-img" loading="eager" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-greet">${esc(greeting())}, ${esc(displayName)}</p>
        <p class="hero-hijri" id="hijri">${spinner()}</p>
        <div class="hero-next glass" id="next-prayer">
          <div class="np-label">${t('nextPrayer')}</div>
          <div class="np-name" id="np-name">—</div>
          <div class="np-count" id="np-count">--:--:--</div>
        </div>
      </div>
    </section>

    <section class="section fade-in-up">
      <div class="prayer-strip" id="prayer-strip">${spinner()}</div>
    </section>

    <section class="section fade-in-up">
      <div class="section-head"><h2>${t('quickMenu')}</h2></div>
      <div class="quick-grid" id="quick-grid"></div>
    </section>

    <section class="section fade-in-up">
      <div class="card content-card verse-card">
        <div class="cc-head"><span class="badge gold">${t('verseOfDay')}</span><span class="cc-ref">${esc(verse.ref)}</span></div>
        <p class="arabic lg">${esc(verse.ar)}</p>
        <p class="translation">${esc(store.get('lang') === 'am' ? verse.am : verse.en)}</p>
      </div>
    </section>

    <section class="section fade-in-up">
      <div class="card content-card">
        <div class="cc-head"><span class="badge">${t('hadithOfDay')}</span><span class="cc-ref">${esc(hadith.ref)}</span></div>
        <p class="translation">"${esc(store.get('lang') === 'am' ? hadith.am : hadith.en)}"</p>
      </div>
    </section>

    <section class="section fade-in-up">
      <div class="card content-card quote-card">
        ${icon('quote')}
        <p class="quote-text">"${esc(quote.text)}"</p>
        <p class="quote-by">— ${esc(quote.by)}</p>
      </div>
    </section>

    ${store.get('lastRead') ? `
    <section class="section fade-in-up">
      <div class="section-head"><h2>${t('continueReading')}</h2></div>
      <button class="card continue-card" id="continue-btn">
        ${icon('book')}
        <div>
          <strong>${esc(store.get('lastRead').name)}</strong>
          <span>${t('quran')} · Ayah ${store.get('lastRead').ayah}</span>
        </div>
        ${icon('chevron')}
      </button>
    </section>` : ''}

    <div style="height:8px"></div>
  `;

  // Quick menu
  const grid = $('#quick-grid', root);
  QUICK_MENU.forEach((m) => {
    const b = el(`<button class="quick-card" aria-label="${t(m.labelKey)}">
      <span class="qc-icon">${icon(m.icon)}</span>
      <span class="qc-label">${t(m.labelKey)}</span>
    </button>`);
    b.addEventListener('click', () => go(m.id));
    grid.appendChild(b);
  });

  $('#continue-btn', root)?.addEventListener('click', () => {
    const lr = store.get('lastRead');
    if (lr) go('quran/' + lr.surah);
  });

  // Hijri date
  getHijriDate().then((h) => { const n = $('#hijri', root); if (n) n.textContent = h.text; });

  // Prayer times + countdown
  let timer;
  loadPrayer(root).then((res) => {
    if (!res) return;
    const update = () => renderCountdown(root, res.timings);
    update();
    timer = setInterval(update, 1000);
  });

  return { cleanup: () => clearInterval(timer) };
}

async function loadPrayer(root) {
  let loc = store.get('city');
  try {
    if (!loc) {
      const pos = await getPosition();
      loc = { name: 'Current Location', ...pos };
      store.set({ city: loc });
    }
  } catch {
    loc = loc || { name: 'Mecca', lat: 21.4225, lng: 39.8262 };
    store.set({ city: loc });
  }
  try {
    const timings = await getPrayerTimes(loc);
    const strip = $('#prayer-strip', root);
    if (strip) {
      strip.innerHTML = PRAYERS.map((p) => `
        <div class="pill-prayer">
          <span class="pp-name">${p}</span>
          <span class="pp-time">${fmtTime12(timings[p])}</span>
        </div>`).join('');
    }
    return { timings, loc };
  } catch {
    const strip = $('#prayer-strip', root);
    if (strip) strip.innerHTML = `<p class="muted">Prayer times unavailable offline.</p>`;
    return null;
  }
}

function renderCountdown(root, timings) {
  const now = new Date();
  const items = PRAYERS.map((p) => {
    const [h, m] = timings[p].split(':').map(Number);
    const d = new Date(now); d.setHours(h, m, 0, 0);
    return { name: p, date: d };
  });
  let next = items.find((i) => i.date > now);
  if (!next) { next = { ...items[0], date: new Date(items[0].date.getTime() + 86400000) }; }
  const diff = next.date - now;
  const hh = Math.floor(diff / 3600000);
  const mm = Math.floor((diff % 3600000) / 60000);
  const ss = Math.floor((diff % 60000) / 1000);
  const nameN = $('#np-name', root); const countN = $('#np-count', root);
  if (nameN) nameN.textContent = next.name;
  if (countN) countN.textContent =
    `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}
