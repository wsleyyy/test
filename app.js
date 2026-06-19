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
    const anchorX =
