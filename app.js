document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");
  const interactiveSide = document.querySelector(".interactive-side");

  // Dynamic Anchor calculation based on container coordinates
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

  // Core coordinates
  let x = anchorX;
  let y = 220; 
  let vx = 0;
  let vy = 0;
  
  let targetX = x;
  let targetY = y;
  
  let isDragging = false;
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  // Spring Physics Variables
  const springK = 0.08; 
  const damping = 0.88; 
  const gravity = 0.5;
  let swingTimer = 0;

  // Drag handlers
  function startDrag(clientX, clientY) {
    isDragging = true;
    grabOffsetX = clientX - x;
    grabOffsetY = clientY - y;
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    targetX = clientX - grabOffsetX;
    targetY = clientY - grabOffsetY;

    // Safety constraint limits
    const dx = targetX - anchorX;
    const dy = targetY - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 450) {
      targetX = anchorX + (dx / dist) * 450;
      targetY = anchorY + (dy / dist) * 450;
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

  // Mobile/Touch Inputs
  badge.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchend", endDrag);

  // Continuous Integration Loop
  function updatePhysics() {
    swingTimer += 0.025;

    if (isDragging) {
      x += (targetX - x) * 0.25;
      y += (targetY - y) * 0.25;
      vx = 0;
      vy = 0;
    } else {
      // Small automated natural swinging parameters
      const restX = anchorX + Math.sin(swingTimer) * 15; 
      const restY = 220 + Math.cos(swingTimer * 2) * 3;

      let ax = (restX - x) * springK;
      let ay = (restY - y) * springK + gravity;

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      x += vx;
      y += vy;
    }

    // Apply 3D matrix offset to layout container
    const rotation = isDragging ? (targetX - x) * 0.08 : vx * 1.2;
    badge.style.transform = `translate3d(${x - anchorX}px, ${y - 220}px, 0) rotate(${rotation}deg)`;

    // Redraw vector cord paths
    const controlX = (anchorX + x) / 2;
    const controlY = (anchorY + y) / 2 + 50;

    const pathData = `M ${anchorX - 25},${anchorY} Q ${controlX},${controlY} ${x},${y} M ${anchorX + 25},${anchorY} Q ${controlX},${controlY} ${x},${y}`;
    
    lacePath.setAttribute("d", pathData);
    lacePathInner.setAttribute("d", pathData);

    requestAnimationFrame(updatePhysics);
  }

  // Handle anchor visibility check before launching loop run
  setTimeout(() => {
    updateAnchor();
    x = anchorX;
    updatePhysics();
  }, 100);

  // 3. EXPLORE BUTTON ACTION SMOOTH SCROLL ROUTINE
  const exploreBtn = document.getElementById('explore-btn');
  const projectsSection = document.getElementById('projects');
  if (exploreBtn && projectsSection) {
    exploreBtn.addEventListener('click', () => {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
