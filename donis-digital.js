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

    const name = contactForm.querySelector('#contact-name')?.value?.trim() || '';
    const email = contactForm.querySelector('#contact-email')?.value?.trim() || '';
    const businessType = contactForm.querySelector('#contact-business')?.value?.trim() || '';
    const message = contactForm.querySelector('#contact-message')?.value?.trim() || '';

    const subjectParts = [];
    if (businessType) subjectParts.push(businessType);
    if (name) subjectParts.push(name);
    const subject = subjectParts.length ? subjectParts.join(' — ') : 'Website enquiry';

    const bodyLines = [
      'New enquiry from fsteyerdigital.com',
      '',
      `Name: ${name || '-'}`,
      `Email: ${email || '-'}`,
      `Business type: ${businessType || '-'}`,
      '',
      'Message:',
      message || '-',
    ];
    const body = bodyLines.join('\n');

    const mailto = `mailto:hello@fsteyerdigital.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (resetTimer) window.clearTimeout(resetTimer);
    submitButton.textContent = 'Opening email…';

    const a = document.createElement('a');
    a.href = mailto;
    a.rel = 'noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.location.href = mailto;

    resetTimer = window.setTimeout(() => {
      submitButton.textContent = originalText || 'Send message →';
      submitButton.style.background = '';
      contactForm.reset();
    }, 1200);

    window.setTimeout(() => {
      if (submitButton.textContent !== 'Opening email…') return;
      submitButton.textContent = 'If nothing opened: email hello@fsteyerdigital.com';
    }, 1600);
  });
}
