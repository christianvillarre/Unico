  function animateCount(id, target, duration = 2000, suffix = '') {
    const el = document.getElementById(id);
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = suffix === '%' ? `${value}%` : value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  let milesStarted = false;
  function startMiles() {
    if (milesStarted) return;
    milesStarted = true;

    const milesEl = document.getElementById('miles');
    let miles = 0;
    function updateMiles() {
      miles += Math.floor(Math.random() * 10) + 1;
      if (miles > 500000) miles = 0;
      milesEl.textContent = miles.toLocaleString();
      requestAnimationFrame(() => setTimeout(updateMiles, 40));
    }
    updateMiles();
  }

  // Track if we've already animated each section
  const section1Animated = { done: false };
  const section2Animated = { done: false };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target.querySelector('.tracker-container');

        // Animate only once per section
        if (!section1Animated.done && container.querySelector('#years')) {
          section1Animated.done = true;
          animateCount('years', 21, 2000);
          animateCount('clients', 203, 3000);
          animateCount('impact', 100, 2500, '%');
          startMiles();
        }

        if (!section2Animated.done && container.querySelector('#events')) {
          section2Animated.done = true;
          animateCount('events', 257, 2000);
          animateCount('attendees', 50000, 5000);
          animateCount('cities', 17, 1800);
          animateCount('countries', 5, 1200);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe both sections
  document.querySelectorAll('.tracker-section').forEach(section => {
    observer.observe(section);
  });