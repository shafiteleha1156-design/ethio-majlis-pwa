import { esc } from '../utils.js';
import { icon } from '../icons.js';

const TECH = ['HTML5', 'CSS3', 'JavaScript ES6', 'Firebase Auth', 'Firestore', 'Firebase Storage', 'Cloud Messaging', 'Analytics', 'Service Worker', 'PWA Manifest', 'Material Design', 'Responsive'];

export async function AboutView(root) {
  root.innerHTML = `
    <div class="view-pad center-col">
      <img src="/public/icons/logo.png" alt="Ethio-Majlis logo" class="about-logo" />
      <h1 class="brand-title">ETHIO-MAJLIS</h1>
      <p class="brand-motto arabic-am">"በእውቀት፣ በኢባዳ፣ በአንድነት"</p>
      <p class="muted" style="text-align:center;max-width:520px;margin-top:8px">
        Ethio-Majlis is a modern Islamic companion built for the Ethiopian Muslim community — bringing the Quran,
        authentic duas, prayer times, Qibla, Hajj &amp; Umrah guidance, learning and community together in one beautiful app.
      </p>

      <div class="card" style="width:100%;margin-top:20px">
        <h3 style="margin-bottom:10px">Our Mission</h3>
        <p class="translation">To spread beneficial knowledge, strengthen worship, and unite the community — "in knowledge, in worship, in unity."</p>
      </div>

      <div class="card" style="width:100%">
        <h3 style="margin-bottom:10px">Technology</h3>
        <div class="tech-chips">${TECH.map((x) => `<span class="tech-chip">${esc(x)}</span>`).join('')}</div>
      </div>

      <div class="card" style="width:100%">
        <h3 style="margin-bottom:10px">Features</h3>
        <ul class="feature-list">
          <li>${icon('book')} Full Quran with Amharic, English &amp; Oromo translations</li>
          <li>${icon('clock')} Accurate prayer times &amp; countdown</li>
          <li>${icon('compass')} Qibla compass with live direction</li>
          <li>${icon('beads')} Digital Tasbih with history</li>
          <li>${icon('quiz')} Islamic quizzes &amp; achievements</li>
          <li>${icon('kaaba')} Step-by-step Hajj &amp; Umrah guide</li>
        </ul>
      </div>

      <p class="muted small" style="margin-top:16px">Version 1.0.0 · Made with care for the Ummah</p>
    </div>`;
}
