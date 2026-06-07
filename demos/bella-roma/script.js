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

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ── MENU TABS ──
const tabBtns = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    // Update buttons
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update panels
    menuPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === `tab-${target}`) {
        panel.classList.add('active');
        // Re-trigger reveal animations on newly shown items
        panel.querySelectorAll('.reveal').forEach((el, i) => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), i * 60);
        });
      }
    });
  });
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// ── RESERVATION FORM ──
const reserveBtn = document.getElementById('reserveBtn');

// Set minimum date to today
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;
}

reserveBtn.addEventListener('click', () => {
  const firstName = document.querySelector('input[placeholder="Marco"]').value.trim();
  const lastName  = document.querySelector('input[placeholder="Rossi"]').value.trim();
  const phone     = document.querySelector('input[type="tel"]').value.trim();
  const date      = dateInput ? dateInput.value : '';

  if (!firstName || !lastName || !phone || !date) {
    reserveBtn.textContent = 'Please fill in all required fields';
    reserveBtn.style.background = '#9b1c1c';
    reserveBtn.style.color = '#fff';
    setTimeout(() => {
      reserveBtn.textContent = 'Confirm Reservation';
      reserveBtn.style.background = '';
      reserveBtn.style.color = '';
    }, 3000);
    return;
  }

  reserveBtn.textContent = '✓ Reservation Received!';
  reserveBtn.style.background = '#166534';
  reserveBtn.style.color = '#fff';
  reserveBtn.disabled = true;

  setTimeout(() => {
    reserveBtn.textContent = 'Confirm Reservation';
    reserveBtn.style.background = '';
    reserveBtn.style.color = '';
    reserveBtn.disabled = false;
  }, 4000);
});

// ── SMOOTH SCROLL OFFSET (for fixed nav) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
