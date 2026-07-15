import { $, $$, el, esc, spinner, empty, toast, debounce } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { go } from '../router.js';
import { SURAHS } from '../surahs.js';
import { getSurah, surahAudioUrl } from '../services.js';
import { saveUserData } from '../firebase.js';

const TR_LANGS = [
  { id: 'am', label: 'አማርኛ' },
  { id: 'en', label: 'English' },
  { id: 'om', label: 'Afaan Oromo' },
  { id: 'ar', label: 'Arabic only' },
];

export async function QuranView(root, params) {
  if (params && params[0]) return SurahReader(root, +params[0]);
  return SurahList(root);
}

function SurahList(root) {
  const favs = store.get('favSurahs') || [];
  root.innerHTML = `
    <div class="view-pad">
      <div class="search-bar">
        ${icon('search')}
        <input id="q-search" class="search-input" placeholder="${t('search')} surah…" />
      </div>
      ${store.get('lastRead') ? `<button class="card continue-card mini" id="cont">
        ${icon('book')}<div><strong>${t('continueReading')}</strong><span>${esc(store.get('lastRead').name)} · Ayah ${store.get('lastRead').ayah}</span></div>${icon('chevron')}
      </button>` : ''}
      <div class="tabs" id="tabs">
        <button class="tab active" data-tab="all">All</button>
        <button class="tab" data-tab="fav">${t('favorites')} (${favs.length})</button>
      </div>
      <div id="surah-list" class="surah-list"></div>
    </div>`;

  const listBox = $('#surah-list', root);
  let tab = 'all', term = '';

  function draw() {
    const favs2 = store.get('favSurahs') || [];
    let items = SURAHS.filter((s) =>
      (s.en + ' ' + s.meaning + ' ' + s.number).toLowerCase().includes(term.toLowerCase()));
    if (tab === 'fav') items = items.filter((s) => favs2.includes(s.number));
    if (!items.length) { listBox.innerHTML = empty('book', 'No surahs found.'); return; }
    listBox.innerHTML = items.map((s) => `
      <button class="surah-row" data-num="${s.number}">
        <span class="surah-num"><span>${s.number}</span></span>
        <span class="surah-info">
          <strong>${esc(s.en)}</strong>
          <span class="muted small">${esc(s.meaning)} · ${s.ayahs} ayahs · ${s.type}</span>
        </span>
        <span class="surah-ar arabic">${esc(s.ar)}</span>
      </button>`).join('');
    $$('.surah-row', listBox).forEach((b) => b.addEventListener('click', () => go('quran/' + b.dataset.num)));
  }

  $('#q-search', root).addEventListener('input', debounce((e) => { term = e.target.value; draw(); }, 200));
  $('#cont', root)?.addEventListener('click', () => go('quran/' + store.get('lastRead').surah));
  $$('.tab', root).forEach((tb) => tb.addEventListener('click', () => {
    tab = tb.dataset.tab; $$('.tab', root).forEach((x) => x.classList.toggle('active', x === tb)); draw();
  }));
  draw();
}

