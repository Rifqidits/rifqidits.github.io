// ── Element References ────────────────────────────────────────────────
const header       = document.getElementById('navbar');
const menuBtn      = document.getElementById('menu-icon');
const navbar       = document.querySelector('.navbar');
const loader       = document.getElementById('page-loader');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm  = document.getElementById('contact-form');
const submitBtn    = document.getElementById('submit-btn');
const formSuccess  = document.getElementById('form-success');

// ── Page Loader ───────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loaded');
  }, 750);
});

// ── Scroll Spy Helper ─────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar a[data-section]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 130;
    if (window.scrollY >= top) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ── Single Scroll Handler ─────────────────────────────────────────────
function onScroll() {
  const y = window.scrollY;

  // Navbar glassmorphism on scroll
  header.classList.toggle('scrolled', y > 50);

  // Scroll-to-top visibility
  scrollTopBtn.classList.toggle('visible', y > 400);

  // Close mobile menu on scroll
  if (navbar.classList.contains('open')) {
    navbar.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  // Active nav link
  updateActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile Menu ───────────────────────────────────────────────────────
menuBtn.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

// Close when any nav link is clicked
navbar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ── Scroll to Top ─────────────────────────────────────────────────────
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Intersection Observer — Entrance Animations ───────────────────────
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll(
  '[data-animate], .timeline-item, .project-card, .portfolio-card, .skill-category'
).forEach(el => animObserver.observe(el));

// ── Stats Counter Animation ───────────────────────────────────────────
const statNums = document.querySelectorAll('.stat-num[data-target]');

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el       = entry.target;
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const steps    = Math.max(target, 1);
    const interval = Math.floor(duration / steps);
    let current    = 0;

    const timer = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, interval);

    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ── Contact Form — Formspree with Validation ──────────────────────────
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors & success
    contactForm.querySelectorAll('.form-error').forEach(el => (el.textContent = ''));
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    if (formSuccess) {
      formSuccess.textContent = '';
      formSuccess.style.color = '';
    }

    // Client-side validation
    const nameEl    = contactForm.querySelector('#name');
    const emailEl   = contactForm.querySelector('#email');
    const messageEl = contactForm.querySelector('#message');

    let valid = true;

    function setError(el, msg) {
      el.classList.add('error');
      const errorEl = el.closest('.form-group').querySelector('.form-error');
      if (errorEl) errorEl.textContent = msg;
      valid = false;
    }

    if (!nameEl.value.trim()) {
      setError(nameEl, 'Name is required.');
    }

    if (!emailEl.value.trim()) {
      setError(emailEl, 'Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      setError(emailEl, 'Please enter a valid email address.');
    }

    if (!messageEl.value.trim()) {
      setError(messageEl, 'Message cannot be empty.');
    }

    if (!valid) return;

    // Submit to Formspree
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        if (formSuccess) {
          formSuccess.textContent = "// Message sent. I'll get back to you soon.";
        }
        contactForm.reset();
      } else {
        if (formSuccess) {
          formSuccess.style.color = 'var(--color-error)';
          formSuccess.textContent = '// Something went wrong. Try emailing directly.';
        }
      }
    } catch {
      if (formSuccess) {
        formSuccess.style.color = 'var(--color-error)';
        formSuccess.textContent = '// Network error. Please try again.';
      }
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // Clear field error on input
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errorEl = field.closest('.form-group')?.querySelector('.form-error');
      if (errorEl) errorEl.textContent = '';
    });
  });
}
