document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("id-badge");
  const lacePath = document.getElementById("lace-path");
  const lacePathInner = document.getElementById("lace-path-inner");
  const interactiveSide = document.querySelector(".interactive-side");

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

    const rotation = isDragging ? (targetX - x) * 0.06 : vx * 1.2;
    badge.style.transform = `translate3d(${x - anchorX}px, ${y - restHeight}px, 0) rotate(${rotation}deg)`;

    if (interactiveSide) {
      const svgClipX = x - rect.left;
      const svgClipY = y - rect.top; 
      const svgAnchorX = rect.width / 2;

      // Real screen pixel control handles
      const leftControlX = svgAnchorX - 50 + (vx * 0.5);
      const leftControlY = svgClipY * 0.45;
      const rightControlX = svgAnchorX + 50 + (vx * 0.5);
      const rightControlY = svgClipY * 0.45;

      // DROPS BOTH BANDS DEEP INTO THE CENTER OF THE METAL CLIP
      const pathData = `
        M ${svgAnchorX - 25},0 
        C ${leftControlX},${leftControlY} ${svgClipX - 10},${svgClipY - 10} ${svgClipX},${svgClipY + 14}
        M ${svgAnchorX + 25},0 
        C ${rightControlX},${rightControlY} ${svgClipX + 10},${svgClipY - 10} ${svgClipX},${svgClipY + 14}
      `;
      
      lacePath.setAttribute("d", pathData);
      lacePathInner.setAttribute("d", pathData);

      // FORCE SOLID FABRIC THICKNESS
      lacePath.setAttribute("stroke-width", "16");
      lacePathInner.setAttribute("stroke-width", "6");
    }

    requestAnimationFrame(updatePhysics);
  }

  setTimeout(() => {
    const rect = interactiveSide.getBoundingClientRect();
    x = rect.left + (rect.width / 2);
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

  // Cards Reveal
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
