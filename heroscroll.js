
  const images = [
    "images/Photo 1 Luis Fonsi.jpg",
    "images/Photo 2 Missions.JPG",
    "images/Photo 3 Kansas City.jpg",
    "images/Photo 4 SA300.jpg",
    "images/Photo 5 Leg Summit.png",
    "images/Photo 6 Kamala.jpeg",
    "images/Photo 7 HACR.jpg"
  ];

  const content = [
    {
      title: "Creating Impactful Experiences",
      text: "Unico is a full-service events firm working nationwide with non-profits and corporate partners."
    },
    {
      title: "Mission Driven Moments",
      text: "From strategy to execution, we build unforgettable experiences aligned with your mission."
    },
    {
      title: "Voices of \nKansas City",
      text: "Events that empower local communities and amplify purpose across the Midwest."
    },
    {
      title: "Celebrating \nSan Antonio",
      text: "Bringing people together through thoughtful programming and cultural celebration."
    },
    {
      title: "Legacy In Motion",
      text: "Leadership, equity, and vision come to life in every detail of our summits."
    },
    {
      title: "With Leaders Nationwide",
      text: "Unico works alongside national changemakers to shape events that matter."
    },
    {
      title: "Power of Community",
      text: "From intimate gatherings to large-scale productions, our team delivers with purpose."
    }
  ];

  let currentIndex = 0;
  let activeBg = 1;

  const bg1 = document.getElementById("bg1");
  const bg2 = document.getElementById("bg2");
  const dotsContainer = document.getElementById("dotContainer");

  images.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateBackground(true);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function updateBackground(manual = false) {
    const nextBg = activeBg === 1 ? bg2 : bg1;
    const currentBg = activeBg === 1 ? bg1 : bg2;

    // Change background image
    nextBg.style.backgroundImage = `url('${images[currentIndex]}')`;
    nextBg.classList.add("visible");
    currentBg.classList.remove("visible");

    const h1 = document.querySelector("h1");
    const p = document.querySelector(".page-container p");

    // Kill any ongoing animations
    gsap.killTweensOf([h1, p]);

    // Set initial (offscreen) state
    gsap.set(h1, { y: 20, opacity: 0 });
    gsap.set(p, { y: 0, opacity: 0 });

    // Set content
    h1.innerHTML = content[currentIndex].title.replace(/\n/g, "<br>");
    p.textContent = content[currentIndex].text;

    // Animate in
    gsap.to(h1, {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.3,
      ease: "power2.out"
    });

    gsap.to(p, {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.6,
      ease: "power2.out"
    });

    // Update background tracker
    activeBg = activeBg === 1 ? 2 : 1;

    // Update dot indicator
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");

    // Reset autoplay
    if (manual) resetAutoScroll();
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateBackground(true);
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateBackground(true);
  }

  document.getElementById("nextBtn").addEventListener("click", goNext);
  document.getElementById("prevBtn").addEventListener("click", goPrev);

  let autoScrollInterval = setInterval(goNext, 8000);
  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(goNext, 8000);
  }

  updateBackground();
