// ── LANGUAGE PREFERENCE ──
const LANG_KEY = 'fs_lang';
(() => {
  const path = window.location.pathname;
  const isPtPage = path === '/pt/' || path.startsWith('/pt/');
  try {
    if (isPtPage) {
      window.localStorage.setItem(LANG_KEY, 'pt');
    } else {
      const savedLang = window.localStorage.getItem(LANG_KEY);
      if (savedLang === 'pt') {
        window.location.replace('/pt/');
      }
    }
  } catch (_) {
    // localStorage not available — skip language preference handling
  }
})();

document.querySelectorAll('.lang-switch a').forEach((link) => {
  link.addEventListener('click', () => {
    const lang = link.getAttribute('lang') === 'pt-BR' ? 'pt' : 'en';
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch (_) {
      // ignore — switch still works, preference just won't persist
    }
  });
});

// ── SMOOTH SCROLL TRIGGERS ──
const scrollToId = (id) => {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth' });
};

document.querySelectorAll('[data-scroll-to]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const id = el.getAttribute('data-scroll-to');
    if (id) scrollToId(id);
  });
});

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
reveals.forEach((el) => revealObserver.observe(el));

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

let ticking = false;
const updateActiveNav = () => {
  const scrollPosition = window.scrollY + 120;
  let currentId = '';

  for (const section of sections) {
    if (scrollPosition >= section.offsetTop) currentId = section.id;
  }

  navLinks.forEach((a) => {
    const href = a.getAttribute('href');
    const isActive = href === `#${currentId}`;
    a.classList.toggle('active', isActive);
  });
};

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveNav();
    ticking = false;
  });
});

updateActiveNav();

// ── CONTACT FORM (Formspree) ──
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('.form-submit');
  const statusEl = document.getElementById('contact-status');
  const originalLabel = submitButton ? submitButton.textContent : 'Send message →';

  const setStatus = (msg, kind) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.dataset.kind = kind || '';
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!submitButton) return;

    // Honeypot — bail silently if the hidden field was filled
    const gotcha = contactForm.querySelector('[name="_gotcha"]');
    if (gotcha && gotcha.value) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    setStatus('', '');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });

      if (!response.ok) throw new Error(`Server responded ${response.status}`);

      submitButton.textContent = '✓ Message sent';
      setStatus("✓ Message sent — we'll be in touch within 24 hours.", 'success');
      contactForm.reset();
      submitButton.disabled = false;
    } catch (err) {
      submitButton.textContent = originalLabel;
      submitButton.disabled = false;
      setStatus(
        'Something went wrong. Please try again or email us directly at hello@fsteyerdigital.com.',
        'error'
      );
    }
  });
}

// ── COOKIE CONSENT BANNER ──
const cookieBanner = document.getElementById('cookie-banner');
if (cookieBanner) {
  const STORAGE_KEY = 'fsd-cookie-consent';

  let stored = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    // localStorage not available — surface banner anyway, choice just won't persist
  }

  if (!stored) {
    cookieBanner.hidden = false;
    requestAnimationFrame(() => cookieBanner.classList.add('visible'));
  }

  cookieBanner.querySelectorAll('[data-cookie-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-cookie-action');
      try {
        window.localStorage.setItem(STORAGE_KEY, choice);
      } catch (_) {
        // ignore — banner just won't suppress on next visit
      }
      cookieBanner.classList.remove('visible');
      setTimeout(() => {
        cookieBanner.hidden = true;
      }, 250);
    });
  });
}
