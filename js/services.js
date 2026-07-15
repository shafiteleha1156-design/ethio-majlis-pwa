// External data services: prayer times, Hijri date, Quran text/audio.
// All use graceful offline fallbacks.
import { cachedFetch } from './utils.js';
import { store } from './store.js';

export const KAABA = { lat: 21.4225, lng: 39.8262 };

// ---- Geolocation ----
export function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('no-geo'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => reject(e),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

// ---- Hijri date (Aladhan gToH) with offline arithmetic fallback ----
export async function getHijriDate(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  try {
    const d = await cachedFetch(
      `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`,
      `hijri:${yyyy}-${mm}-${dd}`, 24 * 3600 * 1000
    );
    const h = d.data.hijri;
    return { day: h.day, month: h.month.en, monthAr: h.month.ar, year: h.year,
      text: `${h.day} ${h.month.en} ${h.year} AH` };
  } catch {
    return fallbackHijri(date);
  }
}

function fallbackHijri(date) {
  // Kuwaiti algorithm approximation
  const months = ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal',
    'Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhul-Qi\'dah','Dhul-Hijjah'];
  const jd = Math.floor((date.getTime()) / 86400000) + 2440588;
  const l0 = jd - 1948440 + 10632;
  const n = Math.floor((l0 - 1) / 10631);
  let l = l0 - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month: months[month - 1] || 'Ramadan', monthAr: '', year,
    text: `${day} ${months[month - 1] || ''} ${year} AH` };
}

// ---- Prayer times (Aladhan) with offline calculation fallback ----
export async function getPrayerTimes(loc, date = new Date()) {
  const method = store.get('calcMethod') ?? 2;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  try {
    const d = await cachedFetch(
      `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${loc.lat}&longitude=${loc.lng}&method=${method}`,
      `prayer:${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}:${yyyy}-${mm}-${dd}:${method}`, 12 * 3600 * 1000
    );
    const t = d.data.timings;
    return {
      Fajr: strip(t.Fajr), Sunrise: strip(t.Sunrise), Dhuhr: strip(t.Dhuhr),
      Asr: strip(t.Asr), Maghrib: strip(t.Maghrib), Isha: strip(t.Isha),
    };
  } catch {
    return calcPrayer(loc, date);
  }
}
const strip = (s) => s.split(' ')[0];

// Simplified astronomical prayer time calc (offline fallback)
function calcPrayer(loc, date) {
  const rad = Math.PI / 180;
  const N = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const decl = 23.45 * Math.sin(rad * (360 * (284 + N) / 365));
  const lat = loc.lat;
  const tz = -date.getTimezoneOffset() / 60;
  const eqt = 0; // ignore equation of time in fallback
  const noon = 12 + tz - loc.lng / 15 - eqt / 60;
  const hourAngle = (angle) => {
    const cosH = (Math.sin(-angle * rad) - Math.sin(lat * rad) * Math.sin(decl * rad)) /
      (Math.cos(lat * rad) * Math.cos(decl * rad));
    return Math.acos(Math.min(1, Math.max(-1, cosH))) / rad / 15;
  };
  const asrAngle = -Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * rad))) / rad;
  const toStr = (h) => {
    h = (h + 24) % 24;
    const hh = Math.floor(h); const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2,'0')}:${String(mm % 60).padStart(2,'0')}`;
  };
  return {
    Fajr: toStr(noon - hourAngle(18)),
    Sunrise: toStr(noon - hourAngle(0.833)),
    Dhuhr: toStr(noon),
    Asr: toStr(noon + hourAngle(asrAngle)),
    Maghrib: toStr(noon + hourAngle(0.833)),
    Isha: toStr(noon + hourAngle(17)),
  };
}

// ---- Quran text + translations (alquran.cloud) ----
const EDITIONS = {
  ar: 'quran-uthmani',
  en: 'en.sahih',
  am: 'am.sadiq',
  om: 'en.sahih', // Afaan Oromo not in API -> show English + note
};

export async function getSurah(number, lang = 'am') {
  const arEd = EDITIONS.ar;
  const trEd = EDITIONS[lang] || EDITIONS.en;
  const d = await cachedFetch(
    `https://api.alquran.cloud/v1/surah/${number}/editions/${arEd},${trEd}`,
    `surah:${number}:${lang}`, 30 * 24 * 3600 * 1000
  );
  const ar = d.data[0];
  const tr = d.data[1];
  const ayahs = ar.ayahs.map((a, i) => ({
    number: a.numberInSurah,
    ar: a.text,
    tr: tr.ayahs[i]?.text || '',
  }));
  return { number: ar.number, name: ar.name, englishName: ar.englishName,
    englishNameTranslation: ar.englishNameTranslation, ayahs, revelationType: ar.revelationType };
}

export function ayahAudioUrl(surah, ayah, reciter = 'ar.alafasy') {
  // Global ayah number not required; use per-surah CDN
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surah}.mp3`;
}

export function surahAudioUrl(surah, reciter = 'ar.alafasy') {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surah}.mp3`;
}

// ---- Qibla direction ----
export function qiblaBearing(loc) {
  const rad = Math.PI / 180;
  const dLng = (KAABA.lng - loc.lng) * rad;
  const lat1 = loc.lat * rad, lat2 = KAABA.lat * rad;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) / rad + 360) % 360;
}

export function distanceKm(a, b = KAABA) {
  const rad = Math.PI / 180, R = 6371;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
}
