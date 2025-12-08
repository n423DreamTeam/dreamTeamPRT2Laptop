function isInViewport(element, offset = 100) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0
  );
}

function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");

  elements.forEach((element, index) => {
    if (isInViewport(element)) {
      setTimeout(() => {
        element.classList.add("is-visible");
      }, index * 100);
    }
  });
}

function initScrollAnimations() {
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

  animateOnScroll();

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

  window.addEventListener("load", animateOnScroll);
  window.addEventListener("resize", animateOnScroll);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollAnimations);
} else {
  initScrollAnimations();
}

export { initScrollAnimations };
