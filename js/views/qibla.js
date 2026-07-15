import { $, esc, spinner, toast } from '../utils.js';
import { icon } from '../icons.js';
import { store } from '../store.js';
import { getPosition, qiblaBearing, distanceKm, KAABA } from '../services.js';

export async function QiblaView(root) {
  root.innerHTML = `
    <div class="view-pad center-col">
      <div class="compass-wrap">
        <div class="compass" id="compass">
          <div class="compass-face">
            <span class="c-mark n">N</span><span class="c-mark e">E</span>
            <span class="c-mark s">S</span><span class="c-mark w">W</span>
            <div class="qibla-needle" id="needle">
              <span class="needle-kaaba">${icon('kaaba')}</span>
            </div>
            <div class="compass-center"></div>
          </div>
        </div>
      </div>
      <div class="card qibla-info">
        <div class="qi-row"><span>Qibla Direction</span><strong id="bearing">—</strong></div>
        <div class="qi-row"><span>Distance to Kaaba</span><strong id="distance">—</strong></div>
        <div class="qi-row"><span>Your Location</span><strong id="qloc">—</strong></div>
      </div>
      <p class="muted small" id="q-hint" style="text-align:center;margin-top:12px">Point your device flat and rotate to align the Kaaba with the top marker.</p>
      <button class="btn btn-primary" id="enable-btn" style="margin-top:12px">${icon('compass')} Enable Compass</button>
    </div>
  `;

  let bearing = 0, heading = 0, handler;

  async function init() {
    let loc = store.get('city');
    try { if (!loc || !loc.lat) { const p = await getPosition(); loc = { name: 'Current Location', ...p }; store.set({ city: loc }); } }
    catch { loc = { name: 'Mecca', ...KAABA }; }
    bearing = qiblaBearing(loc);
    $('#bearing', root).textContent = Math.round(bearing) + '°';
    $('#distance', root).textContent = distanceKm(loc).toLocaleString() + ' km';
    $('#qloc', root).textContent = loc.name || `${loc.lat.toFixed(2)}, ${loc.lng.toFixed(2)}`;
    updateNeedle();
  }

  function updateNeedle() {
    const needle = $('#needle', root);
    if (needle) needle.style.transform = `rotate(${bearing - heading}deg)`;
  }

  function onOrient(e) {
    let h = e.webkitCompassHeading != null ? e.webkitCompassHeading : (e.alpha != null ? 360 - e.alpha : 0);
    heading = h;
    updateNeedle();
    const diff = Math.abs(((bearing - heading + 540) % 360) - 180);
    const compass = $('#compass', root);
    if (compass) compass.classList.toggle('aligned', diff < 6);
  }

  $('#enable-btn', root).addEventListener('click', async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== 'granted') { toast('Compass permission denied'); return; }
      } catch { toast('Compass not available'); return; }
    }
    handler = onOrient;
    window.addEventListener('deviceorientationabsolute', handler, true);
    window.addEventListener('deviceorientation', handler, true);
    toast('Compass enabled', { icon: 'check' });
    $('#enable-btn', root).style.display = 'none';
  });

  init();

  return { cleanup: () => { if (handler) { window.removeEventListener('deviceorientationabsolute', handler); window.removeEventListener('deviceorientation', handler); } } };
}
