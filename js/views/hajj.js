import { $, $$, esc, toast } from '../utils.js';
import { icon } from '../icons.js';
import { store } from '../store.js';
import { HAJJ_STEPS, HAJJ_CHECKLIST, HAJJ_FAQ } from '../data.js';

export async function HajjView(root) {
  const checked = store.get('hajjChecklist') || [];
  root.innerHTML = `
    <div class="view-pad">
      <div class="hero-card">
        <img src="/public/images/kaaba-hero.png" alt="Kaaba" class="hero-card-img" loading="lazy"/>
        <div class="hero-card-overlay"><h2>Hajj &amp; Umrah Guide</h2><p>Your complete step-by-step companion</p></div>
      </div>

      <div class="tabs" id="tabs">
        <button class="tab active" data-tab="steps">Steps</button>
        <button class="tab" data-tab="checklist">Checklist</button>
        <button class="tab" data-tab="faq">FAQ</button>
        <button class="tab" data-tab="map">Map</button>
      </div>
      <div id="hajj-body"></div>
    </div>`;

  let tab = 'steps';
  $$('.tab', root).forEach((tb) => tb.addEventListener('click', () => {
    tab = tb.dataset.tab; $$('.tab', root).forEach((x) => x.classList.toggle('active', x === tb)); draw();
  }));

  function draw() {
    const box = $('#hajj-body', root);
    if (tab === 'steps') {
      box.innerHTML = `<div class="timeline">${HAJJ_STEPS.map((s) => `
        <div class="tl-item">
          <div class="tl-dot">${s.n}</div>
          <div class="card tl-card">
            <strong>${esc(s.title)}</strong>
            <p class="translation">${esc(s.en)}</p>
            <p class="muted small">${esc(s.am)}</p>
          </div>
        </div>`).join('')}</div>`;
    } else if (tab === 'checklist') {
      const checked2 = store.get('hajjChecklist') || [];
      box.innerHTML = `<div class="card">${HAJJ_CHECKLIST.map((item, i) => `
        <label class="check-row">
          <input type="checkbox" data-i="${i}" ${checked2.includes(i) ? 'checked' : ''}>
          <span>${esc(item)}</span>
        </label>`).join('')}</div>`;
      $$('input[type=checkbox]', box).forEach((c) => c.addEventListener('change', (e) => {
        store.toggleInArray('hajjChecklist', +e.target.dataset.i, (a, b) => a === b);
      }));
    } else if (tab === 'faq') {
      box.innerHTML = HAJJ_FAQ.map((f) => `
        <details class="card faq-item"><summary>${esc(f.q)}</summary><p class="translation">${esc(f.a)}</p></details>`).join('');
    } else {
      box.innerHTML = `<div class="card"><iframe class="map-frame" title="Mecca map" loading="lazy"
        src="https://www.openstreetmap.org/export/embed.html?bbox=39.80%2C21.40%2C39.85%2C21.44&layer=mapnik&marker=21.4225%2C39.8262"></iframe>
        <p class="muted small" style="margin-top:8px">Masjid al-Haram, Mecca — the destination of Hajj &amp; Umrah.</p></div>`;
    }
  }
  draw();
}
