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

// Page loader fade-out
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('loaded'), 400);
});
