import { $, $$, el, esc, toast, vibrate } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { store } from '../store.js';
import { QUIZ } from '../data.js';
import { saveUserData, getUser } from '../firebase.js';

export async function QuizView(root) {
  const cats = [...new Set(QUIZ.map((q) => q.cat))];
  showMenu();

  function showMenu() {
    const scores = store.get('quizScores') || [];
    const best = scores.length ? Math.max(...scores.map((s) => Math.round((s.score / s.total) * 100))) : 0;
    root.innerHTML = `
      <div class="view-pad">
        <div class="card quiz-stat">
          <div class="qs-item"><span class="muted">${t('score')}</span><strong>${best}%</strong></div>
          <div class="qs-item"><span class="muted">Played</span><strong>${scores.length}</strong></div>
          <div class="qs-item"><span class="muted">${t('level')}</span><strong>${level(scores.length)}</strong></div>
        </div>

        <div class="section-head"><h2>Categories</h2></div>
        <div class="quiz-cats">
          <button class="quiz-cat-card" data-cat="all">${icon('quiz')}<span>Mixed</span></button>
          ${cats.map((c) => `<button class="quiz-cat-card" data-cat="${esc(c)}">${icon('star')}<span>${esc(c)}</span></button>`).join('')}
        </div>

        <div class="section-head" style="margin-top:20px"><h2>${t('achievements')}</h2></div>
        <div class="badges">${achievements(scores)}</div>

        <div class="section-head" style="margin-top:20px"><h2>${t('leaderboard')}</h2></div>
        <div class="card">${leaderboard(scores)}</div>
      </div>`;
    $$('.quiz-cat-card', root).forEach((b) => b.addEventListener('click', () => startQuiz(b.dataset.cat)));
  }

  function startQuiz(cat) {
    let pool = cat === 'all' ? [...QUIZ] : QUIZ.filter((q) => q.cat === cat);
    pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(5, pool.length));
    let idx = 0, score = 0;

    function renderQ() {
      const q = pool[idx];
      root.innerHTML = `
        <div class="view-pad">
          <div class="quiz-progress"><div class="qp-bar" style="width:${(idx / pool.length) * 100}%"></div></div>
          <p class="muted small">Question ${idx + 1} / ${pool.length} · ${esc(q.cat)}</p>
          <div class="card quiz-q"><h2>${esc(q.q)}</h2></div>
          <div class="quiz-options">
            ${q.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${esc(o)}</button>`).join('')}
          </div>
        </div>`;
      $$('.quiz-opt', root).forEach((b) => b.addEventListener('click', () => {
        const chosen = +b.dataset.i;
        $$('.quiz-opt', root).forEach((x) => x.disabled = true);
        if (chosen === q.answer) { b.classList.add('correct'); score++; vibrate(30); }
        else {
          b.classList.add('wrong'); vibrate([40, 30, 40]);
          $$('.quiz-opt', root)[q.answer].classList.add('correct');
        }
        setTimeout(() => { idx++; idx < pool.length ? renderQ() : finish(); }, 900);
      }));
    }

    function finish() {
      const scores = [{ category: cat, score, total: pool.length, ts: Date.now(), user: getUser()?.name || t('guest') }, ...(store.get('quizScores') || [])].slice(0, 50);
      store.set({ quizScores: scores });
      saveUserData();
      const pct = Math.round((score / pool.length) * 100);
      root.innerHTML = `
        <div class="view-pad center-col">
          <div class="result-ring ${pct >= 60 ? 'good' : 'bad'}">${pct}%</div>
          <h2>${pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Well done!' : 'Keep learning!'}</h2>
          <p class="muted">You scored ${score} of ${pool.length}</p>
          <div class="row" style="gap:12px;margin-top:16px">
            <button class="btn btn-primary" id="again">Play Again</button>
            <button class="btn btn-ghost" id="menu">Menu</button>
          </div>
        </div>`;
      $('#again', root).addEventListener('click', () => startQuiz(cat));
      $('#menu', root).addEventListener('click', showMenu);
    }
    renderQ();
  }

  function level(n) { return n >= 20 ? 'Scholar' : n >= 10 ? 'Advanced' : n >= 3 ? 'Learner' : 'Beginner'; }

  function achievements(scores) {
    const defs = [
      { id: 'first', label: 'First Quiz', icon: 'star', got: scores.length >= 1 },
      { id: 'perfect', label: 'Perfect Score', icon: 'trophy', got: scores.some((s) => s.score === s.total) },
      { id: 'five', label: '5 Quizzes', icon: 'quiz', got: scores.length >= 5 },
      { id: 'ten', label: '10 Quizzes', icon: 'trophy', got: scores.length >= 10 },
    ];
    return defs.map((d) => `<div class="badge-item ${d.got ? 'got' : ''}">${icon(d.icon)}<span>${d.label}</span></div>`).join('');
  }

  function leaderboard(scores) {
    if (!scores.length) return `<p class="muted">Play a quiz to appear on the leaderboard.</p>`;
    const top = [...scores].sort((a, b) => (b.score / b.total) - (a.score / a.total)).slice(0, 5);
    return top.map((s, i) => `<div class="lb-row"><span class="lb-rank">${i + 1}</span><span>${esc(s.user || 'You')}</span><strong>${Math.round((s.score / s.total) * 100)}%</strong></div>`).join('');
  }
}