async function SurahReader(root, number) {
  const meta = SURAHS.find((s) => s.number === number) || { en: 'Surah', number };
  let lang = store.get('quranLang') || 'am';
  const favs = store.get('favSurahs') || [];

  root.innerHTML = `
    <div class="reader-toolbar">
      <div class="rt-title"><strong>${esc(meta.en)}</strong><span class="muted small">${esc(meta.meaning || '')}</span></div>
      <select class="input compact" id="tr-lang">
        ${TR_LANGS.map((l) => `<option value="${l.id}" ${l.id === lang ? 'selected' : ''}>${l.label}</option>`).join('')}
      </select>
      <button class="icon-btn ${favs.includes(number) ? 'active-gold' : ''}" id="fav-btn" aria-label="Favorite">${icon('star')}</button>
    </div>
    <div class="audio-player" id="audio-bar">
      <button class="icon-btn" id="play-btn" aria-label="Play recitation">${icon('play')}</button>
      <div class="ap-info"><strong>Full Surah Audio</strong><span class="muted small">Mishary Alafasy</span></div>
      <audio id="audio" preload="none" src="${surahAudioUrl(number)}"></audio>
    </div>
    <div class="view-pad" id="ayahs">${spinner()}</div>`;

  const audio = $('#audio', root);
  const playBtn = $('#play-btn', root);
  playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play().then(() => { playBtn.innerHTML = icon('pause'); }).catch(() => toast('Audio unavailable offline')); }
    else { audio.pause(); playBtn.innerHTML = icon('play'); }
  });
  audio.addEventListener('ended', () => { playBtn.innerHTML = icon('play'); });

  $('#fav-btn', root).addEventListener('click', (e) => {
    const added = store.toggleInArray('favSurahs', number, (a, b) => a === b);
    e.currentTarget.classList.toggle('active-gold', added);
    toast(added ? 'Added to favorites' : 'Removed from favorites', { icon: added ? 'star' : 'info' });
    saveUserData();
  });

  $('#tr-lang', root).addEventListener('change', (e) => {
    lang = e.target.value; store.set({ quranLang: lang }); load();
  });

  async function load() {
    const box = $('#ayahs', root);
    box.innerHTML = spinner();
    try {
      const data = await getSurah(number, lang);
      const bism = number !== 1 && number !== 9
        ? `<p class="arabic bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>` : '';
      box.innerHTML = bism + data.ayahs.map((a) => ayahHtml(number, meta.en, a, lang)).join('');
      wireAyahs(box, number, meta.en);
      // mark last read
      store.set({ lastRead: { surah: number, ayah: 1, name: meta.en } });
      saveUserData();
    } catch {
      box.innerHTML = empty('book', 'Surah unavailable offline. Connect once to cache it.');
    }
  }

  function ayahHtml(surah, name, a, lang) {
    const bm = (store.get('bookmarks') || []).some((x) => x.surah === surah && x.ayah === a.number);
    return `<div class="ayah" data-ayah="${a.number}">
      <div class="ayah-head">
        <span class="ayah-num">${a.number}</span>
        <div class="ayah-actions">
          <button class="icon-btn sm bm-btn ${bm ? 'active-gold' : ''}" aria-label="Bookmark">${icon('bookmark')}</button>
          <button class="icon-btn sm share-btn" aria-label="Share">${icon('share')}</button>
        </div>
      </div>
      <p class="arabic ayah-ar">${esc(a.ar)}</p>
      ${lang !== 'ar' ? `<p class="ayah-tr">${esc(a.tr)}${lang === 'om' ? ' <em class="muted small">(English shown; Afaan Oromo coming soon)</em>' : ''}</p>` : ''}
    </div>`;
  }

  function wireAyahs(box, surah, name) {
    $$('.ayah', box).forEach((node) => {
      const num = +node.dataset.ayah;
      node.querySelector('.bm-btn').addEventListener('click', (e) => {
        const added = store.toggleInArray('bookmarks', { surah, ayah: num, name },
          (a, b) => a.surah === b.surah && a.ayah === b.ayah);
        e.currentTarget.classList.toggle('active-gold', added);
        store.set({ lastRead: { surah, ayah: num, name } });
        toast(added ? 'Bookmarked' : 'Bookmark removed', { icon: 'bookmark' });
        saveUserData();
      });
      node.querySelector('.share-btn').addEventListener('click', async () => {
        const text = `${name} ${surah}:${num}\n${node.querySelector('.ayah-ar').textContent}`;
        if (navigator.share) { try { await navigator.share({ text }); } catch {} }
        else { await navigator.clipboard?.writeText(text); toast('Copied to clipboard', { icon: 'check' }); }
      });
    });
  }

  load();
}
