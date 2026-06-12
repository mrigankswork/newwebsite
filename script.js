document.addEventListener('DOMContentLoaded', () => {

  // --- Theme toggle (persisted) ---
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.setAttribute('data-theme', 'dark');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const dark = root.getAttribute('data-theme') === 'dark';
      if (dark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- Local time (IST) in the hero ---
  const clock = document.getElementById('local-time');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
    });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }

  // --- Scroll reveal ---
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
  } else {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    targets.forEach(el => obs.observe(el));
  }

  // --- Contact form (Formspree) ---
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');

  if (form && btn && status) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      btn.disabled = true;
      status.textContent = '';
      status.className = 'form-status';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          status.textContent = 'Sent — thank you.';
          status.className = 'form-status ok';
          form.reset();
        } else {
          status.textContent = 'Something went wrong. Email me instead?';
          status.className = 'form-status err';
        }
      } catch {
        status.textContent = 'Connection error. Please try again.';
        status.className = 'form-status err';
      } finally {
        btn.disabled = false;
      }
    });
  }
});
