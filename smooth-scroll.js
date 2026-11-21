(() => {
  if (!window.Lenis) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  function updateScrolling() {
    if (motion.matches) {
      window.lenis?.destroy();
      window.lenis = null;
    } else if (!window.lenis) {
      window.lenis = new Lenis({ autoRaf: true, anchors: true, smoothWheel: true });
      if (window.ScrollTrigger) window.lenis.on('scroll', ScrollTrigger.update);
    }
  }

  updateScrolling();
  motion.addEventListener('change', updateScrolling);
})();
