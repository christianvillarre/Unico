(() => {
  const first = document.getElementById('bg1');
  const spare = document.getElementById('bg2');
  const controls = document.getElementById('dotContainer');
  if (!first || !spare || !controls) return;

  const labels = ['Opening event', 'Missions', 'Kansas City', 'San Antonio',
    'Legislative summit', 'National leaders', 'Community event'];
  let active = first;
  let requested = 0;
  let generation = 0;
  let timer;

  function configure(image, index) {
    const base = 'images/hero-' + (index + 1);
    image.alt = '';
    image.className = 'bg-layer';
    image.sizes = '100vw';
    image.srcset = base + '-small.webp 800w, ' + base + '-large.webp 1920w';
    image.src = base + '-large.webp';
  }

  // Older layouts use an empty div for the first photo.
  if (!(active instanceof HTMLImageElement)) {
    active = new Image();
    configure(active, 0);
    active.classList.add('visible');
    first.replaceWith(active);
  }
  spare.remove();

  const dots = labels.map((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dot';
    button.setAttribute('aria-label', 'Show photo: ' + label);
    button.addEventListener('click', () => show(index));
    controls.append(button);
    return button;
  });

  function mark(index) {
    dots.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (!document.hidden) {
      timer = setTimeout(() => show(requested + 1), 8000);
    }
  }

  async function show(index) {
    clearTimeout(timer);
    requested = (index + labels.length) % labels.length;
    const version = ++generation;
    const image = new Image();
    configure(image, requested);
    try {
      await image.decode();
      if (version !== generation) return;
      const previous = active;
      previous.after(image);
      // Commit the starting opacity before the crossfade.
      image.getBoundingClientRect();
      image.classList.add('visible');
      previous.classList.remove('visible');
      active = image;
      mark(requested);
      setTimeout(() => previous.remove(), 1050);
    } catch {
      // Keep displaying the last decoded photo when a request fails.
    }
    if (version === generation) schedule();
  }

  document.getElementById('nextBtn')?.addEventListener('click', () => show(requested + 1));
  document.getElementById('prevBtn')?.addEventListener('click', () => show(requested - 1));
  document.addEventListener('visibilitychange', schedule);
  mark(0);
  schedule();
})();
