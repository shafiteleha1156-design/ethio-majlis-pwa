import { $, $$, esc } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { go } from '../router.js';
import { getUser } from '../firebase.js';

const ITEMS = [
  { id: 'quran', icon: 'book', key: 'quran' },
  { id: 'dua', icon: 'hands', key: 'dua' },
  { id: 'hajj', icon: 'kaaba', key: 'hajj' },
  { id: 'prayer', icon: 'clock', key: 'prayerTimes' },
  { id: 'qibla', icon: 'compass', key: 'qibla' },
  { id: 'tasbih', icon: 'beads', key: 'tasbih' },
  { id: 'quiz', icon: 'quiz', key: 'quiz' },
  { id: 'live', icon: 'live', key: 'live' },
  { id: 'library', icon: 'library', key: 'library' },
  { id: 'news', icon: 'news', key: 'news' },
  { id: 'profile', icon: 'user', key: 'profile' },
  { id: 'settings', icon: 'settings', key: 'settings' },
  { id: 'about', icon: 'info', key: 'about' },
  { id: 'admin', icon: 'shield', key: 'admin' },
];

export async function MenuView(root) {
  const user = getUser();
  root.innerHTML = `
    <div class="view-pad">
      <button class="card profile-banner" id="profile-banner">
        <span class="avatar">${user?.photo ? `<img src="${esc(user.photo)}" alt=""/>` : icon('user')}</span>
        <div><strong>${esc(user?.name || t('guest'))}</strong><span class="muted small">${esc(user?.email || 'Tap to sign in')}</span></div>
        ${icon('chevron')}
      </button>
      <div class="menu-grid">
        ${ITEMS.map((m) => `<button class="menu-tile" data-id="${m.id}">${icon(m.icon)}<span>${t(m.key)}</span></button>`).join('')}
      </div>
    </div>`;
  $('#profile-banner', root).addEventListener('click', () => go(user ? 'profile' : 'login'));
  $$('.menu-tile', root).forEach((b) => b.addEventListener('click', () => go(b.dataset.id)));
}
