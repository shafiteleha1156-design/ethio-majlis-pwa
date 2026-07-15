import { $, $$, esc, toast } from '../utils.js';
import { icon } from '../icons.js';
import { t } from '../i18n.js';
import { go } from '../router.js';
import { signIn, signUp, signInWithGoogle, resetPassword, getUser } from '../firebase.js';

export async function LoginView(root) {
  if (getUser()) { go('profile'); return; }
  let mode = 'signin';

  function draw() {
    root.innerHTML = `
      <div class="auth-wrap">
        <div class="auth-brand">
          <img src="/public/icons/logo.png" alt="Ethio-Majlis" class="auth-logo"/>
          <h1 class="brand-title sm">ETHIO-MAJLIS</h1>
          <p class="brand-motto arabic-am">"በእውቀት፣ በኢባዳ፣ በአንድነት"</p>
        </div>
        <div class="card auth-card">
          <div class="seg auth-seg">
            <button class="${mode === 'signin' ? 'active' : ''}" data-mode="signin">${t('signIn')}</button>
            <button class="${mode === 'signup' ? 'active' : ''}" data-mode="signup">${t('signUp')}</button>
          </div>
          <form id="auth-form">
            ${mode === 'signup' ? `<label class="field"><span>${t('name')}</span><input class="input" name="name" required autocomplete="name"/></label>` : ''}
            <label class="field"><span>${t('email')}</span><input class="input" type="email" name="email" required autocomplete="email"/></label>
            <label class="field"><span>${t('password')}</span><input class="input" type="password" name="password" required minlength="6" autocomplete="${mode === 'signup' ? 'new-password' : 'current-password'}"/></label>
            ${mode === 'signin' ? `<button type="button" class="link-btn" id="forgot">${t('forgotPw')}</button>` : ''}
            <button class="btn btn-primary full" type="submit" id="submit">${mode === 'signin' ? t('signIn') : t('signUp')}</button>
          </form>
          <div class="divider"><span>or</span></div>
          <button class="btn btn-google full" id="google">${icon('google')} ${t('continueGoogle')}</button>
          <button class="btn btn-ghost full" id="skip" style="margin-top:8px">Continue as ${t('guest')}</button>
        </div>
      </div>`;

    $$('[data-mode]', root).forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; draw(); }));

    $('#auth-form', root).addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#submit', root); btn.disabled = true; btn.textContent = 'Please wait…';
      const fd = new FormData(e.target);
      try {
        if (mode === 'signup') await signUp(fd.get('name'), fd.get('email'), fd.get('password'));
        else await signIn(fd.get('email'), fd.get('password'));
        toast('Welcome!', { icon: 'check' });
        go('home');
      } catch (err) {
        toast(err.message || 'Authentication failed');
        btn.disabled = false; btn.textContent = mode === 'signin' ? t('signIn') : t('signUp');
      }
    });

    $('#google', root).addEventListener('click', async () => {
      try { await signInWithGoogle(); toast('Signed in', { icon: 'check' }); go('home'); }
      catch (err) { toast(err.message || 'Google sign-in failed'); }
    });

    $('#forgot', root)?.addEventListener('click', async () => {
      const email = $('input[name=email]', root).value.trim();
      if (!email) { toast('Enter your email first'); return; }
      try { await resetPassword(email); toast('Password reset email sent (if configured)', { icon: 'check' }); }
      catch { toast('Could not send reset email'); }
    });

    $('#skip', root).addEventListener('click', () => go('home'));
  }
  draw();
}
