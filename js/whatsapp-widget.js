/**
 * Yelikar's Medical & General Stores - WhatsApp Floating Widget
 * Handles toggle animations, quick-reply chips, outside click, and message encoding
 */

(function () {
  'use strict';

  const PHONE_NUMBER = '917558485831';

  function initWhatsAppWidget() {
    const fab = document.getElementById('waFab');
    const card = document.getElementById('waCard');
    const closeBtn = document.getElementById('waCardClose');
    const chips = document.querySelectorAll('.wa-chip');
    const startBtn = document.getElementById('waStartBtn');
    const customInput = document.getElementById('waCustomInput');

    if (!fab || !card) return;

    let isOpen = false;

    function openCard() {
      isOpen = true;
      card.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      if (customInput) customInput.focus();
    }

    function closeCard() {
      isOpen = false;
      card.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
    }

    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen) {
        closeCard();
      } else {
        openCard();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeCard();
      });
    }

    document.addEventListener('click', function (e) {
      if (isOpen && !card.contains(e.target) && !fab.contains(e.target)) {
        closeCard();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeCard();
      }
    });

    function sendWhatsAppMessage(text) {
      const message = encodeURIComponent(text || 'Hello Yelikar\'s Medical, I have an inquiry about medicines.');
      const url = `https://wa.me/${PHONE_NUMBER}?text=${message}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      closeCard();
    }

    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        const query = this.getAttribute('data-msg') || this.textContent.trim();
        sendWhatsAppMessage(query);
      });
    });

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        const text = customInput ? customInput.value.trim() : '';
        sendWhatsAppMessage(text || 'Hello Yelikar\'s Medical, I would like to enquire about your services.');
      });
    }

    if (customInput) {
      customInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const text = customInput.value.trim();
          sendWhatsAppMessage(text || 'Hello Yelikar\'s Medical, I would like to enquire about your services.');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsAppWidget);
  } else {
    initWhatsAppWidget();
  }
})();
