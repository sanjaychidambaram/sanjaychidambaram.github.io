const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (form) {
  const inputs = form.querySelectorAll("input, textarea");
  const textarea = form.querySelector("textarea");
  
  // Auto-expand textarea
  if (textarea) {
    const autoExpand = () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 400) + "px";
    };
    
    textarea.addEventListener("input", autoExpand);
    textarea.addEventListener("keydown", autoExpand);
  }
  
  // Add focus and blur listeners for better UX
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.style.opacity = "1";
    });
    
    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        input.parentElement.style.opacity = "0.7";
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get("name") || "").trim();
    const email = (formData.get("email") || "").trim();
    const message = (formData.get("message") || "").trim();

    // Validation
    if (!name || !email || !message) {
      formNote.textContent = "Please fill in all fields.";
      formNote.style.color = "#ef4444";
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formNote.textContent = "Please enter a valid email address.";
      formNote.style.color = "#ef4444";
      return;
    }

    // Message length validation
    if (message.length < 10) {
      formNote.textContent = "Message should be at least 10 characters.";
      formNote.style.color = "#ef4444";
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector("button");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formNote.textContent = `Thanks ${name}! I received your message and will get back to you within a business day.`;
        formNote.style.color = "#16a34a";
        form.reset();
        if (textarea) {
          textarea.style.height = "auto";
        }
      } else {
        formNote.textContent = "Something went wrong. Please try again.";
        formNote.style.color = "#ef4444";
      }
    } catch (error) {
      formNote.textContent = "Network error. Please try again.";
      formNote.style.color = "#ef4444";
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Clear message after 5 seconds
      setTimeout(() => {
        formNote.textContent = "";
      }, 5000);
    }
  });
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealTargets = document.querySelectorAll(
  ".hero-grid > div, .hero-card, .stats > div, .section-header, .card, .pill-grid span, .about > div, .about-card, .contact > div, .contact-form, .footer-content"
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  if (!prefersReducedMotion) {
    const delay = Math.min(index * 0.06, 0.4);
    element.style.transitionDelay = `${delay}s`;
  }
});

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}
