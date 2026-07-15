// Ethio-Majlis — application bootstrap.
import { $, applyTheme, toast } from './utils.js';
import { applyDir } from './i18n.js';
import { register, initRouter, go } from './router.js';
import { onAuth, initFirebase, loadUserData, logEvent } from './firebase.js';
import { store } from './store.js';

// Views
import { HomeView } from './views/home.js';
import { QuranView } from './views/quran.js';
import { DuaView } from './views/dua.js';
import { PrayerView } from './views/prayer.js';
import { QiblaView } from './views/qibla.js';
import { TasbihView } from './views/tasbih.js';
import { QuizView } from './views/quiz.js';
import { LiveView } from './views/live.js';
import { LibraryView } from './views/library.js';
import { NewsView } from './views/news.js';
import { HajjView } from './views/hajj.js';
import { MenuView } from './views/menu.js';
import { SettingsView } from './views/settings.js';
import { AboutView } from './views/about.js';
import { LoginView } from './views/login.js';
import { ProfileView } from './views/profile.js';
import { AdminView } from './views/admin.js';

// Register routes
register('home', HomeView);
register('quran', QuranView);
register('dua', DuaView);
register('prayer', PrayerView);
register('qibla', QiblaView);
register('tasbih', TasbihView);
register('quiz', QuizView);
register('live', LiveView);
register('library', LibraryView);
register('news', NewsView);
register('hajj', HajjView);
register('menu', MenuView);
register('settings', SettingsView);
register('about', AboutView);
register('login', LoginView);
register('profile', ProfileView);
register('admin', AdminView);

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  window.__emInstall = async () => {
    if (!deferredPrompt) { toast('App already installed or not available.'); return; }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    logEvent('pwa_install_prompt', { outcome });
    deferredPrompt = null;
  };
  window.dispatchEvent(new Event('em-installable'));
});
window.__emCanInstall = () => !!deferredPrompt;

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}

// Boot sequence
async function boot() {
  applyTheme();
  applyDir();

  // Handle deep-link shortcuts (?view=quran)
  const q = new URLSearchParams(location.search);
  if (q.get('view') && !location.hash) location.hash = '#/' + q.get('view');

  initRouter();

  // Firebase (no-op in demo mode)
  try {
    await initFirebase();
    onAuth(async (user) => {
      if (user) { try { await loadUserData(); } catch {} }
    });
  } catch {}

  logEvent('app_open');

  // Hide splash
  const splash = $('#splash');
  setTimeout(() => {
    splash?.classList.add('hide');
    setTimeout(() => splash?.remove(), 700);
  }, 1800);
}

// React to theme/lang changes app-wide
store.subscribe(() => { applyTheme(); applyDir(); });

// Online/offline toasts
window.addEventListener('offline', () => toast('You are offline. Cached content is available.', { icon: 'info' }));
window.addEventListener('online', () => toast('Back online.', { icon: 'check' }));

boot();
