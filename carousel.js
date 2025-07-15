  const carouselAnimations = {};

  function autoScrollCarousel(selector, baseSpeed = 20, reverse = false) {
    const track = document.querySelector(selector);
    const items = Array.from(track.children);

    // Clone items
    if (items.length < 20) {
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
    }

    const totalWidth = track.scrollWidth / 2;

    if (reverse) {
      gsap.set(track, { x: -totalWidth });
    }

    // Create animation
    const tween = gsap.to(track, {
      x: `${reverse ? '+=' : '-='}${totalWidth}`,
      duration: baseSpeed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });

    carouselAnimations[selector] = tween;

    // Adjust speed on hover
    const visibleItems = track.querySelectorAll('.carousel-item');
    visibleItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        // speed up by making the duration shorter
        tween.timeScale(0.5); // 2x speed
      });

      item.addEventListener('mouseleave', () => {
        // restore normal speed
        tween.timeScale(1); // original speed
      });
    });
  }

  autoScrollCarousel('.track-1', 80);        // forward
  autoScrollCarousel('.track-2', 50, true);  // reverse
  autoScrollCarousel('.track-3', 40);        // forward