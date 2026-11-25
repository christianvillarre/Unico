const nav = document.querySelector('.navbar');
const navItems = document.querySelectorAll('.nav-item');
const logoImg = document.querySelector('.logo1');

let hideTimer;
let proximityHideTimer;
let lastScrollY = 0;
let logoState = 'logo1';
let hasScrolledPastTop = false;
let proximityActive = false;

const PROXIMITY_Y = 80; // px from top to trigger reveal
const HIDE_DELAY = 180; // ms before hiding after leaving zone
const SCROLL_THRESHOLD = 2; // prevents tiny Lenis deltas from flipping nav state

// =========================
// Helpers
// =========================

// LightWidget toggles this body class for every lightbox open/close path.
function isInstagramLightboxOpen() {
  return document.body.classList.contains('lightwidget__lightbox-website');
}

function syncInstagramLightboxState() {
  if (isInstagramLightboxOpen()) {
    clearTimeout(hideTimer);
    clearTimeout(proximityHideTimer);
    proximityActive = false;
    navItems.forEach(item => item.classList.remove('active'));
    nav.inert = true;
    applyHiddenState();
  } else {
    nav.inert = false;
    lastScrollY = window.scrollY;
    if (window.scrollY <= 5) applyTopState();
  }
}

new MutationObserver(syncInstagramLightboxState).observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});
syncInstagramLightboxState();

// Check if mouse is moving inside nav or dropdown
function isMouseInsideNavOrDropdown(e) {
  const related = e.relatedTarget;
  return related && (
    nav.contains(related) ||
    !!document.querySelector('.dropdown:hover')
  );
}

// Safely update logo
function setLogo(state) {
  if (logoState === state) return;

  if (state === 'logo1') {
    logoImg.src = 'images/logo1.png';
  } else {
    logoImg.src = 'images/logo2.png';
  }

  logoState = state;
}

// Reset navbar classes before applying a state
function resetNavState() {
  nav.classList.remove('hidden', 'scrolled-up', 'hovered', 'navbar-bg', 'at-top');
}

// Apply top-of-page style
function applyTopState() {
  if (isInstagramLightboxOpen()) return applyHiddenState();
  resetNavState();
  nav.classList.add('at-top');
  setLogo('logo1');
}

// Apply visible scrolled style
function applyShownState({ hovered = false } = {}) {
  if (isInstagramLightboxOpen()) return applyHiddenState();
  resetNavState();
  nav.classList.add('scrolled-up', 'navbar-bg');

  if (hovered) {
    nav.classList.add('hovered');
  }

  setLogo('logo2');
}

// Apply hidden style
function applyHiddenState() {
  resetNavState();
  nav.classList.add('hidden');
}

// Remove hovered/navbar bg only if truly idle at top
function maybeRemoveHovered() {
  const isDropdownActive = document.querySelector('.nav-item.active');
  const isNavHovered = nav.matches(':hover');

  if (window.scrollY <= 5 && !isDropdownActive && !isNavHovered) {
    nav.classList.remove('hovered', 'navbar-bg');
  }
}

// Animate dropdown items with GSAP
function animateDropdown(item) {
  const dropdown = item.querySelector('.dropdown');
  if (!dropdown) return;

  const text = dropdown.querySelector('.dropdown-text');
  const images = dropdown.querySelectorAll('.image-box, .image-box2');
  const targets = [text, ...images].filter(Boolean);

  if (!targets.length) return;

  gsap.killTweensOf(targets);
  gsap.set(targets, { opacity: 0, y: 20 });

  if (text) {
    gsap.to(text, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out'
    });
  }

  if (images.length) {
    gsap.to(images, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }
}

// Returns true if the navbar should stay visible because user is interacting
function isNavInteracting() {
  return (
    nav.matches(':hover') ||
    !!document.querySelector('.dropdown:hover') ||
    !!document.querySelector('.nav-item.active') ||
    proximityActive
  );
}

// =========================
// Navbar hover events
// =========================

nav.addEventListener('mouseenter', () => {
  if (isInstagramLightboxOpen()) return;
  clearTimeout(hideTimer);
  nav.classList.add('hovered');
});

nav.addEventListener('mouseleave', (e) => {
  if (isMouseInsideNavOrDropdown(e)) return;

  hideTimer = setTimeout(() => {
    navItems.forEach(i => i.classList.remove('active'));

    if (window.scrollY <= 5) {
      applyTopState();
      maybeRemoveHovered();
    } else if (!proximityActive) {
      applyHiddenState();
    }
  }, 200);
});

// =========================
// Dropdown triggers
// =========================

