// Hash-based router + app shell (header + bottom navigation).
import { $, el } from './utils.js';
import { icon } from './icons.js';
import { t } from './i18n.js';

const routes = {};
let current = null;

export function register(name, factory) { routes[name] = factory; }

const NAV = [
  { id: 'home', icon: 'home', key: 'home' },
  { id: 'quran', icon: 'quran', key: 'quran' },
  { id: 'prayer', icon: 'clock', key: 'prayerTimes' },
  { id: 'dua', icon: 'hands', key: 'dua' },
  { id: 'menu', icon: 'grid', key: 'menu' },
];

export function parseHash() {
  const h = location.hash.replace(/^#\/?/, '') || 'home';
  const [name, ...rest] = h.split('/');
  return { name: name || 'home', params: rest };
}

export function go(path) {
  location.hash = '#/' + path;
}

function shell(viewName) {
  const showNav = !['login', 'splash'].includes(viewName);
  return `
    ${headerFor(viewName)}
    <main id="view-outlet"></main>
    ${showNav ? bottomNav(viewName) : ''}
  `;
}

const TITLES = {
  home: 'Ethio-Majlis', quran: 'quran', dua: 'dua', prayer: 'prayerTimes',
  qibla: 'qibla', tasbih: 'tasbih', quiz: 'quiz', live: 'live', library: 'library',
  news: 'news', settings: 'settings', hajj: 'hajj', profile: 'profile',
  about: 'about', admin: 'admin', menu: 'menu',
};

function headerFor(viewName) {
  if (viewName === 'home') {
    return `<header class="app-header">
      <img class="h-logo" src="/public/icons/logo.png" alt="Ethio-Majlis" />
      <h1>Ethio-Majlis</h1>
      <button class="icon-btn" data-nav="news" aria-label="News">${icon('bell')}</button>
      <button class="icon-btn" data-nav="profile" aria-label="Profile">${icon('user')}</button>
    </header>`;
  }
  const title = TITLES[viewName] ? (TITLES[viewName] === 'Ethio-Majlis' ? 'Ethio-Majlis' : t(TITLES[viewName])) : viewName;
  return `<header class="app-header">
    <button class="icon-btn" data-back aria-label="Back">${icon('back')}</button>
    <h1>${title}</h1>
  </header>`;
}

function bottomNav(active) {
  const map = { home: 'home', quran: 'quran', prayer: 'prayer', dua: 'dua', menu: 'menu' };
  const activeTop = map[active] || '';
  return `<nav class="bottom-nav">${NAV.map((n) => `
    <button class="nav-item ${activeTop === n.id ? 'active' : ''}" data-nav="${n.id}" aria-label="${t(n.key)}">
      ${icon(n.icon)}<span>${t(n.key)}</span>
    </button>`).join('')}</nav>`;
}

export async function render() {
  const { name, params } = parseHash();
  const app = $('#app');
  const factory = routes[name] || routes.home;

  app.innerHTML = shell(name);
  const outlet = $('#view-outlet');

  // wire shell events
  app.querySelectorAll('[data-nav]').forEach((b) =>
    b.addEventListener('click', () => go(b.dataset.nav)));
  const back = app.querySelector('[data-back]');
  if (back) back.addEventListener('click', () => (history.length > 1 ? history.back() : go('home')));

  current?.cleanup?.();
  current = await factory(outlet, params) || null;
  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', render);
  render();
}
