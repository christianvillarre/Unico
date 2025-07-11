const nav = document.querySelector('.navbar');
  const navItems = document.querySelectorAll('.nav-item');
  let hideTimer;
  let lastScrollY = window.scrollY;

  function isMouseInsideNavOrDropdown(e) {
    const related = e.relatedTarget;
    return related && (nav.contains(related) || document.querySelector('.dropdown:hover'));
  }

  // Hover: show background
  nav.addEventListener('mouseenter', () => {
    nav.classList.add('hovered');
    clearTimeout(hideTimer);
  });

  nav.addEventListener('mouseleave', (e) => {
    if (isMouseInsideNavOrDropdown(e)) return;
    hideTimer = setTimeout(() => {
      navItems.forEach(i => i.classList.remove('active'));
      if (window.scrollY <= 0) {
        nav.classList.remove('hovered');
      }
    }, 200);
  });

  navItems.forEach(item => {
    const dropdown = item.querySelector('.dropdown');
    const trigger = item.querySelector('a');

    trigger.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      nav.classList.add('hovered');
      nav.classList.remove('hidden');
      nav.classList.add('scrolled-up');
    });

    item.addEventListener('mouseleave', (e) => {
      if (isMouseInsideNavOrDropdown(e)) return;
      hideTimer = setTimeout(() => {
        item.classList.remove('active');
        if (window.scrollY <= 0 && !nav.matches(':hover')) {
          nav.classList.remove('hovered');
        }
      }, 200);
    });

    dropdown.addEventListener('mouseleave', (e) => {
      if (isMouseInsideNavOrDropdown(e)) return;
      hideTimer = setTimeout(() => {
        item.classList.remove('active');
        if (window.scrollY <= 0 && !nav.matches(':hover')) {
          nav.classList.remove('hovered');
        }
      }, 100);
    });
  });

  // Scroll behavior
  function handleScroll() {
    const currentScroll = window.scrollY;

    const isDropdownActive = document.querySelector('.nav-item.active');

    // At top
    if (currentScroll <= 0) {
      nav.classList.remove('hidden', 'scrolled-up');
      nav.classList.add('at-top');

      // Remove background only if no hover/dropdown
      if (!nav.matches(':hover') && !isDropdownActive) {
        nav.classList.remove('hovered');
      }
      return;
    }

    // Scroll down
    if (currentScroll > lastScrollY) {
      nav.classList.add('hidden');
      nav.classList.remove('scrolled-up', 'at-top');
    }
    // Scroll up
    else {
      nav.classList.remove('hidden');
      nav.classList.add('scrolled-up');
      nav.classList.remove('at-top');
      nav.classList.add('hovered'); // Show background on scroll up
    }

    lastScrollY = currentScroll;
  }

  window.addEventListener('scroll', handleScroll);