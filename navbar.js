const nav = document.querySelector('.navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const logoImg = document.querySelector('.logo1');
  let hideTimer;
  let lastScrollY = window.scrollY;
  let logoState = 'logo1';
  let hasScrolledPastTop = false;

  function isMouseInsideNavOrDropdown(e) {
    const related = e.relatedTarget;
    return related && (nav.contains(related) || document.querySelector('.dropdown:hover'));
  }

  function maybeRemoveHovered() {
    const isDropdownActive = document.querySelector('.nav-item.active');
    const isNavHovered = nav.matches(':hover');
    if (window.scrollY <= 0 && !isDropdownActive && !isNavHovered) {
      nav.classList.remove('hovered');
    }
  }

  nav.addEventListener('mouseenter', () => {
    nav.classList.add('hovered');
    clearTimeout(hideTimer);
  });

  nav.addEventListener('mouseleave', (e) => {
    if (isMouseInsideNavOrDropdown(e)) return;
    hideTimer = setTimeout(() => {
      navItems.forEach(i => i.classList.remove('active'));
      maybeRemoveHovered();
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

      const text = dropdown.querySelector('.dropdown-text');
      const images = dropdown.querySelectorAll('.image-box, .image-box2');

      if (text || images.length > 0) {
        gsap.killTweensOf([text, ...images]);
        gsap.set([text, ...images], { opacity: 0, y: 20 });

        gsap.to(text, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out"
        });

        gsap.to(images, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        });
      }
    });

    item.addEventListener('mouseleave', (e) => {
      if (isMouseInsideNavOrDropdown(e)) return;
      hideTimer = setTimeout(() => {
        item.classList.remove('active');
        maybeRemoveHovered();
      }, 200);
    });

    dropdown.addEventListener('mouseleave', (e) => {
      if (isMouseInsideNavOrDropdown(e)) return;
      hideTimer = setTimeout(() => {
        item.classList.remove('active');
        maybeRemoveHovered();
      }, 100);
    });
  });

  function handleScroll() {
    const currentScroll = window.scrollY;
    const scrollingDown = currentScroll > lastScrollY;
    const scrollingUp = currentScroll < lastScrollY;

    // 🔹 Auto-close dropdowns
    navItems.forEach(i => i.classList.remove('active'));

    // At the top
    if (currentScroll <= 0) {
      nav.classList.remove('hidden', 'scrolled-up');
      nav.classList.add('at-top');

      if (logoState !== 'logo1') {
        logoImg.src = 'images/logo1.png';
        logoState = 'logo1';
      }
      hasScrolledPastTop = false;
      maybeRemoveHovered();
      lastScrollY = currentScroll;
      return;
    }

    // First time scroll down → don't change logo
    if (!hasScrolledPastTop) {
      hasScrolledPastTop = true;
    }

    // Scroll down
    if (scrollingDown) {
      nav.classList.add('hidden');
      nav.classList.remove('scrolled-up', 'at-top');
    }
    // Scroll up
    else if (scrollingUp) {
      nav.classList.remove('hidden');
      nav.classList.add('scrolled-up');
      nav.classList.remove('at-top');
      nav.classList.add('hovered');

      if (hasScrolledPastTop && logoState !== 'logo2') {
        logoImg.src = 'images/logo2.png';
        logoState = 'logo2';
      }
    }

    lastScrollY = currentScroll;
  }

  window.addEventListener('scroll', handleScroll);