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

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('.form-submit');
  const originalText = submitButton ? submitButton.textContent : '';
  let resetTimer = null;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!submitButton) return;

    if (resetTimer) window.clearTimeout(resetTimer);
    submitButton.textContent = 'Message sent! ✓';
    submitButton.style.background = '#28c840';

    resetTimer = window.setTimeout(() => {
      submitButton.textContent = originalText || 'Send message →';
      submitButton.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}
