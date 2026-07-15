import { $, $$, esc, empty, toast, debounce } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { LIBRARY } from '../data.js';

const TYPE_ICON = { pdf: 'file', audio: 'headphones', video: 'video' };

export async function LibraryView(root) {
  root.innerHTML = `
    <div class="view-pad">
      <div class="search-bar">${icon('search')}<input id="l-search" class="search-input" placeholder="${t('search')} library…" /></div>
      <div class="tabs" id="tabs">
        <button class="tab active" data-tab="all">All</button>
        <button class="tab" data-tab="Books">Books</button>
        <button class="tab" data-tab="Audio">Audio</button>
        <button class="tab" data-tab="Video">Video</button>
        <button class="tab" data-tab="fav">${t('favorites')}</button>
      </div>
      <div id="lib-list"></div>
    </div>`;

  let tab = 'all', term = '';
  $$('.tab', root).forEach((tb) => tb.addEventListener('click', () => {
    tab = tb.dataset.tab; $$('.tab', root).forEach((x) => x.classList.toggle('active', x === tb)); draw();
  }));
  $('#l-search', root).addEventListener('input', debounce((e) => { term = e.target.value.toLowerCase(); draw(); }, 200));

  function draw() {
    const box = $('#lib-list', root);
    const favs = store.get('favLibrary') || [];
    let items = LIBRARY.map((x, i) => ({ ...x, id: i }));
    if (tab === 'fav') items = items.filter((x) => favs.includes(x.id));
    else if (tab !== 'all') items = items.filter((x) => x.cat === tab);
    if (term) items = items.filter((x) => (x.title + x.author).toLowerCase().includes(term));
    if (!items.length) { box.innerHTML = empty('library', 'Nothing here yet.'); return; }
    box.innerHTML = items.map((x) => {
      const fav = favs.includes(x.id);
      return `<div class="card lib-card" data-id="${x.id}">
        <span class="lib-icon ${x.type}">${icon(TYPE_ICON[x.type] || 'file')}</span>
        <div class="lib-info">
          <strong>${esc(x.title)}</strong>
          <span class="muted small">${esc(x.author)} · ${esc(x.size)}</span>
        </div>
        <div class="row" style="gap:4px">
          <button class="icon-btn sm fav-lib ${fav ? 'active-gold' : ''}" aria-label="Favorite">${icon('star')}</button>
          <button class="icon-btn sm dl-lib" aria-label="${t('download')}">${icon('download')}</button>
        </div>
      </div>`;
    }).join('');
    $$('.lib-card', box).forEach((c) => {
      const id = +c.dataset.id;
      c.querySelector('.fav-lib').addEventListener('click', (e) => {
        const added = store.toggleInArray('favLibrary', id, (a, b) => a === b);
        e.currentTarget.classList.toggle('active-gold', added);
      });
      c.querySelector('.dl-lib').addEventListener('click', () => toast('Download queued (available when file is uploaded)', { icon: 'download' }));
    });
  }
  draw();
}
