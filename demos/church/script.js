// ── NAV SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => observer.observe(el));

// ── DONATE OPTION SELECTION ──
const donateOptions = document.querySelectorAll('.donate-option');
donateOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    donateOptions.forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.style.borderColor = 'var(--gold)';
    opt.style.background = 'rgba(201,168,76,0.1)';
    donateOptions.forEach(o => {
      if (o !== opt) {
        o.style.borderColor = '';
        o.style.background = '';
      }
    });
  });
});

// ── CONTACT FORM ──
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    const name = document.getElementById('ch-name')?.value.trim();
    const email = document.getElementById('ch-email')?.value.trim();
    const message = document.getElementById('ch-message')?.value.trim();

    if (!name || !email || !message) {
      contactBtn.textContent = 'Please fill in all required fields';
      contactBtn.style.background = '#7f1d1d';
      contactBtn.style.color = '#fff';
      setTimeout(() => {
        contactBtn.textContent = 'Send Message';
        contactBtn.style.background = '';
        contactBtn.style.color = '';
      }, 3000);
      return;
    }

    contactBtn.textContent = '✓ Message Sent — God Bless!';
    contactBtn.style.background = '#14532d';
    contactBtn.style.color = '#fff';
    contactBtn.disabled = true;

    setTimeout(() => {
      contactBtn.textContent = 'Send Message';
      contactBtn.style.background = '';
      contactBtn.style.color = '';
      contactBtn.disabled = false;
    }, 4000);
  });
}

// ── SMOOTH SCROLL WITH OFFSET ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── HIGHLIGHT TODAY'S MASS TIMES ──
// Subtly highlights the next upcoming mass based on current time
const now = new Date();
const day = now.getDay(); // 0=Sun, 6=Sat
const hour = now.getHours();
const minute = now.getMinutes();
const currentMins = hour * 60 + minute;

const timeBadges = document.querySelectorAll('.time-badge');
timeBadges.forEach(badge => {
  const [h, m] = badge.textContent.split(':').map(Number);
  const massMins = h * 60 + m;
  // Highlight next mass within 2 hours
  if (massMins > currentMins && massMins - currentMins <= 120) {
    badge.style.color = 'var(--gold-light)';
    badge.style.fontWeight = '700';
    badge.closest('.time-row').style.background = 'rgba(201,168,76,0.08)';
  }
});
