const nav = document.querySelector('.navbar');
const navItems = document.querySelectorAll('.nav-item');
const logoImg = document.querySelector('.logo1');

let hideTimer;
let lastScrollY = 0;
let logoState = 'logo1';
let hasScrolledPastTop = false;

// 🔹 Check if mouse is inside nav or dropdown
function isMouseInsideNavOrDropdown(e) {
  const related = e.relatedTarget;
  return related && (nav.contains(related) || document.querySelector('.dropdown:hover'));
}

// 🔹 Remove navbar hover state if at top and not active
function maybeRemoveHovered() {
  const isDropdownActive = document.querySelector('.nav-item.active');
  const isNavHovered = nav.matches(':hover');

  if (window.locoScroll.scroll.instance.scroll.y <= 0 && !isDropdownActive && !isNavHovered) {
    nav.classList.remove('hovered', 'navbar-bg');
  }
}

// 🔹 Animate dropdown items with GSAP
function animateDropdown(item) {
  const dropdown = item.querySelector('.dropdown');
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
}

/*

function animateDropdown(item) {
  const dropdown = item.querySelector('.dropdown');
  const text = dropdown.querySelector('.dropdown-text');
  const images = dropdown.querySelectorAll('.image-box, .image-box2');

  const targets = [text, ...images].filter(Boolean);

  if (targets.length > 0) {
    gsap.killTweensOf(targets);
    gsap.set(targets, { opacity: 0, y: -10 }); // Start slightly above

    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  }
}  
*/

// 🔹 Navbar mouse events
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

// 🔹 Dropdown triggers
navItems.forEach(item => {
  const dropdown = item.querySelector('.dropdown');
  const trigger = item.querySelector('a');

  trigger.addEventListener('mouseenter', () => {
    clearTimeout(hideTimer);
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    nav.classList.add('hovered', 'navbar-bg');
    nav.classList.remove('hidden');
    nav.classList.add('scrolled-up');

    animateDropdown(item);
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

// 🔹 Scroll behavior logic
function handleScroll(currentScroll) {
  const scrollingDown = currentScroll > lastScrollY;
  const scrollingUp = currentScroll < lastScrollY;

  navItems.forEach(i => i.classList.remove('active'));

  if (currentScroll <= 0) {
    // Top of page
    nav.classList.remove('hidden', 'scrolled-up', 'navbar-bg');
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

  if (!hasScrolledPastTop) {
    hasScrolledPastTop = true;
  }

  if (scrollingDown) {
    // Scrolling down → hide navbar
    nav.classList.add('hidden');
    nav.classList.remove('scrolled-up', 'at-top', 'navbar-bg');
  } else if (scrollingUp) {
    // Scrolling up → show navbar
    nav.classList.remove('hidden');
    nav.classList.add('scrolled-up', 'hovered', 'navbar-bg');
    nav.classList.remove('at-top');

    if (logoState !== 'logo2') {
      logoImg.src = 'images/logo2.png';
      logoState = 'logo2';
    }

    // 🔹 If mouse is already over a nav-item, show its dropdown immediately
    const hoveredItem = document.querySelector('.nav-item:hover');
    if (hoveredItem) {
      hoveredItem.classList.add('active');
      animateDropdown(hoveredItem);
    }
  }

  lastScrollY = currentScroll;
}

// 🔹 Use Locomotive's scroll event
if (window.locoScroll) {
  window.locoScroll.on('scroll', (args) => {
    const scrollY = args.scroll.y;
    handleScroll(scrollY);
  });
} else {
  window.addEventListener('scroll', () => handleScroll(window.scrollY));
}

// 🔹 Button arrow GSAP nudge on hover
document.querySelectorAll('.dropbtn, .dropbtn-submit').forEach(btn => {
  const arrow = btn.querySelector('img');

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