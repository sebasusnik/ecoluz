// Type definitions
interface SectionToNavMap {
  [key: string]: string;
}

// DOM ready function
function domReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Initialize all functionality when DOM is ready
domReady(() => {
  initFAQAccordion();
  initScrollToTop();
  initActiveNavigation();
});

// FAQ Accordion functionality
function initFAQAccordion(): void {
  const faqItems = document.querySelectorAll<HTMLElement>(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector<HTMLElement>(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      
      // Close all items
      faqItems.forEach((i) => {
        i.classList.remove("active");
        const answer = i.querySelector<HTMLElement>(".faq-answer");
        if (answer) {
          answer.style.maxHeight = "0";
        }
      });
      
      // Open the clicked item if it wasn't active
      if (!isActive) {
        item.classList.add("active");
        const answer = item.querySelector<HTMLElement>(".faq-answer");
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      }
    });
  });
}

// Scroll to top functionality
function initScrollToTop(): void {
  const topNavbar = document.getElementById("top-navbar");
  const topLogo = document.getElementById("top-logo");
  const scrollChevron = document.getElementById("scroll-chevron");

  // Function to scroll to top
  function scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Add click event to entire navbar (mobile only)
  if (topNavbar) {
    topNavbar.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Don't scroll to top if clicking on navigation links
      if (target.tagName === "A" || target.closest("a")) {
        return;
      }

      // Only scroll to top on mobile (screen width < 768px)
      if (window.innerWidth < 768) {
        scrollToTop();
      }
    });
  }

  // Add click event to logo (works on both desktop and mobile)
  if (topLogo) {
    topLogo.addEventListener("click", scrollToTop);
  }

  // Add click event to chevron
  if (scrollChevron) {
    scrollChevron.addEventListener("click", scrollToTop);
  }

  // Show/hide chevron based on scroll position
  window.addEventListener("scroll", () => {
    if (!scrollChevron) return;
    
    const scrollPosition = window.pageYOffset;
    const showChevronThreshold = 300; // Show chevron after 300px scroll

    if (scrollPosition > showChevronThreshold) {
      scrollChevron.style.opacity = "1";
    } else {
      scrollChevron.style.opacity = "0";
    }
  });
}

// Active navigation system
function initActiveNavigation(): void {
  const navItems = document.querySelectorAll<HTMLElement>(".nav-item");
  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  let clickedTarget: string | null = null;
  let clickTime: number = 0;

  // Mapping of sections to nav items (including intermediate sections)
  const sectionToNavMap: SectionToNavMap = {
    producto: "producto",
    funciona: "producto", // Associate "¿Cómo funciona?" with Producto
    specs: "producto", // Associate "Información Técnica" with Producto
    about: "about",
    testimonios: "about", // Associate "Testimonios" with Empresa
    faq: "faq",
    contacto: "contacto",
  };

  // Function to update active navigation
  function updateActiveNav(targetId: string): void {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });

    const activeItem = document.querySelector<HTMLElement>(`[data-target="${targetId}"]`);
    if (activeItem) {
      activeItem.classList.add("active");
    }
  }

  // Configure Intersection Observer
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "-30% 0px -50% 0px",
    threshold: 0.2,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const navTarget = sectionToNavMap[sectionId];

        if (navTarget) {
          const timeSinceClick = Date.now() - clickTime;

          // If we just clicked, only allow updates after 800ms
          // or if we reached exactly the clicked target
          if (clickedTarget === null || timeSinceClick > 800 || navTarget === clickedTarget) {
            updateActiveNav(navTarget);

            // If we reached the clicked target, clear immediately
            if (navTarget === clickedTarget) {
              clickedTarget = null;
            }

            // Clear the target after some time
            if (timeSinceClick > 1200) {
              clickedTarget = null;
            }
          }
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Smooth navigation on click
  navItems.forEach((item) => {
    item.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const targetId = item.getAttribute("data-target");
      
      if (!targetId) return;
      
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Register the click
        clickedTarget = targetId;
        clickTime = Date.now();

        // Update navigation active state immediately
        updateActiveNav(targetId);

        // Smooth scroll
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
