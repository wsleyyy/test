document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");
  const interactiveSide = document.querySelector(".interactive-side");

  // Dynamic Anchor points mapping cleanly to relative window boundaries
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

  // Resting coordinates setup
  const restHeight = 320; 
  let x = anchorX;
  let y = restHeight; 
  let vx = 0;
  let vy = 0;
  
  let targetX = x;
  let targetY = y;
  
  let isDragging = false;
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  // Spring & Drag physics variables
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

    // Safety tension constraints limit
    const dx = targetX - anchorX;
    const dy = targetY - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 550) { 
      targetX = anchorX + (dx / dist) * 550;
      targetY = anchorY + (dy / dist) * 550;
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

  // Real-time Animation Loop
  function updatePhysics() {
    swingTimer += 0.02;

    if (isDragging) {
      x += (targetX - x) * 0.25;
      y += (targetY - y) * 0.25;
      vx = 0;
      vy = 0;
    } else {
      // Small ambient automated swinging loop calculations
      const restX = anchorX + Math.sin(swingTimer) * 20; 
      const restY = restHeight + Math.cos(swingTimer * 2) * 4;

      let ax = (restX - x) * springK;
      let ay = (restY - y) * springK + gravity;

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      x += vx;
      y += vy;
    }

    // Translate coordinates onto the physical Badge item 
    const rotation = isDragging ? (targetX - x) * 0.06 : vx * 1.2;
    badge.style.transform = `translate3d(${x - anchorX}px, ${y - restHeight}px, 0) rotate(${rotation}deg)`;

    // RELATIVE COORDINATE RESOLUTION FOR SVG SPACE
    if (interactiveSide) {
      const sideRect = interactiveSide.getBoundingClientRect();
      
      // Calculate where the clip sits relative to the SVG viewable box
      const svgClipX = x - sideRect.left;
      const svgClipY = y; 
      const svgAnchorX = sideRect.width / 2;

      // Draw a natural curving loop profile via Cubic Bezier control handles
      const leftControlX = svgAnchorX - 60 + (vx * 0.5);
      const leftControlY = svgClipY * 0.35;
      
      const rightControlX = svgAnchorX + 60 + (vx * 0.5);
      const rightControlY = svgClipY * 0.35;

      const pathData = `
        M ${svgAnchorX - 25},${anchorY} 
        C ${leftControlX},${leftControlY} ${svgClipX - 15},${svgClipY - 30} ${svgClipX},${svgClipY}
        M ${svgAnchorX + 25},${anchorY} 
        C ${rightControlX},${rightControlY} ${svgClipX + 15},${svgClipY - 30} ${svgClipX},${svgClipY}
      `;
      
      lacePath.setAttribute("d", pathData);
      lacePathInner.setAttribute("d", pathData);
    }

    requestAnimationFrame(updatePhysics);
  }

  // Confirm parameters are initialized clean
  setTimeout(() => {
    updateAnchor();
    x = anchorX;
    y = restHeight;
    updatePhysics();
  }, 100);

  // Smooth Scroll
  const exploreBtn = document.getElementById('explore-btn');
  const projectsSection = document.getElementById('projects');
  if (exploreBtn && projectsSection) {
    exploreBtn.addEventListener('click', () => {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Reveal Cards engine
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
