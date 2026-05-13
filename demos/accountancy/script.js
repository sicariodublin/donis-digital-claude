// ── NAV SCROLL ──
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

mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    closeMobile();
  });
});

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

// ── OFFICE HOURS STATUS ──
function updateOfficeStatus() {
  const now = new Date();
  const day = now.getDay();   // 0=Sun, 1=Mon...6=Sat
  const hour = now.getHours();
  const min = now.getMinutes();
  const currentMins = hour * 60 + min;

  // Opening hours per day [open, close] in minutes from midnight
  const hours = {
    1: [8*60+30, 17*60+30],  // Mon
    2: [8*60+30, 17*60+30],  // Tue
    3: [8*60+30, 17*60+30],  // Wed
    4: [8*60+30, 17*60+30],  // Thu
    5: [8*60+30, 16*60+30],  // Fri
  };

  const dayIds = {1:'mon', 2:'tue', 3:'wed', 4:'thu', 5:'fri'};
  const statusEl = document.getElementById('hoursStatus');

  // Mark today's badge
  const todayId = dayIds[day];
  if (todayId) {
    const badge = document.getElementById(`${todayId}-badge`);
    if (badge) {
      const [open, close] = hours[day];
      const isOpen = currentMins >= open && currentMins < close;
      badge.textContent = isOpen ? 'Open now' : 'Today';
      badge.classList.add(isOpen ? 'open' : 'closed-now');
    }
  }

  // Status bar message
  if (statusEl) {
    if (day === 0 || day === 6) {
      statusEl.innerHTML = '<span style="color:var(--text-muted)">⚫ Closed today (weekend) — we reopen Monday at 08:30</span>';
    } else if (hours[day]) {
      const [open, close] = hours[day];
      if (currentMins < open) {
        const openH = Math.floor(open/60);
        const openM = String(open%60).padStart(2,'0');
        statusEl.innerHTML = `<span style="color:#d97706">🟡 Opens today at ${openH}:${openM}</span>`;
      } else if (currentMins >= open && currentMins < close) {
        const closeH = Math.floor(close/60);
        const closeM = String(close%60).padStart(2,'0');
        statusEl.innerHTML = `<span style="color:var(--green)">🟢 Open now — closes at ${closeH}:${closeM}</span>`;
      } else {
        statusEl.innerHTML = '<span style="color:#dc2626">🔴 Closed — reopens tomorrow at 08:30</span>';
        if (day === 5) {
          statusEl.innerHTML = '<span style="color:#dc2626">🔴 Closed for the weekend — reopens Monday at 08:30</span>';
        }
      }
    }
  }
}

updateOfficeStatus();

// ── CONTACT FORM ──
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    const name    = document.querySelector('input[placeholder="Your name"]')?.value.trim();
    const email   = document.querySelector('input[type="email"]')?.value.trim();
    const company = document.querySelector('input[placeholder="Your company"]')?.value.trim();
    const message = document.querySelector('textarea')?.value.trim();

    if (!name || !email || !message) {
      contactBtn.textContent = 'Please fill in required fields';
      contactBtn.style.background = '#7f1d1d';
      setTimeout(() => {
        contactBtn.textContent = 'Request Consultation';
        contactBtn.style.background = '';
      }, 3000);
      return;
    }

    contactBtn.textContent = '✓ Request Received — We\'ll be in touch!';
    contactBtn.style.background = 'var(--green-dim)';
    contactBtn.style.color = '#fff';
    contactBtn.disabled = true;

    setTimeout(() => {
      contactBtn.textContent = 'Request Consultation';
      contactBtn.style.background = '';
      contactBtn.style.color = '';
      contactBtn.disabled = false;
    }, 4000);
  });
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
