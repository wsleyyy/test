document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");
  const interactiveSide = document.querySelector(".interactive-side");

  // Ceiling anchor point where the lace hangs from
  let anchorX = window.innerWidth * 0.75;
  let anchorY = 0;

  function updateAnchor() {
    if (interactiveSide) {
      const rect = interactiveSide.getBoundingClientRect();
      anchorX = rect.left + (rect.width / 2);
    } else {
      anchorX = window.innerWidth * 0.75;
    }
  }
  updateAnchor();
  window.addEventListener("resize", updateAnchor);

  // Initial resting parameters
  const restHeight = 350; 
  let x = anchorX;
  let y = restHeight; 
  let vx = 0;
  let vy = 0;
  
  let targetX = x;
  let targetY = y;
  
  let isDragging = false;
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  // Optimized Tension Physics
  const springK = 0.06;  
  const damping = 0.90;  
  const gravity = 0.6;   
  let swingTimer = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;
    grabOffsetX = clientX - x;
    grabOffsetY = clientY - y;
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    targetX = clientX - grabOffsetX;
    targetY = clientY - grabOffsetY;

    // Safety extension constraints limit
    const dx = targetX - anchorX;
    const dy = targetY - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 600) { 
      targetX = anchorX + (dx / dist) * 600;
      targetY = anchorY + (dy / dist) * 600;
    }
  }

  function endDrag() {
    isDragging = false;
  }

  // Mouse Inputs
  badge.addEventListener("mousedown", (e) => {
    e.preventDefault(); 
    startDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", endDrag);

  // Touch Inputs
  badge.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchend", endDrag);

  // Physics Loop Execution Engine
  function updatePhysics() {
    swingTimer += 0.02;

    if (isDragging) {
      x += (targetX - x) * 0.25;
      y += (targetY - y) * 0.25;
      vx = 0;
      vy = 0;
    } else {
      // Small ambient swinging loop parameters
      const restX = anchorX + Math.sin(swingTimer) * 25; 
      const restY = restHeight + Math.cos(swingTimer * 2) * 5;

      let ax = (restX - x) * springK;
      let ay = (restY - y) * springK + gravity;

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      x += vx;
      y += vy;
    }

    // Apply 3D translate offsets to badge
    const rotation = isDragging ? (targetX - x) * 0.06 : vx * 1.0;
    badge.style.transform = `translate3d(${x - anchorX}px, ${y - restHeight}px, 0) rotate(${rotation}deg)`;

    // Draw the full length parabolic neck lace path
    const badgeTopX = x;
    const badgeTopY = y + 15; 

    const leftControlX = anchorX - 80 + (vx * 0.5);
    const leftControlY = (anchorY + badgeTopY) * 0.4;
    
    const rightControlX = anchorX + 80 + (vx * 0.5);
    const rightControlY = (anchorY + badgeTopY) * 0.4;

    const pathData = `
      M ${anchorX - 40},${anchorY} 
      C ${leftControlX},${leftControlY} ${badgeTopX - 20},${badgeTopY - 40} ${badgeTopX},${badgeTopY}
      M ${anchorX + 40},${anchorY} 
      C ${rightControlX},${rightControlY} ${badgeTopX + 20},${badgeTopY - 40} ${badgeTopX},${badgeTopY}
    `;
    
    lacePath.setAttribute("d", pathData);
    lacePathInner.setAttribute("d", pathData);

    requestAnimationFrame(updatePhysics);
  }

  setTimeout(() => {
    updateAnchor();
    x = anchorX;
    y = restHeight;
    updatePhysics();
  }, 100);

  // Scroll Routine
  const exploreBtn = document.getElementById('explore-btn');
  const projectsSection = document.getElementById('projects');
  if (exploreBtn && projectsSection) {
    exploreBtn.addEventListener('click', () => {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // INTERACTIVE SCROLL REVEAL FOR WORK CARDS
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
