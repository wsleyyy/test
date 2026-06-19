document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");
  const laceSvg = document.getElementById("lace-svg");
  const interactiveSide = document.querySelector(".interactive-side");

  // Resting configuration (matching your original working layout setup)
  const restHeight = 320; 
  let x = window.innerWidth * 0.75;
  let y = restHeight; 
  let vx = 0;
  let vy = 0;
  
  let targetX = x;
  let targetY = y;
  
  let isDragging = false;
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  const springK = 0.05;  
  const damping = 0.88;  
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

    // Boundary physics pull limit
    const rect = interactiveSide.getBoundingClientRect();
    const anchorX = rect.left + (rect.width / 2);
    const dx = targetX - anchorX;
    const dy = targetY - 0;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 550) { 
      targetX = anchorX + (dx / dist) * 550;
      targetY = (dy / dist) * 550;
    }
  }

  function endDrag() {
    isDragging = false;
  }

  // Mouse Handlers
  badge.addEventListener("mousedown", (e) => {
    e.preventDefault(); 
    startDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", endDrag);

  // Touch Handlers
  badge.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchend", endDrag);

  // Core Render Loop
  function updatePhysics() {
    swingTimer += 0.02;

    const rect = interactiveSide.getBoundingClientRect();
    const anchorX = rect.left + (rect.width / 2);

    if (isDragging) {
      x += (targetX - x) * 0.25;
      y += (targetY - y) * 0.25;
      vx = 0;
      vy = 0;
    } else {
      const restX = anchorX + Math.sin(swingTimer) * 20; 
      const restY = restHeight + Math.cos(swingTimer * 2) * 4;

      let ax = (restX - x) * springK;
      let ay = (restY - y) * springK + gravity;

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      x += vx;
      y += vy;
    }

    // Returns normal working dragging translation matrices onto badge item
    const rotation = isDragging ? (targetX - x) * 0.06 : vx * 1.2;
    badge.style.transform = `translate3d(${x - anchorX}px, ${y - restHeight}px, 0) rotate(${rotation}deg)`;

    // RELATIVE TRACKING FOR THE LACE PATHS
    if (interactiveSide) {
      // Maps screen coordinate offsets onto local SVG space pixels perfectly
      const svgClipX = x - rect.left;
      const svgClipY = y - rect.top; 
      const svgAnchorX = rect.width / 2;

      // Generates the control lines handles
      const leftControlX = svgAnchorX - 40 + (vx * 0.5);
      const leftControlY = svgClipY * 0.4;
      const rightControlX = svgAnchorX + 40 + (vx * 0.5);
      const rightControlY = svgClipY * 0.4;

      // Renders path directly down to the center point of the silver badge clip
      const pathData = `
        M ${svgAnchorX - 15},0 
        C ${leftControlX},${leftControlY} ${svgClipX - 8},${svgClipY - 15} ${svgClipX},${svgClipY + 12}
        M ${svgAnchorX + 15},0 
        C ${rightControlX},${rightControlY} ${svgClipX + 8},${svgClipY - 15} ${svgClipX},${svgClipY + 12}
      `;
      
      lacePath.setAttribute("d", pathData);
      lacePathInner.setAttribute("d", pathData);

      // FORCE THICK FABRIC LANYARD PROFILE STRAPS
      lacePath.setAttribute("stroke-width", "14");       /* Deep dark blue outline strap width */
      lacePathInner.setAttribute("stroke-width", "5");   /* Light cyan core inner trace width */
    }

    requestAnimationFrame(updatePhysics);
  }

  // Setup init execution
  setTimeout(() => {
    const rect = interactiveSide.getBoundingClientRect();
    x = rect.left + (rect.width / 2);
    y = restHeight;
    updatePhysics();
  }, 100);

  // Simple Scroll Handler
  const exploreBtn = document.getElementById('explore-btn');
  const projectsSection = document.getElementById('projects');
  if (exploreBtn && projectsSection) {
    exploreBtn.addEventListener('click', () => {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Cards Scroll Reveal Routine
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
