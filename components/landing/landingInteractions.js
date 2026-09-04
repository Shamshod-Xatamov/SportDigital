export function initLandingInteractions() {
  const cleanups = [];
  const on = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    cleanups.push(() => target.removeEventListener(event, handler, options));
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* Header scroll holati */
  const header = document.querySelector("[data-header]");
  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };
  syncHeader();
  on(window, "scroll", syncHeader, { passive: true });

  /* Mobil menyu */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menyuni ochish");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mobileMenu) {
    on(menuToggle, "click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Menyuni ochish" : "Menyuni yopish",
      );
      mobileMenu.hidden = isOpen;
      document.body.classList.toggle("menu-open", !isOpen);
    });
    mobileMenu.querySelectorAll("a").forEach((link) => on(link, "click", closeMenu));
    on(window, "resize", () => {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  /* Scroll reveal */
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.delay || 0);
          window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
    cleanups.push(() => revealObserver.disconnect());
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* Hero counterlar */
  const counters = document.querySelectorAll("[data-counter]");
  const runCounter = (el) => {
    const target = Number(el.dataset.counter || 0);
    if (prefersReducedMotion || !target) {
      el.textContent = String(target);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach((el) => counterObserver.observe(el));
    cleanups.push(() => counterObserver.disconnect());
  } else {
    counters.forEach((el) => {
      el.textContent = el.dataset.counter || "";
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
