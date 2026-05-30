document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar Tracker ---
  const prog = document.getElementById('prog');
  if (prog) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      prog.style.width = percentage + '%';
    }, { passive: true });
  }

  // --- Hamburger Menu & Navigation Overlay ---
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('nav-overlay');
  let menuOpen = false;

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      hamburger.classList.toggle('open', menuOpen);
      overlay.classList.toggle('open', menuOpen);
      hamburger.setAttribute('aria-expanded', menuOpen);
      overlay.setAttribute('aria-hidden', !menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });

    // Close menu when navigation link is clicked
    overlay.querySelectorAll('a.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        menuOpen = false;
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Close menu when Escape key is pressed
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) {
        menuOpen = false;
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Intersection Observer for Scroll Fade-in Animations ---
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Add a slight stagger effect based on index
        setTimeout(() => e.target.classList.add('visible'), i * 65);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  // Observe entries and sidenotes
  document.querySelectorAll('.entry, .sidenote').forEach(el => obs.observe(el));

  // --- Dark/Light Mode Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Check saved theme or default to dark (since Navy & Silver is default dark)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      document.body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- Contact Formspree Submissions Handler ---
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');

  if (form && btn && status) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      
      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.textContent = '';
      status.className = 'form-status';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          status.textContent = 'Sent — Thank you!';
          status.className = 'form-status ok';
          form.reset();
        } else {
          const data = await res.json();
          if (data && data.errors) {
            status.textContent = 'Error: ' + data.errors.map(err => err.message).join(', ');
          } else {
            status.textContent = 'Submission failed.';
          }
          status.className = 'form-status err';
        }
      } catch (err) {
        status.textContent = 'Connection error. Please try again.';
        status.className = 'form-status err';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    });
  }
});
