// Persistent local state store (survives offline; syncs to Firestore when signed in).
const KEY = 'ethio-majlis:state';

const defaults = {
  theme: 'light',            // light | dark | system
  accent: 'emerald',         // emerald | ocean | royal | rose
  lang: 'en',                // en | am | om | ar
  quranLang: 'am',           // translation language
  city: null,                // { name, lat, lng }
  calcMethod: 2,             // Aladhan method id
  notifications: true,
  bookmarks: [],             // quran ayah bookmarks [{surah, ayah, name}]
  favDuas: [],               // dua ids
  favSurahs: [],             // surah numbers
  lastRead: null,            // { surah, ayah, name }
  tasbihHistory: [],         // [{ dhikr, count, ts }]
  tasbihSound: false,
  tasbihVibrate: true,
  quizScores: [],            // [{ category, score, total, ts }]
  achievements: [],          // ids
  onboardingDone: true,
};

let state = load();
const subs = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch { return { ...defaults }; }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export const store = {
  get: (k) => (k ? state[k] : state),
  set(patch) {
    state = { ...state, ...patch };
    persist();
    subs.forEach((fn) => fn(state));
  },
  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
  toggleInArray(key, value, matcher) {
    const arr = [...(state[key] || [])];
    const idx = arr.findIndex((x) => matcher(x, value));
    if (idx >= 0) arr.splice(idx, 1); else arr.push(value);
    this.set({ [key]: arr });
    return idx < 0; // true if added
  },
};
