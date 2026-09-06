/* ============================================================
   Everleaf — one shared script for all pages.
   Each section only runs if its element exists on the page,
   so this same file is safe to load on every page.

   Features:
     1. Mobile menu (open / close)
     2. Dark mode toggle
     3. Product filter (Shop page)
     4. FAQ accordion (Contact page)
     5. Contact form validation (Contact page)
   ============================================================ */

/* ===== 1. Mobile menu ===== */
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteNav) {
  // Clicking the hamburger button opens or closes the menu.
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });
}

/* ===== 2. Dark mode toggle ===== */
const themeBtn = document.getElementById("theme-toggle");
const themeLabel = document.querySelector(".theme-label");

if (themeBtn) {
  // The <html> tag carries data-theme="dark" or "light".
  // CSS uses this attribute to swap the two colour schemes.
  themeBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    // Keep the button text in sync with the current theme.
    if (themeLabel) {
      themeLabel.textContent = isDark ? "Dark mode" : "Light mode";
    }
  });
}

/* ===== 3. Product filter (Shop page) ===== */
const filterBtns = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll("#product-grid .product-card");

if (filterBtns.length && productCards.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter; // e.g. "kitchen"

      // Mark the clicked button as active.
      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      // Show only cards whose category matches the filter.
      productCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.hidden = !show;
      });
    });
  });
}

/* ===== 4. FAQ accordion (Contact page) ===== */
const accordionBtns = document.querySelectorAll(".accordion-btn");

if (accordionBtns.length) {
  accordionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Each button controls a panel with a matching id.
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (panel) {
        panel.hidden = isOpen; // open when it was closed, and vice versa
      }
    });
  });
}

/* ===== 5. Contact form validation ===== */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  // Rules: each field has an input, an error <p>, and a check function.
  const fields = [
    {
      input: document.getElementById("c-name"),
      error: document.getElementById("c-name-err"),
      check(value) {
        return value.trim().length >= 2 ? "" : "Please enter your name.";
      }
    },
    {
      input: document.getElementById("c-email"),
      error: document.getElementById("c-email-err"),
      check(value) {
        // Very simple pattern: something@something.something
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
          ? "" : "Please enter a valid email address.";
      }
    },
    {
      input: document.getElementById("c-message"),
      error: document.getElementById("c-message-err"),
      check(value) {
        return value.trim().length >= 10 ? "" : "Please write at least 10 characters.";
      }
    }
  ];

  // Show or hide the error message for one field.
  function setError(field, message) {
    field.error.textContent = message;
    field.error.hidden = message === "";
    field.input.classList.toggle("invalid", message !== "");
  }

  // Clear the error as soon as the user starts typing again.
  fields.forEach((field) => {
    field.input.addEventListener("input", () => {
      if (field.error.textContent !== "") setError(field, "");
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the page reloading

    let firstBadField = null;
    let allValid = true;

    // Check every field; remember the first one that fails.
    fields.forEach((field) => {
      const message = field.check(field.input.value);
      setError(field, message);
      if (message) {
        allValid = false;
        if (!firstBadField) firstBadField = field;
      }
    });

    const msg = document.getElementById("form-msg");

    if (!allValid) {
      msg.textContent = "Please fix the highlighted fields.";
      firstBadField.input.focus(); // move the keyboard to the first error
    } else {
      // Prototype only — a real site would send this data to a server.
      msg.textContent = "Thanks! Your message has been sent.";
      contactForm.reset();
    }
  });
}
