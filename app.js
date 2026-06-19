document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");

  // Hook point where lace connects to ceiling anchor
  const anchorX = window.innerWidth / 4 * 3; // Right side center
  const anchorY = 0;

  // Badge state variables
  let x = anchorX;
  let y = 220; 
  let vx = 0;
  let vy = 0;
  
  let targetX = x;
  let targetY = y;
  
  let isDragging = false;
  let pointerX = 0;
  let pointerY = 0;
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  // Spring & Swing settings
  const springK = 0.08; 
  const damping = 0.92; 
  const gravity = 0.4;
  let swingTimer = 0;

  // 1. DRAG EVENT LISTENERS
  badge.addEventListener("mousedown", (e) => {
    isDragging = true;
    grabOffsetX = e.clientX - x;
    grabOffsetY = e.clientY - y;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    pointerX = e.clientX;
    pointerY = e.clientY;
    
    targetX = pointerX - grabOffsetX;
    targetY = pointerY - grabOffsetY;

    // Limit maximum stretch range to avoid broken physics layouts
    const dx = targetX - anchorX;
    const dy = targetY - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 500) {
      targetX = anchorX + (dx / dist) * 500;
      targetY = anchorY + (dy / dist) * 500;
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Support Mobile/Touch Devices
  badge.addEventListener("touchstart", (e) => {
    isDragging = true;
    const touch = e.touches[0];
    grabOffsetX = touch.clientX - x;
    grabOffsetY = touch.clientY - y;
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    targetX = touch.clientX - grabOffsetX;
    targetY = touch.clientY - grabOffsetY;
  });

  window.addEventListener("touchend", () => { isDragging = false; });

  // 2. PHYSICS ANIMATION LOOP
  function updatePhysics() {
    swingTimer += 0.03;

    if (isDragging) {
      // Track pointer directly
      x += (targetX - x) * 0.3;
      y += (targetY - y) * 0.3;
      vx = 0;
      vy = 0;
    } else {
      // Resting position adds a small ambient loop swing animation
      const restX = anchorX + Math.sin(swingTimer) * 20; 
      const restY = 220 + Math.cos(swingTimer * 2) * 4;

      // Spring acceleration formulas
      let ax = (restX - x) * springK;
      let ay = (restY - y) * springK + gravity;

      vx = (vx + ax) * damping;
      vy = (vy + ay) * damping;

      x += vx;
      y += vy;
    }

    // Apply 2D hardware-accelerated transforms onto the ID Badge
    // Subtle rotation added based on horizontal velocity vector
    const rotation = isDragging ? (targetX - x) * 0.1 : vx * 1.2;
    badge.style.transform = `translate3d(${x - (window.innerWidth / 4 * 3)}px, ${y - 220}px, 0) rotate(${rotation}deg)`;

    // 3. DRAW STRINGS (LANYARD LACE)
    // Creates a realistic curved rope profile using bezier anchor coordinates
    const badgeTopX = x;
    const badgeTopY = y;
    
    // Control point splits the lace path into natural dangling loops
    const controlX = (anchorX + badgeTopX) / 2 + (vx * 2);
    const controlY = (anchorY + badgeTopY) / 2 + 60;

    const pathData = `M ${anchorX - 30},${anchorY} Q ${controlX},${controlY} ${badgeTopX},${badgeTopY} M ${anchorX + 30},${anchorY} Q ${controlX},${controlY} ${badgeTopX},${badgeTopY}`;
    
    lacePath.setAttribute("d", pathData);
    lacePathInner.setAttribute("d", pathData);

    requestAnimationFrame(updatePhysics);
  }

  // Initialize loop
  updatePhysics();
});
