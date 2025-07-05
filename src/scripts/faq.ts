// FAQ Accordion functionality scoped to FAQ section

// Utility to run callback when DOM is ready
function domReady(callback: () => void): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

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

domReady(initFAQAccordion);

export {}; 