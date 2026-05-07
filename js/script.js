// ── Dark Mode ─────────────────────────────────────────────────────────
const darkToggle = document.getElementById('dark-toggle');
const htmlEl     = document.documentElement;

(function initTheme() {
  const saved      = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme      = saved || (prefersDark ? 'dark' : 'light');
  htmlEl.setAttribute('data-theme', theme);
  updateToggleIcon(theme);
})();

function updateToggleIcon(theme) {
  const icon = darkToggle.querySelector('i');
  if (!icon) return;
  icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
}

darkToggle.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcon(next);
});

// ── Element References ────────────────────────────────────────────────
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

// ── Scroll Spy (pill nav) ─────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const pillLinks = document.querySelectorAll('.pill-link[data-section]');

function updateActiveNav() {
  const scrollY = window.scrollY;
  let current = 'home';
  sections.forEach(section => {
    if (scrollY + 140 >= section.offsetTop) {
      current = section.id;
    }
  });
  pillLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ── Single Scroll Handler ─────────────────────────────────────────────
function onScroll() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });

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

// ── Work Card Modal ───────────────────────────────────────────────────
const workModal  = document.getElementById('work-modal');
const modalClose = document.getElementById('work-modal-close');

document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const img    = card.querySelector('.work-img img');
    const detail = card.dataset.detail || '';
    const links  = card.dataset.links ? JSON.parse(card.dataset.links) : [];

    document.getElementById('modal-img').src              = img.src;
    document.getElementById('modal-img').alt              = img.alt;
    document.getElementById('modal-title').textContent    = card.querySelector('.work-title').textContent;
    document.getElementById('modal-desc').textContent     = card.querySelector('.work-desc').textContent;
    document.getElementById('modal-category').textContent = card.querySelector('.work-category').textContent;
    document.getElementById('modal-year').textContent     = card.querySelector('.work-year').textContent;

    const tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = '';
    card.querySelectorAll('.work-tags span').forEach(t => {
      const s = document.createElement('span');
      s.textContent = t.textContent;
      tagsEl.appendChild(s);
    });

    const actionsEl = document.getElementById('modal-actions');
    actionsEl.innerHTML = '';
    if (detail) {
      actionsEl.insertAdjacentHTML('beforeend',
        `<a href="${detail}" class="modal-btn-primary">View Details <i class="bx bx-right-arrow-alt"></i></a>`);
    }
    links.forEach(({ href, icon, label }) => {
      actionsEl.insertAdjacentHTML('beforeend',
        `<a href="${href}" target="_blank" rel="noopener" class="modal-btn-secondary"><i class="bx ${icon}"></i> ${label}</a>`);
    });

    workModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

modalClose?.addEventListener('click', closeWorkModal);
workModal?.addEventListener('click', e => { if (e.target === workModal) closeWorkModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWorkModal(); });

function closeWorkModal() {
  workModal?.classList.remove('open');
  document.body.style.overflow = '';
}
