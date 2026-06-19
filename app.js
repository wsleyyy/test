document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");
  const interactiveSide = document.querySelector(".interactive-side");

  // Canvas coordinate space configuration
  const svgW = 500;
  const anchorX = 250; // Dead center of the loop top hanging point
  const anchorY = -10; // Slightly hidden above the viewport boundary
  const restHeight = 335;

  let x = anchorX;
  let y = restHeight;
  let vx = 0;
  let vy = 0;
  
  let targetX = x;
  let targetY = y;
  
  let isDragging = false;
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  const springK = 0.06;  
  const damping = 0.85;  
  const gravity = 0.5;   
  let swingTimer = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;
    const rect = badge.getBoundingClientRect();
    grabOffsetX = clientX - rect.left - (rect.width / 2);
    grabOffsetY = clientY - rect.top;
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    const sideRect = interactiveSide.getBoundingClientRect();
    
    const rawTargetX = ((clientX - sideRect.left) / sideRect.width) * svgW;
    const rawTargetY = clientY - sideRect.top;

    targetX = rawTargetX - grabOffsetX;
    targetY = rawTargetY;

    const dx = targetX - anchorX;
    const dy = targetY - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 500) {
      targetX = anchorX + (dx / dist) * 500;
      targetY = anchorY + (dy / dist) * 500;
    }
  }

  function endDrag() {
    isDragging = false;
  }

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

  function updatePhysics() {
    swingTimer += 0.025;

    if (isDragging) {
      x += (targetX - x) * 0.3;
      y += (targetY - y) * 0.3;
      vx = 0;
      vy = 0;
    } else {
      const restX = anchorX + Math.sin(swingTimer) * 15;
      const restY = restHeight + Math.cos(swingTimer * 2) * 3;

      let ax = (restX - x) * springK;
      let ay = (restY - y) * springK + gravity;

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      x += vx;
      y += vy;
    }

    if (interactiveSide) {
      const sideRect = interactiveSide.getBoundingClientRect();
      const currentPixelX = (x / svgW) * sideRect.width;
      const initialPixelX = (anchorX / svgW) * sideRect.width;
      
      const translateX = currentPixelX - initialPixelX;
      const translateY = y - restHeight;

      const rotation = isDragging ? (targetX - x) * 0.08 : vx * 1.5;
      badge.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg)`;

      // --- THE LACE VISUAL CORRECTION ---
      // Lowered the connection target coordinate down into the metal clip area
      const badgeTopX = x;
      const badgeTopY = y + 16; 

      // Widened the neck-loop span at the top ceiling for a realistic drape profile
      const leftAnchorX = anchorX - 55;
      const rightAnchorX = anchorX + 55;

      // Dynamic path Bezier control handles that react to velocity inertia
      const leftControlX = leftAnchorX + (vx * 0.3);
      const leftControlY = badgeTopY * 0.45;
      const rightControlX = rightAnchorX + (vx * 0.3);
      const rightControlY = badgeTopY * 0.45;

      // Merges both left and right bands seamlessly into a sharp point at the clip
      const pathData = `
        M ${leftAnchorX},${anchorY} 
        C ${leftControlX},${leftControlY} ${badgeTopX - 8},${badgeTopY - 20} ${badgeTopX},${badgeTopY}
        M ${rightAnchorX},${anchorY} 
        C ${rightControlX},${rightControlY} ${badgeTopX + 8},${badgeTopY - 20} ${badgeTopX},${badgeTopY}
      `;

      lacePath.setAttribute("d", pathData);
      lacePathInner.setAttribute("d", pathData);

      // Boost line-weights directly to make the fabric look prominent and distinct
      lacePath.setAttribute("stroke-width", "14");      /* Dark outer edge border */
      lacePathInner.setAttribute("stroke-width", "6");  /* Bright inner neon tracer line */
    }

    requestAnimationFrame(updatePhysics);
  }

  setTimeout(() => {
    updatePhysics();
  }, 50);

  const exploreBtn = document.getElementById('explore-btn');
  const projectsSection = document.getElementById('projects');
  if (exploreBtn && projectsSection) {
    exploreBtn.addEventListener('click', () => {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

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
