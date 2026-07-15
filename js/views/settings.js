import { $, $$, esc, toast, applyTheme } from '../utils.js';
import { icon } from '../icons.js';
import { t, LANGS, applyDir } from '../i18n.js';
import { store } from '../store.js';
import { go } from '../router.js';
import { enablePush } from '../firebase.js';

const ACCENTS = [
  { id: 'emerald', color: '#0B7A3E' },
  { id: 'ocean', color: '#0E7490' },
  { id: 'royal', color: '#1E40AF' },
  { id: 'rose', color: '#9F1239' },
];

export async function SettingsView(root) {
  const s = store.get();
  root.innerHTML = `
    <div class="view-pad">
      <div class="settings-group">
        <h3 class="sg-title">${t('language')}</h3>
        <div class="card">
          <div class="lang-grid">
            ${LANGS.map((l) => `<button class="lang-opt ${s.lang === l.id ? 'active' : ''}" data-lang="${l.id}">
              <strong>${esc(l.native)}</strong><span class="muted small">${esc(l.label)}</span></button>`).join('')}
          </div>
        </div>
      </div>

      <div class="settings-group">
        <h3 class="sg-title">Appearance</h3>
        <div class="card">
          <div class="set-row">
            <span>${t('darkMode')}</span>
            <div class="seg" id="theme-seg">
              ${['light', 'dark', 'system'].map((m) => `<button class="${s.theme === m ? 'active' : ''}" data-theme="${m}">${m}</button>`).join('')}
            </div>
          </div>
          <div class="set-row">
            <span>${t('theme')} accent</span>
            <div class="row" style="gap:8px">
              ${ACCENTS.map((a) => `<button class="accent-dot ${s.accent === a.id ? 'active' : ''}" data-accent="${a.id}" style="background:${a.color}" aria-label="${a.id}"></button>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="settings-group">
        <h3 class="sg-title">${t('notifications')}</h3>
        <div class="card">
          <label class="set-row"><span>Enable notifications</span>
            <span class="switch"><input type="checkbox" id="notif" ${s.notifications ? 'checked' : ''}><span class="slider"></span></span></label>
          <button class="set-link" id="push-btn">${icon('bell')} <span>Enable push notifications</span> ${icon('chevron')}</button>
        </div>
      </div>

      <div class="settings-group">
        <h3 class="sg-title">${t('more')}</h3>
        <div class="card">
          <button class="set-link" data-go="about">${icon('info')}<span>${t('about')}</span>${icon('chevron')}</button>
          <button class="set-link" id="privacy">${icon('shield')}<span>${t('privacy')}</span>${icon('chevron')}</button>
          <button class="set-link" id="terms">${icon('file')}<span>${t('terms')}</span>${icon('chevron')}</button>
          <button class="set-link" id="contact">${icon('mail')}<span>${t('contact')}</span>${icon('chevron')}</button>
          <button class="set-link" id="share">${icon('share')}<span>${t('share')}</span>${icon('chevron')}</button>
          <button class="set-link" id="rate">${icon('star')}<span>${t('rate')}</span>${icon('chevron')}</button>
          <button class="set-link" id="install">${icon('download')}<span>${t('install')}</span>${icon('chevron')}</button>
        </div>
      </div>
      <p class="muted small" style="text-align:center">Ethio-Majlis v1.0.0</p>
    </div>`;

  $$('.lang-opt', root).forEach((b) => b.addEventListener('click', () => {
    store.set({ lang: b.dataset.lang }); applyDir(); toast('Language updated', { icon: 'check' }); go('settings');
  }));
  $$('#theme-seg button', root).forEach((b) => b.addEventListener('click', () => {
    store.set({ theme: b.dataset.theme }); applyTheme();
    $$('#theme-seg button', root).forEach((x) => x.classList.toggle('active', x === b));
  }));
  $$('.accent-dot', root).forEach((b) => b.addEventListener('click', () => {
    store.set({ accent: b.dataset.accent }); applyTheme();
    $$('.accent-dot', root).forEach((x) => x.classList.toggle('active', x === b));
  }));
  $('#notif', root).addEventListener('change', (e) => store.set({ notifications: e.target.checked }));
  $('#push-btn', root).addEventListener('click', async () => {
    const r = await enablePush();
    toast(r.ok ? 'Push enabled' : r.reason === 'demo' ? 'Add Firebase keys to enable push' : 'Push not enabled', { icon: r.ok ? 'check' : 'info' });
  });
  $$('[data-go]', root).forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  $('#privacy', root).addEventListener('click', () => policy('Privacy Policy', 'Ethio-Majlis respects your privacy. We store your preferences and bookmarks locally on your device and, when signed in, in your private Firebase account. We never sell your data. Location is used only to calculate prayer times and Qibla direction.'));
  $('#terms', root).addEventListener('click', () => policy('Terms of Use', 'By using Ethio-Majlis you agree to use the app for lawful, personal, and educational purposes. Religious content is provided for guidance; always consult qualified scholars for rulings.'));
  $('#contact', root).addEventListener('click', () => policy('Contact', 'Email: info@ethio-majlis.app\nCommunity: Ethio-Majlis\nWe welcome your feedback and suggestions.'));
  $('#share', root).addEventListener('click', async () => {
    const data = { title: 'Ethio-Majlis', text: 'Discover the Ethio-Majlis Islamic app', url: location.origin };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else { await navigator.clipboard?.writeText(location.origin); toast('Link copied', { icon: 'check' }); }
  });
  $('#rate', root).addEventListener('click', () => toast('Thank you! Rating opens in the app store once published.', { icon: 'star' }));
  $('#install', root).addEventListener('click', () => {
    if (window.__emCanInstall && window.__emCanInstall()) window.__emInstall();
    else toast('Use your browser menu → “Add to Home Screen”.', { icon: 'download' });
  });

  function policy(title, body) {
    import('../utils.js').then(({ sheet }) => sheet(`<p class="translation" style="white-space:pre-line">${esc(body)}</p>`, { title }));
  }
}
