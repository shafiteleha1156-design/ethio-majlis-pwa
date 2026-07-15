import { $, $$, esc } from '../utils.js';
import { icon } from '../icons.js';
import { sheet } from '../utils.js';
import { NEWS } from '../data.js';

const TAG_CLASS = { Event: 'gold', Education: '', Announcement: 'green', Charity: 'gold' };

export async function NewsView(root) {
  const items = [...NEWS].sort((a, b) => new Date(b.date) - new Date(a.date));
  root.innerHTML = `
    <div class="view-pad">
      ${items.map((n, i) => `
        <button class="card news-card" data-i="${i}">
          <div class="row between">
            <span class="badge ${TAG_CLASS[n.tag] || ''}">${esc(n.tag)}</span>
            <span class="muted small">${new Date(n.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h3 class="news-title">${esc(n.title)}</h3>
          <p class="translation clamp-2">${esc(n.body)}</p>
        </button>`).join('')}
    </div>`;
  $$('.news-card', root).forEach((c) => c.addEventListener('click', () => {
    const n = items[+c.dataset.i];
    sheet(`<span class="badge ${TAG_CLASS[n.tag] || ''}">${esc(n.tag)}</span>
      <h2 style="margin:12px 0 4px">${esc(n.title)}</h2>
      <p class="muted small">${new Date(n.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
      <p class="translation" style="margin-top:12px">${esc(n.body)}</p>`, { title: 'News' });
  }));
}
