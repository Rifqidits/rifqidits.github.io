// Dark mode — init from localStorage / OS preference
const darkToggle = document.getElementById('dark-toggle');
const htmlEl = document.documentElement;

(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  htmlEl.setAttribute('data-theme', theme);
  updateIcon(theme);
})();

function updateIcon(theme) {
  const icon = darkToggle && darkToggle.querySelector('i');
  if (!icon) return;
  icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
}

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });
}

window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('loaded'), 400);
});

document.querySelectorAll('.pp-code-section pre').forEach(pre => {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.setAttribute('aria-label', 'Copy code');
  btn.innerHTML = '<i class="bx bx-copy"></i><span>Copy</span>';
  pre.style.position = 'relative';
  pre.appendChild(btn);

  btn.addEventListener('click', () => {
    const code = pre.querySelector('code');
    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.innerHTML = '<i class="bx bx-check"></i><span>Copied</span>';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '<i class="bx bx-copy"></i><span>Copy</span>';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});
