/**
 * Yelikar's Medical & General Stores - Main Controller
 * Integrated with Lenis Smooth Scrolling, Lightbox, Mobile Nav, and Performance Optimizations
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initLenis();
    initHeaderScrollFallback();
    initMobileNav();
    initGalleryLightbox();
    initFooterYear();
  });

  /* --------------------------------------------------------------------------
     1. Lenis Smooth Scroll Engine & Anchor Navigation
     -------------------------------------------------------------------------- */
  function initLenis() {
    if (typeof Lenis === "undefined") {
      initStandardSmoothScroll();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      initStandardSmoothScroll();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Optimized header scroll state via Lenis event
    const header = document.getElementById("mainHeader");
    if (header) {
      lenis.on("scroll", ({ scroll }) => {
        header.classList.toggle("scrolled", scroll > 40);
      });
    }

    // Lenis Smooth Anchor Navigation
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight =
            document.getElementById("mainHeader")?.offsetHeight || 72;
          lenis.scrollTo(targetEl, {
            offset: -headerHeight,
            duration: 1.15,
          });
        }
      });
    });
  }

  /* Fallback smooth scroll if Lenis is disabled or reduced-motion is active */
  function initStandardSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight =
            document.getElementById("mainHeader")?.offsetHeight || 72;
          const targetPos =
            targetEl.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;
          window.scrollTo({
            top: targetPos,
            behavior: "smooth",
          });
        }
      });
    });
  }

  /* Fallback header scroll detection */
  function initHeaderScrollFallback() {
    if (window.lenis) return;
    const header = document.getElementById("mainHeader");
    if (!header) return;

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            header.classList.toggle("scrolled", window.scrollY > 40);
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Overlay Toggle
     -------------------------------------------------------------------------- */
  function initMobileNav() {
    const menuBtn = document.getElementById("menuToggleBtn");
    const overlay = document.getElementById("mobileNavOverlay");
    const closeBtn = document.getElementById("mobileNavCloseBtn");
    const links = document.querySelectorAll(".mobile-nav-link");

    if (!menuBtn || !overlay) return;

    function toggleMenu() {
      const isActive = menuBtn.classList.toggle("is-active");
      overlay.classList.toggle("is-active", isActive);
      document.body.style.overflow = isActive ? "hidden" : "";
      menuBtn.setAttribute("aria-expanded", isActive ? "true" : "false");

      if (window.lenis) {
        if (isActive) {
          window.lenis.stop();
        } else {
          window.lenis.start();
        }
      }
    }

    menuBtn.addEventListener("click", toggleMenu);
    if (closeBtn) {
      closeBtn.addEventListener("click", toggleMenu);
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("is-active");
        overlay.classList.remove("is-active");
        document.body.style.overflow = "";
        menuBtn.setAttribute("aria-expanded", "false");
        if (window.lenis) {
          window.lenis.start();
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Gallery Lightbox Modal
     -------------------------------------------------------------------------- */
  function initGalleryLightbox() {
    const modal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("lightboxCloseBtn");
    const cards = document.querySelectorAll(".gallery-card");

    if (!modal || !lightboxImg || !cards.length) return;

    function openLightbox(imgSrc, caption) {
      lightboxImg.src = imgSrc;
      lightboxCaption.textContent = caption || "";
      modal.classList.add("is-active");
      document.body.style.overflow = "hidden";
      if (window.lenis) {
        window.lenis.stop();
      }
    }

    function closeLightbox() {
      modal.classList.remove("is-active");
      document.body.style.overflow = "";
      if (window.lenis) {
        window.lenis.start();
      }
      setTimeout(() => {
        lightboxImg.src = "";
      }, 300);
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        const caption =
          card.getAttribute("data-caption") ||
          card.querySelector(".gallery-title")?.textContent;
        if (img) {
          openLightbox(img.src, caption);
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeLightbox);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-active")) {
        closeLightbox();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Footer Dynamic Year
     -------------------------------------------------------------------------- */
  function initFooterYear() {
    const yearEl = document.getElementById("currentYear");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }
})();
