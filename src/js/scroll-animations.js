// Scroll-triggered animations

// Function to check if element is in viewport
function isInViewport(element, offset = 100) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0
  );
}

// Function to add animation class when element enters viewport
function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");

  elements.forEach((element, index) => {
    if (isInViewport(element)) {
      // Add a small delay based on element index for stagger effect
      setTimeout(() => {
        element.classList.add("is-visible");
      }, index * 100);
    }
  });
}

// Initialize scroll animations
function initScrollAnimations() {
  // Add animate-on-scroll class to elements that should animate
  const selectors = [
    ".stat-card",
    ".info-card",
    ".section",
    ".unlock-item",
    ".puzzle-section",
    ".puzzle-objective",
    ".player",
    ".leaderboard-list li",
    ".banner",
    ".reward-card",
    ".chat-container",
    ".player-card",
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (!element.classList.contains("animate-on-scroll")) {
        element.classList.add("animate-on-scroll");
      }
    });
  });

  // Run animation check on scroll
  animateOnScroll();

  // Throttle scroll event for performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        animateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Also check on page load and resize
  window.addEventListener("load", animateOnScroll);
  window.addEventListener("resize", animateOnScroll);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollAnimations);
} else {
  initScrollAnimations();
}

export { initScrollAnimations };
