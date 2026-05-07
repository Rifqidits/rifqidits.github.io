(function () {
  const container = document.getElementById('skills-globe');
  if (!container) return;

  const tags = [...container.querySelectorAll('.skill-tag')];

  // Inject boxicon elements from data-icon attribute
  tags.forEach(tag => {
    const icon = document.createElement('i');
    icon.className = 'bx ' + tag.dataset.icon;
    tag.prepend(icon);
  });

  const R = container.offsetWidth * 0.38;
  let rotX = 0.3, rotY = 0;
  let velY = 0.006, velX = 0.0008;
  let dragging = false, lastX = 0, lastY = 0;

  // Fibonacci sphere point distribution
  const golden = Math.PI * (3 - Math.sqrt(5));
  tags.forEach((tag, i) => {
    const y = 1 - (i / (tags.length - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    tag._ox = r * Math.cos(theta);
    tag._oy = y;
    tag._oz = r * Math.sin(theta);
  });

  function render() {
    if (!dragging) {
      rotY += velY;
      rotX += velX;
    }

    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    tags.forEach(tag => {
      // Rotate Y axis
      const x1 = tag._ox * cosY + tag._oz * sinY;
      const z1 = -tag._ox * sinY + tag._oz * cosY;
      // Rotate X axis
      const y2 = tag._oy * cosX - z1 * sinX;
      const z2 = tag._oy * sinX + z1 * cosX;

      const depth = (z2 + 1) / 2;
      const scale = 0.55 + depth * 0.65;
      const opacity = 0.2 + depth * 0.8;
      const px = x1 * R;
      const py = y2 * R;

      tag.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${scale})`;
      tag.style.opacity = opacity;
      tag.style.zIndex = Math.round(depth * 100);
    });

    requestAnimationFrame(render);
  }

  // Mouse drag
  container.addEventListener('mousedown', e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    velY = -(e.clientX - lastX) * 0.007;
    velX = (e.clientY - lastY) * 0.004;
    rotY += velY;
    rotX += velX;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      velY *= 0.5;
    }
  });

  // Touch drag
  container.addEventListener('touchstart', e => {
    dragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }, { passive: true });
  container.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    velY = -dx * 0.007;
    velX = dy * 0.004;
    rotY += velY;
    rotX += velX;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }, { passive: true });
  container.addEventListener('touchend', () => {
    dragging = false;
  });

  render();
})();
