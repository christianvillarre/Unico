(() => {
  if (!window.Lenis) return;

  // Smooth wheel scrolling belongs to desktop; tablets and phones stay native.
  const desktop = matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
  function updateScrolling() {
    if (!desktop.matches) {
      window.lenis?.destroy();
      window.lenis = null;
    } else if (!window.lenis) {
      window.lenis = new Lenis({ autoRaf: true, anchors: true, smoothWheel: true });
      window.lenis.on('scroll', () => window.ScrollTrigger?.update());
    }
  }

  updateScrolling();
  desktop.addEventListener('change', updateScrolling);
})();
