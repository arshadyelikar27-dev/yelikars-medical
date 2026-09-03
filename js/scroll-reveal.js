/**
 * Yelikar's Medical & General Stores - Scroll Reveal & Stagger Animation
 * Uses IntersectionObserver for high performance GPU-accelerated reveals
 */

(function () {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-init').forEach(el => {
        el.classList.add('reveal-visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll(
      '.reveal-init, .service-card, .trust-badge-card, .gallery-card, .testimonial-card, .section-header, .contact-detail-card, .map-container'
    );

    elementsToReveal.forEach((el, index) => {
      if (!el.classList.contains('reveal-init')) {
        el.classList.add('reveal-init');
      }
      revealObserver.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
})();
