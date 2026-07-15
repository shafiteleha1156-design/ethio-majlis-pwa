import { $, $$, el, esc, empty, toast, debounce, beep } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { DUAS } from '../data.js';
import { saveUserData } from '../firebase.js';

const CAT_ICON = {
  morning: 'dawn', evening: 'sunset', travel: 'plane', food: 'food', sleeping: 'moon',
  wakeup: 'sun', hajj: 'kaaba', umrah: 'kaaba', ramadan: 'moon', daily: 'star',
};

export async function DuaView(root) {
  root.innerHTML = `
    <div class="view-pad">
      <div class="search-bar">${icon('search')}<input id="d-search" class="search-input" placeholder="${t('search')} dua…" /></div>
      <div class="tabs" id="tabs">
        <button class="tab active" data-tab="all">All</button>
        <button class="tab" data-tab="fav">${t('favorites')}</button>
      </div>
      <div class="cat-chips" id="cat-chips"></div>
      <div id="dua-list"></div>
    </div>`;

  let tab = 'all', cat = 'all', term = '';
  const chips = $('#cat-chips', root);
  chips.innerHTML = `<button class="cat-chip active" data-cat="all">All</button>` +
    DUAS.map((d) => `<button class="cat-chip" data-cat="${d.cat}">${icon(CAT_ICON[d.cat] || 'hands')} ${esc(d.title)}</button>`).join('');
  $$('.cat-chip', chips).forEach((c) => c.addEventListener('click', () => {
    cat = c.dataset.cat; $$('.cat-chip', chips).forEach((x) => x.classList.toggle('active', x === c)); draw();
  }));
  $$('.tab', root).forEach((tb) => tb.addEventListener('click', () => {
    tab = tb.dataset.tab; $$('.tab', root).forEach((x) => x.classList.toggle('active', x === tb)); draw();
  }));
  $('#d-search', root).addEventListener('input', debounce((e) => { term = e.target.value.toLowerCase(); draw(); }, 200));

  function draw() {
    const box = $('#dua-list', root);
    const favs = store.get('favDuas') || [];
    let rows = [];
    DUAS.forEach((group) => {
      if (cat !== 'all' && group.cat !== cat) return;
      group.items.forEach((item, idx) => {
        const id = `${group.cat}:${idx}`;
        if (tab === 'fav' && !favs.includes(id)) return;
        if (term && !(item.en + item.tr + group.title).toLowerCase().includes(term)) return;
        rows.push({ id, group, item });
      });
    });
    if (!rows.length) { box.innerHTML = empty('hands', 'No duas found.'); return; }
    box.innerHTML = rows.map(({ id, group, item }) => {
      const fav = favs.includes(id);
      return `<div class="card dua-card" data-id="${id}">
        <div class="row between">
          <span class="badge">${esc(group.title)}</span>
          <div class="row" style="gap:4px">
            <button class="icon-btn sm play-dua" aria-label="Play">${icon('play')}</button>
            <button class="icon-btn sm fav-dua ${fav ? 'active-gold' : ''}" aria-label="Favorite">${icon('star')}</button>
          </div>
        </div>
        <p class="arabic">${esc(item.ar)}</p>
        <p class="translit muted">${esc(item.tr)}</p>
        <p class="translation">${esc(store.get('lang') === 'am' ? item.am : item.en)}</p>
      </div>`;
    }).join('');
    $$('.dua-card', box).forEach((cardEl) => {
      const id = cardEl.dataset.id;
      cardEl.querySelector('.fav-dua').addEventListener('click', (e) => {
        const added = store.toggleInArray('favDuas', id, (a, b) => a === b);
        e.currentTarget.classList.toggle('active-gold', added);
        toast(added ? 'Added to favorites' : 'Removed', { icon: 'star' });
        saveUserData();
      });
      cardEl.querySelector('.play-dua').addEventListener('click', () => {
        // Chime feedback (no external audio needed offline)
        beep(720, 120); setTimeout(() => beep(560, 160), 140);
        toast('Playing dua tone', { icon: 'play' });
      });
    });
  }

  draw();
}
