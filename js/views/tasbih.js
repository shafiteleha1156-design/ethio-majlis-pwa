import { $, $$, el, esc, vibrate, beep, toast } from '../utils.js';
import { icon } from '../icons.js';
import { store } from '../store.js';
import { DHIKR } from '../data.js';

export async function TasbihView(root) {
  let selected = 0;
  let count = 0;
  let target = DHIKR[0].target;

  root.innerHTML = `
    <div class="view-pad center-col">
      <div class="dhikr-select" id="dhikr-select"></div>

      <div class="tasbih-counter">
        <svg class="ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" class="ring-bg"/>
          <circle cx="60" cy="60" r="54" class="ring-fg" id="ring-fg"/>
        </svg>
        <button class="count-btn" id="count-btn" aria-label="Count">
          <span class="count-num" id="count-num">0</span>
          <span class="count-target" id="count-target">/ ${target}</span>
        </button>
      </div>

      <p class="arabic" id="dhikr-ar" style="text-align:center">${esc(DHIKR[0].ar)}</p>
      <p class="muted" id="dhikr-tr" style="text-align:center">${esc(DHIKR[0].tr)}</p>

      <div class="row" style="gap:12px;margin-top:16px">
        <button class="btn btn-ghost" id="reset-btn">${icon('reset')} Reset</button>
        <button class="btn btn-ghost" id="add-btn">${icon('plus')} Custom</button>
      </div>

      <div class="row" style="gap:20px;margin-top:16px">
        <label class="row" style="gap:6px"><input type="checkbox" id="sound" ${store.get('tasbihSound') ? 'checked' : ''}> Sound</label>
        <label class="row" style="gap:6px"><input type="checkbox" id="vibr" ${store.get('tasbihVibrate') ? 'checked' : ''}> Vibrate</label>
      </div>

      <div class="section-head" style="margin-top:24px;width:100%"><h2>History</h2></div>
      <div id="history" style="width:100%"></div>
    </div>
  `;

  const chips = $('#dhikr-select', root);
  const custom = store.get('customDhikr') || [];
  const all = [...DHIKR, ...custom];
  all.forEach((d, i) => {
    const c = el(`<button class="dhikr-chip ${i === 0 ? 'active' : ''}">${esc(d.tr)}</button>`);
    c.addEventListener('click', () => { selectDhikr(i); });
    chips.appendChild(c);
  });

  function selectDhikr(i) {
    selected = i; count = 0; target = all[i].target;
    $$('.dhikr-chip', root).forEach((c, idx) => c.classList.toggle('active', idx === i));
    $('#dhikr-ar', root).textContent = all[i].ar;
    $('#dhikr-tr', root).textContent = all[i].tr;
    $('#count-target', root).textContent = '/ ' + target;
    updateUI();
  }

  function updateUI() {
    $('#count-num', root).textContent = count;
    const ring = $('#ring-fg', root);
    const circ = 2 * Math.PI * 54;
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ * (1 - Math.min(count / target, 1));
  }

  $('#count-btn', root).addEventListener('click', () => {
    count++;
    if (store.get('tasbihVibrate')) vibrate(20);
    if (store.get('tasbihSound')) beep(660, 60);
    if (count === target) {
      if (store.get('tasbihVibrate')) vibrate([60, 40, 60]);
      if (store.get('tasbihSound')) beep(880, 160);
      saveHistory(all[selected].tr, count);
      toast('Target reached! ' + all[selected].tr, { icon: 'check' });
    }
    updateUI();
  });

  $('#reset-btn', root).addEventListener('click', () => {
    if (count > 0) saveHistory(all[selected].tr, count);
    count = 0; updateUI();
  });

  $('#add-btn', root).addEventListener('click', () => {
    const tr = prompt('Dhikr name (transliteration):');
    if (!tr) return;
    const ar = prompt('Arabic text (optional):') || tr;
    const tgt = parseInt(prompt('Target count:', '33'), 10) || 33;
    const cs = [...(store.get('customDhikr') || []), { ar, tr, target: tgt }];
    store.set({ customDhikr: cs });
    toast('Custom dhikr added — reopening', { icon: 'check' });
    TasbihView(root);
  });

  $('#sound', root).addEventListener('change', (e) => store.set({ tasbihSound: e.target.checked }));
  $('#vibr', root).addEventListener('change', (e) => store.set({ tasbihVibrate: e.target.checked }));

  function saveHistory(dhikr, c) {
    const h = [{ dhikr, count: c, ts: Date.now() }, ...(store.get('tasbihHistory') || [])].slice(0, 30);
    store.set({ tasbihHistory: h });
    renderHistory();
  }

  function renderHistory() {
    const box = $('#history', root);
    const h = store.get('tasbihHistory') || [];
    if (!h.length) { box.innerHTML = `<p class="muted" style="text-align:center">No history yet.</p>`; return; }
    box.innerHTML = h.map((x) => `<div class="hist-row card"><span>${esc(x.dhikr)}</span><strong>${x.count}</strong><span class="muted small">${new Date(x.ts).toLocaleDateString()}</span></div>`).join('');
  }

  updateUI();
  renderHistory();
}
