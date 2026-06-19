document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const interactiveSide = document.querySelector(".interactive-side");

  let anchorX = window.innerWidth * 0.75;
  const restHeight = 335;

  function updateAnchor() {
    if (interactiveSide) {
      const rect = interactiveSide.getBoundingClientRect();
      anchorX = rect.left + (rect.width / 2);
    }
  }
  updateAnchor();
  window.addEventListener("resize", updateAnchor);

  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;
  
  let targetX = 0;
  let targetY = 0;
  
  let isDragging = false;
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  const springK = 0.06;  
  const damping = 0.85;  
  const gravity = 0.4;   
  let swingTimer = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;
    const rect = badge.getBoundingClientRect();
    grabOffsetX = clientX - rect.left - (rect.width / 2);
    grabOffsetY = clientY - rect.top;
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    updateAnchor();
    const sideRect = interactiveSide.getBoundingClientRect();
    
    const localTargetX = clientX - (sideRect.left + sideRect.width / 2);
    const localTargetY = clientY - restHeight;

    targetX = localTargetX - grabOffsetX;
    targetY = localTargetY - grabOffsetY;

    // Safety extension constraints limit
    const dist = Math.sqrt(targetX * targetX + targetY * targetY);
    if (dist > 400) {
      targetX = (targetX / dist) * 400;
      targetY = (targetY / dist) * 400;
    }
  }

  function endDrag() {
    isDragging = false;
  }

  // Inputs Handlers
  badge.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", endDrag);

  badge.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchend", endDrag);

  // Core Physics Loop
  function updatePhysics() {
    swingTimer += 0.025;

    if (isDragging) {
      x += (targetX - x) * 0.3;
      y += (targetY - y) * 0.3;
      vx = 0;
      vy = 0;
    } else {
      const restX = Math.sin(swingTimer) * 15;
      const restY = Math.cos(swingTimer * 2) * 3;

      let ax = (restX - x) * springK;
      let ay = (restY - y) * springK + gravity;

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      x += vx;
      y += vy;
    }

    const rotation = isDragging ? (targetX - x) * 0.08 : vx * 1.5;
    badge.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

    requestAnimationFrame(updatePhysics);
  }

  updatePhysics();

  // Scroll Routine
  const exploreBtn = document.getElementById('explore-btn');
  const projectsSection = document.getElementById('projects');
  if (exploreBtn && projectsSection) {
    exploreBtn.addEventListener('click', () => {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Cards Observer 
  const cards = document.querySelectorAll('.project-card');
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => revealOnScroll.observe(card));
});
