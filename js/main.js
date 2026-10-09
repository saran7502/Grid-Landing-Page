(() => {
  const body = document.body;
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  const navLinks = nav ? [...nav.querySelectorAll(".nav__link")] : [];

  if (!toggle || !nav) return;

  let lastFocused = null;

  const getFocusable = () =>
    [toggle, ...navLinks].filter((el) => {
      if (!el || el.hasAttribute("hidden")) return false;
      return el.getClientRects().length > 0;
    });

  const setOpen = (isOpen) => {
    body.classList.toggle("is-menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    if (isOpen) {
      nav.hidden = false;
      nav.removeAttribute("aria-hidden");
      lastFocused = document.activeElement;
      // Defer focus so it isn't stolen back by the toggle click
      setTimeout(() => {
        navLinks[0]?.focus();
      }, 0);
    } else {
      nav.hidden = true;
      nav.setAttribute("aria-hidden", "true");
      if (lastFocused instanceof HTMLElement) {
        lastFocused.focus();
      } else {
        toggle.focus();
      }
    }
  };

  const isOpen = () => body.classList.contains("is-menu-open");

  toggle.addEventListener("click", () => {
    setOpen(!isOpen());
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen()) setOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
