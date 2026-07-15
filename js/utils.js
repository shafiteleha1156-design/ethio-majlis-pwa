// DOM + generic helpers, toast, bottom sheet, theme, i18n hook.
import { icon } from './icons.js';
import { store } from './store.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function esc(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function toast(msg, opts = {}) {
  const wrap = $('#toast-wrap');
  const node = el(`<div class="toast" role="status">${opts.icon ? icon(opts.icon) : ''}<span>${esc(msg)}</span></div>`);
  wrap.appendChild(node);
  setTimeout(() => { node.style.opacity = '0'; node.style.transform = 'translateY(8px)'; }, opts.duration || 2400);
  setTimeout(() => node.remove(), (opts.duration || 2400) + 400);
}

// Bottom sheet / modal
export function sheet(contentHtml, { title } = {}) {
  const root = $('#modal-root');
  const backdrop = el(`
    <div class="sheet-backdrop" role="dialog" aria-modal="true">
      <div class="sheet">
        <div class="grab"></div>
        ${title ? `<div class="row between mb"><h3 style="font-size:1.1rem">${esc(title)}</h3><button class="icon-btn" data-close aria-label="Close">${icon('close')}</button></div>` : ''}
        <div class="sheet-body">${contentHtml}</div>
      </div>
    </div>`);
  root.appendChild(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('open'));
  const close = () => {
    backdrop.classList.remove('open');
    setTimeout(() => backdrop.remove(), 350);
  };
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('[data-close]')) close();
  });
  return { close, root: backdrop };
}

// Theme handling
export function applyTheme() {
  const t = store.get('theme');
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = t === 'dark' || (t === 'system' && sysDark);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.accent = store.get('accent') || 'emerald';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#0c110e' : '#0B7A3E');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

// Formatting
export const pad = (n) => String(n).padStart(2, '0');
export function fmtTime12(hhmm) {
  if (!hhmm) return '--:--';
  let [h, m] = hhmm.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${pad(m)} ${ap}`;
}

export function debounce(fn, ms = 300) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function vibrate(ms = 30) {
  if (navigator.vibrate) try { navigator.vibrate(ms); } catch {}
}

// Simple beep via WebAudio (for tasbih / notifications)
let audioCtx;
export function beep(freq = 660, dur = 90) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(0.001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur / 1000);
  } catch {}
}

// Cached fetch with offline fallback via localStorage
export async function cachedFetch(url, cacheKey, ttlMs = 6 * 3600 * 1000) {
  const ck = `emcache:${cacheKey}`;
  try {
    const hit = JSON.parse(localStorage.getItem(ck) || 'null');
    if (hit && Date.now() - hit.t < ttlMs) return hit.d;
  } catch {}
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    try { localStorage.setItem(ck, JSON.stringify({ t: Date.now(), d })); } catch {}
    return d;
  } catch (err) {
    // Offline fallback: stale cache if any
    try {
      const hit = JSON.parse(localStorage.getItem(ck) || 'null');
      if (hit) return hit.d;
    } catch {}
    throw err;
  }
}

export const spinner = () => `<div class="spinner" role="status" aria-label="Loading"></div>`;
export const empty = (iconName, text) => `<div class="empty">${icon(iconName)}<p>${esc(text)}</p></div>`;
