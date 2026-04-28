const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("[data-page]");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function showPage(pageId) {
  const target = document.getElementById(pageId) ? pageId : "home";

  pages.forEach((page) => {
    page.classList.toggle("active", page.id === target);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.page === target);
  });

  if (mainNav) {
    mainNav.classList.remove("open");
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pageId = link.dataset.page;
    history.pushState(null, "", `#${pageId}`);
    showPage(pageId);
  });
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

window.addEventListener("popstate", () => {
  showPage(location.hash.replace("#", "") || "home");
});

showPage(location.hash.replace("#", "") || "home");
