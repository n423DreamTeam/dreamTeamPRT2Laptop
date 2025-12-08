document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".navbar nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
      }
    });
  }
});
