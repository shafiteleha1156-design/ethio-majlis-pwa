import { $, $$, esc } from '../utils.js';
import { icon } from '../icons.js';
import { LIVE } from '../data.js';

export async function LiveView(root) {
  root.innerHTML = `
    <div class="view-pad">
      <div id="live-list">
        ${LIVE.map((l, i) => `
          <div class="card live-card" data-i="${i}">
            <div class="row between">
              <div class="row" style="gap:10px">
                <span class="live-platform ${l.platform.toLowerCase()}">${icon(l.platform === 'YouTube' ? 'video' : 'live')}</span>
                <div><strong>${esc(l.title)}</strong><span class="muted small block">${esc(l.platform)}</span></div>
              </div>
              <span class="status-dot ${l.status.toLowerCase()}">${l.status === 'Live' ? '<span class="pulse"></span>' : ''}${esc(l.status)}</span>
            </div>
            ${l.status === 'Live' && l.embed ? `<div class="embed-wrap"><iframe src="${esc(l.embed)}" title="${esc(l.title)}" allowfullscreen loading="lazy"></iframe></div>` : ''}
            <a class="btn btn-ghost full" href="${esc(l.url)}" target="_blank" rel="noopener">${icon('external')} Open on ${esc(l.platform)}</a>
          </div>`).join('')}
      </div>
      <div class="card" style="margin-top:8px;text-align:center">
        <p class="muted small">Majlis broadcasts appear here automatically. Enable notifications to be alerted when a stream goes live.</p>
      </div>
    </div>`;
}
