const carouselAnimations = {};

function autoScrollCarousel(selector, baseSpeed = 20, reverse = false) {
  const track = document.querySelector(selector);
  const items = Array.from(track.children);

  // Clone once for looping
  if (!track.dataset.cloned) {
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
    track.dataset.cloned = "true"; // flag to avoid double cloning
  }

  // Wait until next paint to get correct width
  requestAnimationFrame(() => {
    const totalWidth = track.scrollWidth / 2; // half, because it's double after clone

    if (totalWidth === 0) {
      console.warn(`Total width is 0 for ${selector}`);
      return;
    }

    // Set initial x for reverse
    if (reverse) {
      gsap.set(track, { x: -totalWidth });
    }

    const tween = gsap.to(track, {
      x: `${reverse ? "+=" : "-="}${totalWidth}`,
      duration: baseSpeed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });

    carouselAnimations[selector] = tween;

    // Hover speed control
    const visibleItems = track.querySelectorAll('.carousel-item');
    visibleItems.forEach(item => {
      item.addEventListener('mouseenter', () => tween.timeScale(0.5));
      item.addEventListener('mouseleave', () => tween.timeScale(1));
    });
  });
}

window.addEventListener('load', () => {
  autoScrollCarousel('.track-1', 80);        // forward ✅ now fixed
  autoScrollCarousel('.track-2', 50, true);  // reverse ✅ smooth right-to-left
  autoScrollCarousel('.track-3', 40);        // forward ✅
});