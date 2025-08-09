// Optional passive mouse tracking for subtle parallax effect
// This script updates CSS variables --mouseX and --mouseY for the animated background

function initAnimatedBackgroundMouse() {
  let rafId = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  function updateMousePosition() {
    document.documentElement.style.setProperty('--mouseX', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouseY', `${mouseY}px`);
    rafId = null;
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Use requestAnimationFrame to throttle updates
    if (!rafId) {
      rafId = requestAnimationFrame(updateMousePosition);
    }
  }

  // Add passive event listener for better performance
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initAnimatedBackgroundMouse);
}

export { initAnimatedBackgroundMouse };
