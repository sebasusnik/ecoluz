// Navigation-related interactions: scroll-to-top & active section highlighting

// Utility to run a callback on DOM ready
function domReady(callback: () => void): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

// Scroll-to-top implementation -------------------------------------------------
function initScrollToTop(): void {
  const topNavbar = document.getElementById("top-navbar");
  const topLogo = document.getElementById("top-logo");
  const scrollChevron = document.getElementById("scroll-chevron");

  function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Entire navbar (mobile) acts as scroll-to-top trigger when tapping empty space
  if (topNavbar) {
    topNavbar.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" || target.closest("a")) return; // ignore nav links
      if (window.innerWidth < 768) scrollToTop();
    });
  }

  if (topLogo) {
    topLogo.addEventListener("click", scrollToTop);
  }

  if (scrollChevron) {
    scrollChevron.addEventListener("click", scrollToTop);
  }

  // Toggle chevron visibility based on scroll position
  window.addEventListener("scroll", () => {
    if (!scrollChevron) return;
    const showChevronThreshold = 300;
    scrollChevron.style.opacity = window.pageYOffset > showChevronThreshold ? "1" : "0";
  });
}

// Active navigation implementation -------------------------------------------
interface SectionToNavMap {
  [key: string]: string;
}

function initActiveNavigation(): void {
  const navItems = document.querySelectorAll<HTMLElement>(".nav-item");
  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  let clickedTarget: string | null = null;
  let clickTime = 0;

  const sectionToNavMap: SectionToNavMap = {
    producto: "producto",
    funciona: "producto",
    specs: "producto",
    about: "about",
    testimonios: "about",
    faq: "faq",
    contacto: "contacto",
  };

  function updateActiveNav(targetId: string): void {
    navItems.forEach((item) => item.classList.remove("active"));
    const activeItem = document.querySelector<HTMLElement>(`[data-target="${targetId}"]`);
    activeItem?.classList.add("active");
  }

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "-30% 0px -50% 0px",
    threshold: 0.2,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const sectionId = entry.target.id;
      const navTarget = sectionToNavMap[sectionId];
      if (!navTarget) return;

      const timeSinceClick = Date.now() - clickTime;
      if (clickedTarget === null || timeSinceClick > 800 || navTarget === clickedTarget) {
        updateActiveNav(navTarget);
        if (navTarget === clickedTarget) clickedTarget = null;
        if (timeSinceClick > 1200) clickedTarget = null;
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // Smooth scroll on nav click
  navItems.forEach((item) => {
    item.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const targetId = item.getAttribute("data-target");
      if (!targetId) return;
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      clickedTarget = targetId;
      clickTime = Date.now();
      updateActiveNav(targetId);
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

domReady(() => {
  initScrollToTop();
  initActiveNavigation();
});

export {}; 