navItems.forEach(item => {
  const dropdown = item.querySelector('.dropdown');
  const trigger = item.querySelector('a');

  if (!trigger) return;

  trigger.addEventListener('mouseenter', () => {
    if (isInstagramLightboxOpen()) return;
    clearTimeout(hideTimer);

    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    if (window.scrollY <= 5) {
      resetNavState();
      nav.classList.add('at-top', 'hovered', 'navbar-bg');
      setLogo('logo1');
    } else {
      applyShownState({ hovered: true });
    }

    animateDropdown(item);
  });

  item.addEventListener('mouseleave', (e) => {
    if (isMouseInsideNavOrDropdown(e)) return;

    hideTimer = setTimeout(() => {
      item.classList.remove('active');

      if (window.scrollY <= 5) {
        maybeRemoveHovered();
      } else if (!isNavInteracting()) {
        applyHiddenState();
      }
    }, 200);
  });

  if (dropdown) {
    dropdown.addEventListener('mouseleave', (e) => {
      if (isMouseInsideNavOrDropdown(e)) return;

      hideTimer = setTimeout(() => {
        item.classList.remove('active');

        if (window.scrollY <= 5) {
          maybeRemoveHovered();
        } else if (!isNavInteracting()) {
          applyHiddenState();
        }
      }, 100);
    });
  }
});

// =========================
// Scroll logic
// =========================

function handleScroll(currentScroll) {
  if (isInstagramLightboxOpen()) {
    lastScrollY = currentScroll;
    return;
  }
  const delta = currentScroll - lastScrollY;
  const isAtTop = currentScroll <= 5;

  const scrollingDown = delta > SCROLL_THRESHOLD;
  const scrollingUp = delta < -SCROLL_THRESHOLD;

  if (isAtTop) {
    hasScrolledPastTop = false;
    proximityActive = false;
    navItems.forEach(i => i.classList.remove('active'));
    applyTopState();
    maybeRemoveHovered();
    lastScrollY = currentScroll;
    return;
  }

  if (!hasScrolledPastTop) {
    hasScrolledPastTop = true;
  }

  // If user is interacting with navbar, do not let scroll hide it
  if (isNavInteracting()) {
    applyShownState({ hovered: true });

    const hoveredItem = document.querySelector('.nav-item:hover');
    if (hoveredItem && !hoveredItem.classList.contains('active')) {
      navItems.forEach(i => i.classList.remove('active'));
      hoveredItem.classList.add('active');
      animateDropdown(hoveredItem);
    }

    lastScrollY = currentScroll;
    return;
  }

  if (scrollingDown) {
    navItems.forEach(i => i.classList.remove('active'));
    applyHiddenState();
  } else if (scrollingUp) {
    applyShownState({ hovered: true });

    const hoveredItem = document.querySelector('.nav-item:hover');
    if (hoveredItem) {
      navItems.forEach(i => i.classList.remove('active'));
      hoveredItem.classList.add('active');
      animateDropdown(hoveredItem);
    }
  }

  lastScrollY = currentScroll;
}

// =========================
// Native scroll fallback
// =========================

window.addEventListener('scroll', () => {
  handleScroll(window.scrollY);
});

// =========================
// Lenis support
// =========================

// If Lenis exists, prefer its scroll value.
// This avoids weirdness from relying only on window.scrollY with smooth scrolling.
if (typeof lenis !== 'undefined' && lenis && typeof lenis.on === 'function') {
  lenis.on('scroll', ({ scroll }) => {
    handleScroll(scroll);
  });
}

// =========================
// Button arrow GSAP nudge on hover
// =========================

document.querySelectorAll('.dropbtn, .dropbtn-submit').forEach(btn => {
  const arrow = btn.querySelector('img');
  if (!arrow) return;

  btn.addEventListener('mouseenter', () => {
    gsap.to(arrow, {
      x: 8,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(arrow, {
      x: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  });
});

// =========================
// Proximity reveal/hide
// =========================

function revealNavByProximity() {
  if (isInstagramLightboxOpen()) return;
  clearTimeout(proximityHideTimer);

  if (proximityActive) return;
  proximityActive = true;

  const isAtTop = window.scrollY <= 5;

  if (isAtTop) {
    applyTopState();
    return;
  }

  applyShownState({ hovered: true });
}

function hideNavByProximity() {
  clearTimeout(proximityHideTimer);

  proximityHideTimer = setTimeout(() => {
    const isAtTop = window.scrollY <= 5;

    if (
      nav.matches(':hover') ||
      document.querySelector('.nav-item:hover') ||
      document.querySelector('.dropdown:hover')
    ) {
      return;
    }

    proximityActive = false;

    if (isAtTop) {
      applyTopState();
      maybeRemoveHovered();
    } else {
      applyHiddenState();
    }
  }, HIDE_DELAY);
}

// Mouse near top edge reveals nav
document.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 768) return;

  if (e.clientY <= PROXIMITY_Y) {
    revealNavByProximity();
  } else if (!nav.matches(':hover') && !document.querySelector('.dropdown:hover')) {
    hideNavByProximity();
  }
});

// Leaving navbar reevaluates hide
nav.addEventListener('mouseleave', (e) => {
  if (e.clientY <= PROXIMITY_Y) return;
  hideNavByProximity();
});

document.addEventListener('mouseleave', () => {
  hideNavByProximity();
});