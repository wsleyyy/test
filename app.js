document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");
  const interactiveSide = document.querySelector(".interactive-side");

  // Normalized coordinate canvas mapping configurations
  const svgW = 500;
  const anchorX = 250; // Dead center of the layout top ceiling 
  const anchorY = -5;  // Tucked neatly beyond the top edge framework
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
    // Anchor offset targeting calculations
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

  // Input bindings
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

      // --- CRITICAL CONNECTION & STYLE CORRECTIONS ---
      // Lowers coordinate baseline to drop exactly inside the metallic clip matrix bounds
      const badgeTopX = x;
      const badgeTopY = y + 15; 

      // Spans the neck attachment loops perfectly at the top edge ceiling
      const leftAnchorX = anchorX - 45;
      const rightAnchorX = anchorX + 45;

      const leftControlX = leftAnchorX + (vx * 0.3);
      const leftControlY = badgeTopY * 0.45;
      const rightControlX = rightAnchorX + (vx * 0.3);
      const rightControlY = badgeTopY * 0.45;

      // Merges paths cleanly to loop smoothly without overlapping lines
      const pathData = `
        M ${leftAnchorX},${anchorY} 
        C ${leftControlX},${leftControlY} ${badgeTopX - 6},${badgeTopY - 15} ${badgeTopX},${badgeTopY}
        M ${rightAnchorX},${anchorY} 
        C ${rightControlX},${rightControlY} ${badgeTopX + 6},${badgeTopY - 15} ${badgeTopX},${badgeTopY}
      `;

      lacePath.setAttribute("d", pathData);
      lacePathInner.setAttribute("d", pathData);

      // Force heavy fabric line weight profiles
      lacePath.setAttribute("stroke-width", "16");
      lacePathInner.setAttribute("stroke-width", "16"); // Matches outer to hide the inner blue line completely

      // Enforce clean, uniform dark-gray coloring across elements directly to override HTML
      lacePath.setAttribute("stroke", "#334155");      // Elegant solid slate/gray color
      lacePathInner.setAttribute("stroke", "#334155"); // Overwrites neon tracer to match uniform fill
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
