function startCarousel(track, duration, reverse) {
  const originals = Array.from(track.children);
  if (!originals.length) return;
  if (!window.gsap) {
    track.style.overflowX = 'auto';
    return;
  }

  for (const item of originals) {
    const copy = item.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    if (copy.matches('a')) copy.tabIndex = -1;
    track.append(copy);
  }

  const firstCopy = track.children[originals.length];
  let tween;
  let distance;
  function measure() {
    const width = firstCopy.offsetLeft - originals[0].offsetLeft;
    if (width <= 0 || width === distance) return;
    distance = width;
    const progress = tween?.progress() || 0;
    tween?.kill();
    tween = gsap.fromTo(track, { x: reverse ? -width : 0 }, {
      x: reverse ? 0 : -width, duration, ease: 'none', repeat: -1
    });
    tween.progress(progress);
  }

  measure();
  new ResizeObserver(measure).observe(track);
  window.addEventListener('resize', measure);
  track.addEventListener('mouseenter', () => tween?.timeScale(0.5));
  track.addEventListener('mouseleave', () => tween?.timeScale(1));
  track.addEventListener('focusin', () => tween?.pause());
  track.addEventListener('focusout', event => {
    if (!track.contains(event.relatedTarget)) tween?.resume();
  });
}

function startCarousels() {
  for (const [i, duration] of [80, 50, 40].entries()) {
    const track = document.querySelector('.track-' + (i + 1));
    if (track) startCarousel(track, duration, i === 1);
  }

  const observer = new IntersectionObserver(entries => {
    for (const {target: video, isIntersecting} of entries) {
      if (!isIntersecting) {
        video.pause();
        continue;
      }
      const source = video.querySelector('source[data-src]');
      if (source) {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
        video.load();
      }
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.play().catch(() => {});
      }
    }
  }, {rootMargin: '150px'});
  document.querySelectorAll('video source[data-src]').forEach(source => observer.observe(source.parentElement));
}

if (document.readyState === 'loading' && !document.querySelector('.carousel-track')) {
  document.addEventListener('DOMContentLoaded', startCarousels, {once: true});
} else {
  startCarousels();
}
